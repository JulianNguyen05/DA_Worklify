import React, { useState, useEffect } from 'react';
import adminService from '../../../features/admin/adminService';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';

export default function JobModerationPage() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  // State cho Modal Chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // State cho Modal Từ chối
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getPendingJobs();
      // Chú ý: Backend nếu phân trang thì res.data.content, nếu trả List thì res.data
      setJobs(res.data.content || res.data || []);
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Lỗi tải danh sách tin tuyển dụng.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async (jobId) => {
    try {
      await adminService.moderateJob(jobId, 'APPROVED');
      setStatusMsg({ type: 'success', message: 'Đã phê duyệt tin tuyển dụng.' });
      setJobs(jobs.filter(j => j.id !== jobId));
      setIsDetailModalOpen(false);
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Thao tác thất bại.' });
    }
  };

  const handleOpenRejectModal = () => {
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      setStatusMsg({ type: 'error', message: 'Vui lòng nhập lý do từ chối.' });
      return;
    }
    
    try {
      await adminService.moderateJob(selectedJob.id, 'REJECTED', rejectReason);
      setStatusMsg({ type: 'success', message: 'Đã từ chối tin tuyển dụng.' });
      setJobs(jobs.filter(j => j.id !== selectedJob.id));
      setIsRejectModalOpen(false);
      setIsDetailModalOpen(false);
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Thao tác thất bại.' });
    }
  };

  const columns = [
    { header: 'Tiêu đề công việc', accessor: 'title', render: (row) => <span className="font-medium text-gray-800">{row.title}</span> },
    { header: 'Công ty', accessor: 'companyName' },
    { header: 'Mức lương', accessor: 'salaryRange', render: (row) => <span className="text-green-600 font-semibold">{row.salaryRange || 'Thỏa thuận'}</span> },
    { header: 'Ngày đăng', accessor: 'createdAt', render: (row) => <span>{new Date(row.createdAt).toLocaleDateString('vi-VN')}</span> },
    { 
      header: 'Hành động', 
      className: 'text-center',
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={() => handleViewDetails(row)} className="px-3 py-1 border-blue-600 text-blue-600 hover:bg-blue-50">
            Xem chi tiết
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Kiểm duyệt Tin tuyển dụng</h2>
      
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      <Table 
        columns={columns} 
        data={jobs} 
        isLoading={isLoading} 
        emptyMessage="Không có tin tuyển dụng nào chờ duyệt." 
      />

      {/* --- MODAL XEM CHI TIẾT TIN TUYỂN DỤNG --- */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Chi tiết bản mô tả công việc (JD)">
        {selectedJob && (
          <div className="flex flex-col gap-4 text-sm text-gray-700 max-h-[70vh] overflow-y-auto pr-2">
            
            <div className="border-b pb-3">
              <h3 className="text-xl font-bold text-blue-700">{selectedJob.title}</h3>
              <p className="text-gray-500 mt-1">{selectedJob.companyName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border">
              <div><span className="font-semibold text-gray-900">Mức lương:</span> {selectedJob.salaryRange || 'Thỏa thuận'}</div>
              <div><span className="font-semibold text-gray-900">Hình thức:</span> {selectedJob.workType || 'Toàn thời gian'}</div>
              <div className="col-span-2"><span className="font-semibold text-gray-900">Địa điểm:</span> {selectedJob.location}</div>
            </div>
            
            <div>
              <span className="font-semibold text-gray-900 block mb-1">Mô tả công việc:</span>
              <p className="whitespace-pre-wrap bg-white border p-3 rounded">{selectedJob.description || 'Không có mô tả.'}</p>
            </div>

            <div>
              <span className="font-semibold text-gray-900 block mb-1">Yêu cầu chuyên môn:</span>
              <p className="whitespace-pre-wrap bg-white border p-3 rounded">{selectedJob.requirements || 'Không có yêu cầu.'}</p>
            </div>

            <div className="flex justify-end gap-3 mt-4 border-t pt-4 sticky bottom-0 bg-white">
              <Button variant="outline" onClick={handleOpenRejectModal} className="text-red-600 border-red-600 hover:bg-red-50">
                Từ chối & Khóa tin
              </Button>
              <Button variant="primary" onClick={() => handleApprove(selectedJob.id)}>
                Duyệt hiển thị (Publish)
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* --- MODAL NHẬP LÝ DO TỪ CHỐI --- */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Lý do từ chối tin">
        <div className="flex flex-col gap-4">
          <textarea
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
            rows="4"
            placeholder="Nhập lý do vi phạm (Ví dụ: Tin có dấu hiệu lừa đảo, nội dung không phù hợp...)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          ></textarea>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>Hủy</Button>
            <Button variant="primary" onClick={handleConfirmReject} className="bg-red-600 hover:bg-red-700 text-white">Xác nhận từ chối</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}