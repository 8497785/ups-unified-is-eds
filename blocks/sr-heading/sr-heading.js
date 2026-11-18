/**
 * sr-heading: one visually hidden <h1> for pages whose source has none.
 * Keeps the authored heading; drops the table cell wrappers.
 * @param {Element} block
 */
export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) block.replaceChildren(heading);
}
