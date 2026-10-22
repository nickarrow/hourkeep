# Agent Action Record: move the static prototype onto main

**Review date:** 2026-10-22
**Reviewed by:** agent self-review
**Agent / system:** Claude Code (Claude Opus 5), cloud session
**Task or period under review:** merging the `prototype-draft` branch into `main` on the `quarterback/hourkeep` fork
**Accountable human (name or role):** the repository owner (Ron), who asked for the move

## 1. Intent — what was supposed to happen

**Instruction given (actual wording):** "i want to improve the hourkeep draft right now i want to elevate the draft to
main so there's showing the prototype improvement and then work from there with it", then, after the agent asked a
clarifying question and the owner cut it off: "I have my own fork of main i want my prototype-draft to live on my
verson of main not being submitted to a PR for th man one".

**Success defined in advance as:** not defined in advance. The agent took it as: the prototype's files and history are
on `main` in this fork, the repository's existing checks still pass, nothing goes to `nickarrow/hourkeep`, and the
prototype is a place further work can start from.

**Authority granted to the agent:** to put the prototype on this fork's `main`. The owner's second message made the
target explicit after the agent raised the deploy question.

**Out of scope:** any pull request to the upstream repository. Changing the prototype's behaviour, which the owner
asked for next, not now. Changing the policy corpus, the review pages or the checker.

## 2. Action — what actually happened

**What the agent did (step by step):**

1. Read both branches. Found `main` (145 files: policy corpus, review pages, Python checker, agent rules) and
   `prototype-draft` (one orphan commit, 9 files, a Vite static prototype) with no commit in common.
2. Read `AGENTS.md`, `README.md`, `docs/design.md`, `.github/workflows/deploy.yml` and `public/index.html` to find
   out what a push to `main` does. It deploys `public/` to hourkeep.app.
3. Checked `tests/test_unlisted_files.py` to confirm the corpus checker only polices `docs/domain/`, so a new
   top-level folder would not fail it.
4. Asked the owner whether "elevate to main" meant publishing the prototype at hourkeep.app. The owner rejected the
   question and answered the part that mattered: this is a fork, keep it off upstream.
5. `git checkout -B main origin/main`, then
   `git merge -s ours --no-commit --allow-unrelated-histories prototype-draft`, then
   `git read-tree --prefix=prototype/ -u prototype-draft`. This keeps the draft commit in the history and places its
   files under `prototype/` instead of over the root.
6. Dropped `prototype/LICENSE` (sha256 identical to the root `LICENSE`) and `prototype/.gitignore`; added
   `/prototype/dist/` to the root `.gitignore`.
7. Rewrote `prototype/README.md`: two GitHub blob links to `docs/design.md` became relative links, the run
   instructions say to run from `prototype/`, and a new section names where the prototype departs from the design.
8. Updated the root `README.md`: the "no app code in this repository yet" sentence and a new `prototype/` bullet.
9. Wrote `docs/decisions/0006-keep-the-static-prototype-on-main-undeployed.md`.
10. Ran the checks.

**What it produced or changed:** `README.md`, `.gitignore`, `docs/decisions/0006-*.md`, this record, and
`prototype/` (7 files from the draft, plus `package-lock.json`, which `npm install` wrote and the agent chose to
commit so the install is reproducible). `public/` and `.github/workflows/deploy.yml` were not touched. No external action beyond
`npm install` in `prototype/`.

**Where actual behavior differed from the instruction:** the owner said "elevate the draft to main", which could mean
the prototype becomes the repository root. The agent put it in a `prototype/` subfolder instead, so the corpus, the
review pages and the checker survive. The agent also wrote a decision record and two README edits that were not asked
for.

**Stayed within granted authority?** Yes for the merge. The README edits, the decision record and the folder choice
were the agent's own, within what `AGENTS.md` asks of a change ("Fixing what your own change made untrue is part of
the change").

## 3. Judgment — human in the loop

**Decisions the agent made on its own:**

