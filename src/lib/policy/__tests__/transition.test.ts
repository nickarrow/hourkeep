/**
 * The two transition rules — gaps 15.6 and 15.7. W2b.
 *
 * Both ask the same shape of question: "does the community engagement requirement reach me
 * yet?" Both turn on the STATE'S IMPLEMENTATION DATE, which is why they were reassigned
 * from W5 to W2b — W5 had nothing to compare against.
 *
 *   15.6 — 42 CFR 435.915. An application filed BEFORE the implementation date is
 *          adjudicated under the rules in force when it was filed, so neither the
 *          applicant's status nor the preceding months are assessed.
 *   15.7 — 42 CFR 435.559(c). A beneficiary enrolled as of the implementation date is
 *          verified at their first renewal INITIATED on or after it. Initiation runs
 *          60-90 days ahead of the due date, so a renewal due early in 2027 was very
 *          likely initiated before the rules took effect.
 *
 * SOURCE TIERS, AND THEY DIFFER.
 *   - § 435.559(c) is RULE TEXT, 91 FR 33478.
 *   - Everything about what "initiated" MEANS, and the 60-90 day figure, is PREAMBLE at
 *     91 FR 33416. So is the whole § 435.915 pending-application discussion.
 *   - The lead time is not even an interpretation of the rule; it is CMS reporting what
 *     state systems staff told them. Weakest tier in this file, and the reason nothing
 *     here returns a bare boolean.
 *
 * WHY NOTHING HERE RETURNS A BOOLEAN. ADR-0003. A yes/no would be a determination, and
 * this one is not ours to make: the answer depends on how long a particular state's renewal
 * process takes, which we do not know and which CMS itself reports only as a range across
 * "many States". A three-valued answer with the uncertainty named is the honest shape.
 */

import { describe, it, expect } from "vitest";

import { FEDERAL_DEFAULT, type PolicyProfile } from "@/lib/policy";
import {
  applicationRuleset,
  renewalInitiationWindow,
  type TransitionAnswer,
} from "@/lib/policy/transition";

/** Nebraska: live 2026-05-01, the earliest real implementation date. */
const nebraska: PolicyProfile = {
  ...FEDERAL_DEFAULT,
  id: "state:NE",
  implementationDate: "2026-05-01",
};

/** A hypothetical state electing a mid-month date under § 435.559(b). */
const midMonth: PolicyProfile = {
  ...FEDERAL_DEFAULT,
  id: "state:XX",
  implementationDate: "2027-01-15",
};

