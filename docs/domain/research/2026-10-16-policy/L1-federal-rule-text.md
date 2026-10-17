# L1 federal-rule-text: is the corpus copy of CMS-2454-IFC still the operative text?

Lane L1 of the 2026-10-16 policy research task. Read-only against the repository. Sources read on 2026-10-16.

Skills: this session listed five skills by name from its first message (hhs-benefits, project-docs, review, stack,
writing-code), offered through a skill-activation tool. I did not activate any through that tool. As the step prompt
asked, I read `.kiro/skills/hhs-benefits/SKILL.md` and `AGENTS.md` directly from disk; `AGENTS.md` had also arrived
as an injected workspace rule.

Tags: tier is statute, regulation text, agency guidance, FR preamble, court filing or secondary. Verified means I read
it in the primary source on 2026-10-16 at the place named in the evidence.

## Summary

1. CONFIRMED. All 14 sections, 42 CFR 435.550 to 435.563, read in eCFR (current to 2026-10-14) exactly as in the IFC
   as corrected: 12 as printed June 3, 435.557 and 435.558 as corrected June 29. [regulation text; Verified]
2. CONFIRMED. The IFC's 22 amendatory instructions touch 30 sections in parts 431, 435, 438, 457 and 600. None has a
   substantive eCFR version after 2026-07-31. [regulation text; Verified]
3. CONFIRMED. Two FR documents carry RIN 0938-AV98, the IFC and correction C1-2026-11094. Since 2026-06-29, no
   further correction, extension, reopening, delay or final rule; none pending at public inspection or OIRA; no
   final-rule date in the 2026 Unified Agenda. Comments closed 2026-07-31. [FR documents, agenda; Verified]
4. STALE. `cms-2454-ifc/2026-11094.txt` and `.xml` are the June 3 printing. There, four paragraphs of 435.557 sit
   inside 435.558(a)(2), 435.558(a)(2)(i) is garbled, and the "(2)" ending 435.557 is really (g)(2). The corpus holds
   no copy of the corrected text. [regulation text; Verified, txt lines 4278 to 4316]
5. CORRECTION. `rule-extract.md` lines 5 to 7 say the correction relocated "a misplaced § 435.557(c)(2) block" and
   fixed "one merged-word typo". It relocated 435.557(f)(1)(ii)(B) through (g)(1); (c)(2) is identical in both
   printings and nothing else changed. Derived files already use the corrected designations. [regulation text; Verified]
6. STALE. `state-options.md` lines 122 and 124 pin-cite 435.558(a)(2) to 91 FR 33476 and (c)(4) to 33477, the
   superseded printing. The republished text is at 91 FR 39030 and 39031, same words. [regulation text; Verified]
7. ADDITION. `what-matters-most.md` lines 688 to 691 name two broken cross-references in 435.554. eCFR still prints
   both, plus a third: 435.554(c)(5)(ii)(A) also points at "(a)(5)(i)(A) through (E)". [regulation text; Verified]
8. CONFIRMED. The 435.603 text in `supporting-regs` equals eCFR in all 64 paragraphs; eCFR's last version of 435.603
   is dated 2017-01-20. The other 8 sections in the two supporting-regs files also match. [regulation text; Verified]
9. ADDITION. Treasury and IRS proposed rule 91 FR 65494 (2026-10-15) would write SSA 1902(xx)(7)(B) into 26 CFR
   1.36B-2: no premium tax credit while a person is ineligible for Medicaid solely for failing community engagement,
   ending once another reason applies. Proposed only; comments close 2026-11-30. [FR preamble, proposed text; Verified]
10. OPEN. eCFR 435.916(a)(1) still says 12-month renewals and no 6-month rulemaking has appeared. The IFC names SMD
   Letter 26-001 (2026-03-06) as CMS's vehicle; no corpus file cites it. [FR preamble; Verified. Letter; Unverified]
11. STALE. Massachusetts v. Oz: summary judgment hearing set for 2026-10-22 (ECF 143, entered 2026-10-08), not October
   20 as `rule-extract.md` 932, `what-matters-most.md` 233, `state-options.md` 42 say. [court filing metadata; Verified]
12. ADDITION. Taylor v. Kennedy (D. Md. 1:26-cv-03705, 2026-09-18) concerns community engagement; the court denied
   a request to rule before 2027-01-01. No docket I read stays or vacates the IFC. [court filing metadata; Verified]

