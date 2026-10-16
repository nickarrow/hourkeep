# Actual-payment aggregation and seasonal income windows

## Summary

W7a replaces per-paycheck monthly-projection sums with actual amounts received across the tracking summary, source breakdown, seasonal history, and text export, and it moves the seasonal window to the six months preceding the assessed month. The actual-payment path removes the documented four-paycheck inflation, but the sparse-history implementation changes the regulatory divisor from six to the number of months containing entries. Surrounding consumers also remain joined to a different period or to the deprecated pay-period projection, so one user can still see incompatible income figures across assessment, status, and detail surfaces.

**Watch for:** **confirmed** — seasonal averages use the wrong divisor and can cross the threshold on a value CMS’s worked example puts below it; **confirmed** — incomplete histories still drive threshold-colored status despite having no representation for a confirmed $0 month; **confirmed** — the seasonal source breakdown and assessment converter use different figures from the corrected tracking summary; **confirmed** — the export regression test cannot distinguish `amount` from `monthlyEquivalent`.

**Verdict**: NEEDS_CHANGES

## High-level view

The non-seasonal aggregation now treats each entry as evidence of a payment received and sums `amount` at all four changed sites. **Confirmed concern:** the assessment flow still offers the old paycheck multiplier as a “Use This Amount” input to `monthlyIncome`, which the recommendation engine compares directly with the threshold, so gap 5.4 remains live outside the tracking dashboard.

Assessing July now selects the correct January–June window. **Confirmed concern:** `calculateSeasonalAverage` divides by `monthsWithData`, although 42 CFR 435.552(g) and CMS’s $3,000 ÷ 6 = $500 example require the six-month window as the divisor; the unchanged help content describes divide-by-six and therefore disagrees with the new summary.

The new `hasData` field distinguishes a missing record from a displayed `$0` row. **Confirmed concern:** that signal is advisory only—zero- and partial-month histories still produce `isCompliant`, `amountNeeded`, status colors, and threshold copy, while the form rejects $0 entries and provides no other way to mark a genuine no-income month as complete.

The seasonal dashboard combines two time scopes. **Confirmed concern:** the headline uses the January–June average, while `entryCount`, `incomeBySource`, and the visible entry list describe July; the source list therefore appears to explain a total it did not contribute to.

The text export now uses actual payment amounts and omits the projection from agency-facing lines. **Confirmed concern:** its fixture sets `amount === monthlyEquivalent`, so reverting the reducer would leave every export test green.

<details>
<summary>Issues (7)</summary>

1. **Wrong seasonal divisor** — **confirmed:** `calculateSeasonalAverage` divides by months containing entries, but § 435.552(g) and CMS’s worked example divide by all six preceding months. Restore the six-month divisor while retaining completeness metadata.
2. **Incomplete histories drive settled status** — **confirmed:** empty and partial windows still produce threshold branches, and users cannot mark a genuine $0 month complete. Model confirmed-zero/completeness separately and suppress settled comparison copy until the evidence window is complete.
3. **Seasonal source detail uses the assessed month** — **confirmed:** the headline is a preceding-window average while `incomeBySource`, `entryCount`, and the list describe the assessed month. Compute matching detail, hide it, or label the differing period explicitly.
4. **Assessment converter still uses the projection** — **confirmed:** “Use This Amount” sends pay-period multiplication into `monthlyIncome`, which drives recommendation selection. Keep the projection out of recommendation inputs.
5. **Cached projection remains on detail surfaces** — **confirmed:** the changed entry list renders persisted, potentially stale `monthlyEquivalent`, and the duplicate dialog presents it without the personal-estimate label. Derive estimates at render time and label or remove every remaining projection.
6. **Export correction lacks a discriminating test** — **confirmed:** export fixtures make `amount` equal `monthlyEquivalent`, so the old reducer would also pass. Add an actual-versus-projection fixture and assert the agency report uses only actual payments.
7. **Wave plan misstates the seasonal window** — **confirmed:** it says an assessed July averages December–May, contradicting the implementation and rule. Change it to assessed July → January–June, or application July → assessed June → December–May.

</details>

<details>
<summary>Details</summary>

### Pay-period projection remains a compliance input outside tracking

**Confidence: confirmed.** A second production path still treats the projection as monthly income:

```text
paycheck amount + frequency
        │
        ▼
IncomeConverter: amount × PAY_PERIOD_MULTIPLIERS
        │ “Use This Amount”
        ▼
AssessmentResponses.monthlyIncome
        │
        ▼
recommendationEngine: monthlyIncome >= incomeThreshold
```

`IncomeConverter` in `src/components/assessment/EstimationTools.tsx` labels the projection “Monthly income” and passes it through `AssessmentFlow` into `responses.monthlyIncome`; `recommendationEngine.ts` uses that value to select `income-tracking` or `seasonal-income-tracking`. The W7a plan carries this coupling into scope, and the target says pay-period multiplication is now only a personal estimate. A single weekly $150 paycheck can still become roughly $650 and drive an income recommendation as if it were recorded monthly income. Remove the projection from recommendation inputs or make it a visibly non-decisional estimate that cannot populate `monthlyIncome`.

