/**
 * CHARACTERIZATION TESTS — src/lib/storage/income.ts
 *
 * Added by W0 § 0.2. This is the highest-value file in the wave's test scope:
 * three separate confirmed defects live in this module, and every one of them
 * reports a number to a user who is deciding whether they will keep their health
 * coverage. W0 fixes NONE of them. It pins them, with the CFR citation each
 * violates and the wave that owns the correction.
 *
 * The three:
 *
 *  1. **`monthlyEquivalent` is summed across entries** (`getMonthlyIncomeSummary`,
 *     `calculateSeasonalAverage`). Each row already stores a WHOLE-MONTH
 *     projection, so two bi-weekly paychecks of $400 produce
 *     868 + 868 = $1,736 rather than $868. Audit § 4.1, highest severity.
 *     Owned by **W7a**.
 *
 *  2. **The seasonal window includes the assessed month.** 42 CFR 435.552(g)
 *     averages the 6 months PRECEDING the month being assessed, excluding it.
 *     `getLast6Months("2026-07")` returns February through July — it includes July
 *     and drops January, so it is off by one in both directions. Owned by **W7a**.
 *
 *  3. **The divisor is a hardcoded 6** regardless of how many months hold data,
 *     so a user with one month of records has that month divided by six.
 *     Owned by **W7a**.
 *
 * ## Harness note: import order is load-bearing
 *
 * `fake-indexeddb/auto` MUST be imported before anything that reaches `@/lib/db`,
 * because `db.ts` instantiates Dexie at module load and Dexie binds
 * `globalThis.indexedDB` at construction. It is imported per-file rather than in
 * `vitest.setup.ts` deliberately: a global shim would make this ordering
 * constraint invisible to the next person, and the guard tests do not need a
 * database.
 */

import "fake-indexeddb/auto";

import { describe, it, expect, beforeEach, afterAll } from "vitest";

import { db } from "@/lib/db";
import {
  saveIncomeEntry,
  updateIncomeEntry,
  getIncomeEntryById,
  getIncomeEntriesByMonth,
  getIncomeEntriesForLast6Months,
  calculateSeasonalAverage,
  getMonthlyIncomeSummary,
  setComplianceMode,
  getComplianceMode,
  getStoredComplianceMode,
  setSeasonalWorkerStatus,
  getSeasonalWorkerStatus,
} from "@/lib/storage/income";
import { calculateMonthlyEquivalent } from "@/lib/utils/payPeriodConversion";
import type { IncomeEntry } from "@/types/income";

const USER = "user-1";
const OTHER_USER = "user-2";

/**
 * Build an entry the way the UI does: `monthlyEquivalent` is computed by
 * `calculateMonthlyEquivalent` at capture time and stored. That is the input to
 * defect 1, so the fixture must not shortcut it.
 */
function entry(
  date: string,
  amount: number,
  payPeriod: IncomeEntry["payPeriod"],
  overrides: Partial<IncomeEntry> = {},
): Omit<IncomeEntry, "id" | "createdAt" | "updatedAt"> {
  return {
    userId: USER,
    date,
    amount,
    payPeriod,
    monthlyEquivalent: calculateMonthlyEquivalent(amount, payPeriod),
    ...overrides,
  };
}

beforeEach(async () => {
  await Promise.all([
    db.incomeEntries.clear(),
    db.complianceModes.clear(),
    db.seasonalWorkerStatus.clear(),
  ]);
});

afterAll(async () => {
  db.close();
});

