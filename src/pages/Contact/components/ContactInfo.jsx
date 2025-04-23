import React from 'react';
import { FaGithub, FaWhatsapp, FaFacebook } from 'react-icons/fa';

function ContactInfo() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
      
      <div className="space-y-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Email</h3>
            <p className="mt-1 text-gray-600">
              <a href="mailto:khanhk66uet@gmail.com" className="text-blue-600 hover:underline">khanhk66uet@gmail.com</a>
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Location</h3>
            <p className="mt-1 text-gray-600">VNU University of Engineering and Technology, Hanoi, Vietnam</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Current Position</h3>
            <p className="mt-1 text-gray-600">GIS Research Center - Thai Nguyen University</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Connect With Me</h3>
        <div className="flex space-x-4">
          <a 
            href="https://github.com/kiu-chan" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition duration-300"
            aria-label="GitHub"
          >
            <FaGithub className="w-5 h-5 text-gray-700" />
          </a>
          <a 
            href="https://www.facebook.com/hoang.bao.khanh.498513" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition duration-300"
            aria-label="Facebook"
          >
            <FaFacebook className="w-5 h-5 text-gray-700" />
          </a>
          <a 
            href="https://wa.me/84974022602" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition duration-300"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="w-5 h-5 text-gray-700" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;