# 0005. Publish the policy rows for open review on GitHub

Date: 2026-10-21

Status: Accepted, decided by the owner

## Context

Every check of the rows in `docs/domain/community-engagement-extract.md` so far was made by an AI agent. On 2026-10-21
the owner decided that the rows also go out for open review by Medicaid policy experts, in public, and that the corpus
work does not wait for that review (`docs/design.md`, Open questions).

Most policy experts do not use GitHub. hourkeep.app is where people on Medicaid land, and `docs/design.md` says
anything a person reads waits until the rules it uses are verified.

## Decision

The review pages live in `docs/review/` and are read on GitHub. `scripts/build-review-pages.py` generates them from the
rows, and the checker compares them with what it would generate. There is one page per topic, plus a page of open
questions and a page of state facts.

Every page offers three ways to comment:

- a GitHub issue form, which is public
- a Google Form that needs no sign-in, owned by the owner's professional account
- the address policy@hourkeep.app, forwarded to the same account

The owner reads form and email responses first and passes on only what holds nothing about a real person. Credit is
opt-in. Every comment is checked against a source before a row changes. A person's check is recorded in the row's
Verified field.

## Consequences

A change to a row means regenerating the pages, and the checker fails when they are out of date.

The owner screens every form and email response before it reaches the repository or an agent.

The pages show who checked each row, an AI agent or a named person.

## Alternatives considered

A page at hourkeep.app/review. It would be friendlier to reviewers, but it would sit on the site people on Medicaid
use, before the rules are verified. It may follow, with a decision of its own, if reviewers turn away from GitHub.

A form that files GitHub issues by itself. It needs a key that can write to the repository, and it would publish
whatever people type, including someone's real case.

Email alone. Comments would arrive with no structure.

The address review@hourkeep.app. It reads as a place to send one's own case.
