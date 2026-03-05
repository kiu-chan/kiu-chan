import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

// Danh sách icon có sẵn trên skillicons.dev
const AVAILABLE_ICONS = [
  'ableton','actix','adonis','alpinejs','anaconda','angular','ansible','apollo','appwrite','arch',
  'arduino','astro','atom','aws','azure','babel','bash','bevy','bitbucket','blender','bootstrap',
  'bsd','bun','c','cs','cpp','crystal','cassandra','clion','clojure','cloudflare','cmake',
  'codepen','coffeescript','css','cypress','d3','dart','debian','deno','discord','discordjs',
  'django','docker','dotnet','dynamodb','eclipse','elasticsearch','electron','elixir','elysia',
  'emacs','ember','express','fastapi','figma','firebase','flask','flutter','gatsby','gcp','git',
  'github','githubactions','gitlab','gmail','go','gradle','godot','grafana','graphql','gulp',
  'haskell','heroku','hibernate','html','htmx','idea','java','js','jenkins','jest','jquery',
  'kafka','kali','kotlin','ktor','kubernetes','laravel','latex','less','linkedin','linux','lua',
  'md','materialui','matlab','maven','mongodb','mysql','neovim','nginx','nim','nodejs','notion',
  'npm','nuxtjs','ocaml','perl','php','postgres','postman','powershell','prisma','processing',
  'prometheus','pycharm','python','pytorch','qt','r','rabbitmq','rails','raspberrypi','react',
  'redis','redux','remix','ruby','rust','scala','selenium','sentry','sequelize','solidjs',
  'spring','sqlite','supabase','svelte','swift','symfony','tailwind','tauri','tensorflow',
  'terraform','threejs','ts','ubuntu','unity','unreal','vercel','vim','visualstudio','vite',
  'vitest','vue','vuetify','wasm','webflow','webpack','wordpress','xd','zig',
];

const DEFAULT_SKILL_GROUPS = [
  { title: 'Languages & Technologies', icons: ['c', 'cpp', 'css', 'dart', 'html', 'java', 'js', 'py'] },
  { title: 'Frameworks & Tools', icons: ['anaconda', 'androidstudio', 'flutter', 'react', 'laravel', 'nodejs'] },
  { title: 'Development Tools', icons: ['aws', 'figma', 'firebase', 'git', 'github', 'gradle', 'idea', 'maven', 'postman', 'vscode'] },
  { title: 'Databases', icons: ['mongodb', 'mysql', 'postgres'] },
];

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
  githubUsername: "kiu-chan",
  skillGroups: DEFAULT_SKILL_GROUPS,
};

// ---- Icon Picker for one group ----
function IconGroupEditor({ group, onChange, onRemove }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleQueryChange = (e) => {
    const val = e.target.value.toLowerCase().trim();
    setQuery(val);
    if (val.length < 1) { setSuggestions([]); return; }
    setSuggestions(
      AVAILABLE_ICONS.filter(icon =>
        icon.includes(val) && !group.icons.includes(icon)
      ).slice(0, 10)
    );
  };

  const addIcon = (icon) => {
    if (group.icons.includes(icon)) return;
    onChange({ ...group, icons: [...group.icons, icon] });
    setQuery('');
    setSuggestions([]);
  };

  const removeIcon = (icon) => {
    onChange({ ...group, icons: group.icons.filter(i => i !== icon) });
  };

  const previewUrl = group.icons.length > 0
    ? `https://skillicons.dev/icons?i=${group.icons.join(',')}`
    : null;

  return (
    <div className="bg-white rounded-lg shadow p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 border-b pb-3">
        <input
          type="text"
          value={group.title}
          onChange={e => onChange({ ...group, title: e.target.value })}
          placeholder="Tên nhóm..."
          className="flex-1 text-base font-semibold border-0 border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 py-0.5 bg-transparent"
        />
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Xóa nhóm"
        >
          <FaTrash size={14} />
        </button>
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <img src={previewUrl} alt={group.title} className="h-10" />
        </div>
      )}

      {/* Icon chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {group.icons.map(icon => (
          <span
            key={icon}
            className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-100"
          >
            <img
              src={`https://skillicons.dev/icons?i=${icon}`}
              alt={icon}
              className="w-4 h-4"
            />
            {icon}
            <button
              onClick={() => removeIcon(icon)}
              className="text-blue-400 hover:text-red-500 ml-0.5"
            >
              <FaTimes size={10} />
            </button>
          </span>
        ))}
        {group.icons.length === 0 && (
          <p className="text-gray-400 text-xs italic">Chưa có icon nào.</p>
        )}
      </div>

      {/* Icon search */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={e => {
            if (e.key === 'Enter' && suggestions.length > 0) addIcon(suggestions[0]);
          }}
          placeholder="Tìm icon (vd: react, python, docker...)"
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map(icon => (
              <li key={icon}>
                <button
                  onClick={() => addIcon(icon)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-blue-50 text-gray-700"
                >
                  <img src={`https://skillicons.dev/icons?i=${icon}`} alt={icon} className="w-5 h-5" />
                  {icon}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ---- Main Admin Home Page ----
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
          const saved = docSnap.data();
          setData({
            ...DEFAULT_DATA,
            ...saved,
            skillGroups: saved.skillGroups?.length ? saved.skillGroups : DEFAULT_SKILL_GROUPS,
          });
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

  const handleChange = (field, value) => setData(prev => ({ ...prev, [field]: value }));

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

  const updateGroup = (index, group) => {
    const updated = [...data.skillGroups];
    updated[index] = group;
    handleChange('skillGroups', updated);
  };

  const removeGroup = (index) => {
    handleChange('skillGroups', data.skillGroups.filter((_, i) => i !== index));
  };

  const addGroup = () => {
    handleChange('skillGroups', [
      ...data.skillGroups,
      { title: 'Nhóm mới', icons: [] },
    ]);
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
                >
                  <FaTrash size={14} />
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
              <FaPlus size={12} /> Thêm
            </button>
          </div>
        </div>

        {/* Technical Skills */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Technical Skills</h2>
            <button
              onClick={addGroup}
              className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 text-sm flex items-center gap-1.5 transition-colors"
            >
              <FaPlus size={12} /> Thêm nhóm
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Icon slug từ{' '}
            <a href="https://skillicons.dev" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
              skillicons.dev
            </a>
            . Gõ tên để tìm kiếm và chọn icon.
          </p>
          <div className="space-y-4">
            {data.skillGroups.map((group, i) => (
              <IconGroupEditor
                key={i}
                index={i}
                group={group}
                onChange={(g) => updateGroup(i, g)}
                onRemove={() => removeGroup(i)}
              />
            ))}
            {data.skillGroups.length === 0 && (
              <p className="text-gray-400 text-sm italic bg-white rounded-lg shadow p-6 text-center">
                Chưa có nhóm skill nào. Nhấn "Thêm nhóm" để bắt đầu.
              </p>
            )}
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
