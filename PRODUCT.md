<!-- stardust:provenance
writtenBy: stardust:extract
writtenAt: 2026-11-17T20:10:00Z
stardustVersion: 0.39.4
source: https://www.insureshield.com/ (96 live-rendered pages, extract --prep --dynamics)
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web — an Adobe Experience Manager (AEM Sites) marketing site on the shared `ups-global` component library with an InsureShield theme (`theme-insure-shield`), plus one newer Vite-built page family (`/us/en/shipping-insurance.html`, Inter typeface).

## Users

_provenance: inferred — basis: captured hero copy, CTAs ("Get a Quote", "File a Claim", "Log In", "Connect with a Partner") and locale roots.

- Businesses that ship goods (SMB to enterprise, e-commerce merchants, B2B shippers, retailers, consumer-electronics sellers) looking to insure parcels and cargo.
- Existing policyholders filing or tracking claims.
- Channel partners, 3PLs and platform integrators (Shopify app, carrier integrations).
- Regional audiences: US (primary), Canada, Germany (DE/EN), Great Britain, Italy (IT/EN).

## Product Purpose

InsureShield (UPS Capital / a UPS company) sells shipping insurance and supply-chain risk services: multi-carrier parcel coverage, UPS shipment coverage, special commodities, checkout protection, cargo insurance, and risk-intelligence products (CommerceShield, DeliveryDefense, Delivery Orchestration, UPS Secure Commerce). Home-page meta description: "Manage risk across the entire supply chain with data-driven intelligence, proactive risk management, and decades of UPS expertise."

## Positioning

"UPS® Secure Commerce" — end-to-end commerce protection backed by decades of UPS risk-management expertise; "Insuring Better Shipping Experiences"; fast, effortless claims.

## Capabilities and Constraints

- Quote, claim and contact flows run through AEM Adaptive Forms (`aemform`) and external portals (log-in, claims portal).
- Rich component set: marketing hero, home-page hero, secondary promo (image/text split), featured promo cards, featured list, story-card carousels (Slick), accordions, tabs, video (Brightcove/Scene7 viewers), tables, column control.
- Martech present on every page (tag manager, analytics, consent manager) — to be carried over disabled.
- Locale sub-sites mirror the US templates with translated copy.

## Brand Commitments

- Register: `brand` (marketing/landing site).
- Personality observed: trustworthy, corporate, calm — deep teal/green brand colour, white surfaces, generous photography of parcels and warehouses, Roboto type.
- Anti-references observed: nothing playful or loud; no dark-mode, no gradients beyond subtle hero washes.

## Evidence on Hand

- `stardust/current/pages/*.json` + `*.html` — 96 page records and settled DOMs.
- `stardust/current/assets/screenshots/` — full-page captures at 1440.
- `stardust/current/assets/css/` — the 45 source stylesheets.
- `stardust/current/assets/fonts/` — Roboto (Google Fonts), Inter, Material Symbols Rounded (icon font, `upspricons` alias).
- `stardust/current/_computed-styles.json` — computed-style census at 1440 and 360.
- `stardust/current/_crawl-log.json` — crawl audit trail incl. dynamic surface.

## Product Principles

_provenance: inferred — basis: repeated CTA pattern and hero copy across templates.

- Every page leads to a quote, a claim or a contact.
- Proof through numbers and customer stories.
- Consistent component system across locales.

## Accessibility & Inclusion

Skip-link and ARIA navigation present in the header; visually-hidden labels on icon links; cookie consent manager on entry.
