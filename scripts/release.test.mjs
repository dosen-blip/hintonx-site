import test from 'node:test';
import assert from 'node:assert/strict';
import {assertRelease, assetRoute} from './release-policy.mjs';
import {verifyDeployment} from './verify-deployment.mjs';
import {mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const ready = {target:'development', request:'SCRUM-14', dirty:'', branch:'main', head:'abc', remoteHead:'abc', canPush:true};
test('release refuses unsafe source states and unconfigured live publication', () => {
  assert.doesNotThrow(() => assertRelease(ready));
  for (const change of [{target:'live'}, {request:''}, {canPush:false}, {dirty:' M src/render.mjs'}, {branch:'feature'}, {head:'old'}, {remoteHead:''}]) assert.throws(() => assertRelease({...ready, ...change}));
});
test('verification resolves canonical page URLs and preserves asset paths', () => {
  assert.equal(assetRoute('index.html'), '/');
  assert.equal(assetRoute('publicsector/osfi-oasis/index.html'), '/publicsector/osfi-oasis/');
  assert.equal(assetRoute('template.html'), '/template.html');
  assert.equal(assetRoute('assets/a.webp'), '/assets/a.webp');
});
test('deployment verification rejects stale bytes and failed responses', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hintonx-verify-test-'));
  const originalFetch = globalThis.fetch;
  try {
    await writeFile(join(dir,'index.html'),'expected');
    globalThis.fetch = async () => new Response('expected');
    assert.equal((await verifyDeployment(dir,'https://hintonx-site.pages.dev')).files,1);
    globalThis.fetch = async () => new Response('stale');
    await assert.rejects(verifyDeployment(dir,'https://hintonx-site.pages.dev'), /bytes differ/);
    globalThis.fetch = async () => new Response('expected',{status:500});
    await assert.rejects(verifyDeployment(dir,'https://hintonx-site.pages.dev'), /HTTP 500/);
    await assert.rejects(verifyDeployment(dir,'https://unrelated.example'), /deployment URL/);
    await writeFile(join(dir,'_headers'),'/*\n  X-Robots-Tag: noindex\n');
    globalThis.fetch = async () => new Response('expected');
    await assert.rejects(verifyDeployment(dir,'https://hintonx-site.pages.dev'), /Missing noindex/);
    globalThis.fetch = async () => new Response('expected',{headers:{'X-Robots-Tag':'noindex'}});
    assert.equal((await verifyDeployment(dir,'https://hintonx-site.pages.dev')).files,1);
  } finally { globalThis.fetch = originalFetch; await rm(dir,{recursive:true,force:true}); }
});
