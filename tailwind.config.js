/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — Mauve Purple
        primary: {
          DEFAULT: '#8C5B6E',
          dark: '#6F4455',
          light: '#AA7C90',
          50: '#FAF4F6',
          100: '#F2E4EA',
          200: '#E6C9D5',
          300: '#D6AABF',
          400: '#C28CA4',
          500: '#8C5B6E',
          600: '#6F4455',
          700: '#54303F',
          800: '#3A1F2B',
          900: '#200D16',
        },
        // Secondary — Blush Peach
        secondary: {
          DEFAULT: '#F4D9CE',
          deep: '#E7B8A6',
          tint: '#FAF0EB',
        },
        // Background — Warm Cream
        cream: {
          DEFAULT: '#FAF6F0',
          alt: '#EFEBE5',
          card: '#FFFFFF',
        },
        // Text
        charcoal: '#3E2A32',
        taupe: '#75626A',
        // Accent
        gold: {
          DEFAULT: '#C7A96B',
          light: '#D9BE8E',
          dark: '#A8893A',
        },
        // States
        sage: '#7C9473',
        rust: '#B5544A',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '300' }],
        'display-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        'widest': '0.25em',
        'ultra': '0.35em',
      },
      borderRadius: {
        'brand': '8px',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(58, 46, 55, 0.06)',
        'card': '0 4px 24px rgba(58, 46, 55, 0.08)',
        'elevated': '0 8px 40px rgba(58, 46, 55, 0.12)',
        'glow': '0 0 0 3px rgba(155, 122, 147, 0.25)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #FAF6F0 0%, #F4D9CE 100%)',
        'gradient-primary': 'linear-gradient(135deg, #8C5B6E 0%, #6F4455 100%)',
        'gradient-hero': 'linear-gradient(to bottom, rgba(62,42,50,0) 40%, rgba(62,42,50,0.6) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'marquee': 'marquee 25s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      transitionTimingFunction: {
        'brand': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
