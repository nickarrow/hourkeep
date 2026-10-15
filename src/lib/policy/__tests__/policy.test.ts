/**
 * The policy profile — ADR-0001. W2b.
 *
 * Tier 1 under ADR-0007: `engineering-standards.md` names the policy profile among the
 * modules that "decide whether someone believes they will keep their health coverage",
 * so these tests are written before the module and every name carries its citation.
 *
 * WHAT THIS MODULE IS FOR. CMS-2454-IFC leaves at least sixteen parameters to state
 * election, and several statutory values are dynamic — the income threshold is the
 * federal minimum wage times 80, and the FLSA can be amended. ADR-0001: all compliance
 * logic reads policy values from an injected profile and never from a literal.
 *
 * WHAT IT MUST NOT DO. It reports what a state may require. It never reports whether
 * anyone met it. ADR-0003, and a test below asserts no field here is named like a
 * determination.
 *
 * SOURCE TIERS. Regulatory text is quoted from `docs/domain/cms-2454-ifc/2026-11094.txt`
 * and paged by locating the nearest preceding `[[FR p.]]` marker, not by recall. Where a
 * value rests on preamble rather than rule text it says so — and one value
 * (`renewalIntervalMonths`) does not come from this rule at all, which is why it carries
 * its own separate citation.
 */

import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  FEDERAL_DEFAULT,
  POLICY_PROFILE_FIELDS,
  POLICY_FIELD_OWNERS,
  incomeThreshold,
  confidenceHedge,
  type PolicyProfile,
} from "@/lib/policy";

