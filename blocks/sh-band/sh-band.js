/**
 * sh-band — shipping-hub pattern band: paints its whole section as the signal-field band and
 * lays out the integrations grid (section head + a labelled logo wall). The following
 * sh-tiles blocks in the same section sit on the band.
 * Decode tier: template-slotted head + reconstructive logo cells (one row per logo).
 *
 * Authoring: section head (default content before the block): <h2> + lead <p>.
 *   Block rows: a label row (<h3>) and one row per logo (<img> with the partner name as alt).
 */

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  });
  children.flat().filter(Boolean).forEach((c) => node.append(c));
  return node;
}
function wrapNode(node, className) {
  return el('div', { class: className }, node);
}

function takeSectionHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return null;
  const heading = prev.querySelector('h2, h3');
  if (!heading) return null;
  const lead = [...prev.querySelectorAll('p')].find((p) => !p.querySelector('a, picture, img'));
  const stack = el('div', { class: 'sh-grid-intro-stack' }, wrapNode(heading, 'sh-grid-title'));
  if (lead) stack.append(wrapNode(lead, 'sh-grid-intro-lead'));
  if (!prev.querySelector('h1, h2, h3, h4, p, ul, picture')) prev.remove();
  return el('div', { class: 'sh-grid-intro', 'data-span': '2' }, stack);
}

export default function decorate(block) {
  const section = block.closest('.section');
  if (section && !section.querySelector(':scope > .sh-pattern')) {
    section.prepend(el('div', { class: 'sh-pattern', 'aria-hidden': 'true' }));
  }
  const intro = takeSectionHead(block);
  const logos = el('ul', { class: 'sh-grid', 'data-columns': '3', 'data-narrow': 'two' });
  [...block.children].forEach((row) => {
    const pic = row.querySelector('picture') || row.querySelector('img');
    const heading = row.querySelector('h2, h3, h4, h5, h6');
    if (pic) {
      logos.append(el('li', { class: 'sh-tile sh-logos-cell' }, el('div', { class: 'sh-mark' }, pic)));
    } else if (heading) {
      logos.append(el('li', { class: 'sh-tile sh-logos-label' }, wrapNode(heading, 'sh-tile-title')));
    }
  });
  const grid = el(
    'div',
    { class: 'sh-grid', 'data-columns': '4' },
    intro,
    el(
      'ul',
      { class: 'sh-grid-contents' },
      el('li', { class: 'sh-tile', 'data-bleed': 'true', 'data-span': '2' }, el('div', { class: 'sh-logos' }, logos)),
    ),
  );
  block.replaceChildren(el('div', { class: 'sh-container' }, grid));
}
