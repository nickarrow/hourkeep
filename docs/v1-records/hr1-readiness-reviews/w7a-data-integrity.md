# W7a Data-Integrity Review

**Scope:** read-only data-integrity review of wave W7a — "income is actual amounts received, and
seasonal averaging is corrected."
**Range:** `33691f6..HEAD` (single commit `32a2570`).
**Context:** no server, no backup; a user's records live in one browser's IndexedDB.
**Rules applied:** `.kiro/steering/data-migration-standards.md`.
**Reviewer verification:** `npx tsc --noEmit` clean; full Vitest suite **724/724 green**;
`income.characterization.test.ts` **38/38 green**.

---

## Summary answer

**W7a is data-safe. No migration was needed and none was performed.** The wave changed how income
is *read and summed for compliance*; it did not change the stored row shape, add a table, or add an
index. All seven review points check out:

1. `src/lib/db.ts` diff is **empty** — Dexie still v6, no bump, no new field, no new index. ✅
2. `MonthlyIncomeSummary` is a **calculated-only** type; nothing persists it, so its shape change
   needs no migration. ✅
3. **Every reader** of the renamed/changed fields was updated — the known reader at
   `IncomeStatusIndicator.tsx:227` and three others. No reader still expects the old shape. ✅
4. The dashboard entry-list source change **does not lose or hide user data**; the list is now
   month-scoped (consistent with W5) and every month remains reachable via `MonthNavigator`. ✅
5. `getIncomeEntriesForLast6Months` is production-unused and is **not** flagged — the project has
   no dead-code/unused-exports guard — and its retention is documented in its JSDoc. ✅
6. The cross-year window case in `getLast6Months` is **correct** for the new exclusive window and
   is pinned by a cross-year test. ✅
7. Summing `amount` instead of the stored `monthlyEquivalent` **removes the staleness risk** from
   every compliance path (on-screen and the exported agency artifact). ✅

One **non-blocking observation** only (§ Finding 7, item b): the stale `monthlyEquivalent` still
lives on the row and is still displayed as a labeled personal estimate in the entry form/list. That
is intentional and correctly labeled; it is noted for W6b/W7b awareness, not as a W7a defect.

---

## Evidence

### Finding 1 — No schema change; `db.ts` is untouched (PASS)

`git --no-pager diff 33691f6 HEAD -- src/lib/db.ts` returns **nothing** (exit 0, empty output).

Per `data-migration-standards.md` ("Most changes need no version at all"), `.stores()` declares the
primary key and indexes, not stored fields. W7a adds no new table and no new index, so no version
bump is owed. The `IncomeEntry` row shape in `src/types/income.ts:11-21` is unchanged — `amount`,
`payPeriod`, and `monthlyEquivalent` are all still present and still stored. `monthlyEquivalent` is
still *written* at capture time (`IncomeEntryForm.tsx:151-154, 241`), just no longer *summed* for
compliance. This is a read-side behavior change, not a storage change. **Compliant with the rule's
version-ownership table (v7 = W3, v8 = W6b): W7a claims no version.**

### Finding 2 — `MonthlyIncomeSummary` is calculated, never stored (PASS)

`src/types/income.ts:65` is explicitly commented `// Monthly Income Summary (calculated, not
stored)`. A workspace-wide grep for `MonthlyIncomeSummary` shows it is:

- **produced** only by `getMonthlyIncomeSummary` (`src/lib/storage/income.ts:247-299`), which
  `return`s a freshly-built object;
- **consumed** only in-memory as a React prop / `useState` value (`IncomeDashboard.tsx:50`,
  `IncomeStatusIndicator.tsx:20`) and in tests.

No `db.*.add/put/update` call anywhere takes a `MonthlyIncomeSummary`. Therefore its shape changes —
`incomeBySource[].monthlyEquivalent → .amount`, `seasonalHistory[]` gaining `hasData`, and the new
`seasonalMonthsWithData` — touch no persisted data and need no migration. This is the correct
application of "store the input, derive the output."

### Finding 3 — Every reader of changed fields was updated (PASS)

The type diff (`src/types/income.ts:64-85`) renames `incomeBySource[].monthlyEquivalent → .amount`,
adds `hasData` to `seasonalHistory[]`, and adds `seasonalMonthsWithData`. Readers found and verified:

