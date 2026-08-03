---
name: Arctic Maritime Expressive
colors:
  surface: '#f8f9ff'
  surface-dim: '#cddbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff3ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d6e3fb'
  on-surface: '#0f1c2d'
  on-surface-variant: '#424751'
  inverse-surface: '#243143'
  inverse-on-surface: '#ebf1ff'
  outline: '#727782'
  outline-variant: '#c2c6d2'
  surface-tint: '#355e9e'
  primary: '#335c9c'
  on-primary: '#ffffff'
  primary-container: '#4d74b6'
  on-primary-container: '#fefcff'
  inverse-primary: '#abc7ff'
  secondary: '#5a5e6a'
  on-secondary: '#ffffff'
  secondary-container: '#dfe2f0'
  on-secondary-container: '#606470'
  tertiary: '#006a3b'
  on-tertiary: '#ffffff'
  tertiary-container: '#218550'
  on-tertiary-container: '#f6fff4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#abc7ff'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#174685'
  secondary-fixed: '#dfe2f0'
  secondary-fixed-dim: '#c3c6d3'
  on-secondary-fixed: '#171b25'
  on-secondary-fixed-variant: '#434752'
  tertiary-fixed: '#97f7b7'
  tertiary-fixed-dim: '#7cda9d'
  on-tertiary-fixed: '#00210f'
  on-tertiary-fixed-variant: '#00522d'
  background: '#f8f9ff'
  on-background: '#0f1c2d'
  surface-variant: '#d6e3fb'
typography:
  headline-xl:
    fontFamily: Poppins
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Poppins
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-desktop: 48px
  margin-mobile: 16px
  gutter: 24px
  container-max: 1280px
  section-padding: 96px
  base-unit: 8px
---

## Brand & Style
The brand identity is rooted in **Corporate Reliability** and **Logistical Precision**, but evolved with an **Expressive** flair. It targets high-stakes B2B sectors like pharmaceuticals and food exports where the "Cold Chain" is a non-negotiable requirement. 

The visual style blends **Modern Corporate** cleanliness with **Dynamic Vitality**. By moving to an expressive variant, the system utilizes a more vibrant and diverse color palette to signal agility and modern energy. It utilizes deep, professional navy tones and midnight shades to establish authority and trust, contrasted with high-energy accents to represent technological innovation. The interface remains approachable and fluid, ensuring the emotional response is one of absolute calm, professional control, and forward-thinking mastery.

## Colors
The palette is dominated by **Deep Maritime** (Primary) and **Midnight Anchor** (Secondary).
- **Primary (#0c3f7e)**: A dense, authoritative deep blue used for primary actions, active states, and brand-defining headers, conveying maximum stability and heritage.
- **Secondary (#1f232d)**: A deep, authoritative charcoal-navy that provides high-contrast grounding and serious industrial weight. Used for navigation bars, primary text, and structural accents.
- **Tertiary (#248752)**: A vibrant "Safe-Guard" green representing successful delivery and environmental efficiency. Used for success states and specialized containers.
- **Surface Strategy**: A sophisticated neutral system derived from slate-tinted greys (#6b788d) to provide a modern, technical backdrop that is softer than pure black/white.

## Typography
The system uses a dual-font approach to balance friendly modernism with technical precision.
- **Poppins** is the primary typeface for both headlines and body copy. Its geometric construction provides an open, modern, and highly legible feel that makes the brand feel accessible yet professional.
- **JetBrains Mono** remains the choice for metadata, technical tags, and labels. This reinforces the "logistical data" aesthetic, ensuring precision remains at the heart of the design.
- **Styling Note**: Headlines should leverage the geometric nature of Poppins with tight line heights to create a structured, architectural look.

## Layout & Spacing
The system follows a **Fixed-Fluid Hybrid Grid**.
- **Desktop**: Content is contained within a 1280px max-width container. Layouts typically leverage a 12-column structure with 24px gutters.
- **Margins**: Generous 48px external margins on desktop ensure the content feels premium and uncrowded.
- **Vertical Rhythm**: Large 96px (py-24) padding between major sections to provide clear visual separation and focus.
- **Mobile**: Transitions to a single-column layout with 16px horizontal margins.

## Elevation & Depth
Depth is achieved through **Ambient Shadows** and **Tonal Layering** with an emphasis on clarity.
- **Soft Depth**: Cards and containers use a specialized shadow: `0px 4px 20px rgba(12, 63, 126, 0.08)`. Tinting the shadow with the primary Deep Maritime blue keeps the interface feeling cohesive and fresh.
- **Glassmorphism**: Top navigation bars utilize a `backdrop-blur-md` with 80% opacity to maintain context while scrolling.
- **Overlays**: Image headers use blue-to-transparent gradients to ensure white text remains legible over complex backgrounds.

## Shapes
The shape language is **Softly Structured**.
- **Standard Radius**: A base of 8px (0.5rem) is used for buttons and input fields to maintain a professional balance.
- **Large Radius**: 16px (1rem) or 24px (1.5rem) is used for feature cards to soften the data-heavy interface.
- **Pill Shapes**: Used exclusively for status chips and metadata tags to distinguish them from actionable buttons.
- **Organic Shapes**: Use of SVG wave masks and elliptical clip-paths (`organic-wave`) on large imagery to break the grid and add a "maritime" flow.

## Components
- **Buttons**:
  - *Primary*: Solid Deep Maritime blue (#0c3f7e), white text, 8px radius. Subtle scale-down effect (active:scale-95) on click.
  - *Secondary*: Midnight Anchor (#1f232d) with white text and arrow icons for directional CTAs.
  - *Ghost/Outline*: 1px border using the primary color for low-emphasis actions.
- **Cards**: Feature cards should use a white background, the "soft-shadow" defined in Elevation, and an 8px or 16px corner radius.
- **Input Fields**: 8px radius, white background, 1px neutral border. On focus, use a 2px Deep Maritime blue (#0c3f7e) ring.
- **Navigation**: Fixed height (64px), Midnight Anchor (#1f232d) background or translucent blur, with a subtle bottom shadow that triggers on scroll.
- **Icons**: Use "Material Symbols Outlined" with a weight of 400. Primary feature icons should use the Tertiary green (#248752) to signify active status.