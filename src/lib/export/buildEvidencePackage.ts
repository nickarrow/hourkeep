/**
 * The evidence package — W8a, ADR-0006.
 *
 * Assembles the period-scoped package a user hands to their state, as PLAIN DATA that a
 * React print surface renders. Pure: no Dexie, no DOM, no React. The caller loads the
 * records (decrypts the profile via `getProfile`, runs `evaluateMonth` per month, and
 * SCOPES documents/screenings to the selected months) and passes them in; this function
 * partitions and shapes them. Keeping assembly here, out of the component, is what makes the
 * package testable — the lesson W2a's `buildTextReport` extraction encodes.
 *
 * NO VERDICT (ADR-0003). The package carries Logged / Threshold / Difference and an
 * apparent-pathway label with its citation. It never says "compliant", and the legend names
 * the state as the decider. A test serialises the whole package and runs it through
 * `findVerdictPhrases`.
 *
 * BOTH COMPARISONS WHEN BOTH EXIST (semantic review #2/#3, gap 8.9). A month holding both
 * hours and income records carries both neutral comparisons; the stored `ComplianceMode`
 * (passed in, same source the text report reads) is a LABEL of what the month was tracked
 * under, not a filter that hides the other. Seasonal status modifies only the income block.
 * This stops the "one mode per month" clause of gap 8.9 recurring on the new surface.
 *
 * CFR anchors resolved from `docs/domain/cms-2454-ifc/2026-11094.txt`. FR pages are the
 * regulatory text where it exists (regulatory beats preamble — engineering-standards.md):
 *   - submission channels — 42 CFR 435.907(a); enumeration at 91 FR 33396 (preamble; the
 *     regulatory cross-reference is § 435.557(b)(4), 91 FR 33474)
 *   - documentation hardening (Jan 1 2028, per-state) — 42 CFR 435.557(b)(2)(i)-(iii),
 *     91 FR 33474-33475 (regulatory text; the policy module cites the same)
 *   - the state decides — 42 CFR 435.556, 91 FR 33473; appealable — 42 CFR 431.220(a)(1),
 *     91 FR 33392 (preamble; the regulation is pre-existing and not re-published in the IFC)
 */

import { format } from "date-fns";

import type { Activity, UserProfile } from "@/types";
import type { IncomeEntry, ComplianceMode } from "@/types/income";
import type { ExemptionScreening } from "@/types/exemptions";
import type { MonthEvaluation } from "@/lib/evaluateMonth";
import {
  FEDERAL_DEFAULT,
  incomeThreshold,
  type PolicyProfile,
} from "@/lib/policy";
import { ACTIVITY_TYPE_LABELS } from "@/lib/activityDisplay";

/**
 * A document in the package, tagged with the evidence family it came from.
 *
 * The two document tables (`db.documents`, `db.incomeDocuments`) have INDEPENDENT
 * auto-increment keys, so a bare `id` is not unique across them — the semantic review's
 * headline finding (#1): `DOC-1` could mean an activity pay-stub or an income pay-stub, and
 * the agency artifact would render one image twice and drop the other. The `kind` tag makes
 * the manifest reference (`ACT-1`/`INC-1`/`EXC-1`) and the attachment URL key unique.
 */
export type EvidenceDocKind = "activity" | "income" | "exclusion";

/**
 * The document fields the package reads, common to `Document` and `IncomeDocument`.
 *
 * A structural subset rather than `Document`, because income documents are `IncomeDocument`
 * (a different `type` union and an `incomeEntryId` foreign key). The two families share these
 * fields, so a structural type lets both flow into one manifest without a cast — fixing the
 * `as unknown as Document[]` the semantic review flagged (#17).
 */
export interface PackageDocument {
  id?: number;
  type: string;
  customType?: string;
  createdAt: Date;
  blobId: number;
  activityId?: number;
  exemptionId?: number;
  incomeEntryId?: number;
}

export interface TaggedDocument {
  kind: EvidenceDocKind;
  doc: PackageDocument;
}

