# L6 notices: model, sample and live notices for Medicaid community engagement

Lane L6 of the 2026-10-16 policy research spike. Read-only for the repository.

Skills: this session listed skills by name (hhs-benefits, project-docs, review, stack, writing-code). I loaded
hhs-benefits through the skill tool and also read `.kiro/skills/hhs-benefits/SKILL.md` and `AGENTS.md` directly, as
the step prompt asked.

Tags on claims: [R] regulation text, [P] Federal Register preamble, [G] agency material (federal or State notices,
forms, web pages, slides), [2] secondary (advocacy, research, civic tech, news). V means I read it in the named source
on 2026-10-16. U means I did not, or it is my inference. For [2·V], what is verified is that the secondary source says
it, not the underlying fact. Corpus references are `file:line` under `docs/domain/cms-2454-ifc/`.

No notice was saved to disk. PDFs were parsed in memory. Published samples carry test-style recipient details; I
describe them and do not reproduce them.

## Summary

1. OPEN. I found no CMS model notice of noncompliance (§ 435.558) or model outreach notice (§ 435.561). CMS's community engagement page offers a fact sheet, social media toolkit, flyer and focus-group summary, each in English and Spanish [G·V].
2. STALE. The corpus says the State plan election template is "currently under development" (rule-extract.md:996, state-options.md:309). CMS has posted the MACPro implementation guide for this review unit, PDF created 2026-08-04, whose item F.3 records the Option 1 or Option 2 "unable to verify" election [G·V].
3. ADDITION. Nebraska publishes the only sample notice of noncompliance I found, its Verification of Compliance Notice, in English and Spanish. Against § 435.558(c)(1) it fully carries 4 of 7 elements and partly carries 3. It names no assessed month and says nothing about premium tax credits [G·V].
4. CONFIRMED. The window is about 35 days. Nebraska's sample is dated 2026-05-20 and due 2026-06-24, 35 days later (computed), matching § 435.558(a)(2), (c)(4) and rule-extract.md:731-733 [G·V].
5. ADDITION. States describe the window loosely. Georgia's SPA public notice says 30 calendar days "from the date of issuance", the myth what-matters-most.md:674 already debunks. Colorado, Pennsylvania and Arkansas say 30 days; Nebraska says 30 days from getting the notice [G·V].
6. ADDITION. CMS says the 30-day noncompliance period cannot be stretched to match a longer renewal-form period (91 FR 33411, 2026-11094.txt:2141) [P·V]. HourKeep should never suggest extra time exists.
7. ADDITION. I read 14 State outreach letters from 14 States. 6 say losing Medicaid this way can cost Marketplace financial help, Iowa says only "Marketplace coverage", and 7 say nothing about it (computed) [G·V]. 8 of the 14 carry a printed or revision date before the IFC took effect on 2026-07-31 (computed), so their gaps are not evidence of noncompliance.
8. ADDITION. No beneficiary-facing sample I read is titled "notice of noncompliance". Nebraska's is a Verification Request, Montana's adverse notice is a Notice of Adverse Action, Virginia's request rides in the renewal packet, and others promise a later letter or notice asking for more information [G·V].
9. ADDITION. People will hold letters that start no clock. At its July 2026 soft launch Arkansas notified every ARHOME enrollee of a meeting, not meeting or exempt status, then followed up by email, with no penalty before 2027-01-01. Iowa's deck shows CMS planning its own 4-email, 3-text campaign there for July and August 2026 [G·V].
10. ADDITION. Silence is what loses coverage. KFF reports Nebraska data: 84% of 557 work-requirement denials and 92% of 533 renewal losses followed no response to the request [2·V]. That supports a notice-first HourKeep.
11. ADDITION. Colorado posted its outreach letter template in English and Spanish (PDFs 2026-08-24 and 08-25). HCPF's 2026-09-01 release says letters are going to members who may be affected and puts that group at about 377,000. Renewal lookback: at least 1 calendar month since the last renewal deadline. A March 2026 mock still online says "1 month out of the 6 months before your renewal date" [G·V].
12. ADDITION. Montana went live 2026-07-01 but held people harmless through September and enforces from October 2026. It asks for 3 non-consecutive months at redetermination and has published forms but no sample noncompliance notice (adds to rule-extract.md:782) [G·V].
13. CONFIRMED. Nebraska's notice, Montana's forms and West Virginia's letter all accept fax, and Nebraska, Montana and Colorado all say to send copies, not originals. This supports rule-extract.md:957-958 [G·V].
14. CONFIRMED, with a timing gap. CMS's preamble puts outreach in July, August or September 2026 for 3-, 2- or 1-month lookbacks (91 FR 33420), as rule-extract.md:952-956 says [P·V]. In practice Georgetown CCF reports most States mailed in August [2·V].
15. ADDITION. CMS focus groups (April 2026): enrollees say "work requirements", do not recognise "community engagement", distrust a text unless mail backs it, and want personalised exclusion checklists and step-by-step reporting instructions [G·V].
16. ADDITION. Spanish is the norm. Nebraska, Colorado, Iowa, Virginia, Utah and CMS publish Spanish versions; Virginia publishes 7 languages; Colorado's letter carries taglines in 16 languages, English included (counted) [G·V].
17. OPEN. No published sample of a community engagement denial or termination notice turned up. The corpus also lacks the text of §§ 431.206, 431.210, 431.211, 435.917 and 435.918, which govern that notice and the hearing route [G·V].
18. ADDITION. Outside government: Code for America publishes a model outreach notice (I could not open it), and Georgetown CCF's tracker lists notices or forms for 20 of 43 State rows (computed), misses Colorado's, and files West Virginia's under Washington [2·V].

