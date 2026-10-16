# W7a Surface Map — Income Data Model Consumers

**Date:** 2026-09-03
**Author:** read-only investigation step (workflow `wf_d2b0f9c4da1319fc`)
**Scope:** Map every production consumer of the income data model ahead of W7a (gaps 5.4,
5.5, 5.7, 5.8, 5.9). **No fixes implemented.** Line numbers are from the files as read on
this date; re-confirm before editing (`engineering-standards.md`: "re-read the target").

Baseline confirmed: `git status` clean, branch `main`. Tests present: **34 `*.test.ts(x)`
files** under `src/` (the brief's "29 files / 668 tests" predates W6a; the README records
W6a landing at 721 tests). **5 Playwright specs** in `e2e/`:
`browser-capabilities`, `console-clean`, `delete-all-mobile`, `month-scoping`, `pwa-assets`
— **none exercises income**, so there is no e2e income coverage to update, only to add if
W7a touches a browser-visible surface.

---

## Summary answer

The income model has **one storage read path** (`getMonthlyIncomeSummary` →
`calculateSeasonalAverage`) feeding **one dashboard** (`IncomeDashboard`) that fans out to
three display components, plus **one independent report builder** (`buildTextReport`). The
W7a-relevant surface is small and well-contained, but three facts dominate planning:

1. **`monthlyEquivalent` is summed in FOUR production places, not one** (gap 5.5): two
   `reduce`s in `getMonthlyIncomeSummary`, one `reduce` in `calculateSeasonalAverage`, one
   `reduce` in `buildTextReport`, **plus** a separate `+=`/`push` accumulator for
   `incomeBySource`. The income characterization test explicitly warns a fix applied only to
   the `reduce`s leaves `incomeBySource` inflated. Fixing `totalIncome` to sum `amount` must
   touch every one of them.

2. **The seasonal off-by-one lives in one helper** (`getLast6Months`, gap 5.8): it returns
   the current month plus five prior. Both `calculateSeasonalAverage` and
   `getIncomeEntriesForLast6Months` call it. The fix (6 months *preceding*, assessed month
   *excluded*) and the sparse-history handling (gap 5.9, "always divides by 6") are both
   inside `calculateSeasonalAverage`/`getLast6Months`.

3. **Gap 5.7 has a live residual the brief did not flag:** `SeasonalWorkerHelp.tsx` carries
   a **hardcoded** "IRS Definition" alert still asserting "work is typically available for 6
   months or less per year" — the exact invented test W2a removed from the toggle. The
   corrected copy already exists in `helpText.ts incomeDefinitions.seasonalWorker`, but this
   component does **not** read it for that one block. This is a user-hostile, rule-contradicting
   string still shipping. (See §4.)

4. **The brief's "6 British `programme` spellings in income files handed to W7a" could not
   be confirmed.** There are **zero** `programme` spellings in any income file
   (`src/components/income/**`, `src/lib/storage/income*.ts`, `src/lib/utils/payPeriodConversion.ts`,
   `src/lib/export/buildTextReport.ts`). The six `programme` instances in the tree are in
   `exemptions/`, `helpText.ts`, and `CompletionMessage.tsx` — not income. (See §6.)

---

## 1. Readers of `MonthlyIncomeSummary` fields and `IncomeEntry.monthlyEquivalent`

### 1a. `IncomeEntry.monthlyEquivalent` — reads (compliance inputs)

