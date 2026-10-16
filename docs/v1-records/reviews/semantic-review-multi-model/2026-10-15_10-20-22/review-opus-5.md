# W6a evidence capture — the § 435.552 activity model

Three commits bring the activity model closer to 42 CFR 435.552: `workProgram` becomes a fourth storable and counted activity type, work splits into paid/in-kind/unpaid, education gains an enrollment status with the half-time cliff and the Carnegie-Unit credit-hour conversion, community service gains a structured verification record, and two CMS-named document types are added. A new `src/lib/education.ts` returns a discriminated union so a caller cannot fold at-least-half-time education into a combinable total, the conversion constants are injected from a new `educationCreditHourConversion` policy field, and a round-trip storage test backs the no-schema-bump claim (verified: `db.ts` untouched, IndexedDB still reports version 60 = Dexie 6).

The gap is between capture and reporting. Every field this wave adds is written and never read again. `enrollmentStatus`, `workKind`, `creditHours`, `educationProgramType`, and `communityService` have zero consumers outside `ActivityForm.tsx` — so the cliff that `education.ts` models correctly never reaches the dashboard, the activity list, or the export a caseworker reads.

**Watch for:**

- **A student enrolled at least half-time is told they need 80 hours** (confirmed — reproduced in a 375px browser: ⚠ "80 hours needed", "Total Hours 0 / 80"). This is the exact ADR-0003 false negative the wave file names as its highest-harm risk; the mitigation it specifies is not in the diff.
- **Community service lost its organization name from the export and every list view** (confirmed). The free-text `organization` field is now hidden for volunteer entries and the structured replacement has no reader.
- **A monthly credit-hour conversion is written once per selected date** (confirmed). 6 credits across three dates stores 233.82 hours.
- **`format:check` is red** on `ActivityForm.tsx` (confirmed), and no test — Vitest or Playwright — exercises any new form branch (confirmed: 694/694 and 74/74 pass, e2e spec count unchanged).

**Verdict**: NEEDS_CHANGES

## High-level view

The load-bearing design decision is that the half-time cliff is enforced *at capture* rather than in `calculateMonthlySummary`. The wave file argues this well: the summary stays a pure sum, and by the time an education row carries hours the cliff has already been applied. The module honours it — `educationContribution` returns `demonstrated-standalone` with `combinableHours: 0` and ignores any hours passed alongside it. But enforcing a rule at capture means the *status* becomes the carrier of meaning, and nothing downstream reads status. A zero-hour education row is indistinguishable from an empty month to `Dashboard`, `buildTextReport`, `ActivityList`, and `recommendationEngine`. The decision record checked that `MonthlySummary.isCompliant` has no production reader and concluded the cliff was safe to land; `hoursNeeded` does have one, and it renders under a warning icon.

The same capture-without-reader pattern runs through the whole wave. The community-service record is the sharpest case because it is a regression rather than an omission: the generic `organization` TextField is now suppressed for volunteer entries, the org name moves to `communityService.organizationName`, and `buildTextReport` still reads only `activity.organization`. The artifact the wave exists to strengthen got thinner.

`workProgram` is the part that is finished: the union member, the `calculations.ts` branch, the shared label map, the Dashboard chip, and the round-trip test all landed, and the three silent readers the wave file identified were each handled. Both characterization tests it invalidated were inverted in place with the prior assertion quoted in the comment rather than deleted.

Education's two live branches are each incomplete in a different direction. At-least-half-time stores a zero-hour row that no surface interprets. Less-than-half-time stores a *monthly* figure on a *daily* row, which the multi-date picker then multiplies, and which bypasses the 24-hour-per-day validation that every other type still gets. The third branch, non-credit hours counted 1:1 under § 435.552(d)(2), is implemented and tested in the module but unreachable from the form — the helper text points at an hours field that is not rendered in that branch.

The policy-profile discipline holds in `src/lib/`, where the compliance gate scans, and breaks in the component, where it does not: the on-screen formula hardcodes `× 3 × 4.33` while the result beside it comes from the profile.

Test coverage is split along the same capture/report line. The module is thoroughly tested, including a mutated-profile assertion that distinguishes injection from a literal. The form holding all the new conditional logic has no test at all and is not in the no-verdict render guard, so four of the wave's own acceptance criteria — the ones naming render tests — have no observable yet.

<details>
<summary>Issues (18)</summary>

1. **Half-time student reported as failing** — a zero-hour at-least-half-time education row leaves `Dashboard` rendering "80 hours needed" under a warning icon and `recommendationEngine` returning `complianceStatus: "needs-increase"`. Add the status-aware panel the wave file's risk register specifies, and make `hoursNeeded`/`totalHours` consumers status-aware before this ships.
2. **All new capture fields are write-only** — `enrollmentStatus`, `workKind`, `creditHours`, `educationProgramType`, `communityService` have no reader outside `ActivityForm.tsx`. Wire at least the export, which is the evidence artifact.
3. **Community-service organization regression** — the `organization` TextField is hidden for `type === "volunteer"` and `communityService.organizationName` is never read, so volunteer entries now show no organization in `ActivityList`, `DateActivityMenu`, `DuplicateActivityDialog`, or the text report. Either keep writing `organization` as well or teach those four readers the new shape.
4. **Export misses the POC contact line** — the acceptance criterion requires the exported community-service block to contain a point-of-contact line; `buildTextReport` only changed its label lookup. Render the structured record.
5. **Multi-date multiplies the monthly conversion** — the save loop calls `resolvedHours()` per selected date, so 6 credit hours with three dates stores 77.94 three times. Restrict credit-based education to a single entry per month, or store credit hours and convert at read time.
6. **Credit-based education bypasses the per-day hours cap** — the `> 24` and `> 16` checks live in the branch the credit path skips, so 77.94 lands on one calendar day unvalidated. Add a bound appropriate to a monthly figure, or stop storing a monthly figure on a daily row.
7. **`unknown` status is counted two different ways** — `educationContribution` gives it `combinableHours: 0` while the form stores typed hours and `calculateMonthlySummary` sums them. Pick one and make the `calculations.ts` comment true.
8. **`calculations.ts` comment overstates the invariant** — it claims only less-than-half-time education carries hours there, which is false for `unknown`-status rows and for every pre-W6a row. Correct the comment or enforce the invariant.
9. **§ 435.552(d)(2) non-credit path unreachable** — `nonCreditHours` is implemented and tested but has no UI, and the credit-hours helper points at an "hours field below" that is not rendered in that branch. Add a credit/non-credit choice, or drop the dead instruction.
10. **Stale cross-type fields on edit** — `db.activities.update` merges and `extraFields()` only adds, so switching an activity's type leaves `communityService`/`enrollmentStatus`/`creditHours` on the row and clearing `workKind` does not clear the stored value. Write explicit `undefined` for fields that do not apply to the current type.
11. **Switching to at-least-half-time silently zeroes stored hours** — `resolvedHours()` returns 0 with no warning, and switching back requires credit hours the user may not have. Warn before discarding logged hours.
12. **Policy literal in user-facing copy** — the conversion Alert hardcodes `× 3 × 4.33` while the result comes from the profile, so a changed profile would show a formula that contradicts its own answer. Interpolate both operands.
13. **`format:check` fails** on `src/components/ActivityForm.tsx`. Run `npm run format`.
14. **No test exercises the new form logic** — `ActivityForm.tsx` has no test file and is absent from the no-verdict render guard; the e2e spec count is unchanged at 74. Four acceptance criteria name render tests that do not exist.
15. **Vocabulary split on "volunteer"** — `Dashboard` renders "Volunteer" while the shared map now renders "Community Service" in the list, the date menu, the duplicate dialog, and the export. Point `Dashboard` at `ACTIVITY_TYPE_LABELS`.
16. **New chip fails the project's non-text contrast floor** — measured: the `secondary` "Job Training" chip is 2.23:1 against the white paper, the only one of four below the 3:1 `component-standards.md` sets for status chips (WCAG 1.4.11). Work is 7.11, Volunteer 3.88, Education 3.86.
17. **`activityDisplay.ts` consolidation is half-done** — `DateActivityMenu` keeps a local `activityColors` and `Dashboard` hardcodes `color="secondary"`, leaving `ACTIVITY_TYPE_CHIP_COLORS` with one consumer and the duplication the file was created to end still in place.
18. **The raised engine floor is advisory only** — `npm ci --dry-run` still exits 0 with EBADENGINE on this machine's 22.18.0, so local runs stay on the engine jsdom declares unsupported. `ROADMAP.md` says "resolved"; only CI changed. Add `.npmrc` `engine-strict=true` or narrow the claim to CI.

