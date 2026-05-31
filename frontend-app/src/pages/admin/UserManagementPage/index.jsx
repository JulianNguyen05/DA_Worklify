import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldAlert, ShieldCheck, Mail, ShieldBan, UserX } from 'lucide-react';
import adminService from '../../../features/admin/adminService';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // State quản lý bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'CANDIDATE', 'EMPLOYER', 'ADMIN'
  
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getUsers(0, 100);
      const data = res.data?.content || res.data || [];
      setUsers(data);
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', message: 'Lỗi khi tải danh sách người dùng.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Xử lý bộ lọc kết hợp: Tab Vai trò + Thanh tìm kiếm
  useEffect(() => {
    let result = users;

    // 1. Lọc theo Tab Vai trò
    if (activeTab !== 'ALL') {
      result = result.filter(u => u.role === activeTab);
    }

    // 2. Lọc theo Từ khóa tìm kiếm
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(u => 
        (u.email && u.email.toLowerCase().includes(lowerTerm)) || 
        (u.fullName && u.fullName.toLowerCase().includes(lowerTerm))
      );
    }

    setFilteredUsers(result);
  }, [searchTerm, activeTab, users]);

  const handleBanUser = async (userId) => {
    if (!window.confirm('Cảnh báo: Hành động này sẽ khóa tài khoản người dùng ngay lập tức. Bạn có chắc chắn?')) return;
    
    try {
      await adminService.banUser(userId);
      setStatusMsg({ type: 'success', message: 'Đã khóa tài khoản thành công.' });
      fetchUsers(); 
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Không thể khóa tài khoản này.' });
    }
  };

  const renderRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200"><ShieldCheck className="w-3.5 h-3.5" /> Quản trị viên</span>;
      case 'EMPLOYER':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200"><BriefcaseIcon className="w-3.5 h-3.5" /> Doanh nghiệp</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200"><UserIcon className="w-3.5 h-3.5" /> Ứng viên</span>;
    }
  };

  const renderStatusBadge = (status) => {
    if (status === 'BANNED') {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><ShieldBan className="w-3 h-3" /> Đã khóa</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><ShieldCheck className="w-3 h-3" /> Hoạt động</span>;
  };

  const tabs = [
    { id: 'ALL', label: 'Tất cả tài khoản' },
    { id: 'CANDIDATE', label: 'Ứng viên' },
    { id: 'EMPLOYER', label: 'Doanh nghiệp' },
    { id: 'ADMIN', label: 'Quản trị viên' }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-6">
      
      {/* Header Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-600" />
            Quản lý Người dùng
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Giám sát tài khoản, phân quyền và xử lý vi phạm trên hệ thống.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative z-10 w-full md:w-auto">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-3" />
            <input 
              type="text" 
              placeholder="Tìm theo Email hoặc Tên..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {statusMsg.type && (
        <Toast type={statusMsg.type} message={statusMsg.message} onClose={() => setStatusMsg({ type: null, message: '' })} />
      )}

      {/* Tabs Filter Section */}
      <div className="flex overflow-x-auto border-b border-gray-200 custom-scrollbar">
        <div className="flex gap-2 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 font-semibold text-sm whitespace-nowrap rounded-xl transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 border border-transparent'
              }`}
            >
              {tab.label}
              {/* Hiển thị số lượng nhỏ bên cạnh Tab "Tất cả" */}
              {tab.id === 'ALL' && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'ALL' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'}`}>
                  {users.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-gray-800">
            {activeTab === 'ALL' ? 'Danh sách Tất cả' : `Danh sách ${tabs.find(t => t.id === activeTab)?.label}`}
          </h3>
          <span className="text-xs font-semibold bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full shadow-sm">
            Hiển thị: {filteredUsers.length} kết quả
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4 w-1/3">Thông tin định danh</th>
                <th className="px-6 py-4">Phân quyền</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                // Skeleton Loading
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-100 rounded w-32"></div>
                          <div className="h-3 bg-gray-100 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-md w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-gray-100 rounded-full w-20 mx-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-100 rounded-md w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <UserX className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-lg font-bold text-gray-600">Không tìm thấy người dùng phù hợp</p>
                      <p className="text-sm text-gray-400">Vui lòng thay đổi từ khóa hoặc bộ lọc danh mục.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Render Data
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                          {(user.fullName || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {user.fullName || 'Chưa cập nhật tên'}
                          </p>
                          <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {renderRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {renderStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="outline" 
                        onClick={() => handleBanUser(user.id)} 
                        disabled={user.status === 'BANNED' || user.role === 'ADMIN'}
                        className="px-4 py-2 text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 disabled:opacity-40 disabled:hover:bg-white text-xs rounded-xl flex items-center gap-1.5 ml-auto shadow-sm transition-all"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        {user.status === 'BANNED' ? 'Đã bị khóa' : 'Khóa tài khoản'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* CSS cho thanh cuộn ngang của Tabs */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </div>
  );
}

// Icon Components
const BriefcaseIcon = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const UserIcon = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;