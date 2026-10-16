# W8a: print-ready evidence package, single evaluation path, exclusion documents

Four commits deliver the last pre-date wave: a new `/export/package` print route that assembles a fax-survivable record a user hands to their state, a new `evaluateMonth` module that both export paths call so the artifact can no longer compute a different total than the dashboard (gap 8.9), and an `exemptionId` link on `Document` so exclusion evidence has somewhere to live (gap 8.5). The shape is right — assembly is a pure function, rendering is a thin component, the async income read stays in the page, and both new components joined `no-verdict.render.test.tsx` in the commit that created them. Gates are green locally: `tsc` clean, 770 tests pass, lint 0 errors / 3 pre-existing warnings, `format:check` clean, build emits the new route.

**Watch for:** attachment references are `DOC-<document.id>` drawn from two independently auto-incrementing tables, so an activity document and an income document with the same id collide — the agency artifact renders one image twice and drops the other (confirmed). The package view's branch order makes seasonal status suppress the hours comparison entirely, so a seasonal worker who logged 90 hours hands in a record that never states them (confirmed). Gap 8.5 is closed at the storage and export layers only: nothing in the app writes `db.exemptions` and nothing calls `saveExclusionDocument`, so the feature cannot be exercised end to end (confirmed). And gap 8.9's third clause — "renders only one mode per month" — is reproduced in the new surface rather than closed (confirmed).

**Verdict**: NEEDS_CHANGES

## High-level view

`evaluateMonth` does what ADR-0006 asked for and no more: one call site over the two existing evaluators, facts only, no hoisted `isCompliant`, with a test that fails if a verdict field ever appears on its surface. The soft spot is the way back — `buildTextReport` keeps its old `reduce` as a fallback and the export page only builds evaluations `if (profile)`, so a records-without-profile database still prints the divergent total.

The package's rendering contract is where correctness slips. `buildEvidencePackage` computes both an hours comparison and an income comparison for every month, but the view renders exactly one: seasonal first, then a `mode` heuristic derived from where the records happen to sit rather than from the user's recorded `complianceMode`. A month holding both hours and income prints no income comparison; a seasonal month prints no hours comparison at all. The text export, which does read `complianceModes`, can name a different mode than the package for the same month.

Attachments carry a correctness bug. References are minted as `DOC-<id>` across three sources, two of which are separate Dexie tables with independent primary keys, and the page's `attachmentUrls` map is keyed by that same id — so two documents sharing an id share a reference, a React key, and a URL slot.

Exclusion documentation is well-built underneath and unreachable above. No UI attaches a document, and `db.exemptions` has no writer anywhere in the app, so the package's exclusion section is always empty in production. The new cascade also has a sibling that was not updated: `archiveScreening` deletes the screening row directly, and because orphan cleanup now deliberately skips exclusion documents, anything an archive leaves behind is unreclaimable.

Print behavior is plausible and unverified. The `@page` and `break-inside` rules do survive emotion's nesting, but the new route is absent from the e2e route list that exists precisely because hydration failures were invisible to Vitest, and no committed test exercises print emulation despite an acceptance criterion claiming DOM assertions under it.

Two copy obligations are unmet on the one artifact a caseworker reads: the documentation-gap flag tells a user documents are required without stating § 435.557(b)(2)(iii)'s protection that the state must accept other information and may not deny solely for documentation that does not exist, and the household-income caveat hedges without naming a next action.

<details>
<summary>Issues (15)</summary>

