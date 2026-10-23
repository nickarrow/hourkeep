"""The state facts, every docs/domain/states/*.json git lists, federal.json and co.json required: each
file's name and shape, each fact's keys and values, its row, at most one fact per row in a file, a choice between the
two rows of a pair, the keys that may be `not published`, its checked value in a row's Verified vocabulary less `no`,
its citation and each of its sources. And CHOICE_PAIRS, the pairs, against the extract's rows."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Set, Tuple

from .constants import (
    ADDRESS, CHOICE_KEY, CHOICE_PAIRS, CHOICE_PAIRS_FILE, CHOICE_WORDS, FACT_KEYS, FACT_SOURCE_KEYS, FEDERAL_NAME,
    FEDERAL_STATE, NOTE_STATUSES, NOT_APPLICABLE, NOT_PUBLISHED, NOT_PUBLISHED_KEYS, NOT_STATED, RULE_DATE,
    STATES_FOLDER, STATE_FILES, STATE_KEYS, STATE_NAME, STATE_SHAPE, STATUSES, TIERS, VERIFIED, WARNING_TIERS,
)
from .dates import is_date
from .files import entry_lines, read_listed
from .report import Counts, Problem
from .rows import Row, citation_problem
from .sources import manifest_paths, source_problem


def is_missing(value: object) -> bool:
    """An empty string or an empty list counts as missing."""
    return value == "" or value == []


def fact_source_problems(root: Path, source: object, listed: Set[str]) -> Tuple[List[str], List[str]]:
    """Why one of a fact's sources is malformed, and whether it warns that it may predate the rule."""
    if not isinstance(source, dict):
        return ["a source is a JSON object"], []
    reasons, warnings = [], []
    for key in FACT_SOURCE_KEYS:
        if is_missing(source.get(key, "")):
            reasons.append("a source lacks {}".format(key))
        elif not isinstance(source[key], str):
            reasons.append("a source's {} is a string".format(key))
    value, url, tier, date = (source.get(key) for key in FACT_SOURCE_KEYS)
    if isinstance(url, str) and url and not ADDRESS.match(url):
        reasons.append("a source's url {!r} is not an http:// or https:// address".format(url))
    if isinstance(value, str) and value:
        reason = source_problem(root, value, listed)
        if reason is not None:
            reasons.append("Source: {}".format(reason))
    if isinstance(tier, str) and tier and tier not in TIERS:
        reasons.append("a source's tier {!r} is not one of the tiers: {}".format(tier, ", ".join(TIERS)))
    if isinstance(date, str) and date and date != NOT_STATED and not is_date(date):
        reasons.append("a source's source_date {!r} is not YYYY-MM-DD or 'not stated'".format(date))
    if tier in WARNING_TIERS and (date == NOT_STATED or (isinstance(date, str) and is_date(date) and date < RULE_DATE)):
        warnings.append("the source {} is a {} {}, so the fact may predate the rule".format(
            value, tier, "whose date is not stated" if date == NOT_STATED else "dated " + date))
    return reasons, warnings


# Each pair's first row, with the two identifiers its choice may name, and each pair's second row, with its first.
FIRST_ROWS = {first[0]: (first[0], second[0]) for first, second in CHOICE_PAIRS}
SECOND_ROWS = {second[0]: first[0] for first, second in CHOICE_PAIRS}


def choice_pair_problems(pairs: Sequence[Tuple[Tuple[str, str], Tuple[str, str]]],
                         identifiers: List[str]) -> List[str]:
    """Why `pairs`, shaped as CHOICE_PAIRS is, break its rules against the extract's row identifiers in their order:
    a pair's two rows differ; no row is in two pairs; and where the extract holds either row of a pair, it holds both,
    the first before the second."""
    reasons = []
    position: Dict[str, int] = {}
    for index, identifier in enumerate(identifiers):
        position.setdefault(identifier, index)
    paired: Set[str] = set()
    for (first, _), (second, _) in pairs:
        if first == second:
            reasons.append("CHOICE_PAIRS pairs {!r} with itself; a pair's two rows differ".format(first))
        for row in dict.fromkeys((first, second)):
            if row in paired:
                reasons.append("CHOICE_PAIRS has {!r} in more than one pair; a row is in one pair at most".format(row))
            paired.add(row)
        if first == second or (first not in position and second not in position):
            continue
        for row in (first, second):
            if row not in position:
                reasons.append("CHOICE_PAIRS pairs {!r} with {!r}, and the extract holds no row {!r}".format(
                    first, second, row))
        if first in position and second in position and position[second] < position[first]:
            reasons.append("CHOICE_PAIRS puts {!r} first in its pair, and the extract has {!r} before it; a pair's "
                           "first row comes first in the extract".format(first, second))
    return reasons


