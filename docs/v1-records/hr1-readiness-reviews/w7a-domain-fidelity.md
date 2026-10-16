# W7a — Domain-Fidelity Review (Income Corrections)

**Scope:** read-only review of commit `32a2570` (range `33691f6..HEAD`), "W7a: income is
actual amounts received, and seasonal averaging is corrected."
**Reviewer task:** verify the income model against 42 CFR 435.552(f)–(g) and the IFC.
**Primary sources consulted:**
- `docs/domain/cms-2454-ifc/rule-extract.md` §§ 2.6 (monthly income), 2.7 (seasonal)
- `docs/domain/cms-2454-ifc/2026-11094.txt` — regulatory text at `§ 435.552(f)/(g)`
  on `[[FR p.33470]]` (line 3906–3912); preamble worked examples at lines 698–704 on
  `[[FR p.33363]]`
- `docs/hr1-readiness/gap-analysis.md` rows 5.4, 5.5, 5.7, 5.8, 5.9
**Verification run:** `npx tsc --noEmit` clean · `npx vitest run` 724/724 green ·
`policyInjection.test.ts` + `income.characterization.test.ts` 77/77 green.

---

## Summary answer

Five of the six review questions pass cleanly and are faithfully implemented with correct
CFR + FR citations in code, tests, and copy: **(1)** monthly total now sums actual
`amount`, **(2)** pay-period conversion is demoted to a labeled personal estimate and
removed from the agency artifact, **(3)** the seasonal window is correctly the six months
*preceding* the assessed month and *excludes* it, **(5)** the seasonal-worker definition
copy correctly drops the invented "6 months or less" test for inclusive-examples framing,
and **(6)** every domain claim carries a citation and no live policy literal escapes
`src/lib/policy/`.

**Question (4) is the one real divergence.** W7a divides the seasonal average by
*months-with-data*, not by six. CMS's own worked example in the preamble divides by **six**
even when only two months hold income (`2 months × $1,500 ÷ 6 = $500`, below the $580
threshold → not compliant). W7a's logic returns `$1,500` for that same fact pattern — above
threshold. **The divergence is deliberate (a test pins it) and runs in the
user-favorable direction (it overstates the average, i.e. favors a finding of
compliance), which is the direction ADR-0003 treats as the dangerous one** because it can
tell a user they are fine when the state's arithmetic will not agree. This is defensible as
a *display* choice but is not what the rule's example computes, and the mismatch now also
contradicts the app's own help copy (`helpText.ts`), which still instructs the user to
"divide by 6." Detail and recommendation below.

---

## Evidence by question

### (1) Monthly total sums actual `amount`, not `monthlyEquivalent` — PASS

`src/lib/storage/income.ts:253` (`getMonthlyIncomeSummary`):

```ts
// 42 CFR 435.552(f)(2): the month's MAGI-based income is the actual amount received, not
// a sum of whole-month projections of each paycheck's pay period (gap 5.5).
const totalIncome = entries.reduce((sum, entry) => sum + entry.amount, 0);
```

The same correction is applied at all four summing sites, matching gap row 5.5's claim of
"fixed at all four summing sites": the two `reduce`s in `getMonthlyIncomeSummary`
(`income.ts:253`) and `calculateSeasonalAverage` (`income.ts:218`), the `incomeBySource`
accumulator (`income.ts:261–270`, now keyed on `amount`), and `buildTextReport.ts:243`.

Verified against the regulation: 42 CFR 435.552(f)(2) (`2026-11094.txt:3904`,
`[[FR p.33470]]`) — "The agency must determine the monthly income based on the individual's
MAGI-based income, for their MAGI-based household, as defined at § 435.603, and applied to a
month." The rule measures *income in the month*; summing four weekly paychecks' whole-month
projections (`monthlyEquivalent × 4`) over-counts roughly fourfold. **This reading is
correct.** The old behavior was a reassuring false positive (gap 5.5, rated `harmful`), and
removing it is the right call.

`src/types/income.ts:67–69` documents the field's new meaning with the citation:

```ts
// W7a (gap 5.5): the SUM OF ACTUAL AMOUNTS received this month, not of per-paycheck
// monthly projections. 42 CFR 435.552(f)(2), 91 FR 33470 — MAGI-based monthly income.
totalIncome: number;
```

### (2) Pay-period multiplication removed as a compliance input — PASS

