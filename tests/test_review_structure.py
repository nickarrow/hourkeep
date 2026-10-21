"""Tests of how the review pages are laid out: the topic page's grouped Start here, the two lines of a state's choice
and their links, a state fact's name to give and its folded notes, and the citations linked on the open questions
and state facts pages. The fixture is test_review_pages.py's.
"""

from __future__ import annotations

import unittest

from corpus_fixture import COLORADO, EXTRACT
from test_review_pages import OPEN_QUESTIONS, GeneratorTestCase, comment_line, load_generator

ELECTION = "- State election: yes; the state chooses the time allowed; where it has not chosen, 90 days\n"
DRAFT = "docs/domain/sources/colorado/10-ccr-2505-10-8.100-draft-2026-09-28.pdf"
DRAFT_URL = "https://example.gov/draft-8.100/view"


class StartHereTest(GeneratorTestCase):
    def test_groups_the_rows_under_the_topic_files_headings_in_its_order_each_named_in_words(self):
        page = self.page("fair-hearings.md", start_here={"fair-hearings": ["hearing-request-period",
                                                                          "notice-response-period"]})
        section = ("## Start here\n\n"
                   "- Answering a notice:\n"
                   "  - [notice response period](#notice-response-period)\n"
                   "- Asking for a hearing:\n"
                   "  - [hearing request period](#hearing-request-period)\n\n"
                   "## Answering a notice\n")
        self.assertIn(section, page)

    def test_leaves_out_a_group_with_no_start_here_row_and_adds_no_heading(self):
        page = self.page("fair-hearings.md", start_here={"fair-hearings": ["hearing-request-period"]})
        self.assertIn("## Start here\n\n- Asking for a hearing:\n  - [hearing request period](#hearing-request-period)"
                      "\n\n## Answering a notice\n", page)
        for heading in ("## Answering a notice\n", "## Asking for a hearing\n", "### hearing-request-period\n"):
            with self.subTest(heading=heading):
                self.assertEqual(page.count("\n" + heading), 1)


class StateChoiceTest(GeneratorTestCase):
    def test_a_yes_takes_two_lines_the_states_choice_and_what_applies_where_it_has_not_chosen(self):
        page = self.page("fair-hearings.md")
        self.assertIn("- Can a state choose differently? Yes. The state chooses the time allowed.\n"
                      "- If the state has not chosen: 90 days.\n", page)

    def test_a_no_takes_one_line(self):
        page = self.page("fair-hearings.md")
        section = page[page.index("### notice-response-period\n"):]
        self.assertIn("- Can a state choose differently? No.\n- If this row were wrong:", section)

    def test_links_each_row_identifier_and_the_first_open_question_in_each_line(self):
        election = ("- State election: yes; the state chooses the time allowed, unlike notice-response-period, an "
                    "open question; where it has not chosen, 90 days as for notice-response-period and no-such-row, "
                    "an open question, and another open question\n")
        self.corpus.files[EXTRACT] = self.corpus.files[EXTRACT].replace(ELECTION, election)
        self.corpus.write(self.root)
        row = "[notice-response-period](fair-hearings.md#notice-response-period)"
        question = "[open question](open-questions.md)"
        self.assertIn("- Can a state choose differently? Yes. The state chooses the time allowed, unlike " + row
                      + ", an " + question + ".\n- If the state has not chosen: 90 days as for " + row
                      + " and no-such-row, an " + question + ", and another open question.\n",
                      self.page("fair-hearings.md"))


