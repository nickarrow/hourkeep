/**
 * The two transition rules — gaps 15.6 and 15.7.
 *
 * Both answer "does the community engagement requirement reach me yet?", and both turn on
 * the state's implementation date, which is why they live here rather than in
 * `reviewPeriod.ts`. Tests: `src/lib/policy/__tests__/transition.test.ts`.
 *
 * WHY NEITHER FUNCTION RETURNS A BOOLEAN. ADR-0003, and not as a formality. Both questions
 * have a genuine third answer:
 *
 *   - § 435.915 turns on the exact filing DATE, and HourKeep stores a MONTH. Where a state
 *     elected a mid-month implementation date under § 435.559(b), a filing month straddles
 *     the boundary and the two sides produce different assessed months.
 *   - § 435.559(c) turns on when a renewal was INITIATED, which runs ahead of its due date
 *     by an amount that varies per state. CMS reports 60-90 days across "many States" and
 *     publishes no per-state figure.
 *
 * A boolean would have to invent one of those. Guessing in the user-favourable direction is
 * still guessing, and here it is the dangerous direction: telling someone their state may
 * not assess months it will assess is how a person stops gathering evidence they need.
 *
 * SOURCE TIERS, WHICH DIFFER WITHIN A SINGLE ANSWER.
 *   - § 435.559(c)'s trigger is RULE TEXT at 91 FR 33478.
 *   - What "initiated" means, the 60-90 day lead, and the entire § 435.915
 *     pending-application discussion are PREAMBLE at 91 FR 33415-33416.
 *   The returned values keep those citations separate rather than merging them into one
 *   confident-looking string.
 */

import { addDays, format, isBefore, parseISO } from "date-fns";

import { FEDERAL_DEFAULT } from "./federalDefault";
import type { PolicyProfile } from "./types";

/** Which body of rules governs an application — 42 CFR 435.915. */
export interface TransitionAnswer {
  /**
   * `"prior-rules"` — filed before the implementation date, so community engagement is
   * not a condition of this determination and the preceding months are not assessed.
   * `"community-engagement"` — filed on or after it.
   * `"uncertain"` — a filing month straddling a mid-month implementation date.
   */
  ruleset: "prior-rules" | "community-engagement" | "uncertain";
  /** Plain-language reasoning, always ending in something the user can do. */
  why: string;
  /** The date compared against, so the answer can be checked rather than trusted. */
  implementationDate: string;
  /** Authority, with its source tier named. */
  citation: string;
}

/** When a renewal's ex parte review probably began — 42 CFR 435.559(c). */
export interface RenewalInitiationWindow {
  /** `YYYY-MM`. Earliest month the state may have begun reviewing. */
  earliestInitiationMonth: string;
  /** `YYYY-MM`. Latest such month. */
  latestInitiationMonth: string;
  /**
   * Where the window sits relative to the implementation date.
   *
   * `"before"` — the whole window precedes it, so this renewal is very likely NOT the
   * first initiated on or after implementation, and community engagement is probably not
   * verified at it. `"on-or-after"` — the whole window follows it. `"straddles"` — the
   * window crosses it, and which side applies depends on how long this state takes.
   */
  relationToImplementation: "before" | "on-or-after" | "straddles";
  /** The lead time used, so copy can state it rather than implying precision. */
  leadDays: { min: number; max: number };
  why: string;
  /** RULE TEXT. 42 CFR 435.559(c). */
  triggerCitation: string;
  /** PREAMBLE. The 60-90 day figure, which is a different tier of authority. */
  leadDaysCitation: string;
}

const APPLICATION_CITATION =
  "42 CFR 435.915, and the pending-application discussion in the CMS-2454-IFC " +
  "PREAMBLE at 91 FR 33415-33416 (June 3, 2026). The rule itself keys the effective date " +
  "of coverage to the submission date; the preamble carries that through to which rules " +
  "apply. PREAMBLE, not regulatory text.";

const TRIGGER_CITATION =
  "42 CFR 435.559(c), CMS-2454-IFC, 91 FR 33478 (June 3, 2026), RULE TEXT: for a " +
  "beneficiary enrolled as of the state's implementation date, the agency must verify " +
  "compliance 'at the applicable individual's first renewal initiated on or after the " +
  "implementation date.'";

const LEAD_DAYS_CITATION =
  "CMS-2454-IFC PREAMBLE, 91 FR 33416 — not regulatory text, and not an interpretation " +
  "of the rule either. CMS reports that 'many States have a renewal process that takes " +
  "between 60 to 90 days', based on discussion with state systems and operational staff. " +
  "A renewal is 'initiated' when the state begins reviewing reliable information " +
  "available to it in an effort to complete the renewal without asking the beneficiary " +
  "for anything (42 CFR 435.916(a)(2), ex parte renewal).";

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/**
 * Which rules govern an application — 42 CFR 435.915. Gap 15.6.
 *
 * CMS's worked example, preamble at 91 FR 33416: a state implementing January 1, 2027, an
 * application submitted December 15, 2026, a determination not made until January 15, 2027.
 * "Since the community engagement requirement was not in place at the time of application,
 * the State must not evaluate whether the individual is an applicable individual and
 * whether the individual demonstrated community engagement in November 2026, the month
 * before the month of application."
 *
 * **The determination date is irrelevant.** Only the filing date matters, and getting that
 * backwards would assess months the state may not assess — for exactly the people this rule
 * protects.
 *
 * MONTH GRANULARITY IS ACCEPTED, AND HERE IS WHY THAT IS SUFFICIENT TODAY.
 * `ReviewPeriodAnchor.month` stores `YYYY-MM`, and § 435.915 turns on a date. Every
 * implementation date we have data for is the first of a month — the federal 2027-01-01,
 * Nebraska 2026-05-01, Montana and Arkansas 2026-07-01, Iowa 2026-12-01 — and for a
 * first-of-month boundary a whole filing month falls on one side, so a month is exactly as
 * good as a date. Where a state elects a mid-month date this returns `"uncertain"` rather
 * than picking a side.
 *
 * A date-granular stored field was considered and not added: nothing in the app collects a
 * filing date yet, so the field would have had no writer. This function accepts one the day
 * something does.
 *
 * @param filedOn `YYYY-MM-DD` or `YYYY-MM`.
 * @throws if `filedOn` is neither.
 */
export function applicationRuleset(
  filedOn: string,
  profile: PolicyProfile = FEDERAL_DEFAULT,
): TransitionAnswer {
  const implementationDate = profile.implementationDate;
  const implementation = parseISO(implementationDate);

  const base = { implementationDate, citation: APPLICATION_CITATION };

  if (DATE_RE.test(filedOn)) {
    const prior = isBefore(parseISO(filedOn), implementation);
    return {
      ...base,
      ruleset: prior ? "prior-rules" : "community-engagement",
      why: prior
        ? `You filed on ${filedOn}, before your state's start date of ${implementationDate}. ` +
          `Applications filed first are decided under the older rules, even if the decision ` +
          `comes later — so the months before you applied should not be reviewed for this. ` +
          `Ask your state to confirm which rules they applied to your application.`
        : `You filed on ${filedOn}, on or after your state's start date of ${implementationDate}, ` +
          `so this requirement applies to your application. Ask your state which months ` +
          `they will look at.`,
    };
  }

  if (!MONTH_RE.test(filedOn)) {
    throw new Error(
      `applicationRuleset needs a filing date as YYYY-MM-DD or YYYY-MM, got ` +
        `${JSON.stringify(filedOn)}. Guessing a side of the implementation date would ` +
        `answer a coverage question from malformed input (42 CFR 435.915).`,
    );
  }

  // A month was given. It is unambiguous unless the implementation date falls inside it.
  const implementationMonth = format(implementation, "yyyy-MM");
  const implementationIsFirstOfMonth = implementationDate.endsWith("-01");

  if (filedOn === implementationMonth && !implementationIsFirstOfMonth) {
    return {
      ...base,
      ruleset: "uncertain",
      why:
        `Your state started this requirement partway through ${filedOn} ` +
        `(${implementationDate}), and we only know the month you applied, not the day. ` +
        `Whether the older rules or the new ones apply to you depends on the exact date ` +
        `you filed. Ask your state what filing date they have on record for you, and ` +
        `which rules they applied.`,
    };
  }

  const prior = filedOn < implementationMonth;
  return {
    ...base,
    ruleset: prior ? "prior-rules" : "community-engagement",
    why: prior
      ? `You filed in ${filedOn}, before your state's start date of ${implementationDate}. ` +
        `Applications filed first are decided under the older rules, even if the decision ` +
        `comes later — so the months before you applied should not be reviewed for this. ` +
        `Ask your state to confirm which rules they applied to your application.`
      : `You filed in ${filedOn}, on or after your state's start date of ` +
        `${implementationDate}, so this requirement applies to your application. Ask your ` +
        `state which months they will look at.`,
  };
}

