# EDS conversion log

## Publish decision (2026-11-17)
- Decision: **publish** (made by the run owner before handoff; hands-off, not re-asked).
- Every delivered page, the redirects sheet and the chrome documents (nav, footer and their locale variants)
  go live on the aem.live origin: deploy-batch.mjs without --no-publish, or POST https://admin.hlx.page/live/….
- Martech: source analytics, tags and consent carried over with every contract part disabled
  (stardust/martech-contract.json); enabling a part stays with the owner.

## C0 foundation (2026-11-17)
- Chrome decode tier: template-slotted (header/footer blocks build the canon DOM; nav/footer
  document nodes are MOVED into slots; chrome fragments are `@ew-exempt` — edited as documents).
- Chrome documents (DA, previewed + published, `robots: noindex`): /nav, /footer, /nav-logo-only,
  /de/en/nav, /de/en/footer, /gb/en/nav, /gb/en/footer, /nav-shipping-hub, /footer-shipping-hub.
- Resolution: page metadata `nav`/`footer`, else `/<cc>/<ll>/nav|footer` (falls back to /nav,
  /footer), us/en and `/` use /nav. `template: home` picks the shield logo (2nd brand logo).
  `nav: /nav-logo-only` = region-selector header. Footer section style `split-3-6-3` = DE/GB 3/6/3.
- `header-block` / `footer-block` metadata hands the chrome to another project block (shipping hub).
- Fonts: Roboto variable (fonts.css), Inter opsz (fonts.css), Material Symbols as `upspricons`
  (styles.css, font-display: block). Lint: eslint + stylelint + breakpoint-lint clean.

## C-archetype program — /us/en/shipping-insurance/b2b (2026-11-18)
- Blocks (owner: program; listing/form templates reuse them as-is):
  - `marketing-hero` — template-slotted; queries content (h1/h2, copy, CTA paragraphs, one image, any
    row shape). Image optional (`no-media` set by JS). Arc offset + bottom spacing reproduce the
    source `arcHeightManager` (sum of content outer heights + 72px; padding/margin tweaks by width),
    so the source's per-page `--MarketingHeroArcTop` / plain / tight heroes need no variant.
  - `secondary-promo` — template-slotted; variant class `media-right` (default media left).
    One authored heading placed by grid areas (above the image <768, copy column >=768); the
    source's duplicated media/copy titles are not mirrored.
  - `story-card-carousel` — reconstructive (one card per row, or flat cells segmented on the most
    frequent heading tag); card = image, eyebrow p, `<h3><strong>title</strong></h3>`, text p,
    link p (href = card target, EW6 unwrap). Carousel 3/2/1 per view at 992/768, arrows + dots
    only when cards exceed the view, no autoplay (restoreAtDelivery implemented).
  - `loss-calculator` — template-slotted; image + `source | <form path>` row; empty mount 157px
    (calculator frame renders empty on the source); section gets `id="calculator"`.
  - `form` — rows `source | path`, optional `action | endpoint`, field rows
    `text|email|tel|number|textarea|select|radio|checkbox | Label[ *]` (+ options list cell),
    `submit | label`; no field rows = empty mount. Block classes `quote` (24px mount),
    `calculator` (157px), `contact` (2-col field grid >=768). Submit without `action` shows
    "No backend connected"; with `action` it POSTs and dispatches `form-toast:show`.
    `@ew-exempt all` (form configuration).
  - `promo-banner` — template-slotted teal card; CTAs `<strong><em>` = yellow (accent).
  - `form-toast` — hidden at rest (wrapper display none), opens on `form-toast:show`.
  - `breadcrumb` — new small block (the foundation styles `.breadcrumb` but shipped no block);
    authored `<ol>` of crumbs moved into `div.container > nav`. Every inner template can reuse it.
- Section heads (`sec-title` centred) are default content in the same section as the block they
  head (story-card-carousel, form) and styled in place from those blocks' CSS
  (`.<block>-container .default-content-wrapper`); the page's small-print note is default content
  after `form-toast` (styled in form-toast.css). Both are queued as foundation requests.
- CTA chevrons: `a.button::after` (upspricons chevron_right) inside each block — decorative CSS.
- Media: 7 editorial images rehosted from ups.scene7.com (2x renditions) to DA `media/program/`.
- Lint: davids-model 0 🔴 / 5 🟡 (D1 prose-only blocks promo-banner + form-toast + carousel rows
  and breadcrumb: genuine bespoke components; D3 loss-calculator 1-cell image row + 2-cell
  `source` row — config row by design). block-roundtrip --ew: EW 33/37 editable, 0 dead,
  0 duplicated, 4 exempt (form/calculator config); the 3 remaining 🔴 MISSING HEADING are the
  prototype's hidden duplicate titles (replica residual duplicate-teaser-titles), text present
  once. qa-gate: 29 ok, 2 fail = form-toast h=0 (hidden at rest by design) + the harness's
  chrome logo from preview.da.live.
- Published-origin gate (preview host): 1440 0.33 % Δh 0, 360 0.57 % Δh 0, clipped 0, missing 0.
  Live nondeterminism: the get-a-quote AEM Forms iframe sometimes renders (~444px at 1440) in a
  stitched origin capture and stays 0px in others (probe: 0px at both widths after scrolling) —
  kept as the empty 24px mount (replica residual form-iframes); a capture that catches the frame
  reads Δh 444 at 1440.

## C-archetype locale-home — /de/en/home (2026-11-18)
- Blocks (owned): homepage-hero (template-slotted), pathways-cards (reconstructive; variant `icon`
  = 72 px icon cards, default = 16:9 photo cards for home / contact-us), featured-list
  (reconstructive), featured-promo (reconstructive carousel), story-card-grid (reconstructive,
  card-as-link EW6, load-more). Reused: secondary-promo (program, default media-left).
- Authored model: section heads (h2 + lede) and the lone "Learn More" CTA are DEFAULT CONTENT
  styled in place (`.<block>-container .default-content-wrapper:has(+ .<block>-wrapper)`);
  item titles in featured-list are `<p><strong>` (source h6>b, not an outline heading); story
  card titles `<h3><strong>` (source h1>b: content-presence needs a heading, the round-trip
  needs the bold body role); load-more = last story-card-grid row `<p><strong><a
  href="#load-more">Load More</a></strong></p>` (D3 🟡: 1-cell row, accepted).
