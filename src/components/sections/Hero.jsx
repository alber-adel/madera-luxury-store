import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useSaleBannerContext } from '../../context/SaleBannerContext';

const BUCKET = 'products-images';
const STORAGE_BASE = `https://zahhrknatspivrpsovuj.supabase.co/storage/v1/object/public/${BUCKET}`;

async function getFolderImages(folderPath) {
  if (!folderPath) return [];
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(folderPath, { sortBy: { column: 'name', order: 'asc' } });
  if (error || !data) return [];
  return data
    .filter((f) => f.name && !f.name.startsWith('.'))
    .map((f) => {
      const cacheBust = f.updated_at ? new Date(f.updated_at).getTime() : (f.created_at ? new Date(f.created_at).getTime() : '');
      return `${STORAGE_BASE}/${folderPath}/${f.name}${cacheBust ? `?t=${cacheBust}` : ''}`;
    });
}

const stats = [
  { number: '750+', label: 'Unique Pieces' },
  { number: '100%', label: 'Handcrafted' },
  { number: '15+', label: 'Years Expertise' },
];

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [heroProduct, setHeroProduct] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const { isVisible, BANNER_H } = useSaleBannerContext();

  // Split Image Slider State
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderContainerRef = useRef(null);

  const handleSliderMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleMouseMove = (e) => { if (isDragging) handleSliderMove(e.clientX); };
  const handleTouchMove = (e) => {
    if (isDragging) {
      handleSliderMove(e.touches[0].clientX);
      if (e.cancelable) e.preventDefault();
    }
  };
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(async ({ data }) => {
        if (data) {
          const images = await getFolderImages(data.folder_path);
          setHeroProduct({ ...data, images });
        }
      });

    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Auto-cycle hero images
  useEffect(() => {
    if (!heroProduct?.images?.length || heroProduct.images.length < 2) return;
    const iv = setInterval(() => {
      setImgIndex((i) => (i + 1) % heroProduct.images.length);
    }, 4000);
    return () => clearInterval(iv);
  }, [heroProduct]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #2D2D30 40%, #3A3020 100%)' }}
    >
      {/* ── Decorative wood-grain blobs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 -left-60 w-[600px] h-[600px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #A07840 0%, transparent 70%)' }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg, transparent, transparent 60px,
              rgba(201,169,110,0.3) 60px, rgba(201,169,110,0.3) 61px
            ), repeating-linear-gradient(
              90deg, transparent, transparent 60px,
              rgba(201,169,110,0.3) 60px, rgba(201,169,110,0.3) 61px
            )`,
          }}
        />
      </div>

      <div
        className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full lg:min-h-screen lg:flex lg:items-center"
        style={{ paddingTop: isVisible ? `${BANNER_H + 112}px` : '112px', paddingBottom: '64px' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

          {/* ── Left — Text content ── */}
          <div className="order-2 lg:order-1">

            {/* Eyebrow tag */}
            <div
              className={`inline-flex items-center gap-3 mb-6 transition-all duration-700 delay-100
                ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              <span className="w-8 h-px bg-gold" />
              <span className="text-[0.55rem] font-medium tracking-[0.35em] uppercase text-gold">
                Custom Furniture · Designed For Your Space
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.05] mb-6
                          transition-all duration-800 delay-200
                          ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ color: '#FAF8F5', fontFamily: "'Playfair Display', serif" }}
            >
              Where Wood
              <br />
              <em
                className="not-italic"
                style={{
                  background: 'linear-gradient(135deg, #E2CFA5 0%, #C9A96E 50%, #A07840 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Becomes
              </em>
              <br />
              Wonder.
            </h1>

            {/* Arabic description */}
            <p
              className={`text-base leading-loose max-w-md mb-10 text-right
                          transition-all duration-700 delay-300
                          ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              dir="rtl"
              style={{
                color: 'rgba(250,248,245,0.65)',
                fontFamily: 'Inter, system-ui, sans-serif',
                lineHeight: '1.9',
              }}
            >
              من مصنعنا لمنزلك
              ...
              <br />
              كل قطعة نصنعها تبدأ بفكرة، وتنتهي بتفاصيل تناسب احتياجك ومساحتك.
              ابداع فى التصميم..جودة في التصنيع دقة في التنفيذ،وتفاصيل تصنع الفرق.
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 mb-14
                          transition-all duration-700 delay-[400ms]
                          ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <a
                href="#collections"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:-translate-y-0.5 no-underline"
                style={{
                  background: 'linear-gradient(135deg, #C9A96E, #A07840)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(201,169,110,0.4)',
                }}
              >
                <span>Explore Collections</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:-translate-y-0.5 no-underline"
                style={{
                  border: '1px solid rgba(201,169,110,0.4)',
                  color: 'rgba(250,248,245,0.8)',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,169,110,0.9)';
                  e.currentTarget.style.color = '#C9A96E';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)';
                  e.currentTarget.style.color = 'rgba(250,248,245,0.8)';
                }}
              >
                Our Story
              </a>
            </div>

            {/* Stats */}
            <div
              className={`flex gap-10 pt-8
                          transition-all duration-700 delay-500
                          ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              {stats.map(({ number, label }, i) => (
                <div key={label} style={{ animationDelay: `${i * 100}ms` }}>
                  <p
                    className="text-3xl font-light leading-none mb-1"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      background: 'linear-gradient(135deg, #E2CFA5, #C9A96E)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {number}
                  </p>
                  <p className="text-[10px] tracking-wider" style={{ color: 'rgba(250,248,245,0.45)' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right — Hero product image ── */}
          <div
            className={`order-1 lg:order-2 relative
                        transition-all duration-1000 delay-300
                        ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          >
            {/* Main image frame */}
            <div className="relative">
              {/* Outer decorative border */}
              <div
                className="absolute -inset-3 rounded-sm opacity-30"
                style={{ border: '1px solid #C9A96E', animation: 'borderPulse 4s ease-in-out infinite' }}
              />

              {/* Image container */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: '4/5', maxHeight: '75vh' }}
              >
                {/* Gradient overlay on image */}
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background: 'linear-gradient(to top, rgba(28,28,30,0.7) 0%, transparent 50%)',
                  }}
                />
                <div className="absolute inset-0 bg-sand-100" />

                {heroProduct?.images?.length === 2 ? (
                  <div
                    ref={sliderContainerRef}
                    className="relative w-full h-full cursor-col-resize select-none"
                    onMouseDown={(e) => { setIsDragging(true); handleSliderMove(e.clientX); e.preventDefault(); }}
                    onTouchStart={(e) => { setIsDragging(true); handleSliderMove(e.touches[0].clientX); }}
                  >
                    <img
                      src={heroProduct.images[0]}
                      alt={heroProduct.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <img
                      src={heroProduct.images[1]}
                      alt={heroProduct.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    />
                    {/* Slider Line & Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
                      style={{ left: `calc(${sliderPos}% - 2px)` }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="2">
                          <path d="M15 18l-6-6 6-6" />
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : heroProduct?.images?.length > 0 && (
                  <img
                    src={heroProduct.images[imgIndex]}
                    alt={heroProduct.name}
                    className="relative w-full h-full object-cover transition-all duration-1000"
                    style={{ animation: 'heroImageFloat 8s ease-in-out infinite' }}
                  />
                )}

                {/* Floating product label */}
                <div
                  className="absolute bottom-0 left-0 right-0 z-20 p-6"
                >
                  <p
                    className="text-[10px] tracking-[0.3em] uppercase mb-2"
                    style={{ color: '#C9A96E' }}
                  >
                    {heroProduct?.badge ?? 'Featured Piece'}
                  </p>
                  <p
                    className="text-xl font-serif"
                    style={{ color: 'rgba(250,248,245,0.95)', fontFamily: "'Playfair Display', serif" }}
                  >
                    {heroProduct?.name}
                  </p>
                  {/* Image dots */}
                  {heroProduct?.images?.length > 1 && (
                    <div className="flex gap-1.5 mt-4">
                      {heroProduct.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIndex(i)}
                          className={`h-0.5 rounded-full transition-all duration-300 ${i === imgIndex ? 'w-6 bg-gold' : 'w-2 bg-white/30'
                            }`}
                          aria-label={`Image ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Corner accent - top right */}
              <div
                className="absolute -top-3 -right-3 w-16 h-16"
                style={{
                  borderTop: '2px solid #C9A96E',
                  borderRight: '2px solid #C9A96E',
                }}
              />
              {/* Corner accent - bottom left */}
              <div
                className="absolute -bottom-3 -left-3 w-16 h-16"
                style={{
                  borderBottom: '2px solid #C9A96E',
                  borderLeft: '2px solid #C9A96E',
                }}
              />
            </div>

            {/* Floating badge card */}
            <div
              className="absolute -left-6 top-1/4 z-30 p-4 hidden lg:block"
              style={{
                background: 'rgba(201,169,110,0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(201,169,110,0.3)',
                minWidth: '140px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" className="mb-2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: '#C9A96E' }}>Quality</p>
              <p className="text-xs font-medium" style={{ color: 'rgba(250,248,245,0.85)' }}>
                5-Year Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>



      <style>{`
        @keyframes borderPulse {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.6; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
        @keyframes heroImageFloat {
          0%, 100% { transform: scale(1.01) translateY(0); }
          50%       { transform: scale(1.03) translateY(-6px); }
        }
      `}</style>
    </section>
  );
}
