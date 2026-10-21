"""The skill, .kiro/skills/medicaid-community-engagement/: its main file, SKILL.md, with its frontmatter, length,
headings and links to its topic files; and each topic file in references/, with its title, length, groups, and each
rule item's identifier, citation and numbers."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List, Optional, Tuple

from .constants import (
    BRACKETED, CITATION_PARAGRAPH, EXTRACT, FENCE, FRONTMATTER_KEY, HEADING, LIST_ITEM, NUMBER, REFERENCES, SKILL,
    SKILL_FOLDER, SKILL_HEADINGS, SKILL_ITEM_END, SKILL_MAX_LINES, TOPIC_LINK, TOPIC_NAME, TOPIC_TITLE,
    TOPICS_HEADING,
)
from .files import read_listed, split_lines
from .report import Counts, Problem
from .rows import Row


def skill_frontmatter(lines: List[str], problems: List[Problem]) -> None:
    """The frontmatter between `---` lines: name equal to the skill's folder, and a description that is not empty."""
    if not lines or lines[0].rstrip() != "---":
        problems.append(Problem(SKILL, 0, "the skill has no frontmatter between --- lines"))
        return
    values = {}  # key -> (value, line)
    key = None
    for number, line in enumerate(lines[1:], start=2):
        if line.rstrip() == "---":
            break
        match = FRONTMATTER_KEY.match(line)
        if match:
            key = match.group(1)
            values[key] = (match.group(2).strip(), number)
        elif key is not None and line.startswith(" "):
            values[key] = ((values[key][0] + " " + line.strip()).strip(), values[key][1])
    else:
        problems.append(Problem(SKILL, 0, "the skill's frontmatter has no closing --- line"))
        return
    folder = SKILL.split("/")[-2]
    name, line = values.get("name", ("", 0))
    if name == "":
        problems.append(Problem(SKILL, line, "the skill's frontmatter lacks its name"))
    elif name != folder:
        problems.append(Problem(SKILL, line, "the skill's name {!r} is not its folder's, {!r}".format(name, folder)))
    description, line = values.get("description", ("", 0))
    if description == "":
        problems.append(Problem(SKILL, line, "the skill's frontmatter lacks its description"))


def fenced_lines(lines: List[str]) -> List[bool]:
    """Whether each line is inside a fenced code block, its opening and closing lines included. A fence left open
    runs to the end of the file."""
    inside: List[bool] = []
    fence: Optional[str] = None  # the opening run of backticks or tildes, while a fence is open
    for line in lines:
        match = FENCE.match(line)
        if fence is None:
            fence = match.group(1) if match else None
            inside.append(fence is not None)
            continue
        inside.append(True)
        run = line.strip()
        if match and run == match.group(1) and run[0] == fence[0] and len(run) >= len(fence):
            fence = None
    return inside


def decoded_lines(data: bytes) -> List[str]:
    return [line.decode("utf-8", errors="replace") for line in split_lines(data)]


def check_length(path: str, lines: List[str], problems: List[Problem]) -> None:
    if len(lines) > SKILL_MAX_LINES:
        problems.append(Problem(path, 0, "the file has {} lines, more than {} lines".format(len(lines),
                                                                                          SKILL_MAX_LINES)))


def check_bracketed(path: str, lines: List[str], by_identifier: Dict[str, Row], problems: List[Problem]) -> None:
    """Anywhere in the file, frontmatter and fences included, a bracketed identifier-shaped word must name a row."""
    for number, line in enumerate(lines, start=1):
        for match in BRACKETED.finditer(line):
            if match.group(1) not in by_identifier:
                problems.append(Problem(path, number, "[{}] names no row".format(match.group(1))))


