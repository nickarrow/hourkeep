"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Alert,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { formatCurrency } from "@/lib/utils/payPeriodConversion";
import { FEDERAL_DEFAULT, incomeThreshold } from "@/lib/policy";

/**
 * 42 CFR 435.552(a)(6), 91 FR 33470. From the profile rather than the deprecated
 * `INCOME_THRESHOLD` alias (ADR-0001).
 */
const INCOME_THRESHOLD = incomeThreshold(FEDERAL_DEFAULT);

/**
 * 42 CFR 435.552(g)'s statutory averaging window — the 6 months PRECEDING the month being
 * assessed, which that month is excluded from.
 *
 * A state election, not a constant: 42 CFR 435.603(h)(3) lets a state prorate over a
 * different span and CMS says most elect it. Interpolated from the federal fallback and the
 * copy names the uncertainty. W7a owns the seasonal arithmetic itself, including the
 * off-by-one where this component's average still INCLUDES the assessed month (gap 5.8).
 */
const SEASONAL_MONTHS =
  FEDERAL_DEFAULT.seasonalMethod.kind === "preceding-average"
    ? FEDERAL_DEFAULT.seasonalMethod.months
    : FEDERAL_DEFAULT.seasonalMethod.windowMonths;
import { SeasonalWorkerHelpIcon } from "@/components/help/SeasonalWorkerHelp";

export interface SeasonalWorkerViewProps {
  history: Array<{ month: string; total: number; hasData: boolean }>;
  average: number;
  isCompliant: boolean;
  /** How many of the window months hold records — W7a (gap 5.9). */
  monthsWithData: number;
}

/**
 * SeasonalWorkerView Component
 *
 * Displays 6-month income history and rolling average for seasonal workers.
 * Uses a simple list view for mobile-friendliness and accessibility.
 *
 * Features:
 * - Shows income for each of the 6 months preceding the assessed month (which is excluded)
 * - Displays the average over that window
 * - Shows compliance status based on average
 * - Help text explaining 6-month averaging
 * - Mobile-optimized layout
 */
