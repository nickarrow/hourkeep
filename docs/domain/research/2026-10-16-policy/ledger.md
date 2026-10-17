# Verification ledger: policy research lanes L1 to L8, 2026-10-16

Verification step for the 2026-10-16 policy research. Read-only against the repository: this file and a scratch folder,
since deleted, were the only writes.

Skills: the session listed five skills by name (hhs-benefits, project-docs, review, stack, writing-code). I loaded
hhs-benefits through the skill tool and did not read its SKILL.md from disk; I read `AGENTS.md` directly, and it also
arrived as an injected workspace rule. No other skill was loaded.

For each finding I opened the source it cites, or a better primary one, on 2026-10-16: Federal Register API and XML
(the IFC, correction C1-2026-11094, the IRS proposal), the eCFR API (title 42 current to 2026-10-14), CourtListener RECAP
metadata and stored PDFs, medicaid.gov and cms.gov files, State statutes and agency pages, OIRA XML feeds, FNA pages, the
GitHub API, and the corpus at the cited lines. medicaid.gov and hcpf.colorado.gov returned 200 to curl requests that sent
full browser-style headers, where earlier lanes saw 403. The shared browser tool was not connected.

Source tiers used below: statute; regulation text; FR preamble; proposed regulation; agency guidance (CMS, FNA, OIRA
records); State statute; State draft rule; State agency page; court docket or order; party filing; secondary. V means
read in that source on 2026-10-16 at the place named; U means not read in a primary source. Statute cites point at the
corpus copy of PL 119-21 in `docs/domain/hr1/`, which I did not re-compare with GovInfo (L3 did). In the direction
column, burdensome means the old text, or the gap, would lead a person to do more than the rule requires; dangerous
means less; neither means it changes a cite, a date or design context.

## Counts

I checked 105 finding IDs: all 43 tagged CORRECTION or STALE, and 62 of the 64 ADDITIONs (all 50 that change what
HourKeep tells a person, plus 12 others). Not checked: L6-7 and L6-18, both design context. Results by ID:

- CORRECTION and STALE: 39 confirmed, 3 confirmed in part, 1 partly rejected (L8-11), 0 rejected, 0 could not verify.
- ADDITION: 45 confirmed, 17 confirmed in part, 0 rejected, 0 could not verify.
- Spot-checks of CONFIRMED or OPEN findings: 5 checks covering 6 IDs, all as stated.

