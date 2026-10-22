# 0008. Adopt the eAPD content guide as the first authority for interface copy

Date: 2026-10-22

Status: Accepted, decided by the owner

## Context

`EDITORIAL.md` and the seven Prosekeep standards adopted in decision record 0007 are written about documents. They
cover voice, evidence, plain language, accessible content and publishing. None of them says anything about a section
title that doubles as navigation, a field label, a toggle, an instruction above a group of fields, or what a print
view prints where somebody answered nothing.

HourKeep is a long government form turned into an application, filled in by somebody who will be judged on what they
submit. The CMS eAPD project is the same thing for a different form, and its team wrote a content guide about
exactly those elements. It is in `eapd-wiki/Content-guide.md` in `github.com/nickarrow/eapd` at commit
`ae50d8da9f76`, originally the `18F/cms-hitech-apd` wiki. As a work of the United States Government it is in the
public domain and released under CC0 1.0.

Run against the prototype before adoption, its rules reported 16 problems: a step called `Overview`, eight
sentence-cased titles where the title doubles as navigation, a field label written as the instruction
`Describe a record for January 2027`, the letter `x` standing in for a multiplication sign in displayed arithmetic,
and two phrases the packet invents for an answer nobody gave.

## Decision

`.kiro/skills/interface-copy/SKILL.md` adapts the guide and is read before `EDITORIAL.md` for any word inside a
screen. `EDITORIAL.md` keeps every document: the README, the design, the decision records, the research.

Two of eAPD's assumptions are reversed. eAPD writes for state analysts who are experts in the form and tells its
writers to avoid familiarity and assume expertise. HourKeep writes for a person on Medicaid, on a phone, who has
never seen the form, so it addresses one person directly and assumes nothing.

The addendum is a skill rather than a Prosekeep standard because Prosekeep's standards are a fixed registry in its
own source. Naming `eapd-content` in the `standards` array of `.editorial.json` makes
`prosekeep standards eapd-content` fail with `Unknown standard`, since the file it would load has to sit inside the
Prosekeep package.

`scripts/check-interface-copy.py`, with `scripts/check_interface_copy.py` and `tests/test_interface_copy.py`,
enforces the thirteen rules a checker can see. It is Python, like the corpus checker, because the repository root
has no npm install. It reads the prototype's templates rather than the rendered page.

The prototype's copy was changed to pass it.

## Consequences

Titles in the prototype are title case and name their screen. The arithmetic a person reads uses a multiplication
sign. The packet says `No response was provided` where somebody answered nothing, instead of inventing a phrase per
section, so a blank space in a submitted packet cannot read as an answer.

Three checkers now run on this repository, and they cover different things. The corpus checker is about the rows.
Prosekeep is about documents. This one is about screens. A change to a string a person sees needs the third.

The rules a checker cannot see are the ones that matter most. Whether a title names its screen, whether an
instruction helps anybody, and whether a section description earns its 50 words are read by a person. A clean run
says thirteen patterns did not fire.

`one` is deliberately outside the spelled-number rule. In English it is a determiner far more often than a quantity,
and flagging `print one packet` reports correct prose.

The checker reads the prototype's source, so it sees templates rather than what renders. A title built from a
template expression is not judged at all.

## Alternatives considered

Adding the guide to `EDITORIAL.md`. It would bury rules about field labels inside a document about documents, and
the file is already long.

Adding it to `.editorial.json` as a Prosekeep standard. Prosekeep's registry is in its source and does not read a
project's own folder, so this fails.

Changing Prosekeep to accept project standards. It is a separate repository, and this project should not need a
change there to adopt a guide.

Treating the guide as advice with no checker. The 16 problems it found had been in the prototype since it was
written, with the rules sitting unread in another repository.
