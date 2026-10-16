# W6a — Data-Integrity Review (read-only)

**Scope:** Verify W6a's central claim that the Evidence Capture wave needs **no Dexie
version bump**, and that none of its new fields, new union values, or new document types
can corrupt or silently drop a user's IndexedDB records.

**Verdict: PASS.** The claim holds. W6a adds unindexed data to existing rows and new
*values* to already-indexed fields. `db.ts` is genuinely untouched, there is no new table
and no new index, and the one failure mode that could exist (Dexie not persisting the new
properties) is pinned by a round-trip test that passes. No migration is present, which is
correct — there is nothing to migrate. One pre-existing, non-blocking storage-layer
observation is noted at the end; it is not introduced by W6a and does not threaten data.

Everything below was verified against the working tree, the git state, `tsc`, and a test
run — not inferred from the type checker alone.

---

## 1. Is `src/lib/db.ts` genuinely unchanged?

**Yes. Confirmed empty diff.**

- `git --no-pager diff HEAD -- src/lib/db.ts` → **no output, exit 0** (empty).
- `db.ts` does **not** appear in the full changed-files list for the W6a work
  (`git diff --name-status` against upstream across the wave range lists 80 paths; `src/lib/db.ts`
  is not among them).
- Read of `src/lib/db.ts`: schema is still **version 6**, the highest `this.version(...)`
  block. The activities store is declared exactly `activities: "++id, date, type"`
  (`db.ts`, version 6 `.stores()` block, and identically in versions 1–5). `documents` is
  `"++id, activityId, type, createdAt"`.

This matches the resolved-blockers mandate: `git diff src/lib/db.ts` must be empty at close.
It is.

Rule: `.kiro/steering/data-migration-standards.md` → "Most changes need no version at all …
`.stores()` declares the primary key and the indexes. It does not declare stored fields."

---

## 2. Are the new fields unindexed data, or do any need a new index / new table?

**All new fields are unindexed properties on the existing `activities` row. No new table,
no new index. No bump required.**

New `Activity` fields (`src/types/index.ts`, `Activity` interface, lines ~119–145):

| Field | Type | Indexed? |
|---|---|---|
| `workKind` | `"paid" \| "in-kind" \| "unpaid"` | No — plain property |
| `enrollmentStatus` | `ActivityEnrollmentStatus` | No |
| `educationProgramType` | `EducationProgramType` | No |
| `creditHours` | `number` | No |
| `communityService` | `CommunityServiceDetails` (nested object) | No |

The `activities` index set is `++id, date, type`. None of the five new fields is named in
`.stores()`, so Dexie persists them as ordinary row properties — the same pattern as the
long-standing unindexed `hours`, `organization`, `createdAt`, `updatedAt`. This is exactly
the precedent the steering doc cites and the one W5 used for `onboardingContext`
(documented in the `ReviewPeriodAnchor` doc comment in `src/types/index.ts`).

`MonthlySummary.workProgramHours` (`src/types/index.ts`, line ~151) is a **computed, not
stored** type (`MonthlySummary` is annotated "Calculated, not stored"), produced by
`calculateMonthlySummary` — no storage impact at all.

`CommunityServiceDetails` (`src/types/index.ts`) is a nested object stored whole on the
row; all its sub-fields are optional, so a record can be created with just hours + date and
filled in progressively. Nested objects are stored structurally by IndexedDB — no index,
no concern.

**Conclusion:** no new table, no new index → the "only these need a version" list in the
steering doc (new table / new index / backfill-or-transform) is not triggered.

---

## 3. Does `workProgram` as a new VALUE in the already-indexed `type` field work without a bump? Is there a round-trip test?

**Yes, and yes.**

- `Activity["type"]` becomes `"work" | "volunteer" | "education" | "workProgram"`
  (`src/types/index.ts`, line ~127). `documents.ts` likewise adds `"va-disability"` and
  `"snap-tanf-approval"` to `DocumentType` (`src/types/documents.ts`).
- Adding a value to an already-indexed field is explicitly free per the steering doc:
  "Adding a **value** to an already-indexed field (a fourth `Activity["type"]`, a new
  `documents.type`) is likewise free; it is a new value, not a new field." This also matches
  ADR-0002's stated position.
- **Round-trip test present and passing:**
  `src/lib/storage/__tests__/activityFields.roundtrip.test.ts`. It uses `fake-indexeddb/auto`
  against the real `db`, and covers:
  - a `workProgram` activity stored and read back (`§ 435.552(a)(3)`);
  - `workKind` persistence (`§ 435.552(b)`);
  - education `enrollmentStatus` / `educationProgramType` / `creditHours`
    (`§ 435.552(c),(d)`);
  - an at-least-half-time row stored with **zero hours** (the cliff, persisted);
  - a full `communityService` record `toEqual`-compared on read;
  - **querying the `type` index by the new value** (`.where("type").equals("workProgram")`)
    — proving the index did not need rebuilding;
  - both new document types round-tripping.
