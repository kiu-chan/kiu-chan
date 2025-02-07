// src/components/Contact/CollaborationSection.jsx
import React from 'react';

const CollaborationSection = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Looking to Collaborate?</h2>
      <div className="text-gray-600 space-y-4">
        <p>
          I'm always interested in hearing about new projects and opportunities. 
          Whether you have a question or just want to say hi, I'll try my best 
          to get back to you as soon as possible!
        </p>
        <div className="flex items-center justify-center space-x-4">
          <img 
            src="https://visitor-count-b8lb.vercel.app/api/kiu-chan?hexColor=5ed4f3" 
            alt="visitor count"
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
};

export default CollaborationSection;