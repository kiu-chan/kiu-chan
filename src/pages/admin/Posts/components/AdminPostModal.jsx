import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaTimes, FaSpinner, FaImage } from 'react-icons/fa';
import { useApi } from '../../../../contexts/ApiContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

/*
  Note: Requires installing packages:
    npm install react-quill dompurify
  or
    yarn add react-quill dompurify
*/

const AdminPostModal = ({ post, onClose, onSuccess }) => {
  const { uploadImage, deleteImage, getImageURL, refreshImageCache } = useApi();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    tags: [],
    tagsString: '',
    coverUrl: '',
    coverFilename: '',
    published: false
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreviewHtml, setShowPreviewHtml] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        tags: post.tags || [],
        tagsString: post.tags ? post.tags.join(', ') : '',
        coverUrl: post.coverUrl || '',
        coverFilename: post.coverFilename || '',
        published: !!post.published
      });

      if (post.coverUrl || post.coverFilename) {
        const url = getImageURL(post.coverUrl || post.coverFilename);
        setImagePreview(url);
      }
    }
  }, [post, getImageURL]);

  const slugify = (text) =>
    text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '') || '';

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleRemoveImage = async () => {
    try {
      if (formData.coverFilename) {
        await deleteImage(formData.coverFilename);
      }
      if (imagePreview && imageFile) URL.revokeObjectURL(imagePreview);
      setImageFile(null);
      setImagePreview(null);
      setFormData(prev => ({ ...prev, coverUrl: '', coverFilename: '' }));
      toast.success('Image removed');
    } catch (err) {
      toast.error('Error removing image');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'published') {
      setFormData(prev => ({ ...prev, published: checked }));
      return;
    }

    // If user edits title and slug is empty (not manually set), auto update slug
    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: prev.slug ? prev.slug : slugify(value)
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      tagsString: val,
      tags: val.split(',').map(t => t.trim()).filter(Boolean)
    }));
  };

  // React-Quill modules and formats
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image', 'blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      ['clean']
    ]
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image', 'blockquote', 'code-block',
    'align', 'color', 'background'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isUploading) return;
    setIsSubmitting(true);

    try {
      let coverUrl = formData.coverUrl;
      let coverFilename = formData.coverFilename;

      if (imageFile) {
        setIsUploading(true);
        setUploadProgress(0);
        try {
          if (formData.coverFilename) {
            await deleteImage(formData.coverFilename);
          }
          const uploadResult = await uploadImage(imageFile, setUploadProgress);
          coverUrl = uploadResult.url;
          coverFilename = uploadResult.filename;
          setImagePreview(uploadResult.url);
          setImageFile(null);
          setTimeout(() => refreshImageCache(), 100);
          toast.success('Image uploaded');
        } catch (uploadErr) {
          toast.error('Upload error: ' + uploadErr.message);
          return;
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }

      const postData = {
        title: formData.title.trim(),
        slug: formData.slug ? slugify(formData.slug) : slugify(formData.title),
        content: formData.content || '',
        tags: formData.tags,
        coverUrl: coverUrl || '',
        coverFilename: coverFilename || '',
        published: !!formData.published,
        updatedAt: serverTimestamp()
      };

      if (post?.id) {
        await updateDoc(doc(db, "posts", post.id), postData);
        toast.success('Post updated');
      } else {
        postData.createdAt = serverTimestamp();
        await addDoc(collection(db, "posts"), postData);
        toast.success('Post created');
      }

      setTimeout(() => refreshImageCache(), 100);
      onSuccess();
    } catch (err) {
      console.error('Error saving post:', err);
      toast.error('Error saving post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isUploading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{post ? 'Edit Post' : 'Add New Post'}</h2>
            <button onClick={onClose} disabled={isLoading} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required disabled={isLoading}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input name="slug" value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }))} disabled={isLoading}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" />
            <p className="text-xs text-gray-500 mt-1">Lowercase, hyphen-separated</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content (HTML)</label>
            <div className="mt-2">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write your HTML content here..."
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Content is saved as HTML. For safety, sanitize output when rendering on public pages.</p>

            <div className="mt-3 flex items-center gap-3">
              <button type="button" onClick={() => setShowPreviewHtml(s => !s)} className="text-sm px-3 py-1 border rounded">
                {showPreviewHtml ? 'Hide Preview' : 'Show Preview'}
              </button>

              <span className="text-xs text-gray-500">Preview below is sanitized using DOMPurify</span>
            </div>

            {showPreviewHtml && (
              <div className="mt-4 border rounded p-3 bg-gray-50">
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formData.content || '<p>(empty)</p>') }} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input name="tagsString" value={formData.tagsString} onChange={handleTagsChange} disabled={isLoading}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" placeholder="tag1, tag2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cover Image (optional)</label>
            <div className="mt-2 flex items-start gap-4">
              <div>
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="cover" className="w-40 h-24 object-cover rounded-md" />
                    <button type="button" onClick={handleRemoveImage} disabled={isLoading} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ) : (
                  <div className="w-40 h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                    <FaImage />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} />
                {isUploading && (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="text-sm text-gray-600 mt-1"><FaSpinner className="animate-spin inline-block mr-2" />Uploading {uploadProgress}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center">
              <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} disabled={isLoading} className="form-checkbox" />
              <span className="ml-2 text-sm text-gray-700">Publish</span>
            </label>
            <div className="text-sm text-gray-500">{isLoading ? 'Processing...' : 'Ready'}</div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" disabled={isLoading || !formData.title.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {isLoading ? (<><FaSpinner className="animate-spin mr-2" />Saving...</>) : (post ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPostModal;