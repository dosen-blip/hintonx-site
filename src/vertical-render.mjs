import {projects,videoProjects} from './site-data.mjs';
import {verticals,verticalHref} from './verticals.mjs';
import {serviceContent} from './service-content.mjs';
import {icon} from './icons.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow=icon('↗');
const projectFor=slug=>{const p=projects.find(p=>p.slug===slug);if(!p)throw new Error(`Unknown project ${slug}`);return p};
const projectHref=p=>`/projects/${p.slug}/`;
const filmId=f=>f.src.match(/vi_webp\/([^/]+)/)[1];
function visual(ref,{eager=false}={}){
 const film=ref.film!==undefined?videoProjects[ref.film]:null;
 const p=film?null:projectFor(ref.slug);
 const src=film?film.src:ref.media!==undefined?p.media[ref.media].src:p.thumbnail;
 const url=new URL(src),width=Number(url.searchParams.get('width'))||1280,height=Number(url.searchParams.get('height'))||720;
 const img=`<img src="${esc(src)}" alt="${esc(film?`${film.title} — film still`:p.alt)}" width="${width}" height="${height}" loading="${eager?'eager':'lazy'}"${eager?' fetchpriority="high"':''} decoding="async">`;
 return `<a class="service-visual${film?' service-visual-film':''}" href="${film?`https://www.youtube.com/watch?v=${filmId(film)}`:projectHref(p)}"${film?` data-service-film="${filmId(film)}" data-film-title="${esc(film.title)}"`:''} aria-label="${esc(film?`Watch ${film.title}`:`View ${p.shortClient||p.client} case study`)}">${img}${film?`<span class="service-play">${icon('▶')} Watch film</span>`:''}</a>`;
}
export function verticalNav(current=''){
 return `<nav class="vertical-nav" aria-label="Work by discipline"><a href="/projects/"${current==='all'?' aria-current="page"':''}>All work</a>${verticals.map(v=>`<a href="${verticalHref(v)}"${v.slug===current?' aria-current="page"':''}>${esc(v.label)}</a>`).join('')}</nav>`;
}
function feature(ref){
 const film=ref.film!==undefined?videoProjects[ref.film]:null,p=film?null:projectFor(ref.slug);
 return `<article class="service-feature${ref.extraMedia!==undefined?' service-feature-editorial':''}">${visual(ref)}<div class="service-feature-copy"><div><p class="service-client">${esc(film?film.subtitle:p.shortClient||p.client)}</p><h3>${esc(film?film.title:ref.title)}</h3></div><div><p>${esc(ref.body)}</p>${film?'':`<a class="service-link" href="${projectHref(p)}">Explore the project ${arrow}</a>`}</div></div>${ref.extraMedia!==undefined?visual({slug:ref.slug,media:ref.extraMedia}):''}</article>`;
}
export function verticalBody(v){
 const content=serviceContent[v.slug];
 const otherProjects=v.projects.filter(slug=>!content.features.some(f=>f.slug===slug));
 const remainingFilms=v.slug==='video'?videoProjects.map((film,index)=>({film,index})).filter(({index})=>index!==content.hero.film&&!content.features.some(f=>f.film===index)):[];
 return `<div class="service-page service-${v.slug}">
 <section class="service-opening" data-service-tone="dark" aria-labelledby="service-title"><div class="container">
 <div class="service-heading"><h1 id="service-title">${esc(v.title)}<span>.</span></h1><div><h2>${esc(content.headline)}</h2><p>${esc(content.intro)}</p></div></div>
 ${visual(content.hero,{eager:true})}${v.slug==='video'?`<p class="service-hero-caption">${esc(videoProjects[content.hero.film].title)} <span>${esc(videoProjects[content.hero.film].subtitle)}</span></p>`:''}
 ${verticalNav(v.slug)}</div></section>
 <section class="service-capabilities service-light" data-service-tone="light" aria-labelledby="capabilities-title"><div class="container service-split"><h2 id="capabilities-title">What we do<span>.</span></h2><div class="service-capability-list">${content.capabilities.map(([title,body])=>`<article><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div></div></section>
 <section class="service-selected" data-service-tone="dark" aria-labelledby="selected-title"><div class="container"><div class="service-section-heading"><h2 id="selected-title">${v.slug==='video'?'Selected films':'Selected work'}<span>.</span></h2>${v.note?`<p>${esc(v.note)}</p>`:''}</div>${content.features.map(feature).join('')}
 ${otherProjects.length?`<div class="service-related"><h3>More in this discipline</h3><div>${otherProjects.map(slug=>{const p=projectFor(slug);return `<a href="${projectHref(p)}"><span>${esc(p.shortClient||p.client)}<small>${esc(p.title)}</small></span>${arrow}</a>`}).join('')}</div></div>`:''}
 ${remainingFilms.length?`<div class="service-film-grid">${remainingFilms.map(({film,index})=>`<article>${visual({film:index})}<h3>${esc(film.title)}</h3><p>${esc(film.subtitle)}</p></article>`).join('')}</div>`:''}
 </div></section>
 <section class="service-approach service-light" data-service-tone="light" aria-labelledby="approach-title"><div class="container"><div class="service-section-heading"><h2 id="approach-title">How we approach it<span>.</span></h2><p>${esc(content.approachIntro)}</p></div><div class="service-steps">${content.approach.map(([title,body])=>`<article><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div></div></section>
 <section class="service-enquiry" data-service-tone="dark" aria-labelledby="enquiry-title"><div class="container service-split"><h2 id="enquiry-title">${esc(content.enquiry)}</h2><div><p>${esc(content.enquiryBody)}</p><a class="pill service-cta" href="/Contact/">${esc(content.cta)} ${arrow}</a></div></div></section>
 </div>${v.slug==='video'?`<dialog class="service-film-dialog" aria-label="Film player"><div class="service-film-toolbar"><span data-service-film-title></span><button type="button" data-service-close aria-label="Close film">Close ${icon('×')}</button></div><div data-service-player></div><a class="service-film-external" data-service-external href="https://www.youtube.com/watch?v=${filmId(videoProjects[0])}">Watch on YouTube ${arrow}</a></dialog>`:''}`;
}
