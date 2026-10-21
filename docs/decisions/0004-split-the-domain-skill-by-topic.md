# 0004. Split the domain skill into a main file and a file per topic

Date: 2026-10-21

Status: Accepted, decided by the owner

## Context

After increment 1's one topic, notices of noncompliance and fair hearings,
`.kiro/skills/medicaid-community-engagement/SKILL.md` was 296 lines, 4,005 words and 27,172 bytes (wc, 2026-10-19),
an estimated 5,000 to 6,500 tokens. It holds a rule item for each of the topic's 64 rows. Four topics remain, in
increments 2 to 5 of `docs/epics/0001-policy-corpus/delivery-plan.md`.

The Agent Skills specification ([agentskills.io/specification](https://agentskills.io/specification), read
2026-10-21) says an agent loads the whole of SKILL.md once it activates a skill, and recommends keeping its body under
5,000 tokens and the file under 500 lines. It says to move detailed reference material into separate files, which an
agent loads only when a task needs them, and suggests a `references/` folder for them, each file kept focused. The file
was under the line limit and, by that estimate, at or past the token one.

Kiro's documentation ([kiro.dev/docs/skills](https://kiro.dev/docs/skills), read 2026-10-21) says Kiro loads the full
SKILL.md when a skill activates, so it should stay focused, and that detailed reference material belongs in
`references/` files. Kiro loads a reference file only when the skill's instructions direct it to.

Increment 1 raised how the skill holds the topics still to come as one of two decisions before increment 2 (delivery
plan, increment 2, Needs from you; full review 2026-10-19, red team 4).

## Decision

`SKILL.md` keeps how to use the skill, a list of the topic files with what each covers, the precedence rules and the
watch list.

Each topic's rule items move to `.kiro/skills/medicaid-community-engagement/references/<topic>.md`. A session reads a
topic's file before answering a question that topic covers.

The checker checks every topic file the way it checked the old Rules section of `SKILL.md`.

## Consequences

A session has to open a topic file before it answers, so the fresh-session test now tests that too.

A question in one topic loads SKILL.md and that topic's file. For increment 1's topic that is more than the single file
was: 35,737 bytes against 27,172 (wc, 2026-10-21). The split pays for itself as topics are added, since a question
loads only its own topic's file.

The checker, its tests and the Formats section of `docs/epics/0001-policy-corpus/design.md` change in the same branch
as the split.

This settles the first of the two decisions increment 1 raised.

## Alternatives considered

One file holding only each topic's core rules. A session would see less, and the skill would stop restating every row.

One file holding everything. By increment 5 it would be several times past the recommended size.
