import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, MapPin, ArrowRight, Sparkles, FileText, Send, UserRound, Wallet,
  Code2, Megaphone, Palette, Landmark, ShoppingBag, Wrench, HeartPulse, GraduationCap,
  CheckCircle2, Target, Wand2, Building2, Briefcase,
} from 'lucide-react';
import jobService from '../../../features/job/jobService';
import employerService from '../../../features/employer/employerService';
import Button, { buttonClasses } from '../../../components/common/Button';
import Avatar from '../../../components/common/Avatar';
import { Skeleton } from '../../../components/common/Spinner';
import { getFileUrl } from '../../../utils/fileUrl';

const POPULAR_KEYWORDS = ['Java', 'ReactJS', 'Data Analyst', 'DevOps', 'Kế toán', 'Kinh doanh'];

// Ngành nghề: bấm vào sẽ tìm việc theo từ khoá tương ứng
const CATEGORIES = [
  { icon: Code2, label: 'Công nghệ thông tin', keyword: 'Developer' },
  { icon: Megaphone, label: 'Marketing & Truyền thông', keyword: 'Marketing' },
  { icon: Palette, label: 'Thiết kế & Sáng tạo', keyword: 'Designer' },
  { icon: Landmark, label: 'Tài chính & Kế toán', keyword: 'Kế toán' },
  { icon: ShoppingBag, label: 'Kinh doanh & Bán hàng', keyword: 'Kinh doanh' },
  { icon: Wrench, label: 'Kỹ thuật & Sản xuất', keyword: 'Kỹ thuật' },
  { icon: HeartPulse, label: 'Y tế & Chăm sóc sức khỏe', keyword: 'Y tế' },
  { icon: GraduationCap, label: 'Giáo dục & Đào tạo', keyword: 'Giáo dục' },
];

const STEPS = [
  { icon: UserRound, title: 'Tạo hồ sơ', desc: 'Khai báo kinh nghiệm, kỹ năng, dự án một lần — dùng lại cho mọi CV.' },
  { icon: Target, title: 'Xem mức độ phù hợp', desc: 'AI chấm điểm hồ sơ của bạn với từng tin tuyển dụng và chỉ ra kỹ năng còn thiếu.' },
  { icon: Send, title: 'Ứng tuyển & theo dõi', desc: 'Nộp CV trong vài giây và theo dõi trạng thái đơn ngay trên bảng điều khiển.' },
];

const AI_FEATURES = [
  { icon: Target, title: 'Chấm điểm CV – JD', desc: 'So sánh nội dung, kỹ năng và kinh nghiệm để ra điểm phù hợp 0–100.' },
  { icon: Wand2, title: 'Trợ lý sửa hồ sơ', desc: 'Gợi ý viết lại phần giới thiệu, kinh nghiệm, dự án sát với yêu cầu công việc.' },
  { icon: FileText, title: 'Trình tạo CV', desc: 'Kéo thả khối nội dung, chọn mẫu và xuất PDF chuẩn A4.' },
];

const EMPLOYER_POINTS = [
  'Đăng tin và quản lý trạng thái tuyển dụng tập trung',
  'Xếp hạng hồ sơ ứng tuyển theo điểm phù hợp từ AI',
  'Tìm kiếm ứng viên theo kỹ năng',
  'Xem CV và hồ sơ chi tiết của ứng viên',
];

