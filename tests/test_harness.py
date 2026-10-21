"""Tests of the command line, and of the valid corpus broken one way at a time: arguments, exit codes, the
working directory, the output's shape, and the probes that once exited 0. The fixture is corpus_fixture.py."""

from __future__ import annotations

import hashlib
import unittest

from corpus_fixture import (
    ANALYSIS, CHECKER, COLORADO, COUNTS_LINE, Corpus, CorpusTestCase, ECFR_SOURCE, ECFR_TEXT, EXTRACT,
    GITATTRIBUTES_TEXT, MANIFEST, OLDER_SOURCE, OLDER_TEXT, RULE_ITEM, TOPIC, entry_line, extract_with, fact_line,
    run_checker, topic_with,
)


class HarnessTest(unittest.TestCase):
    def test_valid_corpus_exits_0_and_prints_the_counts(self):
        result = run_checker(Corpus())
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        match = COUNTS_LINE.search(result.stdout)
        self.assertIsNotNone(match, result.stdout)
        self.assertEqual(match.group(1), "2", result.stdout)
        self.assertEqual(match.group(2), "1", result.stdout)

    def test_a_bad_argument_exits_2(self):
        result = run_checker(Corpus(), args=["--no-such-option"])
        self.assertEqual(result.returncode, 2, result.stdout + result.stderr)

    def test_a_root_that_is_not_a_directory_exits_2(self):
        result = run_checker(Corpus(), args=["--root", "{root}/no-such-folder"])
        self.assertEqual(result.returncode, 2, result.stdout + result.stderr)

    def test_runs_from_another_working_directory(self):
        result = run_checker(Corpus(), cwd="elsewhere")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIsNotNone(COUNTS_LINE.search(result.stdout), result.stdout)

    def test_without_root_finds_the_repository_from_its_own_path(self):
        corpus = Corpus()
        corpus.files["scripts/check-corpus.py"] = CHECKER.read_bytes()
        for module in (CHECKER.parent / "corpus_check").glob("*.py"):
            corpus.files["scripts/corpus_check/" + module.name] = module.read_bytes()
        result = run_checker(corpus, args=[], cwd="elsewhere", script=lambda root: root / "scripts" / "check-corpus.py")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIsNotNone(COUNTS_LINE.search(result.stdout), result.stdout)

    def test_a_problem_is_reported_as_file_line_message_and_exits_1(self):
        # Item 01 has one check to break: the extract must exist. Later items add the rest.
        corpus = Corpus()
        corpus.files[EXTRACT] = None
        result = run_checker(corpus)
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertRegex(result.stdout, r"(?m)^docs/domain/community-engagement-extract\.md:\d+: .+$")


class BreakTest(CorpusTestCase):
    """Delivery plan, increment 1, "How you know it worked": the valid corpus with one break at a time. Line
    numbers are the valid extract's: 7 the first row's heading, 11 its Citation, 12 its Source."""

    def test_the_valid_corpus_prints_the_whole_counts_line(self):
        result = run_checker(Corpus())
        self.assertPasses(result)
        self.assertIn("Checked 2 rows (1 say Verified: no), 2 sources, 2 state facts (0 marked not published), "
                      "0 warnings, 2 skill items.", result.stdout)

    def test_a_row_citation_deleted(self):
        with self.subTest("the field deleted"):
            result = self.check_extract(extract_with("- Citation: 42 CFR 431.221(d); eCFR 2026-10-14\n", ""))
            self.assertFails(result, EXTRACT, 7, "hearing-request-period lacks the Citation field")
        with self.subTest("the value deleted"):
            result = self.check_extract(extract_with("- Citation: 42 CFR 431.221(d); eCFR 2026-10-14", "- Citation:"))
            self.assertFails(result, EXTRACT, 11, "Citation is empty")

    def test_a_citation_changed_to_tbd(self):
        result = self.check_extract(extract_with("42 CFR 431.221(d); eCFR 2026-10-14\n- Source", "TBD\n- Source"))
        self.assertFails(result, EXTRACT, 11, "the citation holds the word TBD or TODO")

    def test_a_source_quoted_words_changed(self):
        result = self.check_extract(extract_with('"not to exceed 90 days"', '"not to exceed 60 days"'))
        self.assertFails(result, EXTRACT, 12, "the quoted words 'not to exceed 60 days' are not on line 3")

    def test_a_row_citing_an_analysis_file_instead_of_a_stored_source(self):
        cited = ECFR_SOURCE + ':3 "not to exceed 90 days"'
        result = self.check_extract(extract_with(cited, ANALYSIS + ':3 "An analysis file"'))
        self.assertFails(result, EXTRACT, 12, ANALYSIS + " has no manifest entry")

    def test_a_byte_appended_to_a_stored_source(self):
        for index, path, text in ((0, OLDER_SOURCE, OLDER_TEXT), (1, ECFR_SOURCE, ECFR_TEXT)):
            with self.subTest(path):
                corpus = Corpus()
                corpus.files[path] = text.encode("utf-8") + b" "
                result = run_checker(corpus)
                self.assertFails(result, MANIFEST, entry_line(corpus, index), "the hash of " + path + " differs")

    def test_the_manifest_entry_for_an_older_source_removed(self):
        corpus = Corpus()
        del corpus.manifest["sources"][0]
        result = run_checker(corpus)
        self.assertFails(result, OLDER_SOURCE, 0, "neither in the manifest nor one of the corpus's own files")
        self.assertFails(result, COLORADO, fact_line(corpus.states[COLORADO], 0), OLDER_SOURCE + " has no manifest")

    def test_a_colorado_fact_source_emptied(self):
        for name, change, words in (
            ("an empty string", lambda fact: fact["sources"][0].update(source=""), "a source lacks source"),
            ("an empty list", lambda fact: fact.update(sources=[]), "the fact lacks sources"),
        ):
            with self.subTest(name):
                corpus = Corpus()
                change(corpus.states[COLORADO]["facts"][0])
                result = run_checker(corpus)
                self.assertFails(result, COLORADO, fact_line(corpus.states[COLORADO], 0), words)

    def test_a_row_identifier_in_the_skill_misspelled(self):
        corpus = Corpus()
        corpus.files[TOPIC] = topic_with("[hearing-request-period] 42", "[hearing-request-periud] 42")
        result = run_checker(corpus)
        self.assertFails(result, TOPIC, 8, "[hearing-request-periud] names no row")

    def test_a_number_changed_in_a_skill_item(self):
        corpus = Corpus()
        corpus.files[TOPIC] = topic_with("never more than 90 days.", "never more than 60 days.")
        result = run_checker(corpus)
        self.assertFails(result, TOPIC, 7, "the number 60 is not in hearing-request-period's Rule")


DERIVED_SOURCE = "docs/domain/cms-2454-ifc/2026-11094.txt"


class DryRunProbeTest(CorpusTestCase):
    """The probes that a dry run on 2026-10-16 found passing against the design's earlier wording, each of which must
    now fail: an older derived source whose manifest entry is removed (S1, beside a control that passes with the
    entry); a second source on an analysis file (S2); a rule item with a changed number, or with no identifier (N1)."""

    def with_derived_source(self) -> Corpus:
        """The valid corpus plus an older derived source that nothing cites, as 2026-11094.txt was in the dry run."""
        corpus = Corpus()
        content = b"[[FR p.33348]]\nA derived copy of the June 3 printing.\n"
        corpus.files[DERIVED_SOURCE] = content
        corpus.files[".gitattributes"] = GITATTRIBUTES_TEXT + DERIVED_SOURCE + " -text\n"
        corpus.manifest["sources"].append({
            "path": DERIVED_SOURCE, "sha256": hashlib.sha256(content).hexdigest(), "kind": "derived",
            "cited_url": "not recorded", "retrievals": [], "superseded": [],
            "derived_from": "not recorded", "derivation": "not recorded",
        })
        corpus.manifest["sources"].sort(key=lambda entry: entry["path"])
        return corpus

    def test_s1_an_older_derived_source_with_its_entry_passes(self):
        self.assertPasses(run_checker(self.with_derived_source()))

    def test_s1_an_older_derived_source_whose_entry_is_removed_fails(self):
        corpus = self.with_derived_source()
        corpus.manifest["sources"] = [e for e in corpus.manifest["sources"] if e["path"] != DERIVED_SOURCE]
        result = run_checker(corpus)
        self.assertFails(result, DERIVED_SOURCE, 0, "neither in the manifest nor one of the corpus's own files")

    def test_s2_a_second_source_on_an_analysis_file_fails(self):
        cited = ECFR_SOURCE + ':3 "not to exceed 90 days"\n'
        result = self.check_extract(extract_with(cited, cited + "- Source: " + ANALYSIS + ':3 "An analysis file"\n'))
        self.assertFails(result, EXTRACT, 13, ANALYSIS + " has no manifest entry")

    def test_n1_a_changed_number_on_a_continuation_line_fails(self):
        corpus = Corpus()
        corpus.files[TOPIC] = topic_with(RULE_ITEM, (
            "- You can ask for a fair hearing within the time the state allows, never more than\n"
            "  45 days. [hearing-request-period] 42 CFR 431.221(d); eCFR 2026-10-14\n"))
        result = run_checker(corpus)
        self.assertFails(result, TOPIC, 7, "the number 45 is not in hearing-request-period's Rule")

    def test_n1_a_rule_item_with_no_identifier_fails(self):
        corpus = Corpus()
        corpus.files[TOPIC] = topic_with(RULE_ITEM, RULE_ITEM + "- You have 90 days to ask for a hearing.\n")
        result = run_checker(corpus)
        self.assertFails(result, TOPIC, 9, "a rule item ends with [identifier] citation")


if __name__ == "__main__":
    unittest.main()
