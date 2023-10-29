/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      white: "#fff",
      gray: {
        "100": "#fdfcfc",
        "200": "#7c7c7c",
        "300": "rgba(132, 132, 132, 0.15)",
      },
      "eb-primary-blue-50": "#eae7fd",
      "eb-primary-blue-500": "#4c36f1",
      "ebgrey-400": "#9193a1",
      "eb-primary-blue-300": "#7f70f5",
      lightcoral: {
        "100": "#ff9494",
        "200": "#e57981",
      },
      black: "#000",
      gainsboro: {
        "100": "#e6e6e6",
        "200": "#d8d8d8",
      },
      "ebgrey-100": "#e3e4e8",
      "ebgrey-200": "#c8c9d0",
      darkslategray: "#333",
      darkseagreen: "#70ae80",
      "ebgrey-500": "#32333b",
      dimgray: "#707070",
      "ebgrey-600": "#5e606e",
      blueviolet: "#4c38e4",
      "ebgrey-50": "#f1f1f3",
    },
    spacing: {},
    fontFamily: {
      cabin: "Cabin",
    },
    borderRadius: {
      "81xl": "100px",
      "29xl": "48px",
    },
  },
  fontSize: {
    xs: "12px",
    base: "16px",
    sm: "14px",
    inherit: "inherit",
  },
};
export const corePlugins = {
  preflight: false,
};
