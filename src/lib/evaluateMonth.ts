/**
 * The single evaluation path — W8a, ADR-0006 § Non-negotiables.
 *
 * ONE function the export (and, in principle, the UI) calls to get a month's computed
 * facts. It wraps today's two evaluators — `calculateMonthlySummary` for hours and
 * `getMonthlyIncomeSummary` for income — AS THEY STAND. It exists to make gap 8.9
 * structurally impossible: before it, `buildTextReport` recomputed a month's hours with
 * its own inline `reduce`, which diverged from `calculateMonthlySummary` after W6a's
 * education cliff (the export summed stored `hours`; the summary derives the half-time /
 * credit-hour contribution). Routing the export through this function means the artifact a
 * caseworker reads can no longer contradict the screen.
 *
 * WHAT IT IS NOT. It does not combine hours and income into one total, and it does not
 * implement the § 435.552(e)(2) income-to-hours proxy. That is ADR-0004 / W7b, which needs
 * the status model (W3) and the screening rebuild (W4), both post-date. "One evaluation
 * path" here means ONE CALL SITE, not unified combination logic — see the recommended
 * resolution in `docs/hr1-readiness/waves/wave-8-evidence-package.md`.
 *
 * NO VERDICT ESCAPES (ADR-0003). The two summaries carry verdict-named fields
 * (`MonthlySummary.isCompliant`, `MonthlyIncomeSummary.isCompliant`), which W7b renames.
 * This function returns the facts — totals, thresholds, the resolved seasonal average —
 * and does not hoist either `isCompliant` to its own surface. The export reads Logged /
 * Threshold / Difference from these facts and never a pass/fail. Carrying a verdict onto
 * the one artifact a caseworker reads is the exact harm this structural change prevents.
 *
 * ASYNC BOUNDARY. This is async because `getMonthlyIncomeSummary` reads the user's seasonal
 * status from IndexedDB. The export's pure, synchronous `buildTextReport` stays pure: the
 * caller (the export page) awaits `evaluateMonth` and passes the resolved result in as
 * plain data. `buildTextReport` gains facts, not a Dexie read — preserving the testability
 * that was the whole point of extracting it in W2a (`.kiro/steering/data-migration-standards.md`:
 * the storage layer is the only thing that touches Dexie).
 *
 * CFR anchors resolved from `docs/domain/cms-2454-ifc/2026-11094.txt`:
 *   - hours threshold & pathways — 42 CFR 435.552(a)(1)-(5), 91 FR 33470
 *   - income threshold = FLSA wage × hours — 42 CFR 435.552(a)(6), (f), 91 FR 33470
 *   - seasonal average over the 6 preceding months — 42 CFR 435.552(g), 91 FR 33470
 */

import type { Activity, MonthlySummary } from "@/types";
import type { MonthlyIncomeSummary } from "@/types/income";
import { calculateMonthlySummary } from "@/lib/calculations";
import { getMonthlyIncomeSummary } from "@/lib/storage/income";
import {
  FEDERAL_DEFAULT,
  incomeThreshold,
  type PolicyProfile,
} from "@/lib/policy";

export interface EvaluateMonthInput {
  /** The calendar month to evaluate, as `YYYY-MM`. Required — ADR-0005. */
  month: string;
  /** The profile id whose income/seasonal records to read. */
  userId: string;
  /**
   * The user's activities (any months; `calculateMonthlySummary` filters to `month`).
   * Passed in rather than read here so the hours half stays a pure computation and callers
   * that already hold activities in memory (the tracking page) need no second DB read.
   */
  activities: Activity[];
  /** Thresholds and elections. Optional, defaulting to the federal statutory floor (ADR-0001). */
  policy?: PolicyProfile;
}

/**
 * A month's computed facts — the single shape the export reads.
 *
 * `hours` and `income` are the canonical summaries, unchanged. `thresholds` is surfaced
 * alongside so the export prints Logged / Threshold / Difference from one source. There is
 * deliberately no top-level verdict field.
 */
export interface MonthEvaluation {
  month: string;
  hours: MonthlySummary;
  income: MonthlyIncomeSummary;
  thresholds: {
    /** 42 CFR 435.552(a)(1)-(5), 91 FR 33470. */
    hours: number;
    /** 42 CFR 435.552(a)(6), (f), 91 FR 33470 — the FLSA wage × the hours figure. */
    income: number;
  };
}

/**
 * Evaluate one month through the canonical functions. The export calls this instead of
 * recomputing, so its totals cannot drift from the UI's.
 */
export async function evaluateMonth({
  month,
  userId,
  activities,
  policy = FEDERAL_DEFAULT,
}: EvaluateMonthInput): Promise<MonthEvaluation> {
  // Hours: pure, synchronous, the same call the dashboard makes. `calculateMonthlySummary`
  // validates `month` and owns the education cliff, so the export inherits both for free.
  const hours = calculateMonthlySummary(activities, month, policy);

  // Income: async because it resolves the user's seasonal status and, when seasonal, the
  // preceding-6-month average (42 CFR 435.552(g)). This is where the export was previously
  // blind — it never received seasonal status, so a seasonal worker's artifact printed the
  // assessed month's own total instead of the statutory average (W7a finding 6).
  const income = await getMonthlyIncomeSummary(userId, month, policy);

  return {
    month,
    hours,
    income,
    thresholds: {
      hours: policy.requiredHours,
      income: incomeThreshold(policy),
    },
  };
}
