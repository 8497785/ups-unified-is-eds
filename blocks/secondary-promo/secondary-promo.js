/**
 * secondary-promo — image + copy split promo on white (source: secondarypromo teaser).
 *
 * Authoring (any row/cell shape — content is queried, never indexed):
 *   - image: one <picture>/<img>
 *   - heading: <h2> (the section title of the promo)
 *   - description: paragraphs and lists (<ul> bullets, <ol> numbered "1." items)
 *   - CTAs (optional): one paragraph per link, <strong> primary / <em> secondary
 * @variants block class: media-left | media-right (default media-left) — image side from 768px;
 *   carousel (one slide per row, dots + arrows; + autoplay = 5 s rotation, else 60 s);
 *   featured (gradient band; a <p> after the CTA is the small grey note)
 * Decode tier: template-slotted. Below 768 the title sits above the image (source order);
 * from 768 it heads the copy column — one authored heading, placed by CSS grid areas.
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img') && kids[0].childNodes.length > 1) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // harness-only fallback: bare text beside an image (never on DA content)
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // harness-only fallback: a bare-text cell (DA always delivers a <p>)
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isMedia = (el) => el.matches('picture, img') || !!el.querySelector('picture, img');
const isCta = (el) => el.tagName === 'P' && !!el.querySelector('a')
  && el.textContent.trim() === el.querySelector('a').textContent.trim();

function buildGrid(nodes, block) {
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const media = nodes.find(isMedia);
  const grid = div('secondary-promo-grid');
  const mediaBox = div('secondary-promo-media');
  const title = div('teaser-title');
  const desc = div('teaser-desc');
  const actions = div('teaser-actions');

  // `featured`: link-free copy after a CTA is the source cmp-teaser__additionalText note
  const noteAfterCta = block.classList.contains('featured');
  nodes.forEach((n) => {
    if (n === heading) title.append(n);
    else if (n === media) mediaBox.append(n);
    else if (isCta(n)) actions.append(n);
    else if (noteAfterCta && actions.children.length && n.tagName === 'P') {
      n.classList.add('teaser-note');
      actions.append(n);
    } else desc.append(n);
  });
  if (media) grid.append(mediaBox);
  else block.classList.add('no-media');
  if (heading) grid.append(title);
  // `video`: the source video teaser repeats its title in the copy column, under the media
  if (heading && block.classList.contains('video')) {
    const repeat = title.cloneNode(true);
    repeat.classList.add('teaser-title-repeat');
    repeat.setAttribute('aria-hidden', 'true');
    grid.append(repeat);
  }
  if (desc.children.length) grid.append(desc);
  if (actions.children.length) grid.append(actions);
  return grid;
}

function arrow(dir, label) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `secondary-promo-arrow secondary-promo-${dir}`;
  b.setAttribute('aria-label', label);
  return b;
}

/* variant `carousel`: one slide per row (source cmp-carousel of secondarypromo teasers);
   prev / dots / next below; rotates every 60 s (source data-cmp-delay), `autoplay` every 5 s */
function decorateCarousel(block) {
  const rows = [...block.children].filter((r) => r.textContent.trim() || r.querySelector('img'));
  const slides = rows.map((row, i) => {
    const slide = div('secondary-promo-slide');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} / ${rows.length}`);
    const holder = document.createElement('div');
    holder.append(row);
    slide.append(buildGrid(collectNodes(holder), block));
    return slide;
  });
  block.classList.remove('no-media');
  block.replaceChildren(...slides);
  block.setAttribute('aria-roledescription', 'carousel');
  if (slides.length < 2) return;
  const bar = div('secondary-promo-bar');
  const prev = arrow('prev', 'Previous');
  const next = arrow('next', 'Next');
  const dots = document.createElement('ol');
  dots.className = 'secondary-promo-dots';
  const dotEls = slides.map((s, i) => {
    const d = document.createElement('li');
    d.className = 'secondary-promo-dot';
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.tabIndex = 0;
    dots.append(d);
    return d;
  });
  bar.append(prev, dots, next);
  block.append(bar);
  let index = 0;
  let timer;
  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => { s.hidden = n !== index; });
    dotEls.forEach((d, n) => {
      d.classList.toggle('is-active', n === index);
      d.setAttribute('aria-current', String(n === index));
    });
  };
  const delay = block.classList.contains('autoplay') ? 5000 : 60000;
  const restart = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!block.isConnected) clearInterval(timer);
      else show(index + 1);
    }, delay);
  };
  prev.addEventListener('click', () => { show(index - 1); restart(); });
  next.addEventListener('click', () => { show(index + 1); restart(); });
  dotEls.forEach((d, n) => {
    const pick = () => { show(n); clearInterval(timer); };
    d.addEventListener('click', pick);
    d.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pick();
      }
    });
  });
  show(0);
  restart();
}

export default function decorate(block) {
  if (block.classList.contains('carousel')) {
    decorateCarousel(block);
    return;
  }
  const nodes = collectNodes(block);
  if (!nodes.length) return;
  block.replaceChildren(buildGrid(nodes, block));
}
