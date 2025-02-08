// src/components/Projects/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Globe } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <Link 
      to={`/projects/${project.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        <div className="w-full h-64 md:h-72 overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/placeholder-project.jpg';
            }}
          />
        </div>
        
        {/* Badge loại project */}
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md text-sm">
          {project.type}
        </div>
      </div>
      
      <div className="p-6">
        {/* Tiêu đề */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1 hover:text-blue-500 transition-colors">
          {project.title}
        </h3>

        {/* Mô tả */}
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm md:text-base">
          {project.description}
        </p>
        
        <div className="space-y-3">
          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs md:text-sm"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-gray-500 text-xs md:text-sm flex items-center">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
          
          {/* Footer với links và năm */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex space-x-4">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.open(project.githubUrl, '_blank');
                  }}
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {project.liveUrl && (
                <a 
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.open(project.liveUrl, '_blank');
                  }}
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
            
            {/* Năm */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {project.year}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;