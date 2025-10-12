import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

interface SmoothScrollWrapperProps {
  children: ReactNode;
  className?: string;
}

const SmoothScrollWrapper = ({ children, className = "" }: SmoothScrollWrapperProps) => {
  const { isScrollingDown } = useScrollDirection();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    setVisibleSections(new Set());
    setIsInitialized(true);
    
    const scrollPosition = window.scrollY;
    if (scrollPosition > 0) {
      setTimeout(() => {
        checkVisibleSections();
      }, 100);
    }
  }, []);

  const checkVisibleSections = () => {
    Object.values(sectionRefs.current).forEach(element => {
      if (element && observerRef.current) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        const id = element.id;
        
        if (isVisible && id) {
          setVisibleSections(prev => new Set(prev).add(id));
        }
      }
    });
  };

  useEffect(() => {
    if (!isInitialized) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          
          if (entry.isIntersecting && isScrollingDown) {
            setVisibleSections((prev) => new Set(prev).add(id));
          } else if (entry.isIntersecting && !isScrollingDown) {
            setVisibleSections((prev) => new Set(prev));
          }
        });
      },
      {
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px', 
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isScrollingDown, isInitialized]);

  const registerSection = (sectionId: string, element: HTMLElement | null) => {
    if (element) {
      sectionRefs.current[sectionId] = element;
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    }
  };

  const _unregisterSection = (sectionId: string) => {
    if (sectionRefs.current[sectionId] && observerRef.current) {
      observerRef.current.unobserve(sectionRefs.current[sectionId]!);
      delete sectionRefs.current[sectionId];
    }
  };

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      const sectionId = `section-${index}`;
      
      return (
        <div
          id={sectionId}
          ref={(el) => registerSection(sectionId, el)}
          className={`transition-all duration-1000 ease-out ${
            visibleSections.has(sectionId)
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          } ${className}`}
        >
          {child}
        </div>
      );
    }
    return child;
  });

  return <>{enhancedChildren}</>;
};

export default SmoothScrollWrapper;