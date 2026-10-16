# 0002. Keep the GPL, version 3 or later

Date: 2026-10-16

Status: Accepted

## Context

HourKeep has been licensed GPL-3.0-or-later since v1. Decision record 0001 kept it "for now", and `docs/design.md`
listed the license as open, with a permissive license as the alternative. The owner said on 2026-10-16 what he wants
from a license: HourKeep stays open source, it must never be turned into a closed product, and he is fine with people
selling it or building businesses on it.

## Decision

Keep GPL-3.0-or-later.

The GPL lets anyone use, change and sell HourKeep, and requires anyone who conveys it, changed or not, to pass on the
source under the same license. Conveying means enabling others to make or receive copies; mere interaction over a
network with no copy transferred is not conveying (GPLv3 section 0, in `LICENSE`). HourKeep's code runs in the person's
browser, so every visitor receives a copy. The common reading is that a hosted fork conveys its code to each visitor
and has to share the source. That reading has not, to anyone's knowledge here, been tested in court, and this is not
legal advice.

## Consequences

Anyone can build on HourKeep commercially. Nobody can ship a closed version of it.

The bootstrap's files keep their MIT License through `NOTICE.md`, which the GPL permits.

Code that HourKeep pulls in must have a license the GPL can absorb. MIT, BSD and Apache-2.0 qualify; anything without a
license, or with a noncommercial clause, does not. That gets checked before each new dependency.

Once other people contribute under the GPL, relicensing needs their agreement. That makes closing HourKeep harder
still, which is the point.

## Alternatives considered

MIT or Apache-2.0. Both allow a closed fork, which is the one thing the owner ruled out.

AGPL-3.0. It adds an obligation for software people use over a network, which matters for server software. HourKeep
has no server, so it would add little, and some agencies' procurement rules restrict it.

MPL-2.0. Its copyleft applies file by file, so HourKeep's files could sit inside a larger closed product.
