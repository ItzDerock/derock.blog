import {
  createEffect,
  createMemo,
  createSignal,
  Index,
  onCleanup,
} from "solid-js";

/**
 * LED scheduling explainer for the PCB business card post.
 *
 * Every LED is PWM'd, so an LED is only drawing current during the on part of
 * its window. The firmware staggers those windows around the period so the
 * battery never sees more than one LED's current at a time. This widget
 * re-implements that greedy scheduler (same shape as `schedule_phases` in
 * led.rs below) and draws the period it produces, plus the load the battery
 * actually sees.
 */

const SLOTS = 100;
const LEDS = 8;
// (3.0V - 1.6V) / 150 ohm, the per-LED current from the post's calculation.
const MA_PER_LED = 9.33;

// All eight LEDs on the board are the same warm amber-white color.
const LED_COLOR = "#FFD98A";

const GOLD = "#E6B450";
const GRID = "#5C3A1E";
const TRACK = "#14120F";
const DIM = "#A39C8C";
const CURSOR = "#E9E4D7";
const MONO = "JetBrains Mono, ui-monospace, monospace";

const ACTIVITY_PRESETS = {
  low: [20, 0, 15, 0, 10, 5, 0, 0],
  medium: [20, 35, 15, 10, 5, 5, 0, 0],
  busy: [65, 75, 55, 70, 45, 60, 50, 80],
} as const;

type Activity = keyof typeof ACTIVITY_PRESETS;

type Placement = { offset: number; duty: number };

/** The firmware's greedy peak-minimizing scheduler, in slot units of 1/100. */
function scheduleStaggered(duties: number[]): Placement[] {
  const result: Placement[] = duties.map((duty) => ({ offset: 0, duty }));
  const order = duties
    .map((duty, i) => ({ duty, i }))
    .sort((a, b) => b.duty - a.duty || a.i - b.i);

  const load = new Array<number>(SLOTS).fill(0);
  const prefix = new Array<number>(2 * SLOTS + 1).fill(0);

  for (const { duty: rawDuty, i } of order) {
    const duty = Math.min(rawDuty, SLOTS);
    if (duty === 0) continue;

    // Unroll load[] once around the circle so every circular window
    // [offset, offset+duty) becomes a flat range sum via prefix[].
    for (let k = 0; k < SLOTS + duty; k++) {
      prefix[k + 1] = prefix[k] + load[k % SLOTS];
    }

    // Pick the offset whose window has the least total overlap.
    let bestOffset = 0;
    let bestSum = Number.MAX_SAFE_INTEGER;
    for (let offset = 0; offset < SLOTS; offset++) {
      const sum = prefix[offset + duty] - prefix[offset];
      if (sum < bestSum) {
        bestSum = sum;
        bestOffset = offset;
        if (sum === 0) break;
      }
    }

    for (let k = 0; k < duty; k++) load[(bestOffset + k) % SLOTS] += 1;
    result[i] = { offset: bestOffset, duty };
  }

  return result;
}

const X0 = 46;
const X1 = 712;
const W = X1 - X0;
const SLOT_W = W / SLOTS;
const ROW_H = 22;
const ROW_STEP = 28;
const ROWS_TOP = 10;
const LOAD_LABEL_Y = 246;
const LOAD_TOP = 252;
const LOAD_H = 56; // 7px per LED level, so the peak reads against the grid
const LOAD_BOTTOM = LOAD_TOP + LOAD_H;
const TICK_Y = 324;
const SVG_H = 332;

