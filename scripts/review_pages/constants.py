"""What the review pages are made from and where they go, the addresses they link to, and the start-here rows."""

from __future__ import annotations

import re

REVIEW = "docs/review/"  # the review pages, from the repository root
OPEN_QUESTIONS = "docs/domain/open-questions.md"
LANDING_PAGE = "README.md"
OPEN_QUESTIONS_PAGE = "open-questions.md"
STATE_FACTS_PAGE = "state-facts.md"
DOMAIN_FROM_REVIEW = "../domain/"  # the corpus, docs/domain/, as a page in docs/review/ links it
EXTRACT_FROM_REVIEW = "../domain/community-engagement-extract.md"  # the extract, as a page in docs/review/ links it
LEDGER_FROM_REVIEW = "../domain/research/2026-10-16-policy/ledger.md"  # the research ledger, likewise
FEDERAL_STATE = "federal"  # the state file whose facts come first
# The open questions page's groups, in the order it shows them, each its ## heading and the sentence under it. The
# owner decided on 2026-10-22 that conflicts come first, since each of those has two sources that say different
# things.
CONFLICT_GROUP = "Where the sources conflict"
FEDERAL_GROUP = "Questions about the federal rule"
STATE_RULES_GROUP = "Questions about a state's own rules"
STATE_CHOICE_GROUP = "Waiting on a choice a state has not published"
# A question whose part moved to the state facts, as decision record 0006 sets out, goes in this group, last, and
# the opening paragraph gains MOVED_OPENING when one does.
MOVED_GROUP = "Moved to the state facts"
MOVED_OPENING = "The last group holds questions whose part moved to the state facts, each under its old title."
QUESTION_GROUPS = (
    (CONFLICT_GROUP, "Two sources say different things, and HourKeep does not pick a side until someone who can "
                     "decide says which governs."),
    (FEDERAL_GROUP, "The federal rule raises these and does not answer them. CMS can settle them, and anyone who "
                    "knows how CMS reads its rule can help."),
    (STATE_RULES_GROUP, "A state's own rules or its Medicaid agency's pages leave these unclear. The state's "
                        "Medicaid agency can settle them."),
    (STATE_CHOICE_GROUP, "The federal rule lets a state choose, and no stored source says what the state chose. The "
                         "state's adopted rules, or its Medicaid agency, can settle these."),
    (MOVED_GROUP, "These were open questions. Each is now a state fact, named under its old title, and comments on "
                  "it go to the fact."),
)
# The two reasons of the Formats that decide a group, as corpus_check's OPEN_REASONS writes them.
CONFLICT_REASON = "the sources conflict"
STATE_CHOICE_REASON = "it turns on a choice the state has not published"

# The three ways to comment, on every row, open question and state fact.
ISSUE_FORM = "https://github.com/nickarrow/hourkeep/issues/new?template=row-review.yml"
GOOGLE_FORM = "https://forms.gle/Tvs27CNLg6Jdip429"  # the landing page's plain link to the Google Form
# The Google Form with its question "Which row, state fact or open question?", entry 399684664, filled in with the
# name that follows, as read from the public form page on 2026-10-21.
GOOGLE_FORM_FOR = ("https://docs.google.com/forms/d/e/1FAIpQLSfmdg1bA4lF_frlMIl8LGIjwUS0ymtHKcqar2aB_h0evB97yQ/viewform"
                   "?usp=pp_url&entry.399684664=")
EMAIL = "policy@hourkeep.app"

