/**
 * The policy profile — ADR-0001.
 *
 * Schema of record is `docs/domain/cms-2454-ifc/state-options.md`. This file implements
 * it; that file explains each parameter and tracks per-state values as we learn them. A
 * test reads the document and asserts the two agree field for field, so neither can drift.
 *
 * WHY THIS EXISTS. CMS-2454-IFC leaves at least sixteen parameters to state election, and
 * several statutory values are dynamic — the income threshold is the federal minimum wage
 * times 80 hours (42 CFR 435.552(a)(6), 91 FR 33470) and the FLSA can be amended. A final
 * rule is also expected after 79,718 comments. So policy values are DATA, versioned by
 * `effectiveFrom`, not constants in compliance code.
 *
 * WHAT THIS IS NOT. It describes what a state may require. It never describes whether
 * anyone met it. ADR-0003, extended by `engineering-standards.md` to types and return
 * values rather than only copy — a test asserts no field here is named like a verdict.
 */

/**
 * How much the STATE data in a profile can be trusted. Drives UI hedging.
 *
 * Distinct from `interpretiveRisk`, which is about CMS readings a court or a final rule
 * could move. This one is about whether we know what a given state elected.
 */
export type PolicyConfidence =
  | "statutory-floor"
  | "state-published"
  | "third-party-reported";

/**
 * A value resting on a CMS *interpretation* rather than on unambiguous rule text.
 *
 * `watch` is the actionable half: what event would change the answer. A risk with no
 * watch condition is a worry, not a risk.
 */
export interface InterpretiveRisk {
  /** Must name a real field on `PolicyProfile`. A test enforces this. */
  field: string;
  /** What the interpretation rests on, with its source tier named. */
  basis: string;
  /** What would change it. */
  watch: string;
}

export interface PolicyProfile {
  /** `"federal-default"`, `"state:AR"`, `"state:IN"` … */
  id: string;
  /** Human label, e.g. "Federal minimum (no state data)". */
  label: string;
  /** ISO date this profile's values took effect. */
  effectiveFrom: string;
  /** Where these values came from. Mandatory — ADR-0001 admits no unsourced profile. */
  source: { citation: string; url?: string; retrievedAt: string };
  confidence: PolicyConfidence;
  interpretiveRisk?: InterpretiveRisk[];

  // --- Thresholds: statutory, but dynamic ------------------------------------
  /** 29 U.S.C. 206(a)(1)(C), via 42 CFR 435.552(a)(6) — 91 FR 33470. */
  federalMinimumWage: number;
  /** 42 CFR 435.552(a)(1)-(3), (5)-(7) — 91 FR 33470. */
  requiredHours: number;
  //
  // THERE IS NO `incomeThreshold` FIELD, DELIBERATELY. See `incomeThreshold()` in
  // `derive.ts`. `state-options.md` used to declare `readonly incomeThreshold: number`
  // with the comment "Derived: never hardcode 580" — but `readonly` means "not
  // reassignable", not "derived", so nothing stopped a per-state profile storing a value
  // that was not wage x hours. A function cannot be given a contradictory value.

  // --- Review periods: 42 CFR 435.556 ---------------------------------------
  /**
   * 42 CFR 435.556(a)(1) — 91 FR 33473. How many consecutive months immediately
   * preceding the month of application a state assesses. 1 to 3.
   *
   * `number` and not `1 | 2 | 3`: a literal union is checked at compile time only, and
   * profiles will be loaded from storage. `applicationLookbackBounds` plus a runtime
   * throw in `reviewPeriod.ts` is what actually holds.
   */
  applicationLookbackMonths: number;
  /** 42 CFR 435.556(a)(1)'s statutory range for the above. Not itself an election. */
  applicationLookbackBounds: { min: number; max: number };
  /** 42 CFR 435.556(a)(2)(i) — 91 FR 33474. At least 1, whether or not consecutive. */
  renewalMonthsRequired: number;
  /** 42 CFR 435.556(a)(2)(ii). Months required between more-frequent verifications. */
  verificationMonthsRequired: number;
  /** 42 CFR 435.557(d). `false` means the state verifies only at renewal. */
  moreFrequentVerification:
    | false
    | { intervalMonths: number; monthsRequired: number };

  // --- What counts: 42 CFR 435.552 ------------------------------------------
  /**
   * 42 CFR 435.552(e)(2). Defaulted ON because it surfaces a real, user-favourable
   * possibility — but see ADR-0001's corrected accepted-risk note: if a state declines
   * it, the user has NOT lost nothing. They lose the hours they did not go find. Copy
   * built on this must be belt-and-braces, and (e)(2)(i) makes any credited figure an
   * UPPER BOUND because the state allocates hours between household members.
   */
  incomeToHoursProxyAvailable: boolean;
  /**
   * 42 CFR 435.552(g) for the fallback; 42 CFR 435.603(h)(3) for the election. A
   * discriminated union because the two paths produce genuinely different numbers for the
   * same person, and CMS says most states elect the second.
   */
  seasonalMethod:
    | { kind: "preceding-average"; months: 6 }
    | {
        kind: "reasonably-predictable-changes";
        windowMonths: number;
        direction: "increases" | "decreases" | "both";
      };

  // --- Exclusion-affecting options: 42 CFR 435.554 --------------------------
  /** 42 CFR 435.554(a)(iv). Whether the state extended the caretaker-relative list. */
  extendedCaretakerRelativeRelationships: boolean;
  /** 42 CFR 435.554(c)(8). `null` = no state-imposed minimum, not "zero hours". */
  rehabMinimumTimeCommitmentHours: number | null;
  /** 42 CFR 435.554(c)(5)(ii). `null` = we do not have the state's list. */
  medicallyFrailConditionListUrl: string | null;

  // --- Hardship: 42 CFR 435.555 --------------------------------------------
  /** All four event types or none — a state may not offer a subset. */
  shortTermHardshipOffered: boolean;
  /** 42 CFR 435.555(d)(3). A SECOND election, needing a state request and CMS approval. */
  unemploymentHardshipEffectuated: boolean;