| File | Lines | What it does |
|---|---|---|
| `src/lib/storage/income.ts` | 170–172 | `calculateSeasonalAverage`: `reduce` sums `entry.monthlyEquivalent` into `monthTotal` per month (seasonal path). |
| `src/lib/storage/income.ts` | 222–225 | `getMonthlyIncomeSummary`: `reduce` sums `entry.monthlyEquivalent` into `totalIncome` — **the gap-5.5 double-count**. |
| `src/lib/storage/income.ts` | 231–240 | `getMonthlyIncomeSummary`: `incomeBySource` breakdown accumulates `monthlyEquivalent` via `existing.monthlyEquivalent +=` and `acc.push({ monthlyEquivalent })` — **separate summing site** (characterization test § "SEPARATE summing site"). |
| `src/lib/export/buildTextReport.ts` | 241–244 | Income-mode month block: `reduce` sums `i.monthlyEquivalent` into `totalIncome` for the "Logged" line. **Fourth summing site, independent of storage.** |
| `src/lib/export/buildTextReport.ts` | 266 | Per-entry line prints `$amount (payPeriod) → $monthlyEquivalent/month`. |
| `src/components/income/IncomeEntryList.tsx` | 139–143 | Per-entry card prints `amount (label) → monthlyEquivalent/month`. Display only. |
| `src/components/income/DuplicateIncomeDialog.tsx` | 81–83 | Prints `Monthly equivalent: {monthlyEquivalent}` in the duplicate preview. Display only. |
| `src/components/income/IncomeDashboard.tsx` | 212 | **Writes** `monthlyEquivalent: entryToDuplicate.monthlyEquivalent` when duplicating an entry to new dates (carries the stored projection forward). |

### 1b. `MonthlyIncomeSummary` field reads

| File | Lines | Fields read |
|---|---|---|
| `src/components/income/IncomeDashboard.tsx` | 252–259 | `summary.seasonalHistory`, `summary.seasonalAverage`, `summary.isCompliant` — gates and feeds `SeasonalWorkerView`. |
| `src/components/income/IncomeStatusIndicator.tsx` | 29–41 | Destructures `totalIncome`, `isCompliant`, `amountNeeded`, `isSeasonalWorker`, `seasonalAverage`, `incomeBySource`, `entryCount`. Computes `effectiveIncome = isSeasonalWorker && seasonalAverage !== undefined ? seasonalAverage : totalIncome`; drives progress bar, "needed"/"recorded" copy, `incomeBySource` list. |
| `src/components/income/SeasonalWorkerView.tsx` | props `history`, `average`, `isCompliant` | Receives the three seasonal fields as props from the dashboard (not the summary type directly). Renders 6-month list, total, average, and compliance alert. |

**Note on `isCompliant`:** `MonthlyIncomeSummary.isCompliant` (type `income.ts:71`) is a
stored/returned **verdict** — `engineering-standards.md` and `data-migration-standards.md`
both flag `isCompliant: boolean` as a design error. The brief assigns the rename to **W7b**
(see `tracking/page.tsx:220–223`, which deliberately avoided building on it). W7a changes the
*arithmetic* that feeds it; the field rename is W7b's. Flag, do not rename here, unless W7a's
scope note says otherwise.

---

## 2. `calculateMonthlyEquivalent` / `PAY_PERIOD_MULTIPLIERS` — all production usage

| File | Lines | Role |
|---|---|---|
| `src/lib/utils/payPeriodConversion.ts` | 61–67 | `PAY_PERIOD_MULTIPLIERS` definition `{daily:30, weekly:4.33, "bi-weekly":2.17, monthly:1}` — gap 5.4 `contradicts`; "W7a owns deciding what replaces them". Each value is `// policy-literal-ok`. |
| `src/lib/utils/payPeriodConversion.ts` | 79–86 | `calculateMonthlyEquivalent(amount, payPeriod)` = `round(amount × multiplier × 100)/100`. |
| `src/lib/utils/payPeriodConversion.ts` | 35–43 | Deprecated re-exports `FEDERAL_MINIMUM_WAGE`, `REQUIRED_HOURS`, `INCOME_THRESHOLD`. Header says **zero production importers remain** after W2b; kept only for W0's characterization test. W7a "owns retiring this surface." |
| `src/components/income/IncomeEntryForm.tsx` | 33–38 | Imports `calculateMonthlyEquivalent`, `formatCurrency`, `getPayPeriodLabel`, `PAY_PERIOD_MULTIPLIERS`. |
| `src/components/income/IncomeEntryForm.tsx` | 151–154 | Computes `monthlyEquivalent` live from the typed amount; passed into `onSave` (152) and stored (handleSave `monthlyEquivalent` field ~245). **This is where the stored projection originates.** |
| `src/components/income/IncomeEntryForm.tsx` | 486–490 | "Monthly Equivalent" display block prints `amount × PAY_PERIOD_MULTIPLIERS[payPeriod] {label} periods/month`. User-facing explanation of the conversion. |
| `src/components/assessment/EstimationTools.tsx` | 14 | Imports `PAY_PERIOD_MULTIPLIERS`. |
| `src/components/assessment/EstimationTools.tsx` | 24 | `WEEKS_PER_MONTH = PAY_PERIOD_MULTIPLIERS.weekly` — the **expected coupling** the brief named. Used by `HoursConverter` (hours estimate, line ~37, 108). |
| `src/components/assessment/EstimationTools.tsx` | 149–153 | `IncomeConverter` `multipliers = {weekly, biweekly, monthly}` from `PAY_PERIOD_MULTIPLIERS` for a personal income estimate. |

