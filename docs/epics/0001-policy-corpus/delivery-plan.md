# Epic 0001 delivery plan: a policy corpus HourKeep can rely on

Status: In progress, since 2026-10-17. What the epic changes and why, and the formats every increment uses, are in
`design.md` beside this file.

- [x] 1. One topic, all the way through
- [x] 2.1 Who the requirement applies to, and who is excluded from it
- [x] 2.2 People who are medically frail or have special medical needs
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

(Revised on 2026-10-29, before any of its work began, after Massachusetts v. Oz was decided that day, as decision
record 0013 records. The section as first written is at commit 5684f66.)

### Delivers

- The docket check that decision record 0007 sets, run on 2026-10-29 through CourtListener's search API. Massachusetts
  v. Oz, D. Mass. 1:26-cv-12962, was decided that day: entry 147, the memorandum and order on the cross-motions for
  summary judgment; entry 148, the order of vacatur and enjoinment; and entry 149, the judgment, which dismissed the
  case. Taylor v. Kennedy, D. Md. 1:26-cv-03705, checked for the first time, holds no order on a challenged provision.
  The owner decided how to go on the same day: this section as revised. Each query, its time and RECAP's lag go in the
  Done entry and the result in the skill's watch list, and both dockets are checked again before the Done entry, for an
  appeal, a stay or a new order.
- The three orders stored as sources, each a PDF with its text extraction, under `docs/domain/sources/courts/`, with
  manifest entries and the command that fetched each from CourtListener's RECAP archive.
- Decision record 0013 carried out: a sentence in the epic design under "What has to be true of every rule", the
  folder `courts/` among the Formats' publishers, and an item in the skill's Precedence.
- Rows that say what is in force after the ruling, as decision record 0013 sets out:
  - § 435.554(c)(5) and (c)(5)(i) as printed, and a `court` row for the vacatur of the phrase "whose physical,
    mental, or other behavioral health condition significantly impairs the individual's ability to comply with the
    community engagement requirement in this subpart and is an individual" and the injunction, quoting entry 148 and
    citing entry 147's reasoning, that the five groups the statute names are a floor CMS had no authority to narrow.
    Its Note names the preamble statements that explain the vacated phrase, 91 FR 33373 among them, which no row
    carries.
  - (c)(5)(i)(A) to (E), each as printed: (B) keeps its stable recovery, which Taylor v. Kennedy still challenges, and
    (D) its activities of daily living, which the statute itself sets.
  - (c)(5)(ii) and (ii)(A) to (C): the list of conditions the state must develop, keep auditable and revise, and the
    process for a person whose condition is not on it to ask to be considered.
  - § 435.557(f)(1), (i), (ii), (ii)(A), (ii)(B) and (iii), from the stored correction and as written, each Note saying
    that the court upheld the 12-month window and the limit of one sworn statement per period of enrollment, and that
    Taylor v. Kennedy still challenges both. § 435.557(f)(2), the privacy duty, naming each law it lists, none of them
    stored, as its Note says; it also covers data used to verify participation in a drug addiction or alcoholic
    treatment and rehabilitation program, so its rows carry that share for § 435.554(c)(8), increment 2.1's exclusion,
    and say so.
  - A `court` row for the six months, quoting entry 148(c), which bars CMS from penalizing the plaintiff states for any
    errors or delays in implementing the rule for six months from the order, and entry 147's pages 15 and 16, which
    describe a stay of enforcement for decisions on medical frailty, and picking neither.
  - Preamble rows where the preamble adds to a provision still in force, such as its examples of disabling mental
    disorders, moderate or severe bipolar disorder among them (91 FR 33375), and that missing claims cannot defeat the
    exclusion (91 FR 33406). None rests on the vacated phrase.
- SSA § 1614, which § 435.554(c)(5)(i)(A) incorporates for "blind or disabled", stored as govinfo serves 42 U.S.C.
  1382c in the United States Code's latest edition, with its command. Rows for § 1614(a)(2), blindness, and for each
  paragraph of § 1614(a)(3) that can reach a person aged 19 to 64, with a paragraph and its subparagraphs, or two
  paragraphs stating one rule, as one row. The build lists the cut, likely (C) and (I), which concern children, and
  (F), which reaches only people found disabled under a state plan for December 1973, in the first row's Note, and the
  review checks it.
- Three open questions: whether the vacatur reaches the states that did not sue, in CMS's practice, since entry 148
  limits only its injunctions to the plaintiffs and CMS has said nothing; which of entry 148(c) and entry 147 describes
  the six months; and the cross-reference of § 435.554(c)(5)(ii) and (ii)(A) to "paragraphs (a)(5)(i)(A) through (E)",
  which do not exist, where the preamble names § 435.554(c)(5)(i)(A) through (E) (ledger L1-7).
- CMS's frailty deck, "Implementing Medical Frailty Under Community Engagement", stored as medicaid.gov serves it, a
  33-page PDF with its text extraction under `docs/domain/sources/cms/`, with a manifest entry and the command that
  fetched it; no `.gitattributes` line, since `docs/domain/sources/** -text` covers the folder. Agency guidance rows
  only for its three claims that no higher source carries and that do not rest on the vacated phrase: checking first
  the exclusions a state can see in its own records (page 10); the documents a state may seek when its data are not
  enough (page 20); and stable recovery as 5 or more consecutive years, where the regulation says 5 or more years
  (page 31). The Done entry records the deck's other operative claims and the higher source of each. Its three tiers
  get no row, since tiers 1 and 2 are defined by the vacated phrase (page 12), and its anticipated five-year lookback
  goes on the watch list as CMS's intention (page 31). This applies L2-8.
- The topic file `.kiro/skills/medicaid-community-engagement/references/medically-frail-or-special-medical-needs.md`,
  whose first line is `# People who are medically frail or have special medical needs`; its item under `## Topics` in
  `SKILL.md`, at about 25 words; and the skill's description rewritten as the owner approved on 2026-10-29, at 798
  characters, with room for the six topics after this one.
- The review page `docs/review/medically-frail-or-special-medical-needs.md`, listed on the landing page, its start-here
  rows under the key `medically-frail-or-special-medical-needs`, chosen by decision record 0006's rule, and an
  orientation that names the ruling. Citations of SSA § 1614 link to their official text, with a case in
  `CitationLinkTest`, as increment 2.1 did for 28 CFR.
- Its 1 entry of `what-matters-most.md` section 12, "Medically frail means having a listed diagnosis", as a row or part
  of one, with the error quoted in the row's Note. A state's list identifies people, it does not define the exclusion,
  and a person whose condition is not on it can ask to be considered. The rebuttal the file gives, a two-part test with
  a functional gate, is corrected in place, dated, citing the stored order.
- Rows carrying the subject of L8-4, that a state must develop a list of conditions and keep the request path, which
  the fix before increment 2.1 corrected in place. The Done entry records them as coverage and does not list L8-4 as
  applied again.
- L2-14's frailty part, which called CMS's beneficiary pages dangerous for leaving out the functional gate, applied in
  the direction the ruling sets: after it, leaving the gate out is right, and the rows say so. The Done entry records
  the reversal.
- L1-7, the third broken cross-reference, in § 435.554(c)(5)(ii)(A), added in `what-matters-most.md` section 13, with
  that section's broken cross-reference in § 435.554(c)(5)(ii) and its litigation paragraph corrected in place. The
  section is pointed in increment 2.7.
- Pointers, once its rows carry every claim: in `rule-extract.md`, subsection 4.2, "The ten exclusion categories",
  with increment 2.1's rows, and subsection 7.7, "Medical frailty verification and privacy"; in `what-matters-most.md`,
  section 4, "Medically frail".
- Corrected in place, each dated and citing the stored order, where a passage states the gate or a litigation state
  the ruling ends: `rule-extract.md` section 11; in `what-matters-most.md`, section 2's table row for (c)(5), section
  4's heading, which a pointer keeps, and its litigation paragraph; the `interpretiveRisk` comment of
  `state-options.md`; the skill's watch list; and in `docs/design.md`, the
  sentence under "What has to be true" naming both suits and, under "What may mean the rule does not apply", the
  proposed tap statement "a health condition that makes work hard", which the ruling makes narrower than the rule.
  The Done entry lists each passage corrected. (Corrected 2026-10-29: said "Research B's inventory of 2026-10-29
  lists each passage."; full review 2026-10-29, corpus against source N6.)
- The watch list: the time to appeal, for any party, to 2026-12-28 (Corrected 2026-10-29: said "the government's time to
  appeal"; full review 2026-10-29, corpus against source S3.); any request to stay; a supplemental interim final rule,
  which the government told the court CMS was likely to issue if the court vacated (entry 142, page 19); govinfo's copy
  of entry 147 (Added 2026-11-04: govinfo published it as granule USCOURTS-mad-1_26-cv-12962-1, its copy is stored as a
  source of its own in docs/domain/sources/govinfo/, and the item is out of the watch list; decision record 0013.); the
  end of the six months, 2027-04-29 by HourKeep's count, since neither document gives a date; Taylor v. Kennedy's
  cross-motion, due 2026-11-03, and its last brief, due 2026-12-02; CMS's response, such as a revised deck; and the
  proposed submission of updated language of Colorado's draft 8.100 to its Medical Services Board on 2026-11-27
  (Corrected 2026-11-04: said "Colorado's Medical Services Board on 2026-11-27, whose draft 8.100"; ledger L5-1.), a
  draft that adds its own condition, "special medical needs that cause significant impairment to work, volunteer, or
  attend school" (draft lines 1213 and 1214).
- Increments 2.3, 2.6 and 2.7 each gain a dated line: the Massachusetts case was decided and dismissed on 2026-10-29,
  so its check looks for an appeal, a stay or a new order, and Taylor v. Kennedy's docket is checked as before.
  Increment 2.6's says the court upheld § 435.557(a)(vii) and (a)(viii). Increment 4's Colorado facts on how medical
  frailty is shown are read against the adopted rule and the injunction, and increment 5's watch list sentence names
  the ruling.
- A row that relies on "reliable information available to the State" or "period of enrollment" quotes § 435.557(a)'s
  words from the stored correction in its Note and names the paragraph, as decision record 0006 has a forward
  reference handled.
- The inherited rows showing-requirement-does-not-apply, notice-says-how-to-show-not-applicable and
  adverse-notice-names-both-failures rechecked, since they name § 435.554 without excluding paragraph (c)(5), each
  given a dated `Corrected:` where a new row shows it says more or less than its source.

About 40 to 50 rows: about 23 on the two paragraphs, by decision record 0006's estimate, about 11 on SSA § 1614, the
court rows, the preamble rows and the deck's 3. Past 64, a new decision record splits the topic.

### Deliberately not

The other nine exclusions, which increment 2.1 wrote, and § 435.557(a)'s definitions, which increment 2.6 writes. How
Colorado shows medically frail status, when its documentation starts and whether its adopted rule keeps the draft's
condition, which are Colorado facts for increment 4, and any other state's frailty rules, which leave with
`state-options.md`. Rows on the parties' briefs, docket entries 104, 138-1 and 140, which are not stored; what the
research read in them, that both sides briefed vacatur as reaching every state, is in the open question on the
vacatur's reach. (Corrected 2026-10-29: said "research A's reading of them is in the Done entry."; full review
2026-10-29, corpus against source N6.) Anything from Taylor v. Kennedy beyond its docket list, since its plaintiffs
are individuals and its filings describe them. Rows for the deck's three tiers and its anticipated five-year
lookback. A conclusion on whether vacatur under the APA binds CMS for states that did not sue, which stays an open
question.

### Why this shape

§ 435.557(f) verifies the status § 435.554(c)(5) defines, so the two are reviewed together. The ruling changed one
phrase of (c)(5)(i) and upheld (f)'s limits, so the topic is written once, after the ruling, under the precedence that
lets its rows say what is in force, and holds up no other topic.

### How you know it worked

- `/usr/bin/python3 -m unittest discover -s tests` (3.9.6) and `/opt/homebrew/bin/python3 -m unittest discover -s
  tests` (3.14.6) both pass, each run as its own command, with a passing and a failing fixture for each new check
  named in the Done entry.
- `scripts/check-corpus.py` exits 0 under both and prints its counts, with the three orders, SSA § 1614 and the deck
  among the sources.
- `docs/review/medically-frail-or-special-medical-needs.md` exists and the checker compares it.
- Both docket results are in the Done entry and the watch list, each with the time it was checked, the second time
  before the Done entry included.
- Each ledger finding this increment applies appears once in its Done entry, applied or rejected with a reason.
- A search of `docs/domain/` outside the stored sources and the research records, the skill and `docs/design.md`
  finds each corrected claim's old wording only in its dated correction, "Two-part test", "functional gate", "no
  ruling had issued" and "a health condition that makes work hard" among them.
- The Done entry lists each paragraph in Delivers with the rows that carry it, or the reason it has none, and each
  claim of each passage pointed in `rule-extract.md` and `what-matters-most.md` with the row that now carries it.
- A fresh agent session is asked: "I have bipolar disorder. How does the state decide whether I'm medically frail, so
  the work requirement doesn't apply to me?" It runs, with no skill named, on both model families, as in increment
  2.1, and a miss is handled the same way. Its answer says that medically frail means being in one of the five groups
  § 435.554(c)(5)(i) lists, as each defines itself, and that bipolar disorder may fall in the group of a disabling
  mental disorder, which the preamble's examples include where it is moderate or severe; that on 2026-10-29 a federal
  court vacated the rule's added condition that the person's condition significantly impair their ability to comply,
  and barred CMS from applying it to the states that sued, Colorado among them; that the state must develop a list
  of conditions and have a process for a person whose condition is not on it to ask to be considered; that the state
  first tries to verify the status from reliable information, claims from the preceding 12 months included, before
  asking the person; and that whether the person is excluded is the agency's determination, labeled Deferred, with the
  agency named. It gives no estimate of the person's own status and states none of their facts as met. It cites by
  identifier the rows on § 435.554(c)(5)(i), the vacatur, (c)(5)(i)(C), (c)(5)(ii)(C) and § 435.557(f)(1), and says
  which skills it loaded.
- After the description is rewritten, increment 1's and increment 2.1's fresh-session questions run again on both
  model families, and each loads the skill unprompted.

### Needs from you

The owner's read of this revision, his acceptance of decision record 0013, and his word on the design's new tap
statement. (Asked 2026-10-29.)

### Done, 2026-11-04

Built on the branch `corpus-2.2-medically-frail`, off main at 5270acc, the commit that revised this section, on
2026-10-29 between about 21:46 and 23:15 UTC, in ten steps. Against "How you know it worked":

- `/usr/bin/python3 -m unittest discover -s tests` (3.9.6) ran 358 tests and passed in 148 s, and
  `/opt/homebrew/bin/python3 -m unittest discover -s tests` (3.14.6) ran 358 and passed in 183 s, each as its own
  command, on 2026-10-29, finishing at 23:07:34 and 23:08:16 UTC; the two ran at the same time. Main had 358, the
  count CI ran for 2d65028. No check was added, so no new fixture: the test changes are cases in
  `CitationLinkTest.test_links_each_kind_of_part_and_leaves_the_rest_as_text`. The build's, `SSA 1614(a)(3)(A)`
  linking to SSA's page for section 1614, failed under 3.9.6 before the code changed (5 tests, 1 failure, the
  citation left as text) and passes now. The review's fixes added two (R2-N5): `SSA 1903(a)` stays text, which
  passed before the fix, and `SSA 16140` stays text, which failed before `SSA_PART` was built from `SSA_URL`'s keys
  with a word boundary after the section number. The SSA 1902 case is kept. After that fix, on 2026-10-30, 358 tests
  passed under 3.9.6 in 181 s and under 3.14.6 in 219 s, each as its own command. After the hand fixes the review below
  describes, a last run that began at 01:04:06 UTC passed 358 under 3.9.6 in 148 s and then 358 under 3.14.6 in 173 s.
- `scripts/check-corpus.py` exits 0 under both and prints `Checked 163 rows (1 say Verified: no, 0 verified by a
  person), 52 sources, 10 state facts (2 marked not published), 0 warnings, 163 skill items.` Main gave 126 rows, 43
  sources and 126 skill items. The 9 new sources are the three orders and their extractions, the deck and its
  extraction, and SSA § 1614.
- `docs/review/medically-frail-or-special-medical-needs.md` exists, 434 lines, linked twice from the landing page, to
  the page and to its start-here rows, and the checker compares it with what the generator makes. `docs/review/`
  holds 6 pages.
- The docket results, with the time of each query, are below; the skill's watch list carries the results without the
  times. The checks after the build, the last at 04:35 UTC on 2026-11-04, found no appeal, no stay and no order on a
  challenged provision.
- The ledger findings, the paragraphs of Delivers and the pointed claims are below.
- The old-wording search, run again after the review's fixes on 2026-10-30 at about 00:40 UTC, is this command, from
  the repository root. It leaves out the research records and the stored sources, the interim final rule's own
  `2026-11094.xml`, `2026-11094.txt` and `SECTION-INDEX.txt` among them (R6-1, R6-2):

  ```
  git grep -n -i -F --untracked \
    -e "Two-part test" -e "two-part test" -e "functional gate" -e "no ruling had issued" \
    -e "a health condition that makes work hard" -e "gate is functional" -e "functional-impairment gate" \
    -e "Two internal cross-references" -e "none with a row yet" -e "Same reach as Massachusetts" \
    -e "expect movement" -e "could be 6 months" -e "2026-10-22: the summary judgment hearing" \
    -e "summary judgment hearing on October 22, 2026" -e "This is the most directly actionable line" \
    -e "And the 12-month reverification" -e "The States ask" -e "the government asks for remand" \
    -e "summary judgment hearing was reset" -e "for unlisted conditions" \
    -e "where (c)(5)(i) is meant" -e "Litigation could move the medically-frail gate" \
    -e "Research B's inventory" -e "research A's reading" -e "the government's time to appeal" \
    -e "hearing on October 22, 2026," -e "too little data" -e "no data to verify" -e "when they are disabling," \
    -e "enjoined CMS and those" -e "enjoined CMS from applying them to the states that sued" \
    -e "born before 1956" -e "The five groups:" -e "Seven statute rows" -e "7 such links" -e "36 rule items" \
    -e "must not reverify" \
    -- docs .kiro scripts ':!docs/domain/research' ':!docs/domain/sources' \
    ':!docs/domain/cms-2454-ifc/2026-11094.xml' ':!docs/domain/cms-2454-ifc/2026-11094.txt' \
    ':!docs/domain/cms-2454-ifc/SECTION-INDEX.txt'
  ```

  The 37 wordings are the build's 12, the first 12 above; 14 more that, with those 12, cover each of the 25 old wordings
  quoted in the 22 `Corrected 2026-10-29` marks, taken as fragments that avoid the bold markers, since git grep reads
  the raw text; and 11 from the review's fixes, from "too little data" on: 10 wordings the fixes replaced, and "must not
  reverify", which R3-S1 first proposed to replace. Every hit is in a dated correction; in this section of the plan,
  which names the wordings; in decision record 0013, line 59, which is accepted and stays; in the Note of
  frailty-verified-at-first-renewal-after-sworn-statement and `rule-extract.md` subsection 7.7, which quote "could be 6
  months" from 91 FR 33407; at `rule-extract.md` line 340, "States must not reverify this status", which the preamble's
  "(and may not)" at 91 FR 33366 supports (R3-S1 as revised); or in text that only shares words: "The States asked" in
  the past tense, `rule-extract.md` line 884's past "The summary judgment hearing was reset to October 22, 2026", and
  the `interpretiveRisk` comment's "functional-impairment gate, which Massachusetts v. Oz vacated". git grep matches
  within one line, so a wording broken across two lines escapes it. Read again with line breaks and bold removed, the
  same files gave one more, `docs/design.md` lines 293 and 294, "enjoined CMS from applying them to the states that
  sued", which stays, since R1-3 keeps prose saying the order enjoined CMS.
- The fresh-session test ran once on each model after the review's fixes, on 2026-10-30 at about 01:05 UTC, each run a
  one-step workflow whose whole prompt was the plan's question, with no skill named, and increment 1's and increment
  2.1's questions then ran again on each model at about 01:07 UTC. All six runs loaded the skill and hhs-benefits
  unprompted and opened the topic file for their question, so the rewritten description loads the skill. No skill load
  was missed, so nothing carries into increment 5. On the plan's question, Claude Opus 5.5 said that the rule excludes
  anyone in one of five groups and named three that bipolar disorder may point to, each as a possibility: a disabling
  mental disorder, with the preamble's example of moderate or severe bipolar disorder; disabled as SSA § 1614 defines
  it; and a serious or complex medical condition. It also gave the ruling, the injunction for the states that sued,
  Colorado among them, and the ruling's unsettled reach elsewhere; the list and the request path; the State's records of
  the preceding 12 months first; and the agency as the one that decides. It gave no estimate, stated none of the
  person's facts as met and cited 18 rows, all 5 the plan names, but did not use the label Deferred. It sent its answer
  twice, and the second, its last, did not say which skills it loaded, though the first did. GPT-5.6 Sol opened
  "Deferred: Your state Medicaid office decides whether you are medically frail." It named the disabling mental disorder
  group with the preamble's example, the ruling and its reach, the list and the request path, and the State's records of
  the preceding 12 months first, and gave no estimate. It did not say that medically frail means being in one of five
  groups, or name another group the person's facts may point to; it cited 11 rows, 3 of the 5 the plan names, leaving
  out medically-frail-defined and medically-frail-impairment-phrase-vacated though it described the ruling; it told the
  person to contact "the Medicaid office listed on your letter before its deadline", a letter the question never
  mentioned; and it did not say which skills it loaded. On increment 1's question, both models gave the seven things the
  notice must say, the 30 days with the 5-day presumption, and the deadline printed on the letter, and named their
  skills. On increment 2.1's, both named the caretaker relative and family caregiver routes with what each requires and
  labeled the agency's part Deferred. GPT-5.6 Sol did not say which skills it loaded. Claude Opus 5.5 said "Your
  situation matches two exclusions", stating as settled that the person's facts point to them, and said the requirement
  covers only adults in the expansion group, leaving out the section 1115 demonstrations of
  applicable-individual-under-a-demonstration. As in increment 2.1, the skill was not changed to make an answer cite the
  plan's rows or use its words, which would teach the test its answer key.

The docket check, on 2026-10-29, through CourtListener's API with the owner's token, run before this section was
revised. The first query, at 18:16:51 UTC, was answered 401 for both dockets, the stored token being 9 characters,
and the owner replaced it. Then:

- Massachusetts v. Oz, D. Mass. 1:26-cv-12962, RECAP docket 73546826: the docket at 19:23:59 UTC and its entries at
  19:24:17 UTC (292 documents indexed), the orders fetched at 19:25:21 UTC. The case was terminated on 2026-10-29.
  Three entries were new since 145, each filed and entered that day: 147, the memorandum and order on the
  cross-motions for summary judgment, 16 pages; 148, the order of vacatur and enjoinment, 2 pages; 149, the judgment,
  1 page. RECAP held no entry 146. Research for this increment searched RECAP's entries again at 19:48:59 and
  20:04:17 UTC and found none after 149, searched the First Circuit at 19:56 UTC and found no case, found no other
  suit in RECAP, and found no public statement from CMS by 20:05 UTC; govinfo held only the case's memorandum and
  order of 2026-07-29 at about 20:00 UTC.
- Taylor v. Kennedy, Jr., D. Md. 1:26-cv-03705, RECAP docket 74813673, checked for the first time: the docket at
  19:24:27 UTC and its entries at 19:24:29 UTC, the full list read at 19:28:25 UTC after a rate limit answer (82
  documents). The case is open. The newest entries were orders admitting counsel pro hac vice (56 to 59,
  2026-10-28), amicus filings and motions for leave to file them (30 to 55, 2026-10-27), the plaintiffs' motion for
  summary judgment (29, 2026-10-20) and the order of 2026-10-14 (28), which research L3 reads as the briefing
  schedule. No order on a challenged provision. Only the docket list was read, since its plaintiffs are individuals.
- RECAP can lag PACER (`docs/domain/research/2026-10-16-policy/L3-statute-litigation.md:206`), and PACER was not
  checked. The orders' bytes fetched again from `storage.courtlistener.com` at 21:46 UTC for storage match the
  19:25:21 UTC copies by SHA-256.
- The owner decided how to go on at about 19:45 UTC: this section as revised, with decision record 0013. The result
  is in the skill's watch list, in its Massachusetts v. Oz and Taylor v. Kennedy items, each corrected in place. The
  review's fixes took the query times, the read times and the note on RECAP's lag out of those items, and out of
  the items on govinfo and on CMS's response, since `AGENTS.md` keeps dated notes on the repository's own work out
  of the skills (O1). Each is recorded here, and the RECAP check of 2026-10-23 that the Massachusetts v. Oz item
  carried, entry 144 the newest then, is in increment 2.1's Done entry.
- After the build, through the same API: Massachusetts v. Oz entries after 149 at 23:17:42 UTC on 2026-10-29, none;
  Taylor v. Kennedy entries after 59 at 23:18:07 UTC, none; and First Circuit dockets named Massachusetts and Oz at
  23:18:44 UTC, none. After the review's fixes, on 2026-10-30, the same three queries at 01:07:56, 01:08:01 and 01:08:07
  UTC, and again just before this entry at 01:18:33, 01:19:01 and 01:19:13 UTC, found none. An empty answer could also
  come from a query that matches nothing, so the same queries for Massachusetts v. Oz entries from 147 and Taylor v.
  Kennedy entries from 57 ran at 01:20:00 and 01:20:05 UTC, and returned 147 to 149 and 57 to 59. With no appeal, stay
  or new order in RECAP, nothing stopped the rows. The first check after this entry was drafted ran the same three
  queries at 18:09:11, 18:10:45 and 18:11:11 UTC on 2026-10-30, with controls at 18:10:08 and 18:10:59 UTC, and found
  none. Before the commit, on 2026-11-04, the same three queries ran at 04:35:12, 04:35:27 and 04:35:39 UTC, with a
  control for Massachusetts v. Oz from entry 147 at 04:36:28 UTC. Massachusetts v. Oz had no entry after 149, and the
  First Circuit no case. Taylor v. Kennedy had entries 60 to 73, filed from 2026-10-30 to 2026-11-03 and known only by
  RECAP's short descriptions: two quality-control notices, two notices of appearance, four amicus appearances, three
  motions for leave to file and an order on a motion for leave to file, a notice of the administrative record and a
  disclosure statement. None is an order on a challenged provision, and the government's cross-motion, due 2026-11-03,
  was not among them. A search of the text RECAP holds for documents filed since 2026-10-30 that say both "community
  engagement" and "medically frail" found none, where the same search from 2026-10-01 found entries 142, 147 and 148. A
  search for dockets filed since 2026-10-29 that mention community engagement found one, N.D. Cal. 3:26-cv-12800,
  against the Department of Justice and the Department of Homeland Security, which names neither HHS nor CMS.

Each ledger finding the plan's 2.2 names, applied or rejected:

- L2-8, the deck's optional three-tier framework, its Tier 3 document list and the anticipated five-year lookback:
  applied, as the deck's three agency guidance rows, state-may-check-exclusions-in-own-records-first (page 10),
  documents-state-may-seek-for-frailty (page 20) and stable-recovery-read-as-five-consecutive-years (page 31). The
  tiers get no row, since tiers 1 and 2 are defined by the vacated words (page 12), and the document list's row
  carries the list without its tier or its trigger. The lookback is on the watch list as CMS's intention. The ledger
  rated it burdensome; each of the three rows is rated dangerous, since each could go wrong either way.
- L2-14, its frailty part, which rated dangerous CMS's renew-info pages for leaving out the functional gate: applied
  in the direction the ruling sets, in medically-frail-impairment-phrase-vacated's Note, which says that since
  2026-10-29 leaving the words out is right in the plaintiff states. The pages are not stored, and whether they match
  each group's own terms was not checked. The finding is reversed.
- L1-7, the third broken cross-reference, § 435.554(c)(5)(ii)(A)'s "paragraphs (a)(5)(i)(A) through (E)": applied,
  in state-develops-list-of-frailty-conditions and frailty-condition-list-auditable-and-consistent, which cite both
  the printed text and the preamble's § 435.554(c)(5)(i)(A) through (E) and pick neither; in the open question on
  which paragraphs the list must match; and in `what-matters-most.md` section 13, now "Three internal
  cross-references", corrected in place.
- L8-4, that a state must develop a list, not publish one, and keep the request path: coverage, not applied again.
  state-develops-list-of-frailty-conditions and request-consideration-when-condition-not-listed carry its subject,
  and their Notes name it. The fix before increment 2.1 corrected the passage.

Named in no part of the plan's 2.2 as a finding to apply, and touched: L1-11, the hearing of 2026-10-22, whose watch
list item now records the ruling; L1-12 with L3-5, Taylor v. Kennedy, whose item was corrected in place with its docket
check and the briefing dates, and which 13 rows name, 12 in their Notes and
missing-claims-cannot-defeat-frailty-exclusion in its Recheck, those on the vacated words, the stable recovery
carve-out, the 12-month window and the limit of one sworn statement among them; L5-1, the proposed submission of draft
8.100's updated language to Colorado's Medical Services Board on 2026-11-27 (Corrected 2026-11-04: said "Colorado's
Medical Services Board on 2026-11-27"; ledger L5-1.), whose item gained the draft's own frailty condition. None of the
three changes a row's Rule.

Each paragraph of Delivers, and what carries it:

- The docket check: no row; the result above and in the watch list.
- The three orders, in `docs/domain/sources/courts/`: `massachusetts-v-oz-1-26-cv-12962-147.pdf`, `-148.pdf` and
  `-149.pdf`, 187,147, 77,951 and 63,531 bytes, each with its `.txt` extraction (16, 2 and 1 page lines), and six
  manifest entries. Each PDF's entry gives the curl command that fetched it from `storage.courtlistener.com`, its
  `served_url`, and as `cited_url` the CourtListener docket page; each note says govinfo had not published the entry
  by 2026-10-29.
- Decision record 0013 carried out: a bullet under "What has to be true of every rule" in the epic design, second,
  after the conflict rule it qualifies; `courts/` and `govinfo/` among the publishers in its table under "Where things
  live"; and an item in the skill's `## Precedence` naming the vacatur in Massachusetts v. Oz as its case. After the
  review, the design's bullet adds 0013's "with any appeal and any other suit still pending against the provision"
  (R3-N5); the Precedence item gives the definition without the vacated words in the plaintiff states, Colorado
  among them, and calls its reach elsewhere an open question (R3-S2); and the Precedence item on conflicts names
  this topic's two (R3-N4).
- The rows: 37, where the plan expected about 40 to 50. By tier, 19 regulation, 8 statute, 5 preamble, 3 agency
  guidance and 2 court; all 37 dangerous; all 37 `Verified: 2026-10-29, read in source`; 11 with a State election.
  Every row's Recheck includes `court ruling`. By paragraph:
  - § 435.554(c)(5) and (c)(5)(i) as printed: medically-frail-or-special-medical-needs-excluded and
    medically-frail-defined. The court row on the vacatur and the injunction: medically-frail-impairment-phrase-vacated,
    quoting entry 148 and citing entry 147's reasoning that the five groups the statute names are a floor; its Note
    names the preamble statements that explain the vacated words, 91 FR 33373 among them (2026-11094.xml:1020 and
    :1021), and says no row carries them. After the review, it and the six-months row name the enjoined side as
    entry 148 does, the defendants, CMS and HHS and the officials heading them in their official capacities, their
    agents, employees, appointees, successors and anyone acting in concert or participation with them, the
    defendants identified from entry 147's caption (R1-3), and their Rechecks and Notes say the time to appeal, which
    runs for any party (R3-S3).
  - (c)(5)(i)(A) to (E), each as printed, each Rule saying the definition's opening binds the group and that its
    impairment words were vacated: medically-frail-blind-or-disabled, medically-frail-substance-use-disorder (its
    Note: Taylor v. Kennedy challenges stable recovery), medically-frail-disabling-mental-disorder,
    medically-frail-disability-impairing-daily-living and medically-frail-serious-or-complex-condition.
  - (c)(5)(ii) and (ii)(A) to (C): state-develops-list-of-frailty-conditions,
    frailty-condition-list-auditable-and-consistent, frailty-condition-list-revised-regularly and
    request-consideration-when-condition-not-listed.
  - § 435.557(f)(1), (i), (ii), (ii)(A), (ii)(B) and (iii), from the stored correction (C1-2026-11094.xml:106 to
    :116): frailty-verified-first-from-reliable-information, frailty-documentation-or-sworn-statement-before-2028,
    one-sworn-statement-per-period-of-enrollment-from-2028, frailty-verified-at-first-renewal-after-sworn-statement,
    second-frailty-claim-after-sworn-statement-needs-other-proof and frailty-reverified-at-least-every-12-months.
    Each Note on the 12-month window or the limit of one sworn statement says the court upheld it (entry 147, pages 5
    and 12) and that Taylor v. Kennedy still challenges it; (iii)'s Note says neither suit names it. After the
    review, the Notes of the 8 rows that say the court upheld their provision, five here and three preamble rows,
    also say the States may appeal Count II, on which the judgment was for the defendants, by 2026-12-28 (R3-S3).
  - § 435.557(f)(2): frailty-verification-data-privacy, and treatment-program-verification-data-privacy for its share
    for § 435.554(c)(8), which says so and names treatment-program-participant-excluded. Both name every law the
    paragraph lists and say none is stored.
  - The court row for the six months: six-months-without-penalty-for-plaintiff-states, quoting entry 148(c) and
    entry 147 at pages 15 and 16 and picking neither.
  - The preamble rows: disabling-mental-disorder-examples (91 FR 33375, 2026-11094.xml:1131, moderate or severe
    bipolar disorder among the examples), missing-claims-cannot-defeat-frailty-exclusion (91 FR 33406, :1937),
    frailty-verification-uses-no-information-older-than-12-months (91 FR 33405, :1931),
    frailty-checked-in-state-records-before-person-asked (91 FR 33405 and 33407, :1933 and :1952) and
    frailty-documentation-from-many-kinds-of-practitioner (91 FR 33406, :1939). Where a passage mixes a surviving
    claim with the vacated words, the row carries only the surviving claim and its Note says what it leaves out:
    :1937's domains, acuity scores and code lists. :1131's row, after the review, quotes the sentence of examples as
    printed, with both its conditions, "disabling and significantly impair", and cites entry 148, as decision record
    0013 has a row on a provision do; the row leaves out, and its Note names, the paragraph's direction to States to
    consider whether the disorder significantly impairs ability to comply (R1-1).
- SSA § 1614: `docs/domain/sources/govinfo/42-usc-1382c-2024-edition-2026-10-29.html`, 59,402 bytes, the 2024
  edition, since the 2025 edition's address redirected to govinfo's error page. The entry's note records that the
  latest amendment is Pub. L. 108-203 of 2004, to (a)(1)(B)(ii), and that uscode.house.gov's release point 119-136
  (through 2026-10-22), read and not stored, lists the same and differs from (a)(2) to the end of (f) only by word
  joiners before dashes. Eight statute rows: blind-as-defined-in-section-1614 ((a)(2)),
  disabled-as-defined-in-section-1614 ((a)(3)(A) and (B) as one rule), disabling-impairment-medically-demonstrable
  ((D)), substantial-gainful-activity-criteria ((E)), disabled-under-former-state-plan ((F)),
  combined-effect-of-impairments-considered ((G)), title-ii-disability-rules-apply-to-section-1614 ((H)(i) and
  (iii)) and drug-addiction-or-alcoholism-material-not-disabled ((J)). The review added the (F) row (R1-4), since
  the build's cut of (F) rested on the inference that the former State plans paid disability aid only from age 18,
  which no stored source supports; its Rule is from govinfo's line 30. The cut is in
  blind-as-defined-in-section-1614's Note: (a)(3)(C) and (I), which concern children under 18; (H)(ii) and (H)(iv),
  on children and infants; and (a)(1), (a)(4) and (b) to (f), which define neither word. The review checked the cut.
- The three open questions, each `Raised: 2026-10-29`, in `docs/domain/open-questions.md`, which holds 21 now:
  whether the vacatur reaches the states that did not sue, in CMS's practice, raised by medically-frail-defined,
  medically-frail-impairment-phrase-vacated, the five group rows and disabling-mental-disorder-examples, its Note
  naming the parties' briefs (docket entries 104, 138-1 and 140) as research; which of entry 148(c) and entry 147
  describes the six months, raised by six-months-without-penalty-for-plaintiff-states; and which paragraphs a state's
  list must match under § 435.554(c)(5)(ii), raised by state-develops-list-of-frailty-conditions and
  frailty-condition-list-auditable-and-consistent, with the deck's page 7 among its Sources.
- The deck: `docs/domain/sources/cms/implementing-medical-frailty-deck-2026-09-08.pdf`, 577,628 bytes, 33 pages,
  with its 847-line extraction and two manifest entries; medicaid.gov's community engagement page, read and not
  stored, lists it as posted 09/08/2026, and page 1 states no date. No `.gitattributes` line, since `git check-attr`
  gives `text: unset` for the new files. The three agency guidance rows are under L2-8 above.
- The deck's other operative claims, each with its higher source, read in the extraction:
  - Pages 3, 5, 6 and 7 restate SSA 1902(xx)(9)(A)(ii)(V), § 435.554(c)(5)(i)(B), (E) and (c)(5)(ii): the group
    rows and the list rows carry them. Page 6 says CMS did not further define groups (A), (C) and (D).
  - Page 4: the IFC's definition, not the alternative benefit plan's, decides the exclusion, and states may not add
    populations beyond the five groups. The preamble says both (2026-11094.xml:1012, :1016 and :1018, 91 FR
    33372 and 33373); no row carries them, and they stay in `rule-extract.md` subsection 4.2 and
    `what-matters-most.md` section 4. Its last bullet, and page 11's reminder, state the vacated words.
  - Page 8 restates § 435.557(f)(1) to (iii), claims paid, pended or denied included (C1-2026-11094.xml:106): the
    (f) rows.
  - Page 10's ex parte sentence: frailty-verified-first-from-reliable-information. Its burden factors are in
    state-may-check-exclusions-in-own-records-first.
  - Pages 11 to 13, 17 to 19 and 21 to 22: the tiers, the step-wise approach and the key points, no row. Page 13's
    reminder of the request process is (c)(5)(ii)(C)'s row, and its re-run at least every 12 months (f)(1)(iii)'s.
  - Pages 14 to 16: data sources and code sets a state should consider, no row; their higher source is § 435.557(a)'s
    definition of reliable information available to the State, its electronic data sources, claims and encounter
    data among them (C1-2026-11094.xml:29 to :38), which increment 2.6 rows. Page 16's point that a non-medical
    code such as one for homelessness cannot alone show frailty matches the preamble at :1018 (91 FR 33373), and its
    example rests on the vacated words.
  - Pages 23 to 30, 32 and 33: fictional clinical vignettes, each placed in a tier, no row.
  - Page 31's remaining lines: 748 to 750 state the vacated words; 751 to 754 are carried by
    frailty-verified-first-from-reliable-information; 755 to 758, the lookback, are on the watch list.
- The topic file: its first line as the plan names it; an opening that says the definition is in force without the
  vacated words in the states that sued since 2026-10-29, that whether the same holds elsewhere is an open question,
  and that whether a person is medically frail is the agency's determination; 37 rule items, one for each row, in 8
  groups, 261 lines. After the review, the third group's heading is "The five groups, and how CMS and the preamble
  read two of them", since it holds the five group items and the two that read them (R5-1). Its `## Topics` item is
  29 words after the link. The description is the owner's approved text, 798 characters, compared by script with
  the proposal. `SKILL.md` is 2,485 words by `split()`, from 1,664 at main; see deviations.
- The review page, on the landing page, with 20 start-here rows under `medically-frail-or-special-medical-needs` in
  `START_HERE`, chosen by decision record 0006's rule and in the topic file's order, and an orientation naming the
  ruling, medically-frail-impairment-phrase-vacated, medically-frail-defined, the five group rows,
  six-months-without-penalty-for-plaintiff-states and both open questions on the ruling. After the review, the
  orientation is in 12 shorter sentences, says in plain words what vacate and set aside, enjoin and memorandum mean,
  and names the enjoined side as entry 148 does (R1-3, R2-1, R5-3). Citations of SSA § 1614 link to
  `https://www.ssa.gov/OP_Home/ssact/title16b/1614.htm` (`SSA_PART` and `SSA_URL` in
  `scripts/review_pages/constants.py`, `links.py`), with the `CitationLinkTest` cases above and a sentence in the
  Formats under "The review pages"; the page has 10 such links, on the 8 § 1614 rows.
- Section 12's entry "Medically frail means having a listed diagnosis": quoted exactly in the Notes of
  state-develops-list-of-frailty-conditions and request-consideration-when-condition-not-listed, whose items say the
  list identifies people and that a person whose condition is not on it can still ask. The rebuttal in
  `what-matters-most.md` section 12 is corrected in place, citing entry 148; its error column is unchanged, so the
  rows' quote still matches.
- L8-4, L2-14 and L1-7: under the ledger findings above.
- The pointers: `rule-extract.md` subsection 4.2, with 37 identifiers, increment 2.1's rows for (c)(1) to (4) and
  (6) to (10) and this topic's; subsection 7.7, with 12; and `what-matters-most.md` section 4, with 17, its heading
  kept and corrected. Each opens with a `Now rows ...` line dated 2026-10-29, and a script found every identifier in
  them in the extract. Their claims are in the table below.
- Corrected in place, each quoting the old words and citing the stored order or line, listed below.
- The watch list, in `SKILL.md`: the Massachusetts v. Oz and Taylor v. Kennedy items corrected in place, and new items
  for the time to appeal, to 2026-12-28; any request to stay entry 148; a supplemental interim final rule (entry 142,
  ECF page 19, not stored); govinfo's copy of entry 147; 2027-04-29, the end of the six months by HourKeep's count;
  CMS's response, such as a revised deck; and CMS's anticipated five-year lookback. Taylor's cross-motion, due
  2026-11-03, and last brief, due 2026-12-02, are in its item. The item of 2026-11-27 on Colorado's draft 8.100
  (Corrected 2026-11-04: said "The Colorado Medical Services Board item of 2026-11-27"; ledger L5-1.) gained the draft's
  own condition (draft 8.100 lines 1213 and 1214) with an `Added` mark. After the review, each item gives only its date
  or event, what it could change and the rows or places (O1); the time to appeal runs for any party, so the States may
  appeal Count II (R3-S3); a new item is for a motion to alter or amend the judgment under Federal Rule of Civil
  Procedure 59(e), which would move the time to appeal (R3-S3); and the appeal and stay items name their rows by rule,
  every row whose Citation names entry 148 or 147, 9 rows now, with the topic file's opening, the review page's
  orientation and the passages corrected under decision record 0013 (R4-1, R2-1).
- Dated lines in increments 2.3, 2.6 and 2.7 (`Added 2026-10-29`: decided and dismissed; the owner's decision of
  that day and decision record 0013 settle the outcome for entries 147 to 149, so the check looks for an appeal, a
  stay or a new order, and any one of those stops row work, which the review asked for (R3-S4); and Taylor's docket
  is checked as before), 2.6's also saying entry 147 upheld
  § 435.557(a)(vii) and (a)(viii); increment 4's first Delivers paragraph (`Added`: Colorado's frailty facts read
  against the adopted rule and the injunction); and increment 5's watch list sentence (`Corrected`: names the
  ruling, the time to appeal and any stay).
