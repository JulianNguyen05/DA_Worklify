import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Toast from '../../../components/common/Toast';
import candidateService from '../../../features/candidate/candidateService';
import authService from '../../../features/auth/authService';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const SKILL_LEVELS = ['Cơ bản', 'Trung bình', 'Thành thạo', 'Chuyên gia'];

const SKILL_CATEGORIES = [
  'Lập trình',
  'Thiết kế',
  'Quản lý',
  'Ngôn ngữ',
  'Phân tích dữ liệu',
  'DevOps',
  'Kinh doanh',
  'Khác',
];

const makeSkillBlock = () => ({
  id: `block-skill-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  type: 'SKILLS',
  title: 'Kỹ năng mới',
  color: '#f0f9ff',
  data: {
    skillName: '',
    level: 'Trung bình',
    category: 'Lập trình',
    description: '',
  },
});

const INITIAL_BLOCKS = [
  {
    id: 'block-profile',
    type: 'PROFILE',
    title: 'Thông tin cá nhân',
    color: '#ffffff',
    data: {
      fullName: '',
      phone: '',
      gender: 'Nam',
      dob: '',
      address: '',
      email: '',
      summary: '',
    },
  },
  makeSkillBlock(),
];

// ─── LEVEL BADGE ──────────────────────────────────────────────────────────────

const LEVEL_STYLES = {
  'Cơ bản':    'bg-gray-100 text-gray-600 border-gray-200',
  'Trung bình':'bg-blue-50  text-blue-600  border-blue-100',
  'Thành thạo':'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Chuyên gia':'bg-amber-50  text-amber-700  border-amber-100',
};

const LevelBar = ({ level }) => {
  const idx = SKILL_LEVELS.indexOf(level);
  return (
    <div className="flex gap-1 mt-2">
      {SKILL_LEVELS.map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all ${
            i <= idx ? 'bg-blue-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const CVBuilderPage = () => {
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.userId;

  const [blocks, setBlocks]             = useState(INITIAL_BLOCKS);
  const [activeBlockId, setActiveBlockId] = useState('block-profile');
  const [toast, setToast]               = useState({ show: false, message: '', type: 'info' });
  const [isSaving, setIsSaving]         = useState(false);
  const [isFetching, setIsFetching]     = useState(true);

  const dragItem     = useRef();
  const dragOverItem = useRef();

  // ── Fetch dữ liệu ban đầu ──────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) { setIsFetching(false); return; }

    const fetchInitialData = async () => {
      setIsFetching(true);
      try {
        // 1. Profile (bảng users)
        const profileRes = await candidateService.getProfile(userId);
        if (profileRes?.data) {
          setBlocks(prev => prev.map(b =>
            b.type === 'PROFILE'
              ? {
                  ...b,
                  data: {
                    fullName: profileRes.data.fullName || '',
                    phone:    profileRes.data.phone    || '',
                    gender:   profileRes.data.gender   || 'Nam',
                    dob:      profileRes.data.dob      || '',
                    address:  profileRes.data.address  || '',
                    email:    profileRes.data.email    || '',
                    summary:  profileRes.data.summary  || '',
                  },
                }
              : b
          ));
        }

        // 2. Skills (bảng candidate_skills)
        try {
          const skillsRes = await candidateService.getSkills(userId);
          if (skillsRes?.data && Array.isArray(skillsRes.data) && skillsRes.data.length > 0) {
            const skillBlocks = skillsRes.data.map(s => ({
              id:    `block-skill-${s.id || Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
              type:  'SKILLS',
              title: s.skillName || 'Kỹ năng',
              color: '#f0f9ff',
              data: {
                skillName:   s.skillName   || '',
                level:       s.level       || 'Trung bình',
                category:    s.category    || 'Lập trình',
                description: s.description || '',
                remoteId:    s.id,
              },
            }));
            setBlocks(prev => [
              ...prev.filter(b => b.type === 'PROFILE'),
              ...skillBlocks,
            ]);
          }
        } catch (skillErr) {
          if (skillErr.response?.status !== 404 && skillErr.response?.status !== 400) {
            console.warn('Không tải được kỹ năng:', skillErr);
          }
        }
      } catch (error) {
        if (error.response?.status !== 404 && error.response?.status !== 400) {
          console.error('Lỗi tải Profile:', error);
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchInitialData();
  }, [userId]);

  // ── Thêm / Xóa block ──────────────────────────────────────────────────────
  const handleAddSkillBlock = () => {
    const nb = makeSkillBlock();
    setBlocks(prev => [...prev, nb]);
    setActiveBlockId(nb.id);
  };

  const handleDeleteBlock = (idToDelete) => {
    if (idToDelete === 'block-profile') {
      setToast({ show: true, message: 'Không thể xóa khối Thông tin cá nhân.', type: 'error' });
      return;
    }
    const skillBlocks = blocks.filter(b => b.type === 'SKILLS');
    if (skillBlocks.length <= 1) {
      setToast({ show: true, message: 'Cần ít nhất một kỹ năng trong hồ sơ.', type: 'error' });
      return;
    }
    setBlocks(prev => prev.filter(b => b.id !== idToDelete));
    if (activeBlockId === idToDelete) setActiveBlockId('block-profile');
  };

  // ── Drag & Drop ───────────────────────────────────────────────────────────
  const dragStart = (e, position) => {
    dragItem.current = position;
    e.currentTarget.style.opacity = '0.4';
  };
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };
  const dragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    if (dragItem.current == null || dragOverItem.current == null) return;
    const copy = [...blocks];
    const [moved] = copy.splice(dragItem.current, 1);
    copy.splice(dragOverItem.current, 0, moved);
    dragItem.current = null;
    dragOverItem.current = null;
    setBlocks(copy);
  };

  // ── Editor helpers ────────────────────────────────────────────────────────
  const activeBlock = blocks.find(b => b.id === activeBlockId);

  const handleBlockChange = (field, value) =>
    setBlocks(prev => prev.map(b => b.id === activeBlockId ? { ...b, [field]: value } : b));

  const handleDataChange = (field, value) =>
    setBlocks(prev => prev.map(b =>
      b.id === activeBlockId ? { ...b, data: { ...b.data, [field]: value } } : b
    ));

  // Sync title tự động theo skillName
  const handleSkillNameChange = (value) => {
    setBlocks(prev => prev.map(b =>
      b.id === activeBlockId
        ? { ...b, title: value || 'Kỹ năng mới', data: { ...b.data, skillName: value } }
        : b
    ));
  };

  // ── Lưu dữ liệu ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!userId) {
      setToast({ show: true, type: 'error', message: 'Lỗi phiên đăng nhập!' });
      return;
    }
    setIsSaving(true);
    setToast({ show: false, message: '', type: 'info' });

    try {
      // 1. Lưu Profile → bảng users
      const profileBlock = blocks.find(b => b.type === 'PROFILE');
      if (profileBlock) {
        const pd = profileBlock.data;
        if (!pd.fullName?.trim()) {
          setToast({ show: true, type: 'error', message: 'Vui lòng nhập Họ và tên!' });
          setIsSaving(false);
          return;
        }
        await candidateService.createOrUpdateProfile(userId, {
          ...pd,
          dob: pd.dob === '' ? null : pd.dob,
        });
      }

      // 2. Lưu từng Skill → bảng candidate_skills
      const skillBlocks = blocks.filter(b => b.type === 'SKILLS');
      for (const sb of skillBlocks) {
        const sd = sb.data;
        if (!sd.skillName?.trim()) continue;
        const payload = {
          skillName:   sd.skillName,
          level:       sd.level,
          category:    sd.category,
          description: sd.description || '',
        };
        if (sd.remoteId) {
          await candidateService.updateSkill(userId, sd.remoteId, payload);
        } else {
          const res = await candidateService.createSkill(userId, payload);
          // Ghi lại remoteId để lần sau update đúng
          if (res?.data?.id) {
            setBlocks(prev => prev.map(b =>
              b.id === sb.id ? { ...b, data: { ...b.data, remoteId: res.data.id } } : b
            ));
          }
        }
      }

      setToast({ show: true, message: 'Đã lưu hồ sơ thành công!', type: 'success' });
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu.';
      setToast({ show: true, message: msg, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
        <span className="text-sm font-medium">Đang tải dữ liệu...</span>
      </div>
    );
  }

  const profileBlock = blocks.find(b => b.type === 'PROFILE');
  const skillBlocks  = blocks.filter(b => b.type === 'SKILLS');

  return (
    <div className="flex flex-col h-full space-y-4">

      {/* ── Header ── */}
      <div className="flex justify-between items-center bg-white px-5 py-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Hồ sơ ứng viên</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Quản lý thông tin cá nhân và danh sách kỹ năng chuyên môn
          </p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          Lưu hồ sơ
        </Button>
      </div>

      {toast.show && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast({ show: false })} />
      )}

      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ══════════════════════════════════════════════════════
            CANVAS (LEFT)
        ══════════════════════════════════════════════════════ */}
        <div className="flex-[2] w-full space-y-4">

          {/* ── PROFILE Block (luôn đứng đầu, không drag) ── */}
          {profileBlock && (
            <div
              onClick={() => setActiveBlockId(profileBlock.id)}
              className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden
                ${activeBlockId === profileBlock.id
                  ? 'border-indigo-500 shadow-md shadow-indigo-100'
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'}`}
              style={{ backgroundColor: profileBlock.color }}
            >
              {/* Stripe accent */}
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl" />

              <div className="pl-5 pr-5 py-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      {profileBlock.title}
                    </h3>
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
                    users
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                  <ProfileField label="Họ và tên"   value={profileBlock.data.fullName} highlight />
                  <ProfileField label="Điện thoại"  value={profileBlock.data.phone} />
                  <ProfileField label="Email"        value={profileBlock.data.email} />
                  <ProfileField label="Giới tính"   value={profileBlock.data.gender} />
                  <ProfileField label="Ngày sinh"   value={profileBlock.data.dob} />
                  <ProfileField label="Địa chỉ"     value={profileBlock.data.address} />
                  {profileBlock.data.summary && (
                    <div className="col-span-2 md:col-span-3">
                      <span className="text-xs text-gray-400 font-medium">Giới thiệu bản thân</span>
                      <p className="text-gray-700 mt-0.5 leading-relaxed line-clamp-2">
                        {profileBlock.data.summary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── SKILLS Blocks (draggable) ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-5 h-0.5 bg-gray-300 rounded" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Kỹ năng chuyên môn
              </span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {skillBlocks.length} kỹ năng
              </span>
              <span className="flex-1 h-0.5 bg-gray-100 rounded" />
              <span className="text-xs text-gray-400">candidate_skills</span>
            </div>

            {skillBlocks.map((block, idx) => {
              // index trong toàn bộ blocks array (để drag đúng)
              const globalIdx = blocks.findIndex(b => b.id === block.id);
              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => dragStart(e, globalIdx)}
                  onDragEnter={(e) => dragEnter(e, globalIdx)}
                  onDragEnd={dragEnd}
                  onClick={() => setActiveBlockId(block.id)}
                  className={`relative group cursor-grab rounded-xl border-2 transition-all duration-200 overflow-hidden
                    ${activeBlockId === block.id
                      ? 'border-blue-500 shadow-md shadow-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}`}
                  style={{ backgroundColor: block.color }}
                >
                  {/* Drag handle */}
                  <div className="absolute top-3 right-3 text-gray-300 group-hover:text-gray-400 cursor-grab">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>

                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-400 rounded-l-xl" />

                  <div className="pl-5 pr-10 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-gray-800 truncate">
                            {block.data.skillName || (
                              <span className="text-gray-400 italic font-normal">Chưa đặt tên...</span>
                            )}
                          </h3>
                          <span className={`text-xs border px-2 py-0.5 rounded-full font-medium ${LEVEL_STYLES[block.data.level] || LEVEL_STYLES['Trung bình']}`}>
                            {block.data.level}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {block.data.category}
                          </span>
                        </div>
                        <LevelBar level={block.data.level} />
                        {block.data.description && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-1 leading-relaxed">
                            {block.data.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add skill button */}
            <button
              onClick={handleAddSkillBlock}
              className="w-full py-3.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500
                hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200
                font-medium flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm kỹ năng mới
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            EDITOR (RIGHT)
        ══════════════════════════════════════════════════════ */}
        <div className="flex-[1] w-full bg-white rounded-xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">

          {/* Editor header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-sm font-bold text-gray-700">
                {activeBlock?.type === 'PROFILE' ? 'Chỉnh sửa hồ sơ' : 'Chỉnh sửa kỹ năng'}
              </span>
            </div>

            {activeBlock && activeBlock.id !== 'block-profile' && (
              <button
                onClick={() => handleDeleteBlock(activeBlock.id)}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700
                  hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa
              </button>
            )}
          </div>

          <div className="p-5">
            {activeBlock ? (
              <div className="space-y-4">

                {/* ── PROFILE Editor ── */}
                {activeBlock.type === 'PROFILE' && (
                  <>
                    <SectionLabel>Thông tin liên hệ</SectionLabel>
                    <Input
                      label="Họ và tên *"
                      value={activeBlock.data.fullName}
                      onChange={(e) => handleDataChange('fullName', e.target.value)}
                      placeholder="Nguyễn Văn A"
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={activeBlock.data.email}
                      onChange={(e) => handleDataChange('email', e.target.value)}
                      placeholder="email@example.com"
                    />
                    <Input
                      label="Số điện thoại"
                      value={activeBlock.data.phone}
                      onChange={(e) => handleDataChange('phone', e.target.value)}
                      placeholder="0912 345 678"
                    />
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                        <select
                          value={activeBlock.data.gender}
                          onChange={(e) => handleDataChange('gender', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                            outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-white"
                        >
                          <option>Nam</option>
                          <option>Nữ</option>
                          <option>Khác</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <Input
                          label="Ngày sinh"
                          type="date"
                          value={activeBlock.data.dob}
                          onChange={(e) => handleDataChange('dob', e.target.value)}
                        />
                      </div>
                    </div>
                    <Input
                      label="Địa chỉ"
                      value={activeBlock.data.address}
                      onChange={(e) => handleDataChange('address', e.target.value)}
                      placeholder="Quận 1, TP. Hồ Chí Minh"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giới thiệu bản thân
                      </label>
                      <textarea
                        rows={4}
                        value={activeBlock.data.summary}
                        onChange={(e) => handleDataChange('summary', e.target.value)}
                        placeholder="Tóm tắt ngắn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                          outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 resize-none"
                      />
                    </div>
                  </>
                )}

                {/* ── SKILLS Editor ── */}
                {activeBlock.type === 'SKILLS' && (
                  <>
                    <SectionLabel>Thông tin kỹ năng</SectionLabel>
                    <Input
                      label="Tên kỹ năng *"
                      value={activeBlock.data.skillName}
                      onChange={(e) => handleSkillNameChange(e.target.value)}
                      placeholder="VD: ReactJS, Quản lý dự án, Python..."
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                      <select
                        value={activeBlock.data.category}
                        onChange={(e) => handleDataChange('category', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                          outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-white"
                      >
                        {SKILL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trình độ
                        <span className={`ml-2 text-xs border px-2 py-0.5 rounded-full font-medium
                          ${LEVEL_STYLES[activeBlock.data.level]}`}>
                          {activeBlock.data.level}
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {SKILL_LEVELS.map(lv => (
                          <button
                            key={lv}
                            onClick={() => handleDataChange('level', lv)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all
                              ${activeBlock.data.level === lv
                                ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                          >
                            {lv}
                          </button>
                        ))}
                      </div>
                      <LevelBar level={activeBlock.data.level} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả (tùy chọn)
                      </label>
                      <textarea
                        rows={3}
                        value={activeBlock.data.description}
                        onChange={(e) => handleDataChange('description', e.target.value)}
                        placeholder="Mô tả kinh nghiệm, dự án liên quan đến kỹ năng này..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                          outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Màu nền</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={activeBlock.color}
                          onChange={(e) => handleBlockChange('color', e.target.value)}
                          className="w-9 h-9 p-0 border-0 rounded-lg cursor-pointer"
                        />
                        <span className="text-sm text-gray-500 font-mono uppercase">
                          {activeBlock.color}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <svg className="w-8 h-8 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                </svg>
                <p className="text-sm text-gray-400">Nhấp vào một khối để chỉnh sửa</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

const ProfileField = ({ label, value, highlight }) => (
  <div>
    <span className="text-xs text-gray-400 font-medium block">{label}</span>
    <span className={`text-sm mt-0.5 block truncate ${highlight ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
      {value || <span className="text-gray-300 italic">—</span>}
    </span>
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-1 pb-2 border-b border-gray-100">
    {children}
  </p>
);

export default CVBuilderPage;
