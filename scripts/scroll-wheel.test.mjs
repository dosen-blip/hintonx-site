import test from 'node:test';
import assert from 'node:assert/strict';
import {wheelProgress,cardPose,wheelPosition,fitCardHeight,easeProgress} from '../src/scroll-wheel.mjs';

test('scrolling outside the pinned scene holds its first and last positions',()=>{
 assert.equal(wheelProgress(0,620,2480,4),0);
 assert.equal(wheelProgress(620,620,2480,4),0);
 assert.equal(wheelProgress(3100,620,2480,4),4);
 assert.equal(wheelProgress(4200,620,2480,4),4);
});

test('controls and scroll positions agree for every desktop and phone stop',()=>{
 for(const steps of [4,5])for(let stop=0;stop<=steps;stop++){
  const scroll=wheelPosition(stop,540,2800,steps);
  assert.ok(Math.abs(wheelProgress(scroll,540,2800,steps)-stop)<1e-10);
 }
 assert.equal(wheelPosition(-1,540,2800,5),540);
 assert.equal(wheelPosition(10,540,2800,5),3340);
});

test('all six projects become keyboard reachable during the sequence',()=>{
 for(const mobile of [false,true]){
  const reached=new Set(),steps=mobile?5:4;
  for(let stop=0;stop<=steps;stop++){
   const visible=[];
   for(let card=0;card<6;card++)if(cardPose(card,stop,1440,mobile).reachable){reached.add(card);visible.push(card)}
   assert.equal(visible.length,mobile?1:2);
  }
  assert.deepEqual([...reached],[0,1,2,3,4,5]);
 }
});

test('rotation follows a continuous circular arc and reverses without stored state',()=>{
 const before=cardPose(2,1.1,1440),after=cardPose(2,1.101,1440),radius=1440*1.27;
 assert.ok(after.x<before.x);
 assert.ok(Math.abs(after.x-before.x)<2);
 assert.ok(Math.abs(before.x**2+(radius-before.y)**2-radius**2)<1e-6);
 assert.deepEqual(cardPose(2,1.1,1440),before);
 assert.equal(cardPose(2,2,390,true).angle,0);
});

test('card sizing keeps the full selected pair within the pinned viewport',()=>{
 for(const [scene,width,viewport,mobile] of [[1425,634,611,false],[1009,491,520,false],[768,369,660,false],[375,308,435,true],[320,253,370,true]]){
  const height=fitCardHeight(width,viewport,scene,mobile);
  const pose=cardPose(0,0,scene,mobile),angle=Math.abs(pose.angle)*Math.PI/180;
  const bottom=(mobile?15:35)+pose.y+height*(1+Math.cos(angle))/2+width*Math.sin(angle)/2;
  assert.ok(height>=270);
  assert.ok(bottom<=viewport-17.99);
 }
});


test('scroll easing approaches either direction without overshoot',()=>{
 for(const [start,target] of [[0,4],[4,0],[1.25,2.8]]){
  let current=start;
  for(let i=0;i<120;i++){
   const next=easeProgress(current,target,1000/60);
   assert.ok(next>=Math.min(current,target)&&next<=Math.max(current,target));
   current=next;
  }
  assert.ok(Math.abs(current-target)<1e-6);
 }
});

test('easing feels the same at different frame rates and can reverse immediately',()=>{
 const step=(hz)=>{let p=0;for(let i=0;i<hz;i++)p=easeProgress(p,4,1000/hz);return p};
 assert.ok(Math.abs(step(60)-step(120))<1e-10);
 const moving=easeProgress(0,4,100);
 assert.ok(easeProgress(moving,0,16)<moving);
 assert.equal(easeProgress(2,4,0),2);
});
