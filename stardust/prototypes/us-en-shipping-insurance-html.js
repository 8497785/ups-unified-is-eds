/* us-en-shipping-insurance-html — page behaviours observed on live (motion-observe):
   1. sticky header hides on scroll down, returns on scroll up (data-hidden; translate/opacity transitions in CSS)
   2. "Quote monthly cost" dock fades in once the hero calculator is scrolled past
   3. FAQ disclosures expand/collapse (block-size transition, duration-slow) */
(() => {
  const header = document.querySelector('.sh-header');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) {
      const h = header.offsetHeight;
      if (y > lastY && y > h) header.setAttribute('data-hidden', '');
      else if (y < lastY || y <= h) header.removeAttribute('data-hidden');
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const dock = document.querySelector('.sh-dock');
  const calc = document.querySelector('.sh-calc');
  if (dock && calc && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      const past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      if (past) {
        dock.setAttribute('data-visible', '');
        dock.removeAttribute('inert');
        dock.removeAttribute('aria-hidden');
      } else {
        dock.removeAttribute('data-visible');
        dock.setAttribute('inert', '');
        dock.setAttribute('aria-hidden', 'true');
      }
    }).observe(calc);
  }

  document.querySelectorAll('.sh-faq__trigger').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    const inner = panel.firstElementChild;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (!open) {
        panel.removeAttribute('hidden');
        panel.removeAttribute('aria-hidden');
        panel.style.setProperty('--disclosure-panel-height', `${inner.scrollHeight}px`);
      } else {
        panel.setAttribute('aria-hidden', 'true');
        panel.style.setProperty('--disclosure-panel-height', '0px');
        panel.addEventListener('transitionend', () => {
          if (btn.getAttribute('aria-expanded') === 'false') panel.setAttribute('hidden', 'until-found');
        }, { once: true });
      }
    });
    panel.addEventListener('beforematch', () => { if (btn.getAttribute('aria-expanded') !== 'true') btn.click(); });
  });
})();
