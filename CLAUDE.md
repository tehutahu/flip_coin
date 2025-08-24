# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a premium 3D coin flipping application built with Three.js and modern web technologies. The application features photorealistic 3D graphics, physics-based animations, elegant radial coin patterns, and stylish cursive result displays.

## Technology Stack

- **Three.js r160**: 3D graphics rendering and scene management
- **GSAP 3.12.2**: High-performance animations and tweening
- **Vanilla JavaScript**: Core application logic (ES6+ features)
- **CSS3**: Responsive design and UI styling
- **HTML5 Canvas**: Dynamic texture generation for coin patterns

## Architecture

### Core Components

1. **CoinFlip3D Class**: Main application controller
   - Scene setup and management
   - Camera and lighting configuration  
   - Physics simulation and animation
   - Event handling and user interaction

2. **Rendering System**:
   - WebGL renderer with shadow mapping
   - PBR (Physically Based Rendering) materials
   - Real-time lighting with multiple light sources
   - High-quality texture generation

3. **Animation System**:
   - Realistic parabolic trajectory physics
   - Constant angular velocity during flight
   - Smooth settling animations with bounce effects

### Visual Features

- **Elegant Radial Designs**: Clean geometric patterns
  - Heads: 16-ray radial pattern with concentric circles (gold)
  - Tails: 12-ray pattern (15° offset) with concentric squares (silver)
- **Metallic Materials**: Gold and silver PBR shaders
- **Dynamic Lighting**: Multi-source lighting for realistic reflections
- **High-Resolution Textures**: 512x512 canvas-generated textures
- **Stylish Result Display**: Cursive "Heads"/"Tails" with glowing effects

## File Structure

```
flip_coin/
├── index.html          # Main HTML structure
├── script.js           # 3D application logic
├── styles.css          # Responsive UI styling
├── CLAUDE.md           # Development guidance
└── README.md           # Project documentation
```

## Development Guidelines

### Code Style
- Use ES6+ class syntax for main components
- Prefer const/let over var
- Use descriptive variable names
- Comment complex mathematical calculations
- Maintain consistent indentation (4 spaces)

### Performance Considerations
- Optimize geometry complexity (64 segments for visible surfaces)
- Use efficient shadow map resolutions (2048x2048)
- Implement proper texture memory management
- Minimize draw calls where possible

### Browser Compatibility
- Target modern browsers with WebGL support
- Graceful fallback for older browsers
- Responsive design for mobile devices
- Touch and keyboard input support

## Debugging

Use browser developer tools to monitor:
- WebGL context creation
- Three.js scene graph
- Animation performance
- Memory usage for textures

Common issues:
- Library loading order (check console for THREE/GSAP availability)
- WebGL context limits on mobile devices
- Shadow rendering performance on lower-end hardware