- **Run result:** `npx vitest run` over the round-trip + calculations + workProgram +
  education suites → **4 files, 42 tests passed**. `npx tsc --noEmit` → **clean (exit 0)**.

The test file's own header states the intended guard: "If any of this needed a version bump,
this test fails and the wave stops to renumber (resolved-blockers item 1)." It does not fail.

---

## 4. Does any reader of `Activity.type` remain unupdated?

**No unhandled reader found.** Every reader either exhaustively handles the union via a
compiler-enforced `Record` / typed map, or explicitly branches on `workProgram`.

Verified readers (grep across `src/` for `activity.type`, type maps, and `case "work"…`):

| Reader | File | Handling of `workProgram` |
|---|---|---|
| Hour aggregation | `src/lib/calculations.ts` (switch on `activity.type`) | **Explicit `case "workProgram"`** adds to `workProgramHours`; comment notes the pre-W6a switch had no `default`, so a `workProgram` row contributed nothing. Fixed. |
| Display labels | `src/lib/activityDisplay.ts` `ACTIVITY_TYPE_LABELS` | `Record<Activity["type"], string>` → compiler-enforced; includes `workProgram: "Job Training"`. |
| Chip colors | `src/lib/activityDisplay.ts` `ACTIVITY_TYPE_CHIP_COLORS` | `Record<Activity["type"], …>` → enforced; includes `workProgram`. |
| List chips | `src/components/ActivityList.tsx` | Aliases the central maps (`= ACTIVITY_TYPE_CHIP_COLORS` / `_LABELS`). |
| Date menu | `src/components/DateActivityMenu.tsx` | Label via central map; **local `activityIcons` is `Record<Activity["type"], …>`** (enforced, includes `workProgram`), and **local `activityColors` is `as const` with `workProgram: "secondary"`** present. No silent gap. |
| Text export | `src/lib/export/buildTextReport.ts` | Uses `ACTIVITY_TYPE_LABELS[activity.type]`; comment notes the old `capitalize` trick would have rendered the raw `"WorkProgram"`. Fixed. |
| Doc-verification help | `src/components/help/DocumentVerificationHelp.tsx` | Explicit `case "workProgram"` (falls back to work examples, flagged as help-content follow-up, not W6a). |
| Form init | `src/components/ActivityForm.tsx` | Reads `existingActivity.type`; renders the type picker from an `as const` list including `workProgram`. |

`activityDisplay.ts`'s doc comment records the exact risk this centralization closes:
`DateActivityMenu` previously rendered the raw union value through `textTransform: capitalize`,
so `workProgram` would have shown as "WorkProgram". The `Record<Activity["type"], …>` typing
now forces the compiler to require a label/colour/icon for every type — which is why `tsc`
passing is itself meaningful here, not just a courtesy. I did not rely on the type checker
alone: the grep sweep found no bare/partial map and no `switch` without a `workProgram`
branch among live readers.

The `MonthlySummary` consumers were also checked: the no-verdict render guard fixtures
(`src/__tests__/no-verdict.render.test.tsx`) and `calculations.characterization.test.ts`
both include `workProgramHours: 0` in their summary shapes.

---

## 5. Existing education rows: treated as `unknown` and asked, or guessed/migrated?

**Treated as `unknown` and asked. No migration, no inference from hours.** This is the
single most important correctness point and it is handled correctly.

