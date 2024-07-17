/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'custom-gradient': 'linear-gradient(to bottom, white 70%, #4c51bf 30%)',
      }),
      fontFamily: {
        'cabin': ['Cabin', 'sans-serif'],
      },
    },
  },
  plugins: [],
}