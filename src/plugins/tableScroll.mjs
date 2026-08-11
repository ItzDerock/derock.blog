import { visit } from "unist-util-visit";

/**
 * Wraps every markdown table in a scroll container so a wide drill table
 * scrolls inside itself instead of squeezing the page on a phone.
 */
export function rehypeTableScroll() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "table" || !parent || index === null) return;
      if (parent.type === "element" && parent.properties?.className?.includes?.("table-scroll")) {
        return;
      }

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["table-scroll"], tabIndex: 0, role: "region" },
        children: [node],
      };
    });
  };
}
