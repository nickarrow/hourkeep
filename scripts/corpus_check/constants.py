"""Every path, vocabulary and pattern the checker uses, as the Formats section of
docs/epics/0001-policy-corpus/design.md lists them. Paths are relative to the repository root.
"""

from __future__ import annotations

import re

EXTRACT = "docs/domain/community-engagement-extract.md"
OPEN_QUESTIONS = "docs/domain/open-questions.md"
MANIFEST = "docs/domain/sources/MANIFEST.json"
# The state files the corpus requires. Every other STATES_FOLDER/*.json git lists is a state file too, and is read.
STATE_FILES = ("docs/domain/states/federal.json", "docs/domain/states/co.json")
STATES_FOLDER = "docs/domain/states/"
SKILL = ".kiro/skills/medicaid-community-engagement/SKILL.md"  # the skill's main file; its topic files are below

# A row's fields: the required ones in the order they must come, then the optional ones, which come last.
REQUIRED_FIELDS = ("Rule", "Citation", "Source", "Tier", "State election", "Verified", "Error direction", "Recheck")
OPTIONAL_FIELDS = ("Corrected", "Note")

# The vocabularies of a row's fields, as the Formats section lists them.
TIERS = (
    "statute", "regulation", "preamble", "proposed regulation", "agency guidance",
    "state statute", "state regulation", "state plan", "state draft rule", "state agency page",
    "court", "party filing", "secondary",
)
ERROR_DIRECTIONS = ("dangerous", "burdensome", "neither")
RECHECK_TRIGGERS = (
    "final rule", "correction notice", "court ruling", "CMS guidance", "state plan amendment", "state rule",
    "federal minimum wage", "eCFR amendment",
)

DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
STATE_ELECTION = re.compile(r"^yes; the state chooses (.+?); where it has not chosen, (.+)$")
# A Verified value: the date, then the method; `expert review` always names the person, the others may.
VERIFIED = re.compile(
    r"^(\d{4}-\d{2}-\d{2}), (?:(?:read in source|ledger [^\s,]+)(?:, by (\S.*))?|expert review, by (\S.*))$"
)
CORRECTED = re.compile(r"^(\d{4}-\d{2}-\d{2}): (.+?); (.+)$")
NOT_STORED = "not stored"
NOT_STORED_SOURCE = re.compile(r"^not stored, \S+$")

# A Source: a path, a colon, a line number counted from 1, a space, and quoted words with no double quote inside.
SOURCE = re.compile(r'^([^"\s][^"]*?):(\d+) "([^"]+)"$')

# A citation's checks. The tiers whose citation must name a section by its number; a section number is digits, a
# period and digits, such as 435.558 or 8.057, or a number after the section sign, the word section, SSA or U.S.C.
# `section` and `sec.` count in any case. The word TBD or TODO, in any case, fails a citation of any tier.
SECTION_TIERS = ("statute", "regulation", "state statute", "state regulation")
SECTION_NUMBER = re.compile(r"\d+\.\d+|\u00a7+\s*\d|(?i:\bsection\s+\d|\bsec\.\s*\d)|\bSSA\s+\d|\bU\.S\.C\.\s*\d")
PLACEHOLDER = re.compile(r"\b(?:TBD|TODO)\b", re.IGNORECASE)
# A citation's parts are separated by exactly '; ', a semicolon then one space, so the review pages can split them.
# This matches a semicolon with any space before it, or one not followed by a single space and then a non-space.
CITATION_SEPARATOR = re.compile(r"\s;|;(?! \S)")

# A manifest entry's keys. Each is a string except the two lists. A derived entry adds DERIVED_KEYS, which no other
# entry holds; an entry for a path under ECFR_FOLDER adds ecfr_date, which eCFR text elsewhere may hold too; any entry
# may add note. An entry holds no other key.
ENTRY_KEYS = ("path", "sha256", "kind", "cited_url", "retrievals", "superseded")
OPTIONAL_ENTRY_KEYS = ("ecfr_date", "note")
LIST_KEYS = ("retrievals", "superseded")
RETRIEVAL_KEYS = ("served_url", "command", "retrieved")
SUPERSEDED_KEYS = ("by", "scope")
DERIVED_KEYS = ("derived_from", "derivation")
KINDS = ("verbatim", "derived")
ECFR_FOLDER = "docs/domain/sources/ecfr/"
SHA256 = re.compile(r"^[0-9a-f]{64}$")
NOT_RECORDED = "not recorded"
ADDRESS = re.compile(r"^https?://\S+$")
# A time of the corpus's own work: UTC in ISO 8601 with a Z, such as 2026-10-17T03:10:00Z.
UTC_TIME = re.compile(r"^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?Z$")
# A PDF's text extraction is derived from a .pdf by this command, run from the repository root, which the script's
# SHA-256 and the macOS and Swift versions it ran on follow.
PDF_EXTRACTION_COMMAND = "swift scripts/extract-pdf-text.swift {pdf} > {txt}"
HEX_DIGEST = re.compile(r"\b[0-9a-f]{64}\b")
# A PDF under SOURCES_FOLDER has an entry for its extraction, the PDF's path with .txt in place of .pdf. The
# extraction's first line is PAGE_MARKER for page 1, and each later PAGE_MARKER line is one more than the last.
SOURCES_FOLDER = "docs/domain/sources/"
PAGE_MARKER = re.compile(rb"^\[\[page ([0-9]+)\]\]$")

