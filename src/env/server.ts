import { z } from "zod";
import { config } from "dotenv";

// raise an error if this somehow gets imported into a browser bundle
if (typeof window !== "undefined") {
  throw new Error("This file should only be imported into a server bundle");
}

// load .env file
config();

// define schema
export const serverSchema = z.object({
  NOTION_API_KEY: z.string(),
  NOTION_DATABASE_ID: z.string(),
  PUBLIC_URL: z.optional(z.string())
});

// parse
const _serverEnv = serverSchema.safeParse(process.env);

// validate
if (!_serverEnv.success) {
  throw new Error("Invalid server environment variables");
}

// export env
export default _serverEnv.data;