- § 435.557(a)'s words: the 8 rows that rely on "reliable information available to the State" or "period of
  enrollment" quote its definition from the correction in their Notes (C1-2026-11094.xml:29 and :25) and name the
  paragraph: frailty-verified-first-from-reliable-information, frailty-documentation-or-sworn-statement-before-2028,
  one-sworn-statement-per-period-of-enrollment-from-2028, frailty-verified-at-first-renewal-after-sworn-statement,
  second-frailty-claim-after-sworn-statement-needs-other-proof, frailty-reverified-at-least-every-12-months,
  frailty-checked-in-state-records-before-person-asked and state-may-check-exclusions-in-own-records-first.
- The inherited rows showing-requirement-does-not-apply (C1-2026-11094.xml:138), notice-says-how-to-show-not-applicable
  (:166) and adverse-notice-names-both-failures (:178, :184 to :186), read against the new rows: each restates
  § 435.558's reference to the categories of § 435.554, which the ruling leaves standing, and none says more or less
  than its source, so none got a `Corrected:`.

The claims of each passage pointed, numbered RE4.2 and RE7.7 for `rule-extract.md` subsections 4.2 and 7.7 and WMM4
for `what-matters-most.md` section 4. "Stays" means the claim is still in the passage after its pointer line, marked
as the Formats say, with the preamble line that supports it; J3 is `docs/domain/cms-2454-ifc/2026-11094.xml`.

| Claim | Where it went |
|---|---|
| RE4.2-1, (1), the SUPPORT Act group, Pub. L. 115-271, whatever the age-18 date | former-foster-care-child-excluded, former-foster-care-criteria-apply-whatever-the-age-18-date |
| RE4.2-2, the four operative criteria | former-foster-care-criteria-apply-whatever-the-age-18-date |
| RE4.2-3, the preamble's qualifier "even if they meet the eligibility requirements" | the same row; "User-favorable." dropped as framing |
| RE4.2-4, (2), Indian as § 447.51 defines it, and its four routes | american-indian-excluded, indian-defined-at-447-51, urban-indian-criteria-at-447-51 |
| RE4.2-5, States must not reverify | stays, J3:771 (91 FR 33366) "(and may not)", with J3:1777 (91 FR 33396) and J3:1867 (91 FR 33403) "do not need to reverify" |
| RE4.2-6, (3), parent, guardian, caretaker relative or family caregiver of a child 13 or under or a disabled individual | parent-guardian-caretaker-relative-or-family-caregiver-excluded |
| RE4.2-7, paid caregivers qualify | stays, J3:936 (91 FR 33370) |
| RE4.2-8, guardianship needs a court order, the one documentary basis, and the pre-2028 latitude does not apply | stays; the court order part at J3:1877 (91 FR 33404), "one basis" and "pre-2028" marked Unverified |
| RE4.2-9, family caregiver, (A) to (C) | family-caregiver-excluded-on-one-criterion and its three criterion rows |
| RE4.2-10, (c)(3)(ii), more than one in a residence | more-than-one-excluded-in-a-residence |
| RE4.2-11, hours below 80 count, 55 plus 25 | caregiving-hours-below-80-count-as-unpaid-work |
| RE4.2-12, (4), temporary or permanent total rating, 38 U.S.C. 1155 | veteran-with-total-disability-rating-excluded |
| RE4.2-13, total disability rating based on individual unemployability | veteran-paid-at-total-rate-for-unemployability-excluded |
| RE4.2-14, screener advice | stays, as advice |
| RE4.2-15, reverification by type | stays, J3:992 (91 FR 33372) |
| RE4.2-16, (5), the two-part test and its gate | medically-frail-defined, as printed; medically-frail-impairment-phrase-vacated, the vacatur |
| RE4.2-17, a diagnosis alone is not enough, with the 80 hours | J3:1021 (91 FR 33373), named in medically-frail-impairment-phrase-vacated's Note among the statements that explain the vacated words; no row |
| RE4.2-18, (A) and its blind or disabled parenthetical | medically-frail-blind-or-disabled, blind-as-defined-in-section-1614, disabled-as-defined-in-section-1614 |
| RE4.2-19, (B), stable recovery as 5 or more years | medically-frail-substance-use-disorder |
| RE4.2-20, (B), active treatment, early and sustained recovery, self-identification after relapse | stays, J3:1059, :1087 and :1090 (91 FR 33374) |
| RE4.2-21 to RE4.2-23, (C), (D) and (E) with its qualifiers | medically-frail-disabling-mental-disorder, medically-frail-disability-impairing-daily-living, medically-frail-serious-or-complex-condition |
| RE4.2-24, (ii), the list, auditable, consistent with (A) to (E), revised, and the request path | state-develops-list-of-frailty-conditions, frailty-condition-list-auditable-and-consistent, frailty-condition-list-revised-regularly, request-consideration-when-condition-not-listed; the cross-reference is an open question |
| RE4.2-25, no added categories, homelessness | stays, J3:1018 (91 FR 33373) |
| RE4.2-26, not the alternative benefit plan's definition, § 440.315(f) | stays, J3:1012 and :1016 (91 FR 33372 and 33373) |
| RE4.2-27, (6), TANF under SSA 407 | tanf-work-requirement-compliant-excluded |
| RE4.2-28, (7), a SNAP household member not exempt, and its construction | snap-household-member-not-exempt-from-work-requirement-excluded, snap-exclusion-covers-general-and-time-limit-work-requirements |
| RE4.2-29, (8), a program under 7 U.S.C. 2012(h), the State's minimum time commitment | treatment-program-participant-excluded, treatment-program-defined-by-food-and-nutrition-act |
| RE4.2-30, (8) is distinct from the substance use disorder group | stays, J3:1098 (91 FR 33374) |
| RE4.2-31, (9), an inmate, § 435.1010 | inmate-of-public-institution-excluded, inmate-means-held-involuntarily-in-custody |
| RE4.2-32, (10), SSA 1902(e)(5) or (e)(16) | pregnant-or-postpartum-excluded |
| RE4.2-33, (10), attestation under § 435.956(e), no document | stays, J3:1988 (91 FR 33408); verification is increment 2.6's |
| RE7.7-1, reliable information first, claims of the preceding 12 months and encounter data | frailty-verified-first-from-reliable-information, frailty-checked-in-state-records-before-person-asked |
| RE7.7-2, nothing older than 12 months | frailty-verification-uses-no-information-older-than-12-months |
| RE7.7-3, who can sign documentation | frailty-documentation-from-many-kinds-of-practitioner; "most directly actionable line" stays, as advice |
| RE7.7-4, absent claims and codes not on the list | missing-claims-cannot-defeat-frailty-exclusion |
| RE7.7-5, a new basis after a sworn statement | second-frailty-claim-after-sworn-statement-needs-other-proof |
| RE7.7-6, "could be 6 months" | stays, corrected in place, since J3:1952 (91 FR 33407) says it of the reverification at the first regular renewal after a sworn statement, not of the 12-month reverification |
| RE7.7-7, the table, each time through 2027 and once from 2028 | frailty-documentation-or-sworn-statement-before-2028, one-sworn-statement-per-period-of-enrollment-from-2028 |
| RE7.7-8, the first regular renewal after a sworn statement | frailty-verified-at-first-renewal-after-sworn-statement |
| RE7.7-9, at least every 12 months | frailty-reverified-at-least-every-12-months |
| RE7.7-10, (f)(2)'s laws | frailty-verification-data-privacy, treatment-program-verification-data-privacy; "Three user-facing facts" and "A new basis burns no second attestation" dropped as framing |
| WMM4-1, the heading | kept, corrected |
| WMM4-2, two parts, both required, the gate | medically-frail-defined, medically-frail-impairment-phrase-vacated |
| WMM4-3, a diagnosis alone is not enough, with the 80 hours | J3:1021 in medically-frail-impairment-phrase-vacated's Note; no row |
| WMM4-4, (A) | medically-frail-blind-or-disabled, blind-as-defined-in-section-1614, disabled-as-defined-in-section-1614 |
| WMM4-5, (B), 5 or more years; active treatment, early and sustained recovery, relapse | medically-frail-substance-use-disorder; the rest stays, J3:1059, :1087 and :1090 |
| WMM4-6, (C), (D) with "one is enough", and (E) | the three group rows |
| WMM4-7, the list and the request path | the four (c)(5)(ii) rows |
| WMM4-8, an unlisted condition still qualifies "if they meet the gate and one of (A)-(E)" | state-develops-list-of-frailty-conditions, request-consideration-when-condition-not-listed; the gate part, medically-frail-impairment-phrase-vacated |
| WMM4-9, "Ask for the list..." | stays, as advice |
| WMM4-10, the alternative benefit plan's definition | stays, J3:1012 and :1016 |
| WMM4-11, HIPAA and 42 CFR part 2 | frailty-verification-data-privacy, treatment-program-verification-data-privacy |
| WMM4-12, the litigation blockquote | stays, corrected in place as this section lists; its ruling claims are also medically-frail-impairment-phrase-vacated's and six-months-without-penalty-for-plaintiff-states' |

Corrected in place, each dated 2026-10-29, quoting the old words and citing decision record 0013 or 0007 and the
stored lines (`courts/` entries 148 at :23, :29 and :33, 147 at :15 and :285, and 149 at :20, as each needs):

- `rule-extract.md` section 11, the litigation bullet: "As of 2026-10-16 no ruling had issued and no injunction was
  in effect, so the rule was fully operative." became the ruling, entries 148, 147 and 149, and the briefs' "The
  States ask for vacatur" and "the government asks for remand without vacatur and says vacatur" went into the past
  tense; an `Added` sentence says the vacatur's reach for other states is an open question.
- `rule-extract.md` subsection 7.7, RE7.7-6, "could be 6 months", as the table says; after the review, the corrected
  text opens "From January 1, 2028," as J3:1952 does (R3-S5), and the line before it, which had been reworded with
  no mark, carries a mark quoting "This is the most directly actionable line in the rule" (R3-N9).
- `what-matters-most.md` section 2, the (c)(5) row, which said "Two-part test with a **functional** gate. See § 4
  below".
