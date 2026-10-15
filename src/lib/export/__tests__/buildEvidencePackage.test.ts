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
  type TaggedDocument,
} from "@/lib/export/buildEvidencePackage";
import {
  findVerdictPhrases,
  formatHits,
} from "@/__tests__/support/verdictPhrases";
import { FEDERAL_DEFAULT } from "@/lib/policy";
import type { MonthEvaluation } from "@/lib/evaluateMonth";
import type { Activity, UserProfile } from "@/types";
import type { ComplianceMode, IncomeEntry } from "@/types/income";

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

function activity(date: string, hours: number, id?: number): Activity {
  return { id, date, type: "work", hours, createdAt: NOW, updatedAt: NOW };
}

function income(date: string, amount: number, id?: number): IncomeEntry {
  return {
    id,
    userId: "u1",
    date,
    amount,
    payPeriod: "monthly",
    monthlyEquivalent: amount,
    createdAt: NOW,
    updatedAt: NOW,
  };
}

function mode(month: string, m: "hours" | "income"): ComplianceMode {
  return { userId: "u1", month, mode: m, createdAt: NOW, updatedAt: NOW };
}

function activityDoc(id: number, activityId: number): TaggedDocument {
  return {
    kind: "activity",
    doc: {
      id,
      activityId,
      type: "pay-stub",
      createdAt: NOW,
      blobId: id * 100,
    },
  };
}

