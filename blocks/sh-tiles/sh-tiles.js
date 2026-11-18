/**
 * sh-tiles — shipping-hub tile grid. One row per tile; the section head is default content
 * before the block and is reabsorbed (a grid cell for the default variant, an intro above
 * the grid for the others).
 * Decode tier: reconstructive (tiles classified by content, never by row index).
 *
 * Authoring rows (one per tile): <img> | [eyebrow <p>] <h3> (optionally linked),
 *   [stat <p> led by <strong>], body <p>, [tag <ul>], [cue <p> — the visible link cue]
 *
 * @variants block class: solutions | stories (default stand-out grid with stats)
 */

const SVG = {
  cue: '<svg class="sh-icon sh-icon-16 sh-tile-cue-icon" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M686-450H190q-13 0-21.5-8.5T160-480q0-13 8.5-21.5T190-510h496L459-737q-9-9-9-21t9-21q9-9 21-9t21 9l278 278q5 5 7 10t2 11q0 6-2 11t-7 10L501-181q-9 9-21 9t-21-9q-9-9-9-21t9-21l227-227Z"/></svg>',
};

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
// Wrap the authored element's own content in a presentational span (inner refinement only).
function fillSpan(node) {
  const span = el('span', { class: 'sh-fill' });
  while (node.firstChild) span.append(node.firstChild);
  node.append(span);
  return node;
}

function takeSectionHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return null;
  const head = {
    heading: prev.querySelector('h2, h3'),
    lead: [...prev.querySelectorAll('p')].find((p) => !p.querySelector('a')),
    actions: [...prev.querySelectorAll('p')].filter((p) => p.querySelector('a')),
  };
  return { prev, ...head };
}

function buildTile(row, variant) {
  const pic = row.querySelector('picture') || row.querySelector('img');
  const picPara = pic ? pic.closest('p') : null;
  const nodes = [...row.querySelectorAll(':scope > div > *')].filter((n) => n !== picPara && !n.contains(pic));
  const heading = nodes.find((n) => /^H[2-6]$/.test(n.tagName));
  const hIndex = nodes.indexOf(heading);
  const link = heading ? heading.querySelector('a') : null;
  const tile = el('li', { class: 'sh-tile' });
  if (variant === 'default') tile.classList.add('sh-standout-tile');
  if (link) {
    tile.setAttribute('data-actionable', 'true');
    tile.setAttribute('data-ground', variant === 'stories' ? 'blue' : 'teal');
  }

  if (pic) {
    let holder;
    if (variant === 'stories') holder = el('div', { class: 'sh-photo' }, pic);
    else if (variant === 'solutions') holder = el('div', { class: 'sh-tile-fill' }, pic);
    else holder = el('div', { class: 'sh-art43' }, pic);
    const media = el('div', { class: 'sh-tile-media' }, el('div', { class: 'sh-tile-media-inner' }, holder));
    if (variant === 'stories') media.classList.add('sh-tile-media-43');
    tile.append(media);
    if (picPara && !picPara.textContent.trim()) picPara.remove();
  }
  let body = null;
  const extras = [];
  nodes.forEach((n, i) => {
    if (n === heading) return;
    if (i < hIndex && n.tagName === 'P') {
      tile.append(wrapNode(n, 'sh-tile-eyebrow'));
    } else if (n.tagName === 'UL' || n.tagName === 'OL') {
      n.classList.add('sh-tags');
      extras.push(el('div', { class: 'sh-tile-extra' }, n));
    } else if (n.tagName === 'P' && n.firstElementChild && n.firstElementChild.tagName === 'STRONG'
      && !body) {
      extras.push(wrapNode(n, 'sh-tile-stat'));
    } else if (!body) {
      body = wrapNode(n, 'sh-tile-body');
      extras.push(body);
    } else if (link) {
      const cue = el('div', { class: 'sh-tile-cue', 'aria-hidden': 'true' }, n);
      cue.insertAdjacentHTML('beforeend', SVG.cue);
      extras.push(el('div', { class: 'sh-tile-foot' }, cue));
    } else {
      extras.push(wrapNode(n, 'sh-tile-body'));
    }
  });
  if (heading) {
    const title = wrapNode(heading, 'sh-tile-title');
    // keep the eyebrow above the title: insert the title after any eyebrow already appended
    tile.append(title);
  }
  // stand-out tiles show the stat before the body (subgrid rows 3 and 4)
  extras.sort((a, b) => {
    const rank = (x) => ['sh-tile-stat', 'sh-tile-body', 'sh-tile-extra', 'sh-tile-foot']
      .indexOf(x.className);
    return rank(a) - rank(b);
  });
  tile.append(...extras);
  return tile;
}

export default function decorate(block) {
  let variant = 'default';
  if (block.classList.contains('solutions')) variant = 'solutions';
  if (block.classList.contains('stories')) variant = 'stories';
  const head = takeSectionHead(block);
  const tiles = [...block.children].map((row) => buildTile(row, variant));

  const container = el('div', { class: 'sh-container' });
  if (variant === 'default') {
    const grid = el('div', { class: 'sh-grid sh-standout', 'data-columns': '4' });
    if (head && head.heading) {
      grid.append(el('div', { class: 'sh-grid-intro' }, wrapNode(head.heading, 'sh-grid-title')));
    }
    grid.append(el('ul', { class: 'sh-grid-contents' }, tiles));
    container.append(grid);
  } else {
    if (head && head.heading) {
      const intro = el('div', { class: 'sh-intro sh-intro-page sh-backfill' });
      intro.append(wrapNode(fillSpan(head.heading), 'sh-intro-title'));
      if (head.lead) intro.append(wrapNode(fillSpan(head.lead), 'sh-intro-lead'));
      if (head.actions.length) {
        head.actions.forEach((p) => {
          const a = p.querySelector('a');
          a.classList.add('sh-link');
          const label = el('span', { class: 'sh-link-text' });
          while (a.firstChild) label.append(a.firstChild);
          a.append(label);
        });
        intro.append(el('div', { class: 'sh-intro-actions' }, head.actions));
      }
      container.append(intro);
    }
    const cols = variant === 'solutions' ? '2' : '4';
    container.append(el('ul', { class: 'sh-grid', 'data-columns': cols }, tiles));
  }
  if (head && head.prev && !head.prev.querySelector('h1, h2, h3, h4, p, ul, picture')) head.prev.remove();
  block.replaceChildren(container);
}
