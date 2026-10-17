# Epic 0001: a policy corpus HourKeep can rely on

Status: Proposed, 2026-10-16

`docs/design.md` says HourKeep tells nobody anything until its policy corpus is right. This epic makes it right and
keeps it checkable. It changes `docs/domain/`, adds one skill and two scripts, and writes no app code.

## Why

Research on 2026-10-16 reported 39 findings of wrong or out-of-date passages in `docs/domain/`. An AI agent then
rechecked each one against its sources and confirmed 36, confirmed 2 in part and partly rejected 1 (research ledger,
Ledger A). Some of the errors would lead a person to do less than the rule requires: the six-month renewal exception
read as covering "most" section 1115 enrollees when CMS's test is narrower (research L2-3), a hardship dependent read as
a minor child only (L8-3), and "most people will not be asked for anything" against CMS's estimate that 8.8 million
will (L8-9). The corpus also never cited CMS's six-month renewal letter, SMD 26-001 (L2-2), or the bar on marketplace
tax credits (L1-9).

Most of the drift has one cause. Three files, `rule-extract.md`, `what-matters-most.md` and `state-options.md`, restate
the same provisions, and nine of the sixteen contradictions the corpus audit found sat in those three (research L8,
sections B and E). A correction reached one copy and not the others.

Nothing in `docs/domain/` says whether, how or when a rule was checked. `AGENTS.md` and the `hhs-benefits` skill ask
for a citation on every rule and a label on every guess, and stop there. The bootstrap goes further in its
`CONTRIBUTING.md`, which was not copied here: a domain layer marks every item as verified, with the method and the
date, or as unverified, so that an agent can tell a checked rule from a guess without leaving the file
(github.com/nickarrow/agentic-engineering-bootstrap, release 2026.10.17). It asks that of fields where the risk is a
wrong answer. Where a person can lose coverage, HourKeep needs it more.

## What it changes

Sources are stored verbatim, each listed in a manifest with its URL, retrieval date and hash. The June 29, 2026
correction to the rule, which the corpus cites and does not store, is added, along with current eCFR text and CMS's
guidance documents. The stored June 3 printing stays as it is, and the manifest records that the correction supersedes
it for §§ 435.557 and 435.558.

One extract, a new file, becomes the authority for Medicaid community engagement. Each rule in it is a row with an
identifier, a plain paraphrase, the citation down to the paragraph and the Federal Register page, the stored source and
line it rests on, a source tier, whether it is a state election, the date it was verified and how, the direction an
error would cost a person, and what should trigger a recheck. Rows arrive a topic at a time. When a topic lands, the
passage on it in each older analysis file is replaced by a pointer to the new rows, and the corrections the research
found in that passage are applied there and then, so no stale copy outlives its topic. A passage becomes a pointer only
once every claim in it has a row. A claim no row covers yet, or a passage that also covers topics still to come, is
corrected in place and waits for its own topic.

The § 435.603 household income extract in `supporting-regs/README.md` stays, without its v1 notes, and keeps
precedence on income.

State facts move into structured data files, one per state plus one for the federal default, each fact with a value, a
citation, its sources, the date it was checked, and the date of each source, so a fact taken from something older than
the rule shows it. The tracker in `state-options.md` becomes these files. They start with the federal default and
Colorado.

A HourKeep domain skill, `.kiro/skills/medicaid-community-engagement/SKILL.md`, carries the operative rules in short
form with pointers into the extract: about 40 to 60 rows, the Computed, Conditional and Deferred labels applied to
HourKeep's numbers, CMS's vocabulary, a checklist of errors this corpus has already made, and a dated watch list. The
generic `hhs-benefits` skill stays.

Four analysis files are retired and two move. `rule-extract.md` goes once every section in it is a pointer.
`what-matters-most.md` goes once its priorities and its error checklist are in the extract and the skill.
`state-options.md` goes once its tracker is in the state facts files; its v1 schema stays in history on `experiment-1`.
`hr1/HR1-Impact-Summary.md` gives way to a short extract of the statute sections HourKeep relies on. The two Code for
America blueprint summaries move to `docs/domain/prior-art/` with a note that they predate the rule, and each error
already found in them gets a dated correction. One decision record sets out the whole restructure and says where each
part goes.

The research this epic works from is kept as dated records in `docs/domain/research/`: the 2026-10-16 verification
ledger with its eight lane reports, and the 2026-10-15 SNAP report. Rows and documents cite them by finding ID. They are
evidence for what the corpus says, never authority in place of the sources they cite.

## Formats

Increment 1 builds these, and every later increment fills them. Where this section leaves a detail open, increment 1
settles it and writes it here.

### Where things live

| Path | What it holds |
|---|---|
| `docs/domain/sources/` | Sources stored from now on, in one folder per publisher: `federal-register/`, `ecfr/`, `cms/`, `colorado/` and so on |
| `docs/domain/sources/MANIFEST.json` | One entry for every stored source in `docs/domain/`, those stored before this epic included, at the paths they already have |
| `docs/domain/community-engagement-extract.md` | The rows, grouped by topic under `##` headings |
| `docs/domain/states/federal.json`, `docs/domain/states/co.json` | State facts for the federal default and for Colorado |
| `docs/domain/open-questions.md` | Policy questions only CMS, a state or a policy person can answer, each with who can answer it |
| `docs/domain/research/` | The research records |
| `docs/domain/prior-art/` | The Code for America summaries, from increment 3 |
| `.kiro/skills/medicaid-community-engagement/SKILL.md` | The domain skill |
| `scripts/check-corpus.py` | The checker |
| `scripts/extract-pdf-text.swift` | The script that makes each PDF's text extraction, using macOS's PDFKit |

Sources stored before this epic stay where they are, because the corpus cites them by file and line. Paths in the
manifest, the rows and the state facts are relative to the repository root.

### A rule row

A row is a `###` section in the extract. Its heading is its identifier: lowercase words joined by single hyphens,
unique, and never reused for a different rule. Under the heading comes a list with one field per item. A long value
continues on lines indented by two spaces, and a continuation line never begins with `- `. A row has no blank line
inside it, and nothing comes between rows except blank lines and headings. This illustration has not been checked
against its source, so it says so:

```markdown
### notice-response-period

- Rule: A person has 30 calendar days to respond to a notice of noncompliance, beginning on the day they receive it.
- Citation: 42 CFR 435.558(a)(2); 91 FR 39030
- Source: docs/domain/sources/federal-register/C1-2026-11094.xml:136 "30 calendar days"
- Tier: regulation
- State election: no
- Verified: no
- Error direction: dangerous
- Recheck: final rule; correction notice
```

The fields, all required, and a field with an empty value counts as missing:

- Rule: the rule in plain words.
- Citation: the provision down to the paragraph, then the Federal Register page of the printing that governs it: for
  §§ 435.557 and 435.558, the June 29 correction; for the rest of the interim final rule, the June 3 printing. A
  provision older than the rule cites its CFR paragraph and the eCFR date it was read on instead, because eCFR's
  source notes do not say which of several documents set a given paragraph. A statute or regulation citation names a
  section by its number. Any other names the document and, where the document has them, its page, section or docket
  entry.
- Source: a stored file with a manifest entry, a line in it, and a few words in quotes that appear on that line.
  Lines are counted as `grep -n` counts them, split on newlines only. The quoted words match the stored text exactly,
  markup and entities included, and contain no double quote: the Federal Register's XML, for one, puts a thin space
  after § and writes & as `&amp;`, so quote words that avoid such characters where possible. A PDF is cited through
  its text extraction, which can separate a paragraph's label from its text, so the paragraph in the Citation is read
  on the rendered page. The field repeats when a rule rests on more than one source. A row whose source is not stored
  yet says `Source: not stored, <URL>` and must also say `Verified: no`.
- Tier: one of the tiers below.
- State election: `no`, or `yes` followed by what the state chooses and what applies where it has not chosen.
- Verified: a date and a method, or `no`. The methods are `read in source`, meaning the quoted words were read at the
  cited place on that date, and `ledger <finding ID>`, meaning the 2026-10-16 verification ledger confirmed it and
  nobody re-read it. Every check so far has been made by an AI agent. A row checked by a person names them after the
  method.
- Error direction: `dangerous` if getting the rule wrong would lead a person to do less than it requires, `burdensome`
  if more, and `neither` if it changes only a citation, a date or context. These are the research ledger's
  definitions. A rule that could go wrong either way is `dangerous`.
- Recheck: one or more triggers, separated by semicolons, from this list: `final rule`, `correction notice`,
  `court ruling`, `CMS guidance`, `state plan amendment`, `state rule`, `federal minimum wage`, `eCFR amendment`, or
  `date YYYY-MM-DD` for a known event such as a board meeting. A trigger may add detail after a colon.

Two optional fields may follow: `Corrected:`, once for each dated correction, saying what the row said before and why
it changed, and `Note:`.

The tiers, highest first in each group:

- Federal: `statute`, `regulation`, `preamble`, `proposed regulation`, `agency guidance`
- State: `state statute`, `state regulation`, `state plan`, `state draft rule`, `state agency page`
- Either: `court`, `party filing`, `secondary`

### Stored sources and the manifest

A stored source is the bytes as fetched, unedited. Federal Register documents are stored as the Federal Register's
XML, eCFR sections as the eCFR API's XML for a stated date, web pages as the HTML received, and PDFs as the PDF with a
text extraction beside it that marks where each page starts. Rows cite the extraction by line.

Each manifest entry gives the path, its SHA-256 hash, the URL a document cites for it, the URL that actually served the
bytes after any redirect, the command that fetched it and when, whether the file is verbatim or derived, what a
derived file came from and how it was made, and what supersedes it, if anything. eCFR's XML carries no date of its own,
so its entry records the eCFR date. Any of these the record never kept, such as the URL, the retrieval date or how a
derived file was made, says `not recorded`; nothing is guessed. Files already in the corpus are re-fetched where they
can be. A fresh copy identical to the old file adds its URL and date to the old file's entry; one that differs is
stored under `docs/domain/sources/` as a source of its own. The June 3 text with its `[[FR p.33348]]` page markers,
the copies of Public Law 119-21 in `hr1/`, `SECTION-INDEX.txt` and the two text files in `supporting-regs/` are
derived copies and are listed that way. The manifest, and not the file, marks the June 3 printing as superseded for
§§ 435.557 and 435.558, because a mark in the file would change its hash.

The hash proves a stored copy has not been edited since it was stored. It says nothing about whether the source has
changed since; recheck triggers cover that. A `.gitattributes` file at the repository root marks every stored source
`-text`, so git never rewrites its line endings and breaks the hash: `docs/domain/sources/** -text` for the new folder,
and one line for each older source, which shares its folder with analysis files.

### State facts

A state file is a JSON object naming the state and holding a list of facts. Each fact is an object with these keys,
dates written as YYYY-MM-DD:

- `row`: the identifier of the row it belongs to
- `setting`: where it applies, such as at application, at renewal or on appeal
- `value`: the value as the source states it, and `counts_from`, the event a period counts from, where it is a period
- `status`: `known`, `inferred`, or `not published`, with a `note` saying from what it was inferred, or where and when
  the search ran
- `citation`: in the same form as a row's Citation
- `sources`: a list, one entry per source, each with `source` in the same form as a row's Source, `url`, `tier`, and
  `source_date`, the latest date the source gives itself, or `not stated`
- `checked`: the date the fact was last checked

JSON, because Python's standard library reads it. A fact whose sources include a state agency page or a secondary
source dated before June 3, 2026 prints a warning that it may predate the rule; it does not fail.

### The skill

The skill restates rows briefly and holds no rule of its own. Each list item in it that states a rule ends with the
row's identifier in square brackets and the row's citation, and every number before the identifier appears in that
row's Rule.
It stays under 500 lines and about 5,000 tokens, as the [Agent Skills specification](https://agentskills.io/specification)
recommends. Its `name` matches its folder, and its description uses the words a person would use about the work, such
as Medicaid work requirements, letters, deadlines and exemptions, because the description decides whether the skill
loads at all.

### The checker

`scripts/check-corpus.py` uses Python's standard library only and runs on Python 3.9 or later. It reads the extract,
the state facts files, the manifest and the skill, skips anything git ignores, and fails, naming each problem, when:

- a row lacks a field, a value is outside its vocabulary, or an identifier is malformed or used twice
- a citation is empty, says TBD or TODO, or, for a statute or regulation tier, names no section number
- a source's file has no manifest entry, its line does not exist, or its quoted words are not on that line
- a stored source's hash differs from the manifest, a manifest entry's file is missing, or git does not treat a
  manifest path as `-text`
- a file in `docs/domain/` outside `research/` is neither in the manifest nor one of the corpus's own files, which the
  checker names: the extract, the state facts, the open questions, the analysis files still in use, and any README
- a state fact lacks a key or names a row that does not exist
- the skill passes 500 lines, names a row that does not exist, gives it a different citation, or states a number its
  row's Rule does not

It prints how many rows it checked and how many of them say `Verified: no`, and how many sources, state facts, facts
marked `not published`, warnings and skill items it matched. If the skill is absent it says so and checks the rest,
since deleting a skill is allowed. It cannot tell whether a skill item's words match its row's meaning; review does
that.

## What has to be true of every rule

- It cites the highest source there is. Statute and regulation text come first, then the preamble, then agency
  guidance, then a secondary source. For household income, the raw § 435.603 text beats any summary of it.
- Where two sources conflict, the row cites both, says they conflict, and the question goes on the open questions
  list, unresolved. Six-month renewals are the first case: 42 CFR 435.916(a)(1), as the interim final rule reprinted it
  (91 FR 33480), still says every 12 months, while SSA 1902(e)(14)(L) makes it six months for most expansion adults
  from 2027, as SMD 26-001 explains.
- It says whether it was verified, on what date, and how. Anything unverified says `Verified: no`.
- It names what would make it wrong.
- When it is corrected, every copy of the old claim in `docs/domain/` and in the skill is found and fixed in the same
  change. The stored sources and the research records are left out of that search. Both are kept as they were: the
  June 3 printing still carries the page numbers the correction replaced, and the research quotes the errors it found.

## What it will not do

- Write app code, or decide how the app loads these facts.
- Cover states beyond the federal default and Colorado. Values the research checked for other states are kept as
  leads, labeled as checked once and not maintained, unless the owner decides otherwise.
- Answer the open policy questions the research raised. They go into `docs/domain/open-questions.md`, each addressed to
  whoever can answer it: CMS, Colorado's HCPF, or a policy person.
- Add SNAP facts beyond what the SNAP awareness questions need.
