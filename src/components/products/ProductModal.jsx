import { useEffect, useRef } from 'react';
import ImageGallery from '../ui/ImageGallery';
import { CATEGORY_LABELS, getProductImages } from '../../data/productData';

/**
 * ProductModal — full-screen lightbox with image gallery and product details.
 *
 * Props:
 *   product  — the selected product object (or null to hide)
 *   onClose  — function to close the modal
 */
export default function ProductModal({ product, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!product) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  useEffect(() => {
    if (product && modalRef.current) modalRef.current.focus();
  }, [product]);

  if (!product) return null;

  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;
  const images = getProductImages(product);
  const waMessage = encodeURIComponent(`مرحبًا، أنا مهتم بـ ${product.name}. هل يمكنكم تزويدي بمزيد من المعلومات؟`);
  const waHref = `https://wa.me/201270044175?text=${waMessage}`;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-name"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm animate-fadeIn"
        style={{ background: 'rgba(28,28,30,0.80)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full h-full sm:h-[90vh] sm:rounded-xl max-w-5xl grid grid-cols-1 grid-rows-[45vh_1fr] lg:grid-cols-2 lg:grid-rows-none overflow-hidden outline-none animate-scaleIn"
        style={{
          background: '#FAF8F5',
          boxShadow: '0 30px 100px rgba(28,28,30,0.40)',
        }}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 shadow-lg"
          style={{
            background: '#1C1C1E',
            color: '#FAF8F5',
            border: '2px solid rgba(201,169,110,0.5)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.background = '#2A2018'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; e.currentTarget.style.background = '#1C1C1E'; }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>



        {/* ── Left — Image Gallery ── */}
        <div className="h-full bg-sand-100 p-2 sm:p-3 flex flex-col relative z-10 min-h-0">
          <ImageGallery images={images} alt={product.name} />
        </div>

        {/* ── Right — Product Details ── */}
        <div className="flex flex-col h-full min-h-0">

          {/* Top dark header band (desktop only) */}
          <div
            className="hidden lg:block px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #2A2018 100%)' }}
          >
            <p
              className="text-[0.65rem] font-medium tracking-[0.3em] uppercase mb-3"
              style={{ color: '#C9A96E' }}
            >
              {categoryLabel}
            </p>
            <h2
              id="modal-product-name"
              className="text-2xl lg:text-3xl leading-tight mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#FAF8F5',
              }}
            >
              {product.name}
            </h2>
            <div
              className="w-10 h-px mb-1"
              style={{ background: 'linear-gradient(90deg, #C9A96E, #A07840)' }}
            />
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-5 sm:px-8 py-6 flex flex-col gap-6">

            {/* Mobile dark header band (visible only on mobile/tablet) */}
            <div
              className="lg:hidden px-4 pt-3 pb-2.5 -mx-5 -mt-6 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #2A2018 100%)' }}
            >
              <p
                className="text-[0.5rem] font-medium tracking-[0.2em] uppercase mb-0.5"
                style={{ color: '#C9A96E' }}
              >
                {categoryLabel}
              </p>
              <h2
                className="text-base font-semibold leading-tight mb-1"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#FAF8F5',
                }}
              >
                {product.name}
              </h2>
              <div
                className="w-6 h-px"
                style={{ background: 'linear-gradient(90deg, #C9A96E, #A07840)' }}
              />
            </div>

            {/* Structured Details */}
            <div
              className="flex flex-col gap-6"
              dir="rtl"
              style={{
                fontFamily: 'Inter, sans-serif',
                direction: 'rtl',
                borderRight: '2px solid rgba(201,169,110,0.3)',
                paddingRight: '12px',
              }}
            >


              {/* Components */}
              {product.components && (
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-semibold flex items-center gap-2" style={{ color: '#1C1C1E' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    المكونات
                  </h4>
                  <div className="text-sm leading-loose flex flex-col gap-1" style={{ color: '#6E6E73' }}>
                    {String(product.components).split(/\\n|\r\n|\n/).map((line, i) => (
                      <p key={i}>• {line.trim()}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {product.materials && (
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-semibold flex items-center gap-2" style={{ color: '#1C1C1E' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    الخامات المستخدمة
                  </h4>
                  <div className="text-sm leading-loose flex flex-col gap-1" style={{ color: '#6E6E73' }}>
                    {String(product.materials).split(/\\n|\r\n|\n/).map((line, i) => (
                      <p key={i}>• {line.trim()}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Dimensions */}
              {product.dimensions && (
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-semibold flex items-center gap-2" style={{ color: '#1C1C1E' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2">
                      <path d="M4 10h16M4 14h16M4 18h16M4 6h16" />
                      <line x1="8" y1="2" x2="8" y2="22" />
                    </svg>
                    المقاسات
                  </h4>
                  <div className="text-sm leading-loose flex flex-col gap-1" dir="ltr" style={{ color: '#6E6E73', textAlign: 'right' }}>
                    {String(product.dimensions).split(/\\n|\r\n|\n/).map((line, i) => (
                      <p key={i}>{line.trim()} •</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Image count */}
            {images.length > 1 && (
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs"
                  style={{
                    background: 'rgba(201,169,110,0.1)',
                    border: '1px solid rgba(201,169,110,0.25)',
                    color: '#C9A96E',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="font-medium">{images.length} photos</span>
                </div>
                <span
                  className="text-xs"
                  dir="rtl"
                  style={{ color: '#B0A090', fontFamily: 'Inter, sans-serif', direction: 'rtl' }}
                >
                  متاحة في المعرض
                </span>
              </div>
            )}

            {/* Details grid */}
            <dl
              className="grid grid-cols-3 gap-0 text-sm"
              style={{ border: '1px solid rgba(240,233,220,1)' }}
            >
              {[
                { dt: 'Collection', dd: categoryLabel },
                { dt: 'Origin', dd: 'Handcrafted' },
                { dt: 'Finish', dd: 'Made to Order' },
              ].map(({ dt, dd }, i) => (
                <div
                  key={dt}
                  className="px-4 py-4 text-center"
                  style={{ borderLeft: i > 0 ? '1px solid rgba(240,233,220,1)' : 'none' }}
                >
                  <dt
                    className="text-[9px] tracking-[0.2em] uppercase mb-1"
                    style={{ color: '#B0A090' }}
                  >
                    {dt}
                  </dt>
                  <dd
                    className="text-sm font-medium"
                    style={{ color: '#1C1C1E', fontFamily: "'Playfair Display', serif" }}
                  >
                    {dd}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Guarantee badge */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: 'rgba(201,169,110,0.06)',
                border: '1px solid rgba(201,169,110,0.15)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <div>
                <p className="text-xs font-medium" style={{ color: '#1C1C1E' }}>5-Year Quality Guarantee</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#B0A090', direction: 'rtl', fontFamily: 'Inter, sans-serif' }}>
                  ضمان الجودة لمدة ٥ سنوات
                </p>
              </div>
            </div>
          </div>

          {/* ── CTAs ── */}
          <div
            className="flex-shrink-0 px-8 py-6 flex flex-col gap-3"
            style={{ borderTop: '1px solid rgba(240,233,220,1)' }}
          >
            <a
              href={waHref}
              id={`enquire-${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 text-xs font-medium tracking-[0.15em] uppercase no-underline transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #C9A96E, #A07840)',
                color: 'white',
                boxShadow: '0 4px 16px rgba(201,169,110,0.35)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enquire Now via WhatsApp
            </a>
            <button
              onClick={onClose}
              className="w-full py-3.5 text-xs font-medium tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                border: '1px solid rgba(201,169,110,0.35)',
                color: '#C9A96E',
                background: 'transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