def fact_row(fact: dict) -> Optional[str]:
    """The row a fact names, or None where its row is not a string."""
    row = fact.get("row")
    return row if isinstance(row, str) else None


def needs_note(fact: dict) -> bool:
    """A fact needs a note when its status is inferred or not published, when value, choice or counts_from is
    written `not published`, or when its choice is `not applicable`."""
    return (fact.get("status") in NOTE_STATUSES or fact.get(CHOICE_KEY) == NOT_APPLICABLE
            or any(fact.get(key) == NOT_PUBLISHED for key in NOT_PUBLISHED_KEYS))


def choice_problems(fact: dict) -> List[str]:
    """Why a fact breaks the rules for a choice between two rows, as decision record 0006 sets them, and for the keys
    that may be `not published`."""
    reasons = []
    row, choice = fact_row(fact), fact.get(CHOICE_KEY)
    if row in SECOND_ROWS:
        reasons.append("the fact names {!r}, the second row of a pair; a state's choice between the two is one fact, "
                       "on the pair's first row, {!r}".format(row, SECOND_ROWS[row]))
    if CHOICE_KEY in fact and row not in FIRST_ROWS:
        if row not in SECOND_ROWS:  # a fact on a second row is reported above, its choice with it
            reasons.append("only a fact on the first row of a pair has choice; {!r} is the first row of no "
                           "pair".format(row))
    elif isinstance(choice, str) and choice and row in FIRST_ROWS:
        allowed = FIRST_ROWS[row] + CHOICE_WORDS
        if choice not in allowed:
            reasons.append("the fact's choice {!r} is not one of {}".format(choice, ", ".join(allowed)))
        if fact.get("status") == NOT_PUBLISHED and choice != NOT_PUBLISHED:
            reasons.append("a fact marked not published has the choice 'not published'")
    for key, value in fact.items():
        if value == NOT_PUBLISHED and key != "status" and key not in NOT_PUBLISHED_KEYS:
            reasons.append("the fact's {} is 'not published'; only {} may be".format(
                key, ", ".join(NOT_PUBLISHED_KEYS)))
    return reasons


def fact_problems(root: Path, fact: object, rows: Set[str], listed: Set[str]) -> Tuple[List[str], List[str]]:
    """Why a state fact is malformed, and the warnings its sources give."""
    if not isinstance(fact, dict):
        return ["a fact is a JSON object"], []
    status = fact.get("status")
    required = list(FACT_KEYS) + (["note"] if needs_note(fact) else [])
    required += [CHOICE_KEY] if fact_row(fact) in FIRST_ROWS else []
    reasons, warnings = [], []
    for key in required + [key for key in fact if key not in required]:
        if key not in fact and key in required or is_missing(fact.get(key)):
            reasons.append("the fact lacks {}".format(key))
        elif key == "sources" and not isinstance(fact[key], list):
            reasons.append("the fact's sources is a list")
        elif key != "sources" and not isinstance(fact[key], str):
            reasons.append("the fact's {} is a string".format(key))
    if isinstance(status, str) and status and status not in STATUSES:
        reasons.append("the fact's status {!r} is not {}".format(status, ", ".join(STATUSES)))
    if status == NOT_PUBLISHED and fact.get("value") != NOT_PUBLISHED:
        reasons.append("a fact marked not published has the value 'not published'")
    reasons += choice_problems(fact)
    row, checked = fact.get("row"), fact.get("checked")
    if isinstance(row, str) and row and row not in rows:
        reasons.append("the fact's row {!r} names no row in the extract".format(row))
    if isinstance(checked, str) and checked:
        match = VERIFIED.match(checked)
        if match is None or not is_date(match.group(1)):
            reasons.append("the fact's checked {!r} is not 'YYYY-MM-DD, read in source' or 'YYYY-MM-DD, ledger "
                           "<finding ID>', optionally followed by ', by <name>', or 'YYYY-MM-DD, expert review, by "
                           "<name>'".format(checked))
    sources = fact.get("sources")
    sources = sources if isinstance(sources, list) else []
    for source in sources:
        source_reasons, source_warnings = fact_source_problems(root, source, listed)
        reasons += source_reasons
        warnings += source_warnings
    citation = fact.get("citation")
    if isinstance(citation, str) and citation:
        first = sources[0] if sources and isinstance(sources[0], dict) else {}
        tier = first.get("tier")
        reason = citation_problem(citation, tier if isinstance(tier, str) else "")
        if reason is not None:
            reasons.append("Citation: {}".format(reason))
    return reasons, warnings


