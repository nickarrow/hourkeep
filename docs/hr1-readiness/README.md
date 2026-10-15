# HourKeep HR1 Readiness

**The holistic home for this effort.** Open this file to remember where we are.

**Last updated:** 2026-10-15 (W8a closed)
**Current wave:** none in progress — **W8a (Print evidence export)** closed 2026-10-15, the last pre-date
wave. Everything above the line in `waves/README.md` § Sequence has now shipped. Its file is
[`waves/wave-8a-print-evidence-export.md`](waves/wave-8a-print-evidence-export.md), written by re-verifying
the combined `wave-8` file against the tree (which resolved the `evaluateMonth` open item: W8a delivers one
call site, not W7b's combination logic). Progress against the gap analysis:
**34 of 108 rows closed, 11 partial** — and note the total is **108, not the 81** that document's summary
claimed until it was recounted

> A first version of this line said W1 was next. Wrong: ADR-0009's reordering moved **W1 to the very end**,
> after the December date. `waves/README.md` § Sequence is authoritative — the pre-date order is
> W0-slice → W2a → **W0** → **W5** → W2b → W6a → **W7a → W8a** (swapped 2026-09-02, see below).

> ### Carried forward — four items still open
>
> Recorded here because they are the kind of thing that disappears if it only lives in a closed wave file.
>
> 1. **Offline behaviour.** Narrowed twice. The **phone-viewport half is automated** since 2026-09-01 —
>    `@playwright/test` runs every route at 375×812 and drives the destructive delete-all flow there
>    (ADR-0007 Tier 3b). W2b then did the **human read**: the rewritten hour-tracking help panel was read
>    at 375×812 in a real browser via the Playwright MCP, which is how five British "programme" spellings
>    got caught before they shipped, and how six pre-existing ones from W2a were found and handed to W7a.
>    **What remains is only the service worker.** No spec exercises offline, and nobody has driven the app
>    with the network off. Open since W0 — five waves. It is the last unautomated item in the Definition of
>    Done, which is why it keeps surviving: nothing fails when it is skipped.
> 2. ~~**The review protocol has now failed twice, and is getting worse.**~~ — **CLOSED
>    2026-09-02. All four reviewers ran independently on W5**, including data integrity and
>    semantic review, which had never once run independently across W2a and W0. **W2b made it two
>    consecutive waves**, and found four more blocking defects in work that had already passed 655
>    tests, seven mechanical gates, a 62-case mutation sweep and a browser pass.
>
>    **The W2b run says something the W5 run did not.** Two of its four findings were the same
>    shape: *this wave diagnosed a defect, wrote a guard for it, then committed a fresh instance of
>    that same defect where the guard did not look.* The verdict phrase found in
>    `HourTrackingHelp`, added to `VERDICT_PHRASES`, then written into `transition.ts`. The
>    "component created but not guarded" lesson taken from W5, applied to two components, missed on
>    a third. **Writing the rule down is not the same as being subject to it** — so check the new
>    files against the guard you just extended, not only the old ones.
>
>    And the single most consequential finding was **an instrument, not a defect**: the
>    policy-literal scan could not see a dollar sign, so its own acceptance criterion read green
>    while 22 literals were live. Three of four reviewers found it by reading the regex; no run of
>    it could have. **A criterion whose observable is produced by the same instrument as the work
>    cannot be self-checked.**
>
>    **W6a, 2026-09-03, made it three consecutive waves — and taught the sharpest lesson yet about
>    reviewer composition.** All four ran. The three narrow reviewers (domain, non-adjudication,
>    data integrity) each PASSED W6a within their lens. The **two-model semantic review returned
>    NEEDS_CHANGES with 21 findings**, and both its models independently reproduced the headline
>    harm in a 375px browser: a half-time student saw "80 hours needed" because the activity model
>    landed *at capture but not at read* — the cliff was enforced in the form and in
>    `education.ts`, but no summary or dashboard read `enrollmentStatus`. **The narrow reviewers
>    could not have caught it**: each checked a layer, and the defect lived in the *join* between
>    layers (form → summary → report). The lesson: a lens-partitioned review misses lifecycle
>    defects by construction, so the design-level semantic pass is not redundant with the targeted
>    ones — it is the only one that follows the data. Six findings were High; all fixed and
>    verified against the primary source and in the browser before being believed, two deferred
>    with reasons recorded in `waves/wave-6a-evidence-capture.md` § Convergence.
>
>    **W7a, 2026-09-03, made it four consecutive waves, and showed convergence working as
>    designed.** Non-adjudication APPROVED, data-integrity clean, domain-fidelity 5/6, the
>    two-model semantic review NEEDS_CHANGES — and the single most important finding, the seasonal
>    average dividing by months-with-data instead of the statutory six, was reached **independently
>    by the domain reviewer, both semantic models, and the implementer** before any of them saw the
>    others. It overstated the average in the compliance-favourable direction (CMS's own example
>    divides $3,000 by 6 = $500; the code returned $3,000), which is the reassuring-false-positive
>    harm `getting-started.md` says the project cannot absorb. Fixed to ÷6 with the honesty moved to
>    the display. Three items deferred with reasons (W7b ×2, W8a ×1) in
>    `waves/wave-7a-seasonal-income-corrections.md` § Convergence. The recurring shape across W6a
>    and W7a: the narrow reviewers verify a layer, the semantic review follows the data between
>    layers, and the hardest findings sit in the arithmetic or the joins — exactly where a lens
>    cannot look.
>
>    It was worth the wait. The four found **four blocking defects** in work that had
>    already passed 509 tests, six mechanical gates and a manual browser pass — including
>    one that told income-pathway users they were failing to meet an hours threshold they
>    were not using, which is the harm ADR-0003 § Context names in as many words. Two of
>    the four were verdicts I had introduced *while fixing verdicts*.
>
>    Two lessons for the next run, both in `waves/wave-5-month-scoping.md`:
>    **a sub-agent finding really is a lead** — two of the fourteen were dropped after
>    checking, one of them a confidently-cited claim about functions that do not exist in
>    the file named. And **the most valuable finding was structural, not textual**: W5
>    created five components and put none of them in the no-verdict render guard, which is
>    why two verdicts got through. Fix the guard, not just the copy.
> 3. **Ten React Compiler errors are suppressed by a version pin**, deferred from W0 to W1 deliberately.
>    Measured: 11 errors across 8 files under `eslint-plugin-react-hooks` 7.1.1 with inline disables
>    respected; W0 removed one by deleting `DocumentMetadataForm.tsx`. `package.json`'s `overrides` pins
>    7.0.1, which is what keeps them invisible. **W1 owns lifting the pin — and W1 is sequenced last**, so
>    the pin stays put for most of this plan. Worth knowing that `set-state-in-effect` and `immutability`
>    violations in `ActivityForm`, `IncomeEntryForm`, `DocumentViewer`, `IncomeDashboard` and
>    `StorageInfo` will go unreported while W5, W6a and W7a rewrite exactly those files. Details in
>    [`waves/wave-0-safety-net.md`](waves/wave-0-safety-net.md) § Handoffs.
> 4. **Two toolchain problems `npm ci` surfaced at W2b close, 2026-09-02.** Both belong to **W1**, which is
>    sequenced last — so both sit for most of this plan, and that is the reason to write them here.
>
>    **The test suite runs on a Node version jsdom declares unsupported.** `npm ci` emits **10
>    `EBADENGINE` warnings**: `jsdom@30.0.1` wants `^22.22.2 || ^24.15.0 || >=26.0.0` and `undici@8.10.0`
>    wants `>=22.19.0`; this machine is on **v22.18.0**. No `.npmrc` exists, so `engine-strict` is off, npm
>    does not fail, and all 668 tests pass. **They pass on an unsupported engine, which is luck rather
>    than verification.** `engines.node` is `">=22"`, which admits 22.18.0 — and the CHANGELOG entry that
>    set that floor **names `^22.22.2` in its own text** before writing `>=22`, so the fix for the previous
>    Node-version CI break left a weaker version of the same hole. CI's `node-version: "22"` resolves to
>    the latest 22.x and is probably fine, but it is **unpinned**, which is the objection that same entry
>    raises against caret ranges for linters. **Raise the floor to `>=22.22.2` and pin CI exactly.** Not
>    done at W2b close because tightening `engines` constrains the developer's own machine, and that is a
>    deliberate decision rather than a side effect of closing a wave.
>
>    **Done in W6a, 2026-09-03.** `engines.node` is now `>=22.22.2` and CI Node is pinned to `22.23.2`
>    exactly (the current 22.x LTS security release). Taken in W6a rather than left to W1 because the
>    suite runs hundreds of times this wave and running it on a jsdom-unsupported engine is luck. No
>    `.npmrc`, so the raised floor stays advisory on 22.18.0 and `npm ci` still exits 0 locally; CI now
>    installs a version both `jsdom` and `undici` declare supported.
>
>    **`next@16.0.1` has published advisories and they are recorded nowhere in this project.**
>    `npm audit` reports 9 vulnerabilities, 8 high and 1 critical. Grepping `docs/`, `CHANGELOG.md` and
>    `ROADMAP.md` returned nothing. Deferring features past December is a defensible call; **deferring a
>    known-vulnerable framework is a different question**, and it deserves an explicit answer rather than
>    inheriting W1's position at the end of the queue.
>
>    **Answered in W6a, 2026-09-03 — recorded, not bumped.** Two corrections to the item above. First,
>    the "CVE-2025-66478" label could not be reproduced anywhere in `npm audit`'s output; the findings
>    surface as GHSA ids, the critical being **GHSA-9qr9-h5gf-34mp** (RCE in the React flight protocol).
>    Use the GHSA id. Second, the fix is `next@16.3.0`, a **minor** bump (the vulnerable range ends at
>    `16.3.0-preview.10`), separable from W1's MUI 7→9 major. The deferral stands on a narrower ground
>    than "it's not December yet": HourKeep is `output: "export"` with `images.unoptimized`, no
>    middleware, no Server Actions, no route handlers (verified in `next.config.ts` and by search), so it
>    ships **no Next.js server**. Nearly every advisory in the set is server-side, so the exposed surface
>    is the build machine and `next dev`, not hourkeep.app — a developer-environment issue, not a
>    user-coverage one. Written up in `ROADMAP.md` § Known Security Debt; the bump stays with W1.
>
> ### The order-dependency sweep — done once, 2026-09-02, after the third instance
>
> Three separate documents had been found stating a wave relationship that the **2026-08-16 validation
> inversion** or the **W2/W6/W7/W8/W9 splits** had already invalidated: W5's header predated the W2 split,
> `gap-analysis.md` § 14's ordering paragraph predated the inversion, and `data-migration-standards.md`'s
> version table assumed the status model ran before the activity model. Same root cause each time —
> **the reordering was applied to the sequence and not to the documents that depend on the sequence.**
> Rather than wait for a fourth, every `Depends on:` and `Blocks:` header was checked at once. Six were
> stale:
>
> | File | Was | Now |
> |---|---|---|
> | `wave-6-activity-model.md` | Depends on W2; Blocks W7 | W2b + W5 + W0; blocks W7a, W7b, W8a |
> | `wave-7-unified-compliance.md` | Depends on W4, W5, W6 | **Split-dependent.** W7a needs W6a + W5 only — *this is why it can run pre-date*. W7b needs W3 + W4 |
> | `wave-8-evidence-package.md` | Depends on W7 | W6a + W7a. **And one real unresolved item** — see below |
> | `wave-3-status-model.md` | Depends on W2; Blocks W4, W7 | W2b; blocks W4 and **W7b only** |
> | `wave-5-month-scoping.md` | Blocks W6, W7, W8, **and W2b** | W2b is done and absorbed W5's constant |
> | `wave-2-truth-and-policy-profile.md` | Blocks W3, **W5** | W5 was never blocked by it and **ran first** |
> | `wave-10-accessibility-privacy.md` | **Depends on W1** | W1 runs *after* W10 (ADR-0009). A benefit, not a prerequisite |
>
> Two of these mattered beyond tidiness. **W7a's pre-date feasibility rests on it not needing W4** — the
> combined header said it did, which would have made the seasonal and income fixes impossible before
> December. And **W10's stated dependency on W1 inverts the executed order**, so following it would have
> stalled accessibility work behind a wave deliberately sequenced last.
>
> **One thing the sweep found that is not a documentation fix.** `evaluateMonth` does not exist — `grep -rn
> "evaluateMonth" src/` returns nothing — yet W8a's scope says to call it and `waves/README.md` lists "one
> evaluation path" among its deliverables. It is W7b's, and W7b is post-date. The defect behind it is real:
> the export recomputes totals independently of the UI, so they can disagree about the same month. Proposed
> resolution is recorded in `waves/wave-8-evidence-package.md` — a thin single entry point that both callers
> share, wrapping today's functions, leaving W7b to replace the internals. **Confirm it when W8a starts;
> don't let W8a build ADR-0004's combination logic.**
>
> ### Both things W0 inherited from W2a are now closed
>
> 1. **The dead-chain allowlist is empty by construction.** Deleting the chain turned the suite red exactly
>    as designed, with a message naming the fix. `DEAD_FILE_ALLOWLIST` and `DEAD_CHAIN` are both empty, and
>    the meta-test inverted to assert emptiness rather than being deleted with the entries.
> 2. **`npm test` gates deployment**, and now runs 423 tests rather than 196.
>
> ### What W6a should read first — added 2026-09-02
>
> **Start with the resolved-blockers note at the top of
> [`waves/wave-6-activity-model.md`](waves/wave-6-activity-model.md).** Three things were settled before the
> wave starts, and the first would otherwise have looked like a hard stop:
>
> - **W6a needs no Dexie version bump.** `.stores()` declares the primary key and indexes, *not* stored
>   fields — `activities: "++id, date, type"` while `Activity` already persists `hours`, `organization`,
>   `createdAt` and `updatedAt` unindexed and unmigrated. So every field W6a adds is unindexed data on an
>   existing row. `workProgram` is a new *value* in an already-indexed field, not a new field. **Two
>   conditions keep this true: no new table, no new index.** If either becomes necessary, stop and renumber
>   (W6a v7, W3 v8, W6b v9) — that touches eight documents, so it is worth avoiding deliberately rather
>   than by accident.
> - **The caregiving bullet's "wire this from the W4 screening answers" cannot happen** — W4 is post-date.
>   Capture caregiving hours directly as unpaid work; CMS's 55 + 25 = 80 example works from logged hours
>   alone.
> - **Existing education entries have hours and no status: ask, don't migrate.** The old plan marked them
>   less-than-half-time, which guesses in the direction that *understates* the user, since at-least-half-time
>   qualifies on zero hours. The school determines status, so it cannot be inferred from an hours figure.
>
> Then W2b's **Closeout** section in
> [`waves/wave-2b-policy-profile.md`](waves/wave-2b-policy-profile.md), particularly
> *Recorded, not fixed*. Directly load-bearing for W6a:
>
> - **The profile has no education field, and W6a needs one.** § 435.552(d)'s
>   `creditHours × 3 × 4.33` is nowhere in `src/lib/policy/`, deliberately — W2b adds no field
>   without a consumer. **Add it with the module that reads it.**
> - **`4.33` already exists in the codebase meaning something else, and the two must not be
>   collapsed.** `PAY_PERIOD_MULTIPLIERS.weekly` is 52/12 rounded *down*, HourKeep's own
>   invention, classified `contradicts` at gap 5.4 and owned by W7a. The Carnegie Unit is
>   statutory arithmetic CMS published. Same digits, unrelated meanings — the warning is at
>   `payPeriodConversion.ts:42-59`. **`EstimationTools` already couples its hours converter to
>   `PAY_PERIOD_MULTIPLIERS.weekly`**, which W7a is expected to replace or delete.
> - **The half-time cliff is a cliff, and the arithmetic is Computed, not Deferred.** At least
>   half-time means compliant at zero hours and **may not be combined**; below half-time
>   converts and combines. Enrollment status is **determined by the school**. Per
>   `compliance-copy-standards.md`, show the formula and the citation — refusing to show
>   arithmetic CMS published is withholding, not humility.
> - **Take a threshold from the profile, never a literal.** `FEDERAL_DEFAULT.requiredHours` and
>   `incomeThreshold(profile)`. Every module that reads policy takes an optional
>   `policy: PolicyProfile = FEDERAL_DEFAULT` final parameter — follow that shape, and add the
>   new file to the scan list in `src/lib/__tests__/policyInjection.test.ts` **and** to
>   `POLICY_FIELD_OWNERS` in `src/lib/policy/types.ts`.
> - **Extending a guard does not exempt the file that extends it.** Two of W2b's four blocking
>   findings were fresh instances of defects W2b had just written guards for. Add new components
>   to the no-verdict render guard in the same commit that creates them, and check your own new
>   copy against `VERDICT_PHRASES` — the list has now been extended three times by verdicts
>   phrased without a pronoun (`Compliant`, `you need to`, `average meets`).
> - **A policy value can hide as an English word**, and now there is a test for it:
>   `src/__tests__/no-spelt-policy-value.test.ts`. `SPELT_ALLOWLIST` has 3 entries, all `W3`.
>   If W6a needs to spell a number in copy, expect that test to fire.
>
> **How W5's six predictions to W2b actually fared — four held, two were wrong.** Worth knowing
> because handoff notes get trusted more than they earn.
>
> | Prediction | Outcome |
> |---|---|
> | `FEDERAL_DEFAULT_REVIEW_PERIOD` is "a two-line diff" | **Wrong.** 27 references across 4 files |
> | `monthlyThreshold`'s `hoursNeeded` derivation is a trick to delete | Held. Deleted |
> | `Dashboard` takes `threshold` as a prop, so W2b needn't edit it | Held |
> | The three `/ 80 hours` e2e literals "will fail when the threshold becomes dynamic" | **Wrong.** They passed — the relocation changed no value, which is the behaviour-neutral signal working. They were rewritten anyway so a real FLSA change fails loudly instead of silently years later |
> | `reviewPeriod.ts` is missing from the compliance gate | Held. Added, 5 → 6 targets |
> | A policy value can hide as an English word | Held, and now pinned by a test |
>
> ### W5's two blockers are resolved — 2026-09-01
>
> Both are written up at the top of [`waves/wave-5-month-scoping.md`](waves/wave-5-month-scoping.md).
> In short: **W5 bumps no Dexie version** (the compound indexes moved to W3's v7, since
> `data-migration-standards.md` assigns v7 to W3), and **W5 does not wait for the policy profile** — it
> derives `ReviewPeriod` from one named federal-default constant that W2b later moves into
> `src/lib/policy/`. Both problems had the same root cause: W5's header predated W2 being split into W2a
> and W2b, and nobody revisited it.
>
> ### Playwright is available, and you should use it
>
> `npm run test:e2e` — **74 specs** across 5 files against the real static export (ADR-0007 **Tier 3b**).
> The rule for adding one: only if it is impossible in jsdom. The Playwright MCP also lets you *look* at
> the app while building rather than after, and **that is where it has paid off most.** W2b used it to read
> the rewritten help panel at 375×812 and caught five British spellings before they shipped; the committed
> suite would not have.
>
> One trap W2b hit and W5 recorded: when mutation-testing an e2e assertion, **rebuild and grep `out/` to
> prove the mutation reached the shipped bundle.** `reuseExistingServer` will otherwise serve a stale
> export and the test passes against code you did not change.
>
> Setting it up found two bugs that had been shipping and were invisible to all 423 Vitest tests and to
> `next dev`: a dead PWA manifest link (`/hourkeep/manifest.json` → 404, so the app was not installable)
> and a React #418 hydration failure on most routes. Both fixed.
>
> ### What W5 should read first
>
> W0's **Found during execution** section in [`waves/wave-0-safety-net.md`](waves/wave-0-safety-net.md).
> Ten places the planning documents were wrong, three of them audit claims. Directly relevant to W5:
>
> - **`calculations.ts`'s `month` parameter is optional and falls back to the wall clock**, and
>   `tracking/page.tsx:138` is the caller that forgets — it passes no month at all. Both are pinned by
>   characterization tests that assert the *current* wrong behaviour, including one proving identical
>   input gives different output depending on today's date. W5's diff should turn those red; that is the
>   signal the fix landed.
> - **The `startsWith` month filter is immune to timezone drift**, and a test records that as a property
>   to preserve. Whatever replaces it must keep it — this is the bug class
>   `data-migration-standards.md` names.
> - **W5 needs no Dexie version bump.** `data-migration-standards.md` puts month-scoping columns in
>   **W3's** consolidated v7, and `wave-5-month-scoping.md:33` says W5 does in-memory `userId` filtering
>   precisely because the column is not there yet. Note `waves/README.md:98` justifies W5's dependency on
>   W0 as "migration test before touching the schema", which reads as though W5 touches schema — it does
>   not. Minor doc tension, flagged rather than silently edited.
>
> Load-bearing for waves after that: `INCOME_THRESHOLD` is **not** unused, so W2b needs its three real
> importers; `storage/income.ts` has **three** `monthlyEquivalent` summing sites rather than one (W7a);
> and there are three `fake-indexeddb` limitations W3's migration test must work around, the most
> important being that **it does not preserve `Blob` at all**.
**Operative date:** **December 1, 2026** — see [`PRD.md`](PRD.md) § 10

> **This plan was independently validated on 2026-08-16** by five adversarial reviews. The legal analysis
> held; the **scope, the deadline, the wave ordering, and one ADR formula did not.** All findings are
> recorded in [`../audit/validation-findings-2026-08.md`](../audit/validation-findings-2026-08.md) and the
> corrections are folded in. Read that document before trusting any pre-validation figure you may have
> cached.
>
> **The five things that changed:**
> 1. **44 jurisdictions**, not 43 — Tennessee was missing, and DC was double-counted.
> 2. **The date is ~December 1, 2026**, because the application review period assesses the months
>    *preceding* application. Three provisions soften it for existing enrollees; none soften it for new
>    applicants or for Nebraska, Montana, Arkansas, or Iowa.
> 3. **Wave order inverted.** Copy corrections first, month scoping third, dependency modernization last.
> 4. **ADR-0004's proxy guard was a bug** that broke CMS's own worked example.
> 5. **An hours calendar is the wrong primary surface** for a large share of users.

---

## The situation in five sentences

CMS issued CMS-2454-IFC on June 3, 2026. It took effect July 31, 2026, and 44 jurisdictions must implement the
community engagement requirement by **January 1, 2027**. The rule is far more specific than the statute
HourKeep was built from, and in several places it contradicts what HourKeep currently tells users — most
seriously about income, which is **MAGI-based household income**, not individual earned income. HourKeep
also has no concept of the three-tier status model, the review period, short-term hardship, or the notice
response workflow. This effort makes the app factually correct and repositions it from *deciding* status to
*assembling evidence*.

---

## Read in this order

| # | Document | What it gives you |
|---|---|---|
| 1 | [`PRD.md`](PRD.md) | What HourKeep must become and why. Product position, users, goals, requirements |
| 2 | [`gap-analysis.md`](gap-analysis.md) | Every delta between the app and the rule, classified by gap type and impact |
| 3 | [`waves/README.md`](waves/README.md) | Dependency graph and wave summaries |
| 4 | [`decisions/`](decisions/) | The nine architectural decisions and their reasoning |

**Source material**

| Document | Purpose |
|---|---|
| [`../domain/cms-2454-ifc/rule-extract.md`](../domain/cms-2454-ifc/rule-extract.md) | The authoritative cited extract. **The single source of truth for what the law requires** |
| [`../domain/cms-2454-ifc/state-options.md`](../domain/cms-2454-ifc/state-options.md) | The 16 State-configurable parameters, the policy-profile schema, and a per-State tracker |
| [`../domain/cms-2454-ifc/2026-11094.txt`](../domain/cms-2454-ifc/) | The full rule as plain text, plus `SECTION-INDEX.txt` for navigation |
| [`../audit/codebase-audit-2026-08.md`](../audit/codebase-audit-2026-08.md) | Full codebase audit at commit `75d8e7c` — architecture, 14 defect classes, dead code, dependency currency |
| [`../../.kiro/steering/medicaid-domain-knowledge.md`](../../.kiro/steering/medicaid-domain-knowledge.md) | Working domain reference, rewritten against the IFC |

---

## The three rules

Everything else follows from these.

1. **HourKeep does not determine anyone's status.** States determine eligibility, exclusions, and
   compliance. We assemble, organize, and present evidence. Never assert a verdict. (ADR-0003)
2. **Never hardcode a policy value.** Every threshold and lookback is statutory-but-dynamic or a State
   election. All of them live in the policy profile. (ADR-0001)
3. **Test the math first.** Failing test, then fix, for anything in the five compliance-critical modules.
   (ADR-0007)

---

## Wave status

Sequence and dependencies: [`waves/README.md`](waves/README.md).

**Ships by December 1, 2026**

| Wave | Theme | Status |
|---|---|---|
| **W0-slice** | Test runner only — Vitest, a `test` script, nothing else | **Done** 2026-08-17 |
| **W2a** | Truth in copy | **Done** 2026-08-17 — 10 gap rows closed, 5 partial |
| [W0](waves/wave-0-safety-net.md) | Safety net, deletion, 4 data-loss fixes | **Done** 2026-09-01 — 4 data-loss fixes, delete-all-data, 14 files deleted, 196 → 423 tests. 1 criterion unmet (phone viewport) |
| [W5](waves/wave-5-month-scoping.md) | Month scoping + review periods | **Done** 2026-09-02 — `ReviewPeriod` model, month required and validated, `Calendar` controlled, 423 → **526** tests (this row said 525; `npm test` at W5's tip `ad8ac87` returned 526), 62 → 72 e2e. All 9 live criteria met; 1 struck to W3. First wave with 4/4 reviewers. **Did not close gaps 15.6/15.7, which were assigned to it** |
| [W2b](waves/wave-2b-policy-profile.md) | Policy profile | **Done** 2026-09-02 — `src/lib/policy/` with `FEDERAL_DEFAULT` over 36 fields, `incomeThreshold()` a function so it tracks the wage, `ReviewPeriodPolicy` a `Pick` of the profile, zero policy literals in non-test `src/`, 526 → 668 tests, 72 → 74 e2e. **30 of 33 criteria**; 4/4 reviewers. Gaps 15.6/15.7 answerable but uncalled → W9a |
| W6a | Evidence capture | **Done** 2026-09-03 — `workProgram` type, work sub-kinds, education half-time cliff + credit conversion, community-service record schema, VA/SNAP-TANF document types. 9 gap rows closed, 1 partial (4.11→W7b), 4.5→W6b. **No Dexie bump** (`git diff db.ts` empty, still v6). 668 → **721** tests; 74 e2e. 4/4 reviewers; the multi-model semantic review caught a half-time false-shortfall at the form→summary join, since fixed. engines floor raised, `next` advisory recorded |
| W7a | Seasonal + income corrections | **Done** 2026-09-03 — income sums actual amounts received (the live 4× false positive is gone, verified $600 not $2,598), pay-period multiplication demoted to a labeled estimate, seasonal window fixed to the 6 months preceding the assessed month, sparse history flagged. 5 gap rows closed, 2 partial. **No Dexie bump** (`git diff db.ts` empty, v6). 721 → **732** tests; 74 e2e. 4/4 reviewers; both semantic models caught the seasonal divisor (÷months-with-data overstated vs CMS's ÷6), since corrected |
| W8a | Print evidence export | **Done** 2026-10-15 — print-ready `/export/package` artifact (survives fax), a thin `evaluateMonth` single call site so the export cannot contradict the UI (gap 8.9), the seasonal average carried onto the artifact, exclusion-document storage + export, a PII warning, and 2028 document-gap flagging. 4 gap rows closed (8.1, 8.3, 8.7, 8.9), 2 partial (8.8 print-only → W8b; **8.5** storage+export only, capture UI → W4). **No Dexie bump** (`git diff db.ts` empty, v6 — `exemptionId` is unindexed). 770 → **778** tests; 74 → **88** e2e. 4/4 reviewers; the two-model semantic review returned NEEDS_CHANGES with 18 findings — the cross-table attachment-reference collision and the one-comparison-per-month regression were defects in the joins between layers, both fixed and re-verified in a 375px browser |

**After the date**

| Wave | Theme |
|---|---|
| [W3](waves/wave-3-status-model.md) | Three-tier status model (owns the consolidated Dexie v7) |
| [W4](waves/wave-4-screening-rebuild.md) | Screening rebuild |
| W7b | Unified compliance |
| W9a / W9b | Notice response / hardship |
| W8b | ZIP, JSON, import |
| W6b | Activity model remainder |
| [W10](waves/wave-10-accessibility-privacy.md) | Accessibility + privacy |
| [W1](waves/wave-1-modernization.md) | Dependency modernization |

The `wave-2`, `wave-6`, `wave-7`, `wave-8`, and `wave-9` files hold combined scope from before the split;
they are the source for each half. Write the split halves when they start.

---

## Decisions

| ADR | Decision |
|---|---|
| [0001](decisions/ADR-0001-policy-profile-architecture.md) | Policy profile with `FEDERAL_DEFAULT`; per-State support is additive |
| [0002](decisions/ADR-0002-three-tier-status-model.md) | Excluded / excepted / hardship / applicable, resolved per month |
| [0003](decisions/ADR-0003-evidence-not-adjudication.md) | **Evidence organization, not adjudication.** The load-bearing decision |
| [0004](decisions/ADR-0004-unified-compliance-view.md) | Remove the hours/income mode fork; implement combination and the income-to-hours proxy |
| [0005](decisions/ADR-0005-month-scoped-data-model.md) | Month is an explicit required parameter; review periods are first-class |
| [0006](decisions/ADR-0006-evidence-package-export.md) | Period-scoped evidence package: print-ready HTML, ZIP, JSON |
| [0007](decisions/ADR-0007-test-strategy.md) | Vitest, tiered obligation, TDD for domain logic |
| [0008](decisions/ADR-0008-rejected-medicaid-eligibility-api.md) | **Rejected** MAGI in the Cloud as a runtime dependency; harvest its config schema instead |
| [0009](decisions/ADR-0009-dependency-modernization-timing.md) | Modernize early and isolated; remove Tailwind; actually load Inter |

---

## The ten things most worth remembering

1. **Income is MAGI-based household income** (§ 435.552(f)(2)). Includes unearned income, follows **tax
   filing relationships** rather than residence — but **excludes** dependents not required to file. A married
   user whose spouse works may already qualify with zero hours, and HourKeep currently tells them they're
   failing.
2. **Most users may need to do nothing.** $580 is ~32% of the single-person eligibility ceiling, and CMS
   estimates **56% will be verified ex parte**. The residual ~8.8 million are defined by what payroll data
   misses: unpaid and in-kind work, caregiving, community service, unmatched gig income, part-time school.
   **Build for them, not for the calendar.**
3. **Three tiers, not one flag.** Specified excluded (State is *prohibited* from assessing), mandatory
   exception (deemed compliant per month), optional hardship (State election).
4. **Prior exclusion is itself an exception** (§ 435.553(a)(4)), so losing exclusion protects the months you
   held it. The rule's main transition protection. And **exclusion has no monthly-duration requirement.**
5. **Education at least half-time qualifies with zero hours** and cannot be combined. Less than half-time
   converts at `creditHours × 3 × 4.33`.
6. **Hours and income combine** via the income-to-hours proxy (§ 435.552(e)(2)) — but the State must
   **allocate hours between household members**, so any figure we show is an **upper bound**.
7. **Seasonal averaging excludes the assessed month.** HourKeep includes it — off by one. And the
   **reasonably-predictable-changes** alternative can invert the answer for the same person.
8. **Documentation hardening is per-State.** January 1, 2028 federally; **January 2027 in eight States**.
9. **The 30-day window is ~35 days**, and under the State's **Option 2** election a user may get two
   sequential windows — or, if other renewal factors are also unverified, **none at all.**
10. **TDIU veterans qualify** at 100% *compensation* even with a combined rating below 100%. Asking only
    "is your rating 100%?" excludes them.

---

## Known gaps in the plan itself

Deliberately left open. Not defects — decisions to close later.

1. ~~**`§ 435.603` is not extracted.**~~ — **done 2026-08-16, commit `b9b9594`.** Text is at
   [`../domain/supporting-regs/README.md`](../domain/supporting-regs/README.md) § 1. **Cite that, not
   `rule-extract.md`, for household-income claims** — the extract carried CMS's preamble gloss ("the total
   income of everyone in the household"), which overstates income. Found on the W2a dry run and corrected;
   see `rule-extract.md` § 2.6.
2. **PRD requirement-to-wave traceability** has known mismatches (R1.6 → W3 not W4; R6.3 and R6.8 both citing
   gap 8.9; R8.2's TDD clause spanning waves; gaps 2.11 and 2.12 with no acceptance criteria). Cosmetic for
   execution; clean up before W3.
3. **Ten specific acceptance criteria are still weak.** A global rule is in the Definition of Done; the
   individual criteria in W3–W10 were not rewritten. Fix each at its wave's start.
4. **Split wave files don't exist** for W6b, W7a/W7b, W8a/W8b, W9a/W9b. The combined `wave-2`,
   `wave-6`, `wave-7`, `wave-8`, `wave-9` files are the source.
   **W6a now has its own file** — [`waves/wave-6a-evidence-capture.md`](waves/wave-6a-evidence-capture.md),
   written 2026-09-03 by re-verifying `wave-6-activity-model.md`'s claims against the tree. As the
   precedents below predicted, the source was short: the `workProgram` change is **42 lines across 11
   files**, not "a type-union change plus a form option", and `waves/README.md` assigned gap **4.5 to both
   W6a and W6b** (resolved to W6b) and 4.1's remainder to a non-existent v8 (resolved to W6a, no bump).

   > **A related mismatch W5 surfaced, 2026-09-02.** Closing a wave against its own acceptance criteria is
   > not the same as closing the `gap-analysis.md` rows assigned to it. W5 met every live criterion in its
   > file while leaving **gaps 15.6 and 15.7** untouched — because neither appears anywhere in W5's scope,
   > and both need a State implementation date that only W2b's policy profile can supply. Both reassigned
   > to W2b with the reasoning recorded in `gap-analysis.md`. **When a wave closes, check the gap rows
   > assigned to it as well as its own criteria**, and reassign with a reason rather than leaving them
   > looking abandoned.
   >
   > **W2b then hit the same wall from the other side, 2026-09-02, and the resolution is different.** It
   > built both functions, cited and tested them — and they have **zero production callers**, because
   > § 435.915 needs a filing date the app never collects and § 435.559(c) needs a renewal due month that
   > exists nowhere outside W5's anchor. So the rows are **`PARTIAL`, not struck**, and reassigned to
   > **W9a**, the first wave with a surface to render either answer on. **"The logic exists" is not
   > "the gap is closed"** — a user still cannot learn either fact from the app. Two reviewers landed on
   > the same phrase independently: *answerable, not closed.*
   >
   > Mechanically: **the closure convention in `gap-analysis.md` only works if every wave uses it.** W0
   > and W5 left **no** annotations in that file at all, which is how 15.6 and 15.7 came to look
   > abandoned. Each wave writes its own closure line at closeout; W3 owns backfilling W0's and W5's.
   **W2a now has its own file** — [`waves/wave-2a-truth-in-copy.md`](waves/wave-2a-truth-in-copy.md),
   written 2026-08-17. Worth reading before the next split: re-verifying wave-2's § 2.5 site table against
   the code found **nine** errors before any code was written, and running the guard test found **seven
   more**. The table listed a dead file and omitted a live one, and its 11 sites were really 78 lines
   across 14 files. Verify a site list against the tree before trusting it.
5. ~~"No production users" is unverified~~ — **checked 2026-08-16, and the justification is withdrawn.**
   Evidence strongly suggests no real users (site live but the build is dated 2026-01-14; repo has 1 star,
   0 forks, 0 watchers, 0 issues ever, 0 views in 14 days). But the question is **structurally unanswerable**:
   data lives in per-browser IndexedDB, and Plausible can report page views but not whether any visitor
   completed onboarding. **So migrations must preserve data regardless.** See ADR-0002.

## Open questions to watch

1. **A final rule is coming.** Interpretations may shift. The policy profile is versioned so a change is new
   data, not a rewrite — `effectiveFrom`, `source` and `confidence` are on every profile.

   > **The "79,718 comments" figure is unverified.** It is repeated in `src/lib/policy/types.ts` and appears
   > nowhere in the rule text or anywhere else in this repository. Flagged at W2b closeout rather than
   > removed, because it may well be right — but nothing here establishes it. Cite it or drop it.
2. **§ 435.916 renewal conflict.** The IFC text says 12-month MAGI renewals; its own preamble says 6 months
   for the adult group under § 1902(e)(14)(L). Separate rulemaking presumably pending.
3. **Most States' elections are unknown**, especially whether hardship is offered — which determines whether
   a whole feature is relevant to a given user.
4. **State medically-frail condition lists.** Only **Georgia's** is published, and it is **two-tier**
   (automatic plus case-by-case), so "is my condition on the list?" is not a yes/no question. Note the rule
   says States must **develop** the list (§ 435.554(c)(5)(ii)), not publish it — a distinction that matters
   because the app tells users to ask for it. *Merged 2026-09-02 with a duplicate item that said "none
   catalogued", which this one contradicted.*
5. **CMS SPA / election templates** were "under development." Once published, they are the authoritative
   source for most of `state-options.md`.
6. **Emmy's survival.** CMS calls it "a prototype… currently being piloted," and there are credible reports
   it may be discontinued — though commit activity through 2026-08-14 is high. ADR-0006 deliberately does not
   depend on it. **Recheck before W8a.**
7. ***Massachusetts v. Oz*** — summary judgment hearing **October 20, 2026**, aimed at the medically-frail
   functional gate. Could land before the deadline.

   > **Needs a real citation.** The venue, the June 2026 filing, the July 2026 injunction denial and the
   > October 20 hearing date now sit in `src/lib/policy/federalDefault.ts` as the `watch` condition on a
   > **Tier-1 field** (`frailtyListStructure`), and they trace only to
   > `.kiro/steering/medicaid-domain-knowledge.md`. Absent from the IFC and from `rule-extract.md`. Flagged
   > at W2b closeout. **Verify before W4**, which is the wave that acts on it.
8. **The eight-State January 2027 frailty-documentation list** (AR, ID, IN, IA, NC, ND, OH, UT).
   `state-options.md` attributes it to Politico and to state agencies; nothing federal confirms it. The
   **federal 2028-01-01 date is confirmed** in rule text (§ 435.557(b)(2), 91 FR 33474). Treat the
   eight-State claim as secondary-source until checked.

---

## Housekeeping

The 13 specs under `.kiro/specs/` predate this effort. Several are superseded by these waves —
`exemption-documentation` (0/12), `exemption-terminology-realignment` (21/16), and
`workpath-enhanced-onboarding` (28/19) most directly. Reconcile or archive them when the relevant wave
starts, rather than leaving two competing plans in the repository.
