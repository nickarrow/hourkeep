# L7 snap-refresh: what changed since the 2026-10-15 SNAP report

Lane L7, read-only, 2026-10-16. Baseline: `.agents/snap-research/report.md` (2026-10-15), mainly its section 11.

Skills: this session listed skills by name (hhs-benefits, project-docs, review, stack, writing-code). I loaded hhs-benefits
with the skill tool and also read `.kiro/skills/hhs-benefits/SKILL.md` and `AGENTS.md` directly, as the brief asked.

Tier tags: [S] statute; [R] regulation text, including eCFR and Federal Register database searches for rule documents; [G]
agency guidance, agency web pages and agency records (OIRA review data, Regulatory Plan entries, state agency pages); [P]
Federal Register preamble; [C] court filing or docket; [2] secondary. Status: V = read in the named primary source on
2026-10-16; U = not read in a primary source (mirror copy, search snippet, blocked page, or my inference, labelled as such).
IFC.txt means `docs/domain/cms-2454-ifc/2026-11094.txt`, as in the baseline report.

## Summary

1. CONFIRMED. RIN 0584-AF09, FNA's NPRM to codify § 10102, is still unpublished: 0 Federal Register documents carry the RIN,
   and nothing from FNA, CMS or ACF is on public inspection for October 19 [R·V].
2. ADDITION. OIRA concluded its review of that NPRM on August 14, 2026, "Consistent with Change", after receiving it March 17.
   USDA can publish it whenever it chooses (inference); it will be a proposal with a comment period, not final text [G·V].
3. CONFIRMED. FNA has issued no SNAP work-requirement guidance since Q&A #1 of June 11, 2026. Its OBBB page is still dated
   June 11, the 11 SNAP guidance items posted since cover other topics, and the consumer page still shows pre-HR1 rules [G·V].
4. STALE. FNA's waiver pages, last updated October 5, 2026, link an FY2027 Q1 status (in effect October 1). Content matches
   July 1: 0 statewide, the same 12 partial, 41 none, 53 jurisdictions. FY2027 responses are still CA and WI only [G·V].
5. CORRECTION. Rhode Island State Council of Churches v. Rollins (D.R.I.) is closed. The parties stipulated dismissal as moot
   on March 2, 2026; the waiver counts were moot because the affected waivers had expired by March 1 [C·V].
6. OPEN. Nothing from CMS or USDA defines "household" in § 435.554(c)(7): no rule text or correction since June 29, no CMS
   action at OIRA, nothing from FNA. medicaid.gov returned HTTP 403, so CMS decks and FAQs were not read [R·V; G·V; G·U].
7. ADDITION. Colorado's HCPF describes the SNAP exclusion as complying with SNAP work rules (FAQ updated September 21, 2026).
   The federal test is being subject to them in a SNAP-receiving household, with no compliance check [G·V; R·V; P·V].
8. CONFIRMED. No new CMS or ACF guidance on the TANF exclusion, § 435.554(c)(6). The preamble's tension (do not rely on the
   individual's report; ask the individual when TANF data is missing) is unresolved [P·V; G·V].
9. ADDITION. ACF removed and reserved 17 sections of 45 CFR 261, including 261.10-261.16 and 261.30, effective September 29,
   2026, as restatements of statute. § 261.2, which the IFC preamble compares against, is unchanged [R·V; P·V].
10. ADDITION. A second SNAP NPRM, RIN 0584-AF10 on categorical eligibility, has been at OIRA since October 24, 2025. It would
    narrow TANF-based SNAP eligibility; fewer SNAP households would mean fewer (c)(7) exclusions (inference) [G·V; G·U].
11. CONFIRMED. 7 CFR 273 has 0 amendments since July 1, 2025, and § 435.554 has 1 version, effective July 31, 2026. The
    baseline's readings of 273.1(b)(7)(iii), the statute's age wording and the 91 FR 33377 pin cites stand [R·V; S·V; P·V].

## 1. RIN 0584-AF09 (findings 1 and 2)

