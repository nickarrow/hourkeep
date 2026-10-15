# Wave 6a — Evidence Capture

**Depends on:** **W2b** (thresholds and the credit-hour constant come from the policy profile),
**W5** (per-month evaluation), **W0** (characterization tests make the activity-model change safe).
All three are **done**.
**Blocks:** **W7a**, **W7b**, **W8a**.
**Source:** split out of [`wave-6-activity-model.md`](wave-6-activity-model.md), whose combined scope
also covers W6b. Read the **resolved-blockers note** at the top of that file first — three things were
settled on 2026-09-02 so they would not look like hard stops mid-wave.
**Written:** 2026-09-03, by re-verifying the combined file's claims against the tree. As with both prior
splits ([W2a](wave-2a-truth-in-copy.md), [W2b](wave-2b-policy-profile.md)), the source's site table was
short — numbers below are measured, not inherited.

---

## What the source got wrong — verified before any code

Both prior splits found the combined file's site tables short. This one is too, and two gap-row
assignments inside `waves/README.md` contradict each other. Recorded here so the correction is auditable,
per `engineering-standards.md` ("re-read the target before claiming a change is done").

**1. The `workProgram` change is 42 lines across 11 production files, not "a type-union change plus a
form option."** Measured by adding the union member and running `npx tsc --noEmit` (then reverting;
`git status` confirmed clean). The type checker catches **3 errors in 2 files**; the other readers fail
silently, which is the real reason this is a surface worth tabling.

| File | `Activity["type"]` sites | tsc flags it? |
|---|---|---|
| `src/components/ActivityForm.tsx` | 12 | yes (1) |
| `src/components/activities/ActivityFormHelp.tsx` | 9 | no (prop already widened) |
| `src/components/DateActivityMenu.tsx` | 5 | **yes (2)** — `activityIcons`/`activityColors` maps lack the key |
| `src/components/help/DocumentVerificationHelp.tsx` | 4 | no (prop not yet widened) |
| `src/components/ActivityList.tsx` | 4 | no (maps already have the key) |
| `src/components/help/EdgeCaseExamples.tsx` | 3 | no (prop already widened) |
| `src/types/index.ts` | 1 | — (the union itself) |
| `src/lib/calculations.ts` | 1 | **no — silent** |
| `src/lib/export/buildTextReport.ts` | 1 | **no — silent** |
| `src/components/DuplicateActivityDialog.tsx` | 1 | **no — silent** |
| `src/app/tracking/page.tsx` | 1 | no (passes through) |

The three silent readers are the dangerous ones. `calculations.ts`'s `switch` has no `default`, so a
`workProgram` row would contribute to **no bucket and no total** — already pinned by a characterization
test at `calculations.characterization.test.ts:84`, which names W6a. `buildTextReport.ts:159` would print
the raw union value capitalised ("WorkProgram"); `DuplicateActivityDialog.tsx:77` renders `activity.type`
verbatim.

`Activity["organization"]`, which the community-service schema supersedes, is a further **15 lines across
7 files** (a subset of the above plus `tracking/page.tsx` and `buildTextReport.ts`).

**2. Gap 4.5 is assigned to two waves.** `waves/README.md:242` gives W6a `4.1–4.7`; `:251` gives W6b
`4.5, 4.8`. The sequence diagram and this wave's brief both place **enrollment-period rules (§ 435.552(c))
in W6b**. Resolution: **4.5 is W6b's.** W6a's range as printed over-claims by one row.

**3. Gap 4.1's remainder is annotated `→ W6b, v8`** at `gap-analysis.md:171`, contradicting
`waves/README.md:242`, which assigns 4.1 to W6a. The `v8` gives away the cause: it assumed a Dexie
migration that the 2026-09-02 resolution disproved. Same root cause as the six stale `Depends on:` headers
the order sweep fixed. Resolution: **4.1 closes in W6a**, no v8 needed — the paid/in-kind/unpaid
distinction is unindexed data on an existing row.

**So W6a owns 12 rows, two already handled: 4.9 and 4.10 were CLOSED by W2a (copy), and 4.8 is `ok`
(impact `—`). The nine W6a can newly act on are 4.1, 4.2, 4.3, 4.4, 4.6, 4.7, 8.4, 15.23, 15.24. 4.11
(combination) is explicitly NOT claimed — see below.**

---

## The W6a / W6b boundary — decided and recorded

`waves/README.md` puts enrollment-period rules, validation, and `captureMethod` in W6b. This wave holds
that line. The distinction is **what a record must contain** (W6a) versus **when a status begins and ends,
and whether an entry is well-formed** (W6b).

| In W6a | In W6b | Why the line falls here |
|---|---|---|
| `workProgram` storable; work split paid/in-kind/unpaid | — | A stored shape, not a rule about time |
| Education **enrollment status** captured; half-time cliff enforced in totals | **Term/recess/end-of-month rules** (§ 435.552(c)) | Capturing status is a field; *when* a status begins and carries through a break is a temporal model W6b builds |
| Credit-hour **conversion** shown (§ 435.552(d)) | Education **backfill** of existing hours-only rows (v8) | Conversion is arithmetic on a value the user gives; backfill is an `.upgrade()` that transforms stored rows — v8, W6b |
| Community-service record **fields** | — | Structured data on an existing row |
| Caregiving hours logged as unpaid work | **Wiring from W4 screening answers** (autofill) | Logging is standalone; autofill needs W4, which is post-date |
| VA + SNAP/TANF document **types** | — | New `documents.type` values, no index |
| — | Per-day cumulative cap, future-date guards, `captureMethod` fix, `IncomeEntryForm` UTC/`setMonth` fixes | Validation and the camera/upload-provenance fix; `captureMethod` touches income too and belongs with that cluster |

**One place the no-new-table constraint nearly breaks, flagged deliberately.** § 435.552(c) enrollment is
a property of a *school term* — it spans months at zero logged hours. HourKeep's `Activity` is a per-day
hours row. Representing "enrolled half-time in October" therefore means a zero-hour `Activity` carrying a
status, which is ugly but needs **no new table and no new index**. A term-scoped `enrollments` table is
the clean shape — and it is a new table, so **W6a does not build it; it is W6b's**, alongside the term
rules it exists to serve. If a reviewer argues for it in W6a, the answer is: that triggers the
renumbering (W6a v7, W3 v8, W6b v9) across eight documents, which is a deliberate decision, not a side
effect — stop and raise it.

---

## Already decided — do not re-litigate (challenge only with evidence)

- **No Dexie version bump.** `.stores()` declares the primary key and indexes, not stored fields. Every
  field W6a adds is unindexed data on an existing `Activity` or `Document` row; `workProgram` and the new
  document types are new *values* in already-indexed fields. **`git diff src/lib/db.ts` must be empty at
  close.** Holds only while W6a adds no new table and no new index — if either becomes necessary, STOP and
  renumber. (`data-migration-standards.md`; ADR-0002; resolved-blockers item 1.)
- **Caregiving hours captured directly as unpaid work**, not wired from W4 (post-date). CMS's
  55 + 25 = 80 example works from logged hours alone (91 FR 33399; § 435.552(a)(5), (b)).
- **Existing education entries: status UNKNOWN, ask — never infer.** The school determines status
  (§ 435.552(c)), so it cannot be read off an hours figure. Missing status is `unknown` and prompts;
  no `.upgrade()` and no guess that understates the user. (resolved-blockers item 3.)

---

## The three cross-cutting decisions, made at planning and recorded here

**1. `engines.node` → `>=22.22.2`, CI Node pinned exactly.** Verified from the installed trees, not the
CHANGELOG: `jsdom@30.0.1` declares `^22.22.2 || ^24.15.0 || >=26.0.0`, `undici@8.10.0` declares
`>=22.19.0`, this machine runs `v22.18.0`, `engines.node` was `">=22"`, and CI's `node-version: "22"` is
unpinned. All 668 tests pass on an engine jsdom declares unsupported — luck, not verification. Fixed in
W6a as an isolated first commit because the suite runs hundreds of times this wave. This closes carried-
forward item 4a from `../README.md`, which W1 nominally owned but which gates nothing until lifted.

**2. `next` advisory → recorded in `ROADMAP.md`, bump left to W1.** `npm audit` confirms 9
vulnerabilities (8 high, 1 critical). The critical surfaces as **GHSA-9qr9-h5gf-34mp** (RCE in the React
flight protocol); I could not reproduce the "CVE-2025-66478" label anywhere in the audit output, so the
number carried in `../README.md` is corrected to the GHSA id. The vulnerable range is
`9.3.4-canary.0 – 16.3.0-preview.10`, so the fix is `next@16.3.0`, a **minor** bump separable from W1's
MUI 7→9 major. **But HourKeep is `output: "export"` with `images.unoptimized`, no middleware, no server
actions, no route handlers** (verified in `next.config.ts` and by search), so it ships no Next.js server:
nearly every advisory in the list is server-side (Server Actions, Middleware/Proxy, Image Optimizer, RSC
cache poisoning, dev HMR). The exposed surface is the build machine and `next dev`, not hourkeep.app.
That makes it a developer-environment issue, not a user-coverage one — documented with this reasoning and
left to W1 rather than bundled onto an activity-model wave.

**3. `MonthlySummary.isCompliant` — NOT renamed in W6a; stop computing a cliff-spanning verdict instead.**
The field was going to be the wave's sharpest hazard: once at-least-half-time education no longer combines,
`isCompliant = totalHours >= threshold` becomes a false negative for a half-time student (demonstrated
under § 435.552(a)(4), yet reported failing) — exactly the harm ADR-0003 § Context names. The rename to
`meetsHoursThreshold` is **W7b's** (named at `calculations.characterization.test.ts:255`), and an
identically-named `isCompliant` on `MonthlyIncomeSummary` with live readers is **W7a/W7b's**. Verified
that `MonthlySummary.isCompliant` has **zero production readers** — `Dashboard.tsx` recomputes
`meetsThreshold` locally, `tracking/page.tsx` deliberately carries hours. So the disciplined fix is not to
rename across W7b's boundary but to **make `calculateMonthlySummary` express the cliff**: education hours
at half-time-or-more are not summed into `totalHours` at all (they demonstrate separately), and the
hours-threshold boolean therefore never contradicts (a)(4). The field keeps its name until W7b retires it;
W6a changes what feeds it. Recorded so the next wave knows the rename is still owed.

---

## Goal

Make the activity model match § 435.552 — the right activity types, the right questions, and records that
would actually satisfy a verification request. CMS-2454-IFC, 91 FR 33348 (June 3, 2026).

## Primary-source anchors

Every claim below carries its CFR paragraph and FR page, resolved from
`docs/domain/cms-2454-ifc/2026-11094.txt`, not recalled.

| Claim | Citation | FR page |
|---|---|---|
| Work = money + in-kind + unpaid | § 435.552(b) "Work" | 91 FR 33470 (reg); 33354–33355 (preamble) |
| Caregiving under 80h counts as unpaid work; 55 + 25 example | § 435.552(a)(5), (b); § 435.554(c)(3)(i)(C) | 91 FR 33355, 33399 |
| Work program = closed list of five; DOL/VA veterans program **any** such program qualifies | § 435.552(b) "Work program"(iv) | 91 FR 33470 (reg); 33356 (preamble) — gap 15.23 |
| Standalone job search excluded; subsidiary if < half required hours | § 435.552(b) "Work program"(iii) | 91 FR 33470; 33356 |
| Education at least half-time qualifies on **zero hours**, may not combine | § 435.552(a)(4), (a)(5), (e)(1) | 91 FR 33470; 33360 |
| Enrollment status determined by the school | § 435.552(c) | 91 FR 33470 (reg); 33358 (preamble) — W6b owns the term rules |
| Credit-hour conversion `creditHours × 3 × 4.33`; 6 credits → 77.94 | § 435.552(d)(1) | 91 FR 33470–33471 (reg); 33359 (worked example) |
| Non-credit programs count actual hours 1:1 | § 435.552(d)(2) | 91 FR 33471 |
| Community service: structured, non-partisan, voluntary **or court-ordered**, oversight + tracking (type, dates, hours, POC who can confirm) | § 435.552(b) "Community service" | 91 FR 33470 (reg); 33355–33356 (preamble) |
| Verification schema adds org name + address, POC phone and/or email; "auditable manner" | § II.I.6.b | 91 FR 33399–33400 — gaps 4.7, 15.24 |
| May **not** restrict community service to § 501(c)(3) | § 435.552(b) | 91 FR 33356 — gap 4.8 (`ok`, copy already states it) |
| VA document, SNAP/TANF approval are reasonably-available docs | § II.I.3 / § II.I.6 | gap 8.4 |

