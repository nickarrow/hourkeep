/**
 * The single evaluation path — W8a, ADR-0006 § Non-negotiables.
 *
 * WHY THIS MODULE EXISTS. Before W8a the export (`buildTextReport`) recomputed a month's
 * hours total with its own inline `reduce`, independently of the two functions the UI
 * calls (`calculateMonthlySummary`, `getMonthlyIncomeSummary`). The two could disagree
 * about the same month — gap 8.9, `harmful` — most sharply after W6a's education cliff,
 * where `calculateMonthlySummary` derives education's contribution rather than summing the
 * stored per-row `hours`. The export's naive `reduce` summed the raw hours, so a
 * less-than-half-time education row printed a different total than the dashboard showed.
 *
 * `evaluateMonth` is the honest version of ADR-0006's "one evaluation path": ONE call site
 * wrapping today's two evaluators, NOT W7b's unified combination engine (which needs the
 * status model W3 and the screening rebuild W4, both post-date). It returns the computed
 * FACTS for a month — the hours summary, the income summary with its resolved seasonal
 * average, and the thresholds — and nothing that reaches a verdict. The `isCompliant`
 * fields on the two summaries are deliberately not surfaced: carrying a verdict onto the
 * one artifact a caseworker reads is the ADR-0003 harm this structural change prevents.
 *
 * Tier 1 under `engineering-standards.md` ("plus policy / review-period / export logic"),
 * so these tests were written before the module. Each name carries the CFR citation and
 * the FR page, resolved from `docs/domain/cms-2454-ifc/2026-11094.txt`.
 */

import { describe, it, expect } from "vitest";
import "fake-indexeddb/auto";

import { evaluateMonth } from "@/lib/evaluateMonth";
import { calculateMonthlySummary } from "@/lib/calculations";
import { db } from "@/lib/db";
import { saveIncomeEntry, setSeasonalWorkerStatus } from "@/lib/storage/income";
import {
  FEDERAL_DEFAULT,
  incomeThreshold,
  type PolicyProfile,
} from "@/lib/policy";
import type { Activity } from "@/types";
import type { IncomeEntry } from "@/types/income";

const NOW = new Date("2026-08-17T12:00:00Z");
const USER = "user-1";

function activity(partial: Partial<Activity> & { date: string }): Activity {
  return {
    type: "work",
    hours: 0,
    createdAt: NOW,
    updatedAt: NOW,
    ...partial,
  } as Activity;
}

function incomeRow(
  date: string,
  amount: number,
  over: Partial<IncomeEntry> = {},
): Omit<IncomeEntry, "id" | "createdAt" | "updatedAt"> {
  return {
    userId: USER,
    date,
    amount,
    payPeriod: "monthly",
    monthlyEquivalent: amount,
    ...over,
  };
}

async function clearDb() {
  await Promise.all(db.tables.map((t) => t.clear()));
}

describe("evaluateMonth: one call site, no recomputation (gap 8.9)", () => {
  it("§ 435.552(a), 91 FR 33470: the hours total equals calculateMonthlySummary's, exactly", async () => {
    await clearDb();
    const activities = [
      activity({ date: "2026-07-01", type: "work", hours: 20 }),
      activity({ date: "2026-07-02", type: "volunteer", hours: 15 }),
      activity({ date: "2026-07-03", type: "workProgram", hours: 10 }),
    ];

    const result = await evaluateMonth({
      month: "2026-07",
      userId: USER,
      activities,
    });

    // The whole point: evaluateMonth does not do its own arithmetic. It returns the
    // canonical summary, so the export can read it instead of re-reducing.
    expect(result.hours).toEqual(
      calculateMonthlySummary(activities, "2026-07", FEDERAL_DEFAULT),
    );
    expect(result.hours.totalHours).toBe(45);
  });

  it("§ 435.552(d), 91 FR 33470-33471: a less-than-half-time education month reports the CONVERTED contribution, not raw stored hours", async () => {
    await clearDb();
    // The divergence that gap 8.9 names. A less-than-half-time row with 6 credit hours
    // converts to 6 × 3 × 4.33 = 77.94 combinable hours. A naive sum of the stored `hours`
    // (here deliberately a different number, 99) would print 99 — which is what the export's
    // own `reduce` did. evaluateMonth returns the derived figure the dashboard shows.
    const activities = [
      activity({
        date: "2026-07-01",
        type: "education",
        hours: 99,
        enrollmentStatus: "less-than-half-time",
        creditHours: 6,
      }),
    ];

    const result = await evaluateMonth({
      month: "2026-07",
      userId: USER,
      activities,
    });

    expect(result.hours.totalHours).toBeCloseTo(77.94, 2);
    expect(result.hours.totalHours).not.toBe(99);
  });
});

