/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],


  // for main text ---text-gray-800
  // for main text ---text-gray-600
  // for background ---bg-slate-100
  // for border    ---border-gray-100
  //py-3 px-2 or py-3 py-4

  theme: {
    extend: {
      colors :{
        

        purple:{
          50:'#EAE7FD',
          500: '#4C36F1',
          300:'#7F70F5'
        },
        
        
        //border
        "b-gray":'#E3E4E8',
        green:{
          100:'#C2FFD2',
          200:'#0E862D'
        },
        yellow:{
          100:'#FFFCE1',
          200:'#E19829'
        },
        red:{
          100:'#FFC2C6',
          200:'#BC2D2D'
        }
        
        

      },
      fontFamily:{
        cabin:"Cabin",
        inter: "Inter"
      },
      fontSize: {
        base: "16px",
        sm: "14px",
        xs: "12px",
        xl: "20px",
      },

    },
  },
  plugins: [],
}

