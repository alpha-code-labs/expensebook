/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      white: "#fff",
      "eb-primary-blue-300": "#7f70f5",
      lightcoral: {
        "100": "#ff9494",
        "200": "#e57981",
      },
      black: "#000",
      gainsboro: "#d8d8d8",
      "eb-primary-blue-500": "#4c36f1",
      dimgray: "#707070",
      darkslategray: "#333",
      cornsilk: "#fffce1",
      goldenrod: "#e19829",
      honeydew: "#e1ffe9",
      forestgreen: "#269242",
      "ebgrey-600": "#5e606e",
      "ebgrey-500": "#32333b",
      gray: {
        "100": "#fdfcfc",
        "200": "rgba(132, 132, 132, 0.15)",
      },
      "ebgrey-400": "#9193a1",
      "eb-primary-blue-50": "#eae7fd",
    },
    spacing: {},
    fontFamily: {
      cabin: "Cabin",
    },
    borderRadius: {
      "81xl": "100px",
      "13xl": "32px",
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
