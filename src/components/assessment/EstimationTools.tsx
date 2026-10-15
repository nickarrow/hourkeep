"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Collapse,
  MenuItem,
  Paper,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { PAY_PERIOD_MULTIPLIERS } from "@/lib/utils/payPeriodConversion";

/**
 * Weeks per month, for the hours converter. The same 52/12 figure as the weekly pay-period
 * multiplier, shared rather than restated — and, like it, NOT a value from the rule.
 *
 * Note this is NOT 42 CFR 435.552(d)'s Carnegie Unit, which appears in
 * `creditHours x 3 x 4.33` for less-than-half-time education. Same digits, unrelated
 * meanings, and W6a owns that one.
 */
const WEEKS_PER_MONTH = PAY_PERIOD_MULTIPLIERS.weekly;

interface HoursConverterProps {
  onUseValue: (monthlyHours: number) => void;
}

export function HoursConverter({ onUseValue }: HoursConverterProps) {
  const [expanded, setExpanded] = useState(false);
  const [weeklyHours, setWeeklyHours] = useState("");

  const monthlyEquivalent = weeklyHours
    ? Math.round(parseFloat(weeklyHours) * WEEKS_PER_MONTH)
    : 0;

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        onClick={() => setExpanded(!expanded)}
        endIcon={
          <ExpandMoreIcon
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          />
        }
        sx={{
          textTransform: "none",
          color: "primary.main",
          fontSize: "0.875rem",
        }}
      >
        I only know my weekly hours
      </Button>

      <Collapse in={expanded}>
        <Paper
          sx={{
            p: 2,
            mt: 1,
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Weekly to Monthly Converter
          </Typography>

          <TextField
            label="Weekly Hours"
            type="number"
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              htmlInput: {
                min: 0,
                step: 0.5,
              },
            }}
            sx={{ mb: 2 }}
          />

          {monthlyEquivalent > 0 && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: "primary.50",
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Monthly equivalent:
              </Typography>
              <Typography variant="h6" color="primary.main">
                {monthlyEquivalent} hours/month
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Calculated: {weeklyHours} × {WEEKS_PER_MONTH} weeks/month
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            size="small"
            onClick={() => {
              onUseValue(monthlyEquivalent);
              setExpanded(false);
            }}
            disabled={!weeklyHours || monthlyEquivalent === 0}
            fullWidth
          >
            Use This Amount
          </Button>
        </Paper>
      </Collapse>
    </Box>
  );
}

interface IncomeConverterProps {
  onUseValue: (monthlyIncome: number) => void;
}

export function IncomeConverter({ onUseValue }: IncomeConverterProps) {
  const [expanded, setExpanded] = useState(false);
  const [paycheckAmount, setPaycheckAmount] = useState("");
  const [frequency, setFrequency] = useState<"weekly" | "biweekly" | "monthly">(
    "biweekly",
  );

  /**
   * Shared with `lib/utils/payPeriodConversion.ts` rather than restated.
   *
   * These were duplicated here with the same values, which is how two copies of one number
   * drift. NOT from the rule — gap 5.4 classes them as `contradicts`, because the IFC
   * prescribes no pay-period conversion and 42 CFR 435.603 leaves the monthly figure to
   * state MAGI methodology. W7a owns replacing them; sharing them now means it has one
   * place to change.
   */
  const multipliers = {
    weekly: PAY_PERIOD_MULTIPLIERS.weekly,
    biweekly: PAY_PERIOD_MULTIPLIERS["bi-weekly"],
    monthly: PAY_PERIOD_MULTIPLIERS.monthly,
  };

  const monthlyEquivalent = paycheckAmount
    ? Math.round(parseFloat(paycheckAmount) * multipliers[frequency])
    : 0;

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        onClick={() => setExpanded(!expanded)}
        endIcon={
          <ExpandMoreIcon
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          />
        }
        sx={{
          textTransform: "none",
          color: "primary.main",
          fontSize: "0.875rem",
        }}
      >
        I only know my paycheck amount
      </Button>

      <Collapse in={expanded}>
        <Paper
          sx={{
            p: 2,
            mt: 1,
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Paycheck to Monthly Converter
          </Typography>

          <TextField
            label="Paycheck Amount"
            type="number"
            value={paycheckAmount}
            onChange={(e) => setPaycheckAmount(e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              },
              htmlInput: {
                min: 0,
                step: 0.01,
              },
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="How often paid"
            select
            value={frequency}
            onChange={(e) =>
              setFrequency(e.target.value as "weekly" | "biweekly" | "monthly")
            }
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="biweekly">Bi-weekly (every 2 weeks)</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </TextField>

          {monthlyEquivalent > 0 && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: "primary.50",
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {/* W7a (gap 5.4): this is a rough ESTIMATE for the assessment, not a
                    compliance figure. The rule prescribes no pay-period conversion; your
                    state works the month out its own way. The deeper coupling — this value
                    feeds responses.monthlyIncome, which recommendationEngine compares to the
                    threshold — is W7b's to unpick with the mode fork (ADR-0004). */}
                Rough monthly estimate:
              </Typography>
              <Typography variant="h6" color="primary.main">
                ${monthlyEquivalent}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                A personal estimate — ${paycheckAmount} ×{" "}
                {multipliers[frequency]}{" "}
                {frequency === "monthly"
                  ? ""
                  : frequency === "biweekly"
                    ? "pay periods/month"
                    : "weeks/month"}
                . Your state works out the month its own way.
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            size="small"
            onClick={() => {
              onUseValue(monthlyEquivalent);
              setExpanded(false);
            }}
            disabled={!paycheckAmount || monthlyEquivalent === 0}
            fullWidth
          >
            Use This Amount
          </Button>
        </Paper>
      </Collapse>
    </Box>
  );
}