export interface EvidencePackageInput {
  /** Decrypted profile — the caller used `getProfile`, never `db.profiles` (gap 8.8). */
  profile: UserProfile;
  /** The `YYYY-MM` months in the selected review period or range, any order. */
  months: string[];
  /** Per-month computed facts from the single evaluation path. */
  evaluations: Record<string, MonthEvaluation>;
  activities: Activity[];
  incomeEntries: IncomeEntry[];
  /**
   * Stored per-month compliance mode — the SAME source `buildTextReport` reads, so the two
   * exports cannot disagree about how a month was tracked (semantic review #4).
   */
  complianceModes: ComplianceMode[];
  /**
   * Documents in scope, each tagged with its evidence family (semantic review #1). The
   * caller scopes these to the selected months before passing them (semantic review #3) —
   * this function does not re-scope by date, it trusts the input is already in-range.
   */
  taggedDocuments: TaggedDocument[];
  /** The user's exclusion screenings in scope. */
  exclusionScreenings: ExemptionScreening[];
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

/** One agency-facing detail line for an activity, built from the W6a-corrected shape. */
export interface ActivityDetail {
  date: string;
  typeLabel: string;
  /** The evidence line: hours, enrollment status + credits, work sub-kind, etc. */
  detail: string;
  /** Community-service verification fields, present only for a volunteer record. */
  communityService?: {
    organizationName?: string;
    organizationAddress?: string;
    activityDescription?: string;
    pointOfContact?: string;
    courtOrdered: boolean;
  };
}

export interface IncomeDetail {
  date: string;
  amount: number;
  payPeriod: string;
  source?: string;
}

export interface PackageMonth {
  month: string;
  label: string;
  /** How the user recorded the month, from the stored ComplianceMode. A label, not a filter. */
  recordedAs: "hours" | "income";
  /** True when the month holds any activity record. */
  hasHoursRecords: boolean;
  /** True when the month holds any income record. */
  hasIncomeRecords: boolean;
  hours: { logged: number; threshold: number; difference: number };
  income: {
    logged: number;
    threshold: number;
    difference: number;
    isSeasonalWorker: boolean;
    seasonalAverage?: number;
    seasonalWindowMonths: number;
    seasonalHistory?: Array<{
      month: string;
      label: string;
      total: number;
      hasData: boolean;
    }>;
  };
  activityDetails: ActivityDetail[];
  incomeDetails: IncomeDetail[];
  documentCount: number;
  /** True when the month has activity/income records but no supporting documents (gap 8.3). */
  lacksDocumentation: boolean;
}

export interface ManifestEntry {
  /** Namespaced, unique across tables — `ACT-1` / `INC-1` / `EXC-1`. */
  reference: string;
  type: string;
  captureDate: string;
  /** Human description of what this document supports. */
  linkedTo: string;
}

export interface PackageExclusion {
  screening: ExemptionScreening;
  /** `category` is the only field safe to surface from `result` — see note in the renderer. */
  category?: string;
  screeningDate: string;
  documents: ManifestEntry[];
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
  /**
   * How much the state-policy values in this package can be trusted. When the app is on the
   * federal floor (no resolved state profile), state ELECTIONS printed on the artifact
   * (seasonal window, documentation-hardening date) are assumptions, not the user's actual
   * state's policy — so the page hedges them (semantic review #11; ADR-0001 Conditional).
   */
  policyConfidence: PolicyProfile["confidence"];
  policyLabel: string;
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

function shortMonthLabel(month: string): string {
  return format(new Date(month + "-01T00:00:00"), "MMM yyyy");
}

function longDate(iso: string): string {
  return format(new Date(iso + "T00:00:00"), "MMM d, yyyy");
}

/** Namespaced, table-unique reference for a tagged document (semantic review #1). */
function documentReference(
  kind: EvidenceDocKind,
  doc: PackageDocument,
): string {
  const prefix =
    kind === "activity" ? "ACT" : kind === "income" ? "INC" : "EXC";
  return `${prefix}-${doc.id ?? "new"}`;
}

/**
 * One agency-facing detail line for an activity — W6a's corrected record shape.
 *
 * The caseworker reads this, so the structured evidence W6a captured must appear or it is
 * lost (semantic review #5): the half-time cliff reads as enrollment, less-than-half-time
 * shows its credits, work shows its sub-kind, and community service carries its verification
 * fields. Mirrors `renderActivityDetail` in `buildTextReport.ts` so the two surfaces cannot
 * drift. 42 CFR 435.552(b)-(d), 91 FR 33470-33471; § II.I.6.b, 91 FR 33400.
 */
function activityDetail(activity: Activity): ActivityDetail {
  const typeLabel = ACTIVITY_TYPE_LABELS[activity.type];
  const parts: string[] = [];

  if (activity.type === "education") {
    switch (activity.enrollmentStatus) {
      case "at-least-half-time":
        parts.push("enrolled at least half-time (counts on its own)");
        break;
      case "less-than-half-time":
        if (activity.creditHours !== undefined) {
          parts.push(
            `${activity.creditHours} credit hours (less than half-time)`,
          );
        } else if (activity.nonCreditHours !== undefined) {
          parts.push(
            `${activity.nonCreditHours} class/activity hours (less than half-time)`,
          );
        } else {
          parts.push("less than half-time");
        }
        break;
      case "unknown":
        parts.push("enrollment status to confirm with the school");
        break;
      default:
        parts.push(`${activity.hours} hours`);
    }
    if (activity.educationProgramType) {
      parts.push(activity.educationProgramType.replace(/-/g, " "));
    }
  } else {
    parts.push(`${activity.hours} hours`);
    if (activity.type === "work" && activity.workKind) {
      parts.push(`${activity.workKind} work`);
    }
  }

  let communityService: ActivityDetail["communityService"];
  if (activity.type === "volunteer" && activity.communityService) {
    const cs = activity.communityService;
    const poc = [
      cs.pointOfContactName,
      cs.pointOfContactPhone,
      cs.pointOfContactEmail,
    ]
      .filter(Boolean)
      .join(", ");
    communityService = {
      organizationName: cs.organizationName,
      organizationAddress: cs.organizationAddress,
      activityDescription: cs.activityDescription,
      pointOfContact: poc || undefined,
      courtOrdered: Boolean(cs.courtOrdered),
    };
  } else if (activity.organization) {
    parts.push(activity.organization);
  }

  return {
    date: longDate(activity.date),
    typeLabel,
    detail: parts.join(" — "),
    communityService,
  };
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
    complianceModes,
    taggedDocuments,
    exclusionScreenings,
    policy = FEDERAL_DEFAULT,
    generatedAt = new Date(),
  } = input;

