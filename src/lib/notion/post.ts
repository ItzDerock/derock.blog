import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import server from "~/env/server";
import { notion } from "./client";
import { parsePostProperties, PostProperties } from "./posts";

export type BlockWithChildren = BlockObjectResponse & {
  children: BlockObjectResponse[]
  has_children: true;
};

export async function getPostBySlug(slug: string) {
  const post = await notion.databases.query({
    database_id: server.NOTION_DATABASE_ID,
    filter: {
      and: [
        // only published posts
        {
          property: "Published",
          checkbox: {
            equals: true
          }
        },

        // matching slug
        {
          property: "Slug",
          rich_text: {
            equals: slug
          }
        }
      ]
    }
  });

  // Return null if the post does not exist.
  if (post.results.length === 0) {
    return null;
  }

  // Now fetch the post contents
  const children = await notion.blocks.children.list({
    block_id: post.results[0].id
  });

  // if any of the blocks have children, fetch them too.
  const allChildren = await Promise.all(
    children.results.map(async (block) => {
      if ("has_children" in block && block.has_children === true) {
        const children = await notion.blocks.children.list({
          block_id: block.id
        });

        return {
          ...block,
          children: children.results
        };
      }

      return block;
    })
  );

  // Get the post metadata
  const metadata = (post.results[0] as PageObjectResponse).properties as unknown as PostProperties;

  // Return the formatted post
  return {
    ...parsePostProperties(metadata, children.results),
    content: allChildren
  }
}
