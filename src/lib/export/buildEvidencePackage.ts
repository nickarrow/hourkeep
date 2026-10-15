/**
 * The evidence package — W8a, ADR-0006.
 *
 * Assembles the period-scoped package a user hands to their state, as PLAIN DATA that a
 * React print surface renders. Pure: no Dexie, no DOM, no React. The caller loads the
 * records (and decrypts the profile via `getProfile`, and runs `evaluateMonth` per month)
 * and passes them in; this function partitions and shapes them. Keeping assembly here, out
 * of the component, is what makes the package testable — the lesson W2a's `buildTextReport`
 * extraction encodes.
 *
 * NO VERDICT (ADR-0003). The package carries Logged / Threshold / Difference and an
 * apparent-pathway label with its citation. It never says "compliant", and the legend names
 * the state as the decider. A test serialises the whole package and runs it through
 * `findVerdictPhrases`.
 *
 * CFR anchors resolved from `docs/domain/cms-2454-ifc/2026-11094.txt`:
 *   - submission channels — 42 CFR 435.907(a), 91 FR 33381
 *   - documentation hardening (Jan 1 2028, per-state) — 42 CFR 435.557(b)(2)(i)-(iii), 91 FR 33395
 *   - the state decides; appealable — 42 CFR 435.556, 431.220(a)(1), 91 FR 33473
 */

import { format } from "date-fns";

import type { Activity, UserProfile } from "@/types";
import type { IncomeEntry } from "@/types/income";
import type { Document } from "@/types/documents";
import type { ExemptionScreening } from "@/types/exemptions";
import type { MonthEvaluation } from "@/lib/evaluateMonth";
import { FEDERAL_DEFAULT, type PolicyProfile } from "@/lib/policy";

export interface EvidencePackageInput {
  /** Decrypted profile — the caller used `getProfile`, never `db.profiles` (gap 8.8). */
  profile: UserProfile;
  /** The `YYYY-MM` months in the selected review period or range, any order. */
  months: string[];
  /** Per-month computed facts from the single evaluation path. */
  evaluations: Record<string, MonthEvaluation>;
  activities: Activity[];
  incomeEntries: IncomeEntry[];
  /** Activity documents (metadata only; blobs are fetched by the render surface). */
  documents: Document[];
  /** Income documents (metadata only). */
  incomeDocuments: Document[];
  /** The user's exclusion screenings in scope. */
  exclusionScreenings: ExemptionScreening[];
  /** Documents linked to exclusion screenings (metadata only) — gap 8.5. */
  exclusionDocuments: Document[];
  policy?: PolicyProfile;
  /** Injected so output is deterministic under test. */
  generatedAt?: Date;
}

export interface PackageCover {
  name: string;
  state: string;
  medicaidId?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  email?: string;
  coverageMonths: string[];
  reportDate: string;
}

export interface PackageMonth {
  month: string;
  label: string;
  mode: "hours" | "income";
  hours: { logged: number; threshold: number; difference: number };
  income: {
    logged: number;
    threshold: number;
    difference: number;
    isSeasonalWorker: boolean;
    seasonalAverage?: number;
    seasonalHistory?: Array<{ month: string; total: number; hasData: boolean }>;
  };
  /** The month's activities, for the detail lines. */
  activities: Activity[];
  /** The month's income entries, for the detail lines. */
  incomeEntries: IncomeEntry[];
  documentCount: number;
  /** True when the month has activity/income records but no supporting documents (gap 8.3). */
  lacksDocumentation: boolean;
}

export interface ManifestEntry {
  reference: string;
  type: string;
  captureDate: string;
  /** Human description of what this document supports. */
  linkedTo: string;
}

export interface PackageExclusion {
  screening: ExemptionScreening;
  documents: Document[];
}

