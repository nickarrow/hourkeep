# Editorial policy for HourKeep

## Purpose and audience

HourKeep is a free, open-source project. It is not part of any government, and it cannot see or change anyone's
Medicaid case.

### Who reads it

1. An adult aged 19 to 64 on Medicaid or applying for it. Usually holding a letter with a deadline, often on a phone,
   reading at about a sixth to eighth grade level.
2. Somebody helping them: a relative, a church or food bank volunteer, a navigator, a legal aid worker.
3. Medicaid policy experts reading the review pages, and developers reading the repository.

### What the writing is for

Helping a person work out what their letter asks of them, gather the proof for the months it names, and put it in a
package they can send. Never helping them work out whether they qualify. The state decides that.

### Where the facts come from

- `docs/domain/community-engagement-extract.md` is the authority wherever it has a row. Each row quotes a source
  stored under `docs/domain/sources/`.
- Where a row and the regulation disagree, the regulation wins.
- `docs/design.md` is the authority on what HourKeep is and does.

## The interface comes first

For any word inside a screen, read `.kiro/skills/interface-copy/SKILL.md` before this file. It wins where the two
differ. This file governs every document: the README, the design, decision records, the research.

The skill adapts the CMS eAPD content guide. That guide was written for a long government form turned into an
application, filled in by somebody who will be judged on what they submit. That is what HourKeep is. No other standard
here covers sections, subsections, instructions, field labels, toggles, tables or a print view.

The skill reverses two of eAPD's assumptions. eAPD writes for state analysts who know the form. HourKeep writes for a
person who has never seen it.

`python3 scripts/check-interface-copy.py` enforces the part a checker can see.

## Voice and register

A paragraph to keep, from `public/index.html`:

> Don't wait for this app. Contact the office that sent your letter, using the phone number on it. Look for a deadline
> on the letter. Before that date, do what the letter asks, or contact the office if you can't or aren't sure how. If
> you can't find a date, call and ask.

What makes it work:

- short sentences next to long ones
- contractions, on the pages a person reads
- the imperative, addressed to one person
- no hedging in front of the thing they have to do

### Words used on purpose

| Write | Because |
| --- | --- |
| "community engagement" beside "work requirements" | The letter may say either |
| "Look for a deadline on the letter", not "the letter will show a deadline" | Only a notice of noncompliance has to carry one |
| "The state decides" | Nothing may imply HourKeep decides |

### Never

- any word that states a person's status
- any number presented without saying how it was reached
- green or red, used to mean compliant or not compliant

### Register changes by document

A page a person on Medicaid reads is plain and direct. A decision record, a delivery plan or a design document is
written for somebody who has to defend it in a meeting, and carries its citations.

## Document responsibilities

| Type | Reader's question | Required sections | Primary source |
| --- | --- | --- | --- |
| The published page, `public/index.html` | "I got a letter, what do I do today?" | What HourKeep is and is not, what to do about the letter, appeal rights, Spanish | `docs/domain/`, cited in an HTML comment rather than on screen |
| Prototype screens, `prototype/` | "What does this tool ask of me?" | What the tool does and does not do, on every screen that collects something | `docs/design.md` |
| Design, `docs/design.md` | "What is being built, and what has to be true?" | What it is, who for, what it does, how it is built, open questions, sources | The corpus, and the owner's decisions, each dated |
| Delivery plan, `docs/epics/*/delivery-plan.md` | "In what order, and what is done?" | The order, and the record of what landed | The epic's design |
| Decision record, `docs/decisions/` | "Why was this chosen?" | Context, Decision, Consequences, Alternatives considered | Whatever was true on the date in the record |
| Agent Action Record, `docs/aar-*.md` | "What did the agent actually do, and who decided?" | The six parts ClosedTab sets | The run itself |
| Review pages, `docs/review/` | "Does this row say what its source means?" | Generated, so nothing is written here by hand | The rows |

Every document starts with its point. Notes about the document itself, such as its status or how to read its markers,
go at the end.

## Writing mechanics

### What the checker enforces

The rules are in `.editorial.json`, all seven turned on. `prosekeep check` is the only thing that enforces them.

- No em-dashes and no en-dashes in prose. Use a comma, a full stop, or a new sentence. An en-dash between two numerals
  is fine, and the check allows it.
