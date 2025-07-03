'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const RocketScrollContext = createContext();

export function RocketScrollProvider({ children }) {
  const [scrollStage, setScrollStage] = useState(0);

  useEffect(() => {
    let scrollTimeout = null;

    const handleWheel = (e) => {
      e.preventDefault(); // Stop page from scrolling

      if (scrollTimeout) return;

      setScrollStage((prev) => {
        const next = Math.max(0, Math.min(3, prev + Math.sign(e.deltaY)));
        return next;
      });

      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
      }, 400);
    };

    const handleButtonEvent = (e) => {
      setScrollStage(e.detail);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('rocketStageChange', handleButtonEvent);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('rocketStageChange', handleButtonEvent);
    };
  }, []);

  return (
    <RocketScrollContext.Provider value={{ scrollStage }}>
      {children}
    </RocketScrollContext.Provider>
  );
}

export function useRocketScroll() {
  return useContext(RocketScrollContext);
}
