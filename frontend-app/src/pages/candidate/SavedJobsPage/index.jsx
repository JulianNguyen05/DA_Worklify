import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Heart, HeartOff } from 'lucide-react';
import jobService from '../../../features/job/jobService';
import PageHeader from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import Pagination from '../../../components/common/Pagination';
import Button, { buttonClasses } from '../../../components/common/Button';
import { Skeleton } from '../../../components/common/Spinner';
import JobCard from '../../../components/shared/JobCard';

const PAGE_SIZE = 10;

// Danh sách tin ứng viên đã lưu (dữ liệu từ /saved-jobs, người dùng lấy từ JWT)
export default function SavedJobsPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0); // 0-based như backend
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const fetchSaved = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await jobService.getSavedJobs(page, PAGE_SIZE);
      const data = res.data || {};
      setItems(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không tải được danh sách tin đã lưu.');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchSaved(); }, [fetchSaved]);

  const handleUnsave = async (jobId) => {
    setRemovingId(jobId);
    try {
      await jobService.unsaveJob(jobId);
      toast.success('Đã bỏ lưu tin');
      // Trang hiện tại trống sau khi xoá thì lùi về trang trước
      if (items.length === 1 && page > 0) setPage(page - 1);
      else fetchSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể bỏ lưu, vui lòng thử lại.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="page-container py-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <PageHeader
          eyebrow="Ứng tuyển"
          title="Việc làm đã lưu"
          description="Những tin bạn đã lưu để xem lại và ứng tuyển sau."
          actions={!isLoading && <span className="text-sm text-slate-500">{totalElements} tin</span>}
        />

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card flex items-center gap-4 p-5">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card border-dashed">
            <EmptyState
              icon={Heart}
              title="Chưa có tin nào được lưu"
              description="Bấm “Lưu tin” ở trang chi tiết việc làm để thêm vào danh sách này."
              action={<Link to="/jobs" className={buttonClasses()}>Tìm việc làm</Link>}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((saved) => (
              <div key={saved.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  {saved.job ? (
                    <JobCard job={saved.job} />
                  ) : (
                    <div className="card p-5 text-sm text-slate-500">Tin tuyển dụng này không còn tồn tại.</div>
                  )}
                  {saved.job && saved.job.openForApplications === false && (
                    <p className="mt-1 px-1 text-xs font-medium text-amber-700">Tin đã đóng hoặc hết hạn nộp hồ sơ.</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={removingId === (saved.job?.id ?? saved.id)}
                  onClick={() => handleUnsave(saved.job?.id)}
                  disabled={!saved.job}
                  className="self-end sm:self-center"
                >
                  <HeartOff className="h-4 w-4" /> Bỏ lưu
                </Button>
              </div>
            ))}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <Pagination currentPage={page + 1} totalPages={totalPages} onPageChange={(p) => setPage(p - 1)} />
        )}
      </div>
    </div>
  );
}
