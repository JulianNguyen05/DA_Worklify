import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Wallet, Briefcase, Clock, Calendar, ArrowRight,
  Building2, Send, Heart, CheckCircle2, AlertCircle, Loader2, Sparkles, RefreshCw
} from 'lucide-react';
import DOMPurify from 'dompurify';

import jobService from '../../../features/job/jobService';
import authService from '../../../features/auth/authService';
import applicationService from '../../../features/application/applicationService';
import candidateService from '../../../features/candidate/candidateService';
import matchingService, { getMatchingErrorMessage } from '../../../features/matching/matchingService';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Toast from '../../../components/common/Toast';
import Card from '../../../components/common/Card';
import Avatar from '../../../components/common/Avatar';
import Select from '../../../components/common/Select';
import Textarea from '../../../components/common/Textarea';
import EmptyState from '../../../components/common/EmptyState';
import { PageLoader } from '../../../components/common/Spinner';
import { MatchScoreCard } from '../../../components/shared/MatchScore';
import CvAdvicePanel from '../../../components/shared/CvAdvicePanel';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State ứng tuyển
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [cvList, setCvList] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // State AI matching: điểm phù hợp giữa hồ sơ ứng viên và tin này
  const currentUser = authService.getCurrentUser();
  const [match, setMatch] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState('');

  // Trợ lý AI gợi ý sửa hồ sơ (modal)
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  const [hasAppliedAdvice, setHasAppliedAdvice] = useState(false);

  useEffect(() => {
    setMatch(null);
    setMatchError('');
    setIsAdviceOpen(false);
  }, [id]);

  const handleCloseAdvice = () => {
    setIsAdviceOpen(false);
    // Hồ sơ đã đổi -> chấm lại để điểm trên trang khớp với hồ sơ mới
    if (hasAppliedAdvice) {
      setHasAppliedAdvice(false);
      handleCheckMatch();
    }
  };

  const handleCheckMatch = async () => {
    setIsMatching(true);
    setMatchError('');
    try {
      const res = await matchingService.getMyMatchForJob(id);
      setMatch(res.data);
    } catch (error) {
      setMatchError(getMatchingErrorMessage(error));
    } finally {
      setIsMatching(false);
    }
  };

  // Ẩn Toast sau 3 giây
  useEffect(() => {
    if (!statusMsg.message) return undefined;
    const timer = setTimeout(() => setStatusMsg({ type: null, message: '' }), 3000);
    return () => clearTimeout(timer);
  }, [statusMsg.message]);

  useEffect(() => {
    fetchJobDetail();
    // Ứng viên: biết tin này đã lưu / đã nộp chưa để hiện đúng trạng thái nút
    if (currentUser?.role === 'CANDIDATE') {
      jobService.getSavedJobIds()
        .then((res) => setIsSaved((res.data || []).includes(Number(id))))
        .catch(() => {});
      candidateService.getMyApplications(currentUser.userId, 0, 100)
        .then((res) => {
          const apps = res.data?.content || [];
          setAlreadyApplied(apps.some((a) => a.jobId === Number(id)));
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchJobDetail = async () => {
    setIsLoading(true);
    try {
      const res = await jobService.getJobDetail(id);
      setJob(res.data);
    } catch (error) {
      console.error(error);
      setJob(null);
    } finally {
      setIsLoading(false);
    }
  };

  const requireCandidate = (action) => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'CANDIDATE') {
      setStatusMsg({ type: 'error', message: `Vui lòng đăng nhập tài khoản Ứng viên để ${action}!` });
      setTimeout(() => navigate('/auth/login'), 1500);
      return null;
    }
    return user;
  };

  const handleOpenApplyModal = async () => {
    const user = requireCandidate('ứng tuyển');
    if (!user) return;

    try {
      const res = await candidateService.getMyCVs(user.userId);
      setCvList(res.data || []);
      setIsApplyModalOpen(true);
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Không thể tải danh sách CV của bạn.' });
    }
  };

  const handleApply = async () => {
    if (!selectedCvId) {
      setStatusMsg({ type: 'error', message: 'Vui lòng chọn 1 CV để ứng tuyển!' });
      return;
    }

    setIsApplying(true);
    try {
      const user = authService.getCurrentUser();
      await applicationService.submitApplication(user.userId, {
        jobId: job.id,
        cvId: selectedCvId,
        coverLetter: coverLetter
      });
      setStatusMsg({ type: 'success', message: '🎉 Đã nộp hồ sơ ứng tuyển thành công!' });
      setIsApplyModalOpen(false);
      setAlreadyApplied(true);
    } catch (err) {
      // Backend trả lý do cụ thể: đã nộp rồi, tin hết hạn/đã đóng, CV không hợp lệ...
      const message = err.response?.data?.message || 'Ứng tuyển thất bại, vui lòng thử lại.';
      setStatusMsg({ type: 'error', message });
      if (err.response?.status === 409) setAlreadyApplied(true);
    } finally {
      setIsApplying(false);
    }
  };

  const toggleSaveJob = async () => {
    if (!requireCandidate('lưu tin')) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        await jobService.unsaveJob(job.id);
        setIsSaved(false);
        setStatusMsg({ type: 'success', message: 'Đã bỏ lưu tin.' });
      } else {
        await jobService.saveJob(job.id);
        setIsSaved(true);
        setStatusMsg({ type: 'success', message: 'Đã lưu tin tuyển dụng!' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', message: err.response?.data?.message || 'Không thể lưu tin, vui lòng thử lại.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <PageLoader label="Đang tải chi tiết công việc..." />;

  if (!job) {
    return (
      <div className="page-container py-16">
        <Card>
          <EmptyState icon={Briefcase} title="Không tìm thấy công việc này!" description="Tin có thể đã bị gỡ hoặc hết hạn." />
        </Card>
      </div>
    );
  }

  // Render nội dung HTML từ RichTextEditor một cách an toàn (loại bỏ script/thẻ nguy hiểm).
  // Chỉ cho phép các thẻ cơ bản mà RichTextEditor (TipTap StarterKit) có thể sinh ra.
  const renderHtml = (html) => ({
    __html: DOMPurify.sanitize(html || '', {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    }),
  });

  // Đồng bộ JSON (hỗ trợ nhiều cấu trúc backend)
  const actualCompanyName =
    job.company?.companyName ||
    job.company?.name ||
    job.companyName ||
    job.company_name ||
    `Công ty ID: ${job.companyId || job.company_id}`;

  const actualLogoUrl =
    job.company?.logoUrl ||
    job.company?.logo_url ||
    job.companyLogo ||
    job.company_logo ||
    job.logoUrl ||
    job.logo_url;

  const actualSalaryRange = job.salaryRange || job.salary_range;
  const actualCreatedAt = job.createdAt || job.created_at;
  const companyPath = `/companies/${job.companyId || job.company_id || job.company?.id}`;

  let displayLogo = null;
  if (actualLogoUrl) {
    displayLogo = actualLogoUrl.startsWith('http')
      ? actualLogoUrl
      : `http://localhost:8080${actualLogoUrl.startsWith('/') ? '' : '/'}${actualLogoUrl}`;
  }

  const WORK_TYPE_LABEL = {
    FULL_TIME: 'Toàn thời gian',
    PART_TIME: 'Bán thời gian',
    INTERNSHIP: 'Thực tập',
    REMOTE: 'Làm từ xa',
  };
  const workTypeLabel = WORK_TYPE_LABEL[job.workType] || job.workType;
  // Backend tính sẵn: tin ACTIVE và chưa quá hạn nộp
  const isOpen = job.openForApplications !== false;
  const isEmployerOrAdmin = currentUser && currentUser.role !== 'CANDIDATE';

  const overview = [
    { icon: Wallet, label: 'Mức lương', value: actualSalaryRange || 'Thỏa thuận' },
    { icon: MapPin, label: 'Địa điểm', value: job.location || 'Chưa cập nhật' },
    { icon: Briefcase, label: 'Hình thức làm việc', value: workTypeLabel || '—' },
    { icon: Calendar, label: 'Hạn nộp hồ sơ', value: job.expiresAt ? new Date(job.expiresAt).toLocaleDateString('vi-VN') : 'Đang mở' },
    { icon: Clock, label: 'Ngày đăng tin', value: actualCreatedAt ? new Date(actualCreatedAt).toLocaleDateString('vi-VN') : 'Mới đây' },
  ];

  return (
    <div className="pb-16">
      {statusMsg.type && (
        <div className="fixed right-4 top-20 z-[70] w-[min(380px,calc(100vw-2rem))] shadow-raised">
          <Toast type={statusMsg.type} message={statusMsg.message} />
        </div>
      )}

      {/* ================= HEADER ================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="page-container py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4 sm:gap-5">
              <Avatar src={displayLogo} name={actualCompanyName} size="xl" square className="rounded-2xl" />
              <div className="min-w-0">
                <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">{job.title}</h1>
                <button
                  type="button"
                  onClick={() => navigate(companyPath)}
                  className="mt-1.5 text-left text-[15px] font-medium text-slate-600 hover:text-brand-700"
                >
                  {actualCompanyName}
                </button>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                    <Wallet className="h-4 w-4" /> {actualSalaryRange || 'Thỏa thuận'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                    <MapPin className="h-4 w-4" /> {job.location || 'Chưa cập nhật'}
                  </span>
                  {workTypeLabel && (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                      <Briefcase className="h-4 w-4" /> {workTypeLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                onClick={toggleSaveJob}
                variant="outline"
                size="lg"
                isLoading={isSaving}
                disabled={isEmployerOrAdmin}
                className={isSaved ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-50' : ''}
              >
                <Heart className={`h-[18px] w-[18px] ${isSaved ? 'fill-rose-500' : ''}`} />
                <span className="hidden sm:inline">{isSaved ? 'Đã lưu tin' : 'Lưu tin'}</span>
              </Button>
              {alreadyApplied ? (
                <Button size="lg" variant="secondary" disabled className="flex-1 sm:flex-none sm:px-8">
                  <CheckCircle2 className="h-[18px] w-[18px]" /> Đã ứng tuyển
                </Button>
              ) : !isOpen ? (
                <Button size="lg" variant="secondary" disabled className="flex-1 sm:flex-none sm:px-8">
                  <AlertCircle className="h-[18px] w-[18px]" />
                  {job.status === 'ACTIVE' ? 'Đã hết hạn nộp' : 'Đã ngừng nhận hồ sơ'}
                </Button>
              ) : (
                <Button
                  onClick={handleOpenApplyModal}
                  size="lg"
                  disabled={isEmployerOrAdmin}
                  className="flex-1 sm:flex-none sm:px-8"
                >
                  <Send className="h-[18px] w-[18px]" /> Ứng tuyển ngay
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= NỘI DUNG ================= */}
      <div className="page-container mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Cột trái: chi tiết */}
        <Card className="p-6 sm:p-8 lg:col-span-2">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Mô tả công việc</h2>
            <div
              className="prose prose-sm prose-slate mt-3 max-w-none leading-relaxed text-slate-600"
              dangerouslySetInnerHTML={renderHtml(job.description)}
            />
          </section>

          {job.requirements && (
            <section className="mt-8 border-t border-slate-100 pt-8">
              <h2 className="text-lg font-semibold text-slate-900">Yêu cầu ứng viên</h2>
              <div
                className="prose prose-sm prose-slate mt-3 max-w-none leading-relaxed text-slate-600"
                dangerouslySetInnerHTML={renderHtml(job.requirements)}
              />
            </section>
          )}
        </Card>

        {/* Cột phải */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {/* AI MATCHING: chỉ hiện cho khách và ứng viên (nhà tuyển dụng/admin không có hồ sơ ứng viên) */}
          {(!currentUser || currentUser.role === 'CANDIDATE') && (
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-brand-50 to-white px-5 py-4">
                <h3 className="flex items-center gap-2 text-[15px] font-semibold text-slate-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  Mức độ phù hợp với bạn
                </h3>
                {match && (
                  <button
                    type="button"
                    onClick={handleCheckMatch}
                    disabled={isMatching}
                    title="Chấm lại sau khi cập nhật hồ sơ"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-brand-600 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isMatching ? 'animate-spin' : ''}`} />
                  </button>
                )}
              </div>

              <div className="p-5">
                {match ? (
                  <>
                    <MatchScoreCard match={match} />
                    <Button variant="outline" onClick={() => setIsAdviceOpen(true)} className="mt-4 w-full">
                      <Sparkles className="h-4 w-4 text-brand-600" /> Nhờ AI gợi ý sửa hồ sơ
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="mb-4 text-sm leading-relaxed text-slate-500">
                      AI so sánh hồ sơ online của bạn với yêu cầu của công việc này và chỉ ra kỹ năng còn thiếu.
                    </p>
                    {matchError && (
                      <div className="mb-4 flex gap-2 rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          {matchError}{' '}
                          {matchError.includes('hồ sơ') && (
                            <button type="button" className="font-semibold underline" onClick={() => navigate('/candidate/profile')}>
                              Cập nhật hồ sơ
                            </button>
                          )}
                        </span>
                      </div>
                    )}
                    {currentUser ? (
                      <Button onClick={handleCheckMatch} isLoading={isMatching} className="w-full">
                        {!isMatching && <Sparkles className="h-4 w-4" />}
                        {isMatching ? 'AI đang chấm điểm...' : 'Xem mức độ phù hợp'}
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={() => navigate('/auth/login')} className="w-full">
                        Đăng nhập tài khoản ứng viên để xem
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card>
          )}

          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-slate-900">Tổng quan công việc</h3>
            <dl className="mt-4 space-y-4">
              {overview.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs text-slate-500">{label}</dt>
                    <dd className="text-sm font-semibold text-slate-900">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
              <Avatar src={displayLogo} name={actualCompanyName} square />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500">Được đăng bởi</p>
                <p className="truncate text-sm font-semibold text-slate-900">{actualCompanyName}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate(companyPath)}>
                Xem <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ================= MODAL TRỢ LÝ AI SỬA HỒ SƠ ================= */}
      <Modal isOpen={isAdviceOpen} onClose={handleCloseAdvice} size="xl" title="Trợ lý AI: gợi ý sửa hồ sơ cho công việc này">
        {isAdviceOpen && <CvAdvicePanel jobId={id} onApplied={() => setHasAppliedAdvice(true)} />}
      </Modal>

      {/* ================= MODAL ỨNG TUYỂN ================= */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        size="md"
        title="Ứng tuyển công việc này"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>Hủy</Button>
            <Button onClick={handleApply} isLoading={isApplying} disabled={cvList.length === 0}>
              <Send className="h-4 w-4" /> Gửi hồ sơ
            </Button>
          </>
        }
      >
        <div className="space-y-5 p-5">
          <div className="flex items-start gap-3 rounded-lg border border-brand-100 bg-brand-50 p-3.5">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <p className="text-sm text-brand-900">
              Bạn đang ứng tuyển vị trí <span className="font-semibold">{job.title}</span> tại{' '}
              <span className="font-semibold">{actualCompanyName}</span>.
            </p>
          </div>

          <div>
            <Select
              label="Chọn CV của bạn"
              required
              name="apply-cv"
              onChange={(e) => setSelectedCvId(e.target.value)}
              value={selectedCvId}
            >
              <option value="" disabled>-- Vui lòng chọn CV --</option>
              {cvList.map(cv => (
                <option key={cv.id} value={cv.id}>
                  {cv.fileName || `CV tạo hệ thống (${new Date(cv.createdAt).toLocaleDateString('vi-VN')})`}
                </option>
              ))}
            </Select>
            {cvList.length === 0 && (
              <p className="mt-1.5 text-sm text-rose-600">Bạn chưa có CV nào. Hãy vào trang cá nhân để Upload hoặc tạo CV nhé.</p>
            )}
          </div>

          <Textarea
            label="Thư giới thiệu (Cover Letter)"
            name="apply-cover"
            rows={5}
            placeholder="Viết vài lời giới thiệu điểm mạnh của bạn để thu hút nhà tuyển dụng..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