  // --- Process: 42 CFR 435.557-435.560 -------------------------------------
  /**
   * 42 CFR 435.559(a) — 91 FR 33478: eligibility "furnished on or after January 1,
   * 2027". Paragraph (b) is the separate election to implement EARLIER, which is what a
   * per-state profile overrides — Nebraska went live 2026-05-01.
   */
  implementationDate: string;
  /**
   * How far ahead of a renewal's due date the state begins its ex parte review, in days.
   *
   * PREAMBLE, 91 FR 33416, and the weakest tier of anything in this profile: it is not an
   * interpretation of the rule, it is CMS reporting that "many States have a renewal
   * process that takes between 60 to 90 days" — a range ACROSS states, told to CMS by
   * state systems staff. So it is per-state and largely unknown, not a constant.
   *
   * It is here rather than in `transition.ts` because it decides a user-visible answer
   * (42 CFR 435.559(c): whether a renewal is the first "initiated" on or after the
   * implementation date), and ADR-0001 admits no policy value outside this module.
   *
   * A range and not a single number, because collapsing it to a point estimate would
   * manufacture certainty CMS does not claim. A state with a 30-day process gets a
   * different answer for the same renewal month.
   */
  renewalInitiationLeadDays: { min: number; max: number };
  /**
   * 42 CFR 435.557(b)(2)(ii) — 91 FR 33474. PER-STATE, not a constant. Federally
   * 2028-01-01, but eight states require medical-frailty documentation from January 2027:
   * AR, ID, IN, IA, NC, ND, OH, UT.
   */
  documentationRequiredFrom: string;
  /** 42 CFR 435.560. Non-null means the state is NOT enforcing yet. Ends by 2028-12-31. */
  goodFaithEffortExemptionThrough: string | null;
  /**
   * 42 CFR 435.558(a)(2) — 91 FR 33476. 30 calendar days from RECEIPT, not from the
   * notice date. Combine with `noticeReceiptPresumptionDays` for the ~35 days a user
   * actually has.
   */
  noncomplianceResponseDays: number;
  /**
   * 42 CFR 435.558(c)(4) — 91 FR 33477: a notice "is considered to be received 5 days
   * after the date on the notice, unless the applicant or beneficiary shows that he or
   * she did not receive the notice within the 5-day period."
   */
  noticeReceiptPresumptionDays: number;
  /** 42 CFR 435.916(a)(3)(iii). A FEDERAL FLOOR for MAGI; the only election is longer. */
  reconsiderationDays: number;
  /**
   * How long the eligibility period is — 6 for the adult group, 12 for AI/AN and most
   * § 1115 enrollees. Also the assumed span of a renewal review period.
   *
   * W5 declared this separately as `renewalPeriodMonths`; the two were the same quantity
   * under two names and merged in W2b. The weakest number in this profile: see
   * `renewalIntervalMonthsSource`, which must travel with it.
   */
  renewalIntervalMonths: number;
  /**
   * Its own citation, because this one value has materially worse provenance than
   * everything else here. The deliberate field-level exception to ADR-0001's
   * one-source-per-profile rule.
   */
  renewalIntervalMonthsSource: string;
  /** 42 CFR 435.907(a). Fax is real — Missouri accepts it. */
  submissionModalities: Array<
    "online" | "phone" | "mail" | "in-person" | "fax" | "electronic"
  >;
  /**
   * 42 CFR 435.558(b)(2). Option 1 = notice concurrent with the renewal form.
   * Option 2 = notice after it, which gives the user two windows rather than one.
   */
  unableToVerifyAtRenewal: "option-1-concurrent" | "option-2-sequential";
  /** 42 CFR 435.558(b)(3). The same binary for more-frequent verification. */
  unableToVerifyAtVerification:
    | "option-1-concurrent"
    | "option-2-sequential"
    | null;
  /** 42 CFR 435.557(g)(1). CMS ENCOURAGES states not to use this. */
  skipFurtherInfoOnAttestedException: boolean;
  /** 42 CFR 435.557(f)(1)(iii). At least every 12 months; a state may do it more often. */
  frailtyReverificationMonths: number;
  /**
   * 42 CFR 435.554(c)(5)(ii). `"unknown"` rather than `"flat"` by default: Georgia's
   * published list is two-tier, so "is my condition on the list?" is not a yes/no
   * question, and guessing `"flat"` would make the app answer it as though it were.
   */
  frailtyListStructure: "unknown" | "flat" | "automatic-plus-case-by-case";
  /** 42 CFR 435.1103(b), 435.1110(c)(2). PE/HPE must rest on ATTESTED information. */
  presumptiveEligibilityForAdultGroup: boolean | null;
}

/**
 * The policy fields the review-period module reads — 42 CFR 435.556.
 *
 * A `Pick` of `PolicyProfile`, not a parallel interface. W5 shipped this standalone as
 * `ReviewPeriodPolicy` with its own `FEDERAL_DEFAULT_REVIEW_PERIOD` because
 * `src/lib/policy/` did not exist yet and `waves/README.md` sequences W2b after W5.
 *
 * Folding it in as a `Pick` rather than a separate type plus an adapter means there is one
 * declaration of each field's type and no mapping that can drift — the failure mode
 * `getStoredComplianceMode` already demonstrated in this codebase. A `PolicyProfile`
 * satisfies this structurally, so it passes straight into `reviewPeriod.ts`.
 *
 * It is a `Pick` and not the whole profile so the module's dependency surface stays
 * visible: these seven fields are what review-period arithmetic depends on.
 */
export type ReviewPeriodPolicy = Pick<
  PolicyProfile,
  | "applicationLookbackMonths"
  | "applicationLookbackBounds"
  | "renewalMonthsRequired"
  | "verificationMonthsRequired"
  | "renewalIntervalMonths"
  | "renewalIntervalMonthsSource"
  | "source"
>;

/**
 * Every field name, at runtime.
 *
 * `keyof PolicyProfile` is erased when TypeScript compiles, so a field present in the
 * interface and absent from `FEDERAL_DEFAULT` would surface only as `undefined` at some
 * call site. Tests compare this against both the interface's source document and the
 * runtime object.
 */
