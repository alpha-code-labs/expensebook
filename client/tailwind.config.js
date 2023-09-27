/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        "eb-primary-blue-500": "#4c36f1",
        "ebgrey-100": "#e3e4e8",
        "ebgrey-500": "#32333b",
        gainsboro: "#dedede",
        darkgray: "#9a9a9a",
        "ebgrey-400": "#9193a1",
        whitesmoke: "#f8f8f8",
        blueviolet: "#4c38e4",
        dimgray: "#707070",
      },
      spacing: {},
      fontFamily: {
        cabin: "Cabin",
        inter: "Inter",
      },
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      inherit: "inherit",
    },
  },
  corePlugins: {
    preflight: false,
  },
};