**Test files that pin this surface** (not production, but will break on change — list for
W7a's TDD planning): `payPeriodConversion.characterization.test.ts` (whole file asserts the
multiplier contract, the two opposite rounding biases, and the documented examples
`400 bi-weekly → 868`, `150 weekly → 649.5`); `income.characterization.test.ts` (defect 1,
three summing sites, stale-projection-on-update); `deleteIncomeEntryWithDocuments.test.ts`
and `deleteAllData.test.ts` (fixtures build entries via `calculateMonthlyEquivalent`);
`buildTextReport.test.ts` (fixture `income()` sets `amount === monthlyEquivalent`).

**Carnegie-Unit collision reminder (do not merge):** `4.33` in `PAY_PERIOD_MULTIPLIERS.weekly`
(52/12 rounded down, gap 5.4) is a different number from `educationCreditHourConversion`'s
`4.33` in `policy/federalDefault.ts:127–131` and `policy/types.ts:73–77` (Carnegie Unit,
§ 435.552(d), owned by W6a). The guard comments at `payPeriodConversion.ts:52–60` and the
education tests enforce the separation.

---

## 3. Income UI components — what each displays about totals and seasonal averaging

Entry point: `src/app/tracking/page.tsx` renders `<IncomeDashboard>` only when
`complianceMode === "income"` (line ~900), passing `userId`, `currentMonth={selectedMonth}`,
`isSeasonalWorker`, `onSeasonalWorkerToggle`. `isSeasonalWorker` is loaded per-month via
`getSeasonalWorkerStatus` (tracking/page.tsx ~329–337) and toggled via
`setSeasonalWorkerStatus` (~600).

