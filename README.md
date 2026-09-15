# HintonX

A static studio website with an interactive homepage, editorial Work showcase and eight case studies. Native HTML, CSS and JavaScript; no frontend framework. Wrangler is used for deployment.

- **Shared development/review site:** https://hintonx-site.pages.dev/
- **Source:** https://github.com/dosen-blip/hintonx-site
- **Project facts, design and release procedure:** [Source of truth](docs/SOURCE_OF_TRUTH.md)
- **Agent entry point:** [AGENTS.md](AGENTS.md)
- **Reusable workflow:** [HintonX skill](skills/hintonx-site/SKILL.md)

## Collaborating

Open a checkout of this repository in your agent client. [AGENTS.md](AGENTS.md) routes work through three shared skill packs:

- [Design system](skills/hintonx-design-system/SKILL.md) preserves the established visual direction.
- [Development workflow](skills/hintonx-dev-workflow/SKILL.md) delivers site changes to the same review link and coordinates shared work.
- [Design feedback](skills/hintonx-design-feedback/SKILL.md) turns feedback about appearance and experience into focused changes.

The packs live in the repository and can be read directly; they do not depend on a personal skill installation. Clients that do not load `AGENTS.md` automatically should be given that file as their project entry point. Use a current checkout, preserve others' unfinished work and integrate shared changes before updating the development site.

## Local work

```bash
npm ci
npm run dev
```

Open http://127.0.0.1:4173/. The server does not hot reload: after edits, run `npm run build` and refresh. If the server is already running, reuse it.

```bash
npm run validate
```

Validation builds the site, checks internal links, fragments and local assets, and runs the wheel/stack and public-sector tests. Inspect affected visual and interactive behavior in a browser as appropriate.

## Updating the development link

```bash
env -u BASE_PATH npm run deploy
```

Requested site changes include delivery to the shared development link unless explicitly scoped to local-only work or no publication. Follow the [release procedure](docs/SOURCE_OF_TRUTH.md#release-procedure), including source integration, account checks and remote verification. Documentation-only changes do not require deployment.

The command validates and uploads to the existing **Cloudflare Pages** project using an authenticated Wrangler session and branch `main`. Cloudflare calls this its production deployment; the team uses the URL for development review. The site is publicly reachable. GitHub Actions validates source changes; git pushes do not deploy. Custom-domain setup is separate.

Edit `src/`; `dist/` is generated. Design archives, research notes, credentials and local tooling state are excluded from Git. Current media URLs use external Framer assets and YouTube.
