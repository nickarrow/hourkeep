"""Tests of the generator of the review pages, scripts/build-review-pages.py and its package, scripts/review_pages/:
which pages it makes, what each row, open question and state fact shows, how citations are linked, that its output
depends only on the corpus, and --check. The fixture is corpus_fixture.py's valid corpus, with an open questions file
and a second group in its topic file added here. Its wording is illustration, not a checked statement of any rule.
"""

from __future__ import annotations

import importlib
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from corpus_fixture import COLORADO, Corpus, TOPIC, git_environment

GENERATOR = Path(__file__).resolve().parent.parent / "scripts" / "build-review-pages.py"
REVIEW = "docs/review/"
OPEN_QUESTIONS = "docs/domain/open-questions.md"
FORM = "https://forms.gle/Tvs27CNLg6Jdip429"
# The Google Form with its "Which row, state fact or open question?" question, entry 399684664, filled in.
PREFILLED_FORM = ("https://docs.google.com/forms/d/e/1FAIpQLSfmdg1bA4lF_frlMIl8LGIjwUS0ymtHKcqar2aB_h0evB97yQ/viewform"
                  "?usp=pp_url&entry.399684664=")

# The topic file with its two rows in two groups, the second row first, so the page's order can only come from it.
TOPIC_TEXT = """# Fair hearings

The row in the extract wins wherever the two differ.

## Answering a notice

- You have 30 calendar days to respond to a notice of noncompliance.
  [notice-response-period] 42 CFR 435.558(a)(2); 91 FR 39030

## Asking for a hearing

- You can ask for a fair hearing within the time the state allows, never more than 90 days.
  [hearing-request-period] 42 CFR 431.221(d); eCFR 2026-10-14
"""

OPEN_QUESTIONS_TEXT = """# Open questions

Questions only CMS, a state or a policy person can answer.

### Are the 30 days calendar days?

- Why it is open: the sources are silent. The rule says calendar days for one period
  and not for the other.
- Who can answer: CMS
- Raised: 2026-10-17, by rows notice-response-period and hearing-request-period
- Source: docs/domain/sources/ecfr/2026-10-14/42-cfr-431.221.xml:3 "not to exceed 90 days"
- Note: Synthetic question.
"""


def fixture() -> Corpus:
    corpus = Corpus()
    corpus.files[TOPIC] = TOPIC_TEXT
    corpus.files[OPEN_QUESTIONS] = OPEN_QUESTIONS_TEXT
    return corpus


def load_generator():
    """The generator's package, scripts/review_pages/, for tests that call it directly."""
    scripts = str(GENERATOR.parent)
    if scripts not in sys.path:
        sys.path.insert(0, scripts)
    return importlib.import_module("review_pages")


def run_generator(root: Path, *args: str) -> subprocess.CompletedProcess:
    return subprocess.run([sys.executable, str(GENERATOR), "--root", str(root)] + list(args), capture_output=True,
                          text=True, encoding="utf-8", env=git_environment())


class GeneratorTestCase(unittest.TestCase):
    """Writes the fixture to a temporary folder for each test, as self.root."""

    corpus_factory = staticmethod(fixture)

    def setUp(self) -> None:
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.root = Path(folder.name)
        self.corpus = self.corpus_factory()
        self.corpus.write(self.root)

    def pages(self, start_here=None) -> dict:
        """The pages the generator makes for the fixture, as text keyed by path from the repository root."""
        package = load_generator()
        made = package.build(self.root) if start_here is None else package.build(self.root, start_here=start_here)
        return {path: data.decode("utf-8") for path, data in made.items()}

    def page(self, name: str, start_here=None) -> str:
        return self.pages(start_here)[REVIEW + name]


class PagesTest(GeneratorTestCase):
    def test_makes_the_landing_page_one_page_per_topic_file_the_open_questions_and_the_state_facts(self):
        self.assertEqual(sorted(self.pages()), [REVIEW + "README.md", REVIEW + "fair-hearings.md",
                                               REVIEW + "open-questions.md", REVIEW + "state-facts.md"])

    def test_two_builds_give_identical_bytes(self):
        package = load_generator()
        self.assertEqual(package.build(self.root), package.build(self.root))

    def test_every_page_ends_with_one_newline(self):
        for path, text in self.pages().items():
            self.assertTrue(text.endswith("\n") and not text.endswith("\n\n"), path)

    def test_the_landing_page_links_every_other_page(self):
        readme = self.page("README.md")
        for name in ("fair-hearings.md", "open-questions.md", "state-facts.md"):
            self.assertIn("](" + name + ")", readme)

    def test_only_the_landing_page_links_the_plain_form_and_every_other_page_fills_in_the_name(self):
        pages = self.pages()
        self.assertIn("](" + FORM + ")", pages[REVIEW + "README.md"])
        for name in ("fair-hearings.md", "open-questions.md", "state-facts.md"):
            with self.subTest(page=name):
                self.assertNotIn(FORM, pages[REVIEW + name])
                self.assertIn("](" + PREFILLED_FORM, pages[REVIEW + name])

    def test_a_start_here_row_that_is_not_in_its_topic_file_stops_the_build(self):
        with self.assertRaises(ValueError) as raised:
            self.pages(start_here={"fair-hearings": ["no-such-row"]})
        self.assertIn("no-such-row", str(raised.exception))