Known items inside this lane are confirmed in section 9 and not counted above.

## 1. Method

eCFR status from `https://www.ecfr.gov/api/versioner/v1/titles.json`: title 42 up to date as of 2026-10-14, latest
issue 2026-10-13. Version histories from `.../versions/title-42.json?part=N` for parts 431, 435, 438, 457 and 600.
Section text from `.../full/2026-10-14/title-42.xml?part=435&section=435.557` and the same pattern for every section
below; part 435 in full for source notes. The legal text compared against is the FR XML: the corpus
`2026-11094.xml` (June 3 printing) and `https://www.federalregister.gov/documents/full_text/xml/2026/06/29/C1-2026-11094.xml`.

Each section was compared paragraph by paragraph with Python difflib after collapsing whitespace, mapping
typographic quotes and dashes to ASCII and dropping FR page markers and source notes. A paragraph matches only if
identical after that. Planted one-word changes in 435.603 and 435.552 were both caught. The one residual difference,
"section --" against "section--" in 435.557(a), comes from italic markup around a dash in the FR XML. Scripts and
outputs kept in `scratch-L1/`: `compare.py`, `compare_supporting.py`, `compare-out.txt`, `supporting-out.txt`,
`c1.xml`, `ecfr/`.

## 2. Per-section table: IFC as corrected against eCFR 2026-10-14

Tier: regulation text. All rows Verified. "After 7/31" is any eCFR version dated after 2026-07-31. Counts are eCFR
paragraphs.

| Section | IFC instruction | After 7/31 | Result |
|---|---|---|---|
| 431.213 | 2, revise (d) | none | matches |
| 431.231 | 3, add (d) | none | matches |
| 435.3 | 5, add 1902(xx) entry to (a) | none | matches; eCFR lowercases 6 words of the entry title |
| 435.119 | 6, add (d) | none | matches |
| 435.550 | 7, add | none | matches (1) |
| 435.551 | 7, add | none | matches (7) |
| 435.552 | 7, add | none | matches (47) |
| 435.553 | 7, add | none | matches (7) |
| 435.554 | 7, add | none | matches (38), broken cross-references in (c)(3), (c)(5)(ii), (c)(5)(ii)(A) included |
| 435.555 | 7, add | none | matches (41) |
| 435.556 | 7, add | none | matches (11) |
| 435.557 | 7, add; republished at 91 FR 39028 | none | matches the correction (52); differs from the June 3 printing (48), section 3 |
| 435.558 | 7, add; republished at 91 FR 39030 | none | matches the correction (40); differs from the June 3 printing (44), section 3 |
| 435.559 | 7, add | none | matches (3) |
| 435.560 | 7, add | none | matches (18) |
| 435.561 | 7, add | none | matches (42) |
| 435.562 | 7, add | none | matches (15) |
| 435.563 | 7, add | none | matches (2) |
| 435.907 | 8, remove (c)(4), revise (d) | none | matches; (c) ends at (3), (d) verbatim |
| 435.911 | 9, revise (c) intro, add (c)(4) | none | matches |
| 435.912 | 10, revise | none | matches (26) |
| 435.916 | 11, revise | none | matches (26) |
| 435.919 | 12, remove | none | eCFR shows "[Reserved]" with no text |
| 435.945 | 13, phrase in (j) | none | matches; (j) now names 435.557 |
| 435.1200 | 14, phrase out of (e)(1) intro | none | matches; no 435.919 reference left in the section |
| 438.58 | 16, revise | none | matches (2); (b) points at part 435 subpart F, where eCFR files 435.550 to 435.563 |
| 457.340 | 18, (d) heading and (d)(1) | none | matches |
| 457.344 | 19, remove | none | eCFR returns no content; version history marks it removed 2026-07-31 |
| 457.960 | 20, add | none | matches (4) |
| 600.320 | 22, revise (b) | non-substantive edit issued 2026-08-06 | (b) matches verbatim; the edit itself not identified |
| Part 435 authority | 4, continues | n/a | 42 U.S.C. 1302 |
| Part 600 authority | 21, revise | n/a | 42 U.S.C. 300gg, 1395, and 18051 |

