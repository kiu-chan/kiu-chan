import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      {/* Phần main của footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-300 pb-2 inline-block">
              Contact Information
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <a href="mailto:khanhk66uet@gmail.com" className="hover:text-blue-100 transition-colors duration-300">
                  khanhk66uet@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span>VNU University of Engineering and Technology</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>GIS Research Center - Thai Nguyen University</span>
              </li>
            </ul>
          </div>

          {/* My Values */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-300 pb-2 inline-block">
              My Values
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-3">💡</span>
                <span>Learning Mindset & Curiosity</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3">🙌</span>
                <span>Teamwork & Communication & Leadership</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3">🙋‍♂️</span>
                <span>Autonomous</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3">🕺</span>
                <span>More to discover...</span>
              </li>
            </ul>
          </div>

          {/* Connect With Me */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-300 pb-2 inline-block">
              Connect With Me
            </h3>
            <p className="mb-4">Find me on GitHub: <a href="https://github.com/kiu-chan" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:underline">@kiu-chan</a></p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/kiu-chan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-100 transition-colors duration-300"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/hoang.bao.khanh.498513" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-100 transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.736-.9 10.126-5.864 10.126-11.854z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/84974022602" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-100 transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-6 h-6"/>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-blue-600 py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm">© {currentYear} Khanh. All rights reserved.</p>
          <p className="text-sm mt-2 sm:mt-0">
            <span>Designed with </span>
            <span className="text-red-300">❤</span>
            <span> by Khanh</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;