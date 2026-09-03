/**
 * No-verdict guard, part 1 of 3 — rendered output.
 *
 * Parts 2 and 3 assert on content data and on source text. This part asserts on
 * what a user actually sees, after JSX entities resolve and after conditional
 * branches pick a string. `You&apos;re Exempt` is three tokens in source and one
 * phrase on screen; only a render catches the screen form.
 *
 * SCOPE: props-driven components. The Dexie-backed pages
 * (app/settings/page.tsx, app/how-to-hourkeep/results/page.tsx) are covered by
 * part 3's source scan instead — rendering them needs fake-indexeddb, a router
 * mock, and a theme provider, and that fixture is the fragile kind of test that
 * gets disabled rather than fixed. The source scan reaches them for free.
 *
 * BOTH BRANCHES, ALWAYS. Every conditional here is exercised in both states,
 * because half of W2a's verdicts were in the branch nobody looked at —
 * app/export/page.tsx:179 and ComplianceModeSelector.tsx:132 among them.
 */

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { AssessmentBadge } from "@/components/assessment/AssessmentBadge";
import { ExemptionHistory } from "@/components/exemptions/ExemptionHistory";
import { IntroductionScreen } from "@/components/assessment/IntroductionScreen";
import { ComplianceModeSelector } from "@/components/compliance/ComplianceModeSelector";
import { RequirementFacts } from "@/components/help/RequirementFacts";
import { Dashboard } from "@/components/Dashboard";
import { CompletionMessage } from "@/components/tracking/CompletionMessage";
import { MonthNavigator } from "@/components/tracking/MonthNavigator";
import { ReviewPeriodPanel } from "@/components/tracking/ReviewPeriodPanel";
import { HourTrackingHelpIcon } from "@/components/help/HourTrackingHelp";
import { IncomeStatusIndicator } from "@/components/income/IncomeStatusIndicator";
import { SeasonalWorkerView } from "@/components/income/SeasonalWorkerView";
import {
  applicationReviewPeriod,
  renewalReviewPeriodEndingAt,
} from "@/lib/reviewPeriod";
import { FEDERAL_DEFAULT, incomeThreshold } from "@/lib/policy";

import { requirementFacts } from "@/content/helpText";
import type { AssessmentResult } from "@/types/assessment";
import type { ExemptionHistory as ExemptionHistoryType } from "@/types/exemptions";
import type { MonthlyIncomeSummary } from "@/types/income";

import {
  VERDICT_PHRASES,
  normaliseForGuard,
  phraseMatcher,
  formatHits,
  type VerdictHit,
} from "./support/verdictPhrases";

/**
 * Flatten the rendered DOM into text, separating every text node.
 *
 * NOT `document.body.textContent`. That concatenates adjacent elements with no
 * separator, so a heading reading "You're Exempt" followed by a sibling starting
 * with "R" becomes `You're ExemptR` — and `\byou're exempt\b` does not match,
 * because "R" is a word character and kills the trailing word boundary.
 *
 * This was a real hole, found by reintroducing the banned string and observing
 * that only the source scan went red. The render guard silently passed. Which is
 * the entire reason "prove the guard red before believing it" is an acceptance
 * criterion and not a nicety.
 */
function renderedText(): string {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const parts: string[] = [];

  let node = walker.nextNode();
  while (node) {
    const value = node.nodeValue?.trim();
    if (value) parts.push(value);
    node = walker.nextNode();
  }

  return normaliseForGuard(parts.join(" \n "));
}

/** Collect every banned phrase from the rendered DOM. */
function verdictsInDom(label: string): VerdictHit[] {
  const text = renderedText();
  const hits: VerdictHit[] = [];

  for (const entry of VERDICT_PHRASES) {
    if (phraseMatcher(entry).test(text)) {
      hits.push({
        phrase: entry.phrase,
        why: entry.why,
        location: label,
        excerpt: text.trim().slice(0, 200),
      });
    }
  }

  return hits;
}

function expectNoVerdict(label: string) {
  const hits = verdictsInDom(label);
  expect(hits, formatHits(hits)).toEqual([]);
}

const NOW = new Date("2026-08-17T12:00:00Z");

