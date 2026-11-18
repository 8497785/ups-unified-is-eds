/**
 * sh-benefits — shipping-hub benefits split: illustration beside a heading, a checklist of
 * benefits and a CTA.
 * Decode tier: template-slotted (fixed composition; authored nodes are MOVED into slots).
 *
 * Authoring rows: <img> | <h2>, <ul> (each item: <strong>title</strong> description), CTA <p><a>
 */

const SVG = {
  tick: '<svg class="sh-icon sh-icon-16" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="m378-332 363-363q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L399-267q-9 9-21 9t-21-9L175-449q-9-9-8.5-21.5T176-492q9-9 21.5-9t21.5 9l159 160Z"/></svg>',
  external: '<svg class="sh-icon" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M654-658 263-267q-9 9-21 9t-21-9q-9-9-9-21t9-21l391-391H264q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h420q12.75 0 21.38 8.62Q714-742.75 714-730v420q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63-8.5-8.62-8.5-21.37v-348Z"/></svg>',
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
const isExternal = (a) => {
  try {
    return new URL(a.href, window.location).host !== window.location.host;
  } catch (e) {
    return false;
  }
};

export default function decorate(block) {
  const pic = block.querySelector('picture') || block.querySelector('img');
  const heading = block.querySelector('h2, h3');
  const list = block.querySelector('ul, ol');
  const ctas = [...block.querySelectorAll('p')].filter((p) => p.querySelector('a'));

  const copy = el('div', { class: 'sh-split-copy' });
  if (heading) {
    copy.append(el('div', { class: 'sh-intro sh-intro-section' }, wrapNode(heading, 'sh-intro-title')));
  }
  if (list) {
    list.classList.add('sh-checklist');
    [...list.children].forEach((li) => {
      const benefit = el('span', { class: 'sh-benefit' });
      while (li.firstChild) benefit.append(li.firstChild);
      li.insertAdjacentHTML('afterbegin', SVG.tick);
      li.append(benefit);
    });
    copy.append(list);
  }
  ctas.forEach((p) => {
    const a = p.querySelector('a');
    a.classList.add('sh-btn', 'sh-btn-secondary');
    if (isExternal(a)) {
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.append(el('span', { class: 'sh-btn-icon', 'aria-hidden': 'true', html: SVG.external }));
    }
    copy.append(el('div', { class: 'sh-actions' }, p));
  });

  const media = el('div', { class: 'sh-split-media' });
  if (pic) media.append(el('div', { class: 'sh-illo' }, pic));
  block.replaceChildren(el('div', { class: 'sh-container sh-split' }, media, copy));
}
