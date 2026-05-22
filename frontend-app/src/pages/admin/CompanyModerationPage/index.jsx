import React, { useState, useEffect } from 'react';
import adminService from '../../../features/admin/adminService'; // Giả định bạn đã thêm API tương ứng
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import Badge from '../../../components/common/Badge'; // Giả định có component Badge

export default function CompanyModerationPage() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  useEffect(() => {
    // Mock dữ liệu gọi API lấy danh sách công ty chờ duyệt
    const fetchPendingCompanies = async () => {
      setIsLoading(true);
      try {
        // const res = await adminService.getPendingCompanies();
        // setCompanies(res.data);
        
        // Dữ liệu giả lập
        setCompanies([
          { id: 1, name: 'Công ty Cổ phần TechVN', taxCode: '0101234567', requestedAt: '2026-05-20', status: 'PENDING' },
          { id: 2, name: 'Global Solutions Ltd.', taxCode: '0309876543', requestedAt: '2026-05-21', status: 'PENDING' }
        ]);
      } catch (error) {
        setStatusMsg({ type: 'error', message: 'Lỗi tải danh sách doanh nghiệp.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingCompanies();
  }, []);

  const handleModerate = async (companyId, action) => {
    try {
      // await adminService.moderateCompany(companyId, action);
      setStatusMsg({ type: 'success', message: `Đã ${action === 'APPROVED' ? 'duyệt' : 'từ chối'} hồ sơ doanh nghiệp.` });
      setCompanies(companies.filter(c => c.id !== companyId)); // Xóa khỏi danh sách chờ
    } catch (err) {
      setStatusMsg({ type: 'error', message: 'Thao tác thất bại.' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Kiểm duyệt Hồ sơ Doanh nghiệp</h2>
      
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 font-medium text-gray-600">Tên doanh nghiệp</th>
              <th className="p-3 font-medium text-gray-600">Mã số thuế</th>
              <th className="p-3 font-medium text-gray-600">Ngày yêu cầu</th>
              <th className="p-3 font-medium text-gray-600 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : companies.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">Không có hồ sơ doanh nghiệp nào chờ duyệt.</td></tr>
            ) : (
              companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{company.name}</td>
                  <td className="p-3 text-gray-600">{company.taxCode}</td>
                  <td className="p-3 text-gray-500">{new Date(company.requestedAt).toLocaleDateString()}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Button variant="primary" onClick={() => handleModerate(company.id, 'APPROVED')} className="px-3 py-1">
                      Duyệt
                    </Button>
                    <Button variant="outline" onClick={() => handleModerate(company.id, 'REJECTED')} className="px-3 py-1 text-red-600 border-red-600 hover:bg-red-50">
                      Từ chối
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}