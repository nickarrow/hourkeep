# Print-ready Medicaid evidence package

W8a adds a print route, pure package assembly, shared month evaluation, and exclusion-document storage for an agency-facing record with real attachments. The evaluation/builder/view split is a useful direction, and the PII interstitial precedes the visible artifact. The committed behavior is not ready to ship: month selection does not constrain attachments, document identities collide across stores, state elections are rendered as known, and the print surface drops verification evidence. **Watch for:** **confirmed** disclosure of out-of-range PII, **confirmed** wrong-image substitution when document IDs overlap, and **confirmed** policy/pathway claims that can contradict the user's state or tracking screen.

**Verdict**: NEEDS_CHANGES

## High-level view

`evaluateMonth` puts hour and income arithmetic behind one entry point, including education conversion and seasonal history. **Confirmed:** the HTML package then ignores the stored monthly pathway, infers one from record presence, and omits the stored assessment result, so its framing can disagree with both the tracking screen and the wave's stated contents.

The route always injects `FEDERAL_DEFAULT`. **Confirmed:** state-elected seasonal methodology and documentation timing are printed as resolved state policy without the federal-floor hedge, while the documentation-gap sentence separately reverses the regulation's may/must transition.

**Confirmed:** month selection scopes summary rows but not the evidence graph. Every document and exclusion enters the package, every blob is loaded before confirmation or range selection, and the UI owns those direct Dexie reads rather than a scoped storage API.

**Confirmed:** attachment references assume IDs are globally unique even though activity/exclusion and income documents have independent auto-increment stores. Overlapping IDs overwrite the URL map and can print one image under two manifest entries.

**Confirmed:** the renderer drops school status/credits, community-service verification fields, and work sub-kind; it also lacks the required signature/date and empty-manifest states. Exclusion documents remain storage-only, exclusion-only evidence cannot open the package, and screening archive can orphan the new dependents.

**Confirmed:** all existing gates pass, but none of the 74 Playwright cases visits `/export/package`. Real blobs, warning/range behavior, print output, and the phone layout remain uncovered in the only suite capable of exercising them.

<details>
<summary>Issues (8)</summary>

1. **State policy presented as known** (**confirmed**) — the route always uses `FEDERAL_DEFAULT`, and the documentation copy says “may from” the hardening date instead of “may now, must from the date.” Resolve state policy or show the federal-floor uncertainty, then correct the may/must wording and unavailable-document safeguard.
2. **Range does not scope the evidence loader** (**confirmed**) — the package includes out-of-range documents/exclusions and eagerly creates URLs for every blob through direct component-to-Dexie reads. Move loading behind a storage API that accepts the selected months and fetches only retained attachments.
3. **Cross-store attachment ID collision** (**confirmed**) — independent document tables both emit `DOC-<id>` into one numeric URL map, so overlapping IDs can substitute the wrong image. Namespace references by store/evidence kind and test equal numeric IDs with real blob bytes.
4. **Monthly pathway can contradict tracking** (**confirmed**) — the package infers hours/income from record presence instead of using the stored monthly mode and renders only one comparison. Pass the stored mode or show both neutral comparisons without combining them into a verdict.
5. **Required agency-facing content is missing** (**confirmed**) — corrected activity fields, `assessmentResults`, signature/date, and the no-documents manifest state do not reach the print view. Add a shared detail projection and rendered assertions for every required section.
6. **Exclusion documents are not end-to-end** (**confirmed**) — no production caller saves them, exclusion-only records are treated as empty, and `archiveScreening` can leave attached rows/blobs pointing at a deleted screening. Wire capture/export and define a transactional archive/delete policy.
7. **Missing seasonal data is asserted as zero** (**confirmed**) — both artifacts print “No record (counts as $0 until added).” Keep “No record,” label the average incomplete/provisional, and tell the user to add or verify the missing month.
8. **New route has no browser coverage** (**confirmed**) — the passing e2e suite omits `/export/package`. Add it to route/hydration checks and cover warning → confirm, range scoping, overlapping IDs, real attachments, print, and 375px behavior.

</details>

<details>
<summary>Details</summary>

