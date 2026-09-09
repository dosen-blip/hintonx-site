export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
export const ease = 'cubic-bezier(.22, 1, .36, 1)';

// Keep native details semantics while allowing the closing content to finish animating.
export function disclosure(details, {onOpen = () => {}, onSettled = () => {}} = {}) {
  const summary = details.querySelector(':scope > summary');
  const content = summary.nextElementSibling;
  const wrapper = document.createElement('div');
  wrapper.className = 'disclosure-body';
  content.before(wrapper);
  wrapper.append(content);
  let wanted = details.open, animations = [], revision = 0;
  const sync = () => {
    summary.setAttribute('aria-expanded', String(wanted));
    details.dataset.expanded = String(wanted);
    wrapper.inert = !wanted;
  };
  sync();
  function setOpen(next, {animate = true} = {}) {
    if (wanted === next && !animations.length && details.open === next) return;
    const currentHeight = wanted || animations.length ? wrapper.getBoundingClientRect().height : 0;
    const currentOpacity = animations.length ? getComputedStyle(content).opacity : (wanted ? 1 : 0);
    const currentTransform = animations.length ? getComputedStyle(content).transform : 'none';
    const clip = getComputedStyle(content).clipPath;
    const currentClip = clip === 'none' ? 'inset(0)' : clip;
    const ticket = ++revision;
    animations.forEach(animation => animation.cancel());
    animations = [];
    wrapper.style.overflow = '';
    wanted = next;
    sync();
    if (next) { details.open = true; onOpen({animate}); }
    const finish = () => {
      if (ticket !== revision) return;
      details.open = wanted;
      animations.forEach(animation => animation.cancel());
      animations = [];
      wrapper.style.overflow = '';
      onSettled();
    };
    if (!animate || reducedMotion.matches || !content.animate) { finish(); return; }
    const overlay = getComputedStyle(content).position === 'absolute';
    const timing = {duration: next ? 420 : 300, easing: ease, fill: 'both'};
    if (!overlay) {
      const fullHeight = wrapper.getBoundingClientRect().height;
      wrapper.style.overflow = 'hidden';
      animations.push(wrapper.animate({height: [`${currentHeight}px`, `${next ? fullHeight : 0}px`]}, timing));
    }
    animations.push(content.animate({
      opacity: [currentOpacity, next ? 1 : 0],
      transform: [next && !Number(currentOpacity) ? 'translateY(-10px)' : currentTransform, next ? 'none' : 'translateY(-8px)'],
      ...(overlay ? {clipPath: [next && !Number(currentOpacity) ? 'inset(0 0 100% 0)' : currentClip, next ? 'inset(0)' : 'inset(0 0 100% 0)']} : {})
    }, timing));
    animations[0].finished.then(finish).catch(() => {});
  }
  summary.addEventListener('click', event => { event.preventDefault(); setOpen(!wanted); });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) setOpen(wanted, {animate: false}); });
  return {setOpen, get isOpen() { return wanted; }, summary};
}

export function revealOnScroll(elements) {
  if (reducedMotion.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return () => {};
  const pending = new Set(elements), playing = new Map();
  function show(element, immediate = false) {
    if (!pending.delete(element)) return;
    observer.unobserve(element);
    element.style.opacity = '';
    if (immediate || reducedMotion.matches) return;
    const delay = Math.min([...element.parentElement.children].indexOf(element), 3) * 45;
    const animation = element.animate([
      {opacity: 0, transform: 'translate3d(0, 22px, 0)'},
      {opacity: 1, transform: 'none'}
    ], {duration: 700, delay, easing: ease, fill: 'backwards'});
    playing.set(element, animation);
    animation.finished.then(() => playing.delete(element)).catch(() => {});
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) show(entry.target); });
  }, {threshold: .06, rootMargin: '0px 0px -24px 0px'});
  elements.forEach(element => { element.dataset.reveal = ''; element.style.opacity = '0'; observer.observe(element); });
  document.addEventListener('focusin', event => {
    const target = event.target.closest('[data-reveal]');
    if (target) { show(target, true); playing.get(target)?.finish(); }
  });
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    [...pending].forEach(element => show(element, true));
    playing.forEach(animation => animation.finish());
  });
  // Finish a target's reveal before anchor positioning so its 22px lift cannot shift the destination.
  return target => elements.forEach(element => {
    if (element === target || element.contains(target)) {
      show(element, true);
      playing.get(element)?.finish();
    }
  });
}
