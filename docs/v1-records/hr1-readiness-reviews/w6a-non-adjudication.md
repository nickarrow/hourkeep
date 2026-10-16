# W6a non-adjudication review (ADR-0003)

**Scope:** read-only review of wave W6a against
`docs/hr1-readiness/decisions/ADR-0003-evidence-not-adjudication.md` and
`.kiro/steering/compliance-copy-standards.md`.
**Reviewer posture:** HourKeep assembles evidence; the state determines status.
**Commits reviewed:** `6420f11`, `e94a53c` (the two W6a code commits), diffed against
`423fc11`.
**Files reviewed:** `ActivityForm.tsx`, `Dashboard.tsx`, `ActivityList.tsx`,
`DateActivityMenu.tsx`, `DuplicateActivityDialog.tsx`, `src/lib/education.ts`,
`src/lib/calculations.ts`, `src/lib/activityDisplay.ts`, `src/types/index.ts`,
`src/lib/export/buildTextReport.ts`, plus the policy additions and the two no-verdict
guards.

---

## Summary answer

**W6a is substantially compliant with ADR-0003. It asserts no eligibility verdict in any
new user-facing string, adds no new verdict-named type or field, and its one new
return-value shape — `education.ts`'s discriminated union — correctly mirrors the
statute's "demonstrates" language without claiming eligibility.** The new credit-hour
conversion Alert is a correct **Computed** disclosure, not an over-assertion. The hidden
hours field for at-least-half-time education is appropriate behavior with a way back, not
a hidden verdict.

Four observations, all **non-blocking**:

- **O-1 (minor, process gap):** `ActivityForm` — the component that carries every new W6a
  user-facing string, including both Alerts — was **not** added to the mounted
  `no-verdict.render.test.tsx` guard, even though the task brief says "add every new
  component to the no-verdict render guard in the same commit that creates it." The
  source-level guard (`no-verdict.source.test.ts`) does scan it, so there is coverage, but
  not the render-level coverage the brief calls for.
- **O-2 (copy, minor):** two new Alerts hedge correctly but their **next action** is
  implicit rather than stated. Worth tightening against the "every hedge carries a next
  action" rule.
- **O-3 (not a W6a defect, flag only):** `MonthlySummary.isCompliant` and
  `calculations.ts`'s `isCompliant` are verdict-named and still present. These are
  pre-existing, explicitly deferred to **W7b** in both the type comment and the
  calculation comment. W6a touched the surrounding code but correctly did **not**
  introduce or spread them.
- **O-4 (copy nuance):** the half-time Alert's "school may be enough on its own" is good;
  one phrase ("there are no hours to add up") is a statement about the rule, which is fine,
  but the Alert should make the "ask your state / registrar" action explicit.

No fixes were made. Recommendations are at the end.

---

## Evidence

### (a) User-facing strings — no verdict found

Checked every new string in the ten files for the banned patterns ("you are exempt",
"compliant", "you automatically meet", "you qualify", "✓ COMPLIANT").

- **`ActivityForm.tsx` — half-time Alert (~L560):** "At half-time or more, school may be
  enough on its own — there are no hours to add up, and it isn't combined with other
  activities. **Your state decides what counts.**" Hedged ("may be"), names the actor
  ("your state decides"). Compliant with ADR-0003 and the banned-list.
- **`ActivityForm.tsx` — credit-hour Alert (~L600):** shows `{creditHours} credit hours ×
  3 × 4.33 = {NN.NN} hours this month (42 CFR 435.552(d))` and "These can be combined with
  work or community service." No verdict; it reports arithmetic and a citation. See (c)
  for the Computed assessment.
- **`ActivityForm.tsx` — work sub-kind helper:** "All three count. This helps you know
  what to keep — in-kind and unpaid work often won't show up in records your state
  checks." Neutral, evidence-framed, no verdict.
- **`ActivityForm.tsx` — enrollment-status helper:** "Your school decides this, not you
  and not your state. If you're not sure, pick 'I'm not sure' and ask the registrar."
  Correctly defers status to the school (§ 435.552(c)) and names a next action.
