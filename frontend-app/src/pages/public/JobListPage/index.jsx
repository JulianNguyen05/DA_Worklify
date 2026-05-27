import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import jobService from '../../../features/job/jobService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import JobCard from '../../../components/shared/JobCard'; // Import JobCard vừa tạo

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
      // Gọi API thật từ Backend
      const res = await jobService.searchJobs(kw, loc, 0, 10);
      
      // AxiosClient bóc tách data 1 lần, ta truy cập vào .data.content của PageResponse
      if (res && res.data) {
        setJobs(res.data.content || []);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách việc làm:", error);
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
          <Input 
            label="Từ khóa" 
            value={filterForm.keyword} 
            onChange={(e) => setFilterForm({ ...filterForm, keyword: e.target.value })} 
            placeholder="Tên công việc..." 
          />
        </div>
        <div className="flex-1 w-full">
          <Input 
            label="Địa điểm" 
            value={filterForm.location} 
            onChange={(e) => setFilterForm({ ...filterForm, location: e.target.value })} 
            placeholder="Tỉnh/Thành phố..." 
          />
        </div>
        <Button type="submit" isLoading={isLoading} className="w-full md:w-32 bg-blue-600 hover:bg-blue-700 text-white">
          Tìm kiếm
        </Button>
      </form>

      {/* Kết quả */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Kết quả tìm kiếm ({jobs.length})</h2>
        
        {isLoading ? (
          <div className="text-center text-gray-500 py-10">Đang tìm kiếm việc làm phù hợp...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-lg border border-gray-100">
            Không tìm thấy công việc nào phù hợp với tiêu chí của bạn.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Sử dụng Component JobCard */}
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}