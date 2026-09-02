# Wave 2b — Policy Profile

**Split from:** [`wave-2-truth-and-policy-profile.md`](wave-2-truth-and-policy-profile.md). W2b owns
**§ 2.1 only** — the policy profile and the removal of every policy literal. W2a owned §§ 2.2–2.6 and is
complete (`de36a3d`, `c93c3e7`).
**Depends on:** **W0** (characterization tests are what make the threshold refactor safe) and **W5**
(`ReviewPeriodPolicy` exists and is the thing being moved).
**Blocks:** W3 (status resolution reads the profile), W6a (thresholds and the credit-hour constant),
W9a (deadline values).
**Decision records:** ADR-0001 (the profile), ADR-0003 (Computed / Conditional / Deferred).
**Gap rows:** **5.6**, **R8.1**, and **15.6 / 15.7** inherited from W5 on 2026-09-02.
**User-visible outcome:** small. This wave is mostly structural — but it is the last wave before three
others that cannot start without it, and it closes two transition-rule gaps that were nobody's until now.

---

## Provenance of this file

Written 2026-09-02, at the start of the wave. W2a's precedent: re-verifying `wave-2`'s § 2.5 site table
against the code found **nine** errors before any code was written, and the guard test found **seven**
more. `engineering-standards.md` says to assume this document's bookkeeping is no better. It was not.

Every count below was produced by a command. Where a figure came from an existing document and disagreed
with the code, the code won and the disagreement is recorded rather than silently corrected.

### Five corrections to the inherited documents

**`[P1]` The W2a → W2b handoff table is short by 18 lines and 7 files.**
It records **42 policy-literal lines across 7 files**, computed at W2a's close against `5b4b27f`. Re-running
its own documented pattern against today's tree gives **60 real lines across 14 files**. Full working in
§ 2.1.2 below. The gap is not drift from W5 — W5 *removed* four literals — it is that the table only ever
covered files W2a happened to edit.

**Four files carrying real literals appear in no site table at all**, neither `wave-2` § 2.1 nor the W2a
handoff: `components/help/HourTrackingHelp.tsx` (4), `components/assessment/EstimationTools.tsx` (4),
`components/assessment/NoticeQuestion.tsx` (1), `app/settings/page.tsx` (1). A fifth,
`lib/utils/payPeriodConversion.ts` (4), is named in ADR-0001's own header — "Supersedes: the ad-hoc
constants in `src/lib/utils/payPeriodConversion.ts`" — and still appears in neither table.

**`[P2]` `HourTrackingHelp.tsx` is live, and its problem is bigger than its literal count.**
`Dashboard.tsx:88` renders it on the primary tracking surface. Two of its sentences are substantively
wrong, not merely un-parameterised:

- *"To meet Medicaid work requirements, you need to complete 80 hours per month of qualifying
  activities."* — asserts the requirement applies, to a user who may be a specified excluded individual
  (§ 435.554), and whose State is then **prohibited** from assessing them (§ 435.556(c)).
- *"Job searching does NOT count as a qualifying activity. If you lose your job, you need to volunteer, go
  to school, or join a work program to meet the 80-hour requirement."* — **contradicts W2a's own
  correction.** W2a fixed exactly this claim in `activityDefinitions.workProgram`, adding § 435.552's
  subsidiary-activity nuance. So the app now states both versions and the wrong one sits on the tracking
  page. The list is also presented as exhaustive while omitting income (§ 435.552(a)(6)), the
  income-to-hours proxy (§ 435.552(e)(2)), and half-time education (§ 435.552(a)(4)).

**None of the 29 `VERDICT_PHRASES` match either sentence.** "you need to" is not on the list. This is the
same structural hole as W5's — five new components absent from the render guard — found before review
rather than during it.

