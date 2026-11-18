/**
 * stats — row of headline figures (source: the home page's embedded stats <style>/<div> row).
 *
 * Decode tier: reconstructive (repeat group). One stat per row (preferred); any cell shape:
 *   - the figure: the first link-free <p> (or heading) of the row, e.g. "62M"
 *   - the label: every further <p> of the row, e.g. "Packages Protected in 2025*"
 * A trailing "*" in a label is wrapped in <sup> at decorate (presentation only, text unchanged).
 * Section head (h3 + lede) is DEFAULT CONTENT before the block, styled in place.
 * Section metadata `anchor` (e.g. `products`) puts an empty in-page anchor before the block —
 * the source's `<div id="products">` that the hero's "Explore Solutions" link targets.
 * The section is painted as the grey band (stats.css, `.stats-container`).
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function supFootnote(label) {
  if (label.querySelector('sup')) return;
  const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
  let last = null;
  while (walker.nextNode()) last = walker.currentNode;
  if (!last || !/\*\s*$/.test(last.nodeValue)) return;
  const idx = last.nodeValue.lastIndexOf('*');
  const tail = last.splitText(idx);
  const sup = document.createElement('sup');
  tail.replaceWith(sup);
  sup.append(tail);
}

function addAnchor(block) {
  const section = block.closest('.section');
  const wrapper = block.parentElement;
  const id = section && section.dataset.anchor;
  if (!id || document.getElementById(id) || !wrapper) return;
  const anchor = document.createElement('div');
  anchor.id = id;
  wrapper.before(anchor);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .stats-row')) return;
  const row = document.createElement('div');
  row.className = 'stats-row';
  [...block.children].forEach((r) => {
    const nodes = [...r.children].flatMap((cell) => [...cell.children]);
    if (!nodes.length) return;
    const item = document.createElement('div');
    item.className = 'stats-item';
    const [figure, ...labels] = nodes;
    item.append(wrapNode(figure, 'stats-number'));
    if (labels.length) {
      const label = document.createElement('div');
      label.className = 'stats-label';
      label.append(...labels);
      labels.forEach(supFootnote);
      item.append(label);
    }
    row.append(item);
  });
  block.replaceChildren(row);
  addAnchor(block);
}
