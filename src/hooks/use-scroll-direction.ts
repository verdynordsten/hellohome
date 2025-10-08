import { useState, useEffect } from 'react';

interface ScrollDirectionState {
  isScrollingDown: boolean;
  isScrollingUp: boolean;
  scrollY: number;
}

export const useScrollDirection = (): ScrollDirectionState => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirectionState>({
    isScrollingDown: false,
    isScrollingUp: false,
    scrollY: 0,
  });

  useEffect(() => {
    setScrollDirection({
      isScrollingDown: false,
      isScrollingUp: false,
      scrollY: window.scrollY,
    });

    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      const threshold = 5;
      
      if (Math.abs(scrollY - lastScrollY) < threshold) return;
      
      if (direction !== "down" && scrollY === 0) {
        setScrollDirection({
          isScrollingDown: false,
          isScrollingUp: false,
          scrollY,
        });
      } else if (direction === "down") {
        setScrollDirection({
          isScrollingDown: true,
          isScrollingUp: false,
          scrollY,
        });
      } else {
        setScrollDirection({
          isScrollingDown: false,
          isScrollingUp: true,
          scrollY,
        });
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    
    updateScrollDirection();

    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);

  return scrollDirection;
};