**`[P3]` `FEDERAL_DEFAULT_REVIEW_PERIOD` is not a two-line diff.**
`README.md`'s W2b callout and `wave-5-month-scoping.md` both say the move is two lines because
"every consumer already takes it as an optional parameter". The optional-parameter part is true and load
bearing. The two-line part is not: `grep` returns **27 references** — the declaration plus five default
parameters in `reviewPeriod.ts`, **five in `app/tracking/page.tsx`** (lines 51, 153, 188, 196, 199), about
twenty in `reviewPeriod.test.ts`, and two in `no-verdict.render.test.tsx`. The rename is mechanical and
compiler-guided, but it is not two lines, and planning it as two lines is how the last item in a wave gets
squeezed.

**`[P4]` "W0 characterization tests pass unchanged" contradicts W0's own test file, and W0 is right.**
`wave-2`'s fourth W2b criterion requires the W0 characterization tests to pass unchanged, as the proof the
refactor is behaviour-neutral. But `payPeriodConversion.characterization.test.ts` contains a block named
`describe("W2b POLICY-LITERAL SNAPSHOT — expected to move to src/lib/policy/")`, whose header says: *"When
W2b runs, this block should be deleted or rewritten against the policy profile."*

W0's file is the more careful document. It draws a distinction the criterion does not:

> *"a failing contract test in W2b means the refactor broke something; a failing snapshot test means the
> refactor did its job."*

**Resolution:** the criterion is rewritten to bind the **contract** tests, which must pass unchanged, and
to require the **snapshot** block to be relocated with its values preserved. Restated in the acceptance
criteria with both halves named.

**`[P5]` One apparent contradiction is not one.** `rule-extract.md` § 10 cites `implementationDate` to
**§ 435.559(b)**; `state-options.md` cites it to **§ 435.559(a)**. Checked against the raw text at
91 FR 33478: (a) sets the federal January 1, 2027 date, (b) is the State's election to implement earlier.
Both are right about different things. `FEDERAL_DEFAULT` cites **(a)** for the value and names **(b)** as
the election path. Recorded because a reader comparing the two documents would reasonably conclude one was
wrong.

**`[P6]` The schema has 33 fields, not 30 — and one of them duplicates a W5 field.**
Two counts corrected before any code was written.

*The 30.* Earlier planning for this wave, including the exchange that approved its scope, said
`state-options.md` declares 30 fields. Counted by command against the `PolicyProfile` block, it declares
**33**. The 30 was probably a slip from "at least sixteen parameters to State election", which is a count of
*elections* and a different quantity from a count of *fields* — the schema also carries identity, provenance
and statutory values. Recorded rather than quietly fixed, because this is precisely the class of error
`engineering-standards.md` exists to catch, and it survived into a document whose job is to catch it.

*The duplicate.* `state-options.md`'s **`renewalIntervalMonths`** ("6 for adult group; 12 for AI/AN and most
1115") and W5's **`renewalPeriodMonths`** ("how LONG the eligibility period is assumed to be, in months")
are the same quantity under two names. Both default to 6, and both trace to § 1902(e)(14)(L) rather than to
this rule. Carrying both would ship exactly the duplication `[S3]` chose `Pick` to avoid, so they merge:
`renewalIntervalMonths` survives, `renewalPeriodMonths` does not, and W5's `renewalPeriodMonthsSource`
becomes `renewalIntervalMonthsSource`. `renewalReviewPeriodEndingAt` reads the merged field.

**So `[S3]` adds three fields, not four:** `applicationLookbackBounds`, `verificationMonthsRequired`, and
`renewalIntervalMonthsSource`. **Implemented field count: 33 − 1 (`incomeThreshold` becomes a function,
`[S1]`) + 3 = 35** — and `state-options.md`, amended, now declares exactly those 35.

### Verified citations

Pulled from `docs/domain/cms-2454-ifc/2026-11094.txt` and paged by locating the nearest preceding
`[[FR p.]]` marker, not by recall. W5's review found zero citation errors using this method after W0's
found two without it.

