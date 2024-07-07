/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#215273",
        abbaGreen: "#24CE7B",
        abbaRed: "#ED5E68",
        abbaGray: "#DFE0E4",
        blueGray: "#66809B",
      },
      fontFamily: {
        golos: ["Golos Text", "sans-serif"],
      },
    },
  },
  plugins: [],
};