describe("FEDERAL_DEFAULT: the least-restrictive statutory floor", () => {
  it("42 CFR 435.552(a)(1)-(3), (5)-(7): requires 80 hours a month", () => {
    // 91 FR 33470: "The individual works not less than 80 hours." The same figure
    // governs community service, work program, any combination, and the two income
    // pathways. NOT a state election — statutory, but dynamic if the statute changes.
    expect(FEDERAL_DEFAULT.requiredHours).toBe(80);
  });

  it("29 U.S.C. 206(a)(1)(C) via 42 CFR 435.552(a)(6): federal minimum wage is 7.25", () => {
    // 91 FR 33470 states the pathway as "the applicable minimum wage requirement under
    // section 6 of the Fair Labor Standards Act of 1938 (29 U.S.C. 206(a)(1)(C)),
    // multiplied by 80 hours". States may NOT substitute the tipped wage, the $4.25
    // youth wage, or a higher state minimum wage.
    expect(FEDERAL_DEFAULT.federalMinimumWage).toBe(7.25);
  });

  it("42 CFR 435.556(a)(1): application lookback defaults to the 1-month minimum", () => {
    // 91 FR 33473: "at least one, but not more than 3 consecutive months, as specified
    // in the State plan, immediately preceding the month of application." 36 of the 44
    // jurisdictions reportedly elected 1; Idaho, Indiana and New Hampshire legislated
    // longer. 1 is both the statutory floor and the modal election.
    expect(FEDERAL_DEFAULT.applicationLookbackMonths).toBe(1);
    expect(FEDERAL_DEFAULT.applicationLookbackBounds).toEqual({
      min: 1,
      max: 3,
    });
  });

  it("42 CFR 435.556(a)(2): renewal and verification default to 1 month required", () => {
    // 91 FR 33474: "1 or more months", whether or not consecutive.
    expect(FEDERAL_DEFAULT.renewalMonthsRequired).toBe(1);
    expect(FEDERAL_DEFAULT.verificationMonthsRequired).toBe(1);
  });

  it("42 CFR 435.552(e)(2): the income-to-hours proxy defaults to available", () => {
    // A state option defaulted ON because it surfaces a real user-favourable
    // possibility. ADR-0001 records the accepted risk and its correction: if a state
    // declines it the user has NOT "lost nothing" — they lose the hours they did not go
    // find. Conditional in ADR-0003's sense, and an upper bound under (e)(2)(i) because
    // the state allocates hours between household members by a method we cannot know.
    expect(FEDERAL_DEFAULT.incomeToHoursProxyAvailable).toBe(true);
  });

  it("42 CFR 435.552(g): seasonal averaging falls back to the 6 preceding months", () => {
    // The statutory fallback. Most states instead elect a reasonably-predictable-changes
    // methodology under 435.603(h)(3), which can invert the answer for the same person.
    expect(FEDERAL_DEFAULT.seasonalMethod).toEqual({
      kind: "preceding-average",
      months: 6,
    });
  });

  it("42 CFR 435.555: short-term hardship defaults to not offered", () => {
    // A state option, all four event types or none. Defaulted off because we cannot
    // assume it, not because it is unlikely — 29 of 44 reportedly plan at least one.
    expect(FEDERAL_DEFAULT.shortTermHardshipOffered).toBe(false);
    // 435.555(d)(3): unemployment is a SECOND independent election on top of the first,
    // requiring a state request and CMS approval.
    expect(FEDERAL_DEFAULT.unemploymentHardshipEffectuated).toBe(false);
  });

  it("42 CFR 435.559(a): implementation defaults to January 1, 2027", () => {
    // 91 FR 33478, rule text: eligibility for medical assistance "furnished on or after
    // January 1, 2027". Paragraph (b) is the separate election to implement EARLIER,
    // which is why per-state profiles override this and why Nebraska's is 2026-05-01.
    expect(FEDERAL_DEFAULT.implementationDate).toBe("2027-01-01");
  });

  it("42 CFR 435.557(b)(2)(ii): documentation hardening defaults to January 1, 2028", () => {
    // 91 FR 33474: "Beginning on January 1, 2028 ... the agency must require
    // documentation whenever documentation is reasonably available." PER-STATE, not a
    // constant — eight states require medical-frailty documentation from January 2027.
    expect(FEDERAL_DEFAULT.documentationRequiredFrom).toBe("2028-01-01");
  });

  it("42 CFR 435.558(a)(2) and (c)(4): 30 response days, 5 presumed-receipt days", () => {
    // 91 FR 33476: "a period of 30 calendar days beginning on the date on which such
    // notice of noncompliance is received". 91 FR 33477: the notice "is considered to be
    // received 5 days after the date on the notice". So ~35 days from the notice date,
    // and the two values must stay separate because only one of them is the window.
    expect(FEDERAL_DEFAULT.noncomplianceResponseDays).toBe(30);
    expect(FEDERAL_DEFAULT.noticeReceiptPresumptionDays).toBe(5);
  });

  it("42 CFR 435.916(a)(3)(iii): 90 reconsideration days, a floor not an election", () => {
    // The only election is to elect LONGER. Recorded because rule-extract.md § 10 notes
    // this row is commonly misread as a state choice in both directions.
    expect(FEDERAL_DEFAULT.reconsiderationDays).toBe(90);
  });

  it("42 CFR 435.560: no good-faith-effort exemption assumed", () => {
    // Non-null would mean the state is NOT enforcing yet. Cannot extend past 2028-12-31.
    expect(FEDERAL_DEFAULT.goodFaithEffortExemptionThrough).toBeNull();
  });

  it("42 CFR 435.907(a): every submission modality, including fax", () => {
    // Fax is real — Missouri accepts it. Dropping it from this list would tell someone
    // their only available channel does not exist.
    expect(FEDERAL_DEFAULT.submissionModalities).toEqual([
      "online",
      "phone",
      "mail",
      "in-person",
      "fax",
      "electronic",
    ]);
  });

  it("42 CFR 435.558(b)(2): assumes the more protective sequential notice", () => {
    // Option 2 gives the user two windows rather than one. Assumed because it is more
    // protective, and flagged as an assumption rather than a finding.
    expect(FEDERAL_DEFAULT.unableToVerifyAtRenewal).toBe("option-2-sequential");
    // Null because no more-frequent verification is assumed.
    expect(FEDERAL_DEFAULT.unableToVerifyAtVerification).toBeNull();
    expect(FEDERAL_DEFAULT.moreFrequentVerification).toBe(false);
  });

  it("42 CFR 435.557(g)(1): does not skip further info on an attested exception", () => {
    // CMS ENCOURAGES states not to use this option, so defaulting it off follows CMS's
    // own stated preference rather than merely being conservative.
    expect(FEDERAL_DEFAULT.skipFurtherInfoOnAttestedException).toBe(false);
  });

  it("42 CFR 435.554 and 435.557(f): exclusion-side defaults are unknown, not false", () => {
    // These three are "we have no data", which is a different claim from "the state did
    // not elect it". Null rather than a value the UI could present as settled.
    expect(FEDERAL_DEFAULT.rehabMinimumTimeCommitmentHours).toBeNull();
    expect(FEDERAL_DEFAULT.medicallyFrailConditionListUrl).toBeNull();
    expect(FEDERAL_DEFAULT.presumptiveEligibilityForAdultGroup).toBeNull();
    // 435.554(a)(iv): the base caretaker-relative list only.
    expect(FEDERAL_DEFAULT.extendedCaretakerRelativeRelationships).toBe(false);
    // 435.557(f)(1)(iii): at least every 12 months.
    expect(FEDERAL_DEFAULT.frailtyReverificationMonths).toBe(12);
    // 435.554(c)(5)(ii). "unknown" and not "flat": Georgia's published list is two-tier,
    // so "is my condition on the list?" is not a yes/no question, and guessing "flat"
    // would make the app answer it as though it were.
    expect(FEDERAL_DEFAULT.frailtyListStructure).toBe("unknown");
  });
});

