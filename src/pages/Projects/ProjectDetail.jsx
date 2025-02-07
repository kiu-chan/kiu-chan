import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, Globe } from 'lucide-react';
import allProjects from '../../data/projects';

const ProjectDetail = () => {
 const { id } = useParams();
 const project = allProjects.find(p => p.id === id);

 if (!project) {
   return (
     <div className="min-h-screen flex items-center justify-center">
       <div className="text-center">
         <h2 className="text-2xl font-bold text-gray-800 mb-4">Project not found</h2>
         <Link 
           to="/projects" 
           className="text-blue-500 hover:text-blue-600"
         >
           Go back to Projects
         </Link>
       </div>
     </div>
   );
 }

 return (
   <div className="max-w-4xl mx-auto p-6">
     <Link 
       to="/projects" 
       className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6"
     >
       <ArrowLeft className="w-4 h-4 mr-2" />
       Back to Projects
     </Link>

     <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
       <img
         src={project.image}
         alt={project.title}
         className="w-full h-[400px] object-cover"
       />
       <div className="p-6">
         <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
           <div>
             <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
             <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
               {project.type}
             </span>
           </div>
           <span className="text-gray-500 mt-2 sm:mt-0">{project.year}</span>
         </div>
         <p className="text-gray-600 text-lg mb-6">{project.description}</p>
       </div>
     </div>

     <div className="space-y-6">
       <section className="bg-white rounded-lg shadow-md p-6">
         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Features</h2>
         <ul className="space-y-2 text-gray-600">
           {project.features.map((feature, index) => (
             <li key={index} className="flex items-start">
               <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
               <span>{feature}</span>
             </li>
           ))}
         </ul>
       </section>

       <section className="bg-white rounded-lg shadow-md p-6">
         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Challenges & Solutions</h2>
         <p className="text-gray-600 leading-relaxed">{project.challenges}</p>
       </section>

       <section className="bg-white rounded-lg shadow-md p-6">
         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technologies Used</h2>
         <div className="flex flex-wrap gap-2">
           {project.technologies.map((tech, index) => (
             <span
               key={index}
               className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
             >
               {tech}
             </span>
           ))}
         </div>
       </section>

       <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Project Links</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex space-x-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                >
                  <Github className="w-5 h-5" />
                  <span>View on GitHub</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                >
                  <Globe className="w-5 h-5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
            <Link
              to={`/projects/${id}/request`}
              className="ml-auto inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Submit Request
            </Link>
          </div>
        </section>
     </div>
   </div>
 );
};

export default ProjectDetail;