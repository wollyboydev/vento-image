export interface PhysicsState {
  position: number;
  velocity: number;
  isResting: boolean;
}

export interface PhysicsStrategy {
  // Configuration
  friction: number;
  spring: number;

  // Setters
  setTarget(val: number): void;
  forceSet(val: number): void;
  setBounds(min: number, max: number): void;

  // Interaction
  /**
   * Called when interaction starts (pointer down).
   * Should freeze motion immediately.
   */
  stop(): void;

  /**
   * Called during a drag gesture.
   * @param delta The movement input this frame
   * @returns The new visual position (allowing for rubber-banding)
   */
  drag(delta: number): number;

  /**
   * Called when the user releases the drag.
   * @param velocity The velocity of the throw
   */
  release(velocity: number): void;

  // Simulation Loop
  update(): boolean; // Returns true if state changed
  getPosition(): number;
}
