const section = document.querySelector('.video-background');
if (section) {
  const video = section.querySelector('video');
  const poster = section.querySelector('img');
  const status = section.querySelector('[data-video-status]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const initial = {video:video.getAttribute('src'), poster:poster.getAttribute('src')};
  let failed = false;
  const urls = {};
  const update = () => {
    const playing = !video.paused && !failed && !motion.matches;
    section.toggleAttribute('data-playing', playing);

  };
  const sync = () => {
    if (motion.matches || document.hidden || failed) {
      video.pause(); update(); return;
    }
    video.muted = true;
    video.play().catch(() => { update(); });
  };
  video.addEventListener('playing', () => {
    // A pending play may resolve after the tab was hidden or motion changed.
    if (motion.matches || document.hidden) video.pause();
    update();
  });
  video.addEventListener('pause', update);
  video.addEventListener('error', () => {
    failed = true; video.pause(); update();
    status.textContent = 'Video unavailable. Showing the fallback image.';
  });
  video.addEventListener('canplay', sync);
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();

  const editor = document.querySelector('.video-background-editor');
  if (editor) {
  const overlay = editor.querySelector('[data-background-overlay]');
  overlay.addEventListener('input', () => {
    section.style.setProperty('--video-overlay', Number(overlay.value)/100);
    editor.querySelector('output').textContent = `${overlay.value}%`;
  });
  for (const [kind, selector] of [['video','[data-background-file]'], ['poster','[data-poster-file]']]) {
    editor.querySelector(selector).addEventListener('change', event => {
      const file = event.target.files[0];
      if (!file) return;
      if (urls[kind]) URL.revokeObjectURL(urls[kind]);
      urls[kind] = URL.createObjectURL(file);
      if (kind === 'video') {
        video.pause(); failed = false; status.textContent = '';
        video.src = urls.video; video.load(); sync();
      } else poster.src = urls.poster;
    });
  }
  editor.querySelector('[data-background-reset]').addEventListener('click', () => {
    video.pause();
    for (const url of Object.values(urls)) URL.revokeObjectURL(url);
    video.src = initial.video; poster.src = initial.poster;
    editor.querySelectorAll('input[type=file]').forEach(input => { input.value = ''; });
    overlay.value = '45'; overlay.dispatchEvent(new Event('input'));
    failed = false; status.textContent = '';
    video.load(); sync();
  });
  editor.querySelector('a').addEventListener('click', () => { editor.open = false; });
  editor.addEventListener('keydown', event => {
    if (event.key === 'Escape') { editor.open = false; editor.querySelector('summary').focus(); }
  });
  document.addEventListener('click', event => {
    if (!editor.contains(event.target)) editor.open = false;
  });
}
}
