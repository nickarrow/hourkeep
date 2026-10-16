---
name: project-docs
description: Use when writing or updating a design document, a delivery plan, or a decision record. Also use when asked to write down a plan, the order of work, a sequence of increments, requirements, or what has been decided so far, and when somebody starts a new feature or the next body of work. Covers the three documents this practice keeps, what each is for and where it lives, epics and their folders, the shape of a delivery plan entry, and when a decision deserves its own record.
---

# The three documents

A project keeps three kinds of document. Three, not six. The commonest failure is a fourth document that overlaps two
of these and then goes stale quietly.

| Document | Where | Job | Lifecycle |
|---|---|---|---|
| Design document | `docs/design.md` for the project; an epic may add its own | What is being built, why, and what has to be true | The project's is kept current. An epic's is frozen once the epic is done |
| Delivery plan | One in each epic's folder | In what order, and what is done so far | Living while its epic is open, then frozen |
| Decision records | `docs/decisions/`, one list for the whole project | A choice made along the way, and why | Append-only. Superseded, never edited |

## Epics

An epic is one body of work toward a goal you can say in a sentence, delivered as one or more increments.

```
docs/
  design.md                 the project design document: what the project is now
  decisions/
    0001-short-title.md     decision records, one numbered list for the whole project
  epics/
    0001-first-version/
      delivery-plan.md      the first epic; docs/design.md was written for it
    0002-short-name/
      design.md             what this epic changes, and why
      delivery-plan.md      its increments and its record
```

Number the folders in the order the epics are created and never renumber them. An epic's design document says only
what that epic changes and why, and leaves everything else to the project design document. A new project's first epic
usually needs none, because `docs/design.md` was written for it. Under the title of the epic's design document, or of
its plan when it has no design document, put a status: Proposed, In progress, Done with a date, or Dropped.

When an epic is done, mark it Done and leave it alone. It is history now, and history only takes a dated correction.
By then the project design document already says what the epic made true, because every increment's Done entry put it
there.

A fix needs no epic. It gets a branch and a commit message saying what changed and why. If the work needs a
conversation before you start, or more than one increment, it is an epic.

Design as many epics ahead as you like. One person builds one at a time, and the open epic's plan is where the work is.
The layout is as much for a team as for one person. Several people can work at once, on different epics or different
increments of one, because everybody works against the same project design document and the same list of decisions.

A project that already keeps its plan at `docs/delivery-plan.md` moves it into `docs/epics/0001-<name>/` when the next
epic starts, and fixes the links to it in the same commit.

## The design document

One document for the project, `docs/design.md`, and the only design document kept current as the project changes. It
covers what the thing is, who it is for, what counts as working, what it will not do, and what has to be true for it to
work at all. It holds the requirements rather than putting them in a separate file.

Leave the how to the reader and to the agent. The design document says a game has to be drivable from across a room
with no mouse. It does not say which key handler to use.

Do not split it to make it shorter. The file-length target in the `writing-code` skill is about code. A design
document is one argument, and cutting it into four files is how the argument stops being followable. If it is genuinely
covering two products, that is two design documents, and the giveaway is that neither half refers to the other.

Mark anything inferred rather than confirmed. A document that reads as uniformly confident is worse than one that shows
where to be careful, because somebody will act on the wrong half of it.

For a system that already exists, label each claim Current (what the code does now, confirmed by reading or running
it), Target (decided, not yet built) or Inferred (a guess, named as one). The project design document holds what is
Current and marks what is Inferred. An epic's design document holds the Target, and each increment that lands moves
its part into the project design document as Current.

Sequencing stays out. That is the delivery plan's job, and keeping them apart is what stops a stale assumption hiding
inside a task list.

## The delivery plan

An ordered list of increments. An increment is a chunk of work that leaves the thing running and better than before.

On the word. This is what Scrum would call a sprint's worth of work, what Kiro's own specs put in `tasks.md`, and what
the AI-DLC method calls a Bolt. It is scoped by what ships rather than by how long it takes, which is why it is not
called a sprint: there is no fixed length and asking how long one is has no answer.

Each epic has one, and it is also that epic's progress tracker. Do not keep a second status document.

Give each increment a checkbox in a list at the top, so the state is visible without reading the file, and mark it when
the increment lands.

Then one section per increment, each field under its own `###` heading rather than a bold label:

### Delivers

What exists at the end that did not exist before. Concrete.

### Deliberately not

What a reader might expect in this increment and will not get. This is the field that stops scope creeping, and it is
the one most often left out.

### Why this shape

Why this work, in this order. If the answer is only "it comes next", the increment is probably two increments or none.

### How you know it worked

An observable. Something a person can look at and see. Not "tests pass" unless you name which test and what it asserts.

### Needs from you

Anything the human has to supply: a credential, a decision, permission to install something. Put it here before
starting rather than discovering it halfway.

### Done, [date]

Appended when it lands. What was observed, what was deviated from, what is still unverified. Before you write it, fix
anything this increment made untrue in `AGENTS.md`, the skills, the README or the project design document, on the same
branch. That is part of the increment, not a separate task.

Then a review line: which reviewers ran against which sources, how many findings, and each rejected finding with its
reason. An entry without one is not done. Record the review itself rather than pointing at the scratch folder it ran
in, because that folder gets deleted.

The first increment should be thin and touch every layer, so it proves the pipeline before anything depends on it.

Two things belong once at the top rather than repeated in every increment. Prerequisites, checked rather than assumed,
with the state of each. And standing constraints, meaning the rules that hold across all of them.

If an increment changes what a design document says, update it in the same breath. A plan that has moved on from the
design above it is the most common way these two documents start lying.

## Decision records

One small numbered file per decision, in `docs/decisions/`, one list for the whole project. The form is Michael
Nygard's architecture decision record, from November 2011: a title, the context, the decision, a status, and the
consequences. Add the date, which his version does not ask for and which matters more when a session can produce
several in an afternoon.

Write one when either of these is true:

- The decision changes something already written down in the design document or the delivery plan.
- You rejected an alternative that was genuinely plausible, and somebody later will wonder why.

Everything else is a line in the delivery plan entry, or in the commit message for a fix. Without that trigger you get
either no decision records at all or twenty-five of them, and both are useless.

Never edit a decision record to make the past look tidier. Write a new one and set the old one's status to superseded,
naming the record that replaced it. The direction of a change is evidence.

## What this is not

This is deliberately not Kiro's spec workflow, which splits `requirements.md`, `design.md` and `tasks.md` and walks
three phases with an approval gate at each, or skips the gates entirely if you ask for a quick spec. Use that instead if
you want it, and it has real advantages: the task list gets a live execution view and Kiro will run independent tasks
concurrently. The difference here is that requirements stay inside the design document, because for a small project run
by one person the split produced three files that had to agree with each other and gave nothing back. The nearest
thing in Kiro to an epic folder is a spec folder.

It is also not the full AI-DLC method, which is built for a cross-functional team elaborating in one room and says so.
If you have that team, read AI-DLC rather than this.
