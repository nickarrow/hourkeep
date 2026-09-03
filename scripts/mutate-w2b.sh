#!/usr/bin/env bash
#
# Mutation harness for W2b. Temporary; deleted at wave close.
#
# THREE THINGS THIS DOES THAT MATTER, all earned in W0 and W5:
#
#   1. Snapshots with `cp` and reverts with `cp`, never `git checkout --`. W5's first
#      harness used git checkout, which CANNOT restore an untracked file — so every
#      mutation persisted and each failure count after the first was cumulative garbage
#      that looked entirely plausible. Most files W2b touches are new and untracked.
#   2. VERIFIES the mutation applied, by diffing after writing. A mutation that silently
#      did not apply looks exactly like a test that does not care.
#   3. VERIFIES the revert, by diffing back against the snapshot and failing loudly.
#
# Usage: scripts/mutate-w2b.sh
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

SNAP=$(mktemp -d)
trap 'rm -rf "$SNAP"' EXIT

pass=0
insensitive=0

# mutate <file> <sed-expression> <description> <test-path-filter>
mutate() {
  local file="$1" expr="$2" desc="$3" filter="$4"
  local snap="$SNAP/$(echo "$file" | tr '/' '_')"

  cp "$file" "$snap"
  sed -i '' -e "$expr" "$file"

  if diff -q "$file" "$snap" >/dev/null; then
    echo "  SKIP  (mutation did not apply) : $desc"
    cp "$snap" "$file"
    return
  fi

  if npm test --silent -- "$filter" >/dev/null 2>&1; then
    echo "  INSENSITIVE  : $desc"
    insensitive=$((insensitive + 1))
  else
    echo "  caught       : $desc"
    pass=$((pass + 1))
  fi

  cp "$snap" "$file"
  if ! diff -q "$file" "$snap" >/dev/null; then
    echo "REVERT FAILED for $file — STOPPING. Tree is dirty." >&2
    exit 1
  fi
}

FD=src/lib/policy/federalDefault.ts
TY=src/lib/policy/types.ts
DE=src/lib/policy/derive.ts

echo "== FEDERAL_DEFAULT values =="
mutate "$FD" 's/requiredHours: 80,/requiredHours: 81,/' \
  "requiredHours 80 -> 81 (42 CFR 435.552(a))" src/lib/policy
mutate "$FD" 's/federalMinimumWage: 7\.25,/federalMinimumWage: 7.5,/' \
  "federalMinimumWage 7.25 -> 7.5 (29 U.S.C. 206(a)(1)(C))" src/lib/policy
mutate "$FD" 's/applicationLookbackMonths: 1,/applicationLookbackMonths: 3,/' \
  "application lookback 1 -> 3 (435.556(a)(1))" src/lib
mutate "$FD" 's/max: 3 },/max: 6 },/' \
  "lookback bounds max 3 -> 6 (435.556(a)(1))" src/lib
mutate "$FD" 's/implementationDate: "2027-01-01"/implementationDate: "2027-06-01"/' \
  "implementation date (435.559(a))" src/lib/policy
mutate "$FD" 's/noticeReceiptPresumptionDays: 5,/noticeReceiptPresumptionDays: 0,/' \
  "5-day receipt presumption -> 0 (435.558(c)(4))" src/lib/policy
mutate "$FD" 's/renewalIntervalMonths: 6,/renewalIntervalMonths: 12,/' \
  "renewal interval 6 -> 12 (the 435.916 conflict)" src/lib
mutate "$FD" 's/"fax",//' \
  "drop fax from submissionModalities (435.907(a))" src/lib/policy
mutate "$FD" 's/frailtyListStructure: "unknown"/frailtyListStructure: "flat"/' \
  "frailty list unknown -> flat (435.554(c)(5)(ii))" src/lib/policy
mutate "$FD" 's/shortTermHardshipOffered: false,/shortTermHardshipOffered: true,/' \
  "hardship default off -> on (435.555)" src/lib/policy
mutate "$FD" 's/incomeToHoursProxyAvailable: true,/incomeToHoursProxyAvailable: false,/' \
  "proxy default on -> off (435.552(e)(2))" src/lib/policy

echo "== provenance =="
mutate "$FD" 's/review periods at 435\.556 (33473); //' \
  "remove 435.556 from source.citation" src/lib
mutate "$FD" 's/retrievedAt: "2026-09-02"/retrievedAt: "soon"/' \
  "retrievedAt is not a date" src/lib
mutate "$FD" 's/confidence: "statutory-floor"/confidence: "state-published"/' \
  "confidence mislabelled as state-published" src/lib/policy
mutate "$FD" 's/field: "renewalIntervalMonths",/field: "renewalInterval",/' \
  "interpretiveRisk names a field that does not exist" src/lib/policy
mutate "$FD" 's/field: "frailtyListStructure",/field: "frailtyList",/' \
  "drop the Massachusetts v. Oz risk entry" src/lib/policy
mutate "$FD" 's/Massachusetts v\. Oz/a court/' \
  "watch condition loses the named case" src/lib/policy
mutate "$FD" 's/The two do not agree and no/No/' \
  "renewal source no longer says the two disagree" src/lib/policy

echo "== derivation =="
mutate "$DE" 's|Math.round(profile.federalMinimumWage \* profile.requiredHours \* 100) / 100|580|' \
  "incomeThreshold returns a stored 580 instead of deriving" src/lib/policy
mutate "$DE" 's|profile.federalMinimumWage \* profile.requiredHours|7.25 * profile.requiredHours|' \
  "incomeThreshold hardcodes the wage operand" src/lib/policy
mutate "$DE" 's|Math.round(profile.federalMinimumWage \* profile.requiredHours \* 100) / 100|profile.federalMinimumWage * profile.requiredHours|' \
  "incomeThreshold stops rounding to cents" src/lib/policy
# The first version of this case added a bogus extra `case "__never":`, which is a no-op
# and therefore proved nothing. A collapse mutation has to actually make two branches
# return the same text.
mutate "$DE" 's|These come from what your state has published|These are the federal minimums|' \
  "confidenceHedge gives a state-published profile the statutory-floor wording" src/lib/policy
mutate "$DE" 's|and your state may require more|and that is that|' \
  "statutory-floor hedge drops 'may require more' (ADR-0001)" src/lib/policy
mutate "$DE" 's|Ask them what they have for you, and what months they.ll look at\.||' \
  "statutory-floor hedge loses its next action" src/lib/policy

echo "== manifest and ownership =="
mutate "$TY" 's/^  "frailtyListStructure",$//' \
  "field missing from POLICY_PROFILE_FIELDS" src/lib/policy
mutate "$TY" 's|consumer: "src/lib/policy/derive.ts",|consumer: "src/lib/policy/gone.ts",|' \
  "consumer path does not exist" src/lib/policy
mutate "$TY" 's|consumer: "src/lib/reviewPeriod.ts",|consumer: "src/lib/month.ts",|' \
  "consumer names a file that does not import @/lib/policy" src/lib/policy
mutate "$TY" 's|why: "42 CFR 435.556(a)(2)(i)"|why: "tbd"|' \
  "owner reason is a placeholder" src/lib/policy

echo
echo "caught: $pass   insensitive: $insensitive"
echo "--- git status must be clean below this line ---"
git status --short

# --- Appended for task 6: the transition rules (gaps 15.6, 15.7) --------------
TR=src/lib/policy/transition.ts

echo "== 435.915, application ruleset =="
mutate "$TR" 's|const prior = isBefore(parseISO(filedOn), implementation);|const prior = !isBefore(parseISO(filedOn), implementation);|' \
  "day-granular comparison inverted" src/lib/policy
mutate "$TR" 's|const prior = filedOn < implementationMonth;|const prior = filedOn <= implementationMonth;|' \
  "month comparison includes the implementation month (435.559(a) is on-or-after)" src/lib/policy
mutate "$TR" 's|if (filedOn === implementationMonth \&\& !implementationIsFirstOfMonth) {|if (false) {|' \
  "straddling filing month guesses instead of returning uncertain" src/lib/policy
mutate "$TR" 's|ruleset: "uncertain",|ruleset: "prior-rules",|' \
  "uncertain silently becomes the user-favourable answer" src/lib/policy
mutate "$TR" 's|Ask your state to confirm which rules they applied to your application.||' \
  "prior-rules answer loses its next action" src/lib/policy
# Re-targeted. The first version removed only ONE of two tier labels in this citation, so
# the test rightly kept passing. Removing the definitive one is the real mutation.
mutate "$TR" 's|apply. PREAMBLE, not regulatory text.|apply.|' \
  "435.915 citation drops its source-tier label" src/lib/policy
mutate "$TR" 's|`applicationRuleset needs a filing date as YYYY-MM-DD or YYYY-MM, got ` +|`bad input ` +|' \
  "malformed-input error stops naming the expected format" src/lib/policy

echo "== 435.559(c), renewal initiation window =="
mutate "$TR" 's|const earliest = addDays(dueDate, -leadDays.max);|const earliest = addDays(dueDate, leadDays.max);|' \
  "initiation window runs FORWARD from the due date" src/lib/policy
