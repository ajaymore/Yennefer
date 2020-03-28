import { useState, useEffect, useCallback } from 'react';

export function useWindowSize() {
  const getSize = useCallback(() => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      contentHeight:
        window.innerWidth > 599
          ? window.innerHeight - 65
          : window.innerHeight - 57,
      contentWidth:
        window.innerWidth > 599 ? window.innerWidth - 240 : window.innerWidth
    };
  }, []);

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getSize]); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}
