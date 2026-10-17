# Should HourKeep v2 support SNAP work requirements?

Research report, 2026-10-15. Read-only investigation for HourKeep v2 planning.

Tags on every claim:

- Source tier: [S] statute; [R] regulation text; [G] agency guidance, letters, forms, or agency web pages (federal or
  state); [P] Federal Register preamble; [2] secondary (analysis, news, vendor sites, public comments).
- Status: V = I read it in the named source on 2026-10-15; U = unverified (secondary source, or my inference, which I
  label "inference").
- Medicaid cites are to CMS-2454-IFC, 91 FR 33348 (June 3, 2026), with § 435.557 as corrected at 91 FR 39028 (June 29,
  2026). Local text: `docs/domain/cms-2454-ifc/2026-11094.txt`, cited as IFC.txt:line. FNS documents from June 2026
  onward use the name Food and Nutrition Administration (FNA); I use FNS for older documents and FNA for newer ones.

## 1. Summary answer

- SNAP matters to v2 first because of a Medicaid rule. 42 CFR 435.554(c)(7) removes from Medicaid community engagement
  anyone who is a member of a SNAP-receiving household and is subject to either SNAP work requirement, whether or not
  they are keeping up with it [R·V IFC.txt:4009; P·V 91 FR 33377, IFC.txt:1216-1218]. A Medicaid-only HourKeep that never asks
  about SNAP would tell some of these people to log 80 hours they do not owe. KFF estimates about 1 in 5 adults likely
  subject to Medicaid work requirements also get SNAP [2·U].
- SNAP's own rules are statute plus guidance in October 2026. Public Law 119-21 § 10102, effective July 4, 2025, extended
  the time limit to ages 18-64, cut the child exception to a child under 14, dropped the veteran, homeless, and
  former-foster-youth exceptions, added exceptions for Indians, and limited area waivers to unemployment over 10 percent
  (Alaska and Hawaii: 1.5 times national) [S·V; G·V]. 7 CFR 273.24 on eCFR still shows pre-HR1 text, and the conforming
  proposed rule (RIN 0584-AF09, planned for July 2026) is unpublished [R·V; G·V].
- The activity lists overlap but do not match. Both count paid, in-kind, and unpaid work and the same five work
  programs. Only Medicaid has community service as its own category, credit-hour conversion for part-time school, and
  an income route ($580 a month of household MAGI income). Half-time school needs no hours in either program, but SNAP
  treats it as an exemption with extra student rules. Only SNAP has workfare and good cause for missed hours, and its
  earnings test is individual and weekly ($217.50 a week) and works as an exemption [R·V; S·V].
- One date-level evidence log can serve both programs, but the program views differ. In any month a person is subject
  to SNAP rules in a SNAP-receiving household, Medicaid does not assess them at all (inference from R·V
  § 435.554(c)(7), § 435.556(c), § 435.553(a)(4)).
- Recommendation (section 9): build option (b), Medicaid with SNAP awareness, into v2; design the log so option (c)
  stays cheap; revisit (c) after FNA's rule and CMS's answer on what "household" means; do not build (d).

## 2. SNAP work requirements as of October 2026 (question 1)

### 2.1 Two requirements with different populations

