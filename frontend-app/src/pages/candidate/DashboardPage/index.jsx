import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import authService from "../../../features/auth/authService";
import candidateService from "../../../features/candidate/candidateService";
import jobService from "../../../features/job/jobService";
import employerService from "../../../features/employer/employerService";
import { Globe, Heart, FileText, Send, Briefcase, Building2, ArrowRight, MapPin, Search, FilePlus2, AlertCircle } from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";
import StatCard from "../../../components/common/StatCard";
import Card, { CardHeader } from "../../../components/common/Card";
import EmptyState from "../../../components/common/EmptyState";
import Avatar from "../../../components/common/Avatar";
import { PageLoader } from "../../../components/common/Spinner";
import { buttonClasses } from "../../../components/common/Button";
import { getFileUrl } from "../../../utils/fileUrl";

const DashboardPage = () => {
  const [uiState, setUiState] = useState({ isLoading: true, error: null });
  const [data, setData] = useState({
    user: null,
    stats: { cvCount: 0, appCount: 0, jobCount: 0, companyCount: 0 },
    latestJobs: [],
    topCompanies: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const currentUser = authService.getCurrentUser();

      if (!currentUser?.userId) {
        setUiState({
          isLoading: false,
          error: "Không tìm thấy phiên đăng nhập.",
        });
        return;
      }

      try {
        // Tối ưu hoá thời gian tải bằng cách gọi API song song
        const [cvRes, appsRes, jobsRes, companiesRes] =
          await Promise.allSettled([
            candidateService.getCvs(currentUser.userId),
            candidateService.getMyApplications(currentUser.userId),
            jobService.searchJobs("", "", 0, 5),
            employerService.getAllCompanies(0, 5),
          ]);

        // Trích xuất dữ liệu an toàn
        const cvs = cvRes.status === "fulfilled" ? cvRes.value?.data : [];
        const apps =
          appsRes.status === "fulfilled"
            ? appsRes.value?.data
            : { content: [], totalElements: 0 };
        const jobs =
          jobsRes.status === "fulfilled"
            ? jobsRes.value?.data
            : { content: [], totalElements: 0 };
        const companies =
          companiesRes.status === "fulfilled"
            ? companiesRes.value?.data
            : { content: [], totalElements: 0 };

        const sortedCompanies = (companies?.content || []).sort(
          (a, b) => (b.likeCount || 0) - (a.likeCount || 0),
        );

        setData({
          user: currentUser,
          stats: {
            cvCount: cvs?.length || 0,
            appCount: apps?.totalElements || apps?.content?.length || 0,
            jobCount: jobs?.totalElements || 0,
            companyCount: companies?.totalElements || 0,
          },
          latestJobs: jobs?.content || [],
          topCompanies: sortedCompanies, // Sử dụng mảng đã được sắp xếp
        });
      } catch (err) {
        setUiState((prev) => ({
          ...prev,
          error: "Đã xảy ra lỗi khi đồng bộ dữ liệu hệ thống.",
        }));
      } finally {
        setUiState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const displayName = useMemo(() => {
    if (data.user?.fullName) return data.user.fullName;
    return data.user?.email ? data.user.email.split("@")[0] : "Ứng viên";
  }, [data.user]);

  if (uiState.isLoading) return <PageLoader label="Đang đồng bộ dữ liệu..." />;

  if (uiState.error) {
    return (
      <div className="page-container py-10">
        <Card>
          <EmptyState tone="danger" icon={AlertCircle} title="Không tải được dữ liệu" description={uiState.error} />
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container space-y-6 py-8">
      <PageHeader
        eyebrow="Tổng quan"
        title={`Xin chào, ${displayName}`}
        description="Theo dõi tiến độ ứng tuyển và khám phá cơ hội nghề nghiệp mới nhất."
        actions={
          <>
            <Link to="/candidate/cv-templates" className={buttonClasses({ variant: "outline" })}>
              <FilePlus2 className="h-4 w-4" /> Tạo CV
            </Link>
            <Link to="/jobs" className={buttonClasses()}>
              <Search className="h-4 w-4" /> Tìm việc làm
            </Link>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="CV hiện có" value={data.stats.cvCount} hint="Quản lý CV" to="/candidate/cv-manager" icon={FileText} tone="brand" />
        <StatCard label="Đơn đã nộp" value={data.stats.appCount} hint="Xem lịch sử ứng tuyển" to="/candidate/applications" icon={Send} tone="emerald" />
        <StatCard label="Việc làm trên hệ thống" value={data.stats.jobCount} hint="Khám phá ngay" to="/jobs" icon={Briefcase} tone="amber" />
        <StatCard label="Công ty đang tuyển" value={data.stats.companyCount} hint="Xem danh sách" to="/companies" icon={Building2} tone="violet" />
      </section>

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader
            title="Việc làm mới nhất"
            icon={Briefcase}
            action={<Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">Xem tất cả <ArrowRight className="h-4 w-4" /></Link>}
          />
          {data.latestJobs.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {data.latestJobs.map((job) => (
                <li key={job.id}>
                  <Link to={`/jobs/${job.id}`} className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/80">
                    <Avatar src={job.logoUrl ? getFileUrl(job.logoUrl) : null} name={job.companyName || job.title} square />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold text-slate-900 group-hover:text-brand-700">{job.title}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{job.companyName || "Công ty bảo mật thông tin"}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-emerald-700">{job.salaryRange || "Thỏa thuận"}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{job.location || "Toàn quốc"}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={Briefcase} title="Chưa có công việc nào được cập nhật." />
          )}
        </Card>

        <Card className="overflow-hidden">
          <CardHeader
            title="Công ty hàng đầu"
            icon={Building2}
            action={<Link to="/companies" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">Khám phá <ArrowRight className="h-4 w-4" /></Link>}
          />
          {data.topCompanies.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {data.topCompanies.map((company) => (
                <li key={company.id}>
                  <Link to={`/companies/${company.id}`} className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/80">
                    <Avatar src={company.logoUrl ? `http://localhost:8080${company.logoUrl}` : null} name={company.companyName || "C"} square />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-brand-700">
                        {company.companyName || "Công ty chưa cập nhật tên"}
                      </p>
                      {company.website ? (
                        <p className="mt-0.5 inline-flex max-w-full items-center gap-1 text-xs text-slate-500">
                          <Globe className="h-3 w-3 shrink-0" />
                          <span className="truncate">{company.website.replace(/^https?:\/\//, "")}</span>
                        </p>
                      ) : (
                        <p className="mt-0.5 text-xs italic text-slate-400">Chưa cập nhật website</p>
                      )}
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                      {company.likeCount || 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={Building2} title="Chưa có thông tin công ty." />
          )}
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
