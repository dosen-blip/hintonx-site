import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {defaults,validateState,effectiveDesign,linkedPages} from '../src/layout-model.mjs';
import {annotatePage} from './layout-catalog.mjs';
import {renderHome,renderCaseStudy} from '../src/render.mjs';
import {projects} from '../src/site-data.mjs';
const catalog=JSON.parse(readFileSync(new URL('../dist/layout-catalog.json',import.meta.url)));
test('all real pages have unique stable sections and compatible default assignments',()=>{
 const state=defaults(catalog);assert.equal(catalog.length,25);
 for(const p of catalog){assert.ok(p.slots.length);assert.equal(new Set(p.slots.map(s=>s.key)).size,p.slots.length);assert.equal(state.templates[state.assignments[p.path]].family,p.family);}
 assert.deepEqual(validateState(state,catalog),state);
});
test('global changes propagate while explicit template overrides remain intact',()=>{
 const state=defaults(catalog),original=state.templates.case.slots[0],alternative=state.templates['case-alternative'].slots[0];
 state.global.hero={variant:'stacked',width:'wide'};
 assert.deepEqual(effectiveDesign(state,original),{variant:'stacked',width:'wide'});
 assert.deepEqual(effectiveDesign(state,alternative),{variant:'split',width:'wide'});
 delete alternative.design.variant;assert.equal(effectiveDesign(state,alternative).variant,'stacked');
});
test('assigning a template affects only chosen pages and never mutates content',()=>{
 const state=defaults(catalog),before=JSON.stringify(catalog),p=catalog.find(p=>p.family==='case');
 state.assignments[p.path]='case-alternative';
 assert.equal(linkedPages(state,catalog,'case-alternative').length,1);
 assert.equal(linkedPages(state,catalog,'case').length,7);
 assert.equal(JSON.stringify(catalog),before);
 assert.equal(state.templates.case.slots[0].design.variant,undefined);
});
test('import rejects incompatible assignments, duplicate sections and invalid style values',()=>{
 let state=defaults(catalog);state.assignments['/']='case';assert.throws(()=>validateState(state,catalog),/incompatible/);
 state=defaults(catalog);state.templates.case.slots[1]=state.templates.case.slots[0];assert.throws(()=>validateState(state,catalog),/duplicated/);
 state=defaults(catalog);state.global.hero={surface:'url(javascript:bad)'};assert.throws(()=>validateState(state,catalog),/Unknown/);
});
test('optional galleries cannot shift stable case section identities',()=>{
 for(const p of projects){const {page}=annotatePage(renderCaseStudy(p),`/projects/${p.slug}/`);assert.equal(page.slots.find(s=>s.label==='Result').key,'case-3');assert.equal(page.slots.some(s=>s.key==='case-2'),p.media.length>1);}
});
test('home hero and collection are independently selectable without dropping content',()=>{
 const before=renderHome(),{html,page}=annotatePage(before,'/');assert.equal(page.slots.length,8);assert.equal(page.slots[0].label,'Hero');assert.equal(page.slots[1].label,'Selected project collection');
 const text=s=>s.replace(/<[^>]*>/g,'');assert.equal(text(html),text(before));
});
