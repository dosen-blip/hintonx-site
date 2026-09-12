import {disclosure,revealOnScroll} from './motion.mjs';
import {clamp,wheelProgress,cardPose,wheelPosition,fitCardHeight,easeProgress,stackPose} from './scroll-wheel.mjs?v=20260909-stack';
const $=(selector,root=document)=>root.querySelector(selector),$$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const root=$('[data-wheel]'),cards=$$('[data-wheel-card]'),header=$('.site-header');
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:760px)');
let geometry={start:0,travel:1,steps:4,width:innerWidth},bands=[],frame=0,lastPair=-1,displayedProgress=null,lastTime=0;
let revealTarget=()=>{};
function paint(time){
 frame=0;
 const scroll=scrollY;
 if(root.dataset.enhanced==='true'){
  const target=wheelProgress(scroll,geometry.start,geometry.travel,geometry.steps);
  const elapsed=lastTime?Math.min(64,time-lastTime):1000/60;
  const offscreen=scroll<geometry.start-innerHeight||scroll>geometry.start+geometry.travel+innerHeight;
  displayedProgress=reduced.matches||displayedProgress===null||offscreen?target:easeProgress(displayedProgress,target,elapsed,phone.matches?190:115);
  if(Math.abs(displayedProgress-target)<.0005)displayedProgress=target;
  const p=displayedProgress;
  lastTime=time;
  if(p!==target)frame=requestAnimationFrame(paint);
  root.style.setProperty('--wheel-progress',p/geometry.steps);
  cards.forEach((card,i)=>{
   const pose=phone.matches?stackPose(i,p,geometry.viewportHeight,geometry.tabHeight):cardPose(i,p,geometry.width);
   card.style.transform=phone.matches?`translate3d(0,${pose.y.toFixed(2)}px,0)`:`translate3d(calc(-50% + ${pose.x.toFixed(2)}px), ${pose.y.toFixed(2)}px, 0) rotate(${pose.angle.toFixed(3)}deg)`;
   card.style.visibility=pose.near?'visible':'hidden';
   card.style.zIndex=String(phone.matches?i+1:1000-Math.round(Math.abs(pose.angle)*10));
   if(!pose.reachable&&card.contains(document.activeElement))$('.wheel-viewport').focus({preventScroll:true});
   card.tabIndex=pose.reachable?0:-1;
   card.setAttribute('aria-hidden',String(!pose.reachable));
  });
  const pair=clamp(phone.matches?Math.floor(p+.001):Math.round(p),0,geometry.steps);
  if(pair!==lastPair){
   lastPair=pair;
   $('[data-wheel-status]').textContent=`Showing ${phone.matches?'project':'projects'} ${pair+1}${phone.matches?'':' and '+(pair+2)} of ${cards.length}.`;
  }
 }
 const sample=scroll+header.offsetHeight*.5;
 const band=bands.findLast(b=>sample>=b.top);
 header.dataset.tone=band?.tone||'dark';
}
function requestPaint(){if(!frame){lastTime=0;frame=requestAnimationFrame(paint)}}
function measure(){
 let enhanced=phone.matches||(!reduced.matches&&innerHeight>=560);
 const headerHeight=header.offsetHeight;
 root.dataset.mode=phone.matches?'stack':'wheel';
 root.dataset.enhanced=String(enhanced);
 if(enhanced){
  geometry.steps=cards.length-(phone.matches?1:2);
  geometry.width=root.clientWidth;
  root.style.setProperty('--pin-height',phone.matches?`calc(100svh - ${headerHeight}px)`:`${Math.max(420,innerHeight-headerHeight)}px`);
  root.style.setProperty('--pin-top',`${headerHeight}px`);
  const pinHeight=$('.wheel-pin').getBoundingClientRect().height;
  geometry.viewportHeight=$('.wheel-viewport').clientHeight;
  geometry.tabHeight=clamp((geometry.viewportHeight-156)/(cards.length-1),32,44);
  root.style.setProperty('--stack-tab-height',`${geometry.tabHeight}px`);
  const cardHeight=phone.matches?stackPose(cards.length-1,geometry.steps,geometry.viewportHeight,geometry.tabHeight).height:fitCardHeight(cards[0].offsetWidth,geometry.viewportHeight,geometry.width);
  enhanced=phone.matches||cardHeight>=270;
  root.dataset.enhanced=String(enhanced);
  geometry.travel=geometry.steps*Math.max(380,(phone.matches?pinHeight:innerHeight)*.62);
  root.style.setProperty('--wheel-card-height',`${cardHeight}px`);
  cards.forEach((card,i)=>{card.style.height=phone.matches?`${stackPose(i,0,geometry.viewportHeight,geometry.tabHeight).height}px`:''});
  root.style.height=`${pinHeight+geometry.travel+(phone.matches?160:0)}px`;
  geometry.start=root.getBoundingClientRect().top+scrollY-headerHeight;
 }
 if(!enhanced){
  root.style.height='';
  cards.forEach(card=>{card.style.transform='';card.style.visibility='';card.style.zIndex='';card.style.height='';card.removeAttribute('tabindex');card.removeAttribute('aria-hidden')});
  $('[data-wheel-status]').textContent='All six projects are displayed below.';
 }
 bands=$$('[data-tone].home-band').map(el=>({top:el.getBoundingClientRect().top+scrollY,tone:el.dataset.tone}));
 displayedProgress=null;lastPair=-1;requestPaint();
}
function go(index){
 const target=clamp(index,0,geometry.steps);
 window.scrollTo({top:wheelPosition(target,geometry.start,geometry.travel,geometry.steps),behavior:reduced.matches?'instant':'smooth'});
}
const current=()=>wheelProgress(scrollY,geometry.start,geometry.travel,geometry.steps);
$('.wheel-viewport').addEventListener('keydown',event=>{
 if(root.dataset.enhanced!=='true'||event.altKey||event.ctrlKey||event.metaKey)return;
 if(event.key==='ArrowRight'||(phone.matches&&event.key==='ArrowDown')){event.preventDefault();go(Math.floor(current()+.05)+1)}
 if(event.key==='ArrowLeft'||(phone.matches&&event.key==='ArrowUp')){event.preventDefault();go(Math.ceil(current()-.05)-1)}
});
// Native page scrolling drives a sticky scene. No wheel interception or body locking.
window.addEventListener('scroll',requestPaint,{passive:true});
window.addEventListener('resize',measure);
reduced.addEventListener('change',measure);
phone.addEventListener('change',measure);
function previewSolution(id){$$('[data-solution-preview]').forEach(el=>el.hidden=el.dataset.solutionPreview!==id)}
const homeDetails=new Map();
$$('.home-solution,.home-service,.feature-story-copy details').forEach(details=>{
 homeDetails.set(details,disclosure(details,{
  onOpen:({animate})=>{
   const group=details.classList.contains('home-solution')?'home-solution':details.classList.contains('home-service')?'home-service':null;
   if(group)homeDetails.forEach((control,other)=>{if(other!==details&&other.classList.contains(group)&&control.isOpen)control.setOpen(false,{animate})});
   if(group==='home-solution')previewSolution(details.id);
  },
  onSettled:()=>requestAnimationFrame(measure)
 }));
});
function openHash(){
 let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
 const target=document.getElementById(id);if(!target)return;
 if(homeDetails.has(target))homeDetails.get(target).setOpen(true,{animate:false});
 if(target.classList.contains('home-solution'))previewSolution(target.id);
 requestAnimationFrame(()=>{
  revealTarget(target);measure();
  // Layout offsets exclude reveal transforms, keeping deep links clear of the header.
  let top=0;
  for(let node=target;node;node=node.offsetParent)top+=node.offsetTop;
  window.scrollTo({top:top-(parseFloat(getComputedStyle(target).scrollMarginTop)||0),behavior:'instant'});
 });
}
window.addEventListener('hashchange',openHash);
measure();
if(location.hash)openHash();
document.fonts?.ready.then(()=>{measure();if(location.hash)openHash()});
const film=$('#home-film-dialog'),mount=$('[data-home-film-mount]');
let filmOpener;
$$('[data-home-film]').forEach(trigger=>trigger.addEventListener('click',event=>{
 if(event.metaKey||event.ctrlKey||event.altKey||event.shiftKey||!film.showModal)return;
 event.preventDefault();filmOpener=trigger;
 const id=trigger.dataset.homeFilm;if(!/^[\w-]{11}$/.test(id))return;
 const iframe=document.createElement('iframe');
 iframe.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
 iframe.title='The Legend — opening sequence teaser';
 iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
 iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';
 mount.replaceChildren(iframe);film.showModal();document.body.classList.add('film-open');
}));
$('[data-close-home-film]').addEventListener('click',()=>film.close());
film.addEventListener('close',()=>{mount.replaceChildren();document.body.classList.remove('film-open');filmOpener?.focus({preventScroll:true})});
film.addEventListener('click',event=>{if(event.target===film){const r=film.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)film.close()}});

