# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three confirmed audiences, all arriving on the same surfaces:

- **Peer engineers and students searching for a specific answer.** They hit a concrete problem - VEX PID tuning, digital ATV over an SDR, a Replit desktop build on Arch, a home-server layout - and land deep-linked from search or a shared link. Their job is to extract the technique and leave; they are not browsing.
- **Evaluators (recruiters, admissions, collaborators).** They read the site as evidence about the author: depth, range, and whether the work is real. They usually enter at the homepage or a headline post and skim across several.
- **Hobbyist communities** - robotics, ham radio / SDR, homelab, CTF. They browse for interesting builds and follow along, and are the most likely to return.

## Product Purpose

A personal engineering blog at derock.blog: long-form writeups of things actually designed, built, and run, plus short informal findings. It exists to make the author's real work legible and reusable by other people, and to serve as a durable public record of it. Success means a reader either walks away able to do the thing, or walks away with an accurate sense of the depth of the work.

## Positioning

Two things a neighboring dev blog could not truthfully copy:

- **Deep buildlogs of real hardware.** The subjects are physical, shipped systems - a live video link for Duke AERO, a weather station, a competition robot, a home server rack, CTF challenges actually solved. Depth and first-hand evidence over posting frequency.
- **Interactive explainers.** Mechanism is shown, not only described: a live SolidJS PID simulator running in a worker, Mermaid diagrams, KaTeX math, real photographs and video capture from the builds.

## Operating Context

- Readers arrive substantially from search and shared deep links, so individual post pages carry as much weight as the homepage.
- Content spans wildly different domains (RF/SDR, embedded, robotics, cybersecurity, Linux, web) and different lengths (multi-thousand-word buildlogs down to a few paragraphs).
- Posts routinely mix prose with code, math, diagrams, images, video, and interactive islands.
- The site is one of two properties. The portfolio lives separately at https://derock.dev (source: `/home/derock/Documents/Code/derock.dev-v3`, Astro + Solid + Three.js) and is linked from the blog's nav and footer. **The blog carries only a brief bio; a reader who wants to know the author is sent to derock.dev.** The blog must not grow into a second portfolio.
- Confirmed problems with the current experience, in the author's words: the site reads "cluttered" and like "a wall of text" because header and content share one flat surface with no separation; the type is too large (worked around today with a `initial-scale=0.8` viewport hack rather than a real type scale); code blocks are generic syntax highlighting with no room for annotation, callouts, or filenames, and their lines are too tall; images are static and not explorable.

## Capabilities and Constraints

- Astro 5 with MDX, SolidJS islands, Tailwind 3, deployed to Vercel with `output: "server"` (pages still largely prerender). Heavy client work stays in islands.
- Two content collections, both first-class and deliberately distinct:
  - `blog` - long-form posts. Requires title, description, pubDate; optional updatedDate, heroImage, tags.
  - `bits` - short, informal TIL-style findings: quick discoveries, tips, and observations that don't warrant a full post.
- Markdown pipeline: `remark-math` + `rehype-katex`, `astro-diagram` Mermaid, custom reading-time plugin.
- Self-hosted infrastructure: Plausible analytics at stats.derock.dev, Comentario comments at comments.derock.blog. Per-post view counts are fetched server-side from the real Plausible API and fall back to `-1` on failure; they must never be faked or padded.
- RSS feed at `/rss.xml`, sitemap, tag pages at `/tags/[slug]`, and a JSON index at `/posts.json`.
- **Open decision:** the author is considering merging the blog and the portfolio into one entity. Nothing here assumes the split is permanent, and nothing should be built that makes a merge harder.

## Brand Commitments

- Name and voice: "derock.blog", author Derock X. Writing is first-person, direct, and technical without ceremony.
- **The site is deliberately simple.** Simplicity is a stated product commitment, not an unfinished state. Additions must earn their place against it.
- **Atkinson Hyperlegible is the identity and thumbnail face**, not a body-text lock. It is the typeface the post thumbnails are set in, so it stays as the brand voice; the body/reading face is open to change.
- **Post thumbnails are authored artifacts, part of the piece.** They are made deliberately for each post and add to it - never generic filler, never to be treated as decorative chrome.
- Assets on hand: `public/icons/logo_64.webp` and `logo.webp`, `public/favicon.ico`, per-post hero thumbnails in `public/thumbs/`.
- Real external identities, already linked in the footer: portfolio (derock.dev), GitHub (ItzDerock), Discord, Twitter/X (@derockgamer), RSS.

## Evidence on Hand

- Published long-form posts: Duke AERO live video link, home server, weather station, Science Olympiad robot tour, VEX Robotics PID and intro, 2025 Sunshine CTF writeup, Replit desktop on Arch Linux.
- One published bit: Raspberry Pi DATV.
- Substantial first-party media: photos, diagrams, and video captured from the actual builds, under `src/images/` per project.
- Working interactive artifact: the PID visualizer (`src/components/specialties/PID/`), Solid + web worker.
- Real usage data exists via Plausible and is already surfaced as per-post view counts.
- **Must not be fabricated:** testimonials, subscriber or follower counts, company or client logos, awards, or any view/traffic number not returned by the Plausible API.

## Product Principles

1. **The reader came for one specific thing.** Deep-linked arrivals are the norm; every post page must stand alone without the homepage's context.
2. **Show the mechanism.** Where a diagram, simulation, or photograph of the real hardware explains better than prose, that is the content - not decoration around it.
3. **Simple by commitment.** Every added element must justify itself against the site's stated simplicity; absence is the default.
4. **Evidence is first-party or absent.** Claims are backed by the author's own artifacts, data, and media, or they are not made.
5. **Two lengths, one voice.** Bits and posts differ in weight and expectation, never in credibility or care.

## Accessibility & Inclusion

Atkinson Hyperlegible is used site-wide as an explicit legibility commitment. Existing code already respects `prefers-reduced-motion` (AOS is disabled under it) - motion must remain optional, never load-bearing. Long technical content, math, and diagrams must stay readable and navigable without relying on color alone.
