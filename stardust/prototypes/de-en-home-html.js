/* de-en-home-html page widgets.
   1) Testimonial carousel (source: AEM core carousel, data-cmp-autoplay, data-cmp-delay=5000,
      autopause disabled). Observed live: the active slide swaps (no transition) on a 5 s timer
      and on prev / next / indicator clicks; slides wrap around.
   2) Resource cards "Load More" (source: story-card--withLoadmore): 3 cards shown, each click
      reveals the next 3; the button hides once every card is shown. */
(() => {
  document.querySelectorAll('.fpromo').forEach((root) => {
    const slides = [...root.querySelectorAll('.fpromo__slide')];
    const dots = [...root.querySelectorAll('.fpromo__dot')];
    const delay = Number(root.dataset.delay) || 5000;
    let index = 0;
    let timer;
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => {
        const on = n === index;
        s.hidden = !on;
        s.classList.toggle('is-active', on);
      });
      dots.forEach((d, n) => {
        const on = n === index;
        d.classList.toggle('is-active', on);
        d.setAttribute('aria-selected', String(on));
        d.tabIndex = on ? 0 : -1;
      });
    };
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => show(index + 1), delay);
    };
    root.querySelector('.fpromo__arrow--prev').addEventListener('click', () => { show(index - 1); restart(); });
    root.querySelector('.fpromo__arrow--next').addEventListener('click', () => { show(index + 1); restart(); });
    dots.forEach((d, n) => {
      d.addEventListener('click', () => { show(n); restart(); });
      d.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(n); restart(); }
      });
    });
    show(0);
    restart();
  });

  document.querySelectorAll('.rcards').forEach((root) => {
    const step = Number(root.dataset.step) || 3;
    const items = [...root.querySelectorAll('.rcards__item')];
    const more = root.querySelector('.rcards__more');
    const btn = root.querySelector('.rcards__more-btn');
    const sync = () => { more.hidden = items.every((it) => !it.hidden); };
    btn.addEventListener('click', () => {
      items.filter((it) => it.hidden).slice(0, step).forEach((it) => { it.hidden = false; });
      sync();
    });
    sync();
  });
})();
