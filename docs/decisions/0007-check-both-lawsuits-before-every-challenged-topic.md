# 0007. Check both lawsuits before every topic that holds a provision they challenge

Date: 2026-10-23

Status: Accepted on 2026-10-23, decided by the owner

## Context

Decision record 0006 has the docket in Massachusetts v. Oz, D. Mass. 1:26-cv-12962, checked before the rows for
§ 435.554 and § 435.557(f), so that the check gates increments 2.1 and 2.2, and it splits medical frailty into
increment 2.2 "so a ruling reaches one topic". The research shows the case reaching one topic more. The States'
motion for partial summary judgment presses the medically frail gate in § 435.554(c)(5)(i), the 12-month limits in
§ 435.557(a)(vii), (a)(viii) and (f), and the limit on attestation in § 435.557(f)(1), and their proposed order also
names the preamble's statement at 91 FR 33373 (research L3, section D, from Dkt 103 and 103-1; ledger L3-2).
§ 435.557(a)(vii) and (viii) put claims adjudicated in the preceding 12 months, and encounter data for the preceding
12 months, in the definition of reliable information available to the State
(`docs/domain/sources/federal-register/C1-2026-11094.xml`, lines 37 and 38), and 0006 puts § 435.557(a) in increment
2.6. Taylor v. Kennedy, D. Md. 1:26-cv-03705, challenges the same 12-month limits, the gate, the attestation limit and
the "stable recovery" carve-out in § 435.554(c)(5)(i)(B) (research L3, section E). The skill's watch list names both
cases. The orchestrator found this on 2026-10-23, after 0006 was accepted, while checking the docket for increment
2.1; none of 0006's reviewers read the research on the litigation.

## Decision

Before a topic writes rows on a provision that either suit challenges, in a complaint or a motion, it checks both
dockets, under 0006's rule for the result: an order on a challenged provision stops row work on that provision until
the owner decides how to go on, and with none the work goes on, with each query, its date and RECAP's lag recorded in
the increment's Done entry and the skill's watch list. On 2026-10-23 that is:

- increment 2.2, for § 435.554(c)(5), § 435.557(f) and the preamble's statement at 91 FR 33373;
- increment 2.3, for § 435.555(d)(2)(i) and (iv), which the Massachusetts complaint names and its motion does not
  press;
- increment 2.6, for § 435.557(a)(vii) and (a)(viii);
- increment 2.7, for § 435.556(a)(1) and (2), which the complaint names and the motion does not press.

Increment 2.1 keeps its check of the Massachusetts docket, which 0006 sets before any row on § 435.554.

This record supersedes the sentence of 0006 that the check gates increments 2.1 and 2.2, and its reason "so a ruling
reaches one topic". The rest of 0006 stands, the split of medical frailty into increment 2.2 included, since all but
two of the provisions the suits press are there.

## Consequences

0006's status names this record. In the delivery plan, increments 2.3, 2.6 and 2.7 gain the check in their Delivers
and How you know it worked, and increment 2.2's check names both dockets. Taylor v. Kennedy's docket is checked for the
first time in increment 2.2. Four topics, not one, can be reached by a ruling, though two of them only through claims
the Massachusetts motion does not press.

## Alternatives considered

Moving § 435.557(a)(vii) and (a)(viii) into increment 2.2, so that every pressed provision sits in one topic. They are
two items of the definition of reliable information that every verification in increment 2.6 uses, so the definition
would be split across two topics.

A dated correction in 0006 instead of a new record. 0006 is accepted, and an accepted record is superseded rather than
edited.
