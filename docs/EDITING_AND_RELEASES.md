# Website editing and releases

SCRUM-14 supports requests through the existing authenticated Codex/ChatGPT collaboration. This is an operator workflow for the static repository, not a new public editing service.

## Request, preview and development delivery

1. Retain the user's request in the task or Jira issue. Make the scoped source change, immediately build and inspect the local preview. Missing client copy must remain labelled.
2. Integrate the latest shared source, validate and commit/push the intended revision to main. Preserve other collaborators' work.
3. Run `npm run release:check -- --request SCRUM-14`. It verifies authenticated GitHub repository write access, clean main matching remote HEAD, site validation and the existing Cloudflare account/project. It does not publish.
4. Run `npm run deploy -- --request SCRUM-14`. This uses standing authorization for the development site. The release is recorded in GitHub Deployments with the request reference, exact revision, authenticated operator, target, authorization basis and success/failure status. The immutable Cloudflare deployment link is attached after every delivered file matches the build, followed by the stable hostname check.
5. Inspect changed behavior at https://hintonx-site.pages.dev/ and report the actual checks. A byte match does not replace visual or interaction review.

Use a specific request reference for each change; do not put private client messages or credentials in the public deployment payload. GitHub history is visible at https://github.com/dosen-blip/hintonx-site/deployments. Use `gh api repos/dosen-blip/hintonx-site/deployments` to inspect the underlying records and each record's statuses URL. Records before this workflow are available in Git commits and Cloudflare deployment history, not reconstructed approvals.

The local release lock prevents concurrent releases from this clone and its worktrees. It is not a distributed lock: coordinate with collaborators in other clones before upload. Remote HEAD is checked again immediately before upload. Cloudflare credentials remain managed by Wrangler. The script's GitHub write check validates the operator; it does not authenticate the person writing a chat message, enforce a future approver list, or stop credential holders bypassing the script.

If an upload or audit update fails, inspect Cloudflare and GitHub history before retrying. An upload may have succeeded even if verification or the history update failed. No automatic rollback hides that state. If a process is killed, inspect it before removing the `.git/hintonx-release.lock` directory.

## Live approval boundary

Only `--target development` is implemented. Other targets fail closed. The shared pages.dev URL is publicly accessible but is the agreed review destination; it is not an access-controlled staging service. No custom domain or new project is introduced.

Before completing the live-launch criteria, the owner must identify the live domain and allowed approvers. Configure the chosen live access/approval controls, present the exact reviewed revision and preview, record the user's explicit approval, then publish that revision. Do not call standing development authorization a live approval. Verify the live destination and audit record after launch. These account-level controls and the actual live publish remain pending; scripts alone do not fulfil them.

## Restore a previous version

Cloudflare Pages retains successful production deployments for rollback. Its Pages rollback control is separate from the Workers `wrangler rollback` command; do not substitute the Workers command.

1. Select the intended previous successful deployment in this project's Cloudflare history. Record its deployment ID, Git revision and reason in the current request. Coordinate with collaborators so another upload cannot overwrite recovery.
2. Rehearse reconstruction without changing the shared URL:

   `npm run rollback:rehearse -- --revision FULL_GIT_SHA --deployment https://DEPLOYMENT_ID.hintonx-site.pages.dev`

   This extracts tracked source into a temporary directory, validates it, and compares every delivered file with the retained deployment. It leaves the current checkout and shared site untouched.
3. For an actual authorized recovery, open Cloudflare Workers & Pages → hintonx-site → Deployments → the selected successful production deployment → Rollback to this deployment. Check the exact project and revision before applying it. See [Cloudflare Pages rollback documentation](https://developers.cloudflare.com/pages/configuration/rollbacks/).
4. Compare the restored shared hostname against the same reconstructed build and inspect affected pages. Record the rollback ID/revision, operator, authorization, reason and verification in the request. Cloudflare stores the deployment activity; do not claim the local rehearsal performed a live rollback.
5. Reconcile main with a focused revert/fix commit before the next routine release so it cannot accidentally restore the fault. Do not reset or force-push shared history.

The rehearsal tests source reconstruction and retained artifact integrity. Switching the live hostname, live approver enforcement and recovery under the final account policy require the launch configuration and an actual recovery drill.
