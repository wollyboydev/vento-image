import { GalleryState, GalleryItem } from '../../state/types';
import { Renderer } from '../interface';

export class DOMNavRenderer implements Renderer {
  private navShaft: HTMLElement;
  private navType: 'thumbs' | 'dots' | false;
  private navDirection: 'horizontal' | 'vertical';
  private navFrames: HTMLElement[] = [];

  constructor(
    navShaft: HTMLElement,
    navType: 'thumbs' | 'dots' | false,
    navDirection: 'horizontal' | 'vertical' = 'horizontal'
  ) {
    this.navShaft = navShaft;
    this.navType = navType;
    this.navDirection = navDirection;
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
}
