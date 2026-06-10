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
        // Evidence / safety semantic colours (master prompt colour rules)
        safe: { DEFAULT: '#2E9E5B', soft: '#E4F5EB' }, // green  - stronger evidence / calm
        caution: { DEFAULT: '#E0A800', soft: '#FCF4DA' }, // yellow - mixed / watch
        doctor: { DEFAULT: '#E8730C', soft: '#FCEBDC' }, // orange - doctor only / side effects
        danger: { DEFAULT: '#D23B3B', soft: '#FBE6E6' }, // red    - urgent / do not self start
        info: { DEFAULT: '#2C7BE5', soft: '#E5EFFB' }, // blue   - information
        theoretical: { DEFAULT: '#7A8794', soft: '#EEF1F4' }, // grey - not enough evidence
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
