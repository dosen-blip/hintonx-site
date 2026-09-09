# HintonX static migration scaffold

HintonX’s static website, with an interactive homepage, editorial Work showcase, and eight project case studies. Built with native HTML, CSS and JavaScript, with no package dependencies.

## GitHub Pages

Pushes to `main` run validation and deploy `dist/` through GitHub Actions. The workflow uses `BASE_PATH=/hintonx-site` so routes and assets work beneath the repository URL. Local builds use the site root by default.

```bash
BASE_PATH=/hintonx-site npm run validate
npm run build # restore the local-preview build
```

Design archives and planning documents remain local. External project images and video hosting are unchanged.


## Local preview

```bash
npm run build
npm run dev
```

Open <http://localhost:4173>.

## Structure

- `src/site-data.mjs` — page copy, projects, links, and current public media URLs
- `src/render.mjs` — reusable static HTML templates
- `src/styles.css` — responsive visual system derived from the public site
- `src/home-content.mjs` and `src/home-render.mjs` — homepage content and sections
- `src/home.css` and `src/home.js` — homepage presentation and interactions
- `src/scroll-wheel.mjs` — circular card geometry, scroll progress, easing and responsive sizing
- `src/motion.mjs` — reversible disclosure animations and scroll reveals
- `src/cursor-dot.svg` — native white-dot cursor for fine pointers
- `scripts/build.mjs` — generates deployable files in `dist/`

The current media URLs point to assets exposed by the public Framer site and YouTube thumbnails. They are isolated in the data file so they can be moved to Cloudflare R2 without changing page templates.

## Navigation update

The sticky header contains Work, Solutions, Services, Contact and Start a project. Solutions links to four expandable homepage sections. Services links to the product design, branding, generative AI and development accordions, plus the original video page. The homepage opens the matching accordion when a navigation fragment is followed.

`src/navigation.css` and `src/navigation.js` contain the isolated navigation styling and behaviour. The mobile menu uses a native dialog with Escape dismissal and focus restoration. Desktop dropdowns support keyboard activation, Escape and outside-click dismissal. Studio remains available in the footer and mobile menu.

The shared header uses six masked backdrop-blur layers, fading from 32px at the top to 1px at the bottom. Blur fades in over the first 90px of scrolling. On the homepage, its foreground and background colors follow the section beneath it.

## Interactive homepage

Seven full-width bands alternate black and warm white: opening/work, studio, solutions, services, film, featured project and contact invitation. Existing project images and case-study routes supply the content.

The six-project wheel follows a circular arc. A native sticky scene stays visually fixed as document scrolling advances the cards, then releases at either end. Previous/next controls, left/right keys on the collection and a skip link provide alternatives. Phone layouts show one primary card; wider layouts show two. Reduced-motion preferences and insufficient viewport height use a normal card grid. No wheel events are cancelled and the wheel never locks body scrolling.

Solution choices update a related-project preview. Service and featured-story details expand natively. The featured film creates its YouTube iframe only when played; closing the dialog removes the player, stops playback and restores focus.

Run `npm run validate` to build all 14 pages, check internal routes, fragments and local assets, and run the seven wheel-geometry and easing tests. Browser checks covered 1440px desktop, 768px tablet, 390px and 320px phone viewports, compact-height fallback, forward/reverse scrolling, boundary release, keyboard controls, menu destinations, accordion previews, video playback and dismissal. No browser warnings or errors were reported during the final check.

The approved navbar-only foundation is preserved in `archive/nav-foundation/`. Secondary page templates and the original base stylesheet were compared against it and remain unchanged.

## Motion polish

Navigation dropdowns, mobile submenus and homepage accordions now ease open and closed. Closing panels remain rendered until their animation finishes; their contents become inert immediately. Interrupted transitions reverse from their current visual state. The mobile drawer and backdrop animate together, with Escape dismissal and focus restoration preserved.

Homepage headings, text groups and media fade and rise into view once, with a small stagger. Keyboard focus reveals hidden content immediately. Deep links use layout offsets so reveal transforms cannot move the final anchor position. The card wheel uses 115ms time-based damping, preserving the same response across refresh rates and settling without overshoot. No page-scroll interception was added.

A native white-dot cursor with a thin dark outline stays visible against both section colors, including over interactive controls. It applies to fine pointers; text fields retain the text cursor. Reduced-motion preferences bypass fades, easing and animated disclosure transitions.

Verified opening and closing intermediate states, rapid keyboard reversal, mobile drawer dismissal and submenu routing, stable anchor offsets, reveal initialization, custom cursor styles and a clean browser console. `archive/pre-polish/` preserves the approved homepage before this pass.

## Work page

`src/work-render.mjs`, `src/work.css` and `src/work.js` define the rebuilt `/projects/` page. Six bands alternate black and warm white: opening, 1VALET feature, paired 100/CBSA projects, Hinton Press editorial composition, complete index and contact invitation. Existing project records and images supply the case-study content and links.

All eight projects appear in the index. On desktop, pointer entry or keyboard focus changes the adjacent sticky image and project metadata with an eased reveal. Preview images prepare as the index approaches the viewport. Phones show images inside each project row; larger touch layouts use an image grid. Each row links directly to its original case study. Discipline links jump to the featured chapters, and the index includes a return-to-top link.

The page reuses the shared reveal animations, cursor and navigation. Images have a small eased scroll offset on wider layouts with hover support; reduced-motion and touch layouts retain static images. Navigation contrast follows each band and the footer. Scrolling remains native and continuous.

Verified at desktop, 768px tablet, 390px phone and 320px narrow widths: no horizontal overflow, visible project imagery, matching keyboard previews, chapter offsets and case-study navigation. The browser console was clear. The existing route/asset validator covers the page and its links. The pre-overhaul page is preserved in `archive/pre-work-overhaul/`.
