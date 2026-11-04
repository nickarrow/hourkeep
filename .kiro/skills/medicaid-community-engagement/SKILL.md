---
name: medicaid-community-engagement
description: Use for anything about Medicaid work requirements, also called community engagement, and the letters about them. Covers who must meet them and who is exempt or excluded, such as parents and caregivers, pregnant or postpartum people, veterans, American Indians and Alaska Natives, former foster youth, people on SNAP or TANF, in treatment or in jail, and people who are medically frail or have special medical needs, such as a serious illness, disability, mental illness or substance use disorder; that no state can waive them; letters saying the state cannot confirm someone met them, deadlines and when a letter counts as received; losing coverage, appeals and fair hearings; the 2027 renewal changes; and Colorado's deadlines. Restates cited rows from docs/domain/community-engagement-extract.md.
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
screening question and names the agency as the one to ask. A session answering a person about their own case does
the same: it gives no estimate of whether the requirement applies to them, such as "probably" or "likely", states none
of their facts as met, names every category their facts may point to and what each requires, labels the agency's part
Deferred and says what to do next. The hhs-benefits skill, `.kiro/skills/hhs-benefits/SKILL.md`, defines the three
labels, Computed, Conditional and Deferred, under "Label every number shown to a person". (Added 2026-10-19; full
review 2026-10-19, cold reader a3.) Where an answer turns on a choice the state makes, say which choice.

When you answer a question from the rule items, name each row you relied on by its identifier, so the answer can be
checked against the extract, and say which skills you loaded. The deadline a person meets is the one printed on their
letter, as `docs/design.md` decides under "The letter"; a deadline counted from the date on the notice is only a
cross-check.

## Topics

- [Notices of noncompliance and fair hearings](references/notices-and-fair-hearings.md): notices of noncompliance,
  meaning when the notice comes, what it must say, the 30 days to answer and what happens after them; fair hearings
  and keeping coverage during an appeal; and renewals already scheduled in 2027. Read it before answering any
  question about those.
- [Who the requirement applies to, and who is excluded from it](references/who-the-requirement-applies-to.md): who
  must meet the requirement, who is excluded, such as caregivers, veterans and SNAP households, and that it cannot be
  waived. Read it before answering those questions.
- [People who are medically frail or have special medical needs](references/medically-frail-or-special-medical-needs.md):
  who is medically frail after the 2026-10-29 court ruling, the State's list of conditions, and how the State
  verifies the status. Read it before answering any question about those.

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
- A court order that vacates, sets aside or enjoins a provision governs over the provision's text, within the order's
  reach, from the day it is entered until it is stayed, reversed or vacated, as decision record 0013 decides. The row
  on the provision quotes the text as printed and cites the order, and the rule item says what is in force. On
  2026-10-29, in Massachusetts v. Oz, D. Mass. 1:26-cv-12962, docket entry 148 vacated and set aside a phrase of
  42 CFR 435.554(c)(5)(i), so the rule items on medical frailty give the definition without it in the plaintiff
  states, Colorado among them, and call its reach elsewhere an open question. Where an order does not state its
  reach, or an order and its memorandum differ, the row quotes each and picks no side, and the question goes in
  `docs/domain/open-questions.md`. A ruling that upholds a provision changes no row.
- Where federal law lets a state choose, the state's own rule governs within the federal limit. Colorado's 60
  calendar days to ask for a hearing sit inside the 90-day ceiling of 42 CFR 431.221(d), and Colorado's rule makes
  the reinstatement that 42 CFR 431.231(a) leaves optional a must. Both are in `docs/domain/states/co.json`. A
  state's draft rule chooses nothing until it is adopted.
- Where two sources conflict, whatever their tiers, the row cites both, the question goes in
  `docs/domain/open-questions.md`, and the topic file that holds the row says there is a conflict without picking
  a side, in prose at the start of the row's group.

## Watch list

Each item is a date or an event and the rows or state facts it could change. The dates come from the research
ledger, `docs/domain/research/2026-10-16-policy/ledger.md`, or from a stored source, as each item says.

- 2026-10-29: Massachusetts v. Oz, D. Mass. 1:26-cv-12962, was decided and dismissed in docket entries 147 to 149
  (ledger L1-11). Event: a new order. Rows: every row that cites entry 148 or 147. The States' motion presses the
  medically frail gate of § 435.554(c)(5)(i) and § 435.557(a)(vii), (a)(viii), (f) and (f)(1); (f) and (f)(1) now
  have rows, and (a)(vii) and (a)(viii) wait for increment 2.6. Each topic holding a provision either suit
  challenges, in its complaint or motion, checks both dockets first (decision record 0007). (Corrected 2026-10-23:
  said "The case challenges the medically frail rules. The research names no row in this topic it would change";
  full review 2026-10-23, corpus against source 9.)
  (Corrected 2026-10-29: said "2026-10-22: the summary judgment hearing in Massachusetts v. Oz, D. Mass.
  1:26-cv-12962 (ledger L1-11). On" and "none with a row yet, and each topic", the sentence on the RECAP check of
  2026-10-23 being in increment 2.1's Done entry; decision record 0013; read in
  docs/domain/sources/courts/massachusetts-v-oz-1-26-cv-12962-148.txt:23.) Through the exclusions a notice must explain,
  it could reach `notice-says-how-to-show-not-applicable` (an inference).
- Taylor v. Kennedy, Jr., D. Md. 1:26-cv-03705 (ledger L1-12), which challenges the words Massachusetts v. Oz
  vacated, stable recovery in § 435.554(c)(5)(i)(B), and the 12-month limit and the one sworn statement of
  § 435.557(f)(1). Under its order of 2026-10-14, entry 28, the government's cross-motion is due 2026-11-03 and the
  last brief 2026-12-02, with no hearing set and no ruling promised before 2027-01-01
  (`docs/domain/research/2026-10-16-policy/L3-statute-litigation.md`, lines 135 and 136). Event: an order on a
  challenged provision. Rows: `medically-frail-defined`, `medically-frail-impairment-phrase-vacated`,
  `medically-frail-substance-use-disorder`, `stable-recovery-read-as-five-consecutive-years` and every row whose
  Note says Taylor v. Kennedy still challenges its provision. (Corrected 2026-10-29: said "with no ruling promised
  before 2027-01-01 (ledger L1-12). Same reach as Massachusetts v. Oz, by the same inference."; ledger L1-12;
  decision record 0007.)
- 2026-12-28: the time to appeal Massachusetts v. Oz ends for any party, 60 days after the judgment under Federal
  Rule of Appellate Procedure 4(a)(1)(B), unless another party's notice of appeal, a motion, an extension or a
  reopening gives more, so a check on or after that day records what the docket held and does not say the ruling
  can no longer be appealed (decision record 0014). The States may appeal the ruling for the defendants on Count II,
  which upheld the limits of § 435.557(f)(1). Rows: every row whose Citation names docket entry 148 or 147, and
  every row whose Note says the court upheld its part of § 435.557(f)(1). Places: the topic file's opening
  paragraph, the review page's orientation in `scripts/review_pages/constants.py`, and the passages of
  `cms-2454-ifc/rule-extract.md`, `what-matters-most.md` and `state-options.md` corrected on 2026-10-29 under
  decision record 0013. (Corrected 2026-11-04: said "4(a)(1)(B) (decision record 0013), so the States may appeal";
  decision record 0014.)
