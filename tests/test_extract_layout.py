"""Tests of the extract's layout: where prose, topics and rows may go, a row's fields and their order, and
continuation lines. The fixture is corpus_fixture.py."""

from __future__ import annotations

import unittest

from corpus_fixture import (
    COLORADO, Corpus, CorpusTestCase, EXTRACT, EXTRACT_TEXT, TOPIC, extract_with, load_checker, run_checker,
    topic_with,
)


class ExtractLayoutTest(CorpusTestCase):
    """Formats, "A rule row" and "The checker reads a row this way": where prose, topics and rows may go.

    Line numbers below are the valid extract's: 1 title, 3 introduction, 5 the topic, 7 the first row's heading,
    9 and 10 its Rule, 18 its Note, 20 the second row's heading, 22 to 29 its fields.
    """

    def test_a_missing_extract_fails(self):
        result = self.check_extract(None)
        self.assertFails(result, EXTRACT, 0, "the extract is missing")

    def test_an_extract_git_ignores_fails_as_missing(self):
        # Formats: the checker skips anything git ignores, and a missing extract fails.
        corpus = Corpus()
        corpus.files[".gitignore"] = EXTRACT + "\n"
        self.assertFails(run_checker(corpus), EXTRACT, 0, "the extract is missing")

    def test_an_extract_git_lists_but_the_disk_lacks_fails_as_missing(self):
        # Formats: a missing extract fails. Once committed, a deleted extract is still listed by git, as this staged
        # one is, so the checker finds it missing when it reads it.
        corpus = Corpus()
        corpus.deleted.append(EXTRACT)
        self.assertFails(run_checker(corpus), EXTRACT, 0, "the extract is missing")

    def test_the_extract_must_open_with_a_title(self):
        result = self.check_extract(extract_with("# Community engagement extract\n", "Community engagement extract\n"))
        self.assertFails(result, EXTRACT, 1, "opens with a # title")

    def test_the_extract_must_have_an_introduction(self):
        result = self.check_extract(extract_with("The rows below restate the rules on notices of noncompliance and "
                                                 "fair hearings, one rule per row.\n\n", ""))
        self.assertFails(result, EXTRACT, 3, "introduction")

    def test_a_longer_introduction_passes(self):
        result = self.check_extract(extract_with("one rule per row.\n", "one rule per row.\n\nA second paragraph.\n"))
        self.assertPasses(result)

    def test_prose_under_a_topic_fails(self):
        result = self.check_extract(extract_with("hearings\n\n### hearing", "hearings\n\nSome prose.\n\n### hearing"))
        self.assertFails(result, EXTRACT, 7, "a ## topic holds only rows")

    def test_a_row_before_the_first_topic_fails(self):
        text = extract_with("## Notices of noncompliance and fair hearings\n\n", "")
        text = text.replace("### notice-response-period", "## Notices\n\n### notice-response-period", 1)
        result = self.check_extract(text)
        self.assertFails(result, EXTRACT, 5, "comes before the first ## topic")

    def test_a_second_topic_passes(self):
        result = self.check_extract(extract_with("### notice-response-period", "## Another topic\n\n"
                                                 "### notice-response-period"))
        self.assertPasses(result)

    def test_another_heading_level_after_the_introduction_fails(self):
        result = self.check_extract(extract_with("### notice-response-period", "#### notice-response-period"))
        self.assertFails(result, EXTRACT, 20, "only ## topics and ### rows")

    def test_an_identifier_with_digits_passes(self):
        corpus = Corpus()
        corpus.files[EXTRACT] = extract_with("### notice-response-period", "### notice-response-period-30")
        corpus.states[COLORADO]["facts"][0]["row"] = "notice-response-period-30"  # the fact follows its row
        corpus.files[TOPIC] = topic_with("[notice-response-period]", "[notice-response-period-30]")  # so does its item
        self.assertPasses(run_checker(corpus))

    def test_a_malformed_identifier_fails(self):
        for bad in ("Notice-response-period", "notice--response-period", "notice_response", "notice-", "notice period"):
            with self.subTest(identifier=bad):
                result = self.check_extract(extract_with("### notice-response-period", "### " + bad))
                self.assertFails(result, EXTRACT, 20, "is not an identifier")

    def test_an_identifier_used_twice_fails(self):
        result = self.check_extract(extract_with("### notice-response-period", "### hearing-request-period"))
        self.assertFails(result, EXTRACT, 20, "used twice")

    def test_several_blank_lines_between_rows_pass(self):
        result = self.check_extract(extract_with("### notice-response-period", "\n\n### notice-response-period"))
        self.assertPasses(result)

    def test_a_blank_line_inside_a_row_fails(self):
        result = self.check_extract(extract_with("- Tier: regulation\n- State election: no", "- Tier: regulation\n\n"
                                                 "- State election: no"))
        self.assertFails(result, EXTRACT, 27, "blank line inside a row")

    def test_text_between_rows_fails(self):
        result = self.check_extract(extract_with("Synthetic fixture row.\n\n", "Synthetic fixture row.\n\nStray text.\n\n"))
        self.assertFails(result, EXTRACT, 20, "only blank lines and headings come between rows")

    def test_text_between_a_heading_and_its_fields_fails(self):
        result = self.check_extract(extract_with("### notice-response-period\n\n", "### notice-response-period\n\n"
                                                 "Stray text.\n"))
        self.assertFails(result, EXTRACT, 22, "is not a field")


