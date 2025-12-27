import { Plugin } from '../interface';
import { GalleryStore } from '../../state/store';
import { GalleryState } from '../../state/types';

export class AutoplayPlugin implements Plugin {
  private timer: number | null = null;
  private store: GalleryStore | null = null;
  private interval: number;
  private unsubscribe: (() => void) | null = null;
  private paused = false;

  constructor(interval: number) {
    this.interval = interval;
  }

  attach(gallery: any): void {
    this.store = gallery.store;
    if (!this.store) return;

    this.unsubscribe = this.store.subscribe((state) => {
      this.handleStateChange(state);
    });
  }

  detach(): void {
    this.stop();
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.store = null;
  }

  private handleStateChange(state: GalleryState): void {
    if (state.status === 'TRANSITIONING' || state.isPlaying || this.paused) {
      this.stop();
      return;
    }

    if (state.status === 'IDLE' && !this.timer && !state.isPlaying) {
      this.start();
    }
  }

  private start(): void {
    if (!this.store) return;
    this.timer = window.setInterval(() => {
      if (this.store) {
        this.store.dispatch({ type: 'NEXT' });
      }
    }, this.interval);
  }

  private stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public pause(): void {
    this.paused = true;
    this.stop();
  }

  public resume(): void {
    this.paused = false;
    if (this.store) {
      this.handleStateChange(this.store.getState());
    }
  }
}
