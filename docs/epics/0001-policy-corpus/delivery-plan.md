# Epic 0001 delivery plan: a policy corpus HourKeep can rely on

Status: Proposed, 2026-10-16. What the epic changes and why is in `design.md` beside this file.

- [ ] 1. One rule, all the way through
- [ ] 2. The federal rule, verified
- [ ] 3. The statute and the supporting rules
- [ ] 4. Federal and Colorado facts
- [ ] 5. The domain skill, complete

## Prerequisites

Checked 2026-10-16:

- The research this epic works from exists, in git-ignored scratch: the verification ledger and eight lane reports in
  `.agents/policy-research-2026-10-16/`, and the SNAP report in `.agents/snap-research/`. Scratch can be deleted, so
  each increment records what it used from them in its Done entry. The epic's last increment moves anything still
  needed into the corpus, after which both folders can go.
- The eCFR API answers when asked for compressed responses. medicaid.gov and cms.gov refuse plain requests and answer
  ones with browser-style headers.
- The Playwright browser tool disconnected on 2026-10-16. Nothing here needs it, but a reviewer that wants a browser
  will need it reconnected in Kiro's MCP panel.
- Python 3 is installed, so a checker can use its standard library and nothing else.

## Standing constraints

- Sources go in verbatim. Nothing in `docs/domain/` paraphrases a source without citing it.
- Every rule row carries its citation, source tier, verified date and method, the direction an error would cost a
  person, and its recheck trigger. A row without them is labelled unverified.
- When a claim is corrected, search all of `docs/domain/` and the skill for it in the same change.
- Corrections to dated claims are recorded with their date. Nothing is rewritten to look as if it was always right.
- No app code. American English. The house style in `AGENTS.md`.
- Each increment changes what HourKeep will say, so each gets the full review: a reviewer against the sources, one
  against the mechanism, a cold reader, a red team, and one who carries out the instructions.

## 1. One rule, all the way through

### Delivers

The new structure, proved on one topic: notices of noncompliance and fair hearings (42 CFR 435.558 and 431.206,
431.210, 431.220, 431.221, 431.230). Specifically:

- The June 29 correction stored, and a manifest listing every stored source with its URL, retrieval date and hash.
- The new extract's row format, written down once, with the rows for this topic.
- The state facts file's format, with the federal default and Colorado's values for this topic: the 30 days from
  receipt, the 5-day receipt rule, and Colorado's 60-day appeal window.
- The skill file, holding only this topic's rows, its precedence rules and the start of the watch list.
- A checker, `scripts/check-corpus.py`, that fails when a row lacks a citation, tier, verified date or recheck
  trigger, when a cited local file and line do not exist, or when a stored source no longer matches its hash.

### Deliberately not

The other topics. The old files stay as they are until the topic that replaces each one lands. No retirements yet.

### Why this shape

Every later increment fills the same structure. Proving the row format, the data file, the skill and the checker on
one topic first means a flaw in any of them costs one topic to fix. Notices come first because the design builds the
app around the letter.

### How you know it worked

- `python3 scripts/check-corpus.py` exits 0, prints the number of rows, sources and state facts it checked, and exits
  non-zero when a row's citation is deleted on purpose.
- A fresh session asked "how long does someone have to answer a notice of noncompliance, and when does the clock
  start?" loads the new skill, answers 30 days from receipt with receipt presumed 5 days after the notice date, and
  cites 42 CFR 435.558(a)(2) and (c)(4).

### Needs from you

Nothing.

## 2. The federal rule, verified

### Delivers

All of 42 CFR 435.550 to 435.563 as rows, with SSA 1902(e)(14)(L) and CMS's SMD 26-001 for six-month renewals. Every
correction the ledger confirmed for `rule-extract.md` and `what-matters-most.md` is applied, each dated.
`what-matters-most.md`'s priorities and its checklist of common errors move into the extract and the skill, and the file
is retired.

### Deliberately not

State values, the statute extract, and SNAP.

### Why this shape

The federal rule is the floor every state builds on, and most of the dangerous errors the research found sit in it.

### How you know it worked

The checker passes with every section from 435.550 to 435.563 represented. Each ledger finding against these two files
appears once in the Done entry as applied or rejected, with a reason for each rejection. A search of `docs/domain/` for
the old wording of each correction finds nothing.

### Needs from you

Approval of the retirement of `what-matters-most.md`, in the decision record that comes with this increment.

## 3. The statute and the supporting rules

### Delivers

A short statute extract: Public Law 119-21 sections 71119 and 71107, and section 10102 for the SNAP questions.
`supporting-regs/README.md` without its v1 notes and with a fresh eCFR snapshot. The two Code for America summaries
moved to a prior-art folder with a note that they predate the rule. `hr1/HR1-Impact-Summary.md` retired. The 32 lines
that point at v1's files, counted in decision record 0001, fixed.

### Deliberately not

New SNAP rules. The full HR1 text stays as it is.

### Why this shape

It removes the secondary sources that carried the oldest errors, once the extract no longer needs them.

### How you know it worked

The checker passes. No file in `docs/domain/` names a v1 decision record, wave or `src/` path. Each retired or moved
file is listed in the decision record with where its content went.

### Needs from you

Approval of the retirements and the move.

## 4. Federal and Colorado facts

### Delivers

The state facts file complete for the federal default and Colorado: look-back months at application and renewal,
hardship exceptions, income-to-hours, how medically frail status is shown and when documentation starts, how the 30
days are counted, submission channels, the appeal window, and the start date. Colorado's facts come from its draft rule
(10 CCR 2505-10 § 8.100), HCPF's pages and its English and Spanish letter templates, each with its retrieval date. The
values the research checked for other states are kept, labelled as checked once on 2026-10-16 and not maintained. The
open policy questions for HCPF and CMS are written down with who can answer each.

### Deliberately not

Maintaining any state other than Colorado.

### Why this shape

The design phases states in, starting with Colorado. Colorado's rule is a draft due before its Medical Services Board on
November 27, 2026, so its facts need a recheck date in the watch list.

### How you know it worked

The checker passes, and every Colorado value shows its source, its retrieval date and whether it comes from the draft
rule.

### Needs from you

Whether to keep the other states' checked-once values in the file, as proposed, or leave them in the research record.

## 5. The domain skill, complete

### Delivers

The skill with all its rows, the number labels, CMS's vocabulary, the error checklist and a dated watch list: the
Massachusetts v. Oz hearing on October 22, 2026, Taylor v. Kennedy, the IRS proposed rule open for comment until
November 30, 2026, Colorado's rule, SNAP's pending rule, and the next eCFR check. Anything still needed from the two
research folders moved into the corpus, and both folders deleted.

### Deliberately not

App code, and any change to `AGENTS.md`'s four rules, which the skill may sharpen and may not loosen.

### Why this shape

The skill is what every later session reads, so it comes last, from a corpus that is already checked.

### How you know it worked

A fresh session given five questions from the error checklist loads the skill without being told to and answers each
with the right citation. The questions are written before the session runs.

### Needs from you

Nothing.
