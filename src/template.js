const picker = document.querySelector('.template-picker');
const inputs = [...picker.querySelectorAll('input')];
const containers = new Map([...document.querySelectorAll('[data-template-container]')].map(el => [el.dataset.templateContainer, el]));
const status = document.querySelector('[data-template-status]');

// Keep all sections in the DOM: toggling retains disclosure state, removes
// hidden controls from keyboard navigation and collapses their layout entirely.
picker.addEventListener('change', event => {
  const input = event.target;
  if (!input.matches('input[type="checkbox"]') || input.disabled) return;
  const container = containers.get(input.value);
  if (!container) return;
  container.hidden = !input.checked;
  status.textContent = `${input.closest('label').querySelector('span').textContent} ${input.checked ? 'shown' : 'hidden'}.`;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && picker.open) {
    picker.open = false;
    picker.querySelector('summary').focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.template-picker')) picker.open = false;
});
// Follow a section link by making its destination visible first.
document.addEventListener('click', event => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;
  const target = document.getElementById(anchor.hash.slice(1));
  const container = target?.closest('[data-template-container]');
  if (container?.hidden) {
    container.hidden = false;
    inputs.find(input => input.value === container.dataset.templateContainer).checked = true;
    status.textContent = `${container.getAttribute('aria-label')} shown.`;
  }
});

// The wheel remains static; the shared opening script enhances the hero.
// Disclosures, index previews and films remain independent of page-wide motion.
document.querySelectorAll('.home-solution').forEach(details => {
  details.addEventListener('toggle', () => {
    if (!details.open) return;
    const root = details.closest('[data-template-container]');
    root.querySelectorAll('.home-solution').forEach(other => { if (other !== details) other.open = false; });
    root.querySelectorAll('[data-solution-preview]').forEach(preview => {
      preview.hidden = !details.id.endsWith(preview.dataset.solutionPreview);
    });
  });
});
document.querySelectorAll('[data-work-project]').forEach(link => {
  const preview = () => document.querySelectorAll('[data-work-preview]').forEach(el => { el.hidden = el.dataset.workPreview !== link.dataset.workProject; });
  link.addEventListener('pointerenter', preview);
  link.addEventListener('focus', preview);
});

const dialog = document.querySelector('.template-player');
const mount = dialog.querySelector('[data-template-player]');
let opener;
document.querySelectorAll('[data-home-film], [data-case-film], [data-service-film]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.showModal) return;
    event.preventDefault();
    opener = link;
    const id = link.dataset.homeFilm || link.dataset.caseFilm || link.dataset.serviceFilm;
    const title = link.dataset.filmTitle || link.getAttribute('aria-label') || 'Project film';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = title;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    mount.replaceChildren(iframe);
    dialog.querySelector('[data-template-film-title]').textContent = title;
    dialog.querySelector('[data-template-external]').href = link.href;
    picker.open = false;
    dialog.showModal();
  });
});
dialog.querySelector('[data-template-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { mount.replaceChildren(); opener?.focus({preventScroll:true}); });
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
