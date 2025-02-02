import { createSignal, onCleanup, createEffect, Show } from "solid-js";
import type { PIDMessage, PIDMessageInit } from "./PIDWorker";
import type { PIDConfig } from "./PID";

const PIDControlPanel = (props: {
  initialKp?: number;
  initialKi?: number;
  initialKd?: number;
  hideKp?: boolean;
  hideKi?: boolean;
  hideKd?: boolean;
}) => {
  let graphCanvasRef!: HTMLCanvasElement;
  let visCanvasRef!: HTMLCanvasElement;
  let divRef!: HTMLDivElement;
  let [postMessage, setPostMessage] =
    createSignal<(message: PIDMessage) => void>();
  const [isNotSupported, setIsNotSupported] = createSignal<string | null>(null);
  const initialConfig = {
    showP: !(props.hideKp ?? false),
    showI: !(props.hideKi ?? false),
    showD: !(props.hideKd ?? false),
    kp: props.initialKp ?? 0.1,
    ki: props.initialKi ?? 0.1,
    kd: props.initialKd ?? 0.1,
  } satisfies Partial<PIDConfig>;

  const toggleGraphComponent = (component: "p" | "i" | "d" | "error") => {
    return (event: Event) => {
      // captialize first letter
      const componentName = (component[0].toUpperCase() +
        component.slice(1)) as "P" | "I" | "D" | "Error";
      const checked = (event.target as HTMLInputElement).checked;

      postMessage()?.({
        type: "configUpdate",
        config: {
          [`show${componentName}`]: checked,
        },
      });
    };
  };

  createEffect(() => {
    if (!graphCanvasRef.transferControlToOffscreen) {
      setIsNotSupported("OffscreenCanvas is not supported in this browser.");
      return;
    }

    if (!window.Worker) {
      setIsNotSupported("Web Workers are not supported in this browser.");
      return;
    }

    const graphCanvas = graphCanvasRef.transferControlToOffscreen();
    const visCanvas = visCanvasRef.transferControlToOffscreen();
    const worker = new Worker(new URL("./PIDWorker.ts", import.meta.url), {
      type: "module",
    });

    worker.postMessage(
      {
        type: "init",
        canvases: {
          graph: graphCanvas,
          vis: visCanvas,
        },
        config: initialConfig,
      } satisfies PIDMessageInit,
      [graphCanvas, visCanvas]
    );

    setPostMessage(() => worker.postMessage.bind(worker));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          worker.postMessage({ type: "start" });
        } else {
          worker.postMessage({ type: "pause" });
        }
      });
    });

    observer.observe(graphCanvasRef);

    onCleanup(() => {
      observer.unobserve(graphCanvasRef);
      worker.terminate();
    });
  });

  // resize the canvas to fit the container
  createEffect(() => {
    const resizeCanvas = () => {
      // subtract 1rem from the parent width to account for padding
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );

      postMessage()?.({
        type: "resize",
        width: graphCanvasRef.parentElement!.clientWidth - rem * 2,
        height: 200,
      });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    onCleanup(() => window.removeEventListener("resize", resizeCanvas));
  });

  return (
    <div class="max-w-xl mx-auto p-4" ref={divRef}>
      <div class="border border-gray-800 rounded-lg p-4 bg-card-background shadow-sm relative">
        <Show when={isNotSupported()}>
          <div class="inset-0 absolute mt-4">
            <div class="text-red-500 text-center">
              {isNotSupported()}
              <br />
              Modern browsers released after 2023 should support this feature.
            </div>
          </div>
        </Show>
        <noscript>
          <div class="text-red-500 text-center">
            This feature requires JavaScript to be enabled.
          </div>
        </noscript>

        <canvas ref={visCanvasRef} height="60px"></canvas>
        <canvas ref={graphCanvasRef} height="200px"></canvas>

        <div class="mt-4">
          <div class="flex gap-2">
            {["p", "i", "d", "error"].map((component) => (
              <>
                <input
                  type="checkbox"
                  id={`show-${component}`}
                  checked={true}
                  onchange={toggleGraphComponent(
                    component as "p" | "i" | "d" | "error"
                  )}
                />
                <label for={`show-${component}`}>{component}</label>
              </>
            ))}
          </div>
          <button
            class="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onclick={postMessage()?.bind(null, { type: "reset" })}
          >
            Reset
          </button>
        </div>

        <div class="mt-4">
          {(["p", "i", "d"] as const).map((component) => (
            <div class="slider-container">
              <span class="slider-label">k{component.toUpperCase()}:</span>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                oninput={(event) => {
                  postMessage()?.({
                    type: "configUpdate",
                    config: {
                      [`k${component}`]: parseFloat(event.target.value),
                    },
                  });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PIDControlPanel;
