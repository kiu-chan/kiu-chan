import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import LoadingIndicator from '../components/LoadingIndicator';
import { useApi } from '../../../contexts/ApiContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { getImageURL } = useApi();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectDoc = doc(db, "projects", id);
        const projectSnapshot = await getDoc(projectDoc);
        
        if (projectSnapshot.exists()) {
          setProject({
            id: projectSnapshot.id,
            ...projectSnapshot.data()
          });
        } else {
          setError("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const getImageSource = () => {
    // Ưu tiên imageUrl từ server API mới
    if (project?.imageUrl) {
      return getImageURL(project.imageUrl);
    }
    // Fallback về imageBase64 nếu vẫn có dữ liệu cũ
    if (project?.imageBase64) {
      return project.imageBase64;
    }
    // Fallback cuối cùng là ảnh local
    return `/project/${id}/1.png`;
  };

  const getTypeLabel = () => {
    const typeMap = {
      'mobile_app': 'Mobile Application',
      'web_app': 'Web Application',
      'desktop_app': 'Desktop Application',
      'api': 'API/Backend Service',
      'other': 'Other'
    };
    return typeMap[project?.type] || project?.type || 'Unknown';
  };

  const renderTechBadges = () => {
    if (!project?.technologies || !Array.isArray(project.technologies) || project.technologies.length === 0) {
      return null;
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech, index) => (
          <span 
            key={index} 
            className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-200"
          >
            {tech}
          </span>
        ))}
      </div>
    );
  };

  const renderFeatures = () => {
    if (!project?.features || !Array.isArray(project.features) || project.features.length === 0) {
      return null;
    }
    
    return (
      <ul className="space-y-3">
        {project.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
            <span className="text-gray-700 leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderProjectLinks = () => {
    if (!project?.links || typeof project.links !== 'object') {
      return null;
    }

    const linkConfig = {
      github: {
        label: 'GitHub Repository',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        ),
        color: 'text-gray-800 border-gray-300 hover:bg-gray-50'
      },
      demo: {
        label: 'Live Demo',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        ),
        color: 'text-blue-600 border-blue-300 hover:bg-blue-50'
      },
      appStore: {
        label: 'App Store',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 17.607c-.786 2.28-3.139 6.317-5.563 6.361-1.608.031-2.125-.953-3.963-.953-1.837 0-2.412.923-3.932.983-2.572.099-6.542-5.827-6.542-10.995 0-4.747 3.308-7.1 6.198-7.143-.135-.521-.202-1.072-.202-1.651 0-1.559.732-2.953 1.871-3.845.676-.545 1.489-.872 2.378-.872.726 0 1.417.193 2.007.545.59-.352 1.281-.545 2.007-.545.889 0 1.702.327 2.378.872 1.139.892 1.871 2.286 1.871 3.845 0 .579-.067 1.13-.202 1.651 2.89.043 6.198 2.396 6.198 7.143z"/>
          </svg>
        ),
        color: 'text-black border-gray-300 hover:bg-gray-50'
      },
      googlePlay: {
        label: 'Google Play',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
          </svg>
        ),
        color: 'text-green-600 border-green-300 hover:bg-green-50'
      }
    };

    const validLinks = Object.entries(project.links).filter(([key, value]) => value && value.trim());
    
    if (validLinks.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-3">
        {validLinks.map(([key, url]) => {
          const config = linkConfig[key] || {
            label: key.charAt(0).toUpperCase() + key.slice(1),
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            ),
            color: 'text-blue-600 border-blue-300 hover:bg-blue-50'
          };

          return (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center px-4 py-2 border rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md ${config.color}`}
            >
              {config.icon}
              <span className="ml-2">{config.label}</span>
            </a>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="pt-16 container mx-auto px-4 text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.619-6.364-1.709M12 9V3" />
          </svg>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">{error || "Project not found"}</h2>
          <p className="mt-2 text-gray-600">The project you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/projects" 
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link 
            to="/projects" 
            className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{project.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                {getTypeLabel()}
              </span>
              {project.year && (
                <span className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  {project.year}
                </span>
              )}
            </div>

            {project.description && (
              <p className="text-xl text-blue-100 leading-relaxed max-w-3xl">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Image */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src={getImageSource()} 
                  alt={project.name} 
                  className="w-full h-64 lg:h-96 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    if (e.target.src !== `/project/${id}/1.png`) {
                      e.target.src = `/project/${id}/1.png`;
                    } else {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23f8fafc'/%3E%3Ctext x='400' y='200' font-family='Arial' font-size='20' fill='%236b7280' text-anchor='middle' alignment-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";
                    }
                  }}
                />
              </div>

              {/* Project Overview */}
              {project.content && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Project</h2>
                  <div className="prose prose-lg text-gray-700 max-w-none">
                    <p className="whitespace-pre-line leading-relaxed">{project.content}</p>
                  </div>
                </div>
              )}

              {/* Key Features */}
              {project.features && project.features.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                  {renderFeatures()}
                </div>
              )}

              {/* Challenges & Solutions */}
              {(project.challenges || project.solutions) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.challenges && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-8 bg-red-500 rounded-full mr-3"></div>
                        Challenges
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{project.challenges}</p>
                    </div>
                  )}
                  
                  {project.solutions && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
                        Solutions
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{project.solutions}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Technologies Used</h3>
                  {renderTechBadges()}
                </div>
              )}

              {/* Project Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Project Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Type:</span>
                    <span className="text-gray-900">{getTypeLabel()}</span>
                  </div>
                  {project.year && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Year:</span>
                      <span className="text-gray-900">{project.year}</span>
                    </div>
                  )}
                  {project.createdAt && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Created:</span>
                      <span className="text-gray-900">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {project.updatedAt && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Updated:</span>
                      <span className="text-gray-900">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Links */}
              {project.links && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Project Links</h3>
                  {renderProjectLinks()}
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link 
                    to="/projects"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    View All Projects
                  </Link>
                  <Link 
                    to="/"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;