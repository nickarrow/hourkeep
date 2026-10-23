"""The shared fixture for the tests of scripts/check-corpus.py and its package, scripts/corpus_check/.

Every test builds its own corpus in a temporary directory with `git init -q`, its files staged with `git add -A`,
starting from one small valid corpus and changing one thing. Nothing here reads or writes the real repository's
corpus. The fixture text is synthetic: it has the shape the Formats section of
docs/epics/0001-policy-corpus/design.md asks for, and its policy wording is illustration, not a checked statement of
any rule.
"""

from __future__ import annotations

import hashlib
import importlib
import json
import os
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from typing import Optional


CHECKER = Path(__file__).resolve().parent.parent / "scripts" / "check-corpus.py"

# git in a fixture, and the checker's own git, read none of the user's or the system's git configuration, so a
# global ignore or attributes file cannot change what a test sees: no system file, an empty global file, and an
# empty folder where git looks for its default ignore and attributes files. GIT_CONFIG_GLOBAL needs git 2.32.
GIT_CONFIG_FOLDER = tempfile.TemporaryDirectory()
(Path(GIT_CONFIG_FOLDER.name) / "gitconfig").write_bytes(b"")
(Path(GIT_CONFIG_FOLDER.name) / "xdg").mkdir()


def git_environment() -> dict:
    """The running environment, read when called, with the user's and the system's git configuration left out."""
    return dict(os.environ, GIT_CONFIG_NOSYSTEM="1", GIT_CONFIG_GLOBAL=str(Path(GIT_CONFIG_FOLDER.name) / "gitconfig"),
                XDG_CONFIG_HOME=str(Path(GIT_CONFIG_FOLDER.name) / "xdg"))

EXTRACT = "docs/domain/community-engagement-extract.md"
MANIFEST = "docs/domain/sources/MANIFEST.json"
FEDERAL = "docs/domain/states/federal.json"
COLORADO = "docs/domain/states/co.json"
TEXAS = "docs/domain/states/tx.json"
SKILL = ".kiro/skills/medicaid-community-engagement/SKILL.md"
ANALYSIS = "docs/domain/cms-2454-ifc/rule-extract.md"
ECFR_SOURCE = "docs/domain/sources/ecfr/2026-10-14/42-cfr-431.221.xml"
OLDER_SOURCE = "docs/domain/cms-2454-ifc/2026-11094.xml"

# A stored eCFR section. Line 3 holds the words the first row quotes.
ECFR_TEXT = (
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<SECTION><SECTNO>\u00a7 431.221</SECTNO>\n'
    "<P>(d) The agency must allow a reasonable time, not to exceed 90 days, to request a hearing.</P>\n"
    "</SECTION>\n"
)

# An older stored source outside docs/domain/sources/. Line 3 has a thin space after the section sign and an
# escaped ampersand, as the Federal Register's XML does; line 4 holds the words the Colorado fact quotes.
OLDER_TEXT = (
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    "<RULE>\n"
    "<P>\u00a7\u2009435.558 Notices &amp; hearings.</P>\n"
    "<P>(a)(2) The individual has 30 calendar days to respond.</P>\n"
    "</RULE>\n"
)

EXTRACT_TEXT = """# Community engagement extract

The rows below restate the rules on notices of noncompliance and fair hearings, one rule per row.

## Notices of noncompliance and fair hearings

### hearing-request-period

- Rule: A person may ask for a fair hearing within a reasonable time set by the agency, which may not be more
  than 90 days.
- Citation: 42 CFR 431.221(d); eCFR 2026-10-14
- Source: docs/domain/sources/ecfr/2026-10-14/42-cfr-431.221.xml:3 "not to exceed 90 days"
- Tier: regulation
- State election: yes; the state chooses the time allowed; where it has not chosen, 90 days
- Verified: 2026-10-17, read in source
- Error direction: dangerous
- Recheck: eCFR amendment; date 2026-12-01: board meeting
- Note: Synthetic fixture row.

### notice-response-period

- Rule: A person has 30 calendar days to respond to a notice of noncompliance.
- Citation: 42 CFR 435.558(a)(2); 91 FR 39030
- Source: not stored, https://www.federalregister.gov/d/C1-2026-11094
- Tier: regulation
- State election: no
- Verified: no
- Error direction: dangerous
- Recheck: final rule; correction notice
"""

SKILL_TEXT = """---
name: medicaid-community-engagement
description: Use when a person asks about Medicaid work requirements, letters, deadlines and exemptions.
---

# Medicaid community engagement

## Topics

- [Fair hearings](references/fair-hearings.md): asking for a fair hearing. Read it before answering a question on one.

## Precedence

The regulation wins over a state agency page.

## Watch list

- 2026-12-01 board meeting: [hearing-request-period]
"""

# The extract's one ## topic heading, which a topic file's title must be.
TOPIC_HEADING = "Notices of noncompliance and fair hearings"

# The skill's one topic file, which SKILL_TEXT links from ## Topics, with one rule item for each row of the extract.
# Its title is TOPIC_HEADING.
TOPIC = ".kiro/skills/medicaid-community-engagement/references/fair-hearings.md"
TOPIC_TEXT = """# Notices of noncompliance and fair hearings

The row in the extract wins wherever the two differ.

## Asking for a hearing

- You can ask for a fair hearing within the time the state allows, never more than 90 days.
  [hearing-request-period] 42 CFR 431.221(d); eCFR 2026-10-14
- You have 30 calendar days to respond to a notice of noncompliance.
  [notice-response-period] 42 CFR 435.558(a)(2); 91 FR 39030
"""

# The open questions, one question: its heading is line 5, Why it is open lines 7 and 8, Who can answer line 9,
# Raised line 10, its two Sources lines 11 and 12, and its Note line 13.
OPEN_QUESTIONS = "docs/domain/open-questions.md"
OPEN_QUESTIONS_TEXT = """# Open questions

Questions only CMS, a state or a policy person can answer. Synthetic fixture text.

### Are the 30 days calendar days?

- Why it is open: the sources are silent; it turns on a choice the state has not published. The rule says
  calendar days for one period and not for the other.
- Who can answer: CMS
- Raised: 2026-10-17, by rows notice-response-period and hearing-request-period
- Source: docs/domain/sources/ecfr/2026-10-14/42-cfr-431.221.xml:3 "not to exceed 90 days"
- Source: docs/domain/cms-2454-ifc/2026-11094.xml:4 "30 calendar days"
- Note: Synthetic question.
"""

ANALYSIS_TEXT = "# Rule extract\n\nAn analysis file. Rows must not cite it.\n"
README_TEXT = "# Fixture repository\n"
GITATTRIBUTES_TEXT = "docs/domain/sources/** -text\ndocs/domain/cms-2454-ifc/2026-11094.xml -text\n"


