# Dynamics parity check — https://main--9ade650b--aemcoder.aem.live — 2026-11-18T12:26:03.409Z

Replayed 8 checks over 13 features · pass 8 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| site query index (header search source) | S | done | fetch-json | PASS | 200 · 95 rows · keys total,offset,limit,data,columns,:type |  |
| header search overlay + typeahead | S | interim | dom-count | PASS | 1 × header .hdr-search-form input[name=q] (min 1) |  |
| header mega-menu, drawer, locale menu | M | done | dom-count | PASS | 37 × header nav li (min 5) |  |
| shipping loss calculator (source AEM form frame) | F | interim | dom-count | PASS | 1 × .loss-calculator (min 1) |  |
| story card carousels | V | done | dom-count | PASS | 12 × .story-card-carousel .story (min 3) |  |
| archetype pages run without uncaught errors | A | done | no-page-errors | PASS | none on 9 page(s) |  |
| Delivery Defense ROI savings calculator | F | interim | dom-count | PASS | 2 × .roi-calculator input (min 1) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (3 gated · 0 cross-site host(s) blocked) |  |

## Features without checks

- AEM adaptive forms (quote, contact, partner) + reCAPTCHA (F) — scaffolded-awaiting-owner · owner: name the production form endpoint (AEM Forms or another backend) and the captcha site key
- Tealium, GTM, Adobe Analytics/Target, OneTrust, mPulse, ad pixels (T) — scaffolded-awaiting-owner · owner: enable contract parts per stardust/martech-handoff.md
- locale switcher (I18N) — interim
- AEM csrf token, toggles.json, CQ/dataLayer settings objects, RPC beacons (A) — decided-out
- Log In link (X) — decided-out
