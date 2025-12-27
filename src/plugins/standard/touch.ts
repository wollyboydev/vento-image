import { Plugin } from '../interface';

export class TouchPlugin implements Plugin {
  private gallery: any | null = null;
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
    pointercancel: () => {},
  };
  private currentTranslateX = 0;
  private containerWidth = 0;
  private currentIndex = 0;
  private totalFrames = 0;
  private isSwiping = false;

  attach(gallery: any): void {
    this.gallery = gallery;
    // Assuming gallery exposes stageRenderer or we can get it
    // In new arch, we might want a stricter way, but for refactor parity:
    this.stageShaft = gallery.stageRenderer?.stageShaft;

    if (!this.stageShaft) return;

    const state = gallery.store?.getState();
    if (state) {
      this.currentIndex = state.currentIndex;
      this.totalFrames = state.frames.length;
      this.containerWidth = this.stageShaft.parentElement?.offsetWidth || 0;
      this.currentTranslateX = -this.currentIndex * this.containerWidth;
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
    if (!state || state.status === 'TRANSITIONING') return;

    this.isDragging = true;
    this.isSwiping = false;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.currentX = this.startX;
    this.currentY = this.startY;

    this.containerWidth = this.stageShaft?.parentElement?.offsetWidth || 0;
    this.currentIndex = state.currentIndex;
    this.currentTranslateX = -this.currentIndex * this.containerWidth;

    if (this.gallery) {
      this.gallery.store?.dispatch({
        type: 'SET_DRAGGING',
        isDragging: true,
      });
    }

    if (this.stageShaft) {
      this.stageShaft.style.transition = 'none';
      this.stageShaft.style.cursor = 'grabbing';
      this.stageShaft.setPointerCapture(e.pointerId);
    }

    document.addEventListener('pointermove', this.handlers.pointermove);
    document.addEventListener('pointerup', this.handlers.pointerup);
    document.addEventListener('pointercancel', this.handlers.pointercancel);
  }

  private handlePointerMove(e: PointerEvent): void {
    if (!this.isDragging || !this.stageShaft) return;

    e.preventDefault();
    this.currentX = e.clientX;
    this.currentY = e.clientY;

    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;

    if (!this.isSwiping && Math.abs(deltaX) > 5) {
      this.isSwiping = true;
    }

    if (this.isSwiping && Math.abs(deltaX) > Math.abs(deltaY)) {
      const newTranslateX = this.currentTranslateX + deltaX;
      this.stageShaft.style.transform = `translateX(${newTranslateX}px)`;
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

    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;

    if (this.isSwiping && Math.abs(deltaX) > Math.abs(deltaY)) {
      const dragDistance = Math.abs(deltaX);
      const dragVelocity = dragDistance / 300;
      const shouldChange = dragDistance > this.threshold || dragVelocity > 0.5;

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
    } else if (this.gallery) {
      this.gallery.goTo(this.currentIndex);
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