class StateFactTest(GeneratorTestCase):
    def test_gives_the_name_to_give_before_the_comment_line_and_folds_the_note_after_it(self):
        self.corpus.states[COLORADO]["facts"][0]["note"] = "A synthetic note."
        self.corpus.write(self.root)
        page = self.page("state-facts.md")
        self.assertIn("\n".join([
            "- Checked: 2026-10-17 by an AI agent reading the stored text.",
            "- Name to give in a comment: `co: notice-response-period`",
            comment_line("co:%20notice-response-period"),
            "",
            "<details>",
            "<summary>Notes for checking</summary>",
            "",
            "A synthetic note.",
            "",
            "</details>",
            "",
        ]), page)
        self.assertNotIn("- Note:", page)

    def test_a_fact_with_no_note_has_no_folded_block(self):
        page = self.page("state-facts.md")
        self.assertNotIn("<details>", page)
        self.assertIn("- Name to give in a comment: `federal: hearing-request-period`\n"
                      + comment_line("federal:%20hearing-request-period") + "\n\n## Colorado\n", page)

    def test_links_a_citation_of_colorados_draft_8100_to_the_stored_drafts_address(self):
        self.corpus.manifest["sources"].append({"path": DRAFT, "cited_url": DRAFT_URL, "retrievals": []})
        self.corpus.states[COLORADO]["facts"][0]["citation"] = ("10 CCR 2505-10 8.100.4.G.4.h.iii.2 and "
                                                                "8.100.4.G.4.h.iii.3, draft, not adopted, page 24")
        self.corpus.write(self.root)
        self.assertIn("- From: [10 CCR 2505-10 8.100.4.G.4.h.iii.2](" + DRAFT_URL + ") and 8.100.4.G.4.h.iii.3, "
                      "draft, not adopted, page 24\n", self.page("state-facts.md"))


class OpenQuestionCitationTest(GeneratorTestCase):
    def test_links_every_cfr_and_federal_register_citation_in_a_questions_text(self):
        why = ("- Why it is open: the sources are silent. 42 CFR 435.558(a)(2) and 91 FR 39030 say calendar days,\n"
               "  and 42 CFR 435.558(a)(2) is read with 42 CFR 431.221(d).\n")
        text = self.corpus.files[OPEN_QUESTIONS]
        start = text.index("- Why it is open:")
        self.corpus.files[OPEN_QUESTIONS] = text[:start] + why + text[text.index("- Who can answer:"):]
        self.corpus.write(self.root)
        cfr = ("[42 CFR 435.558(a)(2)](https://www.ecfr.gov/current/title-42/section-435.558"
               "#p-435.558%28a%29%282%29)")
        self.assertIn("- Why it is open: the sources are silent. " + cfr + " and [91 FR 39030]"
                      "(https://www.federalregister.gov/citation/91-FR-39030) say calendar days, and " + cfr
                      + " is read with [42 CFR 431.221(d)](https://www.ecfr.gov/current/title-42/section-431.221"
                      "#p-431.221%28d%29).\n", self.page("open-questions.md"))


def ecfr(words: str, section: str, paragraph: str = "") -> str:
    """The link cite_in_text makes of `words`, naming a title 42 section and, if given, its paragraph."""
    address = "https://www.ecfr.gov/current/title-42/section-" + section
    if paragraph:
        address += "#p-" + section + paragraph.replace("(", "%28").replace(")", "%29")
    return "[" + words + "](" + address + ")"


