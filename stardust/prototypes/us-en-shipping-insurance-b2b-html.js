/* Story-card carousel (source: slick, story-card.lc.js). 3 per view >=992, 2 at 768-991,
   1 below 768; arrows + dots only when there are more slides than the view holds; no autoplay. */
(() => {
  document.querySelectorAll('.stories').forEach((root) => {
    const track = root.querySelector('.stories__track');
    const slides = [...root.querySelectorAll('.stories__slide')];
    const controls = root.querySelector('.stories__controls');
    const prev = root.querySelector('.stories__arrow--prev');
    const next = root.querySelector('.stories__arrow--next');
    const dotList = root.querySelector('.stories__dots');
    let dots = [];
    const buildDots = (n) => {
      if (dots.length === n) return;
      dotList.textContent = '';
      dots = Array.from({ length: n }, (_, i) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'stories__dot'; b.setAttribute('aria-label', 'Go to slide');
        b.addEventListener('click', () => { index = i; render(); });
        li.append(b); dotList.append(li); return li;
      });
    };
    let index = 0;
    const perView = () => (window.matchMedia('(min-width: 992px)').matches ? 3
      : window.matchMedia('(min-width: 768px)').matches ? 2 : 1);
    const render = () => {
      const pv = perView();
      const pages = Math.max(1, slides.length - pv + 1);
      index = Math.min(index, pages - 1);
      buildDots(pages);
      controls.hidden = slides.length <= pv;
      const step = root.querySelector('.stories__viewport').clientWidth / pv;
      track.style.transform = index ? `translateX(${-index * step}px)` : '';
      prev.disabled = index === 0;
      next.disabled = index >= pages - 1;
      dots.forEach((li, i) => {
        li.classList.toggle('is-active', i === index);
        const b = li.querySelector('button');
        if (i === index) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
    };
    prev.addEventListener('click', () => { index = Math.max(0, index - 1); render(); });
    next.addEventListener('click', () => { index += 1; render(); });
    window.addEventListener('resize', render);
    render();
  });
})();
