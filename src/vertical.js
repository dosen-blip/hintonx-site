import {revealOnScroll} from './motion.mjs';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
revealOnScroll($$('.service-heading > *,.service-capability-list article,.service-feature-copy,.service-section-heading,.service-steps article,.service-enquiry .service-split > *'));
const header=$('.site-header'),bands=$$('[data-service-tone]');
let positions=[],frame=0;
function paint(){frame=0;header.dataset.tone=positions.findLast(b=>scrollY+header.offsetHeight/2>=b.top)?.tone||'dark'}
function requestPaint(){if(!frame)frame=requestAnimationFrame(paint)}
function measure(){positions=bands.map(b=>({top:b.getBoundingClientRect().top+scrollY,tone:b.dataset.serviceTone}));positions.push({top:$('.site-footer').getBoundingClientRect().top+scrollY,tone:'dark'});requestPaint()}
addEventListener('scroll',requestPaint,{passive:true});addEventListener('resize',measure);
new ResizeObserver(measure).observe($('main'));document.fonts.ready.then(measure);measure();
const dialog=$('.service-film-dialog');
if(dialog){
 const mount=$('[data-service-player]');let opener;
 $$('[data-service-film]').forEach(link=>link.addEventListener('click',event=>{
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!dialog.showModal)return;
  event.preventDefault();opener=link;
  const iframe=document.createElement('iframe');
  iframe.src=`https://www.youtube-nocookie.com/embed/${link.dataset.serviceFilm}?autoplay=1&rel=0`;
  iframe.title=link.dataset.filmTitle;iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';
  $('[data-service-film-title]').textContent=link.dataset.filmTitle;
  $('[data-service-external]').href=link.href;
  mount.replaceChildren(iframe);dialog.showModal();document.body.classList.add('service-film-open');
 }));
 $('[data-service-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{mount.replaceChildren();document.body.classList.remove('service-film-open');opener?.focus({preventScroll:true})});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
}