- **`ActivityForm.tsx` — community-service helpers:** "Doesn't have to be a registered
  charity. Your state can't limit it to 501(c)(3)s." and "without a contact who can
  confirm your hours, the record may not be accepted." Accurate to § 435.552(b) and the
  91 FR 33400 verification schema; no verdict.
- **`Dashboard.tsx`:** the W6a change here is additive only — a "Job Training" breakdown
  chip and `workProgramHours`. The two status branches ("{totalHours} hours logged / That's
  at or over the {threshold}-hour total… Your state decides what counts." and "{hoursNeeded}
  hours needed / Keep logging to reach {threshold} hours") were written in W5 and remain
  verdict-free.
- **`buildTextReport.ts`:** the only W6a change is routing the activity label through
  `ACTIVITY_TYPE_LABELS` so `workProgram` prints "Job Training" rather than "WorkProgram".
  The report's non-determination preamble and household-income note are W2a/W2b and intact.
- **`ActivityList.tsx`, `DateActivityMenu.tsx`, `DuplicateActivityDialog.tsx`:** W6a change
  is label/icon/colour wiring for the `workProgram` type via `activityDisplay.ts`. No new
  strings assert anything.

### (b) Type / field names — no new verdict-named field

- **`src/types/index.ts`:** new types `WorkKind`, `ActivityEnrollmentStatus`,
  `EducationProgramType`, `CommunityServiceDetails`, and the new `workProgram` member of
  `Activity["type"]`. None encodes a verdict; all are descriptive evidence categories with
  CFR citations.
- **`MonthlySummary.isCompliant` (L~…, `types/index.ts`):** **pre-existing**, verdict-named,
  and explicitly annotated: "NAME IS A VERDICT — renamed meetsHoursThreshold in W7b
  (ADR-0003)." W6a added `workProgramHours` beside it but did not add or rename a verdict
  field. **Correctly left for W7b** (per `data-migration-standards.md` version ownership and
  ADR-0003). Flag only — not a W6a defect.
- **`education.ts` discriminated union:** `DemonstratedStandalone` / `CombinableHours` /
  `StatusUnknown`. The field `combinableHours` is neutral arithmetic. The `kind` tags are
  assessed in (c).

### (c) Return values collapsing to pass/fail — the two judgment calls in the brief

**`education.ts` `kind: "demonstrated-standalone"` — correct, not a verdict.**
The union exists precisely to *prevent* a verdict: its doc comment explains that returning
a bare number would let a caller fold at-least-half-time education into a combinable total
and measure it against 80, reporting a half-time student as failing — "the exact harm
ADR-0003 § Context names." The tag `"demonstrated-standalone"` mirrors the statutory verb
in **42 CFR 435.552(a)(4)** ("enrolled… at least half-time… *demonstrates* community
engagement"), carried in the comment with its FR cite (91 FR 33470). It describes what the
*enrollment pathway* does under the rule; it does not assert the person is eligible,
excluded, or compliant — those remain the state's call and are never rendered as such.
This is the Computed label applied to a structural outcome, consistent with ADR-0003's
"computing is not adjudicating" refinement. **No change needed.**

**The credit-hour Alert "6 credit hours × 3 × 4.33 = 77.94 hours" — correct Computed, not
over-assertion.** ADR-0003's refinement section names this exact case: § 435.552(d)'s
conversion is "arithmetic CMS published… the State will compute exactly that number.
Refusing to show it isn't humility, it's withholding." The Alert shows the number, the
formula, and the citation — the three things the Computed label requires. The constants
`3` and `4.33` are read from `policy.educationCreditHourConversion`
(`federalDefault.ts`), not hardcoded, and `types.ts` documents that this `4.33` is the
Carnegie Unit and must not be collapsed with `PAY_PERIOD_MULTIPLIERS.weekly`. **Correct and
well-guarded.**

**`calculations.ts` `isCompliant` return value:** pre-existing verdict in a return value,
annotated as W7b's to remove; W6a added a `workProgram` branch and a `default`-less-switch
fix but did not extend the verdict's reach. `hoursNeeded` remains neutral arithmetic
("a difference is not a verdict"). Flag only — see O-3.

### (d) Behavior — hiding the hours field for at-least-half-time education

**Appropriate, not an asserted verdict, and it has a way back.** When
`enrollmentStatus === "at-least-half-time"`, `ActivityForm` hides the Hours and credit-hour
fields and stores `0` hours (`isHalfTimeStandalone`, `resolvedHours()`). This is the
correct encoding of the **half-time cliff** (§ 435.552(a)(4) demonstrates on zero hours;
(e)(1) forbids combining), not a suppression of capability based on apparent status. The
"way back" test from ADR-0003 ("suppressing tracking UI… always needs a way back") is
satisfied: the enrollment-status radio group is always visible and the user can switch to
"Less than half-time" or "I'm not sure" at any time, which immediately restores the hours /
credit-hour fields. The copy frames it as the rule's effect ("there are no hours to add
up"), not as a determination about the user. **No change needed.**

### Policy, guards, and the Dexie constraint (verified)

- **No Dexie bump:** `git diff 423fc11 HEAD -- src/lib/db.ts` is empty. The constraint
  ("`git diff src/lib/db.ts` must be empty at close") holds. All new fields are unindexed
  nested data on existing rows.
- **No policy literals:** `education.ts` takes `policy: PolicyProfile = FEDERAL_DEFAULT`,
  was added to the `policyInjection.test.ts` scan list, and
  `educationCreditHourConversion` was added to `POLICY_PROFILE_FIELDS` and
  `POLICY_FIELD_OWNERS` in `types.ts`. All four required touch-points are present.
- **Source-level no-verdict guard** (`no-verdict.source.test.ts`) scans every `.ts/.tsx/.md`
  under `src/` recursively (`sourceFiles(dir)`), so the new W6a components and
  `education.ts` are covered automatically.

---

## Conclusions and recommendations

W6a is clean on the thing that matters most: it ships no new eligibility verdict in copy,
type, return value, or behavior, and its two genuinely novel judgment calls (the
`demonstrated-standalone` union tag and the credit-hour Alert) are both correct reads of
ADR-0003's "compute, don't adjudicate" line. The pre-existing `isCompliant` verdicts are
correctly left untouched for W7b.

Recommendations, in priority order (none blocking):

1. **O-1 — add `ActivityForm` to the mounted render guard
   (`no-verdict.render.test.tsx`).** The brief requires every new component in the render
   guard "in the same commit that creates it," and the render guard was the layer that
   caught the two verdicts the source scan missed in W5 (`Dashboard`'s title-case
   "Compliant"). `ActivityForm` carries all of W6a's new strings and is absent from the
   mounted set — the diff only added `workProgramHours: 0` to a summary fixture. Mount it in
   both its empty/new and populated states and assert `expectNoVerdict`.

2. **O-2 / O-4 — make the next action explicit in both new Alerts.** The half-time Alert
   and credit-hour Alert both hedge well but lean on the enrollment-status helper text for
   the "ask your school/state" action. Per "every hedge carries a next action," add a short
   explicit next step to each, e.g. the half-time Alert closing with "Keep your enrollment
   confirmation from your school" and the credit-hour Alert noting the figure is for the
   user's records to show the state. Minor copy polish, not a correctness issue.

3. **O-3 — no action in W6a; confirm W7b still owns the `isCompliant` rename.** Both the
   `MonthlySummary` field and the `calculations.ts` local are annotated as W7b's; this
   review confirms W6a neither introduced nor widened them. Carry forward as a W7b
   acceptance item.

Nothing in W6a requires a fix to meet ADR-0003. The recommendations above harden process
coverage (O-1) and polish copy (O-2/O-4); O-3 is a forward-looking confirmation.