export function SeasonalWorkerView({
  history,
  average,
  isCompliant,
  monthsWithData,
}: SeasonalWorkerViewProps) {
  // Total across the months that actually hold records (gap 5.9) — not an imputed
  // sum over zero-filled months.
  const totalIncome = history.reduce((sum, month) => sum + month.total, 0);
  // Fewer than all six window months have records, so the average rests on partial
  // evidence. The copy must say so rather than present a thin average as verified.
  const incompleteHistory = monthsWithData < history.length;

  // Format month string (YYYY-MM) to readable format (e.g., "October 2026")
  const formatMonth = (monthStr: string): string => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card
      sx={{
        mt: 3,
        border: "1px solid",
        borderColor: isCompliant ? "success.light" : "warning.light",
        boxShadow: 1,
      }}
    >
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" component="h3">
              6-Month Income History
            </Typography>
            <SeasonalWorkerHelpIcon />
          </Box>
        </Box>

        {/* Monthly Income List */}
        <Box sx={{ mb: 2 }}>
          {history.map((monthData, index) => (
            <Box key={monthData.month}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {formatMonth(monthData.month)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: monthData.hasData ? 600 : 400,
                    color: monthData.hasData ? "text.primary" : "text.disabled",
                    fontStyle: monthData.hasData ? "normal" : "italic",
                  }}
                >
                  {/* W7a (gap 5.9): a month with no entries is "No record", not "$0".
                      Showing $0.00 for a month the user never filled in presented an
                      imputed value as verified income. */}
                  {monthData.hasData
                    ? formatCurrency(monthData.total)
                    : "No record"}
                </Typography>
              </Box>
              {index < history.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>

        {/* Summary Section */}
        <Divider sx={{ my: 2, borderStyle: "dashed" }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Total (6 months)
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatCurrency(totalIncome)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Average/Month
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: isCompliant ? "success.main" : "warning.main",
              }}
            >
              {formatCurrency(average)}
            </Typography>
          </Box>

          {incompleteHistory && (
            <Typography variant="caption" color="text.secondary">
              {/* W7a (gap 5.9): the divisor is the full window (42 CFR 435.552(g) and
                  CMS's ÷6 example), so months with no record count as $0 and pull the
                  average DOWN — honest about the arithmetic without imputing income. */}
              You&apos;ve recorded {monthsWithData} of these {history.length}{" "}
              months. The ones marked &quot;No record&quot; count as $0 in this
              average, so adding any income you haven&apos;t logged will raise
              it. Ask your state how it works your average out.
            </Typography>
          )}
        </Box>

        {/*
          THE COMPARISON, NOT A VERDICT.

          FOUND BY THE W2b REVIEW, by three of four reviewers independently. This rendered:

            "Meets $580 threshold / Your 6-month average meets work requirements."
            "Below $580 threshold / …$X below the requirement. You may need to track
             hours or increase your income."

          Four separate problems, and W2b was the wave that made the last one worse:

          1. A DETERMINATION. "meets work requirements" asserts compliance, which
             42 CFR 435.557 and 435.558 give the state. None of the 31 banned phrases caught
             it — the list has "already meets" and "you meet work requirements", and this
             said "average meets", with no pronoun.
          2. "work requirements" is the term `medicaid-domain-knowledge.md` reserves for copy
             where it genuinely aids comprehension. A status alert is not that.
          3. Two hardcoded thresholds, invisible to W2b's own literal scan because `$580`
             never matched its pattern — see `policyInjection.test.ts`'s POLICY_LITERAL note.
          4. The under-threshold branch said "you may need to track hours or increase your
             income", omitting 42 CFR 435.552(e)(2)'s proxy: income BELOW the threshold can
             be credited AS hours and combined with activities. So the shortfall reads as
             wasted when the rule says it is not.

          Also: this is the seasonal surface, and the averaging window is a state election
          (42 CFR 435.603(h)(3)), so the span is named as an assumption rather than stated.
        */}
        <Box sx={{ mt: 2 }}>
          {isCompliant ? (
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              sx={{ alignItems: "center" }}
            >
              <Typography variant="body2">
                <strong>
                  Average: {formatCurrency(average)} · Threshold:{" "}
                  {formatCurrency(INCOME_THRESHOLD)}
                </strong>
                <br />
                That&apos;s at or over the threshold for these {
                  SEASONAL_MONTHS
                }{" "}
                months. Your state counts your whole household&apos;s income
                here, not just yours, and it may work the average out over a
                different stretch — ask what it has on file.
                {incompleteHistory && (
                  <>
                    {" "}
                    {/* W7a (semantic review finding 2): an incomplete window counts the
                        unrecorded months as $0, so this average is a floor, not a settled
                        figure — do not let the "at or over" read as certain. */}
                    This counts the months you haven&apos;t recorded as $0, so
                    it may change once you add them.
                  </>
                )}
              </Typography>
            </Alert>
          ) : (
            <Alert
              severity="warning"
              icon={<WarningIcon />}
              sx={{ alignItems: "center" }}
            >
              <Typography variant="body2">
                <strong>
                  Average: {formatCurrency(average)} · Threshold:{" "}
                  {formatCurrency(INCOME_THRESHOLD)} · Difference:{" "}
                  {formatCurrency(INCOME_THRESHOLD - average)}
                </strong>
                <br />
                {incompleteHistory && (
                  <>
                    {/* W7a (semantic review finding 2): the unrecorded months count as $0,
                        so a user who simply hasn't logged everything can look short when
                        they are not. Say so before the shortfall framing. */}
                    This counts the months you haven&apos;t recorded as $0, so
                    adding them may raise it.{" "}
                  </>
                )}
                A shortfall here isn&apos;t wasted: some states credit income
                below the threshold as hours, which you can add other activities
                on top of. Your state counts your whole household&apos;s income
                too, which is often more than your own. Ask them what they have
                on file and how they work out your average.
              </Typography>
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