describe("income entry round-trip", () => {
  it("saves an entry and returns its autoincrement id", async () => {
    const id = await saveIncomeEntry(entry("2026-07-10", 400, "bi-weekly"));

    expect(typeof id).toBe("number");
    const stored = await getIncomeEntryById(id);
    expect(stored).toMatchObject({
      userId: USER,
      date: "2026-07-10",
      amount: 400,
      payPeriod: "bi-weekly",
      monthlyEquivalent: 868,
    });
  });

  it("stamps createdAt and updatedAt on save, and moves updatedAt on update", async () => {
    const id = await saveIncomeEntry(entry("2026-07-10", 400, "bi-weekly"));
    const created = await getIncomeEntryById(id);
    expect(created?.createdAt).toBeInstanceOf(Date);
    expect(created?.updatedAt).toBeInstanceOf(Date);

    await updateIncomeEntry(id, { amount: 500 });
    const updated = await getIncomeEntryById(id);

    expect(updated?.amount).toBe(500);
    expect(updated?.createdAt?.getTime()).toBe(created?.createdAt?.getTime());
    expect(updated?.updatedAt?.getTime()).toBeGreaterThanOrEqual(
      created!.updatedAt!.getTime(),
    );
  });

  it("CHARACTERIZATION: updating `amount` does NOT recompute `monthlyEquivalent`", async () => {
    // The derived value is stored, so an update that changes the input leaves the
    // projection stale. .kiro/steering/data-migration-standards.md says "store the
    // input, derive the output" for exactly this reason: "cached derived values go
    // stale the moment a policy value or formula changes, and both will change."
    //
    // The UI happens to recompute and pass `monthlyEquivalent` alongside `amount`,
    // so this is latent rather than active — but the storage layer offers no
    // protection. Owned by W7a alongside the double-counting fix.
    const id = await saveIncomeEntry(entry("2026-07-10", 400, "bi-weekly"));
    await updateIncomeEntry(id, { amount: 100 });

    const stored = await getIncomeEntryById(id);
    expect(stored?.amount).toBe(100);
    expect(stored?.monthlyEquivalent).toBe(868); // still the $400 projection
  });

  it("returns undefined for an id that does not exist", async () => {
    expect(await getIncomeEntryById(9999)).toBeUndefined();
  });

  /**
   * REMOVED, and replaced rather than simply deleted.
   *
   * A characterization test here pinned that `deleteIncomeEntry` removed only the
   * entry row, orphaning `incomeDocuments` and `incomeDocumentBlobs` — W0 § 0.3's
   * second data-loss bug. It was written expecting the narrow function to SURVIVE
   * alongside a new cascading sibling, as on the activity side.
   *
   * It does not survive. `src/lib/storage/activities.ts` exports no narrow
   * `deleteActivity` — the bare row delete is internal to
   * `deleteActivityWithDocuments` — so exact symmetry meant removing the narrow
   * income export too. Keeping it would have left a trap: same argument, reads as
   * the obvious choice, silently orphans blobs that nothing reclaims (there is no
   * income counterpart to `cleanupOrphanedDocuments`).
   *
   * The behaviour it pinned is now covered from the other side, in
   * `deleteIncomeEntryWithDocuments.test.ts`: the cascade removes documents and
   * blobs, spares other entries' documents, and preserves the entry when a
   * document delete fails.
   */
});

describe("getIncomeEntriesByMonth: string-range query scoped by user", () => {
  it("returns only entries inside the YYYY-MM range", async () => {
    await saveIncomeEntry(entry("2026-06-30", 100, "monthly"));
    await saveIncomeEntry(entry("2026-07-01", 200, "monthly"));
    await saveIncomeEntry(entry("2026-07-31", 300, "monthly"));
    await saveIncomeEntry(entry("2026-08-01", 400, "monthly"));

    const july = await getIncomeEntriesByMonth(USER, "2026-07");

    expect(july.map((e) => e.date).sort()).toEqual([
      "2026-07-01",
      "2026-07-31",
    ]);
  });

  it("excludes another user's entries in the same month", async () => {
    await saveIncomeEntry(entry("2026-07-10", 100, "monthly"));
    await saveIncomeEntry(
      entry("2026-07-11", 900, "monthly", { userId: OTHER_USER }),
    );

    const mine = await getIncomeEntriesByMonth(USER, "2026-07");

    expect(mine).toHaveLength(1);
    expect(mine[0].amount).toBe(100);
  });

  it("uses an inclusive `-01` to `-31` string bound, so short months work by lexical ordering", async () => {
    // The bound is literally `${month}-01` to `${month}-31`. For February the upper
    // bound is the non-existent "2026-02-31", which still sorts after "2026-02-28",
    // so the query is correct — by string ordering rather than by calendar logic.
    // Recorded because W5 replaces month scoping and may switch to date objects,
    // at which point "2026-02-31" becomes an invalid Date rather than a safe bound.
    //
    // Asserted by including the last real day of a 28-day month AND a leap day,
    // both of which a calendar-aware upper bound would have to compute and a
    // string bound gets for free.
    await saveIncomeEntry(entry("2026-02-28", 250, "monthly"));
    await saveIncomeEntry(entry("2028-02-29", 260, "monthly"));

    const feb2026 = await getIncomeEntriesByMonth(USER, "2026-02");
    const feb2028 = await getIncomeEntriesByMonth(USER, "2028-02");

    expect(feb2026.map((e) => e.date)).toEqual(["2026-02-28"]);
    expect(feb2028.map((e) => e.date)).toEqual(["2028-02-29"]);
  });

  it("CHARACTERIZATION: a day-32 date would also be captured, because the bound is textual not calendrical", async () => {
    // "2026-07-32" is not a date, but it sorts inside "2026-07-01".."2026-07-31"?
    // No — it sorts AFTER "2026-07-31", so it is excluded. Pinned to record that
    // the range is a string comparison with no validation on either side: nothing
    // stops an invalid `date` being written, and whether it is found depends on
    // lexical position rather than on being a real day.
    await saveIncomeEntry(entry("2026-07-32", 999, "monthly"));

    const july = await getIncomeEntriesByMonth(USER, "2026-07");

    expect(july).toHaveLength(0);
    expect(await db.incomeEntries.count()).toBe(1); // written, but unfindable
  });

  it("returns an empty array for a month with no entries", async () => {
    expect(await getIncomeEntriesByMonth(USER, "2026-07")).toEqual([]);
  });
});

describe("W7a: the month's income is the SUM OF ACTUAL AMOUNTS RECEIVED, not of projections", () => {
  // ───────────────────────────────────────────────────────────────────────────
  // INVERTED BY W7a, 2026-09-03. This block used to pin the DEFECT (audit § 4.1):
  // `getMonthlyIncomeSummary` summed each row's `monthlyEquivalent` — a whole-month
  // PROJECTION of one paycheck's pay period — so two bi-weekly $400 paychecks read
  // $1,736 and four weekly $150 paychecks read $2,598. That OVERSTATED income and
  // told a user they cleared the $580 threshold when they had not: the reassuring
  // false positive this project cannot absorb.
  //
  // THE FIX (ADR-0003): entries are evidence of payment RECEIVED. The month's income
  // is Σ amount of the paychecks received that month, which is the real monthly
  // gross and what 42 CFR 435.552(f)(2), 91 FR 33470 measures as MAGI-based monthly
  // income. `monthlyEquivalent` is no longer summed for any compliance figure; it
  // survives only as a labeled personal estimate on the entry form (gap 5.4).
  //
  // Turning these red/updated was the signal the fix landed. Updated rather than
  // deleted so the record of what was wrong survives in the file that proved it.
  // ───────────────────────────────────────────────────────────────────────────

  it("gap 5.5: two bi-weekly $400 paychecks report $800 — the actual gross, not $1,736", async () => {
    await saveIncomeEntry(entry("2026-07-03", 400, "bi-weekly"));
    await saveIncomeEntry(entry("2026-07-17", 400, "bi-weekly"));

    const summary = await getMonthlyIncomeSummary(USER, "2026-07");

    expect(summary.totalIncome).toBe(800);
    expect(summary.entryCount).toBe(2);
  });

  it("gap 5.5: four weekly $150 paychecks report $600 — the real gross, not ~$2,598", async () => {
    for (const date of [
      "2026-07-03",
      "2026-07-10",
      "2026-07-17",
      "2026-07-24",
    ]) {
      await saveIncomeEntry(entry(date, 150, "weekly"));
    }

    const summary = await getMonthlyIncomeSummary(USER, "2026-07");

    expect(summary.totalIncome).toBe(600);
  });

  it("gap 5.5: the inflation no longer crosses the threshold — $100/week × 2 reads $200, not $866", async () => {
    // The exact case the old DEFECT test used to show crossing $580 on inflation:
    // two weekly $100 paychecks. Real gross is $200; it must read $200 and NOT clear
    // the threshold.
    await saveIncomeEntry(entry("2026-07-03", 100, "weekly"));
    await saveIncomeEntry(entry("2026-07-10", 100, "weekly"));

    const summary = await getMonthlyIncomeSummary(USER, "2026-07");

    expect(summary.totalIncome).toBe(200);
    expect(summary.isCompliant).toBe(false); // real gross was $200, below $580
    expect(summary.amountNeeded).toBe(380);
  });

  it("a single monthly entry is unchanged — the fix is 'sum actual amounts', not 'divide by n'", async () => {
    await saveIncomeEntry(entry("2026-07-10", 800, "monthly"));

    const summary = await getMonthlyIncomeSummary(USER, "2026-07");

    expect(summary.totalIncome).toBe(800);
  });

  it("carries the same inflation into the incomeBySource breakdown, which is a SEPARATE summing site", async () => {
    // NOTE FOR W7a — there are THREE places that sum `monthlyEquivalent`, not one.
    // Found by mutation while pinning this defect: replacing the two `reduce`
    // accumulators (`getMonthlyIncomeSummary`'s `totalIncome` and
    // `calculateSeasonalAverage`'s `monthTotal`) left THIS test green, because
    // `incomeBySource` accumulates through `existing.monthlyEquivalent +=` and
    // `acc.push({ monthlyEquivalent: entry.monthlyEquivalent })` instead.
    //
    // So a fix applied only to the reduces would leave the per-source breakdown
    // still inflated — and the breakdown is what a user reads when deciding which
    // employer's pay stub to photograph. Grep `monthlyEquivalent` in the module,
    // do not trust the type checker.
    // THE THIRD SUMMING SITE. `incomeBySource` accumulates through `+=` and `push`,
    // not a reduce, so a fix applied only to the two reduces would leave this inflated.
    // The breakdown is what a user reads when deciding which pay stub to photograph.
    await saveIncomeEntry(
      entry("2026-07-03", 400, "bi-weekly", { source: "Diner" }),
    );
    await saveIncomeEntry(
      entry("2026-07-17", 400, "bi-weekly", { source: "Diner" }),
    );

    const summary = await getMonthlyIncomeSummary(USER, "2026-07");

    // Actual amounts received, grouped by source: $400 + $400 = $800, not $1,736.
    expect(summary.incomeBySource).toEqual([{ source: "Diner", amount: 800 }]);
  });

  it("groups a missing source under 'Unspecified' rather than dropping the row", async () => {
    await saveIncomeEntry(entry("2026-07-03", 300, "monthly"));
    await saveIncomeEntry(
      entry("2026-07-17", 200, "monthly", { source: "Diner" }),
    );

    const summary = await getMonthlyIncomeSummary(USER, "2026-07");

    expect(summary.incomeBySource).toEqual(
      expect.arrayContaining([
        { source: "Unspecified", amount: 300 },
        { source: "Diner", amount: 200 },
      ]),
    );
  });
});

