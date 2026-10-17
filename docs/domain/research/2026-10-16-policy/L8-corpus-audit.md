# L8 corpus audit: the analysis files in docs/domain

Lane L8, read-only, 2026-10-16. The session listed skills by name (hhs-benefits, project-docs, review, stack, writing-code). I loaded hhs-benefits through the skill loader and also read `AGENTS.md` and `.kiro/skills/hhs-benefits/SKILL.md` directly, as the brief asked. No other skill was loaded.

Tiers: T1 is statute or regulatory text, T2 is the IFC preamble or other agency text, T3 is secondary (KFF, Code for America, press, trackers). Verified means I read it in the cited source on 2026-10-16; anything not marked Verified is Unverified. IFC line numbers point into `docs/domain/cms-2454-ifc/2026-11094.txt`, the uncorrected June 3, 2026 text, with the 91 FR page. Statute lines point into `docs/domain/hr1/`. Corpus files are cited by name and line.

## Summary

1. CONFIRMED: all four errors found 2026-10-15 reproduce. The Medicaid blueprint summary introduced its "meeting" wording (the CFA PDF says "have to meet (not exempt from)"); the SNAP summary's "18 or younger" is copied from the CFA PDF.
2. CONFIRMED: 15 dangling references (state-options 9, rule-extract 4, supporting-regs/README 1, what-matters-most 1). Every target is absent from the working tree and present on `experiment-1`.
3. CORRECTION: what-matters-most.md:597-598 defines the hardship "dependent" as a minor child. § 435.555(b)(1) has three prongs and adds tax dependents of any age and court-appointed wards (T1, 4029-4037, 91 FR 33472). The narrowing is user-unfavourable; rule-extract.md:467-469 is right.
4. CORRECTION: rule-extract.md:992 says each State must publish its medically frail list. § 435.554(c)(5)(ii) says develop (T1, 3999-4001). state-options.md:306 fixed this on 2026-09-02 and the fix never reached rule-extract.
5. CORRECTION: state-options.md:286 calls the KFF survey one "of all 44". KFF surveyed 43 States, without Tennessee, fielded January to March 2026 (T3, KFF page, Verified). rule-extract.md:919-920 already says 43.
6. CORRECTION: the state-options tracker gives nine States frailty documentation from 2027-01 (it adds Nebraska, :269); state-options.md:116-117, :229 and rule-extract.md:922-923 say eight. Which is right is Unverified.
7. CORRECTION: state-options.md:302-303 lists the Idaho, Indiana, New Hampshire and Arkansas lookbacks as unknown, while rows :271 and :274-276 give values (3, 3, 1, 3). One side is stale.
8. CORRECTION: what-matters-most.md:550-553 labels its notice-content list (i) to (vii) and leaves out the real (vii), the hardship information an electing State must include (T1, 4362, 91 FR 33477).
9. CORRECTION: what-matters-most.md:708 and rule-extract.md:573-577 apply CMS's 56 percent ex parte estimate to everyone. CMS gives it for applicable individuals due for renewal (T2, 2830, 91 FR 33434). Applicants are outside it.
10. CORRECTION: the Medicaid blueprint summary has four statements the IFC contradicts, all present in the September 2025 CFA PDF: GA, TN and WI out of scope (:17); living in a household with a child 13 or younger (:52, :104); any disabled veteran (:58); online submission optional (:214).
11. CORRECTION: HR1-Impact-Summary.md lists six pathways and drops the 80-hour combination (:384-391; T1 title7-part3.md:584); dates the Marketplace alien rule both 2027-01-01 (:651) and 2026-01-01 (:698), where the statute says taxable years after 2026 (title7-part3.md:1030); puts the SNAP delayed-match trigger at a 30 percent error rate (:105), where the statute says error rate times 1.5 at or above 20 percent, about 13.3 (title1.md:187-189); calls a State share moving from 50 to 75 percent "doubling" (:130).
12. CORRECTION, minor: what-matters-most.md:25 anchors the regulatory text at 91 FR 33465, which is the impact analysis (the text starts at 33469); rule-extract.md:585 splices the end of a blockquote into a sentence about verification plans; supporting-regs/README.md:15-16 says "through October 1, 2034", where the IFC says until that date (358) and the statute's moratorium ends September 30, 2034 (title7-part3.md:21).
13. STALE: the newest stated verification is 60 days old (rule-extract 2026-08-16, what-matters-most 2026-08-17, eCFR snapshot 2026-08-13). what-matters-most was committed 2026-08-28, 11 days after its "last verified" date. state-options.md has no verification date. HR1-Impact-Summary.md has none at all (last commit 2025-11-02).
14. STALE: both CFA blueprint summaries are dated September 10, 2025: 401 days old and 266 days older than the IFC. Their open questions on income, proof of volunteering, collateral contacts and MCO data are answered by the IFC.
15. STALE: the per-State tracker rests on a pre-IFC survey. Its Oklahoma row (no disaster event) and New York row (no medical-travel event) describe plans the IFC rules out (T2, 1319, 91 FR 33380). No row has a retrieval date, though the schema requires `retrievedAt` (:34).
16. STALE: time-bound items: Massachusetts v. Oz summary judgment hearing 2026-10-20 (4 days away), Iowa start 2026-12-01, Pathways expiry 2026-12-31. The outreach windows (July to September 2026) have passed. rule-extract.md:966-967 still says Iowa, Montana and Nebraska intend to start early, against :782, which says three went live.
17. STALE: Emmy's status was last checked 2026-08-16 (rule-extract.md:945). The reports that it may be discontinued (:949) and the Emmy API joining the Hub in July 2026 (:942-943) carry no source.
18. ADDITION: the June 29 correction (91 FR 39028) is cited by both extracts and not stored. In the stored text the § 435.557 privacy and mandatory-exception paragraphs print after the § 435.558 heading (4304, 4314), so designations such as § 435.557(f)(1)(ii)(B), (f)(1)(iii), (f)(2) and (g)(1) cannot be checked locally.
19. ADDITION: three omissions listed by the v1 validation (`experiment-1`, its § G3) are still missing from rule-extract and what-matters-most: automatic hardship applies with no request for information and no assessment of impact (T1 4284; T2 1548); community service hours must be verified in an auditable manner (T2, 1869); noncompliance notices must meet § 435.905(b) and, if electronic, § 435.918(b) (T1, 4364-4366). Of the other 17 G3 rows, 16 are stated and one (G3.15) holds only because the extract names no USDA condition.
20. ADDITION: supporting-regs/README.md § 4 adds five State options from § 435.603. The state-options schema carries only the predictable-changes one, and lacks § 435.603(b), (d)(3), (f)(3)(iv) and (h)(2).
21. OPEN: claims that rest only on secondary sources include the composition of the 44 jurisdictions, early-implementer dates, the eight-State documentation list, KFF's 60 to 80 percent match estimate and data-source counts (uncited in the corpus), the 79,718 comment count, 12-month postpartum prevalence, Georgia's list structure and Missouri's fax channel. Table C.
22. OPEN: the SNAP age bound. The statute says "over 65" (title1.md:64); the CFA PDF and summary say 65 or older. Whether a 65-year-old is excepted needs FNS's reading.
23. OPEN: the federal default profile uses the six-month preceding average for seasonal income, though CMS says most States elect the predictable-changes method (T2, 696), and CMS's own seasonal worker comes out at $750 one way and $500 the other (694, 702).

