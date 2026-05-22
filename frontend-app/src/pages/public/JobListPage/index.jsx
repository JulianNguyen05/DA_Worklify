import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import jobService from '../../../features/job/jobService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

export default function JobListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  const locationParam = searchParams.get('location') || '';

  const [filterForm, setFilterForm] = useState({ keyword: keywordParam, location: locationParam });
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = async (kw, loc) => {
    setIsLoading(true);
    try {
      // API call: await jobService.searchJobs(kw, loc);
      // Giả lập dữ liệu trả về từ PageResponse
      await new Promise(resolve => setTimeout(resolve, 800));
      setJobs([
        { id: 1, title: 'Senior ReactJS Developer', company: 'TechVN', location: 'Hà Nội', salary: '20 - 30 Triệu', postedAt: '2026-05-20' },
        { id: 2, title: 'Backend Spring Boot', company: 'Global Solutions', location: 'TP.HCM', salary: 'Thỏa thuận', postedAt: '2026-05-21' }
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(keywordParam, locationParam);
  }, [keywordParam, locationParam]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setSearchParams(filterForm); // Cập nhật URL, kích hoạt lại useEffect
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tìm kiếm việc làm</h1>

      {/* Form lọc */}
      <form onSubmit={handleFilterSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <Input label="Từ khóa" value={filterForm.keyword} onChange={(e) => setFilterForm({ ...filterForm, keyword: e.target.value })} placeholder="Tên công việc..." />
        </div>
        <div className="flex-1 w-full">
          <Input label="Địa điểm" value={filterForm.location} onChange={(e) => setFilterForm({ ...filterForm, location: e.target.value })} placeholder="Tỉnh/Thành phố..." />
        </div>
        <Button type="submit" isLoading={isLoading} className="w-full md:w-32">Tìm kiếm</Button>
      </form>

      {/* Kết quả */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Kết quả tìm kiếm ({jobs.length})</h2>
        {isLoading ? (
          <div className="text-center text-gray-500 py-10">Đang tìm kiếm việc làm phù hợp...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Không tìm thấy công việc nào phù hợp với tiêu chí của bạn.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <Link to={`/jobs/${job.id}`}>
                    <h3 className="text-lg font-bold text-blue-700 hover:underline">{job.title}</h3>
                  </Link>
                  <p className="text-gray-600 font-medium mt-1">{job.company}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">📍 {job.location}</span>
                    <span className="flex items-center gap-1">💰 {job.salary}</span>
                    <span className="flex items-center gap-1">🕒 {new Date(job.postedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link to={`/jobs/${job.id}`}>
                  <Button variant="outline">Xem chi tiết</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}