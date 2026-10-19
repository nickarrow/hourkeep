"""Tests of a row's Source: a stored source with a manifest entry, a line that exists and the quoted words,
or a source not stored. The fixture is corpus_fixture.py."""

from __future__ import annotations

import subprocess
import unittest
from typing import Optional

from corpus_fixture import (
    ANALYSIS, ANALYSIS_TEXT, Corpus, CorpusTestCase, ECFR_SOURCE, EXTRACT, GITATTRIBUTES_TEXT, OLDER_SOURCE, PDF,
    PDF_EXTRACTION, add_stored_source, extract_with, run_checker, with_pdf_extraction,
)


class SourceTest(CorpusTestCase):
    """Formats, the Source field and its bullet in "The checker reads a row this way".

    Every case changes the first row of the valid extract, whose Source is line 12.
    """

    SOURCE = '- Source: docs/domain/sources/ecfr/2026-10-14/42-cfr-431.221.xml:3 "not to exceed 90 days"\n'
    LINE = 12

    def source(self, value: str, corpus: Optional[Corpus] = None) -> subprocess.CompletedProcess:
        corpus = corpus or Corpus()
        corpus.files[EXTRACT] = extract_with(self.SOURCE, "- Source: " + value + "\n")
        return run_checker(corpus)

    def test_a_source_in_the_form_path_line_quoted_words_passes(self):
        for value in (ECFR_SOURCE + ':3 "not to exceed 90 days"',
                      ECFR_SOURCE + ':3 "9"',
                      ECFR_SOURCE + ":1 \"<?xml version=\"",
                      OLDER_SOURCE + ':4 "30 calendar days"'):
            with self.subTest(source=value):
                self.assertPasses(self.source(value))

    def test_a_source_not_in_that_form_fails(self):
        for bad in (ECFR_SOURCE + ' "not to exceed 90 days"',
                    ECFR_SOURCE + ":3 not to exceed 90 days",
                    ECFR_SOURCE + ':3 ""',
                    ECFR_SOURCE + ':3 "not to exceed "90" days"',
                    ECFR_SOURCE + ":3 \u201cnot to exceed 90 days\u201d",
                    ECFR_SOURCE + ':3"not to exceed 90 days"',
                    ECFR_SOURCE + ':x "not to exceed 90 days"',
                    ':3 "not to exceed 90 days"'):
            with self.subTest(source=bad):
                self.assertFails(self.source(bad), EXTRACT, self.LINE, "Source")

    def test_a_row_citing_the_analysis_file_fails(self):
        result = self.source(ANALYSIS + ':3 "Rows must not cite it"')
        self.assertFails(result, EXTRACT, self.LINE, "no manifest entry")

    def test_a_row_citing_an_analysis_file_the_manifest_lists_fails(self):
        # Formats, "The checker reads a row this way": the manifest entry is there so a row cannot rest on an
        # analysis file. An entry for one, with its true hash and a -text line, does not make it a stored source.
        corpus = Corpus()
        add_stored_source(corpus, ANALYSIS, ANALYSIS_TEXT.encode("utf-8"))
        corpus.files[".gitattributes"] = GITATTRIBUTES_TEXT + ANALYSIS + " -text\n"
        result = self.source(ANALYSIS + ':3 "Rows must not cite it"', corpus)
        self.assertFails(result, EXTRACT, self.LINE, ANALYSIS + " cannot be a row's source")

    def test_a_file_the_manifest_does_not_list_fails(self):
        corpus = Corpus()
        corpus.files["docs/domain/sources/federal-register/unlisted.xml"] = "<P>(a) Unlisted words.</P>\n"
        result = self.source('docs/domain/sources/federal-register/unlisted.xml:1 "Unlisted words"', corpus)
        self.assertFails(result, EXTRACT, self.LINE, "no manifest entry")

    def test_the_last_line_passes_and_one_past_the_end_fails(self):
        # ECFR_TEXT has four lines; its final newline adds no fifth.
        self.assertPasses(self.source(ECFR_SOURCE + ':4 "</SECTION>"'))
        result = self.source(ECFR_SOURCE + ':5 "</SECTION>"')
        self.assertFails(result, EXTRACT, self.LINE, "line 5")

    def test_line_0_fails(self):
        result = self.source(ECFR_SOURCE + ':0 "<?xml"')
        self.assertFails(result, EXTRACT, self.LINE, "line 0")

    def test_quoted_words_on_another_line_fail(self):
        result = self.source(ECFR_SOURCE + ':2 "not to exceed 90 days"')
        self.assertFails(result, EXTRACT, self.LINE, "not on line 2")

    def test_a_thin_space_after_the_section_sign_must_be_quoted_as_a_thin_space(self):
        self.assertPasses(self.source(OLDER_SOURCE + ':3 "\u00a7\u2009435.558 Notices"'))
        result = self.source(OLDER_SOURCE + ':3 "\u00a7 435.558 Notices"')
        self.assertFails(result, EXTRACT, self.LINE, "not on line 3")

    def test_an_escaped_ampersand_is_matched_as_raw_bytes(self):
        self.assertPasses(self.source(OLDER_SOURCE + ':3 "Notices &amp; hearings"'))
        result = self.source(OLDER_SOURCE + ':3 "Notices & hearings"')
        self.assertFails(result, EXTRACT, self.LINE, "not on line 3")

    def test_lines_are_split_on_newlines_only(self):
        # A carriage return, a form feed and U+2028 end a line for splitlines() but not for grep -n.
        path = "docs/domain/sources/federal-register/lines.xml"
        content = "<P>one\rtwo</P>\n<P>three\x0cfour \u2028five</P>\n<P>six</P>".encode("utf-8")
        for value in (path + ':1 "one\rtwo"', path + ':2 "five"', path + ':3 "six"'):
            with self.subTest(source=value):
                corpus = Corpus()
                add_stored_source(corpus, path, content)
                self.assertPasses(self.source(value, corpus))
        corpus = Corpus()
        add_stored_source(corpus, path, content)
        self.assertFails(self.source(path + ':4 "six"', corpus), EXTRACT, self.LINE, "line 4")

    def test_a_stored_source_that_is_missing_fails(self):
        corpus = Corpus()
        corpus.files[ECFR_SOURCE] = None
        self.assertFails(self.source(ECFR_SOURCE + ':3 "not to exceed 90 days"', corpus), EXTRACT, self.LINE,
                         ECFR_SOURCE)

    def test_a_source_not_stored_needs_its_url(self):
        result = self.source("not stored")
        self.assertFails(result, EXTRACT, self.LINE, "not stored, <URL>")

    def test_a_row_citing_a_pdf_own_bytes_fails_and_its_extraction_passes(self):
        # Formats: rows cite a PDF's extraction by line, and a PDF is cited through its text extraction.
        self.assertPasses(self.source(PDF_EXTRACTION + ':2 "Some words"', with_pdf_extraction()))
        result = self.source(PDF + ':2 "Some words"', with_pdf_extraction())
        self.assertFails(result, EXTRACT, self.LINE, PDF + " is a PDF")


if __name__ == "__main__":
    unittest.main()
