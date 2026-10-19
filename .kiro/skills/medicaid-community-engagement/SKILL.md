---
name: medicaid-community-engagement
description: Use for anything about Medicaid work requirements, also called community engagement, and the letters about them. Covers a letter saying the state cannot confirm someone met the work requirement, what that letter has to tell them, the deadline to answer and when the letter counts as received, losing or being denied coverage, fair hearings and appeals, bringing someone to help at a hearing, keeping coverage during an appeal, the 2027 renewal changes, and Colorado's deadlines. Restates cited rows from docs/domain/community-engagement-extract.md.
---

# Medicaid community engagement

This skill restates rows of `docs/domain/community-engagement-extract.md` in short form and holds no rule of its own.
Each rule item ends with its row's identifier and citation. The row, with its stored source, quoted words and limits,
is the authority, and where this file and a row differ, the row wins. State facts are in
`docs/domain/states/federal.json` and `docs/domain/states/co.json`; policy questions nobody has answered yet are in
`docs/domain/open-questions.md`. Every check so far, of the rows and of this file, was made by an AI agent.

These items say what the rules are and where they come from. Whether a requirement applies to a person, whether they
met it or should be deemed to have met it, whether a showing is satisfactory and when a notice was received are the
agency's determinations, and software built on this skill never computes them. It labels each one Deferred, asks the
screening question and names the agency as the one to ask. The hhs-benefits skill,
`.kiro/skills/hhs-benefits/SKILL.md`, defines the three labels, Computed, Conditional and Deferred, under "Label
every number shown to a person". (Added 2026-10-19; full review 2026-10-19, cold reader a3.) Where an answer turns
on a choice the state makes, say which choice.

When you answer a question from these items, name each row you relied on by its identifier, so the answer can be
checked against the extract, and say which skills you loaded. The deadline a person meets is the one printed on their
letter, as `docs/design.md` decides under "The letter"; a deadline counted from the date on the notice is only a
cross-check.

## Rules

### Notices of noncompliance and fair hearings

- When the state is unable to verify, in the sense the rule defines, that a person the requirement applies to has met
  it or is deemed to have met it, the state must send them a notice of noncompliance.
  [send-notice-of-noncompliance] 42 CFR 435.558(a)(1); 91 FR 39030
- The state must give the person 30 calendar days to make a satisfactory showing, beginning on the date they receive
  the notice. [notice-response-period] 42 CFR 435.558(a)(2); 91 FR 39030
- Within the 30 calendar days the person may show they met the requirement, or should be deemed to have met it,
  including through the short-term hardship exception where the state offers it, for each month the State plan
  requires. [showing-of-compliance-or-exception] 42 CFR 435.558(a)(2)(i); 91 FR 39030
- Within the 30 calendar days the person may instead show the requirement does not apply to them, because they are
  not an applicable individual, including because they fall in a specified excluded group.
  [showing-requirement-does-not-apply] 42 CFR 435.558(a)(2)(ii); 91 FR 39030
- A person already enrolled keeps getting Medicaid until they are determined ineligible in the way the regulation
  requires. [coverage-continues-during-noncompliance] 42 CFR 435.558(a)(3); 91 FR 39030
- At application, the state is unable to verify when the information the person gave and the reliable information it
  has are not enough to show they met, or are deemed to have met, the requirement for the number of months its State
  plan requires. [unable-to-verify-at-application] 42 CFR 435.558(b)(1); 91 FR 39030-39031
- The preamble says a state may accept an applicant's declaration under penalty of perjury on the application that
  they do not meet the requirement, without further verification, and treat their noncompliance as verified. It is a
  state option, at application only, and the preamble does not say whether a notice of noncompliance still follows.
  [accept-applicant-declaration-of-noncompliance] Preamble to 42 CFR 435.558(b)(1); 91 FR 33411
- At renewal, in a state that chose this option, the state is unable to verify, for the number of months its State
  plan requires, once the reliable information it accesses at renewal is not enough.
  [renewal-notice-with-renewal-form] 42 CFR 435.558(b)(2)(i); 91 FR 39031
- The preamble says that under that option the state must send the notice of noncompliance at the same time as the
  pre-populated renewal form. [notice-sent-with-renewal-form] Preamble to 42 CFR 435.558(b)(2)(i); 91 FR 33411
