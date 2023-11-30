/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors :{
        white : {
          100:'#FFF',
          200:'#FDFCFC',

        },
        purple:{
          50:'#EAE7FD',
          500: '#4C36F1'
        },
        gray:{
          100:"#848484",
          200:'#9193A1',
          300:'#9193A1',
          400:'#333',
          500:'#000',
          600:'#C8C9D0',
          700:'#363636'
        },
        

      },
      fontFamily:{
        cabin:"Cabin",
        inter: "Inter"
      }

    },
  },
  plugins: [],
}

