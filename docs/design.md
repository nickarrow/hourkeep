# HourKeep design

Draft, 2026-10-16. Each decision carries the date the owner made it. Anything not yet decided is marked Open, and
anything that rests on a guess is marked Inferred. Rules are cited to the regulation; where a rule here and
`docs/domain/` disagree, the regulation text wins, and `docs/domain/` has known errors awaiting correction (see "What
has to be true").

## What HourKeep is

HourKeep is a free, open-source web app for people on Medicaid facing the new work requirements, which CMS calls
community engagement. It helps a person work out what the rule asks of them, gather the proof their state wants for
the months it is asking about, and put that proof into a package they can send. It keeps everything on the person's
own device. It never decides whether anyone meets the requirement, because the state makes that decision and the
person can appeal it.

It should also be something a church, a food bank, a library or a legal aid office can point people to: "use HourKeep
to get your paperwork together, it gives you a package you can send to Medicaid." (Decided, 2026-10-15.)

## Why it is needed

The requirement comes from section 71119 of Public Law 119-21, which added SSA 1902(xx), and CMS's interim final rule
CMS-2454-IFC (91 FR 33348, June 3, 2026; corrected at 91 FR 39028), at 42 CFR 435.550 to 435.563. States must start
by January 1, 2027, and some already have. Montana began enforcing it by denial or disenrollment on October 1, 2026
(research, 2026-10-16).

The state checks the records it already has before asking the person for anything (42 CFR 435.557). CMS estimates
that of about 20 million people due for renewal, 56 percent will be confirmed from the state's own data and the other
44 percent, about 8.8 million people, will need to send something (91 FR 33434). From 2027 most adults in the
expansion group renew every six months (SSA 1902(e)(14)(L), added by section 71107; CMS letter SMD 26-001), so a person
can be asked twice a year. Under that letter's first option a state can move renewals already scheduled for 2027
earlier, so a first review can come in January 2027.

When the state cannot confirm someone, it sends a notice of noncompliance. The person then has 30 days from receiving
it, and the notice counts as received 5 days after its date (42 CFR 435.558(a)(2), (c)(4)). Someone already enrolled
keeps coverage while they respond (435.558(a)(3)). If they cannot show compliance, or that the rule does not apply to
them, the state must check every other way they might qualify before ending coverage (435.558(d)(1)). Someone denied
for this alone cannot fall back on marketplace premium tax credits for those months, because for the tax credit the
statute treats them as eligible for Medicaid (SSA 1902(xx)(7)(B)).

The early evidence is that people lose coverage over paperwork more than over work. In Nebraska's first months, 84
percent of 557 denials were for not responding (KFF, a secondary source; research, 2026-10-16).

So the person HourKeep serves usually arrives with a letter and a deadline, needing proof for months that are already
over. Few people will keep a daily log of something they are not yet being asked for. HourKeep is built for the
letter first and for logging second. (Owner's observation, 2026-10-15.)

## Who it is for

The primary user is an adult aged 19 to 64 who is on Medicaid or applying for it, on a phone, reading at about a sixth
to eighth grade level, often worried, sometimes on a shared or old device with a small data plan. Several of the
categories that take a person out of the requirement are about disability, so a person using HourKeep is more likely
than most to use a screen reader, magnification or voice control. Accessibility is part of whether HourKeep works at
all.

The second user is someone helping them: a family member, a church or food bank volunteer, a navigator, a legal aid
worker. The state must accept information from the person, an adult in their household or family, an authorized
representative, or, if the person is incapacitated, someone acting responsibly for them, by web, phone, mail, in
person or other electronic means (42 CFR 435.557(b)(4), applying 435.907(a)). A helper may sit with the person on the
person's phone, or on the organization's laptop.

Organizations reach people HourKeep never would on its own. They need something to hand out, a reason to trust it,
and a route for people who will not use an app at all.

The caseworker is not a user. They receive what HourKeep produces.

## What it does

None of the screens are settled. The owner wants the ideas below tested together and chosen by what works; they share
the shape described here. (Direction decided 2026-10-16; screens Open.)

### Starting from why someone came

The first question is why the person is here, answered with one tap: I got a letter; I'm applying or renewing soon;
I'm helping someone else; I want to keep track as I go. Each leads somewhere different. None of them starts with a
questionnaire.

### The letter

For most people the letter is the to-do list. A notice of noncompliance has to say which months the state is
assessing, how to show compliance, how to show the rule does not apply, the deadline, how to submit, what happens if
they do not, how to reapply, and what hardship exceptions exist if the state offers them (42 CFR 435.558(c)(1)(i) to
(vii)). So HourKeep has the person photograph the letter and copy four things from it: the date on the letter, the
deadline, the months it names, and how it says to send things. Nothing reads the letter for them.

The deadline printed on the letter always wins. HourKeep also counts the date itself, as a cross-check, and says so
when the two differ: states count differently (Nebraska counts 30 days from the notice date, Georgia from issuance,
against the rule's receipt date five days after the notice date; research, 2026-10-16). Letters also carry different
titles: Nebraska's is a "Verification Request", Montana's a "Notice of Adverse Action". HourKeep asks what the letter
says, never what it is called.

If the state denies or ends coverage, the person can ask for a fair hearing, usually within a time limit their letter
gives, up to 90 days (42 CFR 431.220(a)(1), 431.221(d)). Asked before the date of action, coverage can continue until
the hearing decision (431.230(a)). HourKeep says this plainly and points to legal help.

### What may mean the rule does not apply

The unit of work is a month with proof attached. HourKeep leads with whatever covers the most months for the least
effort:

1. Something that may mean the rule does not apply at all. When the state has enough information to see an exclusion,
   it must find the exclusion even if the person also met the requirement (42 CFR 435.557(c)(2)), so one document can
   cover every month.
2. Something that covers a whole school term: enrollment at least half-time counts without any hours
   (42 CFR 435.552(a)(4)).
3. Something that covers a month: a pay stub with 80 hours or more.
4. Hours, logged or on a signed form, only for what is still uncovered.

The exclusions and exceptions appear on one screen as plain statements a person can tap: pregnant or recently gave
birth, caring for a child 13 or younger (42 CFR 435.554(a), (c)(3)), caring for someone with a disability, American
Indian or Alaska Native, someone at home gets SNAP, a health condition that makes work hard, in treatment for drug or
alcohol use, a veteran rated at 100 percent (435.554(c)(4)), and the rest. Only what is tapped gets follow-up
questions. Skipping is never saved as a no, and HourKeep never asks a person to say they are not meeting the
requirement, because a casual "no" can be used against them. (Proposed, 2026-10-16.)

Each tapped item turns into a short list: what to tell the state, and what to gather. The state may already know some
of it, and HourKeep says so.

### Proof, month by month

The person adds what they have, mostly by taking photos, and tags each with a tap: pay stub, school record, hours form,
letter from the state, SNAP or TANF letter, doctor's note, other. A question appears only when something they added
makes it relevant. A school schedule brings up the half-time question; a SNAP letter brings up the SNAP questions.

Each month the state is asking about shows what has been added and what is still missing, with any arithmetic shown in
full: "Logged: 85 hours. Threshold: 80 hours. 38 + 41 + 6 = 85." Every number HourKeep shows is labelled Computed (from
the person's own entries by a published formula, shown with the formula and the citation), Conditional (depends on a
choice the state may have made, which is named), or Deferred (depends on facts only the state has, so HourKeep asks the
screening question and names who to ask). Legal status is always Deferred.

Two Deferred cases matter most. Income for this rule is the household's income under Medicaid's tax-based rules
(42 CFR 435.552(f)(2), 435.603; research, 2026-10-16), and who counts in that household follows tax filing rather than
who lives together, so HourKeep never adds up a household income. It asks whether the person is married, claimed as a
tax dependent, or files taxes with anyone else, and explains that the state counts the household. And whether a
health condition is on the state's medically frail list is the state's call.

### The package

The goal stays in view from the first minute: a preview of the package is always one tap away. The package is built on
the device as a PDF the person can print, save, email, upload to their state's portal or carry in. It covers the
months the state asked about, lists each document with a reference, includes the documents, and states what was
logged against the threshold without concluding anything. It has to work on paper: legible in black and white, and
every page names the person, the month and the page number, so loose pages still make sense.

A person can also call their Medicaid office and talk the caseworker through the package. So its first page summarizes
it, every page and document is numbered, and what the person sees on screen matches the printout page for page.
(Decided, 2026-10-16.) It ends with a plain signature and date line, not an attestation, because
from 2028 a sworn statement of medical frailty can be accepted only once per period of enrollment (42 CFR
435.557(f)(1)(ii)). Before a file with
personal details is saved, HourKeep says what is in it. (Carried from v1's export decision, ADR-0006 on
`experiment-1`; to confirm in review.)

### Keeping records safe

Everything stays on the device. There are no accounts and no server holding anyone's data, and HourKeep sends nothing
anywhere; files leave the device only when the person moves them, as a package to their state or a backup to their own
storage. (Decided, 2026-10-15.)

Data loss is the risk that comes with that choice. HourKeep asks the browser to keep its storage, encourages installing
it to the home screen, prompts for a backup after meaningful changes, shows when the last backup was made, and can
restore a backup from the first release. A backup file is encrypted, because backups end up in email, cloud drives and
downloads folders. Whether the records on the device are also locked with a passphrase is Open: it protects a shared
device, and a forgotten passphrase loses everything, since there is no server to recover from.

The site loads no script from anyone else. A third-party script on this site could read everything a person keeps in
HourKeep. Usage is counted from Cloudflare's request analytics, which need nothing on the page. (Decided, 2026-10-16.)

### Helpers and organizations

On the person's own phone a helper needs nothing special. On an organization's laptop, HourKeep needs a session that
leaves nothing behind and ends with a printed package and a backup file the person takes away. How that hand-off works
is Open.

Organizations pointing people at HourKeep and helping them use it is decided (2026-10-15). Proposed for them: a
printable community service hours form with the fields the rule expects an organization to track, which are the type
of activity, the dates and hours, and a contact who can confirm the hours (42 CFR 435.552(b)); a flyer and a QR code
in English and Spanish; and a one-page guide for volunteers.

### Spanish

Spanish at launch, with every string written for translation from the first line of code, and the Spanish read by a
person before launch. (Decided, 2026-10-15; reviewer Open.) CMS's own focus-group research recommends saying "work
requirements" rather than "community engagement" (research, 2026-10-16), so both languages lead with the plain name.

### States

The federal floor everywhere first, then Colorado, then a few more, then a repeatable way to add each state. (Decided,
2026-10-15.) States differ in ways that change what a person must do: how many months they look back at application
and renewal, whether they offer hardship exceptions, how they count the 30 days, and when they start. Arkansas looks
at one month at renewal; Idaho and Indiana look at three (research, 2026-10-16). Every state value carries its source
and the date it was checked. Where a state has published nothing, HourKeep says it does not know what that state chose.

### SNAP

HourKeep asks about SNAP because the Medicaid rule depends on it: a person in a household that gets SNAP, who is
subject to a SNAP work requirement, is outside the Medicaid requirement whether or not they are keeping up with SNAP's
rules (42 CFR 435.554(c)(7); 91 FR 33377). It asks whether anyone at home gets SNAP, whether the person is on that case,
what their SNAP work-rules letter says about them, and when SNAP started or stopped. It never asks whether they are
meeting SNAP's rules, and never shows a SNAP verdict or a count of SNAP months. It warns SNAP households that working
fewer hours can cost SNAP even when it would satisfy Medicaid (7 CFR 273.7(a)(1)(vii); SNAP research, 2026-10-15). It
stores activities as plain facts, so a SNAP view can be added later. (Decided, 2026-10-15.)

## What it will not do

- Decide or state anyone's status, or put a model or any other automated judgment in the path of one. No AI reads a
  letter or a document.
- Add up a household's income.
- Tell a person denied for this requirement to look to marketplace tax credits.
- Copy a state's or CMS's consumer wording without checking it against the rule. CMS's per-state pages say people
  "already meet" SNAP work requirements, and Colorado's member pages say "complying with" them, where the rule says
  subject to; Colorado's Spanish letter renders "at least half-time" as "al menos a tiempo parcial" (research,
  2026-10-16).
- Send anything to a state, or anywhere else. HourKeep is not a submission channel.
- Hold anyone's data on a server, or require an account.
- Serve caseworkers, manage households, or screen for Medicaid eligibility itself.
- Track SNAP compliance, until the SNAP rule is final and an organization asks for it.

## What counts as working

- A person holding a notice can, on a phone and in one sitting, record the letter, see the deadline with the printed
  date first, see what the letter asks for, attach proof for each month it names, and produce a package they can print,
  email, upload or hand in, and talk through with a caseworker on the phone.
- Every rule HourKeep applies traces to a citation in the verified corpus, and every number on screen carries its
  label.
- After the first visit it works with no connection. An installed copy keeps its data, and a backup restores on another
  device.
- Every screen works by keyboard and screen reader and meets WCAG 2.2 AA, in English and in Spanish.
- A printed package is readable in black and white with every page identifying itself.
- A helper can help someone on a shared device and leave nothing of theirs behind.
- People at a partner organization can use it without being taught. (Open: which organization, and when.)

## What has to be true

The policy corpus has to be right and stay right. Research on 2026-10-16 flagged 43 passages in it as wrong or out of
date, and its verifier, rechecking each against the primary source, confirmed all but one, which it partly rejected.
Some of the errors would lead a person to do less than the rule requires. None has been corrected yet. Before
HourKeep tells anyone anything, `docs/domain/` becomes one verified extract, a file of state facts each with its source
and date, and a HourKeep domain skill listing each rule with its citation, the date it was verified, the direction an
error would cost a person, and what should trigger a recheck. Already on that watch list: the Massachusetts v. Oz
summary judgment hearing on October 22, 2026, and Taylor v. Kennedy in Maryland, both challenging the medically frail
rules; an IRS proposed rule on the tax credit bar, open for comment until November 30, 2026; Colorado's rule, due to
take effect January 1, 2027; and SNAP's pending rule.

Records on the device have to survive. Browsers can clear a site's storage, and Safari is widely reported to clear
data for sites a person has not used in seven days unless the site is installed to the home screen (Inferred from
secondary reports of WebKit's policy; to check on a current iPhone). Installed home-screen apps on iPhone are reported
not to share storage with Safari, so a person who starts in Safari and then installs may not see their records
(Inferred from community reports; to test).

The code has to reach the person unaltered, because it runs where their records live. Today Cloudflare sits in front
of GitHub Pages in "Full" mode, which encrypts the connection to GitHub without checking GitHub's certificate
(Cloudflare's documentation). GitHub Pages offers no way to send security headers such as a content security policy
(Inferred; not checked against its documentation). Whether to stop proxying, move hosting to Cloudflare Pages, or keep
this arrangement is Open.

People have to find it and trust it. That depends on organizations, plain language in two languages, and being open
about what HourKeep is: not part of any government, and unable to see or change anyone's case.

## How it is built

A static progressive web app with no backend: TypeScript and React, built with Vite, styled with Tailwind, storing
records in IndexedDB through Dexie, with a service worker so it works offline. It keeps v1's look: muted purple
`#6B4E71`, warm tan `#D4A574`, earthy green `#5C8D5A`, warm orange `#D97D54`, warm red `#C85A54`, warm off-white
background `#FAF9F7`, warm black text `#2D2D2D` and `#6B6B6B`, and Inter. Green and red never mean compliant and
not compliant. (Decided, 2026-10-15.)

Proposed and not yet decided: React Aria for accessible controls, especially date pickers and calendars; vite-plugin-pwa
for the service worker; Vitest for logic and Playwright for what only a browser can show; exact pinned versions; and
tests written first for anything that computes a number a person will rely on, carrying CMS's worked examples (6
credit hours is 77.94 monthly hours, 91 FR 33359; two seasonal months at $1,500 average $500 over six months, below
the $580 threshold, 91 FR 33363).

HourKeep stays licensed GPL-3.0-or-later, so it can be sold or built on but never closed
(`docs/decisions/0002-keep-gpl-3.0-or-later.md`). Releases are numbered by year and month
(`docs/decisions/0003-release-numbering.md`).

## Open questions

Each says when it has to be answered.

- Whether records on the device are locked with a passphrase by default. Before the first code that stores a record.
- Hosting, given the certificate and header limits above. Before the first release that stores anyone's records.
- The helper session on a shared device, and how the package and backup reach the person. Before the helper feature.
- Who reads the Spanish, and which organization tries HourKeep first. Before launch; the owner can find an
  organization once there is something to try.
- Which states follow Colorado. After Colorado's facts are in.
- Pace and dates. As the work goes. (Logged, 2026-10-15.)
- Whether reminders come as calendar files, whether HourKeep reads screens aloud using the browser's built-in voice,
  and how much room logging-as-you-go deserves. While the screens are tried.

## Prior art

CMS's Emmy app and Nava's OSCER are built for states to run. WorkedMy80 reaches individuals but uses phone sign-in,
cloud storage and an outside AI service to read documents. log80 needs an account. Coverage Compass is open source,
local-only and built with the Colorado Cross-Disability Coalition, but its Colorado rules predate the interim final
rule (research, 2026-10-16). Code for America's GetBenefitsHelp covers SNAP in North Carolina under a noncommercial
license (SNAP research, 2026-10-15). Of these, only Coverage Compass is both open source and local-only, and it covers
one state with content written before the rule.

## Sources

The rule as printed on June 3, 2026, the statute and the supporting regulations are in `docs/domain/`; the June 29
correction is not stored there yet. The research of 2026-10-15 (SNAP) and 2026-10-16 (eight lanes and a verification
ledger) found what is listed above as research, and its findings become the corrected corpus. "Research, 2026-10-16"
means a finding confirmed by that research's independent verifier against its primary source and not re-read for this
document. Every other citation was read in its source while this document was written, on eCFR (current to
2026-10-14), in the rule text in `docs/domain/`, or in the CMS letter itself.
