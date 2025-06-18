import React from 'react';

const ProjectFilter = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'mobile_app', label: 'Mobile Apps' },
    { id: 'web_app', label: 'Web Apps' },
    { id: 'desktop_app', label: 'Desktop Apps' },
    { id: 'api', label: 'API/Backend' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeFilter === filter.id
              ? 'bg-blue-600 text-white shadow-lg transform scale-105'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default ProjectFilter;