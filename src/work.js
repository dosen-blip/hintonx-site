import {revealOnScroll} from './motion.mjs';
import {initWorkFilters} from './work-filter.mjs';
const $=selector=>document.querySelector(selector),$$=selector=>[...document.querySelectorAll(selector)];
revealOnScroll($$('.work-opening-top,.work-wordmark,.work-opening-bottom,.work-invitation h2,.work-invitation p'));
initWorkFilters($('[data-work-gallery]'));
const header=$('.site-header'),bands=$$('[data-work-tone]');
let positions=[],frame=0;
function paint(){frame=0;header.dataset.tone=positions.findLast(b=>scrollY+header.offsetHeight/2>=b.top)?.tone||'dark'}
function requestPaint(){if(!frame)frame=requestAnimationFrame(paint)}
function measure(){positions=bands.map(b=>({top:b.getBoundingClientRect().top+scrollY,tone:b.dataset.workTone}));positions.push({top:$('.site-footer').getBoundingClientRect().top+scrollY,tone:'dark'});requestPaint()}
addEventListener('scroll',requestPaint,{passive:true});addEventListener('resize',measure);
new ResizeObserver(measure).observe($('main'));document.fonts.ready.then(measure);measure();
