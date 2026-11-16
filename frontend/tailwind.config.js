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
          navy: '#030a21',
          'navy-dark': '#01040f',
          'navy-light': '#091a4a',
          'navy-subtle': '#102766',
          orange: '#fe8a04',
          'orange-dark': '#e03b00',
          'orange-deep': '#ff5e13',
          'orange-amber': '#ffaa33',
          pink: '#fe0467',
          gray: '#64748b',
          'gray-light': '#f8fafc',
          dark: '#020718',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 28px -4px rgba(254, 138, 4, 0.55)',
        'glow-navy': '0 0 35px -5px rgba(3, 10, 33, 0.7)',
        'premium': '0 12px 40px -10px rgba(3, 10, 33, 0.14)',
        'card-hover': '0 25px 50px -15px rgba(254, 138, 4, 0.22)',
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
