export default function Footer() {
  const year = new Date().getFullYear();

  const collections = [
    { label: 'Dining Room',      href: '#collections' },
    { label: 'Bedrooms',         href: '#collections' },
    { label: "Children's Room",  href: '#collections' },
    { label: 'New Arrivals',     href: '#collections' },
  ];

  const company = [
    { label: 'Our Story',       href: '#about' },
    { label: 'Craftsmanship',   href: '#about' },
    { label: 'Deliveries',      href: '#deliveries' },
    { label: 'Client Reviews',  href: '#testimonials' },
  ];

  const WA_SVG = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  return (
    <footer
      id="contact"
      style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #141412 100%)' }}
    >
      {/* ── Top band ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Brand column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <img
                  src="/images/logo/458133892_993241112812845_8070458048125201396_n.jpg"
                  alt="Madera Home"
                  className="h-10 w-10 object-cover rounded-full"
                  style={{ border: '2px solid rgba(201,169,110,0.4)' }}
                />
                <div className="flex flex-col leading-none">
                  <span style={{ fontFamily: "'Playfair Display', serif", color: '#FAF8F5', fontSize: '1.1rem' }}>
                    Madera
                  </span>
                  <span style={{ fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A96E', fontWeight: 500 }}>
                    Home
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(250,248,245,0.5)' }}>
                Where wood becomes wonder. Luxury furniture crafted for lives well lived.
              </p>
              <p
                className="text-xs leading-relaxed mb-8"
                dir="rtl"
                style={{ color: 'rgba(250,248,245,0.3)', direction: 'rtl', fontFamily: 'Inter, sans-serif' }}
              >
                حيث يصبح الخشب تحفة فنية
              </p>

              {/* Social icons */}
              <div className="flex gap-3">
                {[
                  {
                    href: 'https://www.instagram.com/maderahomeeg?igsh=dWYwNDFzMDNqMmJs',
                    label: 'Instagram',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11a1 1 0 011 1v11a1 1 0 01-1 1h-11a1 1 0 01-1-1v-11a1 1 0 011-1z" />
                      </svg>
                    ),
                  },
                  {
                    href: 'https://www.facebook.com/share/1BDYHrjvev/',
                    label: 'Facebook',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                      </svg>
                    ),
                  },
                  {
                    href: 'https://wa.me/201270044175',
                    label: 'WhatsApp',
                    icon: WA_SVG,
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'rgba(250,248,245,0.45)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(201,169,110,0.15)';
                      e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)';
                      e.currentTarget.style.color = '#C9A96E';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                      e.currentTarget.style.color = 'rgba(250,248,245,0.45)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Collections */}
            <div>
              <h3
                className="text-[10px] tracking-[0.3em] uppercase mb-6 font-medium"
                style={{ color: 'rgba(250,248,245,0.3)' }}
              >
                Collections
              </h3>
              <ul className="space-y-3">
                {collections.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm transition-all duration-300 flex items-center gap-2 group hover-underline"
                      style={{ color: 'rgba(250,248,245,0.5)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#C9A96E'; e.currentTarget.style.paddingLeft = '6px'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250,248,245,0.5)'; e.currentTarget.style.paddingLeft = '0'; }}
                    >
                      <span className="w-0 h-px bg-gold group-hover:w-3 transition-all duration-300 flex-shrink-0" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3
                className="text-[10px] tracking-[0.3em] uppercase mb-6 font-medium"
                style={{ color: 'rgba(250,248,245,0.3)' }}
              >
                Company
              </h3>
              <ul className="space-y-3">
                {company.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm transition-all duration-300 group"
                      style={{ color: 'rgba(250,248,245,0.5)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#C9A96E'; e.currentTarget.style.paddingLeft = '6px'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250,248,245,0.5)'; e.currentTarget.style.paddingLeft = '0'; }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3
                className="text-[10px] tracking-[0.3em] uppercase mb-6 font-medium"
                style={{ color: 'rgba(250,248,245,0.3)' }}
              >
                Get in Touch
              </h3>
              <ul className="space-y-4">
                {/* WhatsApp */}
                <li className="flex items-start gap-3">
                  <span style={{ color: '#C9A96E', flexShrink: 0, marginTop: '2px' }}>{WA_SVG}</span>
                  <a
                    href="https://wa.me/201270044175"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-300"
                    style={{ color: 'rgba(250,248,245,0.55)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#C9A96E'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250,248,245,0.55)'; }}
                  >
                    +20 127 004 4175
                  </a>
                </li>

                {/* Phone */}
                <li className="flex items-start gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="flex flex-col gap-1">
                    <a href="tel:01270044175" className="text-sm transition-colors duration-300" style={{ color: 'rgba(250,248,245,0.55)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#C9A96E'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250,248,245,0.55)'; }}>
                      01270044175
                    </a>
                    <a href="tel:01111502115" className="text-sm transition-colors duration-300" style={{ color: 'rgba(250,248,245,0.55)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#C9A96E'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250,248,245,0.55)'; }}>
                      01111502115
                    </a>
                  </div>
                </li>

                {/* Instagram */}
                <li className="flex items-start gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11a1 1 0 011 1v11a1 1 0 01-1 1h-11a1 1 0 01-1-1v-11a1 1 0 011-1z" />
                  </svg>
                  <a
                    href="https://www.instagram.com/maderahomeeg?igsh=dWYwNDFzMDNqMmJs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-300"
                    style={{ color: 'rgba(250,248,245,0.55)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#C9A96E'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250,248,245,0.55)'; }}
                  >
                    @maderahomeeg
                  </a>
                </li>

                {/* Address */}
                <li className="flex items-start gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <a
                    href="https://maps.app.goo.gl/yvRuVPHwp5v2mgXn6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm leading-relaxed transition-colors duration-300 hover:underline"
                    style={{ color: 'rgba(250,248,245,0.45)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#C9A96E'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250,248,245,0.45)'; }}
                  >
                    52 Abou Dawoud Al Zaheri,<br />Nasr City, Cairo
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Gold accent strip ── */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.4) 30%, rgba(201,169,110,0.4) 70%, transparent)' }}
      />

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs" style={{ color: 'rgba(250,248,245,0.25)' }}>
          © {year} Madera Home. All rights reserved.
        </p>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service'].map((t) => (
            <button
              key={t}
              className="text-xs transition-colors duration-300"
              style={{ color: 'rgba(250,248,245,0.25)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(250,248,245,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250,248,245,0.25)'; }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
