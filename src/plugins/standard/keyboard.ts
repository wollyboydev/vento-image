import { Plugin } from '../interface';

export class KeyboardPlugin implements Plugin {
  private gallery: any | null = null;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;
  private config: Partial<
    Record<'left' | 'right' | 'up' | 'down' | 'space' | 'home' | 'end', boolean>
  >;

  constructor(
    config:
      | boolean
      | Partial<Record<'left' | 'right' | 'up' | 'down' | 'space' | 'home' | 'end', boolean>> = true
  ) {
    this.config =
      typeof config === 'boolean'
        ? {
            left: config,
            right: config,
            up: config,
            down: config,
            space: false,
            home: false,
            end: false,
          }
        : config;
  }

  attach(gallery: any): void {
    this.gallery = gallery;
    this.keyHandler = this.handleKeyPress.bind(this);
    if (this.keyHandler) {
      document.addEventListener('keydown', this.keyHandler);
    }
  }

  detach(): void {
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
    this.gallery = null;
  }

  private handleKeyPress(e: KeyboardEvent): void {
    if (!this.gallery) return;

    // Don't handle keys when user is typing in inputs
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        if (this.config.left) {
          e.preventDefault();
          this.gallery.prev();
        }
        break;
      case 'ArrowRight':
        if (this.config.right) {
          e.preventDefault();
          this.gallery.next();
        }
        break;
      case 'ArrowUp':
        if (this.config.up) {
          e.preventDefault();
          this.gallery.prev();
        }
        break;
      case 'ArrowDown':
        if (this.config.down) {
          e.preventDefault();
          this.gallery.next();
        }
        break;
      case ' ':
        if (this.config.space && !e.shiftKey) {
          e.preventDefault();
          this.gallery.next();
        }
        break;
      case 'Home':
        if (this.config.home) {
          e.preventDefault();
          this.gallery.goTo(0);
        }
        break;
      case 'End':
        if (this.config.end) {
          e.preventDefault();
          const state = this.gallery.store?.getState();
          if (state) {
            this.gallery.goTo(state.frames.length - 1);
          }
        }
        break;
      case 'Escape':
        if (this.gallery.store?.getState().isFullscreen) {
          e.preventDefault();
          this.gallery.toggleFullscreen();
        }
        break;
    }
  }
}
