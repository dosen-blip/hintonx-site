import { icon } from './icons.mjs';
import { publicSector, publicSectorCases, publicSectorPath, publicSectorHref } from './publicsector-content.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = icon('↗');
const dot = '<span class="ps-dot">.</span>';
const pending = label => `<p class="ps-pending">${esc(label)} — content pending.</p>`;
const text = (value, label) => value ? `<p>${esc(value)}</p>` : pending(label);
const caseEvent = story => `data-ps-event="publicsector_case_study_click" data-ps-case="${esc(story.slug)}"`;

// Approved images: {src, webpSrcset?, srcset?, width, height, alt, caption?}.
// Incomplete references use the same stable placeholder as a missing image.
export function publicSectorVisual(media, {label = 'Project image pending', eager = false, sizes = '90vw', logo = false} = {}) {
  const valid = media?.src && Number(media.width) > 0 && Number(media.height) > 0;
  const fallback = `<span class="ps-image-placeholder"><span>${esc(label)}</span></span>`;
  if (!valid) return `<div class="ps-image ps-image-empty${logo ? ' ps-logo' : ''}">${fallback}</div>`;
  return `<figure class="ps-figure"><div class="ps-image${logo ? ' ps-logo' : ''}" data-ps-image style="--ps-ratio:${Number(media.width)} / ${Number(media.height)}">
    ${fallback}<picture>${media.webpSrcset ? `<source type="image/webp" srcset="${esc(media.webpSrcset)}" sizes="${esc(sizes)}">` : ''}<img src="${esc(media.src)}"${media.srcset ? ` srcset="${esc(media.srcset)}" sizes="${esc(sizes)}"` : ''} alt="${esc(media.alt)}" width="${Number(media.width)}" height="${Number(media.height)}" loading="${eager ? 'eager' : 'lazy'}"${eager ? ' fetchpriority="high"' : ''} decoding="async"></picture>
  </div>${media.caption ? `<figcaption>${esc(media.caption)}</figcaption>` : ''}</figure>`;
}

function cta(story) {
  return `<a class="ps-cta" href="${esc(publicSector.cta.href)}" data-ps-event="publicsector_contact_click"${story ? ` data-ps-case="${esc(story.slug)}"` : ''}>${esc(publicSector.cta.label)} ${arrow}</a>`;
}

function contact(story) {
  return `<section class="ps-band ps-dark ps-contact" data-ps-tone="dark"><div class="ps-container ps-split"><h2>Let’s start<br>a conversation${dot}</h2><div>${cta(story)}</div></div></section>`;
}

function services() {
  return `<section class="ps-band ps-light" data-ps-tone="light"><div class="ps-container"><div class="ps-section-heading ps-split"><h2>Services${dot}</h2><p>${esc(publicSector.servicesIntro)}</p></div><div class="ps-service-list">${publicSector.services.map(service => `<article><h3>${esc(service.title)}</h3><p>${esc(service.body)}</p></article>`).join('')}</div></div></section>`;
}

function recognition() {
  const ised = publicSectorCases.find(story => story.slug === 'ised-spectrum-cloud');
  return `<section id="recognition" class="ps-band ps-dark" data-ps-tone="dark"><div class="ps-container ps-split"><h2>Awards and<br>recognition${dot}</h2><div class="ps-prose"><h3>${esc(publicSector.recognition.title)}</h3><p>${esc(publicSector.recognition.body)}</p><a class="ps-text-link" href="${publicSectorHref(ised)}" ${caseEvent(ised)}>Explore the ISED case study ${arrow}</a>${publicSector.recognition.image ? publicSectorVisual(publicSector.recognition.image, {label:'Recognition image pending',sizes:'(max-width: 760px) 90vw, 45vw'}) : ''}</div></div></section>`;
}

function clients() {
  return `<section class="ps-band ps-light" data-ps-tone="light"><div class="ps-container"><div class="ps-section-heading ps-split"><h2>Public sector<br>clients${dot}</h2><p>${esc(publicSector.clientsIntro)}</p></div>${publicSector.clientGroups.map(group => `<div class="ps-client-group"><h3>${esc(group.title)}</h3><ul class="ps-client-grid">${group.clients.map(client => `<li>${client.logo ? publicSectorVisual({...client.logo,alt:client.name}, {label:client.name,logo:true,sizes:'(max-width: 760px) 85vw, 28vw'}) : `<span>${esc(client.name)}</span>`}</li>`).join('')}</ul></div>`).join('')}</div></section>`;
}

