"""Tests of a row's field values: each inside its vocabulary, and each citation as its tier asks. The fixture
is corpus_fixture.py."""

from __future__ import annotations

import subprocess
import unittest

from corpus_fixture import Corpus, CorpusTestCase, EXTRACT, TOPIC, extract_with, run_checker, topic_with


class FieldValuesTest(CorpusTestCase):
    """Formats, the field definitions and "The checker reads a row this way": each value inside its vocabulary.

    Line numbers are the valid extract's: the first row's State election 14, Verified 15, Note 18; the second row's
    Source 24, Tier 25, Verified 27, Error direction 28, Recheck 29.
    """

    def change(self, old: str, new: str) -> subprocess.CompletedProcess:
        return self.check_extract(extract_with(old, new))

    def test_each_tier_passes(self):
        tiers = ("statute", "regulation", "preamble", "proposed regulation", "agency guidance", "state statute",
                 "state regulation", "state plan", "state draft rule", "state agency page", "court", "party filing",
                 "secondary")
        for tier in tiers:
            with self.subTest(tier=tier):
                self.assertPasses(self.change("- Tier: regulation\n- State election: no",
                                              "- Tier: " + tier + "\n- State election: no"))

    def test_a_tier_outside_the_list_fails(self):
        for bad in ("Regulation", "rule", "federal regulation", "regulation; preamble"):
            with self.subTest(tier=bad):
                result = self.change("- Tier: regulation\n- State election: no", "- Tier: " + bad +
                                     "\n- State election: no")
                self.assertFails(result, EXTRACT, 25, "Tier")

    def test_state_election_yes_with_what_the_state_chooses_passes(self):
        self.assertPasses(self.change("- State election: no", "- State election: yes; the state chooses whether to "
                                      "extend the period; where it has not chosen, 30 days"))

    def test_a_malformed_state_election_fails(self):
        for bad in ("yes", "No", "maybe", "yes; the state chooses the time allowed",
                    "yes; where it has not chosen, 90 days; the state chooses the time allowed",
                    "yes; the state chooses ; where it has not chosen, 90 days",
                    "yes; the state chooses the time allowed; where it has not chosen,"):
            with self.subTest(value=bad):
                result = self.change("- State election: yes; the state chooses the time allowed; where it has not "
                                     "chosen, 90 days", "- State election: " + bad)
                self.assertFails(result, EXTRACT, 14, "State election")

    def test_verified_by_ledger_or_by_a_named_person_passes(self):
        for good in ("2026-10-17, ledger L1-4", "2026-10-17, read in source, by A. Reviewer",
                     "2026-10-17, ledger L1-4, by A. Reviewer"):
            with self.subTest(value=good):
                self.assertPasses(self.change("- Verified: 2026-10-17, read in source", "- Verified: " + good))

    def test_verified_by_expert_review_with_a_name_passes(self):
        self.assertPasses(self.change("- Verified: 2026-10-17, read in source",
                                      "- Verified: 2026-10-17, expert review, by A. Reviewer"))

    def test_expert_review_without_a_name_fails(self):
        for bad in ("2026-10-17, expert review", "2026-10-17, expert review, by", "2026-10-17, expert review, by ",
                    "2026-10-17, expert review by A. Reviewer", "2026-10-17, expert review, A. Reviewer"):
            with self.subTest(value=bad):
                result = self.change("- Verified: 2026-10-17, read in source", "- Verified: " + bad)
                self.assertFails(result, EXTRACT, 15, "Verified")

    def test_a_malformed_verified_fails(self):
        for bad in ("yes", "No", "2026-10-17", "2026-10-17 read in source", "17 October 2026, read in source",
                    "2026-10-17, read it", "2026-10-17, ledger", "2026-10-17, read in source, by",
                    "2026-10-17, read in source by A. Reviewer", "2026-13-01, read in source",
                    "2026-10-17, Expert review, by A. Reviewer", "2026-10-17, expert, by A. Reviewer"):
            with self.subTest(value=bad):
                result = self.change("- Verified: 2026-10-17, read in source", "- Verified: " + bad)
                self.assertFails(result, EXTRACT, 15, "Verified")

    def test_each_error_direction_passes(self):
        for good in ("burdensome", "neither"):
            with self.subTest(value=good):
                self.assertPasses(self.change("- Error direction: dangerous\n- Recheck: final rule",
                                              "- Error direction: " + good + "\n- Recheck: final rule"))

    def test_an_error_direction_outside_the_list_fails(self):
        for bad in ("Dangerous", "safe", "dangerous; burdensome"):
            with self.subTest(value=bad):
                result = self.change("- Error direction: dangerous\n- Recheck: final rule",
                                     "- Error direction: " + bad + "\n- Recheck: final rule")
                self.assertFails(result, EXTRACT, 28, "Error direction")

    def test_recheck_triggers_from_the_list_with_dates_and_detail_pass(self):
        good = ("court ruling; CMS guidance; state plan amendment; state rule: 10 CCR 2505-10 8.100 adopted; "
                "federal minimum wage; eCFR amendment; date 2026-12-01; date 2027-01-15: board meeting")
        self.assertPasses(self.change("- Recheck: final rule; correction notice", "- Recheck: " + good))

    def test_a_malformed_recheck_fails(self):
        for bad in ("final rule, correction notice", "court", "Final rule", "final rule;", "; final rule",
                    "date 2026-12", "date 2026-12-01x", "date", "final rule:", "state rule 10 CCR 2505-10"):
            with self.subTest(value=bad):
                result = self.change("- Recheck: final rule; correction notice", "- Recheck: " + bad)
                self.assertFails(result, EXTRACT, 29, "Recheck")

    def test_a_malformed_corrected_fails(self):
        for bad in ("it said 60 days; the ledger found 90", "2026-10-16: it said 60 days",
                    "2026-10-16 it said 60 days; the ledger found 90", "2026-10-16: ; the ledger found 90",
                    "2026-10-16: it said 60 days;", "16 October 2026: it said 60 days; the ledger found 90"):
            with self.subTest(value=bad):
                result = self.change("- Note: Synthetic fixture row.\n",
                                     "- Corrected: " + bad + "\n- Note: Synthetic fixture row.\n")
                self.assertFails(result, EXTRACT, 18, "Corrected")

    def test_verified_no_passes_whether_or_not_the_source_is_stored(self):
        # The second row of the valid corpus is a source not stored with Verified: no; this makes the first say no.
        self.assertPasses(self.change("- Verified: 2026-10-17, read in source", "- Verified: no"))

    def test_a_source_not_stored_must_say_verified_no(self):
        result = self.change("- Verified: no", "- Verified: 2026-10-17, read in source")
        self.assertFails(result, EXTRACT, 24, "not stored")

    def test_a_source_not_stored_beside_a_stored_one_must_say_verified_no(self):
        # The first row's stored Source is line 12 and its Verified is dated; the source not stored becomes line 13.
        stored = '- Source: docs/domain/sources/ecfr/2026-10-14/42-cfr-431.221.xml:3 "not to exceed 90 days"\n'
        result = self.change(stored, stored + "- Source: not stored, https://www.ecfr.gov/current/title-42/"
                                              "section-431.221\n")
        self.assertFails(result, EXTRACT, 13, "must say Verified: no")