- Hero "®": authored as text, wrapped in `<sup>` at decorate (presentation only, no `<sup>` in DA).
- Decorative: checkmarks (blocks/featured-list/checkmark.svg), hero/promo arcs (block SVGs).
  The hidden source "Load More" of pathways (display:none) is not rebuilt (decorate adds no words).
- Carousel: 5 s autoplay, wraps; prev/next restart the timer; an indicator click selects and
  STOPS autoplay — measured on the live source 2026-11-18 (supersedes the "indicators restart
  the timer" note in replica progress.json). Gate pin = prototype-gate approach: both sides
  stitched with `--dismiss` on the first indicator (helper
  stardust/.work/rollout/locale-home/probes/pinned-captures.mjs), then
  `gate-all --skip-existing` on those captures.
- Section style `legal-note` (small print) — foundation request filed; interim rule in
  homepage-hero.css.
- Gate (published origin, preview host): 1440 3.72 % Δh 17, 360 3.70 % Δh 33, clipped 0,
  missing 0; header bands 0.00 / 0.55 %, footer 0.78 / 0.74 %; ai-readability code 100 %.

## C-archetype shipping-hub (2026-11-18)
- Page /us/en/shipping-insurance (live). Page metadata every hub page carries: `nav: /nav-shipping-hub`,
  `footer: /footer-shipping-hub`, `header-block: sh-header`, `footer-block: sh-footer`, `template: shipping-hub`.
- Blocks (tier): sh-hero (template-slotted; rows head / calculator / dock, classified by content), sh-compare
  (reconstructive; header row + one row per topic, last column emphasised), sh-tiles (reconstructive; one row per
  tile; variants `solutions`, `stories`, default = stand-out grid with `<strong>`-led stat), sh-benefits
  (template-slotted), sh-band (paints its whole section as the pattern band; label `<h3>` row + one logo row
  each; the following sh-tiles blocks sit in the same section), sh-faq (reconstructive; `<h3>` question | answer;
  question row takes the click, glyph-only toggle per EW7). Section heads are default content before
  sh-compare / sh-tiles / sh-band / sh-faq and are reabsorbed. Hub chrome: sh-header / sh-footer (fragments,
  `@ew-exempt all`).
- CSS: compiled from the gated prototype per block (scratch compiler under stardust/.work/rollout/shipping-hub/
  tools): mobile-first (no upper-bound @media), rem → px (foundation html font-size is 10px), only the tokens a
  block uses, declared on the block root; generated files carry
  `stylelint-disable no-duplicate-selectors, no-descending-specificity` to keep the source cascade order.
- Media (DA scope `shipping-hub`, 21 files): illustrations as editorial SVG (paths rounded to stay < 40 KB),
  partner logos recoloured to the source mask colour (#5f5753) with display-size width/height, story photos
  rehosted from scene7. Decorative stills (hero lattice, band signal field) ship as block-folder CSS backgrounds.
- Decisions / residuals: "Talk to an expert", "Estimate monthly premium" and the dock are links to
  /us/en/shipping-insurance/get-a-quote (source opens a client-rendered quote drawer — buttons cannot host
  authored text, EW7); calculator renders the captured initial state (no pricing model; dynamics row 28 stays
  pending); hero term popovers and nav mega-menus inert (content not captured). block-roundtrip 9 🔴 are
  classifier readings, not drops: FAQ questions and "Integrations" are `<h3>` like live (prototype text sits in
  a button/span), two CTA buttons became links. qa-gate fails are harness artefacts (static harness cannot
  serve nav/footer fragments; schema keys every `sh-section` unit to the first block; cap 1248 px is this
  template's source cap vs DESIGN 1286).
- Gate (published origin, preview host): 1440 0.34 % Δh 0, 360 1.33 % Δh 0, clipped 0, missing/hidden 0;
  header/footer crop-compare 0.00 % at both widths; ai-readability code 99 %.

## C-archetype home — /index (2026-11-18)
- Page `/index` (served at `/`; source `/` redirects to /us/en/securecommerce.html, same content). Metadata
  `template: home` (shield logo header, `body.home`). No `<h1>`: the source has none (hero title is `<h2>`,
  section heads `<h3>`) — kept source-faithful; delivery-lint P0 h1 and qa-gate's one-h1 assert are expected.
- Blocks (owned): `stats` — reconstructive, one row per stat (figure `<p>` | label `<p>`), a trailing `*`
  wrapped in `<sup>` at decorate; paints its section as the grey band; section metadata `anchor: products`
  inserts the source's `<div id="products">` before the block (hero "Explore Solutions" → `#products`).
  `logo-strip` — reconstructive, one row per logo image (alt = partner name, source alts verbatim), 3-col grid
  < 992, space-between row >= 992, wrapper capped at 1286 px full-bleed.
  Reused as-is: homepage-hero (eyebrow `<p>`, `<h2>UPS®<br>Secure Commerce</h2>`, `<strong>` + `<em>` CTAs),
  pathways-cards (default photo cards + `icon` variant).
- Section heads (h3 + lede) are default content before stats / pathways-cards / logo-strip; the closing grey
  band is default content with section style `cta-band`. Both styled from stats.css / logo-strip.css
  (foundation request filed), plus `body.home` overrides of the reused hero/card images (inline image,
  natural hero ratio, no card margin — owner requests filed).
- Media (DA scope `home`, 10 files): the hero animated GIF (21.6 MB, 145 frames; the media bus serves no GIF)
  re-encoded to an animated WebP (3.5 MB, sharp, frame delays kept) — delivered with all 145 frames
  (restoreAtDelivery: hero animates). Pathway photos/icons from scene7, logos from the source DAM.
- Chain: localize-links --check PASS, davids-model 0 🔴 / 1 🟡 (D1 homepage-hero prose block — owner's
  bespoke hero), block-roundtrip --ew 0 structural 🔴, EW 37/37 editable (🟠 EXTRA = section heads that sit in
  separate prototype sec-title divs). replica/units.json `pathways-services` build selector extended with the
  EDS card (`.pathways-cards .pathways-cards-card`) so the units criterion measures the served side.
- Gate (published origin, preview host): 1440 0.64 % Δh 0, 360 0.35 % Δh 0, clipped 0, missing/hidden 0,
  units 0 off; first 500 px band 1.6 % / 0.4 % (header + animated hero), footer bands 0 %.
- Cluster home (1 sibling): /us/en/securecommerce — sibling-variance vs the archetype: 0 variance (capture
  identical: title, headings, body, media); DA document = the /index document (same blocks, no variant);
  deploy-batch live; gate 1440 0.64 % Δh 0, 360 0.38 % Δh 0, clipped 0, missing 0.

## C-deliver cluster locale-home — siblings (2026-11-18)
- Pages live: /ca/en/home /de/de/home /gb/en/home /it/en/home /it/it/home (sibling tier, archetype
  blocks reused; DA documents in content/<cc>/<ll>/home.html).
- Variants from the source teaser classes (budget deltas, sibling-variance): `homepage-hero
  content-right` (ups-teaser__content-right: gb/en, it/it), `featured-promo content-right` (teasers
  without content-left: ca/en, it/en, it/it — photo left), `featured-list small-titles` (list__title
  <p>, gb/en). Story-card titles that are a body <p> on the source (ca/en cards 1-2) are authored
  `<p><strong>` and keep body leading; heading titles stay `<h3><strong>`. A CTA in the pathways
  section head (gb/en "Who We Serve") gets the source cta-link spacing. gb/en hero "Log In" is `<em>`
  (secondary, open-in-new icon for another origin); gb/en tech promo bullets are a `<ul>`.
- Residuals: chrome documents for /ca/en, /de/de, /it/en, /it/it absent (foundation request) — those
  pages render the US nav/banner/footer, which owns their Δh and most of their pixel %. gb/en 360:
  the source's empty `<p>&nbsp;</p>` in a featured-list item (≈36px) is dropped by the delivery
  pipeline; gb footer height (chrome). Carousel control labels are English (source localised).

## Locale chrome documents — /ca/en, /de/de, /it/en, /it/it (2026-11-18)
- Authored content/{ca/en,de/de,it/en,it/it}/{nav,footer}.html on the de/en + gb/en structure (brand,
  utility with locale selector, menu, tools; footer split-3-6-3 + legal + copyright; robots noindex),
  strings/links verbatim from the captured locale homes; links root-relative + extensionless; source
  `?WT.svl=Footer` tracking dropped and Cookie Settings → `#cookie-settings` as in de/en. Search link =
  the source data-url `/<cc>/<ll>/site-search`. /ca/en/nav carries the source's live `alerts` section
  (peak-season webinar). de/de Instagram has no link text on the source → authored image-only link.
- PUT → preview → publish via deploy-batch (ledger stardust/deploy/ledger-locale-chrome.json): 8/8 live.
- Locale-home re-gate (pinned origin, eds reshoot): 1440 all PASS (0.97–4.78 %); 360 ca/en PASS 2.52 %,
  de/de 14.95, it/en 13.02, it/it 12.84 — header crop 0.86 %, footer visually identical; residual is
  body drift (hero title leading, legal-note band). Mobile header icon order (source search→menu, EDS
  menu→search) is header-block owned (frozen).

## C-archetype listing — /gb/en/resources (2026-11-18)
- Page /gb/en/resources (live), metadata `template: listing` (→ `body.listing`; GB chrome by locale path).
- Block (owned): `search` — template-slotted site-search bar. Authored: a paragraph = field label (moved into a
  visually hidden `<label>`, mirrored to placeholder/aria-label: `@ew-exempt placeholder`), a link paragraph =
  submit (href = site-search page, text = label; the authored `<a>` is the pill — EW7, no `<button>` host). Submit
  goes to `<href>?fulltext=<q>`; the source's hidden-on-load results/sort/pagination shell is not rebuilt (results
  page + query index = dynamics phase D2; replica residual search-results-shell).
- Reused as-is: marketing-hero, story-card-carousel ×2, promo-banner (title authored `<h2>`; source is a div title —
  round-trip ROLE SWAP accepted, same face/size), breadcrumb. Section heads are default content before search /
  carousels; the "Read More Stories" / "More Insights" CTAs are default content after each carousel (same
  section); the small-print note is default content after promo-banner.
- Overrides (`body.listing …` in blocks/search/search.css, owner requests filed): carousel trailing CTA centred,
  64px bottom; note 1.2rem on 16px lines; breadcrumb current item 1.4rem grey; CTA-less hero keeps the empty
  action row (-16px); story eyebrow bar on the label `<p>` (wrapping flex row) and full-width link row.
- Carousel: reused block scrolls by one (source scrolls by view) — dots 4 vs 2 at 1440; request filed.
- Media (DA scope `listing`, 13 files): hero + 12 card photos, 2x scene7 renditions.
- Chain: delivery-lint 0 P0/P1, media 13 hosted, davids-model 0 🔴 / 3 🟡 (D1 breadcrumb, search, promo-banner:
  bespoke components), block-roundtrip --ew EW editable all, 0 dead/dup; 🔴 readings = prototype hidden
  duplicate hero h1, button→link "Search", hidden no-results h2, div→h2 promo title.
- units.json `gb-resources-story-cards` build selector extended with the EDS card (visible slides).
- Gate (published origin, preview host): 1440 0.09 % Δh 0, 360 0.98 % Δh 0, clipped 0, missing/hidden 0, units 0.

## C-archetype legal — /us/en/legal/terms-and-conditions-upscia (2026-11-18)
- Blocks (owned): `transition-hero` — template-slotted (h1 → title slot with the teal rule, further
  paragraphs → description, link-only paragraphs → actions); the section `.transition-hero-container`
  paints the full-bleed gradient band + low white arc (blocks/transition-hero/arc.svg, decorative CSS);
  re-entrant. Reused as-is: `breadcrumb` (program). Metadata `Template: legal` → `body.legal`.
- Body: the source `text--rte` is DEFAULT CONTENT in its own section after the hero (b → strong);
  paragraph rhythm (16px gap, 64px band bottom) and the plain current crumb (1.4rem grey) are interim
  rules in transition-hero.css — foundation request filed.
- Encoder: stardust/.work/rollout/legal/encode.mjs reads the hydrated capture (breadcrumb, transition
  hero, marketing hero → program's `marketing-hero`, text--rte), links localised, `.html` dropped.
- Chain: delivery-lint 0/0/0, davids-model 0 🔴 / 2 🟡 (D1 breadcrumb + transition-hero: bespoke
  chrome-like band and hero), localize-links --check PASS, block-roundtrip --ew 0 🔴, EW 3/3;
  qa-gate 13 ok / 2 fail = header/footer fragments the static harness cannot serve.
- Gate (published origin, preview host): 1440 0.08 % Δh 0, 360 0.10 % Δh 0, clipped 0, missing 0.
- Cluster listing (6 siblings, render group `listing`): sibling-variance vs /gb/en/resources at 1440 exit 2 — ca/de/it/it-it
  clone as-is (ca: imageless insight cards, it-it: promo title already `<h2>`); announcements = hero (no lede) + one
  imageless card (title `<p>` on the source → `<h3>`); whitepapers-and-guides = hero (2 CTAs + additional text),
  teaserpromo featured → secondary-promo, storycard withLoadmore → story-card-grid (image cell + `<h3><strong>`),
  pathways services → pathways-cards (imageless, DAM PDF links kept absolute on www.insureshield.com), teal promo →
  promo-banner. Encoder stardust/.work/rollout/listing/encode.mjs (capture → DA doc + sibling clone); hero images use
  the scene7 `fit=stretch` 592x333 rendition (the source paints a 3:2 original into its 87/49 frame). Card hrefs
  lowercased (archetype too). Images stay on scene7 (media-reconcile keep).
- Cluster gate (preview host): ca/de/it/it-it 1440 0.09–0.3 % / 360 0.82–1.26 % Δh 0–1; announcements 2.93 % Δh 16 /
  9.5 % Δh 3; whitepapers-and-guides 3.9 % Δh 4 / 19.03 % Δh 75 (FAIL at 360 — reused secondary-promo /
  story-card-grid / marketing-hero metrics + no listing CSS vehicle on that page; requests filed).

## C-deliver cluster legal — siblings (2026-11-18)
- Siblings (6, render unit `legal`): /us/en/about/our-locations, /us/en/legal/{product-disclosure,
  technology-agreement, terms-and-conditions-gallagher-affinity, terms-and-conditions-of-service-and-
  explanation-of-coverage, …-coverage-users}. sibling-variance exit 2 (stardust/.work/rollout/legal/
  variance.json): deltas budgeted as variants, never forks.
- `transition-hero` variants: `marketing` (copy-only Marketing Hero teaser: right-hand half column —
  source row-reverse, 104px band bottom, marketing arc 72px above the bottom; CSS only), `small`
  (description in `.small` print). New slot: a later row of link-free paragraphs = the teaser's
  additional text (grey 1.4rem, below the actions).
- Body: lists (disc, 3.2rem indent), headings 16px apart; blank source lines encoded `<p>&#8203;</p>`
  (pipeline drops whitespace-only paragraphs); layout tables → boilerplate `columns` + variant
  `table` (660px, never stacks), styled from transition-hero.css (request filed).
- our-locations: reused `marketing-hero` (image) + `pathways-cards icon` without images (source
  `no-icon` hides them) + new `office-list` block (template-slotted: country picker list with the
  selected item in `<strong>`, office card h4/h5/address/tel/mailto). The picker opens/closes and
  marks a country; other countries' office fragments were not captured (residual).
- delivery-lint P1 one-cta-per-p on 4 legal docs = prose paragraphs with bold text + 2 inline links
  (false positive; text verbatim). Gate (published origin, preview host), 3 fix rounds:
  1440 all 7 PASS (max 9.46 %); 360 5/7 PASS — of-service 12.09 % Δh 54, users 12.31 % Δh −14
  (pixel-only: text-wrap drift through 9–25k px legal bodies; heights within tolerance).

## C-deliver program cluster — Stage B delivery (2026-11-18)
- 54 DA paths live (55 slugs; risk-intelligence-smb is served at /us/en/solutions/commerceshield).
  Encoder (scratch stardust/.work/rollout/program/encode.mjs) fixes: featured-list `.list__title`/
  `.list_desc` items, plain-text story/pathways descriptions, nested `.cmp-container` grids,
  columncontrol columns (stat columns → reused `stats`), homepagehero → reused `homepage-hero`,
  blockquote → h3 + attribution, video-gallery → story-card-carousel (poster stills), calculator
  XF → loss-calculator, localized load-more labels, hero/featured-list additionalText notes,
  linked featured-list titles as `<h5>`, scene7 `_WxH` GIF originals → still renditions.
- Program blocks changed: promo-banner (note after CTAs), marketing-hero (note after CTAs +
  scoped featured-list `image-right` / image-less overrides, request filed), accordion `tabs`
  variant (vertical tab list + panel ≥992), secondary-promo/promo-banner centred heads inset 16.5 %.
- Residuals: AEM Forms iframes render on the source in most captures (empty mount here), bespoke
  pages (3pl-partners, enhanced-declared-value, commerceshield, customer-stories, select-my-coverage
  comparison table → unstyled `coverage-details`), story-card-grid/pathways (locale-home) geometry.

## C-archetype shell — /us/en/customer-communications (2026-11-18)
- Blocks: none (plan step convert/reuse empty). The source page is chrome-only (empty breadcrumb + empty
  aem-Grid, replica residual `empty-main-blank-render`) — replicated as captured: header/footer by the
  foundation resolution (us/en → /nav, /footer), main holds ONE empty section.
- The empty section is load-bearing: a document with only the metadata block delivers no `.section`, and
  scripts.js `loadSection(main.querySelector('.section'))` throws (harness pageerror `reading 'dataset'`,
  header/footer never load). The document carries a section whose only node is `Section Metadata`
  (Style `empty-grid`) → delivered `<div class="empty-grid"></div>`, 0 px (`main .section` margin 0).
  Siblings of this template must keep that section.
- Chain: delivery-lint P0 `h1` (0 found — source has no h1; not invented), media-reconcile 0 media,
  davids-model 0/0, sanitise unchanged; qa-gate 7 ok / 4 fail = h1 (source), header/footer fragments
  the static harness cannot serve, 2560 cap on an empty main; block-roundtrip n/a (no blocks).
- Gate (published origin, preview host): the default 900px stitch mis-pastes the sticky header on this
  ~1000px page (origin 18.97 % / 22.6 %, capture artifact); single-chunk capture (`--vh` ≥ page height:
  1200 at 1440, 1048 at 360): 1440 0.06 % Δh 0, 360 0.65 % Δh 1, clipped 0, missing 0.

## C-archetype form — /us/en/about/contact-us (2026-11-18)
- Reused as-is: `breadcrumb`, `marketing-hero` (CTA `#form` + small note after it), `form contact`
  (field rows from the gated static frame: text First/Last Name, tel Phone, email Business Email,
  text Company/State/Zip Code, radio "Inquiry type" + 2 options, submit Send; `source` = the AEM
  adaptive-form path; no `action` → "No backend connected", dynamics row 23 interim), `form-toast`,
  `pathways-cards icon` (icon in its own cell) + `pathways-cards` (no-icon: images not authored).
- New block (owner: form): `form-anchor` — one cell `form` sets the section id (the hero's `#form`
  CTA target) and renders nothing (`@ew-exempt all`). Its CSS, scoped to `.form-anchor-container`,
  carries the template's interim rules for the reused `form contact`: centred h5 intro, 4-column
  grid (State|Zip share a half column), hidden radio legend, 25px radio rows, reCAPTCHA slot
  (decorative `::before`, 302x76), Send at 506px, frame min-height 522 / 798.28, 7px toaster flow.
  Foundation requests filed (form contact geometry; pathways-cards `<p><img>` empty-title bug).
- Encoder stardust/.work/rollout/form/encode.mjs: migrated page (archetype structure) → DA doc
  (breadcrumb outside main, mhero, rte h5s + form-mount frame fields, toaster, sec-title + paths).
- Chain: delivery-lint 0/0/0; media-reconcile 4 keep (scene7); davids-model 0 🔴 / 6 🟡 (D1
  marketing-hero, form-toast, pathways-cards x2, form-anchor: bespoke/config blocks; D3 form
  radio row carries an options cell); block-roundtrip --ew 0 🔴 (EW 1/2, 1 exempt); qa-gate fails
  only header/footer (static harness) + form-toast/form-anchor h=0 by design.
- Gate (published origin, preview host): 1440 0.2 % Δh 0, 360 4.3 % Δh 1, clipped 0, missing 0.
  Residuals: reCAPTCHA is a static slot, the form does not submit (no endpoint), footer social
  icons lazy on the source; block `form-anchor` has no coverage catalog row (update-coverage: no
  block "form-anchor").

## C-archetype region-selector — /us/en/global (2026-11-18)
- Block (owned): `region-selector` — reconstructive repeat group. Rows: the page `<h1>` (any row) +
  one row per region `| name | list of locale links |`. The map is a decorative asset
  (blocks/region-selector/map.svg, the source #ups-svg-countries, inlined by fetch so regions can
  be lit; height reserved by the 55 % padding box → no shift); a row lights the map group whose
  `data-region` equals its lower-cased name (`europe`, `north america`); unmatched regions still work.
  Disabled source groups renamed `region-disabled` (stylelint kebab-case; asset-internal).
- Behaviour (replica motion, all implemented, verified on the preview page with a Playwright probe):
  click / Enter / Space toggles `.ups-active` on item + toggle + map group (others close, again
  closes, `aria-expanded`), chevron rotate .5s, colours .15s; toggle hover → `.ups-mousein` on
  toggle + map group; map-group click toggles its item; map hover via CSS; sticky-nav = foundation.
- EW: the delivered name cell (bare text — the pipeline unwraps a lone `<p>`) is MOVED as the
  heading row (`role=heading`), the authored `<ul>` is moved as the link panel → EW 5/5.
- Chrome: metadata `nav: /nav-logo-only` (logo-only header, foundation); default /footer.
  Block padding (not margins) carries the source's contained margins (6rem bottom; 30px ≥768).
- Chain: delivery-lint 0/0/0, davids-model 0 🔴 / 1 🟡 (D3 title row 1 cell vs region rows 2 —
  the h1 must sit in the map column), sanitise 12 entities, block-roundtrip --ew 0 🔴,
  qa-gate 11 ok / 2 fail = header/footer fragments the static harness cannot serve.
- Gate (published origin, preview host): default stitch 1440 7.13 % / 360 7.32 % Δh 0 — the whole
  diff is the last stitch chunk (copyright bar, bands 98.9 % / 28.9 %); single-chunk capture
  (`--vh` 1610 / 1330): 1440 0.05 % Δh 0, 360 0.19 % Δh 0, clipped 0, missing 0.

## C-deliver cluster form — siblings (2026-11-18)
- Siblings (4, render unit `form`, migrate.mjs A' of us-en-about-contact-us-html, 4/4 rendered):
  /us/en/customer-communications/{confirm,updated}-contact-information, /us/en/promotional/
  prod-form-test, /us/en/resources/help-and-support. sibling-variance exit 2 (stardust/.work/
  rollout/form/variance.json): hero padding/height and card count deltas are content-driven.
- Encoder stardust/.work/rollout/form/encode-sib.mjs (copy of program/encode.mjs): the AEM Forms
  frames render empty in every capture, so the `form contact` field rows are read off the capture
  screenshots; `source` = the adaptive-form path found in the capture. Selects carry no options
  (not captured). Every form section carries `form-anchor` (the template's CSS vehicle); its cell
  now takes several names (help-and-support: `form` + `faq`, the source ids the form container
  `#faq` for the hero's "View FAQs"); self-links `<path>?#x` → `#x`. prod-form-test has no h1 on
  the source and keeps none (delivery-lint P0 h1, shell precedent).
- Variants (CSS in blocks/form-anchor/form-anchor.css): `form contact update` (reCAPTCHA + submit
  at 417px), `preference` (1006px frame, 32px gap, submit right-aligned beside the reCAPTCHA),
  `standalone` (no hero, title flush under the breadcrumb), `support` (no reCAPTCHA, Zip half
  column); h2-head frames: 48px head gap, < 768 bare field column; `marketing-hero copy-right`
  (request filed: linked description slotted as CTA); `pathways-cards trailing` (+64px).
- Reused as-is: breadcrumb, marketing-hero, form, form-toast, pathways-cards icon, accordion,
  promo-banner. Chain: delivery-lint 0 P0 (prod-form-test h1 by source), 2 P1 one-cta-per-p
  false positives (FAQ prose with mailto + tel); davids-model 0 🔴; block-roundtrip --ew 0 🔴
  except help-and-support h5 intro (default content beside the block, harness artifact).
- Gate (published origin, preview host), 3 fix rounds: 1440 confirm 4.99 % Δh −40, updated
  2.83 % −8, prod-form-test 8.98 % −4, help-and-support 7.32 % −120; 360 6.83 % 0, 6.85 % 11,
  6.55 % −2, 7.34 % −40; clipped 0, missing 0. Residuals: forms do not submit (no endpoint),
  reCAPTCHA static slot, select options unknown, marketing-hero image 20px lower at 360 (program).

## C-deliver cluster shell — siblings (2026-11-18)
- Pages live (10, archetype structure, no blocks of shell's own): /de/en/alerts, /gb/en/alerts,
  /gb/en/other-ups-sites, /it/en/alerts, /it/it/alerts, /us/en/page-deletion, /us/en/test-deletion,
  /us/en/test-deletion1 (chrome-only: the load-bearing `empty-grid` section), /us/en/legal/cookie-settings,
  /us/en/resources/webinars (source carries a breadcrumb → reused program `breadcrumb` block, the crumb
  section replaces the empty-grid one; webinars crumb links /us/en/resources). Locale chrome resolves by
  path (/<cc>/<ll>/nav|footer). Title/description verbatim from the capture; no h1 (source has none).
- sibling-variance (stardust/.work/rollout/shell/variance.json) exit 2: locale grids shorter (no alert
  banner in locale chrome — chrome-owned), breadcrumb EXTRA on cookie-settings/webinars → reused block,
  no variants. Render (migrate.mjs on a scratch state copy, stardust/.work/rollout/shell/sib.mjs):
  shell-1 5/5, shell-2 5/5, refused 0. Deploy: deploy-batch ledger-shell.json, 10/10 live.
- Gate (published origin, preview host): 1440 one-piece vh 1300 — 10/10 PASS (0.02–2.93 %, Δh 0).
  360: the header drawer makes EDS report vh+header on short pages so a one-piece EDS shot always
  stalls; EDS stitched at a small vh (300 locale / 700 us) in a scratch out dir, origin re-shot in one
  piece at the EDS height (stardust/.work/rollout/shell/gate360.sh) — 10/10 PASS (0.12–8.64 %, Δh 0).
  cookie-settings 8.64 %: plain current crumb renders 1.6rem (+4px shift; request filed, block is
  program's). Requests: breadcrumb current crumb, header drawer height (gate instrument).

## C-deliver program cluster — fix rounds 1–3 (2026-11-18)
- Archetype /us/en/shipping-insurance/b2b re-gated first: the 02:56 run's 11.38 % was a stale-CSS
  capture (section-head inset reverted in a378b9a, CDN not yet refreshed); fresh 1440 0.33 % Δh 0,
  360 0.57 % Δh 0, both PASS. No restore needed.
- Content (MISSING rows 10 → 0 at 1440): accordion titles authored as `<h3>` (source
  cmp-accordion__header) + toggle aria-label = title; multi-heading hero titles (DeliveryDefense™ /
  Technology) → h1 + continuation h2, marketing-hero keeps consecutive headings in the title;
  carousels of secondarypromo video teasers → new `secondary-promo carousel` variant (one slide
  per row, dots/arrows, 60 s rotation, `autoplay` = 5 s; posters from the dynamic-media asset path,
  percent-encoded); story-card titles from `.description__title`; grid cards' image in its own
  cell (empty-eyebrow wrap gone); `initial-6` grid class + CSS for the resource hubs; linked promo
  images keep their link; source rich-text tables → new program block `data-table` (a bare DA
  `<table>` loses its first row as a block name — select-my-coverage lost 4 links).
- Forms: source adaptive forms that render on the live page (frame 520 px, Δh +280…+690 on 14
  pages) now carry native field rows (forms-extract.mjs reads the form iframe: labels, types,
  select options; tracking/CRM and Canada-only province fields dropped) on `form quote contact`;
  quote forms with fields: 800 px two-column grid, submit under a 130 px captcha slot. No backend
  (submit shows the no-backend notice). Pages whose source frame is hidden keep the empty mount.
- Layout: list-ended secondary-promo copy keeps the 8 px action gap; pathways-cards (owner
  locale-home) inline image + empty-text spacing and stats (owner home) program head/three-column
  band as scoped interim overrides (requests filed); featured-promo `content-right` per source
  teaser side; pull quote → section style `quote` (styles in secondary-promo.css).
- Gate: 1440 20/55 (stale) → 32/55, worst 31.26 % (select-my-coverage); 360 7/55, worst 40.16 %
  (the-logistics-lowdown). Residuals (3 rounds spent): bespoke compositions with no program block
  (3pl-partners, commerceshield ×2, select-my-coverage comparison/columns, EDV, insureshield-complete,
  special-commodities, delivery-defense savings calculator), cargo ×5 at 1440 13–16 % (card/section
  rhythm), and the 360 breakpoint broadly (about ×5 ≈ 21 % with Δh ≈ −20: marketing-hero mobile
  image sits ~16 px lower than the source; locale header icon order differs on de/it/gb chrome).

## C-final — foundation request queue applied once (2026-11-18)

- Queue: 28 lines in `stardust/rollout/foundation-requests.md` → 25 applied, 2 already resolved
  (breadcrumb block shipped by program; ca/de/it locale chrome documents live), 1 declined (a
  global `a.button` chevron — the source chevron is per-CTA markup, not a theme rule).
- Foundation (`styles/styles.css`, re-frozen, 17 files): section styles `sec-title` /
  `sec-title-center`, `legal-note`, `cta-band` (moved out of homepage-hero / logo-strip);
  `scripts.js` loads `/styles/templates/<template>.css` (listing → `styles/templates/listing.css`,
  so announcements / whitepapers get the listing rules without a search block). Header: closed
  drawer is height 0 + hidden (short pages no longer report vh + header — shell / region-selector
  now gate one-piece), search toggle before the menu outside the US.
- Owner blocks: breadcrumb span-wraps a plain current crumb (foundation `li > span`);
  marketing-hero keeps the empty action row, link-bearing sentences are description, `copy-right`
  variant; pathways-cards inline photo image, empty-description spacing, empty-<p> title fix;
  featured-list `image-right` / image-less checklist, linked bold titles; story-card-carousel
  scrolls by view, eyebrow wraps under its bar; story-card-grid `initial-<n>`; stats program
  layout; columns `table`; form `contact` frame geometry (form.css); homepage-hero home overrides +
  open_in_new on home CTAs; secondary-promo `featured`. Scoped interim copies removed.
- Content (DA re-PUT): whitepapers promo `secondary-promo featured`; source <p> card titles as
  <p><strong> on insights / customer-stories / whitepapers.
- Archetypes before → after (1440 / 360 %): program b2b 0.33/0.57 → 0.33/0.57; home 0.64/0.35 →
  0.7/0.3; listing 0.09/0.98 → 0.08/0.97; legal 0.08/0.10 → 0.08/0.10; locale-home de-en
  3.72/3.70 → 1.22/3.72; form 0.2/4.3 → 0.19/4.28; shell 0.06/0.65 → 0.04/0.10; region-selector
  0.05/0.19 → 0.04/0.13; shipping-hub 0.34/1.33 → 0.34/1.33 — 9/9 pass at both widths.
- Targeted pages: 1440 9/13 → 11/13, 360 2/13 → 5/13 (whitepapers 360 19.03 → 9.26, cookie-settings
  8.64 → 0.10, it-en / it-it 13 → 4.3 / 4.0). Still failing: about (1440 14.63 Δh −105 / 360 16.39
  Δh −29), claims-support (15.47 Δh 134 / 16.26 Δh 108), and at 360 customer-stories 32.5 Δh 105
  (video gallery), insights 19.47 Δh 300, de-de home 15.23 Δh 44, gb-en home 10.32 Δh 13, legal
  coverage 12.09 Δh 54 / users 12.31 Δh −14 — pre-existing program / locale rows, not regressions.

## C-final fix — fix-a (2026-11-18)
Pages 18 (shell 11, listing 3, legal 2, locale-home 2). Before = roster summary (all-<w>/summary.json);
after = `--only` runs in stardust/replica/gates/all-<w>/runs/ (08:34, 08:40, 08:49/08:55, 08:59).
- Shell (11 pages, no code change — capture artifact proven): the roster rows mixed capture modes on
  pages shorter than ~1100px. 1440 alerts ×4 / other-ups-sites / page-deletion / webinars: origin was the
  cached one-piece `vh 1300` shot (C-deliver), eds a fresh `vh 900` shot → "Δh +400/+284/+215" is the two
  viewport clamps (1300 vs 900), not page height. customer-communications / test-deletion ×2 /
  cookie-settings / webinars-360: both sides 2-chunk stitches at equal heights (1016/1047/1084/1099/1100,
  Δh 0) with the sticky header mis-pasted in the last chunk (hot band = the last 16–100 rows ≈ 95–100 %).
  Re-gated in their own `--only` group with `--vh 1300 --recapture-origin --recapture-eds` (one piece ≥
  page height on both sides, as the shell archetype): 1440 0.02–0.05 % Δh 0, 360 0–0.15 % Δh 0, 11/11
  PASS both widths (before 1440 0.03–18.97 % / Δh 0…+400, 360 0–22.6 %). Header drawer: no document
  height growth left (closed drawer height 0 since C-final; EDS doc heights equal origin's at 360).
  The default-stitch roster run will keep reporting these rows until it is re-run with `--vh 1300` for
  the shell group (no override written).
- Listing: `story-card-carousel` now accepts a body-`<p>` card title authored `<p><strong>…</strong></p>`
  (one card per row; real headings still win) with the source body leading (1.5 / 1.4 from 768 at 2rem,
  bold run `display:block` so it fills the line box like the source's bare text) — same convention as
  story-card-grid. Re-PUT + published ca/en/resources (2 p-sourced titles) and about/announcements (1);
  title source = the card aria-label tag on the capture. units.json family `gb-resources-story-cards`
  scoped by `pages` (the 6 slick-carousel listing pages) instead of `templates: listing`:
  whitepapers-and-guides renders its story cards as a static grid (0 `.slick-active` matches on the
  origin → unit error, not a geometry delta). announcements 1440 2.91 % units off 3 → 0.53 % PASS,
  360 7.2 % off 3 → 0.3 % PASS; ca/en resources 360 1.22 % off 2 → 0.71 % PASS (1440 0.07 % PASS);
  whitepapers 1440 0.78 / 360 9.26 % → PASS (units n/a). Archetype gb/en resources 0.08 / 0.97 % PASS.
- Legal: `transition-hero` hides the additional text outside `marketing` (source teasernMarketHero
  `.ups-teaser__transitionhero .content-dir … .cmp-teaser__additionalText {display:none}`, measured
  hidden at 360 and 1440); `small` description p line box = 16px / 20px ≥992 (source p at line-height 1,
  the ≥992 2.8rem rule was dead — overridden by source order). users 360 12.31 % Δh −14 → 9.79 % Δh 2
  PASS (1440 4.17 % PASS). coverage 360 12.09 % Δh 54 → 10.36 % Δh 74 STILL FAIL (1440 8.06 % PASS):
  7 roman-numeral paragraphs (i.–vii.) carry a 15–18 `&nbsp;` lead on the source; the document now
  carries them verbatim (re-PUT) but the delivery trims leading whitespace, so the ~72px indent and its
  ~3 extra lines at 360 are lost (crop aligned by 74px below them: 0.00 %). Needs a content-model
  decision (indent block / section style) — 3 rounds spent. Archetype upscia 0.08 / 0.10 % PASS.
- Locale-home: `homepage-hero` multi-heading title (de/de h1 + continuation h2) keeps the source
  1.2rem gap between headings (theme `.ups-teaser__homepagehero .cmp-teaser__title h1`, :last-child 0)
  — the 12px shift ran under all text below the hero. de/de 360 15.23 % Δh 44 → 2.2 % Δh 16 PASS
  (1440 1.23 %). gb/en 360 10.32 % → 8.43 % PASS with a mask (all-360/masks.json, 5648:513@5604):
  the Customer Stories featured-promo carousel autoplays on the source (data-cmp-autoplay, 5000 ms)
  and the origin stitch lands on a later slide (same slides, same 513px band measured on both sides).
  Residual: the source's empty `<p>&nbsp;</p>` in a featured-list item (36px) is dropped by delivery
  (re-PUT test confirmed, reverted). Archetypes index 0.65 / 0.37 %, de/en 1.14 / 2.59 % PASS.
- Blocks touched: story-card-carousel, transition-hero, homepage-hero (scoped selectors only).

## D-site — redirects sheet, sitemap, root (2026-11-18)
- `stardust/redirects.tsv` → DA sheet `/redirects.json` (98 rows), previewed + published: every source
  `.html` path → its extensionless delivered path; `/us/en/risk-mitigation/risk-intelligence-smb(.html)` →
  `/us/en/solutions/commerceshield` (the source 301s there; one document serves both rows);
  `insureShield-complete` / `insureShield-connect` (camel-case source segments, with and without `.html`)
  → the lowercase delivered paths. Spot-checked 301s on aem.live.
- Coverage `path` of those three rows set to the path EDS serves (was the source spelling), under the
  coverage lock — a re-run of `inventory.mjs` would restore the source spelling; re-apply after one.
- `assemble.mjs --verify-origin` aem.live: served 95 = assembled 95 (96 rows, two share commerceshield),
  extra 0, missing 0 — chrome documents carry noindex. `/` 200, robots.txt 200.

## Fix 3pl-partners — bespoke bands modelled, PASS both widths (2026-11-18)
- /us/en/partners/3pl-partners: 1440 27.5 % Δh −1711 → 3.54 % Δh 7 PASS; 360 25.15 % Δh −2287 →
  7.96 % Δh −3 PASS (MISSING/HIDDEN 0, clip 0). Runs: all-1440/runs/2026-11-18T13-25-32-132Z-…,
  all-360/runs/2026-11-18T13-27-02-588Z-…. 2 rounds, no override.
- New block `check-card` (source embed's inline-styled checklist card: teal 24/1.3 header, 18/1.5
  Arial lines with a 20px check). The four check lines were missing from the migrated document —
  now authored verbatim. Duplicate hidden teaser image-column titles dropped; source description
  "Tell us about your operation…" added; promo title h2 → h3 (source h3).
- Variants (opt-in, no other page changes): pathways-cards `steps teaser` (teasercard with a
  description), pathways-cards head with h6 ledes (`:has(> h6)`, only this page), homepage-hero
  `ratio-natural` (one 1440x624 rendition below 768), form `partnership` (reCAPTCHA slot + submit
  502px into the frame, 139px frame tail, 64px under the grey band), promo-banner `spacer-above`
  (source empty embed: 88px).
- `title-pad` duplicated into pathways-cards.css / form.css for pathways / check-card / form
  sections (its rule lives in featured-list.css, which this page does not load); every other
  title-pad page (EDV, become-a-partner, commerceshield) loads featured-list — same 4rem, no change.
- Gap: the hero "Get Started" link targets `#form`; no anchor is set (form-anchor carries section
  styling for the form template) — scroll target only, not gated.

## fix-vid — insights + the-logistics-lowdown at 360 (2026-11-18)
- Evidence (all-360 bands + crops in stardust/.work/replica/vid/): not only video. (1) Source card copy carries U+202F narrow no-break spaces ("they impact retention", "Control Into Growth Strategy", 11 strings) that the migration had flattened — wraps differed on both pages; restored as `&#8239;` in content/us/en/resources/{insights,the-logistics-lowdown}.html. (2) Lowdown card titles that are a body `<p>`/bare div on the source (`description__title`) were authored `<h3>` (19px leading vs 24px): 16 of 77 titles re-authored `<p><strong>` (h1-sourced titles kept h3). (3) `story-card-carousel` variant `stack` (lowdown only): head 8px high at every width (margin-top -8px), no trailing 20px after the last stacked card below 768. Default rules untouched; no other page uses `stack`.
- Capture state, lowdown 360: the four Scene7 video players (hero + 3 gallery cards) paint the teal pre-load placeholder in the source stitch vs the build's own poster. Masked in gates/all-360/masks.json (975/1545/2292/2750, h167): inside 77.7 % differ, outside 6.8 %; gate 11.71 % → 4.41 %. Insights' hero video placeholder (y1183–1350) needs no mask after the text fix.
- Gate: insights 1440 3.18 % Δh 0 PASS, 360 8.42 % Δh 25 PASS; lowdown 1440 8.87 % Δh -3 PASS, 360 4.41 % (masked) Δh 2 PASS. Content deployed via deploy-batch (ledger stardust/deploy/ledger-fix-vid.json).

## fix-cs — /us/en/solutions/commerceshield (+ redirect /us/en/risk-mitigation/risk-intelligence-smb) (2026-11-18)
- Pricing band: the plain default-content copy became `cards (pricing)` (new opt-in variant; cards.js marks the cap label, the em-only price note and the ✓ badge). Values lifted from the source bootstrap .card (450px, 1px rgb(217 217 217), cap rgb(185 214 213)/rgb(0 123 130), p-3 at 10px root, green badge). Restored source copy that was dropped: "Base Layer"/"ADD-ON", "per order"/"service fee". Below 992 the source card cuts its last feature line off (overflow hidden at 450px); the recreation lets the card grow so no text is hidden (clip 0).
- Form band: added the dropped description ("Learn how the CommerceShield™ solution…"); `form quote contact demo` (new opt-in variant: State | Zip share a half column, reCAPTCHA slot 304x78, submit at 506px, the AF frame's top inset and empty foot) and section style `title-sm` (20/28 → 32/40 head) in form.css.
- Section rhythm: section style `title-gap` (eyebrow-head + cmp-title head: 24/48px to the block) on "Simple ways…" and "Insights…"; `title-pad` on the pricing, form and FAQ sections; `legal-note` on the closing small print (+ form-toast.css 64px band bottom after the toast); tabs-horizontal panel image 40px under its copy; eyebrow-head h3 772px measure from 992 and an explicit 7px foot under an eyebrow-head image (shared default rules — the only other eyebrow-head page is /us/en/customer-communications/enhanced-declared-value, whose heads are short and carry no image, so it is unaffected).
- Gate (published origin): 1440 4.49 % Δh -4 PASS (smb redirect 4.51 % PASS), 360 8.13 % Δh -36 PASS (smb 7.93 % PASS); runs gates/all-1440/runs/2026-11-18T13-34-28-172Z-*, gates/all-360/runs/2026-11-18T13-32-42-784Z-*. No override or mask. Content deployed via deploy-batch (ledger stardust/deploy/ledger-fix-cs.json); code commits 7858547, 2f66ef6, c14f5dd.

## G-aem — single-h1 on 14 pages via a visually hidden heading (2026-11-18)
- The source renders no <h1> on 14 delivered pages (home + securecommerce lead with an h2 hero title; alerts, shells, webinars, cookie-settings, prod-form-test carry none). autofix-aem's eds-fix-h1 would have inserted a visible title or promoted the hero h2 (larger type) — both visible deltas the replica may not make. Applied instead: new block `blocks/sr-heading` (accessible visually-hidden pattern, clip-path inset) holding one <h1> = the page's metadata Title minus " | InsureShield", placed after the breadcrumb or at the start of the first section. Nothing paints: re-gated 14/14 at 1440 + 360 (us/en shells at --vh 1300, as their C-final records).
- Deployed + published via deploy-batch (ledger stardust/deploy/ledger-g-h1.json): 14 ok.
