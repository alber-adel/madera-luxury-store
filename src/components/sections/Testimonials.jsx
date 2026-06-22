import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? '#C9A96E' : 'none'}
          stroke={i < count ? '#C9A96E' : '#D4BFA0'}
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [dbTestimonials, setDbTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews from Supabase
  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        console.log('[Supabase Testimonials Fetch]', { data, error });
        if (data && data.length > 0) {
          setDbTestimonials(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('[Supabase Testimonials Catch Error]', err);
        setLoading(false);
      });
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading, dbTestimonials]);

  // Autoplay functionality: advances to the next review every 5 seconds
  useEffect(() => {
    if (!autoPlay || dbTestimonials.length <= 1) return;
    const iv = setInterval(() => {
      const nextIndex = (activeIndex + 1) % dbTestimonials.length;
      scrollToTestimonial(nextIndex);
    }, 5000);
    return () => clearInterval(iv);
  }, [autoPlay, activeIndex, dbTestimonials.length]);

  // Scroll programmatically to index
  const scrollToTestimonial = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const child = container.children[index];
    if (child) {
      container.scrollTo({
        left: child.offsetLeft,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  // Track scroll position to update active dot index on manual swipe/scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const { scrollLeft, clientWidth } = container;
    if (clientWidth === 0) return;
    const index = Math.round(scrollLeft / clientWidth);
    if (index >= 0 && index < dbTestimonials.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Pause autoplay on user interaction
  const handleUserInteraction = () => {
    setAutoPlay(false);
  };

  const handleDotClick = (index) => {
    scrollToTestimonial(index);
    setAutoPlay(false);
  };

  const navigatePrev = () => {
    const prevIndex = (activeIndex - 1 + dbTestimonials.length) % dbTestimonials.length;
    scrollToTestimonial(prevIndex);
    setAutoPlay(false);
  };

  const navigateNext = () => {
    const nextIndex = (activeIndex + 1) % dbTestimonials.length;
    scrollToTestimonial(nextIndex);
    setAutoPlay(false);
  };

  return (
    <section
      id="testimonials"
      className="py-24 lg:py-32 overflow-hidden"
      ref={sectionRef}
      style={{
        background: 'linear-gradient(160deg, #1C1C1E 0%, #2A2018 60%, #1C1C1E 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="section-eyebrow">Client Stories</span>
          <h2
            className="mt-4 text-4xl lg:text-5xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#FAF8F5',
            }}
          >
            What Our Clients Say
          </h2>
          <p
            className="mt-3 text-sm"
            style={{ color: 'rgba(250,248,245,0.5)', direction: 'rtl', fontFamily: 'Inter, sans-serif' }}
          >
            آراء عملائنا الكرام — ثقتكم هي أعظم جائزة لنا
          </p>
          <div className="flex justify-center mt-6">
            <span className="block w-12 h-px bg-gold" />
          </div>
        </div>

        {/* Dynamic content area */}
        {loading ? (
          <div className="text-center py-20 reveal">
            <div className="inline-block w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-white/50">جاري تحميل التقييمات...</p>
          </div>
        ) : dbTestimonials.length > 0 ? (
          <div className="relative w-full group/carousel max-w-5xl mx-auto">
            {/* Scrollbar CSS */}
            <style>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>

            {/* Left navigation arrow for Desktop */}
            <button
              onClick={navigatePrev}
              className="hidden md:flex absolute left-[-60px] top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100"
              aria-label="Previous testimonial"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right navigation arrow for Desktop */}
            <button
              onClick={navigateNext}
              className="hidden md:flex absolute right-[-60px] top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100"
              aria-label="Next testimonial"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Horizontal Scrollable Track */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onTouchStart={handleUserInteraction}
              onMouseDown={handleUserInteraction}
              className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth w-full pb-4"
            >
              {dbTestimonials.map((t, index) => (
                <div
                  key={t.id}
                  className="w-full flex-shrink-0 snap-center px-4 flex justify-center"
                >
                  {/* Glassmorphic Slide Card */}
                  <div
                    className="w-full max-w-4xl p-6 sm:p-10 rounded-2xl flex flex-col md:flex-row gap-6 md:gap-8 items-center transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {/* Client Profile Block (Placed first for RTL layouts) */}
                    <div
                      className="flex flex-col items-center text-center md:items-end md:text-right md:w-1/3 flex-shrink-0 pb-6 md:pb-0 border-b md:border-b-0 md:border-l border-white/10 md:pl-8"
                      style={{ direction: 'rtl' }}
                    >
                      {/* Avatar */}
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-lg sm:text-xl font-semibold mb-4"
                        style={{
                          background: 'linear-gradient(135deg, #C9A96E, #A07840)',
                          color: 'white',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {t.initials || (t.name ? t.name.substring(0, 2) : 'M')}
                      </div>
                      <h3
                        className="text-lg sm:text-xl font-bold mb-1"
                        style={{ color: '#FAF8F5' }}
                      >
                        {t.name}
                      </h3>
                      <p
                        className="text-xs sm:text-sm mb-3"
                        style={{ color: 'rgba(250,248,245,0.5)' }}
                      >
                        {t.role}
                      </p>
                      <StarRating count={t.rating} />
                    </div>

                    {/* Review text block */}
                    <div className="w-full md:w-2/3 relative flex flex-col justify-center min-h-[120px]">
                      {/* Decorative quotes */}
                      <span
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: '6rem',
                          lineHeight: '1',
                          color: 'rgba(201,169,110,0.12)',
                          position: 'absolute',
                          top: '-2.5rem',
                          right: '-0.5rem',
                          userSelect: 'none',
                        }}
                      >
                        "
                      </span>

                      <p
                        className="text-base sm:text-lg lg:text-xl leading-relaxed italic relative z-10 text-right pr-4"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color: 'rgba(250,248,245,0.85)',
                          direction: 'rtl',
                        }}
                      >
                        {t.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              {dbTestimonials.map((_, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    className="h-1.5 transition-all duration-300 rounded-full"
                    style={{
                      width: isActive ? '20px' : '6px',
                      background: isActive ? '#C9A96E' : 'rgba(255,255,255,0.15)',
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-lg bg-white/[0.02] backdrop-blur-sm max-w-2xl mx-auto reveal">
            <svg
              className="mx-auto mb-4 text-[#C9A96E]/50"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742h.008v.008h-.008v-.008zm3.702 0h.008v.008h-.008v-.008zm3.702 0h.008v.008h-.008v-.008zM12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            </svg>
            <p
              className="text-lg text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No reviews available
            </p>
            <p className="text-sm text-white/50">
              لا توجد تقييمات حالياً — شاركنا تقييمك لمساعدتنا على تقديم الأفضل
            </p>
          </div>
        )}

        {/* Bottom trust bar */}
        <div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 reveal"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          {[
            { icon: '⭐', stat: '4.9/5', label: 'Average Rating' },
            { icon: '💬', stat: '500+', label: 'Happy Clients' },
            { icon: '🔄', stat: '95%', label: 'Repeat Customers' },
            { icon: '🏅', stat: '100%', label: 'Satisfaction Rate' },
          ].map((item) => (
            <div key={item.stat} className="text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p
                className="text-2xl font-light mb-1"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  background: 'linear-gradient(135deg, #E2CFA5, #C9A96E)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {item.stat}
              </p>
              <p className="text-[11px] tracking-wider uppercase" style={{ color: 'rgba(250,248,245,0.4)' }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
