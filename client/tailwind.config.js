/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}","./src/requirements/Dashboard/screens/Overview.jsx**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'geo': 'Georama_400Regular',
        'Cabin':'./assets/fonts/cabin-regular.ttf',
        'Inter':'Inter-Regular'
      }
      ,colors:{
        red:{
          100:'#FFC7CB',
          200:'#BF3E3E'
        },
        green:{
          100:'#C2FFD2',
          200:'#0E862D'
        }
      }
    },
  },
  plugins: [],
}

