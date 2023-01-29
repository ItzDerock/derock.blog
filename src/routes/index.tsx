import { For } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import BlogCard from "~/components/BlogCard";
import { BlogCardContainer } from "~/components/BlogCardContainer";
import { getPosts } from "~/lib/notion/posts";

export default function Home() {
  const posts = useRouteData<typeof routeData>();

  return (
    <main class="text-center mx-auto my-2">
      <BlogCardContainer>
        <For each={posts()}>
          {blogpost => (
            <BlogCard post={blogpost} />
          )}
        </For>
      </BlogCardContainer>
    </main>
  );
}

export function routeData() {
  return createServerData$(
    async () => await getPosts(),
    {
      key: "posts",
      ssrLoadFrom: "server"
    }
  );
}
