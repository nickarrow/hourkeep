# W8a Domain Fidelity Review — Print Evidence Export

**Reviewer role:** Domain fidelity (CFR section + FR page accuracy against primary source).
**Scope:** `git diff 917bcd1..HEAD` (4 commits: 24b036f, 82081c6, bbb94dc, 77ea8b9).
**Primary sources used:** `docs/domain/cms-2454-ifc/2026-11094.txt` (FR page markers resolved from
`[[FR p.NNNNN]]` in-text, not recalled); `docs/domain/cms-2454-ifc/rule-extract.md`;
`.kiro/steering/compliance-copy-standards.md`.
**Mode:** read-only. No code changed.

---

## Summary answer

The domain substance of the diff is **sound**. Every seven-pathway rule, the credit-hour arithmetic, the
seasonal-average semantics, the documentation-hardening logic, the ex-parte-first framing, and the
no-verdict discipline match primary source. **No policy value is hardcoded outside `src/lib/policy/`** —
claim 7 passes cleanly.

Three defects found, all **FR page-number errors in code comments**, none in user-facing copy and none
affecting behavior:

1. **`buildTextReport.ts:162`** — credit-hour conversion cited as `91 FR 33471`; the formula text
   (§ 435.552(d)(1)) is on **p.33470**. Off by one.
2. **`buildTextReport.ts:307`** — seasonal average cited as `91 FR 33470`; § 435.552(g) is on **p.33471**.
   Off by one, in the opposite direction. The two errors are mirror images of each other.
3. **`evaluateMonth.ts:36,98`** — seasonal average (§ 435.552(g)) cited as `91 FR 33470`; should be
   **p.33471**.

Two further items are **not errors** but worth recording:

- The `(a)-(b)` pairing in the ex-parte citation (claim 6) is **correct** and is exactly what
  `compliance-copy-standards.md` prescribes.
- `buildEvidencePackage.ts:18` cites documentation hardening at `91 FR 33395`, a **preamble** page, while
  the policy module cites the **regulatory** page `91 FR 33474`. Both are defensible; the regulatory page
  is the stronger tier. Flagged under source-tier discipline (engineering-standards.md).

All FR pages below were resolved by locating the nearest preceding `[[FR p.NNNNN]]` marker in
`2026-11094.txt`; marker line numbers are given so the resolution is checkable.

---

## Evidence by claim

### Claim 1 — Seasonal average, § 435.552(g), "average over the 6 months preceding the assessed month, excluding it"

**Section citation: CORRECT. Description: CORRECT. FR page: WRONG in two files.**

Primary source, `2026-11094.txt` line 3905–3909 (regulatory text), under marker `[[FR p.33471]]` (line
3879, which falls inside § 435.552(d)(2); § 435.552(g) header is at line 3905, after the marker):

> "(g) Average monthly income for seasonal workers. (1) An applicable individual demonstrates community
> engagement for a month if the individual is a seasonal worker ... and had an average monthly income over
> the preceding six months ..."

So § 435.552(g) is the correct subsection and it is on **p.33471**.

- `buildTextReport.ts:286` — "42 CFR 435.552(g)'s average over the 6 months PRECEDING the assessed month" —
  description **correct**; it reads `evaluation.income.seasonalAverage` (never recomputes), matching the
  single-evaluation-path design.
- `buildTextReport.ts:313` — user-facing string "`(seasonal workers). 42 CFR 435.552(g)`" — **correct**,
  no FR page shown on screen (correct per copy standards: cite in source, not on screen).
- `buildTextReport.ts:307` — comment "`42 CFR 435.552(g), 91 FR 33470`" — **FR page WRONG**; should be
  **33471**.
- `EvidencePackageView.tsx:161` — user string "`...the month under review (seasonal workers). 42 CFR
  435.552(g).`" — **correct**.
- `evaluateMonth.ts:36` and `:98` — comments cite § 435.552(g) at `91 FR 33470`; **should be 33471**.

The excluded-assessed-month semantics are handled upstream in `getMonthlyIncomeSummary` (not in this diff)
and surfaced here as `seasonalHistory`; the export renders the six prior months and distinguishes a true
`$0` from "No record" — consistent with W7a honesty.

### Claim 2 — Credit-hour conversion, 6 × 3 × 4.33 = 77.94, § 435.552(d)

**Arithmetic: CORRECT. Section citation: CORRECT. FR page: WRONG.**

Primary source, `2026-11094.txt` lines 3867–3875 (under marker `[[FR p.33470]]` at line 3755; the next
marker `[[FR p.33471]]` is at line 3879, *after* this text):

> "(d) Less than half-time enrollment in an educational program. ... (1)(i) Multiply the number of each one
> credit hour of instruction by 3 to get the total of education hours in a week. (ii) Multiply the weekly
> total ... by 4.33 weeks to get total hours in a 1-month period."

Arithmetic verified independently: `6 * 3 * 4.33 = 77.94` (also 1→12.99, 3→38.97). The § 435.552(d)
attribution is **correct**.

- `buildTextReport.ts:162` — comment "`credit-hour conversion (42 CFR 435.552(d), 91 FR 33471)`" — section
  correct; **FR page WRONG**. The (d)(1) formula text sits before the `[[FR p.33471]]` marker, under
  `[[FR p.33470]]`, so it is on **p.33470**.

Note: the conversion is not performed in any diffed file — the `6`/`3`/`4.33` literals live in
`calculations.ts`/policy, not here. `formatHours()` only *renders* the fractional result. Correct layering.

### Claim 3 — Submission channels, § 435.907(a) (online, phone, mail, in person, electronic), claimed 91 FR 33381

**Section citation: CORRECT. Channel list: CORRECT. FR page: defensible but imprecise.**

The IFC does not re-publish § 435.907(a) in regulatory text (amendment 8 at line 4622 only revises (d) and
removes (c)(4)); § 435.907(a) is the pre-existing regulation it references. The channel enumeration appears:

- Regulatory § 435.557(b)(4), line 4220: "must accept information and documentation ... via the modalities
  specified at § 435.907(a)."
- Preamble, line 1783 (under `[[FR p.33396]]` at line 1781): "online, by phone, by mail, in person, or via
  other commonly available electronic means, in accordance with § 435.907(a)."

The specific five-channel enumeration is on **p.33396**. **p.33381** (marker line 1343) carries a different
§ 435.907(a) point — *who* may submit a hardship request (line 1377), not the channel list. So the code's
`91 FR 33381` (`buildEvidencePackage.ts:17`) points to a page that cites § 435.907(a) but not for the
channel enumeration the comment is annotating; the enumeration page is 33396. **Minor — the section is
right; the page is adjacent-but-not-the-enumeration.** Recommend 33396 (or the regulatory anchor
§ 435.557(b)(4), p.33474).

User-facing strings `EvidencePackageView.tsx:122` and the modality list come from
`policy.submissionModalities` (not hardcoded) and cite `42 CFR 435.907(a)` on screen — correct section.
(Aside, outside the diff: the policy default `submissionModalities` adds `"fax"`, which the regulation does
not separately enumerate; it is reasonably "other commonly available electronic means." Not a diff defect.)

### Claim 4 — Documentation hardening: (b)(2)(ii) Jan 1 2028 must-require; (b)(2)(i) may-require/accept through Dec 31 2027; (b)(2)(iii) must-accept-other-info. Claimed 91 FR 33395.

**All three subparagraph designations: CORRECT. FR page: preamble page, defensible; regulatory page stronger.**

Regulatory text, `2026-11094.txt` lines 4206–4216 (§ 435.557 begins p.33474, marker line 4139; `[[FR
p.33475]]` at line 4210 falls between (b)(2)(ii) and (iii)):

- 4206 — "(i) Before January 1, 2028, the agency may require documentation or accept other information ..."
  → **(b)(2)(i)**, p.33474. ✓
- 4208 — "(ii) Beginning on January 1, 2028 ... the agency must require documentation whenever documentation
  is reasonably available." → **(b)(2)(ii)**, p.33474. ✓
- 4214/4216 — "(iii)(A) Accept information other than documentation ... when there is no reasonably available
  documentation; and (B) May not deny or terminate eligibility solely because the individual is unable to
  produce documentation where none exists ..." → **(b)(2)(iii)**, p.33475. ✓

The code (`buildEvidencePackage.ts:18`) cites `91 FR 33395`. **p.33395** (marker line 1761) is the preamble
section "Requesting Additional Information ..." which expressly names and explains § 435.557(b)(2)(i), (ii),
and (iii) with those exact meanings (lines 1765, 1769, 1771, 1773). So 33395 genuinely supports the claim —
it is the preamble characterization. The **regulatory** text is on 33474/33475, and the policy module
(`federalDefault.ts:177`) correctly cites `91 FR 33474` for the same date. Per engineering-standards'
source-tier rule ("the IFC's characterization of § 435.603 is not § 435.603"), the regulatory page is the
stronger citation. **Not an error; a tier inconsistency with the policy module.** Recommend aligning the
export comment to 33474/33475.

User-facing strings are correct: `EvidencePackageView.tsx:253` ("your state now requires ... when they are
reasonably available. ... 42 CFR 435.557(b)(2)") and `:254` ("may require them from
{documentationRequiredFrom} ... 42 CFR 435.557(b)(2)(i)") — the date is interpolated from
`policy.documentationRequiredFrom`, not hardcoded, and the hardening-vs-pre-hardening branch keys off
`documentationHardened`. Correct.

### Claim 5 — Exclusion documents cited as § 435.554 / § 435.557(b)(2)

**CORRECT.**

`EvidencePackageView.tsx:283-284`: "Your state decides whether an exclusion applies. 42 CFR 435.554,
435.557(b)(2)."

- § 435.554 is "Specified excluded individuals" — regulatory header at `2026-11094.txt` line 3929, correct
  section for exclusions.
- § 435.557(b)(2) is the subparagraph governing additional information/documentation when the state cannot
  verify via reliable information (lines 4204–4216), which is the right verification anchor for exclusion
  documents. The copy correctly names the state as decider ("Your state decides"), satisfying ADR-0003 / the
  copy standards. No FR page on screen — correct.

### Claim 6 — Ex-parte-first legend cites § 435.556, § 435.557(a)-(b); appeal rights § 431.220(a)(1)

**The (a)-(b) pairing is CORRECT and is exactly what the steering prescribes.**

`compliance-copy-standards.md:91-92`: "§ 435.557(a) defines the data the state must use and (b) imposes the
obligation to use it before asking. **Cite the pair**; the June 29 correction shifted paragraph designations
inside § 435.557." `rule-extract.md:7` repeats "Cite the pair."

Confirmed against the corrected regulatory text in `2026-11094.txt`:
- **§ 435.557(a)** = "Definitions" / "Reliable information available to the State" (lines 4163–4188) — the
  data sources: payroll (4186), 12-month adjudicated claims (4187), encounter data (4188). This is the data
  definition.
- **§ 435.557(b)** = "Requirement to verify eligibility" (line 4190–4192): "The agency must establish
  processes to use reliable information available to the State ... before requesting additional information
  from the individual." This is the obligation.

So the ex-parte-first duty genuinely spans (a) [the data] + (b) [the duty to use it first], and citing
`435.557(a)-(b)` is right. Appears correctly at `buildTextReport.ts:35, :209` and
`buildEvidencePackage.ts:321`. **No change needed.** (The raw text I read is the post-June-29 corrected
numbering, consistent with `rule-extract.md`'s "As corrected at 91 FR 39028.")

- § 435.556 — "Assessing compliance" header at line 4129, begins **p.33473** (marker line 4051; next marker
  `[[FR p.33474]]` at 4139 is after the header). `buildEvidencePackage.ts:19` cites "435.556 ... 91 FR
  33473" — **correct**.
- § 431.220(a)(1) — appeal rights. Not amended in regulatory text; cited in preamble line 1707 and 1783's
  neighborhood. The appeal-rights preamble discussion citing § 431.220(a)(1) is on **p.33392** (line 1707
  sits after `[[FR p.33392]]` at 1695). `buildEvidencePackage.ts:19` bundles 431.220(a)(1) under
  "91 FR 33473" (the § 435.556 page). The **section** is correct; the page shown is § 435.556's, not
  § 431.220's. Minor; the appeal citation has no page on screen (`:322` user string carries no FR page), so
  this affects only the header comment grouping.

### Claim 7 — Policy literals (80, 580, 7.25, 4.33, 6) hardcoded outside src/lib/policy/?

**PASS. Zero policy literals hardcoded in the diffed non-policy files.**

Computed scan of the four named files for `80`, `580`, `7.25`, `4.33`, `4.25` (excluding FR page numbers and
dates):

- `evaluateMonth.ts` — none. Thresholds come from `policy.requiredHours` (line 103) and
  `incomeThreshold(policy)` (line 104).
- `buildEvidencePackage.ts` — none. Uses `evaluation.thresholds.hours` / `.income` and
  `policy.requiredHours` as fallback.
- `buildTextReport.ts` — the only match is a **comment** at line 47 explaining that `80`/`580` are "passed
  in as `thresholds` rather than hardcoded." The code reads `thresholds.hours` / `thresholds.income`
  (lines 263, 300–302). Correct.
- `EvidencePackageView.tsx` — none. Pure renderer over `pkg` data.

Also confirmed the `3` / `4.33` conversion factors do not appear in any diffed file (the conversion is in
`calculations.ts`, not under review). Policy fields `requiredHours: 80 // policy-literal-ok`,
`documentationRequiredFrom`, and `submissionModalities` are all defined in `src/lib/policy/federalDefault.ts`
(lines 121, 179, 198). Layering is clean.

