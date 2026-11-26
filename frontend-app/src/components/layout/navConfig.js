import {
  LayoutDashboard, Briefcase, Building2, UserRound, FileText, Send, Settings,
  PlusCircle, Users, UserSearch, ShieldCheck, FileCheck2, Tags, BadgeCheck, BarChart3, Code2, Heart,
} from 'lucide-react';

// Cấu hình điều hướng theo vai trò — dùng chung cho Navbar, Sidebar và menu người dùng.

export const PUBLIC_LINKS = [
  { name: 'Việc làm', path: '/jobs', icon: Briefcase },
  { name: 'Công ty', path: '/companies', icon: Building2 },
];

export const CANDIDATE_LINKS = [
  { name: 'Tổng quan', path: '/candidate/dashboard', icon: LayoutDashboard },
  { name: 'Việc làm', path: '/jobs', icon: Briefcase },
  { name: 'Công ty', path: '/companies', icon: Building2 },
  { name: 'Hồ sơ', path: '/candidate/profile', icon: UserRound },
  { name: 'CV của tôi', path: '/candidate/cv-manager', icon: FileText },
  { name: 'Đơn ứng tuyển', path: '/candidate/applications', icon: Send },
  { name: 'Việc đã lưu', path: '/candidate/saved-jobs', icon: Heart },
];

export const EMPLOYER_NAV = [
  {
    label: 'Tuyển dụng',
    items: [
      { name: 'Tổng quan', path: '/employer/dashboard', icon: LayoutDashboard },
      { name: 'Tin tuyển dụng', path: '/employer/jobs', icon: Briefcase },
      { name: 'Đăng tin mới', path: '/employer/jobs/create', icon: PlusCircle },
      { name: 'Hồ sơ ứng tuyển', path: '/employer/applications', icon: Users },
      { name: 'Tìm ứng viên', path: '/employer/candidates/search', icon: UserSearch },
    ],
  },
  {
    label: 'Doanh nghiệp',
    items: [
      { name: 'Hồ sơ công ty', path: '/employer/profile', icon: Building2 },
      { name: 'Cài đặt', path: '/employer/settings', icon: Settings },
    ],
  },
];

export const ADMIN_NAV = [
  {
    label: 'Tổng quan',
    items: [{ name: 'Bảng điều khiển', path: '/admin/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Kiểm duyệt',
    items: [
      { name: 'Doanh nghiệp', path: '/admin/company-moderation', icon: ShieldCheck },
      { name: 'Tin tuyển dụng', path: '/admin/jobs-moderation', icon: FileCheck2 },
      { name: 'Skill / Language', path: '/admin/suggestions', icon: BadgeCheck },
    ],
  },
  {
    label: 'Quản trị',
    items: [
      { name: 'Tài khoản', path: '/admin/users', icon: Users },
      { name: 'Danh mục', path: '/admin/categories', icon: Tags },
      { name: 'Xuất báo cáo', path: '/admin/reports', icon: BarChart3 },
      { name: 'Demo API (CRUD)', path: '/admin/demo-products', icon: Code2 },
    ],
  },
];

export const ROLE_HOME = {
  CANDIDATE: '/candidate/dashboard',
  EMPLOYER: '/employer/dashboard',
  ADMIN: '/admin/dashboard',
};

export const ROLE_LABEL = {
  CANDIDATE: 'Ứng viên',
  EMPLOYER: 'Nhà tuyển dụng',
  ADMIN: 'Quản trị viên',
};

/** Trả về path của mục đang active theo tiền tố dài nhất (vd /employer/jobs/edit/3 → /employer/jobs). */
export function findActivePath(pathname, paths) {
  let best = null;
  for (const p of paths) {
    if (pathname === p || pathname.startsWith(p + '/')) {
      if (!best || p.length > best.length) best = p;
    }
  }
  return best;
}
