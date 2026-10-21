# Epic 0001 delivery plan: a policy corpus HourKeep can rely on

Status: In progress, since 2026-10-17. What the epic changes and why, and the formats every increment uses, are in
`design.md` beside this file.

- [x] 1. One topic, all the way through
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
- When rows change, the review pages are regenerated in the same change; the checker fails until they are.
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
- The checker, as the epic design describes it, and its tests under `tests/`, written first. (Corrected 2026-10-19:
  said "`tests/test_check_corpus.py`". The tests were split into one file for each part of the corpus during the
  increment, as its Done entry records.)
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

### Done, 2026-10-19

Built on the branch `corpus-1-notices` from 2026-10-17 to 2026-10-19, in four commits. Against "How you know it
worked":

- `python3 -m unittest discover -s tests` ran 211 tests and passed under Python 3.14.6 (130 s) and 3.9.6 (107 s) on
  2026-10-19. The checker's review rounds mapped every check the epic design lists to a passing and a failing
  fixture, and each of the nine breaks has a named test.
- `python3 scripts/check-corpus.py` and `/usr/bin/python3 scripts/check-corpus.py` both exit 0 and print
  `Checked 64 rows (0 say Verified: no), 39 sources, 8 state facts (0 marked not published), 0 warnings, 64 skill
  items.` Each of the nine breaks, applied one at a time to a scratch clone on 2026-10-19 and restored after each,
  made both exit 1 and name the problem: the row lacks the Citation field; the citation holds the word TBD; the
  quoted words are not on their line; the analysis file has no manifest entry; the stored source's hash differs; the
  older source is neither in the manifest nor one of the corpus's own files; the fact's source lacks `source`; the
  bracketed identifier names no row; the number is not in the row's Rule. The full review's do-it reviewer repeated
  all nine and saw the same.
- The claims in the two passages that became pointers are listed below, with where each went.
- The fresh-session test ran four times as a one-step workflow whose whole prompt was the question, twice on Claude
  Opus 5.5 and twice on GPT-5.6 Sol. All four loaded the skill unprompted, so there is no miss to carry into
  increment 5, and all four covered the seven things § 435.558(c)(1) requires, hardship included where the state
  offers it. The first run on each model cited no row identifiers and did not say which skills it loaded. A paragraph
  was then added to the skill asking a session to name the rows and skills it used, and to treat the deadline printed
  on the letter as the one to meet. The second run on each model met every criterion, so the second runs test the
  skill as it now stands.

Deviations from the plan:

- The checker is `scripts/check-corpus.py` over the package `scripts/corpus_check/`, and its tests are ten files
  under `tests/` with a shared fixture, where the plan named one `tests/test_check_corpus.py`. The checker was split
  from one 1,157-line file for the writing-code skill's file length, and a check ran the old and new checker on the
  real corpus and on each of the nine breaks, with byte-identical output.
- The skill has a rule item for every row, 64 in all, at 296 lines and, by estimate, 5,000 to 6,500 tokens: about
  the size limit the epic design sets, after one topic of five. How it holds the rest is a decision before
  increment 2. (Decided 2026-10-21: decision record 0004.)
- Rows the plan did not list: seven preamble rows, five of them split out on 2026-10-18 once the Formats section said
  a row takes the tier of the source its Rule rests on; and a statute row for the six-month renewal exemption for
  certain American Indians and Alaska Natives. Of increment 2's "SSA 1902(e)(14)(L) and SMD 26-001 for six-month
  renewals", four SMD 26-001 rows, the SSA 1902(e)(14)(L)(ii) row and the open question on 12 months against 6
  already exist.
- Colorado's facts use the rule's words, "after the date of the Notice of Action" and "not more than ten (10) days
  after the date of action", where this plan says "from the date on the Notice of Action" and "arrives within 10
  days". Whether the 10 days run to the request, as the rule says, or to its receipt, as HCPF's page says, is an open
  question.
