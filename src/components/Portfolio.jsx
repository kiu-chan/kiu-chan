import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            Hey there, I'm Khanh
            <span className="ml-2 animate-wave inline-block">👋</span>
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Visitors: <span className="text-blue-500 font-semibold">1,234</span>
          </p>
          <h2 className="text-xl text-gray-700">
            Software Engineer at GIS Research Center
          </h2>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">About Me</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">🎓</span>
              Bachelor's degree in Information Technology from VNU University of Engineering and Technology
            </li>
            <li className="flex items-start">
              <span className="mr-2">💼</span>
              Cross-platform mobile application developer at GIS Research Center
            </li>
            <li className="flex items-start">
              <span className="mr-2">👯</span>
              Looking to collaborate on new projects
            </li>
            <li className="flex items-start">
              <span className="mr-2">📫</span>
              <a href="mailto:khanhk66uet@gmail.com" className="text-blue-500 hover:text-blue-700">
                khanhk66uet@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Values Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">My Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="flex items-center text-gray-700">
                <span className="mr-2">💡</span>
                Mindset of Learning, Curiosity & Digging up
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="flex items-center text-gray-700">
                <span className="mr-2">🙌</span>
                Teamwork & Communication & Leadership
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="flex items-center text-gray-700">
                <span className="mr-2">🙋‍♂️</span>
                Autonomous
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="flex items-center text-gray-700">
                <span className="mr-2">🕺</span>
                & More to discover...
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Languages, Tools and DB</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {/* Replace with actual skill icons */}
            {['React', 'Flutter', 'JavaScript', 'Python', 'Git', 'AWS',
              'MongoDB', 'MySQL', 'Firebase', 'Node.js', 'Laravel', 'PostgreSQL'].map((skill) => (
              <div key={skill} className="bg-gray-50 p-3 rounded-lg text-center text-sm text-gray-700">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center space-x-6">
          <a href="mailto:khanhk66uet@gmail.com" className="text-gray-600 hover:text-gray-900">
            <Mail size={24} />
          </a>
          <a href="https://github.com/kiu-chan" className="text-gray-600 hover:text-gray-900">
            <Github size={24} />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <Linkedin size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;