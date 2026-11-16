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
          navy: '#021343',
          'navy-dark': '#010c2c',
          'navy-light': '#0a1d59',
          orange: '#fe8a04',
          'orange-dark': '#e67300',
          'orange-deep': '#ff5e13',
          pink: '#fe0467',
          gray: '#556080',
          'gray-light': '#f4f7fb',
          dark: '#0b1120',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(254, 138, 4, 0.4)',
        'glow-navy': '0 0 30px -5px rgba(2, 19, 67, 0.5)',
        'premium': '0 10px 40px -10px rgba(2, 19, 67, 0.12)',
        'card-hover': '0 20px 40px -15px rgba(254, 138, 4, 0.15)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

