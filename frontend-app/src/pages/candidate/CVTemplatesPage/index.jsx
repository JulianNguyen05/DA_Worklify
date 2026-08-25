import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../features/auth/authService";
import candidateService from "../../../features/candidate/candidateService";
import Toast from "../../../components/common/Toast";
import Modal from "../../../components/common/Modal";
import {
  LayoutGrid,
  Briefcase,
  LayoutTemplate,
  GraduationCap,
  Upload,
  UserRound,
  FilePlus2,
} from "lucide-react";
import { mapProfileToCvData } from "../../../components/cv-builder/shared/mapProfileToCvData";
import { SIMPLE_TEMPLATE_CONFIG } from "../../../components/cv-builder/templates/SimpleTemplate";
import { HARVARD_TEMPLATE_CONFIG } from "../../../components/cv-builder/templates/HarvardTemplate";
import { PROFESSIONAL_TEMPLATE_CONFIG } from "../../../components/cv-builder/templates/ProfessionalTemplate";

// Tra config (defaultData/defaultSettings/defaultLayout) theo id mẫu — dùng để build
// prefillData đúng schema của TỪNG mẫu (không phải object tự chế như trước).
const TEMPLATE_CONFIG_REGISTRY = {
  simple: SIMPLE_TEMPLATE_CONFIG,
  professional: PROFESSIONAL_TEMPLATE_CONFIG,
  harvard: HARVARD_TEMPLATE_CONFIG,
};

// 1. CẤU HÌNH DỮ LIỆU CHÍNH XÁC 3 MẪU CV (Đã bỏ mảng colors, chỉ giữ 1 màu mặc định)
const TEMPLATES = [
  {
    id: "simple",
    name: "Mẫu Tiêu Chuẩn",
    categories: ["Tiêu chuẩn"],
    color: "#1f2937", // Màu mặc định: Đen xám
    thumbnail: "http://localhost:8080/uploads/templates/simple.png",
  },
  {
    id: "professional",
    name: "Mẫu Chuyên Nghiệp",
    categories: ["Chuyên nghiệp"],
    color: "#1e3a8a", // Màu mặc định: Xanh Navy
    thumbnail: "http://localhost:8080/uploads/templates/professional.png",
  },
  {
    id: "harvard",
    name: "Mẫu Harvard",
    categories: ["Harvard"],
    color: "#000000", // Màu mặc định: Đen
    thumbnail: "http://localhost:8080/uploads/templates/harvard.png",
  },
];

// Danh mục bộ lọc
const CATEGORIES = [
  { id: "Tất cả", icon: LayoutGrid },
  { id: "Tiêu chuẩn", icon: LayoutTemplate },
  { id: "Chuyên nghiệp", icon: Briefcase },
  { id: "Harvard", icon: GraduationCap },
];

const CVTemplatesPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [isLoading, setIsLoading] = useState(false); // loading khi lấy từ Profile
  const [isImporting, setIsImporting] = useState(false); // loading khi import PDF Worklify
  const [error, setError] = useState(null);

  // Modal chọn nguồn dữ liệu + mẫu đang được chọn để tạo CV
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const cvUploadInputRef = useRef(null);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 3000); // 10s thay vì 3.5s
    return () => clearTimeout(t);
  }, [error]);

  // Lọc template theo danh mục
  const filteredTemplates =
    activeCategory === "Tất cả"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.categories.includes(activeCategory));

  const getUserId = () => {
    const currentUser = authService?.getCurrentUser
      ? authService.getCurrentUser()
      : null;
    return currentUser?.userId || currentUser?.id;
  };

  // 2. BẤM "Sử dụng mẫu này" -> chỉ MỞ MODAL hỏi nguồn dữ liệu, chưa điều hướng đi đâu cả
  const handleUseTemplate = (template) => {
    setError(null);
    setSelectedTemplate(template);
    setIsSourceModalOpen(true);
  };

  const closeSourceModal = () => {
    if (isLoading || isImporting) return; // đang xử lý dở thì không cho đóng
    setIsSourceModalOpen(false);
    setSelectedTemplate(null);
  };

  // 3a. Nguồn: LẤY TỪ HỒ SƠ (logic cũ, giữ nguyên hành vi)
  const handleChooseFromProfile = async () => {
    const userId = getUserId();
    if (!userId) {
      setError("Vui lòng đăng nhập để tạo CV.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const tplConfig =
      TEMPLATE_CONFIG_REGISTRY[selectedTemplate.id] || SIMPLE_TEMPLATE_CONFIG;
    let prefillData;

    try {
      const profileRes = await candidateService.getFullProfile(userId);
      // candidateService trả nguyên response.data (bao gồm envelope {code, message, data}
      // của backend) — CandidateProfileFullResponse thật sự nằm ở field "data" bên trong.
      const profileFull = profileRes?.data || profileRes;
      prefillData = mapProfileToCvData(profileFull, tplConfig.defaultData);
    } catch (err) {
      // Chưa có hồ sơ ứng viên (chưa từng điền ProfilePage) hoặc lỗi mạng tạm thời —
      // vẫn cho tạo CV bình thường, chỉ là không có gì để điền sẵn.
      console.warn("Không lấy được hồ sơ để điền sẵn CV, tạo CV trống:", err);
    }

    setIsLoading(false);
    setIsSourceModalOpen(false);
    navigate("/candidate/cv-builder", {
      state: { prefillData, prefillTemplate: selectedTemplate.id },
    });
  };

  // 3b. Nguồn: NHẬP TỪ FILE PDF WORKLIFY — mở file picker ẩn.
  // [MỚI] Thay cho cơ chế upload ảnh/CV cũ (OCR + AI qua extractCv/mapParsedCvToCvData).
  // Chỉ chấp nhận PDF tải xuống trực tiếp từ Worklify (cùng cơ chế importDigitalPdf
  // với ImportPdfModal ở CVManagerPage) — rawText đã là JSON đúng schema CV, không
  // cần OCR/NER nên độ chính xác tuyệt đối so với cơ chế cũ.
  const handleChooseUpload = () => {
    cvUploadInputRef.current?.click();
  };

  const handleUploadFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTemplate) return;

    if (file.type !== "application/pdf") {
      setError("Vui lòng chọn file PDF.");
      if (cvUploadInputRef.current) cvUploadInputRef.current.value = "";
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setError("Vui lòng đăng nhập để tạo CV.");
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const apiResponse = await candidateService.importDigitalPdf(userId, file);
      const { rawText } = apiResponse.data; // bóc payload khỏi ApiResponse wrapper
      const parsedCvData = JSON.parse(rawText); // {settings, layout, data}

      setIsSourceModalOpen(false);
      navigate("/candidate/cv-builder", {
        state: {
          prefillData: parsedCvData.data,
          prefillTemplate: selectedTemplate.id,
        },
      });
    } catch (err) {
      console.error("Lỗi khi import PDF:", err);
      const message =
        err?.response?.data?.message ||
        "Không thể đọc file này. Chỉ hỗ trợ file PDF tải trực tiếp từ Worklify.";

      // Đóng modal chọn nguồn trước — không để nó đứng yên như "không phản hồi".
      setIsSourceModalOpen(false);
      setSelectedTemplate(null);
      setError(message);
    } finally {
      setIsImporting(false);
      if (cvUploadInputRef.current) cvUploadInputRef.current.value = "";
    }
  };

  // 3c. Nguồn: MẪU TRỐNG — không set prefillData, CVBuilderPage tự dùng defaultData
  const handleChooseBlank = () => {
    setIsSourceModalOpen(false);
    navigate("/candidate/cv-builder", {
      state: { prefillTemplate: selectedTemplate.id },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white min-h-screen">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Mẫu CV xin việc tiếng Việt chuẩn 2026
        </h1>
        <p className="text-gray-600">
          Tuyển chọn {TEMPLATES.length} mẫu CV đa dạng phong cách, giúp bạn tạo
          dấu ấn cá nhân và kết nối mạnh mẽ hơn với nhà tuyển dụng.
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Toast type="error" message={error} />
        </div>
      )}

      {/* FILTER BAR (Các nút hình viên thuốc) */}
      <div className="flex flex-wrap items-center gap-3 mb-10 pb-4 border-b border-gray-100">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm border transition-all duration-200 ${
                isActive
                  ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.id}
            </button>
          );
        })}
      </div>

      {/* TEMPLATES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="flex flex-col gap-3">
            {/* VÙNG CHỨA ẢNH (Nền xám nhạt, border bo góc) */}
            <div className="group relative bg-[#f3f4f6] p-4 rounded-xl border border-gray-200 transition-all hover:border-[#2563EB] hover:shadow-md">
              {/* Thumbnail CV khổ A4 (Tỷ lệ 21/29.7) */}
              <div className="relative w-full aspect-[21/29.7] bg-white shadow-sm overflow-hidden border border-gray-200">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover object-top"
                />

                {/* Overlay khi Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold py-2 px-6 rounded-full transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                  >
                    Sử dụng mẫu này
                  </button>
                </div>
              </div>
            </div>

            {/* VÙNG THÔNG TIN MẪU */}
            <div className="px-1 mt-2">
              {/* Tên mẫu */}
              <h3 className="text-[17px] font-bold text-gray-800 mb-2">
                {template.name}
              </h3>

              {/* Các Tag phân loại */}
              <div className="flex flex-wrap gap-2">
                {template.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CHỌN NGUỒN DỮ LIỆU KHI TẠO CV */}
      <Modal
        isOpen={isSourceModalOpen}
        onClose={closeSourceModal}
        title={`Tạo CV với mẫu "${selectedTemplate?.name || ""}"`}
      >
        <div className="p-2 flex flex-col gap-3 min-w-[320px] sm:min-w-[420px]">
          <p className="text-sm text-gray-500 mb-1">
            Chọn cách bạn muốn điền nội dung cho CV:
          </p>

          <input
            ref={cvUploadInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleUploadFileChange}
          />

          <button
            onClick={handleChooseUpload}
            disabled={isImporting || isLoading}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-colors text-left disabled:opacity-55 disabled:cursor-not-allowed"
          >
            <span className="shrink-0 w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </span>
            <span>
              <span className="block font-semibold text-gray-800">
                {isImporting ? "Đang xử lý..." : "Nhập từ file PDF Worklify"}
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                Chỉ áp dụng cho PDF tải xuống trực tiếp từ Worklify
              </span>
            </span>
          </button>

          <button
            onClick={handleChooseFromProfile}
            disabled={isLoading || isImporting}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-colors text-left disabled:opacity-55 disabled:cursor-not-allowed"
          >
            <span className="shrink-0 w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserRound className="w-5 h-5" />
            </span>
            <span>
              <span className="block font-semibold text-gray-800">
                {isLoading ? "Đang lấy hồ sơ..." : "Lấy nội dung từ hồ sơ"}
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                Điền sẵn từ thông tin ProfilePage đã có
              </span>
            </span>
          </button>

          <button
            onClick={handleChooseBlank}
            disabled={isImporting || isLoading}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-colors text-left disabled:opacity-55 disabled:cursor-not-allowed"
          >
            <span className="shrink-0 w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
              <FilePlus2 className="w-5 h-5" />
            </span>
            <span>
              <span className="block font-semibold text-gray-800">
                Bắt đầu từ mẫu trống
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                Tự nhập toàn bộ nội dung
              </span>
            </span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CVTemplatesPage;
