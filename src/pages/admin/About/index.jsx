import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';

const DEFAULT_DATA = {
  professionalOverview1: "As a passionate software engineer at the GIS research center, I specialize in developing cross-platform mobile applications that bring innovative solutions to complex problems.",
  professionalOverview2: "My academic journey at VNU University of Engineering and Technology has equipped me with a strong foundation in Information Technology, which I continuously build upon through practical experience and self-directed learning.",
  values: [
    { emoji: "💡", title: "Learning & Curiosity", description: "Committed to continuous learning and exploring new technologies with an inquisitive mindset." },
    { emoji: "🙌", title: "Team Collaboration", description: "Strong believer in effective communication and collaborative problem-solving." },
    { emoji: "🙋‍♂️", title: "Autonomy", description: "Self-motivated with the ability to work independently and take initiative." },
    { emoji: "🎯", title: "Goal-Oriented", description: "Focused on delivering high-quality results and achieving project objectives." }
  ],
  educationDegree: "Bachelor's degree in Information Technology",
  educationUniversity: "VNU University of Engineering and Technology",
  positionTitle: "Software Engineer - Mobile Application Developer",
  positionOrganization: "GIS Research Center - Thai Nguyen University"
};

function AdminAboutPage() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'pageContent', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetched = docSnap.data();
          setData({ ...DEFAULT_DATA, ...fetched });
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
        toast.error('Không thể tải dữ liệu trang About');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleValueChange = (index, field, value) => {
    setData(prev => {
      const updated = [...prev.values];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, values: updated };
    });
  };

  const handleAddValue = () => {
    setData(prev => ({
      ...prev,
      values: [...prev.values, { emoji: '⭐', title: '', description: '' }]
    }));
  };

  const handleRemoveValue = (index) => {
    setData(prev => ({ ...prev, values: prev.values.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, 'pageContent', 'about');
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
      toast.success('Đã lưu nội dung trang About thành công!');
    } catch (error) {
      console.error('Error saving about content:', error);
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
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Quản lý trang About</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Professional Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Professional Overview</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đoạn 1</label>
              <textarea
                rows={4}
                value={data.professionalOverview1}
                onChange={e => handleChange('professionalOverview1', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đoạn 2</label>
              <textarea
                rows={4}
                value={data.professionalOverview2}
                onChange={e => handleChange('professionalOverview2', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-semibold text-gray-800">My Values</h2>
            <button
              onClick={handleAddValue}
              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm flex items-center gap-1"
            >
              <FaPlus size={12} /> Thêm
            </button>
          </div>
          <div className="space-y-4">
            {data.values.map((val, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                <button
                  onClick={() => handleRemoveValue(index)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  title="Xóa"
                >
                  <FaTrash size={14} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Emoji</label>
                    <input
                      type="text"
                      value={val.emoji}
                      onChange={e => handleValueChange(index, 'emoji', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tiêu đề</label>
                    <input
                      type="text"
                      value={val.title}
                      onChange={e => handleValueChange(index, 'title', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả</label>
                    <input
                      type="text"
                      value={val.description}
                      onChange={e => handleValueChange(index, 'description', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Experience */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Education & Experience</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bằng cấp</label>
              <input
                type="text"
                value={data.educationDegree}
                onChange={e => handleChange('educationDegree', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trường đại học</label>
              <input
                type="text"
                value={data.educationUniversity}
                onChange={e => handleChange('educationUniversity', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ hiện tại</label>
              <input
                type="text"
                value={data.positionTitle}
                onChange={e => handleChange('positionTitle', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tổ chức / Công ty</label>
              <input
                type="text"
                value={data.positionOrganization}
                onChange={e => handleChange('positionOrganization', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAboutPage;
