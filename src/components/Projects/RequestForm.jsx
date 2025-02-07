import React, { useState } from 'react';
import { sendConfirmationEmail } from '../../api/emailApi';

const RequestForm = ({ projectTitle }) => {
  const [formData, setFormData] = useState({
    requestType: 'question',
    subject: '',
    email: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const requestTypes = [
    { value: 'question', label: 'Question' },
    { value: 'account_deletion', label: 'Account Deletion Request' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await sendConfirmationEmail({
        ...formData,
        projectTitle
      });
      
      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({
          requestType: 'question',
          subject: '',
          email: '',
          description: ''
        });
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      setError('Failed to send email. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      {isSubmitted ? (
        <div className="text-center p-6 space-y-4">
          <div className="text-green-500 text-xl font-semibold">
            Request Submitted Successfully!
          </div>
          <p className="text-gray-600">
            A confirmation email has been sent to {formData.email}.<br/>
            We will respond to your request within 30 days.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            This message will disappear in a few seconds...
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Submit a Request for {projectTitle}
            </h2>
            <p className="text-gray-600 mt-2">
              Please fill out the form below
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Request Type
              </label>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              >
                {requestTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className={`bg-blue-500 text-white px-6 py-2 rounded-md transition-colors ${
                  isSubmitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-blue-600'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default RequestForm;