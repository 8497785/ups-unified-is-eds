/**
 * story-card-grid — grid of story / resource cards with "Load More" (source: story-card
 * withLoadmore).
 *
 * Decode tier: reconstructive (cards are the repeat group). One card per row (preferred); a
 * flattened single cell is segmented on the card title.
 * Per card, authored in order:
 *   - the image: <picture>/<img> (editorial)
 *   - eyebrow: a short link-free <p> BEFORE the heading
 *   - title: <h3><strong>…</strong></h3> (the source's bold card heading); a <p> holding
 *     only <strong> text is accepted too
 *   - text: link-free <p>s after the heading
 *   - the card link: <p><a href="…">Read More</a></p> — the whole card becomes the link (EW6:
 *     the authored anchor is unwrapped, its label stays as the card's "Read More" line)
 * Load-more control: a last row holding only a link, e.g. <p><strong><a href="#load-more">Load
 * More</a></strong></p>. Cards show 3 at a time; each click reveals the next 3 and the control
 * hides once every card is shown. Without that row every card is shown.
 * Variant `initial-<n>`: n cards at rest (source resource hubs: `initial-6`), then 3 per click.
 * Section head (h2 + lede) is DEFAULT CONTENT before the block, styled in place.
 */

const STEP = 3;

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function addChevron(el) {
  if (el.querySelector('.upspr-icon-chevronright')) return;
  const icon = document.createElement('span');
  icon.className = 'upspr-icon-chevronright';
  icon.setAttribute('aria-hidden', 'true');
  el.append(icon);
}

function expand(cell) {
  const kids = [...cell.children];
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].querySelector('picture, img')) {
    return [...kids[0].children];
  }
  return kids;
}

const isHeading = (n) => /^H[1-6]$/.test(n.tagName) || (n.tagName === 'P'
  && !n.querySelector('a') && n.querySelector('strong, b') && n.textContent.trim()
  === [...n.querySelectorAll('strong, b')].map((s) => s.textContent).join('').trim());

/** → { groups: Node[][], more: <p> | null } */
function parse(block) {
  const rows = [...block.children].map((r) => [...r.children].flatMap(expand));
  let more = null;
  const last = rows[rows.length - 1];
  if (rows.length > 1 && last && !last.some((n) => isHeading(n) || n.querySelector('picture, img')
    || n.matches('picture, img'))) {
    const links = last.filter((n) => n.tagName === 'P' && n.querySelector('a'));
    if (links.length === 1) {
      [more] = links;
      rows.pop();
    }
  }
  const cardRows = rows.filter((r) => r.some(isHeading));
  if (cardRows.length > 1 || rows.length > 1) return { groups: rows, more };
  // flattened single cell: segment on the card heading, buffering what precedes it
  const nodes = rows.flat();
  const groups = [];
  let pending = [];
  nodes.forEach((n) => {
    if (isHeading(n)) {
      groups.push([...pending, n]);
      pending = [];
    } else if (n.matches('picture, img') || n.querySelector('picture, img')
      || (groups.length && groups[groups.length - 1].some((m) => m.tagName === 'P'
        && m.querySelector('a')))) {
      pending.push(n);
    } else if (groups.length) {
      groups[groups.length - 1].push(n);
    } else {
      pending.push(n);
    }
  });
  if (pending.length) {
    if (groups.length) groups[groups.length - 1].push(...pending);
    else groups.push(pending);
  }
  return { groups, more };
}

function buildCard(nodes) {
  const media = nodes.map((n) => (n.matches('picture, img') ? n : n.querySelector('picture, img')))
    .find(Boolean);
  const heading = nodes.find(isHeading);
  const headIdx = heading ? nodes.indexOf(heading) : -1;
  const linkP = nodes.find((n) => n.tagName === 'P' && n.querySelector('a'));
  const anchor = linkP ? linkP.querySelector('a') : null;

  const card = document.createElement(anchor ? 'a' : 'div');
  card.className = 'story-card-grid-card';
  if (anchor) {
    card.href = anchor.getAttribute('href');
    if (anchor.title && anchor.title !== anchor.textContent) card.title = anchor.title;
  }
  if (media) card.append(wrapNode(media.closest('picture') || media, 'story-card-grid-image'));
  const body = document.createElement('div');
  body.className = 'story-card-grid-body';
  const top = document.createElement('div');
  top.className = 'story-card-grid-top';
  nodes.forEach((n, i) => {
    if (n === linkP || (media && (n === media || n.contains(media)))) return;
    if (n === heading) top.append(wrapNode(n, 'story-card-grid-title'));
    else if (i < headIdx && n.tagName === 'P') top.append(wrapNode(n, 'story-card-grid-eyebrow'));
    else if (n.textContent.trim()) top.append(wrapNode(n, 'story-card-grid-text'));
  });
  body.append(top);
  if (linkP) {
    const cta = document.createElement('div');
    cta.className = 'story-card-grid-cta';
    linkP.classList.remove('button-wrapper');
    cta.append(linkP);
    anchor.replaceWith(...anchor.childNodes);
    addChevron(linkP);
    body.append(cta);
  }
  card.append(body);
  return card;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .story-card-grid-list')) return;
  const { groups, more } = parse(block);
  const list = document.createElement('div');
  list.className = 'story-card-grid-list';
  const items = groups.filter((g) => g.some((n) => n.textContent.trim()))
    .map((g) => wrapNode(buildCard(g), 'story-card-grid-item'));
  list.append(...items);
  block.replaceChildren(list);
  if (!more) return;

  const moreBox = document.createElement('div');
  moreBox.className = 'story-card-grid-more';
  moreBox.append(more);
  block.append(moreBox);
  const initial = Number((block.className.match(/\binitial-(\d+)\b/) || [])[1]) || STEP;
  items.forEach((it, i) => { it.hidden = i >= initial; });
  const sync = () => { moreBox.hidden = items.every((it) => !it.hidden); };
  more.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    items.filter((it) => it.hidden).slice(0, STEP).forEach((it) => { it.hidden = false; });
    sync();
  });
  sync();
}
