import {projects,videoProjects} from './site-data.mjs';
import {verticals,verticalHref} from './verticals.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<span aria-hidden="true">↗</span>';
export function verticalNav(current=''){
 return `<nav class="vertical-nav" aria-label="Work by discipline"><a href="/projects/"${current==='all'?' aria-current="page"':''}>All work</a>${verticals.map(v=>`<a href="${verticalHref(v)}"${v.slug===current?' aria-current="page"':''}>${esc(v.label)}</a>`).join('')}</nav>`;
}
export function verticalBody(v){
 const entries=v.slug==='video'?videoProjects.map(f=>({title:f.title,detail:f.subtitle,src:f.src,alt:`${f.title} — film still`,href:`https://www.youtube.com/watch?v=${f.src.match(/vi_webp\/([^/]+)/)[1]}`,action:'Watch film'})):v.projects.map(slug=>{
  const p=projects.find(p=>p.slug===slug);if(!p)throw new Error(`Unknown project ${slug}`);
  return {title:p.shortClient||p.client,detail:p.title,src:v.slug==='branding'?p.media[1].src:p.thumbnail,alt:p.alt,href:`/projects/${p.slug}/`,action:'View case study'};
 });
 return `<section class="vertical-intro container"><h1>${esc(v.title)}<span>.</span></h1><p>${esc(v.intro)}</p>${verticalNav(v.slug)}</section>
 <section class="vertical-collection" aria-label="${esc(v.title)} work"><div class="container">${v.note?`<p class="vertical-context">${esc(v.note)}</p>`:''}<div class="vertical-grid${entries.length===1?' vertical-grid-single':''}${v.slug==='video'?' vertical-grid-film':''}">${entries.map((p,i)=>`<article class="vertical-project"><a href="${p.href}" aria-label="${esc(p.action+': '+p.title)}"><div class="vertical-art"><img src="${esc(p.src)}" alt="${esc(p.alt)}" width="1600" height="900" loading="${i===0?'eager':'lazy'}" decoding="async"></div><div class="vertical-project-title"><h2>${esc(p.title)}</h2>${arrow}</div><p>${esc(p.detail)}</p></a></article>`).join('')}</div></div></section>
 <section class="vertical-contact container"><h2>Have something<br>in mind?</h2><a class="pill" href="/Contact/">Let’s talk ${arrow}</a></section>`;
}
