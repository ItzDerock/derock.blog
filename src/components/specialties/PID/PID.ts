type PIDConfig = {
  kp: number;
  ki: number;
  kd: number;
};

/**
 * PID, but the calculations happen in a web worker
 */
export class PID {
  private static UPDATE_INTERVAL = 20;
  private integral = 0;
  private prevError = 0;
  private interval: number | null = null;
  private canvas: OffscreenCanvas | null = null;
  private setpoint = 0;
  private position = 0;

  constructor(private config: PIDConfig) {}

  public start(canvas?: OffscreenCanvas) {
    this.canvas ??= canvas ?? null;
    if (this.interval) return;

    this.interval = setInterval(
      this.update.bind(this),
      PID.UPDATE_INTERVAL
    ) as unknown as number; // ts is picking up node.js types
  }

  public pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   *
   * @param config Either a completely new configuration, or a function resolving a config
   */
  public updateConfig(
    config: Partial<PIDConfig> | ((current: PIDConfig) => Partial<PIDConfig>)
  ) {
    if (typeof config === "function") {
      this.config = {
        ...this.config,
        ...config(this.config),
      };
    } else {
      this.config = {
        ...this.config,
        ...config,
      };
    }
  }

  private update() {
    this.updatePID();
    this.draw();
  }

  private updatePID() {
    const error = this.setpoint - this.position;
    this.integral += error * PID.UPDATE_INTERVAL;
    const derivative = (error - this.prevError) / PID.UPDATE_INTERVAL;

    const output =
      this.config.kp * error +
      this.config.ki * this.integral +
      this.config.kd * derivative;

    this.position = Math.max(0, Math.min(1, this.position + output * 0.016));
    this.prevError = error;
  }

  private draw() {
    if (!this.canvas) return;

    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(this.position * this.canvas.width, 0, 1, this.canvas.height);
  }
}