| Reader | Old | New | Status |
|---|---|---|---|
| `IncomeStatusIndicator.tsx:227` (the known reader) | `source.monthlyEquivalent)/month` | `source.amount` | ✅ updated |
| `SeasonalWorkerView.tsx:127-139` | `monthData.total > 0` | `monthData.hasData` + `"No record"` | ✅ updated |
| `IncomeDashboard.tsx:258-266` | passes `history`, `average` | also passes `monthsWithData={summary.seasonalMonthsWithData ?? 0}` | ✅ updated |
| `SeasonalWorkerView` props (`:40-45`) | `{month; total}` | `{month; total; hasData}` + `monthsWithData` | ✅ updated |
| `buildTextReport.ts:244, 269` (export artifact) | `i.monthlyEquivalent` | `i.amount` | ✅ updated |

Grep for `incomeBySource|seasonalHistory|seasonalAverage|totalIncome|seasonalMonthsWithData` across
`src/` surfaces **no reader still expecting the old field shape**. `tsc --noEmit` is clean, which it
would not be given the renamed `incomeBySource[].amount`.

### Finding 4 — Dashboard entry-list source change loses no data (PASS)

`IncomeDashboard.tsx:92-93` changed its entry-list source from
`getIncomeEntriesForLast6Months(userId, currentMonth)` to
`getIncomeEntriesByMonth(userId, currentMonth)`.

This narrows the list to the **selected month**, but no user data is lost or permanently hidden:

- `currentMonth` is a prop driven by the parent page's `selectedMonth` state
  (`src/app/tracking/page.tsx:78-81, 904`), and `loadIncomeData` re-runs on every `currentMonth`
  change (`IncomeDashboard.tsx:77-79`). Paging to any other month via `MonthNavigator`
  (`tracking/page.tsx:780-784`) reloads that month's entries.
- This aligns the entry list with W5's per-month scoping — the summary, calendar, activities, and
  compliance mode on the same page are all already functions of `selectedMonth`
  (`tracking/page.tsx:113-126`). The list was the one surface still on a rolling window.
- The in-code comment (`IncomeDashboard.tsx:84-90`) correctly notes the subtlety: the old
  6-month-inclusive window only happened to include the current month *because of* the seasonal
  off-by-one being fixed in this same wave; keeping that source after the fix would have **hidden
  the current month's own entries**. The switch to `getIncomeEntriesByMonth` avoids that regression.
- The seasonal average still reads the full preceding window independently inside
  `getMonthlyIncomeSummary → calculateSeasonalAverage`, so the window correction is not lost.

No other flow relied on the 6-month list: the only production caller of
`getIncomeEntriesForLast6Months` was this dashboard line (see Finding 5).

### Finding 5 — Retired function is unused, unflagged, and documented (PASS)

- **Production-unused:** grep shows `getIncomeEntriesForLast6Months` is now referenced only by its
  own definition (`income.ts:144`) and `income.characterization.test.ts:415-423`. The sole former
  production caller (`IncomeDashboard`) moved to `getIncomeEntriesByMonth`.
- **Not dead-code-flagged:** the project has **no** unused-exports guard. `eslint.config.mjs` is
  stock `eslint-config-next` (core-web-vitals + typescript) with no `ts-prune`, `knip`, or
  `eslint-plugin-import/no-unused-modules`; grep for those tool names returns nothing. ESLint's
  `no-unused-vars` does not flag exported module members. `npm run lint` will not break on it.
- **Retention documented:** the JSDoc at `income.ts:135-143` states it has no production caller as
  of W7a and is retained as the tested, natural source for W7b's per-month review-period income
  roll-up. Its window was also corrected to match the new exclusive semantics, so it is not stale.

This is consistent with the migration rule's spirit — don't delete something that still has a
defined future home — while being an export, not stored data, so no data-safety concern attaches.

### Finding 6 — Cross-year date arithmetic is correct (PASS)

`getLast6Months` (`income.ts:216-229`) now iterates `i` from 6 down to 1 and builds
`new Date(year, month - 1 - i, 1)`, relying on JS `Date` normalizing a negative month index into the
prior year. Hand-tracing the new **exclusive** window for the year-boundary case, assessed
`"2027-01"` (`year=2027, month=1`):

- `i=6` → `new Date(2027, -6, 1)` → **2026-07**
- `i=5` → `new Date(2027, -5, 1)` → 2026-08
- ... → 2026-09, 2026-10, 2026-11
- `i=1` → `new Date(2027, -1, 1)` → **2026-12**

