# 0006. Split the federal rule into eight topics, and restructure the corpus around them

Date: 2026-10-22

Status: Accepted on 2026-10-23, decided by the owner; superseded in part by 0007, for the litigation check

## Context

The epic design, `docs/epics/0001-policy-corpus/design.md`, says under "What it changes" that one decision record sets
out the whole restructure of `docs/domain/`, and increment 2 of the delivery plan calls for the same decision record. On
2026-10-22 the owner split increment 2, "The federal rule, verified", into one increment per topic of 42 CFR 435.550 to
435.563, each reviewed and published on its own, because increment 1's one topic came to 64 rows. His note under
increment 2 leaves the topics and their order to this record, and moves the state's part of each open question that
waits on an unpublished state choice into the state facts. Decision record 0004's "Four topics remain" was written
before the split, and this record supersedes nothing.

The interim final rule's 14 sections are in the June 3 printing, `docs/domain/cms-2454-ifc/2026-11094.xml`; for
§§ 435.557 and 435.558 the June 29 correction, `docs/domain/sources/federal-register/C1-2026-11094.xml`, governs.
Increment 1 wrote rows for every paragraph of § 435.558, and the other 13 sections have none. By a count on 2026-10-22,
§ 435.558 runs to 1,349 words in the correction and gave 34 rows, about 40 words a row with the preamble rows included.

## Decision

### The topics

Eight topics, delivered as increments 2.1 to 2.8. Each has one title, used as its `##` heading in the extract, the first
line `# <title>` of its topic file, its link under `## Topics` in `SKILL.md`, and its review page's title, which the
generator takes from the topic file (`read_topic` in `scripts/review_pages/corpus.py`). The topic file
`.kiro/skills/medicaid-community-engagement/references/<name>.md` gives the review page `docs/review/<name>.md` and the
key `<name>` in `START_HERE` (`scripts/review_pages/constants.py`). Nothing checks today that the extract's heading, the
topic file's first line and the link agree, so increment 2.1's checker adds a check that each topic file's title is the
`##` heading of one topic in the extract.

A paragraph named below takes its own text with it, the words before its first subparagraph included, and a section's
unlabeled opening paragraph is named where it has one.

- Increment 2.1, "Who the requirement applies to, and who is excluded from it", `who-the-requirement-applies-to`.
  § 435.550; § 435.551, its opening paragraph and (a) and (b); § 435.554(a), (b), and (c) less (c)(5); § 435.563(a) and
  (b); § 435.119(d) as the rule adds it; and 28 CFR 35.108 and 42 CFR 447.51 where § 435.554(a) and (c)(2) incorporate
  them. 1,221 words, about 31 rows.
- Increment 2.2, "People who are medically frail or have special medical needs",
  `medically-frail-or-special-medical-needs`. § 435.554(c)(5); § 435.557(f). 919 words, about 23 rows.
- Increment 2.3, "Exceptions for a month: mandatory exceptions, and optional short-term hardship exceptions",
  `mandatory-exceptions-and-short-term-hardship`. § 435.553, its opening paragraph and (a) and (b); § 435.555(a) to (f);
  § 435.557(g). 1,623 words, about 41 rows.
- Increment 2.4, "Work, community service, work programs and school", `work-service-programs-and-school`. § 435.552(a)
  less (a)(6) and (a)(7), (b), (c), (d), and (e) less (e)(2). 1,036 words, about 26 rows.
- Increment 2.5, "Monthly income, income counted as work hours, and seasonal workers", `income-and-seasonal-work`.
  § 435.552(a)(6), (a)(7), (e)(2), (f) and (g); § 435.603(d), (e), (f), (h)(3) and (j)(1), where § 435.552(f)(2) and (g)
  incorporate them; and 26 U.S.C. 36B(d)(2)(B), 85, 6012(a)(1) and 45R(d)(5)(B), 29 U.S.C. 206(a)(1)(C) and 29 CFR
  500.20(s)(1). 439 words of § 435.552, about 11 rows, and about 16 more on the other provisions.
- Increment 2.6, "How the state verifies: reliable information first, then what a person sends",
  `how-the-state-verifies`. § 435.557(a), (b), (c) and (e); § 435.945(j) as the rule amends it; § 438.58(b). Its topic
  file opens by naming where § 435.557(d), (f) and (g) are. 1,679 words, about 42 rows.
