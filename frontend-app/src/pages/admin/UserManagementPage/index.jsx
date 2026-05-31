import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldAlert, ShieldCheck, Mail, Shield, ShieldBan, UserX } from 'lucide-react';
import adminService from '../../../features/admin/adminService';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getUsers(0, 100); // Lấy nhiều một chút để demo lọc local
      const data = res.data?.content || res.data || [];
      setUsers(data);
      setFilteredUsers(data);
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

  // Xử lý tìm kiếm Local
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = users.filter(u => 
      (u.email && u.email.toLowerCase().includes(lowerTerm)) || 
      (u.fullName && u.fullName.toLowerCase().includes(lowerTerm))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleBanUser = async (userId) => {
    if (!window.confirm('Cảnh báo: Hành động này sẽ khóa tài khoản người dùng ngay lập tức. Bạn có chắc chắn?')) return;
    
    try {
      await adminService.banUser(userId);
      setStatusMsg({ type: 'success', message: 'Đã khóa tài khoản thành công.' });
      fetchUsers(); // Tải lại danh sách để cập nhật UI
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Không thể khóa tài khoản này.' });
    }
  };

  // Helper render Badge Vai trò
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

  // Helper render Badge Trạng thái
  const renderStatusBadge = (status) => {
    if (status === 'BANNED') {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><ShieldBan className="w-3 h-3" /> Đã khóa</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><ShieldCheck className="w-3 h-3" /> Hoạt động</span>;
  };

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

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-gray-800">Danh sách Tài khoản</h3>
          <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
            Tổng: {users.length}
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
                      <p className="text-lg font-bold text-gray-600">Không tìm thấy người dùng</p>
                      <p className="text-sm text-gray-400">Thử tìm kiếm với từ khóa khác.</p>
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
    </div>
  );
}

// Icon Components phụ (Tách ra để dùng trong hàm)
const BriefcaseIcon = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const UserIcon = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;