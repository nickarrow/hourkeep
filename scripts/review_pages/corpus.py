"""Reading what the review pages are made from: the rows of the extract, the skill's topic files in the order its
## Topics links them, the open questions, the state facts and the manifest. Files are read from the disk; whether
they are valid is the checker's work, so a part that cannot be read here is left out rather than reported."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List, NamedTuple, Optional, Tuple

from corpus_check.constants import (
    EXTRACT, FIELD, HEADING, LIST_ITEM, MANIFEST, SKILL, SKILL_FOLDER, SKILL_ITEM_END, STATES_FOLDER,
)
from corpus_check.files import split_lines
from corpus_check.rows import Row, parse_extract
from corpus_check.skill import decoded_lines, fenced_lines, topic_links

from .constants import FEDERAL_STATE, OPEN_QUESTIONS


class Topic(NamedTuple):
    """A topic file: its name without .md, its title, and its ## groups, each a heading and its rows in order."""
    name: str
    title: str
    groups: List[Tuple[str, List[str]]]


class Question(NamedTuple):
    """An open question: its ### heading and its fields, each name to its value with continuation lines joined."""
    heading: str
    fields: Dict[str, str]


def read_bytes(root: Path, path: str) -> Optional[bytes]:
    try:
        return (root / path).read_bytes()
    except OSError:
        return None


def read_rows(root: Path) -> List[Row]:
    data = read_bytes(root, EXTRACT)
    if data is None:
        raise ValueError("the extract, {}, cannot be read".format(EXTRACT))
    return parse_extract(split_lines(data), [])


def read_topic(name: str, data: bytes) -> Topic:
    """A topic file's title and its ## groups, each holding the identifiers of its rule items in order. A line in a
    fenced code block is neither a heading nor part of an item, as the checker reads it."""
    lines = decoded_lines(data)
    title = lines[0][2:].strip() if lines and lines[0].startswith("# ") else name
    groups: List[Tuple[str, List[str]]] = []
    items: List[Tuple[int, List[str]]] = []  # the group each list item sits in, and its lines
    item: Optional[List[str]] = None
    for line, fenced in zip(lines, fenced_lines(lines)):
        heading = None if fenced else HEADING.match(line)
        if fenced or heading:
            item = None
            if heading and len(heading.group(1)) == 2:
                groups.append((heading.group(2).strip(), []))
        elif LIST_ITEM.match(line):
            item = [LIST_ITEM.sub("", line, count=1).strip()]
            if groups:
                items.append((len(groups) - 1, item))
        elif item is not None and line.startswith("  ") and line.strip():
            item.append(line.strip())
        else:
            item = None
    for group, parts in items:
        match = SKILL_ITEM_END.match(" ".join(parts))
        if match:
            groups[group][1].append(match.group(2))
    return Topic(name, title, groups)


def read_topics(root: Path) -> List[Topic]:
    """The topic files the skill's ## Topics links, in its order. An absent skill has none."""
    data = read_bytes(root, SKILL)
    if data is None:
        return []
    lines = decoded_lines(data)
    topics: List[Topic] = []
    for target, _ in topic_links(lines, fenced_lines(lines), []):
        topic_data = read_bytes(root, SKILL_FOLDER + target)
        if topic_data is not None:
            topics.append(read_topic(Path(target).stem, topic_data))
    return topics


def read_questions(root: Path) -> List[Question]:
    """Each ### question of the open questions file with its list of fields. A field name that repeats, as Source
    does, keeps its first value; the pages show none of those."""
    data = read_bytes(root, OPEN_QUESTIONS)
    if data is None:
        return []
    questions: List[Question] = []
    field: Optional[str] = None  # the field whose value continuation lines extend, if it is the first of its name
    for line in decoded_lines(data):
        heading = HEADING.match(line)
        match = None if heading else FIELD.match(line)
        if heading:
            field = None
            if heading.group(1) == "###":
                questions.append(Question(heading.group(2).strip(), {}))
        elif match and questions:
            field = None if match.group(1) in questions[-1].fields else match.group(1)
            questions[-1].fields.setdefault(match.group(1), (match.group(2) or "").strip())
        elif field is not None and line.startswith("  ") and line.strip():
            questions[-1].fields[field] = (questions[-1].fields[field] + " " + line.strip()).strip()
        else:
            field = None
    return questions


def read_states(root: Path) -> List[dict]:
    """Each state file directly in states/ that reads as a JSON object, the federal default first, then by state."""
    states: List[dict] = []
    try:
        paths = sorted(path for path in (root / STATES_FOLDER).iterdir() if path.suffix == ".json" and path.is_file())
    except OSError:
        paths = []
    for path in paths:
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        if isinstance(data, dict) and isinstance(data.get("facts"), list):
            states.append(data)
    return sorted(states, key=lambda state: (state.get("state") != FEDERAL_STATE, str(state.get("state"))))


def read_manifest(root: Path) -> dict:
    data = read_bytes(root, MANIFEST)
    try:
        manifest = json.loads(data.decode("utf-8")) if data is not None else {}
    except ValueError:
        manifest = {}
    return manifest if isinstance(manifest, dict) else {}
