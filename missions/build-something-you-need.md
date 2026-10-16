# Mission: build the thing you have been meaning to build

For the tool you keep describing to colleagues, or the spreadsheet that should have been an application two years ago,
or the calculation everyone in your unit does by hand. You do not need an existing repository. You do not need to know
how to write software.

What you finish with is a design document and a delivery plan, committed. Not an application. That is the order the
work goes in, and the time you spend before any code exists is what decides whether the rest of it is any good.

Allow two to four hours, not one. The first step alone is a long conversation and that is the point rather than an
overhead. You can stop after any step and pick it up later, because everything is written down as you go.

`HOW-TO-WORK.md` explains why this sequence. This is the sequence.

## One. Describe it, and refuse the first offer to build

Open a new session. Describe what you want in your own words, the way you would to a colleague. Then:

> Before we build anything, research this. Has anyone built it? Is there open source I could use instead? What is the
> state of the art? Send sub-agents if that helps. Do not scaffold anything yet.

Read what comes back. Ask about the parts that surprise you. Follow a tangent and come back out. Give this a real hour.

It will offer to start building. Say no. That offer arrives exactly when you feel productive and are not yet right.

Useful things to push on while you are here. What does this need to know that only your organisation has. What would it
get wrong that matters. Who is harmed if it is wrong. If the answer to that last one is a person who could lose
something, say so out loud in the conversation, then read the four rules under "What the software may decide" in
`AGENTS.md` before going further, because some of what you were about to build is not allowed.

## Two. Get the design document

> Take this whole conversation, the research, the decisions and the things we ruled out, and write a design document we
> can anchor this project to, saved as `docs/design.md`. Mark anything you inferred rather than confirmed.

Read it. It should describe the thing you meant. If it does not, say what is wrong and have it fixed now, while fixing
it is a paragraph rather than a refactor.

## Three. Get the delivery plan, separately

> Now a separate document, a delivery plan for the first epic, saved as
> `docs/epics/0001-first-version/delivery-plan.md`: the order we build this in. Coarse increments, each one leaving
> something that works and is better than before. The first one should be thin and touch every layer. Put a checkbox
> against each increment so I can see where we are.

Two documents on purpose. The first says what and why, the second says in what sequence and how far along it is. A task
list is a bad place to keep an assumption that has gone stale.

If the agent calls it something else, an increment plan or a roadmap or a task list, say delivery plan and have it
renamed now. The name is worth being fussy about because in three weeks you will be looking for it.

## Four. Review the plan before any code exists

Type `/review`.

Be clear about what this can and cannot do here. There is no code yet and no outside source to check the documents
against, so the reviewers are checking the plan for internal sense: whether it contradicts itself, whether it assumes
something nobody established, whether the first increment could actually run in the order written, whether it drifted
away from what you asked for. That is worth doing and it is narrower than a review of finished work.

Which means you are the outside source. You know the program, and the findings you are best placed to judge are the
ones about the domain: a rule stated wrongly, a step that would not survive a fair hearing, a threshold that is not
what the manual says. Take those seriously and be sceptical of the rest.

Work through them one at a time. Some will be wrong. Note how many you threw out, because that number is worth knowing
the next time you read a review.

Then tell it what survived:

> Apply findings 1, 3 and 4 to the documents. I rejected 2 and 5, because [your reason]. Do not change anything else.

## Five. Dry-run the first increment

> Pretend you are executing increment one. Do not change anything. Tell me what you hit.

This costs one prompt and catches plans that cannot actually run in the order written.

## Six. Commit, and hand off

> Write a commit message for these two documents and show it to me before committing.

Read it, commit it. Committing saves a snapshot on your own machine and puts nothing on the internet. If you want it on
GitHub as well, that is a separate step called pushing, and you can ask Kiro to do it and tell you what it did.

That commit is your real piece of work, and it is the artifact everything after depends on.

Then, if your context is getting full:

> Give me the ideal prompt to hand your successor for building increment one.

New window, paste, go.

## Then you are building, and something changes

Increment one is where you need software installed. Everything up to a design document and a delivery plan needs nothing,
and building an actual application needs a toolchain. On a locked-down machine that is a request to whoever approves
software, and it is worth finding out early whether the answer is no.

If you cannot install software on this machine, you have not wasted the afternoon. A design document and a delivery plan
are the artifacts that let somebody else build the thing, or that go into a request explaining why you need the tools, or
that feed a procurement. Ask for what you need in writing:

> Write me a short request I can send to whoever approves software. What exactly needs installing for increment one,
> what each thing does in one line, and why this cannot be done without it.

That gives you a named list rather than the word "toolchain," which is the difference between a request that gets
approved and one that gets queued.

If you can install things, type `/stack` for one opinionated starting point, or ignore it if your team has a mandated
stack.

Ask it to teach you as it goes. "What is this file for." "Why a component." "What does that error mean." That is a
legitimate way to work and it is how the person who wrote this learned.

## What good looks like

A design document that describes the thing you actually meant, with the guesses marked as guesses.

A delivery plan where the first increment is thin, touches everything, and could ship.

A record of what the review caught, including what you rejected.

Both committed, so that when you come back in three weeks the reasoning is still there rather than in a closed chat
window.

## If it goes wrong

It starts writing code despite being told not to. Stop it and say so. `AGENTS.md` tells it to change only what it was
asked to change and not to scaffold before the problem is understood, so this means the rules are not reaching it. Ask
what rules apply in this repository, and if two lists do not come back, start a fresh session.

The design document is vague and agreeable. Usually that means the conversation in step one was too short. Go back and
push on the specifics, especially what the thing must not do.

The delivery plan is one enormous increment. Say so and ask for it to be broken down until the first one could ship on
its own.

You realise halfway through that the thing already exists as open source. That is a good outcome for an hour's work.
Take it.
