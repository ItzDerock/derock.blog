import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import remarkMermaid from "astro-diagram/remark-mermaid";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { remarkReadingTime } from "./src/plugins/readingTime.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://derock.blog",
  integrations: [mdx(), sitemap(), tailwind(), solidJs(), icon()],
  markdown: {
    remarkPlugins: [remarkMermaid, remarkMath, remarkReadingTime],
    rehypePlugins: [rehypeKatex]
  }
});
