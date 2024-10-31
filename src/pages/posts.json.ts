import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

const CACHE_TIME = (24 * 60 * 60).toString(); // 1 day

export async function GET(context) {
	const posts = await getCollection('blog');

	return new Response(JSON.stringify({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.slug}/`,
		})),
	}), {
    headers: {
      "Content-Type": "application/json",

      // cache for 15 seconds
      "Cache-Control": "public, max-age=" + CACHE_TIME, // clients cache 10 seconds
      'CDN-Cache-Control': 'max-age=' + CACHE_TIME, // Downstream CDNs cache 15 seconds
      'Vercel-CDN-Cache-Control': 'max-age=' + CACHE_TIME, // Vercel CDN cache 1 seconds
    }
  });
}
