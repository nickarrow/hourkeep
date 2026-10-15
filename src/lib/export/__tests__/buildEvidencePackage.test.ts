/**
 * The evidence package — W8a, ADR-0006.
 *
 * `buildEvidencePackage` assembles the period-scoped package a user hands to their state:
 * cover facts, per-month computed facts (from the single evaluation path), a document
 * manifest, exclusion documents, document-gap flags, and the submission channels — all as
 * plain data a React print surface then renders. It is pure (no Dexie, no DOM), so it is
 * testable directly, which is the whole reason the content is assembled here and not inside
 * the component (the lesson W2a's `buildTextReport` extraction encodes).
 *
 * It asserts a determination NOWHERE (ADR-0003): the package carries Logged / Threshold /
 * Difference and an apparent-pathway label with its citation, never a verdict. CFR anchors
 * resolved from `docs/domain/cms-2454-ifc/2026-11094.txt`.
 */

import { describe, it, expect } from "vitest";

import {
  buildEvidencePackage,
  type EvidencePackageInput,
} from "@/lib/export/buildEvidencePackage";
import {
  findVerdictPhrases,
  formatHits,
} from "@/__tests__/support/verdictPhrases";
import { FEDERAL_DEFAULT } from "@/lib/policy";
import type { MonthEvaluation } from "@/lib/evaluateMonth";
import type { Activity, UserProfile } from "@/types";
import type { Document } from "@/types/documents";

const NOW = new Date("2026-08-17T12:00:00Z");

const profile: UserProfile = {
  id: "u1",
  name: "Sam Rivera",
  state: "OH",
  dateOfBirth: "1990-04-01", // decrypted plaintext — the caller used getProfile
  medicaidId: "OH-12345",
  createdAt: NOW,
  updatedAt: NOW,
  privacyNoticeAcknowledged: true,
  privacyNoticeAcknowledgedAt: NOW,
  version: 2,
};

function hoursEvaluation(month: string, totalHours: number): MonthEvaluation {
  return {
    month,
    hours: {
      month,
      totalHours,
      workHours: totalHours,
      volunteerHours: 0,
      educationHours: 0,
      workProgramHours: 0,
      hasStandaloneEducation: false,
      isCompliant: totalHours >= 80,
      hoursNeeded: Math.max(80 - totalHours, 0),
    },
    income: {
      month,
      totalIncome: 0,
      entryCount: 0,
      isCompliant: false,
      amountNeeded: 580,
      isSeasonalWorker: false,
    },
    thresholds: { hours: 80, income: 580 },
  };
}

function activity(date: string, hours: number): Activity {
  return { date, type: "work", hours, createdAt: NOW, updatedAt: NOW };
}

function activityDoc(activityId: number): Document {
  return {
    id: activityId * 10,
    activityId,
    type: "pay-stub",
    fileSize: 100,
    mimeType: "image/jpeg",
    captureMethod: "camera",
    blobId: activityId * 100,
    createdAt: NOW,
  };
}

function baseInput(
  over: Partial<EvidencePackageInput> = {},
): EvidencePackageInput {
  return {
    profile,
    months: ["2026-07"],
    evaluations: { "2026-07": hoursEvaluation("2026-07", 46) },
    activities: [activity("2026-07-05", 46)],
    incomeEntries: [],
    documents: [],
    incomeDocuments: [],
    exclusionScreenings: [],
    exclusionDocuments: [],
    policy: FEDERAL_DEFAULT,
    generatedAt: NOW,
    ...over,
  };
}

describe("buildEvidencePackage: cover (ADR-0006 § Contents)", () => {
  it("carries decrypted identity, never ciphertext (gap 8.8, print surface)", () => {
    const pkg = buildEvidencePackage(baseInput());
    expect(pkg.cover.name).toBe("Sam Rivera");
    expect(pkg.cover.state).toBe("OH");
    expect(pkg.cover.medicaidId).toBe("OH-12345");
    expect(pkg.cover.dateOfBirth).toBe("1990-04-01");
  });

  it("§ 435.907(a), 91 FR 33381: lists the submission channels from the profile (gap 8.1)", () => {
    const pkg = buildEvidencePackage(baseInput());
    expect(pkg.submissionModalities).toEqual(
      FEDERAL_DEFAULT.submissionModalities,
    );
    expect(pkg.submissionModalities).toContain("mail");
    expect(pkg.submissionModalities).toContain("fax");
  });
});

describe("buildEvidencePackage: per-month facts, Logged / Threshold / Difference (ADR-0003)", () => {
  it("§ 435.552(a), 91 FR 33470: a month carries the evaluation's hours total and threshold, not a verdict", () => {
    const pkg = buildEvidencePackage(baseInput());
    const july = pkg.months.find((m) => m.month === "2026-07")!;
    expect(july.hours.logged).toBe(46);
    expect(july.hours.threshold).toBe(80);
    expect(july.hours.difference).toBe(34);
  });

  it("includes a month in the selected range even if it has no records", () => {
    const pkg = buildEvidencePackage(
      baseInput({
        months: ["2026-06", "2026-07"],
        evaluations: {
          "2026-06": hoursEvaluation("2026-06", 0),
          "2026-07": hoursEvaluation("2026-07", 46),
        },
      }),
    );
    expect(pkg.months.map((m) => m.month)).toEqual(["2026-07", "2026-06"]);
  });
});

describe("buildEvidencePackage: document manifest (gap 8.7)", () => {
  it("lists each activity document with a stable reference and its linkage", () => {
    const pkg = buildEvidencePackage(
      baseInput({ documents: [activityDoc(1)] }),
    );
    expect(pkg.manifest).toHaveLength(1);
    expect(pkg.manifest[0].reference).toBeTruthy();
    expect(pkg.manifest[0].linkedTo).toMatch(/activity/i);
  });

  it("positive twin: a month with no documents is flagged, not silently empty (gap 8.3)", () => {
    const pkg = buildEvidencePackage(baseInput());
    const july = pkg.months.find((m) => m.month === "2026-07")!;
    expect(july.documentCount).toBe(0);
    expect(july.lacksDocumentation).toBe(true);
  });
});

describe("buildEvidencePackage: exclusion documents (gap 8.5)", () => {
  it("§ 435.557(b)(2), 91 FR 33395: an exclusion document appears under its screening", () => {
    const exclusionDoc: Document = {
      id: 500,
      exemptionId: 7,
      type: "va-disability",
      fileSize: 100,
      mimeType: "image/jpeg",
      captureMethod: "upload",
      blobId: 5000,
      createdAt: NOW,
    };
    const pkg = buildEvidencePackage(
      baseInput({
        exclusionScreenings: [
          {
            id: 7,
            userId: "u1",
            screeningDate: NOW,
            responses: { isDisabledVeteran: true },
            result: {
              isExempt: true,
              exemptionCategory: "health-disability",
              explanation: "x",
              nextSteps: "y",
            },
            version: 1,
          },
        ],
        exclusionDocuments: [exclusionDoc],
      }),
    );

    expect(pkg.exclusions).toHaveLength(1);
    expect(pkg.exclusions[0].documents).toHaveLength(1);
    expect(pkg.exclusions[0].documents[0].type).toBe("va-disability");
    // It also appears in the manifest, linked to the exclusion rather than an activity.
    expect(pkg.manifest.some((m) => /exclusion/i.test(m.linkedTo))).toBe(true);
  });
});

describe("buildEvidencePackage: 2028 escalation is conditional on the state's date (gap 8.3)", () => {
  it("§ 435.557(b)(2)(i)-(ii), 91 FR 33395: names documentationRequiredFrom as a state election", () => {
    const pkg = buildEvidencePackage(baseInput());
    expect(pkg.documentationRequiredFrom).toBe(
      FEDERAL_DEFAULT.documentationRequiredFrom,
    );
  });

  it("escalates prominence once the state's date is reached", () => {
    const before = buildEvidencePackage(
      baseInput({ generatedAt: new Date("2027-06-01T00:00:00Z") }),
    );
    const after = buildEvidencePackage(
      baseInput({ generatedAt: new Date("2028-06-01T00:00:00Z") }),
    );
    // Federal default documentationRequiredFrom is 2028-01-01, so the later package treats
    // documentation as required, the earlier one as encouraged.
    expect(before.documentationHardened).toBe(false);
    expect(after.documentationHardened).toBe(true);
  });
});

describe("buildEvidencePackage: no verdict anywhere (ADR-0003)", () => {
  it("the serialised package carries no banned verdict phrase", () => {
    const pkg = buildEvidencePackage(
      baseInput({
        documents: [activityDoc(1)],
        evaluations: { "2026-07": hoursEvaluation("2026-07", 90) }, // over threshold
      }),
    );
    const serialised = JSON.stringify(pkg);
    const hits = findVerdictPhrases(serialised, "evidence package");
    expect(hits, formatHits(hits)).toEqual([]);
  });

  it("the legend states the state decides, in the data not just the UI", () => {
    const pkg = buildEvidencePackage(baseInput());
    expect(pkg.legend.join(" ")).toMatch(/your state decides/i);
  });
});