describe("evaluateMonth: thresholds come from the profile (ADR-0001)", () => {
  it("§ 435.552(a)(1), 91 FR 33470: the hours threshold moves with an injected profile", async () => {
    await clearDb();
    const raised: PolicyProfile = {
      ...FEDERAL_DEFAULT,
      id: "test:raised",
      requiredHours: 40,
    };

    const result = await evaluateMonth({
      month: "2026-07",
      userId: USER,
      activities: [activity({ date: "2026-07-01", type: "work", hours: 40 })],
      policy: raised,
    });

    expect(result.thresholds.hours).toBe(40);
    expect(result.hours.hoursNeeded).toBe(0);
  });

  it("§ 435.552(a)(6), 91 FR 33470: the income threshold is the wage × hours from the profile", async () => {
    await clearDb();
    const result = await evaluateMonth({
      month: "2026-07",
      userId: USER,
      activities: [],
    });

    expect(result.thresholds.income).toBe(incomeThreshold(FEDERAL_DEFAULT));
    expect(result.thresholds.income).toBe(580); // 7.25 × 80, federal default
  });
});

describe("evaluateMonth: income is actual amounts received (W7a, gap 5.5)", () => {
  it("§ 435.552(f)(2), 91 FR 33470: four weekly $150 paychecks total $600, not a projection", async () => {
    await clearDb();
    await saveIncomeEntry(
      incomeRow("2026-07-03", 150, {
        payPeriod: "weekly",
        monthlyEquivalent: 649.5,
      }),
    );
    await saveIncomeEntry(
      incomeRow("2026-07-10", 150, {
        payPeriod: "weekly",
        monthlyEquivalent: 649.5,
      }),
    );
    await saveIncomeEntry(
      incomeRow("2026-07-17", 150, {
        payPeriod: "weekly",
        monthlyEquivalent: 649.5,
      }),
    );
    await saveIncomeEntry(
      incomeRow("2026-07-24", 150, {
        payPeriod: "weekly",
        monthlyEquivalent: 649.5,
      }),
    );

    const result = await evaluateMonth({
      month: "2026-07",
      userId: USER,
      activities: [],
    });

    expect(result.income.totalIncome).toBe(600);
  });
});

describe("evaluateMonth: the seasonal average reaches the result (W7a finding 6, gap 5.8)", () => {
  it("§ 435.552(g), 91 FR 33470: a seasonal worker's result carries the preceding-6-month average, not the assessed month's own total", async () => {
    await clearDb();
    // Assessed month July → the window is January–June (preceding, exclusive). CMS's
    // divisor is the window length: $3,000 over 6 months = $500 even if only some months
    // hold records. rule-extract.md § 2.7.
    await saveIncomeEntry(incomeRow("2026-02-15", 1500));
    await saveIncomeEntry(incomeRow("2026-03-15", 1500));
    // July itself has a large paycheck that must NOT be what the seasonal comparison uses.
    await saveIncomeEntry(incomeRow("2026-07-15", 5000));
    await setSeasonalWorkerStatus(USER, "2026-07", true);

    const result = await evaluateMonth({
      month: "2026-07",
      userId: USER,
      activities: [],
    });

    expect(result.income.isSeasonalWorker).toBe(true);
    expect(result.income.seasonalAverage).toBe(500); // 3000 / 6
    // The assessed month's own $5,000 is not the seasonal figure.
    expect(result.income.seasonalAverage).not.toBe(5000);
    // And the window excludes July: no July row in the history.
    expect(
      result.income.seasonalHistory?.some((h) => h.month === "2026-07"),
    ).toBe(false);
  });
});

describe("evaluateMonth: it returns facts, never a verdict (ADR-0003)", () => {
  it("the result exposes thresholds and totals, and does not re-expose a top-level isCompliant", async () => {
    await clearDb();
    const result = await evaluateMonth({
      month: "2026-07",
      userId: USER,
      activities: [activity({ date: "2026-07-01", type: "work", hours: 90 })],
    });

    // The export reads these.
    expect(result).toHaveProperty("thresholds");
    expect(result).toHaveProperty("hours");
    expect(result).toHaveProperty("income");
    // evaluateMonth must NOT hoist a verdict to its own surface. The summaries keep their
    // (verdict-named, W7b-renamed) fields internally; the single evaluation path does not
    // promote them, so a caller cannot read `evaluation.isCompliant` and print it.
    expect(result).not.toHaveProperty("isCompliant");
    expect(result).not.toHaveProperty("complianceStatus");
    expect(result).not.toHaveProperty("meetsThreshold");
  });
});