def topic_links(lines: List[str], fenced: List[bool], problems: List[Problem]) -> List[Tuple[str, int]]:
    """Each list item under ## Topics, which must start with a link to its topic file: the link's target, relative to
    the skill's folder, and the item's line. A line in a fenced code block is neither a heading nor an item."""
    links: List[Tuple[str, int]] = []
    in_topics = False
    for number, line in enumerate(lines, start=1):
        if fenced[number - 1]:
            continue
        heading = HEADING.match(line)
        if heading and len(heading.group(1)) <= 2:
            in_topics = line.rstrip() == TOPICS_HEADING
        elif in_topics and LIST_ITEM.match(line):
            match = TOPIC_LINK.match(LIST_ITEM.sub("", line, count=1).strip())
            if match is None:
                problems.append(Problem(SKILL, number, "a list item under {} starts with a link to its topic file, "
                                        "[<title>](references/<name>.md)".format(TOPICS_HEADING)))
            else:
                links.append((match.group(1), number))
    return links


def reference_files(root: Path, files: Optional[List[str]]) -> List[str]:
    """Every .md file directly in references/, as git lists them, or from the disk when git could not list them."""
    if files is not None:
        return sorted(path for path in files if path.startswith(REFERENCES) and path.endswith(".md")
                      and "/" not in path[len(REFERENCES):])
    try:
        return sorted(REFERENCES + entry.name for entry in (root / REFERENCES).iterdir()
                      if entry.name.endswith(".md") and entry.is_file())
    except OSError:
        return []


def topic_rule_items(path: str, lines: List[str], fenced: List[bool],
                     problems: List[Problem]) -> List[Tuple[str, int, bool]]:
    """Each list item in a topic file, its lines joined by single spaces, with its first line and whether a ## group
    heading stands above it; a # heading ends the group, a deeper one does not. A continuation line takes exactly
    two spaces; any other indent is reported. A line in a fenced code block is neither a heading nor part of an
    item."""
    items: List[List] = []
    in_group = False
    item: Optional[List] = None
    for number, line in enumerate(lines, start=1):
        if fenced[number - 1]:
            item = None
            continue
        heading = HEADING.match(line)
        if heading:
            if len(heading.group(1)) <= 2:
                in_group = len(heading.group(1)) == 2
            item = None
        elif LIST_ITEM.match(line):
            item = [LIST_ITEM.sub("", line, count=1).strip(), number, in_group]
            items.append(item)
        elif item is not None and line.strip() and line[:1] in (" ", "\t"):
            if line.startswith("  ") and not line.startswith("   "):
                item[0] = (item[0] + " " + line.strip()).strip()
            else:
                problems.append(Problem(path, number, "a rule item's continuation line is indented exactly two "
                                        "spaces"))
                item = None
        else:
            item = None
    return [(text, first, grouped) for text, first, grouped in items]


def check_rule_item(path: str, text: str, first: int, by_identifier: Dict[str, Row], problems: List[Problem],
                    counts: Counts, found: Dict[str, Tuple[str, int]]) -> None:
    """One rule item. `found` maps each row's identifier to where its first rule item stands; a second one for the
    same row is reported, whatever else is wrong with either."""
    match = SKILL_ITEM_END.match(text)
    if match is None:
        problems.append(Problem(path, first, "a rule item ends with [identifier] citation"))
        return
    before, identifier, citation = match.group(1), match.group(2), match.group(3)
    if identifier in by_identifier:
        if identifier in found:
            problems.append(Problem(path, first, "{} has more than one rule item; the first is at {}:{}".format(
                identifier, *found[identifier])))
        else:
            found[identifier] = (path, first)
    if before.strip() == "":
        problems.append(Problem(path, first, "a rule item has words before its identifier"))
        return
    row = by_identifier.get(identifier)
    if row is None:
        return  # reported where the bracketed identifier stands
    row_citation = (row.values("Citation") or [""])[0]
    matched = True
    if citation != row_citation:
        problems.append(Problem(path, first, "the citation {!r} is not {}'s citation, {!r}".format(
            citation, identifier, row_citation)))
        matched = False
    in_rule = set(NUMBER.findall(CITATION_PARAGRAPH.sub(" ", " ".join(row.values("Rule")))))
    for number in NUMBER.findall(CITATION_PARAGRAPH.sub(" ", before)):
        if number not in in_rule:
            problems.append(Problem(path, first, "the number {} is not in {}'s Rule".format(number, identifier)))
            matched = False
    if matched:
        counts.skill_items += 1