- In a state that chose the other renewal option, the state is unable to verify, for the number of months its State
  plan requires, after the renewal form is not returned or comes back without enough information.
  [renewal-notice-after-renewal-form-period] 42 CFR 435.558(b)(2)(ii); 91 FR 39031
- The preamble says that under that second option the state would send the notice of noncompliance after the time it
  allowed for returning the renewal form or, if earlier, after the person returned the form without enough
  information. [notice-sent-after-renewal-form-period] Preamble to 42 CFR 435.558(b)(2)(ii); 91 FR 33412
- The preamble says a state using that second option gives the person two separate periods of at least 30 calendar
  days to provide information, with the pre-populated renewal form and with the notice of noncompliance.
  [renewal-form-and-notice-give-two-periods] Preamble to 42 CFR 435.558(b)(2)(ii); 91 FR 33412
- The preamble says that in a state using that second option, the notice of noncompliance is required only when
  community engagement is the only factor of eligibility left to verify after the form's time has passed. Where the
  form also asked about other factors and the person did not return it, or returned it without that other
  information, the state must give notice and fair hearing rights before disenrolling them for procedural reasons,
  and should tell them that returning the form during the reconsideration period may get their eligibility
  reconsidered, and how they may show community engagement during that period.
  [no-noncompliance-notice-when-other-factors-unanswered] Preamble to 42 CFR 435.558(b)(2)(ii); 91 FR 33412
- In a state that checks compliance more often than at renewal and chose this option, the state is unable to verify,
  for the number of months its State plan requires, once the reliable information it accesses is not enough.
  [more-frequent-check-notice-after-data-check] 42 CFR 435.558(b)(3)(i); 91 FR 39031
- The preamble says that under that option the state does not need to send a separate request for information
  before the notice of noncompliance, and that the notice's 30 calendar days meet the duty to seek more information
  before ending eligibility on information the state received.
  [no-separate-request-before-notice-after-data-check] Preamble to 42 CFR 435.558(b)(3)(i); 91 FR 33412
- In such a state that chose the other option, the state is unable to verify, for the number of months its State
  plan requires, after that information is not enough, it asks the person for information under its procedures, and
  what it asked for is not returned or is not enough.
  [more-frequent-check-notice-after-information-request] 42 CFR 435.558(b)(3)(ii); 91 FR 39031
- The preamble says that under that option, if the person does not answer the request or does not send enough, the
  state must then send the notice of noncompliance and give the 30 calendar days to make a satisfactory showing.
  [notice-after-unanswered-information-request] Preamble to 42 CFR 435.558(b)(3)(ii); 91 FR 33412-33413
- The notice of noncompliance must clearly say how to show the person met the requirement or should be deemed to have
  met it, including which month or months the state will assess.
  [notice-says-how-to-show-compliance] 42 CFR 435.558(c)(1)(i)(A)-(C); 91 FR 39031
- It must clearly say how to show the requirement does not apply to the person, because they are not an applicable
  individual, including because they fall in a specified excluded group.
  [notice-says-how-to-show-not-applicable] 42 CFR 435.558(c)(1)(ii); 91 FR 39031
- It must clearly state the deadline for giving the state that information.
  [notice-states-the-deadline] 42 CFR 435.558(c)(1)(iii); 91 FR 39031
- It must describe how the information may be sent to the state, through any of the ways the regulation it
  cross-refers to lists. [notice-says-how-to-submit] 42 CFR 435.558(c)(1)(iv); 91 FR 39031
- It must describe what not meeting the requirement, and not answering the notice, mean for Medicaid and for the
  premium tax credit and its advance payments used to pay for Marketplace coverage.
  [notice-says-consequences-including-premium-tax-credit] 42 CFR 435.558(c)(1)(v); 91 FR 39031
- It must clearly say how the person may reapply for Medicaid if their application is denied or they are disenrolled.
  [notice-says-how-to-reapply] 42 CFR 435.558(c)(1)(vi); 91 FR 39031
- In a state that has elected the short-term hardship exception, it must include the information about short-term
  hardship events the regulation describes.
  [notice-gives-hardship-information-where-elected] 42 CFR 435.558(c)(1)(vii); 91 FR 39031
