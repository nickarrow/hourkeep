# HourKeep — Status Report (validated)

**Date:** 2026-10-15 · **Commit:** `1307625` on `main` (plus `e8e07ab`, a doc-only gap-count fix) · **Live:** hourkeep.app
**Deploy run `38797878099`:** ✅ succeeded (build 2m18s, deploy 22s) — CI metadata, confirmed via `gh`.

> **This is the FINAL validated report** — the single canonical copy (the pre-validation draft was deleted
> as superseded). `.agents/` is gitignored, so this file is durable on disk but not committed to git.
>
> **Validation provenance.** §§1–6 were independently re-checked by **four parallel read-only sub-agents**
> (claims, deployed-state, documentation-drift, known-issues), whose findings are in
> `.agents/reports/validation-{claims,deployed,docdrift,knownissues}.md`. Every finding below was then
> re-verified by the author against the primary source (file, command, or `git`) before entry — a sub-agent
> finding is a lead, not a finding. **Validation changed four of my own numbers and surfaced two headline
> defects I had missed.** Those are folded in and flagged with ⚠️.

---

## 0. What validation changed (read this first)

| Item | Report had said | Verified truth | Status |
|---|---|---|---|
| ⚠️ **Service worker** | "offline-first PWA" (implied working) | **No service worker ships.** `next-pwa@5.6.0` is a Webpack plugin; the build runs on Turbopack, so the SW is never emitted. App is manifest-only, **not offline-capable.** | **New HIGH** |
| ⚠️ **Exclusion screening** | gap 8.5 PARTIAL (no *document* capture) | Broader: the whole **screening write path is dead** — `/exemptions` is a redirect stub, `saveScreening` has zero callers, so Settings' screening panels are a permanent empty-state dead-end. | **New HIGH** |
| **npm audit** | "8 high, 1 critical" | **23 total: 1 critical, 18 high, 4 moderate.** Critical is GHSA-9qr9-h5gf-34mp (RCE, CVSS 10). | Corrected |
| **React Compiler errors** | "~10 across 8 files" | Only ~3–4 inline disables exist; "~10" is not substantiated in-file. | Softened |
| **Gap partial total** | 11 partial | Column sums to **12** (fixed in `gap-analysis.md`, commit `e8e07ab`). | Corrected |

Everything else in §§1–4 was **CONFIRMED** against the code and the shipped `out/` bundle.

---

## 1. Where the overall effort stands

The `docs/hr1-readiness/` program repositions HourKeep from *deciding* a user's Medicaid status to
*assembling evidence* (ADR-0003). It is wave-based, split at the **operative date (~December 1, 2026)**.

**Every pre-date wave has shipped. W8a was the last.** (Verified: none of the post-date waves has any
implementation — no `src/lib/status`, no proxy, no notice/hardship feature, no ZIP/import.)

| Pre-date (shipped) | Post-date (not started) |
|---|---|
| W0-slice, W2a, W0, W5, W2b, W6a, W7a, **W8a** | W3 (status model, Dexie v7), W4 (screening rebuild), W7b (unified compliance + proxy), W9a (notice response), W9b (hardship), W8b (ZIP/JSON/import), W6b (activity remainder), W10 (a11y/privacy), W1 (dependency modernization — sequenced last) |

**Gap analysis: 34 of 108 rows closed, 12 partial** (recomputed; the Total was corrected from 11). The
remaining untouched rows are deliberately post-date and need the status model (W3) and screening rebuild (W4).

---

## 2. What W8a implemented (verified against code + 375px browser)

**Reachable by a user today:**

- **Print-ready evidence package** (`/export/package`, from the Export screen) — period- or range-scoped,
  prints via the browser (PDF/mail/fax/in person), fax-survivable (B&W, no colour-only cues, per-page
  self-ID). (gap 8.1)
- **Documents as real attachments** with a namespaced manifest (`ACT-`/`INC-`/`EXC-`) that cannot collide
  across the two document tables. (gap 8.7)
- **One evaluation path** (`evaluateMonth`) used by both the export and the UI, exposing no verdict field —
  the artifact's totals cannot contradict the screen; the half-time cliff and seasonal average reach the
  record. (gap 8.9; verified: single call site, no hoisted `isCompliant`)
- **No verdicts + reassuring facts** — Logged/Threshold/Difference, "your state decides," ex parte, appeal
  rights, the two-sided documentation rule. (ADR-0003; verified: no live verdict copy in the bundle)
- **PII warning** before download; **2028 documentation-gap flagging**; **decrypted identity** on the print
  surface (no ciphertext). (gaps 8.3, 8.8-print)

**Built and tested but NOT reachable (gap 8.5 — PARTIAL):** exclusion-document storage + export plumbing is
complete and tested, but there is no production writer or capture UI — see the HIGH finding in §5.

**Engineering:** no Dexie change (`git diff db.ts` empty across the wave, still v6 — verified); **778**
Vitest tests, **88** Playwright specs (verified by run); four-reviewer protocol run, 18 semantic findings
all resolved.

