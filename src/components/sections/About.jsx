import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

const pillars = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        <path d="M12 6v6l4 2" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      </svg>
    ),
    title: 'Sustainably Sourced',
    arabicTitle: 'مواد مستدامة',
    body: 'Every Madera Home piece begins its journey in responsibly managed forests certified by the Forest Stewardship Council.',
    arabicBody: 'كل قطعة تبدأ رحلتها من غابات مُدارة بمسؤولية، نحرص على الاستدامة في كل خطوة.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    title: 'Master Craftsmanship',
    arabicTitle: 'حرفية عالية',
    body: 'Our artisans bring decades of inherited tradition to every joint, every finish, every upholstered curve.',
    arabicBody: 'حرفيونا يجلبون عقوداً من التقاليد الموروثة لكل وصلة، كل تشطيب، كل منحنى.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Designed to Last',
    arabicTitle: 'مصمم ليدوم',
    body: 'We engineer furniture for the long arc of life. Our structural joints are tested to 50,000 cycles. Our fabrics carry a 5-year guarantee.',
    arabicBody: 'نصمم الأثاث ليكون إرثاً لأجيال. كل قطعة مضمونة لمدة ٥ سنوات.',
  },
];

export default function About() {
  const sectionRef = useRef(null);
  const DEFAULT_IMAGE = '/images/Dining-room/657379172_17981321480992149_2788591344507940968_n.jpg';
  const BUCKET = 'products-images';
  const STORAGE_BASE = `https://zahhrknatspivrpsovuj.supabase.co/storage/v1/object/public/${BUCKET}`;
  const [aboutImages, setAboutImages] = useState([DEFAULT_IMAGE]);
  const [imgIndex, setImgIndex]       = useState(0);

  useEffect(() => {
    async function loadImages() {
      // 1️⃣ Try: product with show_in_about = true
      const { data: product } = await supabase
        .from('products')
        .select('folder_path')
        .eq('show_in_about', true)
        .order('sort_order', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (product?.folder_path) {
        const { data: files } = await supabase.storage
          .from(BUCKET)
          .list(product.folder_path, { sortBy: { column: 'name', order: 'asc' } });

        const sorted = (files ?? [])
          .filter((f) => f.name && !f.name.startsWith('.'))
          .sort((a, b) => {
            const aIsCover = a.name.toLowerCase().includes('cover') || a.name.toLowerCase().includes('main');
            const bIsCover = b.name.toLowerCase().includes('cover') || b.name.toLowerCase().includes('main');
            if (aIsCover && !bIsCover) return -1;
            if (!aIsCover && bIsCover) return 1;
            return a.name.localeCompare(b.name);
          });

        if (sorted.length > 0) {
          setAboutImages(sorted.map((f) => {
            const cacheBust = f.updated_at ? new Date(f.updated_at).getTime() : (f.created_at ? new Date(f.created_at).getTime() : '');
            return `${STORAGE_BASE}/${product.folder_path}/${f.name}${cacheBust ? `?t=${cacheBust}` : ''}`;
          }));
          setImgIndex(0);
          return;
        }
      }

      // 2️⃣ Fallback: site_settings about_image
      const { data: setting } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'about_image')
        .maybeSingle();

      if (setting?.value) {
        setAboutImages([setting.value]);
        return;
      }

      // 3️⃣ Final fallback
      setAboutImages([DEFAULT_IMAGE]);
    }

    loadImages();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle slideshow
  useEffect(() => {
    if (aboutImages.length < 2) return;
    const iv = setInterval(() => {
      setImgIndex((i) => (i + 1) % aboutImages.length);
    }, 3500);
    return () => clearInterval(iv);
  }, [aboutImages]);


  return (
    <section id="about" className="bg-ivory py-24 lg:py-32 overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="text-center mb-20 reveal">
          <span className="section-eyebrow">Who We Are</span>
          <h2
            className="mt-4 text-4xl lg:text-5xl text-charcoal"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Madera Home Story
          </h2>
          {/* Arabic subtitle */}
          <p
            className="mt-3 text-sm"
            style={{ color: '#6E6E73', direction: 'rtl', fontFamily: 'Inter, sans-serif' }}
          >
            قصة ماديرا هوم — حيث يصبح الخشب تحفة فنية
          </p>
          <div className="gold-divider mx-auto mt-6" />
        </div>

        {/* Two-column editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">

          {/* Left — Image slideshow */}
          <div className="relative reveal-left">
            {/* Responsive-height container */}
            <div
              className="relative overflow-hidden h-[320px] sm:h-[420px] lg:h-[520px]"
            >
              {/* ── Blurred background layer (like product modal) ── */}
              {aboutImages.map((src, i) => (
                <img
                  key={`bg-${src}`}
                  src={src}
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                  style={{
                    opacity: i === imgIndex ? 1 : 0,
                    filter: 'blur(18px)',
                    transform: 'scale(1.15)',
                    WebkitFilter: 'blur(18px)',
                  }}
                />
              ))}
              {/* Dark tint over the blur */}
              <div className="absolute inset-0 bg-black/40 z-[1]" />

              {/* ── Main image (full, no crop) ── */}
              {aboutImages.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt="Madera Home craftsmanship"
                  className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700 z-[2]"
                  style={{ opacity: i === imgIndex ? 1 : 0 }}
                  loading="lazy"
                />
              ))}
            </div>


            {/* Decorative pull quote card */}
            <div
              className="absolute -bottom-6 -right-2 sm:-right-6 p-4 sm:p-6 max-w-[200px] sm:max-w-[260px] z-20"
              style={{
                background: 'linear-gradient(135deg, #1C1C1E 0%, #2A2018 100%)',
                color: 'white',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
            >
              <p
                className="text-sm italic leading-relaxed"
                style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(250,248,245,0.8)' }}
              >
                "Furniture is not decoration. It is the architecture of daily life."
              </p>
              <div className="w-8 h-px bg-gold mt-4" />
              <p className="text-[10px] tracking-widest uppercase mt-3" style={{ color: 'rgba(250,248,245,0.35)' }}>
                — Our Philosophy
              </p>
            </div>

            {/* Frame accent */}
            <div
              className="absolute -top-4 -left-4 -z-10 w-full h-full"
              style={{ border: '1px solid rgba(201,169,110,0.25)' }}
            />
          </div>

          {/* Right — Text */}
          <div>
            <div className="reveal mb-8">
              <p className="text-charcoal-muted text-lg leading-relaxed mb-6">
                At Madera Home, we believe furniture should do more than fill a space — it should reflect the way you live.
                With over 15 years of manufacturing experience, we create modern furniture that combines quality craftsmanship, thoughtful details, and everyday comfort. From bedrooms and dining rooms to living spaces and kitchens, every piece is made with care in our Cairo factory.

              </p>
              {/* Arabic paragraph */}
              <p
                className="text-base leading-loose mb-6 p-4"
                dir="rtl"
                style={{
                  color: '#6E6E73',
                  fontFamily: 'Inter, sans-serif',
                  direction: 'rtl',
                  background: 'rgba(240,233,220,0.4)',
                  borderRight: '3px solid #C9A96E',
                  lineHeight: '1.9',
                }}
              >
                في ماديرا هوم نؤمن أن الأثاث لا يملأ المساحة فقط، بل يعكس أسلوب حياتك.
                بخبرة تتجاوز 15 سنوات في التصنيع، نقدم أثاثًا عصريًا يجمع بين الجودة، الراحة، ودقة التفاصيل. من غرف النوم والسفرة إلى المعيشة والمطابخ، كل قطعة تُصنع بعناية داخل مصنعنا في القاهرة.
                كما نوفر إمكانية التنفيذ حسب الطلب، مع اختيار التصميم والمقاسات والخامات والتشطيبات بما يناسب منزلك
              </p>
              <p className="text-charcoal-muted leading-relaxed">
                We also offer custom-made solutions, allowing you to choose the design, size, materials, and finishes that fit your home perfectly.
              </p>
            </div>
            <div className="reveal flex flex-wrap gap-4">
              <a
                href="#collections"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:-translate-y-0.5 no-underline"
                style={{
                  background: 'linear-gradient(135deg, #C9A96E, #A07840)',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(201,169,110,0.35)',
                }}
              >
                Explore the Collection
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="https://wa.me/201270044175"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:-translate-y-0.5 no-underline"
                style={{
                  border: '1px solid rgba(201,169,110,0.5)',
                  color: '#C9A96E',
                  background: 'transparent',
                }}
              >
                Book Consultation
              </a>
            </div>
          </div>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16" style={{ borderTop: '1px solid rgba(240,233,220,1)' }}>
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="reveal flex flex-col gap-4 p-6 transition-all duration-500 hover:-translate-y-1"
              style={{
                transitionDelay: `${i * 100}ms`,
                background: 'linear-gradient(135deg, rgba(249,245,238,0.5) 0%, rgba(240,233,220,0.3) 100%)',
                border: '1px solid rgba(201,169,110,0.1)',
              }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center"
                style={{
                  border: '1px solid rgba(201,169,110,0.3)',
                  color: '#C9A96E',
                  background: 'rgba(201,169,110,0.06)',
                }}
              >
                {pillar.icon}
              </div>
              <div className="gold-divider" />
              <h3
                className="text-xl text-charcoal"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {pillar.title}
              </h3>
              <p className="text-sm text-charcoal-muted leading-relaxed">{pillar.body}</p>
              {/* Arabic body */}
              <p
                className="text-xs leading-relaxed pt-3"
                dir="rtl"
                style={{
                  color: '#6E6E73',
                  fontFamily: 'Inter, sans-serif',
                  borderTop: '1px solid rgba(201,169,110,0.12)',
                }}
              >
                {pillar.arabicBody}
              </p>
            </div>
          ))}
        </div>

        {/* Brand promise strip */}
        <div
          className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-10 reveal"
          style={{
            background: 'linear-gradient(135deg, #1C1C1E 0%, #2A2018 100%)',
          }}
        >
          <div className="text-center sm:text-left">
            <p
              className="text-2xl lg:text-3xl text-center sm:text-left"
              style={{ fontFamily: "'Playfair Display', serif", color: '#FAF8F5' }}
            >
              Ready to furnish your space?
            </p>
            <p className="text-sm mt-2 text-center sm:text-left" style={{ color: 'rgba(250,248,245,0.45)' }}>
              Every piece is made to order. Lead time: 4–6 weeks.
            </p>
            <p
              className="text-xs mt-1 text-center sm:text-left"
              dir="rtl"
              style={{ color: 'rgba(250,248,245,0.35)', fontFamily: 'Inter, sans-serif', direction: 'rtl' }}
            >
              كل قطعة تُصنع بطلب. وقت التصنيع: ٤-٦ أسابيع.
            </p>
          </div>
          <a
            href="https://wa.me/201270044175"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-3 px-8 py-3.5 text-xs font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:-translate-y-0.5 no-underline"
            style={{
              background: 'linear-gradient(135deg, #C9A96E, #A07840)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(201,169,110,0.35)',
            }}
          >
            Book a Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
