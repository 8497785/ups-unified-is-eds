import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Variant `pricing` (source text--rte bootstrap .card pair, /us/en/solutions/commerceshield):
 * the cell's first paragraph is the card's cap label, a paragraph holding only emphasis is
 * the price note, and a leading ✓ in a paragraph becomes the green check badge.
 */
function decoratePricing(li) {
  const body = li.querySelector('.cards-card-body');
  if (!body) return;
  const first = body.firstElementChild;
  if (first && first.tagName === 'P' && !first.querySelector('picture')) {
    first.className = 'cards-card-label';
    li.prepend(first);
  }
  body.querySelectorAll(':scope > p').forEach((p) => {
    const em = p.querySelector(':scope > em');
    if (em && p.childElementCount === 1 && p.textContent.trim() === em.textContent.trim()) {
      p.classList.add('cards-card-note');
      return;
    }
    const node = p.firstChild;
    if (node && node.nodeType === Node.TEXT_NODE && node.textContent.startsWith('✓')) {
      node.textContent = node.textContent.slice(1);
      const badge = document.createElement('span');
      badge.className = 'cards-card-check';
      badge.textContent = '✓';
      p.prepend(badge);
    }
  });
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    if (block.classList.contains('pricing')) decoratePricing(li);
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
