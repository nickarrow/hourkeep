# HourKeep

HourKeep is a free, open-source app, now being rebuilt, for people on Medicaid facing the new work requirements, also
called community engagement. Many adults on Medicaid have to show that they work, volunteer, go to school or job
training, or earn enough, unless the rule does not apply to them. States must start by January 1, 2027, unless CMS
grants a state a good-faith exemption, which ends by December 31, 2028 at the latest (42 CFR 435.559(a), 435.560(c)).
Some started sooner, so the date depends on the state. HourKeep will help a person gather their proof and put it into a
package they can send their state.

It will keep everything on the person's own device. It will not decide whether anyone meets the requirement. Their
state makes that decision.

There is no app code in this repository yet. [hourkeep.app](https://hourkeep.app) shows a placeholder until there is.

## What is here

- `docs/domain/` holds the law and regulation HourKeep is built on, with analysis written for this project. The rule
  itself is CMS's interim final rule CMS-2454-IFC, at 42 CFR 435.550 to 435.563. The folder also holds the 42 CFR
  435.603 household income text, the enrolled text of Public Law 119-21, the 2025 law that created the requirement,
  and Code for America's service blueprints. Where the analysis and the regulation disagree, the regulation wins. A
  verification pass on 2026-10-16 found errors in the analysis files. They are corrected a topic at a time, as each
  topic's rows land in `docs/domain/community-engagement-extract.md`, which is the authority wherever it has rows;
  notices of noncompliance and fair hearings came first. Ahead of the other topics, a fix before increment 2.1 corrects
  the ones the research ledger rates dangerous and those about an event or a publication that no topic covers. Each row
  quotes a source stored in `docs/domain/sources/`, which `docs/domain/sources/MANIFEST.json` lists with its hash. The
  research behind it is in `docs/domain/research/`.
- `docs/review/` holds the review pages, where people who know Medicaid policy can check each rule HourKeep relies on
  and comment on it. Start at `docs/review/README.md`. The pages are generated from the rows by
  `scripts/build-review-pages.py`.
- `scripts/` holds the checker that keeps the corpus consistent, and `tests/` its tests.
- `docs/design.md` is the design: what the new HourKeep is, who it is for, and what has to be true for it to work.
  `docs/epics/` holds the plan for each body of work, starting with putting the policy corpus right, and
  `docs/decisions/` holds the decision records.
- `public/` holds the placeholder page and the icons.
- `AGENTS.md` and `.kiro/skills/` hold the rules the AI agents working here follow. `HOW-TO-WORK.md`, `DATA-GUARD.md`
  and `missions/` are for the people working with those agents. All of them come from the
  [agentic engineering bootstrap](https://github.com/nickarrow/agentic-engineering-bootstrap), and `NOTICE.md` says so.

## Checking the corpus

In a git clone of this repository, from its root, with git and Python 3.9 or later and nothing else installed:

```
python3 -m unittest discover -s tests
python3 scripts/check-corpus.py
```

The first runs the checker's tests, which take a few minutes. The second checks the corpus itself and names each
problem it finds. Run both after any change to `docs/domain/`, the skill, the checker or its tests. The Formats
section of `docs/epics/0001-policy-corpus/design.md` sets the form each problem is measured against. Neither command
can tell whether a row says what its source means; review does that.

## The first version

The first version of HourKeep, built from November 2025 to October 2026, is kept on the
[`experiment-1`](https://github.com/nickarrow/hourkeep/tree/experiment-1) branch and the `experiment-1-final` tag: its
code, tests, plans, decision records and research. Its releases, tagged `v2.0.0` to `v7.0.0`, belong to it too.
`docs/decisions/0001-set-aside-v1-in-the-same-repository.md` explains why it was set aside and where each part went.

## Real data stays out

Never put records about real people in this repository, in an issue, or in a pull request. Use made-up data. Building
HourKeep should never need a real record. If one ever has to be on a developer's machine, it goes in `sensitive/`, which
git ignores apart from one deliberately fake file that proves the guard works. `DATA-GUARD.md` explains how to stop an
AI agent from reading that folder, which each person sets up on their own machine.

## License

HourKeep is licensed under the GNU General Public License, version 3 or later, so anyone may use, change or sell it,
and nobody who passes it on may close it. See `LICENSE` and `docs/decisions/0002-keep-gpl-3.0-or-later.md`. The
bootstrap files carry the MIT License, reproduced in `NOTICE.md`.

## Problems, questions and security

Open an issue for a problem or a question. To propose a change, start with [`CONTRIBUTING.md`](CONTRIBUTING.md).
Report a security problem privately, through this repository's Security tab and "Report a vulnerability".

Comments on the policy rows are welcome, through the links on the review pages in `docs/review/` or at
[policy@hourkeep.app](mailto:policy@hourkeep.app). Never include anything about a real person's case.

HourKeep cannot see or change anyone's Medicaid case. For help with your own case, contact the office that sent your
letter, or find your state's Medicaid agency on
[medicaid.gov](https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip).