Recommendation, section E: keep the IFC, its correction, the eCFR and statute texts as sources; rebuild rule-extract as the single authoritative extract; fold what-matters-most into it and into a HourKeep domain skill; move per-State facts to a dated data file; retire HR1-Impact-Summary; move both CFA summaries to prior art.

## A. Dated statements and how stale they are

Ages are computed against 2026-10-16.

| Where | Statement | Date | Age | Status |
|---|---|---|---|---|
| rule-extract.md:13 | Validated, pointing to `../../audit/validation-findings-2026-08.md` | 2026-08-16 | 61 days | Evidence file exists only on `experiment-1` |
| what-matters-most.md:9 | Last verified against the IFC text and eCFR extract | 2026-08-17 | 60 days | First committed 2026-08-28 (git log) |
| supporting-regs/README.md:3 | eCFR retrieved; snapshot date | 2026-08-16 / 2026-08-13 | 61 / 64 days | Not re-pulled |
| state-options.md, whole file | No verification date. Corrections dated 2026-09-02 at :61, :104, :134, :170, :186, :248, :306 | 2026-09-02 | 44 days | Tracker rows carry no `retrievedAt` |
| state-options.md:263 | KFF survey fielded January to March 2026 | 2026-01 to 03 | 7 to 9 months | Predates the IFC (2026-06-03) |
| Medicaid CFA summary :3, :375; SNAP CFA summary :3, :450 | Last updated, "as of" | 2025-09-10 | 401 days | 266 days before the IFC |
| HR1-Impact-Summary.md | Undated | last commit 2025-11-02 | 348 days | Pre-IFC; lists the RHTP deadline of 2025-12-31 as upcoming (:669, :692) |
| rule-extract.md:8 | IFC effective, already in force | 2026-07-31 | current | Verified T1 2026-11094.txt:25-26 |
| rule-extract.md:781-782; what-matters-most.md:98-99 | Nebraska live 2026-05-01; Montana, Arkansas 2026-07-01; Iowa 2026-12-01 | T3, no retrieval date | 46 days to Iowa | Not re-checked |
| rule-extract.md:966-967 | Iowa, Montana, Nebraska intend to go early; Arkansas plans a July soft launch | KFF, Jan to Mar 2026 | 7+ months | Tense contradicts :782 |
| rule-extract.md:929-933; what-matters-most.md:231-234; state-options.md:42 | Massachusetts v. Oz filed 2026-06-29; PI denied July 29-30 (what-matters-most says July 2026); SJ hearing 2026-10-20 | 2026-10-20 | 4 days ahead | Stale after the hearing |
| rule-extract.md:937; state-options.md:273 | Georgia Pathways expires | 2026-12-31 | 76 days ahead | Time-bound |
| rule-extract.md:945-949 | Emmy checked directly; v0.2.0 on 2026-08-12; emmy-api last pushed 2026-08-03 | 2026-08-16 | 61 to 74 days | Not re-checked |
| rule-extract.md:942-943 | Emmy API folded into the Hub | July 2026 | 3 months | No source |
| rule-extract.md:952-956; what-matters-most.md:55 | Outreach notices July to September 2026 | past | n/a | Historical now |
| rule-extract.md:964 | About 20 million expansion enrollees | June 2025 | 16 months | Verified T3 (KFF page) |
| rule-extract.md:979 | CfA guide dated July 2026 | 2026-07 | 3 months | Title confirmed by web search (T3); my URL-path doubt withdrawn |
| rule-extract.md:987 | 79,718 comments filed | undated | n/a | Unverified |
| rule-extract.md:996; state-options.md:309 | SPA template under development | as of IFC, 2026-06-03 | 135 days | Not re-checked |
| rule-extract.md:994-995 | Clearinghouse and VA connections forthcoming | as of 2026-08 | about 2 months | Not re-checked |
| state-options.md:235 | No reconciling rulemaking has issued | undated | n/a | Not re-checked |

## B. Contradictions

Each entry gives both sides in short, then the source that settles it where one exists.

B1. Frailty list. rule-extract.md:992: each State must publish an auditable list. state-options.md:306: the rule does not require publication (corrected 2026-09-02). § 435.554(c)(5)(ii) requires the State to develop a list that is auditable and justifiable, with a request path for unlisted conditions (T1, 3999-4001, Verified). I found no publication duty in the frailty preamble (1036-1190). rule-extract is wrong.

B2. Hardship dependent. what-matters-most.md:597-598: a minor child for this section. rule-extract.md:467-469: minor child living with the person, tax dependent, or court-appointed ward. § 435.555(b)(1)(i)-(iii) has the three prongs (T1, 4029-4037, Verified). what-matters-most is wrong, and the error hides the travel exception from someone whose adult tax dependent travels for care.

B3. Notice content. what-matters-most.md:550-553 lists seven items with no hardship item. rule-extract.md:752 adds hardship information if the State elected it. § 435.558(c)(1)(vii) is that item (T1, 4362, Verified).

B4. KFF denominator. state-options.md:286: the survey covered all 44. rule-extract.md:919-920: KFF said 43 and omitted Tennessee. The KFF brief says 43 States, built from expansion States plus Georgia and Wisconsin (T3, fetched 2026-10-16, Verified). state-options is wrong. Its other aggregates (36 and 34 one-month lookbacks, 34 six-month renewals, 29 with a hardship plan, all but three taking all four) match the KFF text.

