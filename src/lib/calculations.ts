import { Activity, MonthlySummary } from "@/types";
import { isValidMonth } from "@/lib/month";
import { FEDERAL_DEFAULT, type PolicyProfile } from "@/lib/policy";
import { educationContribution } from "@/lib/education";

/**
 * Total a single month's logged hours.
 *
 * The `month` parameter is **required and validated**. It used to be optional,
 * falling back to `format(new Date(), "yyyy-MM")`, and `tracking/page.tsx` was the
 * caller that forgot it — so the whole tracking surface silently reported today
 * regardless of which month the user was looking at. ADR-0005 names the reason:
 * "an optional month argument hides the bug where a caller forgets to pass one and
 * silently gets today."
 *
 * That default was wrong in the direction that costs someone coverage. Every use of
 * this app is retrospective: 42 CFR 435.556(a)(1) assesses the months **preceding**
 * application, and 42 CFR 435.558 gives roughly 35 days to document months already
 * gone. The user who most needs this is looking at December, not at today.
 *
 * WHY THE FILTER IS STILL `startsWith` AND NOT `monthOfDate(date) === month`.
 * Two reasons, and both are about not trading one bug for another.
 *
 * - String comparison cannot drift across a timezone boundary. W0 pinned that as a
 *   property to preserve after W2a found a real month-boundary bug of exactly this
 *   shape in the export builder. `.kiro/steering/data-migration-standards.md` names
 *   the class.
 * - `monthOfDate` throws on a malformed date, so a single corrupt row would blow up
 *   the whole summary and hide every hour the user had logged. A prefix comparison
 *   skips the bad row and still shows the rest.
 *
 * What made `startsWith` dangerous was never the comparison — it was the
 * unvalidated needle. A bare `"2026"` used to match the entire year and return it
 * as `month`. Validating the needle closes that without giving up the immunity.
 *
 * @param activities Any activities; only those in `month` are counted.
 * @param month The calendar month to total, as `YYYY-MM`.
 * @param policy Thresholds. Optional, defaulting to the federal statutory floor.
 * @throws if `month` is not a well-formed `YYYY-MM`.
 */
export function calculateMonthlySummary(
  activities: Activity[],
  month: string,
  policy: PolicyProfile = FEDERAL_DEFAULT,
): MonthlySummary {
  if (!isValidMonth(month)) {
    throw new Error(
      `calculateMonthlySummary needs a month as YYYY-MM, got ${JSON.stringify(month)}. ` +
        `A bare year would silently total a whole year and report it as a single ` +
        `month (ADR-0005).`,
    );
  }

  // Prefix comparison against a validated YYYY-MM. See the note above.
  const monthActivities = activities.filter((activity) =>
    activity.date.startsWith(month),
  );

  // Work, community service, and work-program hours sum per 42 CFR 435.552(e)(2): each is
  // "determined separately and based on the time spent on the specific activity in such
  // month". Education is NOT summed per row — see below.
  let workHours = 0;
  let volunteerHours = 0;
  let workProgramHours = 0;
  const educationRows: Activity[] = [];

  monthActivities.forEach((activity) => {
    switch (activity.type) {
      case "work":
        workHours += activity.hours;
        break;
      case "volunteer":
        volunteerHours += activity.hours;
        break;
      case "education":
        educationRows.push(activity);
        break;
      case "workProgram":
        // 42 CFR 435.552(a)(3), 91 FR 33470. W6a: before this branch existed the switch
        // had no `default`, so a workProgram row silently contributed nothing.
        workProgramHours += activity.hours;
        break;
    }
  });

  /**
   * Education — DERIVED from source facts, not summed from a cached `hours` number.
   *
   * 42 CFR 435.552(c): enrolment is a monthly status set by the school, not a per-day
   * quantity. Summing per-row `hours` across dated education entries double-counted a
   * single month's enrolment (the multi-date save writes one row per date), and caching the
   * converted figure meant a changed policy conversion could not recompute old rows. Both
   * were flagged in the W6a convergence review.
   *
   * So: take the single strongest education status for the month and derive its
   * contribution via `educationContribution` (which owns the half-time cliff).
   *   - any at-least-half-time row  → standalone demonstration, 0 combinable hours (a)(4),(e)(1)
   *   - else the largest less-than-half-time contribution → combinable hours (d),(e)
   *   - a legacy row (hours, no status) → its hours count as-is (pre-W6a behaviour preserved)
   */
  let educationHours = 0;
  let hasStandaloneEducation = false;

  if (educationRows.some((a) => a.enrollmentStatus === "at-least-half-time")) {
    hasStandaloneEducation = true; // 42 CFR 435.552(a)(4): demonstrates on its own
  } else {
    for (const a of educationRows) {
      let contribution: number;
      if (a.enrollmentStatus === "less-than-half-time") {
        contribution = educationContribution(
          a.creditHours !== undefined
            ? { status: "less-than-half-time", creditHours: a.creditHours }
            : {
                status: "less-than-half-time",
                nonCreditHours: a.nonCreditHours ?? a.hours,
              },
          policy,
        ).combinableHours;
      } else if (a.enrollmentStatus === "unknown") {
        contribution = 0; // 42 CFR 435.552(c): the school decides; we do not infer
      } else {
        // Legacy row with no status: its stored hours count as-is. Not inferred as
        // half-time (would overstate) and not discarded (would be a false shortfall).
        contribution = a.hours;
      }
      // Monthly fact: the strongest enrolment, not a sum across dated rows.
      educationHours = Math.max(educationHours, contribution);
    }
  }

  // Calculate total hours — the four combinable pathways, 42 CFR 435.552(e).
  const totalHours =
    workHours + volunteerHours + educationHours + workProgramHours;

  /**
   * The monthly hours threshold — 42 CFR 435.552(a)(1)-(3), (5), 91 FR 33470: the
   * individual "works not less than 80 hours", with the same figure governing community
   * service, work programs, and any combination.
   *
   * From the profile, not a literal (ADR-0001). W2b: the `80` used to be written twice on
   * the two lines below.
   */
  const threshold = policy.requiredHours;

  // "Not less than", so the boundary is inside.
  const isCompliant = totalHours >= threshold;

  /**
   * The shortfall. Neutral arithmetic, not a verdict — `compliance-copy-standards.md`
   * keeps `hoursNeeded` on exactly that ground: "a difference is not a verdict".
   *
   * Floored at 0 rather than left as `isCompliant ? 0 : …`. Same result, but the
   * expression no longer depends on the boolean above, which W7b removes.
   */
  const hoursNeeded = Math.max(threshold - totalHours, 0);

  return {
    month,
    totalHours,
    workHours,
    volunteerHours,
    educationHours,
    workProgramHours,
    hasStandaloneEducation,
    isCompliant,
    hoursNeeded,
  };
}
