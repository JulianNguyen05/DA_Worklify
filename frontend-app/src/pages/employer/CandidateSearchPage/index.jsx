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
      <div className="bg-gradient-to-r from-brand-600 to-accent-500 rounded-3xl p-8 sm:p-12 text-white shadow-raised relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center gap-3">
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
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập kỹ năng, chức danh, ngôn ngữ lập trình..."
                className="block w-full pl-11 pr-4 py-4 rounded-xl border-0 bg-white text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-accent-500/40 transition-shadow text-lg shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white hover:bg-slate-50 text-brand-600 font-bold px-8 py-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 whitespace-nowrap"
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
        <div className="flex items-center gap-2 text-slate-500 font-medium px-2">
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
            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-full text-sm font-medium hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors whitespace-nowrap"
          >
            {skill}
          </button>
        ))}
      </div>

      {/* KẾT QUẢ TÌM KIẾM */}
      <div>
        <div className="flex justify-between items-end mb-6 px-2">
          <h2 className="text-xl font-bold text-slate-900">
            {hasSearched
              ? `Kết quả tìm kiếm cho "${keyword}"`
              : "Ứng viên nổi bật"}
            <span className="ml-2 text-sm font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {candidates.length}
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="card p-6 animate-pulse flex gap-4"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-slate-100 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded w-3/4 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="card border-dashed p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Không tìm thấy ứng viên
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Không có ứng viên nào khớp với từ khóa "{keyword}". Hãy thử tìm
              kiếm với các từ khóa ngắn gọn hoặc phổ biến hơn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="card p-6 hover:shadow-xl hover:border-brand-200 transition-all group flex flex-col justify-between"
              >
                <div className="flex gap-5 items-start mb-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-center text-brand-600 font-bold text-xl shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    {getInitials(candidate.fullName || candidate.name)}
                  </div>

                  {/* Thông tin chính */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">
                        {candidate.fullName ||
                          candidate.name ||
                          "Ứng viên ẩn danh"}
                      </h3>
                      {candidate.experience && (
                        <span className="bg-[#F0FDFA] text-accent-600 px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                          {candidate.experience} KN
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-500 mt-1 truncate">
                      {candidate.headline ||
                        candidate.title ||
                        candidate.summary ||
                        "Chưa cập nhật chức danh"}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
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
                          className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    {candidate.skills?.length > 4 && (
                      <span className="px-2 py-1 text-slate-400 text-xs font-medium">
                        +{candidate.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                  <button
                    onClick={() => handleViewProfile(candidate)}
                    className="flex-1 bg-white text-brand-600 border-2 border-brand-200 hover:bg-brand-50 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
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
                      className="flex-1 bg-brand-600 text-white border-2 border-brand-600 hover:bg-brand-700 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
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