---

## 3. What W8a deliberately left out

| Deferred | Owner | Note |
|---|---|---|
| ZIP, JSON rewrite, import | W8b | Print-HTML ships first (ADR-0006) |
| Legacy JSON ships ciphertext + omits documents | W8b | Verified in the shipped bundle; left live by owner decision |
| Exclusion-document capture UI | W4 | Needs the screening rebuild |
| Representative/household submission (8.2) | W9a | — |
| `isCompliant`/`complianceStatus` renames | W7b | Export never reads them (verified) |
| `deleteDocument` blob-then-metadata atomicity | future | Pre-existing, low severity |

---

## 4. Where this leaves the deployed app (hourkeep.app)

Static PWA on GitHub Pages; **push to `main` = deploy**. CI gates on tsc → test → lint → build (verified);
**`test:e2e` is not in the CI gate** — the 88 e2e specs do not block deployment.

**What a user gets:** the factually-correct rebuild is live — MAGI-based *household* income, three-tier
framing, education half-time, seasonal averaging, ex parte/appeal facts; the dangerous pre-rebuild errors
(4× income, "✓ COMPLIANT", "you are exempt") are gone from the running bundle (verified). Users can log
activities/income, scope to a month/period, attach documents, and produce the evidence package.

**Expected post-date gaps (not regressions):** no three-tier status model; no exclusion capture; no unified
compliance / income-to-hours proxy; no notice-response or hardship; the legacy JSON export is weak.

**⚠️ Two deployed-state issues validation surfaced (verified, see §5):** the app ships **no service worker**
(offline-first is currently false), and the **Settings screening sections dead-end** because nothing writes
`db.exemptions`.

---

## 5. Known issues — carried-forward + newly surfaced (all verified)

Severity-ranked. Each line was re-checked against the cited source.

### HIGH

- **No service worker ships — "offline-first" is false in production.** `next-pwa@^5.6.0` is a Webpack
  plugin; the build is `next build` on **Turbopack** (`▲ Next.js 16.0.1 (Turbopack)`), so next-pwa's SW/
  workbox hook never runs. Verified: no `sw.js`/`workbox-*`/`serviceWorker.register` in `out/`, `public/`,
  or source; no SW ever committed. The manifest ships (install prompt may appear) but there is **no runtime
  caching and no offline capability.** *Caveat:* a stale SW from an earlier Webpack build could still be
  registered in some users' browsers — the live site's runtime wasn't checked. **Decision needed:** is
  offline in scope? If yes, next-pwa 5.6 is Turbopack-incompatible — either build with Webpack, or move to
  a Turbopack-compatible SW (Serwist / hand-rolled). If no, downgrade the "offline-first" claim in the docs.
  Add a Lighthouse/e2e SW-registration assertion so it can't silently regress.
- **Exclusion-screening write path is dead; Settings screening UI is a permanent empty-state dead-end.**
  `/exemptions` is a redirect stub to `/how-to-hourkeep` (which persists to `db.assessmentResults`, not
  `db.exemptions`). `saveScreening`/`archiveScreening` have **zero production callers** (verified by grep).
  So Settings' "Exemption Screening"/"Screening History" panels can only ever show empty, their buttons loop
  the user through a spinner, and the export's `exclusionScreenings` is always empty. This is broader than
  the gap-8.5 "no document capture" note — it is a **user-reachable broken flow today.** Likely resolved by
  W4's screening rebuild, but the dead Settings UI is shippable breakage now; at minimum relabel it.

### MEDIUM

- **Income-document orphaned blobs have no reclaim path.** There is no income counterpart to
  `cleanupOrphanedDocuments` (activity-only), and the only invocation is a manual Settings button. A
  mid-cascade failure on an income-document delete leaves an unreclaimable blob (the largest row type). Same
  class as the known `deleteDocument` note, but on a table with no janitor at all.
- **Components reach into Dexie directly, against the storage-layer boundary.** `component-standards.md` and
  `data-migration-standards.md` require all DB access through `src/lib/storage/`. Verified violations in
  `StorageInfo.tsx`, `app/export/package/page.tsx`, `app/export/page.tsx`, `app/tracking/page.tsx`,
  `app/how-to-hourkeep/page.tsx`. Low user impact now; real risk at the **W3 v6→v7 migration**, which must
  find every reader of a changed field.
- **`next@16.0.1` security advisories (corrected numbers).** `npm audit` reports **23 total (1 critical, 18
  high, 4 moderate)** against the installed tree; the critical is **GHSA-9qr9-h5gf-34mp** (RCE in the React
  flight protocol, **CVSS 10**, range `>=16.0.0-canary.0 <16.0.7`). **The static-export mitigation holds
  (verified):** `output: "export"`, no `middleware.ts`, no `"use server"`, no route handlers, no `app/api`
  — the RCE/Server-Actions/DoS vectors are not reachable in the deployed artifact; most "high" entries are
  dev-only transitive (eslint/vitest tooling). Patch path: `next ≥16.0.7` clears the critical. Deferred to
  W1; separable and shippable alone if W1 slips.

