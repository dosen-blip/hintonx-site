import {workCards,workFilters} from './work-content.mjs';
import {projects} from './site-data.mjs';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const project = slug => projects.find(p => p.slug === slug);
const name = p => p.shortClient || p.client;
const href = p => `/projects/${p.slug}/`;
const arrow = '<span aria-hidden="true">↗</span>';
const link = (url, label) => `<a class="work-link" href="${url}">${label}${arrow}</a>`;
const marker = (number, label, aside = '') => `<div class="work-marker"><span>${number} / ${label}</span><span>${aside}</span></div>`;
function image(src, alt, {eager = false, drift = false, sizes = '(max-width: 760px) 100vw, 60vw', intrinsic = null} = {}) {
  if (new URL(src,'https://local.test').hostname === 'i.ytimg.com') {
    return `<img src="${esc(src)}" alt="${esc(alt)}" width="1280" height="720" loading="${eager?'eager':'lazy'}" decoding="async"${drift?' data-work-drift':''}>`;
  }
  const u = new URL(src,'https://local.test'), width = intrinsic?.width || Number(u.searchParams.get('width')) || 2500, height = intrinsic?.height || Number(u.searchParams.get('height')) || 1326;
  if (src.startsWith('/')) return `<img src="${esc(src)}" alt="${esc(alt)}" width="${width}" height="${height}" loading="${eager?'eager':'lazy'}" decoding="async"${drift?' data-work-drift':''}>`;
  const srcset = [640,1024,1600,2048].map(n => {const url = new URL(src,'https://local.test');url.searchParams.set('scale-down-to', n);return `${esc(url.href)} ${n}w`;}).join(', ');
  return `<img src="${esc(src)}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}" width="${width}" height="${height}" loading="${eager?'eager':'lazy'}" decoding="async"${drift?' data-work-drift':''}>`;
}
function gridCard(card) {
 const film=card.filmId?` data-work-film="${esc(card.filmId)}" data-film-title="${esc(card.title)}"`:'';
 return `<article class="work-grid-card" data-work-card data-categories="${esc(JSON.stringify(card.categories))}">
 <a class="work-media work-grid-art" href="${esc(card.href)}"${film} aria-label="${card.filmId?'Watch':'Explore'} ${esc(card.client)} — ${esc(card.title)}">${image(card.image.src,card.image.alt,{intrinsic:card.image,sizes:'(max-width:640px) calc(100vw - 40px), (max-width:1100px) 45vw, 30vw'})}<span class="work-image-arrow" aria-hidden="true">${card.filmId?'▶':'↗'}</span></a>
 <h2><a href="${esc(card.href)}"${film}>${(card.titleLines || [card.title]).map(esc).join('<br>')}</a></h2>
 <a class="work-link" href="${esc(card.href)}"${film}>${card.filmId?'Watch video':'Explore the project'}${arrow}</a></article>`;
}
export function workBody() {
 return `<section class="work-band work-dark work-opening work-grid-opening" data-work-tone="dark"><div class="work-container">
 <div class="work-opening-top"><p>Selected projects.<br>Different challenges. Shared curiosity.</p><a href="#work-index" class="work-index-jump">Explore the index <span aria-hidden="true">↓</span></a></div>
 <div class="work-wordmark"><h1>Work<span>.</span></h1></div>
 <div class="work-opening-bottom"><p>Digital experiences, connected platforms<br>and brands with a point of view.</p></div></div></section>
 <section class="work-band work-dark work-gallery" id="work-index" data-work-tone="dark" aria-label="Case studies" data-work-gallery><div class="work-container">
 <div class="work-filters" role="group" aria-label="Filter case studies">${workFilters.map((filter,index)=>`<button type="button" data-work-filter="${esc(filter)}" aria-pressed="${index===0}" aria-controls="work-grid">${esc(filter)}</button>`).join('')}</div>
 <p class="work-sr" role="status" aria-live="polite" data-work-status></p>
 <div class="work-grid" id="work-grid">${workCards.map(gridCard).join('')}</div></div></section>
 <section class="work-band work-light work-invitation" data-work-tone="light"><div class="work-container"><div class="work-marker"><span>What comes next?</span><span>Your project starts with a conversation</span></div><div><h2>Let’s make<br>what’s next.</h2><a class="work-contact" href="/Contact/">Start a project ${arrow}</a></div><p>An idea, a challenge, a different possibility.<br>We’d like to hear it.</p></div></section>
 <dialog class="work-film-dialog" aria-label="Project film"><div class="work-film-toolbar"><span data-work-film-title>Film</span><button type="button" data-work-close>Close <span aria-hidden="true">×</span></button></div><div data-work-player></div><a data-work-external href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">Watch on YouTube ${arrow}</a></dialog>`;
}

// Reuse the Work page's full-width feature layout on Solution pages.
export function solutionProjectFeatures(features=[]) {
  return features.map((feature,index)=>{
    const p=project(feature.slug);
    return `<section class="work-page work-band work-light work-platforms solution-project${index % 2 === 1 ? ' solution-project-grey' : ''}" id="solution-project-${esc(p.slug)}" data-tone="light"><div class="work-container">
      ${marker(String(index+1).padStart(2,'0'),esc(feature.label),esc(feature.category))}
      <div class="work-chapter-heading"><h2>${feature.heading.map(esc).join('<br>')}</h2><div><p>${esc(feature.description)}</p>${link(href(p),`Explore ${esc(name(p))}`)}</div></div>
      <a class="work-media work-feature-art" href="${href(p)}" aria-label="Explore the ${esc(name(p))} case study">${image(p.media[feature.media].src,p.alt,{intrinsic:p.media[feature.media],sizes:'(max-width:760px) calc(100vw - 40px), (max-width:1100px) calc(100vw - 70px), (max-width:1440px) calc(100vw - 100px), 1340px'})}<span class="work-image-arrow" aria-hidden="true">↗</span></a>
      <div class="work-feature-notes"><div><span class="work-label">The challenge</span><p>${esc(feature.challenge)}</p></div><div><span class="work-label">Our part</span><p>${esc(feature.contribution)}</p></div><div><span class="work-label">The disciplines</span><ul>${p.services.map(service=>`<li>${esc(service)}</li>`).join('')}</ul></div></div>
    </div></section>`;
  }).join('');
}
