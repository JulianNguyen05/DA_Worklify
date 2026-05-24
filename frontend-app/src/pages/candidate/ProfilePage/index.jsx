import React, { useState, useEffect } from 'react';
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

const ProfilePage = () => {
  const userId = authService.getCurrentUser()?.userId;

  const [blocks, setBlocks]               = useState(INITIAL_BLOCKS);
  const [activeBlockId, setActiveBlockId] = useState('block-profile');
  const [toast, setToast]                 = useState({ show: false, message: '', type: 'info' });
  const [isSaving, setIsSaving]           = useState(false);
  const [isFetching, setIsFetching]       = useState(true);

  // ── Hooks dùng chung ──────────────────────────────────────────────────────
  const { dragStart, dragEnter, dragEnd } = useDragSort(setBlocks);

  const {
    handleBlockChange,
    handleDataChange,
    handleSkillNameChange,
    handleAddSkill,
    handleDeleteBlock,
  } = useBlockEditor(activeBlockId, setBlocks, setActiveBlockId, setToast);

  // ── Fetch dữ liệu ban đầu ─────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) { setIsFetching(false); return; }

    const fetchInitialData = async () => {
      setIsFetching(true);
      try {
        const profileRes = await candidateService.getProfile(userId);
        if (profileRes?.data) {
          setBlocks(prev => prev.map(b =>
            b.type === 'PROFILE' ? { ...b, data: { ...makeProfileBlock(profileRes.data).data } } : b
          ));
        }

        try {
          const skillsRes = await candidateService.getSkills(userId);
          if (skillsRes?.data?.length > 0) {
            setBlocks(prev => [
              ...prev.filter(b => b.type === 'PROFILE'),
              ...mapApiSkillsToBlocks(skillsRes.data),
            ]);
          }
        } catch (skillErr) {
          if (![404, 400].includes(skillErr.response?.status)) {
            console.warn('Không tải được kỹ năng:', skillErr);
          }
        }
      } catch (error) {
        if (![404, 400].includes(error.response?.status)) {
          console.error('Lỗi tải Profile:', error);
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchInitialData();
  }, [userId]);

  // ── Lưu dữ liệu ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!userId) { setToast({ show: true, type: 'error', message: 'Lỗi phiên đăng nhập!' }); return; }
    setIsSaving(true);
    setToast({ show: false, message: '', type: 'info' });
    try {
      const profileBlock = blocks.find(b => b.type === 'PROFILE');
      if (profileBlock) {
        const pd = profileBlock.data;
        if (!pd.fullName?.trim()) {
          setToast({ show: true, type: 'error', message: 'Vui lòng nhập Họ và tên!' });
          setIsSaving(false); return;
        }
        await candidateService.createOrUpdateProfile(userId, { ...pd, dob: pd.dob || null });
      }

      const skillBlocks = blocks.filter(b => b.type === 'SKILLS');
      for (const sb of skillBlocks) {
        const sd = sb.data;
        if (!sd.skillName?.trim()) continue;
        const payload = { skillName: sd.skillName, level: sd.level, category: sd.category, description: sd.description || '' };
        if (sd.remoteId) {
          await candidateService.updateSkill(userId, sd.remoteId, payload);
        } else {
          const res = await candidateService.createSkill(userId, payload);
          if (res?.data?.id) {
            setBlocks(prev => prev.map(b =>
              b.id === sb.id ? { ...b, data: { ...b.data, remoteId: res.data.id } } : b
            ));
          }
        }
      }
      setToast({ show: true, message: 'Đã lưu hồ sơ thành công!', type: 'success' });
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu.';
      setToast({ show: true, message: msg, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) return <LoadingSpinner />;

  const profileBlock = blocks.find(b => b.type === 'PROFILE');
  const skillBlocks  = blocks.filter(b => b.type === 'SKILLS');
  const activeBlock  = blocks.find(b => b.id === activeBlockId);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center bg-white px-5 py-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Hồ sơ ứng viên</h2>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý thông tin cá nhân và danh sách kỹ năng chuyên môn</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>Lưu hồ sơ</Button>
      </div>

      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ show: false })} />}

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* CANVAS */}
        <div className="flex-[2] w-full space-y-4">
          <ProfileBlockCard profileBlock={profileBlock} activeBlockId={activeBlockId} onSelect={setActiveBlockId} />

          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-5 h-0.5 bg-gray-300 rounded" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kỹ năng chuyên môn</span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{skillBlocks.length} kỹ năng</span>
              <span className="flex-1 h-0.5 bg-gray-100 rounded" />
            </div>

            {skillBlocks.map(block => (
              <SkillBlockCard
                key={block.id}
                block={block}
                globalIdx={blocks.findIndex(b => b.id === block.id)}
                activeBlockId={activeBlockId}
                onSelect={setActiveBlockId}
                dragStart={dragStart}
                dragEnter={dragEnter}
                dragEnd={dragEnd}
              />
            ))}

            <button
              onClick={handleAddSkill}
              className="w-full py-3.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500
                hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200
                font-medium flex items-center justify-center gap-2 text-sm"
            >
              + Thêm kỹ năng mới
            </button>
          </div>
        </div>

        {/* EDITOR PANEL */}
        <div className="flex-[1] w-full bg-white rounded-xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <span className="text-sm font-bold text-gray-700">
              {activeBlock?.type === 'PROFILE' ? 'Chỉnh sửa hồ sơ' : 'Chỉnh sửa kỹ năng'}
            </span>
            {activeBlock && activeBlock.id !== 'block-profile' && (
              <button
                onClick={() => handleDeleteBlock(activeBlock.id, blocks)}
                className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
              >
                Xóa
              </button>
            )}
          </div>

          <div className="p-5">
            {activeBlock ? (
              <div className="space-y-4">
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
              <p className="text-sm text-gray-400 text-center py-10">Nhấp vào một khối để chỉnh sửa</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;