| Provision | FR page | Note |
|---|---|---|
| § 435.552(a)(1)–(7) | **91 FR 33470** | (a)(6) cites the wage as "the applicable minimum wage requirement under section 6 of the Fair Labor Standards Act of 1938 (29 U.S.C. 206(a)(1)(C)), multiplied by 80 hours" |
| § 435.556 | 91 FR 33473 | (a)(2) continues onto 33474 |
| § 435.557 | 91 FR 33474 | includes (b)(2)(i)/(ii), the 2028 documentation hardening |
| § 435.558(a)(2) | 91 FR 33476 | 30 calendar days from receipt |
| § 435.558(c)(4) | **91 FR 33477** | "considered to be received 5 days after the date on the notice" |
| § 435.559 | **91 FR 33478** | (c): "must verify compliance … at the applicable individual's **first renewal initiated on or after** the implementation date" |
| § 435.560 | 91 FR 33478 | good faith effort exemption |
| § 435.915 transition | **91 FR 33415** | **preamble, not rule text.** Label the tier |

---

## Scope

### 2.1.1 The policy profile module (ADR-0001)

Create `src/lib/policy/` with `PolicyProfile` and `FEDERAL_DEFAULT`. Schema from
`../../domain/cms-2454-ifc/state-options.md`, which declared **33** fields before this wave and declares
**35** after — the four corrections below were agreed before implementation and are folded back into that
document, so it stays the schema of record rather than a stale copy of one.

`grep -cE '^  [a-zA-Z]+\??:'` over its `PolicyProfile` block returns 35, which is the implemented count.

#### The four schema corrections

**`[S1]` `incomeThreshold` becomes a function, not a `readonly` field.**
`state-options.md` declares `readonly incomeThreshold: number` and comments "Derived: never hardcode 580."
A `readonly` property is still a *stored* value — nothing stops a per-State profile from setting it to
something other than wage × hours, which is the exact failure the comment is trying to prevent. Replaced
with `incomeThreshold(profile)` and no field. This is the only version where ADR-0001's "never stored" is
enforced rather than requested.

**`[S2]` `applicationLookbackMonths` stays `number` with `applicationLookbackBounds`, not `1 | 2 | 3`.**
The literal union is compile-time only, and profiles will eventually be loaded from storage where `tsc`
cannot help. W5 chose a runtime bounds check plus an explicit throw naming § 435.556(a)(1)'s range. Keep
W5's. `state-options.md`'s union predates anything actually loading a profile.

**`[S3]` `ReviewPeriodPolicy` becomes `Pick<PolicyProfile, …>`.**
The two shapes genuinely disagreed. Of W5's seven `ReviewPeriodPolicy` fields, `state-options.md` has flat
equivalents for two (`applicationLookbackMonths`, `renewalMonthsRequired`), a differently-named equivalent
for one (`renewalIntervalMonths` — see `[P6]`), a `source` for one, covers `verificationMonthsRequired`
only inside a differently-shaped `moreFrequentVerification` union, and has nothing at all for
`applicationLookbackBounds` or the second source string.

Three ways to reconcile were considered. A nested `profile.reviewPeriod` keeps the diff smallest but makes
the code disagree with the published schema that per-State data goes into. Flattening and rewriting all six
`reviewPeriod.ts` signatures matches the schema but reopens a module that shipped two days ago with eleven
tests on it. An adapter function matches the schema and leaves the module alone, but leaves **two types
holding the same policy values with a hand-maintained bridge** — the `getStoredComplianceMode` duplication
class W5 already recorded against itself.

`Pick` is none of those. Once `PolicyProfile` carries the three missing fields, `ReviewPeriodPolicy` stops
being a second declaration and becomes a structural subset of the first: one declaration of each field's
type, correspondence enforced by the compiler, no adapter at all — a `PolicyProfile` satisfies the `Pick`
structurally and passes directly — and `reviewPeriod.ts`'s signatures unchanged, so W5's tests stay green.
The three fields are added to `state-options.md`, which is accurate: they are real parameters its per-State
tracker should have been carrying.

