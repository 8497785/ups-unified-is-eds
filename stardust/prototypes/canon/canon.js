/* InsureShield canon chrome behaviour — lifted from the source header/footer/alerts JS.
   - sticky header: header.sticky-nav once scrollY > 0 (alerts list holds no <li>, so the
     source threshold resolves to 0); .page-root padding-top = header height while stuck.
   - desktop (>=992) mega-menu opens on mouseover of a top-level item, closes on mouseleave.
   - mobile drawer, locale dropdown, search toggle, footer accordion (<992): click. */
(() => {
  const header = document.querySelector('.hdr');
  const mqDesktop = window.matchMedia('(min-width: 992px)');
  const body = document.body;
  const pageRoot = document.querySelector('.page-root') || body;

  // sticky header
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 0) {
        header.classList.add('sticky-nav');
        pageRoot.style.paddingTop = `${header.offsetHeight}px`;
      } else {
        header.classList.remove('sticky-nav');
        pageRoot.style.paddingTop = '0';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // alert close
  document.querySelectorAll('.alerts__close').forEach((btn) => {
    btn.addEventListener('click', () => { btn.closest('.alerts').hidden = true; });
  });

  // mega menu (hover on desktop, toggle on mobile)
  const items = document.querySelectorAll('.hdr__nav-item');
  let closeTimer;
  const collapseAll = () => document.querySelectorAll('.hdr__nav-link.expanded').forEach((l) => {
    l.classList.remove('expanded');
    l.setAttribute('aria-expanded', 'false');
  });
  items.forEach((item) => {
    const link = item.querySelector('.hdr__nav-link');
    const sub = item.querySelector('.hdr__sub');
    if (!sub) return;
    item.addEventListener('mouseover', () => {
      if (!mqDesktop.matches) return;
      clearTimeout(closeTimer);
      collapseAll();
      link.classList.add('expanded');
      link.setAttribute('aria-expanded', 'true');
      body.classList.add('hamburger-menu-opened');
    });
    item.addEventListener('mouseleave', () => {
      if (!mqDesktop.matches) return;
      closeTimer = setTimeout(() => {
        link.classList.remove('expanded');
        link.setAttribute('aria-expanded', 'false');
        body.classList.remove('hamburger-menu-opened');
      }, 100);
    });
    const toggle = item.querySelector('.hdr__nav-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const open = !link.classList.contains('expanded');
        collapseAll();
        link.classList.toggle('expanded', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
  });

  // mobile drawer
  const burger = document.querySelector('.hdr__burger');
  const menu = document.querySelector('.hdr__menu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('show', open);
      body.classList.toggle('hamburger-menu-opened', open);
      document.documentElement.classList.toggle('menu-lock', open);
      if (!open) collapseAll();
    });
  }

  // locale dropdown
  document.querySelectorAll('.hdr__lang').forEach((lang) => {
    const btn = lang.querySelector('.hdr__lang-btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !lang.classList.contains('show');
      lang.classList.toggle('show', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', () => {
      lang.classList.remove('show');
      btn.setAttribute('aria-expanded', 'false');
    });
    lang.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { lang.classList.remove('show'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
  });

  // search toggle
  document.querySelectorAll('.hdr__search').forEach((search) => {
    const open = search.querySelector('.hdr__search-btn');
    const close = search.querySelector('.hdr__search-close');
    const set = (on) => {
      search.classList.toggle('show', on);
      open.setAttribute('aria-expanded', String(on));
      if (on) search.querySelector('input')?.focus();
    };
    open.addEventListener('click', () => set(true));
    close?.addEventListener('click', () => { set(false); open.focus(); });
  });

  // footer accordion (<992)
  document.querySelectorAll('.ftr__heading').forEach((h) => {
    h.addEventListener('click', () => {
      if (mqDesktop.matches) return;
      const on = !h.classList.contains('active');
      h.classList.toggle('active', on);
      h.setAttribute('aria-expanded', String(on));
    });
    h.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h.click(); }
    });
  });
})();