1. **Attachment reference collision** — `DOC-<id>` is minted from `documents` and `incomeDocuments`, two tables with independent auto-increment, so equal ids produce one reference, one React key and one `attachmentUrls` slot; the later loop wins and the agency gets a duplicated image and a missing one. Namespace the reference (`ACT-`/`INC-`/`EXC-`) and key the URL map by the namespaced reference.
2. **Seasonal status hides the hours comparison** — `EvidencePackageView`'s ternary tests `isSeasonalWorker` before `mode`, so a seasonal worker's logged hours never reach the printed comparison even though `m.hours` holds them. Render both comparisons, or treat seasonal as a modifier of the income block only.
3. **One mode per month, reproduced in the new surface** — gap 8.9's third clause is carried forward: a month with both hours and income prints only hours. Show both comparisons (the builder already computes them) and keep the "tracked under" label as a note.
4. **Package mode ignores `complianceModes`** — `buildEvidencePackage` derives mode from record presence while `buildTextReport` reads the stored mode, so the two exports can disagree for the same month. Pass `complianceModes` into the package builder.
5. **Builder comment contradicts the view** — `buildEvidencePackage` says "the package shows both comparisons when present"; it does not. Fix whichever one is wrong, together with issue 2.
6. **Gap 8.5 has no capture surface and no parent writer** — `saveExclusionDocument` has no caller outside tests and nothing in the app writes `db.exemptions`, so exclusion documents cannot be created or exported in production. Either ship the attach UI or re-scope the gap row to "storage + export only, capture pending W4".
7. **`archiveScreening` does not cascade** — it deletes the screening row while leaving `exemptionId` documents and blobs behind, and `cleanupOrphanedDocuments` now explicitly skips those, making them permanently unreclaimable. Route it through `deleteDocumentsByExemption` or archive the documents with the screening.
8. **Every blob is loaded before consent and regardless of range** — the mount effect object-URLs every document in the database before the PII warning renders and whatever range is later chosen; the wave's promised size-threshold warning and lazy per-month reads are not implemented. Load blobs for the selected months, after confirm.
9. **Object-URL race in the load effect** — the teardown revokes the array as it stands at that moment, so URLs created by an in-flight `load()` afterwards are never revoked and a second pass can overwrite state. Add a cancelled flag and revoke anything created past cancellation.
10. **`6 months` hardcoded in copy** — both the text report and the package view write the seasonal window as a literal while `policy.seasonalMethod.months` exists, and the literal scan's pattern cannot see a bare `6`. Interpolate from the profile.
11. **Missing § 435.557(b)(2)(iii) protection** — the documentation-gap flag says documents are required without the counterpart that the state must accept other information when none is reasonably available and may not deny solely for its absence; family caregiving is the case that needs it. Add it to both branches of the flag.
12. **Hedge with no next action** — "your state counts your whole tax household here, so its figure may be higher than this one" ends without telling the user to ask the agency what it has on file. Add the action, per `compliance-copy-standards.md`.
13. **New print route has no browser coverage** — `/export/package` is not in `e2e/console-clean.spec.ts`'s route list and no committed test exercises print emulation, despite an acceptance criterion claiming per-page self-ID is "asserted in the DOM". Add the route to the console/hydration spec and one print-emulation assertion.
14. **Global chrome is not print-suppressed** — `OfflineIndicator` (`position: fixed`) and `StorageWarning` render from the root layout with no `@media print` rule, so an offline or low-storage banner can land on the faxed artifact. Add print suppression to both.
15. **Type hygiene around income documents** — `allIncomeDocs as unknown as Document[]` plus a defensive `incomeEntryIdOf` cast, and `attachmentUrls`' doc comment claims blobId keying while the code keys by document id. Prefer a discriminated union for manifest input and fix the comments.

</details>

<details>
<summary>Details</summary>

### The one way back to the old hours total

The divergence gap 8.9 names is pinned from both ends — `evaluateMonth.test.ts` asserts a less-than-half-time education row with `hours: 99` and 6 credit hours evaluates to 77.94, and `buildTextReport.test.ts` asserts the report prints `Logged: 77.94 hours` and not `Logged: 99 hours`. But the old arithmetic is still reachable:

```ts
const totalHours =
  evaluation?.hours.totalHours ??
  monthActivities.reduce((sum, a) => sum + a.hours, 0);
```

and the export page populates evaluations only inside `if (profile)`. A database with activities but no profile row therefore takes the divergent branch and prints the raw sum. The module comment says "never the shipped path"; the guard makes that conditional on profile existence rather than unconditional. Either drop the fallback and require evaluations, or make the no-profile case refuse to export rather than silently export the old numbers.

### Attachment references collide across two tables

`documentReference` is `DOC-${doc.id ?? "new"}`, and the manifest is built from three sources in sequence:

```
documents          (table: documents,       ++id)  → DOC-1, DOC-2 …
incomeDocuments    (table: incomeDocuments, ++id)  → DOC-1, DOC-2 …
exclusionDocuments (table: documents, same keyspace as the first)
```

The first two draw from separate Dexie primary-key sequences, so both legitimately contain id `1`. Three things break at once. The manifest renders two `<li key="DOC-1">`. The attachments section renders two blocks for `DOC-1`, both resolving through `resolveUrlForReference` to `urls[1]`. And the page's map is a single `Record<number, string>` filled by three sequential loops, so the income document's URL overwrites the activity document's:

```ts
urls[doc.id] = url;   // activityDocs loop
urls[doc.id] = url;   // exclusionDocs loop
urls[doc.id] = url;   // incomeDocs loop — last writer wins
```

The output is an evidence package where one image appears twice under two different manifest descriptions and another document is silently replaced by it. For the artifact whose purpose is matching documents to claims, that is the most consequential bug in the diff. A namespaced reference fixes reference, key, and lookup together — `resolveUrlForReference` already exists to host the convention.

### What the package prints, and what it withholds

`buildEvidencePackage` fills in both comparisons per month. The view then chooses one:

