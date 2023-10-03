/**@type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        "eb-primary-blue-500": "#4c36f1",
        "eb-primary-blue-50": "#EAE7FD",
        gainsboro: "#d8d8d8",
        darkgray: {
          "100": "#afabba",
          "200": "#9a9a9a",
        },
        black: "#000",
        dark :  {
        "100":"#1F1F1F",
        "200":"#131216"
        },
       
        "ebgrey-500": "#32333B",
        "ebgrey-200": "#c8c9d0",
        "ebgrey-600": "#5e606e",
        darkslategray: "#363636",
      },
      spacing: {},
      fontFamily: {
        cabin: "Cabin",
        inter:"Inter"
      },
      borderRadius: {
        "13xl": "32px",
      },
    },
    fontSize: {
      base: "16px",
      xl: "20px",
      sm: "14px",
      inherit: "inherit",
    },
  },
  corePlugins: {
    preflight: false,
  },
};



