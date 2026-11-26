/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0A66C2',
          dark: '#004182',
          soft: '#E8F1FA',
        },
        canvas: '#F3F2EF',
        ink: '#191919',
        muted: '#666666',
        line: '#E0DFDC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(10,102,194,0.08)',
      },
    },
  },
  plugins: [],
};
