# Mission: document a system nobody wrote down

A first real piece of work. You need an existing repository that is under-documented, which describes most of them. If
you have no such repository, do `missions/build-something-you-need.md` instead.

`HOW-TO-WORK.md` explains why this sequence holds the task back until the end. This is the sequence.

This one is worth doing early because it is what agents are genuinely good at, and because it produces something your
colleagues can use immediately. It is also the honest starting point. The published evidence on AI coding help is
weakest for experienced people working in large familiar codebases, so beginning with understanding rather than
building is the safer bet.

Allow two hours, more if the system is large. Nothing needs installing for this one.

## One. Make it the expert before you give it the task

Open a new Kiro session in the repository and say something close to this:

> Become the expert in this repository. Read the documentation, send your sub-agents to explore, and work out what
> this is, what it does and how it runs. Do not change anything. When you are done, tell me what you found. Then I
> will give you a task.

Hold the task back deliberately. Tell it your goal first and you get a tour of whatever relates to your question
instead of an understanding of the system.

If it finds a defect while looking around, have it write the defect down and keep going.

## Two. Ask what it could not work out

> What could you not figure out? Where did you have to guess, and what would you need to be sure?

This is the most useful answer you will get all day. The gaps it names are usually the gaps a new colleague hits in
their first week.

## Three. Have it write the document

> Write a document explaining this system to someone joining the team. Cover what it is for, how it is put together,
> how to run it, and the decisions that look deliberate. Mark clearly anything you inferred rather than confirmed,
> and leave what you could not work out as open questions with your guesses named as guesses.

Insist on that last part. A document that reads as uniformly confident is worse than one that shows you where to be
careful, because somebody will act on the wrong half of it.

## Four. Review it before you believe it

Run `/review`. This is the good case for it, because the document makes claims about a real codebase and the reviewers
can go and check them against the code.

Then do the part people skip: take the findings one at a time, open the file each one points at, and check it yourself.
Some will be wrong. Note how many you threw out.

Then tell it what survived, naming the findings you accepted and the ones you rejected, so it changes only those.

## Five. Commit it

> Write a commit message for this and show it to me before committing.

Read it, then commit.

## What good looks like

Something a colleague could read to understand the system without asking you. Inferences marked as inferences. Open
questions written down rather than smoothed over. A record of what the review caught, including what you rejected.

## If it goes wrong

A confident but thin summary usually means the repository is larger than one pass. Point it at one area and repeat.

If it starts making changes, stop it and say so. `AGENTS.md` tells it to change only what it was asked to change, so
this means the rules are not reaching it. Ask what rules apply in this repository, and if two lists do not come back,
start a fresh session.

If it invents a file or a function that does not exist, that is worth knowing early, and it is why step four exists.

## When the next job is changing the system

Documenting a system is often the step before changing it. Before the first change:

- Ask for a short "This repository" section in `AGENTS.md`: what the project is, how to build and test it, and where
  things live.
- Have the document from step three saved as `docs/design.md`, the project design document, with each claim marked
  Current (confirmed by reading or running the code) or Inferred (a guess). The change itself becomes the first epic,
  with a design document of its own in `docs/epics/0001-<short-name>/design.md` saying what will be different.
- If an old planning document exists, retire it, and write a decision record saying where each of its claims went.
- Have the answers people already rely on pinned with tests before any logic changes. The agent writes the tests. You
  name the answers that must not move.

Then follow steps three to six of `missions/build-something-you-need.md`, with the delivery plan in the same epic
folder.
