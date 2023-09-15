import vercel from "solid-start-vercel";
import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    solid({
      ssr: true,
      adapter: vercel({
        edge: false,
        prerender: {
          expiration: 5 * 60,
        },
      }),

      experimental: { islands: false },
    }),
  ],
});
