// Provider-neutral hooks. Consumers may subscribe to hintonx:analytics later.
// Ordinary navigation works regardless of whether an analytics consumer exists.
document.addEventListener('click', event => {
  const link = event.target.closest?.('a[href]');
  if (!link || event.button !== 0) return;
  const name = link.dataset.psEvent || (link.pathname.endsWith('/Contact/') ? 'publicsector_contact_click' : null);
  if (!name) return;
  const caseSlug = link.dataset.psCase || document.querySelector('[data-ps-current-case]')?.dataset.psCurrentCase;
  const detail = {
    name,
    path: location.pathname,
    destination: new URL(link.href).pathname,
    ...(caseSlug ? {caseSlug} : {}),
  };
  window.dispatchEvent(new CustomEvent('hintonx:analytics', {detail}));
});

document.querySelectorAll('[data-ps-image]').forEach(container => {
  const image = container.querySelector('img');
  const picture = container.querySelector('picture');
  const fallback = container.querySelector('.ps-image-placeholder');
  const showFallback = () => { picture.hidden = true; fallback.hidden = false; fallback.removeAttribute('aria-hidden'); };
  const showImage = () => { picture.hidden = false; fallback.hidden = true; fallback.setAttribute('aria-hidden', 'true'); };
  image.addEventListener('error', showFallback);
  image.addEventListener('load', showImage);
  // An offscreen lazy image can be complete before the browser selects a source.
  // Keep its picture visible so native lazy loading can start when scrolled into view.
  if (image.complete && image.currentSrc) image.naturalWidth ? showImage() : showFallback();
});

// Match the existing header to the alternating section backgrounds.
const header = document.querySelector('.site-header');
const bands = [...document.querySelectorAll('[data-ps-tone]'), document.querySelector('.site-footer')];
let positions = [], frame = 0;
function paint() {
  frame = 0;
  header.dataset.tone = positions.findLast(band => scrollY + header.offsetHeight / 2 >= band.top)?.tone || 'dark';
}
function requestPaint() { if (!frame) frame = requestAnimationFrame(paint); }
function measure() {
  positions = bands.map(band => ({top:band.getBoundingClientRect().top + scrollY,tone:band.dataset.psTone || 'dark'}));
  requestPaint();
}
addEventListener('scroll', requestPaint, {passive:true});
addEventListener('resize', measure);
new ResizeObserver(measure).observe(document.querySelector('main'));
document.fonts.ready.then(measure);
measure();