---

## Conclusions

1. **No domain-substance error.** Every rule the export states — the seven pathways, the credit-hour math,
   the seasonal 6-preceding-month average, the per-state Jan 1 2028 hardening, ex-parte-first, no-verdict —
   matches primary source, and all three contested subparagraph designations of § 435.557(b)(2) are right.
2. **No verdict leaks.** Confirmed Logged/Threshold/Difference framing throughout; "your state decides" and
   appeal rights present; `isCompliant` is never hoisted onto the export surface (per `evaluateMonth.ts`
   docstring and the rendered output).
3. **No hardcoded policy value** outside `src/lib/policy/`.
4. The only hard errors are **three FR page numbers in code comments** (not user copy, not behavior).

## Recommendations (implement nothing; for the fixer)

- **Fix (high-confidence, mechanical):**
  - `buildTextReport.ts:162` — change credit-hour FR page `33471` → **`33470`**.
  - `buildTextReport.ts:307` — change seasonal FR page `33470` → **`33471`**.
  - `evaluateMonth.ts:36` and `:98` — change seasonal § 435.552(g) FR page `33470` → **`33471`**.
    (Lines 34–35/76–78 citing hours & income at `33470` are correct — § 435.552(a) and (f) are on 33470.)
- **Consider (source-tier alignment, optional):**
  - `buildEvidencePackage.ts:18` — documentation hardening: prefer the **regulatory** page
    `91 FR 33474`/`33475` over the preamble page `33395`, to match `federalDefault.ts:177` and the
    engineering-standards source-tier rule. Not wrong as-is, but inconsistent within the codebase.
  - `buildEvidencePackage.ts:17` — submission channels: `33381` points at § 435.907(a) for *who may submit*,
    not the channel enumeration; the enumeration is on `33396` (or anchor to regulatory § 435.557(b)(4),
    p.33474). Low priority.
  - `buildEvidencePackage.ts:19` — § 431.220(a)(1) appeal rights is grouped under § 435.556's page 33473;
    its own preamble page is 33392. Cosmetic (no page renders on screen).
- **No change** to the § 435.557(a)-(b) pairing — it is correct per steering and corrected regulatory text.

All page resolutions above are checkable against `[[FR p.NNNNN]]` markers at the line numbers cited.