mutate "$TR" 's|const earliest = addDays(dueDate, -leadDays.max);|const earliest = addDays(dueDate, -leadDays.min);|' \
  "earliest uses min instead of max (window collapses)" src/lib/policy
mutate "$TR" 's|const latest = addDays(dueDate, -leadDays.min);|const latest = addDays(dueDate, -leadDays.max);|' \
  "latest uses max instead of min (bounds swapped)" src/lib/policy
mutate "$TR" 's|const leadDays = profile.renewalInitiationLeadDays;|const leadDays = { min: 60, max: 90 };|' \
  "lead time hardcoded instead of read from the profile (ADR-0001)" src/lib/policy
mutate "$TR" 's|: earliestIsBefore$|: false|' \
  "straddles arm removed" src/lib/policy
mutate "$TR" 's|const relationToImplementation = latestIsBefore|const relationToImplementation = earliestIsBefore|' \
  "relation keys off earliest, so straddling reports as before" src/lib/policy
# CHECKED AND DROPPED, not fixed. Removing "likely" leaves "States usually start looking at
# your records 60 to 90 days before that, so yours started around 2026-10 or 2026-11" - one
# sentence carrying both "usually" and "around", which is adequate hedging. Tightening the
# guard to fire here would be guard over-reach of the kind that killed the repo-wide policy
# grep. Left in the harness, expected INSENSITIVE, so the count does not quietly improve.
mutate "$TR" 's|so yours likely |so yours |' \
  "reassuring answer drops 'likely' (EXPECTED INSENSITIVE - see comment)" src/lib/policy
# Re-targeted. Replacing "probably won't" with "will not" left the sentence opening "If
# so,", which is a legitimate hedge and which the per-sentence guard correctly accepts -
# "if X, then Y will not happen" is a conditional, not an absolute. Removing the antecedent
# too is what makes it an unhedged claim.
mutate "$TR" 's|If so, this requirement probably won.t be checked|This requirement will not be checked|' \
  "reassurance becomes an unhedged absolute" src/lib/policy
mutate "$TR" 's|Ask your state when they.ll start reviewing ` +|`` +|' \
  "before-answer loses its next action" src/lib/policy
mutate "$TR" 's|RULE TEXT: for a |for a |' \
  "435.559(c) citation drops the RULE TEXT label" src/lib/policy
mutate "$TR" 's|CMS-2454-IFC PREAMBLE, 91 FR 33416|CMS-2454-IFC, 91 FR 33416|' \
  "lead-time citation drops the PREAMBLE label" src/lib/policy

echo
echo "TRANSITION TOTALS  caught: $pass   insensitive: $insensitive"

# --- Appended for task 10: the gate and the guards ----------------------------
HTH=src/components/help/HourTrackingHelp.tsx
RPP=src/components/tracking/ReviewPeriodPanel.tsx
ISI=src/components/income/IncomeStatusIndicator.tsx
HT=src/content/helpText.ts

echo "== the spelt-value guard =="
mutate "$RPP" "s|We've assumed |We've assumed six |" \
  "reintroduce W5's spelt renewal interval" src/__tests__/no-spelt
mutate "$RPP" 's|\${period.months.length}, but yours|, but yours|' \
  "drop the interpolated figure entirely" src/__tests__/no-spelt
mutate "$HT" 's|over the \${SEASONAL_MONTHS} months|over the six months|' \
  "spell the seasonal window as a word" src/__tests__/no-spelt
mutate "src/lib/policy/transition.ts" 's|\${leadDays.min} to \${leadDays.max} days|sixty to ninety days|' \
  "spell the initiation lead time" src/__tests__/no-spelt

echo "== the no-verdict render guard, on components W2b added =="
mutate "$HTH" 's|If this requirement applies to you, the usual way to meet it is|To meet Medicaid work requirements, you need to complete|' \
  "restore the 'you need to complete' assertion" src/__tests__/no-verdict.render
# The JSX carries `doesn&apos;t`, not an apostrophe. Matching the entity is the fix.
mutate "$HTH" 's|Looking for work doesn\&apos;t count on its own|Job searching does NOT count as a qualifying activity|' \
  "restore 'Job searching does NOT count'" src/__tests__/no-verdict.render
mutate "$HTH" 's|Household income of at least \$|Nothing else counts. Not income of at least $|' \
  "remove the other-pathways disclosure" src/__tests__/no-verdict.render
mutate "$HTH" 's|in school at least half-time can be enough|in school full-time can be enough|' \
  "narrow the half-time education pathway to full-time" src/__tests__/no-verdict.render
