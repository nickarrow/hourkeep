# Documentation Drift Audit — HourKeep

**Scope:** Every top-level doc, all 14 `.kiro/specs/*`, and `.kiro/steering/*`, checked against the
authoritative current state in `docs/hr1-readiness/` (ADR-0003 evidence-not-adjudication posture, the
three-tier status model, the MAGI household-income correction) and against the actual code/config.
**Mode:** READ-ONLY. Nothing was changed.
**Date:** 2026-10-15. **Baseline version:** `package.json` 7.2.0.

---

## Summary answer

**Yes — the drift the report under validation flagged is real, and it is worse than two files.** The two
user-facing top-level docs that claim to describe the app *today* — `README.md` and `ROADMAP.md` — both
still describe the **pre-rebuild** product: a verdict machine with a flat **five-category** exemption
model, "the easiest way/path" framing, **earned-income-only** tracking, and "Job searching does NOT
count." Every one of those is a concept ADR-0003 and the gap analysis explicitly removed or corrected.
`BRANDING.md` is partially drifted (its "Success Green … compliance" / "non-compliance" color semantics
and some tone examples predate the no-verdict rule, though its core voice guidance is compatible).
`DEPLOYMENT.md` and `PWA-TESTING.md` contain concrete, checkable **factual** errors about how the app
builds and deploys.

The **specs** are overwhelmingly **FROZEN point-in-time design history** that *drove or predate* the
rebuild — several encode exactly the superseded designs the rebuild replaced. They are acceptable as
history but dangerous if read as current, and nothing in them says so. The **steering files are
current** and correctly state the rebuild's rules; none contradict it.

**Version/release-convention mismatch (confirmed):** `package.json` is `7.2.0`; the CHANGELOG's last
*tagged* release is also `[7.2.0] - 2026-01-14`. Everything from the corrective rebuild (W2a → W8a) sits
under `## [Unreleased]`. No `RELEASE_NOTES_*` file exists past **v7.0.0**, and the version has **not been
bumped** despite eight waves of substantial behavior change. So README/ROADMAP's "Available Today" claims
describe neither 7.2.0's tagged state nor the unreleased rebuild — they describe an even older product.

**"Available today" vs. what is actually done:** ROADMAP § Now claims a finished verdict-giving assessment
with "Four Compliance Paths" and "compliance status." The gap analysis says **34 of 108 gap rows are
closed, 11 partial, 63 untouched**, and that the combination engine, income-to-hours proxy, three-tier
status model, screening rebuild, hardship, and notice workflow are all **post-date / not built**. The two
documents disagree sharply.

---

## Per-file verdict table