function baseInput(
  over: Partial<EvidencePackageInput> = {},
): EvidencePackageInput {
  return {
    profile,
    months: ["2026-07"],
    evaluations: { "2026-07": hoursEvaluation("2026-07", 46) },
    activities: [activity("2026-07-05", 46, 1)],
    incomeEntries: [],
    complianceModes: [mode("2026-07", "hours")],
    taggedDocuments: [],
    exclusionScreenings: [],
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

  it("§ 435.907(a), 91 FR 33396: lists the submission channels from the profile (gap 8.1)", () => {
    const pkg = buildEvidencePackage(baseInput());
    expect(pkg.submissionModalities).toEqual(
      FEDERAL_DEFAULT.submissionModalities,
    );
    expect(pkg.submissionModalities).toContain("mail");
    expect(pkg.submissionModalities).toContain("fax");
  });

  it("formats coverage months as long labels, not raw keys (semantic review #16)", () => {
    const pkg = buildEvidencePackage(baseInput());
    expect(pkg.cover.coverageMonths).toEqual(["July 2026"]);
  });

  it("carries the policy confidence so the page can hedge state elections (semantic review #11)", () => {
    const pkg = buildEvidencePackage(baseInput());
    expect(pkg.policyConfidence).toBe(FEDERAL_DEFAULT.confidence);
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

  it("labels the month with its stored ComplianceMode, not a heuristic (semantic review #4)", () => {
    const pkg = buildEvidencePackage(
      baseInput({ complianceModes: [mode("2026-07", "income")] }),
    );
    expect(pkg.months[0].recordedAs).toBe("income");
  });

  it("flags both hours and income records when a month holds both (semantic review #2/#3)", () => {
    const pkg = buildEvidencePackage(
      baseInput({
        activities: [activity("2026-07-05", 46, 1)],
        incomeEntries: [income("2026-07-15", 300, 1)],
        complianceModes: [mode("2026-07", "income")],
      }),
    );
    const july = pkg.months[0];
    expect(july.hasHoursRecords).toBe(true);
    expect(july.hasIncomeRecords).toBe(true);
    // Both comparisons are present in the data — the view renders both.
    expect(july.hours.logged).toBe(46);
    expect(july.income.threshold).toBe(580);
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

describe("buildEvidencePackage: W6a structured evidence survives to the artifact (semantic review #5)", () => {
  it("§ 435.552(b), § II.I.6.b: a community-service record carries its verification fields", () => {
    const csActivity: Activity = {
      id: 1,
      date: "2026-07-05",
      type: "volunteer",
      hours: 10,
      communityService: {
        organizationName: "Riverside Food Bank",
        organizationAddress: "12 Main St",
        activityDescription: "Sorted donations",
        pointOfContactName: "Dana Lee",
        pointOfContactPhone: "555-0100",
        courtOrdered: true,
      },
      createdAt: NOW,
      updatedAt: NOW,
    };
    const pkg = buildEvidencePackage({
      ...baseInput(),
      activities: [csActivity],
    });
    const detail = pkg.months[0].activityDetails[0];
    expect(detail.communityService?.organizationName).toBe(
      "Riverside Food Bank",
    );
    expect(detail.communityService?.organizationAddress).toBe("12 Main St");
    expect(detail.communityService?.pointOfContact).toMatch(/Dana Lee/);
    expect(detail.communityService?.courtOrdered).toBe(true);
  });

  it("§ 435.552(a)(4): half-time education reads as enrollment, not '0 hours'", () => {
    const pkg = buildEvidencePackage({
      ...baseInput(),
      activities: [
        {
          id: 1,
          date: "2026-07-05",
          type: "education",
          hours: 0,
          enrollmentStatus: "at-least-half-time",
          createdAt: NOW,
          updatedAt: NOW,
        },
      ],
    });
    expect(pkg.months[0].activityDetails[0].detail).toMatch(
      /at least half-time/i,
    );
  });

  it("§ 435.552(b): a work record shows its sub-kind", () => {
    const pkg = buildEvidencePackage({
      ...baseInput(),
      activities: [
        {
          id: 1,
          date: "2026-07-05",
          type: "work",
          hours: 8,
          workKind: "in-kind",
          createdAt: NOW,
          updatedAt: NOW,
        },
      ],
    });
    expect(pkg.months[0].activityDetails[0].detail).toMatch(/in-kind work/);
  });
});

describe("buildEvidencePackage: document manifest with namespaced references (semantic review #1)", () => {
  it("mints table-unique references so same-id docs from two tables do not collide", () => {
    // An activity document id 1 and an income document id 1 must get distinct references.
    const incomeDoc: TaggedDocument = {
      kind: "income",
      doc: {
        id: 1,
        incomeEntryId: 1,
        type: "pay_stub",
        createdAt: NOW,
        blobId: 999,
      },
    };
    const pkg = buildEvidencePackage(
      baseInput({
        incomeEntries: [income("2026-07-15", 300, 1)],
        complianceModes: [mode("2026-07", "income")],
        taggedDocuments: [activityDoc(1, 1), incomeDoc],
      }),
    );
    const refs = pkg.manifest.map((m) => m.reference);
    expect(refs).toContain("ACT-1");
    expect(refs).toContain("INC-1");
    expect(new Set(refs).size).toBe(refs.length); // all unique
  });

  it("positive twin: a month with no documents is flagged, not silently empty (gap 8.3)", () => {
    const pkg = buildEvidencePackage(baseInput());
    const july = pkg.months[0];
    expect(july.documentCount).toBe(0);
    expect(july.lacksDocumentation).toBe(true);
  });
});

describe("buildEvidencePackage: exclusion documents (gap 8.5)", () => {
  it("§ 435.557(b)(2), 91 FR 33474: an exclusion document appears under its screening with an EXC- reference", () => {
    const exclusionDoc: TaggedDocument = {
      kind: "exclusion",
      doc: {
        id: 1,
        exemptionId: 7,
        type: "va-disability",
        createdAt: NOW,
        blobId: 5000,
      },
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
        taggedDocuments: [exclusionDoc],
      }),
    );
    expect(pkg.exclusions).toHaveLength(1);
    expect(pkg.exclusions[0].documents).toHaveLength(1);
    expect(pkg.exclusions[0].documents[0].reference).toBe("EXC-1");
    expect(pkg.exclusions[0].category).toBe("health disability");
    expect(pkg.manifest.some((m) => /exclusion/i.test(m.linkedTo))).toBe(true);
  });
});

describe("buildEvidencePackage: 2028 escalation is conditional on the state's date (gap 8.3)", () => {
  it("§ 435.557(b)(2)(i)-(ii), 91 FR 33474: names documentationRequiredFrom as a state election", () => {
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
    expect(before.documentationHardened).toBe(false);
    expect(after.documentationHardened).toBe(true);
  });
});

describe("buildEvidencePackage: no verdict anywhere (ADR-0003)", () => {
  it("the serialised package carries no banned verdict phrase", () => {
    const pkg = buildEvidencePackage(
      baseInput({
        taggedDocuments: [activityDoc(1, 1)],
        evaluations: { "2026-07": hoursEvaluation("2026-07", 90) }, // over threshold
      }),
    );
    const hits = findVerdictPhrases(JSON.stringify(pkg), "evidence package");
    expect(hits, formatHits(hits)).toEqual([]);
  });

  it("the legend states the state decides, in the data not just the UI", () => {
    const pkg = buildEvidencePackage(baseInput());
    expect(pkg.legend.join(" ")).toMatch(/your state decides/i);
  });
});
