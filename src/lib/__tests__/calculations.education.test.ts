/**
 * How `calculateMonthlySummary` handles education — the half-time cliff, derived at read
 * time. 42 CFR 435.552(a)(4), (c), (d), (e), 91 FR 33470-33471.
 *
 * W6a convergence. The semantic review (NEEDS_CHANGES) caught that storing a cliff-resolved
 * `hours` number on the activity row and summing it blindly produced two harms:
 *
 *   - a half-time student (stored as hours: 0) read as "80 hours needed" on the dashboard —
 *     a false SHORTFALL, the exact harm ADR-0003 § Context names; and
 *   - a cached converted figure could not be recomputed if the policy conversion changed,
 *     and the multi-date save loop multiplied it across dates.
 *
 * The fix: derive education's contribution from the SOURCE facts stored on the row
 * (`enrollmentStatus`, `creditHours`, `nonCreditHours`) via `educationContribution`, and
 * expose a standalone-half-time SIGNAL on the summary so the dashboard can say "this may be
 * enough on its own" rather than showing zero progress. These tests pin that.
 *
 * Legacy rows: an education row with hours and NO `enrollmentStatus` is treated as a bare
 * hours contribution (its hours count), which preserves the pre-W6a behaviour for data
 * created before W6a — never inferred as half-time (would overstate) or discarded.
 */

import { describe, it, expect } from "vitest";
import { calculateMonthlySummary } from "@/lib/calculations";
import type { Activity } from "@/types";

function edu(date: string, over: Partial<Activity> = {}): Activity {
  return {
    date,
    type: "education",
    hours: 0,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...over,
  };
}

describe("calculateMonthlySummary: education is derived from source facts, not a cached number", () => {
  it("§ 435.552(a)(4): at-least-half-time contributes 0 combinable hours but sets the standalone signal", () => {
    // The false-shortfall fix. A half-time row must NOT read as zero progress; the summary
    // carries hasStandaloneEducation so the dashboard can say "may be enough on its own".
    const summary = calculateMonthlySummary(
      [edu("2026-07-01", { enrollmentStatus: "at-least-half-time" })],
      "2026-07",
    );
    expect(summary.educationHours).toBe(0);
    expect(summary.hasStandaloneEducation).toBe(true);
  });

  it("§ 435.552(d): less-than-half-time is DERIVED from creditHours, not from a stored hours number", () => {
    // The row stores creditHours: 6; the summary derives 77.94 even if a stale `hours`
    // value disagrees. This is what lets a changed policy conversion recompute old rows.
    const summary = calculateMonthlySummary(
      [
        edu("2026-07-01", {
          enrollmentStatus: "less-than-half-time",
          creditHours: 6,
          hours: 999, // deliberately wrong cached value; must be ignored
        }),
      ],
      "2026-07",
    );
    expect(summary.educationHours).toBe(77.94);
    expect(summary.hasStandaloneEducation).toBe(false);
  });

  it("§ 435.552(d)(2): less-than-half-time non-credit uses nonCreditHours 1:1", () => {
    const summary = calculateMonthlySummary(
      [
        edu("2026-07-01", {
          enrollmentStatus: "less-than-half-time",
          nonCreditHours: 50,
        }),
      ],
      "2026-07",
    );
    expect(summary.educationHours).toBe(50);
  });

  it("§ 435.552(c): unknown status contributes 0 and does not set the standalone signal", () => {
    const summary = calculateMonthlySummary(
      [edu("2026-07-01", { enrollmentStatus: "unknown", hours: 0 })],
      "2026-07",
    );
    expect(summary.educationHours).toBe(0);
    expect(summary.hasStandaloneEducation).toBe(false);
  });

  it("a legacy education row (hours, no status) still contributes its hours", () => {
    // Pre-W6a rows have hours and no enrollmentStatus. They must not vanish (would be a
    // false shortfall) and must not be inferred as half-time (would overstate). The hours
    // count as-is, which is exactly the pre-W6a behaviour.
    const summary = calculateMonthlySummary(
      [edu("2026-07-01", { hours: 40 })],
      "2026-07",
    );
    expect(summary.educationHours).toBe(40);
    expect(summary.hasStandaloneEducation).toBe(false);
  });

  it("does not multiply a monthly conversion across duplicate dated rows", () => {
    // The multi-date harm: two less-than-half-time rows for the same month, each with
    // 6 credits, must NOT read as 155.88. Enrollment is a monthly fact; the summary derives
    // from the HIGHEST credit load in the month rather than summing per-date rows.
    const summary = calculateMonthlySummary(
      [
        edu("2026-07-01", {
          enrollmentStatus: "less-than-half-time",
          creditHours: 6,
        }),
        edu("2026-07-15", {
          enrollmentStatus: "less-than-half-time",
          creditHours: 6,
        }),
      ],
      "2026-07",
    );
    // One month's enrollment, not two. 77.94, not 155.88.
    expect(summary.educationHours).toBe(77.94);
  });

  it("standalone half-time plus work: work counts, education does not combine, signal is set", () => {
    // 42 CFR 435.552(e)(1): half-time education cannot be combined. Work still counts on
    // its own; the education signal is informational, not added to the total.
    const summary = calculateMonthlySummary(
      [
        edu("2026-07-01", { enrollmentStatus: "at-least-half-time" }),
        {
          date: "2026-07-02",
          type: "work",
          hours: 40,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      "2026-07",
    );
    expect(summary.workHours).toBe(40);
    expect(summary.educationHours).toBe(0);
    expect(summary.totalHours).toBe(40);
    expect(summary.hasStandaloneEducation).toBe(true);
  });
});
