import { basePath } from './base-path.mjs';
import { access, readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const base = basePath();

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    files.push(...(entry.isDirectory() ? await filesUnder(path) : [path]));
  }
  return files;
}

const htmlFiles = (await filesUnder(dist)).filter(path => extname(path) === ".html");
const pages = new Map(await Promise.all(htmlFiles.map(async path => [path, await readFile(path, "utf8")])));
const errors = [];

for (const path of htmlFiles) {
  const html = pages.get(path);
  const visibleText = html.replace(/<[^>]+>/g, '');
  if (/[\p{Extended_Pictographic}\u2190-\u21ff\uFE0F]/u.test(visibleText)) errors.push(`${path}: use SVG icons instead of emoji or arrow glyphs`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${path}: missing title`);
  if (!/class="site-header"/.test(html)) errors.push(`${path}: missing header`);
  if (!/class="site-footer/.test(html)) errors.push(`${path}: missing footer`);

  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|\/\/)/i.test(href)) continue;
    const url = new URL(href, `https://local.test${base}/${relative(dist, path)}`);
    let clean = decodeURIComponent(url.pathname);
    if (base && !clean.startsWith(`${base}/`)) { errors.push(`${path}: link escapes deployment base: ${href}`); continue; }
    if (base) clean = clean.slice(base.length);
    const target = clean.endsWith("/") ? `${clean}index.html` : clean;
    const targetPath = resolve(dist, `.${target}`);
    try {
      await access(targetPath);
      if (url.hash && pages.has(targetPath)) {
        const id = decodeURIComponent(url.hash.slice(1));
        const ids = [...pages.get(targetPath).matchAll(/id="([^"]+)"/g)].map(match => match[1]);
        if (!ids.includes(id)) errors.push(`${path}: missing fragment ${href}`);
      }
    }
    catch { errors.push(`${path}: missing internal target ${href}`); }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files, internal links, fragments and local assets.`);
