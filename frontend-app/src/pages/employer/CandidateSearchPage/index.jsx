import React, { useState } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export default function CandidateSearchPage() {
  const [keyword, setKeyword] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    // Giả lập kết quả tìm kiếm
    setCandidates([
      { id: 1, name: 'Lê Văn C', title: 'Backend Developer', skills: 'Java, Spring Boot, MySQL', experience: '4 năm' },
      { id: 2, name: 'Phạm Thị D', title: 'Fullstack Engineer', skills: 'ReactJS, NodeJS, Spring Boot', experience: '2 năm' }
    ]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Tìm kiếm Ứng viên (Kho dữ liệu)</h2>

      <form onSubmit={handleSearch} className="flex gap-4 items-end mb-8">
        <div className="flex-1">
          <Input 
            label="Tìm kiếm theo kỹ năng, chức danh..." 
            value={keyword} 
            onChange={(e) => setKeyword(e.target.value)} 
            placeholder="VD: Spring Boot, ReactJS..." 
          />
        </div>
        <Button type="submit" className="w-32">Tìm kiếm</Button>
      </form>

      {hasSearched && (
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-4">Kết quả tìm kiếm ({candidates.length})</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {candidates.length === 0 ? (
              <p className="text-sm text-gray-500">Không tìm thấy ứng viên phù hợp với từ khóa này.</p>
            ) : (
              candidates.map(candidate => (
                <div key={candidate.id} className="border border-gray-200 p-4 rounded-md hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-blue-700 text-lg">{candidate.name}</h4>
                    <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">{candidate.experience} kinh nghiệm</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-1">{candidate.title}</p>
                  <p className="text-sm text-gray-500 line-clamp-2"><strong>Kỹ năng:</strong> {candidate.skills}</p>
                  <div className="mt-4 text-right">
                    <Button variant="outline" className="px-3 py-1 text-xs text-blue-600 border-blue-600">Xem hồ sơ</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}