`reviewPeriod.ts` takes the `Pick` rather than the whole `PolicyProfile`, deliberately. It documents which
policy fields that module reads, and keeps its dependency surface narrow.

**`[S4]` `renewalIntervalMonthsSource` is kept **and** given an `interpretiveRisk` entry.**
ADR-0001 makes `source` mandatory once per profile. W5 needed a second, worse-provenance citation for one
field — the IFC amends § 435.916 to say 12-month MAGI renewals while its own preamble says 6 for the adult
group under § 1902(e)(14)(L), a section this rule does not implement. `state-options.md` already has the
right shape for that class of thing (`interpretiveRisk?: Array<{field, basis, watch}>`), but W5 could not
use it because it did not exist in code.

Two representations of one caveat is worse than one, so this needs justifying. It is kept because W5 has a
test asserting the value cannot travel without the caveat string, and collapsing to `interpretiveRisk`
alone would weaken that from "the caveat is attached to the number" to "the caveat is somewhere in the
profile". The `interpretiveRisk` entry is added as the *machine-readable index* of the same fact, for the
UI to hedge from. A test asserts the two agree on which field they describe, so they cannot drift. If a
later wave finds one of them unused, delete that one.

#### What the `confidence` discriminator has to produce

`FEDERAL_DEFAULT` is `confidence: "statutory-floor"`. ADR-0001: that "should produce copy like *your state
may require more*." Under ADR-0003's split, every value the profile supplies is therefore **Conditional**
at best — real, derived, and dependent on a State election we do not know. The one exception is
`federalMinimumWage × requiredHours`, which is **Computed**: § 435.552(a)(6) publishes the formula and the
State will compute that exact number.

So this wave ships one small piece of user-facing surface, not zero: a way for copy to say which of those
two it is looking at. Without it, "80 hours" and "1 month of lookback" render identically while one is
statute and the other is a guess.

### 2.1.2 Remove every policy literal — the corrected site table

**Computed 2026-09-02 against `ad8ac87`.** Pattern, the same one W2a documented, extended with `2.17`
because `wave-2` § 2.1 bans the pay-period multipliers as multipliers and the original list was
inconsistent about it:

```
grep -rnE '(^|[^0-9._$A-Za-z])(80|580|7\.25|4\.33|2\.17)([^0-9%A-Za-z]|$)' src \
  --include='*.ts' --include='*.tsx' | grep -v '__tests__' | grep -v '\.test\.'
```

**99 raw hits → 27 comment-only → 72 → 12 noise → 60 real, across 14 files.**

| File | Lines | Count | Tier | Notes |
|---|---|---|---|---|
| `src/content/helpText.ts` | 182, 246, 399, 479, 567, 583, 593, 671, 673, 674, 678, **821** | **12** | copy | `:399` is the `$580 = 80 × $7.25` derivation; `:593` the § 435.552(e)(2) proxy example. **W2a recorded `:803`; it is now `:821`** |
| `src/lib/assessment/recommendationEngine.ts` | 34, 39, 45, 80, 98, 99, 102, 104, 108, 204 | **10** | **1** | Four are threshold comparisons — logic, not copy |
| `src/app/how-to-hourkeep/results/page.tsx` | 156, 170, 171, 196, 221, 223, 225, 227, 229 | **9** | app | W2a recorded nine at different line numbers; W2a's review rewrote the file |
| `src/components/onboarding/GettingStartedContextual.tsx` | 78, 103, 105, 107, 109, 111 | **6** | component | Near-duplicate of the results page |
| `src/lib/utils/payPeriodConversion.ts` | 12, 13, 19, 20 | **4** | **1** | ADR-0001 names this file and no site table listed it |
| `src/components/help/HourTrackingHelp.tsx` | 31, 34, 36, 244 | **4** | component | **In no site table.** Live via `Dashboard.tsx:88`. See `[P2]` |
| `src/components/assessment/EstimationTools.tsx` | 24, 94, 129, 130 | **4** | component | **In no site table.** `4.33` / `2.17` as multipliers |
| `src/lib/calculations.ts` | 78, 81 | **2** | **1** | The real `80`. Absent from the W2a handoff table |
| `src/lib/exemptions/calculator.ts` | 213, 307 | **2** | **1** | |
| `src/lib/exemptions/definitions.ts` | 158, 328 | **2** | copy | |
| `src/components/income/IncomeEntryForm.tsx` | 489, 491 | **2** | component | Multiplier captions |
| `src/components/assessment/NoticeQuestion.tsx` | 65 | **1** | component | **In no site table** |
| `src/app/settings/page.tsx` | 348 | **1** | app | **In no site table.** `{APP_CONFIG.description} (80 hours/month)` |
| `src/app/export/page.tsx` | 114 | **1** | app | The single `thresholds: { hours: 80, income: 580 }` call site |
| `src/lib/export/buildTextReport.ts` | — | **0** | — | **Takes thresholds as a parameter.** W2b passes the profile in |
| `src/components/Dashboard.tsx` | — | **0** | — | **W5 removed three**, replacing them with a required `threshold` prop |

