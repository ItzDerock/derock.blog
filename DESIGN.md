---
name: derock.blog
description: An engineering blog drawn as a printed circuit board fabrication drawing.
colors:
  mask: "#14120F"
  mask-raised: "#1D1A15"
  mask-deep: "#0C0B09"
  silk: "#E9E4D7"
  silk-dim: "#A39C8C"
  silk-faint: "#6E685C"
  copper: "#B0703A"
  copper-light: "#C98B5E"
  copper-deep: "#5C3A1E"
  gold: "#E6B450"
  gold-bright: "#FFD98A"
  dnp: "#D2664C"
  trace-red: "#C4553D"
  scrim: "rgb(0 0 0 / 0.82)"
  trace-cyan: "#7FB6C4"
  trace-patina: "#9DB88F"
  trace-magenta: "#D98DA6"
  trace-violet: "#A594C9"
  trace-copper-light: "#C98B5E"
typography:
  display:
    fontFamily: "Atkinson, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Atkinson, system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Atkinson, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.1em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  pad: "2px"
  part: "3px"
  board: "6px"
  fiducial: "9999px"
spacing:
  hair: "4px"
  tight: "8px"
  snug: "12px"
  base: "20px"
  section: "40px"
  zone: "72px"
components:
  part:
    backgroundColor: "{colors.mask-raised}"
    textColor: "{colors.silk}"
    rounded: "{rounded.part}"
    padding: "20px"
  part-hover:
    backgroundColor: "{colors.mask-raised}"
    textColor: "{colors.silk}"
    rounded: "{rounded.part}"
  designator:
    textColor: "{colors.copper-light}"
    typography: "{typography.label}"
  pad-link:
    textColor: "{colors.gold}"
  pad-link-hover:
    textColor: "{colors.gold-bright}"
  legend:
    textColor: "{colors.silk-dim}"
    typography: "{typography.label}"
  code-well:
    backgroundColor: "{colors.mask-deep}"
    textColor: "{colors.silk}"
    rounded: "{rounded.pad}"
    typography: "{typography.code}"
---

# derock.blog - Fab Drawing

## Overview

The site is a **fabrication drawing of a printed circuit board**, not a photograph of one. Everything is line art, legend lettering, and placed parts on a dark solder mask. This world was chosen because the author designs and builds real hardware, and because a fab drawing's entire job is what the previous design failed at: separating dense technical information into named, bounded zones without adding noise.

The discipline that keeps it from becoming kitsch: **draw, never simulate.** No FR4 photo textures, no green mask, no glossy 3D renders of components, no fake solder blobs. Hairlines, silkscreen legends, dimension marks, reference designators.

Reading always outranks the world. Every device below survives the test "does a 4,000-word post with math, code, photos, and a live simulator stay easy to read?" Anything that fails it is removed, not softened.

## Colors

Restrained strategy: a warm near-black ground, two ink weights, one accent.

| Token | Value | Role |
|---|---|---|
| `mask` | `#14120F` | The board. Page ground. Matte-black solder mask over copper reads slightly **warm**, never blue-black - this is what separates it from every dark developer blog. |
| `mask-raised` | `#1D1A15` | A part seated on the board: cards, panels, table headers, the header band. |
| `mask-deep` | `#0C0B09` | Recessed wells: code blocks, inline code, blockquote grounds. |
| `silk` | `#E9E4D7` | Silkscreen ink. Body text, headings. Chalky and warm - **never pure white**. 14.7:1 on `mask`. |
| `silk-dim` | `#A39C8C` | Secondary text, descriptions, legend prose. 6.8:1 on `mask`. |
| `silk-faint` | `#6E685C` | Hairline rules, borders, keep-out outlines, disabled. 3.4:1 - **structure and large text only, never body copy**. |
| `copper` | `#B0703A` | Traces, hairlines, the spine, and plot furniture. **Structure only - it measures 4.3:1 and must never set text.** |
| `copper-light` | `#C98B5E` | Copper *lettering*: reference designators, legend labels, the wordmark's `.blog`. The same metal one step brighter, at 6.5:1. |
| `copper-deep` | `#5C3A1E` | Pour hatching, unrouted/inactive trace segments. |
| `gold` | `#E6B450` | ENIG pad finish. **The only accent, reserved for what you can touch:** links, active nav, focus, interactive markers. 9.8:1. |
| `gold-bright` | `#FFD98A` | Probe state - hover and active only. |
| `dnp` | `#D2664C` | Do-not-populate marks: errors, 404, destructive. Used sparingly. 5.1:1, so it may set text. |

### Data traces

