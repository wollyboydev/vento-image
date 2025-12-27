import { GalleryState, GalleryAction } from './types';

export const rootReducer = (state: GalleryState, action: GalleryAction): GalleryState => {
  const { frames, currentIndex, loop } = state;

  switch (action.type) {
    case 'NEXT': {
      const nextIndex = loop
        ? (currentIndex + 1) % frames.length
        : Math.min(currentIndex + 1, frames.length - 1);
      return {
        ...state,
        currentIndex: nextIndex,
        status: 'TRANSITIONING',
      };
    }

    case 'PREV': {
      const prevIndex = loop
        ? (currentIndex - 1 + frames.length) % frames.length
        : Math.max(currentIndex - 1, 0);
      return {
        ...state,
        currentIndex: prevIndex,
        status: 'TRANSITIONING',
      };
    }

    case 'GO_TO': {
      const index = action.index;
      const validIndex = Math.max(0, Math.min(index, frames.length - 1));
      return {
        ...state,
        currentIndex: validIndex,
        status: 'TRANSITIONING',
      };
    }

    case 'START_TRANSITION':
      return { ...state, status: 'TRANSITIONING' };

    case 'END_TRANSITION':
      return { ...state, status: 'IDLE' };

    case 'TOGGLE_FULLSCREEN':
      return { ...state, isFullscreen: !state.isFullscreen };

    case 'PLAY_VIDEO':
      return {
        ...state,
        isPlaying: true,
        playingVideoId: action.videoId,
      };

    case 'STOP_VIDEO':
      return {
        ...state,
        isPlaying: false,
        playingVideoId: null,
      };

    case 'START_AUTOPLAY':
      // Autoplay state managed by plugin, but we might want to track intent here later
      return state;

    case 'STOP_AUTOPLAY':
      return state;

    case 'SET_DRAGGING':
      return {
        ...state,
        status: action.isDragging ? 'DRAGGING' : state.status,
      };

    default:
      return state;
  }
};
