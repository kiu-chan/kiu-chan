import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, Globe } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();

  // Mock data - in real app, you should fetch this from your data source
  const projects = [
    {
      id: "gis-mobile",
      title: "GIS Mobile Application",
      description: "A cross-platform mobile application that enables users to collect and analyze geographic data.",
      type: "Mobile App",
      image: "/api/placeholder/800/400",
      technologies: ["Flutter", "Firebase", "GIS", "Node.js"],
      githubUrl: "https://github.com/kiu-chan/gis-mobile",
      year: "2024",
      features: [
        "Real-time GPS tracking and data collection",
        "Offline map support with tile caching",
        "Custom map layer management",
        "Data synchronization with cloud storage",
        "Advanced spatial analysis tools"
      ],
      challenges: "One of the main challenges was implementing efficient offline map functionality while maintaining app performance. This was solved by implementing a sophisticated tile caching system and optimizing data storage for offline use."
    },
    {
      id: "portfolio",
      title: "Portfolio Website",
      description: "Personal portfolio website built with React and Tailwind CSS.",
      type: "Web App",
      image: "/api/placeholder/800/400",
      technologies: ["React", "Tailwind CSS", "JavaScript"],
      githubUrl: "https://github.com/kiu-chan/portfolio",
      liveUrl: "https://kiu-chan.vercel.app",
      year: "2024",
      features: [
        "Responsive design for all devices",
        "Dark/Light mode support",
        "Interactive project showcase",
        "Smooth page transitions",
        "Contact form with validation"
      ],
      challenges: "Creating a smooth and responsive user experience across all devices while maintaining fast load times. Implemented code splitting and lazy loading to optimize performance."
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
        to="/projects" 
        className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Projects
      </Link>

      {/* Project header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-[400px] object-cover"
        />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {project.type}
              </span>
            </div>
            <span className="text-gray-500">{project.year}</span>
          </div>
          <p className="text-gray-600 text-lg mb-6">{project.description}</p>
        </div>
      </div>

      {/* Project details */}
      <div className="space-y-6">
        {/* Features */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {project.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </section>

        {/* Challenges */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Challenges & Solutions</h2>
          <p className="text-gray-600">{project.challenges}</p>
        </section>

        {/* Technologies */}
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

        {/* Links and Support */}
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