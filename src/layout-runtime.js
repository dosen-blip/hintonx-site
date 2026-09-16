import {storageKey,validateState,effectiveDesign} from './layout-model.mjs';
// Local editing never affects the shared development host or a published site.
if (['localhost','127.0.0.1','[::1]'].includes(location.hostname)) {
  const catalog=await fetch('/layout-catalog.json').then(r=>r.json());
  const page=catalog.find(p=>p.path===location.pathname);
  if(page){
    const nodes=new Map([...document.querySelectorAll('[data-layout-slot]')].map(el=>[el.dataset.layoutSlot,el]));
    const positions=new Map([...nodes].map(([key,el])=>[key,{parent:el.parentNode,anchor:document.createComment(key)}]));
    for(const [key,el]of nodes)el.before(positions.get(key).anchor);
    function apply(value){
      const state=validateState(value,catalog),template=state.templates[state.assignments[page.path]];
      // Restore before each apply so switching templates never duplicates or loses content.
      for(const [key,el]of nodes){positions.get(key).anchor.after(el);el.hidden=false;}
      for(const parent of new Set([...positions.values()].map(p=>p.parent))){
        const ordered=template.slots.filter(s=>positions.get(s.key)?.parent===parent);
        const marker=ordered.map(s=>positions.get(s.key).anchor).sort((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1)[0];
        let previous=marker;
        for(const slot of ordered){const el=nodes.get(slot.key);previous.after(el);previous=el;el.hidden=!slot.enabled;setDesign(el,effectiveDesign(state,slot));}
      }
      for(const [selector,kind]of [['.site-header','navigation'],['.site-footer','footer']]){const el=document.querySelector(selector);if(el)setDesign(el,state.global[kind]);}
      document.body.dataset.layoutDraft='true';
      window.dispatchEvent(new Event('resize'));
    }
    function setDesign(el,settings){for(const field of ['variant','width','spacing','surface'])el.setAttribute(`data-layout-${field}`,settings[field]||'original');}
    function saved(){try{const raw=localStorage.getItem(storageKey);if(raw)apply(JSON.parse(raw));}catch(error){console.warn('Layout draft not applied:',error.message);}}
    saved();
    addEventListener('storage',e=>{if(e.key===storageKey){if(e.newValue)saved();else location.reload();}});
    addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent)return;if(e.data?.type==='hintonx-layout-focus'){document.querySelectorAll('[data-layout-selected]').forEach(el=>el.removeAttribute('data-layout-selected'));const el=nodes.get(e.data.key)||document.querySelector(e.data.key==='navigation'?'.site-header':e.data.key==='footer'?'.site-footer':':not(*)');if(el&&!el.hidden){el.setAttribute('data-layout-selected','');el.scrollIntoView({block:'start',behavior:'instant'});}return;}if(e.data?.type!=='hintonx-layout-preview')return;try{apply(e.data.state);parent.postMessage({type:'hintonx-layout-applied',path:page.path},location.origin);}catch(error){parent.postMessage({type:'hintonx-layout-error',message:error.message},location.origin);}});
    if(parent!==window)parent.postMessage({type:'hintonx-layout-ready',path:page.path},location.origin);
  }
}