- The notice must be provided in a manner consistent with the general notice rule the regulation cross-refers to,
  which the extract does not yet cover. [notice-follows-section-435-905b] 42 CFR 435.558(c)(2); 91 FR 39031
- A notice sent electronically must comply with the electronic notice rule the regulation cross-refers to, which the
  extract does not yet cover. [electronic-notice-follows-section-435-918b] 42 CFR 435.558(c)(3); 91 FR 39031
- The notice counts as received 5 days after the date on it, unless the person shows they did not receive it within
  the 5-day period. [notice-presumed-received-after-5-days] 42 CFR 435.558(c)(4); 91 FR 39031
- If no satisfactory showing is made after the 30 calendar days, the state must consider every other basis of
  eligibility before denying coverage at application or finding the person ineligible.
  [consider-all-other-bases-before-denial] 42 CFR 435.558(d)(1); 91 FR 39031
- If no satisfactory showing is made after the 30 calendar days, an applicant found ineligible after all bases are
  considered is denied, with written notice and fair hearing rights.
  [deny-application-with-notice-and-hearing-rights] 42 CFR 435.558(d)(2)(i); 91 FR 39031
- If no satisfactory showing is made after the 30 calendar days, an enrolled person found ineligible after all bases
  are considered is disenrolled no later than the end of the month after the month the 30 calendar days end, and
  only after advance written notice and fair hearing rights.
  [disenroll-with-advance-notice-and-hearing-rights] 42 CFR 435.558(d)(2)(ii); 91 FR 39031
- If no satisfactory showing is made after the 30 calendar days, the specific reasons in the notice of the denial or
  disenrollment must say the person failed both to show they met the requirement, or should be deemed to have met
  it, for the months assessed, and to show the requirement does not apply to them.
  [adverse-notice-names-both-failures] 42 CFR 435.558(d)(2)(iii)(A)-(B); 91 FR 39031
- If no satisfactory showing is made after the 30 calendar days, the state must also determine whether the person
  may be eligible for other insurance affordability programs.
  [check-other-insurance-affordability-programs] 42 CFR 435.558(d)(2)(iv); 91 FR 39031
- The state may not restrict the person's ability to reapply, or to be covered if found eligible on reapplication,
  because of an earlier denial or disenrollment for noncompliance.
  [no-restriction-on-reapplying] 42 CFR 435.558(e); 91 FR 39031
- A person enrolled on MAGI-based eligibility who was disenrolled for not sending information a notice of
  noncompliance asked for, and who sends it during the reconsideration period, must have their eligibility
  reconsidered. The period is 90 days after the date of termination, or longer if the state elects.
  [reconsideration-after-disenrollment] 42 CFR 435.558(f); 91 FR 39031; 42 CFR 435.916(a)(3)(iii); 91 FR 33481
- The agency must issue and publicize its hearing procedures.
  [publicize-hearing-procedures] 42 CFR 431.206(a); eCFR 2026-10-15
- The agency must tell every applicant and beneficiary in writing of their right to a fair hearing and to ask for an
  expedited one, how to get a hearing, that they may represent themselves or use legal counsel, a relative, a friend,
  or other spokesman, and the time frames for the agency's final action.
  [hearing-rights-information] 42 CFR 431.206(b); eCFR 2026-10-15
- It must give that information when the person applies for Medicaid.
  [hearing-rights-at-application] 42 CFR 431.206(c)(1); eCFR 2026-10-15
- It must give it again when it denies a claim for eligibility, benefits or services, denies a request for exemption
  from mandatory enrollment in an Alternative Benefit Plan, takes other action as the regulations define it, or
  whenever a hearing is otherwise required. [hearing-rights-at-denial-or-action] 42 CFR 431.206(c)(2); eCFR 2026-10-15
- Where the agency has delegated its fair hearings to the Exchange or an Exchange appeals entity, it must tell the
  person in writing that they may have their hearing before the agency instead, and how to choose that.
  [hearing-before-agency-instead-of-exchange] 42 CFR 431.206(d); eCFR 2026-10-15
- The hearing information must be accessible to people with limited English proficiency and to people with
  disabilities, and may be given electronically. [hearing-information-accessible] 42 CFR 431.206(e); eCFR 2026-10-15
