/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#F5F5F7',
          elevated: '#FFFFFF',
          subtle: '#EFEFF4',
        },
        ink: {
          DEFAULT: '#1D1D1F',
          muted: '#6E6E73',
          subtle: '#86868B',
        },
        brand: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px -2px rgba(29, 29, 31, 0.06), 0 1px 3px 0 rgba(29, 29, 31, 0.04)',
        'card-hover': '0 16px 32px -8px rgba(29, 29, 31, 0.12), 0 4px 8px -2px rgba(29, 29, 31, 0.06)',
        'modal': '0 24px 48px -12px rgba(29, 29, 31, 0.25)',
      }
    },
  },
  plugins: [],
};
