import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Toast from "../../../components/common/Toast";
import candidateService from "../../../features/candidate/candidateService";
import authService from "../../../features/auth/authService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .wl-manager * { box-sizing: border-box; font-family: 'Inter', sans-serif; }

  .wl-manager {
    min-height: 100vh;
    background: #F0F4FF;
  }

  /* Hero */
  .wl-hero {
    background: linear-gradient(135deg, #2563EB 0%, #14B8A6 100%);
    padding: 48px 0 80px;
    position: relative;
    overflow: hidden;
  }
  .wl-hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 320px; height: 320px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
  }
  .wl-hero::after {
    content: '';
    position: absolute;
    bottom: -80px; left: 10%;
    width: 200px; height: 200px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }
  .wl-hero-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
    position: relative;
    z-index: 1;
  }
  .wl-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .wl-hero h1 {
    font-size: 36px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 10px;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }
  .wl-hero p {
    color: rgba(255,255,255,0.78);
    font-size: 15px;
    margin: 0;
  }
  .wl-hero-actions {
    margin-top: 28px;
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }
  .wl-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    color: #2563EB;
    font-weight: 700;
    font-size: 14px;
    padding: 11px 22px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(0,0,0,0.12);
    font-family: 'Inter', sans-serif;
  }
  .wl-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.16);
  }
  .wl-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.15);
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    padding: 11px 20px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.3);
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .wl-btn-ghost:hover { background: rgba(255,255,255,0.22); }

  /* Stats */
  .wl-stats-strip {
    background: #fff;
    border-bottom: 1px solid #E2E8F0;
  }
  .wl-stats-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    gap: 0;
  }
  .wl-stat {
    padding: 20px 32px 20px 0;
    border-right: 1px solid #F1F5F9;
    margin-right: 32px;
  }
  .wl-stat:last-child { border-right: none; }
  .wl-stat-num {
    font-size: 26px;
    font-weight: 800;
    color: #0F172A;
    line-height: 1;
  }
  .wl-stat-num span { color: #2563EB; }
  .wl-stat-label {
    font-size: 12px;
    color: #94A3B8;
    font-weight: 500;
    margin-top: 4px;
  }

  /* Body */
  .wl-body {
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 32px 60px;
  }
  .wl-section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  .wl-section-title {
    font-size: 20px;
    font-weight: 700;
    color: #0F172A;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .wl-section-title-dot {
    width: 6px; height: 6px;
    background: linear-gradient(135deg, #2563EB, #14B8A6);
    border-radius: 50%;
    flex-shrink: 0;
  }
  .wl-count-badge {
    background: #EFF6FF;
    color: #2563EB;
    font-size: 12px;
    font-weight: 700;
    padding: 2px 9px;
    border-radius: 20px;
  }

  /* Grid */
  .wl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
  }

  /* Card */
  .wl-card {
    background: #fff;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    overflow: hidden;
    transition: box-shadow 0.25s, border-color 0.25s, transform 0.25s;
  }
  .wl-card:hover {
    box-shadow: 0 12px 40px rgba(37,99,235,0.13);
    border-color: #BFDBFE;
    transform: translateY(-3px);
  }

  /* Thumbnail */
  .wl-card-thumb {
    height: 290px;
    background: linear-gradient(160deg, #F0F4FF 0%, #E0E7FF 100%);
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .wl-card-thumb img {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: top;
    display: block;
    transition: transform 0.35s ease;
  }
  .wl-card:hover .wl-card-thumb img { transform: scale(1.03); }

  /* Glass overlay */
  .wl-glass-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15,23,42,0);
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s, backdrop-filter 0.3s;
  }
  .wl-card-thumb:hover .wl-glass-overlay {
    background: rgba(15,23,42,0.38);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
  .wl-glass-cta {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .wl-card-thumb:hover .wl-glass-cta { opacity: 1; transform: translateY(0); }
  .wl-glass-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(255,255,255,0.93);
    border: none;
    border-radius: 10px;
    padding: 11px 22px;
    font-size: 14px;
    font-weight: 700;
    color: #2563EB;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    transition: background 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .wl-glass-btn:hover { background: #fff; }

  /* Placeholder */
  .wl-thumb-placeholder {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 100%; gap: 12px;
  }
  .wl-thumb-icon {
    width: 56px; height: 56px;
    background: linear-gradient(135deg, #2563EB 0%, #14B8A6 100%);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
  }
  .wl-thumb-placeholder p { font-size: 12px; color: #94A3B8; margin: 0; font-weight: 500; }

  /* Card body */
  .wl-card-body { padding: 16px 18px 18px; }
  .wl-card-name {
    font-size: 15px; font-weight: 700; color: #0F172A;
    margin: 0 0 4px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .wl-card-date { font-size: 12px; color: #94A3B8; margin: 0 0 14px; }
  .wl-card-actions { display: flex; gap: 8px; }
  .wl-action-edit {
    flex: 1;
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
    color: #fff; border: none; border-radius: 8px;
    padding: 9px 12px; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: opacity 0.2s, transform 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .wl-action-edit:hover { opacity: 0.9; transform: translateY(-1px); }

  /* [MỚI] Nút tải PDF số — cạnh nút Sửa/Xoá trong wl-card-actions */
  .wl-action-pdf {
    display: inline-flex; align-items: center; justify-content: center;
    background: #EFF6FF; border: 1px solid #BFDBFE; color: #2563EB;
    border-radius: 8px; padding: 9px 13px;
    font-size: 13px; cursor: pointer; transition: background 0.2s, opacity 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .wl-action-pdf:hover { background: #DBEAFE; }
  .wl-action-pdf:disabled { opacity: 0.4; cursor: not-allowed; }

  .wl-action-delete {
    display: inline-flex; align-items: center; justify-content: center;
    background: #FFF1F2; border: 1px solid #FECDD3; color: #E11D48;
    border-radius: 8px; padding: 9px 13px;
    font-size: 13px; cursor: pointer; transition: background 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .wl-action-delete:hover { background: #FFE4E6; }

  /* Empty */
  .wl-empty {
    background: #fff; border: 2px dashed #BFDBFE;
    border-radius: 20px; padding: 64px 32px; text-align: center;
  }
  .wl-empty-icon {
    width: 72px; height: 72px;
    background: linear-gradient(135deg, #EFF6FF 0%, #E0F2FE 100%);
    border-radius: 20px; font-size: 32px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; border: 1px solid #BFDBFE;
  }
  .wl-empty h3 { font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 8px; }
  .wl-empty p { font-size: 14px; color: #64748B; margin: 0 0 24px; max-width: 320px; margin-inline: auto; line-height: 1.6; }
  .wl-empty-cta {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #2563EB 0%, #14B8A6 100%);
    color: #fff; border: none; border-radius: 12px;
    padding: 13px 28px; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: opacity 0.2s, transform 0.2s;
    box-shadow: 0 4px 18px rgba(37,99,235,0.3);
    font-family: 'Inter', sans-serif;
  }
  .wl-empty-cta:hover { opacity: 0.92; transform: translateY(-1px); }

  /* Skeleton */
  .wl-skeleton {
    background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 8px;
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .wl-card-skeleton {
    background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .wl-hero { padding: 32px 0 60px; }
    .wl-hero h1 { font-size: 26px; }
    .wl-body, .wl-hero-inner, .wl-stats-inner { padding-left: 16px; padding-right: 16px; }
    .wl-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
    .wl-card-thumb { height: 200px; }
  }
  @media (max-width: 400px) {
    .wl-grid { grid-template-columns: 1fr; }
  }

  /* [MỚI] Modal "Nhập từ PDF" */
  .wl-import-body { padding: 24px 28px 28px; }
  .wl-import-hint { font-size: 13px; color: #64748B; margin: 0 0 20px; line-height: 1.6; }

  .wl-tpl-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 22px; }
  .wl-tpl-card {
    border: 2px solid #E2E8F0; border-radius: 12px; padding: 16px 10px;
    text-align: center; cursor: pointer; transition: all 0.2s ease; background: #fff;
  }
  .wl-tpl-card:hover { border-color: #BFDBFE; background: #F8FAFF; }
  .wl-tpl-card.selected {
    border-color: #2563EB;
    background: linear-gradient(135deg, #EFF6FF 0%, #ECFDF5 100%);
    box-shadow: 0 0 0 1px #2563EB;
  }
  .wl-tpl-card-icon { font-size: 26px; margin-bottom: 8px; }
  .wl-tpl-card-name { font-size: 13px; font-weight: 700; color: #0F172A; }

  .wl-dropzone {
    border: 2px dashed #CBD5E1; border-radius: 12px; padding: 28px 16px;
    text-align: center; cursor: pointer; transition: all 0.2s ease; background: #F8FAFC;
  }
  .wl-dropzone:hover { border-color: #2563EB; background: #EFF6FF; }
  .wl-dropzone.has-file { border-color: #14B8A6; background: #F0FDFA; }
  .wl-dropzone-icon { font-size: 28px; margin-bottom: 8px; }
  .wl-dropzone-text { font-size: 13px; color: #475569; font-weight: 500; }
  .wl-dropzone-filename { font-size: 13px; color: #0F172A; font-weight: 700; margin-top: 4px; }

  .wl-import-error {
    margin-top: 14px; padding: 10px 14px; border-radius: 8px;
    background: #FEF2F2; border: 1px solid #FECACA; color: #B91C1C; font-size: 13px;
  }

  .wl-import-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
  .wl-import-cancel-btn {
    padding: 10px 18px; border-radius: 10px; font-size: 14px; font-weight: 600;
    background: #F1F5F9; color: #475569; border: none; cursor: pointer;
  }
  .wl-import-submit-btn {
    padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 700; color: #fff;
    background: linear-gradient(135deg, #2563EB 0%, #14B8A6 100%); border: none; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .wl-import-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SkeletonCard = () => (
  <div className="wl-card-skeleton">
    <div className="wl-skeleton" style={{ height: 290 }} />
    <div style={{ padding: "16px 18px 18px" }}>
      <div
        className="wl-skeleton"
        style={{ height: 16, width: "70%", marginBottom: 8 }}
      />
      <div
        className="wl-skeleton"
        style={{ height: 12, width: "45%", marginBottom: 16 }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <div
          className="wl-skeleton"
          style={{ height: 36, flex: 1, borderRadius: 8 }}
        />
        <div
          className="wl-skeleton"
          style={{ height: 36, width: 44, borderRadius: 8 }}
        />
      </div>
    </div>
  </div>
);

const buildFileUrl = (path) => {
  if (!path) return null;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `http://localhost:8080${normalized}`;
};

const CvCard = ({ cv, onEdit, onDelete }) => {
  const thumbSrc = buildFileUrl(cv.thumbnailPath);
  // [MỚI] PDF số (text thật) sinh song song với thumbnail lúc Lưu CV — xem
  // digitalPdfPath trong CvDocumentResponse (backend) / handleSaveCv (CVBuilderPage).
  const pdfSrc = buildFileUrl(cv.digitalPdfPath);

  const handleDownloadPdf = (e) => {
    e.stopPropagation();
    if (!pdfSrc) return;
    // Mở tab mới thay vì dùng <a download> — thẻ download bị trình duyệt bỏ qua
    // (chỉ mở xem thay vì tải) khi URL khác origin với frontend (localhost:8080
    // backend vs localhost:3000/5173 frontend), nên window.open là cách chắc ăn
    // để ít nhất người dùng xem/tải được file qua UI có sẵn của trình duyệt.
    window.open(pdfSrc, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="wl-card">
      <div className="wl-card-thumb" onClick={onEdit}>
        {thumbSrc ? (
          <img src={thumbSrc} alt={cv.fileName || "CV"} />
        ) : (
          <div className="wl-thumb-placeholder">
            <div className="wl-thumb-icon">📝</div>
            <p>Chưa có ảnh xem trước</p>
          </div>
        )}
        <div className="wl-glass-overlay">
          <div className="wl-glass-cta">
            <button className="wl-glass-btn" onClick={onEdit}>
              Chỉnh sửa CV
            </button>
          </div>
        </div>
      </div>
      <div className="wl-card-body">
        <h4 className="wl-card-name">{cv.fileName || "CV_Tu_Tao"}</h4>
        <p className="wl-card-date">
          Cập nhật{" "}
          {new Date(cv.createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <div className="wl-card-actions">
          <button className="wl-action-edit" onClick={onEdit}>
            Chỉnh sửa
          </button>
          <button
            className="wl-action-pdf"
            onClick={handleDownloadPdf}
            disabled={!pdfSrc}
            title={pdfSrc ? "Tải file PDF" : "Chưa có PDF số cho CV này"}
          >
            📄
          </button>
          <button
            className="wl-action-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Xóa CV"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

// [MỚI] Modal "Nhập CV từ file PDF" — chỉ áp dụng cho PDF tải xuống trực tiếp
// từ Worklify. Cùng cơ chế prefillData/prefillTemplate với ProfileToCvPicker:
// CVBuilderPage tự merge vào defaultData/defaultLayout của template đã chọn.
const IMPORT_TEMPLATES = [
  { key: "simple", icon: "📄", name: "Simple" },
  { key: "harvard", icon: "🎓", name: "Harvard" },
  { key: "professional", icon: "💼", name: "Professional" },
];

const ImportPdfModal = ({ isOpen, onClose, userId, navigate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("simple");
  const [file, setFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const resetState = () => {
    setSelectedTemplate("simple");
    setFile(null);
    setError("");
    setIsImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    if (isImporting) return; // không cho đóng modal giữa lúc đang gọi API
    resetState();
    onClose();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setError("");
    if (selected && selected.type !== "application/pdf") {
      setError("Vui lòng chọn file PDF.");
      setFile(null);
      return;
    }
    setFile(selected || null);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Vui lòng chọn file PDF đã tải xuống từ Worklify.");
      return;
    }
    setIsImporting(true);
    setError("");
    try {
      const apiResponse = await candidateService.importDigitalPdf(userId, file);
      const { rawText } = apiResponse.data; // bóc payload khỏi ApiResponse wrapper
      const parsedCvData = JSON.parse(rawText); // {settings, layout, data}

      resetState();
      onClose();

      navigate("/candidate/cv-builder", {
        state: {
          prefillData: parsedCvData.data,
          prefillTemplate: selectedTemplate,
        },
      });
    } catch (err) {
      console.error("Lỗi khi import PDF:", err);
      const message =
        err?.response?.data?.message ||
        "Không thể đọc file này. Chỉ hỗ trợ file PDF tải trực tiếp từ Worklify.";
      setError(message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nhập CV từ file PDF">
      <div className="wl-import-body">
        <p className="wl-import-hint">
          Chỉ áp dụng cho file PDF <strong>tải xuống trực tiếp từ Worklify</strong>{" "}
          (không hỗ trợ PDF từ nguồn khác). Chọn mẫu bạn muốn dùng, nội dung CV
          sẽ được điền lại — bạn có thể chỉnh sửa trước khi lưu.
        </p>

        <div className="wl-tpl-grid">
          {IMPORT_TEMPLATES.map((tpl) => (
            <div
              key={tpl.key}
              className={`wl-tpl-card ${selectedTemplate === tpl.key ? "selected" : ""}`}
              onClick={() => setSelectedTemplate(tpl.key)}
            >
              <div className="wl-tpl-card-icon">{tpl.icon}</div>
              <div className="wl-tpl-card-name">{tpl.name}</div>
            </div>
          ))}
        </div>

        <div
          className={`wl-dropzone ${file ? "has-file" : ""}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="wl-dropzone-icon">{file ? "✅" : "📎"}</div>
          <div className="wl-dropzone-text">
            {file ? "Đã chọn file:" : "Nhấn để chọn file PDF"}
          </div>
          {file && <div className="wl-dropzone-filename">{file.name}</div>}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {error && <div className="wl-import-error">{error}</div>}

        <div className="wl-import-actions">
          <button className="wl-import-cancel-btn" onClick={handleClose} disabled={isImporting}>
            Hủy
          </button>
          <button className="wl-import-submit-btn" onClick={handleSubmit} disabled={isImporting}>
            {isImporting ? "Đang xử lý..." : "Nhập CV"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const CVManagerPage = () => {
  const navigate = useNavigate();
  const currentUser = authService?.getCurrentUser
    ? authService.getCurrentUser()
    : null;
  const userId = currentUser?.userId || currentUser?.id;

  const [cvList, setCvList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const loadCvs = async () => {
    if (!userId) return;
    try {
      setIsFetching(true);
      const res = await candidateService.getCvs(userId);
      setCvList(Array.isArray(res) ? res : res?.data || []);
    } catch {
      setStatus({ type: "error", message: "Không thể tải danh sách CV." });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadCvs();
  }, [userId]);

  useEffect(() => {
    if (!status.type) return;
    const t = setTimeout(() => setStatus({ type: null, message: "" }), 3500);
    return () => clearTimeout(t);
  }, [status]);

  const generatedCvs = cvList.filter((cv) => cv.isGenerated);

  const handleDelete = async (cvId) => {
    if (!window.confirm("Xóa CV này? Thao tác không thể hoàn tác.")) return;
    try {
      await candidateService.deleteCv(userId, cvId);
      setStatus({ type: "success", message: "Đã xóa CV thành công." });
      await loadCvs();
    } catch {
      setStatus({ type: "error", message: "Xóa CV thất bại." });
    }
  };

  const lastUpdated =
    generatedCvs.length > 0
      ? new Date(
          Math.max(...generatedCvs.map((cv) => new Date(cv.createdAt))),
        ).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
      : "—";

  if (!userId)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F0F4FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#64748B", fontFamily: "Inter, sans-serif" }}>
          Vui lòng đăng nhập để xem CV của bạn.
        </p>
      </div>
    );

  return (
    <>
      <style>{styles}</style>
      <div className="wl-manager">
        {status.type && (
          <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999 }}>
            <Toast type={status.type} message={status.message} />
          </div>
        )}

        {/* Hero */}
        <div className="wl-hero">
          <div className="wl-hero-inner">
            <div className="wl-hero-badge">✦ CV của tôi</div>
            <h1>Hồ sơ CV của bạn</h1>
            <p>
              Tạo, chỉnh sửa và quản lý CV chuyên nghiệp ngay trên Worklify.
            </p>
            <div className="wl-hero-actions">
              <button
                className="wl-btn-primary"
                onClick={() => navigate("/candidate/cv-templates")}
              >
                + Tạo CV mới
              </button>
              <button
                className="wl-btn-ghost"
                onClick={() => setIsImportModalOpen(true)}
              >
                📥 Nhập từ PDF
              </button>
              {!isFetching && generatedCvs.length > 0 && (
                <span className="wl-btn-ghost" style={{ cursor: "default" }}>
                  📄 {generatedCvs.length} CV đang có
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="wl-stats-strip">
          <div className="wl-stats-inner">
            <div className="wl-stat">
              <div className="wl-stat-num">
                <span>{generatedCvs.length}</span>
              </div>
              <div className="wl-stat-label">CV đã tạo</div>
            </div>
            <div className="wl-stat">
              <div className="wl-stat-num">
                {generatedCvs.filter((cv) => cv.thumbnailPath).length}
              </div>
              <div className="wl-stat-label">Có ảnh xem trước</div>
            </div>
            {/* [MỚI] Thống kê số CV đã có PDF số — cùng dạng với ô "Có ảnh xem trước" */}
            <div className="wl-stat">
              <div className="wl-stat-num">
                {generatedCvs.filter((cv) => cv.digitalPdfPath).length}
              </div>
              <div className="wl-stat-label">Có PDF số</div>
            </div>
            <div className="wl-stat">
              <div className="wl-stat-num">{lastUpdated}</div>
              <div className="wl-stat-label">Cập nhật gần nhất</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="wl-body">
          <div className="wl-section-head">
            <h2 className="wl-section-title">
              <span className="wl-section-title-dot" />
              CV đã tạo trên Worklify
              {!isFetching && generatedCvs.length > 0 && (
                <span className="wl-count-badge">{generatedCvs.length}</span>
              )}
            </h2>
          </div>

          {isFetching ? (
            <div className="wl-grid">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : generatedCvs.length === 0 ? (
            <div className="wl-empty">
              <div className="wl-empty-icon">✨</div>
              <h3>Chưa có CV nào</h3>
              <p>
                Bắt đầu tạo CV chuyên nghiệp đầu tiên với Worklify CV Builder —
                miễn phí, đẹp và dễ dùng.
              </p>
              <button
                className="wl-empty-cta"
                onClick={() => navigate("/candidate/cv-templates")}
              >
                ✦ Bắt đầu tạo CV
              </button>
            </div>
          ) : (
            <div className="wl-grid">
              {generatedCvs.map((cv) => (
                <CvCard
                  key={cv.id}
                  cv={cv}
                  onEdit={() => navigate(`/candidate/cv-builder/${cv.id}`)}
                  onDelete={() => handleDelete(cv.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ImportPdfModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        userId={userId}
        navigate={navigate}
      />
    </>
  );
};

export default CVManagerPage;
