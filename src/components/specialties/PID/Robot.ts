/**
 * Simulates the dynamics of a robot for the simulated PID controller.
 */
export class Robot {
  // State variables (all in SI units)
  private position: number; // in meters
  private velocity: number; // in meters/second
  private motorPower: number; // -255 to 255

  // Simulation timestep (seconds)
  private readonly dt: number = 0.04; // 40 ms per update

  // Physical parameters
  private readonly mass: number = 10; // estimated mass in kg for a VEX robot
  private readonly maxForce: number = 100; // maximum force in Newtons at full power (255 or -255)

  // A viscous friction coefficient. The friction force is proportional to velocity.
  private readonly dragCoefficient: number = 5.0; // N per (m/s)

  // A small noise magnitude to simulate slight randomness in acceleration.
  private readonly noiseMagnitude: number = 0.1; // m/s^2 noise amplitude

  /**
   * Creates a new robot simulation.
   * @param initialPosition Initial position in meters (default is 0).
   */
  constructor(initialPosition: number = 0) {
    this.position = initialPosition;
    this.velocity = 0;
    this.motorPower = 0;
  }

  /**
   * Sets the motor power.
   * @param power A number between -255 and 255.
   */
  public setMotorPower(power: number): void {
    // Clamp power to the -255 to 255 range.
    this.motorPower = Math.max(-255, Math.min(255, power));
  }

  /**
   * Updates the simulation. This method should be called every few milliseconds.
   */
  public update(): void {
    // Calculate the motor force proportional to the set power.
    // The force scales linearly from -maxForce to maxForce.
    const motorForce: number = (this.motorPower / 255) * this.maxForce;

    // Viscous friction: a force opposing the motion that is proportional to velocity.
    // This always acts opposite to the direction of travel.
    const frictionForce: number = -this.dragCoefficient * this.velocity;

    // Net force on the robot.
    const netForce: number = motorForce + frictionForce;

    // Compute acceleration from F = m * a.
    let acceleration: number = netForce / this.mass;
    // Add a small random noise to simulate variability in performance.
    acceleration += (Math.random() - 0.5) * this.noiseMagnitude;

    // Update velocity and position using simple Euler integration.
    this.velocity += acceleration * this.dt;
    this.position += this.velocity * this.dt;
  }

  /**
   * Returns the current position (in meters).
   */
  public getPosition(): number {
    return this.position;
  }

  /**
   * Resets the simulation (position, velocity, and motor power).
   */
  public reset(position: number = 0): void {
    this.position = position;
    this.velocity = 0;
    this.motorPower = 0;
  }
}
