export interface VentoOptions {
  autoplay?: number | false;
  loop?: boolean;
  transition?: 'slide' | 'fade' | 'crossfade';
  transitionDuration?: number;
  nav?: 'thumbs' | 'dots' | false;
  navPosition?: 'top' | 'bottom';
  navDirection?: 'horizontal' | 'vertical';
  fullscreen?: boolean | 'native';
  keyboard?:
    | boolean
    | Partial<Record<'left' | 'right' | 'up' | 'down' | 'space' | 'home' | 'end', boolean>>;
  arrows?: boolean;
  click?: boolean;
  swipe?: boolean;
  startIndex?: number;
  width?: number | string | null;
  height?: number | string | null;
  showCaption?: boolean;
  // Renderer instance is now required
  renderer?: any;
}
