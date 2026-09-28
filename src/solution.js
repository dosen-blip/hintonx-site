import {reducedMotion, ease} from './motion.mjs';

const rotation = document.querySelector('[data-solution-rotation]');
if (rotation) {
  const words = [...rotation.children];
  let index = 0, timer, visible = false, revision = 0, animations = [];
  const stop = () => {
    clearTimeout(timer);
    revision++;
    animations.forEach(animation => animation.cancel());
    animations = [];
  };
  const canRun = () => visible && !document.hidden && !reducedMotion.matches;
  const schedule = () => {
    if (canRun()) timer = setTimeout(advance, 3200);
  };
  async function advance() {
    stop();
    if (!canRun()) return;
    const next = (index + 1) % words.length, ticket = revision;
    const timing = {duration:750, easing:ease, fill:'both'};
    animations = [
      words[index].animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-110%)',opacity:0}], timing),
      words[next].animate([{transform:'translateY(110%)',opacity:0},{transform:'translateY(0)',opacity:1}], timing),
    ];
    try { await Promise.all(animations.map(animation => animation.finished)); }
    catch { return; }
    if (ticket !== revision) return;
    words[index].removeAttribute('data-current');
    index = next;
    words[index].setAttribute('data-current', '');
    stop();
    schedule();
  }
  const sync = () => { stop(); schedule(); };
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(rotation);
  addEventListener('pagehide', stop);
  addEventListener('pageshow', sync);
}
