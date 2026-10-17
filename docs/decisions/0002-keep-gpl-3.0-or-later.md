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
browser, so every visitor receives a copy. The Free Software Foundation reads that as distribution: when a site sends
visitors GPL-covered programs, often written in JavaScript, their source must be released to them under the GPL
([GPL FAQ](https://www.gnu.org/licenses/gpl-faq.html#UnreleasedMods), read 2026-10-16). That reading has not, to
anyone's knowledge here, been tested in court, and this is not legal advice.

## Consequences

Anyone can build on HourKeep commercially. Nobody who passes it on can close it.

Someone who changes HourKeep and only runs it, without passing it on, owes nobody the source: GPLv3 section 2 lets
anyone make and run copies they do not convey, without conditions, as long as their license otherwise remains in
force. That includes a fork that moves HourKeep's logic onto a server and sends visitors only the results, since
interaction over a network is not conveying. AGPL-3.0 would close that gap. The owner was asked about it on 2026-10-16
and kept the GPL.

The bootstrap's files keep their MIT License through `NOTICE.md`, which the GPL permits.

Code that HourKeep pulls in must have a license the GPL can absorb. The Free Software Foundation lists the license
usually called MIT (which it calls Expat), the two- and three-clause BSD licenses and Apache-2.0 as compatible with
GPLv3. Apache-2.0 works only because HourKeep's license is version 3 or later, since it is incompatible with version 2,
and the original four-clause BSD license is incompatible with both
([license list](https://www.gnu.org/licenses/license-list.html), read 2026-10-16). Anything without a license, or with
a noncommercial clause, does not qualify. That gets checked before each new dependency.

Once other people contribute under the GPL, relicensing needs their agreement. That makes closing HourKeep harder
still, which is the point.

## Alternatives considered

MIT or Apache-2.0. Both allow a closed fork, which is the one thing the owner ruled out.

AGPL-3.0. Its section 13 requires anyone running a changed copy for users over a network to offer those users the
source, which would close the server-side gap above. HourKeep itself has no server. The owner chose to keep the GPL.

MPL-2.0. Its copyleft applies file by file, so HourKeep's files could sit inside a larger closed product.
