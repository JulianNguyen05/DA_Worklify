// src/components/candidate-profile/sandbox/ProfileBlockCard.jsx
import React from 'react';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { BLOCK_META, BLOCK_TAG, BLOCK_ICON, getBlockItems } from '../shared/blockConfig';
import { BLOCK_FORM_CONFIGS } from '../shared/blockFormConfig';
import InlineEntryList from '../shared/InlineEntryList';
import InlineReferenceEntryList from '../shared/InlineReferenceEntryList';
import InlinePersonalInfoCard from '../shared/InlinePersonalInfoCard';
import InlineSocialLinksCard from '../shared/InlineSocialLinksCard';
import InlineAvatarCard from '../shared/InlineAvatarCard';

const REFERENCE_BLOCK_TYPES = ['SKILL', 'LANGUAGE'];
const LIST_BLOCK_TYPES = Object.keys(BLOCK_FORM_CONFIGS); // Experience, Education, Project, Certification, Award, Activity, Hobby

/**
 * Card đại diện cho 1 block trên sandbox ProfilePage.
 * [ĐỔI MÀU] Đồng bộ theo bảng màu Worklify (#2563EB xanh dương / #14B8A6 teal /
 * #0F172A - #64748B slate) thay cho theme "Blueprint Dossier" (graphite/ink/paper) cũ,
 * khớp với Navbar, AuthLayout và các trang employer khác.
 *
 * Kéo-thả/resize do react-grid-layout quản lý qua class "block-drag-handle".
 * Cả 12 block giờ đều nhập TRỰC TIẾP trong card (không còn modal) — component
 * này chỉ đóng vai trò khung + rẽ nhánh sang đúng "Inline*" component theo blockType.
 *
 * @param {object}   layoutItem   - { blockType, visible }
 * @param {object}   profileData  - toàn bộ response getFullProfile
 * @param {number}   userId
 * @param {Function} onToggleVisibility - (blockType, nextVisible) => void
 * @param {Function} onSaved      - () => void — refetch profileData sau khi 1 field được lưu
 * @param {Function} onToast      - ({ type, message }) => void
 * @param {boolean}  isEditMode   - true = đang chỉnh bố cục (hiện tay cầm kéo, nút ẩn/hiện, form nhập)
 *                                  false = chỉ xem portfolio (tĩnh, không input)
 */
const ProfileBlockCard = ({
  layoutItem, profileData, userId, onToggleVisibility, onSaved, onToast, isEditMode,
}) => {
  const { blockType, visible } = layoutItem;
  const meta = BLOCK_META[blockType] || { label: blockType, repeatable: false };
  const Icon = BLOCK_ICON[blockType];
  const itemCount = meta.repeatable ? getBlockItems(blockType, profileData).length : null;
  const readOnly = !isEditMode;

  const renderContent = () => {
    if (blockType === 'PERSONAL_INFO') {
      return (
        <InlinePersonalInfoCard
          userId={userId} profile={profileData?.profile}
          onSaved={onSaved} onToast={onToast} readOnly={readOnly}
        />
      );
    }
    if (blockType === 'SOCIAL_LINKS') {
      return (
        <InlineSocialLinksCard
          userId={userId} profile={profileData?.profile}
          onSaved={onSaved} onToast={onToast} readOnly={readOnly}
        />
      );
    }
    if (blockType === 'AVATAR') {
      return (
        <InlineAvatarCard
          userId={userId} avatarUrl={profileData?.profile?.avatarUrl}
          onSaved={onSaved} onToast={onToast} readOnly={readOnly}
        />
      );
    }
    if (REFERENCE_BLOCK_TYPES.includes(blockType)) {
      return (
        <InlineReferenceEntryList
          blockType={blockType} userId={userId} items={getBlockItems(blockType, profileData)}
          onSaved={onSaved} onToast={onToast} readOnly={readOnly}
        />
      );
    }
    if (LIST_BLOCK_TYPES.includes(blockType)) {
      return (
        <InlineEntryList
          blockType={blockType} userId={userId} items={getBlockItems(blockType, profileData)}
          onSaved={onSaved} onToast={onToast} readOnly={readOnly}
        />
      );
    }
    return null;
  };

  return (
    <div
      className={`h-full w-full flex flex-col bg-white border border-[#E2E8F0] rounded-xl overflow-hidden
        transition-opacity ${visible ? '' : 'opacity-40 saturate-0'}`}
      style={{ boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 8px rgba(15,23,42,0.03)' }}
    >
      {/* ─── Header ─── */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#E2E8F0] shrink-0 bg-[#F8FAFC]">
        {isEditMode && (
          <span
            className="block-drag-handle flex items-center cursor-grab active:cursor-grabbing text-[#94A3B8] hover:text-[#2563EB] shrink-0"
            title="Kéo để di chuyển"
          >
            <GripVertical size={15} strokeWidth={2} />
          </span>
        )}

        {Icon && <Icon size={13} strokeWidth={2} className="text-[#2563EB] shrink-0" />}

        <h3 className="flex-1 text-[14px] font-semibold text-[#0F172A] uppercase tracking-wider truncate font-body">
          {meta.label}
        </h3>

        <span className="text-[13px] font-medium text-[#2563EB] bg-[#EFF6FF] rounded px-1.5 py-0.5 shrink-0 font-tag">
          {BLOCK_TAG[blockType]}{itemCount !== null ? ` · ${String(itemCount).padStart(2, '0')}` : ''}
        </span>

        {isEditMode && (
          <button
            type="button"
            onClick={() => onToggleVisibility(blockType, !visible)}
            className="p-1 text-[#64748B] hover:text-[#2563EB] transition-colors shrink-0"
            title={visible ? 'Ẩn khỏi ProfilePage' : 'Hiện trên ProfilePage'}
          >
            {visible ? <Eye size={13} strokeWidth={2} /> : <EyeOff size={13} strokeWidth={2} />}
          </button>
        )}
      </div>

      {/* ─── Nội dung: form nhập trực tiếp (isEditMode) hoặc text tĩnh (chế độ xem) ─── */}
      <div className="px-3.5 py-3 flex-1 min-h-0 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileBlockCard;