B5. Eight or nine documentation States. state-options.md:116-117 and :229 and rule-extract.md:922-923 name eight: AR, ID, IN, IA, NC, ND, OH, UT. The tracker (:268-284) has nine rows with 2027-01 (I counted), the ninth being Nebraska at :269, sourced "KFF, state press". The KFF brief text does not name these States. Unverified either way.

B6. Lookbacks known or unknown. state-options.md:302-303 says the four lookbacks were reported only as "more than one". Rows give Idaho 3 (:274), Indiana 3 (:275), New Hampshire 1 (:276) and Arkansas renewal 3 (:271), sourced to legislation without links. rule-extract.md:954 builds on them (only Idaho and Indiana on the July outreach schedule). KFF's text gives no values. Unverified.

B7. Hardship subsets. what-matters-most.md:575 says an electing State must offer all four events, no subsets; rule-extract.md:889 says all four or none. rule-extract.md:453-458 and what-matters-most.md:601-602 say the unemployment event is a second, optional election. The IFC supports the second reading: no circumstance may be the exclusive basis (T2, 1319, 91 FR 33380) and the unemployment event is optional for electing States (T2, 1542, 91 FR 33386). Both files should say the other three come together and unemployment needs a State request and CMS approval. Against that rule, state-options.md:282 (Oklahoma without the disaster event) and :283 (New York without medical travel) record pre-IFC plans the IFC does not allow.

B8. Scope. Medicaid CFA summary :15 and :17: only expansion adults, and the requirement is irrelevant in ten non-expansion States including Georgia, Tennessee and Wisconsin. rule-extract.md:70-77 and state-options.md:290-291: those three are in scope through § 1115. The IFC counts 43 States and DC as of May 2026 (T2, 2730, Verified) and reaches § 1115 enrollees (§ 435.551(b), T1 3773 ff.). The composition of the 44 is T3 and Unverified.

B9. Caregiver test. Medicaid CFA summary :52 and :104: living in a household with a child 13 or younger. rule-extract.md:346-347 and what-matters-most.md:137: parent, guardian, caretaker relative or family caregiver of a dependent child 13 or under. § 435.554(c)(3) requires one of those four roles (T1, 3971, Verified). The CFA PDF carries the same household wording, so the error is CFA's. For SNAP the statute's test is a household member with responsibility for a child under 14 (title1.md:68), which may be what CFA carried over.

B10. Veterans. Medicaid CFA summary :58: disabled veteran. rule-extract.md:374-384: a temporary or permanent rating of 100 percent, TDIU included. § 435.554(c)(4) requires the total rating (T1, 3983); TDIU is preamble (T2, 1002, 91 FR 33372). Verified.

B11. Submission channels. Medicaid CFA summary :214: States must take paper and may optionally take online or fax. rule-extract.md:615-617: all § 435.907(a) channels. § 435.557(b)(4) requires acceptance through the § 435.907(a) modalities (T1, 4220), which list internet, telephone, mail, in person and other commonly available electronic means (eCFR extract, `42cfr-supporting-sections.txt`:363-371). Verified.

B12. Pathways. HR1-Impact-Summary.md:384-391 lists six. rule-extract.md § 2.1 and what-matters-most.md:240-250 list seven. § 1902(xx)(2)(E), the 80-hour combination, is in the statute (T1, title7-part3.md:584, Verified).

B13. Income wording. Medicaid CFA summary :26 says more than $580; :37 says at least. § 435.552(a)(6) says not less than (T1, 3805). The CFA PDF has both phrasings. The summary's :142 also treats income as an exemption, where the IFC makes it a way of demonstrating engagement.

B14. Marketplace alien rule. HR1-Impact-Summary.md:651 gives 2027-01-01 and :698 gives 2026-01-01. Section 71301 applies to taxable years beginning after December 31, 2026 (T1, title7-part3.md:1030, Verified); :698 is wrong.

