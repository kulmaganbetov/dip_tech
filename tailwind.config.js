/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  // Dark mode via class toggle on <html>
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        // Brand palette — clean Apple-like neutrals with an electric accent
        brand: {
          50: '#f5f7ff',
          100: '#e8ecff',
          200: '#c9d3ff',
          300: '#9aaeff',
          400: '#6b85ff',
          500: '#3f5bff',
          600: '#2740e6',
          700: '#1d31b4',
          800: '#192a8c',
          900: '#162569',
        },
        ink: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d9d9de',
          300: '#b6b6bf',
          400: '#8b8b96',
          500: '#5f5f6a',
          600: '#444450',
          700: '#2f2f38',
          800: '#1c1c22',
          900: '#0c0c10',
        },
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(15, 23, 42, 0.08)',
        card: '0 12px 40px -16px rgba(15, 23, 42, 0.18)',
      },
      backgroundImage: {
        'gradient-radial':
          'radial-gradient(ellipse at top, rgba(63, 91, 255, 0.12), transparent 60%)',
        'hero-grid':
          'linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)',
      },
      animation: {
        'pulse-soft': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
