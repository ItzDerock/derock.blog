import { useLocation } from "solid-start"
import { FaSolidCopy, FaBrandsTwitter, FaBrandsReddit } from "solid-icons/fa"
import { createSignal, onMount } from "solid-js";

export default function ShareButtons(props: {
  url?: string
}) {
  let [url, setURL] = createSignal(props.url);
  const location = useLocation();

  onMount(() => {
    if (props.url) return;

    try {
      const url = new URL(window.location.href);
      url.pathname = location.pathname;

      setURL(url.href);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div class="flex flex-row gap-2 [&>*]:text-white [&>*:hover]:text-gray-300 [&>*]:block">
      <button
        role="button"
        onClick={() => {
          // copy
          if (url()) navigator.clipboard.writeText(url()!);
        }}
      >
        <span class="sr-only">Copy link</span>
        <FaSolidCopy />
      </button>

      <a
        href={`https://twitter.com/intent/tweet?url=${url()}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="sr-only">Share on Twitter</span>
        <FaBrandsTwitter />
      </a>

      <a
        href={`https://reddit.com/submit?url=${url()}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="sr-only">Share on Reddit</span>
        <FaBrandsReddit />
      </a>
    </div>
  )
}