12 + 10 + 9 + 6 + 4 + 4 + 4 + 2 + 2 + 2 + 2 + 1 + 1 + 1 = **60**. The grep returns 60.

**The 12 excluded as noise, listed so the exclusion is auditable rather than asserted.** Six are genuinely
not policy values: `results/page.tsx:277–278` and `IntroductionScreen.tsx:36–37` are `width`/`height`;
`StorageInfo.tsx:193` and `StorageWarning.tsx:14` are storage-quota percentages. Six are comments the
comment filter missed: `types/index.ts:83–84` are trailing `// >= 80` annotations on the `MonthlySummary`
fields, and `IncomeStatusIndicator.tsx:123`, `ReviewPeriodPanel.tsx:282`, `CompletionMessage.tsx:142` and
`HourTrackingHelp.tsx:28` are continuation lines inside multi-line comments. This is the noise
`validation-findings-2026-08.md` § C10 predicted, and the reason the gate is scoped rather than repo-wide.

#### `4.33` means two unrelated things

It is the **Carnegie Unit** in § 435.552(d)'s `creditHours × 3 × 4.33` — statutory arithmetic CMS
publishes, which stays out of the profile and belongs in the education module W6a creates — **and** the
weekly pay-period multiplier, `52/12` truncated to 2dp, which appears nowhere in the rule and which gap 5.4
classifies as `contradicts`. Ban it as a multiplier, keep it as the Carnegie constant, and distinguish them
**by file**, not by value. W6a has no education module yet, so no Carnegie constant exists to protect
today; the guard must not be written in a way that blocks one appearing.

#### Delete the `hoursNeeded` threshold trick

`tracking/page.tsx:238` derives the threshold as `calculateMonthlySummary([], selectedMonth).hoursNeeded`.
That avoids writing `80` but only works because `hoursNeeded` is `isCompliant ? 0 : 80 - totalHours`; a
zero-activity special case would silently make it wrong. W5's own domain reviewer flagged it. Replace with
the named threshold from the profile and delete the derivation.

### 2.1.3 Gaps 15.6 and 15.7 — the transition dates

Reassigned from W5 on 2026-09-02 because both compare a user's situation against the **State's
implementation date**, which only this profile supplies. Sequenced **third in this wave, not last**: W5
closed with every acceptance criterion met and these two rows untouched, and the way to not repeat that is
to do them while there is still budget.

**15.6 — § 435.915.** Applications filed *before* the State's implementation date are adjudicated under the
prior rules. CMS's example (preamble, 91 FR 33415): filed December 15, 2026, decided January 15, 2027, the
State must not evaluate November 2026.

