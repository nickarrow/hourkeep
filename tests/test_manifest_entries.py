"""Tests of the manifest's shape and of each entry's keys and values. The fixture is corpus_fixture.py."""

from __future__ import annotations

import unittest

from corpus_fixture import (
    ANALYSIS, COUNTS_LINE, Corpus, ECFR_SOURCE, MANIFEST, ManifestTestCase, OLDER_SOURCE, entry_line, run_checker,
    valid_manifest,
)


class ManifestTest(ManifestTestCase):
    """Formats, "Stored sources and the manifest": the manifest and each entry's keys and values."""

    def test_a_missing_manifest_fails(self):
        corpus = Corpus()
        corpus.manifest = None
        self.assertFails(run_checker(corpus), MANIFEST, 0, "the manifest is missing")

    def test_a_manifest_git_ignores_fails_as_missing(self):
        # Formats: the checker skips anything git ignores, and a missing manifest fails.
        corpus = Corpus()
        corpus.files[".gitignore"] = MANIFEST + "\n"
        self.assertFails(run_checker(corpus), MANIFEST, 0, "the manifest is missing")

    def test_a_manifest_that_is_not_json_fails(self):
        corpus = Corpus()
        corpus.files[MANIFEST] = '{"sources": [\n'
        corpus.manifest = None
        self.assertFails(run_checker(corpus), MANIFEST, 0, "not JSON")

    def test_the_manifest_is_an_object_whose_one_key_is_sources(self):
        for bad in ([], {"sources": {}}, {"entries": []}, dict(valid_manifest(), extra=[])):
            with self.subTest(manifest=bad):
                corpus = Corpus()
                corpus.manifest = bad
                self.assertFails(run_checker(corpus), MANIFEST, 0, '{"sources": [...]}')

    def test_an_entry_lacking_a_key_fails(self):
        for key in ("path", "sha256", "kind", "cited_url", "retrievals", "superseded"):
            with self.subTest(key=key):
                corpus = Corpus()
                del self.entry(corpus, self.OLDER)[key]
                self.assertEntryFails(corpus, self.OLDER, "lacks " + key)

    def test_an_empty_string_counts_as_missing(self):
        for key in ("path", "sha256", "kind", "cited_url"):
            with self.subTest(key=key):
                corpus = Corpus()
                self.entry(corpus, self.OLDER)[key] = ""
                self.assertEntryFails(corpus, self.OLDER, "lacks " + key)
        corpus = Corpus()
        self.entry(corpus, self.OLDER)["note"] = ""
        self.assertEntryFails(corpus, self.OLDER, "lacks note")

    def test_a_value_of_the_wrong_type_fails(self):
        for key, value in (("sha256", 7), ("cited_url", None), ("retrievals", {}), ("superseded", "none")):
            with self.subTest(key=key):
                corpus = Corpus()
                self.entry(corpus, self.OLDER)[key] = value
                self.assertEntryFails(corpus, self.OLDER, key)

    def test_a_value_inside_a_retrieval_or_superseded_item_of_the_wrong_type_fails(self):
        # Formats: every entry's keys are strings unless it says otherwise, and a retrieval's and a superseded
        # item's keys are said to be nothing else.
        corpus = Corpus()
        self.entry(corpus, self.ECFR)["retrievals"][0]["retrieved"] = 20261017
        self.assertEntryFails(corpus, self.ECFR, "a retrieval in the entry for {}'s retrieved is a string".format(
            ECFR_SOURCE))
        corpus = Corpus()
        self.entry(corpus, self.OLDER)["superseded"] = [{"by": ECFR_SOURCE, "scope": None}]
        self.assertEntryFails(corpus, self.OLDER, "a superseded item in the entry for {}'s scope is a string".format(
            OLDER_SOURCE))

    def test_an_entry_that_is_not_an_object_fails(self):
        # Formats: every entry has the listed keys, so an entry is an object. The entries after it keep their lines.
        corpus = Corpus()
        corpus.manifest["sources"].insert(1, ECFR_SOURCE)
        self.entry(corpus, 2)["kind"] = "copy"
        result = run_checker(corpus)
        self.assertFails(result, MANIFEST, entry_line(corpus, 1), "an entry is a JSON object")
        self.assertFails(result, MANIFEST, entry_line(corpus, 2), "kind 'copy'")

    def test_a_retrieval_or_superseded_item_that_is_not_an_object_fails(self):
        # Formats: retrievals are each an object, and superseded is a list of objects.
        corpus = Corpus()
        self.entry(corpus, self.ECFR)["retrievals"] = ["not recorded"]
        self.assertEntryFails(corpus, self.ECFR, "a retrieval in the entry for {} is a JSON object".format(
            ECFR_SOURCE))
        corpus = Corpus()
        self.entry(corpus, self.OLDER)["superseded"] = [ECFR_SOURCE]
        self.assertEntryFails(corpus, self.OLDER, "a superseded item in the entry for {} is a JSON object".format(
            OLDER_SOURCE))

    def test_a_retrieval_or_superseded_item_holds_no_key_but_its_own(self):
        # Formats: an entry, a retrieval and a superseded item each hold no key but their own. The valid corpus's
        # retrievals and test_a_superseded_item_with_by_and_scope_passes are the passing side.
        corpus = Corpus()
        self.entry(corpus, self.ECFR)["retrievals"][0]["note"] = "Fetched twice."
        self.assertEntryFails(corpus, self.ECFR, "a retrieval in the entry for {} holds the key 'note'".format(
            ECFR_SOURCE))
        corpus = Corpus()
        self.entry(corpus, self.OLDER)["superseded"] = [{"by": ECFR_SOURCE, "scope": "42 CFR 431.221",
                                                          "path": ECFR_SOURCE}]
        self.assertEntryFails(corpus, self.OLDER, "a superseded item in the entry for {} holds the key "
                              "'path'".format(OLDER_SOURCE))

    def test_a_retrieval_lacking_a_key_or_holding_an_empty_string_fails(self):
        for key in ("served_url", "command", "retrieved"):
            for change in ("delete", "empty"):
                with self.subTest(key=key, change=change):
                    corpus = Corpus()
                    retrieval = self.entry(corpus, self.ECFR)["retrievals"][0]
                    if change == "delete":
                        del retrieval[key]
                    else:
                        retrieval[key] = ""
                    self.assertEntryFails(corpus, self.ECFR, "lacks " + key)

    def test_a_superseded_item_with_by_and_scope_passes(self):
        corpus = Corpus()
        self.entry(corpus, self.OLDER)["superseded"] = [{"by": ECFR_SOURCE, "scope": "42 CFR 431.221"}]
        self.assertPasses(run_checker(corpus))

    def test_a_superseded_item_lacking_a_key_or_holding_an_empty_string_fails(self):
        for key in ("by", "scope"):
            for change in ("delete", "empty"):
                with self.subTest(key=key, change=change):
                    corpus = Corpus()
                    item = {"by": ECFR_SOURCE, "scope": "42 CFR 431.221"}
                    if change == "delete":
                        del item[key]
                    else:
                        item[key] = ""
                    self.entry(corpus, self.OLDER)["superseded"] = [item]
                    self.assertEntryFails(corpus, self.OLDER, "lacks " + key)

    def test_an_entry_holds_no_key_but_the_listed_ones(self):
        corpus = Corpus()
        self.entry(corpus, self.OLDER).update(note="Re-fetched on 2026-10-16.", ecfr_date="2026-10-14")
        self.assertPasses(run_checker(corpus))
        for key in ("unexpected", "Note", "derived"):
            with self.subTest(key=key):
                corpus = Corpus()
                self.entry(corpus, self.OLDER)[key] = "value"
                self.assertEntryFails(corpus, self.OLDER, "holds the key {!r}, which is not".format(key))

    def test_only_a_derived_entry_holds_derived_from_and_derivation(self):
        for key in ("derived_from", "derivation"):
            with self.subTest(key=key):
                corpus = Corpus()
                self.entry(corpus, self.OLDER)[key] = "not recorded"
                self.assertEntryFails(corpus, self.OLDER, "only a derived entry holds " + key)

    def test_a_kind_outside_the_two_fails(self):
        corpus = Corpus()
        self.entry(corpus, self.OLDER)["kind"] = "copy"
        self.assertEntryFails(corpus, self.OLDER, "kind")

    def test_a_verbatim_entry_needs_a_retrieval(self):
        corpus = Corpus()
        self.entry(corpus, self.OLDER)["retrievals"] = []
        self.assertEntryFails(corpus, self.OLDER, "at least one retrieval")

    def test_a_derived_entry_passes_with_no_retrievals_and_its_origin_not_recorded(self):
        corpus = Corpus()
        entry = self.entry(corpus, self.OLDER)
        entry.update(kind="derived", retrievals=[], derived_from="not recorded", derivation="not recorded")
        self.assertPasses(run_checker(corpus))

    def test_a_derived_entry_needs_derived_from_and_derivation(self):
        for key in ("derived_from", "derivation"):
            for change in ("delete", "empty"):
                with self.subTest(key=key, change=change):
                    corpus = Corpus()
                    entry = self.entry(corpus, self.OLDER)
                    entry.update(kind="derived", retrievals=[], derived_from="https://example.gov/a.xml",
                                 derivation="not recorded")
                    if change == "delete":
                        del entry[key]
                    else:
                        entry[key] = ""
                    self.assertEntryFails(corpus, self.OLDER, "lacks " + key)

    def test_ecfr_date_is_required_under_the_ecfr_folder(self):
        corpus = Corpus()
        del self.entry(corpus, self.ECFR)["ecfr_date"]
        self.assertEntryFails(corpus, self.ECFR, "lacks ecfr_date")

    def test_ecfr_date_is_a_date_wherever_present(self):
        corpus = Corpus()
        self.entry(corpus, self.OLDER)["ecfr_date"] = "2026-10-14"
        self.assertPasses(run_checker(corpus))
        for index, bad in ((self.ECFR, "October 14, 2026"), (self.OLDER, "2026-13-01")):
            with self.subTest(ecfr_date=bad):
                corpus = Corpus()
                self.entry(corpus, index)["ecfr_date"] = bad
                self.assertEntryFails(corpus, index, "ecfr_date")

    def test_sha256_is_64_lowercase_hex_digits(self):
        good = self.entry(Corpus(), self.OLDER)["sha256"]
        for bad in (good.upper(), good[:63], good + "0", good[:63] + "g"):
            with self.subTest(sha256=bad):
                corpus = Corpus()
                self.entry(corpus, self.OLDER)["sha256"] = bad
                self.assertEntryFails(corpus, self.OLDER, "64 lowercase hex")

    def test_retrieved_is_a_utc_iso_8601_time_or_not_recorded(self):
        # Formats: times are UTC in ISO 8601 with a Z, and any of a retrieval's three keys may say not recorded.
        for good in ("2026-10-17T03:10:00Z", "2026-10-17T03:10Z", "2026-10-17T03:10:00.25Z", "not recorded"):
            with self.subTest(retrieved=good):
                corpus = Corpus()
                self.entry(corpus, self.ECFR)["retrievals"][0]["retrieved"] = good
                self.assertPasses(run_checker(corpus))
        for bad in ("yesterday", "2026-10-17", "2026-10-17T03:10:00", "2026-10-17T03:10:00+00:00",
                    "2026-10-17 03:10:00Z", "2026-13-17T03:10:00Z", "2026-10-17T24:00:00Z", "2026-10-17T03:60:00Z"):
            with self.subTest(retrieved=bad):
                corpus = Corpus()
                self.entry(corpus, self.ECFR)["retrievals"][0]["retrieved"] = bad
                self.assertEntryFails(corpus, self.ECFR, "retrieved")

    def test_cited_url_is_an_address_or_not_recorded(self):
        for good in ("https://www.ecfr.gov/current/title-42/section-431.221", "http://example.gov/a", "not recorded"):
            with self.subTest(cited_url=good):
                corpus = Corpus()
                self.entry(corpus, self.ECFR)["cited_url"] = good
                self.assertPasses(run_checker(corpus))
        for bad in ("TBD", "www.ecfr.gov/current", "https://", "https://www.ecfr.gov/a b", "Not recorded"):
            with self.subTest(cited_url=bad):
                corpus = Corpus()
                self.entry(corpus, self.ECFR)["cited_url"] = bad
                self.assertEntryFails(corpus, self.ECFR, "cited_url")

    def test_served_url_is_an_address_or_not_recorded(self):
        # Formats: cited_url and served_url are each not recorded or an address beginning http:// or https://.
        for good in ("https://www.ecfr.gov/api/versioner/v1/full/2026-10-14/title-42.xml?section=431.221",
                     "http://example.gov/a", "not recorded"):
            with self.subTest(served_url=good):
                corpus = Corpus()
                self.entry(corpus, self.ECFR)["retrievals"][0]["served_url"] = good
                self.assertPasses(run_checker(corpus))
        for bad in ("x", "TBD", "www.ecfr.gov/current", "https://", "https://www.ecfr.gov/a b", "Not recorded"):
            with self.subTest(served_url=bad):
                corpus = Corpus()
                self.entry(corpus, self.ECFR)["retrievals"][0]["served_url"] = bad
                self.assertEntryFails(corpus, self.ECFR, "served_url {!r} is not an http:// or https:// "
                                      "address".format(bad))

    def test_superseded_by_names_a_file_with_a_manifest_entry(self):
        # Formats: `by` is the superseding file's path, and every stored source in docs/domain/ has an entry.
        for bad in ("docs/domain/sources/ecfr/2026-10-14/no-such-section.xml", ANALYSIS, "the June 29 correction"):
            with self.subTest(by=bad):
                corpus = Corpus()
                self.entry(corpus, self.OLDER)["superseded"] = [{"by": bad, "scope": "42 CFR 431.221"}]
                self.assertEntryFails(corpus, self.OLDER, "names no manifest entry")

    def test_an_empty_string_under_any_key_of_a_retrieval_or_superseded_item_fails(self):
        # Formats: the checker fails an entry that holds an empty string, and these objects are inside an entry.
        corpus = Corpus()
        self.entry(corpus, self.ECFR)["retrievals"][0]["note"] = ""
        self.assertEntryFails(corpus, self.ECFR, "a retrieval in the entry for {} lacks note".format(ECFR_SOURCE))
        corpus = Corpus()
        self.entry(corpus, self.OLDER)["superseded"] = [{"by": ECFR_SOURCE, "scope": "42 CFR 431.221", "note": ""}]
        self.assertEntryFails(corpus, self.OLDER, "lacks note")

    def test_the_counts_line_gives_the_number_of_manifest_entries(self):
        result = run_checker(Corpus())
        self.assertEqual(COUNTS_LINE.search(result.stdout).group(4), "2", result.stdout)


if __name__ == "__main__":
    unittest.main()
