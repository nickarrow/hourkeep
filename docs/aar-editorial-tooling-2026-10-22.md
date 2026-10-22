# Agent Action Record: install Prosekeep and ClosedTab

**Review date:** 2026-10-22
**Reviewed by:** agent self-review
**Agent / system:** Claude Code (Claude Opus 5), cloud session
**Task or period under review:** adopting the owner's editorial lint and Agent Action Record tool in HourKeep
**Accountable human (name or role):** the repository owner (Ron), who named both tools

## 1. Intent: what was supposed to happen

**Instruction given (actual wording):** "the tool would strongly benefit from linting from my editorial style
stystem and an install of my aar tool as well", with links to `github.com/quarterback/prosekeep` and
`github.com/quarterback/closedtab`.

**Success defined in advance as:** not defined in advance. The agent took it as: both tools installed in HourKeep,
configured for this repository rather than left at defaults, running in CI, and the repository passing them.

**Authority granted to the agent:** to install both tools. Everything about how was the agent's to choose.

**Out of scope:** changing either tool's own repository. Rewriting HourKeep's prose to suit the lint, which turned
out not to be needed.

## 2. Action: what actually happened

**What the agent did (step by step):**

1. Cloned `quarterback/prosekeep`, which the session could read but had not attached. Read its README, profiles,
   `src/check.mjs` rules, `SKILL.md` and `templates/EDITORIAL.md`. Read the `quarterback/closedtab` checkout already
   in the session.
2. Checked both against npm. Prosekeep's repository is 0.3.0 and npm serves 0.2.0; ClosedTab's repository is 0.6.0
   and npm serves 0.5.0.
3. Ran Prosekeep's strictest profile over HourKeep's written prose before installing anything: 0 findings in 21
   files. Ran it over everything: 6,165 findings, 6,158 of them in `docs/domain/`.
4. Found that the remaining 7 were in the Agent Action Record written earlier in this same session, all of them the
   em-dashes in ClosedTab's own heading template.
5. Tested whether ClosedTab still parses a record whose headings use a colon. It scores 6 out of 6 either way, so
   the collision is resolvable without changing either tool.
6. Vendored both skills into `.kiro/skills/`, stamped with their source repository and commit.
7. Wrote `.editorial.json` and `EDITORIAL.md`, excluded `docs/domain/`, `docs/review/` and the two vendored skills,
   and enabled all seven rules.
8. Wrote `.github/workflows/editorial.yml` with two jobs: the lint, and a ClosedTab score over every
   `docs/aar-*.md`.
9. Edited `AGENTS.md` to point its style rules at the checker and to require an Agent Action Record, and `README.md`
   to name both tools. Wrote decision record 0007.
10. Fixed the 7 findings in the earlier record, then re-ran both tools and the repository's own checks.

**What it produced or changed:** `EDITORIAL.md`, `.editorial.json`, `.github/workflows/editorial.yml`,
`.kiro/skills/prosekeep/` (13 files), `.kiro/skills/closedtab/SKILL.md`,
`docs/decisions/0007-adopt-prosekeep-and-closedtab.md`, this record, and edits to `AGENTS.md`, `README.md` and
`docs/aar-prototype-onto-main-2026-10-22.md`. No change to `docs/domain/`, `public/`, `prototype/src/` or the deploy
workflow.

**Where actual behavior differed from the instruction:** "install" was read as vendor the skills and pin the CLIs,
because neither tool's current version is installable from npm. The agent also wrote editorial policy, changed
`AGENTS.md` and added a CI gate, none of which was asked for in those words.

**Stayed within granted authority?** Yes. The `AGENTS.md` change is the furthest reach: it makes an Agent Action
Record a condition of the build for every future session.

## 3. Judgment: human in the loop

**Decisions the agent made on its own:**

