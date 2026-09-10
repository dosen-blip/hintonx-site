import {revealOnScroll} from './motion.mjs';
revealOnScroll([...document.querySelectorAll('.vertical-intro h1,.vertical-intro>p,.vertical-project,.vertical-contact')]);
const header=document.querySelector('.site-header'),collection=document.querySelector('.vertical-collection');
let frame=0;
function paint(){frame=0;const r=collection.getBoundingClientRect(),sample=header.offsetHeight/2;header.dataset.tone=r.top<=sample&&r.bottom>sample?'light':'dark'}
function request(){if(!frame)frame=requestAnimationFrame(paint)}
addEventListener('scroll',request,{passive:true});addEventListener('resize',request);paint();
