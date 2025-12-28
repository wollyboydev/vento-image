export class Time {
  private static instance: Time;
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private callbacks: Set<(deltaTime: number) => void> = new Set();
  private rafId: number | null = null;

  private constructor() {
    this.tick = this.tick.bind(this);
  }

  public static getInstance(): Time {
    if (!Time.instance) {
      Time.instance = new Time();
    }
    return Time.instance;
  }

  public add(callback: (deltaTime: number) => void): void {
    this.callbacks.add(callback);
    if (this.callbacks.size > 0 && !this.isRunning) {
      this.start();
    }
  }

  public remove(callback: (deltaTime: number) => void): void {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0) {
      this.stop();
    }
  }

  private start(): void {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  private stop(): void {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick(now: number): void {
    if (!this.isRunning) return;

    const deltaTime = now - this.lastTime;
    this.lastTime = now;

    // Cap huge dt (e.g. tab backgrounded) to avoid physics explosion
    const safeDt = Math.min(deltaTime, 64);

    this.callbacks.forEach((cb) => cb(safeDt));

    this.rafId = requestAnimationFrame(this.tick);
  }
}
