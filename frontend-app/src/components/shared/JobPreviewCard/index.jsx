import React from 'react';
import { Building2, MapPin, DollarSign, Briefcase, Calendar } from 'lucide-react';
import DOMPurify from 'dompurify';

// Nhãn hiển thị cho workType, khớp với các option trong JobCreatePage/JobEditPage
const WORK_TYPE_LABELS = {
  FULL_TIME: 'Toàn thời gian',
  PART_TIME: 'Bán thời gian',
  INTERNSHIP: 'Thực tập sinh',
  REMOTE: 'Làm việc từ xa',
};

// Dùng chung logic strip/sanitize với JobCreatePage và JobDetailPage
// (JobDetailPage sanitize với cùng ALLOWED_TAGS vì RichTextEditor dùng TipTap StarterKit)
const stripHtml = (html) => html?.replace(/<[^>]*>/g, '').trim() || '';

const renderHtml = (html) => ({
  __html: DOMPurify.sanitize(html || '', {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
  }),
});

/**
 * Live preview cho tin tuyển dụng — render đúng những gì candidate sẽ thấy
 * trên JobDetailPage, thu gọn lại để đặt cạnh form nhập của employer.
 *
 * @param {object} formData     - state formData của JobCreatePage/JobEditPage
 * @param {string} companyName - tên công ty (từ company profile của employer)
 * @param {string} logoUrl     - logo công ty (đã resolve URL đầy đủ)
 */
export default function JobPreviewCard({ formData, companyName, logoUrl }) {
  const { title, location, salaryRange, workType, expiresAt, description, requirements } = formData;

  return (
    <div className="sticky top-8">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Xem trước
      </p>

      <div className="card overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex gap-4 items-center">
            <div className="card w-14 h-14 shrink-0 flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={companyName} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-7 h-7 text-slate-300" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900 leading-snug truncate">
                {title || 'Tiêu đề công việc'}
              </h3>
              <p className="text-sm text-brand-700 font-semibold truncate">
                {companyName || 'Tên công ty'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
              <DollarSign className="w-3.5 h-3.5" /> {salaryRange || 'Thỏa thuận'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <MapPin className="w-3.5 h-3.5" /> {location || 'Chưa cập nhật'}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="px-6 py-4 border-b border-slate-100 grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2.5">
            <Briefcase className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Hình thức</p>
              <p className="text-sm font-semibold text-slate-800">
                {WORK_TYPE_LABELS[workType] || workType || '—'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Hạn nộp</p>
              <p className="text-sm font-semibold text-slate-800">
                {expiresAt ? new Date(expiresAt).toLocaleDateString('vi-VN') : 'Chưa đặt'}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Mô tả công việc</h4>
            {stripHtml(description) ? (
              <div
                className="text-sm text-slate-600 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={renderHtml(description)}
              />
            ) : (
              <p className="text-sm text-slate-300 italic">Chưa có nội dung...</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Yêu cầu ứng viên</h4>
            {stripHtml(requirements) ? (
              <div
                className="text-sm text-slate-600 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={renderHtml(requirements)}
              />
            ) : (
              <p className="text-sm text-slate-300 italic">Chưa có nội dung...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
