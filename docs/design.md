# HourKeep design

## What HourKeep is

HourKeep is a free, open-source web app for people on Medicaid facing the new work requirements, which CMS calls
community engagement. It helps a person:

- work out what the rule asks of them
- gather the proof their state wants, for the months it is asking about
- put that proof into a package they can send

It keeps everything on the person's own device. It never decides whether anyone meets the requirement, because the
state makes that decision and the person can appeal it.

It should also be something a church, a food bank, a library or a legal aid office can point people to: "use HourKeep
to get your paperwork together, it gives you a package you can send to Medicaid." (Decided, 2026-10-15.)

## Why it is needed

### Where the rule comes from

The requirement comes from section 71119 of Public Law 119-21, which added SSA 1902(xx), and from CMS's interim final
rule CMS-2454-IFC (91 FR 33348, June 3, 2026; corrected at 91 FR 39028), at 42 CFR 435.550 to 435.563.

It applies to:

- adults in Medicaid's expansion group
- adults aged 19 to 64 in a section 1115 demonstration that provides minimum essential coverage, if they are not
  pregnant, not on Medicare and not eligible another way

Either way, a person who fits one of the rule's exclusions is outside it (42 CFR 435.551, 435.554).

### When it starts

States must start by January 1, 2027, unless CMS grants a state a good-faith exemption. That exemption ends by
December 31, 2028 at the latest (42 CFR 435.559(a), 435.560(c); 91 FR 33478). None had been granted by
September 18, 2026 (research L3-16).

Some states already have started. Montana's schedule had it enforcing by denial or disenrollment from October 1, 2026
(research L6-12).

### How many people will be asked

The state checks the records it already has before asking the person for anything (42 CFR 435.557). CMS estimates
that of about 20 million of these people due for renewal, 56 percent will be confirmed from the state's own data. The
other 44 percent, about 8.8 million people, will need to send something (91 FR 33434).

From 2027 most adults in the expansion group renew every six months (SSA 1902(e)(14)(L), added by section 71107; CMS
letter SMD 26-001), so a person can be asked twice a year. Under that letter's first option, a state can move renewals
already scheduled for 2027 earlier, so a first review can come in January 2027.

### What happens when the state cannot confirm someone

The state sends a notice of noncompliance.

- The person has 30 days from receiving it, and the notice counts as received 5 days after its date
  (42 CFR 435.558(a)(2), (c)(4)).
- Someone already enrolled keeps coverage while they respond (435.558(a)(3)).
- If they cannot show compliance, or that the rule does not apply to them, the state must check every other way they
  might qualify before ending coverage (435.558(d)(1)).
- Someone denied for this alone cannot fall back on marketplace premium tax credits for those months. For the tax
  credit, the statute treats them as eligible for Medicaid (SSA 1902(xx)(7)(B)).

### What the early evidence shows

People lose coverage over paperwork more than over work. In Nebraska's first months, 84 percent of 557 application
denials and 92 percent of 533 lost renewals followed no response to the state's request (KFF, a secondary source;
research L6-10).

