/**
 * sh-footer — shipping-hub chrome footer (inverse): footnotes, three link columns, copyright
 * and legal links. Loaded by the foundation footer block through page metadata
 * `footer-block: sh-footer`; reads the footer document named by page metadata `footer`.
 * Footer document sections: 1. footnote paragraphs, 2. <h3> + <ul> per column,
 *   3. copyright <p> + legal <ul>. Absolute links to other hosts open in a new tab.
 *
 * @ew-exempt all — chrome fragment, edited as the footer document
 */
import { getChromePaths } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

const SVG = {
  glyph: '<svg class="sh-icon sh-icon-16 sh-link-glyph" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M654-658 263-267q-9 9-21 9t-21-9q-9-9-9-21t9-21l391-391H264q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h420q12.75 0 21.38 8.62Q714-742.75 714-730v420q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63-8.5-8.62-8.5-21.37v-348Z"/></svg>',
};

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  });
  children.flat().filter(Boolean).forEach((c) => node.append(c));
  return node;
}

async function loadFooterDoc() {
  const paths = getChromePaths('footer');
  for (let i = 0; i < paths.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const fragment = await loadFragment(paths[i]);
    if (fragment) return fragment;
  }
  return null;
}

function decorateLink(a) {
  a.className = 'sh-link';
  const label = el('span', { class: 'sh-link-text' });
  while (a.firstChild) label.append(a.firstChild);
  a.append(label);
  const href = a.getAttribute('href') || '';
  let external = false;
  try {
    external = /^https?:/.test(href) && new URL(href).host !== window.location.host;
  } catch (e) {
    external = false;
  }
  if (external) {
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.insertAdjacentHTML('beforeend', SVG.glyph);
    a.append(el('span', { class: 'sh-sr' }, ' (opens in a new tab)'));
  }
  return a;
}

function linkList(ul, className) {
  const out = el('ul', { class: className });
  [...ul.querySelectorAll(':scope > li')].forEach((li) => {
    const a = li.querySelector('a');
    if (a) out.append(el('li', {}, decorateLink(a)));
  });
  return out;
}

export default async function decorate(block) {
  const fragment = await loadFooterDoc();
  if (!fragment) return;
  // content sections only (the document's metadata section carries no default content)
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .map((s) => s.querySelector('.default-content-wrapper'))
    .filter(Boolean);
  const colsSection = sections.find((s) => s.querySelectorAll('h2, h3, h4').length > 1);
  const before = sections.slice(0, sections.indexOf(colsSection));
  const after = sections.slice(sections.indexOf(colsSection) + 1);
  const inner = el('div', { class: 'sh-footer-inner' });

  before.forEach((s) => inner.append(el('div', { class: 'sh-footer-notes' }, ...s.children)));
  if (colsSection) {
    const top = el('div', { class: 'sh-footer-top' });
    // capture each heading's lists BEFORE moving anything (moving ends a sibling walk)
    const groups = [...colsSection.querySelectorAll('h2, h3, h4')].map((h) => {
      const lists = [];
      let next = h.nextElementSibling;
      while (next && !/^H[2-4]$/.test(next.tagName)) {
        if (next.tagName === 'UL') lists.push(next);
        next = next.nextElementSibling;
      }
      return { h, lists };
    });
    groups.forEach(({ h, lists }, i) => {
      const id = `sh-ft-${i}`;
      h.id = id;
      h.className = 'sh-footer-col-title';
      const col = el('nav', { class: 'sh-footer-col', 'aria-labelledby': id }, h);
      lists.forEach((ul) => col.append(linkList(ul, 'sh-footer-list')));
      top.append(col);
    });
    inner.append(top);
  }
  after.forEach((s) => {
    const bottom = el('div', { class: 'sh-footer-bottom' });
    [...s.children].forEach((n) => {
      if (n.tagName === 'UL') bottom.append(linkList(n, 'sh-footer-legal'));
      else if (n.tagName === 'P') {
        n.classList.add('sh-footer-copyright');
        bottom.append(n);
      }
    });
    inner.append(bottom);
  });
  block.replaceChildren(inner);
}
