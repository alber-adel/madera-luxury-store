import { useState, useEffect, useRef } from 'react';
import { useSaleBannerContext } from '../../context/SaleBannerContext';
import { CATEGORIES } from '../../data/productData';

const LOGO = '/images/logo/458133892_993241112812845_8070458048125201396_n.jpg';

// Sub-categories shown in the Collections dropdown (exclude 'all')
const COLLECTION_ITEMS = CATEGORIES.filter((c) => c.id !== 'all');

const navLinks = [
  { label: 'Home',        href: '#home' },
  { label: 'Collections', href: '#collections', hasDropdown: true },
  { label: 'Deliveries',  href: '#deliveries' },
  { label: 'About',       href: '#about' },
  { label: 'Reviews',     href: '#testimonials' },
  { label: 'Contact',     href: '#contact' },
];

/** Fires a custom event that ProductGrid listens to */
function navigateToCategory(categoryId) {
  window.dispatchEvent(
    new CustomEvent('madera:set-category', { detail: categoryId })
  );
  // Small delay so the event is processed before scroll
  setTimeout(() => {
    const el = document.getElementById('collections');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isVisible, BANNER_H } = useSaleBannerContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace('#', ''));
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-[100] transition-all duration-500
          ${scrolled
            ? 'bg-ivory/96 backdrop-blur-md shadow-[0_1px_24px_rgba(28,28,30,0.10)]'
            : 'bg-transparent'
          }`}
        style={{ top: isVisible ? `${BANNER_H}px` : '0px' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <a href="#home" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="relative">
                <img
                  src={LOGO}
                  alt="Madera Home"
                  className="h-10 w-10 object-cover rounded-full border-2 transition-all duration-300 group-hover:scale-105"
                  style={{ borderColor: scrolled ? 'rgba(201,169,110,0.4)' : 'rgba(201,169,110,0.6)' }}
                />
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: '0 0 0 3px rgba(201,169,110,0.3)' }}
                />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-xl tracking-wide transition-colors duration-300"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: scrolled ? '#1C1C1E' : '#FAF8F5',
                  }}
                >
                  Madera
                </span>
                <span
                  className="text-[10px] tracking-[0.25em] uppercase font-medium transition-colors duration-300"
                  style={{ color: '#C9A96E' }}
                >
                  Home
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const id = link.href.replace('#', '');
                const isActive = activeSection === id;

                // Collections link with dropdown
                if (link.hasDropdown) {
                  return (
                    <div key={link.href} className="relative" ref={dropdownRef}>
                      <button
                        className="relative text-[0.8rem] tracking-wider transition-colors duration-300 py-1 flex items-center gap-1.5 group"
                        style={{
                          color: scrolled
                            ? (isActive ? '#C9A96E' : '#6E6E73')
                            : (isActive ? '#C9A96E' : 'rgba(250,248,245,0.7)'),
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#C9A96E'; }}
                        onMouseLeave={e => {
                          if (!isActive) e.currentTarget.style.color = scrolled ? '#6E6E73' : 'rgba(250,248,245,0.7)';
                        }}
                        onClick={() => setDropdownOpen((o) => !o)}
                      >
                        {link.label}
                        {/* Chevron */}
                        <svg
                          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                          style={{ transition: 'transform 0.3s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {/* Active indicator */}
                        <span
                          className="absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-400"
                          style={{ width: isActive ? '100%' : '0%' }}
                        />
                      </button>

                      {/* Dropdown panel */}
                      {dropdownOpen && (
                        <div
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 py-2 z-50 animate-fadeIn"
                          style={{
                            background: scrolled ? 'rgba(250,248,245,0.97)' : 'rgba(28,28,30,0.96)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(201,169,110,0.2)',
                            boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
                          }}
                        >
                          {/* Top gold line */}
                          <div className="h-px mx-4 mb-2" style={{ background: 'linear-gradient(90deg, #C9A96E, transparent)' }} />

                          {COLLECTION_ITEMS.map((cat) => (
                            <button
                              key={cat.id}
                              className="w-full text-left px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-all duration-200 flex items-center gap-3 group/item"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: scrolled ? '#6E6E73' : 'rgba(250,248,245,0.65)',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.color = '#C9A96E';
                                e.currentTarget.style.paddingLeft = '22px';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.color = scrolled ? '#6E6E73' : 'rgba(250,248,245,0.65)';
                                e.currentTarget.style.paddingLeft = '20px';
                              }}
                              onClick={() => {
                                setDropdownOpen(false);
                                navigateToCategory(cat.id);
                              }}
                            >
                              <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0 opacity-60" />
                              {cat.label}
                            </button>
                          ))}

                          {/* All Collections */}
                          <div className="h-px mx-4 mt-2 mb-2" style={{ background: 'rgba(201,169,110,0.15)' }} />
                          <button
                            className="w-full text-left px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-all duration-200"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#C9A96E',
                              fontWeight: 600,
                            }}
                            onClick={() => {
                              setDropdownOpen(false);
                              navigateToCategory('all');
                            }}
                          >
                            ✦ All Collections
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular nav link
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="relative text-[0.8rem] tracking-wider transition-colors duration-300 py-1 group"
                    style={{
                      color: scrolled
                        ? (isActive ? '#C9A96E' : '#6E6E73')
                        : (isActive ? '#C9A96E' : 'rgba(250,248,245,0.7)'),
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#C9A96E'; }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.color = scrolled ? '#6E6E73' : 'rgba(250,248,245,0.7)';
                      }
                    }}
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-400"
                      style={{ width: isActive ? '100%' : '0%' }}
                    />
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold/50 transition-all duration-300 group-hover:w-full" />
                  </a>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* WhatsApp CTA — desktop */}
              <a
                href="https://wa.me/201270044175"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] uppercase px-5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 no-underline"
                style={{
                  background: 'linear-gradient(135deg, #C9A96E, #A07840)',
                  color: 'white',
                  boxShadow: '0 2px 12px rgba(201,169,110,0.35)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>

              {/* Hamburger */}
              <button
                id="nav-hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                className="md:hidden flex flex-col gap-1.5 p-1 transition-colors duration-300"
                style={{ color: scrolled ? '#1C1C1E' : '#FAF8F5' }}
              >
                <span className={`block w-6 h-px bg-current transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
                <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0 -translate-x-2' : ''}`} />
                <span className={`block w-6 h-px bg-current transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {scrolled && (
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent)' }}
          />
        )}
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[150] transition-all duration-500 md:hidden
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{ background: 'rgba(28,28,30,0.4)' }}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 bottom-0 w-[78vw] max-w-sm flex flex-col
            transition-transform duration-500 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ background: '#FAF8F5' }}
        >
          {/* Mobile menu header */}
          <div
            className="flex items-center justify-between px-8 h-20"
            style={{ borderBottom: '1px solid rgba(28,28,30,0.08)' }}
          >
            <div className="flex flex-col leading-none">
              <span style={{ fontFamily: "'Playfair Display', serif", color: '#1C1C1E', fontSize: '1.1rem' }}>
                Madera
              </span>
              <span style={{ fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A96E' }}>
                Home
              </span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="transition-colors duration-300"
              style={{ color: 'rgba(28,28,30,0.6)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-0 px-0 pt-4 flex-1 overflow-y-auto">
            {navLinks.map((link, i) => (
              <div key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-8 py-4 text-sm font-medium tracking-wider transition-all duration-300"
                  style={{
                    color: activeSection === link.href.replace('#', '') ? '#C9A96E' : 'rgba(28,28,30,0.85)',
                    borderBottom: '1px solid rgba(28,28,30,0.05)',
                    transitionDelay: `${i * 40}ms`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C9A96E'; e.currentTarget.style.paddingLeft = '2.25rem'; }}
                  onMouseLeave={e => {
                    const isAct = activeSection === link.href.replace('#', '');
                    e.currentTarget.style.color = isAct ? '#C9A96E' : 'rgba(28,28,30,0.85)';
                    e.currentTarget.style.paddingLeft = '2rem';
                  }}
                >
                  {link.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>

                {/* Mobile sub-items for Collections */}
                {link.hasDropdown && (
                  <div style={{ background: 'rgba(201,169,110,0.06)' }}>
                    {COLLECTION_ITEMS.map((cat) => (
                      <button
                        key={cat.id}
                        className="w-full text-left px-12 py-3 text-[10px] tracking-[0.2em] uppercase transition-colors duration-200"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A07840', borderBottom: '1px solid rgba(28,28,30,0.05)' }}
                        onClick={() => {
                          setMenuOpen(false);
                          navigateToCategory(cat.id);
                        }}
                      >
                        · {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="px-8 py-8" style={{ borderTop: '1px solid rgba(28,28,30,0.08)' }}>
            <a
              href="https://wa.me/201270044175"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-3 w-full py-3.5 text-xs font-medium tracking-[0.15em] uppercase no-underline transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #C9A96E, #A07840)',
                color: 'white',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contact via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
