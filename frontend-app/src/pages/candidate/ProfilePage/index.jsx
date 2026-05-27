import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import candidateService from '../../../features/candidate/candidateService';
import authService from '../../../features/auth/authService';
import {
  makeProfileBlock, makeSkillBlock, mapApiSkillsToBlocks,
  useDragSort, useBlockEditor,
  LoadingSpinner, ProfileBlockCard, SkillBlockCard,
  ProfileEditorPanel, SkillEditorPanel,
} from '../../../components/shared/cvProfileShared';

const INITIAL_BLOCKS = [makeProfileBlock(), makeSkillBlock()];

const CandidateProfile = () => {
  const userId = authService.getCurrentUser()?.userId;

  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [activeBlockId, setActiveBlockId] = useState('block-profile');
  const [uiState, setUiState] = useState({ isLoading: true, isSaving: false });
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const { dragStart, dragEnter, dragEnd } = useDragSort(setBlocks);
  const {
    handleBlockChange,
    handleDataChange,
    handleSkillNameChange,
    handleAddSkill,
    handleDeleteBlock,
  } = useBlockEditor(activeBlockId, setBlocks, setActiveBlockId, setToast);

  // Memoize data parsing để tránh tính toán lại mỗi lần render
  const profileBlock = useMemo(() => blocks.find(b => b.type === 'PROFILE'), [blocks]);
  const skillBlocks = useMemo(() => blocks.filter(b => b.type === 'SKILLS'), [blocks]);
  const activeBlock = useMemo(() => blocks.find(b => b.id === activeBlockId), [blocks, activeBlockId]);

  // Khởi tạo dữ liệu
  useEffect(() => {
    if (!userId) {
      setUiState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const abortController = new AbortController();

    const fetchProfileData = async () => {
      try {
        // Gửi request song song để tối ưu hóa thời gian chờ (LCP)
        const [profileRes, skillsRes] = await Promise.allSettled([
          candidateService.getProfile(userId, { signal: abortController.signal }),
          candidateService.getSkills(userId, { signal: abortController.signal })
        ]);

        let newBlocks = [...INITIAL_BLOCKS];

        if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
          newBlocks = newBlocks.map(b =>
            b.type === 'PROFILE' ? { ...b, data: { ...makeProfileBlock(profileRes.value.data).data } } : b
          );
        }

        if (skillsRes.status === 'fulfilled' && skillsRes.value?.data?.length > 0) {
          newBlocks = [
            ...newBlocks.filter(b => b.type === 'PROFILE'),
            ...mapApiSkillsToBlocks(skillsRes.value.data)
          ];
        }

        setBlocks(newBlocks);
      } catch (error) {
        setToast({ show: true, type: 'error', message: 'Hệ thống đang gián đoạn, vui lòng thử lại sau.' });
      } finally {
        setUiState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchProfileData();

    return () => abortController.abort(); // Cleanup fetch khi component unmount
  }, [userId]);

  // Xử lý lưu trữ dữ liệu với useCallback để tránh re-create function
  const handleSaveProfile = useCallback(async () => {
    if (!userId) {
      setToast({ show: true, type: 'error', message: 'Phiên đăng nhập không hợp lệ!' });
      return;
    }

    const pd = profileBlock?.data;
    if (!pd?.fullName?.trim()) {
      setToast({ show: true, type: 'warning', message: 'Họ và tên là thông tin bắt buộc.' });
      return;
    }

    setUiState(prev => ({ ...prev, isSaving: true }));
    setToast({ show: false, message: '', type: 'info' });

    try {
      // Thực hiện gọi API cập nhật Profile
      await candidateService.createOrUpdateProfile(userId, { ...pd, dob: pd.dob || null });

      // Quản lý lưu danh sách kỹ năng
      const skillPromises = skillBlocks.map(sb => {
        const sd = sb.data;
        if (!sd.skillName?.trim()) return Promise.resolve();

        const payload = { skillName: sd.skillName, level: sd.level, category: sd.category, description: sd.description || '' };
        
        return sd.remoteId 
          ? candidateService.updateSkill(userId, sd.remoteId, payload)
          : candidateService.createSkill(userId, payload).then(res => {
              if (res?.data?.id) {
                setBlocks(prev => prev.map(b => b.id === sb.id ? { ...b, data: { ...b.data, remoteId: res.data.id } } : b));
              }
            });
      });

      await Promise.all(skillPromises);
      setToast({ show: true, message: 'Cập nhật hồ sơ thành công!', type: 'success' });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Lỗi đồng bộ dữ liệu.', type: 'error' });
    } finally {
      setUiState(prev => ({ ...prev, isSaving: false }));
    }
  }, [userId, profileBlock, skillBlocks]);

  if (uiState.isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-white px-6 py-5 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Hồ Sơ Năng Lực</h1>
          <p className="text-sm text-gray-500 mt-1">Cá nhân hóa thông tin để thu hút nhà tuyển dụng</p>
        </div>
        <Button onClick={handleSaveProfile} isLoading={uiState.isSaving} className="px-6 py-2.5 rounded-xl font-semibold">
          Lưu thay đổi
        </Button>
      </header>

      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ show: false })} />}

      <main className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Workspace Canvas */}
        <section className="flex-[2] w-full space-y-6">
          <ProfileBlockCard profileBlock={profileBlock} activeBlockId={activeBlockId} onSelect={setActiveBlockId} />

          <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-6 h-1 bg-indigo-500 rounded-full" />
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Danh sách Kỹ năng</h3>
              <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                {skillBlocks.length} mục
              </span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>

            {skillBlocks.map((block, idx) => (
              <SkillBlockCard
                key={block.id}
                block={block}
                globalIdx={idx}
                activeBlockId={activeBlockId}
                onSelect={setActiveBlockId}
                dragStart={dragStart}
                dragEnter={dragEnter}
                dragEnd={dragEnd}
              />
            ))}

            <button
              onClick={handleAddSkill}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Thêm kỹ năng chuyên môn
            </button>
          </div>
        </section>

        {/* Floating Editor Panel */}
        <aside className="flex-[1] w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-24 overflow-hidden transition-all">
          <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <h3 className="text-base font-bold text-gray-800">
              {activeBlock?.type === 'PROFILE' ? 'Cập nhật Thông tin' : 'Chỉnh sửa Kỹ năng'}
            </h3>
            {activeBlock?.id !== 'block-profile' && (
              <button
                onClick={() => handleDeleteBlock(activeBlock.id, blocks)}
                className="text-sm font-medium text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Gỡ bỏ
              </button>
            )}
          </header>

          <div className="p-6">
            {activeBlock ? (
              <div className="space-y-5 animate-fadeIn">
                {activeBlock.type === 'PROFILE' && (
                  <ProfileEditorPanel data={activeBlock.data} handleDataChange={handleDataChange} />
                )}
                {activeBlock.type === 'SKILLS' && (
                  <SkillEditorPanel
                    data={activeBlock.data}
                    blockColor={activeBlock.color}
                    handleDataChange={handleDataChange}
                    handleSkillNameChange={handleSkillNameChange}
                    handleBlockChange={handleBlockChange}
                    showColorPicker={true}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-gray-400 font-medium">Vui lòng chọn một khối bên trái để thao tác</p>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CandidateProfile;