class CommandLineTest(GeneratorTestCase):
    def test_writes_the_pages_and_two_runs_give_identical_bytes(self):
        self.assertEqual(run_generator(self.root).returncode, 0)
        first = {path.name: path.read_bytes() for path in (self.root / REVIEW).iterdir()}
        self.assertEqual(sorted(first), ["README.md", "fair-hearings.md", "open-questions.md", "state-facts.md"])
        self.assertEqual(run_generator(self.root).returncode, 0)
        second = {path.name: path.read_bytes() for path in (self.root / REVIEW).iterdir()}
        self.assertEqual(first, second)
        self.assertEqual(first["fair-hearings.md"], load_generator().build(self.root)[REVIEW + "fair-hearings.md"])

    def test_check_exits_0_when_every_page_matches(self):
        run_generator(self.root)
        result = run_generator(self.root, "--check")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_check_exits_1_naming_each_page_that_differs_or_is_missing(self):
        run_generator(self.root)
        (self.root / REVIEW / "fair-hearings.md").write_text("edited by hand\n", encoding="utf-8")
        (self.root / REVIEW / "state-facts.md").unlink()
        result = run_generator(self.root, "--check")
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn(REVIEW + "fair-hearings.md", result.stdout)
        self.assertIn(REVIEW + "state-facts.md", result.stdout)
        self.assertNotIn(REVIEW + "open-questions.md", result.stdout)
        self.assertEqual((self.root / REVIEW / "fair-hearings.md").read_text(encoding="utf-8"), "edited by hand\n")
        self.assertFalse((self.root / REVIEW / "state-facts.md").exists())

    def test_check_writes_nothing_when_the_pages_are_absent(self):
        result = run_generator(self.root, "--check")
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertFalse((self.root / REVIEW).exists())

    def test_a_bad_argument_exits_2(self):
        self.assertEqual(run_generator(self.root, "--no-such-option").returncode, 2)


def comment_line(name_in_url: str) -> str:
    return ("- Comment: [on GitHub](https://github.com/nickarrow/hourkeep/issues/new?template=row-review.yml&row="
            + name_in_url + "&title=Review:%20" + name_in_url + "), [on Google Forms (no account needed)]("
            + PREFILLED_FORM + name_in_url + "), [by email](mailto:policy@hourkeep.app?subject=Review:%20"
            + name_in_url + ")")


NOTICE_ROW = "\n".join([
    "### notice-response-period",
    "",
    "- The rule: A person has 30 calendar days to respond to a notice of noncompliance.",
    "- From: [42 CFR 435.558(a)(2)](https://www.ecfr.gov/current/title-42/section-435.558#p-435.558%28a%29%282%29)"
    "; [91 FR 39030](https://www.federalregister.gov/citation/91-FR-39030)",
    "- Can a state choose differently? No.",
    "- If this row were wrong: a person on Medicaid could do less than the rules ask of them.",
    "- Checked: not yet.",
    comment_line("notice-response-period"),
    "- Full row, with its sources and notes: [notice-response-period in the rule extract]"
    "(../domain/community-engagement-extract.md#notice-response-period)",
    "",
])


class TopicPageTest(GeneratorTestCase):
    def test_opens_with_the_topic_files_title_and_a_line_linking_the_landing_page(self):
        lines = self.page("fair-hearings.md").split("\n")
        self.assertEqual(lines[0], "# Fair hearings")
        self.assertEqual(lines[1], "")
        self.assertIn("generated from", lines[2].lower())
        self.assertIn("](README.md)", lines[2])

    def test_holds_the_topic_files_groups_in_order_each_with_its_rows_in_order(self):
        page = self.page("fair-hearings.md")
        order = [page.index(text) for text in ("## Answering a notice\n", "### notice-response-period\n",
                                               "## Asking for a hearing\n", "### hearing-request-period\n")]
        self.assertEqual(order, sorted(order))

    def test_shows_each_row_as_the_formats_say(self):
        self.assertIn(NOTICE_ROW, self.page("fair-hearings.md"))

    def test_a_row_a_state_can_choose_gives_the_choice_in_sentences(self):
        page = self.page("fair-hearings.md")
        self.assertIn("- Can a state choose differently? Yes. The state chooses the time allowed.\n"
                      "- If the state has not chosen: 90 days.\n", page)
        self.assertIn("- From: [42 CFR 431.221(d)](https://www.ecfr.gov/current/title-42/section-431.221"
                      "#p-431.221%28d%29); eCFR 2026-10-14\n", page)
        self.assertIn("- Checked: 2026-10-17 by an AI agent reading the stored text.\n", page)

    def test_has_no_start_here_section_when_its_topic_has_no_start_here_rows(self):
        self.assertNotIn("## Start here", self.page("fair-hearings.md"))



