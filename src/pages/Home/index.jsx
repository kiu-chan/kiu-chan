import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const Home = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndUpdateVisitorCount = async () => {
      try {
        setLoading(true);
        // Tham chiếu đến document chứa số lượng visitor
        const visitorRef = doc(db, "Visitors", "count");
        const visitorDoc = await getDoc(visitorRef);

        if (visitorDoc.exists()) {
          // Document tồn tại, lấy giá trị hiện tại và tăng lên 1
          const currentCount = visitorDoc.data().count || 0;
          const newCount = currentCount + 1;
          
          // Cập nhật giá trị mới vào Firestore
          await updateDoc(visitorRef, { count: newCount });
          setVisitorCount(newCount);
        } else {
          // Document chưa tồn tại, tạo mới với giá trị ban đầu là 1
          await setDoc(visitorRef, { count: 1 });
          setVisitorCount(1);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng người truy cập:", error);
        // Trong trường hợp lỗi, hiển thị số 0
        setVisitorCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdateVisitorCount();
  }, []);

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto p-6">
          <section className="text-center mb-4">
            <h1 className="text-4xl font-bold mb-4">Software Engineer at GIS Research Center</h1>
            <p className="text-xl">Cross-platform Mobile Application Developer</p>
          </section>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-12">
        <section className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">About Me</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <img 
                src="https://raw.githubusercontent.com/iampavangandhi/iampavangandhi/master/gifs/Hi.gif" 
                width="30" 
                height="50" 
                alt="Hi" 
                className="inline mr-2"
              />
              <strong>Hey there, I'm Khanh</strong>
            </p>
            <p className="flex items-center">
              <span>Visitors: </span>
              <span className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-lg">
                {loading ? "Loading..." : visitorCount}
              </span>
            </p>
            <p>🎓 Bachelor's degree in Information Technology from <a href="https://uet.vnu.edu.vn/" className="text-blue-600 hover:underline">VNU University of Engineering and Technology - Vietnam National University, Hanoi</a></p>
            <p>Currently working as a cross-platform mobile application developer at the GIS Research Center - Thai Nguyen University of Agriculture and Forestry</p>
            <p>👯 Looking to collaborate on new projects</p>
            <p>📫 How to reach me <a href="mailto:khanhk66uet@gmail.com" className="text-blue-600 hover:underline">khanhk66uet@gmail.com</a></p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">💎 My Values</h2>
          <div className="space-y-2 text-gray-600">
            <p>💡 Mindset of Learning, Curiosity & Digging up</p>
            <p>🙌 Teamwork & Communication & Leadership</p>
            <p>🙋‍♂️ Autonomous</p>
            <p>🕺 & More to discover ...</p>
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
          
          <img 
            src="https://streak-stats.demolab.com/?user=kiu-chan&currStreakNum=2FD3EB&fire=pink&sideLabels=F00&date_format=[Y.]n.j" 
            alt="GitHub Stats"
            className="w-full"
          />
        </section>
      </div>
    </div>
  );
};

export default Home;