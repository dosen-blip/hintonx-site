import test from 'node:test';
import assert from 'node:assert/strict';
import {workCards,workFilters} from '../src/work-content.mjs';
import {projects,videoProjects} from '../src/site-data.mjs';
import {publicSectorCases} from '../src/publicsector-content.mjs';
import {initWorkFilters} from '../src/work-filter.mjs';

test('Work includes all case studies, a single Atlas entry and every existing film',()=>{
 const ids=workCards.map(card=>card.id);
 assert.equal(new Set(ids).size,ids.length);
 for(const story of [...projects,...publicSectorCases])assert.ok(ids.includes(story.slug),story.slug);
 assert.equal(workCards.filter(card=>card.filmId).length,videoProjects.length);
 for(const card of workCards){assert.ok(card.categories.length);assert.ok(card.categories.every(category=>workFilters.includes(category)));}
});

test('filters select one badge, hide non-matches and restore the full grid',()=>{
 const buttons=workFilters.map(label=>({dataset:{workFilter:label},pressed:label==='View All',setAttribute(name,value){this.pressed=value==='true'},addEventListener(type,callback){this.click=callback}}));
 const elements=workCards.map(card=>({dataset:{categories:JSON.stringify(card.categories)},hidden:false}));
 const status={textContent:''};
 initWorkFilters({querySelectorAll:selector=>selector==='[data-work-filter]'?buttons:elements,querySelector:()=>status});
 for(const button of buttons.slice(1)){
  button.click();
  assert.equal(buttons.filter(item=>item.pressed).length,1);assert.equal(button.pressed,true);
  elements.forEach((element,index)=>assert.equal(element.hidden,!workCards[index].categories.includes(button.dataset.workFilter)));
  const visible=elements.filter(element=>!element.hidden).length;
  assert.ok(visible>0);assert.ok(status.textContent.includes(`${visible} `));
 }
 buttons[0].click();assert.ok(elements.every(element=>!element.hidden));assert.equal(buttons[0].pressed,true);
});

test('each video card opens its own case page with an inline player and no modal trigger',async()=>{
 const {renderVideoCase,renderProjects,renderHome,renderVideo,renderVertical}=await import('../src/render.mjs');
 const {verticals}=await import('../src/verticals.mjs');
 const {readFileSync}=await import('node:fs');
 const routes=new Set();
 for(const film of videoProjects){
  assert.ok(film.client);assert.ok(!routes.has(film.href));routes.add(film.href);
  const card=workCards.find(card=>card.filmId===film.id);
  assert.equal(card.href,film.href);assert.equal(card.client,film.client);
  const html=renderVideoCase(film);
  assert.ok(html.includes(`youtube-nocookie.com/embed/${film.id}?rel=0`));
  assert.ok(!html.includes('autoplay=1'));assert.ok(!html.includes('case-film-dialog'));
  assert.ok(readFileSync(new URL(`../dist${film.href}index.html`,import.meta.url),'utf8').includes(`<iframe`));
 }
 assert.doesNotMatch(renderProjects(),/data-work-film=/);
 assert.doesNotMatch(renderHome(),/data-home-film=/);
 assert.doesNotMatch(renderVertical(verticals.find(v=>v.slug==='video')),/data-service-film=/);
 for(const film of videoProjects)assert.ok(renderVideo().includes(`href="${film.href}"`));
});
