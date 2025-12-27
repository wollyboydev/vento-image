import { GalleryState, GalleryItem } from '../../state/types';
import { Renderer } from '../interface';

export class DOMStageRenderer implements Renderer {
  public stageShaft: HTMLElement;
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
    if (!containerWidth) containerWidth = container.clientWidth;
    if (!containerWidth && container.getBoundingClientRect) {
      containerWidth = container.getBoundingClientRect().width;
    }

    // Force reflow fallback
    if (!containerWidth || containerWidth === 0) {
      void container.offsetHeight;
      containerWidth = container.offsetWidth || container.clientWidth || 0;
    }

    if (containerWidth > 0) {
      const frameWidth = containerWidth;
      this.stageFrames.forEach((frameEl) => {
        frameEl.style.width = `${frameWidth}px`;
      });

      this.stageShaft.style.width = `${frames.length * frameWidth}px`;
      const offsetPx = currentIndex * frameWidth * -1;

      this.stageShaft.style.setProperty('--offset', `${offsetPx}px`);
      this.stageShaft.style.transform = `translateX(${offsetPx}px)`;

      if (status === 'DRAGGING') {
        this.stageShaft.style.transition = 'none';
      } else {
        this.stageShaft.style.transition = `transform ${this.transitionDuration}ms ease`;
      }
    }

    this.stageShaft.style.transitionDuration =
      status === 'DRAGGING' ? '0ms' : `${this.transitionDuration}ms`;

    // Toggle classes
    this.stageShaft.classList.toggle('is-transitioning', status === 'TRANSITIONING');
    this.stageShaft.classList.toggle('is-dragging', status === 'DRAGGING');
    this.stageShaft.classList.toggle(
      'transition-fade',
      transitionType === 'fade' || transitionType === 'crossfade'
    );
    this.stageShaft.classList.toggle('transition-slide', transitionType === 'slide');

    // Visibility
    this.stageFrames.forEach((frame, index) => {
      frame.classList.toggle('is-active', index === currentIndex);
      frame.setAttribute('aria-hidden', index === currentIndex ? 'false' : 'true');
    });
  }

  public setFrames(frames: readonly GalleryItem[]): void {
    this.stageShaft.innerHTML = '';
    this.stageFrames = [];

    frames.forEach((frame) => {
      const frameEl = document.createElement('div');
      frameEl.className = 'vento-stage-frame';
      frameEl.setAttribute('data-frame-id', frame.id);
      frameEl.style.flexShrink = '0';
      frameEl.style.flexGrow = '0';
      frameEl.style.height = '100%';
      frameEl.style.touchAction = 'none';
      frameEl.style.userSelect = 'none';

      if (frame.html) {
        frameEl.appendChild(frame.html.cloneNode(true) as HTMLElement);
      } else if (frame.src) {
        const img = document.createElement('img');
        img.src = frame.src;
        if (frame.alt) img.alt = frame.alt;
        img.style.pointerEvents = 'none';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        if (frame.caption) img.setAttribute('aria-label', frame.caption);
        frameEl.appendChild(img);
      } else if (frame.video) {
        frameEl.classList.add('vento-frame-video');
      }

      if (frame.caption) {
        const caption = document.createElement('div');
        caption.className = 'vento-caption';
        caption.textContent = frame.caption;
        frameEl.appendChild(caption);
      }

      this.stageShaft.appendChild(frameEl);
      this.stageFrames.push(frameEl);
    });
  }
}
