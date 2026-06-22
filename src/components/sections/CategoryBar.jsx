import { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../../data/productData';

// Helper function to return beautiful custom SVG icons for each category
function getCategoryIcon(id) {
  const props = {
    width: "28",
    height: "28",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "transition-colors duration-300"
  };

  switch (id) {
    case 'all':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'dining':
      return (
        <svg {...props}>
          <path d="M4 11h16M6 11v8M18 11v8" />
          <path d="M8 7h2v4H8zM14 7h2v4h-2z" />
          <path d="M3 11h18M5 18h14" />
        </svg>
      );
    case 'bedroom':
      return (
        <svg {...props}>
          <path d="M2 19V5a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14M2 13h20" />
          <rect x="5" y="7" width="6" height="4" rx="1" />
          <rect x="13" y="7" width="6" height="4" rx="1" />
          <path d="M5 13v3M19 13v3" />
        </svg>
      );
    case 'children':
      return (
        <svg {...props}>
          <path d="M3 21V3M21 21V9" />
          <path d="M3 7h18M6 7V5h12v2" />
          <path d="M3 15h18M6 15v-3h12v3" />
          <path d="M10 7v8M14 7v8M10 11h4" />
        </svg>
      );
    case 'l-shape':
      return (
        <svg {...props}>
          <path d="M3 7v12a1 1 0 0 0 1 1h16v-5" />
          <path d="M3 7h6v8h12v-5a1 1 0 0 0-1-1h-4" />
          <path d="M3 13h6M13 15v5" />
        </svg>
      );
    case 'sofa-set':
      return (
        <svg {...props}>
          <path d="M3 14h18M3 18h18M3 11v7a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-7" />
          <path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
          <path d="M9 11v7M15 11v7" />
        </svg>
      );
    case 'kitchen':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="1.5" />
          <path d="M3 11h18M12 3v18M7 7h2M15 7h2M7 15h2M15 15h2" />
        </svg>
      );
    case 'dressing':
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="1.5" />
          <path d="M11 3v18M11 7h5v8h-5" />
          <path d="M9 10v4M13 10v2" />
        </svg>
      );
    case 'tables':
      return (
        <svg {...props}>
          <path d="M3 11h18M5 11l2 9M19 11l-2 9M9 11v5M15 11v5" />
          <rect x="7" y="5" width="10" height="3" rx="0.5" />
        </svg>
      );
    case 'deliveries':
      return (
        <svg {...props}>
          <path d="M14 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8v12zM14 9h4l3 3v4h-7V9z" />
          <circle cx="7.5" cy="18.5" r="2.5" />
          <circle cx="17.5" cy="18.5" r="2.5" />
          <path d="M7 9h3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function CategoryBar({ active, onChange }) {
  const scrollRef = useRef(null);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Split categories: 3 pages on mobile (4 + 3 + 3 items), 2 pages on desktop (5 + 5 items)
  const maxPages = isMobile ? 3 : 2;
  let activePage;
  if (isMobile) {
    if (activeDotIndex <= 3) activePage = 0;      // Items 0, 1, 2, 3
    else if (activeDotIndex <= 6) activePage = 1; // Items 4, 5, 6
    else activePage = 2;                          // Items 7, 8, 9
  } else {
    activePage = activeDotIndex < 5 ? 0 : 1;
  }

  // Sync scroll position if active changes from outside (e.g. Navbar)
  useEffect(() => {
    const activeIndex = CATEGORIES.findIndex(cat => cat.id === active);
    if (activeIndex !== -1 && scrollRef.current) {
      const container = scrollRef.current;
      const child = container.children[activeIndex];
      if (child) {
        const targetScroll = child.offsetLeft - (container.clientWidth / 2) + (child.clientWidth / 2);
        if (Math.abs(container.scrollLeft - targetScroll) > 15) {
          container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
        }
      }
      setActiveDotIndex(activeIndex);
    }
  }, [active]);

  // Track which category item is closest to the center on scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const { scrollLeft, clientWidth } = container;
    const containerCenter = scrollLeft + clientWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(childCenter - containerCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveDotIndex(closestIndex);
  };

  // Scroll to index without selecting category
  const scrollToCategoryScrollOnly = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const child = container.children[index];
    if (child) {
      const targetScroll = child.offsetLeft - (container.clientWidth / 2) + (child.clientWidth / 2);
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      setActiveDotIndex(index);
    }
  };

  // Scroll and select category
  const selectCategory = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const child = container.children[index];
    if (child) {
      const targetScroll = child.offsetLeft - (container.clientWidth / 2) + (child.clientWidth / 2);
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      onChange(CATEGORIES[index].id);
      setActiveDotIndex(index);
    }
  };

  // Scroll to page index
  const scrollToPage = (pageIndex) => {
    let targetIndex;
    if (isMobile) {
      if (pageIndex === 0) targetIndex = 0;
      else if (pageIndex === 1) targetIndex = 4;
      else targetIndex = 7;
    } else {
      targetIndex = pageIndex === 0 ? 0 : 5;
    }
    scrollToCategoryScrollOnly(targetIndex);
  };

  const scrollLeft = () => {
    if (activePage > 0) {
      scrollToPage(activePage - 1);
    }
  };

  const scrollRight = () => {
    if (activePage < maxPages - 1) {
      scrollToPage(activePage + 1);
    }
  };

  return (
    <div className="relative w-full group/bar">
      {/* Scrollbar & Snap CSS */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Navigation Arrows for Desktop */}
      <button
        onClick={scrollLeft}
        disabled={activePage === 0}
        className="hidden md:flex absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white/80 border border-gold/20 shadow-md text-gold hover:bg-gold hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 opacity-0 group-hover/bar:opacity-100"
        aria-label="Scroll to previous page"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={scrollRight}
        disabled={activePage === maxPages - 1}
        className="hidden md:flex absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white/80 border border-gold/20 shadow-md text-gold hover:bg-gold hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 opacity-0 group-hover/bar:opacity-100"
        aria-label="Scroll to next page"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scrollable Container with Snapping */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-3 pt-2 scroll-smooth snap-x snap-mandatory"
      >
        {CATEGORIES.map((cat, index) => {
          const isActive = cat.id === active;

          return (
            <button
              key={cat.id}
              id={`filter-${cat.id}`}
              onClick={() => selectCategory(index)}
              aria-pressed={isActive}
              className="flex flex-col items-center justify-center p-3 w-[105px] sm:w-[120px] aspect-square rounded-xl transition-all duration-300 select-none group flex-shrink-0 snap-center"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #C9A96E, #A07840)'
                  : 'white',
                color: isActive ? 'white' : '#1C1C1E',
                border: '1px solid',
                borderColor: isActive ? 'transparent' : 'rgba(201,169,110,0.18)',
                boxShadow: isActive 
                  ? '0 8px 24px rgba(201,169,110,0.28)' 
                  : '0 2px 8px rgba(0,0,0,0.01)',
                transform: isActive ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0)',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#C9A96E';
                  e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(201,169,110,0.12)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgba(201,169,110,0.18)';
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.01)';
                }
              }}
            >
              {/* Custom SVG Icon */}
              <div 
                className="transition-transform duration-300 group-hover:scale-105"
                style={{
                  color: isActive ? 'white' : '#C9A96E'
                }}
              >
                {getCategoryIcon(cat.id)}
              </div>

              {/* Label */}
              <span 
                className="mt-3 text-[10.5px] font-semibold tracking-wider uppercase text-center leading-tight transition-colors duration-300"
                style={{
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dots Progress Indicator — 3 dots on mobile, 2 dots on desktop */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {Array.from({ length: maxPages }).map((_, pageIndex) => {
          const isActive = pageIndex === activePage;
          return (
            <button
              key={pageIndex}
              onClick={() => scrollToPage(pageIndex)}
              className="h-1.5 transition-all duration-300 rounded-full"
              style={{
                width: isActive ? '18px' : '6px',
                background: isActive ? '#A07840' : '#E5E5EA',
              }}
              aria-label={`Go to page ${pageIndex + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
