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
  
  // State cho Modal Xem chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // State cho Modal Từ chối
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
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

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async (companyId) => {
    try {
      await adminService.moderateCompany(companyId, 'APPROVED');
      setStatusMsg({ type: 'success', message: 'Đã duyệt hồ sơ doanh nghiệp.' });
      setCompanies(companies.filter(c => c.id !== companyId));
      setIsDetailModalOpen(false); // Đóng modal chi tiết
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
      await adminService.moderateCompany(selectedCompany.id, 'REJECTED', rejectReason);
      setStatusMsg({ type: 'success', message: 'Đã từ chối hồ sơ doanh nghiệp.' });
      setCompanies(companies.filter(c => c.id !== selectedCompany.id));
      setIsRejectModalOpen(false); // Đóng modal từ chối
      setIsDetailModalOpen(false); // Đóng luôn modal chi tiết
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Thao tác thất bại.' });
    }
  };

  const columns = [
    { header: 'Tên doanh nghiệp', accessor: 'companyName', render: (row) => <span className="font-medium text-gray-800">{row.companyName}</span> },
    { header: 'Website', accessor: 'website', render: (row) => <a href={row.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{row.website || 'N/A'}</a> },
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
      <h2 className="text-xl font-bold text-gray-800 mb-6">Kiểm duyệt Hồ sơ Doanh nghiệp</h2>
      
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      <Table 
        columns={columns} 
        data={companies} 
        isLoading={isLoading} 
        emptyMessage="Không có hồ sơ doanh nghiệp nào chờ duyệt." 
      />

      {/* --- MODAL 1: XEM CHI TIẾT --- */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Chi tiết hồ sơ doanh nghiệp">
        {selectedCompany && (
          <div className="flex flex-col gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 bg-gray-100 border rounded flex items-center justify-center overflow-hidden">
                {selectedCompany.logoUrl ? (
                  <img src={`http://localhost:8080${selectedCompany.logoUrl}`} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-gray-400">No Logo</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedCompany.companyName}</h3>
                <p>Website: <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="text-blue-600">{selectedCompany.website || 'Không có'}</a></p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded border">
              <span className="font-semibold block mb-1">Giới thiệu công ty:</span>
              <p className="whitespace-pre-wrap">{selectedCompany.description || 'Doanh nghiệp chưa cập nhật phần giới thiệu.'}</p>
            </div>

            <div className="flex justify-end gap-3 mt-4 border-t pt-4">
              <Button variant="outline" onClick={handleOpenRejectModal} className="text-red-600 border-red-600 hover:bg-red-50">
                Từ chối hồ sơ
              </Button>
              <Button variant="primary" onClick={() => handleApprove(selectedCompany.id)}>
                Duyệt hồ sơ
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* --- MODAL 2: NHẬP LÝ DO TỪ CHỐI --- */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Lý do từ chối">
        <div className="flex flex-col gap-4">
          <textarea
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
            rows="4"
            placeholder="Nhập lý do vi phạm hoặc yêu cầu chỉnh sửa gửi đến nhà tuyển dụng..."
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