import { useEffect, useState } from 'react';
import { useSaleBannerContext } from '../../context/SaleBannerContext';

/**
 * SaleBanner — Fixed full-width announcement strip at the very top of the page.
 * Shown only when enabled = true in Supabase site_settings.
 * No dismiss button — stays until sale is disabled from Supabase.
 */
export default function SaleBanner() {
  const { banner, isVisible, BANNER_H } = useSaleBannerContext();
  const [timeLeft, setTimeLeft] = useState(null);

  // Countdown timer
  useEffect(() => {
    if (!banner?.end_time) { setTimeLeft(null); return; }
    const calc = () => {
      const diff = new Date(banner.end_time) - new Date();
      if (diff <= 0) { setTimeLeft(null); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ d, h, m, s });
    };
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, [banner?.end_time]);

  if (!isVisible) return null;

  const discount = banner.discount ?? '';
  const titleEn  = banner.title_en  ?? 'Special Offer';
  const subAr    = banner.subtitle_ar ?? banner.title_ar ?? '';
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div
      className="fixed left-0 right-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{
        top: 0,
        height: `${BANNER_H}px`,
        background: 'linear-gradient(90deg, #1a0a0a 0%, #2C0B0B 40%, #1C0F05 70%, #1a0a0a 100%)',
        borderBottom: '1px solid rgba(192,57,43,0.4)',
      }}
    >
      {/* Shimmer line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{
          background: 'linear-gradient(90deg, transparent, #C9A96E, #E74C3C, #C9A96E, transparent)',
          backgroundSize: '300% 100%',
          animation: 'bannerShimmer 3s linear infinite',
        }}
      />

      {/* Content row — fully responsive, centered, bigger and bolder */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-4 md:gap-5 px-2 sm:px-6 w-full max-w-full overflow-hidden">

        {/* Fire icon — hidden on extra small mobile screens to save space */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 hidden xs:block">
          <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z" />
        </svg>

        {/* Discount pill — scaled padding and fonts for mobile */}
        {discount && (
          <span
            className="flex-shrink-0 font-black tracking-[0.12em] uppercase px-2 py-0.5 sm:px-4 sm:py-1 text-[11px] sm:text-[13px]"
            style={{
              background: 'linear-gradient(135deg, #C0392B, #922B21)',
              color: 'white',
              boxShadow: '0 0 16px rgba(192,57,43,0.55)',
              letterSpacing: '0.1em',
            }}
          >
            {discount} OFF
          </span>
        )}

        {/* Separator dot */}
        <span className="w-1 h-1 rounded-full bg-white/25 hidden sm:block" />

        {/* English title — hidden on mobile to give room to the countdown */}
        <p
          className="font-semibold tracking-wide hidden sm:block flex-shrink-0"
          style={{ color: '#FAF8F5', fontSize: '13px', letterSpacing: '0.06em' }}
        >
          {titleEn}
        </p>

        {/* Arabic subtitle — hidden on mobile/tablet */}
        {subAr && (
          <>
            <span className="w-px h-4 bg-white/15 hidden md:block" />
            <p
              className="hidden md:block flex-shrink-0"
              style={{
                color: 'rgba(250,248,245,0.5)',
                fontFamily: 'Inter, sans-serif',
                direction: 'rtl',
                fontSize: '12px',
              }}
            >
              {subAr}
            </p>
          </>
        )}

        {/* Countdown — compact boxes on mobile, full-size on desktop */}
        {timeLeft && (
          <>
            <span className="w-px h-4 bg-white/15" />
            <div className="flex items-center gap-0.5 sm:gap-1 tabular-nums flex-shrink-0">
              {[
                { val: pad(timeLeft.d), label: 'd' },
                { val: pad(timeLeft.h), label: 'h' },
                { val: pad(timeLeft.m), label: 'm' },
                { val: pad(timeLeft.s), label: 's' }
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-0.5">
                  <span
                    className="font-bold px-1 py-0.5 sm:px-2 flex items-baseline gap-0.5 justify-center text-xs sm:text-[15px] min-w-[28px] sm:min-w-[36px]"
                    style={{
                      background: 'rgba(0,0,0,0.45)',
                      color: '#C9A96E',
                      border: '1px solid rgba(201,169,110,0.25)',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {item.val}
                    <span className="text-[8px] sm:text-[9px] text-white/40 font-sans font-normal uppercase">{item.label}</span>
                  </span>
                  {i < 3 && <span className="text-xs sm:text-sm font-bold text-[#C9A96E]/50">:</span>}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Shop Now CTA — smaller tracking and padding on mobile */}
        <a
          href="#collections"
          className="flex-shrink-0 font-semibold uppercase px-2.5 py-1 sm:px-5 sm:py-1.5 no-underline transition-all duration-300 hover:brightness-110 hover:-translate-y-px text-[10px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.18em]"
          style={{
            background: 'linear-gradient(135deg, #C9A96E, #A07840)',
            color: 'white',
          }}
        >
          Shop Now
        </a>
      </div>

      <style>{`
        @keyframes bannerShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
