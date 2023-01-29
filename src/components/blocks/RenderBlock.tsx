import { BlockObjectResponse, PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Show, Suspense } from "solid-js";
import { BlockWithChildren } from "~/lib/notion/post";
import { NotionCode } from "./NotionCode";
import { NotionText } from "./NotionText";

type RenderBlockProps = {
  // block: BlockObjectResponse | PartialBlockObjectResponse;
  block: BlockWithChildren | PartialBlockObjectResponse;
}

export default function RenderBlock(props: RenderBlockProps) {
  // check if is partial
  if (!("type" in props.block))
    return <pre>Partial block (not implemented)<br />{JSON.stringify(props.block, null, 2)}</pre>

  // cast
  const block = props.block as BlockObjectResponse;

  switch (block.type) {
    case "paragraph":
      return (
        <p>
          <NotionText text={block.paragraph.rich_text} />
        </p>
      )

    case "divider":
      return <hr class="my-2 border-gray-700" />

    case "heading_1":
      return (
        <h1 class="text-4xl font-bold leading-snug my-8">
          <NotionText text={block.heading_1.rich_text} />
        </h1>
      )

    case "heading_2":
      return (
        <h2 class="text-2xl font-bold my-4">
          <NotionText text={block.heading_2.rich_text} />
        </h2>
      )

    case "heading_3":
      return (
        <h3 class="text-xl font-bold mt-6 mb-4">
          <NotionText text={block.heading_3.rich_text} />
        </h3>
      )

    case "code":
      return (
        <Suspense>
          <NotionCode code={block.code} />
        </Suspense>
      )

    case "image":
      return (
        <img
          src={
            block.image.type === "external"
              ? block.image.external.url
              : block.image.file.url
          }

          alt={block.image.caption?.[0]?.plain_text || ""}
          class="my-4"
        />
      );

    case "bulleted_list_item":
    case "numbered_list_item":
      const richText = block.type === "bulleted_list_item"
        ? block.bulleted_list_item.rich_text
        : block.numbered_list_item.rich_text;

      const orderType = block.type === "bulleted_list_item"
        ? "list-disc"
        : "list-decimal";

      return (
        <li class={`${orderType} ml-4`}>
          <NotionText text={richText} inline />
          <Show when={block.has_children}>
            <ol class={`${orderType} ml-4`}>
              {(block as BlockWithChildren).children.map((child) => (
                <RenderBlock block={child} />
              ))}
            </ol>
          </Show>
        </li>
      )

    default:
      return <pre>Unknown block type: {block.type}<br />{JSON.stringify(props.block, null, 2)}</pre>
  }

}