The eCFR source notes for 435.557 and 435.558 read [91 FR 33469, June 3, 2026; 91 FR 39028, June 29, 2026]; the other
community engagement sections fall under the group source note 91 FR 33469. The 2026-06-03 eCFR versions of the
amended sections are pending-amendment links (checked for 435.119 as of 2026-06-15), and the 2026-06-29 version
updates that placeholder for the correction. Elsewhere in the five parts, the only later changes are 457.476 (new,
2026-10-13, CMS-2451-F, 91 FR 52406), 600.5 (2026-07-20, NBPP 2027) and 438.72 (2026-02-25). None is an IFC section.

## 3. What the June 29 correction moved

C1-2026-11094 (91 FR 39028 to 39031) reprints 435.557 and 435.558 in full. Its instruction points to page 33476,
where the misprint begins; 435.557 itself starts on 91 FR 33474 (txt line 4159). Printed XML against correction XML:

| Corrected text | Where the June 3 printing put it | Corpus txt line |
|---|---|---|
| 435.557(f)(1)(ii)(A) | in place | 4278 |
| 435.557(g)(2), (g)(2)(i), (ii), hardship verification | in 435.557 straight after (f)(1)(ii)(A), labelled "(2)", so it reads as (f)(2) | 4280 to 4284 |
| 435.558(a)(2)(i) | opening words, then a repeat of the end of (f)(1)(ii)(A) misspelling "vertification" | 4298 |
| 435.557(f)(1)(ii)(B) | inside 435.558(a)(2) | 4300 |
| 435.557(f)(1)(iii), 12-month reverification | inside 435.558(a)(2) | 4302 |
| 435.557(f)(2), privacy laws | inside 435.558(a)(2) | 4304 to 4310 |
| 435.557(g) heading and (g)(1) | inside 435.558(a)(2), with the lost end of (a)(2)(i) glued onto it | 4312 to 4314 |

Everything else is word for word the same in both printings: 435.557(a) to (e), (f)(1) to (f)(1)(ii)(A), and
435.558 apart from (a)(2)(i). The `.xml` copy carries the same splice (lines 3903 and 3917 to 3930).

The derived files cite the moved paragraphs with their corrected meaning (`rule-extract.md` 666, 680, 683, 908;
`state-options.md` 157, 159, 239, 240), and none quotes the garbled 435.558(a)(2)(i): "vertification" and "by showing
that such" occur only in the two raw copies. The exposure sits in those copies, which `rule-extract.md` line 12 names
as the local source. `what-matters-most.md` 478 to 480 repeats the designation-shift claim beside 435.557(a) and (b),
which did not move. `supporting-regs/README.md` 14 to 17 says the printed IFC governs where it and eCFR disagree: for
the four sections it names the two agree, and for 435.557 and 435.558 the printed IFC is the superseded text.

## 4. Federal Register, OIRA, agenda and docket

| Query (2026-10-16) | Result |
|---|---|
| FR API, `conditions[regulation_id_number]=0938-AV98`, all dates | 2: 2026-11094 (91 FR 33348, effective 2026-07-31) and C1-2026-11094 (91 FR 39028); the IFC's corrections field lists only C1 |
| FR full text "CMS-2454" and "0938-AV98" | 3 each: those two plus the 2026 Unified Agenda introduction, 91 FR 52792 (2026-08-14) |
| FR full text "CMS-2026-2047" | 1, the IFC |
| FR full text "community engagement requirement", from 2026-06-01 | 3: the two plus the IRS proposal, 91 FR 65494 |
| FR full text 1902(xx), from 2026-06-01 | 7; the extra three (CMS-2451-F, FY 2027 IPPS final rule, a FERC proposal) do not touch the rule: CMS-2451-F's text lacks the term and IPPS uses "community engagement" for organ donation outreach |
| FR by CFR part, 42 CFR 431, 435, 438, 457, 600, from 2026-05-01 | 431 and 435: only the IFC and correction. Others add a vacatur notice, CMS-2449-P, CMS-2451-F and NBPP 2027, none amending an IFC section |
| FR public inspection, current list (144 documents, for 2026-10-19) | no HHS or CMS document; searches for CMS-2454, 0938-AV98 and "community engagement" return 0 |
| OIRA rules under review, `reginfo.gov/public/do/XMLViewFileAction?f=EO_RULES_UNDER_REVIEW.xml`, RUNDATE 2026-10-16 | 175 actions, 14 from CMS, none 0938-AV98 or about community engagement |
| Unified Agenda entry, `reginfo.gov/public/do/eAgendaViewRule?pubId=202510&RIN=0938-AV98` | Final Rule Stage; the only timetable line is the interim final rule, shown as 07/00/2026 |
| regulations.gov API v4, docket CMS-2026-2047 (public demo key) | 3 documents; comment end 2026-08-01T03:59:59Z, which is 11:59 pm Eastern on 2026-07-31; 43,436 comments posted |