# The parts of a citation the pages link to the official text. Each pattern's whole match becomes the link's words.
# A CFR part's groups are its title, 42 or 28, its section, and the paragraph it names, if any, such as (a)(1), the
# first of a range. Title 28 holds 28 CFR 35.108, which 42 CFR 435.554(a) incorporates; another title is text.
CFR_PART = re.compile(r"(42|28) CFR (\d+\.\d+)((?:\([A-Za-z0-9]+\))*)[^\s;,]*")
CFR_TITLE_42 = "42"
CFR_URL = "https://www.ecfr.gov/current/title-{}/section-{}"
CFR_PARAGRAPH = "#p-{}"  # eCFR's id for a paragraph, the section and paragraph percent-encoded
# In an open question's text, a 42 CFR reference, and not a 28 CFR one, may be followed by a list of bare sections,
# as in "42 CFR 431.211, 431.221 and 431.231", and may be shortened to a section sign, as in "§ 431.206(c)(2)". Both
# link to title 42 only for a section in parts 400 to 499, which hold the Medicare and Medicaid rules the corpus
# cites, so that Colorado's 8.057 or 8.100 never does. A paragraph alone, such as the (c)(3) in "(c)(2), (c)(3)",
# stays text.
CFR_SECTION = r"(4\d\d\.\d+)((?:\([A-Za-z0-9]+\))*)(?![A-Za-z0-9]|\.\d)"
CFR_LISTED = re.compile(r"(, | and | or )" + CFR_SECTION)  # one more bare section, straight after the last
CFR_SECTION_SIGN = re.compile(r"§ " + CFR_SECTION)
CFR_TITLE = re.compile(r"\b(\d+) CFR\b")  # a section sign links only where the text names title 42 and no other
FR_PART = re.compile(r"(\d+) FR (\d+)(?:-\d+)?")
FR_URL = "https://www.federalregister.gov/citation/{}-FR-{}"  # the first page of a range
SMD_PART = re.compile(r"CMS SMD 26-001")
SMD_SOURCE = "docs/domain/sources/cms/smd-26-001.pdf"
# Colorado's 10 CCR 2505-10 8.000 holds the sections numbered 8.000 to 8.099, so a section such as 8.100.4 is in
# another rule of the same volume and is left as text.
CCR_PART = re.compile(r"10 CCR 2505-10 8\.0\d\d[^\s;,]*")
CCR_SOURCE = re.compile(r"^docs/domain/sources/colorado/10-ccr-2505-10-8\.000-[^/]*\.pdf$")
# Colorado's draft 10 CCR 2505-10 8.100, cited in a part that says it is the draft, links to the stored draft.
CCR_DRAFT_PART = re.compile(r"10 CCR 2505-10 8\.100(?![0-9])[^\s;,]*(?=.*\bdraft\b)")
CCR_DRAFT_SOURCE = re.compile(r"^docs/domain/sources/colorado/10-ccr-2505-10-8\.100-draft-[^/]*\.pdf$")
SSA_PART = re.compile(r"SSA 1902[^\s;,]*")
SSA_URL = "https://www.ssa.gov/OP_Home/ssact/title19/1902.htm"
PUBLIC_LAW_PART = re.compile(r"Pub\. L\. 119-21")
PUBLIC_LAW_URL = "https://www.govinfo.gov/content/pkg/PLAW-119publ21/html/PLAW-119publ21.htm"
NOT_RECORDED = "not recorded"
# A row's Source that is not stored yet, 'not stored, <URL>', whose address its page shows.
NOT_STORED_ADDRESS = re.compile(r"^not stored, (\S+)$")

# The paragraph a topic page opens with, before Start here, keyed by topic file as START_HERE is; each word in it
# that is a row's identifier links to the row. A topic file with none opens with Start here.
ORIENTATION = {
    "who-the-requirement-applies-to": (
        "Two terms run through this page. A person the requirement applies to is what the rule calls an applicable "
        "individual, as applicable-individual-defined sets out, and a person the rule excludes from it is a "
        "specified excluded individual, as specified-excluded-individual-not-subject-to-community-engagement and "
        "specified-excluded-individual-meets-one-category set out. Whether a person is either is the agency's "
        "determination."
    ),
}

# The rows a reviewer with little time starts from, keyed by topic file, in the order each topic page lists them.
START_HERE = {
    "notices-and-fair-hearings": (
        "notice-says-how-to-show-compliance",
        "notice-says-how-to-show-not-applicable",
        "notice-states-the-deadline",
        "notice-says-how-to-submit",
        "notice-says-consequences-including-premium-tax-credit",
        "notice-says-how-to-reapply",
        "notice-gives-hardship-information-where-elected",
        "notice-response-period",
        "notice-presumed-received-after-5-days",
        "coverage-continues-during-noncompliance",
        "consider-all-other-bases-before-denial",
        "deny-application-with-notice-and-hearing-rights",
        "disenroll-with-advance-notice-and-hearing-rights",
        "reconsideration-after-disenrollment",
        "hearing-request-window-at-most-90-days",
        "services-maintained-when-hearing-requested-before-action",
        "recovery-if-action-upheld",
        "agency-may-reinstate-within-10-days-after-action",
        "reschedule-2027-renewals-to-six-months",
        "keep-scheduled-2027-renewals",
    ),
    "who-the-requirement-applies-to": (
        "applicable-individual-under-the-state-plan",
        "applicable-individual-under-a-demonstration",
        "demonstration-populations-reviewed-for-community-engagement",
        "cms-identified-13-demonstration-populations-in-8-states",
        "specified-excluded-individual-meets-one-category",
        "parent-guardian-caretaker-relative-or-family-caregiver-excluded",
        "family-caregiver-excluded-on-one-criterion",
        "family-caregiver-living-with-care-recipient",
        "family-caregiver-relative-living-apart",
        "family-caregiver-unrelated-living-apart-80-hours",
        "dependent-child-defined",
        "veteran-with-total-disability-rating-excluded",
        "veteran-paid-at-total-rate-for-unemployability-excluded",
        "snap-household-member-not-exempt-from-work-requirement-excluded",
        "snap-exclusion-covers-general-and-time-limit-work-requirements",
        "treatment-program-participant-excluded",
        "treatment-program-defined-by-food-and-nutrition-act",
        "pregnant-or-postpartum-excluded",
        "postpartum-period-runs-from-the-end-of-pregnancy",
        "no-waiver-of-community-engagement",
    ),
}