def check_state_file(root: Path, name: str, files: Optional[List[str]], rows: Set[str], listed: Set[str],
                     problems: List[Problem], warnings: List[Problem], counts: Counts) -> Set[str]:
    """One state file: its file name, its shape, its state and name, then each fact, reported on the line where the
    fact opens. Returns the names of its facts, `<state>: <row>`, from the file's state and each fact's row."""
    expected = Path(name).name[:-len(".json")]
    if not STATE_NAME.match(expected):
        problems.append(Problem(name, 0, "a state file is named federal.json or for a state's two-letter code in "
                                "lowercase, such as co.json"))
    data = read_listed(root, name, files)
    if data is None:
        problems.append(Problem(name, 0, "the state file is missing"))
        return set()
    try:
        state = json.loads(data.decode("utf-8"))
    except ValueError:  # UnicodeDecodeError is a ValueError too
        problems.append(Problem(name, 0, "the state file is not JSON, or not UTF-8"))
        return set()
    if not (isinstance(state, dict) and sorted(state) == sorted(STATE_KEYS) and isinstance(state["facts"], list)):
        problems.append(Problem(name, 0, "a state file is an object of three keys: " + STATE_SHAPE))
        return set()
    for key in STATE_KEYS:
        if is_missing(state[key]):
            problems.append(Problem(name, 0, "the state file lacks {}".format(key)))
        elif key != "facts" and not isinstance(state[key], str):
            problems.append(Problem(name, 0, "the state file's {} is a string".format(key)))
    if isinstance(state["state"], str) and state["state"] and state["state"] != expected:
        problems.append(Problem(name, 0, "its state {!r} is not the file name without .json, {!r}".format(
            state["state"], expected)))
    if expected == FEDERAL_STATE and isinstance(state["name"], str) and state["name"] \
            and state["name"] != FEDERAL_NAME:
        problems.append(Problem(name, 0, "the federal file's name {!r} is not {!r}".format(
            state["name"], FEDERAL_NAME)))
    lines = entry_lines(data)
    seen: Dict[str, int] = {}  # each row a fact names, and the line of the first fact on it
    for index, fact in enumerate(state["facts"]):
        line = lines[index] if index < len(lines) else 0
        counts.state_facts += 1
        if isinstance(fact, dict) and fact.get("status") == NOT_PUBLISHED:
            counts.not_published += 1
        reasons, fact_warnings = fact_problems(root, fact, rows, listed)
        row = fact_row(fact) if isinstance(fact, dict) else None
        if row and row in seen:
            reasons.append("a state file holds at most one fact per row; {!r} has a fact already, at line {}".format(
                row, seen[row]))
        elif row:
            seen[row] = line
        problems.extend(Problem(name, line, reason) for reason in reasons)
        warnings.extend(Problem(name, line, "warning: " + warning) for warning in fact_warnings)
    state_name = state["state"]
    return {"{}: {}".format(state_name, row) for row in seen} if isinstance(state_name, str) and state_name else set()


def state_files(files: Optional[List[str]]) -> List[str]:
    """The required state files, then every other STATES_FOLDER/*.json git lists, one level down, sorted."""
    others = sorted(path for path in files or [] if path.startswith(STATES_FOLDER) and path.endswith(".json")
                    and "/" not in path[len(STATES_FOLDER):] and path not in STATE_FILES)
    return list(STATE_FILES) + others


def check_state_facts(root: Path, rows: List[Row], files: Optional[List[str]], problems: List[Problem],
                      warnings: List[Problem], counts: Counts) -> Set[str]:
    """Every state file's facts, and their names, `<state>: <row>`, for the open questions that name a fact."""
    identifiers = {row.identifier for row in rows}
    problems.extend(Problem(CHOICE_PAIRS_FILE, 0, reason)
                    for reason in choice_pair_problems(CHOICE_PAIRS, [row.identifier for row in rows]))
    listed = manifest_paths(root, files)
    names: Set[str] = set()
    for name in state_files(files):
        names |= check_state_file(root, name, files, identifiers, listed, problems, warnings, counts)
    counts.warnings = len(warnings)
    return names
