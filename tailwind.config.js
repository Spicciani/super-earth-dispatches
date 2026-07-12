/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        hazard: "#F2C811",
        ink: "#111311",
        anthracite: "#1A1D1A",
        alarm: "#D8202A",
        bone: "#EDEDE4",
      },
      fontFamily: {
        stencil: ['"Black Ops One"', "Impact", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