```tsx
{m.income.isSeasonalWorker ? ( /* seasonal income */ )
  : m.mode === "income"    ? ( /* income */ )
  :                          ( /* hours */ )}
```

A seasonal worker's hours comparison is unreachable: activity detail lines still print, so the record lists the activities but never states the hours total or the threshold they are measured against. And because `mode` is `monthIncome.length > 0 && monthActivities.length === 0 ? "income" : "hours"`, a month with both kinds of record prints no income comparison — which matters most for the user the domain rules single out, the one who may already satisfy the income pathway and does not need to chase hours.

Gap 8.9's text is three clauses: re-hardcoded thresholds, skipped seasonal averaging, and "renders only one mode per month". The first two are fixed. The third is carried into the new surface, so the row cannot be struck as closed on the strength of this diff.

The mode derivation is also a second source of truth. `buildTextReport` reads the stored `ComplianceMode` row; `buildEvidencePackage` takes no `complianceModes` input and guesses from record presence. A user who recorded July as income but also logged a few volunteer hours gets "Recorded as: Income" in the text report and the hours comparison in the package.

### Exclusion documents: no way in, and one uncascaded delete

The storage layer is the cleanest part of the diff — `saveDocumentRow` factors the quota guard and the atomic blob+metadata transaction so the two link types cannot drift, and the test pinning that `cleanupOrphanedDocuments` leaves exclusion documents alone is the sharpest in the wave (`activityId === undefined` reads as "not in the activity set", so without the guard the routine would have deleted evidence a screening still pointed at).

Above that layer the feature does not exist. `grep` across `src` finds no caller of `saveExclusionDocument` outside its test, and no writer of `db.exemptions` anywhere in the app — `settings/page.tsx` reads screenings that nothing creates. `pkg.exclusions` is therefore structurally empty in production, and the acceptance criterion "exclusion responses can carry documents, and they appear in the package" is satisfied by fixtures writing the table directly. Worth saying plainly in the wave file rather than closing row 8.5, since W4 owns the screening rebuild that would supply the capture surface.

The cascade has an unrepaired sibling. `deleteExclusionScreeningWithDocuments` is new, correct, and also has no caller; `archiveScreening` is what the app actually uses when a user re-screens, and it does `db.exemptions.delete(screeningId)` with no document handling. Combined with the new orphan-cleanup skip, documents left behind by an archive are invisible to the UI and unreachable by every reclamation path. `data-migration-standards.md` asks that every reader of a changed field be found; the deleters need the same sweep.

### Blob lifecycle and the consent ordering

The mount effect loads every document in the database and creates an object URL for each, then sets the stage to `warning` so the PII notice renders. The full set of document images is therefore decoded into memory before the user has agreed to produce a package, and regardless of the month range they later choose. The wave file's own mitigation for the memory risk — "warn above a size threshold; allow narrowing the period. Blobs read lazily per month where possible" — is in neither half.

The teardown also leaks narrowly. `revoked` is captured per effect run and revoked as it stands at teardown; an `await`-suspended `load()` that resumes afterwards keeps pushing URLs nobody will revoke, and its `setState` calls can overwrite a later run's.

Range selection has an ordering wrinkle: the From/To fields only render in the `ready` stage, reached by assembling the default every-recorded-month package first. The acceptance criterion asks for selection "from W5's `ReviewPeriod`" or an arbitrary range; the arbitrary range is here, the review-period option is not, and the first package is always the widest one.

### Print fidelity: the CSS holds, the verification does not

I checked the nested-at-rule concern rather than assuming it: emotion serializes the `sx` block and stylis hoists it to `@media print{@page{margin:0.75in;}.css-h .pkg-month{break-inside:avoid;}}`, so both rules apply. Colour-only cues are avoided — the gap flag, the manifest, and the seasonal "No record" marker all carry text.

What is not verified is anything a browser would report. `/export/package` is missing from `e2e/console-clean.spec.ts`'s route list, the suite that exists because a hydration failure shipped to production invisible to 423 Vitest tests and to `npm run dev`. The acceptance criterion claims per-page self-identification is "asserted in the DOM" under print emulation; what is committed is a jsdom assertion that the rendered text contains the name and `Medicaid ID OH-12345` — useful, but neither print emulation nor the browser.

Root-layout chrome is the related gap: `OfflineIndicator` renders `position: fixed` and `StorageWarning` renders an `Alert`, neither with a print rule, so an offline or low-storage banner can print on top of the record. The page hides its own controls with `"@media print": { display: "none" }`; the same treatment is missing one level up.

### Copy on the agency-facing artifact

