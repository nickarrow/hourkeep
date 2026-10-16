# Evidence capture for § 435.552 activities

## Summary

This change adds the missing work-program pathway, work sub-kinds, education status and credit conversion, structured community-service details, and two named document types. The helper-level design recognizes the half-time cliff and policy-owned Carnegie conversion, and exhaustive label maps keep the new activity type consistent. The production flow does not preserve those semantics: education status is lost in aggregation, non-credit education is unreachable, monthly conversion results are cached in duplicable daily rows, and captured evidence is omitted or corrupted downstream. **Watch for:** **confirmed** false reassurance and false shortfalls in education summaries; **confirmed** evidence loss or staleness through edit, duplicate, and export; **confirmed** policy-profile bypass in the conversion UI.

**Verdict**: NEEDS_CHANGES

## High-level view

**Confirmed:** `ActivityForm` reduces the three-way education result to `Activity.hours`, and `calculateMonthlySummary` then sums every education row without reading status. The monthly result can express neither standalone half-time enrollment nor unknown legacy enrollment.

**Confirmed:** every less-than-half-time program is forced into the credit branch even though the UI points non-credit students to a hidden hours field. That monthly conversion is persisted on a daily row and can be written once per selected date, multiplying a single credit load.

**Confirmed:** the new evidence fields round-trip through Dexie but not through the product lifecycle. Duplication drops them, partial edits retain incompatible old fields, and the report emits only type, hours, and legacy organization.

**Confirmed:** the committed form hardcodes the conversion operands and is absent from the copy/UI policy scan. Work-program document help also falls back to ordinary employment records rather than program participation evidence.

**Confirmed:** tests cover helpers, work-program totals, and direct IndexedDB persistence, not the form-to-summary/report joins where these failures occur. The diff also deliberately retains audited `next@16.0.1`; static export narrows deployed exposure but does not remove the affected development/build dependency.

<details>
<summary>Issues (11)</summary>

1. **Education status is discarded [confirmed]** — monthly aggregation blindly sums education hours, causing false shortfalls for half-time students and false reassurance for unknown legacy rows. Resolve stored education facts at read time and carry standalone/unknown signals into the dashboard.
2. **Non-credit education is unreachable [confirmed]** — every less-than-half-time selection enters the credit branch and hides the hours field named by its own help text. Add an explicit credit/non-credit choice and drive both branches in a render test.
3. **Converted hours are cached [confirmed]** — the form stores a policy-derived result and summaries ignore source credits, so later profiles cannot recalculate old records. Store source inputs and derive monthly contribution during aggregation.
4. **Monthly credits multiply across dates [confirmed]** — multi-date save and generic duplication can copy one monthly conversion into several daily rows. Constrain monthly education records or normalize them before generic date-copy operations.
5. **Type-changing edits retain stale evidence [confirmed]** — partial updates omit rather than clear irrelevant optional fields. Normalize replacement records and explicitly remove fields that no longer belong to the selected activity type.
6. **Duplication strips new evidence [confirmed]** — copied rows retain only date, type, hours, and legacy organization. Copy all relevant work, education, and community-service source fields through a shared type-aware path.
7. **The report drops verification details [confirmed]** — the agency-facing artifact ignores every new structured field and renders half-time education as zero hours. Export the source evidence and distinguish enrollment status from an hours total.
8. **Work-program document help is mismatched [confirmed]** — the new branch recommends ordinary employment records rather than qualifying-program participation evidence. Add dedicated enrollment/participation examples.
9. **The conversion formula bypasses policy [confirmed]** — committed JSX hardcodes the factors and the form is absent from the policy-literal scan. Render and calculate from the same injected profile, then add mutation coverage.
10. **Behavioral joins are untested [confirmed]** — tests bypass capture, edit, duplicate, summary rendering, and structured export. Add targeted Vitest coverage plus browser tests for the dialog branches.
11. **The critical Next advisory remains active [confirmed]** — the diff documents but retains `next@16.0.1` despite naming an isolated `16.3.0` fix. Upgrade in a short security change or impose an earlier deadline and concrete dev-server controls.

</details>

<details>
<summary>Details</summary>

### The half-time cliff stops at the form boundary [confirmed]

Production reduces enrollment status to a number before storage and never restores the distinction:

