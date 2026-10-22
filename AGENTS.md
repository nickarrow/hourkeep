# Working agreement

Rules for any AI agent working in this repository. Kiro loads this file automatically, on every surface, and other tools
read `AGENTS.md` too, which is why the rules live here rather than somewhere tool-specific.

A few things decide whether this file reaches a session. Kiro's documentation says a newly opened folder is untrusted
until you say otherwise, and an untrusted folder's steering files and skills are not loaded, so trust the folder first.
It also says a custom agent loads steering and skills only when its configuration asks for them, so a custom agent is
the next thing to suspect. And an `AGENTS.md` in a subfolder, such as a worktree or a copy of another repository, may
not be in the session from its first message. It has been seen to arrive once a file in that folder was read.

This file holds what is true in every session. Anything that only matters sometimes is a skill under `.kiro/skills/`,
which loads when it is relevant. Counts and dated notes about this repository's own state stay out of this file and the
skills, because every session reads them as current. How many files there are, or what last week's test showed, belongs
in the delivery plan or a decision record. A figure or a date that comes with a cited source is fine.

## What you may look at

Start from the safe list. These are fine:

- Public law, regulation and published guidance
- Your organisation's own policy and procedure manuals
- Synthetic or de-identified data
- Schemas, with no data in them
- Code
- Published aggregate statistics

Never these:

- Records about identifiable people, of any kind
- Production data extracts
- Protected health information or personally identifiable information
- Screenshots of a live system showing a real person's case
- Anything pulled out of a system of record, however convenient

Lead with the safe list when explaining this to anyone. A deny list alone reads as a warning and gets tools banned. A
safe list reads as a scope, and scoped things get approved. Cite whatever authority governs the work rather than
citing this file, because an agency believes its own rules before it believes a repository.

This file is advice and cannot enforce itself. Two things do. Keeping real data out of the workspace, which is the actual
boundary, and a `fs_read` deny rule in the user's own Kiro permissions file as a backstop behind it. If a `sensitive/`
folder exists here, that is the designated place and the deny rule should already cover it. If you cannot tell whether
that rule is in place, say so rather than assuming it is.

## What the software may decide

These four hold whatever the work is, and they stay here rather than in a skill because a skill can be deleted.

Never put a model in the path of a decision about a person. Use agents to pull rules apart, draft them, write tests,
write documentation and prototype. The decision itself has to be replayable: same inputs, same answer, every time, and
explainable afterwards by somebody who was not there.

If a person can lose something because of what this software says, then what it says has to be readable, has to name
what they can do next, and has to be printable and exportable. Somebody with no copy of their own has nothing to bring
to a dispute.

Build accessibility in rather than auditing it at the end. Keyboard operation, visible focus, real contrast, labelled
controls, and a route for somebody who will not use the software at all. Section 508 binds federal and federally funded
work to WCAG 2.0 Level AA, and the Department of Justice's 2024 rule under Title II of the Americans with Disabilities
Act binds state and local government to WCAG 2.1 Level AA. Build to 2.2 AA and you are ahead of both.

Any rule you encode carries a citation to the thing that says it: the section, the URL, and a plain paraphrase.
Anything that cannot carry one is a guess and gets labelled rather than shipped quietly.

A domain skill may sharpen these. Nothing may loosen them.

## How to work

Talk before you build. Have a conversation first, research it, look for prior art. Do not scaffold before the problem
is understood, and do not offer to.

Change only what you were asked to change. If you spot something else worth doing, say so and wait. Nobody working
here should have to watch you to find out what you touched. Fixing what your own change made untrue is part of the
change: if it renames a file the docs name, or alters behaviour a skill describes, correct that too.

Write it down before the session ends, because the session takes its context with it. Three documents do three jobs:

- A **design document** says what is being built, why, and what has to be true. The project's, `docs/design.md`, is
  argued with, revised and kept true.
- A **delivery plan** says in what order, and carries the record of what is done. One per epic, separate from the
  design so a stale assumption cannot hide inside a task list.
