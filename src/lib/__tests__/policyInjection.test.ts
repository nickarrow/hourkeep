/**
 * Every compliance-critical module reads its thresholds from the profile — ADR-0001.
 *
 * W2b. Tier 1 under ADR-0007, so these were written before the change.
 *
 * WHY THIS FILE EXISTS SEPARATELY from the modules' own tests. Those pin *behaviour* at
 * today's values, which is what W0's characterization tests are for and what proves this
 * refactor changed nothing. This file pins a different property: that the values are
 * INJECTED. The two cannot be the same test, because a module with `80` written into it
 * passes every behavioural assertion at the federal default.
 *
 * THE SHAPE OF EVERY TEST HERE. Pass a profile whose threshold is not 80 or 580, and assert
 * the module's answer moves with it. A module that ignored the profile would keep returning
 * the same figure and fail. This is the same trick as `incomeThreshold`'s mutated-wage test
 * in `src/lib/policy/__tests__/policy.test.ts`, and for the same reason: asserting the
 * default value cannot distinguish a derivation from a constant.
 *
 * WHY THE PARAMETER IS OPTIONAL. ADR-0001 as amended. A required profile parameter would
 * have forced every W0 characterization test to change, and those tests are the gate proving
 * this refactor is behaviour-neutral. Changing them to make them pass would have destroyed
 * the only signal they exist to give.
 *
 * 42 CFR 435.552(a)(1)-(3), (5)-(7) at 91 FR 33470 for the hours threshold; (a)(6) for the
 * income threshold, which is the FLSA wage under 29 U.S.C. 206(a)(1)(C) multiplied by 80.
 */

import { describe, it, expect } from "vitest";

import {
  FEDERAL_DEFAULT,
  incomeThreshold,
  type PolicyProfile,
} from "@/lib/policy";
import { calculateMonthlySummary } from "@/lib/calculations";
import { calculateRecommendation } from "@/lib/assessment/recommendationEngine";
import { calculateExemption } from "@/lib/exemptions/calculator";
import type { Activity } from "@/types";
import type { AssessmentResponses } from "@/types/assessment";

/**
 * A profile with a raised wage and a lowered hours threshold.
 *
 * Neither number is realistic; both are deliberately far from 80 and 580 so an off-by-one or
 * a surviving literal cannot coincide with the expected answer. $9.00 x 40 = $360.
 */
const raised: PolicyProfile = {
  ...FEDERAL_DEFAULT,
  id: "test:raised",
  federalMinimumWage: 9,
  requiredHours: 40,
};

