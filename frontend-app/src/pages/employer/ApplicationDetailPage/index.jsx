import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import employerService from "../../../features/employer/employerService";
import authService from "../../../features/auth/authService";
import Button from "../../../components/common/Button";
import Toast from "../../../components/common/Toast";
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Briefcase,
  Eye,
} from "lucide-react";
import { AppStatusBadge } from "../../../components/shared/StatusBadges";
import {
  APPLICATION_STATUS_LABEL,
  STATUS_ACTIONS,
  getNextStatuses,
} from "../../../components/shared/applicationFlow";

const NEXT_ACTION_LONG_LABEL = {
  REVIEWED: "Đánh dấu đã xem",
  INTERVIEW_SCHEDULED: "Mời phỏng vấn",
  ACCEPTED: "Nhận ứng viên",
  REJECTED: "Loại hồ sơ",
};

export default function ApplicationDetailPage() {
  const { id } = useParams(); // ID của application
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: "" });

  // 1. TẢI DỮ LIỆU THẬT TỪ BACKEND
  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        // Lấy companyId của nhà tuyển dụng đang đăng nhập
        const user = authService.getCurrentUser();
        if (user?.userId) {
          const profileRes = await employerService.getCompanyProfile(
            user.userId,
          );
          setCompanyId(profileRes.data?.id);
        }

        // Gọi API lấy chi tiết đơn ứng tuyển
        const res = await employerService.getApplicationById(id);
        setApplication(res.data);
      } catch (error) {
        setStatusMsg({
          type: "error",
          message: "Không thể tải chi tiết hồ sơ từ hệ thống.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  // 2. XỬ LÝ CẬP NHẬT TRẠNG THÁI (DUYỆT/LOẠI)
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const handleAction = async (newStatus) => {
    if (newStatus === "REJECTED" && !window.confirm("Loại hồ sơ này? Thao tác không thể hoàn tác.")) return;
    setUpdatingStatus(newStatus);
    try {
      if (!companyId) throw new Error("Không xác định được công ty sở hữu.");

      const res = await employerService.updateApplicationStatus(companyId, id, newStatus);
      setStatusMsg({
        type: "success",
        message: `Đã chuyển hồ sơ sang: ${APPLICATION_STATUS_LABEL[newStatus]}`,
      });

      // Backend trả đơn đã cập nhật (kèm nextStatuses mới)
      setApplication((prev) => ({ ...prev, ...(res?.data || { status: newStatus, nextStatuses: undefined }) }));
    } catch (error) {
      setStatusMsg({
        type: "error",
        message: error.response?.data?.message || error.message || "Cập nhật trạng thái thất bại.",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  // [MỚI] Điều hướng sang trang xem hồ sơ đầy đủ của ứng viên
  const handleViewProfile = () => {
    if (!application?.candidateId) {
      setStatusMsg({
        type: "error",
        message: "Không xác định được ứng viên để xem hồ sơ.",
      });
      return;
    }
    navigate(`/employer/candidates/${application.candidateId}`);
  };

  const getStatusBadge = (status) => (
    <AppStatusBadge status={status} label={APPLICATION_STATUS_LABEL[status]} />
  );

  // Nếu đang gọi API
  if (isLoading) {
    return (
      <div className="p-20 text-center text-slate-500 flex flex-col items-center">
        <Clock className="w-10 h-10 animate-spin mb-4 text-brand-500" />
        <p className="font-medium text-lg">Đang tải thông tin hồ sơ...</p>
      </div>
    );
  }

  // Nếu API lỗi hoặc không tìm thấy
  if (!application) {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Không tìm thấy dữ liệu hồ sơ này!
      </div>
    );
  }

  const handleViewCV = async () => {
    try {
      // Gọi service tải file
      const blobData = await employerService.downloadCvFile(application.cvId);

      // Tạo một URL tạm thời cho file PDF trên trình duyệt
      const fileUrl = window.URL.createObjectURL(
        new Blob([blobData], { type: "application/pdf" }),
      );

      // Mở sang một Tab mới để xem PDF
      window.open(fileUrl, "_blank");
    } catch (error) {
      console.error(error);
      setStatusMsg({
        type: "error",
        message: "Lỗi! Không thể tải được file CV từ máy chủ.",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {statusMsg.message && (
        <Toast
          type={statusMsg.type}
          message={statusMsg.message}
          onClose={() => setStatusMsg({ type: null, message: "" })}
        />
      )}

      {/* HEADER: INFO CHUNG */}
      <div className="card flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-brand-600 flex items-center gap-1 text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
          </button>

          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-full text-brand-600">
              <User className="w-6 h-6" />
            </div>
            {application.candidateName ||
              `Ứng viên ID: ${application.candidateId}`}
          </h1>

          <p className="text-slate-600 mt-2 flex items-center gap-2 text-md">
            <Briefcase className="w-4.5 h-4.5 text-slate-400" />
            Ứng tuyển vị trí:{" "}
            <span className="font-bold text-slate-800">
              {application.jobTitle || "Chưa cập nhật"}
            </span>
          </p>

          {/* [MỚI] Nút xem hồ sơ đầy đủ của ứng viên */}
          <button
            onClick={handleViewProfile}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white text-brand-600 border-2 border-brand-100 hover:bg-brand-50 hover:border-brand-300 rounded-xl text-sm font-bold transition-colors"
          >
            <User className="w-4 h-4" /> Xem hồ sơ ứng viên
          </button>
        </div>

        <div className="flex flex-col items-end gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[200px]">
          {getStatusBadge(application.status)}
          <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Ngày nộp:{" "}
            {application.appliedAt
              ? new Date(application.appliedAt).toLocaleDateString("vi-VN")
              : "N/A"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CỘT TRÁI: LIÊN HỆ & DUYỆT */}
        <div className="md:col-span-1 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
              Thông tin liên hệ
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-sm font-bold text-slate-800 break-all">
                    {application.candidateEmail || "Đang cập nhật..."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Phone className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                    Số điện thoại
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {application.candidatePhone || "Đang cập nhật..."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
              Quyết định
            </h3>
            {/* Các bước hợp lệ theo quy trình: Chờ duyệt → Đã xem → Mời phỏng vấn → Nhận / Loại */}
            <div className="flex flex-col gap-3">
              {getNextStatuses(application).length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
                  Hồ sơ đã có kết quả: <b>{APPLICATION_STATUS_LABEL[application.status]}</b>.
                </p>
              ) : (
                getNextStatuses(application).map((next) => (
                  <Button
                    key={next}
                    variant={STATUS_ACTIONS[next].variant}
                    isLoading={updatingStatus === next}
                    onClick={() => handleAction(next)}
                    className="w-full"
                  >
                    {next === "ACCEPTED" && <CheckCircle className="w-5 h-5" />}
                    {next === "REJECTED" && <XCircle className="w-5 h-5" />}
                    {next === "REVIEWED" && <Eye className="w-5 h-5" />}
                    {next === "INTERVIEW_SCHEDULED" && <Clock className="w-5 h-5" />}
                    {NEXT_ACTION_LONG_LABEL[next]}
                  </Button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: COVER LETTER & CV */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              Thư giới thiệu (Cover Letter)
            </h3>
            {application.coverLetter ? (
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-inner">
                {application.coverLetter}
              </p>
            ) : (
              <p className="text-slate-400 text-sm italic bg-slate-50 p-4 rounded-xl text-center">
                Ứng viên không viết thư giới thiệu.
              </p>
            )}
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-brand-500" /> Hồ sơ đính kèm
              (CV)
            </h3>
            {application.cvFileName ? (
              <div className="flex items-center justify-between p-5 bg-brand-50/40 border border-brand-100 rounded-xl hover:border-brand-300 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-100 rounded-xl text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base flex items-center gap-2">
                      {/* Dùng split để cắt chuỗi theo dấu '/', sau đó lấy phần tử cuối cùng (pop) */}
                      {application.cvFileName
                        ? application.cvFileName
                            .split("/")
                            .pop()
                            .split("\\")
                            .pop()
                        : "Hồ sơ đính kèm"}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Tài liệu đính kèm
                    </p>
                  </div>
                </div>
                {/* Đường dẫn tải CV thực tế. Bạn cấu hình URL trỏ về API /api/v1/files/ của bạn nhé */}
                <button
                  onClick={handleViewCV}
                  className="card px-5 py-2.5 text-sm font-bold text-brand-600 hover:bg-brand-50 hover:border-brand-300 transition-all flex items-center gap-2 cursor-pointer"
                >
                  Tải / Xem CV
                </button>
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic bg-slate-50 p-4 rounded-xl text-center">
                Ứng viên không đính kèm file CV.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
