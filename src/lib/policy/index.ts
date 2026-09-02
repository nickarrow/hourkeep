/**
 * The policy profile — ADR-0001. The only place a policy value may live.
 *
 * `engineering-standards.md` rule 2: "No policy value outside `src/lib/policy/`. `80`,
 * `580`, `7.25`, `4.33`, every lookback and review-period length. All of them are either
 * statutory-but-dynamic or state elections."
 *
 * Import from `@/lib/policy`, not from the files inside it.
 *
 *   import { FEDERAL_DEFAULT, incomeThreshold } from "@/lib/policy";
 *
 * Compliance functions take a profile as an OPTIONAL parameter defaulting to
 * `FEDERAL_DEFAULT`. Optional rather than required for a specific reason recorded in
 * ADR-0001: W0's characterization tests are the gate proving this refactor changed no
 * behaviour, and a required parameter would have forced every one of them to change,
 * destroying exactly the signal they exist to give.
 *
 * Per-state profiles are additive — a new profile object plus a selector, with no change
 * to calculation code. `docs/domain/cms-2454-ifc/state-options.md` § "How to add a State".
 */

export { FEDERAL_DEFAULT } from "./federalDefault";
export { incomeThreshold, confidenceHedge } from "./derive";
export {
  applicationRuleset,
  renewalInitiationWindow,
  type TransitionAnswer,
  type RenewalInitiationWindow,
} from "./transition";
export {
  POLICY_PROFILE_FIELDS,
  POLICY_FIELD_OWNERS,
  type PolicyProfile,
  type PolicyConfidence,
  type PolicyFieldOwner,
  type InterpretiveRisk,
  type ReviewPeriodPolicy,
} from "./types";
