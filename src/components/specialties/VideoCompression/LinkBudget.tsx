import { For } from "solid-js";

/**
 * Static picture of one flight: video bitrate wanders with how much the scene
 * is moving, RaptorQ repair fills whatever is left, and the stack always tops
 * out at the fixed on-air rate.
 *
 * Numbers come from the TX script: RAPTORQ_MUXRATE (3,594,117 bps) and the
 * encoder's -maxrate ceiling (2,300,000 bps).
 */

const TOTAL_KBPS = 3594;
const MIN_VIDEO_KBPS = 250;
const MAX_VIDEO_KBPS = 2300;

const PHASES = [
  { label: "On the pad", samples: 10, base: 480, wobble: 110 },
  { label: "Motor burn", samples: 8, base: 2180, wobble: 130 },
  { label: "Coast", samples: 14, base: 1350, wobble: 260 },
  { label: "Apogee tumble", samples: 10, base: 2050, wobble: 200 },
  { label: "Chute descent", samples: 18, base: 1150, wobble: 320 },
];

const SAMPLES = PHASES.reduce((n, p) => n + p.samples, 0);

/** Deterministic wiggle in [-1, 1] so the chart is identical on every render. */
const wiggle = (i: number) =>
  0.6 * Math.sin(i * 1.7) + 0.4 * Math.sin(i * 0.53 + 1.1);

const SERIES = PHASES.flatMap((phase, phaseIndex) =>
  Array.from({ length: phase.samples }, (_, k) => {
    const i = phaseIndex * 7 + k;
    const video = Math.min(
      MAX_VIDEO_KBPS,
      Math.max(
        MIN_VIDEO_KBPS,
        Math.round(phase.base + phase.wobble * wiggle(i))
      )
    );
    return { video, repair: TOTAL_KBPS - video, phaseIndex };
  })
);

const minRepairPct = Math.round(
  (Math.min(...SERIES.map((s) => s.repair)) / TOTAL_KBPS) * 100
);
const maxRepairPct = Math.round(
  (Math.max(...SERIES.map((s) => s.repair)) / TOTAL_KBPS) * 100
);

// Plot geometry, in svg units.
const W = 620;
const H = 190;
const PAD_L = 42;
const PAD_R = 10;
const PAD_T = 22;
const PLOT_H = 148;
const PLOT_W = W - PAD_L - PAD_R;
const BASELINE = PAD_T + PLOT_H;
const BAR_W = PLOT_W / SAMPLES;

const scaleY = (kbps: number) => (kbps / TOTAL_KBPS) * PLOT_H;

const VIDEO_FILL = "#E6B450";
const REPAIR_FILL = "#9DB88F";

const LinkBudget = () => (
  <div class="my-6 rounded-part border border-silk-faint/35 bg-mask-raised p-4 shadow-sm">
    <div class="text-sm font-semibold text-silk">
      The radio always transmits {(TOTAL_KBPS / 1000).toFixed(2)} Mb/s
    </div>
    <div class="mb-3 text-sm text-silk-dim">
      Video takes what it needs, RaptorQ repair packets take the rest.
    </div>

    <svg viewBox={`0 0 ${W} ${H}`} class="w-full" role="img">
      {/* y axis */}
      <For each={[0, 1, 2, 3]}>
        {(mb) => (
          <>
            <text
              x={PAD_L - 8}
              y={BASELINE - scaleY(mb * 1000) + 3.5}
              text-anchor="end"
              font-size="10"
              fill="#A39C8C"
            >
              {mb}
            </text>
            <line
              x1={PAD_L - 4}
              x2={PAD_L}
              y1={BASELINE - scaleY(mb * 1000)}
              y2={BASELINE - scaleY(mb * 1000)}
              stroke="#5C3A1E"
              stroke-width="1"
            />
          </>
        )}
      </For>
      <text
        x={PAD_L - 8}
        y={PAD_T - 8}
        text-anchor="end"
        font-size="9"
        fill="#A39C8C"
      >
        Mb/s
      </text>

      {/* stacked bars: video on the bottom, repair filling up to the ceiling */}
      <For each={SERIES}>
        {(s, i) => {
          const x = PAD_L + i() * BAR_W;
          const vh = scaleY(s.video);
          const rh = scaleY(s.repair);
          return (
            <>
              <rect
                x={x}
                y={BASELINE - vh}
                width={BAR_W - 0.8}
                height={vh}
                fill={VIDEO_FILL}
                opacity="0.9"
              />
              <rect
                x={x}
                y={BASELINE - vh - rh}
                width={BAR_W - 0.8}
                height={rh}
                fill={REPAIR_FILL}
                opacity="0.8"
              />
            </>
          );
        }}
      </For>

      {/* the ceiling everything adds up to */}
      <line
        x1={PAD_L}
        x2={W - PAD_R}
        y1={PAD_T}
        y2={PAD_T}
        stroke="#E9E4D7"
        stroke-width="1"
        stroke-dasharray="4 3"
      />
      <text x={PAD_L} y={PAD_T - 6} font-size="10" fill="#E9E4D7">
        3.59 Mb/s on air
      </text>

      {/* phase boundaries */}
      <For each={PHASES.slice(0, -1)}>
        {(_, i) => {
          const upto = PHASES.slice(0, i() + 1).reduce(
            (n, p) => n + p.samples,
            0
          );
          const x = PAD_L + upto * BAR_W - 0.4;
          return (
            <line
              x1={x}
              x2={x}
              y1={PAD_T}
              y2={BASELINE}
              stroke="#0C0B09"
              stroke-width="1.5"
            />
          );
        }}
      </For>

      <line
        x1={PAD_L}
        x2={W - PAD_R}
        y1={BASELINE}
        y2={BASELINE}
        stroke="#5C3A1E"
        stroke-width="1"
      />
    </svg>

    {/* phase strip, widths proportional to how long each phase lasts */}
    <div
      class="mt-1 flex gap-[2px] text-xs"
      style={{
        "margin-left": `${(PAD_L / W) * 100}%`,
        "margin-right": `${(PAD_R / W) * 100}%`,
      }}
    >
      <For each={PHASES}>
        {(phase) => (
          <div
            class="min-w-0 truncate rounded-pad bg-mask-deep px-1 py-[0.15rem] text-center text-silk-dim"
            style={{ width: `${(phase.samples / SAMPLES) * 100}%` }}
            title={phase.label}
          >
            {phase.label}
          </div>
        )}
      </For>
    </div>

    <div class="mt-3 flex flex-wrap items-center gap-4 text-sm">
      <span class="flex items-center gap-2 text-silk-dim">
        <span
          class="inline-block h-3 w-3 rounded-[2px]"
          style={{ background: VIDEO_FILL }}
        />
        H.265 video
      </span>
      <span class="flex items-center gap-2 text-silk-dim">
        <span
          class="inline-block h-3 w-3 rounded-[2px]"
          style={{ background: REPAIR_FILL }}
        />
        RaptorQ repair
      </span>
    </div>

    <div class="mt-3 text-sm text-silk-dim">
      Sitting on the pad, the picture barely changes and {maxRepairPct}% of the
      link is repair data. Under motor burn the encoder hits its ceiling and
      repair falls to {minRepairPct}%, still enough to lose a third of the
      packets and rebuild the stream. The transmitter never goes quiet.
    </div>
  </div>
);

export default LinkBudget;
