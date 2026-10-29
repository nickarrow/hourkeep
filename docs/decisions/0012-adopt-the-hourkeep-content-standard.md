# 0012. Adopt the HourKeep content standard for everything a person reads

Date: 2026-10-29

Status: Accepted on 2026-10-29, decided by the owner

## Context

Decision record 0008 named a content standard for everything a person reads as one of the pieces HourKeep wanted from
pull request [#1](https://github.com/nickarrow/hourkeep/pull/1), sent as a pull request of its own. Ron Bronson sent it
as [#5](https://github.com/nickarrow/hourkeep/pull/5): one file, `docs/content-standard.md`, drawing on the eAPD content
guide, the 18F content guide, WCAG 2.2 and GOV.UK's style guide, with each rule naming its source or marked as
HourKeep's own. The owner reviewed it on 2026-10-29, Ron revised it the same day with Claude Code, as his pull
request's description says, and the owner merged it.

Three reviewers read the revision, each against its own source: the rows and the design, the outside sources, and a
cold read as someone writing a screen from it. Among their findings, confirmed against the files: the 5-day receipt
rule restated without the person's right to show they received the notice later; CMS's paraphrase "subject to" quoted
as the SNAP exclusion's own words, which are "not exempt from"; GOV.UK cited for putting button names in quotation
marks, where it uses bold in instructions; two design rules shown without the design's Proposed mark; and citations
that claimed more than their sources. The owner chose to have these fixed on `main` rather than sent back for another
round.

Nothing pointed agents at the standard. `AGENTS.md` holds the four rules that anything HourKeep says must meet, under
"What the software may decide", and a house style written for documents, under "How to write it down", and names no
standard for the words a person reads.

## Decision

`docs/content-standard.md` is HourKeep's standard for every word a person reads: the screens, the printed package, the
site at hourkeep.app and the review pages. It sits below the four rules in `AGENTS.md` under "What the software may
decide" and below the rows, and where it differs from them, they win, as the standard itself says.

Where the standard and `AGENTS.md` say nothing, the AP Stylebook applies, except that dates spell out the month, every
number is a numeral and there are no em dashes. The owner chose AP on 2026-10-29. The 18F content guide, which the
standard draws on, does the same: "We generally follow AP style unless otherwise noted" (its "Our style" page, read
2026-10-29).

`AGENTS.md`, under "This repository", tells agents to read the standard before writing or changing any words a person
reads.

A change to the standard is a change to what a person on Medicaid will read, so the owner decides it, as
`CONTRIBUTING.md` says for anything a person on Medicaid will read.

## Consequences

Every screen, the package and the site have one written standard to be checked against, beside the rows. A sentence
about a rule still answers to its row first.

The standard's examples include rules whose rows do not exist yet, such as the 80 hours a month in
`Logged: 85 hours. Threshold: 80 hours.` Its own rule holds a sentence about a rule until the row is verified, so those
examples wait for their rows before anything ships.

The AP Stylebook is paid, so neither an agent nor most contributors can check a rule against it. The standard states
where it departs from AP. A question about an AP rule nobody here can read is a question about what a person reads,
which `CONTRIBUTING.md` leaves to the owner.

The 18F content guide has been marked archived since January 20, 2025, so a rule the standard takes from it is
HourKeep's to keep up from now on.

## Alternatives considered

Sending the fixes back to the contributor for another round. Each fix was small and confined to one passage, and
another round would have taken more of the contributor's time, and days, for changes the project could make the same
way.

A skill for content, as pull request #1 proposed with the tools' own skills. A skill loads only when its description
matches the work, and a session changing the review pages' wording or a screen's copy may never match it, where
`AGENTS.md` loads in every session.

Following the 18F guide, GOV.UK's or plain language guidance directly, with no standard of HourKeep's own. None of
them knows HourKeep's reader, the rows or the rule that HourKeep never states anyone's status.
