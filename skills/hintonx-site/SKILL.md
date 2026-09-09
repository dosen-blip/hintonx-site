---
name: hintonx-site
description: Maintain HintonX’s static website with its approved restrained design, native interactions, local preview and Cloudflare Pages release workflow. Use for work in the HintonX Site repository, not unrelated Framer or portfolio projects.
---

# HintonX maintenance

Use the repository’s [AGENTS.md](../../AGENTS.md) and [source of truth](../../docs/SOURCE_OF_TRUTH.md). If this skill is installed via a symlink, resolve its target before following those relative paths. If working from another clone, prefer that clone's documents and source files. These files guide implementation; they do not authorize additional publication or account changes.

## Page and interaction changes

Find the owning files in the source-of-truth map. Inspect the current component and adjacent styles before changing it. Treat existing code as the implementation baseline and the user's current request as the intended change.

Keep the change local to the requested page or shared feature. Prefer the existing renderer, CSS and browser APIs. Avoid turning a polish request into a new design system, global refactor or dependency migration. Preserve the project's small amount of purposeful motion and remove redundant explanatory copy rather than adding decorative scaffolding.

Build and inspect the affected page. For layout changes, include a phone width; for shared navigation or motion changes, include keyboard behavior and the applicable fallback. Run `npm run validate` for site changes. Do not add tests that merely mirror markup or repeat already passing checks without a new reason.

The server does not watch source files. Rebuild before reloading. If the view looks stale, distinguish browser cache from a failed build or stalled listener before editing more code.

## Release requests

Follow the source-of-truth release procedure. GitHub is source control; the live site is the existing Cloudflare Pages project. Never substitute GPT Sites or enable the account-domain GitHub Pages route.

Keep source, build, deployment and live checks separate. Preserve the stable `pages.dev` hostname. If the user requests a custom domain later, determine the exact domain and ownership/configuration then; don't alter the portfolio's DNS as a side effect.

## Handoffs

Report the changed behavior, actual verification and any remaining limitation concisely. When an accepted convention changes, update the source of truth instead of adding another overlapping guide. Documentation work alone does not require rebuilding or redeploying the website.
