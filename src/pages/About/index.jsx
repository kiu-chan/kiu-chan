function About() {
    return (
      <div className="pt-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">About Me</h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Professional Overview Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Professional Overview</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  As a passionate software engineer at the GIS research center, I specialize in developing cross-platform 
                  mobile applications that bring innovative solutions to complex problems.
                </p>
                <p>
                  My academic journey at VNU University of Engineering and Technology has equipped me with a strong 
                  foundation in Information Technology, which I continuously build upon through practical experience and 
                  self-directed learning.
                </p>
              </div>
            </div>
            
            {/* My Values Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">My Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="mr-2">💡</span>
                    Learning & Curiosity
                  </h3>
                  <p className="text-gray-700">
                    Committed to continuous learning and exploring new technologies with an inquisitive mindset.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="mr-2">🙌</span>
                    Team Collaboration
                  </h3>
                  <p className="text-gray-700">
                    Strong believer in effective communication and collaborative problem-solving.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="mr-2">🙋‍♂️</span>
                    Autonomy
                  </h3>
                  <p className="text-gray-700">
                    Self-motivated with the ability to work independently and take initiative.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="mr-2">🎯</span>
                    Goal-Oriented
                  </h3>
                  <p className="text-gray-700">
                    Focused on delivering high-quality results and achieving project objectives.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Education & Experience */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Education & Experience</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Education</h3>
                <p className="text-gray-700">Bachelor's degree in Information Technology</p>
                <p className="text-gray-700">VNU University of Engineering and Technology</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Current Position</h3>
                <p className="text-gray-700">Software Engineer - Mobile Application Developer</p>
                <p className="text-gray-700">GIS Research Center - Thai Nguyen University</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default About;