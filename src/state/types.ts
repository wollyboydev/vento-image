export interface VideoInfo {
  readonly type: 'youtube' | 'vimeo' | 'custom';
  readonly id: string;
  readonly url?: string;
}

export interface GalleryItem {
  readonly id: string;
  readonly src: string | null;
  readonly thumb: string | null;
  readonly caption: string | null;
  readonly alt?: string;
  readonly video: VideoInfo | null;
  readonly html: HTMLElement | null;
  readonly width?: number;
  readonly height?: number;
  readonly ratio?: number;
}

// Alias for backwards compatibility or clarity if needed
export type Frame = GalleryItem;

export type GalleryStatus = 'IDLE' | 'TRANSITIONING' | 'DRAGGING';

export interface GalleryState {
  readonly frames: readonly GalleryItem[];
  readonly currentIndex: number;
  readonly status: GalleryStatus;
  readonly isFullscreen: boolean;
  readonly isPlaying: boolean;
  readonly playingVideoId: string | null;
  readonly transitionType: 'slide' | 'fade' | 'crossfade';
  readonly loop: boolean;
}

export type GalleryAction =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO_TO'; index: number }
  | { type: 'START_TRANSITION' }
  | { type: 'END_TRANSITION' }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'PLAY_VIDEO'; videoId: string }
  | { type: 'STOP_VIDEO' }
  | { type: 'START_AUTOPLAY' }
  | { type: 'STOP_AUTOPLAY' }
  | { type: 'SET_DRAGGING'; isDragging: boolean };
