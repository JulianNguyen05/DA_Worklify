import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Toast from '../../../components/common/Toast';
import candidateService from '../../../features/candidate/candidateService';
import authService from '../../../features/auth/authService';

const INITIAL_BLOCKS = [
  {
    id: 'block-profile',
    type: 'PROFILE',
    title: 'Thông tin cá nhân',
    color: '#ffffff',
    data: { fullName: '', phone: '', gender: 'Nam', dob: '', address: '' }
  },
  {
    id: 'block-skills',
    type: 'SKILLS',
    title: 'Kỹ năng chuyên môn',
    color: '#f8fafc',
    data: { skills: '' }
  },
  {
    id: 'block-experience',
    type: 'EXPERIENCE',
    title: 'Kinh nghiệm làm việc',
    color: '#ffffff',
    data: { content: '' }
  }
];

const CVBuilderPage = () => {
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.userId;

  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [activeBlockId, setActiveBlockId] = useState('block-profile');
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Refs cho Drag & Drop
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Gọi API lấy dữ liệu thực tế khi load trang
  useEffect(() => {
    if (!userId) return;

    const fetchInitialData = async () => {
      setIsFetching(true);
      try {
        const profileRes = await candidateService.getProfile(userId);
        if (profileRes.data) {
          setBlocks(prev => prev.map(b => {
            if (b.type === 'PROFILE') {
              return {
                ...b,
                data: {
                  fullName: profileRes.data.fullName || '',
                  phone: profileRes.data.phone || '',
                  gender: profileRes.data.gender || 'Nam',
                  dob: profileRes.data.dob || '',
                  address: profileRes.data.address || ''
                }
              };
            }
            return b;
          }));
        }
      } catch (error) {
        if (error.response?.status !== 404 && error.response?.status !== 400) {
          console.error("Lỗi tải dữ liệu Profile:", error);
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchInitialData();
  }, [userId]);

  // ===== LOGIC THÊM & XÓA KHỐI (NEW) =====
  const handleAddBlock = () => {
    const newBlockId = `block-custom-${Date.now()}`;
    const newBlock = {
      id: newBlockId,
      type: 'EXPERIENCE', // Tái sử dụng kiểu text cho Học vấn/Dự án/Kinh nghiệm
      title: 'Khối nội dung mới',
      color: '#ffffff',
      data: { content: '' }
    };
    setBlocks([...blocks, newBlock]);
    setActiveBlockId(newBlockId); // Tự động chọn khối vừa thêm
  };

  const handleDeleteBlock = (idToDelete) => {
    // Ngăn xóa khối Profile vì chứa thông tin bắt buộc
    if (idToDelete === 'block-profile') {
      setToast({ show: true, message: 'Không thể xóa khối Thông tin cá nhân.', type: 'error' });
      return;
    }
    setBlocks(blocks.filter(b => b.id !== idToDelete));
    if (activeBlockId === idToDelete) setActiveBlockId(null);
  };

  // ===== LOGIC KÉO THẢ =====
  const dragStart = (e, position) => {
    dragItem.current = position;
    e.target.style.opacity = '0.4';
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const dragEnd = (e) => {
    e.target.style.opacity = '1';
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    const copyBlocks = [...blocks];
    const dragItemContent = copyBlocks[dragItem.current];
    copyBlocks.splice(dragItem.current, 1);
    copyBlocks.splice(dragOverItem.current, 0, dragItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    setBlocks(copyBlocks);
  };

  // ===== LOGIC EDITOR =====
  const activeBlock = blocks.find(b => b.id === activeBlockId);

  const handleBlockChange = (field, value) => {
    setBlocks(prev => prev.map(b => b.id === activeBlockId ? { ...b, [field]: value } : b));
  };

  const handleDataChange = (field, value) => {
    setBlocks(prev => prev.map(b => b.id === activeBlockId ? { ...b, data: { ...b.data, [field]: value } } : b));
  };

  // ===== GỌI API LƯU DỮ LIỆU =====
  const handleSaveSandbox = async () => {
    if (!userId) {
      setToast({ show: true, type: 'error', message: 'Lỗi phiên đăng nhập!' });
      return;
    }

    setIsSaving(true);
    setToast({ show: false, message: '', type: 'info' });

    try {
      // 1. Trích xuất block Profile để lưu riêng vào bảng candidate_profiles
      const profileBlock = blocks.find(b => b.type === 'PROFILE');
      if (profileBlock) {
        const profileData = profileBlock.data;

        // [QUAN TRỌNG]: Kiểm tra rule @NotBlank của backend
        if (!profileData.fullName || profileData.fullName.trim() === '') {
          setToast({ show: true, type: 'error', message: 'Vui lòng nhập Họ và tên ở khối Thông tin cá nhân!' });
          setIsSaving(false);
          return;
        }

        // [QUAN TRỌNG]: Chuẩn hóa dữ liệu dob (LocalDate không nhận chuỗi rỗng)
        const payload = {
          ...profileData,
          dob: profileData.dob === '' ? null : profileData.dob
        };

        await candidateService.createOrUpdateProfile(userId, payload);
      }

      // 2. Chuyển toàn bộ cấu trúc CV thành JSON String và lưu vào cv_documents
      const cvJsonRawText = JSON.stringify(blocks);
      await candidateService.saveGeneratedCv(userId, cvJsonRawText);

      setToast({ show: true, message: 'Đã lưu CV và cập nhật hồ sơ thành công!', type: 'success' });
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      
      // Bắt lỗi Validation từ backend trả về để hiển thị Toast cho người dùng dễ hiểu
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu.';
      setToast({ show: true, message: errorMessage, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) return <div className="text-center py-10 text-gray-500">Đang tải Sandbox...</div>;

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Trình tạo Hồ sơ / CV Sandbox</h2>
          <p className="text-sm text-gray-500">Kéo thả để sắp xếp bố cục. Nhấp vào một khối để tùy chỉnh nội dung.</p>
        </div>
        <Button onClick={handleSaveSandbox} isLoading={isSaving}>Lưu Bản Thảo</Button>
      </div>

      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({show:false})} />}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* KHUNG CANVAS (TRÁI) */}
        <div className="flex-[2] w-full bg-gray-50 p-6 rounded-lg border border-gray-200 min-h-[600px] flex flex-col">
          <div className="space-y-4 flex-grow">
            {blocks.map((block, index) => (
              <div
                key={block.id} draggable
                onDragStart={(e) => dragStart(e, index)}
                onDragEnter={(e) => dragEnter(e, index)}
                onDragEnd={dragEnd}
                onClick={() => setActiveBlockId(block.id)}
                className={`relative group cursor-grab p-6 rounded-lg shadow-sm transition-all duration-200 border-2 
                  ${activeBlockId === block.id ? 'border-blue-500 scale-[1.01] z-10 shadow-md' : 'border-transparent hover:border-gray-300'}`}
                style={{ backgroundColor: block.color }}
              >
                {/* Drag Handle Icon */}
                <div className="absolute top-3 right-3 text-gray-300 group-hover:text-gray-500 cursor-grab bg-white rounded-full p-1 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
                </div>

                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">{block.title}</h3>
                
                {block.type === 'PROFILE' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <p><strong className="text-gray-500">Họ và tên:</strong> {block.data.fullName || '...'}</p>
                    <p><strong className="text-gray-500">Điện thoại:</strong> {block.data.phone || '...'}</p>
                    <p><strong className="text-gray-500">Giới tính:</strong> {block.data.gender}</p>
                    <p><strong className="text-gray-500">Ngày sinh:</strong> {block.data.dob || '...'}</p>
                    <p className="col-span-1 md:col-span-2"><strong className="text-gray-500">Địa chỉ:</strong> {block.data.address || '...'}</p>
                  </div>
                )}

                {block.type === 'SKILLS' && (
                  <div className="flex flex-wrap gap-2">
                    {block.data.skills.split(',').map((skill, i) => skill.trim() && (
                      <span key={i} className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {block.type === 'EXPERIENCE' && (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {block.data.content || 'Thêm mô tả (kinh nghiệm, học vấn, dự án...) của bạn...'}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          {/* NÚT THÊM KHỐI MỚI NẰM DƯỚI CÙNG CANVAS */}
          <button 
            onClick={handleAddBlock}
            className="mt-6 w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Thêm khối nội dung mới
          </button>
        </div>

        {/* KHUNG EDITOR (PHẢI) */}
        <div className="flex-[1] w-full bg-white p-5 rounded-lg shadow-sm border border-gray-100 sticky top-24">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              Tùy chỉnh
            </h3>
            
            {/* NÚT XÓA KHỐI (Chỉ hiện nếu không phải khối Profile) */}
            {activeBlock && activeBlock.id !== 'block-profile' && (
              <button 
                onClick={() => handleDeleteBlock(activeBlock.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                title="Xóa khối này"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Xóa
              </button>
            )}
          </div>

          {activeBlock ? (
            <div className="space-y-5">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Màu nền khối (Background)</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={activeBlock.color} onChange={(e) => handleBlockChange('color', e.target.value)} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
                  <span className="text-sm text-gray-500 font-mono uppercase">{activeBlock.color}</span>
                </div>
              </div>

              <Input label="Tiêu đề hiển thị" value={activeBlock.title} onChange={(e) => handleBlockChange('title', e.target.value)} />
              <hr className="border-gray-100" />

              {activeBlock.type === 'PROFILE' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin liên hệ</h4>
                  <Input label="Họ và tên" value={activeBlock.data.fullName} onChange={(e) => handleDataChange('fullName', e.target.value)} />
                  <Input label="Số điện thoại" value={activeBlock.data.phone} onChange={(e) => handleDataChange('phone', e.target.value)} />
                  <Input label="Ngày sinh" type="date" value={activeBlock.data.dob} onChange={(e) => handleDataChange('dob', e.target.value)} />
                  <Input label="Địa chỉ" value={activeBlock.data.address} onChange={(e) => handleDataChange('address', e.target.value)} />
                </div>
              )}

              {activeBlock.type === 'SKILLS' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kỹ năng</h4>
                  <textarea rows="3" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" value={activeBlock.data.skills} onChange={(e) => handleDataChange('skills', e.target.value)} placeholder="VD: Java, Docker, ReactJS" />
                </div>
              )}

              {activeBlock.type === 'EXPERIENCE' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nội dung chi tiết</h4>
                  <textarea rows="6" className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500" value={activeBlock.data.content} onChange={(e) => handleDataChange('content', e.target.value)} placeholder="Mô tả công việc, dự án hoặc thành tựu của bạn..." />
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-10">Vui lòng nhấp vào một khối bên trái để tùy chỉnh.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVBuilderPage;