# Wave 6 — Activity Model Correction

**Depends on:** ~~W2 (profile), W5 (per-month evaluation)~~ → **W2b** (thresholds and the credit-hour
constant come from the profile), **W5** (per-month evaluation), **W0** (characterization tests make the
activity-model change safe). All three are **done**.
**Blocks:** ~~W7~~ → **W7a**, **W7b**, **W8a**. Header corrected 2026-09-02 for the W2/W6/W7/W8 splits.
**Detail level:** goals and scope. Task breakdown when the wave starts.

> ### Three things resolved before W6a starts — 2026-09-02
>
> **1. W6a needs no Dexie version bump, and the plan predicted otherwise twice.** `data-migration-standards.md`
> assigns **v7 to W3** and **v8 to W6b**, both after the December date, which looked like a hard blocker for a
> wave whose whole subject is new activity data. It is not one.
>
> **Dexie's `.stores()` declares the primary key and indexes only — not stored fields.** `db.ts` declares
> `activities: "++id, date, type"` while `Activity` already stores `hours`, `organization`, `createdAt` and
> `updatedAt`, none of them indexed and none of them ever migrated. W5 wrote the same reasoning into
> `ReviewPeriodAnchor`'s doc comment when it added `onboardingContext.reviewPeriodAnchor` without a bump.
>
> **And ADR-0002 already said so** — "adding `\"workProgram\"` to `Activity[\"type\"]` is a **TypeScript union
> change, not a schema change** — Dexie indexes `type` but does not constrain its values." The scope line
> below contradicted its own decision record for weeks. Worth remembering the direction: here the **ADR was
> right and the wave file was wrong**, which is the reverse of the usual failure.
>
> So every field W6a adds — community-service organization, address, point-of-contact name and contact,
> activity description; education enrollment status, credit hours, program type; the paid/in-kind/unpaid
> work distinction — is **unindexed data on an existing row and needs no `.stores()` change**. Adding
> `workProgram` to `Activity["type"]` is a new *value* in an already-indexed field, not a new field, so it
> needs no bump either. Same for new `documents.type` values.
>
> **Two conditions keep it true, and W6a must hold both:** add **no new table** (community-service fields
> hang off `Activity`, they are not a new store) and add **no new index**. If either becomes necessary,
> stop — the resolution is then to renumber (W6a v7, W3 v8, W6b v9) rather than to squeeze into W3's bump,
> and that renumbering touches eight documents.
>
> **The one thing that genuinely needs an `.upgrade()` is already assigned elsewhere.** Backfilling existing
> education entries is `data-migration-standards.md`'s **v8, owned by W6b** — "including the education
> backfill". W6a does not do it, and the risk table's "migration marks them as less-than-half-time" is
> therefore **not W6a's** and is the wrong answer anyway; see item 3.
>
> **2. The caregiving bullet cannot wire from W4, and does not need to.** Its scope line says "wire this
> from the W4 screening answers", and **W4 is post-date**. Decision: W6a captures caregiving hours directly
> as unpaid work, standalone. The § 435.552(b) rule needs somewhere to log hours, not W4's exclusion
> screening — CMS's 55 caregiving + 25 other = 80 example works from logged hours alone. Wiring the screening
> answers through is an autofill convenience and belongs to W4 or W7b.
>
> **3. Existing education entries have hours and no status, and the honest answer is to ask.** The risk table
> below proposes a migration marking them less-than-half-time with hours preserved. That guesses, in the
> direction that **understates** the user — less-than-half-time forces the hours test, when at-least-half-time
> qualifies on zero hours (§ 435.552(a)(4)). Enrollment status is **determined by the school**, so the app
> cannot infer it from an hours figure at all. Treat missing status as **unknown and prompt for it**, which
> is more correct, matches "uncertainty is content", and is what removes the need for an `.upgrade()`.

## Goal

Make the activity model match § 435.552 — the right activity types, the right questions, and records that
will actually satisfy a verification request.

## Scope

- **Add `workProgram`** to `Activity["type"]`. It already exists in help text, list labels, and colors but
  **cannot be stored**, so job-training hours are currently mis-filed as work or education. A type-union
  change plus a form option — ~~Dexie migration~~ **no Dexie migration**: `type` is already an index and
  this adds a value to it, not a new field. Corrected 2026-09-02; see the note above.
- **Broaden work** (§ 435.552(b)) into three sub-kinds: for money, in-kind, and unpaid. Capture the
  distinction, since documentation expectations differ — in-kind and unpaid work are exactly the cases where
  CMS acknowledges documentation may not exist.
- **Education: replace hours with status.** § 435.552(a)(4): at least half-time is qualifying on its own
  with **zero hours** and **cannot be combined**. Ask for enrollment status — which the **school**
  determines — not hours. Only if less than half-time do we ask for credit hours.
- **Credit-hour conversion** (§ 435.552(d)): `creditHours × 3 × 4.33`. Show the arithmetic, because 6
  credits landing at 77.94 rather than 80 will surprise people and needs explaining. Non-credit programs
  count actual class and activity hours 1:1.
- **Enrollment period rules** (§ 435.552(c)): status begins the first day of term, continues through
  vacation and recess at the pre-break status, and ends at month-end on expulsion, withdrawal,
  non-registration, or graduation. Model program type too — higher ed, CTE, high school, State-approved
  equivalency.
- **Community service record schema** (§ 435.552(b) and § II.I.6.b) — the current optional free-text
  `organization` field will not satisfy a verification request. Capture: organization name and address;
  point-of-contact name with phone and/or email **who can confirm the hours**; activity description; dates;
  hours. Note that court-ordered service counts and that the organization need not be a § 501(c)(3).
- **Caregiving hours as unpaid work.** A family caregiver who fails § 435.554(c)(3)(i)(C) — unrelated,
  non-resident, under 80 hours — still counts those hours as unpaid work. CMS's example: 55 caregiving hours
  plus 25 other hours qualifies. Wire this from the W4 screening answers.
- **Document types.** Add VA disability and SNAP/TANF approval notice, both named by CMS as reasonably
  available documentation.
- **Validation.** Per-day cumulative cap so three 10-hour entries on one date don't silently produce `30h`.
  Future-date guards, which activities currently lack entirely. Fix the `IncomeEntryForm` UTC-vs-local
  comparison and the `setMonth` overflow.
- **Fix `captureMethod`**, currently hardcoded `"camera"` at five call sites, so uploads are recorded and
  displayed as camera captures.

## Acceptance criteria

- [ ] `workProgram` is storable, selectable, and counted in totals
- [ ] Work distinguishes paid, in-kind, and unpaid
- [ ] Students are asked enrollment status, not hours; half-time-or-more requires no hours
- [ ] Credit-hour conversion matches the CFR table (6 credits → 77.94), with visible arithmetic
- [ ] Half-time-or-more education cannot be combined with other activities
- [ ] Community service captures organization, address, POC name and contact, activity, dates, hours
- [ ] Sub-threshold caregiving hours flow into work hours
- [ ] VA and SNAP/TANF document types exist
- [ ] Per-day cumulative validation and future-date guards work
- [ ] `captureMethod` reflects reality

## Risks

| Risk | Mitigation |
|---|---|
| Community service form becomes long enough to deter logging | Progressive disclosure: hours and date first, verification detail second, with a clear "why this matters" |
| Users don't know their enrollment status | Say the school decides; offer "I'm not sure" and prompt them to check — never silently guess |
| Existing education entries have hours but no status | ~~Migration marks them as less-than-half-time with hours preserved, and flags them for user review~~ **Superseded 2026-09-02 — see item 3 above.** Marking them less-than-half-time guesses in the direction that understates the user, and the school determines status so it cannot be inferred from an hours figure. Treat missing status as **unknown**, preserve the hours, and prompt. Also removes the need for an `.upgrade()`, which W6a does not own |
