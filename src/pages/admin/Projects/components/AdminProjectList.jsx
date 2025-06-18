import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaImage, FaExclamationTriangle } from 'react-icons/fa';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import { useApi } from '../../../../contexts/ApiContext';

const AdminProjectList = ({ projects, loading, onEdit, onDelete }) => {
  const { getImageURL } = useApi();
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    projectId: null,
    projectName: ''
  });
  const [imageErrors, setImageErrors] = useState(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for image refresh events
  useEffect(() => {
    const handleRefresh = () => {
      setRefreshKey(prev => prev + 1);
      setImageErrors(new Set()); // Clear errors
    };

    window.addEventListener('refreshImages', handleRefresh);
    return () => window.removeEventListener('refreshImages', handleRefresh);
  }, []);

  const getProjectImage = (project) => {
    if (!project) return null;
    
    if (project.imageUrl) {
      return getImageURL(project.imageUrl);
    }
    if (project.imageFilename) {
      return getImageURL(project.imageFilename);
    }
    return null;
  };

  const handleImageError = (projectId) => {
    setImageErrors(prev => new Set(prev).add(projectId));
  };

  const handleImageLoad = (projectId) => {
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(projectId);
      return newSet;
    });
  };

  const handleDeleteClick = (projectId, projectName) => {
    setDeleteConfirmation({
      show: true,
      projectId: projectId,
      projectName: projectName
    });
  };

  const handleConfirmDelete = () => {
    onDelete(deleteConfirmation.projectId);
    setDeleteConfirmation({
      show: false,
      projectId: null,
      projectName: ''
    });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({
      show: false,
      projectId: null,
      projectName: ''
    });
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">Chưa có dự án nào</p>
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
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technologies</th>
                <th className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => {
                const imageUrl = getProjectImage(project);
                const hasImageError = imageErrors.has(project.id);
                
                return (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full mr-3 overflow-hidden bg-gray-200 flex items-center justify-center">
                          {imageUrl && !hasImageError ? (
                            <img 
                              key={`${project.id}-${refreshKey}`} // Force re-render với refreshKey
                              src={imageUrl}
                              alt={project.name} 
                              className="h-full w-full object-cover"
                              onError={() => handleImageError(project.id)}
                              onLoad={() => handleImageLoad(project.id)}
                            />
                          ) : hasImageError ? (
                            <FaExclamationTriangle className="text-orange-500 text-sm" />
                          ) : (
                            <FaImage className="text-gray-400 text-sm" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{project.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.type === 'mobile_app' ? 'bg-green-100 text-green-800' :
                        project.type === 'web_app' ? 'bg-blue-100 text-blue-800' :
                        project.type === 'desktop_app' ? 'bg-purple-100 text-purple-800' :
                        project.type === 'api' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.type === 'mobile_app' ? 'Mobile App' : 
                         project.type === 'web_app' ? 'Web App' : 
                         project.type === 'desktop_app' ? 'Desktop App' :
                         project.type === 'api' ? 'API/Backend' : 
                         'Other'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{project.year}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies && project.technologies.length > 0 ? (
                          <>
                            {project.technologies.slice(0, 3).map((tech, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">No technologies</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => onEdit(project)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(project.id, project.name)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xóa "{deleteConfirmation.projectName}"?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProjectList;