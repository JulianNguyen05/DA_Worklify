import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Toast from '../../../components/common/Toast';
// import adminService from '../../../features/admin/adminService';

export default function ReportExportPage() {
  const [formData, setFormData] = useState({
    reportType: 'USERS', // USERS, JOBS, APPLICATIONS
    startDate: '',
    endDate: ''
  });
  const [isExporting, setIsExporting] = useState({ pdf: false, excel: false });
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExport = async (format) => {
    if (!formData.startDate || !formData.endDate) {
      setStatusMsg({ type: 'error', message: 'Vui lòng chọn đầy đủ khoảng thời gian.' });
      return;
    }

    setIsExporting({ ...isExporting, [format]: true });
    setStatusMsg({ type: null, message: '' });

    try {
      // Code gọi API tải file từ Backend
      // Ví dụ: await adminService.exportReport(formData.reportType, formData.startDate, formData.endDate, format);
      
      // Giả lập thời gian delay tải file
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatusMsg({ type: 'success', message: `Đã xuất báo cáo dạng ${format.toUpperCase()} thành công!` });
    } catch (error) {
      setStatusMsg({ type: 'error', message: 'Có lỗi xảy ra trong quá trình kết xuất.' });
    } finally {
      setIsExporting({ ...isExporting, [format]: false });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Kết xuất Báo cáo Thống kê</h2>
      
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Loại báo cáo</label>
          <select 
            name="reportType" 
            value={formData.reportType} 
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="USERS">Tăng trưởng Người dùng (Ứng viên & Nhà tuyển dụng)</option>
            <option value="JOBS">Thống kê Tin tuyển dụng</option>
            <option value="APPLICATIONS">Hiệu suất Ứng tuyển & Tỷ lệ chuyển đổi</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Từ ngày" 
            type="date" 
            name="startDate" 
            value={formData.startDate} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Đến ngày" 
            type="date" 
            name="endDate" 
            value={formData.endDate} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="flex gap-4 mt-4">
          <Button 
            onClick={() => handleExport('excel')} 
            isLoading={isExporting.excel}
            disabled={isExporting.pdf}
            className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800"
          >
            Xuất file Excel (.xlsx)
          </Button>
          
          <Button 
            onClick={() => handleExport('pdf')} 
            isLoading={isExporting.pdf}
            disabled={isExporting.excel}
            className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800"
          >
            Xuất file PDF (.pdf)
          </Button>
        </div>
      </div>
    </div>
  );
}