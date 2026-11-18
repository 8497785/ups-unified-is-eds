import {
  getMetadata,
  buildBlock,
  decorateBlock,
  loadBlock,
} from '../../scripts/aem.js';
import { getChromePaths } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * InsureShield header — template-slotted from the canon chrome (canon.css / canon.js).
 *
 * Nav document (/nav, /<cc>/<ll>/nav, or the page's `nav` metadata), default content only:
 *   - optional section with style `alerts`: alert text paragraph + link paragraph
 *   - brand section: logo link(s) — a second logo, when present, is the `home` template logo
 *   - utility section: list of links; the item without a link of its own is the locale
 *     selector (its text = the button label, its nested list = the locales; the last
 *     nested link is "Select Another Country or Territory")
 *   - nav section: list; an item with a nested list is a mega-menu panel
 *   - tools section: the search page link (the form posts there)
 * A nav document with the brand section only renders the logo-only header (region selector).
 * Page metadata `header-block: <name>` hands the whole chrome to another project block.
 *
 * @ew-exempt chrome fragment: the nav document is edited as its own page, never in-page;
 * the panel heading is a presentational clone of the trigger text (source markup).
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

function icon(name) {
  return el('span', { class: `upspr-icon-${name}`, 'aria-hidden': 'true' });
}

function hidden(text) {
  return el('span', { class: 'visually-hidden' }, text);
}

/** the trigger link of a list item: `li > a` (authored) or `li > p > a` (delivered) */
function unwrapTrigger(li) {
  const p = li.querySelector(':scope > p');
  if (p) {
    const next = p.nextElementSibling;
    const nodes = [...p.childNodes];
    p.replaceWith(...nodes);
    return next;
  }
  return null;
}

function buildAlerts(section) {
  const msg = el('div', { class: 'alerts-msg' });
  [...section.querySelectorAll('.default-content-wrapper > *')].forEach((child) => {
    const a = child.matches('p') && child.querySelector(':scope > a:only-child');
    if (a && child.textContent.trim() === a.textContent.trim()) {
      a.classList.add('alerts-more');
      child.replaceWith(a);
      msg.append(a);
    } else {
      msg.append(child);
    }
  });
  const controls = el(
    'div',
    { class: 'alerts-controls' },
    el(
      'button',
      { class: 'alerts-arrow', type: 'button', hidden: '' },
      icon('chevronleft'),
      hidden('Previous'),
    ),
    el('span', { class: 'alerts-index' }, '1'),
    ' of ',
    el('span', { class: 'alerts-size' }, '1'),
    el(
      'button',
      { class: 'alerts-arrow', type: 'button', hidden: '' },
      icon('chevronright'),
      hidden('Next'),
    ),
  );
  const close = el(
    'button',
    { class: 'alerts-close', type: 'button' },
    icon('close'),
    hidden('Close'),
  );
  const alerts = el(
    'div',
    { class: 'alerts', role: 'group', 'aria-label': 'Time Sensitive Information from UPS' },
    el(
      'div',
      { class: 'container' },
      el(
        'div',
        { class: 'alerts-inner' },
        controls,
        el('div', { class: 'alerts-list' }, msg),
        close,
      ),
    ),
  );
  close.addEventListener('click', () => { alerts.hidden = true; });
  return alerts;
}

function buildLogo(section) {
  const logos = [...section.querySelectorAll('.default-content-wrapper > p')]
    .filter((p) => p.querySelector('img'));
  const home = getMetadata('template')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .includes('home');
  const chosen = (home && logos[1]) || logos[0];
  const wrap = el('div', { class: 'hdr-logo' });
  if (!chosen) return wrap;
  const img = chosen.querySelector('img');
  img.loading = 'eager';
  img.setAttribute('fetchpriority', 'high');
  wrap.append(chosen);
  return wrap;
}

function buildLocale(li) {
  const label = li.querySelector(':scope > p');
  const list = li.querySelector(':scope > ul');
  const btn = el('button', {
    class: 'hdr-lang-btn', type: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false',
  });
  if (label) btn.append(...label.childNodes);
  btn.append(icon('chevrondown'));
  label?.remove();
  const menu = el('div', { class: 'hdr-lang-menu', role: 'menu' });
  if (list) {
    const items = [...list.children];
    const more = items.length > 1 ? items.pop() : null;
    items.forEach((item) => item.querySelector('a')?.setAttribute('role', 'menuitem'));
    // the current locale points at the current page (source behaviour)
    const current = items[0]?.querySelector('a');
    if (current && current.textContent.trim() === btn.textContent.trim()) {
      current.href = window.location.pathname;
    }
    menu.append(list);
    if (more) {
      const moreWrap = el('div', { class: 'hdr-lang-more' }, ...more.childNodes);
      moreWrap.querySelector('a')?.setAttribute('role', 'menuitem');
      more.remove();
      menu.append(moreWrap);
    }
  }
  li.classList.add('hdr-lang');
  li.append(btn, menu);

  const set = (open) => {
    li.classList.toggle('show', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    set(!li.classList.contains('show'));
  });
  document.addEventListener('click', () => set(false));
  li.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      set(false);
      btn.focus();
    }
  });
}

