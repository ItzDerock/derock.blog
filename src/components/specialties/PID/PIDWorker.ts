/**
 * Wraps the PID.ts class and handles communication
 */

import { PID, type PIDConfig } from "./PID";

export type PIDMessageInit = {
  type: "init";
  canvases: ConstructorParameters<typeof PID>[0];
  config: Partial<PIDConfig>;
};

export type PIDMessageConfigUpdate = {
  type: "configUpdate";
  config: Partial<PIDConfig>;
};

export type PIDMessagePause = {
  type: "pause";
};

export type PIDMessageStart = {
  type: "start";
};

export type PIDMessageResize = {
  type: "resize";
  width: number;
  height: number;
};

export type PIDMessageReset = {
  type: "reset";
};

export type PIDMessage =
  | PIDMessageInit
  | PIDMessageConfigUpdate
  | PIDMessagePause
  | PIDMessageStart
  | PIDMessageResize
  | PIDMessageReset;

let PIDInstance: PID | null = null;

onmessage = (event) => {
  const message = event.data as PIDMessage;
  if (message.type === "init") {
    if (PIDInstance != null) {
      console.warn("PID instance already exists, overwriting");
    }

    PIDInstance = new PID(message.canvases, message.config);
  }

  if (!PIDInstance) {
    console.error("PID instance not initialized");
    return;
  }

  switch (message.type) {
    case "configUpdate":
      PIDInstance.updateConfig(message.config);
      break;
    case "pause":
      PIDInstance.pause();
      break;
    case "start":
      PIDInstance.start();
      break;
    case "resize":
      PIDInstance.resize(message.width, message.height);
      break;
    case "reset":
      PIDInstance.destroy();
      const { config, canvases } = PIDInstance.getConfig();
      PIDInstance = null;
      PIDInstance = new PID(canvases, config);
      break;
  }
};
