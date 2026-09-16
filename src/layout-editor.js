import {storageKey,kinds,choices,defaults,validateState,effectiveDesign,linkedPages} from './layout-model.mjs';
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const status=message=>{$('#editor-status').textContent=message;};
if(!['localhost','127.0.0.1','[::1]'].includes(location.hostname)) {
  document.querySelector('.editor-workspace').replaceChildren();
  $('#save-state').textContent='Local editor only';$('#save').disabled=true;
} else {
 const catalog=await fetch('/layout-catalog.json').then(r=>r.json());
 let state=defaults(catalog),saved,history=[],page=catalog.find(p=>p.path==='/projects/1valet/')||catalog[0],selection=page.slots[0].key,scope='template',dirty=false;
 try{const raw=localStorage.getItem(storageKey);if(raw)state=validateState(JSON.parse(raw),catalog);}catch{status('The saved draft could not be read. Original layouts are loaded.');}
 saved=structuredClone(state);
 const template=()=>state.templates[state.assignments[page.path]];
 const slot=()=>template().slots.find(s=>s.key===selection);
 const preview=$('#preview');
 $('#page').innerHTML=[...new Set(catalog.map(p=>p.family))].map(family=>`<optgroup label="${esc(catalog.find(p=>p.family===family).familyLabel)}">${catalog.filter(p=>p.family===family).map(p=>`<option value="${esc(p.path)}">${esc(p.title)}${catalog.filter(other=>other.family===family&&other.title===p.title).length>1?' · '+esc(p.path.split('/').filter(Boolean).at(-1).replaceAll('-',' ')):''}</option>`).join('')}</optgroup>`).join('');
 function focusPreview(){preview.contentWindow?.postMessage({type:'hintonx-layout-focus',key:selection},location.origin);}
 function send(){preview.contentWindow?.postMessage({type:'hintonx-layout-preview',state},location.origin);}
 function dirtyState(){dirty=JSON.stringify(state)!==JSON.stringify(saved);$('#save-state').textContent=dirty?'Unsaved changes':'Saved locally';$('#save').disabled=!dirty;$('#undo').disabled=!history.length;}
 function change(fn,message){history.push(structuredClone(state));if(history.length>30)history.shift();fn();dirtyState();render();send();if(message)status(message);}
 function render(){
   const t=template();if(!t.slots.some(s=>s.key===selection)&&!['navigation','footer'].includes(selection))selection=t.slots[0].key;
   $('#page').value=page.path;
   $('#template').innerHTML=Object.values(state.templates).filter(t=>t.family===page.family).map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join('');$('#template').value=t.id;
   $('#template-name').value=t.name;
   const linked=linkedPages(state,catalog,t.id);$('#impact').textContent=`${linked.length} page${linked.length===1?'':'s'} ${linked.length===1?'uses':'use'} this template: ${linked.map(p=>p.title).join(', ')}.`;
   $('#apply-family').textContent=`Apply to all ${catalog.filter(p=>p.family===page.family).length} ${page.familyLabel.toLowerCase()} pages`;
   $('#slots').innerHTML=t.slots.map((s,i)=>{
     const present=page.slots.some(p=>p.key===s.key);
     return `<div class="slot ${s.key===selection?'selected':''}"><input type="checkbox" aria-label="Show ${esc(s.label)}" data-enable="${s.key}" ${s.enabled?'checked':''}><button data-select="${s.key}">${esc(s.label)}${present?'':`<small>No content on this page</small>`}</button><button class="move" data-move="${s.key}" data-direction="-1" aria-label="Move ${esc(s.label)} up" ${i===0?'disabled':''}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg></button><button class="move" data-move="${s.key}" data-direction="1" aria-label="Move ${esc(s.label)} down" ${i===t.slots.length-1?'disabled':''}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></div>`;
   }).join('');
   $('#preview-title').textContent=page.title;$('#open-page').href=page.path;renderDesign();dirtyState();
 }
 function renderDesign(){
   const s=slot(),kind=s?.kind||selection,isShell=!s;
   if(isShell)scope='global';$('#scope').value=scope;$('#scope').disabled=isShell;
   $('#container-title').textContent=s?s.label:kinds[kind];
   const affected=scope==='global'?catalog.filter(p=>{const t=state.templates[state.assignments[p.path]];return isShell||t.slots.some(s=>s.kind===kind&&s.enabled&&p.slots.some(ps=>ps.key===s.key));}):linkedPages(state,catalog,template().id);
   $('#design-impact').textContent=scope==='global'?`Shared ${kinds[kind].toLowerCase()} defaults · ${affected.length} pages. Template overrides stay intact.`:`${template().name} · ${affected.length} linked pages. Text and media stay with each page.`;
   const settings=scope==='global'?state.global[kind]:s.design,effective=s?effectiveDesign(state,s):settings;
   const names={variant:'Layout',width:'Content width',spacing:'Spacing',surface:'Background'};
   $('#design-fields').innerHTML=`<div class="design-grid">${Object.entries(choices).filter(([key])=>!isShell||key==='surface'||(kind==='footer'&&key==='spacing')).map(([field,options])=>`<label class="field">${names[field]}<select data-design="${field}">${scope==='template'?`<option value="inherit">Shared (${esc(state.global[kind]?.[field]||'original')})</option>`:''}${options.map(v=>`<option value="${v}">${v==='original'?'Original':v[0].toUpperCase()+v.slice(1)}</option>`).join('')}</select></label>`).join('')}</div>`;
   document.querySelectorAll('[data-design]').forEach(el=>{el.value=settings[el.dataset.design]||(scope==='template'?'inherit':'original');});
   $('#inherit').hidden=scope==='global';
 }
 function navigate(){selection=template().slots[0].key;scope='template';render();preview.src=page.path;}
 $('#page').addEventListener('change',e=>{page=catalog.find(p=>p.path===e.target.value);navigate();});
 $('#template').addEventListener('change',e=>{change(()=>state.assignments[page.path]=e.target.value,'Template switched; page content preserved.');});
 $('#apply-family').addEventListener('click',()=>{const id=template().id;change(()=>{for(const p of catalog.filter(p=>p.family===page.family))state.assignments[p.path]=id;},'Template applied to this page family.');});
 $('#rename').addEventListener('click',()=>{const name=$('#template-name').value.trim();if(!name)return status('Enter a template name.');change(()=>template().name=name,'Template renamed.');});
 $('#duplicate').addEventListener('click',()=>{const name=$('#template-name').value.trim()||`${template().name} copy`;change(()=>{const id=`custom-${crypto.randomUUID()}`;state.templates[id]={...structuredClone(template()),id,name};state.assignments[page.path]=id;},'New template created and assigned to this page. Other pages keep their current template.');});
 $('#slots').addEventListener('change',e=>{if(!e.target.dataset.enable)return;change(()=>template().slots.find(s=>s.key===e.target.dataset.enable).enabled=e.target.checked,'Container visibility updated for linked pages.');});
 $('#slots').addEventListener('click',e=>{const select=e.target.closest('[data-select]'),move=e.target.closest('[data-move]');if(select){selection=select.dataset.select;render();send();focusPreview();return;}if(move){const key=move.dataset.move,dir=Number(move.dataset.direction);change(()=>{const slots=template().slots,i=slots.findIndex(s=>s.key===key);if(i+dir>=0&&i+dir<slots.length)[slots[i],slots[i+dir]]=[slots[i+dir],slots[i]];},'Container order updated.');}});
 document.querySelectorAll('[data-global]').forEach(button=>button.addEventListener('click',()=>{selection=button.dataset.global;scope='global';render();focusPreview();}));
 $('#scope').addEventListener('change',e=>{scope=e.target.value;renderDesign();});
 $('#design-fields').addEventListener('change',e=>{const field=e.target.dataset.design;if(!field)return;const value=e.target.value;change(()=>{const target=scope==='global'?state.global[slot()?.kind||selection]:slot().design;if(value==='inherit')delete target[field];else target[field]=value;},'Design updated in the preview.');});
 $('#inherit').addEventListener('click',()=>change(()=>slot().design={},'Container now inherits shared defaults.'));
 $('#save').addEventListener('click',()=>{try{state=validateState(state,catalog);localStorage.setItem(storageKey,JSON.stringify(state));saved=structuredClone(state);dirtyState();status('Saved locally. Other local pages now use this draft. Nothing was published.');}catch(error){status(`Could not save: ${error.message}`);}});
 $('#undo').addEventListener('click',()=>{if(!history.length)return;state=history.pop();render();send();status('Last change undone.');});
 $('#revert').addEventListener('click',()=>change(()=>state=structuredClone(saved),'Unsaved changes reverted.'));
 $('#reset').addEventListener('click',()=>change(()=>state=defaults(catalog),'Original layouts restored in the preview. Save locally to apply, or undo.'));
 $('#export').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='hintonx-layout-draft.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Draft exported.');});
 $('#import').addEventListener('change',async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>200000)throw Error('Draft file is too large.');const imported=validateState(JSON.parse(await file.text()),catalog);change(()=>state=imported,'Draft imported into preview. Save locally to keep it.');}catch(error){status(`Import rejected: ${error.message}`);}e.target.value='';});
 document.querySelectorAll('[data-device]').forEach(button=>button.addEventListener('click',()=>{preview.classList.toggle('phone',button.dataset.device==='phone');document.querySelectorAll('[data-device]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
 addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==preview.contentWindow)return;if(e.data?.type==='hintonx-layout-ready'){const p=catalog.find(p=>p.path===e.data.path);if(p&&p.path!==page.path){page=p;selection=template().slots[0].key;render();}send();}if(e.data?.type==='hintonx-layout-error')status(e.data.message);});
 addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
 navigate();
}
