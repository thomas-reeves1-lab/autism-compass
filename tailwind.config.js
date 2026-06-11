/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0E5196',
          deep: '#003D7A',
          leaf: '#7BC043',
          sky: '#E8F4FB',
        },
        // Evidence / safety semantic colours — deeper, fuller (less washed-out)
        safe: { DEFAULT: '#15803D', soft: '#DCF3E4', deep: '#0F5C2E' }, // green - stronger evidence / calm
        caution: { DEFAULT: '#B45309', soft: '#FBEAD0', deep: '#8A3F07' }, // amber - mixed / watch
        doctor: { DEFAULT: '#C2410C', soft: '#FBE2D2', deep: '#9A340A' }, // orange - doctor only / side effects
        danger: { DEFAULT: '#B91C1C', soft: '#F8DDDD', deep: '#911616' }, // red - urgent / do not self start
        info: { DEFAULT: '#1D4ED8', soft: '#DCE7FB', deep: '#1740A8' }, // blue - information
        theoretical: { DEFAULT: '#64748B', soft: '#E9EDF2', deep: '#475569' }, // grey - not enough evidence
      },
      fontFamily: {
        sans: ['Roboto', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['"Roboto Flex"', 'Roboto', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(14, 81, 150, 0.10)',
        card: '0 4px 20px rgba(14, 81, 150, 0.08)',
      },
      backgroundImage: {
        'glass-card': 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(232,244,251,0.65))',
      },
    },
  },
  plugins: [],
}
