# Harp Glissando Studio

A touchscreen-optimized web application for composers to test different harp pedal settings and play glissandi. Perfect for exploring harmonic possibilities and composing for the harp.

## Features

- **Visual Harp Display**: 47 strings with authentic coloring (C = red, F = navy, others = neutral)
- **Interactive Pedal Controls**: 7 pedals (D, C, B, E, F, G, A) with flat/natural/sharp positions
- **Touch/Click Interaction**: Play individual strings or swipe for glissandi
- **Preset Library**: Common scales and harmonic settings with one-click access
- **Mobile Optimized**: Designed for tablets and smartphones with responsive touch controls
- **Realistic Audio**: Harp-like synthesis with proper ADSR envelope and reverb

## Installation

```bash
# Clone the repository
git clone https://github.com/grainnem7/harp-glissando-studio.git
cd harp-glissando-studio

# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

The app is configured for GitHub Pages deployment:

```bash
# Deploy to GitHub Pages
npm run deploy
```

Live demo: https://grainnem7.github.io/harp-glissando-studio/

## Usage

1. **Playing Strings**: Click/tap individual strings or swipe across multiple strings for glissandi
2. **Adjusting Pedals**: Tap any pedal to cycle through flat (♭), natural (♮), and sharp (♯) positions
3. **Using Presets**: Click the "Presets" button to access common scales and save custom configurations
4. **Mobile**: Works best in landscape orientation on tablets

## Technology Stack

- React 18 + TypeScript
- Vite for fast development
- Tone.js for audio synthesis
- CSS3 for animations and responsive design

## Browser Support

- Chrome/Edge (recommended)
- Safari (iOS/macOS)
- Firefox

## Development

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT