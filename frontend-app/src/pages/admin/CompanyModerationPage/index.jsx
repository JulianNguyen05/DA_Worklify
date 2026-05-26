import React, { useState, useEffect } from 'react';
import adminService from '../../../features/admin/adminService';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';

export default function CompanyModerationPage() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });
  
  // State cho Modal từ chối
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  const fetchPendingCompanies = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getPendingCompanies();
      setCompanies(res.data);
    } catch (error) {
      setStatusMsg({ type: 'error', message: 'Lỗi tải danh sách doanh nghiệp.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (companyId) => {
    try {
      await adminService.moderateCompany(companyId, 'APPROVED');
      setStatusMsg({ type: 'success', message: 'Đã duyệt hồ sơ doanh nghiệp.' });
      setCompanies(companies.filter(c => c.id !== companyId));
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Thao tác thất bại.' });
    }
  };

  const handleOpenRejectModal = (companyId) => {
    setSelectedCompanyId(companyId);
    setRejectReason('');
    setIsModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      setStatusMsg({ type: 'error', message: 'Vui lòng nhập lý do từ chối.' });
      return;
    }
    
    try {
      await adminService.moderateCompany(selectedCompanyId, 'REJECTED', rejectReason);
      setStatusMsg({ type: 'success', message: 'Đã từ chối hồ sơ doanh nghiệp.' });
      setCompanies(companies.filter(c => c.id !== selectedCompanyId));
      setIsModalOpen(false);
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Thao tác thất bại.' });
    }
  };

  const columns = [
    { header: 'Tên doanh nghiệp', accessor: 'companyName', render: (row) => <span className="font-medium">{row.companyName}</span> },
    { header: 'Website', accessor: 'website' },
    { 
      header: 'Hành động', 
      className: 'text-center',
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <Button variant="primary" onClick={() => handleApprove(row.id)} className="px-3 py-1">
            Duyệt
          </Button>
          <Button variant="outline" onClick={() => handleOpenRejectModal(row.id)} className="px-3 py-1 text-red-600 border-red-600 hover:bg-red-50">
            Từ chối
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Kiểm duyệt Hồ sơ Doanh nghiệp</h2>
      
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      <Table 
        columns={columns} 
        data={companies} 
        isLoading={isLoading} 
        emptyMessage="Không có hồ sơ doanh nghiệp nào chờ duyệt." 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Lý do từ chối">
        <div className="flex flex-col gap-4">
          <textarea
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
            rows="4"
            placeholder="Nhập lý do vi phạm hoặc yêu cầu chỉnh sửa..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          ></textarea>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button variant="primary" onClick={handleConfirmReject} className="bg-red-600 hover:bg-red-700 text-white">Xác nhận từ chối</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}