function buildUtility(section) {
  const nav = el('nav', { class: 'hdr-util', 'aria-label': 'Utilities Menu' });
  const ul = section?.querySelector('ul');
  if (!ul) return nav;
  [...ul.children].forEach((li) => {
    if (li.querySelector(':scope > ul')) buildLocale(li);
    else unwrapTrigger(li);
  });
  nav.append(ul);
  return nav;
}

function buildNav(section, body) {
  const nav = el('nav', { class: 'hdr-nav', 'aria-label': 'InsureShield Navigation Items' });
  const ul = section?.querySelector('ul');
  if (!ul) return nav;
  ul.classList.add('hdr-nav-list');
  let closeTimer;
  const collapseAll = () => ul.querySelectorAll('.hdr-nav-link.expanded').forEach((l) => {
    l.classList.remove('expanded');
    l.setAttribute('aria-expanded', 'false');
    l.parentElement.querySelector('.hdr-nav-toggle')?.setAttribute('aria-expanded', 'false');
  });
  [...ul.children].forEach((li) => {
    li.classList.add('hdr-nav-item');
    unwrapTrigger(li);
    const link = li.querySelector(':scope > a');
    const sub = li.querySelector(':scope > ul');
    if (!link) return;
    link.classList.add('hdr-nav-link');
    const href = link.getAttribute('href') || '';
    if (href.startsWith('/') && link.pathname === window.location.pathname) {
      link.setAttribute('aria-current', 'page');
    }
    if (!sub) return;
    link.setAttribute('aria-expanded', 'false');
    sub.classList.add('hdr-sub');
    sub.prepend(el('li', { class: 'hdr-sub-heading' }, link.textContent));
    const toggle = el('button', {
      class: 'hdr-nav-toggle upspr-icon-chevrondown',
      type: 'button',
      'aria-expanded': 'false',
      'aria-label': `${link.textContent} menu`,
    });
    link.after(toggle);

    li.addEventListener('mouseover', () => {
      if (!isDesktop.matches) return;
      clearTimeout(closeTimer);
      if (!link.classList.contains('expanded')) collapseAll();
      link.classList.add('expanded');
      link.setAttribute('aria-expanded', 'true');
      body.classList.add('hamburger-menu-opened');
    });
    li.addEventListener('mouseleave', () => {
      if (!isDesktop.matches) return;
      closeTimer = setTimeout(() => {
        link.classList.remove('expanded');
        link.setAttribute('aria-expanded', 'false');
        body.classList.remove('hamburger-menu-opened');
      }, 100);
    });
    // a trigger without a page of its own ("#…") opens its panel (source: Enter / click on "#")
    if ((link.getAttribute('href') || '').startsWith('#')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isDesktop.matches) return; // mobile: the chevron toggle opens it (source)
        clearTimeout(closeTimer);
        const open = true;
        collapseAll();
        link.classList.toggle('expanded', open);
        link.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-expanded', String(open));
        if (isDesktop.matches) body.classList.toggle('hamburger-menu-opened', open);
      });
    }
    toggle.addEventListener('click', () => {
      const open = !link.classList.contains('expanded');
      collapseAll();
      link.classList.toggle('expanded', open);
      link.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-expanded', String(open));
    });
  });
  nav.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isDesktop.matches) {
      collapseAll();
      body.classList.remove('hamburger-menu-opened');
    }
  });
  document.addEventListener('click', (e) => {
    if (!isDesktop.matches || nav.contains(e.target)) return;
    collapseAll();
    body.classList.remove('hamburger-menu-opened');
  });
  nav.append(ul);
  nav.collapseAll = collapseAll;
  return nav;
}

