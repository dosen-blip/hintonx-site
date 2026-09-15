---
name: hintonx-dev-workflow
description: Deliver HintonX site changes to the shared development link, coordinate collaborators, verify previews and recover the local server without changing hosting targets.
---

# HintonX development delivery

Read the current clone's [source of truth](../../docs/SOURCE_OF_TRUTH.md), especially Shared development and Release procedure. Resolve installed symlinks before following relative links. Those sections own the target, commands and authorization boundary.

## One shared review destination

The development link is **https://hintonx-site.pages.dev/**. Routine requested site changes finish there after validation and verification, unless the user explicitly asks for local-only work, a plan or no publication. Do not ask for repeated upload permission inside this standing scope. Documentation and skill changes alone do not require a site deployment.

Cloudflare calls this the project's production deployment because it uses `main`; the team uses it as the development/review site. It is publicly reachable. A `pages.dev` hostname is not private access. Do not create a `dev` alias, another Pages project, a custom domain or a different hosting service to fulfill routine changes.

## Shared work

- Start with `git status --short`, the current branch and remote, and the source-of-truth ownership map. Inspect existing edits before touching overlapping files. Never reset, stash, discard or include someone else's unfinished changes without their direction.
- Work in focused commits. Use an isolated checkout/worktree and a `codex/` branch when simultaneous work would overlap. A separate clone uses its own repository guidance, not an absolute path to the original machine.
- Before integration, fetch the latest source and incorporate collaborators' completed work. Resolve mechanical conflicts; ask about incompatible design decisions rather than choosing one silently. Do not force-push or replace the shared branch with an older snapshot.
- Integrate only the intended, validated changes into `main`; inspect the resulting diff and rerun relevant checks after integration changes. Commit and push are part of delivering that source to the shared development site. Never bypass an actual branch protection rule.
- Upload from a clean checkout matching the latest integrated `origin/main`. Recheck remote HEAD immediately before upload; if it moved, integrate and validate the new revision first. One collaborator should deploy at a time. If another upload is active or expected concurrently, coordinate before uploading: the shared URL shows the latest upload, not a merge of deployments.

## Build, inspect and deliver

1. Edit the owning source files and register new browser assets in `scripts/build.mjs`. After each site change, immediately complete the local preview loop below. `dist/` is regenerated output.
2. Run `npm run validate`. Inspect affected layout at a desktop and phone width, and applicable keyboard, reduced-motion, menu, playback or scroll behavior. Do not claim browser/device coverage that was not checked.
3. Follow the source-of-truth release procedure for current account/project checks, source integration, direct upload and remote verification. An authentication or deployment failure leaves a local result; report it without substituting another account or host.
4. Open the affected routes on the stable development hostname. Compare changed content/assets against the intended build or revision, and check the changed behavior. A successful CLI command or HTTP 200 alone is insufficient.
5. Return the direct development-page link, visible change, actual checks and any remaining limitation. A deployment-specific URL may help diagnose a race or cache issue, but the stable link is the review destination.

## Immediate local preview loop

After every site change, including a minor copy, style or interaction adjustment, make it visible locally immediately. Complete this loop before moving on to another change or reporting the result:

1. Run `npm run build` after the change (a successful `npm run validate` also rebuilds). The preview server does not watch source files.
2. Reuse the current clone's healthy preview server. If none is running, start `npm run dev`, which builds and serves `dist/` at `http://127.0.0.1:4173/`. Identify a stalled listener before stopping it; restart only this project's server. Concurrent worktrees need separate ports and build folders.
3. Refresh the affected route in the existing local preview tab, or open it if needed. Preserve the collaborator's route and review position where practical. If stale content persists, check the build and serving directory, then reload without cache as needed.
4. Inspect the refreshed page and confirm the intended change is visible. Opening a tab or getting an HTTP 200 alone is not verification.

The agent owns these routine steps; do not ask the collaborator to remember to build, start the server or refresh, and do not defer the loop until final delivery. If browser control or server access is unavailable, complete the steps you can and state the specific limitation instead of claiming a refreshed preview. Documentation-only edits need document checks, not this site preview loop.

Keep the local preview current throughout editing and still deliver the completed change to the shared development link. Localhost on one machine is not the other collaborator's shared review link.