class RowFieldsTest(CorpusTestCase):
    """Formats, "A rule row" and "The checker reads a row this way": the fields of a row and their order."""

    def test_an_item_that_is_not_name_colon_value_fails(self):
        result = self.check_extract(extract_with("- Tier: regulation\n- State election: no", "- Tier regulation\n"
                                                 "- State election: no"))
        self.assertFails(result, EXTRACT, 25, "is not a field")

    def test_an_unlisted_field_name_fails(self):
        result = self.check_extract(extract_with("- Note: Synthetic", "- Comment: Synthetic"))
        self.assertFails(result, EXTRACT, 18, "unlisted field")

    def test_a_missing_required_field_fails(self):
        for name, line in (("Rule", 22), ("Citation", 23), ("Source", 24), ("Tier", 25), ("State election", 26),
                           ("Verified", 27), ("Error direction", 28), ("Recheck", 29)):
            with self.subTest(field=name):
                lines = EXTRACT_TEXT.split("\n")
                index = next(i for i in range(21, len(lines)) if lines[i].startswith("- " + name + ":"))
                del lines[index]
                result = self.check_extract("\n".join(lines))
                self.assertFails(result, EXTRACT, 20, "lacks the " + name + " field")

    def test_an_empty_value_counts_as_missing(self):
        for old, new in (("- Tier: regulation\n- State election: no", "- Tier:\n- State election: no"),
                         ("- Tier: regulation\n- State election: no", "- Tier: \n- State election: no")):
            with self.subTest(line=new.split("\n")[0]):
                result = self.check_extract(extract_with(old, new))
                self.assertFails(result, EXTRACT, 25, "empty, which counts as missing")

    def test_a_required_field_out_of_order_fails(self):
        result = self.check_extract(extract_with("- Tier: regulation\n- State election: no",
                                                 "- State election: no\n- Tier: regulation"))
        self.assertFails(result, EXTRACT, 26, "out of order")

    def test_a_required_field_given_twice_fails(self):
        result = self.check_extract(extract_with("- Tier: regulation\n- State election: no",
                                                 "- Tier: regulation\n- Tier: regulation\n- State election: no"))
        self.assertFails(result, EXTRACT, 26, "more than once")

    def test_source_may_repeat(self):
        result = self.check_extract(extract_with(
            "- Source: not stored, https://www.federalregister.gov/d/C1-2026-11094\n",
            "- Source: not stored, https://www.federalregister.gov/d/C1-2026-11094\n"
            "- Source: not stored, https://www.federalregister.gov/d/2026-11094\n"))
        self.assertPasses(result)

    def test_corrected_may_repeat_and_note_comes_last(self):
        result = self.check_extract(extract_with(
            "- Note: Synthetic fixture row.\n",
            "- Corrected: 2026-10-16: it said 60 days; the ledger found 90\n"
            "- Corrected: 2026-10-17: it cited 431.220; the section is 431.221\n"
            "- Note: Synthetic fixture row.\n"))
        self.assertPasses(result)

    def test_note_given_twice_fails(self):
        result = self.check_extract(extract_with("- Note: Synthetic fixture row.\n",
                                                 "- Note: Synthetic fixture row.\n- Note: Again.\n"))
        self.assertFails(result, EXTRACT, 19, "more than once")

    def test_note_may_come_before_corrected(self):
        result = self.check_extract(extract_with("- Note: Synthetic fixture row.\n",
                                                 "- Note: Synthetic fixture row.\n"
                                                 "- Corrected: 2026-10-16: it said 60 days; the ledger found 90\n"))
        self.assertPasses(result)

    def test_a_required_field_after_note_or_corrected_fails(self):
        result = self.check_extract(extract_with("- Recheck: eCFR amendment; date 2026-12-01: board meeting\n"
                                                 "- Note: Synthetic fixture row.\n",
                                                 "- Note: Synthetic fixture row.\n"
                                                 "- Recheck: eCFR amendment; date 2026-12-01: board meeting\n"))
        self.assertFails(result, EXTRACT, 18, "come last")


class ContinuationTest(CorpusTestCase):
    """Formats: a long value continues on lines indented two spaces, joined to it by a single space."""

    def test_a_value_continued_onto_further_lines_is_joined_by_single_spaces(self):
        checker = load_checker()
        problems = []
        text = extract_with("may not be more\n  than 90 days.", "may not be more\n  than 90\n  days.")
        rows = checker.parse_extract(text.encode("utf-8").split(b"\n")[:-1], problems)
        self.assertEqual(problems, [])
        rule = [field for field in rows[0].fields if field.name == "Rule"][0]
        self.assertEqual(rule.value, "A person may ask for a fair hearing within a reasonable time set by the agency, "
                                     "which may not be more than 90 days.")
        self.assertEqual(rule.line, 9)

    def test_a_continuation_line_indented_otherwise_fails(self):
        for indent in (" ", "   ", "\t"):
            with self.subTest(indent=repr(indent)):
                result = self.check_extract(extract_with("\n  than 90 days.", "\n" + indent + "than 90 days."))
                self.assertFails(result, EXTRACT, 10, "indented two spaces")

    def test_a_continuation_line_beginning_with_a_list_marker_fails(self):
        result = self.check_extract(extract_with("\n  than 90 days.", "\n  - than 90 days."))
        self.assertFails(result, EXTRACT, 10, "never begins with '- '")


if __name__ == "__main__":
    unittest.main()
