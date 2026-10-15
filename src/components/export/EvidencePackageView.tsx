"use client";

import { Box, Divider, Typography } from "@mui/material";

import type {
  EvidencePackage,
  PackageMonth,
} from "@/lib/export/buildEvidencePackage";

/**
 * The print-ready evidence package — W8a, ADR-0006. The primary artifact a user hands to
 * their state, built for the browser's own print pipeline (`window.print()` → PDF). It
 * renders the pure data assembled by `buildEvidencePackage`; it computes nothing.
 *
 * MUST SURVIVE FAX (ADR-0006). Black-and-white legible, no colour-only cues, and EVERY
 * month block self-identifies with the person's name, the case reference, and the month —
 * faxed pages arrive separated, so a page that only says "July 2026" is unattributable. All
 * status/gap cues carry text, never colour alone (component-standards.md, WCAG 1.4.1 /
 * 1.4.11).
 *
 * NO VERDICT (ADR-0003). Logged / Threshold / Difference and an apparent-pathway label with
 * its citation; the legend names the state as the decider. In `no-verdict.render.test.tsx`
 * from the commit that created it.
 *
 * BOTH COMPARISONS WHEN BOTH EXIST (semantic review #2/#3). A month with hours AND income
 * records prints both neutral comparisons; the recorded mode is a label. Seasonal status
 * modifies the income block only — it never hides a logged-hours comparison.
 */
interface EvidencePackageViewProps {
  pkg: EvidencePackage;
  /** reference (ACT-/INC-/EXC-) → object URL for attachment images. */
  attachmentUrls?: Record<string, string>;
}

/** Whole numbers print cleanly; the credit-hour conversion produces fractional hours. */
function fmtHours(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function fmtMoney(n: number): string {
  return `$${n.toFixed(2)}`;
}

/** True when the app is on the federal floor, so state elections are assumptions. */
function isFederalFloor(pkg: EvidencePackage): boolean {
  return pkg.policyConfidence === "statutory-floor";
}

function HoursComparison({ m }: { m: PackageMonth }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        Hours
      </Typography>
      <Typography variant="body2">
        Logged: {fmtHours(m.hours.logged)} hours
      </Typography>
      <Typography variant="body2">
        Threshold: {fmtHours(m.hours.threshold)} hours
      </Typography>
      <Typography variant="body2">
        Difference: {fmtHours(m.hours.difference)} hours
      </Typography>
    </Box>
  );
}

function IncomeComparison({
  m,
  federalFloor,
}: {
  m: PackageMonth;
  federalFloor: boolean;
}) {
  const seasonal = m.income.isSeasonalWorker;
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {seasonal
          ? `Income (seasonal ${m.income.seasonalWindowMonths}-month average)`
          : "Income"}
      </Typography>
      <Typography variant="body2">
        Logged: {fmtMoney(m.income.logged)}
      </Typography>
      <Typography variant="body2">
        Threshold: {fmtMoney(m.income.threshold)}
      </Typography>
      <Typography variant="body2">
        Difference: {fmtMoney(m.income.difference)}
      </Typography>
      {seasonal ? (
        <>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            This is the average of the {m.income.seasonalWindowMonths} months
            before the month under review (seasonal workers). 42 CFR 435.552(g).
            {federalFloor
              ? " Your state may work this out differently — ask them which method they use."
              : ""}
          </Typography>
          {m.income.seasonalHistory && (
            <Box component="ul" sx={{ my: 0.5, pl: 3 }}>
              {m.income.seasonalHistory.map((h) => (
                <li key={h.month}>
                  <Typography variant="body2" component="span">
                    {h.label}:{" "}
                    {h.hasData
                      ? fmtMoney(h.total)
                      : "No record — ask your state what it has on file"}
                  </Typography>
                </li>
              ))}
            </Box>
          )}
        </>
      ) : (
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Your state counts your whole tax household here, so its figure may be
          higher than this one — ask your state what income it already has on
          file for your household. 42 CFR 435.603(d)-(f).
        </Typography>
      )}
    </Box>
  );
}

export function EvidencePackageView({
  pkg,
  attachmentUrls = {},
}: EvidencePackageViewProps) {
  const caseRef = pkg.cover.medicaidId
    ? `Medicaid ID ${pkg.cover.medicaidId}`
    : pkg.cover.name;
  const federalFloor = isFederalFloor(pkg);

  return (
    <Box
      // Print rules live here so the shipped stylesheet carries them. Black on white,
      // generous margins for fax, and the browser is told to keep each month block together
      // where it can.
      sx={{
        color: "#000",
        backgroundColor: "#fff",
        fontSize: "12pt",
        lineHeight: 1.4,
        "& h1, & h2, & h3": { color: "#000" },
        "@media print": {
          "@page": { margin: "0.75in" },
          ".pkg-month": { breakInside: "avoid" },
        },
      }}
    >
      {/* Cover */}
      <Box component="header" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          HourKeep Activity Record
        </Typography>
        <Typography variant="body1">Name: {pkg.cover.name}</Typography>
        <Typography variant="body1">State: {pkg.cover.state}</Typography>
        {pkg.cover.medicaidId && (
          <Typography variant="body1">
            Medicaid ID: {pkg.cover.medicaidId}
          </Typography>
        )}
        {pkg.cover.dateOfBirth && (
          <Typography variant="body1">
            Date of birth: {pkg.cover.dateOfBirth}
          </Typography>
        )}
        {pkg.cover.phoneNumber && (
          <Typography variant="body1">
            Phone: {pkg.cover.phoneNumber}
          </Typography>
        )}
        {pkg.cover.email && (
          <Typography variant="body1">Email: {pkg.cover.email}</Typography>
        )}
        <Typography variant="body2" sx={{ mt: 1 }}>
          Report date: {pkg.cover.reportDate}
        </Typography>
        {pkg.cover.coverageMonths.length > 0 && (
          <Typography variant="body2">
            Months covered: {pkg.cover.coverageMonths.join(", ")}
          </Typography>
        )}
        {federalFloor && (
          <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
            Note: this record uses the federal minimum rules. Your state may
            have chosen different options (how it averages seasonal income, when
            it requires documents). Ask your state for its specifics.
          </Typography>
        )}
      </Box>

      {/* Legend — the state decides (ADR-0003). Not colour, text. */}
      <Box
        component="section"
        sx={{ mb: 3, border: "1px solid #000", p: 2 }}
        aria-label="How to read this record"
      >
        {pkg.legend.map((line, i) => (
          <Typography
            key={i}
            variant="body2"
            sx={{ mb: i < pkg.legend.length - 1 ? 1 : 0 }}
          >
            {line}
          </Typography>
        ))}
      </Box>

      {/* How to submit — 42 CFR 435.907(a) channels (gap 8.1). */}
      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2">
          How you can submit this
        </Typography>
        <Typography variant="body2">
          Your state must accept this through any of these channels:{" "}
          {pkg.submissionModalities.join(", ")}. 42 CFR 435.907(a).
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: "#000" }} />

      {/* Per-month blocks. Each repeats name + case reference + month for fax. */}
      {pkg.months.map((m) => (
        <Box
          key={m.month}
          className="pkg-month"
          component="section"
          sx={{ mb: 3 }}
          aria-label={`${m.label} record`}
        >
          <Typography variant="caption" sx={{ display: "block" }}>
            {pkg.cover.name} — {caseRef}
          </Typography>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            {m.label}
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
            Recorded as: {m.recordedAs === "income" ? "Income" : "Hours"}
          </Typography>

          {/* Both comparisons when both record types exist (semantic review #2/#3). A month
              with no records of either kind still shows the hours comparison as the default
              (0 logged), so the block is never empty. Seasonal modifies income only. */}
          {m.hasHoursRecords || (!m.hasHoursRecords && !m.hasIncomeRecords) ? (
            <HoursComparison m={m} />
          ) : null}
          {m.hasIncomeRecords ? (
            <IncomeComparison m={m} federalFloor={federalFloor} />
          ) : null}

          {/* Activity detail lines — W6a's structured evidence (semantic review #5). */}
          {m.activityDetails.length > 0 && (
            <Box component="ul" sx={{ my: 1, pl: 3 }}>
              {m.activityDetails.map((a, i) => (
                <li key={i}>
                  <Typography variant="body2" component="span">
                    {a.date} — {a.typeLabel}
                    {a.detail ? ` — ${a.detail}` : ""}
                  </Typography>
                  {a.communityService && (
                    <Box component="ul" sx={{ pl: 3 }}>
                      {a.communityService.organizationName && (
                        <li>
                          <Typography variant="body2" component="span">
                            Organization: {a.communityService.organizationName}
                          </Typography>
                        </li>
                      )}
                      {a.communityService.organizationAddress && (
                        <li>
                          <Typography variant="body2" component="span">
                            Address: {a.communityService.organizationAddress}
                          </Typography>
                        </li>
                      )}
                      {a.communityService.activityDescription && (
                        <li>
                          <Typography variant="body2" component="span">
                            What I did: {a.communityService.activityDescription}
                          </Typography>
                        </li>
                      )}
                      {a.communityService.pointOfContact && (
                        <li>
                          <Typography variant="body2" component="span">
                            Contact who can confirm hours:{" "}
                            {a.communityService.pointOfContact}
                          </Typography>
                        </li>
                      )}
                      {a.communityService.courtOrdered && (
                        <li>
                          <Typography variant="body2" component="span">
                            Court-ordered
                          </Typography>
                        </li>
                      )}
                    </Box>
                  )}
                </li>
              ))}
            </Box>
          )}

          {/* Income detail lines */}
          {m.incomeDetails.length > 0 && (
            <Box component="ul" sx={{ my: 1, pl: 3 }}>
              {m.incomeDetails.map((e, i) => (
                <li key={i}>
                  <Typography variant="body2" component="span">
                    {e.date} — {fmtMoney(e.amount)} received ({e.payPeriod})
                    {e.source ? ` — ${e.source}` : ""}
                  </Typography>
                </li>
              ))}
            </Box>
          )}

          {/* Documentation gap flag (gap 8.3). Text, not colour. Two-sided per § 435.557(b)(2). */}
          {m.lacksDocumentation && (
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
              {pkg.documentationHardened
                ? "No documents attached for this month. From your state's hardening date it must require documents when they are reasonably available — but it must accept other information when none exists, and may not deny you solely for documents you cannot produce. Add a photo of a pay stub, letter, or schedule if you have one. 42 CFR 435.557(b)(2)(ii)-(iii)."
                : `No documents attached for this month. Your state may ask for documents now and must do so from ${pkg.documentationRequiredFrom} when reasonably available — but it must accept other information when none exists and may not deny you solely for documents you cannot produce. Adding a photo now is worth doing. 42 CFR 435.557(b)(2)(i), (iii).`}
            </Typography>
          )}
          {!m.lacksDocumentation && m.documentCount > 0 && (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Documents attached: {m.documentCount}.
            </Typography>
          )}

          <Divider sx={{ my: 2, borderColor: "#000" }} />
        </Box>
      ))}

      {/* Exclusion responses (gap 8.5) */}
      {pkg.exclusions.length > 0 && (
        <Box component="section" sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2">
            Exclusion responses
          </Typography>
          {pkg.exclusions.map((ex) => (
            <Box key={ex.screening.id} sx={{ mb: 1 }}>
              <Typography variant="body2">
                Screening on {ex.screeningDate}
                {ex.category
                  ? ` — category you asked your state to check: ${ex.category}`
                  : ""}
                . Your state decides whether an exclusion applies. 42 CFR
                435.554, 435.557(b)(2).
              </Typography>
              {ex.documents.length > 0 && (
                <Typography variant="body2">
                  Supporting documents attached:{" "}
                  {ex.documents.map((d) => d.reference).join(", ")}.
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Document manifest (gap 8.7) — honest empty state (semantic review #5). */}
      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2">
          Document manifest
        </Typography>
        {pkg.manifest.length > 0 ? (
          <Box component="ul" sx={{ pl: 3 }}>
            {pkg.manifest.map((entry) => (
              <li key={entry.reference}>
                <Typography variant="body2" component="span">
                  {entry.reference} — {entry.type} — captured{" "}
                  {entry.captureDate} — supports {entry.linkedTo}
                </Typography>
              </li>
            ))}
          </Box>
        ) : (
          <Typography variant="body2">
            No documents are attached to this package.
          </Typography>
        )}
      </Box>

      {/* Attachments — the actual images, keyed by namespaced reference. */}
      {pkg.manifest.length > 0 && (
        <Box component="section" sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2">
            Attachments
          </Typography>
          {pkg.manifest.map((entry) => {
            const url = attachmentUrls[entry.reference];
            return (
              <Box key={entry.reference} className="pkg-month" sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ display: "block" }}>
                  {pkg.cover.name} — {caseRef} — {entry.reference}
                </Typography>
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt={`${entry.type} supporting document ${entry.reference}`}
                    style={{ maxWidth: "100%", border: "1px solid #000" }}
                  />
                ) : (
                  <Typography variant="body2">
                    [Image {entry.reference} — attach the printed or saved file]
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {/* Plain signature-and-date line — ADR-0006 § Contents (corrected). No attestation. */}
      <Box component="section" sx={{ mt: 4 }}>
        <Divider sx={{ mb: 2, borderColor: "#000" }} />
        <Typography variant="body2" sx={{ mb: 3 }}>
          Signature: _______________________________________
        </Typography>
        <Typography variant="body2">
          Date: _______________________________________
        </Typography>
      </Box>
    </Box>
  );
}
