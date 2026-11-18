/**
 * homepage-hero — card-over-image home hero (source: ups-teaser homepagehero, content-left).
 *
 * Decode tier: template-slotted. Authored nodes are MOVED into empty slots by role (EW1).
 * Authoring (any row/cell shape; the block queries by content, never by row index):
 *   - one image (<picture>/<img>) — the full-bleed background photo (editorial)
 *   - optional eyebrow: a short link-free <p> BEFORE the heading
 *   - the heading: <h1> on a page whose lead is the hero (locale home), <h2> when the page's
 *     h1 sits elsewhere (home template) — the authored tag is kept. A heading directly after
 *     it (the source's two-line title, e.g. de/de "InsureShield®" + "Transport- versicherung")
 *     joins the title and takes the first heading's size.
 *   - description: link-free <p>s after the heading
 *   - CTAs: <p><strong><a></a></strong></p> (primary) / <em> (secondary), one or more
 *   - optional note: link-free <p>s AFTER the last CTA (source cmp-teaser__additionalText)
 * Variant `content-right` (source ups-teaser__content-right, e.g. gb/en, it/it): the card sits
 * at the right edge of the container on desktop. A CTA to another origin carries the source's
 * open-in-new icon instead of the chevron; on the home template (body.home) every hero CTA
 * carries it (source /, /us/en/securecommerce: upspr-icon-newwindow on #products too).
 * Used by the locale-home, home and form templates (plan.json reuse).
 * A literal "®" in the heading is rendered superscript by wrapping that character only
 * (presentation refinement; the heading's textContent is unchanged).
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].children];
    }
    out.push(...kids);
  });
  return out;
}

function supRegistered(heading) {
  if (heading.querySelector('sup')) return;
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const hits = [];
  while (walker.nextNode()) {
    if (/®/.test(walker.currentNode.nodeValue)) hits.push(walker.currentNode);
  }
  hits.forEach((node) => {
    const parts = node.nodeValue.split(/(®)/);
    const frag = document.createDocumentFragment();
    parts.forEach((part) => {
      if (part === '®') {
        const sup = document.createElement('sup');
        sup.textContent = part;
        frag.append(sup);
      } else if (part) {
        frag.append(document.createTextNode(part));
      }
    });
    node.replaceWith(frag);
  });
}

function addChevron(a) {
  if (a.querySelector('.upspr-icon-chevronright, .upspr-icon-newwindow')) return;
  const external = (a.hostname && a.hostname !== window.location.hostname)
    || document.body.classList.contains('home');
  const icon = document.createElement('span');
  icon.className = external ? 'upspr-icon-newwindow' : 'upspr-icon-chevronright';
  icon.setAttribute('aria-hidden', 'true');
  a.append(icon);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .homepage-hero-media, :scope > .homepage-hero-wrap')) return;
  const nodes = collectNodes(block);
  const media = nodes.map((n) => (n.matches('picture, img') ? n : n.querySelector('picture, img')))
    .find(Boolean);
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  let headIdx = heading ? nodes.indexOf(heading) : -1;
  const headings = heading ? [heading] : [];
  while (headIdx >= 0 && nodes[headIdx + 1] && /^H[1-6]$/.test(nodes[headIdx + 1].tagName)) {
    headIdx += 1;
    headings.push(nodes[headIdx]);
  }
  const isText = (n) => n.tagName === 'P' && !n.querySelector('a, picture, img');
  const eyebrow = nodes.slice(0, Math.max(headIdx, 0)).find(isText);
  const ctas = nodes.filter((n) => n.tagName === 'P' && n.querySelector('a'));
  const lastCta = ctas.length ? nodes.indexOf(ctas[ctas.length - 1]) : -1;
  // a link-free <p> after the last CTA is the source cmp-teaser__additionalText note
  const notes = nodes.filter((n, i) => lastCta >= 0 && i > lastCta && isText(n));
  const desc = nodes.filter((n, i) => i > headIdx && isText(n) && !notes.includes(n));
  const rest = nodes.filter((n) => !headings.includes(n) && n !== eyebrow && !desc.includes(n)
    && !notes.includes(n)
    && !ctas.includes(n) && !(media && (n === media || n.contains(media)))
    && n.textContent.trim());

  const mediaBox = document.createElement('div');
  mediaBox.className = 'homepage-hero-media';
  if (media) mediaBox.append(media.closest('picture') || media);

  const wrap = document.createElement('div');
  wrap.className = 'homepage-hero-wrap';
  const card = document.createElement('div');
  card.className = 'homepage-hero-card';
  wrap.append(card);

  if (eyebrow) card.append(wrapNode(eyebrow, 'homepage-hero-eyebrow'));
  if (heading) {
    const title = wrapNode(heading, 'homepage-hero-title');
    headings.slice(1).forEach((h) => title.append(h));
    headings.forEach(supRegistered);
    card.append(title);
  }
  if (desc.length || rest.length) {
    const d = document.createElement('div');
    d.className = 'homepage-hero-desc';
    d.append(...desc, ...rest);
    card.append(d);
  }
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'homepage-hero-actions';
    ctas.forEach((p) => {
      p.querySelectorAll('a.button').forEach(addChevron);
      actions.append(p);
    });
    card.append(actions);
  }
  if (notes.length) {
    const note = document.createElement('div');
    note.className = 'homepage-hero-note';
    note.append(...notes);
    card.append(note);
  }
  block.replaceChildren(mediaBox, wrap);
}
