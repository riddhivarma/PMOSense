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
          pink: {
            50: '#fdf2f8',
            100: '#fbcfe8',
            200: '#f9a8d4',
            300: '#f472b6',
            400: '#ec4899',
            500: '#db2777', // Primary Brand Accent
            600: '#be185d',
            700: '#9d174d',
          },
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
          },
          indigo: {
            50: '#e0e7ff', // Soft Lavender/Indigo bg
            100: '#c7d2fe',
            200: '#a5b4fc',
            300: '#818cf8',
            400: '#6366f1',
            500: '#4f46e5', // Secondary Accent
            600: '#4338ca',
            700: '#3730a3',
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 8px 32px 0 rgba(219, 39, 119, 0.15)',
      }
    },
  },
  plugins: [],
}
