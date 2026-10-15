# Wave 8a — Print Evidence Export

**Depends on:** **W6a** (the export must carry the corrected record shapes — community-service record,
work sub-kind, education enrollment status) and **W7a** (it must carry the corrected income arithmetic and
the seasonal average). Both done.
**Blocks:** **W8b** (ZIP + JSON + import) and **W9a** (which reuses the package as a notice response).
**Source:** split out of [`wave-8-evidence-package.md`](wave-8-evidence-package.md), whose combined scope
also covers W8b. Read the **`evaluateMonth` does-not-exist note** at the top of that file first — it is the
one dependency the W7/W8 split left unresolved, and this wave resolves it (see § The single evaluation path).
**Decision record:** ADR-0006.
**Written:** 2026-10-15, by re-verifying the combined file's claims against the tree at `917bcd1`. As with
every prior split ([W2a](wave-2a-truth-in-copy.md), [W2b](wave-2b-policy-profile.md),
[W6a](wave-6a-evidence-capture.md), [W7a](wave-7a-seasonal-income-corrections.md)), the source's scope and
site counts were re-measured, not inherited. This is the **last wave that ships before the operative date**
(~December 1, 2026).

---

## What the source got wrong, or left unresolved — verified before any code

The combined `wave-8` file predates the W7/W8 split and ADR-0006's own validation corrections. Four things
checked against the tree at `917bcd1`:

**1. `evaluateMonth` does not exist, and three documents assume it does.** `grep -rn "evaluateMonth" src/`
returns nothing but doc hits and ADR-0005's illustrative signature. The combined scope says "Call
`evaluateMonth` rather than recomputing", `waves/README.md` lists "one evaluation path" as a W8a deliverable,
and ADR-0006 names it a non-negotiable. It is W7b's to build *as unified combination logic*, and W7b is
post-date. **W8a delivers the honest version: one call site, not one combined number.** See § The single
evaluation path.

**2. ADR-0006 lists three formats; W8a ships one.** `waves/README.md` § Sequence and the ADR-0006 risk
table both say print-ready HTML first, ZIP and JSON after. **ZIP, the JSON rewrite, and import are W8b**
(post-date). The acceptance criteria below drop the two ZIP/JSON criteria the combined file carried.

**3. Gap 8.4 is already CLOSED by W6a** — `va-disability` and `snap-tanf-approval` are live `DocumentType`
values (`src/types/documents.ts`). W8a does not re-close it; it **consumes** it (those documents must appear
in the package). The combined file's acceptance list implied 8.4 was W8a's; it is not.

**4. The combined "attestation block" was corrected to a plain signature line on validation** (ADR-0006
§ Contents, the corrected note). An attestation block framed as a penalty-of-perjury statement risks burning
a user's once-per-enrollment medical-frailty attestation (§ 435.557(f)(1), hardened from Jan 1 2028). The
package carries a **plain signature-and-date line**, no attestation language. The acceptance criterion is
written to that corrected shape.

---

## The gap rows W8a owns — measured against `gap-analysis.md` § 8

`waves/README.md` assigns W8a `8.1, 8.4, 8.5, 8.7, 8.8, 8.9`. Reading § 8 directly and reconciling:

| Gap | What it is | W8a disposition |
|---|---|---|
| 8.1 | Must accept submissions via online, phone, mail, in person, electronic — export is JSON + plain text only, no print/mail-ready artifact | **CLOSE** — print-ready HTML + the `submissionModalities` list read from the profile |
| 8.3 | From Jan 1 2028 documentation is required when reasonably available; no date awareness, no escalation | **CLOSE** — document-gap flagging driven by `documentationRequiredFrom` from the profile. In ADR-0006 scope ("escalating prominence as 2028 nears"); not in the README list but it is this wave's natural home |
| 8.4 | Named reasonably-available documents incl. VA, SNAP/TANF | **CONSUME, not close** — closed by W6a; the package must render these document types |
| 8.5 | Exclusion documentation — no document can attach to an exclusion response (`blocks`) | **CLOSE** — documents attach to an exclusion/screening response and appear in the package |
| 8.7 | Export must carry the evidence — all four document tables, `assessmentResults`, `seasonalWorkerStatus` absent from both paths (`blocks`) | **CLOSE** for the print surface (the HTML package carries documents, apparent status, seasonal) |
| 8.8 | JSON reads `db.profiles` directly, shipping `dateOfBirth`/`medicaidId` as ciphertext (`harmful`) | **CLOSE for the print surface** — the HTML package decrypts via `getProfile`. **The JSON path stays ciphertext-leaking and is W8b's.** See § The JSON path stays as-is |
| 8.9 | Readable report re-hardcodes `>= 80`/`>= 580`, skips seasonal, renders one mode per month — can contradict the UI (`harmful`) | **CLOSE** — the export routes through the single evaluation path and recomputes nothing |

