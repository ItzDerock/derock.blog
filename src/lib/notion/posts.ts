import { BlockObjectResponse, CheckboxPropertyItemObjectResponse, DatePropertyItemObjectResponse, MultiSelectPropertyItemObjectResponse, PageObjectResponse, PartialBlockObjectResponse, RichTextPropertyItemObjectResponse, TitlePropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import server from "~/env/server";
import { notion } from "./client";

export type PostProperties = {
  Slug: RichTextPropertyItemObjectResponse,
  Date: DatePropertyItemObjectResponse,
  Published: CheckboxPropertyItemObjectResponse,
  Tags: MultiSelectPropertyItemObjectResponse,
  Image: RichTextPropertyItemObjectResponse,
  Page: TitlePropertyItemObjectResponse
}

export function parsePostProperties(
  properties: PostProperties,
  page: (BlockObjectResponse | PartialBlockObjectResponse)[]
) {
  // the description is the text before a horizontal separator
  const description = page
    .slice(0, page.findIndex((block: any) => block.type === "divider"))
    .map((block: any) => block.paragraph?.rich_text?.[0]?.plain_text)
    .join(" ");

  // return all the parsed properties
  return {
    title: (properties.Page.title as any)[0].plain_text as string,
    slug: (properties.Slug.rich_text as any)[0].plain_text,
    date: properties.Date.date!.start,
    tags: properties.Tags.multi_select.map((tag) => tag.name),
    image: (properties.Image.rich_text as any)?.[0].plain_text as string,
    description
  };
}

export async function getPosts() {
  const data = await notion.databases.query({
    database_id: server.NOTION_DATABASE_ID,
    filter: {
      // only published posts
      property: "Published",
      checkbox: {
        equals: true
      }
    }
  });

  // format results
  return await Promise.all(
    data.results.map(async (post) => {
      // Get the properties
      const properties = (post as any).properties as PostProperties;

      // Fetch the post contents
      const page = await notion.blocks.children.list({
        block_id: post.id
      });

      // Return the formatted post
      return {
        id: post.id,
        modified: (post as PageObjectResponse).last_edited_time,
        ...parsePostProperties(properties, page.results)
      };
    })
  );
}
