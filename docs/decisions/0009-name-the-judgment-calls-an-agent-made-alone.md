# 0009. Name the judgment calls an agent made alone

Date: 2026-10-26

Status: Accepted on 2026-10-26, decided by the owner

## Context

Pull request [#1](https://github.com/nickarrow/hourkeep/pull/1), from Ron Bronson, carried three decision records that
an AI agent wrote on his fork. Each said "Accepted, decided by the owner", and on the fork that meant him. Beside them
he shipped five agent records, `docs/aar-*.md` at #1's head commit `ecb21b7`, in the form set by ClosedTab, his tool
for recording what an agent was asked, what it did and what it decided on its own. They were more exact than the
decision records. The agent had written a CI gate into the fork's `AGENTS.md` without asking, and its record named
that as a point where it should have asked. When a question about deploying the prototype went unanswered, it took the
cautious option, and a decision record then called that the owner's decision. A third decision record rested on one
instruction and a link. Without those agent records, nobody reviewing #1 could have told the contributor's choices
from the agent's.

HourKeep's own records already named one such judgment call. Increment 2.1's Done entry, in
`docs/epics/0001-policy-corpus/delivery-plan.md`, records "The orchestrator's call, for the owner" on which paragraphs
of 28 CFR 35.108 got rows, where the orchestrator is the session that ran that increment's agents. Nothing asks for it
every time.

## Decision

Each increment's Done entry names every judgment call an agent made without asking, so the person can overrule it, or
says there were none. So does the commit message for work done outside an increment, such as a fix. The rule lives in
`AGENTS.md`, under "This repository", which every session in this repository loads. The pull request template and
`CONTRIBUTING.md` ask a contributor the same question.

## Consequences

The record of a piece of work says which choices a person made and which an agent made, the way the review pages say
whether an AI agent or a named person checked each row (decision record 0005). The line is the agent's own report, so
a reviewer checks it like any other claim in the record. It cannot name a judgment call the agent never noticed it
made, so a reviewer also compares what changed with what was asked.

`.kiro/skills/project-docs/SKILL.md`, which came from the agentic engineering bootstrap, describes the Done entry
without this line and stays as it came. If the bootstrap takes the same line, a later update from it brings the line
into the skill, and the line in `AGENTS.md` can go.

## Alternatives considered

Leaving it to chance, as before: an agent names a judgment call when it happens to think of one, as increment 2.1's
orchestrator did once. Nobody can tell a judgment call nobody named from none at all.

Putting the line in the project-docs skill, where the Done entry is described. The skill came from the bootstrap
unchanged, and editing it here would make HourKeep's copy drift from its source, while `CONTRIBUTING.md` sends any
change to how a bootstrap file is worded to the bootstrap instead. The skill also loads only when a session writes a
plan or a record, where `AGENTS.md` loads in every session, fixes included.

An Agent Action Record for every piece of work, committed as `docs/aar-<slug>.md` and scored in CI with ClosedTab, as
#1 proposed. It adds a fourth kind of document beside the design document, the delivery plans and the decision records
that `AGENTS.md` keeps, and it commits a session's own record, which `AGENTS.md` treats as scratch, to the repository
for good. The one part of it this project takes is the line above.