def check_topic_file(path: str, data: bytes, by_identifier: Dict[str, Row], problems: List[Problem],
                     counts: Counts, found: Dict[str, Tuple[str, int]]) -> None:
    lines = decoded_lines(data)
    check_length(path, lines, problems)
    if not lines or not TOPIC_TITLE.match(lines[0]):
        problems.append(Problem(path, 1 if lines else 0, "a topic file's first line is # and its title"))
    check_bracketed(path, lines, by_identifier, problems)
    items = topic_rule_items(path, lines, fenced_lines(lines), problems)
    if not items:
        problems.append(Problem(path, 0, "the topic file holds no rule item"))
    for text, first, grouped in items:
        if not grouped:
            problems.append(Problem(path, first, "a list item in a topic file sits under a ## heading"))
        check_rule_item(path, text, first, by_identifier, problems, counts, found)


def check_skill(root: Path, files: Optional[List[str]], rows: List[Row], problems: List[Problem],
                counts: Counts) -> None:
    data = read_listed(root, SKILL, files)
    if data is None:
        print("{}: the skill is absent, so it was not checked".format(SKILL))
        return
    lines = decoded_lines(data)
    check_length(SKILL, lines, problems)
    skill_frontmatter(lines, problems)
    by_identifier = {row.identifier: row for row in rows}
    check_bracketed(SKILL, lines, by_identifier, problems)
    # A missing, mistyped or repeated heading would switch checks off without a sound, so each fails. A line in a
    # fenced code block is no heading, so a fence cannot stand in for one.
    fenced = fenced_lines(lines)
    stripped = ["" if inside else line.rstrip() for line, inside in zip(lines, fenced)]
    for heading in SKILL_HEADINGS:
        found = [number for number, line in enumerate(stripped, start=1) if line == heading]
        if not found:
            problems.append(Problem(SKILL, 0, "the skill has no {} heading".format(heading)))
        elif len(found) > 1:
            problems.append(Problem(SKILL, found[1], "the skill has {} more than once".format(heading)))
    links = topic_links(lines, fenced, problems)
    if TOPICS_HEADING in stripped and not links:
        problems.append(Problem(SKILL, stripped.index(TOPICS_HEADING) + 1, "{} links no topic file".format(
            TOPICS_HEADING)))
    # Every linked file that exists is checked, and so is every .md file directly in references/, linked or not, so
    # an unlinked topic file is reported and still has its rule items checked and counted.
    topic_files: List[Tuple[str, bytes]] = []
    linked = set()
    for target, number in links:
        path = SKILL_FOLDER + target
        if path in linked:
            problems.append(Problem(SKILL, number, "{} is linked from {} more than once".format(
                target, TOPICS_HEADING)))
            continue
        linked.add(path)
        if not TOPIC_NAME.match(target):
            problems.append(Problem(SKILL, number, "the topic link {} is not references/<name>.md, its name "
                                    "lowercase words joined by hyphens".format(target)))
        topic = read_listed(root, path, files)
        if topic is None:
            problems.append(Problem(SKILL, number, "the topic link {} names no file".format(target)))
        else:
            topic_files.append((path, topic))
    for path in reference_files(root, files):
        if path in linked:
            continue
        problems.append(Problem(path, 0, "the topic file is not linked from {} in {}".format(TOPICS_HEADING, SKILL)))
        topic = read_listed(root, path, files)
        if topic is not None:
            topic_files.append((path, topic))
    # Each row has exactly one rule item across the topic files: a second is reported where it stands, a missing
    # one at the row's heading.
    found: Dict[str, Tuple[str, int]] = {}
    for path, topic in topic_files:
        check_topic_file(path, topic, by_identifier, problems, counts, found)
    for row in rows:
        if row.identifier not in found:
            problems.append(Problem(EXTRACT, row.line, "{} has no rule item in the skill's topic files".format(
                row.identifier)))
