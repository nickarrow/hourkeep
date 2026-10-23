"""The text of each review page but the landing page: one per topic file, the open questions, with the questions
moved to the state facts last, and the state facts, with a choice fact's line for which of its two rows applies."""

from __future__ import annotations

import re
from typing import Dict, List, Sequence

from corpus_check.constants import CHOICE_KEY, CHOICE_PAIRS, MOVED, MOVED_FIELD
from corpus_check.questions import open_reasons
from corpus_check.rows import Row

from . import links
from .constants import (
    CONFLICT_GROUP, CONFLICT_REASON, EXTRACT_FROM_REVIEW, FEDERAL_GROUP, LANDING_PAGE, MOVED_GROUP, MOVED_OPENING,
    NOT_STORED_ADDRESS, OPEN_QUESTIONS_PAGE, QUESTION_GROUPS, STATE_CHOICE_GROUP, STATE_CHOICE_REASON,
    STATE_RULES_GROUP,
)
from .corpus import Question, Topic

IDENTIFIER_WORD = re.compile(r"(?<![a-z0-9-])[a-z0-9]+(?:-[a-z0-9]+)*(?![a-z0-9-])")
OPEN_QUESTION = re.compile(r"\bopen question\b")
GENERATED = ("This page is generated from HourKeep's policy rows and is not edited by hand. "
             "[How to review and comment](" + LANDING_PAGE + ").")
REAL_CASE = "Never post or send anything about a real person's case."
# The three statuses of a state fact, as the Formats define them under "State facts", and the sentence on a part of a
# fact, value, choice or counts_from, written not published, which decision record 0006 allows.
STATUS_DEFINITIONS = [
    "Each fact's status says how its value is known:",
    "",
    "- known: a source states the value.",
    "- inferred: the value is worked out from what a source does say, and its note says from what.",
    "- not published: no source found publishes the value, and its note says where and when the search ran.",
    "",
    "A part of a fact, such as what a period counts from, may be not published while the rest is known.",
    "",
]


def header(title: str) -> List[str]:
    """A page's title, the line saying it is generated, and the line saying not to send a real person's case."""
    return ["# " + title, "", GENERATED, "", REAL_CASE, ""]


def first(row: Row, name: str) -> str:
    values = row.values(name)
    return values[0] if values else ""


def linked_words(text: str, rows: Dict[str, Row], pages: Dict[str, str]) -> str:
    """`text` with every whole word that is a row's identifier linked to its row, and its first 'open question'
    linked to the open questions page."""
    text = IDENTIFIER_WORD.sub(lambda match: row_link(match.group(0), pages) if match.group(0) in rows
                               else match.group(0), text)
    return OPEN_QUESTION.sub("[open question](" + OPEN_QUESTIONS_PAGE + ")", text, count=1)


def not_stored_lines(row: Row) -> List[str]:
    """A line giving the address of each Source of the row that is not stored yet, linked."""
    addresses = [match.group(1) for match in map(NOT_STORED_ADDRESS.match, row.values("Source")) if match]
    return ["- Source, not stored yet: [{0}]({0})".format(address) for address in addresses]


def row_section(row: Row, manifest: dict, rows: Dict[str, Row], pages: Dict[str, str]) -> List[str]:
    identifier = row.identifier
    return [
        "### " + identifier,
        "",
        "- The rule: " + first(row, "Rule"),
        "- From: " + links.cite(first(row, "Citation"), manifest),
    ] + not_stored_lines(row) + links.state_choice(
        first(row, "State election"), lambda text: linked_words(text, rows, pages)) + [
        "- If this row were wrong: " + links.if_wrong(first(row, "Error direction")),
        "- Checked: " + links.checked(first(row, "Verified")),
        "- Comment: " + links.comment_links(identifier),
        "- Full row, with its sources and notes: [{0} in the rule extract]({1}#{0})".format(identifier,
                                                                                         EXTRACT_FROM_REVIEW),
        "",
    ]


def start_here_section(topic: Topic, start_here: Sequence[str]) -> List[str]:
    """Start here: each group of the topic file holding a start-here row, by its heading, and under it those rows,
    each linked by its name in words, all in the topic file's order. It adds no heading but its own."""
    lines = ["## Start here", ""]
    for heading, identifiers in topic.groups:
        chosen = [identifier for identifier in identifiers if identifier in start_here]
        if chosen:
            lines.append("- " + heading + ":")
            lines += ["  - [{}](#{})".format(identifier.replace("-", " "), identifier) for identifier in chosen]
    return lines + [""]


def topic_page(topic: Topic, rows: Dict[str, Row], start_here: Sequence[str], manifest: dict,
               pages: Dict[str, str], orientation: str = "") -> str:
    """A topic page: its header, its orientation if it has one, Start here if it has start-here rows, then each
    group of the topic file with its rows."""
    in_topic = [identifier for _, identifiers in topic.groups for identifier in identifiers]
    missing = [identifier for identifier in start_here if identifier not in in_topic]
    if missing:
        raise ValueError("start-here rows not in the topic file {}.md: {}".format(topic.name, ", ".join(missing)))
    lines = header(topic.title)
    if orientation:
        lines += [linked_words(orientation, rows, pages), ""]
    if start_here:
        lines += start_here_section(topic, start_here)
    for heading, identifiers in topic.groups:
        lines += ["## " + heading, ""]
        for identifier in identifiers:
            if identifier in rows:
                lines += row_section(rows[identifier], manifest, rows, pages)
    return "\n".join(lines)


def row_link(identifier: str, pages: Dict[str, str]) -> str:
    """A link to a row on its topic page, or to the extract when no topic page holds it."""
    page = pages.get(identifier)
    target = page + ".md#" + identifier if page else EXTRACT_FROM_REVIEW + "#" + identifier
    return "[{}]({})".format(identifier, target)