## Scope

- **Add `workProgram`** to `Activity["type"]` and update all 11 readers. No migration — a new value in the
  already-indexed `type` field. The three silent readers (`calculations.ts`, `buildTextReport.ts`,
  `DuplicateActivityDialog.tsx`) are the ones a compile won't catch; each gets an explicit branch/label.
- **Broaden work** into `paid | in-kind | unpaid` (§ 435.552(b)). Captured as an optional sub-kind on the
  activity, because documentation expectations differ and in-kind/unpaid are where CMS says documentation
  may not exist. Caregiving hours log here as `unpaid`.
- **Education: capture enrollment status, not an hours question first.** Status is
  `at-least-half-time | less-than-half-time | unknown`, determined by the school. At least half-time →
  zero hours, cannot combine. Less than half-time → credit hours → conversion. Program type captured
  (higher ed / CTE / high school / HS-equivalency). **Term/recess rules are W6b.**
- **Credit-hour conversion module** (§ 435.552(d)) — new file, `policy: PolicyProfile = FEDERAL_DEFAULT`
  final parameter, reads the new `educationCreditHourConversion` policy field. Shows the arithmetic and
  the citation on screen: **Computed**, not Deferred (`compliance-copy-standards.md`). Non-credit 1:1.
- **Community-service record schema** — org name, address, POC name, POC phone and/or email, activity
  type + description, dates, hours, court-ordered flag. Progressive disclosure: hours + date first.
- **Document types** — add VA disability and SNAP/TANF approval (gap 8.4). New `documents.type` values.
- **4.33 is NOT shared with `PAY_PERIOD_MULTIPLIERS.weekly`.** That one is 52/12 rounded down, HourKeep's
  own invention, gap 5.4 `contradicts`, owned by W7a (warning at `payPeriodConversion.ts:42-59`). The
  Carnegie Unit is statutory. Same digits, separate constants.

## Explicitly out of scope (and why)

- **Gap 4.11 (combination) is NOT closed** — only marked PARTIAL with a reason. Combination is W7b's
  (gaps 5.11, 6.1, 6.2, 15.1). W6a makes the *inputs* correct; it does not build the combination engine.
  Claiming 4.11 would repeat W2b's "answerable, not closed" error.
- **Gap 4.5 (term/recess rules)** → W6b.
- **The `isCompliant` rename** → W7b (see decision 3).
- **Validation, `captureMethod`, income-form date fixes** → W6b.

## Acceptance criteria — each names an observable, every negative has a positive twin

- [ ] `workProgram` is storable: an activity saved with `type: "workProgram"` round-trips through
      IndexedDB (asserted in a storage test) **and** its hours appear in `calculateMonthlySummary`'s total
      and in a new `workProgramHours` bucket. Positive twin for the silent-switch defect: a `workProgram`
      row contributes its hours, where the characterization test proves it currently contributes zero.
- [ ] `workProgram` is selectable in `ActivityForm` and labelled in `ActivityList`, `DateActivityMenu`,
      `DuplicateActivityDialog`, and `buildTextReport` (no raw `workProgram`/`WorkProgram` string renders —
      asserted by a render test and a string check on the report output).
- [ ] Work distinguishes paid / in-kind / unpaid: an activity carries an optional `workKind`, it
      round-trips, and the export names it.
- [ ] Students are asked **enrollment status, not hours** when adding education: the form shows the status
      selector; the hours field is hidden/zero-valued at at-least-half-time (asserted by a render test
      driving both branches).
- [ ] Credit-hour conversion matches the CFR table: a test named `§ 435.552(d)(1), 91 FR 33471: 6 credit
      hours convert to 77.94 monthly hours` passes, plus 1→12.99 and 3→38.97; and a mutated-profile test
      proves the constant is injected, not literal.
