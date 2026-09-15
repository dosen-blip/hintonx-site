---
name: hintonx-design-system
description: Apply the established HintonX visual system to page, typography, layout, media and interaction changes in this repository.
---

# HintonX design system

Read the current clone's [source of truth](../../docs/SOURCE_OF_TRUTH.md), especially Approved visual direction and Code ownership. It owns accepted design decisions; the source CSS owns exact values and responsive overrides. Resolve installed symlinks before following relative links. Current user direction can revise the system within the requested scope.

## Foundations

| Element | Use |
| --- | --- |
| Surfaces | Black `#080808` and warm white `#f7f7f3`; preserve existing pure-black and white values in the shared shell and older pages. |
| Accent | `--accent: #345cff`, hover `#244be4`, owned by `src/accent.css`. Use for selected actions, directional details, progress and heading punctuation. |
| Typography | DM Sans, existing weights 400, 500 and 700. Large, closely tracked headings; comfortable body copy. HX wordmark stays 700. Reuse the affected page family's type rules. |
| Layout | Generous space, strong heading hierarchy, alternating section tones and prominent project imagery. Existing page families have different container widths; preserve their proportions. |
| Controls | Existing links, pills, disclosures and native dialogs. Render arrow/play/close icons through `src/icons.mjs`; preserve accessible names and visible focus. |
| Media | Preserve supplied attribution, proportions and intentional crops. Reuse existing frame/radius rules. Provide dimensions and meaningful alternative text for new assets. |
| Motion | Reuse native behavior, shared reveals and eased disclosures. Keep reduced-motion behavior, keyboard access, native page scrolling and mobile pinch zoom. |

Do not invent a universal spacing scale or normalize all pages as part of a small request. Inspect the full stylesheet cascade: `styles.css` provides legacy defaults, page styles refine them, and shared navigation/accent styles also apply. An early declaration or unused selector alone does not prove visible behavior.

## Match the page family

- **Home:** preserve the coordinated headline/project spotlight, desktop wheel and mobile card stack. Use the source-of-truth interaction details when touching these features. Section headings carry the hierarchy; removed eyebrows, counters and explanatory captions stay absent unless requested.
- **Work:** retain the restrained heading, cobalt punctuation and discipline navigation. Reuse its portfolio treatment rather than importing service-page structure.
- **Services:** reuse introduction/media, capabilities, selected work, approach and enquiry. Preserve curated membership and contribution wording. Service pages use the shared Services menu without the Work discipline bar.
- **Case studies:** reuse title/lead media, overview/facts, gallery, result and next-project sequence. Preserve Hinton Press's editorial spacing and compact single-image cases.
- **Public Sector Solutions:** reuse its overview and case templates. Consult `docs/PUBLIC_SECTOR_REVIEW.md` for incomplete material; keep draft/placeholder distinctions and indexing state until content is approved.
- **Studio, Contact and legacy Video:** preserve their existing layouts outside the requested change.

## Apply and review

1. Identify the named page/element and inspect its current renderer, content and styles using the ownership map.
2. Make the smallest complete change that expresses the requested outcome. Immediately rebuild, refresh and verify it in the local preview through the [preview loop](../hintonx-dev-workflow/SKILL.md#immediate-local-preview-loop), including for minor adjustments. Keep client facts, routes and unrelated sections intact. Broad redesigns require a request for that scope.
3. Run `npm run validate` and inspect the affected page at desktop and phone widths. Check actual text wrapping, image crop, spacing, horizontal overflow and controls. Check keyboard/reduced-motion behavior when interactions change.
4. Deliver through the [development workflow](../hintonx-dev-workflow/SKILL.md). Record accepted convention changes once in the source of truth.
