"""The rows of the extract, docs/domain/community-engagement-extract.md: where prose, topics and rows
may go, each row's fields and their order, each field's value, and each Source."""

from __future__ import annotations

from pathlib import Path
from typing import List, Optional, Tuple

from .constants import (
    CITATION_SEPARATOR, CORRECTED, ERROR_DIRECTIONS, EXTRACT, FIELD, HEADING, IDENTIFIER, NOT_STORED, OPTIONAL_FIELDS,
    PLACEHOLDER, RECHECK_TRIGGERS, REQUIRED_FIELDS, SECTION_NUMBER, SECTION_TIERS, STATE_ELECTION, TIERS, VERIFIED,
)
from .dates import is_date
from .files import read_listed, split_lines
from .report import Counts, Problem
from .sources import manifest_paths, source_problem


class Field:
    """One field of a row: `- Name: value`, its continuation lines joined to the value by single spaces."""

    def __init__(self, name: str, value: str, line: int) -> None:
        self.name = name
        self.value = value
        self.line = line


class Row:
    """A `###` section of the extract. Its heading is its identifier."""

    def __init__(self, identifier: str, line: int) -> None:
        self.identifier = identifier
        self.line = line
        self.fields: List[Field] = []

    def values(self, name: str) -> List[str]:
        return [field.value for field in self.fields if field.name == name]


def problem(problems: List[Problem], line: int, message: str) -> None:
    problems.append(Problem(EXTRACT, line, message))


def parse_extract(lines: List[bytes], problems: List[Problem], topics: Optional[List[str]] = None) -> List[Row]:
    """The rows of the extract, reporting every problem with where prose, topics, rows and fields may go. Each ## topic
    heading's text is appended to `topics` when it is given."""
    rows: List[Row] = []
    seen = {}  # identifier -> line of its heading
    # Where the reader is: "introduction" before the first ## topic, "topic" under a ## heading before any row,
    # "heading" after a ### heading and before its first field, "fields" inside its list, "after" past a blank line.
    place = "introduction"
    introduction = False
    row: Optional[Row] = None
    for number, raw in enumerate(lines, start=1):
        try:
            line = raw.decode("utf-8")
        except UnicodeDecodeError:
            problem(problems, number, "the line is not UTF-8")
            continue
        if number == 1 and not line.startswith("# "):
            problem(problems, 1, "the extract opens with a # title")
            continue
        heading = HEADING.match(line)
        if line.strip() == "":
            if place == "fields":
                place = "after"
        elif heading and heading.group(1) == "##":
            if place == "introduction" and not introduction:
                problem(problems, number, "the extract needs a short introduction before the first ## topic")
            if topics is not None:
                topics.append(heading.group(2).strip())
            place, row = "topic", None
        elif heading and heading.group(1) == "###":
            identifier = heading.group(2)
            if place == "introduction":
                problem(problems, number, "the row {} comes before the first ## topic".format(identifier))
            if not IDENTIFIER.match(identifier):
                problem(problems, number, "{!r} is not an identifier: lowercase letters and digits joined by "
                        "single hyphens".format(identifier))
            elif identifier in seen:
                problem(problems, number, "the identifier {} is used twice; it was first used at line {}".format(
                    identifier, seen[identifier]))
            else:
                seen[identifier] = number
            row = Row(identifier, number)
            rows.append(row)
            place = "heading"
        elif place == "introduction":
            introduction = introduction or number > 1
        elif heading:
            problem(problems, number, "only ## topics and ### rows follow the introduction")
            place, row = "topic", None
        elif place == "topic":
            problem(problems, number, "a ## topic holds only rows; this text is not in one")
        elif place == "after":
            if line.startswith("- ") or line.startswith(" ") or line.startswith("\t"):
                problem(problems, number, "a blank line inside a row; a row's list has no blank lines")
                if line.startswith("- "):
                    read_field(row, line, number, problems)
                    place = "fields"
            else:
                problem(problems, number, "only blank lines and headings come between rows")
        elif line.startswith("- "):
            read_field(row, line, number, problems)
            place = "fields"
        elif place == "fields" and line.startswith("  ") and not line.startswith("   "):
            if line[2:].startswith("- "):
                problem(problems, number, "a continuation line never begins with '- '")
            elif row is not None and row.fields:
                row.fields[-1].value = (row.fields[-1].value + " " + line[2:].strip()).strip()
        elif place == "fields":
            problem(problems, number, "a continuation line is indented two spaces")
        else:
            problem(problems, number, "{!r} is not a field: a field is '- Name: value'".format(line))
    for row in rows:
        check_field_order(row, problems)
        check_field_values(row, problems)
    return rows


def read_field(row: Optional[Row], line: str, number: int, problems: List[Problem]) -> None:
    match = FIELD.match(line)
    if match is None:
        problem(problems, number, "{!r} is not a field: a field is '- Name: value'".format(line))
        return
    name, value = match.group(1), (match.group(2) or "").strip()
    if name not in REQUIRED_FIELDS and name not in OPTIONAL_FIELDS:
        problem(problems, number, "{} is an unlisted field name".format(name))
        return
    if row is not None:
        row.fields.append(Field(name, value, number))