- Dates in prose are month first: January 1, 2027. Dates that identify a version or a record are ISO: 2026-10-22.
- Link text names its destination. Never "here", "click here" or "learn more".
- A heading names its subject or its finding. Never "Overview", "Background", "Summary", "Key takeaways" or "Final
  thoughts" standing alone.
- No stock AI vocabulary: `delve`, `pivotal`, `seamless`, `leverage`, `unlock`, `empower`, `robust`, `testament`.
- No staged introduction. Start with the point.
- No `not just X but Y`, and no `it isn't X, it's Y`. Say what it is.

### What no tool checks

Still policy, from `AGENTS.md`:

- Do not start a paragraph with a bold label standing in for a heading. Bold is fine as the term in a definition
  list.
- Do not announce a count and then withhold it. Give the count only when the number is information.
- Do not rate your own writing. "Worth noting" and "this is important" say the same thing as putting it in.
- Vary sentence length.
- Concrete numbers over adjectives. Say 900 lines, not unwieldy.
- State an admission plainly, with no clause afterwards that rescues it.
- Do not write about the document inside the document.
- One plain idiom per document is plenty, and none is fine.

## Factual fidelity and decisions

- Every rule the software encodes carries a citation: the section, the URL, and a plain paraphrase. Anything that
  cannot carry one is a guess, and is labelled rather than shipped quietly.
- Mark a claim Proposed where there is a proposal, Open where there is not, and Inferred where it rests on a guess,
  as `docs/design.md` already does.
- Say which claims were checked against a source, which were taken on trust, and which are guesses.

### What an agent may not revise

- what HourKeep refuses to decide
- the citation attached to any rule
- a row in `docs/domain/community-engagement-extract.md`, without reading the source
- the owner's positioning
- anything in `docs/decisions/`. A decision record is superseded by a new one, never edited.

### Who reviews the rows

A person with Medicaid policy knowledge reviews the rows. An agent's check is not that review, and the review pages
record which it was.

## Publishing checks

After any change to prose, from the repository root:

```
node /path/to/prosekeep/bin/prosekeep.mjs check --changed --base origin/main
```

That runs Prosekeep from a checkout, because 0.3.0 is not on npm yet. `.github/workflows/editorial.yml` names the
pinned commit. The npm registry serves 0.2.0, whose rules are older than this project's. Once 0.3.0 is published, the
command becomes `npx prosekeep@0.3.0 check --changed --base origin/main`.

Also:

| After a change to | Run |
| --- | --- |
| `docs/domain/`, the skill, the checker or its tests | The corpus checks named in `AGENTS.md` |
| The rows | `python3 scripts/build-review-pages.py`, to regenerate `docs/review/` |

### What the lint skips

| Path | Why |
| --- | --- |
| `docs/domain/` | It quotes federal law, which uses em-dashes throughout and must never be edited to satisfy a style rule |
| `docs/review/` | It is generated, so a finding there is fixed in the row it came from |
| `.kiro/skills/prosekeep/`, `.kiro/skills/closedtab/` | Vendored copies of other repositories, not edited here |

### What a pass means

A passing check proves that seven line patterns did not match. It does not establish that the writing is accurate,
accessible, readable by the person it is for, or acceptable to the owner. The review in
`.kiro/skills/prosekeep/references/review.md` does that, and the owner signs off.

## Reference standards

The eAPD addendum comes first. It sits outside `.editorial.json`, because Prosekeep's standards are a fixed registry in
its own source. Naming `eapd-content` in the `standards` array makes `prosekeep standards eapd-content` fail. So it is
a skill, which is what makes it an addendum rather than a module.

Seven modules are selected in `.editorial.json`:

- 18F content
- federal plain language
- GSA content
- accessible content
- source evidence
- AI writing
- publishing

They are in `.kiro/skills/prosekeep/references/standards/`. They are guidance, adopted here as policy only where this
file says so. Nothing in them licenses a claim of 18F, GSA or WCAG compliance.

### Which wins

This document belongs to the repository owner.

1. The owner's latest explicit instruction.
2. This file.
3. A suggestion from Prosekeep, from a reference standard, or from an agent.

Where this file and `AGENTS.md` overlap, they say the same thing on purpose. `AGENTS.md` is the working agreement an
agent reads in every session. This file is what the Prosekeep skill and CLI read, and what a non-agent editor would
read. If they ever disagree, `AGENTS.md` was decided first, and it wins until the owner changes both.