Charts are the one sanctioned exception to "one accent," because overlaid series need hue separation to stay readable - the same reason a scope gives each channel its own colour. The trace ramp is drawn only from materials physically present on a board: gold, copper, silkscreen, patina, and the tints in a mask.

`gold` (measured value) · `trace-cyan` (target) · `trace-red` (error) · `trace-patina` (output) · `trace-magenta` · `trace-violet` · `trace-copper-light`

Plot furniture is copper: gridlines at `copper-deep` under 35% alpha, axis borders at `copper-deep`, tick labels in `silk-dim` set in JetBrains Mono. Series are never distinguished by colour alone where the distinction carries meaning - the key sits beside the plot with a swatch and a name.

Gold is a **material**, not a light source. There are no glows, no colored halos, no neon. If an element looks like it is emitting light rather than reflecting it, it is wrong.

The site is dark-only by design - the reading scene is an engineer at a laptop, at night, mid-problem. There is no light theme, so no `dark:` variants exist anywhere.

## Typography

Three faces, each with a job the others cannot do.

- **Atkinson Hyperlegible** - display. The wordmark, post titles, section headings. It is the face the post cover art is set in, so a post's title and its thumbnail speak with one voice. Self-hosted, already present.
- **Archivo** - body. A grotesque with a high x-height and engineering-drawing neutrality, sized for a comfortable measure at long length. Self-hosted latin + latin-ext.
- **JetBrains Mono** - every technical lettering job: reference designators, legends, dates, view counts, dimensions, tables of data, and code. Self-hosted.

Silkscreen legend character comes from **treatment, not a fourth family**: JetBrains Mono at 11px, uppercase, `0.1em` tracking, weight 500.

The scale is a calm 1.2 ratio. Body is `1.0625rem` (17px) at `1.65` - the previous `initial-scale=0.8` viewport hack is deleted; the viewport meta is now plain `width=device-width, initial-scale=1`. Code is deliberately tighter and smaller than body (13px / 1.5) because code lines should be dense, not airy.

**The reading column is `40rem`, which lands at roughly 75ch in Archivo at 17px** - measured on the render, not assumed. The old 896px column at 19px was the single largest cause of the "wall of text" feeling.

Mono is licensed here only for code, data, and measurement - never as costume on prose.

## Layout

The page is a board with a **keep-out margin**. Content never touches the edge.

- Reading column: `40rem` (640px) - about 75ch.
- Board: `72rem` (1152px). Index listings sit in a narrower `58rem` inner column, because 2:1 cover art at full board width would tower over the row it belongs to.
- Media (figures, code wells, tables, diagrams, interactive islands) runs to `52rem`, wider than the measure, the way a part outgrows its silkscreen.
- At `≥1024px` a `12rem` gutter opens to the left of the reading column. It carries the spine. It is decoration-free: everything in it is a control or a label.
- Page padding: `20px` mobile, `32px` desktop.
- Vertical rhythm uses one spacing scale. **More space above a heading than below it** - `section` above, `snug` below.

Zones are bounded by hairline silkscreen outlines with a legend label set into the top-left of the rule, the way a silkscreen box names the part it encloses.

### The spine

Long posts carry a **copper trace down the left gutter**. Each `h2` in the document docks onto it as a labeled net. As the reader scrolls, the trace routes downward and the passed nets fill in; the current section's pad is gold. Pressing a net jumps to its section.

The spine is real anchored markup built from the document's own headings - it invents no content. Below `1080px` it becomes a collapsible strip under the post header. Under `prefers-reduced-motion` it renders fully routed with no animation.

## Elevation & Depth

A fab drawing is flat. Depth exists only to say **"this part sits on the board."**

- Placed parts (cards, hero figures, code wells): `0 1px 0 #0C0B09, 0 10px 24px -12px rgba(0,0,0,0.55)`. A real offset plus a soft blur.
- Everything else is flat, separated by hairlines and ground shifts.
- **No glow, no colored halo, no backdrop blur, no glass.** The previous design's radial mouse-follow glow on cards is removed.

## Shapes

Radii are near-square, because silkscreen boxes are.

- `pad` 2px - pads, plates, inline code, tags.
- `part` 3px - cards, panels, code wells, figures.
- `board` 6px - the outermost board frame only (a real board is routed with ~3mm corners).

Large rounded rectangles are the incumbent look and are gone. Borders are `1px`; a border heavier than 1px only appears as a deliberate keep-out edge. Corner fiducials - small `4px` circles - mark the board frame's corners and are the one ornamental device permitted, because a real board has them.

## Components

