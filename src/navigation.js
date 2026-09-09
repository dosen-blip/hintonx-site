import {disclosure, reducedMotion, ease} from './motion.mjs';

const header = document.querySelector('.site-header');
let blurFrame = 0;
const updateBlur = () => {
  blurFrame = 0;
  header.style.setProperty('--nav-blur-opacity', Math.min(1, scrollY / 90));
};
window.addEventListener('scroll', () => { if (!blurFrame) blurFrame = requestAnimationFrame(updateBlur); }, {passive: true});
updateBlur();

const dialog = document.querySelector('#nav-dialog');
const toggle = document.querySelector('.nav-menu-toggle');
const groups = new Map();
const closeGroups = (except = null, animate = true) => groups.forEach((control, group) => {
  if (group !== except && (control.isOpen || !animate)) control.setOpen(false, {animate});
});
document.querySelectorAll('.nav-group').forEach(group => {
  groups.set(group, disclosure(group, {onOpen: () => closeGroups(group)}));
});
header.querySelectorAll('.nav-dropdown a').forEach(link => link.addEventListener('click', () => {
  const summary = link.closest('.nav-group').querySelector('summary');
  closeGroups();
  summary.focus({preventScroll: true});
}));
document.addEventListener('click', event => { if (!event.target.closest('.nav-group')) closeGroups(); });
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || dialog.open) return;
  const open = [...groups.values()].find(control => control.isOpen);
  if (open) { event.preventDefault(); open.setOpen(false); open.summary.focus(); }
});
header.addEventListener('focusout', () => {
  requestAnimationFrame(() => { if (!header.contains(document.activeElement)) closeGroups(); });
});

let drawerAnimation = null, closing = null;
function openDialog() {
  closeGroups(null, false);
  dialog.showModal();
  dialog.dataset.phase = 'opening';
  toggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');
  if (!reducedMotion.matches) {
    drawerAnimation = dialog.animate([
      {opacity: 0, transform: 'translateX(48px)'},
      {opacity: 1, transform: 'none'}
    ], {duration: 460, easing: ease});
  }
}
function closeDialog() {
  if (closing) return closing;
  if (!dialog.open) return Promise.resolve();
  const start = {opacity: getComputedStyle(dialog).opacity, transform: getComputedStyle(dialog).transform};
  drawerAnimation?.cancel();
  dialog.dataset.phase = 'closing';
  const finish = () => { dialog.close(); closing = null; };
  if (reducedMotion.matches) { finish(); return Promise.resolve(); }
  drawerAnimation = dialog.animate([start, {opacity: 0, transform: 'translateX(40px)'}], {duration: 300, easing: ease, fill: 'both'});
  closing = drawerAnimation.finished.then(finish).catch(() => { closing = null; });
  return closing;
}
if (typeof dialog.showModal === 'function') {
  toggle.hidden = false;
  toggle.addEventListener('click', openDialog);
  document.querySelector('.nav-close').addEventListener('click', closeDialog);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
  dialog.addEventListener('close', () => {
    drawerAnimation?.cancel();
    drawerAnimation = null;
    delete dialog.dataset.phase;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    closeGroups(null, false);
  });
  dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeDialog().then(() => location.assign(link.href));
  }));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
  });
  matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches && dialog.open) dialog.close();
    closeGroups(null, false);
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && drawerAnimation?.playState === 'running') drawerAnimation.finish();
  });
}
document.querySelectorAll('.desktop-nav > a:not(.nav-project), #nav-dialog nav > a:not(.nav-project)').forEach(link => {
  if (link.pathname === location.pathname) link.setAttribute('aria-current', 'page');
});