| File | Class | Verdict | Drift severity |
|---|---|---|---|
| `README.md` | LIVING | **DRIFTED** | High — describes superseded verdict/5-category/earned-income model |
| `ROADMAP.md` | LIVING | **DRIFTED** | High — "Available Today" overstates; superseded concepts throughout |
| `BRANDING.md` | LIVING | **PARTIALLY DRIFTED** | Medium — compliance/non-compliance color + tone semantics predate no-verdict rule |
| `DEPLOYMENT.md` | LIVING | **DRIFTED (factual)** | Medium — basePath/manifest/`npm start` claims contradict config |
| `PWA-TESTING.md` | LIVING | **DRIFTED (factual)** | Low/Medium — `npm start` on a static export; "Phase 7" artifact |
| `CHANGELOG.md` | MIXED | **CURRENT (head) / FROZEN (tail)** | Low — `[Unreleased]` is up to date through W8a |
| `RELEASE_NOTES_v2–v7.md`, `REVIEW_v3.0.0_CHANGES.md` | FROZEN | **OK as history** | None — dated point-in-time notes |
| `.kiro/specs/find-your-path` | FROZEN spec | **SUPERSEDED** | Drove the superseded "easiest path" verdict model |
| `.kiro/specs/workpath-exemption-screening` | FROZEN spec | **SUPERSEDED** | Flat 5-category "exempt / must track" model |
| `.kiro/specs/exemption-terminology-realignment` | FROZEN spec | **PARTIALLY SUPERSEDED** | 3-tier info-architecture idea survives; "exempt" verdict framing does not |
| `.kiro/specs/exemption-documentation` | FROZEN spec | **SUPERSEDED / PARTIALLY-IMPLEMENTED** | Storage+export plumbing exists (gap 8.5 PARTIAL); capture UI is post-date W4 |
| `.kiro/specs/income-tracking` | FROZEN spec | **SUPERSEDED** | Earned-income-only; explicitly contradicts the MAGI correction |
| `.kiro/specs/activity-definitions-help` | FROZEN spec | **PARTIALLY SUPERSEDED** | "Job searching does NOT count" / earned-income framing corrected by W2a/W6a |
| `.kiro/specs/workpath-medicaid-mvp` | FROZEN spec | **SUPERSEDED (MVP origin)** | Original 80h/$580 earned-income MVP |
| `.kiro/specs/assessment-flow-alignment` | FROZEN spec | **SUPERSEDED** | Pre-rebuild assessment/verdict flow |
| `.kiro/specs/onboarding-redesign` | FROZEN spec | **PARTIALLY-IMPLEMENTED** | Onboarding shipped; assessment posture superseded |
| `.kiro/specs/workpath-enhanced-onboarding` | FROZEN spec | **IMPLEMENTED (history)** | Profile/privacy-notice work shipped (v4) |
| `.kiro/specs/workpath-document-management` | FROZEN spec | **IMPLEMENTED (history)** | Document capture shipped (v2) |
| `.kiro/specs/hourkeep-rebrand` | FROZEN spec | **IMPLEMENTED (history)** | WorkPath→HourKeep rename done |
| `.kiro/specs/analytics-integration` | FROZEN spec | **IMPLEMENTED / ACCURATE** | Plausible is live in `src/app/layout.tsx` |
| `.kiro/specs/update-dashboard-guidance` | — | **EMPTY DIRECTORY** | Stub — no spec files at all |
| `.kiro/steering/*.md` (6 files) | LIVING | **CURRENT** | None — correctly encode the rebuild |

---

## Evidence — LIVING docs with drift

### README.md — DRIFTED (High)

