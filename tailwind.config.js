/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#7C5CFF",
        accent: "#FF6B6B",
        cyan: "#00D4FF",
        secondary: "#FFD166",

        dark: "#061226",

        card: "#0F1724",
        muted: "#94A3B8",
      },
    },
  },

  plugins: [],
};
