import React, { useState } from 'react';
import ProjectCard from '../../components/Projects/ProjectCard';
import allProjects from '../../data/projects';

const Projects = () => {
 const [filter, setFilter] = useState('all');

 const projectTypes = ['all', 'Mobile App', 'Web App', 'Desktop App'];
 
 const filteredProjects = filter === 'all' 
   ? allProjects 
   : allProjects.filter(project => project.type === filter);

 return (
   <div className="max-w-6xl mx-auto p-6 space-y-8">
     <section className="text-center mb-8">
       <h1 className="text-3xl font-bold text-gray-800 mb-4">My Projects</h1>
       <p className="text-gray-600">Explore the projects I've worked on</p>
     </section>

     <div className="flex justify-center mb-8">
       <div className="flex flex-wrap gap-2">
         {projectTypes.map((type) => (
           <button
             key={type}
             onClick={() => setFilter(type)}
             className={`px-4 py-2 rounded-full transition-colors ${
               filter === type
                 ? 'bg-blue-500 text-white'
                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
             }`}
           >
             {type === 'all' ? 'All' : type}
           </button>
         ))}
       </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {filteredProjects.map((project) => (
         <ProjectCard key={project.id} project={project} />
       ))}
     </div>
   </div>
 );
};

export default Projects;