export interface ScrollerConfig {
  friction: number;
  spring: number;
}

export class Scroller {
  private position: number = 0;
  private velocity: number = 0;
  private target: number = 0;

  // Physics constants
  private friction: number = 0.9; // 0-1, lower is slippery
  private spring: number = 0.1; // 0-1, stiffness
  private epsilon: number = 0.1; // Stop when slower than this

  private isResting: boolean = true;
  private bounds: { min: number; max: number } = { min: -Infinity, max: Infinity };

  constructor(config: Partial<ScrollerConfig> = {}) {
    if (config.friction) this.friction = config.friction;
    if (config.spring) this.spring = config.spring;
  }

  public setBounds(min: number, max: number): void {
    this.bounds = { min, max };
  }

  public setTarget(target: number): void {
    this.target = Math.max(this.bounds.min, Math.min(this.bounds.max, target));
    this.isResting = false;
  }

  public forceSet(val: number): void {
    this.position = val;
    this.target = val;
    this.velocity = 0;
    this.isResting = true;
  }

  public addVelocity(v: number): void {
    this.velocity += v;
    this.isResting = false;
  }

  public getPosition(): number {
    return this.position;
  }

  public update(): boolean {
    if (this.isResting) return false;

    // 1. Spring Force towards target
    const distance = this.target - this.position;
    const force = distance * this.spring;

    // 2. Apply Force to Velocity
    this.velocity += force;

    // 3. Apply Friction
    this.velocity *= this.friction;

    // 4. Update Position
    this.position += this.velocity;

    // 5. Check Resting Condition
    if (Math.abs(this.velocity) < this.epsilon && Math.abs(distance) < this.epsilon) {
      this.position = this.target;
      this.velocity = 0;
      this.isResting = true;
      return false; // Stopped moving
    }

    return true; // Still moving
  }
}
