import { GalleryState, GalleryItem } from '../../state/types';
import { Renderer } from '../types';
import { VentoOptions } from '../../core/options';

export class ThumbnailsRenderer implements Renderer {
  private navShaft!: HTMLElement;
  private navType: 'thumbs' | 'dots' | false = 'dots';
  private navDirection: 'horizontal' | 'vertical' = 'horizontal';
  private navFrames: HTMLElement[] = [];

  public init(root: HTMLElement, options: Required<VentoOptions>): void {
    this.navShaft = root;
    this.navType = options.nav;
    this.navDirection = options.navDirection;
  }

  public update(state: GalleryState): void {
    const { currentIndex } = state;

    this.navFrames.forEach((frame, index) => {
      frame.classList.toggle('is-active', index === currentIndex);
      frame.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
    });

    if (this.navType === 'thumbs') {
      const activeFrame = this.navFrames[currentIndex];
      if (activeFrame) {
        const isVertical = this.navDirection === 'vertical';
        activeFrame.scrollIntoView({
          behavior: 'smooth',
          block: isVertical ? 'nearest' : 'nearest',
          inline: isVertical ? 'nearest' : 'center',
        });
      }
    }
  }

  public setFrames(frames: readonly GalleryItem[]): void {
    this.navShaft.innerHTML = '';
    this.navFrames = [];

    if (this.navType === 'thumbs') {
      frames.forEach((frame) => {
        const thumbEl = document.createElement('div');
        thumbEl.className = 'vento-nav-thumb';
        thumbEl.setAttribute('data-frame-id', frame.id);
        thumbEl.setAttribute('role', 'button');
        thumbEl.setAttribute('tabindex', '0');

        if (frame.thumb || frame.src) {
          const img = document.createElement('img');
          img.src = frame.thumb || frame.src || '';
          img.alt = frame.caption || '';
          thumbEl.appendChild(img);
        }
        if (frame.caption) thumbEl.setAttribute('aria-label', frame.caption);

        this.navShaft.appendChild(thumbEl);
        this.navFrames.push(thumbEl);
      });
    } else if (this.navType === 'dots') {
      frames.forEach((frame, index) => {
        const dotEl = document.createElement('div');
        dotEl.className = 'vento-nav-dot';
        dotEl.setAttribute('data-frame-id', frame.id);
        dotEl.setAttribute('role', 'button');
        dotEl.setAttribute('tabindex', '0');
        dotEl.setAttribute('aria-label', `Go to slide ${index + 1}`);

        this.navShaft.appendChild(dotEl);
        this.navFrames.push(dotEl);
      });
    }
  }

  public destroy(): void {
    this.navShaft.innerHTML = '';
  }
}
