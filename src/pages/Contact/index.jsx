import React from 'react';
import { Mail, Github, MapPin, Briefcase } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <section className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h1>
        <p className="text-gray-600">I'm always open to discussing new projects and opportunities</p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-500" />
              <a href="mailto:khanhk66uet@gmail.com" className="text-gray-600 hover:text-blue-500">
                khanhk66uet@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Github className="w-5 h-5 text-blue-500" />
              <a href="https://github.com/kiu-chan" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
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
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Send Me a Message</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Looking to Collaborate?</h2>
        <div className="text-gray-600 space-y-4">
          <p>
            I'm always interested in hearing about new projects and opportunities. 
            Whether you have a question or just want to say hi, I'll try my best 
            to get back to you!
          </p>
          <div className="flex items-center justify-center space-x-4">
            <img 
              src="https://visitor-count-b8lb.vercel.app/api/kiu-chan?hexColor=5ed4f3" 
              alt="visitors"
              className="h-8"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;