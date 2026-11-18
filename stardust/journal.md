# Journal — InsureShield replica

## Extract — 96 of 100 planned pages captured live, 9 page types (2026-11-17)

- `crawl.mjs --pages <100 planned URLs> --dynamics`: 96 captured (Playwright, real Chrome, no bot wall), 4 failed with HTTP 404 on the source itself (`/it.html`, `/gb.html`, `/ca.html`, `/fr.html`, verified by curl) — nothing to migrate for them.
- Provenance 96/96 live. Vision check (subagent over thumbnails): 92 ok, 4 suspect (cosmetic: OneTrust banner over content, a blank hero image, an odd page title); 26 captures show the late OneTrust banner → gates use `--consent "#onetrust-accept-btn-handler"`.
- Duplicates: `/` → `/us/en/securecommerce.html`; `/us/en/solutions/insureshield-shipping-insurance.html` = `/us/en/shipping-insurance.html` (a separate Vite/Inter build).
- Page types (state.json): program 55, shell 11, listing 7, legal 7, locale-home 6, form 5, home 2, shipping-hub 2, region-selector 1. Archetypes in `stardust/replica/run-notes.md`.
- Style census 93 pages × 1440/360 → `_computed-styles.json`; DESIGN.md/json, PRODUCT.md, `_brand-extraction.json`, `brand-review.html` written; 17 module candidates.
- Header contract: `stardust/chrome/header-contract.json` (1440: 7 controls, 13 states; 390: 2 controls, 8 states).
- cap-probe: contentMaxWidth 1280 (b2b, locale home) / 1286 (securecommerce) / 1248 (hub); shell fluid — divergent caps recorded in DESIGN.json capRegister.
- Fonts: Roboto, Inter, Material Symbols Rounded (all open licences) self-hostable. Capture gaps: none.

## Preserve direction — verbatim promotion, empty register, 76 dynamic rows triaged (2026-11-17)

- PRODUCT.md / DESIGN.md / DESIGN.json promoted verbatim from stardust/current/; stardust/direction.md records preserve mode; register empty (pure replica).
- Dynamics: detector over the 9 archetypes → 72 findings; plan with `--chrome --martech` → 76 rows (self 15 after curation, owner batch 61). Unknown beacons reclassified as tag-manager-loaded tags (Reddit, Demandbase, Glia, Akamai mPulse). Forms ship UI with "no backend connected" interim. No decided-out rows.
- Martech: Tealium utag (+ OneTrust, Adobe Target signals) → stardust/martech-contract.json, every part `enabled: false`; martech-handoff.md for the owner. scripts/martech.js is scaffolded at C0 before the first deploy.

## Source-fidelity gate — home archetype (index) passes 1440 0.41% / 360 0.10% (2026-11-17)
- Live /us/en/securecommerce.html vs index-proposed.html; content-diff clean both widths, Δh 0, cap-probe PASS.
- Fixes off the instruments: home-only logo_shield header logo (chrome-parity), source `sup` rule (hero/stats heights).
- Residuals: hidden Load More buttons omitted; hero animated GIF; logo variant. Motion: 6 match, card hovers dead.

## Source-fidelity gate — listing archetype (gb-en-resources-html) passes 1440 0.03% / 360 1.39% (2026-11-17)
- 3 iterations per width; Δh 0 both; main content-diff clean; cap-probe PASS. 360 footer shows 5 live-side lazy social-icon 🔴 (no src before scroll) — same live nondeterminism accepted on program; residual social-lazy-icons.
- Chrome fixes (back-port candidates): GB footer 3/6/3 grid, plain-text breadcrumb item. Search results shell mirrored hidden (dynamics).

## Source-fidelity gate — legal archetype (terms-and-conditions-upscia) passes 1440 0.00% / 360 0.00% (2026-11-17)
- 3 rounds per width; Δh 0; cap-probe PASS. 1440 footer YouTube icon 🔴 is live lazy-load (no src at read) — residual like program/listing.
- Fixes: hero measured values (padding, teal rule, 20px description), hero margin collapse at 360 (flow-root). Canon a:hover underline cancelled for body links (back-port candidate).

