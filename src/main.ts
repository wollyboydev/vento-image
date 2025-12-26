/**
 * Vento - Modern Gallery Library
 * State-first architecture with reducer pattern, CSS-based rendering, and plugin system
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface VideoInfo {
  readonly type: "youtube" | "vimeo" | "custom";
  readonly id: string;
  readonly url?: string;
}

export interface Frame {
  readonly id: string;
  readonly src: string | null;
  readonly thumb: string | null;
  readonly caption: string | null;
  readonly alt?: string
  readonly video: VideoInfo | null;
  readonly html: HTMLElement | null;
  readonly width?: number;
  readonly height?: number;
  readonly ratio?: number;
}

export type GalleryStatus = "IDLE" | "TRANSITIONING" | "DRAGGING";

export interface GalleryState {
  readonly frames: readonly Frame[];
  readonly currentIndex: number;
  readonly status: GalleryStatus;
  readonly isFullscreen: boolean;
  readonly isPlaying: boolean;
  readonly playingVideoId: string | null;
  readonly transitionType: "slide" | "fade" | "crossfade";
  readonly loop: boolean;
}

export type GalleryAction =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GO_TO"; index: number }
  | { type: "START_TRANSITION" }
  | { type: "END_TRANSITION" }
  | { type: "TOGGLE_FULLSCREEN" }
  | { type: "PLAY_VIDEO"; videoId: string }
  | { type: "STOP_VIDEO" }
  | { type: "START_AUTOPLAY" }
  | { type: "STOP_AUTOPLAY" }
  | { type: "SET_DRAGGING"; isDragging: boolean };

export interface VentoOptions {
  autoplay?: number | false;
  loop?: boolean;
  transition?: "slide" | "fade" | "crossfade";
  transitionDuration?: number;
  nav?: "thumbs" | "dots" | false;
  navPosition?: "top" | "bottom";
  navDirection?: "horizontal" | "vertical";
  fullscreen?: boolean | "native";
  keyboard?:
    | boolean
    | Partial<
        Record<
          "left" | "right" | "up" | "down" | "space" | "home" | "end",
          boolean
        >
      >;
  arrows?: boolean;
  click?: boolean;
  swipe?: boolean;
  startIndex?: number;
  width?: number | string | null;
  height?: number | string | null;
  showCaption?: boolean;
}

export type GalleryEvent =
  | "change"
  | "ready"
  | "show"
  | "showend"
  | "fullscreenenter"
  | "fullscreenexit"
  | "loadvideo"
  | "unloadvideo";

export interface Plugin {
  attach(gallery: Vento): void;
  detach(): void;
}

// ============================================================================
// STORE (State Management)
// ============================================================================

export class GalleryStore {
  private state: GalleryState;
  private listeners = new Set<(state: GalleryState) => void>();

  constructor(initialState: GalleryState) {
    this.state = Object.freeze(initialState);
  }

  public getState(): GalleryState {
    return this.state;
  }

  public dispatch(action: GalleryAction): void {
    this.state = Object.freeze(this.reducer(this.state, action));
    this.listeners.forEach((fn) => fn(this.state));
  }

  public subscribe(fn: (state: GalleryState) => void): () => void {
    this.listeners.add(fn);
    fn(this.state); // Initial call
    return () => this.listeners.delete(fn);
  }

  private reducer(state: GalleryState, action: GalleryAction): GalleryState {
    const { frames, currentIndex, loop } = state;

    switch (action.type) {
      case "NEXT": {
        const nextIndex = loop
          ? (currentIndex + 1) % frames.length
          : Math.min(currentIndex + 1, frames.length - 1);
        return {
          ...state,
          currentIndex: nextIndex,
          status: "TRANSITIONING",
        };
      }

      case "PREV": {
        const prevIndex = loop
          ? (currentIndex - 1 + frames.length) % frames.length
          : Math.max(currentIndex - 1, 0);
        return {
          ...state,
          currentIndex: prevIndex,
          status: "TRANSITIONING",
        };
      }

      case "GO_TO": {
        const index = action.index;
        const validIndex = Math.max(0, Math.min(index, frames.length - 1));
        return {
          ...state,
          currentIndex: validIndex,
          status: "TRANSITIONING",
        };
      }

      case "START_TRANSITION":
        return { ...state, status: "TRANSITIONING" };

      case "END_TRANSITION":
        return { ...state, status: "IDLE" };

      case "TOGGLE_FULLSCREEN":
        return { ...state, isFullscreen: !state.isFullscreen };

      case "PLAY_VIDEO":
        return {
          ...state,
          isPlaying: true,
          playingVideoId: action.videoId,
        };

      case "STOP_VIDEO":
        return {
          ...state,
          isPlaying: false,
          playingVideoId: null,
        };

      case "START_AUTOPLAY":
        // Autoplay state managed by plugin, just pass through
        return state;

      case "STOP_AUTOPLAY":
        // Autoplay state managed by plugin, just pass through
        return state;

      case "SET_DRAGGING":
        return {
          ...state,
          status: action.isDragging ? "DRAGGING" : state.status,
        };

      default:
        return state;
    }
  }
}

// ============================================================================
// RENDERERS
// ============================================================================

class StageRenderer {
  private stageShaft: HTMLElement;
  private stageFrames: HTMLElement[] = [];
  private transitionDuration: number;

  constructor(stageShaft: HTMLElement, transitionDuration: number = 300) {
    this.stageShaft = stageShaft;
    this.transitionDuration = transitionDuration;
  }

  public update(state: GalleryState): void {
    const { frames, currentIndex, status, transitionType } = state;

    // Update frame and shaft sizes based on container width
    const container = this.stageShaft.parentElement;
    if (!container || this.stageFrames.length === 0) return;

    // Force layout calculation - try multiple methods
    let containerWidth = container.offsetWidth;
    if (!containerWidth) {
      containerWidth = container.clientWidth;
    }
    if (!containerWidth && container.getBoundingClientRect) {
      containerWidth = container.getBoundingClientRect().width;
    }

    // If we still don't have width, try to force a reflow
    if (!containerWidth || containerWidth === 0) {
      // Force reflow by reading offsetHeight
      container.offsetHeight;
      containerWidth = container.offsetWidth || container.clientWidth || 0;
    }

    if (containerWidth > 0) {
      // Size each frame to container width
      const frameWidth = containerWidth;
      this.stageFrames.forEach((frameEl) => {
        frameEl.style.width = `${frameWidth}px`;
        // Ensure all child elements have pointer-events: none
        // @todo move to css
        // const children = frameEl.querySelectorAll("*");
        // children.forEach((child) => {
        //   if (child instanceof HTMLElement) {
        //     child.style.pointerEvents = "none";
        //   }
        // });
      });

      // Size shaft to total width of all frames
      this.stageShaft.style.width = `${frames.length * frameWidth}px`;

      // Calculate offset for transform
      const offsetPx = currentIndex * frameWidth * -1;
      this.stageShaft.style.setProperty("--offset", `${offsetPx}px`);

      // Apply transform directly for better performance
      //@todo probably also should be moved to css
      this.stageShaft.style.transform = `translateX(${offsetPx}px)`;

      // Disable transitions while dragging for smoother interaction
      // should be direct tailwind classes for it rather than css props
      if (status === "DRAGGING") {
        this.stageShaft.style.transition = "none";
      } else {
        this.stageShaft.style.transition = `transform ${this.transitionDuration}ms ease`;
      }
    }

    this.stageShaft.style.transitionDuration =
      status === "DRAGGING" ? "0ms" : `${this.transitionDuration}ms`;

    // Toggle animation classes
    this.stageShaft.classList.toggle(
      "is-transitioning",
      status === "TRANSITIONING"
    );
    this.stageShaft.classList.toggle("is-dragging", status === "DRAGGING");
    this.stageShaft.classList.toggle(
      "transition-fade",
      transitionType === "fade" || transitionType === "crossfade"
    );
    this.stageShaft.classList.toggle(
      "transition-slide",
      transitionType === "slide"
    );

    // Update active frame visibility
    this.stageFrames.forEach((frame, index) => {
      frame.classList.toggle("is-active", index === currentIndex);
      frame.setAttribute(
        "aria-hidden",
        index === currentIndex ? "false" : "true"
      );
    });

    // Trigger transition end after duration
    if (status === "TRANSITIONING") {
      setTimeout(() => {
        // Transition end will be handled by store action
      }, this.transitionDuration);
    }
  }

  public setFrames(frames: Frame[]): void {
    // Clear existing frames
    this.stageShaft.innerHTML = "";
    this.stageFrames = [];

    // Create frame elements - they'll be sized in update()
    frames.forEach((frame) => {
      const frameEl = document.createElement("div");
      frameEl.className = "vento-stage-frame";
      frameEl.setAttribute("data-frame-id", frame.id);
      frameEl.style.flexShrink = "0";
      frameEl.style.flexGrow = "0";
      frameEl.style.height = "100%";
      //toto why
      frameEl.style.touchAction = "none";
      frameEl.style.userSelect = "none";
      // frameEl.style.webkitUserSelect = "none";
      // frameEl.style.mozUserSelect = "none";
      // frameEl.style.msUserSelect = "none";

      // Width will be set in update() method

      if (frame.html) {
        frameEl.appendChild(frame.html.cloneNode(true) as HTMLElement);
      } else if (frame.src) {
        const img = document.createElement("img");
        img.src = frame.src;
        if (frame.alt) img.alt = frame.alt;
        // move to css
        img.style.pointerEvents = "none";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        if (frame.caption) {
          img.setAttribute("aria-label", frame.caption);
        }
        frameEl.appendChild(img);
      } else if (frame.video) {
        frameEl.className += " vento-frame-video";
        // Video will be handled by VideoPlugin
      }

      if (frame.caption) {
        const caption = document.createElement("div");
        caption.className = "vento-caption";
        caption.textContent = frame.caption;
        frameEl.appendChild(caption);
      }

      this.stageShaft.appendChild(frameEl);
      this.stageFrames.push(frameEl);
    });
  }
}

class NavRenderer {
  private navShaft: HTMLElement;
  private navType: "thumbs" | "dots" | false;
  private navDirection: "horizontal" | "vertical";
  private navFrames: HTMLElement[] = [];

  constructor(
    navShaft: HTMLElement,
    navType: "thumbs" | "dots" | false,
    navDirection: "horizontal" | "vertical" = "horizontal"
  ) {
    this.navShaft = navShaft;
    this.navType = navType;
    this.navDirection = navDirection;
  }

  public update(state: GalleryState): void {
    const { frames, currentIndex } = state;

    // Update active navigation item
    this.navFrames.forEach((frame, index) => {
      frame.classList.toggle("is-active", index === currentIndex);
      frame.setAttribute(
        "aria-current",
        index === currentIndex ? "true" : "false"
      );
    });

    if (this.navType === "thumbs") {
      // Scroll active thumb into view
      const activeFrame = this.navFrames[currentIndex];
      if (activeFrame) {
        const isVertical = this.navDirection === "vertical";
        activeFrame.scrollIntoView({
          behavior: "smooth",
          block: isVertical ? "nearest" : "nearest",
          inline: isVertical ? "nearest" : "center",
        });
      }
    }
  }

  public setFrames(frames: Frame[]): void {
    // Clear existing frames
    this.navShaft.innerHTML = "";
    this.navFrames = [];

    if (this.navType === "thumbs") {
      frames.forEach((frame) => {
        const thumbEl = document.createElement("div");
        thumbEl.className = "vento-nav-thumb";
        thumbEl.setAttribute("data-frame-id", frame.id);
        thumbEl.setAttribute("role", "button");
        thumbEl.setAttribute("tabindex", "0");

        if (frame.thumb || frame.src) {
          const img = document.createElement("img");
          img.src = frame.thumb || frame.src || "";
          img.alt = frame.caption || "";
          thumbEl.appendChild(img);
        }

        if (frame.caption) {
          thumbEl.setAttribute("aria-label", frame.caption);
        }

        this.navShaft.appendChild(thumbEl);
        this.navFrames.push(thumbEl);
      });
    } else if (this.navType === "dots") {
      frames.forEach((frame, index) => {
        const dotEl = document.createElement("div");
        dotEl.className = "vento-nav-dot";
        dotEl.setAttribute("data-frame-id", frame.id);
        dotEl.setAttribute("role", "button");
        dotEl.setAttribute("tabindex", "0");
        dotEl.setAttribute("aria-label", `Go to slide ${index + 1}`);

        this.navShaft.appendChild(dotEl);
        this.navFrames.push(dotEl);
      });
    }
  }
}

// ============================================================================
// PLUGINS
// ============================================================================

class AutoplayPlugin implements Plugin {
  private timer: number | null = null;
  private store: GalleryStore | null = null;
  private interval: number;
  private unsubscribe: (() => void) | null = null;
  private paused = false;

  constructor(interval: number) {
    this.interval = interval;
  }

  attach(gallery: Vento): void {
    this.store = gallery["store"];
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
    if (state.status === "TRANSITIONING" || state.isPlaying || this.paused) {
      this.stop();
      return;
    }

    if (state.status === "IDLE" && !this.timer && !state.isPlaying) {
      this.start();
    }
  }

  private start(): void {
    if (!this.store) return;
    this.timer = window.setInterval(() => {
      if (this.store) {
        this.store.dispatch({ type: "NEXT" });
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

class KeyboardPlugin implements Plugin {
  private gallery: Vento | null = null;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;
  private config: Partial<
    Record<"left" | "right" | "up" | "down" | "space" | "home" | "end", boolean>
  >;

  constructor(
    config:
      | boolean
      | Partial<
          Record<
            "left" | "right" | "up" | "down" | "space" | "home" | "end",
            boolean
          >
        > = true
  ) {
    this.config =
      typeof config === "boolean"
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

  attach(gallery: Vento): void {
    this.gallery = gallery;
    this.keyHandler = this.handleKeyPress.bind(this);
    if (this.keyHandler) {
      document.addEventListener("keydown", this.keyHandler);
    }
  }

  detach(): void {
    if (this.keyHandler) {
      document.removeEventListener("keydown", this.keyHandler);
      this.keyHandler = null;
    }
    this.gallery = null;
  }

  private handleKeyPress(e: KeyboardEvent): void {
    if (!this.gallery) return;

    // Don't handle keys when user is typing in inputs
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    switch (e.key) {
      case "ArrowLeft":
        if (this.config.left) {
          e.preventDefault();
          this.gallery.prev();
        }
        break;
      case "ArrowRight":
        if (this.config.right) {
          e.preventDefault();
          this.gallery.next();
        }
        break;
      case "ArrowUp":
        if (this.config.up) {
          e.preventDefault();
          this.gallery.prev();
        }
        break;
      case "ArrowDown":
        if (this.config.down) {
          e.preventDefault();
          this.gallery.next();
        }
        break;
      case " ":
        if (this.config.space && !e.shiftKey) {
          e.preventDefault();
          this.gallery.next();
        }
        break;
      case "Home":
        if (this.config.home) {
          e.preventDefault();
          this.gallery.goTo(0);
        }
        break;
      case "End":
        if (this.config.end) {
          e.preventDefault();
          const state = this.gallery["store"]?.getState();
          if (state) {
            this.gallery.goTo(state.frames.length - 1);
          }
        }
        break;
      case "Escape":
        if (this.gallery["store"]?.getState().isFullscreen) {
          e.preventDefault();
          this.gallery.toggleFullscreen();
        }
        break;
    }
  }
}

class TouchPlugin implements Plugin {
  private gallery: Vento | null = null;
  private stageShaft: HTMLElement | null = null;
  private startX = 0;
  private startY = 0;
  private currentX = 0;
  private currentY = 0;
  private isDragging = false;
  private threshold = 50;
  private handlers: {
    pointerdown: (e: PointerEvent) => void;
    pointermove: (e: PointerEvent) => void;
    pointerup: (e: PointerEvent) => void;
    pointercancel: (e: PointerEvent) => void;
  } = {
    pointerdown: () => {},
    pointermove: () => {},
    pointerup: () => {},
    pointercancel: () => {}
  };
  private currentTranslateX = 0;
  private containerWidth = 0;
  private currentIndex = 0;
  private totalFrames = 0;
  private isSwiping = false;

  attach(gallery: Vento): void {
    this.gallery = gallery;
    this.stageShaft = gallery["stageRenderer"]["stageShaft"];

    if (!this.stageShaft) return;

    // Store initial state
    const state = gallery["store"]?.getState();
    if (state) {
      this.currentIndex = state.currentIndex;
      this.totalFrames = state.frames.length;
      this.containerWidth = this.stageShaft.parentElement?.offsetWidth || 0;
      this.currentTranslateX = -this.currentIndex * this.containerWidth;
    }

    // Use Pointer Events for better cross-device support
    this.handlers.pointerdown = this.handlePointerDown.bind(this);
    this.handlers.pointermove = this.handlePointerMove.bind(this);
    this.handlers.pointerup = this.handlePointerUp.bind(this);
    this.handlers.pointercancel = this.handlePointerUp.bind(this);

    // Add event listeners
    this.stageShaft?.addEventListener('pointerdown', this.handlers.pointerdown);
    this.stageShaft.style.touchAction = "pan-y";
    this.stageShaft.style.cursor = "grab";
  }

  detach(): void {
    if (this.stageShaft) {
      this.stageShaft.removeEventListener('pointerdown', this.handlers.pointerdown);
      this.stageShaft.style.touchAction = "";
      this.stageShaft.style.cursor = "";
    }
    this.gallery = null;
    this.stageShaft = null;
  }

  private handlePointerDown(e: PointerEvent): void {
    if (e.button !== 0) return; // Only primary button

    const state = this.gallery?.["store"]?.getState();
    if (!state || state.status === "TRANSITIONING") return;

    this.isDragging = true;
    this.isSwiping = false;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.currentX = this.startX;
    this.currentY = this.startY;

    // Store current state
    this.containerWidth = this.stageShaft?.parentElement?.offsetWidth || 0;
    this.currentIndex = state.currentIndex;
    this.currentTranslateX = -this.currentIndex * this.containerWidth;

    if (this.gallery) {
      this.gallery["store"]?.dispatch({
        type: "SET_DRAGGING",
        isDragging: true,
      });
    }

    if (this.stageShaft) {
      this.stageShaft.style.transition = "none";
      this.stageShaft.style.cursor = "grabbing";
    }

    document.addEventListener("pointermove", this.handlers.pointermove);
    document.addEventListener("pointerup", this.handlers.pointerup);
    document.addEventListener("pointercancel", this.handlers.pointercancel);
    this.stageShaft?.setPointerCapture(e.pointerId);
  }

  private handlePointerMove(e: PointerEvent): void {
    if (!this.isDragging || !this.stageShaft) return;

    e.preventDefault();
    this.currentX = e.clientX;
    this.currentY = e.clientY;

    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;

    // Check if this is a horizontal swipe
    if (!this.isSwiping && Math.abs(deltaX) > 5) {
      this.isSwiping = true;
    }

    // Only handle horizontal swipes
    if (this.isSwiping && Math.abs(deltaX) > Math.abs(deltaY)) {
      const newTranslateX = this.currentTranslateX + deltaX;

      // Apply the transform
      this.stageShaft.style.transform = `translateX(${newTranslateX}px)`;
    }
  }

  private handlePointerUp(e: PointerEvent): void {
    if (!this.isDragging) return;

    document.removeEventListener("pointermove", this.handlers.pointermove);
    document.removeEventListener("pointerup", this.handlers.pointerup);
    document.removeEventListener("pointercancel", this.handlers.pointercancel);
    this.stageShaft?.releasePointerCapture(e.pointerId);

    if (!this.stageShaft) return;

    // Restore cursor
    this.stageShaft.style.cursor = "grab";

    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;

    // Only handle horizontal swipes
    if (this.isSwiping && Math.abs(deltaX) > Math.abs(deltaY)) {
      // Calculate if we should change slides based on drag distance and velocity
      const dragDistance = Math.abs(deltaX);
      const dragVelocity = dragDistance / 300; // Simple velocity calculation
      const shouldChange = dragDistance > this.threshold || dragVelocity > 0.5;

      if (shouldChange) {
        if (deltaX > 0 && this.gallery) {
          this.gallery.prev();
        } else if (deltaX < 0 && this.gallery) {
          this.gallery.next();
        } else if (this.gallery) {
          // Snap back to current slide
          this.gallery.goTo(this.currentIndex);
        }
      } else if (this.gallery) {
        // Snap back to current slide if threshold not met
        this.gallery.goTo(this.currentIndex);
      }
    } else if (this.gallery) {
      // If not a swipe, just snap back
      this.gallery.goTo(this.currentIndex);
    }

    // Reset state
    this.isDragging = false;
    this.isSwiping = false;

    // Dispatch drag end
    if (this.gallery) {
      this.gallery["store"]?.dispatch({
        type: "SET_DRAGGING",
        isDragging: false,
      });
    }
  }
}

class FullscreenPlugin implements Plugin {
  private gallery: Vento | null = null;
  private container: HTMLElement | null = null;
  private useNative = false;
  private fullscreenChangeHandler: (() => void) | null = null;

  constructor(useNative: boolean = false) {
    this.useNative = useNative;
  }

  attach(gallery: Vento): void {
    this.gallery = gallery;
    this.container = gallery["container"];

    this.fullscreenChangeHandler = this.handleFullscreenChange.bind(this);
    if (this.fullscreenChangeHandler) {
      document.addEventListener(
        "fullscreenchange",
        this.fullscreenChangeHandler
      );
      // Use type assertion for non-standard event names
      document.addEventListener(
        "webkitfullscreenchange" as any,
        this.fullscreenChangeHandler
      );
      document.addEventListener(
        "mozfullscreenchange" as any,
        this.fullscreenChangeHandler
      );
      document.addEventListener(
        "MSFullscreenChange" as any,
        this.fullscreenChangeHandler
      );
    }
  }

  detach(): void {
    if (this.fullscreenChangeHandler) {
      document.removeEventListener(
        "fullscreenchange",
        this.fullscreenChangeHandler
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        this.fullscreenChangeHandler
      );
      document.removeEventListener(
        "mozfullscreenchange",
        this.fullscreenChangeHandler
      );
      document.removeEventListener(
        "MSFullscreenChange",
        this.fullscreenChangeHandler
      );
      this.fullscreenChangeHandler = null;
    }
    this.gallery = null;
    this.container = null;
  }

  private handleFullscreenChange(): void {
    const isFullscreen = this.isFullscreen();
    if (this.gallery && this.gallery["store"]) {
      const state = this.gallery["store"].getState();
      if (state.isFullscreen !== isFullscreen) {
        this.gallery["store"].dispatch({ type: "TOGGLE_FULLSCREEN" });
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
      // CSS-based fullscreen (add class)
      this.container.classList.add("vento-fullscreen");
      document.body.classList.add("vento-fullscreen-active");
      if (this.gallery) {
        this.gallery["store"]?.dispatch({ type: "TOGGLE_FULLSCREEN" });
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
      this.container.classList.remove("vento-fullscreen");
      document.body.classList.remove("vento-fullscreen-active");
      if (this.gallery) {
        this.gallery["store"]?.dispatch({ type: "TOGGLE_FULLSCREEN" });
      }
    }
  }
}

class VideoPlugin implements Plugin {
  private gallery: Vento | null = null;
  private store: GalleryStore | null = null;
  private currentVideoElement: HTMLIFrameElement | null = null;
  private unsubscribe: (() => void) | null = null;

  attach(gallery: Vento): void {
    this.gallery = gallery;
    this.store = gallery["store"];
    if (!this.store) return;

    this.unsubscribe = this.store.subscribe((state) => {
      this.handleStateChange(state);
    });
  }

  detach(): void {
    this.removeVideo();
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.store = null;
    this.gallery = null;
  }

  private handleStateChange(state: GalleryState): void {
    const currentFrame = state.frames[state.currentIndex];
    const isVideo = currentFrame?.video !== null;

    if (state.isPlaying && isVideo && !this.currentVideoElement) {
      this.showVideo(currentFrame.video!);
    } else if (!state.isPlaying || !isVideo) {
      this.removeVideo();
    }
  }

  private showVideo(videoInfo: VideoInfo): void {
    if (!this.gallery) return;

    const stageShaft = this.gallery["stageRenderer"]["stageShaft"];
    const currentFrame = stageShaft.querySelector(
      `[data-frame-id="${
        this.gallery["store"]?.getState().frames[
          this.gallery["store"]?.getState().currentIndex || 0
        ]?.id
      }"]`
    );

    if (!currentFrame) return;

    this.removeVideo();

    const iframe = document.createElement("iframe");
    iframe.className = "vento-video-iframe";
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("frameborder", "0");

    if (videoInfo.type === "youtube") {
      iframe.src = `https://www.youtube.com/embed/${videoInfo.id}`;
    } else if (videoInfo.type === "vimeo") {
      iframe.src = `https://player.vimeo.com/video/${videoInfo.id}`;
    } else if (videoInfo.url) {
      iframe.src = videoInfo.url;
    }

    currentFrame.appendChild(iframe);
    this.currentVideoElement = iframe;
  }

  private removeVideo(): void {
    if (this.currentVideoElement) {
      this.currentVideoElement.remove();
      this.currentVideoElement = null;
    }
  }
}

// ============================================================================
// MAIN GALLERY CLASS
// ============================================================================

export class Vento {
  private container: HTMLElement;
  private wrap!: HTMLElement;
  private stage!: HTMLElement;
  private stageShaft!: HTMLElement;
  private navWrap!: HTMLElement;
  private navShaft!: HTMLElement;
  private arrPrev!: HTMLElement;
  private arrNext!: HTMLElement;
  private store: GalleryStore;
  private stageRenderer: StageRenderer;
  private navRenderer: NavRenderer;
  private plugins: Plugin[] = [];
  private eventListeners: Map<GalleryEvent, Set<Function>> = new Map();
  private unsubscribe: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private options: Required<VentoOptions>;
  private fullscreenPlugin: FullscreenPlugin | null = null;

  // // Expose internals for plugins (using bracket notation to avoid public API)
  // [key: string]: any;

  constructor(
    container: HTMLElement,
    frames: readonly Frame[],
    options: VentoOptions = {}
  ) {
    if (!container) {
      throw new Error("Vento: container element is required");
    }

    if (!frames || frames.length === 0) {
      throw new Error("Vento: at least one frame is required");
    }

    this.container = container;

    // Merge options with defaults
    this.options = {
      autoplay: false,
      loop: false,
      transition: "slide",
      transitionDuration: 300,
      nav: "dots",
      navPosition: "bottom",
      navDirection: "horizontal",
      fullscreen: false,
      keyboard: false,
      arrows: true,
      click: true,
      swipe: false,
      startIndex: 0,
      width: null,
      height: null,
      showCaption: true,
      ...options,
    };

    // Initialize state
    const initialState: GalleryState = {
      frames: Object.freeze([...frames]),
      currentIndex: Math.max(
        0,
        Math.min(this.options.startIndex, frames.length - 1)
      ),
      status: "IDLE",
      isFullscreen: false,
      isPlaying: false,
      playingVideoId: null,
      transitionType: this.options.transition,
      loop: this.options.loop,
    };

    this.store = new GalleryStore(initialState);

    // Create DOM structure
    this.createDOM();

    // Initialize renderers
    this.stageRenderer = new StageRenderer(
      this.stageShaft,
      this.options.transitionDuration
    );
    this.navRenderer = new NavRenderer(
      this.navShaft,
      this.options.nav,
      this.options.navDirection
    );

    // Set frames in renderers
    this.stageRenderer.setFrames([...frames]);
    this.navRenderer.setFrames([...frames]);

    // Add click handlers to nav items
    if (this.options.nav && this.options.click && this.navShaft) {
      this.navShaft.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const navItem = target.closest("[data-frame-id]") as HTMLElement;
        if (navItem) {
          const frameId = navItem.getAttribute("data-frame-id");
          const index = frames.findIndex((f) => f.id === frameId);
          if (index !== -1) {
            this.goTo(index);
          }
        }
      });

      // Add keyboard support for nav items
      this.navShaft.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          const target = e.target as HTMLElement;
          const navItem = target.closest("[data-frame-id]") as HTMLElement;
          if (navItem) {
            e.preventDefault();
            const frameId = navItem.getAttribute("data-frame-id");
            const index = frames.findIndex((f) => f.id === frameId);
            if (index !== -1) {
              this.goTo(index);
            }
          }
        }
      });
    }

    // Subscribe to state changes
    this.unsubscribe = this.store.subscribe((state) => {
      this.handleStateChange(state);
    });

    // Attach plugins
    this.attachPlugins();

    // Handle resize
    this.resizeObserver = new ResizeObserver(() => {
      // Recalculate transform on resize
      requestAnimationFrame(() => {
        this.handleStateChange(this.store.getState());
      });
    });
    this.resizeObserver.observe(this.container);
    if (this.stage) {
      this.resizeObserver.observe(this.stage);
    }

    // Initial render - wait for DOM to be ready and layout to complete
    setTimeout(() => {
      this.handleStateChange(this.store.getState());
    }, 0);

    // Also trigger on next frame for good measure
    requestAnimationFrame(() => {
      this.handleStateChange(this.store.getState());
    });

    // Emit ready event
    this.emit("ready");
  }

  private createDOM(): void {
    // Clear container
    this.container.innerHTML = "";
    this.container.className = "vento-gallery";

    // Create wrap
    this.wrap = parseHTML(
      `<div class="vento-wrap ${
        this.options.navDirection === "vertical" ? "flex" : ""
      }"></div>`
    );

    this.stage = parseHTML(
      `<div class="vento-stage relative overflow-hidden w-100"></div>`
    );

    this.stageShaft = parseHTML(`<div class="vento-stage-shaft flex"> </div>`);
    this.stageShaft.style.setProperty("--offset", "0px");
    this.stageShaft.style.transform = "translate3d(var(--offset), 0, 0)";
    this.stageShaft.style.transition = "transform 200ms ease";

    this.stage.appendChild(this.stageShaft);

    // Create arrows
    if (this.options.arrows) {
      this.arrPrev = parseHTML(`<button class="vento-arrow vento-arrow-prev" 
              type="button" 
              aria-label="Previous" 
              data-vento-action="prev"></button>`);
      this.arrPrev.addEventListener("click", () => this.prev());

      this.arrNext = parseHTML(`<button class="vento-arrow vento-arrow-next" 
              type="button" 
              aria-label="Next" 
              data-vento-action="next"></button>`);
      this.arrNext.addEventListener("click", () => this.next());

      this.stage.appendChild(this.arrPrev);
      this.stage.appendChild(this.arrNext);
    }

    // Create navigation
    if (this.options.nav) {
      this.navWrap = parseHTML(
        `<div class="vento-nav-wrap vento-nav-${this.options.navDirection}"></div>`
      );

      this.navShaft = document.createElement("div");
      this.navShaft.className = `vento-nav-shaft vento-nav-${this.options.nav}`;
      this.navShaft.setAttribute("role", "tablist");

      if (this.options.nav === "thumbs") {
        this.navShaft.style.display = "flex";
        this.navShaft.style.flexDirection =
          this.options.navDirection === "vertical" ? "column" : "row";
        this.navShaft.style.overflow = "auto";
        this.navShaft.style.gap = "4px";
      } else if (this.options.nav === "dots") {
        this.navShaft.style.display = "flex";
        this.navShaft.style.justifyContent = "center";
        this.navShaft.style.gap = "8px";
      }

      this.navWrap.appendChild(this.navShaft);

      if (this.options.navPosition === "top") {
        this.wrap.insertBefore(this.navWrap, this.stage);
      } else {
        this.wrap.appendChild(this.navWrap);
      }
    } else {
      // Create empty navShaft to avoid null checks
      this.navShaft = document.createElement("div");
    }

    // Create fullscreen button
    if (this.options.fullscreen) {
      const btn = parseHTML(`
        <button class="vento-fullscreen-btn" style="border: 1px solid white;" aria-label="Toggle fullscreen" type="button"></button>
      `);

      btn.addEventListener("click", () => this.toggleFullscreen());
      this.stage.appendChild(btn);
    }

    this.wrap.appendChild(this.stage);
    this.container.appendChild(this.wrap);

    // Add click handlers to nav items
    if (this.options.nav && this.options.click) {
      // Will be attached after frames are set
    }
  }

  private attachPlugins(): void {
    // Autoplay plugin
    if (this.options.autoplay) {
      const autoplayPlugin = new AutoplayPlugin(this.options.autoplay);
      autoplayPlugin.attach(this);
      this.plugins.push(autoplayPlugin);
    }

    // Keyboard plugin
    if (this.options.keyboard) {
      const keyboardPlugin = new KeyboardPlugin(this.options.keyboard);
      keyboardPlugin.attach(this);
      this.plugins.push(keyboardPlugin);
    }

    // Touch/Swipe plugin
    if (this.options.swipe) {
      const touchPlugin = new TouchPlugin();
      touchPlugin.attach(this);
      this.plugins.push(touchPlugin);
    }

    // Fullscreen plugin
    if (this.options.fullscreen) {
      const useNative = this.options.fullscreen === "native";
      const fullscreenPlugin = new FullscreenPlugin(useNative);
      fullscreenPlugin.attach(this);
      this.plugins.push(fullscreenPlugin);
      // Store reference for toggleFullscreen method
      this.fullscreenPlugin = fullscreenPlugin;
    }

    // Video plugin
    const videoPlugin = new VideoPlugin();
    videoPlugin.attach(this);
    this.plugins.push(videoPlugin);
  }

  private handleStateChange(state: GalleryState): void {
    // Update renderers
    this.stageRenderer.update(state);
    this.navRenderer.update(state);

    // Update arrows
    if (this.options.arrows) {
      const canGoPrev = state.loop || state.currentIndex > 0;
      const canGoNext =
        state.loop || state.currentIndex < state.frames.length - 1;

      (this.arrPrev as HTMLButtonElement).disabled = !canGoPrev;
      (this.arrNext as HTMLButtonElement).disabled = !canGoNext;
      this.arrPrev.classList.toggle("is-disabled", !canGoPrev);
      this.arrNext.classList.toggle("is-disabled", !canGoNext);
    }

    // Emit change event
    this.emit("change", state);

    // Handle transition end
    if (state.status === "TRANSITIONING") {
      setTimeout(() => {
        this.store.dispatch({ type: "END_TRANSITION" });
        this.emit("showend");
      }, this.options.transitionDuration);
    }

    // Handle fullscreen changes
    if (state.isFullscreen) {
      this.container.classList.add("is-fullscreen");
      this.emit("fullscreenenter");
    } else {
      this.container.classList.remove("is-fullscreen");
      this.emit("fullscreenexit");
    }
  }

  // Public API Methods
  public next(): void {
    this.store.dispatch({ type: "NEXT" });
    this.emit("show");
  }

  public prev(): void {
    this.store.dispatch({ type: "PREV" });
    this.emit("show");
  }

  public goTo(index: number): void {
    this.store.dispatch({ type: "GO_TO", index });
    this.emit("show");
  }

  public play(): void {
    const state = this.store.getState();
    const currentFrame = state.frames[state.currentIndex];
    if (currentFrame?.video) {
      this.store.dispatch({
        type: "PLAY_VIDEO",
        videoId: currentFrame.video.id,
      });
      this.emit("loadvideo");
    }
  }

  public pause(): void {
    this.store.dispatch({ type: "STOP_VIDEO" });
    this.emit("unloadvideo");
  }

  public toggleFullscreen(): void {
    const fullscreenPlugin = this.fullscreenPlugin as
      | FullscreenPlugin
      | undefined;
    if (fullscreenPlugin) {
      const state = this.store.getState();
      if (state.isFullscreen) {
        fullscreenPlugin.exit();
      } else {
        fullscreenPlugin.request();
      }
    } else {
      this.store.dispatch({ type: "TOGGLE_FULLSCREEN" });
    }
  }

  public destroy(): void {
    // Detach all plugins
    this.plugins.forEach((plugin) => plugin.detach());
    this.plugins = [];

    // Unsubscribe from store
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    // Disconnect resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Remove event listeners
    this.eventListeners.clear();

    // Clear DOM
    this.container.innerHTML = "";
  }

  // Event emitter methods
  public on(event: GalleryEvent, handler: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(handler);
  }

  public off(event: GalleryEvent, handler: Function): void {
    this.eventListeners.get(event)?.delete(handler);
  }

  private emit(event: GalleryEvent, ...args: any[]): void {
    this.eventListeners.get(event)?.forEach((handler) => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`Vento: Error in ${event} handler:`, error);
      }
    });
  }
}

const parseHTML = (html: string): HTMLElement => {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild as HTMLElement;
};