import { getCollection, type CollectionEntry } from "astro:content";

/**
 * The one way anything on this site reads a collection.
 *
 * Drafts are excluded here rather than at each call site, so an unfinished
 * post cannot reach a listing, a feed, a tag page, or a route by being
 * forgotten in one place. Everything comes back newest first.
 */
export async function getPublished<C extends "blog" | "bits">(collection: C) {
  const entries = (await getCollection(collection)) as CollectionEntry<C>[];

  return entries
    .filter((entry) => !(entry.data as { draft?: boolean }).draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}
