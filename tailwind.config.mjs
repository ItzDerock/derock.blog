/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ["Atkinson", "sans-serif"],
    },

    fontSize: {
      base: "1.25rem",
      sm: "1rem",
      lg: "1.4rem",
      xl: "1.563em",
      "2xl": "1.953em",
      "3xl": "2.441em",
      "4xl": "3.052em",
    },

    extend: {
      colors: {
        card: {
          background: "#13111c",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