function assessmentResult(isExempt: boolean): AssessmentResult {
  return {
    userId: "user-1",
    completedAt: NOW,
    version: 1,
    responses: { exemption: {} },
    recommendation: {
      primaryMethod: isExempt ? "exemption" : "hour-tracking",
      reasoning: isExempt
        ? "Your answers point at a category that may be set aside. Ask your state to check."
        : "Recorded: 46 hours this month. Threshold: 80 hours. Difference: 34.",
      alternativeMethods: [],
      complianceStatus: isExempt ? "compliant" : "needs-increase",
      estimatedEffort: "low",
    },
  } as AssessmentResult;
}

function historyEntry(isExempt: boolean): ExemptionHistoryType {
  return {
    id: isExempt ? 1 : 2,
    userId: "user-1",
    screeningDate: NOW,
    isExempt,
  };
}

const noop = () => {};

describe("ADR-0003 no-verdict guard: rendered output", () => {
  describe("AssessmentBadge", () => {
    it("apparently-excluded branch renders no verdict", () => {
      render(
        <AssessmentBadge
          result={assessmentResult(true)}
          onTakeAssessment={noop}
          onViewDetails={noop}
          onRetakeAssessment={noop}
        />,
      );
      expectNoVerdict("AssessmentBadge (apparently excluded)");
    });

    it("not-apparently-excluded branch renders no verdict", () => {
      render(
        <AssessmentBadge
          result={assessmentResult(false)}
          onTakeAssessment={noop}
          onViewDetails={noop}
          onRetakeAssessment={noop}
        />,
      );
      expectNoVerdict("AssessmentBadge (not apparently excluded)");
    });

    it("no-result branch renders no verdict", () => {
      render(
        <AssessmentBadge
          result={null}
          onTakeAssessment={noop}
          onViewDetails={noop}
          onRetakeAssessment={noop}
        />,
      );
      expectNoVerdict("AssessmentBadge (no result)");
    });

    it("still offers a way back to screening, so nothing is asserted by hiding", () => {
      // component-standards.md: suppressing UI because a user looks excluded
      // asserts a status more strongly than a sentence does. There must always be
      // a visible route back.
      render(
        <AssessmentBadge
          result={assessmentResult(true)}
          onTakeAssessment={noop}
          onViewDetails={noop}
          onRetakeAssessment={noop}
        />,
      );
      expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
    });
  });

  describe("ExemptionHistory", () => {
    // This surface was MISSING from wave-2 § 2.5's table, which listed the dead
    // components/assessment/AssessmentHistory.tsx instead. It is live, rendered
    // from app/settings/page.tsx. wave-2a finding [F1].
    it("renders no verdict for either outcome", () => {
      render(
        <ExemptionHistory
          history={[historyEntry(true), historyEntry(false)]}
        />,
      );
      expectNoVerdict("ExemptionHistory (both outcomes)");
    });

    it("renders no verdict when empty", () => {
      render(<ExemptionHistory history={[]} />);
      expectNoVerdict("ExemptionHistory (empty)");
    });
  });

  describe("IntroductionScreen", () => {
    it("assessment variant renders no verdict", () => {
      render(
        <IntroductionScreen
          onGetStarted={noop}
          onSkip={noop}
          variant="assessment"
        />,
      );
      expectNoVerdict("IntroductionScreen (assessment)");
    });

    it("onboarding variant renders no verdict", () => {
      render(
        <IntroductionScreen
          onGetStarted={noop}
          onSkip={noop}
          variant="onboarding"
        />,
      );
      expectNoVerdict("IntroductionScreen (onboarding)");
    });
  });

  describe("ComplianceModeSelector", () => {
    it("hours mode renders no verdict", () => {
      render(
        <ComplianceModeSelector
          currentMode="hours"
          currentMonth="2026-08"
          onModeChange={noop}
        />,
      );
      expectNoVerdict("ComplianceModeSelector (hours)");
    });

    it("income mode renders no verdict", () => {
      render(
        <ComplianceModeSelector
          currentMode="income"
          currentMonth="2026-08"
          onModeChange={noop}
        />,
      );
      expectNoVerdict("ComplianceModeSelector (income)");
    });
  });

  describe("RequirementFacts", () => {
    it("renders no verdict", () => {
      render(<RequirementFacts />);
      expectNoVerdict("RequirementFacts");
    });

    it("42 CFR 435.559(c), 435.557(a)-(b): actually renders the reassuring facts", () => {
      // W2a § 2.3b's criterion is that this content is RENDERED, not merely
      // exported. An exported constant nobody displays fixes nothing.
      render(<RequirementFacts />);
      expect(
        screen.getByText(/probably isn't starting in January/i),
      ).toBeTruthy();
      expect(
        screen.getByText(/check its own records before it asks you/i),
      ).toBeTruthy();
      expect(screen.getByText(/be careful about saying/i)).toBeTruthy();
    });

    it("pairs every fact with a visible next action", () => {
      // Derived from the data, not hardcoded: an earlier version asserted "3" and
      // broke the moment a fourth fact was added, which is a test measuring the
      // wrong thing.
      render(<RequirementFacts />);
      expect(screen.getAllByText(/What to do:/i).length).toBe(
        requirementFacts.length,
      );
    });

    it("42 CFR 435.550: renders the scope and timing facts", () => {
      // Gaps 11.1-11.5. Georgia, Tennessee and Wisconsin are IN scope — this
      // project's own steering docs had two of them wrong and omitted the third.
      render(<RequirementFacts />);
      expect(
        screen.getByText(/43 states and the District of Columbia/i),
      ).toBeTruthy();
      expect(
        screen.getByText(/Georgia, Tennessee, and Wisconsin/i),
      ).toBeTruthy();
      expect(screen.getByText(/Puerto Rico/i)).toBeTruthy();
    });

    it("gap 11.4: renders that the adult group includes parents", () => {
      render(<RequirementFacts />);
      expect(screen.getByText(/parents are in this group too/i)).toBeTruthy();
    });

    it("renders the two dates the app never mentioned", () => {
      render(<RequirementFacts />);
      expect(screen.getByText("January 1, 2028")).toBeTruthy();
      expect(screen.getByText("December 31, 2028")).toBeTruthy();
    });
  });
});

describe("guard-the-guard: the render assertion can actually fail", () => {
  it("detects a banned phrase in rendered output, entities resolved", () => {
    // A guard never observed failing is not a guard. This renders the exact string
    // W2a removed from AssessmentBadge.tsx:154 and proves the DOM path catches it.
    render(
      <div>
        <span>You&apos;re Exempt</span>
      </div>,
    );
    const hits = verdictsInDom("fixture");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.map((h) => h.phrase)).toContain("you're exempt");
  });

  it("detects a verdict with no pronoun", () => {
    render(<div>Must Track Hours</div>);
    expect(verdictsInDom("fixture").map((h) => h.phrase)).toContain(
      "must track hours",
    );
  });

  it("does not fire on ordinary copy", () => {
    render(
      <div>
        Logged: 46 hours. Threshold: 80 hours. Difference: 34. Your state
        decides, and it must check its own records first.
      </div>,
    );
    expect(verdictsInDom("fixture")).toEqual([]);
  });
});

