# Agent Action Record: rewrite the docs for scanning

**Review date:** 2026-10-22
**Reviewed by:** agent self-review
**Agent / system:** Claude Code, cloud session
**Task or period under review:** a scanning pass over HourKeep's documents
**Accountable human (name or role):** the repository owner (Ron)

## 1. Intent: what was supposed to happen

**Instruction given (actual wording):** "all the docs in that repo are impossible to parse because they're barely in
clear english", then "BOTH, start with the prototype, the nthe docs". Mid-pass, quoting the opening of
`docs/design.md`: "what the hell is this slop".

**Success defined in advance as:** not defined. Taken as: each document starts with its point, breaks into pieces a
person can scan, and loses no fact, citation, date or decision.

**Authority granted to the agent:** to rewrite the docs.

**Out of scope, by the repository's own rules:** decision records ("superseded rather than edited"), Agent Action
Records (history), `NOTICE.md` (a licence), `docs/domain/` (quoted law), and `docs/review/` (generated).

## 2. Action: what actually happened

**What the agent did (step by step):**

1. Measured every document, and found which sections other files cite by name.
2. Wrote a fidelity check that lists any citation, date, number, link, path, heading or decision marker lost in a
   rewrite. Saved every original first.
3. Rewrote `README.md`, `docs/design.md`, `AGENTS.md` and `EDITORIAL.md`, keeping every existing heading.
4. Numbered the steps in `DATA-GUARD.md`, with every command byte-identical.
5. Edited the corpus epic's design and delivery plan by structure only, using a script that can insert breaks and
   headings but not change a word, and that proves it.
6. Ran every check.

**What it produced or changed:** the 7 files above, plus one sentence of new policy in `EDITORIAL.md`: every document
starts with its point, and notes about the document go at the end.

**Where actual behavior differed from the instruction:** "all the docs" was not all of them. `HOW-TO-WORK.md` and
`missions/` were left as written, because they are another author's first-person writing and already read clearly.

**Stayed within granted authority?** Yes, apart from the new `EDITORIAL.md` sentence, which is a policy change.

## 3. Judgment: human in the loop

**Decisions the agent made on its own:**

- Leaving `HOW-TO-WORK.md` and `missions/` in their author's voice.
- Changing the two epic documents by structure only, because the checker implements their wording.
- Adding the "start with the point" rule to `EDITORIAL.md`.

**Of those, which should a human have made or seen:** the new rule, and leaving the bootstrap author's files alone.

**Where a human actually intervened:** once. The owner called the opening of `docs/design.md` slop. The first rewrite
had only turned that opening into a bulleted legend and kept it on top. It now opens with what HourKeep is, and the
legend sits under Sources.

**Points where it should have escalated and didn't:** none found.

**Accountable for these actions:** the repository owner.

## 4. Deviation: the gaps

**Gaps between intent and action, and why (root cause):** the two epic documents still average 24 words a sentence.
Shortening those sentences means rewording text the checker implements, which needs the owner.

**Good deviations (correct departures from a flawed instruction):** none.

**Confidently wrong:** the first re-wrap of the epic design split code spans across lines. One line began
`> <txt>`, which Markdown shows as a block quote. The fidelity check caught it, and the re-wrap now keeps code spans
whole.

## 5. Consequence: what it cost or risked

**Actual outcome (did the work hold up):** no citation, date, number, link, path or decision marker was lost. Every
original heading survives. The median paragraph fell in every file, from 89 to 28 words in `docs/design.md` and from
101 to 40 in the epic design. 347 tests pass with 4 skipped, the corpus checker reports 0 warnings, and every
editorial check passes.

**Harm, cost or risk, realized or narrowly avoided:** a rewrite that drops a citation or rewords a spec. The fidelity
check and the wording proof both guard against it.

**Downstream affected parties:** anyone reading the docs. Nothing is published.

**Expected failure if this run happened 100 times:** turning a wall of prose into a wall of bullets and calling it
clear. The owner's reaction caught the first case.

## 6. Change: what happens next

**Specific changes before next run:** the owner should decide whether the epic documents get a real rewrite, and
whether the new `EDITORIAL.md` rule stays.

**Keep doing:** saving the originals, and proving fidelity by script rather than by reading.

**Should not be delegated to an agent at all:** rewording a specification the checker implements.

**Signal that the change worked:** someone new finds what HourKeep is, and what to run, from the README in under a
minute.
