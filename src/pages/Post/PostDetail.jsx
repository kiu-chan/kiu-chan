import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

/**
 * Format Firestore timestamp (or string/number) to readable date/time
 */
function formatDateTime(ts) {
  if (!ts) return '';
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

/**
 * Post detail page: fetch a post by doc id, increment views once per session/tab,
 * render HTML content.
 *
 * To avoid double-counting (e.g., React.StrictMode double-mount in development),
 * we keep a sessionStorage list "viewed_posts" and only increment Firestore when
 * the current post id is not yet recorded for this session/tab.
 *
 * NOTE: content is rendered with dangerouslySetInnerHTML -> sanitize in production (DOMPurify).
 */
export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('Missing post id');
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchAndMaybeIncrement = async () => {
      try {
        setLoading(true);
        const postRef = doc(db, 'posts', id);
        const snap = await getDoc(postRef);

        if (!snap.exists()) {
          if (mounted) {
            setError('Post not found');
            setLoading(false);
          }
          return;
        }

        const data = snap.data() || {};
        if (mounted) setPost({ id: snap.id, ...data });

        // Use sessionStorage to avoid incrementing multiple times in the same tab/session
        // (helps prevent double increments from StrictMode/dev double-mounts).
        let viewed = [];
        try {
          viewed = JSON.parse(sessionStorage.getItem('viewed_posts') || '[]');
          if (!Array.isArray(viewed)) viewed = [];
        } catch (e) {
          viewed = [];
        }

        const alreadyViewed = viewed.includes(id);

        if (!alreadyViewed) {
          // increment views in Firestore
          try {
            await updateDoc(postRef, { views: increment(1) });
            // mark as viewed in this session/tab
            viewed.push(id);
            try {
              sessionStorage.setItem('viewed_posts', JSON.stringify(viewed));
            } catch (e) {
              // ignore sessionStorage set failures
            }
            // display incremented value immediately (optimistic)
            const displayed = (data.views || 0) + 1;
            if (mounted) setViews(displayed);
          } catch (incErr) {
            console.error('Failed to increment views:', incErr);
            // fallback to showing stored value
            if (mounted) setViews(data.views || 0);
          }
        } else {
          // already viewed in this session/tab, don't increment
          if (mounted) setViews(data.views || 0);
        }
      } catch (err) {
        console.error('Error loading post:', err);
        if (mounted) setError('Failed to load post');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAndMaybeIncrement();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/posts" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to posts
          </Link>
        </div>
      </div>
    );
  }

  const htmlContent = post?.content || '<p>No content</p>';

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl">
            <Link to="/posts" className="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors">
              ← Back to posts
            </Link>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
              <span>Published: {formatDateTime(post.createdAt)}</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">{views} views</span>
            </div>

            {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((t, i) => (
                  <span key={i} className="bg-white bg-opacity-20 text-sm px-3 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
          {post.coverUrl && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <img
                src={post.coverUrl}
                alt={post.title}
                className="w-full h-64 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27800%27 height=%27400%27 viewBox=%270 0 800 400%27%3E%3Crect width=%27800%27 height=%27400%27 fill=%27%23f8fafc%27/%3E%3C/text%3E%3C/svg%3E'; }}
              />
            </div>
          )}

          {/* NOTE: Rendering HTML. In production sanitize HTML (e.g., DOMPurify) to prevent XSS */}
          <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
    </div>
  );
}