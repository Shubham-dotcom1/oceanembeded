import React, { useEffect } from 'react';

export default function ScrollDiveController({ 
  depth, 
  setDepth, 
  activeMode, 
  reducedMotion 
}) {
  useEffect(() => {
    if (activeMode !== 'dive') return;

    // Sync 3D depth with window scrollY position
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate depth based on window scroll progress (0m at top, 1000m at 1 window height scroll)
      const calculatedDepth = Math.min(Math.max((scrollY / (windowHeight * 0.8)) * 1000, 0), 1000);
      setDepth(calculatedDepth);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeMode, setDepth]);

  return null;
}
