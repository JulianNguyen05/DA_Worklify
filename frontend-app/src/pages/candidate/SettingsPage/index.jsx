import React, { useState } from 'react';
import authService from '../../../features/auth/authService';

export default function SettingsPage() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Kiểm tra khớp mật khẩu ở phía Frontend
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setIsLoading(true);
        try {
            // Lấy userId từ localStorage
            const currentUser = authService.getCurrentUser();
            if (!currentUser || !currentUser.userId) {
                setError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
                return;
            }

            // Gọi API
            await authService.changePassword(currentUser.userId, {
                oldPassword: oldPassword,
                newPassword: newPassword
            });
            
            setMessage('Đổi mật khẩu thành công!');
            // Reset form
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
        } catch (err) {
            // Bắt lỗi từ backend (ví dụ: Sai mật khẩu cũ)
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi đổi mật khẩu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="settings-page" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                Cài đặt bảo mật
            </h2>
            
            <div className="change-password-section">
                <h3 style={{ marginBottom: '15px', color: '#333' }}>Đổi mật khẩu</h3>
                
                {/* Hiển thị thông báo */}
                {message && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px' }}>{message}</div>}
                {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Mật khẩu hiện tại <span style={{ color: 'red' }}>*</span></label>
                        <input 
                            type="password" 
                            value={oldPassword} 
                            onChange={(e) => setOldPassword(e.target.value)} 
                            required 
                            placeholder="Nhập mật khẩu hiện tại"
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Mật khẩu mới <span style={{ color: 'red' }}>*</span></label>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                            placeholder="Nhập mật khẩu mới"
                            minLength={6}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Xác nhận mật khẩu mới <span style={{ color: 'red' }}>*</span></label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            placeholder="Nhập lại mật khẩu mới"
                            minLength={6}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        style={{ 
                            padding: '10px 20px', 
                            backgroundColor: isLoading ? '#ccc' : '#007bff', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Lưu mật khẩu mới'}
                    </button>
                </form>
            </div>
        </div>
    );
}