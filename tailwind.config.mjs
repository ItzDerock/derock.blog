/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    // Fab-drawing scale: a calm 1.2 ratio. Body is 17px, not 19px - the old
    // scale is why the site needed an `initial-scale=0.8` viewport hack.
    fontSize: {
      legend: ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.1em" }],
      data: ["0.8125rem", { lineHeight: "1.4" }],
      code: ["0.8125rem", { lineHeight: "1.5" }],
      xs: ["0.75rem", { lineHeight: "1.45" }],
      sm: ["0.9375rem", { lineHeight: "1.55" }],
      base: ["1.0625rem", { lineHeight: "1.65" }],
      lg: ["1.125rem", { lineHeight: "1.4" }],
      xl: ["1.25rem", { lineHeight: "1.3" }],
      "2xl": ["1.45rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
      "3xl": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
      "4xl": [
        "clamp(2rem, 1.4rem + 2.4vw, 2.75rem)",
        { lineHeight: "1.12", letterSpacing: "-0.02em" },
      ],
    },

    extend: {
      fontFamily: {
        // Atkinson is the identity face: the wordmark, titles, and the type
        // the post cover art is set in.
        display: ["Atkinson", "system-ui", "sans-serif"],
        sans: ["Archivo", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },

      colors: {
        // Solder mask over copper reads warm, never blue-black.
        mask: {
          DEFAULT: "#14120F",
          raised: "#1D1A15",
          deep: "#0C0B09",
        },
        // Silkscreen ink, chalky and warm. Never pure white.
        silk: {
          DEFAULT: "#E9E4D7",
          dim: "#A39C8C",
          faint: "#6E685C",
        },
        copper: {
          // traces and hairlines - structure, never lettering
          DEFAULT: "#B0703A",
          // copper lettering: the same metal, one step brighter so small
          // legend type clears 4.5:1 on the mask
          light: "#C98B5E",
          deep: "#5C3A1E",
        },
        // ENIG pad finish - the only accent, reserved for what you can touch.
        gold: {
          DEFAULT: "#E6B450",
          bright: "#FFD98A",
        },
        dnp: "#D2664C",
      },

      borderRadius: {
        pad: "2px",
        part: "3px",
        board: "6px",
      },

      boxShadow: {
        // A part sits on the board: a real offset plus a soft blur.
        part: "0 1px 0 #0C0B09, 0 10px 24px -12px rgba(0, 0, 0, 0.55)",
      },

      maxWidth: {
        // the reading measure, about 75ch in Archivo at 17px
        column: "40rem",
        // media may outgrow the measure the way a part outgrows its silkscreen
        media: "52rem",
        // index listings, kept tighter than the board so 2:1 cover art does
        // not tower over the row it belongs to
        index: "58rem",
        // the board itself
        board: "72rem",
      },

      spacing: {
        gutter: "12rem",
      },

      transitionTimingFunction: {
        route: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
