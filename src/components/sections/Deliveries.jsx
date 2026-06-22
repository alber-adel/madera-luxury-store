import { useEffect, useRef, useState, useCallback } from 'react';
import { useDeliveries } from '../../hooks/useDeliveries';

/* ─── Delivery showcase photos (using local public images) ─── */
const DELIVERY_PHOTOS = [
  {
    src: '/images/Dining-room/657379172_17981321480992149_2788591344507940968_n.jpg',
    label: 'Dining Room Delivery',
    arabic: 'تسليم غرفة السفرة',
  },
  {
    src: '/images/Dining-room/IMG-20240728-WA0092.jpg',
    label: 'White-Glove Setup',
    arabic: 'تركيب احترافي',
  },
  {
    src: '/images/living-room/WhatsApp Image 2025-08-19 at 7.48.09 PM (3).jpeg',
    label: 'Living Room Complete',
    arabic: 'غرفة معيشة مكتملة',
  },
  {
    src: '/images/Dining-room/IMG-20240728-WA0093.jpg',
    label: 'Perfect Placement',
    arabic: 'تنسيق مثالي',
  },
  {
    src: '/images/living-room/WhatsApp Image 2025-08-19 at 7.48.10 PM (1).jpeg',
    label: 'Client Satisfaction',
    arabic: 'رضا العميل',
  },
  {
    src: '/images/Dining-room/IMG-20240728-WA0094.jpg',
    label: 'Showroom Quality',
    arabic: 'جودة المعرض في منزلك',
  },
  {
    src: '/images/living-room/WhatsApp Image 2025-08-19 at 7.48.09 PM (4).jpeg',
    label: 'Modern Living',
    arabic: 'معيشة عصرية',
  },
  {
    src: '/images/Dining-room/IMG-20240728-WA0095.jpg',
    label: 'Elegant Finish',
    arabic: 'تشطيب أنيق',
  },
  {
    src: '/images/children-room/IMG-20240728-WA0070.jpg',
    label: "Children's Room",
    arabic: 'غرفة الأطفال',
  },
  {
    src: '/images/living-room/WhatsApp Image 2025-08-19 at 7.48.10 PM (2).jpeg',
    label: 'Cozy Corner',
    arabic: 'ركن دافئ',
  },
];

/* ─── 6 feature cards ─── */
const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: 'White-Glove Delivery',
    arabic: 'توصيل احترافي بعناية فائقة',
    desc: 'Our trained team carries, places, and perfects every piece — you just enjoy the result.',
    stat: '48h',
    statLabel: 'Cairo',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: 'Nationwide Coverage',
    arabic: 'تغطية جميع المحافظات',
    desc: 'From Alexandria to Aswan — we deliver to all 27 Egyptian governorates.',
    stat: '27',
    statLabel: 'Governorates',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: 'Expert Assembly',
    arabic: 'تركيب متخصص مجاني',
    desc: 'Certified craftsmen assemble everything on-site at no extra cost.',
    stat: 'Free',
    statLabel: 'Assembly',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: 'Fully Insured',
    arabic: 'تأمين كامل أثناء النقل',
    desc: 'Every piece is fully insured during transit. Any damage? We replace — no questions.',
    stat: '100%',
    statLabel: 'Insured',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Scheduled Slots',
    arabic: 'موعد بحسب اختيارك',
    desc: 'Pick your day and time window. We arrive on the dot — every time.',
    stat: '98%',
    statLabel: 'On-Time',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    title: 'Follow-Up Care',
    arabic: 'متابعة ما بعد التسليم',
    desc: 'We call 48h after delivery to make sure everything is exactly as you envisioned.',
    stat: '48h',
    statLabel: 'Follow-Up',
  },
];