class ShortenedCitationTest(unittest.TestCase):
    """Bare sections listed after a 42 CFR reference, and section-sign references in a question naming 42 CFR, link
    to title 42. The first two cases are the real texts of two questions in docs/domain/open-questions.md, as raised
    by the review of the review pages, verify.md should-fix 2."""

    def assertLinksInText(self, text: str, expected: str) -> None:
        self.assertEqual(load_generator().links.cite_in_text(text), expected)

    def test_links_the_bare_sections_listed_after_a_42_cfr_reference_and_a_section_sign_reference(self):
        self.assertLinksInText(
            "the sources are silent; the answer may be in a provision the corpus has not stored. None of the four "
            "stored paragraphs of 42 CFR 431.211, 431.221 and 431.231 says calendar days, and 42 CFR 431.201, which "
            "§ 431.206(c)(2) cites for what an action is, is not stored and was not read.",
            "the sources are silent; the answer may be in a provision the corpus has not stored. None of the four "
            "stored paragraphs of " + ecfr("42 CFR 431.211", "431.211") + ", " + ecfr("431.221", "431.221")
            + " and " + ecfr("431.231", "431.231") + " says calendar days, and " + ecfr("42 CFR 431.201", "431.201")
            + ", which " + ecfr("§ 431.206(c)(2)", "431.206", "(c)(2)") + " cites for what an action is, is not "
            "stored and was not read.")

    def test_links_a_section_sign_reference_with_or_without_a_paragraph_and_leaves_paragraph_continuations(self):
        self.assertLinksInText(
            "the sources are silent; the answer may be in a provision the corpus has not stored. 42 CFR 431.210 "
            "covers notices required under § 431.206(c)(2), (c)(3) or (c)(4), and nothing read says whether the "
            "notice of noncompliance is one of them. 42 CFR 431.201, which § 431.206 cites for what an action is, "
            "is not stored and was not read.",
            "the sources are silent; the answer may be in a provision the corpus has not stored. "
            + ecfr("42 CFR 431.210", "431.210") + " covers notices required under "
            + ecfr("§ 431.206(c)(2)", "431.206", "(c)(2)") + ", (c)(3) or (c)(4), and nothing read says whether the "
            "notice of noncompliance is one of them. " + ecfr("42 CFR 431.201", "431.201") + ", which "
            + ecfr("§ 431.206", "431.206") + " cites for what an action is, is not stored and was not read.")

    def test_links_a_listed_bare_section_with_its_paragraph(self):
        self.assertLinksInText("42 CFR 431.211 or 431.231(a).",
                               ecfr("42 CFR 431.211", "431.211") + " or " + ecfr("431.231(a)", "431.231", "(a)")
                               + ".")

    def test_leaves_a_paragraph_only_continuation_as_text(self):
        self.assertLinksInText("42 CFR 435.558(c)(3) or (c)(4) applies.",
                               ecfr("42 CFR 435.558(c)(3)", "435.558", "(c)(3)") + " or (c)(4) applies.")

    def test_never_links_a_colorado_or_45_cfr_reference_or_a_number_that_is_not_a_42_cfr_section(self):
        cases = [
            ("10 CCR 2505-10 § 8.057.5.D, like 42 CFR 431.231(a), counts the 10 days.",
             "10 CCR 2505-10 § 8.057.5.D, like " + ecfr("42 CFR 431.231(a)", "431.231", "(a)")
             + ", counts the 10 days."),
            ("42 CFR 431.221(d) and 10 CCR 2505-10 8.057.4.B.1 differ.",
             ecfr("42 CFR 431.221(d)", "431.221", "(d)") + " and 10 CCR 2505-10 8.057.4.B.1 differ."),
            ("42 CFR 435.558(b)(2) and 8.100 differ.",
             ecfr("42 CFR 435.558(b)(2)", "435.558", "(b)(2)") + " and 8.100 differ."),
            ("42 CFR 431.211, 30 days or 5 days.", ecfr("42 CFR 431.211", "431.211") + ", 30 days or 5 days."),
            ("42 CFR 431.211 and 45 CFR 155.505 differ.",
             ecfr("42 CFR 431.211", "431.211") + " and 45 CFR 155.505 differ."),
            ("42 CFR 431.211 and 45 CFR 155.505, which § 431.206 and § 155.510 cite.",
             ecfr("42 CFR 431.211", "431.211") + " and 45 CFR 155.505, which § 431.206 and § 155.510 cite."),
            ("§ 431.206(c)(2) is cited, and no title is named.", "§ 431.206(c)(2) is cited, and no title is named."),
        ]
        for text, expected in cases:
            with self.subTest(text=text):
                self.assertLinksInText(text, expected)


if __name__ == "__main__":
    unittest.main()
