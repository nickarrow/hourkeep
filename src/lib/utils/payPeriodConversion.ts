/**
 * Pay Period Conversion Utilities
 *
 * Handles conversion of income amounts from different pay periods
 * to monthly equivalents for compliance calculations.
 */

import { IncomeEntry } from "@/types/income";
import { FEDERAL_DEFAULT, incomeThreshold } from "@/lib/policy";

/**
 * The three threshold constants moved to `src/lib/policy/` in W2b.
 *
 * ADR-0001's header names this file by name: "Supersedes: the ad-hoc constants in
 * `src/lib/utils/payPeriodConversion.ts`". They are re-exported rather than deleted because
 * `INCOME_THRESHOLD` had three live importers at the start of W2b — `lib/storage/income.ts`,
 * `components/income/IncomeStatusIndicator.tsx` and `components/income/SeasonalWorkerView.tsx`.
 * `storage/income.ts` now takes a profile instead, leaving **two**, both components. The
 * aliases survive because W7a repositions income entirely and this export surface is its to
 * retire; breaking every consumer inside a wave whose gate is "behaviour did not change"
 * would have mixed two kinds of diff.
 *
 * `codebase-audit-2026-08.md` § 6 claims `REQUIRED_HOURS` and `INCOME_THRESHOLD` "sit
 * unused" here. That is wrong for `INCOME_THRESHOLD`, as W0's characterization test already
 * records.
 *
 * @deprecated Read `FEDERAL_DEFAULT.requiredHours`, `.federalMinimumWage`, or
 * `incomeThreshold(profile)` from `@/lib/policy`. These aliases are fixed to the federal
 * default and cannot follow a per-state profile, which is the whole point of ADR-0001.
 */
export const FEDERAL_MINIMUM_WAGE = FEDERAL_DEFAULT.federalMinimumWage;
/** @deprecated See `FEDERAL_MINIMUM_WAGE` above. */
export const REQUIRED_HOURS = FEDERAL_DEFAULT.requiredHours;
/** @deprecated See `FEDERAL_MINIMUM_WAGE` above. Prefer `incomeThreshold(profile)`. */
export const INCOME_THRESHOLD = incomeThreshold(FEDERAL_DEFAULT);

/**
 * Pay-period multipliers.
 *
 * NOT FROM THE RULE, AND THAT IS THE POINT. Gap 5.4 classifies these as `contradicts`: the
 * IFC prescribes no pay-period conversion at all, and states determine a monthly figure
 * through existing MAGI methodology under 42 CFR 435.603. So they are HourKeep's own
 * invention, and W7a owns deciding what replaces them.
 *
 * W2b relocates them into the profile-adjacent world without touching their values, because
 * changing a number here changes every stored `monthlyEquivalent`. Two known biases, pinned
 * by W0's characterization tests and pointing in OPPOSITE directions: `weekly` 4.33 rounds
 * 52/12 down, `bi-weekly` 2.17 rounds 26/12 up. `daily` 30 ignores month length entirely.
 *
 * Note `4.33` here is NOT the Carnegie Unit from 42 CFR 435.552(d)'s
 * `creditHours x 3 x 4.33`. That one is statutory arithmetic CMS publishes and belongs in
 * the education module W6a creates. Same digits, unrelated meanings, and they must not be
 * collapsed into one shared constant.
 */
export const PAY_PERIOD_MULTIPLIERS = {
  daily: 30, // 30 days per month // policy-literal-ok
  weekly: 4.33, // 52 weeks ÷ 12 months, rounded DOWN // policy-literal-ok
  "bi-weekly": 2.17, // 26 pay periods ÷ 12 months, rounded UP // policy-literal-ok
  monthly: 1, // No conversion needed
} as const;

/**
 * Calculate monthly equivalent income based on pay period
 *
 * @param amount - The income amount for the pay period
 * @param payPeriod - The frequency of payment (daily, weekly, bi-weekly, monthly)
 * @returns Monthly equivalent amount rounded to 2 decimal places
 *
 * @example
 * calculateMonthlyEquivalent(400, "bi-weekly") // Returns 868.00
 * calculateMonthlyEquivalent(150, "weekly") // Returns 649.50
 */
export function calculateMonthlyEquivalent(
  amount: number,
  payPeriod: IncomeEntry["payPeriod"],
): number {
  const multiplier = PAY_PERIOD_MULTIPLIERS[payPeriod];
  return Math.round(amount * multiplier * 100) / 100; // Round to 2 decimals
}

/**
 * Format currency amount for display
 *
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get human-readable pay period label
 *
 * @param payPeriod - The pay period type
 * @returns Human-readable label
 */
export function getPayPeriodLabel(payPeriod: IncomeEntry["payPeriod"]): string {
  const labels = {
    daily: "Daily",
    weekly: "Weekly",
    "bi-weekly": "Bi-weekly",
    monthly: "Monthly",
  };
  return labels[payPeriod];
}