describe("W7a: the seasonal window is the 6 months PRECEDING the assessed month, exclusive", () => {
  // ───────────────────────────────────────────────────────────────────────────
  // INVERTED BY W7a, 2026-09-03. This block used to pin the DEFECT: the window
  // INCLUDED the assessed month and dropped the sixth preceding month — off by one
  // in both directions. 42 CFR 435.552(g), 91 FR 33470: the average is over the 6
  // months PRECEDING the month being assessed, which that month is excluded from.
  // CMS's worked example (rule-extract.md § 2.7): assessed month June → average
  // December through May.
  //
  // Fixed in getLast6Months: for an assessed month of July the window is now
  // January–June. The assessed month cannot inflate the average it is compared to.
  // The reasonably-predictable-changes alternative (42 CFR 435.603(h)(3)) remains a
  // state election surfaced in copy, not computed.
  // ───────────────────────────────────────────────────────────────────────────

  it("gap 5.8: returns January through June for an assessed month of July — the assessed month excluded", async () => {
    await setSeasonalWorkerStatus(USER, "2026-07", true);

    const { history } = await calculateSeasonalAverage(USER, "2026-07");

    expect(history.map((h) => h.month)).toEqual([
      "2026-01",
      "2026-02",
      "2026-03",
      "2026-04",
      "2026-05",
      "2026-06",
    ]);
  });

  it("gap 5.8: the assessed month is excluded", async () => {
    const { history } = await calculateSeasonalAverage(USER, "2026-07");
    expect(history.map((h) => h.month)).not.toContain("2026-07");
  });

  it("gap 5.8: the sixth preceding month is included", async () => {
    const { history } = await calculateSeasonalAverage(USER, "2026-07");
    expect(history.map((h) => h.month)).toContain("2026-01");
  });

  it("the assessed month's own income cannot raise the average it is compared against", async () => {
    // The circularity the old off-by-one created, now closed: a big July does not
    // enter the July-assessed window at all.
    await setSeasonalWorkerStatus(USER, "2026-07", true);
    await saveIncomeEntry(entry("2026-07-10", 6000, "monthly"));

    const { average, history } = await calculateSeasonalAverage(
      USER,
      "2026-07",
    );

    expect(history.find((h) => h.month === "2026-07")).toBeUndefined();
    expect(average).toBe(0); // July's $6,000 is outside the window
  });

  it("crosses month boundaries correctly when the window spans a year change", async () => {
    // Assessed January 2027 → the six preceding months are July–December 2026.
    const { history } = await calculateSeasonalAverage(USER, "2027-01");

    expect(history.map((h) => h.month)).toEqual([
      "2026-07",
      "2026-08",
      "2026-09",
      "2026-10",
      "2026-11",
      "2026-12",
    ]);
  });

  it("getIncomeEntriesForLast6Months spans the same corrected window", async () => {
    await saveIncomeEntry(entry("2026-01-15", 100, "monthly"));
    await saveIncomeEntry(entry("2026-06-15", 600, "monthly"));
    await saveIncomeEntry(entry("2026-07-15", 700, "monthly"));

    const found = await getIncomeEntriesForLast6Months(USER, "2026-07");

    // January and June are inside the Jan–Jun window; July (assessed) is excluded.
    expect(found.map((e) => e.date).sort()).toEqual([
      "2026-01-15",
      "2026-06-15",
    ]);
  });
});

