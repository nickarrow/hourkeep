---
name: medicaid-community-engagement
description: Use for anything about Medicaid work requirements, also called community engagement, and the letters about them. Covers a letter saying the state cannot confirm someone met the work requirement, what that letter has to tell them, the deadline to answer and when the letter counts as received, losing or being denied coverage, fair hearings and appeals, bringing someone to help at a hearing, keeping coverage during an appeal, the 2027 renewal changes, and Colorado's deadlines. Restates cited rows from docs/domain/community-engagement-extract.md.
---

# Medicaid community engagement

This skill restates rows of `docs/domain/community-engagement-extract.md` in short form and holds no rule of its own.
Its rule items are in the topic files listed under Topics, and each ends with its row's identifier and citation. The
row, with its stored source, quoted words and limits, is the authority, and where the skill and a row differ, the row
wins. State facts are in `docs/domain/states/federal.json` and `docs/domain/states/co.json`; policy questions nobody
has answered yet are in `docs/domain/open-questions.md`. Paths that begin with docs/ are from the repository root,
not from this skill's folder. Every check so far, of the rows and of the skill, was made by an AI agent.

The rule items say what the rules are and where they come from. Whether a requirement applies to a person, whether they
met it or should be deemed to have met it, whether a showing is satisfactory and when a notice was received are the
agency's determinations, and software built on this skill never computes them. It labels each one Deferred, asks the
screening question and names the agency as the one to ask. The hhs-benefits skill,
`.kiro/skills/hhs-benefits/SKILL.md`, defines the three labels, Computed, Conditional and Deferred, under "Label
every number shown to a person". (Added 2026-10-19; full review 2026-10-19, cold reader a3.) Where an answer turns
on a choice the state makes, say which choice.

When you answer a question from the rule items, name each row you relied on by its identifier, so the answer can be
checked against the extract, and say which skills you loaded. The deadline a person meets is the one printed on their
letter, as `docs/design.md` decides under "The letter"; a deadline counted from the date on the notice is only a
cross-check.

## Topics

- [Notices of noncompliance and fair hearings](references/notices-and-fair-hearings.md): notices of noncompliance,
  meaning when the notice comes, what it must say, the 30 days to answer and what happens after them; fair hearings
  and keeping coverage during an appeal; and renewals already scheduled in 2027. Read it before answering any
  question about those.

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
