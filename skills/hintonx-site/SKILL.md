---
name: hintonx-site
description: Maintain HintonX's static website using the shared design, feedback and development delivery skills. Use for work in the HintonX Site repository, not unrelated Framer or portfolio projects.
---

# HintonX maintenance

Use the repository’s [AGENTS.md](../../AGENTS.md) and [source of truth](../../docs/SOURCE_OF_TRUTH.md). If this skill is installed via a symlink, resolve its target before following those relative paths. If working from another clone, prefer that clone's documents and source files. Requested site changes include delivery to the shared development link under the standing scope in the source of truth; other publication and account changes need their own scope.

## Shared skill packs

- Load [Design system](../hintonx-design-system/SKILL.md) for visual, page or interaction changes.
- Load [Development workflow](../hintonx-dev-workflow/SKILL.md) for site implementation, preview recovery or delivery.
- Load [Design feedback](../hintonx-design-feedback/SKILL.md) when interpreting feedback about appearance, hierarchy, flow or feel.

These repository files travel with the source. Follow them through `AGENTS.md` even when they are not separately listed in the client's skill picker. Keep accepted facts in the source of truth and reusable decision guidance in the relevant skill.

## Page and interaction changes

Find the owning files in the source-of-truth map. Inspect the current component and adjacent styles before changing it. Treat existing code as the implementation baseline and the user's current request as the intended change.

Keep the change local to the requested page or shared feature. Prefer the existing renderer, CSS and browser APIs. Avoid turning a polish request into a new design system, global refactor or dependency migration. Preserve the project's small amount of purposeful motion and remove redundant explanatory copy rather than adding decorative scaffolding.

Build and inspect the affected page. For layout changes, include a phone width; for shared navigation or motion changes, include keyboard behavior and the applicable fallback. Run `npm run validate` for site changes. Do not add tests that merely mirror markup or repeat already passing checks without a new reason.

After every site change, immediately rebuild, refresh and verify the affected local preview using the [development workflow's preview loop](../hintonx-dev-workflow/SKILL.md#immediate-local-preview-loop). The agent handles server startup, recovery and stale previews; do not leave these routine steps to the collaborator or wait until final delivery.

## Release requests

Follow the development workflow and source-of-truth release procedure. GitHub is source control; the shared development site is the existing Cloudflare Pages project. Never substitute GPT Sites or enable the account-domain GitHub Pages route.

Keep source, build, deployment and live checks separate. Preserve the stable `pages.dev` hostname. If the user requests a custom domain later, determine the exact domain and ownership/configuration then; don't alter the portfolio's DNS as a side effect.

## Handoffs

Report the changed behavior, actual verification and any remaining limitation concisely. When an accepted convention changes, update the source of truth instead of adding another overlapping guide. Documentation work alone does not require rebuilding or redeploying the website.
