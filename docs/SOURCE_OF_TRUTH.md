# HintonX source of truth

This document records accepted decisions and code ownership. Shared development convention accepted: 2026-09-15. Runtime status can change; check the live service before claiming a release is current.

## Identity and hosting

| Item | Canonical value |
| --- | --- |
| Source repository | https://github.com/dosen-blip/hintonx-site |
| Default branch | `main` |
| Host | Cloudflare Pages, direct upload |
| Pages project | `hintonx-site` |
| Shared development/review URL (publicly reachable) | https://hintonx-site.pages.dev/ |
| Cloudflare deployment target | Existing project's production deployment, branch `main`; used by the team for development review |
| Custom domain | None configured; planned for later |
| Build output | `dist/` |
| Production base path | Empty: site runs at the hostname root |
| Local preview | http://127.0.0.1:4173/ |
| GitHub Actions | Validation only; `.github/workflows/validate.yml` |

GitHub Pages was tried and then disabled. It inherited `matiadosen.com` from the account's user-site configuration. The user rejected that address. Cloudflare Pages was explicitly accepted after checking DOSEN EPK's `pages.dev` setup. Do not restore the old GitHub Pages workflow, use GPT Sites, attach the portfolio domain, or change another project's hosting to release this site.

The initial Cloudflare deployment used source commit `3c9d2ef3fd75ba0f7b0eed4d6d7d6362b653e601`, deployment `69f7392a.hintonx-site.pages.dev`. At that release, 27 HTML/asset URLs passed HTTPS checks and GitHub validation succeeded. This is historical evidence, not a claim about future HEAD or deployment status.

## Development search visibility

The shared development site remains accessible to anyone with its link, without login. All deployed pages and local assets emit `X-Robots-Tag: noindex` through `src/_headers`, copied by the build. This is search exclusion, not access control. Crawling remains allowed so Google can read the directive; the existing sitemap does not override it. The release verifier checks this header on every delivered resource as well as checking file bytes. Previously retained deployments are immutable and do not inherit new headers. Any future public launch must explicitly revisit this development restriction. Public Sector's separate content-readiness metadata still applies independently.

## Approved visual direction

- Keep the original HintonX identity and improve it incrementally. Earlier broad redesigns were rejected.
- Use black (`#080808`) and warm white (`#f7f7f3`) sections, oversized DM Sans typography, generous spacing, and imagery as the main visual interest.
- Cobalt `#345CFF` is the chosen accent, defined in `src/accent.css`. Use it sparingly for actions, arrows, progress and punctuation. Preserve the white-dot cursor. The HX navbar wordmark uses DM Sans Bold (700).
- Use no emojis in UI or project replies. Arrow, play and close symbols render as inline SVG through `src/icons.mjs`; HTML validation rejects emoji/arrow text glyphs. Existing project media is preserved.
- Shared navigation contains Work, Services, Public Sector Solutions, Contact and Start a project. Public Sector Solutions links to `/publicsector/` in desktop and mobile navigation. The previous generic Solutions item remains removed; its homepage content remains. Work retains horizontal discipline navigation; service pages have no secondary discipline navbar. Work uses a smaller heading with cobalt punctuation, and no project-count badge. The homepage film control has a transparent background with its play icon and text retained.
- Homepage section eyebrows, numbers and their divider rules are removed; let the main headings and alternating backgrounds separate sections.
- Avoid redundant grey taglines and self-explanatory captions. The user explicitly removed the extra homepage microcopy. Keep useful project information and accessible control labels.
- Motion should feel eased and quiet. Reuse existing reveals and disclosure transitions. Respect reduced motion and keep keyboard interaction usable.
- The homepage headline cycles upward through Design, Video, UX, Generative AI, Development and Branding. It has no visible play/pause control, by explicit user request. Reduced motion disables cycling; offscreen/hidden pages stop scheduling it.
- Homepage opening sequence: the homepage pairs each rotating headline with a matching project in a cobalt frame: Design / ToldYa, Video / The Legend, UX / ISED, Generative AI / related ELVIS UX work, Development / 1VALET, and Branding / Hinton Press. The image, caption and destination advance together, with the next image loaded before the transition. Hover or keyboard focus holds the current project for selection; the film uses the existing on-page player. A brief entrance raises the headline, lands its cobalt full stop and opens the image frame; it adds no loading screen or scroll lock. Reduced motion, section deep links and restored scroll positions skip the entrance; focus or pointer interaction settles it immediately. Longer desktop headline words use smaller type within a fixed-height aperture. Spotlight mappings live in `home-content.mjs`; the AI caption identifies the documented UX contribution. On mobile the headline sits above a fixed-proportion image frame, with a slim countdown line. Horizontal swipes and arrow keys select adjacent projects; swipes suppress link activation and allow a longer reading interval before cycling resumes. Vertical scrolling and pinch zoom remain native. Reduced motion allows manual selection without transitions or automatic cycling. Approved for publication on 2026-09-12.
- Desktop retains the circular project wheel. At widths up to 760px, the homepage uses a scroll-driven stack: cards rise over earlier cards, preserving 32–44px project-name strips sized to the available height, and hold briefly on the final card before releasing the section. Earlier strips remain links to their case studies. Both modes use native document scrolling and a sticky scene; no wheel/touch cancellation or body-scroll lock. Keep keyboard navigation and native scrolling. The visible previous/next buttons, counter and Continue link have been removed. Desktop reduced motion and insufficient viewport height use a static grid. Mobile keeps the stack on shorter viewports; reduced motion maps the cards directly to scroll without easing. Mobile scene height uses `svh` to avoid browser-toolbar resize jumps. Stack movement uses 190ms damping (desktop remains 115ms); a slim vertical cobalt rail follows the eased progress. Every second mobile card has a cobalt frame and header with white text.
- Case studies share a restrained hierarchy: client/title, lead visual, light overview/facts, gallery where available, result, next project. Hinton Press uses a more spacious editorial gallery; single-image cases remain compact. Preserve natural image proportions.

