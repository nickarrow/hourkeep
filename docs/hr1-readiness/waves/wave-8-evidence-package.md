# Wave 8 — Evidence Package Export

**Depends on:** ~~W7 (single evaluation path)~~ → **W8a** needs **W6a** (the export must carry the corrected
record shapes) and, as of the 2026-09-02 reordering, **W7a** runs before it. **W8b** is post-date.
Corrected 2026-09-02 for the splits.
**Blocks:** ~~W9~~ → **W9a** reuses the package as a notice response.
**Decision record:** ADR-0006

> ### `evaluateMonth` does not exist, and W8a's scope assumes it — 2026-09-02
>
> The scope below says "Call `evaluateMonth` rather than recomputing, so the report can no longer contradict
> the UI", and `waves/README.md` lists **one evaluation path** among W8a's deliverables. **`grep -rn
> "evaluateMonth" src/` returns nothing.** It is W7b's deliverable, and **W7b is post-date** — so W8a as
> written cannot deliver that bullet, and this is the one dependency the W7/W8 split did not resolve when it
> reassigned W8a to W6a.
>
> It is a genuine problem rather than a wording one, because the defect it addresses is real: the export
> recomputes totals independently of the UI, so the two can disagree on the same month.
>
> **Recommended resolution, to confirm when W8a starts.** W8a introduces a single thin entry point — one
> function the export and the UI both call, wrapping today's `calculateMonthlySummary` and
> `getMonthlyIncomeSummary` as they stand. That delivers "one evaluation path" honestly, meaning one call
> site rather than unified combination logic, and leaves W7b free to replace the internals without touching
> either caller. **Do not** let W8a implement ADR-0004's combination and proxy logic — that is W7b's, it
> needs W3 and W4, and half-building it pre-date is how the export ends up asserting a verdict.
**Detail level:** goals and scope. Task breakdown when the wave starts.

## Goal

Make the app actually deliver on its purpose: produce something a person can hand to their State.

## Scope

Replace both existing exports with a review-period-scoped package in three formats.

- **Scope selection.** Pick a review period (from W5) or an arbitrary month range. Everything is scoped to it.
- **Contents** per ADR-0006: cover summary with identity and coverage period; per-month activities with the
  community-service record fields, income evidence, apparent status with citation, and document counts; a
  document manifest; the actual attachments; an attestation block with a signature line; and a legend
  explaining that the State makes the determination.
- **Formats.** Print-ready HTML for mail, in-person, and fax — the primary artifact, using the browser's own
  print pipeline. A ZIP for portal upload, containing the summary plus attachments as real files. JSON for
  backup and future import.
- **Fix the known defects.** Include `documents`, `documentBlobs`, `incomeDocuments`,
  `incomeDocumentBlobs`, `assessmentResults`, and status history — all currently absent from both paths.
  Route profile fields through `getProfile` so `dateOfBirth` and `medicaidId` stop shipping as
  undecryptable ciphertext. Call `evaluateMonth` rather than recomputing, so the report can no longer
  contradict the UI.
- **Exclusion documentation** (gap 8.5, the untouched `exemption-documentation` spec). Allow documents to
  attach to exclusion responses, not just activities and income — a VA letter, a school record, a SNAP
  approval notice.
- **PII warning** before download. The package deliberately contains name, date of birth, and Medicaid ID
  because the agency needs them. Say so first.
- **2028 escalation.** As January 1, 2028 approaches, prompt more insistently for documentation on months
  that have none, since after that date States must require it when reasonably available.
- **No verdicts** (ADR-0003). Logged totals and thresholds, not "COMPLIANT."

## Acceptance criteria

- [ ] A user can export a package for any review period or month range
- [ ] Documents are included as real attachments, with a manifest
- [ ] Exclusion responses can carry documents, and they appear in the package
- [ ] No ciphertext anywhere in any output
- [ ] Print-ready output is legible on Letter and A4 and includes the attestation block
- [ ] ZIP opens with the summary and attachments as separate files
- [ ] Export calls `evaluateMonth`; a test asserts it recomputes nothing
- [ ] No output states a compliance verdict
- [ ] PII warning appears before download
- [ ] Months lacking documentation are flagged, with escalating prominence as 2028 nears

## Risks

| Risk | Mitigation |
|---|---|
| Largest feature in the plan | Ship print-ready HTML first; ZIP and JSON can follow within the wave |
| ZIP needs a dependency | Store-only ZIP is simple enough to hand-roll; evaluate size before adding a package |
| Print stylesheets vary across browsers | Test Chrome, Safari, Firefox; keep layout simple and avoid exotic CSS |
| Large packages exhaust phone memory | Stream where possible; warn above a size threshold; allow narrowing the period |
