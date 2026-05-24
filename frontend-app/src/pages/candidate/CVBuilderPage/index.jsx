import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import candidateService from '../../../features/candidate/candidateService';
import authService from '../../../features/auth/authService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMPTY_CV = {
  title: '',
  fullName: '',
  email: '',
  phone: '',
  address: '',
  summary: '',
  skills: '',
  experiences: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
  educations: [{ school: '', degree: '', startDate: '', endDate: '' }],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const TabButton = ({ active, onClick, children, icon }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      borderRadius: '8px 8px 0 0',
      border: 'none',
      cursor: 'pointer',
      fontWeight: active ? 600 : 400,
      fontSize: '14px',
      background: active ? '#fff' : 'transparent',
      color: active ? '#2563eb' : '#6b7280',
      borderBottom: active ? '2px solid #2563eb' : '2px solid transparent',
      transition: 'all 0.15s',
    }}
  >
    <span>{icon}</span>
    {children}
  </button>
);

const SectionCard = ({ title, children }) => (
  <div style={{
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px 24px',
    marginBottom: '16px',
  }}>
    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', marginBottom: '16px' }}>{title}</h3>
    {children}
  </div>
);

const FormField = ({ label, children, required }) => (
  <div style={{ marginBottom: '14px' }}>
    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '5px' }}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
  color: '#1f2937',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: '80px' };

// ─── Tab 1: Upload CV File ─────────────────────────────────────────────────────

