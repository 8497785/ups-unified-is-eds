/**
 * form-toast — submit-success popover (source: popover-ups toaster). Hidden at rest; shown when
 * a form on the page dispatches `form-toast:show` on document (the form block does so once a
 * submission endpoint is connected); closes on its close control or Escape.
 *
 * Authoring (one cell): status line (short paragraph, e.g. "SUCCESS") then the message
 * paragraph(s). Default content after the block in the same section (the page's small-print
 * note) is styled in place as the source's small text.
 * Decode tier: template-slotted.
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

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
  const panel = div('form-toast-panel');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'form-toast-close';
  close.setAttribute('aria-label', 'Close');
  const icon = div('form-toast-icon');
  icon.setAttribute('aria-hidden', 'true');
  const status = div('form-toast-status');
  const message = div('form-toast-message');
  nodes.forEach((n, i) => {
    if (i === 0 && nodes.length > 1) status.append(n);
    else message.append(n);
  });
  panel.append(close, icon, status, message);
  block.replaceChildren(panel);

  const wrapper = block.parentElement;
  const setOpen = (open) => {
    block.classList.toggle('is-open', open);
    if (wrapper) wrapper.classList.toggle('is-open', open);
  };
  close.addEventListener('click', () => setOpen(false));
  document.addEventListener('form-toast:show', () => setOpen(true));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}
