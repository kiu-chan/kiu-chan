import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const DEFAULT_DATA = {
  professionalOverview1: "As a passionate software engineer at the GIS research center, I specialize in developing cross-platform mobile applications that bring innovative solutions to complex problems.",
  professionalOverview2: "My academic journey at VNU University of Engineering and Technology has equipped me with a strong foundation in Information Technology, which I continuously build upon through practical experience and self-directed learning.",
  values: [
    { emoji: "💡", title: "Learning & Curiosity", description: "Committed to continuous learning and exploring new technologies with an inquisitive mindset." },
    { emoji: "🙌", title: "Team Collaboration", description: "Strong believer in effective communication and collaborative problem-solving." },
    { emoji: "🙋‍♂️", title: "Autonomy", description: "Self-motivated with the ability to work independently and take initiative." },
    { emoji: "🎯", title: "Goal-Oriented", description: "Focused on delivering high-quality results and achieving project objectives." }
  ],
  educationDegree: "Bachelor's degree in Information Technology",
  educationUniversity: "VNU University of Engineering and Technology",
  positionTitle: "Software Engineer - Mobile Application Developer",
  positionOrganization: "GIS Research Center - Thai Nguyen University"
};

function About() {
  const [content, setContent] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'pageContent', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent({ ...DEFAULT_DATA, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                <p>{content.professionalOverview1}</p>
                <p>{content.professionalOverview2}</p>
              </div>
            </div>
            
            {/* My Values Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">My Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.values.map((val, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <span className="mr-2">{val.emoji}</span>
                      {val.title}
                    </h3>
                    <p className="text-gray-700">{val.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Education & Experience */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Education & Experience</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Education</h3>
                <p className="text-gray-700">{content.educationDegree}</p>
                <p className="text-gray-700">{content.educationUniversity}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Current Position</h3>
                <p className="text-gray-700">{content.positionTitle}</p>
                <p className="text-gray-700">{content.positionOrganization}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default About;
