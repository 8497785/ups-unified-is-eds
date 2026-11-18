# Learnings — InsureShield replica (2026-11-18)

### Stitched capture paints fixed chrome wrong on short pages
- failure class: false-measurement (gate)
- evidence: G-aem re-gate of six us/en shells (customer-communications, page-deletion, test-deletion, test-deletion1, webinars, cookie-settings) — 900-px stitch read 14–23 % pixel FAIL; the same pages at `--vh 1300` (one-piece capture) read 0.06 % / 0.15 % PASS (`stardust/.work/replica/bg/g-h1b-*.log` vs `g-h1c-*.log`)
- proposed change: `skills/replica/reference/source-fidelity-gate.md` § Hardening — when the source page height is under ~1.5 viewports and it carries fixed chrome, capture one-piece (raise the viewport height) instead of stitching; `gate-all.mjs` could pick this automatically from the live height
- status: pending

### gate-all --only never refreshes the roster summary
- failure class: stale-evidence
- evidence: after the fix wave and G-aem every page passed its `--only` run (coverage 96/96 `verified`), yet `stardust/replica/gates/all-1440/summary.json` still reads 84/96 and `all-360` 73/96 — the H report's pixel-table line, read from summary.json, understates the delivery
- proposed change: `skills/replica/scripts/gate-all.mjs` — a `--merge-runs` (or `--compare-only` default) mode that folds the latest `runs/*.json` row per page into `summary.{json,md}`; `skills/rollout/SKILL.md` § Phase H — read the merged table
- status: pending

### update-coverage --gate path-matches a redirected row onto its destination
- failure class: ledger-collision
- evidence: E-full-site — the risk-intelligence-smb coverage row carries path `/us/en/solutions/commerceshield` (301 destination), so commerceshield's gate row was applied to both; worked around with a single-row file `stardust/.work/replica/cs-only-<w>.json`
- proposed change: `skills/rollout/scripts/update-coverage.mjs` — match gate rows by slug first, path only as a fallback, and warn on a path that matches more than one row
- status: pending

### Header parity compared against a per-template contract
- failure class: gate-scope
- evidence: C0 ran chrome-compare against `stardust/chrome/header-contract-terms.json` (source terms page) on the c0 shell; done-check at H-report raised `header_parity:compared against …terms-and-conditions-upscia.html, not the contract (…b2b.html)` — the gap surfaced only at the end of the run
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row C (C0) — the foundation's header gate compares against `stardust/chrome/header-contract.json` itself, on the published host, and writes `stardust/chrome/header-parity.json`; a per-template contract is supplementary evidence only
- status: pending

### chrome-explore measures the outer header while EDS pins an inner wrapper
- failure class: false-measurement (header contract)
- evidence: chrome-explore on aem.live b2b with the default root sampled `<header>` as static at scroll down/up (4 scroll-state 🔴); the block pins `header .hdr` with `position: fixed` (`blocks/header/header.css` `.hdr.sticky-nav`), as the source does
- proposed change: `skills/diff/scripts/chrome-explore.mjs` — sample the scroll state on the header root AND its first full-width descendant that changes `position` on scroll; `skills/diff/SKILL.md` § The header contract — name `--root` for EDS headers that pin an inner wrapper
- status: pending

### Source-parity detector misses entity-encoded duplicates
- failure class: parity-detect
- evidence: F-optimize — 3 duplicate-title/description findings the source shares verbatim were not recognised as source parity because the delivered text carried `&#x26;` for `&`; accepted by hand
- proposed change: `skills/rollout/scripts/optimize.mjs` — decode HTML entities on both sides before the parity comparison
- status: pending
