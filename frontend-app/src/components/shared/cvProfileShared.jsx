// src/components/shared/cvProfileShared.js
// ════════════════════════════════════════════════════════════════════════════
// FILE DÙNG CHUNG: ProfilePage & CVBuilderPage
//
// Export:
//  - Constants  : SKILL_LEVELS, SKILL_CATEGORIES, LEVEL_STYLES
//  - Factories  : makeSkillBlock(), makeProfileBlock()
//  - Hooks      : useDragSort(), useBlockEditor()
//  - Components : LevelBar, ProfileField, SectionLabel, SkillBlockCard,
//                 ProfileBlockCard, SkillEditorPanel, ProfileEditorPanel,
//                 LoadingSpinner
// ════════════════════════════════════════════════════════════════════════════

import React, { useRef } from 'react';
import Input from '../common/Input';

// ────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────────────────────────────────

export const SKILL_LEVELS = ['Cơ bản', 'Trung bình', 'Thành thạo', 'Chuyên gia'];

export const SKILL_CATEGORIES = [
  'Lập trình',
  'Thiết kế',
  'Quản lý',
  'Ngôn ngữ',
  'Phân tích dữ liệu',
  'DevOps',
  'Kinh doanh',
  'Khác',
];

export const LEVEL_STYLES = {
  'Cơ bản':    'bg-gray-100   text-gray-600   border-gray-200',
  'Trung bình':'bg-blue-50    text-blue-600   border-blue-100',
  'Thành thạo':'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Chuyên gia':'bg-amber-50   text-amber-700  border-amber-100',
};

// ────────────────────────────────────────────────────────────────────────────
// FACTORY FUNCTIONS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Tạo một block kỹ năng rỗng mới.
 * @param {object} overrides - Ghi đè các trường mặc định nếu cần
 */
