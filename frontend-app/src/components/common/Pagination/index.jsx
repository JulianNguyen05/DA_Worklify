import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Không hiển thị thanh phân trang nếu chỉ có 1 hoặc 0 trang
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
            currentPage === i
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 px-2">
      <div className="text-sm text-gray-500">
        Trang <span className="font-semibold text-gray-700">{currentPage + 1}</span> trên <span className="font-semibold text-gray-700">{totalPages}</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        {/* Nút lùi trang */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Danh sách số trang */}
        {renderPageNumbers()}

        {/* Nút tiến trang */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}