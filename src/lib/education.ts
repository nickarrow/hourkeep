/**
 * Education enrollment and the credit-hour conversion — 42 CFR 435.552(c), (d), (e).
 *
 * W6a. Tier 1 under ADR-0007; tests in `__tests__/education.test.ts` were written first.
 *
 * THE HALF-TIME CLIFF. 42 CFR 435.552(a)(4), 91 FR 33470: enrolment "at least half-time"
 * demonstrates community engagement on its own, with ZERO hours — and 435.552(e)(1)
 * forbids combining it with any other activity, because (a)(4) is already satisfied. Below
 * half-time, 435.552(d) converts credit hours to monthly hours and (e) permits combining
 * them. A cliff, not a slope.
 *
 * This module returns a discriminated union rather than a bare number precisely so a
 * caller CANNOT fold at-least-half-time education into a combinable total and then measure
 * it against 80 — that would report a half-time student as failing, the exact harm
 * ADR-0003 § Context names. `combinableHours` is 0 for everything except the
 * less-than-half-time branch.
 *
 * ENROLLMENT STATUS IS THE SCHOOL'S TO ASSIGN. 42 CFR 435.552(c), 91 FR 33358: the state
 * uses "the enrollment status determined by the school or institution". So the app asks
 * for it and never infers it from an hours figure. Missing status is `"unknown"`, which
 * contributes nothing and prompts the user to ask — never a guess that understates them.
 *
 * TERM/RECESS/END RULES ARE NOT HERE. 42 CFR 435.552(c)(1)-(3) — when a status begins, how
 * it carries through a break, when it ends — are owned by W6b, which builds the temporal
 * model. This module answers "given a status this month, what does it contribute?".
 */

import { FEDERAL_DEFAULT, type PolicyProfile } from "@/lib/policy";

/**
 * Enrolment status, as the school reports it — 42 CFR 435.552(c).
 *
 * `"unknown"` is a first-class value, not a null: the school decides, the user may not
 * have asked yet, and "we don't know" is honest content (ADR-0003).
 */
export type EnrollmentStatus =
  | "at-least-half-time"
  | "less-than-half-time"
  | "unknown";

/**
 * Convert less-than-half-time credit hours to monthly education hours.
 *
 * 42 CFR 435.552(d)(1), 91 FR 33470-33471:
 *   weeklyHours  = creditHours × hoursPerCreditPerWeek   (the Carnegie Unit, = 3)
 *   monthlyHours = weeklyHours × weeksPerMonth            (52 ÷ 12, = 4.33)
 *
 * CMS worked example, 91 FR 33359: `6 × 3 × 4.33 = 77.94` — close to, and deliberately
 * short of, 80. This is **Computed** (`compliance-copy-standards.md`): the state will
 * calculate this exact figure, so the app shows it with its arithmetic rather than
 * deferring it.
 *
 * Constants come from the profile (ADR-0001), not literals. Rounded to cents for the same
 * reason `incomeThreshold` is: a value a student compares against 80 must not render with
 * a floating-point tail.
 */
export function convertCreditHoursToMonthly(
  creditHours: number,
  policy: PolicyProfile = FEDERAL_DEFAULT,
): number {
  const { hoursPerCreditPerWeek, weeksPerMonth } =
    policy.educationCreditHourConversion;
  const monthly = creditHours * hoursPerCreditPerWeek * weeksPerMonth;
  return Math.round(monthly * 100) / 100;
}

/** What a month's education enrolment contributes toward community engagement. */
export interface EducationInput {
  status: EnrollmentStatus;
  /** Credit hours this month, used only when less than half-time and credit-based. */
  creditHours?: number;
  /**
   * Actual class/activity hours for a non-credit-hour program — 42 CFR 435.552(d)(2),
   * counted 1:1. Used only when less than half-time. If both `creditHours` and
   * `nonCreditHours` are given, credit hours win (a program is one or the other).
   */
  nonCreditHours?: number;
}

/**
 * Education demonstrated on its own at or above half-time — 42 CFR 435.552(a)(4).
 * `combinableHours` is 0 by construction: (e)(1) forbids combining it.
 */
export interface DemonstratedStandalone {
  kind: "demonstrated-standalone";
  combinableHours: 0;
}

/** Less-than-half-time education, converted to hours that combine — § 435.552(d), (e). */
export interface CombinableHours {
  kind: "combinable-hours";
  combinableHours: number;
  /** The credit hours the figure was derived from, so the UI can show the arithmetic. */
  workingCreditHours?: number;
}

/** The school's status is unknown — § 435.552(c). Contributes nothing; ask the school. */
export interface StatusUnknown {
  kind: "status-unknown";
  combinableHours: 0;
}

export type EducationContribution =
  | DemonstratedStandalone
  | CombinableHours
  | StatusUnknown;

/**
 * Resolve what a month's education enrolment contributes.
 *
 * The policy parameter is injected (ADR-0001) and defaults to the federal profile so
 * existing callers and W0's characterization tests are undisturbed.
 */
export function educationContribution(
  input: EducationInput,
  policy: PolicyProfile = FEDERAL_DEFAULT,
): EducationContribution {
  switch (input.status) {
    case "at-least-half-time":
      // 42 CFR 435.552(a)(4), (e)(1): demonstrated on its own, ZERO combinable hours. Any
      // creditHours/nonCreditHours passed in are deliberately ignored — folding them into
      // a total is the false negative this branch exists to prevent.
      return { kind: "demonstrated-standalone", combinableHours: 0 };

    case "less-than-half-time": {
      // 42 CFR 435.552(d). Credit-based programs convert; non-credit programs count 1:1
      // (d)(2). A program is one or the other, so credit hours take precedence if both
      // are somehow present.
      if (input.creditHours !== undefined) {
        return {
          kind: "combinable-hours",
          combinableHours: convertCreditHoursToMonthly(
            input.creditHours,
            policy,
          ),
          workingCreditHours: input.creditHours,
        };
      }
      return {
        kind: "combinable-hours",
        combinableHours: input.nonCreditHours ?? 0,
      };
    }

    case "unknown":
      // 42 CFR 435.552(c): the school determines status. We do not infer it. Zero
      // contribution and a signal to the caller to ask — never a guess.
      return { kind: "status-unknown", combinableHours: 0 };
  }
}
