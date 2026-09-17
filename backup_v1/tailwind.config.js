/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cba: {
          blue: {
            50: '#F4F5F9',
            100: '#E6E7F1',
            200: '#C2C5DF',
            300: '#9499C5',
            400: '#5F659E',
            500: '#3D4173',
            DEFAULT: '#2C2E53', // Dominante Institucional
            700: '#232543',
            800: '#1B1C33',
            900: '#141525',
          },
          gold: {
            50: '#FDFBF4',
            100: '#FBF5E1',
            200: '#F5E8BE',
            300: '#EDD692',
            400: '#E1C260',
            DEFAULT: '#D4AF37', // Acento / CTA Creativo
            600: '#B89327',
            700: '#94721C',
            800: '#755819',
            900: '#5E4416',
          },
        }
      },
      boxShadow: {
        'cba-card': '0 4px 20px -2px rgba(44, 46, 83, 0.08), 0 2px 6px -1px rgba(44, 46, 83, 0.04)',
        'cba-gold': '0 4px 15px -3px rgba(212, 175, 55, 0.35)',
      }
    },
  },
  plugins: [],
}