## Source-fidelity gate — locale-home archetype (de-en-home-html) passes 1440 2.91% / 360 2.06% (2026-11-17)
- 3 iterations per width. 360 first read 17.6% / Δh -47: live autoplay carousel had advanced to slide 2 at capture. Capture-normalisation round (no prototype edits): live.png re-taken with --dismiss ".cmp-carousel__indicator:first-child,…" pinning slide 1 on both sides → 2.06%, Δh +1, content-diff clean.
- cap-probe: 12/13 rows pass; carousel row reads the hidden first slide (no cap) — false positive, visible slide capped 1280 on both sides. Logged residual.
- Carousel autoplay 5s + Load More (3 per click) implemented from motion-observe; DE footer column 50% (back-port candidate).

## Source-fidelity gate — form archetype (about/contact-us) passes 1440 0.07% / 360 0.41% (2026-11-17)
- Δh 0 both; main content-diff clean; footer lazy social-icon 🔴 at 1440 = live-side residual; cap-probe PASS.
- AEM Forms iframe rendered in captures → rebuilt as a static non-submitting iframe page (inputs, radios, Send, 302×76 captcha box), geometry from captures; validation/submit/reCAPTCHA belong to the dynamics plan.

## Source-fidelity gate — shell archetype (customer-communications) passes 1440 0.02% / 360 0.00% (2026-11-17)
- Live page is chrome around an empty content grid; prototype = canon chrome + empty main. First round passed both widths; cap-probe PASS; blank-render flag justified (live main 0 px).

## Source-fidelity gate — region-selector archetype (global) passes 1440 0.02% / 360 0.04% (2026-11-17)
- 2 iterations per width; ROLE SWAP fix (region toggles as a[role=button] like live); Δh 0; cap-probe PASS; map = live inline SVG as asset; motion 8 parity.

## Source-fidelity gate — shipping-hub archetype (shipping-insurance) passes 1440 0.22% / 360 1.20% (2026-11-17)
- Separate design system (Vite app, Inter): own header (hide-on-scroll) and dark footer, canon not linked; tokens lifted from the app bundle. 3 iterations per width; Δh 0; cap-probe PASS.
- Not built (client-rendered, not captured → dynamics): hero popovers, nav dropdowns, price calculator + quote panel. Inter woff2 added to canon/fonts.

## Recreate — all 9 archetypes prototyped and gated; prototype tables 1440 9/9, 360 9/9 (1 documented override) (2026-11-17)
- Archetypes: program, home, locale-home, listing, legal, form, shell, shipping-hub, region-selector — every one passes 1440 and 360 (worst: locale-home 2.91% / 2.06%), cap-probe PASS except locale-home's carousel-row false positive (logged).
- Prototype tables (gate-all --stage prototype): 1440 9 PASS; 360 8 PASS + de-en-home-html via overrides.json (autoplay carousel capture-state; pinned gate.sh round 2.06%).
- Table fixes: index 360 card link width 100% below 768 (real defect, theme L235); gb units declaration pairs on-view slides only (artefact).
- Canon back-port candidates collected in stardust/replica/run-notes.md for the C0 foundation; canon itself unchanged since program.


## Handoff — order note (2026-11-17)
- A first inventory attempt found no stardust/migrated tree (inventory.mjs needs migrate output); its premature A-inventory start/blocked lines were withdrawn — not a human blocker. Order: migrate (plan → render archetypes) → rollout A.

## Migrate plan — 9 archetypes rendered (branch A), 15 sibling render clusters planned (2026-11-17)
- migrate.mjs render of the 9 gated prototypes → stardust/migrated/ (canon via --canon-css stardust/prototypes/canon/canon.css); shell prototype got an empty child in <main> (strict 2 needs one element; zero height, no visual change).
- modules[] recorded per archetype (stardust/migrate/module-map.md) for rollout block dedup.
- stardust/migrate/progress.json: plan done; render clusters program-1…7, locale-home, listing, shell-1/2, legal, form, home, shipping-hub pending — each runs after its template's archetype unit in C-deliver.

