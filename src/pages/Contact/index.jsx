// src/views/Contact/index.jsx
import React from 'react';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';
import CollaborationSection from './CollaborationSection';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      <section className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h1>
        <p className="text-gray-600">I'm always open to discussing new projects and opportunities</p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <ContactInfo />
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Send a Message</h2>
          <ContactForm />
        </div>
      </div>

      <CollaborationSection />
    </div>
  );
};

export default Contact;