So the person HourKeep serves usually arrives with a letter and a deadline, needing proof for months that are already
over. Few people will keep a daily log of something they are not yet being asked for. HourKeep is built for the letter
first, and for logging second. (Owner's observation, 2026-10-15.)

## Who it is for

### The person

An adult aged 19 to 64 who is on Medicaid or applying for it. They are:

- on a phone
- reading at about a sixth to eighth grade level
- often worried
- sometimes on a shared or old device, with a small data plan

Several of the categories that take a person out of the requirement are about disability. So a person using HourKeep
is more likely than most to use a screen reader, magnification or voice control. Accessibility is part of whether
HourKeep works at all.

### Someone helping them

A family member, a church or food bank volunteer, a navigator, a legal aid worker.

The state must accept information from the person, an adult in their household or family, an authorized
representative, or, if the person is incapacitated, someone acting responsibly for them. It must accept it by web,
phone, mail, in person or other electronic means (42 CFR 435.557(b)(4), applying 435.907(a)).

A helper may sit with the person on the person's phone, or on the organization's laptop.

### Organizations

Organizations reach people HourKeep never would on its own. They need something to hand out, a reason to trust it,
and a route for people who will not use an app at all. That route has three parts:

- A helper uses HourKeep alongside the person, and hands them the printed package.
- The proposed community service hours form works on paper.
- The state already has to take the same information by phone, by mail or in person (42 CFR 435.557(b)(4), applying
  435.907(a)).

What else an organization can offer someone who wants nothing digital is Open.

### Not the caseworker

The caseworker is not a user. They receive what HourKeep produces.

## What it does

None of the screens are settled. The owner wants the ideas below tested together, and chosen by what works. They
share the shape described here. (Direction decided 2026-10-16; screens Open.)

### Starting from why someone came

The first question is why the person is here, answered with one tap:

- I got a letter
- I'm applying or renewing soon
- I'm helping someone else
- I want to keep track as I go

Each leads somewhere different. None of them starts with a questionnaire.

### The letter

For most people the letter is the to-do list. A notice of noncompliance has to say (42 CFR 435.558(c)(1)(i) to (vii)):

- which months the state is assessing
- how to show compliance
- how to show the rule does not apply
- the deadline
- how to submit
- what happens if they do not
- how to reapply
- what hardship exceptions exist, if the state offers them

So HourKeep has the person photograph the letter and copy four things from it: the date on the letter, the deadline,
the months it names, and how it says to send things. Nothing reads the letter for them.

#### The deadline

The deadline printed on the letter always wins.

HourKeep also counts the date itself, as a cross-check. When the two differ, it says so, and says what to do: meet the
printed date, and ask the office that sent the letter.

States describe the count differently. The rule runs 30 days from receipt and presumes receipt 5 days after the date
on the notice. Georgia's public notice counts from issuance, and Nebraska's state plan from the date of the notice,
though Nebraska's sample letter gave 35 days (research L4-23, L6-3, L6-5).

#### Which kind of letter

Letters carry different titles. Nebraska's is a "Verification Request" (research L6-8). HourKeep asks what the letter
says, never what it is called.

People hold other letters as well (research L6-8, L6-9):

- outreach letters, which start no clock
- renewal forms
- requests for more information
- status messages
- denial or termination notices

The 30 days start only with a notice of noncompliance, whatever the state calls it. A denial or termination starts
the time to ask for a hearing. So HourKeep's first questions about a letter work out which kind it is. The rules for
the other letters are a later topic of the corpus epic.

#### A fair hearing

If the state denies or ends coverage, the person can ask for a fair hearing. They usually have a time limit their
letter gives, up to 90 days from the date the notice of action is mailed (42 CFR 431.220(a)(1), 431.221(d)).

- Asked before the date of action, coverage can continue until the hearing decision (431.230(a)).
- If the hearing upholds the state's action, the state may recover the cost of services it furnished only because the
  request kept them going (431.230(b)).

HourKeep says both plainly, and points to legal help.

### What may mean the rule does not apply

The unit of work is a month with proof attached. HourKeep leads with whatever covers the most months for the least
effort:

1. Something that may mean the rule does not apply at all. When the state has enough information to see an exclusion,
   it must find the exclusion even if the person also met the requirement (42 CFR 435.557(c)(2)). So one document can
   cover every month.
2. Something that covers a whole school term: enrollment at least half-time counts without any hours
   (42 CFR 435.552(a)(4)).
3. Something that covers a month: a pay stub with 80 hours or more.
4. Hours, logged or on a signed form, only for what is still uncovered.

#### The exclusions screen

The exclusions and exceptions appear on one screen, as plain statements a person can tap:

- pregnant, or in the postpartum coverage that follows a pregnancy however it ended (42 CFR 435.554(c)(10))
- caring for a child 13 or younger (435.554(a), (c)(3))
- caring for someone with a disability
- American Indian or Alaska Native
- someone at home gets SNAP
- a health condition that makes work hard
- in treatment for drug or alcohol use
- a veteran whose VA disability rating is total, temporary or permanent, including one paid at the 100 percent rate
  for individual unemployability (435.554(c)(4); 91 FR 33372)
- and the rest

Only what is tapped gets follow-up questions. Skipping is never saved as a no. HourKeep never asks a person to say
they are not meeting the requirement, because a casual "no" can be used against them. (Proposed, 2026-10-16.)

Each tapped item turns into a short list: what to tell the state, and what to gather. The state may already know some
of it, and HourKeep says so.

### Proof, month by month

The person adds what they have, mostly by taking photos, and tags each with a tap: pay stub, school record, hours form,
letter from the state, SNAP or TANF letter, doctor's note, other.

A question appears only when something they added makes it relevant. A school schedule brings up the half-time
question. A SNAP letter brings up the SNAP questions.

Each month the state is asking about shows what has been added and what is still missing, with any arithmetic shown in
full: "Logged: 85 hours. Threshold: 80 hours. 38 + 41 + 6 = 85."

#### Every number carries a label

| Label | Meaning | What HourKeep shows with it |
| --- | --- | --- |
| Computed | From the person's own entries, by a published formula | The formula and the citation |
| Conditional | Depends on a choice the state may have made | The choice, named |
| Deferred | Depends on facts only the state has | The screening question, and who to ask |

Whether the requirement applies to a person, and whether they have met it, is always Deferred.

#### The two Deferred cases that matter most

Household income. Income for this rule is the household's income under Medicaid's tax-based rules
(42 CFR 435.552(f)(2), 435.603; 91 FR 33361). Who counts in that household:

- mostly follows tax filing, for people who file or are claimed as a dependent
- follows who lives together, for people who do neither, and for an adult claimed by anyone other than a parent or
  spouse
- always includes both members of a married couple living together (435.603(f))

So HourKeep never adds up a household income. It asks whether the person is married, files taxes, is claimed as a tax
dependent and by whom, or files with anyone else. Where living together decides it, it asks who lives with them. It
explains that the state counts the household.

Medical frailty. Whether a health condition is on the state's medically frail list is the state's call.

### The package

The goal stays in view from the first minute: a preview of the package is always one tap away.

The package is built on the device as a PDF the person can print, save, email, upload to their state's portal, or
carry in. It:

- covers the months the state asked about
- lists each document with a reference
- includes the documents
- states what was logged against the threshold, without concluding anything

It has to work on paper. It is legible in black and white, and every page names the person, the month and the page
number, so loose pages still make sense.

#### Talking a caseworker through it

A person can also call their Medicaid office and talk the caseworker through the package. (Decided, 2026-10-16.) So
(Proposed, 2026-10-16):

- its first page summarizes it, and names the HourKeep release that made it
- every page and document is numbered
- what the person sees on screen matches the printout page for page

#### The last page

It ends with a plain signature and date line, not an attestation. From 2028 a sworn statement of medical frailty can
be accepted only once per period of enrollment (42 CFR 435.557(f)(1)(ii)).

Before a file with personal details is saved, HourKeep says what is in it. (Proposed, carried from v1's export
decision, ADR-0006 on `experiment-1`.)

### Keeping records safe

Everything stays on the device. There are no accounts and no server holding anyone's data, and HourKeep sends nothing
anywhere. Files leave the device only when the person moves them, as a package to their state or a backup to their own
storage. (Decided, 2026-10-15.)

#### Backups

Data loss is the risk that comes with that choice. HourKeep (Proposed, 2026-10-16):

- asks the browser to keep its storage
- encourages installing it to the home screen
- prompts for a backup after meaningful changes
- shows when the last backup was made
- can restore a backup from the first release
- encrypts backup files, because backups end up in email, cloud drives and downloads folders

That ties backups to the passphrase question, since a backup that opens on another device needs a passphrase the person
carries there.

Whether the records on the device are also locked with a passphrase is Open. A passphrase protects a shared device. A
forgotten one loses everything, since there is no server to recover from.

#### No third-party scripts

The site runs no script but the ones HourKeep's own build produces. A third-party script on this site could read
everything a person keeps in HourKeep.

Usage is counted from Cloudflare's request analytics, which need nothing on the page. (Decided, 2026-10-16, when the
owner switched off Cloudflare's Web Analytics script for this reason.)

While Cloudflare proxies the site, every one of its settings that puts a script into pages must stay off. Three are on,
or come on, without anyone asking:

- the automatic setup of [Web Analytics](https://developers.cloudflare.com/web-analytics/get-started/)
- [Email Address Obfuscation](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/),
  which Cloudflare switches on when a site signs up, and which adds a script to any page with an email address in it
- Bot Fight Mode, whose
  [JavaScript detections](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/)
  cannot be switched off on their own and load from the site's own address

Rocket Loader and Zaraz add scripts too
([Cloudflare](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/);
all read 2026-10-16).

A check that what the site serves matches the files the deploy uploaded catches these, or anything else, coming back,
wherever and whenever the check runs.

#### Privacy statement

A plain privacy statement says exactly what is counted about a visit, and that nothing a person enters leaves their
device unless they move it themselves. (Decided, 2026-10-16.)

### Helpers and organizations

On the person's own phone, a helper needs nothing special.

On an organization's laptop, HourKeep needs a session that leaves nothing behind, and ends with a printed package and a
backup file the person takes away. How that hand-off works is Open.

Organizations pointing people at HourKeep and helping them use it is decided (2026-10-15). Proposed for them:

- a printable community service hours form, with the fields the rule expects an organization to track: the type of
  activity, the dates and hours, and a contact who can confirm the hours (42 CFR 435.552(b))
- a flyer and a QR code, in English and Spanish
- a one-page guide for volunteers

### Spanish

Spanish at launch, with every string written for translation from the first line of code, and the Spanish read by a
person before launch. (Decided, 2026-10-15; reviewer Open.)

CMS's own focus-group research recommends saying "work requirements" rather than "community engagement" (research
L2-16), so both languages lead with the plain name.

### States

The federal floor everywhere first, then Colorado, then a few more, then a repeatable way to add each state. (Decided,
2026-10-15.)

States differ in ways that change what a person must do:

- how many months they look back at application and renewal. Arkansas looks at one month at renewal; Idaho and
  Indiana look at three (research L4-8, L4-14).
- whether they offer hardship exceptions
- how they count the 30 days
- when they start

Every state value carries its source and the date it was checked. Where a state has published nothing, HourKeep says it
does not know what that state chose.

### SNAP

HourKeep asks about SNAP because the Medicaid rule depends on it. A person in a household that gets SNAP, who is
subject to a SNAP work requirement, is outside the Medicaid requirement whether or not they are keeping up with SNAP's
rules (42 CFR 435.554(c)(7); 91 FR 33377).

It asks:

- whether anyone at home gets SNAP
- whether the person is on that case
- what their SNAP work-rules letter says about them
- when SNAP started or stopped

It never asks whether they are meeting SNAP's rules, and never shows a SNAP verdict or a count of SNAP months.

It warns SNAP households that working fewer hours can cost SNAP even when it would satisfy Medicaid (7 CFR
273.7(a)(1)(vii); SNAP research, section 4.4).

It stores activities as plain facts, so a SNAP view can be added later. (Decided, 2026-10-15.)

TANF is its own question. That exclusion needs the person to be meeting the state's TANF work requirements (42 CFR
435.554(c)(6)), where the SNAP exclusion needs only that they are subject to SNAP's.

