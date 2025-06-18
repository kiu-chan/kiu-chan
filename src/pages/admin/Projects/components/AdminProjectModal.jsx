import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaImage, FaTimes } from 'react-icons/fa';
import { useApi } from '../../../../contexts/ApiContext';

const AdminProjectModal = ({ project, onClose, onSuccess }) => {
  const { uploadImage, deleteImage, getImageURL } = useApi();
  
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
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
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
          github: (project.links && project.links.github) || '',
          demo: (project.links && project.links.demo) || '',
          appStore: (project.links && project.links.appStore) || '',
          googlePlay: (project.links && project.links.googlePlay) || ''
        }
      });
      
      if (project.imageUrl) {
        setImagePreview(getImageURL(project.imageUrl));
      }
    }
  }, [project, getImageURL]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh');
        return;
      }

      // Kiểm tra kích thước file (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = async () => {
    try {
      // Xóa ảnh cũ từ server nếu có
      if (formData.imageFilename) {
        await deleteImage(formData.imageFilename);
      }
      
      setImageFile(null);
      setImagePreview(null);
      setFormData(prev => ({
        ...prev,
        imageUrl: '',
        imageFilename: ''
      }));
      
      toast.success('Đã xóa ảnh');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Lỗi khi xóa ảnh');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTechnologiesChange = (e) => {
    const techString = e.target.value;
    setFormData(prev => ({
      ...prev,
      technologiesString: techString,
      technologies: techString.split(',').map(tech => tech.trim()).filter(tech => tech)
    }));
  };

  const handleFeaturesChange = (e) => {
    const featuresText = e.target.value;
    setFormData(prev => ({
      ...prev,
      featuresText: featuresText,
      features: featuresText.split('\n').map(feature => feature.trim()).filter(feature => feature)
    }));
  };

  const handleLinksChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        [name]: value || '' // Đảm bảo luôn có giá trị string, không bao giờ undefined
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;
      let imageFilename = formData.imageFilename;

      // Upload ảnh mới nếu có
      if (imageFile) {
        setIsUploading(true);
        
        try {
          // Xóa ảnh cũ nếu có
          if (formData.imageFilename) {
            await deleteImage(formData.imageFilename);
          }

          const uploadResult = await uploadImage(imageFile, setUploadProgress);
          imageUrl = uploadResult.url;
          imageFilename = uploadResult.filename;
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error('Lỗi khi upload ảnh: ' + uploadError.message);
          return;
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }

      const projectData = {
        name: formData.name,
        type: formData.type,
        year: parseInt(formData.year),
        technologies: formData.technologies,
        features: formData.features,
        content: formData.content,
        description: formData.description,
        challenges: formData.challenges,
        solutions: formData.solutions,
        imageUrl: imageUrl,
        imageFilename: imageFilename,
        links: formData.links,
        updatedAt: new Date().toISOString()
      };

      if (project?.id) {
        await updateDoc(doc(db, "projects", project.id), projectData);
        toast.success('Cập nhật dự án thành công');
      } else {
        projectData.createdAt = new Date().toISOString();
        await addDoc(collection(db, "projects"), projectData);
        toast.success('Thêm dự án thành công');
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error('Lỗi khi lưu dự án');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {project ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="React, Node.js, MongoDB (phân cách bằng dấu phẩy)"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh dự án
            </label>
            
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-gray-500 mb-2">Chọn hình ảnh cho dự án</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer inline-block"
                >
                  Chọn ảnh
                </label>
              </div>
            )}

            {isUploading && (
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Đang upload: {Math.round(uploadProgress)}%
                </p>
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://play.google.com/..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting || isUploading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : (project ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProjectModal;