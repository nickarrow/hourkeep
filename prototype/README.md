# HourKeep prototype

A browser-only draft of the screens in [the design](../docs/design.md), for trying the flow with real people. It
uses one made-up case, keeps edits in this browser, and sends nothing anywhere. It is not a policy engine and it
decides nothing.

## Run it

Node.js 20.19 or later. From this folder:

```sh
npm install
npm run dev
```

## What it does

| Step | What happens | Shown when |
| --- | --- | --- |
| Why You’re Here | 4 one-tap reasons: a letter, applying or renewing, helping someone, keeping track | Always |
| Your Letter | Pick what the letter says, never what it is called | There is a letter |
| Fair Hearing | Rights, time limit, and keeping coverage during an appeal | The letter is a denial |
| Notice Details | Dates and months as printed, plus a cross-check of the deadline | There is a letter |
| Might Not Apply to You | Reasons the rule may not apply, before any hours | Not keeping track |
| Records | Records tagged by type, with a follow-up only when one matters | Always |
| Month by Month | What each month has, the hours, and the sum in full | Always |
| Packet | Numbered pages and documents, a signature line, and a list of what is in it | Always, and 1 tap away |

Every number on screen is labelled Computed, Conditional or Deferred. Whether the rule applies, and whether it is
met, is always Deferred, and each Deferred note says what to do next.

A skipped question is never stored as a no.

## Where the rules come from

Each screen has a list called *Sources for this screen*. Rules about letters and hearings cite rows in
`docs/domain/community-engagement-extract.md`, verified on 2026-10-19.

Rules about exemptions, the 80-hour threshold, half-time school and SNAP come from `docs/design.md`. None has a
verified row yet, and the screen says so.

## What it leaves out

- Spanish. The design asks for Spanish read by a person before launch, and AI-written Spanish would repeat the
  problem the published page already admits to.
- Photos and attached files. Records are described, not attached.
- Backup, a passphrase, and handing over a shared device. All are Open in the design.
- State rules. Federal rules only.
- Income. The design makes household income Deferred and never adds it up.

## Where it departs from the design

The palette, the font and the 44-pixel touch targets follow the design. The code does not. It is plain JavaScript
with local storage, where the design decided TypeScript, React, IndexedDB and a service worker. Treat the screens
and the order of the steps as the thing under test.

## Checks

```sh
npm run build
npm run check:flows
```

`check:flows` drives every route in Chromium and runs 54 checks. It needs a Chromium for Playwright 1.56.1 and is
not in CI yet. The words on screen are checked from the repository root with
`python3 scripts/check-interface-copy.py`.