export const makeSkillBlock = (overrides = {}) => ({
  id:    `block-skill-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  type:  'SKILLS',
  title: 'Kỹ năng mới',
  color: '#f0f9ff',
  data: {
    skillName:   '',
    level:       'Trung bình',
    category:    'Lập trình',
    description: '',
  },
  ...overrides,
});

/**
 * Tạo block thông tin cá nhân (PROFILE) với dữ liệu tuỳ chọn.
 * @param {object} profileData - Dữ liệu từ API để điền vào
 */
export const makeProfileBlock = (profileData = {}) => ({
  id:    'block-profile',
  type:  'PROFILE',
  title: 'Thông tin cá nhân',
  color: '#ffffff',
  data: {
    fullName: profileData.fullName || '',
    phone:    profileData.phone    || '',
    gender:   profileData.gender   || 'Nam',
    dob:      profileData.dob      || '',
    address:  profileData.address  || '',
    email:    profileData.email    || '',
    summary:  profileData.summary  || '',
  },
});

/**
 * Chuyển đổi mảng skills từ API thành mảng skill blocks.
 * @param {Array} skillsData - Mảng skills từ candidateService.getSkills()
 */
export const mapApiSkillsToBlocks = (skillsData = []) =>
  skillsData.map((s, index) => ({
    id:    `block-skill-${s.id || Date.now()}-${index}`,
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

// ────────────────────────────────────────────────────────────────────────────
// HOOKS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Hook xử lý drag-and-drop để sắp xếp lại danh sách blocks.
 * @param {Function} setBlocks - State setter của blocks
 * @returns {{ dragStart, dragEnter, dragEnd }}
 */
export const useDragSort = (setBlocks) => {
  const dragItem     = useRef(null);
  const dragOverItem = useRef(null);

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
    setBlocks(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(dragItem.current, 1);
      copy.splice(dragOverItem.current, 0, moved);
      return copy;
    });
    dragItem.current     = null;
    dragOverItem.current = null;
  };

  return { dragStart, dragEnter, dragEnd };
};

/**
 * Hook tập hợp các handler chỉnh sửa block.
 * @param {string}   activeBlockId - ID block đang được chọn
 * @param {Function} setBlocks     - State setter của blocks
 * @returns {{ handleBlockChange, handleDataChange, handleSkillNameChange, handleAddSkill, handleDeleteBlock }}
 */
export const useBlockEditor = (activeBlockId, setBlocks, setActiveBlockId, setToast) => {
  /** Thay đổi field cấp cao nhất của block (vd: color) */
  const handleBlockChange = (field, value) =>
    setBlocks(prev =>
      prev.map(b => b.id === activeBlockId ? { ...b, [field]: value } : b)
    );

  /** Thay đổi field bên trong block.data */
  const handleDataChange = (field, value) =>
    setBlocks(prev =>
      prev.map(b =>
        b.id === activeBlockId ? { ...b, data: { ...b.data, [field]: value } } : b
      )
    );

  /** Đồng bộ title block với skillName */
  const handleSkillNameChange = (value) =>
    setBlocks(prev =>
      prev.map(b =>
        b.id === activeBlockId
          ? { ...b, title: value || 'Kỹ năng mới', data: { ...b.data, skillName: value } }
          : b
      )
    );

  /** Thêm một skill block mới và focus vào nó */
  const handleAddSkill = () => {
    const nb = makeSkillBlock();
    setBlocks(prev => [...prev, nb]);
    setActiveBlockId(nb.id);
  };

  /** Xoá block (không cho xoá block profile hoặc khi chỉ còn 1 skill) */
  const handleDeleteBlock = (idToDelete, blocks) => {
    if (idToDelete === 'block-profile') {
      setToast({ show: true, type: 'error', message: 'Không thể xóa khối Thông tin cá nhân.' });
      return;
    }
    const skillBlocks = blocks.filter(b => b.type === 'SKILLS');
    if (skillBlocks.length <= 1) {
      setToast({ show: true, type: 'error', message: 'Cần ít nhất một kỹ năng trong hồ sơ.' });
      return;
    }
    setBlocks(prev => prev.filter(b => b.id !== idToDelete));
    if (activeBlockId === idToDelete) setActiveBlockId('block-profile');
  };

  return { handleBlockChange, handleDataChange, handleSkillNameChange, handleAddSkill, handleDeleteBlock };
};

// ────────────────────────────────────────────────────────────────────────────
// UI COMPONENTS
// ────────────────────────────────────────────────────────────────────────────

/** Thanh hiển thị mức độ kỹ năng (4 đoạn màu) */
export const LevelBar = ({ level }) => {
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

/** Hiển thị một trường thông tin dạng label + value */
export const ProfileField = ({ label, value, highlight }) => (
  <div>
    <span className="text-xs text-gray-400 font-medium block">{label}</span>
    <span
      className={`text-sm mt-0.5 block truncate ${
        highlight ? 'font-semibold text-gray-900' : 'text-gray-700'
      }`}
    >
      {value || <span className="text-gray-300 italic">—</span>}
    </span>
  </div>
);

/** Nhãn phân đoạn trong panel chỉnh sửa */
export const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-1 pb-2 border-b border-gray-100">
    {children}
  </p>
);

/** Spinner loading có text tuỳ chỉnh */
export const LoadingSpinner = ({ text = 'Đang tải dữ liệu...' }) => (
  <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <span className="text-sm font-medium">{text}</span>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// CANVAS BLOCK CARDS (hiển thị trên canvas trái)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Card hiển thị thông tin Profile trên canvas.
 * @param {object}   profileBlock   - Block PROFILE
 * @param {string}   activeBlockId  - ID block đang active
 * @param {Function} onSelect       - Callback khi click để chọn
 */
export const ProfileBlockCard = ({ profileBlock, activeBlockId, onSelect }) => {
  if (!profileBlock) return null;
  const isActive = activeBlockId === profileBlock.id;

  return (
    <div
      onClick={() => onSelect(profileBlock.id)}
      className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden
        ${isActive
          ? 'border-indigo-500 shadow-md shadow-indigo-100'
          : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
        }`}
      style={{ backgroundColor: profileBlock.color }}
    >
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
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
          <ProfileField label="Họ và tên"  value={profileBlock.data.fullName} highlight />
          <ProfileField label="Điện thoại" value={profileBlock.data.phone} />
          <ProfileField label="Email"       value={profileBlock.data.email} />
          <ProfileField label="Giới tính"  value={profileBlock.data.gender} />
          <ProfileField label="Ngày sinh"  value={profileBlock.data.dob} />
          <ProfileField label="Địa chỉ"    value={profileBlock.data.address} />
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
  );
};

/**
 * Card hiển thị một kỹ năng trên canvas, hỗ trợ drag-and-drop.
 * @param {object}   block         - Block SKILLS
 * @param {number}   globalIdx     - Vị trí trong mảng blocks tổng (để drag)
 * @param {string}   activeBlockId - ID block đang active
 * @param {Function} onSelect      - Callback khi click
 * @param {Function} dragStart     - Handler dragStart
 * @param {Function} dragEnter     - Handler dragEnter
 * @param {Function} dragEnd       - Handler dragEnd
 */
export const SkillBlockCard = ({
  block,
  globalIdx,
  activeBlockId,
  onSelect,
  dragStart,
  dragEnter,
  dragEnd,
}) => {
  const isActive = activeBlockId === block.id;

  return (
    <div
      draggable
      onDragStart={(e) => dragStart(e, globalIdx)}
      onDragEnter={(e) => dragEnter(e, globalIdx)}
      onDragEnd={dragEnd}
      onClick={() => onSelect(block.id)}
      className={`relative group cursor-grab rounded-xl border-2 transition-all duration-200 overflow-hidden
        ${isActive
          ? 'border-blue-500 shadow-md shadow-blue-50'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
        }`}
      style={{ backgroundColor: block.color }}
    >
      {/* Drag handle icon */}
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
              <span className={`text-xs border px-2 py-0.5 rounded-full font-medium
                ${LEVEL_STYLES[block.data.level] || LEVEL_STYLES['Trung bình']}`}>
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
};

// ────────────────────────────────────────────────────────────────────────────
// EDITOR PANELS (bảng điều khiển bên phải)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Panel chỉnh sửa thông tin Profile.
 * @param {object}   data           - block.data của PROFILE block
 * @param {Function} handleDataChange - (field, value) => void
 */
export const ProfileEditorPanel = ({ data, handleDataChange }) => (
  <>
    <SectionLabel>Thông tin liên hệ</SectionLabel>

    <Input
      label="Họ và tên *"
      value={data.fullName}
      onChange={(e) => handleDataChange('fullName', e.target.value)}
      placeholder="Nguyễn Văn A"
    />
    <Input
      label="Email"
      type="email"
      value={data.email}
      onChange={(e) => handleDataChange('email', e.target.value)}
      placeholder="email@example.com"
    />
    <Input
      label="Số điện thoại"
      value={data.phone}
      onChange={(e) => handleDataChange('phone', e.target.value)}
      placeholder="0912 345 678"
    />

    <div className="flex gap-3">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
        <select
          value={data.gender}
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
          value={data.dob}
          onChange={(e) => handleDataChange('dob', e.target.value)}
        />
      </div>
    </div>

    <Input
      label="Địa chỉ"
      value={data.address}
      onChange={(e) => handleDataChange('address', e.target.value)}
      placeholder="Quận 1, TP. Hồ Chí Minh"
    />

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Giới thiệu bản thân
      </label>
      <textarea
        rows={4}
        value={data.summary}
        onChange={(e) => handleDataChange('summary', e.target.value)}
        placeholder="Tóm tắt ngắn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
          outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 resize-none"
      />
    </div>
  </>
);

/**
 * Panel chỉnh sửa một kỹ năng.
 * @param {object}   data               - block.data của SKILLS block
 * @param {string}   blockColor         - block.color
 * @param {Function} handleDataChange   - (field, value) => void
 * @param {Function} handleSkillNameChange - (value) => void (sync title)
 * @param {Function} handleBlockChange  - (field, value) => void (vd: color)
 * @param {boolean}  showColorPicker    - Hiển thị tuỳ chọn màu nền (ProfilePage cần, CVBuilder không)
 */
export const SkillEditorPanel = ({
  data,
  blockColor,
  handleDataChange,
  handleSkillNameChange,
  handleBlockChange,
  showColorPicker = true,
}) => (
  <>
    <SectionLabel>Thông tin kỹ năng</SectionLabel>

    <Input
      label="Tên kỹ năng *"
      value={data.skillName}
      onChange={(e) => handleSkillNameChange(e.target.value)}
      placeholder="VD: ReactJS, Quản lý dự án, Python..."
    />

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
      <select
        value={data.category}
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
          ${LEVEL_STYLES[data.level]}`}>
          {data.level}
        </span>
      </label>
      <div className="grid grid-cols-2 gap-2">
        {SKILL_LEVELS.map(lv => (
          <button
            key={lv}
            onClick={() => handleDataChange('level', lv)}
            className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all
              ${data.level === lv
                ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
          >
            {lv}
          </button>
        ))}
      </div>
      <LevelBar level={data.level} />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Mô tả (tùy chọn)
      </label>
      <textarea
        rows={3}
        value={data.description}
        onChange={(e) => handleDataChange('description', e.target.value)}
        placeholder="Mô tả kinh nghiệm, dự án liên quan đến kỹ năng này..."
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
          outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 resize-none"
      />
    </div>

    {showColorPicker && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Màu nền</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={blockColor}
            onChange={(e) => handleBlockChange('color', e.target.value)}
            className="w-9 h-9 p-0 border-0 rounded-lg cursor-pointer"
          />
          <span className="text-sm text-gray-500 font-mono uppercase">{blockColor}</span>
        </div>
      </div>
    )}
  </>
);