B15. Parameter count. supporting-regs/README.md:216 brings the tracked State options to 29; state-options.md:13 still says at least sixteen, and its schema lacks four of the README's five additions (finding 20).

B16. Corpus against source, 56 percent. CMS states the share for individuals due for renewal (T2, 2830-2832); what-matters-most.md:708-709 turns it into "most people will not be asked for anything". The 2-hour figure in both extracts is per response; CMS assumes 2 responses a year (T2, 2840).

## C. Claims resting only on a secondary source, or on none

| Where | Claim | Source named | My check |
|---|---|---|---|
| rule-extract.md:70-77; state-options.md:290-293 | Which seven States are out and which five expansion States hold § 1115 populations | A June 2026 CMS list, not linked or stored | Unverified; the count of 44 is Verified T2 (2730, 2868) |
| rule-extract.md:781-782 | Early-implementer dates, placed inside the § 435.559 paraphrase with no tier label | None at the line; what-matters-most.md:100 labels them State tracking | Unverified |
| rule-extract.md:922-925; state-options.md:116-117 | Eight States require frailty documentation from 2027 | Legislation, Politico, KFF (state-options rows) | Not in the KFF brief text; Unverified |
| rule-extract.md:959-962; what-matters-most.md:496-497 | Data-source counts (31, 25, 25, 23) and the 60 to 80 percent match estimate | None inline | Verified T3 in the KFF brief; needs a citation |
| rule-extract.md:987 | 79,718 comments | None | Unverified. An undated federalregister.gov search snippet shows 44,364 posted comments; neither figure checked |
| what-matters-most.md:144, :667 | Most States run 12-month postpartum coverage | None | Unverified |
| state-options.md:161, :241 | Georgia's frailty list is two-tier | None in the tree | Unverified |
| rule-extract.md:957; state-options.md:236 | Missouri accepts fax; fax appears in the federal default's channel list under § 435.907(a) | MO DSS FAQ, not linked | Unverified; § 435.907(a) itself does not name fax |
| rule-extract.md:935-937 | Georgia projects about 100,000 enrollees against about 20,000 | GA DCH, not linked | Unverified |
| rule-extract.md:942-943, :949 | Emmy API joined the Hub; Emmy may be discontinued | None | Unverified |
| Medicaid CFA summary :138 | Urban Institute: 52 percent could be deemed exempt or compliant from data alone | Named, not linked | Unverified |
| SNAP CFA summary :232-233 | Three States run only mandatory E&T; six run a mix | None | Unverified, dated 2025 |
| state-options.md:235 | No reconciling rulemaking has issued | None, undated | Unverified |
| HR1-Impact-Summary.md, whole file | Tertiary summary written partly for vendor positioning (:7) | None | Statute checks in B12, B14 and finding 11 |

Claims that rest on the preamble but read as rule text are a separate tier problem. rule-extract.md:400-401 (self-identification after a relapse) is preamble (T2, 1094, 91 FR 33374), which resolves the flag at what-matters-most.md:695-697. rule-extract.md:574-576 (States must require SNAP, TANF, corrections and school data) is preamble per what-matters-most.md:485; I did not re-read it.

## D. Known items, confirmed

| Known item | Check | Result |
|---|---|---|
| what-matters-most.md:140 cites 91 FR 33385 for the TANF sentence | The sentence on not relying on reporting from the individual is at 2026-11094.txt:1210, between the 33377 marker (1183) and the 33378 marker (1222). Page 33385 (1479-1511) never mentions TANF | Confirmed, Verified |
| Medicaid CFA summary :68 says "meeting" SNAP rules | § 435.554(c)(7) is a member of a household receiving SNAP who is not exempt from a work requirement (T1, 4009); (c)(6), TANF, is compliance (4007). The CFA PDF says "have to meet (not exempt from)", closer to the rule; the summary's "meeting" is its own. The line also drops "household" | Confirmed, Verified |
| SNAP CFA summary :51 says 18 or younger | The statute says under 18 (T1, title1.md:64). The CFA PDF has the same wording | Confirmed, Verified; upper bound is finding 22 |
| HR1-Impact-Summary.md:17-34 omits § 10102(a) | The summary mentions only the new Indian exceptions from § 10102(a). It omits the age change to "over 65", the dependent child age moving to under 14, and the dropped homeless, veteran and former-foster-youth exceptions, which fall away because (a) replaces paragraph (3) whole (title1.md:60-76) | Confirmed, Verified |