Verdict discipline holds, and the legend cites the `§ 435.557(a)-(b)` pair the standards ask for. Two obligations are unmet. The documentation-gap flag states only the requirement — "your state now requires supporting documents for this month when they are reasonably available" — and nowhere does the package say the state must accept other information when documentation is not reasonably available and may not deny solely because it does not exist. For family caregiving, the case CMS names as typically undocumentable, that omission reads as a wall. And the household-income line tells the user the state's figure may be higher without naming the next action, which `compliance-copy-standards.md` treats as an unfinished hedge.

Smaller items on the same artifact: `documentationRequiredFrom` prints as the raw `2028-01-01` where every other date goes through `format`, `coverageMonths` prints raw `2026-07, 2026-06` keys while month blocks use "July 2026", and the exclusion section formats its date with `toLocaleDateString("en-US")` rather than `date-fns`.

### Test coverage

The Tier-1 work is covered as the wave promised: `evaluateMonth` has TDD-first tests with CFR citations and FR pages in the names (summary equality, the education conversion, threshold injection, actual-amounts income, the seasonal window excluding the assessed month, absence of verdict fields); `buildEvidencePackage` covers cover facts, modalities, Logged/Threshold/Difference, manifest linkage, the 2028 boundary from both sides, and a serialized verdict scan; `exclusionDocuments.test.ts` covers round-trip, isolation, `db.verno === 6`, the cascade, the partial-failure path, and the orphan guard with its positive twin.

Not tested: the `DOC-` reference collision across tables (no test builds a package from both document tables with overlapping ids); the view's mode and seasonal branch selection (nothing asserts which comparison renders for a month that has both, or for a seasonal month with hours); `archiveScreening` with exclusion documents attached; the package page itself — object-URL lifecycle, range application, and the stage machine have no coverage at any tier; print emulation and hydration for the new route.

### Bookkeeping still open

Named so it is not mistaken for done: `CHANGELOG.md` has no W8a entry, `gap-analysis.md` has no closure lines for 8.1/8.3/8.5/8.7/8.8/8.9 and the running total is unchanged, and `npm ci` is on the definition of done but I did not run it. The decision to leave the JSON path's ciphertext and missing document tables to W8b is recorded explicitly in the wave file with the owner and date, so it reads as a decision rather than an oversight.

</details>

<details>
<summary>Files changed</summary>

| File | Change |
|---|---|
| `src/lib/evaluateMonth.ts` | New: the single evaluation path, wrapping both evaluators, returning facts with no hoisted verdict |
| `src/lib/__tests__/evaluateMonth.test.ts` | New: TDD-first coverage with CFR + FR citations in test names |
| `src/lib/export/buildEvidencePackage.ts` | New: pure assembly of cover, per-month facts, manifest, exclusions, legend, modalities |
| `src/lib/export/__tests__/buildEvidencePackage.test.ts` | New: cover, manifest, exclusions, 2028 escalation, verdict scan |
| `src/lib/export/buildTextReport.ts` | Reads the evaluation instead of its own `reduce`; adds the seasonal block and fractional-hours formatting |
| `src/lib/export/__tests__/buildTextReport.test.ts` | New W8a block: derived hours total, difference, seasonal average, no verdict |
| `src/components/export/EvidencePackageView.tsx` | New: the print surface — cover, legend, per-month blocks, manifest, attachments |
| `src/components/export/PiiWarning.tsx` | New: pre-production warning naming the PII the package carries |
| `src/app/export/package/page.tsx` | New route: loads records, decrypts via `getProfile`, resolves blobs, runs `evaluateMonth`, drives `window.print()` |
| `src/app/export/page.tsx` | Builds evaluations before `buildTextReport`; adds the Evidence Package entry point |
| `src/lib/storage/documents.ts` | Factors the atomic write; adds `saveExclusionDocument`, `getDocumentsByExemption`, `deleteDocumentsByExemption` |
| `src/lib/storage/exemptions.ts` | Adds `deleteExclusionScreeningWithDocuments` (no production caller yet) |
| `src/lib/storage/activities.ts` | Orphan cleanup now skips exclusion documents |
| `src/lib/storage/__tests__/exclusionDocuments.test.ts` | New: round-trip, isolation, v6 invariant, cascade, orphan-cleanup guard |
| `src/types/documents.ts` | `activityId` optional, `exemptionId` added — unindexed, no version bump |
| `src/hooks/useActivityDocumentCounts.ts` | Guards the now-optional `activityId` |
| `src/__tests__/no-verdict.render.test.tsx` | Adds both new components, over and under threshold |
| `src/lib/__tests__/policyInjection.test.ts` | Adds `evaluateMonth.ts` and `buildEvidencePackage.ts` to the Tier-1 scan |
| `docs/hr1-readiness/waves/wave-8a-print-evidence-export.md` | New wave file, re-verified against the tree at `917bcd1` |
| `docs/hr1-readiness/README.md` | Marks W8a in progress |

Full diff: `git diff 917bcd1..HEAD`

</details>
