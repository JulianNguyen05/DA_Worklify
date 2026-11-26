import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import employerService from '../../../features/employer/employerService';
import authService from '../../../features/auth/authService';
import matchingService, { getMatchingErrorMessage } from '../../../features/matching/matchingService';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import PageHeader from '../../../components/common/PageHeader';
import Card from '../../../components/common/Card';
import EmptyState from '../../../components/common/EmptyState';
import Avatar from '../../../components/common/Avatar';
import { Skeleton } from '../../../components/common/Spinner';
import { AppStatusBadge } from '../../../components/shared/StatusBadges';
import { MatchScoreBadge, MatchScoreCard } from '../../../components/shared/MatchScore';
// BỔ SUNG: Import thêm icon Eye
import { Briefcase, Users, FileText, CheckCircle, XCircle, Clock, Eye, Sparkles } from 'lucide-react';

export default function ApplicationListPage() {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeJobId, setActiveJobId] = useState(null);
  
  const [applications, setApplications] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  // AI matching: applicationId -> { match, note }; null = chưa chấm cho tin đang chọn
  const [matchByAppId, setMatchByAppId] = useState(null);
  const [isRanking, setIsRanking] = useState(false);
  const [expandedAppId, setExpandedAppId] = useState(null);

  // 1. LẤY THÔNG TIN CÔNG TY VÀ DANH SÁCH CÔNG VIỆC LÀM TABS
  useEffect(() => {
    const fetchInitialData = async () => {
      const user = authService.getCurrentUser();
      if (!user?.userId) {
        navigate('/auth/login');
        return;
      }

      try {
        setIsLoadingJobs(true);
        const profileRes = await employerService.getCompanyProfile(user.userId);
        const compId = profileRes.data?.id;
        
        if (!compId) {
          setStatusMsg({ type: 'error', message: 'Bạn chưa tạo hồ sơ doanh nghiệp!' });
          return;
        }
        setCompanyId(compId);

        const jobsRes = await employerService.getMyJobs(compId, 0, 50); 
        const jobsData = jobsRes.data?.content || jobsRes.data || [];
        setJobs(jobsData);

        if (jobsData.length > 0) {
          setActiveJobId(jobsData[0].id);
        }
      } catch (error) {
        setStatusMsg({ type: 'error', message: 'Không thể tải danh sách công việc.' });
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchInitialData();
  }, [navigate]);

  // 2. KHI CHUYỂN TAB, TẢI DANH SÁCH ỨNG VIÊN
  useEffect(() => {
    if (!activeJobId) return;
    setMatchByAppId(null);
    setExpandedAppId(null);

    const fetchApplications = async () => {
      setIsLoadingApps(true);
      try {
        const res = await employerService.getApplicationsForJob(activeJobId, 0, 50);
        const appList = res.data?.content || res.data || [];
        setApplications(appList);
      } catch (error) {
        setStatusMsg({ type: 'error', message: 'Lỗi tải danh sách hồ sơ ứng tuyển!' });
      } finally {
        setIsLoadingApps(false);
      }
    };

    fetchApplications();
  }, [activeJobId]);

  // 3. CẬP NHẬT TRẠNG THÁI HỒ SƠ
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await employerService.updateApplicationStatus(companyId, appId, newStatus);
      setStatusMsg({ type: 'success', message: `Đã cập nhật trạng thái thành: ${newStatus}` });
      
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      setStatusMsg({ type: 'error', message: 'Thao tác cập nhật thất bại!' });
    }
  };

  // 4. CHẤM ĐIỂM AI CHO TOÀN BỘ HỒ SƠ CỦA TIN ĐANG CHỌN
  const handleRankWithAi = async () => {
    setIsRanking(true);
    try {
      const res = await matchingService.rankApplicationsForJob(activeJobId);
      const map = {};
      (res.data || []).forEach((row) => {
        map[row.applicationId] = { match: row.match, note: row.note };
      });
      setMatchByAppId(map);
      setStatusMsg({ type: 'success', message: 'Đã chấm điểm và sắp xếp hồ sơ theo mức độ phù hợp.' });
    } catch (error) {
      setStatusMsg({ type: 'error', message: getMatchingErrorMessage(error) });
    } finally {
      setIsRanking(false);
    }
  };

  // Đã chấm thì sắp xếp điểm cao trước, hồ sơ chưa chấm được xuống cuối
  const displayedApplications = useMemo(() => {
    if (!matchByAppId) return applications;
    const scoreOf = (app) => matchByAppId[app.id]?.match?.score ?? -1;
    return [...applications].sort((a, b) => scoreOf(b) - scoreOf(a));
  }, [applications, matchByAppId]);

  const STATUS_LABEL = { ACCEPTED: 'Chấp nhận', REJECTED: 'Từ chối', REVIEWED: 'Đã xem', PENDING: 'Chờ duyệt' };
  const getStatusBadge = (status) => (
    <AppStatusBadge status={STATUS_LABEL[status] ? status : 'PENDING'} label={STATUS_LABEL[status] || 'Chờ duyệt'} />
  );

  return (
    <div className="space-y-5">
      {statusMsg.message && (
        <Toast type={statusMsg.type} message={statusMsg.message} onClose={() => setStatusMsg({ type: null, message: '' })} />
      )}

      <PageHeader
        icon={Users}
        title="Hồ sơ ứng tuyển"
        description="Xem, xếp hạng bằng AI và xử lý hồ sơ ứng viên theo từng tin tuyển dụng."
      />

      {isLoadingJobs ? (
        <Card className="space-y-3 p-5">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-40 w-full" />
        </Card>
      ) : jobs.length === 0 ? (
        <Card className="border-dashed">
          <EmptyState icon={Briefcase} title="Bạn chưa đăng tin tuyển dụng nào." description="Đăng tin để bắt đầu nhận hồ sơ ứng viên." />
        </Card>
      ) : (
        <>
          {/* Chọn tin tuyển dụng */}
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <div className="inline-flex gap-1 rounded-lg bg-slate-100 p-1">
              {jobs.map(job => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setActiveJobId(job.id)}
                  className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    activeJobId === job.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {job.title}
                </button>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-slate-900">Danh sách hồ sơ</h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 tabular-nums">
                  {applications.length} ứng viên
                </span>
              </div>
              <Button
                size="sm"
                onClick={handleRankWithAi}
                isLoading={isRanking}
                disabled={applications.length === 0 || isLoadingApps}
              >
                {!isRanking && <Sparkles className="h-4 w-4" />}
                {isRanking ? 'AI đang chấm điểm...' : matchByAppId ? 'Chấm lại' : 'Xếp hạng bằng AI'}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Ứng viên</th>
                    <th className="px-4 py-3">Ngày nộp</th>
                    <th className="whitespace-nowrap px-4 py-3 text-center">Phù hợp AI</th>
                    <th className="px-4 py-3 text-center">Trạng thái</th>
                    <th className="px-5 py-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingApps ? (
                    [0, 1, 2].map(i => (
                      <tr key={i}>
                        <td className="px-5 py-4" colSpan="5"><Skeleton className="h-5 w-full" /></td>
                      </tr>
                    ))
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <EmptyState icon={Clock} title="Chưa có ứng viên nào nộp hồ sơ cho vị trí này." />
                      </td>
                    </tr>
                  ) : (
                    displayedApplications.map((app) => {
                      const aiResult = matchByAppId?.[app.id];
                      const isExpanded = expandedAppId === app.id;
                      const decided = app.status === 'ACCEPTED' || app.status === 'REJECTED';
                      return (
                        <React.Fragment key={app.id}>
                          <tr className={`transition-colors hover:bg-slate-50/80 ${isExpanded ? 'bg-brand-50/40' : ''}`}>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <Avatar name={app.candidateName || '?'} size="sm" />
                                <div className="min-w-0">
                                  <div className="truncate font-semibold text-slate-900">
                                    {app.candidateName || `Ứng viên ID: ${app.candidateId}`}
                                  </div>
                                  {app.cvFileName && (
                                    <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                                      <FileText className="h-3 w-3" /> <span className="truncate">{app.cvFileName}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">
                              {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('vi-VN') : 'Vừa mới nộp'}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              {aiResult?.match ? (
                                <MatchScoreBadge
                                  score={aiResult.match.score}
                                  onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                                  title={isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết điểm'}
                                />
                              ) : aiResult?.note ? (
                                <span className="text-xs italic text-slate-400" title={aiResult.note}>Chưa chấm được</span>
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-center">{getStatusBadge(app.status)}</td>
                            <td className="px-5 py-3.5">
                              <div className="flex justify-end gap-1.5">
                                <Button variant="outline" size="xs" onClick={() => navigate(`/employer/applications/${app.id}`)}>
                                  <Eye className="h-3.5 w-3.5" /> Chi tiết
                                </Button>
                                <Button variant="success" size="xs" onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')} disabled={decided}>
                                  <CheckCircle className="h-3.5 w-3.5" /> Duyệt
                                </Button>
                                <Button variant="danger-outline" size="xs" onClick={() => handleUpdateStatus(app.id, 'REJECTED')} disabled={decided}>
                                  <XCircle className="h-3.5 w-3.5" /> Loại
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && aiResult?.match && (
                            <tr className="bg-brand-50/40">
                              <td colSpan="5" className="px-5 pb-5 pt-1">
                                <div className="max-w-xl rounded-xl border border-brand-100 bg-white p-4 shadow-xs">
                                  <MatchScoreCard match={aiResult.match} compact />
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
