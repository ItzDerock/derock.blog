/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ["Atkinson", "sans-serif"],
    },

    extend: {
      fontSize: {
        base: "1.25rem",
        sm: "1rem",
        xl: "1.5rem",
      },

      colors: {
        card: {
          background: "#13111c",
        },
      },
    },
  },
  plugins: [],
};