- A notice of action must say what action the agency intends to take and when it takes effect.
  [notice-of-action-states-action-and-effective-date] 42 CFR 431.210(a); eCFR 2026-10-15
- It must clearly state the specific reasons for the intended action.
  [notice-of-action-states-specific-reasons] 42 CFR 431.210(b); eCFR 2026-10-15
- It must give the specific regulations that support the action, or the change in federal or state law that requires
  it. [notice-of-action-cites-regulations] 42 CFR 431.210(c); eCFR 2026-10-15
- It must explain the person's right to a local evidentiary hearing if there is one, or a State agency hearing, or,
  where the action is based on a change in law, when a hearing will be granted.
  [notice-of-action-explains-hearing-right] 42 CFR 431.210(d); eCFR 2026-10-15
- It must explain when Medicaid continues if a hearing is requested.
  [notice-of-action-explains-continued-coverage] 42 CFR 431.210(e); eCFR 2026-10-15

The items below for 42 CFR 431.211, 431.230 and 431.231 use two terms the corpus has not stored or read: the date of
action, which 42 CFR 431.201 defines, and the 5-day notice, which is 42 CFR 431.214. An answer that turns on either
says so and names the agency as the one to ask. (Added 2026-10-19; full review 2026-10-19, cold reader a1 and a4.)

- The agency must send the notice at least 10 days before the date of action, except where the regulations allow
  otherwise. [advance-notice-at-least-10-days] 42 CFR 431.211; eCFR 2026-10-15
- The State agency must grant an opportunity for a hearing to anyone who asks because they believe it acted wrongly,
  denied their claim for eligibility or for covered benefits or services, issued a determination of their liability,
  or did not act on the claim with reasonable promptness.
  [hearing-required-on-request] 42 CFR 431.220(a)(1); eCFR 2026-10-15
- The agency need not grant a hearing if the only issue is a federal or state law that requires an automatic change
  adversely affecting some or all beneficiaries.
  [hearing-not-required-when-only-issue-is-automatic-change-in-law] 42 CFR 431.220(b); eCFR 2026-10-15
- The agency must let a person, or their authorized representative, ask for a hearing by any of the ways the
  regulations list; the online, telephone and other electronic ways have their own effective date.
  [hearing-request-by-any-modality] 42 CFR 431.221(a)(1)(i); eCFR 2026-10-15
- The agency must let the person include a request for an expedited hearing in their hearing request.
  [expedited-hearing-request] 42 CFR 431.221(a)(1)(ii); eCFR 2026-10-15
- The agency may not limit or interfere with a person's freedom to ask for a hearing.
  [no-interference-with-hearing-request] 42 CFR 431.221(b); eCFR 2026-10-15
- The agency may help the person submit and process their request.
  [state-may-help-with-hearing-request] 42 CFR 431.221(c); eCFR 2026-10-15
- The agency must allow a reasonable time to ask for a hearing, not to exceed 90 days from the date the notice of
  action is mailed. The state sets the time within that limit.
  [hearing-request-window-at-most-90-days] 42 CFR 431.221(d); eCFR 2026-10-15
- If the agency sent the 10-day or 5-day notice and the person asks for a hearing before the date of action, the
  agency may not end or reduce services until the hearing decision, unless the hearing finds the only issue is one of
  federal or state law or policy and the agency promptly tells the person in writing.
  [services-maintained-when-hearing-requested-before-action] 42 CFR 431.230(a); eCFR 2026-10-15
- If the hearing decision upholds the agency, it may seek to recover the cost of services given only because of that
  continued coverage. [recovery-if-action-upheld] 42 CFR 431.230(b); eCFR 2026-10-15
- The agency may reinstate services if the person asks for a hearing not more than 10 days after the date of action.
  [agency-may-reinstate-within-10-days-after-action] 42 CFR 431.231(a); eCFR 2026-10-15
- Reinstated services must continue until the hearing decision, unless the hearing finds the only issue is one of
  federal or state law or policy. [reinstated-services-continue-until-decision] 42 CFR 431.231(b); eCFR 2026-10-15
