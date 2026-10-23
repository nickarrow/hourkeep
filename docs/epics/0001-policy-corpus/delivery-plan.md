# Epic 0001 delivery plan: a policy corpus HourKeep can rely on

Status: In progress, since 2026-10-17. What the epic changes and why, and the formats every increment uses, are in
`design.md` beside this file.

- [x] 1. One topic, all the way through
- [x] 2.1 Who the requirement applies to, and who is excluded from it
- [ ] 2.2 People who are medically frail or have special medical needs
- [ ] 2.3 Exceptions for a month: mandatory exceptions, and optional short-term hardship exceptions
- [ ] 2.4 Work, community service, work programs and school
- [ ] 2.5 Monthly income, income counted as work hours, and seasonal workers
- [ ] 2.6 How the state verifies: reliable information first, then what a person sends
- [ ] 2.7 Which months are checked, how often, and when the requirement starts
- [ ] 2.8 Outreach, and what states report to CMS
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
  and runs on either. Neither reads YAML without a package. (Added 2026-10-22: in the shell Kiro's agents run, plain
  `python3` resolved to `/usr/bin/python3`, 3.9.6, on 2026-10-21 and 2026-10-22, and the 3.14.6 interpreter is
  `/opt/homebrew/bin/python3`, so a command that has to run on both names each by its path; increment 2 handoff dry
  run.) (Added 2026-10-22: at about 22:00 UTC that day, in the shell one agent ran, plain `python3` was
  `/opt/homebrew/bin/python3`, 3.14.6, and under `env -i` it was `/usr/bin/python3`, 3.9.6, so which one plain
  `python3` names depends on the environment the agent gets; review of decision record 0006, mechanism 17.)
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
  (Added 2026-10-23: a passage whose remaining claims no row covers yet is pointed, with those claims kept after the
  pointer, as the epic design's Formats say under "Pointers and dated corrections"; full review 2026-10-23, corpus
  against source 11.) Two kinds of correction come sooner, in the fix before increment 2.1 that section 2
  describes, in every file that carries the claim: one the ledger rates dangerous, and one about an event or a
  publication that no topic covers. One about a state other than Colorado that is not dangerous is not applied, and
  goes when its file is retired (decision record 0006).
- When a claim is corrected, search `docs/domain/` outside the stored sources and the research records, and the skill,
  for every copy of it in the same change.
- The research cites lines in `docs/domain/` as they stood on 2026-10-16, and pointers shift the lines below them. Find
  a cited line in the file as committed at 70be85f (`git show 70be85f:<path>`) before looking for it today.