**Not in W8a:** **8.2** (an adult in the household / authorized representative may submit) — a
submission-identity concept, not a print-artifact concern. It belongs with W9a's response workflow (which
already owns the `§ 435.907(a)` who-may-submit text) or W8b. Flagged here rather than silently dropped.
**8.6** (ex parte-first explanation) is substantially met by W2a's `RequirementFacts`; the package's legend
restates it, but the row is not claimed closed by W8a.

So W8a's realistic close set is **8.1, 8.3, 8.5, 8.7, 8.8 (print surface), 8.9** — six rows, with 8.4
consumed and 8.2/8.6 noted. The exact running total is computed at closeout against the live document, not
asserted here.

---

## The single evaluation path — the load-bearing decision

**The defect (gap 8.9) is real and live.** `buildTextReport.ts` recomputes both totals inline, calling
neither of the two evaluators the UI uses:

- Hours: `buildTextReport` does `monthActivities.reduce((sum, a) => sum + a.hours, 0)`. But
  `calculateMonthlySummary` (`calculations.ts`) **deliberately does not** sum education rows that way — after
  W6a's half-time cliff, it derives the strongest education status and contributes `0` for at-least-half-time
  and the credit-hour conversion for less-than-half-time. So for any month holding a less-than-half-time
  education row whose stored `hours` differ from its converted contribution, **the export prints a different
  total than the dashboard**. A half-time row stores `hours: 0` so it is masked today, but the divergence is
  structural, not hypothetical.
- Income: `buildTextReport` sums `entry.amount` inline (correct since W7a) but **never receives seasonal
  status**, so a seasonal worker's artifact prints the assessed month's own total against the threshold —
  not § 435.552(g)'s six-month preceding average, which `getMonthlyIncomeSummary` already computes correctly
  via `calculateSeasonalAverage`. This is W7a's deferred finding 6.

**The resolution, and its boundary.** W8a introduces `evaluateMonth(month, data, policy)` in a new module
`src/lib/evaluateMonth.ts` — **one function the export and the UI both call**, wrapping today's
`calculateMonthlySummary` and `getMonthlyIncomeSummary` **as they stand**. It returns the computed facts for
a month: the hours summary, the income summary (including resolved seasonal average and history), and the
thresholds. It does **not**:

- combine hours and income into one total (that is ADR-0004 / W7b, needs W3 + W4);
- implement the § 435.552(e)(2) income-to-hours proxy (W7b);
- surface any `isCompliant` / `complianceStatus` field. Those live on the summary objects and W7b renames
  them; `evaluateMonth` returns facts, and **the export reads totals and thresholds, never a verdict**
  (ADR-0003). Carrying `isCompliant` onto the one artifact a caseworker reads is the exact failure this
  structural change exists to prevent.

That delivers "one evaluation path" honestly — **one call site, not unified combination logic** — and leaves
W7b free to replace the internals without touching either caller. ADR-0006 § Non-negotiables, as corrected by
the `wave-8-evidence-package.md` recommended-resolution box.

