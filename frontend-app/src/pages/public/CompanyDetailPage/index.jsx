import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Globe,
  Briefcase,
  ExternalLink,
  Loader2,
  Building2,
} from "lucide-react";

// Import chính xác 2 file service của bạn
import jobService from "../../../features/job/jobService";
import employerService from "../../../features/employer/employerService";

export default function CompanyDetailPage() {
  const { id } = useParams(); // id này tương ứng với userId/companyId
  const [company, setCompany] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Gọi API lấy thông tin công ty
        const profileResponse = await jobService.getCompanyProfile(id);
        const companyData = profileResponse.data;
        setCompany(companyData);

        // 2. Gọi API lấy danh sách việc làm của công ty này
        try {
          // Sử dụng jobService với API public
          const jobsResponse = await jobService.getPublicJobsByCompany(
            companyData.id,
            0,
            10,
          );
          const jobsData =
            jobsResponse.data?.items ||
            jobsResponse.data?.content ||
            jobsResponse.data ||
            [];
          setActiveJobs(jobsData);
        } catch (jobErr) {
          console.warn("Không thể tải danh sách việc làm:", jobErr);
          setActiveJobs([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin công ty:", err);
        setError(
          "Không thể tải thông tin công ty. Có thể công ty này không tồn tại.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCompanyData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-blue-600 gap-4">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="text-gray-500 font-medium text-lg">
          Đang tải hồ sơ doanh nghiệp...
        </p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="text-center py-20 min-h-[60vh] flex flex-col items-center justify-center">
        <Building2 className="w-20 h-20 text-gray-300 mb-4" />
        <p className="text-gray-500 text-xl font-medium">
          {error || "Không tìm thấy doanh nghiệp này!"}
        </p>
        <Link
          to="/companies"
          className="mt-6 text-blue-600 hover:underline font-medium"
        >
          Quay lại danh sách công ty
        </Link>
      </div>
    );
  }

  // Cover ảnh nền mặc định
  const defaultBanner =
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* 1. Khu vực Banner & Header Thông tin */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          {/* Cover Image */}
          <div className="h-64 w-full overflow-hidden md:rounded-b-3xl relative">
            <img
              src={defaultBanner}
              alt="Company Cover"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Info Section */}
          <div className="px-6 pb-10 flex flex-col md:flex-row gap-8 items-start relative -mt-16 z-10">
            {/* Logo - ĐÃ FIX LỖI BO GÓC BẰNG CÁCH BỎ padding VÀ ĐỔI sang object-cover */}
            <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white flex-shrink-0 overflow-hidden relative">
              {company.logoUrl ? (
                <img
                  src={`http://localhost:8080${company.logoUrl}`}
                  alt={company.companyName}
                  className="w-full h-full object-cover bg-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Logo";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-5xl">
                  {company.companyName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Chi tiết Header */}
            <div className="flex-1 pt-2 md:pt-16">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                {company.companyName}
                {company.verificationStatus === "VERIFIED" && (
                  <span className="ml-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 align-middle">
                    ✓ Đã xác thực
                  </span>
                )}
              </h1>

              <div className="flex flex-wrap gap-4 mt-4 text-gray-600 font-medium">
                <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  Trụ sở chính
                </span>

                {company.website && (
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-blue-500" />
                    {company.website.replace(/^https?:\/\//, "")}
                    <ExternalLink className="w-4 h-4 ml-1 opacity-50" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Layout 2 cột: Giới thiệu & Việc làm */}
      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cột trái */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Building2 className="w-7 h-7 text-blue-600" />
              Giới thiệu công ty
            </h2>
            <div className="prose prose-blue max-w-none">
              {company.description ? (
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                  {company.description}
                </p>
              ) : (
                <p className="text-gray-400 italic">
                  Công ty này chưa cập nhật bài giới thiệu.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Cột phải */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Việc làm đang tuyển{" "}
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">
                {activeJobs.length}
              </span>
            </h2>

            {activeJobs.length === 0 ? (
              <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                <p className="text-gray-500 font-medium">
                  Doanh nghiệp này hiện chưa có tin tuyển dụng nào.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="block border border-gray-100 p-5 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all group bg-white"
                  >
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-lg mb-2">
                      {job.title}
                    </h3>

                    <div className="flex flex-col gap-2 mt-3 text-sm text-gray-600">
                      <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
                        {job.salaryRange || "Thỏa thuận"}
                      </span>
                      <span className="flex items-center gap-1.5 opacity-80">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
