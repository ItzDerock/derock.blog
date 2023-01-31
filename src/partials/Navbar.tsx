import { createEffect, For, onCleanup, onMount } from "solid-js";
import { A, useLocation } from "solid-start";

const routes = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "https://derock.dev/?ref=derock.blog",
    name: "Portfolio",
  },
  // {
  //   path: "/contact",
  //   name: "Contact",
  // }
];

export default function Navbar() {
  const location = useLocation();

  // cool hover effect from vercel
  let navbarUL: HTMLUListElement = null as any;
  let hoverEl: HTMLDivElement = null as any;

  // set active element
  function setActiveElement(activeEl: HTMLLIElement) {
    hoverEl.style.width = `${activeEl.offsetWidth}px`;
    hoverEl.style.height = `${activeEl.offsetHeight}px`;
    hoverEl.style.left = `${activeEl.offsetLeft}px`;
  }

  // hover functions
  function onHover(e: MouseEvent) {
    if (e.target instanceof HTMLLIElement) {
      setActiveElement(e.target);
    }
  }

  function endHover(_e: MouseEvent) {
    const activeEl = navbarUL.querySelector("li[data-active]") as HTMLLIElement | null;
    if (!activeEl) return;

    setActiveElement(activeEl);
  }

  // lifecycle
  onMount(() => {
    navbarUL.addEventListener("mouseover", onHover);
    navbarUL.addEventListener("mouseleave", endHover);
  });

  onCleanup(() => {
    if (!navbarUL) return;
    navbarUL.removeEventListener("mouseover", onHover);
    navbarUL.removeEventListener("mouseleave", endHover);
  });

  // initial hover
  createEffect(() => {
    const activeEl = navbarUL.querySelector("li[data-active]") as HTMLLIElement | null;
    if (!activeEl) return;

    setActiveElement(activeEl);
  });

  return (
    <nav class="bg-[#13111c] border-gray-800 lg:border backdrop-blur-lg lg:rounded-md lg:mt-4 mx-2 lg:mx-0">
      <ul class="container flex items-center p-3 text-gray-300 gap-2" ref={navbarUL}>
        <div class="bg-[#221f2e] absolute transition-all -z-10 rounded-md" ref={hoverEl} />

        <For each={routes}>
          {
            (route) => (
              <li class="px-4 py-2 rounded-md hover:text-white" data-active={route.path == location.pathname}>
                <A href={route.path}>{route.name}</A>
              </li>
            )
          }
        </For>
      </ul>
    </nav>
  );
}
