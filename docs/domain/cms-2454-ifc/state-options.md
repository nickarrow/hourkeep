# State-Configurable Parameters — Schema and Tracker

Companion to `rule-extract.md` § 10. That section defines each parameter and its federal default.
**This document is the living tracker** for per-State values as we learn them, plus the target schema
for the policy profile module.

**Status:** schema defined · per-State data mostly unknown · federal default is the only complete profile.

---

## Why this exists

The IFC leaves at least sixteen parameters to State election. HourKeep cannot be correct for a given
user without knowing their State's choices, but it also cannot block on collecting 44 jurisdictions' worth
of data. The resolution (ADR-0001) is a `FEDERAL_DEFAULT` profile encoding the least-restrictive
statutory floor, with per-State profiles layered on additively as they become known.

**Every profile must be explicit about its own uncertainty.** A user in a State we have no data for
should be told the app is using federal minimums and that their State may require more.

---

## Target schema

```ts
export interface PolicyProfile {
  /** "federal-default" | "state:AR" | "state:IN" ... */
  id: string;
  /** Human label for display, e.g. "Federal minimum (no state data)" */
  label: string;
  /** ISO date this profile's values took effect */
  effectiveFrom: string;
  /** Where these values came from. Required — no unsourced profiles. */
  source: { citation: string; url?: string; retrievedAt: string };
  /** How much we trust this profile's STATE data. Drives UI hedging. */
  confidence: "statutory-floor" | "state-published" | "third-party-reported";
  /**
   * Separate from `confidence`. Flags values that rest on a CMS *interpretation* a final rule
   * or a court could move — distinct from "we don't know what Idaho elected."
   * Known interpretive risks: the MAGI-household reading of § 435.552(f); the "whether or not consecutive" reading
   * of § 435.556(a)(2); the medically-frail functional-impairment gate, under challenge in Massachusetts v. Oz,
   * whose summary judgment hearing was reset to 2026-10-22 by ECF 143, entered 2026-10-08. (Corrected 2026-10-23:
   * said "(under challenge in Massachusetts v. Oz, SJ hearing 2026-10-20)."; L1-11, L3-1, L5-15, L8-16.)
   * On 2026-10-23, CourtListener's RECAP copy of the docket page, read at about 00:37 UTC, and RECAP's search
   * index, queried then and at about 03:09 UTC, showed no entry after 144, a notice of appearance filed
   * 2026-10-21, and no entry recording the hearing as held, no order on the motions and no termination. RECAP
   * can lag PACER, which was not checked. (Added 2026-10-23; decision record 0006.)
   */
  interpretiveRisk?: Array<{ field: string; basis: string; watch: string }>;

  // --- Thresholds (statutory, but dynamic) ---
  /** 7.25 — 29 U.S.C. 206(a)(1)(C), via § 435.552(a)(6) at 91 FR 33470. */
  federalMinimumWage: number;
  /** 80 — § 435.552(a)(1)-(3), (5)-(7) at 91 FR 33470. */
  requiredHours: number;
  /**
   * § 435.552(d)(1) at 91 FR 33470-33471. Carnegie-Unit conversion for less-than-half-time
   * education: monthly hours = creditHours x hoursPerCreditPerWeek x weeksPerMonth. CMS's
   * worked example 6 x 3 x 4.33 = 77.94 (91 FR 33359). Added by W6a with its reader,
   * `src/lib/education.ts`. The 4.33 here is the Carnegie Unit, NOT the income-side
   * `PAY_PERIOD_MULTIPLIERS.weekly` (52/12 rounded down, gap 5.4, W7a) — same digits,
   * different meaning.
   */
  educationCreditHourConversion: { hoursPerCreditPerWeek: number; weeksPerMonth: number };
  //
  // NO `incomeThreshold` FIELD. Corrected on the W2b dry run, 2026-09-02 — see
  // `wave-2b-policy-profile.md` § 2.1.1 `[S1]`. This was
  // `readonly incomeThreshold: number` with the comment "Derived: never hardcode 580",
  // which does not do what it says: `readonly` means "not reassignable after
  // construction", not "derived". Nothing stopped a per-State profile from setting it to
  // a value other than wage x hours — the exact failure the comment was trying to
  // prevent. It is a FUNCTION instead, `incomeThreshold(profile)`, with no stored field.

  // --- Review periods (§ 435.556) ---
  /**
   * § 435.556(a)(1). 1 to 3. Deliberately `number` and not `1 | 2 | 3` — corrected on
   * the W2b dry run, `[S2]`. A literal union is a compile-time check only, and profiles
   * will be loaded from storage where `tsc` cannot help. W5 chose a runtime bounds check
   * that throws with the statutory range named, and that survives untrusted input.
   */
  applicationLookbackMonths: number;
  /** § 435.556(a)(1)'s statutory range for the above. Not itself an election. */
  applicationLookbackBounds: { min: number; max: number };
  renewalMonthsRequired: number;              // >= 1, § 435.556(a)(2)(i)
  /** § 435.556(a)(2)(ii). Months required between more-frequent verifications. */
  verificationMonthsRequired: number;
  moreFrequentVerification: false | { intervalMonths: number; monthsRequired: number };

  // --- Options affecting what counts (§ 435.552) ---
  incomeToHoursProxyAvailable: boolean;       // § 435.552(e)(2)
  seasonalMethod:
    | { kind: "preceding-average"; months: 6 }
    | { kind: "reasonably-predictable-changes"; windowMonths: number; direction: "increases" | "decreases" | "both" };

  // --- Exclusion-affecting options (§ 435.554) ---
  extendedCaretakerRelativeRelationships: boolean;  // § 435.554(a), caretaker relative (iv)
  // (Corrected 2026-10-23: said "§ 435.554(a)(iv)"; read in docs/domain/cms-2454-ifc/2026-11094.xml:3634 and :3642.)
  rehabMinimumTimeCommitmentHours: number | null;   // § 435.554(c)(8)
  medicallyFrailConditionListUrl: string | null;    // § 435.554(c)(5)(ii)

  // --- Hardship (§ 435.555) ---
  shortTermHardshipOffered: boolean;
  unemploymentHardshipEffectuated: boolean;

  // --- Process (§§ 435.557–435.559) ---
  implementationDate: string;
  /**
   * How far ahead of a renewal's due date the State begins its ex parte review, in days.
   *
   * Added 2026-09-02 for gap 15.7. § 435.559(c) triggers the first assessment on when a
   * renewal is **initiated**, not when it is due, so this figure decides whether a given
   * renewal is reached at all.
   *
   * PREAMBLE, 91 FR 33416, and the weakest tier in this profile — not an interpretation of
   * the rule but CMS reporting that "many States have a renewal process that takes between
   * 60 to 90 days", from discussions with State systems staff. Per-State and unpublished.
   * A range, not a point estimate, because collapsing it would manufacture certainty CMS
   * does not claim.
   */
  renewalInitiationLeadDays: { min: number; max: number };
  /**
   * PER-STATE, not a constant. Federally 2028-01-01 (§ 435.557(b)(2)(ii)), but some States will require
   * medical-frailty documentation from January 2027, and no single source settles which. A list of eight, AR, ID,
   * IN, IA, NC, ND, OH and UT, rests on one press report, Politico's of 2026-08-09, which the research of 2026-10-16
   * did not open. AP, in September 2026, names a different six as barring self-attestation from next year: AR, ID,
   * IN, NH, NC and OH. New Hampshire's statute, RSA 126-AA:6, accepts medical frailty only on a clinician's
   * certification, and Iowa says it "may require" documentation. The tracker below gives 2027-01 to nine States, not
   * eight. (Corrected 2026-10-23: said "but eight States require medical-frailty documentation from January 2027:
   * AR, ID, IN, IA, NC, ND, OH, UT."; L4-13, L8-6.)
   */
  documentationRequiredFrom: string;
  /** § 435.560. Non-null means the State is NOT enforcing yet. Expires no later than 2028-12-31. */
  goodFaithEffortExemptionThrough: string | null;
  /**
   * § 435.558(a)(2), 91 FR 39030 (Corrected 2026-10-17: said "91 FR 33476"; L1-6.). 30 calendar days
   * from RECEIPT, not from the notice date.
   */
  noncomplianceResponseDays: number;
  /**
   * § 435.558(c)(4), 91 FR 39031 (Corrected 2026-10-17: said "91 FR 33477"; L1-6.). "considered to be
   * received 5 days after the date on the notice".
   */
  noticeReceiptPresumptionDays: number;
  /** § 435.916(a)(3)(iii). 90 is a FEDERAL FLOOR for MAGI; the only election is to elect longer. */
  reconsiderationDays: number;
  /**
   * How long the eligibility period is: 6 for the adult group, including people described in it who are covered
   * under a waiver, a § 1115 demonstration included, that gives coverage equivalent to minimum essential coverage to
   * everyone in the group; 12 for the American Indians and Alaska Natives described in SSA 1902(xx)(9)(A)(ii)(II),
   * and for people described in the adult group in a State that covers them only through a partial expansion under
   * a § 1115 demonstration. (Corrected 2026-10-23: said "12 for AI/AN and most 1115."; L2-3; read in
   * docs/domain/sources/cms/smd-26-001.txt:23 to :26, :118 to :122 and :133 to :146.)
   *
   * ALSO the assumed span of a renewal review period, which is what
   * `renewalReviewPeriodEndingAt` derives its month list from. W5 declared this
   * separately as `renewalPeriodMonths`; the two were the same quantity under two names
   * and were merged on the W2b dry run, 2026-09-02 (`[P6]`).
   *
   * The weakest number in this profile. See `renewalIntervalMonthsSource`, which must
   * travel with it.
   */
  renewalIntervalMonths: number;
  /**
   * Its own separate citation, because this one value has a different and WORSE
   * provenance than everything else here and must not travel without the caveat.
   *
   * From W5. `source` is one citation for the whole profile (ADR-0001); this is the
   * exception that needed its own, because the figure does not come from CMS-2454-IFC at
   * all. Indexed in `interpretiveRisk` as well, so the UI can hedge from structured data
   * rather than parsing prose — a test asserts the two name the same field.
   */
  renewalIntervalMonthsSource: string;
  submissionModalities: Array<"online" | "phone" | "mail" | "in-person" | "fax" | "electronic">;

  // --- Added on validation (§ 435.558(b), § 435.557) ---
  /**
   * § 435.558(b)(2). Option 1 = notice concurrent with renewal form. Option 2 = notice after it.
   * The rule sets no default: the State chooses and records its choice in its State plan, so the
   * federal profile below says `no default`, a value this type does not hold. (Added 2026-10-17;
   * read in docs/domain/cms-2454-ifc/2026-11094.xml:2029.)
   */
  unableToVerifyAtRenewal: "option-1-concurrent" | "option-2-sequential";
  /**
   * § 435.558(b)(3). Two options for more-frequent verification, "similar to" those at renewal
   * (91 FR 33412), with no renewal form: unable to verify after a data check alone, or after a data
   * check and a request for information that is not returned or not sufficient. The enum names come
   * from renewal and do not describe these. (Corrected 2026-10-19: said "Same binary for
   * more-frequent verification."; read in docs/domain/cms-2454-ifc/2026-11094.xml:2068 and
   * docs/domain/sources/federal-register/C1-2026-11094.xml:153 to :155.)
   */
  unableToVerifyAtVerification: "option-1-concurrent" | "option-2-sequential" | null;
  /** § 435.557(g)(1). CMS ENCOURAGES States not to use this. */
  skipFurtherInfoOnAttestedException: boolean;
  /** § 435.557(f). At least every 12 months; a State may reverify more often. */
  frailtyReverificationMonths: number;
  /** § 435.554(c)(5)(ii). Two-tier in practice — see Georgia. */
  frailtyListStructure: "unknown" | "flat" | "automatic-plus-case-by-case";
  /** §§ 435.1103(b), 435.1110(c)(2). PE/HPE determinations must rest on ATTESTED information. */
  presumptiveEligibilityForAdultGroup: boolean | null;
}
```

Design notes:

- `incomeThreshold` is **derived**, never stored — and since 2026-09-02 it is a **function**, not a
  field, so that is enforced rather than requested. `incomeThreshold(profile)`.
- `confidence` exists so the UI can hedge honestly. A `statutory-floor` profile should produce copy
  like "your state may require more than this."
- `source` is mandatory. A profile without a citation is a guess, and guesses do not belong in
  compliance logic. **`renewalIntervalMonthsSource` is the one field-level exception**, because that
  value alone does not come from this rule.
- `seasonalMethod` is a discriminated union because the two paths produce genuinely different numbers,
  and most States elect the second.
- **`ReviewPeriodPolicy` is `Pick<PolicyProfile, …>`**, not a separate type. W5 shipped it standalone
  because `src/lib/policy/` did not exist yet. It now selects `applicationLookbackMonths`,
  `applicationLookbackBounds`, `renewalMonthsRequired`, `verificationMonthsRequired`,
  `renewalIntervalMonths`, `renewalIntervalMonthsSource` and `source`. A `Pick` rather than a parallel
  interface plus an adapter, so there is one declaration of each field's type and nothing to drift; a
  `PolicyProfile` satisfies it structurally and passes straight in.

> ### Four corrections made on the W2b dry run, 2026-09-02
>
> Recorded here because this document is the schema of record and a reader should see what moved.
> Reasoning in [`../../hr1-readiness/waves/wave-2b-policy-profile.md`](../../hr1-readiness/waves/wave-2b-policy-profile.md)
> § 2.1.1.
>
> 1. **`incomeThreshold` is a function, no field** — `readonly` does not mean derived. `[S1]`
> 2. **`applicationLookbackMonths` is `number` plus `applicationLookbackBounds`**, not `1 | 2 | 3` — a
>    literal union cannot check a value loaded from storage. `[S2]`
> 3. **Three fields added**, all real parameters this tracker should already have carried:
>    `applicationLookbackBounds`, `verificationMonthsRequired`, `renewalIntervalMonthsSource`. `[S3]`
> 4. **`renewalIntervalMonths` absorbed W5's `renewalPeriodMonths`** — the same quantity under two
>    names. `[P6]`
>
> **The interface declares 33 fields; 35 are implemented** (33, less `incomeThreshold`, plus the three
> additions). An earlier plan for W2b said 30, which was a slip from "at least sixteen parameters to
> State election" — a count of *elections*, which is a different quantity from a count of *fields*.

