# 0006. Keep the static prototype on main, and do not deploy it

Date: 2026-10-22

Status: Accepted, decided by the owner

## Context

A static prototype of HourKeep's screens was built on the `prototype-draft` branch of this fork as a single commit
with no history in common with `main`. It covers one path: an overview, the notice details and requested months,
described records, hours arithmetic, and a printable packet. It carries one made-up case, keeps edits in the browser's
local storage, and sends nothing anywhere. `prototype/README.md` lists what it leaves out of the design.

On an unrelated branch nobody reads it next to `docs/design.md`, and the design's screens are Open. The owner wants it
where the design is, and wants to work on it from there.

`main` deploys `public/` to hourkeep.app on every push. Upstream is `nickarrow/hourkeep`; this is a fork, and nothing
here goes upstream as a pull request unless the owner asks.

## Decision

The prototype lives in `prototype/` on `main`, merged with `--allow-unrelated-histories` so the draft's commit stays in
the history rather than being copied in as new files. Its duplicate copy of `LICENSE`, byte for byte the repository's
own, and its three-line `.gitignore` were dropped; the root `.gitignore` gained `/prototype/dist/`.

`public/` and `.github/workflows/deploy.yml` are untouched, so hourkeep.app keeps serving the placeholder and its 404
fallback. The prototype runs with `npm run dev` from `prototype/`.

The corpus checker and its tests are unchanged, because the files they police are under `docs/domain/`.

## Consequences

The prototype is read beside the design it is testing, and a change to either can cite the other.

Nobody on Medicaid can reach the prototype. It names a sample case, states no one's status and submits nothing, but it
is an untested draft on a subject where a wrong impression costs someone their coverage. Putting it in front of people
is a separate decision, with a separate record.

The repository now holds a second `package.json` and a second `node_modules/` once anyone installs. The root is still
Python and has no npm install of its own.

`prototype/` is not the stack `docs/design.md` settled on. It is plain JavaScript with the UAE Government Design
System rather than TypeScript, React, Dexie and v1's palette. Whatever the prototype teaches about the screens
carries over; none of its code is expected to.

## Alternatives considered

Leaving it on `prototype-draft`. The branch is where it was already being ignored.

Replacing the repository root with the prototype. It would throw away the corpus, the review pages and the checker,
which are the finished work here.

Deploying it to hourkeep.app, or to a path under it. The design says anything a person reads waits until the rules it
uses are verified, and this prototype uses none of the verified rows yet.
