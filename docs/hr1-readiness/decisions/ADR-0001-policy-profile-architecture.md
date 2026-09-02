# ADR-0001 — Policy Profile Architecture

**Status:** Accepted
**Date:** 2026-08-16
**Supersedes:** the ad-hoc constants in `src/lib/utils/payPeriodConversion.ts`

## Context

CMS-2454-IFC leaves at least sixteen parameters to State election — lookback lengths, whether hardship
is offered, verification frequency, seasonal averaging method, the medically frail condition list, and
more. See `../../domain/cms-2454-ifc/state-options.md`.

HourKeep currently hardcodes policy values as literals. `80` appears in `calculations.ts`,
`Dashboard.tsx`, `export/page.tsx`, `recommendationEngine.ts`, and `GettingStartedContextual.tsx`.
`580` appears in four of those. Meanwhile `REQUIRED_HOURS` and `INCOME_THRESHOLD` exist and are unused.

Two further pressures: the income threshold is **dynamic** — it is `federalMinimumWage × 80`, and the
FLSA can be amended. And a final rule is expected after 79,718 comments, so IFC interpretations should
be treated as versioned rather than permanent.

We considered building per-State configuration now, and rejected it: we don't have the source data for
most States, and blocking on collecting it would stall everything.

## Decision

Introduce a single `PolicyProfile` module. One `FEDERAL_DEFAULT` profile encodes the least-restrictive
statutory floor. **All** compliance logic reads policy values from an injected profile and never from a
literal.

Per-State profiles are added later as purely additive data — a new profile object plus a selector —
with zero changes to calculation code.

Schema is defined in `../../domain/cms-2454-ifc/state-options.md`. Three properties are non-obvious and
deliberate:

- `incomeThreshold` is **derived**, never stored.
- `source` is **mandatory**. A profile without a citation is a guess, and guesses don't belong in
  compliance logic.
- `confidence` is `"statutory-floor" | "state-published" | "third-party-reported"`, so the UI can hedge
  honestly. A `statutory-floor` profile should produce copy like "your state may require more."

> ### Amended at execution — 2026-09-02, W2b
>
> Four things this ADR asserted turned out to need a mechanism rather than a statement. None reverses
> the decision; all four make it enforceable. Full reasoning in
> [`../waves/wave-2b-policy-profile.md`](../waves/wave-2b-policy-profile.md) § 2.1.1.
>
> 1. **"`incomeThreshold` is derived, never stored" needs to be a function, not a `readonly` field.**
>    `state-options.md` encoded it as `readonly incomeThreshold: number` with that sentence as a
>    comment. `readonly` means "not reassignable after construction" — it does **not** mean derived, and
>    nothing stopped a per-State profile from storing a value other than wage × hours. It is now
>    `incomeThreshold(profile)` with no field, which is the only form where this bullet is enforced.
> 2. **"Every compliance function grows a profile parameter" is an *optional* parameter defaulting to
>    `FEDERAL_DEFAULT`.** W5 established the pattern in `reviewPeriod.ts` and it is what keeps W0's
>    characterization tests callable unchanged — which is the gate proving the refactor is
>    behaviour-neutral. A required parameter would have forced every one of those tests to change,
>    destroying the signal.
> 3. **`source` being mandatory once per profile was not sufficient.** One value —
>    `renewalIntervalMonths` — has materially worse provenance than the rest, because it comes from
>    SSA § 1902(e)(14)(L) rather than from this rule, which says 12 months at § 435.916. It carries its
>    own `renewalIntervalMonthsSource`, and `interpretiveRisk` indexes the same fact for the UI.
>    A field-level exception to a profile-level rule, deliberately.
> 4. **`ReviewPeriodPolicy` is `Pick<PolicyProfile, …>`.** W5 shipped a standalone
>    `FEDERAL_DEFAULT_REVIEW_PERIOD` because this module did not exist yet, on the understanding that
>    W2b would move it. It is folded in as a `Pick` rather than a parallel interface plus an adapter, so
>    there is one declaration of each field's type and no bridge to drift. This ADR's "per-State
>    profiles are purely additive" property is unaffected.
>
> Also corrected in `state-options.md` at the same time: its note on `incomeToHoursProxyAvailable` still
> carried "the user has lost nothing", which **this ADR's own accepted-risk section had already
> retracted** on validation. Two documents, one retraction, applied to one of them. Fixed.

## Consequences

**Good**

- Fixes the existing duplication as a side effect. We were going to have to centralize `80` and `580`
  regardless; the profile shape is the same work done once, properly.
- A final rule becomes a new profile version with a new `effectiveFrom`, not a code rewrite.
- Per-State support becomes additive rather than invasive.
- Makes uncertainty representable, which the PRD treats as content rather than a gap.

**Costs**

- Every compliance function grows a profile parameter. Slightly more plumbing.
- Requires discipline: a lint rule or test should fail on new policy literals.

**Accepted risk**

- Defaulting `incomeToHoursProxyAvailable` to `true` when it is a State option. Justified because it
  surfaces a real, user-favorable possibility and HourKeep never adjudicates.

  > **Corrected on validation.** An earlier version of this said the user "loses nothing" if their State
  > declines it. That is wrong — **they lose the hours they didn't go find.** Someone shown "your state may
  > credit 52, you need 28 more," who logs 28 and is then denied because their State declined the option,
  > has lost coverage. Keep the default on, but the copy must frame it as belt-and-suspenders: *if you can
  > reach 80 without counting on this, do — and log the income too.* Per ADR-0003 this is a **Conditional**
  > value: show it with the State election named.

## Alternatives rejected

- **Keep literals, add a comment.** Doesn't survive the first State-specific request, and leaves the
  existing five-file duplication.
- **Build per-State profiles now.** No source data. Would stall on research.
- **Fetch policy from a remote config.** Breaks offline-first and adds a network dependency to
  compliance logic.