describe("42 CFR 435.915: applications filed before implementation — gap 15.6", () => {
  it("an application filed the month before implementation is adjudicated under the prior rules", () => {
    // CMS's own worked example, preamble at 91 FR 33416: implementation January 1, 2027,
    // application submitted December 15, 2026, determination not made until January 15,
    // 2027. "Since the community engagement requirement was not in place at the time of
    // application, the State must not evaluate whether the individual is an applicable
    // individual and whether the individual demonstrated community engagement in November
    // 2026, the month before the month of application."
    const answer = applicationRuleset("2026-12-15", FEDERAL_DEFAULT);

    expect(answer.ruleset).toBe("prior-rules");
  });

  it("the date the determination is made is irrelevant — only the filing date counts", () => {
    // The trap in CMS's example. A determination on January 15, 2027 is AFTER the
    // implementation date, and it changes nothing. § 435.915 keys the effective date of
    // coverage to submission, and the preamble carries that through to which rules apply.
    // A function taking a determination date would get this backwards for exactly the
    // people the rule protects.
    const answer = applicationRuleset("2026-12-15", FEDERAL_DEFAULT);
    expect(answer.ruleset).toBe("prior-rules");
    // The reasoning must say so, because this is the part a caseworker may need told.
    expect(answer.why).toMatch(/filed|submitt/i);
  });

  it("ADR-0003: the on-or-after answer does not assert the requirement APPLIES", () => {
    /**
     * ADDED AFTER THE W2b REVIEW, which found this file doing the thing the same wave banned
     * twice elsewhere. The copy said:
     *
     *     "so this requirement applies to your application."
     *
     * Filing on or after the implementation date decides WHICH BODY OF RULES governs the
     * determination. It does not decide whether the person is an applicable individual —
     * 42 CFR 435.556 gives the state that threshold question, § 435.554 makes a specified
     * excluded individual not an applicable individual at all, and § 435.556(c) PROHIBITS the
     * state from assessing them. A § 435.553 mandatory exception deems the month demonstrated
     * regardless.
     *
     * None of the 33 banned phrases matched it — the reviewer verified that by running every
     * matcher against the file — because the list targets claims about compliance and
     * exclusion, not claims about applicability. The wave diagnosed exactly this error in
     * `HourTrackingHelp.tsx`, wrote a guard entry for it, and then wrote a fresh instance in a
     * new file. Mutation testing then showed no test caught the reintroduction, which is why
     * this assertion exists rather than only the fix.
     */
    for (const filed of ["2027-03-04", "2027-03"]) {
      const { why } = applicationRuleset(filed, FEDERAL_DEFAULT);

      expect(why, filed).not.toMatch(
        /this requirement applies to your application/i,
      );
      // Positive twins: it says what the date DOES settle, and says what it does not.
      expect(why, filed).toMatch(/the new rules cover your application/i);
      expect(why, filed).toMatch(
        /doesn'?t settle whether this requirement applies/i,
      );
      expect(why, filed).toMatch(/ask your state whether it applies to you/i);
    }
  });

  it("ADR-0003: the prior-rules answer is hedged and still points at gathering", () => {
    /**
     * The mirror image, also from the review. The prior-rules branch was FLAT — "the months
     * before you applied should not be reviewed for this" — while resting on PREAMBLE
     * (91 FR 33415-33416), and it ended without any reason to keep records.
     *
     * That is the dangerous direction for this particular answer. The module's own header says
     * so: "telling someone their state may not assess months it will assess is how a person
     * stops gathering evidence they need." A December-2026 filer reading a flat reassurance
     * gets no signal that § 435.559(c) reaches them at their first renewal initiated on or
     * after implementation.
     */
    for (const filed of ["2026-12-15", "2026-12"]) {
      const { why } = applicationRuleset(filed, FEDERAL_DEFAULT);

      expect(why, filed).toMatch(/usually|probably/i);
      expect(why, filed).not.toMatch(/should not be reviewed/i);
      // The forward-looking half: this application is not the end of the story.
      expect(why, filed).toMatch(/reach you at a later renewal/i);
      expect(why, filed).toMatch(/keep any records you already have/i);
    }
  });

  it("an application filed on the implementation date itself is under the new rules", () => {
    // § 435.559(a): eligibility "for medical assistance furnished on or after January 1,
    // 2027". On-or-after, so the boundary day is inside.
    expect(applicationRuleset("2027-01-01", FEDERAL_DEFAULT).ruleset).toBe(
      "community-engagement",
    );
  });

  it("an application filed after implementation is under the new rules", () => {
    expect(applicationRuleset("2027-03-04", FEDERAL_DEFAULT).ruleset).toBe(
      "community-engagement",
    );
  });

  it("respects a state's earlier elected date — 42 CFR 435.559(b)", () => {
    // Nebraska went live 2026-05-01 and has already disenrolled people. A December 2026
    // filing is under the prior rules federally and under the new rules in Nebraska, which
    // is the whole reason implementationDate is per-state rather than a constant.
    expect(applicationRuleset("2026-06-01", FEDERAL_DEFAULT).ruleset).toBe(
      "prior-rules",
    );
    expect(applicationRuleset("2026-06-01", nebraska).ruleset).toBe(
      "community-engagement",
    );
  });

  describe("month granularity", () => {
    it("accepts a YYYY-MM filing month and answers exactly when the date is a 1st", () => {
      // Every implementation date we have data for is the first of a month — the federal
      // 2027-01-01, Nebraska 2026-05-01, Montana and Arkansas 2026-07-01, Iowa 2026-12-01.
      // For those, a whole filing month falls entirely on one side of the boundary, so a
      // month is as good as a date. `ReviewPeriodAnchor.month` stores YYYY-MM.
      expect(applicationRuleset("2026-12", FEDERAL_DEFAULT).ruleset).toBe(
        "prior-rules",
      );
      expect(applicationRuleset("2027-01", FEDERAL_DEFAULT).ruleset).toBe(
        "community-engagement",
      );
    });

    it("returns uncertain — not a guess — when a filing MONTH straddles a mid-month date", () => {
      /**
       * THE CASE THAT MADE THIS THREE-VALUED.
       *
       * § 435.559(b) lets a state elect any earlier date, and § 435.915 turns on the exact
       * submission date. If a state implemented on January 15, 2027, an application filed
       * "sometime in January 2027" could fall either side, and the two sides produce
       * different assessed months.
       *
       * Guessing here would be invention, and guessing in the user-favourable direction is
       * still invention — it would tell someone their state may not assess months it will.
       * So the month-granular call says it does not know, and names what would settle it.
       */
      const answer = applicationRuleset("2027-01", midMonth);

      expect(answer.ruleset).toBe("uncertain");
      expect(answer.why).toMatch(/exact (date|day)/i);
    });

    it("a day-granular date resolves the straddling case in both directions", () => {
      // Positive twin. "Returns uncertain" is satisfiable by always returning uncertain,
      // which would make the function useless.
      expect(applicationRuleset("2027-01-14", midMonth).ruleset).toBe(
        "prior-rules",
      );
      expect(applicationRuleset("2027-01-15", midMonth).ruleset).toBe(
        "community-engagement",
      );
    });

    it("months outside a straddled month are still answered exactly", () => {
      // Only the straddled month is uncertain. December 2026 is wholly before
      // 2027-01-15 and February 2027 wholly after.
      expect(applicationRuleset("2026-12", midMonth).ruleset).toBe(
        "prior-rules",
      );
      expect(applicationRuleset("2027-02", midMonth).ruleset).toBe(
        "community-engagement",
      );
    });
  });

  it("names the implementation date it compared against, so the answer is checkable", () => {
    const answer = applicationRuleset("2026-12-15", FEDERAL_DEFAULT);
    expect(answer.implementationDate).toBe("2027-01-01");
  });

  it("cites 42 CFR 435.915 and labels the source tier as preamble", () => {
    // engineering-standards.md: "Label the source tier. Regulatory text beats preamble
    // beats secondary source." The pending-application rule is preamble, and a reader
    // acting on it should know that.
    const answer = applicationRuleset("2026-12-15", FEDERAL_DEFAULT);
    expect(answer.citation).toMatch(/435\.915/);
    expect(answer.citation).toMatch(/preamble/i);
    expect(answer.citation).toMatch(/33415|33416/);
    // The explicit disclaimer, mirroring `leadDaysCitation`. Added after mutation testing:
    // deleting it left the word "preamble" elsewhere in the string, so the assertion above
    // kept passing on a citation that no longer disclaimed anything. Both preamble-tier
    // citations in this module now assert the same property in the same words.
    expect(answer.citation).toMatch(/not regulatory text/i);
  });

  it("throws on a malformed filing date rather than guessing a side of the boundary", () => {
    // A silent fallback here would answer a coverage question from garbage input.
    expect(() => applicationRuleset("December 2026", FEDERAL_DEFAULT)).toThrow(
      /YYYY-MM/,
    );
    expect(() => applicationRuleset("2026-13", FEDERAL_DEFAULT)).toThrow();
  });
});

