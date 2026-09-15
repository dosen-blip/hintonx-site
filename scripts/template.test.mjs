import test from 'node:test';
import assert from 'node:assert/strict';
import {renderTemplate, renderStudio, renderContact, renderVideo} from '../src/render.mjs';
import {sectionsFrom, templateContainers} from '../src/template-render.mjs';

test('nested sections remain intact when collecting container boundaries', () => {
  const nested = '<section class="outer"><section>Nested</section><p>After</p></section>';
  assert.deepEqual(sectionsFrom(`<main>${nested}<section>Second</section></main>`), [nested, '<section>Second</section>']);
  assert.throws(() => sectionsFrom('<section>Unclosed'), /Unbalanced/);
});

test('template keeps every catalogued layout in order with only shell options locked', () => {
  const items = templateContainers({studio:renderStudio(),contact:renderContact(),video:renderVideo()});
  const html = renderTemplate();
  const checkboxes = [...html.matchAll(/<input type="checkbox"[^>]+>/g)].map(m => m[0]);
  assert.equal(checkboxes.length, items.length + 2);
  assert.ok(checkboxes.every(input => /\bchecked\b/.test(input)));
  assert.deepEqual(checkboxes.filter(input => /\bdisabled\b/.test(input)).map(input => input.match(/value="([^"]+)"/)[1]), ['navigation','footer']);
  assert.equal(items[0].label, 'Hero');
  assert.deepEqual([...html.matchAll(/data-template-container="([^"]+)"/g)].map(m => m[1]), items.map(item => item.id));
  assert.ok(html.indexOf('<header class="site-header"') < html.indexOf('data-template-container='));
  assert.ok(html.indexOf('<footer class="site-footer') > html.lastIndexOf('data-template-container='));
  assert.match(html, /name="robots" content="noindex, follow"/);
});

test('mixed page families have unique IDs and valid accessible references', () => {
  const html = renderTemplate();
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, 'duplicate IDs in composed sections');
  for (const [, references] of html.matchAll(/\b(?:aria-labelledby|aria-describedby|aria-controls|for)="([^"]+)"/g)) {
    for (const id of references.split(' ')) assert.ok(ids.includes(id), `missing reference: ${id}`);
  }
  assert.doesNotMatch(html, /<script src="\/(?:home|work|case|vertical|publicsector)\.js/);
  assert.match(html, /Public sector image pending/);
  assert.match(html, /Project image pending/);
});
