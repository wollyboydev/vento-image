import { GalleryState, GalleryItem } from '../state/types';
import { GalleryStore } from '../state/store';
import { VentoOptions } from './options';
import { EventEmitter, GalleryEvent } from './events';
import { Renderer } from '../renderers/interface';
import { DOMStageRenderer } from '../renderers/dom/stage';
import { DOMNavRenderer } from '../renderers/dom/thumbnails';
import { Plugin } from '../plugins/interface';
import { parseHTML } from '../utils/dom';

// Standard Plugins
import { AutoplayPlugin } from '../plugins/standard/autoplay';
import { KeyboardPlugin } from '../plugins/standard/keyboard';
import { TouchPlugin } from '../plugins/standard/touch';
import { FullscreenPlugin } from '../plugins/standard/fullscreen';
import { VideoPlugin } from '../plugins/standard/video';

export class Vento {
  public container: HTMLElement;
  public wrap!: HTMLElement;
  public stage!: HTMLElement;
  public stageShaft!: HTMLElement;
  public navWrap!: HTMLElement;
  public navShaft!: HTMLElement;
  public arrPrev!: HTMLElement;
  public arrNext!: HTMLElement;

  public store: GalleryStore;
  public options: Required<VentoOptions>;
  public events: EventEmitter;

  public stageRenderer: Renderer;
  public navRenderer: Renderer;

  private plugins: Plugin[] = [];
  private unsubscribe: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;

  // Public exposure for plugins (e.g. fullscreen plugin)
  public fullscreenPlugin: FullscreenPlugin | null = null;

  constructor(container: HTMLElement, frames: readonly GalleryItem[], options: VentoOptions = {}) {
    if (!container) throw new Error('Vento: container element is required');
    if (!frames || frames.length === 0) throw new Error('Vento: at least one frame is required');

    this.container = container;
    this.events = new EventEmitter();

    this.options = {
      autoplay: false,
      loop: false,
      transition: 'slide',
      transitionDuration: 300,
      nav: 'dots',
      navPosition: 'bottom',
      navDirection: 'horizontal',
      fullscreen: false,
      keyboard: false,
      arrows: true,
      click: true,
      swipe: false,
      startIndex: 0,
      width: null,
      height: null,
      showCaption: true,
      renderer: 'dom', // Default to DOM
      ...options,
    };

    const initialState: GalleryState = {
      frames: Object.freeze([...frames]),
      currentIndex: Math.max(0, Math.min(this.options.startIndex, frames.length - 1)),
      status: 'IDLE',
      isFullscreen: false,
      isPlaying: false,
      playingVideoId: null,
      transitionType: this.options.transition,
      loop: this.options.loop,
    };

    this.store = new GalleryStore(initialState);

    // Booting up
    this.createDOM();

    // Renderers Factory
    if (this.options.renderer === 'webgl') {
      // Future: this.stageRenderer = new WebGLStageRenderer(...)
      console.warn('WebGL renderer not implemented yet, falling back to DOM');
      this.stageRenderer = new DOMStageRenderer(this.stageShaft, this.options.transitionDuration);
    } else {
      this.stageRenderer = new DOMStageRenderer(this.stageShaft, this.options.transitionDuration);
    }

    this.navRenderer = new DOMNavRenderer(
      this.navShaft,
      this.options.nav,
      this.options.navDirection
    );

    this.stageRenderer.setFrames([...frames]);
    this.navRenderer.setFrames([...frames]);

    this.setupInteractions(frames);

    this.unsubscribe = this.store.subscribe((state) => {
      this.handleStateChange(state);
    });

    this.attachPlugins();
    this.setupResizeObserver();

    // Initial Render
    setTimeout(() => {
      this.handleStateChange(this.store.getState());
      this.emit('ready');
    }, 0);
  }

  private createDOM(): void {
    this.container.innerHTML = '';
    this.container.className = 'vento-gallery';

    this.wrap = parseHTML(
      `<div class="vento-wrap ${this.options.navDirection === 'vertical' ? 'flex' : ''}"></div>`
    );

    this.stage = parseHTML(`<div class="vento-stage relative overflow-hidden w-100"></div>`);

    this.stageShaft = parseHTML(`<div class="vento-stage-shaft flex"> </div>`);
    this.stageShaft.style.setProperty('--offset', '0px');
    this.stageShaft.style.transform = 'translate3d(var(--offset), 0, 0)';

    // Initial transition setup moved to CSS ideally, but here for compat
    this.stageShaft.style.transition = 'transform 200ms ease';

    this.stage.appendChild(this.stageShaft);

    if (this.options.arrows) {
      this.arrPrev = parseHTML(
        `<button class="vento-arrow vento-arrow-prev" type="button" aria-label="Previous"></button>`
      );
      this.arrPrev.addEventListener('click', () => this.prev());

      this.arrNext = parseHTML(
        `<button class="vento-arrow vento-arrow-next" type="button" aria-label="Next"></button>`
      );
      this.arrNext.addEventListener('click', () => this.next());

      this.stage.appendChild(this.arrPrev);
      this.stage.appendChild(this.arrNext);
    }

    if (this.options.nav) {
      this.navWrap = parseHTML(
        `<div class="vento-nav-wrap vento-nav-${this.options.navDirection}"></div>`
      );

      this.navShaft = document.createElement('div');
      this.navShaft.className = `vento-nav-shaft vento-nav-${this.options.nav}`;
      this.navShaft.setAttribute('role', 'tablist');

      // Styling should be in CSS, but keeping inline for parity with old main.ts
      if (this.options.nav === 'thumbs') {
        this.navShaft.style.display = 'flex';
        this.navShaft.style.flexDirection =
          this.options.navDirection === 'vertical' ? 'column' : 'row';
        this.navShaft.style.overflow = 'auto';
        this.navShaft.style.gap = '4px';
      } else if (this.options.nav === 'dots') {
        this.navShaft.style.display = 'flex';
        this.navShaft.style.justifyContent = 'center';
        this.navShaft.style.gap = '8px';
      }

      this.navWrap.appendChild(this.navShaft);

      if (this.options.navPosition === 'top') {
        this.wrap.insertBefore(this.navWrap, this.stage);
      } else {
        this.wrap.appendChild(this.navWrap);
      }
    } else {
      this.navShaft = document.createElement('div');
    }

    if (this.options.fullscreen) {
      // Only add button if not 'native' or handled elsewhere?
      // main.ts added it blindly if options.fullscreen was trueish
      const btn = parseHTML(`
        <button class="vento-fullscreen-btn" style="border: 1px solid white;" aria-label="Toggle fullscreen" type="button"></button>
      `);
      btn.addEventListener('click', () => this.toggleFullscreen());
      this.stage.appendChild(btn);
    }

    this.wrap.appendChild(this.stage);
    this.container.appendChild(this.wrap);
  }

