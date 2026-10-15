import { format } from "date-fns";

import type { Activity, UserProfile } from "@/types";
import type { ComplianceMode, IncomeEntry } from "@/types/income";
import type { MonthEvaluation } from "@/lib/evaluateMonth";
import { ACTIVITY_TYPE_LABELS } from "@/lib/activityDisplay";

/**
 * Builds the human-readable evidence report a user hands to their agency.
 *
 * WHY THIS MODULE EXISTS
 * This logic lived inside a `handleExport` closure in app/export/page.tsx, which
 * read Dexie directly and passed the string straight to a download. Nothing
 * rendered it and nothing exported it, so wave-2 § 2.5's acceptance criterion —
 * "the export prints Logged / Threshold / Difference" — named no observable.
 * An acceptance criterion has to name something you can run, read, or see
 * (.kiro/steering/engineering-standards.md).
 *
 * The extraction is an authorized exception to W2a's "copy and content only"
 * scope, recorded in docs/hr1-readiness/waves/wave-2a-truth-in-copy.md § 2.5
 * [F5]. ADR-0006 makes the evidence package the product's output target and W8a
 * rewrites this as print-ready HTML, so a pure builder is work that wave needs
 * regardless. No Dexie, no React, no DOM.
 *
 * WHAT CHANGED IN THE OUTPUT — all five, itemised
 * An earlier version of this header claimed "no behaviour change beyond the § 2.5
 * string replacement". That was over-claimed, and a future reader deciding whether
 * this can be diffed against the old behaviour would have been misled. The data
 * read, the filtering, the ordering, the mode lookup, and every edge case ARE
 * byte-identical — verified by diffing both implementations across 13 fixtures in
 * two timezones. These five strings differ:
 *
 *   1. `✓ COMPLIANT` / `✗ NOT COMPLIANT` -> `Logged / Threshold / Difference`.
 *      HourKeep does not determine compliance: 42 CFR 435.556 makes it the state's
 *      question, 435.557(a)-(b) requires it to exhaust its own records first, and
 *      the determination is appealable under 431.220(a)(1). ADR-0003.
 *   2. `HOURKEEP COMPLIANCE REPORT` -> `HOURKEEP ACTIVITY RECORD`. The old title
 *      framed the artifact as a compliance finding.
 *   3. `Compliance Mode: Hours Tracking` -> `Recorded as: Hours`. Same reason.
 *   4. A four-line not-a-determination preamble, with citations, added at the top.
 *   5. A two-line household-income note added to the income block — see below.
 *
 * Plus one bug fix, not a string change: the month heading parsed as UTC and so
 * printed the PREVIOUS month in any negative-offset timezone. See below.
 *
 * POLICY LITERALS
 * `80` and `580` are passed in as `thresholds` rather than hardcoded, so W2b can
 * hand them straight from the policy profile without touching this file.
 * The caller still holds literals — recorded in the W2a handoff table.
 */

export interface ReportThresholds {
  /** Monthly hours threshold. 42 CFR 435.552(a)(1)-(a)(5). */
  hours: number;
  /** Monthly income threshold: federal minimum wage x hours. 42 CFR 435.552(f). */
  income: number;
}

/**
 * The per-activity line detail for the agency-facing record — W6a.
 *
 * The caseworker reads this artifact, so the structured evidence W6a captures must appear
 * here or it is lost (convergence review finding 7). In particular a half-time education row
 * stores 0 hours, and printing "0 hours" with no context would misrepresent it — so
 * enrollment status is named instead of an hours figure.
 */
function renderActivityDetail(activity: Activity): string {
  const parts: string[] = [];

  if (activity.type === "education") {
    // 42 CFR 435.552(c): enrollment status is the meaningful fact, not an hours total.
    switch (activity.enrollmentStatus) {
      case "at-least-half-time":
        parts.push("enrolled at least half-time (counts on its own)");
        break;
      case "less-than-half-time":
        if (activity.creditHours !== undefined) {
          parts.push(
            `${activity.creditHours} credit hours (less than half-time)`,
          );
        } else if (activity.nonCreditHours !== undefined) {
          parts.push(
            `${activity.nonCreditHours} class/activity hours (less than half-time)`,
          );
        } else {
          parts.push("less than half-time");
        }
        break;
      case "unknown":
        parts.push("enrollment status to confirm with the school");
        break;
      default:
        parts.push(`${activity.hours} hours`);
    }
    if (activity.educationProgramType) {
      parts.push(activity.educationProgramType.replace(/-/g, " "));
    }
  } else {
    parts.push(`${activity.hours} hours`);
    if (activity.type === "work" && activity.workKind) {
      parts.push(`${activity.workKind} work`);
    }
  }

  if (activity.type === "volunteer" && activity.communityService) {
    const cs = activity.communityService;
    if (cs.organizationName) parts.push(cs.organizationName);
    if (cs.organizationAddress) parts.push(cs.organizationAddress);
    if (cs.activityDescription) parts.push(cs.activityDescription);
    if (cs.courtOrdered) parts.push("court-ordered");
    const contact = [
      cs.pointOfContactName,
      cs.pointOfContactPhone,
      cs.pointOfContactEmail,
    ]
      .filter(Boolean)
      .join(", ");
    if (contact) parts.push(`contact who can confirm hours: ${contact}`);
  } else if (activity.organization) {
    parts.push(activity.organization);
  }

  return parts.length > 0 ? ` - ${parts.join(" - ")}` : "";
}

