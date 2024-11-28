/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#E7E9EF',
          100: '#C2C9D6',
          200: '#9AA5BC',
          300: '#7281A3',
          400: '#4F658F',
          500: '#2C4A7C',
          600: '#1A366A',
          700: '#0D2657',
          800: '#041845',
          900: '#000C33',
        },
        gold: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE799',
          300: '#FFDD73',
          400: '#FFD44D',
          500: '#FFCB26',
          600: '#FFC200',
          700: '#D9A500',
          800: '#B38800',
          900: '#8C6B00',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};