  private setupInteractions(frames: readonly GalleryItem[]): void {
    if (this.options.nav && this.options.click && this.navShaft) {
      this.navShaft.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const navItem = target.closest('[data-frame-id]') as HTMLElement;
        if (navItem) {
          const frameId = navItem.getAttribute('data-frame-id');
          const index = frames.findIndex((f) => f.id === frameId);
          if (index !== -1) this.goTo(index);
        }
      });

      this.navShaft.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const target = e.target as HTMLElement;
          const navItem = target.closest('[data-frame-id]') as HTMLElement;
          if (navItem) {
            e.preventDefault();
            const frameId = navItem.getAttribute('data-frame-id');
            const index = frames.findIndex((f) => f.id === frameId);
            if (index !== -1) this.goTo(index);
          }
        }
      });
    }
  }

  private attachPlugins(): void {
    if (this.options.autoplay) {
      this.plugins.push(new AutoplayPlugin(this.options.autoplay));
    }
    if (this.options.keyboard) {
      this.plugins.push(new KeyboardPlugin(this.options.keyboard));
    }
    if (this.options.swipe) {
      this.plugins.push(new TouchPlugin());
    }
    if (this.options.fullscreen) {
      const useNative = this.options.fullscreen === 'native';
      const fsPlugin = new FullscreenPlugin(useNative);
      this.plugins.push(fsPlugin);
      this.fullscreenPlugin = fsPlugin;
    }
    this.plugins.push(new VideoPlugin());

    // Attach all
    this.plugins.forEach((p) => p.attach(this));
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        this.handleStateChange(this.store.getState());
      });
    });
    this.resizeObserver.observe(this.container);
    if (this.stage) this.resizeObserver.observe(this.stage);
  }

  private handleStateChange(state: GalleryState): void {
    this.stageRenderer.update(state);
    this.navRenderer.update(state);

    if (this.options.arrows) {
      const canGoPrev = state.loop || state.currentIndex > 0;
      const canGoNext = state.loop || state.currentIndex < state.frames.length - 1;

      if (this.arrPrev) {
        (this.arrPrev as HTMLButtonElement).disabled = !canGoPrev;
        this.arrPrev.classList.toggle('is-disabled', !canGoPrev);
      }
      if (this.arrNext) {
        (this.arrNext as HTMLButtonElement).disabled = !canGoNext;
        this.arrNext.classList.toggle('is-disabled', !canGoNext);
      }
    }

    this.emit('change', state);

    if (state.status === 'TRANSITIONING') {
      setTimeout(() => {
        this.store.dispatch({ type: 'END_TRANSITION' });
        this.emit('showend');
      }, this.options.transitionDuration);
    }

    if (state.isFullscreen) {
      this.container.classList.add('is-fullscreen');
      this.emit('fullscreenenter');
    } else {
      this.container.classList.remove('is-fullscreen');
      this.emit('fullscreenexit');
    }
  }

  // API
  public next(): void {
    this.store.dispatch({ type: 'NEXT' });
    this.emit('show');
  }
  public prev(): void {
    this.store.dispatch({ type: 'PREV' });
    this.emit('show');
  }
  public goTo(index: number): void {
    this.store.dispatch({ type: 'GO_TO', index });
    this.emit('show');
  }

  public play(): void {
    const state = this.store.getState();
    const current = state.frames[state.currentIndex];
    if (current?.video) {
      this.store.dispatch({ type: 'PLAY_VIDEO', videoId: current.video.id });
      this.emit('loadvideo');
    }
  }

  public pause(): void {
    this.store.dispatch({ type: 'STOP_VIDEO' });
    this.emit('unloadvideo');
  }

  public toggleFullscreen(): void {
    if (this.fullscreenPlugin) {
      const state = this.store.getState();
      if (state.isFullscreen) this.fullscreenPlugin.exit();
      else this.fullscreenPlugin.request();
    } else {
      this.store.dispatch({ type: 'TOGGLE_FULLSCREEN' });
    }
  }

  public destroy(): void {
    this.plugins.forEach((p) => p.detach());
    this.plugins = [];
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.resizeObserver?.disconnect();
    this.events.clear();
    this.container.innerHTML = '';
  }

  public on(event: GalleryEvent, handler: (...args: any[]) => void): void {
    this.events.on(event, handler);
  }
  public off(event: GalleryEvent, handler: (...args: any[]) => void): void {
    this.events.off(event, handler);
  }
  private emit(event: GalleryEvent, ...args: any[]): void {
    this.events.emit(event, ...args);
  }
}
