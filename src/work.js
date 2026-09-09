import {revealOnScroll,reducedMotion,ease} from './motion.mjs';
import {clamp,easeProgress} from './scroll-wheel.mjs';
const $=selector=>document.querySelector(selector),$$=selector=>[...document.querySelectorAll(selector)];
const header=$('.site-header'),bands=$$('[data-work-tone]');
const revealTarget=revealOnScroll($$('.work-opening-top,.work-wordmark,.work-opening-bottom,.work-marker,.work-chapter-heading > *,.work-feature-art,.work-feature-notes > *,.work-pair-project,.work-editorial-copy,.work-editorial-images,.work-index-list li,.work-invitation h2,.work-contact,.work-invitation p'));
const drift=$$('[data-work-drift]').map(image=>({image,top:0,height:1,value:0}));
const compact=matchMedia('(max-width:760px)'),coarse=matchMedia('(hover:none)');
let positions=[],frame=0,lastTime=0;
function measure(){
 positions=bands.map(b=>({top:b.getBoundingClientRect().top+scrollY,tone:b.dataset.workTone}));
 positions.push({top:$('.site-footer').getBoundingClientRect().top+scrollY,tone:'dark'});
 drift.forEach(item=>{const rect=item.image.parentElement.getBoundingClientRect();item.top=rect.top+scrollY;item.height=rect.height});
 requestPaint();
}
function paint(time){
 frame=0;
 const sample=scrollY+header.offsetHeight*.5;
 header.dataset.tone=positions.findLast(b=>sample>=b.top)?.tone||'dark';
 let moving=false;
 const dt=lastTime?Math.min(64,time-lastTime):1000/60;lastTime=time;
 drift.forEach(item=>{
  const active=!reducedMotion.matches&&!compact.matches&&!coarse.matches;
  const target=active?clamp((scrollY+innerHeight/2-item.top-item.height/2)/innerHeight,-1,1)*18:0;
  item.value=easeProgress(item.value,target,dt,145);
  if(Math.abs(item.value-target)<.03)item.value=target;else moving=true;
  item.image.style.setProperty('--work-shift',`${item.value.toFixed(2)}px`);
 });
 if(moving)frame=requestAnimationFrame(paint);
}
function requestPaint(){if(!frame){lastTime=0;frame=requestAnimationFrame(paint)}}
window.addEventListener('scroll',requestPaint,{passive:true});
window.addEventListener('resize',measure);
reducedMotion.addEventListener('change',measure);
compact.addEventListener('change',measure);
coarse.addEventListener('change',measure);
const rows=$$('[data-work-project]'),previews=$$('[data-work-preview]');
let selected=rows[0].dataset.workProject,previewAnimation;
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches&&previewAnimation?.playState==='running')previewAnimation.finish()});
// Prepare the desktop previews just before the index arrives, avoiding blank image swaps.
if('IntersectionObserver' in window){
 const preload=new IntersectionObserver(entries=>{
  if(entries.some(entry=>entry.isIntersecting)&&!compact.matches&&!coarse.matches){
   previews.forEach(preview=>preview.querySelector('img').loading='eager');
   preload.disconnect();
  }
 },{rootMargin:'400px'});
 preload.observe($('#work-index'));
}
function select(slug){
 if(selected===slug)return;
 selected=slug;previewAnimation?.cancel();
 rows.forEach(row=>row.dataset.active=String(row.dataset.workProject===slug));
 previews.forEach(preview=>preview.hidden=preview.dataset.workPreview!==slug);
 const current=previews.find(preview=>!preview.hidden);
 if(!reducedMotion.matches&&!compact.matches&&!coarse.matches){
  previewAnimation=current.animate([{opacity:.15,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:350,easing:ease});
 }
}
rows.forEach(row=>{
 row.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')select(row.dataset.workProject)});
 row.addEventListener('focus',()=>select(row.dataset.workProject));
});
function openHash(){
 let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
 const target=id==='top'?document.body:document.getElementById(id);
 if(!target)return;
 revealTarget(target);
 let top=0;for(let node=target;node;node=node.offsetParent)top+=node.offsetTop;
 window.scrollTo({top:Math.max(0,top-(parseFloat(getComputedStyle(target).scrollMarginTop)||0)),behavior:'instant'});
}
window.addEventListener('hashchange',openHash);
measure();
if(location.hash)requestAnimationFrame(openHash);
document.fonts.ready.then(()=>{measure();if(location.hash)openHash()});
