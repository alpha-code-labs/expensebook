/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        cabin:"Cabin",
        inter: "Inter"
      },
      boxShadow: {
        'custom-light': '0 8px 12px rgba(0, 0, 0, 0.1)',
        card: "0px 35px 120px -15px #211e35",
      },
    },
  },
  plugins: [],
}