/**
 * W5's tracking surfaces.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * ADDED AFTER THE W5 WAVE REVIEW, and this block is the structural fix rather than
 * the cosmetic one.
 *
 * W5 rewrote or created five month-scoped components and put NONE of them in this
 * file. Two verdicts got through as a direct result:
 *
 *   1. `Dashboard` rendered "Compliant" in green beside a tick, over "You've met the
 *      80-hour requirement!". Found by opening the built app in a browser. The
 *      source scan missed it because the banned list matched `COMPLIANT`
 *      case-sensitively to spare the `isCompliant` identifier, which also spared
 *      title case.
 *   2. `CompletionMessage` rendered "Your record covers every month" — a quantifier
 *      over the review period that nothing computed, and false under the federal
 *      default, where a renewal period is six months long and requires one. Found by
 *      an independent reviewer reading the render gate.
 *
 * The second one is the instructive failure. Its rendered branch was unreachable in
 * EVERY suite: the e2e fixture sets `monthsRequired: 2` with one qualifying month, so
 * the component returned `null` there, and the source scan cannot see a phrase it does
 * not have. A component whose only output nobody renders is a component whose copy
 * nobody checks.
 *
 * So the rule these tests encode: every branch that renders prose gets rendered here,
 * including the celebratory one. The threshold-met branch is where verdicts live,
 * because that is where the temptation is.
 * ─────────────────────────────────────────────────────────────────────────────────
 */
