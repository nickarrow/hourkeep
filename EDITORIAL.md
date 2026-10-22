# Editorial policy for HourKeep

This document belongs to the repository owner. The owner's latest explicit instruction wins over anything here, and
anything here wins over a suggestion from Prosekeep, from a reference standard, or from an agent.

Where this file and `AGENTS.md` overlap, they say the same thing on purpose. `AGENTS.md` is the working agreement an
agent reads in every session. This file is what the Prosekeep skill and CLI read, and it is the file a non-agent
editor would read. If they ever disagree, `AGENTS.md` is the one that was decided first and it wins until the owner
changes both.

## Purpose and audience

- Publisher: HourKeep, a free, open-source project. Not part of any government and unable to see or change anyone's
  Medicaid case.
- Primary readers and tasks: an adult aged 19 to 64 on Medicaid or applying, usually holding a letter with a
  deadline, often on a phone, reading at about a sixth to eighth grade level. Second, somebody helping them: a
  relative, a church or food bank volunteer, a navigator, a legal aid worker. Third, Medicaid policy experts reading
  the review pages, and developers reading the repository.
- What the writing should help people do: work out what their letter asks of them, gather the proof for the months it
  names, and put it in a package they can send. Never to work out whether they qualify. The state decides that.
- Source of approved facts: `docs/domain/community-engagement-extract.md` is the authority wherever it has a row,
  and each row quotes a source stored under `docs/domain/sources/`. Where a row and the regulation disagree, the
  regulation wins. `docs/design.md` is the authority on what HourKeep is and does.

## Voice and register

A paragraph to preserve, from `public/index.html`:

> Don't wait for this app. Contact the office that sent your letter, using the phone number on it. Look for a deadline
> on the letter. Before that date, do what the letter asks, or contact the office if you can't or aren't sure how. If
> you can't find a date, call and ask.

Short sentences next to long ones. Contractions on the pages a person reads. The imperative, addressed to one person.
No hedging in front of the thing they have to do.

Language used deliberately: "community engagement" beside "work requirements", because the letter may say either.
"Look for a deadline on the letter" rather than "the letter will show a deadline", because only a notice of
noncompliance has to carry one. "The state decides" rather than any phrasing that implies HourKeep decides.

Language avoided: any word that states a person's status, any number presented without saying how it was reached, and
green or red used to mean compliant or not compliant.

Register changes by document. A page a person on Medicaid reads is plain and direct. A decision record, a delivery
plan or a design document is written for somebody who has to defend it in a meeting, and carries its citations.

## Document responsibilities

| Type | Reader question and job | Required sections | Primary source |
| --- | --- | --- | --- |
| The published page, `public/index.html` | "I got a letter, what do I do today?" | What HourKeep is and is not, what to do about the letter, appeal rights, Spanish | `docs/domain/`, cited in an HTML comment rather than on screen |
| Prototype screens, `prototype/` | "What does this tool ask of me?" | What the tool does and does not do, on every screen that collects something | `docs/design.md` |
| Design, `docs/design.md` | "What is being built and what has to be true?" | What it is, who for, what it does, how it is built, open questions, sources | the corpus and the owner's decisions, each dated |
| Delivery plan, `docs/epics/*/delivery-plan.md` | "In what order, and what is done?" | the order, and the record of what landed | the epic's design |
| Decision record, `docs/decisions/` | "Why was this chosen?" | Context, Decision, Consequences, Alternatives considered | whatever was true on the date in the record |
| Agent Action Record, `docs/aar-*.md` | "What did the agent actually do, and who decided?" | the six parts ClosedTab sets | the run itself |
| Review pages, `docs/review/` | "Does this row say what its source means?" | generated, so nothing is written here by hand | the rows |

## Writing mechanics

The mechanical rules are in `.editorial.json`, all seven enabled, and `prosekeep check` is the only thing that
enforces them. In words:

- No em-dashes and no en-dashes in prose. Use a comma, a full stop, or a new sentence. An en-dash between two
  numerals is fine and the check allows it.
- Dates in prose are month first: January 1, 2027. Dates that identify a version or a record are ISO: 2026-10-22.
- Link text names its destination. Never "here", "click here" or "learn more".
- A heading names its subject or its finding. Never "Overview", "Background", "Summary", "Key takeaways" or "Final
  thoughts" standing alone.
- No stock AI vocabulary: `delve`, `pivotal`, `seamless`, `leverage`, `unlock`, `empower`, `robust`,
  `testament`.
- No staged introduction. Start with the point.
- No `not just X but Y`, and no `it isn't X, it's Y`. Say what it is.

These are not checked by any tool and are still policy, from `AGENTS.md`:

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

Every rule the software encodes carries a citation: the section, the URL, and a plain paraphrase. Anything that
cannot carry one is a guess and is labelled rather than shipped quietly.

Mark a claim Proposed where there is a proposal, Open where there is not, and Inferred where it rests on a guess, as
`docs/design.md` already does. Say which claims were checked against a source, which were taken on trust, and which
are guesses.

An agent may not revise: what HourKeep refuses to decide, the citation attached to any rule, a row in
`docs/domain/community-engagement-extract.md` without reading the source, the owner's positioning, or anything in
`docs/decisions/`. A decision record is superseded by a new one, never edited.

A person with Medicaid policy knowledge reviews the rows. An agent's check is not that review, and the review pages
record which it was.

## Publishing checks

Run from the repository root, after any change to prose:

```
npx prosekeep@0.3.0 check --changed --base origin/main
```

Until Prosekeep 0.3.0 is on npm, run it from a checkout instead; `.github/workflows/editorial.yml` shows the pinned
commit. The npm registry serves 0.2.0, which is older than the rules this project configured.

After any change to `docs/domain/`, the skill, the checker or its tests, also run the corpus checks named in
`AGENTS.md`. After a change to the rows, regenerate `docs/review/` with `python3 scripts/build-review-pages.py`.

`docs/domain/` and `docs/review/` are outside the editorial lint. The first quotes federal law, which uses em-dashes
throughout and must never be edited to satisfy a style rule. The second is generated, so a finding there is fixed in
the row it came from. `.kiro/skills/prosekeep/` and `.kiro/skills/closedtab/` are vendored copies of other
repositories and are not edited here.

A passing check proves that seven line patterns did not match. It does not establish that the writing is accurate,
accessible, readable by the person it is for, or acceptable to the owner. The review in
`.kiro/skills/prosekeep/references/review.md` does that, and the owner signs off.

## Reference standards

Seven modules are selected in `.editorial.json`: 18F content, federal plain language, GSA content, accessible
content, source evidence, AI writing, and publishing. They are in
`.kiro/skills/prosekeep/references/standards/`. They are guidance, adopted here as policy only where this file says
so. Nothing in them licenses a claim of 18F, GSA or WCAG compliance.
