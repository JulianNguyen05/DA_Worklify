import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jobService from '../../../features/job/jobService';
import authService from '../../../features/auth/authService';
import applicationService from '../../../features/application/applicationService';
import candidateService from '../../../features/candidate/candidateService'; // Giả sử bạn đã có service này
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Toast from '../../../components/common/Toast';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State cho ứng tuyển
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [cvList, setCvList] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const res = await jobService.getJobDetail(id);
      setJob(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenApplyModal = async () => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'CANDIDATE') {
      alert('Vui lòng đăng nhập với tài khoản Ứng viên!');
      navigate('/auth/login');
      return;
    }

    try {
      // Lấy danh sách CV của ứng viên
      const res = await candidateService.getMyCVs(user.userId);
      setCvList(res.data || []);
      setIsApplyModalOpen(true);
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Không thể tải danh sách CV.' });
    }
  };

  const handleApply = async () => {
    if (!selectedCvId) {
      setStatusMsg({ type: 'error', message: 'Vui lòng chọn CV để ứng tuyển!' });
      return;
    }

    try {
      const user = authService.getCurrentUser();
      await applicationService.submitApplication(user.userId, {
        jobId: job.id,
        cvId: selectedCvId,
        coverLetter: coverLetter
      });
      setStatusMsg({ type: 'success', message: 'Ứng tuyển thành công!' });
      setIsApplyModalOpen(false);
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Ứng tuyển thất bại.' });
    }
  };

  if (isLoading) return <div className="text-center py-20">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      {statusMsg.type && <Toast type={statusMsg.type} message={statusMsg.message} />}

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
        <p className="text-blue-600 font-medium mt-2">{job.companyName}</p>
        <Button onClick={handleOpenApplyModal} className="mt-6 px-8">Ứng tuyển ngay</Button>
      </div>

      {/* Modal chọn CV */}
      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title="Chọn CV ứng tuyển">
        <div className="flex flex-col gap-4">
          <select 
            className="border p-2 rounded" 
            onChange={(e) => setSelectedCvId(e.target.value)}
            value={selectedCvId}
          >
            <option value="">-- Chọn CV của bạn --</option>
            {cvList.map(cv => (
              <option key={cv.id} value={cv.id}>{cv.fileName || `CV ngày ${new Date(cv.createdAt).toLocaleDateString()}`}</option>
            ))}
          </select>
          <textarea 
            className="border p-2 rounded" 
            placeholder="Thư giới thiệu (tùy chọn)..."
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <Button onClick={handleApply}>Xác nhận nộp đơn</Button>
        </div>
      </Modal>
    </div>
  );
}