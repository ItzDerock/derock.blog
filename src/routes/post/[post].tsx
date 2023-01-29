import { createServerData$, ServerError } from "solid-start/server";
import { Head, Meta, RouteDataArgs, Title, useRouteData } from "solid-start";
import { getPostBySlug } from "../../lib/notion/post";
import { For, Show } from "solid-js";
import RenderBlock from "~/components/blocks/RenderBlock";
import ShareButtons from "~/components/ShareButtons";

export default function Post() {
  const post = useRouteData<typeof routeData>();

  return (
    <div class="mt-4 mx-4 md:mx-auto max-w-3xl">
      <Show
        when={post()}
        fallback={<p>Loading...</p>}
      >
        {/* update meta tags for seo */}
        <Head>
          <Title>{post()!.title} - derock.blog</Title>
          <Meta name="description" content={post()!.description} />
          <Meta name="og:title" content={post()!.title} />
          <Meta name="og:description" content={post()!.description} />
          <Meta name="og:image" content={post()!.image} />
          <Meta name="twitter:card" content="summary_large_image" />
        </Head>

        {/* post header */}
        <img
          src={post()?.image}
          alt={post()?.title}
          class="mx-auto w-full"
        />
        <h1 class="mt-4 text-4xl">{post()?.title}</h1>
        <p class="text-gray-500">
          {post()?.date} • {post()?.tags.join(" ")}
        </p>

        <hr class="my-4 border-gray-600" />

        {/* post contents */}
        <For each={
          post()!.content
            .slice(post()!.content.findIndex((block) => block && "type" in block && block.type === "divider") + 1)
        }>
          {(block) => (
            <RenderBlock block={block} />
          )}
        </For>

        {/* post footer */}
        <hr class="my-4 border-gray-600" />
        <div class="flex flex-row flex-wrap">
          <p class="float-left">
            - Derock
          </p>
          <p class="ml-auto mr-0">
            <ShareButtons />
          </p>
        </div>
      </Show>
    </div>
  )
}

export function routeData(context: RouteDataArgs) {
  return createServerData$(async ([_, slug]) => {
    const startTime = Date.now();
    const post = await getPostBySlug(slug);

    // 404 if no post
    if (!post) throw new ServerError("404 - Unknown Post");

    // return the post
    return {
      ...post,
      fetchTime: Date.now() - startTime,
    }
  }, {
    key: () => ["post", context.params.post],
    ssrLoadFrom: "server"
  })
}
