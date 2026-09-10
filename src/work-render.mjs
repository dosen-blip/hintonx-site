import {verticalNav} from './vertical-render.mjs';
import {projects} from './site-data.mjs';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const project = slug => projects.find(p => p.slug === slug);
const name = p => p.shortClient || p.client;
const href = p => `/projects/${p.slug}/`;
const arrow = '<span aria-hidden="true">↗</span>';
const link = (url, label) => `<a class="work-link" href="${url}">${label}${arrow}</a>`;
const marker = (number, label, aside = '') => `<div class="work-marker"><span>${number} / ${label}</span><span>${aside}</span></div>`;
function image(src, alt, {eager = false, drift = false, sizes = '(max-width: 760px) 100vw, 60vw'} = {}) {
  const u = new URL(src), width = Number(u.searchParams.get('width')) || 2500, height = Number(u.searchParams.get('height')) || 1326;
  const srcset = [640,1024,1600,2048].map(n => {const url = new URL(src);url.searchParams.set('scale-down-to', n);return `${esc(url.href)} ${n}w`;}).join(', ');
  return `<img src="${esc(src)}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}" width="${width}" height="${height}" loading="${eager?'eager':'lazy'}" decoding="async"${drift?' data-work-drift':''}>`;
}
function paired(p, number, title, description, category) {
  return `<article class="work-pair-project"><a class="work-media work-pair-art" href="${href(p)}" aria-label="Explore ${esc(name(p))}">${image(p.thumbnail,p.alt,{drift:true})}<span class="work-image-arrow" aria-hidden="true">↗</span></a><div class="work-project-meta"><span>${number} / ${esc(name(p))}</span><span>${category}</span></div><h3><a href="${href(p)}">${title}</a></h3><p>${description}</p>${link(href(p),'Explore the project')}</article>`;
}
export function workBody() {
  const valet = project('1valet'), hundred = project('mobile-app'), cbsa = project('canada-border-services-agency'), press = project('press');
  return `
  <section class="work-band work-dark work-opening" data-work-tone="dark"><div class="work-container">
    <div class="work-opening-top"><p>Selected projects.<br>Different challenges. Shared curiosity.</p><a href="#work-index" class="work-index-jump">Explore the index <span aria-hidden="true">↓</span></a></div>
    <div class="work-wordmark"><h1>Work<span>.</span></h1></div>
    <div class="work-opening-bottom"><p>Digital experiences, connected platforms<br>and brands with a point of view.</p>${verticalNav('all')}</div>
  </div></section>
  <section class="work-band work-light work-platforms" id="work-platforms" data-work-tone="light"><div class="work-container">
    ${marker('01','Connected living','1VALET / Smart building platform')}
    <div class="work-chapter-heading"><h2>A better way<br>to come home.</h2><div><p>Connecting smart access, resident apps and property management in one building platform.</p>${link(href(valet),'Explore 1VALET')}</div></div>
    <a class="work-media work-feature-art" href="${href(valet)}" aria-label="Explore the 1VALET case study">${image(valet.media[0].src,valet.alt,{eager:true,drift:true,sizes:'100vw'})}<span class="work-image-arrow" aria-hidden="true">↗</span></a>
    <div class="work-feature-notes"><div><span class="work-label">The challenge</span><p>Make a connected building feel simple to the people who live in it and the teams who run it.</p></div><div><span class="work-label">Our part</span><p>Product strategy, experience design and development, from the MVP through product handover.</p></div><div><span class="work-label">The disciplines</span><ul>${valet.services.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></div></div>
  </div></section>
  <section class="work-band work-dark work-experiences" id="work-experiences" data-work-tone="dark"><div class="work-container">
    ${marker('02','Different worlds','The same attention to experience')}
    <div class="work-chapter-heading"><h2>From everyday<br>to intricate.</h2><p>A conversation between friends.<br>A decision at the border.<br>Design starts with the people using it.</p></div>
    <div class="work-pair">${paired(hundred,'A','A conversation.<br>More possibilities.','A personal survey app that turns an iMessage conversation into quick feedback from friends.','Consumer / iOS')}${paired(cbsa,'B','Clearer decisions.<br>Complex information.','Experience strategy and interface design for CBSA’s ELVIS inspection system.','Public sector / Intelligent systems')}</div>
  </div></section>
  <section class="work-band work-light work-editorial" id="work-editorial" data-work-tone="light"><div class="work-container">
    ${marker('03','On the record','Hinton Press / Brand, editorial & commerce')}
    <div class="work-editorial-layout"><div class="work-editorial-copy"><span class="work-label">Stories worth keeping.</span><h2>Greatness,<br>page after<br>page.</h2><p>A publishing identity that carries the detail and character of sport from the printed page to the digital storefront.</p>${link(href(press),'Explore Hinton Press')}<div class="work-editorial-disciplines"><span>01 / Brand</span><span>02 / Editorial & book design</span><span>03 / E-commerce</span></div></div>
    <div class="work-editorial-images"><a class="work-media work-book-main" href="${href(press)}" aria-label="Explore Hinton Press book design">${image(press.media[1].src,'Hinton Press book spreads and editorial design',{drift:true})}</a><a class="work-media work-book-detail" href="${href(press)}" aria-label="Explore Hinton Press publications">${image(press.media[3].src,'Hinton Press sports publications')}</a><span class="work-editorial-caption">A point of view, in print and on screen. ${arrow}</span></div></div>
  </div></section>
  <section class="work-band work-dark work-index" id="work-index" data-work-tone="dark"><div class="work-container">
    ${marker('04','The complete index',`${String(projects.length).padStart(2,'0')} projects / Explore every perspective`)}
    <div class="work-chapter-heading"><h2>All the work.<br>More to discover.</h2><p>From first ideas to complex systems.<br>Find a project that speaks to yours.</p></div>
    <div class="work-index-layout"><ol class="work-index-list" aria-label="All projects">${projects.map((p,i)=>`<li><a class="work-index-row" href="${href(p)}" data-work-project="${p.slug}"${i===0?' data-active="true"':''}><span class="work-row-number">${String(i+1).padStart(2,'0')}</span><span class="work-row-copy"><strong>${esc(name(p))}</strong><span>${esc(p.title)}</span></span><span class="work-row-arrow" aria-hidden="true">↗</span><span class="work-row-image">${image(p.thumbnail,'',{sizes:'100vw'})}</span></a></li>`).join('')}</ol>
    <aside class="work-index-preview" aria-label="Project preview"><div class="work-preview-stage">${projects.map((p,i)=>`<a class="work-preview" data-work-preview="${p.slug}" href="${href(p)}"${i?' hidden':''} tabindex="-1" aria-hidden="true">${image(p.thumbnail,p.alt,{sizes:'45vw'})}<span class="work-preview-caption"><strong>${esc(name(p))}</strong><span>${esc(p.title)} ${arrow}</span></span><span class="work-preview-services">${p.services.map(esc).join(' / ')}</span></a>`).join('')}</div><p class="work-preview-hint">Move through the index to explore.</p><div class="work-film-note"><span>Another way to tell a story.</span>${link('/matiadosen/','Explore moving image')}</div></aside></div>
    <div class="work-index-bottom"><span>Strategy. Design. Technology. In practice.</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></div>
  </div></section>
  <section class="work-band work-light work-invitation" data-work-tone="light"><div class="work-container">${marker('05','What comes next?','Your project starts with a conversation')}<div><h2>Let’s make<br>what’s next.</h2><a class="work-contact" href="/Contact/">Start a project ${arrow}</a></div><p>An idea, a challenge, a different possibility.<br>We’d like to hear it.</p></div></section>`;
}