const LedScheduling = () => {
  let containerRef!: HTMLDivElement;
  const [activity, setActivity] = createSignal<Activity>("medium");
  const duties = createMemo<number[]>(() => [...ACTIVITY_PRESETS[activity()]]);
  const [staggered, setStaggered] = createSignal(true);
  const [realTime, setRealTime] = createSignal(false);
  const [slot, setSlot] = createSignal(0);
  const [playing, setPlaying] = createSignal(true);
  const [visible, setVisible] = createSignal(true);

  createEffect(() => {
    if (!playing() || !visible() || realTime()) return;
    const id = setInterval(() => setSlot((s) => (s + 1) % SLOTS), 45);
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

  const placements = createMemo(() =>
    staggered()
      ? scheduleStaggered(duties())
      : duties().map((duty): Placement => ({ offset: 0, duty }))
  );

  const loadBySlot = createMemo(() => {
    const load = new Array<number>(SLOTS).fill(0);
    for (const { offset, duty } of placements()) {
      for (let k = 0; k < duty; k++) load[(offset + k) % SLOTS] += 1;
    }
    return load;
  });

  const peak = createMemo(() =>
    loadBySlot().reduce((a, b) => Math.max(a, b), 0)
  );
  const peakMa = createMemo(() => peak() * MA_PER_LED);
  const averageMa = createMemo(
    () => (duties().reduce((a, b) => a + b, 0) / SLOTS) * MA_PER_LED
  );
  const allAtOncePeak = createMemo(
    () => duties().filter((duty) => duty > 0).length * MA_PER_LED
  );
  const staggeredPeakMa = createMemo(() => {
    const load = new Array<number>(SLOTS).fill(0);
    for (const { offset, duty } of scheduleStaggered(duties())) {
      for (let k = 0; k < duty; k++) load[(offset + k) % SLOTS] += 1;
    }
    return Math.max(...load) * MA_PER_LED;
  });

  const isLit = (i: number, t: number) => {
    const { offset, duty } = placements()[i];
    if (duty === 0) return false;
    return (((t - offset) % SLOTS) + SLOTS) % SLOTS < duty;
  };

  const rowY = (i: number) => ROWS_TOP + i * ROW_STEP;
  const slotX = (t: number) => X0 + t * SLOT_W;

  const cursorX = () => slotX(slot()) + SLOT_W / 2;
  const perceivedBrightness = (duty: number) =>
    duty === 0 ? 0.08 : 0.22 + 0.78 * Math.sqrt(duty / 100);

  return (
    <div
      ref={containerRef}
      class="my-6 rounded-part border border-silk-faint/35 bg-mask-raised p-4 shadow-sm"
    >
      <div class="mb-4">
        <div>
          <div class="text-sm font-semibold text-silk">
            What the battery sees
          </div>
          <div class="text-sm text-silk-dim">
            {realTime()
              ? "At 800 Hz, your eyes blend each LED's flashes into steady light. The battery still supplies every short pulse."
              : "One 1.25 ms cycle, slowed down so you can follow which LEDs are drawing current."}
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <div>
            <div class="legend mb-1.5 text-silk-dim">ACTIVITY</div>
            <div class="flex flex-wrap gap-2">
              {(
                [
                  ["low", "Low"],
                  ["medium", "Medium"],
                  ["busy", "Very busy"],
                ] as const
              ).map(([value, label]) => (
                <button
                  class={
                    activity() === value
                      ? "control border-gold text-gold"
                      : "control"
                  }
                  onclick={() => setActivity(value)}
                  aria-pressed={activity() === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div class="legend mb-1.5 text-silk-dim">TIMING</div>
            <div class="flex gap-2">
              <button
                class={
                  staggered() ? "control border-gold text-gold" : "control"
                }
                onclick={() => setStaggered(true)}
                aria-pressed={staggered()}
              >
                Staggered
              </button>
              <button
                class={
                  !staggered() ? "control border-gold text-gold" : "control"
                }
                onclick={() => setStaggered(false)}
                aria-pressed={!staggered()}
              >
                Together
              </button>
            </div>
          </div>

          <div>
            <div class="legend mb-1.5 text-silk-dim">VIEW</div>
            <div class="flex gap-2">
              <button
                class={
                  !realTime() ? "control border-gold text-gold" : "control"
                }
                onclick={() => setRealTime(false)}
                aria-pressed={!realTime()}
              >
                Slow cycle
              </button>
              <button
                class={realTime() ? "control border-gold text-gold" : "control"}
                onclick={() => setRealTime(true)}
                aria-pressed={realTime()}
              >
                At 800 Hz
              </button>
            </div>
          </div>
        </div>
      </div>

      {realTime() && (
        <div class="mb-3 grid gap-3 rounded-part border border-silk-faint/25 bg-mask-deep p-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div class="legend text-silk-dim">WHAT YOUR EYES SEE</div>
            <div
              class="mt-2 flex flex-wrap gap-3"
              aria-label="Eight LEDs shown at their perceived steady brightness"
            >
              <Index each={duties()}>
                {(duty) => (
                  <div class="flex flex-col items-center gap-1">
                    <span
                      class="h-7 w-7 rounded-full border"
                      style={{
                        background: LED_COLOR,
                        opacity: perceivedBrightness(duty()),
                        "border-color": LED_COLOR,
                        "box-shadow":
                          duty() > 0 ? `0 0 12px ${LED_COLOR}66` : "none",
                      }}
                    />
                    <span class="font-mono text-xs text-silk-dim">
                      {duty()}%
                    </span>
                  </div>
                )}
              </Index>
            </div>
          </div>
          <div class="max-w-56 text-sm text-silk-dim sm:text-right">
            The flashes are too fast for your eyes or this screen to show. They
            look like steady brightness.
          </div>
        </div>
      )}

      <svg
        viewBox={`0 0 720 ${SVG_H}`}
        class="w-full rounded-part bg-mask-deep"
        role="img"
        aria-label="One PWM period divided into 100 slots. Each row shows when an LED is on. The gold graph shows how many LEDs draw current at the same time."
      >
        {/* slot gridlines, shared by the rows and the load strip */}
        {Array.from({ length: SLOTS / 10 + 1 }, (_, g) => g * 10).map((t) => (
          <line
            x1={slotX(t)}
            x2={slotX(t)}
            y1={ROWS_TOP}
            y2={LOAD_BOTTOM}
            stroke={GRID}
            stroke-width={t === 0 || t === SLOTS ? 0.9 : 0.5}
            stroke-opacity={0.45}
          />
        ))}

        {/* one row per LED: dot, label, track, on-window */}
        <Index each={placements()}>
          {(p, i) => (
            <g>
              <circle
                cx={14}
                cy={rowY(i) + ROW_H / 2}
                r={5}
                fill={realTime() || isLit(i, slot()) ? LED_COLOR : "none"}
                fill-opacity={realTime() ? perceivedBrightness(p().duty) : 1}
                stroke={LED_COLOR}
                stroke-opacity={0.55}
                stroke-width={1.2}
              />
              <text
                x={38}
                y={rowY(i) + ROW_H / 2 + 3.5}
                text-anchor="end"
                font-family={MONO}
                font-size="10"
                fill={DIM}
              >
                {i + 1}
              </text>
              <rect x={X0} y={rowY(i)} width={W} height={ROW_H} fill={TRACK} />
              {(() => {
                const { offset, duty } = p();
                if (duty === 0) return null;
                // windows can wrap around the end of the period
                const first = Math.min(duty, SLOTS - offset);
                const segs = [{ x: slotX(offset), w: first * SLOT_W }];
                if (duty > first)
                  segs.push({ x: X0, w: (duty - first) * SLOT_W });
                return segs.map((seg) => (
                  <rect
                    x={seg.x}
                    y={rowY(i) + 4}
                    width={Math.max(seg.w, 3)}
                    height={ROW_H - 8}
                    rx={2}
                    fill={LED_COLOR}
                    opacity={isLit(i, slot()) && !realTime() ? 1 : 0.6}
                  />
                ));
              })()}
            </g>
          )}
        </Index>

        {/* the battery's view: LEDs on during each slot */}
        <text
          x={X0}
          y={LOAD_LABEL_Y}
          font-family={MONO}
          font-size="9.5"
          letter-spacing="1"
          fill={DIM}
        >
          BATTERY LOAD · NUMBER OF LEDS ON
        </text>
        <rect x={X0} y={LOAD_TOP} width={W} height={LOAD_H} fill={TRACK} />
        {Array.from({ length: LEDS }, (_, c) => c + 1).map((c) => (
          <line
            x1={X0}
            x2={X1}
            y1={LOAD_BOTTOM - c * (LOAD_H / LEDS)}
            y2={LOAD_BOTTOM - c * (LOAD_H / LEDS)}
            stroke={GRID}
            stroke-width={0.5}
            stroke-dasharray="2 4"
            stroke-opacity={0.5}
          />
        ))}
        {loadBySlot().map((count, t) =>
          count > 0 ? (
            <rect
              x={slotX(t) + 0.7}
              y={LOAD_BOTTOM - count * (LOAD_H / LEDS)}
              width={SLOT_W - 1.4}
              height={count * (LOAD_H / LEDS)}
              fill={GOLD}
              opacity={0.9}
            />
          ) : null
        )}

        {/* The cursor is only useful when one cycle is slowed down. */}
        {!realTime() && (
          <line
            x1={cursorX()}
            x2={cursorX()}
            y1={6}
            y2={LOAD_BOTTOM}
            stroke={CURSOR}
            stroke-width={1}
            stroke-dasharray="3 3"
            opacity={0.8}
          />
        )}

        {[0, 25, 50, 75, 100].map((t) => (
          <text
            x={slotX(t)}
            y={TICK_Y}
            font-family={MONO}
            font-size="9.5"
            fill={DIM}
            text-anchor={t === 0 ? "start" : t === 100 ? "end" : "middle"}
          >
            {t}
          </text>
        ))}
      </svg>

      <div class="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div class="flex flex-wrap items-center gap-2">
          {!realTime() && (
            <button
              class="control-primary"
              onclick={() => setPlaying((p) => !p)}
            >
              {playing() ? "Pause" : "Play"}
            </button>
          )}
          <span class="ml-1 font-mono text-sm text-silk-dim">
            {realTime() ? "800 cycles/s" : `step ${slot() + 1} of ${SLOTS}`}
          </span>
        </div>

        <div
          class="flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm"
          aria-live="polite"
        >
          <span>
            <span class="text-silk-dim">peak </span>
            <span class="text-gold">{peakMa().toFixed(1)} mA</span>
            <span class="text-silk-dim">
              {" "}
              ({peak()} LED{peak() === 1 ? "" : "s"})
            </span>
          </span>
          <span>
            <span class="text-silk-dim">average </span>
            <span class="text-silk">{averageMa().toFixed(1)} mA</span>
          </span>
        </div>
      </div>

      <div class="mt-3 text-sm text-silk-dim">
        Staggering cuts the peak from {allAtOncePeak().toFixed(1)} mA to{" "}
        {staggeredPeakMa().toFixed(1)} mA for this preset. It does not change
        the average draw or visible brightness. One lit LED draws about
        9.3&thinsp;mA.
      </div>
    </div>
  );
};

export default LedScheduling;
