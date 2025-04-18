function Skills() {
    // Programming Languages
    const programmingLanguages = [
      { name: 'C/C++', level: 80, proficiency: 'Advanced' },
      { name: 'Python', level: 80, proficiency: 'Advanced' },
      { name: 'Java', level: 80, proficiency: 'Advanced' },
      { name: 'JavaScript', level: 80, proficiency: 'Advanced' },
      { name: 'Dart', level: 80, proficiency: 'Advanced' },
      { name: 'HTML/CSS', level: 80, proficiency: 'Advanced' }
    ];
  
    // Frameworks & Libraries
    const frameworks = [
      { name: 'Flutter', level: 90, proficiency: 'Expert' },
      { name: 'React', level: 80, proficiency: 'Advanced' },
      { name: 'Node.js', level: 80, proficiency: 'Advanced' },
      { name: 'Laravel', level: 60, proficiency: 'Intermediate' }
    ];
  
    // Tools & Platforms
    const tools = [
      { name: 'Git & GitHub', level: 80, proficiency: 'Advanced' },
      { name: 'AWS', level: 60, proficiency: 'Intermediate' },
      { name: 'Firebase', level: 80, proficiency: 'Advanced' },
      { name: 'Figma', level: 60, proficiency: 'Intermediate' },
      { name: 'Android Studio', level: 80, proficiency: 'Advanced' },
      { name: 'VSCode', level: 80, proficiency: 'Advanced' }
    ];
  
    // Databases
    const databases = [
      { name: 'MongoDB', level: 80, proficiency: 'Advanced' },
      { name: 'MySQL', level: 80, proficiency: 'Advanced' },
      { name: 'PostgreSQL', level: 60, proficiency: 'Intermediate' }
    ];
  
    // Development Practices
    const devPractices = [
      'Agile Methodology',
      'CI/CD',
      'Test-Driven Development',
      'Clean Code Practices'
    ];
  
    // Soft Skills
    const softSkills = [
      'Technical Leadership',
      'Project Management',
      'Team Collaboration',
      'Problem Solving'
    ];
  
    // Render skill progress bar
    const renderSkillBar = (skill) => {
      return (
        <div key={skill.name} className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-gray-700">{skill.name}</span>
            <span className="text-gray-500">{skill.proficiency}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full" 
              style={{ width: `${skill.level}%` }}
            ></div>
          </div>
        </div>
      );
    };
  
    return (
      <div className="pt-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">Skills</h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Technical Skills</h1>
              <p className="text-gray-600">
                A comprehensive overview of my technical expertise and proficiency levels
              </p>
            </div>
            
            {/* Main Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Programming Languages */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Programming Languages</h2>
                <div>
                  {programmingLanguages.map(skill => renderSkillBar(skill))}
                </div>
              </div>
              
              {/* Frameworks & Libraries */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Frameworks & Libraries</h2>
                <div>
                  {frameworks.map(skill => renderSkillBar(skill))}
                </div>
              </div>
              
              {/* Tools & Platforms */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Tools & Platforms</h2>
                <div>
                  {tools.map(skill => renderSkillBar(skill))}
                </div>
              </div>
              
              {/* Databases */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Databases</h2>
                <div>
                  {databases.map(skill => renderSkillBar(skill))}
                </div>
              </div>
            </div>
            
            {/* Additional Skills */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Skills</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Development Practices */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Development Practices</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {devPractices.map((practice, index) => (
                      <li key={index}>{practice}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Soft Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Soft Skills</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {softSkills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Skills;