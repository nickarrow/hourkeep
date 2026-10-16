# HourKeep

HourKeep is a free, open-source app, now being rebuilt, for people on Medicaid facing the new work requirements, also
called community engagement. Starting no later than January 1, 2027, many adults on Medicaid have to show that they
work, volunteer, go to school or job training, or earn enough, unless the rule does not apply to them. HourKeep will
help a person gather that proof and put it into a package they can send their state.

It will keep everything on the person's own device. It will not decide whether anyone meets the requirement. Their
state makes that decision.

There is no app code in this repository yet. [hourkeep.app](https://hourkeep.app) shows a placeholder until there is.

## What is here

- `docs/domain/` holds the law and regulation HourKeep is built on, with analysis written for this project. The rule
  itself is CMS's interim final rule CMS-2454-IFC, at 42 CFR 435.550 to 435.563. The folder also holds the 42 CFR
  435.603 household income text, the enrolled text of Public Law 119-21, the 2025 law that created the requirement,
  and Code for America's service blueprints. Where the analysis and the regulation disagree, the regulation wins. A
  verification pass on 2026-10-16 found errors in the analysis files that have not been corrected yet.
- `docs/decisions/` holds the decision records. `docs/design.md` will hold the design once it is written.
- `public/` holds the placeholder page and the icons.
- `AGENTS.md` and `.kiro/skills/` hold the rules the AI agents working here follow. `HOW-TO-WORK.md`, `DATA-GUARD.md`
  and `missions/` are for the people working with those agents. All of them come from the
  [agentic engineering bootstrap](https://github.com/nickarrow/agentic-engineering-bootstrap), and `NOTICE.md` says so.

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

HourKeep is licensed under the GNU General Public License, version 3 or later. See `LICENSE`. The bootstrap files carry
the MIT License, reproduced in `NOTICE.md`. Whether the new version keeps this license is still open.

## Problems, questions and security

Open an issue for a problem or a question. Report a security problem privately, through this repository's Security tab
and "Report a vulnerability".

HourKeep cannot see or change anyone's Medicaid case. For help with your own case, contact the office that sent your
letter, or find your state's Medicaid agency on
[medicaid.gov](https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip).
