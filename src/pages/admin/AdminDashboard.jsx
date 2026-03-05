import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import { FaNewspaper, FaProjectDiagram, FaEye, FaPlus } from 'react-icons/fa';

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="text-xl text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        {loading ? (
          <div className="h-7 w-16 bg-gray-100 animate-pulse rounded mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        )}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, projects: 0, visitors: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [postsSnap, projectsSnap, visitorSnap, recentPostsSnap, recentProjectsSnap] =
          await Promise.all([
            getDocs(collection(db, 'posts')),
            getDocs(collection(db, 'projects')),
            getDoc(doc(db, 'Visitors', 'count')),
            getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(5))),
            getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(5))),
          ]);

        setStats({
          posts: postsSnap.size,
          projects: projectsSnap.size,
          visitors: visitorSnap.exists() ? visitorSnap.data().count : 0,
        });

        setRecentPosts(recentPostsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setRecentProjects(recentProjectsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const formatDate = (val) => {
    if (!val) return '—';
    const d = val?.toDate ? val.toDate() : new Date(val);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={FaEye}            label="Lượt xem" value={stats.visitors.toLocaleString()} color="bg-blue-500"   loading={loading} />
        <StatCard icon={FaNewspaper}      label="Bài viết" value={stats.posts}                     color="bg-indigo-500" loading={loading} />
        <StatCard icon={FaProjectDiagram} label="Projects" value={stats.projects}                  color="bg-violet-500" loading={loading} />
      </div>

      {/* Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Bài viết gần đây</h2>
            <Link to="/admin/posts" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              <FaPlus size={11} /> Thêm
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}
            </div>
          ) : recentPosts.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Chưa có bài viết nào.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentPosts.map(post => (
                <li key={post.id} className="py-2.5 flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-700 truncate flex-1">{post.title || 'Untitled'}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(post.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}

          <Link to="/admin/posts" className="block mt-4 text-center text-xs text-blue-500 hover:underline">
            Xem tất cả →
          </Link>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Projects gần đây</h2>
            <Link to="/admin/projects" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              <FaPlus size={11} /> Thêm
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}
            </div>
          ) : recentProjects.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Chưa có project nào.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentProjects.map(project => (
                <li key={project.id} className="py-2.5 flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-700 truncate flex-1">{project.title || 'Untitled'}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(project.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}

          <Link to="/admin/projects" className="block mt-4 text-center text-xs text-blue-500 hover:underline">
            Xem tất cả →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
