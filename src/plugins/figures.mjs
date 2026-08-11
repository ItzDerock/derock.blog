import { visit } from "unist-util-visit";

const MEDIA = new Set(["img", "video"]);

/**
 * Turns a standalone image or video into a placed part: a hairline-outlined
 * figure carrying a `FIG. n` designator and, when the author wrote alt text,
 * a caption plate. Images are also marked probeable so the figure inspector
 * can pick them up.
 *
 * A paragraph that holds only media is replaced outright; anything with prose
 * beside the image is left alone, because that author meant it inline.
 */
export function rehypeFigures() {
  return (tree) => {
    let n = 0;

    // Posts often author their own <figure> with a <small> caption. Those win;
    // all this does is number them and make their artwork probeable, so an
    // authored figure and a generated one behave identically.
    visit(tree, "element", (node) => {
      if (node.tagName !== "figure") return;

      let numbered = false;
      visit(node, "element", (child) => {
        if (child.tagName === "img") {
          child.properties = {
            ...child.properties,
            "data-probe": "",
            loading: child.properties?.loading ?? "lazy",
            decoding: "async",
          };
          if (!numbered) {
            n += 1;
            numbered = true;
          }
        }
      });

      if (!numbered) return;

      const caption = node.children.find(
        (child) =>
          child.type === "element" &&
          (child.tagName === "figcaption" || child.tagName === "small")
      );
      if (!caption) return;

      caption.children.unshift({
        type: "element",
        tagName: "span",
        properties: { className: ["designator"] },
        children: [{ type: "text", value: `FIG. ${n}` }],
      });
    });

    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "p" || !parent || index === null) return;

      const media = node.children.filter(
        (child) =>
          child.type === "element" &&
          (MEDIA.has(child.tagName) || child.tagName === "picture")
      );
      const hasProse = node.children.some(
        (child) => child.type === "text" && child.value.trim() !== ""
      );
      if (hasProse || media.length !== 1) return;

      const element = media[0];
      const isVideo = element.tagName === "video";
      const caption =
        typeof element.properties?.alt === "string"
          ? element.properties.alt.trim()
          : "";
      n += 1;

      if (!isVideo) {
        element.properties = {
          ...element.properties,
          "data-probe": "",
          loading: element.properties?.loading ?? "lazy",
          decoding: "async",
        };
      }

      const children = [
        {
          type: "element",
          tagName: "div",
          properties: { className: ["figure-frame"] },
          children: [element],
        },
      ];

      if (caption) {
        children.push({
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: [
            {
              type: "element",
              tagName: "span",
              properties: { className: ["designator"] },
              children: [{ type: "text", value: `FIG. ${n}` }],
            },
            { type: "text", value: caption },
          ],
        });
      }

      parent.children[index] = {
        type: "element",
        tagName: "figure",
        properties: { className: ["post-figure"] },
        children,
      };
    });
  };
}
