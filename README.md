# HourKeep

HourKeep is a free, open-source app for people on Medicaid facing the new work requirements, also called community
engagement. It is being rebuilt.

It will help a person gather proof for the months their state asks about, and put it in one package to send. It will
keep everything on the person's own device. It will not decide whether anyone meets the requirement. Their state
decides that.

## Who the rule affects

Many adults on Medicaid have to show that they work, volunteer, go to school or job training, or earn enough. The rule
does not apply to some people.

States must start by January 1, 2027. CMS can grant a state a good-faith exemption, which ends by December 31, 2028
at the latest (42 CFR 435.559(a), 435.560(c)). Some states started sooner, so the date depends on the state.

## Where it stands

The first prototype of the screens is in `prototype/`. It runs on a developer's machine and is not deployed.
[hourkeep.app](https://hourkeep.app) still shows a placeholder.

## What is here

| Folder or file | What it holds |
| --- | --- |
| `docs/design.md` | The design: what HourKeep is, who it is for, and what has to be true for it to work |
| `docs/domain/` | The law HourKeep is built on, and the analysis written for it |
| `docs/review/` | Review pages where Medicaid policy experts check each rule. Start at `docs/review/README.md` |
| `docs/epics/` | The plan for each body of work. The first is putting the policy corpus right |
| `docs/decisions/` | Decision records |
| `prototype/` | A browser-only prototype of the screens, with its own README |
| `public/` | The placeholder page and the icons. This is what hourkeep.app serves |
| `scripts/` and `tests/` | The checkers, and their tests |
| `EDITORIAL.md` | The editorial policy |
| `AGENTS.md` and `.kiro/skills/` | The rules the AI agents working here follow |
| `HOW-TO-WORK.md`, `DATA-GUARD.md`, `missions/` | Guides for the people working with those agents |

### The policy corpus

`docs/domain/` holds:

- CMS's interim final rule CMS-2454-IFC, at 42 CFR 435.550 to 435.563
- the 42 CFR 435.603 household income text
- the enrolled text of Public Law 119-21, the 2025 law that created the requirement
- Code for America's service blueprints
- the research, in `docs/domain/research/`

Where the analysis and the regulation disagree, the regulation wins.

The authority is `docs/domain/community-engagement-extract.md`, wherever it has rows. Each row quotes a source stored
in `docs/domain/sources/`, and `docs/domain/sources/MANIFEST.json` lists each source with its hash.

A verification pass on 2026-10-16 found errors in the analysis files. They are being corrected a topic at a time, as
each topic's rows land. Notices of noncompliance and fair hearings came first.

### The review pages

People who know Medicaid policy can check each rule HourKeep relies on, and comment on it, in `docs/review/`.
`scripts/build-review-pages.py` generates the pages from the rows.

### The prototype

`prototype/` carries one made-up case, keeps edits in the browser's local storage, and sends nothing anywhere. It exists
to try the flow in `docs/design.md` with real people. It uses the design's palette but not its stack.

### Editorial checks

`EDITORIAL.md` is the editorial policy. [Prosekeep](https://github.com/quarterback/prosekeep) enforces what a tool
can, through `.editorial.json` and `.github/workflows/editorial.yml`.

The same workflow scores each Agent Action Record in `docs/aar-*.md` with
[ClosedTab](https://github.com/quarterback/closedtab).

Neither checks `docs/domain/`, because it quotes federal law.

### Where the agent files come from

`AGENTS.md`, `.kiro/skills/`, `HOW-TO-WORK.md`, `DATA-GUARD.md` and `missions/` come from the
[agentic engineering bootstrap](https://github.com/nickarrow/agentic-engineering-bootstrap). `NOTICE.md` says so.

## Checking the corpus

You need a git clone of this repository, git, and Python 3.9 or later. Nothing else. From the repository root:

```
python3 -m unittest discover -s tests
python3 scripts/check-corpus.py
```

- The first runs the checker's tests. It takes a few minutes.
- The second checks the corpus itself, and names each problem it finds.

Run both after any change to `docs/domain/`, the skill, the checker, or its tests.

The Formats section of `docs/epics/0001-policy-corpus/design.md` sets the form each problem is measured against.

Neither command can tell whether a row says what its source means. Review does that.

## The first version

The first version of HourKeep was built from November 2025 to October 2026. It is kept on the
[`experiment-1`](https://github.com/nickarrow/hourkeep/tree/experiment-1) branch and the `experiment-1-final` tag,
with its code, tests, plans, decision records and research. Its releases, tagged `v2.0.0` to `v7.0.0`, belong to it
too.

`docs/decisions/0001-set-aside-v1-in-the-same-repository.md` explains why it was set aside, and where each part went.

## Real data stays out

Never put records about real people in this repository, in an issue, or in a pull request. Use made-up data. Building
HourKeep should never need a real record.

If a real record ever has to be on a developer's machine, it goes in `sensitive/`. Git ignores that folder, apart
from one deliberately fake file that proves the guard works.

`DATA-GUARD.md` explains how to stop an AI agent from reading that folder. Each person sets that up on their own
machine.

## License

HourKeep is licensed under the GNU General Public License, version 3 or later. Anyone may use, change or sell it, and
nobody who passes it on may close it. See `LICENSE` and `docs/decisions/0002-keep-gpl-3.0-or-later.md`.

The bootstrap files carry the MIT License, reproduced in `NOTICE.md`.

## Problems, questions and security

- A problem or a question: open an issue.
- A security problem: report it privately, through this repository's Security tab and "Report a vulnerability".
- A comment on a policy row: use the links on the review pages in `docs/review/`, or write to
  [policy@hourkeep.app](mailto:policy@hourkeep.app).

Never include anything about a real person's case.

### Help with your own case

HourKeep cannot see or change anyone's Medicaid case. Contact the office that sent your letter, or find your state's
Medicaid agency on [medicaid.gov](https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip).
