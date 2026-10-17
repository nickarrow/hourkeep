# Epic 0001 delivery plan: a policy corpus HourKeep can rely on

Status: Proposed, 2026-10-16. What the epic changes and why, and the formats every increment uses, are in `design.md`
beside this file.

- [ ] 1. One topic, all the way through
- [ ] 2. The federal rule, verified
- [ ] 3. The statute and the supporting rules
- [ ] 4. Federal and Colorado facts
- [ ] 5. The domain skill, complete

## Prerequisites

Checked 2026-10-16:

- The research this epic works from is committed in `docs/domain/research/`: the verification ledger and eight lane
  reports of 2026-10-16, and the SNAP report of 2026-10-15.
- eCFR's full-text API answers only compressed requests: at 19:54 UTC a request for § 435.558 got 406 without
  `curl --compressed` and 200 with it. Its `current` date alias returns 404, so take the latest date from
  `/api/versioner/v1/titles.json` first.
- The Federal Register API answered a plain request at 20:22 UTC, and so did the Colorado Secretary of State's rules
  site. That site serves § 8.057 only inside the 135-page PDF of 10 CCR 2505-10 8.000, at an address tied to one
  version of the rule; its rule-information page shows which version is current and when it took effect.
- medicaid.gov answered a plain request for SMD 26-001 with 200 at 19:54 UTC, and refused one with browser-style
  headers with 403; earlier that day the research saw the reverse. cms.gov answered both. hcpf.colorado.gov refused a
  plain request with 403 at 20:22 UTC and answered a browser User-Agent; its appeals page now redirects to
  healthfirstcolorado.gov, which answers plain requests. Google Drive, where HCPF posted the draft § 8.100, serves the
  file itself through its download link (`drive.google.com/uc?export=download&id=...`) and only a viewer page through
  the link the research cites. These sites change their minds, so record the command that worked, and when, for each
  source stored.
- Python: `python3` on the path is 3.14.6, and `/usr/bin/python3` is 3.9.6. The checker uses only the standard library
  and runs on either. Neither reads YAML without a package.
- PDF text: `pdftotext`, `mutool`, `qpdf` and Ghostscript are not installed. A short Swift script using macOS's PDFKit
  extracted all 14 pages of SMD 26-001 as text in under 2 seconds, and in the dry run each extraction ran twice to
  identical bytes. It separates some paragraph labels from their text.
- The Playwright browser tool disconnected on 2026-10-16. Nothing here needs a browser.

## Standing constraints

- Sources go in verbatim, under `docs/domain/sources/`, each with a manifest entry. A derived copy is listed as derived.
- Every row has every field the epic design lists. A row not yet verified says `Verified: no`, and the checker counts
  it.
- When a topic lands, each older analysis file's passage on that topic becomes a pointer to the new rows, with the
  research's corrections to that passage applied in the same change. A passage becomes a pointer only once every claim
  in it has a row. A claim no row covers yet, or a passage that also covers topics still to come, is corrected in place.
- When a claim is corrected, search `docs/domain/` outside the stored sources and the research records, and the skill,
  for every copy of it in the same change.
- The research cites lines in `docs/domain/` as they stood on 2026-10-16, and pointers shift the lines below them. Find
  a cited line in the file as committed at 70be85f (`git show 70be85f:<path>`) before looking for it today.
- Corrections to dated claims are recorded with their date. Nothing is rewritten to look as if it was always right.
- No app code. American English. The house style in `AGENTS.md`.
- Each increment changes what HourKeep will say, so each gets the full review: a reviewer against the sources, one
  against the mechanism, a cold reader, a red team, and one who carries out the instructions.

## 1. One topic, all the way through

### Delivers

