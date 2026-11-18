/* Story-card carousels (source: slick, story-card.lc.js). 3 per view >=992, 2 at 768-991,
   1 below 768; slidesToScroll = per view (one dot per page); arrows + dots only when there are
   more slides than the view holds; no autoplay; track transform 500ms. */
(() => {
  document.querySelectorAll('.stories').forEach((root) => {
    const viewport = root.querySelector('.stories__viewport');
    const track = root.querySelector('.stories__track');
    const slides = [...root.querySelectorAll('.stories__slide')];
    const controls = root.querySelector('.stories__controls');
    const prev = root.querySelector('.stories__arrow--prev');
    const next = root.querySelector('.stories__arrow--next');
    const dotList = root.querySelector('.stories__dots');
    let dots = [];
    let page = 0;
    const perView = () => (window.matchMedia('(min-width: 992px)').matches ? 3
      : window.matchMedia('(min-width: 768px)').matches ? 2 : 1);
    const buildDots = (n) => {
      if (dots.length === n) return;
      dotList.textContent = '';
      dots = Array.from({ length: n }, (_, i) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'stories__dot'; b.setAttribute('aria-label', 'Go to slide');
        b.addEventListener('click', () => { page = i; render(); });
        li.append(b); dotList.append(li); return li;
      });
    };
    const render = () => {
      const pv = perView();
      const pages = Math.max(1, Math.ceil(slides.length / pv));
      page = Math.min(page, pages - 1);
      buildDots(pages);
      controls.hidden = slides.length <= pv;
      const first = Math.min(page * pv, slides.length - pv);
      const step = viewport.clientWidth / pv;
      track.style.transform = first > 0 ? `translateX(${-first * step}px)` : '';
      slides.forEach((s, i) => {
        const off = i < first || i >= first + pv;
        s.setAttribute('aria-hidden', String(off));
        s.classList.toggle('is-active', !off); // mirrors slick's .slick-active on on-view slides
        s.querySelector('a').tabIndex = off ? -1 : 0;
      });
      prev.disabled = page === 0;
      next.disabled = page >= pages - 1;
      dots.forEach((li, i) => {
        li.classList.toggle('is-active', i === page);
        const b = li.querySelector('button');
        if (i === page) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
    };
    prev.addEventListener('click', () => { page = Math.max(0, page - 1); render(); });
    next.addEventListener('click', () => { page += 1; render(); });
    window.addEventListener('resize', render);
    render();
  });
})();
