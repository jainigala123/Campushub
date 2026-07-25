/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 26px 80px rgba(15, 23, 42, 0.12)',
        glow: '0 0 0 1px rgba(56, 189, 248, 0.15), 0 24px 80px rgba(56, 189, 248, 0.12)',
      },
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        accent: '#06B6D4',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.15), transparent 30%)',
      },
    },
  },
  plugins: [],
};
