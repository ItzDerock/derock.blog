import { Chart } from "chart.js/auto";
import { PID_COLORS } from "./PIDConstants";
import { Robot } from "./Robot";

export type PIDConfig = {
  kp: number;
  ki: number;
  kd: number;

  showP: boolean;
  showI: boolean;
  showD: boolean;
  showError: boolean;
  showOutput: boolean;
  showSetpoint: boolean;
  showPosition: boolean;
};

/**
 * PID, but the calculations happen in a web worker
 */
export class PID {
  private static SLEW_RATE = 100;
  private static UPDATE_INTERVAL = 40;
  private static MAX_DATAPOINTS = 100;
  private static VIS_HEIGHT = 60;
  private static BOUNDS_LEFT = 0;
  private static BOUNDS_RIGHT = 20;
  private robot: Robot;
  private integral = 0;
  private prevError = 0;
  private prevOutput = 0;
  private setpoint = 10;
  private position = 0;
  private config: PIDConfig;
  private chart!: Chart;
  private visCtx!: OffscreenCanvasRenderingContext2D;
  private interval: number | null = null;

  /**
   * [time, setpoint, position, error, output, output_k, output_i, output_d]
   */
  private datapoints = new Array(8)
    .fill(undefined)
    .map(() => [] as number[]) as [
    number[],
    number[],
    number[],
    number[],
    number[],
    number[],
    number[],
    number[],
  ];

  constructor(
    private canvases: { graph: OffscreenCanvas; vis: OffscreenCanvas },
    config: Partial<PIDConfig>
  ) {
    this.config = {
      kp: 0,
      ki: 0,
      kd: 0,
      showP: true,
      showI: true,
      showD: true,
      showError: true,
      showOutput: true,
      showPosition: true,
      showSetpoint: true,
      ...config,
    };

    this.prevError = this.setpoint - this.position;
    this.prevOutput = this.config.kp * this.prevError;

    this.robot = new Robot();
    this.initCharts();
    this.drawVis();
    this.updateChartSettings();
  }