describe("W7a: sparse seasonal history averages over months WITH DATA, and flags insufficiency", () => {
  // ───────────────────────────────────────────────────────────────────────────
  // INVERTED BY W7a, 2026-09-03. This block used to pin the DEFECT: the divisor was
  // a hardcoded 6 regardless of how many months held records, so one month of
  // $3,000 read as a $500 average — a 6x UNDERSTATEMENT that sends a user looking
  // for hours they may not need.
  //
  // The design decision (recorded in the wave file): HourKeep holds only what the
  // user typed, so a month with no entries is "no record", NOT "$0 earned".
  // Imputing $0 for missing months is what produced the understatement. So the
  // average is over the months that actually hold data, each history row carries a
  // `hasData` flag, and `monthsWithData` lets the UI say the history is incomplete
  // rather than presenting a thin average as if it were verified.
  // ───────────────────────────────────────────────────────────────────────────

  it("gap 5.9: one month of $3,000 averages to $3,000, not $500", async () => {
    await saveIncomeEntry(entry("2026-05-10", 3000, "monthly"));

    const { average, monthsWithData } = await calculateSeasonalAverage(
      USER,
      "2026-07",
    );

    expect(average).toBe(3000); // 3000 / 1, not 3000 / 6
    expect(monthsWithData).toBe(1);
  });

  it("gap 5.9: a month with no entries is marked hasData:false, distinct from a $0 month", async () => {
    await saveIncomeEntry(entry("2026-06-10", 600, "monthly"));

    const { history } = await calculateSeasonalAverage(USER, "2026-07");

    const june = history.find((h) => h.month === "2026-06");
    const may = history.find((h) => h.month === "2026-05");
    expect(june).toMatchObject({ total: 600, hasData: true });
    expect(may).toMatchObject({ total: 0, hasData: false });
  });

  it("a full six-month history averages over six", async () => {
    // Positive twin: when every month has data, the divisor is 6.
    for (const m of [
      "2026-01",
      "2026-02",
      "2026-03",
      "2026-04",
      "2026-05",
      "2026-06",
    ]) {
      await saveIncomeEntry(entry(`${m}-10`, 600, "monthly"));
    }

    const { average, monthsWithData } = await calculateSeasonalAverage(
      USER,
      "2026-07",
    );

    expect(average).toBe(600); // 3600 / 6
    expect(monthsWithData).toBe(6);
  });

  it("an empty history reports a 0 average and monthsWithData 0, not NaN", async () => {
    const { average, monthsWithData, history } = await calculateSeasonalAverage(
      USER,
      "2026-07",
    );

    expect(average).toBe(0);
    expect(monthsWithData).toBe(0);
    expect(history).toHaveLength(6);
    expect(history.every((h) => h.hasData === false)).toBe(true);
  });

  it("still reports exactly 6 history rows, so the UI can show each month explicitly", async () => {
    await saveIncomeEntry(entry("2026-06-10", 600, "monthly"));

    const { history } = await calculateSeasonalAverage(USER, "2026-07");

    expect(history).toHaveLength(6);
    expect(history.filter((h) => h.hasData)).toHaveLength(1);
  });
});

