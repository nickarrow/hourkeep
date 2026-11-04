"""Tests of a topic page's orientation, as the Formats section of docs/epics/0001-policy-corpus/design.md says under
"The review pages": every word in it shaped like an identifier must name a row, and each "open question" in it links
to the question ORIENTATION_QUESTIONS names for it, at that question's heading on the open questions page, where the
anchor is the one GitHub gives the heading. A word that names no row, a title that is not an open question still
open on the page, a count of named questions other than the paragraph's, or more than one "open question" with none
named stops the build. Full review 2026-10-29, mechanism should fix 1 and cold reader 2; fix check 2026-11-04,
mechanism should fix 1, 2 and 4. The fixture is test_review_pages.py's, with a second open question and a question
moved to the state facts added here.
"""

from __future__ import annotations

import unittest

from test_review_pages import OPEN_QUESTIONS, OPEN_QUESTIONS_TEXT, REVIEW, GeneratorTestCase, fixture, load_generator

FIRST = "Are the 30 days calendar days?"
SECOND = "Who sets the time to ask for a hearing, in a state's own rules?"
MOVED = "Which hearing window did Colorado choose?"
SECOND_QUESTION = """
### Who sets the time to ask for a hearing, in a state's own rules?

- Why it is open: the sources are silent. The rule sets only a ceiling.
- Who can answer: Colorado's HCPF
- Raised: 2026-10-17, by row hearing-request-period
- Source: docs/domain/sources/ecfr/2026-10-14/42-cfr-431.221.xml:3 "not to exceed 90 days"

### Which hearing window did Colorado choose?

- Moved: 2026-10-23, to the state fact co: hearing-request-period.
"""
ONE_QUESTION = "The time to answer is an open question."
TWO_QUESTIONS = ("The time to answer is an open question, and who sets the time to ask for a hearing is another open "
                 "question.")


def with_two_questions():
    corpus = fixture()
    corpus.files[OPEN_QUESTIONS] = OPEN_QUESTIONS_TEXT + SECOND_QUESTION
    return corpus


class OrientationTest(GeneratorTestCase):
    corpus_factory = staticmethod(with_two_questions)

    def topic_page(self, orientation: str, questions=None) -> str:
        made = load_generator().build(self.root, orientation={"fair-hearings": orientation},
                                      orientation_questions={} if questions is None
                                      else {"fair-hearings": questions})
        return made[REVIEW + "fair-hearings.md"].decode("utf-8")

    def assertStops(self, orientation: str, questions, words: str) -> None:
        with self.assertRaises(ValueError) as stopped:
            self.topic_page(orientation, questions)
        self.assertIn(words, str(stopped.exception))

    def test_each_open_question_links_to_the_question_named_for_it_in_order(self):
        page = self.topic_page(TWO_QUESTIONS, (FIRST, SECOND))
        self.assertIn("The time to answer is an [open question](open-questions.md#are-the-30-days-calendar-days), and "
                      "who sets the time to ask for a hearing is another [open question](open-questions.md"
                      "#who-sets-the-time-to-ask-for-a-hearing-in-a-states-own-rules).", page)

    def test_with_no_questions_named_its_one_open_question_links_to_the_page(self):
        page = self.topic_page(ONE_QUESTION)
        self.assertIn("The time to answer is an [open question](open-questions.md).", page)

    def test_more_than_one_open_question_with_none_named_stops_the_build(self):
        self.assertStops(TWO_QUESTIONS, None, "holds 2 'open question' and names 0 questions")

    def test_a_named_question_that_is_not_on_the_page_stops_the_build(self):
        self.assertStops(TWO_QUESTIONS, (FIRST, "Are the 30 days business days?"),
                         "Are the 30 days business days?")

    def test_a_named_question_that_moved_to_the_state_facts_stops_the_build(self):
        self.assertStops(TWO_QUESTIONS, (FIRST, MOVED), "not open questions on the open questions page: " + MOVED)

    def test_naming_more_or_fewer_questions_than_the_paragraph_holds_stops_the_build(self):
        for questions in ((FIRST,), (FIRST, SECOND, FIRST)):
            with self.subTest(questions=questions):
                self.assertStops(TWO_QUESTIONS, questions, "names {} questions".format(len(questions)))

    def test_a_word_shaped_like_an_identifier_that_names_no_row_stops_the_build(self):
        self.assertStops("As notice-response-period and notice-responce-period say.", None, "notice-responce-period")

    def test_a_date_a_number_with_a_hyphen_or_a_word_without_one_is_not_taken_for_an_identifier(self):
        page = self.topic_page("On 2026-10-29 the 12-month rule of 1:26-cv-12962, as notice-response-period says, "
                               "stood.")
        self.assertIn("On 2026-10-29 the 12-month rule of 1:26-cv-12962, as [notice-response-period](fair-hearings.md"
                      "#notice-response-period) says, stood.", page)


class HeadingAnchorTest(unittest.TestCase):
    def test_gives_the_anchor_github_gives_a_heading(self):
        cases = [
            (FIRST, "are-the-30-days-calendar-days"),
            ("Does the vacatur of the impairment words in the definition of medically frail reach the states that did "
             "not sue, in CMS's practice?",
             "does-the-vacatur-of-the-impairment-words-in-the-definition-of-medically-frail-reach-the-states-that-did-"
             "not-sue-in-cmss-practice"),
            ("Which describes the six months in Massachusetts v. Oz: the order's bar on penalties, or the "
             "memorandum's stay?",
             "which-describes-the-six-months-in-massachusetts-v-oz-the-orders-bar-on-penalties-or-the-memorandums-"
             "stay"),
            ("A - B and § 435.554(c)(3)", "a---b-and--435554c3"),
        ]
        for heading, anchor in cases:
            with self.subTest(heading=heading):
                self.assertEqual(load_generator().links.heading_anchor(heading), anchor)


if __name__ == "__main__":
    unittest.main()
