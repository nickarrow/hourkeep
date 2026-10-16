---
name: hhs-benefits
description: Use when building anything that tells a person something about their benefits, eligibility, or a determination about them. Covers Medicaid and other health and human services programs. Rules for what software may and may not decide, how a number shown to a person must be labelled, notice and appeal obligations, accessibility as legal exposure, and carrying policy citations in code. Delete this file if the work is not about benefits.
---

# Building software about somebody's benefits

This is the domain layer. The worked examples are Medicaid, because that is the programme the author knows. The rules
are not specific to it: the case law behind them runs through unemployment insurance and veterans' benefits as well,
and the parts about what software may tell a person apply to any benefit anyone can be denied.

If the work has nothing to do with benefits, delete this file. Nothing else in the repository depends on it.

If the work is in another public-service domain, this file is the shape to copy. Child welfare, nutrition assistance,
education, tax and justice all have the same structure: a rule about what the software may decide, a rule about what it
must be able to explain, and a citation obligation. The specifics change and the frame does not.

## Why the four rules in AGENTS.md are what they are

`AGENTS.md` already bars a model from the path of a decision about a person, requires a replayable and explainable
determination, requires a printable record, and requires a citation on every encoded rule. This is the evidence behind
those four, and the sharper version for benefits work.

Every published failure in this field has the same shape. A machine reached a legal conclusion from proxy data, nobody
reviewed it, and the notice could not explain itself. In Idaho, the Ninth Circuit in 2015 affirmed a preliminary
injunction against cutting home-based Medicaid budgets, set by a budget tool, without adequate notice: the notices did
not say why a budget had gone down
([K.W. v. Armstrong, 9th Cir. 2015](https://law.justia.com/cases/federal/appellate-courts/ca9/14-35296/14-35296-2015-06-05.html)).
In Arkansas, over cuts to in-home care hours under ARChoices after the state's 2019 switch to a new assessment scored
by an algorithm, the Eighth Circuit in 2022 held that beneficiaries have a clearly established right to adequate
notice of a cut, upheld the denial of qualified immunity to state officials at the pleading stage, and let the claims
go forward
([Elder v. Gillespie, 8th Cir. 2022](https://law.justia.com/cases/federal/appellate-courts/ca8/21-1826/21-1826-2022-12-09.html)).
In Tennessee, a federal district court in 2024 described pervasive flaws in the state's automated eligibility system, in
the notices it generated, and in access to the hearings owed to people wrongly terminated
([A.M.C. v. Smith, M.D. Tenn. 2024](https://healthlaw.org/resource/case-explainer-amc-v-smith/)).

Run encoded rules in shadow against the existing system before they decide anything for a real person. Let the new
rules compute an outcome while the current process makes the actual determination, compare the two, and read every
difference as a question the new rules have to answer before they go live. A rule that agrees in testing can still
diverge on the cases that matter, and shadow running is where that shows up without anyone losing coverage.

A human reviewer is a safeguard only when the reviewer has the time to look, the information to understand what the
system did, and the authority to overturn it. A reviewer who cannot say no is a rubber stamp with a person's name on
it, and the count of refusals is how you tell the difference: if nobody ever overturns the system, the review is not
real. CHAI's May 2026 Best Practice Guides for AI in Medicaid eligibility back human review of adverse actions, written
to prevent inappropriate coverage loss as new requirements take effect
([CHAI](https://chai.org/news/coalition-for-health-ai-chai-releases-best-practice-guides-for-responsible)). Anything
here without a citation is the author's advice rather than a rule anyone has published.

## The notice matters as much as the number

A correct figure in a notice somebody cannot read or act on is still the failure. Copy, the route to the agency,
appeal rights, language coverage and accessible presentation are part of the product, not packaging around it.

The printable record that `AGENTS.md` asks for has a specific name here. It is what somebody brings to a fair hearing,
and a person with no server-side copy of their own arrives with nothing.

Accessibility carries more weight in this field than in most, because several benefit exclusion categories are
disability-based, which turns an inaccessible interface into a discrimination question rather than a quality one.
Consensus guidance for Medicaid eligibility work recommends WCAG 2.2 AA, which is stricter than either standard that
binds, and the non-digital route is a requirement rather than a courtesy. CHAI's May 2026 guides pair the accessibility,
multilingual and non-digital pathways with WCAG 2.2 AA, the ADA and Section 508
([CHAI](https://chai.org/news/coalition-for-health-ai-chai-releases-best-practice-guides-for-responsible)).

## Label every number shown to a person

Numbers shown to a person get one of three labels:

- **Computed** follows from their own input by a published formula. Show the number, the formula and the citation.
- **Conditional** follows given a policy choice you do not know. Show it and name the choice.
- **Deferred** depends on facts only the agency has. Do not compute it. Ask the screening question and say who to
  ask.

A hedge with no next action is worse than a verdict. If you cannot name the next action, the copy is not finished.

## Encoded policy carries its lineage

Every rule in code carries the manual section, the URL, the statute or regulation, and a plain paraphrase of what it
means. Anything that cannot carry a citation is a guess, and guesses get labelled rather than shipped quietly.

Nothing that policy can change gets hardcoded. State variation turns a hardcoded threshold into a fork per state.

Use the words the programme uses. The vocabulary rule in the `writing-code` skill matters more here than almost
anywhere, because when the manual says redetermination and the code says refresh, that gap is where a policy defect
hides until somebody loses coverage.

## What to cite when somebody asks

Cite the agency's own authority rather than this file. For Medicaid work that means CMS, whose *Guidance for
Responsible Use of AI at CMS* tells its own staff and contractors to refrain from interacting with any generative AI
tool directly using CMS program data, protected health information or personally identifiable information. Find the
current version before quoting it. An agency believes its own guidance before it believes a repository.

The de-identification standard at [45 CFR 164.514](https://www.ecfr.gov/current/title-45/section-164.514) is the line
that matters for data: data de-identified to that standard is no longer protected health information and sits outside
the Privacy Rule, and synthetic data never was inside it. The test is whether a real person is identifiable. A file
that looks like a data extract is a different question from whether it is one.

If the work is built with enhanced federal funding, the software ownership and licensing conditions at
[42 CFR 433.112](https://www.ecfr.gov/current/title-42/section-433.112) attach to what you build. Nothing in this
repository addresses them.
