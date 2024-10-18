/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      scrollbar: ['rounded'],
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '50%': '50%',
        '16': '4rem',
      },
      boxShadow: {
        'custom-light': '0 8px 12px rgba(0, 0, 0, 0.1)',
        card: "0px 35px 120px -15px #211e35",
      },
      
      colors :{
        // white : {
        //   100:'#FFF',
        //   200:'#FDFCFC',
        //   300:'#FDFDFD'
        // },
        
        purple:{
          50:'#EAE7FD',
          500: '#4C36F1',
          300:'#7F70F5'
        },
        gray:{
         
          200:'#9193A1',
          300:'#707070',
          400:'#333',
          500:'#000',
          600:"#f8f9fa",
          700:'#363636',
          
          900:'#F1F1F3',
          A100:'#FDFDFD',
          A200:'#32333B',
          A300:'#333333',
          A400:'#222222',
          A500:'#5E606E',
          

        },
        "b-gray":'#E3E4E8',
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

