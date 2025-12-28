import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { VentoComponent, SlideRenderer, ThumbnailsRenderer } from '../../src/main';
import '../../src/vento.css';

const frames = [
  {
    id: '1',
    src: 'https://picsum.photos/800/600?random=1',
    thumb: 'https://picsum.photos/80/60?random=1',
    caption: 'React Image 1',
    video: null,
    html: null,
  },
  {
    id: '2',
    src: 'https://picsum.photos/800/600?random=2',
    thumb: 'https://picsum.photos/80/60?random=2',
    caption: 'React Image 2',
    video: null,
    html: null,
  },
  {
    id: '3',
    src: 'https://picsum.photos/800/600?random=3',
    thumb: 'https://picsum.photos/80/60?random=3',
    caption: 'React Image 3',
    video: null,
    html: null,
  },
];

const App = () => {
  // TIP: Renderers should be unique per Vento instance.
  // If you don't provide them, VentoComponent will create default ones for you.

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Vento React Component</h1>
      <p>Multiple instances now work correctly because each creates its own renderers.</p>

      <div style={{ height: '500px', border: '1px solid #ddd' }}>
        <VentoComponent
          items={frames}
          // Omitted renderers to use defaults (unique per instance)
          options={{
            nav: 'thumbs',
            loop: true,
            swipe: true,
          }}
        />
      </div>

      <br />

      <div style={{ height: '500px', border: '1px solid #ddd' }}>
        <VentoComponent
          items={frames}
          // Alternatively, you can pass custom unique instances:
          renderers={{
            stage: new SlideRenderer(),
            nav: new ThumbnailsRenderer(),
          }}
          options={{
            nav: 'thumbs',
            loop: false,
            swipe: true,
          }}
        />
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