export interface EvidencePackage {
  cover: PackageCover;
  months: PackageMonth[];
  manifest: ManifestEntry[];
  exclusions: PackageExclusion[];
  /** 42 CFR 435.907(a): the channels the state must accept. From the profile. */
  submissionModalities: PolicyProfile["submissionModalities"];
  /** 42 CFR 435.557(b)(2)(ii): the per-state date documentation becomes required. */
  documentationRequiredFrom: string;
  /** True once `generatedAt` has reached `documentationRequiredFrom` — drives 8.3 prominence. */
  documentationHardened: boolean;
  /** Framing lines; the legend names the state as the decider (ADR-0003). */
  legend: string[];
}

/** `YYYY-MM` for a date string, without constructing a Date. */
function monthKey(isoDate: string): string {
  return isoDate.substring(0, 7);
}

function monthLabel(month: string): string {
  return format(new Date(month + "-01T00:00:00"), "MMMM yyyy");
}

/** A stable, human-readable reference for an attachment, e.g. "DOC-12". */
function documentReference(doc: Document): string {
  return `DOC-${doc.id ?? "new"}`;
}

/**
 * The income-entry foreign key on an income document.
 *
 * Income documents are passed in typed as `Document` for a uniform manifest, but their
 * foreign key is `incomeEntryId` (an `IncomeDocument` field), not `activityId`. Read it
 * defensively rather than widen the shared `Document` type with a key that only income
 * documents carry.
 */
function incomeEntryIdOf(doc: Document): number | undefined {
  return (doc as { incomeEntryId?: number }).incomeEntryId;
}

