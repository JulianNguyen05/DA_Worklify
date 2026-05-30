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
} from "lucide-react";

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
  const handleAction = async (newStatus) => {
    try {
      if (!companyId) throw new Error("Không xác định được công ty sở hữu.");

      await employerService.updateApplicationStatus(companyId, id, newStatus);
      setStatusMsg({
        type: "success",
        message: `Đã cập nhật trạng thái thành: ${newStatus}`,
      });

      // Cập nhật giao diện ngay lập tức
      setApplication({ ...application, status: newStatus });
    } catch (error) {
      setStatusMsg({ type: "error", message: "Cập nhật trạng thái thất bại." });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Chấp nhận
          </span>
        );
      case "REJECTED":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> Từ chối
          </span>
        );
      case "REVIEWED":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> Đã xem
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Chờ duyệt
          </span>
        );
    }
  };

  // Nếu đang gọi API
  if (isLoading) {
    return (
      <div className="p-20 text-center text-gray-500 flex flex-col items-center">
        <Clock className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-indigo-600 flex items-center gap-1 text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
          </button>

          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-full text-indigo-600">
              <User className="w-6 h-6" />
            </div>
            {application.candidateName ||
              `Ứng viên ID: ${application.candidateId}`}
          </h1>

          <p className="text-gray-600 mt-2 flex items-center gap-2 text-md">
            <Briefcase className="w-4.5 h-4.5 text-gray-400" />
            Ứng tuyển vị trí:{" "}
            <span className="font-bold text-gray-800">
              {application.jobTitle || "Chưa cập nhật"}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-[200px]">
          {getStatusBadge(application.status)}
          <span className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
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
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
              Thông tin liên hệ
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-sm font-bold text-gray-800 break-all">
                    {application.candidateEmail || "Đang cập nhật..."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                    Số điện thoại
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {application.candidatePhone || "Đang cập nhật..."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
              Quyết định
            </h3>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => handleAction("ACCEPTED")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex justify-center items-center gap-2 py-3 rounded-xl shadow-sm font-bold"
                disabled={
                  application.status === "ACCEPTED" ||
                  application.status === "REJECTED"
                }
              >
                <CheckCircle className="w-5 h-5" /> Chấp nhận ứng viên
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAction("REJECTED")}
                className="w-full text-rose-600 border-2 border-rose-100 hover:bg-rose-50 flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-colors"
                disabled={
                  application.status === "ACCEPTED" ||
                  application.status === "REJECTED"
                }
              >
                <XCircle className="w-5 h-5" /> Từ chối hồ sơ
              </Button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: COVER LETTER & CV */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              Thư giới thiệu (Cover Letter)
            </h3>
            {application.coverLetter ? (
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-inner">
                {application.coverLetter}
              </p>
            ) : (
              <p className="text-gray-400 text-sm italic bg-gray-50 p-4 rounded-xl text-center">
                Ứng viên không viết thư giới thiệu.
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileText className="w-5 h-5 text-indigo-500" /> Hồ sơ đính kèm
              (CV)
            </h3>
            {application.cvFileName ? (
              <div className="flex items-center justify-between p-5 bg-indigo-50/40 border border-indigo-100 rounded-xl hover:border-indigo-300 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base flex items-center gap-2">
                      {/* Dùng split để cắt chuỗi theo dấu '/', sau đó lấy phần tử cuối cùng (pop) */}
                      {application.cvFileName
                        ? application.cvFileName
                            .split("/")
                            .pop()
                            .split("\\")
                            .pop()
                        : "Hồ sơ đính kèm"}
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Tài liệu đính kèm
                    </p>
                  </div>
                </div>
                {/* Đường dẫn tải CV thực tế. Bạn cấu hình URL trỏ về API /api/v1/files/ của bạn nhé */}
                <button
                  onClick={handleViewCV}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  Tải / Xem CV
                </button>
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic bg-gray-50 p-4 rounded-xl text-center">
                Ứng viên không đính kèm file CV.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
