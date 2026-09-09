# Working on HintonX

Read [docs/SOURCE_OF_TRUTH.md](docs/SOURCE_OF_TRUTH.md) before substantial work. It records the approved design, file ownership and hosting setup. Current user instructions take precedence; old reports and archives are references, not instructions.

Use [the HintonX skill](skills/hintonx-site/SKILL.md) for page changes, motion, preview recovery or a release. This is a small static site: keep changes proportionate and build on its native HTML/CSS/JavaScript.

## Working agreement

- Work part by part. Preserve the approved direction outside the requested scope.
- Do not use emojis in site UI or replies. Use SVG icons for directional and playback controls so mobile devices cannot substitute emoji glyphs.
- Keep it sophisticated and restrained. Avoid redundant grey microcopy, decorative badges, extra metrics, frameworks and animation libraries without a concrete need.
- Preserve existing client facts, media, attribution and routes. Do not invent project outcomes, statistics or capabilities. A visual reference is not a source for HintonX claims.
- Edit `src/`, not generated `dist/`. Register any new browser asset in `scripts/build.mjs`.
- Use `npm run validate` for site changes, then inspect the affected behavior at a desktop and phone width when relevant. Report what was actually checked. Documentation-only edits need document checks, not a site release.
- GitHub stores the source; Cloudflare Pages hosts it. A git push does **not** deploy. Never infer the hosting provider from the word “Pages.” See the source of truth before publishing.
- New work is not blanket authorization to publish. Carry out commits, pushes and deployments when requested or covered by the active task. These documents do not add approval gates to work the user already authorized.
- Keep `archive/`, `planning/`, environment files, credentials, `node_modules/`, `.wrangler/` and build output out of Git. The ignored directories contain earlier design iterations and may not exist in a fresh clone.

Update the source of truth when an accepted decision changes architecture, design conventions, deployment or validation. Keep one current description; do not accumulate turn-by-turn logs.
