import { Client } from "@notionhq/client";

// Initalize client
export const notion = new Client({
  auth: process.env.NOTION_API_KEY
});
