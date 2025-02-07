import { Mail, Briefcase, MapPin, School } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-300 text-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span>khanhk66uet@gmail.com</span>
              </li>
              <li className="flex items-center">
                <School className="w-5 h-5 mr-2" />
                <span>VNU University of Engineering and Technology</span>
              </li>
              <li className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                <span>GIS Research Center - Thai Nguyen University</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">My Values</h3>
            <ul className="space-y-2">
              <li>💡 Learning Mindset & Curiosity</li>
              <li>🙌 Teamwork & Communication & Leadership</li>
              <li>🙋‍♂️ Autonomous</li>
              <li>🕺 More to discover...</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Me</h3>
            <p>Find me on GitHub: @kiu-chan</p>
            <div className="mt-4">
              <img 
                src="https://visitor-count-b8lb.vercel.app/api/kiu-chan?hexColor=5ed4f3" 
                alt="visitors" 
                className="h-8"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-blue-400 text-center">
          <p>&copy; 2025 Khanh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;