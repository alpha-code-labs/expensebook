/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],


  theme: {
    extend: {
      colors :{
        green:{
          100:'#C2FFD2',
          200:'#0E862D'
        },
        yellow:{
          100:'#FFFCE1',
          200:'#E19829'
        }
      },
      
      fontFamily:{
        cabin:"Cabin",
        inter: "Inter"
      },

    },
  },
  plugins: [],
}

