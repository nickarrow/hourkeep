"""Tests of what the review pages say to a reviewer before any row: the landing page's warnings, comment routes, names
and words, and the line under the title of every other page that says not to send anything about a real person.
The fixture is test_review_pages.py's.
"""

from __future__ import annotations

import unittest

from test_review_pages import FORM, REVIEW, GeneratorTestCase

REAL_CASE = "Never post or send anything about a real person's case."


class LandingPageTest(GeneratorTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.readme = self.page("README.md")
        self.prose = " ".join(self.readme.split())  # wrapped lines joined, as a reader reads them

    def test_says_not_to_post_a_real_case_and_what_hourkeep_is_not(self):
        for sentence in (REAL_CASE, "HourKeep is not part of any government.", "Nothing here is legal advice."):
            with self.subTest(sentence=sentence):
                self.assertIn(sentence, self.prose)

    def test_links_all_three_ways_to_comment(self):
        self.assertIn("[On GitHub](https://github.com/nickarrow/hourkeep/issues/new?template=row-review.yml)",
                      self.prose)
        self.assertIn("[The comment form on Google Forms](" + FORM + "), with no account or sign-in.", self.prose)
        self.assertIn("[policy@hourkeep.app](mailto:policy@hourkeep.app)", self.prose)

    def test_says_which_way_if_this_row_were_wrong_points_after_the_three_things_to_check(self):
        sentence = ('"If this row were wrong" tells which way a mistake in the row would push a person on Medicaid: '
                    "toward doing less than the rules ask of them, or toward doing more.")
        self.assertIn(sentence, self.prose)
        self.assertIn("A row where a mistake would change only a citation, a date or context says so.", self.prose)
        self.assertLess(self.prose.index("For each row, check three things:"), self.prose.index(sentence))

    def test_says_a_mistake_would_hurt_a_person_on_medicaid(self):
        self.assertEqual(self.prose.count("which way a mistake would hurt a person on Medicaid"), 2)
        self.assertNotIn("hurt someone", self.prose)

    def test_says_under_how_to_comment_that_the_code_of_conduct_applies_and_links_it(self):
        start = self.prose.index("## How to comment")
        section = self.prose[start:self.prose.index("## What happens to your comment", start)]
        self.assertIn("Everyone who comments, in any of the three ways, follows HourKeep's "
                      "[code of conduct](../../CODE_OF_CONDUCT.md). Report a breach of it to "
                      "[conduct@hourkeep.app](mailto:conduct@hourkeep.app).", section)

    def test_says_what_name_to_give_in_a_comment(self):
        for sentence in ("Every row has a short name, such as `notice-response-period`, shown as its heading.",
                         "A state fact's name adds its state, such as `co: hearing-request-window-at-most-90-days`.",
                         "An open question's name is its title.",
                         "If you comment by email, or on the comment form opened from this page, give that name."):
            with self.subTest(sentence=sentence):
                self.assertIn(sentence, self.prose)

    def test_says_how_to_ask_for_credit(self):
        self.assertIn("It is posted without your name unless you ask to be credited: tick the box on GitHub or on the "
                      "comment form, or say so in your email.", self.prose)

    def test_defines_the_words_used_on_the_pages(self):
        section = self.prose[self.prose.index("## Words used on these pages"):]
        for term in ("- **Stored text**: the copy of an official text kept in this repository, so a check can be "
                     "repeated.",
                     "- **HCPF**: Colorado's Department of Health Care Policy and Financing, which runs Health First "
                     "Colorado, the state's Medicaid program.",
                     "](../domain/research/2026-10-16-policy/ledger.md)",
                     "- **The rule extract**:",
                     "- **Corpus**: HourKeep's collection of policy rows, state facts, open questions and the stored "
                     "copies of their sources, kept in [docs/domain/](../domain/)."):
            with self.subTest(term=term):
                self.assertIn(term, section)
        self.assertIn("L5-3", section)
        self.assertIn("the date the eCFR text was read", section)

    def test_stays_short_enough_to_read_on_a_phone(self):
        self.assertLessEqual(len(self.readme.split("\n")), 80)


class PageHeaderTest(GeneratorTestCase):
    def test_every_other_page_says_not_to_post_a_real_case_under_its_title_after_the_generated_line(self):
        for name in ("fair-hearings.md", "open-questions.md", "state-facts.md"):
            with self.subTest(page=name):
                lines = self.page(name).split("\n")
                self.assertTrue(lines[0].startswith("# "))
                self.assertIn("generated from", lines[2].lower())
                self.assertEqual(lines[3:6], ["", REAL_CASE, ""])


if __name__ == "__main__":
    unittest.main()
