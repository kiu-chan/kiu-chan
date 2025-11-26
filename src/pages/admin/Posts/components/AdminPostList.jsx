import React, { useState } from 'react';
import { FaEdit, FaTrash, FaImage, FaExclamationTriangle } from 'react-icons/fa';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import { useApi } from '../../../../contexts/ApiContext';

const AdminPostList = ({ posts, loading, onEdit, onDelete }) => {
  const { getImageURL } = useApi();
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    postId: null,
    postTitle: ''
  });
  const [imageErrors, setImageErrors] = useState(new Set());

  const getPostImage = (post) => {
    if (!post) return null;
    if (post.coverUrl) {
      return getImageURL(post.coverUrl);
    }
    if (post.coverFilename) {
      return getImageURL(post.coverFilename);
    }
    return null;
  };

  const handleImageError = (postId) => {
    setImageErrors(prev => new Set(prev).add(postId));
  };

  const handleDeleteClick = (postId, postTitle) => {
    setDeleteConfirmation({
      show: true,
      postId,
      postTitle
    });
  };

  const handleConfirmDelete = () => {
    onDelete(deleteConfirmation.postId);
    setDeleteConfirmation({ show: false, postId: null, postTitle: '' });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, postId: null, postTitle: '' });
  };

  if (loading) return <LoadingIndicator />;

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">No posts yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map(post => {
                const imageUrl = getPostImage(post);
                const hasImageError = imageErrors.has(post.id);
                return (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full mr-3 overflow-hidden bg-gray-200 flex items-center justify-center">
                          {imageUrl && !hasImageError ? (
                            <img 
                              src={imageUrl}
                              alt={post.title}
                              className="h-full w-full object-cover"
                              onError={() => handleImageError(post.id)}
                            />
                          ) : hasImageError ? (
                            <FaExclamationTriangle className="text-orange-500 text-sm" />
                          ) : (
                            <FaImage className="text-gray-400 text-sm" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{post.title}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {post.published ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{post.createdAt ? (post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()) : ''}</td>
                    <td className="p-3 text-gray-600">{post.views || 0}</td>
                    <td className="p-3">
                      <div className="flex justify-center space-x-2">
                        <button onClick={() => onEdit(post)} className="text-blue-600 hover:text-blue-800 p-1">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteClick(post.id, post.title)} className="text-red-600 hover:text-red-800 p-1">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{deleteConfirmation.postTitle}"?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={handleCancelDelete} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPostList;