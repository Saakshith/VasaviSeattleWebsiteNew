import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Simple fade in
    setIsVisible(true);
    
    // Cleanup function
    return () => {
      setIsVisible(false);
    };
  }, [location.pathname]);

  return (
    <div className={`page-transition ${isVisible ? 'page-enter' : 'page-exit'}`}>
      {children}
    </div>
  );
};

export default PageTransition;
