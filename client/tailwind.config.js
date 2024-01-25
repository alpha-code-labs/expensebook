/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}","./src/components/common**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'Cabin': ['Cabin', 'san-serif'],
      }
      ,colors:{
        red:{
          100:'#FFC7CB',
          200:'#BF3E3E'
        }
      }
    },
  },
  plugins: [],
}

