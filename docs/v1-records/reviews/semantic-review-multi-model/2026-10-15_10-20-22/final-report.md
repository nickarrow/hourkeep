# Final consolidated issues report — W6a evidence capture: education cliff, work-program pathway, and community-service record land at capture but not at read (HEAD diff against 423fc11~1 — wave W6a evidence capture (42 CFR 435.552 activity model): new src/lib/education.ts (credit-hour conversion + half-time cliff), workProgram activity type across 11 readers, work sub-kinds, community-service record schema, education enrollment status in ActivityForm.tsx (930+ line form), new educationCreditHourConversion policy field, VA/SNAP-TANF document types. Review for design-level concerns organized by concern not file.)

Issues are sorted from highest to lowest combined importance/confidence.

---

## 1. At-least-half-time enrollment renders as an 80-hour shortfall

**Severity: High** · *(cluster: education status has no reader — see also #12, #14, #18)*

- **User impact:** A student enrolled at least half-time — who under § 435.552(c) qualifies on zero hours and may not combine — saves the entry and is then shown "⚠ 80 hours needed", "Total Hours 0 / 80", and "Keep logging". This is the exact ADR-0003 false negative the wave file names as its highest-harm risk: it sends a user who is already demonstrating compliance looking for 80 hours of volunteering they do not need.
- **Issue:** `ActivityForm.tsx` collapses the three-way `educationContribution` result into a single `Activity.hours` number (writing `0` for at-least-half-time), and `calculateMonthlySummary` in `src/lib/calculations.ts` sums `activity.hours` for education rows without ever reading `enrollmentStatus`. `MonthlySummary` carries no standalone-enrollment signal, so `Dashboard.tsx` (`hoursNeeded` under a `WarningIcon`, the progress bar) and `recommendationEngine` (`complianceStatus: "needs-increase"`) have no way to distinguish half-time enrollment from an empty month. The wave's own risk register specifies the mitigation — a distinct "this may be enough on its own — your state decides" panel plus an hours total labelled as *combinable* activities only — and that copy exists only inside `ActivityForm`, visible at the moment of entry and never again. The decision record checked that `MonthlySummary.isCompliant` has no production reader, which was correct but incomplete: `hoursNeeded` and `totalHours` do.
- **Recommendation:** Carry enrollment status into the monthly aggregation result and make every consumer of `hoursNeeded`/`totalHours` status-aware before this ships. Surface a standalone-enrollment panel on the dashboard that states the pathway and defers the determination to the state, rather than reducing a number. Resolve education rows from their stored source facts at read time so the cliff survives the capture boundary.

## 2. Less-than-half-time non-credit students cannot save an entry at all

**Severity: High**

- **User impact:** A GED student or a non-credit CTE student enrolled less than half-time is blocked from recording anything. Validation demands credit hours they do not have, and the error text ("Enter your credit hours, or switch to hours below") points at a field the form does not render in that branch.
- **Issue:** `ActivityForm.tsx` treats every less-than-half-time education row as credit-based (`isCreditBasedEducation`), which requires `creditHours > 0` and hides the ordinary hours field — that field renders only when `!isHalfTimeStandalone && !isCreditBasedEducation`. The credit-hours helper text says "Non-credit program? Use the hours field below instead", and there is no field below. The `nonCreditHours` path in `src/lib/education.ts` implements § 435.552(d)(2) counting at 1:1 and is covered by tests, but is unreachable from the product.
- **Recommendation:** Add an explicit credit-based / non-credit basis choice in the education branch. Require credit hours only on the credit path, and expose actual class and activity hours on the non-credit path. Drive both branches in a render test, and fix or remove the helper text that points at a non-existent control.

## 3. A monthly credit-hour conversion is written once per selected date

**Severity: High** · *(cluster: monthly figure stored on a daily row — see also #9, #13)*

- **User impact:** Over-counting in the harmful direction — the user is told they have cleared a threshold they have not. Six credit hours entered once with three dates selected stores 77.94 three times, reporting 233.82 education hours for a month in which § 435.552(d) credits 77.94.
- **Issue:** `resolvedHours()` in `ActivityForm.tsx` returns a *monthly* figure, and the create path loops `for (const dateStr of datesToCreate)` writing that full result to each dated row. "Add Another Date" is not gated by activity type. The generic duplicate path can multiply it again. These rows also contradict the `Activity.hours` model comment, which documents a 0–24 range. The wave correctly deferred the term-scoped `enrollments` table to W6b, but that deferral does not cover the fact that the credit-hour figure is month-scoped and is being written to daily rows today.
- **Recommendation:** Constrain credit-based and standalone education to a single month-scoped record and exclude it from multi-date save and generic duplicate behavior, or store the source credits and derive the monthly contribution during aggregation.

## 4. The exported report omits the entire community-service verification record

**Severity: High** · *(cluster: capture without readers — see also #5, #6)*

- **User impact:** A user can enter an organization name, address, activity description, and a confirming point of contact with phone and email, then generate the agency-facing artifact and find none of it there. The export is the thing a caseworker reads to confirm the hours; § 435.557 verification turns on exactly the fields being dropped. Credit-based education loses its source credits and arithmetic, and half-time education exports as a zero-hour row with no status.
- **Issue:** `src/lib/export/buildTextReport.ts` emits only date, type label, `activity.hours`, and the legacy `activity.organization`. Its only change in this diff is the label lookup. It never reads `communityService`, `workKind`, `enrollmentStatus`, `educationProgramType`, or `creditHours`. The wave's own acceptance criterion — the exported community-service block contains a point-of-contact line — is contradicted by the diff rather than merely unmet.
- **Recommendation:** Render the structured record in the export: organization name and address, activity type, dates, hours, and the POC with phone and/or email. Add work sub-kind, and for education render status, program type, and the source credits with the § 435.552(d) formula shown. Distinguish standalone enrollment from zero education hours rather than printing "0 hours".

## 5. Community-service organization name regressed out of four surfaces

**Severity: High** · *(cluster: capture without readers — see also #4, #6)*

- **User impact:** This is a regression, not an omission. Before this change a volunteer entry displayed "Food Bank" in the activity list and in the export. Now it displays nothing in either, nor in the date menu or the duplicate dialog — the user appears to have lost data they entered.
- **Issue:** `ActivityForm.tsx` gates the generic organization field behind `type !== "volunteer"`, so new volunteer rows have `organization === undefined`. The name now lives in `communityService.organizationName`, which has no reader. The four existing consumers of `activity.organization` — `ActivityList`, `DateActivityMenu`, `DuplicateActivityDialog`, `buildTextReport` — all print empty.
- **Recommendation:** Teach those four readers the new shape, falling back to `organization` for pre-W6a rows, or keep populating `organization` from `communityService.organizationName` on write. Cover the list and export rendering with a test so the regression cannot recur silently.

## 6. Every field the wave adds is write-only

**Severity: High** · *(cluster: capture without readers — see also #4, #5)*

- **User impact:** The user is asked for the evidence the wave exists to collect and gets nothing back from it: no confirmation in the list, nothing in the export, no effect on the summary. Effort without visible return is also the condition under which people stop logging.
- **Issue:** `enrollmentStatus`, `workKind`, `creditHours`, `educationProgramType`, and `communityService` each have exactly one consumer, and that consumer is `ActivityForm.tsx`, the component that wrote them. The round-trip test proves Dexie persists them; nothing proves anyone can read them back. By contrast, `workProgram` is the finished part of this wave — union member, `calculations.ts` branch, shared label map, Dashboard chip, round-trip test, and all three previously-silent readers handled.
- **Recommendation:** Treat "has at least one reader outside the form" as the completion bar for each new field, and wire the export first since it is the evidence artifact. Where a field is intentionally deferred to W6b, say so in the wave file rather than leaving it to look finished.

## 7. The on-screen conversion formula hardcodes the policy constants

**Severity: Medium**

- **User impact:** The displayed arithmetic can contradict its own answer. A state or federal profile with different conversion factors would still render "× 3 × 4.33" beside a result computed from the profile, so the Computed number the user is invited to check would not reconcile with the formula shown.
- **Issue:** `ActivityForm.tsx` renders the operands as literal JSX while calling `educationContribution` without passing a policy, so the result comes from `FEDERAL_DEFAULT` and the operands come from the source text. `compliance-copy-standards.md` prohibits policy literals in strings. The guard that would have caught this does not reach here: `src/lib/__tests__/policyInjection.test.ts` omits `ActivityForm.tsx` from `COPY_AND_UI`, and `scripts/compliance-gate.sh` scans only `src/lib/`.
- **Recommendation:** Interpolate both operands from the same injected profile used for the calculation, add `ActivityForm.tsx` to the `COPY_AND_UI` scan list, and add a test that mutates the profile and asserts the rendered formula and the rendered result move together.

## 8. No test exercises any new form branch, and the form is outside the no-verdict guard

**Severity: Medium**

- **User impact:** The defects above are live precisely because nothing observes this code. Roughly 560 new lines of user-facing copy — the surface where a verdict is most likely to slip in — sit outside the project's verdict guard, and four of the wave's own acceptance criteria name render tests that do not exist.
- **Issue:** `ActivityForm.tsx` has no test file and is absent from `src/__tests__/no-verdict.render.test.tsx`; the Playwright spec count is unchanged at 74. Coverage is concentrated on helpers (`education.test.ts` is genuinely strong, including a mutated-profile assertion that distinguishes injection from a literal) and on raw Dexie persistence, bypassing the capture → edit → duplicate → summary → export joins where every confirmed failure lives. The modified characterization test in `calculations.characterization.test.ts` further assumes every education row carrying hours is less than half-time, an invariant the legacy-row decision contradicts.
- **Recommendation:** Add Vitest coverage for the behavioral joins — non-credit capture, unknown-status rows in monthly aggregation, the dashboard after a half-time save, multi-date credit entry, duplication of each new shape, type-changing and field-clearing edits, the new report blocks, and work-program document guidance. Add the form to the no-verdict render guard in the same commit. Reserve Playwright for dialog interaction and the 375px read the risk register asks for.

## 9. The derived monthly figure is persisted instead of the source inputs

**Severity: Medium** · *(cluster: monthly figure stored on a daily row — see also #3, #13)*

- **User impact:** Existing education entries freeze at the conversion factors in force when they were typed. If the policy profile ever changes, old records silently disagree with new ones and with what the state would compute.
- **Issue:** `ActivityForm.tsx` stores both the source `creditHours` and the derived `hours`, and `calculateMonthlySummary` reads only the cached number. The helper is correctly policy-injected and its mutation test proves it, but that injection cannot reach a value already written to disk.
- **Recommendation:** Store source inputs (credits or non-credit hours, plus status) and derive the monthly contribution at aggregation time, so a profile change recomputes history rather than stratifying it.

## 10. Type-changing edits leave evidence from the activity's former life

**Severity: Medium** · *(cluster: no normalization boundary — see also #11)*

- **User impact:** Stale fields can resurface as soon as any reader is added — a work entry carrying a community-service organization and POC, or an education status on a row that is no longer education. Clearing every optional community-service field also fails to clear the stored object, so the user cannot remove information they entered.
- **Issue:** `extraFields()` in `ActivityForm.tsx` only ever adds keys, and the edit path in `tracking/page.tsx` uses a merging `db.activities.update(id, { ...activityData })`. Omitted keys survive. Nothing reads these fields today, which is why nothing visibly breaks; the first reader added inherits the inconsistency. A related side effect: for education rows the form coerces a missing status to `"unknown"` and persists it, so saving an untouched legacy row records an answer the user did not give.
- **Recommendation:** Build one type-aware normalization boundary shared by create, replace, multi-date save, and duplicate. It should explicitly write `undefined` for fields that do not apply to the selected type, and preserve "not asked" as distinct from "answered unknown".

## 11. Duplicating an activity strips every new evidence field

**Severity: Medium** · *(cluster: no normalization boundary — see also #10)*

- **User impact:** A user duplicating last week's volunteer shift silently loses the organization, address, activity description, and confirming contact. A duplicated half-time education row becomes a zero-hour entry with no status; a duplicated credit row keeps derived hours with none of the credits that justify them.
- **Issue:** The duplicate path in `tracking/page.tsx` copies only date, type, hours, and the legacy `organization`. It does not copy `workKind`, `communityService`, `enrollmentStatus`, `educationProgramType`, or `creditHours`.
- **Recommendation:** Route duplication through the same type-aware normalization boundary as create and edit, copying all source evidence for the activity's type.

## 12. `unknown` enrollment status is counted two different ways

**Severity: Medium** · *(cluster: education status has no reader — see also #1, #18)*

- **User impact:** The same row contributes zero in one place and its full typed hours in another, so the answer depends on which surface the user is looking at. The permissive path is the user-unfavorable one to get wrong, because it can report progress that a state would not credit.
- **Issue:** `educationContribution({ status: "unknown" })` in `src/lib/education.ts` returns `combinableHours: 0` and a test pins it. The form takes a different path: `unknown` satisfies the required-status check, neither standalone nor credit-based is true, the hours field renders, `resolvedHours()` returns the typed value, and `calculateMonthlySummary` sums it. Legacy rows never opened in the form are summed as well.
- **Recommendation:** Pick one semantics for `unknown` and apply it at both the module and the aggregation boundary. If unknown rows do contribute hours, surface the "ask your school what status they report" prompt wherever that total appears, since the school determines the status.

## 13. The credit path bypasses the per-day hours validation

**Severity: Medium** · *(cluster: monthly figure stored on a daily row — see also #3, #9)*

- **User impact:** 77.94 hours on a single calendar day is accepted without comment while 25 hours of work on the same day is still rejected. Nothing warns the user that an implausible daily figure was stored.
- **Issue:** The `> 24` error and `> 16` warning in `ActivityForm.tsx` live in the `else` branch that the credit-based education path does not enter.
- **Recommendation:** Stop storing a monthly figure on a daily row (see #3). If a monthly record is retained in the interim, apply a bound appropriate to a monthly figure rather than leaving it unvalidated.

## 14. Switching to at-least-half-time silently discards logged hours

**Severity: Medium** · *(cluster: education status has no reader — see also #1, #12)*

- **User impact:** A user with 40 logged education hours who flips the status to at-least-half-time loses those hours on save with no warning, and recovery is blocked: switching back to less-than-half-time demands credit hours they may not have.
- **Issue:** `resolvedHours()` in `ActivityForm.tsx` returns `0` for at-least-half-time with no confirmation step, and the return path hits the non-credit gap described in #2.
- **Recommendation:** Warn before discarding logged hours and explain why the hours are not needed on that pathway. Fixing #2 restores the way back.

## 15. Work-program document guidance recommends ordinary employment records

**Severity: Medium**

- **User impact:** Someone in WIOA title I, SNAP E&T, an approved state/local program, or a DOL/VA veterans program is told to gather pay stubs, employer timesheets, schedules, invoices, and gig screenshots — none of which establish participation in a qualifying work program under § 435.552(a)(3). The user assembles the wrong evidence for a verification request.
- **Issue:** The new `workProgram` branch in `src/components/help/DocumentVerificationHelp.tsx` falls back to `documentVerificationHelp.workExamples`. The source comment already names the right examples — SNAP E&T approval notices, WIOA enrollment letters — but users see the fallback.
- **Recommendation:** Add dedicated program enrollment and participation examples for the five-item work-program list, and assert the rendered text in a help-component test.

## 16. The new Job Training chip fails the project's non-text contrast floor

**Severity: Medium** · *(cluster: presentation consistency — see also #17)*

- **User impact:** The chip's boundary is hard to perceive for low-vision users, so the activity-type distinction the chip exists to convey is weakened. Measured 2.23:1 against the white paper, against the 3:1 that `component-standards.md` sets for status chips under WCAG 1.4.11; Work is 7.11, Volunteer 3.88, Education 3.86. The label text itself is legible at 9.43.
- **Issue:** The `secondary` palette colour (`rgb(212,165,116)`) is used for the `workProgram` chip in `Dashboard`, `ActivityList`, and `DateActivityMenu`. At 375px the fourth chip also wraps to its own centred row, producing a 3 + 1 layout.
- **Recommendation:** Give the work-program chip a colour that clears 3:1 against the paper, or add a border that does. Re-measure all four after the change and check the 375px wrap.

## 17. The shared-label consolidation stopped short of two consumers

**Severity: Low** · *(cluster: presentation consistency — see also #16)*

- **User impact:** The same activity type reads "Volunteer" on the dashboard and "Community Service" in the list, date menu, duplicate dialog, and export — visible together in one screenshot. A user cannot be sure they are looking at the same category.
- **Issue:** `Dashboard.tsx` still hardcodes `label="Volunteer"` and `color="secondary"`, and `DateActivityMenu.tsx` keeps a local `activityColors` while importing only the labels. `ACTIVITY_TYPE_CHIP_COLORS` therefore has a single consumer, and the duplication `src/lib/activityDisplay.ts` was created to end survives in two places.
- **Recommendation:** Point `Dashboard` and `DateActivityMenu` at `ACTIVITY_TYPE_LABELS` and `ACTIVITY_TYPE_CHIP_COLORS`, and remove the local maps so the exhaustive `Record` is the only source.

## 18. The education comment in `calculations.ts` asserts an invariant the code does not hold

**Severity: Low** · *(cluster: education status has no reader — see also #1, #12)*

- **User impact:** None directly, but the comment is what a future maintainer will trust instead of re-deriving the rule, and it currently licenses the summing behavior that produces #1 and #12.
- **Issue:** The new comment states that only less-than-half-time education carries hours at that point. That is false for `unknown`-status rows and for every education row created before this wave, which were deliberately (and correctly, per `data-migration-standards.md`) left unmigrated.
- **Recommendation:** Either enforce the invariant at the aggregation boundary or rewrite the comment to name the three statuses it can actually receive, including legacy rows with no status.

## 19. `npm run format:check` is red

**Severity: Low**

- **User impact:** None for users; it fails the project's definition of done and will block the next contributor's clean gate run.
- **Issue:** `src/components/ActivityForm.tsx` is not Prettier-clean.
- **Recommendation:** Run `npm run format`, and confirm the full gate list — `tsc --noEmit`, `lint`, `format:check`, `test`, `test:e2e`, `build`, `npm ci` — before the wave closes.

## 20. The raised Node engine floor is advisory locally while the roadmap records it resolved

**Severity: Low**

- **User impact:** None user-facing. The risk is that the condition the change was made to eliminate — a test suite passing on a runtime jsdom declares unsupported — is unchanged on developer machines, so a jsdom-specific failure can still be masked locally and appear only in CI.
- **Issue:** `engines.node` moved to `>=22.22.2` and CI pinned to 22.23.2, but there is no `.npmrc` with `engine-strict=true`. `npm ci --dry-run` on this machine's v22.18.0 exits 0 with an `EBADENGINE` warning, and the 694 tests in this review ran on 22.18.0. `ROADMAP.md` files this under "resolved"; only CI actually changed. The wave file is candid about the gap; the roadmap heading is not.
- **Recommendation:** Add `.npmrc` `engine-strict=true` so local installs enforce the floor, or narrow the roadmap claim to CI and state plainly that local runs remain unenforced.

## 21. The critical `next@16.0.1` advisory is documented and retained

**Severity: Low**

- **User impact:** No deployed exposure — the app is a static export with no Next server — but the affected package remains in local development and build tooling, where `next dev` and the build machine are the surface.
- **Issue:** `ROADMAP.md` records eight high and one critical audit finding, identifies GHSA-9qr9-h5gf-34mp (the originally cited CVE id could not be reproduced in the audit output), and names 16.3.0 as the fix. `package.json` still pins 16.0.1, with the upgrade owned by W1, which is sequenced last. The deferral reasoning is sound and was narrowed from a date argument to a no-server argument; the disagreement is only about whether an isolated minor bump should wait for a major-version wave.
- **Recommendation:** Either pull the exact `next` and `eslint-config-next` patch into a short standalone security change validated by build and e2e, or keep the deferral with an earlier deadline and a concrete control preventing network exposure of the dev server.
