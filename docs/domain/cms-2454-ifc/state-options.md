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
   * Known interpretive risks: the MAGI-household reading of § 435.552(f); the
   * "whether or not consecutive" reading of § 435.556(a)(2); the medically-frail
   * functional-impairment gate (under challenge in Massachusetts v. Oz, SJ hearing 2026-10-20).
   */
  interpretiveRisk?: Array<{ field: string; basis: string; watch: string }>;

  // --- Thresholds (statutory, but dynamic) ---
  /** 7.25 — 29 U.S.C. 206(a)(1)(C), via § 435.552(a)(6) at 91 FR 33470. */
  federalMinimumWage: number;
  /** 80 — § 435.552(a)(1)-(3), (5)-(7) at 91 FR 33470. */
  requiredHours: number;
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
  extendedCaretakerRelativeRelationships: boolean;  // § 435.554(a)(iv)
  rehabMinimumTimeCommitmentHours: number | null;   // § 435.554(c)(8)
  medicallyFrailConditionListUrl: string | null;    // § 435.554(c)(5)(ii)

  // --- Hardship (§ 435.555) ---
  shortTermHardshipOffered: boolean;
  unemploymentHardshipEffectuated: boolean;

  // --- Process (§§ 435.557–435.559) ---
  implementationDate: string;
  /**
   * PER-STATE, not a constant. Federally 2028-01-01 (§ 435.557(b)(2)(ii)), but eight States
   * require medical-frailty documentation from January 2027: AR, ID, IN, IA, NC, ND, OH, UT.
   */
  documentationRequiredFrom: string;
  /** § 435.560. Non-null means the State is NOT enforcing yet. Expires no later than 2028-12-31. */
  goodFaithEffortExemptionThrough: string | null;
  /** § 435.558(a)(2), 91 FR 33476. 30 calendar days from RECEIPT, not from the notice date. */
  noncomplianceResponseDays: number;
  /** § 435.558(c)(4), 91 FR 33477. "considered to be received 5 days after the date on the notice". */
  noticeReceiptPresumptionDays: number;
  /** § 435.916(a)(3)(iii). 90 is a FEDERAL FLOOR for MAGI; the only election is to elect longer. */
  reconsiderationDays: number;
  /**
   * How long the eligibility period is: 6 for the adult group, 12 for AI/AN and most 1115.
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
  /** § 435.558(b)(2). Option 1 = notice concurrent with renewal form. Option 2 = notice after it. */
  unableToVerifyAtRenewal: "option-1-concurrent" | "option-2-sequential";
  /** § 435.558(b)(3). Same binary for more-frequent verification. */
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
| `implementationDate` | 2027-01-01 | § 435.559(a) |
| `documentationRequiredFrom` | 2028-01-01 | § 435.557(b)(2)(ii) — **but 2027-01-01 in eight States** |
| `goodFaithEffortExemptionThrough` | null | § 435.560. CMS expects ~10 States to request one |
| `noncomplianceResponseDays` | 30 | § 435.558(a)(2) |
| `noticeReceiptPresumptionDays` | 5 | § 435.558(c)(4) |
| `reconsiderationDays` | 90 | § 435.916(a)(3)(iii) — federal floor |
| `renewalIntervalMonths` | 6 | **SSA § 1902(e)(14)(L), NOT this rule.** See the next row |
| `renewalIntervalMonthsSource` | *(the caveat, in full)* | The IFC amends § 435.916 to say MAGI renewals happen every 12 months and no more often, while its own preamble says the adult group is subject to 6-month renewals from January 1, 2027 under § 1902(e)(14)(L) — a different section of PL 119-21 that this rule does not implement, and which does not reach American Indians or most § 1115 enrollees. No reconciling rulemaking has issued. 6 is treated as operative and flagged as sourced elsewhere |
| `submissionModalities` | `["online","phone","mail","in-person","fax","electronic"]` | § 435.907(a). **Fax is real** — Missouri accepts it |
| `unableToVerifyAtRenewal` | `option-2-sequential` | § 435.558(b)(2). Assumed because it is more protective — two windows rather than one |
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

Sources so far are third-party reported (KFF's survey of Medicaid officials, fielded January–March
2026). Treat every row as `confidence: "third-party-reported"` until we find State-published material.

