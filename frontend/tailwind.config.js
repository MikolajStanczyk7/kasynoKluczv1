/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
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
