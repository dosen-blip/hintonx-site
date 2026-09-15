# Public Sector implementation and content review

Reviewed against Jira on 2026-09-15. The parent SCRUM-5 and all seven subtasks SCRUM-6–12 remain In Review. The seven routes are delivered through the shared development site at https://hintonx-site.pages.dev/publicsector/. In Review is not final content approval or completion of the original production Definition of Done.

## Sources and Jira coverage

The original copy comes from the supplied `HintonX_ Public Sector.md` and `HintonX_Public_Sector_Developer_Story.docx`. The developer story supplies structure and task coverage. User decisions authorize placeholders for missing copy, the existing development host, analytics hooks with provider setup deferred, and supplied reference imagery with accurate captions.

The current Jira pass read all issues in SCRUM, including descriptions, attachments, comment fields and statuses. No comments were returned for SCRUM-5–12. The linked Google Doc could not be refreshed directly: the Drive connector returned 403 and the in-app browser required sign-in. The user subsequently supplied `HintonX_ Public Sector (1).md`, which was compared against the implementation: all 82 main source-copy fields match after Markdown/whitespace normalization. The IRCC and HRDC/ESDC client entries now retain the supplied historical-name qualifiers. This verifies the supplied snapshot, not subsequent changes to the online document. Original attachments remain unchanged in ignored local planning storage; only web derivatives are delivered.

