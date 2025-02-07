import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RequestForm from '../../components/Projects/RequestForm';
import allProjects from '../../data/projects';

const ProjectRequest = () => {
 const { id } = useParams();
 const navigate = useNavigate();

 const project = allProjects.find(p => p.id === id);

 if (!project) {
   return (
     <div className="min-h-screen flex items-center justify-center">
       <div className="text-center space-y-4">
         <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
         <p className="text-gray-600">The project you're looking for doesn't exist.</p>
         <button 
           onClick={() => navigate('/projects')}
           className="text-blue-500 hover:text-blue-600 underline"
         >
           Return to Projects
         </button>
       </div>
     </div>
   );
 }

 return (
   <div className="min-h-screen bg-gray-50">
     <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
       <Link 
         to={`/projects/${id}`} 
         className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors"
       >
         <ArrowLeft className="w-4 h-4 mr-2" />
         Back to Project Details
       </Link>

       <div className="text-center mb-8">
         <h1 className="text-3xl font-bold text-gray-800">
           Submit Request for {project.title}
         </h1>
       </div>

       <div className="bg-white rounded-lg shadow-md">
         <RequestForm projectTitle={project.title} />
       </div>
     </div>
   </div>
 );
};

export default ProjectRequest;