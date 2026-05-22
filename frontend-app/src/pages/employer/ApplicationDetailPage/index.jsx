import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  useEffect(() => {
    // Giả lập fetch data
    setApplication({
      id: id,
      candidateName: 'Nguyễn Văn A',
      email: 'nguyenvana@gmail.com',
      phone: '0901234567',
      appliedAt: '2026-05-21',
      coverLetter: 'Tôi rất quan tâm đến vị trí này và tự tin có thể đáp ứng...',
      cvUrl: '#',
      aiScore: 88,
      status: 'PENDING'
    });
  }, [id]);

  const handleAction = (action) => {
    setStatusMsg({ type: 'success', message: `Đã cập nhật trạng thái: ${action}` });
    setApplication({ ...application, status: action });
  };

  if (!application) return <div className="text-gray-500">Đang tải...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Hồ sơ ứng viên: {application.candidateName}</h2>
          <p className="text-sm text-gray-500">Ngày nộp: {new Date(application.appliedAt).toLocaleDateString()} | Trạng thái hiện tại: <span className="font-semibold">{application.status}</span></p>
        </div>
        <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">&larr; Quay lại danh sách</button>
      </div>

      {statusMsg.type && <Toast type={statusMsg.type} message={statusMsg.message} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin & Điểm AI */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Đánh giá từ AI</h3>
            <div className="text-5xl font-black text-green-600">{application.aiScore}%</div>
            <p className="text-xs text-gray-500 mt-2">Độ tương thích (Confidence Score)</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Liên hệ</h3>
            <p className="text-sm text-gray-600 mb-2"><strong>Email:</strong> {application.email}</p>
            <p className="text-sm text-gray-600 mb-4"><strong>SĐT:</strong> {application.phone}</p>
            <Button variant="outline" className="w-full text-blue-600 border-blue-600">Tải / Xem CV (PDF)</Button>
          </div>
        </div>

        {/* Cột phải: Thư giới thiệu & Hành động */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Thư giới thiệu (Cover Letter)</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-100">
              {application.coverLetter}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex gap-4">
            <Button onClick={() => handleAction('ACCEPTED')} className="flex-1 bg-green-600 hover:bg-green-700">Phê duyệt & Gọi phỏng vấn</Button>
            <Button onClick={() => handleAction('REJECTED')} variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-50">Loại hồ sơ</Button>
          </div>
        </div>
      </div>
    </div>
  );
}