**The granularity problem, discovered in W5.** `ReviewPeriodAnchor.month` is `YYYY-MM`
(`types/index.ts:31–35`). § 435.915 turns on a **date**. A month-granular anchor cannot express "the 15th",
and for the one month that matters — December 2026, against a January 1, 2027 implementation date — a
month-granular comparison gets it right by luck rather than by construction. Two options: add a
date-granular filing field, or decide month granularity is sufficient and say why. **Decision to make and
record during implementation, not now** — it depends on whether a date-granular field can be added without
a `.stores()` change, and `OnboardingContext` is nested inside an unindexed row (`db.ts:40` declares
`profiles: "id"`, so only `id` is indexed) so it probably can. Whichever is chosen, the reasoning goes in
this file.

**15.7 — § 435.559(c).** Rule text, 91 FR 33478: a beneficiary enrolled as of the implementation date is
verified "at the applicable individual's **first renewal initiated on or after**" it.

**The trap, also from W5.** `ReviewPeriodAnchor` with `kind: "renewal"` stores the month the renewal is
**due**, because that is what a user knows. § 435.559(c) triggers on **initiation**, which CMS notes can
precede the due date by 60–90 days. Comparing the stored due month directly against an implementation date
gives the wrong answer **in the user-unfavourable direction** — it would tell someone they are not being
assessed when initiation may already have happened. So the comparison must widen the window by the
initiation lead time, and the lead time is a State behaviour we do not know, which makes the result
**Conditional** and the copy obliged to name the uncertainty.

The copy half of 15.7 is already closed by W2a (`requirementFacts.already-enrolled-timing`). W2b owns the
data half only, and must not weaken what W2a shipped.

### 2.1.4 Harden the gate and the guards

- Add `src/lib/reviewPeriod.ts` to `scripts/compliance-gate.sh`'s `targets`, and `src/lib/policy/` as the
  allowlist it already documents but does not yet have anything to allow.
- **Add spelt-number detection.** W5 shipped "We've assumed six" in user-facing copy, invisible to every
  numeric scan, and review caught it. A value that renders as a word is still a policy literal.
- **Add the missing live components to the no-verdict render guard**, and add whatever phrase entries
  `[P2]`'s two sentences require. Fix the guard, not just the copy — W5's most valuable review finding was
  structural, and this is the same shape.

**The § 435.553(b) three-month inmate window is deferred to W3, with an allowlist rather than a promise.**
Spelt "three months" in `exemptions/calculator.ts:274`, `questions.ts:278` and `definitions.ts:446`. It is
a real policy value, it is not in `state-options.md`'s schema, and § 435.553 is W3's territory. Adding a
profile field with no consumer, in a wave already shipping ~24 fields with no consumer, is the speculation
W5's semantic reviewer flagged. So: an allowlist entry with `owner: "W3"`, plus tests asserting each entry
still exists and still matches — the `DEAD_FILE_ALLOWLIST` pattern, which made W2a's handoff to W0
testable instead of aspirational.

---

## Out of scope

Named because each is a plausible place to drift.

