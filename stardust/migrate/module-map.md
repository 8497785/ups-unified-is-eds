# Module map — archetype composite sections → module ids

Sections are the `data-section` indices in stardust/migrated/. Unlisted sections are default content
(sec-title headings, rte text, notes/disclaimers, lone CTA buttons, spacers/anchors) or chrome.

us-en-shipping-insurance-b2b-html: 1 → marketing-hero, 2 → secondary-promo, 3 → secondary-promo, 5 → story-card-carousel, 6 → loss-calculator, 8 → form, 9 → promo-banner, 10 → form-toast
index: 1 → homepage-hero, 3 → pathways-cards, 4 → stats, 6 → pathways-cards, 8 → logo-strip
gb-en-resources-html: 1 → marketing-hero, 3 → search, 5 → story-card-carousel, 7 → story-card-carousel, 8 → promo-banner
us-en-legal-terms-and-conditions-upscia-html: 1 → transition-hero
de-en-home-html: 1 → homepage-hero, 3 → pathways-cards, 6 → featured-list, 8 → featured-promo, 10 → story-card-grid, 11 → secondary-promo
us-en-about-contact-us-html: 1 → marketing-hero, 5 → form, 6 → form-toast, 8 → pathways-cards, 10 → pathways-cards
us-en-customer-communications-html: (none — shell page, section 1 is an empty grid)
us-en-global-html: 1 → region-selector
us-en-shipping-insurance-html: 1 → sh-hero, 2 → sh-compare, 3 → sh-tiles, 4 → sh-benefits, 5 → sh-band, 6 → sh-faq

## Vocabulary

- marketing-hero — `.mhero` image+copy hero (DESIGN marketing-hero) — b2b, resources, contact-us (3)
- homepage-hero — `.hphero`/`.hph` card-over-image home hero (DESIGN homepage-hero) — index, de-home (2)
- transition-hero — `.thero` plain title+date band (DESIGN transition-hero) — legal (1)
- secondary-promo — `.spromo` media/text split promo (DESIGN secondary-promo) — b2b, de-home (2)
- promo-banner — `.bpromo` dark card with heading, copy, CTA pair — b2b, resources (2)
- featured-promo — `.fpromo` auto-rotating testimonial carousel (DESIGN featured-promo) — de-home (1)
- featured-list — `.flist` image + icon checklist (DESIGN featured-list) — de-home (1)
- pathways-cards — `.paths`/`.pw` grid of image/icon cards, icon/no-icon variants (DESIGN column-control) — index, de-home, contact-us (3)
- stats — `.stats-band` heading + 4 key figures — index (1)
- logo-strip — `.logos` customer logo row — index (1)
- story-card-carousel — `.stories` sliding story cards (DESIGN story-card-carousel) — b2b, resources (2)
- story-card-grid — `.rcards` story-card grid with load-more — de-home (1)
- search — `.lsearch` resource search with suggestions (DESIGN search) — resources (1)
- loss-calculator — `.calc` image + calculator form mount — b2b (1)
- form — `.form-mount` AEM adaptive-form embed (DESIGN form) — b2b, contact-us (2)
- form-toast — `.toaster` hidden submit-success popover — b2b, contact-us (2)
- region-selector — `.rsel` region/language list — global (1)
- sh-hero — hero with savings slider/histogram calc — shipping-hub (1)
- sh-compare — carrier-liability vs insurance comparison — shipping-hub (1)
- sh-tiles — stat/feature tile grid — shipping-hub (1)
- sh-benefits — split illustration + benefit checklist — shipping-hub (1)
- sh-band — integrations logos + related-solution tiles band — shipping-hub (1)
- sh-faq — FAQ accordion — shipping-hub (1)
