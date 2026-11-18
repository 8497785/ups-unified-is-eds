/**
 * loss-calculator — image column + loss-calculator form column (source: column control with
 * an AEM Forms calculator frame, anchor #calculator).
 *
 * Authoring:
 *   - image: one <picture>/<img> (left column; above the calculator below 992)
 *   - source | the source calculator form path (kept as data-form for the dynamics hand-off)
 *   - any other content (heading, paragraphs) renders in the calculator column above the mount
 * The calculator frame renders empty in every source capture; the mount keeps its geometry
 * (157px) until the calculator is rebuilt (dynamics plan D1).
 * @ew-exempt <p> source row — form configuration, never displayed
 * Decode tier: template-slotted.
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isMedia = (el) => el.matches('picture, img') || !!el.querySelector('picture, img');

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  let source = '';
  const nodes = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    const key = cells.length > 1 ? cells[0].textContent.trim().toLowerCase() : '';
    if (key === 'source') {
      source = cells[1].textContent.trim();
      return;
    }
    cells.forEach((cell) => nodes.push(...cell.children));
  });
  const media = nodes.find(isMedia);

  const row = div('row');
  const mediaCol = div('col-lg-6 loss-calculator-media');
  const formCol = div('col-lg-6 loss-calculator-form');
  if (media) mediaCol.append(media);
  nodes.filter((n) => n !== media).forEach((n) => formCol.append(n));
  const mount = div('form-mount');
  if (source) mount.dataset.form = source;
  formCol.append(mount);
  if (media) row.append(mediaCol);
  row.append(formCol);
  block.replaceChildren(row);

  const section = block.closest('.section');
  if (section && !document.getElementById('calculator')) section.id = 'calculator';
}
