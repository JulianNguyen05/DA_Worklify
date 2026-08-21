import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Award,
  Filter,
  FileText,
  User,
  Mail,
  Phone,
  Loader2,
  Sparkles,
} from "lucide-react";
import employerService from "../../../features/employer/employerService";
import Toast from "../../../components/common/Toast";

export default function CandidateSearchPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: "" });

  // Nạp ngẫu nhiên một vài ứng viên khi vừa vào trang
  useEffect(() => {
    handleSearch(null, { isInitialLoad: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [SỬA] Nhận keywordOverride để tránh đọc state "keyword" cũ khi bấm Lọc nhanh
  const handleSearch = async (e, options = {}) => {
    if (e) e.preventDefault();
    const { isInitialLoad = false, keywordOverride } = options;
    const searchKeyword =
      keywordOverride !== undefined ? keywordOverride : keyword;

    if (!isInitialLoad && !searchKeyword.trim()) {
      setStatusMsg({
        type: "warning",
        message: "Vui lòng nhập từ khóa tìm kiếm.",
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(!isInitialLoad);

    try {
      const response = await employerService.searchCandidates(
        searchKeyword,
        0,
        20,
      );
      const data = response.data?.content || response.data || [];
      setCandidates(data);
    } catch (error) {
      console.error(error);
      setStatusMsg({
        type: "error",
        message: "Lỗi tải dữ liệu hoặc API Backend chưa sẵn sàng!",
      });
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // [MỚI] Điều hướng sang trang xem hồ sơ đầy đủ
  const handleViewProfile = (candidate) => {
    if (!candidate.userId) {
      setStatusMsg({
        type: "error",
        message: "Ứng viên này thiếu userId, không thể xem hồ sơ.",
      });
      return;
    }
    navigate(`/employer/candidates/${candidate.userId}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {statusMsg.message && (
        <Toast
          type={statusMsg.type}
          message={statusMsg.message}
          onClose={() => setStatusMsg({ type: null, message: "" })}
        />
      )}

      {/* HEADER & THANH TÌM KIẾM — đồng bộ gradient Worklify #2563EB → #14B8A6 */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-3xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-white" />
            Tìm kiếm nhân tài
          </h1>
          <p className="text-white/85 text-lg mb-8">
            Khám phá kho dữ liệu hàng ngàn ứng viên chất lượng cao, phù hợp với
            mọi vị trí mà doanh nghiệp bạn đang tìm kiếm.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập kỹ năng, chức danh, ngôn ngữ lập trình..."
                className="block w-full pl-11 pr-4 py-4 rounded-xl border-0 bg-white text-[#0F172A] placeholder-gray-400 focus:ring-4 focus:ring-[#14B8A6]/40 transition-shadow text-lg shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white hover:bg-[#F8FAFC] text-[#2563EB] font-bold px-8 py-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 whitespace-nowrap"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Tìm ứng viên"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* BỘ LỌC NHANH */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 text-[#64748B] font-medium px-2">
          <Filter className="w-4 h-4" /> Lọc nhanh:
        </div>
        {[
          "Java",
          "ReactJS",
          "Node.js",
          "Spring Boot",
          "Python",
          "Thực tập sinh",
        ].map((skill) => (
          <button
            key={skill}
            onClick={() => {
              setKeyword(skill);
              handleSearch(null, { keywordOverride: skill });
            }}
            className="px-4 py-1.5 bg-white border border-[#E2E8F0] text-[#64748B] rounded-full text-sm font-medium hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-[#BFDBFE] transition-colors whitespace-nowrap"
          >
            {skill}
          </button>
        ))}
      </div>

      {/* KẾT QUẢ TÌM KIẾM */}
      <div>
        <div className="flex justify-between items-end mb-6 px-2">
          <h2 className="text-xl font-bold text-[#0F172A]">
            {hasSearched
              ? `Kết quả tìm kiếm cho "${keyword}"`
              : "Ứng viên nổi bật"}
            <span className="ml-2 text-sm font-medium text-[#64748B] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full">
              {candidates.length}
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-[#E2E8F0] animate-pulse flex gap-4"
              >
                <div className="w-16 h-16 bg-[#F1F5F9] rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-[#F1F5F9] rounded w-1/3" />
                  <div className="h-4 bg-[#F1F5F9] rounded w-1/2" />
                  <div className="h-4 bg-[#F1F5F9] rounded w-3/4 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] border-dashed p-16 text-center">
            <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-[#CBD5E1]" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">
              Không tìm thấy ứng viên
            </h3>
            <p className="text-[#64748B] max-w-md mx-auto">
              Không có ứng viên nào khớp với từ khóa "{keyword}". Hãy thử tìm
              kiếm với các từ khóa ngắn gọn hoặc phổ biến hơn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:shadow-xl hover:border-[#BFDBFE] transition-all group flex flex-col justify-between"
              >
                <div className="flex gap-5 items-start mb-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl flex items-center justify-center text-[#2563EB] font-extrabold text-xl shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    {getInitials(candidate.fullName || candidate.name)}
                  </div>

                  {/* Thông tin chính */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-bold text-[#0F172A] truncate group-hover:text-[#2563EB] transition-colors">
                        {candidate.fullName ||
                          candidate.name ||
                          "Ứng viên ẩn danh"}
                      </h3>
                      {candidate.experience && (
                        <span className="bg-[#F0FDFA] text-[#0D9488] px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                          {candidate.experience} KN
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-[#64748B] mt-1 truncate">
                      {candidate.headline ||
                        candidate.title ||
                        candidate.summary ||
                        "Chưa cập nhật chức danh"}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-[#64748B]">
                      {(candidate.address || candidate.location) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />{" "}
                          {candidate.address || candidate.location}
                        </span>
                      )}
                      {candidate.gender && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />{" "}
                          {candidate.gender === "MALE" ? "Nam" : "Nữ"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Kỹ năng */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {(
                      candidate.skills || [
                        "Giao tiếp",
                        "Làm việc nhóm",
                        "Thích nghi nhanh",
                      ]
                    )
                      .slice(0, 4)
                      .map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    {candidate.skills?.length > 4 && (
                      <span className="px-2 py-1 text-[#94A3B8] text-xs font-medium">
                        +{candidate.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9] mt-auto">
                  <button
                    onClick={() => handleViewProfile(candidate)}
                    className="flex-1 bg-white text-[#2563EB] border-2 border-[#BFDBFE] hover:bg-[#EFF6FF] font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" /> Xem hồ sơ
                  </button>
                  {candidate.cvId && (
                    <button
                      onClick={() =>
                        window.open(
                          `http://localhost:8080/api/v1/files/cv/${candidate.cvId}`,
                          "_blank",
                        )
                      }
                      className="flex-1 bg-[#2563EB] text-white border-2 border-[#2563EB] hover:bg-[#1D4ED8] font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" /> Tải CV
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
