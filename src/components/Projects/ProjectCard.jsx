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
        <img 
          src={project.image || "/api/placeholder/400/200"} 
          alt={project.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg">
          {project.type}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-4">{project.description}</p>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex space-x-4">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                  onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
            <span className="text-sm text-gray-500">{project.year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;