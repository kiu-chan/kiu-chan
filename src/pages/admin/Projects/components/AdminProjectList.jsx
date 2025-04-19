import React, { useState } from 'react';
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import LoadingIndicator from '../../../../components/LoadingIndicator';

const AdminProjectList = ({ projects, loading, onEdit, onDelete }) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    projectId: null,
    projectName: ''
  });
  // Function to get the most appropriate image URL or base64 data
  const getProjectImage = (project) => {
    // Ưu tiên dùng base64 image nếu có
    if (project.imageBase64) return project.imageBase64;
    
    // Kiểm tra imageUrl nếu không có base64
    if (project.imageUrl) return project.imageUrl;
    
    // Không có ảnh
    return null;
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-600 text-lg">No projects found</p>
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
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full mr-3 overflow-hidden bg-gray-200 flex items-center justify-center">
                        {getProjectImage(project) ? (
                          <img 
                            src={getProjectImage(project)}
                            alt={project.name} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `
                                <div class="h-10 w-10 rounded-full flex items-center justify-center">
                                  <FaImage className="text-gray-500" />
                                </div>
                              `;
                            }}
                          />
                        ) : (
                          <FaImage className="text-gray-500" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{project.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {project.type === 'mobile_app' ? 'Mobile App' : 
                       project.type === 'web_app' ? 'Web App' : 
                       project.type === 'desktop_app' ? 'Desktop App' : project.type}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{project.year}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies?.slice(0, 3).map((tech, index) => (
                        <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                          {tech}
                        </span>
                      ))}
                      {project.technologies && project.technologies.length > 3 && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => onEdit(project)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="Edit Project"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmation({
                          show: true,
                          projectId: project.id,
                          projectName: project.name
                        })}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label="Delete Project"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete the project <span className="font-semibold">{deleteConfirmation.projectName}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation({ show: false, projectId: null, projectName: '' })}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(deleteConfirmation.projectId);
                  setDeleteConfirmation({ show: false, projectId: null, projectName: '' });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProjectList;