/**
 * office-list — country picker + office address card (source: office-list / officeListing on
 * /us/en/about/our-locations).
 *
 * Authoring (classified by content, never by row index):
 *   - the picker: a cell holding a list (<ul>) of countries, the selected one in <strong>;
 *     a link-free <p> beside it in the same row is the picker label ("Select Country")
 *   - the office: every other heading / paragraph — <h4> country, <h5> office name, address
 *     <p>s, phone (<a href="tel:…">) and email (<a href="mailto:…">) link paragraphs
 * Decode tier: template-slotted (fixed composition; authored nodes are MOVED into slots).
 * The picker's current-value text is a presentational copy of the selected item (EW4); the
 * dropdown opens/closes and marks the chosen country. The source swaps in each country's office
 * experience fragment — those fragments were not captured, so the office card stays the
 * authored one (dynamic-features residual).
 * Re-entrant: a decorated block (`.office-list-dropdown` present) is left as is.
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

function stripInstrumentation(el) {
  el.querySelectorAll('[data-aue-resource], [data-aue-prop], [data-richtext-prop]').forEach((n) => {
    ['data-aue-resource', 'data-aue-prop', 'data-aue-type', 'data-aue-label',
      'data-richtext-prop'].forEach((a) => n.removeAttribute(a));
  });
  return el;
}

function addIcon(a, name) {
  if (a.querySelector(`.upspr-icon-${name}`)) return;
  const icon = document.createElement('span');
  icon.className = `upspr-icon-${name}`;
  icon.setAttribute('aria-hidden', 'true');
  a.prepend(icon);
}

export default function decorate(block) {
  if (block.querySelector('.office-list-dropdown')) return;
  const rows = [...block.children];
  let list = null;
  let label = null;
  const office = [];
  rows.forEach((row) => {
    const nodes = [...row.children].flatMap((cell) => [...cell.children]);
    const ul = nodes.find((n) => n.tagName === 'UL' || n.tagName === 'OL');
    nodes.forEach((n) => {
      if (n === ul && !list) list = n;
      else if (ul && !label && n.tagName === 'P' && !n.querySelector('a')) label = n;
      else office.push(n);
    });
  });

  const dropdown = div('office-list-dropdown');
  if (label) {
    const lw = div('office-list-label');
    lw.append(label);
    dropdown.append(lw);
  }
  if (list) {
    const picker = div('office-list-picker');
    const current = document.createElement('span');
    current.className = 'office-list-current';
    current.setAttribute('role', 'button');
    current.tabIndex = 0;
    current.setAttribute('aria-haspopup', 'listbox');
    current.setAttribute('aria-expanded', 'false');
    const currentText = document.createElement('span');
    currentText.className = 'office-list-current-text';
    const chevron = document.createElement('span');
    chevron.className = 'upspr-icon-chevrondown';
    chevron.setAttribute('aria-hidden', 'true');
    current.append(currentText, chevron);
    const items = [...list.querySelectorAll(':scope > li')];
    const select = (li) => {
      items.forEach((i) => i.classList.toggle('selected', i === li));
      currentText.textContent = '';
      currentText.append(stripInstrumentation(li.cloneNode(true)).textContent.trim());
    };
    select(items.find((li) => li.querySelector('strong, b')) || items[0]);
    const toggle = (open) => {
      picker.classList.toggle('expanded', open);
      current.setAttribute('aria-expanded', String(open));
    };
    current.addEventListener('click', () => toggle(!picker.classList.contains('expanded')));
    current.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(!picker.classList.contains('expanded'));
      }
    });
    items.forEach((li) => li.addEventListener('click', () => {
      select(li);
      toggle(false);
    }));
    document.addEventListener('click', (e) => {
      if (!picker.contains(e.target)) toggle(false);
    });
    picker.append(current, list);
    dropdown.append(picker);
  }

  const card = div('office-list-office');
  office.forEach((n) => {
    n.classList.remove('button-wrapper');
    n.querySelectorAll('a').forEach((a) => {
      a.classList.remove('button', 'primary', 'secondary');
      if (/^tel:/i.test(a.getAttribute('href') || '')) addIcon(a, 'phone');
      if (/^mailto:/i.test(a.getAttribute('href') || '')) addIcon(a, 'email');
    });
    card.append(n);
  });
  block.replaceChildren(dropdown, card);
}
