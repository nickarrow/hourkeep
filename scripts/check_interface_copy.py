"""Checks of the words inside HourKeep's screens, against `.kiro/skills/interface-copy/SKILL.md`.

That file adapts the CMS eAPD content guide, which was written for this kind of form. Only the rules a checker can
see are here. Whether a title names its screen, or an instruction helps anybody, is read by a person.

The checker reads displayed strings out of the prototype's JavaScript and HTML. It does not run the app, so it sees
the templates rather than the rendered page. A string it cannot attribute to a label, a title or a button is left
alone rather than guessed at.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

SECTION_TITLE_MAX = 35
SUBSECTION_TITLE_MAX = 60

# Words that stay lowercase inside a title-cased heading. Everything else takes a capital.
SMALL_WORDS = frozenset(
    "a an and as at but by for from in nor of on or per the to v via vs with".split()
)

# A label that opens with one of these is an instruction wearing a label's clothes.
IMPERATIVES = frozenset(
    "add choose describe enter give list pick provide select tell type write upload attach".split()
)

# "one" is left out on purpose. In English it is nearly always a determiner ("print one packet", "at least one
# month") rather than a quantity, so flagging it reports correct prose. Two and above are quantities.
SPELLED_NUMBERS = frozenset(
    "two three four five six seven eight nine ten eleven twelve".split()
)

# Titles that would fit any screen.
EMPTY_TITLES = frozenset("overview summary details information data section page".split())


@dataclass(frozen=True)
class Finding:
    path: str
    line: int
    rule: str
    message: str

    def __str__(self) -> str:
        return f"{self.path}:{self.line}: {self.rule} {self.message}"


def line_of(text: str, index: int) -> int:
    return text.count("\n", 0, index) + 1


def is_title_case(title: str) -> bool:
    """True when every word carries a capital, apart from small words that are not first or last."""
    words = [w for w in re.split(r"[\s/]+", title.strip()) if w]
    if not words:
        return True
    for position, word in enumerate(words):
        bare = word.strip("‘’'\"()[].,:;?!")
        if not bare or not bare[0].isalpha():
            continue
        # An all-caps acronym, or a word already capitalised, is fine.
        if bare.isupper():
            continue
        first, last = position == 0, position == len(words) - 1
        lowered = bare.lower()
        if lowered in SMALL_WORDS and not first and not last:
            continue
        if not bare[0].isupper():
            return False
    return True


def check_title(path: str, text: str, index: int, title: str, kind: str, limit: int) -> list[Finding]:
    line = line_of(text, index)
    out: list[Finding] = []
    # A template expression renders at runtime; its case and length cannot be judged here.
    if "${" in title:
        return out
    stripped = title.strip()
    if not stripped:
        return out
    if stripped.lower().strip(".:0123456789 ") in EMPTY_TITLES:
        out.append(Finding(path, line, "COPY-01", f"{kind} says nothing about its screen: {stripped!r}"))
    if not is_title_case(stripped):
        out.append(Finding(path, line, "COPY-02", f"{kind} is not title case: {stripped!r}"))
    if len(stripped) > limit:
        out.append(
            Finding(path, line, "COPY-03", f"{kind} is {len(stripped)} characters, over {limit}: {stripped!r}")
        )
    return out


def check_label(path: str, text: str, index: int, label: str) -> list[Finding]:
    line = line_of(text, index)
    out: list[Finding] = []
    stripped = label.strip().rstrip(":")
    if not stripped:
        return out
    first = re.split(r"[\s$]+", stripped)[0].lower().strip("‘’'\"")
    if first in IMPERATIVES:
        out.append(Finding(path, line, "COPY-04", f"field label is an instruction, name the field: {stripped!r}"))
    if stripped.endswith("?") and "${" not in stripped:
        out.append(Finding(path, line, "COPY-05", f"only a yes or no toggle takes a question label: {stripped!r}"))
    return out


def check_prose(path: str, text: str, index: int, copy: str) -> list[Finding]:
    """Rules that apply to any string a person reads."""
    line = line_of(text, index)
    out: list[Finding] = []
    if re.search(r"\bplease\b", copy, re.IGNORECASE):
        out.append(Finding(path, line, "COPY-06", "drop 'please' and say the thing"))
    if re.search(r"\s&\s", copy):
        out.append(Finding(path, line, "COPY-07", "write 'and' rather than an ampersand"))
    if re.search(r"\bpercent\b", copy, re.IGNORECASE):
        out.append(Finding(path, line, "COPY-08", "use the % sign"))
    for word in re.findall(r"\b[a-z]+\b", copy):
        if word in SPELLED_NUMBERS:
            out.append(Finding(path, line, "COPY-09", f"use a numeral rather than {word!r}"))
            break
    if re.search(r"\b\d+\s+x\s+\d+\b", copy) or re.search(r"\}\s+x\s+\$\{", copy):
        out.append(Finding(path, line, "COPY-11", "use the multiplication sign × rather than the letter x"))
    # A contraction or possessive written with a straight apostrophe, inside displayed copy.
    if re.search(r"[A-Za-z]'[a-z]", copy):
        out.append(Finding(path, line, "COPY-12", "use a curly apostrophe ’ in displayed copy"))
    return out


# Displayed copy in the prototype, found by the shape of the code that renders it.
STEPS = re.compile(r"const STEPS = \[(.*?)\];", re.S)
HEADING = re.compile(r"<h([1-6])\b[^>]*>(.*?)</h\1>", re.S)
FIELD_CALL = re.compile(r"field\(\s*[`'\"][^`'\"]*[`'\"]\s*,\s*'([^']*)'\s*,\s*'([^']*)'", re.S)
LEGEND = re.compile(r"<legend[^>]*>(.*?)</legend>", re.S)
SR_LABEL = re.compile(r'class="sr-only"[^>]*>(.*?)<', re.S)
ARIA_LABEL = re.compile(r'aria-label="([^"]*)"')
BUTTON = re.compile(r"<button\b[^>]*>(.*?)</button>", re.S)
PARAGRAPH = re.compile(r"<p\b[^>]*>(.*?)</p>", re.S)
LIST_ITEM = re.compile(r"<li\b[^>]*>(.*?)</li>", re.S)
TABLE_CELL = re.compile(r"<t[dh]\b[^>]*>(.*?)</t[dh]>", re.S)
DT = re.compile(r"<dt\b[^>]*>(.*?)</dt>", re.S)

# toggle('name', 'Label?', value): the helper the prototype renders a yes, no or not-sure answer with.
TOGGLE_CALL = re.compile(r"toggle\(\s*[`'\"][^`'\"]*[`'\"]\s*,\s*'([^']*)'")

PACKET_PHRASE = re.compile(r"\bNot specified\b|\bnot specified\.|No response was provided")


def visible(fragment: str) -> str:
    """Strip markup and icon calls, keeping the words and any template expression."""
    out = re.sub(r"<[^>]*>", " ", fragment)
    out = out.replace("&middot;", "·").replace("&amp;", "&")
    out = re.sub(r"\$\{ICON\.\w+\}", " ", out)
    return re.sub(r"\s+", " ", out).strip()


def check_javascript(path: str, text: str) -> list[Finding]:
    out: list[Finding] = []

    steps = STEPS.search(text)
    if steps:
        start = steps.start(1)
        body = steps.group(1)
        # Steps written as objects carry an id beside the title, and only the title is shown.
        titles = re.finditer(r"title:\s*'([^']+)'", body) if "title:" in body else re.finditer(r"'([^']+)'", body)
        for raw in titles:
            out += check_title(path, text, start + raw.start(1), raw.group(1), "section title", SECTION_TITLE_MAX)

    # A yes or no toggle is the one control whose label is a question, so it has to end with a question mark.
    for match in TOGGLE_CALL.finditer(text):
        label = match.group(1)
        if not label.rstrip().endswith("?"):
            out.append(Finding(path, line_of(text, match.start()), "COPY-14",
                               f"a yes or no toggle is labelled with a question: {label!r}"))

    for match in HEADING.finditer(text):
        title = visible(match.group(2))
        level = int(match.group(1))
        kind = "section title" if level == 1 else "subsection title"
        limit = SECTION_TITLE_MAX if level == 1 else SUBSECTION_TITLE_MAX
        out += check_title(path, text, match.start(), title, kind, limit)

    for match in FIELD_CALL.finditer(text):
        out += check_label(path, text, match.start(), match.group(1))
        out += check_prose(path, text, match.start(), match.group(2))
    for pattern in (LEGEND, SR_LABEL):
        for match in pattern.finditer(text):
            out += check_label(path, text, match.start(), visible(match.group(1)))
    for match in ARIA_LABEL.finditer(text):
        label = match.group(1)
        # An aria-label on a control names the action, so only the prose rules apply.
        out += check_prose(path, text, match.start(), label)

    for pattern in (BUTTON, PARAGRAPH, LIST_ITEM, TABLE_CELL, DT):
        for match in pattern.finditer(text):
            out += check_prose(path, text, match.start(), visible(match.group(1)))
            out += check_spacing(path, text, match.start(), match.group(1))

    return out


def check_packet_phrases(path: str, text: str) -> list[Finding]:
    """The packet is the export view. An answer nobody gave is said, not left blank."""
    out: list[Finding] = []
    packet = re.search(r"function packetHtml\(\) \{(.*?)\n\}", text, re.S)
    if not packet:
        return out
    # The phrase sits inside markup, so it is found by what surrounds it on the page rather than by the
    # quote that delimits the JavaScript string.
    for match in re.finditer(r">\s*(No [^<>]{3,80}?\.)\s*<", packet.group(1)):
        phrase = match.group(1)
        if not PACKET_PHRASE.search(phrase):
            out.append(
                Finding(
                    path,
                    line_of(text, packet.start(1) + match.start()),
                    "COPY-13",
                    f"packet says {phrase!r}; use '<Thing> not specified.' or 'No response was provided.'",
                )
            )
    return out


def check_spacing(path: str, text: str, index: int, fragment: str) -> list[Finding]:
    """COPY-10, run on the raw fragment. Stripping markup collapses whitespace, so the run of spaces has to be
    looked for before that happens. Indentation follows a newline rather than a full stop, so it is not matched."""
    if re.search(r"[.!?:,;)][ \t]{2,}[A-Za-z\u2018\u201c]", fragment):
        return [Finding(path, line_of(text, index), "COPY-10", "one space after a full stop")]
    return []


def check_arithmetic(path: str, text: str) -> list[Finding]:
    """Shown arithmetic is often assembled outside any tag, so it is searched for across the whole file."""
    out: list[Finding] = []
    seen: set[int] = set()
    for match in re.finditer(r"(?:\}|\d)\s+x\s+(?:\$\{|\d)", text):
        line = line_of(text, match.start())
        if line in seen:
            continue
        seen.add(line)
        out.append(Finding(path, line, "COPY-11", "use the multiplication sign \u00d7 rather than the letter x"))
    return out


def check_html(path: str, text: str) -> list[Finding]:
    out: list[Finding] = []
    for match in HEADING.finditer(text):
        level = int(match.group(1))
        kind = "section title" if level == 1 else "subsection title"
        limit = SECTION_TITLE_MAX if level == 1 else SUBSECTION_TITLE_MAX
        out += check_title(path, text, match.start(), visible(match.group(2)), kind, limit)
    for pattern in (BUTTON, PARAGRAPH, LIST_ITEM):
        for match in pattern.finditer(text):
            out += check_prose(path, text, match.start(), visible(match.group(1)))
            out += check_spacing(path, text, match.start(), match.group(1))
    return out


# The published page is plain HTML written for the same reader, so it is checked too. Its title case is
# deliberately sentence case, because it is a web page rather than a form, so only the prose rules run on it.
TARGETS = (
    ("prototype/src/main.js", "javascript"),
    ("prototype/index.html", "html"),
)


def run(root: Path) -> list[Finding]:
    findings: list[Finding] = []
    for name, kind in TARGETS:
        path = root / name
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        if kind == "javascript":
            findings += check_javascript(name, text)
            findings += check_packet_phrases(name, text)
            findings += check_arithmetic(name, text)
        else:
            findings += check_html(name, text)
    # Two rules can see the same string by different routes, so one line reports once per rule.
    unique = {(f.path, f.line, f.rule, f.message): f for f in findings}
    return sorted(unique.values(), key=lambda f: (f.path, f.line, f.rule))
