---
name: Marea Alta — Glacial Precision Works
description: Sharp, flat, cold-chain industrial system for a 33-year Chilean thermal-packaging manufacturer
colors:
  primary: "#335c9c"
  on-primary: "#ffffff"
  primary-container: "#4d74b6"
  on-primary-container: "#fefcff"
  secondary: "#5a5e6a"
  on-secondary: "#ffffff"
  secondary-container: "#dfe2f0"
  on-secondary-container: "#606470"
  tertiary: "#006a3b"
  on-tertiary: "#ffffff"
  tertiary-container: "#218550"
  on-tertiary-container: "#f6fff4"
  accent: "#84bd00"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  background: "#f8f9ff"
  on-background: "#0f1c2d"
  surface: "#f8f9ff"
  on-surface: "#0f1c2d"
  surface-variant: "#d6e3fb"
  on-surface-variant: "#424751"
  surface-bright: "#f8f9ff"
  surface-dim: "#cddbf3"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#eff3ff"
  surface-container: "#e6eeff"
  surface-container-high: "#dde9ff"
  surface-container-highest: "#d6e3fb"
  outline: "#727782"
  outline-variant: "#c2c6d2"
  inverse-surface: "#243143"
  inverse-on-surface: "#ebf1ff"
  inverse-primary: "#abc7ff"
typography:
  headline-xl:
    fontFamily: "Poppins, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: "Poppins, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline-lg-mobile:
    fontFamily: "Poppins, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.2
  body-md:
    fontFamily: "Poppins, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label-sm:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: "0.05em"
rounded:
  none: "0px"
spacing:
  base-unit: "4px"
  margin-mobile: "16px"
  margin-desktop: "48px"
  container-max: "1280px"
  section-padding: "96px"
  header-height: "80px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
---

# Design System: Marea Alta — Glacial Precision Works

## Overview

**Creative North Star: "Glacial Precision Works"**

Marea Alta fabricates thermal packaging that keeps regulated cargo (pharma, food, health care) inside a critical temperature band across a 33-year track record and an ISO 9001 certification. The implemented system reads like the inside of a precision cold-storage facility: deep maritime blue for authority, safe-guard green for verification, and every surface cut at a hard, exact edge. Nothing is soft, nothing is decorative — the confidence comes from precision, not warmth.

This is deliberately **not** the "Modern Corporate / softly structured" direction sketched in the early Stitch mockup (`design-reference/stitch_marea_alta_modern_redesign/arctic_maritime_expressive/DESIGN.md`, 8–24px radii, tinted ambient shadows). What actually shipped rejected rounding and shadow entirely in favor of flat, bordered, architectural blocks — closer to a shipping manifest or a lab instrument panel than a marketing brochure. Treat the shipped implementation as the current source of truth; the mockup is historical reference only.

**Key Characteristics:**
- Zero corner radius anywhere in the coherent system (`rounded-none` on every button, input, card, and tile).
- Zero shadows; depth comes from flat color blocks, 1px borders, and translucent overlays, never `box-shadow`.
- Mono, uppercase, letter-spaced labels (`font-mono text-label-sm uppercase tracking-widest`) mark every section eyebrow and form label — a "manifest data" register distinct from the Poppins prose.
- Deep Maritime Blue carries headlines and primary actions; Safe-Guard Green is reserved for verification signals (eyebrows, trust icons, success state) — it never carries a primary CTA.

## Colors

The palette pairs one authoritative blue with one verification green against a cool, near-white surface family; nothing else competes for attention.

### Primary
- **Deep Maritime Blue** (`#335c9c`): headlines, primary buttons, active nav state, form focus rings. The single color allowed to signal "act here."
- **Deep Maritime Blue — Container** (`#4d74b6`): hover/pressed state for primary actions only; never a resting fill.

### Secondary
- **Slate Charcoal** (`#5a5e6a`): defined as a Material-role token in `globals.css` but not yet applied in any shipped component — reserved for a future secondary-emphasis need (e.g. a non-primary structural accent), not currently load-bearing.

### Tertiary
- **Safe-Guard Green** (`#006a3b`, accent `#84bd00`): section eyebrows, trust/confianza icons, the "message sent" success line. Reads as "verified" — the palette's only other saturated color, and it is never used for a clickable primary action.

### Neutral
- **Background / Surface** (`#f8f9ff`): the page base, a cool near-white with a faint blue cast.
- **On-Background / On-Surface** (`#0f1c2d`): primary text color, a deep near-navy rather than pure black.
- **Surface Dim** (`#cddbf3`): the contact section's background block — a visibly cooler, more saturated neutral used to set that section apart.
- **Inverse Surface** (`#243143`): footer and the desktop quick-links bar; the darkest surface in the system, used sparingly as a full-bleed band, not for cards.
- **Outline / Outline Variant** (`#727782` / `#c2c6d2`): every 1px border — cards, inputs, dividers, section rules.

### Named Rules
**The Two-Color Rule.** Only Deep Maritime Blue and Safe-Guard Green carry saturated color. Every other surface is neutral (near-white, near-navy, or the outline greys). A third saturated hue on a page is a departure from this system.
**The Verification-Never-Converts Rule.** Safe-Guard Green marks trust and confirmation; it never appears on a primary CTA. Primary actions stay Deep Maritime Blue.

## Typography

**Display/Body Font:** Poppins (with system sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with monospace fallback)

**Character:** Poppins carries both headlines and body copy in one geometric, open, approachable-but-professional voice; JetBrains Mono is reserved entirely for short uppercase labels, giving those moments a technical, "logged data" register that Poppins never touches.

