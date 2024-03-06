import { onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

type BlogCardContainerProps = {
  children: Element | Element[];
};

/**
 * Container around <BlogCard /> element that gives it the cool glow effect.
 * @param props
 * @returns
 */
export default function BlogCardsContainer(props: BlogCardContainerProps) {
  // mouse enter hover effect
  function onMouseHover(e: MouseEvent) {
    for (const card of document.getElementsByClassName(
      "card"
    ) as HTMLCollectionOf<HTMLDivElement>) {
      const rect = card.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  }

  // lifecycle
  onMount(() => {
    if (isServer) return;
    window.addEventListener("mousemove", onMouseHover);
  });

  onCleanup(() => {
    if (isServer) return;
    window.removeEventListener("mousemove", onMouseHover);
  });

  return (
    <div class="grid grid-cols-1 gap-2 card-wrapper lg:px-4">
      {props.children}
    </div>
  );
}