- Increment 2.7, "Which months are checked, how often, and when the requirement starts",
  `which-months-and-when-it-starts`. § 435.556(a) to (d); § 435.557(d); § 435.559(a) to (c); § 435.560(a) to (d); SSA
  1902(e)(14)(L)(i); § 435.915 as the preamble applies it; and the parts of SMD 26-001 that increment 1's four rows on
  it do not cover, on pages 3 to 13, which the delivery plan lists. Its pages on IT system costs (p. 13) and its closing
  (p. 14) state no rule a person meets and get no rows. It stores GovInfo's text of Public Law 119-21, as served, cites
  it from its rows on SSA 1902(e)(14)(L)(i), and repoints increment 1's row on clause (ii) to it. 1,435 words before the
  statute and SMD 26-001, about 36 rows.
- Increment 2.8, "Outreach, and what states report to CMS", `outreach-and-state-reporting`. § 435.561(a) to (e);
  § 435.562(a) to (e). 1,170 words, about 29 rows.

The words are the regulation text of §§ 435.550 to 435.563 only, with the XML markup removed, from the June 3 printing
but for § 435.557, which comes from the correction. Each section's heading is counted once, in a topic that holds the
section, and the 14 words of § 435.557's heading are in increment 2.6. § 435.552 was divided at its paragraph labels,
each paragraph's own text counted in the topic that holds it. The eight figures sum to 9,522, the words of the 13
sections, computed on 2026-10-22. Provisions outside those sections, such as § 435.119(d), the amendment to § 435.945(j)
and § 438.58(b), are in no figure. The rows are the words divided by 40, and they are inferences: the ratio carries
§ 435.558's share of preamble rows but no rows on provisions outside the rule, so increments 2.5 and 2.7 will come in
above their figures. Increment 2.5's 16 counts what `what-matters-most.md` section 6 cites, 10 paragraphs of § 435.603
and 6 provisions outside part 435, on 2026-10-22. If a topic's rows would pass 64, a new decision record splits it.

A topic stores any provision outside the rule that its rows rest on, as served: eCFR XML for one stated date for a
regulation, and the text its publisher serves for a statute. A row that cross-refers to a provision not stored says so
in its Note, as increment 1's rows do.

Each topic's start-here rows are picked as its rows are written, at most 20, as increment 1 has, from the rows that
carry its entries in `what-matters-most.md` section 12 and the dangerous ledger findings it covers, and its increment
adds them to `START_HERE` under its key. An inherited row stays in its own topic file, so it cannot be a start-here row
of a new topic: the generator refuses one that is not in the topic file under its key (`topic_page` in
`scripts/review_pages/pages.py`).

The order follows HourKeep's screens, and within them what each topic needs from the ones before it. Who the requirement
applies to comes first: every other section uses the terms applicable individual and specified excluded individual, and
`docs/design.md`, under "What may mean the rule does not apply", leads with it. Medical frailty is split out of
§ 435.554 because § 435.557(f) verifies the status § 435.554(c)(5) defines, and because Massachusetts v. Oz challenges
those rules, so a ruling reaches one topic. The exceptions follow with § 435.557(g), which verifies them, completing the
screen of exclusions and exceptions. Then what counts: the activities, and household income, which `docs/design.md`
under "Proof, month by month" names as one of the two Deferred cases that matter most, split because income rests on
§ 435.603 and six provisions outside part 435 and carries 8 of the checklist's 28 errors. Verification checks everything
defined before it. Increment 2.7 takes § 435.557(d)'s checks between renewals and the rest of six-month renewals, since
§ 435.559(c) ties an enrollee's first check to their first renewal on or after the state's implementation date. Outreach
comes last: an outreach letter starts no clock (`docs/design.md`, "The letter"), and § 435.561(c) has the notice explain
what the earlier topics define. The ledger's dangerous findings spread across six of the eight topics, so the order does
not rest on them.

Two references run forward. Increments 2.2 and 2.3 use "reliable information available to the State" and "period of
enrollment", which § 435.557(a) defines, and § 435.557(g)(1) in increment 2.3 applies § 435.557(b)(2) and (b)(4), all in
increment 2.6. A row that relies on one quotes the later paragraph's words from the stored correction in its Note and
names the paragraph, so it can be reviewed on its own. Increment 2.6 compares each such row of increments 2.2 and 2.3
with its own rows, and any that says something different gets a dated correction in the same change.

Before the rows for § 435.554 and § 435.557(f) are written, the docket in Massachusetts v. Oz, D. Mass. 1:26-cv-12962,
is checked for whether the summary judgment hearing set for 2026-10-22 was held and what followed. That check gates
increments 2.1 and 2.2. It runs at the start of each, and each result goes in that increment's Done entry and the
skill's watch list. If the docket shows an order on the provisions the case challenges, row work on those provisions
stops until the owner decides how to go on. If it shows none, the work goes on, and the Done entry records the query,
its date and that RECAP, which the research searched, can lag
(`docs/domain/research/2026-10-16-policy/L3-statute-litigation.md:206`).

### Numbering

The topics are increments 2.1 to 2.8, each with its own checkbox in the plan's checklist, and increment 2 keeps none of
its own. Increments 3, 4 and 5 keep their numbers, and "increment 2" in older text means increments 2.1 to 2.8 together.
In prose a topic is always written "increment 2.6", never a bare "2.6", because `rule-extract.md` numbers its own
subsections 2.1 to 2.7 and 4.1 to 7.9; the plan's checklist and headings use the number alone. On 2026-10-22,
`git grep -n -i -P 'increments? [2-5](?![0-9])' -- . ':!docs/domain/research'` found 26 references to increments 2 to 5:
5 in the extract's row Notes and 3 in the epic design, all to increment 3; 14 in the delivery plan; and 4 in decision
record 0004. Each still names the work it named. That pattern also matches "increment 2.1"; a search to rerun once the
plan names the topics uses `increments? [2-5](?![0-9]|\.[0-9])`.

### What increment 1 already covers

No topic writes rows for what increment 1 covers: 42 CFR 435.558 in every paragraph from (a)(1) to (f); 42 CFR 431.206,
431.210, 431.211, 431.220, 431.221, 431.230 and 431.231, (d) included; § 435.916(a)(3)(iii); SSA 1902(e)(14)(L)(ii); and
SMD 26-001's two transition paths, its limit on the first path and its notice when a period is shortened. No Citation
names another section from 435.550 to 435.563, but on 2026-10-22, 11 rows named one in their Rule, State election or
Note. A row that names a section without a paragraph is inherited by every topic that holds part of that section; the
delivery plan lists what each inherits. An inherited row stays in its topic file and on its review page, so its anchor
keeps working. Where a new row shows that an inherited one says more or less than its source, the inherited row gets a
dated `Corrected:` in the same change.

### State choices that are not published

Where Colorado has not published a choice the federal rule leaves to it, a person or a reviewer reading the review pages
finds it among the state facts, marked "not published" with the federal paragraph that gives the choice, and the open
questions page no longer asks it as a question about Colorado.

A state file holds at most one fact per row. A choice between two rows is one fact, on the first row of the pair in the
extract's order whatever the state chooses, so its name `<state>: <row>` never moves. On 2026-10-22 the pairs are
renewal-notice-with-renewal-form with renewal-notice-after-renewal-form-period;
more-frequent-check-notice-after-data-check with more-frequent-check-notice-after-information-request; and
reschedule-2027-renewals-to-six-months with keep-scheduled-2027-renewals. A later topic that writes such a choice adds
its pair. A fact on the first row of a pair holds a key, `choice`, and no other fact does. Its value is one of the
pair's two identifiers, `not published`, or `not applicable` where the state's source says it makes neither choice, such
as a state that never checks between renewals. The fact's `value` is the state's source's words or `not published`, as
now. Three keys may be written `not published`: `value`, `choice` and `counts_from`, the last for a part of a known or
inferred fact that no source publishes. Each so written needs the note to say where and when the search ran.

A fact marked `not published` still needs a citation and a source. Its citation is the federal paragraph that gives the
choice, and its sources quote the stored federal lines that set the choice out: 42 CFR 435.558(b)(2) or (b)(3) from the
correction, or CMS SMD 26-001, pp. 7 to 8, from the stored letter. Its note names each Colorado source searched, the
words searched for and the date.

On 2026-10-22, four open questions gave "it turns on a choice the state has not published" as a reason:

- "Which renewal option applies where a state's plan records no choice?" stays, as a federal question. Why it is open
  keeps "the sources are silent", and Who can answer becomes `CMS`. Colorado's part is its fact on
  renewal-notice-with-renewal-form, which gains `choice` `renewal-notice-with-renewal-form`, the row its note infers
  Colorado's draft 10 CCR 2505-10 8.100 takes. The fact records what the draft does. Because the skill's Precedence
  holds that a state's draft rule chooses nothing until it is adopted, the fact stays `inferred`, and its `setting`
  already says the draft is not adopted.
- "Which option applies to checks between renewals where a state's plan records no choice?" stays the same way.
  Colorado's part becomes a new fact on more-frequent-check-notice-after-data-check, `not published` unless a stored
  Colorado source says whether and how Colorado checks between renewals.
- "Which SMD 26-001 transition path did Colorado take for renewals already scheduled in 2027?" is wholly a state's part.
  It moves to a new fact on reschedule-2027-renewals-to-six-months, `not published`.
- "What do the at least 30 days in Colorado's draft renewal paragraph count from, ...?" stays, for whether aligning the
  form's due date with the renewal's fits the preamble's 30 days that cannot be extended. Why it is open keeps "the
  sources are silent", and Who can answer becomes `CMS, or Colorado's HCPF for how its draft is meant to work`. What the
  30 days count from becomes the `counts_from` of Colorado's fact on renewal-notice-with-renewal-form, written
  `not published`.

A question that stays keeps its title, and so its anchor and the name it is commented under, though the fourth's title
still names the part that moved. The review page shows Why it is open and not the Note (`question_section` in
`scripts/review_pages/pages.py`), so in each of the three the last sentence of Why it is open names where the part went:
`Colorado's part moved on YYYY-MM-DD to the state fact co: <row>.` In the fourth, the sentence before it says the
question keeps whether aligning the form's due date with the renewal's fits the preamble's 30 days, and no longer asks
what the 30 days count from. Each one's Raised line is history and stays, and its Note gets the Formats' dated
correction, quoting the old Why it is open and Who can answer, with `decision record 0006` where a finding ID would go.

A question that moves keeps its `###` heading and, in place of its fields, holds one:
`- Moved: YYYY-MM-DD, to the state fact co: <row>.` The open questions page shows moved questions last, under the
heading "Moved to the state facts", each under its old title, so a comment filed under the old name can still be
matched, with the fact's name and three comment links that carry the fact's name. There, and in Why it is open, the
fact's name is text and not a link. The fact that takes a question's part names the question by its title in its note
and keeps its Raised date.

The reason "it turns on a choice the state has not published" stays in the vocabulary, for a question whose state part
has no row yet; that part moves into the state facts when the row is written. Until then no question gives it, so the
open questions page's group "Waiting on a choice a state has not published" drops out, with its anchor.

Increment 2.1 makes these changes, in the Formats, the checker, the generator, the corpus prose, the tests and the data,
before it writes its rows, with a passing and a failing fixture for each new check as the Formats require. The delivery
plan lists each change.

### The restructure

A passage becomes a pointer in the increment that writes the last row its claims need, and is corrected in place until
then; a section whose subsections land apart has each pointed as it lands. A file is retired once every passage in it is
a pointer. At retirement, a claim outside the epic's scope, about a state other than Colorado or about how to word
HourKeep's copy, is dropped, and the Done entry says where it is kept: the ledger finding that checked it,
`docs/design.md`, or git history. The delivery plan names, section by section, the increment that points each passage.
Each file goes this way:

- `rule-extract.md`, retired in increment 4. Each subsection is pointed by the topic that writes its rows, and sections
  10 to 12, on state-configurable parameters, the implementation landscape and open questions to track, in increment 4.
  Its terminology note goes to the skill's vocabulary in increment 5.
- `what-matters-most.md`, retired in increment 2.8. Its priorities become each topic's start-here rows and the order of
  the groups in its topic file. Each of the 28 entries of its section 12, "The things most often gotten wrong", becomes
  a row or part of one, with the error quoted in the row's Note. Increment 5's error checklist is then a list in the
  skill naming each error this corpus has made and the row that corrects it, drawn from the rows' Notes and from errors
  found after 2026-10-16.
- `state-options.md`, retired in increment 4. Colorado's tracker values go to `co.json`, its federal default profile to
  `federal.json`, and other states' values to no state file, as decided below. "Open data gaps" goes to
  `open-questions.md` where it asks about the federal rule or Colorado, and is dropped otherwise. The schema stays in
  history on `experiment-1`, and "Why this exists" and "How to add a State" go, since the Formats' "State facts" says
  how a state is added.
- `hr1/HR1-Impact-Summary.md`, retired in increment 3. The statute sections HourKeep relies on become statute rows
  there, under a topic of their own, citing the GovInfo text that increment 2.7 stores.
- The two Code for America summaries, `medicaid-work-requirements-cfa-service-blueprint.md` and
  `snap-work-requirements-cfa-service-blueprint.md`, moved in increment 3 from `docs/domain/` to
  `docs/domain/prior-art/`, with their remaining ledger corrections dated there.
- The 15 other files in `hr1/`, 14 copies of Public Law 119-21 and the list of its HHS sections, retired in increment 3
  once it has pointed every Source that still cites `hr1/` at GovInfo's text, which increment 2.7 stores.
- `supporting-regs/42cfr-supporting-sections.txt` and `other-supporting-sections.txt`, retired in increment 3 once eCFR
  XML of their sections is stored and nothing cites them. A topic that needs one of their sections earlier stores it
  itself: increment 2.1 stores 42 CFR 435.119, 28 CFR 35.108 and 42 CFR 447.51, and increment 2.5 stores 42 CFR 435.603.
- `supporting-regs/README.md`, kept as the § 435.603 extract the epic design keeps, read here as keeping precedence on
  income over the other analysis files; where it and the stored eCFR text differ, the stored text governs. The plan
  places its other sections in increments 2.1, 2.5, 3 and 4.
- The two blueprint PDFs, which give way in increment 3 to links in the prior-art note unless Code for America's terms
  allow keeping copies.
- HCPF's board deck of 2026-09-28, stored in increment 4 under `docs/domain/sources/colorado/` with its text extraction.
- `cms-2454-ifc/2026-11094.xml`, `2026-11094.txt` and `SECTION-INDEX.txt`, kept as stored sources.

Each stored copy that is retired loses its entry in `docs/domain/sources/MANIFEST.json` and its line in `.gitattributes`
in the same change, and nothing may cite it after. The checker's list of the corpus's own files, `OWN_FILES` in
`scripts/corpus_check/constants.py`, shrinks in the change that retires or moves each file, with the list in
`tests/test_unlisted_files.py` and the list under "The checker" in the Formats, so a retired file left behind fails as
unlisted. The same change corrects the names and the counts of the corpus's own files under "Stored sources and the
manifest" in the Formats, which on 2026-10-22 say "seven" and "six analysis files".

Of the June 3 printing's 22 amendment instructions, 5 revise authority citations, 1 adds §§ 435.550 to 435.563 and 16
change other sections. § 435.119(d) goes to increment 2.1, and §§ 435.945(j) and 438.58(b) to increment 2.6.
§ 431.231(d) is a row already. § 431.213(d) goes to increment 3 with §§ 431.213 and 431.214, and so do §§ 435.907,
435.911, 435.912 and 435.916, the removal of § 435.919, and § 435.1200(e)(1), with the other letters and renewals, since
increment 1's rows lean on §§ 435.907(a), 435.911, 435.912(e)(3) and 435.1200(e). Out of scope: § 435.3, whose new entry
adds SSA 1902(xx) to part 435's statutory bases and states no rule; § 438.58(a), on conflicts of interest in contracting
generally; and §§ 457.340(d), 457.344, 457.960 and 600.320(b), which are CHIP and the Basic Health Program.

### Other states' values

Decided by the owner on 2026-10-22: the values the research checked once for states other than Colorado are not moved
into the state facts files. They leave the corpus's own files with `state-options.md` in increment 4 and stay in the
dated research records under `docs/domain/research/`, the ledger and the lane reports, and increment 4's Done entry
names, state by state, the ledger findings that checked each. The reason is maintenance. A state fact's Source must be a
stored file the manifest lists (`fact_source_problems` in `scripts/corpus_check/states.py`), so keeping these values
would mean storing each state's sources, and increment 4 maintains no state but Colorado. A value the epic will not
recheck would also look as current as Colorado's. This answers the question under increment 4's "Needs from you".

### The corrections

The corrections are the items under "Proposed changes to docs/domain, by file" in the research ledger, with the Ledger A
and B rows each names, each found first in its file as it stood at 70be85f, the commit the research read. Where an older
file disagrees with the ledger or a row, the ledger and the skill's Precedence govern.

A confirmed correction waits for the topic whose rows cover its claim, with two exceptions, which cannot wait. One is a
correction the ledger rates dangerous, about another state included, since a person could act on the old words before
the topic or the retirement lands. The other is a claim about an event or a publication that no topic covers, such as
the date of the Massachusetts v. Oz hearing. Those are applied in place, dated with the finding ID, in every file that
carries the claim, by a fix on its own branch right after this record is accepted and before increment 2.1 starts. The
fix is reviewed as a fix, by one reviewer against the ledger and a do-it reviewer, and section 2 of the delivery plan
lists what it applies. A correction about another state that is not dangerous is not applied, and the claim goes when
increment 4 retires its file.

Each correction is applied once. The delivery plan places it in the fix or in one increment, splitting a finding that
names several claims by claim, and the fix's record or that increment's Done entry lists it, applied or rejected with a
reason. A topic whose rows later carry a subject the fix corrected records that as coverage, and does not apply the
finding a second time. A passage the fix corrected still becomes a pointer when its topic lands, and its topic corrects
it again only if the rows say otherwise.

### What the delivery plan carries

The plan holds the lists that carry this record out, increment by increment: the corrections the fix applies, the
passages each topic points or corrects, the findings it applies, the rows it inherits, the sources it stores, and the
exact changes increment 2.1 makes for state choices that are not published. The owner decided on 2026-10-22 that they go
there. They are ordering, and they are the part most likely to shift as topics land, so they sit where a dated change
can be made. A change to them that would break one of the rules set here needs a new decision record.

## Consequences

Eight review pages are added, each with its own start-here rows, and the landing page lists them. The skill gains eight
topic files, and `SKILL.md` an item under `## Topics` and words in its description for each. The description was 548
characters on 2026-10-22, and increment 2.1's checker adds a check that it is at most 1,024, the limit the [Agent Skills
specification](https://agentskills.io/specification) sets. Increment 1's rows and page change only where a topic
corrects an inherited row.

Accepting this record commits the owner to the fix and then eight increments, each started on his go, and to reviewing
about 255 new rows by the figures above, more in increments 2.5 and 2.7.

The analysis files carry more dated corrections, most made by the fix, until each is retired, and the extract governs
over them throughout. Increment 2.1 carries the most work of the eight: the change for state choices that are not
published, and then its rows.

What this record leaves open, and where each is settled: the result of the Massachusetts v. Oz docket check, at the
start of increments 2.1 and 2.2; each topic's real size, as each writes its rows; whether Code for America's terms allow
keeping the blueprint PDFs, in increment 3; a new pair of choice rows, in the topic that writes it; and the two federal
questions left for CMS, which renewal choice and which choice for checks between renewals apply where a state's plan
records none, which no increment settles.

On the open questions page, the group "Waiting on a choice a state has not published" disappears in increment 2.1, and
links to its anchor stop working. Every question title and fact name already published keeps working. HourKeep holds no
maintained value for any state but Colorado, and a topic may come in larger or smaller than its figure.

## Alternatives considered

Renumbering the topics as increments 2 to 9, and the later ones as 10 to 12. Of the 26 references counted on 2026-10-22,
the 5 in row Notes and the 3 in the epic design would name a topic and need dated changes, the 4 in decision record
0004, which cannot be edited, would name the wrong work for good, and increment 1's Done entry would read wrong.
Letters, 2a to 2h, leave every reference true, as decimals do. Decimals were chosen because the plan already numbers its
increments and 2.1 reads as part of 2; the price is that `rule-extract.md`'s subsections use the same form, so an
increment is always named in full.

Other groupings. One topic per section: §§ 435.550, 435.559 and 435.563 would each make a topic of 1 to 4 rows by the
figures, and § 435.557, at 2,818 words in the correction, about 70, more than increment 1's 64. Medical frailty inside
increment 2.1 would come to about 54 rows, and the Massachusetts v. Oz check would hold up every exclusion rather than
the one the case challenges. Income inside the activities topic would come to about 53, its other provisions included,
and put 16 checklist entries on one review page.

The rest of six-month renewals in the notices topic, or in increment 3 with § 435.916. The first takes the notices topic
past 64 rows. The second leaves when a person's first check can come for after every topic of the rule.

Holding a choice between two rows as a fact on the row the state chooses. The fact's name would change if a draft were
adopted the other way, and a second fact on one row repeats a heading, its anchor and a comment name. Saying the choice
only in the fact's note was also weighed; the checker cannot read a note, so nothing would hold the value to one of the
two rows.

Keeping other states' checked-once values in the facts files, as the plan proposed. The owner chose against it on
2026-10-22, for the reasons under "Other states' values".

Applying every confirmed correction in the fix, or every one with its topic. The first corrects passages on rules no row
yet makes checkable. The second leaves dangerous claims standing as late as increment 4, after the eight topics and
increment 3.

Applying the corrections that cannot wait in increment 2.1, before its rows. They would stand until its change to the
Formats, the checker, the generator and the data had landed as well. A separate increment for that change, between the
fix and increment 2.1, was weighed too, and would renumber the topics for little gain.

Keeping the passage-by-passage lists in this record. A record is superseded rather than edited, so each list that
shifted as a topic landed would need a new record.
