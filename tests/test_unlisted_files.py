"""Tests of the files in docs/domain/ that are neither manifest paths nor the corpus's own files. The fixture
is corpus_fixture.py."""

from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from corpus_fixture import (
    Corpus, CorpusTestCase, MANIFEST, ManifestTestCase, OLDER_SOURCE, PDF, PDF_DERIVATION, PDF_EXTRACTION, TEXAS,
    add_entry, add_stored_source, entry_line, run_checker, valid_texas,
)


UNLISTED = "neither in the manifest nor one of the corpus's own files"


# The corpus's own files besides those the valid corpus already has, as the Formats section's checker paragraph and
# "Stored sources and the manifest" name them.
OWN_FILES = (
    "docs/domain/open-questions.md",
    TEXAS,
    "docs/domain/supporting-regs/README.md",
    "docs/domain/cms-2454-ifc/state-options.md",
    "docs/domain/cms-2454-ifc/what-matters-most.md",
    "docs/domain/hr1/HR1-Impact-Summary.md",
    "docs/domain/medicaid-work-requirements-cfa-service-blueprint.md",
    "docs/domain/snap-work-requirements-cfa-service-blueprint.md",
)


class UnlistedFileTest(CorpusTestCase):
    """Formats, "The checker": the files bullet and the paragraph after it."""

    def test_a_file_in_docs_domain_neither_listed_nor_the_corpus_own_fails(self):
        for path in ("docs/domain/notes.txt", "docs/domain/sources/cms/smd-26-001.pdf",
                     "docs/domain/states/co.md", "docs/domain/states/old/co.json",
                     "docs/domain/cms-2454-ifc/rule-extract.md.bak", "docs/domain/README.md.orig"):
            with self.subTest(path=path):
                corpus = Corpus()
                corpus.files[path] = "Not a source.\n"
                self.assertFails(run_checker(corpus), path, 0, UNLISTED)

    def test_a_readme_other_than_supporting_regs_fails(self):
        # against-the-mechanism review 2026-10-19, F5: only supporting-regs/README.md is one of the corpus's own files.
        for path in ("docs/domain/README.md", "docs/domain/states/README.md", "docs/domain/sources/cms/README.md",
                     "docs/domain/hr1/README.md"):
            with self.subTest(path=path):
                corpus = Corpus()
                corpus.files[path] = "# A README\n"
                self.assertFails(run_checker(corpus), path, 0, UNLISTED)

    def test_the_corpus_own_files_pass(self):
        corpus = Corpus()
        for path in OWN_FILES:
            if path == TEXAS:
                corpus.states[path] = valid_texas()  # every state file is read, so this one has to be valid
            else:
                corpus.files[path] = "# Own file\n"
        self.assertPasses(run_checker(corpus))

    def test_a_file_outside_docs_domain_is_not_reported(self):
        corpus = Corpus()
        corpus.files["notes.txt"] = "Not in docs/domain.\n"
        corpus.files["docs/other.md"] = "# Other\n"
        corpus.files["docs/domain-old/notes.md"] = "# A folder whose name only starts the same\n"
        self.assertPasses(run_checker(corpus))

    def test_a_file_under_research_is_never_reported(self):
        corpus = Corpus()
        corpus.files["docs/domain/research/2026-10-17-hearings.md"] = "# A research record\n"
        corpus.files["docs/domain/research/raw/page.html"] = "<p>Kept with the record.</p>\n"
        self.assertPasses(run_checker(corpus))

    def test_files_git_ignores_are_skipped(self):
        corpus = Corpus()
        corpus.files["docs/domain/.DS_Store"] = b"\x00\x00\x00\x01Bud1"
        corpus.files["docs/domain/cms-2454-ifc/.DS_Store"] = b"\x00\x00\x00\x01Bud1"
        self.assertFails(run_checker(corpus), "docs/domain/.DS_Store", 0, UNLISTED)
        corpus.files[".gitignore"] = ".DS_Store\n"
        self.assertPasses(run_checker(corpus))

    def test_the_user_git_configuration_changes_nothing(self):
        # Formats: the tests run without reading the user's own git configuration. A global ignore file listing
        # .DS_Store, *.bak and *.orig, and a global attributes file marking *.xml -text, both common, must not
        # hide a file from the fixtures or mark one -text.
        with tempfile.TemporaryDirectory() as config:
            (Path(config) / "git").mkdir()
            (Path(config) / "git" / "ignore").write_text(".DS_Store\n*.bak\n*.orig\n", encoding="utf-8")
            (Path(config) / "git" / "attributes").write_text("*.xml -text\n", encoding="utf-8")
            with mock.patch.dict(os.environ, {"XDG_CONFIG_HOME": config}):
                corpus = Corpus()
                for path in ("docs/domain/.DS_Store", "docs/domain/notes.bak", "docs/domain/notes.orig"):
                    corpus.files[path] = b"x\n"
                result = run_checker(corpus)
                for path in ("docs/domain/.DS_Store", "docs/domain/notes.bak", "docs/domain/notes.orig"):
                    with self.subTest(path=path):
                        self.assertFails(result, path, 0, UNLISTED)
                corpus = Corpus()
                corpus.files[".gitattributes"] = "docs/domain/sources/** -text\n"
                self.assertFails(run_checker(corpus), MANIFEST, entry_line(corpus, ManifestTestCase.OLDER),
                                 "git does not treat " + OLDER_SOURCE + " as -text")

    def test_a_file_name_with_an_en_dash_is_handled(self):
        path = "docs/domain/sources/cms/notice \u2013 draft.pdf"
        corpus = Corpus()
        corpus.files[path] = b"%PDF-1.7\n"
        self.assertFails(run_checker(corpus), path, 0, UNLISTED)
        add_stored_source(corpus, path, b"%PDF-1.7\n")
        # Formats: a PDF under docs/domain/sources/ has an entry for its extraction beside it, derived from the PDF
        # by the script's command.
        extraction = "docs/domain/sources/cms/notice \u2013 draft.txt"
        corpus.files[extraction] = b"[[page 1]]\n"
        add_entry(corpus, extraction, b"[[page 1]]\n", kind="derived", retrievals=[], derived_from=path,
                  derivation=PDF_DERIVATION.replace(PDF, path).replace(PDF_EXTRACTION, extraction))
        self.assertPasses(run_checker(corpus))


if __name__ == "__main__":
    unittest.main()