## Canonical arithmetic loses pathway context at the package boundary

`evaluateMonth` centralizes the existing hour and income evaluators without building W7b's deferred combination engine. Its tests pin education conversion and the preceding-six-month seasonal average, while the renderers consume neutral totals, thresholds, and differences.

**Confirmed — pathway mismatch:** `buildEvidencePackage` does not accept `complianceModes`; it selects income only when income exists and activities do not. `EvidencePackageView` then renders one branch, with seasonal income taking precedence and otherwise `m.mode` selecting hours or income. A user who selected income and also logged an activity receives an hours comparison, unlike the text report and tracking UI. Pass the stored per-month mode, or render both comparisons when both evidence types exist without collapsing them into a verdict.

**Confirmed — assessment omission:** the W8a scope says gap 8.7 includes `assessmentResults` and that the package carries the apparent pathway with its citation, but the route never reads that table and the package model has no assessment field. Exclusion screenings do not replace hour, income, seasonal-income, or exclusion pathway guidance. Add a neutral assessment projection or stop claiming that portion of 8.7 is closed.

## Federal fallback is rendered as a resolved state election

**Confirmed — unresolved policy:** both export routes pass `FEDERAL_DEFAULT` to `evaluateMonth`, and the package route passes it again to the builder despite holding the user's state. That profile describes itself as “Federal minimum (no state data)” and marks state elections as assumptions. The artifact nevertheless states the preceding-average seasonal method and `documentationRequiredFrom` as the user's state behavior. Resolve the applicable policy before assembly; when unavailable, carry and render profile confidence rather than converting a statutory fallback into a state fact.

**Confirmed — may/must inversion:** before hardening, the package says, “Your state may require them from [date].” A state may require documentation before that date; from its hardening date it must require documentation whenever reasonably available. Rewrite the sentence as the two-sided rule and state that other information must be accepted when documentation is not reasonably available.

## Selected months do not constrain the evidence graph

**Confirmed — out-of-range disclosure:** `sortedMonths` scopes activity/income summary rows, but the manifest loops over every supplied document and the exclusion projection loops over every screening. Because the page supplies full-table reads, a two-month package can print unrelated-month attachments and exclusions while its cover names only the selected months. Filter the complete graph before manifest construction and explicitly define how exclusion evidence relates to the chosen period.

**Confirmed — eager loading and storage-boundary bypass:** the route reads seven record tables and both blob stores through `db`, then creates object URLs for every document before the PII confirmation or range choice. Narrowing the package does not reduce initial I/O or phone memory, and data loading, decryption, scoping, casts, and URL lifetime are coordinated inside the UI effect. A storage-layer package loader should accept profile/range scope and return only retained metadata and blobs after confirmation.

## Independent stores can bind a manifest row to the wrong image

**Confirmed:** `documentReference` returns `DOC-${doc.id}` for ordinary and income documents, although those IDs come from separate auto-increment sequences. The route also writes both into `Record<number, string>` as `urls[doc.id]`. If both stores contain row `1`, the second URL overwrites the first, React receives duplicate manifest keys, and both lookups resolve to one image. Use a typed composite reference such as evidence-kind plus row ID throughout the model, URL map, and renderer; test the collision with real blob bytes.

## Agency verification fields and required print sections are absent

**Confirmed — lost activity evidence:** HTML rows include date, type, non-education hours, and at most one organization name. They omit school-determined enrollment status, credit/non-credit detail, and program type, leaving an at-least-half-time row as only “Education.” Community-service rows omit organization address, activity description, court-order status, and contact name/phone/email; work rows omit `workKind`. Build one agency-facing detail projection shared by text and HTML so W6a's corrected shape cannot drift again.

**Confirmed — missing sections:** no signature/date line exists in the route, builder, or renderer. `pkg.manifest.length > 0` suppresses the manifest entirely when no documents exist, and no assessment result is carried. Add the plain signature/date fields, an honest no-documents manifest state, and the neutral assessment section; assert the rendered positives and absence of attestation language.

## Exclusion-document support stops at storage and leaves an archive hole

