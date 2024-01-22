/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}","./src/components/common**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'geo': 'Georama_400Regular',
        'Cabin':'./assets/fonts/Cabin-Regular.ttf',
        'Inter':'Inter-Regular'
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