def question_group(question: Question) -> str:
    """The group a question goes in: the moved questions if it holds Moved, else the conflicts if a source
    conflicts, else a state's choice if it turns on one, else the federal rule if CMS is named first to answer it,
    else a state's own rules. Its reasons are read as the checker reads them."""
    if MOVED_FIELD in question.fields:
        return MOVED_GROUP
    reasons = open_reasons(question.fields.get("Why it is open", ""))
    if CONFLICT_REASON in reasons:
        return CONFLICT_GROUP
    if STATE_CHOICE_REASON in reasons:
        return STATE_CHOICE_GROUP
    if question.fields.get("Who can answer", "").startswith("CMS"):
        return FEDERAL_GROUP
    return STATE_RULES_GROUP


def question_section(question: Question, rows: Dict[str, Row], pages: Dict[str, str]) -> List[str]:
    held_up: List[str] = []
    for word in IDENTIFIER_WORD.findall(question.fields.get("Raised", "")):
        if word in rows and word not in held_up:
            held_up.append(word)
    return [
        "### " + question.heading,
        "",
        "- Why it is open: " + links.cite_in_text(question.fields.get("Why it is open", "")),
        "- Who can answer: " + links.cite_in_text(question.fields.get("Who can answer", "")),
        "- Rows it holds up: " + ", ".join(row_link(identifier, pages) for identifier in held_up),
        "- Comment: " + links.comment_links(question.heading),
        "",
    ]


def moved_section(question: Question) -> List[str]:
    """A question whose part moved to the state facts: its old title, the date and the fact's name as text, and the
    comment links carrying the fact's name. A Moved value not in the checker's form is shown as it is, and its
    comment links carry the title."""
    value = question.fields[MOVED_FIELD]
    match = MOVED.match(value)
    if match is None:
        return ["### " + question.heading, "", "- Moved: " + value,
                "- Comment: " + links.comment_links(question.heading), ""]
    date, name = match.groups()
    return ["### " + question.heading, "", "- Moved on {} to the state fact `{}`".format(date, name),
            "- Comment: " + links.comment_links(name), ""]


def questions_page(questions: List[Question], rows: Dict[str, Row], pages: Dict[str, str]) -> str:
    """The open questions under the groups of QUESTION_GROUPS, in its order, each group in the file's order; a group
    with no question is left out. The opening paragraph names the moved group when it is there."""
    opening = ("Each is a policy question only CMS, a state or a policy person can answer, and the rows it names "
               "wait on the answer. They are grouped by why they are open, with conflicts first, since each of "
               "those has two sources that say different things.")
    if any(question_group(question) == MOVED_GROUP for question in questions):
        opening += " " + MOVED_OPENING
    lines = header("Open questions") + [opening, ""]
    for group, sentence in QUESTION_GROUPS:
        in_group = [question for question in questions if question_group(question) == group]
        if in_group:
            lines += ["## " + group, "", sentence, ""]
            for question in in_group:
                lines += (moved_section(question) if group == MOVED_GROUP
                          else question_section(question, rows, pages))
    return "\n".join(lines)


def choice_line(row: str, choice: str, pages: Dict[str, str]) -> str:
    """A choice fact's line: both rows of the pair whose first row is `row`, each in words with a link to it, then
    the state's choice, in words, or the choice word, not published or not applicable. A choice outside those is
    shown as it is, and so is the choice of a fact on a row that begins no pair; the checker reports both."""
    pair = next((pair for pair in CHOICE_PAIRS if pair[0][0] == row), None)
    if pair is None:
        return "- Which of the two rows: " + choice
    both = ", or ".join("the state {}, {}".format(words, row_link(identifier, pages)) for identifier, words in pair)
    words = dict(pair).get(choice)
    taken = choice if words is None else "the state " + words
    return "- Which of the two rows: {}. The state's choice: {}.".format(both, taken)


def fact_section(state: dict, fact: dict, pages: Dict[str, str], manifest: dict) -> List[str]:
    row = str(fact.get("row", ""))
    lines = ["### " + row, "", "- The row: " + row_link(row, pages)]
    for label, key in (("Where it applies", "setting"), ("The value", "value"), ("Counts from", "counts_from"),
                       ("Status", "status")):
        if fact.get(key):
            lines.append("- {}: {}".format(label, fact[key]))
        if key == "value" and fact.get(CHOICE_KEY):
            lines.append(choice_line(row, str(fact[CHOICE_KEY]), pages))
    lines.append("- From: " + links.cite(str(fact.get("citation", "")), manifest))
    lines.append("- Checked: " + links.checked(str(fact.get("checked", ""))))
    name = "{}: {}".format(state.get("state", ""), row)
    lines += ["- Name to give in a comment: `" + name + "`", "- Comment: " + links.comment_links(name), ""]
    if fact.get("note"):
        # The note, folded after the fact's list; the blank line before <details> ends the list.
        lines += ["<details>", "<summary>Notes for checking</summary>", "", str(fact["note"]), "", "</details>", ""]
    return lines


def state_facts_page(states: List[dict], pages: Dict[str, str], manifest: dict) -> str:
    lines = header("State facts") + [
        "Each fact is a value one row depends on, as the federal default or one state sets it, with where it applies "
        "and where it comes from.", ""] + STATUS_DEFINITIONS
    for state in states:
        lines += ["## " + str(state.get("name", state.get("state", ""))), ""]
        for fact in state["facts"]:
            if isinstance(fact, dict):
                lines += fact_section(state, fact, pages, manifest)
    return "\n".join(lines)
