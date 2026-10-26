# HourKeep Draft Content Guidelines

## Writing principles

HourKeep is a free, open source app for people on Medicaid facing the new work requirements. The primary user is an adult aged 19 to 64 who usually has a letter with a deadline. They read on a phone, at about a sixth to eighth grade level, and are often worried. They are more likely than most to use a screen reader, magnification or voice control. Next is the person helping them: a relative, a church or food bank volunteer, a navigator, a legal aid worker. A caseworker reads the package. Medicaid policy experts read the review pages (`docs/design.md`, "Who it is for").

When these readers need different things from the same words, we write for the person on Medicaid.

This standard covers every word a person reads in HourKeep: the screens, the printed package, the site at hourkeep.app, and the review pages. It builds on "How to write it down" in `AGENTS.md`. Rules that come from the eAPD content guide or the 18F content guide name their section. Rules marked HourKeep's own have no outside source, and the owner can accept or change them.

## Voice and tone

- **Talk to one person.** Write to "you", in the imperative, with contractions. Picture the reader and write as if you were talking with them across a table (18F, "Use plain language").
- **Lead with the action.** Put nothing in front of what the person has to do.
- **Assume no expertise.** The eAPD guide asked for direct language without familiarity, because its readers were analysts who knew the form. HourKeep's reader has never seen this form, so we write directly and personally.
- **Explain terms, then keep them.** Explain a term the first time it appears (18F, "Use plain language"). Keep the term when the person will meet it again on a letter or a call: `You can appeal. This is called asking for a fair hearing.`
- **Give the detail a person needs to act.** Use examples. A longer sentence that names exactly what to gather is fine (eAPD, "Voice & Tone").
- **Say what HourKeep is.** Wherever HourKeep collects something, say that it is free and is not part of Medicaid or any government agency. Say that it cannot see or change anyone's case (`docs/design.md`, "What has to be true").

The published page already writes this way:

> Don't wait for this app. Contact the office that sent your letter, using the phone number on it. Look for a deadline on the letter. Before that date, do what the letter asks, or contact the office if you can't or aren't sure how. If you can't find a date, call and ask.

Aim for a sixth to eighth grade reading level. A readability score can point to a hard sentence. Only people reading the screen can show that they understood it (`docs/design.md`, "What counts as working").

## Keeping the rule's meaning

- **Name the row.** Every sentence that tells a person what a rule says names the row it rests on, in a source comment next to the string. `public/index.html` does this in an HTML comment. A sentence with no row is plain advice and says so in its comment, or it waits until its row exists and is verified (`CONTRIBUTING.md`, "House rules").
- **Cover the same people as the row.** A plain sentence can be shorter than its row. It has to cover exactly the people the row covers. Before a sentence ships, read the row's Error direction and Note. A row marked dangerous means a sentence that drifts in either direction leaves someone worse off.
- **Keep the force.** Keep "must", "may" and "should" as strong as the row has them. Keep every deadline, condition, exception and appeal.
- **Check wording from outside.** Check a state's or CMS's consumer wording against the row before reusing it. CMS's state pages say people "already meet" SNAP work requirements, and Colorado's member pages say "complying with" them. The rule says subject to (`docs/design.md`, "What it will not do").

The first prototype had two sentences that drifted:

| Sentence | Rows | What happens |
| --- | --- | --- |
| `I care for a child 13 or younger` | `parent-guardian-caretaker-relative-or-family-caregiver-excluded`, `family-caregiver-living-with-care-recipient`, `family-caregiver-relative-living-apart`, `family-caregiver-unrelated-living-apart-80-hours` | A neighbor who babysits a few hours a week taps it. Someone who neither lives with the child nor is a relative is outside the rule only with 80 hours of care a month. |
| `Someone in my home gets SNAP, also called food stamps` | `snap-household-member-not-exempt-from-work-requirement-excluded` | The rule needs the person to be a member of the household that gets SNAP, and not exempt from SNAP's work rules. A person who is exempt taps it and stops gathering proof. |

