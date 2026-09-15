import {readdir, readFile} from 'node:fs/promises';
import {resolve, relative} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {assetRoute, developmentURL} from './release-policy.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export async function verifyDeployment(directory, origin) {
  const url = new URL(origin);
  if (url.protocol !== 'https:' || !(url.hostname === 'hintonx-site.pages.dev' || /^[a-f0-9]+\.hintonx-site\.pages\.dev$/.test(url.hostname))) throw new Error('Expected this project’s HTTPS deployment URL.');
  const files = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, {withFileTypes:true})) {
      const path = resolve(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile() && !entry.name.startsWith('.')) files.push(path);
    }
  }
  await walk(resolve(directory));
  if (!files.length) throw new Error('Build directory is empty.');
  const failures = [];
  for (let offset = 0; offset < files.length; offset += 6) {
    await Promise.all(files.slice(offset, offset + 6).map(async path => {
      const file = relative(resolve(directory), path).split('\\').join('/');
      try {
        const response = await fetch(new URL(assetRoute(file), url), {cache:'no-store', signal:AbortSignal.timeout(30000)});
        if (!(response.ok || (file === '404.html' && response.status === 404))) throw new Error(`HTTP ${response.status}`);
        if (hash(await readFile(path)) !== hash(Buffer.from(await response.arrayBuffer()))) throw new Error('bytes differ');
      } catch (error) { failures.push(`${file}: ${error.message}`); }
    }));
  }
  if (failures.length) throw new Error(failures.join('\n'));
  return {files:files.length, origin:url.origin};
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  console.log(await verifyDeployment(process.argv[2] || 'dist', process.argv[3] || developmentURL));
}