```text
ActivityForm
  -> resolvedHours()                   0 | converted number | typed number
  -> Activity.hours
  -> calculateMonthlySummary()         sums every education activity.hours
  -> Dashboard                         hours total / hours needed
```

`ActivityForm.tsx:213-223` writes zero for at-least-half-time and a converted number for a credit row. `calculations.ts:72-77` never reads `enrollmentStatus`, and `MonthlySummary` has no standalone or unknown education signal. After saving half-time enrollment, `Dashboard.tsx:126-131` can therefore render “80 hours needed” and “Keep logging,” despite the form explaining that school may be enough on its own.

The reverse error remains for legacy rows. Opening an education row maps missing status to `unknown` (`ActivityForm.tsx:138-145`), but unopened rows retain their hours and are still summed. The modified characterization test at `calculations.characterization.test.ts:318-351` assumes every education row carrying hours is less than half-time, an invariant contradicted by the explicit legacy-row decision.

Resolve education rows from stored source facts during monthly aggregation, preserve standalone and unknown signals, and render those signals without a legal verdict. This is also the positive observable promised by the wave criterion: half-time enrollment must appear as more than zero progress.

### Less-than-half-time non-credit programs cannot be entered [confirmed]

`ActivityForm.tsx:203-205` defines every less-than-half-time education row as credit-based. That branch requires credits and hides the ordinary hours field at `ActivityForm.tsx:800-824`, while its helper text says “Non-credit program? Use the hours field below instead” (`ActivityForm.tsx:739-742`). No control exposes that field, so `educationContribution({ nonCreditHours })` is unreachable from the product.

Add a credit/non-credit basis choice, require credits only for the credit branch, and expose actual class/activity hours for non-credit programs. A render test should drive both paths.

### Monthly education values are cached and multiplied as daily entries [confirmed]

Credit hours and their conversion are monthly facts, but `ActivityForm.tsx:213-223` persists both source `creditHours` and derived `hours` on a dated activity. `calculateMonthlySummary` reads only the cached number, so later policy profiles cannot recalculate existing entries even though the helper’s mutation test changes with an injected profile.

New-entry save writes the full monthly result for every selected date (`ActivityForm.tsx:363-370`). Six credits entered once with two dates creates two 77.94-hour rows, totaling 155.88 hours; generic duplication can multiply it again. These rows also contradict the model comment that `Activity.hours` is 0–24.

Store source inputs and derive the contribution when summarizing a month. Until W6b introduces the term-aware model, constrain credit-based and standalone education to one month-scoped record and exclude it from generic daily multi-date/duplicate behavior.

### Evidence metadata is stale after edits and absent after duplication [confirmed]

`extraFields()` emits only fields relevant to the current type (`ActivityForm.tsx:280-310`), while edit uses a partial Dexie update (`tracking/page.tsx:473-478`). Omitted keys survive: changing community service to work leaves `communityService`; changing credit education leaves its status, program type, and credits; clearing all optional community-service fields leaves the old object intact.

Duplication at `tracking/page.tsx:538-552` copies only date, type, hours, and legacy organization. It drops `workKind`, every community-service verification field, and all education source facts. A duplicated half-time row becomes zero-hour education with no status; a duplicated credit row retains derived hours without the credits that justify them.

Use one type-aware normalization boundary for create, replace, multi-date save, and duplicate. It must explicitly clear irrelevant fields and intentionally copy all relevant source evidence.

### The report discards the verification record [confirmed]

`buildTextReport.ts:159-167` still emits only date, label, `activity.hours`, and legacy `organization`; it never reads `workKind`, `enrollmentStatus`, `educationProgramType`, `creditHours`, or `communityService`. List and date-menu rows likewise display half-time enrollment as zero hours.

A user can enter a community-service address, description, and confirming contact, then generate an agency-facing artifact containing none of them. Credit education loses its source credits and arithmetic; half-time education loses the status that gives the zero-hour row meaning.

Render community-service organization, address, activity, and confirming contact; work sub-kind; and education status, program type, and source credits/formula. Compact lists need not show every field, but must distinguish half-time enrollment from zero education hours.

### Work-program proof guidance points to employment records [confirmed]

The new branch at `DocumentVerificationHelp.tsx:41-45` returns `documentVerificationHelp.workExamples`: pay stubs, employer timesheets, schedules, invoices, and gig screenshots. Those do not establish participation in WIOA, SNAP E&T, an approved state/local program, a DOL/VA veterans program, or a SNAP workforce partnership.

