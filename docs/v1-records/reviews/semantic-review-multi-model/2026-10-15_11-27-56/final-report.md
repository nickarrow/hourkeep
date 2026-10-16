# Final consolidated issues report — W7a income corrections: actual amounts received, corrected seasonal window, sparse-history handling (HEAD diff against 33691f6 — wave W7a income corrections (42 CFR 435.552(f),(g)): totalIncome now sums actual amount received not monthlyEquivalent projections (gap 5.5, the live 4x false positive), fixed at all four summing sites (two reduces + incomeBySource accumulator in storage/income.ts + buildTextReport.ts); pay-period multiplication demoted to a labeled personal estimate (gap 5.4); seasonal window corrected to the 6 months preceding the assessed month, exclusive (getLast6Months, gap 5.8); sparse-history handling divides by months-with-data and shows 'No record' not '$0' with a notice (gap 5.9, new MonthlyIncomeSummary.seasonalMonthsWithData + seasonalHistory[].hasData); SeasonalWorkerHelp dropped the invented '6 months or less' test (gap 5.7); the IncomeDashboard entry list moved from a 6-month rolling window to the selected month. MonthlyIncomeSummary.isCompliant and the mode fork are deliberately left for W7b. Review for design-level concerns organized by concern, especially the form->summary->export->seasonal-view lifecycle (the W6a review found defects in the joins between layers) and whether any surface still reads a stale or wrong income figure.)

Issues are sorted from highest to lowest combined importance/confidence.

---

## 1. Seasonal average divides by months-with-data instead of the six-month window

