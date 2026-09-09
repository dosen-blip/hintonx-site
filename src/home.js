import {disclosure,revealOnScroll} from './motion.mjs';
import {clamp,wheelProgress,cardPose,wheelPosition,fitCardHeight,easeProgress} from './scroll-wheel.mjs';
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
  displayedProgress=displayedProgress===null||offscreen?target:easeProgress(displayedProgress,target,elapsed);
  if(Math.abs(displayedProgress-target)<.0005)displayedProgress=target;
  const p=displayedProgress;
  lastTime=time;
  if(p!==target)frame=requestAnimationFrame(paint);
  root.style.setProperty('--wheel-progress',p/geometry.steps);
  cards.forEach((card,i)=>{
   const pose=cardPose(i,p,geometry.width,phone.matches);
   card.style.transform=`translate3d(calc(-50% + ${pose.x.toFixed(2)}px), ${pose.y.toFixed(2)}px, 0) rotate(${pose.angle.toFixed(3)}deg)`;
   card.style.visibility=pose.near?'visible':'hidden';
   card.style.zIndex=String(1000-Math.round(Math.abs(pose.angle)*10));
   if(!pose.reachable&&card.contains(document.activeElement))$('.wheel-viewport').focus({preventScroll:true});
   card.tabIndex=pose.reachable?0:-1;
   card.setAttribute('aria-hidden',String(!pose.reachable));
  });
  $('[data-wheel-prev]').disabled=target<.015;
  $('[data-wheel-next]').disabled=target>geometry.steps-.015;
  const pair=clamp(Math.round(p),0,geometry.steps);
  if(pair!==lastPair){
   lastPair=pair;
   const n=String(pair+1).padStart(2,'0');
   $('[data-wheel-count]').textContent=phone.matches?`${n} / 06`:`${n}—${String(pair+2).padStart(2,'0')} / 06`;
   $('[data-wheel-status]').textContent=`Showing ${phone.matches?'project':'projects'} ${pair+1}${phone.matches?'':' and '+(pair+2)} of ${cards.length}.`;
  }
 }
 const sample=scroll+header.offsetHeight*.5;
 const band=bands.findLast(b=>sample>=b.top);
 header.dataset.tone=band?.tone||'dark';
}
function requestPaint(){if(!frame){lastTime=0;frame=requestAnimationFrame(paint)}}
function measure(){
 let enhanced=!reduced.matches&&innerHeight>=560;
 const headerHeight=header.offsetHeight;
 root.dataset.enhanced=String(enhanced);
 if(enhanced){
  geometry.steps=cards.length-(phone.matches?1:2);
  geometry.width=root.clientWidth;
  const pinHeight=Math.max(420,innerHeight-headerHeight);
  geometry.travel=geometry.steps*Math.max(380,innerHeight*.62);
  root.style.setProperty('--pin-height',`${pinHeight}px`);
  root.style.setProperty('--pin-top',`${headerHeight}px`);
  const cardHeight=fitCardHeight(cards[0].offsetWidth,$('.wheel-viewport').clientHeight,geometry.width,phone.matches);
  enhanced=cardHeight>=270;
  root.dataset.enhanced=String(enhanced);
  root.style.setProperty('--wheel-card-height',`${cardHeight}px`);
  root.style.height=`${pinHeight+geometry.travel}px`;
  geometry.start=root.getBoundingClientRect().top+scrollY-headerHeight;
 }
 if(!enhanced){
  root.style.height='';
  cards.forEach(card=>{card.style.transform='';card.style.visibility='';card.style.zIndex='';card.removeAttribute('tabindex');card.removeAttribute('aria-hidden')});
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
$('[data-wheel-prev]').addEventListener('click',()=>go(Math.ceil(current()-.05)-1));
$('[data-wheel-next]').addEventListener('click',()=>go(Math.floor(current()+.05)+1));
$('.wheel-viewport').addEventListener('keydown',event=>{
 if(root.dataset.enhanced!=='true'||event.altKey||event.ctrlKey||event.metaKey)return;
 if(event.key==='ArrowRight'){event.preventDefault();go(Math.floor(current()+.05)+1)}
 if(event.key==='ArrowLeft'){event.preventDefault();go(Math.ceil(current()-.05)-1)}
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
const film=$('#home-film-dialog'),trigger=$('[data-home-film]'),mount=$('[data-home-film-mount]');
trigger.addEventListener('click',event=>{
 if(event.metaKey||event.ctrlKey||event.altKey||event.shiftKey||!film.showModal)return;
 event.preventDefault();
 const id=trigger.dataset.homeFilm;if(!/^[\w-]{11}$/.test(id))return;
 const iframe=document.createElement('iframe');
 iframe.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
 iframe.title='The Legend — opening sequence teaser';
 iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
 iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';
 mount.replaceChildren(iframe);film.showModal();document.body.classList.add('film-open');
});
$('[data-close-home-film]').addEventListener('click',()=>film.close());
film.addEventListener('close',()=>{mount.replaceChildren();document.body.classList.remove('film-open')});
film.addEventListener('click',event=>{if(event.target===film){const r=film.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)film.close()}});

revealTarget=revealOnScroll($$('.hero-kicker,.home-hero h1,.home-hero-bottom,.home-marker,.wheel-heading h2,.home-intro-grid > *,.home-clients,.home-section-title > *,.home-solution,.solution-art,.home-service,.home-film-play,.cinema-caption,.feature-art,.feature-story-copy,.home-invitation h2,.home-contact-button,.home-invitation p'));

// A single accessible heading; only the decorative word layer cycles.
const headline=$('[data-headline-word]');
if(headline){
 const setWord=(el,word)=>{const dot=document.createElement('span');dot.className='headline-period';dot.textContent='.';el.replaceChildren(document.createTextNode(word),dot)};
 const words=['Design','Video','UX','Generative AI','Development','Branding'];
 let index=0,timer=0,visible=true,animations=[],incoming=null;
 const stop=()=>{clearTimeout(timer);animations.forEach(a=>a.cancel());animations=[];incoming?.remove();incoming=null};
 const schedule=()=>{clearTimeout(timer);if(!reduced.matches&&!document.hidden&&visible)timer=setTimeout(turn,2200)};
 function turn(){
  const next=(index+1)%words.length;
  incoming=headline.cloneNode(false);incoming.removeAttribute('data-headline-word');setWord(incoming,words[next]);headline.after(incoming);
  const options={duration:750,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'};
  animations=[headline.animate([{transform:'translateY(0)',opacity:1,filter:'blur(0px)'},{transform:'translateY(-110%)',opacity:0,filter:'blur(5px)'}],options),incoming.animate([{transform:'translateY(110%)',opacity:0,filter:'blur(5px)'},{transform:'translateY(0)',opacity:1,filter:'blur(0px)'}],options)];
  Promise.all(animations.map(a=>a.finished)).then(()=>{index=next;setWord(headline,words[index]);stop();schedule()}).catch(()=>{});
 }
 function sync(){stop();schedule()}
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()}).observe(headline.closest('h1'));
 sync();
}