| Component | File | Displays about totals / seasonal |
|---|---|---|
| **IncomeDashboard** | `components/income/IncomeDashboard.tsx` | Orchestrator. `loadIncomeData` (86–89) calls `getIncomeEntriesForLast6Months` + `getMonthlyIncomeSummary`. Renders `IncomeStatusIndicator` (summary), `SeasonalWorkerToggle`, and `SeasonalWorkerView` **only when** `isSeasonalWorker && seasonalHistory && seasonalAverage !== undefined` (252–259). Also owns duplicate (writes `monthlyEquivalent`, 212) and cascade delete. |
| **IncomeStatusIndicator** | `components/income/IncomeStatusIndicator.tsx` | The main total/threshold surface. `effectiveIncome` = seasonal average if seasonal else `totalIncome` (37–41). Progress bar `effectiveIncome / INCOME_THRESHOLD` (46–50). Compliant branch: "{effectiveIncome} recorded … at or over {threshold}" + household note (hedged, post-W5). Non-compliant branch: "{amountNeeded} needed", household disclosure, `isCloseToThreshold` ($550–$579) hint. Threshold is `incomeThreshold(FEDERAL_DEFAULT)` (local const, 16). `incomeBySource` list prints `{source.monthlyEquivalent}/month` (233–239). **Every number here is downstream of the gap-5.5 inflation.** |
| **SeasonalWorkerView** | `components/income/SeasonalWorkerView.tsx` | 6-month history list, 6-month total (`history.reduce`, 64), average, compliance alert. Alert text names `SEASONAL_MONTHS` (from `FEDERAL_DEFAULT.seasonalMethod`, 32–35) and hedges with household + "different stretch" language. Large W2b comment (124–162) records the verdict/threshold/proxy history. **The `average` and `history` it renders are computed by `calculateSeasonalAverage`, which includes the assessed month (gap 5.8) and divides by a fixed 6 (gap 5.9).** |
| **SeasonalWorkerToggle** | `components/income/SeasonalWorkerToggle.tsx` | On/off switch + "I'm a seasonal worker". Help tooltip copy (47–66) is the **W2a-corrected** version: no months-per-year test, "list isn't closed". Subtitle "Using / Use 6-month income average" (76–81). (See §4 for the framing judgement.) |
| **IncomeEntryList** | `components/income/IncomeEntryList.tsx` | Per-entry cards grouped by month; prints `amount (label) → monthlyEquivalent/month` (139–143). No totals. |
| **IncomeEntryForm** | `components/income/IncomeEntryForm.tsx` | Add/edit entry; the **origin** of stored `monthlyEquivalent` (151–154, 486–490). |
| **DuplicateIncomeDialog** | `components/income/DuplicateIncomeDialog.tsx` | Preview shows `Monthly equivalent` (81–83); copies entries to new dates (carrying stored `monthlyEquivalent`). |

---

## 4. Seasonal UI copy — self-declared toggle vs objective test (gap 5.7)

**Current framing is a self-declared toggle, which is correct for the status itself** — the
IFC sets no verification rule for seasonal-worker status, and W2a deliberately removed the
invented "6 months or less" test from the toggle. But there are **two residual contradictions**:

1. **`SeasonalWorkerHelp.tsx:50–55` — a hardcoded "IRS Definition" alert still says:**
   "A seasonal worker is someone who works in an industry where work is typically available
   for **6 months or less per year**." This is the exact invented, user-hostile threshold the
   gap-5.7 fix retracted. It is hardcoded in the component and does **not** read from
   `helpText.ts`, so the W2a correction to `incomeDefinitions.seasonalWorker` never reached
   it. **This still ships.** The surrounding help content (the `whoQualifies`,
   `howToCalculate`, `example`, `edgeCases` blocks at lines 29–130) *does* read from
   `helpText.ts` and *is* corrected. Only the one alert block is stale.
   **Recommendation:** W7a should delete or rewrite this alert to match
   `incomeDefinitions.seasonalWorker.whoQualifies`. Flag to confirm it is in W7a scope vs W6b
   (gap 5.7 is a W2a partial not explicitly reassigned; the brief lists seasonal copy as in
   scope).

2. **`SeasonalWorkerHelp.tsx` "Important" note (159–165)** says the 6-month average "is
   recalculated each month" and to "mark all your income entries as seasonal worker income" —
   the latter is stale against the current per-month `seasonalWorkerStatus` model (status is
   per user per month, not per entry). Minor, but misleading. Flag.

The `SeasonalWorkerToggle` tooltip (47–66) and `incomeDefinitions.seasonalWorker` in
`helpText.ts` (538–581) are both correct and need no change. `helpText.ts:541–555` explicitly
warns against reintroducing a months-per-year threshold.

---

## 5. Income in export and results surfaces

