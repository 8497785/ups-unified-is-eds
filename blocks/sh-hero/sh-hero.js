/**
 * sh-hero — shipping-hub hero: headline, lead and CTA beside the premium calculator card,
 * plus the floating "quote" dock that appears once the calculator is scrolled past.
 * Decode tier: template-slotted (authored nodes are MOVED into the prototype's slots).
 *
 * Authoring rows (classified by content, any order):
 *   head row        — <h1> (accent run in <em>, popover terms in <strong>, line breaks <br>),
 *                     lead <p>, CTA <p><em><a></p>
 *   calculator row  — <h2> title; <p> package-value readout ("$100 to $1,000"); <p> result label;
 *                     <p> premium figure ("$0.80 to $10.50"); CTA <p><strong><a></p>; <p> note
 *   dock row        — <p><a> floating quote link
 *
 * @ew-exempt calculator chrome — histogram bars, slider handles, handle values (derived from the
 *   authored readout), screen-reader help and layout reserve strings are generated UI
 */

const SVG = {
  arrow: '<svg class="sh-icon" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M686-450H190q-13 0-21.5-8.5T160-480q0-13 8.5-21.5T190-510h496L459-737q-9-9-9-21t9-21q9-9 21-9t21 9l278 278q5 5 7 10t2 11q0 6-2 11t-7 10L501-181q-9 9-21 9t-21-9q-9-9-9-21t9-21l227-227Z"/></svg>',
  info: '<svg class="sh-icon sh-icon-16" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M504.5-288.63q8.5-8.62 8.5-21.37v-180q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v180q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63 12.82 0 21.32-8.63Zm-1-314.57q9.5-9.2 9.5-22.8 0-14.45-9.48-24.22-9.48-9.78-23.5-9.78t-23.52 9.78Q447-640.45 447-626q0 13.6 9.48 22.8 9.48 9.2 23.5 9.2t23.52-9.2ZM480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg>',
  shield: '<svg class="sh-icon" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M470.12-85q-4.56-1-9.12-3-139-47-220-168.5t-81-266.61V-719q0-19.26 10.88-34.66Q181.75-769.07 199-776l260-97q11-4 21-4t21 4l260 97q17.25 6.93 28.13 22.34Q800-738.26 800-719v195.89Q800-378 719-256.5T499-88q-4.56 2-9.12 3T480-84q-5.32 0-9.88-1Zm9.88-58q115-38 187.5-143.5T740-523v-196l-260-98-260 98v196q0 131 72.5 236.5T480-143Zm0-337Z"/></svg>',
};
const HISTOGRAM = [
  0.0909, 0.1364, 0.1818, 0.2273, 0.2727, 0.3182, 0.3636, 0.4091, 0.4545, 0.5,
  0.5455, 0.5909, 0.6364, 0.6818, 0.7273, 0.7727, 0.8182, 0.8636, 0.9091, 0.9545, 1,
];
/* initial calculator state captured from the source (stops 1 and 8 of 0–20) */
const RANGE = { min: 1, max: 8, stops: 20 };
const RESERVE = { readout: '$50,000 to $50,000+', figure: '$400.00 to $525.00+' };
const HELP = 'Handles can pass one another. Drag the selected band to move the whole range. '
  + 'Focus it and use arrow keys, Page Up or Page Down, Home or End.';

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  });
  children.flat().filter(Boolean).forEach((c) => node.append(c));
  return node;
}
function wrapNode(node, className) {
  return el('div', { class: className }, node);
}
// Read-only classification helper (never used to produce displayed text).
const text = (node) => (node ? node.textContent.trim() : '');
const isMoney = (p) => /\$\s?\d/.test(text(p));

function ctaParagraph(p, variant) {
  const a = p.querySelector('a');
  if (a) {
    a.classList.add('sh-btn', `sh-btn-${variant}`);
    if (variant === 'primary') a.append(el('span', { class: 'sh-btn-icon', 'aria-hidden': 'true', html: SVG.arrow }));
  }
  return p;
}

function buildSlider(readout) {
  const [lo, hi] = text(readout).split(/\s+to\s+/);
  const start = RANGE.min / RANGE.stops;
  const end = RANGE.max / RANGE.stops;
  const thumb = (label, value, valueText, pos) => el(
    'div',
    { class: 'sh-slider-group', role: 'group', 'aria-label': 'Package value' },
    el(
      'div',
      { class: 'sh-slider-thumb', style: `left:${pos * 100}%` },
      el('input', {
        type: 'range',
        'aria-label': label,
        min: '0',
        max: String(RANGE.stops),
        step: '1',
        value: String(value),
        'aria-valuetext': valueText || '',
        'aria-describedby': 'sh-pv-help',
      }),
      el('span', { class: 'sh-slider-value', 'aria-hidden': 'true' }, valueText || ''),
    ),
  );
  const output = el('output', { class: 'sh-slider-readout' });
  output.append(el('span', { class: 'sh-reserve', 'aria-hidden': 'true' }, RESERVE.readout));
  if (readout) output.append(readout);
  return el(
    'div',
    { class: 'sh-slider', role: 'group', 'aria-labelledby': 'sh-pv-label' },
    el('div', { class: 'sh-slider-head' }, el('span', { class: 'sh-sr', id: 'sh-pv-label' }, 'Package value'), output),
    el('span', { class: 'sh-sr', id: 'sh-pv-help' }, HELP),
    el(
      'div',
      { class: 'sh-slider-track', style: `--rs-start:${start};--rs-end:${end}` },
      el('span', { class: 'sh-slider-rail sh-slider-rail-start', 'aria-hidden': 'true' }),
      el('span', { class: 'sh-slider-rail sh-slider-rail-end', 'aria-hidden': 'true' }),
      el('button', {
        class: 'sh-slider-fill',
        type: 'button',
        'aria-label': `Move entire package value range: ${text(readout)}`,
        'aria-describedby': 'sh-pv-help',
      }),
      thumb('Minimum', RANGE.min, lo, start),
      thumb('Maximum', RANGE.max, hi, end),
    ),
  );
}

