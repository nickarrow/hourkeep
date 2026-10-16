# W8a Data Integrity Review — Print Evidence Export

**Reviewer role:** Data integrity (read-only)
**Range:** `917bcd1..HEAD` (4 commits: 24b036f, 82081c6, bbb94dc, 77ea8b9)
**Governing rules:** `.kiro/steering/data-migration-standards.md`
**Question:** Can this diff lose or corrupt a user's data?

---

## Summary answer

**No data-loss or corruption defect found. The wave is safe to ship on data-integrity grounds.**

Every claim the wave makes checks out:

1. `db.ts` is untouched; `HourKeepDB` is still at version 6. The `exemptionId` field is unindexed
   data on an existing row, so no bump is required — this is exactly the "adding a field needs no
   version bump" case the standards call out.
2. Making `activityId` optional was handled by correcting **every** reader, not just making it
   compile. The dangerous reader — `cleanupOrphanedDocuments` — is fixed and pinned by a test with a
   proper positive twin.
3. Both new delete paths cascade correctly: documents + blobs first, parent last, and the parent is
   left intact if any document delete fails (no unreachable orphans).
4. The blob + metadata write is still atomic in a single Dexie transaction.
5. The package route revokes every object URL on unmount and never writes to the DB.
6. No raw `Date` month-boundary arithmetic; all month handling is string-based or display-only
   formatting at explicit local midnight.

One **non-blocking, pre-existing** observation about `deleteDocument` is noted at the end. It is not a
regression introduced by W8a.

---

## Evidence

### Claim 1 — No schema change, still at version 6 ✅

`git --no-pager diff 917bcd1..HEAD -- src/lib/db.ts` produced **empty output** (verified; the file is
also absent from `--stat`). The last `.version()` call in `src/lib/db.ts` is:

```
src/lib/db.ts:120:    this.version(6)
```

`exclusionDocuments.test.ts:120` asserts `db.verno === 6` at runtime, and that test passes. This
matches the doc-comment reasoning in `src/types/documents.ts` (the `exemptionId` field is unindexed
nested data) and the standards' rule: *".stores() declares the primary key and the indexes. It does
not declare stored fields… adding a field needs no version bump and no .upgrade()."* Compliant.

### Claim 2 — `activityId` optional: every reader found and corrected ✅

`grep -rn '\.activityId' src/` returns readers in four files. Each is correctly guarded:

- **`src/lib/storage/activities.ts:73`** (`cleanupOrphanedDocuments`) — the dangerous one. Filter is:
  ```ts
  (doc) => doc.activityId !== undefined && !activityIds.has(doc.activityId)
  ```
  The `activityId !== undefined` clause means an exclusion document (`activityId === undefined`) is
  **skipped**, not treated as an orphan. Without it, `!activityIds.has(undefined)` is `true` and the
  routine would delete every exclusion document — destroying evidence a live screening still points
  at. **Fix is correct.**
- **`src/hooks/useActivityDocumentCounts.ts:62`** — `if (doc.activityId === undefined) continue;`
  before using it as a Map key. The underlying query is `.where("activityId").anyOf(ids)`, which never
  returns a row with no `activityId`, so this is belt-and-suspenders for the type checker. Correct.
- **`src/lib/export/buildEvidencePackage.ts:178` and `:253`** — both read `activityId` only inside an
  `activityId !== undefined` guard (the month-filter and the manifest `linkedTo` label). Correct.

**Positive-twin test coverage** in `src/lib/storage/__tests__/exclusionDocuments.test.ts`:

- Negative (data-loss guard), lines ~191–207: an exclusion document survives
  `cleanupOrphanedDocuments` (`expect(deleted).toBe(0)`, blob count still 1).
- **Positive twin**, lines ~209–231: a genuinely orphaned activity document (points at
  non-existent activity id 999) **is still deleted** (`expect(deleted).toBe(1)`).

This satisfies the engineering-standards rule that every negative criterion needs a positive twin — a
guard that could be satisfied by disabling orphan cleanup entirely is explicitly prevented. 26 tests
across the three new suites pass (`npx vitest run` on the three files: `26 passed`).

### Claim 3 — New delete paths cascade correctly ✅

`deleteExclusionScreeningWithDocuments` (`src/lib/storage/exemptions.ts`) calls
`deleteDocumentsByExemption(screeningId)` **first**, then `db.exemptions.delete(screeningId)`. Because
`deleteDocumentsByExemption` (`src/lib/storage/documents.ts`) throws when any document delete fails,
the `await` short-circuits and the screening is **not** deleted — so the user keeps a reachable handle
to retry rather than being left with invisible orphaned blobs. This mirrors the
`deleteActivityWithDocuments` contract (`activities.ts:17–43`): collect failures, throw with a count,
don't delete the parent on failure.

Pinned by `exclusionDocuments.test.ts`:
- "removes the screening and every attached document and blob" — full cascade, blob count → 0.
- "leaves the screening in place if a document delete fails" — mocks `db.documentBlobs.delete` to
  reject, asserts the screening still exists afterward.
- "does not touch another screening's documents" — isolation.

Compliant with *"Deletes cascade explicitly… Orphaned blobs are invisible and unbounded."*