def sha256_of(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def valid_manifest() -> dict:
    return {
        "sources": [
            {
                "path": OLDER_SOURCE,
                "sha256": sha256_of(OLDER_TEXT),
                "kind": "verbatim",
                "cited_url": "not recorded",
                "retrievals": [{"served_url": "not recorded", "command": "not recorded", "retrieved": "not recorded"}],
                "superseded": [],
            },
            {
                "path": ECFR_SOURCE,
                "sha256": sha256_of(ECFR_TEXT),
                "kind": "verbatim",
                "cited_url": "https://www.ecfr.gov/current/title-42/section-431.221",
                "retrievals": [
                    {
                        "served_url": "https://www.ecfr.gov/api/versioner/v1/full/2026-10-14/title-42.xml?section=431.221",
                        "command": "curl -sS -o " + ECFR_SOURCE + " 'https://www.ecfr.gov/api/versioner/v1/full/"
                        "2026-10-14/title-42.xml?section=431.221'",
                        "retrieved": "2026-10-17T03:10:00Z",
                    }
                ],
                "superseded": [],
                "ecfr_date": "2026-10-14",
            },
        ]
    }


def valid_federal() -> dict:
    return {
        "state": "federal",
        "name": "Federal default",
        "facts": [
            {
                "row": "hearing-request-period",
                "setting": "on appeal",
                "value": "90 days",
                "counts_from": "the date the notice is sent",
                "status": "known",
                "citation": "42 CFR 431.221(d); eCFR 2026-10-14",
                "sources": [
                    {
                        "source": ECFR_SOURCE + ':3 "not to exceed 90 days"',
                        "url": "https://www.ecfr.gov/current/title-42/section-431.221",
                        "tier": "regulation",
                        "source_date": "2026-10-14",
                    }
                ],
                "checked": "2026-10-17, read in source",
            }
        ],
    }


def valid_colorado() -> dict:
    return {
        "state": "co",
        "name": "Colorado",
        "facts": [
            {
                "row": "notice-response-period",
                "setting": "after a notice of noncompliance",
                "value": "30 calendar days",
                "counts_from": "the day the notice is received",
                "status": "known",
                "citation": "42 CFR 435.558(a)(2); 91 FR 39030",
                "sources": [
                    {
                        "source": OLDER_SOURCE + ':4 "30 calendar days"',
                        "url": "https://www.federalregister.gov/d/2026-11094",
                        "tier": "regulation",
                        "source_date": "2026-06-03",
                    }
                ],
                "checked": "2026-10-17, read in source",
            }
        ],
    }


def valid_texas() -> dict:
    """A third state file, beyond the two the corpus requires, shaped as Colorado's is."""
    state = valid_colorado()
    state.update(state="tx", name="Texas")
    return state


class Corpus:
    """The valid corpus as editable data. A test changes one thing, then calls run_checker.

    `files` maps a path relative to the repository root to its text (str, written as UTF-8) or bytes (written as
    they are). The manifest and the two state files are Python objects, written as JSON. Setting any of them to None
    leaves that file out. `links` maps a path to the target of a symlink made there. Everything written is staged
    with `git add -A`, which leaves out what git ignores, so git lists a file as it lists a committed one in the real
    repository. Each path in `deleted` is then removed from the disk, leaving git listing a file that is not there.
    """

    def __init__(self) -> None:
        self.files: dict = {
            EXTRACT: EXTRACT_TEXT,
            ECFR_SOURCE: ECFR_TEXT,
            OLDER_SOURCE: OLDER_TEXT,
            SKILL: SKILL_TEXT,
            TOPIC: TOPIC_TEXT,
            OPEN_QUESTIONS: OPEN_QUESTIONS_TEXT,
            ANALYSIS: ANALYSIS_TEXT,
            "README.md": README_TEXT,
            ".gitattributes": GITATTRIBUTES_TEXT,
        }
        self.manifest = valid_manifest()
        self.states = {FEDERAL: valid_federal(), COLORADO: valid_colorado()}
        self.links: dict = {}
        self.deleted: list = []

    def write(self, root: Path) -> None:
        subprocess.run(["git", "init", "-q", str(root)], check=True, env=git_environment())
        contents = dict(self.files)
        if self.manifest is not None:
            contents[MANIFEST] = json.dumps(self.manifest, indent=2, ensure_ascii=False) + "\n"
        for path, data in self.states.items():
            if data is not None:
                contents[path] = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
        for path, content in contents.items():
            if content is None:
                continue
            target = root / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(content if isinstance(content, bytes) else content.encode("utf-8"))
        for path, link in self.links.items():
            target = root / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.symlink_to(link)
        subprocess.run(["git", "-C", str(root), "add", "-A"], check=True, env=git_environment())
        for path in self.deleted:
            (root / path).unlink()


def run_checker(corpus: Corpus, args=None, cwd=None, script: Path = CHECKER) -> subprocess.CompletedProcess:
    """Write the corpus to a fresh temporary repository and run the checker on it with the running Python.

    `args` replaces the default `--root <repository>`; the string "{root}" inside an argument becomes the
    repository's path. `cwd` is "elsewhere" for a second, empty temporary directory, or None for the repository.
    """
    with tempfile.TemporaryDirectory() as repo, tempfile.TemporaryDirectory() as elsewhere:
        root = Path(repo)
        corpus.write(root)
        if args is None:
            args = ["--root", "{root}"]
        argv = [arg.replace("{root}", str(root)) for arg in args]
        workdir = elsewhere if cwd == "elsewhere" else str(root)
        if callable(script):
            script = script(root)
        return subprocess.run(
            [sys.executable, str(script)] + argv, cwd=workdir, capture_output=True, text=True, encoding="utf-8",
            env=git_environment(),
        )


COUNTS_LINE = re.compile(
    r"^Checked (\d+) rows \((\d+) say Verified: no, (\d+) verified by a person\), (\d+) sources, (\d+) state facts "
    r"\((\d+) marked not published\), (\d+) warnings, (\d+) skill items\.$",
    re.MULTILINE,
)


def load_checker():
    """The checker's module for the rows of the extract, scripts/corpus_check/rows.py, for tests that call one of
    its functions directly."""
    if str(CHECKER.parent) not in sys.path:
        sys.path.insert(0, str(CHECKER.parent))
    return importlib.import_module("corpus_check.rows")


def extract_with(old: str, new: str) -> str:
    """The valid extract with its first `old` replaced by `new`. Fails loudly if `old` is not there."""
    if old not in EXTRACT_TEXT:
        raise AssertionError("fixture text not found: " + repr(old))
    return EXTRACT_TEXT.replace(old, new, 1)


class CorpusTestCase(unittest.TestCase):
    def check_extract(self, text: str) -> subprocess.CompletedProcess:
        corpus = Corpus()
        corpus.files[EXTRACT] = text
        return run_checker(corpus)

    def assertPasses(self, result: subprocess.CompletedProcess) -> None:
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def assertFails(self, result: subprocess.CompletedProcess, path: str, line: int, words: str) -> None:
        """Exit 1, and a problem at path:line whose message holds `words`."""
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        pattern = r"(?m)^{}:{}: .*{}".format(re.escape(path), line, re.escape(words))
        self.assertRegex(result.stdout, pattern)


def add_entry(corpus: Corpus, path: str, content: bytes, **keys) -> None:
    """Give `path` a complete verbatim manifest entry with the hash of `content`, `keys` replacing or adding keys,
    keeping the entries sorted by path. The file itself is not written."""
    entry = {
        "path": path,
        "sha256": hashlib.sha256(content).hexdigest(),
        "kind": "verbatim",
        "cited_url": "not recorded",
        "retrievals": [{"served_url": "not recorded", "command": "not recorded", "retrieved": "not recorded"}],
        "superseded": [],
    }
    entry.update(keys)
    corpus.manifest["sources"].append(entry)
    corpus.manifest["sources"].sort(key=lambda entry: entry["path"])


def entry_index(corpus: Corpus, path: str) -> int:
    return [entry["path"] for entry in corpus.manifest["sources"]].index(path)


def add_stored_source(corpus: Corpus, path: str, content: bytes) -> None:
    """Store `content` at `path` with a complete verbatim manifest entry, keeping the entries sorted by path."""
    corpus.files[path] = content
    add_entry(corpus, path, content)


# A stored PDF and its text extraction beside it, for the rules on a PDF's extraction.
PDF = "docs/domain/sources/cms/notice.pdf"
PDF_CONTENT = b"%PDF-1.7\n(a) Some words.\n"
PDF_EXTRACTION = "docs/domain/sources/cms/notice.txt"
PDF_EXTRACTION_TEXT = "[[page 1]]\n(a) Some words.\n"
PDF_DERIVATION = (
    "swift scripts/extract-pdf-text.swift " + PDF + " > " + PDF_EXTRACTION + ", run from the repository root; "
    "script SHA-256 " + "0123abcd" * 8 + "; macOS 26.7.1 (25G241); Apple Swift version 6.2"
)


def with_pdf_extraction(derivation: str = PDF_DERIVATION, text: str = PDF_EXTRACTION_TEXT) -> Corpus:
    """The valid corpus with PDF stored and PDF_EXTRACTION, holding `text`, derived from it by `derivation`."""
    corpus = Corpus()
    add_stored_source(corpus, PDF, PDF_CONTENT)
    corpus.files[PDF_EXTRACTION] = text
    add_entry(corpus, PDF_EXTRACTION, text.encode("utf-8"), kind="derived", retrievals=[],
              derived_from=PDF, derivation=derivation)
    return corpus


def element_line(data, index: int) -> int:
    """The line on which element `index` of the list two levels down begins, whatever its type, as Corpus.write
    renders the JSON with indent=2: each entry of the manifest's sources, or each fact of a state file."""
    lines = (json.dumps(data, indent=2, ensure_ascii=False) + "\n").split("\n")
    openings = [number for number, line in enumerate(lines, start=1)
                if line.startswith("    ") and line[4:5] not in ("", " ", "}", "]")]
    return openings[index]


def entry_line(corpus: Corpus, index: int) -> int:
    """The line of the manifest on which entry `index` begins, as Corpus.write renders it with indent=2."""
    return element_line(corpus.manifest, index)


def fact_line(state: dict, index: int) -> int:
    """The line of a state file on which fact `index` begins, as Corpus.write renders it with indent=2."""
    return element_line(state, index)


def skill_with(old: str, new: str) -> str:
    """The valid skill with its first `old` replaced by `new`. Fails loudly if `old` is not there."""
    if old not in SKILL_TEXT:
        raise AssertionError("fixture text not found: " + repr(old))
    return SKILL_TEXT.replace(old, new, 1)


def topic_with(old: str, new: str) -> str:
    """The valid topic file with its first `old` replaced by `new`. Fails loudly if `old` is not there."""
    if old not in TOPIC_TEXT:
        raise AssertionError("fixture text not found: " + repr(old))
    return TOPIC_TEXT.replace(old, new, 1)


# Two of the pairs of rows a state chooses between, as decision record 0006 names them and CHOICE_PAIRS in
# scripts/corpus_check/constants.py holds them, each pair's first row first. The valid corpus has none of these rows;
# with_choice_pairs adds them.
RENEWAL_PAIR = ("renewal-notice-with-renewal-form", "renewal-notice-after-renewal-form-period")
CHECK_PAIR = ("more-frequent-check-notice-after-data-check", "more-frequent-check-notice-after-information-request")


def pair_row(identifier: str) -> str:
    """A synthetic row on one of the two rows of a pair, which the state chooses between."""
    return (
        "\n### {}\n\n"
        "- Rule: A synthetic rule for one of the two choices a state makes about when its notice comes.\n"
        "- Citation: 42 CFR 435.558(b); 91 FR 39031\n"
        "- Source: not stored, https://www.federalregister.gov/d/C1-2026-11094\n"
        "- Tier: regulation\n"
        "- State election: yes; the state chooses which of the two rows applies; where it has not chosen, neither\n"
        "- Verified: no\n"
        "- Error direction: dangerous\n"
        "- Recheck: final rule\n"
    ).format(identifier)


def pair_item(identifier: str) -> str:
    """The rule item for pair_row(identifier)."""
    return ("- A synthetic rule item for one of the two choices a state makes about when its notice comes.\n"
            "  [{}] 42 CFR 435.558(b); 91 FR 39031\n").format(identifier)


def with_choice_pairs(corpus: Optional[Corpus] = None) -> Corpus:
    """The corpus, by default a fresh valid one, with the rows of RENEWAL_PAIR and CHECK_PAIR added after the
    extract's two, and a rule item for each under a new ## group of the topic file. Nothing else changes, so it
    still passes, with 6 rows and 6 skill items."""
    corpus = corpus if corpus is not None else Corpus()
    pairs = RENEWAL_PAIR + CHECK_PAIR
    corpus.files[EXTRACT] = corpus.files[EXTRACT] + "".join(pair_row(identifier) for identifier in pairs)
    corpus.files[TOPIC] = (corpus.files[TOPIC] + "\n## Choices a state makes\n\n"
                           + "".join(pair_item(identifier) for identifier in pairs))
    return corpus


RULE_ITEM = ("- You can ask for a fair hearing within the time the state allows, never more than 90 days.\n"
             "  [hearing-request-period] 42 CFR 431.221(d); eCFR 2026-10-14\n")
# The topic file's second rule item, lines 9 and 10, so each row of the valid extract has its one rule item.
NOTICE_ITEM = ("- You have 30 calendar days to respond to a notice of noncompliance.\n"
               "  [notice-response-period] 42 CFR 435.558(a)(2); 91 FR 39030\n")


class ManifestTestCase(CorpusTestCase):
    """Formats, "Stored sources and the manifest". Entry 0 is the older source, entry 1 the eCFR section."""

    OLDER, ECFR = 0, 1

    def entry(self, corpus: Corpus, index: int) -> dict:
        return corpus.manifest["sources"][index]

    def assertEntryFails(self, corpus: Corpus, index: int, words: str) -> None:
        self.assertFails(run_checker(corpus), MANIFEST, entry_line(corpus, index), words)

    def fact(self, corpus: Corpus) -> dict:
        return corpus.states[COLORADO]["facts"][0]
