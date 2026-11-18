/**
 * pathways-cards — grid of pathway cards (source: pathways / column-control services).
 *
 * Decode tier: reconstructive (repeat group). One card per row (preferred); a flattened single
 * cell is segmented on the image that opens each card.
 * Per card, authored in order:
 *   - an image (<picture>/<img>): a 16:9 photo (default) or a 72 px icon (`icon` variant)
 *   - title: the first link-free <p>
 *   - text: further link-free <p>s (and lists)
 *   - optional link: <p><a href="…">Learn more</a></p> (plain link → text link with chevron)
 * Variants: `icon` (72 px icon cards, de/en home), default = photo cards (home, contact-us).
 * Section head (h2 + lede) is DEFAULT CONTENT before the block; a lone CTA after the block
 * is default content too — both are styled in place (no reabsorption).
 * Used by the locale-home, home and form templates (plan.json reuse).
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
  // flattened single cell: an image opens each card
  const groups = [];
  [...rows[0].children].flatMap(expand).forEach((n) => {
    if (n.matches('picture, img') || n.querySelector('picture, img') || !groups.length) {
      groups.push([]);
    }
    groups[groups.length - 1].push(n);
  });
  return groups;
}

function buildCard(nodes) {
  const card = document.createElement('div');
  card.className = 'pathways-cards-card';
  const media = nodes.map((n) => (n.matches('picture, img') ? n : n.querySelector('picture, img')))
    .find(Boolean);
  // the node holding the image, found BEFORE the image moves out (an image authored as
  // <p><img></p> beside the copy leaves that <p> empty — never a title)
  const holder = media && nodes.find((n) => n === media || n.contains(media));
  if (media) card.append(wrapNode(media.closest('picture') || media, 'pathways-cards-image'));
  const body = document.createElement('div');
  body.className = 'pathways-cards-body';
  const main = document.createElement('div');
  main.className = 'pathways-cards-main';
  let title = null;
  const links = [];
  nodes.forEach((n) => {
    if (media && (n === holder || n === media || n.contains(media))) return;
    if (n.tagName === 'P' && n.querySelector('a')) {
      links.push(n);
    } else if (!title && n.textContent.trim()
      && (n.tagName === 'P' || /^H[1-6]$/.test(n.tagName))) {
      title = n;
      main.append(wrapNode(n, 'pathways-cards-title'));
    } else if (n.textContent.trim() || n.querySelector('picture, img')) {
      main.append(wrapNode(n, 'pathways-cards-text'));
    }
  });
  body.append(main);
  if (links.length) {
    const link = document.createElement('div');
    link.className = 'pathways-cards-link';
    links.forEach((p) => {
      p.querySelectorAll('a').forEach(addChevron);
      link.append(p);
    });
    body.append(link);
  }
  card.append(body);
  return card;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .pathways-cards-list')) return;
  const list = document.createElement('div');
  list.className = 'pathways-cards-list';
  groupsOf(block).filter((g) => g.length).forEach((g) => {
    list.append(wrapNode(buildCard(g), 'pathways-cards-item'));
  });
  block.replaceChildren(list);
}
