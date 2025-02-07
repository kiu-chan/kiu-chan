import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RequestForm from '../../components/Projects/RequestForm';

const ProjectRequest = () => {
  const { id } = useParams();

  // Mock data - should match with your projects data
  const projects = [
    {
      id: "gis-mobile",
      title: "GIS Mobile Application",
    },
    {
      id: "portfolio",
      title: "Portfolio Website",
    }
  ];

  const project = projects.find(p => p.id === id);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back button */}
      <Link 
        to={`/projects/${id}`} 
        className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Project Details
      </Link>

      <RequestForm projectTitle={project.title} />
    </div>
  );
};

export default ProjectRequest;