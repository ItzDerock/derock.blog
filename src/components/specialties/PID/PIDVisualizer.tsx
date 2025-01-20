import { createSignal, onCleanup, createEffect, type Ref } from "solid-js";
import { createWorker } from "@solid-primitives/workers";
import { PID } from "./PID";

const PIDControlPanel = () => {
  let canvasRef!: HTMLCanvasElement;
  let divRef!: HTMLDivElement;
  const [worker] = createWorker(
    new PID({
      kd: 0.1,
      ki: 0.1,
      kp: 0.1,
    })
  );

  createEffect(() => {
    const canvas = canvasRef.transferControlToOffscreen();
    // Whenever this element is on screen, start the PID

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log(worker);
            worker.start(canvas);
          } else {
            worker.pause();
          }
        });
      },
      {
        root: divRef,
      }
    );

    observer.observe(canvasRef);
  });

  return (
    <div class="max-w-xl mx-auto p-4" ref={divRef}>
      <div class="border border-gray-800 rounded-lg p-4 bg-card-background shadow-sm">
        <canvas ref={canvasRef} width="100%" height="200"></canvas>

        {/* <div class="graph-container mt-4">
          <svg ref={pidGraphRef} width="100%" height="120"></svg>
        </div> */}

        <div class="mt-4">
          <div class="flex gap-2">
            {["p", "i", "d", "error"].map((component) => (
              <button
                class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                // onclick={() => toggleComponent(component)}
              >
                {component.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            class="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            // onclick={toggleControlPanel}
          >
            Configure
          </button>
        </div>

        <div
          class={`control-panel mt-4`}
          //   isControlPanelExpanded() ? "expanded" : ""
          // }`}
        >
          {["p", "i", "d"].map((component) => (
            <div class="slider-container">
              <span class="slider-label">k{component.toUpperCase()}:</span>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                // value={state()[`k${component}`]}
                oninput={
                  (e) => false
                  // updatePIDValues(`k${component}`, e.target.value)
                }
              />
              {/* <span class="value-display">{state()[`k${component}`]}</span> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PIDControlPanel;
