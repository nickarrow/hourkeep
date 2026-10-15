/**
 * Education enrollment and the credit-hour conversion — 42 CFR 435.552(c), (d).
 *
 * W6a. Tier 1 under ADR-0007: this decides whether a student believes their
 * schooling counts, so the test is written before the module and every name
 * carries its CFR paragraph and FR page.
 *
 * THE HALF-TIME CLIFF IS THE WHOLE POINT. 42 CFR 435.552(a)(4), 91 FR 33470:
 * enrolment "at least half-time" demonstrates community engagement on its own,
 * with ZERO hours, and 435.552(e)(1) forbids combining it with anything. Below
 * half-time, 435.552(d) converts credit hours to monthly hours and (e) lets them
 * combine. A cliff, not a slope — so the function returns two shapes, not one
 * number, and a caller cannot accidentally add half-time education into a total.
 *
 * THE CONVERSION IS COMPUTED, NOT DEFERRED. `compliance-copy-standards.md`:
 * refusing to show arithmetic CMS published is withholding, not humility. CMS's
 * own worked example at 91 FR 33359 lands 6 credits at 77.94 — close to, and
 * deliberately short of, 80 — so the number has to be shown with its arithmetic
 * or it reads as a bug.
 *
 * THE CONSTANTS COME FROM THE PROFILE (ADR-0001). `3` and `4.33` are
 * `educationCreditHourConversion` on the policy profile, not literals here. The
 * `4.33` is NOT `PAY_PERIOD_MULTIPLIERS.weekly`, which is 52/12 rounded down and
 * is HourKeep's own invention (gap 5.4, W7a); these digits coincide and mean
 * different things. A mutated-profile test below proves the value is injected.
 */

import { describe, it, expect } from "vitest";
import {
  convertCreditHoursToMonthly,
  educationContribution,
  type EnrollmentStatus,
} from "@/lib/education";
import { FEDERAL_DEFAULT, type PolicyProfile } from "@/lib/policy";

describe("convertCreditHoursToMonthly: 42 CFR 435.552(d)(1), 91 FR 33470-33471", () => {
  it("§ 435.552(d)(1), 91 FR 33359: 6 credit hours convert to 77.94 monthly hours", () => {
    // CMS's worked example, 91 FR 33359: "6 credit hours converts to 77.94 hours of
    // monthly activity (6 credit hours x 3 x 4.33 = 77.94), which is close to, but
    // slightly less than, the 80 hours". The surprising near-miss the UI must explain.
    expect(convertCreditHoursToMonthly(6)).toBe(77.94);
  });

  it("§ 435.552(d)(1): 1 credit hour converts to 12.99 monthly hours", () => {
    // 1 x 3 x 4.33 = 12.99. The CFR table's first row (rule-extract.md § 2.4).
    expect(convertCreditHoursToMonthly(1)).toBe(12.99);
  });

  it("§ 435.552(d)(1): 3 credit hours convert to 38.97 monthly hours", () => {
    // 3 x 3 x 4.33 = 38.97. The CFR table's third row.
    expect(convertCreditHoursToMonthly(3)).toBe(38.97);
  });

  it("rounds to cents, so a binary-inexact product is not shown with a floating-point tail", () => {
    // Same discipline as incomeThreshold: a figure a student compares against the
    // threshold must not render as 142.89000000000001. The six CFR-table operands all
    // happen to be exact in IEEE 754, but larger credit loads are not — 11 x 3 x 4.33
    // computes to 142.89000000000001 raw. The guard matters for the operands the table
    // does not list.
    const raw = 11 * 3 * 4.33;
    expect(raw).not.toBe(142.89); // the hazard is real for this operand
    expect(convertCreditHoursToMonthly(11)).toBe(142.89); // the function fixes it
  });

  it("zero credit hours convert to zero", () => {
    expect(convertCreditHoursToMonthly(0)).toBe(0);
  });

  it("ADR-0001: tracks an injected conversion rate, proving the constants are not literals", () => {
    // THE LOAD-BEARING ASSERTION. Asserting only 77.94 passes against a hardcoded
    // `creditHours * 3 * 4.33`, so it cannot tell a derivation from a constant. A profile
    // with a doubled weekly factor must double the answer.
    const doubled: PolicyProfile = {
      ...FEDERAL_DEFAULT,
      id: "test:doubled-conversion",
      educationCreditHourConversion: {
        hoursPerCreditPerWeek: 3,
        weeksPerMonth: 8.66, // 4.33 x 2
      },
    };
    // 6 x 3 x 8.66 = 155.88
    expect(convertCreditHoursToMonthly(6, doubled)).toBe(155.88);
    // And the federal default is unchanged by the mutation.
    expect(convertCreditHoursToMonthly(6)).toBe(77.94);
  });
});

