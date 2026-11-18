/**
 * sh-header — shipping-hub chrome header (utility bar + three-column main row), loaded by the
 * foundation header block through page metadata `header-block: sh-header`. Reads the nav
 * document named by page metadata `nav` (e.g. /nav-shipping-hub).
 * Nav document sections: 1. logo link, 2. utility links <ul>, 3. main nav <ul>
 *   (plain-text items are menu triggers, linked items are links).
 * Hides on scroll down, returns on scroll up (source motion parity).
 *
 * @ew-exempt all — chrome fragment, edited as the nav document
 */
import { getChromePaths } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

const SVG = {
  globe: '<svg class="sh-icon sh-icon-16" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M323-111.5Q250-143 196-197t-85-127.5Q80-398 80-482t31-156.5Q142-711 196-765t127-84.5Q396-880 480-880t157 30.5Q710-819 764-765t85 126.5Q880-566 880-482t-31 157.5Q818-251 764-197t-127 85.5Q564-80 480-80t-157-31.5ZM480-138q35-36 58.5-82.5T577-331H384q14 60 37.5 108t58.5 85Zm-85-12q-25-38-43-82t-30-99H172q38 71 88 111.5T395-150Zm171-1q72-23 129.5-69T788-331H639q-13 54-30.5 98T566-151ZM152-391h159q-3-27-3.5-48.5T307-482q0-25 1-44.5t4-43.5H152q-7 24-9.5 43t-2.5 45q0 26 2.5 46.5T152-391Zm221 0h215q4-31 5-50.5t1-40.5q0-20-1-38.5t-5-49.5H373q-4 31-5 49.5t-1 38.5q0 21 1 40.5t5 50.5Zm275 0h160q7-24 9.5-44.5T820-482q0-26-2.5-45t-9.5-43H649q3 35 4 53.5t1 34.5q0 22-1.5 41.5T648-391Zm-10-239h150q-33-69-90.5-115T565-810q25 37 42.5 80T638-630Zm-254 0h194q-11-53-37-102.5T480-820q-32 27-54 71t-42 119Zm-212 0h151q11-54 28-96.5t43-82.5q-75 19-131 64t-91 115Z"/></svg>',
  search: '<svg class="sh-icon sh-icon-16" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M378-329q-108.16 0-183.08-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l242 240q9 8.56 9 21.78T818-143q-9 9-22.22 9-13.22 0-21.78-9L533-384q-30 26-69.96 40.5Q423.08-329 378-329Zm-1-60q81.25 0 138.13-57.5Q572-504 572-585t-56.87-138.5Q458.25-781 377-781q-82.08 0-139.54 57.5Q180-666 180-585t57.46 138.5Q294.92-389 377-389Z"/></svg>',
  chev: '<svg class="sh-icon sh-icon-16 sh-nav-chev" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M469-358q-5-2-10-7L261-563q-9-9-8.5-21.5T262-606q9-9 21.5-9t21.5 9l175 176 176-176q9-9 21-8.5t21 9.5q9 9 9 21.5t-9 21.5L501-365q-5 5-10 7t-11 2q-6 0-11-2Z"/></svg>',
  menu: '<svg class="sh-icon" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="M150-240q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H150Zm0-210q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H150Zm0-210q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H150Z"/></svg>',
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

async function loadNav() {
  const paths = getChromePaths('nav');
  for (let i = 0; i < paths.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const fragment = await loadFragment(paths[i]);
    if (fragment) return fragment;
  }
  return null;
}

function utilityIcon(a) {
  if (/site-search/.test(a.getAttribute('href') || '')) return SVG.search;
  if (/\s-\s/.test(a.textContent)) return SVG.globe;
  return '';
}

function hideOnScroll(header) {
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const h = header.offsetHeight;
    if (y > lastY && y > h) header.setAttribute('data-hidden', '');
    else if (y < lastY || y <= h) header.removeAttribute('data-hidden');
    lastY = y;
  }, { passive: true });
}

export default async function decorate(block) {
  const fragment = await loadNav();
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const brand = sections.find((s) => s.querySelector('picture, img'));
  const lists = sections.filter((s) => s !== brand).map((s) => s.querySelector('ul')).filter(Boolean);
  const [utilityList, mainList] = lists;

  const nodes = [];
  if (utilityList) {
    const ul = el('ul', { class: 'sh-utility-list' });
    [...utilityList.querySelectorAll(':scope > li')].forEach((li) => {
      const a = li.querySelector('a');
      if (!a) return;
      a.className = 'sh-navlink';
      const icon = utilityIcon(a);
      if (icon) a.insertAdjacentHTML('afterbegin', icon);
      ul.append(el('li', {}, a));
    });
    nodes.push(el('nav', { class: 'sh-utility', 'aria-label': 'Utility' }, ul));
  }

  const inner = el('div', { class: 'sh-header-inner' });
  const brandLink = brand ? brand.querySelector('a') : null;
  const logo = brand ? brand.querySelector('img') : null;
  if (logo) {
    logo.classList.add('sh-lockup');
    logo.loading = 'eager';
    const home = el('a', { class: 'sh-home', href: brandLink ? brandLink.getAttribute('href') : '/' });
    if (logo.alt) home.setAttribute('aria-label', logo.alt);
    home.append(logo.closest('picture') || logo);
    inner.append(home);
  }
  const nav = el('nav', { class: 'sh-nav', 'aria-label': 'Main' });
  if (mainList) {
    const ul = el('ul', { class: 'sh-nav-list' });
    [...mainList.querySelectorAll(':scope > li')].forEach((li) => {
      const a = li.querySelector(':scope > a');
      if (a) {
        a.className = 'sh-navlink';
        ul.append(el('li', {}, a));
        return;
      }
      const trigger = el('button', { class: 'sh-navlink sh-nav-trigger', type: 'button', 'aria-expanded': 'false' });
      [...li.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE || n.tagName !== 'UL')
        .forEach((n) => trigger.append(n));
      trigger.insertAdjacentHTML('beforeend', SVG.chev);
      ul.append(el('li', {}, trigger));
    });
    nav.append(ul);
  }
  nav.append(el(
    'div',
    { class: 'sh-menu' },
    el('button', { class: 'sh-menu-btn', type: 'button', 'aria-label': 'Menu' }, el('span', { class: 'sh-menu-glyph', 'aria-hidden': 'true', html: SVG.menu })),
  ));
  inner.append(nav, el('div', { class: 'sh-header-end' }));
  nodes.push(inner);
  block.replaceChildren(...nodes);

  const header = block.closest('header');
  if (header) hideOnScroll(header);
}