- `what-matters-most.md` section 4: its heading, "Medically frail — the gate is functional, not diagnostic", now
  "Medically frail: one of five groups, each as it defines itself"; its litigation blockquote's "this functional
  gate", "As of 2026-10-16 no ruling had issued ... but expect movement." and the briefs' present tense, with the
  `Added` reach sentence.
- `what-matters-most.md` section 12, the rebuttal of "Medically frail means having a listed diagnosis", which said
  "Two-part test with a **functional** gate, plus a **request path** for unlisted conditions". After the review, the
  rebuttal also says the court enjoined CMS from applying the words to the plaintiff States, Colorado among them,
  and that the vacatur's reach elsewhere is an open question (R3-S2, R3-N7).
- `what-matters-most.md` section 13: "Two internal cross-references in the IFC are broken and uncorrected." now
  three (L1-7); the (c)(5)(ii) sentence, which said it "points at "paragraphs (a)(5)(i)(A) through (E)" where
  (c)(5)(i) is meant.", now says (c)(5)(ii) and (ii)(A) both cite paragraphs that do not exist and that reading the
  preamble's paragraphs is an inference and an open question; and "Litigation could move the medically-frail gate.
  See § 4.", now the ruling, the open reach, an appeal or stay that could undo it, and Taylor v. Kennedy.
- `state-options.md`, the `interpretiveRisk` comment's "the medically-frail functional-impairment gate, under
  challenge in Massachusetts v. Oz, whose summary judgment hearing was reset to 2026-10-22 by ECF 143, entered
  2026-10-08."
- `docs/design.md`: the tap statement "a health condition that makes work hard", now "a disability, or a serious
  health, mental health or substance use condition", the paragraph still `(Proposed, 2026-10-16.)`; and the sentence
  naming both suits, which said "the Massachusetts v. Oz summary judgment hearing on October 22, 2026 (research
  L1-11), and".
