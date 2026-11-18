/**
 * data-table — a source rich-text / layout table (comparison of coverage options, score
 * recommendations, declared-value questions) rendered as a real <table>.
 *
 * Authoring: one block row per table row, one cell per column; the first row is the header
 * row (column labels, may hold links). A bare <table> in a DA document cannot be used: the
 * pipeline reads its first row as a block name and drops it.
 * @variants block class: none (default) — header row rendered as <th>
 * Decode tier: reconstructive (rows are the repeat group). Cells keep their authored nodes (EW7).
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const td = document.createElement(i === 0 ? 'th' : 'td');
      if (i === 0) td.scope = 'col';
      td.append(...cell.childNodes);
      tr.append(td);
    });
    (i === 0 ? thead : tbody).append(tr);
  });
  table.append(thead, tbody);
  const scroller = document.createElement('div');
  scroller.className = 'data-table-scroll';
  scroller.append(table);
  block.replaceChildren(scroller);
}
