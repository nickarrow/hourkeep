"""The skill, .kiro/skills/medicaid-community-engagement/SKILL.md: its frontmatter, its length, its
headings, and each rule item's topic, identifier, citation and numbers."""

from __future__ import annotations

from pathlib import Path
from typing import List, Optional, Tuple

from .constants import (
    BRACKETED, CITATION_PARAGRAPH, FENCE, FRONTMATTER_KEY, HEADING, LIST_ITEM, NUMBER, RULES_HEADING, SKILL,
    SKILL_HEADINGS, SKILL_ITEM_END, SKILL_MAX_LINES,
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


def skill_rule_items(lines: List[str], fenced: List[bool], problems: List[Problem]) -> List[Tuple[str, int, bool]]:
    """Each list item under ## Rules, its lines joined by single spaces, with its first line and whether a ### topic
    heading stands above it. A continuation line takes exactly two spaces; any other indent is reported. A line in a
    fenced code block, `fenced`, is neither a heading nor part of a rule item."""
    items: List[List] = []
    in_rules = in_topic = False
    item: Optional[List] = None
    for number, line in enumerate(lines, start=1):
        if fenced[number - 1]:
            item = None
            continue
        heading = HEADING.match(line)
        if heading and len(heading.group(1)) <= 2:
            in_rules = line.rstrip() == RULES_HEADING
            in_topic = False
            item = None
        elif not in_rules:
            continue
        elif heading and len(heading.group(1)) == 3:
            in_topic = True
            item = None
        elif LIST_ITEM.match(line):
            item = [LIST_ITEM.sub("", line, count=1).strip(), number, in_topic]
            items.append(item)
        elif item is not None and line.strip() and line[:1] in (" ", "\t"):
            if line.startswith("  ") and not line.startswith("   "):
                item[0] = (item[0] + " " + line.strip()).strip()
            else:
                problems.append(Problem(SKILL, number, "a rule item's continuation line is indented exactly two "
                                        "spaces"))
                item = None
        else:
            item = None
    return [(text, first, topic) for text, first, topic in items]


def check_skill(root: Path, files: Optional[List[str]], rows: List[Row], problems: List[Problem],
                counts: Counts) -> None:
    data = read_listed(root, SKILL, files)
    if data is None:
        print("{}: the skill is absent, so it was not checked".format(SKILL))
        return
    lines = [line.decode("utf-8", errors="replace") for line in split_lines(data)]
    if len(lines) > SKILL_MAX_LINES:
        problems.append(Problem(SKILL, 0, "the skill has {} lines, more than {} lines".format(
            len(lines), SKILL_MAX_LINES)))
    skill_frontmatter(lines, problems)
    by_identifier = {row.identifier: row for row in rows}
    for number, line in enumerate(lines, start=1):
        for match in BRACKETED.finditer(line):
            if match.group(1) not in by_identifier:
                problems.append(Problem(SKILL, number, "[{}] names no row".format(match.group(1))))
    # Only items under the exact heading are rule items, so a missing or mistyped heading, or a section with none,
    # would leave every rule item's citation and numbers unchecked. Both fail instead. A line in a fenced code block
    # is no heading, so a fence cannot stand in for ## Rules.
    fenced = fenced_lines(lines)
    stripped = ["" if inside else line.rstrip() for line, inside in zip(lines, fenced)]
    for heading in SKILL_HEADINGS:
        if heading not in stripped:
            problems.append(Problem(SKILL, 0, "the skill has no {} heading{}".format(
                heading, ", so no rule item was checked" if heading == RULES_HEADING else "")))
    items = skill_rule_items(lines, fenced, problems)
    if RULES_HEADING in stripped and not items:
        problems.append(Problem(SKILL, stripped.index(RULES_HEADING) + 1, "the skill has no rule items under "
                                "{}".format(RULES_HEADING)))
    for text, first, topic in items:
        if not topic:
            problems.append(Problem(SKILL, first, "a rule item sits under a ### heading for its topic"))
        match = SKILL_ITEM_END.match(text)
        if match is None:
            problems.append(Problem(SKILL, first, "a rule item ends with [identifier] citation"))
            continue
        before, identifier, citation = match.group(1), match.group(2), match.group(3)
        if before.strip() == "":
            problems.append(Problem(SKILL, first, "a rule item has words before its identifier"))
            continue
        row = by_identifier.get(identifier)
        if row is None:
            continue  # reported above, where the bracketed identifier stands
        row_citation = (row.values("Citation") or [""])[0]
        matched = True
        if citation != row_citation:
            problems.append(Problem(SKILL, first, "the citation {!r} is not {}'s citation, {!r}".format(
                citation, identifier, row_citation)))
            matched = False
        in_rule = set(NUMBER.findall(CITATION_PARAGRAPH.sub(" ", " ".join(row.values("Rule")))))
        for number in NUMBER.findall(CITATION_PARAGRAPH.sub(" ", before)):
            if number not in in_rule:
                problems.append(Problem(SKILL, first, "the number {} is not in {}'s Rule".format(number, identifier)))
                matched = False
        if matched:
            counts.skill_items += 1
