import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Không hiển thị thanh phân trang nếu chỉ có 1 hoặc 0 trang
  if (totalPages <= 1) return null;

  // Thuật toán tạo danh sách trang thông minh (Có dấu ...)
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      // Nếu tổng số trang ít, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Nếu nhiều trang, xử lý rút gọn bằng '...'
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    // Bỏ text thừa, căn giữa thanh phân trang cho đẹp mắt
    <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-1.5">
        
        {/* Nút Lùi (Prev) */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1} // Đã fix logic: Trang đầu tiên là 1
          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Danh sách số trang */}
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`dots-${index}`} className="px-2 text-gray-400 font-medium">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-md cursor-default'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 cursor-pointer'
              }`}
            >
              {page}
            </button>
          )
        ))}

        {/* Nút Tiến (Next) */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
      </div>
    </div>
  );
}