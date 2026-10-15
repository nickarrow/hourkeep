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
  type TaggedDocument,
} from "@/lib/export/buildEvidencePackage";
import { FEDERAL_DEFAULT } from "@/lib/policy";
import { PiiWarning } from "@/components/export/PiiWarning";
import { EvidencePackageView } from "@/components/export/EvidencePackageView";
import type { Activity, UserProfile } from "@/types";
import type {
  IncomeEntry,
  ComplianceMode,
  IncomeDocument,
} from "@/types/income";
import type { Document } from "@/types/documents";
import type { ExemptionScreening } from "@/types/exemptions";

type Stage = "loading" | "empty" | "error" | "warning" | "ready";

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

/**
 * The lightweight metadata loaded on mount — enough to decide the empty state and the
 * default month scope WITHOUT decoding any blob. Blobs are loaded only after the user
 * confirms the PII warning and for the selected months only (semantic review #3).
 */
interface LoadedMeta {
  profile: UserProfile;
  activities: Activity[];
  incomeEntries: IncomeEntry[];
  complianceModes: ComplianceMode[];
  activityDocuments: Document[];
  incomeDocuments: IncomeDocument[];
  exclusionScreenings: ExemptionScreening[];
  exclusionDocuments: Document[];
  /** Every month that has an activity or income record, newest first. */
  recordMonths: string[];
}

export default function EvidencePackagePage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<LoadedMeta | null>(null);

  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  const [pkg, setPkg] = useState<EvidencePackage | null>(null);
  const [attachmentUrls, setAttachmentUrls] = useState<Record<string, string>>(
    {},
  );

  // Metadata-only load. No blob is decoded here, so narrowing the period later genuinely
  // reduces memory cost, and nothing is decrypted-and-held before consent.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const profiles = await db.profiles.toArray();
        if (profiles.length === 0) {
          if (!cancelled) setStage("empty");
          return;
        }
        const profile = await getProfile(profiles[0].id);
        if (!profile) {
          if (!cancelled) setStage("empty");
          return;
        }
        const activities = await db.activities.toArray();
        const incomeEntries = await db.incomeEntries.toArray();
        const complianceModes = await db.complianceModes.toArray();
        const allDocs = await db.documents.toArray();
        const incomeDocuments = await db.incomeDocuments.toArray();
        const exclusionScreenings = await db.exemptions.toArray();

        const exclusionDocuments = allDocs.filter(
          (d) => d.exemptionId !== undefined,
        );
        const activityDocuments = allDocs.filter(
          (d) => d.exemptionId === undefined,
        );

        const monthSet = new Set<string>();
        activities.forEach((a) => monthSet.add(a.date.substring(0, 7)));
        incomeEntries.forEach((i) => monthSet.add(i.date.substring(0, 7)));
        const recordMonths = Array.from(monthSet).sort().reverse();

        // Exclusion-only evidence must be able to open the package (semantic review #7):
        // the empty stage requires BOTH no record months AND no exclusion material.
        const hasAnything =
          recordMonths.length > 0 ||
          exclusionScreenings.length > 0 ||
          exclusionDocuments.length > 0;

        if (cancelled) return;
        if (!hasAnything) {
          setStage("empty");
          return;
        }
        setMeta({
          profile,
          activities,
          incomeEntries,
          complianceModes,
          activityDocuments,
          incomeDocuments,
          exclusionScreenings,
          exclusionDocuments,
          recordMonths,
        });
        setStage("warning");
      } catch (e) {
        console.error("Error loading evidence package data:", e);
        if (!cancelled) {
          setError("Failed to load your records. Please try again.");
          setStage("error");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Object URLs created for the current package; revoked when the package is rebuilt or the
  // component unmounts (semantic review #14 — no leak, no cross-run overwrite).
  useEffect(() => {
    const urls = Object.values(attachmentUrls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [attachmentUrls]);

  const defaultMonths = useMemo(() => meta?.recordMonths ?? [], [meta]);

  async function assemble(months: string[]) {
    if (!meta) return;
    const scope = new Set(months);

    // Evaluate every selected month. Required (no fallback) — the export must not print a
    // pre-evaluation total (semantic review #10).
    const evaluations: Record<string, MonthEvaluation> = {};
    for (const month of months) {
      evaluations[month] = await evaluateMonth({
        month,
        userId: meta.profile.id,
        activities: meta.activities,
        policy: FEDERAL_DEFAULT,
      });
    }

    // Scope documents to the selected months (semantic review #3). Activity docs by their
    // activity's month; income docs by their entry's month; exclusion docs are always
    // included (they are not month-scoped evidence).
    const activityMonth = new Map<number, string>();
    meta.activities.forEach((a) => {
      if (a.id !== undefined) activityMonth.set(a.id, a.date.substring(0, 7));
    });
    const incomeMonth = new Map<number, string>();
    meta.incomeEntries.forEach((i) => {
      if (i.id !== undefined) incomeMonth.set(i.id, i.date.substring(0, 7));
    });

    const taggedDocuments: TaggedDocument[] = [];
    for (const doc of meta.activityDocuments) {
      if (
        doc.activityId !== undefined &&
        scope.has(activityMonth.get(doc.activityId) ?? "")
      ) {
        taggedDocuments.push({ kind: "activity", doc });
      }
    }
    for (const doc of meta.incomeDocuments) {
      const entryId = doc.incomeEntryId;
      if (entryId !== undefined && scope.has(incomeMonth.get(entryId) ?? "")) {
        taggedDocuments.push({ kind: "income", doc });
      }
    }
    for (const doc of meta.exclusionDocuments) {
      taggedDocuments.push({ kind: "exclusion", doc });
    }

    // Load blobs ONLY for the scoped documents, keyed by the same namespaced reference the
    // package mints (semantic review #1 + #3).
    const urls: Record<string, string> = {};
    for (const t of taggedDocuments) {
      if (t.doc.id === undefined) continue;
      const prefix =
        t.kind === "activity" ? "ACT" : t.kind === "income" ? "INC" : "EXC";
      const reference = `${prefix}-${t.doc.id}`;
      const blob =
        t.kind === "income"
          ? await db.incomeDocumentBlobs.get(t.doc.blobId)
          : await db.documentBlobs.get(t.doc.blobId);
      if (blob?.blob) {
        urls[reference] = URL.createObjectURL(blob.blob);
      }
    }

    const built = buildEvidencePackage({
      profile: meta.profile,
      months,
      evaluations,
      activities: meta.activities,
      incomeEntries: meta.incomeEntries,
      complianceModes: meta.complianceModes,
      taggedDocuments,
      exclusionScreenings: meta.exclusionScreenings,
      policy: FEDERAL_DEFAULT,
    });

    // Replacing attachmentUrls triggers the revoke effect for the previous set.
    setAttachmentUrls(urls);
    setPkg(built);
  }

  async function handleConfirmWarning() {
    await assemble(defaultMonths);
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
          <Paper sx={{ p: 2, mb: 3, "@media print": { display: "none" } }}>
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
