/**
 * marketing-hero — image + copy teaser hero on a grey-teal gradient with a white arc
 * (source: teaser "Marketing Hero", teasernMarketHero).
 *
 * Authoring (any row/cell shape — the block queries content, never row indices):
 *   - heading: the page <h1> (an <h2> also works); headings right after it continue the title
 *   - description: paragraphs / lists after the heading
 *   - CTAs: one paragraph per link; <strong> = primary (teal), <em> = secondary (outline),
 *     <strong><em> = accent (yellow); a paragraph with text beside its link is description
 *     copy (before the CTAs) or the small note (after them)
 *   - eyebrow: a paragraph before the heading (source cmp-teaser__pretitle, 16/24)
 * Variant `copy-right`: image-less teaser with the copy in the right half (>= 768).
 *   - image: one <picture>/<img> anywhere (optional — no image = copy-only hero)
 * Decode tier: template-slotted (fixed composition; authored nodes are MOVED into slots).
 * The arc offset and the bottom spacing follow the source's arcHeightManager.
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
// a CTA paragraph holds links only; a sentence that carries a link is description copy
const squash = (t) => t.replace(/\s/g, '');
const linksOnly = (el) => squash(el.textContent)
  === squash([...el.querySelectorAll('a')].map((a) => a.textContent).join(''));
const isCta = (el) => el.tagName === 'P' && !!el.querySelector('a') && !isMedia(el)
  && linksOnly(el);

function arcHeightManager(block) {
  const content = block.querySelector('.marketing-hero-content');
  if (!content) return;
  block.style.removeProperty('padding-bottom');
  block.style.removeProperty('margin-bottom');
  let e = 0;
  [...content.children].forEach((child) => {
    const cs = getComputedStyle(child);
    e += child.getBoundingClientRect().height
      + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);
  });
  block.style.setProperty('--arc-top', `${e + 72}px`);
  const img = block.querySelector('.marketing-hero-media img');
  const sw = window.screen.width;
  if (img) {
    const ih = img.getBoundingClientRect().height;
    if (sw >= 1200 && (ih || 292) > e + 72) {
      block.style.paddingBottom = '64px';
      block.style.marginBottom = '0';
    } else if (sw > 992 && sw < 1200 && (ih || 242) > e + 10) {
      block.style.marginBottom = '0';
    }
    if (sw >= 1400) {
      if (e + 72 > 324 && e + 72 < 404) block.style.marginBottom = '16px';
      if (e + 72 < 332) {
        block.style.paddingBottom = '64px';
        block.style.marginBottom = '0';
      }
    }
  }
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  if (!nodes.length) return;
  const isHead = (n) => /^H[1-6]$/.test(n.tagName);
  const heading = nodes.find(isHead);
  // a title split over consecutive headings (source: two h1 lines, DeliveryDefense™ / Technology)
  const heads = [];
  if (heading) {
    for (let i = nodes.indexOf(heading); i < nodes.length && isHead(nodes[i]); i += 1) {
      heads.push(nodes[i]);
    }
  }
  const media = nodes.find(isMedia);

  const container = div('container');
  const row = div('row marketing-hero-row');
  const content = div('col-md-6 marketing-hero-content');
  const title = div('teaser-title');
  const desc = div('teaser-desc');
  const actions = div('teaser-actions');

  const note = div('teaser-note');
  // copy authored before the heading is the eyebrow (source cmp-teaser__pretitle)
  const pretitle = div('teaser-pretitle');
  const headAt = heading ? nodes.indexOf(heading) : -1;
  nodes.filter((n) => n !== media).forEach((n) => {
    if (heads.includes(n)) title.append(n);
    else if (nodes.indexOf(n) < headAt) pretitle.append(n);
    // copy after the CTAs (source cmp-teaser__additionalText) is a small note under them
    else if (actions.children.length && !isCta(n)) note.append(n);
    else if (isCta(n)) actions.append(n);
    else desc.append(n);
  });
  if (pretitle.children.length) content.append(pretitle);
  if (heading) content.append(title);
  if (desc.children.length) content.append(desc);
  content.append(actions);
  if (note.children.length) content.append(note);
  row.append(content);

  if (media) {
    const mediaCol = div('col-md-6 marketing-hero-media');
    mediaCol.append(media);
    row.append(mediaCol);
    const img = media.matches('img') ? media : media.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.setAttribute('fetchpriority', 'high');
    }
  } else {
    block.classList.add('no-media');
  }
  container.append(row);
  block.replaceChildren(container);

  const run = () => arcHeightManager(block);
  window.setTimeout(run, 500);
  const img = block.querySelector('.marketing-hero-media img');
  if (img && !img.complete) img.addEventListener('load', run, { once: true });
  if (document.fonts) document.fonts.ready.then(run);
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(run, 150);
  });
}