</details>

<details>
<summary>Details</summary>

### The cliff is modelled correctly and reported wrongly

`demonstrated-standalone` carries `combinableHours: 0` as a literal type, so a caller cannot sum it even by accident, and the `at-least-half-time` branch discards any `creditHours`/`nonCreditHours` passed alongside it. A test named "does not fold half-time education into a combinable total — the false-negative guard" pins it.

The guard holds at the module boundary and nowhere else. Seeding one at-least-half-time education row and loading `/tracking` at 375px:

```
Monthly Progress - October 2026
⚠ 80 hours needed
  Keep logging to reach 80 hours
Total Hours                    0 / 80 hours
Hours by Activity Type
  Work 0 · Volunteer 0 · Education 0 · Job Training 0
October 5, 2026   0 hours   [Education]
```

`Dashboard` destructures `hoursNeeded` and renders it with a `WarningIcon`. `recommendationEngine` with zero hours produces "Nothing recorded yet. There are two ways to get there…" and `complianceStatus: "needs-increase"`. The calendar cell reads `0h`.

Decision 3 in the wave file verified that `MonthlySummary.isCompliant` has zero production readers and concluded the cliff could land without W7b's rename. That verification was correct and incomplete: `hoursNeeded` is read at `Dashboard.tsx:127` and `totalHours` feeds the progress bar and the recommendation engine. The field whose *name* is a verdict has no reader; the fields that *compose* a verdict on screen have several.

The wave file's own risk register anticipated this and specified the fix — "Education at half-time renders a distinct 'this may be enough on its own — your state decides' panel, not a reduced number; the hours total is labelled as *combinable* activities only." That copy exists only inside `ActivityForm`, visible at the moment of entry and never again.

### Write-only fields

```
enrollmentStatus      → ActivityForm.tsx only (13 sites), + types/index.ts
workKind              → ActivityForm.tsx only
creditHours           → ActivityForm.tsx only (+ 3 comment mentions elsewhere)
educationProgramType  → ActivityForm.tsx only
communityService      → ActivityForm.tsx only, + types/index.ts
```

Five new fields, one consumer each, and that consumer is the component that wrote them. The round-trip test proves Dexie persists them; nothing proves anyone can see them again.

For community service this is a regression, not just an omission. The generic field is now gated:

```tsx
{type !== "volunteer" && (
  <TextField label="Source/Employer/Organization (Optional)" … />
)}
```

so a new volunteer entry has `organization === undefined`, and the four readers of `activity.organization` — `ActivityList:152`, `DateActivityMenu:144`, `DuplicateActivityDialog:81`, `buildTextReport:164` — all print nothing. Before this commit a volunteer entry showed "Food Bank" in the list and in the export. Now the name lives in `communityService.organizationName` and appears in neither. The acceptance criterion "the exported community-service block contains a POC contact line" is the positive twin the wave wrote for precisely this failure, and the only change to `buildTextReport` is the label lookup.