export const POLICY_PROFILE_FIELDS = [
  "id",
  "label",
  "effectiveFrom",
  "source",
  "confidence",
  "interpretiveRisk",
  "federalMinimumWage",
  "requiredHours",
  "applicationLookbackMonths",
  "applicationLookbackBounds",
  "renewalMonthsRequired",
  "verificationMonthsRequired",
  "moreFrequentVerification",
  "incomeToHoursProxyAvailable",
  "seasonalMethod",
  "extendedCaretakerRelativeRelationships",
  "rehabMinimumTimeCommitmentHours",
  "medicallyFrailConditionListUrl",
  "shortTermHardshipOffered",
  "unemploymentHardshipEffectuated",
  "implementationDate",
  "renewalInitiationLeadDays",
  "documentationRequiredFrom",
  "goodFaithEffortExemptionThrough",
  "noncomplianceResponseDays",
  "noticeReceiptPresumptionDays",
  "reconsiderationDays",
  "renewalIntervalMonths",
  "renewalIntervalMonthsSource",
  "submissionModalities",
  "unableToVerifyAtRenewal",
  "unableToVerifyAtVerification",
  "skipFurtherInfoOnAttestedException",
  "frailtyReverificationMonths",
  "frailtyListStructure",
  "presumptiveEligibilityForAdultGroup",
] as const satisfies readonly (keyof PolicyProfile)[];

/**
 * Who reads each field — either a live consumer, or the wave that will.
 *
 * WHY THIS EXISTS. W2b implements the whole schema so that W3, W9a and W9b have a stable
 * target rather than each extending it. The cost is that most fields have no reader yet,
 * and W5's semantic reviewer fairly flagged two unreachable review-period arms as
 * speculative. The answer is not fewer fields; it is speculation that is written down.
 *
 * `why` is mandatory. An owner without a reason is a label.
 */
export interface PolicyFieldOwner {
  /** Path of a module that reads this field today. */
  consumer?: string;
  /** The wave that will read it, if nothing does yet. */
  wave?: string;
  why: string;
}

export const POLICY_FIELD_OWNERS: Record<
  (typeof POLICY_PROFILE_FIELDS)[number],
  PolicyFieldOwner
