import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

type NotionTextProps = {
  text: RichTextItemResponse[]
  inline?: boolean
}

export function NotionText(props: NotionTextProps) {
  return (
    <>
      {props.text.map((item) => {
        // get the annotations
        const annotations = item.annotations;

        // build the class list
        let classes = "";

        // go through the annotations
        if (annotations.bold) classes += " font-bold";
        if (annotations.italic) classes += " italic";
        if (annotations.strikethrough) classes += " line-through";
        if (annotations.underline) classes += " underline";
        if (annotations.code) classes += " font-mono bg-gray-800 rounded-md p-1 box-content text-amber-400";

        // return the text
        return item.href ? (
          <a
            href={item.href}
            rel="noopener noreferrer"
            target="_blank"
            class={classes + " inline-block text-blue-400 decoration-dotted decoration-blue-400 underline"}
          >
            {item.plain_text}
          </a>
        ) : (
          <span class={classes || undefined}>
            {item.plain_text}
          </span>
        )
      })}
    </>
  )
}
