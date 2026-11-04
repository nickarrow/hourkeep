"""Tests that the open questions and the rows name each other, as the Formats section of
docs/epics/0001-policy-corpus/design.md says under "The checker": every word in a question's Raised shaped like an
identifier names a row, and every row whose Rule or Note says "open question" is named in some question's Raised, so
a question deleted while its rows still wait on it fails. Full review 2026-10-29, mechanism note 3. The fixture is
corpus_fixture.py's valid corpus, whose one question raises both rows.
"""

from __future__ import annotations

import unittest

from corpus_fixture import (
    EXTRACT, EXTRACT_TEXT, OPEN_QUESTIONS, OPEN_QUESTIONS_TEXT, Corpus, CorpusTestCase, extract_with, run_checker,
)

RAISED_LINE = 10  # the valid question's Raised line, as corpus_fixture.py gives it
RAISED = "- Raised: 2026-10-17, by rows notice-response-period and hearing-request-period\n"
FIRST_ROW_LINE = EXTRACT_TEXT.split("\n").index("### hearing-request-period") + 1
SECOND_ROW_LINE = EXTRACT_TEXT.split("\n").index("### notice-response-period") + 1
NO_QUESTIONS = "# Open questions\n\nQuestions only CMS, a state or a policy person can answer.\n"


def questions_with(old: str, new: str) -> str:
    if old not in OPEN_QUESTIONS_TEXT:
        raise AssertionError("fixture text not found: " + repr(old))
    return OPEN_QUESTIONS_TEXT.replace(old, new, 1)


def raising_first_row() -> Corpus:
    """The valid corpus with the first row's Note saying it waits on an open question, which the valid question's
    Raised already names."""
    corpus = Corpus()
    corpus.files[EXTRACT] = extract_with("- Note: Synthetic fixture row.\n",
                                         "- Note: Synthetic fixture row. Whether the time differs by state is an "
                                         "open question.\n")
    return corpus


class RaisedNamesRowsTest(CorpusTestCase):
    def test_a_raised_word_shaped_like_an_identifier_that_names_no_row_fails_at_its_line(self):
        corpus = Corpus()
        corpus.files[OPEN_QUESTIONS] = questions_with(
            RAISED, "- Raised: 2026-10-17, by rows notice-response-period and hearing-request-perod\n")
        self.assertFails(run_checker(corpus), OPEN_QUESTIONS, RAISED_LINE, "hearing-request-perod names no row")

    def test_a_date_a_finding_a_number_with_a_hyphen_and_plain_words_in_raised_are_not_taken_for_identifiers(self):
        corpus = Corpus()
        corpus.files[OPEN_QUESTIONS] = questions_with(
            RAISED, "- Raised: 2026-10-17, by rows notice-response-period and hearing-request-period, as ledger "
                    "L1-4 found\n  of the 12-month limit in 1:26-cv-12962\n")
        self.assertPasses(run_checker(corpus))

    def test_a_hyphenated_word_starting_with_a_letter_is_taken_for_an_identifier(self):
        corpus = Corpus()
        corpus.files[OPEN_QUESTIONS] = questions_with(
            RAISED, "- Raised: 2026-10-17, by rows notice-response-period and hearing-request-period, on "
                    "self-attestation\n")
        self.assertFails(run_checker(corpus), OPEN_QUESTIONS, RAISED_LINE, "self-attestation names no row")


class RowsWaitingOnAQuestionTest(CorpusTestCase):
    def test_a_row_saying_open_question_that_a_question_raises_passes(self):
        self.assertPasses(run_checker(raising_first_row()))

    def test_deleting_the_question_such_a_row_waits_on_fails_at_the_row(self):
        corpus = raising_first_row()
        corpus.files[OPEN_QUESTIONS] = NO_QUESTIONS
        self.assertFails(run_checker(corpus), EXTRACT, FIRST_ROW_LINE,
                         "hearing-request-period says open question, and no open question's Raised names it")

    def test_a_row_saying_open_question_in_its_rule_counts_too(self):
        corpus = Corpus()
        corpus.files[EXTRACT] = extract_with(
            "- Rule: A person has 30 calendar days to respond to a notice of noncompliance.\n",
            "- Rule: A person has 30 calendar days to respond to a notice of noncompliance. What they count from is "
            "an Open question.\n")
        corpus.files[OPEN_QUESTIONS] = questions_with(
            RAISED, "- Raised: 2026-10-17, by row hearing-request-period\n")
        self.assertFails(run_checker(corpus), EXTRACT, SECOND_ROW_LINE,
                         "notice-response-period says open question, and no open question's Raised names it")

    def test_a_missing_open_questions_file_is_reported_once_and_not_at_each_row(self):
        corpus = raising_first_row()
        corpus.files[OPEN_QUESTIONS] = None
        result = run_checker(corpus)
        self.assertFails(result, OPEN_QUESTIONS, 0, "the open questions are missing")
        self.assertNotIn("says open question", result.stdout)


if __name__ == "__main__":
    unittest.main()
