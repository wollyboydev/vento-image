import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VentoComponent } from '../react/Vento';
import { SlideRenderer } from '../renderers/slide/SlideRenderer';

describe('Vento React Component', () => {
  const mockFrames = [
    {
      id: '1',
      src: 'test.jpg',
      thumb: 'test-thumb.jpg',
      caption: 'Test Caption',
      video: null,
      html: null,
    },
  ];

  const mockRenderers = {
    stage: new SlideRenderer(),
  };

  it('renders without crashing', () => {
    const { container } = render(<VentoComponent items={mockFrames} renderers={mockRenderers} />);
    expect(container.querySelector('.vento-gallery')).toBeTruthy();
  });

  it('passes options to the internal Vento instance', () => {
    const onReady = vi.fn();
    render(<VentoComponent items={mockFrames} renderers={mockRenderers} onReady={onReady} />);

    // Vento initialization is wrapped in a setTimeout(..., 0) for ready event
    vi.runAllTimers();

    // Due to the way Vento is initialized in useLayoutEffect,
    // we should see the ready event trigger
    expect(onReady).toHaveBeenCalled();
  });
});
