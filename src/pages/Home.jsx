// src/pages/Home/index.jsx
import { useState, useEffect } from 'react';

function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Thêm hiệu ứng hiển thị sau khi component mount
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-6">
              Chào mừng đến với Website của chúng tôi
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
              Chúng tôi cung cấp các giải pháp sáng tạo và hiệu quả cho doanh nghiệp của bạn.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>

      {/* Giới thiệu ngắn */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
              Về chúng tôi
            </h2>
            <div className="w-24 h-1 mx-auto bg-blue-500 mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Sáng tạo</h3>
              <p className="text-gray-600">
                Chúng tôi luôn tìm kiếm các giải pháp sáng tạo và độc đáo cho từng dự án.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hiệu quả</h3>
              <p className="text-gray-600">
                Giải pháp của chúng tôi mang lại hiệu quả cao và tối ưu chi phí cho khách hàng.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hỗ trợ</h3>
              <p className="text-gray-600">
                Đội ngũ hỗ trợ chuyên nghiệp, luôn sẵn sàng giải đáp mọi thắc mắc của khách hàng.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Bạn đã sẵn sàng bắt đầu?
              </h3>
              <p className="text-blue-100 text-lg">
                Hãy liên hệ với chúng tôi ngay hôm nay để nhận được tư vấn miễn phí!
              </p>
            </div>
            <button className="bg-white hover:bg-blue-50 text-blue-600 font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Liên hệ ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;