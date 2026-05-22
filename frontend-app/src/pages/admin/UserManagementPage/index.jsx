import React, { useState, useEffect } from 'react';
import adminService from '../../../features/admin/adminService';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBanUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn khóa tài khoản này?')) return;
    
    try {
      await adminService.banUser(userId);
      setStatusMsg({ type: 'success', message: 'Đã khóa tài khoản thành công.' });
      fetchUsers();
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Không thể khóa tài khoản này.' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Quản lý Người dùng</h2>
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 font-medium text-gray-600">Họ và tên</th>
              <th className="p-3 font-medium text-gray-600">Email</th>
              <th className="p-3 font-medium text-gray-600">Vai trò</th>
              <th className="p-3 font-medium text-gray-600 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{user.fullName}</td>
                  <td className="p-3 text-gray-600">{user.email}</td>
                  <td className="p-3 text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">{user.role}</span>
                  </td>
                  <td className="p-3 flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => handleBanUser(user.id)} 
                      disabled={user.status === 'BANNED' || user.role === 'ADMIN'}
                      className="px-3 py-1 text-red-600 border-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {user.status === 'BANNED' ? 'Đã khóa' : 'Khóa (Ban)'}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;