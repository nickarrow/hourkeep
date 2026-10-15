"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

import { db } from "@/lib/db";
import { getProfile } from "@/lib/storage/profile";
import { evaluateMonth, type MonthEvaluation } from "@/lib/evaluateMonth";
import {
  buildEvidencePackage,
  type EvidencePackage,
} from "@/lib/export/buildEvidencePackage";
import { FEDERAL_DEFAULT } from "@/lib/policy";
import { PiiWarning } from "@/components/export/PiiWarning";
import { EvidencePackageView } from "@/components/export/EvidencePackageView";
import type { Activity, UserProfile } from "@/types";
import type { IncomeEntry } from "@/types/income";
import type { Document } from "@/types/documents";
import type { ExemptionScreening } from "@/types/exemptions";

type Stage = "loading" | "empty" | "error" | "warning" | "ready";

/** All months that have a record, newest first — the default scope. */
function monthsFromRecords(
  activities: Activity[],
  incomeEntries: IncomeEntry[],
): string[] {
  const set = new Set<string>();
  activities.forEach((a) => set.add(a.date.substring(0, 7)));
  incomeEntries.forEach((i) => set.add(i.date.substring(0, 7)));
  return Array.from(set).sort().reverse();
}

/** Inclusive list of YYYY-MM between two months, or [] if the range is invalid. */
function monthRange(from: string, to: string): string[] {
  if (!/^\d{4}-\d{2}$/.test(from) || !/^\d{4}-\d{2}$/.test(to)) return [];
  const start = from <= to ? from : to;
  const end = from <= to ? to : from;
  const out: string[] = [];
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  let y = sy;
  let m = sm;
  // Guard against a runaway loop on malformed input.
  for (let i = 0; i < 240; i++) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    if (y === ey && m === em) break;
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

export default function EvidencePackagePage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile | undefined>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [incomeDocuments, setIncomeDocuments] = useState<Document[]>([]);
  const [exclusionScreenings, setExclusionScreenings] = useState<
    ExemptionScreening[]
  >([]);
  const [exclusionDocuments, setExclusionDocuments] = useState<Document[]>([]);
  const [attachmentUrls, setAttachmentUrls] = useState<Record<number, string>>(
    {},
  );

  const recordMonths = useMemo(
    () => monthsFromRecords(activities, incomeEntries),
    [activities, incomeEntries],
  );
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  const [pkg, setPkg] = useState<EvidencePackage | null>(null);

  useEffect(() => {
    const revoked: string[] = [];
    async function load() {
      try {
        const profiles = await db.profiles.toArray();
        if (profiles.length === 0) {
          setStage("empty");
          return;
        }
        // Decrypt via getProfile — never read db.profiles for display (gap 8.8, ADR-0006).
        const decrypted = await getProfile(profiles[0].id);
        const allActivities = await db.activities.toArray();
        const allIncome = await db.incomeEntries.toArray();
        const allDocs = await db.documents.toArray();
        const allIncomeDocs = await db.incomeDocuments.toArray();
        const screenings = await db.exemptions.toArray();

        // Documents carrying an exemptionId are exclusion documents (gap 8.5); the rest are
        // activity documents.
        const exclusionDocs = allDocs.filter(
          (d) => d.exemptionId !== undefined,
        );
        const activityDocs = allDocs.filter((d) => d.exemptionId === undefined);

        // Income documents are typed with incomeEntryId; the package reads it defensively,
        // so pass them straight through as Document for a uniform manifest.
        const incomeDocsAsDocuments = allIncomeDocs as unknown as Document[];

        // Resolve attachment image URLs, keyed by document id (the manifest reference).
        const urls: Record<number, string> = {};
        for (const doc of activityDocs) {
          if (doc.id === undefined) continue;
          const blob = await db.documentBlobs.get(doc.blobId);
          if (blob?.blob) {
            const url = URL.createObjectURL(blob.blob);
            urls[doc.id] = url;
            revoked.push(url);
          }
        }
        for (const doc of exclusionDocs) {
          if (doc.id === undefined) continue;
          const blob = await db.documentBlobs.get(doc.blobId);
          if (blob?.blob) {
            const url = URL.createObjectURL(blob.blob);
            urls[doc.id] = url;
            revoked.push(url);
          }
        }
        for (const doc of incomeDocsAsDocuments) {
          if (doc.id === undefined) continue;
          const blob = await db.incomeDocumentBlobs.get(doc.blobId);
          if (blob?.blob) {
            const url = URL.createObjectURL(blob.blob);
            urls[doc.id] = url;
            revoked.push(url);
          }
        }

        setProfile(decrypted);
        setActivities(allActivities);
        setIncomeEntries(allIncome);
        setDocuments(activityDocs);
        setIncomeDocuments(incomeDocsAsDocuments);
        setExclusionScreenings(screenings);
        setExclusionDocuments(exclusionDocs);
        setAttachmentUrls(urls);

        if (allActivities.length === 0 && allIncome.length === 0) {
          setStage("empty");
        } else {
          setStage("warning");
        }
      } catch (e) {
        console.error("Error loading evidence package data:", e);
        setError("Failed to load your records. Please try again.");
        setStage("error");
      }
    }
    load();
    return () => {
      revoked.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  async function assemble(months: string[]) {
    if (!profile) return;
    const evaluations: Record<string, MonthEvaluation> = {};
    for (const month of months) {
      evaluations[month] = await evaluateMonth({
        month,
        userId: profile.id,
        activities,
        policy: FEDERAL_DEFAULT,
      });
    }
    setPkg(
      buildEvidencePackage({
        profile,
        months,
        evaluations,
        activities,
        incomeEntries,
        documents,
        incomeDocuments,
        exclusionScreenings,
        exclusionDocuments,
        policy: FEDERAL_DEFAULT,
      }),
    );
  }

  async function handleConfirmWarning() {
    const months =
      rangeFrom && rangeTo ? monthRange(rangeFrom, rangeTo) : recordMonths;
    await assemble(months.length > 0 ? months : recordMonths);
    setStage("ready");
  }

  async function handleApplyRange() {
    const months = monthRange(rangeFrom, rangeTo);
    if (months.length === 0) return;
    await assemble(months);
  }

  if (stage === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress aria-label="Loading your records" />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* The controls are hidden on print, so only the record itself prints. */}
      <Box sx={{ mb: 3, "@media print": { display: "none" } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/export")}
          sx={{ mb: 2 }}
        >
          Back to Export
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Evidence Package
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A record you can print, save as a PDF, or fax to your state.
        </Typography>
      </Box>

      {stage === "empty" && (
        <Alert severity="info" sx={{ "@media print": { display: "none" } }}>
          You don&apos;t have any records yet. Log some activities or income
          first, then come back to build a package.
        </Alert>
      )}

      {stage === "error" && (
        <Alert severity="error" sx={{ "@media print": { display: "none" } }}>
          {error}
        </Alert>
      )}

      {stage === "warning" && (
        <Paper sx={{ p: 3, "@media print": { display: "none" } }}>
          <PiiWarning
            onConfirm={handleConfirmWarning}
            onCancel={() => router.push("/export")}
          />
        </Paper>
      )}

      {stage === "ready" && pkg && (
        <>
          <Paper
            sx={{
              p: 2,
              mb: 3,
              "@media print": { display: "none" },
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Choose the months to include
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              By default this covers every month you have a record for. To pick
              a specific range, set the first and last month.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
              <TextField
                label="From"
                type="month"
                value={rangeFrom}
                onChange={(e) => setRangeFrom(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="To"
                type="month"
                value={rangeTo}
                onChange={(e) => setRangeTo(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <Button
                variant="outlined"
                onClick={handleApplyRange}
                disabled={!rangeFrom || !rangeTo}
              >
                Apply range
              </Button>
            </Box>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
            >
              Print or save as PDF
            </Button>
          </Paper>

          <Paper sx={{ p: { xs: 2, sm: 4 } }}>
            <EvidencePackageView pkg={pkg} attachmentUrls={attachmentUrls} />
          </Paper>
        </>
      )}
    </Container>
  );
}
