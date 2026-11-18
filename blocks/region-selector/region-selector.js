/**
 * region-selector — "Select a Region" world map + region accordion of locale links
 * (source: language selector #ups-langSelect on /us/en/global).
 *
 * Authoring (rows; the block queries content, never row indices):
 *   - heading: the page <h1> (any row) — drawn with the teal rule under it
 *   - one row per region: | region name | list of locale links |
 *     (a row holding a list or links; its name is the row's first link-free text)
 * The map is a decorative asset (blocks/region-selector/map.svg, inlined so its regions can
 * be highlighted); a region row lights the map group whose data-region equals its name
 * (lower case: "europe", "north america"). Regions without a map group still work.
 * Behaviour (observed on the live page): click / Enter / Space on a toggle opens its links
 * (.ups-active on item, toggle and map region; others close; again closes); hovering a toggle
 * adds .ups-mousein to it and its map region; clicking a map region toggles its item.
 * Decode tier: reconstructive (repeat group); authored nodes are MOVED, never cloned.
 * Re-entrant: a decorated block (`.region-selector-row` present) is left as is.
 */

function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

function readRegion(row) {
  const list = row.querySelector('ul, ol');
  const links = list ? null : [...row.querySelectorAll('a')];
  if (!list && !links.length) return null;
  const named = (n) => !n.querySelector('a, ul, ol') && n.textContent.trim()
    && !/^(UL|OL|LI|A)$/.test(n.tagName);
  // a paragraph / heading in a cell first; a bare-text cell (harness) second
  const nameEl = [...row.querySelectorAll(':scope > div > *')].find(named)
    || [...row.querySelectorAll(':scope > div')].find(named);
  let ul = list;
  if (!ul) {
    ul = document.createElement('ul');
    links.forEach((a) => { const li = document.createElement('li'); li.append(a); ul.append(li); });
  }
  return { nameEl, ul };
}

async function loadMap(holder) {
  try {
    const base = (window.hlx && window.hlx.codeBasePath) || '';
    const resp = await fetch(`${base}/blocks/region-selector/map.svg`);
    if (!resp.ok) return null;
    holder.innerHTML = await resp.text();
    const svg = holder.querySelector('svg');
    if (svg) {
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
    }
    return svg;
  } catch (e) {
    return null;
  }
}

export default async function decorate(block) {
  if (block.querySelector('.region-selector-row')) return;
  const rows = [...block.children];
  const heading = block.querySelector('h1, h2, h3');
  const regions = rows.map(readRegion).filter(Boolean);

  const row = el('div', 'row region-selector-row');
  const mapCol = el('div', 'region-selector-map-col');
  const accCol = el('div', 'region-selector-acc-col');
  const acc = el('div', 'region-selector-acc');
  const map = el('div', 'region-selector-map');
  if (heading) {
    heading.classList.add('region-selector-title');
    mapCol.append(heading);
  }
  mapCol.append(map);
  accCol.append(acc);
  row.append(mapCol, accCol);

  const pairs = regions.map(({ nameEl, ul }, i) => {
    const id = `ups-imagemap${i}`;
    const item = el('div', 'region-selector-item');
    // the authored name paragraph (or the bare-text cell the pipeline delivers for a lone
    // paragraph) IS the heading row — moved, never rebuilt (EW1)
    const head = nameEl || el('div');
    head.classList.add('region-selector-head');
    head.setAttribute('role', 'heading');
    head.setAttribute('aria-level', '2');
    const toggle = el('a', 'region-selector-toggle', {
      id, role: 'button', tabindex: '0', 'aria-expanded': 'false', 'aria-controls': `${id}_links`,
    });
    if (nameEl) toggle.append(...nameEl.childNodes);
    toggle.append(' ', el('span', 'upspr-icon-chevrondown', { 'aria-hidden': 'true' }));
    head.append(toggle);
    ul.classList.add('region-selector-links');
    Object.entries({ id: `${id}_links`, role: 'region', 'aria-labelledby': id })
      .forEach(([k, v]) => ul.setAttribute(k, v));
    item.append(head, ul);
    acc.append(item);
    return {
      item, toggle, key: toggle.textContent.trim().toLowerCase(), region: null,
    };
  });

  block.replaceChildren(row);

  const setOpen = (pair, open) => {
    pair.item.classList.toggle('ups-active', open);
    pair.toggle.classList.toggle('ups-active', open);
    pair.toggle.setAttribute('aria-expanded', String(open));
    if (pair.region) pair.region.classList.toggle('ups-active', open);
  };
  const activate = (pair) => {
    const open = !pair.item.classList.contains('ups-active');
    pairs.forEach((p) => { if (p !== pair) setOpen(p, false); });
    setOpen(pair, open);
  };
  const hover = (pair, on) => {
    pair.toggle.classList.toggle('ups-mousein', on);
    if (pair.region) pair.region.classList.toggle('ups-mousein', on);
  };
  pairs.forEach((pair) => {
    pair.toggle.addEventListener('click', (e) => { e.preventDefault(); activate(pair); });
    pair.toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(pair); }
    });
    pair.toggle.addEventListener('mouseenter', () => hover(pair, true));
    pair.toggle.addEventListener('mouseleave', () => hover(pair, false));
  });

  const svg = await loadMap(map);
  if (!svg) return;
  pairs.forEach((pair) => {
    pair.region = [...svg.querySelectorAll('g[data-region]')]
      .find((g) => g.dataset.region === pair.key) || null;
    if (!pair.region) return;
    pair.region.addEventListener('click', () => activate(pair));
    if (pair.item.classList.contains('ups-active')) pair.region.classList.add('ups-active');
  });
}
