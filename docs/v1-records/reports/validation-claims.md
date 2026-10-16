# HourKeep W8a Status Report — Claim Validation

**Mode:** READ-ONLY. No code changed, no commits, no server restarts.
**Repo:** `/Users/naretaki/Documents/Code Projects/hourkeep`
**HEAD verified:** `1307625847a0565908b109d74438993662fc9f91` (matches the report's "commit 1307625").
**Base for the wave diff:** `917bcd1` = "W7a closeout: README status, counter, and the review-protocol record".
**Date of validation run.** Vitest and Playwright were executed against HEAD.

---

## Summary answer

The report's §1–§4 factual/code claims are **substantially accurate**. Every structural claim I could
re-derive from the repo checked out: 6 W8a commits, empty `db.ts` diff / still Dexie v6, 778 Vitest tests,
88 Playwright specs, both export surfaces routed through a single `evaluateMonth` that exposes no verdict
field, namespaced `ACT-/INC-/EXC-` references with no live bare `DOC-`, no production writer of
`db.exemptions` (gap 8.5 correctly PARTIAL), the CI gate running tsc+test+lint+build but **not** test:e2e,
and no live dangerous verdict strings in user-facing code.

**One real defect found, and it is exactly the class of bookkeeping error `engineering-standards.md` was
written to catch:** the gap-analysis per-wave table's **Partial** column sums to **12**, not the **11**
printed on its own Total row (and repeated in the report §1). The Closed column is correct at 34. See
Finding 4.

**One claim is UNVERIFIABLE locally:** "Deploy run 38797878099 succeeded" is CI metadata, not derivable
from the working tree; I did not make an authenticated network call to confirm it.

Minor note (not a report error): README.md and ROADMAP.md hardcode the `$580` / `80` policy literals in
prose — stale-doc risk the report already flags in §6, worth calling out explicitly.

---

## Evidence by claim

### Claim 1 — 6 W8a commits since 917bcd1; working tree clean
**CONFIRMED.**
- `git -C … status --porcelain` → empty (clean tree).
- `git rev-list --count 917bcd1..HEAD` → **6**.
- `git log --oneline 917bcd1..HEAD`:
  - `1307625` W8a closeout: convergence record, gap closure lines, README, CHANGELOG
  - `be6a233` W8a: converge on the review protocol's findings
  - `77ea8b9` W8a: print-ready evidence package surface (8.1, 8.7, 8.8-print, PII, 8.3)
  - `bbb94dc` W8a: exclusion documents (8.5) and the evidence-package assembly
  - `82081c6` W8a: one evaluation path, so the export cannot contradict the UI (gap 8.9)
  - `24b036f` W8a: write the wave file by re-verifying wave-8 against the tree

All six are W8a-prefixed. Matches the report.

### Claim 2 — `git diff 917bcd1..HEAD -- src/lib/db.ts` empty; last `version()` is v6
**CONFIRMED.**
- `git diff 917bcd1..HEAD -- src/lib/db.ts` → empty output; `--stat` → empty. No change to the schema file
  across the wave.
- `grep -n "version(" src/lib/db.ts` → calls at lines 39,45,58,73,101,**120**; the highest is
  `this.version(6)` at line 120. `HourKeepDB` is still at Dexie v6. Matches the report ("No Dexie bump").

### Claim 3 — 778 Vitest passing; 88 e2e specs
**CONFIRMED (both).**
- `npm test` → `Test Files 37 passed (37)` / `Tests 778 passed (778)`. Exit 0. Exactly 778.
- `npx playwright test --list` → `Total: 88 tests in 6 files`. The report's "88 e2e specs" is correct.
  (The six files: `browser-capabilities`, `console-clean`, `delete-all-mobile`, `evidence-package`,
  `month-scoping`, `pwa-assets`.)

### Claim 4 — gap-analysis running total 34 closed / 11 partial, and the per-wave table sums to that
**CLOSED count CONFIRMED (34). PARTIAL count is WRONG as an internal sum — the table does not add up to 11.**

Per-wave table in `docs/hr1-readiness/gap-analysis.md` (lines ~144–153):

| Wave | Closed | Partial |
|---|---|---|
| W2a | 10 | 5 |
| W0  | 0  | 0 |
| W5  | 5  | 0 |
| W2b | 1  | 2 |
| W6a | 9  | 1 |
| W7a | 5  | 2 |
| W8a | 4  | 2 |
| **Printed Total** | **34** | **11** |

- Closed: 10+0+5+1+9+5+4 = **34** ✓ (matches printed total and report §1).
- Partial: 5+0+0+2+1+2+2 = **12** ✗ — the printed Total says **11**, and the report §1 repeats "11 partial".

The arithmetic is off by one in the user-unfavorable-irrelevant but accuracy-relevant direction. Either one
of the per-wave Partial cells is overstated by one, or the Total (and the report) understates by one. This
is precisely the "don't state a count you didn't compute" rule from `engineering-standards.md`, and the same
file's own §"Recounted 2026-09-02" block elsewhere flags a different "off by one" on the `partial` count
("27 vs 26 — off by one") — so the document has a known history of partial-count drift. **Recommend
recomputing and reconciling the per-wave Partial column against the annotated rows before the report is
finalized.** Note: 34 of 108 closed is independently consistent; only the partial total is in question.

### Claim 5 — `evaluateMonth` is one call site used by both exports; exposes no top-level verdict
**CONFIRMED.**
- `src/lib/evaluateMonth.ts` exists (5308 bytes).
- Imported and called by **both**:
  - `src/app/export/page.tsx:22` (import), `:123` (call) — the text report.
  - `src/app/export/package/page.tsx:22` (import), `:188` (call) — the package.
- Return type `MonthEvaluation` = `{ month, hours: MonthlySummary, income: MonthlyIncomeSummary, thresholds:
  { hours, income } }`. There is **no** top-level `isCompliant` / `complianceStatus` / `meetsThreshold`.
  The underlying summaries carry `isCompliant` (documented as W7b's rename target), but the wrapper
  deliberately does not hoist it — the file's own header comment states this ("NO VERDICT ESCAPES
  (ADR-0003)… does not hoist either `isCompliant` to its own surface"). Matches the report.

### Claim 6 — references minted as ACT-/INC-/EXC-; no remaining bare DOC- in src/
**CONFIRMED.**
- `src/lib/export/buildEvidencePackage.ts:173` comment and `:52` document the scheme
  `ACT-1`/`INC-1`/`EXC-1`; tests assert `ACT-1`, `INC-1`, `EXC-1` (`__tests__/buildEvidencePackage.test.ts`).
- The only `DOC-` match anywhere in `src/` is a **code comment** at `buildEvidencePackage.ts:50` explaining
  the *old* collision bug (`` `DOC-1` could mean an activity pay-stub or an income pay-stub ``). No live
  bare `DOC-` reference is minted. Matches the report.

### Claim 7 — gap 8.5 correctly PARTIAL: no production writer of db.exemptions
**CONFIRMED.**
- `saveScreening` is defined in `src/lib/storage/exemptions.ts:17` and calls `db.exemptions.add` at `:31`;
  `saveExclusionDocument` is defined in `src/lib/storage/documents.ts:93`.
- Every **caller** of `saveScreening`/`saveExclusionDocument` is a test
  (`storage/__tests__/exclusionDocuments.test.ts`); `db.exemptions.add` is otherwise only called in
  `storage/__tests__/deleteAllData.test.ts`.
- `grep` for these in `src/app` + `src/components` → **no calls**. The two production files that import from
  these storage modules import only **readers**: `src/app/settings/page.tsx:30` imports
  `getLatestScreening`/`getScreeningHistory`; `src/components/ActivityForm.tsx:63` imports only
  activity-document functions (`getDocumentsByActivity`, `getDocumentBlob`, `deleteDocument`) — not the
  exclusion writer.
- Conclusion: storage + export exist and are tested, but **no production code writes `db.exemptions`** and
  there is no capture UI. Gap 8.5 is correctly **PARTIAL, not closed**. Matches the report.

### Claim 8 — CI deploy runs tsc+test+lint+build, NOT test:e2e
**CONFIRMED.**
- `.github/workflows/deploy.yml` steps (grep): `npm ci` (:54), `npx tsc --noEmit` (:64), `npm test` (:67),
  `npm run lint` (:70), `npm run build` (:73). **No** `test:e2e` / `playwright` step anywhere in the file.
  Push to main triggers deploy (build job → deploy job `needs: build`). Node pinned exactly to `22.23.2`.
  Matches the report (and the `engineering-standards.md` note that e2e is "not in the CI deploy gate").

### Claim 9 — no live dangerous verdict strings in user-facing src/ code
**CONFIRMED.**
- `✓ COMPLIANT` / `✗ NOT COMPLIANT`: all matches are in **test** files
  (`__tests__/support/verdictPhrases.ts`, `no-verdict.source.test.ts`) or a **comment** in
  `src/lib/export/buildTextReport.ts:33` documenting the old→new mapping. No live render.
- `you are exempt` / `you're exempt`: all matches are tests, support fixtures, or **comments**. The two
  app-code hits are comments: `src/app/how-to-hourkeep/results/page.tsx:162-165` (`// ADR-0003: "Since
  you're exempt…"` — explaining why the strings were removed) and
  `src/components/assessment/IntroductionScreen.tsx:102` (`{/* ADR-0003: was "Check if you're exempt…" */}`).
  Verified both line ranges are comment blocks, not rendered strings.
- `you automatically meet` / `automatically meet work`: only in test files.
- Conclusion: the running app has no live `✓ COMPLIANT` / `you are exempt` / `you automatically meet`
  user-facing strings. Matches the report.
- *Residual (not a report claim):* the identifier `getExemptMethodMessage` still exists in
  `results/page.tsx` — a function name, not user-facing copy, so outside the no-verdict guard's scope, but
  worth a future rename for hygiene.

### Claim 10 — which post-date waves have started vs none
**CONFIRMED: none of the post-date waves has started implementation.**
- `docs/hr1-readiness/README.md:6` — "W8a … closed 2026-10-15, the last pre-date wave." Pre-date waves
  (W0-slice, W2a, W0, W5, W2b, W6a, W7a, W8a) all carry **Done** rows (lines ~361–368). Post-date waves
  (W3, W4, W7b, W9a/W9b, W8b, W6b, W10) are listed (lines ~374–380) with **no Done marker**.
- No implementation artifacts for post-date features:
  - **W3 three-tier status model:** no `src/lib/status` dir; no `statusResolver`/`resolveStatus`/
    `SpecifiedExcluded`/`MandatoryException` in non-test production source.
  - **W7b income-to-hours proxy / unified compliance:** matches are only comments stating it is NOT built
    (`evaluateMonth.ts:14`, `recommendationEngine.ts:122`).
  - **W9 notice/hardship:** `hardship` matches are W2b **policy-profile election fields**
    (`shortTermHardshipOffered`, `unemploymentHardshipEffectuated` in `policy/types.ts` / `federalDefault.ts`,
    defaulting to `false`) and CFR comments — not a notice/hardship feature.
  - **W8b ZIP/import:** no `JSZip`/`importData`/`parseImport` in production source.
- **W1 position:** README:14 explicitly corrects an earlier "W1 is next" and states ADR-0009 moved **W1 to
  the very end** (after the December date). So the report §1 listing W1 among "post-date not started" is
  accurate; W1 is the last-sequenced wave, not merely unstarted. Matches the report.

---

## §5 / §6 spot-checks (report's own carried-forward issues — confirmed)

These are not in the numbered brief but the report asserts them; I verified the mechanically checkable ones:
- **package.json still 7.2.0** despite HR1 behavior changes — CONFIRMED (`"version": "7.2.0"`). Matches §6.
- **eslint-plugin-react-hooks pinned 7.0.1** (exact, no caret) — CONFIRMED (`package.json:67`). Matches §5.2
  and the exact-pin discipline in `engineering-standards.md`.
- **ROADMAP.md / README.md carry pre-rebuild framing** — CONFIRMED. ROADMAP.md:13/58/87 ("easiest … path"),
  :249/:257/:346 ("✓ compliant", "stay compliant"); README.md:15 ("if you're exempt"), :28 ("easiest
  path"), :32 ("If you're exempt, you don't need to track anything"). Matches §6.
  - **Added observation:** README.md:16 and ROADMAP.md:13 hardcode `80/month` and `$580/month` in prose.
    This is doc text (outside the `src/` no-literal scope) but is a stale-value trap when the FLSA wage
    changes — worth folding into the §6 doc-sweep backlog.

---

## Claims I could NOT verify

- **"Deploy run 38797878099 succeeded."** CI/GitHub Actions metadata; not derivable from the working tree.
  I did not issue an authenticated API call. `gh` is installed locally but confirming the run would require
  a network call outside the read-only-repo scope of this brief. **UNVERIFIABLE from the repo alone.**
- **Live-at-hourkeep.app behavior** — the report's §4 "running app" claims were validated against the
  **source at HEAD**, which is what deploys, not against the live site. The CI gate (Claim 8) makes HEAD and
  the deployed artifact equivalent modulo the deploy run itself.

---

## Conclusions and recommendations

1. **Fix the Partial count (Finding 4) before finalizing.** Recompute the gap-analysis per-wave Partial
   column; it sums to 12 while the Total row and report §1 say 11. Reconcile against the annotated rows and
   correct whichever is wrong. This is the only factual error found, and it is a repeat of a known
   count-drift pattern in this very document — exactly what the verification-discipline rules target.
2. **Mark the deploy-run claim as externally sourced** in the report, or verify it with
   `gh run view 38797878099` if a network check is in scope. Do not present it as repo-derived.
3. **Everything else in §1–§4 is CONFIRMED** against the code and should stand.
4. **Optional hygiene (not blockers):** rename `getExemptMethodMessage`; de-hardcode `$580`/`80` from
   README/ROADMAP prose when the §6 doc sweep happens.

No code was modified. No commits. No server actions.
