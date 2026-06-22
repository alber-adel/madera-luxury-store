/**
 * Badge — ribbon label on product cards.
 *
 * Props:
 *  • text      — the badge type from DB (e.g. "Sale", "Best Seller")
 *  • discount  — optional sale_discount column (e.g. "30%", "up to 40%")
 *
 * Sale display logic:
 *  badge="Sale" + discount="30%"        → 🔴 "30% OFF"
 *  badge="Sale" + discount="up to 40%"  → 🔴 "Up to 40%"
 *  badge="Sale" + discount=null         → 🔴 "SALE"
 *  badge="Best Seller"                  → ⚫ gold badge
 *  etc.
 */
export default function Badge({ text, discount }) {
  if (!text) return null;

  const raw = text.trim();
  const lower = raw.toLowerCase();

  // ── Is this a sale badge? ────────────────────────────────────
  const isSale =
    lower === 'sale' ||
    lower.includes('خصم') ||
    lower.includes('تخفيض') ||
    lower.includes('عرض');

  if (isSale) {
    // Build the label from the separate sale_discount column
    let saleLabel = 'SALE';

    if (discount) {
      const d = discount.trim();
      const isUpTo = d.toLowerCase().startsWith('up to') || d.startsWith('حتى');
      if (isUpTo) {
        // "up to 40%" → "Up to 40%"
        const num = d.match(/\d+%/)?.[0] ?? d;
        saleLabel = `Up to ${num}`;
      } else {
        // "30%" → "30% OFF"
        saleLabel = d.includes('%') ? `${d} OFF` : `${d} OFF`;
      }
    }

    return (
      <span
        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 font-bold uppercase px-3 py-1.5"
        style={{
          fontSize: '9px',
          letterSpacing: '0.12em',
          background: 'linear-gradient(135deg, #C0392B, #922B21)',
          color: 'white',
          boxShadow: '0 2px 12px rgba(192,57,43,0.45)',
        }}
      >
        {/* Pulsing dot */}
        <span
          style={{
            display: 'inline-block',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'white',
            flexShrink: 0,
            animation: 'badgeDot 1.5s ease-in-out infinite',
          }}
        />
        {saleLabel}
        <style>{`
          @keyframes badgeDot {
            0%, 100% { opacity: .9; transform: scale(1); }
            50%       { opacity: .3; transform: scale(.6); }
          }
        `}</style>
      </span>
    );
  }

  // ── Named badge styles ────────────────────────────────────────
  const namedStyles = {
    'Best Seller': {
      background: 'linear-gradient(135deg, #1C1C1E, #3A3A3C)',
      color: '#C9A96E',
    },
    'New Arrival': {
      background: 'linear-gradient(135deg, #C9A96E, #A07840)',
      color: 'white',
    },
    Signature: {
      background: 'linear-gradient(135deg, #A07840, #7D5A2A)',
      color: 'white',
    },
    Limited: {
      background: 'linear-gradient(135deg, #7D1F1F, #5A1414)',
      color: 'white',
    },
  };

  const style =
    namedStyles[raw] ??
    { background: 'linear-gradient(135deg, #1C1C1E, #3A3A3C)', color: '#C9A96E' };

  return (
    <span
      className="absolute top-4 left-4 z-10 text-[9px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5"
      style={style}
    >
      {raw}
    </span>
  );
}
