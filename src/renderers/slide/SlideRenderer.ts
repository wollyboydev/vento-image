import { GalleryState, GalleryItem } from '../../state/types';
import { Renderer } from '../types';
import { VentoOptions } from '../../core/options';

export class SlideRenderer implements Renderer {
  public stageShaft!: HTMLElement;
  private stageFrames: HTMLElement[] = [];
  private transitionDuration: number = 300;
  private currentPosition: number = 0;

  public init(root: HTMLElement, options: Required<VentoOptions>): void {
    this.stageShaft = root;
    this.transitionDuration = options.transitionDuration;
    this.stageShaft.style.transition = `transform ${this.transitionDuration}ms ease`;
  }

  public update(state: GalleryState): void {
    const { frames, currentIndex, status } = state;
    const container = this.stageShaft.parentElement;
    if (!container || this.stageFrames.length === 0) return;

    const containerWidth = container.offsetWidth || container.clientWidth || 0;

    if (containerWidth > 0) {
      const frameWidth = containerWidth;
      this.stageFrames.forEach((frameEl) => {
        frameEl.style.width = `${frameWidth}px`;
      });

      const totalWidth = frames.length * frameWidth;
      this.stageShaft.style.width = `${totalWidth}px`;

      const targetPos = currentIndex * frameWidth * -1;

      // Handle transition state
      if (status === 'DRAGGING') {
        this.stageShaft.style.transition = 'none';
      } else {
        this.stageShaft.style.transition = `transform ${this.transitionDuration}ms ease`;
        this.setPosition(targetPos);
      }
    }

    this.stageShaft.classList.toggle('is-transitioning', status === 'TRANSITIONING');
    this.stageShaft.classList.toggle('is-dragging', status === 'DRAGGING');

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

  public setPosition(val: number): void {
    this.currentPosition = val;
    this.stageShaft.style.transform = `translate3d(${val}px, 0, 0)`;
  }

  public drag(delta: number): void {
    this.currentPosition += delta;
    this.setPosition(this.currentPosition);
  }

  public getPosition(): number {
    return this.currentPosition;
  }

  public forceSet(position: number): void {
    this.stageShaft.style.transition = 'none';
    this.setPosition(position);
    // Force reflow
    void this.stageShaft.offsetHeight;
    this.stageShaft.style.transition = `transform ${this.transitionDuration}ms ease`;
  }

  public destroy(): void {
    this.stageShaft.innerHTML = '';
  }
}