- Corrections to dated claims are recorded with their date. Nothing is rewritten to look as if it was always right.
- When rows change, the review pages are regenerated in the same change; the checker fails until they are.
- Each increment checks the skill's watch list for items that have come due, by their date or their event, before it
  drafts any row and again before its Done entry. The Done entry records each item checked and what it changed, or
  that it changed nothing.
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
  119-21 on 2026-10-19 and all match; that text is stored only in increment 3. (Added 2026-10-22: decision
  record 0006 moves the storing of GovInfo's text to increment 2.7.)
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

Delivered as increments 2.1 to 2.8 below, one for each topic of 42 CFR 435.550 to 435.563, under decision record
0006, which sets the topics and their order and the restructure of `docs/domain/` they carry out. Together they
deliver what this increment named: all of §§ 435.550 to 435.563 as rows, outreach under § 435.561 included, with SSA
1902(e)(14)(L) and SMD 26-001 for six-month renewals; every correction the ledger confirmed for `rule-extract.md` and
`what-matters-most.md`, each dated; and `what-matters-most.md`'s priorities and its checklist of common errors moved
into the extract and the skill, and the file retired. None of the eight adds state values beyond the facts decision
record 0006 moves, the statute extract or SNAP, and the sections of `rule-extract.md` on state options, the
implementation landscape and open questions become pointers only in increment 4.

This increment's checks are carried into the topics. Each topic's Done entry lists once every ledger finding it
applied or rejected, with a reason for each rejection; each topic searches `docs/domain/` outside the stored sources
and the research records for the old wording of its corrections; and increment 2.8 checks that every paragraph of
§§ 435.550 to 435.563 is carried by a row or has a reason it has none.

Increment 1 already applied these findings, by the files' dated corrections, and for L8-8 and L8-19 by its Done entry
too, which names no other of them; no topic applies them again. L1-5 and L1-4, in `rule-extract.md`'s header; L8-8,
`what-matters-most.md` section 9, now a pointer; L2-4, that file's section 1 and "Writing for people" item 2, and
`rule-extract.md` section 9; research L1 section 3, `what-matters-most.md` section 8, corrected 2026-10-17 under L1-5,
and the caution in `supporting-regs/README.md`; L1-6, and L4-5 with L5-3, in `state-options.md`; L6-6 and L1-9, whose
content notice-response-period, notice-sent-with-renewal-form and notice-says-consequences-including-premium-tax-credit
carry, though none names the finding, and the watch list names L1-9; L8-19's §§ 435.905(b) and 435.918(b), as rows;
and the stored correction the ledger's "New file" asks for (L1-4, L8-18). Of the 28 entries of
`what-matters-most.md` section 12, increment 1's rows already carry 2, "You get 30 days from the notice" and
"Coverage stops when the notice arrives"; the other 26 fall to increments 2.1 to 2.7 below. A Note quotes the
second; no row quotes the first, and increment 2.7 adds it to notice-response-period's Note.

A fix on its own branch applies the corrections that cannot wait, right after decision record 0006 is accepted and
before increment 2.1 starts. They are the corrections the ledger rates dangerous, about another state included, and
those about an event or a publication that no topic covers (decision record 0006, "The corrections"). Each is applied
in place, dated with its finding ID, in every file that carries the claim, found first in the file as it stood at
70be85f, the commit the research read. The fix is reviewed as a fix: one reviewer against the research ledger, and a
do-it reviewer who carries out this list in a clone. Before it merges, the tests and the checker run under both
interpreters, each by its path, and a search of `docs/domain/` outside the stored sources and the research records
finds each corrected claim's old wording, "October 20, 2026" among them, only in its dated correction. Its commit
message lists each finding below, applied or rejected with a reason, and a dated line in this section records the
merge and what the review found.

Each correction is applied once, by the fix. A later topic whose rows carry a subject the fix corrected says so in its
Done entry as coverage, and does not list the finding as applied a second time. A passage the fix corrects still
becomes a pointer when its topic lands, and that topic corrects it again only if its rows say otherwise.

The corrections the ledger rates dangerous:

- L8-9, the 56% scoped to applicable individuals due for renewal, in `rule-extract.md` sections 7 and 11, and in
  `what-matters-most.md`'s "Writing for people, not about the rule" item 1.
- L2-3, L2-5, L3-9 and L3-11, the six-month text, with L2-2 and L3-10, which support them and which the ledger does not
  rate dangerous: `rule-extract.md` section 9's "Renewal frequency" and section 12, `what-matters-most.md` section 13,
  and `state-options.md`'s schema and federal default profile; and, by L3-12, line 242 of `HR1-Impact-Summary.md` as
  it stood at 70be85f.
- L8-3, the three-prong dependent, in `what-matters-most.md` section 10.
- L8-4, develop rather than publish a condition list, in `rule-extract.md` section 12.
- L4-13 with L8-6, the eight-state sentence, in `rule-extract.md` section 11 and in `state-options.md`'s schema and
  federal default profile, whose New Hampshire omission is dangerous. L8-6 is the tracker's nine rows against the
  text's eight.
- L8-16 with L6-12, Montana's enforcement, in `rule-extract.md` section 11.
- L8-10's four dangerous lines, 17, 52, 58 and 104 as the file stood at 70be85f, in
  `docs/domain/medicaid-work-requirements-cfa-service-blueprint.md`, the Medicaid summary.
- L4-9, L4-10, L4-11, L4-14 with L8-7, L4-15, L4-18, L3-17 and L8-15, in `state-options.md`'s "Per-State tracker" and
  "Open data gaps". A dangerous value for a state the tracker has no row for gets a dated line under the tracker naming
  the finding, not a row.

The corrections about an event or a publication that no topic covers:

- L1-11 with L3-1 and L5-15, the Massachusetts v. Oz hearing reset to 2026-10-22, in `rule-extract.md` section 11,
  `what-matters-most.md` section 4 and `state-options.md`'s schema, each still saying October 20 on 2026-10-22, with
  L3-2, L3-4, L1-12 with L3-5, and L3-6 on the litigation. Increment 2.1 checks the docket and adds its result to the
  same passages.
- L2-18 with L8-17, Emmy, in `rule-extract.md` section 11.
- L2-6 with L4-6 and L6-2, the MACPro guide, in `rule-extract.md` section 12 and `state-options.md`'s "Open data gaps".
- L8-12's page where the regulatory text starts, in `what-matters-most.md`'s header.

Rejected, with its reason in the commit message: L2-14's part on the Alaska and Hawaii pages, which show the 48-state
figure of $22,025 for income up to 138% of the poverty line (research L2, line 132). The ledger rates it dangerous and
did not re-derive the two states' limits. It is the adult group's income limit, and HourKeep does not screen for
Medicaid eligibility (`docs/design.md`, "What it will not do"), so it gets no row and the figures are not re-derived.

Two sentences outside `docs/domain/` say every correction waits for its topic: `docs/design.md` under "What has to be
true" ("the rest wait for their own topics") and `README.md` under "What is here" ("They are corrected a topic at a
time"). The fix adds to each that the dangerous corrections, and those no topic covers, come first, in a fix before
increment 2.1.

(Done 2026-10-23, on the branch fix-corrections-that-cannot-wait: every correction above applied, as 52 dated
corrections, 14 additions and 1 mark of a claim no stored source holds, and L2-14's Alaska and Hawaii part rejected for
the reason above. A reviewer against the ledger (GPT-5.6 Sol) found nothing. A do-it reviewer (Claude Opus 5.5), who
applied the change in a clone and ran it, found 1 should fix, a sentence of `rule-extract.md` subsection 7.9 still
calling the Hub's education and VA data forthcoming, corrected under L2-18 and L8-17; and 3 notes, none changing this
fix: "sourced elsewhere" left in `state-options.md`'s renewal caveat, which is true of the statute; lines 214 and 277 of
the Medicaid summary, which the ledger rates burdensome and increment 3 corrects; and that the suites show only that
nothing the checker reads broke. 317 tests passed and `scripts/check-corpus.py` exited 0 under both interpreters.)

(Decided 2026-10-22 by the owner. This increment is split by topic: one increment for each topic of 42 CFR 435.550 to
435.563, each reviewed and published on the review pages on its own, since increment 1's one topic came to 64 rows.
The decision record names the topics and their order, and they are written into this plan once it is approved. It
also takes the state's part of each open question that waits on a choice a state has not published into the state
facts, marked `not published`; any part about the federal rule stays an open question. Before the rows for 42 CFR
435.554 and 435.557(f) are written, check the docket in Massachusetts v. Oz, D. Mass. 1:26-cv-12962, for whether its
summary judgment hearing, set for 2026-10-22 as the skill's watch list says, was held, and what followed.)

### Needs from you

Approval of the decision record, which covers the retirements and moves in increments 2 to 4. (Approved 2026-10-23:
decision record 0006. Decided 2026-10-22 by the owner: the record keeps the decisions and the rules, and the detailed
lists are in increments 2.1 to 2.8 below, since they are ordering and the likeliest to shift as topics land.)

Two decisions before it starts, which increment 1 raised: how the skill holds the topics still to come, since this
topic alone brings it to about its size limit; and who with Medicaid policy knowledge reads the rows, and what waits
until they have. (Added 2026-10-19; full review 2026-10-19, red team 4 and 7.) (Decided 2026-10-21: the skill is a
main file and a file per topic, decision record 0004; the owner reviews rows and they go out for open review, and the
corpus work does not wait, as docs/design.md records.)

## 2.1 Who the requirement applies to, and who is excluded from it

### Delivers

- Before any row for § 435.554, the docket in Massachusetts v. Oz, D. Mass. 1:26-cv-12962, checked for whether the
  summary judgment hearing set for 2026-10-22 was held and what followed. The result goes in the Done entry, the
  skill's watch list, and the three passages the fix before this increment corrected under L1-11 with L3-1 and L5-15
  (section 2). If the docket shows an order on the provisions the case challenges, row work on those provisions
  stops until the owner decides how to go on. If it shows none, the work goes on, and the Done entry records the
  query, its date and that RECAP, which the research searched, can lag
  (`docs/domain/research/2026-10-16-policy/L3-statute-litigation.md:206`).
- Rows for § 435.550; § 435.551, its opening paragraph and (a) and (b); § 435.554(a), (b), and (c) less (c)(5);
  § 435.563(a) and (b); § 435.119(d) as the rule adds it; and 28 CFR 35.108 and 42 CFR 447.51 where § 435.554(a) and
  (c)(2) incorporate them. A paragraph named takes its own text, the words before its first subparagraph included,
  as decision record 0006 sets out. About 31 rows, decision record 0006's inference from 1,221 words of regulation
  text.
- Stored as served, each with a manifest entry and a `.gitattributes` line: eCFR XML of 42 CFR 435.119, 28 CFR 35.108
  and 42 CFR 447.51, for one stated eCFR date, with the command that fetched each.
- The topic file `.kiro/skills/medicaid-community-engagement/references/who-the-requirement-applies-to.md`, whose
  first line is `# Who the requirement applies to, and who is excluded from it`, and whose opening sentence names the
  prohibition of waivers, § 435.563, by that word; its item under `## Topics` in `SKILL.md`, at about 25 words, so
  `SKILL.md` stays near its target of about 1,500 words; and words in the skill's description for who the work
  requirement applies to and who is excluded from it.
- The review pages' citation links extended to title 28, so 28 CFR 35.108 links to its section on eCFR as a 42 CFR
  citation does today: `CFR_PART` and `CFR_URL` in `scripts/review_pages/constants.py`, and `cfr_address` and
  `section_address` in `scripts/review_pages/links.py`, take the title from the citation, with a 28 CFR case in
  `test_links_each_kind_of_part_and_leaves_the_rest_as_text` in `tests/test_review_pages.py`, and the Formats under
  "The review pages" say a CFR citation of either title links.
- The review page `docs/review/who-the-requirement-applies-to.md`, listed on the landing page, and its start-here rows
  under the key `who-the-requirement-applies-to` in `START_HERE`, chosen by decision record 0006's rule.
- Its 6 entries of `what-matters-most.md` section 12, each a row or part of one with the error quoted in the row's
  Note: citing the exclusions as § 435.554(a)(1) to (10); "The SNAP test is complying with SNAP work rules"; "Veterans
  need a 100% schedular rating"; "Postpartum is 60 days"; "Age 65+ is exempt"; and "A State can get an 1115 waiver
  from this".
- The dangerous finding L2-11, the 13 demonstration-only populations in 8 states, as rows; and L2-14's parts on this
  topic's paragraphs, the tribal line, "given birth" and "recovery program" (research L2, finding 14), as rows. Neither
  corrects a file.
- L2-12's SNAP breadth, read against § 435.554(c)(7) and the preamble, applied with its rows.
- Pointers, once its rows carry every claim: in `rule-extract.md`, section 1, "Applicable individual", subsection 4.1,
  "Supporting definitions", and section 9's "No waivers"; in `what-matters-most.md`, section 3, "The caregiver
  cluster"; and in `supporting-regs/README.md`, sections 2 and 3, on 28 CFR 35.108 and 42 CFR 447.51.
- Corrected in place, where its rows say otherwise, and pointed later: `rule-extract.md` section 0, "The three-tier
  status model", pointed in increment 2.7, and subsection 4.2, "The ten exclusion categories", pointed in increment
  2.2; `what-matters-most.md` section 2, "Who it applies to", pointed in increment 2.3, section 11, "Scope, and hard
  limits on States", pointed in increment 2.8, and section 13's broken cross-reference in § 435.554(c)(3), pointed in
  increment 2.7. The parameters of `rule-extract.md` section 10 on its paragraphs become State elections of its rows.
- The inherited rows showing-requirement-does-not-apply, notice-says-how-to-show-not-applicable and
  adverse-notice-names-both-failures rechecked against the new rows, since they use the terms of §§ 435.551 and
  435.554, each given a dated `Corrected:` where a new row shows it says more or less than its source.

The change for state choices that are not published, which decision record 0006 sets out, made before the rows:

- The Formats. Under "State facts": one fact per row in a state file; the `choice` key, its values, and that a fact
  on the first row of a pair has it and no other fact does; `value`, `choice` and `counts_from` as the three keys
  that may be `not published`, each so written needing a note; a `not published` fact's citation and sources; and a
  fact that takes a question's part names it. In the open questions paragraph under "Where things live": the
  `- Moved:` form, and the sentence naming the fact that ends Why it is open in a question that stays after its state
  part moved. Under "The skill": the description at most 1,024 characters, and each topic file's title the `##`
  heading of one topic in the extract. Under "Pointers and dated corrections": a correction that carries out a
  decision record cites it as `decision record <number>`. Under "The checker": the new state fact checks, a `Moved`
  question as the exception to the open question fields, the check that a fact named in a question exists, and the
  two skill checks. Under "The review pages": the moved group, last, where each question's three comment links carry
  the fact's name; the fact's name there and in Why it is open as text, not a link; the fact's line for its choice,
  which says in words which of the two options the state takes; and a sentence on `counts_from` in the status
  definitions.
- The checker. `scripts/corpus_check/constants.py` gains `CHOICE_PAIRS`, the three pairs, which a later topic extends
  when it writes a choice between two rows, and `CHOICE_WORDS`, `not published` and `not applicable`. In `states.py`:
  a state file holds at most one fact per row; no fact names the second row of a pair; a fact on the first row of a
  pair has `choice`, and no other fact does; `choice` is one of its pair's identifiers or one of `CHOICE_WORDS`; a
  `not published` fact has `choice` `not published` where it has `choice` at all; a fact whose `value`, `choice` or
  `counts_from` is `not published`, or whose `choice` is `not applicable`, has a note; and no other key of a fact is
  `not published`. `Moved` joins `QUESTION_FIELDS` in `constants.py`. In `questions.py`: a question holding `Moved`
  holds no other field and is exempt from `QUESTION_REQUIRED_FIELDS`, and its value has the record's form; and a fact
  named as `the state fact <state>: <row>`, in a `Moved` line or in Why it is open, exists. For that check,
  `check_state_facts` in `states.py` returns the `<state>: <row>` names, built from each file's `state` and each
  fact's `row`, and `scripts/corpus_check/run.py` passes them to `check_open_questions`. In `skill.py`: the
  description is at most 1,024 characters, the limit the Agent Skills specification sets; and each topic file's
  title, its first line after `# `, is the `##` heading of one topic in the extract, a check that needs the extract's
  `##` headings, which `check_extract` in `rows.py` reads and does not keep today.
- The generator. `scripts/review_pages/corpus.py` needs no change: `read_questions` already reads any `- Name: value`
  line, `Moved` among them. In `pages.py`, `fact_section` adds "Which of the two rows" after the value: in words, which
  of the two options the state takes, such as "sends the notice with the renewal form", with a link to that row, or
  `not published` or `not applicable`. The words for each row sit beside its identifier in `CHOICE_PAIRS`, because the
  fact's name gives the pair's first row whichever the state takes. `question_group` gains a branch for a question
  holding `Moved`, which today falls through to "Questions about a state's own rules"; a moved question gets a section
  of its own in place of `question_section`'s empty Why it is open, Who can answer and Rows it holds up: its old title
  as the heading, the fact's name as text and not a link, and three comment links that carry the fact's name;
  `questions_page` puts the moved group last, and its opening sentence gains "The last group holds questions whose part
  moved to the state facts, each under its old title."; and `STATUS_DEFINITIONS` gains "A part of a fact, such as what a
  period counts from, may be not published while the rest is known." `constants.py` holds the moved group's heading and
  its sentence, "These were open questions. Each is now a state fact, named under its old title, and comments on it go
  to the fact."
- The corpus prose. The opening paragraph of `open-questions.md` says that each question still open says why, and
  that a question whose part moved keeps its heading with a `Moved` line naming the fact.
- The tests, a passing and a failing fixture for each check. In `tests/test_state_facts.py`: one fact on a row and
  two; a fact on a pair's first row and one on its second; a pair fact with `choice` and one without; a `choice` on a
  row in no pair; each allowed `choice`, both identifiers and both words, and a value outside them, such as an
  identifier from another pair; a `not published` fact with `choice` `not published` and one with an identifier;
  `value` `not published`, `counts_from` `not published`, `choice` `not published` and `choice` `not applicable`,
  each with a note and without; and another key, such as `setting`, written `not published`. The fixture extract
  holds two rows today, `hearing-request-period` and `notice-response-period` (`tests/corpus_fixture.py`), and each
  test runs the checker as a subprocess, so the pair tests add the rows of two pairs, each with its rule item in the
  fixture's topic file, in the test or in a helper in `tests/corpus_fixture.py`, and leave the valid corpus's counts
  alone. In `tests/test_open_questions.py`: a moved question naming a fact that exists, one naming none, one with a
  malformed `Moved` line, and one holding another field; and a Why it is open naming a state fact that exists and one
  naming none. In `tests/test_skill.py`: a description of 1,024 characters and one of 1,025; and a topic file whose
  title is a `##` heading of the extract and one whose title is not. `tests/test_review_question_groups.py` tests the
  moved group and its place; `tests/test_review_pages.py` the moved question's section, with the fact's name as text
  and its three comment links carrying that name, the choice line in words for each row of a pair, both opening
  sentences and the status definitions.
- The data. `open-questions.md` and `states/co.json` as decision record 0006 sets out for the four questions; the
  search behind each `not published` run again over the stored Colorado sources and recorded in its note; and the
  review pages regenerated.

### Deliberately not

Medical frailty, § 435.554(c)(5), which increment 2.2 takes with its verification, and the mandatory exceptions of
§ 435.553, which increment 2.3 takes. How the state verifies an exclusion, under § 435.557. That includes
§ 435.557(f)(2), the privacy duty for data used to verify medical frailty or participation in a drug addiction or
alcoholic treatment and rehabilitation program: its share for § 435.554(c)(8), this topic's exclusion, goes with
increment 2.2's rows. The corrections that are neither dangerous nor about an event no topic covers, which wait for
the topic whose rows cover their claim. Other states' values beyond the dangerous corrections, which increment 4
settles. No file is retired.

### Why this shape

It comes first because every later section uses the terms applicable individual and specified excluded individual,
and because `docs/design.md`, under "What may mean the rule does not apply", leads with what may mean the rule does
not apply at all. It also carries the mechanism for unpublished state choices, so the topics after it write rows and
pointers only. The corrections that cannot wait land before it, in the fix section 2 describes.

### How you know it worked

- `/usr/bin/python3 -m unittest discover -s tests` (3.9.6) and `/opt/homebrew/bin/python3 -m unittest discover -s
  tests` (3.14.6) both pass, each run as its own command, with a passing and a failing fixture for each new check
  named in the Done entry.
- `scripts/check-corpus.py` exits 0 under both and prints its counts of rows, sources, state facts and skill items.
- `docs/review/who-the-requirement-applies-to.md` exists and the checker compares it with what the generator makes.
- The open questions page has the group "Moved to the state facts", last, and no group "Waiting on a choice a state
  has not published"; every question title and every `<state>: <row>` fact name published before this increment
  still has its heading on the pages.
- The Massachusetts v. Oz docket result is in the Done entry and the watch list, with the date it was checked.
- Each ledger finding this increment applies appears once in its Done entry, applied or rejected with a reason.
- The Done entry lists each paragraph in Delivers with the rows that carry it, or the reason it has none, and each
  claim of each passage pointed in `rule-extract.md`, `what-matters-most.md` and `supporting-regs/README.md` with the
  row that now carries it, as increment 1's did.
- A search of `docs/domain/` outside the stored sources and the research records finds each corrected claim's old
  wording only in its dated correction.
- A fresh agent session is asked: "I look after my mother, who has a disability and lives with me. Do I still have to
  meet Medicaid's work requirement?" It runs as increment 1's did, as a one-step workflow whose whole prompt is the
  question, or as a new Kiro chat, with no skill named. Its answer says that a caretaker relative of a disabled
  individual, as § 435.554(a) defines one, a relative such as a son or daughter with whom the disabled individual lives
  and who assumes primary responsibility for their care, is a specified excluded individual, to whom the requirement
  does not apply; that a family caregiver, as § 435.554(a) defines one, is excluded only if they also meet one of the
  tests of § 435.554(c)(3)(i)(A) to (C), which for someone who primarily lives with the person they care for is
  assistance that comes on a regular basis and is not solely incidental in nature; that a disabled individual is one who
  meets the ADA's definition at 28 CFR 35.108, whether or not they are eligible for Medicaid or another federal program
  on the basis of a disability; and that whether the person is a caretaker relative, or meets one of those tests, is the
  agency's determination, labeled Deferred, with the agency named as the one to ask. It cites by identifier the rows on
  § 435.554(a)'s definitions of caretaker relative, family caregiver and disabled individual, and on § 435.554(b),
  (c)(3) and (c)(3)(i), and says which skills it loaded. If the skill did not load, the session runs again with the
  skill named, and the miss is recorded for increment 5, whose test depends on unprompted loading.

### Needs from you

The owner's go before it starts, and the owner's decision on how to go on if the docket shows an order on the
provisions Massachusetts v. Oz challenges. Nothing else, unless a site refuses automated requests, in which case a
copy downloaded in a browser.

### Done, 2026-10-23

Built on the branch `corpus-2.1-who-it-applies-to`, off main at b2be22d, on 2026-10-23, then fixed after the full
review. Against "How you know it worked":

- `/usr/bin/python3 -m unittest discover -s tests` (3.9.6) ran 357 tests and passed in 158 s, and
  `/opt/homebrew/bin/python3 -m unittest discover -s tests` (3.14.6) ran 357 and passed in 194 s, each as its own
  command, on 2026-10-23 at about 07:30 UTC. Main had 317. The 40 new tests, each check with a passing and a failing
  fixture:
  - State facts, `ChoiceFactTest` in `tests/test_choice_facts.py`, 11 tests: one fact per row in a file; no fact on
    a pair's second row, which is told that and not also that only a first row has `choice`; a fact on a pair's
    first row has `choice`, and no other fact does; `choice` is its pair's identifier or `not published` or `not
    applicable`; a `not published` fact's `choice` is `not published`; a note wherever `value`, `choice` or
    `counts_from` is `not published` or `choice` is `not applicable`; no other key `not published`.
  - The pairs themselves, `ChoicePairsTest` in the same file, 6 tests: `choice_pair_problems` in
    `scripts/corpus_check/states.py`, reported at `scripts/corpus_check/constants.py:0`, fails a pair whose two rows
    are one, a row in two pairs, and a pair of which the extract holds one row or holds the second first. The unit
    tests call it directly, since the suite cannot patch a constant, and one runs the checker on the real
    `CHOICE_PAIRS` with the renewal pair in order, reversed and halved.
  - Open questions, `MovedQuestionTest` in `tests/test_open_questions.py`, 9 tests: a `Moved` question names a fact
    that exists, has the record's form, holds no other field and holds `Moved` once; a date in the form that is no
    day gets a message of its own; a fact named in Why it is open exists, and is looked for after "the" or "The",
    bare or in backticks.
  - The skill, `tests/test_skill.py`, 3 tests: a description of 1,024 characters passes and 1,025 fails; a topic
    file's title is a `##` heading of the extract; no two topic files share a title.
  - The review pages, `tests/test_review_pages.py`, 9 tests, and `tests/test_review_question_groups.py`, 2: the moved
    group, last; the moved question's section, the fact's name as text and in its three comment links; the choice
    line, naming both rows of the pair in words, each linked, then the state's choice; a line for each Source not stored
    and none for a stored one; the orientation before Start
    here, its identifiers linked, before the first group where a topic has no start-here rows, and absent where a
    topic has none; both opening sentences, with "since each of those has two sources that say different things";
    and 28 CFR links. Assertions added to existing tests: three 28 CFR cases in
    `test_links_each_kind_of_part_and_leaves_the_rest_as_text`, the status definitions' `counts_from` sentence, a
    "Source, not stored yet:" line for a row whose Source is not stored and none for one whose Source is, and the
    fixture topic file titled with its extract heading.
- `scripts/check-corpus.py` exits 0 under both and prints `Checked 126 rows (1 say Verified: no, 0 verified by a
  person), 43 sources, 10 state facts (2 marked not published), 0 warnings, 126 skill items.` Before the increment,
  main gave 64 rows, 39 sources, 8 state facts and 64 skill items.
- `docs/review/who-the-requirement-applies-to.md` exists, 686 lines, linked twice from the landing page, to the page
  and to its start-here rows, and the checker compares it with what the generator makes. `docs/review/` holds 5
  pages.
- The open questions page has, in order, "Where the sources conflict", "Questions about the federal rule", "Questions
  about a state's own rules" and "Moved to the state facts", last, and "Waiting on a choice" nowhere. All 14 question
  titles of main's page and all 8 fact headings of main's state facts page are still there; there are 18 questions and
  10 fact headings now.
- The docket, the ledger findings, the paragraphs of Delivers and the pointed claims are below.
- The old-wording search: `git grep -F` over `docs/`, `.kiro/`, `scripts/` and `tests/`, less the research records and
  the stored sources, for 24 old wordings, finds each corrected claim's old wording only in its dated correction, but
  for one sentence the plan's standing constraints and the epic design's "What it changes" both keep, "A passage becomes
  a pointer only once every claim in it has a row", each now followed by a dated line that a passage whose remaining
  claims no row covers yet is pointed with those claims kept, as the Formats say.
- The fresh-session test ran twice on each model, each as a one-step workflow whose whole prompt was the plan's
  question, with no skill named. The first runs, on 2026-10-23 at about 04:19 UTC, before the review, both loaded the
  skill and hhs-benefits unprompted and opened the topic file, and neither met every criterion: both led with an
  estimate, "Likely" and "Probably not", GPT-5.6 Sol stated the person's facts as met and named no caretaker relative
  route, and neither cited every row the plan names. A sentence went into `SKILL.md`, that a session answering a person
  about their own case gives no estimate of whether the requirement applies to them, states none of their facts as met,
  names every category their facts may point to and what each requires, labels the agency's part Deferred and says what
  to do next; and one into the topic file's opening, that a person's facts may point to more than one category. The
  second runs, at about 07:30 UTC, after the fixes, both loaded the skill and hhs-benefits unprompted and opened the
  topic file. Both named the caretaker relative and family caregiver routes, the (c)(3)(i)(A) test with no minimum hours
  and the ADA definition, labeled the agency's part Deferred, named the agency, gave no estimate, said what to do next
  and said which skills they loaded. Claude Opus 5.5 met every criterion of the answer and cited 4 of the 6 rows the
  plan names, leaving out the § 435.554(b) row and family-caregiver-excluded-on-one-criterion while citing the (c)
  lead-in and the (c)(3)(i)(A) row. GPT-5.6 Sol cited 3, leaving out family-caregiver-defined,
  disabled-individual-defined and the (b) row, and did not say that the person cared for need not be eligible on the
  basis of a disability. Both cited the rows they relied on, and the skill was not changed again to ask for more, which
  would teach the answer to the test. No skill load was missed, so nothing carries into increment 5.

Massachusetts v. Oz, D. Mass. 1:26-cv-12962. On 2026-10-23, before the first row on § 435.554, CourtListener's RECAP
copy of the docket page was read at about 00:37 UTC, and RECAP's search index was queried then and again at about
03:09 UTC; the docket page was not fetched the second time. Both showed entries 143 and 144 only, 144 a notice of
appearance filed 2026-10-21, no entry recording the summary judgment hearing set for 2026-10-22 as held, no order
and no termination. RECAP can lag PACER (`docs/domain/research/2026-10-16-policy/L3-statute-litigation.md:206`), and
PACER was not checked. With no order, the rows went on. The result is in the skill's watch list and in the three
passages the fix before this increment corrected: `rule-extract.md` section 11, `what-matters-most.md` section 4 and
the `interpretiveRisk` comment of `state-options.md`, each saying when the page and the index were read.

Each ledger finding the plan's 2.1 names, applied or rejected:

- L1-11, with L3-1 and L5-15, the hearing reset to 2026-10-22: the fix before this increment corrected the three
  passages. Applied here as the plan asks: the docket checked, its result added to those passages and the watch list.
- L2-11, dangerous, 13 demonstration-only populations in 8 States: applied, as
  cms-identified-13-demonstration-populations-in-8-states, agency guidance from CMS's deck of 2026-07-27, slide 9,
  which is not stored, so the row says `Verified: no`, beside the stored preamble's account in
  demonstration-populations-reviewed-for-community-engagement. The row names no State, by decision record 0006's
  "Other states' values". Its page shows the deck's address as "Source, not stored yet".
- L2-12, the SNAP breadth only: applied, as snap-exclusion-covers-general-and-time-limit-work-requirements, on the
  preamble at 91 FR 33377, with the (c)(7) row. Its other parts, good faith effort approvals and what plans may do,
  are not this topic's.
- L2-14, the parts on this topic only: applied in rows and Notes, the tribal line in american-indian-excluded,
  "recovery program" in treatment-program-participant-excluded and treatment-program-defined-by-food-and-nutrition-act,
  and "given birth" in postpartum-period-runs-from-the-end-of-pregnancy. Its income, Medicare, frailty and Alaska and
  Hawaii parts belong to increments 2.2, 2.3 and 2.5.

Named in no part of the plan's 2.1, bearing on this topic, and not applied: L2-13, CMS's "already meet" SNAP wording,
named as context in the SNAP row's Note; L7-7 and L5-21, Colorado's own pages, state copy for increment 4; L8-10,
applied by the fix before this increment; L2-3, on 6-month renewals for demonstration groups, which is not about who
the requirement applies to.

Each paragraph of Delivers, and what carries it:

- The docket before any § 435.554 row: no row; the result above, in the watch list and the three passages.
- The rows: 62, where decision record 0006 inferred about 31, under its limit of 64. By tier, 52 regulation, 9
  preamble and 1 agency guidance; by error direction, 50 dangerous and 12 burdensome; 61 `Verified: 2026-10-23, read
  in source` and 1 `Verified: no`; 5 with a State election. By paragraph:
  - § 435.119(d): adult-group-eligibility-subject-to-community-engagement.
  - § 435.550: requirement-applies-in-the-50-states-and-dc.
  - § 435.551's opening paragraph, (a) and (b): applicable-individual-defined,
    applicable-individual-under-the-state-plan, applicable-individual-under-a-demonstration.
  - § 435.554(a), its seven definitions: caretaker-relative-defined,
    caretaker-relative-other-relationships-at-state-option, dependent-child-defined, disabled-individual-defined,
    family-caregiver-defined, guardian-defined, parent-defined.
  - 28 CFR 35.108, which § 435.554(a) incorporates whole, 20 rows: (a)(1), ada-disability-definition; (a)(2)(i),
    ada-disability-construed-broadly; (a)(2)(ii), ada-disability-any-one-or-more-prongs; (b)(1) with (b)(2),
    ada-physical-or-mental-impairment-defined; (b)(3), ada-impairment-excludes-homosexuality-and-bisexuality; (c)(1)
    with (c)(2), ada-major-life-activities-defined; (d)(1) with (d)(1)(i),
    ada-substantially-limits-construed-broadly; (d)(1)(iii), ada-one-major-life-activity-is-enough; (d)(1)(iv),
    ada-episodic-or-in-remission-impairment; (d)(1)(v), ada-substantially-limits-compared-to-most-people;
    (d)(1)(vi), ada-substantially-limits-individualized-assessment; (d)(1)(vii),
    ada-comparison-usually-needs-no-scientific-evidence; (d)(1)(viii) with (d)(4),
    ada-mitigating-measures-not-considered; (d)(1)(ix), ada-impairment-under-six-months-can-substantially-limit;
    (d)(2)(ii) with (d)(2)(iii) and its list, ada-some-impairments-virtually-always-substantially-limit; (d)(3),
    ada-condition-manner-or-duration; (e)(1) with (e)(2), ada-record-of-impairment-defined; (f) with (f)(1),
    ada-regarded-as-having-impairment; (f)(2), ada-regarded-as-excludes-transitory-and-minor; (g),
    ada-disability-exclusions. No row for (a)(2)(iii), (d)(1)(ii), (d)(2)(i), (e)(3) and (f)(3), which govern ADA
    title II claims and remedies or state the section's purpose, as ada-disability-definition's Note says.
  - § 435.554(b): specified-excluded-individual-not-subject-to-community-engagement.
  - § 435.554(c) less (c)(5): specified-excluded-individual-meets-one-category, for (c)'s own words;
    former-foster-care-child-excluded, american-indian-excluded,
    parent-guardian-caretaker-relative-or-family-caregiver-excluded, family-caregiver-excluded-on-one-criterion,
    family-caregiver-living-with-care-recipient, family-caregiver-relative-living-apart,
    family-caregiver-unrelated-living-apart-80-hours, more-than-one-excluded-in-a-residence,
    veteran-with-total-disability-rating-excluded, tanf-work-requirement-compliant-excluded,
    snap-household-member-not-exempt-from-work-requirement-excluded, treatment-program-participant-excluded,
    inmate-of-public-institution-excluded, pregnant-or-postpartum-excluded. No row cites (c)(5).
  - 42 CFR 447.51, which (c)(2) incorporates: indian-defined-at-447-51, urban-indian-criteria-at-447-51, the second
    also citing 42 CFR 400.200's definition of Secretary.
  - § 435.563(a) and (b): no-waiver-of-community-engagement,
    demonstration-must-meet-every-community-engagement-requirement.
  - The 10 rows of other tiers: the 9 preamble rows,
    demonstration-populations-reviewed-for-community-engagement, disabled-individual-has-no-age-limit,
    caregiving-hours-below-80-count-as-unpaid-work, former-foster-care-criteria-apply-whatever-the-age-18-date,
    veteran-paid-at-total-rate-for-unemployability-excluded,
    snap-exclusion-covers-general-and-time-limit-work-requirements, treatment-program-defined-by-food-and-nutrition-act,
    inmate-means-held-involuntarily-in-custody and postpartum-period-runs-from-the-end-of-pregnancy; and the agency
    guidance row, cms-identified-13-demonstration-populations-in-8-states.
  - The 5 State elections: adult-group-eligibility-subject-to-community-engagement (§ 435.119(d)'s early start),
    caretaker-relative-other-relationships-at-state-option (the (iv) relationships),
    former-foster-care-criteria-apply-whatever-the-age-18-date (an age above 18 in the title IV-E plan),
    treatment-program-participant-excluded ((c)(8)'s minimum time commitment) and
    postpartum-period-runs-from-the-end-of-pregnancy (12 months under SSA 1902(e)(16)).
- The eCFR files, in `docs/domain/sources/ecfr/2026-10-21/`, each with a manifest entry giving the command that
  fetched it: 42-cfr-435.119.xml, 28-cfr-35.108.xml and 42-cfr-447.51.xml, and, added after the review,
  42-cfr-400.200.xml, which defines Secretary for chapter IV, the chapter of part 447. No `.gitattributes` line was
  added: `docs/domain/sources/** -text` already covers the folder (`git check-attr` gives `text: unset`).
- The topic file: its first line as the plan names it; its opening sentence names "the prohibition of waivers of it in
  42 CFR 435.563"; 62 rule items, one for each row, in 11 groups, 250 lines. Its `## Topics` item is 27 words after
  the link. The description gained who has to meet the work requirement and who is exempt or excluded, at 971
  characters. `SKILL.md` is 1,664 words by `split()`, from 1,318 at main; see deviations.
- Title 28 links: `CFR_PART`, `CFR_URL`, `cfr_address` and `section_address` take the title, with three 28 CFR cases
  in `test_links_each_kind_of_part_and_leaves_the_rest_as_text`, and the Formats under "The review pages" say a CFR
  citation of title 42 or 28 links.
- The review page `docs/review/who-the-requirement-applies-to.md`, on the landing page, with 20 start-here rows under
  `who-the-requirement-applies-to` in `START_HERE`, chosen by decision record 0006's rule and in the topic file's
  order, and, added after the review, an orientation before Start here naming the topic's two terms and the rows that
  define them.
- The six entries of `what-matters-most.md` section 12, each quoted as an error in its row's Note:
  - Citing the exclusions as § 435.554(a)(1) to (10): specified-excluded-individual-meets-one-category, whose Note
    quotes the entry exactly.
  - "The SNAP test is complying with SNAP work rules":
    snap-household-member-not-exempt-from-work-requirement-excluded, with
    snap-exclusion-covers-general-and-time-limit-work-requirements.
  - "Veterans need a 100% schedular rating": veteran-paid-at-total-rate-for-unemployability-excluded, with
    veteran-with-total-disability-rating-excluded.
  - "Postpartum is 60 days": postpartum-period-runs-from-the-end-of-pregnancy, with pregnant-or-postpartum-excluded.
  - "Age 65+ is exempt": applicable-individual-under-the-state-plan, with applicable-individual-under-a-demonstration.
  - "A State can get an 1115 waiver from this": no-waiver-of-community-engagement.
- L2-11, L2-14 and L2-12: the rows above, under the ledger findings. None corrects a file.
- The pointers: the six passages the plan names, each now opening with a `Now rows ...` line dated 2026-10-23, and
  their claims in the table below.
- Corrected in place, listed below: `rule-extract.md` subsection 4.2 and section 10, section 0 checked with no change;
  `what-matters-most.md` sections 2, 11 and 13. Section 10's three parameters on this topic are the State elections
  of caretaker-relative-other-relationships-at-state-option, treatment-program-participant-excluded and
  adult-group-eligibility-subject-to-community-engagement.
- The inherited rows showing-requirement-does-not-apply, notice-says-how-to-show-not-applicable and
  adverse-notice-names-both-failures, read word for word against their stored lines (C1-2026-11094.xml:138, :166,
  :178 and :184 to :186) and against applicable-individual-defined,
  specified-excluded-individual-not-subject-to-community-engagement and
  specified-excluded-individual-meets-one-category: each says what its source says, so none got a `Corrected:`.
- The change for unpublished state choices: the Formats in `docs/epics/0001-policy-corpus/design.md` (131 lines
  added and 50 removed against b2be22d, the review's changes included); the checker (`constants.py`, `states.py`,
  `questions.py`, `skill.py`, `rows.py`, `run.py`); the generator (`pages.py`, `constants.py`, `links.py`,
  `__init__.py`; `corpus.py` unchanged, as the plan says); the opening paragraph of `open-questions.md`; the tests
  above; and the data, the four questions of decision record 0006 in `open-questions.md`, `co.json` from 4 facts to
  6, two of them marked `not published` and a third whose `counts_from` is `not published`, and the pages
  regenerated.

The claims of each passage pointed, numbered RE1, RE4.1 and RE9 for `rule-extract.md` section 1, subsection 4.1 and
section 9's "No waivers"; WMM3 for `what-matters-most.md` section 3; SR2 and SR3 for `supporting-regs/README.md`
sections 2 and 3. "Stays" means the claim is still in the passage after its pointer line, marked as the Formats say.
Each heading stays.

| Claim | Where it went |
|---|---|
| RE1-1, an applicable individual is not a specified excluded individual and is described in (a) or (b) | applicable-individual-defined |
| RE1-2, (a), the State plan's group at § 435.119 | applicable-individual-under-the-state-plan |
| RE1-3, (b), a § 1115(a)(2) demonstration giving minimum essential coverage, with its four tests | applicable-individual-under-a-demonstration |
| RE1-4, the 50 States and DC, not the territories | requirement-applies-in-the-50-states-and-dc |
| RE1-5, 44 jurisdictions, 43 States and DC | stays, corrected on 2026-10-23 to "have a population subject to the requirement", `what-matters-most.md`'s wording, and cited to the burden estimate, 2026-11094.xml:2478 (91 FR 33427); no row's Rule states it |
| RE1-6, CMS's "June 2026" list naming Georgia, Tennessee and Wisconsin and five expansion States | the count is cms-identified-13-demonstration-populations-in-8-states, the preamble's account demonstration-populations-reviewed-for-community-engagement; the State names and the June date stay, marked Unverified, since no stored source names them (the search's only hits, 2026-11094.xml:307, :314 and :335, name no population as subject) |
| RE1-7, an enrollee in those five may be subject though the State runs an adult group | stays with RE1-6, inside the Unverified mark; its rule part is demonstration-populations-reviewed-for-community-engagement |
| RE1-8, out of scope: seven States and the territories | the territories, requirement-applies-in-the-50-states-and-dc; the seven States stay inside the Unverified mark |
| RE1-9, age 65 or older, pregnancy and Medicare put a person outside the definition | applicable-individual-under-the-state-plan and applicable-individual-under-a-demonstration |
| RE1-10, under 19 and Medicare are also mandatory exceptions | stays, cited to § 435.553(a)(1) and (a)(2), 2026-11094.xml:3625 and :3626 (91 FR 33471); increment 2.3 writes § 435.553 |
| RE4.1, dependent child | dependent-child-defined |
| RE4.1, disabled individual, by the ADA's definition, need not be eligible on the basis of disability | disabled-individual-defined, ada-disability-definition |
| RE4.1, parent | parent-defined |
| RE4.1, guardian | guardian-defined |
| RE4.1, caretaker relative, (i) to (iii) | caretaker-relative-defined |
| RE4.1, caretaker relative (iv), at State option, with the § 435.110 elections carried over | caretaker-relative-other-relationships-at-state-option |
| RE4.1, family caregiver | family-caregiver-defined |
| RE9-1, CMS will not approve a § 1115 demonstration that waives the provisions | no-waiver-of-community-engagement |
| RE9-2, a State implementing through § 1115 must meet every requirement of § 1902(xx) | demonstration-must-meet-every-community-engagement-requirement |
| WMM3-1, (a) defines six terms and (c)(3) is the operative exclusion | parent-guardian-caretaker-relative-or-family-caregiver-excluded, with the six definition rows |
| WMM3-2, collapsing them into one question loses qualifying people | stays, as advice on HourKeep's copy, since decision record 0006 drops such claims only when a file is retired |
| WMM3-3 to WMM3-6, dependent child, disabled individual with its three prongs, parent, guardian | dependent-child-defined; disabled-individual-defined, ada-disability-definition, ada-disability-any-one-or-more-prongs; parent-defined; guardian-defined |
| WMM3-7, caretaker relative, and the States' option to extend the list | caretaker-relative-defined, caretaker-relative-other-relationships-at-state-option; the pointer to `state-options.md` dropped with the text |
| WMM3-8, family caregiver, built on the RAISE Family Caregivers Act (PL 115-119) | family-caregiver-defined; the public law number stays, cited to the preamble, 2026-11094.xml:781 (91 FR 33366) |
| WMM3-9, a family caregiver must also meet one of (c)(3)(i)(A) to (C) | family-caregiver-excluded-on-one-criterion; the printed cross-reference and the preamble conflict, an open question that parent-guardian-caretaker-relative-or-family-caregiver-excluded cites |
| WMM3-10, the table of (A), (B) and (C) | family-caregiver-living-with-care-recipient, family-caregiver-relative-living-apart, family-caregiver-unrelated-living-apart-80-hours |
| WMM3-11, more than one in a residence may qualify, aligned with SNAP | more-than-one-excluded-in-a-residence, whose Note puts the SNAP comparison at 91 FR 33370 (:909, :933); "It is commonly assumed only one person can be counted" and "Two consequences worth stating out loud" dropped as framing |
| WMM3-12, hours below 80 count as unpaid work, with the 55 plus 25 example | caregiving-hours-below-80-count-as-unpaid-work, whose Note quotes :443 on 91 FR 33355 |
| SR2-1, § 435.554(a) refers to the section, and no eligibility on the basis of disability is needed | disabled-individual-defined |
| SR2-2, the three prongs of (a)(1) | ada-disability-definition, with ada-record-of-impairment-defined, ada-regarded-as-having-impairment and ada-regarded-as-excludes-transitory-and-minor for the second and third |
| SR2-3, construed broadly | ada-disability-construed-broadly |
| SR2-4, any one or more prongs | ada-disability-any-one-or-more-prongs |
| SR2-5, HourKeep's question is narrower, and why | stays, as advice on HourKeep's screening, corrected: a "record of" impairment is a history of one that substantially limited a major life activity, or a misclassification as having one (35.108.xml:55), and "regarded as" turns on a prohibited action (:59) |
| SR3-1, the definition by 25 U.S.C. 1603 and 1679 and 42 CFR 136.12 | indian-defined-at-447-51 |
| SR3-2, the four routes | indian-defined-at-447-51 for 1, 3 and 4; urban-indian-criteria-at-447-51 for 2 |
| SR3-3, HourKeep's question misses Alaska Natives, second-degree descendants and State-recognized tribes | stays, as advice, corrected: State-recognized tribes count for a person who resides in an urban center (447.51.xml:14, :15); section 5's item 7, a copy, gained a dated line that 42 CFR 447.51 names State recognition only in its urban-center route, and that whether another route reaches such a person rests on 42 CFR 136.12 and 25 U.S.C. 1603, which are not stored |
| SR3-4, States may not reverify | stays inside SR3-3's advice; american-indian-excluded's Note quotes the preamble (:771, 91 FR 33366) |

Corrected in place, each quoting the old words and citing the stored line, as the Formats say:

- `rule-extract.md` subsection 4.2, (1): "Operative criteria:" became "Operative criteria, as the preamble reads the
  group (91 FR 33365-33366):", and "§ 435.554(c)(1) qualifier worth stating" became the preamble's qualifier, since
  the four criteria and "even if they meet the eligibility requirements for such group" are the preamble's (:762,
  :764), not (c)(1)'s words (:3668). The verification claims of 4.2 are § 435.557's, increments 2.2 and 2.6.
- `rule-extract.md` section 10: the caretaker relative parameter's "§ 435.554(a)(iv)" became "§ 435.554(a),
  caretaker relative (iv)", since (a) has no numbered paragraphs (:3634, :3642), and its copy in `state-options.md`
  the same way. Section 0 was checked against
  specified-excluded-individual-not-subject-to-community-engagement and needed no change.
- `what-matters-most.md` section 2, (c)(6): "(91 FR 33385)" became "(91 FR 33377)", the page of :1236.
- `what-matters-most.md` section 11: "A parent whose youngest child is 14 or older is an applicable individual,
  because § 435.554(c)(3) reaches only caregivers of a child 13 or under" corrected, since (c)(3) also reaches the
  parent of a disabled individual of any age (:3645, :3649, :3661, :3670, :905).
- `what-matters-most.md` section 13: "where (c)(3)(i) is meant" now says the preamble places the criteria at
  (c)(3)(i) (91 FR 33366), that reading it so is an inference, and that the two conflict, an open question.
- `supporting-regs/README.md` sections 2 and 3, as SR2-5 and SR3-3 say, and section 5's item 7, as SR3-3 says.
- After the review: `rule-extract.md` section 1's 44 jurisdictions line, as RE1-5 says; the skill's watch list item
  for Massachusetts v. Oz, whose "The case challenges the medically frail rules. The research names no row in this
  topic it would change" became that each topic holding a provision either suit challenges, in its complaint or
  motion, checks both dockets first (decision record 0007); and the Note of the Colorado draft 30 days question,
  whose first side moved to the `counts_from` of co: renewal-notice-with-renewal-form. Each is dated 2026-10-23 and
  cites the full review.
- After the review, added with a dated line: the plan's standing constraint on pointers says a passage whose
  remaining claims no row covers yet is pointed, with those claims kept after the pointer, as the Formats say.

Deviations from the plan:

- 62 rows, where decision record 0006 inferred about 31, under its limit of 64: 52 regulation rows, since (c)(3)(i)
  has its lead-in and a row each for (A), (B) and (C), 28 CFR 35.108 has 20 and 42 CFR 447.51 two; 9 preamble rows
  where the preamble adds to a rule; and 1 agency guidance row for L2-11.
- 28 CFR 35.108 was built with three rows, for (a)(1), (a)(2)(i) and (a)(2)(ii). The review found, as blocking,
  that the plan delivers rows for the section where § 435.554(a) incorporates it, which is the whole section. The
  orchestrator's call, for the owner: a row for every paragraph except the five that govern ADA title II claims and
  remedies or state its purpose, (a)(2)(iii), (d)(1)(ii), (d)(2)(i), (e)(3) and (f)(3), with a paragraph and its
  subparagraphs, or two paragraphs stating one rule, as one row. That added 17 rows and a group of the topic file.
- A fourth eCFR file, 42 CFR 400.200, which the plan does not name, stored after the review so
  urban-indian-criteria-at-447-51 can say which Secretary its last criterion means. That § 400.200's "unless the
  context indicates otherwise" leaves § 447.51's Secretary as HHS's is the row's reading, and its Note says so.
- The L2-11 row cites CMS's deck of 2026-07-27, slide 9, which is not stored, so it says `Verified: no`; increment
  2.6 stores the deck. It names no State, by decision record 0006's "Other states' values".
- No `.gitattributes` line was added: `docs/domain/sources/** -text` already covers the eCFR folder.
- § 435.554(c)(3) cites "paragraphs (c)(1)(i)(A) through (C)", which do not exist, and the preamble (:781) places
  the criteria at § 435.554(c)(3)(i). The row cites both and picks neither, the skill's Precedence names the
  conflict, and which governs is an open question.
- Four open questions this increment raised, from the review, each `Raised: 2026-10-23`: the (c)(3)
  cross-reference; how the regarded as prong of 28 CFR 35.108 applies to the disabled individual of the caregiver
  exclusion; whether the relationships a state adds to the caretaker relative definition count for a family
  caregiver who lives apart; and what household means in § 435.554(c)(7). There are 18 now.
- caregiving-hours-below-80-count-as-unpaid-work reaches into § 435.552(b), increment 2.4's, because
  `what-matters-most.md` section 3, pointed here, makes the claim.
- One correction no finding named: `what-matters-most.md` section 11's parent whose youngest child is 14 or older.
- `rule-extract.md` section 1 keeps the "June 2026" list, its State names and the seven out-of-scope States, marked
  Unverified. Their three unmarked copies, `rule-extract.md` section 11 (about lines 932 to 935),
  `what-matters-most.md` section 11 (about 640 to 643) and `state-options.md` (about 339 to 341), two of them citing
  KFF, wait for increment 4, since decision record 0006 does not apply a correction about another state that is not
  dangerous.
- The moved question on Colorado's SMD 26-001 path dropped its Montana research lead, since a moved question holds
  only `Moved` and the lead is about another state; ledger line 232 keeps it.
- In the topic file the group for § 435.554(c)(3) comes before the definitions it uses, so `START_HERE` follows the
  topic file's order, not the extract's.
- `ChoiceFactTest` is in `tests/test_choice_facts.py`, with `ChoicePairsTest`, where the plan names
  `tests/test_state_facts.py`, which is as at main.
- The choice line on the state facts page names both rows of the pair in words, each linked, then "The state's
  choice:" and the chosen row's words, `not published` or `not applicable`, where the plan has it name only the
  option the state takes, with a link to that row. `CHOICE_WORDS_BY_ROW` in `pages.py` went, unused.
- Generator and checker changes the plan does not name, each from the review, each with its fixtures and its sentence
  in the Formats: the topic page's orientation (`ORIENTATION` in `scripts/review_pages/constants.py`); a "Source, not
  stored yet:" line with the address for a Source written `not stored, <URL>`; the check of `CHOICE_PAIRS`; a failure
  for two topic files sharing a title; a message of its own for a `Moved` date that is no day; a state fact named
  after "The" or in backticks looked for.
- `SKILL.md` is 1,664 words by `split()`, past its target of about 1,500: the build left it at 1,498, and the review's
  fixes added the Precedence sentence on the (c)(3) conflict, the sentence on answering a person about their own
  case, and the watch list's wider docket duty.
- Three test files are past 300 lines and were not split: `tests/corpus_fixture.py` 502 (457 at main),
  `tests/test_review_pages.py` 506 (377) and `tests/test_skill.py` 439 (388). Most of their bulk predates this
  increment, so each waits for a refactor of its own, along its seam: in `test_review_pages.py`, `CitationLinkTest`
  and `RowWordsTest`, plain `unittest.TestCase` classes, could leave as `tests/test_review_links.py`; in
  `test_skill.py`, `SkillMainFileTest` and `TopicFileTest` are two files' worth; in `corpus_fixture.py` the valid
  corpus's texts and builders are one thing and the harness another, a weaker seam since every test imports both.
- For increment 3: `medicaid-work-requirements-cfa-service-blueprint.md` lines 53 and 105 say "Parent or guardian
  of someone with a disability", narrower than § 435.554(c)(3), which also excludes a caretaker relative or family
  caregiver of a disabled individual of any age (2026-11094.xml:3670). Decision record 0006 moves that file in
  increment 3 with its remaining ledger corrections, dated there.

Still unverified:

- Every check of the 62 rows, the 62 rule items, the four new open questions, the pointers and the corrections was
  made by an AI agent; no person with Medicaid policy knowledge has read them. The error directions of the 17 rows on
  28 CFR 35.108 are one session's reading of the Formats' definitions.
- Federal Register pages were read from the XML's `PRTPAGE` markers, not the rendered pages.
- The CMS deck (slide 9, L2-11) and the renew-info pages (L2-14) were read only through research L2; whether
  Colorado is among the deck's 8 States is unknown.
- Not stored or read, though rows cross-refer to them: 42 CFR 435.4, § 435.1010, 42 CFR 136.12, 25 U.S.C. 1603 and
  1679, 7 U.S.C. 2012(h) and 2015, SSA 407, 1902(e)(5) and (e)(16), 38 U.S.C. 1155.
- That 42 CFR 400.200 and 447.51 sit in one chapter rests on eCFR's ancestry API, queried once and not stored.
- Each eCFR file was fetched once; eCFR's title 28 paragraph fragment for links was not seen, the page request being
  redirected.
- That the Agent Skills specification counts description characters as `len()` does.
- The docket result is RECAP's copy only; PACER was not checked.
- Colorado's between-renewals fact is `not published`, where draft 8.100 lines 1361 to 1366 follow
  § 435.556(a)(2)(iii) and its part h has parts for application and redetermination only; that this leans toward no
  such check is inference, and a reviewer may read `inferred`.
- The pages' new orientation and choice line were not viewed in a browser or on GitHub; the mechanism check read the
  Markdown the generator makes.
- The 317 tests at main are a count of `def test_` lines there, not a run.

Review. The full review, on 2026-10-23, ran six mandates two at a time, each against its own source. The 45 rows and
their rule items against the stored sources, GPT-5.6 Sol: 1 blocking and 4 should fix. The checker, generator and tests
against the code, with 26 breaks in a clone of which 25 failed a test, Claude Opus 5.5: 1 should fix and 5 notes. The
corpus changes beyond the rows against the stored sources, the research and the decision records, Claude Opus 5.5: 4
should fix and 9 notes; its search of the Federal Register and eCFR found nothing published since 2026-10-16 that
changes a conclusion. A red team against the plan, decision records 0006 and 0007 and `docs/design.md`, GPT-5.6 Sol: 2
blocking and 7 should fix. A cold reader, as a policy expert on the pages, a fresh session and the next session,
GPT-5.6 Sol: 4 should fix and 3 notes. A do-it reviewer carrying out the plan's checks, the Formats and the README in a
clone, Claude Opus 5.5: 2 should fix and 4 notes. That is 46: 3 blocking, 22 should fix and 21 notes, six issues of them
raised twice, each confirmed against the files. The blocking ones were 28 CFR 35.108's missing paragraphs, raised by two
reviewers, whose 17 rows are the orchestrator's call above; and the fresh-session test, which had run before the
reviewers' briefs were written and was rerun after the fixes. The orchestrator added one from the first fresh-session
runs, that a session answering about a person's own case gave an estimate of it. Two findings were rejected: that the
fourth Colorado question should explain its moved part first, since decision record 0006 sets the order of its last two
sentences; and that the Formats should say which date of the June 3 printing a state fact gives as its `source_date`,
since no fact cites that printing yet and the two that cite the correction use its filing date as `federal.json` does.
One was taken in part: of the four test files past 300 lines, the one that grew by this increment's new tests was split,
and the seams of the other three are recorded above. All the rest were applied. The fixes then had two checks. Against
the sources and the decided list, GPT-5.6 Sol: 3 should fix, a rule item that gave the six-month limit to the regarded
as prong without its "and minor", four rows rated burdensome that could go wrong either way, now dangerous, and this
entry and the rerun not yet written; all three done. Against the code, with 26 breaks of which 24 failed a test,
Claude Opus 5.5: 5 notes, of which 4 were taken, a Formats sentence on the orientation's link to the open questions
page, a test of two Sources not stored, a blank line and a docstring, and 1 rejected, a test of the orientation's
default, which the checker's comparison of the real pages covers, as it does for `START_HERE`. The orchestrator also
corrected the manifest note of 42 CFR 400.200, which gave curl's compressed byte count as the file's size, and put the
plan's dated line on pointers into the epic design as well.

## 2.2 People who are medically frail or have special medical needs

### Delivers

- Before any row, the docket in Massachusetts v. Oz checked again, from where increment 2.1's check left it, and the
  docket in Taylor v. Kennedy, D. Md. 1:26-cv-03705, checked for the first time (decision record 0007), with the results
  in the Done entry and the skill's watch list. The outcome rule is increment 2.1's: an order on the provisions the
  cases challenge stops row work on them until the owner decides how to go on; none, and the work goes on, with each
  query, its date and RECAP's lag recorded in the Done entry.
- Rows for § 435.554(c)(5) and § 435.557(f), the second from the stored correction. About 23 rows, decision record
  0006's inference from 919 words of regulation text. § 435.557(f)(2), the privacy duty, covers data used to verify
  participation in a drug addiction or alcoholic treatment and rehabilitation program as well as medical frailty, so
  its rows also carry its share for § 435.554(c)(8), increment 2.1's exclusion, and say so.
- A decision, made before any row is drafted and recorded in the Done entry, on whether CMS's frailty deck that L2-8
  cites is stored and rowed. It is stored and rowed only for an operative claim that no higher source carries; the
  Done entry records the claim either way, and the higher source that carries it where one does. If it is stored, it
  is stored as served with a manifest entry and a `.gitattributes` line. L2-8 asks for a change to
  `state-options.md`'s schema only if that schema survives, and it does not, so no schema changes.
- The topic file `.kiro/skills/medicaid-community-engagement/references/medically-frail-or-special-medical-needs.md`,
  whose first line is `# People who are medically frail or have special medical needs`; its item under `## Topics` in
  `SKILL.md`, at about 25 words; and words in the skill's description for being medically frail or having special
  medical needs.
- The review page `docs/review/medically-frail-or-special-medical-needs.md`, listed on the landing page, and its
  start-here rows under the key `medically-frail-or-special-medical-needs`, chosen by decision record 0006's rule.
- Its 1 entry of `what-matters-most.md` section 12, "Medically frail means having a listed diagnosis", as a row or
  part of one, with the error quoted in the row's Note.
- Rows carrying the subject of the dangerous finding L8-4, that a state must develop a list of conditions and keep
  the request path for a condition not on it, which the fix before increment 2.1 corrected in place. The Done entry
  records these rows as coverage of that correction and does not list L8-4 as applied again. And L2-14's part on
  frailty described without the functional gate, as rows.
- L1-7, the third broken cross-reference, in § 435.554(c)(5)(ii)(A), added in `what-matters-most.md` section 13, with
  that section's broken cross-reference in § 435.554(c)(5)(ii) and its litigation paragraph corrected in place where
  the rows and the docket check say otherwise. The section is pointed in increment 2.7.
- Pointers, once its rows carry every claim: in `rule-extract.md`, subsection 4.2, "The ten exclusion categories",
  with increment 2.1's rows, and subsection 7.7, "Medical frailty verification and privacy"; in
  `what-matters-most.md`, section 4, "Medically frail".
- A row that relies on "reliable information available to the State" or "period of enrollment" quotes § 435.557(a)'s
  words from the stored correction in its Note and names the paragraph, as decision record 0006 has a forward
  reference handled.
- The inherited rows showing-requirement-does-not-apply, notice-says-how-to-show-not-applicable and
  adverse-notice-names-both-failures rechecked, since they name § 435.554 without excluding paragraph (c)(5), each
  given a dated `Corrected:` where a new row shows it says more or less than its source.

### Deliberately not

The other nine exclusions, which increment 2.1 wrote. § 435.557(a)'s definitions as rows, which increment 2.6 writes.
How Colorado shows medically frail status and when its documentation starts, which are Colorado facts for increment
4, and any other state's frailty documentation rules, which leave with `state-options.md`.

### Why this shape

§ 435.557(f) verifies the status § 435.554(c)(5) defines, so the two are reviewed together. Massachusetts v. Oz
challenges those rules, so a ruling reaches this one topic and holds up no other exclusion.

### How you know it worked

- `/usr/bin/python3 -m unittest discover -s tests` (3.9.6) and `/opt/homebrew/bin/python3 -m unittest discover -s
  tests` (3.14.6) both pass, each run as its own command.
- `scripts/check-corpus.py` exits 0 under both and prints its counts.
- `docs/review/medically-frail-or-special-medical-needs.md` exists and the checker compares it.
- Both docket results are in the Done entry and the watch list, each with the date it was checked.
- Each ledger finding this increment applies appears once in its Done entry, applied or rejected with a reason.
- A search of `docs/domain/` outside the stored sources and the research records finds each corrected claim's old
  wording only in its dated correction.
- The Done entry lists each paragraph in Delivers with the rows that carry it, or the reason it has none, and each
  claim of each passage pointed in `rule-extract.md` and `what-matters-most.md` with the row that now carries it.
- A fresh agent session is asked: "I have bipolar disorder. How does the state decide whether I'm medically frail, so
  the work requirement doesn't apply to me?" It runs, with no skill named, and a miss is handled, as in increment
  2.1. Its answer says that medically frail means both a condition that significantly impairs the person's ability
  to comply with the requirement and being in one of the groups § 435.554(c)(5)(i) lists, a disabling mental
  disorder among them; that the state must develop a list of conditions and have a process for a person whose
  condition is not on it to ask to be considered; and that the state first tries to verify the status from reliable
  information, claims from the preceding 12 months included, and that whether the person is excluded is the
  agency's determination, labeled Deferred, with the agency named. It cites by identifier the rows on
  § 435.554(c)(5)(i) and (ii) and § 435.557(f)(1), and says which skills it loaded.

### Needs from you

The owner's go before it starts, and the owner's decision on how to go on if either docket shows an order on the
provisions the cases challenge.

## 2.3 Exceptions for a month: mandatory exceptions, and optional short-term hardship exceptions

### Delivers

- Before any row on § 435.555(d)(2)(i) or (iv), which the Massachusetts v. Oz complaint names and its motion for summary
  judgment does not press, the dockets in Massachusetts v. Oz, D. Mass. 1:26-cv-12962, and Taylor v. Kennedy, D. Md.
  1:26-cv-03705, checked, under increment 2.1's outcome rule, with the results in the Done entry and the skill's watch
  list (decision record 0007).
- Rows for § 435.553, its opening paragraph and (a) and (b); § 435.555(a) to (f); and § 435.557(g), from the stored
  correction. A paragraph named takes its own text, the words before its first subparagraph included. About 41 rows,
  decision record 0006's inference from 1,623 words of regulation text.
- Any provision outside the rule that its rows rest on, stored as served with a manifest entry and a `.gitattributes`
  line. Decision record 0006 names none for this topic.
- The topic file
  `.kiro/skills/medicaid-community-engagement/references/mandatory-exceptions-and-short-term-hardship.md`, whose
  first line is `# Exceptions for a month: mandatory exceptions, and optional short-term hardship exceptions`; its
  item under `## Topics` in `SKILL.md`, at about 25 words; and words in the skill's description for exceptions for a
  month, mandatory exceptions and optional short-term hardship exceptions.
- The review page `docs/review/mandatory-exceptions-and-short-term-hardship.md`, listed on the landing page, and its
  start-here rows under the key `mandatory-exceptions-and-short-term-hardship`, chosen by decision record 0006's rule.
- Its 2 entries of `what-matters-most.md` section 12, each a row or part of one with the error quoted in the row's
  Note: citing the post-release exception as § 435.553(a)(5), and "Under 19 is an exclusion".
- Rows carrying the subject of the dangerous finding L8-3, the dependent's three prongs in § 435.555(b)(1), which the
  fix before increment 2.1 corrected in place. The Done entry records these rows as coverage of that correction and
  does not list L8-3 as applied again. And L2-14's part on Medicare, as rows.
- L8-19's automatic county hardship exception, which needs no information or impact test (§ 435.557(g)(2)(ii)), as a
  row.
- Pointers, once its rows carry every claim: in `rule-extract.md`, section 3, "Mandatory exceptions", section 5,
  "Optional short-term hardship exceptions", and subsection 7.8, "Mandatory exception verification"; in
  `what-matters-most.md`, section 2, "Who it applies to", with the rows of increments 2.1 and 2.2, and section 10,
  "Optional short-term hardship".
- Corrected in place where its rows say otherwise: `rule-extract.md` section 0, "The three-tier status model", pointed
  in increment 2.7. The parameters of `rule-extract.md` section 10 on its paragraphs become State elections of its
  rows.
- A row that relies on § 435.557(a)'s "reliable information available to the State" or "period of enrollment", or on
  § 435.557(b)(2) or (b)(4), which § 435.557(g)(1) applies, quotes the later paragraph's words from the stored
  correction in its Note and names the paragraph.
- The inherited rows showing-of-compliance-or-exception, notice-says-how-to-show-compliance,
  notice-gives-hardship-information-where-elected and adverse-notice-names-both-failures rechecked, for §§ 435.553
  and 435.555, each given a dated `Corrected:` where a new row shows it says more or less than its source.

### Deliberately not

Verification in general, § 435.557(a) to (c) and (e), which increment 2.6 writes. Colorado's hardship elections,
which are Colorado facts for increment 4, and other states' hardship elections, which leave with `state-options.md`.

### Why this shape

§ 435.557(g) verifies the exceptions of §§ 435.553 and 435.555, so all three are reviewed together. With this topic
the screen of exclusions and exceptions is complete, and what counts toward the requirement comes next.

### How you know it worked

- `/usr/bin/python3 -m unittest discover -s tests` (3.9.6) and `/opt/homebrew/bin/python3 -m unittest discover -s
  tests` (3.14.6) both pass, each run as its own command.
- `scripts/check-corpus.py` exits 0 under both and prints its counts.
- `docs/review/mandatory-exceptions-and-short-term-hardship.md` exists and the checker compares it.
- Each ledger finding this increment applies appears once in its Done entry, applied or rejected with a reason.
- A search of `docs/domain/` outside the stored sources and the research records finds each corrected claim's old
  wording only in its dated correction.
- The Done entry lists each paragraph in Delivers with the rows that carry it, or the reason it has none, and each
  claim of each passage pointed in `rule-extract.md` and `what-matters-most.md` with the row that now carries it.
- A fresh agent session is asked: "I was in the hospital for two weeks last month. Does that month still count
  against me for the work requirement?" It runs, with no skill named, and a miss is handled, as in increment 2.1.
  Its answer says that a short-term hardship exception for inpatient hospital care exists only where the state has
  elected the optional exception of § 435.555, so the answer is Conditional on that choice and names it; that for a
  hospital stay the person, or someone acting for them, requests the exception, and a state that offers it must give
  notice of how to request it and by when; and that the state must first try reliable information to verify the
  hospital care before asking the person for more. It cites by identifier the rows on § 435.555(a), (c)(2) and
  (d)(1) and § 435.557(g)(2)(i), and says which skills it loaded.
- Both docket results are in the Done entry and the watch list, each with the date it was checked.

### Needs from you

The owner's go before it starts, and the owner's decision on how to go on if either docket shows an order on
§ 435.555(d)(2).

## 2.4 Work, community service, work programs and school

### Delivers

- Rows for § 435.552(a) less (a)(6) and (a)(7), (b), (c), (d), and (e) less (e)(2). A paragraph named takes its own
  text, so (a) brings its general rule. About 26 rows, decision record 0006's inference from 1,036 words of
  regulation text.
- Any provision outside the rule that its rows rest on, stored as served with a manifest entry and a `.gitattributes`
  line. Decision record 0006 names none for this topic.
- The topic file `.kiro/skills/medicaid-community-engagement/references/work-service-programs-and-school.md`, whose
  first line is `# Work, community service, work programs and school`; its item under `## Topics` in `SKILL.md`, at
  about 25 words; and words in the skill's description for work, community service, work programs and school as ways
  to meet the requirement.
- The review page `docs/review/work-service-programs-and-school.md`, listed on the landing page, and its start-here
  rows under the key `work-service-programs-and-school`, chosen by decision record 0006's rule.
- Its 8 entries of `what-matters-most.md` section 12, each a row or part of one with the error quoted in the row's
  Note: "Work means paid employment"; "Unpaid internships don't count"; "Each activity needs 80 hours"; "Half-time
  school contributes hours toward 80"; "6 credit hours is half-time"; "Community service must be a 501(c)(3)";
  "Court-ordered service doesn't count"; and "Job training programs generally count".
- L2-19, the source of `what-matters-most.md` section 5's verification guidance named as the preamble at 91 FR 33400,
  applied as that passage becomes a pointer; and L8-19's auditable community service records, as a row.
- Pointers, once its rows carry every claim: in `rule-extract.md`, subsections 2.2, "Definitions", 2.3, "Enrollment
  status", and 2.4, "Less-than-half-time education hours"; in `what-matters-most.md`, section 5, "How the requirement
  is satisfied", except its subsection "Combination, and the income-to-hours proxy", which increment 2.5 points.
- Corrected in place where its rows say otherwise, and pointed in increment 2.5, which writes § 435.552(a)(6), (a)(7)
  and (e)(2): `rule-extract.md` subsections 2.1, "The seven pathways", and 2.5, "Combination of activities". This
  follows decision record 0006's rule that a passage becomes a pointer in the increment that writes the last row its
  claims need. The parameters of `rule-extract.md` section 10 on its paragraphs become State elections of its rows.
- The inherited rows notice-says-how-to-show-compliance and adverse-notice-names-both-failures rechecked for
  § 435.552's paragraphs in this topic, each given a dated `Corrected:` where a new row shows it says more or less than
  its source.

### Deliberately not

Income, § 435.552(a)(6), (a)(7), (e)(2), (f) and (g), with § 435.603 and the provisions outside part 435 that income
rests on, which increment 2.5 takes. How the state verifies hours, which increment 2.6 writes. Colorado's facts on how
hours are shown, which wait for increment 4.

### Why this shape

What counts comes after who is outside the requirement, in the order of HourKeep's screens: a school term, then the
pay stub's 80 hours, then logged hours. Income is split off into increment 2.5 because it rests on § 435.603 and six
provisions outside part 435 and carries 8 of the checklist's 28 errors; together the two would come to about 53 rows
by decision record 0006's figures.

### How you know it worked

- `/usr/bin/python3 -m unittest discover -s tests` (3.9.6) and `/opt/homebrew/bin/python3 -m unittest discover -s
  tests` (3.14.6) both pass, each run as its own command.
- `scripts/check-corpus.py` exits 0 under both and prints its counts.
- `docs/review/work-service-programs-and-school.md` exists and the checker compares it.
- Each ledger finding this increment applies appears once in its Done entry, applied or rejected with a reason.
- A search of `docs/domain/` outside the stored sources and the research records finds each corrected claim's old
  wording only in its dated correction.
- The Done entry lists each paragraph in Delivers with the rows that carry it, or the reason it has none, and each
  claim of each passage pointed in `rule-extract.md` and `what-matters-most.md` with the row that now carries it.
- A fresh agent session is asked: "I take 6 credit hours at community college and work about 30 hours a month. Does
  that meet Medicaid's work requirement?" It runs, with no skill named, and a miss is handled, as in increment 2.1.
  Its answer says that whether 6 credit hours is half-time is for the school to determine, not a fixed count; that
  enrollment at least half-time meets the requirement for the month on its own; and that if enrollment is less than
  half-time, each credit hour counts as 3 hours a week, times 4.33 weeks, and those hours are added to the work hours
  toward 80. It leaves whether the person met the requirement to the agency, labeled Deferred. It cites by
  identifier the rows on § 435.552(a)(4), (c), (d)(1) and (e), and says which skills it loaded.

### Needs from you

The owner's go before it starts.

## 2.5 Monthly income, income counted as work hours, and seasonal workers

### Delivers

- Rows for § 435.552(a)(6), (a)(7), (e)(2), (f) and (g); § 435.603(d), (e), (f), (h)(3) and (j)(1), where
  § 435.552(f)(2) and (g) incorporate them; and 26 U.S.C. 36B(d)(2)(B), 85, 6012(a)(1) and 45R(d)(5)(B), 29 U.S.C.
  206(a)(1)(C) and 29 CFR 500.20(s)(1). About 11 rows, decision record 0006's inference from 439 words of § 435.552,
  and about 16 more, its figure for the 10 paragraphs of § 435.603 and the 6 provisions outside part 435 that
  `what-matters-most.md` section 6 cites. The ratio behind the figures carries no rows on provisions outside the rule,
  so this topic may come in above them.
- Stored as served, each with a manifest entry, a `.gitattributes` line and the command that fetched it: eCFR XML of
  42 CFR 435.603 and 29 CFR 500.20, for one stated eCFR date; and, for 26 U.S.C. 36B, 85, 6012 and 45R and 29 U.S.C.
  206, the text their publisher serves.
- `supporting-regs/README.md` section 1, the § 435.603 extract, kept, and where it and the stored eCFR text of
  § 435.603 differ, the stored text governs, as the skill's Precedence has a stored source govern over any summary.
  Each of the five state options in its section 4 becomes a State election of a row where a row rests on its
  paragraph. The options on § 435.603(b) and (h)(2) fall outside this topic's paragraphs and get no row unless one of
  its rows rests on them.
- The topic file `.kiro/skills/medicaid-community-engagement/references/income-and-seasonal-work.md`, whose first line
  is `# Monthly income, income counted as work hours, and seasonal workers`; its item under `## Topics` in `SKILL.md`,
  at about 25 words; and words in the skill's description for monthly and household income, income counted as work
  hours, and seasonal workers.
- The review pages' citation links extended to the citations this topic introduces. 29 CFR 500.20 links once
  `CFR_PART` in `scripts/review_pages/constants.py` accepts title 29, as increment 2.1's change has it accept title
  28. A new `USC_PART` pattern there, for a citation of 26 or 29 U.S.C., links in `cite_part` in
  `scripts/review_pages/links.py` to the address the manifest records for the stored copy of that section, through
  `source_address`, as SMD 26-001 and Colorado's rule link today. Cases for 29 CFR 500.20(s)(1) and 26 U.S.C.
  45R(d)(5)(B) join `test_links_each_kind_of_part_and_leaves_the_rest_as_text` in `tests/test_review_pages.py`. The
  Formats under "The review pages" say a U.S.C. citation links to its stored copy and, in prose, stays text, as SSA
  1902 and Pub. L. 119-21 do today (`cite_in_text` links only CFR and Federal Register citations).
- The review page `docs/review/income-and-seasonal-work.md`, listed on the landing page, and its start-here rows under
  the key `income-and-seasonal-work`, chosen by decision record 0006's rule.
- Its 8 entries of `what-matters-most.md` section 12, each a row or part of one with the error quoted in the row's
  Note: "Only earned income counts"; "SSDI, unemployment, investment, and rental income don't count"; "Taxable
  interest and dividends count"; "The whole household's income counts"; "Money from family counts"; "Hours and income
  are either/or"; "Seasonal work means ≤ 6 months a year"; and "The 6-month seasonal average includes this month".
- L2-14's part on "earning at least $580 a month", where § 435.552(f)(2) uses household income, earned and unearned
  (research L2, finding 14), as rows. It corrects no file.
- Pointers, once its rows carry every claim: in `rule-extract.md`, subsections 2.6, "Monthly income", and 2.7,
  "Seasonal workers", and, with increment 2.4's rows, subsections 2.1, "The seven pathways", and 2.5, "Combination of
  activities", which leaves all of section 2 a pointer; in `what-matters-most.md`, section 6, on MAGI-based household
  income, and section 5's subsection "Combination, and the income-to-hours proxy". The parameters of `rule-extract.md`
  section 10 on its paragraphs become State elections of its rows.
- The inherited rows notice-says-how-to-show-compliance and adverse-notice-names-both-failures rechecked for
  § 435.552's paragraphs in this topic, each given a dated `Corrected:` where a new row shows it says more or less than
  its source.

### Deliberately not

Work, community service, work programs and school, which increment 2.4 wrote. How the state verifies income, under
§ 435.557, which increment 2.6 writes. Paragraphs of § 435.603 beyond those listed, unless a row rests on one. Any
figure for a person's household income: the rows say what the rule counts, and `docs/design.md` keeps household
income Deferred. Colorado's income-to-hours fact, which waits for increment 4.

### Why this shape

It finishes what counts toward the requirement, after increment 2.4's hours and school, with the household income
that `docs/design.md`, under "Proof, month by month", names as one of the two Deferred cases that matter most. It is
a topic of its own because it rests on § 435.603 and six provisions outside part 435 and carries 8 of the checklist's
28 errors, which would otherwise share a review page with the 8 on hours and school.

### How you know it worked

- `/usr/bin/python3 -m unittest discover -s tests` (3.9.6) and `/opt/homebrew/bin/python3 -m unittest discover -s
  tests` (3.14.6) both pass, each run as its own command.
- `scripts/check-corpus.py` exits 0 under both and prints its counts.
- `docs/review/income-and-seasonal-work.md` exists and the checker compares it, and each 26 U.S.C., 29 U.S.C. and
  29 CFR citation on it is a link.
- Each ledger finding this increment applies appears once in its Done entry, applied or rejected with a reason.
- A search of `docs/domain/` outside the stored sources and the research records finds each corrected claim's old
  wording only in its dated correction.
- The Done entry lists each paragraph in Delivers with the rows that carry it, or the reason it has none, and each
  claim of each passage pointed in `rule-extract.md` and `what-matters-most.md` with the row that now carries it.
- A fresh agent session is asked: "I do seasonal work and earn most of my money in the summer. In a winter month when
  I hardly work, can I still meet Medicaid's work requirement?" It runs, with no skill named, and a miss is handled,
  as in increment 2.1. Its answer says that a seasonal worker, as 26 U.S.C. 45R(d)(5)(B) describes one, meets the
  requirement for a month if their average monthly income over the preceding six months is not less than the federal
  minimum wage under 29 U.S.C. 206(a)(1)(C) times 80 hours; that the state determines that average from MAGI-based
  income, for the person's MAGI-based household as § 435.603 defines it; and that whether the person is a seasonal
  worker and whether their income is enough is the agency's determination, labeled Deferred, with the agency named.
  It cites by identifier the rows on § 435.552(g)(1) and (g)(2) and on 26 U.S.C. 45R(d)(5)(B), and says which skills
  it loaded.

### Needs from you

The owner's go before it starts. Nothing else, unless a site refuses automated requests, in which case a copy
downloaded in a browser.

## 2.6 How the state verifies: reliable information first, then what a person sends

### Delivers

- Before any row on § 435.557(a)(vii) or (a)(viii), the 12-month limits both suits challenge, the dockets in
  Massachusetts v. Oz, D. Mass. 1:26-cv-12962, and Taylor v. Kennedy, D. Md. 1:26-cv-03705, checked, under increment
  2.1's outcome rule, with the results in the Done entry and the skill's watch list (decision record 0007).
- Rows for § 435.557(a), (b), (c) and (e) from the stored correction; § 435.945(j) as the rule amends it; and
  § 438.58(b). About 42 rows, decision record 0006's inference from 1,679 words of § 435.557: 1,665 in paragraphs
  (a), (b), (c) and (e), and the 14 of the section's heading, which no other topic counts. The amendment to
  § 435.945(j) and § 438.58(b) are not in the word count.
- Stored as served, with a manifest entry, a `.gitattributes` line and the command that fetched it: CMS's IFC
  overview slide deck of 2026-07-27, which research L2 lists at
  https://www.medicaid.gov/medicaid/downloads/ce-requirement-ifc-deck.pdf, with its text extraction. Slide 47 is read
  before any row on L2-12's limits on plans; if the deck cannot be stored, that claim gets no row and is marked
  Unverified in place. Any other provision outside the rule that a row rests on is stored the same way.
- The topic file `.kiro/skills/medicaid-community-engagement/references/how-the-state-verifies.md`, whose first line
  is `# How the state verifies: reliable information first, then what a person sends`, and which opens by naming
  where the rest of § 435.557 is: (d), checks between renewals, in increment 2.7's topic file, (f), medical frailty,
  in increment 2.2's, and (g), the exceptions, in increment 2.3's; its item under `## Topics` in `SKILL.md`, at about
  25 words; and words in the skill's description for how the state verifies, from reliable information first and then
  from what a person sends, and when it may ask a person for proof.
- The review page `docs/review/how-the-state-verifies.md`, listed on the landing page, and its start-here rows under
  the key `how-the-state-verifies`, chosen by decision record 0006's rule. None of the 28 entries of
  `what-matters-most.md` section 12 falls to this topic.
- Rows carrying the subject of the dangerous finding L8-9, that the 56% verified from reliable information applies
  to applicable individuals due for renewal and that 8.8 million submit every 6 months (91 FR 33434), which the fix
  before increment 2.1 corrected in place. The Done entry records these rows as coverage of that correction and does
  not list L8-9 as applied again. With them, `what-matters-most.md`'s "Writing for people, not about the rule" item
  1, "Most people will not be asked for anything", as a row or part of one.
- Each row of increments 2.2 and 2.3 that quotes § 435.557(a), (b)(2) or (b)(4) in its Note, compared with this
  topic's rows on that paragraph. Any that says something different from them gets a dated `Corrected:` in the same
  change, and the Done entry lists each row compared.
- L8-12's splice in `rule-extract.md` section 7, at line 585 as the file stood at 70be85f, in subsection 7.2, "Ex
  parte first", repaired.
- L2-12's limits on plans, read against § 438.58(b) and the deck's slide 47. The ledger says "plans" and research
  L2's finding 12 says managed care plans. That the deck means managed care plans is an inference, from § 438.58
  sitting in the managed care part, until slide 47 is read.
- Pointers, once its rows carry every claim: in `rule-extract.md`, subsections 7.1, "Reliable information available
  to the State", 7.2, "Ex parte first", 7.3, "The January 1, 2028 hardening date", 7.4, "Submission", 7.5,
  "Sequencing rules", and 7.9, "Federal data services", and section 9's "Conflict of interest"; in
  `what-matters-most.md`, section 8, "Verification".
- Corrected in place where its rows say otherwise, and pointed later: `rule-extract.md` section 0, "The three-tier
  status model", pointed in increment 2.7, and section 11's burden estimate, pointed in increment 4;
  `what-matters-most.md` section 1 on § 435.557(b)(2)(ii), and section 11 on § 438.58(b), both pointed in increment
  2.8, and section 13's paragraph on what § 435.557(a) names, and "Writing for people" item 1, both pointed in
  increment 2.7. The parameters of `rule-extract.md` section 10 on its paragraphs become State elections of its rows.
- No inherited row: none of increment 1's rows names § 435.557(a), (b), (c) or (e), § 435.945 or § 438.58.

### Deliberately not

§ 435.557(d), checks between renewals, which increment 2.7 takes, and § 435.557(f) and (g), which increments 2.2 and
2.3 wrote, beyond a dated correction where one of their rows says something different from this topic's. Rows for the
deck's other slides, beyond those a row of this topic or of
increment 2.7 needs. Colorado's submission channels, which wait for increment 4. The other sections the rule amends,
§§ 435.907, 435.911, 435.912 and 435.916 among them, which increment 3 takes.

### Why this shape

Verification checks everything the topics before it define: the exclusions, the exceptions, the activities and
income. Increments 2.2 and 2.3 used its definitions as forward references, quoted from the stored correction, and
this topic compares those rows with its own once its own are written, so a different reading shows up here.

### How you know it worked

- `/usr/bin/python3 -m unittest discover -s tests` (3.9.6) and `/opt/homebrew/bin/python3 -m unittest discover -s
  tests` (3.14.6) both pass, each run as its own command.
- `scripts/check-corpus.py` exits 0 under both and prints its counts.
- `docs/review/how-the-state-verifies.md` exists and the checker compares it.
- The IFC deck is in `docs/domain/sources/MANIFEST.json`, or the Done entry says it could not be stored and the claim
  on plans is marked Unverified in place.
- Each ledger finding this increment applies appears once in its Done entry, applied or rejected with a reason.
- A search of `docs/domain/` outside the stored sources and the research records finds each corrected claim's old
  wording only in its dated correction.
- The Done entry lists each paragraph in Delivers with the rows that carry it, or the reason it has none, and each
  claim of each passage pointed in `rule-extract.md` and `what-matters-most.md` with the row that now carries it.
- A fresh agent session is asked: "Will I have to send the state pay stubs to prove I worked enough hours for
  Medicaid?" It runs, with no skill named, and a miss is handled, as in increment 2.1. Its answer says that the
  state must first try to verify from the reliable information available to it, payroll data and information from
  other state agencies among it, before asking the person for anything; that the person must not be required to
  provide documentation or other information unless the state could not verify it that way, including where it has
  no such information or what it has is not reasonably compatible with what the person told it; and that if the
  state does ask, it must accept information other than documentation where no documentation is reasonably
  available, and may not deny or end coverage only because the person cannot produce documentation that does not
  exist. Whether the state's information shows the person met the requirement is the agency's determination, labeled
  Deferred, with the agency named. It cites by identifier the rows on § 435.557(a)'s definition of reliable
  information available to the State, § 435.557(b) and (b)(2)(iii), and § 435.557(c)(1)(i), and says which skills it
  loaded.
- Both docket results are in the Done entry and the watch list, each with the date it was checked.

### Needs from you

The owner's go before it starts, and the owner's decision on how to go on if either docket shows an order on
§ 435.557(a)(vii) or (a)(viii). Nothing else, unless medicaid.gov refuses automated requests, in which case a copy of
the IFC deck downloaded in a browser.

## 2.7 Which months are checked, how often, and when the requirement starts

### Delivers

- Before any row on § 435.556(a)(1) or (2), which the Massachusetts v. Oz complaint names and its motion for summary
  judgment does not press, the dockets in Massachusetts v. Oz, D. Mass. 1:26-cv-12962, and Taylor v. Kennedy, D. Md.
  1:26-cv-03705, checked, under increment 2.1's outcome rule, with the results in the Done entry and the skill's watch
  list (decision record 0007).
- Before any row is written or edited, an inventory of the candidate rows on SMD 26-001 and on the statute, added to
  the figure below and recorded in the Done entry. If the topic would pass 64 rows, a new decision record splits it,
  as decision record 0006 requires, and no row is written until that record is accepted.
- Rows for § 435.556(a) to (d); § 435.557(d), from the stored correction; § 435.559(a) to (c); § 435.560(a) to (d);
  SSA 1902(e)(14)(L)(i); and § 435.915 as the preamble applies it. A paragraph named takes its own text, the words
  before its first subparagraph included, so § 435.557(d) brings its opening sentence. About 36 rows, decision record
  0006's inference from 1,435 words of regulation text. The statute and SMD 26-001 are not in that figure, so this
  topic may come in above it.
- Rows for the parts of SMD 26-001 that increment 1's four rows on it do not cover, on pages 3 to 13: who is in the
  adult expansion group, the
  whole-group test for coverage under a waiver and the partial-expansion demonstrations it leaves out (pp. 3 and 4);
  the treatment of other eligibility groups (p. 4); what the six-month renewals mean for community engagement, and the
  federal renewal requirements that still apply (pp. 5 and 6); applicants from 2027-01-01 (p. 6, Example 1); Examples
  2 to 5 (pp. 8 to 10) only where they say more than increment 1's rows on the two paths; households with different
  renewal schedules, movement between eligibility groups at renewal and coordination with other recertifications
  (pp. 10 to 12); application and renewal processing and fair hearing requests (p. 12); and the state plan amendment
  due 2027-03-31 (pp. 12 and 13). Its pages on IT system costs (p. 13) and its closing (p. 14) state no rule a person
  meets and get no rows.
- Sources: SMD 26-001 is stored already, at `docs/domain/sources/cms/smd-26-001.pdf` with its text. GovInfo's text
  of Public Law 119-21 is stored as served, with a manifest entry, a `.gitattributes` line and the command that
  fetched it. The rows on SSA 1902(e)(14)(L)(i) cite it, and increment 1's row on clause (ii),
  six-month-renewals-do-not-apply-to-exempt-american-indians-and-alaska-natives, has its five Sources repointed to it
  from the copy in `hr1/`. Increment 3 points the other Sources that cite `hr1/` at it and retires the copies. L2-12's
  part here rests on the IFC deck that increment 2.6 stores. Any other provision outside the rule that a row rests on
  is stored as served, with a manifest entry and a `.gitattributes` line.
- The topic file `.kiro/skills/medicaid-community-engagement/references/which-months-and-when-it-starts.md`, whose
  first line is `# Which months are checked, how often, and when the requirement starts`, and whose opening sentence
  names the good faith effort exemption, § 435.560, by those words; its item under `## Topics` in `SKILL.md`, at about
  25 words; and words in the skill's description for which months are checked, checks between renewals, six-month
  renewals and when the requirement starts.
- The review page `docs/review/which-months-and-when-it-starts.md`, listed on the landing page, and its start-here
  rows under the key `which-months-and-when-it-starts`, chosen by decision record 0006's rule.
- Its 1 entry of `what-matters-most.md` section 12, "Renewal months must be consecutive", as a row or part of one,
  with the error quoted in the row's Note.
- The inherited row notice-response-period given a dated addition to its Note quoting section 12's entry "You get 30
  days from the notice", which no row quotes today, so that increment 5, which draws its checklist from the rows'
  Notes, finds it once `what-matters-most.md` is retired.
- Rows carrying the subjects of the dangerous findings L2-3, the whole-group test for coverage under a waiver; L2-5,
  10 days' notice and hearing rights when a period shortens or a person moves into a six-month group, and the state
  plan amendment due 2027-03-31; and L3-9, Pub. L. 119-21 sec. 71107, which adds SSA 1902(e)(14)(L) for renewals
  scheduled on or after 2027-01-01, with the individuals SSA 1902(xx)(9)(A)(ii)(II) describes as the only exemption.
  The fix before increment 2.1 corrected the six-month text they concern in place. The Done entry records these rows
  as coverage of that correction and does not list L2-3, L2-5 or L3-9 as applied again.
- L2-20, § 435.557(d)(4), that excluded status is not checked again between scheduled renewals unless the state has
  information that it changed, applied in `state-options.md`'s schema at its line "a State may reverify more often".
  `rule-extract.md` subsection 7.6 already stated paragraph (d)(4) at 70be85f, so that passage needs only checking
  against the rows.
- L2-12's initial good faith effort exemptions, approved for 6 months at most (IFC deck slide 42), from the copy
  increment 2.6 stores; if it was not stored, the claim gets no row and is marked Unverified in place.
- Pointers, once its rows carry every claim: in `rule-extract.md`, section 0, "The three-tier status model", with the
  rows of increments 2.1, 2.3 and 2.6 and its own on § 435.556(c); section 6, "Assessing compliance"; subsection 7.6,
  "More frequent verification"; and section 9's "Implementation", "Good faith effort exemption" and "Renewal
  frequency". In `what-matters-most.md`: section 7, "Which months get assessed"; section 12, "The things most often
  gotten wrong", once all 28 entries are rows; section 13, "Known uncertainty", with its per-state dates dropped; and
  "Writing for people, not about the rule". Of that last, item 2 becomes this topic's rows, item 1 is increment 2.6's,
  and item 3 and the caution are rows already, with the caution's rule for copy in `docs/design.md` under "What may
  mean the rule does not apply".
- Corrected in place where its rows say otherwise, and pointed in increment 2.8: `what-matters-most.md` section 1 on
  §§ 435.559, 435.560 and 435.915, and section 11 on § 435.560. The parameters of `rule-extract.md` section 10 on its
  paragraphs become State elections of its rows.
- The inherited rows rechecked, each given a dated `Corrected:` where a new row shows it says more or less than its
  source: unable-to-verify-at-application, accept-applicant-declaration-of-noncompliance,
  notice-says-how-to-show-compliance and adverse-notice-names-both-failures, for § 435.556;
  more-frequent-check-notice-after-data-check and more-frequent-check-notice-after-information-request, for
  § 435.557(d); reschedule-2027-renewals-to-six-months, which names § 435.559(b) and (c); and
  six-month-renewals-do-not-apply-to-exempt-american-indians-and-alaska-natives, keep-scheduled-2027-renewals,
  first-path-period-not-shorter-than-six-months and shortened-renewal-period-needs-advance-notice, which share its
  subject. The open question "For the adult expansion group from 2027, which governs how often eligibility is renewed:
  the regulation's 12 months or the statute's 6?" is rechecked against the new rows.
- Where one of its rows sets out a new choice between two rows, the pair added to `CHOICE_PAIRS`, as decision record
  0006 has a later topic extend it.

### Deliberately not

The notice of noncompliance and its 30 days, which increment 1 wrote, beyond the Note on notice-response-period, and
renewals under § 435.916, which increment 3 takes with the other letters. The other Sources that cite `hr1/`, which
increment 3 repoints. A new answer to which of 12 months or 6 governs, which stays an open question for CMS.
Colorado's look-back months, its start date and its transition path, which are Colorado facts for increment 4. Other
states' implementation dates and early implementers, which are dropped at retirement. Outreach timing under
§ 435.561, which increment 2.8 writes.

### Why this shape

§ 435.557(d)'s checks between renewals sit here rather than with verification because § 435.559(c) ties an
enrollee's first check to their first renewal initiated on or after the state's implementation date, and six-month
renewals and SMD 26-001's two transition paths decide when that is. It follows verification, since its checks between
renewals are verification under § 435.557(d), and comes before outreach, whose notice explains the months.

### How you know it worked

- `/usr/bin/python3 -m unittest discover -s tests` (3.9.6) and `/opt/homebrew/bin/python3 -m unittest discover -s
  tests` (3.14.6) both pass, each run as its own command.
- `scripts/check-corpus.py` exits 0 under both and prints its counts.
- `docs/review/which-months-and-when-it-starts.md` exists and the checker compares it.
- GovInfo's text of Public Law 119-21 is in `docs/domain/sources/MANIFEST.json`, and no row whose Citation names SSA
  1902(e)(14)(L) has a Source in `hr1/`.
- notice-response-period's Note quotes "You get 30 days from the notice", with its date.
- The Done entry records the inventory of SMD 26-001 and statute rows, and the count it gave, before the first row.
- Each ledger finding this increment applies appears once in its Done entry, applied or rejected with a reason.
- A search of `docs/domain/` outside the stored sources and the research records finds each corrected claim's old
  wording only in its dated correction.
- The Done entry lists each paragraph in Delivers with the rows that carry it, or the reason it has none, and each
  claim of each passage pointed in `rule-extract.md` and `what-matters-most.md` with the row that now carries it.
- A fresh agent session is asked: "I'm already on Medicaid. When will the state first check whether I've met the
  work requirement, and which months will it look at?" It runs, with no skill named, and a miss is handled, as in
  increment 2.1. Its answer says that the requirement is a condition of eligibility for coverage from January 1,
  2027, unless CMS has granted the state a good faith effort exemption or the state chose to start earlier; that for
  a person enrolled on the state's start date, the state must verify compliance at their first renewal initiated on
  or after that date; and that the state checks 1 or more months, as its State plan says and whether or not
  consecutive, from the period since the person's last determination or renewal, or more often where it has chosen
  to check between renewals. Each date and month count is labeled Conditional on the state's choices, which it names,
  with the agency named as the one to ask. It cites by identifier the rows on § 435.559(a), (b) and (c),
  § 435.556(a)(2) and § 435.557(d), and says which skills it loaded.
- Both docket results are in the Done entry and the watch list, each with the date it was checked.

### Needs from you

The owner's go before it starts, and the owner's decision on how to go on if either docket shows an order on
§ 435.556(a), and the owner's acceptance of a decision record that splits the topic if the inventory shows it would pass
64 rows. Nothing else, unless GovInfo refuses automated requests, in which case a copy downloaded in a browser.

## 2.8 Outreach, and what states report to CMS

### Delivers

- Rows for §§ 435.561(a) to (e) and 435.562(a) to (e). About 29 rows, decision record 0006's inference from 1,170
  words of regulation text.
- Any provision outside the rule that its rows rest on, stored as served with a manifest entry and a `.gitattributes`
  line. Decision record 0006 names none for this topic.
- The topic file `.kiro/skills/medicaid-community-engagement/references/outreach-and-state-reporting.md`, whose first
  line is `# Outreach, and what states report to CMS`; its item under `## Topics` in `SKILL.md`, at about 25 words; and
  words in the skill's description for outreach letters about the requirement and what states report to CMS.
- The review page `docs/review/outreach-and-state-reporting.md`, listed on the landing page, and its start-here rows
  under the key `outreach-and-state-reporting`, chosen by decision record 0006's rule. None of the 28 entries of
  `what-matters-most.md` section 12 falls to this topic.
- Pointers, once its rows carry every claim: in `rule-extract.md`, section 9's "Outreach" and "Monitoring", which
  leaves all of section 9 a pointer; in `what-matters-most.md`, section 1, "The dates, and when the first check can
  come", with the rows of increments 2.6 and 2.7 and its claims about other states dropped, and section 11, "Scope,
  and hard limits on States", with the rows of increments 2.1, 2.6 and 2.7.
- Corrected in place where its rows say otherwise: `rule-extract.md` section 11's outreach timing, pointed in
  increment 4. The parameters of `rule-extract.md` section 10 on its paragraphs become State elections of its rows.
- `what-matters-most.md` retired, once every passage in it is a pointer; its header and "How to use this" go with it.
  A claim outside the epic's scope, about a state other than Colorado or about how to word HourKeep's copy, is
  dropped, and the Done entry says where each is kept: the ledger finding that checked it, `docs/design.md`, or git
  history. In the same change its entry leaves `OWN_FILES` in `scripts/corpus_check/constants.py`, the list in
  `tests/test_unlisted_files.py` and the list under "The checker" in the Formats, so a copy left behind fails as
  unlisted; the names and the counts of the corpus's own files under "Stored sources and the manifest" in the Formats,
  which on 2026-10-22 say "seven" and "six analysis files", lose it; and the skill's Precedence, which names it among
  the older analysis files, drops it.
- No inherited row: none of increment 1's rows names § 435.561 or § 435.562.

### Deliberately not

`rule-extract.md` and `state-options.md`, which increment 4 retires. Colorado's outreach letters and its English and
Spanish templates, which wait for increment 4. The skill's error checklist, which increment 5 assembles from the rows'
Notes. Any count of a state's reports to CMS: the rows say what a state must report, not what one has.

### Why this shape

Outreach comes last because an outreach letter starts no clock (`docs/design.md`, "The letter"), and § 435.561(c) has
the notice explain the exceptions, the exclusions, the months and the consequences, which the earlier topics define.
The last passages of `what-matters-most.md` to land are here, so the file is retired here.

### How you know it worked

- `/usr/bin/python3 -m unittest discover -s tests` (3.9.6) and `/opt/homebrew/bin/python3 -m unittest discover -s
  tests` (3.14.6) both pass, each run as its own command.
- `scripts/check-corpus.py` exits 0 under both and prints its counts.
- `docs/review/outreach-and-state-reporting.md` exists and the checker compares it.
- Every paragraph of §§ 435.550 to 435.563, 14 sections, is carried by at least one row or has a reason it has none,
  by the union of the paragraph lists in the Done entries of increments 2.1 to 2.8, with increment 1's rows for every
  paragraph of § 435.558. The Done entry gives the result and names each paragraph the union misses, and a search of
  the extract's Citation lines, whose result is in the Done entry too, finds each of the 14 sections cited.
- `docs/domain/cms-2454-ifc/what-matters-most.md` is gone, and `git grep what-matters-most` finds it in no Source line
  of a row, fact or question, and in no skill file, script or test.
- Each ledger finding this increment applies appears once in its Done entry, applied or rejected with a reason.
- A search of `docs/domain/` outside the stored sources and the research records finds each corrected claim's old
  wording only in its dated correction.
- The Done entry lists each paragraph in Delivers with the rows that carry it, or the reason it has none, and each
  claim of each passage pointed in `rule-extract.md` and `what-matters-most.md` with the row that now carries it.
- A fresh agent session is asked: "I got a letter from Medicaid about the new work requirement. What is the state
  supposed to tell me about it, and how?" It runs, with no skill named, and a miss is handled, as in increment 2.1. Its
  answer says that the state must tell the people § 435.561(a) describes about the requirement: first, three months plus
  the number of months it checks at application before the requirement starts; then, for anyone who enrolls between that
  first notice and the start, on enrollment; and after that periodically, such as each time they are determined or
  redetermined eligible at application, at renewal or after a change in circumstances; that the notice must explain how
  to comply, the exceptions and exclusions, how many months are checked at renewal and how often the state checks
  between renewals if it does, what not complying means for Medicaid and for the premium tax credit, and how to report a
  change; and that it comes by regular mail, or electronically if the person chose that, and in at least one other way,
  such as their online account, a phone call or a text message. Where the answer turns on the months the state checks or
  whether it checks between renewals, it labels that Conditional on the state's choice and names it. It cites by
  identifier the rows on § 435.561(a), (b), (c) and (d), and says which skills it loaded.

### Needs from you

The owner's go before it starts.

## 3. The statute and the supporting rules

### Delivers

- A short statute extract: Public Law 119-21 sections 71119 and 71107, and section 10102 for the SNAP questions. Its
  rows are statute rows under a topic of their own, citing GovInfo's text of the law, which increment 2.7 stores
  (decision record 0006).
- 7 CFR 273.7 and 273.24 stored, so the SNAP questions rest on stored text.
- The rules for the other letters a person may hold: renewal forms (§ 435.916), what a decision notice must say
  (§ 435.917), plain language and access for people with limited English or a disability (§ 435.905(b)), and
  electronic notices (§ 435.918).
- Besides § 435.916, the other sections the interim final rule amends that increment 1's rows lean on: §§ 435.907,
  435.911 and 435.912, the removal of § 435.919, and § 435.1200(e)(1), since those rows rest on §§ 435.907(a),
  435.911, 435.912(e)(3) and 435.1200(e) (decision record 0006).
- The provisions increment 1's rows rely on and nobody has read, stored as eCFR XML and carried as rows: 42 CFR
  431.201 (definitions, among them the date of action), 431.213 and 431.214 (the exceptions to 10 days' notice, and
  the 5-day notice), 431.10(c)(1)(ii) (hearings delegated to the Exchange), 435.930(b) (coverage until a person is
  found ineligible) and 435.952(d) (requests for information). Each row that names one says so in its Note.
  (Added 2026-10-19; full review 2026-10-19, red team 6.) § 431.213 includes its paragraph (d) as the interim final
  rule amends it (decision record 0006).
- `supporting-regs/README.md` without its v1 notes, meaning its section 5 and the lines in its header and section 1
  that name v1's PRD, steering doc and waves, and with a fresh eCFR snapshot. In the same change, L8-12's "until
  October 1, 2034" and L8-13's snapshot age are corrected there. Its sections 1 and 4 stay with the § 435.603
  extract.
- The two Code for America summaries moved to `docs/domain/prior-art/` with a note that they predate the rule (research
  L8-14), and each error already found in them given a dated correction. The Medicaid summary's line 68 says "meeting"
  SNAP rules where the test is being subject to them; the SNAP summary's line 51 says "18 or younger" where the statute
  says under 18; and the ledger finds six more lines in the Medicaid summary that conflict with the rule or the statute
  (research L8-10, L3-12). Of those six, the fix before increment 2.1 corrects first the four L8-10 rates dangerous,
  lines 17, 52, 58 and 104 as the file stood at 70be85f; L8-10's line 214 and L3-12's line 277 are corrected at the
  move. The summaries' entries in `OWN_FILES` become their `prior-art/` paths in the same change, and so do the two old
  paths in the list in `tests/test_unlisted_files.py`. If the prior-art note is a file of its own, it gains an entry in
  `OWN_FILES` and in that list, or the checker fails it as unlisted.
- `hr1/HR1-Impact-Summary.md` retired. Its claims become statute rows or go with the file, L8-11's included, and the
  Done entry says which. In the same change its entry leaves `OWN_FILES` in `scripts/corpus_check/constants.py`, the
  list in `tests/test_unlisted_files.py` and the list under "The checker" in the Formats; the names and the counts of
  the corpus's own files under "Stored sources and the manifest" in the Formats lose it; and the skill's Precedence,
  which names it among the older analysis files, drops it.
- The statute extract made from GovInfo's text of Public Law 119-21, which increment 2.7 stores as served, and the
  other 15 files in `hr1/` retired once this increment has pointed every Source that still cites `hr1/` at GovInfo's
  text: 14 reformatted copies of the law
  (`119hr1enr.md`, `119hr1enr-toc.md` and the 12 `119hr1enr-title*.md` files for titles 1 to 10, title 7 in three
  parts) and a list of its sections that touch HHS, `119hr1enr-hhs-sections.md`. On 2026-10-22, 25 lines of the
  extract and 2 of `open-questions.md` named `hr1/119hr1enr-title7-part3.md`, 19 and 1 of them Source lines.
  Increment 2.7 repoints 5 of the 19, the Sources of increment 1's row on clause (ii), so this increment repoints the
  other 14 and the one in `open-questions.md`. The two
  eCFR text files in `supporting-regs/` retired once eCFR XML of their sections is stored and nothing cites them;
  increments 2.1 and 2.5 store four of those sections first (42 CFR 435.119, 28 CFR 35.108, 42 CFR 447.51 and
  42 CFR 435.603), and this increment stores the rest. On 2026-10-22, 2 lines of the extract, neither a Source
  line, named `supporting-regs/42cfr-supporting-sections.txt`.
- The two Code for America blueprint PDFs,
  `blueprint-pdfs/Medicaid-Work-Requirements-Service-Blueprint-–-Code-for-America-11x17-1.pdf` and
  `blueprint-pdfs/SNAP-Work-Requirements-Service-Blueprint-–-Code-for-America-11x17-1.pdf`, replaced by links in the
  prior-art note, unless Code for America's terms allow keeping copies. Neither PDF states a license.
- Each stored copy retired here loses its entry in `docs/domain/sources/MANIFEST.json` and its line in
  `.gitattributes` in the same change, and no row, fact or question cites it after.
- The lines that point at v1's files fixed. Decision record 0001 counted 32 on 2026-10-16; the pattern check below is
  the measure.
- `README.md`, "What is here", fixed where this increment makes it untrue: it names the two summaries as prior art,
  and, if the blueprint PDFs give way to links, it no longer says the folder holds Code for America's service
  blueprints.

### Deliberately not

New SNAP rules, and extracts of the parts of Public Law 119-21 that HourKeep does not rely on.

### Why this shape

It removes the secondary sources that carried the oldest errors, once the extract no longer needs them.

### How you know it worked

`/usr/bin/python3 -m unittest discover -s tests` (3.9.6) and `/opt/homebrew/bin/python3 -m unittest discover -s tests`
(3.14.6) both pass, each run as its own command, and `scripts/check-corpus.py` exits 0 under both, each by its path.
No file in `docs/domain/` outside the stored sources and the research records names a v1 decision record, wave,
steering file or `src/` path. Each retired or moved file appears in the Done entry with where its content went, against
the decision record.

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

Every Colorado fact marked `not published` or `inferred`, those increments 2.1 to 2.8 wrote included, is rechecked
against every Colorado source this increment stores, and its note gains the recheck's date and result. A fact a newly
stored source answers takes that source's words and its status changes, with the old value in the note.

The Colorado findings of Ledgers A and B, each named in the Done entry with the facts or rows it produced, or why it
produced none. Where a fact is named here by the row it attaches to, the row is this plan's reading of which paragraph
carries the subject, an inference the Done entry confirms or corrects. A fact taken from the draft rule says in its
`setting` that the draft is not adopted, as Colorado's fact on renewal-notice-with-renewal-form does.

- L5-8, dangerous for the cap: two facts from the draft rule, stored since increment 1
  (`10-ccr-2505-10-8.100-draft-2026-09-28.txt` lines 1691 to 1696, and 1723 to 1724). On increment 2.4's row for
  § 435.552(d)(1), Colorado rounds the monthly hours from credit hours up to the nearest whole hour. On its row for the
  state programs in § 435.552(b)'s definition of work program, job search in a state workfare or training program
  counts for at most 39 hours a month.
- L5-9, dangerous: a fact on increment 2.7's row for § 435.556(a)(1), the months checked at application, that for a
  requested retroactive month HCPF reviews the month before it, from HCPF's FAQ, under "What is a mandatory exception"
  (research L5, section 7), stored with its retrieval date. Its note says the interim final rule has no line on
  retroactive coverage (research L5-9, counted).
- L5-1: no fact. The draft rule is stored already, and the watch list's item for the Medical Services Board's dates
  cites page 30 of the deck this increment stores in place of the research.
- L5-2: the facts for Colorado's months checked at application (the month before) and at renewal (1 calendar month
  since the last renewal deadline), the income-to-hours proxy, attestation in 2027, veterans shown by a VA
  determination, and 6-month renewals, each on the row of the topic that carries its paragraph, from the draft rule
  and HCPF's FAQ, timeline and letter, each stored. The ledger did not recheck more-frequent checks or the 12-month
  frailty exclusion, so each is read in a stored source before a fact rests on it.
- L5-3: no new fact. Increment 1 applied it in `state-options.md` and wrote the inferred fact on
  renewal-notice-with-renewal-form, which increment 2.1 gives its `choice`; this increment rechecks that fact with the
  others marked `inferred`.
- L5-12, burdensome: facts on increment 2.2's rows for § 435.557(f) naming the data Colorado counts as showing medical
  frailty: SSI, SSDI, long-term services and supports, and a facility stay now or in the past 3 months, from HCPF's
  FAQ, stored. The ledger did not re-open the HIE plan or Worksheet J, so neither is cited until it is read in a
  stored copy.
- L5-16 with L6-11: the English and Spanish letter templates, stored with their text extractions, which source the
  renewal fact under L5-2 beside the draft rule. The 12-PDF count and the 377,000 figure, which the ledger did not
  recheck, go into no fact.
- L5-18, dangerous: no new fact. Increment 1's three Colorado facts on appeals and its open question on the 10 days
  carry the 60 days and the 10 days, from the stored rule and the stored appeals page. The page's line that a
  first-time applicant gets no continuation of benefits (`hcpf-appeals-2026-10-17.html` line 1151) is checked against
  those facts' settings, each "for a member", and gets a fact of its own only if they do not carry it.
- L5-21: no fact. No Colorado fact rests on HCPF's key changes page, the member FAQ's expectation of federal guidance
  by June 2026, the February Worksheet J draft, or the September worker sheet's list of veterans, which omits TDIU,
  since each predates the rule or disagrees with the draft rule. The facts cite the draft rule, HCPF's page of
  September 23, 2026 and the final forms instead, as research L5 finding 21 says.

Colorado's values in `state-options.md`'s tracker move into `co.json`, and its federal default profile into
`federal.json`. The values the research checked for other states go into no facts file: each is dropped when the file
is retired and stays in the research records, and the Done entry names, state by state, the ledger findings that
checked it (decision record 0006). L4-8, L4-12, L4-16 and L4-17 with L8-5, about other states and not dangerous, are
not applied and go with their files. Of the ledger's states to add, Colorado's values go into `co.json` from its
stored sources, and the rest stay in the ledger. "Open data gaps" goes to `open-questions.md` where a gap asks about
the federal rule or Colorado, and is dropped otherwise. "Why this exists" and "How to add a State" are retired, since
the Formats' "State facts" says how a state is added, and the schema stays in history on `experiment-1`. Then the file
is retired.

The last sections of `rule-extract.md` become pointers, and that file is retired too: section 10, its state-configurable
parameters, once each is a row's State election and its column of assumptions has given way to `federal.json`; section
11, the implementation landscape, with Colorado and the federal default in the state facts and other states' values
dropped, kept in the research records; and section 12, its open questions to track, into `open-questions.md` or the rows
that answer them. The open policy questions go into `docs/domain/open-questions.md`, each with who can answer it.

With `state-options.md` gone, the opening line of `supporting-regs/README.md` section 4 and its count of tracked
parameters, both of which refer to that file, go too. In the change that retires each of the two files, its entry leaves
`OWN_FILES` in `scripts/corpus_check/constants.py`, and `state-options.md`'s leaves the list in
`tests/test_unlisted_files.py`; both leave the list under "The checker" in the Formats, and the names and the counts of
the corpus's own files under "Stored sources and the manifest"; and the skill's Precedence, which names both among the
older analysis files, drops them. With the last analysis file gone, `README.md`'s "What is
here" no longer says `docs/domain/` holds "analysis written for this project". `tests/corpus_fixture.py` uses
`rule-extract.md` as its `ANALYSIS` file, so `ANALYSIS` becomes `docs/domain/supporting-regs/README.md`, an own file
that stays at its path to the end of the epic, and `ANALYSIS_TEXT` keeps its third line, which tests quote. Every test
that spells out `rule-extract.md`'s path, on 2026-10-22 in `tests/test_manifest_files.py` and
`tests/test_unlisted_files.py`, takes the README's path in the same change. So does the one spelled in other case,
which a case-sensitive search misses: `"docs/domain/CMS-2454-IFC/Rule-Extract.md"`, line 61 of
`tests/test_manifest_files.py`, becomes the README's path in other case, such as
`docs/domain/Supporting-Regs/readme.md`, so it stays a spelling of the file `ANALYSIS` names and its subtest still
tests the case-folding its comment describes.

(Added 2026-10-21. HCPF's board deck of 2026-09-28, which research L5 cites for the board's dates at deck page 30, is
not stored; its Drive address is at `docs/domain/research/2026-10-16-policy/L5-colorado.md` line 46. A copy is kept
outside the repository at `.agents/policy-research-2026-10-16/scratch-L5/rule-deck-2026-09-28.pdf` in case that link
moves. This increment stores the deck as a source, from that copy or fetched again.) It is stored as
`docs/domain/sources/colorado/hcpf-rule-deck-2026-09-28.pdf`, with its text extraction beside it (decision record
0006).

### Deliberately not

Maintaining any state other than Colorado.

### Why this shape

The design phases states in, starting with Colorado. Colorado's rule is a draft due before its Medical Services Board on
November 27, 2026, and the research found its hardship and seasonal-income positions still open (research L5,
findings 10 and 11), so its facts need a recheck date in the watch list, and some will be `not published`.

### How you know it worked

`/usr/bin/python3 -m unittest discover -s tests` (3.9.6) and `/opt/homebrew/bin/python3 -m unittest discover -s tests`
(3.14.6) both pass, each run as its own command, and `scripts/check-corpus.py` exits 0 under both, each by its path.
Every Colorado fact shows its source, its retrieval date, and whether it comes from the draft rule. Every Colorado fact
marked `not published` or `inferred` names in its note the recheck against this increment's stored sources and its
date, and the Done entry lists each such fact with its result. Each Colorado finding named under Delivers appears in
the Done entry with the facts or rows it produced, or why it produced none. The checker's list of the corpus's own
files names no retired file, and every file left in `docs/domain/` is a stored source in the manifest, the extract, a
state facts file, the open questions, the § 435.603 extract, a research record or prior art marked as predating the
rule.

### Needs from you

Whether to keep the other states' checked-once values in the facts files, as proposed, or leave them in the research
records. (Decided 2026-10-22 by the owner: they are not moved into the facts files. They leave with `state-options.md`
and stay in the dated research records, as decision record 0006 records.)

## 5. The domain skill, complete

### Delivers

The skill with all its rows, the number labels, CMS's vocabulary in English and Spanish, with the Spanish renderings
the research found wrong (research L5-19), the error checklist and a dated watch list. Under L5-19 the vocabulary's
entry for half-time quotes "al menos a tiempo parcial" from page 3 of Colorado's Spanish letter, which increment 4
stores, as a rendering that reads as part-time and so blurs half-time with less than half-time; the entry says that
reading is the research's, not a native speaker's (ledger L5-19). The vocabulary takes in the
terminology note in the header of `rule-extract.md`, which increment 4 retires, so it is read from git history. The
error checklist is a list in the skill naming each error this corpus has made and the row that corrects it, drawn from
the rows' Notes, where increments 2.1 to 2.8 quote the entries of `what-matters-most.md` section 12 that their rows
correct, and from errors found after 2026-10-16 (decision record 0006). The watch list holds the Massachusetts v. Oz
hearing on October 22, 2026, Taylor v. Kennedy, the IRS proposed rule open for comment until November 30, 2026,
Colorado's rule, SNAP's pending rule, and the next eCFR check.

### Deliberately not

App code, and any change to `AGENTS.md`'s four rules, which the skill may sharpen and may not loosen.

### Why this shape

The skill is what every later session reads, so it comes last, from a corpus that is already checked.

### How you know it worked

`/usr/bin/python3 -m unittest discover -s tests` (3.9.6) and `/opt/homebrew/bin/python3 -m unittest discover -s tests`
(3.14.6) both pass, each run as its own command, and `scripts/check-corpus.py` exits 0 under both, each by its path.
A fresh session given five questions from the error checklist loads the skill without being told to, as in increment
1, and answers each with the right citation and the row's identifier. The questions are written before the session
runs.

### Needs from you

Nothing.
