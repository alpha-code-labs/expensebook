/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cabin': ['Cabin', 'sans-serif'],
      },
      transitionProperty: {
        'height': 'height',
        'max-height': 'max-height'
      },
    },
  },
  plugins: [],
}