- If the agency acted without the required advance notice, the person asks for a hearing within 10 days of receiving
  the notice of action, and the agency determines the action came from something other than applying federal or
  state law or policy, it must reinstate and continue services until the hearing decision. The notice counts as
  received 5 days after its date unless the person shows that they did not receive it within those 5 days.
  [must-reinstate-after-action-without-advance-notice] 42 CFR 431.231(c); eCFR 2026-10-15
- If a person's whereabouts were unknown because agency mail came back unforwardable, discontinued services must be
  reinstated if their whereabouts become known while they are eligible. This paragraph sunsets on October 1, 2034.
  [reinstate-when-whereabouts-become-known] 42 CFR 431.231(d); 91 FR 33469
- The statute's requirement that a state redetermine eligibility once every 6 months does not apply to an individual
  who is an Indian or an Urban Indian as the Indian Health Care Improvement Act defines those terms, a California
  Indian described in section 809(a) of that Act, or someone otherwise determined eligible as an Indian for the Indian
  Health Service. [six-month-renewals-do-not-apply-to-exempt-american-indians-and-alaska-natives]
  SSA 1902(e)(14)(L)(ii); Pub. L. 119-21, sec. 71107
- For people already enrolled in a 12-month eligibility period in the adult expansion group on January 1, 2027, whose
  renewals are already scheduled in 2027, CMS says a state may move the renewal earlier to give as close to a 6-month
  eligibility period as possible, but no earlier than January 1, 2027, which CMS says is practically January 4, 2027.
  By the adult expansion group CMS means the people subject to 6-month renewals under the state plan or a
  demonstration, which leaves out certain American Indians and Alaska Natives; this and the next two items use it so.
  [reschedule-2027-renewals-to-six-months] CMS SMD 26-001, pp. 4, 7-8
- For the same people, CMS says a state may instead keep the 12-month period and the renewal already scheduled in
  2027, giving a 6-month period at that renewal to those who stay eligible in the adult expansion group.
  [keep-scheduled-2027-renewals] CMS SMD 26-001, pp. 4, 7, 8, 10
- A state taking the first path should not shorten the previously approved eligibility period of a person in the
  adult expansion group as of January 1, 2027 to less than 6 months.
  [first-path-period-not-shorter-than-six-months] CMS SMD 26-001, pp. 4, 8
- CMS considers shortening an eligibility period an action, so a state taking the first path must tell the people
  affected and give at least 10 days' advance notice with fair hearing rights.
  [shortened-renewal-period-needs-advance-notice] CMS SMD 26-001, p. 9

## Precedence

When two sources disagree, this is the order. It comes from the epic design,
`docs/epics/0001-policy-corpus/design.md`, under "A rule row" and "What has to be true of every rule".

- For 42 CFR 435.557 and 435.558, the June 29, 2026 correction,
  `docs/domain/sources/federal-register/C1-2026-11094.xml`, governs over the June 3, 2026 printing of the interim
  final rule. The manifest marks the June 3 printing superseded for those two sections. For the rest of the interim
  final rule, the June 3 printing governs.
- The extract governs over the older analysis files in `docs/domain/`: `cms-2454-ifc/rule-extract.md`,
  `cms-2454-ifc/what-matters-most.md`, `cms-2454-ifc/state-options.md` and `hr1/HR1-Impact-Summary.md`. Where one of
  them says something no row says, it is unverified until a row carries it.
- The stored source a row cites governs over any summary of it, the row's own Rule and this file included. If a
  row's words and its source's words differ, the source wins and the row is corrected, with its date.
- A row cites the highest source there is: statute and regulation text first, then the preamble, then CMS guidance
  such as SMD 26-001, then a secondary source. On the state side, a state regulation comes before a state draft rule
  and a state agency page.
- Where federal law lets a state choose, the state's own rule governs within the federal limit. Colorado's 60
  calendar days to ask for a hearing sit inside the 90-day ceiling of 42 CFR 431.221(d), and Colorado's rule makes
  the reinstatement that 42 CFR 431.231(a) leaves optional a must. Both are in `docs/domain/states/co.json`. A
  state's draft rule chooses nothing until it is adopted.
