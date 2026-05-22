import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../../components/common/Button';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập lấy thông tin công ty và danh sách việc làm
    const fetchDetail = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        setCompany({
          id,
          name: 'Công ty Cổ phần TechVN',
          website: 'https://techvn.example.com',
          address: 'Tòa nhà Tech, Q. Cầu Giấy, Hà Nội',
          description: 'TechVN là một trong những công ty hàng đầu trong lĩnh vực phát triển phần mềm, với môi trường làm việc trẻ trung, năng động và sáng tạo. Chúng tôi luôn chào đón những nhân tài đam mê công nghệ.',
          activeJobs: [
            { id: 1, title: 'Senior ReactJS Developer', salary: '20 - 30 Triệu', location: 'Hà Nội' },
            { id: 2, title: 'Backend Spring Boot (Java)', salary: 'Thỏa thuận', location: 'Hà Nội' }
          ]
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) return <div className="text-center py-20 text-gray-500">Đang tải thông tin...</div>;
  if (!company) return <div className="text-center py-20 text-gray-500">Không tìm thấy doanh nghiệp này!</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      {/* Header Công ty */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-4xl flex-shrink-0">
          {company.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{company.name}</h1>
          <div className="flex flex-col gap-2 mt-4 text-gray-600 text-sm">
            <span className="flex items-center gap-2">📍 {company.address}</span>
            <span className="flex items-center gap-2">🌐 <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{company.website}</a></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột trái: Giới thiệu */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Giới thiệu công ty</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{company.description}</p>
          </div>
        </div>

        {/* Cột phải: Việc làm đang tuyển */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Việc làm đang tuyển ({company.activeJobs.length})</h2>
            
            {company.activeJobs.length === 0 ? (
              <p className="text-sm text-gray-500">Doanh nghiệp này hiện chưa có tin tuyển dụng nào.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {company.activeJobs.map(job => (
                  <Link key={job.id} to={`/jobs/${job.id}`} className="block border border-gray-100 p-4 rounded-md hover:border-blue-300 hover:shadow-sm transition-all group">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">{job.title}</h3>
                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span className="text-green-600 font-medium">{job.salary}</span>
                      <span>{job.location}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}