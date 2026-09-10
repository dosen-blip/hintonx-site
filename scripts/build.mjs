import {verticals} from '../src/verticals.mjs';
import { basePath } from './base-path.mjs';
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../src/site-data.mjs";
import { renderVertical, renderCaseStudy, renderContact, renderHome, renderProjects, renderStudio, renderVideo } from "../src/render.mjs";

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
await output("projects/index.html", renderProjects());
await output("Studio/index.html", renderStudio());
await output("Contact/index.html", renderContact());
await output("matiadosen/index.html", renderVideo());

for (const vertical of verticals) await output(`work/${vertical.slug}/index.html`, renderVertical(vertical));

for (const project of projects) {
  await output(`projects/${project.slug}/index.html`, renderCaseStudy(project));
}

await output("styles.css", await readFile(resolve(root, "src/styles.css"), "utf8"));
for (const file of ["vertical.css", "vertical.js", "case.css", "case.js", "accent.css", "navigation.css", "navigation.js", "home.css", "home.js", "scroll-wheel.mjs", "motion.mjs", "cursor-dot.svg", "work.css", "work.js"]) await output(file, await readFile(resolve(root, "src", file), "utf8"));
await output("404.html", renderHome());
await output(".nojekyll", "");
console.log(`Built ${projects.length + verticals.length + 6} static pages in ${dist}`);
