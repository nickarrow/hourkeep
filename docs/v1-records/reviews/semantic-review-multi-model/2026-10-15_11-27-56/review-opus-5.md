# W7a — income is actual amounts received, and seasonal averaging is corrected

Commit `32a2570` against `33691f6`. Twelve files, +497/−163.

The live 4× false positive is gone: `totalIncome` now sums each entry's actual `amount` at all four
summing sites, and I confirmed by grep that nothing outside the entry form and the entry list reads
`monthlyEquivalent` any more. The seasonal window is corrected in both directions (assessed July now
averages January–June, proven by tests that invert the old characterizations rather than deleting them),
unrecorded months render "No record" instead of a verified-looking `$0.00`, and the invented "6 months or
less per year" seasonal test is replaced with the rule's inclusive-examples framing plus a next action.
The sparse-history branch was added to the no-verdict render guard in the same commit, which is the
discipline W2b had to learn twice.

Watch for: the sparse-history divisor change (`÷ monthsWithData`) departs from CMS's own worked example,
which divides by 6 even when only two of the six months hold income — it can show an average up to 6× the
figure the state will compute, in the reassuring direction (**confirmed**; already reversed in the
uncommitted working tree, see the note below). The seasonal caveat exists only on `SeasonalWorkerView`,
while `IncomeStatusIndicator` renders the same average as the headline threshold comparison with no
provenance at all (**confirmed**). The export's fourth summing site is fixed but its test cannot fail:
the fixture sets `amount === monthlyEquivalent` with `payPeriod: "monthly"`, so a mutation back to the
projection stays green (**confirmed**). And the export has no seasonal path whatsoever, so a seasonal
worker's caseworker artifact prints a single month against the threshold with a "Difference" line that is
not the comparison § 435.552(g) prescribes (**confirmed**).

**Verdict**: NEEDS_CHANGES

> **The working tree has moved since the reviewed commit.** `git status` shows uncommitted edits to
> `income.ts`, `IncomeStatusIndicator.tsx`, `SeasonalWorkerView.tsx`, both test files, `CHANGELOG.md` and
> `gap-analysis.md` — including a reversal of the divisor to `÷ months.length` citing CMS's example. Issues
> below are against the committed diff; where the live tree already addresses one, I say so, and where the
> reversal creates a *new* mismatch with committed copy I raise that separately.

## High-level view

The core correction is right and the reasoning is recorded where the next wave will find it. Entries are
evidence of payment received, so the month's figure is `Σ amount`; `monthlyEquivalent` keeps its row but
stops being a compliance input. The four sites are genuinely all fixed, including the `incomeBySource`
accumulator that the W0 characterization test warned would survive a reduce-only fix.