  public pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log("[PID] Loop paused.");
    }
  }

  public start() {
    if (!this.interval) {
      console.log("[PID] Loop started.", this.config);
      this.interval = setInterval(
        this.update.bind(this),
        PID.UPDATE_INTERVAL
      ) as unknown as number; // ts is picking up node.js types
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

    console.log("[PID] Config updated: ", this.config);
    this.updateChartSettings();
  }

  private update() {
    const out = this.updatePID();
    this.datapoints[0].push(Date.now());
    this.datapoints[1].push(this.setpoint);
    this.datapoints[2].push(this.position);
    this.datapoints[3].push(this.prevError);
    this.datapoints[4].push(out[0]);
    this.datapoints[5].push(out[1]);
    this.datapoints[6].push(out[2]);
    this.datapoints[7].push(out[3]);

    // remove old data
    if (this.datapoints[0].length > PID.MAX_DATAPOINTS) {
      this.datapoints.forEach((d) => d.shift());
    }

    this.draw();
  }

  private updatePID(): [number, number, number, number] {
    this.position = this.robot.getPosition();
    const error = this.setpoint - this.position;
    this.integral += error;
    const derivative = error - this.prevError;

    const outputK = this.config.kp * error;
    const outputI = this.config.ki * this.integral;
    const outputD = this.config.kd * derivative;
    const systemOut = outputK + outputI + outputD;

    this.robot.setMotorPower(systemOut);
    this.robot.update();

    this.prevOutput = systemOut;
    this.position = this.robot.getPosition();
    this.prevError = error;

    return [systemOut, outputK, outputI, outputD];
  }

  private draw() {
    this.chart.update();
    this.drawVis();
  }

  private initCharts() {
    this.chart?.destroy();
    this.chart = new Chart(
      // @ts-expect-error - chart.js types don't support offscreen canvas, but internally it works
      this.canvases.graph,
      {
        type: "line",
        data: {
          labels: this.datapoints[0],
          datasets: [
            {
              label: "Setpoint",
              data: this.datapoints[1],
              borderColor: PID_COLORS.SETPOINT_COLOR,
            },
            {
              label: "Position",
              data: this.datapoints[2],
              borderColor: PID_COLORS.POSITION_COLOR,
            },
            {
              label: "Error",
              data: this.datapoints[3],
              borderColor: PID_COLORS.ERROR_COLOR,
            },
            {
              label: "Output",
              data: this.datapoints[4],
              borderColor: PID_COLORS.OUTPUT_COLOR,
            },
            {
              label: "Output P",
              data: this.datapoints[5],
              borderColor: PID_COLORS.P_COLOR,
            },
            {
              label: "Output I",
              data: this.datapoints[6],
              borderColor: PID_COLORS.I_COLOR,
            },
            {
              label: "Output D",
              data: this.datapoints[7],
              borderColor: PID_COLORS.D_COLOR,
            },
          ],
        },

        options: {
          plugins: {
            legend: {
              display: false,
            },
          },

          scales: {
            x: {
              ticks: {
                display: false,
              },
            },
            y: {
              ticks: {
                display: true,
              },
            },
          },
        },
      }
    );
  }

  private drawVis() {
    const ctx = (this.visCtx ??= this.canvases.vis.getContext("2d")!);

    // clear canvas
    ctx.clearRect(0, 0, this.canvases.vis.width, this.canvases.vis.height);

    // calculate the scaled positions
    const leftBound = Math.min(PID.BOUNDS_LEFT, this.position);
    const rightBound = Math.max(PID.BOUNDS_RIGHT, this.position);

    const position =
      ((this.position - leftBound) / (rightBound - leftBound)) *
      this.canvases.vis.width;

    const setpoint =
      ((this.setpoint - leftBound) / (rightBound - leftBound)) *
      this.canvases.vis.width;

    const error =
      ((this.prevError - leftBound) / (rightBound - leftBound)) *
      this.canvases.vis.width;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, PID.VIS_HEIGHT / 2 - 4, this.canvases.vis.width, 4);

    // draw an error bar
    ctx.fillStyle = PID_COLORS.ERROR_COLOR;
    let errorLeft = Math.min(position, setpoint);
    let errorRight = Math.max(position, setpoint);
    ctx.fillRect(errorLeft, PID.VIS_HEIGHT / 2 - 4, errorRight - errorLeft, 4);

    // draw position
    ctx.fillStyle = PID_COLORS.POSITION_COLOR;
    ctx.fillRect(position - 8, PID.VIS_HEIGHT / 2 - 12, 16, 24);

    // draw setpoint
    ctx.fillStyle = PID_COLORS.SETPOINT_COLOR;
    ctx.fillRect(setpoint - 8, PID.VIS_HEIGHT / 2 - 12, 16, 24);

    // write position text
    ctx.fillStyle = PID_COLORS.POSITION_COLOR;
    ctx.font = "14px sans-serif";
    let positionText = this.position.toFixed(2);
    ctx.fillText(
      positionText,
      positionText.length < 5 ? position - 10 : position - 18,
      PID.VIS_HEIGHT / 2 - 20
    );

    // write setpoint text
    ctx.fillStyle = PID_COLORS.SETPOINT_COLOR;
    let setpointText = this.setpoint.toFixed(2);
    ctx.fillText(
      setpointText,
      setpointText.length < 5 ? setpoint - 10 : setpoint - 18,
      PID.VIS_HEIGHT / 2 + 30
    );
  }

  private updateChartSettings() {
    // enable/disable different datasets
    this.chart.data.datasets[0].hidden = !this.config.showSetpoint;
    this.chart.data.datasets[1].hidden = !this.config.showPosition;
    this.chart.data.datasets[2].hidden = !this.config.showError;
    this.chart.data.datasets[3].hidden = !this.config.showOutput;
    this.chart.data.datasets[4].hidden = !this.config.showP;
    this.chart.data.datasets[5].hidden = !this.config.showI;
    this.chart.data.datasets[6].hidden = !this.config.showD;
    this.chart.update();
  }

  public resize(width: number, height: number) {
    this.canvases.graph.width = width;
    this.canvases.graph.height = height;
    this.canvases.vis.width = width;
    this.canvases.vis.height = PID.VIS_HEIGHT;

    this.chart.resize(width, height);
    this.draw();
    this.drawVis();
  }

  public destroy() {
    this.interval && clearInterval(this.interval);
    this.chart.destroy();
  }

  public getConfig() {
    return {
      config: this.config,
      canvases: this.canvases,
    };
  }

  public updatePosition(position: number) {
    this.robot.reset(position);
    this.prevError = this.setpoint - position;
    this.prevOutput = this.config.kp * this.prevError;
    this.integral = 0;
    this.position = position;
  }
}
