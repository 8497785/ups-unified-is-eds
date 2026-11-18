---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-17T20:57:57Z
  againstInput: https://www.insureshield.com/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.insureshield.com/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-17T20:57:57Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Scope: the 100 pages of stardust/.labs/site-plan.json; 96 captured, 4 are HTTP 404 on the source
(/it.html, /gb.html, /ca.html, /fr.html). Gate breakpoints: desktop 1440, mobile 360.

## Decision — E2 link audit: out-of-plan targets repointed to the source site (2026-11-18)
The page scope is the fixed 100-page plan (`stardust/.labs/site-plan.json`); every internal link whose target is not a delivered page is SCOPE EXTENSION and is repointed to the working source URL, never delivered here. 311 unique targets across 79 documents (pages + nav/footer chrome), mostly `*/resources/insights/*` and `*/resources/customer-stories/*` articles, legal sub-pages and the per-locale `site-search` pages; full list in `stardust/rollout/e2-repointed-targets.txt`. Source path case restored from the capture where the source is case-sensitive (45 targets, e.g. `customer-stories/JCR-Distributors.html`, PDF guides under `/content/guides/`). No target is a captured page or in the plan. One target stays 404 because it is 404 on the source too (`multi-carrier-shipments/insureShield-complete2.html`, linked from get-a-quote and select-my-coverage) — kept as captured. The de/en nav search link now points to `/de/en/site-search.html` like every other locale.