## What it will not do

- Decide or state anyone's status, or put a model or any other automated judgment in the path of one. No AI reads a
  letter or a document.
- Add up a household's income.
- Tell a person denied for this requirement to look to marketplace tax credits.
- Copy a state's or CMS's consumer wording without checking it against the rule. CMS's per-state pages say people
  "already meet" SNAP work requirements, and Colorado's member pages say "complying with" them, where the rule says
  subject to. Colorado's Spanish letter renders "at least half-time" as "al menos a tiempo parcial" (research L2-13,
  L7-7, L5-19).
- Send anything to a state, or anywhere else. HourKeep is not a submission channel.
- Hold anyone's data on a server, or require an account.
- Serve caseworkers, manage households, or screen for Medicaid eligibility itself.
- Track SNAP compliance, until the SNAP rule is final and an organization asks for it.

## What counts as working

- A person holding a notice can, on a phone and in one sitting:
  - record the letter
  - see the deadline, with the printed date first
  - see what the letter asks for
  - attach proof for each month it names
  - produce a package they can print, email, upload or hand in, and talk through with a caseworker on the phone
- Every rule HourKeep applies traces to a citation in the verified corpus, and every number on screen carries its
  label.
- After the first visit it works with no connection. An installed copy keeps its data, and a backup restores on another
  device.
