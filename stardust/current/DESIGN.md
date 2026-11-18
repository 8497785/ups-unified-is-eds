---
name: InsureShield (current state)
colors:
  background: "#ffffff"
  text: "#121212"
  primary: "#3fa29d"
  primary-dark: "#007a7a"
  accent: "#2f67ac"
  link: "#0662bb"
  secondary: "#ffc400"
  surface-footer: "#4a4a4c"
  muted: "#5f5753"
  border: "#bfb8af"
  surface-warm: "#f0ede9"
typography:
  heading: { family: Roboto, weight: 400 }
  body: { family: Roboto, size: 16px, weight: 400 }
  h1: { size: 48px, weight: 400 }
  h2: { size: 40px, weight: 400 }
  h3: { size: 16px, weight: 400 }
  h4: { size: 14px, weight: 500 }
  h5: { size: 24px, weight: 400 }
  h6: { size: 20px, weight: 400 }
  button: { size: 16px, weight: 500 }
rounded:
  default: 4px
  pill: 50%
spacing:
  source: measured per section in Phase 3 (theme-insure-shield.min.css)
components:
  button-primary: { background: "#3fa29d", text: "#ffffff", radius: 4px, weight: 500 }
  button-secondary: { border: "#2f67ac", text: "#2f67ac", radius: 4px }
  button-yellow: { background: "#ffc400", text: "#121212" }
  card: { radius: 4px, shadow: "rgba(0,0,0,.05) 0 4px 12px -3px" }
---

<!-- stardust:provenance
writtenBy: stardust:extract
writtenAt: 2026-11-17T20:50:00Z
stardustVersion: 0.39.4
source: stardust/current/_computed-styles.json (93 pages × 1440/360), stardust/current/assets/css/
-->

# Design — InsureShield (descriptive, current state)

## Overview

A corporate insurance marketing site built on the UPS global AEM component library with an InsureShield theme. White canvas, near-black Roboto text, a teal primary (`#3fa29d`) for buttons and accent bands, a blue (`#2f67ac`) for links and outline buttons, a yellow (`#ffc400`) promotional CTA, and a dark charcoal footer (`#4a4a4c`). Heroes sit on a soft grey-green diagonal wash (`linear-gradient(350.94deg, #dce8e7 8%, #f3f3f3 55.74%)`). Photography is warehouse and parcel imagery with 4px rounded corners.

## Colors

| Role | Value | Evidence |
|---|---|---|
| Background | `#ffffff` | 14 092 weighted samples |
| Text / headings | `#121212` | 9 959 |
| Primary (teal) | `#3fa29d` | buttons, bands |
| Primary dark | `#007a7a` | text accents |
| Accent / link | `#2f67ac`, `#0662bb` | links, outline buttons |
| Secondary (yellow) | `#ffc400` | promo CTAs |
| Footer surface | `#4a4a4c` | footer background |
| Muted text | `#5f5753` | captions, meta |
| Border | `#bfb8af` | form fields, dividers |

## Typography

Roboto 400/500 throughout (Google Fonts); the shipping-insurance hub alone uses Inter. Heading ramp: h1 48px/400, h2 40px/400 (28px and 32px also common for section titles), h6 20px/400, h4 14px/500 eyebrows; body 16px/400; buttons 16px/500. Icons: `upspricons` icon font (Material Symbols Rounded glyphs).

## Elevation

Card shadow `rgba(0,0,0,.05) 0 4px 12px -3px`; button hover lifts to a three-layer shadow (`0 2px 6px rgba(0,0,0,.06), 0 4px 12px -2px rgba(0,0,0,.08), 0 15px 32px -3px rgba(0,0,0,.08)`).

## Components

Marketing hero (text left, image right on gradient wash), home-page hero, secondary promo (image/text split, alternating), featured promo cards, featured list (icon list), story-card carousel (Slick), accordion, tabs, video, table, column control, AEM adaptive forms, alert bar, utility nav + mega-nav header, charcoal footer with three link columns and legal row.

## Do's and Don'ts

- Do keep the teal/blue/yellow role split exactly as captured.
- Don't introduce new radii (4px is the system value) or new shadow stacks.