| File | Lines | Income usage |
|---|---|---|
| `src/app/export/page.tsx` | 40, 65 | Loads `db.incomeEntries` for the count display and JSON export. |
| `src/app/export/page.tsx` | 103–118 | JSON export includes `incomeEntries` verbatim (stored shape, including `monthlyEquivalent`). |
| `src/app/export/page.tsx` | 128–145 | `handleExportReadable` calls `buildTextReport({ …, incomeEntries, complianceModes, thresholds })`. `thresholds.income = incomeThreshold(FEDERAL_DEFAULT)`. |
| `src/app/export/page.tsx` | 237 | Data-summary paper prints "Income Entries: {incomeCount} recorded". |
| `src/lib/export/buildTextReport.ts` | 227–276 | Income-mode month block: sums `monthlyEquivalent` (241–244, **gap-5.5 inflation in the agency-facing artifact**), prints Logged/Threshold/Difference, a household-income note (245–248, cites § 435.603(d)-(f)), then per-entry `amount (payPeriod) → monthlyEquivalent/month` lines (266). |
| `src/lib/export/buildTextReport.ts` | 25–38 (header), 100–113 (`ReportThresholds`) | Thresholds injected, not hardcoded; `80`/`580` passed by caller. |
| `src/app/how-to-hourkeep/results/page.tsx` | 42–59 | Consts `HOURS`, `INCOME_MINIMUM`, `SEASONAL_MONTHS` from policy. |
| `src/app/how-to-hourkeep/results/page.tsx` | 135–234 | `getExemptMethodMessage` / `getNonExemptMethodMessage`: income-pathway copy uses `result.responses.monthlyIncome` (assessment responses, **not** `IncomeEntry`/summary) vs `INCOME_MINIMUM`; seasonal-income branch names `SEASONAL_MONTHS` as "months before the month being reviewed" (217). **Does not read the income storage model** — it reads assessment responses, so W7a's storage changes do not directly affect it, but its seasonal copy ("months before the month being reviewed") is the correct framing W7a's arithmetic must match. |
| `src/app/how-to-hourkeep/results/page.tsx` | 139–159 | `handleStartMethod` writes `complianceMode` + `seasonalWorkerStatus` for `currentMonth()` via `setComplianceMode`/`setSeasonalWorkerStatus`. |

**`src/app/tracking/page.tsx`** also reads/writes the income model: imports from
`lib/storage/income` (43–46) `getStoredComplianceMode`, `setComplianceMode`,
`getSeasonalWorkerStatus`, `setSeasonalWorkerStatus`; renders `IncomeDashboard` (900);
comment at 219–223 records the deliberate avoidance of `summary.isCompliant` (W7b). It does
**not** call `getMonthlyIncomeSummary` directly — the dashboard owns that.

---

## 6. British `programme` spellings in income files

**Finding: none in income files.** `grep "programme"` scoped to
`src/{components/income,lib/storage,lib/utils}/**` returns **zero matches**; scoped to
`buildTextReport.ts` also zero. The six `programme` instances in the tree are:

| File | Lines |
|---|---|
| `src/lib/exemptions/definitions.ts` | 429 (×2, in a comment + copy string) |
| `src/lib/exemptions/calculator.ts` | 232 (comment "Programme participation"), 256, 262 (comment), 269, 271 |
| `src/content/helpText.ts` | 793 (`body` string) |
| `src/components/tracking/CompletionMessage.tsx` | 177 |

The README (§ "Carried forward", line 22–23) says "six pre-existing ones from W2a were found
and handed to W7a". **This does not match the code: those six are not in income files, and
they are in exemptions/help/tracking surfaces that are not part of W7a's income scope.** Two
readings: (a) the handoff meant "W7a should fix these six wherever they are" (a copy-cleanup
rider, not income-specific), or (b) the handoff note is itself stale/inaccurate — the kind of
bookkeeping error `engineering-standards.md` and the Aug-2026 audit were written to catch.

**Recommendation:** Treat the `programme` cleanup as a flag-and-confirm item, not an assumed
W7a deliverable. The brief's own wording ("6 British `programme` spellings in income files")
is unverifiable as stated. Confirm with the user/wave-file whether W7a owns the six
exemptions/help/tracking instances or whether that line should be corrected. **Changing
copy in `exemptions/` and `CompletionMessage.tsx` is outside the income data model** and
would widen W7a's diff into W4/other territory.

