import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

/**
 * Strip HTML tags to create a plain-text excerpt
 */
function stripHtml(html = '') {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * Format Firestore timestamp (or string/number) to readable date
 */
function formatDate(ts) {
  if (!ts) return '';
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString();
}

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsRef = collection(db, 'posts');
        // order by createdAt descending if exists
        const q = query(postsRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (mounted) setPosts(list);
      } catch (err) {
        console.error('Error fetching posts:', err);
        if (mounted) setError('Failed to load posts');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-blue-100 mt-2">All published posts</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {posts.map(post => (
                <article key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="md:flex">
                    {post.coverUrl ? (
                      <div className="md:w-1/3">
                        <img
                          src={post.coverUrl}
                          alt={post.title}
                          className="w-full h-40 object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%2780%27 viewBox=%270 0 120 80%27%3E%3Crect width=%27120%27 height=%2780%27 fill=%27%23f3f4f6%27/%3E%3C/text%3E%3C/svg%3E'; }}
                        />
                      </div>
                    ) : null}

                    <div className={`p-6 ${post.coverUrl ? 'md:w-2/3' : 'w-full'}`}>
                      <h2 className="text-2xl font-bold text-gray-900">
                        <Link to={`/posts/${post.id}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </h2>

                      <div className="mt-2 text-sm text-gray-500 flex items-center gap-4">
                        <span>Published: {formatDate(post.createdAt)}</span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                          {(post.views || 0)} views
                        </span>
                      </div>

                      <p className="mt-4 text-gray-700">
                        {stripHtml(post.content || '').slice(0, 220)}
                        {stripHtml(post.content || '').length > 220 ? '…' : ''}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {post.tags && Array.isArray(post.tags) && post.tags.slice(0, 3).map((t, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{t}</span>
                          ))}
                        </div>

                        <Link
                          to={`/posts/${post.id}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Read more
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}