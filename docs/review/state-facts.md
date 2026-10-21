# State facts

This page is generated from HourKeep's policy rows and is not edited by hand. [How to review and comment](README.md).

Never post or send anything about a real person's case.

Each fact is a value one row depends on, as the federal default or one state sets it, with where it applies and where it comes from.

Each fact's status says how its value is known:

- known: a source states the value.
- inferred: the value is worked out from what a source does say, and its note says from what.
- not published: no source found publishes the value, and its note says where and when the search ran.

## Federal default

### notice-response-period

- The row: [notice-response-period](notices-and-fair-hearings.md#notice-response-period)
- Where it applies: after a notice of noncompliance under 42 CFR 435.558(a)(1)
- The value: a period of 30 calendar days beginning on the date on which such notice of noncompliance is received by the individual
- Counts from: the date on which the notice of noncompliance is received by the individual, presumed under 42 CFR 435.558(c)(4) to be 5 days after the date on the notice unless the individual shows that they did not receive it within the 5-day period
- Status: known
- From: [42 CFR 435.558(a)(2)](https://www.ecfr.gov/current/title-42/section-435.558#p-435.558%28a%29%282%29); [91 FR 39030](https://www.federalregister.gov/citation/91-FR-39030)
- Checked: 2026-10-19 by an AI agent reading the stored text.
- Name to give in a comment: `federal: notice-response-period`
- Comment: [on GitHub](https://github.com/nickarrow/hourkeep/issues/new?template=row-review.yml&row=federal:%20notice-response-period&title=Review:%20federal:%20notice-response-period), [on Google Forms (no account needed)](https://docs.google.com/forms/d/e/1FAIpQLSfmdg1bA4lF_frlMIl8LGIjwUS0ymtHKcqar2aB_h0evB97yQ/viewform?usp=pp_url&entry.399684664=federal:%20notice-response-period), [by email](mailto:policy@hourkeep.app?subject=Review:%20federal:%20notice-response-period)

<details>
<summary>Notes for checking</summary>

The correction's only date of its own is its filing line, docs/domain/sources/federal-register/C1-2026-11094.xml:201 "Filed 6-26-26", so its source_date is 2026-06-26; it was published 2026-06-29. The eCFR XML prints no date of its own; the eCFR date, 2026-10-15, is in the manifest. When a person received the notice is the agency's determination. Whether the date of receipt is the first of the 30 calendar days is an open question. (Corrected 2026-10-19: counts_from said "fixed by 42 CFR 435.558(c)(4)"; full review 2026-10-19, cold reader b1; read in docs/domain/sources/federal-register/C1-2026-11094.xml:174.)

</details>

### notice-presumed-received-after-5-days

- The row: [notice-presumed-received-after-5-days](notices-and-fair-hearings.md#notice-presumed-received-after-5-days)
- Where it applies: any notice of noncompliance under 42 CFR 435.558
- The value: Is considered to be received 5 days after the date on the notice, unless the applicant or beneficiary shows that he or she did not receive the notice within the 5-day period.
- Counts from: the date on the notice
- Status: known
- From: [42 CFR 435.558(c)(4)](https://www.ecfr.gov/current/title-42/section-435.558#p-435.558%28c%29%284%29); [91 FR 39031](https://www.federalregister.gov/citation/91-FR-39031)
- Checked: 2026-10-17 by an AI agent reading the stored text.
- Name to give in a comment: `federal: notice-presumed-received-after-5-days`
- Comment: [on GitHub](https://github.com/nickarrow/hourkeep/issues/new?template=row-review.yml&row=federal:%20notice-presumed-received-after-5-days&title=Review:%20federal:%20notice-presumed-received-after-5-days), [on Google Forms (no account needed)](https://docs.google.com/forms/d/e/1FAIpQLSfmdg1bA4lF_frlMIl8LGIjwUS0ymtHKcqar2aB_h0evB97yQ/viewform?usp=pp_url&entry.399684664=federal:%20notice-presumed-received-after-5-days), [by email](mailto:policy@hourkeep.app?subject=Review:%20federal:%20notice-presumed-received-after-5-days)

<details>
<summary>Notes for checking</summary>

The paragraph does not say whether the 5 days are calendar days; that is an open question. Dates of the sources as for notice-response-period. Whether a person showed they did not receive the notice within the 5-day period is the agency's determination.

</details>

### advance-notice-at-least-10-days

- The row: [advance-notice-at-least-10-days](notices-and-fair-hearings.md#advance-notice-at-least-10-days)
- Where it applies: before the date of action
- The value: The State or local agency must send a notice at least 10 days before the date of action, except as permitted under §§ 431.213 and 431.214
- Counts from: the date of action, counted backward
- Status: known
- From: [42 CFR 431.211](https://www.ecfr.gov/current/title-42/section-431.211); eCFR 2026-10-15
- Checked: 2026-10-19 by an AI agent reading the stored text.
- Name to give in a comment: `federal: advance-notice-at-least-10-days`
- Comment: [on GitHub](https://github.com/nickarrow/hourkeep/issues/new?template=row-review.yml&row=federal:%20advance-notice-at-least-10-days&title=Review:%20federal:%20advance-notice-at-least-10-days), [on Google Forms (no account needed)](https://docs.google.com/forms/d/e/1FAIpQLSfmdg1bA4lF_frlMIl8LGIjwUS0ymtHKcqar2aB_h0evB97yQ/viewform?usp=pp_url&entry.399684664=federal:%20advance-notice-at-least-10-days), [by email](mailto:policy@hourkeep.app?subject=Review:%20federal:%20advance-notice-at-least-10-days)

<details>
<summary>Notes for checking</summary>

The exceptions are 42 CFR 431.213 and 431.214. Of those, only 431.213(d) is stored, in the June 3 printing, and it was not read for this fact; 431.214, and 431.201, which defines the date of action, are not stored. The section does not say whether the 10 days are calendar days; that is an open question. The eCFR XML prints no date of its own; the eCFR date is in the citation. Whether an exception applies to a person is the agency's determination.

</details>

### hearing-request-window-at-most-90-days

- The row: [hearing-request-window-at-most-90-days](notices-and-fair-hearings.md#hearing-request-window-at-most-90-days)
- Where it applies: on appeal, asking for a fair hearing
- The value: not to exceed 90 days from the date that notice of action is mailed
- Counts from: the date that notice of action is mailed
- Status: known
- From: [42 CFR 431.221(d)](https://www.ecfr.gov/current/title-42/section-431.221#p-431.221%28d%29); eCFR 2026-10-15
- Checked: 2026-10-17 by an AI agent reading the stored text.
- Name to give in a comment: `federal: hearing-request-window-at-most-90-days`
- Comment: [on GitHub](https://github.com/nickarrow/hourkeep/issues/new?template=row-review.yml&row=federal:%20hearing-request-window-at-most-90-days&title=Review:%20federal:%20hearing-request-window-at-most-90-days), [on Google Forms (no account needed)](https://docs.google.com/forms/d/e/1FAIpQLSfmdg1bA4lF_frlMIl8LGIjwUS0ymtHKcqar2aB_h0evB97yQ/viewform?usp=pp_url&entry.399684664=federal:%20hearing-request-window-at-most-90-days), [by email](mailto:policy@hourkeep.app?subject=Review:%20federal:%20hearing-request-window-at-most-90-days)

<details>
<summary>Notes for checking</summary>

A ceiling, not a default: the agency must allow a reasonable time, and the State sets its length within the 90 days, as the row's State election says. The paragraph does not define a reasonable time or say whether the 90 days are calendar days; that is an open question. The 90 days count from mailing, where notice-response-period's 30 days count from receipt. The source line ends "to request a hearings." with that typo. The eCFR XML prints no date of its own; the eCFR date is in the citation. Whether a person asked in time is the agency's determination.

</details>

## Colorado

### hearing-request-window-at-most-90-days

- The row: [hearing-request-window-at-most-90-days](notices-and-fair-hearings.md#hearing-request-window-at-most-90-days)
- Where it applies: on appeal, a request for a hearing submitted to the Office of Administrative Courts
- The value: No later than sixty (60) calendar days after the date of the Notice of Action.
- Counts from: the date of the Notice of Action
- Status: known
- From: [10 CCR 2505-10 8.057.4.B.1](https://www.coloradosos.gov/CCR/GenerateRulePdf.do?ruleVersionId=12612&fileName=10%20CCR%202505-10%208.000)
- Checked: 2026-10-17 by an AI agent reading the stored text.
- Name to give in a comment: `co: hearing-request-window-at-most-90-days`
- Comment: [on GitHub](https://github.com/nickarrow/hourkeep/issues/new?template=row-review.yml&row=co:%20hearing-request-window-at-most-90-days&title=Review:%20co:%20hearing-request-window-at-most-90-days), [on Google Forms (no account needed)](https://docs.google.com/forms/d/e/1FAIpQLSfmdg1bA4lF_frlMIl8LGIjwUS0ymtHKcqar2aB_h0evB97yQ/viewform?usp=pp_url&entry.399684664=co:%20hearing-request-window-at-most-90-days), [by email](mailto:policy@hourkeep.app?subject=Review:%20co:%20hearing-request-window-at-most-90-days)

<details>
<summary>Notes for checking</summary>

Colorado's own choice of the reasonable time that 42 CFR 431.221(d) caps at 90 days from the date the notice of action is mailed, so not a conflict in the number. The counting event differs: the rule counts from the date of the Notice of Action and HCPF's page from the date in it, and neither says whether that is the mailing date; that is an open question. HCPF's page also says "You generally have 60 days" (docs/domain/sources/colorado/hcpf-appeals-2026-10-17.html:1006), a hedge the rule does not make. 8.057.3.F.1 at line 2765 of the extraction has similar words about the informal dispute resolution conference and is not this paragraph. 8.057.4.B.1 was read on rendered page 78. The PDF prints no date of its own, so its source_date is not stated; it is version 12612 of 10 CCR 2505-10 8.000, which the Secretary of State's rule-information page shows as the current version with effective date 07/10/2026 and filing type Emergency Rule (docs/domain/sources/colorado/10-ccr-2505-10-8.000-rule-information-2026-10-17.html:241 and :248), read 2026-10-17. How long the emergency rule lasts, and whether the permanent rule changes 8.057, was not read: recheck on state rule, when 8.000 is next filed or the emergency rule lapses. Whether a person asked in time is the agency's determination.

</details>

### agency-may-reinstate-within-10-days-after-action

- The row: [agency-may-reinstate-within-10-days-after-action](notices-and-fair-hearings.md#agency-may-reinstate-within-10-days-after-action)
- Where it applies: on appeal, after the date of action, for a member
- The value: Where the member requests a hearing not more than ten (10) days after the date of action, the member’s services must be reinstated back to the date of action and continued until a final agency decision is rendered after the hearing, unless it is determined at the hearing that the sole issue is one of federal or state law or policy.
- Counts from: the date of action
- Status: known
- From: [10 CCR 2505-10 8.057.5.D](https://www.coloradosos.gov/CCR/GenerateRulePdf.do?ruleVersionId=12612&fileName=10%20CCR%202505-10%208.000)
- Checked: 2026-10-19 by an AI agent reading the stored text.
- Name to give in a comment: `co: agency-may-reinstate-within-10-days-after-action`
- Comment: [on GitHub](https://github.com/nickarrow/hourkeep/issues/new?template=row-review.yml&row=co:%20agency-may-reinstate-within-10-days-after-action&title=Review:%20co:%20agency-may-reinstate-within-10-days-after-action), [on Google Forms (no account needed)](https://docs.google.com/forms/d/e/1FAIpQLSfmdg1bA4lF_frlMIl8LGIjwUS0ymtHKcqar2aB_h0evB97yQ/viewform?usp=pp_url&entry.399684664=co:%20agency-may-reinstate-within-10-days-after-action), [by email](mailto:policy@hourkeep.app?subject=Review:%20co:%20agency-may-reinstate-within-10-days-after-action)

<details>
<summary>Notes for checking</summary>

Colorado's own choice: 42 CFR 431.231(a) says the agency "may" reinstate, and 8.057.5.D says "must", and adds that services are reinstated back to the date of action, which 431.231(a) does not say. The two sources disagree, and that is an open question for HCPF or the Office of Administrative Courts: the rule has the member request a hearing "not more than ten (10) days after" the date of action, while HCPF's page, under its heading "Eligibility appeals" (docs/domain/sources/colorado/hcpf-appeals-2026-10-17.html:1140), says the Office of Administrative Courts must "get your request for an appeal" no later than 10 days "after the date of action" (:1148). A request sent in time by the rule's words could arrive late by the page's. Under that heading the page says a current Health First Colorado member (:1143) whose request arrives in time keeps coverage: "Your coverage will continue until a final decision is made on your appeal." (:1150). It also says a person applying for the first time who does not qualify can appeal, but "there is no continuation of benefits" (:1151). An appeal of a disenrollment for noncompliance is read here as an eligibility appeal; the page does not name community engagement. The page's separate "Benefits appeals" section (:1152) is the services case: if HCPF stopped or reduced "a service we previously authorized" (:1153), the Office of Administrative Courts "must receive your request for an appeal" no later than 10 days from the date of action (:1154). 8.057.5.D was read on rendered page 81. The rule's dates and emergency status are as in the hearing-request-window fact: version 12612, Emergency Rule, effective 07/10/2026; recheck on state rule when 8.000 is next filed or the emergency rule lapses. Whether a request came within the 10 days is the agency's determination.

</details>

### services-maintained-when-hearing-requested-before-action

- The row: [services-maintained-when-hearing-requested-before-action](notices-and-fair-hearings.md#services-maintained-when-hearing-requested-before-action)
- Where it applies: on appeal, before the date of action, for a member
- The value: Where the member requests a hearing before the date of action, the member’s benefits or services may not be terminated or reduced until a final agency decision is rendered after the hearing unless: 1. It is determined at the hearing that the sole issue is one of federal or state law or policy; and 2. If it is determined at the hearing that the sole issue is one of federal or state law in accordance with section 8.057.5.A.1., the member must be promptly informed in writing that services are to be terminated or reduced pending the hearing decision.
- Status: known
- From: [10 CCR 2505-10 8.057.5.A](https://www.coloradosos.gov/CCR/GenerateRulePdf.do?ruleVersionId=12612&fileName=10%20CCR%202505-10%208.000)
- Checked: 2026-10-17 by an AI agent reading the stored text.
- Name to give in a comment: `co: services-maintained-when-hearing-requested-before-action`
- Comment: [on GitHub](https://github.com/nickarrow/hourkeep/issues/new?template=row-review.yml&row=co:%20services-maintained-when-hearing-requested-before-action&title=Review:%20co:%20services-maintained-when-hearing-requested-before-action), [on Google Forms (no account needed)](https://docs.google.com/forms/d/e/1FAIpQLSfmdg1bA4lF_frlMIl8LGIjwUS0ymtHKcqar2aB_h0evB97yQ/viewform?usp=pp_url&entry.399684664=co:%20services-maintained-when-hearing-requested-before-action), [by email](mailto:policy@hourkeep.app?subject=Review:%20co:%20services-maintained-when-hearing-requested-before-action)

<details>
<summary>Notes for checking</summary>

Not a period, so no counts_from. 8.057.5.A does not make the protection depend on the agency having sent the 10-day or 5-day notice under 42 CFR 431.211 or 431.214, as 431.230(a) does; that it otherwise matches 431.230(a) is a reading of both, not a statement in either. 8.057.5.A was read on rendered page 81. The rule's dates and emergency status are as in the hearing-request-window fact: version 12612, Emergency Rule, effective 07/10/2026; recheck on state rule when 8.000 is next filed or the emergency rule lapses. Whether a request came before the date of action is the agency's determination, and whether the sole issue is one of law or policy is determined at the hearing.

</details>

### renewal-notice-with-renewal-form

- The row: [renewal-notice-with-renewal-form](notices-and-fair-hearings.md#renewal-notice-with-renewal-form)
- Where it applies: at renewal (redetermination), under a draft rule that is not adopted
- The value: If available and reliable information is insufficient to establish a Specified Exclusion, Mandatory Exception, or compliance through a Qualifying Activity, a Work Requirements Self-Reporting Form and any required verification requests shall be provided with the redetermination form. The individual shall be provided at least 30 calendar days to provide information establishing that Community Engagement requirements have been met; or The requirement does not apply. The due date for the Work Requirement Self-Reporting Form will align with the redetermination due date.
- Counts from: not stated; the draft says only that the form's due date will align with the redetermination due date
- Status: inferred
- From: [10 CCR 2505-10 8.100.4.G.4.h.iii.2](https://drive.google.com/file/d/1CCPLCno0FQYZi8YtGPckXf2jYttU9HGy/view) and 8.100.4.G.4.h.iii.3, draft, not adopted, page 24; the same draft, page 23, margin lines 885 to 890
- Checked: 2026-10-19 by an AI agent reading the stored text.
- Name to give in a comment: `co: renewal-notice-with-renewal-form`
- Comment: [on GitHub](https://github.com/nickarrow/hourkeep/issues/new?template=row-review.yml&row=co:%20renewal-notice-with-renewal-form&title=Review:%20co:%20renewal-notice-with-renewal-form), [on Google Forms (no account needed)](https://docs.google.com/forms/d/e/1FAIpQLSfmdg1bA4lF_frlMIl8LGIjwUS0ymtHKcqar2aB_h0evB97yQ/viewform?usp=pp_url&entry.399684664=co:%20renewal-notice-with-renewal-form), [by email](mailto:policy@hourkeep.app?subject=Review:%20co:%20renewal-notice-with-renewal-form)

<details>
<summary>Notes for checking</summary>

Inferred, and the draft is not adopted. The draft names neither 42 CFR 435.558(b)(2) option. That Colorado's draft takes renewal-notice-with-renewal-form is inferred from three things read in it: the form is a notice of noncompliance, since the draft's unlabeled paragraph on page 23 (margin lines 885 to 890, extraction lines 1843 to 1846) issues a Work Requirements Form as a notice of noncompliance, and at application h.ii.4 names "A Work Requirements Self-Reporting Form (Notice of Noncompliance)" (extraction line 1860); at renewal it goes with the redetermination form (h.iii.2); and its due date is the redetermination due date (h.iii.3). The next two paragraphs may add a second, shorter period: if the individual returns the redetermination form but the information is incomplete, inconsistent, or raises additional questions, the eligibility site worker will make reasonable efforts to obtain clarification (h.iii.4, margin lines 941 to 944, extraction line 1936), and the individual will be provided at least 10 business days to submit additional requested verification (h.iii.5, margin lines 945 and 946, extraction line 1940). The draft does not say whether those 10 business days cover community engagement information or how they sit with the 30 calendar days, so whether a person has one window or two under the draft is not known. Research L5-3 makes the same mapping and calls it inference. Paragraph labels h.iii.2 to h.iii.5 were read on rendered page 24, h.iii.2 and h.iii.3 on 2026-10-17 and h.iii.4 and h.iii.5 on 2026-10-18, since the extraction separates them from their text. The draft does not say what the 30 days count from at renewal, where 435.558(a)(2) counts from receipt; at application it gives 30 calendar days from receipt (page 23, margin lines 915 to 919). That is an open question for HCPF. The PDF prints no date; its file name carries 2026-09-28, the HCPF stakeholder meeting it was posted for (manifest note). Research ledger L5-1 reports, from an HCPF deck that is not stored, a Medical Services Board reading on 2026-11-27 and effect on 2027-01-01: recheck on state rule when 8.100 is adopted. Shown as known, this fact would be dangerous. Whether a person's information establishes compliance is the agency's determination.

</details>