The seasonal divisor is where the wave took a position the rule does not support. CMS's worked example
divides $3,000 by 6 and gets $500 with only two months holding income, because off-season months are
genuine zeroes. Dividing by the months that hold *records* answers a different question, and it flips the
error direction from understating (sends a user looking for hours they may not need) to overstating (tells
a user they are over the threshold when the state's arithmetic says otherwise). The display half of the
decision — "No record" rather than "$0" — is sound on its own; only the divisor needed to stay at the
window length. The live tree now does that, which leaves the committed caption ("based on the 2 months
you've recorded, not a full 6") describing arithmetic the code no longer performs, with a guard assertion
pinning that wording.

Provenance stops at the component boundary. `MonthlyIncomeSummary` now carries `seasonalMonthsWithData`,
but only `SeasonalWorkerView` consumes it. `IncomeStatusIndicator` reads `seasonalAverage` for the headline
number, the progress bar and `amountNeeded`, labels it with a flat "Seasonal Worker - 6-Month Average"
chip, and cannot say the history is thin. The three seasonal fields are three independent optionals, which
is why the dashboard needs a `?? 0` fallback whose copy would read "based on the 0 months you've recorded".

The export is the weakest join. W7a fixed its sum and declares that it blocks W8a, but `buildTextReport`
has no seasonal concept, so the one artifact a caseworker reads contradicts the on-screen comparison for
exactly the users the seasonal pathway exists for. The fix it did make is unpinned: no assertion in
`buildTextReport.test.ts` can distinguish `amount` from `monthlyEquivalent`.

Two policy-plumbing items. The averaging window length is a literal `6` in `getLast6Months`, in a Tier-1
module, while `policy.seasonalMethod.months` exists, is assigned to **W7a** in `POLICY_FIELD_OWNERS`, and
is already read from the profile by both `recommendationEngine.ts` and `SeasonalWorkerView.tsx`. The
POLICY_LITERAL scan cannot see a bare `6`, so no gate fires — the same blind-gauge shape as the `$580` bug.
Separately, the pay-period projection W7a demoted on the tracking surface still drives the assessment:
`EstimationTools` multiplies a paycheck into a monthly figure that becomes `responses.monthlyIncome` and is
compared against the threshold by the recommendation engine, so one weekly $150 paycheck routes a user as
"$650 a month" while the corrected tracking surface reports $600 for four of them.

Narrowing the dashboard list to the selected month was the right call and left loose ends behind it: the
list's empty state still says "No income entries yet… add your first entry" to a user with records in five
other months, its by-month grouping can now only ever produce one group, and the form still defaults new
entries to `new Date()`, so adding income while browsing another month saves it outside the list the user
is looking at.

<details>
<summary>Issues (14)</summary>

1. **Seasonal divisor departs from CMS's worked example** — `÷ monthsWithData` can show up to 6× the
   state's figure in the reassuring direction; CMS divides $3,000 by 6 even with two months of income
   (`rule-extract.md` § 2.7). Already reversed to `÷ months.length` in the uncommitted tree; commit it with
   the citation in the test name.
2. **Sparse caption will misdescribe the restored arithmetic** — "This average is based on the 2 months
   you've recorded, not a full 6" is false once the divisor is 6. Rewrite to "months you haven't filled in
   count as $0 here, which pulls the average down — add them if you have them," and update the guard
   assertion that pins the old wording.
3. **Guard fixture encodes the abandoned semantics** — the sparse case passes `average: 650` with history
   totals summing to $1,300 over six months, which is `1300 ÷ 2`. Under `÷ 6` it should be $216.67; the
   hand-built fixture no longer matches any code path.
4. **`IncomeStatusIndicator` has no sparse-history provenance** — it renders the seasonal average as the
   headline figure, the progress bar and `amountNeeded` while ignoring `seasonalMonthsWithData`, and its
   chip states "6-Month Average" as a flat fact. Pass the field through and caveat the comparison surface,
   not just the history card.
5. **Three parallel optional seasonal fields** — `seasonalAverage`, `seasonalHistory` and
   `seasonalMonthsWithData` can diverge, forcing `monthsWithData={summary.seasonalMonthsWithData ?? 0}` in
   the dashboard and a latent "based on the 0 months you've recorded" string. Collapse into one optional
   `seasonal?: { average, monthsWithData, history }`.
6. **Export has no seasonal path** — `buildTextReport` prints the assessed month's total against the
   threshold with a "Difference", which for a seasonal worker is not § 435.552(g)'s comparison. Either
   carry the average onto the artifact or say in the income block that a seasonal average is worked out
   separately.
7. **The export fix has no test that can fail** — `income(date, n)` sets `amount === monthlyEquivalent`
   with `payPeriod: "monthly"`, and nothing asserts the per-entry "received" line. Give the fixture a
   weekly pay period and distinct values so a mutation back to the projection goes red.
8. **Window length `6` is a literal in a Tier-1 module** — `getLast6Months` hardcodes it while
   `policy.seasonalMethod` exists and `POLICY_FIELD_OWNERS.seasonalMethod` names W7a as its owner. Give
   `calculateSeasonalAverage` the optional `policy: PolicyProfile = FEDERAL_DEFAULT` parameter and read the
   window from it, or amend the owner record to say W7a deliberately left it.
9. **The POLICY_LITERAL scan is blind to the window length** — the pattern covers 80, 580, 7.25, 4.33 and
   2.17 only, so neither the loop bound nor the "6-Month Average" strings can be caught. Extend the pattern
   or record the exclusion.
10. **The assessment path still treats a pay-period projection as income** — `EstimationTools` feeds
    `paycheck × PAY_PERIOD_MULTIPLIERS` into `responses.monthlyIncome`, which `recommendationEngine`
    compares against the threshold and uses to pick the recommended pathway. The wave file left this as
    "decide whether to keep it as a labeled estimate or let W7b remove it" and no decision was recorded.
11. **The stored projection is rendered beside the actual amount** — the characterization test pins that
    updating `amount` does not recompute `monthlyEquivalent`, so the two numbers on one list row can
    disagree. Derive the estimate at render from `amount` + `payPeriod` per "store the input, derive the
    output"; also relabel `DuplicateIncomeDialog`'s bare "Monthly equivalent: $X", the third surface
    showing that number.
12. **Month-scoped list leaves stale UI around it** — the empty state claims the user has no entries at
    all, the by-month grouping and header now always render a single group duplicating the page's month
    selector, and `selectedDate={new Date()}` means an entry added while browsing another month vanishes
    with no feedback.
13. **`getIncomeEntriesForLast6Months` is an exported trap** — no production caller, and it now excludes
    the assessed month, which is the opposite of what W7b's per-month roll-up needs. Say that in the doc
    comment or let W7b write its own query.
14. **Stale doc comments and bookkeeping** — `SeasonalWorkerView`'s `SEASONAL_MONTHS` block still says the
    component's average "still INCLUDES the assessed month (gap 5.8)", and the uncommitted gap-analysis
    closure line for 5.9 claims "averages over months-with-data (one $3,000 month → $3,000, not $500)",
    which the reverted code contradicts. Also: the acceptance criterion "no British spellings remain in
    income files" was scoped to files the handed-forward work never lived in — the six `programme` strings
    in `helpText.ts`, `CompletionMessage.tsx`, `calculator.ts` and `definitions.ts` are untouched.

</details>

<details>
<summary>Details</summary>

### The divisor, and the direction the error moved

The committed `calculateSeasonalAverage` accumulates only months where `entries.length > 0` and divides by
that count, so one recorded month of $3,000 reports a $3,000 average and the test asserts exactly that:
`expect(average).toBe(3000); // 3000 / 1, not 3000 / 6`.

`rule-extract.md` § 2.7 is the primary source and it is explicit:

> CMS worked example: applicant files in **July**, State has a 1-month review period → review month is
> **June** → average income from **December through May**. With 2 months at $1,500: `$3,000 ÷ 6 = $500`,
> which is below $580 → **not** compliant for June.

HourKeep genuinely cannot tell "earned nothing" from "hasn't typed it in", and the wave file reasons from
that to a different divisor. The inference does not hold: the user whose records are thin is exactly the
user for whom the state will compute $500 while HourKeep shows $3,000. Under the old `÷ 6` the app
understated and sent people looking for hours they might not need; under `÷ monthsWithData` it overstates,
which is the failure mode `getting-started.md` says the project cannot absorb. The display half of the
decision carries the honesty on its own — show "No record", count it as $0 as the state would, and tell the
user that filling the month in is what moves the number. That is what the uncommitted `income.ts` now does,
with the citation in the comment.

One consequence of the reversal needs following through, because it lands in copy that is already
committed and already asserted. The caption reads:

```tsx
This average is based on the {monthsWithData} month{…} you've recorded, not a full {history.length}.
```

Under `÷ 6` that sentence is wrong — the average *is* over a full six, with blanks counted as zero — and
the render guard pins the wording (`expect(text).toMatch(/based on the 2 months you'?ve recorded/i)`), so
the test will keep the inaccurate statement alive. The sparse fixture compounds it: `average: 650` against
history totals of $700 + $600 is `1300 ÷ 2`, an arithmetic relationship no code path produces any more.
Neither breaks a build, which is the problem — a hand-built fixture that cannot be reached by the
implementation stops being evidence about the implementation.

### Provenance stops before the surface that does the comparing

`MonthlyIncomeSummary` gained `seasonalMonthsWithData` and `seasonalHistory[].hasData`, and both are
consumed in exactly one component. The threshold comparison lives somewhere else:

```
getMonthlyIncomeSummary ──> isCompliant, amountNeeded, seasonalAverage ──> IncomeStatusIndicator
         │                                                                  (headline figure, progress
         │                                                                   bar, "$X needed", chip)
         └──> seasonalHistory + seasonalMonthsWithData ──────────────────> SeasonalWorkerView
                                                                            (per-month rows, "No record",
                                                                             the sparse caption)
```

`IncomeStatusIndicator` destructures `seasonalAverage` into `effectiveIncome` and renders it as
"{amount} recorded" with "That's at or over $580 for this month", or as "{amountNeeded} needed" — with no
access to how many months stand behind it. Its chip says "Seasonal Worker - 6-Month Average" and, in the
committed version, "Your income is averaged over the past 6 months" (the uncommitted tree improves that
caption to name the preceding window and the state's discretion, which is the right correction and still
says nothing about unrecorded months). The guard fixture for this component sets `isSeasonalWorker: false`
and omits every new field, so the seasonal branch of the surface that frames the comparison is unrendered
by any test.

Inside `SeasonalWorkerView` the same split appears one level down: `incompleteHistory` gates only the
caption, while the success Alert says "That's at or over the threshold for these 6 months" regardless of
how many of them hold anything.

The shape of the type is what permits this. Three independent optionals can disagree, and the dashboard
already pays for it:

```tsx
monthsWithData={summary.seasonalMonthsWithData ?? 0}
```

Reachable or not today, `0` is the one value that makes the caption lie in the user-unfavourable direction
("based on the 0 months you've recorded"). One optional object with all three fields makes presence a
single check and deletes the fallback.

### The export: right sum, no seasonal, no discriminating test

The fourth summing site is fixed and the per-entry line now reads `$400.00 received (bi-weekly)` rather
than projecting to a monthly figure. Two gaps sit on top of it.

`buildTextReport` has no seasonal concept at all — `grep -rni seasonal src/lib/export src/app/export`
returns nothing. For a user the app has flagged as seasonal, the report prints the assessed month's own
total against the $580 threshold plus a "Difference" line, while the screen tells them the operative figure
is a six-month average of the *preceding* months. The on-screen view and the printed artifact now disagree
about which comparison matters, and the artifact is the one that reaches a caseworker. W7a's own wave file
says it blocks W8a for precisely this reason.

The test cannot see the fix it is supposed to prove:

```ts
function income(date: string, monthlyEquivalent: number): IncomeEntry {
  return { userId: "user-1", date, amount: monthlyEquivalent, payPeriod: "monthly",
           monthlyEquivalent, createdAt: NOW, updatedAt: NOW };
}
```

Every income assertion in the file uses it, so `Logged: $380.00` holds whether the reduce sums `amount` or
`monthlyEquivalent`, and the `payPeriod: "monthly"` multiplier of 1 removes the last chance of divergence.
Nothing asserts the "received" line or the absence of the old `→ $X/month`. The acceptance criterion
("the export's income block sums actual amounts") names an observable that does not discriminate — the
same mutation-survivability trap the W0 characterization test flagged for the `incomeBySource` site and
which the author handled correctly there.

### Policy plumbing: the one window length that is still a literal

`getLast6Months` is now the only place in the codebase where the averaging window is written as a number:

```ts
for (let i = 6; i >= 1; i--) {
```

`recommendationEngine.ts` reads the same quantity from the profile, and so does `SeasonalWorkerView`'s
`SEASONAL_MONTHS`. `POLICY_FIELD_OWNERS.seasonalMethod` names the owner as **W7a**, with the reason "W7a
fixes the seasonal averaging window and implements the reasonably-predictable-changes alternative" — and
`calculateSeasonalAverage` takes no `policy` parameter at all, which the wave's own process rule requires
of new and changed compliance modules. The wave file's decision to leave the
reasonably-predictable-changes path to copy is defensible and recorded; the field-owner record claiming it
is implemented is not, so one of the two should move.

The gate cannot catch it either. `POLICY_LITERAL` matches `80|580|7\.25|4\.33|2\.17` plus a currency arm,
so a bare `6` in a loop bound and the string "6-Month Average" both pass clean. The file's own long comment
about the `$580` blindness is the argument for extending it here.

While on raw arithmetic: the loop relies on `new Date(year, month - 1 - i, 1)` normalising a negative month
index, which `data-migration-standards.md` names as the banned pattern ("never `new Date(...)` arithmetic
across month boundaries"). It is correct today and covered by the cross-year test, and the comment is
honest about the reliance — but `date-fns` is already a dependency and `subMonths` would satisfy the
standard on a line this diff rewrote anyway.

### The projection is demoted on one surface and still decisive on another

W7a's position is that pay-period multiplication is a personal estimate, not a compliance input. That holds
on the tracking surface. It does not hold on the assessment surface, which is the one that routes the user:

```
EstimationTools (paycheck × PAY_PERIOD_MULTIPLIERS) ──> onUseValue ──> responses.monthlyIncome
                                                                            │
                                                  recommendationEngine: monthlyIncome >= incomeMinimum
                                                        ──> "income-tracking" / "seasonal-income-tracking"
```

One weekly $150 paycheck entered there becomes `$650 a month`, clears $580, and the engine reports "You
told us about $650 a month" while the corrected tracking surface reports $600 for four such paychecks.
`EstimationTools.tsx`'s own comment says "W7a owns replacing them"; the wave file lists it as
carried-forward cleanup with "Decide whether to keep `EstimationTools` as a labeled estimate or let W7b
remove it with the fork", and the commit neither changes it nor records a decision. Either outcome is fine;
the undispositioned state is what should not survive closeout.

The same projection has a second life on the entry row:

```tsx
<strong>{formatCurrency(entry.amount)} received</strong> ({getPayPeriodLabel(entry.payPeriod)}) · ~
{formatCurrency(entry.monthlyEquivalent)}/mo estimate
```

The label is right, and now there are two numbers on one row whose consistency depends on the stored field
being recomputed — which the characterization test at `income.characterization.test.ts:126` pins as *not*
happening on an `amount` update. The UI's save path recomputes, so today they agree; the duplicate path
copies the stored value, and any future writer that touches `amount` alone leaves a row showing "$400
received · ~$868/mo estimate". `data-migration-standards.md` has the answer already — "store the input,
derive the output" — and `calculateMonthlyEquivalent` is a pure function sitting right there. Meanwhile
`DuplicateIncomeDialog` still identifies entries by "Monthly equivalent: $X" with no estimate framing, so
the relabeling sweep covered two of the three surfaces that show this number.

### The narrowed entry list, and what it left behind

Moving the list to `getIncomeEntriesByMonth(userId, currentMonth)` was forced by the corrected seasonal
window, and the comment says so. Three things did not follow it.

The empty state is now wrong for most users who see it: "No income entries yet" / "Click the + button
below to add your first income entry" is what a user browsing a quiet June sees even with five other months
of records, which drops the one fact that would stop them re-entering data. `component-standards.md` asks
empty states to say what to do next; the next thing here is usually "check another month".

The month-grouping machinery in `IncomeEntryList` — `entriesByMonth`, `monthKeys`, `formatMonthHeader` and
an `<h6>` month header — can now only ever produce one group, and that header restates the page's month
selector.

And the form is still constructed with `selectedDate={new Date()}  // Default to today`, so on any month
other than the real current one a new entry is written outside the window the list displays and simply does
not appear. The mismatch predates this diff, but the single-month list is now the only thing the user has
to reason with, and the save succeeds silently.

### Test coverage

The characterization suite was inverted test-by-test rather than deleted, each name carrying its gap row
and the preserved block comments keeping the record of what was wrong in the file that proved it — including
the "would stay green under a reduce-only fix" case for `incomeBySource`. `npx tsc --noEmit` is clean and
the full Vitest run was green when I took it (34 files, 724 tests, ~43s).

Not tested: the export's per-entry format and the `amount`-vs-`monthlyEquivalent` distinction (the fixture
makes them identical); `IncomeStatusIndicator`'s seasonal branch, including the chip copy and the average
rendered as the headline comparison; `incomeBySource` rendering anywhere, which is the field whose shape
this diff changed; and the browser. No e2e spec touches an income surface, though the changed strings are
browser-visible and the definition of done calls for `npm run test:e2e` on anything a browser can see.
I did not run the e2e suite — the working tree was being edited while I reviewed, so a build from it would
not have described this commit.

</details>

<details>
<summary>File map</summary>

| File | What changed |
|---|---|
| `src/lib/storage/income.ts` | `totalIncome` and `incomeBySource` sum actual `amount`; seasonal window excludes the assessed month; `monthsWithData` / `hasData` added; docs rewritten |
| `src/types/income.ts` | `incomeBySource` keyed by `amount`; `seasonalHistory[].hasData` and `seasonalMonthsWithData` added; `isCompliant` flagged as a W7b rename |
| `src/lib/export/buildTextReport.ts` | Income block sums `amount`; per-entry line reads "$X received" and drops the monthly projection |
| `src/components/income/IncomeDashboard.tsx` | Entry list follows the selected month; passes `monthsWithData` through |
| `src/components/income/SeasonalWorkerView.tsx` | `hasData` rendering, "No record", sparse-history caption, new required prop |
| `src/components/income/IncomeStatusIndicator.tsx` | Source breakdown shows actual amounts |
| `src/components/income/IncomeEntryList.tsx` | Actual amount is the headline; projection de-emphasised as an estimate |
| `src/components/income/IncomeEntryForm.tsx` | "Monthly Equivalent" → "Rough monthly estimate", with the state-method caveat |
| `src/components/help/SeasonalWorkerHelp.tsx` | Invented "6 months or less per year" test replaced with the rule's inclusive examples |
| `src/lib/storage/__tests__/income.characterization.test.ts` | Four defect blocks inverted, records preserved; sparse and full-window cases added |
| `src/__tests__/no-verdict.render.test.tsx` | Seasonal fixtures carry `hasData`/`monthsWithData`; sparse-history guard case added |
| `docs/hr1-readiness/waves/wave-7a-seasonal-income-corrections.md` | New wave file: W7a/W7b boundary, the four-site count, acceptance criteria |

Full diff: `git diff 33691f6 32a2570`.

</details>
