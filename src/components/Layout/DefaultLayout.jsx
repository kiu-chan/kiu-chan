import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

function DefaultLayout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Xử lý hiệu ứng cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header scrolled={scrolled} currentPath={location.pathname} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default DefaultLayout;