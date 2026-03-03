import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';

const DEFAULT_DATA = {
  programmingLanguages: [
    { name: 'C/C++', level: 80, proficiency: 'Advanced' },
    { name: 'Python', level: 80, proficiency: 'Advanced' },
    { name: 'Java', level: 80, proficiency: 'Advanced' },
    { name: 'JavaScript', level: 80, proficiency: 'Advanced' },
    { name: 'Dart', level: 80, proficiency: 'Advanced' },
    { name: 'HTML/CSS', level: 80, proficiency: 'Advanced' }
  ],
  frameworks: [
    { name: 'Flutter', level: 90, proficiency: 'Expert' },
    { name: 'React', level: 80, proficiency: 'Advanced' },
    { name: 'Node.js', level: 80, proficiency: 'Advanced' },
    { name: 'Laravel', level: 60, proficiency: 'Intermediate' }
  ],
  tools: [
    { name: 'Git & GitHub', level: 80, proficiency: 'Advanced' },
    { name: 'AWS', level: 60, proficiency: 'Intermediate' },
    { name: 'Firebase', level: 80, proficiency: 'Advanced' },
    { name: 'Figma', level: 60, proficiency: 'Intermediate' },
    { name: 'Android Studio', level: 80, proficiency: 'Advanced' },
    { name: 'VSCode', level: 80, proficiency: 'Advanced' }
  ],
  databases: [
    { name: 'MongoDB', level: 80, proficiency: 'Advanced' },
    { name: 'MySQL', level: 80, proficiency: 'Advanced' },
    { name: 'PostgreSQL', level: 60, proficiency: 'Intermediate' }
  ],
  devPractices: ['Agile Methodology', 'CI/CD', 'Test-Driven Development', 'Clean Code Practices'],
  softSkills: ['Technical Leadership', 'Project Management', 'Team Collaboration', 'Problem Solving']
};

const PROFICIENCY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

function SkillCategoryEditor({ title, skills, onChange }) {
  const handleSkillChange = (index, field, value) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: field === 'level' ? Number(value) : value };
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...skills, { name: '', level: 50, proficiency: 'Intermediate' }]);
  };

  const handleRemove = (index) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm flex items-center gap-1"
        >
          <FaPlus size={12} /> Thêm
        </button>
      </div>
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <input
                type="text"
                value={skill.name}
                onChange={e => handleSkillChange(index, 'name', e.target.value)}
                placeholder="Tên"
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-3">
              <select
                value={skill.proficiency}
                onChange={e => handleSkillChange(index, 'proficiency', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PROFICIENCY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="col-span-4 flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={skill.level}
                onChange={e => handleSkillChange(index, 'level', e.target.value)}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-8">{skill.level}%</span>
            </div>
            <div className="col-span-1 flex justify-center">
              <button
                onClick={() => handleRemove(index)}
                className="text-red-500 hover:text-red-700"
                title="Xóa"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-gray-400 text-sm italic">Chưa có kỹ năng nào. Nhấn Thêm để bắt đầu.</p>
        )}
      </div>
    </div>
  );
}

function TagListEditor({ title, items, onChange }) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem('');
  };

  const handleRemove = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleChange = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h2>
      <div className="space-y-2 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={item}
              onChange={e => handleChange(index, e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-700"
              title="Xóa"
            >
              <FaTrash size={14} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-400 text-sm italic">Chưa có mục nào.</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Thêm mục mới..."
          className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm flex items-center gap-1"
        >
          <FaPlus size={12} /> Thêm
        </button>
      </div>
    </div>
  );
}

function AdminSkillsPage() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'pageContent', 'skills');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData({ ...DEFAULT_DATA, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching skills content:', error);
        toast.error('Không thể tải dữ liệu trang Skills');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, 'pageContent', 'skills');
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
      toast.success('Đã lưu nội dung trang Skills thành công!');
    } catch (error) {
      console.error('Error saving skills content:', error);
      toast.error('Lỗi khi lưu dữ liệu');
    } finally {
      setSaving(false);
    }
  };

  const update = (field) => (value) => setData(prev => ({ ...prev, [field]: value }));

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
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Quản lý trang Skills</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="space-y-6">
        <SkillCategoryEditor
          title="Programming Languages"
          skills={data.programmingLanguages}
          onChange={update('programmingLanguages')}
        />
        <SkillCategoryEditor
          title="Frameworks & Libraries"
          skills={data.frameworks}
          onChange={update('frameworks')}
        />
        <SkillCategoryEditor
          title="Tools & Platforms"
          skills={data.tools}
          onChange={update('tools')}
        />
        <SkillCategoryEditor
          title="Databases"
          skills={data.databases}
          onChange={update('databases')}
        />
        <TagListEditor
          title="Development Practices"
          items={data.devPractices}
          onChange={update('devPractices')}
        />
        <TagListEditor
          title="Soft Skills"
          items={data.softSkills}
          onChange={update('softSkills')}
        />
      </div>
    </div>
  );
}

export default AdminSkillsPage;
