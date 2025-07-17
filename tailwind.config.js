/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fefdf4',
          100: '#fdf6e3',
          200: '#fae8b6',
          300: '#f5d785',
          400: '#efbf4d',
          500: '#d4af37',
          600: '#b8941f',
          700: '#997a19',
          800: '#7d5f1a',
          900: '#68501c',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        body: ['Crimson Text', 'serif'],
      }
    },
  },
  plugins: [],
};