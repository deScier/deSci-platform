'use client';

import { useEffect, useState } from 'react';

/**
 * @title useDimension Hook
 * @notice Provides responsive design breakpoints based on window width.
 * @dev This hook is designed to facilitate responsive design in React components by providing boolean flags for different screen widths.
 */
const useDimension = () => {
  /** @dev State to store the current window dimension */
  const [windowDimension, setWindowDimension] = useState<number | null>(null);

  useEffect(() => {
    /** @dev Check if window object is available to avoid errors during server-side rendering */
    if (typeof window !== 'undefined') {
      /** @dev Set initial window dimension */
      setWindowDimension(window.innerWidth);

      /**
       * @dev Handle window resize events
       * @notice Dynamically updates the window dimension on resize
       */
      const handleResize = () => {
        setWindowDimension(window.innerWidth);
      };

      /** @dev Add resize event listener to window */
      window.addEventListener('resize', handleResize);

      /** @dev Clean up the event listener on component unmount */
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  /** @dev Calculate responsive design breakpoints */
  const sm = windowDimension ? windowDimension < 640 : false;
  const md = windowDimension ? windowDimension < 768 : false;
  const lg = windowDimension ? windowDimension >= 1024 : false;
  const xl = windowDimension ? windowDimension >= 1280 : false;
  const xxl = windowDimension ? windowDimension >= 1536 : false;

  /** @return Breakpoints and current window dimension */
  return { sm, md, lg, xl, xxl, windowDimension };
};

export default useDimension;
