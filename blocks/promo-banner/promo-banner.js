/**
 * promo-banner — teal banner card with heading, copy and a CTA pair (source: secondarypromo
 * "insureshieldteal").
 *
 * Authoring (any row/cell shape — content is queried, never indexed):
 *   - heading: <h2>
 *   - copy: paragraphs / lists
 *   - CTAs: one paragraph per link — <strong><em> = yellow accent (the source's yellow
 *     primary), <strong> = teal primary, <em> = outline secondary
 *   - optional note: paragraphs AFTER the CTAs (source cmp-teaser__additionalText, small print)
 * Decode tier: template-slotted. Centred from 768 (left-aligned below).
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isCta = (el) => el.tagName === 'P' && !!el.querySelector('a')
  && el.textContent.trim() === el.querySelector('a').textContent.trim();

export default function decorate(block) {
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    if (cell.children.length) nodes.push(...cell.children);
    else if (cell.textContent.trim()) {
      // harness-only fallback: a bare-text cell (DA always delivers a <p>)
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      nodes.push(p);
    }
  });
  if (!nodes.length) return;
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));

  const card = div('promo-banner-card');
  const title = div('teaser-title');
  const desc = div('teaser-desc');
  const actions = div('teaser-actions');
  const note = div('teaser-note');
  nodes.forEach((n) => {
    if (n === heading) title.append(n);
    else if (isCta(n)) actions.append(n);
    else if (actions.children.length) note.append(n); // copy after the CTAs: source additionalText
    else desc.append(n);
  });
  if (heading) card.append(title);
  if (desc.children.length) card.append(desc);
  if (actions.children.length) card.append(actions);
  if (note.children.length) card.append(note);
  block.replaceChildren(card);
}
