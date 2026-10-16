---
name: writing-code
description: Use when there is code in the repository or about to be. Covers tests as the thing that tells an agent when to stop, naming code after the words the domain uses, file length and cohesion, accessibility, and the repository files an open project is expected to have such as a README, contributing guidance, a changelog and a licence.
---

# Writing the code

Two of the ideas here came from a senior colleague rather than from working them out, and they are held with less
conviction than the rest of this repository. They are labelled where that applies. A team that disagrees should delete
this file.

## Tests are what tell an agent when to stop

Write the test for the thing you want, watch it fail, then build the thing until it passes. You end with working code
and a passing test.

With an agent the payoff changes shape. A test suite becomes the acceptance oracle: the machine-checkable definition of
done that lets the agent loop on its own, find its own failures and fix them without a human pasting errors back into a
chat window. Without one, every correction routes through you and you are the bottleneck.

What is contested is hand-running red-green-refactor as a ritual. Test-first as a constraint on a machine is not
contested, and this is the form worth keeping. *Learned from a senior colleague rather than worked out first-hand.*

Give the agent everything it needs to check its own work: a linter, a test runner it can invoke, a way to see the
interface it built, and the ability to bring the thing up locally. If you use a tool to check your own work, the agent
should be able to run it too.

Tests that survive a rewrite are worth more than tests that do not. End-to-end tests of behaviour, property-based tests
of invariants, and load tests outlive the code they were written against and become the contract any replacement has to
satisfy. Unit tests get thrown away with the code, which is fine.

None of this works until a test runner is installed. On a locked-down work machine that is a request to whoever approves
software, and it is worth finding out early whether the answer is going to be no. Everything up to a design document and
a delivery plan needs nothing installed. The moment there is code, that stops being true.

## Name things the way the people who do the work name them

Organise code around what it is about rather than what kind of file it is. A folder called `scoring` beats a folder
called `utils`.

The payload is the vocabulary. If the policy manual calls it a redetermination, the code calls it a redetermination,
not a recheck and not a refresh. When the code uses the same words as the people who do the work, the agent inherits
the model for free, and every future session starts with it. When the words diverge, that gap is where the defects
breed, because a human reads one word and the code means another.

This is the useful part of domain-driven design. Treating that method as a folder layout misses it, and a small project
does not need aggregates, value objects, bounded contexts, repositories or factories. Skip all of that. Keep the shared
language and keep business rules separate from the plumbing that delivers them, so the plumbing stays replaceable.

Domain-driven design is genuinely contested as a whole. The part above is the part that pays for itself immediately.
*Learned from a senior colleague rather than worked out first-hand.*

## File length, and what the number is actually for

Keep code files in the two to three hundred line range. Agents append rather than refactor, so files grow quietly, and
by the time one is nine hundred lines the refactor is overdue and nobody reviews it properly.

The number is a symptom, not the goal. Cohesion is the goal. A file that is long because it holds one thing that is
genuinely large is better than four files that had one idea cut across them to get under a threshold. When a file is
too long, look for the seam. If there is no seam, leave it and say so.

Count every line, which is what `wc -l` gives. Do not quote the count after stripping blanks or comments and then plan
against a different number. Comments are a fine reason to be over the range, and agents write verbose ones. Code is the
signal.

This applies to code. It does not apply to documents. A design document is one argument and splitting it loses the
argument.

## Once there is code, AGENTS.md gets a section on this repository

A fresh repository has nothing to say about itself. Once there is code, add a short section to `AGENTS.md` saying what
this project is, the commands to build it and run its tests, and where things live. Keep it to what stays true across
sessions. Counts and dated notes do not go here: every session reads this file as current, so a stale line in it
misleads every session until somebody fixes it.

## Pin before you change answers people have already seen

Before you change logic that produces answers a person has already seen, pin today's answers with tests first, so a
change that moves one of them fails a test rather than passing silently. Then the decision record that ships with the
change lists every answer that moved and why. The name for these is characterization tests, from Michael Feathers,
*Working Effectively with Legacy Code* (2004): tests that record what the code does now, not what it should do, so you
can tell when behaviour shifts. In a field test this caught a completed sports season whose champion changed under an
engine rewrite, which nobody would have noticed from reading the diff.

## Dependencies, because the agent installs them

Pin exact versions rather than ranges, and commit the lockfile, so the build you tested is the build that ships and
not whatever resolved that day. Before installing a package whose name you have not met, check that it is the real one.
Models invent plausible package names, and attackers register the invented ones so that a mistaken install pulls their
code. Spracklen et al., in "We Have a Package for You!" (USENIX Security 2025,
[arXiv 2406.10279](https://arxiv.org/abs/2406.10279)), generated 576,000 code samples and found hallucinated package
names averaging at least 5.2% of recommendations from commercial models and 21.7% from open-source ones, 205,474 unique
invented names in all. The check is cheap: look the package up before the install command runs.

## Checking accessibility as you build

`AGENTS.md` holds the requirement and the two standards that bind. This is how to check it rather than why it matters.

A screenshot pasted into chat catches layout problems that words cannot describe, and it is the cheap version worth
starting with. A browser automation tool connected to the agent is the better version, because it returns the
accessibility tree rather than a picture, which means a question like whether a button carries its own accessible name
becomes answerable. It needs setting up, so it is not part of these starter files.

An automated check reaches part of the way and no further. Contrast, heading order and missing labels it can find.
Whether the wording makes sense to a frightened person it cannot, and neither can you without asking one.

## What an open repository is expected to have

Not ceremony. These are the files somebody arriving at the repository looks for, and their absence reads as
abandonment.

A **README** for the project. What it is, who it is for, how to run it, how to run the tests. This is the file most often
missing after an agent builds something, because nobody asks for it.

A **licence**. Decide it rather than leaving it off, because no licence means nobody may reuse it. If the work was built
with enhanced federal funding, ownership and licensing conditions attach to it and the choice is not free.

A short file of **contributing guidance**: how to propose a change, how to run the checks, and one feature per pull
request rather than six. This matters more than usual when contractors and vendors will be the ones contributing.

A **changelog**, in the [Keep a Changelog](https://keepachangelog.com/) shape, newest version first, with entries
grouped under Added, Changed, Deprecated, Removed, Fixed and Security. That source makes a point of deprecations in
particular, because they are what a reader most needs warning about. Written for a person deciding whether to upgrade,
not generated from commit subjects.

Two conventions that cost nothing and are worth adopting on the first commit rather than the fiftieth.
[Conventional Commits](https://www.conventionalcommits.org/) for commit subjects, meaning a `feat:`, `fix:`, `docs:` or
`refactor:` prefix, because it makes history readable and a changelog possible.
[Semantic versioning](https://semver.org/) for releases, or dated versions if the thing is not a library anybody
depends on.

A **security contact**, even one line saying where to report a problem, if the repository is public.
