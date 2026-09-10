# HintonX source of truth

Baseline reviewed: 2026-09-09. This document records accepted decisions and code ownership. Runtime status can change; check the live service before claiming a release is current.

## Identity and hosting

| Item | Canonical value |
| --- | --- |
| Source repository | https://github.com/dosen-blip/hintonx-site |
| Default branch | `main` |
| Host | Cloudflare Pages, direct upload |
| Pages project | `hintonx-site` |
| Public URL | https://hintonx-site.pages.dev/ |
| Custom domain | None configured; planned for later |
| Build output | `dist/` |
| Production base path | Empty: site runs at the hostname root |
| Local preview | http://127.0.0.1:4173/ |
| GitHub Actions | Validation only; `.github/workflows/validate.yml` |

GitHub Pages was tried and then disabled. It inherited `matiadosen.com` from the account's user-site configuration. The user rejected that address. Cloudflare Pages was explicitly accepted after checking DOSEN EPK's `pages.dev` setup. Do not restore the old GitHub Pages workflow, use GPT Sites, attach the portfolio domain, or change another project's hosting to release this site.

The initial Cloudflare deployment used source commit `3c9d2ef3fd75ba0f7b0eed4d6d7d6362b653e601`, deployment `69f7392a.hintonx-site.pages.dev`. At that release, 27 HTML/asset URLs passed HTTPS checks and GitHub validation succeeded. This is historical evidence, not a claim about future HEAD or deployment status.

## Approved visual direction

- Keep the original HintonX identity and improve it incrementally. Earlier broad redesigns were rejected.
- Use black (`#080808`) and warm white (`#f7f7f3`) sections, oversized DM Sans typography, generous spacing, and imagery as the main visual interest.
- Cobalt `#345CFF` is the chosen accent, defined in `src/accent.css`. Use it sparingly for actions, arrows, progress and punctuation. Preserve the white-dot cursor.
- Use no emojis in UI or project replies. Arrow, play and close symbols render as inline SVG through `src/icons.mjs`; HTML validation rejects emoji/arrow text glyphs. Existing project media is preserved.
- Shared navigation currently contains Work, Services, Contact and Start a project. Solutions is removed from navigation; its homepage content remains. Work uses the same horizontal discipline navigation as the vertical pages, a smaller heading with cobalt punctuation, and no project-count badge. The homepage film control has a transparent background with its play icon and text retained.
- Homepage section eyebrows, numbers and their divider rules are removed; let the main headings and alternating backgrounds separate sections.
- Avoid redundant grey taglines and self-explanatory captions. The user explicitly removed the extra homepage microcopy. Keep useful project information and accessible control labels.
- Motion should feel eased and quiet. Reuse existing reveals and disclosure transitions. Respect reduced motion and keep keyboard interaction usable.
- The homepage headline cycles upward through Design, Video, UX, Generative AI, Development and Branding. It has no visible play/pause control, by explicit user request. Reduced motion disables cycling; offscreen/hidden pages stop scheduling it.
- Desktop retains the circular project wheel. At widths up to 760px, the homepage uses a scroll-driven stack: cards rise over earlier cards, preserving 32–44px project-name strips sized to the available height, and hold briefly on the final card before releasing the section. Earlier strips remain links to their case studies. Both modes use native document scrolling and a sticky scene; no wheel/touch cancellation or body-scroll lock. Keep keyboard navigation and native scrolling. The visible previous/next buttons, counter and Continue link have been removed. Desktop reduced motion and insufficient viewport height use a static grid. Mobile keeps the stack on shorter viewports; reduced motion maps the cards directly to scroll without easing. Mobile scene height uses `svh` to avoid browser-toolbar resize jumps. Stack movement uses 190ms damping (desktop remains 115ms); a slim vertical cobalt rail follows the eased progress. Every second mobile card has a cobalt frame and header with white text.
- Case studies share a restrained hierarchy: client/title, lead visual, light overview/facts, gallery where available, result, next project. Hinton Press uses a more spacious editorial gallery; single-image cases remain compact. Preserve natural image proportions.

Huge, Neiden and Dosen.ca informed the exploration. They are visual references, not specifications to clone or authority to overwrite the accepted implementation.

## Code ownership