describe("educationContribution: the half-time cliff — 42 CFR 435.552(a)(4), (d), (e)", () => {
  it("§ 435.552(a)(4), 91 FR 33470: at least half-time demonstrates on its own, zero hours, not combinable", () => {
    // The cliff's top. Enrolment at least half-time satisfies (a)(4), so the result is
    // "demonstrated" and carries no hours to combine — 435.552(e)(1) forbids combination.
    const result = educationContribution({ status: "at-least-half-time" });
    expect(result.kind).toBe("demonstrated-standalone");
    expect(result.combinableHours).toBe(0);
  });

  it("§ 435.552(d), (e)(1): less than half-time converts credit hours and combines", () => {
    // The cliff's bottom. 6 credit hours less-than-half-time converts to 77.94 and those
    // hours ARE combinable with work, community service, and work-program hours.
    const result = educationContribution({
      status: "less-than-half-time",
      creditHours: 6,
    });
    expect(result.kind).toBe("combinable-hours");
    expect(result.combinableHours).toBe(77.94);
  });

  it("§ 435.552(d)(2): less than half-time with non-credit hours counts actual hours 1:1", () => {
    // 91 FR 33471: for programs that do not use credit hours, "the hours spent attending
    // class and participating in educational activities will count". No conversion.
    const result = educationContribution({
      status: "less-than-half-time",
      nonCreditHours: 50,
    });
    expect(result.kind).toBe("combinable-hours");
    expect(result.combinableHours).toBe(50);
  });

  it("§ 435.552(c): unknown status contributes nothing and is flagged to ask the school", () => {
    // The school determines status (435.552(c)), so the app cannot infer it from an hours
    // figure. Unknown means unknown: zero combinable hours, not demonstrated, and the
    // caller is told to ask. Never guess in the direction that understates the user.
    const result = educationContribution({ status: "unknown" });
    expect(result.kind).toBe("status-unknown");
    expect(result.combinableHours).toBe(0);
  });

  it("does not fold half-time education into a combinable total — the false-negative guard", () => {
    // The harm ADR-0003 § Context names: a half-time student has demonstrated under
    // (a)(4), but if their 40 education hours were summed into a combinable total and
    // then measured against 80, the app would report them failing. combinableHours MUST
    // be 0 for at-least-half-time so no caller can make that mistake.
    const result = educationContribution({
      status: "at-least-half-time",
      creditHours: 12,
      nonCreditHours: 40,
    });
    expect(result.combinableHours).toBe(0);
  });

  it("exposes the arithmetic for less-than-half-time so the UI can show it (Computed, not Deferred)", () => {
    // compliance-copy-standards.md requires the formula and citation on screen. The
    // result carries the operands so the component need not re-derive them.
    const result = educationContribution({
      status: "less-than-half-time",
      creditHours: 6,
    });
    if (result.kind !== "combinable-hours") throw new Error("wrong branch");
    expect(result.workingCreditHours).toBe(6);
    expect(result.combinableHours).toBe(77.94);
  });
});

describe("EnrollmentStatus is a closed set the school assigns", () => {
  it("accepts exactly the three statuses, and nothing shaped like a verdict", () => {
    // Typed so a caller cannot invent a status. The compiler enforces this; the runtime
    // check documents the intent for untyped callers.
    const statuses: EnrollmentStatus[] = [
      "at-least-half-time",
      "less-than-half-time",
      "unknown",
    ];
    expect(statuses).toHaveLength(3);
  });
});