/**
 * When a renewal's review probably began, and whether that lands before the state's
 * implementation date — 42 CFR 435.559(c). Gap 15.7.
 *
 * READ THE DIRECTION CAREFULLY; IT IS COUNTERINTUITIVE.
 *
 * Initiation runs AHEAD of the due date, so the lead time pushes a user's first assessment
 * **later**, not earlier. CMS considered triggering on the eligibility period's end date
 * and rejected it for exactly this reason, preamble at 91 FR 33416: "if a State were
 * required to begin verifying compliance for applicable individuals with a renewal due on
 * January 31, 2027, many States would be required to apply the community engagement
 * requirement at renewals initiated as early as November 2026. This would require States to
 * request information about community engagement activity prior to the State's
 * implementation date."
 *
 * So a renewal due January 2027 was initiated around October or November 2026 — before
 * January 1, 2027 — which means it is **not** the first renewal initiated on or after the
 * implementation date, and community engagement is probably not verified at it. That is the
 * single most reassuring fact in the rule for currently-enrolled users, and nothing in the
 * app told them before now.
 *
 * WHY THIS IS STILL HEDGED. The lead time is a state operational fact, reported by CMS only
 * as a range. `"before"` means "probably not this renewal", never "you will not be
 * assessed". A user who stops gathering evidence on the strength of an overstated
 * reassurance is worse off than one who gathered it unnecessarily.
 *
 * Months are `YYYY-MM`; the arithmetic runs on the FIRST of the due month, which is the
 * conservative end — a renewal due later in the month was initiated later too, so this
 * reports the earliest plausible initiation.
 *
 * @throws if `renewalDueMonth` is not `YYYY-MM`.
 */
export function renewalInitiationWindow(
  renewalDueMonth: string,
  profile: PolicyProfile = FEDERAL_DEFAULT,
): RenewalInitiationWindow {
  if (!MONTH_RE.test(renewalDueMonth)) {
    throw new Error(
      `renewalInitiationWindow needs a due month as YYYY-MM, got ` +
        `${JSON.stringify(renewalDueMonth)} (42 CFR 435.559(c)).`,
    );
  }

  const leadDays = profile.renewalInitiationLeadDays;
  const dueDate = parseISO(`${renewalDueMonth}-01`);

  // Longer lead = earlier initiation. Naming them this way round is the whole point.
  const earliest = addDays(dueDate, -leadDays.max);
  const latest = addDays(dueDate, -leadDays.min);

  const earliestInitiationMonth = format(earliest, "yyyy-MM");
  const latestInitiationMonth = format(latest, "yyyy-MM");

  const implementation = parseISO(profile.implementationDate);
  const earliestIsBefore = isBefore(earliest, implementation);
  const latestIsBefore = isBefore(latest, implementation);

  const relationToImplementation = latestIsBefore
    ? "before"
    : earliestIsBefore
      ? "straddles"
      : "on-or-after";

  const span =
    earliestInitiationMonth === latestInitiationMonth
      ? earliestInitiationMonth
      : `${earliestInitiationMonth} or ${latestInitiationMonth}`;

  const why =
    relationToImplementation === "before"
      ? `Your renewal is due ${renewalDueMonth}. States usually start looking at your ` +
        `records ${leadDays.min} to ${leadDays.max} days before that, so yours likely ` +
        `started around ${span} — before your state's start date of ` +
        `${profile.implementationDate}. If so, this requirement probably won't be checked ` +
        `until your next renewal after that. Ask your state when they'll start reviewing ` +
        `yours, and keep any records you already have.`
      : relationToImplementation === "straddles"
        ? `Your renewal is due ${renewalDueMonth}. States usually start looking at your ` +
          `records ${leadDays.min} to ${leadDays.max} days beforehand, which for you ` +
          `means around ${span} — and your state's start date of ` +
          `${profile.implementationDate} falls inside that stretch. So this may or may not ` +
          `be checked at this renewal, depending on how long your state takes. Ask your ` +
          `state when they started reviewing yours.`
        : `Your renewal is due ${renewalDueMonth}, and your state's review of it likely ` +
          `starts around ${span} — after your state's start date of ` +
          `${profile.implementationDate}. So this is likely to be checked at this renewal. ` +
          `Ask your state which months they'll look at, and what they already have on file.`;

  return {
    earliestInitiationMonth,
    latestInitiationMonth,
    relationToImplementation,
    leadDays,
    why,
    triggerCitation: TRIGGER_CITATION,
    leadDaysCitation: LEAD_DAYS_CITATION,
  };
}