export interface TextReportInput {
  profile?: UserProfile;
  activities: Activity[];
  incomeEntries: IncomeEntry[];
  complianceModes: ComplianceMode[];
  thresholds: ReportThresholds;
  /**
   * Per-month computed facts from the single evaluation path (`evaluateMonth`) — W8a.
   *
   * Keyed by `YYYY-MM`. When a month's evaluation is present the report reads its hours
   * total, its income total, and its seasonal average from here INSTEAD of recomputing —
   * which is what makes the artifact unable to contradict the UI (gap 8.9, ADR-0006 § One
   * evaluation path). The per-activity and per-entry DETAIL lines still iterate the raw
   * records; that is rendering, not a compliance computation.
   *
   * Optional, and the builder falls back to its own sums when a month is absent, for two
   * reasons: `buildTextReport` stays a pure synchronous function (the caller does the async
   * `evaluateMonth` work and passes the result in), and the fallback keeps the function
   * usable and tested in isolation. The export page always supplies evaluations, so the
   * fallback is not the shipped path.
   */
  evaluations?: Record<string, MonthEvaluation>;
  /** Injected so output is deterministic under test. */
  generatedAt?: Date;
}

const RULE = "=".repeat(50);
const SUBRULE = "-".repeat(50);

/** `YYYY-MM` for a date string, without constructing a Date. */
function monthKey(isoDate: string): string {
  return isoDate.substring(0, 7);
}

/**
 * Format an hours figure: whole numbers print cleanly ("46"), fractional ones keep two
 * decimals ("77.94"). The credit-hour conversion (42 CFR 435.552(d), 91 FR 33471) produces
 * fractional monthly hours, so a bare integer cast would misrepresent them.
 */
function formatHours(hours: number): string {
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(2);
}

/**
 * Renders one "Logged / Threshold / Difference" line.
 *
 * Difference is clamped at zero: a surplus is not a deficit, and a negative
 * "difference" reads as a penalty. ADR-0003 keeps `hoursNeeded` as neutral
 * arithmetic, and this is the same figure.
 */
function comparisonLine(
  label: string,
  logged: string,
  threshold: string,
  difference: string,
): string {
  return `${label}\n  Logged: ${logged}\n  Threshold: ${threshold}\n  Difference: ${difference}\n`;
}