---

## 7. Conclusions and recommendations for the W7a plan

1. **`totalIncome` → sum of `amount` (gap 5.5)** requires changes in **four summing sites**,
   two of which are easy to miss:
   - `income.ts:222–225` (`totalIncome` reduce)
   - `income.ts:231–240` (`incomeBySource` accumulator — *separate*, pinned by test)
   - `income.ts:170–172` (`calculateSeasonalAverage` monthTotal — if seasonal also moves to
     `amount`)
   - `buildTextReport.ts:241–244` (independent of storage; the agency artifact)
   Write the failing test first (`income.characterization.test.ts` already documents the
   expected post-fix behaviour as "DEFECT 1"); mutation-test the `incomeBySource` path per
   its own warning.

2. **Pay-period conversion as compliance input (gap 5.4):** `calculateMonthlyEquivalent` and
   `PAY_PERIOD_MULTIPLIERS` stay only as a **labeled personal estimate**. Production reads to
   reposition: `IncomeEntryForm.tsx:151–154, 486–490` (the stored-projection origin and its
   display), and the three storage/report summing sites. `EstimationTools.tsx:24, 149–153`
   couples to `PAY_PERIOD_MULTIPLIERS.weekly`/`["bi-weekly"]`/`monthly` for assessment
   estimates — the brief expects W7a to "replace or delete"; decide whether EstimationTools
   keeps its own local multiplier or the module is retained purely for estimates.
   `payPeriodConversion.ts:35–43` deprecated threshold re-exports can be retired (zero
   production importers per the header; only W0's characterization test imports them —
   confirm before deleting).

3. **Seasonal averaging (gaps 5.8, 5.9)** is localized to `getLast6Months` +
   `calculateSeasonalAverage` in `income.ts:155–196`. `getLast6Months` is also used by
   `getIncomeEntriesForLast6Months` (143–152) — check whether the entry-fetch window should
   also shift (the dashboard uses it to populate the entry list; shifting it would hide the
   assessed month's entries from the list, which is probably not wanted — so the exclusion
   likely belongs in the *average* computation, not the fetch). Sparse-history (5.9): decide
   divisor policy and how to render months with no data (currently `$0.00` rows that read as
   verified). The arithmetic is **Computed**; show it with its § 435.552(g) / 435.603(h)(3)
   citation.

4. **Seasonal copy (gap 5.7):** fix the stale hardcoded "6 months or less per year" alert and
   the per-entry note in `SeasonalWorkerHelp.tsx:50–55, 159–165`. The toggle and `helpText.ts`
   are already correct.

5. **Do NOT rename `isCompliant`** (summary type `income.ts:71`; readers at
   `IncomeDashboard.tsx:257`, `IncomeStatusIndicator.tsx`, `SeasonalWorkerView` prop) — that
   verdict-field rename is W7b per the brief and `tracking/page.tsx:220–223`. W7a changes the
   arithmetic feeding it.

6. **No Dexie change implied.** W7a adds no table and no index — it changes how stored fields
   are *summed/averaged at read time*, which `data-migration-standards.md` confirms needs no
   version bump. `IncomeEntry.monthlyEquivalent` remains a stored field (keep it, per "never
   drop/rename in place"); W7a demotes it from compliance input to estimate, it does not
   remove it. Confirm the duplicate flow (`IncomeDashboard.tsx:212`) still writes it.

7. **Flag the `programme` handoff** (§6) and the test/count baselines (34 test files, no e2e
   income spec) with the user before treating them as settled scope.

### Open questions to raise
- Does W7a own the six `programme` spellings in `exemptions/`/`helpText`/`CompletionMessage`,
  or is the README handoff line inaccurate? (They are not in income files.)
- Should `getIncomeEntriesForLast6Months`' window change, or only the seasonal *average*?
- Keep `EstimationTools` coupling to `PAY_PERIOD_MULTIPLIERS`, or give it its own labeled
  estimate constant when the module is repositioned?