- [ ] The conversion arithmetic is **visible on screen** with its citation (render test asserts "77.94"
      and the formula appear).
- [ ] Half-time-or-more education contributes **zero** to `totalHours` and cannot be combined: a test
      with 40 at-least-half-time education hours + 40 work hours reports a work total of 40, not 80, and a
      separate "demonstrated via education" signal. Positive twin: a *less-than-half-time* education entry
      of equal converted hours **does** combine.
- [ ] Community service captures org, address, POC name + contact, activity, dates, hours; a saved record
      round-trips every field; the export renders them. Positive twin for "evidence won't be rejected":
      the exported community-service block contains a POC contact line.
- [ ] Sub-threshold caregiving hours are loggable as unpaid work and counted (the 55 + 25 path): a 55-hour
      unpaid-work activity plus 25 work hours totals 80.
- [ ] VA and SNAP/TANF document types exist and are selectable (type list in `DocumentMetadataFormSimple`
      includes them; a document saved with each type round-trips).
- [ ] `git diff src/lib/db.ts` is empty; the browser shows `HourKeepDB` still at version 6.

## Risks

| Risk | Mitigation |
|---|---|
| The user's on-screen monthly total **drops** when half-time education stops folding into `totalHours` (40 + 40 reads 40, though the person is fine) | **Highest-harm risk, and it is a copy problem.** Education at half-time renders a distinct "this may be enough on its own — your state decides" panel, not a reduced number; the hours total is labelled as *combinable* activities only. Read it in the browser at 375px before closing (`../README.md` Playwright note) |
| `ActivityForm.tsx` is 930 lines, untested, imports `db` directly (against `component-standards.md`), and roughly doubles its conditional surface | Add the form logic behind small helpers; do **not** attempt a full storage-layer extraction mid-wave (that is its own change). Drive both education branches in the browser. Note the React Compiler `set-state-in-effect`/`immutability` errors here are invisible behind W1's `7.0.1` pin |
| Export/dashboard divergence: `buildTextReport.ts:143` re-reduces hours independently of `calculateMonthlySummary`, so after the cliff they disagree on the artifact a caseworker reads | Point `buildTextReport` at `calculateMonthlySummary` rather than its own `reduce`. This reaches into W8a's "one evaluation path" item — do the minimum (shared total) and flag the rest for W8a; **do not** build ADR-0004 combination logic here |
| Community-service form grows long enough to deter logging | Progressive disclosure: hours + date first, verification detail behind a "why this matters" expander |
| Users don't know their enrollment status | Offer "I'm not sure", say the school decides, prompt them to check — never silently guess (resolved-blockers item 3) |
| New components created without being added to the no-verdict render guard — the defect W2b committed twice | Add each new component to the guard **in the same commit that creates it**, and check new copy against `VERDICT_PHRASES`. Consider the inverted-allowlist meta-test (see Open questions) |

## Open questions carried into execution

- **Should the no-verdict render guard become a meta-test** enumerating `src/components/**` against the
  guard's imports (inverted allowlist, like `DEAD_FILE_ALLOWLIST`)? It is hand-maintained today and
  nothing goes red when a new component is forgotten — which is how W2b shipped two fresh verdicts. Decide
  during execution; if adopted, seed the allowlist from today's unguarded set so it is not a mass rewrite.
- **`buildTextReport` sharing `calculateMonthlySummary`** touches W8a's territory. Confirm the minimal
  shared-total change is enough for W6a and leave the full single-entry-point to W8a/W7b.

## Definition of done (from `waves/README.md`, with W6a specifics)

`npm run build` + `npx tsc --noEmit` clean · `npm test` green, domain changes TDD-first · `npm run lint` /
`format:check` clean · **`npm ci` succeeds** · **`npm run test:e2e` green** (the activity model is browser-
visible) · copy review: no new verdict, every number labelled Computed/Conditional/Deferred, no new policy
literal · every domain claim cites CFR + FR page · the review protocol
(`.kiro/hooks/wave-review.kiro.hook`) run, findings verified against primary source · gap rows struck with
the wave number and **a closure line written in `gap-analysis.md`** (W0 and W5 skipped it) · `CHANGELOG.md`
updated · phone-viewport smoke test, offline.
