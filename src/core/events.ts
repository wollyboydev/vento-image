export type GalleryEvent =
  | 'change'
  | 'ready'
  | 'show'
  | 'showend'
  | 'fullscreenenter'
  | 'fullscreenexit'
  | 'loadvideo'
  | 'unloadvideo';

type Handler = (...args: any[]) => void;

export class EventEmitter {
  private listeners: Map<GalleryEvent, Set<Handler>> = new Map();

  public on(event: GalleryEvent, handler: Handler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  public off(event: GalleryEvent, handler: Handler): void {
    this.listeners.get(event)?.delete(handler);
  }

  public emit(event: GalleryEvent, ...args: any[]): void {
    this.listeners.get(event)?.forEach((handler) => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`Vento: Error in ${event} handler:`, error);
      }
    });
  }

  public clear(): void {
    this.listeners.clear();
  }
}
