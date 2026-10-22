# 0007. Adopt Prosekeep for editorial checks and ClosedTab for agent records

Date: 2026-10-22

Status: Accepted, decided by the owner

## Context

`AGENTS.md` has carried a house style since this repository started: no em-dashes, no staged openings, no stock AI
vocabulary, no formulaic contrast, concrete numbers, varied sentence length. Nothing enforced it. Every agent session
read the rules and complied as well as it remembered to.

The owner maintains two tools that do this work. Prosekeep (`quarterback/prosekeep`) is an editorial suite: an Agent
Skill, source-linked standards adapted from 18F, Digital.gov plain language, GSA content standards and USWDS
accessibility, a configurable house style, seven mechanical checks, a review protocol, a CLI and an MCP server.
ClosedTab (`quarterback/closedtab`) scores an Agent Action Record on whether it captured scope, reasoning, who
decided, validation, follow-ups and risks.

Run against this repository's own prose before adoption, Prosekeep's strictest profile reported 0 findings across 21
files. Run against everything, it reported 6,165, of which 6,158 were in `docs/domain/`.

Neither tool's current version is on npm. Prosekeep's repository is 0.3.0 and npm serves 0.2.0, whose rules predate
this configuration; its own README says not to use the versioned commands until 0.3.0 publishes. ClosedTab's
repository is 0.6.0 and npm serves 0.5.0, with a commit recording an authorization problem that blocked the 0.6.0
publish. `npx github:owner/repo#commit` fails on both with an npm packing error, so a git reference cannot stand in
for a published version.

## Decision

`EDITORIAL.md` at the repository root is the editorial policy, filled in from `AGENTS.md` and `docs/design.md`
rather than left as a template. `.editorial.json` configures the checker: the `public-service` profile plus the
`ai-writing` standard, and all seven mechanical rules on, including dashes, which `AGENTS.md` already forbade.

`docs/domain/` and `docs/review/` are outside the lint. The first quotes the Federal Register, the United States
Code and state regulations, which use em-dashes throughout; editing a quoted source to satisfy a style rule would
corrupt the corpus. The second is generated from the rows, so a finding there is fixed in the row.
`.kiro/skills/prosekeep/` and `.kiro/skills/closedtab/` are outside it too, because they are copies of other
repositories.

Both skills are vendored into `.kiro/skills/`, where `AGENTS.md` already sends agents looking, each stamped with the
repository and commit it came from. The CLIs are pinned differently, because their publishing states differ:
`.github/workflows/editorial.yml` checks Prosekeep out at commit `110ec586c17c` and runs it with `node`, and calls
ClosedTab as `npx closedtab@0.5.0`.

`AGENTS.md` now requires an Agent Action Record in `docs/aar-<slug>.md` for each piece of work, including a review or
an abandoned attempt. The workflow fails a record that scores below 6 out of 6.

## Consequences

The style rules are enforced on every push and pull request, on 26 files, instead of being remembered.

A record of what an agent decided on its own is now a condition of the build rather than a habit.

The two tools disagreed on first contact. ClosedTab's record template writes its six headings with an em-dash
(`## 1. Intent — what was supposed to happen`), which Prosekeep's STYLE-04 and this repository's own rule both
forbid. The record committed here uses a colon instead, and ClosedTab still scores it 6 out of 6. Anyone copying the
template verbatim will fail the lint until ClosedTab's template changes.

Prosekeep is pinned to a commit, so the pin has to be moved by hand and will drift. Publishing 0.3.0 replaces the
checkout and both `node` calls with one `npx prosekeep@0.3.0`, and the workflow says so.

The vendored skills will drift from their sources. Each names its commit, so the drift is visible, and neither is
edited here.

A green editorial job proves that seven line patterns did not match 26 files. It does not establish that the writing
is accurate, accessible, readable by a person on Medicaid, or acceptable to the owner.

## Alternatives considered

Pinning both to npm. Prosekeep 0.2.0 would enforce a weaker rule set than the one this project configured, and the
upstream README warns against it.

Installing the skills with `npx skills add quarterback/prosekeep`. It writes to the agent tool's own skills folder.
This repository keeps its skills in `.kiro/skills/`, in git, so every agent and every clone gets the same copy.

Submodules for the two tools. A submodule brings the whole repository, tests and all, for two folders of Markdown,
and a clone without `--recursive` silently loses the skills.

Linting `docs/domain/`. It would report thousands of findings in text nobody may edit.

Leaving the style rules in prose. That is what was happening, and it is why a file written in this session carried
seven findings before the checker was added.
