import { CodeBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import hljs from "highlight.js";
import { createEffect, createSignal, Show } from "solid-js";
import { NotionText } from "./NotionText";

import "highlight.js/styles/atom-one-dark.css";

type NotionCodeProps = {
  code: CodeBlockObjectResponse["code"];
}

export function NotionCode(props: NotionCodeProps) {
  const content = props.code.rich_text.map(text => text.plain_text).join("\n");
  const [copyState, setCopyState] = createSignal(false);

  // highlight the text
  const highlighted = hljs.highlight(
    content,
    { language: props.code.language }
  );

  // update copyState on click
  const copy = () => {
    // copy to clipboard
    navigator.clipboard.writeText(content);

    // update copyState
    setCopyState(true);
  }

  // reset copyState after 1 second
  createEffect(() => {
    if (!copyState()) return;

    const timeout = setTimeout(() => {
      setCopyState(false);
    }, 1000);

    return () => clearTimeout(timeout);
  });

  return (
    <div>
      <code
        class="block bg-gray-800 rounded-md p-4 my-4 whitespace-pre relative"
      >
        <pre
          innerHTML={highlighted.value}
          class="overflow-y-auto leading-snug"
        />

        {/* copy button */}
        <button
          class="absolute top-0 right-0 m-3 text-gray-400 hover:text-gray-200"
          type="button"
          onClick={copy}
        >
          <Show
            when={copyState()}
            fallback={"Copy"}
          >
            Copied!
          </Show>
        </button>
      </code>

      {/* caption */}
      <Show when={props.code.caption}>
        <div class="text-gray-400 text-sm mt-2">
          <NotionText text={props.code.caption} />
        </div>
      </Show>
    </div>
  )
};
