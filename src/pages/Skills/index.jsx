import React from 'react';

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming Languages",
      skills: [
        { name: "C/C++", level: "Advanced" },
        { name: "Python", level: "Advanced" },
        { name: "Java", level: "Advanced" },
        { name: "JavaScript", level: "Advanced" },
        { name: "Dart", level: "Advanced" },
        { name: "HTML/CSS", level: "Advanced" },
      ]
    },
    {
      title: "Frameworks & Libraries",
      skills: [
        { name: "Flutter", level: "Expert" },
        { name: "React", level: "Advanced" },
        { name: "Node.js", level: "Advanced" },
        { name: "Laravel", level: "Intermediate" },
      ]
    },
    {
      title: "Tools & Platforms",
      skills: [
        { name: "Git & GitHub", level: "Advanced" },
        { name: "AWS", level: "Intermediate" },
        { name: "Firebase", level: "Advanced" },
        { name: "Figma", level: "Intermediate" },
        { name: "Android Studio", level: "Advanced" },
        { name: "VSCode", level: "Advanced" },
      ]
    },
    {
      title: "Databases",
      skills: [
        { name: "MongoDB", level: "Advanced" },
        { name: "MySQL", level: "Advanced" },
        { name: "PostgreSQL", level: "Intermediate" },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <section className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Technical Skills</h1>
        <p className="text-gray-600">A comprehensive overview of my technical expertise and proficiency levels</p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {skillCategories.map((category, index) => (
          <section key={index} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{category.title}</h2>
            <div className="space-y-4">
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="text-gray-500 text-sm">{skill.level}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded">
                    <div 
                      className="h-full bg-blue-300 rounded"
                      style={{
                        width: skill.level === 'Expert' ? '95%' : 
                               skill.level === 'Advanced' ? '80%' : '60%'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Skills</h2>
        <div className="grid md:grid-cols-2 gap-4 text-gray-600">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Development Practices</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Agile Methodology</li>
              <li>CI/CD</li>
              <li>Test-Driven Development</li>
              <li>Clean Code Practices</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Soft Skills</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Technical Leadership</li>
              <li>Project Management</li>
              <li>Team Collaboration</li>
              <li>Problem Solving</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Skills;