const UploadTab = ({ userId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [cvList, setCvList] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
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
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setStatus({ type: 'error', message: 'File vượt quá giới hạn 5MB.' });
      return;
    }
    setSelectedFile(file);
    setStatus({ type: null, message: '' });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setStatus({ type: null, message: '' });
    try {
      await candidateService.uploadCv(userId, selectedFile);
      setStatus({ type: 'success', message: 'Tải CV lên thành công!' });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadCvs();
    } catch {
      setStatus({ type: 'error', message: 'Lỗi định dạng hoặc dung lượng file quá lớn.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (cvId) => {
    if (!window.confirm('Bạn có chắc muốn xóa CV này?')) return;
    setDeletingId(cvId);
    try {
      await candidateService.deleteCv(userId, cvId);
      setStatus({ type: 'success', message: 'Xóa CV thành công.' });
      await loadCvs();
    } catch {
      setStatus({ type: 'error', message: 'Xóa CV thất bại.' });
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    return bytes > 1024 * 1024
      ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div>
      {/* Upload zone */}
      <SectionCard title="📤 Tải CV lên hệ thống">
        {status.type && (
          <div style={{ marginBottom: '14px' }}>
            <Toast type={status.type} message={status.message} />
          </div>
        )}

        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${selectedFile ? '#2563eb' : '#d1d5db'}`,
            borderRadius: '10px',
            padding: '28px',
            textAlign: 'center',
            cursor: 'pointer',
            background: selectedFile ? '#eff6ff' : '#f9fafb',
            transition: 'all 0.2s',
            marginBottom: '14px',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>
            {selectedFile ? '📄' : '📁'}
          </div>
          {selectedFile ? (
            <>
              <p style={{ fontWeight: 600, color: '#1d4ed8', marginBottom: '4px' }}>{selectedFile.name}</p>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>{formatFileSize(selectedFile.size)}</p>
            </>
          ) : (
            <>
              <p style={{ fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Kéo thả hoặc click để chọn file</p>
              <p style={{ fontSize: '13px', color: '#9ca3af' }}>Hỗ trợ PDF, DOCX — Tối đa 5MB</p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            onClick={handleUpload}
            isLoading={isLoading}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? 'Đang tải lên...' : 'Tải lên'}
          </Button>
          {selectedFile && (
            <button
              onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              style={{
                padding: '8px 16px', background: 'transparent', border: '1px solid #d1d5db',
                borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#6b7280',
              }}
            >
              Hủy
            </button>
          )}
        </div>
      </SectionCard>

      {/* CV list */}
      <SectionCard title="📋 CV đã lưu">
        {isFetching ? (
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Đang tải...</p>
        ) : cvList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>📭</div>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Bạn chưa tải lên CV nào.</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {cvList.map((cv) => (
              <li
                key={cv.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>
                    {cv.fileName?.endsWith('.pdf') ? '🔴' : '📘'}
                  </span>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: '14px', color: '#1f2937', margin: 0 }}>
                      {cv.fileName}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                      {cv.uploadedAt ? new Date(cv.uploadedAt).toLocaleDateString('vi-VN') : ''}
                      {cv.fileSize ? ` · ${formatFileSize(cv.fileSize)}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cv.id)}
                  disabled={deletingId === cv.id}
                  style={{
                    background: 'transparent',
                    border: '1px solid #fca5a5',
                    borderRadius: '6px',
                    color: '#ef4444',
                    padding: '5px 12px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    opacity: deletingId === cv.id ? 0.5 : 1,
                  }}
                >
                  {deletingId === cv.id ? '...' : 'Xóa'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
};

// ─── Tab 2: CV Builder Form ────────────────────────────────────────────────────

const BuilderTab = ({ userId }) => {
  const [form, setForm] = useState(EMPTY_CV);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [editingCvId, setEditingCvId] = useState(null);
  const [savedCvs, setSavedCvs] = useState([]);

  const loadGeneratedCvs = async () => {
    try {
      setIsFetching(true);
      const res = await candidateService.getCvs(userId);
      const list = Array.isArray(res) ? res : res?.data || [];
      // Lọc CV tự thiết kế (không có file đính kèm)
      setSavedCvs(list.filter((c) => !c.fileName || c.isGenerated));
    } catch {
      // ignore
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => { loadGeneratedCvs(); }, [userId]);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const setExp = (index, field, value) => {
    const updated = [...form.experiences];
    updated[index] = { ...updated[index], [field]: value };
    setField('experiences', updated);
  };

  const setEdu = (index, field, value) => {
    const updated = [...form.educations];
    updated[index] = { ...updated[index], [field]: value };
    setField('educations', updated);
  };

  const addExp = () => setField('experiences', [
    ...form.experiences,
    { company: '', position: '', startDate: '', endDate: '', description: '' },
  ]);

  const removeExp = (i) => setField('experiences', form.experiences.filter((_, idx) => idx !== i));

  const addEdu = () => setField('educations', [
    ...form.educations,
    { school: '', degree: '', startDate: '', endDate: '' },
  ]);

  const removeEdu = (i) => setField('educations', form.educations.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!form.fullName || !form.email) {
      setStatus({ type: 'error', message: 'Vui lòng điền Họ tên và Email.' });
      return;
    }
    setIsLoading(true);
    setStatus({ type: null, message: '' });
    try {
      const payload = {
        title: form.title || 'CV Bản thảo',
        rawText: JSON.stringify(form),
      };
      if (editingCvId) {
        await candidateService.updateCv(userId, editingCvId, payload);
        setStatus({ type: 'success', message: 'Cập nhật CV thành công!' });
      } else {
        const res = await candidateService.createCv(userId, payload);
        setEditingCvId(res?.id || res?.data?.id || null);
        setStatus({ type: 'success', message: 'Tạo CV thành công!' });
      }
      await loadGeneratedCvs();
    } catch (error) {
      console.error('Lỗi khi lưu CV:', error);
      setStatus({ type: 'error', message: 'Lưu CV thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewCv = () => {
    setForm(EMPTY_CV);
    setEditingCvId(null);
    setStatus({ type: null, message: '' });
  };

  const handleEditCv = async (cv) => {
    setIsLoading(true);
    try {
      const res = await candidateService.getCvDetail(userId, cv.id);
      const data = res?.data || res;
      let parsedForm = EMPTY_CV;
      if (data.rawText) {
        try {
          parsedForm = JSON.parse(data.rawText);
        } catch (e) {
          console.error('Lỗi parse JSON từ Backend:', e);
        }
      }
      setForm({
        title: data.title || parsedForm.title || '',
        fullName: parsedForm.fullName || '',
        email: parsedForm.email || '',
        phone: parsedForm.phone || '',
        address: parsedForm.address || '',
        summary: parsedForm.summary || '',
        skills: parsedForm.skills || '',
        experiences: parsedForm.experiences?.length ? parsedForm.experiences : EMPTY_CV.experiences,
        educations: parsedForm.educations?.length ? parsedForm.educations : EMPTY_CV.educations,
      });
      setEditingCvId(cv.id);
      setStatus({ type: null, message: '' });
    } catch {
      setStatus({ type: 'error', message: 'Không thể tải thông tin CV.' });
    } finally {
      setIsLoading(false);
    }
  };

  const twoColGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' };

  return (
    <div>
      {status.type && (
        <div style={{ marginBottom: '14px' }}>
          <Toast type={status.type} message={status.message} />
        </div>
      )}

      {/* Saved CVs selector */}
      {!isFetching && savedCvs.length > 0 && (
        <SectionCard title="📂 CV đã thiết kế">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            {savedCvs.map((cv) => (
              <button
                key={cv.id}
                onClick={() => handleEditCv(cv)}
                style={{
                  padding: '6px 14px',
                  border: `1px solid ${editingCvId === cv.id ? '#2563eb' : '#d1d5db'}`,
                  borderRadius: '20px',
                  background: editingCvId === cv.id ? '#eff6ff' : '#fff',
                  color: editingCvId === cv.id ? '#1d4ed8' : '#374151',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: editingCvId === cv.id ? 600 : 400,
                }}
              >
                {cv.title || `CV #${cv.id}`}
              </button>
            ))}
            <button
              onClick={handleNewCv}
              style={{
                padding: '6px 14px',
                border: '1px dashed #d1d5db',
                borderRadius: '20px',
                background: 'transparent',
                color: '#6b7280',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              + Tạo mới
            </button>
          </div>
        </SectionCard>
      )}

      {/* Thông tin cơ bản */}
      <SectionCard title="👤 Thông tin cá nhân">
        <FormField label="Tiêu đề CV">
          <input
            style={inputStyle}
            placeholder="VD: CV Lập trình viên Front-end"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
          />
        </FormField>
        <div style={twoColGrid}>
          <FormField label="Họ và tên" required>
            <input
              style={inputStyle}
              placeholder="Nguyễn Văn A"
              value={form.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
            />
          </FormField>
          <FormField label="Email" required>
            <input
              type="email"
              style={inputStyle}
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
            />
          </FormField>
          <FormField label="Số điện thoại">
            <input
              style={inputStyle}
              placeholder="0901 234 567"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
            />
          </FormField>
          <FormField label="Địa chỉ">
            <input
              style={inputStyle}
              placeholder="TP. Hồ Chí Minh"
              value={form.address}
              onChange={(e) => setField('address', e.target.value)}
            />
          </FormField>
        </div>
        <FormField label="Giới thiệu bản thân">
          <textarea
            style={textareaStyle}
            placeholder="Mô tả ngắn gọn về kinh nghiệm, mục tiêu nghề nghiệp..."
            value={form.summary}
            onChange={(e) => setField('summary', e.target.value)}
          />
        </FormField>
      </SectionCard>

      {/* Kỹ năng */}
      <SectionCard title="🛠️ Kỹ năng">
        <FormField label="Kỹ năng (mỗi kỹ năng cách nhau bằng dấu phẩy)">
          <textarea
            style={textareaStyle}
            placeholder="VD: React, Node.js, SQL, Figma, Giao tiếp nhóm..."
            value={form.skills}
            onChange={(e) => setField('skills', e.target.value)}
          />
        </FormField>
      </SectionCard>

      {/* Kinh nghiệm */}
      <SectionCard title="💼 Kinh nghiệm làm việc">
        {form.experiences.map((exp, i) => (
          <div
            key={i}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px',
              background: '#f9fafb',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                Kinh nghiệm {i + 1}
              </span>
              {form.experiences.length > 1 && (
                <button
                  onClick={() => removeExp(i)}
                  style={{
                    background: 'transparent', border: 'none', color: '#ef4444',
                    cursor: 'pointer', fontSize: '13px',
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
            <div style={twoColGrid}>
              <FormField label="Tên công ty">
                <input
                  style={inputStyle}
                  placeholder="Công ty ABC"
                  value={exp.company}
                  onChange={(e) => setExp(i, 'company', e.target.value)}
                />
              </FormField>
              <FormField label="Chức vụ">
                <input
                  style={inputStyle}
                  placeholder="Lập trình viên"
                  value={exp.position}
                  onChange={(e) => setExp(i, 'position', e.target.value)}
                />
              </FormField>
              <FormField label="Từ tháng">
                <input
                  type="month"
                  style={inputStyle}
                  value={exp.startDate}
                  onChange={(e) => setExp(i, 'startDate', e.target.value)}
                />
              </FormField>
              <FormField label="Đến tháng">
                <input
                  type="month"
                  style={inputStyle}
                  value={exp.endDate}
                  onChange={(e) => setExp(i, 'endDate', e.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Mô tả công việc">
              <textarea
                style={textareaStyle}
                placeholder="Mô tả nhiệm vụ, thành tích nổi bật..."
                value={exp.description}
                onChange={(e) => setExp(i, 'description', e.target.value)}
              />
            </FormField>
          </div>
        ))}
        <button
          onClick={addExp}
          style={{
            border: '1px dashed #2563eb', background: '#eff6ff', color: '#2563eb',
            borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px',
          }}
        >
          + Thêm kinh nghiệm
        </button>
      </SectionCard>

      {/* Học vấn */}
      <SectionCard title="🎓 Học vấn">
        {form.educations.map((edu, i) => (
          <div
            key={i}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px',
              background: '#f9fafb',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                Học vấn {i + 1}
              </span>
              {form.educations.length > 1 && (
                <button
                  onClick={() => removeEdu(i)}
                  style={{
                    background: 'transparent', border: 'none', color: '#ef4444',
                    cursor: 'pointer', fontSize: '13px',
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
            <div style={twoColGrid}>
              <FormField label="Trường / Tổ chức">
                <input
                  style={inputStyle}
                  placeholder="Đại học Bách Khoa"
                  value={edu.school}
                  onChange={(e) => setEdu(i, 'school', e.target.value)}
                />
              </FormField>
              <FormField label="Bằng cấp / Chứng chỉ">
                <input
                  style={inputStyle}
                  placeholder="Cử nhân CNTT"
                  value={edu.degree}
                  onChange={(e) => setEdu(i, 'degree', e.target.value)}
                />
              </FormField>
              <FormField label="Từ năm">
                <input
                  type="month"
                  style={inputStyle}
                  value={edu.startDate}
                  onChange={(e) => setEdu(i, 'startDate', e.target.value)}
                />
              </FormField>
              <FormField label="Đến năm">
                <input
                  type="month"
                  style={inputStyle}
                  value={edu.endDate}
                  onChange={(e) => setEdu(i, 'endDate', e.target.value)}
                />
              </FormField>
            </div>
          </div>
        ))}
        <button
          onClick={addEdu}
          style={{
            border: '1px dashed #2563eb', background: '#eff6ff', color: '#2563eb',
            borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px',
          }}
        >
          + Thêm học vấn
        </button>
      </SectionCard>

      {/* Action */}
      <div style={{ display: 'flex', gap: '10px', paddingBottom: '24px' }}>
        <Button onClick={handleSave} isLoading={isLoading} disabled={isLoading}>
          {isLoading ? 'Đang lưu...' : editingCvId ? '💾 Cập nhật CV' : '💾 Lưu CV'}
        </Button>
        {editingCvId && (
          <button
            onClick={handleNewCv}
            style={{
              padding: '8px 18px', background: 'transparent',
              border: '1px solid #d1d5db', borderRadius: '6px',
              cursor: 'pointer', fontSize: '14px', color: '#6b7280',
            }}
          >
            + Tạo CV mới
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const CVBuilderPage = () => {
  const currentUser = authService?.getCurrentUser ? authService.getCurrentUser() : null;
  const userId = currentUser?.userId || currentUser?.id;
  const [activeTab, setActiveTab] = useState('upload');

  if (!userId) {
    return (
      <div style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444' }}>Vui lòng đăng nhập để sử dụng tính năng quản lý CV.</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>Quản lý CV</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Tải lên CV có sẵn hoặc thiết kế CV của bạn ngay trên hệ thống.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '24px', gap: '4px' }}>
        <TabButton active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon="📤">
          Tải lên CV
        </TabButton>
        <TabButton active={activeTab === 'builder'} onClick={() => setActiveTab('builder')} icon="✏️">
          Thiết kế CV
        </TabButton>
      </div>

      {activeTab === 'upload' ? <UploadTab userId={userId} /> : <BuilderTab userId={userId} />}
    </div>
  );
};

export default CVBuilderPage;
