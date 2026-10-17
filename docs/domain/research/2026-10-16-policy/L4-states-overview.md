# L4 states-overview: jurisdictions, early implementers, per-State elections

Lane L4, read-only, researched and written 2026-10-16. Skills: the session listed skills by name (hhs-benefits, project-docs, review, stack, writing-code). I loaded hhs-benefits through the skill tool and also read `.kiro/skills/hhs-benefits/SKILL.md` and `AGENTS.md` directly, as the brief asked. No other skill was loaded.

Tiers: S State-published, C CMS-published, T third-party, U unknown. Verified means read in the source on 2026-10-16, with the URL or file:line given here or in Table B. Every S and C entry is Verified unless marked (u), which means I saw only a search-engine extract of that source. T entries record what the third party reported and are Unverified as fact. Corpus paths are relative to `docs/domain/cms-2454-ifc/`.

## Summary

1. CONFIRMED. 44 jurisdictions, 43 States plus DC (C: 91 FR 33427 and 33429, `2026-11094.txt:2678, 2730`). My counts: Medicaid.gov's beneficiary site has 51 State pages, 44 with a program page and 7 saying no new requirement (AL, FL, KS, MS, SC, TX, WY); KFF's tracker dataset gives the same 44 (36 expansion-only including DC, 5 expansion plus 1115, 3 1115-only). Territories excluded (`2026-11094.txt:3767`).
2. CONFIRMED. The 1115 list at `rule-extract.md:70-74` and `state-options.md:290-292`: CMS's July 2026 IFC deck names 13 populations in 8 States (GA, HI, MA, NY, OR, TN, UT, WI); I counted the 13. CMS frames it as "to date", so the list can grow (OPEN).
3. CONFIRMED. Burden figures: about 10 States expected to seek a good-faith exemption (`state-options.md:230`; 91 FR 33429), and about 2 expected to get one (91 FR 33430, ADDITION). 56% of about 20 million verified ex parte, 8.8 million submitting, 2 hours per submission every 6 months (`rule-extract.md:926-927`; `2026-11094.txt:157, 2830, 2835`). The ICR's assumption that all 44 elect hardship is a costing device (`2026-11094.txt:2868`), not a forecast.
4. CONFIRMED. Early starts: Nebraska 2026-05-01 (S; C as SPA effective date), Montana 2026-07-01 (S), Arkansas soft launch 2026-07-01 with no penalties before 2027-01-01 (S), Iowa 2026-12-01 (S), Georgia Pathways since 2023-07-01 (S). No other State page I read gives an earlier date than 2027.
5. ADDITION. Nebraska's SPA NE 26-0002 is the only approved community engagement SPA on Medicaid.gov (approved 2026-09-04, effective 2026-05-01): 1-month application lookback, 1 month at renewal, no more-frequent verification, hardship elected, and the concurrent "unable to verify" option (corpus default is option 2, `state-options.md:237`). CMS's companion letter orders Nebraska to narrow its frailty definition and fix two advance-notice gaps.
6. STALE. "SPA template under development" (`state-options.md:309`, `rule-extract.md:996`): CMS published the MACPro implementation guide for the "Community Engagement for Certain Adults" unit (PDF created 2026-08-04). It holds the hardship, application-months, renewal-months, more-frequent-verification and "unable to verify" elections; the proxy, frailty list and documentation posture are not in it, and predictable-income changes live in the separate MAGI unit.
7. ADDITION. Georgia: CMS's 2026-09-25 overlay letter applies the requirement to the Pathways population from 2027-01-01, yet every Pathways authority expires 2026-12-31 unless renewed, and Medicaid.gov lists the 2025-04-28 extension application as pending. Whether Pathways exists in 2027 is OPEN.
8. CORRECTION. Arkansas renewal months (`state-options.md:271`, `rule-extract.md:972`): corpus says 3, from the KFF survey. AR DHS's FAQ now says one month every six months, and the month before application for applicants.
9. CORRECTION. Missouri hardship (`state-options.md:281`): corpus says only the unemployment event is declined. MO DSS says Missouri is not using the optional short-term hardship exception at all.
10. CORRECTION. Oklahoma hardship (`state-options.md:282`): OHCA's page and draft rule APA WF 26-06 elect all four events; OHCA says disaster and unemployment wait on federal approval.
11. CORRECTION. New York hardship (`state-options.md:283`): NY State of Health lists all four events, medical travel included. Items 9 to 11 read as pre-IFC survey answers: the IFC makes the election all or none (MACPro guide p. 5), though the two county-based events still need a State request.
12. CORRECTION. Nebraska frailty documentation "2027-01" (`state-options.md:269`): Nebraska DHHS (updated 2026-09-14) takes a self-declaration and asks for no documentation at this time. Nebraska is also absent from the eight-State list, so the tracker carries nine 2027-01 rows against a text of eight.
13. CORRECTION. "Eight States require frailty documentation from January 2027" (`state-options.md:116-117, 229`; `rule-extract.md:922`) rests on one third-party report (Politico, 2026-08-09). AP (September 2026) names six States barring self-attestation and adds New Hampshire, whose statute RSA 126-AA:6 requires a medical certification (S). At least nine are reported. State-published support exists only for New Hampshire and Ohio; Iowa says it "may require"; Utah is contested.
14. ADDITION. The lookback gap (`state-options.md:302`) closes from State sources: Idaho 3 at application and 3 of 6 at renewal; Indiana 3 at application and 3 before each renewal and quarterly review; New Hampshire 1 at application with at least quarterly checks; Arkansas 1 and 1.
15. ADDITION. Of 21 States with a published renewal value, 6 require more than one month (ID 3, IN 3, KY 3 of 6, MT 3, NC 3 of 6, IA 2). Kentucky's own example reaches back to August 2026 for a February 2027 renewal and Wisconsin's to April 2026 for March 2027, so months lived in 2026 can matter (OPEN whether they can be required or only credited).
16. CORRECTION. `rule-extract.md:954` says only Idaho and Indiana were on the July outreach schedule. North Carolina's 3-month application lookback puts it on the same July 1, 2026 deadline under § 435.561(b).
17. CORRECTION. `state-options.md:286` calls the KFF survey one "of all 44". KFF surveyed 43 jurisdictions, before CMS added Tennessee. Its 34, 36, 34 and 29 figures match KFF's text.
18. ADDITION. Hardship gap (`state-options.md:304`): 15 States now publish a position; 13 elect, while Missouri and New Hampshire (by statute, absent oversight-committee approval) elect none.
19. ADDITION. Income-to-hours proxy: Indiana publishes it (gross income divided by $7.25). I found no other State, and no State publishing a predictable-income-changes election.
20. ADDITION. A household reading of the $580 test is published by Arkansas, Montana, New York, Oregon and Pennsylvania; Idaho says household income but per-person compliance. This bears on the interpretive risk at `state-options.md:40`.
21. ADDITION. Frailty condition lists are public for Nebraska, Ohio (ICD-10 list dated 2025-10-29, before the IFC) and Georgia (two tiers, Attachments A and B, confirming `state-options.md:241`).
22. ADDITION. Colorado, Oregon and Louisiana publish self-attestation for exemptions through 2027 with documentation possible from 2028; Oklahoma's draft rule matches.
23. OPEN. Nebraska's approved SPA says 30 days from the date of the notice and Georgia's notice says from issuance; § 435.558(a)(2) and (c)(4) count from receipt. HourKeep should show the due date printed on the notice and never compute a later one.
24. OPEN. New York's page averages seasonal income over 12 months; § 435.552(g) says 6. Do not copy New York's figure until it is resolved.
25. ADDITION. Tennessee: TennCare says parents and caretakers in its TennCare III expansion category already meet the requirement through income and need send nothing.
26. NOTE. `state-options.md` dangling references: the targets I checked are missing (wave-2b plan, `src/lib/education.ts`, `src/lib/policy/`), and its "ADR-0001" now collides by number with `docs/decisions/0001-set-aside-v1-in-the-same-repository.md`. I did not recount the nine.

