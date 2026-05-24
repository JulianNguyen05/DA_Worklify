import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import candidateService from '../../../features/candidate/candidateService';
import authService from '../../../features/auth/authService';

const TabButton = ({ active, onClick, children, icon }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
      borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer',
      fontWeight: active ? 600 : 400, fontSize: '14px',
      background: active ? '#fff' : 'transparent',
      color: active ? '#2563eb' : '#6b7280',
      borderBottom: active ? '2px solid #2563eb' : '2px solid transparent',
      transition: 'all 0.15s',
    }}
  >
    <span>{icon}</span>{children}
  </button>
);

const SectionCard = ({ title, children }) => (
  <div style={{
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px',
    padding: '20px 24px', marginBottom: '16px',
  }}>
    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', marginBottom: '16px' }}>{title}</h3>
    {children}
  </div>
);

const UploadTab = ({ userId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [cvList, setCvList] = useState([]);
  const [actionId, setActionId] = useState(null); // Dùng chung cho Xóa/Sửa
  const [editingCv, setEditingCv] = useState(null); // Chứa thông tin CV đang sửa tên
  const fileInputRef = useRef(null);

  const loadCvs = async () => {
    try {
      setIsFetching(true);
      const res = await candidateService.getCvs(userId);
      setCvList(Array.isArray(res) ? res : res?.data || []);
    } catch {
      setStatus({ type: 'error', message: 'Không thể tải danh sách CV.' });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => { loadCvs(); }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'File vượt quá giới hạn 5MB.' });
      return;
    }
    setSelectedFile(file);
    setStatus({ type: null, message: '' });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    try {
      await candidateService.uploadCv(userId, selectedFile);
      setStatus({ type: 'success', message: 'Tải CV lên thành công!' });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadCvs();
    } catch {
      setStatus({ type: 'error', message: 'Lỗi tải lên. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (cvId) => {
    if (!window.confirm('Bạn có chắc muốn xóa CV này?')) return;
    setActionId(cvId);
    try {
      await candidateService.deleteCv(userId, cvId);
      setStatus({ type: 'success', message: 'Xóa CV thành công.' });
      await loadCvs();
    } catch {
      setStatus({ type: 'error', message: 'Xóa CV thất bại.' });
    } finally {
      setActionId(null);
    }
  };

  const handleRenameSubmit = async (cvId) => {
    if (!editingCv.newName.trim()) return setEditingCv(null);
    setActionId(cvId);
    try {
      await candidateService.renameCv(userId, cvId, editingCv.newName);
      setStatus({ type: 'success', message: 'Đổi tên CV thành công.' });
      await loadCvs();
    } catch {
      setStatus({ type: 'error', message: 'Lỗi khi đổi tên CV.' });
    } finally {
      setEditingCv(null);
      setActionId(null);
    }
  };

  return (
    <div>
      <SectionCard title="📤 Tải CV lên hệ thống">
        {status.type && (
          <div style={{ marginBottom: '14px' }}>
            <Toast type={status.type} message={status.message} />
          </div>
        )}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${selectedFile ? '#2563eb' : '#d1d5db'}`, borderRadius: '10px',
            padding: '28px', textAlign: 'center', cursor: 'pointer',
            background: selectedFile ? '#eff6ff' : '#f9fafb', marginBottom: '14px',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>{selectedFile ? '📄' : '📁'}</div>
          {selectedFile ? (
            <p style={{ fontWeight: 600, color: '#1d4ed8' }}>{selectedFile.name}</p>
          ) : (
            <>
              <p style={{ fontWeight: 500, color: '#374151' }}>Kéo thả hoặc click để chọn file</p>
              <p style={{ fontSize: '13px', color: '#9ca3af' }}>Hỗ trợ PDF, DOCX — Tối đa 5MB</p>
            </>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={handleUpload} isLoading={isLoading} disabled={!selectedFile || isLoading}>
            {isLoading ? 'Đang tải lên...' : 'Tải lên'}
          </Button>
          {selectedFile && (
            <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>
              Hủy
            </button>
          )}
        </div>
      </SectionCard>

      <SectionCard title="📋 CV đã lưu">
        {isFetching ? <p>Đang tải...</p> : cvList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}><p>Bạn chưa tải lên CV nào.</p></div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {cvList.map((cv) => (
              <li key={cv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <span style={{ fontSize: '22px' }}>{cv.fileName?.toLowerCase().endsWith('.pdf') ? '🔴' : '📘'}</span>
                  
                  {/* Edit Name UI */}
                  {editingCv?.id === cv.id ? (
                    <div style={{ display: 'flex', gap: '8px', flex: 1, marginRight: '20px' }}>
                      <input 
                        type="text" 
                        value={editingCv.newName} 
                        onChange={(e) => setEditingCv({...editingCv, newName: e.target.value})}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db', flex: 1 }}
                        autoFocus
                      />
                      <button onClick={() => handleRenameSubmit(cv.id)} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 10px', cursor: 'pointer' }}>Lưu</button>
                      <button onClick={() => setEditingCv(null)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '4px', padding: '0 10px', cursor: 'pointer' }}>Hủy</button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontWeight: 500, fontSize: '14px', color: '#1f2937', margin: 0 }}>{cv.fileName || 'CV Không tên'}</p>
                      {/* Đã sửa thành cv.createdAt để khớp BE */}
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                        {cv.createdAt ? new Date(cv.createdAt).toLocaleDateString('vi-VN') : ''}
                      </p>
                    </div>
                  )}
                </div>

                {!editingCv && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setEditingCv({ id: cv.id, newName: cv.fileName })} disabled={actionId === cv.id}
                      style={{ background: 'transparent', border: '1px solid #d1d5db', borderRadius: '6px', color: '#4b5563', padding: '5px 12px', fontSize: '13px', cursor: 'pointer' }}>
                      ✏️ Sửa tên
                    </button>
                    <button onClick={() => handleDelete(cv.id)} disabled={actionId === cv.id}
                      style={{ background: 'transparent', border: '1px solid #fca5a5', borderRadius: '6px', color: '#ef4444', padding: '5px 12px', fontSize: '13px', cursor: 'pointer' }}>
                      {actionId === cv.id ? '...' : 'Xóa'}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
};

const CVBuilderPage = () => {
  const currentUser = authService?.getCurrentUser ? authService.getCurrentUser() : null;
  const userId = currentUser?.userId || currentUser?.id;

  if (!userId) return <div style={{ textAlign: 'center', marginTop: '50px' }}><h2 style={{ color: '#ef4444' }}>Vui lòng đăng nhập.</h2></div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Quản lý CV</h1>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '24px', gap: '4px' }}>
        <TabButton active={true} onClick={() => {}} icon="📤">Tải lên CV</TabButton>
        <TabButton active={false} onClick={() => alert("Tính năng Thiết kế CV đang được phát triển.")} icon="✏️">
          Thiết kế CV <span style={{ fontSize: '10px', background: '#eab308', color: '#fff', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px' }}>Beta</span>
        </TabButton>
      </div>
      <UploadTab userId={userId} />
    </div>
  );
};

export default CVBuilderPage;