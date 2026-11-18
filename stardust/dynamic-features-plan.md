# Dynamic features plan — www.insureshield.com

## Phase D1 — static first (with the archetypes)
- Header: mega-menu, mobile drawer, locale dropdown, search overlay rebuilt per stardust/chrome/header-contract.json (chrome-compare gate).
- Accordions, tabs, story-card carousels, video players: rebuilt as block JS (interaction parity per archetype).
- Forms (get-a-quote, contact-us, partner, contact-information): form UI rebuilt; submission shows "no backend connected" until the owner names the endpoint.
- Shipping-hub coverage calculator (client-only widget): rebuilt client-side as a widget.

## Phase D2 — search
- helix-query.yaml in the code branch; header search overlay reads /query-index.json; results page.

## Phase D3 — martech (owner switch)
- stardust/martech-contract.json → scripts/martech.js via martech-scaffold.mjs; every part disabled. Owner follows stardust/martech-handoff.md.

## Verification
- dynamics-check.mjs on the published origin (martech feature: no tag host requested by default).

## Owner decisions
- Form backend · tag/consent enablement · locale scope. Effort: D1 inside archetype work; D2 ~1 unit; D3 scaffold only.