### A monthly figure on a daily row

`resolvedHours()` returns the converted monthly total for credit-based education. The create path then loops:

```tsx
const datesToCreate = dates.length > 0 ? dates : [date];
for (const dateStr of datesToCreate) {
  await db.activities.add({ date: dateStr, type, hours: resolvedHours(), … });
}
```

"Add Another Date" is not gated by type, so a less-than-half-time student entering 6 credit hours and picking three dates stores 77.94 three times — 233.82 education hours for a month in which § 435.552(d) credits 77.94. The over-count is in the user's favour and therefore the harmful direction: it tells them they have cleared a threshold they have not.

The same branch skips validation. The `> 24` error and `> 16` warning live in the `else` the credit path does not enter, so 77.94 hours on a single calendar day is accepted silently while 25 hours of work is still rejected.

The wave file identified the underlying shape problem and deferred it: § 435.552(c) enrollment is a property of a term, `Activity` is a per-day row, a term-scoped `enrollments` table is the clean fix and is a new table, so it belongs to W6b. What that deferral does not cover is that the credit-hour figure is *also* month-scoped and is being written to daily rows today.

### Two answers for "unknown"

`educationContribution({ status: "unknown" })` returns `combinableHours: 0`, and the test asserts it: "unknown status contributes nothing and is flagged to ask the school." The form takes a different path — `unknown` satisfies the required-status check, neither `isHalfTimeStandalone` nor `isCreditBasedEducation` is true, so the hours field renders, `resolvedHours()` returns the typed value, and `calculateMonthlySummary` sums it into `educationHours` and the total.

Both behaviours are defensible in isolation. Shipping both means the answer depends on which surface the user is looking at. The new comment in `calculations.ts` asserts the stricter reading:

```ts
case "education":
  // 42 CFR 435.552(e)(1): only less-than-half-time education carries hours here.
```

That is not true for `unknown`-status rows, and it is not true for any row created before this commit — the wave deliberately left legacy education rows unmigrated (correctly, per `data-migration-standards.md`: a missing field is unknown, not inferred). The deferral is right; the comment claims an invariant the code does not hold.

### § 435.552(d)(2) is implemented, tested, and unreachable

The module handles non-credit programs at 1:1 and the test cites 91 FR 33471 for it. The form offers no way in. The credit-hours helper says:

> "From your class schedule. Non-credit program? Use the hours field below instead."

and the hours field is rendered only when `!isHalfTimeStandalone && !isCreditBasedEducation`. In the less-than-half-time branch there is no field below. Validation then *requires* credit hours:

```tsx
if (!creditHours || parseFloat(creditHours) <= 0) {
  newErrors.creditHours = "Enter your credit hours, or switch to hours below";
}
```

A GED student or a non-credit CTE student at less than half-time cannot save at all. The error text offers the same unavailable escape.

### Editing an activity keeps fields from its former life

`handleSaveActivity` calls `db.activities.update(id, { ...activityData })`, which merges. `extraFields()` only ever adds keys:

```tsx
if (type === "work" && workKind) extra.workKind = workKind;
if (type === "education") { … }
if (type === "volunteer") { … }
```

So editing a volunteer activity into a work activity leaves the whole `communityService` object on the row; education → work leaves `enrollmentStatus` and `creditHours`. Nothing reads those fields today, which is why nothing visibly breaks — the first reader added will inherit the inconsistency.

The edit path also discards data. Flipping an existing education row to at-least-half-time makes `resolvedHours()` return 0, and the 40 logged hours are gone on save with no warning. Recovery is blocked by the non-credit gap above: switching back to less-than-half-time demands credit hours.

One more wrinkle in the same block: for education rows the form coerces a missing status to `"unknown"` and `extraFields()` then persists it. Saving an untouched legacy row stamps it `unknown` — defensible as "we asked and they didn't know", but it is a write the user did not make.

