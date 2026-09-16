const $=(selector,root=document)=>root.querySelector(selector),$$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:760px)');
const film=document.querySelector('#home-film-dialog, .template-player');
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
