// pages/ProjectDetail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import LoadingIndicator from '../../Projects/components/LoadingIndicator';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const projectDoc = doc(db, "projects", id);
        const projectSnapshot = await getDoc(projectDoc);
        
        if (projectSnapshot.exists()) {
          setProject({
            id: projectSnapshot.id,
            ...projectSnapshot.data()
          });
        } else {
          console.error("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Xử lý lỗi hình ảnh và sử dụng hình ảnh local nếu cần
  const handleImageError = () => {
    setImageError(true);
  };

  // Tạo đường dẫn hình ảnh local dựa trên id dự án
  const getLocalImagePath = () => {
    return `/project/${id}/1.png`;
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!project) {
    return (
      <div className="pt-16 container mx-auto px-4 text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
        <Link to="/projects" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const { 
    name, 
    content, 
    imageUrl, 
    type, 
    year, 
    technologies, 
    description,
    features,
    challenges,
    solutions,
    links
  } = project;

  // Format type for display
  const getTypeLabel = () => {
    const typeMap = {
      'mobile_app': 'Mobile App',
      'web_app': 'Web App',
      'desktop_app': 'Desktop App'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/projects" className="flex items-center text-white mb-4 hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex items-center mt-2">
            <span className="bg-white text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
              {getTypeLabel()}
            </span>
            {year && (
              <span className="ml-3 text-white text-sm">
                {year}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Project Image */}
          <div className="mb-8 rounded-lg overflow-hidden shadow-md">
            {/* Sử dụng imageUrl từ Firestore hoặc sử dụng hình ảnh local */}
            {!imageError && imageUrl ? (
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-auto"
                onError={handleImageError}
              />
            ) : (
              <img 
                src={getLocalImagePath()} 
                alt={name} 
                className="w-full h-auto"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/project/default.png';
                }}
              />
            )}
          </div>
          
          {/* Project Overview */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Overview</h2>
            <p className="text-gray-700">{content}</p>
            
            {description && (
              <div className="mt-4 text-gray-700">
                {description}
              </div>
            )}

            {/* Technologies */}
            {technologies && Array.isArray(technologies) && technologies.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Features */}
          {features && Array.isArray(features) && features.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features</h2>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Challenges & Solutions */}
          {(challenges || solutions) && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Challenges & Solutions</h2>
              
              {challenges && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Challenges</h3>
                  <p className="text-gray-700">{challenges}</p>
                </div>
              )}
              
              {solutions && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Solutions</h3>
                  <p className="text-gray-700">{solutions}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Links */}
          {links && typeof links === 'object' && Object.keys(links).length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Links</h2>
              <div className="flex flex-wrap gap-4">
                {links.github && (
                  <a 
                    href={links.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View on GitHub
                  </a>
                )}
                
                {links.demo && (
                  <a 
                    href={links.demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </a>
                )}
                
                {links.appStore && (
                  <a 
                    href={links.appStore} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 17.607c-.786 2.28-3.139 6.317-5.563 6.361-1.608.031-2.125-.953-3.963-.953-1.837 0-2.412.923-3.932.983-2.572.099-6.542-5.827-6.542-10.995 0-4.747 3.308-7.1 6.198-7.143 1.55-.028 3.014 1.045 3.959 1.045.949 0 2.727-1.29 4.596-1.101.782.033 2.979.315 4.389 2.377-3.741 2.442-3.158 7.549.858 9.426zm-5.222-17.607c-2.826.114-5.132 3.079-4.81 5.531 2.612.203 5.118-2.725 4.81-5.531z"/>
                    </svg>
                    App Store
                  </a>
                )}
                
                {links.googlePlay && (
                  <a 
                    href={links.googlePlay} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    Google Play
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;