| Concern | Edit here |
| --- | --- |
| Shared project facts, routes, navigation labels, media URLs | `src/site-data.mjs` |
| Homepage selections and discipline copy | `src/home-content.mjs` |
| Shared document shell, header, footer; Studio, Contact, Video | `src/render.mjs` |
| Homepage markup, styling, behavior | `src/home-render.mjs`, `src/home.css`, `src/home.js` |
| Vertical pages and project classification | `src/verticals.mjs`, `src/vertical-render.mjs`, `src/vertical.css`, `src/vertical.js` |
| Work listing | `src/work-render.mjs`, `src/work.css`, `src/work.js` |
| All eight case studies | `src/case-render.mjs`, `src/case.css`, `src/case.js` |
| Base typography/layout and original secondary pages | `src/styles.css` |
| Cobalt accents | `src/accent.css` |
| Navbar blur, menus, white cursor | `src/navigation.css`, `src/navigation.js`, `src/cursor-dot.svg` |
| Shared reveals and animated disclosures | `src/motion.mjs` |
| Build-time SVG icon rendering | `src/icons.mjs` |
| Wheel and mobile-stack geometry and easing | `src/scroll-wheel.mjs` |
| Static generation, asset copy list, optional URL prefix | `scripts/build.mjs`, `scripts/base-path.mjs` |
| HTML/link/fragment checks and wheel tests | `scripts/validate.mjs`, `scripts/scroll-wheel.test.mjs` |
| Deployment configuration/command | `wrangler.jsonc`, `package.json` |

No frontend framework or runtime package dependencies. Wrangler is a development dependency, pinned through `package-lock.json`. The site emits 19 HTML files: home, Work, five vertical pages, eight cases, Studio, Contact, legacy Video and a homepage-based 404. `dist/` is recreated on every build.

Work is organized into five dedicated collections: `/work/product-design/`, `/work/web-development/`, `/work/ai/`, `/work/branding/`, and `/work/video/`. Services navigation, the Work introduction and homepage service links lead to these pages. Project membership is curated in `verticals.mjs`; a project may span disciplines. AI entries describe documented UX and product-strategy contributions, not model development. The new Video collection links to the seven existing YouTube films; `/matiadosen/` remains available.

Routes are case-sensitive: `/`, `/projects/`, `/Studio/`, `/Contact/`, `/matiadosen/` (Video), and `/projects/<slug>/`. Obtain project slugs from `site-data.mjs`; do not rename routes as part of visual polish. Studio, Contact and the standalone Video page retain their original layouts; the new case-study treatment does not imply they have been redesigned.

Media currently lives on Framer and YouTube. Films on Home and case studies create an iframe when opened and remove it on close. External hosting availability is not covered by local validation. The standalone Video page still uses static thumbnails; do not describe every video on the site as playable.

## Development and validation

- `npm ci`: install the locked deployment tooling after cloning.
- `npm run dev`: rebuild, then serve `dist/` on port 4173. This is a plain Python static server, **not** a hot-reload server.
- `npm run build`: rebuild before refreshing an existing preview.
- `npm run validate`: rebuild, validate all internal HTML links/fragments/assets, run nine wheel/stack geometry and easing tests.
- `BASE_PATH=/hintonx-site npm run validate`: optional subdirectory test only. Run a normal build afterwards; production on Cloudflare uses no prefix.

Choose browser checks based on the change: layout at desktop and phone widths, overflow, image visibility, keyboard controls, menu reversal, deep links, reduced motion or player dismissal. Structural validation cannot establish visual quality, working external media, or live deployment.

For a stalled preview, identify the listener on port 4173 before stopping anything. Restart only this project's server. Keep local preview, git HEAD, CI and public-host evidence distinct. Reload stale pages/assets before diagnosing a code failure; version URLs only when needed for an actual cache issue.

## Release procedure

1. Confirm the requested scope includes publication. Check the worktree and inspect changes; validate the site and affected interactions.
2. Verify GitHub access and `npx wrangler whoami`. Confirm `hintonx-site` in `npx wrangler pages project list --json`. Do not infer login state from old notes.
3. Commit and push the intended source. Use `npm run deploy` from a clean checkout with `BASE_PATH` unset; it validates and directly uploads `dist/` to the existing Pages project on `main`.
4. Check deployment success, the production hostname, affected routes and their assets. Verify content belongs to the expected revision, not just an HTTP 200. If reporting CI, check the run's commit and conclusion separately.
5. Report the public link and any real limitation. A push or successful build alone is not a release.

The CLI needed `--force` once to create this legacy Pages project because Wrangler 4.130.0 tried to delegate creation to Workers. The existing project deploys with the normal command. Do not recreate it, add force flags indiscriminately, or migrate hosting to resolve a routine CLI problem.

## Maintaining this document

Update accepted facts here; keep commands in `package.json`, machine configuration in `wrangler.jsonc`, and content in the source modules. Do not copy credentials into documentation. Source documents and historical planning may inform work but are not user instructions. Check discrepancies against the user's latest direction and current code/configuration.