revealTarget=revealOnScroll($$('.home-marker,.wheel-heading h2,.home-intro-grid > *,.home-clients,.home-section-title > *,.home-solution,.solution-art,.home-service,.home-film-play,.cinema-caption,.feature-art,.feature-story-copy,.home-invitation h2,.home-contact-button,.home-invitation p'));

// The opening is an enhancement: normal content is visible before/without JS.
const opening=$('.opening-scene');
let openingAnimations=[];
function finishOpening(){openingAnimations.forEach(animation=>animation.finish());openingAnimations=[]}
function playOpening(){
 if(reduced.matches||document.hidden||location.hash||scrollY>40||!Element.prototype.animate)return;
 const timing={duration:1000,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'};
 const animate=(selector,keyframes,options={})=>{
  const element=$(selector,opening);
  const animation=element.animate(keyframes,{...timing,...options});
  openingAnimations.push(animation);
 };
 animate('.hero-kicker',[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:650});
 animate('.headline-window',[{transform:'translateY(110%)',opacity:0},{transform:'none',opacity:1}],{duration:850,delay:80});
 animate('.headline-period',[{transform:'translateY(-.8em) scale(.45)',opacity:0},{transform:'translateY(.04em) scale(1.08)',opacity:1,offset:.75},{transform:'none',opacity:1}],{duration:560,delay:350});
 animate('.opening-frame',[{clipPath:'inset(48% 100% 48% 0 round 3px)'},{clipPath:'inset(48% 0 48% 0 round 3px)',offset:.3},{clipPath:'inset(0% 0% 0% 0% round 3px)'}],{duration:1050,delay:100});
 animate('.opening-image',[{clipPath:'inset(0 100% 0 0)',transform:'scale(1.035)'},{clipPath:'inset(0 0% 0 0)',transform:'none'}],{duration:750,delay:400});
 animate('.opening-project-caption',[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:500,delay:650});
 animate('.home-hero-bottom',[{opacity:0},{opacity:1}],{duration:450,delay:650});
 Promise.allSettled(openingAnimations.map(animation=>animation.finished)).then(()=>{openingAnimations=[]});
}
playOpening();
opening.addEventListener('focusin',finishOpening);
opening.addEventListener('pointerdown',finishOpening);
reduced.addEventListener('change',()=>{if(reduced.matches)finishOpening()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)finishOpening()});
addEventListener('pagehide',finishOpening);

