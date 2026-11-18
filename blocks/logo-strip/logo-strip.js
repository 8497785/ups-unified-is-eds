/**
 * logo-strip — partner logo bar (source: the theme's logo-bar `.logos` component).
 *
 * Decode tier: reconstructive (repeat group). One logo per row (preferred) or any number of
 * images in any cells: every authored <img>/<picture> becomes one logo, in order; the partner
 * name is the image's alt text. An optional link around an image is kept (EW1: moved as is).
 * Section head (h3) is DEFAULT CONTENT before the block, styled in place (stats.css).
 */

export default function decorate(block) {
  if (block.querySelector(':scope > .logo-strip-row')) return;
  const row = document.createElement('div');
  row.className = 'logo-strip-row';
  block.querySelectorAll('picture, img').forEach((media) => {
    if (media.tagName === 'IMG' && media.closest('picture')) return;
    const link = media.closest('a');
    const item = document.createElement('div');
    item.className = 'logo-strip-item';
    item.append(link && block.contains(link) ? link : media);
    row.append(item);
  });
  block.replaceChildren(row);
}
