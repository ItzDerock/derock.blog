import { createSitemap, UrlItem } from "sitemaps";
import { APIEvent } from "solid-start";
import server from "~/env/server";
import { getPosts } from "~/lib/notion/posts";

const DEFAULT_SITEMAP = [
  {
    loc: "/",
    changefreq: "daily",
    priority: 0.8,
  },
];

export async function GET(context: APIEvent) {
  // const sitemap = new SitemapStream({
  //   hostname: server.PUBLIC_URL
  //     ?? context.request.url
  //     ?? "https://derock.blog/",
  // });

  const basepath = new URL(
    server.PUBLIC_URL ?? context.request.url ?? "https://derock.blog/"
  ).origin;

  // add the default links
  const urls: UrlItem[] = DEFAULT_SITEMAP.map((item) => ({
    ...item,
    loc: `${basepath}${item.loc}`,
  }));

  // get all posts
  const links = await getPosts();

  // and add to sitemap
  for (const post of links) {
    urls.push({
      loc: `${basepath}/post/${encodeURIComponent(post.slug)}`,
      changefreq: "daily",
      priority: 0.8,
      lastmod: post.modified,
    });
  }

  // return the sitemap
  return new Response(
    createSitemap({
      filePath: `${basepath}/sitemap.xml`,
      urls: [...DEFAULT_SITEMAP, ...urls],
    }),
    {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control":
          "public, max-age=86400, s-maxage=3600, stale-while-revalidate",
      },
    }
  );
}