Tiers: FR document metadata, agency regulatory agenda, docket metadata. All Verified at the URLs named.

## 5. supporting-regs against eCFR 2026-10-14

Tier: regulation text. All Verified. Local counts exclude the bracketed source note. eCFR point-in-time history starts
2017-01-01, so a 2017-01-01 date means no change since then.

| Section | Local | eCFR | Result | Last eCFR version |
|---|---|---|---|---|
| 42 CFR 435.603 | 64 | 64 | match | 2017-01-20; source note ends at 81 FR 86456 (Nov. 30, 2016) |
| 42 CFR 435.4 | 104 | 104 | match | 2024-11-01 |
| 42 CFR 435.907 | 27 | 27 | match | 2026-07-31 |
| 42 CFR 435.916 | 26 | 26 | match | 2026-07-31 |
| 42 CFR 435.1010 | 53 | 53 | match | 2017-01-01 |
| 42 CFR 435.119 | 10 | 10 | match | 2026-07-31 |
| 42 CFR 435.110 | 7 | 7 | match | 2017-01-01 |
| 28 CFR 35.108 | 62 | 62 | match | 2016-12-19 |
| 42 CFR 447.51 | 23 | 23 | match | 2017-01-01 |

## 6. Related rulemaking: the premium tax credit proposal

Treasury and IRS, "Premium Tax Credit", FR Doc. 2026-21056, 91 FR 65494 to 65510, published 2026-10-15,
REG-101576-26, RIN 1545-BS15, `https://www.federalregister.gov/documents/2026/10/15/2026-21056/premium-tax-credit`.
Comments by 2026-11-30; a telephonic hearing on 2026-12-08 is cancelled if no outlines arrive by 2026-11-30.

Paraphrase of proposed 26 CFR 1.36B-2(c)(2)(ii)(B) and (C) (91 FR 65506): for taxable years beginning after
2026-12-31, someone an Exchange finds not eligible for Medicaid solely for failing the community engagement
requirement is treated as eligible for minimum essential coverage, so those months are not PTC coverage months. The
treatment stops for any month in which that is no longer the sole reason. Proposed (c)(2)(v)(B) and (C) withhold
the usual protection of an Exchange's Medicaid-ineligibility finding from community-engagement-only cases until
another reason applies, and (vi) disregards findings resting on information given with intentional or reckless
disregard of the facts (preamble 91 FR 65498). The statute is SSA 1902(xx)(7)(B), corpus
`hr1/119hr1enr-title7-part3.md` line 662. The preamble summary on 65498 starts the deemed coverage at the first month
the person would have been enrolled; the proposed text on 65506 uses the later of two dates. Copy should follow the
final regulation text.

The corpus records only that a noncompliance notice must state APTC and PTC consequences (`rule-extract.md` 750,
`what-matters-most.md` 552, from 435.558(c)(1)(v)). Tier: FR preamble and proposed regulation text, not binding.
Verified.

## 7. Renewal frequency

SSA 1902(e)(14)(L), added by HR1 section 71107, requires 6-month redeterminations for expansion adults for renewals
after 2026-12-31 (corpus `hr1/119hr1enr-title7-part3.md` lines 236 to 245; statute, read in the corpus copy only).
eCFR 435.916(a)(1) still says once every 12 months and no more often, matching the IFC, with no later version
(regulation text; Verified). The corrected 435.558(b)(2) itself cites 1902(e)(14)(L) (91 FR 39031).

FR searches of CMS documents since 2025-07-04 for "71107", "1902(e)(14)(L)" and "Eligibility Redeterminations"
return the IFC, the correction, NBPP 2027 (proposed and final), two Privacy Act matching notices and an information
collection notice (91 FR 43643, 2026-07-16). No rulemaking. IFC footnote 107 (91 FR 33416, txt line 2307) cites
CMCS SMD Letter 26-001, 2026-03-06, `https://www.medicaid.gov/federal-policy-guidance/downloads/smd26001.pdf` (FR
preamble; Verified). No corpus Markdown file cites it. `rule-extract.md` 989 to 991 says a separate rulemaking is
presumably pending and `what-matters-most.md` 682 to 686 says to watch for one; none exists as of today, and the
vehicle CMS named is guidance. The URL answered HTTP 403, so the letter's content is Unverified.