# Every file git lists in DOMAIN, outside RESEARCH, must be a manifest path or match one of OWN_FILES, the corpus's
# own files. In these patterns `*` stands for any characters but a slash and `**/` for any run of folders.
DOMAIN = "docs/domain/"
RESEARCH = "docs/domain/research/"
OWN_FILES = (
    EXTRACT,
    OPEN_QUESTIONS,
    "docs/domain/states/*.json",
    MANIFEST,
    "docs/domain/supporting-regs/README.md",
    # The analysis files still in use, named under "Stored sources and the manifest".
    "docs/domain/cms-2454-ifc/rule-extract.md",
    "docs/domain/cms-2454-ifc/state-options.md",
    "docs/domain/cms-2454-ifc/what-matters-most.md",
    "docs/domain/hr1/HR1-Impact-Summary.md",
    "docs/domain/medicaid-work-requirements-cfa-service-blueprint.md",
    "docs/domain/snap-work-requirements-cfa-service-blueprint.md",
)
OWN_FILE = re.compile("^(?:{})$".format("|".join(
    re.escape(pattern).replace(r"\*\*/", "(?:[^/]*/)*").replace(r"\*", "[^/]*") for pattern in OWN_FILES)))

# A state file is {"state": ..., "name": ..., "facts": [...]}, its state the file's name without .json. Each fact has
# FACT_KEYS, and a note as well when its status is in NOTE_STATUSES; each of its sources has FACT_SOURCE_KEYS. A source
# whose tier is in WARNING_TIERS, dated before RULE_DATE or with its date not stated, warns that it may predate the
# rule, the interim final rule's June 3, 2026 printing; a warning does not fail.
STATE_KEYS = ("state", "name", "facts")
STATE_NAME = re.compile(r"^(?:federal|[a-z]{2})$")  # `federal` or a state's two-letter code in lowercase
FEDERAL_STATE, FEDERAL_NAME = "federal", "Federal default"  # the federal file's state and its name
STATE_SHAPE = '{"state": ..., "name": ..., "facts": [...]}'
FACT_KEYS = ("row", "setting", "value", "status", "citation", "sources", "checked")
FACT_SOURCE_KEYS = ("source", "url", "tier", "source_date")
STATUSES = ("known", "inferred", "not published")
NOTE_STATUSES = ("inferred", "not published")
NOT_PUBLISHED = "not published"
NOT_STATED = "not stated"
WARNING_TIERS = ("state agency page", "secondary")
RULE_DATE = "2026-06-03"

# The pairs of rows a state chooses between, as decision record 0006 names them, each pair's first row in the
# extract's order first, each row beside the words that say which of the two the state takes. A later topic that
# writes such a choice adds its pair; the checker fails, at CHOICE_PAIRS_FILE, a pair whose two rows are one, a row
# in two pairs, and a pair the extract holds only one row of or holds second row first. A state's choice is one
# fact, on the pair's first row, and only that fact holds CHOICE_KEY, whose value is one of its pair's identifiers
# or one of CHOICE_WORDS. NOT_PUBLISHED_KEYS are the keys but status that may be `not published`; each so written,
# like a choice of `not applicable`, needs a note.
CHOICE_PAIRS_FILE = "scripts/corpus_check/constants.py"
CHOICE_PAIRS = (
    (("renewal-notice-with-renewal-form", "sends the notice with the renewal form"),
     ("renewal-notice-after-renewal-form-period", "sends the notice after the renewal form")),
    (("more-frequent-check-notice-after-data-check", "sends the notice straight after its data check"),
     ("more-frequent-check-notice-after-information-request", "asks for information before sending the notice")),
    (("reschedule-2027-renewals-to-six-months", "moves renewals already scheduled in 2027 earlier"),
     ("keep-scheduled-2027-renewals", "keeps renewals already scheduled in 2027 where they are")),
)
CHOICE_KEY = "choice"
NOT_APPLICABLE = "not applicable"
CHOICE_WORDS = (NOT_PUBLISHED, NOT_APPLICABLE)
NOT_PUBLISHED_KEYS = ("value", CHOICE_KEY, "counts_from")

