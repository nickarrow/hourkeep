/**
 * Exclusion documentation — W8a, gap 8.5 (42 CFR 435.557(b)(2), 91 FR 33395).
 *
 * Before W8a a document could only link to an activity, so a VA letter, a school record,
 * or a SNAP/TANF approval notice proving a specified-excluded-individual status had nowhere
 * to live and never reached the export. These tests pin that an exclusion document:
 *   - round-trips through IndexedDB on an existing table, with NO schema change (the
 *     `exemptionId` field is unindexed, so `HourKeepDB` stays at v6);
 *   - is retrievable by its screening id;
 *   - cascades on screening delete so its blob is never orphaned
 *     (`.kiro/steering/data-migration-standards.md`).
 */

import "fake-indexeddb/auto";

import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";

import { db } from "@/lib/db";
import {
  saveExclusionDocument,
  getDocumentsByExemption,
} from "@/lib/storage/documents";
import {
  saveScreening,
  deleteExclusionScreeningWithDocuments,
  archiveScreening,
} from "@/lib/storage/exemptions";
import { cleanupOrphanedDocuments } from "@/lib/storage/activities";
import type { ExemptionResponses, ExemptionResult } from "@/types/exemptions";

const META = {
  type: "va-disability" as const,
  fileSize: 100,
  mimeType: "image/jpeg",
  captureMethod: "upload" as const,
};

const RESPONSES: ExemptionResponses = { isDisabledVeteran: true };
const RESULT: ExemptionResult = {
  isExempt: true,
  exemptionCategory: "health-disability",
  explanation: "x",
  nextSteps: "y",
};

beforeEach(async () => {
  await db.transaction("rw", db.tables, async () => {
    await Promise.all(db.tables.map((t) => t.clear()));
  });
  vi.stubGlobal("navigator", {
    ...navigator,
    storage: {
      estimate: async () => ({ quota: 1_000_000_000, usage: 1_000_000 }),
    },
  });
});

afterAll(async () => {
  db.close();
});

describe("saveExclusionDocument / getDocumentsByExemption (gap 8.5)", () => {
  it("§ 435.557(b)(2), 91 FR 33395: an exclusion document round-trips, keyed by exemptionId, with no activityId", async () => {
    const screening = await saveScreening("u1", RESPONSES, RESULT);
    const id = await saveExclusionDocument(
      screening.id!,
      new Blob(["va"], { type: "image/jpeg" }),
      { ...META },
    );

    const saved = await db.documents.get(id);
    expect(saved).toBeDefined();
    expect(saved!.exemptionId).toBe(screening.id);
    expect(saved!.activityId).toBeUndefined();
    expect(await db.documentBlobs.count()).toBe(1);

    const byExemption = await getDocumentsByExemption(screening.id!);
    expect(byExemption).toHaveLength(1);
    expect(byExemption[0].type).toBe("va-disability");
  });

  it("does not return another screening's documents", async () => {
    const a = await saveScreening("u1", RESPONSES, RESULT);
    const b = await saveScreening("u1", RESPONSES, RESULT);
    await saveExclusionDocument(
      a.id!,
      new Blob(["a"], { type: "image/jpeg" }),
      {
        ...META,
      },
    );

    expect(await getDocumentsByExemption(b.id!)).toHaveLength(0);
    expect(await getDocumentsByExemption(a.id!)).toHaveLength(1);
  });

  it("HourKeepDB stays at version 6 — exclusion documents add no table and no index", async () => {
    // The unindexed-field invariant. `exemptionId` is stored data on an existing row.
    expect(db.verno).toBe(6);
  });
});

