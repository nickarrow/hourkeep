# Agent Action Record: revamp the prototype's structure

**Review date:** 2026-10-22
**Reviewed by:** agent self-review
**Agent / system:** Claude Code, cloud session
**Task or period under review:** rebuilding the prototype's flow against `docs/design.md`
**Accountable human (name or role):** the repository owner (Ron)

## 1. Intent: what was supposed to happen

**Instruction given (actual wording):** "BOTH, start with the prototype, the nthe docs", answering whether to do the
structural revamp or a scanning pass over the docs first.

**Success defined in advance as:** not defined. Taken as: the prototype covers the gaps its own README listed, each
rule it shows carries a source, and every route works in a browser.

**Authority granted to the agent:** to revamp the prototype's structure.

**Out of scope:** the docs pass, which comes next. Spanish, attached files, backup and state rules.

## 2. Action: what actually happened

**What the agent did (step by step):**

1. Read `docs/design.md` and checked which topics have verified rows. Only letters and hearings do.
2. Rewrote `prototype/src/main.js` with 8 steps, 4 routes, and a `SOURCES` table naming each rule's row.
3. Replaced the UAE design system with the palette the design decided on, after checking its contrast.
4. Taught the copy checker about steps written as objects and about toggle labels (4 new tests).
5. Drove every route in Chromium: 54 checks, now in `prototype/check-flows.mjs`.
6. Looked at the screens, found 4 problems the checks missed, and fixed them.

**What it produced or changed:** `prototype/src/main.js`, `style.css`, `index.html`, `README.md`, `package.json`,
`check-flows.mjs` and its favicon; `scripts/check_interface_copy.py`; `tests/test_interface_copy.py`; the root
`README.md`; this record.

**Where actual behavior differed from the instruction:** none found.

**Stayed within granted authority?** Yes.

## 3. Judgment: human in the loop

**Decisions the agent made on its own:**

- The words for what to tell the state and what to gather for each exemption. These are HourKeep's advice, and the
  sources list says so.
- Showing exemptions with no verified row, labelled as unverified, rather than leaving the screen out.
- Labelling the deadline cross-check Conditional, because states count the days differently.
- Leaving Spanish out.
- Committing a Playwright check that CI does not run yet.

**Of those, which should a human have made or seen:** the advice wording for exemptions. It is the text most likely
to be read as policy.

**Where a human actually intervened:** nowhere in this piece.

**Points where it should have escalated and didn't:** none found.

**Accountable for these actions:** the repository owner.

## 4. Deviation: the gaps

**Gaps between intent and action, and why (root cause):** none against the instruction. The prototype is still
plain JavaScript, and the design decided React.

**Good deviations (correct departures from a flawed instruction):** none.

**Confidently wrong:** the first pass said "your state decides" with no next step in 4 places.
`.kiro/skills/hhs-benefits/SKILL.md` says a hedge with no next action is worse than a verdict. Reading the skill
caught it, and every Deferred note now names an action.

## 5. Consequence: what it cost or risked

**Actual outcome (did the work hold up):** 54 of 54 browser checks pass with no console errors. Both copy checkers
report nothing. The build is 14 kB of CSS, down from 72 kB, and `npm audit` reports 0 problems, down from 2.

**Harm, cost or risk, realized or narrowly avoided:** exemption advice that reads like a rule. The sources list
marks it, but a tester may not open the list.

**Downstream affected parties:** testers, and anyone they show it to. Nothing is published.

**Expected failure if this run happened 100 times:** trusting the tests. All 54 passed while the month card showed a
sum with no terms. Only looking at the screens caught that.

## 6. Change: what happens next

**Specific changes before next run:** the owner should read the exemption advice. Someone with Medicaid policy
knowledge should check the threshold, half-time and SNAP rules, so they get verified rows.

**Keep doing:** looking at every screen after the tests pass.

**Should not be delegated to an agent at all:** deciding the advice a person gets about an exemption.

**Signal that the change worked:** a tester gets from a letter to a printed packet without help.