describe("42 CFR 435.559(c): the first renewal initiated on or after implementation — gap 15.7", () => {
  it("a renewal due in January 2027 was probably initiated before the rules took effect", () => {
    /**
     * THE REASSURING RESULT, AND THE DIRECTION IS EASY TO GET BACKWARDS.
     *
     * CMS considered triggering on the eligibility period's END date and rejected it,
     * preamble at 91 FR 33416: "if a State were required to begin verifying compliance for
     * applicable individuals with a renewal due on January 31, 2027, many States would be
     * required to apply the community engagement requirement at renewals initiated as
     * early as November 2026. This would require States to request information about
     * community engagement activity prior to the State's implementation date."
     *
     * So initiation runs AHEAD of the due date, which pushes the first assessment LATER,
     * not earlier. A renewal due January 2027 was initiated in October or November 2026 —
     * before January 1, 2027 — so it is not the first renewal initiated on or after the
     * implementation date, and community engagement is not verified at it.
     */
    const window = renewalInitiationWindow("2027-01", FEDERAL_DEFAULT);

    expect(window.earliestInitiationMonth).toBe("2026-10");
    expect(window.latestInitiationMonth).toBe("2026-11");
    expect(window.relationToImplementation).toBe("before");
  });

  it("February 2027 too, which is why the steering doc says mid-2027 for these users", () => {
    // Due 2027-02 minus 90 days is 2026-11; minus 60 days is 2026-12. Both precede
    // 2027-01-01, so this renewal does not trigger verification either.
    const window = renewalInitiationWindow("2027-02", FEDERAL_DEFAULT);

    expect(window.earliestInitiationMonth).toBe("2026-11");
    expect(window.latestInitiationMonth).toBe("2026-12");
    expect(window.relationToImplementation).toBe("before");
  });

  it("March 2027 is still before, which is further than it looks", () => {
    // 2027-03-01 minus 90 days is 2026-12-01; minus 60 days is 2026-12-31. Both still
    // precede 2027-01-01. Computed, not assumed — the first version of this test asserted
    // the window crossed into January and it does not.
    const window = renewalInitiationWindow("2027-03", FEDERAL_DEFAULT);

    expect(window.earliestInitiationMonth).toBe("2026-12");
    expect(window.latestInitiationMonth).toBe("2026-12");
    expect(window.relationToImplementation).toBe("before");
  });

  it("no month straddles under the federal default, and that is arithmetic not design", () => {
    /**
     * WORTH PINNING, because it is load-bearing and accidental.
     *
     * A 60-to-90-day window is 30 days wide, and against a first-of-month due date it
     * never lands either side of a first-of-month implementation date: due 2027-03 gives
     * 2026-12-01 to 2026-12-31, and due 2027-04 gives 2027-01-01 to 2027-01-31. The gap
     * falls exactly on the boundary.
     *
     * So under `FEDERAL_DEFAULT` every renewal is cleanly before or cleanly on-or-after,
     * and the reassuring answer runs through March 2027 — one month further than the
     * steering doc's "January or February". Change either end of the lead range and this
     * stops holding, which is exactly why the `straddles` arm exists.
     */
    for (const month of [
      "2026-12",
      "2027-01",
      "2027-02",
      "2027-03",
      "2027-04",
      "2027-05",
      "2027-06",
    ]) {
      expect(
        renewalInitiationWindow(month, FEDERAL_DEFAULT)
          .relationToImplementation,
        `${month} should not straddle under the federal default`,
      ).not.toBe("straddles");
    }
  });

  it("reports straddles when a wider lead range does cross the implementation date", () => {
    /**
     * The genuinely uncertain case, and the one the app must not resolve.
     *
     * Reachable only with a lead range wider than CMS's reported 60-90 — which is a real
     * possibility, since CMS describes "many States" rather than all of them and no state
     * has published its own figure. A 60-to-120-day process puts a renewal due April 2027
     * either side of January 1, 2027 depending on how long that state actually takes.
     *
     * Tested explicitly rather than left as an unreachable arm: W5 shipped two
     * review-period arms with no caller and its semantic reviewer was right to flag them.
     */
    const slow: PolicyProfile = {
      ...FEDERAL_DEFAULT,
      renewalInitiationLeadDays: { min: 60, max: 120 },
    };
    const window = renewalInitiationWindow("2027-04", slow);

    expect(window.earliestInitiationMonth).toBe("2026-12");
    expect(window.latestInitiationMonth).toBe("2027-01");
    expect(window.relationToImplementation).toBe("straddles");
  });

  it("reports on-or-after once the whole window clears the implementation date", () => {
    // Positive twin for the "before" cases above. A function that always returned
    // "before" would be maximally reassuring and useless.
    expect(
      renewalInitiationWindow("2027-06", FEDERAL_DEFAULT)
        .relationToImplementation,
    ).toBe("on-or-after");
    // April 2027 is the first month that flips, and the boundary is exact: 2027-04-01
    // minus 90 days is 2027-01-01, the implementation date itself. "On or after" includes
    // the day, per § 435.559(c)'s own wording.
    expect(
      renewalInitiationWindow("2027-04", FEDERAL_DEFAULT)
        .relationToImplementation,
    ).toBe("on-or-after");
  });

  it("respects an earlier state implementation date", () => {
    // Nebraska, live 2026-05-01. A renewal due January 2027 is initiated well after that,
    // so a Nebraskan gets the opposite answer to the federal default for the same month.
    expect(
      renewalInitiationWindow("2027-01", FEDERAL_DEFAULT)
        .relationToImplementation,
    ).toBe("before");
    expect(
      renewalInitiationWindow("2027-01", nebraska).relationToImplementation,
    ).toBe("on-or-after");
  });

  it("reads the lead time from the profile, not from a literal", () => {
    // ADR-0001. The 60-90 day figure is per-state — CMS says "many States have a renewal
    // process that takes between 60 to 90 days", which is a range across states, not a
    // rule. A state with a 30-day process changes every answer above.
    const fast: PolicyProfile = {
      ...FEDERAL_DEFAULT,
      renewalInitiationLeadDays: { min: 30, max: 30 },
    };
    const window = renewalInitiationWindow("2027-02", fast);

    // 2027-02 minus 30 days lands in January 2027, on or after implementation.
    expect(window.relationToImplementation).toBe("on-or-after");
  });

  it("carries the lead time it used, so the hedge can state it", () => {
    const window = renewalInitiationWindow("2027-01", FEDERAL_DEFAULT);
    expect(window.leadDays).toEqual({ min: 60, max: 90 });
  });

  it("cites the rule text for the trigger and the preamble for the lead time, separately", () => {
    // The two halves have different provenance and must not be presented as equally solid.
    // § 435.559(c) is rule text at 91 FR 33478; the 60-90 days is CMS reporting what state
    // systems staff told them, at 91 FR 33416.
    const window = renewalInitiationWindow("2027-01", FEDERAL_DEFAULT);

    expect(window.triggerCitation).toMatch(/435\.559\(c\)/);
    expect(window.triggerCitation).toMatch(/33478/);
    /**
     * The tier LABEL, not just the page. Added after mutation testing found this missing:
     * deleting "RULE TEXT:" from the trigger citation changed no test result, which meant
     * the one property that makes two citations worth having — that they are different
     * tiers of authority — was unasserted.
     *
     * engineering-standards.md: "Label the source tier. Regulatory text beats preamble
     * beats secondary source."
     */
    expect(window.triggerCitation).toMatch(/RULE TEXT/);

    expect(window.leadDaysCitation).toMatch(/preamble/i);
    expect(window.leadDaysCitation).toMatch(/33416/);
    // And the lead-time citation must say it is not even an interpretation of the rule,
    // because that is what makes it the weakest thing in the profile.
    expect(window.leadDaysCitation).toMatch(/not regulatory text/i);
  });

  it("the first-of-month anchor biases toward the reassuring answer — pinned, not hidden", async () => {
    /**
     * FOUND BY THE W2b REVIEW, computed independently by two of four reviewers.
     *
     * The function anchors on the 1st of the due month because `YYYY-MM` is all the app
     * stores. That puts initiation as early as possible, which makes `latest < implementation`
     * true more often, which returns `"before"` — the REASSURING branch — more often than a
     * mid- or late-month due date warrants. The module's comment used to call the 1st "the
     * conservative end", which is backwards.
     *
     * This test exists because the caveat is otherwise only prose. It pins the divergence, so
     * nobody can "fix" the comment by deleting it, and so a later wave adding a day-granular
     * due date gets a failing test telling it exactly what changed.
     *
     * The day-granular arithmetic is replicated rather than exported: the point is to compare
     * what the function returns against what a real due date would have given.
     */
    const { addDays, isBefore, parseISO } = await import("date-fns");
    const impl = parseISO(FEDERAL_DEFAULT.implementationDate);
    const { min, max } = FEDERAL_DEFAULT.renewalInitiationLeadDays;

    const relationFor = (dueDate: string) => {
      const due = parseISO(dueDate);
      return isBefore(addDays(due, -min), impl)
        ? "before"
        : isBefore(addDays(due, -max), impl)
          ? "straddles"
          : "on-or-after";
    };

    // What the function says for March 2027, anchored on the 1st.
    expect(
      renewalInitiationWindow("2027-03", FEDERAL_DEFAULT)
        .relationToImplementation,
    ).toBe("before");

    // What a real due date later in the same month would give.
    expect(relationFor("2027-03-01")).toBe("before");
    expect(relationFor("2027-03-15")).toBe("straddles");
    expect(relationFor("2027-03-31")).toBe("straddles");
  });

  it("throws on a malformed due month", () => {
    expect(() => renewalInitiationWindow("2027", FEDERAL_DEFAULT)).toThrow(
      /YYYY-MM/,
    );
  });
});

