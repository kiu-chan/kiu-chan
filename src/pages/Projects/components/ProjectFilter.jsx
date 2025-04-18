// components/ProjectFilter.jsx
import React from 'react';

const ProjectFilter = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'mobile_app', label: 'Mobile App' },
    { id: 'web_app', label: 'Web App' },
    { id: 'desktop_app', label: 'Desktop App' }
  ];

  return (
    <div className="flex flex-wrap justify-center space-x-2 space-y-2 sm:space-y-0">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default ProjectFilter;