# Rollout report — InsureShield (2026-11-18)

```
rollout — https://www.insureshield.com/ → aem-eds (aemcoder/9ade650b@main)
==================================================
Pages       96 total · 96 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   9 — program 55/55 · shell 11/11 · listing 7/7 · legal 7/7 · locale-home 6/6 · form 5/5
            · home 2/2 · shipping-hub 2/2 · region-selector 1/1
Blocks      23 total · 23 converted · 0 pending
Quality     health 100/100 · open P1 0 / P2 0 / P3 0 (14 P1 fixed in G-aem)
Pixel table prototypes 1440 9/9 · 360 8/9 (+1 documented override) PASS
            deployed 96/96 PASS at 1440 and 360 (coverage delivery.gate, latest gate-all row per page)
            — the roster summary.json still reads 1440 84/96 · 360 73/96: the fix-wave and
            G-aem re-gates ran `gate-all --only` (runs/*.json), which leaves summary.* untouched
Header      chrome-compare vs header-contract.json on aem.live b2b: 0 errors, 9 warnings
            (motion easing on drawer/search, search submit path, securecommerce top link)
To deliver  none
Content     0 pages awaiting content track
Out of plan 4 planned URLs answer 404 on the source (/it.html, /gb.html, /ca.html, /fr.html)
```

Live origin: https://main--9ade650b--aemcoder.aem.live/ — every page, the redirects sheet
(98 rows) and the nav/footer documents published.

## Dynamic parity (from `stardust/qa/dynamics-report.md`)

| feature | class | status | owner decision | replayed check |
|---|---|---|---|---|
| site query index (header search source) | S | done | — | fetch-json PASS (95 rows) |
| header search overlay + typeahead | S | interim | results page outside the plan; submit stays source-bound | dom-count PASS |
| header mega-menu, drawer, locale menu | M | done | — | dom-count PASS |
| shipping loss calculator (source AEM form frame) | F | interim | production endpoint | dom-count PASS |
| story card carousels | V | done | — | dom-count PASS |
| archetype pages run without uncaught errors | A | done | — | no-page-errors PASS |
| Delivery Defense ROI savings calculator | F | interim | production endpoint | dom-count PASS |
| martech: consent + tag routing | T | scaffolded-off | enable parts per `stardust/martech-handoff.md` | martech PASS (0 parts on) |
| AEM adaptive forms + reCAPTCHA | F | scaffolded-awaiting-owner | form endpoint + captcha site key | — |
| Tealium, GTM, Adobe Analytics/Target, OneTrust, mPulse, pixels | T | scaffolded-awaiting-owner | enable contract parts | — |
| locale switcher | I18N | interim | — | — |
| AEM csrf token, toggles.json, dataLayer settings, RPC beacons | A | decided-out | — | — |
| Log In link | X | decided-out | — | — |

## Open owner items

- Form endpoints (quote, contact, partner, loss calculator, ROI) and the reCAPTCHA site key.
- Martech contract parts: all carried over disabled; turning a part on is the owner's call.
- 3pl-partners hero "Get Started" → `#form` has no target id on the delivered page (open from E-full-site).

Learnings: `stardust/learnings.md` (6 pending entries).