Huge, Neiden and Dosen.ca informed the exploration. They are visual references, not specifications to clone or authority to overwrite the accepted implementation.

## Code ownership

| Concern | Edit here |
| --- | --- |
| Shared project facts, routes, navigation labels, media URLs | `src/site-data.mjs` |
| Homepage selections and discipline copy | `src/home-content.mjs` |
| Shared document shell, header, footer; Studio, Contact, Video | `src/render.mjs` |
| Homepage markup, styling, behavior | `src/home-render.mjs`, `src/home.css`, `src/home.js`, `src/opening.js` |
| Service-page copy and curated features | `src/service-content.mjs` |
| Service-page rendering, styling, behavior and discipline membership | `src/verticals.mjs`, `src/vertical-render.mjs`, `src/vertical.css`, `src/vertical.js` |
| Work listing | `src/work-render.mjs`, `src/work.css`, `src/work.js` |
| Public-sector content, cases, client groups, asset references and preview indexing state | `src/publicsector-content.mjs` |
| Public-sector overview and case templates, styles and browser hooks | `src/publicsector-render.mjs`, `src/publicsector.css`, `src/publicsector.js` |
| Public-sector asset inventory and outstanding content review | `docs/PUBLIC_SECTOR_REVIEW.md` |
| All eight original case studies | `src/case-render.mjs`, `src/case.css`, `src/case.js` |
| Container selection preview | `src/template-render.mjs`, `src/template.css`, `src/template.js`, `scripts/template.test.mjs` |
| Base typography/layout and original secondary pages | `src/styles.css` |
| Cobalt accents | `src/accent.css` |
| Navbar blur, menus, white cursor | `src/navigation.css`, `src/navigation.js`, `src/cursor-dot.svg` |
| Shared reveals and animated disclosures | `src/motion.mjs` |
| Build-time SVG icon rendering | `src/icons.mjs` |
| Wheel and mobile-stack geometry and easing | `src/scroll-wheel.mjs` |
| Static generation, asset copy list, optional URL prefix | `scripts/build.mjs`, `scripts/base-path.mjs` |
| HTML/link/fragment checks, wheel and public-sector tests | `scripts/validate.mjs`, `scripts/scroll-wheel.test.mjs`, `scripts/publicsector.test.mjs` |
| Deployment configuration/command, verification and reconstruction rehearsal | `wrangler.jsonc`, `package.json`, `scripts/release.mjs`, `scripts/release-policy.mjs`, `scripts/verify-deployment.mjs`, `scripts/rehearse-rollback.mjs` |

No frontend framework or runtime package dependencies. Local development requires Node.js 22 or newer with npm. Wrangler is a development dependency, pinned through `package-lock.json`; version-specific dependency install-script approvals live in `package.json` for npm versions that require them. The site emits 28 HTML files: home, Work, five vertical pages, eight original cases, the Public Sector overview and six public-sector cases, Studio, Contact, legacy Video, the template editor, container catalogue and a homepage-based 404. `dist/` is recreated on every build.

