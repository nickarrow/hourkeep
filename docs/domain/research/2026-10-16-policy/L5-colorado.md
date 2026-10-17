# L5 Colorado: policy research for HourKeep v2

Lane L5, read-only, researched 2026-10-16. Skills: this session listed five skills by name (hhs-benefits, project-docs,
review, stack, writing-code). As the step asked, I read `AGENTS.md` and `.kiro/skills/hhs-benefits/SKILL.md` directly with
the file reader; I did not load a skill through the skill tool.

Tags: [S] statute; [R] regulation text; [R-d] Colorado regulation text in draft, not adopted; [G] agency guidance (federal
or state web pages, letters, forms, memos, plans, comment letters); [P] Federal Register preamble; [C] court filing;
[2] secondary. V = I read it in the named source on 2026-10-16; U = unverified. IFC.txt = `docs/domain/cms-2454-ifc/2026-11094.txt`.
Web content is paraphrased for compliance with licensing restrictions; quoted fragments are short.

## Summary

No CORRECTION findings: nothing I checked in the corpus was wrong for Colorado, apart from one stale date (15).

1. ADDITION: Colorado is absent from the corpus (no row in `state-options.md:261-284`). HCPF now publishes enough to fill most profile fields as state-published, led by a draft rule, 10 CCR 2505-10 § 8.100.4.G.4.
2. ADDITION: Colorado's published elections: 1-month application lookback, 1 month at renewal, no more-frequent checks, income-to-hours proxy, attestation through 2027 except for veterans, 6-month renewals, 12-month frailty exclusion.
3. ADDITION: At renewal the draft rule puts the work requirements form, which it names a Notice of Noncompliance, inside the renewal packet with the same due date. By my mapping that is § 435.558(b)(2) Option 1, one window; the corpus assumes Option 2 (`state-options.md:237`).
4. OPEN: The draft rule ends the renewal review window in the month ex parte review starts (90 days before the period ends). § 435.556(a)(2)(i) runs to the renewal due date (IFC.txt:4143). HCPF's forms list six months.
5. CONFIRMED: Colorado's first renewal cohort is March 2027, letters in January 2027, matching § 435.559(c) and `rule-extract.md:786`. HCPF's partner FAQ still says renewals due in or after January 2027.
6. OPEN: SNAP exclusion. The draft rule and the worker sheet use the federal test (SNAP household, not exempt). HCPF's letters, FAQs, partner guide and screener say "comply". The corpus reading (SNAP report:135) matches the draft rule.
7. OPEN: Income route. The draft rule counts $580 of earned or unearned MAGI household income. HCPF's letter, forms and screener say earned income or paid work. The corpus (`rule-extract.md` § 2.6) matches the draft rule.
8. ADDITION: Colorado rounds the credit-hour conversion up to whole hours (1 credit = 13, 6 = 78) where `rule-extract.md:179-184` has 12.99 and 77.94. Job search inside a state program is capped at 39 hours a month.
9. ADDITION: For retroactive coverage Colorado checks the month before the requested retroactive month, and its applicant forms carry a retro-month row. The IFC text has 0 lines on retroactive coverage (counted).
10. OPEN: Seasonal workers. HCPF's FAQ says a six-month average of earned income; the draft rule says a 12-month average of hours or income. Colorado's § 435.603(h)(3) election is not published.
11. OPEN: No Colorado source dated after July 2026 offers the short-term hardship exception. The draft rule has 0 mentions (counted) and the final Worksheet J dropped the 3 hardship questions of its February draft.
12. ADDITION: Colorado's frailty approach: five categories plus the impairment gate, automatic indicators (SSI, SSDI, HCBS waivers, LTSS, state disability, recent facility stays), attestation in 2027, an HIE feed planned, no published condition list.
13. OPEN: The draft rule's substance use wording reaches only people in early or sustained recovery, narrower than § 435.554(c)(5)(i)(B) and than HCPF's worker sheet, which adds people living with a SUD.
14. ADDITION: Colorado is a plaintiff in Massachusetts v. Oz (complaint ¶ 13), while its own draft rule and worker sheet apply the frailty gate it is challenging.
15. STALE: The summary judgment hearing is set for October 22, 2026 (notice entered October 8), not October 20 as in `rule-extract.md:932`, `state-options.md:42` and `what-matters-most.md:233`.
16. ADDITION: HCPF has published its outreach letter template in English and Spanish, an earlier sample, and six draft forms including Worksheet J in both languages (12 PDFs, counted), plus a partner toolkit and a video.
17. CONFIRMED: Fax is a real channel in Colorado, as `state-options.md:236` says for the federal default. Channels are PEAK, the Health First Colorado app, mail and drop-off, plus county email and fax that differ by county.
18. ADDITION: Colorado appeals: 60 days from the Notice of Action date to ask for a hearing; benefits continue if the request reaches the Office of Administrative Courts within 10 days after the date of action. The corpus has no hearing window.
19. ADDITION: Colorado's Spanish letter and student form render half-time as "tiempo parcial" (part-time), which blurs half-time and less-than-half-time. This is my reading, not a native-speaker review.
20. STALE: Coverage Compass's shipped rules (v0.0.1, last commit 2026-09-23) predate the IFC and conflict with the corpus on frailty, pregnancy proof, documentation and the first cohort. Local-only and Apache-2.0 are confirmed.
21. STALE: Several Colorado pages still carry pre-IFC text (key changes page, member FAQ, the February Worksheet J draft), and the September worker sheet omits TDIU. Cite the draft rule, the September 23 page and the final forms instead.

