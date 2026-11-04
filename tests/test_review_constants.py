"""Tests that the review pages' own constants name what exists in this repository: every key of START_HERE,
ORIENTATION and ORIENTATION_QUESTIONS in scripts/review_pages/constants.py is the name of a topic file in the skill's
references/, and every key of ORIENTATION_QUESTIONS has an ORIENTATION. The generator passes over a key that names no
topic file, since the tests' corpora have topic files of their own, so a misspelled key would leave a page without
its Start here, its orientation or its links to its questions and fail nothing. Read from this repository, as
test_issue_form.py reads its issue form, and skipped when the skill is absent, since deleting it is allowed. Fix check
2026-11-04, mechanism should fix 1.
"""

from __future__ import annotations

import unittest
from pathlib import Path

from test_review_pages import load_generator

REFERENCES = Path(__file__).resolve().parent.parent / ".kiro" / "skills" / "medicaid-community-engagement" / "references"


@unittest.skipUnless(REFERENCES.is_dir(), "the skill is absent")
class ConstantsNameTopicFilesTest(unittest.TestCase):
    def test_every_key_names_a_topic_file_of_the_skill(self):
        constants = load_generator().constants
        names = {path.stem for path in REFERENCES.glob("*.md")}
        for label, keys in (("START_HERE", constants.START_HERE), ("ORIENTATION", constants.ORIENTATION),
                            ("ORIENTATION_QUESTIONS", constants.ORIENTATION_QUESTIONS)):
            with self.subTest(constant=label):
                self.assertEqual(sorted(set(keys) - names), [], "{} names no such topic file".format(label))

    def test_every_topic_that_names_questions_has_an_orientation(self):
        constants = load_generator().constants
        self.assertEqual(sorted(set(constants.ORIENTATION_QUESTIONS) - set(constants.ORIENTATION)), [])


if __name__ == "__main__":
    unittest.main()
