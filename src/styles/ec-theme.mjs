/**
 * "Fab Drawing" - the Expressive Code theme for derock.blog.
 *
 * Syntax colour is the one sanctioned place where more than one hue appears,
 * because code needs hue separation to stay readable. Every colour here is a
 * material that is physically on a board: silkscreen ink, copper, ENIG gold,
 * and the green patina copper takes when it oxidises. Nothing invented.
 */
export const fabDrawing = {
  name: "fab-drawing",
  type: "dark",
  colors: {
    "editor.background": "#0C0B09",
    "editor.foreground": "#E9E4D7",
    "editorLineNumber.foreground": "#6E685C",
    "editorLineNumber.activeForeground": "#B0703A",
    "editor.selectionBackground": "#B0703A55",
    "editor.lineHighlightBackground": "#1D1A15",
    "terminal.background": "#0C0B09",
    "terminal.foreground": "#E9E4D7",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: "#8A8375", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "keyword.control",
        "keyword.operator.new",
        "variable.language",
        "constant.language",
        "support.type.primitive",
      ],
      settings: { foreground: "#E6B450" },
    },
    {
      scope: ["string", "string.quoted", "constant.other.symbol", "meta.embedded.line"],
      settings: { foreground: "#9DB88F" },
    },
    {
      scope: [
        "constant.numeric",
        "constant.character",
        "constant.other",
        "keyword.other.unit",
      ],
      settings: { foreground: "#C98B5E" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call",
        "entity.name.tag",
      ],
      settings: { foreground: "#F0EADC" },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "support.class",
        "support.type",
        "entity.other.inherited-class",
      ],
      settings: { foreground: "#D9B98C" },
    },
    {
      scope: [
        "variable",
        "variable.other",
        "meta.definition.variable",
        "variable.parameter",
      ],
      settings: { foreground: "#C9C3B4" },
    },
    {
      scope: [
        "punctuation",
        "meta.brace",
        "keyword.operator",
        "punctuation.separator",
        "punctuation.terminator",
      ],
      settings: { foreground: "#8A8375" },
    },
    {
      scope: ["entity.other.attribute-name", "support.type.property-name"],
      settings: { foreground: "#B0703A" },
    },
    {
      scope: ["markup.inserted", "markup.heading"],
      settings: { foreground: "#9DB88F" },
    },
    {
      scope: ["markup.deleted", "invalid"],
      settings: { foreground: "#C4553D" },
    },
  ],
};

/** Frames, gutters and markers drawn as silkscreen rather than colour washes. */
export const fabStyleOverrides = {
  borderRadius: "3px",
  borderColor: "#6E685C59",
  borderWidth: "1px",
  codeFontFamily: '"JetBrains Mono", ui-monospace, monospace',
  codeFontSize: "0.8125rem",
  codeLineHeight: "1.5",
  codePaddingBlock: "0.9rem",
  codePaddingInline: "1.1rem",
  uiFontFamily: '"JetBrains Mono", ui-monospace, monospace',
  uiFontSize: "0.6875rem",
  frames: {
    shadowColor: "transparent",
    editorActiveTabBackground: "#1D1A15",
    editorActiveTabForeground: "#E9E4D7",
    editorActiveTabBorderColor: "#6E685C59",
    editorActiveTabIndicatorTopColor: "transparent",
    editorActiveTabIndicatorBottomColor: "#B0703A",
    editorTabBarBackground: "#14120F",
    editorTabBarBorderBottomColor: "#6E685C59",
    editorBackground: "#0C0B09",
    terminalTitlebarBackground: "#1D1A15",
    terminalTitlebarForeground: "#A39C8C",
    terminalTitlebarBorderBottomColor: "#6E685C59",
    terminalBackground: "#0C0B09",
    inlineButtonForeground: "#A39C8C",
    inlineButtonBackground: "#E6B450",
    inlineButtonBorder: "#6E685C",
    tooltipSuccessBackground: "#1D1A15",
    tooltipSuccessForeground: "#E6B450",
  },
  textMarkers: {
    markBackground: "#B0703A26",
    markBorderColor: "#B0703A",
    insBackground: "#9DB88F1F",
    insBorderColor: "#9DB88F",
    insDiffIndicatorColor: "#9DB88F",
    delBackground: "#C4553D1F",
    delBorderColor: "#C4553D",
    delDiffIndicatorColor: "#C4553D",
    lineMarkerAccentMargin: "0.3rem",
    lineMarkerAccentWidth: "2px",
  },
  lineNumbers: {
    foreground: "#6E685C",
    highlightForeground: "#B0703A",
  },
  collapsibleSections: {
    closedBackgroundColor: "#1D1A15",
    closedTextColor: "#A39C8C",
    closedBorderColor: "#6E685C59",
    closedPadding: "0.35rem 1.1rem",
    openBackgroundColor: "transparent",
  },
};
