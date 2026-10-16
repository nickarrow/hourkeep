# W8a Non-Adjudication Review — Evidence Package Export

**Reviewer role:** Non-adjudication (ADR-0003 / compliance-copy-standards.md).
**Scope:** commit range `917bcd1..HEAD` (4 commits), the W8a print evidence export.
**Governing authority:** `docs/hr1-readiness/decisions/ADR-0003-evidence-not-adjudication.md`, `.kiro/steering/compliance-copy-standards.md`, banned-phrase list `src/__tests__/support/verdictPhrases.ts`.
**Posture:** read-only. No code changed.

---

## Summary answer

**No violation found. The diff does not assert any determination HourKeep is not allowed to make.**

Across all four layers — user-facing strings, type/field names, return values, and behavior — the export surfaces facts (Logged / Threshold / Difference), names the State as the decider using the approved form "your state decides," and never concludes compliance, exclusion, or qualification. The structural safeguard the wave was built around (gap 8.9: a single evaluation path that cannot hoist a verdict) holds. The no-verdict render guard and the package/text-report verdict-scan tests are present and green (114 tests pass across the four relevant files).

I found **zero** banned-phrase hits, **zero** verdict-named fields on the new surfaces, and **zero** behavioral suppressions keyed on apparent exclusion.

---

## Evidence

### Layer (a) — user-facing strings

Checked every new/changed user-facing string in `EvidencePackageView.tsx`, `PiiWarning.tsx`, `app/export/package/page.tsx`, `buildEvidencePackage.ts` (`legend[]` + labels), and `buildTextReport.ts`.

- **Comparison framing is neutral everywhere.** Both the component (`EvidencePackageView.tsx:150-213`) and the text report (`buildTextReport.ts:comparisonLine`, lines ~175-183) render only `Logged` / `Threshold` / `Difference`. `Difference` is clamped at zero (`Math.max(0, threshold - logged)` in `buildEvidencePackage.ts:~230,~240` and `buildTextReport.ts`), so a surplus never reads as a deficit and no "you passed/failed" is implied.
- **The legend names the State as decider** (`buildEvidencePackage.ts:~300-310`): "This is a personal record of what you logged. It is not a determination." / "Your state decides whether the community engagement requirement is met…" / appeal right cited. Uses the approved "your state decides" form (compliance-copy-standards.md) and avoids every banned phrase.
- **Text report preamble** (`buildTextReport.ts:~210-216`): "This is a record of what you logged. It is not a determination. Your state decides…" — same posture, with 42 CFR 435.552/435.556/435.557(a)-(b) cited.
- **Titles were de-verdicted** (documented in the module header, `buildTextReport.ts`): `HOURKEEP COMPLIANCE REPORT → HOURKEEP ACTIVITY RECORD`; `Compliance Mode → Recorded as`; `✓ COMPLIANT / ✗ NOT COMPLIANT → Logged / Threshold / Difference`. The component title is likewise "HourKeep Activity Record" (`EvidencePackageView.tsx:~63`).
- **No pathway ranking.** The month `mode` ("hours"/"income") is derived from where records exist (`buildEvidencePackage.ts:~215`), not presented as easier/recommended. No "easiest," "simpler," "best option" language anywhere in the diff.
- **No "requirement definitely applies" assertion.** The seasonal and income blocks state the household-MAGI caveat ("your state counts your whole tax household here, so its figure may be higher than this one. 42 CFR 435.603(d)-(f)") — the two-sided, non-shortfall framing compliance-copy-standards.md requires.
- **Income is correctly deferred, not totaled as a verdict.** The report shows the user's own logged income against the threshold and explicitly flags that the State's household figure may be higher. It does not compute a household MAGI figure (ADR-0003 Deferred).

Automated confirmation: `buildEvidencePackage.test.ts` serializes the whole package through `findVerdictPhrases` ("no verdict anywhere" describe block) and asserts the legend matches `/your state decides/i`; `buildTextReport.test.ts` and `no-verdict.render.test.tsx` (which now renders `PiiWarning` and `EvidencePackageView`) pass. **114/114 green.**

### Layer (b) — type and field names

- **`evaluateMonth.ts` does NOT hoist a verdict.** `MonthEvaluation` (lines ~55-70) exposes `month`, `hours: MonthlySummary`, `income: MonthlyIncomeSummary`, and `thresholds { hours, income }`. There is **no** top-level `isCompliant`/`complianceStatus`/`meetsThreshold`. Verified by grep: the only occurrences of `isCompliant` in the file are in the doc comment explaining the deliberate non-hoisting (lines 20-24). The verdict-named fields survive only *inside* the two nested legacy summaries (`MonthlySummary.isCompliant`, `MonthlyIncomeSummary.isCompliant`), which W7b renames — a pre-existing condition, not introduced here.
- **The export never reads `.isCompliant`.** Grep for `\.isCompliant` in `src/lib/export/*.ts` → **no matches**. Grep for `isCompliant|complianceStatus` in `src/components/export/*.tsx` → **no matches**. `buildEvidencePackage` reads only `.hours.totalHours`, `.income.totalIncome`, `.income.isSeasonalWorker`, `.income.seasonalAverage`, `.income.seasonalHistory`, and `.thresholds.*` from the evaluation — all facts, never the pass/fail.
- **New package types carry no verdict fields.** `PackageMonth`, `PackageCover`, `ManifestEntry`, `PackageExclusion`, `EvidencePackage` (`buildEvidencePackage.ts:~55-130`) are fact-shaped: `logged/threshold/difference`, counts, references, `lacksDocumentation: boolean` (a documentation-presence fact, not a status verdict), `documentationHardened: boolean` (a date comparison, not a determination about the person).

