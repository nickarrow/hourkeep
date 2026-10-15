/**
 * W6a stores new unindexed fields on existing rows — no schema bump — so the one thing
 * that can break is a round-trip: does Dexie actually persist and return them? This test
 * writes an activity with every W6a field and a document with each new type, then reads
 * them back.
 *
 * 42 CFR 435.552(b) (workKind, community-service record), (c)/(d) (enrollment status,
 * credit hours), and § II.I.3/§ II.I.6 (the VA and SNAP/TANF document types, gap 8.4).
 *
 * `.stores()` in db.ts declares `activities: "++id, date, type"` and
 * `documents: "++id, activityId, type, createdAt"` — indexes only. These fields are
 * unindexed data on the row, and `workProgram` / the new document types are new VALUES in
 * already-indexed fields. If any of this needed a version bump, this test fails and the
 * wave stops to renumber (resolved-blockers item 1).
 */

import "fake-indexeddb/auto";

import { describe, it, expect, beforeEach, afterAll } from "vitest";

import { db } from "@/lib/db";
import type { Activity } from "@/types";

beforeEach(async () => {
  await db.activities.clear();
  await db.documents.clear();
});

afterAll(async () => {
  db.close();
});

describe("Activity: W6a fields round-trip through IndexedDB with no schema change", () => {
  it("§ 435.552(a)(3): a workProgram activity stores and reads back as workProgram", () => {
    // The headline: before W6a the type union could not hold this value.
    return (async () => {
      const id = await db.activities.add({
        date: "2026-07-01",
        type: "workProgram",
        hours: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const read = await db.activities.get(id);
      expect(read?.type).toBe("workProgram");
      expect(read?.hours).toBe(20);
    })();
  });

  it("§ 435.552(b): a work activity stores its sub-kind", async () => {
    const id = await db.activities.add({
      date: "2026-07-02",
      type: "work",
      hours: 30,
      workKind: "in-kind",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const read = await db.activities.get(id);
    expect(read?.workKind).toBe("in-kind");
  });

  it("§ 435.552(c), (d): an education activity stores status, program type, and credit hours", async () => {
    const id = await db.activities.add({
      date: "2026-07-03",
      type: "education",
      hours: 77.94,
      enrollmentStatus: "less-than-half-time",
      educationProgramType: "higher-education",
      creditHours: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const read = await db.activities.get(id);
    expect(read?.enrollmentStatus).toBe("less-than-half-time");
    expect(read?.educationProgramType).toBe("higher-education");
    expect(read?.creditHours).toBe(6);
  });

  it("§ 435.552(d)(2): a non-credit less-than-half-time row stores nonCreditHours", async () => {
    const id = await db.activities.add({
      date: "2026-07-03b",
      type: "education",
      hours: 0,
      enrollmentStatus: "less-than-half-time",
      nonCreditHours: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const read = await db.activities.get(id);
    expect(read?.nonCreditHours).toBe(50);
  });

  it("§ 435.552(c): an at-least-half-time education row stores status with zero hours", async () => {
    // The cliff, persisted: half-time demonstrates on its own, so hours is 0 and the
    // status is what carries the meaning.
    const id = await db.activities.add({
      date: "2026-07-04",
      type: "education",
      hours: 0,
      enrollmentStatus: "at-least-half-time",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const read = await db.activities.get(id);
    expect(read?.enrollmentStatus).toBe("at-least-half-time");
    expect(read?.hours).toBe(0);
  });

  it("§ 435.552(b), § II.I.6.b: a community-service record stores every verification field", async () => {
    const details: Activity["communityService"] = {
      organizationName: "Riverside Food Bank",
      organizationAddress: "12 Main St, Springfield",
      pointOfContactName: "Dana Lee",
      pointOfContactPhone: "555-0100",
      pointOfContactEmail: "dana@foodbank.org",
      activityDescription: "Sorted and packed donations",
      courtOrdered: true,
    };
    const id = await db.activities.add({
      date: "2026-07-05",
      type: "volunteer",
      hours: 10,
      communityService: details,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const read = await db.activities.get(id);
    expect(read?.communityService).toEqual(details);
  });

  it("the type index still works after adding a new value to it", async () => {
    // workProgram is a new value in the indexed `type` field. Querying by it must work —
    // proof the index did not need rebuilding.
    await db.activities.bulkAdd([
      {
        date: "2026-07-06",
        type: "workProgram",
        hours: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: "2026-07-07",
        type: "work",
        hours: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    const found = await db.activities
      .where("type")
      .equals("workProgram")
      .toArray();
    expect(found).toHaveLength(1);
    expect(found[0].hours).toBe(40);
  });
});

describe("Document: the W6a document types round-trip (gap 8.4)", () => {
  it("stores and reads a VA disability document", async () => {
    const id = await db.documents.add({
      activityId: 1,
      type: "va-disability",
      fileSize: 100,
      mimeType: "image/jpeg",
      captureMethod: "upload",
      createdAt: new Date(),
      blobId: 1,
    });
    const read = await db.documents.get(id);
    expect(read?.type).toBe("va-disability");
  });

  it("stores and reads a SNAP/TANF approval notice", async () => {
    const id = await db.documents.add({
      activityId: 1,
      type: "snap-tanf-approval",
      fileSize: 100,
      mimeType: "image/jpeg",
      captureMethod: "upload",
      createdAt: new Date(),
      blobId: 1,
    });
    const read = await db.documents.get(id);
    expect(read?.type).toBe("snap-tanf-approval");
  });
});
