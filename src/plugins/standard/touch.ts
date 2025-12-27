import { Plugin } from '../interface';

export class TouchPlugin implements Plugin {
  private gallery: any | null = null;
  private stageShaft: HTMLElement | null = null;
  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private lastTime = 0;
  private velocity = 0;
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
    pointercancel: () => {},
  };

  private containerWidth = 0;
  private currentIndex = 0;
  private totalFrames = 0;
  private isSwiping = false;

  attach(gallery: any): void {
    this.gallery = gallery;
    this.stageShaft = gallery.stageRenderer?.stageShaft;

    if (!this.stageShaft) return;

    const state = gallery.store?.getState();
    if (state) {
      this.currentIndex = state.currentIndex;
      this.totalFrames = state.frames.length;
      this.containerWidth = this.stageShaft.parentElement?.offsetWidth || 0;
    }

    this.handlers.pointerdown = this.handlePointerDown.bind(this);
    this.handlers.pointermove = this.handlePointerMove.bind(this);
    this.handlers.pointerup = this.handlePointerUp.bind(this);
    this.handlers.pointercancel = this.handlePointerUp.bind(this);

    this.stageShaft?.addEventListener('pointerdown', this.handlers.pointerdown);
    this.stageShaft.style.touchAction = 'pan-y';
    this.stageShaft.style.cursor = 'grab';
  }

  detach(): void {
    if (this.stageShaft) {
      this.stageShaft.removeEventListener('pointerdown', this.handlers.pointerdown);
      this.stageShaft.style.touchAction = '';
      this.stageShaft.style.cursor = '';
    }
    this.gallery = null;
    this.stageShaft = null;
  }

  private handlePointerDown(e: PointerEvent): void {
    if (e.button !== 0) return;

    const state = this.gallery?.store?.getState();
    if (!state) return;

    this.isDragging = true;
    this.isSwiping = false;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.lastX = this.startX;
    this.lastTime = performance.now();
    this.velocity = 0;

    this.currentIndex = state.currentIndex;

    if (this.stageShaft) {
      this.stageShaft.style.cursor = 'grabbing';
    }

    // Stop and set status to DRAGGING immediately on down
    if (this.gallery) {
      this.gallery.store?.dispatch({
        type: 'SET_DRAGGING',
        isDragging: true,
      });

      if (this.gallery.stageRenderer?.stop) {
        this.gallery.stageRenderer.stop();
      }
    }

    document.addEventListener('pointermove', this.handlers.pointermove);
    document.addEventListener('pointerup', this.handlers.pointerup);
    document.addEventListener('pointercancel', this.handlers.pointercancel);
  }

  private handlePointerMove(e: PointerEvent): void {
    if (!this.isDragging || !this.stageShaft) return;

    e.preventDefault();

    if (!this.isSwiping) {
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      if (Math.abs(dx) > 5) {
        // Threshold
        this.isSwiping = true;
        this.lastX = e.clientX; // Reset lastX to avoid jump
        this.lastTime = performance.now();

        if (this.gallery) {
          this.gallery.store?.dispatch({
            type: 'SET_DRAGGING',
            isDragging: true,
          });
        }
        // Capture pointer to ensure we get events even if user drags outside
        this.stageShaft.setPointerCapture(e.pointerId);
      }
    }

    if (this.isSwiping) {
      const now = performance.now();
      const dt = now - this.lastTime;
      const currentX = e.clientX;
      const dx = currentX - this.lastX;

      if (dt > 0) {
        this.velocity = dx / dt; // px/ms
      }

      this.lastX = currentX;
      this.lastTime = now;

      this.gallery.stageRenderer.drag(dx);
    }
  }

  private handlePointerUp(e: PointerEvent): void {
    if (!this.isDragging) return;

    document.removeEventListener('pointermove', this.handlers.pointermove);
    document.removeEventListener('pointerup', this.handlers.pointerup);
    document.removeEventListener('pointercancel', this.handlers.pointercancel);
    this.stageShaft?.releasePointerCapture(e.pointerId);

    if (!this.stageShaft) return;

    this.stageShaft.style.cursor = 'grab';

    const deltaX = e.clientX - this.startX;

    if (this.isSwiping) {
      const heavyVelocity = this.velocity * 16;

      if (this.gallery?.stageRenderer?.release) {
        this.gallery.stageRenderer.release(heavyVelocity);
      }

      const dragDistance = Math.abs(deltaX);
      const shouldChange = dragDistance > this.threshold || Math.abs(this.velocity) > 0.5;

      if (shouldChange) {
        if (deltaX > 0 && this.gallery) {
          this.gallery.prev();
        } else if (deltaX < 0 && this.gallery) {
          this.gallery.next();
        } else if (this.gallery) {
          this.gallery.goTo(this.currentIndex);
        }
      } else if (this.gallery) {
        this.gallery.goTo(this.currentIndex);
      }
    } else {
      if (this.gallery?.stageRenderer?.getPosition && this.containerWidth > 0) {
        const currentPos = this.gallery.stageRenderer.getPosition();
        const frameWidth = this.containerWidth;

        const nearestIndex = Math.round(Math.abs(currentPos) / frameWidth);
        const clampedIndex = Math.max(0, Math.min(nearestIndex, this.totalFrames - 1));

        const targetPos = clampedIndex * frameWidth * -1;
        if (this.gallery.stageRenderer.forceSet) {
          this.gallery.stageRenderer.forceSet(targetPos);
        }

        if (clampedIndex !== this.currentIndex) {
          this.gallery.goTo(clampedIndex);
        }
      }
    }

    this.isDragging = false;
    this.isSwiping = false;

    if (this.gallery) {
      this.gallery.store?.dispatch({
        type: 'SET_DRAGGING',
        isDragging: false,
      });
    }
  }
}
