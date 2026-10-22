---
name: interface-copy
description: Write and review the words inside HourKeep's screens: section and subsection titles, instructions, field labels, buttons, tables, empty states and the printable packet. Use before changing any string a person sees in the prototype or on the published page. Adapted from the CMS eAPD content guide, which was written for this kind of form.
---

# Interface copy in HourKeep

This is the first authority for any word inside a screen. The general editorial policy in `EDITORIAL.md` governs
documents: the README, the design, decision records, research. Where the two differ about a string a person sees in
the app, this file wins.

## Where this came from

Adapted from the eAPD content guide, written by the CMS and 18F team who built the Advanced Planning Document app:
`eapd-wiki/Content-guide.md` in `github.com/nickarrow/eapd` at commit `ae50d8da9f76`, originally the
`18F/cms-hitech-apd` wiki. That project is a work of the United States Government, in the public domain and released
under CC0 1.0, so it is adapted here freely.

It is used because eAPD is the same kind of thing HourKeep is: a long government form, turned into an application,
filled in by somebody who will be judged on what they submit. Its guide is about sections, subsections, instructions,
field labels, toggles, tables and a print view. Nothing else HourKeep follows is written about that.

Two of its assumptions are wrong here and are reversed below. eAPD writes for state analysts who are subject matter
experts in APDs. HourKeep writes for a person on Medicaid, on a phone, who has never seen this form before. eAPD
tells its writers to avoid familiarity and assume expertise. HourKeep does the opposite.

## What carries over, and what does not

| eAPD rule | HourKeep |
| --- | --- |
| Help the user understand what each section expects | Carried over |
| Detail over brevity where detail is what the reader needs | Carried over |
| Instructional help text that says what goes in each section | Carried over |
| Scanning beats completeness in a dense app | Carried over, and it matters more on a phone |
| Avoid familiarity, assume subject matter expertise | Reversed. Address one person directly. Assume no expertise |
| Title case for section and subsection titles | Carried over |
| Sentence case for buttons and field labels | Carried over |
| Content that routine editing touches lives apart from the code | Carried over as a goal. Not true yet |

## Titles

**Section title.** The step names in the progress bar. Title case. Under 35 characters. Not an active verb. They are
navigation, so a person reads them to find where they are, not to learn what to do.

**Subsection title.** Headings inside a step. Title case. Under 60 characters. Not an active verb.

**Section description.** Every section has one. Lead with an imperative verb: `Enter`, `Describe`, `Check`. Under 50
words. Say what the section is for, not how the fields work.

A title that could be the title of any screen fails. `Overview`, `Summary`, `Details` and `Information` say nothing
about where a person is.

## Instructions

eAPD splits instructional copy into four elements, and HourKeep uses the same four. Keeping them distinct is what
stops a screen from becoming one undifferentiated paragraph.

| Element | Job | Form |
| --- | --- | --- |
| `heading` | Names a component inside a subsection | Sentence case, not a sentence |
| `short` | Tells the person what to do with the fields below | One imperative sentence, rendered strong |
| `detail` | Says more about how, or gives an example | One or two sentences |
| `helpText` | Useful to know, does not tell them what to do | Visually distinct from the copy around it |

Keep `please` out of instructions. Say the thing.

## Field labels

A label says what the field **is**. It is not an instruction and not a question.

| Instead of | Write |
| --- | --- |
| `Describe a record for January 2027` | `Record description` |
| `Enter the date on your notice` | `Notice date` |
| `How many hours did you work each week?` | `Hours a week` |

A toggle is the exception. A `Yes` or `No` toggle has to make clear what is being affirmed, so its label is a
question ending in a question mark, never a colon.

## Buttons

Sentence case. Name the action and its object: `Print this packet`, not `Print`. A button that leaves the current
step says where it goes.

## Numbers, dates and symbols

- Numerals, never spelled out. `4 pages`, not `four pages`.
- Do not start a sentence or a heading with a numeral.
- Round money to the whole dollar. `k` and `M` are allowed in a summary.
- `%`, never the word.
- Shares of countable things are decimals, such as `1.5 FTEs`. Shares of a whole are percentages. No fractions.
- Dates a person reads are month first: `January 1, 2027`. Dates that identify a record are ISO: `2026-10-22`.
- Multiplication in shown arithmetic uses the multiplication sign `×`, not the letter `x`.

## Punctuation

- Oxford comma.
- One space after a full stop.
- No ampersands in copy.
- Curly quotation marks and apostrophes, `‘’` and `“”`. HourKeep writes contractions, so this one shows up often.
- Refer to a button or a section in *emphasis*, not in quotation marks. Quotation marks are for quoting.

## Acronyms

Spell an acronym out the first time it appears on a screen. `CMS` and `Medicaid` are exceptions and never need it.
An acronym used once or twice on a screen is not worth introducing at all.

## The printable packet

The packet is HourKeep's export view, and it is the thing a person hands to the state. eAPD uses two phrases for
information somebody did not give, and HourKeep uses the same two, because a blank space in a packet reads as an
answer.

| Case | Phrase |
| --- | --- |
| A formatted value: a date, a month, a method | `<Thing> not specified.` |
| A written answer | `No response was provided.`, with what was asked, where it fits |

Never leave a packet field empty and never print a zero in place of an answer nobody gave.

## What this file cannot decide

HourKeep states nobody's status, and no rule here changes that. A label, an empty state or a packet line that implies
a person has met or failed the requirement is wrong however well it reads. `AGENTS.md` holds that rule and this file
cannot loosen it.

## Checking it

`python3 scripts/check-interface-copy.py` enforces the rules above that a checker can see: title case, title length,
labels shaped as instructions, spelled-out numbers, the word `please`, ampersands, straight quotes, double spaces,
the letter `x` as a multiplication sign, and the packet's two phrases. It cannot tell whether a title names its
screen or whether an instruction helps. Read the screen.
