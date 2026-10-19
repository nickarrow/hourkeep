"""Tests of the skill, .kiro/skills/medicaid-community-engagement/SKILL.md. The fixture is corpus_fixture.py."""

from __future__ import annotations

import subprocess
import unittest

from corpus_fixture import (
    COUNTS_LINE, Corpus, CorpusTestCase, EXTRACT, RULE_ITEM, SKILL, SKILL_TEXT, extract_with, run_checker, skill_with,
)


class SkillTest(CorpusTestCase):
    """Formats, "The skill". Line numbers are the valid skill's: 2 name, 3 description, 8 ## Rules, 10 its topic,
    12 and 13 the one rule item, 15 ## Precedence, 19 ## Watch list, 21 its one item."""

    def check_skill(self, text) -> subprocess.CompletedProcess:
        corpus = Corpus()
        corpus.files[SKILL] = text
        return run_checker(corpus)

    def test_an_absent_skill_is_reported_and_the_rest_still_checked(self):
        result = self.check_skill(None)
        self.assertPasses(result)
        self.assertIn("the skill is absent", result.stdout)
        self.assertEqual(COUNTS_LINE.search(result.stdout).group(7), "0", result.stdout)
        corpus = Corpus()
        corpus.files[SKILL] = None
        corpus.files[EXTRACT] = extract_with("- Tier: regulation\n- State election: no", "- Tier: rule\n"
                                             "- State election: no")
        self.assertFails(run_checker(corpus), EXTRACT, 25, "rule")

    def test_a_skill_git_ignores_is_reported_absent_and_the_rest_still_checked(self):
        # Formats: the checker skips anything git ignores, and an absent skill is reported and the rest checked.
        corpus = Corpus()
        corpus.files[".gitignore"] = SKILL + "\n"
        result = run_checker(corpus)
        self.assertPasses(result)
        self.assertIn("the skill is absent", result.stdout)
        self.assertEqual(COUNTS_LINE.search(result.stdout).group(7), "0", result.stdout)
        corpus.files[EXTRACT] = extract_with("- Tier: regulation\n- State election: no", "- Tier: rule\n"
                                             "- State election: no")
        result = run_checker(corpus)
        self.assertIn("the skill is absent", result.stdout)
        self.assertFails(result, EXTRACT, 25, "rule")

    def test_the_valid_skill_matches_its_one_rule_item(self):
        result = self.check_skill(SKILL_TEXT)
        self.assertPasses(result)
        self.assertEqual(COUNTS_LINE.search(result.stdout).group(7), "1", result.stdout)

    def test_name_must_equal_the_folder_name(self):
        result = self.check_skill(skill_with("name: medicaid-community-engagement", "name: medicaid-rules"))
        self.assertFails(result, SKILL, 2, "medicaid-community-engagement")

    def test_a_missing_name_or_frontmatter_fails(self):
        result = self.check_skill(skill_with("name: medicaid-community-engagement\n", ""))
        self.assertFails(result, SKILL, 0, "name")
        result = self.check_skill(SKILL_TEXT.split("---\n", 2)[2])
        self.assertFails(result, SKILL, 0, "frontmatter")

    def test_a_frontmatter_with_no_closing_line_fails(self):
        # Formats: the frontmatter holds name and description between --- lines.
        result = self.check_skill(skill_with("exemptions.\n---\n", "exemptions.\n"))
        self.assertFails(result, SKILL, 0, "the skill's frontmatter has no closing --- line")

    def test_an_empty_or_missing_description_fails(self):
        for old, line in (("Use when a person asks about Medicaid work requirements, letters, deadlines and "
                           "exemptions.", 3),
                          ("description: Use when a person asks about Medicaid work requirements, letters, deadlines "
                           "and exemptions.\n", 0)):
            with self.subTest(old=old[:20]):
                self.assertFails(self.check_skill(skill_with(old, "")), SKILL, line, "description")

    def test_500_lines_pass_and_501_fail(self):
        padding_500 = "\n" * (500 - SKILL_TEXT.count("\n"))
        self.assertPasses(self.check_skill(SKILL_TEXT + padding_500))
        self.assertFails(self.check_skill(SKILL_TEXT + padding_500 + "\n"), SKILL, 0, "500 lines")

    def test_a_skill_without_a_rules_heading_fails(self):
        # Formats: rule items sit under a ## Rules heading. A heading that is not exactly that would switch off every
        # rule item's citation and number checks, so it fails rather than passing with 0 skill items.
        for heading in ("## Rule\n", "##  Rules\n", "### Rules\n", ""):
            with self.subTest(heading=heading):
                result = self.check_skill(skill_with("## Rules\n", heading))
                self.assertFails(result, SKILL, 0, "no ## Rules heading")

    def test_the_precedence_and_watch_list_headings_must_appear_exactly(self):
        for old, new, heading in (("## Precedence\n", "", "## Precedence"),
                                  ("## Precedence\n", "## precedence\n", "## Precedence"),
                                  ("## Watch list\n", "## Watch List\n", "## Watch list"),
                                  ("## Watch list\n", "", "## Watch list")):
            with self.subTest(new=new or "removed", heading=heading):
                result = self.check_skill(skill_with(old, new))
                self.assertFails(result, SKILL, 0, "the skill has no {} heading".format(heading))

    def test_a_rule_item_not_under_a_topic_heading_fails(self):
        result = self.check_skill(skill_with("### Fair hearings\n\n" + RULE_ITEM, RULE_ITEM + "\n### Fair hearings\n"))
        self.assertFails(result, SKILL, 10, "a rule item sits under a ### heading")

    def test_a_rule_item_with_no_words_before_its_identifier_fails(self):
        for item in ("- [hearing-request-period] 42 CFR 431.221(d); eCFR 2026-10-14\n",
                     "-   [hearing-request-period] 42 CFR 431.221(d); eCFR 2026-10-14\n"):
            with self.subTest(item=item):
                result = self.check_skill(skill_with(RULE_ITEM, item))
                self.assertFails(result, SKILL, 12, "words before its identifier")

    def test_a_rule_item_continuation_indented_otherwise_fails(self):
        for indent in (" ", "   ", "\t"):
            with self.subTest(indent=repr(indent)):
                result = self.check_skill(skill_with(RULE_ITEM, RULE_ITEM.replace("\n  [", "\n" + indent + "[")))
                self.assertFails(result, SKILL, 13, "indented exactly two spaces")

    def test_a_rules_heading_with_no_rule_items_under_it_fails(self):
        for replacement in ("", "You can ask for a fair hearing within 90 days.\n"):
            with self.subTest(replacement=replacement):
                result = self.check_skill(skill_with(RULE_ITEM, replacement))
                self.assertFails(result, SKILL, 8, "no rule items under ## Rules")

    def test_a_bracketed_letter_or_number_anywhere_fails(self):
        for old, new, line, bracketed in (("deadlines and exemptions.", "deadlines and exemptions [x].", 3, "[x]"),
                                          ("The regulation wins", "The regulation [1] wins", 17, "[1]")):
            with self.subTest(bracketed=bracketed):
                result = self.check_skill(skill_with(old, new))
                self.assertFails(result, SKILL, line, bracketed + " names no row")

    def test_a_rule_item_without_an_identifier_fails(self):
        result = self.check_skill(skill_with(RULE_ITEM, RULE_ITEM + "- A rule with no row.\n"))
        self.assertFails(result, SKILL, 14, "[identifier] citation")

    def test_a_rule_item_on_one_line_passes(self):
        self.assertPasses(self.check_skill(skill_with(RULE_ITEM, RULE_ITEM.replace(".\n  [", ". ["))))

    def test_a_rule_item_under_rules_without_a_topic_heading_is_still_checked(self):
        result = self.check_skill(skill_with("### Fair hearings\n\n", "- No row here.\n\n### Fair hearings\n\n"))
        self.assertFails(result, SKILL, 10, "[identifier] citation")

    def test_items_outside_rules_are_not_rule_items(self):
        result = self.check_skill(skill_with("## Precedence\n", "## Precedence\n\n- 1 regulation outranks 2 pages.\n"))
        self.assertPasses(result)
        self.assertEqual(COUNTS_LINE.search(result.stdout).group(7), "1", result.stdout)

    FENCE = "\n```sh\n# run from the repository root\n- not an item [no-such-row]\n```\n\n"

    def test_a_fenced_line_cannot_end_rules(self):
        # Formats: a line inside a fenced code block is neither a heading nor a rule item, so a fence cannot end
        # ## Rules. The item after the fence, line 20, is still checked; the bracket scan reads the fence too.
        bad = "- You can ask within 60 days. [hearing-request-period] 42 CFR 431.221(e); eCFR 2026-10-14\n"
        result = self.check_skill(skill_with(RULE_ITEM, RULE_ITEM + self.FENCE + bad))
        self.assertFails(result, SKILL, 20, "citation")
        self.assertFails(result, SKILL, 20, "the number 60")
        self.assertFails(result, SKILL, 17, "[no-such-row] names no row")
        self.assertNotIn("a rule item ends with", result.stdout)  # the fenced list line is not a rule item
        good = RULE_ITEM.replace("never more than 90 days", "at most 90 days")
        result = self.check_skill(skill_with(RULE_ITEM, RULE_ITEM + self.FENCE.replace(" [no-such-row]", "") + good))
        self.assertPasses(result)
        self.assertEqual(COUNTS_LINE.search(result.stdout).group(7), "2", result.stdout)

    def test_a_fenced_heading_cannot_stand_in_for_rules(self):
        # Formats: a fence cannot stand in for ## Rules, in the presence check or the section scan.
        result = self.check_skill(skill_with("## Rules\n", "```\n## Rules\n```\n"))
        self.assertFails(result, SKILL, 0, "the skill has no ## Rules heading")
        self.assertEqual(COUNTS_LINE.search(result.stdout).group(7), "0", result.stdout)

    def test_the_identifier_must_name_a_row(self):
        result = self.check_skill(skill_with("[hearing-request-period] 42", "[hearing-request-periods] 42"))
        self.assertFails(result, SKILL, 13, "hearing-request-periods")

    def test_the_citation_must_equal_the_row_citation_exactly(self):
        for citation in ("42 CFR 431.221(d)", "42 CFR 431.221(d);  eCFR 2026-10-14", "42 CFR 431.221(e); eCFR "
                         "2026-10-14"):
            with self.subTest(citation=citation):
                result = self.check_skill(skill_with("42 CFR 431.221(d); eCFR 2026-10-14", citation))
                self.assertFails(result, SKILL, 12, "citation")

    def test_a_number_not_in_the_row_rule_fails(self):
        for number in ("60", "9", "900", "90.5", "9,0"):
            with self.subTest(number=number):
                result = self.check_skill(skill_with("more than 90 days", "more than {} days".format(number)))
                self.assertFails(result, SKILL, 12, number)

    def test_a_number_in_the_row_rule_passes_whole_against_whole(self):
        corpus = Corpus()
        corpus.files[EXTRACT] = extract_with("than 90 days.", "than 90 days, or 8.8 weeks, or 1,000 hours.")
        corpus.files[SKILL] = skill_with("more than 90 days", "more than 90 days, 8.8 weeks or 1,000 hours")
        self.assertPasses(run_checker(corpus))
        corpus.files[SKILL] = skill_with("more than 90 days", "more than 9 days")
        self.assertFails(run_checker(corpus), SKILL, 12, "9")
        corpus.files[SKILL] = skill_with("more than 90 days", "more than 1 day")
        self.assertFails(run_checker(corpus), SKILL, 12, "1")

    def notice_item(self, words: str) -> str:
        """The valid skill with a second rule item, at line 14, for notice-response-period, `words` before it."""
        return skill_with(RULE_ITEM, RULE_ITEM + "- " + words + "\n  [notice-response-period] 42 CFR 435.558(a)(2); "
                          "91 FR 39030\n")

    def test_a_number_in_a_citation_paragraph_in_the_rule_does_not_count(self):
        # do-it review 2026-10-19: the Rule's "(c)(4)" let a skill item say 4 where the Rule says 30.
        corpus = Corpus()
        corpus.files[EXTRACT] = extract_with("respond to a notice of noncompliance.",
                                             "respond to a notice of noncompliance under paragraph (c)(4).")
        corpus.files[SKILL] = self.notice_item("You have 30 calendar days to respond.")
        self.assertPasses(run_checker(corpus))
        corpus.files[SKILL] = self.notice_item("You have 4 calendar days to respond.")
        self.assertFails(run_checker(corpus), SKILL, 14, "the number 4 is not in notice-response-period's Rule")

    def test_a_number_in_a_citation_paragraph_in_the_skill_does_not_count(self):
        # A number in parentheses straight after a letter, a digit or a closing parenthesis is part of a citation.
        for words in ("You have 30 calendar days to respond, under paragraph (c)(4).",
                      "You have 30 calendar days to respond, under subsection e(14).",
                      "You have 30 calendar days to respond, under section 30(14)."):
            with self.subTest(words=words):
                self.assertPasses(self.check_skill(self.notice_item(words)))

    def test_a_number_in_parentheses_after_a_space_still_counts(self):
        result = self.check_skill(self.notice_item("You have thirty (31) calendar days to respond."))
        self.assertFails(result, SKILL, 14, "the number 31 is not in notice-response-period's Rule")
        result = self.check_skill(self.notice_item("You have thirty (30) calendar days to respond."))
        self.assertPasses(result)

    def test_numbers_after_the_identifier_are_not_checked(self):
        self.assertPasses(self.check_skill(SKILL_TEXT))  # the citation holds 42, 431.221 and 2026, not in the Rule

    def test_a_bracketed_identifier_anywhere_must_name_a_row(self):
        result = self.check_skill(skill_with("2026-12-01 board meeting: [hearing-request-period]",
                                             "2026-12-01 board meeting: [no-such-row]"))
        self.assertFails(result, SKILL, 21, "no-such-row")
        result = self.check_skill(skill_with("The regulation wins", "The [regulation] wins"))
        self.assertFails(result, SKILL, 17, "regulation")

    def test_a_bracketed_word_followed_by_a_parenthesis_or_not_identifier_shaped_passes(self):
        result = self.check_skill(skill_with("The regulation wins", "The [regulation](https://www.ecfr.gov/) and "
                                             "[Some Page] win"))
        self.assertPasses(result)


if __name__ == "__main__":
    unittest.main()
