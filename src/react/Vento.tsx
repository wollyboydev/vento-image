import React, { useEffect, useRef, useImperativeHandle, forwardRef, useLayoutEffect } from 'react';
import { Vento } from '../core/instance';
import { GalleryItem } from '../state/types';
import { VentoOptions } from '../core/options';
import { SlideRenderer, ThumbnailsRenderer, Renderer } from '../renderers';
import { GalleryEvent } from '../core/events';

export interface VentoProps {
  items: readonly GalleryItem[];
  renderers?: { stage: Renderer; nav?: Renderer };
  options?: VentoOptions;

  className?: string;
  style?: React.CSSProperties;
  onReady?: () => void;
  onShow?: () => void;
  onShowEnd?: () => void;
  onFullscreenEnter?: () => void;
  onFullscreenExit?: () => void;
  onLoadVideo?: () => void;
  onUnloadVideo?: () => void;
}

export const VentoComponent = forwardRef<Vento | null, VentoProps>(
  ({ items, renderers, options = {}, className, style, ...events }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<Vento | null>(null);

    // Expose the internal instance to parent components via ref
    useImperativeHandle(ref, () => instanceRef.current as Vento);

    useLayoutEffect(() => {
      if (!containerRef.current) return;

      const finalRenderers = renderers || {
        stage: new SlideRenderer(),
        nav: new ThumbnailsRenderer(),
      };

      const instance = new Vento(containerRef.current, items, finalRenderers, options);
      instanceRef.current = instance;

      // Map events
      const eventMap: Record<string, GalleryEvent> = {
        onReady: 'ready',
        onShow: 'show',
        onShowEnd: 'showend',
        onFullscreenEnter: 'fullscreenenter',
        onFullscreenExit: 'fullscreenexit',
        onLoadVideo: 'loadvideo',
        onUnloadVideo: 'unloadvideo',
      };

      Object.entries(eventMap).forEach(([propName, eventName]) => {
        const handler = (events as any)[propName];
        if (handler) {
          instance.on(eventName, handler);
        }
      });

      return () => {
        instance.destroy();
        instanceRef.current = null;
      };
    }, []); // Only initialize once

    // Handle updates to items and options if needed
    // Note: Re-initializing might be expensive, but some options are baked in during constructor
    // For now, simpler to re-initialize if core props change significantly, or add specific setters to Vento class.
    /*
        useEffect(() => {
          if (instanceRef.current) {
            // ideally we have methods like instance.updateOptions(options)
          }
        }, [options]);
        */

    return (
      <div
        ref={containerRef}
        className={`vento-react-container ${className || ''}`}
        style={{ width: '100%', height: '100%', ...style }}
      />
    );
  }
);

VentoComponent.displayName = 'Vento';