| State | Implementation | App. lookback | Renewal months | More frequent | Hardship | Frailty docs from | Source |
|---|---|---|---|---|---|---|---|
| **Modal case** (~34 States) | 2027-01-01 | 1 | 1 | decline | all four | 2028-01-01 | KFF survey |
| **Nebraska** | **LIVE 2026-05-01 — first State to disenroll** | ? | ? | ? | ? | **2027-01** | KFF, state press |
| **Montana** | **LIVE 2026-07-01** | ? | ? | ? | ? | ? | KFF |
| **Arkansas** | **LIVE 2026-07-01** soft launch, no disenrollment before 2027-01-01 | ? | **3** | decline | ? | **2027-01** | AR DHS |
| **Iowa** | **2026-12-01** | ? | ? | ? | **none** | **2027-01** | Iowa HHS |
| Georgia | already live (Pathways § 1115); converts 2027-01-01. **Waiver expires 2026-12-31** | ? | ? | ? | ? | ? | GA DCH |
| Idaho | 2027-01-01 | **3** | ? | ? | ? | **2027-01** (6-mo attestation for new enrollees) | KFF, legislation |
| Indiana | 2027-01-01 | **3** | every month | **quarterly** | **none** | **2027-01** | KFF, legislation |
| New Hampshire | 2027-01-01 | 1 | every month | **quarterly** | ? | ? | KFF, enacted text |
| North Carolina | 2027-01-01 | ? | ? | ? | ? | **2027-01** (statute bars attestation as sole evidence) | Politico |
| North Dakota | 2027-01-01 | ? | ? | ? | ? | **2027-01** | Politico |
| Ohio | 2027-01-01 | ? | ? | ? | ? | **2027-01** | Politico |
| Utah | 2027-01-01 | ? | ? | ? | ? | **2027-01** | Politico |
| Missouri | 2027-01-01 | ? | ? | ? | **no unemployment event** | ? | MO DSS FAQ |
| Oklahoma | 2027-01-01 | ? | ? | ? | **no unemployment or disaster event** | ? | KFF |
| New York | 2027-01-01 | ? | ? | ? | **no medical-travel event** | ? | KFF |
| Tennessee | 2027-01-01 (§ 1115) | ? | ? | ? | ? | ? | TennCare notices |

**Aggregate from the KFF survey of all 44:** 34 verify every six months at renewal · 36 use a 1-month
application lookback · 34 use 1 month at renewal · **29 plan at least one hardship exception, and all but
three of those take all four.**

**In scope (44 = 43 States + DC):** the expansion States and DC, **plus Georgia, Tennessee, and Wisconsin**
(§ 1115), plus § 1115 populations inside **Hawaii, Massachusetts, New York, Oregon, and Utah**.
**Out of scope:** Alabama, Florida, Kansas, Mississippi, South Carolina, Texas, Wyoming — and **all
territories** (§ 435.550).

*Content in this section was rephrased for compliance with licensing restrictions. Source:
[KFF, An Early Look at Policy Decisions as States Get Ready to Implement Work Requirements](https://www.kff.org/medicaid/an-early-look-at-policy-decisions-as-states-get-ready-to-implement-work-requirements/).*

---

## Open data gaps

1. **Exact lookback values** for Idaho, Indiana, New Hampshire, Arkansas — reported as "more than one"
   without specifics.
2. **Hardship elections.** No State's election is confirmed. This is the largest gap, because it
   determines whether an entire feature is relevant to a given user.
3. **Medically frail condition lists.** Every State must publish one. None catalogued.
4. **Reasonably-predictable-changes elections.** CMS says most States elect it and most elect both
   directions, but per-State values are unknown — and this changes the seasonal calculation outright.
5. **SPA / State plan election material.** CMS said the template was "currently under development."
   That document, once published, is the authoritative source for most of this table.

## How to add a State

1. Find a State-published source — SPA, verification plan, State plan amendment, agency guidance page.
2. Add a profile with `confidence: "state-published"` and a real `source` citation.
3. Leave anything you cannot source as the federal default. **Do not infer.**
4. Add a regression test asserting the profile's values, so a later refactor cannot silently change them.