Five dedicated service pages use the existing routes: `/work/product-design/`, `/work/web-development/`, `/work/ai/`, `/work/branding/`, and `/work/video/`. Each has five sections: a service introduction with lead media, four capabilities, selected work with discipline-specific contribution copy, a three-part approach, and a service-specific project enquiry linking to Contact. Keep the shared black/warm-white structure and restrained cobalt punctuation. Branding gives Hinton Press a single expanded editorial feature; Video has a featured film, two selected films and four additional films. Its seven film links open a native dialog with a YouTube iframe created on demand and removed on dismissal, returning focus to the opening link; ordinary YouTube links remain the fallback, including a direct link inside the player. `/matiadosen/` remains available.

Services navigation, the Work introduction and homepage service links lead to these pages. Work remains the portfolio overview and retains its discipline navigation. Service pages omit the secondary discipline navbar and use the shared Services menu. Project membership is curated in `verticals.mjs`; a project may span disciplines. `service-content.mjs` owns service copy and feature selections while client facts and media remain in `site-data.mjs`. Remaining projects in each discipline stay accessible through a compact related-work list. AI entries describe documented UX and product-strategy contributions, not model development.

Routes are case-sensitive: `/`, `/projects/`, `/Studio/`, `/Contact/`, `/matiadosen/` (Video), and `/projects/<slug>/`. Obtain project slugs from `site-data.mjs`; do not rename routes as part of visual polish. Studio, Contact and the standalone Video page retain their original layouts; the new case-study treatment does not imply they have been redesigned.

Media currently lives on Framer and YouTube. Films on Home, case studies and the Video service page create an iframe when opened and remove it on close. External hosting availability is not covered by local validation. The legacy standalone Video page still uses static thumbnails; do not describe every video on the site as playable.

## Hero video background

The SCRUM-15 implementation places the supplied Hx1 placeholder behind the existing rotating headline and coordinated project spotlight. Its upper and lower edges fade into black with a masked blur. `src/video-background.mjs` owns the default media paths and overlay, with `src/video-background.css` and `src/video-background.js` handling presentation and playback. The build copies the silent H.264 MP4 and extracted JPEG fallback from `src/assets/video-background/`; the original MOV remains untouched outside the repository. The web loop omits the near-static hold at approximately 10.72–13.85 seconds and uses a constant 24 fps encode with regular keyframes. Playback uses native muted, inline autoplay and looping, with no visitor toggle as requested. A hidden tab pauses playback; returning resumes it. Reduced motion and media errors show the still image. The template’s Video settings can select local preview files and adjust the dark overlay; file selections reset on reload and do not upload or save assets. `opening.js` shares the existing rotating headline and spotlight behavior between Home and the template. The user authorized delivery of this implementation to the shared development site.

## Container template

`/containers.html` retains the original layout review tool for SCRUM-13. It collects 46 distinct section layouts from the existing renderers, using representative supplied content across all page families. Its pull-down checklist starts with everything selected. Navigation and Footer are required and disabled in the checklist; Hero is the first optional section. Sections retain their fixed catalogue order, and deselecting one collapses it without leaving a gap. The controls sit outside the page preview. The template stays out of the sitemap and emits `noindex, follow`.

`template-render.mjs` owns the catalogue and checks section counts against its labels during every build. It namespaces IDs and accessible references so layouts can coexist without collisions. Existing page output is preserved. The template uses the shared animated hero and a static project collection, native disclosures, project-index previews and an on-demand film dialog; it does not load page-wide scroll scripts. Public Sector examples use the supplied imagery; the optional missing-gallery example remains labelled. This tool previews selection and layout; it does not save or export a new page.

## Local template editor

`/template.html` now provides the local template editor. It lists the 25 existing content pages and assigns each to a named template within its page family. Templates control section order, visibility and design overrides; shared defaults control Hero, Content, Project collection, Gallery, Project invitation, Navigation and Footer. Existing copy and media remain owned by the page renderers. Navigation and Footer cannot be removed. Template variants and duplication allow one page to diverge; applying a template to a family deliberately links those pages. Missing optional galleries stay absent rather than receiving another project’s content.

