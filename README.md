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
import { Vento } from 'vento-image';

// Initialize with your images
const gallery = new Vento(document.getElementById('gallery'), {
  // Options
  autoplay: 3000, // Auto-advance every 3 seconds
  loop: true,
  transition: 'slide',
  // ... more options
});
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

Closed source - Free for non-commercial use only. Commercial use requires explicit permission from the copyright holder.
