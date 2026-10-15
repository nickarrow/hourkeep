"use client";

import { Box, Divider, Typography } from "@mui/material";

import type { EvidencePackage } from "@/lib/export/buildEvidencePackage";
import { ACTIVITY_TYPE_LABELS } from "@/lib/activityDisplay";

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
 */
interface EvidencePackageViewProps {
  pkg: EvidencePackage;
  /** blobId → object URL for the attachment images. Missing ids render a placeholder line. */
  attachmentUrls?: Record<number, string>;
}

/** Whole numbers print cleanly; the credit-hour conversion produces fractional hours. */
function fmtHours(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function fmtMoney(n: number): string {
  return `$${n.toFixed(2)}`;
}

export function EvidencePackageView({
  pkg,
  attachmentUrls = {},
}: EvidencePackageViewProps) {
  const caseRef = pkg.cover.medicaidId
    ? `Medicaid ID ${pkg.cover.medicaidId}`
    : pkg.cover.name;

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
          {/* Per-page self-identification — faxed pages arrive separated. */}
          <Typography variant="caption" sx={{ display: "block" }}>
            {pkg.cover.name} — {caseRef}
          </Typography>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            {m.label}
          </Typography>

          {m.income.isSeasonalWorker ? (
            <>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Income (seasonal 6-month average)
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
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                This is the average of the 6 months before the month under
                review (seasonal workers). 42 CFR 435.552(g).
              </Typography>
              {m.income.seasonalHistory && (
                <Box component="ul" sx={{ my: 0.5, pl: 3 }}>
                  {m.income.seasonalHistory.map((h) => (
                    <li key={h.month}>
                      <Typography variant="body2" component="span">
                        {h.month}:{" "}
                        {h.hasData
                          ? fmtMoney(h.total)
                          : "No record (counts as $0 until added)"}
                      </Typography>
                    </li>
                  ))}
                </Box>
              )}
            </>
          ) : m.mode === "income" ? (
            <>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Income
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
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Your state counts your whole tax household here, so its figure
                may be higher than this one. 42 CFR 435.603(d)-(f).
              </Typography>
            </>
          ) : (
            <>
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
            </>
          )}

          {/* Activity detail lines */}
          {m.activities.length > 0 && (
            <Box component="ul" sx={{ my: 1, pl: 3 }}>
              {m.activities.map((a, i) => (
                <li key={a.id ?? i}>
                  <Typography variant="body2" component="span">
                    {a.date} — {ACTIVITY_TYPE_LABELS[a.type]}
                    {a.type !== "education"
                      ? ` — ${fmtHours(a.hours)} hours`
                      : ""}
                    {a.communityService?.organizationName
                      ? ` — ${a.communityService.organizationName}`
                      : a.organization
                        ? ` — ${a.organization}`
                        : ""}
                  </Typography>
                </li>
              ))}
            </Box>
          )}

          {/* Income detail lines */}
          {m.incomeEntries.length > 0 && (
            <Box component="ul" sx={{ my: 1, pl: 3 }}>
              {m.incomeEntries.map((e, i) => (
                <li key={e.id ?? i}>
                  <Typography variant="body2" component="span">
                    {e.date} — {fmtMoney(e.amount)} received ({e.payPeriod})
                    {e.source ? ` — ${e.source}` : ""}
                  </Typography>
                </li>
              ))}
            </Box>
          )}

          {/* Documentation gap flag (gap 8.3). Text, not colour. */}
          {m.lacksDocumentation && (
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
              {pkg.documentationHardened
                ? "Needs documentation: your state now requires supporting documents for this month when they are reasonably available. Add a photo of a pay stub, letter, or schedule. 42 CFR 435.557(b)(2)."
                : `No documents are attached for this month yet. Your state may require them from ${pkg.documentationRequiredFrom}; adding them now is worth doing. 42 CFR 435.557(b)(2)(i).`}
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
                Screening on{" "}
                {ex.screening.screeningDate instanceof Date
                  ? ex.screening.screeningDate.toLocaleDateString("en-US")
                  : String(ex.screening.screeningDate)}
                {ex.screening.result.exemptionCategory
                  ? ` — category you asked your state to check: ${ex.screening.result.exemptionCategory.replace(/-/g, " ")}`
                  : ""}
                . Your state decides whether an exclusion applies. 42 CFR
                435.554, 435.557(b)(2).
              </Typography>
              {ex.documents.length > 0 && (
                <Typography variant="body2">
                  Supporting documents attached: {ex.documents.length}.
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Document manifest (gap 8.7) */}
      {pkg.manifest.length > 0 && (
        <Box component="section" sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2">
            Document manifest
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            {pkg.manifest.map((entry) => (
              <li key={entry.reference}>
                <Typography variant="body2" component="span">
                  {entry.reference} — {entry.type.replace(/[-_]/g, " ")} —
                  captured {entry.captureDate} — supports {entry.linkedTo}
                </Typography>
              </li>
            ))}
          </Box>
        </Box>
      )}

      {/* Attachments — the actual images */}
      {pkg.manifest.length > 0 && (
        <Box component="section">
          <Typography variant="h6" component="h2">
            Attachments
          </Typography>
          {pkg.manifest.map((entry) => {
            // The manifest reference is "DOC-<id>"; the attachment map is keyed by blobId,
            // resolved by the caller. If an image is not available (not yet loaded, or a
            // text-only context), the manifest line above still records it.
            const url = resolveUrlForReference(entry.reference, attachmentUrls);
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
    </Box>
  );
}

/**
 * The attachment map is keyed by blobId; the manifest reference is "DOC-<documentId>". The
 * caller supplies a map already keyed to match the references it generated, so this is a
 * thin lookup kept separate for testability of the matching convention.
 */
function resolveUrlForReference(
  reference: string,
  urls: Record<number, string>,
): string | undefined {
  const id = Number(reference.replace(/^DOC-/, ""));
  return Number.isNaN(id) ? undefined : urls[id];
}
