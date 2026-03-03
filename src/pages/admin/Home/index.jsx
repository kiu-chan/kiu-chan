import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';

const DEFAULT_DATA = {
  heroTitle: "Software Engineer at GIS Research Center",
  heroSubtitle: "Cross-platform Mobile Application Developer",
  aboutName: "Khanh",
  aboutEmail: "khanhk66uet@gmail.com",
  aboutUniversityName: "VNU University of Engineering and Technology - Vietnam National University, Hanoi",
  aboutUniversityUrl: "https://uet.vnu.edu.vn/",
  aboutPosition: "Currently working as a cross-platform mobile application developer at the GIS Research Center - Thai Nguyen University of Agriculture and Forestry",
  values: [
    "💡 Mindset of Learning, Curiosity & Digging up",
    "🙌 Teamwork & Communication & Leadership",
    "🙋‍♂️ Autonomous",
    "🕺 & More to discover ..."
  ],
  githubUsername: "kiu-chan"
};

function AdminHomePage() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'pageContent', 'home');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData({ ...DEFAULT_DATA, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
        toast.error('Không thể tải dữ liệu trang Home');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddValue = () => {
    if (!newValue.trim()) return;
    setData(prev => ({ ...prev, values: [...prev.values, newValue.trim()] }));
    setNewValue('');
  };

  const handleRemoveValue = (index) => {
    setData(prev => ({ ...prev, values: prev.values.filter((_, i) => i !== index) }));
  };

  const handleValueChange = (index, value) => {
    setData(prev => {
      const updated = [...prev.values];
      updated[index] = value;
      return { ...prev, values: updated };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, 'pageContent', 'home');
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
      toast.success('Đã lưu nội dung trang Home thành công!');
    } catch (error) {
      console.error('Error saving home content:', error);
      toast.error('Lỗi khi lưu dữ liệu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Quản lý trang Home</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề chính</label>
              <input
                type="text"
                value={data.heroTitle}
                onChange={e => handleChange('heroTitle', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề phụ</label>
              <input
                type="text"
                value={data.heroSubtitle}
                onChange={e => handleChange('heroSubtitle', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* About Me */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">About Me</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
              <input
                type="text"
                value={data.aboutName}
                onChange={e => handleChange('aboutName', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={data.aboutEmail}
                onChange={e => handleChange('aboutEmail', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên trường đại học</label>
              <input
                type="text"
                value={data.aboutUniversityName}
                onChange={e => handleChange('aboutUniversityName', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL trường đại học</label>
              <input
                type="url"
                value={data.aboutUniversityUrl}
                onChange={e => handleChange('aboutUniversityUrl', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí công việc hiện tại</label>
              <textarea
                rows={3}
                value={data.aboutPosition}
                onChange={e => handleChange('aboutPosition', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* My Values */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">My Values</h2>
          <div className="space-y-2 mb-4">
            {data.values.map((val, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={val}
                  onChange={e => handleValueChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleRemoveValue(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Xóa"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddValue()}
              placeholder="Thêm giá trị mới..."
              className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddValue}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Thêm
            </button>
          </div>
        </div>

        {/* GitHub */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">GitHub</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Username</label>
            <input
              type="text"
              value={data.githubUsername}
              onChange={e => handleChange('githubUsername', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;
