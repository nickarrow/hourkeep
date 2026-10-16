# W6a — Domain-Fidelity Review (read-only)

**Scope:** 42 CFR 435.552 activity-model evidence capture.
**Reviewer task:** verify the W6a implementation against the primary sources
`docs/domain/cms-2454-ifc/rule-extract.md` and the raw rule text
`docs/domain/cms-2454-ifc/2026-11094.txt` (FR pages marked `[[FR p.NNNNN]]`).
**Files reviewed:** `src/lib/education.ts`, `src/lib/calculations.ts`,
`src/lib/policy/types.ts` (`educationCreditHourConversion`),
`src/lib/policy/federalDefault.ts`, `src/types/index.ts`
(`Activity`, `WorkKind`, `CommunityServiceDetails`, `EducationProgramType`),
`src/content/helpText.ts` (`activityDefinitions`), `src/components/ActivityForm.tsx`.
**Verdict:** **PASS — domain-faithful.** No substantive legal error found. Two
MINOR findings and three observations, none blocking. Nothing was fixed; this is
read-only.

---

## Summary answer

The six verification questions in the brief all resolve in the implementation's
favor:

1. **Credit-hour conversion (`creditHours × 3 × 4.33`, 6 → 77.94)** — correct and
   matches both the regulatory formula at 42 CFR 435.552(d)(1) (91 FR 33470–33471)
   and CMS's worked example (91 FR 33359), verified verbatim against the rule text.
2. **Half-time cliff** — correctly implemented. At-least-half-time demonstrates on
   its own with zero hours and cannot combine; less-than-half-time converts and
   combines. Enforced structurally by a discriminated union, not just by copy.
3. **`workProgram` pathway** — correctly added as a real fourth hours pathway
   (42 CFR 435.552(a)(3)); the calculation branch and the storage union both carry it.
4. **Community-service capture schema** — matches the verification guidance at
   91 FR 33400 field-for-field (org name + address, POC name + phone/email who can
   confirm hours, activity description, dates, hours), court-ordered flag present,
   not restricted to 501(c)(3).
5. **Citations** — every domain claim carries a CFR section and, where preamble, an
   FR page, and the cited text actually says what the code assumes (spot-checked
   against the raw rule). One trivially imprecise test name is noted (MINOR-1).
6. **Policy literals** — the computation reads `3` and `4.33` from the
   `educationCreditHourConversion` profile field; no hardcoded policy value in the
   compliance logic. The one place digits appear as literals is a **display string**
   in `ActivityForm.tsx` that is not under the policy-literal scan (MINOR-2). The
   4.33 is correctly kept distinct from `PAY_PERIOD_MULTIPLIERS.weekly`.

---

## Evidence

### 1. Credit-hour conversion — VERIFIED CORRECT

**Code.** `src/lib/education.ts`, `convertCreditHoursToMonthly()`:

```ts
const { hoursPerCreditPerWeek, weeksPerMonth } =
  policy.educationCreditHourConversion;
const monthly = creditHours * hoursPerCreditPerWeek * weeksPerMonth;
return Math.round(monthly * 100) / 100;
```

Profile values (`src/lib/policy/federalDefault.ts`):
`educationCreditHourConversion: { hoursPerCreditPerWeek: 3, weeksPerMonth: 4.33 }`
(both carry `// policy-literal-ok`).

**Primary source — regulatory text, `2026-11094.txt` (immediately before
`[[FR p.33471]]`, under the `[[FR p.33470]]` block that opens § 435.552):**

> (d) ... (1) For educational programs that use credit hours:
> (i) Multiply the number of each one credit hour of instruction by 3 to get the
> total of education hours in a week.
> (ii) Multiply the weekly total ... by 4.33 weeks to get total hours in a 1-month
> period.

**Primary source — worked example, preamble under `[[FR p.33359]]`:**

> ... 6 credit hours converts to 77.94 hours of monthly activity for community
> engagement (6 credit hours × 3 × 4.33 = 77.94), which is close to, but slightly
> less than, the 80 hours ...

