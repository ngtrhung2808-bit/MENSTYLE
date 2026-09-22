/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fcf8f6',
          100: '#f6ece6',
          200: '#edd9ce',
          300: '#dfbea9',
          400: '#cf9e80',
          500: '#c1815d',
          600: '#b26e4f',
          700: '#945840',
          800: '#794837',
          900: '#633d2f',
          950: '#351e17',
        },
        dark: {
          900: '#121212',
          800: '#1e1e1e',
          700: '#2a2a2a',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