The editor previews real pages in an iframe. Changes update the iframe immediately. Save locally persists versioned, validated configuration under `hintonx.layout-draft.v1` in browser localStorage; only localhost pages apply it. This is a local prototype, not an authenticated CMS or a publication control. No source content is written by the browser. JSON export/import supports handoff; imports reject incompatible families and malformed settings. Undo, revert and restoring original layouts are available. Shared settings flow through unless a template explicitly overrides a field. Draft changes are not published or shared between computers.

`src/layout-model.mjs` owns configuration defaults, inheritance and validation. `scripts/layout-catalog.mjs` annotates generated sections with stable identities and creates the page inventory through `scripts/build.mjs`. `src/layout-runtime.js` applies local drafts without replacing content nodes. `src/layout-editor.mjs`, `src/layout-editor.js`, `src/layout-editor.css` and `src/layout-preview.css` own the editor and draft presentation. The ordinary build retains the approved layout when no local draft is present; the runtime refuses activation on public hosts. Local editor work remains unpublished pending user review.

## Public Sector Solutions

The `/publicsector/` section uses the existing shell and visual system. Its six detail routes are owned by `publicsector-content.mjs` and are ordered OSFI OASIS, Government of Alberta Atlas, ISED Spectrum Cloud, CBSA Traveller Modernization, Federal Judicial Affairs Phoenix, and CBSA Import Information. Existing portfolio entries remain unchanged. Each case has the supplied content, optional overview/gallery support, a contact action, breadcrumbs and non-wrapping previous/next navigation. The overview has eight services, ISED recognition and 13 clients grouped by government organization type.

The section uses client media supplied through SCRUM-7–12: OSFI and Alberta mockups, existing ISED and CBSA portfolio media, and an OSSNR annual-report visual. All six case heroes/cards and the overview now have supplied imagery; OSFI, Alberta and the later CBSA case have galleries. The user approved using the OSSNR visual on Phoenix and later ELVIS imagery on the earlier CBSA case with captions that explicitly identify the separate projects. Preserve those distinctions on both cards and detail pages. Client names remain text treatments and seven social images remain labelled previews. Atlas retains supplied draft material and explicit Services/Outcome placeholders. See `PUBLIC_SECTOR_REVIEW.md` for asset provenance, current review coverage and outstanding content decisions.

The shared shell accepts optional canonical, social metadata, robots and JSON-LD inputs. The section supplies unique metadata, WebPage and BreadcrumbList data, and uses `site.origin` for absolute URLs. `publicSector.indexable` is false while the section is incomplete: all seven pages emit `noindex, follow` and stay out of the generated sitemap. The sitemap currently includes the 18 existing non-404 routes. `robots.txt` allows crawling so the noindex directive can be read and points to the sitemap. A future approved content release can set `indexable` true; this changes both metadata and sitemap inclusion. Do not enable indexing simply because implementation checks pass.

The content image shape is `{src, width, height, alt, srcset?, webpSrcset?, caption?}`. Use approved exports with intrinsic dimensions; preserve original proportions. Local assets referenced by this content, including srcset candidates, are copied by the build. Supplied project media uses 640/1280/1920-pixel WebP variants and a progressive JPEG fallback. Preserve native lazy loading before an offscreen image selects its source; show an error fallback only after a selected source fails. High-quality originals remain outside the delivery bundle. Null/incomplete image data uses a CSS placeholder; runtime image failures show the fallback without changing layout.

The section script emits a `hintonx:analytics` CustomEvent on window for contact and case actions. Event detail contains `name` (`publicsector_contact_click` or `publicsector_case_study_click`), `path`, `destination`, and `caseSlug` where relevant. Header contact links are included. Hooks do not prevent navigation or store/transmit data. Provider integration and live event collection are deferred by the user.

## Development and validation

- `npm ci`: install the locked deployment tooling after cloning.
- `npm run dev`: rebuild, then serve `dist/` on port 4173. This is a plain Python static server, **not** a hot-reload server.
- `npm run build`: rebuild before refreshing an existing preview.
- `npm run validate`: rebuild, validate all internal HTML links/fragments/assets, run nine wheel/stack geometry and easing tests, eight public-sector content/metadata/indexing/image-runtime tests three container-template structure/reference tests and release-safety tests.
- `BASE_PATH=/hintonx-site npm run validate`: optional subdirectory test only. Run a normal build afterwards; production on Cloudflare uses no prefix.

Choose browser checks based on the change: layout at desktop and phone widths, overflow, image visibility, keyboard controls, menu reversal, deep links, reduced motion or player dismissal. Structural validation cannot establish visual quality, working external media, or live deployment.

