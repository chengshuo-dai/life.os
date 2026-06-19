---
name: Narrative Reality Console
author: Lucas Dai (代成硕)
colors:
  surface: '#131317'
  surface-dim: '#131317'
  surface-bright: '#39393d'
  surface-container-lowest: '#0e0e11'
  surface-container-low: '#1b1b1f'
  surface-container: '#201f23'
  surface-container-high: '#2a292e'
  surface-container-highest: '#353438'
  on-surface: '#e5e1e7'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e1e7'
  inverse-on-surface: '#313034'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#ffffff'
  on-tertiary: '#3c0091'
  tertiary-container: '#e9ddff'
  on-tertiary-container: '#7342dd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#131317'
  on-background: '#e5e1e7'
  surface-variant: '#353438'
typography:
  display-hero:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '200'
    lineHeight: '1.1'
    letterSpacing: 0.15em
  display-hero-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '200'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '300'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
  mono-data:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  nav-height: 72px
  terminal-height: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  grid-pattern: 18px
---

## Brand & Style

The design system is centered on **AI-Native Minimalism** and **Restrained Mystery**. It treats the interface not as a tool, but as a "Narrative Reality Console"—a high-tech operating system designed for the retrieval and manipulation of human destinies. The emotional response should be one of quiet awe, cinematic weight, and focused precision.

The style is a hybrid of **Glassmorphism** and **Corporate Modernism**, stripped of all non-essential decorative elements. It utilizes an ultra-dark environment where light is treated as data. The interface feels "alive" through subtle environmental textures like 18px ultra-fine point patterns and slow-breathing light waves in the periphery, suggesting a latent intelligence beneath the surface.

## Colors

The palette is anchored in an "Ultra-Dark" abyss to maximize depth and focus. 

- **Background (#030305):** A near-black void that eliminates visual noise.
- **Primary (#FFFFFF):** Used for critical data, high-level typography, and primary actions. It represents "Signal" within the "Noise."
- **Accent 1 (#38BDF8 - Cyan):** Reserved for technical data, system status, and AI-driven insights.
- **Accent 2 (#8B5CF6 - Violet):** Used for narrative elements, destiny markers, and "Human" variables.
- **Surfaces:** Utilize varying levels of transparency (5% to 12% opacity) with #FFFFFF or #38BDF8 borders to define boundaries without closing off the void.

## Typography

This design system uses **Geist** for its technical precision and minimal footprint. 

- **Headings:** High-level headers use `display-hero` with wide tracking and light weights to evoke a sense of architectural space.
- **Hierarchy:** Contrast is achieved through letter spacing and weight rather than scale alone. 
- **Readability:** Body text is kept clean and legible with a slightly increased line-height to prevent eye fatigue against the ultra-dark background.
- **Technical Elements:** Labels and secondary data points use all-caps and increased tracking to mimic terminal readouts.

## Layout & Spacing

The layout is a **Fixed Grid** system that prioritizes symmetry and cinematic framing.

- **Top Navigation:** A fixed 72px bar with minimal glass blurring.
- **Command Terminal:** A persistent single-line input at the bottom of the viewport, acting as the primary interaction hub.
- **Content Area:** Vertical 3:4 aspect ratio cards are arranged in a centered cluster or a horizontal scroll, maintaining generous negative space.
- **Environmental Texture:** An 18px ultra-fine point grid is overlaid on the background (opacity 3-5%) to provide a sense of scale and digital texture.
- **Motion:** All layout transitions and symbol morphing must use `cubic-bezier(0.16, 1, 0.3, 1)` for a "liquid" and responsive feel.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** and light-based layering rather than traditional shadows.

- **Tiers:** Elements closer to the user have higher transparency and slightly brighter borders (0.5px to 1px).
- **Backdrop Blur:** Use `backdrop-filter: blur(20px)` on all floating surfaces to create a sense of physical thickness.
- **Subtle Glow:** Instead of shadows, use extremely soft, low-opacity outer glows (color-tinted to Cyan or Violet) for active or high-priority elements.
- **Atmospherics:** Slow-breathing light waves in the bottom corners act as "environmental depth," pulsing between 2% and 8% opacity.

## Shapes

The shape language is **Soft** but disciplined. 

- **General:** Standard UI elements use a 0.25rem (4px) radius to maintain a technical, sharp edge.
- **Interactive Surfaces:** Cards and larger glass containers use 0.75rem (12px) to feel more "refined" and intentional.
- **Paths:** SVG icons and symbols utilize liquid path morphing, where shapes "flow" into one another rather than snapping.

## Components

### Glass Command Terminal
The primary interface for "Destiny Retrieval." A single, bottom-aligned horizontal bar. It features a 1px Cyan top-border and a blinking underscore cursor. Text input is mono-spaced.

### 3:4 Narrative Cards
Vertical containers for destiny data. 
- **Surface:** 8% white glass with 20px blur. 
- **Border:** 0.5px stroke at 20% opacity. 
- **Content:** Large display number in top-left, metadata in bottom-right.

### Minimal Top Nav
72px height, 0% background opacity until scroll (then 10% glass). Contains only essential system status icons (Power, AI Sync, Narrative Path).

### Liquid Buttons
Ghost-style buttons with no background. On hover, a subtle cyan "liquid" fill expands from the center at 10% opacity, and the border-weight increases slightly.

### Progress & Loading
Instead of spinners, use horizontal "data streams"—fine lines that pulse with Cyan and Violet light waves, moving at varying speeds.