/**
 * `copyEvidenceFields` — type-aware copying of an activity's evidence (W6a convergence,
 * findings 6/11). Duplication used to drop every new field; this helper carries exactly the
 * fields that belong to the activity's type and nothing across types.
 */

import { describe, it, expect } from "vitest";
import { copyEvidenceFields } from "@/lib/activityRecord";
import type { Activity } from "@/types";

function act(over: Partial<Activity>): Activity {
  return {
    date: "2026-07-01",
    type: "work",
    hours: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  };
}

describe("copyEvidenceFields", () => {
  it("carries a work activity's sub-kind", () => {
    expect(
      copyEvidenceFields(act({ type: "work", workKind: "unpaid" })),
    ).toEqual({
      workKind: "unpaid",
    });
  });

  it("carries a community-service record and its legacy organization", () => {
    const cs = { organizationName: "Food Bank", pointOfContactName: "Dana" };
    expect(
      copyEvidenceFields(
        act({
          type: "volunteer",
          organization: "legacy",
          communityService: cs,
        }),
      ),
    ).toEqual({ organization: "legacy", communityService: cs });
  });

  it("carries education source facts, not a derived hours figure", () => {
    expect(
      copyEvidenceFields(
        act({
          type: "education",
          enrollmentStatus: "less-than-half-time",
          educationProgramType: "higher-education",
          creditHours: 6,
        }),
      ),
    ).toEqual({
      enrollmentStatus: "less-than-half-time",
      educationProgramType: "higher-education",
      creditHours: 6,
      nonCreditHours: undefined,
    });
  });

  it("does not carry one type's evidence onto another type", () => {
    // A work row never carries communityService or enrollmentStatus, even if the source
    // object somehow had them — the switch keys on type, not on which fields are set.
    const polluted = act({
      type: "work",
      workKind: "paid",
      // A stale community-service object from a former life as a volunteer row. The switch
      // keys on type, so it must be ignored for a work row.
      communityService: { organizationName: "should not travel" },
    });
    expect(copyEvidenceFields(polluted)).toEqual({ workKind: "paid" });
  });

  it("carries nothing extra for a work program row", () => {
    expect(copyEvidenceFields(act({ type: "workProgram" }))).toEqual({});
  });
});
