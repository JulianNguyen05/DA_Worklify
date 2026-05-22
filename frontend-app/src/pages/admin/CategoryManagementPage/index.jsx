import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Toast from '../../../components/common/Toast';

export default function CategoryManagementPage() {
  const [activeTab, setActiveTab] = useState('skills');
  const [newItemName, setNewItemName] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: null, message: '' });

  // Dữ liệu giả lập
  const [categories, setCategories] = useState({
    skills: [{ id: 1, name: 'ReactJS' }, { id: 2, name: 'Spring Boot' }],
    industries: [{ id: 1, name: 'Phần mềm' }, { id: 2, name: 'Tài chính' }]
  });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    // Giả lập lưu API thành công
    const newItem = { id: Date.now(), name: newItemName };
    setCategories({
      ...categories,
      [activeTab]: [...categories[activeTab], newItem]
    });
    setNewItemName('');
    setStatusMsg({ type: 'success', message: 'Đã thêm danh mục mới thành công.' });
  };

  const handleDeleteItem = (id) => {
    if (!window.confirm('Xóa danh mục này có thể ảnh hưởng đến dữ liệu tìm kiếm. Bạn có chắc không?')) return;
    
    setCategories({
      ...categories,
      [activeTab]: categories[activeTab].filter(item => item.id !== id)
    });
    setStatusMsg({ type: 'success', message: 'Đã xóa danh mục.' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Quản lý Danh mục Hệ thống</h2>
      
      {statusMsg.type && <div className="mb-4"><Toast type={statusMsg.type} message={statusMsg.message} /></div>}

      {/* Tabs Menu */}
      <div className="flex gap-4 border-b border-gray-200 mb-6 pb-2">
        <button 
          className={`font-medium text-sm ${activeTab === 'skills' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('skills')}
        >
          Danh sách Kỹ năng (Skills)
        </button>
        <button 
          className={`font-medium text-sm ${activeTab === 'industries' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('industries')}
        >
          Ngành nghề
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Thêm Mới */}
        <div className="lg:col-span-1 bg-gray-50 p-4 rounded-md border border-gray-100 h-fit">
          <h3 className="font-semibold text-gray-700 mb-4">Thêm mục mới</h3>
          <form onSubmit={handleAddItem} className="flex flex-col gap-3">
            <Input 
              label={`Tên ${activeTab === 'skills' ? 'Kỹ năng' : 'Ngành nghề'}`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Nhập tên..."
              required
            />
            <Button type="submit" className="w-full">Thêm mới</Button>
          </form>
        </div>

        {/* Danh sách */}
        <div className="lg:col-span-2">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-3 font-medium text-gray-600 w-16">ID</th>
                <th className="p-3 font-medium text-gray-600">Tên danh mục</th>
                <th className="p-3 font-medium text-gray-600 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories[activeTab].map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{item.id}</td>
                  <td className="p-3 font-medium text-gray-800">{item.name}</td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-xs"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}