class CitationTest(CorpusTestCase):
    """Formats, "The checker reads a row this way", the citation bullet.

    Every case changes the second row of the valid extract: its Citation is line 23 and its Tier line 25.
    """

    CITATION = "- Citation: 42 CFR 435.558(a)(2); 91 FR 39030\n"
    TIER = "- Tier: regulation\n- State election: no"

    def cite(self, citation: str, tier: str = "regulation") -> subprocess.CompletedProcess:
        text = extract_with(self.CITATION, "- Citation: " + citation + "\n" if citation else "- Citation:\n")
        text = text.replace(self.TIER, "- Tier: " + tier + "\n- State election: no", 1)
        corpus = Corpus()
        corpus.files[EXTRACT] = text
        # The row's rule item gives the row's Citation exactly, so it follows the change.
        corpus.files[TOPIC] = topic_with("[notice-response-period] 42 CFR 435.558(a)(2); 91 FR 39030",
                                         "[notice-response-period] " + citation)
        return run_checker(corpus)

    def test_an_empty_citation_fails(self):
        self.assertFails(self.cite(""), EXTRACT, 23, "Citation is empty")

    def test_tbd_or_todo_in_any_case_fails(self):
        for bad in ("TBD", "tbd", "Tbd", "42 CFR 435.558(a)(2); TODO", "42 CFR 435.558(a)(2); todo: the page",
                    "42 CFR 435.558(a)(2) (ToDo)", "TBD-1"):
            with self.subTest(citation=bad):
                self.assertFails(self.cite(bad), EXTRACT, 23, "TBD or TODO")

    def test_tbd_or_todo_inside_a_longer_word_passes(self):
        for good in ("42 CFR 435.558(a)(2); 91 FR 39030, quoted in a Mastodon post",
                     "42 CFR 435.558(a)(2); 91 FR 39030; TODOS docket"):
            with self.subTest(citation=good):
                self.assertPasses(self.cite(good))

    def test_a_semicolon_not_followed_by_exactly_one_space_or_with_a_space_before_it_fails(self):
        # Review of the review pages 2026-10-21, M4: the pages split a Citation's parts on '; ', so any other
        # separator would lose a part's link.
        for bad in ("42 CFR 435.558(a)(2);91 FR 39030", "42 CFR 435.558(a)(2) ; 91 FR 39030",
                    "42 CFR 435.558(a)(2);  91 FR 39030", "42 CFR 435.558(a)(2);\t91 FR 39030",
                    "42 CFR 435.558(a)(2); 91 FR 39030;", "42 CFR 435.558(a)(2); 91 FR 39030;eCFR 2026-10-14"):
            with self.subTest(citation=bad):
                self.assertFails(self.cite(bad), EXTRACT, 23, "separated by '; '")

    def test_parts_separated_by_a_semicolon_and_one_space_pass(self):
        for good in ("42 CFR 435.558(a)(2); 91 FR 39030", "42 CFR 435.558(a)(2); 91 FR 39030; eCFR 2026-10-14"):
            with self.subTest(citation=good):
                self.assertPasses(self.cite(good))

    def test_the_citations_the_formats_section_names_pass(self):
        for citation, tier in (("42 CFR 435.558(c)(1)(vii); 91 FR 39030", "regulation"),
                               ("42 CFR 431.220(a)(1); eCFR 2026-10-14", "regulation"),
                               ("SSA 1902(e)(14)(L)", "statute"),
                               ("10 CCR 2505-10 \u00a7 8.057.4.B.1", "state regulation"),
                               ("CMS SMD 26-001, p. 5", "agency guidance")):
            with self.subTest(citation=citation):
                self.assertPasses(self.cite(citation, tier))

    def test_a_number_after_the_section_sign_section_or_usc_passes(self):
        for citation, tier in (("42 U.S.C. 1396a(xx)(1)", "statute"),
                               ("Pub. L. 119-21, section 71119", "statute"),
                               ("C.R.S. \u00a7 25-5-104", "state statute"),
                               ("C.R.S. \u00a7\u200925-5-104", "state statute"),
                               ("C.R.S. \u00a7\u00a7 25-5-104 and 25-5-105", "state statute")):
            with self.subTest(citation=citation):
                self.assertPasses(self.cite(citation, tier))

    def test_section_or_sec_counts_in_any_case(self):
        for good in ("Pub. L. 119-21, Section 71119", "Pub. L. 119-21, SECTION 71119", "Pub. L. 119-21, sec. 71119",
                     "Pub. L. 119-21, Sec. 71119", "Pub. L. 119-21, SEC.71119"):
            with self.subTest(citation=good):
                self.assertPasses(self.cite(good, "statute"))
        for bad in ("Pub. L. 119-21, sec 71119", "Pub. L. 119-21, secs. 71119", "Pub. L. 119-21, Subsection 3"):
            with self.subTest(citation=bad):
                self.assertFails(self.cite(bad, "statute"), EXTRACT, 23, "section number")

    def test_the_tiers_that_need_a_section_number_fail_without_one(self):
        for tier in ("statute", "regulation", "state statute", "state regulation"):
            with self.subTest(tier=tier):
                self.assertFails(self.cite("91 FR 39030", tier), EXTRACT, 23, "section number")

    def test_a_number_that_names_no_section_fails_for_a_regulation(self):
        for bad in ("eCFR 2026-10-14", "CMS SMD 26-001, p. 5", "42 CFR part 435; 91 FR 39030",
                    "42 CFR 435; subsection 3"):
            with self.subTest(citation=bad):
                self.assertFails(self.cite(bad), EXTRACT, 23, "section number")

    def test_other_tiers_need_no_section_number(self):
        for tier in ("preamble", "proposed regulation", "agency guidance", "state plan", "state draft rule",
                     "state agency page", "court", "party filing", "secondary"):
            with self.subTest(tier=tier):
                self.assertPasses(self.cite("91 FR 39030", tier))


if __name__ == "__main__":
    unittest.main()