describe("incomeThreshold: derived, never stored — ADR-0001 [S1]", () => {
  it("42 CFR 435.552(a)(6): the threshold is federalMinimumWage x requiredHours", () => {
    // 7.25 x 80 = 580 in 2026. The RELATIONSHIP is the rule; the operands are dynamic.
    expect(incomeThreshold(FEDERAL_DEFAULT)).toBe(580);
  });

  it("tracks a changed minimum wage, which is what proves it is derived and not stored", () => {
    // THE LOAD-BEARING ASSERTION IN THIS FILE.
    //
    // Asserting only `=== 580` passes just as well against a stored field, so it cannot
    // tell a derivation from a constant. `state-options.md` previously declared
    // `readonly incomeThreshold: number` with the comment "Derived: never hardcode 580",
    // and `readonly` means "not reassignable", not "derived" — nothing stopped a
    // per-state profile storing a number that was not wage x hours.
    //
    // 42 CFR 435.552(f) ties the threshold to the FLSA wage, and the FLSA can be
    // amended. If Congress raised the wage to $9.00 the threshold becomes $720 with no
    // code change. That is the property being pinned.
    const raised: PolicyProfile = { ...FEDERAL_DEFAULT, federalMinimumWage: 9 };
    expect(incomeThreshold(raised)).toBe(720);

    const moreHours: PolicyProfile = { ...FEDERAL_DEFAULT, requiredHours: 100 };
    expect(incomeThreshold(moreHours)).toBe(725);
  });

  it("is not a field on the profile, so no profile can carry a contradictory value", () => {
    expect("incomeThreshold" in FEDERAL_DEFAULT).toBe(false);
  });

  it("rounds to cents, so a wage increase cannot produce a sub-cent threshold", () => {
    /**
     * 7.23 x 80 evaluates to 578.4000000000001 in IEEE 754, not 578.4. A threshold
     * rendered like that is a defect on a screen someone is holding a pay stub against.
     *
     * THE FIRST VERSION OF THIS TEST WAS WORTHLESS and mutation testing is what showed
     * it. It used 7.255, whose product with 80 is exactly 580.4 in binary — so deleting
     * `Math.round` entirely left the test green. Picking an operand that happens to be
     * cent-exact makes a rounding test assert nothing at all.
     *
     * 7.23 is also a more honest fixture than a contrived one: it is what a modest FLSA
     * amendment would plausibly look like, and 42 CFR 435.552(a)(6) ties the threshold to
     * whatever that wage becomes.
     */
    const raised: PolicyProfile = {
      ...FEDERAL_DEFAULT,
      federalMinimumWage: 7.23,
    };

    // The assertion that fails if rounding is removed.
    expect(raised.federalMinimumWage * raised.requiredHours).not.toBe(578.4);
    expect(incomeThreshold(raised)).toBe(578.4);
  });
});

