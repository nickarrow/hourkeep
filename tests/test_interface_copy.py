"""Tests of the interface copy checker in scripts/check_interface_copy.py.

The rules it enforces are in .kiro/skills/interface-copy/SKILL.md, adapted from the CMS eAPD content guide.
Each test names the rule it covers.
"""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from check_interface_copy import (  # noqa: E402
    check_arithmetic, check_html, check_javascript, check_packet_phrases, is_title_case,
)


def rules(findings) -> list[str]:
    return [f.rule for f in findings]


class TitleCaseTest(unittest.TestCase):
    """COPY-02. Section and subsection titles are title case, apart from small words inside the title."""

    def test_a_title_cased_heading_passes(self):
        for title in ("Notice Details", "Requested Months and Evidence", "Hours and Arithmetic",
                      "A Packet to Send", "Records Described"):
            with self.subTest(title=title):
                self.assertTrue(is_title_case(title))

    def test_a_sentence_cased_heading_fails(self):
        for title in ("Notice details", "Requested months and evidence", "Hours arithmetic"):
            with self.subTest(title=title):
                self.assertFalse(is_title_case(title))

    def test_a_small_word_stays_lowercase_inside_but_not_at_either_end(self):
        self.assertTrue(is_title_case("Months and Evidence"))
        self.assertTrue(is_title_case("The Packet"))          # first word, capitalised
        self.assertFalse(is_title_case("Hours and the"))      # last word, must be capitalised

    def test_an_acronym_and_a_numbered_title_are_left_alone(self):
        self.assertTrue(is_title_case("CMS Notice Details"))
        self.assertTrue(is_title_case("1. Packet Summary"))


class SectionTitleTest(unittest.TestCase):
    """COPY-01 and COPY-03. A title names its screen and fits the navigation."""

    def test_a_title_that_fits_any_screen_is_reported(self):
        js = "const STEPS = ['Overview', 'Notice Details'];\n"
        self.assertIn("COPY-01", rules(check_javascript("f.js", js)))

    def test_a_section_title_over_35_characters_is_reported(self):
        js = "const STEPS = ['%s'];\n" % ("Requested Months and Described Evidence",)
        self.assertIn("COPY-03", rules(check_javascript("f.js", js)))

    def test_a_short_title_cased_step_passes(self):
        js = "const STEPS = ['Notice Details', 'Your Hours'];\n"
        self.assertEqual([], check_javascript("f.js", js))

    def test_a_template_expression_in_a_heading_is_not_judged(self):
        # monthLabel(m) renders at runtime, so its case and length are unknown here.
        js = "<h3>${monthLabel(m)}</h3>"
        self.assertEqual([], check_javascript("f.js", js))


class FieldLabelTest(unittest.TestCase):
    """COPY-04 and COPY-05. A label says what the field is."""

    def test_a_label_opening_with_an_imperative_is_reported(self):
        for label in ("Describe a record", "Enter the notice date", "Select your months"):
            with self.subTest(label=label):
                js = '<legend class="field-label">%s</legend>' % label
                self.assertIn("COPY-04", rules(check_javascript("f.js", js)))

    def test_a_noun_label_passes(self):
        js = '<legend class="field-label">Record Description</legend>'
        self.assertEqual([], check_javascript("f.js", js))

    def test_a_question_label_outside_a_toggle_is_reported(self):
        js = '<legend class="field-label">What months does the notice ask about?</legend>'
        self.assertIn("COPY-05", rules(check_javascript("f.js", js)))


class ProseTest(unittest.TestCase):
    """COPY-06 through COPY-12. Rules that apply to any string a person reads."""

    def test_please_is_reported(self):
        self.assertIn("COPY-06", rules(check_javascript("f.js", "<p>Please enter the date.</p>")))

    def test_an_ampersand_in_copy_is_reported(self):
        self.assertIn("COPY-07", rules(check_javascript("f.js", "<p>Hours & weeks</p>")))

    def test_the_word_percent_is_reported(self):
        self.assertIn("COPY-08", rules(check_javascript("f.js", "<p>50 percent of months</p>")))

    def test_a_spelled_quantity_is_reported(self):
        self.assertIn("COPY-09", rules(check_javascript("f.js", "<p>Sign-in sheet, four pages</p>")))

    def test_the_word_one_is_not_reported(self):
        # "one" is a determiner far more often than a quantity, so flagging it reports correct prose.
        self.assertNotIn("COPY-09", rules(check_javascript("f.js", "<p>Print one packet.</p>")))
        self.assertNotIn("COPY-09", rules(check_javascript("f.js", "<p>Select at least one month.</p>")))

    def test_a_double_space_is_reported(self):
        self.assertIn("COPY-10", rules(check_javascript("f.js", "<p>Enter the date.  Then continue.</p>")))

    def test_a_straight_apostrophe_in_displayed_copy_is_reported(self):
        self.assertIn("COPY-12", rules(check_javascript("f.js", "<p>You can&#39;t see it</p>".replace("&#39;", "'"))))


class ArithmeticTest(unittest.TestCase):
    """COPY-11. Shown arithmetic uses the multiplication sign."""

    def test_the_letter_x_between_two_values_is_reported(self):
        self.assertIn("COPY-11", rules(check_arithmetic("f.js", "`${a.perWeek} x ${a.weeks}`")))
        self.assertIn("COPY-11", rules(check_arithmetic("f.js", "6 x 4 = 24 hours")))

    def test_the_multiplication_sign_passes(self):
        self.assertEqual([], check_arithmetic("f.js", "`${a.perWeek} × ${a.weeks}`"))

    def test_one_line_reports_once(self):
        self.assertEqual(1, len(check_arithmetic("f.js", "`${a} x ${b}` and `${c} x ${d}`")))


class PacketPhraseTest(unittest.TestCase):
    """COPY-13. The export view says what nobody answered."""

    def test_an_invented_empty_phrase_is_reported(self):
        js = "function packetHtml() {\n  return `<p>No activities listed.</p>`;\n}\n"
        self.assertIn("COPY-13", rules(check_packet_phrases("f.js", js)))

    def test_the_two_agreed_phrases_pass(self):
        js = ("function packetHtml() {\n"
              "  return `<p>No response was provided.</p><p>Months not specified.</p>`;\n}\n")
        self.assertEqual([], check_packet_phrases("f.js", js))

    def test_an_empty_phrase_outside_the_packet_is_not_this_rule(self):
        js = "function other() {\n  return `<p>No activities yet.</p>`;\n}\n"
        self.assertEqual([], check_packet_phrases("f.js", js))


class HtmlTest(unittest.TestCase):
    """The prototype's own index.html is checked the same way."""

    def test_a_sentence_cased_heading_in_html_is_reported(self):
        self.assertIn("COPY-02", rules(check_html("i.html", "<h2>Notice details</h2>")))

    def test_prose_rules_run_on_html(self):
        self.assertIn("COPY-06", rules(check_html("i.html", "<p>Please wait</p>")))


if __name__ == "__main__":
    unittest.main()
