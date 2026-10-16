# Final consolidated issues report — W8a print-ready evidence package, single month-evaluation path, and exclusion documents (the local git diff 917bcd1..HEAD)

Issues are sorted from highest to lowest combined importance/confidence.

---

## 1. Attachment references collide across two independent document tables

**Severity: High** · *(cluster: attachment and blob lifecycle — see also #3, #14)*

- **User impact:** The agency receives a package in which one photograph appears twice under two different manifest descriptions while another document silently disappears. The entire purpose of the artifact is matching documents to claims, so a caseworker reviewing it sees evidence that does not correspond to the row it sits under, and the user has no way to notice from the printed page.
- **Issue:** `documentReference` in `src/lib/export/buildEvidencePackage.ts` mints `DOC-${doc.id}` for activity documents, exclusion documents, and income documents, but `documents` and `incomeDocuments` are separate Dexie tables with independent `++id` sequences, so both legitimately contain row `1`. `src/app/export/package/page.tsx` compounds it by filling a single `Record<number, string>` (`urls[doc.id] = url`) from three sequential loops, so the last writer wins. The manifest then renders duplicate React keys (`<li key="DOC-1">`) and both attachment blocks resolve through `resolveUrlForReference` to the same URL.
- **Recommendation:** Replace the reference with a namespaced or composite identity carrying the evidence kind (`ACT-`/`INC-`/`EXC-`, or a `{ kind, id }` pair) through the package model, the URL map, and the renderer, and key `attachmentUrls` by that reference rather than the bare numeric id. Add a test that builds a package from both document tables with equal numeric ids and real blob bytes, and asserts two distinct images reach two distinct manifest rows.

## 2. The package prints one comparison per month and infers the pathway from record presence

**Severity: High** · *(cluster: what the package prints per month — see also #17)*

- **User impact:** A user who recorded a month as income but also logged a few volunteer hours hands the agency a record whose comparison contradicts the tracking screen and the text export for the same month. A seasonal worker who logged 90 hours hands in a record that lists the activities but never states the hours total or the threshold they are measured against. The person the domain rules single out — already satisfying the income pathway without hours — is shown an hours deficit they do not need to close.
- **Issue:** `buildEvidencePackage` computes both an hours comparison and an income comparison per month, but takes no `complianceModes` input and derives `mode` as `monthIncome.length > 0 && monthActivities.length === 0 ? "income" : "hours"`, while `buildTextReport` reads the stored `ComplianceMode` row — two sources of truth for the same fact. `EvidencePackageView` then renders exactly one branch, testing `m.income.isSeasonalWorker` before `m.mode`, which makes the hours comparison unreachable for any seasonal month. Gap 8.9's third clause ("renders only one mode per month") is reproduced in the new surface rather than closed by it.
- **Recommendation:** Pass the stored `complianceModes` into `buildEvidencePackage` so the package and the text report cannot disagree, and render both neutral comparisons when both kinds of evidence exist, keeping the recorded pathway as a label rather than a filter. Treat seasonal status as a modifier of the income block only. Add view-level tests asserting which comparisons render for a month holding both record types and for a seasonal month with logged hours.

## 3. Selected months do not scope the evidence graph, and every blob loads before consent

**Severity: High** · *(cluster: attachment and blob lifecycle — see also #1, #14)*

- **User impact:** A user who narrows the package to two months still prints attachments and exclusion responses from unrelated months, while the cover page names only the selected range. That is identifiable health and income information disclosed to an agency beyond what the user chose to disclose. Every document in the database is also decoded into memory before the PII interstitial renders, so narrowing the period reduces neither the exposure nor the phone's memory cost.
- **Issue:** In `buildEvidencePackage`, `sortedMonths` scopes the activity and income summary rows, but the manifest loop iterates every supplied document and the exclusion projection iterates every screening. `src/app/export/package/page.tsx` supplies full-table reads: it reads seven record tables and both blob stores directly through `db` and creates an object URL for each document on mount, before the warning stage and before any range choice. Data loading, decryption, scoping, casting, and URL lifetime are all coordinated inside one UI effect rather than behind a storage API. The wave file's own mitigation — warn above a size threshold, read blobs lazily per month — is in neither half, and the promised selection from W5's `ReviewPeriod` is absent, so the first package assembled is always the widest one.
- **Recommendation:** Move loading behind a storage-layer package loader that accepts the profile and the selected range and returns only in-range metadata and blobs, called after the PII confirmation. Filter the complete evidence graph — documents and exclusions — before manifest construction, and state explicitly in the model how exclusion evidence relates to the selected period. Add the review-period option alongside the arbitrary range, or re-scope that acceptance criterion.

## 4. The documentation-gap copy inverts the may/must transition and omits the protection

**Severity: High** · *(cluster: agency-facing copy — see also #6, #11, #15)*

- **User impact:** The one artifact a caseworker reads tells the user that documents are required from the hardening date without the counterpart that the state must accept other information when documentation is not reasonably available and may not deny or terminate solely because it does not exist. For family caregiving — the case CMS names as typically undocumentable — that reads as a wall, and a user who cannot produce a paystub for care they give for free may conclude the pathway is closed to them.
- **Issue:** The package copy says the state "may require them from [date]," which inverts § 435.557's structure: a state may require documentation now, and must require it whenever reasonably available from its hardening date. Neither branch of the documentation-gap flag in `buildEvidencePackage`/`EvidencePackageView` carries § 435.557(b)(2)(iii)'s protection.
- **Recommendation:** Rewrite the sentence as the two-sided rule — may now, must from the date — and add the no-reasonably-available-documentation protection to both branches of the flag, with the citation in the source and plain language on the page.

## 5. Agency verification fields and required print sections never reach the page

**Severity: High**

- **User impact:** The agency cannot verify what the user is claiming. Community service rows arrive without the organization's address, the activity description, court-order status, or the contact name, phone, and email CMS's verification guidance names, so a caseworker has no one to call. An at-least-half-time education row prints as bare "Education" with no school-determined enrollment status or credit detail, which is the pathway that needs no hours at all. Where there are no documents, the manifest vanishes rather than saying so, and there is no line for the user to sign and date the record they are handing over.
- **Issue:** The HTML rows in `EvidencePackageView` carry date, type, non-education hours, and at most one organization name; they drop `workKind`, school enrollment status and credit/non-credit detail, and the community-service verification fields that W6a added. `pkg.manifest.length > 0` suppresses the manifest section entirely when empty. No signature or date field exists in the route, the builder, or the renderer. The wave claims gap 8.7 includes `assessmentResults` and the apparent pathway with its citation, but the route never reads that table and the package model has no assessment field.
- **Recommendation:** Build one agency-facing detail projection shared by the text and HTML renderers so W6a's corrected activity shape cannot drift again, add plain signature and date fields, render an honest empty-manifest state, and either carry a neutral assessment projection or stop claiming that part of 8.7 is closed. Assert each rendered section positively, plus the absence of attestation language.

## 6. An unrecorded seasonal month prints as $0

**Severity: Medium** · *(cluster: agency-facing copy — see also #4)*

- **User impact:** Missing data is presented to the agency as a fact about the user's income. A seasonal worker with one unlogged month in the six-month window shows a depressed average and an apparent shortfall on the household-income pathway they may actually satisfy, and the printed record asserts the zero rather than flagging the gap.
- **Issue:** Both the text report and the package render an unrecorded history month as "No record (counts as $0 until added)" in `buildTextReport.ts` and `EvidencePackageView.tsx`.
- **Recommendation:** Keep "No record," drop the "$0" assertion, label any average computed over an incomplete window as provisional, and name the next action — add or verify the missing month, and ask the agency what income data it already holds for it.

## 7. Exclusion documents have no capture surface and no screening writer

**Severity: Medium** · *(cluster: exclusion evidence end-to-end — see also #8)*

- **User impact:** A user whose only evidence is a VA disability letter or a SNAP/TANF approval notice has nowhere to attach it and cannot build the package the wave promises them. The route enters its `empty` stage whenever there are no activities and no income, even when screenings or exclusion documents exist, so exclusion-only evidence cannot open the artifact at all. In production the package's exclusion section is structurally empty.
- **Issue:** `saveExclusionDocument` in `src/lib/storage/documents.ts` has no caller outside its own test, and nothing in the app writes `db.exemptions` — `settings/page.tsx` reads screenings that nothing creates. The acceptance criterion "exclusion responses can carry documents, and they appear in the package" is satisfied only by fixtures writing the table directly. `deleteExclusionScreeningWithDocuments` likewise has no production caller.
- **Recommendation:** Either ship the attach surface wired to a known screening id and let screening evidence into the warning/ready flow, or re-scope the 8.5 row in the gap analysis to "storage and export only, capture pending W4" and say so plainly in the wave file rather than closing it.

## 8. `archiveScreening` leaves exclusion documents and blobs unreclaimable

**Severity: Medium** · *(cluster: exclusion evidence end-to-end — see also #7)*

- **User impact:** Re-screening silently strands the user's uploaded exclusion evidence on the device. The rows are invisible to the UI because their parent screening is gone, and every reclamation path now skips them, so the storage they occupy can never be recovered — on a phone near its quota, that pushes the user toward a failure they cannot diagnose or clear.
- **Issue:** `archiveScreening` in `src/lib/storage/exemptions.ts` writes a reduced history row and calls `db.exemptions.delete(screeningId)` with no document handling, while the new orphan cleanup in `src/lib/storage/activities.ts` deliberately skips documents whose `activityId` is undefined. The new cascade exists only in `deleteExclusionScreeningWithDocuments`, which the app does not call.
- **Recommendation:** Decide whether archived exclusion evidence is retained or deleted, implement that decision transactionally in `archiveScreening` (routing through `deleteDocumentsByExemption` or relinking to the history row), and test both the archive and delete paths with documents attached. Sweep every deleter of the changed field, as `data-migration-standards.md` asks for every reader.

## 9. The new print route has no browser coverage

**Severity: Medium** · *(cluster: verification coverage — see also #18)*

- **User impact:** The route most likely to break invisibly is the only one no browser test opens. Hydration failures on this exact class of page shipped to production once already, invisible to the whole Vitest suite and to `npm run dev`. If `/export/package` fails to hydrate, the confirm button does nothing and the user cannot produce the record at the moment they need it.
- **Issue:** The diff changes no file under `e2e/`, and the passing route arrays — including `e2e/console-clean.spec.ts` — list `/export` but not `/export/package`. No committed test exercises print emulation, despite an acceptance criterion claiming per-page self-identification is "asserted in the DOM"; what exists is a jsdom text assertion. jsdom cannot verify real IndexedDB `Blob` bytes, object-URL joins, print CSS, or a 375px layout.
- **Recommendation:** Add the route to the generic console/hydration checks, then add focused Playwright coverage for warning → confirm ordering, range scoping, overlapping numeric document ids with real attachments, one print-emulation assertion, and phone-viewport behavior. Keep fax legibility as the documented manual check.

## 10. `buildTextReport` keeps a fallback that prints the pre-evaluation total

**Severity: Medium**

- **User impact:** A database with activities but no policy profile row still prints the old divergent hours total — the raw sum of logged hours rather than the evaluated figure. For a less-than-half-time education month that means handing the agency 99 hours where the regulation's conversion yields 77.94, which is the exact divergence gap 8.9 exists to eliminate.
- **Issue:** `buildTextReport.ts` retains `evaluation?.hours.totalHours ?? monthActivities.reduce(...)`, and `src/app/export/page.tsx` populates evaluations only inside `if (profile)`. The module comment calls the fallback "never the shipped path," but the guard makes that conditional on profile existence rather than unconditional.
- **Recommendation:** Require evaluations and drop the `reduce` fallback, or make the no-profile case refuse to export rather than export the old numbers silently. Add a test for the no-profile path asserting whichever behavior is chosen.

## 11. The federal fallback profile is printed as resolved state policy

**Severity: Medium** · *(cluster: agency-facing copy — see also #4)*

- **User impact:** The artifact states the user's state's seasonal-averaging method and documentation-hardening date as settled fact when the app is running on a federal floor it describes internally as "no state data." If the user's state elected differently, the record they hand their caseworker asserts the wrong policy, and the app has converted a statutory fallback into a claim about a state election it does not know.
- **Issue:** Both export routes pass `FEDERAL_DEFAULT` into `evaluateMonth`, and `src/app/export/package/page.tsx` passes it again into the builder despite holding the user's state. `FEDERAL_DEFAULT` marks its state elections as assumptions, but neither the builder nor the renderer carries that confidence through to the page.
- **Recommendation:** Resolve the applicable policy profile before assembly; where it cannot be resolved, carry profile confidence into the package model and render the federal-floor hedge next to every state-elected value, naming the election — the Conditional label in `compliance-copy-standards.md` is the pattern.

## 12. Root-layout chrome is not suppressed in print

**Severity: Medium**

- **User impact:** An offline banner or a low-storage alert can print on top of the faxed record, obscuring the content underneath and telling the caseworker about the user's device rather than their evidence.
- **Issue:** `OfflineIndicator` renders `position: fixed` and `StorageWarning` renders an `Alert`, both from the root layout, neither with an `@media print` rule. The package page hides its own controls with `"@media print": { display: "none" }`; the same treatment is missing one level up.
- **Recommendation:** Add print suppression to both components, and assert it under print emulation in the browser spec added for #9.

## 13. The six-month seasonal window is a literal in user-facing copy

**Severity: Medium**

- **User impact:** If the seasonal window ever changes, the printed record and the text report state a window the arithmetic no longer uses, and the discrepancy is invisible to the user holding both.
- **Issue:** Both `buildTextReport.ts` and `EvidencePackageView.tsx` write "6 months" as a string literal while `policy.seasonalMethod.months` exists. The policy-literal scan in `src/lib/__tests__/policyInjection.test.ts` cannot catch a bare `6`, so the rule is unenforced here.
- **Recommendation:** Interpolate the window from the policy profile, per the no-policy-values-outside-`src/lib/policy/` rule, and extend the literal scan's pattern or add a targeted assertion so the same escape is caught next time.

## 14. The object-URL teardown races the async load

**Severity: Low** · *(cluster: attachment and blob lifecycle — see also #1, #3)*

- **User impact:** On a device under memory pressure, repeated visits to the route leak blob URLs that are never revoked, and a resumed load from a previous visit can overwrite the state of the current one — the user sees attachments from the prior pass or a page that resets itself.
- **Issue:** In `src/app/export/package/page.tsx` the effect's `revoked` array is captured per run and revoked as it stands at teardown; an `await`-suspended `load()` that resumes afterwards keeps pushing URLs nobody will revoke and keeps calling `setState`.
- **Recommendation:** Add a cancelled flag checked after every `await`, revoke anything created past cancellation, and skip state updates once cancelled. Folding the load into the scoped storage API from #3 removes most of the surface.

## 15. The household-income hedge names no next action

**Severity: Low** · *(cluster: agency-facing copy — see also #4)*

- **User impact:** The user is told the state's figure may be higher than the one on the page and left there — anxiety transferred without capability. They do not learn that they should ask the agency what income it already has on file.
- **Issue:** The household-income caveat in the package copy ends at "your state counts your whole tax household here, so its figure may be higher than this one," which `compliance-copy-standards.md` treats as an unfinished hedge.
- **Recommendation:** Append the action — ask the agency what it has on file for the household — and keep the Deferred framing so no total is implied.

## 16. Dates and month keys print unformatted on the artifact

**Severity: Low** · *(cluster: agency-facing copy — see also #4)*

- **User impact:** The record a caseworker reads mixes "July 2026" with raw `2026-07` and `2028-01-01`, which reads as machine output rather than a document the user prepared, and is harder to scan on a fax.
- **Issue:** `documentationRequiredFrom` prints as the raw ISO string where every other date goes through `format`, `coverageMonths` prints raw month keys while the month blocks use long form, and the exclusion section formats its date with `toLocaleDateString("en-US")` instead of `date-fns`.
- **Recommendation:** Route every date and month key on the page through the project's `date-fns` formatting helpers.

## 17. Casts and comments that describe behavior the code does not have

**Severity: Low** · *(cluster: what the package prints per month — see also #2)*

- **User impact:** None directly, but each of these hides one of the bugs above from the next reader: the cast conceals that two different row types share one manifest input, and the comments assert the correct behavior loudly enough that a reviewer may not check for it.
- **Issue:** `src/app/export/package/page.tsx` uses `allIncomeDocs as unknown as Document[]` plus a defensive `incomeEntryIdOf` cast; the `attachmentUrls` doc comment claims blobId keying while the code keys by document id; and `buildEvidencePackage`'s comment says "the package shows both comparisons when present," which the view does not do.
- **Recommendation:** Give the manifest input a discriminated union over evidence kind instead of casting, and correct both comments alongside the fixes for #1 and #2.

## 18. Wave bookkeeping and the `npm ci` gate are outstanding

**Severity: Low** · *(cluster: verification coverage — see also #9)*

- **User impact:** None for users; the cost lands on the next person picking the project up, who reads closed gap rows for behavior that is not reachable in production.
- **Issue:** `CHANGELOG.md` has no W8a entry and `gap-analysis.md` has no closure lines for 8.1/8.3/8.5/8.7/8.8/8.9 with the running total unchanged, while rows 8.5 and 8.7 cannot be closed on the strength of this diff (see #5, #7). `npm ci` is on the definition of done and was not run. The three reviewed files also carried concurrent uncommitted edits outside `917bcd1..HEAD` during review, so the green gate run was not a pristine checkout of committed `HEAD`.
- **Recommendation:** Add the changelog entry, write closure lines only for the rows actually closed and recompute the running total, run `npm ci`, and re-run the gates on a clean tree before the wave closes.
