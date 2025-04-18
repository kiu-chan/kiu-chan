// pages/Projects/index.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import ProjectCard from './components/ProjectCard';
import ProjectFilter from './components/ProjectFilter';
import ProjectHeader from './components/ProjectHeader';
import LoadingIndicator from './components/LoadingIndicator';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectCollection = collection(db, "projects");
        const projectSnapshot = await getDocs(projectCollection);
        const projectList = projectSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectList);
        setFilteredProjects(projectList);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.type === filter));
    }
  };

  return (
    <div className="pt-16">
      <ProjectHeader />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProjectFilter 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
        />

        {loading ? (
          <LoadingIndicator />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;