class OpenQuestionsPageTest(GeneratorTestCase):
    def test_gives_each_question_with_why_it_is_open_who_can_answer_its_rows_and_comment_links(self):
        page = self.page("open-questions.md")
        heading = "Are the 30 days calendar days?"
        self.assertIn("## " + heading + "\n", page)
        self.assertIn("- Why it is open: the sources are silent. The rule says calendar days for one period and not "
                      "for the other.\n", page)
        self.assertIn("- Who can answer: CMS\n", page)
        self.assertIn("- Rows it holds up: [notice-response-period](fair-hearings.md#notice-response-period), "
                      "[hearing-request-period](fair-hearings.md#hearing-request-period)\n", page)
        self.assertIn(comment_line("Are%20the%2030%20days%20calendar%20days%3F") + "\n", page)


class StateFactsPageTest(GeneratorTestCase):
    def test_gives_each_fact_by_state_the_federal_default_first(self):
        page = self.page("state-facts.md")
        self.assertLess(page.index("## Federal default\n"), page.index("## Colorado\n"))

    def test_shows_each_fact_as_the_formats_say(self):
        self.corpus.states[COLORADO]["facts"][0]["note"] = "A synthetic note."
        self.corpus.write(self.root)
        fact = "\n".join([
            "### notice-response-period",
            "",
            "- The row: [notice-response-period](fair-hearings.md#notice-response-period)",
            "- Where it applies: after a notice of noncompliance",
            "- The value: 30 calendar days",
            "- Counts from: the day the notice is received",
            "- Status: known",
            "- From: [42 CFR 435.558(a)(2)](https://www.ecfr.gov/current/title-42/section-435.558"
            "#p-435.558%28a%29%282%29); [91 FR 39030](https://www.federalregister.gov/citation/91-FR-39030)",
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
        ])
        page = self.page("state-facts.md")
        self.assertIn(fact, page[page.index("## Colorado\n"):])

    def test_checked_takes_the_rows_wording(self):
        self.corpus.states[COLORADO]["facts"][0]["checked"] = "2026-10-18, ledger L5-3, by A. Reviewer"
        self.corpus.write(self.root)
        page = self.page("state-facts.md")
        self.assertIn("- Checked: " + load_generator().links.checked("2026-10-18, ledger L5-3, by A. Reviewer") + "\n",
                      page)

    def test_opens_by_defining_the_three_statuses_before_the_first_state(self):
        page = self.page("state-facts.md")
        definitions = "\n".join([
            "Each fact's status says how its value is known:",
            "",
            "- known: a source states the value.",
            "- inferred: the value is worked out from what a source does say, and its note says from what.",
            "- not published: no source found publishes the value, and its note says where and when the search ran.",
            "",
        ])
        self.assertIn(definitions, page)
        self.assertLess(page.index(definitions), page.index("## Federal default\n"))


MANIFEST = {"sources": [
    {"path": "docs/domain/sources/cms/smd-26-001.pdf", "cited_url": "https://example.gov/smd26001.pdf",
     "retrievals": [{"served_url": "https://example.gov/served-smd.pdf"}]},
    {"path": "docs/domain/sources/colorado/10-ccr-2505-10-8.000-effective-2026-07-10.pdf",
     "cited_url": "not recorded", "retrievals": [{"served_url": "https://example.gov/8.000.pdf"}]},
    {"path": "docs/domain/sources/colorado/10-ccr-2505-10-8.100-draft-2026-09-28.pdf",
     "cited_url": "not recorded", "retrievals": [{"served_url": "https://example.gov/draft-8.100.pdf"}]},
]}


