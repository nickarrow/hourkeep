# HourKeep content standard

## Writing principles

HourKeep is a free, open-source app for people on Medicaid facing the new work requirements. Our main reader is an adult
aged 19 to 64 who has a letter from Medicaid with a deadline on it. They read on a phone, at about a sixth to eighth
grade level, and they are often worried. They are more likely than most people to use a screen reader, magnification or
voice control.

We also write for:

- people who help them, such as a relative, a church or food bank volunteer, a navigator or a legal aid worker
- caseworkers, who read the package
- Medicaid policy experts, who read the review pages

(`docs/design.md`, "Who it is for"; for the policy experts, decision record 0005)

When these readers need different words, write for the person on Medicaid.

This standard covers every word in HourKeep: the screens, the printed package, the site at hourkeep.app and the review
pages. It adds to "How to write it down" in `AGENTS.md`. Where it differs from the four rules in `AGENTS.md`, under
"What the software may decide", or from a row, those win.

Where a rule comes from outside HourKeep, it names its source:

- the eAPD content guide, written by the CMS and 18F team that built the Advance Planning Document app:
  [`eapd-wiki/Content-guide.md`](https://github.com/nickarrow/eapd/blob/ae50d8da9f766bdd5d1cccf977e9badb6764097a/eapd-wiki/Content-guide.md),
  in the public domain
- the [18F content guide](https://guides.18f.org/content-guide/), archived since January 20, 2025
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- a HourKeep document

A rule that names no source is HourKeep's own, and the owner decides whether to keep it.

## Voice and tone

- Write to one person. Use "you" (HourKeep's own). Start instructions with a verb (eAPD, "Instructions"). Use
  contractions (18F, ["Voice and tone"](https://guides.18f.org/content-guide/our-style/voice-and-tone/)). Write the way
  you would talk to the reader in person (18F, ["Use plain
  language"](https://guides.18f.org/content-guide/our-approach/plain-language/)).
- Put what the person has to do at the start of the sentence.
- Write for someone new to this. The reader has never seen this form. Write directly and personally.
- Explain a term the first time you use it (18F, "Use plain language"). Keep using that term if the reader will see it
  on a letter or hear it on a call. For example: `You can appeal. This is called asking for a fair hearing.`
- Give enough detail to act. Use examples. Name exactly what to gather, even if the sentence gets longer (eAPD, "Voice &
  Tone").
- Say that HourKeep cannot see or change anyone's case, and that it is not part of Medicaid or any government agency
  (`docs/design.md`, "What has to be true"; `public/index.html`). Say it, and that HourKeep is free, on the first
  screen, on the package's first page, and anywhere a person might think HourKeep sends things to the state (HourKeep's
  own).

The site at hourkeep.app already writes this way:

> Don't wait for this app. Contact the office that sent your letter, using the phone number on it. Look for a deadline
> on the letter. Before that date, do what the letter asks, or contact the office if you can't or aren't sure how. If
> you can't find a date, call and ask.

Aim for a sixth to eighth grade reading level (`docs/design.md`, "Who it is for"). Use a readability score to find hard
sentences (HourKeep's own), and test with real readers to learn whether they understand (`docs/design.md`, "What
counts as working").

## Keep each rule's meaning

Each rule HourKeep explains comes from a row in `docs/domain/community-engagement-extract.md`.

- Name the row. In the source code, put a comment next to each sentence about a rule. The comment names the row.
  `public/index.html` cites the regulation in one comment block at the top, written before there were any rows, so it
  does not yet name rows next to sentences. If a sentence is general advice, the comment says so. If the row is missing
  or unverified, hold the sentence until the row is verified (`CONTRIBUTING.md`, "House rules").
- Match the row. A plain sentence can be shorter than its row. It must apply to the same people. Before you publish a
  sentence, read the row's Error direction and Note. A row marked `dangerous` means a wrong sentence could lead someone
  to do less than the rule asks, and lose their coverage. `burdensome` means it could lead them to do more. A rule that
  could go wrong in either direction is marked `dangerous` (`docs/epics/0001-policy-corpus/design.md`, "A rule row").
- Use the row's words for must, may and should. Keep every deadline, condition, exception and appeal the row includes.
- Check outside wording before you reuse it. Check wording from CMS or a state against the row. CMS's state pages say
  people "already meet" SNAP work requirements. Colorado's pages say people are "complying with" them. The rule says
  "not exempt from" a work requirement (row `snap-household-member-not-exempt-from-work-requirement-excluded`;
  `docs/design.md`, "What it will not do").

The prototype in [pull request #1](https://github.com/nickarrow/hourkeep/pull/1) had two sentences that did not match
their rows:

| Sentence | Rows | Problem |
| --- | --- | --- |
| `I care for a child 13 or younger` | `parent-guardian-caretaker-relative-or-family-caregiver-excluded`, `family-caregiver-living-with-care-recipient`, `family-caregiver-relative-living-apart`, `family-caregiver-unrelated-living-apart-80-hours` | A neighbor who babysits a few hours a week would tap it. The exclusion covers that neighbor only if they give at least 80 hours of care a month. |
| `Someone in my home gets SNAP, also called food stamps` | `snap-household-member-not-exempt-from-work-requirement-excluded` | The exclusion covers a person only if they are in the household that gets SNAP and are subject to SNAP's work rules. A person who is exempt from those rules would tap it and stop gathering proof. |

The owner decides any change to what a sentence says about a rule.

### Leave decisions to the state

HourKeep does not say whether the rule applies to a person or whether they have met it. The state decides (`AGENTS.md`;
`docs/design.md`).

| Instead of | Write |
| --- | --- |
| `You're exempt` | `This may mean the rule does not apply to you. The state decides. Tell the state about this, and send what you have.` |
| `You meet the requirement` | `Logged: 85 hours. Threshold: 80 hours.` |
| `You don't need to do anything` | `Tell the state about this, and send what you have.` |
| `Submitted` or `Sent to the state` | `Saved on this device` |

- Show each exclusion as a statement the person can tap, with no Yes or No buttons. The design puts them all on one
  screen (Proposed).
- If a person skips an exclusion, save and print nothing about it (Proposed).
- Do not ask a person to say they are not meeting the requirement. The state can use that answer against them
  (`docs/design.md`, "What may mean the rule does not apply"; Proposed).
- Give every number one of the three labels in `docs/design.md`:
  - Computed: show the formula and the citation, such as `38 + 41 + 6 = 85`.
  - Conditional: name the state's choice the number depends on.
  - Deferred: never computed. Ask the screening question and name who to ask.
- Whether the rule applies to someone, and whether they met it, is always Deferred.
- Do not use green or red to show whether a person met the requirement.

### Letters and deadlines

- Ask what the letter says. States give the same kind of letter different names (`docs/design.md`, "The letter").
- Show the deadline printed on the letter first, every time. HourKeep also counts the days to check that date. If the
  two dates differ, say so. Tell the person to meet the printed date and to contact the office that sent the letter.
- Write `Look for a deadline on the letter`. A notice of noncompliance must clearly state its deadline (row
  `notice-states-the-deadline`). Other letters may have none (`public/index.html`, source comment).

### Name the requirement

Call it "work requirements." The first time it appears on a screen, add "also called community engagement." Letters may
use either name. CMS's own focus group research recommends "work requirements" (`docs/design.md`, "Spanish", research
L2-16).

## Style

Where this standard and `AGENTS.md` say nothing, follow the AP Stylebook. This standard differs from AP in three places:
dates spell out the month, every number is a numeral and there are no em dashes.

### Acronyms and abbreviations

- Spell out an acronym the first time it appears on a screen. If it appears only once or twice, use the full words
  (eAPD, "Acronyms and abbreviations").
- The first time SNAP appears, add "also called food stamps." On screens, write "the federal government" in place of
  CMS. Where the state acts, write "your state Medicaid office," since "Medicaid" alone can mean either. HourKeep's own.

### Capitalization

- Use sentence case for headings, step titles, buttons and labels. End headings without a colon (18F,
  ["Capitalization"](https://guides.18f.org/content-guide/our-style/capitalization/)).
- The eAPD guide used title case so analysts could scan a sidebar. HourKeep runs on a phone with no sidebar, and
  sentence case is easier to read there.

### Numbers

- Write numbers as numerals. Rewrite a sentence or heading that would start with a number (eAPD, "Numbers").
- Use the % sign (eAPD, "Numbers").
- Show money to the cent, exactly as it appears on the document. Rounding can mislead. If the limit is $580, an amount
  of $579.60 rounds to $580 and looks like it meets the limit. When HourKeep works out an amount itself, show the
  formula, so any rounding is visible. HourKeep's own.
- In math, use `+`, `=` and `×`. HourKeep's own.

### Dates

- Write dates for people month first, with the month spelled out: `January 1, 2027`. In Spanish: `1 de enero de 2027`.
- Write dates in file names and record IDs as year, month, day: `2027-01-01`. HourKeep's own.

### Punctuation and text styling

- Leave out the comma before the last "and" or "or" in a simple list, as AP does:
  `hours, weeks and months`. Keep it when an item has its own "and," or when the list would be unclear without it.
- Put one space after a period (eAPD, "Punctuation and text styling").
- Avoid ampersands (eAPD, "Punctuation and text styling"). Write "and" instead.
- Use curly quotation marks and apostrophes (`‘’` and `“”`) on the screens, in the package and on the site (eAPD,
  "Punctuation and text styling"). The rows quote their sources with straight marks, and the review pages show them as
  they are.
- Call a button or step by its exact name on screen (18F, ["Technical and interface
  writing"](https://guides.18f.org/content-guide/our-style/technical-and-interface-writing/)). Put the name in quotation
  marks. That is HourKeep's own: eAPD used italics, and GOV.UK uses bold when the text tells the reader to select a
  button. Do not use italics (GOV.UK, ["A to Z of GOV.UK
  style"](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style)).
- Use a comma or a period where you might use an em dash (`AGENTS.md`).

## Content elements

### Steps

- **Step title.** Appears in the progress bar. Keep it under 35 characters so it fits on a phone. Use a few words that
  name the step, such as `Your letter` or `Your proof` (eAPD, "Sections").
- **Step description.** Every step has one. Start it with a verb, such as `Add`, `Check` or `Tell`. Use 50 words or
  fewer to say what the step is for (eAPD, "Sections").

Give each step a title that fits that step alone. Words like `Overview`, `Details` and `Information` fit any step, so
choose more specific words.

### Instructions

An instruction comes before most fields. It has four parts. Keep the parts separate so the screen is easy to scan (eAPD,
"Instructions").

- **Heading** (`heading`). Names a part of the screen in a few words.
- **Short instruction** (`short`). One sentence that tells the person what to do with the fields below it. It appears in
  bold. Leave out "please": the eAPD guide, citing the CMS Design System, says to limit it, and HourKeep goes further.
- **Detail** (`detail`). One or two sentences that explain how, or give an example.
- **Help text** (`helpText`). Useful information that is separate from the instruction. It appears next to the field or
  step it is about, in a style that sets it apart from the text around it.

### Fields

- **Field label.** Name what goes in the field (eAPD, "Fields"). Write `Date on the letter` in place of
  `Enter the date on your letter`. Write `Hours a week` in place of `How many hours did you work each week?`
- **Yes or No question.** Write the label as a question that ends with a question mark. The person can then see what
  they are answering (eAPD, "Fields").
- **Exclusions.** Use a statement the person can tap, as described in "Leave decisions to the state."

### Buttons and links

- Use sentence case. Name the action and the thing it acts on: `Print this package`.
- If a button takes the person to another step, name that step on the button. HourKeep's own.
- Write link text that names the page it opens, such as `Find your state's Medicaid phone number` (WCAG 2.2,
  2.4.4 and 2.4.9, the second at Level AAA).

### Messages

Every error and warning tells the person three things: what happened, what it means for them and what to do next. A
confirmation says what HourKeep did, such as `Saved on this device`. HourKeep sends nothing, so do not say it "sent,"
"submitted" or "received" anything (`docs/design.md`, "Keeping records safe"). A row may still use "received" for the
notice. The rule considers a notice of noncompliance received 5 days after the date on it, unless the person shows they
did not receive it within those 5 days (row `notice-presumed-received-after-5-days`; `docs/design.md`, "The letter").

### Screen readers

- Use real heading elements, in order.
- Show every status with words as well as color or an icon (WCAG 2.2, 1.4.1).
- Give each photo of a document alt text that names it, using the tag the person chose: `Pay stub, January 2027`.
- Give each table of months column headers.

### The package

The package is what a person sends to the state, reads to a caseworker on the phone or takes to an office.
`docs/design.md` sets its rules in "The package":

- It prints clearly in black and white.
- Every page shows the person's name, the month and the page number.
- The first page summarizes the package and names the HourKeep release that made it (Proposed).
- Every page and document has a number (Proposed).
- The screen and the printout match page for page (Proposed).
- It ends with a plain line for a signature and a date, not a sworn statement. From 2028 a sworn statement of medical
  frailty can be accepted only once per period of enrollment (42 CFR 435.557(f)(1)(ii)).

Report hours against the threshold and add no conclusion: `Logged: 85 hours. Threshold: 80 hours.`

Fill every empty field with `Not added.` A blank space or a zero can look like an answer. The eAPD guide used "No
response was provided" and "not specified," but in a package a caseworker reads, a "response" is the answer to the
notice, and "not specified" can read as if the letter left the date out.

Leave exclusions the person did not tap out of the package. If none is tapped, leave the section out, rather than
printing a phrase in its place. Listed as unanswered, a skipped question would look like a "no" on paper.

## Spanish

HourKeep will have Spanish at launch. Write every string so it can be translated (`docs/design.md`, "Spanish").

- Use "usted," as `public/index.html` does.
- Call the requirement "requisitos de trabajo." CMS's Spanish summary of the same research advises against
  "compromiso comunitario" and "participación comunitaria," as the English research does against "community
  engagement" (research L2, E7). Match what Spanish letters actually say, once someone has read the Spanish.
- Translate the meaning of the rule. Then check the Spanish against the row. Colorado's Spanish letter uses "al menos a
  tiempo parcial" for "at least half-time." The Spanish phrase means "at least part time." A person reading it could
  count less school than the rule requires (`docs/design.md`, "What it will not do", research L5-19).
- When Spanish text links to an English page, add `(página en inglés)`.
- When you change a string in one language, change it in the other language in the same commit. HourKeep's own.
- A person must read the Spanish before launch. Until then, a comment in the source says that AI wrote and checked the
  Spanish, as `public/index.html` does.

## The site and the review pages

- On the site, cite every claim in a comment in the source. Show the month the page was last updated.
  `public/index.html` does both. Check each link on the date you cite it.
- A script builds the review pages from the rows. Their own wording is in `scripts/review_pages/`. A row's text changes
  only through the corpus, against its source. Policy experts read these pages, so use the rule's own terms, in plain
  sentences.

## Check your copy

- Compare each sentence about a rule with its row, including the Error direction.
- Read every screen on a phone, with a screen reader and at 200% zoom, in English and in Spanish (`docs/design.md`,
  "What counts as working"; WCAG 2.2, 1.4.4).
- Use automated checks to find wording problems. Test with people to learn whether they understand the screen.
- The final test is whether people at a partner organization can use HourKeep without training (`docs/design.md`, "What
  counts as working", where which organization, and when, is Open).
