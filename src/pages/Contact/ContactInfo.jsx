// src/components/Contact/ContactInfo.jsx
import React from 'react';
import { Mail, Github, MapPin, Briefcase } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-blue-500" />
          <a href="mailto:khanhk66uet@gmail.com" className="text-gray-600 hover:text-blue-500 transition-colors">
            khanhk66uet@gmail.com
          </a>
        </div>
        <div className="flex items-center space-x-3">
          <Github className="w-5 h-5 text-blue-500" />
          <a 
            href="https://github.com/kiu-chan" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 hover:text-blue-500 transition-colors"
          >
            github.com/kiu-chan
          </a>
        </div>
        <div className="flex items-center space-x-3">
          <Briefcase className="w-5 h-5 text-blue-500" />
          <span className="text-gray-600">
            GIS Research Center - Thai Nguyen University
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-blue-500" />
          <span className="text-gray-600">Hanoi, Vietnam</span>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;