describe("provenance: every profile carries a citation — ADR-0001", () => {
  it("source is present, cites the rule, and is not a placeholder", () => {
    // "A profile without a citation is a guess, and guesses don't belong in compliance
    // logic." The regex is the substantive half: a non-empty string is easy to satisfy
    // with "TODO".
    expect(FEDERAL_DEFAULT.source.citation).toMatch(/435\.55/);
    expect(FEDERAL_DEFAULT.source.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("confidence is statutory-floor, and produces a hedge that names the limitation", () => {
    // ADR-0001: "a `statutory-floor` profile should produce copy like 'your state may
    // require more.'" A discriminator nothing reads is not a discriminator, so this
    // asserts the copy exists rather than only the flag.
    expect(FEDERAL_DEFAULT.confidence).toBe("statutory-floor");

    const hedge = confidenceHedge(FEDERAL_DEFAULT);
    expect(hedge).toMatch(/may require more/i);
    // compliance-copy-standards.md: "Name the actor. 'Your state decides,' not 'it is
    // determined.'"
    expect(hedge).toMatch(/your state/i);
    // "Every hedge carries a next action. A hedge with nothing after it is worse than a
    // verdict — it transfers anxiety without transferring capability."
    expect(hedge).toMatch(/\bAsk\b/);
    // And it must say what is actually missing, or "may require more" reads as vague
    // hedging rather than a specific gap the user can close.
    expect(hedge).toMatch(/don't have your state's own choices/i);
  });

  it("does not tell a state-published profile that we lack its state's data", () => {
    /**
     * The substantive positive twin.
     *
     * An earlier version asserted only `!==` against the statutory-floor hedge, and
     * mutation testing showed that to be nearly worthless: rewriting the state-published
     * branch to open with the federal-minimums sentence left the two strings unequal, so
     * the test stayed green while a user with real state data was told we had none.
     *
     * The property that matters is not "these differ" but "neither says something false
     * about its own profile."
     */
    const published: PolicyProfile = {
      ...FEDERAL_DEFAULT,
      confidence: "state-published",
    };
    const hedge = confidenceHedge(published);

    expect(hedge).not.toMatch(/don't have your state's own choices/i);
    expect(hedge).not.toMatch(/federal minimums/i);
    // Positive half: it says where the values did come from, and still points at the
    // agency, because a state can change an election after publishing it.
    expect(hedge).toMatch(/published/i);
    expect(hedge).toMatch(/\bask/i);
  });

  it("marks a third-party-reported profile as second-hand", () => {
    // The most misleading of the three if it goes unhedged: KFF's survey of state
    // officials is the source for most of what we know, and a survey response is not a
    // state's own published election.
    const reported: PolicyProfile = {
      ...FEDERAL_DEFAULT,
      confidence: "third-party-reported",
    };
    const hedge = confidenceHedge(reported);

    expect(hedge).toMatch(/reported/i);
    expect(hedge).not.toMatch(/federal minimums/i);
    expect(hedge).toMatch(/\bask/i);
  });

  it("renewalIntervalMonths cannot travel without its own separate citation", () => {
    // From W5, and the reason it exists: the IFC amends 42 CFR 435.916 to say MAGI
    // renewals occur every 12 months and no more often, while its own preamble says the
    // adult group is subject to 6-month renewals from January 1, 2027 under SSA
    // 1902(e)(14)(L) — a different section of PL 119-21 that this rule does not
    // implement. 6 is treated as operative and flagged as sourced elsewhere.
    expect(FEDERAL_DEFAULT.renewalIntervalMonths).toBe(6);

    const caveat = FEDERAL_DEFAULT.renewalIntervalMonthsSource;
    // Both authorities named.
    expect(caveat).toMatch(/435\.916/);
    expect(caveat).toMatch(/1902\(e\)\(14\)\(L\)/);
    // Says it is not from this rule.
    expect(caveat).toMatch(/NOT from CMS-2454-IFC/);
    /**
     * And says the two CONFLICT — a separate assertion, not an alternation.
     *
     * The first version was `/not.*(agree|from CMS-2454)/i`, which mutation testing
     * showed to be worthless: deleting "The two do not agree" left the string starting
     * "NOT from CMS-2454-IFC", so the second branch of the alternation matched and the
     * test stayed green. An alternation across two independent claims asserts neither.
     *
     * The conflict is the load-bearing part. Citing both sections while implying they
     * agree would be worse than citing one, because a reader would stop looking.
     */
    expect(caveat).toMatch(/do not agree/);
    expect(caveat).toMatch(/no reconciling rulemaking has issued/i);
  });

  it("interpretiveRisk indexes the same field the source string describes — [S4]", () => {
    // Two representations of one caveat, which needs guarding: the prose string is what
    // travels with the number, the structured entry is what the UI hedges from. If they
    // named different fields, one of them would be lying.
    const risks = FEDERAL_DEFAULT.interpretiveRisk ?? [];
    expect(risks.some((r) => r.field === "renewalIntervalMonths")).toBe(true);

    for (const risk of risks) {
      // Each entry must name a real field, or it is pointing at nothing.
      expect(POLICY_PROFILE_FIELDS).toContain(risk.field);
      // "watch" is the actionable half — what would change the answer.
      expect(risk.watch.length).toBeGreaterThan(0);
      expect(risk.basis.length).toBeGreaterThan(0);
    }
  });

  it("flags the interpretive risks state-options.md names, not only the renewal one", () => {
    // The schema names three known interpretive risks: the MAGI-household reading of
    // 435.552(f), the "whether or not consecutive" reading of 435.556(a)(2), and the
    // medically-frail functional gate under challenge in Massachusetts v. Oz (summary
    // judgment hearing 2026-10-20). A profile that flags one and silently omits the
    // others is worse than one that flags none, because the absence reads as assurance.
    const fields = (FEDERAL_DEFAULT.interpretiveRisk ?? []).map((r) => r.field);
    // The "whether or not consecutive" reading of 435.556(a)(2) — preamble at
    // 91 FR 33389, and user-favourable, which is why the app states it on screen.
    expect(fields).toContain("renewalMonthsRequired");
    // The 435.552(g)(2) cross-reference, plus the absence of any verification rule for
    // seasonal-worker status.
    expect(fields).toContain("seasonalMethod");
    // The medically-frail functional gate, under challenge in Massachusetts v. Oz.
    expect(fields).toContain("frailtyListStructure");
  });

  it("names Massachusetts v. Oz as the thing to watch on the frailty gate", () => {
    // The specific, dated, actionable form. "This may change" is not a watch condition;
    // "summary judgment hearing October 20, 2026" is.
    const frailty = (FEDERAL_DEFAULT.interpretiveRisk ?? []).find(
      (r) => r.field === "frailtyListStructure",
    );
    expect(frailty?.watch).toMatch(/Massachusetts v\. Oz/);
    expect(frailty?.watch).toMatch(/2026/);
  });
});

describe("the field manifest: a field cannot be dropped silently", () => {
  /**
   * `state-options.md` is the schema of record. This reads it rather than restating it,
   * so the two cannot drift — the failure mode being guarded against is a field quietly
   * deleted from the code while the document still promises it.
   */
  function declaredFields(): string[] {
    const doc = readFileSync(
      resolve(process.cwd(), "docs/domain/cms-2454-ifc/state-options.md"),
      "utf8",
    );
    const start = doc.indexOf("export interface PolicyProfile {");
    expect(start).toBeGreaterThan(-1);
    const block = doc.slice(start, doc.indexOf("\n}", start));

    return block
      .split("\n")
      .map((line) => /^ {2}([a-zA-Z]+)\??:/.exec(line)?.[1])
      .filter((name): name is string => Boolean(name));
  }

  it("POLICY_PROFILE_FIELDS matches what state-options.md declares, exactly", () => {
    expect([...POLICY_PROFILE_FIELDS].sort()).toEqual(declaredFields().sort());
  });

  it("the manifest matches the runtime object, so the type cannot outrun the value", () => {
    // `keyof PolicyProfile` is erased at runtime, so a field present in the interface and
    // absent from FEDERAL_DEFAULT would only surface as `undefined` at a call site.
    expect(Object.keys(FEDERAL_DEFAULT).sort()).toEqual(
      [...POLICY_PROFILE_FIELDS].sort(),
    );
  });

  it("declares 36 fields", () => {
    /**
     * A bare count, deliberately, as the cheap tripwire. The assertions above check
     * correspondence between three places; this one catches "all three agree and all three
     * are wrong".
     *
     * The arithmetic: `state-options.md` declared **33** before this wave. `incomeThreshold`
     * left as a field and became a function (−1). Three were added to absorb W5's
     * review-period constant — `applicationLookbackBounds`, `verificationMonthsRequired`,
     * `renewalIntervalMonthsSource` (+3). One more was added for gap 15.7,
     * `renewalInitiationLeadDays`, because § 435.559(c) turns on when a renewal is
     * initiated and that lead time is a policy value like any other (+1). 33 − 1 + 3 + 1 = 36.
     *
     * W6a added `educationCreditHourConversion` for 42 CFR 435.552(d)(1)'s credit-hour
     * conversion, with its reader `src/lib/education.ts` (+1). 36 + 1 = 37.
     */
    expect(POLICY_PROFILE_FIELDS).toHaveLength(37);
  });
});

describe("field ownership: unread fields are documented, not silent", () => {
  /**
   * The profile implements every field in the schema, so most have no consumer yet. W5's
   * semantic reviewer fairly flagged two unreachable review-period arms as speculative,
   * and this is the same shape at larger scale.
   *
   * The answer is not to implement fewer fields — W3, W9a and W9b need a stable target —
   * but to make the speculation explicit. Every field names either a live consumer or the
   * wave that will read it.
   */
  it("every field has an owner entry", () => {
    for (const field of POLICY_PROFILE_FIELDS) {
      expect(
        POLICY_FIELD_OWNERS[field],
        `no owner recorded for ${field}`,
      ).toBeDefined();
    }
  });

  it("no owner entry names a field that does not exist", () => {
    // The mirror image, and the one that rots: a field renamed away leaves an orphan.
    for (const field of Object.keys(POLICY_FIELD_OWNERS)) {
      expect(POLICY_PROFILE_FIELDS, `orphaned owner entry: ${field}`).toContain(
        field,
      );
    }
  });

  it("every owner is either a live consumer or a named future wave, and says why", () => {
    const wavePattern = /^W\d[a-b]?$/;
    for (const [field, owner] of Object.entries(POLICY_FIELD_OWNERS)) {
      if (owner.consumer) {
        // A live consumer must name a real path, not a vague area.
        expect(owner.consumer, `${field}: consumer must be a path`).toMatch(
          /^src\//,
        );
      } else {
        expect(owner.wave, `${field}: needs a consumer or a wave`).toMatch(
          wavePattern,
        );
      }
      // `why` is what makes this a record rather than a label. An owner with no reason
      // cannot be checked by the next person to read it.
      expect(
        owner.why.length,
        `${field}: owner needs a reason`,
      ).toBeGreaterThan(20);
    }
  });

  it("every named consumer exists AND actually imports the profile", () => {
    /**
     * Two assertions, and the second is the one that matters.
     *
     * Checking only that the path exists is nearly free to satisfy — every file named
     * here already existed before W2b, and none of them read a policy value. So a record
     * saying "`requiredHours` is consumed by `calculations.ts`" would have passed while
     * `calculations.ts` still had `totalHours >= 80` written into it.
     *
     * Requiring the file to import from `@/lib/policy` is what makes `consumer` mean
     * "reads this from the profile" rather than "is the file where this number belongs".
     * Files inside `src/lib/policy/` are exempt from the import check for the obvious
     * reason.
     */
    for (const [field, owner] of Object.entries(POLICY_FIELD_OWNERS)) {
      if (!owner.consumer) continue;

      const path = resolve(process.cwd(), owner.consumer);
      expect(
        existsSync(path),
        `${field}: ${owner.consumer} does not exist`,
      ).toBe(true);

      if (owner.consumer.startsWith("src/lib/policy/")) continue;

      const source = readFileSync(path, "utf8");
      expect(
        source,
        `${field}: ${owner.consumer} is recorded as a consumer but does not import from @/lib/policy`,
      ).toMatch(/from "@\/lib\/policy"/);
    }
  });

  it("at least the values W2b actually wires up are marked as having consumers", () => {
    // Positive twin. "Every field has an owner" is satisfied by marking all 36 as
    // belonging to some future wave, which would make the profile pure speculation.
    const wired = Object.entries(POLICY_FIELD_OWNERS).filter(
      ([, owner]) => owner.consumer,
    );
    expect(wired.length).toBeGreaterThanOrEqual(8);

    for (const field of [
      "requiredHours",
      "federalMinimumWage",
      "applicationLookbackMonths",
      "applicationLookbackBounds",
      "renewalMonthsRequired",
      "renewalIntervalMonths",
    ] as const) {
      expect(POLICY_FIELD_OWNERS[field].consumer, field).toBeTruthy();
    }
  });
});

describe("the profile reports requirements, never determinations — ADR-0003", () => {
  it("no field is named like a verdict", () => {
    // `engineering-standards.md`: "This constrains types and return values, not only
    // copy. `isCompliant: boolean` is a verdict regardless of what renders it." The same
    // guard W5 put on the review-period module.
    //
    // Note `shortTermHardshipOffered` and `incomeToHoursProxyAvailable` are about what
    // the STATE offers, not about the user, so "offered"/"available" are safe here.
    const banned = /^(is|has|was|meets|qualifies|complies|exempt)/;
    for (const field of POLICY_PROFILE_FIELDS) {
      expect(field, `${field} reads like a determination`).not.toMatch(banned);
    }
  });

  it("carries no per-user state — a policy profile is about the state, not the person", () => {
    // A profile that grew a `userId`, a month, or a logged total would have become a
    // per-user record, and status resolves per month (W3), not per profile.
    for (const field of POLICY_PROFILE_FIELDS) {
      expect(field).not.toMatch(/^(user|month|total|logged|hoursLogged)/i);
    }
  });
});

describe("known duplication, pinned so it cannot be forgotten — owner W9a", () => {
  /**
   * FOUND ON THE W2b REVIEW. `verificationMonthsRequired` and
   * `moreFrequentVerification.monthsRequired` are the same quantity declared twice.
   *
   * This is the defect W2b removed on the renewal side — `renewalPeriodMonths` and
   * `renewalIntervalMonths` were one quantity under two names and were merged — reappearing
   * on the verification side, unnoticed until an independent reviewer read the schema.
   *
   * NOT merged, for a stated reason: `reviewPeriod.ts` reads the top-level field today,
   * `moreFrequentVerification` has no reader at all and belongs to W9a. Collapsing them now
   * would change a live signature to accommodate a field nothing uses.
   *
   * So it is pinned instead. This test does two things: it fails if the two ever hold
   * different values in the same profile, and it fails when W9a gives
   * `moreFrequentVerification` a non-`false` default — which is precisely the moment the
   * reconciliation becomes necessary.
   */
  it("the federal default cannot express the conflict, because the union arm is false", () => {
    expect(FEDERAL_DEFAULT.moreFrequentVerification).toBe(false);
    expect(FEDERAL_DEFAULT.verificationMonthsRequired).toBe(1);
  });

  it("W9a: if a profile elects more-frequent verification, the two counts must agree", () => {
    /**
     * The forcing function. Written as an assertion about any profile rather than about
     * `FEDERAL_DEFAULT`, so it states the invariant W9a has to satisfy rather than merely
     * recording that today's default dodges it.
     */
    const elected: PolicyProfile = {
      ...FEDERAL_DEFAULT,
      moreFrequentVerification: { intervalMonths: 3, monthsRequired: 2 },
      // Deliberately set to match. Leaving it at the floor of 1 is the silent-shortfall bug.
      verificationMonthsRequired: 2,
    };

    expect(
      elected.moreFrequentVerification === false
        ? null
        : elected.moreFrequentVerification.monthsRequired,
      "verificationMonthsRequired must equal moreFrequentVerification.monthsRequired",
    ).toBe(elected.verificationMonthsRequired);
  });
});
