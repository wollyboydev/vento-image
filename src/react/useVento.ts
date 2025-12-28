import { useRef, useEffect, useCallback } from 'react';
import { Vento } from '../core/instance';
import { GalleryItem } from '../state/types';
import { VentoOptions } from '../core/options';
import { SlideRenderer, ThumbnailsRenderer, Renderer } from '../renderers';

export interface UseVentoOptions {
  items: readonly GalleryItem[];
  renderers?: { stage: Renderer; nav?: Renderer };
  options?: VentoOptions;
}

export function useVento({ items, renderers, options }: UseVentoOptions) {
  const containerRef = useRef<HTMLElement | null>(null);
  const instanceRef = useRef<Vento | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const finalRenderers = renderers || {
      stage: new SlideRenderer(),
      nav: new ThumbnailsRenderer(),
    };

    const instance = new Vento(containerRef.current, items, finalRenderers, options);
    instanceRef.current = instance;

    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, [items, renderers, options]);

  return {
    ref: setRef,
    instance: instanceRef.current,
  };
}
