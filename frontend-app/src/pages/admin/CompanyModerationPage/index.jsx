import React, { useState, useEffect } from 'react';
import { ShieldCheck, Eye, Building2, Globe, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
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
      setStatusMsg({ type: 'success', message: 'Đã duyệt hồ sơ doanh nghiệp thành công.' });
      setCompanies(companies.filter(c => c.id !== companyId));
      setIsDetailModalOpen(false);
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Thao tác thất bại. Vui lòng thử lại.' });
    }
  };

  const handleOpenRejectModal = () => {
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      setStatusMsg({ type: 'error', message: 'Vui lòng nhập lý do từ chối để thông báo cho doanh nghiệp.' });
      return;
    }
    
    try {
      await adminService.moderateCompany(selectedCompany.id, 'REJECTED', rejectReason);
      setStatusMsg({ type: 'success', message: 'Đã từ chối hồ sơ doanh nghiệp.' });
      setCompanies(companies.filter(c => c.id !== selectedCompany.id));
      setIsRejectModalOpen(false); 
      setIsDetailModalOpen(false); 
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Thao tác thất bại.' });
    }
  };

  const columns = [
    { 
      header: 'Doanh nghiệp', 
      accessor: 'companyName', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {row.logoUrl ? (
              <img src={`http://localhost:8080${row.logoUrl}`} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <span className="font-semibold text-gray-900">{row.companyName}</span>
        </div>
      ) 
    },
    { 
      header: 'Website', 
      accessor: 'website', 
      render: (row) => row.website ? (
        <a href={row.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors font-medium">
          <Globe className="w-4 h-4" />
          {row.website.replace(/^https?:\/\//, '')}
        </a>
      ) : (
        <span className="text-gray-400 italic">Chưa cập nhật</span>
      )
    },
    { 
      header: 'Hành động', 
      className: 'text-center w-32',
      render: (row) => (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => handleViewDetails(row)} className="flex items-center gap-2 px-3 py-1.5 text-sm border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-all">
            <Eye className="w-4 h-4" />
            Chi tiết
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          <ShieldCheck className="w-7 h-7 text-blue-600" />
          Kiểm Duyệt Doanh Nghiệp
        </h1>
        <p className="text-gray-500 text-sm">Quản lý và phê duyệt hồ sơ đăng ký từ các nhà tuyển dụng mới trên hệ thống.</p>
      </div>
      
      {statusMsg.type && (
        <div className="mb-6">
          <Toast type={statusMsg.type} message={statusMsg.message} />
        </div>
      )}

      {/* Main Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table 
          columns={columns} 
          data={companies} 
          isLoading={isLoading} 
          emptyMessage={
            <div className="py-12 flex flex-col items-center justify-center text-gray-500">
              <ShieldCheck className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-600">Không có hồ sơ chờ duyệt</p>
              <p className="text-sm">Tất cả hồ sơ doanh nghiệp đã được xử lý.</p>
            </div>
          } 
        />
      </div>

      {/* --- MODAL 1: XEM CHI TIẾT --- */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Chi tiết hồ sơ đăng ký">
        {selectedCompany && (
          <div className="flex flex-col gap-6">
            
            {/* Header Modal - Thông tin cơ bản */}
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                {selectedCompany.logoUrl ? (
                  <img src={`http://localhost:8080${selectedCompany.logoUrl}`} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedCompany.companyName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4" />
                  {selectedCompany.website ? (
                    <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">
                      {selectedCompany.website}
                    </a>
                  ) : (
                    <span className="italic text-gray-400">Không có website</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Phân thân Modal - Giới thiệu */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-gray-500" />
                Giới thiệu công ty
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedCompany.description || <span className="italic text-gray-400">Doanh nghiệp chưa cập nhật phần giới thiệu chi tiết.</span>}
              </div>
            </div>

            {/* Footer Modal - Hành động */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
              <Button variant="outline" onClick={handleOpenRejectModal} className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                <XCircle className="w-4 h-4" />
                Từ chối hồ sơ
              </Button>
              <Button onClick={() => handleApprove(selectedCompany.id)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <CheckCircle className="w-4 h-4" />
                Duyệt & Kích hoạt
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* --- MODAL 2: NHẬP LÝ DO TỪ CHỐI --- */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Từ chối hồ sơ">
        <div className="flex flex-col gap-5">
          
          <div className="bg-red-50 text-red-700 p-3 rounded-lg flex gap-3 text-sm border border-red-100">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>Hành động này sẽ gửi thông báo yêu cầu doanh nghiệp <strong>{selectedCompany?.companyName}</strong> cập nhật lại thông tin. Vui lòng ghi rõ lý do.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lý do từ chối (Bắt buộc)</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-colors"
              rows="4"
              placeholder="Ví dụ: Tên công ty không hợp lệ, hình ảnh logo vi phạm bản quyền..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              autoFocus
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>Hủy bỏ</Button>
            <Button onClick={handleConfirmReject} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
              Xác nhận từ chối
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}