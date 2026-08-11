import { getPublished } from "./content";

/**
 * Reference designators.
 *
 * Every piece on this site is a part on the board, and parts are numbered in
 * build order: the first thing published is U1 and stays U1 forever. Numbering
 * by publication date (rather than by position in whatever list is on screen)
 * means a designator is a permanent name for a post, so it can be referenced
 * from an index, a post header, and the spine and always mean the same thing.
 *
 * Posts are ICs (U). Bits are test points (TP) - small, quick, probed once.
 */
const PREFIX = { blog: "U", bits: "TP" } as const;

type Named = keyof typeof PREFIX;

const cache = new Map<Named, Map<string, string>>();

async function build(collection: Named) {
  const entries = await getPublished(collection);
  const ordered = [...entries].reverse();

  const map = new Map<string, string>();
  ordered.forEach((entry, index) => {
    map.set(entry.slug, `${PREFIX[collection]}${index + 1}`);
  });

  return map;
}

export async function getDesignators(collection: Named) {
  const cached = cache.get(collection);
  if (cached) return cached;

  const map = await build(collection);
  cache.set(collection, map);
  return map;
}

export async function getDesignator(collection: Named, slug: string) {
  const map = await getDesignators(collection);
  return map.get(slug) ?? `${PREFIX[collection]}?`;
}
