import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
} from "solid-js";

/**
 * Side-by-side toy encoder. Left panel sends every frame whole (intraframe,
 * MJPEG style), right panel sends a full frame only every GOP frames and
 * otherwise ships just the blocks that changed (interframe).
 *
 * The scene is a 16x9 block grid so "what actually got transmitted" can be
 * drawn literally: a block is either sent or it isn't.
 */

const COLS = 16;
const ROWS = 9;
const CELL = 10; // svg units per block
const FRAMES = 12;
const GOP = 6;

// Illustrative payload sizes, not measured ones. Order of magnitude matches a
// 720p MJPEG frame vs. an H.265 keyframe/delta.
const FULL_FRAME_KB = 250;
const KEYFRAME_KB = 40;
const DELTA_BASE_KB = 1.2;
const DELTA_PER_BLOCK_KB = 0.45;

const SKY = "#131f36";
const SKY_HIGH = "#0e1729";
const SUN = "#facc15";
const CLOUD = "#33456b";
const GROUND = "#1b3a2b";
const HORIZON = "#245139";
const TREE = "#3f7a4f";
const BODY = "#e5e7eb";
const NOSE = "#94a3b8";
const FLAME = "#f59e0b";

const NOT_SENT = "#0b1220";
const SENT_RING = "#38bdf8";

/** Static furniture: a sun, a cloud, two trees. None of it ever changes. */
const SUN_CELLS: [number, number][] = [
  [1, 0],
  [2, 0],
  [1, 1],
  [2, 1],
];
const CLOUD_CELLS: [number, number][] = [
  [10, 1],
  [11, 1],
  [12, 1],
  [11, 0],
];
const TREE_CELLS: [number, number][] = [
  [3, 6],
  [13, 6],
];

/** Rocket occupies a 2x3 column that walks one block right per frame. */
function rocketX(frame: number) {
  return 1 + frame;
}

function scene(frame: number): string[] {
  const cells: string[] = new Array(COLS * ROWS);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      let color = y < 2 ? SKY_HIGH : SKY;
      if (y === 7) color = HORIZON;
      if (y === 8) color = GROUND;
      cells[y * COLS + x] = color;
    }
  }

  for (const [x, y] of SUN_CELLS) cells[y * COLS + x] = SUN;
  for (const [x, y] of CLOUD_CELLS) cells[y * COLS + x] = CLOUD;
  for (const [x, y] of TREE_CELLS) cells[y * COLS + x] = TREE;

  const rx = rocketX(frame);
  for (const [dx, dy, color] of [
    [0, 2, NOSE],
    [1, 2, NOSE],
    [0, 3, BODY],
    [1, 3, BODY],
    [0, 4, FLAME],
    [1, 4, FLAME],
  ] as [number, number, string][]) {
    const x = rx + dx;
    const y = dy;
    if (x >= 0 && x < COLS) cells[y * COLS + x] = color;
  }

  return cells;
}

const FRAME_CELLS = Array.from({ length: FRAMES }, (_, i) => scene(i));

/** Blocks that differ from the previous frame. Frame 0 has no predecessor. */
const CHANGED = FRAME_CELLS.map((cells, frame) => {
  if (frame === 0) return cells.map(() => true);
  const prev = FRAME_CELLS[frame - 1];
  return cells.map((c, i) => c !== prev[i]);
});

const isKeyframe = (frame: number) => frame % GOP === 0;

const changedCount = (frame: number) =>
  CHANGED[frame].reduce((acc, c) => acc + (c ? 1 : 0), 0);

const interframeKb = (frame: number) =>
  isKeyframe(frame)
    ? KEYFRAME_KB
    : DELTA_BASE_KB + changedCount(frame) * DELTA_PER_BLOCK_KB;

const fmtKb = (kb: number) =>
  kb >= 1000 ? `${(kb / 1000).toFixed(2)} MB` : `${kb.toFixed(1)} kB`;

const BlockGrid = (props: {
  cells: string[];
  /** undefined = every block is transmitted, so nothing needs highlighting */
  sent?: boolean[];
}) => (
  <svg
    viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
    class="w-full rounded-md bg-[#0b1220]"
    role="img"
  >
    <For each={props.cells}>
      {(color, i) => {
        const x = () => (i() % COLS) * CELL;
        const y = () => Math.floor(i() / COLS) * CELL;
        const sent = () => props.sent?.[i()] ?? true;
        const highlight = () => props.sent !== undefined && sent();
        return (
          <>
            <rect
              x={x()}
              y={y()}
              width={CELL}
              height={CELL}
              fill={sent() ? color : NOT_SENT}
            />
            <rect
              x={x() + 0.3}
              y={y() + 0.3}
              width={CELL - 0.6}
              height={CELL - 0.6}
              fill="none"
              stroke={highlight() ? SENT_RING : "rgba(255,255,255,0.06)"}
              stroke-width={highlight() ? 0.8 : 0.3}
            />
          </>
        );
      }}
    </For>
  </svg>
);