## 1. Federal material

The CMS community engagement page (https://www.medicaid.gov/resources-for-states/working-families-tax-cut-legislation/community-engagement)
lists the IFC and fact sheet (posted 2026-06-01), the IFC overview deck (2026-07-27), the medical frailty deck
(2026-09-08), the December 2025 CIB and deck, vendor fact sheets, Emmy, and an outreach materials page. It lists no
model notice [G·V].

The outreach materials page (`.../community-engagement/community-engagement-outreach-materials`) has a fact sheet, social
media toolkit, graphics, fillable flyer and qualitative research summary, each in English and Spanish [G·V].

- The fact sheet, "Medicaid Changes are Coming! 4 Things to know" (CMS Product No. 12233, July 2026, 2 pages), tells
  people most States will write by late summer or early fall, to track hours monthly, to gather medical or legal papers
  for exclusions, that they may lose Marketplace financial help, and that they can reapply at any time [G·V].
- The research summary (PDF created 2026-05-15) covers focus groups in four expansion States in early April 2026. It
  ranks trusted channels as member services line, State or county offices, clinics, community organizations, then
  mail or text, and advises against "may affect" and "stay engaged" wording [G·V].

CMS also runs per-State pages at `medicaid.gov/renew-info/<ST>`. I read Colorado's and Nebraska's: one template, a
list of who is and is not affected, and the Marketplace financial-help consequence. Colorado's names Connect for Health
Colorado [G·V]. Iowa's member town hall deck (https://hhs.iowa.gov/media/19038/download?inline, slide 11) names that page
as Iowa's informational website and schedules email sends on 2026-07-06 to 07-20, 08-03 to 08-07, 08-10 to 08-14 and
08-24 to 08-28, and SMS sends on 07-27 to 07-31, 08-10 to 08-14 and 08-24 to 08-28. Another slide calls this a CMS
outreach campaign [G·V]. Whether it ran as planned, or ran in other States, is unknown.

The MACPro implementation guide (https://www.medicaid.gov/resources-for-states/downloads/macpro-ig-community-engagement-certain-adults.pdf,
10 pages, created 2026-08-04) restates the § 435.558 notice and the 30 days from receipt (section F), and makes a State
choose at F.3 between sending the notice with the renewal form or after the form period. It contains no model wording
[G·V].

Two preamble points matter for notice copy. The noncompliance period "cannot be extended" to match a longer
renewal-form period (91 FR 33411; 2026-11094.txt:2141) [P·V]. Outreach goes out in July, August or September 2026 for
States with 3-, 2- or 1-month application lookbacks (91 FR 33420; 2026-11094.txt:2442; § 435.561(b)(1) at
2026-11094.txt:4484) [P·V, R·V].

## 2. Notices of noncompliance (§ 435.558)

### Nebraska's sample, the only one published

Source: https://dhhs.ne.gov/Documents/MWR%20VOCN%20Sample%20-%20ENG.pdf and `...ESP.pdf`, 4 pages each, both PDFs created
2026-04-28, before the IFC was published on 2026-06-03. It is an N-FOCUS "Verification Request" with a "Medicaid Work
Requirements Verification of Compliance Notice - Action Needed" comment, watermarked SAMPLE, with a placeholder
recipient. It says a declaration form is enclosed; the current form is MLTC-118 (6/2026) [G·V].

| § 435.558(c)(1) element | In the sample? | What it does |
|---|---|---|
| (i)(A) months assessed | No | Generic "month before you apply"; no named month; the member rule (any month since last renewal, per the DHHS page) is absent |
| (i)(B) how to show compliance | Yes | Activities, the $580 test, QR code or iServe upload, declaration form |
| (i)(C) deemed compliance | Partly | Names hospital or nursing facility stays and medical travel; says other exceptions and hardships may apply |
| (ii) requirement does not apply | Yes | 12 listed exemptions (2 are hardships), proven by upload or declaration |
| (iii) deadline | Yes | Due date printed twice, 35 days after the notice date (computed) |
| (iv) how to submit | Yes | Online, mail, 3 phone lines plus TTY, fax, in person |
| (v) consequences | Partly | Denial or closure stated; a Marketplace phone number is listed, but no premium tax credit consequence |
| (vi) how to reapply | Yes | Apply again, with contacts |
| (vii) hardship | Partly | 2 of Nebraska's hardships named; the county-based ones are not |

The sample also says DHHS must help the person obtain verifications and not to send originals. It does not mention
fair hearing rights, which § 435.558(c)(1) does not require at this stage [G·V]. Nebraska's page
(https://dhhs.ne.gov/Pages/WorkRequirements.aspx) says this notice goes out when DHHS cannot verify, that people must
respond within 30 days of getting it, by QR code, iServe, mail, phone or in person, and that DHHS will reprocess anyone
in 14 hardship counties who lost coverage, without them acting [G·V].

Nebraska's optional screening questions sample (`Medicaid%20Work%20Requirements%20Screener%20Questions%20(Sample).pdf`,
April 2026) prints both a Date of Notice and a Mail Date, 2 days apart (computed) [G·V]. § 435.558(c)(4) counts from the
date on the notice. Which date a State treats as that date when both appear is unknown.

### How other States describe the step (no sample published)

- Georgia SPA public notice (https://dch.georgia.gov/document/document/medicaid-community-engagement-requirement-certain-adults-public-notice/download,
  7 pages, PDF created 2026-07-06): 30 calendar days from issuance, denial or disenrollment, reapply at any time, 10 days
  advance notice with fair hearing rights, and Pathways amended on or about January 2027 [G·V].
- Colorado (https://hcpf.colorado.gov/hr1-medicaid-work-requirements, published 2026-09-23): a notice saying what is
  needed and 30 days to respond; after that, denial, disenrollment, or review for a lower benefit aid code [G·V].
- Pennsylvania CM 710 outreach letter: a later letter will give 30 days and a due date [G·V].
- Arkansas FAQ (`.../arhome-community-engagement-requirement/arhome-faq/`): a notice, 30 days, and a call from the
  Customer Service Center [G·V].
- Virginia member journey (https://www.dmas.virginia.gov/media/5tbarddv/hr1-work-requirements-member-journey.pdf, PDF
  created 2026-07-28): a renewal packet asking for proof within 30 days, a termination notice with appeal rights, and a
  90-day grace period [G·V]. That pattern looks like the concurrent option (Option 1) [U, inference].
- Montana (https://dphhs.mt.gov/medicaidchanges/): notices on eligibility decisions and noncompliance; appeals follow the
  Notice of Adverse Action [G·V].

## 3. Outreach letters (§ 435.561)

Codes: A who must comply, X exclusions, E exceptions or hardships, H how to comply, M months required at renewal,
F how often reviewed, C Medicaid consequence, P premium tax credit or Marketplace financial help, R how to report
changes, Ap appeal rights, Re reapply. In § 435.558(c)(1) terms: H is (i)(B), X is (ii), E is (i)(C) and (vii), C and P
are (v), Re is (vi). Rows marked "keyword pass" were graded on keyword context, not a full read.

| State | Document, date | Languages | Seen | Notes |
|---|---|---|---|---|
| Nebraska | Notice of Medicaid Work Requirements, Dec 2025 (dhhs.ne.gov/Documents/MLTC-WR-Outreach-Notice.pdf) | EN, ES | A X E H M C R Re | Pre-IFC; "at least one month"; no P |
| Montana | Universal Medicaid Client Communication, 2026-03-16 (dphhs.mt.gov/assets/medicaidchanges/Universal-Medicaid-Client-Communication.pdf) | EN | A X F | Says no action needed and a separate letter comes before renewal |
| Iowa | 470-0346 (06/26), PDF 2026-07-23 (hhs.iowa.gov/media/18998; ES 18999) | EN, ES | A X H M C R, P partly | Cites 42 CFR 435.551, .552, .554 in footnotes; 2 months since last review |
| Colorado | MA Work Requirements Notice, PDF 2026-08-24 (hcpf.colorado.gov/sites/hcpf/files/MA_Work_Requirement_Notice_EN.pdf; _SP) | EN, ES, 16 taglines | A X E H M F C R | "For Reference Only"; institutional stays sit inside the exclusion list |
| Virginia | Initial Outreach Notice, PDF 2026-06-26, revised 08-13 (dmas.virginia.gov/media/fy1ebfyv/...-english.pdf) | EN + 6 | A X E H M F C P R Ap | The most complete letter I read against § 435.561(c) |
| New York | Example Notice of Work Requirements for Medicaid, dated 2026-07-20 (info.nystateofhealth.ny.gov/sites/default/files/Example%20Notice%20of%20Work%20Requirements%20for%20Medicaid.pdf) | EN, in-language help line | A X E H M C P R | All 4 hardships; county ones applied automatically |
| North Carolina | Work and Community Engagement Activities, 2026-06-15 (medicaid.ncdhhs.gov/expansion-expansion-notice-hr-1-english/open) | EN | A X H M F C | 3 of 6 months; tells people to save papers, gives no submission route |
| Pennsylvania | CM 710 (5/26), PDF 2026-08-04 (pa.gov/.../cm-710-medicaid-initial-outreach.pdf) | EN | A X E H M C R | Lists household members affected |
| West Virginia | New Medicaid Rules are Coming, 2026-08-11 (wvmedicaidhelp.org/wp-content/uploads/2026/08/MWRI_CEAugustNotice_20260811.pdf) | EN, ES file | X H C P R; M for applicants only | Members unaffected until renewals from March 2027 |
| Utah | Member Letter (July 2026, GREEN) (medicaid-documents.dhhs.utah.gov/...Member%20Letter%20(English).pdf) | EN, ES | A X H F | No consequence, months or submission route |
| Oregon | Sample ONE Outreach Notice, PDF 2026-08-25 (oregon.gov/oha/HSD/OHP/OHPLetters/ONE-Outreach-Notice-EN.pdf) | EN, other formats on request | X E H M C P R | Keyword pass |
| New Jersey | CE Member Notice, version 2026-09-15 (nj.gov/humanservices/dmahs/documents/providers-stakeholders/obbba/CE_Member_Notice.pdf) | EN | E H M F C P R Re | Keyword pass |
| Louisiana | General Notice SAMPLE, PDF 2026-08-27 (ldh.la.gov/assets/medicaid/HR1/GeneralNotice_SAMPLE.pdf) | EN | X H C | Keyword pass; says coverage may be lost "until you prove" activity, which reads like suspension |
| Arizona | WR-001 (09/2026), PDF 2026-09-10 (keepmyahcccs.com/wp-content/uploads/2026/09/September-Early-Awareness-Work-Requirements-Letter_Eng1.pdf) | EN | X E H M C P R Ap | Keyword pass; headed "informational letter, no action needed" |

By printed or revision date, 8 letters predate 2026-07-31: Nebraska, Montana, Iowa (06/26), New York, North Carolina,
Pennsylvania (5/26), Utah (July 2026) and Louisiana (sample dated 05/04/2026). Virginia's first version (PDF 2026-06-26)
does too, but the posted file was revised 2026-08-13. Missing items in the earlier letters are not evidence of
noncompliance. Utah's Spanish letter exists and is in Spanish; West Virginia's file named Spanish exists, body unread;
North Carolina's Spanish link I did not open.

## 4. Other kinds of letter a person may hold

- Status messages. Arkansas's sample emails (https://humanservices.arkansas.gov/wp-content/uploads/ARHOME-email-notices-726.pdf,
  PDF created 2026-07-21) come in three versions: not meeting, meeting, exempt. They follow a notice sent at the soft
  launch, promise no penalty before 2027-01-01, and say statuses will change as data sources are added [G·V]. A DHS
  deck from August 2026 (posted by the Arkansas Advocate as Exhibit B) says affected people are receiving notices and
  a call-center vendor has begun messaging those not confirmed compliant [G·V]. The DHS page is offered in Spanish and
  Marshallese [G·V].
- Forms and renewal inserts. Nebraska's declaration form (MLTC-118, 6/2026, EN and ES) and screening questions sample;
  Montana's HCS 494 Appendix A (PDF 2026-08-28, revised 10-02) and HCS 495 Appendix B for redetermination (2026-09-21);
  Georgia's Pathways Form 995 (revised 04/2026) [G·V]. CCF's tracker lists Pennsylvania and Ohio volunteer attestation
  forms; I did not open them.
- Determination notices. Nebraska sends an approval notice when it can verify (DHHS page; KFF) [G·V]. No sample is
  published. The content rule is § 435.556(d) (rule-extract.md:549).
- Denial and termination. None published. Arizona's letter promises a separate notice giving the decision, reason, end
  date and appeal rights; Virginia's journey and Montana's page describe the same [G·V].
- Georgia Pathways. Since 2025-10-01 members report at application and annual renewal only
  (https://dch.georgia.gov/announcement/2025-10-01/pathways-updates-oct12025). The program runs to 2026-12-31 and changes
  on 2027-01-01 (https://pathways.georgia.gov/hr-1-changes-pathways), which promises a chance to send more information
  before termination, plus a fair hearing [G·V]. No sample notice is published.

## 5. Advocacy, legal aid and civic tech

- Georgetown CCF, "States are Sending Initial Outreach Notices" (2026-09-11). It finds States unclear on who is
  subject, rarely telling parents living with children that they are mostly unaffected, burying the $580 test (it names
  West Virginia and Pennsylvania), and omitting how to verify (North Carolina) [2·V]. It lists unofficial screeners in
  9 States: CT, CO, IN, LA, MA, NJ, VT, WI, WV [2·V].
- CCF tracker (Google Sheet, last updated 2026-10-12). In the public CSV export I counted 43 State rows, 20 with an
  entry under official notices or self-attestation forms. Colorado's row has none, though HCPF posts its letter, and
  West Virginia's letter is in the Washington row [2·V, computed].
- KFF, "Federal Outreach Requirements and State Plans" (September 2026 per search metadata): Nebraska's December letter
  omits the lookback count; Montana's SPA required notices in April 2026; Nevada tested draft wording with its MAC;
  Pennsylvania is weighing color-coded notices [2·V].
- KFF, "Early Medicaid Work Requirement Insights From Nebraska" (about 2026-09-30): 4,089 applications subject to the
  requirement, 557 denied, 84% for non-response; 7,280 renewals, 533 lost coverage, 92% for non-response [2·V]. The
  underlying MAC deck I did not read.
- Code for America, "Implementing Medicaid Work Requirements: A Guide for States" (July 2026): the notice of
  noncompliance works as a request for information; under the concurrent option no extra time is possible [2·V]. Its
  model outreach notice (https://codeforamerica.org/media/model-medicaid-community-engagement-outreach-notice-template/)
  returned 403 or started a download; not read [2·U].
- Nebraska Medicaid Help (https://nebraskamedicaidhelp.org/), an independent 501(c)(3) unaffiliated with DHHS, offers
  notice triage, policy search and appeal tools [2·V]. This is prior art for a notice-first flow.
- Montana Legal Services Association points to MontanaLawHelp pages on community engagement and hearings
  (https://www.mtlsa.org/2026/10/01/medicaid-resources/) [2·V]. I did not read those pages.
- Found but not read: Justice in Aging's template letter to States, Nebraska Appleseed's February 2026 brief, CLS
  Philadelphia's April 2026 outreach recommendations, SHVS core messages (May 2026), Civilla's DIG screener template
  [2·U].

## 6. What this suggests for HourKeep

These are design inferences from the evidence above [U].

- Notice intake needs at least 6 kinds: State outreach letter, CMS email or text, status message, request for
  information (the § 435.558 notice, possibly inside a renewal packet), determination or approval, and adverse action.
  Only the request for information starts the 30-day clock.
- Capture the printed notice date, any mail date, and the printed due date. Show the due date as the one to meet.
  Show notice date plus 5 plus 30 days as Computed, citing § 435.558(a)(2) and (c)(4). If the printed date is earlier,
  say to meet the printed date and name where to get help.
- Several letters omit the months assessed and the premium tax credit consequence. HourKeep can supply both from the
  rule with citations, labelled Conditional where a State option decides them.
- Lead with "work requirements" and give the regulation's term once; that follows CMS's own research.
- The package should assume copies, fax and print.

## Could not verify

- Code for America's model outreach notice: blocked (403) or forced download; content unread.
- Montana's April 2026 letter to expansion adults, Illinois's notices (shared through Google Drive and possibly real
  received notices, so left unopened), Missouri's AEG notice (the URL returned a web page), Ohio's outreach notice (no
  link in the tracker export).
- Spanish texts for North Carolina, West Virginia, Pennsylvania and New Jersey.
- Whether any State has published a § 435.558 notice template revised after 2026-07-31. Nebraska's sample predates it.
- KFF's Nebraska figures against the MAC deck itself; KFF's exact publication dates.
- CMS's email and text campaign outside Iowa.
- Virginia's Option 1 election, inferred from its journey graphic.
- Whether the Nebraska samples' recipient details are wholly synthetic. They look like test data; I did not reproduce
  them.
- Section 6 is my inference, not a source.

Tooling notes. medicaid.gov blocks non-browser clients, so I read its PDFs through the shared browser session, which
disconnected partway through; later medicaid.gov and Code for America reads failed for that reason. My first browser
navigation wrote a page snapshot (`page-2026-10-16T14-44-57-154Z.yml`) and a console log to `~/.playwright-mcp/`,
outside the repository; I left them because that folder is shared with other sessions. When the report was finished I
deleted every file in `scratch-L6/` (pdftext.js, grade.py, cfa-guide.txt, mt-slides.txt, mt.html, ccf-tracker.csv,
cms-ce-page.html) and the folder itself.