# IncomeStatusIndicator: reintroduce the exact verdict W5 removed from this component,
# which W5 then failed to guard. This is the mutation that proves the new coverage works.
mutate "$ISI" 's|That\&apos;s at or over|Compliant. That\&apos;s at or over|' \
  "restore the 'Compliant' verdict W5 removed but never guarded" src/__tests__/no-verdict.render
mutate "$ISI" 's|here, not just yours|here|' \
  "remove the household caution from the AT-OR-OVER branch" src/__tests__/no-verdict.render
mutate "$ISI" 's|which is often more|which is different|' \
  "weaken the household disclosure on the UNDER branch" src/__tests__/no-verdict.render
mutate "$ISI" 's|already be over this without doing anything else|already be over this|' \
  "drop the two-sided reassurance on the UNDER branch" src/__tests__/no-verdict.render

echo "== the in-CI literal scan, on files the shell gate cannot see =="
mutate "$HT" 's|const HOURS = FEDERAL_DEFAULT.requiredHours;|const HOURS = 80;|' \
  "helpText re-hardcodes the hours threshold" src/lib/__tests__/policyInjection
mutate "$HTH" 's|const INCOME_MINIMUM = incomeThreshold(FEDERAL_DEFAULT);|const INCOME_MINIMUM = 580;|' \
  "HourTrackingHelp re-hardcodes the income threshold" src/lib/__tests__/policyInjection
mutate "src/app/export/page.tsx" 's|hours: FEDERAL_DEFAULT.requiredHours,|hours: 80,|' \
  "export page re-hardcodes the hours threshold" src/lib/__tests__/policyInjection
mutate "src/lib/__tests__/policyInjection.test.ts" 's|/fontSize/,|/neverAppearsAnywhere/,|' \
  "allowlist entry that matches nothing" src/lib/__tests__/policyInjection

echo
echo "GUARD TOTALS  caught: $pass   insensitive: $insensitive"

# --- Appended after the W2b review -------------------------------------------
# THE MUTATION THE HARNESS WAS MISSING, and the reason the `$` blind spot survived
# 61 mutations: every re-hardcoding case above writes a BARE literal (`= 80;`,
# `= 580;`). None wrote `$580` into a string, which is the form the income
# threshold almost always takes on screen. Three of four reviewers found the gap
# by reading the regex; no mutation could have.
echo "== dollar-denominated literals, the reviewed blind spot =="
mutate "$HT" 's|Threshold: \$\${INCOME}|Threshold: $580|' \
  "helpText re-hardcodes \$580 INSIDE A STRING" src/lib/__tests__/policyInjection
mutate "src/components/onboarding/GettingStartedContextual.tsx" 's|Threshold: \$\${INCOME_MINIMUM}|Threshold: $580|' \
  "GettingStarted re-hardcodes \$580 inside a string" src/lib/__tests__/policyInjection
# Was `(\$\${WAGE})` — two literal dollars, so it matched nothing. The JSX has ONE.
mutate "src/components/help/IncomeTrackingHelp.tsx" 's|(\${WAGE})|($7.25)|' \
  "IncomeTrackingHelp re-hardcodes \$7.25" src/lib/__tests__/policyInjection

echo "== the SeasonalWorkerView verdict, now guarded =="
SWV=src/components/income/SeasonalWorkerView.tsx
mutate "$SWV" 's|That\&apos;s at or over the threshold for these|Your average meets work requirements for these|' \
  "reintroduce an 'average meets' verdict" src/__tests__/no-verdict.render
mutate "src/components/income/SeasonalWorkerView.tsx" 's|A shortfall here isn\&apos;t wasted|You may need to track hours or increase your income|' \
  "restore the copy omitting the 435.552(e)(2) proxy" src/__tests__/no-verdict.render
mutate "src/components/income/SeasonalWorkerView.tsx" 's|it may work the|it works the|' \
  "state the seasonal averaging span as settled" src/__tests__/no-verdict.render

echo "== transition.ts copy corrected after review =="
mutate "$TR" 's|so the new rules cover your application. That doesn|so this requirement applies to your application. That does not doesn|' \
  "reassert that the requirement applies" src/lib/policy/__tests__/transition
# BOTH hedges have to go. Removing only "probably" left "usually" earlier in the same
# string, so the test's /usually|probably/ still matched and the mutation read as insensitive
# when it was really incomplete.
mutate "$TR" 's|are usually decided|are decided|;s|probably shouldn|shouldn|' \
  "unhedge the prior-rules reassurance (both hedges)" src/lib/policy/__tests__/transition

echo
echo "POST-REVIEW TOTALS  caught: $pass   insensitive: $insensitive"
