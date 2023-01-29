import vercel from "solid-start-vercel";
import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid({
    ssr: true,
    adapter: vercel({
      prerender: {
        expiration: 60 * 60 * 24,
      }
    })
  })],
});