The formats in the epic design, proved on one topic: notices of noncompliance and fair hearings. The topic covers
42 CFR 435.558 in full; 42 CFR 431.206, 431.210, 431.211, 431.220, 431.221, 431.230 and 431.231; and the two transition
paths in CMS's letter SMD 26-001, because they decide whether a person's first review, and so a first notice, can come
in January 2027. Two choices in this topic share names, so the rows name each by what it does. In § 435.558(b)(2) a
state sends the notice of noncompliance with the renewal form or after the form's period, which the rule's preamble
calls Option 1 and Option 2. SMD 26-001 calls its own transition paths options 1 and 2 as well. Paragraph (b)(3) sets a
separate choice for more frequent checks: a notice straight after the data check, or one after a request for
information. Specifically:

- Stored, each with a manifest entry: the June 29 correction as Federal Register XML; eCFR XML of § 435.558 and of the
  seven part 431 sections, all for one stated eCFR date; SMD 26-001 with its text extraction; and for Colorado, the
  PDF of 10 CCR 2505-10 8.000 that holds § 8.057, with the rule-information page that shows it in force; the draft
  § 8.100, whose § 8.100.4.G.4.h sets the renewal-packet timing, from Drive's download link (research L5, section 1,
  gives the file); and HCPF's appeals page, at the address it now redirects to.
- The manifest, with an entry for every source already in `docs/domain/` as well, re-fetched where possible and marked
  `not recorded` for anything never recorded. A `.gitattributes` marking every stored source `-text`.
- `scripts/extract-pdf-text.swift`, the script that made the extractions.
- The extract, holding this topic's rows.
- `states/federal.json` and `states/co.json` with this topic's facts. For the federal default: 30 days from receipt,
  receipt presumed 5 days after the date on the notice, at least 10 days' notice before an action, and a hearing request
  window of at most 90 days from the date the notice of action is mailed. For Colorado: 60 days from the date on the
  Notice of Action to ask for a hearing, cited to 10 CCR 2505-10 § 8.057.4.B.1 at the state regulation tier once this
  increment confirms that paragraph is in force, with HCPF's page as a second source; coverage that continues when the
  hearing request arrives within 10 days after the date of action, cited to the state rule if it says so (the dry run
  found § 8.057.5.D) and otherwise to HCPF's page; and the renewal-packet timing, marked `inferred`, because the draft
  rule names neither § 435.558(b)(2) choice and the research mapped it to sending the notice with the renewal form
  (research L5-3).
- The skill, holding only this topic's rows, its precedence rules and the start of the watch list.
- The checker, as the epic design describes it, and `tests/test_check_corpus.py`, written first.
- The placeholder page, `public/index.html`, which is live and tells people about notices and fair hearings today,
  checked against the new rows, with any difference corrected.
- The pointers and corrections the standing constraints call for. Section 8 of `rule-extract.md` and section 9 of
  `what-matters-most.md` become pointers once every claim in them has a row; a claim this topic's rows do not cover,
  such as a cross-reference to another section, stays in place, corrected. `rule-extract.md` lines 5 to 7 and 12 get the
  correction's real scope (research L1-4, L1-5), and `supporting-regs/README.md` lines 14 to 17 say the correction
  governs §§ 435.557 and 435.558. Passages that hold other topics too are corrected in place: `state-options.md` lines
  122 and 124, comments in its schema block (L1-6); `state-options.md` line 237, whose default of sending the notice
  after the form's period is wrong for Nebraska and for Colorado's draft (L4-5, L5-3); and `what-matters-most.md` lines
  710 and 711, which put many first reviews in mid-2027 where a state taking SMD 26-001's first path can begin them in
  January 2027 (L2-4).

### Deliberately not

The other topics, including the general rules on notices: what a decision notice must say (§ 435.917), plain language
and access for people with limited English or a disability (§ 435.905(b)), and electronic notices (§ 435.918), which
increment 3 takes with the other letters a person may hold. No file is retired yet.

### Why this shape

Every later increment fills the same structure. Proving the row format, the stored sources, the facts files, the skill
and the checker on one topic first means a flaw in any of them costs one topic to fix. Notices come first because the
design builds the app around the letter. The topic also needs every kind of source the corpus will hold, from Federal
Register XML to a state PDF and a web page, so the formats meet all of them at once.

### How you know it worked

- `python3 -m unittest discover -s tests` passes under both Pythons, with a passing and a failing fixture for every
  check the epic design lists.
- `python3 scripts/check-corpus.py` and `/usr/bin/python3 scripts/check-corpus.py` both exit 0 and print how many
  rows were checked, how many of them say `Verified: no`, and how many sources, state facts and skill items. Then, one
  break at a time and restored after each, both exit non-zero and name the problem: a row's citation deleted, a
  citation changed to TBD, a source's quoted words changed, a row citing an analysis file instead of a stored source, a
  byte appended to a stored source, the manifest entry for an older source removed, a Colorado fact's source emptied,
  a row identifier in the skill misspelled, and a number changed in a skill item.
- The Done entry lists each claim in the two passages that became pointers, with the row that now carries it, or says
  where it stayed.
- A fresh agent session is asked: "My Medicaid letter says the state can't confirm I met the work requirement. What
  does that letter have to tell me?" It runs once the skill is in `.kiro/skills/`, as a one-step workflow whose whole
  prompt is the question, or as a new Kiro chat if a workflow cannot do it. Nobody tells it which skill to load. This is
  the one hand-off that deliberately leaves the skill unnamed, because loading it unasked is what is being tested. Its
  answer covers all seven things § 435.558(c)(1) requires, hardship exceptions included where the state offers them,
  cites the rows by identifier, and says which skills it loaded. `what-matters-most.md` used to leave hardship out
  (research L8-8). If the skill did not load, the session runs again with the skill named, and the miss is recorded for
  increment 5, whose test depends on unprompted loading.

### Needs from you

Nothing, unless a state site refuses automated requests, in which case a copy you download in a browser, or a workflow
cannot run the fresh-session test, in which case you ask the question in a new Kiro chat.

## 2. The federal rule, verified

### Delivers

All of 42 CFR 435.550 to 435.563 as rows, outreach under § 435.561 included, with SSA 1902(e)(14)(L) and SMD 26-001
for six-month renewals. Every correction the ledger confirmed for `rule-extract.md` and `what-matters-most.md` is
applied as its passage becomes a pointer, each dated. `what-matters-most.md`'s priorities and its checklist of common
errors move into the extract and the skill, and the file is retired.

One decision record sets out the whole restructure: what is retired, what moves, where each part goes, and which
increment does it. Increments 3 and 4 carry it out and record each step in their Done entries, so the record never
needs editing.

### Deliberately not

State values, the statute extract, and SNAP. The sections of `rule-extract.md` on state options, the implementation
landscape and open questions, which wait for increment 4.

### Why this shape

The federal rule is the floor every state builds on, and most of the dangerous errors the research found sit in it.

### How you know it worked

The checker passes with every section from 435.550 to 435.563 represented. Each ledger finding against these two files
appears once in the Done entry as applied or rejected, with a reason for each rejection. A search of `docs/domain/`
outside the stored sources and the research records for the old wording of each correction finds it only in the dated
corrections that record it.

### Needs from you

Approval of the decision record, which covers the retirements and moves in increments 2 to 4.

## 3. The statute and the supporting rules

### Delivers

- A short statute extract: Public Law 119-21 sections 71119 and 71107, and section 10102 for the SNAP questions.
- 7 CFR 273.7 and 273.24 stored, so the SNAP questions rest on stored text.
- The rules for the other letters a person may hold: renewal forms (§ 435.916), what a decision notice must say
  (§ 435.917), plain language and access for people with limited English or a disability (§ 435.905(b)), and
  electronic notices (§ 435.918).
- `supporting-regs/README.md` without its v1 notes and with a fresh eCFR snapshot.
- The two Code for America summaries moved to `docs/domain/prior-art/` with a note that they predate the rule, and each
  error already found in them given a dated correction. The Medicaid summary's line 68 says "meeting" SNAP rules where
  the test is being subject to them; the SNAP summary's line 51 says "18 or younger" where the statute says under 18;
  and the ledger finds six more lines in the Medicaid summary that conflict with the rule or the statute (research
  L8-10, L3-12).
