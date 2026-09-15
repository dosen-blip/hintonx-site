---
name: hintonx-design-feedback
description: Turn HintonX visual and experience feedback into focused, reviewable site changes, including requests about mood, hierarchy, flow, spacing or how an interaction feels.
---

# HintonX design feedback

Treat visual, experiential and technical descriptions as equally valid design input. Use the collaborator's own vocabulary naturally. Keep explanations about what visitors see and do; implementation details belong in the work unless they help a decision. Apply the [design system](../hintonx-design-system/SKILL.md) and [development workflow](../hintonx-dev-workflow/SKILL.md).

## From feedback to a change

Identify the page or element, the desired feeling or behavior, and any explicitly preserved details. Use the current conversation, supplied reference and actual page to resolve phrases such as “this bit” or “the opening.” Inspect the page before diagnosing it; request an anchor if the target cannot be identified.

For a clear, reversible adjustment, briefly state the visible change and proceed. For example: “I'll give the introduction more space and make the main heading easier to pick out.” Do not require a technical specification or make the collaborator choose CSS values.

If plausible interpretations would produce substantially different outcomes, ask one short question in design language, with concrete choices. For “make the opening lighter,” the relevant distinction might be more space versus a lighter background. Continue independent work while the answer is pending. Do not interpret a request for ideas, a critique or a comparison as approval to implement.

## Useful starting interpretations

These are hypotheses to check against the page and context, not automatic transformations.

| Feedback | Inspect and consider |
| --- | --- |
| “More breathing room” / “crowded” | Space between groups, line length, alignment and competing emphasis. Adjust the named area before removing useful content. |
| “More premium” / “more refined” | Type hierarchy, spacing consistency, crop quality and unnecessary decoration. Use the established restrained direction. |
| “Make it pop” / “stronger” | Clarify the focal point with scale, placement or contrast; use cobalt selectively. |
| “Calmer” / “less busy” | Competing movement and simultaneous visual emphasis. Preserve useful controls and information. |
| “Flows better” / “feels disconnected” | Section sequence, transitions, heading relationships and next actions. Separate local rhythm changes from a proposed content reorder. |
| “Feels heavy” / “lighter” | Determine whether the issue is density, type weight, imagery or surface tone; clarify when context does not distinguish them. |
| “Smoother” / “jumpy” | Reproduce the motion, layout shift or scrolling symptom; fix its cause while retaining native scrolling and reduced-motion support. |
| “Like this reference” | Extract the relevant quality, such as scale, rhythm or framing. Preserve HintonX identity, facts and media. |
| “Doesn't work on my phone” | Reproduce the named page and behavior at a phone width; check clipping, wrapping, tap targets and scroll behavior. Ask for device details only when needed. |

## Close the loop

Describe the visible result in one or two sentences, link directly to the affected page on the shared development site, and say what was checked. Distinguish an implemented change from a suggestion and a verified preview from a local-only result. If feedback expresses dissatisfaction, use it to refine the same scope; avoid adding unrelated features or restarting the whole design without a request.

Keep collaborator-facing titles and documentation focused on site decisions and visitor experience. Explain the outcome in the same natural language used in the request.
