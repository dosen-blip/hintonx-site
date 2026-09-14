import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { publicSector, publicSectorCases, publicSectorHref } from '../src/publicsector-content.mjs';
import { publicSectorCaseBody, publicSectorVisual } from '../src/publicsector-render.mjs';
import { renderPublicSectorCase } from '../src/render.mjs';
import { site } from '../src/site-data.mjs';

test('all seven routes have unique metadata, valid breadcrumbs and preview indexing protection', async () => {
  const titles = new Set(), descriptions = new Set();
  const routes = ['/publicsector/', ...publicSectorCases.map(publicSectorHref)];
  for (const route of routes) {
    const html = await readFile(new URL(`../dist${route}index.html`, import.meta.url), 'utf8');
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, route);
    assert.match(html, new RegExp(`<link rel="canonical" href="${site.origin}${route}">`));
    assert.equal(html.includes('<meta name="robots" content="noindex, follow">'), !publicSector.indexable);
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
    assert.ok(!titles.has(title), `Duplicate title: ${route}`);
    assert.ok(!descriptions.has(description), `Duplicate description: ${route}`);
    titles.add(title); descriptions.add(description);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
    assert.equal(graph[0]['@type'], 'WebPage');
    assert.equal(graph[1]['@type'], 'BreadcrumbList');
    assert.equal(graph[1].itemListElement.at(-1).item, site.origin + route);
    const social = html.match(/<meta property="og:image" content="([^"]+)"/)[1];
    const png = await readFile(new URL(`../dist${new URL(social).pathname}`, import.meta.url));
    assert.equal(png.subarray(1,4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16),1200); assert.equal(png.readUInt32BE(20),630);
  }
});

test('preview routes are excluded from the sitemap without blocking crawlers from reading noindex', async () => {
  const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url),'utf8');
  const robots = await readFile(new URL('../dist/robots.txt', import.meta.url),'utf8');
  assert.doesNotMatch(sitemap,/404/);
  assert.equal(sitemap.includes('/publicsector/'), publicSector.indexable);
  assert.equal((sitemap.match(/<loc>/g)||[]).length,18 + (publicSector.indexable ? 7 : 0));
  assert.match(robots,/Sitemap: https:\/\/hintonx-site.pages.dev/);
  assert.doesNotMatch(robots,/Disallow/);
  const previous = publicSector.indexable;
  try {
    publicSector.indexable = false;
    assert.match(renderPublicSectorCase(publicSectorCases[0]),/noindex, follow/);
    publicSector.indexable = true;
    assert.doesNotMatch(renderPublicSectorCase(publicSectorCases[0]),/noindex, follow/);
  } finally { publicSector.indexable = previous; }
});

test('missing required content renders specific placeholders and absent optional content is omitted', () => {
  const story = {...publicSectorCases[0],overview:null,images:[],hero:null,work:[],services:null,outcome:null};
  const html = publicSectorCaseBody(story);
  for (const label of ['Services','Outcome','What was done']) assert.ok(html.includes(`${label} — content pending.`));
  assert.match(html,/Project image pending/);
  assert.doesNotMatch(html,/<h2>Overview|aria-label="Project gallery"|<img/);
});

test('supplied claims and technical terminology survive content preparation', () => {
  const cbsa = publicSectorCases.find(s => s.jira === 'SCRUM-9');
  assert.equal(cbsa.outcome,'The Advance Declaration tool was reported to reduce processing time by up to 50 percent and allowed travellers to edit declarations at self-service kiosks or eGates.');
  assert.match(publicSectorCases[0].work.join(' '),/C# and \.NET/);
  assert.match(publicSectorCases[0].outcome,/ongoing work/);
  const alberta = publicSectorCases.find(s => s.jira === 'SCRUM-12');
  assert.equal(alberta.draft,true); assert.equal(alberta.services,null); assert.equal(alberta.outcome,null);
});

test('neighbour navigation follows display order and does not wrap at the ends', () => {
  for (const [index,story] of publicSectorCases.entries()) {
    const html = publicSectorCaseBody(story).match(/<nav class="ps-neighbours"[\s\S]*?<\/nav>/)[0];
    assert.equal((html.match(/<a /g)||[]).length,index === 0 || index === 5 ? 1 : 2);
    if(index > 0) assert.ok(html.includes(publicSectorHref(publicSectorCases[index-1])));
    if(index < 5) assert.ok(html.includes(publicSectorHref(publicSectorCases[index+1])));
  }
});

test('image references degrade safely and preserve responsive sources, dimensions and captions', () => {
  assert.doesNotMatch(publicSectorVisual({src:'/missing.png'}),/<img/);
  const html = publicSectorVisual({src:'/photo.jpg',width:1200,height:800,alt:'An interface',srcset:'/small.jpg 600w, /photo.jpg 1200w',webpSrcset:'/small.webp 600w, /photo.webp 1200w',caption:'A <caption>'},{eager:true});
  assert.match(html,/type="image\/webp"/); assert.match(html,/srcset="\/small.jpg 600w/);
  assert.match(html,/width="1200" height="800"/); assert.match(html,/fetchpriority="high"/);
  assert.match(html,/A &lt;caption&gt;/);
});

test('content and metadata are escaped rather than interpreted as markup', () => {
  const story = {...publicSectorCases[0],client:'<img onerror="bad()">',metadata:{...publicSectorCases[0].metadata,title:'</script><script>bad()</script>'}};
  const html = renderPublicSectorCase(story);
  assert.doesNotMatch(html,/<script>bad\(\)<\/script>|<img onerror/);
  assert.match(html,/&lt;img onerror=/);
  assert.match(html,/\\u003c\/script>/);
});