- **Decision records** capture a choice made along the way, dated, one small file each, superseded rather than edited.

Each body of work, an epic, gets a numbered folder under `docs/epics/` for its delivery plan and any design document
of its own. Do not invent other names for these. Do not split the design document to make it shorter.

A fourth document covers the run rather than the work: an **Agent Action Record** in `docs/aar-<slug>.md`, written at
the end of a piece of work, saying what was asked in the person's own words, what the agent did, which calls it made
on its own, where it departed from the instruction, what that risked, and what should change next time. Write one for
a review or an abandoned attempt as well as for code that shipped. `.kiro/skills/closedtab/SKILL.md` has the six
parts, `npx closedtab@0.5.0 check docs/aar-<slug>.md` scores it, and the editorial workflow fails a record that
scores below 6. Commit it with the work it describes.

Files a session makes for its own work (briefs, reviewer reports, scratch copies, scripts) go in one folder per piece
of work under `.agents/`, which git ignores. They are scratch, not the record. When the work is done, whatever matters
moves into the delivery plan, a decision record, a test or a commit message; then delete that work's own folder, not
`.agents/` itself, and say what you deleted. Never delete anything the person put there. Size the review to the change:
the full fan-out for a design, a plan, or a change to what the software does or says; for a refactor that changes
neither, the do-it reviewer and the tests.

Review before shipping anything substantial. Fan out several reviewers in parallel, each anchored to a different
source. Several agents checking one shared opinion is not review. Treat every finding as a lead: open the file, confirm
it, and say how many you threw out. When reviewing, report rather than fix. If a `review` skill is available, `/review`
runs this properly and you should use it.

For one person the git workflow is light. One branch per increment or per fix, in the checkout that is already open,
not a worktree. The agent runs the git steps: branching, committing, merging. The person's part is to say when, and they
can merge in the editor if they would rather. Show the commit message before committing. Push only when asked. No pull
request for your own work: the review that replaces it is the fan-out above and the person's own read of the branch
before it merges. A team that reviews through pull requests says so here. Contributions from outside a public
repository still arrive as pull requests.

## How to write it down

Generated prose has tells, and a document somebody has to defend in a meeting should not read as machine output. So:

- No em-dashes. Use a comma, a full stop, or a new sentence.
- Do not write "it isn't X, it's Y". Say what it is.
- Do not start a paragraph with a bold label as a heading. Bold is fine as a term in a definition list, where the
  bold word is the thing being defined.
- Do not announce a count and then hold it back. "Two things, and one matters more than the other" is a drumroll.
  Give the count only when the number is information, then give the things.
- Do not rate your own writing. "Worth knowing", "worth noting" and "this is important" all say the same thing as
  putting it in the document, and one of those is shorter.
- Vary sentence length. Uniformly short sentences read as machine output the same way uniformly long ones do. A
  clipped line lands because the ones around it are not.
- Concrete numbers over adjectives. Say 900 lines, not unwieldy.
- State an admission plainly, with no clause afterwards that rescues it.
- Do not write about the document inside the document.

A plain idiom is allowed where it is the shortest true thing. Die on that hill. Not with a ten-foot pole. One per
document is plenty, and none is fine.

These are style rules, not safety rules. A team with its own house style should replace them.

Seven of them are now mechanical. `prosekeep check .` enforces dashes, stock AI vocabulary, staged
introductions, formulaic contrasts, date form, link text and generic headings, and
`.github/workflows/editorial.yml` runs it on every push and pull request. `EDITORIAL.md` is the full policy,
including the rules above that no tool checks, and `.editorial.json` configures the checker. The lint leaves
`docs/domain/` and `docs/review/` alone, because the first quotes federal law and the second is generated.
A passing check means seven line patterns did not match. It is not a review.

## How to check yourself

Say what you did not verify. Which claims you checked against a source, which you took on trust, and which you are
guessing at.

