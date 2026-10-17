# L2 cms-guidance: CMS and CMCS publications on Medicaid community engagement

Lane L2 of the 2026-10-16 policy research task. Read-only against the repository. Everything below was retrieved on 2026-10-16.

Skills: the session listed skills by name (hhs-benefits, project-docs, review, stack, writing-code). I loaded hhs-benefits through the skill tool and also read `.kiro/skills/hhs-benefits/SKILL.md` and `AGENTS.md` directly.

Access: medicaid.gov returned HTTP 403 to curl and to the fetch tool. A shared Playwright browser worked until it disconnected partway through the session and did not come back. By then I had saved 31 medicaid.gov PDFs and all 51 renew-info pages. cms.gov and govdelivery.com pages were read with the fetch tool. Paging numbers (s12, p. 6) refer to slides or PDF pages.

Tiers: statute, regulation, preamble, agency guidance, court filing, secondary. Verified means read in the primary source on 2026-10-16, with the location given. FR page numbers for the IFC come from `docs/domain/cms-2454-ifc/2026-11094.txt`.

## Summary

1. ADDITION. No community-engagement CIB, SMD letter or SHO letter has issued since the IFC, and the guidance database holds no CE FAQ. Its 40 newest items run from 2025-01-16 to 2026-10-09, and the only CE items are the IFC and the CIBs of 2025-11-18 and 2025-12-08 (E1).
2. ADDITION. SMD 26-001 (2026-03-06) is CMS's guidance on six-month renewals under SSA 1902(e)(14)(L). The corpus calls six months "sourced elsewhere" and never cites it (state-options.md:235, what-matters-most.md:683-686, rule-extract.md:856-863), though the IFC cites it at 91 FR 33416 fn 107 (E2).
3. CORRECTION. "Does not reach ... most § 1115 enrollees" (state-options.md:129, :235; what-matters-most.md:685; rule-extract.md:861) states the wrong test. SMD 26-001 exempts AI/AN, other groups, and partial-expansion demonstrations only; people described in (VIII) who are covered through a waiver of the whole (VIII) group do get six-month renewals (E2).
4. ADDITION. The move to six-month renewals is a State election the profile does not carry. Option 1 reschedules already-set 2027 renewal starts (no earlier than 2027-01-01, in practice 2027-01-04); Option 2 keeps them. Under Option 1 long-enrolled adults can get their first CE review in January 2027, so "for many is mid-2027" (what-matters-most.md:711) is too reassuring without naming the State's option (E2).
5. ADDITION. Shortening a 12-month period to six months, or moving someone into the adult group at renewal, is an adverse action that needs 10 days' advance notice and fair hearing rights. States may not start six-month renewals before 2027-01-01. The six-month SPA is due by 2027-03-31 (E2).
6. STALE. state-options.md:309 says the SPA template is "currently under development." The MACPro implementation guide for the "Community Engagement for Certain Adults" reviewable unit is published (file dated 2026-08-11) and lists each election (E3).
7. ADDITION. The guide says caretaker-relative relationships come from the State's existing Parents and Other Caretaker Relatives SPA page, so `extendedCaretakerRelativeRelationships` (state-options.md:91, :222) has a known source. Its instructions also contradict themselves on months required at more frequent verifications (E3).
8. ADDITION. CMS's medical frailty deck (2026-09-08) adds an optional three-tier framework, a Tier 3 documentation list and a data-source list, and says CMS anticipates allowing a five-year claims lookback for SUD recovery. `frailtyListStructure` (state-options.md:162) has no tiered value (E4).
9. CONFIRMED. The frailty deck and IFC deck restate the corpus on the functional gate for all five frailty categories, no State-added categories, the IOM definition, the 12-month paid, pended or denied claims lookback, and self-declaration once per enrollment period from 2028 (E4, E5).
10. CONFIRMED. Relapse self-identification for the SUD frailty category is preamble at 91 FR 33374, which closes one "not verified" item at what-matters-most.md:697 at preamble tier (E5).
11. ADDITION. The IFC deck (2026-07-27) names 13 demonstration-only populations in 8 States. That moves the 1115 part of the 44-jurisdiction composition, labelled secondary at what-matters-most.md:616, to agency guidance (E5).
12. ADDITION. The IFC deck adds: the SNAP exclusion covers general and time-limit work requirements; GFE initial approvals run 6 months at most; managed care plans may not track activities or send noncompliance notices; excluded people are not reverified between renewals (E5).
13. ADDITION. CMS's own beneficiary pages contradict the regulation on SNAP. 42 of the 44 CE pages under medicaid.gov/renew-info say people "already meet" SNAP work requirements. § 435.554(c)(7) says "not exempt from", and the IFC deck, CMS fact sheet and MACPro guide say "subject to". The corpus reading stands (E6).
14. ADDITION. Other renew-info divergences from the regulation: income framed as "earning"; frailty bullets without the functional gate; "recovery program"; "qualify for" Medicare Part B; "given birth"; a narrower AI/AN line; Alaska and Hawaii pages show the 48-State income figure (E6).
15. CONFIRMED. renew-info has 7 "no new requirement" pages (AL, FL, KS, MS, SC, TX, WY) and 44 CE pages, matching the corpus's 44 jurisdictions and out-of-scope list. GA, TN and WI differ from the template. Each of the 44 links its own Unite Us resource directory (E6).
16. ADDITION. CMS focus-group research (four expansion States, April 2026) says to avoid the words "community engagement", ranks trusted channels, and names personalized exclusion checklists and step-by-step reporting as top needs. Spanish materials use "requisitos de trabajo" (E7).
17. ADDITION. CMS has published no model notice of noncompliance. The PRA bulletin (2026-06-12) and the burden analysis (91 FR 33436, 33441) expect each State to write its own templates. CMS's model consumer pieces are a fact sheet, a fillable flyer and social posts (E8).
18. STALE. rule-extract.md:939-951 reports that Emmy "may be discontinued". CMS's Emmy page says CE modules are piloting in one State with more pilots possible in 2027, and the Federal Data Services Hub now offers education-enrollment and VA disability data for ex parte use (E9).
19. CORRECTION. what-matters-most.md:277 calls the community-service record list "CMS's verification guidance". The source is the IFC preamble, 91 FR 33400. Tier label only (E10).
20. ADDITION. state-options.md:159 says a State "may reverify more often" for frailty. The preamble (91 FR 33397) and IFC deck s29 bar more-frequent verification of excluded people unless the State has information that the status may be ending (E10).
21. OPEN. No CMS document defines "household" in § 435.554(c)(7). The preamble points States to SNAP agency data on household eligibility and exemption status (91 FR 33407) and quotes the SNAP household definition (91 FR 33370). Both point to the SNAP household (E11).
22. OPEN. I found no public list of approved good-faith-effort exemptions. A May 2026 Michigan agency deck (secondary) reported CMS would not offer them; the IFC and deck describe a narrow, case-by-case process (E12).
23. OPEN. Two CMS resources were found by reference and not read: the Medicaid and CHIP Policy Implementation Roadmap (April 2026) and "Key Functional Requirements for Community Engagement Implementation" (September 2026) (E13).

