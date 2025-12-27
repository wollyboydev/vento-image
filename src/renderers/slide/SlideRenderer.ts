import { GalleryState, GalleryItem } from '../../state/types';
import { Renderer } from '../types';
import { VentoOptions } from '../../core/options';
import { SnapPhysics } from './SnapPhysics';
import { PhysicsStrategy } from '../../engine/physics/Strategy';
import { Time } from '../../engine/Time';

export class SlideRenderer implements Renderer {
  public stageShaft!: HTMLElement;
  private stageFrames: HTMLElement[] = [];
  private transitionDuration: number = 300;
  private physics!: PhysicsStrategy;
  private time!: Time;

  public init(root: HTMLElement, options: Required<VentoOptions>): void {
    this.stageShaft = root;
    this.transitionDuration = options.transitionDuration;

    this.physics = new SnapPhysics({
      friction: 0.9,
      spring: 0.08,
    });

    this.time = Time.getInstance();
    this.time.add(this.tick.bind(this));
  }

  public update(state: GalleryState): void {
    const { frames, currentIndex, status, transitionType } = state;

    const container = this.stageShaft.parentElement;
    if (!container || this.stageFrames.length === 0) return;

    let containerWidth = container.offsetWidth;
    if (!containerWidth) containerWidth = container.clientWidth;
    if (!containerWidth && container.getBoundingClientRect) {
      containerWidth = container.getBoundingClientRect().width;
    }

    if (!containerWidth || containerWidth === 0) {
      void container.offsetHeight;
      containerWidth = container.offsetWidth || container.clientWidth || 0;
    }

    if (containerWidth > 0) {
      const frameWidth = containerWidth;
      this.stageFrames.forEach((frameEl) => {
        frameEl.style.width = `${frameWidth}px`;
      });

      const totalWidth = frames.length * frameWidth;
      this.stageShaft.style.width = `${totalWidth}px`;

      const minBound = -(totalWidth - frameWidth);
      const maxBound = 0;
      this.physics.setBounds(minBound, maxBound);

      const targetPos = currentIndex * frameWidth * -1;

      if (status !== 'DRAGGING') {
        this.physics.setTarget(targetPos);
      }

      if (status === 'IDLE' && this.stageShaft.style.transform === '') {
        this.physics.forceSet(targetPos);
        this.setPosition(targetPos);
      }

      this.stageShaft.style.transition = 'none';
      this.stageShaft.style.transitionDuration = '0ms';
    }

    this.stageShaft.classList.toggle('is-transitioning', status === 'TRANSITIONING');
    this.stageShaft.classList.toggle('is-dragging', status === 'DRAGGING');
    this.stageShaft.classList.toggle(
      'transition-fade',
      transitionType === 'fade' || transitionType === 'crossfade'
    );
    this.stageShaft.classList.toggle('transition-slide', transitionType === 'slide');

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
    this.stageShaft.style.transform = `translate3d(${val}px, 0, 0)`;
  }

  public tick(deltaTime: number): void {
    const changed = this.physics.update();
    if (changed) {
      this.setPosition(this.physics.getPosition());
    }
  }

  public stop(): void {
    this.physics.stop();
  }

  public drag(delta: number): void {
    const pos = this.physics.drag(delta);
    this.setPosition(pos);
  }

  public release(velocity: number): void {
    this.physics.release(velocity);
  }

  public getPosition(): number {
    return this.physics.getPosition();
  }

  public forceSet(position: number): void {
    this.physics.forceSet(position);
    this.setPosition(position);
  }

  public destroy(): void {
    if (this.time) {
      this.time.remove(this.tick.bind(this));
    }
  }
}
