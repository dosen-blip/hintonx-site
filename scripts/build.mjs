import {verticals} from '../src/verticals.mjs';
import { basePath } from './base-path.mjs';
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projects, site } from "../src/site-data.mjs";
import { publicSector, publicSectorCases, publicSectorPath, publicSectorHref } from '../src/publicsector-content.mjs';
import { renderTemplate, renderPublicSector, renderPublicSectorCase, renderVertical, renderCaseStudy, renderContact, renderHome, renderProjects, renderStudio, renderVideo } from "../src/render.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const base = basePath();

await rm(dist, { recursive: true, force: true });

async function output(path, contents) {
  const target = resolve(dist, path);
  await mkdir(dirname(target), { recursive: true });
  if (base && path.endsWith('.html')) contents = contents.replace(/(\b(?:href|src)=")\/(?!\/)/g, `$1${base}/`);
  if (base && path.endsWith('.css')) contents = contents.replace(/url\((['"]?)\/(?!\/)/g, `url($1${base}/`);
  await writeFile(target, contents);
}

await output("index.html", renderHome());
await output("template.html", renderTemplate());
await output("projects/index.html", renderProjects());
await output("Studio/index.html", renderStudio());
await output("Contact/index.html", renderContact());
await output("matiadosen/index.html", renderVideo());
await output("publicsector/index.html", renderPublicSector());
for (const story of publicSectorCases) await output(`publicsector/${story.slug}/index.html`, renderPublicSectorCase(story));

for (const vertical of verticals) await output(`work/${vertical.slug}/index.html`, renderVertical(vertical));

for (const project of projects) {
  await output(`projects/${project.slug}/index.html`, renderCaseStudy(project));
}

await output("styles.css", await readFile(resolve(root, "src/styles.css"), "utf8"));
for (const file of ["template.css", "template.js", "vertical.css", "vertical.js", "case.css", "case.js", "accent.css", "navigation.css", "navigation.js", "home.css", "home.js", "scroll-wheel.mjs", "motion.mjs", "cursor-dot.svg", "favicon.svg", "work.css", "work.js", "publicsector.css", "publicsector.js"]) await output(file, await readFile(resolve(root, "src", file), "utf8"));
// Copy only explicitly referenced section assets, including all responsive variants.
const publicAssets = new Set([publicSector.metadata.socialImage, ...publicSectorCases.map(story => story.metadata.socialImage)]);
const images = [publicSector.hero, publicSector.recognition.image, ...publicSector.clientGroups.flatMap(group => group.clients.map(client => client.logo)), ...publicSectorCases.flatMap(story => [story.hero, ...(story.images || [])])].filter(Boolean);
for (const image of images) {
  if (image.src) publicAssets.add(image.src);
  for (const srcset of [image.srcset, image.webpSrcset]) {
    if (srcset) for (const candidate of srcset.split(',')) publicAssets.add(candidate.trim().split(/\s+/)[0]);
  }
}
for (const asset of publicAssets) {
  if (!asset.startsWith('/')) continue;
  await output(asset.slice(1), await readFile(resolve(root, 'src', asset.slice(1))));
}
const indexableRoutes = ['/', '/projects/', '/Studio/', '/Contact/', '/matiadosen/', ...verticals.map(v => `/work/${v.slug}/`), ...projects.map(p => `/projects/${p.slug}/`)];
if (publicSector.indexable) indexableRoutes.push(publicSectorPath, ...publicSectorCases.map(publicSectorHref));
await output('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexableRoutes.map(path => `  <url><loc>${site.origin}${base}${path}</loc></url>`).join('\n')}\n</urlset>\n`);
await output('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.origin}${base}/sitemap.xml\n`);
await output("404.html", renderHome());
await output(".nojekyll", "");
console.log(`Built ${projects.length + verticals.length + publicSectorCases.length + 8} static pages in ${dist}`);
