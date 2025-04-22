import React, { useState } from 'react';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';

function Contact() {
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleSubmit = async (formData) => {
    // Kiểm tra nếu là yêu cầu reset form
    if (formData.reset) {
      return setSubmitStatus({ loading: false, success: false, error: null });
    }
    
    setSubmitStatus({ loading: true, success: false, error: null });
    
    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra khi gửi email');
      }
      
      setSubmitStatus({ loading: false, success: true, error: null });
    } catch (error) {
      console.error('Lỗi gửi form:', error);
      setSubmitStatus({ loading: false, success: false, error: error.message });
    }
  };

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Contact Me</h1>
          <p className="mt-2 text-blue-100">Let's connect and discuss your projects</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left side - Contact Information */}
          <div className="md:col-span-1">
            <ContactInfo />
          </div>
          
          {/* Right side - Contact Form */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <ContactForm 
              onSubmit={handleSubmit} 
              submitStatus={submitStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;