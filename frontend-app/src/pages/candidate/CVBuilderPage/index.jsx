import React, { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import candidateService from '../../../features/candidate/candidateService';

const CVBuilderPage = () => {
  const userId = 1; // Mock ID
  const [cvList, setCvList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const loadCvs = async () => {
    try {
      const res = await candidateService.getCvs(userId);
      setCvList(res.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách CV");
    }
  };

  useEffect(() => {
    loadCvs();
  }, [userId]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      await candidateService.uploadCv(userId, selectedFile);
      setStatus({ type: 'success', message: 'Tải CV lên thành công!' });
      setSelectedFile(null);
      loadCvs(); // Tải lại danh sách
    } catch (err) {
      setStatus({ type: 'error', message: 'Lỗi định dạng hoặc dung lượng file quá lớn.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tải CV lên hệ thống</h2>
        {status.type && <div className="mb-4"><Toast type={status.type} message={status.message} /></div>}
        
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <Button onClick={handleUpload} isLoading={isLoading} disabled={!selectedFile}>
            Tải lên
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Hỗ trợ định dạng PDF, DOCX (Tối đa 5MB).</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">CV Đã lưu</h3>
        {cvList.length === 0 ? (
          <p className="text-sm text-gray-500">Bạn chưa tải lên CV nào.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {cvList.map((cv) => (
              <li key={cv.id} className="py-3 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{cv.fileName}</span>
                <span className="text-xs text-gray-500">{new Date(cv.uploadedAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CVBuilderPage;