import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * ImageGallery — large main image + scrollable thumbnail strip.
 * Updated to match dark luxury design system.
 */
export default function ImageGallery({ images, alt }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div
        className="flex-1 flex items-center justify-center text-sm"
        style={{ background: '#F9F5EE', color: '#6E6E73' }}
      >
        No image available
      </div>
    );
  }

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const hasSwiped = useRef(false);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    hasSwiped.current = false;
  };

  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const currentX = e.targetTouches[0].clientX;
    touchEndX.current = currentX;
    if (Math.abs(touchStartX.current - currentX) > 10) {
      hasSwiped.current = true;
    }
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-3 h-full">

      {/* Main image container */}
      <div
        className="relative flex-1 min-h-0 overflow-hidden group cursor-pointer sm:rounded-lg"
        style={{ background: '#1C1A17', touchAction: 'pan-y' }}
        onClick={() => { if (!hasSwiped.current) setFullscreen(true); }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Blurred background */}
        <img
          key={`bg-${activeIndex}`}
          src={images[activeIndex]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
          style={{ filter: 'blur(18px)', transform: 'scale(1.15)', opacity: 0.45 }}
        />
        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(28,26,23,0.6) 100%)' }} />

        {/* Main sharp image */}
        <img
          key={activeIndex}
          src={images[activeIndex]}
          alt={`${alt} — view ${activeIndex + 1}`}
          className="relative z-10 w-full h-full object-contain animate-fadeIn transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(e) => { e.target.style.display = 'none'; }}
        />

        {/* Zoom icon */}
        <div className="absolute top-3 left-3 z-20 transition-opacity duration-300 opacity-60 group-hover:opacity-100">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: 'rgba(28,28,30,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Nav arrows — inside image, upgraded UI */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110"
              style={{ background: 'rgba(28,28,30,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110"
              style={{ background: 'rgba(28,28,30,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Counter pill */}
            <div
              className="absolute bottom-3 right-3 text-xs px-2.5 py-1 z-20"
              style={{ background: 'rgba(28,28,30,0.6)', color: 'white', backdropFilter: 'blur(4px)' }}
            >
              {activeIndex + 1} / {images.length}
            </div>

            {/* Gold progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / images.length) * 100}%`, background: 'linear-gradient(90deg, #C9A96E, #A07840)' }}
              />
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 flex-shrink-0">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              className="flex-shrink-0 w-14 h-14 overflow-hidden transition-all duration-300"
              style={{
                border: '2px solid',
                borderColor: i === activeIndex ? '#C9A96E' : 'transparent',
                opacity: i === activeIndex ? 1 : 0.55,
                transform: i === activeIndex ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={e => { if (i !== activeIndex) e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { if (i !== activeIndex) e.currentTarget.style.opacity = '0.55'; }}
            >
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.opacity = '0.2'; }}
              />
            </button>
          ))}
        </div>
      )}
      {/* Fullscreen Modal */}
      {fullscreen && createPortal(
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          style={{ background: '#0E0C0A', touchAction: 'pan-y' }}
          onClick={() => { if (!hasSwiped.current) setFullscreen(false); }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setFullscreen(false); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <img 
            src={images[activeIndex]} 
            alt={`${alt} — fullscreen`} 
            className="max-w-full max-h-full object-contain shadow-2xl relative z-0"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Fullscreen Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
