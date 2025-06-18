import React from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../../contexts/ApiContext';

const ProjectCard = ({ project }) => {
  const { getImageURL } = useApi();
  const { id, name, content, imageUrl, imageFilename, type, year, technologies } = project;

  const renderTypeBadge = () => {
    const typeMap = {
      'mobile_app': 'Mobile App',
      'web_app': 'Web App',
      'desktop_app': 'Desktop App',
      'api': 'API/Backend'
    };
    
    return (
      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
        {typeMap[type] || type}
      </span>
    );
  };

  const renderTechBadges = () => {
    if (!technologies || !Array.isArray(technologies) || technologies.length === 0) return null;
    
    const displayTechs = technologies.slice(0, 3);
    const remainingCount = technologies.length - 3;
    
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {displayTechs.map((tech, index) => (
          <span key={index} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {tech}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="bg-gray-300 text-gray-600 text-xs px-2 py-1 rounded-full">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  };

  const getImageSource = () => {
    // Ưu tiên imageUrl từ server API
    if (imageUrl) {
      return getImageURL(imageUrl);
    }
    // Fallback về ảnh local nếu không có
    return `/project/${id}/1.png`;
  };

  return (
    <Link to={`/projects/${id}`} className="block transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
        <div className="relative h-48">
          <img 
            src={getImageSource()} 
            alt={name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              // Thử fallback ảnh local
              if (e.target.src !== `/project/${id}/1.png`) {
                e.target.src = `/project/${id}/1.png`;
              } else {
                // Nếu cả ảnh local cũng không có, dùng placeholder
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='16' fill='%236b7280' text-anchor='middle' alignment-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";
              }
            }}
          />
          <div className="absolute top-2 right-2">
            {renderTypeBadge()}
          </div>
          {year && (
            <div className="absolute top-2 left-2">
              <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                {year}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6 flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
          
          <p className="text-gray-600 line-clamp-3 mb-3">
            {content || "No description available"}
          </p>
          
          {renderTechBadges()}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
          <span className="text-blue-600 font-medium text-sm">View details</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;