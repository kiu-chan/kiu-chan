import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import AdminPostList from './components/AdminPostList';
import AdminPostModal from './components/AdminPostModal';
import { toast } from 'react-toastify';
import { useApi } from '../../../contexts/ApiContext';

const AdminPosts = () => {
  const { deleteImage } = useApi();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsCollection = collection(db, "posts");
      const postSnapshot = await getDocs(postsCollection);
      const postList = postSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postList);
    } catch (error) {
      toast.error('Error fetching posts');
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post?.coverFilename) {
        try {
          await deleteImage(post.coverFilename);
        } catch (imageError) {
          console.error('Error deleting post image:', imageError);
        }
      }

      await deleteDoc(doc(db, "posts", postId));
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      toast.error('Error deleting post');
      console.error("Error deleting post:", error);
    }
  };

  const handleOpenModal = (post = null) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    fetchPosts();
    handleCloseModal();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-0">Posts Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Post
        </button>
      </div>

      <AdminPostList 
        posts={posts}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDeletePost}
      />

      {isModalOpen && (
        <AdminPostModal 
          post={selectedPost}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default AdminPosts;