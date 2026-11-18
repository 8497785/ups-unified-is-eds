# Run notes (facts later steps need)

- Source: https://www.insureshield.com/ — AEM Sites, ups-global clientlibs + theme-insure-shield.
- `/` redirects to /us/en/securecommerce.html (index duplicates us-en-securecommerce-html).
- /us/en/solutions/insureshield-shipping-insurance.html duplicates /us/en/shipping-insurance.html (Vite app, Inter font, different design system).
- Not captured: /it.html /gb.html /ca.html /fr.html — HTTP 404 on source (verified with curl 2026-11-17).
- Consent: OneTrust, appears late (26 captures show it). Gate flag: `--consent "#onetrust-accept-btn-handler"`.
- Fonts: Roboto 400/500 (Google Fonts, open), Inter (shipping hub), icon font `upspricons` = Material Symbols Rounded (Google, Apache-2.0). Files in stardust/current/assets/fonts/.
- Source CSS: stardust/current/assets/css/ (45 sheets; theme-insure-shield.min.css is the theme layer).
- Vision check: stardust/.work/vision-check.tsv (92 ok, 4 suspect, all cosmetic).

## Archetypes (type → rep slug)
- home → index (live /us/en/securecommerce.html)
- locale-home → de-en-home-html
- program → us-en-shipping-insurance-b2b-html
- listing → gb-en-resources-html
- legal → us-en-legal-terms-and-conditions-upscia-html
- form → us-en-about-contact-us-html
- shell → us-en-customer-communications-html
- shipping-hub → us-en-shipping-insurance-html
- region-selector → us-en-global-html
- canon back-port candidates: home logo_shield header variant; base sup rule (index.css .page-main sup)
- canon back-port candidates (listing): gb footer 3/6/3 split (body.locale-gb); plain-text breadcrumb item 14px/1.42 grey
- canon back-port candidates (legal): breadcrumb current item span rule; canon a:hover underline not on live for plain body links
- canon back-port candidates (locale-home): DE footer wide column 50% (body.locale-de); hidden empty alerts block in DE header; story-card + secondary-promo rules copied from program css. Gate pin for autoplay carousels: --dismiss '.cmp-carousel__indicator:first-child'
- canon back-port candidates (form): breadcrumb span (3rd use); pathways card rules (from index.css); .teaser-extra 14px grey. Contact form = static non-submitting iframe us-en-about-contact-us-html-form.html (logic → dynamics)
- canon back-port candidate (region-selector): logo-only header variant .hdr--logo-only
- gate-all cannot pin autoplay carousels: de-en-home-html at 360 needs the documented overrides.json entry (capture-state) in every gate-all out dir (prototypes-360 has it; add the same to all-360 at the published stage)
- rollout inventory.mjs needs --state stardust/.work/rollout/state-with-representative.json (adds per-page archetype); rollout.json da.site field