function cards() {
  return `<section id="case-studies" class="ps-band ps-dark" data-ps-tone="dark"><div class="ps-container"><div class="ps-section-heading ps-split"><h2>Selected<br>case studies${dot}</h2><p>${esc(publicSector.casesIntro)}</p></div><div class="ps-card-grid">${publicSectorCases.map(story => `<article class="ps-card"><a href="${publicSectorHref(story)}" ${caseEvent(story)} aria-labelledby="${story.slug}-title"><div class="ps-card-image">${publicSectorVisual(story.hero,{sizes:'(max-width: 760px) 90vw, 44vw'})}</div><div class="ps-card-meta"><span>${esc(story.client)}</span><span>${esc(story.date)}</span></div><h3 id="${story.slug}-title">${esc(story.title)}</h3><p>${esc(story.summary)}</p>${story.draft ? '<p class="ps-draft">Draft content — pending approval</p>' : ''}<span class="ps-text-link">Explore the case study ${arrow}</span></a></article>`).join('')}</div></div></section>`;
}

export function publicSectorBody() {
  return `<div class="ps-page"><section class="ps-band ps-dark ps-opening" data-ps-tone="dark"><div class="ps-container"><h1>${esc(publicSector.title)}${dot}</h1><div class="ps-intro"><p>${esc(publicSector.summary)}</p>${cta()}</div>${publicSectorVisual(publicSector.hero,{label:'Public sector image pending',eager:true})}</div></section>${services()}${recognition()}${clients()}${cards()}${contact()}</div>`;
}

function neighbours(story) {
  const index = publicSectorCases.findIndex(item => item.slug === story.slug);
  const links = [['Previous case study',publicSectorCases[index-1]],['Next case study',publicSectorCases[index+1]]].filter(([,item]) => item);
  return `<nav class="ps-neighbours" aria-label="Case study navigation">${links.map(([label,item]) => `<a href="${publicSectorHref(item)}" ${caseEvent(item)}><span>${label}</span><strong>${esc(item.shortClient)}<br>${esc(item.title)}</strong>${arrow}</a>`).join('')}</nav>`;
}

export function publicSectorCaseBody(story) {
  return `<article class="ps-page" data-ps-current-case="${esc(story.slug)}"><section class="ps-band ps-dark ps-opening ps-case-opening" data-ps-tone="dark"><div class="ps-container"><nav class="ps-breadcrumb" aria-label="Breadcrumb"><a href="${publicSectorPath}">Public Sector</a><span aria-hidden="true">/</span><span aria-current="page">${esc(story.shortClient)}</span></nav><h1>${esc(story.client)}${dot}</h1><p class="ps-project-title">${esc(story.title)}</p><p class="ps-date">${esc(story.date)}</p>${story.draft ? '<p class="ps-draft">Draft content — pending approval</p>' : ''}${publicSectorVisual(story.hero,{eager:true})}</div></section>
    <section class="ps-band ps-light" data-ps-tone="light"><div class="ps-container ps-split"><div><h2>The project${dot}</h2><p class="ps-project-name">${esc(story.project)}</p></div><div class="ps-prose">${story.overview ? `<div><h2>Overview</h2><p>${esc(story.overview)}</p></div>` : ''}<div><h2>Challenge</h2>${text(story.challenge,'Challenge')}</div><div><h2>What was done</h2>${story.work?.length ? `<ul>${story.work.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : pending('What was done')}</div></div></div></section>
    ${story.images?.length ? `<section class="ps-band ps-dark" data-ps-tone="dark" aria-label="Project gallery"><div class="ps-container ps-gallery">${story.images.map(media => publicSectorVisual(media)).join('')}</div></section>` : ''}
    <section class="ps-band ps-light ps-details" data-ps-tone="light"><div class="ps-container ps-split"><div><h2>Services${dot}</h2>${text(story.services,'Services')}</div><div><h2>Outcome${dot}</h2>${text(story.outcome,'Outcome')}${story.slug === 'ised-spectrum-cloud' ? `<a class="ps-text-link" href="${publicSectorPath}#recognition">ISED recognition 2023 ${arrow}</a>` : ''}</div></div></section>
    <section class="ps-band ps-dark" data-ps-tone="dark"><div class="ps-container"><a class="ps-text-link" href="${publicSectorPath}">Back to Public Sector ${arrow}</a>${neighbours(story)}</div></section>${contact(story)}</article>`;
}
