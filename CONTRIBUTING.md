# Contributing to HourKeep

HourKeep is a free, open-source app, being rebuilt, for people on Medicaid facing the new work requirements. It will
help a person gather their proof and package it for their state, and it will never decide whether anyone meets the
requirement. Help is welcome, and the most useful help right now is checking a policy row.

Nick Aretakis ([@nickarrow](https://github.com/nickarrow)) maintains HourKeep. Where its files say "the owner", they
mean him, even in a fork.

If you need help with your own Medicaid case, HourKeep cannot see or change it. Contact the office that sent your
letter, or find your state's Medicaid agency on
[medicaid.gov](https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip).

## Check a policy row

Each rule HourKeep relies on becomes a row in
[`docs/domain/community-engagement-extract.md`](docs/domain/community-engagement-extract.md), a topic at a time, and
the review pages show the rows topic by topic. Start at [`docs/review/README.md`](docs/review/README.md). Each page
links a GitHub issue form, a Google Form that needs no sign-in, and policy@hourkeep.app, so you do not need to use
GitHub at all. If you can, say which source supports your comment: every comment is checked against a source before a
row changes.

## Report a problem

Open an issue saying what you saw, what you expected, and where. A claim in the documents that is wrong or out of date
counts. If you would rather not use GitHub, email policy@hourkeep.app, which takes comments on any of HourKeep's
wording, not only the rows. Never include anything about a real person's case.

## Propose a change

A small fix needs no issue: a typo, a broken link or a failing check, with no change to what anything means.

For anything bigger, open an issue first and say what you want to change and why. A short conversation saves a long
pull request. For a change to any of these, wait for the owner's answer before you start, because the owner decides
them:

- how the project is run: `AGENTS.md`, `CODE_OF_CONDUCT.md`, `DATA-GUARD.md`, `HOW-TO-WORK.md`, `missions/`, `.kiro/`,
  `.github/` and `docs/decisions/`
- what HourKeep is and the order it is built in: `docs/design.md` and `docs/epics/`
- the policy corpus in `docs/domain/`, and anything a person on Medicaid will read

If the owner has already asked for the change, in an issue or a pull request, link to that instead.

Several of these came from the
[agentic engineering bootstrap](https://github.com/nickarrow/agentic-engineering-bootstrap): `AGENTS.md`, apart from
its section "This repository", `DATA-GUARD.md`, `HOW-TO-WORK.md`, `missions/`, and every skill in `.kiro/skills/`
except `medicaid-community-engagement`. A change to how one of them is worded or laid out starts with an issue on the
bootstrap's repository.

## Make the change

Fork the repository, then branch from the `main` of `nickarrow/hourkeep`, not your fork's:

```
git remote add upstream https://github.com/nickarrow/hourkeep.git
git fetch upstream
git switch -c my-change upstream/main
```

Push the branch to your fork with `git push -u origin my-change`, and open the pull request from it, without merging
it into your fork's `main` first. If `upstream/main` moves on before your pull request merges, bring it into your
branch, and merge in no other history.

## House rules

- One change per pull request. A fix, a feature and a rewrite are three pull requests. A change to the wording or
  layout of the documents listed above goes in a pull request of its own, never mixed with a change of substance.
  Fixing what your own change made untrue, such as a path the README names, belongs in the same pull request and is
  not a wording change.
- No real data, anywhere: no records about real people in code, issues, pull requests, screenshots or commits. Use
  made-up data. [`AGENTS.md`](AGENTS.md#what-you-may-look-at), under "What you may look at", lists what is fine and
  what never is. If an agent will read your clone, set up the guard in [`DATA-GUARD.md`](DATA-GUARD.md) first.
- Every change keeps the four rules in [`AGENTS.md`](AGENTS.md#what-the-software-may-decide), under "What the software
  may decide": no model in the path of a decision about a person; anything that could cost a person something is
  readable, names what they can do next, and can be printed and exported; accessibility built in, to WCAG 2.2 AA; and
  a citation on every encoded rule, meaning the section, the URL and a plain paraphrase, with anything that cannot
  carry one labelled as a guess.
- A change that shows a person a rule names the row it rests on, and waits until that row exists and gives a date in
  its Verified field, because anything a person reads waits until the rules it uses are verified
  ([`docs/design.md`](docs/design.md#what-has-to-be-true), "What has to be true"). How much of the corpus a person must
  also have reviewed before a screen ships is one of the design's open questions.
- A change needs a decision record when it changes something already written in the design or a delivery plan, or
  turns down a plausible alternative that somebody will later wonder about. Add one to `docs/decisions/` in the form
  the others use, but write `Status: Proposed`: only the owner accepts a record. Take the next free number, and expect
  it to change when the pull request merges, because `main` keeps moving.
- Your pull request description is the record of your work. Delivery plans and their Done entries are the owner's to
  write, and a session's own notes, agent records, session links and chat transcripts stay out of the repository.
- Work made with an AI agent is welcome. Say in the pull request which agent, and each judgment call it made without
  asking you. Point the agent at this file: the rules in `AGENTS.md` on data and on what the software may decide bind
  every contribution, and where the two files differ on git or on records, this file wins.
- A new dependency or tool names its license and how that fits GPL-3.0-or-later
  ([decision record 0002](docs/decisions/0002-keep-gpl-3.0-or-later.md)), is pinned to an exact version, says whether
  CI runs it, and says whether you maintain it. A new or changed workflow links a passing run of it on your fork.
- Write the way [`AGENTS.md`](AGENTS.md#how-to-write-it-down) asks, under "How to write it down". No em-dashes, for a
  start.
- Commit subjects, and the pull request's title, start with a
  [Conventional Commits](https://www.conventionalcommits.org/) prefix such as `feat:`, `fix:`, `docs:`, `refactor:` or
  `chore:`, with a scope if it helps, as in `feat(corpus):`.

## Run the checks

After any change to `docs/domain/`, the domain skill in `.kiro/skills/medicaid-community-engagement/`, the checker in
`scripts/` or its tests in `tests/`, run these from the root of a clone, with git and Python 3.9 or later and nothing
else installed:

```
python3 scripts/build-review-pages.py
python3 -m unittest discover -s tests
python3 scripts/check-corpus.py
```

The first rebuilds the review pages from the rows, the domain skill, the state facts in `docs/domain/states/` and
`docs/domain/open-questions.md`. The checker fails until the pages match them, so commit any page the rebuild changes.
The tests take a few minutes. The last two must pass under Python 3.9 and under a current Python before a change
merges. Run them under both if you have both, and say in the pull request which you ran. GitHub also runs them, under
Python 3.9 and a current Python, on every push to this repository and on every pull request without a merge conflict.
An outside contributor's run starts once the owner approves it, and its result shows on the pull request.

## Open the pull request

The template asks five things: what changes and where it comes from, what needs a decision, how it was checked, what
was not verified, and which judgment calls an agent made on its own. What you did not check is as useful to know as
what you did. `gh pr create` with `--body` or `--fill` skips the template, so from the command line, copy its headings
from [`.github/pull_request_template.md`](.github/pull_request_template.md) into the body.

## What to expect

HourKeep has one maintainer, working on it around other work. Issues get read, and pull requests may wait. A pull
request that mixes several changes is asked to split, and a piece of it that changes how the project is run may come
from the owner instead, with credit to you. A pull request may also be declined, and you'll get the reason. If your
branch needs a small fix, such as a decision record's number, and you left "Allow edits from maintainers" on, the
owner may push it to your branch and say so in a comment; otherwise you'll be asked to make it.

Report a security problem privately, through this repository's Security tab and "Report a vulnerability", never in an
issue.

Everyone taking part in HourKeep's spaces follows its [code of conduct](CODE_OF_CONDUCT.md). Report a breach of it to
conduct@hourkeep.app.

## License

HourKeep is licensed under the GNU General Public License, version 3 or later, in [`LICENSE`](LICENSE). By
contributing, you agree that your contribution is licensed under it too. The files that came from the bootstrap carry
its MIT License, reproduced in [`NOTICE.md`](NOTICE.md), and a change to one of them is licensed under the MIT License
as well, so it can go back to the bootstrap. `CODE_OF_CONDUCT.md` keeps the Contributor Covenant's license, CC BY-SA
4.0, and so does a change to it.