  // Newest month first, matching the text report's ordering.
  const sortedMonths = [...months].sort().reverse();

  const activityMonthById = new Map<number, string>();
  activities.forEach((a) => {
    if (a.id !== undefined) activityMonthById.set(a.id, monthKey(a.date));
  });
  const incomeMonthById = new Map<number, string>();
  incomeEntries.forEach((i) => {
    if (i.id !== undefined) incomeMonthById.set(i.id, monthKey(i.date));
  });

  // The seasonal window length from the profile, never a literal (semantic review #13;
  // ADR-0001). Both arms of the discriminated union carry a span.
  const seasonalWindowMonths =
    policy.seasonalMethod.kind === "preceding-average"
      ? policy.seasonalMethod.months
      : policy.seasonalMethod.windowMonths;

  function documentsInMonth(month: string): number {
    return taggedDocuments.filter((t) => {
      if (t.kind === "activity") {
        return (
          t.doc.activityId !== undefined &&
          activityMonthById.get(t.doc.activityId) === month
        );
      }
      if (t.kind === "income") {
        const entryId = t.doc.incomeEntryId;
        return entryId !== undefined && incomeMonthById.get(entryId) === month;
      }
      return false; // exclusion documents are not month-scoped
    }).length;
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
    const incomeThresholdValue =
      evaluation?.thresholds.income ?? incomeThreshold(policy);

    const documentCount = documentsInMonth(month);
    const hasRecords = monthActivities.length > 0 || monthIncome.length > 0;
    const lacksDocumentation = hasRecords && documentCount === 0;

    // The stored mode is the SAME source the text report reads (semantic review #4).
    const modeRecord = complianceModes.find(
      (m) => m.month === month && m.userId === profile.id,
    );
    const recordedAs = modeRecord?.mode ?? "hours";

    return {
      month,
      label: monthLabel(month),
      recordedAs,
      hasHoursRecords: monthActivities.length > 0,
      hasIncomeRecords: monthIncome.length > 0,
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
        seasonalWindowMonths,
        seasonalHistory: evaluation?.income.seasonalHistory?.map((h) => ({
          month: h.month,
          label: shortMonthLabel(h.month),
          total: h.total,
          hasData: h.hasData,
        })),
      },
      activityDetails: monthActivities.map(activityDetail),
      incomeDetails: monthIncome.map((e) => ({
        date: longDate(e.date),
        amount: e.amount,
        payPeriod: e.payPeriod,
        source: e.source,
      })),
      documentCount,
      lacksDocumentation,
    };
  });

  // Manifest: every in-scope document, with a namespaced reference and what it supports.
  function manifestEntry(tagged: TaggedDocument): ManifestEntry {
    const { kind, doc } = tagged;
    let linkedTo: string;
    if (kind === "activity") {
      linkedTo =
        doc.activityId !== undefined
          ? `activity (${activityMonthById.get(doc.activityId) ?? "unknown month"})`
          : "activity";
    } else if (kind === "income") {
      const entryId = doc.incomeEntryId;
      linkedTo =
        entryId !== undefined
          ? `income entry (${incomeMonthById.get(entryId) ?? "unknown month"})`
          : "income entry";
    } else {
      linkedTo = "exclusion response";
    }
    return {
      reference: documentReference(kind, doc),
      type: (doc.customType ?? doc.type).replace(/[-_]/g, " "),
      captureDate: format(doc.createdAt, "MMM d, yyyy"),
      linkedTo,
    };
  }

  const manifest: ManifestEntry[] = taggedDocuments.map(manifestEntry);

  // Exclusions, each with its attached documents' manifest entries.
  //
  // CONTAINMENT (non-adjudication review): only `exemptionCategory` is safe to surface from
  // `result`. `result.explanation` and `result.nextSteps` can carry determiner-style copy
  // from the screening engine ("you are exempt…"), so they must NOT reach the artifact —
  // rendering them would reintroduce a verdict (ADR-0003). The category is a neutral label
  // of what the user asked the state to check.
  const exclusions: PackageExclusion[] = exclusionScreenings.map(
    (screening) => ({
      screening,
      category: screening.result.exemptionCategory?.replace(/-/g, " "),
      screeningDate: format(
        screening.screeningDate instanceof Date
          ? screening.screeningDate
          : new Date(screening.screeningDate),
        "MMM d, yyyy",
      ),
      documents: taggedDocuments
        .filter(
          (t) => t.kind === "exclusion" && t.doc.exemptionId === screening.id,
        )
        .map(manifestEntry),
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
      coverageMonths: sortedMonths.map(monthLabel),
      reportDate: format(generatedAt, "MMMM d, yyyy"),
    },
    months: packageMonths,
    manifest,
    exclusions,
    submissionModalities: policy.submissionModalities,
    documentationRequiredFrom: policy.documentationRequiredFrom,
    documentationHardened,
    policyConfidence: policy.confidence,
    policyLabel: policy.label,
    // ADR-0003: the package reports what was logged and names the state as the decider.
    // "your state decides" is the allowed form from compliance-copy-standards.md.
    legend: [
      "This is a personal record of what you logged. It is not a determination.",
      "Your state decides whether the community engagement requirement is met, and it must check its own records first before asking you for anything. 42 CFR 435.556, 435.557(a)-(b).",
      "If your state makes a decision you disagree with, you can appeal it. 42 CFR 431.220(a)(1).",
    ],
  };
}