function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-[15px] leading-relaxed text-slate-500">{description}</p>}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ keyword: '', location: '' });
  const [latestJobs, setLatestJobs] = useState([]);
  const [counts, setCounts] = useState({ jobs: null, companies: null });
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  // Lấy việc làm mới nhất + số liệu thật từ API công khai
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [jobsRes, companiesRes] = await Promise.allSettled([
        jobService.searchJobs({}, 0, 6),
        employerService.getAllCompanies(0, 1),
      ]);
      if (cancelled) return;
      const jobsData = jobsRes.status === 'fulfilled' ? jobsRes.value?.data : null;
      const companiesData = companiesRes.status === 'fulfilled' ? companiesRes.value?.data : null;
      setLatestJobs(jobsData?.content || []);
      setCounts({ jobs: jobsData?.totalElements ?? null, companies: companiesData?.totalElements ?? null });
      setIsLoadingJobs(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/jobs?${query}`);
  };

  const goKeyword = (k) => navigate(`/jobs?keyword=${encodeURIComponent(k)}`);

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgb(226 232 240) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 100%)',
          }}
        />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-brand-100/60 blur-[100px]" />

        <div className="page-container relative py-16 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" /> Chấm điểm mức độ phù hợp CV bằng AI
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl">
            Tìm công việc <span className="text-brand-600">thật sự phù hợp</span> với bạn
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Worklify kết nối ứng viên với doanh nghiệp đã xác minh, và cho bạn biết hồ sơ khớp bao nhiêu với từng vị trí trước khi ứng tuyển.
          </p>

          <form
            onSubmit={handleSearch}
            className="card mx-auto mt-9 flex max-w-3xl flex-col gap-2 p-2 text-left md:flex-row md:items-center"
          >
            <label className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2 focus-within:bg-slate-50">
              <Search className="h-[18px] w-[18px] shrink-0 text-slate-400" />
              <input
                type="text"
                placeholder="Chức danh, kỹ năng hoặc công ty..."
                value={searchParams.keyword}
                onChange={(e) => setSearchParams((p) => ({ ...p, keyword: e.target.value }))}
                className="w-full bg-transparent text-[15px] text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </label>
            <div className="hidden h-6 w-px bg-slate-200 md:block" />
            <label className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2 focus-within:bg-slate-50">
              <MapPin className="h-[18px] w-[18px] shrink-0 text-slate-400" />
              <input
                type="text"
                placeholder="Địa điểm"
                value={searchParams.location}
                onChange={(e) => setSearchParams((p) => ({ ...p, location: e.target.value }))}
                className="w-full bg-transparent text-[15px] text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </label>
            <Button type="submit" size="lg" className="w-full md:w-auto">
              <Search className="h-4 w-4" /> Tìm kiếm
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-slate-400">Phổ biến:</span>
            {POPULAR_KEYWORDS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => goKeyword(k)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                {k}
              </button>
            ))}
          </div>

          <dl className="mx-auto mt-12 grid max-w-xl grid-cols-2 divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white/70 py-4 backdrop-blur-sm">
            <div>
              <dd className="font-display text-2xl font-bold text-slate-900 tabular-nums">{counts.jobs ?? '—'}</dd>
              <dt className="mt-0.5 text-xs text-slate-500">Việc làm đang mở</dt>
            </div>
            <div>
              <dd className="font-display text-2xl font-bold text-slate-900 tabular-nums">{counts.companies ?? '—'}</dd>
              <dt className="mt-0.5 text-xs text-slate-500">Doanh nghiệp đang tuyển</dt>
            </div>
          </dl>
        </div>
      </section>

      {/* ── VIỆC LÀM MỚI NHẤT ─────────────────────────────── */}
      <section className="page-container py-16 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Việc làm" title="Việc làm mới nhất" align="left" />
          <Link to="/jobs" className={buttonClasses({ variant: 'outline' })}>
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoadingJobs
            ? [0, 1, 2].map((i) => (
                <div key={i} className="card space-y-3 p-5">
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
                  </div>
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))
            : latestJobs.map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}`} className="card card-hover group flex flex-col p-5">
                  <div className="flex items-start gap-3">
                    <Avatar src={job.logoUrl ? getFileUrl(job.logoUrl) : null} name={job.companyName || job.title} square />
                    <div className="min-w-0">
                      <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-900 group-hover:text-brand-700">{job.title}</h3>
                      <p className="mt-0.5 truncate text-sm text-slate-500">{job.companyName}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-slate-500">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                      <Wallet className="h-3.5 w-3.5" /> {job.salaryRange || 'Thỏa thuận'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.location || 'Toàn quốc'}
                    </span>
                  </div>
                </Link>
              ))}
        </div>
        {!isLoadingJobs && latestJobs.length === 0 && (
          <div className="card mt-8 p-10 text-center text-sm text-slate-500">
            <Briefcase className="mx-auto mb-3 h-6 w-6 text-slate-300" /> Chưa có tin tuyển dụng nào.
          </div>
        )}
      </section>

      {/* ── NGÀNH NGHỀ ─────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-white">
        <div className="page-container py-16 sm:py-20">
          <SectionHeading
            eyebrow="Ngành nghề"
            title="Khám phá theo lĩnh vực"
            description="Chọn một lĩnh vực để xem các vị trí đang tuyển."
          />
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {CATEGORIES.map(({ icon: Icon, label, keyword }) => (
              <button
                key={label}
                type="button"
                onClick={() => goKeyword(keyword)}
                className="card card-hover group flex items-center gap-3 p-4 text-left"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium leading-snug text-slate-800">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUY TRÌNH ─────────────────────────────────────── */}
      <section className="page-container py-16 sm:py-20">
        <SectionHeading eyebrow="Quy trình" title="Bắt đầu chỉ trong 3 bước" />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <li key={title} className="card relative p-6">
              <span className="absolute right-5 top-5 font-display text-4xl font-bold text-slate-100">0{i + 1}</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white shadow-xs">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── AI ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-brand-600/30 blur-[110px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accent-500/20 blur-[110px]" />
        <div className="page-container relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">Worklify AI</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Biết trước hồ sơ khớp bao nhiêu — và cách cải thiện
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-slate-400">
              Mô hình AI đọc hồ sơ online của bạn và mô tả công việc, chấm điểm từng thành phần rồi gợi ý chỉnh sửa dựa trên chính thông tin bạn đã khai báo.
            </p>
            <Link to="/auth/register" className={buttonClasses({ size: 'lg', className: 'mt-8 bg-white text-slate-900 hover:bg-slate-100' })}>
              Tạo tài khoản miễn phí <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3">
            {AI_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-200">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NHÀ TUYỂN DỤNG ─────────────────────────────────── */}
      <section className="page-container py-16 sm:py-20">
        <div className="card grid items-center gap-10 overflow-hidden p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Nhà tuyển dụng"
              title="Tìm đúng người, nhanh hơn"
              description="Đăng tin, nhận hồ sơ và để AI giúp bạn ưu tiên những ứng viên phù hợp nhất."
              align="left"
            />
            <ul className="mt-6 space-y-2.5">
              {EMPLOYER_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth/register?role=employer" className={buttonClasses({ size: 'lg' })}>
                Đăng tin tuyển dụng <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/companies" className={buttonClasses({ variant: 'outline', size: 'lg' })}>
                <Building2 className="h-4 w-4" /> Xem các công ty
              </Link>
            </div>
          </div>
          <div className="hidden rounded-xl border border-slate-200 bg-slate-50 p-5 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hồ sơ ứng tuyển · xếp theo AI</p>
            <ul className="mt-4 space-y-2">
              {[['Ứng viên A', 86], ['Ứng viên B', 72], ['Ứng viên C', 48]].map(([name, score]) => (
                <li key={name} className="card flex items-center gap-3 px-3 py-2.5">
                  <Avatar name={name.slice(-1)} size="sm" />
                  <span className="flex-1 text-sm font-medium text-slate-800">{name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${ score >= 75 ? 'bg-emerald-50 text-emerald-700' : score >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700' }`}
                  >
                    {score}/100
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
