/* region-selector widget — observed on live (stardust/replica/motion/us-en-global-html.json):
   click toggle → .ups-active on item, toggle and the linked map region (chevron rotates .5s, colours .15s);
   hover toggle → .ups-mousein on the toggle and its map region. */
(() => {
  const acc = document.querySelector('.rsel__acc');
  if (!acc) return;
  const pairs = [...acc.querySelectorAll('.rsel__toggle')].map((toggle) => ({
    toggle,
    item: toggle.closest('.rsel__item'),
    region: document.getElementById(toggle.dataset.region),
  }));
  const setOpen = (pair, open) => {
    pair.item.classList.toggle('ups-active', open);
    pair.toggle.classList.toggle('ups-active', open);
    pair.toggle.setAttribute('aria-expanded', String(open));
    if (pair.region) pair.region.classList.toggle('ups-active', open);
  };
  const activate = (pair) => {
    const open = !pair.item.classList.contains('ups-active');
    pairs.forEach((p) => { if (p !== pair) setOpen(p, false); });
    setOpen(pair, open);
  };
  const hover = (pair, on) => {
    pair.toggle.classList.toggle('ups-mousein', on);
    if (pair.region) pair.region.classList.toggle('ups-mousein', on);
  };
  pairs.forEach((pair) => {
    pair.toggle.addEventListener('click', () => activate(pair));
    pair.toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(pair); }
    });
    // live: hovering a toggle adds .ups-mousein to it and its map region (map hover itself is CSS :hover only)
    pair.toggle.addEventListener('mouseenter', () => hover(pair, true));
    pair.toggle.addEventListener('mouseleave', () => hover(pair, false));
    if (pair.region) pair.region.addEventListener('click', () => activate(pair));
  });
})();
