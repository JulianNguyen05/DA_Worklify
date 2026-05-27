import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../../features/auth/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Lấy thông tin từ localStorage thông qua authService
  const currentUser = authService.getCurrentUser();
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');
  const isAuthenticated = !!token;

  // Lấy tên người dùng
  const displayName = currentUser?.fullName || currentUser?.email?.split('@')[0] || 'bạn';

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logic đích đến của Logo
  const getLogoLink = () => {
    if (!isAuthenticated) return '/';
    if (role === 'CANDIDATE') return '/candidate/dashboard';
    if (role === 'EMPLOYER') return '/employer/dashboard';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/'; 
  };

  const handleLogout = () => {
    authService.logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  // Render Workspace Badge ở giữa Navbar (Phong cách SaaS hiện đại)
  const renderWorkspaceBadge = () => {
    if (!isAuthenticated) return null;

    switch (role) {
      case 'ADMIN':
        return (
          <div className="flex items-center px-3.5 py-1.5 bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2] rounded-full text-[11px] font-bold tracking-widest uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] mr-2.5 animate-pulse"></span>
            Admin Workspace
          </div>
        );
      case 'EMPLOYER':
        return (
          <div className="flex items-center px-3.5 py-1.5 bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded-full text-[11px] font-bold tracking-widest uppercase shadow-sm">
            <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            Employer Portal
          </div>
        );
      case 'CANDIDATE':
        return (
          <div className="flex items-center px-3.5 py-1.5 bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1] rounded-full text-[11px] font-bold tracking-widest uppercase shadow-sm">
            <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Candidate Space
          </div>
        );
      default:
        return null;
    }
  };

  const renderCenterLinks = () => {
    if (!isAuthenticated) return null;
    if (role === 'ADMIN' || role === 'EMPLOYER' || role === 'CANDIDATE') return renderWorkspaceBadge();
    return null;
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-[#E2E8F0] sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px] items-center">
          
          {/* LEFT: Chuẩn Logo Worklify mới */}
          <div className="flex-shrink-0 flex items-center">
            <Link to={getLogoLink()} className="flex items-center gap-[10px] group no-underline">
              <div 
                className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200"
                style={{ 
                  background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.25)' 
                }}
              >
                <span className="text-white font-black text-[16px] tracking-[-0.5px]">W</span>
              </div>
              <span className="font-extrabold text-[19px] tracking-[-0.5px] text-[#0F172A]">
                Work<span className="text-[#2563EB]">lify</span>
              </span>
            </Link>
          </div>

          {/* CENTER: Badges */}
          <div className="flex-1 flex justify-center">
            {renderCenterLinks()}
          </div>

          {/* RIGHT: Actions & Auth */}
          <div className="flex flex-shrink-0 items-center gap-4">
            {!isAuthenticated ? (
              // --- KHI CHƯA ĐĂNG NHẬP ---
              <div className="flex items-center gap-2">
                <Link 
                  to="/auth/login" 
                  className="text-[14px] font-bold text-[#64748B] hover:text-[#0F172A] px-4 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors no-underline"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/auth/register" 
                  className="text-white px-5 py-2.5 rounded-xl font-bold transition-all duration-200 text-[14px] no-underline"
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.4)'; 
                    e.currentTarget.style.transform = 'translateY(-1px)'; 
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.25)'; 
                    e.currentTarget.style.transform = 'translateY(0)'; 
                  }}
                >
                  Đăng ký miễn phí
                </Link>
              </div>
            ) : (
              // --- KHI ĐÃ ĐĂNG NHẬP (Dropdown Avatar Cao Cấp) ---
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-transparent hover:bg-[#F8FAFC] hover:border-[#E2E8F0] transition-all focus:outline-none group"
                >
                  {/* Avatar Circle Gradient */}
                  <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-tr from-[#2563EB] to-[#14B8A6] text-white flex items-center justify-center font-bold text-[15px] uppercase shadow-md ring-2 ring-white">
                    {displayName.charAt(0)}
                  </div>
                  
                  {/* Tên & Quyền */}
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-[14px] font-bold text-[#0F172A] leading-tight group-hover:text-[#2563EB] transition-colors">
                      {displayName}
                    </span>
                    <span className="text-[12px] font-medium text-[#64748B] leading-tight capitalize mt-0.5">
                      {role.toLowerCase()}
                    </span>
                  </div>
                  <svg className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#2563EB]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-2 border border-[#E2E8F0] transform opacity-100 scale-100 transition-all origin-top-right z-50">
                    <div className="px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]/50 rounded-t-2xl">
                      <p className="text-[13px] text-[#64748B] font-medium truncate">Tài khoản của bạn</p>
                      <p className="text-[14px] leading-6 text-[#0F172A] font-bold truncate mt-0.5">{currentUser?.email}</p>
                    </div>
                    
                    <div className="py-1.5">
                      {role === 'CANDIDATE' && (
                        <Link to="/candidate/profile" className="flex items-center px-5 py-2.5 text-[14px] font-semibold text-[#334155] hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-colors" onClick={() => setIsDropdownOpen(false)}>
                          <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          Hồ sơ của tôi
                        </Link>
                      )}
                      {role === 'EMPLOYER' && (
                        <Link to="/employer/profile" className="flex items-center px-5 py-2.5 text-[14px] font-semibold text-[#334155] hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-colors" onClick={() => setIsDropdownOpen(false)}>
                          <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          Hồ sơ công ty
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-[#F1F5F9] pt-1.5 mt-1.5">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-5 py-2.5 text-[14px] text-[#DC2626] font-semibold hover:bg-[#FEF2F2] transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Đăng xuất hệ thống
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </header>
  );
}