class CitationLinkTest(unittest.TestCase):
    def assertLinks(self, citation: str, expected: str, manifest=None) -> None:
        links = load_generator().links
        self.assertEqual(links.cite(citation, MANIFEST if manifest is None else manifest), expected)

    def test_links_each_kind_of_part_and_leaves_the_rest_as_text(self):
        cases = [
            ("42 CFR 435.558(a)(1)",
             "[42 CFR 435.558(a)(1)](https://www.ecfr.gov/current/title-42/section-435.558#p-435.558%28a%29%281%29)"),
            ("42 CFR 435.558(c)(1)(i)(A)-(C)",
             "[42 CFR 435.558(c)(1)(i)(A)-(C)](https://www.ecfr.gov/current/title-42/section-435.558"
             "#p-435.558%28c%29%281%29%28i%29%28A%29)"),
            ("Preamble to 42 CFR 435.558(b)(1)",
             "Preamble to [42 CFR 435.558(b)(1)](https://www.ecfr.gov/current/title-42/section-435.558"
             "#p-435.558%28b%29%281%29)"),
            ("42 CFR 431.211", "[42 CFR 431.211](https://www.ecfr.gov/current/title-42/section-431.211)"),
            ("91 FR 39030-39031", "[91 FR 39030-39031](https://www.federalregister.gov/citation/91-FR-39030)"),
            ("CMS SMD 26-001, pp. 4, 8", "[CMS SMD 26-001](https://example.gov/smd26001.pdf), pp. 4, 8"),
            ("10 CCR 2505-10 8.057.4.B.1", "[10 CCR 2505-10 8.057.4.B.1](https://example.gov/8.000.pdf)"),
            ("SSA 1902(e)(14)(L)(ii)",
             "[SSA 1902(e)(14)(L)(ii)](https://www.ssa.gov/OP_Home/ssact/title19/1902.htm)"),
            ("Pub. L. 119-21, sec. 71107", "[Pub. L. 119-21](https://www.govinfo.gov/content/pkg/PLAW-119publ21/html/"
             "PLAW-119publ21.htm), sec. 71107"),
            ("eCFR 2026-10-15", "eCFR 2026-10-15"),
            ("42 CFR 431.221(d); eCFR 2026-10-14",
             "[42 CFR 431.221(d)](https://www.ecfr.gov/current/title-42/section-431.221#p-431.221%28d%29); "
             "eCFR 2026-10-14"),
        ]
        for citation, expected in cases:
            with self.subTest(citation=citation):
                self.assertLinks(citation, expected)

    def test_a_part_citing_colorados_draft_8100_links_to_the_stored_draft(self):
        self.assertLinks("10 CCR 2505-10 8.100.4.G.4, draft, not adopted",
                         "[10 CCR 2505-10 8.100.4.G.4](https://example.gov/draft-8.100.pdf), draft, not adopted")

    def test_a_colorado_part_outside_rule_8000_and_not_the_draft_is_left_as_text(self):
        for citation in ("10 CCR 2505-10 8.100.4.G.4", "10 CCR 2505-10 8.200.1, draft"):
            with self.subTest(citation=citation):
                self.assertLinks(citation, citation)

    def test_a_part_whose_source_the_manifest_does_not_give_is_left_as_text(self):
        self.assertLinks("CMS SMD 26-001, p. 9", "CMS SMD 26-001, p. 9", manifest={"sources": []})
        self.assertLinks("10 CCR 2505-10 8.057.5.A", "10 CCR 2505-10 8.057.5.A", manifest={"sources": []})


class RowWordsTest(unittest.TestCase):
    def test_says_what_an_error_would_cost(self):
        links = load_generator().links
        self.assertEqual(links.if_wrong("dangerous"),
                         "a person on Medicaid could do less than the rules ask of them.")
        self.assertEqual(links.if_wrong("burdensome"),
                         "a person on Medicaid could do more than the rules ask of them.")
        self.assertEqual(links.if_wrong("neither"), "only a citation, a date or context would be off.")

    def test_says_who_checked_a_row_and_how(self):
        links = load_generator().links
        cases = [
            ("no", "not yet."),
            ("2026-10-17, read in source", "2026-10-17 by an AI agent reading the stored text."),
            ("2026-10-17, ledger L1-4", "2026-10-17 by an AI agent, through the 2026-10-16 research ledger."),
            ("2026-10-21, ledger L5-3, by A. Reviewer",
             "2026-10-21 by A. Reviewer, through the 2026-10-16 research ledger."),
            ("2026-10-21, read in source, by A. Reviewer", "2026-10-21 by A. Reviewer, reading the official text."),
            ("2026-10-21, expert review, by A. Reviewer", "2026-10-21 by A. Reviewer, from their own knowledge."),
        ]
        for verified, expected in cases:
            with self.subTest(verified=verified):
                self.assertEqual(links.checked(verified), expected)

    def test_says_whether_a_state_can_choose_in_sentences(self):
        links = load_generator().links
        self.assertEqual(links.state_choice("no"), ["- Can a state choose differently? No."])
        self.assertEqual(links.state_choice("yes; the state chooses the time; where it has not chosen, 90 days"),
                         ["- Can a state choose differently? Yes. The state chooses the time.",
                          "- If the state has not chosen: 90 days."])


if __name__ == "__main__":
    unittest.main()
