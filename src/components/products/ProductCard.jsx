import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Badge from '../ui/Badge';
import { CATEGORY_LABELS, getProductImages } from '../../data/productData';

export default function ProductCard({ product, onSelect, globalSale }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const images = useMemo(() => getProductImages(product), [product]);
  const hasMultiple = images.length > 1;

  const startCycle = useCallback(() => {
    setIsHovered(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!hasMultiple) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setImgIndex((i) => (i + 1) % images.length);
    }, 1200);
  }, [hasMultiple, images.length]);

  const stopCycle = useCallback(() => {
    setIsHovered(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setImgIndex(0), 300);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  return (
    <article
      className="group relative overflow-hidden bg-white transition-all duration-500 cursor-pointer"
      style={{
        boxShadow: isHovered
          ? '0 20px 60px rgba(28,28,30,0.16)'
          : '0 2px 16px rgba(28,28,30,0.07)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
      onClick={() => onSelect(product)}
    >
      {/* Image container */}
      <div className="relative aspect-product overflow-hidden bg-sand-100">

        {/* Global Sale badge (overrides when sale is active) */}
        {globalSale?.enabled ? (
          <span
            className="absolute top-4 left-4 z-10 text-[9px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 flex items-center gap-1.5"
            style={{
              background: 'linear-gradient(135deg, #C0392B, #922B21)',
              color: 'white',
              boxShadow: '0 2px 10px rgba(192,57,43,0.45)',
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-white"
              style={{ animation: 'badgePulse 1.5s ease-in-out infinite', flexShrink: 0 }}
            />
            {globalSale.discount ? `Sale ${globalSale.discount}` : 'On Sale'}
            <style>{`
              @keyframes badgePulse {
                0%,100% { opacity:.9; transform:scale(1); }
                50% { opacity:.3; transform:scale(.65); }
              }
            `}</style>
          </span>
        ) : (
          <Badge text={product.badge} discount={product.sale_discount} />
        )}

        {/* Main image */}
        {images.length > 0 ? (
          <img
            src={images[imgIndex]}
            alt={`${product.name} — ${categoryLabel}`}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: isHovered ? 'scale(1.07)' : 'scale(1)' }}
            loading="lazy"
            onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-charcoal-muted text-sm">
            Image coming soon
          </div>
        )}

        {/* Gallery indicator dots */}
        {hasMultiple && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Image ${i + 1}`}
                onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                className="h-0.5 rounded-full transition-all duration-300"
                style={{
                  width: i === imgIndex ? '20px' : '6px',
                  background: i === imgIndex ? '#C9A96E' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>
        )}

        {/* Multi-image hint */}
        {hasMultiple && !isHovered && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-[9px] backdrop-blur-sm"
            style={{ background: 'rgba(28,28,30,0.5)', color: 'white', borderRadius: '2px' }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {images.length}
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-400"
          style={{
            background: 'linear-gradient(to top, rgba(28,28,30,0.75) 0%, rgba(28,28,30,0.3) 100%)',
            opacity: isHovered ? 1 : 0,
          }}
        >
          <button
            id={`view-${product.id}`}
            onClick={(e) => { e.stopPropagation(); onSelect(product); }}
            className="px-7 py-2.5 text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-300"
            style={{
              background: 'white',
              color: '#1C1C1E',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1C1C1E'; }}
          >
            View Details
          </button>
          <p
            className="text-[9px] tracking-wider uppercase"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Click to explore
          </p>
        </div>
      </div>

      {/* Card body */}
      <div
        className="p-5 transition-all duration-300"
        style={{ borderTop: `2px solid ${isHovered ? '#C9A96E' : 'rgba(240,233,220,0.8)'}` }}
      >
        <p className="text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: '#C9A96E' }}>
          {categoryLabel}
        </p>
        <h3
          className="text-lg leading-snug mb-4"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#1C1C1E',
          }}
        >
          {product.name}
        </h3>

        <button
          onClick={(e) => { e.stopPropagation(); onSelect(product); }}
          className="w-full py-2.5 text-[10px] font-medium tracking-[0.15em] uppercase transition-all duration-300"
          style={{
            border: '1px solid rgba(201,169,110,0.4)',
            color: '#C9A96E',
            background: 'transparent',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #C9A96E, #A07840)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = 'transparent';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#C9A96E';
            e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)';
          }}
        >
          Explore Piece
        </button>
      </div>
    </article>
  );
}
