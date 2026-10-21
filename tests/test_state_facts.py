"""Tests of the state facts, docs/domain/states/*.json. The fixture is corpus_fixture.py."""

from __future__ import annotations

import re
import unittest

from corpus_fixture import (
    ANALYSIS, COLORADO, COUNTS_LINE, Corpus, CorpusTestCase, FEDERAL, OLDER_SOURCE, TEXAS, fact_line, run_checker,
    valid_colorado, valid_texas,
)


STATE_SHAPE = '{"state": ..., "name": ..., "facts": [...]}'


FACT_KEYS = ("row", "setting", "value", "status", "citation", "sources", "checked")


FACT_SOURCE_KEYS = ("source", "url", "tier", "source_date")


class StateFactTest(CorpusTestCase):
    """Formats, "State facts". Each state file of the valid corpus holds one fact with one source."""

    def fact(self, corpus: Corpus, path: str = COLORADO, index: int = 0) -> dict:
        return corpus.states[path]["facts"][index]

    def assertFactFails(self, corpus: Corpus, words: str, path: str = COLORADO, index: int = 0) -> None:
        self.assertFails(run_checker(corpus), path, fact_line(corpus.states[path], index), words)

    def test_a_missing_state_file_fails(self):
        for path in (FEDERAL, COLORADO):
            with self.subTest(path=path):
                corpus = Corpus()
                corpus.states[path] = None
                self.assertFails(run_checker(corpus), path, 0, "the state file is missing")

    def test_a_required_state_file_git_ignores_fails_as_missing(self):
        # Formats: the checker skips anything git ignores, and a missing federal.json or co.json fails.
        for path in (FEDERAL, COLORADO):
            with self.subTest(path=path):
                corpus = Corpus()
                corpus.files[".gitignore"] = path + "\n"
                self.assertFails(run_checker(corpus), path, 0, "the state file is missing")

    def test_a_fact_without_counts_from_passes(self):
        # Formats: the checker never requires counts_from.
        corpus = Corpus()
        for path in (FEDERAL, COLORADO):
            del self.fact(corpus, path)["counts_from"]
        self.assertPasses(run_checker(corpus))

    def test_a_state_file_that_is_not_json_fails(self):
        corpus = Corpus()
        corpus.states[COLORADO] = None
        corpus.files[COLORADO] = '{"state": "co",\n'
        self.assertFails(run_checker(corpus), COLORADO, 0, "not JSON")

    def test_a_state_file_is_an_object_of_state_name_and_facts(self):
        for bad in ([], {"state": "co", "name": "Colorado"}, dict(valid_colorado(), facts={}),
                    dict(valid_colorado(), extra="x")):
            with self.subTest(state=bad):
                corpus = Corpus()
                corpus.states[COLORADO] = bad
                self.assertFails(run_checker(corpus), COLORADO, 0, STATE_SHAPE)

    def test_state_is_the_file_name_without_json(self):
        for bad in ("CO", "colorado", "federal", "co.json"):
            with self.subTest(state=bad):
                corpus = Corpus()
                corpus.states[COLORADO]["state"] = bad
                self.assertFails(run_checker(corpus), COLORADO, 0, "the file name without .json")

    def test_the_federal_file_name_is_federal_default(self):
        # The valid corpus's federal.json says Federal default and passes; Colorado's name is not compared.
        for bad in ("United States", "federal default", "Federal default "):
            with self.subTest(name=bad):
                corpus = Corpus()
                corpus.states[FEDERAL]["name"] = bad
                self.assertFails(run_checker(corpus), FEDERAL, 0, "Federal default")

    def test_an_empty_name_or_an_empty_list_of_facts_counts_as_missing(self):
        for key, empty in (("name", ""), ("facts", [])):
            with self.subTest(key=key):
                corpus = Corpus()
                corpus.states[FEDERAL][key] = empty
                self.assertFails(run_checker(corpus), FEDERAL, 0, "lacks " + key)

    def test_a_fact_lacking_a_key_fails(self):
        for key in FACT_KEYS:
            with self.subTest(key=key):
                corpus = Corpus()
                del self.fact(corpus)[key]
                self.assertFactFails(corpus, "lacks " + key)

    def test_an_empty_value_or_an_empty_list_counts_as_missing(self):
        for key, empty in (("value", ""), ("citation", ""), ("checked", ""), ("counts_from", ""), ("sources", [])):
            with self.subTest(key=key):
                corpus = Corpus()
                self.fact(corpus)[key] = empty
                self.assertFactFails(corpus, "lacks " + key)

    def test_a_value_of_the_wrong_type_fails(self):
        for key, value in (("value", 30), ("checked", None), ("sources", "regulation"), ("row", ["x"])):
            with self.subTest(key=key):
                corpus = Corpus()
                self.fact(corpus)[key] = value
                self.assertFactFails(corpus, key)

    def test_a_fact_that_is_not_an_object_fails(self):
        # Formats: each fact is an object. The fact after it keeps its own line.
        corpus = Corpus()
        corpus.states[COLORADO]["facts"].insert(0, "30 calendar days")
        self.fact(corpus, index=1)["status"] = "unknown"
        self.assertFactFails(corpus, "a fact is a JSON object", index=0)
        self.assertFactFails(corpus, "status 'unknown'", index=1)

    def test_a_source_value_of_the_wrong_type_fails(self):
        # Formats: every value in a state file is a string except sources and facts, which are lists.
        for key, value in (("source_date", None), ("tier", 1), ("url", ["https://example.gov/"]), ("source", 4)):
            with self.subTest(key=key):
                corpus = Corpus()
                self.fact(corpus)["sources"][0][key] = value
                self.assertFactFails(corpus, "a source's {} is a string".format(key))

    def test_state_or_name_of_the_wrong_type_fails(self):
        # Formats: every value in a state file is a string except sources and facts.
        for key, value in (("state", 7), ("name", 7), ("name", None)):
            with self.subTest(key=key, value=value):
                corpus = Corpus()
                corpus.states[FEDERAL][key] = value
                self.assertFails(run_checker(corpus), FEDERAL, 0, "the state file's {} is a string".format(key))

    def test_a_source_url_is_an_address(self):
        # Formats: a fact source's url is an address beginning http:// or https://.
        for good in ("https://www.federalregister.gov/d/2026-11094", "http://example.gov/a"):
            with self.subTest(url=good):
                corpus = Corpus()
                self.fact(corpus)["sources"][0]["url"] = good
                self.assertPasses(run_checker(corpus))
        for bad in ("x", "not recorded", "www.federalregister.gov/d/2026-11094", "https://", "https://example.gov/a b"):
            with self.subTest(url=bad):
                corpus = Corpus()
                self.fact(corpus)["sources"][0]["url"] = bad
                self.assertFactFails(corpus, "a source's url {!r} is not an http:// or https:// address".format(bad))

    def test_an_inferred_or_not_published_fact_with_a_note_passes(self):
        corpus = Corpus()
        self.fact(corpus, FEDERAL).update(status="inferred", note="Inferred from 42 CFR 431.221(d).")
        self.fact(corpus).update(status="not published", value="not published",
                                 note="Searched the HCPF site on 2026-10-17; nothing published.")
        result = run_checker(corpus)
        self.assertPasses(result)
        self.assertEqual(COUNTS_LINE.search(result.stdout).group(6), "1", result.stdout)

    def test_an_inferred_or_not_published_fact_needs_a_note(self):
        for status, value in (("inferred", "30 calendar days"), ("not published", "not published")):
            for note in (None, ""):
                with self.subTest(status=status, note=note):
                    corpus = Corpus()
                    self.fact(corpus).update(status=status, value=value)
                    if note is not None:
                        self.fact(corpus)["note"] = note
                    self.assertFactFails(corpus, "lacks note")

    def test_a_status_outside_the_three_fails(self):
        for bad in ("Known", "unknown", "published", "not-published"):
            with self.subTest(status=bad):
                corpus = Corpus()
                self.fact(corpus)["status"] = bad
                self.assertFactFails(corpus, "status")

    def test_a_not_published_fact_has_the_value_not_published(self):
        corpus = Corpus()
        self.fact(corpus).update(status="not published", note="Searched the HCPF site on 2026-10-17.")
        self.assertFactFails(corpus, "the value 'not published'")

    def test_a_fact_naming_no_existing_row_fails(self):
        for bad in ("notice-response", "Notice-response-period", "no-such-row"):
            with self.subTest(row=bad):
                corpus = Corpus()
                self.fact(corpus)["row"] = bad
                self.assertFactFails(corpus, "names no row")

    def test_a_source_lacking_a_key_or_holding_an_empty_string_fails(self):
        for key in FACT_SOURCE_KEYS:
            for change in ("delete", "empty"):
                with self.subTest(key=key, change=change):
                    corpus = Corpus()
                    source = self.fact(corpus)["sources"][0]
                    if change == "delete":
                        del source[key]
                    else:
                        source[key] = ""
                    self.assertFactFails(corpus, "lacks " + key)

    def test_a_source_that_is_not_an_object_fails(self):
        corpus = Corpus()
        self.fact(corpus)["sources"] = [OLDER_SOURCE + ':4 "30 calendar days"']
        self.assertFactFails(corpus, "a source is a JSON object")

    def test_a_fact_source_is_checked_as_a_row_source_is(self):
        for bad, words in ((OLDER_SOURCE + ':4 "90 days"', "not on line 4"),
                           (OLDER_SOURCE + ':6 "30 calendar days"', "line 6 does not exist"),
                           (OLDER_SOURCE + ':0 "30 calendar days"', "line 0 does not exist"),
                           (ANALYSIS + ':3 "An analysis file"', "no manifest entry"),
                           (OLDER_SOURCE + ' line 4 "30 calendar days"', "is not 'path:line"),
                           ("not stored", "not stored, <URL>")):
            with self.subTest(source=bad):
                corpus = Corpus()
                self.fact(corpus)["sources"][0]["source"] = bad
                self.assertFactFails(corpus, words)

    def test_a_fact_source_not_stored_passes(self):
        corpus = Corpus()
        self.fact(corpus)["sources"][0]["source"] = "not stored, https://www.federalregister.gov/d/2026-11094"
        self.assertPasses(run_checker(corpus))

    def test_a_source_tier_outside_the_list_fails(self):
        for bad in ("Regulation", "state website", "federal"):
            with self.subTest(tier=bad):
                corpus = Corpus()
                self.fact(corpus)["sources"][0]["tier"] = bad
                self.assertFactFails(corpus, "not one of the tiers")

    def test_source_date_is_a_date_or_not_stated(self):
        corpus = Corpus()
        self.fact(corpus)["sources"][0]["source_date"] = "not stated"
        self.assertPasses(run_checker(corpus))
        for bad in ("June 3, 2026", "2026-02-30", "2026-6-3", "Not stated"):
            with self.subTest(source_date=bad):
                corpus = Corpus()
                self.fact(corpus)["sources"][0]["source_date"] = bad
                self.assertFactFails(corpus, "source_date")

    def test_checked_in_the_rows_verified_vocabulary_passes(self):
        # Formats: checked takes a row's Verified vocabulary, less `no`.
        for good in ("2026-10-17, read in source", "2026-10-17, ledger L5-3",
                     "2026-10-17, read in source, by A. Reviewer", "2026-10-17, ledger L5-3, by A. Reviewer",
                     "2026-10-17, expert review, by A. Reviewer"):
            with self.subTest(checked=good):
                corpus = Corpus()
                self.fact(corpus)["checked"] = good
                self.assertPasses(run_checker(corpus))

    def test_checked_outside_the_rows_verified_vocabulary_fails(self):
        for bad in ("2026-10-17", "no", "2026-10-17T03:10:00Z", "2026-13-01, read in source", "today",
                    "2026-10-17 read in source", "2026-10-17, read it", "2026-10-17, ledger",
                    "2026-10-17, read in source, by", "2026-10-17, expert review", "2026-10-17, expert review by A."):
            with self.subTest(checked=bad):
                corpus = Corpus()
                self.fact(corpus)["checked"] = bad
                self.assertFactFails(corpus, "checked")

    def test_the_citation_is_checked_as_a_row_citation_is(self):
        for bad, words in (("TBD", "TBD or TODO"), ("42 CFR 435.558(a)(2); todo", "TBD or TODO"),
                           ("91 FR 39030", "needs a section number"),
                           ("42 CFR 435.558(a)(2);91 FR 39030", "separated by '; '")):
            with self.subTest(citation=bad):
                corpus = Corpus()
                self.fact(corpus)["citation"] = bad
                self.assertFactFails(corpus, words)

    def test_the_citation_takes_the_tier_of_the_first_source(self):
        guidance = {"source": "not stored, https://www.medicaid.gov/smd-26-001.pdf", "url": "https://www.medicaid.gov/"
                    "smd-26-001.pdf", "tier": "agency guidance", "source_date": "2026-06-03"}
        corpus = Corpus()
        self.fact(corpus).update(citation="CMS SMD 26-001, p. 5")
        self.fact(corpus)["sources"].insert(0, guidance)
        self.assertPasses(run_checker(corpus))
        self.fact(corpus)["sources"].reverse()
        self.assertFactFails(corpus, "a regulation citation needs a section number")

    def test_a_state_agency_page_or_secondary_source_that_may_predate_the_rule_warns(self):
        for tier in ("state agency page", "secondary"):
            for date in ("2026-06-02", "2025-12-31", "not stated"):
                with self.subTest(tier=tier, source_date=date):
                    corpus = Corpus()
                    self.fact(corpus)["sources"][0].update(tier=tier, source_date=date)
                    self.fact(corpus)["citation"] = "HCPF, Community engagement page"
                    result = run_checker(corpus)
                    self.assertPasses(result)
                    self.assertRegex(result.stdout, r"(?m)^{}:{}: warning: .*may predate the rule".format(
                        re.escape(COLORADO), fact_line(corpus.states[COLORADO], 0)))
                    self.assertEqual(COUNTS_LINE.search(result.stdout).group(7), "1", result.stdout)

    def test_no_warning_from_the_rule_on_or_for_other_tiers(self):
        for tier, date in (("state agency page", "2026-06-03"), ("secondary", "2026-10-01"),
                           ("regulation", "2025-01-01"), ("state plan", "not stated")):
            with self.subTest(tier=tier, source_date=date):
                corpus = Corpus()
                self.fact(corpus)["sources"][0].update(tier=tier, source_date=date)
                result = run_checker(corpus)
                self.assertPasses(result)
                self.assertNotIn(": warning: ", result.stdout)
                self.assertEqual(COUNTS_LINE.search(result.stdout).group(7), "0", result.stdout)

    def test_the_counts_line_gives_state_facts_and_those_not_published(self):
        result = run_checker(Corpus())
        match = COUNTS_LINE.search(result.stdout)
        self.assertEqual((match.group(5), match.group(6), match.group(7)), ("2", "0", "0"), result.stdout)
        corpus = Corpus()
        corpus.states[COLORADO]["facts"].append(dict(self.fact(corpus), status="not published",
                                                     value="not published", note="Searched on 2026-10-17."))
        match = COUNTS_LINE.search(run_checker(corpus).stdout)
        self.assertEqual((match.group(5), match.group(6)), ("3", "1"))

    def test_problems_name_the_fact_they_belong_to(self):
        corpus = Corpus()
        corpus.states[COLORADO]["facts"].append(dict(self.fact(corpus), status="unknown"))
        self.assertFactFails(corpus, "status", index=1)

    def test_every_state_file_is_checked(self):
        # Formats: the checker reads the state facts files, and every file in states/ is one of the corpus's own.
        corpus = Corpus()
        corpus.states[TEXAS] = valid_texas()
        result = run_checker(corpus)
        self.assertPasses(result)
        self.assertEqual(COUNTS_LINE.search(result.stdout).group(5), "3", result.stdout)
        for bad, words in (({}, STATE_SHAPE), (dict(valid_texas(), state="co"), "the file name without .json"),
                           (dict(valid_texas(), name=""), "lacks name")):
            with self.subTest(state=bad):
                corpus = Corpus()
                corpus.states[TEXAS] = bad
                self.assertFails(run_checker(corpus), TEXAS, 0, words)
        with self.subTest("not JSON"):
            corpus = Corpus()
            corpus.files[TEXAS] = "not json\n"
            self.assertFails(run_checker(corpus), TEXAS, 0, "not JSON")
        with self.subTest("a fact naming no row"):
            corpus = Corpus()
            corpus.states[TEXAS] = valid_texas()
            self.fact(corpus, TEXAS)["row"] = "no-such-row"
            self.assertFactFails(corpus, "names no row", path=TEXAS)

    def test_a_state_file_is_named_federal_or_a_two_letter_code(self):
        for name in ("texas", "TX", "t"):
            with self.subTest(name=name):
                path = "docs/domain/states/{}.json".format(name)
                corpus = Corpus()
                corpus.states[path] = dict(valid_texas(), state=name)
                self.assertFails(run_checker(corpus), path, 0, "two-letter code")

    def test_a_state_file_git_ignores_is_skipped(self):
        corpus = Corpus()
        corpus.files[TEXAS] = "not json\n"
        corpus.files[".gitignore"] = "docs/domain/states/tx.json\n"
        self.assertPasses(run_checker(corpus))


if __name__ == "__main__":
    unittest.main()