"Confirmed in part" means the core held and a named sub-claim was not re-checked. Leads thrown out or narrowed: 1
sub-claim rejected (L8-11, the alien-rule dates) and 4 evidence statements narrowed (L8 section B6 on KFF, L3 section G
on HB26-1235's repeal trigger, L4 item 11 on county hardship requests, L4 item 12 on a Nebraska update date).

## Ledger A: CORRECTION and STALE findings

| ID | Corpus text (file:line) | Claimed correction | Source, tier, status | Result | Direction |
|---|---|---|---|---|---|
| L1-4 | `cms-2454-ifc/2026-11094.txt` and `.xml`, June 3 printing | § 435.557(f)(1)(ii)(B) to (g)(1) printed inside § 435.558(a)(2); no corrected copy stored | C1-2026-11094, 91 FR 39028-39031, FR XML, regulation text, V; corpus txt 4278-4314 ("vertification" at 4298), V | Confirmed. My paragraph diff of the two printings: 11 differ, all page-break splits or the splice | Neither; risk is mis-citing the raw copy |
| L1-5 | rule-extract.md:6-7 "a misplaced § 435.557(c)(2) block relocated, one merged-word typo" | The splice was (f)(1)(ii)(B) to (g)(1) plus § 435.558(a)(2)(i); (c)(2) unchanged | Same, V; txt 4240 equals the corrected (c)(2) | Confirmed | Neither |
| L1-6 | state-options.md:122 "91 FR 33476", :124 "91 FR 33477" | Republished at 91 FR 39030 and 39031, same words | C1 XML page markers, V | Confirmed | Neither |
| L1-11, L3-1, L5-15, L8-16 (date) | rule-extract.md:932, what-matters-most.md:233, state-options.md:42 "October 20, 2026" | Hearing reset to 2026-10-22, 10:00, 40 minutes a side | D. Mass. 1:26-cv-12962 ECF 143, entered 2026-10-08, court docket, V | Confirmed; 143 is the newest RECAP entry; ECF 103 still shows Oct 20 because it predates 143 | Neither |
| L2-3 | state-options.md:129 "12 for AI/AN and most 1115"; :235; rule-extract.md:861; what-matters-most.md:685 | Test is whether the waiver gives MEC to the whole (VIII) group; partial-expansion demonstrations are out | SMD 26-001 pp. 1, 3-4, fn 7, agency guidance, V; preamble 91 FR 33398 (txt 1835) states the same exception, V | Confirmed; "most" is in neither source | Dangerous: a full-expansion-by-waiver enrollee told 12 months gets 6 |
| L2-6, L4-6, L6-2 | state-options.md:309, rule-extract.md:996 "currently under development" | MACPro guide published; elections C.1, D.2, D.4, E.1-E.3, F.3 | MACPro implementation guide, PDF created 2026-08-04, agency guidance, V | Confirmed; p. 5 also says electing States implement all hardship event types | Neither |
| L2-18, L8-17 | rule-extract.md:949 "may be discontinued"; :942-943 Hub July 2026, no source | CE modules piloting in one State, more pilots possible in 2027; Hub adds education-enrollment and VA data | cms.gov Emmy page, agency guidance, V | Confirmed; no discontinuation language; the July 2026 Hub date stays unsourced | Neither |
| L2-19 | what-matters-most.md:277 "CMS's verification guidance adds" | Source is IFC preamble 91 FR 33400 | txt 1869 under the 33400 marker at 1867, FR preamble, V | Confirmed; tier label only | Neither |
| L3-2 | rule-extract.md:930-931, what-matters-most.md:232, the case targets the gate and attestation | Complaint: 3 Count I items, 7 Count II items, a Spending Clause count; narrowed 2026-09-01 to gate, claims period, attestation | ECF 1 ¶¶ 212-221; ECF 103 p. 2 n.1; ECF 104 contents, party filings, V | Confirmed; the corpus omits the 12-month claims-period challenge | Neither |
| L3-4 | rule-extract.md:931 "denied July 29–30, 2026" | Denied without prejudice 2026-07-29, on irreparable harm | ECF 94 pp. 1-6, court order, V | Confirmed | Neither |
| L3-10 | rule-extract.md:863, :991; what-matters-most.md:686, watch for the reconciling rulemaking | No rulemaking; CMS used SMD 26-001 of 2026-03-06 | FR API, CMS documents since 2025-07-04 matching "1902(e)(14)(L)" or "435.916": 2 (IFC, correction), V | Confirmed | Neither |
| L3-12 | medicaid blueprint:277 expansion adults move "from 12 months to 6"; HR1-Impact-Summary.md:242 "Excludes certain vulnerable populations" | Only exemption: people in 1902(xx)(9)(A)(ii)(II) (Indian, Urban Indian, California Indian, IHS-eligible) | statute, title7-part3.md:244, :702-708, V; SMD 26-001 p. 4, V | Confirmed | Blueprint burdensome for AI/AN; summary dangerous |
| L4-8 | state-options.md:271 Arkansas renewal months "3" | One month every six months; applicants the month before | AR DHS ARHOME FAQ, State agency page, V; KFF brief says 3 (secondary, pre-IFC) | Confirmed; the row cites AR DHS but its 3 matches KFF | Burdensome |
| L4-9 | state-options.md:281 Missouri "no unemployment event" | Missouri uses no short-term hardship exception | dss.mo.gov FAQ, State agency page, V | Confirmed; same page confirms fax (state-options.md:236) | Dangerous |
| L4-10 | state-options.md:282 Oklahoma "no unemployment or disaster event" | OHCA lists all four; says two county events await federal approval | OHCA work requirements page, State agency page, V; draft rule APA WF 26-06 not opened | Confirmed | Dangerous |
| L4-11 | state-options.md:283 New York "no medical-travel event" | NY State of Health lists events A to D, travel included | info.nystateofhealth.ny.gov/stay-covered, V; all-or-none at 91 FR 33380 (txt 1319), V | Confirmed | Dangerous |
| L4-12 | state-options.md:269 Nebraska frailty docs "2027-01" | Self-declaration; no documentation required at this time | NE DHHS frailty exemptions document, State agency, V | Confirmed; the document shows May 1, 2026 and no "updated 2026-09-14" date | Burdensome |
| L4-13 | state-options.md:116-117, :229; rule-extract.md:922-923, eight States require frailty documents from 2027 | Rests on one press report; AP names a different six; NH requires certification | AP via Seattle Times (secondary, V that AP says it); NH RSA 126-AA:6 (State statute, V); Iowa "may require" (V) | Confirmed in part; Politico and Ohio's page not opened | Mixed: wrong inclusions burdensome, NH omission dangerous |
| L4-16 | rule-extract.md:954 "Only Idaho and Indiana were on the July schedule" | NC's 3-month application lookback also meant a July 1, 2026 deadline | NC Medicaid page (State, V); eCFR 435.561(b)(1), V; date computed | Confirmed | Neither, deadline past |
| L4-17, L8-5 | state-options.md:286 "KFF survey of all 44" | KFF surveyed 43 | KFF brief text, secondary, V | Confirmed; rule-extract.md:919-920 already says 43 | Neither |
| L5-20 | Coverage Compass, outside docs/domain | Shipped Colorado rules predate the IFC | GitHub API: Apache-2.0, commit c7913f9 2026-09-23; `rules/co/exemptions.yaml` v0.0.1, 8 categories, cites pending CMS guidance, secondary, V | Confirmed; gates only the ADL category, requires a diagnosis letter and pregnancy proof | If copied: frailty dangerous, evidence rules burdensome |
| L5-21 | Colorado pages, outside docs/domain | Pre-IFC text still online; worker sheet omits TDIU | hcpf.colorado.gov/hr1-key-changes (lists SSR recipients, "total and permanent" veterans); Sep 2026 worker sheet, 0 TDIU (counted), State agency, V | Confirmed in part; member FAQ and Feb Worksheet J not re-opened | TDIU omission burdensome; SSR line dangerous |
| L7-4 | SNAP baseline report, outside docs/domain | FNA waiver page updated 2026-10-05; FY2027 Q1: 0 statewide, 12 partial, 41 none | fna.usda.gov waiver page and FY27 Q1 PDF, agency guidance, V | Confirmed; Colorado has no waiver | Neither |
| L7-5 | SNAP baseline report | Rhode Island State Council of Churches v. Rollins is closed | D.R.I. 1:25-cv-00569: ECF 53 stipulation 2026-03-02, terminated 2026-03-03, court docket, V | Confirmed; mootness reasons not re-read | Neither |
| L8-3 | what-matters-most.md:597 the dependent is "a minor child, for this section" | Three prongs: minor child at home, tax dependent of any age, court ward | eCFR 435.555(b)(1)(i)-(iii), regulation text, V | Confirmed | Dangerous |
| L8-4 | rule-extract.md:992 "Each State must publish an auditable condition list" | Rule says develop | eCFR 435.554(c)(5)(ii), regulation text, V | Confirmed; rule-extract.md:413 already says develop | Dangerous, mildly: a person may self-screen out |
| L8-6 | Tracker: 9 rows with frailty docs 2027-01 (counted) against "eight" in text | Internal contradiction | state-options.md:268-284, V | Confirmed | See L4-13 |
| L8-7 | state-options.md:302 lookbacks "reported as 'more than one'" against rows :271, :274-276 | One side is stale | KFF text gives ID and IN 3 at application, AR 3 at renewal (secondary, V), so L8's B6 remark that KFF gives none is wrong; State values in Ledger B, L4-14 | Confirmed | Burdensome for AR |
| L8-8 | what-matters-most.md:550-553 notice list "(i)–(vii)" with no hardship item | (c)(1)(vii) is hardship information | eCFR 435.558(c)(1)(vii), regulation text, V | Confirmed | Dangerous, mildly |
| L8-9 | what-matters-most.md:708 "Most people will not be asked for anything"; rule-extract.md:577 "a large share of users will never be asked" | 56% applies to applicable individuals due for renewal; 8.8 million submit every 6 months | 91 FR 33434 (txt 2830-2835), FR preamble burden estimate, V | Confirmed; rule-extract.md:926-927 is close to the source | Dangerous |
| L8-10 | medicaid blueprint :17 (GA, TN, WI "irrelevant"), :52 and :104 household with a child 13 or younger, :58 "Disabled veteran", :214 online or fax optional | IFC contradicts all four | IFC deck s9, agency guidance, V; eCFR 435.554(c)(3), (c)(4), 435.557(b)(4), 435.907(a), V | Confirmed | :17, :52, :58, :104 dangerous; :214 burdensome |
| L8-11 | HR1-Impact-Summary.md:384-391 six pathways; :105 "30% or higher"; :130 "doubling"; :651 vs :698 alien-rule dates | Combination pathway missing; trigger is error rate x 1.5 at or above 20%; 50 to 75% is 1.5x; dates conflict | statute: title7-part3.md:584, title1.md:185-189 and :196, title7-part3.md:1030 and :1035, V | Partly rejected: § 71301 starts with tax years after 2026 and § 71302 after 2025, so :698 can be right | Six pathways burdensome; rest neither |
| L8-12 | what-matters-most.md:25 "33465 ff."; rule-extract.md:585 splice; supporting-regs/README.md:15 "through October 1, 2034" | Text starts at 91 FR 33469; sentence spliced into a quote; IFC says until Oct 1, 2034 | txt 3595-3644, txt 358; title7-part3.md:21 (moratorium ends Sept 30, 2034), V | Confirmed | Neither |
| L8-13 | rule-extract.md:13 (2026-08-16), what-matters-most.md:9 (2026-08-17), README:3 (snapshot 2026-08-13) | Verification dates 61, 60, 64 days old | file headers, ages computed, V | Confirmed | Neither |
| L8-14 | Both CFA summaries dated 2025-09-10 | 401 days old, 266 days before the IFC | file headers, computed, V | Confirmed in part; "IFC answers their open questions" not re-checked | Neither |
| L8-15 | state-options.md:263-264, tracker rests on a survey fielded Jan to Mar 2026; no per-row retrieval date | OK and NY rows describe plans the IFC rules out | 91 FR 33380, FR preamble, V; MACPro p. 5, V | Confirmed | Dangerous for those rows |
| L8-16 (rest) | rule-extract.md:966-967 "intend to implement before" against :781-782 live | Tense contradiction; Iowa 2026-12-01 and Pathways 2026-12-31 time-bound | Iowa HHS page, V; GA overlay letter, V; Montana enforcing since 2026-10-01 (DPHHS slides 2026-09-10 p. 13), V | Confirmed | Dangerous for Montanans, who face enforcement now |

## Ledger B: ADDITIONs that change what HourKeep tells a person

| ID | Addition | Source, tier, status | Result | Direction if HourKeep lacked it |
|---|---|---|---|---|
| L1-9 | No premium tax credit while ineligible solely for CE; IRS proposal 91 FR 65494 would codify it, ending when CE is no longer the sole reason; comments close 2026-11-30 | statute 1902(xx)(7)(B), title7-part3.md:662, V; proposed 26 CFR 1.36B-2(c)(2)(ii)(B)-(C), (v)(B), p. 65506, V | Confirmed; proposed text only | Dangerous |
| L1-12, L3-5 | Taylor v. Kennedy, Jr., D. Md. 1:26-cv-03705, filed 2026-09-18, 12 plaintiffs (counted): gate, SUD stable-recovery carve-out, 12-month window, attestation limit; no ruling promised before 2027-01-01 | complaint ¶¶ 187-197 (party filing, V); ECF 28, 2026-10-14 (court order, V) | Confirmed | Neither now |
| L2-2 | SMD 26-001 is CMS's six-month renewal guidance; no corpus file cites it | SMD p. 1, V; repo search for "26-001": 0 hits, V | Confirmed | See L2-3, L2-4 |
| L2-4, L3-11 | Option 1 pulls set 2027 renewal starts earlier, never before 2027-01-01 (in practice 2027-01-04); Option 2 keeps them; under Option 1 first CE review can come in January 2027 | SMD pp. 7-9, Example 2, V; Montana's "pulled forward" table (last redetermination Aug 2026: next one moves from Aug 2027 to Feb 2027), State page, V | Confirmed; what-matters-most.md:711 overstates, :77-79 is right for Jan and Feb due dates | Dangerous |
| L2-5 | Shortening a period, or moving someone into a 6-month group, needs 10 days' notice and hearing rights; SPA due 2027-03-31 | SMD pp. 9, 11, 12, V | Confirmed; 3/24 call transcript not re-read | Dangerous |
| L2-7 | Caretaker relationships come from the State's Parents and Other Caretaker Relatives page; guide contradicts itself on months at more-frequent checks | MACPro pp. 5, 8-10, V | Confirmed | Neither |
| L2-8 | Optional three-tier frailty framework; Tier 3 document list; CMS anticipates a five-year claims lookback for SUD recovery | frailty deck slides 12, 20, 31, agency guidance, V | Confirmed; the lookback is an intention | Burdensome |
| L2-11 | 13 demonstration-only populations in 8 States, "to date" | IFC deck s9, V | Confirmed | Dangerous |
| L2-12 | SNAP exclusion covers general or time-limit rules; initial GFE approvals expected at 6 months or less; plans may not track activities or send noncompliance notices | IFC deck s18, s42, s47, V | Confirmed | Mixed: SNAP breadth burdensome |
| L2-13 | 42 of 44 CE renew-info pages say people "already meet" SNAP work requirements | all 51 pages fetched: 7 no-new, 44 CE, 42 with the phrase (computed), agency guidance, V; eCFR (c)(7), V | Confirmed | CMS wording burdensome; do not copy |
| L2-14 | renew-info divergences: "earning at least $580" (44 pages), "have or qualify for Medicare" (42), "given birth" (42), "recovery program" (42), tribal line (42); AK and HI among the 41 pages showing $22,025 | pages, V; eCFR 435.552(f)(2), 435.553(a)(2), 435.554(c)(2), (c)(10), V | Confirmed in part; AK and HI limits not re-derived; 1902(e)(5) not opened (U) | Medicare, recovery, frailty, AK/HI dangerous; earning, birth, tribal burdensome |
| L2-16, L6-15 | Focus groups: say "work requirements", avoid "community engagement"; ranked channels; personalised exclusion checklists | CMS Qualitative Research Communication Summary pp. 1-2, V | Confirmed | Neither |
| L2-17 | No CMS model notice | CE resource and outreach pages: 0 model notices, V | Confirmed in part; 2 pages only | Neither |
| L2-20 | state-options.md:159 "a State may reverify more often" | § 435.557(d)(4): no re-check of excluded status between scheduled renewals unless the State has information of change; label survives the correction | eCFR 435.557(d)(4), regulation text, V; IFC deck s29, V | Confirmed; upgrades L2's preamble cite to regulation text | Burdensome |
| L3-6 | States seek vacatur, an injunction and a 6-month penalty bar; the government seeks remand without vacatur and says vacatur would reach non-plaintiffs; 26 plaintiffs (counted) | ECF 103 p. 1, ECF 104 contents, ECF 138-1 pp. 38-41, party filings, V | Confirmed; 44 minus 26 is 18 (computed) | Neither now |
| L3-9 | § 71107 adds 1902(e)(14)(L): renewals scheduled on or after 2027-01-01, Indians the only exemption | statute, title7-part3.md:233-248, V | Confirmed in part: the 3 analysis files never name § 71107; HR1-Impact-Summary.md:239 and the HR1 files do | Dangerous |
| L3-16 | Government told the court on 2026-09-18 that no good-faith exemption had issued | ECF 138-1 p. 40, party filing, V | Confirmed | Neither |
| L3-17 | KRS 205.5371 (eff. 2026-04-14): 1 month before application, 3 since last determination, no GFE request without the General Assembly | statute text PDF, State statute, V | Confirmed | Dangerous: federal default shows 1 month |
| L3-18 | HB26-1235, session law ch. 361, approved 2026-06-03, eff. 2026-08-12: rules by 2027-01-01 with the least administrative burden; monthly data from 2027-03-01 | session law PDF, State statute, V | Confirmed; rule authority ends only if the federal requirement is repealed | Neither |
| L4-5 | NE 26-0002 approved 2026-09-04, eff. 2026-05-01: 1 month at application and renewal, no more-frequent checks, hardship yes, F.3 concurrent; CMS asks for the impairment gate and 10-day notices | SPA PDF pp. 1-11, agency guidance, V | Confirmed in part; "only approved CE SPA" not re-checked | Dangerous: corpus default promises a second window |
| L4-7 | Overlay letter 2026-09-25 applies CE to Pathways from 2027-01-01 while every authority expires 2026-12-31 unless renewed | overlay letter p. 1, V | Confirmed in part; pending-application status not re-checked | Neither until resolved |
| L4-14 | Lookbacks: ID 3 at application, 3 during the 6-month period; IN 3 before application and before each renewal or quarterly review; NH 1 at application, checks at least quarterly; AR 1 and 1 | ID DHW page, IN partner toolkit, RSA 126-AA:6, AR FAQ, V | Confirmed | Dangerous for ID and IN |
| L4-15 | More than 1 month at renewal: ID 3, IN 3, KY 3, MT 3 non-consecutive, NC 3 of 6, IA 2 | State pages and KY statute, V | Confirmed in part; the base of 21 States not recounted | Dangerous |
| L4-18 | Missouri elects no hardship; NH none without oversight-committee approval | MO FAQ, RSA 126-AA:6 para. V, V | Confirmed in part; count of 15 not recounted | Dangerous |
| L4-19 | Indiana converts income to hours at $7.25 ($507.50 is 70 hours) | IN partner toolkit, V | Confirmed | Neither; supports the Conditional label |
| L4-20 | Household reading of $580: AR (combined earnings), NY, OR, PA; ID household income | State pages, V; matches eCFR 435.552(f)(2), V | Confirmed in part; Montana not re-checked | Burdensome |
| L4-21 | Public frailty lists: NE index (295 pp., counted), Ohio ICD-10 list (file dated 10.29.2025), GA Attachments A and B | PDFs, V | Confirmed; Ohio list predates the IFC | Neither |
| L4-22 | Self-attestation in 2027, documents possible from 2028: CO, LA | HCPF FAQ, LDH page, V | Confirmed in part; Oregon not re-checked (guessed URL 404) | Burdensome |
| L4-25 | TennCare III parents are subject but automatically meet it; no action needed | TennCare notices page, V | Confirmed | Burdensome |
| L5-1 | Draft 10 CCR 2505-10 § 8.100 (26 pp.), not adopted; MSB 2026-11-27, emergency reading 2026-12-11, effective 2027-01-01, permanent 2027-02-12 | draft rule PDF (State draft rule, V); HCPF deck p. 30, V | Confirmed | Neither |
| L5-2 | Colorado: month before application; 1 calendar month since last renewal deadline; proxy; attestation in 2027; veterans by VA determination; 6-month renewals | HCPF FAQ (updated 2026-09-21), timeline (2026-10-08), draft rule, letter, V | Confirmed in part; more-frequent checks and 12-month frailty not re-checked | Neither; matches federal default |
| L5-3 | The CE form rides in the renewal packet, due with it, at least 30 days; maps to § 435.558(b)(2) Option 1 | draft rule § 8.100.4.G.4, verification of redetermination, V | Confirmed; the mapping is inference | Dangerous: default promises two windows |
| L5-8 | Credit-hour conversion rounded up to whole hours; job search in a State program capped at 39 hours a month | draft rule, V | Confirmed | Cap omission dangerous |
| L5-9 | Retroactive requests reviewed for the month before the retro month; IFC has 0 lines matching "retroactiv" (counted, txt and xml) | HCPF FAQ, V; corpus search, V | Confirmed | Dangerous |
| L5-12 | Frailty indicators include SSI or SSDI, LTSS, a facility stay now or in the past 3 months | HCPF FAQ, V | Confirmed in part; HIE plan and Worksheet J not re-opened | Burdensome |
| L5-16, L6-11 | Letter template EN (6 pp.) and ES (7 pp.), "For Reference Only"; EN PDF created 2026-08-24; 1 calendar month since last renewal deadline | HCPF PDFs, V | Confirmed in part; 12-PDF count and 377,000 figure not re-checked | Neither |
| L5-18 | Appeal within 60 days of the Notice of Action; coverage continues if the court gets it within 10 days after the date of action; none for first-time applicants | Health First Colorado appeals page, V; 42 CFR 431.221(d) not re-opened (U) | Confirmed | Dangerous |
| L5-19 | Spanish letter renders "at least halftime" as "al menos a tiempo parcial" | HCPF ES letter p. 3, V; reading it as part-time is my judgment and L5's, not a native-speaker review (U) | Confirmed | Dangerous for less-than-half-time students |
| L6-3 | Nebraska Verification Request sample (PDF 2026-04-28, pre-IFC): no named month, no PTC (0 mentions), due 35 days after the notice date (computed), copies not originals | NE DHHS sample, V | Confirmed in part; L6's 4-full, 3-partial grading not redone | Neither |
| L6-5 | Georgia: 30 calendar days "from the date of issuance" | DCH SPA public notice, V; receipt rule at eCFR 435.558(c)(4), V | Confirmed | State wording burdensome; show the printed date |
| L6-6 | The 30-day period cannot be stretched to match a longer renewal-form period | 91 FR 33411, txt 2141, FR preamble, V | Confirmed | Dangerous |
| L6-8 | Letters carry other titles: NE "Verification Request", MT "Notice of Adverse Action" | NE sample, MT page, V | Confirmed in part; VA, AZ and others not re-checked | Dangerous: a person may miss the clock |
| L6-9 | Arkansas soft-launch emails in 3 versions, no penalties before 2027-01-01 | AR sample emails PDF, V | Confirmed | Neither; matters for notice intake |
| L6-12 | Montana hold-harmless ended 2026-10-01; enforcement by denial or disenrollment; 3 non-consecutive months since last redetermination | DPHHS slides 2026-09-10 p. 13; medicaidchanges page, V | Confirmed | Dangerous |
| L7-7 | HCPF FAQ and WR page say "complying with" SNAP or TANF rules; draft rule and § 435.554(c)(7) say SNAP household, not exempt | HCPF pages (2026-09-21, 2026-09-23), draft rule, V; eCFR, V | Confirmed | State copy burdensome |
| L8-19 | Missing: automatic county hardship needs no information or impact test; community service records auditable; notices meet § 435.905(b) and § 435.918(b) | eCFR 435.557(g)(2)(ii), 435.558(c)(2)-(3); 91 FR 33386-33387, 33400, V; corpus search: none, V | Confirmed | Burdensome |

## Ledger C: other ADDITIONs checked

| ID | Addition | Source, tier, status | Result |
|---|---|---|---|
| L1-7 | Third broken cross-reference: § 435.554(c)(5)(ii)(A) cites "(a)(5)(i)(A) through (E)" | eCFR 435.554, V | Confirmed |
| L2-1 | No CE CIB, SMD or SHO since the IFC | CE resource page lists only the 2025-11-18 and 2025-12-08 CIBs, V; guidance database renders by script, not re-read (U) | Confirmed in part |
| L3-3 | Hardship-timing, emergency and renewal-timing claims dropped | ECF 103 n.1 citing ¶¶ 213, 220(e), V | Confirmed |
| L3-15 | § 71119(d) exempts implementing actions from 5 U.S.C. 553 | statute, title7-part3.md:788, V | Confirmed; the consequence is L3's reading |
| L5-14 | Colorado is a Massachusetts v. Oz plaintiff | complaint ¶ 13; ECF 103 caption, V | Confirmed |
| L6-10 | Nebraska: 557 denials, 84% non-response; 533 renewal losses, 92% | KFF brief, secondary, V | Confirmed |
| L6-16 | Spanish versions are common | CO ES letter, V; CMS outreach page lists a second set, V; 16 taglines not recounted | Confirmed in part |
| L7-2 | OIRA concluded RIN 0584-AF09 on 2026-08-14, "Consistent with Change"; 0 FR documents | OIRA completed-YTD XML, V; FR API, V | Confirmed |
| L7-9 | ACF removed and reserved 17 sections of 45 CFR 261, effective 2026-09-29; § 261.2 unchanged since 2016-12-20 | 91 FR 48268 metadata, V; eCFR versions, 17 counted, V | Confirmed |
| L7-10 | RIN 0584-AF10 under OIRA review since 2025-10-24 | OIRA under-review XML, V | Confirmed |
| L8-18 | Correction cited, not stored | folder listing and Ledger A, L1-4, V | Confirmed |
| L8-20 | README § 4 adds 5 § 435.603 options; the schema carries only predictable changes | README:204-216; state-options.md schema, V | Confirmed |

## Spot-checks of CONFIRMED and OPEN findings

- L1-3 and L3-7: FR API shows 2 documents for RIN 0938-AV98; newest Massachusetts entry is 143, no ruling (V).
- L2-15: 7 no-new-requirement pages and 44 CE pages on renew-info (computed, V).
- L4-23: NE SPA F.2 counts 30 days from the date of the notice (V).
- L5-5: HCPF timeline puts the first cohort at March 2027; its FAQ still says due dates in or after January 2027 (V).
- L5-13: the draft rule's SUD clause names early and sustained recovery stages only (State draft rule, V).

## Proposed changes to docs/domain, by file

Each change names the finding IDs behind it; the source, tier and status are in that ledger row. None has been made.

`cms-2454-ifc/rule-extract.md`
- :5-7: say the correction moved § 435.557(f)(1)(ii)(B) to (g)(1) out of § 435.558(a)(2) and restored § 435.558(a)(2)(i); (c)(2) did not move (L1-5).
- :12: mark `2026-11094.txt` as the June 3 printing; point §§ 435.557-435.558 at a stored copy of the correction (L1-4).
- :573-577 and :926-927: scope the 56% to applicable individuals due for renewal; 8.8 million submit every 6 months (L8-9).
- :585: repair the splice (L8-12).
- :852-864 and :989-991: replace with § 71107 and SMD 26-001: the whole-group test, AI/AN at 12 months, Options 1 and 2, 10-day notice when a period shortens, SPA by 2027-03-31; drop the rulemaking watch (L2-2 to L2-5, L3-9 to L3-11).
- :922-925: drop the eight-State sentence; per-State documentation rules belong in the State data file with sources (L4-12, L4-13).
- :929-933: litigation as of 2026-10-16 (Ledger A, L3-2 and L3-4; Ledger B, L1-12 and L3-6); recheck after 2026-10-22.
- :939-951: Emmy per CMS's page; drop "may be discontinued" (L2-18).
- :954: the July schedule held at least ID, IN and NC (L4-16). :966-967: fix tense; Montana enforcing since 2026-10-01 (L8-16, L6-12).
- :992: develop, not publish, and keep the off-list request path (L8-4). :996: MACPro guide published (L2-6).
- Add: § 435.557(d)(4) (L2-20); automatic county hardship, no information or impact test (L8-19); auditable community service records (L8-19); notice format §§ 435.905(b), 435.918(b) (L8-19); 30 days cannot be extended (L6-6); plan limits and SNAP breadth from IFC deck s18, s47 (L2-12); PTC consequence from 1902(xx)(7)(B), IRS proposal as a watch item (L1-9).

`cms-2454-ifc/what-matters-most.md` (L8 recommends folding it into the extract; until then)
- :25: regulatory text from 91 FR 33469 (L8-12). :231-234: litigation update (L1-11, L3-2). :277: IFC preamble, 91 FR 33400 (L2-19).
- :478-480: the correction did not move (a) or (b) (L1 section 3; my diff agrees).
- :550-553: add (vii), hardship information (L8-8). :597-598: three-prong dependent (L8-3).
- :683-691: six-month text per SMD 26-001; add the third broken cross-reference (L1-7, L2-3, L3-10).
- :708-711: scope the 56%; say the first review can come in January 2027 where a State took Option 1 (L8-9, L2-4).

`cms-2454-ifc/state-options.md`
- :42 hearing date (L1-11); :116-117 and :229 eight-State claim (L4-13); :122, :124 add 91 FR 39030, 39031 (L1-6).
- :129 and :235: whole-group test, cite SMD 26-001, remove "No reconciling rulemaking has issued" (L2-3, L3-10).
- :159: add § 435.557(d)(4) (L2-20). :162, if the schema survives: allow a tiered list (L2-8).
- :237: Option 2 default is wrong for Nebraska (SPA) and Colorado's draft; flag Option 1 States (L4-5, L5-3).
- :263-284 tracker: AR renewal 1; MO no hardship; OK and NY all four; NE self-declaration plus SPA values; add CO, KY, MT, NC, IA, ID, IN from State sources; one retrieval date and a pre-IFC flag per row (L4-8 to L4-12, L4-14, L4-15, L3-17, L8-15).
- :286 KFF surveyed 43 (L4-17). :302-304: lookback gap closed; hardship gap partly closed (L4-14, L4-18). :309 MACPro guide (L2-6).

`supporting-regs/README.md`: :14-17, the printed IFC governs only where uncorrected, and for §§ 435.557-435.558 the
correction governs (L1 section 3); :15-16, "until October 1, 2034" (L8-12); re-pull eCFR, now current to 2026-10-14 (L8-13).

`medicaid-work-requirements-cfa-service-blueprint.md`: add a pre-IFC notice or move to prior art; :17, :52, :58, :68,
:104, :214, :277 conflict with the IFC or statute (L8-10, L3-12).

`hr1/HR1-Impact-Summary.md`: retire per L8 E3, or fix :242 (Indians only), :384-391 (combination pathway), :105 (x 1.5
at or above 20%), :130 (1.5x). Leave :698, which can refer to § 71302 (L3-12, L8-11).

New file: `cms-2454-ifc/` copy of C1-2026-11094 (XML and text) with URL, retrieval date and hash (L1-4, L8-18).

## New sources worth adding to the corpus

- C1-2026-11094, 91 FR 39028-39031 (2026-06-29), federalregister.gov full_text XML. Regulation text.
- eCFR 42 CFR 435.550-435.563, 435.907, 435.916, current to 2026-10-14. Regulation text.
- SMD 26-001 (2026-03-06), medicaid.gov/federal-policy-guidance/downloads/smd26001.pdf. Agency guidance.
- MACPro implementation guide, Community Engagement for Certain Adults (PDF 2026-08-04). Agency guidance.
- CMS IFC overview deck (2026-07-27), Implementing Medical Frailty deck (2026-09-08), Qualitative Research Communication
  Summary (May 2026, EN and ES), CIBs of 2025-11-18 and 2025-12-08. Agency guidance; the IFC governs where they overlap.
- Treasury and IRS proposed rule, 91 FR 65494 (2026-10-15), REG-101576-26. Proposed regulation; watch until final.
- Statute extract of PL 119-21 §§ 71107 and 71119 from the existing `hr1/` files. Statute.
- Massachusetts v. Oz ECF 1, 94, 103, 104, 138-1, 143 and Taylor v. Kennedy ECF 1, 28, from CourtListener RECAP. Court.
- Nebraska SPA NE 26-0002 with CMS letter; NE frailty process document; NE Verification Request sample. Agency and State.
- Georgia Pathways overlay letter (2026-09-25); DCH SPA public notice. Agency and State.
- Colorado: draft 10 CCR 2505-10 § 8.100 and HCPF deck (Sept 2026); session law ch. 361; HCPF FAQ, WR page, timeline;
  outreach letter EN and ES; Health First Colorado appeals page. State.
- KRS 205.5371 and NH RSA 126-AA:6. State statute.
- Pages behind the tracker values: AR FAQ, MO FAQ, OHCA, NY State of Health, ID DHW, IN toolkit, IA HHS, NC Medicaid,
  MT DPHHS and its 2026-09-10 slides, TennCare, LDH, PA DHS. State agency.
- KFF, Early Medicaid Work Requirement Insights From Nebraska. Secondary, design evidence only.
- If SNAP stays in scope: FNA FY2027 Q1 waiver status; 91 FR 48268 for TANF cites. Agency guidance, regulation text.

## Open questions only a policy person or a State can answer

1. Does "household" in § 435.554(c)(7) mean the SNAP household as the SNAP agency set it? The preamble points there (91 FR 33407, 33370) [FR preamble, V per L2 and L7; I read 33407 only through L7's line cite, U]; CMS has not said so. CMS.
2. Colorado aligns the CE form's due date with the renewal due date [State draft rule, V]. If that gives more than 30 days, how does it fit 91 FR 33411, which says the 30 days cannot be extended [FR preamble, V]? HCPF.
3. Colorado: does the review window end when ex parte review starts (draft rule, per L5) or at the renewal due date, as § 435.556(a)(2)(i) says [regulation text, V]? HCPF.
4. Colorado: member copy says "complying" for SNAP and "paid work" for income; the draft rule says not exempt and MAGI household income [State agency page and draft rule, V]. Which will workers apply? HCPF and CDHS.
5. Colorado: no hardship election found (0 mentions in the draft rule, counted), and the SUD clause covers recovery stages only [State draft rule, V]. Intended? HCPF.
6. Nebraska counts 30 days from the notice date [State plan, V] and Georgia from issuance [State agency notice, V]; § 435.558 counts from receipt, presumed 5 days later [regulation text, V]. HourKeep can show the printed date; the State must say which governs.
7. New Hampshire bars self-attestation [State statute, V]; § 435.557(b)(2)(iii) requires accepting other information when no documents are reasonably available [regulation text, V]. How does NH reconcile them? NH DHHS or a policy person.
8. Indiana names the three months before the renewal month [State agency page, V]; § 435.556(a)(2) says whether or not consecutive [regulation text, V] and CMS says a State may not dictate the months [IFC deck s29, V]. FSSA or a policy person.
9. Oklahoma says the disaster event needs federal approval [State agency page, V]; § 435.555(d)(2) asks only CMS notice for NEA emergencies [regulation text, V]. OHCA.
10. Which § 1115 populations pass SMD 26-001's whole-group test (Utah adult expansion, Georgia, Wisconsin) [agency guidance, V]? CMS and States.
11. Is Georgia Pathways extended past 2026-12-31 [agency guidance, V]? CMS and DCH.
12. Will CMS issue the five-year SUD claims lookback it anticipates [agency guidance, V], and in what instrument? CMS.
13. Which transition option did each State take? Montana's table shows Option 1 [State agency page, V]. States.
14. After the 2026-10-22 hearing: vacatur for all States or relief for 26 plaintiffs only [party filings, V]? A State profile may need a litigation field. The court.
15. MACPro guide: at more-frequent checks, must months equal renewal months or only not exceed them [agency guidance, V]? CMS.
16. Can months lived in 2026 be required, not just credited, at early-2027 renewals [L4's KY and WI examples, U]? CMS.
17. SNAP: does "under 18, or over 65" in the statute leave a 65-year-old subject, against FNS's 18-64 reading [statute, V; FNS reading per L7, U]? FNS.
18. TANF: the preamble says not to rely on the person's report, yet to ask the person when TANF data is missing [FR preamble per L7, U]. CMS.

## What I did not verify

- Politico's list; Ohio's Group VIII page; Oklahoma's draft rule; Oregon's attestation page; Montana's manual CMA 310-1.
- Massachusetts v. Oz ECF 103-1, the proposed order, absent from RECAP storage (404); anything filed after 2026-10-08 that
  RECAP has not indexed. PACER was not used.
- CMS's guidance database listing, renew-info Spanish pages, the 3/24 all-State call transcript, CMS's fact sheet.
- 42 CFR 431.221(d) and SSA 1902(e)(5); the Alaska and Hawaii 138% figures.
- L6-7 and L6-18. Counts I did not recompute: L4's 21 and 15 States, L5's 12 Colorado PDFs, L6's 16 taglines.
- Whether every derived-file cite uses the corrected § 435.557 labels (L1 says so; I did not re-read each line).

## Scratch

I worked in `.agents/policy-research-2026-10-16/scratch-verify/` (downloaded public PDFs and pages, text extracts, a
PDFKit helper, fetch and tally helpers) and deleted that folder and its contents before finishing. None of it is
cited; the citations point at public URLs, docket entries or repository lines.
