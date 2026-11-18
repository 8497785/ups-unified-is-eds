/**
 * check-card — a framed checklist card: a teal header bar with a heading over a white panel of
 * check-marked lines (source: an embed component's inline-styled card on
 * /us/en/partners/3pl-partners "With shipping protection available").
 *
 * Authoring (any row/cell shape — content is queried, never indexed):
 *   - a heading (any level) → the header bar
 *   - list items (<ul>/<ol>) and/or further paragraphs → one checked line each
 * Decode tier: reconstructive (content queried).
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .check-card-head')) return;
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const lines = [];
  block.querySelectorAll('li').forEach((li) => {
    if (li.textContent.trim()) lines.push([...li.childNodes]);
  });
  block.querySelectorAll('p').forEach((p) => {
    if (p.textContent.trim() && !p.closest('li')) lines.push([...p.childNodes]);
  });

  const head = document.createElement('div');
  head.className = 'check-card-head';
  if (heading) head.append(heading);

  const list = document.createElement('ul');
  list.className = 'check-card-list';
  lines.forEach((nodes) => {
    const li = document.createElement('li');
    const text = document.createElement('span');
    text.append(...nodes);
    li.append(text);
    list.append(li);
  });

  block.replaceChildren(...(heading ? [head] : []), ...(lines.length ? [list] : []));
}
