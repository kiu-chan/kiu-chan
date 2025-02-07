import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <section className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Professional Overview</h2>
        <div className="space-y-4 text-gray-600">
          <p>As a passionate software engineer at the GIS research center, I specialize in developing cross-platform mobile applications that bring innovative solutions to complex problems.</p>
          <p>My academic journey at VNU University of Engineering and Technology has equipped me with a strong foundation in Information Technology, which I continuously build upon through practical experience and self-directed learning.</p>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Values</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-gray-800">💡 Learning & Curiosity</h3>
            <p className="text-gray-600">Committed to continuous learning and exploring new technologies with an inquisitive mindset.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-gray-800">🙌 Team Collaboration</h3>
            <p className="text-gray-600">Strong believer in effective communication and collaborative problem-solving.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-gray-800">🙋‍♂️ Autonomy</h3>
            <p className="text-gray-600">Self-motivated with the ability to work independently and take initiative.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-gray-800">🎯 Goal-Oriented</h3>
            <p className="text-gray-600">Focused on delivering high-quality results and achieving project objectives.</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Education & Experience</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium text-gray-800">Education</h3>
            <p className="text-gray-600">Bachelor's degree in Information Technology</p>
            <p className="text-gray-500">VNU University of Engineering and Technology</p>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-800">Current Position</h3>
            <p className="text-gray-600">Software Engineer - Mobile Application Developer</p>
            <p className="text-gray-500">GIS Research Center - Thai Nguyen University</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;