### A policy literal in copy, outside the gate's reach

```tsx
{creditHours} credit hour{…} × 3 × 4.33 ={" "}
<strong>{educationContribution({…}).combinableHours.toFixed(2)} hours</strong>
```

The result is injected from `educationCreditHourConversion`; the operands beside it are typed into JSX. A profile that changed the conversion would render a formula contradicting its own answer. `compliance-copy-standards.md`: "No policy literals in strings — interpolate from the policy profile."

`scripts/compliance-gate.sh` gained `src/lib/education.ts`, which catches literals where they would be most dangerous. Its target list is all `src/lib/`, so a literal that reaches the screen through a component is outside it — and the gate's own header warns against mistaking its silence for proof.

### Test coverage

The module side is strong: `education.test.ts` covers all three CFR table rows, the float-tail guard with a genuinely inexact operand (`11 × 3 × 4.33`), both cliff branches, the non-credit path, and a mutated profile proving the constants are injected rather than literal. That last one is labelled "THE LOAD-BEARING ASSERTION" with an explanation of why asserting 77.94 alone would pass against a hardcoded expression.

**Not tested:** anything in `ActivityForm.tsx`. No render test drives either education branch, asserts "77.94" and the formula appear on screen, or checks that no raw `workProgram`/`WorkProgram` string renders — all three are written as acceptance criteria. The component is also absent from `src/__tests__/no-verdict.render.test.tsx`, so roughly 560 new lines of user-facing copy sit outside the verdict guard. The e2e suite passes at 74 specs, the same count as before the wave, so nothing browser-level covers the new model either, despite the risk register asking for a 375px read before close.

### Presentation details

Measured chip contrast against the white paper, at 375px:

| Chip | Background | vs. paper | Text ratio |
|---|---|---|---|
| Work | `rgb(107,78,113)` | 7.11 | 7.11 |
| Volunteer | `rgb(92,141,90)` | 3.88 | 3.88 |
| Education | `rgb(2,136,209)` | 3.86 | 3.86 |
| **Job Training** | `rgb(212,165,116)` | **2.23** | 9.43 |

The new chip's label is legible; its boundary is the only one of four below the 3:1 that `component-standards.md` sets for status chips under WCAG 1.4.11. The same `secondary` colour is now the `workProgram` chip in `ActivityList` and `DateActivityMenu` too.

The fourth chip also wraps to its own centred row at 375px (`flexWrap: { xs: "wrap" }` with `flex: 1, minWidth: 80px`), giving a 3 + 1 layout.

And the shared-label refactor did not reach `Dashboard`, which still hardcodes `label="Volunteer"` and `color="secondary"`. So the same activity type is "Community Service" in the list, the date menu, the duplicate dialog, and the export, and "Volunteer" on the dashboard directly above them — visible in one screenshot. `DateActivityMenu` likewise kept its own local `activityColors` while importing only the labels, so `ACTIVITY_TYPE_CHIP_COLORS` has a single consumer and the duplication `activityDisplay.ts` was created to end survives in two places.

### Cross-cutting decisions

The `next` deferral holds up: the CVE label was corrected to GHSA-9qr9-h5gf-34mp because the CVE id could not be reproduced in the audit output, the fix was established as a minor bump separable from W1's MUI major, and the justification narrowed from "it's not December yet" to a static export with no Next server, leaving the build machine and `next dev` as the exposed surface. No action beyond what is recorded.

The engine floor is weaker than `ROADMAP.md` claims. `engines.node` moved to `>=22.22.2` and CI pinned to `22.23.2`, but there is no `.npmrc`, so:

```
$ node -v
v22.18.0
$ npm ci --dry-run
npm warn EBADENGINE   required: { node: '>=22.19.0' }
npm warn EBADENGINE   current: { node: 'v22.18.0', npm: '11.8.0' }
up to date in 864ms
```

