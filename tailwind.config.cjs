const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        card: {
          background: "#13111c"
        }
      },

      fontFamily: {
        mono: ["IBM Plex Mono", ...defaultTheme.fontFamily.mono]
      }
    }
  },
  safelist: [
    "font-bold",
    "italic",
    "line-through",
    "underline",
    "font-mono"
  ],
  plugins: []
};
