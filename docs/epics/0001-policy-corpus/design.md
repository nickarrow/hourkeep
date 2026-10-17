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

Three groups of stored copies go too, each replaced by something verbatim. The copies of Public Law 119-21 in `hr1/`,
which a formatter rewrote in November 2025, give way to GovInfo's text of the law, stored as served, along with the list
of its HHS sections kept beside them. The two eCFR text
files in `supporting-regs/` give way to eCFR's XML. The two Code for America blueprint PDFs, which state no license,
give way to links in the prior-art note, unless Code for America's terms allow keeping copies.

The research this epic works from is kept as dated records in `docs/domain/research/`: the 2026-10-16 verification
ledger with its eight lane reports, and the 2026-10-15 SNAP report. Rows and documents cite them by finding ID. They are
evidence for what the corpus says, never authority in place of the sources they cite.

When the epic is done, `docs/domain/` holds only these: stored sources, each listed in the manifest as verbatim or
derived; the extract; the state facts; the open questions; the § 435.603 extract; the research records; and the prior
art, marked as predating the rule. Nothing that is wrong or out of date survives outside a stored source or a dated
record. The checker enforces it, because its list of the corpus's own files ends up naming nothing else, so any file
left over fails.

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
| `tests/test_check_corpus.py` | The checker's tests, using Python's built-in `unittest`, written before the checker |
| `scripts/extract-pdf-text.swift` | The script that makes each PDF's text extraction, using macOS's PDFKit |

Sources stored before this epic stay where they are, because the corpus cites them by file and line. Paths in the
manifest, the rows and the state facts are relative to the repository root.

Dates of this corpus's own work, such as when a source was fetched, a row verified or a fact checked, are UTC dates
written YYYY-MM-DD, and times are UTC in ISO 8601 with a `Z`, such as `2026-10-17T03:10:00Z`, because the research
records give UTC times. A date a document gives itself, such as its publication, effective or meeting date, is the
calendar date it states, written YYYY-MM-DD and never moved between time zones. A file stored under `docs/domain/sources/` gets a
lowercase name joined by hyphens that says what it is. It keeps the publisher's document number as the publisher
writes it, and carries the version or date where the publisher serves more than one: `federal-register/C1-2026-11094.xml`,
`ecfr/2026-10-14/42-cfr-435.558.xml` for one section on one eCFR date, `cms/smd-26-001.pdf`. A web page's name ends
with the date it was fetched. A PDF's text extraction sits beside the PDF under the same name, with `.txt` in place of
`.pdf`.

In `open-questions.md` each question is a `###` heading in plain words, followed by a list: `- Who can answer:` CMS,
Colorado's HCPF or a policy person; `- Raised:` the date and the rows that depend on the answer; and `- Source:`
once for each source in conflict, in the form of a row's Source.

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

The checker reads a row this way:

- The extract opens with a `#` title and a short introduction, and prose is allowed only there, before the first `##`
  heading. Each topic is a `##` heading that holds only rows. This increment's is `## Notices of noncompliance and fair
  hearings`.
- An identifier is one or more words of lowercase letters and digits, joined by single hyphens.
- Each field is a list item, `- Name: value`. The required fields come in the order listed above, each once, except
  that Source may repeat; `Corrected:`, which may repeat, and `Note:` come last. A field name not listed fails.
- Verified is `no`, or a date, a comma and a method: `2026-10-17, read in source` or `2026-10-17, ledger L1-4`. A
  person who checked it follows as `, by <name>`.
- State election is `no`, or `yes; the state chooses <what>; where it has not chosen, <what applies>`.
- Corrected is a date, a colon, what the row said before, a semicolon, and why it changed.
- Recheck triggers are separated by semicolons. Each is one from the list, or `date YYYY-MM-DD`, and may add detail
  after a colon, as in `state rule: 10 CCR 2505-10 8.100 adopted`.
- A citation names a section by its number when it holds a section such as `435.558` or `8.057` (digits, a period,
  digits), or a number after `§`, `section`, `SSA` or `U.S.C.`. `91 FR 39030` alone names a page, so a regulation row
  citing only that fails. The tiers that need a section number are `statute`, `regulation`, `state statute` and
  `state regulation`. A citation of any tier fails when it is empty or holds the word TBD or TODO, in capitals or not.
- A Source is a path, a colon, a line number counted from 1, a space, and at least one character of quoted words in
  straight double quotes. The file is read as bytes and split on `\n` only, so line N is the line `grep -n` numbers N,
  and the quoted words, encoded as UTF-8, must occur within that line's bytes. The file must have a manifest entry, so
  a row cannot rest on an analysis file.
- A value that continues onto further lines is read with its lines joined by single spaces.

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

`MANIFEST.json` is a JSON object whose one key, `sources`, holds the entries, sorted by path. Every entry has these
keys, each a string unless it says otherwise:

- `path`, the stored file
- `sha256`, its SHA-256 in lowercase hex
- `kind`, `verbatim` or `derived`
- `cited_url`, the address a document in this repository gives for it, or `not recorded`
- `retrievals`, a list, oldest first, of the fetches that returned these exact bytes, each an object with
  `served_url`, the address that answered after any redirect; `command`, as run from the repository root, headers
  included; and `retrieved`, its time. Any of the three may say `not recorded`. A verbatim file's list holds at least
  one fetch, all three `not recorded` if nobody recorded it. A derived file's list may be empty.
- `superseded`, a list, empty unless something supersedes the file, of objects with `by`, the superseding file's
  path, and `scope`, what it is superseded for

A derived entry adds `derived_from`, the path or address it was made from, and `derivation`, the command that made
it, and either may say `not recorded`. For a PDF's extraction the derivation is
`swift scripts/extract-pdf-text.swift <pdf> > <txt>` run from the repository root, followed by the script's SHA-256
and the macOS and Swift versions it ran on. The extraction starts each page with a line `[[page N]]`, counting from 1.
An entry for eCFR text adds `ecfr_date`, whether the text is stored or derived, and the checker requires it for every
path under `docs/domain/sources/ecfr/`. Any entry may add `note`. The checker fails an entry that lacks a key, holds an empty
string or a `kind` outside the two, or repeats a path. These entries illustrate the shape and have not been checked
against the files:

```json
{"sources": [
  {"path": "docs/domain/sources/federal-register/C1-2026-11094.xml", "sha256": "<64 hex digits>",
   "kind": "verbatim", "cited_url": "<the address research L1 gives>",
   "retrievals": [{"served_url": "<the XML address>", "command": "curl -sS -o <path> '<the XML address>'",
                   "retrieved": "2026-10-17T03:10:00Z"}],
   "superseded": []},
  {"path": "docs/domain/cms-2454-ifc/2026-11094.txt", "sha256": "<64 hex digits>", "kind": "derived",
   "cited_url": "not recorded", "retrievals": [],
   "superseded": [{"by": "docs/domain/sources/federal-register/C1-2026-11094.xml",
                   "scope": "42 CFR 435.557 and 435.558"}],
   "derived_from": "not recorded", "derivation": "not recorded"}
]}
```

Of the 29 files in `docs/domain/` outside `research/` when this epic began, 22 are stored sources and get entries and
`.gitattributes` lines. Three are verbatim: `cms-2454-ifc/2026-11094.xml`, which a re-fetch on 2026-10-16 matched
byte for byte, and the two PDFs in `blueprint-pdfs/`, taken as verbatim because nothing here reformats a PDF, though
where they came from was never recorded. Nineteen are derived: `cms-2454-ifc/2026-11094.txt` and `SECTION-INDEX.txt`,
the 15 files in `hr1/` other than `HR1-Impact-Summary.md`, and the two text files in `supporting-regs/`. The other
seven are the corpus's own files: six analysis files, namely `rule-extract.md`, `state-options.md` and
`what-matters-most.md` in `cms-2454-ifc/`, `hr1/HR1-Impact-Summary.md` and the two Code for America summaries; and
`supporting-regs/README.md`.

Re-fetching an older source means fetching the same document from its publisher. A verbatim source is re-fetched. A
derived copy is not, because how it was made was never recorded; its entry names what it came from where a record or
the file itself says so, and `not recorded` where nothing does. Increment 3 stores the origins of the `hr1/` and
`supporting-regs/` copies. When a fresh copy of a source that states no license differs from the stored one, as the
blueprint PDFs might, it is not stored: the old entry's `note` gives the address, the time and the fresh copy's hash,
and increment 3 decides whether copies stay at all.

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

Its shape is `{"state": ..., "name": ..., "facts": [...]}`. Its `state` is the file's name without `.json`, either
`federal` or a state's two-letter code in lowercase, such as `co`, and its `name` is the plain name, such as
`Colorado`. Every value is a string except `sources` and `facts`, which are lists. Each fact has `row`, `setting`,
`value`, `status`, `citation`, `sources` and `checked`, and a `note` as well when its status is `inferred` or
`not published`. A key whose value is empty, or an empty list, counts as missing. A fact marked `not published` has
the value `not published`. Each source has all four of its keys, its Source is checked as a row's is, and its tier is
one of the tiers above. A fact's citation is checked as a row's is, taking the tier of its first source. A source on
a state agency page or a secondary source whose date is `not stated` gets the same warning, because it too may predate
the rule.

### The skill

The skill restates rows briefly and holds no rule of its own. Each list item in it that states a rule ends with the
row's identifier in square brackets and the row's citation, and every number before the identifier appears in that
row's Rule.
It stays under 500 lines and about 5,000 tokens, as the [Agent Skills specification](https://agentskills.io/specification)
recommends. Its `name` matches its folder, and its description uses the words a person would use about the work, such
as Medicaid work requirements, letters, deadlines and exemptions, because the description decides whether the skill
loads at all.

Its frontmatter holds `name` and `description` between `---` lines, as the other skills here do. Rule items sit
under a `## Rules` heading, with a `###` heading for each topic, and every list item there is a rule item, so one
without an identifier fails. Its other sections in this increment are `## Precedence`, which says which source wins
when two disagree, and `## Watch list`, each item a date or an event and the rows it could change. A rule item may
continue on lines indented by two spaces, and is read with its lines joined by single spaces. It ends with the
identifier in square brackets, a space, and the row's Citation exactly as the row gives it:
`- ... beginning on the day they receive it. [notice-response-period] 42 CFR 435.558(a)(2); 91 FR 39030`. A number
is a run of digits, with any comma or decimal point inside it, so `30`, `8.8` and `1,000` are numbers. Each number in
a rule item before its identifier must equal a number in the row's Rule, whole against whole, so a `3` does not match
inside a `30`. Anywhere in the skill, a word in square brackets that has the shape of an identifier and is not
followed by `(` must name a row. Numbers written as words, and items outside `## Rules`, are left to review.

### The checker

`scripts/check-corpus.py` uses Python's standard library only and runs on Python 3.9 or later. Its tests come first:
`tests/test_check_corpus.py` holds, for each check below, a small fixture that passes and one that fails, and
`python3 -m unittest discover -s tests` runs them with nothing installed. The checker reads the extract,
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

It finds the repository root from its own path, so it runs from any working directory. It lists files with
`git ls-files -z --cached --others --exclude-standard`, which leaves out what git ignores, and asks
`git check-attr -z text` about each manifest path, which must answer `unset`. A missing extract, manifest,
`states/federal.json` or `states/co.json` fails. It keeps the list of the corpus's own files as one constant. In this
increment that is the extract, `open-questions.md`, every file in `states/`, `sources/MANIFEST.json`, any
`README.md`, and the six analysis files named under "Stored sources and the manifest".

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