export function buildEvidencePackage(
  input: EvidencePackageInput,
): EvidencePackage {
  const {
    profile,
    months,
    evaluations,
    activities,
    incomeEntries,
    documents,
    incomeDocuments,
    exclusionScreenings,
    exclusionDocuments,
    policy = FEDERAL_DEFAULT,
    generatedAt = new Date(),
  } = input;

  // Newest month first, matching the text report's ordering.
  const sortedMonths = [...months].sort().reverse();

  // Documents a given month "has" — activity docs whose activity falls in the month, plus
  // income docs whose entry falls in the month. Build id→month maps once.
  const activityMonthById = new Map<number, string>();
  activities.forEach((a) => {
    if (a.id !== undefined) activityMonthById.set(a.id, monthKey(a.date));
  });
  const incomeMonthById = new Map<number, string>();
  incomeEntries.forEach((i) => {
    if (i.id !== undefined) incomeMonthById.set(i.id, monthKey(i.date));
  });

  // How many documents support a month: activity documents whose activity is in the month,
  // plus income documents whose linked entry is in the month. Activity documents link by
  // `activityId`; income documents link by `incomeEntryId` (a field on IncomeDocument that
  // the uniform Document shape does not declare, so it is read defensively).
  function documentsInMonth(month: string): number {
    const activityDocs = documents.filter(
      (d) =>
        d.activityId !== undefined &&
        activityMonthById.get(d.activityId) === month,
    ).length;
    const incomeDocs = incomeDocuments.filter((d) => {
      const entryId = incomeEntryIdOf(d);
      return entryId !== undefined && incomeMonthById.get(entryId) === month;
    }).length;
    return activityDocs + incomeDocs;
  }

  const packageMonths: PackageMonth[] = sortedMonths.map((month) => {
    const evaluation = evaluations[month];
    const monthActivities = activities
      .filter((a) => monthKey(a.date) === month)
      .sort((a, b) => a.date.localeCompare(b.date));
    const monthIncome = incomeEntries
      .filter((i) => monthKey(i.date) === month)
      .sort((a, b) => a.date.localeCompare(b.date));

    const hoursTotal = evaluation?.hours.totalHours ?? 0;
    const hoursThreshold = evaluation?.thresholds.hours ?? policy.requiredHours;

    const isSeasonal = evaluation?.income.isSeasonalWorker ?? false;
    const seasonalAverage = evaluation?.income.seasonalAverage;
    const incomeTotal = evaluation?.income.totalIncome ?? 0;
    const comparedIncome =
      isSeasonal && seasonalAverage !== undefined
        ? seasonalAverage
        : incomeTotal;
    const incomeThresholdValue = evaluation?.thresholds.income ?? 0;

    const documentCount = documentsInMonth(month);
    const hasRecords = monthActivities.length > 0 || monthIncome.length > 0;

    // A month with records but no documents is flagged (gap 8.3). A month with no records
    // at all is not "lacking documentation" — there is nothing to document.
    const lacksDocumentation = hasRecords && documentCount === 0;

    return {
      month,
      label: monthLabel(month),
      // The mode is derived from where the records are; the package shows both comparisons
      // when present, but names the one the month was tracked under.
      mode:
        monthIncome.length > 0 && monthActivities.length === 0
          ? "income"
          : "hours",
      hours: {
        logged: hoursTotal,
        threshold: hoursThreshold,
        difference: Math.max(0, hoursThreshold - hoursTotal),
      },
      income: {
        logged: comparedIncome,
        threshold: incomeThresholdValue,
        difference: Math.max(0, incomeThresholdValue - comparedIncome),
        isSeasonalWorker: isSeasonal,
        seasonalAverage,
        seasonalHistory: evaluation?.income.seasonalHistory,
      },
      activities: monthActivities,
      incomeEntries: monthIncome,
      documentCount,
      lacksDocumentation,
    };
  });

  // Manifest: every document in scope, with a stable reference and what it supports.
  const manifest: ManifestEntry[] = [];
  for (const doc of documents) {
    manifest.push({
      reference: documentReference(doc),
      type: doc.customType ?? doc.type,
      captureDate: format(doc.createdAt, "MMM d, yyyy"),
      linkedTo:
        doc.activityId !== undefined
          ? `activity (${activityMonthById.get(doc.activityId) ?? "unknown month"})`
          : "activity",
    });
  }
  for (const doc of incomeDocuments) {
    const entryId = incomeEntryIdOf(doc);
    manifest.push({
      reference: documentReference(doc),
      type: doc.customType ?? doc.type,
      captureDate: format(doc.createdAt, "MMM d, yyyy"),
      linkedTo:
        entryId !== undefined
          ? `income entry (${incomeMonthById.get(entryId) ?? "unknown month"})`
          : "income entry",
    });
  }
  for (const doc of exclusionDocuments) {
    manifest.push({
      reference: documentReference(doc),
      type: doc.customType ?? doc.type,
      captureDate: format(doc.createdAt, "MMM d, yyyy"),
      linkedTo: "exclusion response",
    });
  }

  // Exclusions, each with its attached documents.
  const exclusions: PackageExclusion[] = exclusionScreenings.map(
    (screening) => ({
      screening,
      documents: exclusionDocuments.filter(
        (d) => d.exemptionId === screening.id,
      ),
    }),
  );

  const documentationHardened =
    generatedAt >= new Date(policy.documentationRequiredFrom + "T00:00:00");

  return {
    cover: {
      name: profile.name,
      state: profile.state,
      medicaidId: profile.medicaidId || undefined,
      dateOfBirth: profile.dateOfBirth || undefined,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      coverageMonths: sortedMonths,
      reportDate: format(generatedAt, "MMMM d, yyyy"),
    },
    months: packageMonths,
    manifest,
    exclusions,
    submissionModalities: policy.submissionModalities,
    documentationRequiredFrom: policy.documentationRequiredFrom,
    documentationHardened,
    // ADR-0003: the package reports what was logged and names the state as the decider.
    // Wording avoids every banned verdict phrase; "your state decides" is the allowed form
    // from compliance-copy-standards.md.
    legend: [
      "This is a personal record of what you logged. It is not a determination.",
      "Your state decides whether the community engagement requirement is met, and it must check its own records first before asking you for anything. 42 CFR 435.556, 435.557(a)-(b).",
      "If your state makes a decision you disagree with, you can appeal it. 42 CFR 431.220(a)(1).",
    ],
  };
}
