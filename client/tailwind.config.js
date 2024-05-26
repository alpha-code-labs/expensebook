/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors :{
        
        purple:{
          50:'#EAE7FD',
          500: '#4C36F1',
          300:'#7F70F5'
        },
        green:{
          100:'#C2FFD2',
          200:'#0E862D'
        },
        red:{
          100:'#FFC2C6',
          200:'#BC2D2D'
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
      fontSize: {
        lg:"20px",
        base: "16px",
        sm: "14px",
        xs: "12px",
        inherit: "inherit",
      },

    },
  },
  plugins: [],
}