**`evaluateMonth` is Tier 1** (export/evaluation logic, per `engineering-standards.md`'s "plus policy /
review-period / export logic"): failing test first, each test name carrying the CFR citation and FR page. It
takes an optional `policy: PolicyProfile = FEDERAL_DEFAULT` final parameter and is added to the scan list in
`policyInjection.test.ts` and to `POLICY_FIELD_OWNERS` in `types.ts`.

**Async boundary — the builder stays pure.** `getMonthlyIncomeSummary` is async (it reads seasonal status
from Dexie). `buildTextReport` is a pure synchronous function over already-loaded data, which is the whole
reason W2a extracted it and the reason it is testable. **`evaluateMonth` does the async work in the caller
(the page), and its resolved result — including seasonal data as plain data — is passed into the builder.**
The builder gains a typed `evaluation` input and loses its inline hours `reduce`; it does not gain a Dexie
read. This holds the storage-layer rule ("no component or pure function touches Dexie") and the Tier-1
testability contract at once.

---

## Exclusion documentation (gap 8.5) — the one schema-adjacent change, and why it needs no bump

Today a `Document` row has a **non-optional** `activityId: number` foreign key (`src/types/documents.ts`),
indexed at `documents: "++id, activityId, type, createdAt"` (`db.ts` v6). An exclusion/screening response
(`db.exemptions`) has no way to carry a document — gap 8.5, `missing`/`blocks`.

**The change:** make `activityId` optional and add an optional, **unindexed** `exemptionId?: number` to
`Document`. A document then links to *either* an activity *or* an exclusion screening. Per
`data-migration-standards.md`:

- Adding an unindexed field is **free** — `.stores()` declares the primary key and indexes, not stored
  fields. `exemptionId` is unindexed nested data on an existing row, exactly like `communityService` and
  `onboardingContext` before it.
- Making `activityId` optional is a **type** change, not a schema change — the index `activityId` simply has
  no value for exclusion documents, which Dexie permits.
- **No new table, no new index, no `.upgrade()`, no version bump.** `git diff src/lib/db.ts` must be empty at
  close, as it was for W5/W6a/W7a.

**The hard line, flagged deliberately:** if the exclusion-document feature turns out to need an *efficient
query* of documents by `exemptionId` (e.g. "show all documents for this screening" on a list surface), that
is a **new index** → it triggers the eight-document renumber (W8a v7, W3 v8, W6b v9) and is a deliberate
decision, not a side effect. **STOP and raise it.** The package itself does not need the index — it iterates
all documents once and partitions them by `activityId` / `exemptionId` / `incomeEntryId` in memory, which is
what a one-shot export does anyway. The capture UI attaches to a single known screening id. So the no-index
path is sufficient; the index is only tempting, and the answer to the temptation is renumber-or-don't.

Deletes must cascade: deleting an exclusion screening that carries documents removes the documents and their
blobs, mirroring `deleteActivityWithDocuments` / `deleteIncomeEntryWithDocuments` (documents first, screening
last, screening not deleted if any document failed). Orphaned blobs are invisible and unbounded
(`data-migration-standards.md`).

---

## Primary-source anchors — CFR paragraph + FR page, resolved from `2026-11094.txt`, not recalled

| Claim | Citation | FR page |
|---|---|---|
| Submissions accepted online, phone, mail, in person, electronic | § 435.907(a) | 91 FR 33381 (preamble) |
| Who may submit: the individual, an adult in their household/family, an authorized representative, someone acting responsibly if incapacitated | § 435.907(a), § 435.555(b)(2) | 91 FR 33381 — **W8a surfaces the channels (8.1); who-may-submit is W9a/8.2** |
| Ex parte first — the State must exhaust reliable information before asking | § 435.557(a)-(b) | 91 FR 33395. Cite the **(a)-(b) pair**: the June 29 2026 correction shifted paragraph designations inside § 435.557 |
| Documentation examples CMS names as reasonably available: paystubs, a community-service-organization document, transcripts/class schedules, a VA disability document, SNAP/TANF approval notices | § 435.557(b)(2); § II.I.3 | 91 FR 33395 |
| From Jan 1 2028 the State must require documentation when reasonably available | § 435.557(b)(2)(ii) | 91 FR 33395 |
| Through Dec 31 2027 the State may require documentation OR accept other information | § 435.557(b)(2)(i) | 91 FR 33395 |
| The State must accept other information when no documentation is reasonably available, and may not deny solely for lack of documentation that does not exist (family caregiving, records lost to fire/flood) | § 435.557(b)(2)(iii) | 91 FR 33395 |
| Documentation requirement date is **per-State** (federally 2028-01-01; eight States from Jan 2027) | § 435.557(b)(2)(ii) | 91 FR 33474 — read from `profile.documentationRequiredFrom`, never hardcoded |
| Seasonal average is the 6 months preceding the assessed month | § 435.552(g) | 91 FR 33470 — already computed by `calculateSeasonalAverage`; W8a carries it onto the artifact |
| The State makes the determination; it is appealable | § 435.556, § 431.220(a)(1) | 91 FR 33473 — the package legend, no verdict |

---

## Scope

- **`src/lib/evaluateMonth.ts`** — the single evaluation path (§ above). Tier 1, TDD-first, optional policy
  parameter, added to both policy-scan lists. Wraps `calculateMonthlySummary` + `getMonthlyIncomeSummary`;
  returns facts, never a verdict; resolves seasonal data for the caller.
- **`buildTextReport` reads the evaluation, not its own reduce.** Replace the inline hours `reduce` with the
  hours total from the passed-in evaluation. The income block already sums `amount` (W7a); it now also
  renders the seasonal average + history for a seasonal month, from the evaluation. The export page becomes
  the async caller that runs `evaluateMonth` per month and passes the result in.
- **Print-ready HTML package** — the primary new artifact. A period-scoped (or month-range) document built
  for the browser's own print pipeline (`window.print()` → PDF). Per ADR-0006 § Contents: cover summary
  (name, State, Medicaid ID, date of birth, contact — **decrypted via `getProfile`**, never ciphertext);
  per-month activities with the community-service record fields, income evidence, apparent status *with its
  CFR citation*, and document counts; a document manifest; the attachments; a **plain signature-and-date
  line** (no attestation language); and a legend stating the State decides. **It must survive fax:** black-
  and-white legible, no colour dependency, every page self-identifying with name + month + case reference
  (faxed pages arrive separated). Letter and A4.
- **Documents carried as real evidence.** The package iterates `documents`, `incomeDocuments`, and (new)
  exclusion documents, renders a manifest (type, capture date, linked activity/month/exclusion, a stable
  reference) and the image blobs themselves. Blobs read via the existing `getDocumentBlob` /
  `getIncomeDocumentBlob`.
- **Exclusion documentation (gap 8.5).** `Document` gains optional `exemptionId?`, `activityId` becomes
  optional; a capture surface attaches a document to an exclusion/screening response; the package renders
  them. No index, no bump (§ above). Delete cascade added.
- **PII warning before download/print.** The package carries name, DOB, and Medicaid ID *by design* because
  the agency needs them. A warning says so before the artifact lands in the downloads folder or print dialog.
  The warning UI is a component → it joins the no-verdict render guard in the same commit.
- **2028 document-gap escalation (gap 8.3).** Months lacking documentation are flagged; prominence escalates
  as `profile.documentationRequiredFrom` nears. Conditional on the State's date, which the copy names.
- **`submissionModalities` wired (gap 8.1).** The package tells the user their channels, read from the
  profile (first reader of this field; it is W8a-owned in `POLICY_FIELD_OWNERS`).
- **No verdicts anywhere in the output** (ADR-0003). Logged / Threshold / Difference, apparent status as a
  Deferred pathway with its citation, never "compliant".

## Explicitly out of scope (and why)

- **ZIP, JSON rewrite, import → W8b** (post-date). Print-ready HTML ships first (ADR-0006 risk table).
- **The combination engine and the income-to-hours proxy → W7b.** `evaluateMonth` is one call site, not one
  combined number. Half-building the proxy pre-date is how the export ends up asserting a verdict.
- **The `isCompliant` / `complianceStatus` renames → W7b.** `evaluateMonth` returns facts and does not read
  those fields; the export never prints them. The names stay until W7b retires the mode fork.
- **The existing JSON export is left live and unchanged** — see below.
- **8.2 (representative may submit) → W9a / W8b.** A submission-identity concept, not a print artifact.

## The JSON path stays as-is — documented, not fixed

The current `handleExportJSON` in `src/app/export/page.tsx` reads `db.profiles` directly, shipping
`dateOfBirth` and `medicaidId` as AES-GCM ciphertext with no key (gap 8.8), and omits every document table
(part of 8.7). **W8a leaves this button live and unchanged**, by explicit decision (owner, 2026-10-15):
the ciphertext/documents fixes belong to **W8b**, and the owner is reworking that area, so there is no value
in a stopgap now. W8a closes 8.8 **for the new print surface only** (which decrypts via `getProfile`); the
JSON path's 8.8/8.7 defects remain open and are W8b's. Recorded here so the live defect is not mistaken for
an oversight. No UI regression, no suppression.

---

## Acceptance criteria — each names an observable, every negative has a positive twin

- [ ] **One evaluation path, export recomputes nothing.** A test asserts `buildTextReport`'s hours total for
      a month equals `evaluateMonth`'s hours total, and that a **less-than-half-time education month** prints
      the credit-hour-converted contribution the dashboard shows, not the raw stored `hours`. Positive twin
      for 8.9: a mutation that reverts the export to its own `reduce` makes this test fail. (§ 435.552(d),
      91 FR 33470-33471)
- [ ] **The seasonal average reaches the artifact.** For a seasonal worker with an assessed month of July and
      recorded history, the package prints the **January–June average** as the compared figure and marks
      unrecorded months "No record", not the single-month total. Positive twin: a non-seasonal month still
      prints that month's own total. (§ 435.552(g), 91 FR 33470)
- [ ] **No ciphertext in the print surface.** The package renders the decrypted `dateOfBirth` and
      `medicaidId` (via `getProfile`); a test asserts the rendered output contains the plaintext fixture
      values and not their encrypted form. (gap 8.8, print surface)
- [ ] **Documents appear as real attachments with a manifest.** A package built over a fixture with an
      activity document and an income document renders a manifest row for each (type, capture date, linkage,
      reference) and includes the blob. Positive twin: a month with no documents renders a manifest that says
      so, not an empty section that reads as "none required". (gap 8.7)
- [ ] **Exclusion responses can carry documents, and they appear in the package.** A document saved with an
      `exemptionId` round-trips through IndexedDB and renders in the package under its exclusion response.
      Positive twin: an activity document still renders under its activity. (gap 8.5, § 435.557(b)(2),
      91 FR 33395)
- [ ] **`git diff src/lib/db.ts` is empty** and the browser shows `HourKeepDB` still at version 6 — the
      exclusion-document link added no table and no index. (positive twin: the exclusion document from the
      criterion above round-trips, proving the unindexed field persists)
- [ ] **Print-ready output is legible on Letter and A4 and self-identifies every page.** Verified in the
      Playwright MCP under print emulation at 375×812 build + a desktop print preview: each month block
      carries name + month + case reference as a repeated header element (asserted in the DOM), and the
      stylesheet uses no colour-only distinction (asserted: status/manifest cues have a non-colour form).
      Honest limit stated in Convergence: "legible on fax" is not fully automatable; it is verified by eye in
      a greyscale print preview.
- [ ] **A plain signature-and-date line is present; no attestation language.** The package renders a
      signature line and date field; a test asserts the output does **not** contain "penalty of perjury" /
      "attest" / "under penalty" wording. Positive twin: the signature line itself is present. (ADR-0006
      § Contents, corrected)
- [ ] **No output states a compliance verdict.** `findVerdictPhrases` over the package output returns `[]`,
      and the new PII-warning component is in `no-verdict.render.test.tsx` with both branches rendered.
      Positive twin: apparent status renders as a Deferred pathway with its citation and the words "your
      state decides". (ADR-0003)
- [ ] **A PII warning appears before download/print.** The warning renders name/DOB/Medicaid-ID language and
      a confirm affordance before the artifact is produced (render test drives it). Positive twin: the
      confirm path produces the artifact.
- [ ] **Months lacking documentation are flagged, prominence conditional on the State's date.** A month with
      activities but no documents renders a gap flag; the copy names `documentationRequiredFrom` as a State
      election and escalates as 2028 nears. Positive twin: a month with documents renders no gap flag.
      (gap 8.3, § 435.557(b)(2)(i)-(iii), 91 FR 33395)
- [ ] **A user can export a package for any review period or month range.** The export surface offers period
      selection (from W5's `ReviewPeriod`) or an arbitrary range, and the package is scoped to it. Positive
      twin: selecting a two-month range renders exactly those two months.

## Risks

| Risk | Mitigation |
|---|---|
| **Largest feature in the plan**, and the last before the date | Ship print-ready HTML only; ZIP/JSON are W8b. Commit in logical pieces so each is independently green |
| `evaluateMonth` could leak a verdict (`isCompliant` from the income summary) onto the one artifact that matters most | Return facts, not the summary objects' verdict fields. A render test asserts no verdict phrase in the package output. This is the ADR-0003 harm the structural change exists to prevent |
| The builder is pure and `getMonthlyIncomeSummary` is async | Resolve `evaluateMonth` in the page; pass plain data into the builder. The builder gains an `evaluation` input, not a Dexie read. Keeps W2a's testability contract |
| Print stylesheets vary across browsers; "survives fax" is not fully automatable | Simple layout, no exotic CSS, no colour-only cues, per-page self-ID. Verify in Chrome/Safari print preview via the Playwright MCP; state the fax limit honestly rather than claim a green |
| Exclusion-document link tempts a new index → eight-doc renumber | Package partitions in memory; capture UI uses a known id. No index needed. If a list surface wants one, STOP and raise — it is a deliberate decision |
| Large packages (many blobs) exhaust phone memory | Warn above a size threshold; allow narrowing the period. Blobs read lazily per month where possible |
| A new user-facing component created without the no-verdict guard — the defect W2b committed twice and W5 once | Add each new component (PII warning, package surface) to `no-verdict.render.test.tsx` **in the same commit that creates it**, and render both branches |
| The literal scan is blind to bare small integers (missed a `6` in W7a) and to `$`-prefixed values before the W2b fix | Add `evaluateMonth.ts` and any package module to the scan list; watch for a bare `80`/`580`/`$580` in the HTML template; thresholds come from the evaluation, not literals |

## Open questions carried into execution

- **Is the print package a React component rendered to a print route, or an HTML string fed to a print
  window?** A component is testable via the render guard directly; a string needs a string-level verdict scan
  *and* a rendered assertion (the W5 "`COMPLIANT` title-case slipped the case-sensitive source scan" lesson).
  Decide during the build; either way it joins a guard in the creating commit. Lean: a dedicated print route
  (`/export/package` or similar) rendered with MUI, so `@media print` CSS and the accessibility tree both
  apply and the Playwright MCP can drive it.
- **Does the no-verdict render guard become an inverted-allowlist meta-test** (enumerating `src/components/**`
  against the guard's imports), carried over from W6a's open question? It is still hand-maintained. Decide
  during execution; if adopted, seed from today's unguarded set.

## Definition of done (from `waves/README.md`, with W8a specifics)

`npm run build` + `npx tsc --noEmit` clean · `npm test` green, `evaluateMonth` and export logic TDD-first
(Tier 1) · `npm run lint` (3 pre-existing warnings expected, 0 errors) / `npm run format:check` clean ·
**`npm ci` exits 0** · **`npm run test:e2e` green** — the export is browser-visible, and this is the only gate
that sees print layout, real `Blob` bytes, and a 375px viewport · copy review: no verdict, every number
Computed / Conditional / Deferred, no new policy literal · every domain claim cites CFR + FR page · the review
protocol (`.kiro/hooks/wave-review.kiro.hook`) run — four reviewers, findings verified against the primary
source and in the browser before they count · gap rows struck with the wave number and **a closure line
written in `gap-analysis.md`** (W0 and W5 skipped it, to real confusion) and the running total updated ·
`git diff src/lib/db.ts` empty, `HourKeepDB` still v6 · `CHANGELOG.md` updated, led by what a user can see ·
phone-viewport smoke test.

## Convergence — what the review protocol found, 2026-10-15

Four reviewers ran in parallel (non-adjudication, domain-fidelity, data-integrity via
`bundled://investigate`; a two-model semantic review via `bundled://semantic-review-multi-model`,
since `invoke_sub_agent` is unavailable in this environment). **Non-adjudication APPROVED;
data-integrity APPROVED; domain-fidelity found the substance sound; the two-model semantic review
returned NEEDS_CHANGES with 18 de-duplicated findings — and it was right.** Every finding was verified
against the code before being acted on, and every user-visible fix was re-verified in a 375px browser via
the Playwright MCP.

**The recurring shape held a third time.** As on W6a and W7a, the three narrow reviewers each passed within
their lens and the semantic review found the defects in the **joins between layers** — the artifact's
rendering contract, the attachment-reference identity across two tables, the blob lifecycle across the
consent boundary. A lens-partitioned review cannot see those by construction; the design-level pass follows
the data. My own browser pass before the review missed all five High findings because the seed I used
happened not to exercise them (one document per table, no month with both record types) — a reminder that a
green manual check proves only what the fixture reached.

**The five High findings, each verified then fixed:**

- **Attachment references collided across two Dexie tables.** `documentReference` minted `DOC-${id}` for
  both `db.documents` and `db.incomeDocuments`, which have independent `++id` sequences, so an activity
  pay-stub and an income pay-stub both id `1` produced one reference, one React key, and one URL slot — the
  agency artifact rendering one image twice and dropping the other, on the one surface whose purpose is
  matching documents to claims. Fixed with a discriminated `TaggedDocument` and namespaced references
  (`ACT-`/`INC-`/`EXC-`) threaded through the model, the URL map, and the renderer. Verified in-browser: an
  activity doc id 1 and an income doc id 1 render as two distinct images under `ACT-1` and `INC-1`. Pinned
  by an e2e spec with real `Blob` bytes — the exact thing jsdom cannot check.
- **One comparison per month, mode heuristic, seasonal hid hours.** The package took no `complianceModes`
  (while `buildTextReport` read the stored row — two sources of truth), rendered one branch, and tested
  `isSeasonalWorker` before `mode`, so a seasonal worker's logged hours never reached the printed
  comparison. Gap 8.9's "one mode per month" clause was reproduced in the new surface. Fixed: the package
  takes `complianceModes`, renders both neutral comparisons when both record types exist, and seasonal is an
  income-block modifier. Verified in-browser.
- **Scope and consent.** Documents and exclusions were not period-scoped, and every blob was decoded on
  mount before the PII warning. Fixed: metadata-only load on mount, blobs loaded for the selected months
  after confirm.
- **W6a's structured evidence was dropped from the artifact.** The HTML rows carried date/type/hours and at
  most one organization name — not the community-service verification fields, work sub-kind, or education
  status W6a added, which is exactly what a caseworker verifies against. The empty manifest vanished rather
  than saying so, and there was no signature line. All fixed via a shared detail projection; honest empty
  manifest; a plain signature-and-date line (ADR-0006's corrected shape — no attestation language).
- **The text report's pre-evaluation fallback.** A no-profile database could still print the raw logged-hours
  sum. The export page now always evaluates.

**Medium/Low fixed, each recorded rather than waved through:** the "No record" line no longer asserts `$0`
(#6); the empty stage lets exclusion-only evidence open the package (#7); `archiveScreening` now cascades
exclusion documents, a real data-loss guard pinned by a test (#8); the federal-floor profile hedges its
state elections on the artifact (#11); `OfflineIndicator`/`StorageWarning` are print-suppressed so a device
banner never lands on a faxed record (#12); the seasonal window is interpolated, not a `6` literal (#13); the
object-URL teardown no longer races an in-flight load (#14); the household hedge names its next action (#15);
all dates are formatted (#16); a discriminated union replaced the `as unknown as Document[]` cast (#17).

**Domain-fidelity's three FR-page corrections** (comments only, no user-facing effect), each re-checked
against `2026-11094.txt`'s `[[FR p.NNNNN]]` markers: the credit-hour conversion is `91 FR 33470` not 33471
(§ 435.552(d)(1)'s formula sits before the 33471 marker); the seasonal average is `91 FR 33471` not 33470
(§ 435.552(g)); documentation hardening re-anchored to the **regulatory** pages `91 FR 33474-33475` rather
than the preamble `33395`, matching the policy module (regulatory beats preamble, `engineering-standards.md`).

**Verification coverage added (#9/#13).** `/export/package` joined `e2e/console-clean.spec.ts`'s route list
(hydration + console — the bug class that shipped once, invisible to Vitest and `next dev`), and a focused
`e2e/evidence-package.spec.ts` covers the PII gate ordering, the cross-table reference collision with real
blobs, both comparisons for a month holding hours and income, print-media control suppression, and per-block
fax self-identification. **74 → 88 e2e specs.**

**Deliberately deferred, recorded rather than silently dropped:**

- **Gap 8.5 is PARTIAL, not closed.** The storage and export plumbing is complete and tested
  (`saveExclusionDocument`, `getDocumentsByExemption`, the cascade, the package's exclusion section), but
  **nothing in the app writes `db.exemptions` and no UI attaches an exclusion document** — both semantic
  models confirmed this by grep. The capture surface belongs to **W4** (the screening rebuild, post-date).
  Closing 8.5 on this diff would repeat W2b's "answerable, not closed" error. The empty-stage fix means that
  once W4 supplies the writer, exclusion-only evidence already opens and prints correctly.
- **The legacy JSON/text exports** keep the W8b-owned ciphertext/documents gaps, left live by the owner's
  decision (recorded above). The `deleteDocument` blob-then-metadata non-atomicity the data-integrity
  reviewer flagged is **pre-existing** (verified against `917bcd1`), low-severity (a dangling metadata row,
  not an unbounded orphan blob), and belongs to a future hardening ticket, not W8a.
- **The `MonthSummary`/`MonthlyIncomeSummary.isCompliant` fields** remain on the nested summaries
  `evaluateMonth` exposes; the export never reads them (verified: 0 `.isCompliant` reads in the export). The
  rename is **W7b**'s, as the non-adjudication reviewer noted.