> = {
  id: {
    wave: "W3",
    why: "Profile selection per user's state. W3 is the first wave that resolves anything per-user from the profile",
  },
  label: {
    consumer: "src/lib/policy/derive.ts",
    why: "Named in the confidence hedge, so a user can see which profile the numbers came from",
  },
  effectiveFrom: {
    wave: "W3",
    why: "A final rule becomes a new profile version rather than a rewrite (ADR-0001). Nothing selects by date until profiles are selected at all",
  },
  source: {
    consumer: "src/lib/reviewPeriod.ts",
    why: "Part of ReviewPeriodPolicy. Mandatory per ADR-0001 and asserted by W5's tests",
  },
  confidence: {
    consumer: "src/lib/policy/derive.ts",
    why: "Drives confidenceHedge, which is the copy ADR-0001 requires of a statutory-floor profile",
  },
  interpretiveRisk: {
    wave: "W7b",
    why: "Structured hedging in the unified compliance view. W2b records the risks; nothing renders them yet",
  },
  federalMinimumWage: {
    consumer: "src/lib/policy/derive.ts",
    why: "Operand of incomeThreshold. Also the income-to-hours proxy divisor once W7b implements it",
  },
  requiredHours: {
    consumer: "src/lib/policy/derive.ts",
    why: "Operand of incomeThreshold, and the monthly hours threshold read by calculations.ts",
  },
  applicationLookbackMonths: {
    consumer: "src/lib/reviewPeriod.ts",
    why: "42 CFR 435.556(a)(1) month list",
  },
  applicationLookbackBounds: {
    consumer: "src/lib/reviewPeriod.ts",
    why: "Runtime validation of the above, and the bound tracking/page.tsx surfaces when a notice exceeds it",
  },
  renewalMonthsRequired: {
    consumer: "src/lib/reviewPeriod.ts",
    why: "42 CFR 435.556(a)(2)(i)",
  },
  verificationMonthsRequired: {
    consumer: "src/lib/reviewPeriod.ts",
    why: "42 CFR 435.556(a)(2)(ii)",
  },
  moreFrequentVerification: {
    wave: "W9a",
    why: "Determines whether the verification review period arm is reachable at all, and how often notices arrive",
  },
  incomeToHoursProxyAvailable: {
    wave: "W7b",
    why: "W7b implements the 42 CFR 435.552(e)(2) proxy and the combination rule",
  },
  seasonalMethod: {
    wave: "W7a",
    why: "W7a fixes the seasonal averaging window and implements the reasonably-predictable-changes alternative",
  },
  extendedCaretakerRelativeRelationships: {
    wave: "W4",
    why: "W4 rebuilds the caregiver cluster questions",
  },
  rehabMinimumTimeCommitmentHours: {
    wave: "W4",
    why: "W4 adds the 42 CFR 435.554(c)(8) rehabilitation-program question",
  },
  medicallyFrailConditionListUrl: {
    wave: "W4",
    why: "W4 adds the medically-frail path and the off-list request route",
  },
  shortTermHardshipOffered: {
    wave: "W9b",
    why: "W9b owns hardship. Whether it is offered decides if a whole feature is relevant to a user",
  },
  unemploymentHardshipEffectuated: {
    wave: "W9b",
    why: "The second, independent election at 42 CFR 435.555(d)(3)",
  },
  implementationDate: {
    consumer: "src/lib/policy/transition.ts",
    why: "Gaps 15.6 and 15.7 — 42 CFR 435.915 and 435.559(c) both compare against it",
  },
  renewalInitiationLeadDays: {
    consumer: "src/lib/policy/transition.ts",
    why: "42 CFR 435.559(c) triggers on when a renewal is INITIATED, which runs 60-90 days ahead of its due date",
  },
  documentationRequiredFrom: {
    wave: "W6a",
    why: "W6a escalates document prompting; the 2028 hardening is per-state and changes what to gather",
  },
  goodFaithEffortExemptionThrough: {
    wave: "W3",
    why: "A non-null value means the state is not enforcing yet, which changes the status resolution outright",
  },
  noncomplianceResponseDays: {
    wave: "W9a",
    why: "W9a builds the 30-plus-5 countdown",
  },
  noticeReceiptPresumptionDays: {
    wave: "W9a",
    why: "Same countdown. Separate field because only one of the two is the response window",
  },
  reconsiderationDays: {
    wave: "W9a",
    why: "The 90-day reconsideration path after disenrollment",
  },
  renewalIntervalMonths: {
    consumer: "src/lib/reviewPeriod.ts",
    why: "Span of an assumed renewal review period in renewalReviewPeriodEndingAt",
  },
  renewalIntervalMonthsSource: {
    consumer: "src/lib/reviewPeriod.ts",
    why: "Travels with the value above. W5 has a test asserting it cannot be separated from it",
  },
  submissionModalities: {
    wave: "W8a",
    why: "W8a produces the artifact; the modality list is what the export tells a user their channels are",
  },
  unableToVerifyAtRenewal: {
    wave: "W9a",
    why: "Decides whether the user gets one response window or two",
  },
  unableToVerifyAtVerification: {
    wave: "W9a",
    why: "The same binary for more-frequent verification",
  },
  skipFurtherInfoOnAttestedException: {
    wave: "W9a",
    why: "Changes what the state may ask for after an attested exception",
  },
  frailtyReverificationMonths: {
    wave: "W4",
    why: "How often a medically-frail user must re-establish status",
  },
  frailtyListStructure: {
    wave: "W4",
    why: "A two-tier list makes 'is my condition on it' a different question, which changes the screening flow",
  },
  presumptiveEligibilityForAdultGroup: {
    wave: "W3",
    why: "Affects whether an applicable individual can be enrolled on attested information",
  },
};