| Not this wave | Owner | Why |
|---|---|---|
| **Any Dexie version bump.** `git diff src/lib/db.ts` must come back empty | **W3** | `data-migration-standards.md` assigns v7 to W3. Three waves once each thought they owned it |
| The pay-period multipliers being *wrong* (gaps 5.4, 5.5) | **W7a** | W2b relocates their values unchanged. Fixing them is a behaviour change with a real user-facing effect |
| Seasonal averaging including the assessed month (gap 5.8) | **W7a** | |
| The export report skipping seasonal averaging (gap 8.9's remainder) | **W8a** | W2b closes only 8.9's re-hardcoded thresholds |
| The Carnegie constant and the education half-time cliff | **W6a** | No education module exists to hold it |
| Removing `isCompliant`, `complianceStatus`, `isExempt` | **W7b** / **W3** | W2b adds none, and must add none |
| New or reworded screening **questions** | **W4** | |
| Per-State profiles | later, additively | ADR-0001: "we don't have the source data for most States, and blocking on collecting it would stall everything" |
| Lifting the `eslint-plugin-react-hooks` pin | **W1** | Sequenced last |

---

## Acceptance criteria

Each names an observable. Every negative criterion has a positive twin, per DoD item 7 — the failure mode
being guarded against is that "no literal says 80" is satisfied by deleting the sentence that said it.

### The module (§ 2.1.1)

- [ ] `src/lib/policy/` exists, exports `PolicyProfile` and `FEDERAL_DEFAULT`, and a test asserts
      `FEDERAL_DEFAULT.source.citation` is non-empty and matches `/435\.55/`
- [ ] **Every one of the 35 fields `state-options.md` declares** is present, and a test enumerates them
      against a manifest so a field cannot be silently dropped. Checked against the document, not against
      this list — `grep -cE '^  [a-zA-Z]+\??:'` over its `PolicyProfile` block must equal the manifest
      length
- [ ] **Positive twin for "all 35 fields":** a test asserts every field has **either** a live consumer
      **or** a named owning wave, so the currently-unread fields are documented speculation rather than
      silent speculation
- [ ] `renewalPeriodMonths` does **not** exist — `[P6]`'s duplicate is merged into `renewalIntervalMonths`,
      and `grep -c renewalPeriodMonths src` returns 0 outside comments explaining the merge
- [ ] `incomeThreshold` is a **function** with no corresponding field, and a test asserts
      `incomeThreshold(FEDERAL_DEFAULT) === 580` **and** that it tracks a mutated `federalMinimumWage` —
      the second half is what proves it is derived rather than stored
- [ ] `confidence: "statutory-floor"` on `FEDERAL_DEFAULT`, and a test asserts the UI hedge it produces is
      non-empty. ADR-0001 requires the copy; a discriminator nothing reads is not a discriminator
- [ ] `interpretiveRisk` carries the § 435.916 / § 1902(e)(14)(L) conflict, and a test asserts it names
      `renewalIntervalMonths` as its `field` — the same field `renewalIntervalMonthsSource` describes, so
      the two representations cannot drift

### The reconciliation (§ 2.1.1 `[S3]`)

- [ ] `ReviewPeriodPolicy` is defined as a `Pick` of `PolicyProfile`, `FEDERAL_DEFAULT_REVIEW_PERIOD` no
      longer exists, and `grep -c FEDERAL_DEFAULT_REVIEW_PERIOD src e2e` returns **0**
- [ ] **Positive twin:** W5's `reviewPeriod.test.ts` passes with its assertions intact — the same values,
      read from `FEDERAL_DEFAULT`. A test asserts `FEDERAL_DEFAULT` is directly assignable where a
      `ReviewPeriodPolicy` is expected, which is the property that makes the adapter unnecessary
- [ ] W5's caveat test still holds under the merged name: `renewalIntervalMonths` cannot travel without
      `renewalIntervalMonthsSource`

### The literals (§ 2.1.2)

- [ ] The § 2.1.2 grep returns **0** across all 14 files, and the 12 noise lines are **still present** —
      asserted, not assumed, because a scan that reaches zero by deleting `width: 80` has broken layout
- [ ] `scripts/compliance-gate.sh` reports **zero** hits across its targets, and its `targets` array now
      includes `src/lib/reviewPeriod.ts`
- [ ] **W0's `payPeriodConversion` contract tests pass unchanged** — the arithmetic contract and the
      `INCOME_THRESHOLD === FEDERAL_MINIMUM_WAGE × REQUIRED_HOURS` relationship. See `[P4]`
- [ ] **W0's `W2b POLICY-LITERAL SNAPSHOT` block is relocated, not deleted**, and asserts the same four
      values against the profile: multipliers `{30, 4.33, 2.17, 1}`, wage `7.25`, hours `80`, threshold
      `580`. Deleting it would satisfy "no literals" while destroying the proof the move preserved values
- [ ] `calculations.ts`'s `80` is gone and `calculateMonthlySummary` reads the threshold from an
      **optional** profile parameter defaulting to `FEDERAL_DEFAULT` — W5's precedent, and what keeps W0's
      characterization tests callable unchanged
- [ ] `tracking/page.tsx`'s `calculateMonthlySummary([], month).hoursNeeded` derivation is gone, and the
      threshold reaching `Dashboard`, `ReviewPeriodPanel` and `CompletionMessage` comes from the profile
- [ ] The three `/ 80 hours` assertions in `e2e/month-scoping.spec.ts` (212, 242, 355) derive the number
      from the profile rather than restating it, and the suite is green

### The transition dates (§ 2.1.3)

- [ ] § 435.915: a function answers "was this application filed before the implementation date", with the
      granularity decision **recorded in this file** with its reasoning
- [ ] § 435.559(c): a function answers "is this the first renewal initiated on or after the implementation
      date", and **widens the window by the initiation lead time** rather than comparing the stored due
      month directly. A test asserts the user-unfavourable direction is not taken — a January 2027 due
      date must not be reported as unassessed when initiation may have occurred in November 2026
- [ ] Both are **Conditional** in ADR-0003's sense and the copy names the election. A test asserts neither
      returns a bare boolean presented to the user as settled
- [ ] Gap rows 15.6 and 15.7 are struck in `gap-analysis.md` with W2b named, or explicitly reassigned with
      a reason. **Not left looking abandoned** — that is the specific mistake this wave inherited

### The guards (§ 2.1.4)

- [ ] `HourTrackingHelp.tsx`'s two substantive errors are fixed: the job-search sentence carries
      § 435.552's subsidiary nuance and no longer contradicts `activityDefinitions.workProgram`, and the
      "you need to complete 80 hours" framing no longer asserts the requirement applies
- [ ] **Positive twin:** the corrected copy affirmatively states that income, the proxy and half-time
      education are also routes, and a test asserts the file is in the render guard
- [ ] A **spelt-number** check exists, is proven red against a planted spelt policy value, and its
      allowlist contains exactly the three § 435.553(b) sites with `owner: "W3"`
- [ ] **Positive twin for the allowlist:** tests assert every entry still exists and still matches, so a
      stale entry cannot linger and W3's handoff is enforced rather than remembered
- [ ] Every new assertion is **proven able to fail by mutation**, with the mutation verified as applied and
      the revert verified by `cp`/`diff` rather than `git checkout --`

### Wave hygiene

- [ ] `git diff src/lib/db.ts` is empty
- [ ] `npx tsc --noEmit` · `npm test` · `npm run lint` · `npm run format:check` · `npm run build` ·
      `npm ci` · `npm run test:e2e` all green, with figures recorded rather than estimated
- [ ] The review protocol has run with **four** independent reviewers, and each finding was verified
      against the primary source before it counted
- [ ] `gap-analysis.md`, `waves/README.md`, `hr1-readiness/README.md` and `CHANGELOG.md` updated
- [ ] This file carries a closeout block with every criterion checked against an observable, and **anything
      unmet marked unmet**

---

## Risks

| Risk | Mitigation |
|---|---|
| The refactor silently changes a value | W0's contract tests pass unchanged; the relocated snapshot block asserts the same four values. Both halves, per `[P4]` |
| A `Pick` that drifts from its source | Impossible by construction — that is why `Pick` was chosen over an adapter. A test asserts direct assignability |
| 24 fields with no consumer read as speculation | A test requires every field to name a consumer or an owning wave. W5 shipped two unreachable review-period arms and the reviewer was right to flag it |
| The spelt-number guard over-reaches and gets disabled | `mustNotFire` fixtures from day one. W5's first guard fired on `DuplicateActivityDialog.tsx`, and the repo-wide policy-literal grep died of exactly this |
| 15.6/15.7 get squeezed at the end | Sequenced third, before the 60-line mechanical sweep |
| § 435.559(c) answered in the user-unfavourable direction | A test asserts the initiation window is widened, not the due month compared. This is the direction that costs coverage |
| Interpolating a threshold into prose breaks a sentence | Read the rendered copy at 375px, not the template. W5's two worst findings were invisible to 509 passing tests |