## Evidence

### 1. What exists and what to trust

The strongest Colorado source is the draft rule, 10 CCR 2505-10 § 8.100 (26 pages), linked from HCPF's September 28, 2026
stakeholder meeting page [R-d·V https://hcpf.colorado.gov/events/eligibility-rule-updates-se-september; file
https://drive.google.com/file/d/1CCPLCno0FQYZi8YtGPckXf2jYttU9HGy/view]. It is not adopted. HCPF's deck sets submission
to the Medical Services Board on November 27, an emergency reading on December 11, effect on January 1, 2027, and
permanent adoption on February 12, 2027 [G·V deck p. 30, https://drive.google.com/file/d/1IbJL9OaV93tlONrqA3mbzjSa03CCm4-C/view].
Because Drive links move, both are kept as `scratch-L5/draft-rule-8100.pdf` and `scratch-L5/rule-deck-2026-09-28.pdf`. Behind the rule sits C.R.S. 25.5-4-219, added
by HB26-1235 (Session Laws 2026 ch. 361, approved June 3, 2026): the Board must adopt CE rules by January 1, 2027 in a way
that keeps administrative burden to the least, and HCPF must post monthly enrollment data from March 1, 2027
[S·V http://staging.leg.colorado.gov/laws/session-laws/HB26-1235/361/download]. HCPF's own pages disagree with each other
(sections 5 to 7), so I ranked them: draft rule, then the September worker sheet and final forms, then dated web pages.

### 2. Implementation approach and timeline

| Date | Event | Source |
|---|---|---|
| 2025-11-28 | CMS approves HCPF's CE advance planning document: $25,627,630, 90% federal | [G·V https://hcpf.colorado.gov/hr1-faqs "Costs"] |
| 2026-06-29 | Colorado joins Massachusetts v. Oz | [C·V complaint ¶ 13] |
| 2026-07-27 | HCPF comment letter to CMS | [G·V comment letter, link in section 6] |
| Aug to Sep 2026 | Outreach letters by mail and PEAK. The FAQ says August; the timeline and partner guide say September | [G·V] |
| 2026-09-17 | Draft verification forms posted | [G·V https://hcpf.colorado.gov/hr1-additional-resources] |
| Nov 2026 | Second notice round; system training for eligibility workers | [G·V https://hcpf.colorado.gov/hr1-timeline; FAQ] |
| 2027-01-01 | CE and 6-month renewals start; retroactive coverage for expansion adults falls to 1 month | [G·V timeline; https://hcpf.colorado.gov/hr1-key-changes] |
| Jan 2027 | Letters to members whose renewal is due in March 2027 | [G·V timeline, updated Oct 8, 2026] |
| End of Mar 2027 | First cohort renewed or terminated | [G·V timeline] |

The build is a minimum viable product inside CBMS and PEAK (vendor Deloitte): standard self-attestation forms that
optical character recognition and AI read for automatic adjudication, plus existing data feeds (Equifax Work Number;
state labor department wages and hours). New feeds (colleges and universities, corrections, county jails, hospitals,
the state HIE) arrive over 2 to 3 years in quarterly releases from Q1 2027 [G·V IAPD pp. 4-6,
https://hcpf.colorado.gov/sites/hcpf/files/Community_Engagement_IAPD%20FFY26-R.pdf]. HCPF says it must work toward
January 2027 because CMS signalled few delays [G·V FAQ "Broader Policy"]; I found no exemption request. Aggregates: 1.2 million members, 377,000 expansion adults as of August 2026, and 175,000 who
will need to show an exclusion, exception or compliance [G·V https://hcpf.colorado.gov/hr1-medicaid-work-requirements,
published Sept 23, 2026]. The July comment letter put that last figure near 155,000 [G·V].

### 3. Colorado values against the corpus profile schema

| Field (`state-options.md`) | Colorado | Source | Against corpus default |
|---|---|---|---|
| `implementationDate` | 2027-01-01 | [R-d·V § 8.100.4.G.4; G·V WR page] | same |
| `applicationLookbackMonths` | 1, the calendar month before application | [R-d·V § 8.100.4.G.4.d.i; G·V FAQ] | same |
| `renewalMonthsRequired` | 1; FAQ explains Colorado chose one month | [G·V FAQ "Why does Colorado require one month"] | same |
| `moreFrequentVerification` | false: compliant until the next redetermination; a reported change opens no new review | [G·V WR page; R-d·V § 8.100.4.G.4.d.ii] | same |
| `incomeToHoursProxyAvailable` | true: earnings under $580 convert at federal minimum wage per § 435.552(e) | [R-d·V § 8.100.4.G.4.g] | same |
| `seasonalMethod` | conflicting, see section 7 | [G·V; R-d·V] | OPEN |
| `educationCreditHourConversion` | 3 × 4.33, then rounded up to the whole hour | [R-d·V § 8.100.4.G.4.g, p. 21] | adds rounding |
| `shortTermHardshipOffered` | no evidence of election | [R-d·V, 0 mentions] | same |
| `rehabMinimumTimeCommitmentHours` | none stated | [R-d·V § 8.100.4.G.4.e] | same |
| `documentationRequiredFrom` | 2028 hardening; 2027 attestation for frailty, school, volunteering, work programs, earnings, hours; veteran status never by attestation (VA letter, VA determination, federal data or an approved document) | [G·V FAQ "What is self-attestation"; R-d·V § 8.100.4.G.4.h.i(6)-(7)] | same, plus a veteran rule |
| `goodFaithEffortExemptionThrough` | null; no request found | [G·V FAQ] | same |
| `noncomplianceResponseDays`, `noticeReceiptPresumptionDays` | 30 from receipt; receipt 5 days after notice date | [R-d·V § 8.100.4.G.4.h.ii] | same |
| `unableToVerifyAtRenewal` | option-1-concurrent | [R-d·V § 8.100.4.G.4.h.iii] | differs |
| `renewalIntervalMonths` | 6 for MAGI adults; 12 for AI/AN, former foster youth, LTSS, buy-in, Medicare, disability groups | [G·V FAQ "6-Month Renewals"] | same |
| `renewalInitiationLeadDays` | ex parte starts 90 days before the period ends; form mailed about 60 days before due | [R-d·V § 8.100.1 "Ex Parte Review", p. 4; G·V FAQ] | same range |
| `frailtyReverificationMonths` | 12; renewals stay at 6 | [G·V worker sheet footnote, link in section 5] | same |
| `presumptiveEligibilityForAdultGroup` | yes; hospital PE judges CE on self-attestation | [R-d·V § 8.100.3.R.2.d.i] | new value |

Colorado matches the corpus's KFF modal case (`state-options.md:268`) except on hardship, where the modal case offers all four.
The hardship trail: HCPF's July 2026 deck listed short-term hardship as an exclusion, subject to change [G·V p. 6,
https://hcpf.colorado.gov/sites/hcpf/files/July%20SE%20HR1%20presentation.accessible.pdf]; the public Worksheet J draft
(PDF metadata dated Feb 9, 2026) asked three hardship questions; the final Worksheet J (dated Aug 17, 2026) and the
September draft rule ask none [G·V; R-d·V].

### 4. Renewal mechanics: one window, and where it ends

The draft rule labels the work requirements form a Notice of Noncompliance (§ 8.100.4.G.4.h.i and h.ii). At
redetermination it sends that form with the redetermination form; its due date aligns with the renewal due date, with at
least 30 calendar days and coverage continuing meanwhile. The draft names no § 435.558(b)(2) option; Option 1 is my mapping.
Added verification gets at least 10 business days. Termination follows only a check for other programs, adequate notice
and hearing rights [R-d·V § 8.100.4.G.4.h.iii]. The FAQ says the form usually travels in the renewal packet about 60 days
before the due date [G·V]. So Colorado users get one window, not the two the corpus default assumes.

The window's end is unsettled. The draft review period runs from the month of the last determination through the month
ex parte review begins [R-d·V § 8.100.4.G.4.d.iii], which starts 90 days before the period ends [R-d·V p. 4]. Federally
it runs to the renewal due date [R·V IFC.txt:4143]. HCPF's renewal forms list six months, September 2026 to February 2027
for a March 2027 renewal [G·V volunteer form p. 6], and the August sample letter says one month out of the six before the
renewal date [G·V]. Whether a qualifying month in the last 60 to 90 days counts is OPEN. HCPF's partner FAQ says the first
people affected include renewals due in or after January 2027 [G·V], against its newer timeline's March cohort.

### 5. SNAP exclusion when counties run SNAP

Federal text: a member of a SNAP household who is not exempt from a SNAP work requirement [R·V § 435.554(c)(7), IFC.txt:4009].
CMS reads "not exempt" as "subject to" and says States need not confirm compliance [P·V 91 FR 33377, IFC.txt:1216-1218].

Colorado's draft rule copies that test, and requires compliance only for TANF, Colorado Works [R-d·V § 8.100.4.G.4.e].
The worker sheet lists both "SNAP/TANF compliant" and "Not exempt from SNAP work requirements" [G·V
https://hcpf.colorado.gov/sites/hcpf/files/Key%20Changes_Work%20Requirements%20Exceptions_Exclusions_Sep2026.pdf].
Member-facing text narrows it: the letter in both languages, the member FAQ (answer updated April 20, 2026), the partner
guide, the screener flow dated 8-27-2026 and the key changes page all describe the exclusion as complying, and all but
the screener add that people who fail SNAP's rules must meet Medicaid's [G·V]. The partner FAQ says "subject to and complying" [G·V]. Even the September
rule deck slide 25 says "already compliant" over a rule text that says not exempt [G·V].

Operations: Worksheet J and the renewal form ask only whether the person applied for or receives SNAP or TANF (question 23)
[G·V https://hcpf.colorado.gov/sites/hcpf/files/HFC%20FINAL%20MVP%20Paper-App%20Worksheet%20J-ac.pdf]. County workers
record each person's general work exemption and ABAWD status in CBMS [G·V CDHS desk aid v11, April 2026,
https://training.colorado.gov/sites/training/files/documents/SNAPWorkReqs_ABAWD_Jun2026.pdf]. That field is the likely
ex parte source for HCPF (inference); HCPF says it is aligning with the Department of Human Services [G·V FAQ]. Colorado SNAP calls the
general requirements "Basic Work Rules" and gives each household member a consolidated work notice, spoken and written, at
application, recertification and on becoming subject [G·V script rev. 03/2026,
https://training.colorado.gov/sites/training/files/documents/Consolidated-Work-Notice-Script_EN_Apr2026.pdf]. That notice
is the paper a Colorado user should keep. Time limit: ages 18 to 64, child under 14; SNAP E&T is Colorado Employment First
[G·V https://cdhs.colorado.gov/snap/abawd]. No Colorado waived areas on July 1, 2026 per `.agents/snap-research/report.md:223` [U].
The meaning of "household" stays open in Colorado as it does federally.

### 6. Medically frail

The draft rule lists blind or disabled, SUD in early or sustained recovery, disabling mental disorder, a disability that
significantly impairs activities of daily living, and a serious or complex condition, joined to special medical needs
that significantly impair work, volunteering or school [R-d·V § 8.100.4.G.4.b]. Its SUD clause names recovery stages
only; the federal category covers any SUD short of 5 years' stable recovery, treated or not (`rule-extract.md` § 4.2) and
the worker sheet adds people living with a SUD [G·V]. Member copy phrases the gate as a condition that prevents 80 hours
a month of work, school or volunteering (member page, updated Aug 4, 2026) [G·V
https://www.healthfirstcolorado.gov/changes-are-coming-to-health-first-colorado-colorados-medicaid-program/work-requirements/].

Data indicators counted as frailty: SSI, SSDI, HCBS waivers, LTSS and state disability approval [G·V worker sheet], plus
living in a hospital, nursing home or long-term care facility now or in the past 3 months [G·V Worksheet J q13; WR page].
Federally, inpatient and nursing facility stays belong to the optional hardship exception (`rule-extract.md` § 5).
Attestation is accepted in 2027 [G·V FAQ]. An HIE interface using one-time care summaries is planned for new applicants
[G·V IAPD p. 8]. I found no published condition list (§ 435.554(c)(5)(ii) does not require one). HCPF asked CMS to drop
the gate and allow durable exclusions for lifelong conditions [G·V comment letter pp. 9-10,
https://hcpf.colorado.gov/sites/hcpf/files/HCPF%20Final%20IFC%20CE%20Federal%20Comment%20Letter%207_27_26-ac.pdf].

### 7. Income, seasonal work, school, retroactive months

Income: the draft rule counts $580 of countable earned or unearned gross income for the MAGI household, including in-kind
and unearned types [R-d·V § 8.100.4.G.4.b, .c, .g]; the deck says income by tax household, hours by individual [G·V slide 27].
Member text says $580 "from paid work" (letter p. 3), earned income (partner guide), "Did you earn" (Worksheet J q24) and
"Do you make" (screener) [G·V]. A household that reaches $580 only through unearned income such as unemployment benefits
meets the draft rule but would answer no on the form (inference).

Seasonal: the FAQ divides six months of earned income by 6 [G·V]; the draft rule allows an average of hours or income and
looks at 12 months when incomes vary [R-d·V § 8.100.4.G.4.g]. The federal paths are in `rule-extract.md` § 2.7.

School: half-time or more satisfies the month; under half-time converts credits by 3 × 4.33 rounded up, or counts actual
hours; NSC data needs the student's written or electronic consent [R-d·V § 8.100.4.G.4.g]. HCPF's education guide tells
students to sign the release in PEAK or on the form [G·V
https://hcpf.colorado.gov/sites/hcpf/files/HR1%20-%20Educational%20Institution%20Partner%20Guide%209%2029%202026b.pdf].
The draft names Adult Basic Education classes beside high school and GED, possibly wider than the federal list (inference).

Work programs: SNAP E&T, WIOA, Trade Adjustment Assistance, state workfare or training with job search capped at 39 hours
a month, and DOL or VA veterans programs. Community service: nonpartisan nonprofits (charities, food pantries, shelters,
religious institutions, hospitals) and public service (local government, schools, parks) [R-d·V § 8.100.4.G.4.g].

Retroactive coverage: HCPF reviews the month before the retroactive month requested [G·V FAQ "What is a mandatory
exception"], and new-applicant forms list the retro month, the month before application and the month of or after
application [G·V volunteer, work program and caregiver forms]. IFC.txt and the XML have 0 lines matching "retroactiv" (counted).

### 8. Notices, forms and member materials

| Item | What it is | Source |
|---|---|---|
| Outreach letter, EN 4 pp. and ES 5 pp., then taglines (16 languages on the English template, counted) | Who must comply, the exclusion list, $580 or 80 hours in 1 month since the last renewal, send papers to the county or PEAK; no further letter means nothing needed | [G·V https://hcpf.colorado.gov/sites/hcpf/files/MA_Work_Requirement_Notice_EN.pdf, ..._SP.pdf] |
| Earlier sample dated Aug 1, 2026, fictional member | Shorter list; its Denver phone 720-994-4347 differs from Denver's 720-944-4347 | [G·V Work Requirements Notice (Narrow).pdf; denvergov.org] |
| Worksheet J, applicants; Work Requirements Form, renewals | 23 yes/no questions, then question 24 with 4 parts; activity table of name, type, month, hours; penalty-of-perjury signature | [G·V final forms] |
| Student, volunteer, work program, family caregiver forms | Drafts as of Sept 17, 2026, EN and ES; the member signs, not the organization | [G·V Additional Resources] |
| Partner reference guide EN and ES; five sector guides, Sept 29-30, 2026, EN | In 2027 people may report hours from their own records | [G·V https://hr1toolkit.healthfirstcolorado.gov/] |
| Video EN and ES, captions, audio-described versions (2:18, 2:58) | Toolkit; a renewals "Action" kit is marked coming soon | [G·V toolkit] |

The volunteer form accepts an organization's own record if it shows the organization's name and contact, dates, hours
and the volunteer's name [G·V form p. 8]. The caregiver form follows § 435.554(c)(3)(i)(A) to (C) and asks for monthly
hours under 80 [G·V]. Planned but not published: the Request For More Information letter that carries the forms, a
renewal approval notice, and the Notice of Adverse Action [G·V FAQ; forms]. The Spanish letter says "al menos a tiempo
parcial" for at least half-time (p. 3), and the Spanish student form labels its three boxes full-time, "tiempo parcial"
and less than "tiempo parcial" and heads the hours column "Si es a tiempo parcial", where English says less than half-time
[G·V text; judgment is mine].

Stale Colorado pages still online: the key changes page's undated work requirements list excuses Social Security
Retirement recipients and people in mental health treatment and names only "total and permanent" veterans [G·V
https://hcpf.colorado.gov/hr1-key-changes]; the member FAQ still expects final federal guidance by June 2026 [G·V]; the
February Worksheet J draft, which also asks about retirement benefits, is still served [G·V
https://hcpf.colorado.gov/sites/hcpf/files/Public%20Access%20-%20English_Paper-App_WorkRequirements_WorksheetJ.pdf].
The September worker sheet omits TDIU, which the draft rule, the letter and Worksheet J all include [G·V; R-d·V].

### 9. How people submit, and appeals

HCPF lists PEAK, the Health First Colorado app, mail and in-person drop-off [G·V member FAQ
https://www.healthfirstcolorado.gov/frequently-asked-questions/work-requirements/work-requirements-frequently-asked-questions/].
Boulder County adds email (imaging@bouldercounty.gov) and fax (303-441-1523) [G·V
https://bouldercounty.gov/families/medical/health-first-colorado/]; Denver runs a verifications inbox,
DHSVerifications@denvergov.org [G·V denvergov.org contact page]. A central scanning service for mail, fax and email to
CBMS programs is being phased in, fully running by July 1, 2028 [G·V
https://hcpf.colorado.gov/sites/hcpf/files/Shared%20Services%20FAQ.pdf]. I found no HCPF statement that CE information
may be given by phone, which § 435.557(b)(4) requires States to accept (`rule-extract.md:613`).

Appeals: 60 days from the Notice of Action date to ask the Office of Administrative Courts for a hearing, by mail, phone
303-866-2000, fax 303-866-5909 (10 pages or fewer) or email oac-gs@state.co.us; benefits continue if the court receives
the request within 10 days after the date of action; no continuation for first-time applicants; exceptions to an initial
decision within 18 days [G·V https://hcpf.colorado.gov/appeals]. The federal ceiling is 90 days from mailing
[R·V 42 CFR 431.221(d), eCFR as of 2026-10-13].

### 10. Litigation

Colorado is a named plaintiff, represented by Attorney General Weiser [C·V complaint ¶ 13,
https://litigationtracker.law.georgetown.edu/wp-content/uploads/2026/06/Massachusetts-v.-Oz_2026.06.29_COMPLAINT.pdf];
his office describes 24 attorneys general and two governors [2·V coag.gov release, June 29, 2026]. The court set argument
on the plaintiffs' partial summary judgment motion and the cross-motion for October 22, 2026 at 10:00 a.m. before Judge
Stearns [C·V electronic notice entered 10/08/2026, tracker scheduling order of Oct 8, 2026].

### 11. Coverage Compass (https://github.com/owenpkent/coverage-compass, commit c7913f9, 2026-09-23)

Apache-2.0 and local-only, as `.agents/snap-research/report.md:256` says, with a NOTICE naming the Colorado
Cross-Disability Coalition partnership; 172 files outside `.git` (counted).
It triages a dropped letter on the device and fills the CDASS attendant packet; appeals drafting is planned for Q1 2027.
Its Colorado policy lives in `rules/co/exemptions.yaml` (v0.0.1, 8 categories), `rules/co/deadlines.yaml` (5 entries,
none with a verified source), `rules/co/letter-types.yaml` (v0.1.0, 5 types, `es_reviewed: false`) and
`docs/colorado-rules.md`. It cites HCPF's partner FAQ, an older HCPF fact sheet, the Health First Colorado FAQ and an AAPD
explainer; CMS-2454-IFC appears only in `research/state-data-access.md:46` and `docs/proposal-hcpf-data-access.md:14`.
`PROJECT-STATUS.md` says the coalition has not reviewed the rules and the Spanish is machine-drafted [2·V for all].

| Coverage Compass says | Where | Corpus or Colorado now |
|---|---|---|
| Medically frail is the five categories, no gate | exemptions.yaml | gate at § 435.554(c)(5)(i); worker sheet |
| Pregnancy proof is required | exemptions.yaml | attestation must be accepted, § 435.956(e) (`rule-extract.md` § 4.2) |
| A diagnosis letter is required | exemptions.yaml | Colorado accepts attestation in 2027 |
| Renewals from January 2027 must comply | README; colorado-rules.md | § 435.559(c); HCPF's March 2027 cohort (HCPF's FAQ says what CC says) |
| Renewals are usually yearly | README; colorado-rules.md | right for disability groups and LTSS; MAGI adults renew every 6 months |
| Adults "must show they work 80 hours" | letter-types.yaml | $580, school, volunteering, work programs also count |
| 60-day hearing window is a federal floor | deadlines.yaml | 90 days is the federal ceiling; Colorado's 60 is right |
| HCPF has not published sample letters | colorado-rules.md | template published in EN and ES |

Its exemption list omits 8 federal categories (counted): AI/AN, former foster youth, veterans, SNAP, TANF, SUD treatment,
incarceration, Medicare. It agrees with Colorado on the 60-day appeal and the 10-day continuation, and the coalition is a
possible partner organization for HourKeep.

### 12. What this suggests for HourKeep (inference, not findings)

- Build the Colorado profile from the draft rule, cite each section, and recheck after December 11, 2026 and February 12, 2027.
- Mirror the Worksheet J activity table and the volunteer form's accepted-record fields in the export, typed and scan-friendly.
- Show the SNAP exclusion as Deferred with both Colorado wordings, collect what Worksheet J question 23 asks, and ask for the consolidated work notice.
- Show income as Conditional: the draft rule counts unearned MAGI income, the forms ask about earnings.
- Tell Colorado users the form arrives in the renewal packet and is due with it; a month before the packet arrives is safe under both readings.
- In Spanish, show Colorado's own checkbox labels and explain them.

## Could not verify

- No Colorado CE state plan amendment found on medicaid.gov or HCPF pages; I searched, so absence is not proven.
- No Colorado frailty condition list, and no templates for the Request For More Information letter or the adverse action notice.
- Colorado's § 435.603(h)(3) election, its reconsideration period for CE terminations, and its § 435.554(a)(iv) relative options.
- Whether HCPF takes CE information by phone; memo OM 23-038 on telephonic renewal signatures was seen only as a search excerpt.
- That CBMS is run jointly by HCPF and CDHS for medical, food and cash rests on a legislative staff memo seen only as an excerpt [2·U].
- Whether healthfirstcolorado.gov pages and the screener exist in Spanish; the site has a language plugin and I did not open it.
- Colorado's SNAP waiver status, taken from the SNAP report and not rechecked; whether any referendum petition hit HB26-1235.
- The final rule text, which can change before December 11, 2026, and the outcome of the October 22 hearing.
- The Spanish wording judgment is mine. In Coverage Compass I read the rules, docs and status files, not all 172 files, and did not run it.
