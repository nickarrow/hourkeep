"""The state facts, every docs/domain/states/*.json git lists, federal.json and co.json required: each
file's name and shape, each fact's keys and values, its row, its citation and each of its sources."""

from __future__ import annotations

import json
from pathlib import Path
from typing import List, Optional, Set, Tuple

from .constants import (
    ADDRESS, FACT_KEYS, FACT_SOURCE_KEYS, FEDERAL_NAME, FEDERAL_STATE, NOTE_STATUSES, NOT_PUBLISHED, NOT_STATED,
    RULE_DATE, STATES_FOLDER, STATE_FILES, STATE_KEYS, STATE_NAME, STATE_SHAPE, STATUSES, TIERS, WARNING_TIERS,
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


def fact_problems(root: Path, fact: object, rows: Set[str], listed: Set[str]) -> Tuple[List[str], List[str]]:
    """Why a state fact is malformed, and the warnings its sources give."""
    if not isinstance(fact, dict):
        return ["a fact is a JSON object"], []
    status = fact.get("status")
    required = list(FACT_KEYS) + (["note"] if status in NOTE_STATUSES else [])
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
    row, checked = fact.get("row"), fact.get("checked")
    if isinstance(row, str) and row and row not in rows:
        reasons.append("the fact's row {!r} names no row in the extract".format(row))
    if isinstance(checked, str) and checked and not is_date(checked):
        reasons.append("the fact's checked {!r} is not YYYY-MM-DD".format(checked))
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
                     problems: List[Problem], warnings: List[Problem], counts: Counts) -> None:
    """One state file: its file name, its shape, its state and name, then each fact, reported on the line where the
    fact opens."""
    expected = Path(name).name[:-len(".json")]
    if not STATE_NAME.match(expected):
        problems.append(Problem(name, 0, "a state file is named federal.json or for a state's two-letter code in "
                                "lowercase, such as co.json"))
    data = read_listed(root, name, files)
    if data is None:
        problems.append(Problem(name, 0, "the state file is missing"))
        return
    try:
        state = json.loads(data.decode("utf-8"))
    except ValueError:  # UnicodeDecodeError is a ValueError too
        problems.append(Problem(name, 0, "the state file is not JSON, or not UTF-8"))
        return
    if not (isinstance(state, dict) and sorted(state) == sorted(STATE_KEYS) and isinstance(state["facts"], list)):
        problems.append(Problem(name, 0, "a state file is an object of three keys: " + STATE_SHAPE))
        return
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
    for index, fact in enumerate(state["facts"]):
        line = lines[index] if index < len(lines) else 0
        counts.state_facts += 1
        if isinstance(fact, dict) and fact.get("status") == NOT_PUBLISHED:
            counts.not_published += 1
        reasons, fact_warnings = fact_problems(root, fact, rows, listed)
        problems.extend(Problem(name, line, reason) for reason in reasons)
        warnings.extend(Problem(name, line, "warning: " + warning) for warning in fact_warnings)


def state_files(files: Optional[List[str]]) -> List[str]:
    """The required state files, then every other STATES_FOLDER/*.json git lists, one level down, sorted."""
    others = sorted(path for path in files or [] if path.startswith(STATES_FOLDER) and path.endswith(".json")
                    and "/" not in path[len(STATES_FOLDER):] and path not in STATE_FILES)
    return list(STATE_FILES) + others


def check_state_facts(root: Path, rows: List[Row], files: Optional[List[str]], problems: List[Problem],
                      warnings: List[Problem], counts: Counts) -> None:
    identifiers = {row.identifier for row in rows}
    listed = manifest_paths(root, files)
    for name in state_files(files):
        check_state_file(root, name, files, identifiers, listed, problems, warnings, counts)
    counts.warnings = len(warnings)