**Header band.** A distinct layer, not floating text: `mask-raised` ground, a `copper` hairline beneath, legend-set nav. This is the fix for "no separation." The active route carries a gold fiducial dot. Below `640px` the nav wraps to its own row beneath the wordmark - it must never overlap the wordmark.

**Placed part (index row).** A hero thumbnail seated inside a hairline outline, a reference designator above the title, the title in Atkinson, description in `silk-dim`, and a legend line of date and tags. Thumbnails are authored artwork and are rendered at a size that respects them - never a 192px strip. On hover the outline goes `copper` and the designator goes gold; no glow, no lift.

**Pad link.** Body links are `gold` with a `1px` `copper-deep` underline that becomes `gold` on hover. Focus is a `2px` gold outline with a `2px` offset - visible on every interactive element, never removed.

**Code well.** Built on Expressive Code with a custom `fab-drawing` theme on `mask-deep`. Carries a filename plate in the frame's top-left, a copy pad, line markers (inserted / deleted / highlighted) drawn as silkscreen marks in the gutter rather than full-width color washes, collapsible regions, and optional line numbers. This exists because annotation was the author's stated limitation.

**Index row.** Cover art is authored at 2:1, so its frame is 2:1 at every width and object-cover never crops it. The row header is the designator and the date at opposite ends with nothing between them: the card already has an outline, and a rule inside it is one line too many.

**A side row's height is fixed to its cover art, never derived from its text.** The row is `h-48` (192px); its 1px rules leave 190px inside; the image column is `23.75rem` (380px), which is exactly 2:1 against that 190 rather than against the 192 the row is nominally tall. The divider hangs off the *text* column, because a border on the image side would eat into its 380 and leave the box at 1.995.

That geometry is chosen by the text, not by taste: at 2:1 it makes the row tall enough for a two-line title over a three-line description, which is the worst case any post here produces (measured: 11px of headroom left at the narrowest side-by-side width). Text clamps to those limits and the column carries `overflow-hidden` so nothing can spill.

Whatever slack is left over lands in the *text* column, where the card's own surface makes it invisible. That is the whole trick, and it is worth stating plainly because the obvious approach fails: sizing the row off its text makes art fill some rows exactly and leave a dead band in others, which reads as imprecision even though every individual row is "correct". Two supporting rules:

1. **The image column has no ground of its own.** It must never carry `mask-deep` or any surface darker than the card.
2. **Side rows carry no tag chips.** They cost a line the fixed height cannot spare, and `/posts` already has a tag filter above the list. The lead row keeps them, since its art is full width and its height is free.

**Figure.** Images sit inside a hairline outline with a caption plate below. Click probes the figure: a full-viewport inspector with the caption retained, dismissed by Escape, click-outside, or the close pad.

Posts author figures three different ways - a bare markdown image, a hand-written `<figure>`, and a `<center>` block wrapping an MDX `<Image>` - and all three must render identically. The rehype pass frames and numbers what it can see and adds a `FIG. n` designator to those captions; MDX components never reach it, so CSS carries the same frame and caption treatment for `figure` and `center`, and the probe script picks up artwork in all three. Never rewrite a post's own markup to fit the system; extend the system to fit the posts.

**Table.** Header row on `mask-raised` in legend caps; hairline `silk-faint` rules; a horizontal scroll container below `640px` so a wide table never squeezes the page.

**Footer (revision block).** A drill-table row of build facts and the social pads, on `mask-raised` above a copper hairline.

## Do's and Don'ts

**Do**

- Keep every device answerable to reading. When the world and legibility conflict, legibility wins and the device is cut.
- Reserve gold for what the reader can touch. Section headings (`h1[id]`, `h2[id]`) count: they are the nets the spine links to and the anchors a reader shares. Sub-headings stay silkscreen, so a long post gets hierarchy rather than a flood of accent. If gold appears on something genuinely inert, it is a bug.
- Use reference designators as real wayfinding - stable per item, visible in the gutter, referenced in the spine.
- Let authored cover art be the largest thing in an index row; it was made for the post.
- Keep content visible by default. Nothing may start at `opacity: 0` waiting for JavaScript.
- Keep motion to the one authored moment: the spine routing. Everything else is a state change under 150ms.

**Don't**

- Don't render photographic board texture, green solder mask, or 3D component renders. This is a drawing.
- Don't add a second accent color. The palette is neutrals plus gold.
- Don't use `silk-faint` for text a reader must read.
- Don't reintroduce scroll-reveal libraries, mouse-follow glows, or gradient text.
- Don't let mono set prose.
- Don't widen the reading column past 66ch to fill space.
