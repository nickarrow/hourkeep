"""Tests of the GitHub issue form the review pages link to, .github/ISSUE_TEMPLATE/row-review.yml: it holds each of
its fields once, its one no-real-case box must be ticked before a comment can be sent, and its row field asks what
the Google Form asks. Read with the standard library, so the form is read by its lines rather than parsed as YAML.
"""

from __future__ import annotations

import re
import unittest
from pathlib import Path
from typing import Dict, List

FORM = Path(__file__).resolve().parent.parent / ".github" / "ISSUE_TEMPLATE" / "row-review.yml"
IDS = ("kind", "row", "details", "source", "checked-official-text", "role", "no-real-case", "credit", "credit-name")
FIELD_START = re.compile(r"^  - type: ")  # a field of the form's body, at the body's list indent
FIELD_ID = re.compile(r"^    id: (\S+)\s*$")


def fields() -> List[List[str]]:
    """The form's body fields, each as its lines, the first being its '- type:' line."""
    found: List[List[str]] = []
    for line in FORM.read_text(encoding="utf-8").split("\n"):
        if FIELD_START.match(line):
            found.append([line])
        elif found and (line.startswith("    ") or not line.strip()):
            found[-1].append(line)
        elif found:
            break  # a key after the body ends its list
    return found


def field_ids() -> List[str]:
    """Each field's id, in the form's order, as many times as it appears."""
    return [match.group(1) for field in fields() for line in field for match in [FIELD_ID.match(line)] if match]


def field(identifier: str) -> List[str]:
    """The lines of the field whose id is `identifier`."""
    by_id: Dict[str, List[str]] = {}
    for lines in fields():
        for line in lines:
            match = FIELD_ID.match(line)
            if match:
                by_id[match.group(1)] = lines
    return by_id[identifier]


class IssueFormTest(unittest.TestCase):
    def test_holds_each_field_once(self):
        ids = field_ids()
        for identifier in IDS:
            with self.subTest(id=identifier):
                self.assertEqual(ids.count(identifier), 1)

    def test_its_one_no_real_case_box_is_required(self):
        lines = field("no-real-case")
        self.assertEqual(lines[0].strip(), "- type: checkboxes")
        options = [index for index, line in enumerate(lines) if line.strip().startswith("- label:")]
        self.assertEqual(len(options), 1)
        rest = [line.strip() for line in lines[options[0] + 1:] if line.strip()]
        self.assertIn("required: true", rest)
        self.assertNotIn("required: false", [line.strip() for line in lines])

    def test_row_field_asks_what_the_google_form_asks(self):
        lines = [line.strip() for line in field("row")]
        self.assertEqual(lines[0], "- type: input")
        self.assertIn('label: "Which row, state fact or open question?"', lines)


if __name__ == "__main__":
    unittest.main()