Result: `["2026-07" … "2026-12"]` — the six months preceding January 2027, assessed month excluded.
This is exactly what the cross-year test
(`income.characterization.test.ts`, "crosses month boundaries correctly when the window spans a year
change") asserts, and it passes.

Note on the migration rule's "never `new Date(...)` arithmetic across month boundaries": that rule
targets timezone drift when a stored ISO date is reconstructed and compared. Here the inputs are the
integer `year`/`month` parsed from a `YYYY-MM` string, and the `Date` is used only as a month-index
*calendar* (day fixed to `1`, read back via `getFullYear`/`getMonth`), never as an instant compared
across a boundary. There is no timezone-sensitive instant arithmetic. The construction is sound and
test-pinned, but it is the one place in the module doing index math; a `date-fns` `subMonths` on a
first-of-month date would be marginally more idiomatic (see Recommendations).

### Finding 7 — Summing `amount` removes the staleness risk from the compliance path (PASS, with one labeled-estimate observation)

(a) **Risk removed from compliance.** The characterization test "updating `amount` does NOT recompute
`monthlyEquivalent`" (`income.characterization.test.ts:126-142`) pins that the stored
`monthlyEquivalent` goes stale when `amount` is edited (edit `amount` to 100, `monthlyEquivalent`
stays 868). W7a switched **all four** compliance summing sites off `monthlyEquivalent` and onto the
live `amount`:

1. `getMonthlyIncomeSummary` → `totalIncome` (`income.ts:257`)
2. `getMonthlyIncomeSummary` → `incomeBySource` accumulator (`income.ts:260-277`)
3. `calculateSeasonalAverage` → `monthTotal` (`income.ts:192`)
4. `buildTextReport` → the exported agency artifact total and per-entry line
   (`buildTextReport.ts:244, 269`)

Because the compliance figure is now `Σ amount`, a stale `monthlyEquivalent` can no longer corrupt
any threshold comparison, any per-source breakdown, any seasonal average, or the document a
caseworker reads. The three-summing-sites hazard the test suite warned about
(`income.characterization.test.ts:302-331`) is closed, and the export was the fourth site.

As a bonus, this also fixed the pre-existing **overstatement** defect (gap 5.5): summing whole-month
projections made four weekly paychecks read ~4×. The new behavior ($100/wk × 2 → $200, below the
$580 threshold) removes a reassuring **false positive** — the failure class this project most needs
to avoid. Tests `income.characterization.test.ts:253-299` confirm.

(b) **Observation (non-blocking):** the stale `monthlyEquivalent` value still exists on the row and
is still *displayed* — as a de-emphasized "~$X/mo estimate" in `IncomeEntryList.tsx:146` and the live
"monthly equivalent" preview in `IncomeEntryForm.tsx:483`. These are explicitly labeled personal
estimates, not compliance figures, and are correctly excluded from the agency export. The field is
therefore inert for data integrity but can still show a user a stale estimate if they edit an entry's
`amount` through a path that does not also recompute `monthlyEquivalent`. Today the form recomputes
and re-passes it, so the staleness stays latent. This is a known W7a/W6b boundary (storage layer
offers no protection), not a defect introduced by this wave.

---

## Conclusions

- **No migration was required, and the absence of one is correct.** `db.ts` is byte-identical; the
  row shape is unchanged; the only type change is to a calculated-only summary. The wave correctly
  stayed within the "adding/altering derived reads needs no version" lane and did not touch the v6
  schema. This respects the version-ownership table (v7 → W3, v8 → W6b).
- **No reader was left on the old shape**, verified by grep + a clean `tsc` + 724 green tests.
- **No user data is lost or hidden** by the dashboard list change; it is month-scoping consistent
  with W5, and all months stay reachable.
- **The staleness and the 4× overstatement risks are both removed from every compliance path**,
  including the exported agency artifact. The stale derived value survives only as a labeled estimate
  and is harmless to integrity.

**Verdict: W7a is data-integrity clean. Nothing blocks closure on data-safety grounds.**

## Recommendations (optional, not required for W7a)

1. **Low priority / W6b or W7b:** consider whether `monthlyEquivalent` should remain stored at all
   now that no compliance figure reads it. If it stays, a follow-up could recompute it on `amount`
   update in the storage layer (not just the UI) so the labeled estimate can never drift — closing
   the latent staleness in Finding 7(b). This is a storage-layer change and belongs with W6b's
   `captureMethod`/validation scope or W7b, not W7a.
2. **Cosmetic:** `getLast6Months`'s negative-month-index `Date` construction is correct and tested;
   if future edits touch it, prefer `date-fns` `subMonths(new Date(year, month-1, 1), i)` to keep the
   module's "compare with date-fns" convention visible at the one arithmetic site. No change needed
   now.
3. **Housekeeping:** `getIncomeEntriesForLast6Months`'s retention rationale is documented in-code; no
   action needed. If W7b does not adopt it as planned, revisit then.
