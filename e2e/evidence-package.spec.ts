import { test, expect, type Page } from "@playwright/test";

/**
 * The evidence package print route — W8a (ADR-0006). Added after the two-model semantic
 * review (#1, #2, #9, #13): the agency artifact is the product's output, and the defects
 * that matter here are ones jsdom cannot see — real IndexedDB `Blob` bytes decoded into
 * object URLs, the attachment-reference join across two tables, print CSS, and the
 * warning→confirm stage machine on a phone viewport.
 *
 * Each test seeds a minimal profile (the app redirects to /onboarding without one) plus the
 * specific records it needs, directly into IndexedDB, then drives the real built export.
 */

const TINY_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

/**
 * Seed records into the app's own Dexie database by driving the storage layer is not
 * reachable from a spec, so we open the database the app created (after a first navigation
 * so Dexie has run its upgrades) and add rows directly. This mirrors how the month-scoping
 * spec seeds state.
 */
async function seed(page: Page) {
  await page.evaluate(async (pngB64) => {
    const open = () =>
      new Promise<IDBDatabase>((res, rej) => {
        const r = indexedDB.open("HourKeepDB");
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
    const db = await open();
    const now = new Date();
    const bytes = Uint8Array.from(atob(pngB64), (c) => c.charCodeAt(0));
    const png = new Blob([bytes], { type: "image/png" });
    // Resolve on transaction COMPLETE, not merely request success — otherwise the last
    // write may not have committed before db.close(), which silently drops it.
    const put = (store: string, val: unknown) =>
      new Promise<number>((res, rej) => {
        const tx = db.transaction(store, "readwrite");
        const rq = tx.objectStore(store).add(val as never);
        let id: number;
        rq.onsuccess = () => {
          id = rq.result as number;
        };
        tx.oncomplete = () => res(id);
        tx.onerror = () => rej(tx.error);
        tx.onabort = () => rej(tx.error);
      });

    await new Promise<void>((res, rej) => {
      const tx = db.transaction("profiles", "readwrite");
      tx.objectStore("profiles").put({
        id: "u1",
        name: "Sam Rivera",
        state: "OH",
        dateOfBirth: "",
        medicaidId: "",
        createdAt: now,
        updatedAt: now,
        privacyNoticeAcknowledged: true,
        privacyNoticeAcknowledgedAt: now,
        version: 2,
      });
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });

    // A July work activity, an income entry, and — the collision case — an activity document
    // and an income document that both get id 1 in their independent tables.
    const workId = await put("activities", {
      date: "2026-07-10",
      type: "work",
      hours: 90,
      workKind: "paid",
      createdAt: now,
      updatedAt: now,
    });
    const incId = await put("incomeEntries", {
      userId: "u1",
      date: "2026-07-15",
      amount: 300,
      payPeriod: "monthly",
      monthlyEquivalent: 300,
      createdAt: now,
      updatedAt: now,
    });
    await put("complianceModes", {
      userId: "u1",
      month: "2026-07",
      mode: "income",
      createdAt: now,
      updatedAt: now,
    });
    const ab = await put("documentBlobs", { blob: png, createdAt: now });
    await put("documents", {
      activityId: workId,
      type: "pay-stub",
      fileSize: bytes.length,
      mimeType: "image/png",
      captureMethod: "upload",
      blobId: ab,
      createdAt: now,
    });
    const ib = await put("incomeDocumentBlobs", { blob: png, createdAt: now });
    await put("incomeDocuments", {
      incomeEntryId: incId,
      type: "bank_statement",
      fileSize: bytes.length,
      mimeType: "image/png",
      captureMethod: "upload",
      blobId: ib,
      createdAt: now,
    });
    db.close();
  }, TINY_PNG);
}

test.describe("evidence package print route", () => {
  test("gates behind the PII warning, then renders the record on confirm", async ({
    page,
  }) => {
    await page.goto("/export/package", { waitUntil: "networkidle" });
    await seed(page);
    await page.reload({ waitUntil: "networkidle" });

    // The warning is shown first; the record is not yet in the DOM.
    await expect(
      page.getByText(/this package includes personal information/i),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /HourKeep Activity Record/i }),
    ).toHaveCount(0);

    await page
      .getByRole("button", { name: /I understand — continue/i })
      .click();

    // After confirm the record renders.
    await expect(
      page.getByRole("heading", { name: /HourKeep Activity Record/i }),
    ).toBeVisible();
    await expect(page.getByText(/Sam Rivera/).first()).toBeVisible();
  });

  test("renders both documents with distinct references and real images (semantic review #1)", async ({
    page,
  }) => {
    await page.goto("/export/package", { waitUntil: "networkidle" });
    await seed(page);
    await page.reload({ waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: /I understand — continue/i })
      .click();

    // Wait for the assembled record (async) before reading text.
    await expect(
      page.getByRole("heading", { name: /Document manifest/i }),
    ).toBeVisible();

    const body = await page.locator("body").innerText();
    // An activity document and an income document both have id 1; the manifest must carry
    // DISTINCT namespaced references, not two colliding "DOC-1" rows.
    expect(body).toContain("ACT-1");
    expect(body).toContain("INC-1");

    // Both attachment images decode from real IndexedDB Blob bytes — the thing jsdom cannot
    // verify. naturalWidth > 0 proves the object URL resolved to a real image.
    const widths = await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs
          .filter((i) => (i as HTMLImageElement).src.startsWith("blob:"))
          .map((i) => (i as HTMLImageElement).naturalWidth),
      );
    expect(widths.length).toBe(2);
    expect(widths.every((w) => w > 0)).toBe(true);
  });

  test("prints both comparisons for a month with hours and income (semantic review #2)", async ({
    page,
  }) => {
    await page.goto("/export/package", { waitUntil: "networkidle" });
    await seed(page);
    await page.reload({ waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: /I understand — continue/i })
      .click();
    await expect(
      page.getByRole("heading", { name: /Document manifest/i }),
    ).toBeVisible();

    const body = await page.locator("body").innerText();
    // July holds both a work activity and income; the record states the hours comparison
    // AND the income comparison, never one at the expense of the other.
    expect(body).toMatch(/Logged: 90 hours/);
    expect(body).toMatch(/Threshold: 80 hours/);
    expect(body).toMatch(/Logged: \$300\.00/);
    expect(body).toMatch(/Threshold: \$580\.00/);
    // And no verdict.
    expect(body).not.toMatch(/\bcompliant\b/i);
  });

  test("hides the controls under print emulation and keeps the record (semantic review #9/#12)", async ({
    page,
  }) => {
    await page.goto("/export/package", { waitUntil: "networkidle" });
    await seed(page);
    await page.reload({ waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: /I understand — continue/i })
      .click();

    const printButton = page.getByRole("button", {
      name: /Print or save as PDF/i,
    });
    const recordHeading = page.getByRole("heading", {
      name: /HourKeep Activity Record/i,
    });

    // On screen the control is visible.
    await expect(printButton).toBeVisible();

    // Under print emulation the controls are display:none, the record is not.
    await page.emulateMedia({ media: "print" });
    await expect(printButton).toBeHidden();
    await expect(recordHeading).toBeVisible();
    await page.emulateMedia({ media: "screen" });
  });

  test("every month block self-identifies for fax (semantic review, ADR-0006)", async ({
    page,
  }) => {
    await page.goto("/export/package", { waitUntil: "networkidle" });
    await seed(page);
    await page.reload({ waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: /I understand — continue/i })
      .click();
    await expect(
      page.getByRole("heading", { name: /Document manifest/i }),
    ).toBeVisible();

    // Faxed pages arrive separated, so the name + case reference repeats on every month
    // block and every attachment. The <caption> self-id lines all start with the name
    // followed by an em-dash; there must be more than one.
    const body = await page.locator("body").innerText();
    const selfIdLines = body
      .split("\n")
      .filter((line) => /^Sam Rivera —/.test(line.trim()));
    expect(selfIdLines.length).toBeGreaterThan(1);
  });
});