// Headline, image, caption and destination advance as one spotlight.
const headline=$('[data-headline-word]');
if(headline){
 const spotlights=$$('[data-spotlight-word]'),stage=$('.opening-spotlights');
 const words=spotlights.map(spot=>spot.dataset.spotlightWord);
 const setWord=(el,word)=>{el.toggleAttribute('data-long-word',word.length>8);const dot=document.createElement('span');dot.className='headline-period';dot.textContent='.';el.replaceChildren(document.createTextNode(word),dot)};
 let index=0,timer=0,visible=true,hovered=false,focused=false,revision=0,animations=[],incoming=null,progress=null,pauseUntil=0,gesture=null,suppressClickUntil=0;
 const rail=$('.opening-progress');
 const settle=()=>spotlights.forEach((spot,i)=>{spot.hidden=i!==index;spot.inert=i!==index;spot.setAttribute('aria-hidden',String(i!==index))});
 const stop=()=>{revision++;clearTimeout(timer);progress?.cancel();progress=null;animations.forEach(a=>a.cancel());animations=[];incoming?.remove();incoming=null;settle()};
 const canRun=()=>!reduced.matches&&!document.hidden&&visible&&!hovered&&!focused&&!film.open;
 const schedule=()=>{
  clearTimeout(timer);if(!canRun())return;
  // Fetch the next image ahead of its reveal; hidden slides do not all load at startup.
  $('img',spotlights[(index+1)%words.length]).loading='eager';
  const delay=Math.max(index===0?3400:2700,pauseUntil-Date.now());
  if(phone.matches)progress=rail.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:delay,fill:'forwards'});
  timer=setTimeout(()=>turn(),delay);
 };
 async function turn(direction=1,manual=false){
  stop();
  const next=(index+direction+words.length)%words.length,ticket=revision,nextSpot=spotlights[next],nextImage=$('img',nextSpot);
  nextImage.loading='eager';
  try{await nextImage.decode()}catch{if(ticket===revision)schedule();return}
  if(ticket!==revision||(!manual&&!canRun()))return;
  if(reduced.matches){index=next;setWord(headline,words[index]);settle();return}
  incoming=headline.cloneNode(false);incoming.removeAttribute('data-headline-word');setWord(incoming,words[next]);headline.after(incoming);
  nextSpot.hidden=false;nextSpot.inert=true;nextSpot.setAttribute('aria-hidden','true');
  const options={duration:750,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'};
  animations=[
   headline.animate([{transform:'translateY(0)',opacity:1,filter:'blur(0px)'},{transform:'translateY(-110%)',opacity:0,filter:'blur(5px)'}],options),
   incoming.animate([{transform:'translateY(110%)',opacity:0,filter:'blur(5px)'},{transform:'translateY(0)',opacity:1,filter:'blur(0px)'}],options),
   spotlights[index].animate([{opacity:1},{opacity:0}],options),
   nextSpot.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],options),
   $('.opening-image',nextSpot).animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)'}],options)
  ];
  try{await Promise.all(animations.map(a=>a.finished))}catch{return}
  if(ticket!==revision)return;
  index=next;setWord(headline,words[index]);stop();if(manual&&focused)spotlights[index].focus({preventScroll:true});schedule();
 }
 function sync(){stop();schedule()}
 stage.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;sync()}});
 stage.addEventListener('pointerleave',()=>{hovered=false;sync()});
 stage.addEventListener('focusin',event=>{focused=event.target.matches(':focus-visible');sync()});
 stage.addEventListener('focusout',event=>{focused=stage.contains(event.relatedTarget);sync()});
 stage.addEventListener('pointerdown',event=>{
  if(!phone.matches||!event.isPrimary||event.button!==0)return;
  gesture={id:event.pointerId,x:event.clientX,y:event.clientY,swiped:false};stop();
 });
 stage.addEventListener('dragstart',event=>{if(phone.matches)event.preventDefault()});
 stage.addEventListener('pointermove',event=>{
  if(!gesture||gesture.id!==event.pointerId)return;
  const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
  if(!gesture.swiped&&Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)*1.5){
   gesture.swiped=true;stage.setPointerCapture(event.pointerId);
  }
 });
 stage.addEventListener('pointerup',event=>{
  if(!gesture||gesture.id!==event.pointerId)return;
  const swipe=gesture.swiped,dx=event.clientX-gesture.x;gesture=null;
  if(swipe){suppressClickUntil=Date.now()+500;pauseUntil=Date.now()+6500;focused=false;turn(dx<0?1:-1,true)}else schedule();
 });
 stage.addEventListener('pointercancel',()=>{gesture=null;schedule()});
 stage.addEventListener('click',event=>{if(Date.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation()}},true);
 stage.addEventListener('keydown',event=>{
  if(!phone.matches||event.altKey||event.ctrlKey||event.metaKey||!['ArrowLeft','ArrowRight'].includes(event.key))return;
  event.preventDefault();pauseUntil=Date.now()+6500;
  turn(event.key==='ArrowRight'?1:-1,true);
 });
 phone.addEventListener('change',sync);
 film.addEventListener('close',sync);
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()}).observe(opening);
 sync();
}