The 15 dangling references, each checked with `git ls-tree` against `experiment-1`:

| File | Lines | Targets |
|---|---|---|
| state-options.md (9) | 15, 144, 249 (ADR-0001); 255 (ADR-0003); 55 (`src/lib/education.ts`); 180 (`src/lib/policy/`); 62 and 189 twice (`wave-2b-policy-profile.md`) | ADRs under `docs/hr1-readiness/decisions/`; wave file under `docs/hr1-readiness/waves/`; `src/lib/education.ts`; `src/lib/policy/` with 7 files |
| rule-extract.md (4) | 13 (validation findings); 234, 240 (ADR-0003); 951 (ADR-0006) | `docs/audit/validation-findings-2026-08.md`; ADRs as above |
| supporting-regs/README.md (1) | 134 (ADR-0003) | as above |
| what-matters-most.md (1) | 89 (validation findings) | as above |

None exists in the working tree; all exist on `experiment-1`. Commit `b9b9594`, cited at rule-extract.md:19, exists on `main` and `experiment-1`. The README's W4, W7a, W8a and PRD G1 labels are not file paths and are not counted here; they are v1 planning vocabulary that v2 readers cannot resolve either.

## E. Recommendation for the v2 corpus

The corpus has 3,923 lines of analysis across 8 files (counted with `wc -l`) over 4,883 lines of IFC text. rule-extract, what-matters-most and state-options restate the same IFC provisions, and in 9 of the 16 entries in B the faulty side is one of those three: B2, B3 and B16 in what-matters-most, B4 to B6 and B15 in state-options, B7 across all three, and B1 a fix that reached one file and not the other. The structure that follows keeps one extract per rule set and makes everything else either a source or a pointer.

E1. Sources, stored verbatim with a manifest giving URL, retrieval date and hash:

- Keep `2026-11094.txt`, `.xml` and `SECTION-INDEX.txt`. Add the correction notice C1-2026-11094 (91 FR 39028), which both extracts cite and nothing stores, and check for any later notices.
- Keep `42cfr-supporting-sections.txt` and `other-supporting-sections.txt`, re-pulled with a new snapshot date.
- Keep the HR1 title files as the statute, and fix the H1 of `119hr1enr-hhs-sections.md`, which repeats the impact summary's title over what is a section list.
- Add as each lane finds them: CMS sub-regulatory guidance (SPA template, CIBs, FAQs), State-published material (Colorado first, per the user), and, if SNAP stays in scope, 7 U.S.C. 2015(d) and (o) with 7 CFR 273.7 and 273.24.
- The blueprint PDFs stay as sources for service research only.

E2. Authoritative, one per rule set:

- rule-extract.md becomes the single Medicaid community engagement extract. Keep its content; the checks here went against it only at B1, B5, B7 (:889), findings 9, 12 and 16, and the unsourced rows in table C. Give every rule a row-level citation (CFR paragraph, FR page, local file:line), a tier, and a Verified date. Remove the v1 design commentary (`isExempt`, ADR references, the policy-profile module, the W labels). Move § 11, the implementation landscape, to the State facts store.
- supporting-regs/README.md stays as the extract for incorporated regulations, § 435.603 first, without its W4, W7a and W8a notes. It keeps precedence over the main extract on income, as what-matters-most.md:41-42 already sets.
- State facts become a structured data file, one record per State and parameter. Each record carries a value, source URL, `retrievedAt`, tier, and whether it predates the IFC. Seed it with the federal default and Colorado. Hold the KFF-derived rows out until they are re-sourced after the IFC.

E3. Derivative, to retire or merge, each as a decision record:

- what-matters-most.md (718 lines): merge the priority ordering, § 12 (the checklist of common errors), § 13 (known uncertainty) and the closing guidance on writing for people into the extract and the skill, then retire the file. It already declares itself the bug whenever it disagrees with rule-extract (:41).
- state-options.md: its TypeScript schema and the W2b correction history are v1 design and remain on `experiment-1`; v2's schema belongs in v2's design document. Its tracker moves to the data file in E2.
- HR1-Impact-Summary.md (762 lines): retire. It is undated and pre-IFC, frames the law as AWS opportunity (:7), spends most of its length on provisions HourKeep does not touch (provider taxes, directed payments, HSAs, rural health), and has the errors in findings 11 and D. Replace it with a short statute extract of the sections HourKeep relies on, starting with § 71119 and § 71107, plus § 10102 if SNAP stays.
- The two CFA blueprint summaries: move them to a prior-art folder outside the policy corpus with a pre-IFC notice. Their pain points and opportunities still serve the UX work the user wants; their policy lines do not.

E4. What a HourKeep domain skill should hold. The skill loads into context, so it should stay short: operative rules, and pointers into the extract for everything else.

- Precedence: regulatory text over preamble over secondary; raw § 435.603 for anything about household income; the extract over the skill whenever the two differ.
- A rule table of roughly 40 to 60 rows covering §§ 435.550 to 435.561 and § 1902(e)(14)(L). Each row gives the rule ID, a plain paraphrase, the citation (CFR paragraph, 91 FR page, local file:line), tier, verified status and date, whether it is a State election and which parameter, which direction an error costs the person, and what would trigger re-verification (final rule, correction notice, court ruling, State SPA, FLSA change).
- The hhs-benefits number labels applied to HourKeep's figures: the $580 threshold and the credit-hour conversion are Computed; income-to-hours is Conditional (a State option, and an upper bound because of household allocation); household income and frailty status are Deferred to the agency.
- CMS vocabulary: applicable individual, specified excluded individual, mandatory exception, short-term hardship event, review period, renewal initiated, reliable information available to the State, satisfactory showing.
- The common-errors checklist from what-matters-most § 12, each line with its cite, B2, B3 and the 56 percent scope corrected first.
- A watch list with dates: the 2026-10-20 hearing, the final rule, § 435.916 reconciliation, State SPAs, Emmy.
- Kept out, per AGENTS.md: repository-state counts, v1 history, dangling-reference lists, per-State values (the data file holds those), and anything unverified unless it is labelled.

Two practices would have caught B1 and B4 to B6: when one file is corrected, search the whole corpus for the corrected claim, and give every per-State value its own retrieval date.

## Could not verify

- The text of the June 29, 2026 correction notice, and whether later corrections or a final rule exist. My one fetch of federalregister.gov was redirected to another origin (unblock.federalregister.gov), which I did not follow.
- Every § 435.557 and § 435.558 paragraph designation in the corpus against the corrected text.
- Current status of Massachusetts v. Oz, the early implementers, Georgia Pathways, Emmy and the Emmy API.
- The composition of the 44 jurisdictions, the eight or nine documentation States, and the Idaho, Indiana, New Hampshire and Arkansas lookback values.
- The 79,718 comment count, 12-month postpartum prevalence, Georgia's list structure, Missouri's fax channel, the Urban Institute 52 percent, and the SNAP E&T State counts.
- Whether eCFR changed after the 2026-08-13 snapshot, and whether any later statute amended § 1902(xx) or 7 U.S.C. 2015(o).
- FNS's reading of "over 65" in § 6(o)(3)(A), and the content of 7 U.S.C. 2015(o)(4)(A)(i), which § 10102(b) leaves in place but the corpus does not store. HR1-Impact-Summary.md:24 reads as if only noncontiguous areas can now get waivers; that is Unverified.
- KFF's figure data beyond the brief's text, and the KFF brief's current version beyond my 2026-10-16 fetch.
- The CFA PDFs beyond eight phrases I extracted with PDFKit (scope, caregiver, veteran, optional channels, the SNAP/TANF line, the $580 wording, the SNAP age line, the dates).
- The rest of the v1 validation file: I read only its § G.
- rule-extract.md:574-576 against the preamble at 91 FR 33392 ff., and the 72-citation self-check described at what-matters-most.md:13-19, which I did not re-run.

Scratch: I deleted `scratch-L8/notes.md` and the `scratch-L8/` folder before finishing. Three PDF text extracts were deleted as soon as I had read them; one was briefly written to `/tmp`, outside the permitted folder, and removed. The fetch tool saved the public KFF page under the session's tool-output folder outside the repository.
