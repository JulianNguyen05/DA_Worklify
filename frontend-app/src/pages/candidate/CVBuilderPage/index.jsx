import React, { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import candidateService from '../../../features/candidate/candidateService';
import authService from '../../../features/auth/authService';

// IMPORT TÙNG COMPONENT DÙNG CHUNG (SHARED)
import {
  makeSkillBlock, makeProfileBlock, mapApiSkillsToBlocks,
  useDragSort, useBlockEditor,
  LoadingSpinner, ProfileBlockCard, SkillBlockCard,
  ProfileEditorPanel, SkillEditorPanel,
} from '../../../components/shared/cvProfileShared';

// ══════════════════════════════════════════════════════════════════════════
// ─── VIEW 1: COMPONENT HIỂN THỊ XEM TRƯỚC CV (PREVIEW RENDER)
// ══════════════════════════════════════════════════════════════════════════
const CvPreviewRender = ({ rawText }) => {
  if (!rawText) return <p className="text-gray-500 text-center py-4">Bản thảo này chưa có dữ liệu thiết kế.</p>;
  try {
    const blocks = JSON.parse(rawText);
    const profileBlock = blocks.find(b => b.type === 'PROFILE');
    const skillBlocks = blocks.filter(b => b.type === 'SKILLS');

    return (
      <div className="space-y-6 text-gray-800">
        {profileBlock && (
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-blue-700 uppercase tracking-wide">
              {profileBlock.data.fullName || 'Chưa nhập Họ tên'}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-gray-600">
              {profileBlock.data.phone && <p>📞 {profileBlock.data.phone}</p>}
              {profileBlock.data.email && <p>✉️ {profileBlock.data.email}</p>}
              {profileBlock.data.address && <p>📍 {profileBlock.data.address}</p>}
              {profileBlock.data.dob && <p>🎂 {profileBlock.data.dob}</p>}
            </div>
            {profileBlock.data.summary && (
              <div className="mt-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-2">Giới thiệu bản thân</h3>
                <p className="text-sm leading-relaxed">{profileBlock.data.summary}</p>
              </div>
            )}
          </div>
        )}
        {skillBlocks.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-blue-700 uppercase border-b-2 border-blue-100 inline-block pb-1 mb-4">
              Kỹ năng chuyên môn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillBlocks.map(skill => (
                <div key={skill.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">{skill.data.skillName}</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      {skill.data.level}
                    </span>
                  </div>
                  {skill.data.description && <p className="text-xs text-gray-600 leading-relaxed">{skill.data.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return <p className="text-red-500 text-center py-4">Lỗi định dạng cấu trúc dữ liệu CV.</p>;
  }
};

// ══════════════════════════════════════════════════════════════════════════
// ─── VIEW 2: COMPONENT THIẾT KẾ & CHỈNH SỬA CV (EDITOR VIEW)
// ══════════════════════════════════════════════════════════════════════════
const CvEditorView = ({ userId, loadFromLatestDraft, onBack, onSaveSuccess }) => {
  const [blocks, setBlocks] = useState([]); 
  const [cvTitle, setCvTitle] = useState('CV Bản thảo');
  const [activeBlockId, setActiveBlockId] = useState('block-profile');
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Hooks xử lý kéo thả và chỉnh sửa từ file shared dùng chung
  const { dragStart, dragEnter, dragEnd } = useDragSort(setBlocks);
  const {
    handleDataChange,
    handleSkillNameChange,
    handleAddSkill,
    handleDeleteBlock,
  } = useBlockEditor(activeBlockId, setBlocks, setActiveBlockId, setToast);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsFetching(true);
      try {
        let loadedFromDraft = false;

        // Nếu người dùng chọn xem/sửa bản thảo cũ, ưu tiên gọi API sandbox từ BE trước
        if (loadFromLatestDraft) {
          const latestCvRes = await candidateService.getLatestGeneratedCv(userId).catch(() => null);
          const latestCvData = latestCvRes?.data;
          
          if (latestCvData && latestCvData.rawText) {
            setCvTitle(latestCvData.title || 'CV Bản thảo từ hệ thống');
            setBlocks(JSON.parse(latestCvData.rawText));
            loadedFromDraft = true;
          }
        }

        // Nếu tạo mới hoàn toàn HOẶC trên BE chưa từng có bản thảo nào, tự động lấy Profile + Skills đổ vào làm gốc
        if (!loadedFromDraft) {
          const [profileRes, skillsRes] = await Promise.all([
            candidateService.getProfile(userId).catch(() => null),
            candidateService.getSkills(userId).catch(() => null)
          ]);
          
          const profileData = profileRes?.data || {};
          const skillsData = skillsRes?.data || [];
          
          // Khởi tạo khối bằng Factory function từ file shared
          const initialProfileBlock = makeProfileBlock(profileData);
          let initialSkillBlocks = [];
          
          if (skillsData.length > 0) {
            initialSkillBlocks = mapApiSkillsToBlocks(skillsData);
          } else {
            initialSkillBlocks = [makeSkillBlock()];
          }

          setBlocks([initialProfileBlock, ...initialSkillBlocks]);
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu thiết kế từ BE:', error);
        setToast({ show: true, type: 'error', message: 'Không thể đồng bộ dữ liệu từ máy chủ.' });
      } finally {
        setIsFetching(false);
      }
    };

    fetchInitialData();
  }, [userId, loadFromLatestDraft]);

  const handleSave = async () => {
    setIsSaving(true);
    setToast({ show: false, message: '', type: 'info' });
    try {
      const profileBlock = blocks.find(b => b.type === 'PROFILE');
      if (!profileBlock?.data?.fullName?.trim()) {
        setToast({ show: true, type: 'error', message: 'Họ và tên trong hồ sơ không được để trống!' });
        setIsSaving(false); 
        return;
      }
      
      // Khớp chính xác cấu trúc GeneratedCvRequest (chỉ đẩy chuỗi JSON rawText lên BE)
      const payload = {
        rawText: JSON.stringify(blocks)
      };

      // Gọi API: POST /api/v1/candidates/{userId}/cvs/generated
      await candidateService.saveGeneratedCv(userId, payload);
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: 'Lỗi đồng bộ máy chủ khi lưu bản thảo.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) return <LoadingSpinner text="Đang đồng bộ dữ liệu hồ sơ từ máy chủ..." />;

  const activeBlock = blocks.find(b => b.id === activeBlockId);
  const profileBlock = blocks.find(b => b.type === 'PROFILE');
  const skillBlocks  = blocks.filter(b => b.type === 'SKILLS');

  return (
    <div className="flex flex-col h-full space-y-4 animate-fade-in">
      {/* HEADER EDITOR */}
      <div className="flex justify-between items-center bg-white px-5 py-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 mr-4">
          <h2 className="text-xl font-bold text-gray-800">Trình Thiết kế CV Sandbox</h2>
          <p className="text-xs text-gray-400 mt-0.5">Dữ liệu chỉnh sửa sẽ được tự động đồng bộ vào bản thảo hệ thống.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onBack} variant="outline">Quay lại</Button>
          <Button onClick={handleSave} isLoading={isSaving}>Lưu vào hệ thống</Button>
        </div>
      </div>

      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ show: false })} />}

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* CANVAS THIẾT KẾ BÊN TRÁI */}
        <div className="flex-[2] w-full space-y-4">
          {profileBlock && (
            <ProfileBlockCard 
              profileBlock={profileBlock} 
              activeBlockId={activeBlockId} 
              onSelect={setActiveBlockId} 
            />
          )}

          <div className="space-y-3">
            {skillBlocks.map(block => (
              <SkillBlockCard
                key={block.id}
                block={block}
                globalIdx={blocks.findIndex(b => b.id === block.id)}
                activeBlockId={activeBlockId}
                onSelect={setActiveBlockId}
                dragStart={dragStart}
                dragEnter={dragEnter}
                dragEnd={dragEnd}
              />
            ))}
            <button onClick={handleAddSkill} className="w-full py-3 border-2 border-dashed rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 border-gray-300 transition-colors">
              + Thêm khối kỹ năng mới
            </button>
          </div>
        </div>

        {/* CỬA SỔ NHẬP LIỆU BÊN PHẢI */}
        <div className="flex-[1] w-full bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
          {activeBlock ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {activeBlock.type === 'PROFILE' ? 'Sửa thông tin cá nhân' : 'Sửa kỹ năng'}
                </p>
                {activeBlock.type !== 'PROFILE' && (
                  <button onClick={() => handleDeleteBlock(activeBlock.id)} className="text-red-500 text-xs hover:underline">
                    Xóa khối này
                  </button>
                )}
              </div>
              
              {activeBlock.type === 'PROFILE' && (
                <ProfileEditorPanel data={activeBlock.data} handleDataChange={handleDataChange} />
              )}
              
              {activeBlock.type === 'SKILLS' && (
                <SkillEditorPanel
                  data={activeBlock.data}
                  blockColor={activeBlock.color}
                  handleDataChange={handleDataChange}
                  handleSkillNameChange={handleSkillNameChange}
                  handleBlockChange={() => {}} 
                  showColorPicker={false}      
                />
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-10">Chọn một khối bất kỳ bên trái để chỉnh sửa</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// ─── MAIN COMPONENT: TRANG QUẢN LÝ DANH SÁCH CV (CV BUILDER PAGE)
// ══════════════════════════════════════════════════════════════════════════
const CVBuilderPage = () => {
  // LẤY USER ĐANG ĐĂNG NHẬP THỰC TẾ TỪ HỆ THỐNG AUTHENTICATION
  const currentUser = authService?.getCurrentUser ? authService.getCurrentUser() : null;
  const userId = currentUser?.userId || currentUser?.id;

  const [viewMode, setViewMode] = useState('LIST'); 
  const [loadFromLatestDraft, setLoadFromLatestDraft] = useState(false);
  
  const [cvList, setCvList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [previewCv, setPreviewCv] = useState(null);

  const loadCvs = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      // Gọi đúng API: GET /api/v1/candidates/{userId}/cvs
      const res = await candidateService.getCvs(userId);
      const cvArray = res?.data || [];
      
      // Lọc danh sách các CV được sinh từ Sandbox hệ thống
      const generatedCvs = cvArray.filter(cv => cv.isGenerated);
      setCvList(generatedCvs);
    } catch (error) {
      console.error(error);
      setToast({ show: true, type: 'error', message: 'Không thể tải danh sách CV từ máy chủ.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    loadCvs(); 
  }, [userId]);

  // Ngăn chặn thao tác bừa bãi khi phiên làm việc bị trống (Tránh Mock Data ID)
  if (!userId) {
    return (
      <div className="p-8 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium text-center max-w-xl mx-auto my-12 shadow-sm">
        ⚠️ Phiên làm việc không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập tài khoản Ứng viên để sử dụng trình thiết kế CV!
      </div>
    );
  }

  const handleCreateNew = () => { 
    setLoadFromLatestDraft(false); // Tạo từ form gốc lấy thông tin Profile hiện tại
    setViewMode('EDIT'); 
  };
  
  const handleEditLatestDraft = () => { 
    setLoadFromLatestDraft(true);  // Load dữ liệu thô JSON đã lưu lần trước từ BE
    setViewMode('EDIT'); 
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ show: false })} />}

      {viewMode === 'EDIT' ? (
        <CvEditorView 
          userId={userId} 
          loadFromLatestDraft={loadFromLatestDraft} 
          onBack={() => setViewMode('LIST')} 
          onSaveSuccess={() => {
            setToast({ show: true, type: 'success', message: 'Đã cập nhật dữ liệu CV vào máy chủ thành công!' });
            setViewMode('LIST');
            loadCvs();
          }} 
        />
      ) : (
        <>
          {/* TIÊU ĐỀ TRANG DANH SÁCH */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Hồ sơ thiết kế CV</h2>
              <p className="text-sm text-gray-500 mt-1">Sử dụng dữ liệu Hồ sơ năng lực thực tế để tạo lập cấu trúc CV chuyên nghiệp.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEditLatestDraft}>✏️ Tiếp tục sửa bản thảo cũ</Button>
              <Button onClick={handleCreateNew}>+ Thiết kế CV mới</Button>
            </div>
          </div>

          {/* HIỂN THỊ DANH SÁCH CV TỪ BE */}
          {isLoading ? (
            <LoadingSpinner text="Đang đồng bộ danh sách CV..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Thẻ tạo mới nhanh */}
              <div onClick={handleCreateNew} className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 group transition-all">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <span className="text-2xl text-blue-500">+</span>
                </div>
                <p className="mt-4 font-semibold text-gray-600 group-hover:text-blue-600">Thiết kế CV mới từ Profile</p>
              </div>

              {/* Danh sách CV từ cơ sở dữ liệu */}
              {cvList.map((cv, idx) => (
                <div key={cv.id || idx} className="bg-white border border-gray-200 rounded-xl shadow-sm h-64 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="h-24 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-lg truncate">
                      {cv.title || cv.fileName || `Bản CV hệ thống #${idx + 1}`}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Cập nhật: {cv.updatedAt ? new Date(cv.updatedAt).toLocaleString() : new Date(cv.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-auto flex gap-2">
                      <button onClick={() => setPreviewCv(cv)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 text-sm rounded-lg font-medium transition-colors">
                        👁️ Xem nhanh
                      </button>
                      <button onClick={handleEditLatestDraft} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 text-sm rounded-lg font-medium transition-colors">
                        ✏️ Chỉnh sửa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MODAL XEM TRƯỚC (PREVIEW MODAL) */}
          {previewCv && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
              <div className="bg-white w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl flex flex-col relative animate-fade-in">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                  <h3 className="font-bold text-lg">Bản xem trước dữ liệu: {previewCv.title || 'CV ứng viên'}</h3>
                  <button onClick={() => setPreviewCv(null)} className="text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors">&times;</button>
                </div>
                <div className="p-8 overflow-y-auto flex-1 bg-white">
                   <CvPreviewRender rawText={previewCv.rawText} />
                </div>
                <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
                  <Button onClick={() => setPreviewCv(null)} variant="outline">Đóng</Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CVBuilderPage;