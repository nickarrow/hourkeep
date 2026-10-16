# W7a Non-Adjudication Review (ADR-0003)

**Scope:** Read-only review of wave W7a against ADR-0003 (evidence, not adjudication) and
`.kiro/steering/compliance-copy-standards.md`.
**Diff reviewed:** `33691f6..HEAD` (single commit `32a2570` — "W7a: income is actual amounts received, and
seasonal averaging is corrected").
**Changed source files reviewed:** `src/components/income/IncomeStatusIndicator.tsx`,
`src/components/income/SeasonalWorkerView.tsx`, `src/components/income/IncomeEntryForm.tsx`,
`src/components/income/IncomeEntryList.tsx`, `src/components/help/SeasonalWorkerHelp.tsx`,
`src/lib/export/buildTextReport.ts`, `src/lib/storage/income.ts`, `src/types/income.ts` (plus
`IncomeDashboard.tsx` wiring and the two test files that moved with them).
**Verification run:** `npx vitest run src/__tests__/no-verdict.render.test.tsx
src/lib/storage/__tests__/income.characterization.test.ts` → 93 passed. `git diff --name-only
33691f6..HEAD -- src/lib/db.ts` → empty (no schema change).

---

## Summary answer

**W7a is non-adjudication-clean. No finding rises to a blocker.** The wave did not introduce a verdict in
copy, in a type/field name, in a return value, or in behaviour. Every change moves the app *away* from
adjudication, not toward it:

- The headline change — summing **actual amounts received** instead of per-paycheck `monthlyEquivalent`
  projections, in all three summing sites and the export — removes a ~4× overstatement of a figure that was
  already deferred to the state. It makes the recorded number more honestly "what the user recorded," which
  is the correct posture.
- The new **"No record" vs "$0"** distinction and the **sparse-history notice** both correctly avoid
  asserting a determination while remaining useful. They refuse to impute `$0` for a month the user never
  filled in, which is exactly the "imputed value presented as verified" defect ADR-0003 guards against.
- The household total is **still Deferred** everywhere it appears; W7a strengthened, not weakened, the
  household-income disclosure on the export.
- The seasonal averaging span is **named as a state election** (42 CFR 435.603(h)(3)) on the component
  surface, with a next action.
- The entry form's **"Rough monthly estimate"** relabel clearly signals the figure is a personal estimate,
  not a compliance input — directly implementing ADR-0003's "optional, clearly labeled personal estimate"
  instruction.
- `MonthlyIncomeSummary.isCompliant` is **pre-existing**; W7a did **not** add a new verdict-named field and
  did **not** widen `isCompliant`'s reach. Its computation (`effectiveIncome >= threshold`) is structurally
  identical to before; only the inputs became more accurate.

Three **non-blocking observations** are worth recording (details below): two stale pre-existing help strings
that W7a's own arithmetic correction now contradicts, and a render-guard coverage gap for two of the touched
components. None of these is a verdict assertion; all are consistency / defense-in-depth notes.

---

## Evidence by layer

### (a) User-facing strings asserting a verdict — PASS

No new copy asserts "you are compliant," "you meet," "average meets," or similar. Checked positively:

- **`SeasonalWorkerView.tsx`** (lines ~200–244): both branches state the comparison, not a conclusion —
  `Average: … · Threshold: … (· Difference: …)`. The at-or-over branch says "That's at or over the
  threshold for these N months" and immediately hedges with the household basis and the different-stretch
  election plus a next action ("ask what it has on file"). The below branch surfaces the §435.552(e)(2)
  income-to-hours proxy ("A shortfall here isn't wasted…") plus the household two-sided message and a next
  action. This matches the required pattern in `compliance-copy-standards.md` ("Every hedge carries a next
  action").
- **`SeasonalWorkerHelp.tsx`** (lines 50–61): the rewrite removes an **invented** "6 months or less per
  year" test that was nowhere in 26 U.S.C. 45R(d)(5)(B) and replaces it with inclusive examples + "Ask your
  state." This is a correctness improvement and names the actor.
- **`IncomeEntryForm.tsx`** (lines ~479–495): "Rough monthly estimate" + "A personal estimate only …
  Your state works out the month its own way; what you'll show is the actual amounts you were paid." No
  verdict.
- **`IncomeEntryList.tsx`** (lines ~136–147): "`$X received` (period) · ~$Y/mo estimate." Neutral; the
  compliance-relevant figure (actual received) is emphasized and the projection is explicitly an estimate.
- **`buildTextReport.ts`** (lines ~237–280): comparison line (Logged/Threshold/Difference) plus a household
  note ("your state counts your whole tax household here … 42 CFR 435.603(d)-(f)"). The per-entry line now
  reads "`$X received (period)`" and drops the "→ $Y/month" projection from the agency artifact — correct,
  since the projection is not a compliance figure.

Guard confirmation: the no-verdict render guard passes for `SeasonalWorkerView` on all branches including
the new sparse-history branch (`no-verdict.render.test.tsx` lines ~994–1005), and asserts the positive twins
("No record", "based on the 2 months you've recorded"). The banned-phrase list (`support/verdictPhrases.ts`)
already carries `average meets` and `meets work requirements`; none of the new W7a strings trip any entry.

### (b) Type / field names encoding a verdict — PASS

- **`MonthlyIncomeSummary.isCompliant`** (`src/types/income.ts`) is **pre-existing** and explicitly deferred
  to W7b. W7a left it in place and *annotated* it: "NAME IS A VERDICT — W7b renames it with
  MonthlySummary.isCompliant (ADR-0003)." W7a did **not** add a new verdict-named field. The fields it added
  are neutral and descriptive: `seasonalMonthsWithData?: number`, and `hasData: boolean` inside
  `seasonalHistory` entries. `hasData` is a presence flag, not a determination.
- The breakdown field was **renamed** `monthlyEquivalent → amount` on `incomeBySource` — a move *away* from a
  projection toward the actual recorded figure. No verdict semantics introduced.
- `SeasonalWorkerViewProps` gained `monthsWithData: number` — descriptive, not a verdict. `isCompliant`
  remains a prop (pre-existing); W7a did not widen its use — it still only tints the border/average color
  and selects which hedged alert renders.

### (c) Return values collapsing to pass/fail — PASS

- `getMonthlyIncomeSummary` (`src/lib/storage/income.ts` ~lines 285–297) still returns the pre-existing
  `isCompliant: effectiveIncome >= threshold`. **Reach not widened**: the computation is byte-for-byte the
  same shape as before; only the *inputs* changed (`amount` instead of `monthlyEquivalent`;
  `calculateSeasonalAverage` now divides by months-with-data). W7a did not add any new boolean verdict to the
  return.
- `calculateSeasonalAverage` now returns `{ average, monthsWithData, history }` — richer, not more
  collapsed. The average is `monthsWithData > 0 ? totalIncome / monthsWithData : 0` (empty → 0, never NaN),
  and `monthsWithData` is surfaced precisely so the UI can *avoid* presenting a thin average as settled.

### (d) Behaviour — PASS, and net improvement

- **No capability was suppressed.** Nothing is hidden based on apparent status, so the "always leave a way
  back" rule is not implicated.
- **`getLast6Months` off-by-one fix** (gap 5.8): window now excludes the assessed month (July → Jan–Jun).
  This is arithmetic the state publishes (42 CFR 435.552(g)); showing it is Computed, not adjudicating.
- **"No record" vs "$0"**: previously a month with no entries rendered `$0.00` in disabled grey, which
  presented an imputed value as verified income. Now it renders "No record" in italic/disabled and is
  excluded from both the sum and the divisor. This is the single clearest non-adjudication win in the wave.
- **Export** no longer sums projections onto the artifact a caseworker reads (the comment notes it
  previously ~4×-overstated the figure "worse than on screen").
- **No schema change**: `git diff src/lib/db.ts` is empty, consistent with the "store the input, derive the
  output" rule — the derived figures changed, the stored `amount`/`monthlyEquivalent` inputs did not.

---

## Specific questions from the brief

1. **"No record" vs "$0" and the sparse-history notice** — *Correct.* Both avoid asserting a determination
   (they refuse to impute a value the user never entered) while staying useful (they tell the user to add
   missing months or ask the state). The notice is paired with a next action. ✅
2. **Every income number labeled Computed/Conditional/Deferred, every hedge paired with a next action** —
   *Substantially yes.* The averages and comparisons are Computed and shown with the threshold; the span is
   named Conditional (state election); the household total is Deferred (asked/pointed-to, never totaled).
   Each hedged alert ends with "ask your state … what they have on file / how they work out your average."
   One minor gap: see Observation 2 (stale help strings still state the span as settled fact). ✅ (with note)
3. **Household total still Deferred** — *Yes.* No code totals a household figure. `IncomeStatusIndicator`
   and the export both state the figure is "only your own income / one person's records" and that the state
   counts the whole household, pointing the user to the agency. ✅
4. **Seasonal averaging span named as a state election** — *Yes on the component.*
   `SeasonalWorkerView` comments and copy name 42 CFR 435.603(h)(3) and say the state "may work the average
   out over a different stretch." ✅ (but see Observation 2 for the stale help/indicator strings)
5. **Entry form "rough monthly estimate" repositioning** — *Clear.* "Rough monthly estimate" + "A personal
   estimate only" + "what you'll show is the actual amounts you were paid" unambiguously signals this is not
   a compliance figure. ✅

---

## Non-blocking observations

### Observation 1 — Pre-existing `isCompliant` name (tracked, not a W7a defect)
`src/types/income.ts` `MonthlyIncomeSummary.isCompliant` is a verdict-shaped name. It is **pre-existing**,
explicitly deferred to **W7b**, and annotated as such. No action for W7a. Flagging only so it is not lost:
the rename and the `effectiveIncome >= threshold` collapse should be addressed when W7b unifies the summary
type (ADR-0003's `meetsHoursThreshold`-style treatment).

### Observation 2 — Stale help/indicator strings now contradict W7a's own arithmetic
W7a corrected the window to the **6 months preceding** the assessed month (excluded) and the divisor to
**months-with-data**, but three *un-touched* strings rendered by a W7a-touched component still state the old
settled "divide by 6 / past 6 months" framing:

- `src/components/income/IncomeStatusIndicator.tsx` (~line 158): chip "Seasonal Worker - 6-Month Average"
  and caption "Your income is averaged over the past 6 months." ("past 6 months" now contradicts the
  "preceding, assessed-month-excluded" correction, and states the span as fact rather than a state election.)
- `src/content/helpText.ts` `incomeDefinitions.seasonalWorker.calculation` / `.howToCalculate` /
  `.example` (~lines 560–566), surfaced by the W7a-edited `SeasonalWorkerHelp.tsx`: "Divide by 6 to get your
  average," which now contradicts W7a's divide-by-months-with-data logic and the "No record" treatment.

These are **not verdict assertions** and so are out of the strict scope of this review, but they are
consistency defects created by W7a's correction and sit on surfaces W7a edited. Recommend aligning them with
the component copy (name the span as a state election; stop asserting "divide by 6") in W7a closeout or
explicitly handing them to W7b.

### Observation 3 — Render-guard coverage gap for two touched components
Per the W2b lesson ("extending a guard does not exempt the file that extends it"), note that
`IncomeEntryForm` and `IncomeEntryList` — both edited by W7a — are **not** mounted in
`no-verdict.render.test.tsx` (only `SeasonalWorkerView` and `IncomeStatusIndicator` among income components
are). Their new strings contain no verdict phrases and are covered by the source-scan layer
(`no-verdict.source.test.ts`), so risk is low. But the render guard is the layer that historically caught
what the source scan missed. Recommend adding mounted render-guard cases for `IncomeEntryList` (and the
`IncomeEntryForm` estimate panel) in a future wave for defense-in-depth. Not a W7a blocker.

---

## Conclusions and recommendations

**Non-adjudication verdict: APPROVED from the ADR-0003 standpoint.** W7a introduces no new assertion of
status in copy, types, return values, or behaviour, and materially improves the app's honesty about what it
does and does not know (actual-amounts summing, "No record" vs "$0," sparse-history hedge, the
personal-estimate relabel, the strengthened household disclosure on the export).

Recommended follow-ups (none blocking this wave on non-adjudication grounds):

1. Align the stale "divide by 6 / past 6 months" help and indicator strings with the corrected window and
   name the span as a state election (Observation 2) — fix in W7a closeout or hand to W7b with a note.
2. Carry the `isCompliant` rename/collapse into W7b as already planned (Observation 1).
3. Add mounted render-guard cases for `IncomeEntryList`/`IncomeEntryForm` in a later wave (Observation 3).

No fixes were made; this review is read-only.