## A-inventory — archetypes-only coverage: 96 pages, 9 templates (2026-11-17)
- inventory.mjs (archetypes-only): 9 archetypes `pending` + 87 siblings `content-pending` = 96; templates: program 55, shell 11, listing 7, legal 7, locale-home 6, form 5, home 2, shipping-hub 2, region-selector 1.
- state.json `type` holds coarse types (program…), but inventory keys siblings by archetype SLUG (`representative` or `type`): a plain `--state stardust/state.json` run gave 17 templates. Re-ran with `--state stardust/.work/rollout/state-with-representative.json` (state.json copy + `representative` = progress.json types.<type>.archetype); state.json untouched. Future re-runs must use the same derived file.
- rollout.json site.da = {org: aemcoder, site: 9ade650b, ref: main}, liveHost main--9ade650b--aemcoder.aem.live (schema field is site.da.site, not site.site).
- Shell archetype us-en-customer-communications-html has empty modules[] (all default content?); the report says 96 of 100 discovered pages are in scope (4 out by roster cap).

## B-block — 23 distinct module blocks, one conversion point each (2026-11-17)
- blocks.mjs: 23 distinct blocks (23 module, 0 chrome, 0 widget), 497 instances → 23 conversions; edsBlockName = module id (all lowercase-hyphenated, no collision with existing blocks/). Cross-template dedup: marketing-hero (3 templates), pathways-cards (3), form/form-toast/promo-banner/secondary-promo/story-card-carousel/homepage-hero (2 each); sh-* (6) stay separate, shipping-hub only.
- plan.mjs: 96 steps; template order by size (program first); each archetype leads its template; convert points b2b 7, shipping-hub 6, de-home 5, index 2, resources 1, legal 1, global 1; contact-us reuses all 4, shell has none; no sibling converts.
- Chrome (header/footer) is not in modules[], so blocks.json has no chrome rows and plan.fragments is []; /nav + /footer docs are a D-site deliverable using the existing header/footer blocks.
- plan.json `isRepresentative` = "converts ≥1 block", so contact-us and shell print as `sib` although they lead their templates; cosmetic only.
- Siblings inherit the archetype's full block set (content-pending); per-page variants come from the variance probe in C-deliver.

