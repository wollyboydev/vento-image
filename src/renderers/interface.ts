import { GalleryState, GalleryItem } from '../state/types';

export interface Renderer {
  update(state: GalleryState): void;
  setFrames(frames: readonly GalleryItem[]): void;
  destroy?(): void;
}
