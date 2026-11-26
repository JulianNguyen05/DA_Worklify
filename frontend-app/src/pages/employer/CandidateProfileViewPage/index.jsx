// src/pages/employer/CandidateProfileViewPage/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import employerService from '../../../features/employer/employerService';
import Toast from '../../../components/common/Toast';
import ProfileLayoutSandbox from '../../../components/candidate-profile/sandbox/ProfileLayoutSandbox';

/**
 * Trang employer xem hồ sơ đầy đủ của 1 ứng viên (chỉ đọc), điều hướng tới
 * từ nút "Xem hồ sơ" trên CandidateSearchPage.
 * Tái dùng ProfileLayoutSandbox ở isEditMode=false — chỉ hiện các block
 * candidate đã bật visible, không cho kéo-thả/sửa.
 */
export default function CandidateProfileViewPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [layout, setLayout] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const res = await employerService.getCandidateFullProfile(userId);
      const data = res?.data || res; // tùy interceptor axios đã unwrap ApiResponse hay chưa
      setProfileData(data);
      setLayout([...(data?.layout || [])].sort((a, b) => a.position - b.position));
    } catch (error) {
      console.error(error);
      setStatusMsg({ type: 'error', message: 'Không tải được hồ sơ ứng viên. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="w-full space-y-6 pb-12">
      {statusMsg.message && (
        <Toast
          type={statusMsg.type}
          message={statusMsg.message}
          onClose={() => setStatusMsg({ type: null, message: '' })}
        />
      )}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại tìm kiếm
      </button>

      {/* HEADER — đồng bộ gradient Worklify (Navbar/AuthLayout) */}
      <div className="bg-gradient-to-r from-brand-600 to-accent-500 rounded-3xl p-8 sm:p-10 text-white shadow-raised relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-1">
            Hồ sơ ứng viên
          </p>
          <h1 className="font-display text-2xl font-bold">
            {isLoading ? 'Đang tải...' : profileData?.profile?.fullName || 'Ứng viên ẩn danh'}
          </h1>
          {!isLoading && profileData?.profile?.headline && (
            <p className="text-white/85 mt-1">{profileData.profile.headline}</p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Đang tải hồ sơ...
        </div>
      ) : layout.length > 0 ? (
        <ProfileLayoutSandbox
          layout={layout}
          profileData={profileData}
          isEditMode={false}
          onReorder={() => {}}
          onToggleVisibility={() => {}}
          userId={userId}
          onSaved={fetchProfile}
          onToast={setStatusMsg}
        />
      ) : (
        <div className="card border-dashed p-16 text-center text-slate-500">
          Ứng viên chưa cập nhật hồ sơ.
        </div>
      )}
    </div>
  );
}
