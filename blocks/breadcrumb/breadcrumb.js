/**
 * breadcrumb — grey trail band under the header on every inner page (source: cmp-breadcrumb).
 * Look lives in styles/styles.css (foundation `.breadcrumb`); this block only adds the capped
 * container and the landmark.
 *
 * Authoring: one cell holding a list (<ol> or <ul>) — one item per crumb, ancestors as links,
 * the current page (optional) as plain text.
 * Decode tier: template-slotted (the authored list is MOVED into the nav).
 * A plain-text current crumb is wrapped in a <span> (source: .cmp-breadcrumb__item > span), so
 * the foundation's `.breadcrumb li > span` styles it.
 */
export default function decorate(block) {
  const list = block.querySelector('ol, ul');
  if (!list) return;
  list.querySelectorAll(':scope > li').forEach((li) => {
    if (li.querySelector('a') || !li.textContent.trim()) return;
    if (li.children.length === 1 && li.firstElementChild.tagName === 'SPAN'
      && li.textContent.trim() === li.firstElementChild.textContent.trim()) return;
    const span = document.createElement('span');
    span.textContent = li.textContent.trim();
    li.replaceChildren(span);
  });
  const container = document.createElement('div');
  container.className = 'container';
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  nav.append(list);
  container.append(nav);
  block.replaceChildren(container);
}
