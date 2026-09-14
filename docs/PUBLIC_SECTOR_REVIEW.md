# Public Sector implementation and content review

The seven-page section is implemented for local review under SCRUM-5. SCRUM-5 is In Progress; SCRUM-6 through SCRUM-12 are In Review with implementation checklists and remaining publication requirements. The user approved complete page scaffolds with visible missing-copy and image placeholders, the Public Sector Solutions navigation item, the existing Pages host, and analytics hooks with provider setup deferred. This is not a claim of publication or completion of the original production Definition of Done.

## Sources and Jira coverage

Content comes from the supplied `HintonX_ Public Sector.md` and `HintonX_Public_Sector_Developer_Story.docx`. The developer story supplies structure and task coverage; the user's explicit placeholder and analytics decisions supersede its release assumptions. Original attachments remain unchanged. The source document's internal instructions, duplicate headings and stray sentence are excluded from rendered copy.

- [SCRUM-5](https://tonysdosen.atlassian.net/browse/SCRUM-5): GS 06–07, CS 10, LG 01–06, SEO 01–07, IMG 01–07; shared verification and remaining publication requirements.
- [SCRUM-6](https://tonysdosen.atlassian.net/browse/SCRUM-6): GS 01–05, CS 01–02, CS 09; overview, editable content, shared template, cards and navigation.
- [SCRUM-7](https://tonysdosen.atlassian.net/browse/SCRUM-7): CS 03, OSFI OASIS.
- [SCRUM-8](https://tonysdosen.atlassian.net/browse/SCRUM-8): CS 05, ISED Spectrum Cloud.
- [SCRUM-9](https://tonysdosen.atlassian.net/browse/SCRUM-9): CS 06, CBSA Traveller Modernization.
- [SCRUM-10](https://tonysdosen.atlassian.net/browse/SCRUM-10): CS 07, Federal Judicial Affairs Phoenix.
- [SCRUM-11](https://tonysdosen.atlassian.net/browse/SCRUM-11): CS 08, CBSA Import Information.
- [SCRUM-12](https://tonysdosen.atlassian.net/browse/SCRUM-12): CS 04, Government of Alberta Atlas.

SCRUM-3 and SCRUM-4 have no defined requirements; neither is changed or treated as complete.

## Remaining content decisions

- Approve Atlas's supplied draft material and supply final Services and Outcome copy. The complete layout already exists; each missing field is labelled on the page.
- Confirm the overview's “Since 2013” wording alongside the 2010–2011 engagement. The supplied wording and the attribution to Tony Dosen and HintonX are retained.
- Review final client names, project titles, dates, derived card summaries, metadata and captions. The CBSA reported processing-time outcome is retained verbatim; OSFI remains described as ongoing work.
- Supply approved project images and approve any official client marks to replace the text treatments below. Text treatments are an allowed final alternative to official marks.
- Connect an analytics provider and verify received contact/case events only when that deferred setup is requested. Local hooks do not collect or transmit data.
- Authorize and verify publication separately. Do not enable indexing while the section contains draft copy or image placeholders.

## Client mark inventory

No approved logo source files or mark-use approvals were supplied. All 13 clients currently use their written names, with no imitation or recolouring of official marks. Source, approved colour options and clear-space requirements remain pending for every official mark. If marks are supplied, record their exact source and permission before adding them to the content module. Logo images use the full client name as alt text; text treatments need no image alternative.

| Group | Client | Current treatment |
| --- | --- | --- |
| Federal department/agency | Office of the Superintendent of Financial Institutions | Text |
| Federal department/agency | Innovation, Science and Economic Development Canada | Text |
| Federal department/agency | Canada Border Services Agency | Text |
| Federal department/agency | Office of the Commissioner for Federal Judicial Affairs Canada | Text |
| Federal department/agency | Immigration, Refugees and Citizenship Canada | Text |
| Federal department/agency | Canadian Nuclear Safety Commission | Text |
| Federal department/agency | Treasury Board of Canada Secretariat | Text |
| Federal department/agency | Employment and Social Development Canada | Text |
| Federal department/agency | Social Sciences and Humanities Research Council | Text |
| Federal department/agency | Public Health Agency of Canada | Text |
| Federal department/agency | Office of the Privacy Commissioner of Canada | Text |
| Federal Crown corporation | Canada Post | Text |
| Provincial government | Government of Alberta | Text |

## Image inventory

No approved source images were supplied for the new section. The image slots below therefore have no crop, caption or factual alt text to approve yet. Placeholders are HTML/CSS with visible labels, not project screenshots. A single approved case image can serve both its card and detail hero; galleries remain optional.

| Slot | Current source and approval | Crop and replacement requirements |
| --- | --- | --- |
| Overview hero | None; “Public sector image pending” | 16:9 placeholder; use approved source proportions on replacement |
| ISED recognition image | None; text-only recognition is rendered | Optional; do not add an empty image slot |
| OSFI card/detail | None; “Project image pending” | Same approved source may serve card and detail; caption/alt pending |
| Alberta card/detail | None; “Project image pending” | Same approved source may serve card and detail; caption/alt pending |
| ISED card/detail | None; “Project image pending” | Same approved source may serve card and detail; caption/alt pending |
| CBSA Traveller card/detail | None; “Project image pending” | Same approved source may serve card and detail; caption/alt pending |
| Federal Judicial Affairs card/detail | None; “Project image pending” | Same approved source may serve card and detail; caption/alt pending |
| CBSA Import card/detail | None; “Project image pending” | Same approved source may serve card and detail; caption/alt pending |
| Seven social images | Local HintonX typography, explicitly labelled preview | 1200×630 PNG; replace or approve individually after content review |

Approved image records use `src`, intrinsic `width`/`height`, `alt`, optional `caption`, and `srcset`/`webpSrcset`. Use responsive exports sized for the actual layout, preserving source proportions. Keep masters outside the delivery bundle. The build copies explicitly referenced local assets and responsive candidates. Placeholders and actual image failures retain reserved space. Do not supply stock images or invented product interfaces as evidence.

## Validation record

- `npm run validate`: 26 HTML pages, local links/assets/fragments, nine existing wheel tests and seven new public-sector tests passed.
- Headless Chrome: all seven section routes checked at 1440, 1024, 901, 900, 768, 390 and 320 CSS pixels; no horizontal overflow. The 320-pixel check covers the reflow width equivalent to a 1280-pixel viewport at 400% zoom.
- Additional checks doubled main-content text at 1440, 390 and 320 pixels; all identified overflow was corrected and rechecked. Computed main-content text contrast passed the applicable normal/large-text thresholds. Local initial layout-shift measurements were below 0.015; this is not a production performance measurement.
- The final browser run reported no console errors. A missing favicon request was fixed with a small shared HX SVG icon.
- Visually inspected overview, all six case layouts, the 320-pixel Federal Judicial Affairs heading, mobile Atlas, and representative share artwork.
- Verified real card/back navigation, click and Enter activation of analytics hooks, header contact tracking, mobile menu Escape dismissal/focus return, visible focus and no-JavaScript content/navigation fallback.
- Synthetic fixtures verified image-error fallback with unchanged dimensions and responsive WebP selection (600-pixel candidate on phone, 1200-pixel candidate on desktop). These checks validate the delivery component, not absent client imagery.
- Smoke-checked shared header/footer and navigation on Home, Work, Product Design, Video, existing ISED and Contact.
- Publication, external social-service rendering, physical-device testing and live analytics collection are not established by local checks.