- Excluding `docs/domain/` from the lint. It is 6,158 of the 6,165 findings and it quotes federal law.
- Excluding `docs/review/`, which is generated, and the two vendored skills, which are copies.
- Enabling STYLE-04 and STYLE-05, which the `public-service` profile leaves off, because `AGENTS.md` already
  forbade dashes.
- Vendoring the skills rather than relying on `npx skills add`, so a clone carries them.
- Pinning Prosekeep by commit and ClosedTab by npm version, because their publishing states differ.
- Resolving the heading collision by changing HourKeep's record rather than reporting it and stopping.
- Requiring an Agent Action Record in `AGENTS.md`, and failing the build below 6 out of 6.
- Filling `EDITORIAL.md` in from `AGENTS.md` and `docs/design.md` instead of committing the blank template.

**Of those, which should a human have made or seen:** two. Making the Agent Action Record a build gate changes what
every future session must do, and the owner may want it as a habit rather than a gate. The exclusion of
`docs/domain/` is the right call on the evidence but it means the largest body of writing here is never linted, and
the owner should know that rather than discover it.

**Where a human actually intervened:** nowhere in this piece of work. The owner gave one instruction and two links.

**Points where it should have escalated and didn't:** the `AGENTS.md` build gate. The agent wrote it into the
working agreement on its own and is naming it here instead.

**Accountable for these actions:** the repository owner, who can reverse any of it in one commit.

## 4. Deviation: the gaps

**Gaps between intent and action, and why (root cause):** "install" is one word for a tool that ships as a skill, a
CLI, an MCP server and a profile, and whose current version is not published. The agent picked an install shape for
each piece rather than asking which was wanted.

**Good deviations (correct departures from a flawed instruction):** running the lint before installing it. Had
HourKeep's prose been full of findings, the right move would have been to report that and ask, rather than to land a
red build. It was clean, so the install is a regression guard and the decision was easy.

**Confidently wrong:** nothing identified. The riskiest judgment is the build gate on Agent Action Records, which is
a policy choice rather than a factual error.

## 5. Consequence: what it cost or risked

**Actual outcome (did the work hold up):** `prosekeep check .` passes with 0 findings across 26 files.
`prosekeep audit .` reports 26 documents, no repeated paragraphs, no outline findings. `closedtab check` scores both
records 6 out of 6. The corpus checker passes with 0 warnings and the test result is in the commit message. The
prototype build is untouched by this change.

**Harm, cost or risk, realized or narrowly avoided:** the real risk was pointing a style linter at quoted law.
Running the scan before writing the config is what caught it; a default `prosekeep init` would have put
`docs/domain/` in scope and produced 6,158 findings against text that must not change. An agent working through that
list would have silently corrupted the corpus the whole project rests on.

**Downstream affected parties:** every future agent session here, which now has a lint to pass and a record to
write. Nobody outside the repository. Nothing published changed.

**Expected failure if this run happened 100 times:** the recurring failure is scope. An agent told to install a
linter installs it with defaults, lints everything, and either floods the build or edits sources to make it quiet.
The second is treating a green lint as editorial approval; `EDITORIAL.md` and the workflow comments both say it is
not, because the next agent will be tempted.

## 6. Change: what happens next

**Specific changes before next run:** the owner should say whether the Agent Action Record gate stays a gate.
Publishing Prosekeep 0.3.0 and ClosedTab 0.6.0 to npm removes the pinned checkout and both vendored copies, and the
workflow and `EDITORIAL.md` both name what to replace. ClosedTab's record template needs a decision: its em-dash
headings fail the lint of any project that forbids dashes.

**Keep doing:** running a checker over the repository before configuring it, and reading what it reports by
directory before believing the total. Testing whether two tools agree before assuming they do.

**Should not be delegated to an agent at all:** deciding what the house style is. The agent enforced the owner's
rules and wrote none of them.

**Signal that the change worked:** a future session's prose change fails `prosekeep check` and gets fixed before it
lands, and the Agent Action Record for that session names the call the agent made on its own.