**Confirmed — no user path:** `saveExclusionDocument` is referenced only by storage tests. The route also enters `empty` whenever activities and income are absent, even when screenings or exclusion documents exist. A user with only a VA letter, SNAP/TANF notice, or other exclusion evidence cannot attach it or build the promised package. Wire capture to a known screening ID and allow screening evidence into the warning/ready flow.

**Confirmed — orphaning archive:** only `deleteExclusionScreeningWithDocuments` handles the new dependents. Existing `archiveScreening` writes a reduced history row and directly deletes the screening without deleting or relinking attached documents. Define whether archived evidence is retained or deleted, implement the decision transactionally, and test both archive and delete paths.

## Agency-facing copy converts unknown seasonal income to zero

**Confirmed:** text and HTML render an unrecorded history month as “No record (counts as $0 until added).” Missing data is not evidence of zero income. If provisional arithmetic uses zero, label the computed average incomplete and name the action—add or verify the missing month—instead of presenting zero as a fact to the agency. This avoids understating the household-income pathway and creating a false shortfall.

## The passing browser suite never opens the new route

**Confirmed:** the target changes no `e2e/` file, and the successful route arrays include `/export` but not `/export/package`. Vitest proves selected props contain no banned verdict phrase, but jsdom cannot verify IndexedDB Blob bytes, object-URL joins, route hydration, print CSS, or 375px layout. Add the route to generic checks and focused Playwright coverage for confirmation, scoping, duplicate numeric IDs, attachments, and print/phone behavior; keep fax legibility as the documented manual check.

Validation against the workspace completed successfully: `npx tsc --noEmit`; `npm run lint` with the expected three pre-existing warnings and zero errors; `npm run format:check`; `git diff --check`; `npm test` with 770 passing; and `npm run test:e2e` with 74 passing, including a build. Three reviewed files acquired concurrent uncommitted citation/fallback edits outside `917bcd1..HEAD` during review; they do not resolve these findings, but the gate run was therefore not a pristine checkout of committed `HEAD`.

</details>

<details>
<summary>File map</summary>

- `docs/hr1-readiness/README.md` — marks W8a in progress and points to its split wave.
- `docs/hr1-readiness/waves/wave-8a-print-evidence-export.md` — defines scope, legal anchors, acceptance criteria, and the deferred JSON repair.
- `src/__tests__/no-verdict.render.test.tsx` — adds PII-warning and package render coverage.
- `src/app/export/package/page.tsx` — loads evidence/blobs, gates preview, applies ranges, and invokes print.
- `src/app/export/page.tsx` — links the package and routes text export through month evaluation.
- `src/components/export/EvidencePackageView.tsx` — renders cover, monthly facts, manifest, and images.
- `src/components/export/PiiWarning.tsx` — warns about identity and document PII.
- `src/hooks/useActivityDocumentCounts.ts` — tolerates documents without activity IDs.
- `src/lib/__tests__/evaluateMonth.test.ts` — tests canonical hours, policy thresholds, income, and seasonal history.
- `src/lib/__tests__/policyInjection.test.ts` — extends policy-literal ownership checks.
- `src/lib/evaluateMonth.ts` — wraps hour and income evaluation behind one async entry point.
- `src/lib/export/__tests__/buildEvidencePackage.test.ts` — tests identity, month facts, basic manifests, exclusions, and copy guards.
- `src/lib/export/__tests__/buildTextReport.test.ts` — tests evaluated education and seasonal output.
- `src/lib/export/buildEvidencePackage.ts` — shapes records into the print model.
- `src/lib/export/buildTextReport.ts` — consumes evaluated totals and renders seasonal history.
- `src/lib/storage/__tests__/exclusionDocuments.test.ts` — tests persistence, delete cascade, and orphan cleanup.
- `src/lib/storage/activities.ts` — excludes screening documents from activity-orphan cleanup.
- `src/lib/storage/documents.ts` — supports activity/screening links and screening queries/deletes.
- `src/lib/storage/exemptions.ts` — adds cascading screening deletion.
- `src/types/documents.ts` — makes `activityId` optional and adds `exemptionId`.

Full diff: `git diff 917bcd1..HEAD`

</details>
