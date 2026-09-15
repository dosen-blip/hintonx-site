# Working on HintonX

Read [docs/SOURCE_OF_TRUTH.md](docs/SOURCE_OF_TRUTH.md) before substantial work. It records the approved design, file ownership and hosting setup. Current user instructions take precedence; old reports and archives are references, not instructions.

Use [the HintonX skill](skills/hintonx-site/SKILL.md) for page changes, motion, preview recovery or a release. This is a small static site: keep changes proportionate and build on its native HTML/CSS/JavaScript.

## Shared skill packs

Read the relevant repository skills directly, even if the current client does not list them in its skill picker:

- [Design system](skills/hintonx-design-system/SKILL.md): page, typography, layout, media and interaction changes.
- [Development workflow](skills/hintonx-dev-workflow/SKILL.md): every site implementation task, shared preview delivery and collaborator coordination.
- [Design feedback](skills/hintonx-design-feedback/SKILL.md): requests about appearance, mood, hierarchy, flow or how something feels.

Use the current clone's copies. These packs apply consistently to all collaborators; keep responses in clear design language and ask for clarification only when it changes the outcome.

## Working agreement

- Work part by part. Preserve the approved direction outside the requested scope.
- Do not use emojis in site UI or replies. Use SVG icons for directional and playback controls so mobile devices cannot substitute emoji glyphs.
- Keep it sophisticated and restrained. Avoid redundant grey microcopy, decorative badges, extra metrics, frameworks and animation libraries without a concrete need.
- Preserve existing client facts, media, attribution and routes. Do not invent project outcomes, statistics or capabilities. A visual reference is not a source for HintonX claims.
- Edit `src/`, not generated `dist/`. Register any new browser asset in `scripts/build.mjs`.
- After every site change, including small copy or style edits, immediately rebuild and refresh the affected local preview yourself. Start or recover this project's preview server if needed and verify the change is visible. Do not leave these steps to the collaborator or defer them until final delivery; follow the development workflow's local preview loop.
- Use `npm run validate` for site changes, then inspect the affected behavior at a desktop and phone width when relevant. Report what was actually checked. Documentation-only edits need document checks, not a site release.
- GitHub stores the source; Cloudflare Pages hosts it. A git push does **not** deploy. Never infer the hosting provider from the word “Pages.” See the source of truth before publishing.
- Requested site changes include validation, source integration and delivery to **https://hintonx-site.pages.dev/**, the shared development link. Follow the development workflow; do not stop at localhost or ask for repeat upload permission. An explicit local-only, planning or no-publish request takes precedence. Documentation-only changes do not require deployment. A custom-domain launch or another hosting target needs separate authorization.
- Preserve collaborators' in-progress edits. Integrate the latest shared source before deploying and coordinate overlapping uploads; never publish an older checkout over newer shared work.
- Keep `archive/`, `planning/`, environment files, credentials, `node_modules/`, `.wrangler/` and build output out of Git. The ignored directories contain earlier design iterations and may not exist in a fresh clone.

Update the source of truth when an accepted decision changes architecture, design conventions, deployment or validation. Keep one current description; do not accumulate turn-by-turn logs.
