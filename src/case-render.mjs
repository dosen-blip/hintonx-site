import {projects,videoProjects} from './site-data.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mediaFigure(media,project,index,lead=false){
 const url=new URL(media.src,'https://local.test'),width=media.width||Number(url.searchParams.get('width'))||1280,height=media.height||Number(url.searchParams.get('height'))||720;
 const videoId=media.kind==='video-poster'?url.pathname.match(/\/vi_webp\/([\w-]{11})\//)?.[1]:null;
 const film=videoProjects.find(item=>item.id===videoId);
 const srcset=url.hostname==='framerusercontent.com'?` srcset="${[640,1280,2048].map(size=>{const u=new URL(url);u.searchParams.set('scale-down-to',size);return `${esc(u.href)} ${size}w`}).join(', ')}" sizes="(max-width:760px) 90vw, ${lead||project.slug==='press'?'90vw':'(min-width:1100px) 60vw, 90vw'}"`:'';
 const image=`<img src="${esc(media.src)}"${srcset} alt="${esc(media.alt || `${project.alt} — project view ${index+1}`)}" width="${width}" height="${height}" loading="${lead?'eager':'lazy'}" decoding="async">`;
 return `<figure class="case-visual${lead?' case-lead':''}${videoId?' case-film':''}">${videoId?`<a href="${film?esc(film.href):`https://www.youtube.com/watch?v=${videoId}`}"${film?'':` data-case-film="${videoId}"`} aria-label="Watch ${esc(project.shortClient||project.client)} project film">${image}<span class="case-play"><span aria-hidden="true">▶</span> Watch film</span></a>`:image}</figure>`;
}
export function caseBody(project){
 const next=projects[(projects.indexOf(project)+1)%projects.length];
 const meta=[['Client',project.client],['Services',project.services.join('\n')],['Industry',project.industries],['Date',project.date]].filter(([,v])=>v);
 return `<article class="case-study${project.slug==='press'?' case-editorial':''}${project.slug==='government-of-alberta-atlas'?' case-atlas':''}">
 <section class="case-opening" data-case-tone="dark"><div class="case-container"><a class="case-back" href="/projects/"><span aria-hidden="true">↖</span> All work</a><div class="case-heading"><h1>${esc(project.shortClient||project.client)}<span class="case-dot">.</span></h1><p>${esc(project.title)}</p></div>${mediaFigure(project.media[0],project,0,true)}</div></section>
 <section class="case-overview" data-case-tone="light"><div class="case-container case-overview-grid"><div class="case-story">${project.tagline!==project.title?`<h2>${esc(project.tagline)}</h2>`:''}${project.description.split('\n\n').map(paragraph=>`<p>${esc(paragraph)}</p>`).join('')}${project.challenge?`<div class="case-story-detail"><h3>The challenge</h3><p>${esc(project.challenge)}</p></div>`:''}${project.contribution?`<div class="case-story-detail"><h3>Our part</h3><p>${esc(project.contribution)}</p></div>`:''}</div><dl class="case-facts">${meta.map(([label,value])=>`<div><dt>${label}</dt><dd>${esc(value).replaceAll('\n','<br>')}</dd></div>`).join('')}</dl></div></section>
 ${project.media.length>1?`<section class="case-gallery" data-case-tone="dark" aria-label="Project gallery"><div class="case-container case-gallery-grid">${project.media.slice(1).map((media,i)=>mediaFigure(media,project,i+1)).join('')}</div></section>`:''}
 <section class="case-result${project.media.length===1?' case-result-continuous':''}" data-case-tone="light"><div class="case-container case-result-grid"><h2>The result<span class="case-dot">.</span></h2><p>${esc(project.outcome)}</p></div></section>
 <section class="case-next" data-case-tone="dark"><div class="case-container"><div class="case-next-top"><h2>Next project</h2><a class="case-back" href="/projects/">All work <span aria-hidden="true">↗</span></a></div><a class="case-next-link" href="/projects/${next.slug}/"><div class="case-next-image"><img src="${esc(next.thumbnail)}" alt="${esc(next.alt)}" width="2500" height="1326" loading="lazy" decoding="async"></div><div class="case-next-copy"><h3>${esc(next.shortClient||next.client)}</h3><p>${esc(next.title)}</p><span class="case-next-arrow" aria-hidden="true">↗</span></div></a></div></section>
 </article><dialog class="case-film-dialog" aria-label="Project film"><div class="case-film-toolbar"><span>${esc(project.shortClient||project.client)}</span><button data-case-close aria-label="Close project film">Close ×</button></div><div data-case-player></div></dialog>`;
}

export function videoCaseBody(film){
 const next=videoProjects[(videoProjects.indexOf(film)+1)%videoProjects.length];
 return `<article class="case-study video-case">
 <section class="case-opening" data-case-tone="dark"><div class="case-container">
 <a class="case-back" href="/projects/"><span aria-hidden="true">↖</span> All work</a>
 <div class="video-case-heading"><p class="video-case-client">${esc(film.client)}</p><h1>${esc(film.title)}<span class="case-dot">.</span></h1></div>
 <div class="video-case-player"><iframe src="https://www.youtube-nocookie.com/embed/${esc(film.id)}?rel=0" title="${esc(film.title)}" width="1280" height="720" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
 <a class="case-back video-case-external" href="https://www.youtube.com/watch?v=${esc(film.id)}" target="_blank" rel="noopener noreferrer">Watch on YouTube <span aria-hidden="true">↗</span></a>
 </div></section>
 <section class="case-next" data-case-tone="dark"><div class="case-container"><div class="case-next-top"><h2>Next case study</h2><a class="case-back" href="/projects/">All work <span aria-hidden="true">↗</span></a></div><a class="case-next-link" href="${esc(next.href)}"><div class="case-next-image"><img src="${esc(next.src)}" alt="${esc(next.title)} — video still" width="1280" height="720" loading="lazy"></div><div class="case-next-copy"><p class="video-case-client">${esc(next.client)}</p><h3>${esc(next.title)}</h3><span class="case-next-arrow" aria-hidden="true">↗</span></div></a></div></section>
 </article>`;
}
