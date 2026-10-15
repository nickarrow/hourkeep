/**
 * `workProgram` as a counted activity type — 42 CFR 435.552(a)(3), 91 FR 33470.
 *
 * W6a. The combined wave file called this "a type-union change plus a form option"; the
 * dangerous half is here, in `calculateMonthlySummary`. Its `switch` had no `default`, so
 * before W6a a `workProgram` row contributed to no bucket and no total — pinned as current
 * behaviour in `calculations.characterization.test.ts`. This file asserts the corrected
 * behaviour: work-program hours are summed, in their own bucket and in the total.
 *
 * § 435.552(a)(3): "The individual participates in a work program for not less than 80
 * hours." Work-program hours combine with work, community service, and less-than-half-time
 * education under § 435.552(e). Tier-1 arithmetic, so this is written before the change.
 */

import { describe, it, expect } from "vitest";
import { calculateMonthlySummary } from "@/lib/calculations";
import type { Activity } from "@/types";

function activity(
  date: string,
  type: Activity["type"],
  hours: number,
): Activity {
  return {
    date,
    type,
    hours,
    createdAt: new Date("2026-01-01T00:00:00"),
    updatedAt: new Date("2026-01-01T00:00:00"),
  };
}

describe("calculateMonthlySummary: workProgram is a counted type", () => {
  it("§ 435.552(a)(3): work-program hours land in their own bucket", () => {
    const summary = calculateMonthlySummary(
      [
        activity("2026-07-01", "workProgram", 30),
        activity("2026-07-02", "workProgram", 10),
      ],
      "2026-07",
    );
    expect(summary.workProgramHours).toBe(40);
  });

  it("§ 435.552(e): work-program hours combine with work into the total", () => {
    // The inverse of the characterization test's rogue-type case: 40 workProgram + 10
    // work used to total 10 (workProgram silently dropped). Now it totals 50.
    const summary = calculateMonthlySummary(
      [
        activity("2026-07-01", "workProgram", 40),
        activity("2026-07-02", "work", 10),
      ],
      "2026-07",
    );
    expect(summary.totalHours).toBe(50);
    expect(summary.workProgramHours).toBe(40);
    expect(summary.workHours).toBe(10);
  });

  it("§ 435.552(e): all four combinable types reach the threshold together", () => {
    // 20 of each of the four combinable activity types = 80. 42 CFR 435.552(a)(5) and
    // (e): the 80 is a monthly total across activities.
    const summary = calculateMonthlySummary(
      [
        activity("2026-07-01", "work", 20),
        activity("2026-07-02", "volunteer", 20),
        activity("2026-07-03", "workProgram", 20),
        activity("2026-07-04", "education", 20),
      ],
      "2026-07",
    );
    expect(summary.totalHours).toBe(80);
    expect(summary.workHours).toBe(20);
    expect(summary.volunteerHours).toBe(20);
    expect(summary.workProgramHours).toBe(20);
    expect(summary.educationHours).toBe(20);
  });

  it("a month with no work-program hours reports a zero bucket, not undefined", () => {
    // Positive twin: the bucket is always present, so the UI and export never read
    // `undefined`.
    const summary = calculateMonthlySummary(
      [activity("2026-07-01", "work", 10)],
      "2026-07",
    );
    expect(summary.workProgramHours).toBe(0);
  });
});
