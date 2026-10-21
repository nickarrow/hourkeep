"""Tests of the checker's reading of docs/domain/open-questions.md, as the Formats section of
docs/epics/0001-policy-corpus/design.md defines it in its paragraph on the open questions: each question is a ###
heading followed by a list holding, in order, Why it is open, which starts with one or more of the four reasons,
Who can answer, Raised, one or more Sources, and optionally a Note last. Review of the review pages 2026-10-21, M5.
Every case changes the valid corpus's one question, whose lines corpus_fixture.py gives.
"""

from __future__ import annotations

import unittest

from corpus_fixture import OPEN_QUESTIONS, OPEN_QUESTIONS_TEXT, Corpus, CorpusTestCase, run_checker

HEADING = 5
WHY = ("- Why it is open: the sources are silent; it turns on a choice the state has not published. The rule says\n"
       "  calendar days for one period and not for the other.\n")
WHO = "- Who can answer: CMS\n"
RAISED = "- Raised: 2026-10-17, by rows notice-response-period and hearing-request-period\n"
SOURCES = ('- Source: docs/domain/sources/ecfr/2026-10-14/42-cfr-431.221.xml:3 "not to exceed 90 days"\n'
           '- Source: docs/domain/cms-2454-ifc/2026-11094.xml:4 "30 calendar days"\n')
NOTE = "- Note: Synthetic question.\n"
REASONS = ("the sources conflict", "the sources are silent", "it turns on a choice the state has not published",
           "the answer may be in a provision the corpus has not stored")


def questions_with(old: str, new: str) -> str:
    """The valid open questions with their first `old` replaced by `new`. Fails loudly if `old` is not there."""
    if old not in OPEN_QUESTIONS_TEXT:
        raise AssertionError("fixture text not found: " + repr(old))
    return OPEN_QUESTIONS_TEXT.replace(old, new, 1)


class OpenQuestionsTest(CorpusTestCase):
    def check_questions(self, text):
        corpus = Corpus()
        corpus.files[OPEN_QUESTIONS] = text
        return run_checker(corpus)

    def test_the_valid_open_questions_pass(self):
        self.assertPasses(self.check_questions(OPEN_QUESTIONS_TEXT))

    def test_a_missing_open_questions_file_fails_as_a_missing_extract_does(self):
        corpus = Corpus()
        corpus.files[OPEN_QUESTIONS] = None
        self.assertFails(run_checker(corpus), OPEN_QUESTIONS, 0, "the open questions are missing")
        corpus = Corpus()
        corpus.files[".gitignore"] = OPEN_QUESTIONS + "\n"
        self.assertFails(run_checker(corpus), OPEN_QUESTIONS, 0, "the open questions are missing")

    def test_a_question_missing_a_required_field_fails_at_its_heading(self):
        for field, old in (("Why it is open", WHY), ("Who can answer", WHO), ("Raised", RAISED),
                           ("Source", SOURCES)):
            with self.subTest(field=field):
                self.assertFails(self.check_questions(questions_with(old, "")), OPEN_QUESTIONS, HEADING,
                                 "lacks the {} field".format(field))

    def test_a_question_without_a_note_passes(self):
        self.assertPasses(self.check_questions(questions_with(NOTE, "")))

    def test_an_empty_field_fails_naming_its_line(self):
        for line, old, new in ((9, WHO, "- Who can answer:\n"), (10, RAISED, "- Raised: \n"),
                               (11, SOURCES, "- Source:\n" + SOURCES.split("\n", 1)[1]), (13, NOTE, "- Note:\n")):
            with self.subTest(line=line):
                self.assertFails(self.check_questions(questions_with(old, new)), OPEN_QUESTIONS, line,
                                 "is empty, which counts as missing")
        self.assertFails(self.check_questions(questions_with(WHY, "- Why it is open:\n")), OPEN_QUESTIONS, 7,
                         "is empty, which counts as missing")

    def test_fields_out_of_order_fail_naming_the_line(self):
        for line, name, old, new in ((10, "Who can answer", WHO + RAISED, RAISED + WHO),
                                     (12, "Raised", RAISED + SOURCES, SOURCES + RAISED),
                                     (8, "Why it is open", WHY + WHO, WHO + WHY),
                                     (13, "Source", SOURCES + NOTE, SOURCES.split("\n", 1)[0] + "\n" + NOTE
                                      + SOURCES.split("\n", 1)[1])):
            with self.subTest(name=name):
                self.assertFails(self.check_questions(questions_with(old, new)), OPEN_QUESTIONS, line,
                                 "{} is out of order".format(name))

    def test_a_field_given_twice_fails(self):
        self.assertFails(self.check_questions(questions_with(WHO, WHO + WHO)), OPEN_QUESTIONS, 10,
                         "Who can answer appears more than once")

    def test_a_field_not_listed_fails(self):
        self.assertFails(self.check_questions(questions_with(NOTE, NOTE + "- Answer: yes\n")), OPEN_QUESTIONS, 14,
                         "Answer is not a field of an open question")

    def test_why_it_is_open_starting_with_anything_but_the_reasons_fails(self):
        for bad in ("the rule is unclear. The rule says", "the sources are silent, mostly. The rule says",
                    "the sources are silent; nobody knows. The rule says", "The sources are silent. The rule says",
                    "The rule says"):
            with self.subTest(why=bad):
                text = questions_with("the sources are silent; it turns on a choice the state has not published. "
                                      "The rule says", bad)
                self.assertFails(self.check_questions(text), OPEN_QUESTIONS, 7, "Why it is open starts with")

    def test_each_of_the_four_reasons_passes_alone_or_with_others(self):
        for reasons in [[reason] for reason in REASONS] + [list(REASONS)]:
            with self.subTest(reasons=reasons):
                text = questions_with("the sources are silent; it turns on a choice the state has not published.",
                                      "; ".join(reasons) + ".")
                self.assertPasses(self.check_questions(text))

    def test_prose_before_the_first_question_passes_and_prose_inside_one_fails(self):
        self.assertPasses(self.check_questions(questions_with("Synthetic fixture text.\n",
                                                              "Synthetic fixture text.\n\nMore prose.\n")))
        self.assertFails(self.check_questions(questions_with(NOTE, NOTE + "\nA stray paragraph.\n")),
                         OPEN_QUESTIONS, 15, "only blank lines and headings come between questions")


if __name__ == "__main__":
    unittest.main()
