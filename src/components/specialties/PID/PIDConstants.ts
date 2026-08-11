/**
 * Trace colours for the PID plot.
 *
 * These are instrument channel colours, not brand colours: a scope gives each
 * channel its own hue so overlaid traces stay separable. Every value here is
 * documented in DESIGN.md under "Data traces" and is legible on the mask-deep
 * plot ground.
 */
export const PID_COLORS = {
  POSITION_COLOR: "#E6B450", // gold - the measured value
  SETPOINT_COLOR: "#7FB6C4", // instrument cyan - the target
  ERROR_COLOR: "#C4553D", // dnp red - the difference
  OUTPUT_COLOR: "#9DB88F", // patina green - the commanded output
  P_COLOR: "#D98DA6", // magenta
  I_COLOR: "#A594C9", // violet
  D_COLOR: "#C98B5E", // light copper
};
