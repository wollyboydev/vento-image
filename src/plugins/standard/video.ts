import { Plugin } from '../interface';
import { GalleryStore } from '../../state/store';
import { GalleryState, VideoInfo } from '../../state/types';

export class VideoPlugin implements Plugin {
  private gallery: any | null = null;
  private store: GalleryStore | null = null;
  private currentVideoElement: HTMLIFrameElement | null = null;
  private unsubscribe: (() => void) | null = null;

  attach(gallery: any): void {
    this.gallery = gallery;
    this.store = gallery.store;
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
      if (currentFrame.video) {
        this.showVideo(currentFrame.video);
      }
    } else if (!state.isPlaying || !isVideo) {
      this.removeVideo();
    }
  }

  private showVideo(videoInfo: VideoInfo): void {
    if (!this.gallery || !this.gallery.stageRenderer?.stageShaft) return;

    const stageShaft = this.gallery.stageRenderer.stageShaft as HTMLElement;
    const currentFrame = stageShaft.querySelector(
      `[data-frame-id="${
        this.store?.getState().frames[this.store?.getState().currentIndex || 0]?.id
      }"]`
    );

    if (!currentFrame) return;

    this.removeVideo();

    const iframe = document.createElement('iframe');
    iframe.className = 'vento-video-iframe';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('frameborder', '0');

    if (videoInfo.type === 'youtube') {
      iframe.src = `https://www.youtube.com/embed/${videoInfo.id}`;
    } else if (videoInfo.type === 'vimeo') {
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
