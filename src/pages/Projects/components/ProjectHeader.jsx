// components/ProjectHeader.jsx
import React from 'react';

const ProjectHeader = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <p className="mt-2 text-lg">Explore the projects I've worked on</p>
      </div>
    </div>
  );
};

export default ProjectHeader;