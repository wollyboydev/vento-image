import { Plugin } from '../interface';

export class FullscreenPlugin implements Plugin {
  private gallery: any | null = null;
  private container: HTMLElement | null = null;
  private useNative = false;
  private fullscreenChangeHandler: (() => void) | null = null;

  constructor(useNative: boolean = false) {
    this.useNative = useNative;
  }

  attach(gallery: any): void {
    this.gallery = gallery;
    this.container = gallery.container;

    this.fullscreenChangeHandler = this.handleFullscreenChange.bind(this);
    if (this.fullscreenChangeHandler) {
      document.addEventListener('fullscreenchange', this.fullscreenChangeHandler);
      document.addEventListener('webkitfullscreenchange' as any, this.fullscreenChangeHandler);
      document.addEventListener('mozfullscreenchange' as any, this.fullscreenChangeHandler);
      document.addEventListener('MSFullscreenChange' as any, this.fullscreenChangeHandler);
    }
  }

  detach(): void {
    if (this.fullscreenChangeHandler) {
      document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler);
      document.removeEventListener('webkitfullscreenchange' as any, this.fullscreenChangeHandler);
      document.removeEventListener('mozfullscreenchange' as any, this.fullscreenChangeHandler);
      document.removeEventListener('MSFullscreenChange' as any, this.fullscreenChangeHandler);
      this.fullscreenChangeHandler = null;
    }
    this.gallery = null;
    this.container = null;
  }

  private handleFullscreenChange(): void {
    const isFullscreen = this.isFullscreen();
    if (this.gallery && this.gallery.store) {
      const state = this.gallery.store.getState();
      if (state.isFullscreen !== isFullscreen) {
        this.gallery.store.dispatch({ type: 'TOGGLE_FULLSCREEN' });
      }
    }
  }

  private isFullscreen(): boolean {
    return !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
  }

  public request(): void {
    if (!this.container) return;

    if (this.useNative) {
      const el = this.container as any;
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    } else {
      this.container.classList.add('vento-fullscreen');
      document.body.classList.add('vento-fullscreen-active');
      if (this.gallery) {
        this.gallery.store?.dispatch({ type: 'TOGGLE_FULLSCREEN' });
      }
    }
  }

  public exit(): void {
    if (!this.container) return;

    if (this.useNative) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } else {
      this.container.classList.remove('vento-fullscreen');
      document.body.classList.remove('vento-fullscreen-active');
      if (this.gallery) {
        this.gallery.store?.dispatch({ type: 'TOGGLE_FULLSCREEN' });
      }
    }
  }
}
