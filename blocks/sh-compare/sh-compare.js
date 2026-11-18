/**
 * sh-compare — shipping-hub comparison table (carrier liability vs shipping insurance).
 * Decode tier: reconstructive (one row per compared topic); the section head is default
 * content before the block and is reabsorbed into the block's intro.
 *
 * Authoring rows:
 *   1. header row — column labels: topic column | comparison column | emphasised column (last)
 *   2..N. topic rows — <img> + topic name | carrier answer | insurance answer
 *
 * @ew-exempt <div> per-cell column tag — presentational clone of the header label (small screens)
 */

const SVG = {
  check: '<svg class="sh-icon sh-compare-check" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="m421-389-98-98q-9-9-22-9t-23 10q-9 9-9 22t9 22l122 123q9 9 21 9t21-9l239-239q10-10 10-23t-10-23q-10-9-23.5-8.5T635-603L421-389Zm59 309q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>',
};

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  });
  children.flat().filter(Boolean).forEach((c) => node.append(c));
  return node;
}
// Move every child node of an authored cell (keeps the editor's indices on them).
function moveChildren(from, to) {
  while (from && from.firstChild) to.append(from.firstChild);
  return to;
}
function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

/** Reabsorb the section head (default content right before the block wrapper). */
function takeSectionHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return null;
  const heading = prev.querySelector('h1, h2, h3');
  if (!heading) return null;
  const intro = el('div', { class: 'sh-intro sh-intro-page' }, el('div', { class: 'sh-intro-title' }, heading));
  if (!prev.children.length) prev.remove();
  return intro;
}

export default function decorate(block) {
  const rows = [...block.children];
  const isHeader = (row) => !row.querySelector('picture, img');
  const headerRow = rows.find(isHeader);
  const bodyRows = rows.filter((r) => r !== headerRow);
  const intro = takeSectionHead(block);

  const headCells = headerRow ? [...headerRow.children] : [];
  const last = headCells.length - 1;
  const thead = el('thead');
  const headTr = el('tr');
  headCells.forEach((cell, i) => {
    let cls = 'sh-compare-head';
    if (i > 0) cls += ' sh-compare-head-answer';
    if (i > 0 && i === last) cls += ' sh-compare-head-emph';
    headTr.append(el('th', { scope: 'col', class: cls }, moveChildren(cell, el('div', { class: 'sh-compare-col' }))));
  });
  thead.append(headTr);
  const labels = [...headTr.querySelectorAll('.sh-compare-col')];

  const tbody = el('tbody');
  bodyRows.forEach((row) => {
    const cells = [...row.children];
    const topicCell = cells.find((c) => c.querySelector('picture, img')) || cells[0];
    const valueCells = cells.filter((c) => c !== topicCell);
    const tr = el('tr');
    const pic = topicCell.querySelector('picture') || topicCell.querySelector('img');
    const picPara = pic ? pic.closest('p') : null;
    const art = el('div', { class: 'sh-compare-art' }, el('div', { class: 'sh-illo', 'aria-hidden': 'true' }, pic));
    if (picPara && !picPara.textContent.trim()) picPara.remove();
    tr.append(el(
      'th',
      { scope: 'row', class: 'sh-compare-topic' },
      art,
      moveChildren(topicCell, el('div', { class: 'sh-compare-topic-title' })),
    ));
    valueCells.forEach((cell, i) => {
      const col = i + 1;
      const emph = col === last;
      const td = el('td', { class: emph ? 'sh-compare-value sh-compare-value-emph' : 'sh-compare-value' });
      if (labels[col]) {
        const tag = stripInstrumentation(labels[col].cloneNode(true));
        tag.className = 'sh-compare-tag';
        td.append(tag);
      }
      const answer = el('div', { class: 'sh-compare-answer' });
      if (emph) answer.insertAdjacentHTML('afterbegin', SVG.check);
      answer.append(moveChildren(cell, el('div', { class: 'sh-compare-text' })));
      td.append(answer);
      tr.append(td);
    });
    tbody.append(tr);
  });

  const table = el('div', { class: 'sh-compare-table' }, el('table', {}, thead, tbody));
  block.replaceChildren(el('div', { class: 'sh-container' }, intro, table));
}