Local installs still succeed on the engine jsdom declares unsupported, and the 694 tests in this review ran on 22.18.0. The wave file is candid about this ("the raised floor stays advisory on 22.18.0"); `ROADMAP.md` records it under "resolved 2026-09-03", and the heading does more work than the change does. The condition the change was made to eliminate — a suite passing on an unsupported runtime — is unchanged locally.

### Wave bookkeeping

Every acceptance checkbox in `wave-6a-evidence-capture.md` is unchecked, `CHANGELOG.md` is untouched, and no closure line was written in `gap-analysis.md`, so the wave is correctly marked in progress and none of the above is a false completion claim. Two criteria are already contradicted by the diff rather than merely unmet: the community-service POC line in the export, and the render tests for the education branches.

The `git diff src/lib/db.ts` constraint held — `db.ts` is absent from the diff and the running app reports IndexedDB version 60, which is Dexie 6. The 4.33 collision is documented in four places (`policy/types.ts`, `federalDefault.ts`, `payPeriodConversion.ts`, `EstimationTools.tsx`) and the constants were not collapsed.

</details>

<details>
<summary>File map</summary>

| File | Change |
|---|---|
| `src/lib/education.ts` | **New.** Credit-hour conversion and the half-time cliff as a discriminated union |
| `src/lib/__tests__/education.test.ts` | **New.** CFR table rows, cliff branches, injected-constant proof |
| `src/lib/activityDisplay.ts` | **New.** Shared `Record<Activity["type"], …>` labels and chip colours |
| `src/lib/__tests__/calculations.workProgram.test.ts` | **New.** `workProgram` bucket and four-type combination |
| `src/lib/storage/__tests__/activityFields.roundtrip.test.ts` | **New.** Persistence of every W6a field with no schema bump |
| `src/types/index.ts` | `workProgram` union member, `WorkKind`, `ActivityEnrollmentStatus`, `EducationProgramType`, `CommunityServiceDetails`, `workProgramHours` |
| `src/components/ActivityForm.tsx` | +561 lines: work sub-kind, enrollment status, credit-hour conversion display, community-service record |
| `src/lib/calculations.ts` | `workProgram` branch and bucket; total over four pathways |
| `src/lib/export/buildTextReport.ts` | Label lookup replaces the capitalize-first-char trick |
| `src/components/Dashboard.tsx` | Fourth breakdown chip for work-program hours |
| `src/components/ActivityList.tsx`, `DateActivityMenu.tsx`, `DuplicateActivityDialog.tsx` | Shared labels; icon and colour for the new type |
| `src/components/help/DocumentVerificationHelp.tsx` | `workProgram` accepted, falls back to work examples |
| `src/components/documents/DocumentMetadataFormSimple.tsx`, `src/types/documents.ts` | VA disability and SNAP/TANF approval document types |
| `src/lib/policy/types.ts`, `federalDefault.ts` | `educationCreditHourConversion` field, manifest entry, owner entry |
| `src/lib/__tests__/calculations.characterization.test.ts` | Two characterization tests inverted in place, prior assertions quoted |
| `src/lib/__tests__/policyInjection.test.ts`, `scripts/compliance-gate.sh` | `education.ts` added to both scan lists |
| `src/lib/policy/__tests__/policy.test.ts`, `src/__tests__/no-verdict.render.test.tsx` | Field count 36→37; `workProgramHours` in the summary factory |
| `package.json`, `.github/workflows/deploy.yml` | `engines.node >=22.22.2`; CI Node pinned to 22.23.2 |
| `ROADMAP.md`, `docs/hr1-readiness/README.md`, `docs/domain/cms-2454-ifc/state-options.md` | Security debt section, wave status, policy field doc |
| `docs/hr1-readiness/waves/wave-6a-evidence-capture.md` | **New.** 260-line wave file with re-verified site counts and the W6a/W6b boundary |

Full diff: `git diff 423fc11~1..HEAD`

</details>
