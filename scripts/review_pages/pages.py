"""The text of each review page but the landing page: one per topic file, the open questions and the state facts."""

from __future__ import annotations

import re
from typing import Dict, List, Sequence

from corpus_check.questions import open_reasons
from corpus_check.rows import Row

from . import links
from .constants import (
    CONFLICT_GROUP, CONFLICT_REASON, EXTRACT_FROM_REVIEW, FEDERAL_GROUP, LANDING_PAGE, OPEN_QUESTIONS_PAGE,
    QUESTION_GROUPS, STATE_CHOICE_GROUP, STATE_CHOICE_REASON, STATE_RULES_GROUP,
)
from .corpus import Question, Topic

IDENTIFIER_WORD = re.compile(r"(?<![a-z0-9-])[a-z0-9]+(?:-[a-z0-9]+)*(?![a-z0-9-])")
OPEN_QUESTION = re.compile(r"\bopen question\b")
GENERATED = ("This page is generated from HourKeep's policy rows and is not edited by hand. "
             "[How to review and comment](" + LANDING_PAGE + ").")
REAL_CASE = "Never post or send anything about a real person's case."
# The three statuses of a state fact, as the Formats define them under "State facts".
STATUS_DEFINITIONS = [
    "Each fact's status says how its value is known:",
    "",
    "- known: a source states the value.",
    "- inferred: the value is worked out from what a source does say, and its note says from what.",
    "- not published: no source found publishes the value, and its note says where and when the search ran.",
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


def row_section(row: Row, manifest: dict, rows: Dict[str, Row], pages: Dict[str, str]) -> List[str]:
    identifier = row.identifier
    return [
        "### " + identifier,
        "",
        "- The rule: " + first(row, "Rule"),
        "- From: " + links.cite(first(row, "Citation"), manifest),
    ] + links.state_choice(first(row, "State election"), lambda text: linked_words(text, rows, pages)) + [
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
               pages: Dict[str, str]) -> str:
    in_topic = [identifier for _, identifiers in topic.groups for identifier in identifiers]
    missing = [identifier for identifier in start_here if identifier not in in_topic]
    if missing:
        raise ValueError("start-here rows not in the topic file {}.md: {}".format(topic.name, ", ".join(missing)))
    lines = header(topic.title)
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
    """The group a question goes in: the conflicts if a source conflicts, else a state's choice if it turns on one,
    else the federal rule if CMS is named first to answer it, else a state's own rules. Its reasons are read as the
    checker reads them."""
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


def questions_page(questions: List[Question], rows: Dict[str, Row], pages: Dict[str, str]) -> str:
    """The open questions under the groups of QUESTION_GROUPS, in its order, each group in the file's order; a group
    with no question is left out."""
    lines = header("Open questions") + [
        "Each is a policy question only CMS, a state or a policy person can answer, and the rows it names wait on "
        "the answer. They are grouped by why they are open, with conflicts first, since there two sources say "
        "different things.", ""]
    for group, sentence in QUESTION_GROUPS:
        in_group = [question for question in questions if question_group(question) == group]
        if in_group:
            lines += ["## " + group, "", sentence, ""]
            for question in in_group:
                lines += question_section(question, rows, pages)
    return "\n".join(lines)


def fact_section(state: dict, fact: dict, pages: Dict[str, str], manifest: dict) -> List[str]:
    row = str(fact.get("row", ""))
    lines = ["### " + row, "", "- The row: " + row_link(row, pages)]
    for label, key in (("Where it applies", "setting"), ("The value", "value"), ("Counts from", "counts_from"),
                       ("Status", "status")):
        if fact.get(key):
            lines.append("- {}: {}".format(label, fact[key]))
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