- The skill's watch list: the Massachusetts v. Oz item ("2026-10-22: the summary judgment hearing in Massachusetts v.
  Oz, D. Mass. 1:26-cv-12962 (ledger L1-11). On" and "none with a row yet, and each topic") and the Taylor v.
  Kennedy item ("with no ruling promised before 2027-01-01 (ledger L1-12). Same reach as Massachusetts v. Oz, by the
  same inference.").
- This plan's increment 5, its watch list sentence, which said "The watch list holds the Massachusetts v. Oz hearing
  on October 22, 2026,".
- From the review, in this section of the plan: Delivers' list of passages to correct, which named a scratch
  document, "Research B's inventory of 2026-10-29 lists each passage." (R3-N6); Delivers' watch list, which said
  "the government's time to appeal" (R3-S3); and Deliberately not, which said "research A's reading of them is in
  the Done entry." and now names the briefs and points at the open question that says what was read in them
  (R3-N6). Each mark gives its finding as "full review 2026-10-29, corpus against source" and the finding's number.

Deviations from the plan:

- 37 rows, where the plan expected about 40 to 50: 19 on the two paragraphs, where decision record 0006 estimated about
  23; 8 on SSA § 1614, where the plan expected about 11, since the paragraphs on children and those that define neither
  word get none, and (A) with (B), and (H)(i) with (iii), each state one rule; 2 court rows, 5 preamble rows and the
  deck's 3. Delivers expected (F) among the cut; the review gave it a row.
- documents-state-may-seek-for-frailty carries the deck's list of documentation with no trigger, where Delivers
  says "the documents a state may seek when its data are not enough": the deck's trigger is "insufficient data OR
  no data for Tier 1 or 2" (deck .txt:371), and tiers 1 and 2 rest on the vacated words, so the row's Note quotes
  the trigger and the regulation's rows say when a State may require documentation (R1-2).
- § 435.557(f)(2) is two rows, so its share for § 435.554(c)(8) has an identifier of its own.
- SSA § 1614 is govinfo's 2024 edition, since the 2025 edition is not published there.
- The watch list gives the docket results without the times of the queries, where the plan's check asks for the times
  there as well as here: `AGENTS.md` keeps dated notes on the repository's own work out of the skills, so the review's
  fixes took the times out of the watch list, and they are here (O1).
- RE7.7-6, "could be 6 months", corrected in place, though the plan does not list it, because the claim misstated
  J3:1952.
- `docs/design.md` gained `Corrected` marks in the Formats' form, which it had not used before.
- `SKILL.md` is 2,485 words by `split()`, from 1,664 at main, past the Formats' target of about 1,500 and the review's
  of near 1,700 (O1). The build left it at 2,558. Counted from each section's heading line, the frontmatter and opening
  went from 512 at main to 473, Topics from 92 to 132, Precedence from 583 to 777 and the watch list from 477 to 1,103.
  The review's trim took the query times, read times and reading notes out of the watch list, and its fixes added the
  59(e) item, the time to appeal for any party and the qualifier on the plaintiff states, and a fix check's mark saying
  where a removed sentence went added 14 more, so the trim paid for the fixes and little more. The watch list and
  Precedence now hold this topic's dated events, the ruling, Taylor v. Kennedy, the time to appeal, a 59(e) motion, a
  stay, a supplemental interim final rule, govinfo's copy, the six months, CMS's response, the lookback and Colorado's
  draft, and its two conflicts. The orchestrator decided on 2026-10-30 to cut no further outside the review's findings,
  and moving each topic's conflicts out of Precedence into its topic file goes to the owner as a later decision.
- The open question on the list's cross-reference has the deck's page 7 among its Sources, though no row cites that
  page.
- The Taylor v. Kennedy item was corrected in place with its two dates, rather than given a second item.
- The Massachusetts v. Oz part of a Citation is not linked on the review pages, since no linker covers court
  entries and the plan asks for none.

Still unverified:

- Every check of the 37 rows, the 37 rule items, the three questions, the pointers and the corrections was made by an
  AI agent; no person with Medicaid policy knowledge has read them.
- That https://www.ssa.gov/OP_Home/ssact/title16b/1614.htm serves section 1614: curl with a browser User-Agent got
  403, as SSA's Compilation answers; the address follows the form of title 19's page. ssa.gov's copy of § 1614 was
  not read.
- How the former State plans under titles XIV and XVI defined permanent and total disability, and whom they paid;
  disabled-under-former-state-plan leaves both to the agency's determination, and no stored source holds the plans.
- Federal Rules of Appellate Procedure 4(a)(1)(B) and 4(a)(4)(A)(iv) and Federal Rule of Civil Procedure 59(e),
  read on the Legal Information Institute's pages on 2026-10-29 and 2026-10-30 for the time to appeal for any party
  and the 59(e) item, and 28 U.S.C. 2107, read there too; none is stored. The 59(e) item has no date, since Rule
  6(a)'s rule for a last day on a weekend or holiday was not read.
- What 42 U.S.C. 421(h), 421(k) and 423(d)(5), the Commissioner's regulations on substantial gainful activity, and
  the laws § 435.557(f)(2) names require; none is stored. That no stored file holds 42 CFR part 431 subpart F.
- The research's reading of which preamble passages tie a group to the vacated words, beyond each step's own read of
  those lines, and that the passages corrected in place, listed above, are every passage the ruling makes untrue; a
  grep of the analysis files for "gate", "significantly impair", "diagnosis alone" and "frail" found no other.
- CMS's renew-info pages (L2-14), read only through research L2 and not stored.
- Whether CMS has said anything on the ruling beyond what was read: medicaid.gov's community engagement page answered
  403 to the check of 2026-10-30, and on 2026-11-04 it answered over HTTP/2 and listed nothing posted after the frailty
  deck of 09/08/2026; CMS's newsroom and site map were read on 2026-10-30 and not since.
- The research for this increment's query times (19:48:59, 19:56 and 20:04:17 UTC) and its reading of the parties'
  briefs, which are not stored; Taylor v. Kennedy's schedule, from research L3, against entry 28 itself, not read;
  the docket results are RECAP's, and PACER was not checked.
- That CourtListener's docket page lists the three entries: the page was not opened, and the stored PDFs came from
  RECAP's storage addresses.
- That medicaid.gov refuses a simpler request for the deck, not tried; that the deck's slide numbers equal its PDF
  pages beyond the number printed at the foot of pages 10, 20 and 31.
- Federal Register pages were read from the XML's `PRTPAGE` markers, not the rendered pages.
- The research-sourced claims kept in the litigation paragraphs of `rule-extract.md` and `what-matters-most.md`,
  such as the complaint's counts and Taylor's filing.
- That the start-here rows match what the owner would pick.
- How the skill answers beyond these six runs: each question ran once on each model, and the orchestrator read the
  answers in the session logs; no person has read them.

Judgment calls each step made without asking, for the owner to overrule:

- Storing the orders: the manifest notes say the bytes match the docket check's copies, a time taken from the check's
  record, not timed again; that each PDF answered with no redirect from RECAP's archive copy, without claiming the
  docket page links it; they name no person, not even the judge; entry 149's note says what the judgment enters.
- Storing § 1614 and the deck: the name `42-usc-1382c-2024-edition-2026-10-29.html`, with the edition, since govinfo
  serves several, and `.html` as the other stored pages are named; `cited_url` the address fetched for both, as
  SMD 26-001's is; the govinfo note quotes the source credit's raw `&sect;1614`; the deck's note records the posting
  line and the PDF's own dates; both notes say the pages read beside them are not stored.
- Decision record 0013 and the SSA links: `SSA_URL` became a dict keyed by section, keeping its name; the test case
  cites `SSA 1614(a)(3)(A)`, the form the rows use; the design's bullet sits second, after the conflict rule; the
  Precedence item says the frailty items give the definition without the vacated words, which the review limited to
  the plaintiff states (R3-S2), and leaves the injunction, the six months and the upheld limits to the rows.
- The rows on § 435.554(c)(5): their 13 identifiers; each (A) to (E) row carries the vacated opening and cites entry
  148, reading decision record 0013's "every row an order touches"; medically-frail-defined's Rule says what is in
  force in the plaintiff states; State election `no` on both court rows, since being a plaintiff is a fact of the
  case, `yes` on (ii), (ii)(B) and (ii)(C), `no` on (ii)(A); all dangerous, the six-months row with both directions in
  its Note; Recheck dates 2026-12-28 on both court rows and 2027-04-29 on the six months, "final rule: including a
  supplemental interim final rule" on the vacatur row, and `state rule` on (ii), (ii)(B) and (ii)(C); L2-14's
  reversal written in the vacatur row, for the plaintiff states only; why no row carries the gate statements, "each
  explains words no longer in force in the plaintiff states"; Taylor's docket cited to this section and entry 142 to
  decision record 0013, not to scratch research; entry 147 lines 32 to 36 as the source that the States did not
  challenge the stable recovery carve-out; the preamble's :1188 and :1190 described as tied to the vacated words,
  not as fallen.
- The rows on § 435.557(f) and the preamble: their 13 identifiers; (f)(2) as two rows; five preamble rows, the plan's
  two and :1931, :1933 with :1952, and :1939, with :1940 to :1942, :1950, :1952's "could be 6 months" and "may
  reverify more frequently", and :1957 left as Note quotes; State election `yes` on (f)(1)(i), (ii) and (iii) and on
  the :1131, :1933 and :1939 rows; the (f)(2) rows dangerous, since a person told their records are unprotected may
  hold them back and one told the laws stop the State using its data may wait; the court-upheld sentence also on
  (f)(1)(i), though the memorandum names only (f)(1)(ii); (iii)'s Note saying neither suit names it and quoting
  § 435.557(d)(4); `state plan amendment` added to the Recheck of (i), (ii) and (iii), and `state rule` to the :1131
  and :1939 rows; (f)(1)'s Note cites SSA 1902(xx)(5) from the H.R. 1 copy.
- The rows on § 1614 and the deck: their 11 identifiers, the review's (F) row among them; (a)(2) as one row with its
  1972 and 1973 clause; (A) with (B), and (H) with (i) and (iii), (iii) because a redetermination under it can come
  after 19; (D), (E), (G) and (J) each a row; (F) cut on an inference about age, which the review reversed (R1-4);
  "this subchapter" read as title XVI, from the source credit; 42 U.S.C. 421(h), 421(k) and 423(d)(5) named and not
  described; Citations naming both SSA and 42 U.S.C.; State election `no` on every statute row and page 31, `yes` on
  pages 10 and 20; page 31's Note treats the deck as the stored source that
  settles "consecutive" at its tier, so no fourth open question; page 20's Note labels as an inference that
  functional assessment information may still bear on group (D); each deck Rule opens "CMS's frailty deck says".
- The questions and the watch list: the three titles; "the sources are silent" for the reach question; "CMS, or a
  policy person" for the six months, partly a legal reading; the briefs named by docket number, not by a scratch
  path; the five group rows and disabling-mental-disorder-examples in the reach question's Raised; the deck's page 7
  as a Source; Taylor's item corrected in place; the Colorado board item extended with an `Added` mark, not
  repeated; the stay item names no court; the lookback as its own item; the research's later search times recorded
  with the docket check's.
- The topic file and the page: the eight group headings and their order, the extract's except that the deck and
  preamble rows sit beside the provision each reads; the § 1614 group after the five groups; the opening's
  restatement of medically-frail-defined; "A state chooses ..." where a row's State election is `yes`; the 20
  start-here rows, section 12's rows, the rows on L2-14's reversal, L8-4, L1-7 and L1-12's four provisions, and the
  rows the fresh-session question names, with disabled-as-defined-in-section-1614 the one § 1614 row; the
  orientation naming both open questions on the ruling.
- The pointers and corrections: claims that stay keep their old words, followed by one sentence giving the preamble
  page and an `Added` mark, as increment 2.1 did; a claim carried only in a row's Note counted as not carried, so it
  stays; the guardianship claim marked Unverified in part, not corrected; RE7.7-6 corrected; RE4.2-17 and WMM4-3
  dropped with the pointer and left to the vacatur row's Note; WMM4's `Corrected` mark between its heading and its
  pointer, which the review moved after the pointer line, as the Formats order them (R3-N8); the labels "Active
  litigation" and "Contested" and the advice "Build medically-frail logic expecting it to move." kept, since Taylor
  is pending and an appeal is open; new prose says "vacated and set aside", names the plaintiff States for the
  injunction and calls the reach an open question; the design's tap correction cites
  decision record 0013 and the order, not the owner's approval of the words, which this section's Needs records;
  `Added` for the lines in 2.3, 2.6, 2.7 and 4, `Corrected` for 5; 2.6's line telling its rows to say the court
  upheld § 435.557(a)(vii) and (a)(viii), from decision record 0013; whitespace-only rewraps of two old correction
  lines; the three inherited rows left without `Corrected`.
- This entry: the old-wording search used the plan's four wordings, eight more and every old wording quoted in this
  increment's corrections; the deck's other claims grouped by page; the tests under the two Pythons run at the same
  time.
- The review's fixes, on 2026-10-29 and 2026-10-30, by step:
  - The rows (R1-1 to R1-3): the topic file's opening and the medically-frail-defined item say "and anyone acting
    for them or with them", shorter than the order's list; the Sources on entry 147's lines 24 and 28 quote only "in
    his official capacity as", so no official is named; the six-months Note says the order bars the defendants;
    the documents row keeps "may seek from an individual", resting on its Note's quote of deck line 372; that row's
    rule item names no section in its pointer, since the checker rejects a section number its row's Rule lacks.
  - § 1614(a)(3)(F) and the time to appeal (R1-4, R3-S3): the identifier disabled-under-former-state-plan; the
    Count II sentence in the Notes of the 8 rows whose Note says the court upheld their provision, and not in
    frailty-reverified-at-least-every-12-months, on whose (f)(1)(iii) the court did not rule; that sentence in
    Notes only, since each of those Rechecks already names an appeal; the (F) Note says nothing on how the former
    plans defined the term; "any party" rests on the Legal Information Institute's copy of 28 U.S.C. 2107.
  - The skill and the orientation (O1, R3-S2, R3-N4, R4-1, R2-1, R5-1, R5-3): the line holding the 2026-10-23
    correction mark rewrapped, its quoted words unchanged; no new mark for the case item's sentence on the RECAP
    check of 2026-10-23, which moved to increment 2.1's Done entry rather than being corrected; the (f)(1) rows
    named by rule rather than listed; disabling-mental-disorder-examples added to the supplemental rule item, since
    it now cites entry 148; the 59(e) item points at the appeal item's rows; the orientation's plain meanings,
    "cancel" among them; R5-1's heading as the review worded it; the case item's description of the entries, Taylor's
    list of challenged provisions, the lookback's description and the govinfo item's premise trimmed as well as the
    times.
  - The analysis files (R3-S1, R3-S5, R3-N5, R3-N7 to R3-N9): the N9 mark rather than restoring the old words, since
    "This is" would have no referent after the pointer; N7's words copied from section 2's (c)(5) row, keeping
    "enjoined CMS"; `docs/design.md` says "the time to appeal" without "for any party".
  - The citation pattern (R2-N5): no word for the boundary in the Formats, which already say a citation of any other
    section stays text; `\b` as the boundary, which also keeps a lettered section such as 1614A from linking to 1614;
    the two cases added as subtests of the existing test, so the count stays 358.
  - This plan (R3-S4, R3-N6, R2-2): the dated lines in 2.3, 2.6 and 2.7 edited without a mark, being new in this
    increment; the marks on Delivers and Deliberately not dated 2026-10-29, the review's date, though the clock read
    2026-10-30; Delivers' "the government's time to appeal" corrected in this step, the earlier steps having left
    it; Deliberately not pointing at the open question, which says what was read in the briefs, rather than at this
    entry, which does not.
  - The final run (R6-1, R6-2): the search made case-insensitive, which adds decision record 0013's "The
    government's time to appeal"; each old wording searched by a fragment without bold; "must not reverify" searched
    though R3-S1 as revised keeps it; no count of hits given, since the command finds its own lines here; the seven
    long Citation lines on the court-cited rows wrapped at 120 like prose. Left longer than 120: the skill's
    description, which is one line of frontmatter; its Topics line for this topic, which is a link and nothing else;
    three question headings in `open-questions.md`; and a URL line in the epic design.
- The orchestrator's, from the review to this entry:
  - Confirming the review's findings: R2-N5, a note, taken as should fix, since it is code this increment changed; R5-2
    rejected for this increment and offered to the owner, since it changes the Formats for every orientation; R2-N3,
    R2-N4, R2-N6 and R2-1's idea of failing the checker on a misspelled orientation identifier left for the owner as
    later work.
  - Fix step 3's pause: `SKILL.md` accepted at the 2,471 words the trim reached, 2,485 after the hand fixes, since it
    could not reach the target of about 1,700 the orchestrator had set; the stay and appeal items naming their rows by
    rule rather than listing them; nothing cut outside the review's findings; and moving each topic's conflicts out of
    Precedence left to the owner.
  - Fix step 4's pause: "must not reverify" kept, since 91 FR 33366 supports it, and only the citation of its sentence
    changed; `what-matters-most.md` line 166 left as it was.
  - The fix checks: their findings fixed by the orchestrator by hand rather than in another fix loop; FC-O7 rejected.
  - The fresh-session runs: once on each model for each question, after the fixes, and their lapses recorded without
    changing the skill.
  - The clause in `docs/design.md` under "What has to be true" that names this topic's corrections beside increment 1's
    and 2.1's, which the plan does not list; without it the sentence leaves them among the corrections that wait for
    their topics.
  - This entry's heading gives the day in UTC on which the increment landed, since every time in the entry is UTC.
  - The checks after this entry: the finding on decision record 0013's appeal wording rejected, as R3-S3 had left it;
    HCPF's pages named in increment 4's dated line, not in the skill's watch list, since increment 4 writes Colorado's
    frailty facts and the skill's rule items already give the definition in force in Colorado; the dates set at the
    commit to the day the increment landed.
  - Before the commit, on 2026-11-04: govinfo's copy of entry 147 not stored here, though decision record 0013 makes a
    copy whose bytes differ a source of its own, and offered to the owner as the next change; the watch list's item for
    2026-11-27 and the note of Colorado's state fact on renewal-notice-with-renewal-form, both older than this
    increment, left as they are and offered to the owner for a correction, since HCPF's deck has the Medical Services
    Board read the draft on 2026-12-11; KFF's and Georgetown's readings of the vacatur's reach left out of the open
    question, since CMS is the one who can answer it.

Review. The full review, on 2026-10-29, ran six mandates two at a time, each against its own source. The 36 rows and
their rule items against the stored sources, GPT-5.6 Sol: 2 blocking and 2 should fix. The checker, generator and tests
against the code, with 20 breaks in a clone, Claude Opus 5.5: 2 should fix and 5 notes; of the breaks, the 14 that
should fail did, 5 passed (a rule item's meaning changed, an open question deleted, a misspelled identifier in a
question's Raised, a rule item in the wrong topic file, a misspelled identifier in the orientation), and 1 failed only
until the pages were rebuilt. The corpus changes beyond the rows against the stored sources, the research and the
decision records, Claude Opus 5.5: 5 should fix and 9 notes; its search at about 23:30 UTC for anything published since
the ruling found nothing that changes a conclusion. A red team against the plan, decision records 0006, 0007 and 0013
and `docs/design.md`, GPT-5.6 Sol: 1 blocking, 4 should fix and 1 note. A cold reader, as a policy expert on the pages,
a fresh session and the next session, GPT-5.6 Sol: 2 should fix and 2 notes. A do-it reviewer carrying out the plan's
checks, `CONTRIBUTING.md`'s and the README's commands and one stored order's manifest commands in a clone, Claude Opus
5.5: 1 should fix and 1 note. That is 37 as reported: 3 blocking, 16 should fix and 18 notes. Each was checked against
the files: 35 were confirmed, 1 was confirmed in part and 1 was rejected for this increment. The orchestrator added
three of its own: `SKILL.md`'s size, a byte count in a memory outside the repository, and its own miscount of the rows
with a State election, 10 where there are 11, in a report to the owner. Six issues were raised by more than one
reviewer, and a seventh, `SKILL.md`'s size, by a reviewer and the orchestrator. The blocking ones were the preamble's
examples of disabling mental disorders, given without half their condition and with no order cited, and the deck's
documents row, which kept a trigger from tiers resting on the vacated words, raised by two reviewers. The rejected one
was linking each open question the orientation names to its own heading, which changes the Formats' rule for every
orientation, and is offered to the owner instead. The one confirmed in part was the claim that States must not reverify
American Indian status: it holds on the preamble at 91 FR 33366, which neither the reviewer nor the orchestrator had
read, so only its citation changed; the fix step found it. One decided fix fell short: `SKILL.md` came to 2,485 words,
where the orchestrator had set about 1,700, as the deviations say. Not fixed here, and offered to the owner: the checker
passes when an open question is deleted, when a question's Raised names no row, when a rule item sits in another topic's
file and when an orientation misspells an identifier; and docket-entry citations do not link on the pages. A fix loop of
seven steps applied the rest. The fixes then had two checks, one per model family, each against the log's decided fixes
and the stored sources. GPT-5.6 Sol: 2 should fix and 1 note, with every count in this entry recounted and matching. The
should fix were the four places, the dated lines in 2.3, 2.6 and 2.7 and this entry's line on them, that said "only one
of those stops row work", which read as one particular event and now say "any one of those"; and the stored § 1614
page's size, still wrong in the orchestrator's scratch notes and in a memory outside the repository after the
orchestrator had found it (O2), both corrected. The note was this paragraph and the fresh-session results, still to be
written. Claude Opus 5.5 found every fix applied as decided, with 3 should fix and 8 notes. The should fix were
disabling-mental-disorder-examples' rule item, whose "It says" read as the court after the new sentence and now says
"The preamble says"; a row and its item that spoke of "the definition's words that the second of those conditions
applies", now "on which the second of those conditions rests"; and this entry's count of 21 rows on the two paragraphs,
where there are 19. Seven notes were taken: the skill's mark quoting only "On" for a removed sentence now says where the
sentence went; a search fragment that spanned bold markers, and so could match only its own line, now avoids them;
medically-frail-defined's Rule names the defendants as the order does, as its sibling court rows do; the documents row
has a Source for its "from an individual"; the vacatur row's Note says the rules on the time to appeal are not stored
and that a timely 59(e) motion would restart it; two of the orientation's plain-language sentences say what is cancelled
and which rows say what; and a topic item says the order "states no end date for either", as its row does. One was
rejected: `open-questions.md` line 368's "enjoins CMS from penalizing" is true, and R1-3 leaves prose that names CMS
alone as it is. The orchestrator made these fixes by hand, each an exact replacement asserted once, and diffed the files
against snapshots taken before. A first script refilled whole paragraphs beyond the changed lines; its files were
restored from the snapshot and the fixes redone, refilling only the changed item. After the hand fixes the pages were
rebuilt, the checker printed 163 rows and 0 warnings under both Pythons, and the tests passed, as the first list says.

After this entry was drafted, on 2026-10-30, two more checks ran, each on GPT-5.6 Sol and read-only: one on sources the
review had not had, one on text no reviewer had seen. The first looked for anything since the ruling, in RECAP's two
dockets and the First Circuit, CMS's newsroom and site map, the Federal Register and its public inspection list, HCPF,
the Medical Services Board, the Colorado Attorney General and published analyses, and read the parties' briefs against
what the corpus says of them: 2 should fix and 2 notes. It found nothing filed or published since that changes a row,
though medicaid.gov answered 403. The briefs say what the corpus says they say: both sides argued that vacatur reaches
every state (entry 104, ECF page 36; entry 138-1, ECF page 41), and the government that CMS is likely to reimpose the
provisions by a supplemental interim final rule (entry 142, ECF page 19). Of its should fix, one was rejected: decision
record 0013's "The government's time to appeal" is true of the government, an accepted record is superseded rather than
edited, and the review had left it under R3-S3. The other was taken: HCPF's work-requirements page and its FAQ still
list the medically frail conditions for a person "for whom their condition prevents them from completing 80 hours per
month of work, school, and/or volunteer activities", and increment 4's dated line now names both pages. The second read
the hand fixes, this entry's new text, the design clause and the commit message: 5 should fix and 1 note, and it found
the hand fixes matched their findings and sources. The should fix were `SKILL.md`'s count, 2,485 words where this entry
said 2,471, since a hand fix added 14; Claude Opus 5.5's last answer to the bipolar question, which, sent after a first,
named no skills; this paragraph's count of confirmed findings, which had left out the rejected one; the commit message's
claim that every other finding was applied; and the dates that hold only if the increment lands on the day this entry's
heading gives. The first four were taken. The dates were set at the commit to the day the increment landed, 2026-11-04.
The note, that the watch list lacks the query times the plan's check asks for, was already among the deviations.

Before the commit, on 2026-11-04, the orchestrator checked the sources again, since four days had passed; the dockets
are above. govinfo had published entry 147 as granule USCOURTS-mad-1_26-cv-12962-1, dated 2026-10-29: 281,447 bytes
where the stored copy is 187,147, with the same 16 pages and the same 3,693 words in the same order by pypdf's
extraction. The Federal Register held one CMS document since 2026-10-29 that mentions community engagement, a Privacy
Act notice of a matching program, and none that mentions medically frail; its public inspection list held one CMS
document, a correction to a notice of information collection. medicaid.gov's community engagement page, which answered
over HTTP/2, lists nothing posted after the frailty deck of 09/08/2026, and the deck's bytes match the stored copy.
HCPF's two pages had the same text as on 2026-10-30. The Medical Services Board's page lists its next meetings as
November 13 and December 11. HCPF's deck of 2026-09-28, which is not stored, has updated draft language submitted to the
Board on November 27 and an emergency reading at its meeting of December 11 (page 30; research L5, line 45), where the
skill's watch list says the Board takes up the draft on 2026-11-27 and the note of Colorado's state fact on
renewal-notice-with-renewal-form says a Board reading that day; both are older than this increment. KFF and Georgetown's
Center for Children and Families, both on 2026-11-02, read the vacatur as reaching every state, and KFF says HHS had not
announced whether it would appeal. None of it changes a row.

## 2.3 Exceptions for a month: mandatory exceptions, and optional short-term hardship exceptions

### Delivers

- Before any row on § 435.555(d)(2)(i) or (iv), which the Massachusetts v. Oz complaint names and its motion for summary
  judgment does not press, the dockets in Massachusetts v. Oz, D. Mass. 1:26-cv-12962, and Taylor v. Kennedy, D. Md.
  1:26-cv-03705, checked, under increment 2.1's outcome rule, with the results in the Done entry and the skill's watch
  list (decision record 0007).
  (Added 2026-10-29: Massachusetts v. Oz was decided and dismissed on 2026-10-29. The owner's decision of that day and
  decision record 0013 settle the outcome for entries 147 to 149, so its check looks for an appeal, a stay or a new
  order, and any one of those stops row work under the outcome rule. Taylor v. Kennedy's docket is checked as before;
  decision record 0013; read in docs/domain/sources/courts/massachusetts-v-oz-1-26-cv-12962-149.txt:20.)
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
  (Added 2026-10-29: Massachusetts v. Oz was decided and dismissed on 2026-10-29. The owner's decision of that day and
  decision record 0013 settle the outcome for entries 147 to 149, so its check looks for an appeal, a stay or a new
  order, and any one of those stops row work under the outcome rule. Taylor v. Kennedy's docket is checked as before.
  The court's memorandum, entry 147, upheld § 435.557(a)(vii) and (a)(viii), the twelve-month lookback, at page 12,
  so each row's Note says so, with Taylor v. Kennedy, which still challenges them; decision record 0013; read in
  docs/domain/sources/courts/massachusetts-v-oz-1-26-cv-12962-147.txt:110 and :284 to :286.)
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
  (Added 2026-10-29: Massachusetts v. Oz was decided and dismissed on 2026-10-29. The owner's decision of that day and
  decision record 0013 settle the outcome for entries 147 to 149, so its check looks for an appeal, a stay or a new
  order, and any one of those stops row work under the outcome rule. Taylor v. Kennedy's docket is checked as before;
  decision record 0013; read in docs/domain/sources/courts/massachusetts-v-oz-1-26-cv-12962-149.txt:20.)
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
and Spanish letter templates, each stored with its retrieval date. (Added 2026-10-29: Colorado's facts on how
medically frail status is shown are read against the adopted rule and against the injunction in Massachusetts v. Oz,
which bars CMS from applying to Colorado, a plaintiff, the vacated words of § 435.554(c)(5)(i). The draft's definition
adds its own condition, "special medical needs that cause significant impairment to work, volunteer, or attend school"
(draft lines 1213 and 1214), which the adopted rule may keep or drop; decision record 0013; read in
docs/domain/sources/courts/massachusetts-v-oz-1-26-cv-12962-148.txt:29.) (Added 2026-10-30: HCPF's work-requirements
page, https://hcpf.colorado.gov/hr1-medicaid-work-requirements, and its FAQ, https://hcpf.colorado.gov/hr1-faqs, which
says it was updated September 21, 2026, both read on 2026-10-30 and not stored, still list the medically frail
conditions for a person "for whom their condition prevents them from completing 80 hours per month of work, school,
and/or volunteer activities". They are read against the injunction too; check of 2026-10-30, since the ruling,
finding 2.)

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

The design phases states in, starting with Colorado. Colorado's rule is a draft whose updated language goes to its
Medical Services Board on November 27, 2026, for an emergency reading on December 11, and the research found its
hardship and seasonal-income positions still open (research L5, findings 10 and 11), so its facts need a recheck date in
the watch list, and some will be `not published`. (Corrected 2026-11-04: said "a draft due before its Medical Services
Board on November 27, 2026"; ledger L5-1.)

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
correct, and from errors found after 2026-10-16 (decision record 0006). The watch list holds Massachusetts v. Oz,
decided on 2026-10-29, with the time to appeal and any request to stay, Taylor v. Kennedy, the IRS proposed rule open
for comment until November 30, 2026, Colorado's rule, SNAP's pending rule, and the next eCFR check. (Corrected
2026-10-29: said "The watch list holds the Massachusetts v. Oz hearing on October 22, 2026,"; decision record 0013; read
in docs/domain/sources/courts/massachusetts-v-oz-1-26-cv-12962-149.txt:20.)

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
