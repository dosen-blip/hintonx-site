export const storageKey = 'hintonx.layout-draft.v1';
export const kinds = {hero:'Hero',content:'Content',projects:'Project collection',gallery:'Gallery',cta:'Project invitation',navigation:'Navigation',footer:'Footer'};
export const choices = {variant:['original','stacked','split'],width:['original','narrow','wide'],spacing:['original','compact','generous'],surface:['original','dark','light']};
export function defaults(catalog) {
  const templates = {};
  for (const family of [...new Set(catalog.map(p=>p.family))]) {
    const pages = catalog.filter(p=>p.family===family), slots=[];
    for(const page of pages) for(const slot of page.slots) if(!slots.some(s=>s.key===slot.key)) slots.push({...slot,enabled:true,design:{}});
    // Optional galleries belong before results even when the first page has none.
    slots.sort((a,b)=>a.order-b.order);
    templates[family]={id:family,name:pages[0].familyLabel,family,slots};
  }
  for(const family of ['case','service','publiccase','home']) {
    if(!templates[family])continue;
    const copy=structuredClone(templates[family]);copy.id=`${family}-alternative`;copy.name=`${copy.name} — ${family==='home'?'Stacked':'Split hero'}`;
    copy.slots[0].design={variant:family==='home'?'stacked':'split'};templates[copy.id]=copy;
  }
  return {version:1,templates,assignments:Object.fromEntries(catalog.map(p=>[p.path,p.family])),global:Object.fromEntries(Object.keys(kinds).map(k=>[k,{}]))};
}
export function effectiveDesign(state,slot) {return {...state.global[slot.kind],...slot.design};}
export function linkedPages(state,catalog,templateId) {return catalog.filter(p=>state.assignments[p.path]===templateId);}
export function validateState(value,catalog) {
  if(!value || value.version!==1 || !value.templates || !value.assignments || !value.global) throw Error('This is not a HintonX layout draft.');
  const base=defaults(catalog),clean={version:1,templates:{},assignments:{},global:{}};
  function design(d={}) {const result={};for(const [key,allowed] of Object.entries(choices)) {if(d[key]!==undefined){if(!allowed.includes(d[key]))throw Error('Unknown design setting.');result[key]=d[key];}}return result;}
  if(Object.keys(value.templates).length>100)throw Error('Too many templates.');
  for(const [id,t] of Object.entries(value.templates)) {
    if(!/^[a-z0-9-]{1,80}$/.test(id)||!base.templates[t.family]||typeof t.name!=='string'||!t.name.trim()||t.name.length>80||!Array.isArray(t.slots))throw Error('Invalid template.');
    const available=base.templates[t.family].slots;
    if(t.slots.length!==available.length||new Set(t.slots.map(s=>s.key)).size!==available.length)throw Error('Template containers are missing or duplicated.');
    clean.templates[id]={id,name:t.name.trim(),family:t.family,slots:t.slots.map(s=>{const original=available.find(a=>a.key===s.key);if(!original||typeof s.enabled!=='boolean')throw Error('Invalid container.');return {...original,enabled:s.enabled,design:design(s.design)};})};
  }
  for(const page of catalog) {const id=value.assignments[page.path];if(!clean.templates[id]||clean.templates[id].family!==page.family)throw Error('A page has an incompatible template.');clean.assignments[page.path]=id;}
  for(const kind of Object.keys(kinds))clean.global[kind]=design(value.global[kind]);
  return clean;
}