## Evidence

### E1. What CMS has published, and when

The federal policy guidance database at https://www.medicaid.gov/federal-policy-guidance showed 1,121 entries. I read the four newest pages, 40 items from 2025-01-16 to 2026-10-09. Items after the IFC: SMD 26-003 (2026-06-11, 1115 budget neutrality), CIBs of 2026-07-07 (fast-track rescission), 2026-07-14 (parole terminations) and 2026-09-25 (Basic Health Program), CMS-2452-P (2026-07-21), CMS-2451-F (2026-08-11), SMD 26-004 (2026-10-06) and SMD 26-005 (2026-10-09). None is about community engagement. [agency guidance; Verified]

| Date | Publication | URL | Read |
|---|---|---|---|
| 2025-11-18 | CIB, WFTC summary of Medicaid and CHIP provisions | https://www.medicaid.gov/federal-policy-guidance/downloads/cib11182025.pdf | 71107 and 71119 sections |
| 2025-12-08 | CIB, Section 71119 CE requirements | https://www.medicaid.gov/federal-policy-guidance/downloads/cib12082025.pdf | 13 pages searched, 21 passages read |
| 2025-12-08 | CE overview slide deck, companion to the CIB | https://www.medicaid.gov/medicaid/downloads/community-engagement-overview-slide.pdf | slide titles only |
| 2026-01-23 | CIB, 2026 federal poverty level standards | https://www.medicaid.gov/federal-policy-guidance/downloads/cib01232026.pdf | all |
| 2026-03-06 | SMD 26-001, six-month renewals (section 71107) | https://www.medicaid.gov/federal-policy-guidance/downloads/smd26001.pdf | pp. 3-14 |
| 2026-01-27 to 2026-09-15 | Eight all-State calls; index at https://www.medicaid.gov/resources-for-states/cmcs-medicaid-and-chip-all-state-calls/cmcs-medicaid-and-chip-all-state-calls-2026 | per call under /resources-for-states/downloads/ | all slide titles; 3/24 transcript Q&A |
| 2026-05 (files 2026-05-22) | Fillable flyer (CMS Product 12232), social media toolkit, Qualitative Research Communication Summary | https://www.medicaid.gov/resources-for-states/working-families-tax-cut-legislation/community-engagement/community-engagement-outreach-materials | all English |
| 2026-06-01 | CMS fact sheet on the IFC | https://www.cms.gov/newsroom/fact-sheets/medicaid-community-engagement-requirement-certain-individuals-interim-final-rule-comment-period-cms | all |
| 2026-06-09 and 2026-07-02 | Spanish fact sheet, toolkit, flyer, research summary | same outreach page | research summary, fact sheet |
| 2026-06-12 | CMCS bulletin on the eight PRA packages | https://content.govdelivery.com/accounts/USCMSMEDICAID/bulletins/41bb788 | all |
| 2026-07 (file 2026-07-02) | Fact sheet "Medicaid Changes are Coming!" (CMS Product 12233) | .../community-engagement/resources/community-engagement-fact-sheet_508-1.pdf | all |
| 2026-07-27 | IFC overview slide deck, 50 slides | https://www.medicaid.gov/medicaid/downloads/ce-requirement-ifc-deck.pdf | roughly 24 slides in full, rest by title |
| file 2026-08-11 | MACPro implementation guide, Community Engagement for Certain Adults | https://www.medicaid.gov/resources-for-states/downloads/macpro-ig-community-engagement-certain-adults.pdf | all 10 pages |
| 2026-09-08 | Implementing Medical Frailty deck, 33 slides | https://www.medicaid.gov/resources-for-states/working-families-tax-cut-legislation/community-engagement/ImplementingMedicalFrailtyDeck.pdf | all |
| undated | renew-info index and 51 State pages | https://www.medicaid.gov/renew-info, then /renew-info/CO and so on | all 51 |
| undated | Emmy page | https://www.cms.gov/medicaid-chip/community-engagement-support/eligibility-made-easy | all |