let searchIndex;
async function loadSearchIndex() {
  if (!searchIndex) {
    searchIndex = fetch('/query-index.json?limit=1000')
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => j.data || [])
      .catch(() => []);
  }
  return searchIndex;
}

/* typeahead: up to 5 pages of the locale tree with the term — title, then description, then text */
async function showSuggestions(value, list) {
  const term = value.trim().toLowerCase();
  list.replaceChildren();
  list.classList.remove('open');
  if (term.length < 2) return;
  const rows = await loadSearchIndex();
  const tree = window.location.pathname.split('/').slice(0, 3).join('/');
  const has = (r, k) => (r[k] || '').toLowerCase().includes(term);
  const pool = rows.filter((r) => r.path.startsWith(`${tree}/`) && !/noindex/i.test(r.robots || ''));
  const rank = (r) => ['title', 'description', 'text'].findIndex((k) => has(r, k));
  const hits = pool.map((r) => [rank(r), r]).filter(([n]) => n >= 0)
    .sort((a, b) => a[0] - b[0])
    .slice(0, 5)
    .map(([, r]) => r);
  if (!hits.length) return;
  hits.forEach((r) => {
    const label = r.title.replace(/\s*\|\s*InsureShield\s*$/, '');
    list.append(el('a', { class: 'hdr-search-item', role: 'option', href: r.path }, label));
  });
  list.classList.add('open');
}

function buildSearch(section) {
  const link = section?.querySelector('a');
  const action = link ? link.getAttribute('href') : '/us/en/search';
  const open = el('button', {
    class: 'hdr-search-btn',
    type: 'button',
    'aria-label': 'Search Toggle',
    'aria-expanded': 'false',
  }, icon('search'));
  const input = el('input', {
    class: 'hdr-search-input',
    type: 'text',
    name: 'q',
    placeholder: 'Search',
    'aria-label': 'Search',
  });
  const clear = el('button', {
    class: 'hdr-search-clear', type: 'button', 'aria-label': 'clear', hidden: '',
  }, icon('close'), hidden('clear'));
  const close = el(
    'button',
    { class: 'hdr-search-close', type: 'button' },
    icon('close'),
    hidden('close'),
  );
  const suggest = el('div', {
    class: 'hdr-search-list hdr-search-suggest', role: 'listbox', 'aria-label': 'Search suggestions',
  });
  const recent = el('div', {
    class: 'hdr-search-list', role: 'listbox', 'aria-label': 'Recent search results',
  }, el('p', { class: 'hdr-search-eyebrow' }, 'Recent search results'));
  const field = el(
    'div',
    { class: 'hdr-search-field' },
    icon('search'),
    input,
    clear,
    suggest,
    recent,
  );
  const submit = el(
    'button',
    { class: 'hdr-search-submit', type: 'submit', 'aria-label': 'Search' },
    'Search',
    icon('chevronright'),
  );
  const form = el(
    'form',
    { class: 'hdr-search-form', action },
    el(
      'div',
      { class: 'hdr-search-row' },
      el('div', { class: 'hdr-search-group' }, field, submit),
      close,
    ),
  );
  const search = el('div', { class: 'hdr-search', role: 'search' }, open, form);
  let closing;
  const set = (on) => {
    clearTimeout(closing);
    open.setAttribute('aria-expanded', String(on));
    if (on) {
      search.classList.remove('closing');
      search.classList.add('show');
      input.focus();
      return;
    }
    if (!search.classList.contains('show')) return;
    // the source slides the form out (500ms) before the bar returns
    search.classList.add('closing');
    closing = setTimeout(() => search.classList.remove('show', 'closing'), 500);
  };
  open.addEventListener('click', () => set(true));
  close.addEventListener('click', () => {
    set(false);
    open.focus();
  });
  let timer;
  input.addEventListener('input', () => {
    clear.hidden = !input.value;
    clearTimeout(timer);
    timer = setTimeout(() => showSuggestions(input.value, suggest), 150);
  });
  clear.addEventListener('click', () => {
    input.value = '';
    clear.hidden = true;
    showSuggestions('', suggest);
    input.focus();
  });
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      set(false);
      open.focus();
    }
  });
  return search;
}

