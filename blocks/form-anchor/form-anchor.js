/**
 * form-anchor — in-page target for the hero's "#form" CTA (source: `<div id="form">` before the
 * contact-form intro) and the form template's section frame (source: AEM Forms contact frame).
 *
 * Authoring: one cell holding the anchor name (e.g. `form`); further paragraphs in the cell are
 * extra anchor names for the same section (e.g. `faq` — the source ids the form container too).
 * Place the block first in the section that holds the form intro (default-content h5s) and the
 * `form contact` block. The block sets that section's id (extra names become empty anchors at
 * the section start) and renders nothing.
 * Decode tier: template-slotted (configuration only).
 * @ew-exempt all — anchor configuration (ids), rebuilt as the section id
 */
const slug = (s) => (s || '').trim().toLowerCase()
  .replace(/[^a-z0-9-]+/g, '-')
  .replace(/^-|-$/g, '');

export default function decorate(block) {
  const ps = [...block.querySelectorAll('p')];
  const names = (ps.length ? ps.map((p) => slug(p.textContent)) : [slug(block.textContent)])
    .filter(Boolean);
  const section = block.closest('.section');
  block.replaceChildren();
  if (!section) return;
  names.forEach((name, i) => {
    if (document.getElementById(name)) return;
    if (i === 0) {
      section.id = name;
      return;
    }
    const a = document.createElement('span');
    a.id = name;
    section.prepend(a);
  });
}
