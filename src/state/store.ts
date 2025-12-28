import { GalleryState, GalleryAction } from './types';
import { rootReducer } from './reducer';

type Listener = (state: GalleryState) => void;

export class GalleryStore {
  private state: GalleryState;
  private listeners = new Set<Listener>();

  constructor(initialState: GalleryState) {
    this.state = Object.freeze(initialState);
  }

  public getState(): GalleryState {
    return this.state;
  }

  public dispatch(action: GalleryAction): void {
    const nextState = rootReducer(this.state, action);
    // Simple reference equality check optimization
    if (nextState !== this.state) {
      this.state = Object.freeze(nextState);
      this.listeners.forEach((fn) => fn(this.state));
    }
  }

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.state); // Initial call
    return () => this.listeners.delete(fn);
  }
}