describe("ADR-0003 no-verdict guard: W5 month-scoped surfaces", () => {
  const summary = (totalHours: number) => ({
    month: "2026-07",
    totalHours,
    workHours: totalHours,
    volunteerHours: 0,
    educationHours: 0,
    isCompliant: totalHours >= 80,
    hoursNeeded: Math.max(80 - totalHours, 0),
  });

  describe("Dashboard", () => {
    it("renders no verdict when the month is OVER the threshold", () => {
      // The branch that used to say "Compliant".
      render(<Dashboard summary={summary(84)} threshold={80} />);
      expectNoVerdict("Dashboard (over threshold)");
    });

    it("renders no verdict when the month is under the threshold", () => {
      render(<Dashboard summary={summary(46)} threshold={80} />);
      expectNoVerdict("Dashboard (under threshold)");
    });

    it("renders no verdict at exactly the threshold", () => {
      render(<Dashboard summary={summary(80)} threshold={80} />);
      expectNoVerdict("Dashboard (exactly at threshold)");
    });
  });

  describe("CompletionMessage", () => {
    it("renders no verdict on the branch that actually renders", () => {
      // Reachable only when `monthsAtOrOverThreshold >= monthsRequired`, which is
      // why no other suite had ever rendered it.
      render(
        <CompletionMessage
          monthsAtOrOverThreshold={1}
          monthsRequired={1}
          monthsInPeriod={6}
          monthlyThreshold={80}
          reviewPeriodKind="renewal"
          onExport={noop}
          onContinueTracking={noop}
        />,
      );
      expectNoVerdict("CompletionMessage (renewal, 1 of 6)");
    });

    it("does not claim completeness it has not computed", () => {
      // The specific defect: one qualifying month out of a six-month period must not
      // read as though the record covers the period. Asserted on the rendered text
      // rather than on the phrase list, because "covers every month" is a bespoke
      // overstatement that no generic banned phrase would catch.
      render(
        <CompletionMessage
          monthsAtOrOverThreshold={1}
          monthsRequired={1}
          monthsInPeriod={6}
          monthlyThreshold={80}
          reviewPeriodKind="renewal"
          onExport={noop}
          onContinueTracking={noop}
        />,
      );

      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(/every month/i);
      expect(text).not.toMatch(/\ball (of )?(the )?months\b/i);
      // And the honest form is present: both numbers, with the denominator named.
      expect(text).toMatch(/1 of 6 months/);
    });

    it("renders no verdict for an application period", () => {
      render(
        <CompletionMessage
          monthsAtOrOverThreshold={3}
          monthsRequired={3}
          monthsInPeriod={3}
          monthlyThreshold={80}
          reviewPeriodKind="application"
          onExport={noop}
          onContinueTracking={noop}
        />,
      );
      expectNoVerdict("CompletionMessage (application, 3 of 3)");
    });
  });

  describe("MonthNavigator", () => {
    it.each([
      ["past", "2026-06"],
      ["current", "2026-07"],
      ["future", "2026-08"],
    ])("renders no verdict for a %s month", (label, month) => {
      render(
        <MonthNavigator
          month={month}
          today="2026-07"
          onMonthChange={noop}
          reviewPeriodMonths={["2026-06", "2026-07"]}
        />,
      );
      expectNoVerdict(`MonthNavigator (${label})`);
    });
  });

  describe("ReviewPeriodPanel", () => {
    const hours = [
      { month: "2026-05", totalHours: 0 },
      { month: "2026-06", totalHours: 84 },
    ];

    it("renders no verdict when no anchor is known", () => {
      render(
        <ReviewPeriodPanel
          monthHours={[]}
          monthlyThreshold={80}
          pathway="hours"
          selectedMonth="2026-07"
          todayMonth="2026-07"
          onSelectMonth={noop}
          onAnchorChange={noop}
          onClearAnchor={noop}
        />,
      );
      expectNoVerdict("ReviewPeriodPanel (no anchor)");
    });

    it("renders no verdict for an application period", () => {
      render(
        <ReviewPeriodPanel
          reviewPeriod={applicationReviewPeriod("2026-07", {
            ...FEDERAL_DEFAULT,
            applicationLookbackMonths: 2,
          })}
          monthHours={hours}
          monthlyThreshold={80}
          pathway="hours"
          selectedMonth="2026-06"
          todayMonth="2026-07"
          onSelectMonth={noop}
          onAnchorChange={noop}
          onClearAnchor={noop}
        />,
      );
      expectNoVerdict("ReviewPeriodPanel (application)");
    });

    it("renders no verdict for a renewal period", () => {
      render(
        <ReviewPeriodPanel
          reviewPeriod={renewalReviewPeriodEndingAt("2026-06")}
          monthHours={hours}
          monthlyThreshold={80}
          pathway="hours"
          selectedMonth="2026-06"
          todayMonth="2026-07"
          onSelectMonth={noop}
          onAnchorChange={noop}
          onClearAnchor={noop}
        />,
      );
      expectNoVerdict("ReviewPeriodPanel (renewal)");
    });

    it("does not report an hours shortfall to someone tracking income", () => {
      // The most harmful thing the W5 review found. This panel sits above the
      // hours/income fork, so it rendered for everyone, and its rows are built from
      // logged activities — so an income-pathway user saw "Difference: 80" for every
      // month of their review period.
      //
      // ADR-0003 § Context names this harm in as many words: "HourKeep, seeing only
      // their own pay stubs, would tell them they're failing and send them looking
      // for 80 hours of volunteering." 42 CFR 435.552(a) makes all seven pathways
      // equally available and § 435.552(e)(2) lets income and hours combine.
      render(
        <ReviewPeriodPanel
          reviewPeriod={renewalReviewPeriodEndingAt("2026-06")}
          monthHours={[
            { month: "2026-05", totalHours: 0 },
            { month: "2026-06", totalHours: 0 },
          ]}
          monthlyThreshold={80}
          pathway="income"
          selectedMonth="2026-06"
          todayMonth="2026-07"
          onSelectMonth={noop}
          onAnchorChange={noop}
          onClearAnchor={noop}
        />,
      );

      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(/Difference:/i);
      expect(text).not.toMatch(/at or over 80 hours/i);
      // And it says WHY the hours figure is not a target — 42 CFR 435.552(a)'s seven
      // pathways and § 435.552(e)(2)'s combination rule.
      //
      // Asserted on the explanation's own distinctive wording, not on the phrase
      // "tracking income". Mutation testing caught that: deleting the whole
      // explanation left this test green, because the per-month rows also contain the
      // words "tracking income". A test that can be satisfied by two different pieces
      // of copy is not pinning either of them.
      expect(text).toMatch(/one of several ways to meet this/i);
      expect(text).toMatch(/aren't a target you're missing/i);
      expectNoVerdict("ReviewPeriodPanel (income pathway)");
    });

    it("still reports the hours comparison to someone tracking hours", () => {
      // The positive twin. Suppressing the shortfall for everyone would satisfy the
      // test above by deletion, and the hours pathway genuinely needs the difference.
      render(
        <ReviewPeriodPanel
          reviewPeriod={renewalReviewPeriodEndingAt("2026-06")}
          monthHours={[{ month: "2026-06", totalHours: 46 }]}
          monthlyThreshold={80}
          pathway="hours"
          selectedMonth="2026-06"
          todayMonth="2026-07"
          onSelectMonth={noop}
          onAnchorChange={noop}
          onClearAnchor={noop}
        />,
      );

      const text = document.body.textContent ?? "";
      expect(text).toMatch(/Logged: 46 hours/);
      expect(text).toMatch(/Difference: 34/);
    });

    it("seeds the edit form from the stored anchor, so a renewal cannot become an application", () => {
      // A data-correctness bug review found: the draft state was initialised once at
      // mount and never synced, so a renewal user pressing "Change these dates" saw
      // "I'm applying" preselected with today's month — and saving silently converted
      // their anchor kind, which computes a completely different set of months under
      // 42 CFR 435.556(a)(1) versus (a)(2)(i).
      render(
        <ReviewPeriodPanel
          reviewPeriod={renewalReviewPeriodEndingAt("2026-06")}
          monthHours={hours}
          monthlyThreshold={80}
          pathway="hours"
          selectedMonth="2026-06"
          todayMonth="2026-09"
          onSelectMonth={noop}
          onAnchorChange={noop}
          onClearAnchor={noop}
        />,
      );

      // `fireEvent`, not a native `.click()`: a bare DOM click does not flush the
      // React state update, so the form never opened and the assertion below failed
      // looking for a control that had not rendered yet.
      fireEvent.click(
        screen.getByRole("button", { name: /change these dates/i }),
      );

      // The renewal toggle is the selected one, not "I'm applying".
      const renewalToggle = screen.getByRole("button", {
        name: /i'm renewing/i,
      });
      expect(renewalToggle).toHaveAttribute("aria-pressed", "true");

      // And the month is the stored renewal-due month, not today.
      const monthInput = document.querySelector<HTMLInputElement>(
        'input[type="month"]',
      );
      expect(monthInput?.value).toBe("2026-06");
    });

    it("says so when the app disagrees with the user's notice", () => {
      // § 435.556(a)(1) caps an application at 3 months, so a notice naming more
      // means a typo or a renewal. Silently showing the shorter period under-scoped
      // the months in the direction that costs coverage.
      render(
        <ReviewPeriodPanel
          reviewPeriod={applicationReviewPeriod("2026-07", {
            ...FEDERAL_DEFAULT,
            applicationLookbackMonths: 3,
          })}
          monthHours={hours}
          monthlyThreshold={80}
          pathway="hours"
          noticeExceedsApplicationBounds
          selectedMonth="2026-06"
          todayMonth="2026-07"
          onSelectMonth={noop}
          onAnchorChange={noop}
          onClearAnchor={noop}
        />,
      );

      const text = document.body.textContent ?? "";
      expect(text).toMatch(/doesn't match your letter/i);
      expect(text).toMatch(/Keep logging the extra months/i);
      expectNoVerdict("ReviewPeriodPanel (notice mismatch)");
    });
  });
});

/**
 * Components W2b added to this guard, and the reason they were missing.
 *
 * W5's most valuable review finding was STRUCTURAL: it created five month-scoped components
 * and put none of them in this file, which is why two verdicts got through code that had
 * already passed 509 tests. `wave-2b-policy-profile.md` § 2.1.4 says to expect the same shape
 * here, and it was there.
 *
 * `HourTrackingHelpIcon` — LIVE on the primary tracking surface via `Dashboard.tsx:88`, and
 * absent from this guard, from `wave-2` § 2.5's site table, and from W2a's handoff table.
 * Its copy said "To meet Medicaid work requirements, you need to complete 80 hours per
 * month", which asserts the requirement APPLIES — and under 42 CFR 435.554 a specified
 * excluded individual is not an applicable individual at all, with § 435.556(c) prohibiting
 * the state from assessing them.
 *
 * WHY IT ESCAPED, precisely: its content renders inside a `HelpTooltip`, which mounts nothing
 * until the icon is clicked. A component whose output nobody renders is a component whose
 * copy nobody checks — W5 wrote that about `CompletionMessage`, and it was true twice.
 *
 * `IncomeStatusIndicator` — W5 FIXED a `Compliant` verdict here and did not add it to the
 * guard, so the fix was unprotected. Both of its branches are exercised below.
 */
describe("components W2b added to the render guard", () => {
  function incomeSummary(totalIncome: number): MonthlyIncomeSummary {
    // 42 CFR 435.552(a)(6): the threshold is the FLSA wage x the hours figure.
    const threshold = incomeThreshold(FEDERAL_DEFAULT);
    return {
      month: "2026-07",
      totalIncome,
      entryCount: 1,
      isCompliant: totalIncome >= threshold,
      amountNeeded: Math.max(threshold - totalIncome, 0),
      isSeasonalWorker: false,
    };
  }

  describe("HourTrackingHelpIcon — the tooltip content, which needs a click to exist", () => {
    it("renders no verdict once opened", () => {
      render(<HourTrackingHelpIcon />);

      // Nothing is asserted before the click, deliberately: asserting on the closed state
      // would pass while checking an empty dialog, which is how this file missed the
      // component for two whole waves.
      fireEvent.click(
        screen.getByRole("button", { name: /help for hour tracking/i }),
      );

      const text = document.body.textContent ?? "";
      expect(
        text.length,
        "the tooltip did not open — the click target moved",
      ).toBeGreaterThan(400);

      expectNoVerdict("HourTrackingHelpIcon (opened)");
    });

    it("does not assert that the requirement applies to the reader", () => {
      /**
       * The specific claim, separate from the phrase list, because no entry on that list
       * matched it: every banned phrase carries a pronoun or is all-caps, and this said
       * "you need to". Fixed in W2b; pinned here so it cannot come back in that wording.
       */
      render(<HourTrackingHelpIcon />);
      fireEvent.click(
        screen.getByRole("button", { name: /help for hour tracking/i }),
      );
      const text = normaliseForGuard(document.body.textContent ?? "");

      expect(text).not.toMatch(/you need to complete/i);
      expect(text).not.toMatch(/to meet Medicaid work requirements, you need/i);

      // Positive twin: it states the condition instead of asserting it.
      expect(text).toMatch(/if this requirement applies to you/i);
    });

    it("42 CFR 435.552: names the other pathways rather than implying hours are the only one", () => {
      /**
       * The second substantive error. The old copy said "Job searching does NOT count as a
       * qualifying activity. If you lose your job, you need to volunteer, go to school, or
       * join a work program" — which both contradicted W2a's own correction to
       * `activityDefinitions.workProgram` and presented three routes as exhaustive.
       *
       * § 435.552(a)(6) is income, (e)(2) is the income-to-hours proxy, and (a)(4) is
       * half-time education, which needs no hours at all.
       */
      render(<HourTrackingHelpIcon />);
      fireEvent.click(
        screen.getByRole("button", { name: /help for hour tracking/i }),
      );
      const text = normaliseForGuard(document.body.textContent ?? "");

      expect(text).not.toMatch(/job searching does NOT count/i);

      /**
       * Positive twins, one per omitted pathway — and each asserts the WHOLE CLAIM rather
       * than a keyword.
       *
       * Mutation testing forced this. A first version asserted `/half-time/i`, which
       * survived narrowing this component's sentence to "full-time" because `helpText.ts`
       * uses the phrase twelve times and the School definition renders inside the same
       * tooltip. A keyword match across a 3,000-character DOM proves nothing about the
       * sentence you meant. Same failure W5 recorded for `not.toHaveText`.
       */
      expect(text).toMatch(
        /household income of at least \$\d+ a month can count instead/i,
      );
      expect(text).toMatch(/credit income below that as hours/i);
      expect(text).toMatch(
        /in school at least half-time can be enough on its own/i,
      );
      // And the subsidiary-activity nuance W2a established elsewhere.
      expect(text).toMatch(
        /if job searching is part of a job training program/i,
      );
    });
  });

  describe("IncomeStatusIndicator — W5 fixed a verdict here without guarding it", () => {
    it("renders no verdict at or over the threshold", () => {
      // The branch W5 found rendering `Compliant` in green beside a tick.
      render(<IncomeStatusIndicator summary={incomeSummary(700)} />);
      expectNoVerdict("IncomeStatusIndicator (at or over)");
    });

    it("keeps the household-MAGI caution on the at-or-over branch too", () => {
      /**
       * Added after mutation testing, and it was a real gap rather than a bad mutation.
       *
       * W5's review moved the household disclosure to the under-threshold branch, where
       * `compliance-copy-standards.md` says the married user "is the case that matters".
       * It also left a differently-phrased CAUTION on this branch — and nothing asserted
       * it, so deleting it changed no test result. Both branches need the fact, for
       * opposite reasons: below the line it is reassurance, above it a warning that the
       * figure shown is not the figure the state compares (42 CFR 435.552(f)(2) measures
       * MAGI-based income for the HOUSEHOLD).
       */
      render(<IncomeStatusIndicator summary={incomeSummary(700)} />);
      const text = normaliseForGuard(document.body.textContent ?? "");

      expect(text).toMatch(
        /your state counts your whole household'?s income here, not just yours/i,
      );
      // Named actor plus a next action, per compliance-copy-standards.md.
      expect(text).toMatch(/ask them what they have on file/i);
    });

    it("renders no verdict under the threshold", () => {
      render(<IncomeStatusIndicator summary={incomeSummary(300)} />);
      expectNoVerdict("IncomeStatusIndicator (under)");
    });

    it("keeps the household-MAGI disclosure on the under-threshold branch", () => {
      /**
       * W5's review moved this here from the at-or-over branch, and the reasoning is the
       * whole point of the fix: `compliance-copy-standards.md` names the married user whose
       * spouse works as "the case that matters", because telling them they are failing
       * "sends them looking for 80 hours of volunteering they don't need."
       *
       * 42 CFR 435.552(f)(2) measures against MAGI-based income for the HOUSEHOLD, and
       * HourKeep stores one person's records — so the figure shown is not the figure the
       * state compares. Guarded now, so a later edit cannot quietly move it back.
       */
      render(<IncomeStatusIndicator summary={incomeSummary(300)} />);
      const text = normaliseForGuard(document.body.textContent ?? "");

      /**
       * The whole claim, not the word "household".
       *
       * Mutation testing forced this too: `/household/i` survived deleting the sentence,
       * because the component says "household" three times and the other two are in the
       * two-sided explanation further down. Asserting the specific clause is what makes
       * this guard protect the fix W5's review actually made.
       */
      expect(text).toMatch(
        /your state counts your whole household'?s income here, which is often more/i,
      );
      // The two-sided half: more household income HELPS this pathway.
      expect(text).toMatch(/already be over this without doing anything else/i);
      // And it must not read as a spouse's income being a problem.
      expect(text).not.toMatch(/spouse'?s income (may|could|might) disqualif/i);
    });
  });
});

/**
 * `SeasonalWorkerView` — added after the W2b review, and the omission is the point.
 *
 * W2b's own stated structural lesson was W5's: five components created, none guarded, two
 * verdicts through. W2b then added two components to this guard on exactly that reasoning —
 * and edited a THIRD, `SeasonalWorkerView`, without guarding it. That third one was
 * rendering a verdict the whole time:
 *
 *     "Meets $580 threshold / Your 6-month average meets work requirements."
 *
 * Three of four independent reviewers found it. None of the 31 banned phrases matched:
 * the list carries "already meets" and "you meet work requirements", and this said
 * "average meets", with no pronoun. So the phrase list gained `average meets` and
 * `meets work requirements`, and this component gained coverage on both branches.
 */
describe("SeasonalWorkerView — 42 CFR 435.552(g), the seasonal averaging surface", () => {
  /**
   * `SeasonalWorkerView` takes `{ history, average, isCompliant }` — not a
   * `MonthlyIncomeSummary`. Worth stating because my first version of this fixture passed a
   * summary and `tsc` caught it: the component predates the summary type and its caller
   * destructures before rendering.
   *
   * `isCompliant` is computed here from the threshold rather than passed as a bare boolean,
   * so the two branches cannot be exercised with a value that contradicts the average shown.
   */
  function seasonalProps(average: number) {
    return {
      average,
      isCompliant: average >= incomeThreshold(FEDERAL_DEFAULT),
      history: [
        { month: "2026-01", total: average },
        { month: "2026-02", total: average },
        { month: "2026-03", total: average },
        { month: "2026-04", total: average },
        { month: "2026-05", total: average },
        { month: "2026-06", total: average },
      ],
    };
  }

  it("renders no verdict at or over the threshold", () => {
    render(<SeasonalWorkerView {...seasonalProps(700)} />);
    expectNoVerdict("SeasonalWorkerView (at or over)");
  });

  it("renders no verdict below the threshold", () => {
    render(<SeasonalWorkerView {...seasonalProps(300)} />);
    expectNoVerdict("SeasonalWorkerView (below)");
  });

  it("states the comparison rather than the conclusion, on both branches", () => {
    // Positive twin for the two above. "No verdict" is satisfiable by rendering nothing.
    for (const average of [700, 300]) {
      const { unmount } = render(
        <SeasonalWorkerView {...seasonalProps(average)} />,
      );
      const text = normaliseForGuard(document.body.textContent ?? "");

      expect(text, `average ${average}`).toMatch(/Average: \$[\d,.]+/);
      expect(text, `average ${average}`).toMatch(/Threshold: \$[\d,.]+/);
      unmount();
    }
  });

  it("42 CFR 435.552(e)(2): tells a short user their income is not wasted", () => {
    /**
     * The substantive half of the fix, not just the wording.
     *
     * The old under-threshold copy said "You may need to track hours or increase your
     * income", which omits the income-to-hours proxy: income BELOW the threshold can be
     * credited AS hours and combined with other activities. So a shortfall read as wasted
     * when the rule says it is not — the same class of harm ADR-0003 § Context describes,
     * sending someone after hours they may not need.
     */
    render(<SeasonalWorkerView {...seasonalProps(300)} />);
    const text = normaliseForGuard(document.body.textContent ?? "");

    expect(text).not.toMatch(
      /you may need to track hours or increase your income/i,
    );
    expect(text).toMatch(/isn'?t wasted/i);
    expect(text).toMatch(/credit income below the threshold as hours/i);
    // And the household basis, which is what makes the figure shown not the state's figure.
    expect(text).toMatch(/whole household'?s income/i);
    // Named actor plus a next action.
    expect(text).toMatch(/ask them what they have on file/i);
  });

  it("names the averaging span as something the state may work out differently", () => {
    // 42 CFR 435.603(h)(3) is a state election and CMS says most states elect it, so a flat
    // "your 6-month average" states as settled a span we do not know. Both branches hedge.
    for (const average of [700, 300]) {
      const { unmount } = render(
        <SeasonalWorkerView {...seasonalProps(average)} />,
      );
      const text = normaliseForGuard(document.body.textContent ?? "");
      expect(text, `average ${average}`).toMatch(
        /(work the average out over a different stretch|how they work out your average)/i,
      );
      unmount();
    }
  });
});
