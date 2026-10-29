# 0013. A court order that sets aside or blocks a provision governs over its text, within the order's reach

Date: 2026-10-29

Status: Accepted on 2026-10-29, decided by the owner

## Context

The corpus ranks its sources: statute and regulation text first, then the preamble, agency guidance and secondary
sources (`docs/epics/0001-policy-corpus/design.md`, "What has to be true of every rule"; the skill's Precedence). Where
two sources conflict, the row cites both, the question goes in `docs/domain/open-questions.md`, and nobody picks a
side. The Formats list a `court` tier, and no row has used it.

On 2026-10-29 the U.S. District Court for the District of Massachusetts decided Massachusetts v. Oz, 1:26-cv-12962.
Its order of vacatur and enjoinment, docket entry 148, declared unlawful, and vacated and set aside under 5 U.S.C.
706(2), the phrase of 42 CFR 435.554(c)(5)(i) "whose physical, mental, or other behavioral health condition
significantly impairs the individual's ability to comply with the community engagement requirement in this subpart
and is an individual". It enjoined CMS from applying that provision to the plaintiff states, Colorado among them, and
from penalizing them for any errors or delays in implementing the rule for six months. Its memorandum, entry 147,
upheld the 12-month limit on the claims and encounter data used to verify medical frailty and the limit of one sworn
statement per period of enrollment from 2028. The judgment, entry 149, dismissed the case. The June 3 printing still
holds the phrase, and nothing published since says CMS will remove it.

Decision record 0007 stopped row work on the challenged provisions until the owner decided how to go on. He decided
the same day that increment 2.2's rows say what is in force after the ruling. Under the rule for conflicts, a row
would cite the regulation and the order and pick neither, and a person would be told the vacated phrase might still
apply to them.

## Decision

An order of a court that vacates, sets aside or enjoins a provision governs over the provision's text, within the
order's reach, from the date the order is entered until it is stayed, reversed or vacated.

- The row on the provision quotes the text as printed and cites the order. A row of the `court` tier says what the
  order did, in its words, and its reach: whom it binds, from when and for how long. The rule item says what is in
  force.
- An order is stored as served, a PDF with its text extraction, under `docs/domain/sources/courts/`, with its manifest
  entry, and rows cite the extraction. The memorandum that explains an order is stored with it.
- Where an order does not state its reach, as entry 148 does not for states that did not sue, or where an order and
  its memorandum say different things, as entry 148's six months and entry 147's description of them do, the row
  quotes each and picks no side, and the question goes in `docs/domain/open-questions.md`.
- A ruling that upholds a provision changes no row. The row's Note says so, with any appeal and any other suit still
  pending against the provision.
- Every row an order touches carries the recheck trigger `court ruling`. The skill's watch list carries the time to
  appeal and any request to stay.

The same holds for any federal court's order on a federal provision the corpus rows, and a state court's on a state's
rule. Increment 2.2 adds this to the epic design's "What has to be true of every rule", the Formats' list of where
sources live, and the skill's Precedence.

Decision record 0007 stands. Its check before rows on a challenged provision now also looks for an appeal, a stay or a
new order.

## Consequences

The corpus says what is in force after a ruling, and a session or a screen built on it does not tell a person that a
vacated phrase applies.

A stay or a reversal brings a dated correction to each row the order touches. The government's time to appeal runs to
2026-12-28, 60 days after the judgment under Federal Rule of Appellate Procedure 4(a)(1)(B), and a stay pending appeal
would make the corrections due sooner. The government also told the court that, if it vacated the challenged
provisions, CMS was likely to reimpose them through a supplemental interim final rule (docket entry 142, ECF page 19).
A new rule would be a new source, and its rows would follow the precedence above.

Whether the vacatur reaches states that did not sue, in CMS's practice, is an open question for CMS. Both sides
briefed vacatur as reaching every state, and entry 148 limits only its injunctions to the plaintiffs.

The corpus stores CourtListener's copies of the orders, from its RECAP archive. govinfo had not published the
memorandum by 20:00 UTC on 2026-10-29. When it does, its copy is a second retrieval if its bytes match, or a source of
its own if they differ, as the Formats say for any re-fetch.

## Alternatives considered

The rule for conflicts as it stands: cite both and pick neither. The row would leave open a phrase a court has set
aside, and an agent or a screen reading it would tell a person the condition might still have to impair their ability
to comply.

Waiting for CMS to amend the regulation or publish guidance before any row. The rows would be missing or wrong in the
meantime, and by 20:05 UTC on the day of the ruling CMS had said nothing public about it.

Rowing only the regulation as printed, with the ruling in a Note. The rule item would restate a vacated phrase as the
rule, and the Note is the field an agent is least likely to read.

Ranking every court decision above the statute and the regulation. A court construes and applies a statute and acts
on a regulation's text. The rule here covers only what an order does to a provision, within its reach.