describe("deleteExclusionScreeningWithDocuments cascades (data-migration-standards)", () => {
  it("removes the screening and every attached document and blob", async () => {
    const screening = await saveScreening("u1", RESPONSES, RESULT);
    await saveExclusionDocument(
      screening.id!,
      new Blob(["1"], { type: "image/jpeg" }),
      {
        ...META,
      },
    );
    await saveExclusionDocument(
      screening.id!,
      new Blob(["2"], { type: "image/jpeg" }),
      {
        ...META,
      },
    );

    await deleteExclusionScreeningWithDocuments(screening.id!);

    expect(await db.exemptions.get(screening.id!)).toBeUndefined();
    expect(await getDocumentsByExemption(screening.id!)).toHaveLength(0);
    expect(await db.documentBlobs.count()).toBe(0);
  });

  it("leaves the screening in place if a document delete fails, so nothing is orphaned unreachably", async () => {
    const screening = await saveScreening("u1", RESPONSES, RESULT);
    await saveExclusionDocument(
      screening.id!,
      new Blob(["1"], { type: "image/jpeg" }),
      {
        ...META,
      },
    );

    vi.spyOn(db.documentBlobs, "delete").mockRejectedValueOnce(
      new Error("blob delete failed"),
    );

    await expect(
      deleteExclusionScreeningWithDocuments(screening.id!),
    ).rejects.toThrow();

    // The screening survives, so the user still has a handle to retry.
    expect(await db.exemptions.get(screening.id!)).toBeDefined();
  });

  it("does not touch another screening's documents", async () => {
    const a = await saveScreening("u1", RESPONSES, RESULT);
    const b = await saveScreening("u1", RESPONSES, RESULT);
    await saveExclusionDocument(
      a.id!,
      new Blob(["a"], { type: "image/jpeg" }),
      {
        ...META,
      },
    );
    await saveExclusionDocument(
      b.id!,
      new Blob(["b"], { type: "image/jpeg" }),
      {
        ...META,
      },
    );

    await deleteExclusionScreeningWithDocuments(a.id!);

    expect(await getDocumentsByExemption(b.id!)).toHaveLength(1);
    expect(await db.documentBlobs.count()).toBe(1);
  });
});

describe("cleanupOrphanedDocuments must NOT delete exclusion documents (data-loss guard)", () => {
  it("leaves an exclusion document alone — it has no activityId by design, not because its activity vanished", async () => {
    // The sharp edge of making activityId optional. cleanupOrphanedDocuments deletes any
    // ACTIVITY document whose activity is gone; an exclusion document has activityId ===
    // undefined, which is "not in the activity set", so a naive filter would delete it and
    // destroy evidence the screening still points at. This is the data-loss bug the
    // optional-field type error surfaced; this test pins the fix.
    const screening = await saveScreening("u1", RESPONSES, RESULT);
    await saveExclusionDocument(
      screening.id!,
      new Blob(["va"], { type: "image/jpeg" }),
      { ...META },
    );

    const deleted = await cleanupOrphanedDocuments();

    expect(deleted).toBe(0);
    expect(await getDocumentsByExemption(screening.id!)).toHaveLength(1);
    expect(await db.documentBlobs.count()).toBe(1);
  });

  it("archiveScreening cascades exclusion documents, so re-screening strands nothing (semantic review #8)", async () => {
    // archiveScreening is what the app actually calls when a user re-screens. Before W8a's
    // fix it deleted the screening row with no document handling, and because
    // cleanupOrphanedDocuments deliberately skips documents with no activityId, an archived
    // screening's exclusion documents became permanently unreclaimable. The archive decision
    // is that exclusion evidence is deleted with the screening it belonged to.
    const screening = await saveScreening("u1", RESPONSES, RESULT);
    await saveExclusionDocument(
      screening.id!,
      new Blob(["va"], { type: "image/jpeg" }),
      { ...META },
    );

    await archiveScreening(screening.id!);

    // The screening is gone, archived to history, and its document + blob are reclaimed.
    expect(await db.exemptions.get(screening.id!)).toBeUndefined();
    expect(await db.exemptionHistory.count()).toBe(1);
    expect(await getDocumentsByExemption(screening.id!)).toHaveLength(0);
    expect(await db.documentBlobs.count()).toBe(0);
  });

  it("positive twin: it still deletes a genuinely orphaned ACTIVITY document", async () => {
    // The behaviour must survive — a document pointing at a deleted activity is a real
    // orphan and should be reclaimed. Guarding exclusion documents must not disable this.
    await db.activities.add({
      date: "2026-07-01",
      type: "work",
      hours: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // A document pointing at an activity id that does not exist (999).
    const blobId = await db.documentBlobs.add({
      blob: new Blob(["x"], { type: "image/jpeg" }),
      createdAt: new Date(),
    });
    await db.documents.add({
      activityId: 999,
      type: "pay-stub",
      fileSize: 1,
      mimeType: "image/jpeg",
      captureMethod: "camera",
      blobId,
      createdAt: new Date(),
    });

    const deleted = await cleanupOrphanedDocuments();
    expect(deleted).toBe(1);
  });
});