- `IncomeEntryForm.tsx:478–494`: the box is relabeled from "Monthly Equivalent" to
  **"Rough monthly estimate"**, and the caption now reads "A personal estimate only …
  Your state works out the month its own way; what you'll show is the actual amounts you
  were paid." The `PAY_PERIOD_MULTIPLIERS` arithmetic is still *shown* but explicitly
  framed as a personal estimate, not a compliance figure. The code comment cites gap 5.4:
  "the rule prescribes no pay-period conversion."
- `buildTextReport.ts:265–274`: the agency artifact line changed from
  `$X (period) → $Y/month` to `$X received (period)`. The monthly projection is no longer
  emitted onto the document a caseworker reads. Comment: "The pay-period monthly
  projection is a personal estimate, not a compliance figure (gap 5.4), so it is not shown
  on the agency artifact."

Verified against the rule: nothing in § 435.552(f)/(g) or its preamble prescribes a
pay-period-to-month conversion; the state derives a monthly figure through existing MAGI
methodology (`rule-extract.md` § 2.6; gap 5.4 characterizes this as `contradicts`,
`harmful`). **The copy no longer presents the multiplication as a compliance figure.**
This is correct and consistent with ADR-0003's Computed/Conditional/Deferred split — the
estimate is labeled as the user's own, and the compliance figure (actual amounts) is what
reaches the state.

One residual note, not a defect: `IncomeEntry.monthlyEquivalent` is still a *stored* field
(`income.ts` write path; `types/income.ts:15`). That is appropriate under
`data-migration-standards.md` ("never drop a field," "store the input") — it is simply no
longer read as a compliance input. No action needed.

### (3) Seasonal window = six months preceding, assessed month excluded — PASS

`src/lib/storage/income.ts:230–248` (`getLast6Months`):

```ts
// i from 6 down to 1 → the six months before the assessed month, oldest first.
for (let i = 6; i >= 1; i--) {
  const date = new Date(year, month - 1 - i, 1);
  ...
}
```