export function buildTextReport(input: TextReportInput): string {
  const {
    profile,
    activities,
    incomeEntries,
    complianceModes,
    thresholds,
    evaluations,
    generatedAt = new Date(),
  } = input;

  let out = "HOURKEEP ACTIVITY RECORD\n";
  out += RULE + "\n\n";

  if (profile) {
    out += `Name: ${profile.name}\n`;
    out += `State: ${profile.state}\n`;
    out += `Report Date: ${format(generatedAt, "MMMM d, yyyy")}\n\n`;
  }

  // Said once, at the top, so no month block has to hedge individually.
  out += "This is a record of what you logged. It is not a determination.\n";
  out += "Your state decides whether the requirement is met, and it must\n";
  out += "check its own records before asking you for anything.\n";
  out += "42 CFR 435.552, 435.556, 435.557(a)-(b)\n\n";
  out += RULE + "\n\n";

  const allMonths = new Set<string>();
  activities.forEach((a) => allMonths.add(monthKey(a.date)));
  incomeEntries.forEach((i) => allMonths.add(monthKey(i.date)));

  const sortedMonths = Array.from(allMonths).sort().reverse();

  sortedMonths.forEach((month) => {
    const modeRecord = complianceModes.find(
      (m) => m.month === month && m.userId === profile?.id,
    );
    const mode = modeRecord?.mode || "hours";

    // `new Date("2026-07-01")` is parsed as UTC midnight, so in any negative-offset
    // timezone it lands on June 30 local and this heading printed the WRONG MONTH.
    // Pre-existing defect carried over from the inline version, caught by the test
    // this extraction made possible. The explicit time makes it local midnight,
    // matching how per-entry dates are already handled a few lines below.
    // .kiro/steering/data-migration-standards.md names this exact bug class.
    out += `${format(new Date(month + "-01T00:00:00"), "MMMM yyyy")}\n`;
    out += SUBRULE + "\n";
    out += `Recorded as: ${mode === "hours" ? "Hours" : "Income"}\n\n`;

    const evaluation = evaluations?.[month];

    if (mode === "hours") {
      const monthActivities = activities.filter(
        (a) => monthKey(a.date) === month,
      );
      // W8a (gap 8.9): read the total from the single evaluation path when present, so the
      // artifact cannot contradict the UI. `calculateMonthlySummary` derives education's
      // contribution (the half-time cliff and credit-hour conversion), which a naive sum of
      // stored `hours` would get wrong. Fall back to the raw sum only when no evaluation was
      // supplied — never the shipped path (the export page always evaluates).
      const totalHours =
        evaluation?.hours.totalHours ??
        monthActivities.reduce((sum, a) => sum + a.hours, 0);
      const difference = Math.max(0, thresholds.hours - totalHours);

      out += comparisonLine(
        "Hours",
        `${formatHours(totalHours)} hours`,
        `${formatHours(thresholds.hours)} hours`,
        `${formatHours(difference)} hours`,
      );
      out += "\n";

      if (monthActivities.length > 0) {
        [...monthActivities]
          .sort((a, b) => a.date.localeCompare(b.date))
          .forEach((activity) => {
            out += `  ${format(new Date(activity.date + "T00:00:00"), "MMM d, yyyy")} - `;
            // W6a: shared label so `workProgram` reads "Job Training", not "WorkProgram".
            // The capitalize-first-char trick produced the raw union value for the new type.
            out += `${ACTIVITY_TYPE_LABELS[activity.type]}`;
            out += renderActivityDetail(activity);
            out += "\n";
          });
      } else {
        out += "  No activities recorded\n";
      }
    } else {
      const monthIncomeEntries = incomeEntries.filter(
        (i) => monthKey(i.date) === month,
      );
      // W7a (gap 5.5): the month's income is the sum of ACTUAL amounts received, not of
      // per-paycheck monthly projections. Summing monthlyEquivalent here 4x-overstated the
      // figure onto the artifact a caseworker reads — worse than on screen.
      // W8a: read the total from the single evaluation path when present (fallback is the
      // same actual-amounts sum, so a month without an evaluation is still correct).
      const totalIncome =
        evaluation?.income.totalIncome ??
        monthIncomeEntries.reduce((sum, i) => sum + i.amount, 0);

      // W8a (gap 8.9 / W7a finding 6): for a seasonal worker the figure COMPARED against the
      // threshold is 42 CFR 435.552(g)'s average over the 6 months PRECEDING the assessed
      // month — not the assessed month's own total. The export previously never received
      // seasonal status, so it printed the wrong comparison. The seasonal average is only
      // available from the evaluation (it needs a DB read); without one, fall back to the
      // month total, matching the pre-W8a non-seasonal behaviour.
      const isSeasonal = evaluation?.income.isSeasonalWorker ?? false;
      const seasonalAverage = evaluation?.income.seasonalAverage;
      const comparedIncome =
        isSeasonal && seasonalAverage !== undefined
          ? seasonalAverage
          : totalIncome;
      const difference = Math.max(0, thresholds.income - comparedIncome);

      out += comparisonLine(
        isSeasonal ? "Income (seasonal 6-month average)" : "Income",
        `$${comparedIncome.toFixed(2)}`,
        `$${thresholds.income.toFixed(2)}`,
        `$${difference.toFixed(2)}`,
      );

      if (isSeasonal && seasonalAverage !== undefined) {
        // 42 CFR 435.552(g), 91 FR 33470: the seasonal comparison is the average of the six
        // months before the month under review, not this month's pay. Name the span and the
        // citation on the artifact so a caseworker reads the right figure, and distinguish a
        // month with no record from a verified $0 (W7a honesty — never impute $0).
        out +=
          "  This is the average of the 6 months before the month under review\n";
        out += "  (seasonal workers). 42 CFR 435.552(g)\n";
        const history = evaluation?.income.seasonalHistory ?? [];
        history.forEach((h) => {
          const label = format(new Date(h.month + "-01T00:00:00"), "MMM yyyy");
          out += h.hasData
            ? `    ${label}: $${h.total.toFixed(2)}\n`
            : `    ${label}: No record (counts as $0 until added)\n`;
        });
        out += "\n";
      }
      // 42 CFR 435.552(f)(2) -> 435.603(d)-(f): the threshold is measured against
      // MAGI-based income for the MAGI-based HOUSEHOLD, not the individual. This
      // figure is one person's records, so the state's number may be higher.
      // Saying so prevents the report reading as a shortfall it may not be.
      out +=
        "  Note: your state counts your whole tax household here, so its\n";
      out += "  figure may be higher than this one. 42 CFR 435.603(d)-(f)\n";
      out += "\n";

      if (monthIncomeEntries.length > 0) {
        [...monthIncomeEntries]
          .sort((a, b) => a.date.localeCompare(b.date))
          .forEach((entry) => {
            // W7a: the actual amount received on the payday, which is what the month
            // total sums. The pay-period monthly projection is a personal estimate, not a
            // compliance figure (gap 5.4), so it is not shown on the agency artifact.
            out += `  ${format(new Date(entry.date + "T00:00:00"), "MMM d, yyyy")} - `;
            out += `$${entry.amount.toFixed(2)} received (${entry.payPeriod})`;
            if (entry.source) {
              out += ` - ${entry.source}`;
            }
            out += "\n";
          });
      } else {
        out += "  No income entries recorded\n";
      }
    }

    out += "\n";
  });

  if (activities.length === 0 && incomeEntries.length === 0) {
    out += "No activities or income entries recorded yet.\n";
  }

  return out;
}
