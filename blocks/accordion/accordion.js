/**
 * accordion — FAQ-style collapsible items (source: core accordion, ups-accordion theme), all
 * collapsed at rest; also used for the source's vertical tabs (variant `tabs`).
 *
 * Authoring: one row per item — cell 1 the item title (a <p> or heading), cell 2 the panel
 * content (paragraphs, lists, links, images).
 * @variants block class: tabs (default none) — the source's vertical tabs: tab list beside
 *   the selected panel (>= 992), tab row above it below 992
 * Section head (h2 + lede) is default content before the block, styled in place.
 * Decode tier: reconstructive (one item per row). The whole title row toggles; the chevron
 * button carries the aria state (EW7: the authored title is never inside the button).
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

let uid = 0;

/* variant `tabs`: the source's vertical tabs (ups-tabs vertical) — a tab list beside one
   visible panel; the first tab is selected at rest. Titles stay the authored nodes (EW7). */
function decorateTabs(block, rows) {
  const list = div('accordion-tablist');
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-orientation', 'vertical');
  const panels = div('accordion-panels');
  const tabs = [];
  rows.forEach((row, i) => {
    const cells = [...row.children];
    uid += 1;
    const tab = div('accordion-tab');
    tab.id = `accordion-tab-${uid}`;
    tab.setAttribute('role', 'tab');
    tab.tabIndex = i ? -1 : 0;
    if (cells[0]) tab.append(...cells[0].childNodes);
    const panel = div('accordion-tabpanel');
    panel.id = `accordion-tabpanel-${uid}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    tab.setAttribute('aria-controls', panel.id);
    cells.slice(1).forEach((c) => panel.append(...c.childNodes));
    tabs.push([tab, panel]);
    list.append(tab);
    panels.append(panel);
  });
  const select = (idx) => tabs.forEach(([t, p], i) => {
    t.setAttribute('aria-selected', String(i === idx));
    t.tabIndex = i === idx ? 0 : -1;
    p.hidden = i !== idx;
  });
  tabs.forEach(([t], i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const d = {
        ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1,
      }[e.key];
      if (!d) return;
      e.preventDefault();
      const n = (i + d + tabs.length) % tabs.length;
      select(n);
      tabs[n][0].focus();
    });
  });
  select(0);
  block.replaceChildren(list, panels);
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (block.classList.contains('tabs')) {
    decorateTabs(block, rows);
    return;
  }
  const items = rows.map((row) => {
    const cells = [...row.children];
    const item = div('accordion-item');
    const head = div('accordion-head');
    const title = div('accordion-title');
    const panel = div('accordion-panel');
    uid += 1;
    panel.id = `accordion-panel-${uid}`;
    panel.hidden = true;
    if (cells[0]) title.append(...cells[0].childNodes);
    cells.slice(1).forEach((c) => panel.append(...c.childNodes));
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'accordion-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', panel.id);
    btn.setAttribute('aria-label', title.textContent.trim() || 'Toggle');
    head.append(title, btn);
    item.append(head, panel);
    const toggle = () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      item.classList.toggle('is-open', open);
    };
    head.addEventListener('click', toggle);
    return item;
  });
  block.replaceChildren(...items);
}