### Hierarchy
- **Headline XL** (700, 48px, line-height 1.1, letter-spacing -0.02em): hero and top-of-section H1/H2 on desktop.
- **Headline LG** (600, 32px, line-height 1.2, letter-spacing -0.01em): desktop section headings (`md:` breakpoint).
- **Headline LG Mobile** (600, 28px, line-height 1.2): the same section headings below `md:`.
- **Body MD** (400, 16px, line-height 1.6): default paragraph copy.
- **Label SM** (500, 12px, letter-spacing 0.05em, uppercase, JetBrains Mono): section eyebrows and form field labels only.

### Named Rules
**The Mono-Eyebrow Rule.** Every section opens with an uppercase, letter-spaced, mono-font eyebrow line in Safe-Guard Green before the Poppins headline. Skipping it makes a section read as unfinished, not minimal.

## Layout

Fixed-width container system: content sits inside a 1280px max-width, with 16px horizontal margins on mobile and 48px (`px-12`) on desktop (`md:`). Major sections use 96px vertical padding (`py-24`) as the primary rhythm unit, creating clear, generous separation between blocks. The header is fixed at 80px tall (`h-20`) with a blurred translucent background; `<main>` compensates with `pt-20`. Grids move from a single column on mobile to 2–4 columns at `sm:`/`md:`/`lg:`, most commonly a 4-column grid for trust items and sector cards.

## Elevation & Depth

**Flat by design — no shadows anywhere in the codebase.** Depth is conveyed entirely through flat color layering (surface vs. surface-dim vs. inverse-surface), 1px outline borders, and translucent black/white overlays (e.g. the hero's navy-to-transparent image gradient, the sector card's `inverse-surface/70` scrim). A component that reaches for `box-shadow` is off-system.

### Named Rules
**The No-Shadow Rule.** Depth comes from color and border, never from `box-shadow`. If a component needs to feel "raised," give it a border and a distinct surface tone instead.

## Shapes

**Hard edges everywhere.** Every button, input, card, icon tile, and image container in the coherent system uses `rounded-none` (0px radius) — there is no soft-corner variant in current use. Borders are always 1px and always draw from the outline/outline-variant tokens. The footer commits to a single decorative geometric flourish: a 4px solid top border in Primary Blue (`border-t-4 border-primary`) — the one place the system allows a heavier structural line.

### Named Rules
**The Sharp-Edge Rule.** Radius is 0 across the system. A rounded corner is a signal of drift from this identity, not a stylistic option to reach for.

## Components

### Buttons
- **Shape:** 0px radius (`rounded-none`), no exceptions.
- **Primary:** Deep Maritime Blue fill, white text, bold weight, generous padding (`px-8 py-3.5` / `py-4` for full-width form submits). `active:scale-95` gives a tactile press feel — the system's one motion signature.
- **Outline/Ghost:** transparent fill, white 1px border and white text — used only on dark hero imagery, never on light surfaces.
- **Hover:** fill shifts to Primary Container blue with `on-primary-container` text; never a shadow or scale-up.

### Icon Tiles
- **Shape:** 48×48px (`h-12 w-12`), 0px radius, 1px outline-variant border.
- **Use:** trust/confianza feature icons (blue-tinted background) and footer social icons (white-tinted on the dark footer).

### Cards (Sector Tiles)
- **Shape:** 0px radius, full-bleed background image, 1px outline-variant border that turns Primary Blue on hover.
- **Overlay:** a bottom-anchored `inverse-surface/90` label band over the image, not a separate card body.
- **Motion:** image scales to 105% on hover over 700ms; the darkening scrim lightens slightly on hover to reveal more of the photo.

### Inputs / Fields
- **Style:** 0px radius, white background, 1px outline-variant border, 48px height for single-line fields.
- **Focus:** a 1px Primary Blue ring (`focus:ring-1 focus:ring-primary`) — no border-color shift, no glow.
- **Label:** uppercase, letter-spaced, bold, small — matches the mono-eyebrow register even though the label font itself is inherited body sans.

### Navigation
- **Header:** fixed, 80px tall, translucent white with blur (`bg-white/90 backdrop-blur-md`), bottom hairline border. Active link gets a 2px Primary Blue underline; inactive links use `on-surface-variant`, hovering to Primary Blue.
- **Footer:** full-bleed Inverse Surface (near-navy) band, 4px Primary Blue top border, white/60-opacity body text, Safe-Guard Green section labels.

## Do's and Don'ts

### Do:
- **Do** keep radius at 0 on every new interactive or container element in this system.
- **Do** reserve Safe-Guard Green for verification/trust moments (eyebrows, icons, success states) — never for a primary CTA.
- **Do** use the mono uppercase eyebrow ahead of a Poppins headline at the top of every marketing section.
- **Do** build depth with borders and flat surface-tone shifts, never `box-shadow`.

### Don't:
- **Don't** introduce rounded corners, drop shadows, or a third saturated accent color — that is a different system, not a variation of this one.
- **Don't** treat `/contacto`, `/servicios`, `/[servicio]`, and `/productos` as reference implementations: they currently render with generic Tailwind gray/blue utility classes (`text-gray-900`, `bg-blue-900`, `rounded-md`) instead of this system's tokens. They are static pages with no planned migration process tracked yet — when work touches them, bring them onto the tokens above rather than extending the untokened styling.
- **Don't** pull visual direction from `design-reference/stitch_marea_alta_modern_redesign/` — those are pre-implementation Stitch mockups (softly rounded, shadowed) that the shipped system explicitly departed from.