## Evidence

### Jurisdictions and the 1115 list

CMS's burden analysis twice puts the count at 44, 43 States and DC (91 FR 33427, `2026-11094.txt:2678`; 91 FR 33429, `:2730`, dated "as of May 2026"). The preamble counts 40 States plus DC as expansion jurisdictions (91 FR 33349, `:176`); adding Georgia, Tennessee and Wisconsin gives 44. Scope is the 50 States and DC, not territories (`:3767`). Medicaid.gov's beneficiary site (https://www.medicaid.gov/renew-info, C) offers 51 choices and says the rules do not apply to five named territories; I fetched all 51 State pages at https://www.medicaid.gov/renew-info/XX and counted 44 program pages and 7 "no new work requirement" pages. KFF's dataset behind its tracker (https://datawrapper.dwcdn.net/rRWrd/4/dataset.csv, T) agrees row for row.

CMS's IFC overview deck, July 2026, p. 9 (https://www.medicaid.gov/medicaid/downloads/ce-requirement-ifc-deck.pdf, C), and the June 9, 2026 All-State call slides, p. 2 (CMS content hosted by Georgetown CCF, https://ccf.georgetown.edu/wp-content/uploads/2026/07/CMCS_WorkRequirement_AllStatesCall_SubstantiveSlides_06092026-2-1.pdf), list: GA Pathways population and ESI/HIPP; HI QUEST Integration populations 1, 4 and 5; MA e-HIV/Family Assistance and TANF/EAEDC; NY Medicaid Redesign Team TANF; OR youth with special health care needs; TN TennCare III parent/caretaker expansion; UT adult expansion and Targeted Adults; WI BadgerCare Reform childless adults. Both decks qualify the list with "to date", and the July deck describes the review as still under way.

### Burden figures

Good-faith exemption: about 10 States expected to apply and about 2 approved (91 FR 33429-33430, `2026-11094.txt:2730, 2738`). Ex parte: CMS estimates about 56% of roughly 20 million applicable individuals due for renewal verified without contact, leaving 44%, or 8.8 million, to supply information at 2 hours each every 6 months (`:2830, 2835`); the 20 million is the FY 2025 adult group (`:157`). The hardship ICR assumes all 44 jurisdictions elect hardship "so as not to underestimate" and that 20 request disaster and 20 unemployment events (`:2868, 2994`).

### Early implementers

Nebraska. DHHS page (https://dhhs.ne.gov/Pages/WorkRequirements.aspx, S): enforcement began 2026-05-01; members renewing in May or June 2026 are first checked at their 2027 renewal, and checks began with coverage periods ending on or after 2026-07-31. Existing members need one compliant month in a 12-month review period. 14 counties carry temporary hardships now. Responses are due within 30 days of getting the notice, by QR code, iServe, mail, phone or in person, and a fax number is listed. The frailty process (https://dhhs.ne.gov/Documents/NE%20MWR%20-%20Medically%20Frail%20and%20SUD%20Treatment%20Program%20Exemptions.pdf, updated 2026-09-14) checks claims about 90 days before the period ends, then takes a self-declaration under penalty of perjury with no documentation; the conditions index is at https://dhhs.ne.gov/Documents/Nebraska%20Medicaid%20Work%20Requirements%20-%20Medically%20Frail%20and%20SUD%20Conditions.pdf. SPA (https://www.medicaid.gov/medicaid/spa/downloads/NE-26-0002.pdf, C): submitted 2026-06-07, approved 2026-09-04, effective 2026-05-01, elections as in finding 5. The companion letter finds the frailty definition missing the "significantly impair" test, treats loss of excluded status and transfer into the adult group as actions needing 10 days' advance notice and hearing rights, and asks for a correction timeline within 30 days. Nebraska's frailty criteria should be expected to tighten; no date is published. Third-party: Nebraska Public Media reported Nebraska as the first State to disenroll (T, u).

Montana. Manual CMA 310-1, effective 2026-07-01 (https://dphhs.mt.gov/assets/hcsd/mamanual/CMA310.1.pdf, S), and https://medicaidchanges.mt.gov (S): application lookback the month before; at redetermination 3 months since the last one, not necessarily consecutive; evaluation every 6 months except American Indian and Alaska Native members (annual); all four hardships, unemployment subject to federal approval, with the hardship and its duration verified; household income for the $580 test; reports online, by helpline, mail, fax or in person; 30 days to respond. The SPA was posted for comment on 2026-05-27 with a proposed 2026-07-01 effective date (https://prod-dphhs.mt.gov/assets/montanahealthcareprograms/medicaid/Montana-Medicaid-State-Plan-Amendment-Medicaid-Expansion-Community-Engagement-Requirements-Posted-052726.pdf, S). No approval appears in Medicaid.gov's SPA search.

Arkansas. AR DHS page and FAQ (https://humanservices.arkansas.gov/divisions-shared-services/medical-services/healthcare-programs/arhome/arhome-community-engagement-requirement/arhome-faq/, S): soft launch 2026-07-01, the rule fully starts 2027-01-01; applicants show the month before applying, enrollees at least one month every six months; 30 days plus a call from the Customer Service Center; combined household earnings of $580 satisfy both earners. CMS found the pending ARHOME 1115 renewal incompatible with new budget-neutrality rules; DHS says coverage continues.

Iowa. Page, September 2026 fact sheet (https://hhs.iowa.gov/media/19394/download?inline) and notice 470-0346 (https://hhs.iowa.gov/media/18998/download?inline), all S: effective 2026-12-01; applicants the month before; members at least two months since the last renewal or application; first renewal cohort February 2027; the State "may require" medical documentation for frailty. No Iowa page I read mentions hardship.

Georgia. DCH public notice of 2026-07-09 (https://dch.georgia.gov/document/document/medicaid-community-engagement-requirement-certain-adults-public-notice/download, S): CE SPA effective 2027-01-01 once approved; one month before application; hardship elected; frailty Attachments A and B; Pathways began 2023-07-01. CMS overlay letter of 2026-09-25 (https://www.medicaid.gov/medicaid/section-1115-demonstrations/downloads/ga-pthwys-to-cvrge-wftc-overlay-09252026.pdf, C) applies 1902(xx) to Pathways from 2027-01-01, says Georgia's SPA will have to name the 1115 population, and says all authorities expire 2026-12-31 unless renewed. Its bullet pairs "effective January 1, 2027" with "through December 31, 2026"; I read that as a drafting slip and have not resolved it. Medicaid.gov's demonstration page (https://www.medicaid.gov/medicaid/section-1115-demo/demonstration-and-waiver-list/81441, C) shows status pending, expiry 12/31/2026, and pending applications dated 2025-04-28 and 2026-10-01 (the second an FMAP amendment). Medicaid.gov's Georgia page (C) says current Pathways members see no change until a renewal on or after 2027-01-01.

### SPA status and the template

The MACPro guide (https://www.medicaid.gov/resources-for-states/downloads/macpro-ig-community-engagement-certain-adults.pdf, C; created 2026-08-04, server date 2026-08-11) defines: adult group and/or 1115(a)(2) populations; hardship yes or no, all events if yes; 1, 2 or 3 consecutive months before application; 1 month or 2 to 12 at renewal; more-frequent verification yes or no, every 3 months or every 1, 2, or 4 to 12, with 1 to 12 months; and the "unable to verify" option at renewal. A Medicaid.gov SPA search on 2026-10-16 for the exact phrase "community engagement", approvals since 2026-01-01, returned one SPA, NE-26-0002 (computed). Medicaid.gov posts approvals with a lag, so absence is weak evidence.

### Frailty documentation date

Politico (https://www.politico.com/news/2026/08/09/medicaid-work-requirements-exemptions-medical-frailty-01029777, T, u) lists AR, ID, IN, IA, NC, ND, OH, UT. AP via the Seattle Times (https://www.seattletimes.com/seattle-news/health/as-work-requirements-kick-in-for-medicaid-some-states-are-taking-a-tougher-stance/, T, read) names AR, ID, IN, NH, NC and OH as barring self-attestation from next year, and reports that a Utah law allows self-attestation on a provisional basis. New Hampshire RSA 126-AA:6 (https://gc.nh.gov/rsa/html/X/126-AA/126-AA-6.htm, S, effective 2026-03-27): one month before application with documentary evidence; verification at least quarterly between redeterminations; no self-attestation for activities or exemptions; no optional (xx)(3)(B) exemptions without the oversight committee; frailty only on certification by a listed clinician. Ohio's Group VIII page (S) tells people claiming an exemption to bring proof documents and links an ICD-10 list (https://dam.assets.ohio.gov/image/upload/medicaid.ohio.gov/Providers/group-viii/Copy_of_Medically_Frail_ICD-10_Codes_-_10.29.2025.pdf). South Dakota's page (S) advertises a provider webinar on physician attestation forms for medically frail recipients; whether that form is required in 2027 is U. Montana (S) has members verify when data matching fails and lists a physician statement among examples.

### Colorado (the planned first State profile)

HCPF partner page (https://hcpf.colorado.gov/hr1-medicaid-work-requirements), FAQ (https://hcpf.colorado.gov/work-requirements-faqs) and member page (https://www.healthfirstcolorado.com/changes-are-coming-to-health-first-colorado-colorados-medicaid-program/work-requirements/), all S: starts 2027-01-01; applicants, the calendar month before applying; renewal, one month since the last renewal, a choice HCPF says it made to cut burden; self-attestation accepted during 2027 for certain activity and exemption facts, a VA benefit letter still required for veterans; documentation may be required from 2028; seasonal workers average six months; 30 days to respond. HCPF counts 377,000 of 1.2 million Colorado enrollees in the group. HCPF's frailty list includes people in a hospital or care facility now or in the past three months and SSI or SSDI recipients. I found no hardship election on the three pages. hcpf.colorado.gov returns 403 to non-browser clients, which matters for any automated link check.

### Cross-State items

Household reading of $580: AR FAQ, MT CMA 310-1, NY State of Health (a married couple's combined income), Oregon OHP and PA DHS, all S; Idaho says household income while judging compliance per person. Proxy: Indiana's partner toolkit (https://www.in.gov/fssa/hip/hip-work-requirements/hwr-partner-toolkit, S) converts income to hours at $7.25, so $507.50 counts as 70 hours. Seasonal six-month averages: CO, KY, MO, NC, NM, OK, OR (S); New York says 12 months (S). Response windows: NE SPA F.2 (C) and GA's notice (S) count 30 days from the notice date or issuance; the regulation counts from receipt, presumed 5 days after the notice date (`2026-11094.txt:4296, 4368`). California: a DHCS page extract says the rule covers adults "without children under 13" (u), narrower than the IFC's 13 and under; not checked on the page itself.

## Table A. Elections by jurisdiction

Start [T] means KFF's map lists no early start and the federal deadline, § 435.559(a), applies. Authority U means no approved CE SPA found on Medicaid.gov and no State document naming one.

| State | Start | Authority | App | Renewal | More freq | Hardship | Frailty docs | Other |
|---|---|---|---|---|---|---|---|---|
| AK | 2027-01-01 [T] | U | U | U | U | U | U | Page says AK may seek a delay tied to unemployment [S]; basis not checked |
| AZ | 2027-01 [S] | U | U | U | U | U | U | 6-month renewals [S] |
| AR | soft 2026-07-01; full 2027-01-01 [S] | U | 1 [S] | 1 per 6 months [S] | U; KFF none [T] | U | 2027-01 [T] | Combined household earnings [S] |
| CA | 2027-01-01 [S, u] | U | 1 [county page, u] | U | U | U | U | "Children under 13" wording (u) |
| CO | 2027-01-01 [S] | U | 1 [S] | 1 [S] | U | U | Attest in 2027; docs possible 2028 [S] | Seasonal 6 months [S] |
| CT | 2027-01-01 [T] | U | U | U | U | U | U | |
| DE | 2027-01-01 [T] | U | U | U | U | U | U | Page not fetched |
| DC | 2027-01-01 [T] | U | U | U | U | U | U | Page not fetched |
| GA | Pathways 2023-07-01 [S]; CE 2027-01-01 [C] | 1115 ends 2026-12-31 unless renewed [C]; SPA noticed [S] | 1 [S] | U | U | Yes [S] | U; two-tier list [S] | Members unchanged until 2027 renewal [C] |
| HI | 2027-01-01 [T] | 1115 QUEST pops 1, 4, 5 [C] | U | U | U | U | U | Page 403 |
| ID | periods ending 2027-01-01 on [S] | U | 3 [S] | 3 of 6 [S] | U | Hospital, travel; may request county events [S] | 2027-01 [T] | Per-person compliance [S] |
| IL | 2027-01-01 [S] | U | U | U | U | U | U | |
| IN | 2027-01-01 [S] | U | 3 [S] | 3 before renewal [S] | Every 3 months [S] | U; KFF none [T] | 2027-01 [T] | Proxy at $7.25 [S] |
| IA | 2026-12-01 [S] | U | 1 [S] | 2 [S] | U | U; KFF none [T] | "May require" [S]; 2027-01 [T] | First renewals 2027-02 [S] |
| KY | 2027-01-01 [S] | U | 1 [S] | 3 of 6 [S] | U | All four [S] | U | Seasonal 6 months [S] |
| LA | 2027-01-01 [S] | U | 1 [S] | 1 [S] | U | U | Attest 2027; provider form possible 2028 [S] | Notice 6 months ahead [S] |
| ME | 2027 [S] | U | U | U | U | U | U | |
| MD | 2027-01 [S, u] | U | 1 [S] | 1 recent month [S] | U | U | U | |
| MA | 2027-01-01 [T] | 1115 e-HIV/FA, TANF/EAEDC [C] | U | U | U | U | U | |
| MI | 2027-01-01 [S] | U | U | U | U | U | U | |
| MN | 2027-01-01 [T] | U | U | U | U | U | U | Page text not extractable |
| MO | 2027-01-01 [S] | U | 1 [S] | 1 [S] | U | None [S] | U | Seasonal 6 months [S] |
| MT | 2026-07-01 [S] | SPA posted 2026-05-27 [S]; no approval found [C] | 1 [S] | 3, any months [S] | U | All four [S] | Verify if data fail [S] | Household income [S] |
| NE | 2026-05-01 [S, C] | SPA NE 26-0002 [C] | 1 [C] | 1 [C] | No [C] | Yes [C] | None now [S] | Concurrent option; CMS-ordered fixes [C] |
| NV | 2027-01-01 [T] | U | U | U | U | U | U | |
| NH | 2027-01 [S, u] | U | 1 [S] | U | Quarterly or more [S] | None absent approval [S] | Certification [S] | No self-attestation [S] |
| NJ | 2027-01-01 [S] | U | U | U | U | U | U | Documents may be requested [S] |
| NM | 2027-01-01 [S] | U | 1 [S] | Any month [S] | U | Travel, county events [S] | U | Seasonal 6 months [S] |
| NY | 2027-01-01 [S] | 1115 MRT TANF [C] | U | U | U | All four [S] | U | Seasonal 12 months [S]; couple's income [S] |
| NC | 2027-01-01 [S] | U | 3 [S] | 3 of 6 [S] | U | All four [S] | 2027-01 [T] | Seasonal 6 months [S] |
| ND | 2027-01-01; renewals 2027-02-28 on [S] | U | 1 [S] | 1 [S] | U | U | 2027-01 [T] | |
| OH | 2027-01-01 [S] | U | U | 1 [S] | U | U | Proof to claim [S]; 2027-01 [T] | ICD-10 list 2025-10-29 [S] |
| OK | 2027-01-01 [S] | U | 1 [S] | 1 of 6 [S] | U | All four, draft [S] | Docs from 2028, draft [S] | |
| OR | 2027 [S] | 1115 youth with SHCN [C] | 1 [S] | 1 of 6 [S] | U | All four [S] | Attest 2027; proof 2028 [S] | Household income [S] |
| PA | 2027-01-01 [S] | U | U | U | U | Hospital, travel listed [S] | U | Household income; checked on entry between renewals [S] |
| RI | 2027-01-01 [T] | U | U | U | U | U | U | Page 403 |
| SD | 2027-01-01 [S] | U | 1 [S] | 1 [S] | U | U | Physician form, scope U [S] | |
| TN | 2027 [S] | 1115 TennCare III parents [C] | U | U | U | U | U | Treated as meeting it via income [S] |
| UT | 2027-01-01 [S] | 1115 adult expansion, TAM [C] | 1 [S] | 1 [S] | U | Elected [S] | 2027-01 [T]; contested [T] | |
| VT | 2027-01-01; renewals 2027-03-01 on [S] | U | 1 [S] | 1 [S] | U | U | U | |
| VA | 2027-01-01 [S] | U | U | U | U | U | U | |
| WA | 2027-01-01 [S] | U | U | U | U | U | U | |
| WV | 2027-01-01 [T] | U | U | U | U | U | U | Page not fetched |
| WI | 2027 [S] | 1115 childless adults [C] | 1 [S] | 1, about 12 months [S] | No, annual [S] | All permitted, intent [S] | U | |

## Table B. Beneficiary pages

The English page is the State link Medicaid.gov's per-State page gives (a CMS-published pointer) unless marked "own find". "Read" means fetched with status 200 on 2026-10-16. Spanish entries are CE-specific pages or documents linked from the English page; a translation widget is noted as such.

| State | English page | Read | Spanish |
|---|---|---|---|
| AK | https://health.alaska.gov/en/education/hr-1-ak-impacts/ | yes | none found |
| AZ | https://www.azahcccs.gov/AHCCCS/Initiatives/HR1/ | yes | none found |
| AR | https://humanservices.arkansas.gov/divisions-shared-services/medical-services/healthcare-programs/arhome/arhome-community-engagement-requirement/ (own find) | yes | none CE-specific |
| CA | https://www.dhcs.ca.gov/Medi-Cal/Pages/changes.aspx | yes | none found |
| CO | https://www.healthfirstcolorado.com/changes-are-coming-to-health-first-colorado-colorados-medicaid-program/work-requirements/ (own find) | yes | https://www.healthfirstcolorado.gov/es/changes-are-coming-to-health-first-colorado-colorados-medicaid-program/requisitos-laborales/ ; https://hcpf.colorado.gov/sites/hcpf/files/MA_Work_Requirement_Notice_SP.pdf |
| CT | https://portal.ct.gov/dss-HR1 | yes | translation widget |
| DE | https://dhss.delaware.gov/dmma/ | no | U |
| DC | https://www.dhcf.dc.gov | no | U |
| GA | https://pathways.georgia.gov | yes | none found |
| HI | https://medquest.hawaii.gov/en/members-applicants/already-covered/Stay_Well_Stay_Covered_Toolkit.html | 403 | U |
| ID | https://healthandwelfare.idaho.gov/services-programs/medicaid-health/medicaid-expansion | yes | none found |
| IL | https://hfs.illinois.gov/info/fedresctr/medicaidfedpolicychfs.html | yes | https://hfs.illinois.gov/content/dam/soi/en/web/hfs/sitecollectiondocuments/medicaidfedchagesspanish.pdf |
| IN | https://www.in.gov/fssa/hip/hip-work-requirements/ (own find) | yes | bilingual posters, e.g. https://www.in.gov/fssa/hip/files/HIP-Work-Req-Exemptions-Poster_En-Sp.pdf |
| IA | https://hhs.iowa.gov/medicaid/plans-programs/iowa-health-wellness-plan/ihawp-community-engagement-requirements | yes | member letter https://hhs.iowa.gov/media/18999/download?inline |
| KY | https://khbe.ky.gov/Enrollment/Pages/MedicaidChanges.aspx | yes | https://khbe.ky.gov/Enrollment/MACEHR1/Medicaid_Work_or_Community_Engagement_FAQ_%28Spanish%29.pdf |
| LA | https://www.ldh.la.gov/medicaid/work-requirements | yes | none found |
| ME | https://www.maine.gov/dhhs/ofi/programs-services/health-care-assistance | yes | none found |
| MD | https://health.maryland.gov/mmcp/Pages/workrequirements.aspx (own find) | yes | none found |
| MA | https://www.mass.gov/MassHealthMemberChanges | yes | translation widget |
| MI | https://www.michigan.gov/healthymiplan | yes | sample notice MDHHS-6353-ES linked, not fetched |
| MN | https://mn.gov/dhs/federalchanges/work-requirements/ | yes | U |
| MO | https://dss.mo.gov/community-engagement-requirements-frequently-asked-questions (own find) | yes | none CE-specific |
| MT | https://medicaidchanges.mt.gov | yes | none found |
| NE | https://dhhs.ne.gov/Pages/WorkRequirements.aspx | yes | https://dhhs.ne.gov/Documents/MLTC-WR-Requirements-FAQ-Spanish.pdf plus Spanish notices, form and videos |
| NV | https://www.nevadamedicaid.nv.gov/WorkRequirements | yes | U |
| NH | https://www.dhhs.nh.gov/staycovered | 403 | U |
| NJ | https://www.nj.gov/humanservices/dmahs/obbba/medicaid-federal-changes.shtml | yes | https://www.nj.gov/humanservices/dmahs/obbba/medicaid-federal-changes-sp.shtml |
| NM | https://www.hca.nm.gov/medicaidchanges/ | yes | https://www.hca.nm.gov/cambios-en-medicaid/ |
| NY | https://info.nystateofhealth.ny.gov/stay-covered | yes | none found |
| NC | https://medicaid.ncdhhs.gov/beneficiaries/impact-hr-1-and-federal-changes-medicaid/work-and-community-engagement-requirement (own find) | yes | https://medicaid.ncdhhs.gov/beneficiaries/impact-hr-1-and-federal-changes-medicaid/work-and-community-engagement-requirement/el-requisito-laboral-y-de-participacion-comunitaria-en-espanol |
| ND | https://www.hhs.nd.gov/human-services/medicaid/StayCoveredND | yes | none found |
| OH | https://medicaid.ohio.gov/resources-for-providers/special-programs-and-initiatives/group-viii/medicaid-group-viii (provider-facing) | yes | none found |
| OK | https://oklahoma.gov/ohca/individuals/mysoonercare/work-requirements.html (own find) | yes | none CE-specific |
| OR | https://OHP.Oregon.gov/HR1 | yes | https://www.oregon.gov/oha/HSD/OHP/pages/federal-changes-es.aspx |
| PA | https://www.pa.gov/agencies/dhs/resources/medicaid/medicaid-changes | yes | none found |
| RI | https://staycovered.ri.gov/updates-news/medicaid-updates | 403 | U |
| SD | https://dss.sd.gov/medicaid/HR1.aspx | yes | general languages page only |
| TN | https://www.tn.gov/tenncare/information-statistics/notices.html | yes | none found |
| UT | https://medicaid.utah.gov/obbba/ | yes | https://medicaid-documents.dhhs.utah.gov/Documents/pdfs/H.R.%201%20Community%20Engagement%20Requirement%20and%20Eligibility%20Review%20Member%20Letter%20(Spanish).pdf |
| VT | https://dvha.vermont.gov/medicaidchanges | yes | general language page only |
| VA | https://dmas.virginia.gov/news-updates/new-federal-requirements/ | yes | translation widget |
| WA | https://www.hca.wa.gov/free-or-low-cost-health-care/changes-coming-apple-health | yes | none found |
| WV | https://wvmedicaidhelp.org/ | no | U |
| WI | https://www.dhs.wisconsin.gov/medicaid/work.htm (own find) | yes | Spanish link on page has no target |

Counts from Table B: 12 States link a CE-specific Spanish page or document (CO, IL, IN, IA, KY, MI, NE, NJ, NM, NC, OR, UT) and 3 offer only a translation widget. Medicaid.gov has a Spanish home page at https://www.medicaid.gov/renew-info/es (C); the four per-State Spanish URL patterns I tried returned 404.

## Reach

All 44 jurisdictions have a row. Not fetched: DE, DC, WV. Blocked with 403: HI, RI, NH (NH covered through its statute). Fetched with no election values found: AK, AZ, CT, IL, ME, MA, MI, MN, NV, NJ, VA, WA. Partial: CA, GA, NY, OH, PA, TN.

## Could not verify

- The Politico article body; I saw only its search extract. It is the only source I found for the list of eight as a whole.
- Frailty documentation dates for AR, ID, IN, IA, NC, ND and UT from any State source; Idaho's six-month attestation detail (`state-options.md:274`); North Carolina's statute (`state-options.md:277`).
- Iowa's and Indiana's "no hardship" (`state-options.md:272, 275`), and Arkansas's hardship position. No page I read states them.
- New Hampshire's renewal months and the "every month" entries for NH and Indiana (`state-options.md:275-276`).
- Whether Montana's SPA, or any SPA besides Nebraska's, has been approved but not yet posted.
- Whether Georgia Pathways is extended past 2026-12-31; the 2025-09-23 CMS extension letter itself (seen only through Medicaid.gov listings and a search extract).
- The basis of Alaska's stated option to delay, California's "under 13" wording, and South Dakota's physician form.
- Proxy and predictable-income elections for 43 jurisdictions.
- Whether pre-2027 months can be required, rather than credited, at early-2027 renewals.
- Nebraska disenrollment figures (third-party, not used).

Scratch: deleted `.agents/policy-research-2026-10-16/scratch-L4/` (downloaded public pages and PDFs, text extracts, four helper scripts). Nothing else was written.