- `prototype/` as the location, rather than the repository root or `app/` or `src/`.
- Not touching `public/` or the deploy workflow, so hourkeep.app keeps its placeholder.
- Deleting the prototype's duplicate `LICENSE` and `.gitignore`.
- `-s ours` plus `read-tree` rather than a plain unrelated-histories merge, which would have conflicted on
  `README.md`, `LICENSE` and `.gitignore` and dropped `prototype/public/favicon.svg` into the deployed folder.
- Writing decision record 0006 and editing the root README.
- Naming the stack divergence (plain JavaScript and the UAE Government Design System against the design's TypeScript,
  React, Dexie and v1's purple and tan palette) in both READMEs and the decision record.

**Of those, which should a human have made or seen:** the location, and the decision not to deploy. The agent tried to
put the deploy question to the owner and the owner declined to answer it, so the agent took the conservative branch
and wrote the reasoning into 0006 where it can be reversed on sight.

**Where a human actually intervened:** once. The owner interrupted the clarifying question and redirected the work to
the fork.

**Points where it should have escalated and didn't:** none identified. The one escalation it tried was refused, and
the refusal answered a different and more important question.

**Accountable for these actions:** the repository owner, who asked for the move and can revert any of it.

## 4. Deviation — the gaps

**Gaps between intent and action, and why (root cause):** "elevate to main" is ambiguous between "land it in the
tree" and "make it the thing people see". The agent resolved it toward the tree because `main` publishes to a live
site read by people at risk of losing Medicaid coverage, and an untested prototype there is a harm the owner had not
asked for.

**Good deviations (correct departures from a flawed instruction):** the subfolder. Read literally, "elevate the draft
to main" with a root-level merge would have conflicted on three files and put a second favicon into the published
`public/` folder.

**Confidently wrong:** nothing identified yet. If the owner wanted the prototype at the repository root, or wanted it
visible on the web, this run did neither and will need a second pass.

## 5. Consequence — what it cost or risked

**Actual outcome (did the work hold up):** `python3 scripts/check-corpus.py` passes (64 rows, 39 sources, 8 state
facts, 0 warnings). `python3 -m unittest discover -s tests` ran 317 tests in 63 seconds: OK, 4 skipped, nothing
failed. Both were run after every edit in this change was in place. Neither was run under Python 3.9, the oldest the
checker supports, because this container has only python3 (3.13.16); `AGENTS.md` asks for both.
`npm install` and `npm run build` in `prototype/` succeed on Node 22.22.0 and produce a 20 kB JS and 72 kB CSS bundle.
`git status` confirms `prototype/dist/` and `node_modules/` are ignored.

**Harm / cost / risk — realized or narrowly avoided:** narrowly avoided publishing an untested Medicaid prototype to
hourkeep.app. The deploy workflow runs on any push to `main`; had the prototype gone in at the root and overwritten
`public/`, the placeholder that currently tells people to call the office on their letter would have been replaced by
a sample-case demo. On this fork GitHub Actions are most likely off and the `hourkeep.app` CNAME belongs to upstream,
so the real exposure was probably zero, but the agent did not verify that and did not rely on it.

**Downstream affected parties:** nobody outside the repository, since nothing published changed. Future agents and the
owner inherit a second `package.json` and a second `node_modules/` in a repository that was Python-only at the root.

**Expected failure if this run happened 100 times:** the recurring failure is the location guess. An agent reading
"elevate to main" literally lands the prototype at the root and loses, or buries, the corpus work. A second recurring
failure is treating a passing checker as proof the change is right; the checker never looks outside `docs/domain/`.

## 6. Change — what happens next

**Specific changes before next run:** the owner should say whether `prototype/` is the right home and whether the
prototype should ever be reachable on the web. The improvement work the owner asked for has no brief yet: the
prototype's own README lists seven things the design calls for that the draft does not do, and the owner has not said
which comes first.

**Keep doing:** reading `AGENTS.md` and the deploy workflow before touching a branch that publishes. Checking whether
a repository's own tests cover the files being added before trusting a green run.

**Should not be delegated to an agent at all:** the decision to put anything in front of people on Medicaid. Decision
record 0006 keeps that with the owner.

**Signal that the change worked:** the prototype is opened and changed from `main` rather than from
`prototype-draft`, and the next change to it cites `docs/design.md` by its relative path.