function wireSticky(hdr, spacer) {
  const onScroll = () => {
    if (window.scrollY > 0) {
      if (!hdr.classList.contains('sticky-nav')) {
        spacer.style.paddingTop = `${hdr.offsetHeight}px`;
        hdr.classList.add('sticky-nav');
      }
    } else if (hdr.classList.contains('sticky-nav')) {
      hdr.classList.remove('sticky-nav');
      spacer.style.paddingTop = '0';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
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

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const delegate = getMetadata('header-block');
  if (delegate) {
    block.textContent = '';
    const other = buildBlock(delegate, '');
    block.append(other);
    decorateBlock(other);
    await loadBlock(other);
    return;
  }

  const fragment = await loadNav();
  block.textContent = '';
  if (!fragment) return;
  const { body } = document;
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.querySelector('.default-content-wrapper'));
  const alertsSection = sections.find((s) => s.classList.contains('alerts'));
  const [brand, utility, navSection, tools] = sections.filter((s) => s !== alertsSection);

  const bar = el('div', { class: 'hdr-row' }, buildLogo(brand));
  const hdr = el(
    'div',
    { class: 'hdr' },
    el('div', { class: 'hdr-wrap' }, el('div', { class: 'hdr-bar' }, bar)),
  );

  if (utility || navSection) {
    const nav = buildNav(navSection, body);
    const menu = el(
      'div',
      { class: 'hdr-menu', id: 'hdr-menu' },
      el('div', { class: 'hdr-menu-inner' }, buildUtility(utility), nav),
    );
    const burger = el('button', {
      class: 'hdr-burger',
      type: 'button',
      'aria-label': 'Toggle navigation Menu',
      'aria-controls': 'hdr-menu',
      'aria-expanded': 'false',
    }, el('span', { class: 'hdr-burger-icon' }));
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('show', open);
      body.classList.toggle('hamburger-menu-opened', open);
      document.documentElement.classList.toggle('menu-lock', open);
      // the drawer ends at the viewport bottom wherever the header sits (alerts strip above)
      menu.style.height = open && !isDesktop.matches
        ? `${Math.max(0, window.innerHeight - menu.offsetParent.getBoundingClientRect().bottom)}px`
        : '';
      if (!open) nav.collapseAll();
    });
    document.addEventListener('click', (e) => {
      if (burger.getAttribute('aria-expanded') !== 'true') return;
      if (menu.contains(e.target) || burger.contains(e.target)) return;
      burger.click();
    });
    isDesktop.addEventListener('change', () => {
      if (burger.getAttribute('aria-expanded') === 'true') burger.click();
      nav.collapseAll();
      body.classList.remove('hamburger-menu-opened');
    });
    bar.append(menu, el('div', { class: 'hdr-actions' }, burger, buildSearch(tools)));
  } else {
    hdr.classList.add('hdr-logo-only');
  }

  const spacer = el('div', { class: 'hdr-spacer' }, hdr);
  // the alerts strip sits above <header> (source DOM: outside the header landmark)
  const host = block.closest('header');
  document.querySelectorAll('body > .alerts, body > .menu-backdrop').forEach((old) => old.remove());
  if (alertsSection) {
    const alerts = buildAlerts(alertsSection);
    if (host) host.before(alerts);
    else block.append(alerts);
  }
  block.append(spacer);
  // the backdrop sits outside <header> too (source DOM), so a click on it is a click outside
  const backdrop = el('div', { class: 'menu-backdrop' });
  if (host) host.after(backdrop);
  else block.append(backdrop);
  wireSticky(hdr, spacer);
}