| Jira | Route / coverage | Current implementation |
| --- | --- | --- |
| [SCRUM-5](https://tonysdosen.atlassian.net/browse/SCRUM-5) | Shared responsive behavior, content, client treatments, metadata and images | Implemented; final content and indexing review remain open |
| [SCRUM-6](https://tonysdosen.atlassian.net/browse/SCRUM-6) | `/publicsector/` | Overview, eight services, recognition, 13 grouped clients, six cards and contact action; OSFI overview visual |
| [SCRUM-7](https://tonysdosen.atlassian.net/browse/SCRUM-7) | `/publicsector/osfi-oasis/` | OSFI1 hero/card and OSFI2 workflow gallery |
| [SCRUM-12](https://tonysdosen.atlassian.net/browse/SCRUM-12) | `/publicsector/government-of-alberta-atlas/` | GOVA1 hero/card and GOV2 design-system reference; draft copy retained |
| [SCRUM-8](https://tonysdosen.atlassian.net/browse/SCRUM-8) | `/publicsector/ised-spectrum-cloud/` | ISED dashboard visual from the linked portfolio page |
| [SCRUM-9](https://tonysdosen.atlassian.net/browse/SCRUM-9) | `/publicsector/cbsa-traveller-modernization/` | ELVIS mobile visual and two design-guidance/flow galleries from the linked portfolio page |
| [SCRUM-10](https://tonysdosen.atlassian.net/browse/SCRUM-10) | `/publicsector/federal-judicial-affairs-phoenix/` | Supplied OSSNR report visual, captioned explicitly as a separate project |
| [SCRUM-11](https://tonysdosen.atlassian.net/browse/SCRUM-11) | `/publicsector/cbsa-import-information/` | Supplied ELVIS reference, captioned explicitly as later work separate from the 2010–2011 engagement |

SCRUM-13 (template.html) and SCRUM-14 (website editing workflow) are separate top-level items, not new children of SCRUM-5. The container template already exists in the integrated source; shared development workflow guidance is current. This Public Sector media pass does not claim SCRUM-14's full authorized-user, approval-history or rollback workflow is implemented. SCRUM-3 and SCRUM-4 still have no defined requirements.

## Media inventory and attribution

On 2026-09-15, the user explicitly chose to use the supplied Phoenix and older-CBSA reference images with accurate captions. Those captions appear on both the overview cards and detail pages. They do not change the client identity, engagement dates or case-study claims.

| Asset stem in `src/assets/publicsector/` | Source | Original dimensions | Use |
| --- | --- | --- | --- |
| `osfi-oasis-projects` | SCRUM-7 attachment 10002, `OSFI1.jpg` | 2500×1326 | Overview, OSFI card and hero |
| `osfi-oasis-workflows` | SCRUM-7 attachment 10001, `OSFI2.jpg` | 2500×1326 | OSFI gallery |
| `alberta-atlas` | SCRUM-12 attachment 10006, `GOVA1.png` | 4147×3240 | Atlas card and hero |
| `alberta-design-system` | SCRUM-12 attachment 10005, `GOV2.png` | 4147×3240 | Atlas gallery; identified as design-system reference |
| `ised-spectrum-cloud` | [Client-linked ISED portfolio](https://www.hintonx.com/projects/spectrum-management-platform), `cXWEYTAhE3oHKjRb52MQZ5ix2E.png` | 2500×1326 | ISED card and hero |
| `cbsa-elvis` | [Client-linked CBSA portfolio](https://www.hintonx.com/projects/canada-border-services-agency), `Y63ztoooToHBIkPa7aFxzznnoA.png` | 2500×1326 | CBSA cards/heroes with engagement-specific captions |
| `cbsa-design-guidance` | Same CBSA page, `1UrUh10LnQlBIjNaAyqbbeJVDvg.png` | 2500×1326 | Later CBSA gallery |
| `cbsa-mobile-flows` | Same CBSA page, `oTARU0JuM2gpFvZjWTMPwjRTgk.png` | 2500×1326 | Later CBSA gallery |
| `ossnr-annual-report` | SCRUM-10 attachment 10007, `OSSNR.png` | 2159×1537 | Phoenix card/hero as clearly identified reference |

Each source has 640, 1280 and 1920-pixel WebP exports plus a 1920-pixel progressive JPEG fallback. No crops or interface alterations were made. The two transparent Alberta monitor mockups are composited onto a neutral light background for JPEG/WebP consistency. Intrinsic aspect ratios and descriptive alternatives are recorded in the content module. The existing build asset collector explicitly copies each referenced source and responsive candidate; masters are not bundled. Hero images load eagerly; cards and galleries load lazily. Loaded-image fallback labels are hidden from assistive technology; actual errors expose the reserved fallback.

## Remaining content decisions

- Approve Atlas draft material and supply final Services and Outcome copy. Both missing fields remain visibly labelled.
- Confirm the overview's “Since 2013” wording alongside the 2010–2011 engagement. Existing attribution to Tony Dosen and HintonX is retained.
- Review final client names, project titles, dates, card summaries, metadata and captions. The qualified CBSA processing-time outcome and ongoing OSFI description are preserved.
- The supplied Markdown snapshot has been reviewed; it contains no additional case-study copy or new actionable to-do items. Its editorial labels, stray sentence and internal non-publication note are not rendered. Atlas remains a clearly labelled development draft under the user's existing scaffold authorization; the source still lacks final Services and Outcome text.
- Optional recognition imagery was not supplied. Recognition remains text with a case-study link.
- All 13 client names remain text treatments; no independent official logo exports or mark-use instructions were supplied. Embedded marks within the supplied project mockups remain unchanged.
- Seven 1200×630 social images remain the labelled HintonX preview artwork pending final review.
- Connect an analytics provider and verify received events when the deferred setup is requested. Browser hooks currently do not store or transmit visitor data.
- Keep `publicSector.indexable` false until final content/indexing approval. Shared development delivery is already authorized; a custom-domain launch remains separate.

## Validation

- `npm run validate`: 27 HTML pages, internal links/fragments/assets and 20 tests pass, including a regression for offscreen lazy-image loading and error/recovery states.
- Browser checks of all seven routes in 320, 390 and 1440 CSS-pixel iframe viewports: no horizontal overflow, one H1 per page, alternatives on all project images, and no failed requested images. The browser's viewport override did not take effect, so a temporary local iframe harness provided actual responsive viewports; these are not physical-device tests.
- Real overview cards load after reaching the case-study section. Browser-selected WebP candidates, full-image proportions, supplied-reference captions and Atlas draft labels were inspected. Gallery-to-details spacing is restored when a gallery introduces a dark band.
- The metadata, structured breadcrumbs, sitemap exclusion and noindex behavior remain validated. No claim of a full WCAG conformance audit, field Core Web Vitals, live analytics or social-platform cache refresh is made.

Accessibility review uses [WCAG 2.2](https://www.w3.org/TR/WCAG22/) as the current W3C reference. Preserve native scrolling, keyboard navigation, visible focus and reduced-motion behavior when refining these pages.