- `src/components/ActivityForm.tsx`, the init `useEffect`:
  ```
  setEnrollmentStatus(
    existingActivity.type === "education"
      ? (existingActivity.enrollmentStatus ?? "unknown")   // ask, do not guess
      : (existingActivity.enrollmentStatus ?? ""),
  );
  ```
  An existing education row with hours and no stored `enrollmentStatus` is loaded as
  `"unknown"`, and the form **requires** the user to choose a status (`validate()`:
  `type === "education" && !enrollmentStatus` → error "Choose your enrollment status, or
  'I'm not sure' to check with your school"). The radio group offers "I'm not sure"
  (`unknown`) as a first-class choice with help text "Your school decides this, not you and
  not your state."
- `src/lib/education.ts`: `"unknown"` is a first-class value in `EnrollmentStatus`;
  `educationContribution` returns `{ kind: "status-unknown", combinableHours: 0 }` for it —
  contributes nothing, prompts the user to ask, never a guess. The module header states:
  "Missing status is `"unknown"` … never a guess that understates them."
- **No `.upgrade()` and no backfill exist** — consistent with "do NOT migrate; that is
  W6b's v8." The steering doc assigns the education backfill to **v8 / W6b**; W6a correctly
  leaves old rows untouched. Confirmed: `db.ts` is unchanged (point 1), so there is no
  migration code at all.

Direction of safety is correct: the resolved-blockers note warns that migrating existing
education entries to less-than-half-time "guesses in the direction that understates the
user." W6a does the opposite — it defers to the school via an explicit `unknown` + prompt.

Rule: `.kiro/steering/data-migration-standards.md` → "prefer leaving old rows alone and
treating a missing field as **unknown** … When a field is genuinely absent, say so in the UI
and ask."

---

## 6. Dates: `date-fns` / ISO strings, no raw `Date` arithmetic across month boundaries?

**No month-boundary arithmetic introduced.** Activity dates are ISO `YYYY-MM-DD` strings and
month filtering is string-prefix based.

- `Activity.date` is `string // YYYY-MM-DD` (`src/types/index.ts`).
- `src/lib/calculations.ts` filters a month with `activity.date.startsWith(month)` against a
  **validated** `YYYY-MM` needle (`isValidMonth`). The file documents why: string comparison
  "cannot drift across a timezone boundary," the exact month-edge bug class the steering doc
  names. No `new Date(...)` arithmetic.
- `src/lib/education.ts` performs **no date handling** — purely a credit-hour arithmetic
  module (`creditHours × hoursPerCreditPerWeek × weeksPerMonth`, constants from the policy
  profile).
- `src/components/ActivityForm.tsx`: date values come from native `type="date"` inputs that
  already yield ISO `YYYY-MM-DD` strings stored directly on `date`. The two `new Date(...)`
  uses are **display-only** (`new Date(d + "T00:00:00").toLocaleDateString(...)` for a chip
  label) and ISO-string **construction** from a picked date (`getFullYear()/getMonth()+1/
  getDate()` padded into `YYYY-MM-DD`). Neither does cross-month arithmetic. The multi-day
  path collects discrete date strings into an array and writes one row per date — no range
  math.

Rule: `.kiro/steering/data-migration-standards.md` → "store an ISO date string, compare with
`date-fns`. Never `new Date(...)` arithmetic across month boundaries."

---

## Policy-literal and no-verdict posture (spot checks within scope)

Not the primary charge, but adjacent to data integrity and worth recording:

- **No hardcoded policy values** in the W6a logic. `education.ts` reads
  `hoursPerCreditPerWeek` and `weeksPerMonth` from `policy.educationCreditHourConversion`
  and takes `policy: PolicyProfile = FEDERAL_DEFAULT`; `calculations.ts` reads
  `policy.requiredHours`. The `4.33` in the credit formula is the policy value, correctly
  **not** collapsed with `PAY_PERIOD_MULTIPLIERS.weekly` in
  `src/lib/utils/payPeriodConversion.ts` (that stays W7a's concern).
- **No-verdict coverage:** the new W6a copy lives inside the pre-existing, already-covered
  `ActivityForm.tsx`; it adds no brand-new rendering component. The source-scan guard
  (`src/__tests__/no-verdict.source.test.ts`) walks every `.tsx?`/`.md` file recursively, so
  the new strings are scanned. Education/community-service copy is phrased as Computed facts
  with citations ("× 3 × 4.33 = 77.94 hours … 42 CFR 435.552(d)") and "Your state decides" —
  no verdict asserted. `isCompliant` on `MonthlySummary` is a **pre-existing** verdict-named
  field (slated for rename in W7b per its comment), not introduced by W6a.

---

## Conclusions

1. **The no-bump claim is correct and verified by evidence, not assertion.** `db.ts` diff is
   empty; the file is version 6 with `activities: "++id, date, type"`; no new table or index
   exists.
2. **New fields are unindexed row data; new union/document values are free.** The one real
   risk — Dexie silently not persisting them — is covered by a passing round-trip test that
   also exercises the `type` index with the new value.
3. **No reader of `Activity.type` is left behind.** Live readers are either
   compiler-enforced `Record` maps or carry an explicit `workProgram` branch; the grep sweep
   found no partial map.
4. **Existing education rows are handled honestly** — loaded as `unknown`, the user is asked,
   nothing is migrated or inferred. This defers the backfill to v8/W6b exactly as required.
5. **No month-boundary date arithmetic is introduced.**

## Recommendations

- **No code changes required for data integrity.** W6a may proceed to close on this axis.
- **Keep the invariant visible at close:** confirm `git diff src/lib/db.ts` is empty in the
  closeout notes (it is now), since the whole no-bump argument rests on it. If any later W6a
  edit adds an index or table, the resolved-blockers protocol (STOP → renumber W6a v7 /
  W3 v8 / W6b v9) must trigger.
- **(Pre-existing, non-blocking) storage-layer boundary:** `ActivityForm.tsx` writes new
  activities via `db.activities.add(...)` directly (the `else` branch of `handleSave`),
  bypassing `src/lib/storage/`. The steering doc says "No component touches Dexie directly."
  This predates W6a (the direct `add` and the `import { db }` batch pattern are unchanged in
  intent; W6a only threaded the new fields through the existing call). It is a layering
  concern, **not** a data-integrity risk — the fields round-trip correctly either way — but
  it is the natural place a future reader/writer refactor (W6b/W7) should route activity
  writes through a storage module. Flagged for awareness, not for W6a to fix.

---
*Read-only review. Nothing was modified. Verification run: `git diff HEAD -- src/lib/db.ts`
(empty), `npx tsc --noEmit` (clean), `npx vitest run` over the W6a logic + round-trip suites
(4 files / 42 tests passed).*
