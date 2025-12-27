import { PhysicsStrategy } from '../../engine/physics/Strategy';

export class FreeScrollPhysics implements PhysicsStrategy {
  public friction: number = 0.95;
  public spring: number = 0.05;

  private position: number = 0;
  private velocity: number = 0;
  private target: number = 0;
  private isResting: boolean = true;
  private epsilon: number = 0.1;

  private bounds: { min: number; max: number } = { min: -Infinity, max: Infinity };

  constructor(config: { friction?: number; spring?: number } = {}) {
    if (config.friction) this.friction = config.friction;
    if (config.spring) this.spring = config.spring;
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
    this.velocity = 0;
    this.isResting = true;
  }

  public stop(): void {
    this.velocity = 0;
    this.isResting = true;
  }

  public drag(delta: number): number {
    let appliedDelta = delta;

    if (this.position < this.bounds.min) {
      const over = this.bounds.min - this.position;
      appliedDelta *= 1 / (1 + over * 0.005);
    } else if (this.position > this.bounds.max) {
      const over = this.position - this.bounds.max;
      appliedDelta *= 1 / (1 + over * 0.005);
    }

    this.position += appliedDelta;
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

    this.velocity *= this.friction;
    this.position += this.velocity;

    if (this.position < this.bounds.min) {
      const distance = this.bounds.min - this.position;
      const force = distance * this.spring;
      this.velocity += force;
    } else if (this.position > this.bounds.max) {
      const distance = this.bounds.max - this.position;
      const force = distance * this.spring;
      this.velocity += force;
    } else if (Math.abs(this.velocity) < this.epsilon) {
      this.velocity = 0;
      this.isResting = true;
      return false;
    }

    return true;
  }
}
