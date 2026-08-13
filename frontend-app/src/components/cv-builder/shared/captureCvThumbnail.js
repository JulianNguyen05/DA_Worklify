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
 *  5. [FIX MỚI] Không chỉ freeze WIDTH của ô editable mà còn freeze cả HEIGHT
 *     của div cha trực tiếp (row wrapper) chứa nó. dom-to-image-more chụp bằng
 *     cách nhúng DOM vào <svg><foreignObject>, và chiều cao các row CSS Grid
 *     "auto" (vd cặp label/value contactInfo dùng grid-cols-[auto_1fr]) đôi khi
 *     KHÔNG được engine chụp ảnh tính lại đúng khi label wrap xuống nhiều dòng
 *     (vd "Date of Birth" -> 2 dòng) -> item kế tiếp bị vẽ đè lên ngay dưới dòng
 *     đầu của item trước, dù ở live editor layout hoàn toàn bình thường.
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

  // [FIX MỚI #5] dom-to-image-more chụp bằng cách nhúng DOM vào <svg><foreignObject>,
  // và chiều cao các "auto" row của CSS Grid (vd: cặp label/value contactInfo dùng
  // grid-cols-[auto_1fr]) đôi khi KHÔNG được tính lại đúng khi label wrap xuống nhiều
  // dòng (vd "Date of Birth" -> 2 dòng). Trên màn hình sống, browser tự giãn chiều cao
  // row bình thường; nhưng trong ảnh SVG, row đó có thể bị vẽ với chiều cao 1 dòng ->
  // item kế tiếp ("Gender") bị đè lên ngay dưới dòng đầu của item trước.
  // -> Đóng băng luôn HEIGHT của div cha trực tiếp (row wrapper) chứa mỗi ô editable,
  //    dựa theo chiều cao đã đo trên bản sống, y hệt cách đang freeze WIDTH bên dưới.
  const frozenParents = new Set();

  clonedEditables.forEach((el, i) => {
    const rect = liveRects[i];
    if (rect) {
      // [FIX MỚI #6] Debug bằng clone hiện trên màn hình (__CV_DEBUG_CLONE__) đã xác
      // nhận: DOM của clone TRƯỚC khi chụp hoàn toàn đúng, không đè chữ. Vậy lệch
      // xảy ra ngay trong lúc dom-to-image-more tự vẽ ảnh cuối — nhiều khả năng do
      // font web (vd Roboto) không được nhúng/áp dụng chính xác 100% ở bước đó,
      // khiến bề rộng chữ thực tế khi vẽ hơi khác so với lúc đo trên clone sống.
      // Trước đây khoá width KHÍT ĐÚNG bằng độ rộng đo được -> chỉ cần lệch 1-2px là
      // đủ ép chữ xuống dòng. Giờ cộng thêm buffer để hấp thụ sai số đó.
      const bufferedWidth = Math.ceil(rect.width) + 10;
      el.style.width = `${bufferedWidth}px`;
      el.style.minWidth = `${bufferedWidth}px`;
      el.style.maxWidth = `${bufferedWidth}px`;
      el.style.boxSizing = 'border-box';
    }

    // Freeze height của row wrapper (div cha trực tiếp) theo chiều cao thật đã đo
    // trên bản sống, để dom-to-image không tự tính lại (và tính sai) height của
    // grid row khi nội dung wrap nhiều dòng.
    const liveParent = liveEditables[i]?.parentElement;
    const clonedParent = el.parentElement;
    if (liveParent && clonedParent && !frozenParents.has(clonedParent)) {
      const parentRect = liveParent.getBoundingClientRect();
      // minHeight thay vì height cứng: tránh cắt mất nội dung nếu có phần tử nào
      // đó (icon, nút ẩn...) thật ra cần cao hơn chút so với lúc đo. Cộng thêm buffer
      // nhỏ làm lớp phòng hộ thứ 2, phòng khi vẫn còn lệch 1 dòng dù đã buffer width.
      clonedParent.style.minHeight = `${Math.ceil(parentRect.height) + 4}px`;
      frozenParents.add(clonedParent);
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

  // [DEBUG TẠM THỜI] Đặt window.__CV_DEBUG_CLONE__ = true trong console trước khi
  // bấm "Lưu" (hoặc nút tạo lại ảnh xem trước) để clone hiện NGAY GIỮA MÀN HÌNH thay
  // vì trốn off-screen. Mục đích: xem bằng mắt layout của clone (SAU khi đã freeze
  // width/height) TRƯỚC khi dom-to-image xử lý nó.
  // - Nếu clone hiện ra đã bị đè chữ giống ảnh chụp -> bug nằm ở bước freeze (code
  //   JS của mình), CHƯA liên quan gì tới dom-to-image.
  // - Nếu clone hiện ra layout ĐÚNG HOÀN TOÀN (không đè chữ) -> bug chỉ xảy ra khi
  //   dom-to-image serialize sang ảnh, cần đổi cách khác (vd chuyển layout label/value
  //   từ CSS Grid sang <table>, hoặc đổi thư viện chụp ảnh).
  if (typeof window !== 'undefined' && window.__CV_DEBUG_CLONE__) {
    clone.style.position = 'fixed';
    clone.style.top = '20px';
    clone.style.left = '20px';
    clone.style.zIndex = '999999';
    clone.style.outline = '4px solid red';
    clone.style.background = '#fff';
  }

  document.body.appendChild(clone);

  if (typeof window !== 'undefined' && window.__CV_DEBUG_CLONE__) {
    // eslint-disable-next-line no-console
    console.log('[CV_DEBUG_CLONE] Clone đang hiện trên màn hình (viền đỏ). Sẽ tự ẩn sau 8 giây.');
  }

  return {
    clone,
    cleanup: () => {
      if (typeof window !== 'undefined' && window.__CV_DEBUG_CLONE__) {
        // Giữ clone thêm 8 giây để kịp nhìn/inspect bằng devtools rồi mới gỡ.
        setTimeout(() => clone.remove(), 8000);
        return;
      }
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