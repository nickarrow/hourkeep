# 0003. Number releases by year and month

Date: 2026-10-16

Status: Accepted

## Context

v1's releases used semantic versions, tagged `v2.0.0` to `v7.0.0`, and those tags stay in this repository. "v2" is a
nickname for the rebuild, and a real `v2` would collide with v1's history. Decision record 0001 proposed dated versions
without deciding, `docs/design.md` listed numbering as open, and the owner left the choice to the agent on
2026-10-16.

HourKeep is an app people use, not a library anybody builds against, so the question a version number answers is how
recent the copy is, not whether an interface broke.

## Decision

Each release is numbered `YEAR.MONTH.N`: the year, the month without a leading zero, and a counter from 0 for releases
within that month. The first release in December 2026 would be `2026.12.0`, the next one that month `2026.12.1`, the
first in January `2027.1.0`. The git tag is the same string with no `v`, so it cannot be mistaken for one of v1's tags.
The same number goes in `package.json` and at the top of each changelog entry.

Without leading zeros the numbers are valid semantic versions, which npm requires; `2027.01.0` is not.

## Consequences

The version tells a reader how old a copy is. A caseworker looking at a package, or a person reporting a problem, can
say which release they had without knowing anything about the code.

The changelog, in the Keep a Changelog shape, carries what changed and what to watch for, since the number itself says
nothing about how large a change was. Rule changes go there, with citations.

## Alternatives considered

Semantic versions starting again at `1.0.0` or carrying on from `v8.0.0`. Either would confuse anyone reading v1's tags
next to v2's.

The bootstrap's full dates, such as `2026.10.15`. Readable, but not valid semantic versions when the month or day has a
leading zero, and two releases on one day would need a suffix anyway.