- Every screen works by keyboard and screen reader, and meets WCAG 2.2 AA, in English and in Spanish.
- A printed package is readable in black and white, with every page identifying itself.
- A helper can help someone on a shared device, and leave nothing of theirs behind.
- Someone who will not use an app can still end up with a printed package, made with a helper.
- The pages hourkeep.app serves match the build, with nothing added on the way.
- People at a partner organization can use it without being taught. (Open: which organization, and when.)

## What has to be true

### The policy corpus has to be right, and stay right

Research on 2026-10-16 reported 39 findings of wrong or out-of-date passages in it. An AI agent then rechecked each one
against its sources. For four of them the sources were partly or wholly secondary: a news report for one, and a KFF
brief for three. The agent confirmed 36, confirmed 2 in part, and partly rejected 1 (research ledger, Ledger A).

Some of the errors would lead a person to do less than the rule requires. Those on notices of noncompliance and fair
hearings were corrected on 2026-10-17 to 2026-10-19, when that topic's rows landed (epic 0001, increment 1). The rest
wait for their own topics.

Before HourKeep tells anyone anything, `docs/domain/` becomes:

- one verified extract
- files of state facts, each with its source and date
- a HourKeep domain skill, the instructions AI agents working on HourKeep load

The skill lists each rule with its citation, and points to its row in the extract. The row carries the date it was
verified, the direction an error would cost a person, and what should trigger a recheck.

Already on the skill's watch list:

- the Massachusetts v. Oz summary judgment hearing on October 22, 2026 (research L1-11), and Taylor v. Kennedy in
  Maryland (L1-12), both challenging the medically frail rules
- an IRS proposed rule on the tax credit bar, open for comment until November 30, 2026 (L1-9)
- Colorado's rule, due to take effect January 1, 2027 (L5-1)
- SNAP's pending rule (L7-10)

### That sets the pace

Work on the app that no person reads, such as storage, backup, capture and the package's plumbing, can start once the
corpus epic's first increment has landed. Anything a person reads waits until the rules it uses are verified.
(Decided, 2026-10-16.) The owner expects the corpus to come first in practice.

### Records on the device have to survive

Browsers can clear a site's storage. WebKit, the engine behind Safari
([WebKit](https://webkit.org/tracking-prevention/), read 2026-10-16):

- deletes a site's IndexedDB, local storage and service worker data after 7 days without the person interacting with
  the site
- exempts a site added to the home screen
- keeps a home-screen app's data apart from Safari's

Its [2020 announcement](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) counts the 7 days as
days of Safari use.

So a person who starts in Safari and then adds HourKeep to the home screen would not see the records they made in
Safari. Both behaviors have to be tested on a current iPhone (Open).

### The code has to reach the person unaltered

It runs where their records live.

Today Cloudflare sits in front of GitHub Pages in "Full" mode, which connects to GitHub without validating GitHub's
certificate in any way ([Cloudflare](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full/), read
2026-10-16).

GitHub Pages has no setting for response headers such as a content security policy (Inferred: its documentation
describes none, and a 2023 answer in [GitHub's community forum](https://github.com/orgs/community/discussions/54257)
says they are unsupported).

The ways a policy could still be added:

- While Cloudflare proxies the site, a response header transform rule can add one
  ([Cloudflare](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/)).
- A page can carry most of one in a `<meta>` element, though not `frame-ancestors`
  ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors)).
  A worker takes its policy from the response that delivered its script, not from the page
  ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)), so a `<meta>` policy
  would not cover the service worker (Inferred).

Whether to keep this arrangement, move hosting to Cloudflare Pages, or stop proxying is Open. Stopping the proxy would
also end the request counts that usage figures rely on.

### People have to find it and trust it

That depends on organizations, plain language in two languages, and being open about what HourKeep is: not part of any
government, and unable to see or change anyone's case.

## How it is built

A static progressive web app with no backend:

- TypeScript and React, built with Vite
- styled with Tailwind
- records in IndexedDB, through Dexie
- a service worker, so it works offline

It keeps v1's look (Decided, 2026-10-15):

| Use | Colour |
| --- | --- |
| Muted purple | `#6B4E71` |
| Warm tan | `#D4A574` |
| Earthy green | `#5C8D5A` |
| Warm orange | `#D97D54` |
| Warm red | `#C85A54` |
| Warm off-white background | `#FAF9F7` |
| Warm black text | `#2D2D2D` and `#6B6B6B` |

The font is Inter. Green and red never mean compliant and not compliant, because HourKeep never states anyone's status.

### Proposed, not yet decided

- React Aria for accessible controls, especially date pickers and calendars
- vite-plugin-pwa for the service worker
- Vitest for logic, and Playwright for what only a browser can show
- exact pinned versions
- tests written first for anything that computes a number a person will rely on, carrying CMS's worked examples:
  6 credit hours is 77.94 monthly hours (91 FR 33359); two seasonal months at $1,500 average $500 over six months,
  below the $580 threshold (91 FR 33363)

### License and releases

HourKeep stays licensed GPL-3.0-or-later, so it can be sold or built on, and nobody who passes it on can close it
(`docs/decisions/0002-keep-gpl-3.0-or-later.md`).

The site sends its code to every visitor, so the license asks for clear directions next to that code saying where its
source is (GPLv3 section 6(d), in `LICENSE`). The site links to its source.

Releases are numbered by year and month (`docs/decisions/0003-release-numbering.md`).

## Open questions

Each says when it has to be answered.

| Question | Answer by |
| --- | --- |
| The passphrase: whether the records on the device are locked by default, and how a person keeps the passphrase that opens an encrypted backup | Before the first code that stores a record |
| How Safari's 7-day deletion, and the split between Safari and the home screen, behave on a current iPhone | Before the first code that stores a record |
| Hosting, given the unvalidated origin certificate and the header options above | Before the first release that stores anyone's records |
| The helper session on a shared device, and how the package and backup reach the person | Before the helper feature |
| What an organization can offer someone who wants nothing digital at all | Before the first organization tries HourKeep |
| How much of the corpus a person must have reviewed before a screen that uses it ships | When the first screens are ready |
| Who reads the Spanish, and which organization tries HourKeep first | Before launch. The owner can find an organization once there is something to try |
| Which states follow Colorado | After Colorado's facts are in |
| Dates (Logged, 2026-10-15) | As the work goes |
| Whether reminders come as calendar files, whether HourKeep reads screens aloud using the browser's built-in voice, and how much room logging-as-you-go deserves | While the screens are tried |

### Answered

- Who with Medicaid policy knowledge reads the corpus's rows, since every check so far has been made by an AI agent.
  The owner, who works in Medicaid policy, reviews rows. The rows also go out for open review by Medicaid policy
  experts, in public, and each comment is checked against the source like any review finding. The corpus work does not
  wait for that review. (Decided, 2026-10-21.)
- How the open review of the rows is published, and how comments come in. Review pages generated from the rows, read
  on GitHub, with a GitHub issue form, a Google Form that needs no sign-in, and policy@hourkeep.app on every page, as
  `docs/decisions/0005-publish-the-policy-rows-for-open-review.md` records. (Decided, 2026-10-21.)

## Prior art

| Tool | Who it is for | Why it is not HourKeep |
| --- | --- | --- |
| CMS's Emmy app, Nava's OSCER | States to run (research L2-18; SNAP research, section 7) | Built for states, not people |
| WorkedMy80 | Individuals | Phone sign-in, cloud storage, and an outside AI service to read documents (SNAP research, section 7) |
| log80 | Individuals | Needs an account (SNAP research, section 7) |
| Coverage Compass | Individuals in Colorado | Open source and local-only. Names the Colorado Cross-Disability Coalition as its partner, though its own status file says the coalition has not reviewed its rules. Those Colorado rules predate the interim final rule (research L5-20; L5, section 11) |
| Code for America's GetBenefitsHelp | SNAP in North Carolina | Noncommercial license (SNAP research, section 7) |

Of these, only Coverage Compass is both open source and local-only. It covers one state, with content written before
the rule.

## Sources

Rules are cited to the regulation. Where a rule here and `docs/domain/` disagree, the regulation text wins.
`docs/domain/` has known errors awaiting correction (see "What has to be true").

### The markers

Draft, 2026-10-16.

| Marker | Meaning |
| --- | --- |
| Decided | The owner decided it, on the date given |
| Proposed | There is a proposal, and no decision yet |
| Open | There is no proposal yet |
| Inferred | It rests on a guess |

### Stored sources

The rule as printed on June 3, 2026, the statute and the supporting regulations are in `docs/domain/`.

Since 2026-10-17, `docs/domain/sources/` also holds:

- the June 29 correction
- eCFR's text of 42 CFR 435.558, and of the part 431 hearing sections
- CMS's letter SMD 26-001
- Colorado's rules

Each is listed with its hash in `docs/domain/sources/MANIFEST.json`. The rows built from them are in
`docs/domain/community-engagement-extract.md`.

### Research

The research is in `docs/domain/research/`: a report on SNAP from 2026-10-15, and eight research lanes from
2026-10-16, with the ledger in which a separate AI agent rechecked 105 of their findings against their sources.

| Tag | What it names |
| --- | --- |
| "research L6-12" | A finding that ledger rechecked |
| "research L5, section 11" | A lane's own evidence, which the ledger did not recheck |
| "SNAP research, section 7" | A section of the SNAP report |

None of them was re-read for this document.

### Everything else

Every other citation was read in its source while this document was written or revised: on eCFR (current to
2026-10-14), in the rule text in `docs/domain/`, in the CMS letter itself, or on the pages linked, on 2026-10-16.