describe("getMonthlyIncomeSummary: threshold comparison and the seasonal fork", () => {
  it("compares the non-seasonal month total against the threshold inclusively", async () => {
    await saveIncomeEntry(entry("2026-07-10", 580, "monthly"));

    const summary = await getMonthlyIncomeSummary(USER, "2026-07");

    expect(summary.totalIncome).toBe(580);
    expect(summary.isCompliant).toBe(true);
    expect(summary.amountNeeded).toBe(0);
  });

  it("reports the difference to the threshold and floors it at 0", async () => {
    await saveIncomeEntry(entry("2026-07-10", 380, "monthly"));

    const summary = await getMonthlyIncomeSummary(USER, "2026-07");

    // 42 CFR 435.552(e)(2): income below the threshold is not wasted — the state
    // MAY credit monthlyIncome / federalMinimumWage as hours and combine it. CMS's
    // example is $380 / $7.25 = 52 hours, needing 28 more. This module models none
    // of that; the proxy is W7b. Recorded so the omission is visible.
    expect(summary.amountNeeded).toBe(200);
    expect(summary.isCompliant).toBe(false);
  });

  it("compares the seasonal AVERAGE of the preceding window, not the assessed month's total", async () => {
    // W7a: income in the assessed month (July) does NOT enter the July-assessed
    // seasonal window — only the six preceding months do. Put $3,600 across the
    // Jan–Jun window and $9,000 in July; the average is $600 (3600/6), and July's
    // own $9,000 is irrelevant to the comparison.
    await setSeasonalWorkerStatus(USER, "2026-07", true);
    for (const m of [
      "2026-01",
      "2026-02",
      "2026-03",
      "2026-04",
      "2026-05",
      "2026-06",
    ]) {
      await saveIncomeEntry(entry(`${m}-10`, 600, "monthly"));
    }
    await saveIncomeEntry(entry("2026-07-10", 9000, "monthly"));

    const summary = await getMonthlyIncomeSummary(USER, "2026-07");

    expect(summary.totalIncome).toBe(9000); // the assessed month's own recorded income
    expect(summary.seasonalAverage).toBe(600); // 3600 / 6, from the preceding window only
    expect(summary.isCompliant).toBe(true); // 600 >= 580 on the preceding average
  });

  it("omits seasonalAverage and seasonalHistory entirely when not a seasonal worker", async () => {
    await saveIncomeEntry(entry("2026-07-10", 600, "monthly"));

    const summary = await getMonthlyIncomeSummary(USER, "2026-07");

    expect(summary.isSeasonalWorker).toBe(false);
    expect(summary.seasonalAverage).toBeUndefined();
    expect(summary.seasonalHistory).toBeUndefined();
  });

  it("reads seasonal status PER MONTH, so the same user can be seasonal in one month and not another", async () => {
    await setSeasonalWorkerStatus(USER, "2026-07", true);
    await saveIncomeEntry(entry("2026-07-10", 3000, "monthly"));
    await saveIncomeEntry(entry("2026-08-10", 3000, "monthly"));

    const july = await getMonthlyIncomeSummary(USER, "2026-07");
    const august = await getMonthlyIncomeSummary(USER, "2026-08");

    expect(july.isSeasonalWorker).toBe(true);
    // August is non-seasonal, so it compares August's own actual total ($3,000) and
    // clears the threshold.
    expect(august.isSeasonalWorker).toBe(false);
    expect(august.isCompliant).toBe(true);
  });

  it("returns a zeroed summary for a month with no entries", async () => {
    const summary = await getMonthlyIncomeSummary(USER, "2026-07");

    expect(summary).toMatchObject({
      month: "2026-07",
      totalIncome: 0,
      entryCount: 0,
      isCompliant: false,
      amountNeeded: 580,
      isSeasonalWorker: false,
    });
  });
});