### Layer (c) — return values collapsing to pass/fail

- No function in the diff returns a boolean/enum that collapses the facts into compliant/non-compliant. `evaluateMonth` returns the fact bundle; `buildEvidencePackage`/`buildTextReport` return data/string of Logged-Threshold-Difference lines. `difference` is neutral arithmetic (ADR-0003 explicitly preserves `hoursNeeded` as such).

### Layer (d) — behavior: suppression and the PII gate

- **Nothing is hidden based on apparent exclusion.** `app/export/package/page.tsx` assembles **all** record months (`monthsFromRecords`) and **all** exclusion screenings (`db.exemptions.toArray()`) regardless of any `result.isExempt` value. There is no branch that removes months, hides the hours/income block, or suppresses tracking because a user "looks excluded." The exclusion section is additive — it includes the screening the user chose to run, framed as "category you asked your state to check" (`EvidencePackageView.tsx:~300`), and still says "Your state decides whether an exclusion applies. 42 CFR 435.554, 435.557(b)(2)." No "way back" is needed because nothing was removed.
- **The exclusion render reads only neutral fields.** It renders `screening.screeningDate` and `result.exemptionCategory` (framed as a user request to the State). It does **not** render `result.isExempt`, `result.explanation`, or `result.nextSteps` — the fields on `ExemptionResult` most likely to carry a determination. Good containment.
- **The PII warning asserts no status.** `PiiWarning.tsx` states a fact about the file's contents (name, DOB, Medicaid ID, document photos) and names the next action ("keep it private, share only through a channel they accept"). It gates on nothing about the user's eligibility; it is a privacy confirmation, not a status gate. It is included in `no-verdict.render.test.tsx`.
- **Gap 8.3 (2028 documentation escalation) does not nudge a harmful self-report.** The flag fires only when a month `hasRecords && documentCount === 0` (`buildEvidencePackage.ts:~225`) — i.e. the user already logged activity/income but attached no document. Its copy (`EvidencePackageView.tsx:~270-278`) says to *add* a document ("Add a photo of a pay stub, letter, or schedule") and cites 42 CFR 435.557(b)(2)(i). It never asks the user to declare non-compliance or to self-report "I'm not meeting it." The pre-hardening variant is correctly Conditional ("Your state **may** require them from {date}"), naming the State election rather than asserting it. This aligns with compliance-copy-standards.md's warning against inviting a casual negative self-report.

### Labels (Computed / Conditional / Deferred) and hedge→action pairing

- **Computed:** hours/income totals, thresholds, `difference`, the seasonal 6-month average — all shown with the number, and citations are present in source comments and on-artifact (42 CFR 435.552(a),(f),(g),(d)). ✓
- **Conditional:** `documentationRequiredFrom` / pre-hardening 8.3 copy correctly names it as a per-State date election. ✓
- **Deferred:** legal status (whether the requirement is met, whether an exclusion applies) is never computed; the package points to the State. Household MAGI is not totaled; the household caveat points to the agency. ✓
- **Every hedge carries a next action:** legend → "appeal it"; household-income note → implicitly directs to the State's figure; 8.3 flag → "add a photo of…"; PII → "keep it private, share through a channel they accept"; submission section → lists the 435.907(a) channels. No dangling hedges found.

---

## Conclusions and recommendations

**Verdict: PASS. No ADR-0003 or compliance-copy violation in the W8a diff.**

The wave achieved its central non-adjudication goal. The single evaluation path (`evaluateMonth`) is the right structural move: by returning facts and never a top-level verdict, it makes a verdict on the caseworker-facing artifact a type-level impossibility rather than a copy-review hope. The export reads only facts from it, the legend and preamble name the State, and the guard tests cover both new components.

Non-blocking observations (not violations; offered for the convergence/fixer step):

1. **Latent risk, out of W8a scope:** `MonthlySummary.isCompliant` and `MonthlyIncomeSummary.isCompliant` still exist inside the nested summaries `MonthEvaluation` exposes. Nothing in the export reads them today, but the field is one careless `.hours.isCompliant` away from leaking onto the artifact. The code comments already flag W7b as the rename owner. Recommend the W7b rename stay on the roadmap and that any future export change be re-scanned. No action needed in W8a.
2. **Consistency nit (not a verdict):** `app/export/page.tsx` still shows a transient `"Export successful!"` toast and labels the legacy text download "Submitting to your caseworker." Neither asserts status; both are fine. No change required.
3. The exclusion block depends on authors never wiring `result.explanation`/`result.nextSteps` into `EvidencePackageView`. Those fields can carry determiner-style copy from the screening engine. Recommend a comment in `EvidencePackageView.tsx` noting that only `exemptionCategory` is safe to render from `result`, to protect the containment on the next edit. Optional.

**Counts I computed:**
- Banned-phrase hits in the five target files: **0**.
- `.isCompliant` reads in `src/lib/export/*.ts`: **0** (grep).
- `isCompliant`/`complianceStatus` references in `src/components/export/*.tsx`: **0** (grep).
- Top-level verdict fields on `MonthEvaluation`: **0**.
- Behavioral suppressions keyed on apparent exclusion: **0**.
- Relevant tests run and passing: **114** (4 files: `no-verdict.render.test.tsx`, `buildEvidencePackage.test.ts`, `buildTextReport.test.ts`, `evaluateMonth.test.ts`).