### Claim 4 — Blob + metadata write is atomic ✅

`saveDocumentRow` (`src/lib/storage/documents.ts:22–61`) performs the quota check, then wraps **both**
writes in one transaction:

```ts
return db.transaction("rw", db.documentBlobs, db.documents, async () => {
  const blobId = await db.documentBlobs.add({ blob, createdAt: new Date() });
  return db.documents.add({ ...metadata, ...link, blobId, createdAt: new Date() });
});
```

Both `saveDocument` (activity) and `saveExclusionDocument` (exclusion) funnel through this one
function, differing only in the `link` key. A failed metadata insert rolls the blob back, so a failed
write cannot orphan a blob. This upholds the W0 §0.6 invariant and the standards' orphan rule.

### Claim 5 — Package route leaks nothing and is read-only ✅

`src/app/export/package/page.tsx`:
- **Object-URL lifecycle:** every `URL.createObjectURL(...)` result is pushed to a `revoked` array
  inside the `useEffect`, and the effect's cleanup function runs
  `revoked.forEach((u) => URL.revokeObjectURL(u))`. All three URL-creating loops (activity, exclusion,
  income documents) register their URLs. No leak on unmount.
- **Read-only:** the data loader uses only `db.*.toArray()`, `db.*.get()`, and `getProfile()` (which
  decrypts for display per gap 8.8). `assemble()` calls `evaluateMonth` (reads income/seasonal state
  only) and the pure `buildEvidencePackage`. There is **no** `.add`/`.put`/`.delete`/`.update` call in
  the file. The route does not write to the DB. Compliant with *"Reads and writes go through
  src/lib/storage/"* and the read-only requirement.

### Claim 6 — Month-boundary date handling ✅

No raw `Date` arithmetic across month boundaries anywhere in the new/changed code:

- **`src/lib/evaluateMonth.ts`** — no `Date` construction at all; passes the `YYYY-MM` string straight
  to `calculateMonthlySummary` / `getMonthlyIncomeSummary`.
- **`src/lib/export/buildEvidencePackage.ts`** — `monthKey()` uses `.substring(0, 7)` (string).
  `monthLabel()` and `documentationHardened` use `new Date(month + "-01T00:00:00")`, which is a
  **display-only / point-comparison** parse at explicit local midnight — not boundary arithmetic
  (no `setMonth`/`getMonth`/day addition). `format(...)` then yields the correct month label.
- **`src/app/export/package/page.tsx`** — `monthRange(from, to)` splits `YYYY-MM` to integers and
  increments `m`/`y` with a `m > 12 → m=1, y+=1` rollover, bounded by a 240-iteration guard. Pure
  integer arithmetic on parsed components; **no `Date` object is ever created**, so there is no
  timezone drift at month edges.
- The seasonal-history label in `buildTextReport.ts` also uses `new Date(h.month + "-01T00:00:00")`
  purely for `format(..., "MMM yyyy")` display.

`grep` for `getMonth|setMonth|getDate|setDate|getTime|getFullYear|setFullYear` across the three target
files found only the display/comparison `new Date(... + "-01T00:00:00")` uses above and doc-comment
text — no arithmetic. Compliant with *"Dates: store an ISO date string, compare with date-fns. Never
new Date(...) arithmetic across month boundaries."*

---

## Conclusions and recommendations

**Verdict: APPROVED on data integrity.** The diff cannot lose or corrupt a user's data under the paths
reviewed. The schema claim is correct, the optional-`activityId` change was handled thoroughly with
test coverage that includes the required positive twin, both cascades are ordered to avoid orphans,
the write is atomic, the print route is read-only and leak-free, and date handling is drift-safe.

### Non-blocking observation (pre-existing, not introduced by W8a)

`deleteDocument` (`src/lib/storage/documents.ts:~190`) deletes the blob first and the metadata row
second, **outside a transaction**:

```ts
await db.documentBlobs.delete(document.blobId);  // (1)
await db.documents.delete(documentId);           // (2)
```

If (1) succeeds and (2) fails, the metadata row survives pointing at a now-missing blob. The new
cascade functions (`deleteDocumentsByExemption`, and the existing `deleteActivityWithDocuments`) both
reuse `deleteDocument`, so they inherit this window.

- **This is pre-existing.** `git show 917bcd1:src/lib/storage/documents.ts` confirms `deleteDocument`
  existed at the base commit and the W8a diff did **not** modify its body — it only added new callers
  around it. So it is **out of scope as a W8a regression** and should not block the wave.
- **Severity is low.** The failure is a dangling metadata row (not an invisible/unbounded orphan blob
  — the reverse direction, which the standards specifically warn about, cannot happen here because the
  blob is deleted first). A subsequent `cleanupOrphanedDocuments` or re-delete would not resurrect the
  blob, but the row is still reachable and removable.
- **Recommendation (future hardening, separate ticket):** wrap `deleteDocument`'s two deletes in a
  single `db.transaction("rw", db.documents, db.documentBlobs, …)` so the pair is atomic, matching the
  atomicity already applied on the write side in `saveDocumentRow`. Document the decision wherever the
  cascade contract is described.

No changes were made; this review implemented nothing.
