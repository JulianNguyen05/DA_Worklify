import React, { useEffect, useRef, useState } from "react";
import SimpleTemplate, { SIMPLE_TEMPLATE_CONFIG } from "../../../components/cv-builder/templates/SimpleTemplate";
import HarvardTemplate, { HARVARD_TEMPLATE_CONFIG } from "../../../components/cv-builder/templates/HarvardTemplate";
import ProfessionalTemplate, { PROFESSIONAL_TEMPLATE_CONFIG } from "../../../components/cv-builder/templates/ProfessionalTemplate";
import { CV_PAGE_WIDTH_PX, CV_PAGE_HEIGHT_PX, applyCvPageBreaks } from "../../../components/cv-builder/templates/cvTemplateCore";

// Trùng TEMPLATE_REGISTRY của CVBuilderPage — nếu sau này thêm template mới,
// nhớ sửa cả 2 chỗ (hoặc tách ra file dùng chung, vd templates/templateRegistry.js).
const TEMPLATE_REGISTRY = {
  simple: { component: SimpleTemplate, config: SIMPLE_TEMPLATE_CONFIG },
  harvard: { component: HarvardTemplate, config: HARVARD_TEMPLATE_CONFIG },
  professional: { component: ProfessionalTemplate, config: PROFESSIONAL_TEMPLATE_CONFIG },
};

/**
 * Route "trần" — không header/sidebar/auth. CHỈ để PlaywrightCvPdfExportAdapter
 * (backend-core) mở bằng Chromium headless và chụp PDF. Không tự fetch API:
 * data được bơm thẳng qua window.__WORKLIFY_SET_CV_DATA__ (server-to-server,
 * không cần auth). Sau khi render + ngắt trang + font ổn định, tự báo
 * window.__WORKLIFY_CV_READY__ = true để backend biết đã page.pdf() được.
 */
const CvPrintPage = () => {
  const [cvData, setCvData] = useState(null);
  const paperRef = useRef(null);

  useEffect(() => {
    window.__WORKLIFY_SET_CV_DATA__ = (data) => setCvData(data);
    return () => { delete window.__WORKLIFY_SET_CV_DATA__; };
  }, []);

  useEffect(() => {
    if (!cvData || !paperRef.current) return;
    let cancelled = false;

    const settle = async () => {
      // Đợi font load thật xong — nếu không Chromium có thể đo sai độ rộng
      // chữ trước khi font kịp áp dụng (đúng lỗi đã gặp ở captureCvThumbnail.js).
      if (document.fonts?.ready) {
        try { await document.fonts.ready; } catch (_) {}
      }
      if (cancelled) return;

      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (cancelled || !paperRef.current) return;

      // Bắt buộc ngắt trang giống hệt live editor/thumbnail — nếu không,
      // Chromium cắt PDF đúng theo biên A4 vật lý, có thể chặt ngang giữa
      // 1 mục kinh nghiệm/học vấn.
      applyCvPageBreaks(paperRef.current, { pageHeight: CV_PAGE_HEIGHT_PX });

      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (cancelled) return;

      window.__WORKLIFY_CV_READY__ = true;
    };

    settle();
    return () => { cancelled = true; };
  }, [cvData]);

  if (!cvData) return null; // đang chờ Playwright bơm data qua evaluate

  const SelectedTemplate =
    TEMPLATE_REGISTRY[cvData.settings?.template]?.component ?? SimpleTemplate;

  return (
    <div
      ref={paperRef}
      className="cv-paper-root bg-white"
      style={{ width: `${CV_PAGE_WIDTH_PX}px`, minHeight: `${CV_PAGE_HEIGHT_PX}px` }}
    >
      <SelectedTemplate
        cvData={cvData}
        selectedSection={null}
        onSectionClick={() => {}}
        onUpdateSectionData={() => {}}
      />
    </div>
  );
};

export default CvPrintPage;