The comment already names better examples—SNAP E&T approval and WIOA enrollment letters—but users see the fallback. Add dedicated program enrollment/participation guidance and assert it in the rendered help.

### The conversion UI bypasses its policy source and guard [confirmed]

The helper accepts `policy: PolicyProfile = FEDERAL_DEFAULT`, but committed `ActivityForm.tsx:754-766` renders `× 3 × 4.33` and calls the helper without a policy. A later effective profile can make the displayed operands diverge from the calculation.

Committed `policyInjection.test.ts:263-280` omits `ActivityForm.tsx` from `COPY_AND_UI`, so the guard passes. Render operands from the same supplied policy, add the form to the scan, and mutate the profile in a test that asserts formula and result move together.

### Helper tests miss the failing behavioral joins [confirmed]

The direct storage test proves Dexie retains fully formed rows but bypasses capture, edit, duplication, reporting, and summary rendering. Not tested: non-credit capture; unknown legacy education in monthly aggregation; the dashboard after half-time save; multi-date monthly credits; duplication of new shapes; type-changing or clearing edits; new details in the report; dedicated work-program document guidance. Add Vitest coverage for logic and report behavior, reserving browser tests for dialog interaction and phone layout.

### The critical framework advisory remains active [confirmed]

The added roadmap section records eight high and one critical audit finding against `next@16.0.1`, identifies GHSA-9qr9-h5gf-34mp, and names `16.3.0` as the fix (`ROADMAP.md:568-571`). `package.json:38` still pins `16.0.1`. Static export meaningfully reduces deployed server exposure, but the affected package remains in local development and build tooling.

Because the fix is described as an isolated minor upgrade, pull the exact Next/ESLint-config-Next update into a short security change with build/e2e validation, or set an earlier deadline with concrete controls preventing network exposure of the dev server.

</details>

<details>
<summary>File map</summary>

- `.github/workflows/deploy.yml` — pins CI to a supported Node patch.
- `ROADMAP.md` — records deferred Next.js advisories and the Node decision.
- `docs/domain/cms-2454-ifc/state-options.md` — adds the education conversion policy field.
- `docs/hr1-readiness/README.md` — marks W6a in progress and records toolchain decisions.
- `docs/hr1-readiness/waves/wave-6a-evidence-capture.md` — defines scope and acceptance criteria.
- `package.json` — raises the Node engine floor.
- `scripts/compliance-gate.sh` — scans the education helper for policy literals.
- `src/__tests__/no-verdict.render.test.tsx` — extends dashboard fixtures with a work-program bucket.
- `src/components/ActivityForm.tsx` — captures new evidence fields and education branches.
- `src/components/ActivityList.tsx` — adopts shared activity labels and colors.
- `src/components/Dashboard.tsx` — displays work-program hours.
- `src/components/DateActivityMenu.tsx` — adds work-program icon, color, and label.
- `src/components/DuplicateActivityDialog.tsx` — uses the shared activity label.
- `src/components/documents/DocumentMetadataFormSimple.tsx` — adds VA and SNAP/TANF choices.
- `src/components/help/DocumentVerificationHelp.tsx` — adds work-program help via work fallback.
- `src/lib/__tests__/calculations.characterization.test.ts` — revises work-program and education expectations.
- `src/lib/__tests__/calculations.workProgram.test.ts` — tests work-program aggregation.
- `src/lib/__tests__/education.test.ts` — tests education contribution and conversion.
- `src/lib/__tests__/policyInjection.test.ts` — scans the education helper.
- `src/lib/activityDisplay.ts` — centralizes exhaustive activity labels and colors.
- `src/lib/calculations.ts` — aggregates work-program hours.
- `src/lib/education.ts` — implements education contribution and conversion.
- `src/lib/export/buildTextReport.ts` — uses shared activity labels.
- `src/lib/policy/__tests__/policy.test.ts` — updates the field count.
- `src/lib/policy/federalDefault.ts` — supplies federal conversion factors.
- `src/lib/policy/types.ts` — declares and owns the conversion field.
- `src/lib/storage/__tests__/activityFields.roundtrip.test.ts` — verifies raw Dexie persistence.
- `src/types/documents.ts` — adds VA and SNAP/TANF document types.
- `src/types/index.ts` — expands the activity and summary schemas.

Full diff: `git diff 423fc11~1 HEAD`

</details>