| | General work requirements | Time limit (formerly "ABAWD") |
|---|---|---|
| Who | Physically and mentally fit people aged 16-59 [S·V 7 U.S.C. 2015(d)(1)(A)] | Ages 18-64 per FNS/FNA [G·V FNS exceptions memo Oct 3, 2025; FNA Q&A #1 Q1]. Statute text excepts anyone "under 18, or over 65, years of age" [S·V 2015(o)(3)(A)] |
| Duty | Register for work; do E&T or workfare if assigned; give job information; take a suitable job; do not quit a 30-hour job or cut below 30 hours a week without good cause [R·V 7 CFR 273.7(a)(1)(i)-(vii)] | No more than 3 countable months of SNAP in 36 months unless working 80 hours a month (20 a week, averaged), in a work program 80 hours, a mix of the two, or in workfare [S·V 2015(o)(2); R·V 273.24(a)(1), (b)] |
| Exempt | Complying with TANF work rules, or receiving (or applying for) unemployment compensation; caring for a child under 6 or an incapacitated person; half-time student; regular drug or alcohol treatment; working 30 hours a week or earning federal minimum wage × 30 a week; some 16-17 year olds [S·V 2015(d)(2); R·V 273.7(b)(1)] | Medically certified unfit for work; parent or household member responsible for a child under 14; anyone exempt under 2015(d)(2); pregnant; Indian, Urban Indian, or California Indian [S·V 2015(o)(3) as amended] |
| Consequence | Disqualified at least a month, longer for repeats [G·V FNA work requirements page] | Ineligible "as a member of any household" after 3 countable months; regain by 80 hours in any 30 consecutive days or by becoming exempt; one extra set of 3 consecutive months per 36 months [R·V 273.24(b), (d), (e)] |

People aged 60-64 are now subject to the time limit but not the general rules, and states may not require them to do
mandatory E&T [G·V FNA Q&A #1 Q2-Q4]. A child counts for the under-14 exception only if in the same SNAP household [G·V
Q&A #1 Q6]. SSDI or SSI receipt indicates the unfit-for-work exception; Social Security retirement alone does not [G·V
Q&A #1 Q5].

### 2.2 What § 10102 changed

- § 10102(a) rewrote § 6(o)(3) [S·V `docs/domain/hr1/119hr1enr-title1.md:59-77`]. Upper age went from 54 to 64; the
  child exception went from under 18 to under 14; the Fiscal Responsibility Act exceptions for homeless people,
  veterans, and former foster youth aged 24 or younger were removed (they were due to sunset October 1, 2030 [R·V
  273.24(c)(10)]); Indian, Urban Indian, and California Indian exceptions were added [G·V FNS exceptions memo].
- § 10102(b) removed waivers for areas with "a lack of sufficient jobs" and allowed waivers in a noncontiguous State
  with unemployment at or above 1.5 times the national rate; Guam and the Virgin Islands are not noncontiguous States,
  so this means Alaska and Hawaii [S·V title1.md:78-91]. Other areas need unemployment over 10 percent [S·V
  2015(o)(4)(A)(i)]. FNS will not approve a waiver longer than 12 months and requires BLS data where it exists [G·V FNS
  waivers memo Oct 3, 2025].
- § 10102(c) added § 6(o)(7): good-faith exemptions for Alaska and Hawaii, ending no later than December 31, 2028 [S·V
  title1.md:92-137].
- Not changed: the general work requirements [G·V Q&A #1 Q2] and discretionary exemptions, which stay at 8 percent of
  covered individuals per year since FY2024 [S·V 2015(o)(6)(F); G·V Q&A #1 Q18].
- The CMS preamble confirms the under-14 change and says it aligns with Medicaid's dependent-child age [P·V 91 FR 33369,
  IFC.txt:900-902]. The project's secondary summary misses the age, child, and removed-exception changes [2·V
  `docs/domain/hr1/HR1-Impact-Summary.md:17-34`].

### 2.3 Implementation dates

| Date | Event |
|---|---|
| Jul 4, 2025 | § 10102 effective on enactment; states must screen with the new exceptions at application and recertification [G·V FNS exceptions memo] |
| Sep 4, 2025 | FNS information memo on all SNAP provisions [G·V] |
| Oct 3, 2025 | FNS exceptions memo; FNS waivers memo; letter terminating lack-of-jobs waivers for 19 state agencies (I counted the list) [G·V] |
| Nov 1, 2025 | End of the 120-day quality-control hold-harmless for the exception changes [G·V FNS exceptions memo] |
| Nov 2, 2025 | Planned waiver terminations. A temporary restraining order of October 31, 2025 in *Rhode Island State Council of Churches v. Rollins*, No. 1:25-cv-00569 (D.R.I.), kept them running [2·U news report] |
| Dec 1, 2025 | North Carolina finished its system changes a month late, then applied about 46,050 discretionary exemptions covering about 6,886 people, with notices suppressed [G·V NC DHHS memo, Feb 20, 2026] |
| Feb 26, 2026 | FNS status update: because of the litigation, terminated waivers run to their original end dates; 18 agencies listed (counted), the last ending June 30, 2026 (Minnesota, Montana, North Dakota) [G·V] |
| Jun 11, 2026 | FNA Time Limit Changes Q&A #1 [G·V] |
| Jul 2026 (planned) | NPRM RIN 0584-AF09, "Modification to Work Requirements for Able-Bodied Adults," to codify § 10102 and tighten waiver requests; economically significant [G·V reginfo.gov]. Unpublished as of Oct 15, 2026: the RIN appears only in the Unified Agenda at 91 FR 52792 [V FederalRegister.gov API] |

### 2.4 Has 7 CFR been amended?

No. eCFR Title 7 is current to October 13, 2026, and the newest version of § 273.24 is dated January 17, 2025 [R·V eCFR
versions API]. It still lists the "55 years of age or older" exception, under-18 child exceptions, the homeless,
veteran, and foster-youth exceptions, and lack-of-jobs waivers [R·V 273.24(c), (f)(1)(ii)]. A FederalRegister.gov
search returned 0 documents affecting 7 CFR 273 since July 1, 2025 [V]. SNAP's operative rules are therefore § 10102
plus guidance, and each FNS memo I read carries a footer saying guidance lacks the force of law [G·V]. FNA's public work-requirements page,
updated July 16, 2026, still describes the pre-HR1 rules (ages 18-54, child under 18, veterans, homelessness, foster
youth) under a banner saying new guidance is coming [G·V fna.usda.gov/snap/work-requirements]. Even the agency's
consumer copy is stale.

## 3. What counts toward 80 hours (question 2)

| Activity | Medicaid community engagement | SNAP time limit |
|---|---|---|
| Paid work, self-employment | Yes [R·V § 435.552(a)(1), (b) "work" (i); P·V 91 FR 33354] | Yes, as work for money [R·V 273.24(a)(2)(i)]; how self-employment hours are counted is state practice [U] |
| In-kind work | Yes [R·V § 435.552(b) "work" (ii)] | Yes [R·V 273.24(a)(2)(ii)] |
| Unpaid work, such as an internship | Yes [R·V § 435.552(b) "work" (iii); P·V 91 FR 33355] | Yes, "verified under standards established by the State agency" [R·V 273.24(a)(2)(iii)] |
| Volunteering | Community service is its own pathway: structured program, public or nonprofit, tracks type, dates, hours, and a contact; court-ordered counts [R·V § 435.552(a)(2), (b)] | No separate category; counts as unpaid work [G·V FNA work requirements page]. Standards vary: Ohio counts unpaid help to a community member outside the home [R·V Ohio Adm. Code 5101:4-3-13, eff. Oct 1, 2026], which Medicaid excludes from community service [P·V 91 FR 33356] |
| Work program (WIOA title I, Trade Act § 236, Governor-approved state E&T incl. SNAP E&T, DOL/VA veterans, workforce partnership) | Yes, same list [R·V § 435.552(a)(3), (b); S·V SSA 1902(xx)(9)(D)] | Yes [S·V 2015(o)(1); R·V 273.24(a)(3)] |
| Job search | Only inside a work program and under half its hours [R·V § 435.552(b) "work program" (iii)] | Same rule; CMS adopted it to align with SNAP [R·V 273.24(a)(3)(iii); P·V 91 FR 33356] |
| Unemployment-insurance job search | Counts if done the way a work program requires [P·V 91 FR 33357] | Getting or applying for UC is an exemption, not hours [R·V 273.7(b)(1)(v); 273.24(c)(5)] |
| Workfare | Not addressed: the IFC never uses the word (0 lines, counted); moot while the person is SNAP-subject (section 4.4) | Yes; hours assigned = household benefit ÷ the higher of federal or state minimum wage [R·V 273.24(a)(1)(iv); 273.7(m)(5)(ii)] |
| School at least half-time | Satisfies the month with no hours; cannot be combined [R·V § 435.552(a)(4), (a)(5)] | An exemption, not hours [S·V 2015(d)(2)(C); R·V 273.7(b)(1)(viii)]; college students must also meet SNAP student rules [S·V 2015(d)(2)(C)] |
| School under half-time | Credits × 3 × 4.33 (3 credits = 38.97 hours) [R·V § 435.552(d)] | Counts only inside a work program, such as an E&T education component [R·V 273.7(e)(2)(vi)]; no credit conversion [U] |
| Combination | Up to 80 total [R·V § 435.552(a)(5), (e)] | Work plus work program, 20 hours a week [R·V 273.24(a)(1)(iii)] |
| Caregiving | Exclusion if § 435.554(c)(3) criteria are met [R·V]; a non-relative caregiver living elsewhere who gives under 80 hours can count them as unpaid work [P·V 91 FR 33355] | Exemption for a child under 6 or incapacitated person (general) and child under 14 in the household (time limit) [S·V 2015(d)(2)(B), (o)(3)(C)] |
| Missed hours | No good cause for beneficiaries: the 5 IFC lines with the phrase all concern the APA finding (counted); optional state hardship exception [R·V § 435.555] | Good cause for a temporary absence counts as fulfilled [R·V 273.24(b)(2)] |

Income. Medicaid has an income route: MAGI-based household income of at least federal minimum wage × 80, $7.25 × 80 =
$580, plus a 6-month average for seasonal workers and an optional income-to-hours conversion [R·V § 435.552(a)(6)-(7),
(e)(2), (f)]. SNAP has no income route for the time limit; the statute lists only work, work programs, and workfare
[S·V 2015(o)(2)]. SNAP's nearest equivalent is the general-requirement exemption for working 30 hours a week or
earning federal minimum wage × 30 a week, $217.50, which also excepts the person from the time limit [S·V 2015(d)(2)(E),
(o)(3)(D); R·V 273.7(b)(1)(vii)]. That is about $942.50 a month (217.50 × 52 ÷ 12), about 1.6 times Medicaid's $580, and
it counts the person's own wages, not household MAGI. SNAP workfare uses the higher of federal or state minimum wage;
Medicaid uses the federal rate only [R·V].

## 4. The cross-program link (question 3)

### 4.1 The rule

§ 435.554(c)(7) covers an individual who "is a member of a household that receives Supplemental Nutrition Assistance
Program (SNAP) benefits under 7 U.S.C. 2015 and is not exempt from a work requirement under such Act" [R·V 91 FR 33472,
IFC.txt:4009]. It implements SSA § 1902(xx)(9)(A)(ii)(VI)(bb) [S·V `docs/domain/hr1/119hr1enr.md:9184`].

### 4.2 What the preamble says

- "Not exempt from" means "subject to." Compliance is not the test, and the State need not confirm it [P·V 91 FR 33377,
  IFC.txt:1216-1218].
- Because the statute does not say which SNAP requirement, CMS reads it to cover both. Being subject to the general
  requirements (§ 6(d)(1)), the time limit (§ 6(o)), or both is enough [P·V 91 FR 33377, IFC.txt:1218].
- About 40 percent of Medicaid beneficiaries were also on SNAP in 2019 (ASPE); the exclusion avoids double burden and
  lets states reuse SNAP data [P·V 91 FR 33378]. CMS did not estimate how many people this exclusion covers [P·V
  91 FR 33457].
- States must get SNAP agency information; many already share systems. If SNAP returns nothing, the State must ask the
  individual, and from January 1, 2028 must require documentation when reasonably available [P·V 91 FR 33393, 33407-
  33408]. SNAP and TANF approval notices are CMS's named examples of available documentation [P·V 91 FR 33395].
- The IFC does not define "household" for (c)(7) [V: no definition in § 435.554(a); "SNAP household" appears only at
  91 FR 33370 and 33407]. SNAP households are defined by shared meals [R·V 7 CFR 273.1(a)], not tax filing like MAGI.
  People disqualified for work-rule failures are not members of any household under SNAP rules [R·V 273.1(b)(7)(iii);
  273.24(b)]. CBPP counts a parent cut off SNAP whose child in the home still gets SNAP as excluded [2·U CBPP, updated
  Sept 2, 2026]; an AEI comment asks CMS to limit (c)(7) to the SNAP assistance unit and estimates up to 1.8 million
  people turn on the difference [2·U]. Unresolved.

### 4.3 The TANF exclusion, § 435.554(c)(6)

The test is compliance with State TANF work requirements under SSA § 407 [R·V 91 FR 33472]. CMS sets no uniform
definition, says states should get this from the TANF agency and not rely on reports from the individual, and notes most
TANF adults are already excluded as parents [P·V 91 FR 33377, IFC.txt:1210]. The verification preamble then says to ask
the individual when TANF returns nothing [P·V 91 FR 33408]. TANF users should keep TANF papers anyway.

### 4.4 What it means for someone in both programs (inference from the cited rules)

| Situation | Medicaid effect |
|---|---|
| SNAP letter says the person has work rules (either set) and the household gets SNAP | Excluded; the State may not assess compliance [R·V § 435.556(c)]. Their real hour duty, if any, is SNAP's |
| SNAP excused the person from work rules | (c)(7) does not apply. Possible Medicaid matches for the SNAP reason: 30 hours a week → work; half-time school → education, if the school is on Medicaid's list; unemployment pay → MAGI income may reach $580; child under 6 → likely § 435.554(c)(3); treatment → (c)(8), same statutory definition. Unfit for work is not automatically medically frail; the IFC never mentions SNAP unfitness (0 lines, counted) |
| Household stops getting SNAP | Exclusion ends; each month it applied, for part or all of the month, is deemed compliant [R·V § 435.553(a)(4), 91 FR 33471] |
| Cut off SNAP while others at home still get it | Unsettled (section 4.2) |
| Waived area or discretionary-exemption month | A time-limit waiver does not lift the general rules [G·V FNA waivers page], so a fit adult aged 19-59 likely stays subject; CBPP agrees [2·U]. A 60-64 year old in a waived area is unclear |

One trap: for a SNAP household member working 30 or more hours a week, cutting hours "because 80 a month is enough"
can be a voluntary reduction of work effort that disqualifies them from SNAP [R·V 273.7(a)(1)(vii), (j)].

### 4.5 What a Medicaid screener should ask

1. Does anyone you live with get SNAP (food stamps, EBT)? Is your name on that SNAP case?
2. What does your SNAP work-rules letter say about you: you have work rules, you are excused, or you are not sure?
   SNAP must send a written notice naming which member is subject to which rule, at certification, recertification,
   and when someone becomes subject [R·V 273.7(c)(1)(ii)-(iii)]. Ask the user to save it as evidence.
3. When did SNAP start or stop, so the months can be mapped to the review period.
4. Do you get TANF and take part in its work activities?

Do not ask whether the person is keeping up with SNAP's rules. The (c)(7) test does not need it, and the copy standard
warns against inviting a casual negative self-report. v1 asks exactly that (section 10).

## 5. Verification, documentation, and the clock (question 4)

The SNAP clock [R·V 273.24]: a countable month is a full-benefit month in which the person is not excepted, not in a
waived area, not meeting the work requirement, not on prorated benefits, and not in a provider-determination notice
month (b)(1). Temporary absence for good cause counts as meeting it (b)(2). Each state picks a fixed or rolling 36-month
period and must apply it consistently (b)(3). Countable months used in another state must be verified when there is an
indication of participation there [R·V 273.2(f)(1)(xiv)(B)].

| | Medicaid community engagement | SNAP time limit |
|---|---|---|
| Months examined | Application: 1-3 consecutive months immediately before, per the State plan. Renewal: at least 1 month since the last determination, not necessarily consecutive. Optional more frequent checks [R·V § 435.556(a)-(b); § 435.557(d)] | Every month, accumulating against the 36-month clock [R·V 273.24(b)] |
| Unit | Calendar month vs 80 hours [R·V § 435.552(a)] | Month vs 80 (20 a week, averaged); weekly 30-hour tests in the general rules; any 30 consecutive days to regain [R·V 273.24(a)(1)(i), (d); 273.7(b)(1)(vii)] |
| When checked | Application and renewal [R·V § 435.556(a), § 435.557(c)] | Screening at certification and recertification [R·V 273.24(k)]; hours verified then [R·V 273.2(f)(1)(xiv)(A), (f)(8)(i)(C)]; certification periods up to 12 months for most households [R·V 273.10(f)] |
| Between checks | State option to verify more often [R·V § 435.557(d)]; general Medicaid change-reporting rules not reviewed here | Must report when hours fall below 20 a week, averaged monthly [R·V 273.12(a)(1)(vii), (a)(4)(vii), (a)(5)(iii)(G)(2)]. Claim that agencies may not require monthly hour reports [2·U CFA blueprint] |
| Data first | Must use reliable information before asking [R·V § 435.557(a)-(b)] | Use available data first for exceptions [R·V 273.24(l)]; hours must be verified [R·V 273.2(f)(1)(xiv)] |
| Evidence | From Jan 1, 2028, documentation required when reasonably available; other information accepted when none exists [R·V § 435.557(b)(2)] | Documents first (wage stubs, for example); collateral contacts such as employers or social service agencies accepted [R·V 273.2(f)(4)] |

Paper capture already converges. New Mexico's optional SNAP volunteer-hours form asks for date, hours, organization, and
the name and phone number of the person verifying, and accepts online upload, fax, mail, or in person [G·V NM HCA form
ABAWD 002, rev. Jan 22, 2026]. That is close to Medicaid's community-service tracking list [R·V § 435.552(b)].

Could one record serve both? Yes, if it stores dated entries with neutral facts (date, duration, kind, organization,
contact, pay type, court-ordered flag, documents) plus per-month status facts (SNAP case, what the SNAP letter says,
TANF), and derives each program's view at read time (inference; matches the project's "store the input, derive the
output" and per-month status rules). The views differ:

| Aspect | Medicaid view | SNAP view |
|---|---|---|
| Period | The State's review-period months | Each month; the 36-month count is agency-held, so Deferred |
| Volunteering | Community service only with a qualifying organization; otherwise maybe unpaid work | Unpaid work under the state's verification standard |
| School | Half-time satisfies the month; under half-time converts credits | Half-time is an exemption; classes count only in a work program |
| Income | Household MAGI, Deferred (do not total) | No income route; weekly $217.50 earnings exemption |
| Status overlay | Per-month exclusions and exceptions, including SNAP-subject months | Exemptions, waived areas, discretionary exemptions, prorated months: agency-held |

North Carolina's suppressed-notice exemptions (section 2.3) show why: a person cannot see from the outside whether a
month was countable.

## 6. State variation (question 5)

- Time-limit waivers. As of July 1, 2026: 0 statewide, 12 partial (Alaska, Arizona, California, Kentucky, Michigan,
  Minnesota, Nevada, New Jersey, New Mexico, New York, Oregon, Wisconsin), 41 none, 53 SNAP jurisdictions in all [G·V
  FNA FY2026 Q4 status]. Waivers are now narrow: FNS approved New York's two reservation areas and denied its six
  community districts for March 2026 to February 2027 [G·V FNS letter, Feb 9, 2026]. FY2027 responses for California
  and Wisconsin were posted August 24, 2026 [G·V FNA waiver page].
- Discretionary exemptions: each state decides how to spend its 8 percent [S·V]; North Carolina used them to cover its
  late system change [G·V].
- Clock type: fixed or rolling [R·V 273.24(b)(3)]; the CFA blueprint describes universal fixed, individual fixed, and
  rolling variants [2·U].
- Unpaid-work verification standards are state-set [R·V 273.24(a)(2)(iii)]; Ohio's broad definition is one example [R·V].
- Mandatory versus voluntary E&T; the CFA blueprint says only Florida, Kansas, and Utah are exclusively mandatory [2·U].
- Integrated eligibility. KFF (January 2025 data) counts 29 of the states facing Medicaid work requirements with one
  online application for Medicaid and SNAP, 24 with one shared eligibility system, 15 using SNAP income findings for
  Medicaid, and 33 using SNAP data to act on changes between renewals [2·U]. Verified examples: Georgia Gateway handles
  applying for, managing, and renewing up to six programs [G·V medicaid.georgia.gov], listed as SNAP, TANF, Medical
  Assistance, child care, and WIC [G·V, search excerpt of gateway.ga.gov].
  Michigan uses one assistance application for health care, food, cash, and child care, with an interview unless the
  person applies for health care only [G·V MDHHS-1171]. New York is split: some Medicaid applicants go through NY State
  of Health and others through local social services, and the joint state form covers Medicaid only when the person is
  also applying for SNAP or cash assistance [G·V, from search excerpts of ny.gov and OTDA form LDSS-2921; pages not
  opened].
- Scope difference: Medicaid community engagement covers 44 jurisdictions [2·U project doc `rule-extract.md` § 1]; SNAP
  covers 53, so a SNAP view adds 9 places with no Medicaid requirement (7 states plus Guam and the Virgin Islands;
  computed).

## 7. Prior art (question 6)

| Tool | Programs | What it does | Data model | Open source? |
|---|---|---|---|---|
| WorkedMy80 (workedmy80.com) | Medicaid and SNAP | Hours log ("one log counts for both"), pay-stub and letter photo reading, reminders; iPhone and Android "coming November 2026" [2·V site] | Phone sign-in (Firebase), cloud storage (Supabase, US), document reading by Groq; stores whether the user is exempt and why [2·V privacy policy] | No public source found [U] |
| log80 (log80.com) | Medicaid | Start/stop timer, monthly PDF or CSV with a signature line; web now, iPhone soon [2·V site] | Account-based [2·V] | No public source found [U] |
| GetBenefitsHelp (Code for America) | SNAP, North Carolina | Screener plus a form the user can share; sends nothing to the agency [2·V repo locale file] | Rails server on AWS [2·V README] | Source-available under PolyForm Noncommercial 1.0.0, not OSI open source [2·V LICENSE.txt] |
| Propel | SNAP | Work-rules screener used by over 1 million people; 42 percent had someone likely subject [2·U Propel] | Commercial app [U] | Not checked |
| Coverage Compass | Colorado Medicaid | Notice triage and form fill, disability-focused [2·V README] | Local-only, no runtime network [2·V README] | Apache-2.0 [2·V GitHub] |
| Nava OSCER | Medicaid, for states | State-run tracking and reporting [2·V GitHub] | State-hosted [2·V] | Apache-2.0 [2·V GitHub] |
| snap-benefits-navigator | SNAP, Illinois | AI chat for a food bank [2·V README] | Calls a hosted model API [2·V README] | No license file [2·V GitHub API] |

WorkedMy80's line that SNAP has required 80 hours "since November 2025" is off: the 80-hour standard dates from the 1996
welfare law [P·V 91 FR 33355]; late 2025 changed who is subject and which waivers survive [S·V; G·V]. "One log counts
for both" holds for the shared activities, but in SNAP-subject months the Medicaid hours do not matter (section 4.4).
No open-source, local-only tool I found covers SNAP hours [U].

## 8. Implications for HourKeep v2 (question 7)

(a) Medicaid only. Extra rules: none. Harm: misses a Medicaid rule. SNAP-subject users are told to find 80 hours they
do not owe, their package lacks the SNAP letter if the State's data match fails, and asking them about hours invites a
negative self-report. Value: low, and wrong guidance for dual enrollees (KFF: about 1 in 5 likely-subject adults [2·U]).
It is incorrect Medicaid screening, so it is not a real option.

(b) Medicaid with SNAP awareness. Extra rules: who is subject to each SNAP requirement (§ 6(d)(1)-(2), § 6(o)(3), 7 CFR
273.7(b), 273.24(c)), FNA guidance, and the (c)(7) household question. These feed help text, not computation; as I
list them, 6 facts (ages 16-59, ages 18-64, child under 6, child under 14, the 30-hour/$217.50 test, the notice duty).
Harm modes: the user confuses "meeting" with "subject to"; "excused by SNAP" is read as "excused by Medicaid"; SNAP ends
mid-period; the household question is decided against the user; copy goes stale like FNA's own page; 80-hour framing
leads a SNAP worker to cut below 30 hours a week. Mitigations: the questions in section 4.5, routing "excused" users
to the matching Medicaid category, and a dated source note on every SNAP fact. Value: high relative to cost; for dual
enrollees it may be the most consequential question in the screener.

(c) One log, separate Medicaid and SNAP views and packages. Extra rules: all of 273.24, 273.7, 273.2(f), and 273.12
reporting; per-state clock type, waived areas (quarterly), unpaid-work standards, state verification forms, E&T
availability; state minimum wages for workfare; 9 more jurisdictions; and a regulation that contradicts the statute
until RIN 0584-AF09 is final. Harm modes: a SNAP total read as a verdict; any countable-month figure (agency-held, so
it must stay Deferred); missing the duty to report a drop below 20 hours a week; the 30-hour reduction trap. Value: real
for SNAP-subject users and for food banks and churches serving SNAP households.

(d) Full SNAP support. Everything in (c) plus SNAP exemption screening, clock tracking, regain windows, waiver lookup,
and SNAP notice reading. Harm: a wrong exemption call or month count can end food benefits; even Code for America's
screener copy reaches a verdict ("you do not have to follow the SNAP work rules") [2·V repo locale file], which
ADR-0003 forbids here. Value: largely covered by state screeners, GetBenefitsHelp, Propel, and WorkedMy80.

## 9. Recommendation

This is a recommendation, not a finding. Build (b) into v2 as part of the Medicaid screener, and shape the data so (c)
costs little later:

1. Ask the four questions in section 4.5 as separate SNAP and TANF questions; record facts per month (household gets
   SNAP, user on the case, what the letter says, letter date and photo), never a combined boolean.
2. Store dated, program-neutral entries; derive the Medicaid view; let the user export a plain activity log (dates,
   hours, organization, contact, weekly and monthly totals, all Computed, no program claim) that any agency can read.
3. Never show a SNAP countable-month figure or a SNAP verdict; send SNAP questions to the SNAP letter and office.
4. Revisit (c) when three things are true: RIN 0584-AF09 is final, CMS has answered the household question, and a
   partner organization wants a SNAP package. Pilot in one state with a fixed clock and few waived areas.

## 10. Recommended fixes in existing files (not implemented)

- v1 `src/lib/exemptions/questions.ts:230` (`program-snap-tanf`) still asks "Are you in compliance with SNAP or TANF
  work requirements?"; the help text corrects it, but the question tests the wrong thing for SNAP. The response field
  `isOnSNAPOrTANFMeetingRequirements` (`src/types/exemptions.ts:34`, read at `src/lib/exemptions/calculator.ts:233`)
  bakes "meeting" into the data. The `nextSteps` copy in `calculator.ts` ("If you're on SNAP and behind on its work
  rules, say so anyway") may prompt a SNAP noncompliance statement that, in an integrated state, SNAP could also act on
  (inference). v2 should split the questions and drop compliance wording for SNAP.
- `docs/domain/cms-2454-ifc/what-matters-most.md:140` cites 91 FR 33385 for the TANF "should not rely on" sentence; it
  is on 91 FR 33377 (IFC.txt:1210, between the 33377 and 33378 page markers).
- `docs/domain/medicaid-work-requirements-cfa-service-blueprint.md:68` says SNAP or TANF and "meeting (not exempt from)"
  their rules; for SNAP the test is being subject to them.
- `docs/domain/snap-work-requirements-cfa-service-blueprint.md:51` gives the age exception as "18 or younger"; the
  statute says under 18, so 18-year-olds are subject.
- `docs/domain/hr1/HR1-Impact-Summary.md:17-34` omits the § 10102(a) age, child, and removed-exception changes.
- The steering domain doc should say the SNAP test covers either SNAP requirement, citing 91 FR 33377.

## 11. Pending or likely to move

- FNA NPRM RIN 0584-AF09 (planned July 2026, unpublished); it may also tighten waiver requests [G·V].
- CMS's response to IFC comments, including the household meaning of (c)(7) [2·U AEI, CBPP].
- *Rhode Island State Council of Churches v. Rollins* (D.R.I.), still open per December 2025 reporting [2·U].
- *Massachusetts v. Oz* (D. Mass.), summary judgment hearing October 20, 2026, on medical frailty and attestation
  [2·U project steering doc].
- Waiver lists change each quarter; FNA posts status updates [G·V].
- FNA consumer pages still show pre-HR1 rules and say more guidance is coming [G·V].
- Alaska and Hawaii good-faith exemptions end no later than December 31, 2028 [S·V].

## 12. What I could not verify, and why

- KFF's integrated-system counts and 1-in-5 overlap: I read them in KFF's brief, but its state table loads dynamically
  and I could not check it; the counts rest on January 2025 survey data.
- The AEI 1.8 million estimate and CBPP's household examples: secondary readings of an unresolved question.
- Whether FNA issued guidance after June 11, 2026: its OBBB page was last updated that day and lists only Q&A #1.
- Whether waivers changed after July 1, 2026: the latest status file I found covers FY2026 Q4.
- The court order itself: I read news coverage and FNS's letter, not the docket.
- Whether workfare counts for Medicaid, whether 60-64 year olds in waived areas are excluded, and how "household" will
  be read: the IFC is silent on each.
- Open-source status of WorkedMy80, log80, and Propel: I found no public repositories, which is not proof of absence.
- The statute was read through Cornell LII's copy of 7 U.S.C. 2015 because uscode.house.gov returned a server error;
  the § 10102 amendments match the enrolled bill in `docs/domain/hr1/`.
- medicaid.gov pages returned 403, so CMS state guidance on SNAP data sharing was not checked.
- Medicaid change-reporting rules between renewals (§ 435.916) were outside this pass.
- The 44-jurisdiction Medicaid scope comes from the project's `rule-extract.md`, not re-checked against CMS's list.
