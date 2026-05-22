import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <p className="text-2xl font-bold text-gray-800 mt-4 tracking-tight">Ôi không! Không tìm thấy trang này.</p>
      <p className="text-gray-500 mt-2 mb-8">Trang bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn không chính xác.</p>
      
      <Link to="/">
        <Button className="px-6 py-2">Quay lại Trang Chủ</Button>
      </Link>
    </div>
  );
}