- Where two sources conflict, whatever their tiers, the row cites both, the question goes in
  `docs/domain/open-questions.md`, and this file says there is a conflict without picking a side. In this topic,
  Colorado's rule reinstates a member's services back to the date of action and continues them until a final agency
  decision after the hearing "Where the member requests a hearing not more than ten (10) days after the date of
  action", while HCPF's appeals page has the Office of Administrative Courts get the request no later than 10 days
  after the date of action. Whether the 10 days run to the member's request or to the court's receipt of it is an
  open question. The next action picks no side: make sure the request arrives within the 10 days. (Corrected
  2026-10-19: said "HCPF's appeals page has the Office of Administrative Courts receive a request within 10 days,
  where Colorado's rule has the member request a hearing within 10 days."; full review 2026-10-19, cold reader a2;
  read in docs/domain/states/co.json:38.) And for reschedule-2027-renewals-to-six-months,
  keep-scheduled-2027-renewals and first-path-period-not-shorter-than-six-months, 42 CFR 435.916(a)(1), as the
  interim final rule reprints it, says MAGI-based eligibility is renewed once every 12 months and no more often,
  where SSA 1902(e)(14)(L) has the state redetermine, once every 6 months for redeterminations scheduled from 2027,
  individuals enrolled under SSA 1902(a)(10)(A)(i)(VIII), and individuals it describes who are enrolled under a
  waiver giving all of them coverage equivalent to minimum essential coverage, except the American Indians and
  Alaska Natives the statute exempts. Those rows cite both, and which governs is an open question.

## Watch list

Each item is a date or an event and the rows or state facts it could change. The dates come from the research
ledger, `docs/domain/research/2026-10-16-policy/ledger.md`, or from a stored source, as each item says.

- 2026-10-22: the summary judgment hearing in Massachusetts v. Oz, D. Mass. 1:26-cv-12962 (ledger L1-11). The case
  challenges the medically frail rules. The research names no row in this topic it would change; through the
  exclusions a notice must explain it could reach `notice-says-how-to-show-not-applicable` (an inference).
- Taylor v. Kennedy, Jr., D. Md. 1:26-cv-03705, with no ruling promised before 2027-01-01 (ledger L1-12). Same reach
  as Massachusetts v. Oz, by the same inference.
- 2026-11-30: comments close on the IRS proposed rule at 91 FR 65494 on the premium tax credit bar (ledger L1-9).
  Row: `notice-says-consequences-including-premium-tax-credit`.
- 2026-11-27: Colorado's Medical Services Board takes up the draft 10 CCR 2505-10 8.100; emergency reading
  2026-12-11, effective 2027-01-01, permanent adoption 2027-02-12 (ledger L5-1, from an HCPF deck that is not
  stored). Rows: `renewal-notice-with-renewal-form`, `renewal-notice-after-renewal-form-period` and Colorado's
  inferred renewal fact, whichever option the adopted rule takes.
- Colorado's 10 CCR 2505-10 8.000, version 12612, is an emergency rule effective 2026-07-10, by the stored
  rule-information page (`docs/domain/sources/colorado/10-ccr-2505-10-8.000-rule-information-2026-10-17.html`,
  lines 241 and 248). Event: the emergency rule lapses or a permanent rule is filed, eDocket 2026-00296 and
  2026-00357 (lines 267 and 271). No lapse date is stored. State facts in `co.json` for
  `hearing-request-window-at-most-90-days`, `agency-may-reinstate-within-10-days-after-action` and
  `services-maintained-when-hearing-requested-before-action`.
- 2034-10-01: 42 CFR 431.231(d) sunsets, and the paragraph says CMS will follow rulemaking procedures so that
  replacement policies take effect that day.
  Row: `reinstate-when-whereabouts-become-known`.
- SNAP's pending rule, RIN 0584-AF10, under OIRA review since 2025-10-24 (ledger L7-10). No row in this topic.
- A final rule or a further correction notice for the interim final rule. Every row citing 42 CFR 435.558, and the
  seven preamble rows.
- The next eCFR check of the part 431 sections, read as of 2026-10-15. Every row citing 42 CFR part 431.
- A CMS model notice of noncompliance, which the research found none of (ledger L2-17, research L6 finding 1), or
  further CMS guidance. The seven rows
  for what the notice must say, from `notice-says-how-to-show-compliance` to
  `notice-gives-hardship-information-where-elected`, and the four SMD 26-001 rows.
