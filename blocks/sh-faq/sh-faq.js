/**
 * sh-faq — shipping-hub FAQ: section head beside a disclosure list.
 * Decode tier: reconstructive (one row per question); the section head (<h2> + lead <p>) is
 * default content before the block and is reabsorbed into the left column.
 *
 * Authoring rows: question (<h3>) | answer (paragraphs, lists, links)
 * The question row takes the click; the toggle button is glyph-only (EW7).
 */

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  });
  children.flat().filter(Boolean).forEach((c) => node.append(c));
  return node;
}
function wrapNode(node, className) {
  return el('div', { class: className }, node);
}

function takeSectionHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return null;
  const heading = prev.querySelector('h2, h3');
  if (!heading) return null;
  const intro = el('div', { class: 'sh-intro sh-intro-titlesize' }, wrapNode(heading, 'sh-intro-title'));
  const lead = [...prev.querySelectorAll('p')].find((p) => !p.querySelector('picture, img'));
  if (lead) intro.append(wrapNode(lead, 'sh-intro-lead'));
  if (!prev.querySelector('h1, h2, h3, h4, p, ul, picture')) prev.remove();
  return intro;
}

let seq = 0;

function toggle(trigger, button, panel, inner) {
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  trigger.dataset.expanded = String(!open);
  if (!open) {
    panel.removeAttribute('hidden');
    panel.removeAttribute('aria-hidden');
    panel.style.setProperty('--disclosure-panel-height', `${inner.scrollHeight}px`);
  } else {
    panel.setAttribute('aria-hidden', 'true');
    panel.style.setProperty('--disclosure-panel-height', '0px');
    panel.addEventListener('transitionend', () => {
      if (button.getAttribute('aria-expanded') === 'false') panel.setAttribute('hidden', 'until-found');
    }, { once: true });
  }
}

export default function decorate(block) {
  const intro = takeSectionHead(block);
  const list = el('div', { class: 'sh-faq-list' });
  [...block.children].forEach((row) => {
    const [qCell, aCell] = [...row.children];
    if (!qCell) return;
    seq += 1;
    const id = `sh-faq-${seq}`;
    const question = el('div', { class: 'sh-faq-qtext', id: `${id}-q` });
    while (qCell.firstChild) question.append(qCell.firstChild);
    const button = el(
      'button',
      {
        class: 'sh-faq-glyphcell',
        type: 'button',
        'aria-expanded': 'false',
        'aria-controls': `${id}-p`,
        'aria-labelledby': `${id}-q`,
      },
      el('span', { class: 'sh-faq-plus' }),
    );
    const trigger = el('div', { class: 'sh-faq-trigger', 'data-expanded': 'false' }, question, button);
    const answer = el('div', { class: 'sh-faq-answer' });
    while (aCell && aCell.firstChild) answer.append(aCell.firstChild);
    const inner = el('div', {}, answer);
    const panel = el('div', {
      class: 'sh-faq-panel',
      id: `${id}-p`,
      role: 'group',
      'aria-labelledby': `${id}-q`,
      hidden: 'until-found',
      style: '--disclosure-panel-height:0px',
    }, inner);
    trigger.addEventListener('click', () => toggle(trigger, button, panel, inner));
    panel.addEventListener('beforematch', () => {
      if (button.getAttribute('aria-expanded') !== 'true') toggle(trigger, button, panel, inner);
    });
    list.append(el('div', { class: 'sh-faq-item' }, el('div', { class: 'sh-faq-q' }, trigger), panel));
  });
  block.replaceChildren(el('div', { class: 'sh-container' }, el('div', { class: 'sh-faq-body' }, intro, list)));
}
