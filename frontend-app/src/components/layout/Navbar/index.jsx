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

  // Render Workspace Badge ở giữa Navbar
  const renderWorkspaceBadge = () => {
    if (!isAuthenticated) return null;

    switch (role) {
      case 'ADMIN':
        return (
          <div className="flex items-center px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-red-600 mr-2 animate-pulse"></span>
            Admin Workspace
          </div>
        );
      case 'EMPLOYER':
        return (
          <div className="flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold tracking-wider uppercase">
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            Employer Portal
          </div>
        );
      case 'CANDIDATE':
        return (
          <div className="flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold tracking-wider uppercase">
            Candidate Space
          </div>
        );
      default:
        return null;
    }
  };

  // Render các Link trung tâm tùy theo Role
  const renderCenterLinks = () => {
    // 1. Nếu KHÔNG đăng nhập -> Trả về null (Không hiển thị gì ở giữa)
    if (!isAuthenticated) return null;

    // 2. Nếu là ADMIN hoặc EMPLOYER -> Chỉ hiển thị Badge phân quyền
    if (role === 'ADMIN' || role === 'EMPLOYER') return renderWorkspaceBadge();

    // 3. Nếu là CANDIDATE -> Mới thấy menu Việc Làm, Công Ty
    if (role === 'CANDIDATE') {
      return (
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/jobs" className={`font-medium transition-colors ${location.pathname.includes('/jobs') ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'}`}>
            Việc Làm
          </Link>
          <Link to="/companies" className={`font-medium transition-colors ${location.pathname.includes('/companies') ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'}`}>
            Công Ty
          </Link>
          {renderWorkspaceBadge()}
        </div>
      );
    }

    return null;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LEFT: Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to={getLogoLink()} className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-blue-800 transition-colors">
                S
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight group-hover:text-blue-700 transition-colors">
                SmartMatch
              </span>
            </Link>
          </div>

          {/* CENTER: Navigation & Badges (Đã được khóa theo logic mới) */}
          <div className="flex-1 flex justify-center">
            {renderCenterLinks()}
          </div>

          {/* RIGHT: Actions & Auth */}
          <div className="flex flex-shrink-0 items-center gap-4">
            {!isAuthenticated ? (
              // --- KHI CHƯA ĐĂNG NHẬP (Khách vãng lai: Chỉ có Đăng nhập / Đăng ký) ---
              <>
                <Link to="/auth/login" className="text-gray-700 font-medium px-4 py-2 hover:bg-gray-50 rounded-md transition-colors">
                  Đăng nhập
                </Link>
                <Link to="/auth/register" className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800 font-medium transition-colors shadow-sm">
                  Đăng ký
                </Link>
              </>
            ) : (
              // --- KHI ĐÃ ĐĂNG NHẬP (Dropdown Avatar) ---
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-1 pr-2 rounded-full border border-transparent hover:bg-gray-50 hover:border-gray-200 transition-all focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold uppercase ring-2 ring-white">
                    {displayName.charAt(0)}
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-700 leading-none">Chào, {displayName}</span>
                    <span className="text-xs text-gray-500 mt-1 leading-none capitalize">{role.toLowerCase()}</span>
                  </div>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100 transform opacity-100 scale-100 transition-all origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm leading-5 text-gray-900 font-medium">{currentUser?.email}</p>
                    </div>
                    
                    {role === 'CANDIDATE' && (
                      <Link to="/candidate/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700" onClick={() => setIsDropdownOpen(false)}>
                        Hồ sơ của tôi
                      </Link>
                    )}
                    {role === 'EMPLOYER' && (
                      <Link to="/employer/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700" onClick={() => setIsDropdownOpen(false)}>
                        Hồ sơ công ty
                      </Link>
                    )}
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                    >
                      Đăng xuất
                    </button>
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