The regulatory formula is at **91 FR 33470–33471** and the 77.94 figure is at
**91 FR 33359**. The module header cites exactly this split (`91 FR 33470-33471`
for the formula, `91 FR 33359` for the example). The rounding to cents is
defensible: the test file demonstrates `11 × 3 × 4.33` raws to
`142.89000000000001`, so `Math.round(x*100)/100` prevents a floating-point tail
being shown to a student (`src/lib/__tests__/education.test.ts`). Confirmed.

### 2. Half-time cliff — VERIFIED CORRECT

**Code.** `educationContribution()` returns a discriminated union:
`at-least-half-time` → `{ kind: "demonstrated-standalone", combinableHours: 0 }`;
`less-than-half-time` → `{ kind: "combinable-hours", ... }`; `unknown` →
`{ kind: "status-unknown", combinableHours: 0 }`. The type literally pins
`combinableHours: 0` for the standalone branch, so a caller cannot fold a
half-time student's enrollment into a combinable total. `ActivityForm.tsx`
mirrors this: `isHalfTimeStandalone` hides the hours field and stores 0;
`resolvedHours()` returns 0 for standalone.

**Primary source — regulatory text, § 435.552(a)(5) (before `[[FR p.33471]]`):**

> (5) The individual engages in any combination of the activities ... for a total
> of not less than 80 hours; however, States are not permitted to combine
> educational program hours with another activity if the individual is enrolled in
> an educational program at least half-time.

**And § 435.552(e)(1):**

> (1) The hours for work ... community service ... and participating in a work
> program ... need only be combined with educational program hours if the
> individual is enrolled in an educational program less than half-time.

This is precisely the cliff: at-least-half-time qualifies alone (a)(4) and cannot
be combined (a)(5)/(e)(1); less-than-half-time converts (d) and combines (e). The
implementation enforces it at the type level, which is stronger than copy alone.
Confirmed.

**Enrollment status is the school's.** § 435.552(c): "An applicable individual's
enrollment status ... is determined by the school or institution." The code treats
`"unknown"` as a first-class value and never infers status from an hours figure
(`education.ts` header; `ActivityForm.tsx` requires the user to pick a status and
offers "I'm not sure"). This also satisfies the resolved-blocker item 3 (existing
rows → `unknown`, never migrated to less-than-half-time). Confirmed.

### 3. `workProgram` pathway — VERIFIED CORRECT

**Code.** `src/types/index.ts` `Activity.type` union includes `"workProgram"`;
`src/lib/calculations.ts` has a dedicated `case "workProgram"` branch summing
`workProgramHours`, with a comment noting that before W6a the switch had no
default so a workProgram row contributed nothing silently.

**Primary source — § 435.552(a)(3) (before `[[FR p.33470]]`):**

> (3) The individual participates in a work program for not less than 80 hours.