def check_field_order(row: Row, problems: List[Problem]) -> None:
    """Required fields in the listed order, each once except Source; Corrected (repeating) and Note come last."""
    position = -1
    previous = ""
    present = set()
    optional_seen = False
    for field in row.fields:
        if field.value == "":
            problem(problems, field.line, "{} is empty, which counts as missing".format(field.name))
        if field.name in OPTIONAL_FIELDS:
            if field.name == "Note" and field.name in present:
                problem(problems, field.line, "Note appears more than once in {}".format(row.identifier))
            optional_seen = True
        elif optional_seen:
            problem(problems, field.line, "{} follows Corrected or Note, which come last".format(field.name))
        elif field.name in present and not (field.name == "Source" and previous == "Source"):
            problem(problems, field.line, "{} appears more than once in {}".format(field.name, row.identifier))
        elif REQUIRED_FIELDS.index(field.name) < position:
            problem(problems, field.line, "{} is out of order; the fields go {}".format(
                field.name, ", ".join(REQUIRED_FIELDS)))
        else:
            position = REQUIRED_FIELDS.index(field.name)
        if field.value != "":
            present.add(field.name)
        previous = field.name
    for name in REQUIRED_FIELDS:
        if name not in present:
            problem(problems, row.line, "{} lacks the {} field".format(row.identifier, name))


def recheck_problem(value: str) -> Optional[str]:
    """Why a Recheck value is malformed, or None. Triggers are separated by semicolons; each may add `: detail`."""
    for trigger in value.split(";"):
        trigger = trigger.strip()
        if trigger == "":
            return "an empty trigger between semicolons"
        name, colon, detail = trigger.partition(":")
        name = name.strip()
        if colon and detail.strip() == "":
            return "{!r} has a colon but no detail after it".format(trigger)
        if name in RECHECK_TRIGGERS:
            continue
        if name.startswith("date ") and is_date(name[len("date "):]):
            continue
        return "{!r} is not a trigger from the list or 'date YYYY-MM-DD'".format(name)
    return None


def citation_problem(citation: str, tier: str) -> Optional[str]:
    """Why a citation fails for its tier, or None. An empty citation is reported as missing where it is read."""
    if PLACEHOLDER.search(citation):
        return "the citation holds the word TBD or TODO"
    if CITATION_SEPARATOR.search(citation):
        return "a citation's parts are separated by '; ', a semicolon then one space, with no space before it"
    if tier in SECTION_TIERS and not SECTION_NUMBER.search(citation):
        return "a {} citation needs a section number, such as 435.558 or a number after \u00a7, section, " \
               "SSA or U.S.C.".format(tier)
    return None


def check_sources(root: Path, rows: List[Row], files: Optional[List[str]], problems: List[Problem]) -> None:
    listed = manifest_paths(root, files)
    for row in rows:
        for field in row.fields:
            if field.name == "Source" and field.value != "":
                reason = source_problem(root, field.value, listed)
                if reason is not None:
                    problem(problems, field.line, "Source: {}".format(reason))


def check_field_values(row: Row, problems: List[Problem]) -> None:
    """Each value inside its field's vocabulary. Empty values are already reported as missing."""
    for field in row.fields:
        value = field.value
        if value == "":
            continue
        if field.name == "Tier" and value not in TIERS:
            problem(problems, field.line, "Tier {!r} is not one of the tiers: {}".format(value, ", ".join(TIERS)))
        elif field.name == "State election" and value != "no":
            match = STATE_ELECTION.match(value)
            if match is None or match.group(1).strip() == "" or match.group(2).strip() == "":
                problem(problems, field.line, "State election is 'no' or 'yes; the state chooses <what>; where it "
                        "has not chosen, <what applies>'")
        elif field.name == "Verified" and value != "no":
            match = VERIFIED.match(value)
            if match is None or not is_date(match.group(1)):
                problem(problems, field.line, "Verified is 'no' or 'YYYY-MM-DD, read in source' or 'YYYY-MM-DD, "
                        "ledger <finding ID>', optionally followed by ', by <name>', or 'YYYY-MM-DD, expert review, "
                        "by <name>'")
        elif field.name == "Error direction" and value not in ERROR_DIRECTIONS:
            problem(problems, field.line, "Error direction {!r} is not one of {}".format(
                value, ", ".join(ERROR_DIRECTIONS)))
        elif field.name == "Recheck":
            reason = recheck_problem(value)
            if reason is not None:
                problem(problems, field.line, "Recheck: {}".format(reason))
        elif field.name == "Corrected":
            match = CORRECTED.match(value)
            if match is None or not is_date(match.group(1)) or "" in (match.group(2).strip(), match.group(3).strip()):
                problem(problems, field.line, "Corrected is 'YYYY-MM-DD: <what it said>; <why it changed>'")
        elif field.name == "Citation":
            tiers = row.values("Tier")
            reason = citation_problem(value, tiers[0] if tiers else "")
            if reason is not None:
                problem(problems, field.line, "Citation: {}".format(reason))
    verified = row.values("Verified")
    if verified and verified != ["no"]:
        for field in row.fields:
            if field.name == "Source" and field.value.startswith(NOT_STORED):
                problem(problems, field.line, "{} has a source not stored, so it must say Verified: no".format(
                    row.identifier))


def check_extract(root: Path, files: Optional[List[str]], problems: List[Problem],
                  counts: Counts) -> Tuple[List[Row], List[str]]:
    """The rows of the extract, and the text of its ## topic headings, which each topic file's title must be."""
    data = read_listed(root, EXTRACT, files)
    if data is None:
        problem(problems, 0, "the extract is missing")
        return [], []
    lines = split_lines(data)
    if not lines:
        problem(problems, 1, "the extract opens with a # title")
    topics: List[str] = []
    rows = parse_extract(lines, problems, topics)
    check_sources(root, rows, files, problems)
    counts.rows = len(rows)
    counts.unverified_rows = sum(1 for row in rows if row.values("Verified") == ["no"])
    counts.person_verified_rows = sum(1 for row in rows if verified_by_a_person(row))
    return rows, topics


def verified_by_a_person(row: Row) -> bool:
    """True when the row's Verified value names the person who checked it, with `, by <name>`."""
    for value in row.values("Verified"):
        match = VERIFIED.match(value)
        if match is not None and (match.group(2) or match.group(3)):
            return True
    return False