Report counts you actually computed. If you did not count it, say "roughly" or leave the number out.

Do not report a task as done because a command exited zero. Say what you observed.

Record a correction with its date rather than editing history silently. The direction of an error matters as much as
the fact of it.

On anything touching cloud infrastructure: read-only credentials by default, explicit approval before anything changes
state, a scoped role rather than an administrator profile, and never production credentials in a session.

## Skills, and loading them on purpose

Material that only matters sometimes lives in `.kiro/skills/` rather than here. Their names and descriptions are in front
of you from the start of the session. The bodies are not, and they do not arrive by themselves.

So at the start of a piece of work, read the available skill descriptions and load the ones that apply. Do not wait to be
asked for them and do not assume it has happened already. If the work turns toward something a skill covers, load it
then. Say which ones you loaded, so the person can tell whether the right material was in front of you.

If the session lists no skills at all, look in `.kiro/skills/` and read the `SKILL.md` files that apply directly. When
you hand work to a sub-agent or a workflow step, name the files it should read: this file, any subfolder `AGENTS.md`
that applies, and the skills the work needs. A session opened elsewhere does not inherit them.

Deleting a skill is a supported thing to do, including the domain one. Everything in this file stands on its own, so a
missing skill costs detail and never a rule.

## This repository

HourKeep is a free, open-source web app, being rebuilt, for people on Medicaid facing the new work requirements, which
CMS calls community engagement. What it relies on lives here:

- `docs/design.md` is the design, `docs/epics/` holds a numbered folder for each epic with its delivery plan, and
  `docs/decisions/` holds the decision records. The Formats section of `docs/epics/0001-policy-corpus/design.md` sets
  the form of everything in `docs/domain/`.
- `docs/domain/` is the policy corpus. Its rows, in `community-engagement-extract.md`, are the authority for Medicaid
  community engagement wherever a row exists. Each quotes a source stored under `docs/domain/sources/`, which
  `docs/domain/sources/MANIFEST.json` lists with its hash. State facts are in `states/`, policy questions nobody has
  answered yet are in `open-questions.md`, and the research is in `research/`.
- `.kiro/skills/medicaid-community-engagement/` restates the rows for agents. Its `SKILL.md` lists the topics, and
  `references/` holds one file of rule items per topic. The row wins wherever the two differ.
- `scripts/check-corpus.py`, with the package `scripts/corpus_check/`, checks the corpus, and `tests/` holds its tests.
- `docs/review/` holds the review pages, where Medicaid policy experts check the rows in public. They are generated by
  `python3 scripts/build-review-pages.py`, which must be run after any change to the rows, the skill, the state facts
  or the open questions; the checker fails until it is.

- `EDITORIAL.md` is the editorial policy, `.editorial.json` configures the checker, and
  `.kiro/skills/prosekeep/` holds the editorial skill and its reference standards. Both are vendored copies of
  `quarterback/prosekeep` and `quarterback/closedtab`, pinned at the commits their `SKILL.md` names, and neither is
  edited here.

After any change to prose outside `docs/domain/` and `docs/review/`, run the editorial check from the repository
root. Prosekeep 0.3.0 is not on npm yet, so run it from a checkout; `.github/workflows/editorial.yml` names the
pinned commit.

```
node /path/to/prosekeep/bin/prosekeep.mjs check .
```

After any change to `docs/domain/`, the skill, the checker or its tests, run both checks from the repository root:

```
python3 -m unittest discover -s tests
python3 scripts/check-corpus.py
```

Both must pass under `python3` and under Python 3.9, the oldest the checker supports. The checker exits 0 when the
corpus is consistent and names each problem when it is not. It cannot tell whether a row says what its source means;
review does that. The tests build a git repository for each test, so give that command a timeout of several minutes.
A PDF's text extraction is made on macOS with `swift scripts/extract-pdf-text.swift <pdf> > <txt>`; the redirect
empties `<txt>` before the script runs, so after a failed run, restore it from git.