function activity(date: string, hours: number): Activity {
  return {
    date,
    type: "work",
    hours,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/** The minimum shape `calculateRecommendation` needs. */
function responses(
  over: Partial<AssessmentResponses> = {},
): AssessmentResponses {
  return {
    exemption: {},
    monthlyIncome: 0,
    monthlyWorkHours: 0,
    monthlyVolunteerHours: 0,
    monthlySchoolHours: 0,
    monthlyWorkProgramHours: 0,
    isSeasonalWork: false,
    ...over,
  } as AssessmentResponses;
}

describe("calculateMonthlySummary reads requiredHours from the profile", () => {
  it("42 CFR 435.552(a): the default threshold is 80 hours", () => {
    // The behaviour W0's characterization tests already pin, restated here so this file
    // reads as a pair rather than only asserting the unusual case.
    expect(
      calculateMonthlySummary([activity("2026-07-01", 79)], "2026-07")
        .hoursNeeded,
    ).toBe(1);
    expect(
      calculateMonthlySummary([activity("2026-07-01", 80)], "2026-07")
        .hoursNeeded,
    ).toBe(0);
  });

  it("42 CFR 435.552(a): hoursNeeded moves with an injected threshold", () => {
    // 40 hours logged against a 40-hour threshold leaves nothing needed. Against the
    // federal 80 it would leave 40, so a surviving literal fails here.
    const summary = calculateMonthlySummary(
      [activity("2026-07-01", 40)],
      "2026-07",
      raised,
    );

    expect(summary.totalHours).toBe(40);
    expect(summary.hoursNeeded).toBe(0);
  });

  it("the threshold comparison stays inclusive at the injected value", () => {
    // 42 CFR 435.552(a)(1) says "not less than", so the boundary is inside. Pinned at the
    // injected threshold as well as the default, because an inclusive comparison written
    // against a literal could easily become exclusive when it becomes a variable.
    expect(
      calculateMonthlySummary([activity("2026-07-01", 39)], "2026-07", raised)
        .hoursNeeded,
    ).toBe(1);
    expect(
      calculateMonthlySummary([activity("2026-07-01", 40)], "2026-07", raised)
        .hoursNeeded,
    ).toBe(0);
  });

  it("never reports negative hours needed, at any threshold", () => {
    // A difference is neutral arithmetic (ADR-0003) but a NEGATIVE difference is nonsense
    // on screen. Logging 100 against a 40-hour threshold must read 0, not -60.
    expect(
      calculateMonthlySummary([activity("2026-07-01", 100)], "2026-07", raised)
        .hoursNeeded,
    ).toBe(0);
  });
});

describe("calculateRecommendation reads both thresholds from the profile", () => {
  it("42 CFR 435.552(a)(6): the income pathway opens at the injected threshold", () => {
    // $360 = $9.00 x 40. Under the federal $580 this income would not be viable, so a
    // surviving 580 literal makes this fail.
    expect(incomeThreshold(raised)).toBe(360);

    const result = calculateRecommendation(
      responses({ monthlyIncome: 360 }),
      raised,
    );
    expect(result.primaryMethod).toBe("income-tracking");
  });

  it("42 CFR 435.552(a)(6): income below the injected threshold does not open it", () => {
    // Positive twin. A function that always reported income-tracking viable would pass the
    // assertion above.
    const result = calculateRecommendation(
      responses({ monthlyIncome: 359 }),
      raised,
    );
    expect(result.primaryMethod).not.toBe("income-tracking");
  });

  it("42 CFR 435.552(a)(1): the hours pathway opens at the injected threshold", () => {
    const result = calculateRecommendation(
      responses({ monthlyWorkHours: 40 }),
      raised,
    );
    expect(result.primaryMethod).toBe("hour-tracking");
  });

  it("interpolates the injected thresholds into the copy, not the federal ones", () => {
    /**
     * The half that a naive refactor misses. Threshold COMPARISONS are easy to spot; the
     * same numbers written into user-facing sentences are not, and `compliance-copy-standards.md`
     * requires them interpolated "so `$580` updates with the minimum wage".
     *
     * Asserting the absence of "580" and "80 hours" is a negative, so both halves are
     * checked: the injected figures must be present AND the federal ones absent.
     */
    const result = calculateRecommendation(
      responses({ monthlyWorkHours: 10, monthlyIncome: 100 }),
      raised,
    );

    expect(result.reasoning).toContain("40 hours");
    expect(result.reasoning).toContain("$360");
    expect(result.reasoning).not.toContain("80 hours");
    expect(result.reasoning).not.toContain("$580");
  });

  it("42 CFR 435.552(a)(7): the seasonal window comes from seasonalMethod, not a literal", () => {
    // The 6-month figure is `seasonalMethod.months` on the profile. A state electing the
    // 435.603(h)(3) proration gets a different window, and the copy must not promise six.
    const result = calculateRecommendation(
      responses({ monthlyIncome: 400, isSeasonalWork: true }),
      raised,
    );

    expect(result.reasoning).toContain("6 months");
  });

  it("defaults to the federal profile when none is passed", () => {
    // The optional-parameter contract. Every existing caller relies on it, and so do W0's
    // characterization tests.
    const result = calculateRecommendation(responses({ monthlyIncome: 600 }));
    expect(result.primaryMethod).toBe("income-tracking");
    expect(result.reasoning).toContain("$580");
  });
});

describe("calculateExemption reads thresholds from the profile", () => {
  it("interpolates the injected thresholds into the not-matched guidance", () => {
    // `calculator.ts` line 307 states both thresholds in the sentence a user sees when
    // screening matched nothing — which is the most-read string in the module.
    const result = calculateExemption({}, raised);

    expect(result.nextSteps).toContain("40 hours");
    expect(result.nextSteps).toContain("$360");
    expect(result.nextSteps).not.toContain("80 hours");
    expect(result.nextSteps).not.toContain("$580");
  });

  it("interpolates into the medically-frail explanation too", () => {
    // Line 213. 42 CFR 435.554(c)(5)'s functional gate is stated in terms of the hours
    // threshold — "whether it genuinely gets in the way of ... 80 hours a month" — so the
    // number has to move with the profile or the gate is described against the wrong bar.
    const result = calculateExemption({ isMedicallyFrail: true }, raised);

    expect(result.explanation).toContain("40 hours");
    expect(result.explanation).not.toContain("80 hours");
  });

  it("defaults to the federal profile when none is passed", () => {
    expect(calculateExemption({}).nextSteps).toContain("$580");
  });
});

describe("no policy literal survives in the Tier-1 modules", () => {
  /**
   * The direct form of ADR-0001's rule, asserted rather than left to the shell gate.
   *
   * `scripts/compliance-gate.sh` scans these files but is deliberately NON-BLOCKING — it is
   * "a smoke alarm and not a proof", and it does not run in CI. This does run in CI, because
   * `npm test` gates deployment.
   *
   * Comment lines are excluded: a citation reading "42 CFR 435.552(a): 80 hours" is exactly
   * the provenance `engineering-standards.md` asks for.
   */
  const TIER_1 = [
    "src/lib/calculations.ts",
    "src/lib/utils/payPeriodConversion.ts",
    "src/lib/storage/income.ts",
    "src/lib/exemptions/calculator.ts",
    "src/lib/assessment/recommendationEngine.ts",
    // Added by W2b: it holds policy values and the shell gate never scanned it.
    "src/lib/reviewPeriod.ts",
  ] as const;

  it.each(TIER_1)(
    "%s contains no bare 80, 580, 7.25, 2.17 or 4.33",
    async (file) => {
      const { readFileSync } = await import("node:fs");
      const { resolve } = await import("node:path");

      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      const offenders = source
        .split("\n")
        .map((line, i) => ({ line, n: i + 1 }))
        .filter(({ line }) => !/^\s*(\/\/|\*|\/\*)/.test(line))
        .filter(({ line }) => !line.includes("policy-literal-ok"))
        .filter(({ line }) =>
          /(^|[^0-9._$A-Za-z])(80|580|7\.25|4\.33|2\.17)([^0-9%A-Za-z]|$)/.test(
            line,
          ),
        )
        .map(({ line, n }) => `${file}:${n}: ${line.trim()}`);

      expect(offenders, offenders.join("\n")).toEqual([]);
    },
  );
});
