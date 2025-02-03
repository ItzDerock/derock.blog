import { createSignal, onCleanup, createEffect, Show } from "solid-js";
import type { PIDMessage, PIDMessageInit } from "./PIDWorker";
import type { PIDConfig } from "./PID";
import { PID_COLORS } from "./PIDConstants";

const PID_COMPONENTS = [
  "P",
  "I",
  "D",
  "Error",
  "Output",
  "Setpoint",
  "Position",
] as const;

const PIDControlPanel = (props: {
  initialKp?: number;
  initialKi?: number;
  initialKd?: number;
  hideKp?: boolean;
  hideKi?: boolean;
  hideKd?: boolean;
  hideError?: boolean;
  hideOutput?: boolean;
  hideSetpoint?: boolean;
  hidePosition?: boolean;
  disableControls?: boolean;
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
    showError: !(props.hideError ?? false),
    showOutput: !(props.hideOutput ?? false),
    showSetpoint: !(props.hideSetpoint ?? false),
    showPosition: !(props.hidePosition ?? false),
  } satisfies Partial<PIDConfig>;

  const [pidKValues, setPidKValues] = createSignal({
    kp: initialConfig.kp,
    ki: initialConfig.ki,
    kd: initialConfig.kd,
  });

  const [showConfig, setShowConfig] = createSignal({
    showP: initialConfig.showP,
    showI: initialConfig.showI,
    showD: initialConfig.showD,
    showError: initialConfig.showError,
    showOutput: initialConfig.showOutput,
    showSetpoint: initialConfig.showSetpoint,
    showPosition: initialConfig.showPosition,
  });

  const toggleGraphComponent = (component: (typeof PID_COMPONENTS)[number]) => {
    return (event: Event) => {
      // captialize first letter
      const checked = (event.target as HTMLInputElement).checked;
      setShowConfig((prev) => ({
        ...prev,
        [`show${component}`]: checked,
      }));

      postMessage()?.({
        type: "configUpdate",
        config: {
          [`show${component}`]: checked,
        },
      });
    };
  };

  const setKValue = (component: "p" | "i" | "d") => {
    return (event: Event & { target: { value: string } }) => {
      let parsed = parseFloat(event.target.value);
      if (isNaN(parsed)) {
        parsed = 0;
      }

      setPidKValues((prev) => ({
        ...prev,
        [`k${component}`]: parsed,
      }));
      postMessage()?.({
        type: "configUpdate",
        config: {
          [`k${component}`]: parsed,
        },
      });
    };
  };

  const resetAll = () => {
    setPidKValues({
      kp: initialConfig.kp,
      ki: initialConfig.ki,
      kd: initialConfig.kd,
    });

    setShowConfig({
      showP: initialConfig.showP,
      showI: initialConfig.showI,
      showD: initialConfig.showD,
      showError: initialConfig.showError,
      showOutput: initialConfig.showOutput,
      showSetpoint: initialConfig.showSetpoint,
      showPosition: initialConfig.showPosition,
    });

    postMessage()?.({ type: "reset" });
    postMessage()?.({ type: "configUpdate", config: initialConfig });
    postMessage()?.({ type: "start" });
  };

  const resetPosition = () => {
    postMessage()?.({ type: "updatePosition", position: 0 });
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            worker.postMessage({ type: "start" });
          } else {
            worker.postMessage({ type: "pause" });
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

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
        width: graphCanvasRef.parentElement!.clientWidth,
        height: 200,
      });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    onCleanup(() => window.removeEventListener("resize", resizeCanvas));
  });

  return (
    <div class="md:max-w-none max-w-xl mx-auto py-4" ref={divRef}>
      <div class="border border-gray-800 rounded-lg p-4 bg-card-background shadow-sm relative flex flex-col gap-4 md:flex-row">
        <div class="max-w-xl w-full">
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

          <canvas ref={visCanvasRef} height="60px" class="mb-2"></canvas>
          <canvas ref={graphCanvasRef} height="200px"></canvas>
        </div>

        <div>
          <h2 class="!text-sm !text-gray-300 font-semibold mt-4">
            Key &amp; Config
          </h2>

          <div class="grid md:grid-cols-1 grid-cols-3 gap-4">
            <div class="grid md:grid-cols-1 grid-cols-2  col-span-2 md:col-span-1">
              {PID_COMPONENTS.filter(
                (component) =>
                  !props.disableControls || initialConfig[`show${component}`]
              ).map((component) => (
                <div class="block">
                  <Show when={!props.disableControls}>
                    <input
                      type="checkbox"
                      id={`show-${component}`}
                      checked={showConfig()[`show${component}`]}
                      onchange={toggleGraphComponent(component)}
                    />
                  </Show>
                  <label
                    for={`show-${component}`}
                    class="capitalize ml-1 align-middle"
                  >
                    <span
                      class="w-3 h-3 mr-1 rounded-full"
                      style={{
                        "background-color":
                          PID_COLORS[
                            `${component.toUpperCase()}_COLOR` as keyof typeof PID_COLORS
                          ],
                      }}
                    >
                      &nbsp;
                    </span>
                    <span class="inline-block">{component}</span>
                  </label>
                </div>
              ))}
            </div>

            <div>
              {(["p", "i", "d"] as const).map((component) => (
                <div class="slider-container flex flex-row gap-1 font-mono align-middle">
                  <span class="slider-label">k{component.toUpperCase()}</span>

                  <input
                    type="number"
                    step="0.1"
                    value={pidKValues()[`k${component}`]}
                    oninput={setKValue(component)}
                    class="text-sm bg-background rounded-md p-1 max-w-32"
                    disabled={props.disableControls}
                  />
                </div>
              ))}

              <button
                class="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 block"
                onclick={resetAll}
              >
                Reset Simulation
              </button>

              <Show when={!props.disableControls}>
                <button
                  class="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 block"
                  onclick={resetPosition}
                >
                  Reset Position
                </button>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PIDControlPanel;