describe("complianceMode and seasonalWorkerStatus: per-user, per-month upserts", () => {
  // `complianceMode` is the hours/income fork that ADR-0004 removes and W7b
  // deletes. `.kiro/steering/data-migration-standards.md` is explicit that it must
  // NOT be dropped before then — four files reference it and removing it early
  // breaks reads. Pinned so W7b's removal is a visible change rather than a
  // silent one.

  it("defaults the compliance mode to 'hours' when nothing is stored", async () => {
    expect(await getComplianceMode(USER, "2026-07")).toBe("hours");
  });

  it("W5: getStoredComplianceMode distinguishes 'no row' from a stored 'hours'", async () => {
    // Added by W5, and the distinction is load-bearing rather than pedantic.
    //
    // `getComplianceMode` collapses both cases to "hours". Once the tracking page
    // reads the mode for the SELECTED month rather than for today, that collapse
    // becomes a visible defect: a user tracking income in July who pages back to
    // June — a month they have never opened, so it has no row — would have the
    // entire surface silently flip to hours tracking mid-navigation. Nothing
    // announces it, and their income entries appear to be gone.
    //
    // So the page needs to tell "this month is set to hours" apart from "this
    // month has no preference", and keep showing what the user was looking at in
    // the second case.
    //
    // Added ALONGSIDE getComplianceMode rather than changing it, because
    // .kiro/steering/data-migration-standards.md is explicit that complianceMode
    // must not be tidied before W7b. Both go together when ADR-0004's unified
    // compliance view lands and the hours/income fork stops existing.
    expect(await getStoredComplianceMode(USER, "2026-06")).toBeUndefined();

    await setComplianceMode(USER, "2026-06", "hours");
    expect(await getStoredComplianceMode(USER, "2026-06")).toBe("hours");

    await setComplianceMode(USER, "2026-07", "income");
    expect(await getStoredComplianceMode(USER, "2026-07")).toBe("income");

    // Still scoped per user, like its sibling.
    expect(
      await getStoredComplianceMode(OTHER_USER, "2026-07"),
    ).toBeUndefined();
  });

  it("upserts rather than inserting a second row for the same user and month", async () => {
    await setComplianceMode(USER, "2026-07", "income");
    await setComplianceMode(USER, "2026-07", "hours");

    expect(await db.complianceModes.where({ userId: USER }).count()).toBe(1);
    expect(await getComplianceMode(USER, "2026-07")).toBe("hours");
  });

  it("keeps compliance mode separate per month and per user", async () => {
    await setComplianceMode(USER, "2026-07", "income");
    await setComplianceMode(USER, "2026-08", "hours");
    await setComplianceMode(OTHER_USER, "2026-07", "hours");

    expect(await getComplianceMode(USER, "2026-07")).toBe("income");
    expect(await getComplianceMode(USER, "2026-08")).toBe("hours");
    expect(await getComplianceMode(OTHER_USER, "2026-07")).toBe("hours");
  });

  it("defaults seasonal worker status to false when nothing is stored", async () => {
    expect(await getSeasonalWorkerStatus(USER, "2026-07")).toBe(false);
  });

  it("upserts seasonal worker status, and can be set back to false", async () => {
    await setSeasonalWorkerStatus(USER, "2026-07", true);
    expect(await getSeasonalWorkerStatus(USER, "2026-07")).toBe(true);

    await setSeasonalWorkerStatus(USER, "2026-07", false);
    expect(await getSeasonalWorkerStatus(USER, "2026-07")).toBe(false);
    expect(await db.seasonalWorkerStatus.where({ userId: USER }).count()).toBe(
      1,
    );
  });
});
