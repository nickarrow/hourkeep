/**
 * Income Storage Functions
 *
 * Handles storage and retrieval of income entries and compliance mode data.
 */

import { db } from "@/lib/db";
import { IncomeEntry, MonthlyIncomeSummary } from "@/types/income";
import {
  FEDERAL_DEFAULT,
  incomeThreshold,
  type PolicyProfile,
} from "@/lib/policy";
import {
  getDocumentsByIncomeEntry,
  deleteIncomeDocument,
} from "@/lib/storage/incomeDocuments";

/**
 * Save a new income entry
 */
export async function saveIncomeEntry(
  entry: Omit<IncomeEntry, "id" | "createdAt" | "updatedAt">,
): Promise<number> {
  const id = await db.incomeEntries.add({
    ...entry,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return id;
}

/**
 * Update an existing income entry
 */
export async function updateIncomeEntry(
  id: number,
  entry: Partial<Omit<IncomeEntry, "id" | "createdAt" | "updatedAt">>,
): Promise<void> {
  await db.incomeEntries.update(id, {
    ...entry,
    updatedAt: new Date(),
  });
}

/**
 * Delete an income entry together with its documents and their image blobs.
 *
 * Added by W0 § 0.3.2. `deleteIncomeEntry` was a bare row delete, so pay stubs and
 * their blobs stayed in IndexedDB with a dangling `incomeEntryId` and nothing ever
 * reclaimed them — there is no income counterpart to `cleanupOrphanedDocuments`,
 * and blobs are the largest rows in the database.
 *
 * `.kiro/steering/data-migration-standards.md`: deletes cascade explicitly, and
 * orphaned blobs are invisible and unbounded.
 *
 * Mirrors `deleteActivityWithDocuments` in `./activities.ts`, including its
 * ordering contract: **documents first, entry last, and the entry is not deleted
 * if any document failed.** A user left with a visible error can retry; a user
 * left with orphaned pay stubs and no entry to reach them from cannot.
 *
 * The symmetry is exact: there is no narrow `deleteIncomeEntry` export, just as
 * there is no narrow `deleteActivity`. The bare row delete is internal to the
 * cascade. An exported narrow delete would be a trap — it takes the same argument,
 * reads as the obvious choice, and silently orphans blobs that nothing reclaims.
 * That export existed until W0 § 0.3.2 and was the bug.
 *
 * Not wrapped in a Dexie transaction, matching the activity path. Doing so would
 * be an improvement, but it is a behaviour change to the activity side as well and
 * belongs with the transactional-write work in § 0.6 rather than here.
 *
 * @param incomeEntryId - The entry to remove.
 * @throws If any attached document could not be deleted. The message names how
 *   many failed, so the UI can say something specific.
 */
export async function deleteIncomeEntryWithDocuments(
  incomeEntryId: number,
): Promise<void> {
  try {
    const documents = await getDocumentsByIncomeEntry(incomeEntryId);

    const failedDeletions: number[] = [];

    // Each deleteIncomeDocument removes the blob and then the metadata row.
    for (const doc of documents) {
      if (doc.id) {
        try {
          await deleteIncomeDocument(doc.id);
        } catch (docError) {
          console.error(
            `Failed to delete income document ${doc.id}:`,
            docError,
          );
          failedDeletions.push(doc.id);
        }
      }
    }

    if (failedDeletions.length > 0) {
      throw new Error(
        `Failed to delete ${failedDeletions.length} document(s). Income entry not deleted.`,
      );
    }

    await db.incomeEntries.delete(incomeEntryId);
  } catch (error) {
    console.error("Error deleting income entry with documents:", error);
    throw error;
  }
}

/**
 * Get income entry by ID
 */
export async function getIncomeEntryById(
  id: number,
): Promise<IncomeEntry | undefined> {
  return db.incomeEntries.get(id);
}

/**
 * Get all income entries for a specific month
 */
export async function getIncomeEntriesByMonth(
  userId: string,
  month: string, // YYYY-MM
): Promise<IncomeEntry[]> {
  return db.incomeEntries
    .where("date")
    .between(`${month}-01`, `${month}-31`, true, true)
    .and((entry) => entry.userId === userId)
    .toArray();
}

/**
 * All income entries across the seasonal averaging window — the 6 months PRECEDING the
 * assessed month, which it EXCLUDES (42 CFR 435.552(g); corrected in W7a, gap 5.8).
 *
 * No production caller as of W7a: the dashboard entry list moved to the SELECTED month
 * (`getIncomeEntriesByMonth`) so it follows W5's month scoping, since this window now
 * excludes the assessed month. Retained — tested, and the natural source for W7b's
 * per-month review-period income roll-up.
 */
export async function getIncomeEntriesForLast6Months(
  userId: string,
  currentMonth: string, // YYYY-MM
): Promise<IncomeEntry[]> {
  const months = getLast6Months(currentMonth);
  const firstMonth = months[0];
  const lastMonth = months[months.length - 1];

  return db.incomeEntries
    .where("date")
    .between(`${firstMonth}-01`, `${lastMonth}-31`, true, true)
    .and((entry) => entry.userId === userId)
    .toArray();
}

/**
 * Seasonal average over the 6 months PRECEDING the assessed month — 42 CFR 435.552(g),
 * 91 FR 33470.
 *
 * W7a corrected two defects here (gaps 5.8, 5.9):
 *   - the window now EXCLUDES the assessed month (see `getLast6Months`); CMS's example
 *     averages the six months before the month being assessed;
 *   - a month total is the sum of ACTUAL amounts received, not of per-paycheck monthly
 *     projections (gap 5.5), and the divisor is the number of months that actually hold
 *     records, not a hardcoded 6. HourKeep holds only what the user typed, so a month with
 *     no entries is "no record" (`hasData: false`), NOT a verified $0 — imputing $0 for
 *     missing months is what produced the 6x understatement.
 *
 * The reasonably-predictable-changes alternative (42 CFR 435.603(h)(3)) is a state election
 * surfaced in copy, not computed here.
 */
export async function calculateSeasonalAverage(
  userId: string,
  currentMonth: string,
  policy: PolicyProfile = FEDERAL_DEFAULT,
): Promise<{
  average: number;
  monthsWithData: number;
  history: Array<{ month: string; total: number; hasData: boolean }>;
}> {
  // Window length from the profile, not a literal (ADR-0001; semantic review finding 8).
  // The statutory fallback is 6 (42 CFR 435.552(g)); a state electing the
  // reasonably-predictable-changes method (435.603(h)(3)) uses a different span, which is
  // surfaced in copy. `seasonalMethod` is a discriminated union — both arms carry a span.
  const windowMonths =
    policy.seasonalMethod.kind === "preceding-average"
      ? policy.seasonalMethod.months
      : policy.seasonalMethod.windowMonths;
  const months = getLast6Months(currentMonth, windowMonths);
  const history: Array<{ month: string; total: number; hasData: boolean }> = [];
  let totalIncome = 0;
  let monthsWithData = 0;

  for (const month of months) {
    const entries = await getIncomeEntriesByMonth(userId, month);
    // Actual amounts received, not monthlyEquivalent projections (gap 5.5).
    const monthTotal = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const hasData = entries.length > 0;
    history.push({ month, total: monthTotal, hasData });
    totalIncome += monthTotal;
    if (hasData) monthsWithData += 1;
  }

  // 42 CFR 435.552(g): the divisor is the WINDOW LENGTH (the preceding months in the
  // window), not the number of months that happen to hold records. CMS's worked example
  // divides $3,000 by 6 (= $500) even though only two months held income — the off-season
  // months are genuine $0 months in the average. rule-extract.md § 2.7.
  //
  // The gap-5.9 defect was NOT the divisor — it was presenting unrecorded months as
  // verified $0 rows. HourKeep cannot tell "the user earned $0" from "the user hasn't
  // entered this month", so a thin history produces a low average that may understate a
  // user who simply has not finished logging. The fix is honesty, not a different divisor:
  // `monthsWithData` and each row's `hasData` let the UI mark blanks as "No record" and warn
  // that they count as $0 until filled in, so the figure is the state's method AND the user
  // is told how to make it right. Empty window → 0, never NaN.
  const average = months.length > 0 ? totalIncome / months.length : 0;

  return { average, monthsWithData, history };
}

/**
 * The 6 months PRECEDING the assessed month, EXCLUSIVE of it — 42 CFR 435.552(g).
 *
 * W7a fixed the off-by-one (gap 5.8). The old version returned the assessed month plus five
 * prior (e.g. July → Feb..Jul), which both included the assessed month the rule excludes and
 * dropped the sixth preceding month. For an assessed month of July the window is now
 * January through June.
 *
 * `new Date(year, month - 1 - i, 1)` relies on JS Date normalising a negative month index
 * into the previous year, which is the one piece of date arithmetic here and is covered by a
 * cross-year test.
 */
function getLast6Months(currentMonth: string, windowMonths = 6): string[] {
  const months: string[] = [];
  const [year, month] = currentMonth.split("-").map(Number);

  // i from windowMonths down to 1 → the preceding months before the assessed month,
  // oldest first. The default of 6 is the statutory fallback window (42 CFR 435.552(g)).
  for (let i = windowMonths; i >= 1; i--) {
    const date = new Date(year, month - 1 - i, 1);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    months.push(`${y}-${m}`);
  }

  return months;
}

/**
 * Calculate monthly income summary with compliance status
 *
 * W2b: the threshold comes from the injected profile (ADR-0001), replacing an import of
 * `INCOME_THRESHOLD` fixed to the federal default. 42 CFR 435.552(a)(6), 91 FR 33470 — the
 * FLSA wage under 29 U.S.C. 206(a)(1)(C) multiplied by the monthly hours figure.
 *
 * W7a corrected the two defects this used to carry:
 *   - gap 5.5: `totalIncome` now sums the ACTUAL `amount` received each month, not the
 *     per-paycheck `monthlyEquivalent` projection — four weekly paychecks are the real
 *     monthly gross, not four times it.
 *   - gap 5.8: seasonal averaging now excludes the assessed month (see
 *     `calculateSeasonalAverage` / `getLast6Months`).
 */
export async function getMonthlyIncomeSummary(
  userId: string,
  month: string,
  policy: PolicyProfile = FEDERAL_DEFAULT,
): Promise<MonthlyIncomeSummary> {
  const threshold = incomeThreshold(policy);
  const entries = await getIncomeEntriesByMonth(userId, month);

  // 42 CFR 435.552(f)(2): the month's MAGI-based income is the actual amount received, not
  // a sum of whole-month projections of each paycheck's pay period (gap 5.5).
  const totalIncome = entries.reduce((sum, entry) => sum + entry.amount, 0);

  // Income breakdown by source, by actual amount received (the third summing site; gap 5.5).
  const incomeBySource = entries.reduce(
    (acc, entry) => {
      const source = entry.source || "Unspecified";
      const existing = acc.find((item) => item.source === source);
      if (existing) {
        existing.amount += entry.amount;
      } else {
        acc.push({ source, amount: entry.amount });
      }
      return acc;
    },
    [] as Array<{ source: string; amount: number }>,
  );

  // Check user-level seasonal worker status for this month
  const isSeasonalWorker = await getSeasonalWorkerStatus(userId, month);

  let seasonalData;
  if (isSeasonalWorker) {
    seasonalData = await calculateSeasonalAverage(userId, month, policy);
  }

  const effectiveIncome = isSeasonalWorker
    ? seasonalData!.average
    : totalIncome;

  return {
    month,
    totalIncome,
    entryCount: entries.length,
    isCompliant: effectiveIncome >= threshold,
    amountNeeded: Math.max(0, threshold - effectiveIncome),
    isSeasonalWorker,
    seasonalAverage: seasonalData?.average,
    seasonalHistory: seasonalData?.history,
    seasonalMonthsWithData: seasonalData?.monthsWithData,
    incomeBySource,
  };
}

/**
 * Set compliance mode for a specific month
 */
export async function setComplianceMode(
  userId: string,
  month: string,
  mode: "hours" | "income",
): Promise<void> {
  const existing = await db.complianceModes.where({ userId, month }).first();

  if (existing) {
    await db.complianceModes.update(existing.id!, {
      mode,
      updatedAt: new Date(),
    });
  } else {
    await db.complianceModes.add({
      userId,
      month,
      mode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

/**
 * Get compliance mode for a specific month
 * Defaults to "hours" if not set
 */
export async function getComplianceMode(
  userId: string,
  month: string,
): Promise<"hours" | "income"> {
  const mode = await db.complianceModes.where({ userId, month }).first();

  return mode?.mode || "hours"; // Default to hours
}

/**
 * The stored compliance mode for a month, or `undefined` if the user has never
 * chosen one for that month.
 *
 * Added by W5. `getComplianceMode` collapses "no preference" into "hours", which is
 * a sensible default for a single fixed month and a defect once the page follows a
 * SELECTED month: a user tracking income in July who pages back to a June they have
 * never opened would have the whole surface flip to hours tracking, silently, with
 * their income entries apparently gone. The caller needs to tell the two apart so it
 * can leave the view as the user left it.
 *
 * Added alongside `getComplianceMode` rather than replacing it, because
 * `.kiro/steering/data-migration-standards.md` is explicit that `complianceMode`
 * must not be tidied before W7b. Both disappear together when ADR-0004's unified
 * compliance view removes the hours/income fork.
 */
export async function getStoredComplianceMode(
  userId: string,
  month: string,
): Promise<"hours" | "income" | undefined> {
  const mode = await db.complianceModes.where({ userId, month }).first();

  return mode?.mode;
}

/**
 * Set seasonal worker status for a specific user and month
 */
export async function setSeasonalWorkerStatus(
  userId: string,
  month: string,
  isSeasonalWorker: boolean,
): Promise<void> {
  const existing = await db.seasonalWorkerStatus
    .where({ userId, month })
    .first();

  if (existing) {
    await db.seasonalWorkerStatus.update(existing.id!, {
      isSeasonalWorker,
      updatedAt: new Date(),
    });
  } else {
    await db.seasonalWorkerStatus.add({
      userId,
      month,
      isSeasonalWorker,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

/**
 * Get seasonal worker status for a specific user and month
 * Defaults to false if not set
 */
export async function getSeasonalWorkerStatus(
  userId: string,
  month: string,
): Promise<boolean> {
  const status = await db.seasonalWorkerStatus.where({ userId, month }).first();

  return status?.isSeasonalWorker || false;
}
