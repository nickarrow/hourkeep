# 0008. Take outside contributions one change at a time, through a contributing guide

Date: 2026-10-26

Status: Proposed

## Context

HourKeep's first pull request from outside, [#1](https://github.com/nickarrow/hourkeep/pull/1), opened on 2026-10-22
with 45 files and 6,638 added lines in seven commits. It carried six changes at once: a prototype of the screens, a
prose lint with a CI workflow, a rule that every piece of work commits an agent record, a style guide for screen copy
with its own checker, three decision records, and a rewrite of `docs/design.md`, the epic's design and plan,
`README.md`, `AGENTS.md` and `DATA-GUARD.md`. It came from the `main` branch of the contributor's fork, which carried a
merge of unrelated history, and its new workflow had failed on every push to that fork. By the next day this
repository's `main` had moved on by four commits, and the pull request conflicted in 13 regions of four files. Its
three decision records said "Accepted, decided by the owner", because they were written on the fork, where the agent
doing the work took the contributor for the owner.

The repository had no contributing guide. Nothing told a contributor what size of change to send, what to ask about
first, how to branch, or who decides. `AGENTS.md` says contributions from outside arrive as pull requests, and its git
rules are written for the owner's own sessions. The agent that made #1 worked on the fork's `main`, as the contributor
asked, and nothing it read said to do otherwise for a contribution.

## Decision

`CONTRIBUTING.md`, at the repository root, says how to help: check a policy row, report a problem, or propose and make
a change. It names the owner, Nick Aretakis, and says that "the owner" in HourKeep's files means him, even in a fork.
Most of its rules restate rules this repository already has: no real data, the four rules in `AGENTS.md` under "What
the software may decide", the sequencing rule in `docs/design.md`, decision record 0002's license check, the two
checks and the rebuild of the review pages, and the private route for security reports. One change per pull request
and the commit prefixes are the writing-code skill's advice. The rest is new:

- A small fix needs no issue: a typo, a broken link or a failing check, with no change to what anything means.
  Anything bigger starts with one. For a change to how the project is run, to what HourKeep is and the order it is
  built in, to the policy corpus, or to anything a person on Medicaid will read, the owner answers before work starts,
  unless he has already asked for the change.
- A contributor forks, branches from this repository's `main`, and opens the pull request from that branch, merging
  in no other history.
- A change to the wording or layout of those documents goes in its own pull request, and fixing what a change made
  untrue stays with that change.
- Rewording a file that came from the agentic engineering bootstrap starts with an issue on the bootstrap, and a
  change to such a file is licensed under its MIT License as well as the GPL.
- A contributor's decision record says `Status: Proposed`. Only the owner accepts it, and its number is settled when
  the pull request merges.
- The pull request description is a contributor's record of the work. Delivery plans and their Done entries are the
  owner's, and session notes, agent records, session links and chat transcripts stay out of the repository.
- Work made with an AI agent names the agent and each judgment call it made without asking. For a contribution,
  `CONTRIBUTING.md` wins over `AGENTS.md` on git and on records.
- A new dependency also says whether CI runs it and whether the contributor maintains it, and a new or changed
  workflow links a passing run of it on the contributor's fork.
- If a contributor leaves "Allow edits from maintainers" on, the owner may push a small fix to their branch.
- Comments on any of HourKeep's wording, not only the rows, are welcome at policy@hourkeep.app.

`AGENTS.md`, under "This repository", says who the owner is and tells a session working in a fork, or for anyone else,
to read `CONTRIBUTING.md` before it starts.

`.github/pull_request_template.md` asks what the pull request changes and where it comes from, what needs a decision,
how it was checked, what was not verified, and which judgment calls an agent made on its own. Its headings follow the
description of #1, which said what it changed, what the owner might not want, how it was checked and what was not
verified. The last heading is new.

When a pull request mixes several changes, the owner asks for it to be split. The contributor sends the pieces the
project wants as new pull requests from this repository's `main`. The pieces that change how the project is run come
from the owner instead, crediting the contributor by name. The large pull request is closed once the first new one is
open. For #1, the pieces wanted are the prose lint, a content standard for everything a person reads, and a
restructure of `docs/design.md`. This record and decision record 0009, which takes up one idea from #1, are the pieces
that come from the owner.

## Consequences

A contributor learns the size of change to send, and what to ask about first, before doing the work rather than after
it. A record that arrives as Accepted is sent back as Proposed. The guide restates rules from `AGENTS.md` and
`docs/design.md` rather than holding its own, so a change to one of those rules changes the guide on the same branch.

There is no code of conduct yet. One comes when a second person starts contributing regularly, or before the owner
invites policy experts to comment on the review pages, whichever is first.

## Alternatives considered

Squash-merging #1, as its description offered. One squashed commit would still carry all six changes, the rewrites of
the owner's documents among them, and nothing could separate them afterwards.

The owner takes what the project wants from a large pull request and closes the rest. Used only for a small piece
wanted now, or for a contributor who has gone quiet, with a `Co-authored-by` line in the commit message to credit
them, using an address on their GitHub account so that GitHub counts it. Not the default, because the pieces HourKeep
wants from #1 need rework that is the contributor's own craft, and sending them as new pull requests keeps the
contributor's name on their work.

Asking for #1 to be reworked in place. It came from the fork's `main`, which carries a merge of unrelated history and
all six changes, and its conversation is where the owner divides the pieces.

A contributor license agreement, or a sign-off on every commit. Not adopted. GitHub's terms of service, section D.6,
already license content added to a repository under the license the repository carries, and an agreement that let the
owner relicense contributions would undo decision record 0002, which counts the need for every contributor's
agreement to relicense as part of the point.
