/**
 * roi-calculator — Address Confidence savings calculator (source: roiCalculator molecule,
 * delivery-defense pages). Recreates the source form: intro, two inputs, threshold slider,
 * threshold bands (table ≥1024, current band under the slider below), hidden results,
 * hidden error line, "Calculate Savings" button.
 *
 * Authoring (rows are recognised by content, any order, any may be missing):
 *   - heading + paragraphs: the title and the instructions
 *   - two short cells: the input labels (Annual Orders | Average Order Value)
 *   - three short cells: Low Confidence | Threshold: | High Confidence
 *   - "<from>-<to>" | band text (one row per score band, e.g. 100-299)
 *   - cells with an icon image + label: the result tiles (hidden until a calculation)
 *   - a paragraph starting with "*": the results footnote
 *   - an h3: the error line (hidden until a failed calculation)
 *   - one short paragraph: the button label
 *   - paragraphs / a link after the button: the value-simulation text (4 blank lines if absent)
 * @variants block class: blank-<n> — n blank lines after the value-simulation text (source)
 * The source posts to an AEM ROI service that is not available here; the button shows the
 * error line (dynamics hand-off).
 * Decode tier: template-slotted.
 */

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

const BAND = /^(\d+)\s*[-–]\s*(\d+)$/;

function buildInput(label, id) {
  const wrap = el('div', 'roi-calculator-field');
  const input = el('input');
  input.type = 'text';
  input.id = id;
  input.name = id;
  input.placeholder = ' ';
  input.autocomplete = 'off';
  input.inputMode = 'decimal';
  input.required = true;
  const lab = el('label', '', label);
  lab.htmlFor = id;
  wrap.append(input, lab);
  return wrap;
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const intro = [];
  let inputs = [];
  let confidence = [];
  const bands = [];
  const results = [];
  let footnote = null;
  let error = null;
  let buttonLabel = '';
  let simulationRow = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    const texts = cells.map((c) => c.textContent.trim());
    const band = cells.length > 1 && texts[0].match(BAND);
    if (band) {
      bands.push({
        from: +band[1], to: +band[2], label: texts[0], nodes: [...cells[1].children],
      });
    } else if (row.querySelector('h2')) {
      cells.forEach((c) => intro.push(...c.children));
    } else if (row.querySelector('h3')) {
      error = row.querySelector('h3');
    } else if (row.querySelector('img')) {
      cells.forEach((c) => results.push(c));
    } else if (cells.length === 2) {
      inputs = texts;
    } else if (cells.length === 3) {
      confidence = texts;
    } else if (texts[0].startsWith('*')) {
      [footnote] = cells;
    } else if (row.querySelector('a') || row.querySelectorAll('p').length > 1) {
      [simulationRow] = cells;
    } else if (texts[0]) {
      [buttonLabel] = texts;
    }
  });

  const min = bands.length ? bands[0].from : 100;
  const max = bands.length ? bands[bands.length - 1].to : 1000;
  let value = bands.length ? bands[bands.length - 1].from : 900;

  const form = el('form', 'roi-calculator-form');
  form.noValidate = true;

  // title + instructions
  const title = el('div', 'roi-calculator-title');
  const h2 = intro.find((n) => n.tagName === 'H2');
  if (h2) title.append(h2);
  const instructions = el('div', 'roi-calculator-instructions');
  intro.filter((n) => n !== h2).forEach((n, i) => {
    instructions.append(n);
    // source: an intro sentence ending in ':' is followed by one blank line
    if (i === 0 && /:\s*$/.test(n.textContent)) {
      instructions.append(el('p', 'roi-calculator-spacer', '\u00a0'));
    }
  });
  if (instructions.children.length) title.append(instructions);

  // inputs
  const fields = el('div', 'roi-calculator-inputs');
  inputs.forEach((label, i) => fields.append(buildInput(label, i ? 'roi-average' : 'roi-orders')));

  // slider
  const details = el('div', 'roi-calculator-slider');
  const conf = el('div', 'roi-calculator-confidence');
  const [low = '', thresholdLabel = 'Threshold:', high = ''] = confidence;
  const thresholdValue = el('span', 'roi-calculator-threshold-value', String(value));
  const threshold = el('span', 'roi-calculator-threshold', `${thresholdLabel} `);
  threshold.append(thresholdValue);
  conf.append(el('span', '', low), threshold, el('span', '', high));

  const track = el('div', 'roi-calculator-track');
  const range = el('div', 'roi-calculator-range');
  const handle = el('span', 'roi-calculator-handle');
  handle.tabIndex = 0;
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', thresholdLabel.replace(/:$/, ''));
  handle.setAttribute('aria-valuemin', min);
  handle.setAttribute('aria-valuemax', max);
  track.append(range, handle);

  const values = el('div', 'roi-calculator-values');
  const current = el('div', 'roi-calculator-current');
  values.append(el('span', '', String(min)), current, el('span', '', String(max)));
  details.append(conf, track, values);

  // band table
  const table = el('div', 'roi-calculator-bands');
  bands.forEach((b) => {
    const item = el('div', 'roi-calculator-band');
    const body = el('div', 'roi-calculator-band-body');
    body.append(...b.nodes);
    item.append(el('div', 'roi-calculator-band-head', b.label), body);
    table.append(item);
  });

  const update = (v) => {
    value = Math.min(max, Math.max(min, Math.round(v)));
    const pct = ((value - min) / (max - min || 1)) * 100;
    range.style.width = `${pct}%`;
    handle.style.left = `${pct}%`;
    handle.setAttribute('aria-valuenow', value);
    thresholdValue.textContent = value;
    const b = bands.find((x) => value >= x.from && value <= x.to) || bands[bands.length - 1];
    current.replaceChildren();
    if (b) b.nodes.forEach((n) => current.append(n.cloneNode(true)));
  };
  update(value);

  const fromPointer = (e) => {
    const r = track.getBoundingClientRect();
    update(min + ((e.clientX - r.left) / r.width) * (max - min));
  };
  track.addEventListener('pointerdown', (e) => {
    track.setPointerCapture(e.pointerId);
    fromPointer(e);
    const move = (ev) => fromPointer(ev);
    const up = () => {
      track.removeEventListener('pointermove', move);
      track.removeEventListener('pointerup', up);
    };
    track.addEventListener('pointermove', move);
    track.addEventListener('pointerup', up);
  });
  handle.addEventListener('keydown', (e) => {
    const step = {
      ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1,
    }[e.key];
    if (step) {
      e.preventDefault();
      update(value + step);
    }
  });

  // results (hidden until a calculation) + error + button
  const resultsWrap = el('div', 'roi-calculator-results');
  if (results.length) {
    const tiles = el('div', 'roi-calculator-tiles');
    results.forEach((cell) => {
      const tile = el('div', 'roi-calculator-tile');
      tile.append(...cell.children);
      tiles.append(tile);
    });
    resultsWrap.append(tiles);
  }
  if (footnote) {
    footnote.className = 'roi-calculator-footnote';
    resultsWrap.append(footnote);
  }
  if (error) error.className = 'roi-calculator-error';

  const btnWrap = el('div', 'roi-calculator-action');
  const btn = el('button', 'roi-calculator-button', buttonLabel || 'Calculate Savings');
  btn.type = 'submit';
  btn.append(el('span', 'upspr-icon-chevronright'));
  btnWrap.append(btn);

  const simulation = el('div', 'roi-calculator-simulation');
  // the source closes the simulation box with blank lines (&nbsp; paragraphs, which the content
  // pipeline drops): 4 when it has no text, else the count of the block class `blank-<n>`
  if (simulationRow) simulation.append(...simulationRow.children);
  const pad = [...block.classList].map((c) => c.match(/^blank-(\d)$/)).find(Boolean);
  let blanks = simulationRow ? 0 : 4;
  if (pad) blanks = +pad[1];
  for (let i = 0; i < blanks; i += 1) simulation.append(el('p', '', '\u00a0'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (error) error.classList.add('is-visible');
  });

  form.append(fields, details, table, resultsWrap);
  if (error) form.append(error);
  form.append(btnWrap, simulation);
  block.replaceChildren(title, form);
}
