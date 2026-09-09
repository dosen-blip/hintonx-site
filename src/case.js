import {revealOnScroll} from './motion.mjs';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
revealOnScroll($$('.case-heading > *,.case-visual,.case-story,.case-facts,.case-result-grid > *,.case-next-link'));
const header=$('.site-header'),bands=$$('[data-case-tone]');
let positions=[],frame=0;
function paint(){frame=0;header.dataset.tone=positions.findLast(b=>scrollY+header.offsetHeight/2>=b.top)?.tone||'dark'}
function requestPaint(){if(!frame)frame=requestAnimationFrame(paint)}
function measure(){positions=bands.map(b=>({top:b.getBoundingClientRect().top+scrollY,tone:b.dataset.caseTone}));positions.push({top:$('.site-footer').getBoundingClientRect().top+scrollY,tone:'dark'});requestPaint()}
addEventListener('scroll',requestPaint,{passive:true});addEventListener('resize',measure);
new ResizeObserver(measure).observe($('main'));document.fonts.ready.then(measure);measure();
const dialog=$('.case-film-dialog'),mount=$('[data-case-player]');
let opener;
$$('[data-case-film]').forEach(link=>link.addEventListener('click',event=>{
 if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!dialog.showModal)return;
 event.preventDefault();opener=link;
 const iframe=document.createElement('iframe');
 iframe.src=`https://www.youtube-nocookie.com/embed/${link.dataset.caseFilm}?autoplay=1&rel=0`;
 iframe.title=link.getAttribute('aria-label');iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';
 mount.replaceChildren(iframe);dialog.showModal();document.body.classList.add('case-film-open');
}));
$('[data-case-close]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{mount.replaceChildren();document.body.classList.remove('case-film-open');opener?.focus({preventScroll:true})});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
