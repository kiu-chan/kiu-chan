import React from 'react';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Software Engineer at GIS Research Center</h1>
        <p className="text-xl text-gray-600">Cross-platform Mobile Application Developer</p>
      </section>

      <section className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">About Me</h2>
        <div className="space-y-4 text-gray-600">
          <p>🎓 Bachelor's degree in Information Technology from VNU University of Engineering and Technology - Vietnam National University, Hanoi</p>
          <p>Currently working as a cross-platform mobile application developer at the GIS Research Center - Thai Nguyen University of Agriculture and Forestry</p>
          <p>👯 Looking to collaborate on new projects</p>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Technical Skills</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Languages & Technologies</h3>
            <img 
              src="https://skillicons.dev/icons?i=c,cpp,css,dart,html,java,js,py" 
              alt="Programming Languages"
              className="w-full"
            />
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Frameworks & Tools</h3>
            <img 
              src="https://skillicons.dev/icons?i=anaconda,androidstudio,flutter,react,laravel,nodejs" 
              alt="Frameworks and Tools"
              className="w-full"
            />
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Development Tools</h3>
            <img 
              src="https://skillicons.dev/icons?i=aws,figma,firebase,git,github,gradle,idea,maven,postman,vscode" 
              alt="Development Tools"
              className="w-full"
            />
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Databases</h3>
            <img 
              src="https://skillicons.dev/icons?i=mongodb,mysql,postgres" 
              alt="Databases"
              className="w-full"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">GitHub Activity</h2>
        <img 
          src="https://github-readme-activity-graph.vercel.app/graph?username=kiu-chan&theme=react" 
          alt="GitHub Activity Graph"
          className="w-full rounded-lg"
        />
        <div className="mt-8">
          <img 
            src="https://github-readme-streak-stats-mbm.vercel.app/?user=kiu-chan&hide_border=true&date_format=j%20M%5B%20Y%5D&stroke=44C394&sideLabels=888888&background=FFFFFF00&ring=44C394&fire=44C394&currStreakNum=888888&sideNums=888888&currStreakLabel=44C394&dates=888888" 
            alt="GitHub Stats"
            className="w-full"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;