- `public/index.html` changed in two places, not one, in English and in Spanish: the hearing sentence now says
  someone else may speak for a person, and the deadline sentence says to do what the letter asks before the date.
- Six provisions the rows rely on were neither stored nor read: 42 CFR 431.201, 431.213, 431.214,
  431.10(c)(1)(ii), 435.930(b) and 435.952(d). Increment 3 now takes them.
- eCFR's date for the stored sections is 2026-10-15, from `titles.json` on 2026-10-17.

Still unverified:

- Every check of the rows, the facts and the skill was made by an AI agent. Nobody with Medicaid policy knowledge has
  read them; who does, and what waits for them, is a decision before increment 2.
- The Spanish on `public/index.html` has had no native speaker's read.
- The 19 Source quotes taken from the derived statute copy in `hr1/` were compared with GovInfo's text of Public Law
  119-21 on 2026-10-19 and all match; that text is stored only in increment 3.
- Colorado's 8.000 is an emergency rule, version 12612, effective 2026-07-10. When it lapses, and whether § 8.057
  differs in the archived permanent version 12578, were not checked, because the Secretary of State answered 500.
- PDFKit on another macOS version, and a checkout on Windows itself. A clone with `core.autocrlf=true` passes the
  checker, now that `.gitattributes` gives the corpus's own files `text eol=lf`.

How the work ran, for the increments to come. Workflow steps stalled for long stretches, over two days of elapsed
time in all. The Mac's power settings put it to sleep a minute after its display, which dropped model connections
mid-reply, and runs stayed paused until resumed; keeping it awake with `caffeinate -is` ended that. Steps at the
highest effort that planned a whole job in one reply hit the output limit, while steps that worked a checklist one
small item at a time did not. Two steps finished without writing their output, and a loop's numeric stop condition
never fired. So: keep the machine awake, split increments at policy boundaries, give each step one small item, and
check that each report exists after each round.

The claims, by the inventory's numbering (RE for `rule-extract.md` section 8, WMM for `what-matters-most.md`
section 9). "Stays" means the claim is still in the passage after its pointer line, corrected and dated where it
needed it.

| Claim | Where it went |
|---|---|
| RE-1, at application, the State cannot verify after reviewing the application and reliable information | unable-to-verify-at-application |
| RE-2, at renewal and between renewals, a choice between two options | the State election of renewal-notice-with-renewal-form, renewal-notice-after-renewal-form-period and the two more-frequent-check rows |
| RE-3, the State records its choice in its State plan | renewal-notice-with-renewal-form, renewal-notice-after-renewal-form-period |
| RE-4, Option 1, the notice comes with the renewal form | renewal-notice-with-renewal-form; notice-sent-with-renewal-form for the preamble's timing |
| RE-5, Option 2, the notice comes after the form's period | renewal-notice-after-renewal-form-period; notice-sent-after-renewal-form-period, which adds the earlier case of a form returned without enough information |
| RE-6, under Option 1 the 30 days start alongside the form | notice-sent-with-renewal-form, notice-response-period, notice-presumed-received-after-5-days, which count the 30 days from receipt |
| RE-7, under Option 2, two windows of at least 30 days | renewal-form-and-notice-give-two-periods |
| RE-8, paragraph (b)(3) has the same two options | the two more-frequent-check rows, no-separate-request-before-notice-after-data-check and notice-after-unanswered-information-request, which say the options are similar, not the same |
| RE-9, the Option 2 carve-out removes the protection entirely | no-noncompliance-notice-when-other-factors-unanswered, which keeps the notice, the hearing rights and the reconsideration the old text left out; the overstatement and the last sentence, a reading, were dropped |
| RE-10, self-reported noncompliance taken at face value | accept-applicant-declaration-of-noncompliance; its last sentence stays, corrected to the State option, every other basis first, and written notice with hearing rights |
| RE-11, provide the notice of noncompliance | send-notice-of-noncompliance |
| RE-12, 30 calendar days from receipt | notice-response-period |
| RE-13, received 5 days after the notice's date unless shown otherwise | notice-presumed-received-after-5-days |
| RE-14, about 35 days from the notice's date | stays, corrected on 2026-10-19 to about 34 or 35 days, with how the 30 are counted an open question |
| RE-15, Medicaid continues until the person is found ineligible | coverage-continues-during-noncompliance |
| RE-16, a showing of compliance for each month | showing-of-compliance-or-exception |
| RE-17, a showing that the requirement does not apply | showing-requirement-does-not-apply |
| RE-18 to RE-24, the seven things the notice must say | notice-says-how-to-show-compliance, notice-says-how-to-show-not-applicable, notice-states-the-deadline, notice-says-how-to-submit, notice-says-consequences-including-premium-tax-credit, notice-says-how-to-reapply, notice-gives-hardship-information-where-elected |
| The section never said the notice follows §§ 435.905(b) and 435.918(b) (research L8-19) | notice-follows-section-435-905b, electronic-notice-follows-section-435-918b, added |
| RE-25, every other basis first | consider-all-other-bases-before-denial |
| RE-26, denial with notice and hearing rights, or disenrollment by the end of the next month | deny-application-with-notice-and-hearing-rights, disenroll-with-advance-notice-and-hearing-rights |
| RE-27, at least 10 days' advance notice | disenroll-with-advance-notice-and-hearing-rights, advance-notice-at-least-10-days |
| RE-28, the reasons name both failures | adverse-notice-names-both-failures |
| RE-29, other insurance affordability programs | check-other-insurance-affordability-programs |
| RE-30, no restriction on reapplying | no-restriction-on-reapplying |
| RE-31, reconsideration under § 435.558(f) | reconsideration-after-disenrollment, which since 2026-10-19 also carries the 90 days and the State's longer period; "without a new application" stays, cited to § 435.916(a)(3)(iii) |
| RE-32, § 435.912(e)(3)'s exception to the timeliness standards | stays, corrected to the regulation's limit, since no row covers § 435.912 |
| RE-33, the headings | the section heading stays; the five subheadings went with their text |
| "This materially changes the user's timeline." | dropped, framing that states no rule |
| WMM-1, the timing is more generous than it first appears | stayed, then dropped on 2026-10-19 as advice that points toward waiting |
| WMM-2, 30 calendar days from receipt | notice-response-period |
| WMM-3, received 5 days after the notice's date unless shown otherwise | notice-presumed-received-after-5-days |
| WMM-4, CMS's examples of a notice not received | stays, cited to the preamble, 91 FR 33413 |
| WMM-5, roughly 35 days from the notice's date | stays, corrected as RE-14 |
| WMM-6, the 5 days mirror §§ 431.231(c)(2) and 431.232(b) | must-reinstate-after-action-without-advance-notice for § 431.231(c)(2); the § 431.232(b) half stays, cited to the preamble |
| WMM-7, Medicaid continues | coverage-continues-during-noncompliance |
| WMM-8, two ways to respond | showing-of-compliance-or-exception, showing-requirement-does-not-apply; the wrong citation went |
| WMM-9, what the notice must contain, with no hardship item (research L8-8) | the six notice-says rows and notice-gives-hardship-information-where-elected |
| The section never said the notice follows §§ 435.905(b) and 435.918(b) (research L8-19) | the two cross-reference rows, added |
| WMM-10, every other basis first | consider-all-other-bases-before-denial |
| WMM-11, disenrollment by the end of the next month | disenroll-with-advance-notice-and-hearing-rights, advance-notice-at-least-10-days |
| WMM-12, the reconsideration period | reconsideration-after-disenrollment, with the 90 days since 2026-10-19; "without a new application", the return treated as an application, and the period being optional for non-MAGI enrollees stay, cited to the June 3 printing |
| WMM-13, no restriction on reapplying | no-restriction-on-reapplying |
| WMM-14, determinations can be appealed under § 431.220(a)(1) | hearing-required-on-request, deny-application-with-notice-and-hearing-rights, disenroll-with-advance-notice-and-hearing-rights |
| WMM-15, the Option 2 carve-out | no-noncompliance-notice-when-other-factors-unanswered; its sentence on the State plan's choice went to renewal-notice-with-renewal-form and renewal-notice-after-renewal-form-period |
| WMM-16, the heading | stays |

Review. Before the full review, five checks ran. GPT-5.6 Sol checked the rows' groundwork against the stored sources
and found 9 problems, one of them an invented federal default, all fixed. The checker had six review rounds, GPT-5.6
Sol and Claude Opus 5.5 each reviewing on their own and an aggregator confirming each finding against the code: no
blocking finding, 3 or 4 should-fix findings a round, all fixed, with round 5's merge lost to an interrupted step and
carried by round 6. The rows had three rounds of meaning review on both models, finding 1, 0 and 0 blocking and 14,
5 and 5 should fix, all fixed, with round 2's Opus review lost to a stalled step. GPT-5.6 Sol ran the checker split
and found 3 should fix, all fixed. GPT-5.6 Sol checked the last rows fixes and found 2 incomplete, both finished.

The full review, on 2026-10-19, ran five mandates two at a time, each against its own source. Against the source,
GPT-5.6 Sol, against the stored sources, the research records, and a search for anything published after 2026-10-16:
3 should fix. The search found nothing that changes a conclusion in CMS's community engagement page, the Federal
Register, eCFR, Colorado's rule page and HCPF's sitemap, the dockets of Massachusetts v. Oz and Taylor v. Kennedy,
or the IRS proposed rule, each checked 2026-10-19. Red team, GPT-5.6 Sol, against the plan: 3 blocking and 7 should
fix. Cold reader, Claude Opus 5.5, as a fresh agent, a legal aid attorney, a person on Medicaid on a phone, a new
developer and the next session: 10 should fix and 7 notes. Against the mechanism, Claude Opus 5.5, against Kiro's,
the Agent Skills specification's and git's documentation and live runs: 4 should fix and 7 notes. Do it, Claude
Opus 5.5, carrying out the instructions in a clone: 1 should fix and 4 notes.

That is 3 blocking, 25 should fix and 18 notes, six issues of them raised by more than one reviewer, and each was
confirmed against the files. All 28 blocking and should-fix findings were accepted. Two of the blocking ones were
this entry not yet existing; the third, that the statute row rests on a copy of unrecorded origin, was answered by
the GovInfo comparison. Two should-fix findings became decisions before increment 2, the skill's shape and the policy
reader; the rest were fixed. Four notes were rejected: the manifest's two Federal Register fetch commands lack
`--fail`, but the manifest records the command that ran, and the next fetch adds it; whole-file problems are reported
at line 0, as the checker's docstring says; an emptied fact source is reported at its fact's line, which names the
fact and the key, so a finer line waits; and the page's "ask soon" before a hearing, which the reviewer called
accurate. A GPT-5.6 Sol check of the fixes then found the receipt presumption stated as "unless the person shows
otherwise" in seven passages, broader than § 435.558(c)(4), and a search found two more; all nine now say the person
did not receive the notice within the 5-day period. That check's Python 3.9 run ended before a result, and the suite
then passed under both.

Owner's review, 2026-10-21. The owner reviewed the changes to `public/index.html` and the list of commits, with no
notes. The owner found the skill's renewal options and its 2027 transition paths hard to tell apart, and its paragraph
on the date of action and the 5-day notice unclear. The open questions did not say why each was open. And the owner
asked which decisions were needed and what a policy reader should look at. What changed: the skill was split into a main
file and a file per topic, as decision record 0004 records. Its 64 rule items are grouped under twelve headings, each
named for what it covers, and every item was read, and 49 of the 64 were reworded so each stands alone, with the state's
choices named by what they do. The paragraph on the date of action and the 5-day notice was rewritten. Each of the 14
open questions has a "Why it is open" line. GPT-5.6 Sol, against the source, read all 64 rule items against their rows
and found 1 blocking and 6 should fix: the group for the second renewal choice was named as if the notice always came
after the form's deadline, where the preamble also sends it earlier when a form comes back without enough information;
four items left out an actor, a limit or the date a period is measured from; the paragraph on the date of action said
only two definitions were missing, where the exceptions in 42 CFR 431.213 and 431.214 are unread as well; and this
paragraph said every item was reworded. Claude Opus 5.5, against the mechanism, ran 18 break probes under both Pythons,
all failing as they should, and found 4 should fix and 5 notes: an emptied topic file passed where an emptied Rules
section had failed; nothing checked that each row has a rule item; the fresh-session test had not run on the split
skill; and the same count. All 11 findings were confirmed and fixed, and the checker now fails a topic file with no rule
item and a row with no rule item or more than one. Of the 5 notes, 3 were taken: paths to `docs/` are said to be from
the repository root, decision record 0004 gives the loading cost of one topic, and two stray blank lines went. Two were
rejected: a misleading message for a link that already fails, and a scratch report's naming of the test classes. The
fresh-session test then ran on the split skill, once on Claude Opus 5.5 and once on GPT-5.6 Sol, with only the question:
both loaded the skill unprompted, opened the topic file, covered the seven things § 435.558(c)(1) requires with hardship
where the state offers it, named the rows and skills they used, and pointed to the deadline printed on the letter. A
GPT-5.6 Sol check of those fixes found two more items broader than their rows, and both were fixed: the item for the
second renewal choice now says the renewal form goes to people whose eligibility cannot be renewed from reliable
information under § 435.916(a)(2), and the five items on what a notice of action must contain now say they cover
notices required under § 431.206(c)(2), (c)(3) or (c)(4). After that, 226 tests passed under both Pythons, and the
checker exited 0 with 64 rows and 64 skill items.

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

Two decisions before it starts, which increment 1 raised: how the skill holds the topics still to come, since this
topic alone brings it to about its size limit; and who with Medicaid policy knowledge reads the rows, and what waits
until they have. (Added 2026-10-19; full review 2026-10-19, red team 4 and 7.) (Decided 2026-10-21: the skill is a
main file and a file per topic, decision record 0004; the owner reviews rows and they go out for open review, and the
corpus work does not wait, as docs/design.md records.)

## 3. The statute and the supporting rules

### Delivers

- A short statute extract: Public Law 119-21 sections 71119 and 71107, and section 10102 for the SNAP questions.
- 7 CFR 273.7 and 273.24 stored, so the SNAP questions rest on stored text.
- The rules for the other letters a person may hold: renewal forms (§ 435.916), what a decision notice must say
  (§ 435.917), plain language and access for people with limited English or a disability (§ 435.905(b)), and
  electronic notices (§ 435.918).
- The provisions increment 1's rows rely on and nobody has read, stored as eCFR XML and carried as rows: 42 CFR
  431.201 (definitions, among them the date of action), 431.213 and 431.214 (the exceptions to 10 days' notice, and
  the 5-day notice), 431.10(c)(1)(ii) (hearings delegated to the Exchange), 435.930(b) (coverage until a person is
  found ineligible) and 435.952(d) (requests for information). Each row that names one says so in its Note.
  (Added 2026-10-19; full review 2026-10-19, red team 6.)
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

(Added 2026-10-21. HCPF's board deck of 2026-09-28, which research L5 cites for the board's dates at deck page 30, is
not stored; its Drive address is at `docs/domain/research/2026-10-16-policy/L5-colorado.md` line 46. A copy is kept
outside the repository at `.agents/policy-research-2026-10-16/scratch-L5/rule-deck-2026-09-28.pdf` in case that link
moves. This increment stores the deck as a source, from that copy or fetched again.)

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
