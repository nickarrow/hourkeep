# Epic 0001: a policy corpus HourKeep can rely on

Status: Proposed, 2026-10-16

`docs/design.md` says HourKeep tells nobody anything until its policy corpus is right. This epic makes it right and
keeps it checkable. It changes `docs/domain/` and adds one skill. It writes no app code.

## Why

Research on 2026-10-16 flagged 43 passages in `docs/domain/` as wrong or out of date, and its verifier confirmed all
but one. Some of the errors would lead a person to do less than the rule requires: the six-month renewal exception
read as covering "most" section 1115 enrollees when CMS's test is narrower, a hardship dependent read as a minor child
only, and "most people will not be asked for anything" against CMS's estimate that 8.8 million will. The corpus also
never cited CMS's six-month renewal letter, SMD 26-001, or the bar on marketplace tax credits.

Most of the drift has one cause. Three files, `rule-extract.md`, `what-matters-most.md` and `state-options.md`, restate
the same provisions, and nine of the sixteen contradictions the corpus audit found sat in those three. A correction
reached one copy and not the others.

The bootstrap's domain layers need every rule to carry its source and say whether, how and when it was checked. Nothing
in `docs/domain/` does that today.

## What it changes

Sources are kept verbatim, each listed in a manifest with its URL, retrieval date and a hash. The June 29, 2026
correction to the rule, which the corpus cites and does not store, is added, along with current eCFR text and CMS's
guidance documents. The stored June 3 printing stays, marked as superseded for §§ 435.557 and 435.558.

One extract becomes the authority for Medicaid community engagement. Each rule in it is a row with an identifier, a
plain paraphrase, the citation down to the paragraph and the Federal Register page, a source tier, whether it is a
state election, the date it was verified and how, the direction an error would cost a person, and what should trigger
a recheck. `rule-extract.md` is rewritten into this shape.

The § 435.603 household income extract in `supporting-regs/README.md` stays, without its v1 notes, and keeps
precedence on income.

State facts move into a structured data file, one record per state and setting, each with a value, a source, the date
it was checked, a source tier, and whether it predates the rule. It starts with the federal default and Colorado.

A HourKeep domain skill, `.kiro/skills/medicaid-community-engagement/SKILL.md`, carries the operative rules in short
form with pointers into the extract: about 40 to 60 rows, the Computed, Conditional and Deferred labels applied to
HourKeep's numbers, CMS's vocabulary, a checklist of errors this corpus has already made, and a dated watch list. The
generic `hhs-benefits` skill stays.

Four analysis files are retired: `what-matters-most.md` (its priorities and error checklist merge into the extract and
the skill), `state-options.md` (its v1 schema stays in history on `experiment-1`; its tracker becomes the data file),
`hr1/HR1-Impact-Summary.md` (replaced by a short extract of the statute sections HourKeep relies on), and the two Code
for America blueprint summaries, which move to a prior-art folder with a note that they predate the rule. One decision
record covers the restructure and says where each part went.

## What has to be true of every rule

- It cites the regulation text where one exists. Regulation text beats the preamble, which beats agency guidance,
  which beats a secondary source. For household income, the raw § 435.603 text beats any summary of it.
- It says whether it was verified, on what date, and how. Anything unverified is labelled as a guess.
- It names what would make it wrong: a final rule, a correction notice, a court ruling, a state plan amendment, a change
  to the federal minimum wage.
- When it is corrected, the whole corpus is searched for the old claim, so no second copy survives.

## What it will not do

- Write app code, or decide how the app loads these facts.
- Cover states beyond the federal default and Colorado. Values the research checked for other states are kept as
  leads, labelled as checked once and not maintained, unless the owner decides otherwise.
- Answer the open policy questions the research raised. They go into a list addressed to whoever can answer them:
  CMS, Colorado's HCPF, or a policy person.
- Add SNAP facts beyond what the SNAP awareness questions need.