**Severity: High** · *(cluster: seasonal divisor — see also #5, #12)*

- **User impact:** A seasonal worker with thin records is shown an average up to six times higher than the figure the state will compute, and in the reassuring direction. CMS's own worked example — two $1,500 months in the window — yields $500 and fails the $580 threshold; the committed code reports $1,500 and reads as passing. A user told they are over the threshold may do nothing and lose coverage.
- **Issue:** `calculateSeasonalAverage` in `src/lib/storage/income.ts` increments `monthsWithData` only for months that contain entries and returns `totalIncome / monthsWithData`. 42 CFR 435.552(g) and the worked example captured in `docs/domain/cms-2454-ifc/rule-extract.md` § 2.7 (`$3,000 ÷ 6 = $500`) use the full preceding window as the divisor, because off-season months are genuine zeroes. A new characterization test pins the alternate semantics ("one month of $3,000 averages to $3,000"), and the unchanged `incomeDefinitions.seasonalWorker` help text still says to divide by 6, so help and dashboard disagree about the same records. The uncommitted working tree already reverses the divisor to `÷ months.length`.
- **Recommendation:** Divide by the window length, keep `monthsWithData` and `hasData` purely as completeness metadata, and commit the reversal with the citation in the test name. Update the characterization tests to assert CMS's figures ($3,000 over the window → $500).

## 2. Incomplete or empty seasonal history still drives threshold status and shortfall copy

**Severity: High** · *(cluster: provenance stops before the comparison surface — see also #5)*

- **User impact:** A user with one recorded month, or none, sees a settled-looking comparison: a headline average, a progress bar, a colored status, "$X needed", or "That's at or over the threshold for these 6 months." The number has no provenance attached on the surface that frames the comparison, so a thin history reads as a finding about the user's eligibility rather than a gap in their own records.
- **Issue:** `getMonthlyIncomeSummary` turns an empty window into `isCompliant: false` with a full `amountNeeded`, and a partial window into the success branch. `IncomeStatusIndicator.tsx` destructures `seasonalAverage` into `effectiveIncome` for the headline figure, progress bar and `amountNeeded`, labels it with a flat "Seasonal Worker - 6-Month Average" chip, and never reads `seasonalMonthsWithData`. Inside `SeasonalWorkerView.tsx`, `incompleteHistory` gates only the caption while the success Alert fires regardless of how many months hold records. The guard fixture for `IncomeStatusIndicator` sets `isSeasonalWorker: false` and omits every new field, so the seasonal branch of the comparison surface is rendered by no test.
- **Recommendation:** Pass completeness through to every surface that renders the average, caveat the comparison itself (not only the history card), and suppress settled threshold copy until the window is complete. Add render tests for empty, partial and complete histories on both components.

## 3. The assessment path still treats a pay-period projection as monthly income

**Severity: High** · *(cluster: projection demoted on one surface only — see also #8)*

- **User impact:** One weekly $150 paycheck entered in the assessment becomes roughly $650 a month, clears the $580 threshold, and routes the user's recommended pathway as if that were recorded income — while the corrected tracking surface reports $600 for four such paychecks. The two surfaces give the same user different answers, and the inflated one is the one that steers them.
- **Issue:** `IncomeConverter` in `src/components/assessment/EstimationTools.tsx` multiplies a paycheck by `PAY_PERIOD_MULTIPLIERS`, labels the result "Monthly income", and passes it through `AssessmentFlow` into `responses.monthlyIncome`; `recommendationEngine.ts` compares that value directly against the income threshold to select `income-tracking` or `seasonal-income-tracking`. Gap 5.4 is therefore still live outside the tracking dashboard. The wave file left this as "decide whether to keep it as a labeled estimate or let W7b remove it" and no decision was recorded in the commit.
- **Recommendation:** Keep the projection out of recommendation inputs — either stop it populating `monthlyIncome`, or make it visibly non-decisional. Whichever way it goes, record the disposition in the wave file rather than closing out undecided.

## 4. The seasonal headline and the source breakdown below it describe different periods

**Severity: High**

- **User impact:** For a July seasonal assessment the page can show a $600 headline average directly above a $9,000 "Income Sources" breakdown, with nothing naming the period difference. The breakdown appears to explain a total it did not contribute to, and a user reasonably concludes one of the two numbers is broken.
- **Issue:** In `IncomeDashboard.tsx` / `IncomeStatusIndicator.tsx`, `effectiveIncome` is the January–June preceding-window average while `incomeBySource`, `entryCount`, and the newly month-scoped entry list all describe July, the assessed month that § 435.552(g) excludes from the average.
- **Recommendation:** Compute the breakdown over the seasonal window, hide it in seasonal mode, or label the assessed-month records explicitly as excluded from the preceding-window average. Cover the join with a case where assessed-month and window income differ materially.

## 5. Sparse-history caption and guard fixture describe arithmetic the code no longer performs

**Severity: Medium** · *(cluster: seasonal divisor — see also #1, #12)*

- **User impact:** Once the divisor is back at the window length, the committed caption — "This average is based on the 2 months you've recorded, not a full 6" — is false: the average *is* over a full six, with blanks counted as zero. It also tells the user the wrong thing to do about it.
- **Issue:** The caption in `SeasonalWorkerView.tsx` is pinned by a render-guard assertion (`/based on the 2 months you'?ve recorded/i`), so the test preserves the inaccurate wording. The sparse guard fixture compounds it: `average: 650` against history totals of $700 + $600 is `1300 ÷ 2`, an arithmetic relationship no code path produces under the window divisor — a hand-built fixture unreachable by the implementation stops being evidence about it. Neither breaks a build.
- **Recommendation:** Rewrite the caption to say that unfilled months count as $0 and pull the average down, with "add them if you have them" as the next action; update the guard assertion to the new wording and recompute the fixture so `average` equals `total ÷ window` ($216.67 for the current totals).

## 6. The export correction has no test that can fail

**Severity: Medium** · *(cluster: export — see also #7)*

- **User impact:** None today, but the fourth summing site — the one that produces the caseworker artifact — is unprotected. A regression back to the projection would reintroduce the 4× inflation on the document a user hands to their agency, with every test green.
- **Issue:** `buildTextReport` now sums `entry.amount`, but the fixture helper in `buildTextReport.test.ts` assigns one value to both `amount` and `monthlyEquivalent` with `payPeriod: "monthly"`, so the multiplier is 1 and the two fields cannot diverge. Nothing asserts the per-entry "received" line or the absence of the old `→ $X/month`. The acceptance criterion ("the export's income block sums actual amounts") names an observable that does not discriminate — the same mutation-survivability trap the W0 characterization test flagged for the `incomeBySource` site and that the author handled correctly there.
- **Recommendation:** Give the fixture a weekly pay period with distinct values (e.g. four payments of `amount: 150`, `monthlyEquivalent: 649.50`) and assert the report logs `$600.00`, not `$2,598.00`, and that no entry line carries the projection.

## 7. The export has no seasonal comparison at all

**Severity: Medium** · *(cluster: export — see also #6)*

- **User impact:** A seasonal worker's printed artifact — the one thing a caseworker actually reads — prints the assessed month's own total against the threshold with a "Difference" line, while the screen tells the same user the operative figure is a six-month average of the *preceding* months. The document and the app disagree about which comparison matters, for exactly the users the seasonal pathway exists for.
- **Issue:** `buildTextReport` in `src/lib/export/buildTextReport.ts` has no seasonal concept (a grep for "seasonal" across `src/lib/export` and `src/app/export` returns nothing). W7a's own wave file records that this blocks W8a, and the existing handoff assigns seasonal export there, so the scope question is live rather than settled.
- **Recommendation:** Either carry the seasonal average onto the artifact, or state in the income block that a seasonal average is worked out separately and that the single-month comparison is not the operative one. If it stays with W8a, make the deferral explicit in the export copy rather than leaving a misleading "Difference" line.

## 8. The stored projection is still rendered beside the actual amount, and unlabeled in one dialog

**Severity: Medium** · *(cluster: projection demoted on one surface only — see also #3)*

- **User impact:** Two numbers sit on one list row whose agreement depends on a cached field staying in sync. Any writer that updates `amount` alone leaves a row reading "$400 received · ~$868/mo estimate". In `DuplicateIncomeDialog` the same cached figure is presented as "Monthly equivalent: $X" with no estimate framing, so the number a user uses to tell two entries apart still looks authoritative.
- **Issue:** `IncomeEntryList.tsx` reads persisted `entry.monthlyEquivalent`, which `income.characterization.test.ts` pins as *not* recomputed on an `amount` update. The relabeling sweep covered two of the three surfaces that show this value; `DuplicateIncomeDialog` was missed. `data-migration-standards.md` already prescribes "store the input, derive the output", and `calculateMonthlyEquivalent` is a pure function available at render time.
- **Recommendation:** Derive the estimate at render from `amount` + `payPeriod` rather than reading the stored field, and give the duplicate dialog the same personal-estimate framing so every surviving projection carries one meaning.

## 9. Narrowing the entry list to the selected month left stale UI and a silent save outside the view

**Severity: Medium**

- **User impact:** A user browsing a quiet month sees "No income entries yet — click the + button to add your first income entry" while holding records in five other months, which invites them to re-enter data. Worse, the form still defaults to today, so an entry added while browsing another month is written outside the window the list shows and simply never appears — the save succeeds with no feedback.
- **Issue:** `IncomeDashboard.tsx` now calls `getIncomeEntriesByMonth(userId, currentMonth)` but still renders the all-time empty state, still passes `selectedDate={new Date()}` to the form, and `IncomeEntryList.tsx` keeps `entriesByMonth` / `monthKeys` / `formatMonthHeader` and an `<h6>` month header that can now only ever produce one group restating the page's month selector.
- **Recommendation:** Default the form's date to the month being viewed (or confirm the out-of-view save explicitly), rewrite the empty state to point at the month selector, and drop the now-dead grouping machinery.

## 10. The averaging window length is a literal in a Tier-1 module while the policy field names W7a as its owner

**Severity: Medium** · *(cluster: policy plumbing — see also #14)*

- **User impact:** A state that elects a different averaging arrangement cannot be represented, and the bookkeeping says otherwise — so the gap is invisible to anyone reading the owner record rather than the code.
- **Issue:** `getLast6Months` in `src/lib/storage/income.ts` hardcodes the window (`for (let i = 6; i >= 1; i--)`) and `calculateSeasonalAverage` takes no `policy` parameter, although `policy.seasonalMethod.months` exists, is already read from the profile by `recommendationEngine.ts` and `SeasonalWorkerView.tsx`, and `POLICY_FIELD_OWNERS.seasonalMethod` names W7a as owner with the reason that W7a implements it.
- **Recommendation:** Give `calculateSeasonalAverage` the standard optional `policy: PolicyProfile = FEDERAL_DEFAULT` final parameter and read the window from it, adding the module to the `policyInjection.test.ts` scan list — or amend the owner record to state that W7a deliberately left it. One of the two has to move.

## 11. There is no way to record a month with genuinely zero income

**Severity: Medium**

- **User impact:** A user who truly earned nothing in a month cannot say so. Their complete record is indistinguishable from an untouched month, so any completeness messaging the app shows them is wrong, and they are prompted to fill in data that does not exist.
- **Issue:** `IncomeEntryForm.validate` rejects amounts at or below zero, and `hasData` is derived from `entries.length > 0` in `src/lib/storage/income.ts`, so confirmed-zero and unrecorded collapse into one state.
- **Recommendation:** Model month completeness, or confirmed zero income, separately from positive payment entries, and render the two differently in the seasonal history. Add a confirmed-zero render case alongside the empty and partial cases.

## 12. Planning docs and a code comment misstate the corrected window

**Severity: Medium** · *(cluster: seasonal divisor — see also #1, #5)*

- **User impact:** Indirect, but these are the documents the next wave reasons from, and they currently contradict both the implementation and the rule.
- **Issue:** `docs/hr1-readiness/waves/wave-7a-seasonal-income-corrections.md` says "assessed July → average December–May"; December–May is CMS's example for an *application* filed in July whose assessed month is June, and the implementation, tests and § 435.552(g) all give January–June for an assessed July. `SeasonalWorkerView`'s `SEASONAL_MONTHS` comment still says the component's average "still INCLUDES the assessed month (gap 5.8)". The gap-analysis closure line for 5.9 claims the average is over months-with-data ("one $3,000 month → $3,000, not $500"), which the reverted divisor contradicts.
- **Recommendation:** Restate the wave scope as either "assessed July → January–June" or "application July → assessed June → December–May", delete the stale `SEASONAL_MONTHS` comment, and rewrite the 5.9 closure line to describe the window divisor with the citation.

## 13. Three parallel optional seasonal fields can diverge

**Severity: Low**

- **User impact:** One reachable-or-not failure already exists in copy: the dashboard's `?? 0` fallback would render "based on the 0 months you've recorded", which is the one value that makes the caption wrong in the user-unfavorable direction.
- **Issue:** `MonthlyIncomeSummary` in `src/types/income.ts` carries `seasonalAverage`, `seasonalHistory` and `seasonalMonthsWithData` as three independent optionals, so presence is three checks instead of one, and `IncomeDashboard.tsx` compensates with `monthsWithData={summary.seasonalMonthsWithData ?? 0}`.
- **Recommendation:** Collapse them into a single optional `seasonal?: { average, monthsWithData, history }` so presence is one check and the fallback disappears.

## 14. The policy-literal scan cannot see the window length

**Severity: Low** · *(cluster: policy plumbing — see also #10)*

- **User impact:** None directly; the cost is a quality gate that reports clean on a class of defect it cannot detect.
- **Issue:** The `POLICY_LITERAL` pattern matches `80|580|7\.25|4\.33|2\.17` plus a currency arm, so a bare `6` in a loop bound and the string "6-Month Average" both pass. This is the same blind-gauge shape as the `$580` bug the file's own comment documents.
- **Recommendation:** Extend the pattern to cover the window length in the modules where it is policy, or record the exclusion explicitly so the gate's scope is readable.

## 15. `getIncomeEntriesForLast6Months` is an exported function with no caller and W7b-hostile semantics

**Severity: Low**

- **User impact:** None today; the risk is a future wave picking it up and inheriting the wrong window.
- **Issue:** The export in `src/lib/storage/income.ts` has no production caller and now excludes the assessed month, which is the opposite of what W7b's per-month roll-up needs.
- **Recommendation:** Say that in the doc comment, or remove it and let W7b write the query it actually needs.

## 16. `getLast6Months` uses raw `new Date()` month arithmetic

**Severity: Low**

- **User impact:** None observed — the cross-year case is covered and passing.
- **Issue:** The loop relies on `new Date(year, month - 1 - i, 1)` normalizing a negative month index, which `data-migration-standards.md` names as a banned pattern ("never `new Date(...)` arithmetic across month boundaries"). The comment is honest about the reliance.
- **Recommendation:** Use `date-fns`'s `subMonths`, already a dependency, on a line this diff rewrote anyway.

## 17. No browser coverage for the changed income surfaces

**Severity: Low**

- **User impact:** None directly; the gap is that user-visible string and layout changes shipped without the gate that sees them.
- **Issue:** No e2e spec touches an income surface, although the changed copy, the "No record" rows and the sparse caption are all browser-visible, and the definition of done calls for `npm run test:e2e` on anything a browser can see (ADR-0007 Tier 3b). `incomeBySource` rendering — the field whose shape this diff changed — is untested anywhere.
- **Recommendation:** Add a small, durable browser assertion over the seasonal history and status surfaces at a 375px viewport, and run `npm run test:e2e` against a build of the committed tree before closeout.

## 18. The British-spelling acceptance criterion was scoped to files the work never touched

**Severity: Low**

- **User impact:** None; it is a criterion that reports satisfied without having checked anything.
- **Issue:** The wave file's criterion "no British spellings remain in income files" does not reach the six `programme` strings in `helpText.ts`, `CompletionMessage.tsx`, `calculator.ts` and `definitions.ts`, which are untouched.
- **Recommendation:** Either widen the criterion to the files that actually hold the strings and fix them, or drop it and hand the sweep to a named wave.