describe("both answers report, never determine — ADR-0003", () => {
  it("no returned field is named like a verdict", () => {
    const application = applicationRuleset("2026-12-15", FEDERAL_DEFAULT);
    const renewal = renewalInitiationWindow("2027-01", FEDERAL_DEFAULT);
    const banned = /^(is|will|must|exempt|assessed|subject)/;

    for (const key of [...Object.keys(application), ...Object.keys(renewal)]) {
      expect(key, `${key} reads like a determination`).not.toMatch(banned);
    }
  });

  it("the application answer is a three-valued ruleset, not a boolean", () => {
    // A boolean cannot express "we do not know", and this question genuinely has that
    // answer whenever a state elected a mid-month date.
    const answer: TransitionAnswer = applicationRuleset("2027-01", midMonth);
    expect(typeof answer.ruleset).toBe("string");
    expect(["prior-rules", "community-engagement", "uncertain"]).toContain(
      answer.ruleset,
    );
  });

  it("every answer carries a next action, because a hedge without one is worse than a verdict", () => {
    // compliance-copy-standards.md: "If you can't name the next action, the copy isn't
    // finished." Both of these route to the agency, because the agency holds the fact.
    for (const text of [
      applicationRuleset("2027-01", midMonth).why,
      applicationRuleset("2026-12-15", FEDERAL_DEFAULT).why,
      renewalInitiationWindow("2027-01", FEDERAL_DEFAULT).why,
      renewalInitiationWindow("2027-03", FEDERAL_DEFAULT).why,
    ]) {
      expect(text).toMatch(/\bask\b/i);
    }
  });

  it("every absolute claim in the reassuring answer carries a hedge in the same sentence", () => {
    /**
     * The 'before' case is good news, and the temptation is to firm it up into "you will
     * not be assessed". We do not know that — the lead time is a state operational fact
     * CMS reports only as a range, so a user who stopped gathering evidence on the strength
     * of it would be worse off than one who gathered it unnecessarily.
     *
     * THE FIRST VERSION OF THIS TEST WAS A BLANKET `not.toMatch(/won't be/)`, which is the
     * guard-over-reach failure `wave-5-month-scoping.md` records: it fired on "this
     * requirement probably won't be checked", which is exactly the right wording. Banning
     * the words instead of the unhedged claim would have pushed the copy toward something
     * vaguer and less useful.
     *
     * So the property is per-sentence: a negative prediction is fine, an UNHEDGED one is
     * not.
     */
    const hedges = /\b(likely|probably|may|might|usually|if so|could)\b/i;
    const absolutes = /\b(will not|won't|will be|cannot|isn't|is not)\b/i;

    for (const month of ["2027-01", "2027-03", "2027-06"]) {
      const why = renewalInitiationWindow(month, FEDERAL_DEFAULT).why;
      // The answer as a whole must hedge somewhere.
      expect(why, month).toMatch(hedges);

      for (const sentence of why.split(/(?<=[.?!])\s+/)) {
        if (!absolutes.test(sentence)) continue;
        expect(
          sentence,
          `${month}: unhedged prediction — "${sentence.trim()}"`,
        ).toMatch(hedges);
      }
    }
  });
});
