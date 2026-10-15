# Wave 7a — Seasonal and Income Corrections

**Depends on:** **W6a** (the activity model it sits beside) and **W5** (per-month evaluation). Both done.
It does **not** need W4 — which is why it can run before the December date. (The combined header said W7
needs W4; that is true only of W7b.)
**Blocks:** **W8a** (the export must carry the corrected income arithmetic before it is printed onto a
caseworker's artifact).
**Source:** split out of [`wave-7-unified-compliance.md`](wave-7-unified-compliance.md), whose combined
scope is mostly **W7b** (mode-fork removal, combination engine, income-to-hours proxy). W7a is the income
**corrections** only.
**Decision records:** ADR-0003, ADR-0004.
**Written:** 2026-09-03, by re-verifying the combined file's claims against the tree.

---

## The W7a / W7b boundary — what this wave is NOT

The combined `wave-7` file bundles two different jobs. Most of it is W7b and post-date. W7a is tightly
scoped to the income arithmetic that is **wrong today**, in the harmful direction. Explicitly deferred to
W7b, with the reason:

| Deferred to W7b | Why not W7a |
|---|---|
| Remove the mode fork (`ComplianceModeSelector`, `complianceModes`) | ADR-0004 rebuild; `data-migration-standards.md` says `complianceMode` must not be dropped before W7b (four readers) |
| The § 435.552(e) combination engine | Needs W4's caregiving answers and the status model (W3) |
| The income-to-hours proxy (gap 5.11) | Combines income and hours into one total — W7b, needs the combination engine |
| Rename `MonthlySummary.isCompliant` → `meetsHoursThreshold` | Named W7b's in `calculations.characterization.test.ts:255`; W6a left it for the same reason |
| Remove `Recommendation.complianceStatus` | 7 sites in `recommendationEngine.ts` (a Tier-1 module); part of the mode-fork/recommendation rebuild |

**`MonthlyIncomeSummary.isCompliant` is a judgement call.** It is income-side, has live readers
(`IncomeStatusIndicator`, `SeasonalWorkerView`, `IncomeDashboard`), and the combined file lists its removal
under income. But renaming a verdict-named field is the same shape of change as the `MonthlySummary.isCompliant`
rename that is explicitly W7b's, and doing it here would fork the two income/hours renames across two waves.
**Decision: leave the name; W7b renames both verdict fields together** when it removes the mode fork that is
the reason they exist. W7a corrects what the field is computed *from* (the double-count), which is the harm.

---

## What the source got right, and the one site count to carry

Unlike W2/W6, the combined file's **income section is accurate** — the double-count, the pay-period
multiplication, the seasonal off-by-one, and the sparse-history problem are all really there, exactly as
described, and the W0 characterization tests in `src/lib/storage/__tests__/income.characterization.test.ts`
pin every one with the CFR citation it violates. That test file is the specification for this wave: each
`CHARACTERIZATION` test is a behaviour to invert.

**The one count that matters: `monthlyEquivalent` is summed in THREE places, not one.** Verified by grep
(`grep -rn monthlyEquivalent src/`), and the characterization test at
`income.characterization.test.ts` ("a SEPARATE summing site") records that a mutation sweep found a reduce
fix left the third site green:

1. `src/lib/storage/income.ts:170` — `getMonthlyIncomeSummary`'s `totalIncome` reduce.
2. `src/lib/storage/income.ts:222` — `calculateSeasonalAverage`'s `monthTotal` reduce.
3. `src/lib/storage/income.ts:232-234` — `incomeBySource`'s `+=` / `push` accumulator (NOT a reduce).

Plus `src/lib/export/buildTextReport.ts:241`, a fourth summing site on the export surface.

---

## The core correction, and the design decision behind it

**The bug (gap 5.5):** each `IncomeEntry` stores `monthlyEquivalent` — a whole-month *projection* of one
paycheck's pay period (`amount × PAY_PERIOD_MULTIPLIERS[payPeriod]`). `getMonthlyIncomeSummary` sums those
projections, so four weekly $150 paychecks report `150 × 4.33 × 4 = $2,598` for a month whose real gross is
$600. That figure is compared against the $580 threshold, so it tells a user who may be short that they are
comfortably over — a **reassuring false positive**, the harm direction this project cannot absorb (someone
told they're fine who then doesn't answer a notice).

**The fix (ADR-0003, and the combined file's prescription):** entries are **evidence of payment received**.
The month's income is the sum of the actual `amount` of each paycheck received that month — not a sum of
per-paycheck monthly projections. `totalIncome = Σ amount`. Four $150 weekly paychecks = $600 received,
compared against $580. That is the real monthly gross and it is what § 435.552(f)(2)'s MAGI-based monthly
income measures.

**Consequence for `monthlyEquivalent` and pay-period multiplication (gap 5.4):** the rule prescribes no
pay-period conversion; states derive a monthly MAGI figure by existing methodology. So `monthlyEquivalent`
stops being a compliance input. It survives only as a **labeled personal estimate** on the entry form
("what a paycheck this size works out to in a month"), clearly not the figure that counts. The stored field
stays on the row (no schema change) but nothing sums it for compliance.

**`store the input, derive the output` (data-migration-standards.md).** The characterization test pins that
updating `amount` does not recompute `monthlyEquivalent` — a staleness trap. Summing `amount` instead
removes the trap: the compliance figure is derived from the stored input at read time.

---

## Scope

- **`totalIncome` sums actual `amount` received**, at all three `income.ts` sites and the `buildTextReport`
  site. `incomeBySource` groups actual amounts. (gaps 5.4, 5.5)
- **Pay-period multiplication is no longer a compliance input.** `monthlyEquivalent` remains on the row and
  is shown on the entry form as a clearly-labeled personal estimate, not a compliance total. (gap 5.4)
- **Seasonal averaging window excludes the assessed month** (gap 5.8): `getLast6Months` returns the 6
  months *preceding* the assessed month, not the assessed month plus five. CMS's example: assessed July →
  average December–May... (the review-period note below).
- **Sparse seasonal history is stated, not silently averaged** (gap 5.9): a month with no records is
  "no record", distinct from "$0 earned". The divisor and the copy handle an incomplete history explicitly
  rather than dividing by 6 and rendering `$0.00` rows as though verified.
- **Seasonal is Conditional on the state's method** (gap 5.9): `profile.seasonalMethod` is a discriminated
  union (`preceding-average` vs `reasonably-predictable-changes`); the copy names the election. The
  arithmetic implemented is the `preceding-average` fallback; the alternative is surfaced as "your state may
  work this out differently", not computed (that needs per-state election data we don't have).
- **Household framing** where income is presented (gap 5.1, partial): the copy is already in place from
  W2a/W2b (whole-household, floor-not-ceiling, married-spouse case). W7a confirms it survives the arithmetic
  change and the total is still **Deferred** per ADR-0003 — the app shows what the user recorded and never
  claims it is the household MAGI figure.
- **Carried-forward cleanup:** the six British "programme" spellings W2a handed to W7a (per
  `../README.md`), and the `EstimationTools` coupling to `PAY_PERIOD_MULTIPLIERS.weekly`. Note the
  hours-converter use of `4.33` as weeks-per-month is legitimate arithmetic (not a policy value); the income
  multiplier use is the gap-5.4 one. Decide whether to keep `EstimationTools` as a labeled estimate or let
  W7b remove it with the fork.

## The seasonal off-by-one — read carefully, it is off by one in BOTH directions

`getLast6Months("2026-07")` returns `2026-02 … 2026-07`: it **includes** the assessed month (July) and
**drops** the sixth preceding month (January). 42 CFR 435.552(g) averages the 6 months *preceding* the
assessed month, so the correct window for an assessed month of July is **January through June**.

CMS's worked example (rule-extract.md § 2.7): apply in July with a 1-month review period → the review month
is **June** → average **December through May**. Note the two-step: the *assessed* month is June (the month
before application under § 435.556(a)(1)), and the seasonal average is the six months before *that*. W7a's
`getLast6Months` fix handles the "six preceding, exclusive" part; which month is assessed is W5's
review-period model and is passed in.

## Review-period scoping (gap 5.10, partial)

Income is evaluated only for the current month today. Full per-month-of-review-period evaluation is the
same shape as the combination engine and is **W7b**. W7a makes the month an explicit input to the seasonal
window (it already is to `getMonthlyIncomeSummary`), so a past month evaluates correctly — but it does not
build the multi-month review-period roll-up. Mark 5.10 partial.

## Acceptance criteria — each names an observable, negatives have positive twins

- [ ] Four weekly $150 paychecks report **$600**, not ~$2,598 (`getMonthlyIncomeSummary.totalIncome`), and
      a single $600 monthly entry also reports $600 — the fix is not "divide by 4", it is "sum actual
      amounts". Positive twin: two bi-weekly $400 paychecks report $800.
- [ ] `incomeBySource` sums actual amounts (the third summing site), proven by a test that would stay green
      under a reduce-only fix.
- [ ] The export's income block sums actual amounts (the fourth site).
- [ ] `monthlyEquivalent` is not summed for any compliance figure anywhere; it renders on the entry form
      labeled as a personal estimate.
- [ ] Seasonal averaging for an assessed month of July covers **January–June**, excluding July — proven by
      a test asserting the history months and that July is absent (inverts the characterization test).
- [ ] A sparse history (one month of records) is not silently divided by 6 and shown as six verified rows;
      the copy distinguishes "no record" from "$0". Positive twin: a full six-month history still averages
      over six.
- [ ] The seasonal view names the averaging span as a state election, not a fixed fact.
- [ ] Household framing appears wherever income is presented, and no surface claims the recorded total is
      the household MAGI figure.
- [ ] No British spellings remain in income files (positive twin: the specific strings now read US).

## Risks

| Risk | Mitigation |
|---|---|
| Changing `totalIncome` from projection-sum to amount-sum changes a number on several surfaces at once | The characterization tests pin the current (wrong) values; the diff turning them red/updated is the signal. Verify each reader in the browser at 375px |
| Removing `monthlyEquivalent` from compliance reads *feels* like lost functionality | Keep it as a labeled personal estimate on the form; the entry still stores it. Explain why it is not the compliance figure |
| Seasonal sparse-history handling could overstate (treating "no record" as a real low month pulls the average down, which is user-unfavourable) OR understate | Decide one semantics and state it in copy; a missing month is "we don't have this", not "$0 earned". Lean toward not averaging over months with no evidence rather than imputing $0 |
| The `incomeBySource` third summing site is easy to miss | A test that stays green under a reduce-only fix (the characterization test already demonstrates this) |

## Definition of done (from `waves/README.md`, with W7a specifics)

`npm run build` + `npx tsc --noEmit` clean · `npm test` green, income math TDD-first (Tier 1 — the five
compliance-critical modules include `storage/income.ts`) · `npm run lint` / `format:check` clean ·
**`npm ci`** · **`npm run test:e2e`** (income surfaces are browser-visible) · copy review: no verdict, every
number Computed/Conditional/Deferred, no policy literal · every domain claim cites CFR + FR page · the
review protocol run, findings verified against the primary source · gap rows struck with the wave number
and a **closure line in `gap-analysis.md`** · `CHANGELOG.md` updated · phone-viewport smoke test.
