import React from 'react';

export default function SearchBar({ value, onChange, placeholder = "Tìm kiếm vị trí, công ty...", onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="relative flex items-center max-w-md w-full">
      {/* Icon kính lúp */}
      <div className="absolute left-3 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      {/* Ô Input */}
      <input
        type="text"
        className="w-full pl-10 pr-20 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      
      {/* Nút Tìm kiếm nhanh đính kèm inside input */}
      {onSearch && (
        <button
          onClick={() => onSearch(value)}
          className="absolute right-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
        >
          Tìm kiếm
        </button>
      )}
    </div>
  );
}