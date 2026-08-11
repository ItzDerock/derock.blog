import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import remarkMermaid from "astro-diagram/remark-mermaid";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { remarkReadingTime } from "./src/plugins/readingTime.mjs";
import { rehypeTableScroll } from "./src/plugins/tableScroll.mjs";
import { rehypeFigures } from "./src/plugins/figures.mjs";
import { fabDrawing, fabStyleOverrides } from "./src/styles/ec-theme.mjs";
import prebundleWorkers from "vite-plugin-prebundle-workers";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://derock.blog",
  integrations: [
    // expressive-code must be registered before mdx so it owns code blocks
    expressiveCode({
      themes: [fabDrawing],
      useDarkModeMediaQuery: false,
      themeCssSelector: false,
      styleOverrides: fabStyleOverrides,
      plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
      defaultProps: {
        showLineNumbers: false,
        wrap: false,
      },
    }),
    mdx(),
    sitemap(),
    // base styles live in src/styles/global.css so the board owns @layer base
    tailwind({ applyBaseStyles: false }),
    solidJs(),
    icon(),
  ],

  markdown: {
    remarkPlugins: [remarkMermaid, remarkMath, remarkReadingTime],
    rehypePlugins: [rehypeKatex, rehypeTableScroll, rehypeFigures],
  },

  vite: {
    plugins: [
      prebundleWorkers({
        include: "src/components/specialties/PID/PIDWorker.ts",
      }),
    ],
  },

  // vercel adapter only builds with server output
  // still generates static pages
  adapter: vercel(),
  output: "server",
});
