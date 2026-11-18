/**
 * featured-list — image beside an icon checklist with a CTA (source: featured-list,
 * withImageLeft + withsideIcons).
 *
 * Decode tier: reconstructive (the checklist is the repeat group).
 * Authoring (rows in any order; classified by content):
 *   - an image row: <picture>/<img> — the editorial photo (left on desktop)
 *   - one row per list item: the item title — a <p> holding only <strong> text (the source's
 *     bold title; a heading <h3> is accepted too) — then its description <p>s
 *   - a CTA row: <p><strong><a></a></strong></p> (a plain <p><a> inside an item row stays in
 *     that item as a text link)
 * Variant `h5-titles`: source h5 item titles (20 / 24px, weight 400).
 * Variant `small-titles`: body-size item titles (source list__title <p>, e.g. gb/en) where the
 * archetype's are h6-size.
 * The checkmark beside each item is decorative (CSS only, blocks/featured-list/checkmark.svg).
 * Section head (h2 + lede) is DEFAULT CONTENT before the block, styled in place.
 */

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

// a bold-only <p> is an item title, also when it carries an inline link (`<p><strong>Set up …
// <a>registration page</a></strong></p>`); a buttonized CTA never is
const isTitle = (n) => /^H[1-6]$/.test(n.tagName) || (n.tagName === 'P'
  && !n.querySelector('a.button') && n.querySelector('strong, b') && n.textContent.trim()
  === [...n.querySelectorAll('strong, b')].map((s) => s.textContent).join('').trim());

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].children];
    }
    out.push(...kids);
  });
  return out;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .featured-list-row')) return;
  const nodes = collectNodes(block);
  const mediaBox = document.createElement('div');
  mediaBox.className = 'featured-list-media';
  const main = document.createElement('div');
  main.className = 'featured-list-main';
  const list = document.createElement('ul');
  list.className = 'featured-list-items';
  const actions = document.createElement('div');
  actions.className = 'featured-list-actions';

  let item = null;
  nodes.forEach((n) => {
    const media = n.matches('picture, img') ? n : n.querySelector('picture, img');
    if (media && !n.querySelector('a') && !mediaBox.children.length) {
      mediaBox.append(media.closest('picture') || media);
      return;
    }
    if (n.tagName === 'P' && n.querySelector('a') && n.textContent.trim() && !isTitle(n)
      && (n.querySelector('a.button') || !item)) {
      n.querySelectorAll('a.button').forEach(addChevron);
      actions.append(n);
      return;
    }
    if (isTitle(n)) {
      item = document.createElement('li');
      item.className = 'featured-list-item';
      const icon = document.createElement('span');
      icon.className = 'featured-list-icon';
      icon.setAttribute('aria-hidden', 'true');
      const content = document.createElement('div');
      content.className = 'featured-list-content';
      content.append(wrapNode(n, 'featured-list-title'));
      item.append(icon, content);
      list.append(item);
      return;
    }
    if (!n.textContent.trim() && !n.querySelector('picture, img')) return;
    if (item) {
      item.querySelector('.featured-list-content').append(wrapNode(n, 'featured-list-desc'));
    } else {
      main.append(wrapNode(n, 'featured-list-desc'));
    }
  });

  if (list.children.length) main.append(list);
  if (actions.children.length) main.append(actions);
  const row = document.createElement('div');
  row.className = 'featured-list-row';
  if (mediaBox.children.length) row.append(mediaBox);
  row.append(main);
  block.replaceChildren(row);
}