---

## Federal default profile

The least-restrictive statutory floor. Safe to show any user, and honest as long as we say it is a floor.

| Parameter | Value | Basis |
|---|---|---|
| `federalMinimumWage` | 7.25 | 29 U.S.C. 206(a)(1)(C), via § 435.552(a)(6) — 91 FR 33470 |
| `requiredHours` | 80 | § 435.552(a)(1)–(3), (5)–(7) — 91 FR 33470 |
| *`incomeThreshold(profile)`* | *580* | *Derived, not a field. `federalMinimumWage × requiredHours`* |
| `applicationLookbackMonths` | 1 | § 435.556(a)(1) minimum |
| `applicationLookbackBounds` | `{ min: 1, max: 3 }` | § 435.556(a)(1) statutory range. Not an election |
| `renewalMonthsRequired` | 1 | § 435.556(a)(2)(i) minimum |
| `verificationMonthsRequired` | 1 | § 435.556(a)(2)(ii) minimum. Only reachable if more-frequent verification is elected |
| `moreFrequentVerification` | false | State option, default decline |
| `incomeToHoursProxyAvailable` | true | § 435.552(e)(2), user-favorable |
| `seasonalMethod` | preceding-average, 6 months | § 435.552(g) statutory fallback |
| `extendedCaretakerRelativeRelationships` | false | base list only |
| `rehabMinimumTimeCommitmentHours` | null | no State-imposed minimum |
| `medicallyFrailConditionListUrl` | null | unknown per State |
| `shortTermHardshipOffered` | false | State option |
| `unemploymentHardshipEffectuated` | false | requires State request + CMS approval |
| `implementationDate` | 2027-01-01 | § 435.559(a) — 91 FR 33478. (b) is the election to go earlier |
| `renewalInitiationLeadDays` | `{ min: 60, max: 90 }` | **Preamble, 91 FR 33416.** Note which way it cuts: CMS rejected an end-date trigger *because* a 60–90 day process would have pulled January 2027 renewals into review by November 2026. Choosing initiation instead pushes a user's first assessment **later** |
| `documentationRequiredFrom` | 2028-01-01 | § 435.557(b)(2)(ii), **but 2027-01-01 in some States, and no single source settles which.** A list of eight rests on one press report; AP names a different six; New Hampshire's RSA 126-AA:6 accepts medical frailty only on a clinician's certification; the tracker gives 2027-01 to nine. See the schema note on `documentationRequiredFrom`. (Corrected 2026-10-23: said "— **but 2027-01-01 in eight States**"; L4-13, L8-6.) |
| `goodFaithEffortExemptionThrough` | null | § 435.560. CMS expects ~10 States to request one |
| `noncomplianceResponseDays` | 30 | § 435.558(a)(2) |
| `noticeReceiptPresumptionDays` | 5 | § 435.558(c)(4) |
| `reconsiderationDays` | 90 | § 435.916(a)(3)(iii) — federal floor |
| `renewalIntervalMonths` | 6 | **SSA § 1902(e)(14)(L), NOT this rule.** See the next row |
| `renewalIntervalMonthsSource` | *(the caveat, in full)* | The IFC amends § 435.916 to say MAGI renewals happen every 12 months and no more often, while its own preamble says the adult group is subject to 6-month renewals from January 1, 2027 under § 1902(e)(14)(L), which § 71107 of PL 119-21 adds and this rule does not implement. (Corrected 2026-10-23: said "— a different section of PL 119-21 that this rule does not implement,"; L3-9; read in docs/domain/hr1/119hr1enr-title7-part3.md:233 to :244.) The 6-month renewals do not reach the American Indians and Alaska Natives described in SSA 1902(xx)(9)(A)(ii)(II), or people described in the adult group in a State that covers them only through a partial expansion under a § 1115 demonstration; people described in the adult group who are covered under a waiver, a § 1115 demonstration included, that gives coverage equivalent to minimum essential coverage to everyone in the group do get them. (Corrected 2026-10-23: said "and which does not reach American Indians or most § 1115 enrollees."; L2-3; read in docs/domain/sources/cms/smd-26-001.txt:23 to :26, :118 to :122 and :133 to :146.) CMS's guidance on the 6 months is SMD 26-001, sent to State Medicaid Directors on March 6, 2026. As of 2026-10-16 the Federal Register's only CMS documents matching § 435.916 or § 1902(e)(14)(L) since July 4, 2025 were the interim final rule and its correction, so no rulemaking reconciling § 435.916 has issued. (Corrected 2026-10-23: said "No reconciling rulemaking has issued."; L2-2, L3-10; read in docs/domain/sources/cms/smd-26-001.txt:6 to :11.) SMD 26-001 gives a State two paths for adults already enrolled on January 1, 2027. On the first, the State moves already-set 2027 renewal initiation dates earlier, to no earlier than January 1, 2027, in practice January 4, 2027, and grants 6 months at that renewal. On the second, it keeps the already-set dates and grants 6 months at the first renewal initiated in 2027. A person's next renewal date turns on the State's path. CMS treats shortening an eligibility period, and moving someone at renewal from a group with a 12-month period to one with 6 months, as an action under 42 CFR 431.201 that needs at least 10 days' advance notice with fair hearing rights. A State that covers the adult group in its State plan must submit a SPA through MACPro no later than March 31, 2027. (Added 2026-10-23; L3-11, L2-5; read in docs/domain/sources/cms/smd-26-001.txt:289 to :308, :364 to :369, :443 to :446 and :492 to :496.) 6 is treated as operative and flagged as sourced elsewhere |
| `submissionModalities` | `["online","phone","mail","in-person","fax","electronic"]` | § 435.907(a). **Fax is real** — Missouri accepts it |
| `unableToVerifyAtRenewal` | `no default` | § 435.558(b)(2). The rule sets no default: the State chooses and records its choice in its State plan. Nebraska sends the notice with the renewal form, and Colorado's draft rule appears to (inferred) (research L4-5, L5-3). Which reading applies where a State plan records nothing is open question Q1 in `docs/domain/open-questions.md`. (Corrected 2026-10-17: said "`option-2-sequential`" and "Assumed because it is more protective — two windows rather than one"; L4-5, L5-3; read in docs/domain/cms-2454-ifc/2026-11094.xml:2029.) |
| `unableToVerifyAtVerification` | null | No more-frequent verification assumed |
| `skipFurtherInfoOnAttestedException` | false | § 435.557(g)(1). CMS **encourages States not to use it** |
| `frailtyReverificationMonths` | 12 | § 435.557(f)(1)(iii) minimum |
| `frailtyListStructure` | `unknown` | § 435.554(c)(5)(ii). Georgia's is `automatic-plus-case-by-case` |
| `presumptiveEligibilityForAdultGroup` | null | Unknown per State |

> **Note on `incomeToHoursProxyAvailable: true`.** This is a State option we default to *on* because it
> surfaces a real, user-favourable possibility, and because HourKeep never adjudicates — it raises the
> possibility and tells the user to take it to their agency.
>
> **Corrected 2026-09-02.** This note previously ended "If a State declines it, the user has lost
> nothing." That is wrong, and wrong in the direction that costs coverage. ADR-0001 was corrected on
> validation on exactly this point and this document was not: **they lose the hours they didn't go
> find.** Someone shown "your state may credit 52, you need 28 more", who logs 28 and is then denied
> because their State declined the option, has lost coverage.
>
> Keep the default on, but the copy is belt-and-braces: *if you can reach 80 without counting on this,
> do — and log the income too.* Per ADR-0003 this is a **Conditional** value, shown with the State
> election named, and § 435.552(e)(2)(i) makes any figure an **upper bound** because the State must
> allocate hours between household members by a method we cannot know. "Up to", never "about".

---

## Per-State tracker

Sources so far are third-party reported (KFF's survey of Medicaid officials, fielded January–March 2026). Treat
every row as `confidence: "third-party-reported"` until we find State-published material. The survey predates the
interim final rule of 2026-06-03, and the rows carry no retrieval date. Where a survey answer has a State electing
the short-term hardship exception for some events and not others, the preamble says the statute gives a State no
option to make one or only some of the events the exclusive basis for the exception, though certain events include
a State request among their criteria (91 FR 33380), and CMS's MACPro implementation guide, p. 5, has a State that
elects the exception implement all its event types. The Oklahoma and New York rows recorded such plans until
2026-10-23. Values corrected on 2026-10-23 come from State pages and statutes the research read on 2026-10-16.
(Added 2026-10-23; L8-15; read in docs/domain/cms-2454-ifc/2026-11094.xml:1346.)

| State | Implementation | App. lookback | Renewal months | More frequent | Hardship | Frailty docs from | Source |
|---|---|---|---|---|---|---|---|
| **Modal case** (~34 States) | 2027-01-01 | 1 | 1 | decline | all four | 2028-01-01 | KFF survey |
| **Nebraska** | **LIVE 2026-05-01 — first State to disenroll** | ? | ? | ? | ? | **2027-01** | KFF, state press |
| **Montana** | **LIVE 2026-07-01** | ? | **3**, not necessarily consecutive, since the last redetermination (Corrected 2026-10-23: said "?"; L4-15.) | ? | ? | ? | KFF; MT DPHHS for the 2026-10-23 value |
| **Arkansas** | **LIVE 2026-07-01** soft launch, no disenrollment before 2027-01-01 | 1, the month before applying (Corrected 2026-10-23: said "?"; L4-14, L8-7.) | 1 in each 6 months (Corrected 2026-10-23: said "**3**"; L4-14, L8-7.) | decline | ? | **2027-01** | AR DHS |
| **Iowa** | **2026-12-01** | ? | **2** since the last renewal or application (Corrected 2026-10-23: said "?"; L4-15.) | ? | **none** | **2027-01**; Iowa HHS says it "may require" medical documentation for medical frailty (Added 2026-10-23; L4-13.) | Iowa HHS |
| Georgia | already live (Pathways § 1115); converts 2027-01-01. **Waiver expires 2026-12-31** | ? | ? | ? | ? | ? | GA DCH |
| Idaho | 2027-01-01 | **3** | **3** of the 6-month period (Corrected 2026-10-23: said "?"; L4-14, L4-15.) | ? | ? | **2027-01** (6-mo attestation for new enrollees) | KFF, legislation; ID DHW for the 2026-10-23 value |
| Indiana | 2027-01-01 | **3** | **3** before each renewal (Corrected 2026-10-23: said "every month"; L4-14, L4-15.) | **quarterly** | **none** | **2027-01** | KFF, legislation; IN FSSA partner toolkit for the 2026-10-23 value |
| New Hampshire | 2027-01-01 | 1 | every month | **at least quarterly** (Corrected 2026-10-23: said "**quarterly**"; L4-14.) | **none** without the oversight committee's approval (Corrected 2026-10-23: said "?"; L4-18.) | RSA 126-AA:6 accepts medical frailty only on a clinician's certification; from when is not confirmed (Corrected 2026-10-23: said "?"; L4-13.) | KFF, enacted text (RSA 126-AA:6) |
| North Carolina | 2027-01-01 | ? | **3** of 6 (Corrected 2026-10-23: said "?"; L4-15.) | ? | ? | **2027-01** (statute bars attestation as sole evidence) | Politico, whose report of 2026-08-09 the research of 2026-10-16 did not open; AP (September 2026) also names North Carolina (Added 2026-10-23; L4-13, L8-6.); NC Medicaid for the 2026-10-23 value |
| North Dakota | 2027-01-01 | ? | ? | ? | ? | **2027-01** | Politico, the row's only source, whose report of 2026-08-09 the research of 2026-10-16 did not open (Added 2026-10-23; L4-13, L8-6.) |
| Ohio | 2027-01-01 | ? | ? | ? | ? | **2027-01** | Politico, whose report of 2026-08-09 the research of 2026-10-16 did not open; AP (September 2026) also names Ohio (Added 2026-10-23; L4-13, L8-6.) |
| Utah | 2027-01-01 | ? | ? | ? | ? | **2027-01** | Politico, the row's only source, whose report of 2026-08-09 the research of 2026-10-16 did not open (Added 2026-10-23; L4-13, L8-6.) |
| Missouri | 2027-01-01 | ? | ? | ? | **none**: no short-term hardship exception (Corrected 2026-10-23: said "**no unemployment event**"; L4-9, L4-18.) | ? | MO DSS FAQ |
| Oklahoma | 2027-01-01 | ? | ? | ? | **all four**; OHCA says the two county-based events, disaster and unemployment, await federal approval (Corrected 2026-10-23: said "**no unemployment or disaster event**"; L4-10, L8-15.) | ? | KFF; OHCA for the 2026-10-23 value |
| New York | 2027-01-01 | ? | ? | ? | **all four**, medical travel included (Corrected 2026-10-23: said "**no medical-travel event**"; L4-11, L8-15.) | ? | KFF; NY State of Health for the 2026-10-23 value |
| Tennessee | 2027-01-01 (§ 1115) | ? | ? | ? | ? | ? | TennCare notices |

Kentucky has no row. KRS 205.5371, as amended by 2026 Ky. Acts ch. 179 and in effect since 2026-04-14, has applicants
show the month before they apply and enrollees 3 months since their last determination, where the federal default
shows 1, and bars the cabinet from seeking a good-faith effort exemption without the General Assembly. (Added
2026-10-23; L3-17, L4-15.)

**Aggregate from the KFF survey of all 44:** 34 verify every six months at renewal · 36 use a 1-month
application lookback · 34 use 1 month at renewal · **29 plan at least one hardship exception, and all but
three of those take all four.** Those three answers predate the interim final rule, whose preamble gives a State
no option to make one or only some of the events the exclusive basis for the exception (91 FR 33380); see the note
above the tracker. (Added 2026-10-23; L8-15; read in docs/domain/cms-2454-ifc/2026-11094.xml:1346.)

**In scope (44 = 43 States + DC):** the expansion States and DC, **plus Georgia, Tennessee, and Wisconsin**
(§ 1115), plus § 1115 populations inside **Hawaii, Massachusetts, New York, Oregon, and Utah**.
**Out of scope:** Alabama, Florida, Kansas, Mississippi, South Carolina, Texas, Wyoming — and **all
territories** (§ 435.550).

*Content in this section was rephrased for compliance with licensing restrictions. Source:
[KFF, An Early Look at Policy Decisions as States Get Ready to Implement Work Requirements](https://www.kff.org/medicaid/an-early-look-at-policy-decisions-as-states-get-ready-to-implement-work-requirements/).*

---

## Open data gaps

1. **Exact lookback values** for Idaho, Indiana, New Hampshire, Arkansas are now published by State sources:
   Idaho 3 months at application and 3 in the 6-month period; Indiana 3 before application and 3 before each renewal
   or quarterly review; New Hampshire 1 at application, with checks at least quarterly; Arkansas 1 at application
   and 1 in each 6 months. The tracker carries them. (Corrected 2026-10-23: said "— reported as "more than one"
   without specifics."; L4-14, L8-7.)
2. **Hardship elections.** State sources now give some: Missouri uses no short-term hardship exception, New
   Hampshire's statute allows none without the oversight committee's approval, and Oklahoma and New York list all
   four events. (Corrected 2026-10-23: said "No State's election is confirmed."; L4-18, L4-9, L4-10, L4-11.) This is
   the largest gap, because it determines whether an entire feature is relevant to a given user.
3. **Medically frail condition lists.** Every State must **develop** one — § 435.554(c)(5)(ii) requires it be auditable, regularly revised, and paired with an off-list request path, but does **not** require publication. None catalogued, and a user told to ask for the list may find their State has not published it. *(Corrected 2026-09-02: this said "publish".)*
4. **Reasonably-predictable-changes elections.** CMS says most States elect it and most elect both
   directions, but per-State values are unknown — and this changes the seasonal calculation outright.
5. **SPA / State plan election material.** CMS has published the MACPro implementation guide for the "Community
   Engagement for Certain Adults" State plan page (PDF created 2026-08-04,
   https://www.medicaid.gov/resources-for-states/downloads/macpro-ig-community-engagement-certain-adults.pdf). It
   holds the elections C.1 short-term hardship, D.2 months before application, D.4 months at renewal, E.1 to E.3 more
   frequent verification, and F.3 the "unable to verify" option at renewal. The guide is not stored in the corpus. A
   State's SPA on that page, once approved, is the authoritative source for most of this table. (Corrected
   2026-10-23: said "CMS said the template was "currently under development."" and "That document, once published,
   is the authoritative source for most of this table."; L2-6, L4-6, L6-2.)

## How to add a State

1. Find a State-published source — SPA, verification plan, State plan amendment, agency guidance page.
2. Add a profile with `confidence: "state-published"` and a real `source` citation.
3. Leave anything you cannot source as the federal default. **Do not infer.**
4. Add a regression test asserting the profile's values, so a later refactor cannot silently change them.
