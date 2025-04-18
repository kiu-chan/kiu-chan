// components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const { id, name, content, imageUrl, type, year, technologies } = project;

  // Tạo badge hiển thị loại dự án
  const renderTypeBadge = () => {
    const typeMap = {
      'mobile_app': 'Mobile App',
      'web_app': 'Web App',
      'desktop_app': 'Desktop App'
    };
    
    return (
      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
        {typeMap[type] || type}
      </span>
    );
  };

  // Chuyển đổi mảng công nghệ thành badges
  const renderTechBadges = () => {
    if (!technologies || !Array.isArray(technologies) || technologies.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {technologies.map((tech, index) => (
          <span key={index} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {tech}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Link to={`/projects/${id}`} className="block transition-transform duration-300 hover:-translate-y-1">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
        {imageUrl && (
          <div className="relative h-48">
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-2 right-2">
              {renderTypeBadge()}
            </div>
          </div>
        )}
        
        <div className="p-6 flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
            {year && <span className="text-gray-600 text-sm">{year}</span>}
          </div>
          
          <p className="mt-2 text-gray-600 line-clamp-3">{content}</p>
          
          {renderTechBadges()}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
          <span className="text-blue-600 font-medium text-sm">View details</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;