# The skill: its main file, SKILL, and a topic file for each topic, REFERENCES/<name>.md, each linked from
# TOPICS_HEADING in SKILL by a list item that starts with TOPIC_LINK. Every list item in a topic file is a rule item,
# sits under a ## heading, and ends with `[identifier] citation`; a number is a run of digits with any comma or
# decimal point inside; anywhere in the skill, a bracketed word shaped like an identifier and not followed by `(` must
# name a row.
SKILL_FOLDER = ".kiro/skills/medicaid-community-engagement/"
REFERENCES = SKILL_FOLDER + "references/"
SKILL_MAX_LINES = 500  # for the main file and for each topic file
SKILL_DESCRIPTION_MAX = 1024  # characters, the limit the Agent Skills specification sets
TOPICS_HEADING = "## Topics"
SKILL_HEADINGS = (TOPICS_HEADING, "## Precedence", "## Watch list")  # each exactly once, written exactly so
TOPIC_LINK = re.compile(r"^\[[^\]]+\]\((references/[^)\s]*)\)")  # its target relative to SKILL_FOLDER
TOPIC_NAME = re.compile(r"^references/[a-z0-9]+(?:-[a-z0-9]+)*\.md$")
TOPIC_TITLE = re.compile(r"^# \S")
FRONTMATTER_KEY = re.compile(r"^([A-Za-z_-]+):(.*)$")
LIST_ITEM = re.compile(r"^\s*(?:[-*+]|\d+[.)])\s+")
SKILL_ITEM_END = re.compile(r"^(.*)\[([a-z0-9]+(?:-[a-z0-9]+)*)\] (\S.*)$")
BRACKETED = re.compile(r"\[([a-z0-9]+(?:-[a-z0-9]+)*)\](?!\()")
NUMBER = re.compile(r"\d+(?:[.,]\d+)*")
# A number in parentheses straight after a letter, a digit or a closing parenthesis, as in (c)(4) or 1902(e)(14), is
# part of a citation and is no number for that check, in the Rule or in the skill item. One after a space, as in
# "sixty (60)", still counts.
CITATION_PARAGRAPH = re.compile(r"(?<=[A-Za-z0-9)])\(\d+\)")
# A fenced code block opens with three or more backticks or tildes, indented at most three spaces, and closes with a
# line of the same character, at least as many, and nothing else. A line inside one is neither a heading nor a rule
# item.
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})")

# An open question's fields: the required ones in the order they must come, Source repeating, then an optional Note
# last. Why it is open starts with one or more of OPEN_REASONS, separated by semicolons, before its first full stop.
# A question whose part moved to the state facts holds MOVED_FIELD alone, in MOVED's form, and none of the others.
MOVED_FIELD = "Moved"
QUESTION_FIELDS = ("Why it is open", "Who can answer", "Raised", "Source", "Note", MOVED_FIELD)
QUESTION_REQUIRED_FIELDS = QUESTION_FIELDS[:4]
MOVED = re.compile(r"^(\d{4}-\d{2}-\d{2}), to the state fact ((?:federal|[a-z]{2}): [a-z0-9]+(?:-[a-z0-9]+)*)\.$")
MOVED_FORM = "YYYY-MM-DD, to the state fact <state>: <row>."
# A state fact named in a Moved line or in Why it is open, by its name `<state>: <row>`, which must exist. "The" may
# open a sentence, and the name may stand in backticks, as the review page prints a moved question's fact.
STATE_FACT_NAME = re.compile(r"\b[Tt]he state fact `?((?:federal|[a-z]{2}): [a-z0-9]+(?:-[a-z0-9]+)*)")
OPEN_REASONS = (
    "the sources conflict", "the sources are silent", "it turns on a choice the state has not published",
    "the answer may be in a provision the corpus has not stored",
)

HEADING = re.compile(r"^(#+) (.*)$")
IDENTIFIER = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
FIELD = re.compile(r"^- ([A-Za-z][A-Za-z ]*):(?: (.*))?$")
