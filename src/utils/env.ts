import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PLAUSIBLE_SITE_ID: z.string().optional(),
    PLAUSIBLE_API_KEY: z.string().optional(),
    PLAUSIBLE_URL: z.string().default("https://plausible.io"),
  },

  runtimeEnv: {
    PLAUSIBLE_SITE_ID: import.meta.env.PLAUSIBLE_SITE_ID,
    PLAUSIBLE_API_KEY: import.meta.env.PLAUSIBLE_API_KEY,
    PLAUSIBLE_URL: import.meta.env.PLAUSIBLE_URL,
  },
});
