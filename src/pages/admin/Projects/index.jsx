import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import AdminProjectList from './components/AdminProjectList';
import AdminProjectModal from './components/AdminProjectModal';
import { toast } from 'react-toastify';
import { useApi } from '../../../contexts/ApiContext';

const AdminProjects = () => {
  const { deleteImage } = useApi();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleDeleteProject = async (projectId) => {
    try {
      // Tìm project để lấy thông tin ảnh
      const project = projects.find(p => p.id === projectId);
      
      // Xóa ảnh từ server nếu có
      if (project?.imageFilename) {
        try {
          await deleteImage(project.imageFilename);
        } catch (imageError) {
          console.error('Error deleting image:', imageError);
          // Không dừng việc xóa project nếu lỗi xóa ảnh
        }
      }
      
      // Xóa project từ Firestore
      await deleteDoc(doc(db, "projects", projectId));
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      toast.error('Error deleting project');
      console.error("Error deleting project:", error);
    }
  };

  const handleOpenModal = (project = null) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

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