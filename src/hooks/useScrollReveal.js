import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — applies a CSS class to elements when they enter the viewport.
 * Elements need the 'reveal' class; this hook adds 'visible' when they scroll in.
 */
export function useScrollReveal(selector = '.reveal') {
  const observerRef = useRef(null);

  useEffect(() => {
    const elements = document.querySelectorAll(selector);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [selector]);
}

export default useScrollReveal;