### LOW / tracked

- **Service-worker offline path is unautomated** — subsumed by the HIGH finding above (it's absent, not just
  untested).
- **React Compiler suppressions (softened).** The `eslint-plugin-react-hooks: 7.0.1` pin exists, but only
  ~3–4 inline `react-hooks/*` disables are present (`OfflineIndicator`, `app/page.tsx`, `IncomeDashboard`,
  `DocumentViewer`) — **not** the "~10 across 8 files" my earlier draft claimed. Exact latent count is
  unverified (would need a scratch bump to 7.1.x). W1 owns the pin.
- **Local Node floor advisory only** — `engines.node >=22.22.2`, no `.npmrc engine-strict`; CI pins 22.23.2.
- **Stored verdict-typed fields** (`MonthlySummary.isCompliant`, `MonthlyIncomeSummary.isCompliant`) are
  computed and returned today; rename is W7b's. ADR-0003 boundary smell, deferred.
- **No theme touch-target floor** — 44×44 is enforced per-call-site via `sx` rather than a `MuiButton`/
  `MuiIconButton` theme override; a new button that forgets the `sx` falls below the floor. W10 owns a11y.
  (aria-labels, by contrast, are in good shape — spot-checked clean.)

### Positive corroborations (verified, worth recording)

- **No TODO/FIXME/HACK backlog** in production code — the only hits are in test-guard comments.
- **ADR-0001 policy-literal discipline holds** — no bare `80`/`580`/`7.25`/`4.33` in executable non-test
  code outside `src/lib/policy/`.
- **No stale `/hourkeep` base-path refs** in the shipped bundle; manifest basePath is correct for the
  custom domain.

---

## 6. Documentation drift (verified per-file)

Authoritative current status lives in `docs/hr1-readiness/`. Several **living** docs contradict the deployed
app.

| Doc | Verdict | Problem (verified) |
|---|---|---|
| `ROADMAP.md` | **DRIFTED (High)** | "discover the **easiest way**," flat 5-category exemption model, "✓ compliant" indicators, "Job searching does NOT count" — all reversed by ADR-0003/W2a/W6a. Points users at superseded specs as "current." |
| `README.md` | **DRIFTED (High)** | "Understand if you're **exempt**," "recommends the **easiest path**," "If you're exempt you don't need to track" — the app no longer determines exemption or ranks pathways. Also hardcodes `$580`/`80` in prose. |
| `DEPLOYMENT.md` | **DRIFTED (factual error)** | Describes `basePath: "/hourkeep"` and `[username].github.io/hourkeep/` URLs; the app uses the **custom domain `hourkeep.app` with no basePath** (CNAME + next.config confirm). |
| `PWA-TESTING.md` | **DRIFTED (factual error)** | Instructs `npm start` / `next start`; the app is `output: "export"` with **no server to start**. |
| `BRANDING.md` | Partially drifted | Compliance / non-compliance colour semantics predate the no-verdict rework. |
| `.kiro/specs/*` | Mostly FROZEN; some misleading | Most are point-in-time history, but `find-your-path`, `workpath-exemption-screening`, `income-tracking` encode the exact superseded designs, and ROADMAP links them as current. `update-dashboard-guidance/` is an **empty directory**. |
| `.kiro/steering/*` | **CURRENT** ✓ | All steering files reflect the rebuild. |
| `RELEASE_NOTES_v*.md`, `REVIEW_v3.0.0_CHANGES.md` | FROZEN (acceptable) | Historical snapshots; a reader could mistake old copy for current. Consider a one-line "superseded — see docs/hr1-readiness" banner. |

**Version:** `package.json` is `7.2.0` — the last tagged CHANGELOG release. The entire W2a→W8a rebuild sits
under `[Unreleased]` with no release notes past v7.0.0.

---

## 7. Bottom line

**The pre-date corrective program is finished and deployed:** HourKeep tells users the truth about the rule
and produces the evidence package it exists to produce, without asserting a determination. The remaining
*functional* work is deliberately post-date and does not block December.

**But validation surfaced two real deployed-state defects that the "done" framing hid:** the app ships **no
service worker** (so "offline-first" is currently false), and the **Settings exclusion-screening flow is a
dead-end** because nothing writes that table. Both are user-reachable today and worth deciding on before any
new work builds on top of the current base. The non-code debts — living-doc drift (README/ROADMAP/
DEPLOYMENT/PWA-TESTING) and the carried-forward toolchain items — are tracked above with the specifics.

---

## Appendix — validation evidence (on disk, gitignored)

- `.agents/reports/validation-claims.md` — §1–4 code-claim re-derivation
- `.agents/reports/validation-deployed.md` — build-output / shipped-bundle reconciliation
- `.agents/reports/validation-docdrift.md` — per-file documentation audit
- `.agents/reports/validation-knownissues.md` — carried-forward items + new latent findings
