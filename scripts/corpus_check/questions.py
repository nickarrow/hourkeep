"""The open questions, docs/domain/open-questions.md: each question is a ### heading followed by a list holding, in
order, Why it is open, Who can answer, Raised, one or more Sources, and optionally a Note last. Why it is open starts
with one or more of the four reasons, separated by semicolons. Whether a Source quotes words on its line is not
checked here yet."""

from __future__ import annotations

from pathlib import Path
from typing import List, Optional

from .constants import FIELD, HEADING, OPEN_QUESTIONS, OPEN_REASONS, QUESTION_FIELDS, QUESTION_REQUIRED_FIELDS
from .files import read_listed, split_lines
from .report import Problem
from .rows import Field


class Question:
    """A ### section of the open questions. Its heading is its title."""

    def __init__(self, title: str, line: int) -> None:
        self.title = title
        self.line = line
        self.fields: List[Field] = []


def problem(problems: List[Problem], line: int, message: str) -> None:
    problems.append(Problem(OPEN_QUESTIONS, line, message))


def parse_questions(lines: List[bytes], problems: List[Problem]) -> List[Question]:
    """The questions, reporting every problem with where their fields may go. Prose may stand before the first."""
    questions: List[Question] = []
    # Where the reader is: "prose" outside any question, "heading" after a ### heading and before its first field,
    # "fields" inside its list, "after" past a blank line that follows the list.
    place = "prose"
    for number, raw in enumerate(lines, start=1):
        try:
            line = raw.decode("utf-8")
        except UnicodeDecodeError:
            problem(problems, number, "the line is not UTF-8")
            continue
        heading = HEADING.match(line)
        if line.strip() == "":
            if place == "fields":
                place = "after"
        elif heading:
            if heading.group(1) == "###":
                questions.append(Question(heading.group(2).strip(), number))
                place = "heading"
            else:
                place = "prose"
        elif place == "prose":
            continue
        elif line.startswith("- "):
            if place == "after":
                problem(problems, number, "a blank line inside a question; its list has no blank lines")
            read_field(questions[-1], line, number, problems)
            place = "fields"
        elif place == "fields" and line.startswith("  ") and not line.startswith("   "):
            if line[2:].startswith("- "):
                problem(problems, number, "a continuation line never begins with '- '")
            elif questions[-1].fields:
                field = questions[-1].fields[-1]
                field.value = (field.value + " " + line[2:].strip()).strip()
        elif place == "fields":
            problem(problems, number, "a continuation line is indented two spaces")
        elif place == "after":
            problem(problems, number, "only blank lines and headings come between questions")
        else:
            problem(problems, number, "{!r} is not a field: a field is '- Name: value'".format(line))
    for question in questions:
        check_question_fields(question, problems)
    return questions


def read_field(question: Question, line: str, number: int, problems: List[Problem]) -> None:
    match = FIELD.match(line)
    if match is None:
        problem(problems, number, "{!r} is not a field: a field is '- Name: value'".format(line))
        return
    name, value = match.group(1), (match.group(2) or "").strip()
    if name not in QUESTION_FIELDS:
        problem(problems, number, "{} is not a field of an open question; they are {}".format(
            name, ", ".join(QUESTION_FIELDS)))
        return
    question.fields.append(Field(name, value, number))


def check_question_fields(question: Question, problems: List[Problem]) -> None:
    """The fields in the listed order, each once except Source, which repeats in a run; Note, if any, last."""
    order = "the fields go {}, then an optional Note".format(", ".join(QUESTION_REQUIRED_FIELDS))
    position = -1
    previous = ""
    present = set()
    for field in question.fields:
        index = QUESTION_FIELDS.index(field.name)
        if field.value == "":
            problem(problems, field.line, "{} is empty, which counts as missing".format(field.name))
        if index < position:
            problem(problems, field.line, "{} is out of order; {}".format(field.name, order))
        elif field.name in present and not (field.name == "Source" and previous == "Source"):
            problem(problems, field.line, "{} appears more than once in {!r}".format(field.name, question.title))
        else:
            position = index
        if field.name == "Why it is open" and field.value != "":
            reason = reasons_problem(field.value)
            if reason is not None:
                problem(problems, field.line, reason)
        if field.value != "":
            present.add(field.name)
        previous = field.name
    for name in QUESTION_REQUIRED_FIELDS:
        if name not in present:
            problem(problems, question.line, "{!r} lacks the {} field".format(question.title, name))


def open_reasons(value: str) -> List[str]:
    """The reasons a Why it is open value starts with: the words before its first full stop, separated by
    semicolons, each stripped. Whether each is one of OPEN_REASONS is reasons_problem's to say."""
    return [reason.strip() for reason in value.split(".", 1)[0].split(";")]


def reasons_problem(value: str) -> Optional[str]:
    """Why a Why it is open value does not start with the reasons, or None."""
    for reason in open_reasons(value):
        if reason not in OPEN_REASONS:
            return "Why it is open starts with one or more of {}, separated by semicolons; {!r} is not one".format(
                "; ".join(OPEN_REASONS), reason)
    return None


def check_open_questions(root: Path, files: Optional[List[str]], problems: List[Problem]) -> None:
    data = read_listed(root, OPEN_QUESTIONS, files)
    if data is None:
        problem(problems, 0, "the open questions are missing")
        return
    parse_questions(split_lines(data), problems)
