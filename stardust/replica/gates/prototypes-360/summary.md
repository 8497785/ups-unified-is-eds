# Prototype gate — every crafted prototype, 360px

2026-11-17T22:31:02.615Z · **8 PASS / 1 FAIL / 0 error of 9** (+1 documented override → 9 delivered)

Verdict: overlap pixel % ≤ 10 AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance)

Calibration — pixel-only verdict (criteria 1+2): **8 PASS**; full verdict (1–4): **8 PASS**. Failing by criterion: pixel 1, height 0, clip 0, content 0; content n/a (origin not probed) 0.
| page | template | tier | origin | browser | pixel % (text %) | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/us-en-customer-communications-html-proposed.html` | - | - | stitch-live | chrome | 0 | 0 | 0 | n/a | - | PASS | - |
| `/us-en-legal-terms-and-conditions-upscia-html-proposed.html` | - | - | stitch-live | chrome | 0 | 0 | 0 | n/a | - | PASS | - |
| `/us-en-global-html-proposed.html` | - | - | stitch-live | chrome | 0.04 | 0 | 0 | n/a | - | PASS | - |
| `/index-proposed.html` | - | - | stitch-live | chrome | 0.1 | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/us-en-about-contact-us-html-proposed.html` | - | - | stitch-live | chrome | 0.41 | 0 | 0 | n/a | off 12 hidden 0 missing 3 (advisory) | PASS | - |
| `/us-en-shipping-insurance-html-proposed.html` | - | - | stitch-live | chrome | 1.2 | 0 | 0 | n/a | - | PASS | - |
| `/gb-en-resources-html-proposed.html` | - | - | stitch-live | chrome | 1.39 | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/us-en-shipping-insurance-b2b-html-proposed.html` | - | - | stitch-live | chrome | 2 | 1 | 0 | n/a | - | PASS | - |
| `/de-en-home-html-proposed.html` | - | - | stitch-live | chrome | 21.14 | 97 | 0 | n/a | - | FAIL → PASS: capture-state: live testimonial carousel autoplays (5 s) and is on a later, shorter slide by capture time; gate.sh round with the slide pinned to 1 on both sides (--dismiss .cmp-carousel__indicator:first-child) measures 2.06% Δh +1 — stardust/replica/gates/de-en-home-html-360/, progress.json types.locale-home.gates.360 | pixel 21.14% > 10% |
