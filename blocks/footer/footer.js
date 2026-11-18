import {
  getMetadata,
  buildBlock,
  decorateBlock,
  loadBlock,
} from '../../scripts/aem.js';
import { getChromePaths } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * InsureShield footer — template-slotted from the canon chrome (footer.min.css + theme).
 *
 * Footer document (/footer, /<cc>/<ll>/footer, or the page's `footer` metadata):
 *   - optional notes section: disclaimer paragraphs (italic = <em>)
 *   - columns section: per column a heading paragraph followed by its list; a list whose
 *     items carry an image is the social list. Section style `split-3-6-3` widens the
 *     middle column to 50% (DE / GB footers).
 *   - legal section: heading paragraph ("Legal", mobile accordion only) + list
 *   - copyright section
 * `#cookie-settings` links open the consent manager. Page metadata `footer-block: <name>`
 * hands the whole chrome to another project block.
 *
 * @ew-exempt chrome fragment: the footer document is edited as its own page, never in-page.
 */

const isDesktop = window.matchMedia('(width >= 992px)');

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else e.setAttribute(k, v);
  });
  e.append(...children);
  return e;
}

function isExternal(a) {
  const href = a.getAttribute('href') || '';
  return /^https?:/.test(href) && a.hostname !== window.location.hostname;
}

function markExternal(scope) {
  scope.querySelectorAll('a').forEach((a) => {
    if (!isExternal(a) || a.querySelector('.upspr-icon-newwindow')) return;
    a.append(' ', el('span', { class: 'upspr upspr-icon-newwindow', 'aria-hidden': 'true' }));
  });
}

function heading(p, extra = '') {
  const h = el('div', {
    class: `ftr-heading${extra}`, role: 'button', tabindex: '0', 'aria-expanded': 'false',
  }, p);
  h.addEventListener('click', () => {
    if (isDesktop.matches) return;
    const on = !h.classList.contains('active');
    h.classList.toggle('active', on);
    h.setAttribute('aria-expanded', String(on));
  });
  h.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      h.click();
    }
  });
  return h;
}

/** split a section's default content into [heading paragraph, list] groups */
function groups(section) {
  const out = [];
  [...section.querySelectorAll('.default-content-wrapper > *')].forEach((child) => {
    if (child.matches('ul, ol') && out.length) out[out.length - 1].list = child;
    else if (child.matches('p, h2, h3, h4, h5, h6')) out.push({ head: child, list: null });
  });
  return out;
}

function buildSocial(list) {
  list.classList.add('ftr-social');
  [...list.children].forEach((li) => {
    const a = li.querySelector('a');
    const pic = li.querySelector('picture, img');
    if (!a) return;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    const text = el('span', { class: 'ftr-social-text' }, ...a.childNodes);
    a.append(text);
    if (pic) a.prepend(pic);
    // whitespace between the authored image and link stays out of the flex row
    [...li.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE).forEach((n) => n.remove());
  });
  return el('div', { class: 'ftr-list-wrap' }, list);
}

function buildColumns(section) {
  const cols = el('div', { class: 'ftr-cols' });
  if (section.classList.contains('split-3-6-3')) cols.classList.add('ftr-cols-split');
  groups(section).forEach(({ head, list }, i, all) => {
    const col = el('div', { class: 'ftr-col' });
    if (all.length === 3 && i === 1) col.classList.add('ftr-col-wide');
    col.append(heading(head), el('hr', { class: 'ftr-rule' }));
    if (list && list.querySelector('img')) {
      col.append(buildSocial(list));
    } else if (list) {
      list.classList.add('ftr-list');
      const label = head.textContent.trim();
      col.append(el('nav', { class: 'ftr-list-wrap', 'aria-label': label }, list));
    }
    cols.append(col);
  });
  return cols;
}

function buildLegal(section) {
  const frag = document.createDocumentFragment();
  const [group] = groups(section);
  if (!group) return frag;
  frag.append(
    heading(group.head, ' ftr-heading-legal'),
    el('hr', { class: 'ftr-rule ftr-rule-bottom' }),
  );
  if (group.list) {
    group.list.classList.add('ftr-legal');
    frag.append(el('nav', { class: 'ftr-legal-nav', 'aria-label': 'Legal' }, group.list));
  }
  return frag;
}

async function loadFooter() {
  const paths = getChromePaths('footer');
  for (let i = 0; i < paths.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const fragment = await loadFragment(paths[i]);
    if (fragment) return fragment;
  }
  return null;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const delegate = getMetadata('footer-block');
  if (delegate) {
    block.textContent = '';
    const other = buildBlock(delegate, '');
    block.append(other);
    decorateBlock(other);
    await loadBlock(other);
    return;
  }

  const fragment = await loadFooter();
  block.textContent = '';
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const colsIndex = sections.findIndex((s) => s.querySelector('ul') && groups(s).length > 1);
  const inner = el('div', { class: 'ftr-inner' });

  sections.forEach((section, i) => {
    const content = section.querySelector('.default-content-wrapper');
    if (!content) return;
    if (colsIndex >= 0 && i < colsIndex) {
      inner.append(el('div', { class: 'ftr-notes' }, ...content.childNodes));
    } else if (i === colsIndex) {
      inner.append(buildColumns(section));
    } else if (section.querySelector('ul')) {
      inner.append(buildLegal(section));
    } else {
      inner.append(el('div', { class: 'ftr-copy' }, ...content.childNodes));
    }
  });

  markExternal(inner);
  inner.querySelectorAll('a[href="#cookie-settings"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.OneTrust) window.OneTrust.ToggleInfoDisplay();
      window.scrollTo(0, 0);
    });
  });
  block.append(el('div', { class: 'ftr' }, inner));
}