The CE resource page (https://www.medicaid.gov/resources-for-states/working-families-tax-cut-legislation/community-engagement) lists the frailty deck, IFC deck, IFC, fact sheet, press release, both CIBs, the overview deck, five vendor items from January and February 2026, the TA mailbox MedicaidWorks@cms.hhs.gov and Emmy. It does not link the MACPro guide, which I found by search. [agency guidance; Verified]

### E2. SMD 26-001 and the six-month renewal

All from SMD 26-001 unless marked. [agency guidance, implementing statute SSA 1902(e)(14)(L); Verified]

- Who: almost everyone in the (VIII) adult group under the State plan, plus people described in (VIII) who are covered "under a waiver" that gives MEC to all (VIII) individuals (pp. 3-4). Not covered (p. 4, and p. 3 fn 7): AI/AN described in 1902(xx)(9)(A)(ii)(II); all other MAGI groups, which stay at 12 months with no option to go to six; non-MAGI groups; and (VIII)-described people in a State that covers them only through a partial-expansion demonstration. The SMD names no State. Wisconsin's renew-info page puts its income line at 100% FPL, which fits fn 7.
- The corpus line at state-options.md:129 ("12 for AI/AN and most 1115") and its repeats would set any 1115-only population to 12 months. The SMD test is whether the waiver covers the whole (VIII) group. A per-State profile built on the corpus rule could tell a full-expansion-by-waiver enrollee their renewal is a year away when it is six months. Which 1115 populations pass the test is not something I verified.
- Statute and IFC fit together this way: the IFC restored § 435.916 to its June 2, 2024 text because of the section 71102 moratorium (preamble, 91 FR 33352), and that text says 12 months. The statute overrides it for the adult group from renewals scheduled on or after 2027-01-01. SMD 26-001 applies § 435.916 (2023) for the renewal steps: ex parte first, a prepopulated form, at least 30 days to return it, all bases considered, 10 days' advance notice and fair hearing rights (pp. 5-6).
- Every adult-group member gets six-month renewals whether or not CE applies to them (p. 5).
- New applicants with coverage effective on or after 2027-01-01 get a six-month period; retroactive months do not count toward it, and section 71112 limits adult-group retroactive coverage to one month for applications from 2027-01-01 (p. 6 and fn 16).
- Transition options for people already enrolled on 2027-01-01 (pp. 7-10). Option 1: move already-set 2027 renewal initiation dates earlier, never before 2027-01-04 in practice, to get close to six months from the last determination. Option 2: keep the already-set 2027 dates and grant six months at that renewal. In Example 2 a person with a May 2026 to April 2027 period has a renewal initiated 2027-01-04. Because § 435.559(c) keys the first CE assessment to the first renewal initiated on or after implementation, that renewal includes CE.
- Shortening a period is an "action" under § 431.201, so 10 days' advance notice with fair hearing rights (p. 9). Moving from a 12-month group to the adult group at renewal is also an action, and the State must evaluate CE as part of it; Example 6 is a postpartum enrollee (p. 11).
- Household members can have different renewal dates, and States may not shorten or extend periods to line them up (pp. 10-11). Multi-benefit renewal forms may not hold up Medicaid for SNAP-only questions (p. 12).
- A MACPro reviewable unit for the six-month SPA was targeted for the second half of 2026; SPAs are due by 2027-03-31 (p. 12). Questions go to MedicaidReforms@cms.hhs.gov (p. 14).
- 3/24/2026 all-State call transcript, CMS staff at about 29:03: States cannot start six-month renewals early, unlike CE. At about 33:34: moving to a six-month period is treated as adverse and needs advance notice whenever it happens. [agency guidance, oral; Verified, https://www.medicaid.gov/resources-for-states/downloads/covid19transcript03242026.pdf]

### E3. MACPro implementation guide for the CE State plan page

[agency guidance; Verified, all 10 pages; file Last-Modified 2026-08-11]

- Elections a State makes: A.1 adult group and/or named 1115 populations; C.1 short-term hardship yes or no; D.2 application lookback of 1, 2 or 3 consecutive months; D.4 renewal months, 1 or a number from 2 to 12; E.1 more frequent verification yes or no, E.2 every 3 months or every 1, 2 or 4 to 12 months, E.3 months required; F.3 which "unable to verify" option at renewal. This is the source state-options.md:309 says it lacks.
- B.3.c.i: the relationships a State elected on its Parents and Other Caretaker Relatives page apply to the caretaker-relative exclusion. No separate CE election exists for it.
- Inconsistency inside the guide: the background says months required at a more frequent verification "generally should not be greater" than at renewal, while the E.3 note says they "must be the same" as D.4.b. Encode neither until CMS resolves it.
- Income is checked with MAGI methods, including a State's reasonably predictable changes method if elected, which sits in a separate MAGI-Based Methodologies page (A.3). The guide shows no election for the income-to-hours proxy at § 435.552(e)(2). I saw the instructions only, not the form screens.
- The SNAP line reads "subject to a SNAP work requirement". Veterans read "total (100%) ... (temporary or permanent)", which does not mention TDIU; the corpus's TDIU point at what-matters-most.md:138 rests on the preamble and is not contradicted.

### E4. Implementing Medical Frailty deck, 2026-09-08

[agency guidance; Verified, 33 of 33 slides; file Last-Modified 2026-09-04]

- The functional gate applies to all five categories, and States get no flexibility to add populations (s4). The CE definition is not the ABP definition and must be used for CE (s4). Serious or complex medical condition follows the IOM report (s5).
- The condition list must be auditable, justifiable and consistent with the definition, revised regularly, with a request path for unlisted conditions (s7).
- Verification (s8): claims adjudicated in the prior 12 months, paid, pended or denied, encounter data, and other health data such as HIE data. Before 2028-01-01 a self-declaration under penalty of perjury may be accepted each time. From 2028-01-01, once per period of enrollment, defined as continuous enrollment without disenrollment; at the first renewal after that the State must use data or documentation. Reverify at least every 12 months.
- Optional three-tier framework (s12): Tier 1, ICD-10 codes alone show significant impairment (examples s18: ESRD, ALS, pancreatic cancer); Tier 2, a listed condition plus utilization or functional data; Tier 3, too little data, so manual review and possibly documentation.
- States may check exclusions they can see in their own systems first, such as parent of a child 13 or under, pregnancy and AI status, before frailty (s10). This supports ordering a screener the same way.
- Data sources (s14): FFS claims, managed care encounters, HIE or EHR data, health data utilities, workers' compensation and short-term disability claims, all-payer claims databases. A non-medical code alone, such as a homelessness Z code, cannot establish frailty (s16).
- Tier 3 documents a State may ask for (s20): medical history, treatment records, progress notes, discharge papers, medication lists, lab results, provider documentation or certification, managed care care-management information, level-of-care or functional assessments. This is a ready list for an evidence package.
- SUD (s31): stable recovery means 5 or more consecutive years. The 12-month lookback in § 435.557(f)(1) makes that hard to check, and CMS says it anticipates allowing a five-year claims lookback despite the 12-month rule. That is a stated intention, not a rule.
- `frailtyListStructure: "unknown" | "flat" | "automatic-plus-case-by-case"` (state-options.md:162) has no value for a three-tier State.

### E5. IFC overview deck, 2026-07-27

[agency guidance; Verified for the slides cited]

- s9: 13 demonstration-only populations in 8 States are subject to CE: GA Pathways and ESI/HIPP; HI QUEST Integration populations 1, 4 and 5; MA MassHealth e-HIV/Family Assistance and TANF/EAEDC; NY MRT TANF; OR Youth with Special Health Care Needs; TN TennCare III parent and caretaker relative expansion; UT adult expansion and targeted adults; WI BadgerCare childless adults. CMS calls its review ongoing. This matches the corpus's State list.
- s8: people in 1915(b) or (c) waivers, or in demonstrations with only 1115(a)(1) authority or (a)(2) authority for services, are applicable only if also in the adult group or a relevant (a)(2) population.
- s18: the SNAP exclusion covers households receiving SNAP whose member is subject to "general or time limit" work requirements. The regulation text (91 FR 33472) says "not exempt from a work requirement"; the preamble (91 FR 33377) reads that as "subject to" and says States need not check compliance.
- s36: a self-declaration can take the form of a screening tool; preamble 91 FR 33406 says the same. Relapse: preamble 91 FR 33374 says States need processes for people to self-identify for the SUD category, including after a relapse.
- s42: CMS expects initial GFE approvals of no more than 6 months, with extensions possible to 2028-12-31, quarterly reports, and early termination for missed reports. Preamble 91 FR 33418 says the same.
- s47: plans may do outreach, share data such as frailty status, and refer people to work programs. They may not track or collect work, service or education information, or issue noncompliance notices. Not in the corpus, which has only § 438.58(b) at rule-extract.md:846.
- s28: each review period includes the month in which the verification is due. s29: excluded people's status is not checked more often than at each renewal.
- Already in the corpus and restated: outreach to every adult-group enrollee, timed in the 4th, 5th or 6th month before compliance starts (s44; rule-extract.md:952-956); mail plus one more modality (s45; rule-extract.md:830-831); the 45-day timeliness exception at application (s39; rule-extract.md:771-772); 30 calendar days from receipt and disenrollment by the end of the following month (s38); the 55 plus 25 caregiver example (s14); the credit-hour formula and federal minimum wage only (s12, s13).
- s48 lists the PRA packages: SPA template CMS-10434 #15, application updates CMS-10410, MAGI verification plan CMS-10398 #11, hardship requests CMS-10398 #101, GFE CMS-10398 #100, reporting CMS-10434 #66, CMS-10398 #35 and T-MSIS CMS-R-284.

### E6. medicaid.gov/renew-info beneficiary pages

[agency guidance, beneficiary-facing; Verified, 51 of 51 pages saved and compared by script]

- The index asks for a State from a list of 50 States and DC and says the rules do not apply in the 5 territories. Pages live at /renew-info/XX. The Spanish fact sheet points to /renew-info/es, which I did not open.
- 7 pages say there is no new requirement: AL, FL, KS, MS, SC, TX, WY. 44 carry CE content. After masking program and exchange names, 41 are identical. Variants: GA says current Pathways members see no change until a renewal period on or after 2027-01-01; TN says only a small group is subject, that TennCare can verify them from income it already holds, and that most people need do nothing; WI sets the income line at 100% FPL.
- 42 pages (all CE pages except GA and TN) carry a 13-bullet "Who This Doesn't Impact" list and a "Who This Impacts" list: age 19 to 64 and household income up to 138% FPL, about $22,025 for one person.
- Divergences from the regulation, with the direction each one cuts:
  - "You already meet SNAP ... or TANF ... work requirements." Right for TANF (§ 435.554(c)(6)), wrong for SNAP (§ 435.554(c)(7)). Cuts against the person: someone subject to SNAP rules but not meeting them reads themselves out of an exclusion. The known blueprint error at medicaid-work-requirements-cfa-service-blueprint.md:68 says the same thing CMS's page says, so the fix should not copy CMS's wording.
  - "Working (or earning at least $580 a month)" on all 44. The regulation uses MAGI household income, earned and unearned (§ 435.552(f)(2); the deck s13 says the same). Cuts against people whose household income, not their own wages, clears $580.
  - The frailty bullets (blindness or a physical, intellectual or developmental disability; a substance use disorder or serious mental health condition) leave out the functional gate. Cuts toward false reassurance.
  - "SUD treatment program or recovery program" is wider than a treatment and rehabilitation program under 7 U.S.C. 2012(h). False reassurance.
  - "have or qualify for Medicare (Part A ... and/or Part B ...)" is wider than § 435.553(a)(2), which needs enrollment for Part B. False reassurance.
  - "given birth in the last 12 months" is narrower than postpartum coverage under 1902(e)(5) or (e)(16), which follows any end of pregnancy. Against the person.
  - "a member of an Indian or Urban Indian Tribe" leaves out California Indians and IHS-eligible people covered by 42 CFR 447.51. Against the person.
  - The AK and HI pages show the 48-State figure of $22,025. From the 2026-01-23 CIB's QMB limits, 138% of the one-person guideline is roughly $27,500 in Alaska and $25,300 in Hawaii (derived, approximate). Against the person.
- What CMS tells people to do on all 44 pages: update contact details, watch mail and email, keep a monthly record of work, volunteer, training or school hours starting now, follow up with the State, and gather medical or legal documents in case they need to show an exclusion. If coverage ends, they can reapply at any time and may lose premium help on the Marketplace. CMS is telling people to do the record-keeping HourKeep is built for.
- Each of the 44 pages links a Unite Us "Public Resource Directory" at communityengagementXX.resources.uniteus.io, 44 distinct URLs, plus FindHelp, DOL job seekers and Volunteer.gov.

### E7. CMS focus-group research and outreach kit

[agency guidance; Verified, https://www.medicaid.gov/resources-for-states/working-families-tax-cut-legislation/community-engagement/resources/Community-Engagement-messaging.pdf, 2 pages, file dated 2026-05-22]

- Focus groups with current beneficiaries in four expansion States in early April 2026. Almost nobody had heard of the requirement. Many could not tell whether they were exempt, who decides, or whether to report it. Uncertainty was highest for people with a chronic illness but no SSA disability finding, and for caregivers.
- Terms: use "work requirements" and list the options under it; avoid "community engagement" and "community participation", which participants did not recognise. Avoid "may affect", "stay engaged" and "may help you keep your Medicaid", which sound optional.
- Trusted channels, ranked: member services line, State or county offices, clinics, community organizations, then mail or text, with text trusted only when paired with mail.
- Needs: plain language naming Medicaid or the State program, accurate personalized information preferably from a person, personalized exclusion checklists, trusted community organizations, step-by-step reporting instructions. The appendix lists the questions people asked, including whether hours roll over between months and who may confirm hours (employer, pastor, volunteer supervisor, self-attestation).
- The Spanish summary is a translation of the same study. It uses "requisitos de trabajo" and "requisitos laborales" and advises avoiding "compromiso comunitario" and "participación comunitaria". The Spanish fact sheet renders the tribal line as "afiliados a una tribu indígena urbana", which drops "Indian or", and household income as "ingreso familiar". [agency guidance; Verified]
- Fact sheet (Product 12233, July 2026): most States would send a letter or message by late summer or early fall; exclusions are summarised loosely as "disabled" and "enrolled in Medicare". Flyer (Product 12232, May 2026): fillable date, website and phone fields; says the requirement can also be met by earning $580 or half-time school. Social toolkit (May 2026): nine posts, customisable. [agency guidance; Verified]

### E8. Notices and model notices

- No CMS model notice of noncompliance or outreach notice turned up in the guidance database, the CE pages, the outreach page or search. [agency guidance; Verified as absent from the places listed]
- The PRA bulletin of 2026-06-12 says States must develop or update outreach and noncompliance notice templates under CMS-10410, and update their single streamlined application, renewal materials and presumptive eligibility forms. The burden analysis budgets 112 hours per jurisdiction to develop or update outreach and noncompliance notice templates and estimates that 75% of beneficiaries have not elected electronic notices (91 FR 33441); hardship notices get a separate 112 hours (91 FR 33436). [agency guidance and preamble; Verified]
- Notice content the corpus already holds (§ 435.558(c)(1), § 435.561(c)) matches the IFC deck s38, s39 and s45. SMD 26-001 adds a notice the corpus lacks: the advance notice when an eligibility period is shortened or a person moves into the six-month group (E2).
- CMS-10410 itself, which may contain a revised model application with CE questions, was not read.

### E9. Emmy, data matching and ex parte

[agency guidance; Verified, https://www.cms.gov/medicaid-chip/community-engagement-support/eligibility-made-easy]

- The Federal Data Services Hub offers new sources for federal education enrollment and VA disability data, for eligibility and ex parte renewals.
- Emmy App CE modules are piloting with one State, with more pilots possibly in 2027. The income module is piloting in a few States and is open source; States pay to host it and to buy a payroll data provider. The page also says CMS cannot run new pilots while it explores adding CE modules. rule-extract.md:939-951 (verified there on 2026-08-16) expects possible discontinuation; the CMS page does not.
- Other data-matching points: the 2025-12-08 CIB names data on higher education enrollment, job training and community service as reliable sources (p. 8); the IFC deck s32 requires States to document data sources in a verification plan, now a CE supplement to the MAGI verification plan (CMS-10398 #11); the frailty deck lists clinical sources (E4). Medicaid renewals in October 2025: 5.8 million due, 71% renewed, 19% disenrolled, 10% pending (2/24/2026 call, s24). [agency guidance; Verified]

### E10. Two small corpus fixes

- what-matters-most.md:277 attributes the organization name, address and contact phone or email to "CMS's verification guidance". The text is IFC preamble at 91 FR 33400. [preamble; Verified]
- state-options.md:159 ("a State may reverify more often"). Preamble 91 FR 33397 says people found excluded at their last verification are not subject to more frequent verifications unless the State has information they may be losing the status, such as turning 19, citing § 435.557(d)(4). The 2026-06-29 correction republished § 435.557 with shifted paragraph labels, so that cite may now point elsewhere. [preamble and agency guidance, IFC deck s29; Verified, paragraph label Unverified]

### E11. What "household" means in § 435.554(c)(7)

- No CMS guidance document defines it. The IFC deck s18, the fact sheet and the MACPro guide all repeat "household that receives SNAP". [agency guidance; Verified]
- Preamble 91 FR 33407: States must get information from the SNAP agency, and many can verify from "SNAP household eligibility" and exemption status. Preamble 91 FR 33370, in the caregiver discussion, gives the SNAP household definition from 7 CFR 273.1: people who live together and buy and prepare meals together. [preamble; Verified]
- Reading: the SNAP household as the SNAP agency determined it, not the MAGI household of § 435.603. This is an inference from preamble, and it matters for people who share a home but are not on the SNAP case. Label it OPEN until CMS says so directly.

### E12. Good-faith-effort exemptions

- The 2025-12-08 CIB (p. 11) says approvals will be case by case and expected only for States making real efforts that hit severe or unexpected problems. [agency guidance; Verified]
- The IFC deck s42 and preamble 91 FR 33418: initial approvals up to 6 months, extensions to 2028-12-31 at most, quarterly reports. [agency guidance and preamble; Verified]
- A Michigan MDHHS deck of 2026-05-11 says CMS had indicated it would not offer a good-faith exemption or allow delay; the same deck says Michigan elects one month. https://www.cmhcm.org/userfiles/filemanager/r3esg0qxprh13m5thyhe/ p. 3. [secondary, pre-IFC; Verified]
- No CMS list of requests or approvals found. `goodFaithEffortExemptionThrough: null` remains the right default.

### E13. Found by reference, not read, and the remaining calls

- Calls with no CE policy content: 2026-01-27 (Rural Health Transformation, incarceration suspension under CAA 2024 section 205, 1915(c)(11)); 2026-05-27 (state directed payments, EPSDT guide, and an announcement of the CE outreach toolkit, s23-24); 2026-09-15 (HCBS program integrity, ABA toolkit, MES RFI). [agency guidance; Verified by slide titles]

- Medicaid and CHIP Policy Implementation Roadmap, high-level and detailed timelines, presented on the 2026-04-28 call; one file is https://www.medicaid.gov/medicaid/downloads/high-level-timeline-view.pdf.
- "Key Functional Requirements for Community Engagement Implementation", an updated systems resource marking minimum viable product capabilities, announced on the 2026-09-15 call (s57). Location not found.
- Section 71107 slide deck, https://www.medicaid.gov/medicaid/downloads/elig-redet-section-71107-deck.pdf, likely the same as the 3/24 call slides.
- The 2026-07-28 call covered the provider-tax proposed rule and beneficiary fraud sanctions (s19-26: no recoupment from beneficiaries; advance notice can drop from 10 to 5 days in verified fraud cases). No CE content. The 2026-06-23 call covered 1115 budget neutrality and has no transcript.

### E14. The two CIBs the IFC built on

- 2025-11-18 CIB: statute summary. It said section 71107 guidance was due by 2025-12-31; SMD 26-001 came on 2026-03-06. Footnote 43 says the CE definition reaches 1115 demonstrations that cover all or only some (VIII) individuals. Read with SMD 26-001 fn 7, a partial-expansion demonstration is inside CE but outside six-month renewals; that Georgia's and Wisconsin's fall there is my inference. [agency guidance; Verified, inference labelled]
- 2025-12-08 CIB: statute summary before the IFC. People subject to both provisions would show CE at least every six months at each renewal (p. 8). Footnote 5 promised clarification of the SNAP and TANF exclusion, which the IFC supplied. Nothing in it contradicts the corpus; where it and the IFC overlap, the IFC governs. [agency guidance; Verified]

## Scratch files

Deleted from `.agents/policy-research-2026-10-16/scratch-L2/` before finishing: 32 downloaded PDFs, their text extractions, 51 saved renew-info pages, a notes file and a Swift PDF-text helper. Nothing there is cited; every citation above is a public URL or a repository file and line. The empty `scratch-L2` folder was left in place.

## Could not verify

- The medicaid.gov FAQ database (https://www.medicaid.gov/faq) was not searched for CE entries; the browser disconnected first. The guidance database shows no CE FAQ through 2026-10-09.
- The Spanish renew-info pages at /renew-info/es.
- The two roadmap files, the Key Functional Requirements resource and the 71107 deck (E13).
- The contents of the CMS-10410 and CMS-10398 #11 PRA packages, including any model application questions or verification plan supplement.
- Whether any State has requested or received a good-faith-effort exemption.
- Which 1115 populations pass SMD 26-001's whole-group test, Utah's adult expansion population in particular.
- Whether CMS has issued the five-year SUD lookback it anticipates, and in what form.
- The current paragraph label of the § 435.557(d)(4) cite after the 2026-06-29 correction.
- The 2025-12-08 overview deck and the Spanish toolkit and flyer beyond titles and term searches; 2025 all-State calls after July 2025 were not reviewed.
- The figure of 44,364 public comments on the IFC appeared only in a federalregister.gov search snippet.
- Alaska and Hawaii income figures are derived from QMB limits, not read from the HHS guidelines.
