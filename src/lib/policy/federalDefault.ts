/**
 * The federal default profile — ADR-0001.
 *
 * The least-restrictive statutory floor. Safe to show any user, and honest as long as the
 * app says it is a floor — which is what `confidence: "statutory-floor"` and
 * `confidenceHedge()` are for.
 *
 * WHERE THE VALUES COME FROM. Regulatory text quoted from
 * `docs/domain/cms-2454-ifc/2026-11094.txt`, paged by locating the nearest preceding
 * `[[FR p.]]` marker rather than by recall. Per-parameter reasoning and the per-state
 * tracker live in `docs/domain/cms-2454-ifc/state-options.md`.
 *
 * WHAT "DEFAULT" DOES AND DOES NOT MEAN. The rule states no defaults. Every value below is
 * either a statutory floor, a statutory constant, or **our assumption pending state data**
 * — and two of the assumptions are affirmatively counter-indicated by CMS's own preamble
 * (it says documentation "will generally be available" and encourages states to require
 * it). Treating any of this as settled is the error this profile exists to prevent.
 */

import type { PolicyProfile } from "./types";

export const FEDERAL_DEFAULT: PolicyProfile = {
  id: "federal-default",
  label: "Federal minimum (no state data)",
  /**
   * The IFC's effective date. Not January 1 2027 — the rule has been in force since July
   * 31, 2026; that later date is when states must have implemented.
   */
  effectiveFrom: "2026-07-31",
  source: {
    citation:
      "42 CFR 435.550-435.563, CMS-2454-IFC, 91 FR 33348 (June 3, 2026), as corrected " +
      "91 FR 39028 (June 29, 2026). Rule text at 91 FR 33469-33479: thresholds and what " +
      "counts at 435.552 (33470); mandatory exceptions at 435.553 (33471); exclusions at " +
      "435.554 (33471); hardship at 435.555 (33472); review periods at 435.556 (33473); " +
      "verification at 435.557 (33474); noncompliance at 435.558 (33476); implementation " +
      "timing at 435.559 (33478). Statutory floors and minimums; per-state elections " +
      "unknown. Sections are named rather than only ranged so a value's own citation can " +
      "be located from the profile alone.",
    url: "https://www.federalregister.gov/documents/2026/06/03/2026-11094",
    retrievedAt: "2026-09-02",
  },
  confidence: "statutory-floor",

  /**
   * Values resting on a CMS *interpretation* rather than unambiguous rule text — distinct
   * from "we do not know what Idaho elected", which is what `confidence` covers.
   *
   * ONE KNOWN RISK IS DELIBERATELY ABSENT. `state-options.md` also names the
   * MAGI-household reading of 42 CFR 435.552(f). There is no field for it, because
   * HourKeep does not compute a household MAGI figure at all — ADR-0003 makes that total
   * permanently Deferred, since 42 CFR 435.603(f) composition follows tax filing
   * relationships rather than residence and (d)(2) excludes some members outright. A risk
   * entry naming a field that does not exist would fail the test that keeps this list
   * honest, and inventing a field to hold it would be worse.
   */
  interpretiveRisk: [
    {
      field: "renewalIntervalMonths",
      basis:
        "Not an interpretation of this rule so much as a conflict between two parts of " +
        "PL 119-21. The IFC amends 42 CFR 435.916 to say MAGI renewals occur every 12 " +
        "months and no more often; its own preamble says the adult group is subject to " +
        "6-month renewals from January 1, 2027 under SSA 1902(e)(14)(L), which this rule " +
        "does not implement.",
      watch:
        "The reconciling rulemaking. Until it issues, 6 is treated as operative for the " +
        "adult group and flagged as sourced elsewhere.",
    },
    {
      field: "renewalMonthsRequired",
      basis:
        "PREAMBLE, 91 FR 33389, not rule text. 42 CFR 435.556(a)(2) says months need " +
        "'not be consecutive'; CMS reads that clause as not granting the state " +
        "discretion, so states may neither require consecutive months nor dictate which " +
        "months count. User-favourable, and the app states it on screen.",
      watch:
        "A final rule narrowing the reading, which would let a state pin specific months.",
    },
    {
      field: "seasonalMethod",
      basis:
        "42 CFR 435.552(g)(2) defines income only by cross-reference — 'as defined at " +
        "435.603' — and the IFC sets no verification rule for seasonal-worker status " +
        "anywhere. 26 U.S.C. 45R(d)(5)(B)'s two categories are inclusive examples, not a " +
        "closed test.",
      watch:
        "Any final-rule verification standard for seasonal-worker status, and whether a " +
        "state elects the 435.603(h)(3) proration, which can invert the answer for the " +
        "same person.",
    },
    {
      field: "frailtyListStructure",
      basis:
        "42 CFR 435.554(c)(5) gates the medically-frail exclusion on FUNCTIONAL " +
        "impairment, not diagnosis, and requires states to publish an auditable " +
        "condition list plus an off-list request path. Both the functional gate and the " +
        "narrowing of attestation are under challenge.",
      watch:
        "Massachusetts v. Oz (D. Mass.), summary judgment hearing October 20, 2026. " +
        "Preliminary injunction denied July 2026, so the rule is operative — but expect " +
        "this to move.",
    },
  ],

  // --- Thresholds ------------------------------------------------------------
  // 42 CFR 435.552(a)(6), 91 FR 33470: "the applicable minimum wage requirement under
  // section 6 of the Fair Labor Standards Act of 1938 (29 U.S.C. 206(a)(1)(C)),
  // multiplied by 80 hours". States may NOT substitute the tipped wage, the $4.25 youth
  // wage, or a higher state minimum wage.
  federalMinimumWage: 7.25, // policy-literal-ok
  requiredHours: 80, // policy-literal-ok
  // No incomeThreshold. `incomeThreshold(profile)` derives it — see derive.ts.

  // --- Review periods, 42 CFR 435.556 ---------------------------------------
  // (a)(1) at 91 FR 33473: "at least one, but not more than 3 consecutive months, as
  // specified in the State plan, immediately preceding the month of application."
  // 1 is both the statutory floor and, reportedly, what 36 of 44 jurisdictions elected.
  applicationLookbackMonths: 1,
  applicationLookbackBounds: { min: 1, max: 3 },
  // (a)(2) at 91 FR 33474: "1 or more months", whether or not consecutive.
  renewalMonthsRequired: 1,
  verificationMonthsRequired: 1,
  // 42 CFR 435.557(d). Declined by default; Indiana and New Hampshire verify quarterly.
  moreFrequentVerification: false,

  // --- What counts, 42 CFR 435.552 ------------------------------------------
  // Defaulted on. See the field's doc comment for why that is not cost-free.
  incomeToHoursProxyAvailable: true,
  // 42 CFR 435.552(g) statutory fallback. Most states instead elect 435.603(h)(3).
  seasonalMethod: { kind: "preceding-average", months: 6 },

  // --- Exclusion-affecting options, 42 CFR 435.554 --------------------------
  extendedCaretakerRelativeRelationships: false,
  rehabMinimumTimeCommitmentHours: null,
  medicallyFrailConditionListUrl: null,

  // --- Hardship, 42 CFR 435.555 --------------------------------------------
  // Not assumed. 29 of 44 reportedly plan at least one event, and all but three of those
  // take all four — but a reported plan is not an election, and assuming hardship is
  // available would tell a user a path exists that their state may not offer.
  shortTermHardshipOffered: false,
  unemploymentHardshipEffectuated: false,

  // --- Process, 42 CFR 435.557-435.560 -------------------------------------
  // 42 CFR 435.559(a), 91 FR 33478. (b) is the election to implement earlier.
  implementationDate: "2027-01-01",
  // 42 CFR 435.557(b)(2)(ii), 91 FR 33474 — but 2027-01-01 in eight states.
  documentationRequiredFrom: "2028-01-01",
  // 42 CFR 435.560. CMS expects roughly ten states to request one.
  goodFaithEffortExemptionThrough: null,
  // 42 CFR 435.558(a)(2), 91 FR 33476 — 30 days from RECEIPT.
  noncomplianceResponseDays: 30,
  // 42 CFR 435.558(c)(4), 91 FR 33477 — deemed received 5 days after the notice date.
  noticeReceiptPresumptionDays: 5,
  // 42 CFR 435.916(a)(3)(iii). A floor; the only election is longer.
  reconsiderationDays: 90,
  renewalIntervalMonths: 6,
  renewalIntervalMonthsSource:
    "NOT from CMS-2454-IFC. The IFC amends 42 CFR 435.916 to say MAGI renewals occur " +
    "every 12 months and no more often, while its own preamble states the adult group is " +
    "subject to 6-month renewals from January 1, 2027 under SSA 1902(e)(14)(L) — a " +
    "different section of PL 119-21 that this rule does not implement, and which does not " +
    "reach American Indians or most 1115 enrollees. The two do not agree and no " +
    "reconciling rulemaking has issued. 6 is treated as operative for the adult group per " +
    ".kiro/steering/medicaid-domain-knowledge.md, flagged as sourced elsewhere.",
  // 42 CFR 435.907(a).
  submissionModalities: [
    "online",
    "phone",
    "mail",
    "in-person",
    "fax",
    "electronic",
  ],
  // 42 CFR 435.558(b)(2). Assumed because two windows are more protective than one.
  unableToVerifyAtRenewal: "option-2-sequential",
  unableToVerifyAtVerification: null,
  // 42 CFR 435.557(g)(1). Off follows CMS's own stated preference, not just caution.
  skipFurtherInfoOnAttestedException: false,
  // 42 CFR 435.557(f)(1)(iii) minimum.
  frailtyReverificationMonths: 12,
  frailtyListStructure: "unknown",
  presumptiveEligibilityForAdultGroup: null,
};
