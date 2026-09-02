"use client";

import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { HelpTooltip } from "@/components/help/HelpTooltip";
import { activityDefinitions, combinationRules } from "@/content/helpText";
import { FEDERAL_DEFAULT, incomeThreshold } from "@/lib/policy";

/**
 * 42 CFR 435.552(a) and (a)(6), 91 FR 33470. From the profile, not literals (ADR-0001).
 * This file held four hardcoded thresholds and appeared in no site table.
 */
const HOURS = FEDERAL_DEFAULT.requiredHours;
const INCOME_MINIMUM = incomeThreshold(FEDERAL_DEFAULT);

/**
 * HourTrackingHelpIcon Component
 *
 * Displays comprehensive help information about hour tracking,
 * including activity definitions, combination rules, and edge cases.
 */
export function HourTrackingHelpIcon() {
  const renderContent = () => (
    <Box>
      {/*
        THE MONTHLY TOTAL.

        REWRITTEN IN W2b, and this file appeared in no site table — neither
        `wave-2` § 2.5's nor W2a's handoff — despite being rendered on the primary
        tracking surface from `Dashboard.tsx`. Two things were wrong beyond the
        four hardcoded thresholds:

        1. "To meet Medicaid work requirements, you need to complete 80 hours per
           month" asserts that the requirement APPLIES. It may not: under
           42 CFR 435.554 a specified excluded individual is not an applicable
           individual at all, and § 435.556(c) PROHIBITS the state from assessing
           their compliance. ADR-0003 — the state decides that, not HourKeep. None
           of the 29 banned phrases matched, because every one of them carries a
           pronoun or is all-caps and this said "you need to".
        2. The list was presented as exhaustive while omitting income
           (§ 435.552(a)(6)), the income-to-hours proxy (§ 435.552(e)(2)) and
           half-time education (§ 435.552(a)(4)), which needs no hours at all.
      */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          The {HOURS}-hour monthly total
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          If this requirement applies to you, the usual way to meet it is{" "}
          {HOURS} hours a month across everything you do — work, volunteering,
          school or job training all add into the same total. It doesn&apos;t
          have to be one activity.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Hours aren&apos;t the only route. Household income of at least $
          {INCOME_MINIMUM} a month can count instead, some states can credit
          income below that as hours and add your activities on top, and being
          in school at least half-time can be enough on its own with no hours to
          count. Your state decides which of these it uses for you.
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Activity Types */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 18, color: "success.main" }}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            What Activities Count?
          </Typography>
        </Box>

        {/* Work */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {activityDefinitions.work.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {activityDefinitions.work.definition}
          </Typography>
          <List dense sx={{ py: 0, pl: 2 }}>
            {activityDefinitions.work.examples
              .slice(0, 3)
              .map((example, index) => (
                <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                  <ListItemText
                    primary={`• ${example}`}
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { fontSize: "0.875rem" },
                    }}
                  />
                </ListItem>
              ))}
          </List>
        </Box>

        {/* Volunteer */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {activityDefinitions.volunteer.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {activityDefinitions.volunteer.definition}
          </Typography>
          <List dense sx={{ py: 0, pl: 2 }}>
            {activityDefinitions.volunteer.examples
              .slice(0, 3)
              .map((example, index) => (
                <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                  <ListItemText
                    primary={`• ${example}`}
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { fontSize: "0.875rem" },
                    }}
                  />
                </ListItem>
              ))}
          </List>
        </Box>

        {/* Education */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {activityDefinitions.education.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {activityDefinitions.education.definition}
          </Typography>
          <List dense sx={{ py: 0, pl: 2 }}>
            {activityDefinitions.education.examples
              .slice(0, 3)
              .map((example, index) => (
                <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                  <ListItemText
                    primary={`• ${example}`}
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { fontSize: "0.875rem" },
                    }}
                  />
                </ListItem>
              ))}
          </List>
        </Box>

        {/* Work Program */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {activityDefinitions.workProgram.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {activityDefinitions.workProgram.definition}
          </Typography>
          <List dense sx={{ py: 0, pl: 2 }}>
            {activityDefinitions.workProgram.examples
              .slice(0, 3)
              .map((example, index) => (
                <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                  <ListItemText
                    primary={`• ${example}`}
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { fontSize: "0.875rem" },
                    }}
                  />
                </ListItem>
              ))}
          </List>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Combining Activities */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
          <InfoIcon sx={{ fontSize: 18, color: "info.main" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {combinationRules.title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {combinationRules.definition}
        </Typography>
        <List dense sx={{ py: 0, pl: 2 }}>
          {combinationRules.examples.map((example, index) => (
            <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
              <ListItemText
                primary={`• ${example}`}
                primaryTypographyProps={{
                  variant: "body2",
                  sx: { fontSize: "0.875rem" },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Common Questions */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Common Questions
        </Typography>

        {/* Work edge case */}
        {activityDefinitions.work.edgeCases
          .slice(0, 2)
          .map((edgeCase, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 1,
                backgroundColor:
                  edgeCase.counts === true
                    ? "success.lighter"
                    : edgeCase.counts === false
                      ? "error.lighter"
                      : "warning.lighter",
                border: "1px solid",
                borderColor:
                  edgeCase.counts === true
                    ? "success.light"
                    : edgeCase.counts === false
                      ? "error.light"
                      : "warning.light",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {edgeCase.scenario}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {edgeCase.explanation}
              </Typography>
            </Box>
          ))}
      </Box>

      {/* Important Note */}
      <Box
        sx={{
          p: 1.5,
          borderRadius: 1,
          backgroundColor: "info.lighter",
          border: "1px solid",
          borderColor: "info.light",
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
        >
          Remember
        </Typography>
        {/*
          REWRITTEN IN W2b. This said "Job searching does NOT count as a qualifying
          activity. If you lose your job, you need to volunteer, go to school, or
          join a work program to meet the 80-hour requirement."

          That CONTRADICTED W2a's own correction. W2a added § 435.552's
          subsidiary-activity nuance to `activityDefinitions.workProgram`, so the
          app was stating both versions — and the wrong one sat on the tracking
          page while the right one was two clicks away in the same tooltip.

          The rule: standalone supervised job search or job-search training does
          not qualify as a work program, but it MAY count as a subsidiary activity
          within a qualifying programme if it is under half that programme's
          required hours. Unemployment-insurance job search can also count where it
          is conducted consistently with work-programme requirements.

          The old second sentence was worse than the first: it told a newly
          unemployed person their only routes were volunteering, school or a work
          programme, omitting income, the proxy, and any set-aside category they
          might fall into.
        */}
        <Typography variant="caption" color="text.secondary">
          Looking for work doesn&apos;t count on its own. But if job searching
          is part of a job training programme you&apos;re in, it can count as
          part of that — and job search you do as a condition of unemployment
          benefits may count too. Losing a job also doesn&apos;t leave you with
          only volunteering: income counts, school at half-time or more counts,
          and some situations mean your state doesn&apos;t assess this at all.
          Ask them what applies to you.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <HelpTooltip
      title="Hour Tracking Help"
      content={renderContent()}
      ariaLabel="Help for hour tracking"
      size="small"
      color="primary"
    />
  );
}
