import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../../../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaImage, FaTimes, FaSpinner, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { useApi } from '../../../../contexts/ApiContext';

const AdminProjectModal = ({ project, onClose, onSuccess }) => {
  const { uploadImage, deleteImage, getImageURL, checkImageExists } = useApi();
  
  // State management
  const [formData, setFormData] = useState({
    name: '',
    type: 'web_app',
    year: new Date().getFullYear(),
    technologies: [],
    technologiesString: '',
    features: [],
    featuresText: '',
    content: '',
    description: '',
    challenges: '',
    solutions: '',
    imageUrl: '',
    imageFilename: '',
    links: {
      github: '',
      demo: '',
      appStore: '',
      googlePlay: ''
    }
  });

  const [imageState, setImageState] = useState({
    file: null,
    preview: null,
    loading: false,
    error: null,
    exists: false
  });

  const [uploadState, setUploadState] = useState({
    isUploading: false,
    progress: 0,
    error: null
  });

  const [formState, setFormState] = useState({
    isSubmitting: false,
    isDirty: false
  });

  // Reset image state
  const resetImageState = useCallback(() => {
    setImageState({
      file: null,
      preview: null,
      loading: false,
      error: null,
      exists: false
    });
  }, []);

  // Reset upload state
  const resetUploadState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null
    });
  }, []);

  // Initialize form data
  useEffect(() => {
    const initializeForm = async () => {
      if (project) {
        // Set form data
        const newFormData = {
          name: project.name || '',
          type: project.type || 'web_app',
          year: project.year || new Date().getFullYear(),
          technologies: project.technologies || [],
          technologiesString: project.technologies ? project.technologies.join(', ') : '',
          features: project.features || [],
          featuresText: project.features ? project.features.join('\n') : '',
          content: project.content || '',
          description: project.description || '',
          challenges: project.challenges || '',
          solutions: project.solutions || '',
          imageUrl: project.imageUrl || '',
          imageFilename: project.imageFilename || '',
          links: {
            github: (project.links?.github) || '',
            demo: (project.links?.demo) || '',
            appStore: (project.links?.appStore) || '',
            googlePlay: (project.links?.googlePlay) || ''
          }
        };

        setFormData(newFormData);

        // Handle existing image
        if (project.imageUrl || project.imageFilename) {
          setImageState(prev => ({ ...prev, loading: true, error: null }));

          try {
            const imageUrl = getImageURL(project.imageUrl || project.imageFilename);
            const exists = project.imageFilename ? await checkImageExists(project.imageFilename) : true;

            setImageState({
              file: null,
              preview: imageUrl,
              loading: false,
              error: exists ? null : 'Ảnh không tồn tại trên server',
              exists
            });
          } catch (error) {
            console.error('Error checking image:', error);
            setImageState({
              file: null,
              preview: null,
              loading: false,
              error: 'Không thể kiểm tra ảnh',
              exists: false
            });
          }
        }
      } else {
        // Reset for new project
        setFormData({
          name: '',
          type: 'web_app',
          year: new Date().getFullYear(),
          technologies: [],
          technologiesString: '',
          features: [],
          featuresText: '',
          content: '',
          description: '',
          challenges: '',
          solutions: '',
          imageUrl: '',
          imageFilename: '',
          links: {
            github: '',
            demo: '',
            appStore: '',
            googlePlay: ''
          }
        });
        resetImageState();
      }

      setFormState({ isSubmitting: false, isDirty: false });
      resetUploadState();
    };

    initializeForm();
  }, [project, getImageURL, checkImageExists, resetImageState, resetUploadState]);

  // Handle image upload
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error('File quá lớn. Kích thước tối đa 10MB');
        return;
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file);

      setImageState({
        file,
        preview: previewUrl,
        loading: false,
        error: null,
        exists: true
      });

      setFormState(prev => ({ ...prev, isDirty: true }));

      toast.success(`Đã chọn ảnh: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    } catch (error) {
      console.error('Error handling image upload:', error);
      toast.error('Lỗi khi xử lý ảnh');
    }

    // Reset input
    e.target.value = '';
  }, []);

  // Handle remove image
  const handleRemoveImage = useCallback(async () => {
    try {
      setImageState(prev => ({ ...prev, loading: true }));

      // Delete from server if exists
      if (formData.imageFilename) {
        try {
          await deleteImage(formData.imageFilename);
          console.log('Old image deleted successfully');
        } catch (error) {
          console.warn('Failed to delete old image:', error);
          // Don't fail the operation if delete fails
        }
      }

      // Cleanup preview URL
      if (imageState.preview && imageState.file) {
        URL.revokeObjectURL(imageState.preview);
      }

      // Reset states
      resetImageState();
      setFormData(prev => ({
        ...prev,
        imageUrl: '',
        imageFilename: ''
      }));

      setFormState(prev => ({ ...prev, isDirty: true }));
      toast.success('Đã xóa ảnh');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Lỗi khi xóa ảnh: ' + error.message);
      setImageState(prev => ({ ...prev, loading: false }));
    }
  }, [formData.imageFilename, imageState.preview, imageState.file, deleteImage, resetImageState]);

  // Handle form input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormState(prev => ({ ...prev, isDirty: true }));
  }, []);

  const handleTechnologiesChange = useCallback((e) => {
    const techString = e.target.value;
    setFormData(prev => ({
      ...prev,
      technologiesString: techString,
      technologies: techString.split(',').map(tech => tech.trim()).filter(tech => tech)
    }));
    setFormState(prev => ({ ...prev, isDirty: true }));
  }, []);

  const handleFeaturesChange = useCallback((e) => {
    const featuresText = e.target.value;
    setFormData(prev => ({
      ...prev,
      featuresText: featuresText,
      features: featuresText.split('\n').map(feature => feature.trim()).filter(feature => feature)
    }));
    setFormState(prev => ({ ...prev, isDirty: true }));
  }, []);

  const handleLinksChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        [name]: value || ''
      }
    }));
    setFormState(prev => ({ ...prev, isDirty: true }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (formState.isSubmitting || uploadState.isUploading) {
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));
    resetUploadState();

    try {
      let imageUrl = formData.imageUrl;
      let imageFilename = formData.imageFilename;

      // Handle image upload if new image selected
      if (imageState.file) {
        setUploadState(prev => ({ ...prev, isUploading: true, progress: 0, error: null }));

        try {
          // Delete old image first
          if (formData.imageFilename) {
            console.log('Deleting old image before upload...');
            try {
              await deleteImage(formData.imageFilename);
            } catch (deleteError) {
              console.warn('Failed to delete old image:', deleteError);
              // Continue with upload even if delete fails
            }
          }

          // Upload new image
          console.log('Uploading new image...');
          const uploadResult = await uploadImage(imageState.file, (progress) => {
            setUploadState(prev => ({ ...prev, progress }));
          });

          imageUrl = uploadResult.url;
          imageFilename = uploadResult.filename;

          console.log('Image upload successful:', { imageUrl, imageFilename });
          
          // Update image state
          setImageState(prev => ({
            ...prev,
            file: null,
            preview: imageUrl,
            exists: true,
            error: null
          }));

          toast.success('Upload ảnh thành công!');
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          setUploadState(prev => ({ ...prev, error: uploadError.message }));
          toast.error('Lỗi upload ảnh: ' + uploadError.message);
          return;
        } finally {
          setUploadState(prev => ({ ...prev, isUploading: false, progress: 0 }));
        }
      }

      // Prepare project data
      const projectData = {
        name: formData.name.trim(),
        type: formData.type,
        year: parseInt(formData.year),
        technologies: formData.technologies,
        features: formData.features,
        content: formData.content.trim(),
        description: formData.description.trim(),
        challenges: formData.challenges.trim(),
        solutions: formData.solutions.trim(),
        imageUrl: imageUrl,
        imageFilename: imageFilename,
        links: {
          github: formData.links.github.trim(),
          demo: formData.links.demo.trim(),
          appStore: formData.links.appStore.trim(),
          googlePlay: formData.links.googlePlay.trim()
        },
        updatedAt: new Date().toISOString()
      };

      // Save to database
      if (project?.id) {
        await updateDoc(doc(db, "projects", project.id), projectData);
        toast.success('Cập nhật dự án thành công!');
      } else {
        projectData.createdAt = new Date().toISOString();
        await addDoc(collection(db, "projects"), projectData);
        toast.success('Thêm dự án mới thành công!');
      }

      // Reset dirty state
      setFormState(prev => ({ ...prev, isDirty: false }));

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error('Lỗi khi lưu dự án: ' + error.message);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [
    formState.isSubmitting,
    uploadState.isUploading,
    formData,
    imageState.file,
    project,
    uploadImage,
    deleteImage,
    onSuccess,
    resetUploadState
  ]);

  // Handle close with dirty check
  const handleClose = useCallback(() => {
    if (formState.isDirty && !formState.isSubmitting) {
      if (window.confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn đóng không?')) {
        // Cleanup preview URL if exists
        if (imageState.preview && imageState.file) {
          URL.revokeObjectURL(imageState.preview);
        }
        onClose();
      }
    } else {
      // Cleanup preview URL if exists
      if (imageState.preview && imageState.file) {
        URL.revokeObjectURL(imageState.preview);
      }
      onClose();
    }
  }, [formState.isDirty, formState.isSubmitting, imageState.preview, imageState.file, onClose]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup preview URL on unmount
      if (imageState.preview && imageState.file) {
        URL.revokeObjectURL(imageState.preview);
      }
    };
  }, [imageState.preview, imageState.file]);

  const isLoading = formState.isSubmitting || uploadState.isUploading || imageState.loading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {project ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          {formState.isDirty && (
            <div className="mt-2 text-sm text-orange-600 flex items-center">
              <FaExclamationTriangle className="mr-2" />
              Có thay đổi chưa được lưu
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên dự án *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                placeholder="Nhập tên dự án"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại dự án *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              >
                <option value="web_app">Web Application</option>
                <option value="mobile_app">Mobile Application</option>
                <option value="desktop_app">Desktop Application</option>
                <option value="api">API/Backend</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Năm hoàn thành *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="2000"
                max={new Date().getFullYear() + 1}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Công nghệ sử dụng
              </label>
              <input
                type="text"
                name="technologiesString"
                value={formData.technologiesString}
                onChange={handleTechnologiesChange}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                placeholder="React, Node.js, MongoDB (phân cách bằng dấu phẩy)"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh dự án
            </label>
            
            {imageState.preview ? (
              <div className="relative inline-block">
                <div className="relative">
                  {imageState.loading ? (
                    <div className="w-32 h-32 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
                      <FaSpinner className="animate-spin text-gray-400 text-2xl" />
                    </div>
                  ) : imageState.error ? (
                    <div className="w-32 h-32 bg-red-50 rounded-lg border border-red-300 flex items-center justify-center">
                      <div className="text-center">
                        <FaExclamationTriangle className="mx-auto text-red-400 text-2xl mb-1" />
                        <p className="text-xs text-red-600">Lỗi ảnh</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={imageState.preview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
                      onError={() => setImageState(prev => ({ ...prev, error: 'Không thể tải ảnh' }))}
                      onLoad={() => setImageState(prev => ({ ...prev, error: null }))}
                    />
                  )}
                  
                  {imageState.exists && !imageState.error && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <FaCheck className="text-xs" />
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Xóa ảnh"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-gray-500 mb-2">
                  Chọn hình ảnh cho dự án
                  <br />
                  <span className="text-sm text-gray-400">(Tối đa 10MB, tự động nén nếu cần)</span>
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`inline-block px-4 py-2 rounded-md text-white transition-colors cursor-pointer ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isLoading ? 'Đang xử lý...' : 'Chọn ảnh'}
                </label>
              </div>
            )}

            {/* Upload Progress */}
            {uploadState.isUploading && (
              <div className="mt-3">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadState.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Đang upload: {uploadState.progress}%
                </p>
              </div>
            )}

            {/* Upload Error */}
            {uploadState.error && (
              <div className="mt-2 text-sm text-red-600 flex items-center">
                <FaExclamationTriangle className="mr-2" />
                {uploadState.error}
              </div>
            )}

            {/* Image Error */}
            {imageState.error && (
              <div className="mt-2 text-sm text-orange-600 flex items-center">
                <FaExclamationTriangle className="mr-2" />
                {imageState.error}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả ngắn
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors resize-vertical"
              placeholder="Mô tả ngắn gọn về dự án"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tính năng chính
            </label>
            <textarea
              name="featuresText"
              value={formData.featuresText}
              onChange={handleFeaturesChange}
              rows={4}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors resize-vertical"
              placeholder="Nhập mỗi tính năng trên một dòng"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung chi tiết
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={5}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors resize-vertical"
              placeholder="Mô tả chi tiết về dự án"
            />
          </div>

          {/* Challenges & Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thách thức
              </label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                rows={4}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors resize-vertical"
                placeholder="Những thách thức gặp phải trong dự án"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giải pháp
              </label>
              <textarea
                name="solutions"
                value={formData.solutions}
                onChange={handleChange}
                rows={4}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors resize-vertical"
                placeholder="Cách giải quyết các thách thức"
              />
            </div>
          </div>

          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Liên kết dự án
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={formData.links.github}
                  onChange={handleLinksChange}
                  disabled={isLoading}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Demo/Live</label>
                <input
                  type="url"
                  name="demo"
                  value={formData.links.demo}
                  onChange={handleLinksChange}
                  disabled={isLoading}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  placeholder="https://demo.example.com"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">App Store</label>
                <input
                  type="url"
                  name="appStore"
                  value={formData.links.appStore}
                  onChange={handleLinksChange}
                  disabled={isLoading}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  placeholder="https://apps.apple.com/..."
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Google Play</label>
                <input
                  type="url"
                  name="googlePlay"
                  value={formData.links.googlePlay}
                  onChange={handleLinksChange}
                  disabled={isLoading}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  placeholder="https://play.google.com/..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>
                    {uploadState.isUploading ? 'Đang upload...' : 'Đang lưu...'}
                  </span>
                </>
              ) : (
                <span>{project ? 'Cập nhật' : 'Thêm mới'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProjectModal;