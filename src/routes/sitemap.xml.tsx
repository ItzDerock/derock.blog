import { SitemapStream, streamToPromise } from "sitemap";
import { APIEvent } from "solid-start";
import server from "~/env/server";
import { getPosts } from "~/lib/notion/posts";

const DEFAULT_SITEMAP = [
  {
    url: "/",
    changefreq: "daily",
    priority: 0.8
  }
];

export async function GET(context: APIEvent) {
  const sitemap = new SitemapStream({
    hostname: server.PUBLIC_URL
      ?? context.request.url
      ?? "https://derock.blog/",
  });

  // add the default links
  DEFAULT_SITEMAP.forEach(
    (link) => sitemap.write(link)
  );

  // get all posts
  const links = await getPosts();

  // and add to sitemap
  for (const post of links) {
    sitemap.write({
      url: `/post/${encodeURIComponent(post.slug)}`,
      changefreq: 'daily',
      priority: 0.8,
      lastmod: post.modified
    });
  }

  // end the stream
  sitemap.end();

  // return the sitemap
  return new Response(
    await streamToPromise(sitemap)
      .then(data => data.toString()),
    {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400, s-maxage=3600, stale-while-revalidate"
      }
    }
  );
}
