---
name: review
description: Use when asked to review work, when the user types /review, or before anything substantial ships. Fans out several reviewers in parallel, each anchored to a different source, then requires every finding to be confirmed against the file before it is acted on. Covers the five review mandates, how to report findings by severity, and why the reviewers must not share one source.
---

# Review protocol

Type `/review` in chat to run this.

Send several reviewers at the work in parallel. Give each one a different job and a different source to check
against. The different source is the part that makes this work. Several agents reviewing the same text against the
same shared opinion produces four versions of one opinion.

Models are bad at finding errors in their own reasoning and good at fixing errors once somebody points at the spot.
That asymmetry is the whole reason to do this.

## Running it

Invoke reviewers two at a time so they run in parallel, and keep going two at a time until every mandate has run.
Give each one the file paths it needs. A reviewer that has to go looking will review the wrong thing. Cap each one's
reply so it stays readable.

These mandates earned their place by finding things. They are not a fixed set and they are not a ceremony.

Add one when you can name a source it checks against that none of the others does. Drop one when its source does not
exist in this work: there is nothing to check against a citation in a document with no citations, and a reviewer with
nothing to check will invent something to report.

Do not add one that reads the same material in a different mood. Adversarial, sceptical and thorough are moods. A
mandate needs a source, and the whole reason this works is that no two reviewers share one.

Against the source. Check every citation, figure and factual claim against the thing it cites. Does the source say
what the text claims? Is the number characterized correctly? Flag anything stated more strongly than its source
supports. Search for evidence published since that would change a conclusion.

Against the mechanism. Check whether the tools, commands and configuration actually behave the way the work assumes.
Read the current documentation. Where the documentation is ambiguous or contradicts itself, say so rather than
picking the reading that is convenient.

Cold, as the reader. Read it as the person it is for, with their knowledge and not yours. Where would they stop
reading? Which words are undefined? Where does it sound reasonable and leave them unable to act? Name the sticking
points concretely.

Red team. Attack the plan. Is the order defensible? What does it claim to deliver and not deliver? What is missing
entirely? Where is a research question wearing a delivery date?

Do it, do not read it. If the work contains instructions, one reviewer carries them out in a scratch directory instead
of reading them, using the literal commands a person would use, and does not apply judgment to fix an instruction that
is wrong. Report the broken result rather than the corrected one. This mandate was added because three rounds of careful
reading missed an instruction that silently dropped half the files it was copying and then reported success, and one
round of doing found it with the first command. Reading finds contradictions. Doing finds the thing that quietly does
nothing.

For code specifically, add: would a senior engineer be comfortable with this, looking at the whole repository rather
than the diff? No constants, no tests on a critical path, a 900-line file, a type stuffed with data. The thing this is
really guarding against is a future person having to debug something nobody understood when it was written.

## Size it, and keep the record light

Size the review to the change. A design, a plan, or a change to what the software does or says gets the full fan-out.
A refactor that changes neither gets the do-it reviewer and the tests, and no more.

Keep the working files in one folder per review under `.agents/`, named with the date and what it is for, which git
ignores. One report per reviewer. Cite sources by link and date rather than saving a copy, unless a reviewer needs the
copy to check a quote. No scripts unless they are going to be committed.

When the review is done, the record goes into the Done entry in the epic's delivery plan, or into the commit message
for a fix: which reviewers ran against which sources, how many findings, and where any decision went. Then the
review's own folder goes; `.agents/` itself can stay, since git ignores it. The record never points at the scratch
folder, because the scratch folder is about to not exist.

## Then do the hard part

Every finding is a lead, not a fact. Open the file. Confirm it yourself. Reviewers hallucinate line numbers and
occasionally invent the problem.

Report by severity: blocking, should fix, note. Each with the file, the quoted text, and the source or rule it
violates.

Say what you could not verify, explicitly.

Report counts you actually computed. If you did not compute it, write "roughly" or leave it out.

Say which findings you rejected and why, and how many you dropped. This step gets skipped and it is the one that
keeps the practice honest.

Report. Do not fix. Ask what to change.

## Why it is a command and not automatic

A hook could run this on a trigger, but a hook cannot make the fan-out happen. It can only put a request in front of
the agent, which then decides. Running it deliberately is the honest version, and one command is cheaper to
understand than automation that sometimes does nothing.

The cost is real. This uses a lot of tokens and a lot of context. It is still the highest-value thing in these
files.
