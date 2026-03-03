import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const DEFAULT_DATA = {
  email: "khanhk66uet@gmail.com",
  location: "VNU University of Engineering and Technology, Hanoi, Vietnam",
  currentPosition: "GIS Research Center - Thai Nguyen University",
  githubUrl: "https://github.com/kiu-chan",
  facebookUrl: "https://www.facebook.com/hoang.bao.khanh.498513",
  whatsappNumber: "84974022602"
};

function AdminContactPage() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'pageContent', 'contact');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData({ ...DEFAULT_DATA, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching contact content:', error);
        toast.error('Không thể tải dữ liệu trang Contact');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, 'pageContent', 'contact');
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
      toast.success('Đã lưu nội dung trang Contact thành công!');
    } catch (error) {
      console.error('Error saving contact content:', error);
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
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Quản lý trang Contact</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Thông tin liên hệ</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={e => handleChange('email', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
              <input
                type="text"
                value={data.location}
                onChange={e => handleChange('location', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí công việc hiện tại</label>
              <input
                type="text"
                value={data.currentPosition}
                onChange={e => handleChange('currentPosition', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Mạng xã hội</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
              <input
                type="url"
                value={data.githubUrl}
                onChange={e => handleChange('githubUrl', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input
                type="url"
                value={data.facebookUrl}
                onChange={e => handleChange('facebookUrl', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp số điện thoại <span className="text-gray-400 font-normal">(quốc tế, không có dấu +)</span>
              </label>
              <input
                type="text"
                value={data.whatsappNumber}
                onChange={e => handleChange('whatsappNumber', e.target.value)}
                placeholder="VD: 84974022602"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                WhatsApp link sẽ là: https://wa.me/{data.whatsappNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminContactPage;
