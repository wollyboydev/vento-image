import { PhysicsStrategy } from '../../engine/physics/Strategy';

export class SnapPhysics implements PhysicsStrategy {
  public friction: number = 0.9;
  public spring: number = 0.1;

  private position: number = 0;
  private velocity: number = 0;
  private target: number = 0;
  private isResting: boolean = true;
  private epsilon: number = 0.1;

  private bounds: { min: number; max: number } = { min: -Infinity, max: Infinity };

  private config = { friction: 0.82, spring: 0.04 };

  constructor(config: { friction?: number; spring?: number } = {}) {
    if (config.friction) this.config.friction = config.friction;
    if (config.spring) this.config.spring = config.spring;

    // Apply default
    this.friction = this.config.friction;
    this.spring = this.config.spring;
  }

  public setBounds(min: number, max: number): void {
    this.bounds = { min, max };
  }

  public setTarget(target: number): void {
    this.target = target;
    this.isResting = false;
  }

  public forceSet(val: number): void {
    this.position = val;
    this.target = val;
    this.velocity = 0;
    this.isResting = true;
  }

  public stop(): void {
    this.velocity = 0;
    this.target = this.position;
    this.isResting = true;
  }

  public drag(delta: number): number {
    let appliedDelta = delta;

    if (this.position > this.bounds.max) {
      const over = this.position - this.bounds.max;
      appliedDelta *= 1 / (1 + over * 0.005);
    } else if (this.position < this.bounds.min) {
      const over = this.bounds.min - this.position;
      appliedDelta *= 1 / (1 + over * 0.005);
    }

    this.position += appliedDelta;

    this.target = this.position;
    this.isResting = true;

    return this.position;
  }

  public release(velocity: number): void {
    this.velocity = velocity;
    this.isResting = false;
  }

  public getPosition(): number {
    return this.position;
  }

  public update(): boolean {
    if (this.isResting && Math.abs(this.velocity) < this.epsilon) return false;

    // Dynamic Mode Selection:
    // If out of bounds (Rubber Banding) -> Spring
    // If in bounds (Regular Slide) -> Lerp (No oscillation)
    const isOutOfBounds =
      this.position > this.bounds.max + 1 || this.position < this.bounds.min - 1;

    let distance = this.target - this.position;

    if (!isOutOfBounds) {
      const move = distance * 0.15;
      this.position += move;
      this.velocity = 0;

      if (Math.abs(distance) < 0.5) {
        this.position = this.target;
        this.isResting = true;
        return false;
      }
    } else {
      const force = distance * this.spring;
      this.velocity += force;
      this.velocity *= this.friction;
      this.position += this.velocity;

      if (Math.abs(this.velocity) < this.epsilon && Math.abs(distance) < this.epsilon) {
        this.position = this.target;
        this.velocity = 0;
        this.isResting = true;
        return false;
      }
    }

    return true;
  }
}