For a stalled preview, identify the listener on port 4173 before stopping anything. Restart only this project's server. Keep local preview, git HEAD, CI and public-host evidence distinct. Reload stale pages/assets before diagnosing a code failure; version URLs only when needed for an actual cache issue.

Every site change, including minor copy and style adjustments, must be rebuilt into the local preview immediately. The agent refreshes the affected preview tab, starts or recovers this project's server when needed, and verifies the visible result before moving on. Do not leave build, server or refresh chores to the collaborator or defer them until final delivery. The [development workflow's immediate local preview loop](../skills/hintonx-dev-workflow/SKILL.md#immediate-local-preview-loop) owns the procedure. Documentation-only edits remain exempt; keeping localhost current does not replace shared development delivery.

## Shared development

All routine requested site changes are delivered to **https://hintonx-site.pages.dev/** after validation and inspection. This is standing authorization for the intended source commits, pushes and uploads needed to update this development link. An explicit request for a plan, local-only work or no publication overrides that default. Documentation and skill edits alone do not require a site upload.

The team calls this the development link. Cloudflare technically serves it from the existing project's production branch, `main`; no separate `dev` deployment or custom domain is being introduced. It remains publicly reachable. A future launch on a custom domain or change of hosting target is separate work requiring authorization.

Collaborators use focused source changes, preserve others' unfinished edits, and integrate the latest shared source before delivery. Use isolated worktrees when edits overlap; do not overwrite a shared working directory or force-push. Deploy from a clean checkout matching integrated `origin/main`, recheck remote HEAD before upload, and coordinate so only one collaborator uploads at a time. The hostname serves the latest upload; it does not combine separate collaborators' builds. The release command now enforces a clean main matching remote HEAD, checks the authenticated GitHub operator has repository write access, locks releases within a clone/worktree group, and records deployment attempts and verified results in GitHub. Cross-clone upload coordination remains manual. This does not authenticate chat participants or implement a live approver policy.

Repository skill packs are routed by `AGENTS.md` and `skills/hintonx-site/SKILL.md`: `hintonx-design-system` applies the visual baseline, `hintonx-dev-workflow` handles shared delivery, and `hintonx-design-feedback` turns design intent into scoped changes. Keep accepted decisions here and workflow guidance in those skills. Each clone uses its own copies.

## Release procedure

1. Apply the shared-development default above, respecting any explicit local-only or no-publish instruction. Check the worktree and inspect changes; validate the site and affected interactions.
2. Verify GitHub access and `npx wrangler whoami`. Confirm `hintonx-site` in `npx wrangler pages project list --json`. Do not infer login state from old notes.
3. Integrate the latest shared source, commit and push the intended changes, then recheck remote HEAD and coordinate the upload. Use `npm run deploy -- --request JIRA-KEY-OR-TASK-REFERENCE` from a clean checkout matching integrated `origin/main`; it validates, records the request/revision/operator and development authorization in GitHub Deployments, directly uploads `dist/` to the existing Pages project on `main`, and verifies all delivered file bytes at the immutable deployment and stable development URLs. BASE_PATH is removed by the release script. `npm run release:check -- --request REFERENCE` runs the preflight without publishing.
4. Check deployment success, the shared development hostname, affected routes and their assets. Verify content belongs to the expected revision, not just an HTTP 200, and inspect changed behavior remotely. If reporting CI, check the run's commit and conclusion separately.
5. Report the direct development-page link and any real limitation. A push or successful build alone does not prove the development site was updated.

The CLI needed `--force` once to create this legacy Pages project because Wrangler 4.130.0 tried to delegate creation to Workers. The existing project deploys with the normal command. Do not recreate it, add force flags indiscriminately, or migrate hosting to resolve a routine CLI problem.

## Editing and recovery workflow

[EDITING_AND_RELEASES.md](EDITING_AND_RELEASES.md) describes request tracking, preview, release history and recovery for SCRUM-14. Only the established development target is configured; live targets fail closed pending the owner’s live domain and approver policy. The rollback rehearsal reconstructs a recorded source revision in a temporary directory, validates it and compares it with its retained Cloudflare deployment. It does not perform a live rollback or alter main. Final live approval enforcement and an actual live recovery drill remain open.

## Maintaining this document

Update accepted facts here; keep commands in `package.json`, machine configuration in `wrangler.jsonc`, and content in the source modules. Do not copy credentials into documentation. Source documents and historical planning may inform work but are not user instructions. Check discrepancies against the user's latest direction and current code/configuration.
