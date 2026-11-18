/**
 * featured-promo — auto-rotating testimonial carousel (source: AEM core carousel with
 * featured-promo teasers; data-cmp-autoplay, delay 5000 ms, autopause disabled).
 *
 * Decode tier: reconstructive (slides are the repeat group). One slide per row (preferred);
 * a flattened single cell is segmented on the image that opens each slide.
 * Per slide, authored in order:
 *   - the photo: <picture>/<img> (editorial)
 *   - the quote and attribution: link-free <p>s (<strong> quote, <em> attribution)
 *   - CTA: <p><strong><a href="…">Read More</a></strong></p>
 * Variant `content-right` (source teasers without ups-teaser__content-left, e.g. ca/en, it/en,
 * it/it): photo left, quote right on tablet/desktop.
 * Behaviour (replica captureState restoreAtDelivery): the active slide swaps every 5 s with no
 * transition and wraps; prev / next clicks swap and restart the timer; an indicator click (or
 * Enter / Space on it) selects that slide and stops autoplay — measured on the live source
 * (2026-11-18: after an indicator click the live carousel holds the slide for 14 s+).
 * Controls carry aria-labels only (no visible words added).
 * Section head (h2) is DEFAULT CONTENT before the block, styled in place.
 */

const DELAY = 5000;

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function addChevron(a) {
  if (a.querySelector('.upspr-icon-chevronright')) return;
  const icon = document.createElement('span');
  icon.className = 'upspr-icon-chevronright';
  icon.setAttribute('aria-hidden', 'true');
  a.append(icon);
}

function expand(cell) {
  const kids = [...cell.children];
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].querySelector('picture, img')) {
    return [...kids[0].children];
  }
  return kids;
}

function groupsOf(block) {
  const rows = [...block.children];
  const withMedia = rows.filter((r) => r.querySelector('picture, img'));
  if (rows.length > 1 || withMedia.length <= 1) {
    return rows.map((r) => [...r.children].flatMap(expand));
  }
  const groups = [];
  [...rows[0].children].flatMap(expand).forEach((n) => {
    if (n.matches('picture, img') || n.querySelector('picture, img') || !groups.length) {
      groups.push([]);
    }
    groups[groups.length - 1].push(n);
  });
  return groups;
}

function buildSlide(nodes, i, total) {
  const slide = document.createElement('div');
  slide.className = 'featured-promo-slide';
  slide.id = `featured-promo-slide-${i + 1}`;
  slide.setAttribute('role', 'tabpanel');
  slide.setAttribute('aria-roledescription', 'slide');
  slide.setAttribute('aria-label', `${i + 1} / ${total}`);
  const inner = document.createElement('div');
  inner.className = 'featured-promo-inner';
  const row = document.createElement('div');
  row.className = 'featured-promo-row';
  const mediaBox = document.createElement('div');
  mediaBox.className = 'featured-promo-media';
  const content = document.createElement('div');
  content.className = 'featured-promo-content';
  const desc = document.createElement('div');
  desc.className = 'featured-promo-desc';
  const actions = document.createElement('div');
  actions.className = 'featured-promo-actions';
  nodes.forEach((n) => {
    const media = n.matches('picture, img') ? n : n.querySelector('picture, img');
    if (media && !n.querySelector('a') && !mediaBox.children.length) {
      mediaBox.append(media.closest('picture') || media);
    } else if (n.tagName === 'P' && n.querySelector('a')) {
      n.querySelectorAll('a.button').forEach(addChevron);
      actions.append(n);
    } else if (n.textContent.trim() || n.querySelector('picture, img')) {
      desc.append(n);
    }
  });
  content.append(desc);
  if (actions.children.length) content.append(actions);
  row.append(mediaBox, content);
  inner.append(row);
  slide.append(wrapNode(inner, 'featured-promo-item'));
  return slide;
}

function arrow(dir, label) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `featured-promo-arrow featured-promo-${dir}`;
  b.setAttribute('aria-label', label);
  const icon = document.createElement('span');
  icon.className = dir === 'prev' ? 'upspr-icon-chevronleft' : 'upspr-icon-chevronright';
  icon.setAttribute('aria-hidden', 'true');
  b.append(icon);
  return b;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .featured-promo-slides')) return;
  const groups = groupsOf(block).filter((g) => g.length);
  const slidesBox = document.createElement('div');
  slidesBox.className = 'featured-promo-slides';
  const slides = groups.map((g, i) => buildSlide(g, i, groups.length));
  slidesBox.append(...slides);
  block.replaceChildren(slidesBox);
  block.setAttribute('role', 'group');
  block.setAttribute('aria-roledescription', 'carousel');
  if (slides.length < 2) return;

  const bar = document.createElement('div');
  bar.className = 'featured-promo-bar';
  const prev = arrow('prev', 'Previous');
  const next = arrow('next', 'Next');
  const dotList = document.createElement('ol');
  dotList.className = 'featured-promo-dots';
  dotList.setAttribute('role', 'tablist');
  const dots = slides.map((s, i) => {
    const dot = document.createElement('li');
    dot.className = 'featured-promo-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-controls', s.id);
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dotList.append(dot);
    return dot;
  });
  bar.append(prev, dotList, next);
  slidesBox.append(bar);

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
    timer = setInterval(() => {
      if (!block.isConnected) {
        clearInterval(timer);
        return;
      }
      show(index + 1);
    }, DELAY);
  };
  prev.addEventListener('click', () => {
    show(index - 1);
    restart();
  });
  next.addEventListener('click', () => {
    show(index + 1);
    restart();
  });
  dots.forEach((d, n) => {
    d.addEventListener('click', () => {
      show(n);
      clearInterval(timer);
    });
    d.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(n);
        clearInterval(timer);
      }
    });
  });
  show(0);
  restart();
}
