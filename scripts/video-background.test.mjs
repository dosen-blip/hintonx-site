import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source = readFileSync(new URL('../src/video-background.js', import.meta.url), 'utf8');
function runtime(reduced = false) {
  const element = (extra = {}) => Object.assign(new EventTarget(), {hidden:false, textContent:'', setAttribute(){}, getAttribute(){return '/placeholder';}}, extra);
  const label=element(), glyph=element(), status=element();
  const toggle=element({querySelector:s=>s==='span'?label:glyph});
  const video=element({paused:true, plays:0, muted:false, play(){this.paused=false;this.plays++;this.dispatchEvent(new Event('playing'));return Promise.resolve();}, pause(){this.paused=true;this.dispatchEvent(new Event('pause'));}});
  let playing=false, intersection;
  const section=element({querySelector:s=>({video,img:element(),button:toggle,'[data-video-status]':status})[s],toggleAttribute:(name,value)=>{playing=value;}});
  const document=element({hidden:false,querySelector:s=>s==='.video-background'?section:null});
  const motion=element({matches:reduced});
  runInNewContext(source,{document,matchMedia:()=>motion,Event});
  return {video,toggle,status,motion,document,playing:()=>playing};
}
test('reduced motion keeps the poster and prevents automatic playback',()=>{
  const r=runtime(true);
  assert.equal(r.video.plays,0); assert.equal(r.playing(),false);
  r.motion.matches=false; r.motion.dispatchEvent(new Event('change'));
  assert.equal(r.playing(),true); assert.equal(r.video.muted,true);
  r.motion.matches=true; r.motion.dispatchEvent(new Event('change'));
  assert.equal(r.video.paused,true); assert.equal(r.playing(),false);
});
test('autoplay starts muted and resumes when the tab becomes visible',()=>{
  const r=runtime();assert.equal(r.playing(),true);assert.equal(r.video.muted,true);
  r.document.hidden=true;r.document.dispatchEvent(new Event('visibilitychange'));assert.equal(r.video.paused,true);
  r.document.hidden=false;r.document.dispatchEvent(new Event('visibilitychange'));assert.equal(r.playing(),true);
});
test('failed media restores the fallback',()=>{
  const r=runtime();r.video.dispatchEvent(new Event('error'));
  assert.equal(r.playing(),false);assert.match(r.status.textContent,/fallback image/);
  assert.equal(r.video.paused,true);
});
