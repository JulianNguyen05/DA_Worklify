import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export default function CompanyListPage() {
  const [keyword, setKeyword] = useState('');
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập gọi API lấy danh sách doanh nghiệp đã được phê duyệt
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        setCompanies([
          { id: 10, name: 'Công ty Cổ phần TechVN', industry: 'Phần mềm', location: 'Hà Nội', activeJobs: 5 },
          { id: 11, name: 'Global Solutions Ltd.', industry: 'Công nghệ thông tin', location: 'TP.HCM', activeJobs: 2 },
          { id: 12, name: 'Fintech Asia', industry: 'Tài chính - Ngân hàng', location: 'Đà Nẵng', activeJobs: 0 }
        ]);
      } catch (error) {
        console.error("Lỗi tải danh sách công ty", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => c.name.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Khám Phá Các Doanh Nghiệp Hàng Đầu</h1>
        <p className="text-gray-600">Tìm hiểu văn hóa công ty và các cơ hội việc làm hấp dẫn nhất.</p>
        
        <div className="max-w-xl mx-auto mt-6">
          <Input 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm tên công ty..." 
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500 py-10">Đang tải danh sách...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => (
            <Link key={company.id} to={`/companies/${company.id}`} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {company.name.charAt(0)}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{company.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{company.industry} • {company.location}</p>
              
              <div className="text-sm font-medium text-blue-600">
                {company.activeJobs > 0 ? `${company.activeJobs} việc làm đang tuyển \u2192` : 'Chưa có tin tuyển dụng'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}