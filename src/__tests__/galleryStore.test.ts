import { describe, it, expect, beforeEach } from 'vitest';
import type { Frame, GalleryState } from '../main';
import { GalleryStore } from '../state/store';

describe('GalleryStore', () => {
  const mockFrames: Frame[] = [
    {
      id: '1',
      src: 'image1.jpg',
      thumb: 'thumb1.jpg',
      caption: 'Image 1',
      video: null,
      html: null,
    },
    {
      id: '2',
      src: 'image2.jpg',
      thumb: 'thumb2.jpg',
      caption: 'Image 2',
      video: null,
      html: null,
    },
    {
      id: '3',
      src: 'image3.jpg',
      thumb: 'thumb3.jpg',
      caption: 'Image 3',
      video: null,
      html: null,
    },
  ];

  const initialState: GalleryState = {
    frames: mockFrames,
    currentIndex: 0,
    status: 'IDLE',
    isFullscreen: false,
    isPlaying: false,
    playingVideoId: null,
    transitionType: 'slide',
    loop: false,
  };

  let store: GalleryStore;

  beforeEach(() => {
    store = new GalleryStore({ ...initialState });
  });

  it('should initialize with the correct state', () => {
    const state = store.getState();
    expect(state).toEqual(initialState);
  });

  it('should handle NEXT action', () => {
    store.dispatch({ type: 'NEXT' });
    let state = store.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.status).toBe('TRANSITIONING');

    // Should not go beyond last item when loop is false
    store.dispatch({ type: 'NEXT' });
    store.dispatch({ type: 'NEXT' }); // This should not go beyond the last item
    state = store.getState();
    expect(state.currentIndex).toBe(2);
  });

  it('should handle NEXT action with loop', () => {
    // Create a new store with loop enabled
    const loopStore = new GalleryStore({ ...initialState, loop: true });

    // Go to last item
    loopStore.dispatch({ type: 'NEXT' });
    loopStore.dispatch({ type: 'NEXT' });

    // Next should loop back to first item
    loopStore.dispatch({ type: 'NEXT' });
    const state = loopStore.getState();
    expect(state.currentIndex).toBe(0);
  });

  it('should handle PREV action', () => {
    // Start from the second item
    const customStore = new GalleryStore({ ...initialState, currentIndex: 1 });

    customStore.dispatch({ type: 'PREV' });
    let state = customStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.status).toBe('TRANSITIONING');

    // Should not go below 0 when loop is false
    customStore.dispatch({ type: 'PREV' });
    state = customStore.getState();
    expect(state.currentIndex).toBe(0);
  });

  it('should handle GO_TO action', () => {
    store.dispatch({ type: 'GO_TO', index: 2 });
    const state = store.getState();
    expect(state.currentIndex).toBe(2);
    expect(state.status).toBe('TRANSITIONING');
  });

  it('should handle TOGGLE_FULLSCREEN action', () => {
    store.dispatch({ type: 'TOGGLE_FULLSCREEN' });
    let state = store.getState();
    expect(state.isFullscreen).toBe(true);

    store.dispatch({ type: 'TOGGLE_FULLSCREEN' });
    state = store.getState();
    expect(state.isFullscreen).toBe(false);
  });

  it('should handle PLAY_VIDEO and STOP_VIDEO actions', () => {
    const videoId = 'video1';

    store.dispatch({ type: 'PLAY_VIDEO', videoId });
    let state = store.getState();
    expect(state.playingVideoId).toBe(videoId);
    expect(state.isPlaying).toBe(true);

    store.dispatch({ type: 'STOP_VIDEO' });
    state = store.getState();
    expect(state.playingVideoId).toBeNull();
    expect(state.isPlaying).toBe(false);
  });

  it('should handle transition states', () => {
    store.dispatch({ type: 'START_TRANSITION' });
    let state = store.getState();
    expect(state.status).toBe('TRANSITIONING');

    store.dispatch({ type: 'END_TRANSITION' });
    state = store.getState();
    expect(state.status).toBe('IDLE');
  });

  it('should notify subscribers on state changes', () => {
    let callbackCalled = false;
    let lastState: GalleryState | null = null;

    const unsubscribe = store.subscribe((state: GalleryState) => {
      callbackCalled = true;
      lastState = state;
    });

    store.dispatch({ type: 'NEXT' });

    expect(callbackCalled).toBe(true);
    expect(lastState).toBeDefined();
    expect(lastState!.currentIndex).toBe(1);

    // Test unsubscribe
    callbackCalled = false;
    unsubscribe();
    store.dispatch({ type: 'NEXT' });
    expect(callbackCalled).toBe(false);
  });

  it('should handle invalid actions gracefully', () => {
    // Test with an invalid action type
    // The reducer should return the current state for unknown actions
    const initialState = store.getState();
    const invalidAction = { type: 'INVALID_ACTION' } as unknown as { type: 'NEXT' };

    // Should not throw, but return the current state
    store.dispatch(invalidAction);
    const newState = store.getState();

    // State should remain unchanged
    expect(newState).toEqual(initialState);
  });
});