- A motion to alter or amend the judgment in Massachusetts v. Oz under Federal Rule of Civil Procedure 59(e), due
  by 2026-11-27, since the 28 days after the judgment end on Thanksgiving Day, or another motion that Federal Rule
  of Appellate Procedure 4(a)(4)(A) lists. A timely one would have the time to appeal run from the order disposing
  of the last of them, and move the 2026-12-28 date (decision record 0014). Rows and places: those the 2026-12-28
  item names. (Corrected 2026-11-04: said "due 28 days after the judgment. A timely one would have the time to
  appeal run from the order disposing of it, under Federal Rule of Appellate Procedure 4(a)(4)(A)(iv), and move the
  2026-12-28 date."; decision record 0014.)
- A request to stay entry 148, and any stay or reversal of it, each an event of its own whenever it comes. A stay or
  a reversal would bring a dated correction to every place the order touches (decision record 0013). Rows: every
  row whose Citation names docket entry 148 or 147. Places: the topic file's opening paragraph, the review page's
  orientation, and the passages of the older analysis files corrected on 2026-10-29 under decision record 0013.
- A supplemental interim final rule, which the government told the court CMS was likely to issue to reimpose the
  provisions if the court vacated them (docket entry 142, ECF page 19, not stored; decision record 0013). Rows and
  places: `medically-frail-defined`, `medically-frail-impairment-phrase-vacated`, the five group rows, from
  `medically-frail-blind-or-disabled` to `medically-frail-serious-or-complex-condition`,
  `disabling-mental-disorder-examples` and the review page's orientation.
- 2027-04-29: six months from the order of 2026-10-29, by HourKeep's count, since neither entry 148 nor entry 147
  gives an end date. Row: `six-months-without-penalty-for-plaintiff-states`.
- CMS's response to the ruling, such as a revised frailty deck or a statement on the states that did not sue
  (decision record 0013). Rows: `state-may-check-exclusions-in-own-records-first`,
  `documents-state-may-seek-for-frailty`, `stable-recovery-read-as-five-consecutive-years` and those the open
  question on the vacatur's reach names.
- CMS's anticipated five-year lookback, to verify that a person is not in recovery from a substance use disorder for
  5 years or more, notwithstanding the 12-month limit; no row carries it
  (`docs/domain/sources/cms/implementing-medical-frailty-deck-2026-09-08.txt`, lines 755 to 758). Event: guidance or
  a rule that allows it. Rows: `medically-frail-substance-use-disorder`,
  `stable-recovery-read-as-five-consecutive-years` and
  `frailty-verification-uses-no-information-older-than-12-months`.
- 2026-11-30: comments close on the IRS proposed rule at 91 FR 65494 on the premium tax credit bar (ledger L1-9).
  Row: `notice-says-consequences-including-premium-tax-credit`.
- 2026-11-27: on a proposed timeline, updated draft language of 10 CCR 2505-10 8.100 is to be submitted to Colorado's
  Medical Services Board; the timeline then has an emergency rule reading at the Board's meeting of 2026-12-11, a
  proposed effective date of 2027-01-01 and permanent adoption 2027-02-12 (ledger L5-1, from an HCPF deck that is not
  stored). (Corrected 2026-11-04: said "Colorado's Medical Services Board takes up the draft 10 CCR 2505-10 8.100;
  emergency reading 2026-12-11, effective 2027-01-01"; ledger L5-1.) Rows: `renewal-notice-with-renewal-form`,
  `renewal-notice-after-renewal-form-period` and Colorado's inferred renewal fact, whichever option the adopted rule
  takes. The draft's definition of Medically Frail adds to the five groups its own condition, "special medical needs
  that cause significant impairment to work, volunteer, or attend school"
  (`docs/domain/sources/colorado/10-ccr-2505-10-8.100-draft-2026-09-28.txt`, lines 1213 and 1214), which the adopted
  rule may keep or drop. Colorado's facts on how medical frailty is shown, which increment 4 writes, are read against
  the adopted rule and the injunction in Massachusetts v. Oz. Rows: `medically-frail-defined` and
  `medically-frail-impairment-phrase-vacated`. (Added 2026-10-29; read in
  docs/domain/sources/colorado/10-ccr-2505-10-8.100-draft-2026-09-28.txt:1213.)
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
