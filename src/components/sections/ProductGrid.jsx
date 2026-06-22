import { useState, useMemo, useRef, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useFilter } from '../../hooks/useFilter';
import CategoryBar from './CategoryBar';
import ProductCard from '../products/ProductCard';
import ProductModal from '../products/ProductModal';
import { useSaleBannerContext } from '../../context/SaleBannerContext';
import { useAnalyticsTracker } from '../../hooks/useAnalyticsTracker';

export default function ProductGrid() {
  const { products, loading, error } = useProducts();
  const { filtered, activeCategory, setActiveCategory } = useFilter(products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { trackProductClick } = useAnalyticsTracker({ trackPageView: false });

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    if (product) {
      trackProductClick(product.name);
    }
  };
  const [visibleCount, setVisibleCount] = useState(6);
  const [galleryLightbox, setGalleryLightbox] = useState(null);
  const gridRef = useRef(null);
  const { banner: saleBanner } = useSaleBannerContext();

  const productCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => { counts[p.category] = (counts[p.category] ?? 0) + 1; });
    return counts;
  }, [products]);

  // Listen for category changes fired from Navbar dropdown
  useEffect(() => {
    const handler = (e) => {
      setActiveCategory(e.detail);
      setVisibleCount(6);
    };
    window.addEventListener('madera:set-category', handler);
    return () => window.removeEventListener('madera:set-category', handler);
  }, [setActiveCategory]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  // Check if current category is a "Gallery" category
  const isGalleryCategory = ['kitchen', 'dressing', 'tables', 'deliveries'].includes(activeCategory);

  // Gather all images from all products in the active gallery category
  const galleryImages = useMemo(() => {
    if (!isGalleryCategory) return [];
    return filtered.flatMap(product => product.images || []);
  }, [filtered, isGalleryCategory]);

  // Gallery lightbox helpers
  const visibleGallery = galleryImages.slice(0, visibleCount * 3);
  const openGalleryLightbox = (i) => setGalleryLightbox(i);
  const closeGalleryLightbox = () => setGalleryLightbox(null);
  const galleryPrev = () => setGalleryLightbox(i => (i === 0 ? visibleGallery.length - 1 : i - 1));
  const galleryNext = () => setGalleryLightbox(i => (i === visibleGallery.length - 1 ? 0 : i + 1));

  // Keyboard nav for gallery lightbox
  useEffect(() => {
    if (galleryLightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') galleryPrev();
      if (e.key === 'ArrowRight') galleryNext();
      if (e.key === 'Escape') closeGalleryLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [galleryLightbox]);

  return (
    <section
      id="collections"
      ref={gridRef}
      className="py-24 lg:py-32 relative"
      style={{ background: 'white' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 reveal">
          <div>
            <span className="section-eyebrow">Our Collections</span>
            <h2
              className="mt-4 text-4xl lg:text-5xl text-charcoal leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Designed for
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
                Discerning Homes
              </em>
            </h2>
          </div>
          <p
            className="text-sm leading-relaxed max-w-xs lg:text-right"
            style={{ color: '#6E6E73' }}
          >
            Every piece is available for bespoke customisation — dimensions, finishes, and upholstery choices are all at your disposal.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-10 reveal">
          <CategoryBar
            active={activeCategory}
            onChange={setActiveCategory}
            productCounts={productCounts}
          />
        </div>

        {/* Thin gold divider */}
        <div
          className="mb-12 h-px"
          style={{ background: 'linear-gradient(90deg, #C9A96E, rgba(201,169,110,0.1))' }}
        />

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-product skeleton mb-4" />
                <div className="h-2.5 skeleton rounded w-1/3 mb-3" />
                <div className="h-5 skeleton rounded w-2/3 mb-2" />
                <div className="h-9 skeleton rounded mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-24">
            <p
              className="text-2xl text-charcoal-muted mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Unable to load products
            </p>
            <p className="text-sm text-charcoal-muted">{error}</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {filtered.length > 0 ? (
              isGalleryCategory ? (
                /* ─── GALLERY LAYOUT (for Kitchens & Dressing Rooms) ─── */
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                  {galleryImages.slice(0, visibleCount * 3).map((src, i) => (
                    <div
                      key={i}
                      className="break-inside-avoid relative group overflow-hidden opacity-0 animate-fadeInUp cursor-pointer"
                      style={{ animationDelay: `${(i % 6) * 50}ms`, animationFillMode: 'forwards' }}
                      onClick={() => openGalleryLightbox(i)}
                    >
                      <img
                        src={src}
                        alt="Gallery showcase"
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        style={{ border: '1px solid rgba(201,169,110,0.1)' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(28,28,30,0.4)' }}>
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ─── NORMAL PRODUCT GRID ─── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visible.map((product, i) => (
                    <div
                      key={product.id}
                      className="opacity-0 animate-fadeInUp"
                      style={{ animationDelay: `${(i % 6) * 70}ms`, animationFillMode: 'forwards' }}
                    >
                      <ProductCard product={product} onSelect={handleSelectProduct} globalSale={saleBanner} />
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-24">
                <p
                  className="text-2xl text-charcoal-muted mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {isGalleryCategory ? 'Coming Soon' : 'No pieces found'}
                </p>
                <p className="text-sm text-charcoal-muted">
                  {isGalleryCategory
                    ? 'Our exclusive gallery is currently being curated. Please check back later.'
                    : 'Check back soon — we\'re adding new items to this collection.'}
                </p>
              </div>
            )}

            {/* Load more */}
            {((isGalleryCategory && galleryImages.length > visibleCount * 3) || (!isGalleryCategory && hasMore)) && (
              <div className="text-center mt-16">
                <p className="text-sm text-charcoal-muted mb-6">
                  {isGalleryCategory ? (
                    <>Showing <span style={{ color: '#C9A96E', fontWeight: 600 }}>{Math.min(galleryImages.length, visibleCount * 3)}</span> of <span style={{ color: '#C9A96E', fontWeight: 600 }}>{galleryImages.length}</span> photos</>
                  ) : (
                    <>Showing <span style={{ color: '#C9A96E', fontWeight: 600 }}>{visible.length}</span> of <span style={{ color: '#C9A96E', fontWeight: 600 }}>{filtered.length}</span> pieces</>
                  )}
                </p>
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="inline-flex items-center gap-2 px-10 py-3.5 text-xs font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    border: '1px solid rgba(201,169,110,0.5)',
                    color: '#C9A96E',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#C9A96E,#A07840)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'transparent'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A96E'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; }}
                >
                  <span>View More</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </button>
              </div>
            )}

            {/* End of list */}
            {((isGalleryCategory && galleryImages.length <= visibleCount * 3 && galleryImages.length > 0) || (!isGalleryCategory && !hasMore && filtered.length > 0)) && (
              <div className="text-center mt-16 flex items-center justify-center gap-4">
                <span className="h-px w-16 bg-sand-200" />
                <p className="text-xs text-charcoal-muted tracking-wider uppercase">
                  {isGalleryCategory ? `All ${galleryImages.length} photos displayed` : `All ${filtered.length} pieces displayed`}
                </p>
                <span className="h-px w-16 bg-sand-200" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Gallery Lightbox with navigation */}
      {galleryLightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center animate-fadeIn"
          style={{ background: 'rgba(14,12,10,0.96)', backdropFilter: 'blur(10px)' }}
          onClick={closeGalleryLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 z-10 w-11 h-11 flex items-center justify-center rounded-full text-white transition-colors duration-200"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            onClick={(e) => { e.stopPropagation(); closeGalleryLightbox(); }}
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
            {galleryLightbox + 1} / {visibleGallery.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full text-white transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            onClick={(e) => { e.stopPropagation(); galleryPrev(); }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.3)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Image */}
          <img
            src={visibleGallery[galleryLightbox]}
            alt={`Gallery ${galleryLightbox + 1}`}
            className="max-w-[85vw] max-h-[85vh] object-contain shadow-2xl animate-fadeIn"
            style={{ border: '1px solid rgba(201,169,110,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full text-white transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            onClick={(e) => { e.stopPropagation(); galleryNext(); }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.3)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${((galleryLightbox + 1) / visibleGallery.length) * 100}%`, background: 'linear-gradient(90deg, #C9A96E, #A07840)' }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
