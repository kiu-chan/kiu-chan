import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import AdminProjectList from './components/AdminProjectList';
import AdminProjectModal from './components/AdminProjectModal';
import { toast } from 'react-toastify';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch projects from Firestore
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
    } catch (error) {
      toast.error('Error fetching projects');
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a project
  const handleDeleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      toast.success('Project deleted successfully');
      fetchProjects(); // Refresh the list
    } catch (error) {
      toast.error('Error deleting project');
      console.error("Error deleting project:", error);
    }
  };

  // Open modal for adding/editing project
  const handleOpenModal = (project = null) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  // Reload projects after successful add/edit
  const handleProjectSuccess = () => {
    fetchProjects();
    handleCloseModal();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-0">Project Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Project
        </button>
      </div>

      <AdminProjectList 
        projects={projects}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDeleteProject}
      />

      {isModalOpen && (
        <AdminProjectModal 
          project={selectedProject}
          onClose={handleCloseModal}
          onSuccess={handleProjectSuccess}
        />
      )}
    </div>
  );
};

export default AdminProjects;