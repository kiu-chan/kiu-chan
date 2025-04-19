import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaImage } from 'react-icons/fa';

const AdminProjectModal = ({ project, onClose, onSuccess }) => {
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
    imageBase64: '', // Thay đổi từ imageUrl sang imageBase64
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

  // Populate form when editing existing project
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
        imageBase64: project.imageBase64 || '',
        links: project.links || {
          github: '',
          demo: '',
          appStore: '',
          googlePlay: ''
        }
      });
      
      // Hiển thị ảnh từ base64 string nếu có
      if (project.imageBase64) {
        setImagePreview(project.imageBase64);
      }
    }
  }, [project]);

  // Chuyển đổi ảnh thành base64 string
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image file selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      
      // Chuyển đổi ảnh sang base64 và cập nhật formData
      convertImageToBase64(file)
        .then(base64String => {
          setFormData(prev => ({
            ...prev,
            imageBase64: base64String
          }));
        })
        .catch(error => {
          console.error('Error converting image to base64:', error);
          toast.error('Lỗi khi xử lý hình ảnh');
        });
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle technologies input
  const handleTechnologiesChange = (e) => {
    const techString = e.target.value;
    setFormData(prev => ({
      ...prev,
      // Chỉ chuyển đổi thành mảng khi cần lưu, không khi đang nhập
      technologiesString: techString
    }));
  };

  // Handle features input
  const handleFeaturesChange = (e) => {
    const featuresText = e.target.value;
    setFormData(prev => ({
      ...prev,
      featuresText: featuresText
    }));
  };

  // Handle link changes
  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        [name]: value
      }
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Xử lý technologies từ chuỗi thành mảng
      const technologiesArray = formData.technologiesString
        ? formData.technologiesString.split(',').map(tech => tech.trim()).filter(tech => tech !== '')
        : [];

      // Xử lý features từ chuỗi thành mảng
      const featuresArray = formData.featuresText
        ? formData.featuresText.split('\n').map(feature => feature.trim()).filter(feature => feature !== '')
        : [];

      // Prepare project data
      const projectData = {
        ...formData,
        technologies: technologiesArray,
        features: featuresArray,
        year: Number(formData.year)
      };

      // Xóa các trường trung gian để không lưu vào Firestore
      delete projectData.technologiesString;
      delete projectData.featuresText;

      let finalProjectData;
      if (project) {
        // Update existing project
        const projectRef = doc(db, "projects", project.id);
        await updateDoc(projectRef, projectData);
        finalProjectData = { ...projectData, id: project.id };
        toast.success('Project updated successfully');
      } else {
        // Add new project
        const newProjectRef = await addDoc(collection(db, "projects"), projectData);
        finalProjectData = { ...projectData, id: newProjectRef.id };
        toast.success('Project added successfully');
      }

      onSuccess(finalProjectData);
    } catch (error) {
      toast.error('Failed to save project');
      console.error('Project save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Image
            </label>
            <div className="flex items-center space-x-4">
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Project Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = `
                        <div class="flex items-center justify-center h-full w-full">
                          <FaImage className="text-gray-500" />
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <FaImage className="text-gray-500" />
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="web_app">Web App</option>
                <option value="mobile_app">Mobile App</option>
                <option value="desktop_app">Desktop App</option>
              </select>
            </div>
          </div>

          {/* Year and Technologies */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input 
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies (comma-separated)
              </label>
              <input 
                type="text"
                value={formData.technologiesString}
                onChange={handleTechnologiesChange}
                placeholder="React, Node.js, Firebase"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Content and Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Content
              </label>
              <textarea 
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A brief overview of the project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide a detailed description of the project"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (one per line)
            </label>
            <textarea 
              value={formData.featuresText}
              onChange={handleFeaturesChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter each feature on a new line"
            />
          </div>

          {/* Project Links */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Link
              </label>
              <input 
                type="url"
                name="github"
                value={formData.links.github}
                onChange={handleLinkChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/username/project"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Live Demo Link
              </label>
              <input 
                type="url"
                name="demo"
                value={formData.links.demo}
                onChange={handleLinkChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourproject.com"
              />
            </div>
          </div>

          {/* Mobile App Store Links */}
          {formData.type === 'mobile_app' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App Store Link
                </label>
                <input 
                  type="url"
                  name="appStore"
                  value={formData.links.appStore}
                  onChange={handleLinkChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://apps.apple.com/app/id123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Play Link
                </label>
                <input 
                  type="url"
                  name="googlePlay"
                  value={formData.links.googlePlay}
                  onChange={handleLinkChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://play.google.com/store/apps/details?id=com.example.app"
                />
              </div>
            </div>
          )}

          {/* Challenges and Solutions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenges
              </label>
              <textarea 
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What challenges did you face during development?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Solutions
              </label>
              <textarea 
                name="solutions"
                value={formData.solutions}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="How did you overcome these challenges?"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : (project ? 'Update Project' : 'Add Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProjectModal;