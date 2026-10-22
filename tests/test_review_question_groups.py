"""Tests of how the open questions page groups the questions by why each is open: the four groups in their order,
each with its sentence, the conflicts first; which group a question goes in, decided from its reasons and then from
who can answer it; file order within a group; an empty group left out; and every question shown once. The owner
decided on 2026-10-22 that conflicts come first. The fixture is test_review_pages.py's with the open questions below.
Its wording is illustration, not a checked statement of any rule.
"""

from __future__ import annotations

import re
import unittest

from test_review_pages import OPEN_QUESTIONS, GeneratorTestCase, fixture

OPENING = ("Each is a policy question only CMS, a state or a policy person can answer, and the rows it names wait on "
           "the answer. They are grouped by why they are open, with conflicts first, since there two sources say "
           "different things.")
CONFLICTS = ("## Where the sources conflict\n\nTwo sources say different things, and HourKeep does not pick a side "
             "until someone who can decide says which governs.\n")
FEDERAL = ("## Questions about the federal rule\n\nThe federal rule raises these and does not answer them. CMS can "
           "settle them, and anyone who knows how CMS reads its rule can help.\n")
STATE_RULES = ("## Questions about a state's own rules\n\nA state's own rules or its Medicaid agency's pages leave "
               "these unclear. The state's Medicaid agency can settle them.\n")
STATE_CHOICE = ("## Waiting on a choice a state has not published\n\nThe federal rule lets a state choose, and no "
                "stored source says what the state chose. The state's adopted rules, or its Medicaid agency, can "
                "settle these.\n")
GROUPS = (CONFLICTS, FEDERAL, STATE_RULES, STATE_CHOICE)


def question(heading: str, why: str, who: str) -> str:
    return "\n".join([
        "### " + heading,
        "",
        "- Why it is open: " + why,
        "- Who can answer: " + who,
        "- Raised: 2026-10-17, by row notice-response-period",
        '- Source: docs/domain/sources/ecfr/2026-10-14/42-cfr-431.221.xml:3 "not to exceed 90 days"',
        "",
    ])


# Each question's heading, its group and its text, in file order, which mixes the groups.
QUESTIONS = (
    ("Which path did the state take?", STATE_CHOICE,
     question("Which path did the state take?", "it turns on a choice the state has not published. Two paths.",
              "Colorado's HCPF, or CMS")),
    ("Are the 30 days calendar days?", FEDERAL,
     question("Are the 30 days calendar days?", "the sources are silent. The rule does not say.", "CMS")),
    ("Which 10 days govern in Colorado?", CONFLICTS,
     question("Which 10 days govern in Colorado?", "the sources conflict. Two rules count differently.",
              "Colorado's HCPF")),
    ("Is the state's notice date the date it is mailed?", STATE_RULES,
     question("Is the state's notice date the date it is mailed?", "the sources are silent. The rule says neither.",
              "Colorado's HCPF")),
    ("Which renewal option applies where a plan records no choice?", STATE_CHOICE,
     question("Which renewal option applies where a plan records no choice?",
              "the sources are silent; it turns on a choice the state has not published. No default.",
              "CMS, or Colorado's HCPF for Colorado")),
    ("May an appeals entity hear the case?", FEDERAL,
     question("May an appeals entity hear the case?", "the sources are silent. The rule does not say.",
              "CMS, or Colorado's HCPF for Colorado")),
    ("Which governs renewals, 12 months or 6?", CONFLICTS,
     question("Which governs renewals, 12 months or 6?", "the sources conflict. The regulation and the statute "
              "differ.", "CMS")),
    ("Is a notice of noncompliance a notice of action?", FEDERAL,
     question("Is a notice of noncompliance a notice of action?", "the answer may be in a provision the corpus has "
              "not stored. The section is not stored.", "CMS")),
)


def questions_text(chosen) -> str:
    return "# Open questions\n\nSynthetic questions.\n\n" + "\n".join(text for _, _, text in chosen)


def grouped_fixture():
    corpus = fixture()
    corpus.files[OPEN_QUESTIONS] = questions_text(QUESTIONS)
    return corpus


class QuestionGroupsTest(GeneratorTestCase):
    corpus_factory = staticmethod(grouped_fixture)

    def section(self, page: str, group: str) -> str:
        """The part of the page under `group`, up to the next ## heading."""
        start = page.index(group) + len(group)
        following = page.find("\n## ", start)
        return page[start:] if following == -1 else page[start:following + 1]

    def test_adds_the_sentence_on_grouping_to_the_opening_paragraph(self):
        self.assertIn("\n\n" + OPENING + "\n\n", self.page("open-questions.md"))

    def test_gives_the_four_groups_in_order_each_with_its_sentence_after_the_opening(self):
        page = self.page("open-questions.md")
        order = [page.index(OPENING)] + [page.index("\n" + group + "\n") for group in GROUPS]
        self.assertEqual(order, sorted(order))
        self.assertEqual(re.findall(r"(?m)^## .*$", page), [group.split("\n")[0] for group in GROUPS])

    def test_puts_each_question_under_its_group_as_a_level_three_heading_with_its_text_unchanged(self):
        page = self.page("open-questions.md")
        for heading, group, _ in QUESTIONS:
            with self.subTest(question=heading):
                self.assertIn("\n### " + heading + "\n", self.section(page, group))
                self.assertNotIn("\n## " + heading + "\n", page)

    def test_keeps_file_order_within_each_group(self):
        page = self.page("open-questions.md")
        for group in GROUPS:
            with self.subTest(group=group.split("\n")[0]):
                section = self.section(page, group)
                shown = re.findall(r"(?m)^### (.*)$", section)
                self.assertEqual(shown, [heading for heading, in_group, _ in QUESTIONS if in_group == group])

    def test_a_state_choice_among_the_reasons_goes_to_its_group_before_who_can_answer(self):
        page = self.page("open-questions.md")
        self.assertIn("\n### Which renewal option applies where a plan records no choice?\n",
                      self.section(page, STATE_CHOICE))

    def test_a_silent_source_that_cms_can_answer_first_goes_to_the_federal_group(self):
        page = self.page("open-questions.md")
        self.assertIn("\n### May an appeals entity hear the case?\n", self.section(page, FEDERAL))

    def test_a_conflict_goes_to_the_conflicts_whoever_can_answer(self):
        page = self.page("open-questions.md")
        self.assertIn("\n### Which 10 days govern in Colorado?\n", self.section(page, CONFLICTS))

    def test_shows_every_question_once(self):
        page = self.page("open-questions.md")
        shown = re.findall(r"(?m)^### (.*)$", page)
        self.assertEqual(len(shown), len(QUESTIONS))
        self.assertEqual(sorted(shown), sorted(heading for heading, _, _ in QUESTIONS))

    def test_leaves_out_a_group_with_no_question(self):
        self.corpus.files[OPEN_QUESTIONS] = questions_text([entry for entry in QUESTIONS if entry[1] != STATE_RULES])
        self.corpus.write(self.root)
        page = self.page("open-questions.md")
        self.assertNotIn("## Questions about a state's own rules", page)
        self.assertNotIn("A state's own rules or its Medicaid agency's pages", page)
        self.assertEqual(re.findall(r"(?m)^## .*$", page),
                         [group.split("\n")[0] for group in GROUPS if group != STATE_RULES])


if __name__ == "__main__":
    unittest.main()
