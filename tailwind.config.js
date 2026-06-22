/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF8F5',
        gold: {
          DEFAULT: '#C9A96E',
          light: '#E2CFA5',
          dark: '#A07840',
        },
        charcoal: {
          DEFAULT: '#1C1C1E',
          light: '#3A3A3C',
          muted: '#6E6E73',
        },
        sand: {
          50: '#FDFBF7',
          100: '#F9F5EE',
          200: '#F0E9DC',
          300: '#E5D8C5',
          400: '#D4BFA0',
          500: '#BFA07A',
          600: '#A07840',
          700: '#7D5A2A',
          800: '#5A3F1A',
          900: '#3A270E',
        },
        cream: '#F5F0E8',
        walnut: '#5C3D2E',
        oak: '#A0784A',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['6rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'heading': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        'card': '0 2px 20px rgba(28,28,30,0.08)',
        'card-hover': '0 20px 60px rgba(28,28,30,0.18)',
        'modal': '0 25px 80px rgba(28,28,30,0.25)',
        'gold': '0 4px 24px rgba(201,169,110,0.35)',
        'gold-lg': '0 8px 40px rgba(201,169,110,0.45)',
        'warm': '0 8px 32px rgba(92,61,46,0.15)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        woodGrain: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        revealWidth: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        starFill: {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '60%': { transform: 'scale(1.3)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fadeInLeft': 'fadeInLeft 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fadeInRight': 'fadeInRight 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fadeIn': 'fadeIn 0.5s ease forwards',
        'scaleIn': 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'floatY': 'floatY 4s ease-in-out infinite',
        'pulse2': 'pulse2 2s ease-in-out infinite',
        'slideUp': 'slideUp 0.6s ease forwards',
        'starFill': 'starFill 0.4s ease forwards',
      }
    },
  },
  plugins: [],
}