- `hr1/HR1-Impact-Summary.md` retired.
- GovInfo's text of Public Law 119-21 stored as served, the statute extract made from it, and the other 15 files in
  `hr1/` retired: 14 reformatted copies of the law and a list of its sections that touch HHS. The two eCFR text files
  in `supporting-regs/` retired once the fresh snapshot is stored as eCFR XML and nothing cites them.
- The two Code for America blueprint PDFs replaced by links in the prior-art note, unless Code for America's terms
  allow keeping copies. Neither PDF states a license.
- The lines that point at v1's files fixed. Decision record 0001 counted 32 on 2026-10-16; the pattern check below is
  the measure.

### Deliberately not

New SNAP rules, and extracts of the parts of Public Law 119-21 that HourKeep does not rely on.

### Why this shape

It removes the secondary sources that carried the oldest errors, once the extract no longer needs them.

### How you know it worked

The checker passes. No file in `docs/domain/` outside the stored sources and the research records names a v1 decision
record, wave, steering file or `src/` path. Each retired or moved file appears in the Done entry with where its content
went, against the decision record.

### Needs from you

Nothing beyond the decision record approved in increment 2, unless Code for America's terms are unclear, in which case
whether to keep the blueprint PDFs.

## 4. Federal and Colorado facts

### Delivers

The state facts files complete for the federal default, and for everything Colorado has published, with each gap marked
`not published`: look-back months at application and renewal, hardship exceptions, income-to-hours, how medically frail
status is shown and when documentation starts, how the 30 days are counted, submission channels, the appeal window,
and the start date. Colorado's facts come from its draft rule (10 CCR 2505-10 § 8.100), HCPF's pages and its English
and Spanish letter templates, each stored with its retrieval date.

`state-options.md`'s tracker moves into the facts files, the values the research checked for other states labeled as
checked once on 2026-10-16 and not maintained, and the file is retired. The last sections of `rule-extract.md` become
pointers, and that file is retired too. The open policy questions go into `docs/domain/open-questions.md`, each with who
can answer it.

### Deliberately not

Maintaining any state other than Colorado.

### Why this shape

The design phases states in, starting with Colorado. Colorado's rule is a draft due before its Medical Services Board on
November 27, 2026, and the research found its hardship and seasonal-income positions still open (research L5,
findings 10 and 11), so its facts need a recheck date in the watch list, and some will be `not published`.

### How you know it worked

The checker passes, and every Colorado fact shows its source, its retrieval date, and whether it comes from the draft
rule. The checker's list of the corpus's own files names no retired file, and every file left in `docs/domain/` is a
stored source in the manifest, the extract, a state facts file, the open questions, the § 435.603 extract, a research
record or prior art marked as predating the rule.

### Needs from you

Whether to keep the other states' checked-once values in the facts files, as proposed, or leave them in the research
records.

## 5. The domain skill, complete

### Delivers

The skill with all its rows, the number labels, CMS's vocabulary in English and Spanish, with the Spanish renderings
the research found wrong (research L5-19), the error checklist and a dated watch list: the
Massachusetts v. Oz hearing on October 22, 2026, Taylor v. Kennedy, the IRS proposed rule open for comment until
November 30, 2026, Colorado's rule, SNAP's pending rule, and the next eCFR check.

### Deliberately not

App code, and any change to `AGENTS.md`'s four rules, which the skill may sharpen and may not loosen.

### Why this shape

The skill is what every later session reads, so it comes last, from a corpus that is already checked.

### How you know it worked

A fresh session given five questions from the error checklist loads the skill without being told to, as in increment
1, and answers each with the right citation and the row's identifier. The questions are written before the session
runs.

### Needs from you

Nothing.