const Panel = (props: {
  title: string;
  subtitle: string;
  badge: string;
  badgeClass: string;
  cells: string[];
  sentMask?: boolean[];
  blocks: string;
  size: string;
}) => (
  <div class="rounded-md border border-gray-800 bg-background/40 p-3">
    <div class="flex items-baseline justify-between gap-2">
      <span class="text-sm font-semibold text-white">{props.title}</span>
      <span
        class={`rounded px-2 py-[0.1rem] text-[0.85rem] ${props.badgeClass}`}
      >
        {props.badge}
      </span>
    </div>
    <div class="mb-2 text-[0.85rem] text-gray-400">{props.subtitle}</div>

    <BlockGrid cells={props.cells} sent={props.sentMask} />

    <div class="mt-2 flex items-baseline justify-between text-sm">
      <span class="text-gray-400">{props.blocks}</span>
      <span class="font-mono text-white">{props.size}</span>
    </div>
  </div>
);

const FrameCompression = () => {
  let containerRef!: HTMLDivElement;
  const [frame, setFrame] = createSignal(0);
  const [playing, setPlaying] = createSignal(true);
  const [visible, setVisible] = createSignal(true);

  createEffect(() => {
    if (!playing() || !visible()) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES), 700);
    onCleanup(() => clearInterval(id));
  });

  createEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(containerRef);
    onCleanup(() => observer.disconnect());
  });

  const step = (delta: number) =>
    setFrame((f) => (f + delta + FRAMES) % FRAMES);

  const cells = createMemo(() => FRAME_CELLS[frame()]);
  const key = createMemo(() => isKeyframe(frame()));
  const sentMask = createMemo(() =>
    key() ? undefined : CHANGED[frame()].slice()
  );
  const sentBlocks = createMemo(() =>
    key() ? COLS * ROWS : changedCount(frame())
  );

  // Cumulative bytes for everything sent up to and including this frame.
  const totals = createMemo(() => {
    let intra = 0;
    let inter = 0;
    for (let f = 0; f <= frame(); f++) {
      intra += FULL_FRAME_KB;
      inter += interframeKb(f);
    }
    return { intra, inter };
  });

  return (
    <div
      ref={containerRef}
      class="my-6 rounded-lg border border-gray-800 bg-card-background p-4 shadow-sm"
    >
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div class="text-sm font-semibold text-white">
            Sending the same 12 frames two ways
          </div>
          <div class="text-[0.85rem] text-gray-400">
            Lit blocks are what actually goes on the air. On the right, only the
            blocks outlined in cyan get transmitted.
          </div>
        </div>

        <div class="flex items-center gap-2 text-sm">
          <button
            class="rounded bg-gray-800 px-2 py-1 text-white hover:bg-gray-700"
            onclick={() => step(-1)}
            aria-label="Previous frame"
          >
            &#8592;
          </button>
          <button
            class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            onclick={() => setPlaying((p) => !p)}
          >
            {playing() ? "Pause" : "Play"}
          </button>
          <button
            class="rounded bg-gray-800 px-2 py-1 text-white hover:bg-gray-700"
            onclick={() => step(1)}
            aria-label="Next frame"
          >
            &#8594;
          </button>
          <span class="ml-1 font-mono text-[0.85rem] text-gray-400">
            frame {frame() + 1}/{FRAMES}
          </span>
        </div>
      </div>

      <div class="grid gap-3 md:grid-cols-2">
        <Panel
          title="Every frame on its own"
          subtitle="Intraframe, like MJPEG"
          badge="full frame"
          badgeClass="bg-amber-500/20 text-amber-300"
          cells={cells()}
          blocks={`${COLS * ROWS} of ${COLS * ROWS} blocks sent`}
          size={fmtKb(FULL_FRAME_KB)}
        />

        <Panel
          title="Only what moved"
          subtitle="Interframe, like H.264 / H.265"
          badge={key() ? "full frame" : "difference"}
          badgeClass={
            key()
              ? "bg-amber-500/20 text-amber-300"
              : "bg-emerald-500/20 text-emerald-300"
          }
          cells={cells()}
          sentMask={sentMask()}
          blocks={`${sentBlocks()} of ${COLS * ROWS} blocks sent`}
          size={fmtKb(interframeKb(frame()))}
        />
      </div>

      <div class="mt-4">
        <div class="mb-1 text-[0.85rem] text-gray-400">
          Data sent so far (frames 1&ndash;{frame() + 1})
        </div>

        <div class="flex items-center gap-2 text-[0.85rem]">
          <span class="w-24 shrink-0 text-gray-400">Intraframe</span>
          <div class="h-3 grow overflow-hidden rounded bg-background">
            <div class="h-full rounded bg-amber-500 transition-all duration-300" />
          </div>
          <span class="w-24 shrink-0 whitespace-nowrap text-right font-mono text-white">
            {fmtKb(totals().intra)}
          </span>
        </div>

        <div class="mt-1 flex items-center gap-2 text-[0.85rem]">
          <span class="w-24 shrink-0 text-gray-400">Interframe</span>
          <div class="h-3 grow overflow-hidden rounded bg-background">
            <div
              class="h-full rounded bg-emerald-500 transition-all duration-300"
              style={{
                width: `${(totals().inter / totals().intra) * 100}%`,
              }}
            />
          </div>
          <span class="w-24 shrink-0 whitespace-nowrap text-right font-mono text-white">
            {fmtKb(totals().inter)}
          </span>
        </div>
      </div>

      <div class="mt-3 text-[0.85rem] text-gray-500">
        A full frame is re-sent every {GOP} frames so a receiver tuning in late
        has something to build on. Sizes are illustrative, not measured.
      </div>
    </div>
  );
};

export default FrameCompression;