Classifies itself as the live description ("Want to see the current state? Check the main README.md for
what's available now"). Specific contradicted claims:

1. **Verdict framing.** "A step-by-step questionnaire … recommends the **easiest path**" and "Understand
   if **you're exempt**" (Features / Why HourKeep). ADR-0003 bans both; the live code comments confirm
   the removal — e.g. `IntroductionScreen.tsx:102` `// ADR-0003: was "Check if you're exempt…"` and
   `recommendationEngine.ts` no longer frames an "easiest path" to the user.
2. **"If you're exempt, you don't need to track anything."** Asserts exclusion status — a Deferred
   determination the state makes (ADR-0003; gap 1.1/1.3). The live screening models the IFC three-tier
   exclusion set (`questions.ts` cites `§ 435.554(c)(1)` former foster care, American Indians, etc.), not
   a self-asserted "exempt."
3. **Income is earned-only.** "**Income mode**: Track earnings toward the $580 monthly threshold with
   automatic pay period conversion." Gap 5.1/5.2/5.4 and ADR-0003 correct income to **MAGI-based
   household income**, and W7a **demoted** pay-period conversion from a compliance input to a labeled
   personal estimate. This is the single most harmful drift (married-user false negative).
4. **Node floor wrong.** "Requirements: **Node.js 18+**." `package.json` `engines.node` is
   `">=22.22.2"`; CI pins `22.23.2`.
5. **`npm start` for production.** The app is `output: "export"` (static). `next start` does not serve
   the exported `out/` the way the doc implies; deployment is static files to GitHub Pages.
6. **Tagline/claim mismatch with posture.** "track … hours to **maintain your health coverage**" leans
   toward promising an outcome the app no longer claims to deliver.

Accurate parts (not drift): the Project Structure tree matches `src/app/` routes (`onboarding`,
`how-to-hourkeep`, `tracking`, `exemptions`, `export`, `settings` all exist); MUI v7, Next.js 16, Dexie,
next-pwa are correct; the Plausible analytics / privacy section matches live code
(`src/app/layout.tsx:80`).

### ROADMAP.md — DRIFTED (High)

Explicitly a "what's available today" document ("## Now - ✅ Shipped … Available Today").

1. **Verdict machine as shipped.** "guided assessment to help you discover the **easiest way**";
   "✅ **Four Compliance Paths** - Exemption, income tracking, seasonal income tracking, or hour
   tracking"; "Indicates effort level and **compliance status**." All contradict ADR-0003's no-verdict
   rule and the removal of `complianceStatus` from the user surface.
2. **Flat 5-category exemption listed as shipped.** "Integrated Exemption Check - Complete
   **5-category exemption screening**" and the "Exemption Categories Covered" block
   (Age / Family / Health / Program / Other). Gap 1.1 classifies the flat model as `contradicts /
   harmful`; the rebuild replaced it with the three-tier IFC model.
3. **Earned-income claims.** "Income ($580/month) is an **alternative** to hours";
   "$400 bi-weekly → $868/month" pay-period examples presented as a compliance feature; "Aligns with HR1
   legislation requirements." Contradicts the MAGI correction (gaps 5.1–5.5) and W7a's demotion of
   pay-period math. The income-to-hours proxy (hours **and** income combinable, gap 5.11) is unbuilt, so
   "alternative" also misstates the intended model.
4. **"Job searching does NOT count."** Listed verbatim under "Key Clarifications." Gap 4.10 (CLOSED W2a)
   added the subsidiary-under-half-hours and unemployment-insurance nuance; the flat negative is the
   superseded copy. Live help text (`src/content/helpText.ts:238`) now carries the nuanced version.
5. **"HR1 Sourced … cite Section 71119."** The authoritative source is now **CMS-2454-IFC / 42 CFR
   §§ 435.550–435.563**; the steering docs cite the CFR, not the bare statute section.
6. **"Available Today" vs. gap analysis.** ROADMAP presents hardship and notice-response as "Coming Soon"
   but everything in § Now as done. The gap analysis says 34/108 closed and that the combination engine,
   proxy, three-tier model, screening rebuild (W4), hardship (W9), and notice workflow (W9) are
   **post-date and not built**. "Compliance History Dashboard" and "Historical Income & Hours" are under
   "Later" but month-scoping/review-periods already shipped (W5) — so the roadmap also *under*-states
   some real progress while *over*-stating others.

Accurate parts: the "Known Security Debt" section (added 2026-09-03) is current and matches
`docs/hr1-readiness/README.md` (next@16.0.1 advisories, GHSA-9qr9-h5gf-34mp, engines floor). "Not Planned"
list is still valid.

### BRANDING.md — PARTIALLY DRIFTED (Medium)

- **Color semantics assert verdicts:** "Success Green #2e7d32 (achievement, **compliance**)" and
  "Error Red #d32f2f (issues, **non-compliance**)." Binding a color to a compliance verdict is the
  rendering layer of the thing ADR-0003 bans (`compliance-copy-standards.md`: "✓ COMPLIANT" / "✗ NOT
  COMPLIANT" are banned outputs).
- **Tone examples lag:** "Say: 'You need 15 more hours this month'" is fine (neutral arithmetic), but the
  framing that pairs it against "You're not compliant" treats the verdict as the thing to soften rather
  than to not make. The newer rule is "Logged: 46. Threshold: 80. Difference: 34."
- **Compatible / not drift:** the core voice (supportive, plain language, "your data, your control"),
  the "Avoid: Compliance/Required/Eligible" list, the disclaimer, and the privacy statement all align
  with the rebuild. This file is mostly fine; only the verdict-coded color/tone bits are stale.

### DEPLOYMENT.md — DRIFTED (factual, Medium)

The whole document assumes **GitHub Pages subpath hosting**, which the project moved off of:

- "**Base Path:** `/hourkeep` (production only)"; "Access at `https://[username].github.io/hourkeep/`";
  "Builds Next.js with `basePath: "/hourkeep"`." **Contradicted by `next.config.ts:24`:**
  `// No basePath needed with custom domain (hourkeep.app)` — there is no `basePath` set, and
  `public/CNAME` contains `hourkeep.app`.
- "Verify PWA manifest loads: `…/hourkeep/manifest.json`." The `docs/hr1-readiness/` history records
  `/hourkeep/manifest.json` as the **dead 404** that broke installability and was fixed; the live path is
  domain-root under hourkeep.app. This doc still instructs verifying the broken path.
- "Manual Deployment … `npm start`" and `src/app/layout.tsx` "determines basePath" — the build script is
  `next build && node scripts/update-manifest.js`; there is no runtime server.

### PWA-TESTING.md — DRIFTED (factual, Low/Medium)

- Repeatedly instructs "`npm run build` && `npm start`" to test production PWA/service worker. For an
  `output: "export"` app the correct loop is build then serve `out/` statically (the project's own
  `getting-started.md` and `playwright.config.ts` serve the export on a static server, port 4399).
- "Deploy to GitHub Pages (see **Phase 7**)" references a phase artifact that no longer exists in the
  current docs structure.
- Not drift: the service-worker-disabled-in-dev note, HTTPS requirement, and Safari-limited caveat are
  still true.

---

## Evidence — specs (FROZEN history; several SUPERSEDED)

The specs are design history, not live descriptions. None carry a banner saying so, which is the only
real risk — a reader could mistake a SUPERSEDED spec for current intent. ROADMAP actively invites this:
"Check the detailed specs in `.kiro/specs/[feature-name]/`" and "Review the specs in `.kiro/specs/`."

**SUPERSEDED (encode the exact pre-rebuild designs the rebuild removed):**

- `find-your-path` — subtitle "**Guide Users to the Easiest Viable Compliance Method**"; defines
  "Recommendation: the system's suggestion for which compliance method is **easiest**." This is the
  verdict/easiest-path model ADR-0003 replaced.
- `workpath-exemption-screening` — "**five main categories** (age, family/caregiving, health/disability,
  program participation, other)"; "Screening Result: … whether the user is **exempt or must track
  hours**." The flat model (gap 1.1, `contradicts/harmful`).
- `income-tracking` — glossary states "This app currently assumes **only earned income counts** toward
  the $580 threshold" and lists SSDI/unemployment/investment/rental as **not counting**. Directly
  contradicts the MAGI correction (gap 5.2, CLOSED W2a) and `compliance-copy-standards.md` ("'Only earned
  income counts.' → factually wrong").
- `workpath-medicaid-mvp`, `assessment-flow-alignment` — original/earlier assessment and MVP designs on
  the earned-income + verdict basis.

**PARTIALLY SUPERSEDED / PARTIALLY-IMPLEMENTED:**

- `exemption-terminology-realignment` — the **three-tier information architecture** (authoritative
  question / plain help / expandable definition) *survives* and is still cited in
  `medicaid-domain-knowledge.md` § Writing for users. But its "exempt" verdict framing and its citation
  of "HR1 Section 71119 (docs/domain/hr1/…)" as the source predate the IFC/CFR authority. Mixed.
- `exemption-documentation` — storage + export plumbing for exclusion documents is real but **not
  reachable** (gap 8.5 PARTIAL W8a: `saveScreening`/`saveExclusionDocument` have no production callers);
  the capture UI is post-date **W4**. Spec is partially implemented, partially superseded in framing.
- `activity-definitions-help` — much of its content shipped, but its glossary ("Educational Program:
  **half-time or more**", qualifying-income definitions) and "Job searching does NOT count" were
  corrected by W2a/W6a (half-time cliff with zero hours; nuanced job-search rule).
- `onboarding-redesign` — onboarding flow shipped (v4-era); the assessment posture it assumes is
  superseded.

**IMPLEMENTED / ACCURATE (clean history):**

- `workpath-enhanced-onboarding`, `workpath-document-management`, `hourkeep-rebrand` — shipped features,
  accurate as history.
- `analytics-integration` — **matches live code**: Plausible is embedded at `src/app/layout.tsx:80` and
  the privacy copy in `PrivacyNotice.tsx` / `PrivacyPolicy.tsx` reflects it. The README privacy section
  is consistent with this spec.

**ANOMALY:**

- `.kiro/specs/update-dashboard-guidance/` is an **empty directory** (no `requirements.md`/`design.md`/
  `tasks.md`). Either an abandoned stub or an accidental commit. Worth deleting or populating.

---

## Evidence — steering (CURRENT, no drift)

All six `.kiro/steering/*.md` correctly encode the rebuild and were checked for contradictions:

- `medicaid-domain-knowledge.md` — three-tier model, MAGI household income, "community engagement" not
  "work requirements," "Only earned income counts → factually wrong," "You are exempt → HourKeep cannot
  determine this." Current.
- `compliance-copy-standards.md`, `engineering-standards.md`, `getting-started.md`,
  `data-migration-standards.md` — all reference ADR-0003 and the five compliance-critical modules; no
  stale verdict/earned-income language presented as house style (the only matches are the **banned**
  lists). Current.
- `component-standards.md` — UI/theme scope; does not touch domain claims, so no drift (it is the one
  steering file that doesn't mention the rebuild, correctly).

No steering file contradicts the rebuild. **Flag:** none required.

---

## Version & release-convention findings

- `package.json` version **7.2.0** == CHANGELOG last **tagged** release `## [7.2.0] - 2026-01-14`.
- CHANGELOG `## [Unreleased]` is **current through W8a** (print evidence package, W7a income fix) with CFR
  citations — this is the one top-level doc whose head tracks the rebuild.
- **No `RELEASE_NOTES_*.md` exists past v7.0.0** (2025-11-18). The v2.0.0–v7.0.0 notes and
  `REVIEW_v3.0.0_CHANGES.md` are dated, point-in-time, and correctly FROZEN.
- **Mismatch:** eight waves of behavior change (W2a→W8a across 2026) are unreleased and unversioned. The
  deployed app at hourkeep.app therefore reports `7.2.0` while README/ROADMAP describe a product *older*
  than 7.2.0's tagged feature set. There is no release-notes convention being followed for the rebuild.

---

## Conclusions

1. **README.md and ROADMAP.md are the priority.** They are the only two docs that both (a) claim to
   describe the app today and (b) are read by users/forkers, and both describe the superseded
   verdict/5-category/earned-income product. The income drift is actively harmful under the project's own
   standard (married-user false negative).
2. **DEPLOYMENT.md and PWA-TESTING.md are factually wrong** about build/deploy (basePath, manifest path,
   `npm start`). Low user-harm but will mislead any contributor and contradict `next.config.ts`/`CNAME`.
3. **The specs are safe as history but unlabeled**, and ROADMAP points readers straight at them as if
   current. The exposure is the gap between "design we once intended" and "what the rebuild decided."
4. **Steering is the reliable source** and already says all the right things. The CHANGELOG head is the
   one top-level artifact that is current.
5. **Code nuance worth recording (not doc drift, but relevant to any future README rewrite):** the
   verdict-shaped identifiers ADR-0003 slated for removal still exist in code —
   `types/assessment.ts:66` `complianceStatus: "compliant" | …`, `recommendationEngine.ts` still returns
   it, and `isCompliant` persists in the income components (`IncomeStatusIndicator`, `SeasonalWorkerView`,
   `storage/income.ts`). These are the post-date W7b items, so the rebuild is genuinely incomplete at the
   type level; README copy should not claim the no-verdict posture is fully realized in code.

## Recommendations (implement nothing here)

1. **Rewrite README.md § "Why HourKeep", "Features", income mode** to the evidence-assembly posture: "may
   not have to do this," "assemble and organize evidence," household-income is state-decided. Fix Node to
   22.22.2+ and replace `npm start` with the static-serve loop. Keep the accurate structure/stack/privacy
   sections.
2. **Restructure ROADMAP.md § Now** to reflect the gap analysis (34/108), drop the "Four Compliance
   Paths"/"compliance status"/"5-category"/"Job searching does NOT count"/earned-income claims, and move
   month-scoping/review-periods out of "Later" since they shipped (W5).
3. **Fix DEPLOYMENT.md and PWA-TESTING.md factual errors** to match `next.config.ts` (no basePath, custom
   domain hourkeep.app, static `out/` serve). Remove the dead `/hourkeep/manifest.json` instruction and
   the "Phase 7" reference.
4. **Patch BRANDING.md** color semantics ("compliance"/"non-compliance") and the one verdict-framed tone
   example to the neutral-arithmetic form.
5. **Add a one-line SUPERSEDED/HISTORICAL banner** to the superseded specs (or an index note in
   `.kiro/specs/`), and have ROADMAP stop pointing users to specs as current. Delete or populate the empty
   `update-dashboard-guidance/`.
6. **Decide a release convention for the rebuild** — either bump the version and write a release note for
   the W2a→W8a body of work, or state in README that the deployed build is the `[Unreleased]` CHANGELOG
   head, so 7.2.0 stops being read as the current feature set.
7. **When README is rewritten, do not overclaim the no-verdict posture** — note that `complianceStatus`/
   `isCompliant` removal (W7b) is post-date and still pending in code.

---

*Content from external docs was paraphrased or quoted in short fragments for compliance; all claims cite a
file and, where checkable, a line/symbol. Verified against code and config, not against memory.*
