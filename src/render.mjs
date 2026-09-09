import { renderIcons } from './icons.mjs';
import { caseBody } from './case-render.mjs';
import { workBody } from './work-render.mjs';
import { homeBody } from './home-render.mjs';
import { projects, site, videoProjects } from "./site-data.mjs";

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const logo = `<a class="logo" href="/" aria-label="HintonX home">HX</a>`;

function navigationItems() {
  return site.navigation.map(item => item.children ? `<details class="nav-group">
    <summary>${esc(item.label)}<span class="nav-chevron" aria-hidden="true"></span></summary>
    <div class="nav-dropdown"><p class="nav-intro">${esc(item.intro)}</p><ul>${item.children.map(child => `<li><a href="${child.href}"><span>${esc(child.label)}</span><small>${esc(child.note)}</small><span class="nav-arrow" aria-hidden="true">↗</span></a></li>`).join("")}</ul></div>
  </details>` : `<a${item.button ? ' class="pill nav-project"' : ''} href="${item.href}">${esc(item.label)}${item.button ? '<span aria-hidden="true">↗</span>' : ''}</a>`).join("");
}

function header() {
  return `<header class="site-header"><div class="nav-glass" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="header-inner">${logo}
    <nav class="desktop-nav" aria-label="Main navigation">${navigationItems()}</nav>
    <div class="mobile-nav-actions"><a class="pill nav-project" href="/Contact/">Start a project <span aria-hidden="true">↗</span></a><button class="nav-menu-toggle" aria-controls="nav-dialog" aria-expanded="false" aria-label="Open navigation" hidden><span></span><span></span></button></div>
  </div></header>
  <dialog id="nav-dialog" aria-label="Navigation"><div class="nav-dialog-top">${logo}<button class="nav-close" aria-label="Close navigation">Close <span aria-hidden="true">×</span></button></div><nav aria-label="Mobile navigation">${navigationItems()}</nav><a class="nav-studio" href="/Studio/">Meet the studio <span aria-hidden="true">↗</span></a></dialog>
  <noscript><nav class="nav-fallback" aria-label="Navigation">${navigationItems()}</nav></noscript>`;
}

function footer() {
  return `<footer class="site-footer container">
    <div class="footer-cta">
      <h2>Design-Driven Innovation</h2>
      <a class="pill pill-large" href="/projects/">Our Work</a>
    </div>
    <div class="footer-links">
      <span class="eyebrow">EXPLORE</span>
      <div class="footer-columns">
        <nav aria-label="Footer navigation">
          <a href="/projects/">Work</a><a href="/Studio/">Studio</a><a href="/Contact/">Contact</a>
        </nav>
        <nav aria-label="Social media">
          ${site.socials.map(item => `<a href="${item.href}">${item.label}</a>`).join("")}
        </nav>
      </div>
    </div>
    <p class="copyright">${site.year} ${site.name}</p>
  </footer>`;
}

function layout({ title = "HintonX", description = "HintonX — Design + Technology", body, pageClass = "" }) {
  return renderIcons(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css?v=20260909-icons">
  <link rel="stylesheet" href="/navigation.css">
  <script src="/navigation.js" type="module"></script>
  ${pageClass === "work-page" ? '<link rel="stylesheet" href="/work.css"><script src="/work.js" type="module"></script>' : ''}${pageClass === "home" ? '<link rel="stylesheet" href="/home.css?v=20260909-stack5"><script src="/home.js?v=20260909-stack5" type="module"></script>' : ''}
${pageClass === "case-page" ? '<link rel="stylesheet" href="/case.css"><script src="/case.js" type="module"></script>' : ''}
<link rel="stylesheet" href="/accent.css">
</head>
<body class="${pageClass}"${pageClass === "work-page" ? ' id="top"' : ''}>
  ${header()}
  <main>${body}</main>
  ${footer()}
</body>
</html>`);
}

function projectCard(project, mode = "grid") {
  return `<a class="project-card project-card--${mode}" href="/projects/${project.slug}/">
    <img src="${project.thumbnail}" alt="${esc(project.alt)}" loading="lazy">
    <span class="project-label"><span>${esc(project.client)} <span aria-hidden="true">↗</span></span><span>${esc(project.title)}</span></span>
  </a>`;
}

export function renderHome() {
  return layout({ pageClass: "home", body: homeBody() });
}

export function renderProjects() {
  return layout({ title: "Work — HintonX", description: "Explore HintonX projects in product design, connected platforms, brand and editorial.", pageClass: "work-page", body: workBody() });
}

export function renderCaseStudy(project) {
  return layout({ title: `${project.client} — HintonX`, description: project.description, pageClass: "case-page", body: caseBody(project) });
}

export function renderStudio() {
  return layout({ title: "Studio — HintonX", pageClass: "studio-page", body: `
    <section class="page-intro page-intro--wide container">
      <h1>Studio</h1>
      <p>HintonX was founded in 2013 as an extension of HintonGroup, with a focus on user experience and product design. Since then, it has partnered with industry leaders in Ottawa and around the world—as well as the Government of Canada—to deliver outstanding, human-centered design solutions across digital platforms.</p>
    </section>
    <section class="people container">
      <h2>Our People</h2>
      <div class="person-layout">
        <div class="person-card">
          <div class="portrait-wrap"><img src="https://framerusercontent.com/images/513eg5oooex4hEs3mvwhVPRvpqg.png" alt="Tony Dosen"></div>
          <h3>Tony Dosen</h3><p>Chief Creative Officer</p>
        </div>
        <div class="person-bio">
          <p>Tony explores the intersection of design, technology, and storytelling—shaping human-centered experiences that span enterprise platforms, AI tools, and global e-commerce. With over a decade leading UX at organizations like IBM, Thales, Deloitte, and the Government of Canada, he combines strategy with deep craft to create elegant, data-informed solutions across industries.</p>
          <p>He is the founder of HintonX, a design and publishing studio, and has led award-winning projects—from secure identity platforms featured in the Gartner Magic Quadrant to Apple’s App of the Day. His approach blends agile leadership, analytical thinking, and a relentless focus on user value.</p>
          <p>Beyond digital, Tony is a published author and seasoned tennis journalist, having interviewed legends like Federer, Djokovic, and McEnroe. His bestselling tennis books have reached readers in over 65 countries.</p>
        </div>
      </div>
    </section>
    <section class="studio-work container"><h2>Our Work</h2><div class="studio-strip">${projects.map(p => projectCard(p, "mini")).join("")}</div></section>` });
}

export function renderContact() {
  return layout({ title: "Contact — HintonX", pageClass: "contact-page", body: `
    <section class="contact-hero container">
      <h1>Let’s connect.</h1>
      <h2>We’d love to hear from you.</h2>
      <div class="contact-links"><a href="mailto:info@hintonx.com">info@hintonx.com</a><a href="https://www.behance.net/">Behance</a><a href="https://www.instagram.com/tonydosen/">Instagram</a></div>
      <p>Ottawa <span>•</span> Montreal <span>•</span> Toronto</p>
    </section>` });
}

export function renderVideo() {
  return layout({ title: "Video Production — HintonX", pageClass: "video-page", body: `
    <section class="page-intro page-intro--wide container">
      <h1>Video Production</h1>
      <p>HintonX offers end-to-end video production services, led by videographer Matia Dosen, supporting clients across Ottawa and beyond—from Adobe and public-sector organizations to sports brands, athletes, and publications.</p>
      <p>From filming and photography to editing, sound engineering, and final production, we bring every element together into polished, engaging videos that capture attention and leave a lasting impression.</p>
    </section>
    <section class="video-grid container">${videoProjects.map(video => `<article><div class="video-thumb"><img src="${video.src}" alt="${esc(video.title)}" loading="lazy"><span class="play-mark">▶</span></div><h2>${esc(video.title)}</h2><p>${esc(video.subtitle)}</p></article>`).join("")}</section>` });
}
