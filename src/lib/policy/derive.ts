/**
 * Values derived from a policy profile, and the copy its uncertainty requires.
 *
 * Nothing here reaches a determination. `incomeThreshold` applies a formula CMS published;
 * `confidenceHedge` says how much the profile can be trusted. Under ADR-0003's split the
 * first is **Computed** — the state will calculate that exact figure — and everything that
 * depends on a state election is **Conditional**, shown with the election named.
 *
 * `compliance-copy-standards.md`: "Computing is not adjudicating. Refusing to show
 * arithmetic CMS published is not humility, it's withholding."
 */

import type { PolicyProfile } from "./types";

/**
 * The monthly income threshold — 42 CFR 435.552(a)(6), 91 FR 33470.
 *
 * `federalMinimumWage × requiredHours`. $7.25 × 80 = $580 in 2026.
 *
 * A FUNCTION AND NOT A FIELD, DELIBERATELY. ADR-0001 says the threshold is "derived, never
 * stored", and `state-options.md` used to encode that as `readonly incomeThreshold:
 * number` with the sentence in a comment. `readonly` means "not reassignable after
 * construction"; it does not mean derived. Nothing stopped a per-state profile from
 * storing a value that was not wage × hours — the exact failure the comment was trying to
 * prevent. Corrected in W2b.
 *
 * The value is statutory but DYNAMIC: it moves if the FLSA is amended, and it must not be
 * computed from a tipped wage, the $4.25 youth wage, or a state minimum wage even where
 * that is higher.
 *
 * Rounded to cents. Several plausible wage figures produce a binary-inexact product, and a
 * threshold rendered as `$580.40000000000003` is a defect on a screen someone is holding a
 * pay stub up against.
 */
export function incomeThreshold(profile: PolicyProfile): number {
  return (
    Math.round(profile.federalMinimumWage * profile.requiredHours * 100) / 100
  );
}

/**
 * What the app must say about how much this profile can be trusted.
 *
 * ADR-0001: "`confidence` exists so the UI can hedge honestly. A `statutory-floor` profile
 * should produce copy like 'your state may require more.'" A discriminator nothing reads
 * is not a discriminator, so this is the reader.
 *
 * Every branch names the actor — `compliance-copy-standards.md`: "'Your state decides,'
 * not 'it is determined'" — and every hedge carries a next action, because "a hedge with
 * nothing after it is worse than a verdict; it transfers anxiety without transferring
 * capability."
 */
export function confidenceHedge(profile: PolicyProfile): string {
  switch (profile.confidence) {
    case "statutory-floor":
      return (
        `These are the federal minimums (${profile.label}). ` +
        `We don't have your state's own choices on file, and your state may require more ` +
        `than this. Ask them what they have for you, and what months they'll look at.`
      );
    case "state-published":
      return (
        `These come from what your state has published (${profile.label}). ` +
        `States can change them, so it's still worth asking your state to confirm what ` +
        `applies to you.`
      );
    case "third-party-reported":
      return (
        `These are what your state has been reported to have chosen (${profile.label}), ` +
        `not something we've read in your state's own words. Treat them as a starting ` +
        `point and ask your state to confirm.`
      );
  }
}