The `workProgram` definition in `helpText.ts` correctly reproduces the closed
list of five program types (WIOA title I; Trade Act § 236; Governor-approved
State/local E&T incl. SNAP E&T; DOL/VA veterans programs; SNAP workforce
partnerships) and correctly excludes health-provider-operated programs and
Medicaid 1915(c)/(i) supported employment — both verified against the regulatory
definition of "Work program" at § 435.552(b) and the preamble work-program
discussion (under `[[FR p.33357]]`). The subsidiary-job-search nuance ("less than
half the required hours of the program") matches § 435.552(b)(iii) verbatim.
Confirmed.

### 4. Community-service capture schema — VERIFIED CORRECT

**Code.** `src/types/index.ts` `CommunityServiceDetails`:
`organizationName`, `organizationAddress`, `pointOfContactName`,
`pointOfContactPhone`, `pointOfContactEmail`, `activityDescription`,
`courtOrdered`. `ActivityForm.tsx` populates all of these for `type === "volunteer"`.

**Primary source — verification guidance under `[[FR p.33400]]`:**

> ... examples of the information that would support a determination may include
> documentation containing details about the general nature of the program; the
> dates and hours of community service completed; a description of the community
> service activity; the organization's name and address; and the name and contact
> information (such as phone number and/or email address) of a point of contact at
> the organization who can confirm the hours completed.

Every named element maps to a field. The `CommunityServiceDetails` doc comment
cites "91 FR 33400" and "§ II.I.6.b" — correct.

**Court-ordered & 501(c)(3).** `courtOrdered?: boolean` present; the regulatory
definition of "Community service" (§ 435.552(b)) reads "unpaid work, completed
voluntarily or because of a mandate by court order," and expressly includes
"organizations described in section 501(c)(3) ... **and other organizations**."
The preamble under `[[FR p.33356]]` adds that a "State must not restrict community
service to activities with an organization described in section 501(c)(3)." The
`volunteer` definition in `helpText.ts` states both ("voluntary or court-ordered —
both count"; "It doesn't have to be a 501(c)(3)") and cites 91 FR 33356. Confirmed.

### 5. Citations present and accurate — VERIFIED (one trivial imprecision)

Spot-checked every FR page marker cited in the reviewed files against the raw
text:

- § 435.552 regulatory body and (a)(1)–(7), (b), (c), (d), (e): opens under
  `[[FR p.33470]]`, runs to `[[FR p.33471]]`. Code citing "91 FR 33470" /
  "33470-33471" — **correct**.
- 77.94 worked example: `[[FR p.33359]]` — code citing "91 FR 33359" — **correct**.
- Community-service verification schema: `[[FR p.33400]]` — **correct**.
- Court-ordered / 501(c)(3) preamble: `[[FR p.33356]]` — **correct**.
- Noncompliance 30-day / 5-day receipt, documentation-from-2028, etc. in
  `federalDefault.ts`: markers at `[[FR p.33476]]`, `[[FR p.33477]]`,
  `[[FR p.33474]]` — **consistent** with the cited section-to-page mapping.

See MINOR-1 for the single imprecise test-name page reference.

### 6. No hardcoded policy value in compliance logic — VERIFIED (one display-string gap)

- `education.ts` reads both operands from `policy.educationCreditHourConversion`;
  `education.test.ts` includes a load-bearing injected-profile test (doubled
  `weeksPerMonth` ⇒ doubled result) that proves derivation, not a constant.
- `calculations.ts` reads `policy.requiredHours`; no literal `80`.
- `src/lib/education.ts` is in the TIER_1 scan list in
  `src/lib/__tests__/policyInjection.test.ts` (lines ~248–250), so a reintroduced
  `3`/`4.33`/`80` literal there would fail the build. Confirmed.
- The 4.33 Carnegie constant is explicitly kept separate from
  `PAY_PERIOD_MULTIPLIERS.weekly` (52/12, gap 5.4, W7a): both `types.ts` and
  `payPeriodConversion.ts` carry cross-referencing comments warning against
  collapsing the two. Confirmed — the two 4.33s are never shared.

---

## Findings

### MINOR-1 — Imprecise FR page in one test name (cosmetic)

`src/lib/__tests__/education.test.ts:38`

```ts
it("§ 435.552(d)(1), 91 FR 33471: 6 credit hours convert to 77.94 monthly hours", () => {
```

The **77.94** figure is CMS's worked example at **91 FR 33359**, not 33471. 33471
is where the regulatory formula (d)(1) sits (and the result is not printed there).
The `describe` header one line up correctly says "91 FR 33470-33471" for the
formula, and the inline comment correctly cites "91 FR 33359" for the example — so
the information is all present and correct; only the test *name* attaches the
result figure to the formula's page. Non-blocking.

**Recommendation:** rename to `"§ 435.552(d)(1), 91 FR 33359: 6 credit hours
convert to 77.94 monthly hours"` (the page where that number appears), or
`"...91 FR 33470-33471 (example at 33359)..."`.

### MINOR-2 — Display formula hardcodes `3` and `4.33` outside the policy scan

`src/components/ActivityForm.tsx:754`

```tsx
{parseFloat(creditHours) === 1 ? "" : "s"} × 3 × 4.33 ={" "}
<strong>
  {educationContribution({ status: "less-than-half-time",
    creditHours: parseFloat(creditHours) }).combinableHours.toFixed(2)}{" "}
  hours
</strong>{" "}
this month (42 CFR 435.552(d)).
```

The **computed** value is correct and profile-injected via `educationContribution`.
But the **displayed formula operands** `3` and `4.33` are literal JSX text, not
interpolated from `policy.educationCreditHourConversion`. `ActivityForm.tsx` is in
**neither** the `TIER_1` nor the `COPY_AND_UI` list in `policyInjection.test.ts`,
so this string escapes the policy-literal scan entirely. If a future profile ever
carried a different conversion (the field exists precisely so it can be
versioned/dynamic per ADR-0001), the shown formula would silently contradict the
computed result.

This is MINOR because (a) the arithmetic shown is CMS's exact published example
and dynamic-only if CMS revises the standard, and (b) the result itself is derived,
not hardcoded. But it is the one spot where the "no policy literals in strings"
rule (`compliance-copy-standards.md`) is not mechanically enforced for W6a's work.

**Recommendation (pick one):**
- Interpolate the operands from `FEDERAL_DEFAULT.educationCreditHourConversion`
  (mirroring how `helpText.ts` interpolates `HOURS`/`INCOME`/`WAGE`), **and** add
  `src/components/ActivityForm.tsx` to the `COPY_AND_UI` scan list so the guard
  catches a reintroduction; or
- If the literal display is intentional (the formula is the published Carnegie
  standard, not a per-state value), annotate the line with a `policy-literal-ok`
  rationale comment and still add the file to the scan list so the suppression is
  explicit rather than invisible.

---

## Observations (not findings)

- **O1 — ActivityForm not in the render-guard (part 1).** The wave instruction says
  "add every new component to the no-verdict render guard in the same commit that
  creates it." `ActivityForm.tsx` is **not** registered in
  `src/__tests__/no-verdict.render.test.tsx`. However, ActivityForm is a
  *pre-existing* component extended by W6a (not newly created), it is Dexie/document-
  backed (the render guard explicitly scopes itself to props-driven components and
  defers DB-backed surfaces to the source scan), and its new W6a copy is caught by
  the recursive `src/`-wide **source** scan in `no-verdict.source.test.ts`. The new
  strings are also defensively worded ("may be enough on its own," "Your state
  decides what counts"). So the guard coverage exists via part 3; only the
  interactive render path is unverified. Worth a line in the wave file either way,
  given the instruction's emphasis and that two of W2b's four blocking findings were
  fresh instances of defects a guard already covered.

- **O2 — `isCompliant` verdict field persists in `MonthlySummary`.** `types/index.ts`
  and `calculations.ts` still expose `isCompliant: boolean`. This is a known,
  documented debt (comment: "NAME IS A VERDICT — renamed meetsHoursThreshold in W7b
  (ADR-0003). No production reader") and is explicitly out of W6a's scope, so it is
  not a W6a defect. Flagged only for completeness.

- **O3 — No Dexie change, as required.** `git diff src/lib/db.ts` is empty.
  `workProgram` is a new *value* in the already-indexed `type` field and the new
  `Activity` fields (`workKind`, `enrollmentStatus`, `educationProgramType`,
  `creditHours`, `communityService`) are unindexed nested data — correctly treated
  as needing no version bump per `data-migration-standards.md`. Consistent with the
  "already decided: no Dexie version bump" constraint.

---

## Conclusion

W6a's activity model is a faithful implementation of 42 CFR 435.552 for the five
reviewed concerns. The credit-hour conversion, the half-time cliff, the
`workProgram` pathway, and the community-service verification schema all match the
regulatory text and preamble verbatim, with accurate CFR + FR citations. Policy
values are injected, not hardcoded, in the compliance logic, and the two coincident
`4.33` constants are deliberately kept apart.

The only actionable items are two MINOR issues: a cosmetic FR-page imprecision in
one test name (MINOR-1), and a display-only formula string in `ActivityForm.tsx`
that hardcodes `3`/`4.33` and sits outside the policy-literal scan (MINOR-2).
Neither changes a computed number or a legal claim. Recommend addressing MINOR-2
during convergence (interpolate or annotate, and add the file to the `COPY_AND_UI`
scan list) and MINOR-1 opportunistically.
