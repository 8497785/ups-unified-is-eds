/**
 * search — resource-listing site-search bar (source: site-search-filter on /resources):
 * search glyph + text field + teal "Search" pill; submitting goes to the site-search page
 * with `?fulltext=<query>` (results are rendered there — dynamics, not this block).
 *
 * Authoring (content is queried, never indexed; any row/cell shape):
 *   - a paragraph without a link = the field's label (shown as the placeholder; the authored
 *     paragraph is moved into a visually hidden <label>, so it stays editable)
 *   - a paragraph holding one link = the submit control: href = search page, text = label
 * @ew-exempt placeholder — the input's placeholder/aria-label mirror the label paragraph's text
 *   (an attribute cannot host an authored node; the paragraph itself is moved, EW1).
 * Section head: author the title (<h2>) as default content before the block in the same
 * section — styled in place as the source's centred section title.
 * Decode tier: template-slotted (fixed composition).
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

export default function decorate(block) {
  if (block.querySelector('.search-form')) return; // EW9 re-entrant
  const paras = [...block.querySelectorAll(':scope > div > div > *')];
  const ctaP = paras.find((p) => p.querySelector('a'));
  const labelP = paras.find((p) => p !== ctaP && p.textContent.trim());
  const anchor = ctaP && ctaP.querySelector('a');

  const form = el('form', 'search-form');
  form.setAttribute('role', 'search');
  if (anchor) form.action = anchor.getAttribute('href');

  const field = el('div', 'search-field');
  const icon = el('span', 'search-icon');
  icon.setAttribute('aria-hidden', 'true');
  const id = `search-${Math.random().toString(36).slice(2, 8)}`;
  const label = el('label', 'search-label');
  label.htmlFor = id;
  const input = el('input', 'search-input');
  input.type = 'text';
  input.name = 'fulltext';
  input.id = id;
  input.autocomplete = 'off';
  if (labelP) {
    label.append(labelP);
    const text = labelP.textContent.trim();
    input.placeholder = text;
    input.setAttribute('aria-label', text);
  }
  field.append(icon, label, input);

  const submit = el('div', 'search-submit');
  if (ctaP) {
    ctaP.classList.remove('button-wrapper');
    if (anchor) {
      anchor.className = 'search-button';
      anchor.setAttribute('role', 'button');
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        form.requestSubmit();
      });
    }
    submit.append(ctaP);
  }
  form.append(field, submit);
  form.addEventListener('submit', (e) => {
    if (!form.getAttribute('action')) e.preventDefault();
  });
  block.replaceChildren(form);
}
