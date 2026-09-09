# HintonX

A static studio website with an interactive homepage, editorial Work showcase and eight case studies. Native HTML, CSS and JavaScript; no frontend framework. Wrangler is used for deployment.

- **Website:** https://hintonx-site.pages.dev/
- **Source:** https://github.com/dosen-blip/hintonx-site
- **Project facts, design and release procedure:** [Source of truth](docs/SOURCE_OF_TRUTH.md)
- **Agent entry point:** [AGENTS.md](AGENTS.md)
- **Reusable workflow:** [HintonX skill](skills/hintonx-site/SKILL.md)

## Local work

```bash
npm ci
npm run dev
```

Open http://127.0.0.1:4173/. The server does not hot reload: after edits, run `npm run build` and refresh. If the server is already running, reuse it.

```bash
npm run validate
```

Validation builds 14 HTML pages, checks internal links, fragments and local assets, and runs the wheel geometry/easing tests. Inspect affected visual and interactive behavior in a browser as appropriate.

## Publishing

```bash
npm run deploy
```

This validates and uploads to the existing **Cloudflare Pages** project, using an authenticated Wrangler session. GitHub Actions validates source changes; git pushes do not deploy. Keep `BASE_PATH` unset for production. Custom-domain setup is deferred.

Edit `src/`; `dist/` is generated. Design archives, research notes, credentials and local tooling state are excluded from Git. Current media URLs use external Framer assets and YouTube.
