/**
 * captureCvThumbnail.js
 *
 * Pipeline dùng CHUNG để tạo ảnh thumbnail từ khung giấy CV (paperRef).
 * Dùng ở bất kỳ đâu cần "chụp lại" CV thành ảnh: CVBuilderPage (lúc lưu),
 * CVManagerPage (nút "Tạo lại ảnh xem trước"), v.v. Tránh copy-paste logic
 * chụp ảnh ở nhiều nơi rồi lệch nhau (chỗ nhớ fix, chỗ quên fix).
 *
 * Gộp lại 4 lớp fix đã áp dụng trước đó (xem lịch sử trao đổi):
 *  1. Tắt hẳn CSS transition trước khi chụp -> tránh chụp phải khung hình
 *     đang chuyển động dở dang (gây vỡ layout/chữ đè nhau).
 *  2. loadExternalStyleSheet: true -> nhúng đúng font Google Fonts vào ảnh,
 *     tránh ảnh bị fallback sang font khác (sai độ rộng chữ -> sai xuống dòng).
 *  3. Mô phỏng ngắt trang A4 (page-break) ngay trước khi chụp, dựa theo cơ chế
 *     phân trang cũ (setupPagination) nhưng chỉ áp dụng có chủ đích cho ảnh
 *     thumbnail, không đụng vào màn hình đang thiết kế trực tiếp.
 *  4. [FIX MỚI] Không bao giờ chụp trực tiếp trên khung giấy đang sống
 *     (paperRef.current) nữa. Các ô nhập liệu trong khung đó là contentEditable
 *     -> DOM bị trình duyệt mutate trực tiếp lúc gõ, lệch với state React, và
 *     các phần tử `inline-block` (label contactInfo, v.v.) có độ rộng "co giãn
 *     theo nội dung" (intrinsic width) không ổn định. Khi dom-to-image-more tự
 *     đo lại layout để build ảnh, độ rộng đo được đôi khi khác với độ rộng đã
 *     wrap trên màn hình -> chữ tràn ra ngoài, đè lên dòng/khối bên dưới.
 *     -> Giải pháp: clone khung ra 1 bản offscreen (ẩn, không tương tác), ĐÓNG
 *     BĂNG (freeze) độ rộng thật của từng ô editable bằng chính kích thước nó
 *     đang hiển thị live, rồi gỡ hẳn contenteditable trên bản clone (ảnh không
 *     cần sửa được nữa). Áp page-break + chụp ảnh trên bản clone này. Khung
 *     đang thiết kế trực tiếp (live editor) không hề bị đụng tới.
 */
import domtoimage from 'dom-to-image-more';
import { CV_PAGE_HEIGHT_PX, applyCvPageBreaks } from '../templates/cvTemplateCore';

const PAGE_GAP_PX = 40; // khoảng trắng hiển thị giữa 2 trang trong ảnh thumbnail

/**
 * Tạo 1 bản clone offscreen của rootElement, "đóng băng" độ rộng render thật
 * của từng ô contentEditable (đo trên bản sống), rồi gỡ contenteditable trên
 * bản clone. Trả về { clone, cleanup } — cleanup() gỡ clone khỏi DOM.
 */
function createFrozenOffscreenClone(rootElement) {
  const liveEditables = Array.from(rootElement.querySelectorAll('[contenteditable]'));
  // Đo kích thước THẬT đang hiển thị (đúng như mắt người dùng thấy) trước khi clone,
  // vì sau khi gắn vào clone offscreen, các phép đo lại (getBoundingClientRect) trên
  // clone có thể sai lệch với bản sống (khác context flex/flow xung quanh).
  const liveRects = liveEditables.map((el) => el.getBoundingClientRect());

  const clone = rootElement.cloneNode(true);
  const clonedEditables = Array.from(clone.querySelectorAll('[contenteditable]'));

  clonedEditables.forEach((el, i) => {
    const rect = liveRects[i];
    if (rect) {
      // Ép cứng đúng box đã wrap sẵn trên màn hình -> loại bỏ hoàn toàn khả năng
      // engine chụp ảnh tự đo lại rồi ra kích thước khác (nguyên nhân chính gây
      // chữ tràn / đè lên khối bên dưới).
      el.style.width = `${rect.width}px`;
      el.style.minWidth = `${rect.width}px`;
      el.style.maxWidth = `${rect.width}px`;
      el.style.boxSizing = 'border-box';
    }
    // Gỡ hẳn contenteditable trên bản clone: ảnh chụp không cần sửa được nữa,
    // và loại bỏ mọi artefact trình duyệt để lại lúc gõ (text node rỗng, caret,
    // trạng thái composition...) có thể khiến engine chụp ảnh vẽ nhân đôi nội dung.
    el.removeAttribute('contenteditable');
    // Gộp lại các text node liền kề / dọn node rỗng còn sót lại từ lúc edit-in-place.
    el.normalize?.();
  });

  clone.style.position = 'fixed';
  clone.style.top = '0';
  clone.style.left = '-99999px';
  clone.style.zIndex = '-1';
  clone.style.pointerEvents = 'none';
  clone.classList.add('wl-no-transition');

  document.body.appendChild(clone);

  return {
    clone,
    cleanup: () => {
      clone.remove();
    },
  };
}

/**
 * Chụp ảnh thumbnail từ khung giấy CV, có tách trang (page-break) giống bản in thật.
 *
 * @param {HTMLElement} rootElement - phần tử DOM khung giấy CV (vd: paperRef.current)
 * @param {Object} [options]
 * @param {boolean} [options.withPageBreaks=true] - có mô phỏng ngắt trang hay không
 * @param {number} [options.quality=0.85]
 * @param {string} [options.bgcolor='#ffffff']
 * @returns {Promise<Blob>}
 */
export async function captureCvThumbnail(rootElement, options = {}) {
  const { withPageBreaks = true, quality = 0.85, bgcolor = '#ffffff' } = options;

  if (!rootElement) throw new Error('captureCvThumbnail: rootElement không tồn tại');

  if (document.fonts?.ready) {
    try { await document.fonts.ready; } catch (_) { /* bỏ qua, vẫn tiếp tục chụp */ }
  }
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const { clone, cleanup } = createFrozenOffscreenClone(rootElement);

  // Đợi 1 nhịp để width/minWidth/maxWidth vừa ép cứng phản ánh đúng vào layout
  // của clone trước khi tiếp tục đo đạc / ngắt trang / chụp.
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const restorePageBreaks = withPageBreaks
    ? applyCvPageBreaks(clone, { pageGap: PAGE_GAP_PX }).restore
    : null;

  // Đợi thêm 1 nhịp để marginTop vừa gán phản ánh đúng vào layout trước khi đo kích thước
  if (withPageBreaks) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  try {
    const blob = await domtoimage.toBlob(clone, {
      quality,
      bgcolor,
      width: clone.offsetWidth,
      height: clone.offsetHeight,
      loadExternalStyleSheet: true,
    });
    return blob;
  } finally {
    restorePageBreaks?.();
    cleanup();
  }
}

/**
 * Tiện ích: chụp thumbnail rồi bọc luôn thành File (sẵn để upload).
 * @param {HTMLElement} rootElement
 * @param {string} fileName - vd: `cv_thumbnail_${cvId}.jpg`
 * @param {Object} [options] - xem captureCvThumbnail
 */
export async function captureCvThumbnailAsFile(rootElement, fileName, options = {}) {
  const blob = await captureCvThumbnail(rootElement, options);
  return new File([blob], fileName, { type: 'image/jpeg' });
}