Changing what a sentence tells a person about a rule is the owner's call.

### Never state anyone's status

HourKeep never says whether the rule applies to a person or whether they have met it. The state decides (`AGENTS.md`; `docs/design.md`).

| Instead of | Write |
| --- | --- |
| `You're exempt` | `This may mean the rule does not apply to you. The state decides.` |
| `You meet the requirement` | `Logged: 85 hours. Threshold: 80 hours.` |
| `You don't need to do anything` | `Tell the state about this, and send what you have.` |
| `Submitted` or `Sent to the state` | `Saved on this phone` |

- An exclusion is a statement the person taps. It is never a `Yes` and `No` pair.
- Skipping an exclusion is never saved or printed as a no. No screen asks a person to say they are not meeting the requirement, because a casual no can be used against them (`docs/design.md`, "What may mean the rule does not apply").
- Every number carries one of the three labels in `docs/design.md`. Computed numbers show their arithmetic in full: `38 + 41 + 6 = 85`. Conditional numbers name the state's choice they depend on. Deferred numbers name who to ask.
- Green and red never mean met and not met.

### Letters and deadlines

- Ask what a letter says, never what it is called. States give the same notice different titles (`docs/design.md`, "The letter").
- The deadline printed on the letter comes first every time it appears. HourKeep's own count is a cross check. When the two differ, say so, and tell the person to meet the printed date and ask the office that sent the letter.
- Write `Look for a deadline on the letter`. Only a notice of noncompliance has to carry one (`public/index.html`, source comment).

### Naming the requirement

Lead with `work requirements`, and add `also called community engagement` the first time on a screen. The letter may say either, and CMS's own focus group research recommends the plain name (`docs/design.md`, "Spanish", research L2-16).

## Style guidelines

### Acronyms and abbreviations

- Spell out an acronym the first time it appears on a screen. If it appears only once or twice, write the words instead (eAPD, "Acronyms and abbreviations").
- SNAP gets `also called food stamps` the first time. CMS stays off the screens. HourKeep's own.

### Capitalization

- Use sentence case for headings, step titles, buttons and labels, with no trailing colon (18F, "Capitalization").
- The eAPD guide used title case for section titles so analysts could _scan_ a sidebar. HourKeep has no sidebar, and sentence case is easier to _read_ on a phone. Proposed.

### Numbers

- Use numerals. Avoid starting a sentence or heading with a number (eAPD, "Numbers").
- Use the `%` sign (eAPD, "Numbers").
- Show money exactly as it appears on the person's document, to the cent. A rounded figure next to an income threshold can look like it crosses the line when it does not. HourKeep's own.
- Shown arithmetic uses `+`, `=` and the multiplication sign `×`. HourKeep's own.

### Dates

- Dates a person reads are month first: `January 1, 2027`. In Spanish: `1 de enero de 2027`.
- Dates that name a file or a record use ISO: `2027-01-01`. HourKeep's own.

### Punctuation and text styling

- Use the Oxford comma.
- Add a single space after each period.
- Avoid ampersands.
- Use curly quotation marks and apostrophes (`‘’` and `“”`).
- Refer to a button or a step by its exact name on screen (18F, "Technical and interface writing"), in _emphasis_. Use quotation marks only when quoting something (eAPD, "Punctuation and text styling").
- No em dashes (`AGENTS.md`).

## Content elements

### Steps

- **Step title.** Shows in the progress bar. Keep it under 35 characters so it fits a narrow screen. A step title names a place in the flow and is not an active verb (eAPD, "Sections").
- **Step description.** Every step has one. Lead with an imperative verb: `Add`, `Check`, `Tell`. Keep it under 50 words and say what the step is for (eAPD, "Sections").
- A title that could sit on any screen tells the person nothing. `Overview`, `Details` and `Information` don't work.

### Instructions

Most fields come after an instruction. Keep its four parts separate, so a screen never becomes one long paragraph (eAPD, "Instructions").

