import {icon} from './icons.mjs';

// Default media for SCRUM-15. Replace these paths when final assets are approved.
export const videoBackground = {
  video: '/assets/video-background/hx1.mp4',
  poster: '/assets/video-background/hx1-poster.jpg',
  overlay: 0.45,
};
export function videoBackgroundMedia() {
  return `<div class="video-background-layers" aria-hidden="true"><img class="video-background-poster" src="${videoBackground.poster}" width="1280" height="720" alt=""><video class="video-background-media" src="${videoBackground.video}" autoplay muted loop playsinline preload="auto" tabindex="-1"></video><span class="video-background-edge video-background-edge-top"></span><span class="video-background-edge video-background-edge-bottom"></span></div>
    <span class="home-sr" data-video-status role="status"></span>`;
}
export function videoBackgroundControls() {
  return `<details class="video-background-editor"><summary>Video settings ${icon('↓')}</summary><div class="video-background-settings"><p>Local preview only. File choices reset on reload.</p><label>Background video<input type="file" accept="video/*" data-background-file></label><label>Fallback image<input type="file" accept="image/*" data-poster-file></label><label>Dark overlay <output data-overlay-value>45%</output><input type="range" min="0" max="90" value="45" data-background-overlay></label><button type="button" data-background-reset>Reset placeholder</button><a href="#home-video-background">View video container ${icon('↓')}</a></div></details>`;
}
