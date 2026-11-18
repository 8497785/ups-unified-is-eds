/**
 * transition-hero — copy-only title band on the grey-teal gradient with the low white arc
 * (source: teaser "Transition Hero", teasernMarketHero + .ups-teaser__transitionhero).
 *
 * Authoring (any row/cell shape — the block queries content, never row indices):
 *   - heading: the page <h1> (an <h2> also works), drawn with the teal rule under it
 *   - description: every further paragraph / list (e.g. "Last Updated as of …")
 *   - CTAs (optional): one paragraph per link, kept after the description
 *   - additional text (optional): a later row of link-free paragraphs, shown below the actions
 *     (source .cmp-teaser__additionalText, e.g. "Last Updated as of …" on marketing heroes)
 * Decode tier: template-slotted (fixed composition; authored nodes are MOVED into slots).
 * Variant `marketing`: the copy-only "Marketing Hero" teaser of the legal siblings (half-width
 *   copy column, tall band, the marketing arc from 72px above the band bottom) — CSS only.
 * Variant `small`: description in the source's `.small` print (1.2rem) — CSS only.
 * Re-entrant: a decorated block (`.transition-hero-content` present) is left as is.
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

// later rows holding only link-free paragraphs = the teaser's additional text (below the actions)
function isAdditionalRow(row) {
  const kids = [...row.querySelectorAll(':scope > div > *')];
  return kids.length > 0 && kids.every((k) => k.tagName === 'P' && !k.querySelector('a'));
}

function collectNodes(block, skip) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    if (skip.includes(cell.parentElement)) return;
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // harness-only fallback: a bare-text cell (DA always delivers a <p>)
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

const isCta = (el) => el.tagName === 'P' && !!el.querySelector('a')
  && el.textContent.trim() === el.querySelector('a').textContent.trim();

export default function decorate(block) {
  if (block.querySelector('.transition-hero-content')) return;
  const extraRows = [...block.children].slice(1).filter(isAdditionalRow);
  const nodes = collectNodes(block, extraRows);
  if (!nodes.length) return;
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));

  const content = div('transition-hero-content');
  const title = div('transition-hero-title');
  const desc = div('transition-hero-desc');
  const actions = div('transition-hero-actions');

  nodes.forEach((n) => {
    if (n === heading) title.append(n);
    else if (isCta(n)) actions.append(n);
    else desc.append(n);
  });
  if (heading) content.append(title);
  if (desc.children.length) content.append(desc);
  // `marketing`: the source marketing-hero teaser keeps its (possibly empty) action row
  if (actions.children.length || block.classList.contains('marketing')) content.append(actions);
  if (extraRows.length) {
    const additional = div('transition-hero-additional');
    extraRows.forEach((row) => additional.append(...row.querySelectorAll(':scope > div > *')));
    content.append(additional);
  }
  block.replaceChildren(content);
}