- **heading.** Names a part of the screen. Not a sentence.
- **short.** One imperative sentence telling the person what to do with the fields that follow. Renders as strong text. Keep `please` out (eAPD, citing the CMS Design System).
- **detail.** One or two sentences on how, or an example.
- **helpText.** Useful to know, but doesn't tell the person what to do. Appears with the field or step it refers to, and looks different from the text around it.

### Fields

- **Field label.** Exactly what the field is. A label, not an instruction (eAPD, "Fields"). For example: `Date on the letter` instead of `Enter the date on your letter`, and `Hours a week` instead of `How many hours did you work each week?`
- **Yes or No label.** A question ending in a question mark, so it's clear what the person is affirming (eAPD, "Fields").
- **Exclusions.** A tappable statement. Never a `Yes` and `No` pair, as above.

### Buttons and links

- Use sentence case. Name the action and what it acts on: `Print this package`.
- A button that leaves a step says where it goes. HourKeep's own.
- Link text names where it goes. `Here` and `Learn more` don't (WCAG 2.2, 2.4.4).

### Messages

An error, a warning or a confirmation says what happened, what it means for the person, and what to do next. A confirmation names only what HourKeep did. HourKeep sends nothing anywhere, so no message says something was sent, submitted or received (`docs/design.md`, "Keeping records safe").

### What a screen reader needs

- Use real heading elements, in order.
- A state never rests on color or an icon alone (WCAG 2.2, 1.4.1).
- A photo of a document gets alt text naming what it is, taken from the tag the person chose: `Pay stub, January 2027`.
- A table of months has column headers.

### The package

The package is what a person hands to the state, reads to a caseworker on the phone, or carries into an office. Its rules are in `docs/design.md`, "The package". It works on paper and in black and white. Every page names the person, the month and the page number. The first page summarizes it and names the HourKeep release that made it. Every page and document is numbered, and what the person sees on screen matches the printout page for page. It ends with a plain signature and date line.

It states what was logged against the threshold and stops: `Logged: 85 hours. Threshold: 80 hours.`.

A blank in a package reads as an answer, so we never print a blank or a zero for something missing. We use two phrases for the letter's details and each document's details (eAPD, "Instructions"):

| Missing | Print |
| --- | --- |
| A date, a month, an amount or a method | `<What it is> not specified.` For example: `Deadline not specified.` |
| A written answer | `No response was provided.`, with what was asked |

The package leaves out every exclusion the person did not tap. Listing one as unanswered would put a skip on paper as a no. Proposed.

## Spanish

Spanish ships at launch, and every string is written for translation from the first line of code (`docs/design.md`, "Spanish").

- Address the person as usted, as `public/index.html` does.
- Lead with `requisitos de trabajo`, and add `también se conocen como participación comunitaria`.
- Translate what the rule means, then check the Spanish against the row. Colorado's Spanish letter renders "at least half-time" as "al menos a tiempo parcial". That phrase means part time, so a person could count less school than the rule asks for (`docs/design.md`, "What it will not do", research L5-19).
- A link from Spanish text to an English page says so: `(página en inglés)`.
- A change to a string in one language changes the other in the same commit. HourKeep's own.
- A person reads the Spanish before launch. Until then, the source says the Spanish was written and checked by AI, as `public/index.html` does.

## The site and the review pages

- The published page cites every claim in a source comment and gives the month it was last updated, as `public/index.html` does now. Every link is checked on the date it is cited.
- The review pages are generated from the rows. Fix their wording in the row or in `scripts/build-review-pages.py`. Their readers are policy experts, so they keep the rule's terms, in plain sentences.

## Checking copy

- Read each sentence that states a rule against its row, including Error direction.
- Read every screen on a phone, with a screen reader, and zoomed to 200%, in both languages (`docs/design.md`, "What counts as working"; WCAG 2.2, 1.4.4).
- A passing automated check means its patterns didn't match. Whether a person understood the screen takes a person.
- The test that counts is people at a partner organization using HourKeep without being taught (`docs/design.md`, "What counts as working").