/* ─── Helper: InfiniteTrack (auto-scrolling strip) ─── */
function InfiniteTrack({ photos, direction = 1, speed = 35, onPhotoClick }) {
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const rafRef = useRef(null);
  const doubled = [...photos, ...photos]; // duplicate for seamless loop

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    
    // Dynamically calculate item width
    const itemW = track.children[0].offsetWidth + 16; // width + gap
    const totalW = photos.length * itemW;
    
    const isMobile = window.innerWidth < 768;
    const currentSpeed = isMobile ? speed * 1.5 : speed;

    const animate = () => {
      posRef.current += (currentSpeed / 60) * direction;
      // wrap
      if (direction > 0 && posRef.current >= totalW) posRef.current -= totalW;
      if (direction < 0 && posRef.current <= 0) posRef.current += totalW;
      track.style.transform = `translateX(${-posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [photos.length, direction, speed]);

  return (
    <div className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex gap-4 will-change-transform"
        style={{ width: 'max-content' }}
      >
        {doubled.map((photo, i) => (
          <div
            key={i}
            className="flex-shrink-0 relative overflow-hidden group cursor-pointer w-[160px] h-[120px] md:w-[280px] md:h-[200px]"
            onClick={() => onPhotoClick && onPhotoClick(i % photos.length)}
          >
            <img
              src={photo.src}
              alt={photo.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={e => { e.target.style.opacity = '0.3'; }}
            />
            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{ background: 'linear-gradient(to top, rgba(28,28,30,0.85) 0%, transparent 60%)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-[9px] tracking-widest uppercase text-white/70">Click to expand</p>
              </div>
              {photo.label && <p className="text-xs font-medium tracking-wider uppercase text-white">{photo.label}</p>}
              {photo.arabic && <p className="text-[10px] mt-0.5" style={{ color: '#C9A96E', direction: 'rtl' }}>{photo.arabic}</p>}
            </div>
            {/* Gold corner accent */}
            <div
              className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500"
              style={{ background: 'linear-gradient(90deg, #C9A96E, #E2CFA5)' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Section ─── */
export default function Deliveries() {
  const sectionRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null); // null = closed
  const { images: dbImages, loading } = useDeliveries();

  const displayPhotos = dbImages.length > 0 ? dbImages : DELIVERY_PHOTOS;

  // Lightbox helpers
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const lightboxPrev = () => setLightboxIndex(i => (i === 0 ? displayPhotos.length - 1 : i - 1));
  const lightboxNext = () => setLightboxIndex(i => (i === displayPhotos.length - 1 ? 0 : i + 1));

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target
              .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
              .forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 90));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        id="deliveries"
        ref={sectionRef}
        className="overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #F9F5EE 0%, #FAF8F5 100%)' }}
      >
        {/* ══ Section header ══ */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 lg:pt-32 pb-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 reveal">
            <div>
              <span className="section-eyebrow">Our Deliveries</span>
              <h2
                className="mt-4 text-4xl lg:text-5xl text-charcoal leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Delivered with
                <br />
                <em
                  className="not-italic"
                  style={{
                    background: 'linear-gradient(135deg, #C9A96E, #A07840)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Precision & Care
                </em>
              </h2>
            </div>
            <div className="max-w-xs text-right">
              <p
                className="text-sm leading-loose"
                style={{ color: '#6E6E73', direction: 'rtl', fontFamily: 'Inter, sans-serif', lineHeight: '1.9' }}
                dir="rtl"
              >
                تسليماتنا — لأن الأثاث الفاخر يستحق خدمة توصيل بنفس المستوى الراقي
              </p>
            </div>
          </div>

          {/* ── Stats bar ── */}
          <div className="grid grid-cols-3 mt-12 reveal" style={{ borderTop: '1px solid rgba(201,169,110,0.2)', borderBottom: '1px solid rgba(201,169,110,0.2)' }}>
            {[
              { n: '10,000+', en: 'Pieces Delivered', ar: 'قطعة تم توصيلها' },
              { n: '4–8 Wks', en: 'Lead Time', ar: 'وقت التصنيع' },
              { n: '5 ★', en: 'Delivery Rating', ar: 'تقييم التوصيل' },
            ].map((s, i) => (
              <div
                key={s.n}
                className="py-8 px-6 text-center"
                style={{ borderLeft: i > 0 ? '1px solid rgba(201,169,110,0.15)' : 'none' }}
              >
                <p
                  className="text-3xl lg:text-4xl font-light mb-1"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    background: 'linear-gradient(135deg, #C9A96E, #A07840)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {s.n}
                </p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal-muted mb-1">{s.en}</p>
                <p className="text-xs" style={{ color: '#B0A090', direction: 'rtl', fontFamily: 'Inter, sans-serif' }}>{s.ar}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ Animated photo strips ══ */}
        <div className="pb-6 reveal" style={{ transitionDelay: '100ms' }}>
          {/* Header label */}
          <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-6 flex items-center gap-4">
            <span className="w-8 h-px bg-gold flex-shrink-0" />
            <span className="text-[0.65rem] font-medium tracking-[0.3em] uppercase text-gold">
              Our Delivery Gallery
            </span>
            <span className="flex-1 h-px bg-sand-200" />
            <span
              className="text-xs"
              style={{ color: '#6E6E73', direction: 'rtl', fontFamily: 'Inter, sans-serif' }}
            >
              من معرضنا إلى منزلك
            </span>
          </div>

          {/* Strip 1 — left to right */}
          <div className="mb-4">
            <InfiniteTrack photos={displayPhotos} direction={1} speed={28} onPhotoClick={openLightbox} />
          </div>

          {/* Strip 2 — right to left (reversed set for variety) */}
          <div>
            <InfiniteTrack
              photos={[...displayPhotos].reverse()}
              direction={-1}
              speed={22}
              onPhotoClick={(i) => openLightbox(displayPhotos.length - 1 - i)}
            />
          </div>
        </div>

        {/* ══ Feature cards ══ */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-24 lg:pb-32">
          <div className="text-center mb-12 reveal">
            <h3
              className="mt-3 text-2xl lg:text-3xl text-charcoal"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Thoughtfully designed service at every step.
            </h3>
            <p
              className="mt-2 text-xl lg:text-xl text-sm"
              style={{ color: '#6E6E73', direction: 'rtl', fontFamily: 'Inter, sans-serif' }}
            >
              خدمات مصممة لراحة أكبر في كل مرحلة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="reveal group cursor-default"
                style={{ transitionDelay: `${i * 70}ms` }}
                onMouseEnter={() => setActiveFeature(i)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                {/* Card */}
                <div
                  className="relative overflow-hidden h-full transition-all duration-500"
                  style={{
                    padding: '28px',
                    background: activeFeature === i
                      ? 'linear-gradient(135deg, #1C1C1E 0%, #2A2018 100%)'
                      : 'white',
                    border: '1px solid',
                    borderColor: activeFeature === i ? 'rgba(201,169,110,0.4)' : 'rgba(240,233,220,0.8)',
                    transform: activeFeature === i ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: activeFeature === i
                      ? '0 20px 50px rgba(28,28,30,0.18)'
                      : '0 2px 16px rgba(28,28,30,0.06)',
                  }}
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute top-0 left-0 w-0.5 transition-all duration-500"
                    style={{
                      height: activeFeature === i ? '100%' : '0%',
                      background: 'linear-gradient(to bottom, #C9A96E, #A07840)',
                    }}
                  />

                  {/* Icon + stat row */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 flex items-center justify-center transition-all duration-400"
                      style={{
                        background: activeFeature === i
                          ? 'rgba(201,169,110,0.2)'
                          : 'rgba(240,233,220,0.6)',
                        color: '#C9A96E',
                      }}
                    >
                      {f.icon}
                    </div>
                    <div className="text-right">
                      <p
                        className="text-xl font-light leading-none"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          color: '#C9A96E',
                        }}
                      >
                        {f.stat}
                      </p>
                      <p
                        className="text-[9px] tracking-[0.15em] uppercase mt-0.5"
                        style={{ color: activeFeature === i ? 'rgba(250,248,245,0.4)' : '#6E6E73' }}
                      >
                        {f.statLabel}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="mb-4 transition-all duration-400"
                    style={{
                      height: '1px',
                      background: activeFeature === i
                        ? 'rgba(201,169,110,0.3)'
                        : 'rgba(240,233,220,1)',
                    }}
                  />

                  {/* Text */}
                  <h4
                    className="text-base font-medium mb-1 transition-colors duration-400"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: activeFeature === i ? '#FAF8F5' : '#1C1C1E',
                    }}
                  >
                    {f.title}
                  </h4>
                  <p
                    className="text-[11px] mb-3 transition-colors duration-400"
                    style={{ color: '#C9A96E', direction: 'rtl', fontFamily: 'Inter, sans-serif' }}
                  >
                    {f.arabic}
                  </p>
                  <p
                    className="text-sm leading-relaxed transition-colors duration-400"
                    style={{ color: activeFeature === i ? 'rgba(250,248,245,0.65)' : '#6E6E73' }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── CTA strip ── */}
          <div
            className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-10 reveal"
            style={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #2A2018 100%)' }}
          >
            <div className="text-center sm:text-left">
              <p
                className="text-2xl lg:text-3xl mb-1 text-center sm:text-left"
                style={{ fontFamily: "'Playfair Display', serif", color: '#FAF8F5' }}
              >
                Ready to schedule your delivery?
              </p>
              <p
                className="text-sm text-center sm:text-left"
                style={{ color: 'rgba(250,248,245,0.45)', direction: 'rtl', fontFamily: 'Inter, sans-serif' }}
                dir="rtl"
              >
                تواصل معنا لتحديد موعد التسليم المناسب لك
              </p>
            </div>
            <a
              href="https://wa.me/201270044175"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-3 px-8 py-3.5 text-xs font-medium tracking-[0.15em] uppercase no-underline transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #C9A96E, #A07840)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(201,169,110,0.4)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Schedule Delivery
            </a>
          </div>
        </div>
      </section>

      {/* ══ Delivery Photos Lightbox ══ */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center animate-fadeIn"
          style={{ background: 'rgba(14,12,10,0.96)', backdropFilter: 'blur(10px)' }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-5 right-5 z-10 w-11 h-11 flex items-center justify-center rounded-full text-white transition-colors duration-200"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div
            className="absolute top-5 left-5 z-10 text-xs px-3 py-1.5"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}
          >
            {lightboxIndex + 1} / {displayPhotos.length}
          </div>

          {/* Prev arrow */}
          <button
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full text-white transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.3)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Image */}
          <img
            src={displayPhotos[lightboxIndex]?.src || displayPhotos[lightboxIndex]}
            alt={displayPhotos[lightboxIndex]?.label || `Delivery ${lightboxIndex + 1}`}
            className="max-w-[85vw] max-h-[85vh] object-contain shadow-2xl animate-fadeIn"
            style={{ border: '1px solid rgba(201,169,110,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next arrow */}
          <button
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full text-white transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.3)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Gold progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${((lightboxIndex + 1) / displayPhotos.length) * 100}%`, background: 'linear-gradient(90deg, #C9A96E, #A07840)' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