- Federal Register API, filtered on the RIN: count 0 [R·V
  https://www.federalregister.gov/api/v1/documents.json?conditions[regulation_id_number]=0584-AF09].
- Full-text search for "0584-AF09": 1 document, 2026-16603, the introduction to the 2026 Unified Agenda, August 14, 2026,
  starting at 91 FR 52792. The RIN's entry is at 91 FR 52807-52808, in the USDA part of the 2026 Regulatory Plan [G·V
  https://www.federalregister.gov/documents/full_text/text/2026/08/14/2026-16603.txt]. The baseline cited the first page.
- The entry says the NPRM will change the time-limit exceptions, update waiver criteria, add the Alaska and Hawaii
  good-faith exemptions, and tighten what a state must submit to request a waiver; 7 CFR 273; NPRM date 07/00/26 [G·V]. It
  says nothing about the general work requirements, households, or Medicaid.
- The Plan labels it economically significant and major. OIRA's review record says major yes, economically significant no
  [G·V]. The baseline's "economically significant" matches the Plan; the two federal sources disagree.
- OIRA XML feeds, run date 2026-10-16: 175 actions under review, AF09 not among them. The year-to-date completed list (705
  records) shows AF09 received 2026-03-17, concluded 2026-08-14, decision "Consistent with Change", no publication date [G·V
  https://www.reginfo.gov/public/do/XMLViewFileAction?f=EO_RULE_COMPLETED_YTD.xml].
- FNA and FNS published 38 Federal Register documents from June 1 to October 16, 2026; none carries AF09. The only SNAP
  rulemaking among them is RIN 0584-AF22, administrative cost sharing (NPRM June 24, comment extension August 17) [R·V].
- Public inspection, regular filings updated 2026-10-16 08:45 ET: 144 documents, 143 scheduled for October 19, 0 from FNA,
  CMS or ACF [R·V https://www.federalregister.gov/api/v1/public-inspection-documents/current.json].
- Inference: until a final rule, § 10102 and FNA's memos stay the operative SNAP rules. When the NPRM appears, re-check the 6
  SNAP facts in the baseline's section 8(b), including age: the statute excepts people "under 18, or over 65"
  [S·V `docs/domain/hr1/119hr1enr-title1.md:64`] while FNA says ages 18-64 are subject.

## 2. FNA guidance after June 11, 2026 (finding 3)

- https://www.fna.usda.gov/obbb shows "Page updated: June 11, 2026". Under § 10102 it lists 4 items: the exceptions memo, the
  waivers memo, the QC variance-exclusion Q&As, and Time-Limit Changes Q&As #1 [G·V].
- FNA's SNAP guidance listing
  (https://www.fna.usda.gov/resources?f[0]=resources_langcode:en&f[1]=resource_type:401&f[2]=program:2) has 11 items dated
  after June 11 (counted): 4 retailer notices or memos, 2 QC items, the FY2027 COLA, FY2027 utility allowances, citizenship
  verification under EO 14418, third-party processor fraud, and rescission of a 2024 child-support cooperation memo. 0
  concern work requirements or the time limit [G·V].
- The SNAP E&T listing's newest item is June 29, 2026, planning and budgeting tools [G·V].
- 19 SNAP section 17(b) demonstration notices since June 1 (18 on September 15, 1 on October 2): 0 contain "work
  requirement", "time limit" or "ABAWD" in the Federal Register text (keyword count); 16 mention sweetened drinks, soda or
  candy [G·V].
- The consumer page https://www.fna.usda.gov/snap/work-requirements (updated July 16, 2026) still gives ABAWD ages 18-54 and
  lists a household member under 18, veterans, homelessness and former foster youth as exceptions, under a banner saying
  OBBB guidance is coming. The policy resources page (same date) lists no OBBB item and no FY2027 discretionary exemption
  allocation; the newest is FY2026, December 22, 2025 [G·V].
- Q&A #1 itself, read in a public mirror because usda.gov refused automated download: dated June 11, 2026; question 6 says the
  child under 14 must be in the same SNAP household under 7 CFR 273.1(a); no question concerns Medicaid; CMS appears once,
  as a possible data source for verifying Indian status [G·U
  https://ballotpedia.s3.amazonaws.com/images/d/de/Fns.snap-obbbTimeLimitQAs1.pdf].

## 3. Time-limit waivers after July 1, 2026 (finding 4)

- FY2027 Q1 status, updated to show waivers in effect October 1, 2026: 0 statewide; 12 partial (Alaska, Arizona, California,
  Kentucky, Michigan, Minnesota, Nevada, New Jersey, New Mexico, New York, Oregon, Wisconsin); 41 none; 53 in all (counted)
  [G·V https://www.fna.usda.gov/sites/default/files/resource-files/FY27-Quarter-1-ABAWD-Waiver-Status.pdf].
- A text diff against the FY2026 Q4 file shows 2 changed lines, the quarter title and the as-of date. Colorado is in the
  without-waivers list in both [G·V].
- https://www.fna.usda.gov/snap/abawd/waivers and https://www.fna.usda.gov/snap/waivers/timelimit/2025-2029 both show
  "Page updated: October 05, 2026". FY2027 responses exist only for California and Wisconsin, both dated August 24, 2026 [G·V].
- The 2025-2029 page restates that a time-limit waiver leaves the general SNAP work requirements in place [G·V], which
  supports the baseline's section 4.4 reading that a fit adult in a waived area likely stays subject for (c)(7).
- Direction of the error: the baseline understated how current FNA's data was. The substance it reported is right.

## 4. The Rhode Island case (finding 5)

- CourtListener docket, D.R.I. No. 1:25-cv-00569: filed October 30, 2025, terminated March 3, 2026 [C·V
  https://www.courtlistener.com/docket/71820142/rhode-island-state-council-of-churches-v-rollins/]. The First Circuit appeal,
  No. 25-2089, terminated December 4, 2025 [C·V, CourtListener search API].
- Document 53, a joint stipulation of dismissal filed March 2, 2026, read in the Civil Rights Litigation Clearinghouse copy:
  the benefit-suspension counts became moot once benefits were reinstated in full after appropriations resumed November 12,
  2025; the waiver-termination counts became moot because, as of March 1, 2026, the waivers whose early end harmed the
  plaintiffs had expired on their own terms; each side bears its own fees [C·V
  https://clearinghouse-umich-production.s3.amazonaws.com/media/doc/173860.pdf].
- Direction of the error: the baseline carried a closed case as a live risk. Nothing in HourKeep depends on it now.

## 5. "Household" in § 435.554(c)(7) (finding 6)

- Rule text unchanged: a member of a household that receives SNAP and is not exempt from a SNAP work requirement [R·V
  IFC.txt:4009]. eCFR has 1 version of § 435.554, dated July 31, 2026, and no version of any Subpart F section after that
  date [R·V https://www.ecfr.gov/api/versioner/v1/versions/title-42.json?section=435.554].
- Federal Register: 2 documents affect 42 CFR 435 since June 1, 2026, the IFC and its June 29 correction; a full-text search
  for "435.554" after June 30 finds 0 [R·V].
- OIRA: RIN 0938-AV98 appears only as the IFC review, concluded May 29, 2026; no CMS community engagement action is under
  review [G·V].
- Docket CMS-2026-2047: FederalRegister.gov reports 44,364 comments, from its September 3 check of regulations.gov [G·V]. A
  final rule answering comments is the likely place for an answer (inference).
- USDA: nothing on the FNA OBBB page or the SNAP guidance listing concerns (c)(7) [G·V]. Q&A #1 uses "household" only for
  SNAP's own child exception [G·U, mirror].
- CMS sub-regulatory material: medicaid.gov returned HTTP 403 for the community engagement resource page, the IFC overview
  deck, the MACPro implementation guide, the consumer renew-info pages and all-state call transcripts. Search snippets of
  those pages showed nothing on the household question [G·U].
- The preamble names the data a State should pull from the SNAP agency: "SNAP household eligibility" and exemption status [P·V
  91 FR 33407, IFC.txt:2044]. That points at the SNAP case, but CMS has not said so in terms (inference).
- 7 CFR 273.1(b)(7)(iii) still bars people disqualified for § 273.7 noncompliance from membership in any household [R·V,
  eCFR as of 2026-10-14].
- The AEI comment, now read: it asks CMS to limit (c)(7) to the SNAP assistance unit and estimates up to 1.8 million people
  affected, 16 percent of those otherwise covered, of whom 0.8 million (43 percent) are not already meeting the Medicaid
  requirement in a given month [2·V
  https://cosm.aei.org/comment-on-cms-2454-ifc-clarifying-household-for-the-snap-exclusion-from-the-medicaid-community-engagement-requirement/].
  CBPP's page returned 403 and was not re-read [2·U].

## 6. Colorado's wording on the SNAP and TANF exclusions (finding 7)

- HCPF's FAQ (https://hcpf.colorado.gov/work-requirements-faqs, "Updated September 21, 2026") lists among exclusions people
  who comply with SNAP or Colorado TANF work requirements. One answer says a person subject to and complying with SNAP work
  rules need not meet Medicaid's separately; another says someone not meeting SNAP or TANF rules may still meet Medicaid's
  another way; the county-operations answer says TANF or SNAP compliance satisfies Medicaid [G·V].
- HCPF's work requirements page (https://hcpf.colorado.gov/hr1-medicaid-work-requirements) lists "People who are complying
  with SNAP or TANF work requirements" as a specified exclusion [G·V]. Neither page mentions a SNAP household for it.
- Federal text: § 435.554(c)(7) [R·V IFC.txt:4009]; the preamble reads "not exempt from" as "subject to" and says the State
  need not confirm SNAP compliance [P·V 91 FR 33377, IFC.txt:1216-1218]. For TANF, Colorado's compliance wording matches
  § 435.554(c)(6) [R·V IFC.txt:4008].
- Inference: read literally, Colorado's SNAP wording would not exclude a SNAP-subject person who is behind on SNAP rules, and
  does not reach a person whose household gets SNAP. I read only public pages, not Colorado's rules, system logic or state
  plan. For Colorado-first content, HourKeep can cite the federal rule, present HCPF's wording as the State's, keep both SNAP
  facts (household gets SNAP; the SNAP letter says subject) and name HCPF or the county as the place to ask. The baseline's
  section 10 fix for v1's "in compliance with SNAP" question follows the federal text; Colorado's copy uses v1's framing.

## 7. TANF exclusion (findings 8 and 9)

- Federal Register since June 1, 2026: 13 ACF documents match "TANF"; by title none concerns Medicaid community engagement (I
  opened 2 abstracts). No CMS document after the June 29 correction affects 42 CFR 435 [R·V].
- ACF's State TANF Policy page (updated October 8, 2026) lists 3 DCLs, 2 PIs, 3 IMs and 2 Q&As; none concerns Medicaid
  community engagement [G·V https://acf.gov/ofa/policy-guidance/policy-instructions/state-tanf-policy].
- Preamble positions, rechecked: compliance with State TANF rules under SSA § 407, no uniform definition, work with the TANF
  agency, do not rely on or require reporting from the individual [P·V 91 FR 33377, IFC.txt:1210]; if SNAP or TANF returns
  nothing, the State must seek information from the individual, and from January 1, 2028 require documentation when
  reasonably available [P·V 91 FR 33407-33408, IFC.txt:2046-2050]. The baseline cited both correctly.
- ACF's final rule "Reducing Bureaucracy and Burden for Family Assistance Programs", 91 FR 48268-48289 (July 31, 2026), RIN
  0970-AD38, effective September 29, 2026, removed and reserved 45 CFR 261.1, 261.10-261.16, 261.21, 261.23, 261.30,
  261.33, 261.35, 261.36, 261.54, 261.70 and 261.80: 17 sections, counted from the amendatory text [R·V]. For the 5 I read
  (261.1 and 261.10-261.13), the preamble says each restated statute (for 261.10, 42 U.S.C. 602(a)(1)(A)(ii) and (B)(iv))
  and that removal will not affect TANF operations [P·V
  https://www.federalregister.gov/documents/2026/07/31/2026-15567/reducing-bureaucracy-and-burden-for-family-assistance-programs].
  eCFR shows § 261.2 last amended December 20, 2016 [R·V].
- Effect: TANF copy should cite SSA § 407 and the State's TANF rules. The IFC preamble's comparisons to § 261.2(h) and
  (i)-(l) still hold. In `docs/domain`, 45 CFR 261 appears only inside the IFC files, every time as § 261.2 (grep).

## 8. RIN 0584-AF10 and other pending items (finding 10)

- RIN 0584-AF10, "Reforming Categorical Eligibility", proposed rule, received by OIRA October 24, 2025 and still under review
  on 2026-10-16 [G·V https://www.reginfo.gov/public/do/XMLViewFileAction?f=EO_RULES_UNDER_REVIEW.xml]. The 2026 Regulatory
  Plan says it would amend 7 CFR 273.2(j)(2) so TANF-based categorical eligibility covers only households getting cash TANF
  or other substantial TANF assistance, and labels it economically significant and major [G·V 2026-16603]. OIRA's XML
  record says not economically significant, the same disagreement as for AF09 [G·V].
- Inference: fewer SNAP-receiving households would shrink the (c)(7) group and could change a person's status mid-period,
  which the baseline's per-month recording already handles.
- Massachusetts v. Oz is a Medicaid frailty case outside this lane; not checked.

## 9. Baseline claims rechecked and still right (finding 11)

- 7 CFR 273: eCFR shows 0 versions of any part 273 section since July 1, 2025; § 273.24 latest January 17, 2025; Title 7 is
  current to October 14, 2026, one day past the baseline's October 13 [R·V].
- 7 CFR 273.1(b)(7)(iii) text, as in section 5 [R·V]. The statute's "under 18, or over 65" wording [S·V title1.md:64].
- The 91 FR 33377 pin cites: IFC.txt lines 1210-1218 fall between the 33377 and 33378 page markers at lines 1183 and 1222
  [P·V].
- Discretionary exemptions at 8 percent since FY2024 [G·V FNA policy resources page]. The under-14 child must be in the same
  SNAP household [G·U, mirror].

## 10. Effect on the baseline's recommendation (inference)

- Option (b), Medicaid with SNAP awareness, stands. None of the 6 SNAP facts it relies on changed.
- Its section 11 list should drop the Rhode Island case, mark AF09 as cleared by OIRA and awaiting publication, and add AF10,
  Colorado's wording and the 45 CFR 261 removals.
- The revisit trigger "RIN 0584-AF09 is final" is at least one comment period away, because the NPRM has not published.

## Housekeeping

Repository untouched apart from this file and `scratch-L7/`; no git commands run. I deleted all 53 scratch files in
`scratch-L7/` (downloaded pages and PDFs, extracted text, 2 helper scripts); none is cited, and the empty folder remains.

## Could not verify

- medicaid.gov returned HTTP 403 to both fetch tools: the community engagement resource page, the IFC overview deck, the
  MACPro implementation guide, renew-info consumer pages and all-state call transcripts (including July 28, 2026). Whether
  CMS addressed the household or TANF questions there is unknown.
- usda.gov guidance PDFs returned 403 to automated download. Q&A #1 was read only in a mirror; the February 26, 2026 status
  update and the October 2025 memos were not re-read.
- CBPP's pages returned 403, and the Internet Archive was offline, so no archived copies of blocked pages were available.
- Colorado's state rules, eligibility system logic and state plan amendment: only HCPF's public web pages were read.
- Alaska and Hawaii § 6(o)(7) good-faith exemptions: I found no request or approval, which is not proof there is none.
- reginfo.gov HTML agenda pages did not render; agenda details come from the Federal Register text and OIRA's XML feeds.
- Public inspection was checked once, at the 08:45 ET update; a later October 16 filing would not appear in that check.
- ACF-OFA-IM-26-02 was seen by title only. Whether the October 31, 2025 order covered the waivers: I read the dismissal, not
  the order.