function buildCalculator(cell) {
  const title = cell.querySelector('h2, h3');
  const ps = [...cell.querySelectorAll('p')];
  const cta = ps.find((p) => p.querySelector('a'));
  const plain = ps.filter((p) => p !== cta);
  const money = plain.filter(isMoney);
  const words = plain.filter((p) => !isMoney(p));
  const [readout, figure] = money;
  const label = words.length > 1 ? words[0] : null;
  const note = words.length ? words[words.length - 1] : null;
  if (title) title.id = title.id || 'sh-calc-title';

  const histogram = el('div', { class: 'sh-histogram', 'aria-hidden': 'true' });
  HISTOGRAM.forEach((h, i) => {
    const bar = el('span', { style: `--rh-h:${h}` });
    if (i >= RANGE.min && i <= RANGE.max) bar.setAttribute('data-in-range', '');
    histogram.append(bar);
  });
  const figureBox = el('div', { class: 'sh-calc-figure' }, el('span', { class: 'sh-reserve', 'aria-hidden': 'true' }, RESERVE.figure));
  if (figure) figureBox.append(figure);
  const result = el('div', { class: 'sh-calc-result', role: 'group' }, label && wrapNode(label, 'sh-calc-label'), figureBox);
  const body = el(
    'div',
    { class: 'sh-calc-body' },
    title && wrapNode(title, 'sh-calc-title'),
    el(
      'div',
      { class: 'sh-calc-equation' },
      el('div', { class: 'sh-calc-term' }, histogram, buildSlider(readout)),
      el('div', { class: 'sh-calc-outcome' }, result, cta && el('div', {}, ctaParagraph(cta, 'primary'))),
    ),
    el('span', { class: 'sh-sr', 'aria-live': 'polite' }),
    note && el('div', { class: 'sh-calc-note', html: SVG.info }, note),
  );
  const calc = el(
    'section',
    { class: 'sh-calc' },
    el(
      'div',
      { class: 'sh-raised sh-raised-3' },
      el('span', { class: 'sh-raised-shadow', 'aria-hidden': 'true' }),
      el('div', { class: 'sh-raised-surface' }, body),
    ),
  );
  if (title) calc.setAttribute('aria-labelledby', title.id);
  return calc;
}

function buildDock(p) {
  const a = p.querySelector('a');
  if (a) {
    a.classList.add('sh-dock-btn');
    a.insertAdjacentHTML('afterbegin', SVG.shield);
    a.append(el('span', { class: 'sh-dock-pulse', 'aria-hidden': 'true' }));
  }
  const dock = el(
    'aside',
    { class: 'sh-dock', inert: '', 'aria-hidden': 'true' },
    el('div', { class: 'sh-raised sh-raised-4' }, el('span', { class: 'sh-raised-shadow', 'aria-hidden': 'true' }), p),
  );
  if (a) dock.setAttribute('aria-label', text(a));
  return dock;
}

function watchDock(dock, calc) {
  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver(([entry]) => {
    const past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    if (past) {
      dock.setAttribute('data-visible', '');
      dock.removeAttribute('inert');
      dock.removeAttribute('aria-hidden');
    } else {
      dock.removeAttribute('data-visible');
      dock.setAttribute('inert', '');
      dock.setAttribute('aria-hidden', 'true');
    }
  }).observe(calc);
}

export default function decorate(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);
  const headCell = cells.find((c) => c.querySelector('h1'));
  const calcCell = cells.find((c) => c !== headCell && c.querySelector('h2, h3'));
  const dockCell = cells.find((c) => c !== headCell && c !== calcCell && c.querySelector('a'));

  const head = el('div', { class: 'sh-hero-head' });
  if (headCell) {
    const h1 = headCell.querySelector('h1');
    const ps = [...headCell.querySelectorAll('p')];
    const ctas = ps.filter((p) => p.querySelector('a'));
    const lead = ps.find((p) => !p.querySelector('a'));
    head.append(wrapNode(h1, 'sh-hero-title'));
    if (lead) head.append(wrapNode(lead, 'sh-hero-lead'));
    if (ctas.length) head.append(el('div', { class: 'sh-hero-actions' }, ctas.map((p) => ctaParagraph(p, 'secondary'))));
  }
  const aside = el('div', { class: 'sh-hero-aside' }, el('div', { class: 'sh-pattern sh-hero-field', 'aria-hidden': 'true' }));
  const calc = calcCell ? buildCalculator(calcCell) : null;
  if (calc) aside.append(calc);
  const dockP = dockCell ? dockCell.querySelector('a').closest('p') || dockCell : null;
  const dock = dockP ? buildDock(dockP) : null;

  block.replaceChildren(
    el('div', { class: 'sh-pattern', 'aria-hidden': 'true' }),
    el('div', { class: 'sh-hero-inner' }, el('div', { class: 'sh-hero-band', 'aria-hidden': 'true' }), head, aside),
  );
  if (dock) {
    block.append(dock);
    if (calc) watchDock(dock, calc);
  }
}