## 8. Litigation screen

Source: CourtListener RECAP search API, `https://www.courtlistener.com/api/rest/v4/search/`, docket entry
descriptions and text snippets only. Tier: court filing. Verified as docket metadata; no brief or order read in full.

- Commonwealth of Massachusetts v. Oz, D. Mass. 1:26-cv-12962-RGS, filed 2026-06-29, APA. The complaint's second
  paragraph introduces the IFC by title (snippet). ECF 94 (2026-07-29) denied the preliminary injunction.
  Cross-motions for summary judgment are ECF 103 and 138; ECF 143, entered 2026-10-08, sets the hearing for
  2026-10-22 at 10:00 before Judge Stearns. ECF 140 lists Colorado among the plaintiff States. The corpus already
  tracks this case with an October 20 date.
- Taylor v. Kennedy, Jr., D. Md. 1:26-cv-03705-GLR, filed 2026-09-18, APA. Plaintiffs include individuals with
  National Health Law Program counsel, the American Academy of Pediatrics and its New Hampshire chapter, the New
  Hampshire Medical Society and the City of Columbus. The complaint snippet concerns the Medicaid Act amendment
  requiring community engagement; which agency action it attacks is not confirmed. ECF 28 (2026-10-14) set a
  summary judgment schedule and denied the parties' request for a ruling before 2027-01-01.
- Screened out: Neighborhood House v. HHS (W.D. Wash. 2:26-cv-03006; injunction of 2026-09-30 covers an SHO letter
  as applied to qualified noncitizen SSI recipients in Washington), State of Illinois v. HHS (D. Mass. 1:26-cv-14051)
  and Goe v. HHS (D.N.H. 1:26-cv-00803), both about gender-affirming care for minors in Medicaid and CHIP. Their
  filings mention 1396a(xx) but the snippets show other subjects.

A court order could change what is operative without any FR or eCFR change, so this needs a recheck after 2026-10-22.

## 9. Known items re-checked, not counted

- `what-matters-most.md` line 140 cites 91 FR 33385 for the TANF sentence; it is at txt line 1210, after the 33377
  marker at line 1183. Confirmed (FR preamble; Verified).
- The SNAP test: eCFR 435.554(c)(7) keys on membership of a household receiving SNAP that is not exempt from a SNAP
  work requirement, which confirms the blueprint error on the regulation side (regulation text; Verified). The
  blueprint line itself was not re-read.
- Already-verified text: 435.558(a)(2), (a)(3), (c)(1)(i) to (vii), (c)(4) and 435.557(c)(2) (txt line 4240) equal
  eCFR 2026-10-14 within the full-section match. 431.206 and 431.210 have no eCFR version after 2017-01-20 and 431.220
  none after 2024-04-08, so nothing changed since the 2026-10-01 check (regulation text; Verified).
- The SNAP blueprint "18 or younger" error, the HR1-Impact-Summary omission and the 15 dangling references are
  outside this lane and were not re-checked. One dangling reference sits in a passage cited here, `rule-extract.md`
  line 13.

## Could not verify

- SMD Letter 26-001: medicaid.gov returned HTTP 403 to a scripted request, so its content is unread.
- Court documents beyond docket metadata. CourtListener web pages returned 403 to the fetch tool, and the API limits
  anonymous use to 5 requests a minute; several requests timed out and were retried. What Taylor v. Kennedy
  challenges, and anything entered after the index last updated, are unverified.
- The non-substantive eCFR edit to 600.320 issued 2026-08-06: the point-in-time API serves only the edited text.
- Public inspection is a snapshot of documents scheduled for 2026-10-19; anything filed later today is not covered.
- eCFR is an editorial compilation. I compared it with the FR documents, which are the legal text, and they agree;
  the annual print CFR was not checked.
- The regulations.gov figure counts posted comments, which can differ from comments received.
- Authority citations for parts 431, 438 and 457, which the IFC says continue unchanged, were not compared.
- Whether SSA 1902(xx) or 1902(e)(14)(L) has been amended since enactment: statute, outside this lane.
