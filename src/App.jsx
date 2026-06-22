import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import ProductGrid from './components/sections/ProductGrid';
import Deliveries from './components/sections/Deliveries';
import Testimonials from './components/sections/Testimonials';
import SaleBanner from './components/ui/SaleBanner';
import AdminPage from './components/admin/AdminPage';
import { useScrollReveal } from './hooks/useScrollReveal';
import { SaleBannerProvider } from './context/SaleBannerContext';
import { useAnalyticsTracker } from './hooks/useAnalyticsTracker';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Initialize analytics tracking (only when not on /admin)
  useAnalyticsTracker(currentPath !== '/admin');

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useScrollReveal('.reveal');
  useScrollReveal('.reveal-left');
  useScrollReveal('.reveal-right');
  useScrollReveal('.reveal-scale');

  if (currentPath === '/admin') {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* ── Fixed top announcement strip (shows only when sale is active) ── */}
      <SaleBanner />

      <Navbar />

      <main>
        <Hero />
        <ProductGrid />
        <About />
        <Deliveries />
        <Testimonials />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/201270044175"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 90,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
          animation: 'waPulse 2.5s infinite',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          textDecoration: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.12)';
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.65)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.45)';
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <style>{`
        @keyframes waPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.45); }
          50% { box-shadow: 0 4px 32px rgba(37,211,102,0.75), 0 0 0 8px rgba(37,211,102,0.12); }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <SaleBannerProvider>
      <AppContent />
    </SaleBannerProvider>
  );
}

export default App;
