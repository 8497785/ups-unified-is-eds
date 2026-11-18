/**
 * story-card-carousel — story cards (image, eyebrow, title, text, "Read More" link), whole card
 * clickable; slick-style carousel: 3 per view from 992, 2 at 768-991, 1 below 768; arrows +
 * dots only when there are more cards than the view holds; no autoplay (source: story-card).
 *
 * Authoring: one card per row (or all cards flat in one cell — segmented on the card heading):
 *   image (<picture>/<img>) · eyebrow paragraph (before the heading) · heading (<h3>) ·
 *   text paragraph(s) · link paragraph (its href is the card target, its text the link label).
 *   A card title that is a body <p> on the source is authored <p><strong>…</strong></p> (one card
 *   per row only) and keeps the body leading (as story-card-grid).
 * Section head: author the section title (<h2>, optional lede) as default content before the
 * block in the same section — styled in place as the source's centred section title.
 * Decode tier: reconstructive (repeat group, segmented by content).
 */

function collectNodes(cell) {
  const out = [];
  [...cell.children].forEach((kid) => {
    if (kid.tagName === 'P' && kid.querySelector('picture, img') && kid.childNodes.length > 1) {
      [...kid.childNodes].forEach((n) => {
        if (n.nodeType === 1) out.push(n);
        else if (n.textContent.trim()) {
          // harness-only fallback: bare text beside an image (never on DA content)
          const p = document.createElement('p');
          p.append(n);
          out.push(p);
        }
      });
    } else out.push(kid);
  });
  if (!out.length && cell.textContent.trim()) {
    // harness-only fallback: a bare-text cell (DA always delivers a <p>)
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    out.push(p);
  }
  return out;
}

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isHeading = (el) => /^H[1-6]$/.test(el.tagName);
/** a <p> holding only bold text, no link: a body-<p> card title (source description__title) */
const isTitleP = (el) => el.tagName === 'P' && !el.querySelector('a, picture, img')
  && !!el.querySelector('strong, b') && el.textContent.trim()
  === [...el.querySelectorAll('strong, b')].map((s) => s.textContent).join('').trim();
const titleOf = (ns) => ns.find(isHeading) || ns.find(isTitleP);
const isMedia = (el) => el.matches('picture, img') || !!el.querySelector('picture, img');
const isLink = (el) => !!(el.matches('a') || el.querySelector('a'));

/** Splits the flat node list into cards on the most frequent heading tag. */
function segment(nodes) {
  const counts = {};
  nodes.filter(isHeading).forEach((h) => { counts[h.tagName] = (counts[h.tagName] || 0) + 1; });
  const tag = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  if (!tag) return [nodes];
  const groups = [];
  let pending = [];
  let current = null;
  nodes.forEach((n) => {
    if (n.tagName === tag) {
      current = [...pending, n];
      pending = [];
      groups.push(current);
    } else if (!current) pending.push(n);
    else if (isMedia(n) && current.some(isLink)) {
      // an image after a finished card opens the next card
      current = null;
      pending.push(n);
    } else if (!isMedia(n) && !isLink(n) && current.some(isLink)) {
      current = null;
      pending.push(n);
    } else current.push(n);
  });
  if (pending.length && groups.length) groups[groups.length - 1].push(...pending);
  return groups;
}

function buildCard(nodes) {
  const heading = titleOf(nodes);
  const media = nodes.find(isMedia);
  const linkP = [...nodes].reverse().find((n) => n !== media && isLink(n));
  const anchor = linkP && (linkP.matches('a') ? linkP : linkP.querySelector('a'));

  const card = document.createElement(anchor ? 'a' : 'div');
  card.className = 'story';
  if (anchor) {
    card.href = anchor.href;
    anchor.replaceWith(...anchor.childNodes); // EW6 — no nested anchors
  }
  const image = div('story-image');
  const body = div('story-body');
  const top = div('story-top');
  const eyebrow = div('story-eyebrow');
  const title = div('story-title');
  const textBox = div('story-text');
  const link = div('story-link');

  const headIdx = nodes.indexOf(heading);
  nodes.forEach((n, i) => {
    if (n === media) image.append(n);
    else if (n === heading) title.append(n);
    else if (n === linkP) link.append(n);
    else if (i < headIdx && !isMedia(n)) eyebrow.append(n);
    else textBox.append(n);
  });
  if (media) card.append(image);
  if (eyebrow.children.length) top.append(eyebrow);
  if (heading) top.append(title);
  if (textBox.children.length) top.append(textBox);
  body.append(top);
  if (link.children.length) body.append(link);
  card.append(body);
  return card;
}

function setupCarousel(block, slides) {
  const viewport = block.querySelector('.stories-viewport');
  const track = block.querySelector('.stories-track');
  const controls = div('stories-controls');
  controls.hidden = true;
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'stories-arrow stories-arrow-prev';
  prev.setAttribute('aria-label', 'Previous');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'stories-arrow stories-arrow-next';
  next.setAttribute('aria-label', 'Next');
  const dotList = document.createElement('ul');
  dotList.className = 'stories-dots';
  controls.append(prev, dotList, next);
  block.append(controls);

  let index = 0;
  let dots = [];
  const perView = () => {
    if (window.matchMedia('(width >= 992px)').matches) return 3;
    if (window.matchMedia('(width >= 768px)').matches) return 2;
    return 1;
  };
  let render;
  const buildDots = (n) => {
    if (dots.length === n) return;
    dotList.replaceChildren();
    dots = Array.from({ length: n }, (_, i) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'stories-dot';
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.addEventListener('click', () => {
        index = i;
        render();
      });
      li.append(b);
      dotList.append(li);
      return li;
    });
  };
  // the source slick scrolls BY VIEW (slidesToScroll = slidesToShow): one dot per view, the
  // last view aligned to the end of the track
  render = () => {
    const pv = perView();
    const pages = Math.max(1, Math.ceil(slides.length / pv));
    index = Math.min(index, pages - 1);
    buildDots(pages);
    controls.hidden = slides.length <= pv;
    const step = viewport.clientWidth / pv;
    const first = Math.min(index * pv, Math.max(0, slides.length - pv));
    track.style.transform = first ? `translateX(${-first * step}px)` : '';
    prev.disabled = index === 0;
    next.disabled = index >= pages - 1;
    dots.forEach((li, i) => {
      li.classList.toggle('is-active', i === index);
      const b = li.querySelector('button');
      if (i === index) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    slides.forEach((s, i) => {
      const visible = i >= first && i < first + pv;
      if (visible) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
    });
  };
  prev.addEventListener('click', () => {
    index = Math.max(0, index - 1);
    render();
  });
  next.addEventListener('click', () => {
    index += 1;
    render();
  });
  window.addEventListener('resize', render);
  render();
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const rowNodes = rows.map((row) => [...row.children].flatMap(collectNodes));
  const cardRows = rowNodes.filter((ns) => titleOf(ns));
  const oneTitle = (ns) => ns.filter(isHeading).length === 1
    || (!ns.some(isHeading) && ns.filter(isTitleP).length === 1);
  let groups;
  if (cardRows.length >= 2 && cardRows.every(oneTitle)) {
    groups = rowNodes.filter((ns) => ns.length);
  } else {
    groups = segment(rowNodes.flat());
  }

  const viewport = div('stories-viewport');
  const track = div('stories-track');
  const slides = groups.map((g) => {
    const slide = div('stories-slide');
    slide.append(buildCard(g));
    return slide;
  });
  track.append(...slides);
  viewport.append(track);
  block.replaceChildren(viewport);
  setupCarousel(block, slides);
}
