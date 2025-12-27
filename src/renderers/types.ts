import { VentoOptions } from '../core/options';
import { GalleryState, GalleryItem } from '../state/types';

export interface Renderer {
  init(root: HTMLElement, options: Required<VentoOptions>): void;
  update(state: GalleryState): void;
  tick?(deltaTime: number): void;

  // Interaction Hooks
  stop?(): void;
  drag?(delta: number): void;
  release?(velocity: number): void;

  // Position Control
  getPosition?(): number;
  forceSet?(position: number): void;

  setPosition?(position: number): void;
  setFrames(frames: readonly GalleryItem[]): void;
  destroy?(): void;
}
