/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        dark: '#0f0f0f',
        darker: '#1a0033',
        gold: '#FFD700',
        magenta: '#FF00FF',
      },
    },
  },
  plugins: [],
}