The changed `IncomeEntryList` also reads persisted `entry.monthlyEquivalent`, a cached value already characterized as stale when its input changes. `DuplicateIncomeDialog` calls the same field “Monthly equivalent” without the personal-estimate qualification. Derive displayed estimates from `amount` and `payPeriod`, and label or remove the duplicate-dialog value so every surviving projection has the same non-compliance meaning.

### Seasonal averaging changes the six-month denominator

**Confidence: confirmed.** `calculateSeasonalAverage` selects the correct preceding months, but increments `monthsWithData` only when an entry exists and returns `totalIncome / monthsWithData`. The primary extract records CMS’s worked example: for the December–May window, two $1,500 months produce `$3,000 ÷ 6 = $500`, not `$3,000 ÷ 2 = $1,500` (`docs/domain/cms-2454-ifc/rule-extract.md`, § 2.7, lines 270–271).

The committed formula moves CMS’s example from below the $580 threshold to far above it, and the new test locks in that alternate divisor with “one month of $3,000 averages to $3,000.” The unchanged `incomeDefinitions.seasonalWorker` help says “Divide by 6,” so the help panel and dashboard give different answers for the same records. Keep `hasData` and `monthsWithData` as completeness metadata, but divide the regulatory total by the six-month window and update the tests to use the cited formula.

### Missing records still produce settled threshold signals

**Confidence: confirmed.** With no entries, `calculateSeasonalAverage` returns `0`; `getMonthlyIncomeSummary` turns it into `isCompliant: false` and a full `amountNeeded`; the two status components render an average, difference, warning color, and shortfall copy. With one high month, the partial average takes the success branch and says it is at or over the threshold “for these 6 months.” A later caption noting the missing months does not qualify the earlier status signal.

`IncomeEntryForm.validate` rejects amounts at or below zero, and `hasData` is `entries.length > 0`, so a user who genuinely earned $0 cannot distinguish that month from one they have not entered. Model month completeness or confirmed zero income separately from positive payments, and do not feed an incomplete or empty window into threshold-status branches. Add render tests for empty, partial, confirmed-zero, and complete histories.

### Seasonal headline and source detail describe different periods

**Confidence: confirmed.** For a July seasonal assessment, `effectiveIncome` is the January–June average, while `incomeBySource`, `entryCount`, and the changed entry list come from July. The component places July’s “Income Sources” directly beneath the January–June progress value without naming the period difference.

A $600 January–June average plus a $9,000 July payment renders a $600 headline followed by a $9,000 source breakdown, even though July is excluded from the average. Compute the breakdown for the seasonal window, hide it in seasonal mode, or label current-month records as excluded from the preceding-window average. Cover the join with materially different assessed-month and preceding-window income.

### Agency export correction has no discriminating regression

**Confidence: confirmed.** `buildTextReport` now sums `entry.amount`, but the export test helper assigns one value to both `amount` and `monthlyEquivalent`. Add a fixture such as `amount: 150, monthlyEquivalent: 649.5`—preferably four weekly payments—and assert that the report logs `$600.00`, not `$2,598.00`, and never presents the projection on entry lines.

Seasonal export remains explicitly assigned to W8a by the existing handoff; the gap here is narrower—the W7a actual-payment export correction itself is unprotected.

### Wave plan contradicts its implemented window

**Confidence: confirmed.** The new plan’s scope says “assessed July → average December–May,” while the implementation, tests, later explanation, and § 435.552(g) say an assessed July uses January–June. December–May is CMS’s example for an application filed in July whose assessed month is June. Change this to either “assessed July → January–June” or “application July → assessed June → December–May.”

### Validation and coverage boundaries

**Confidence: confirmed.** In an isolated worktree at committed HEAD, `git diff --check 33691f6..HEAD` passed and the targeted income-storage plus text-export suites passed 62 tests. The passing sparse test asserts the wrong denominator. **Not tested:** actual-versus-projection export behavior, the assessment converter’s recommendation effect, the seasonal headline/source-period join, and rendered empty/partial/confirmed-zero histories.

</details>

<details>
<summary>File map</summary>

- `docs/hr1-readiness/waves/wave-7a-seasonal-income-corrections.md` — defines the W7a/W7b boundary, rationale, and acceptance criteria.
- `src/__tests__/no-verdict.render.test.tsx` — updates fixtures for the expanded seasonal history shape.
- `src/components/help/SeasonalWorkerHelp.tsx` — removes the invented six-months-per-year test.
- `src/components/income/IncomeDashboard.tsx` — scopes entries to the selected month and passes completeness metadata.
- `src/components/income/IncomeEntryForm.tsx` — relabels pay-period multiplication as a personal estimate.
- `src/components/income/IncomeEntryList.tsx` — emphasizes actual payments and demotes the cached projection.
- `src/components/income/IncomeStatusIndicator.tsx` — renders actual source totals.
- `src/components/income/SeasonalWorkerView.tsx` — shows “No record” rows and sparse-history copy.
- `src/lib/export/buildTextReport.ts` — sums and prints actual payment amounts.
- `src/lib/storage/__tests__/income.characterization.test.ts` — specifies W7a aggregation and window behavior.
- `src/lib/storage/income.ts` — changes monthly/seasonal aggregation, window selection, and source totals.
- `src/types/income.ts` — adds actual source amounts and seasonal completeness metadata.

Full diff: `git diff 33691f6..HEAD`

</details>
