import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import employerService from '../../../features/employer/employerService';
import authService from '../../../features/auth/authService';
import matchingService, { getMatchingErrorMessage } from '../../../features/matching/matchingService';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Chấp nhận</span>;
      case 'REJECTED': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Từ chối</span>;
      case 'REVIEWED': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Đã xem</span>;
      default: return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Chờ duyệt</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[70vh]">
      {statusMsg.message && (
        <Toast type={statusMsg.type} message={statusMsg.message} onClose={() => setStatusMsg({ type: null, message: '' })} />
      )}

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Quản lý Đơn ứng tuyển
        </h2>
        <p className="text-sm text-gray-500 mt-1">Xem và xử lý hồ sơ ứng viên theo từng chiến dịch tuyển dụng.</p>
      </div>

      {isLoadingJobs ? (
        <div className="py-10 text-center text-gray-500">Đang tải dữ liệu chiến dịch...</div>
      ) : jobs.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Bạn chưa đăng tin tuyển dụng nào.</p>
        </div>
      ) : (
        <>
          {/* TABS CÔNG VIỆC */}
          <div className="flex overflow-x-auto border-b border-gray-200 mb-6 custom-scrollbar">
            <div className="flex gap-2 pb-2">
              {jobs.map(job => (
                <button
                  key={job.id}
                  onClick={() => setActiveJobId(job.id)}
                  className={`px-5 py-2.5 font-medium text-sm whitespace-nowrap rounded-lg transition-all duration-200 ${
                    activeJobId === job.id 
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  {job.title}
                </button>
              ))}
            </div>
          </div>

          {/* KHU VỰC DANH SÁCH ỨNG VIÊN */}
          <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-1">
            <div className="px-5 py-4 flex justify-between items-center border-b border-gray-200 bg-white rounded-t-lg">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                Danh sách hồ sơ
                <span className="bg-indigo-100 text-indigo-700 py-0.5 px-2.5 rounded-full text-xs">
                  {applications.length} ứng viên
                </span>
              </h3>
              <Button
                onClick={handleRankWithAi}
                isLoading={isRanking}
                disabled={applications.length === 0 || isLoadingApps}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg"
              >
                {!isRanking && <Sparkles className="w-3.5 h-3.5" />}
                {isRanking ? 'AI đang chấm điểm...' : matchByAppId ? 'Chấm lại' : 'Chấm điểm AI'}
              </Button>
            </div>

            <div className="overflow-x-auto bg-white rounded-b-lg">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="p-4 font-bold text-gray-600 w-1/3">Ứng viên</th>
                    <th className="p-4 font-bold text-gray-600">Ngày nộp</th>
                    <th className="p-4 font-bold text-gray-600 text-center whitespace-nowrap">Phù hợp AI</th>
                    <th className="p-4 font-bold text-gray-600 text-center">Trạng thái</th>
                    <th className="p-4 font-bold text-gray-600 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoadingApps ? (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-gray-500">
                        <Clock className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-300" />
                        Đang tải danh sách hồ sơ...
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-gray-500">
                        Chưa có ứng viên nào nộp hồ sơ cho vị trí này.
                      </td>
                    </tr>
                  ) : (
                    displayedApplications.map((app) => {
                      const aiResult = matchByAppId?.[app.id];
                      const isExpanded = expandedAppId === app.id;
                      return (
                      <React.Fragment key={app.id}>
                      <tr className={`hover:bg-indigo-50/30 transition-colors ${isExpanded ? 'bg-indigo-50/40' : ''}`}>
                        <td className="p-4">
                          <div className="font-bold text-gray-900">
                            {/* Hiển thị Tên Ứng viên */}
                            {app.candidateName || `Ứng viên ID: ${app.candidateId}`}
                          </div>
                          {app.cvFileName && (
                            <div className="text-xs text-blue-600 mt-1 flex items-center gap-1 font-medium">
                              <FileText className="w-3 h-3" /> {app.cvFileName}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-gray-500 font-medium">
                          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('vi-VN') : 'Vừa mới nộp'}
                        </td>
                        <td className="p-4 text-center">
                          {aiResult?.match ? (
                            <MatchScoreBadge
                              score={aiResult.match.score}
                              onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                              title={isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết điểm'}
                            />
                          ) : aiResult?.note ? (
                            <span className="text-xs text-gray-400 italic" title={aiResult.note}>Chưa chấm được</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {/* NÚT XEM CHI TIẾT */}
                            <Button 
                              variant="outline" 
                              onClick={() => navigate(`/employer/applications/${app.id}`)}
                              className="px-3 py-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 text-xs rounded-md flex items-center gap-1 whitespace-nowrap"
                            >
                              <Eye className="w-3.5 h-3.5" /> Chi tiết
                            </Button>

                            <Button 
                              variant="primary" 
                              onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')} 
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-md shadow-sm flex items-center gap-1"
                              disabled={app.status === 'ACCEPTED' || app.status === 'REJECTED'}
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Duyệt
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => handleUpdateStatus(app.id, 'REJECTED')} 
                              className="px-3 py-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 text-xs rounded-md flex items-center gap-1"
                              disabled={app.status === 'ACCEPTED' || app.status === 'REJECTED'}
                            >
                              <XCircle className="w-3.5 h-3.5" /> Loại
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && aiResult?.match && (
                        <tr className="bg-indigo-50/40">
                          <td colSpan="5" className="px-6 pb-5 pt-1">
                            <div className="max-w-xl bg-white rounded-xl border border-indigo-100 p-4">
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
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}