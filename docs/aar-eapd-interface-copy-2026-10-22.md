# Agent Action Record: adopt the eAPD content guide for interface copy

**Review date:** 2026-10-22
**Reviewed by:** agent self-review
**Agent / system:** Claude Code (Claude Opus 5), cloud session
**Task or period under review:** integrating the CMS eAPD content guide as HourKeep's first authority for screen copy
**Accountable human (name or role):** the repository owner (Ron), who named the guide and linked the commit

## 1. Intent: what was supposed to happen

**Instruction given (actual wording):** "all the docs in that repo are impossible to parse because they're barely in
clear english. but the tool itself neds to be completely revamped with the eAPD content guide integrated into this
tool separately as an addendum and foremost key because t's so focused on this type of tool/interface", with a link
to a file in commit `ae50d8da` of `nickarrow/eapd`.

**Success defined in advance as:** not defined in advance. The agent took it as: the eAPD content guide adapted into
HourKeep as a separate addendum, ranked ahead of the existing editorial policy for anything inside a screen, with
the prototype's copy brought in line with it.

**Authority granted to the agent:** to integrate the guide and to change the tool. The word "completely revamped"
grants more than this run used.

**Out of scope:** the structural revamp. Changing which steps exist, what the first question is, or how a person
moves through the form is a design change, and `docs/design.md` marks the screens Open.

## 2. Action: what actually happened

**What the agent did (step by step):**

1. Fetched the commit the owner linked, found `eapd-wiki/Content-guide.md`, read it, and checked the licence. It is
   a work of the United States Government, public domain and CC0 1.0, so it can be adapted freely.
2. Tested whether the guide could become a Prosekeep standard. It cannot. Prosekeep's `STANDARDS` registry is
   hardcoded in `src/standards.mjs` and loads files from inside its own package, so `eapd-content` in the
   `standards` array makes `prosekeep standards eapd-content` fail.
3. Extracted every displayed string from the prototype and read it against the guide before writing anything.
4. Wrote `.kiro/skills/interface-copy/SKILL.md`, adapting the guide and reversing the two assumptions that do not
   hold here.
5. Wrote `scripts/check_interface_copy.py`, `scripts/check-interface-copy.py` and `tests/test_interface_copy.py`,
   covering thirteen rules.
6. Ran the checker, found three bugs in its own rules, and fixed them before trusting its output.
7. Applied the 16 findings to the prototype, then rebuilt it.
8. Wired the addendum into `EDITORIAL.md`, `AGENTS.md` and a third CI job, and wrote decision record 0008.

**What it produced or changed:** `.kiro/skills/interface-copy/SKILL.md`, `scripts/check_interface_copy.py`,
`scripts/check-interface-copy.py`, `tests/test_interface_copy.py`,
`docs/decisions/0008-adopt-the-eapd-content-guide-for-interface-copy.md`, this record, 17 copy changes in
`prototype/src/main.js`, and edits to `EDITORIAL.md`, `AGENTS.md` and `.github/workflows/editorial.yml`.

**Where actual behavior differed from the instruction:** the owner said the tool needs to be "completely revamped".
This run revamped the content layer, which is what the eAPD guide governs, and left the structure alone. It also
did nothing about the first sentence of the instruction, that the repository's documents are hard to parse.

**Stayed within granted authority?** Yes, and under it. The run did less than "completely revamped" permits.

## 3. Judgment: human in the loop

**Decisions the agent made on its own:**

- Reading "this tool" as HourKeep's editorial system rather than as Prosekeep, and putting the addendum in
  HourKeep. Prosekeep is a separate repository this session cannot push to, so the choice was partly forced.
- Reversing eAPD's "avoid familiarity, assume subject matter expertise" rather than adopting the guide whole. eAPD
  writes for state analysts and HourKeep writes for a person who has never seen the form.
- Scoping the revamp to copy and leaving the step structure alone.
- Writing a checker at all, rather than adopting the guide as advice.
- Leaving `one` out of the spelled-number rule.
- Choosing the two packet phrases eAPD uses, which changes what a submitted packet says.

**Of those, which should a human have made or seen:** two. The reading of "completely revamped" as the content layer
only is the largest, and if the owner meant the screens and the flow, this run answered a smaller question than was
asked. The reversal of eAPD's register is an editorial decision about who HourKeep talks to, which is the owner's.

**Where a human actually intervened:** nowhere in this piece of work. One instruction and one link.

**Points where it should have escalated and didn't:** the scope of "completely revamped". The agent chose the
reading that could be finished and verified, and is naming it here rather than having asked.

**Accountable for these actions:** the repository owner.

## 4. Deviation: the gaps

**Gaps between intent and action, and why (root cause):** "the tool itself" and "this tool" in one sentence can mean
the prototype or the editorial system, and "completely revamped" can mean the copy or the whole interface. The agent
picked the reading in which the guide has to exist first, because a revamp against a guide needs the guide.

**Good deviations (correct departures from a flawed instruction):** not adopting eAPD's register. Followed to the
letter it would have made HourKeep's screens address a Medicaid enrollee as though they were a state analyst.

**Confidently wrong:** nothing identified in what was built. The unaddressed part is the first sentence of the
instruction. The documents in this repository are long and dense, and this run added three more.

## 5. Consequence: what it cost or risked

**Actual outcome (did the work hold up):** `check-interface-copy.py` reports nothing across the prototype, its 26
tests pass, `prosekeep check` passes with 0 findings in 29 files, and the prototype builds on Node 22.22.0. The full
test result is in the commit message. The checker was not run under Python 3.9, which `AGENTS.md` asks for and this
container does not have.

**Harm, cost or risk, realized or narrowly avoided:** the checker's own rules were wrong three times out of
thirteen on first run. It flagged `print one packet` as a spelled number, its packet rule never matched because the
phrase sits inside markup, and its double-space rule could never fire because the markup stripper collapses
whitespace first. Had the output been trusted, correct prose would have been edited to satisfy a broken rule and two
real problems would have stayed. Running it and reading every finding is what caught that.

**Downstream affected parties:** a person reading the packet. It now says `No response was provided` where it used
to say `No activities listed`, which is the difference between a packet that admits a gap and one that looks
complete.

**Expected failure if this run happened 100 times:** the recurring failure is writing the checker and believing it.
A rule that fires on correct text is worse than no rule, because somebody edits good writing to silence it. The
second is scope: an agent given one word for two jobs picks the one it can finish.

## 6. Change: what happens next

**Specific changes before next run:** the owner should say what "completely revamped" covers. If it is the screens
and the flow, that is the next piece of work and it starts from the seven gaps in `prototype/README.md`. The first
sentence of the instruction is also unanswered: the documents here are dense, and a decision about whether to
rewrite them for scanning has not been made.

**Keep doing:** reading a guide's licence before adapting it. Extracting the real strings and reading them against
the rules before writing a checker. Treating a checker's first run as a test of the checker.

**Should not be delegated to an agent at all:** deciding who HourKeep talks to and in what register. The agent
reversed eAPD's assumption on its own and has named it here.

**Signal that the change worked:** a copy change to the prototype fails `check-interface-copy.py` before it lands,
and the eAPD rules a checker cannot see get cited in a review of a screen.