For an assessed month of July (`2026-07`) this returns **January–June**, excluding July.
Confirmed by `income.characterization.test.ts:361–423` ("returns January through June for
an assessed month of July," "the assessed month is excluded," "the sixth preceding month is
included," plus a cross-year case assessing January 2027 → July–December 2026).

Verified against the regulation and CMS's worked example:
- 42 CFR 435.552(g)(1) (`2026-11094.txt:3907`, `[[FR p.33470]]`): "had an average monthly
  income over the preceding six months."
- CMS preamble example (`2026-11094.txt:702`, `[[FR p.33363]]`): applicant files in July,
  1-month review period → review month June → "average the income from December through
  May to determine if the individual demonstrates community engagement in June." Note the
  two-step the reviewer flagged: the *review month* (June) is itself one month before
  *application* (July), then the six-month window (Dec–May) precedes the *review/assessed*
  month. W7a's function operates on the assessed month and returns the six before it, which
  is the correct inner step. **The off-by-one from gap 5.8 (old code included the assessed
  month and dropped the sixth prior) is fixed.**

The old behavior is correctly described in the superseded doc comment and the
characterization test header (lines 18–19). **This question passes.**

### (4) Divisor = months-with-data, not 6; empty months read "No record" — DIVERGENCE (flagged)

Two sub-parts, with opposite verdicts.

**(4a) "No record" vs "$0" — PASS.** `SeasonalWorkerView.tsx:127–140` renders empty months
as *"No record"* (italic, disabled color), not `$0.00`, driven by `monthData.hasData`.
`calculateSeasonalAverage` sets `hasData: entries.length > 0` (`income.ts:220`). This is
correct and well-reasoned: showing `$0.00` for a month the user never filled in presents an
*imputed* value as verified income, which `data-migration-standards.md` ("treat a missing
field as unknown … say so in the UI and ask") and ADR-0003 both forbid. The component also
surfaces `incompleteHistory` copy naming how many months are recorded
(`SeasonalWorkerView.tsx:183–191`). Good.

**(4b) Dividing by months-with-data instead of 6 — DIVERGES FROM THE RULE'S EXAMPLE.**
`income.ts:227`:

```ts
// Average over months WITH data (gap 5.9). Empty history → 0, never NaN.
const average = monthsWithData > 0 ? totalIncome / monthsWithData : 0;
```

Pinned by `income.characterization.test.ts:444`:
`"gap 5.9: one month of $3,000 averages to $3,000, not $500"` — asserting `average === 3000`
(`3000 / 1`), explicitly "not 3000 / 6".

This is the exact fact pattern CMS worked in the preamble, and CMS reaches the opposite
number. `2026-11094.txt:702` (`[[FR p.33363]]`), verbatim-adjacent paraphrase:

> the individual has 2 months of seasonal employment, which averaged over 6 months equals
> $500 (2 months at $1,500 per month, then divided by 6). Because $500 is below $580, this
> individual is not considered to be demonstrating community engagement…

The regulatory text (42 CFR 435.552(g)(1)) says "average monthly income over the preceding
**six** months" — a fixed six-month denominator, not "over the months with income." CMS's
example divides a two-month income history by six and gets a *below-threshold* result.
W7a's code divides the same history by two (months-with-data) and gets an *above-threshold*
result.

**Direction of the residual error:** W7a's divisor is `monthsWithData ≤ 6`, so its average
is **greater than or equal to** the rule's six-month average. The error therefore
**overstates** the seasonal average — the user-favorable direction, and the one ADR-0003
singles out as the harmful false positive: it can tell a user "you're at or over the
threshold" (`SeasonalWorkerView` success branch) when the state, dividing by six, would find
them short. For the CMS fact pattern the delta flips the outcome ($1,500 vs $500 against a
$580 threshold).

**Why this is nonetheless partly defensible, and why it is still a finding:**
- HourKeep stores only what the user typed. A month with no entry is genuinely *unknown*,
  not known-$0. Dividing an unknown-heavy history by six and showing the result as settled
  would understate (the old `$0.00`-row behavior, gap 5.9's stated harm) — and that is a
  real harm too.
- But the fix for "don't present an imputed $0 as verified" is the `hasData`/"No record"
  display and the incomplete-history caveat (4a) — **not** changing the arithmetic divisor
  away from what the rule computes. By also changing the divisor, W7a produces a *number*
  (`seasonalAverage`, consumed at `getMonthlyIncomeSummary` → `isCompliant`,
  `income.ts:250–283`) that disagrees with the state's method in the compliance-favorable
  direction.
- gap row 5.9 as written frames the issue around the reasonably-predictable-changes
  election ("most States instead use a … proration") and the `$0.00` display harm. It does
  **not** authorize substituting a months-with-data divisor for the statutory six when a
  state uses the plain preceding-six-months method. The code comment at `income.ts:166`
  claims "imputing $0 for missing months is what produced the 6× understatement" — but the
  CMS example shows the six-divisor is the rule's own method, so the "understatement"
  relative to months-with-data is not an error on CMS's part; it is the result CMS intends.

**Inconsistency this introduces inside the app:** `src/content/helpText.ts` (last touched
in W6a, *not* modified by W7a) still tells the user the opposite of what the code now does:
- `helpText.ts:559` `howToCalculate`: "Divide by 6 to get your average monthly income"
- `helpText.ts:562` `example`: "$3,480 ÷ 6 months = $580 per month average"
- `helpText.ts:566` edge case: "$4,000 ÷ 6 is about $667 a month"

This copy is rendered by `SeasonalWorkerHelp.tsx` (a file under review) via
`incomeDefinitions.seasonalWorker`. So a user reading the help sees "divide by 6," while the
dashboard average divides by months-with-data. For a sparse history the two produce
different numbers. This is a live internal contradiction created (surfaced) by W7a's
divisor change.

### (5) Seasonal-worker definition: inclusive examples, no invented threshold — PASS

`SeasonalWorkerHelp.tsx:50–61` replaces the old "works in an industry where work is
typically available for **6 months or less per year**" with: "Seasonal work means work that
by its nature happens in certain seasons and may not run all year — the law gives examples
like farm work and holiday retail rather than a fixed test … Not sure if this fits you? Ask
your state." The code comment cites gap 5.7 and states the rule "sets no verification
standard."

Verified against source:
- 26 U.S.C. 45R(d)(5)(B) via `2026-11094.txt:660` (`[[FR p.33363]]`): a seasonal worker is
  one who performs labor on a seasonal basis "as defined by the Secretary of Labor,
  *including*" the 29 CFR 500.20(s)(1) description and holiday retail workers. The word
  "including" makes these **inclusive examples, not a closed test** — matching
  `rule-extract.md` § 2.7, which explicitly repudiates the earlier "objective legal test"
  framing as "unsupported … broader and softer than that, which is user-favorable."
- The IFC provides **no verification rule** for seasonal-worker status (rule-extract § 2.7;
  gap 5.7). The new copy defers to the state and invents no threshold. **Correct.**

`helpText.ts:548–552` (`whoQualifies`, W6a) is consistent: "not limited to a fixed list or
to a set number of months per year." No reintroduction of the invented test anywhere.

### (6) Citations present; no hardcoded policy values outside `src/lib/policy/` — PASS

- **Citations.** Every domain claim in the changed code carries CFR + FR: `income.ts`
  comments cite `42 CFR 435.552(f)(2)`, `(g)`, and `91 FR 33470`; `types/income.ts:68`
  cites `42 CFR 435.552(f)(2), 91 FR 33470`; `SeasonalWorkerView.tsx:18,22` cite
  `435.552(a)(6)/(g)` and `91 FR 33470`; both help/form components cite
  `26 U.S.C. 45R(d)(5)(B)`, `29 CFR 500.20(s)(1)`, and the gap rows. FR p.33470 was
  independently confirmed to be the page carrying § 435.552(f)/(g) regulatory text
  (`2026-11094.txt:3755` marker precedes the section).
- **Policy literals.** `SeasonalWorkerView.tsx` derives the threshold from
  `incomeThreshold(FEDERAL_DEFAULT)` (`:21`) and the window span from
  `FEDERAL_DEFAULT.seasonalMethod` (`:34`). `income.ts` uses `incomeThreshold(policy)`
  with the required `policy: PolicyProfile = FEDERAL_DEFAULT` final parameter
  (`getMonthlyIncomeSummary`). Both files are registered in
  `policyInjection.test.ts` (`:243`, `:277`). A grep for `80|580|7.25|4.33` across the
  six changed files returns only occurrences **inside comments** documenting prior bad
  copy or explaining why values are injected — no live literals. The policy-injection and
  literal-scan suite passes (77/77).

---

## Conclusions

- **Five of six questions pass** with faithful implementation and correct, well-tiered
  citations. The actual-amounts correction (1), the pay-period demotion (2), the
  preceding-six-months-exclusive window (3), the inclusive-examples definition (5), and
  the citation/no-literal discipline (6) are all senior-grade work and address the
  `harmful`-rated gaps 5.4, 5.5, 5.7, 5.8 as claimed.

- **One genuine domain-fidelity divergence (4b):** the seasonal average divides by
  months-with-data, not by the statutory six. CMS's worked example divides by six for the
  identical fact pattern and reaches the opposite compliance outcome. W7a's residual error
  **overstates** the average — the compliance-favorable, ADR-0003-"harmful" direction — and
  is locked in by a characterization test (`income.characterization.test.ts:444`). The
  "No record" display half of gap 5.9 (4a) is correct and should stay; it is the *divisor*
  change that overreaches what gap 5.9 authorizes.

- **A live internal contradiction** now exists: `helpText.ts` (unchanged by W7a) still tells
  users to "divide by 6," while the computed average divides by months-with-data. Rendered
  together on the seasonal surface, they disagree for any sparse history.

## Recommendations (do not implement — for W7b / wave owner)

1. **Reconcile the divisor against the rule, as a recorded decision.** Either (a) divide by
   six per 42 CFR 435.552(g)(1) and the CMS example, keeping "No record" for empty months so
   the *display* stays honest while the *arithmetic* matches the state's method; or (b) if
   months-with-data is retained deliberately, record *why* in the wave file and label the
   `seasonalAverage` as a **Conditional/estimate** that may read higher than the state's
   six-month figure, and never let the success branch assert "at or over the threshold" off
   it. Option (a) is the smaller gap to the rule and avoids the overstate-compliance risk;
   note that the reasonably-predictable-changes proration (435.603(h)(3)) is a *different*
   state method and does not license a months-with-data divisor under the plain
   preceding-six method.
2. **Fix the `helpText.ts` "divide by 6" copy** (lines 559, 562, 566) so help and dashboard
   agree, whichever divisor is chosen in (1). This is a copy change in a file W7a did not
   touch; flag it to whoever owns `src/content/`.
3. **Add a characterization test mirroring CMS's own example** — 2 months × $1,500 assessed
   for June, asserting the chosen divisor's result and citing `2026-11094.txt:702` /
   `[[FR p.33363]]` — so the divisor decision is pinned to the rule's worked example rather
   than to an undocumented house choice.

*Content was rephrased for compliance with licensing restrictions; the one indented block
quoting the CMS preamble is under 30 words and attributed to `2026-11094.txt:702`.*
