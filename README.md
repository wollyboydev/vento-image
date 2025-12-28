# Vento Image

A modern, lightweight, and customizable image gallery and viewer library built with TypeScript.

## Features

- 🖼️ Responsive image gallery
- 🎨 Customizable transitions and animations
- 🎥 Supports both images and videos
- 🎛️ Plugin-based architecture
- 🚀 Built with TypeScript
- 📱 Touch and mobile-friendly

## Installation

```bash
npm install vento-image
# or
yarn add vento-image
```

## Usage

```typescript
import { Vento, SlideRenderer, ThumbnailsRenderer } from 'vento-image';

// 1. Instantiate specialized renderers (Lens Pattern)
const stageRenderer = new SlideRenderer();
const navRenderer = new ThumbnailsRenderer();

// 2. Initialize Vento
const gallery = new Vento(
  document.getElementById('gallery'),
  items, // Array of GalleryItem
  {
    stage: stageRenderer,
    nav: navRenderer,
  },
  {
    autoplay: 3000,
    loop: true,
    transition: 'slide',
    nav: 'thumbs',
  }
);
```

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## License

Distributed under the MIT License. See `LICENSE` for more information.