## B2-dynamic — inventory re-verified (78 findings, +15 mPulse rows), martech scaffolded off (2026-11-17)
- dynamics-detect on the 9 archetype URLs (--reach stardust/current, via run-bg) → stardust/.work/dynamics-fresh/_dynamics.json: 78 findings vs 72 at replica time; the delta is only Akamai mPulse RUM per-session beacon hosts (15 new / 9 gone, *.akamaihd.net, *.akstat.io). 15 rows appended to dynamic-features.md (#77–91, same disposition as rows 15–18); every row carries a disposition.
- dynamics-plan --target-origin https://main--9ade650b--aemcoder.aem.live --migrated stardust/migrated --martech --chrome: 82 rows · self 11 · owner batch 58 · already delivered 11 · host-bound 8/8 (DG rpc beacons, AEM forms prefill/analytics/submit, csrf-token, toggles.json; all already rows with interim dispositions).
- Martech: stardust/martech/ is spec-martech output over the 9 archetypes incl. home (vendors.json pages 9), not re-run. Contract regenerated (only churn: gtag `gtm=` build hashes on routes 2/3). martech-scaffold.mjs wrote scripts/martech.js (CMP off, 0 routes enabled) + hooks in scripts.js loadEager, consented.js, consent-check.js. Lint not run (no node_modules); syntax ok.
- OneTrust data-domain-script still not found (owner copies it from the CMP admin per martech-handoff.md).

## C-deliver foundation (C0) — foundation live, chrome docs published, frozen (2026-11-17)
- styles/fonts/head.html/header/footer authored from canon (+ run-notes back-ports), pushed (HEAD 1a3ccc8); nav/footer docs for us, de/en, gb/en, logo-only, shipping-hub previewed + published.
- Header contract vs live upscia: header band 100% at 1440/360, footer 99.89%/99.77%; 5 open-state crop errors fixed off source header.min.css. 2 search-typeahead rows remain — they need D2 search (/query-index.json); re-run chrome-compare after D2.
- foundation-freeze.mjs freeze done.

## C-final — roster gate recorded, C-deliver closed with 23 failing rows (2026-11-18)
- Re-measured the 24 failing pages after fix-b1 (fresh EDS shots): 1440 12 fail, 360 23 fail — unchanged; residuals are page-specific (bespoke partner/solution layouts, 360 rhythm), no shared cause.
- b2b archetype 1440 15.37 % Δh +403 was a capture-state flip (the source CRM quote form rendered in one live capture); live re-capture 0.22 % Δh 0 PASS.
- Unit gate-all (roster, --skip-existing): 1440 84/96, 360 73/96; update-coverage --gate → 23 pages `failed`. foundation-freeze check clean.
- Next: fix wave on the 23 failing pages (E-full-site), then D-site (redirects: risk-intelligence-smb → commerceshield 301; insureShield-* camel-case coverage paths vs lowercase delivery).

## D-site — redirects sheet live, served sitemap 95 = assembled 95, / 200 (2026-11-18)
- 98 redirect rows published (source .html → delivered; risk-intelligence-smb → commerceshield; camel-case insureShield-* → lowercase). Coverage paths of those 3 rows corrected to the served path.
- Fix wave (3 subagents, groups a/b/c over the 23 failing pages) running alongside; results land in E-full-site.

## D2-dynamic — query index live (95), header typeahead, parity 8/8 PASS (2026-11-18)
- helix-query.yaml (title, description, image, robots, text) → /query-index.json total 95 (text on 86); header typeahead reads it (5 suggestions of the locale tree; "quote" → 21 matches on /us/en). Results page (/site-search) is outside the page plan — submit stays source-bound (E2 repoint).
- stardust/dynamics/parity.json: 12 features; dynamics-check on aem.live 8/8 checks PASS (martech: no tag host requested, all parts disabled). Interim/owner rows: forms + loss calculator endpoint, ROI service endpoint, martech enablement, locale switcher.

## Fix wave fix-c — 18 of 23 failing pages now pass both widths (2026-11-18)
- Group a (solutions): 8/8 PASS (new roi-calculator block, opt-in variants). Thin margins: delivery-defense 360 9.34 %, mockup 360 9.87 % (source autoplay video frame), orchestration / returns 1440 Δh −103 / −68 (>5 % of origin height — re-check in the roster run).
- Group b (partners/resources): 6/8 PASS. Still failing: insights 360 10.5 % (source video placeholder at capture), 3pl-partners 27 / 25 % (bespoke bands with no content model — not attempted).
- Group c (bespoke/legal): 4/7 PASS (insureshield-complete, legal coverage via section style `indent`, smb2, EDV). Still failing: the-logistics-lowdown 360 17.1 % (source video first frame vs poster), commerceshield 16.3 / 20.9 % (pricing cards, form frame, animated hero). risk-intelligence-smb MISSING 29 = the gate shot the 404 build URL: its liveUrl in stardust/.work/replica/roster-state-gate.json must become /us/en/solutions/commerceshield before re-gating.
- Group c changed default rules in featured-list / accordion / secondary-promo: b2b + retail re-gated 1440 only (unchanged); 360 re-gate of both still owed.
- Coverage still reads the pre-wave gate verdicts: run gate-all --only <the 23> at both widths, then update-coverage --gate with those run files (or a roster run) at E-full-site.

## E-full-site — published-origin gate 96/96 at both widths; verify 20 verified, 76 held on links / h1 (2026-11-18)
- Re-gated the 23 fix-wave pages + b2b/retail at 1440/360 (gate-all --only): 22/25 and 20/25; three fix agents then closed the rest — 3pl-partners (new check-card block, steps teaser variant: 3.54 / 7.96 %), commerceshield + risk-intelligence-smb (cards `pricing`, form `demo` variants, restored dropped strings: 4.49 / 8.13 %), insights + the-logistics-lowdown (U+202F restored, h3→p strong titles, 360 video-box mask on lowdown: 3.18/8.42, 8.87/4.41 %). EDV re-gated after the eyebrow-head cap change: 5.94 / 6.42 % PASS.
- Coverage: every page's delivery.gate.pass true. Note: the risk-intelligence-smb coverage row carries path /us/en/solutions/commerceshield, so update-coverage --gate path-matches commerceshield rows onto it — feed commerceshield through a single-row file with a non-matching path (stardust/.work/replica/cs-only-<w>.json).
- verify.mjs --all: 20 verified, 76 failed — 62 for root-relative links to pages outside the 100-page plan (E2: repoint to the source site), 14 for zero <h1> (source pages carry none: home/securecommerce lead with an h2, shells/alerts have no heading) → F/G `single-h1`. No page fails on the gate any more.
- Open: 3pl-partners hero "Get Started" → #form has no target id.

## E2-link-audit — 311 out-of-plan targets repointed to the source, every internal href 200 (2026-11-18)
- localize-links: 0 source-host links to localize, 3 normalized; `--check` exit 0. Repoint script `stardust/.work/e2/repoint.mjs` (root-relative href not in coverage → source URL, redirect sources → their destination); case recovered from captured links; 4 PDF links under `/content/guides/` fixed to their source URLs.
- Redeployed + published 82 documents (incl. every nav/footer locale variant) via deploy-batch (ledger stardust/deploy/ledger-e2-links.json): 82 ok.
- Live audit: 72 unique internal hrefs, all 200 on aem.live; source targets 307+33 checked, all 200/30x except one source-side 404 kept as captured. verify.mjs --all: 82 verified, 14 failed — all `single-h1` (source pages carry no h1), for F/G.

## F-optimize — 96 pages swept; 14 open P1 (single-h1) routed to G, 3 parity misses accepted (2026-11-18)
- optimize.mjs --all on aem.live: health 59 → 67/100 after accepting 3 duplicate-title/description findings the source shares verbatim (parity detector missed the `&#x26;` form). 127 source-parity findings informational (no JSON-LD / shared titles on the source).
- Open P1 14, all `seo/single-h1` platform-migration: the source pages carry no <h1> (home + securecommerce lead with an h2; alerts, shells, webinars, cookie-settings have no heading). G-aem applies eds-fix-h1.

## G-aem — 14 single-h1 P1 fixed with a hidden h1, optimize 100/100, verify 96/96 (2026-11-18)
- autofix-aem applied then reverted (visible deltas); `sr-heading` block + content edits on 14 pages, published. Gate 14/14 PASS at both widths; six us/en shells need `--vh 1300` (one-piece capture) — the 900-px stitch paints the source's fixed header/copyright wrong on these short pages (false 14–23 %).
- optimize.mjs --all: health 100/100, open P1/P2/P3 0, 14 P1 fixed; verify.mjs --all: 96 verified, 0 failed.

## H-report — 96/96 verified, 23 blocks, health 100; header parity re-run against the run contract (2026-11-18)
- Report: `stardust/rollout/report.md` (summary block, per-template 9/9 templates fully verified, dynamic parity table, owner items). Roster summary.json still reads 84/73 of 96 — the `--only` re-gates never fold into it; coverage carries the passing rows.
- done-check flagged `header_parity` (C0 compared against the terms-page contract). Re-explored the live aem.live b2b header with `--root "header .hdr"` (the block pins the inner wrapper, as the source pins its header) → chrome-compare vs `header-contract.json`: 0 errors, 9 warnings. `header-parity.json` replaced; the old one kept as `header-parity-terms.json`. done-check now: rollout_incomplete only.
- `stardust/learnings.md`: 6 pending entries (short-page stitch, stale roster summary, coverage path collision, header contract scope, header root, entity-encoded parity).

## I-dashboard — dashboard rendered: 96 identified · prototyped · deployed, 0 "optimised" by source-parity notes (2026-11-18)
- `dashboard.mjs` → `stardust/rollout/dashboard/{index.html,data.json}`. Health 100 (history 59 → 67 → 100), P1/P2/P3 open 0.
- "optimised" reads 0/96: the dashboard counts the 127 informational source-parity findings (fixability `out-of-scope` — no JSON-LD, titles the source shares) as open on every page. Closing them would add content the source never had, which replica forbids; left as recorded.

## Handoff — 96 of 96 in-scope pages delivered and published, run complete (2026-11-18)
- migrate → deploy → rollout A–I closed. Live: https://main--9ade650b--aemcoder.aem.live/ — 96 pages, redirects sheet, nav/footer published. Runner done-check: complete, no gaps.
- Published-origin gate 96/96 at 1440 and 360 (coverage); header parity 0 errors vs the contract; optimize health 100, open P1 0; dynamics-check 8/8, martech carried over with every part disabled.
- Owner items: form endpoints + captcha key, martech part enablement (`stardust/martech-handoff.md`). 4 planned URLs are 404 on the source.
