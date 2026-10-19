"""Tests of the stored sources the manifest lists: each path, its presence as git lists it, its
hash and -text attribute, and each PDF's extraction. The fixture is corpus_fixture.py."""

from __future__ import annotations

import hashlib
import json
import tempfile
import unittest
from pathlib import Path

from corpus_fixture import (
    ANALYSIS, ANALYSIS_TEXT, COLORADO, Corpus, ECFR_SOURCE, ECFR_TEXT, GITATTRIBUTES_TEXT, MANIFEST, ManifestTestCase,
    OLDER_SOURCE, OLDER_TEXT, PDF, PDF_CONTENT, PDF_DERIVATION, PDF_EXTRACTION, PDF_EXTRACTION_TEXT, add_entry,
    add_stored_source, entry_index, entry_line, fact_line, run_checker, with_pdf_extraction,
)


class ManifestTest(ManifestTestCase):
    """Formats, "Stored sources and the manifest": each stored source and each PDF's extraction."""

    def test_a_manifest_path_that_cannot_be_a_stored_source_fails(self):
        # Formats: the manifest has one entry for every stored source in docs/domain/, its paths relative to the
        # repository root; the analysis files are the corpus's own files, and the research records are never
        # authority. Each entry here has the file's true hash and a -text line, so only its path is wrong.
        content = b"<P>Some words.</P>\n"
        for path, stored_at, words in (
            (ANALYSIS, ANALYSIS, "it is one of the corpus's own files"),
            ("docs/domain/open-questions.md", "docs/domain/open-questions.md", "it is one of the corpus's own files"),
            ("docs/domain/research/2026-10-16-ledger.md", "docs/domain/research/2026-10-16-ledger.md",
             "it is a research record"),
            ("outside-source.txt", "outside-source.txt", "it lies outside docs/domain/"),
            ("docs/domain/sources/../../../outside-source.txt", "outside-source.txt", "the path holds a '..' segment"),
            ("/" + ECFR_SOURCE, None, "the path is absolute, and manifest paths are relative to the repository root"),
        ):
            with self.subTest(path=path):
                corpus = Corpus()
                if stored_at is not None:
                    corpus.files[stored_at] = content
                    corpus.files[".gitattributes"] = GITATTRIBUTES_TEXT + stored_at + " -text\n"
                corpus.manifest["sources"].append({
                    "path": path, "sha256": hashlib.sha256(content).hexdigest(), "kind": "verbatim",
                    "cited_url": "not recorded",
                    "retrievals": [{"served_url": "not recorded", "command": "not recorded",
                                    "retrieved": "not recorded"}],
                    "superseded": [],
                })
                corpus.manifest["sources"].sort(key=lambda entry: entry["path"])
                index = [entry["path"] for entry in corpus.manifest["sources"]].index(path)
                self.assertEntryFails(corpus, index, "cannot be a stored source: " + words)

    def test_a_manifest_path_git_does_not_list_in_that_spelling_fails(self):
        # Formats: a manifest entry cannot turn an analysis file or a research record into a source, the checker
        # skips anything git ignores, and an entry whose file is missing fails. A path git does not list exactly as
        # written is missing to the checker, though a disk that ignores case, or a '.' segment, would open a file.
        # Each entry carries the true hash of the file it would open and a -text line for both spellings.
        research = "docs/domain/research/2026-10-16-ledger.md"
        ignored = "docs/domain/sources/cms/ignored.xml"
        content = b"<P>Some words.</P>\n"
        for path, real, ignore in (
            ("docs/domain/CMS-2454-IFC/Rule-Extract.md", ANALYSIS, None),
            ("docs/domain/Research/2026-10-16-ledger.md", research, None),
            ("docs/domain/./cms-2454-ifc/rule-extract.md", ANALYSIS, None),
            ("docs/domain//cms-2454-ifc/rule-extract.md", ANALYSIS, None),
            (ignored, ignored, "docs/domain/sources/cms/\n"),
        ):
            with self.subTest(path=path):
                corpus = Corpus()
                corpus.files[real] = content
                corpus.files[".gitattributes"] = GITATTRIBUTES_TEXT + "{} -text\n{} -text\n".format(real, path)
                if ignore is not None:
                    corpus.files[".gitignore"] = ignore
                add_entry(corpus, path, content)
                self.assertEntryFails(corpus, entry_index(corpus, path), "git lists no file at that exact path")

    def test_a_stored_source_that_is_a_symlink_fails(self):
        # Formats: a stored source is the bytes as fetched. A link holds a path, not the bytes, whether it points
        # outside the repository or at an analysis file under a folder that is -text as a whole.
        beside_analysis = "docs/domain/sources/cms/rule-extract.md"
        corpus = Corpus()
        add_stored_source(corpus, beside_analysis, ANALYSIS_TEXT.encode("utf-8"))
        self.assertPasses(run_checker(corpus))  # a regular file there, with the same bytes, is a stored source
        with tempfile.TemporaryDirectory() as outside:
            target = Path(outside) / "42-cfr-431.221.xml"
            target.write_bytes(ECFR_TEXT.encode("utf-8"))
            corpus = Corpus()
            corpus.files[ECFR_SOURCE] = None
            corpus.links[ECFR_SOURCE] = str(target)
            self.assertEntryFails(corpus, self.ECFR, "is a symlink")
        corpus = Corpus()
        add_entry(corpus, beside_analysis, ANALYSIS_TEXT.encode("utf-8"))
        corpus.links[beside_analysis] = "../../cms-2454-ifc/rule-extract.md"
        self.assertEntryFails(corpus, entry_index(corpus, beside_analysis), "is a symlink")

    def test_a_pdf_extraction_derivation_is_the_script_command_with_its_hash_and_versions(self):
        # Formats: for a PDF's extraction the derivation is `swift scripts/extract-pdf-text.swift <pdf> > <txt>`,
        # followed by the script's SHA-256 and the macOS and Swift versions. The extraction of a PDF under
        # docs/domain/sources/ has the script's command for that PDF as its derivation, so not recorded fails.
        extraction = entry_index(with_pdf_extraction(), PDF_EXTRACTION)
        self.assertPasses(run_checker(with_pdf_extraction(PDF_DERIVATION)))
        command = "swift scripts/extract-pdf-text.swift " + PDF + " > " + PDF_EXTRACTION
        for bad in ("not recorded",
                    "made by hand",
                    "nonsense",
                    PDF_DERIVATION.replace(PDF + " >", "docs/domain/sources/cms/other.pdf >"),
                    PDF_DERIVATION.replace("> " + PDF_EXTRACTION, "> other.txt"),
                    command + ", run from the repository root; macOS 26.7.1; Apple Swift version 6.2",
                    PDF_DERIVATION.replace("macOS", "OS"),
                    PDF_DERIVATION.replace("Swift version", "version")):
            with self.subTest(derivation=bad):
                self.assertEntryFails(with_pdf_extraction(bad), extraction, "derivation")

    def test_a_pdf_under_sources_has_an_entry_for_its_extraction(self):
        # Formats: a PDF under docs/domain/sources/ has an entry for its extraction, whose path is the PDF's with
        # .txt in place of .pdf. A PDF elsewhere, as the two blueprint PDFs are, needs none.
        self.assertPasses(run_checker(with_pdf_extraction()))
        blueprint = "docs/domain/blueprint-pdfs/blueprint.pdf"
        corpus = Corpus()
        add_stored_source(corpus, blueprint, PDF_CONTENT)
        corpus.files[".gitattributes"] = GITATTRIBUTES_TEXT + blueprint + " -text\n"
        self.assertPasses(run_checker(corpus))
        missing = "has no manifest entry for its extraction " + PDF_EXTRACTION
        with self.subTest("no extraction"):
            corpus = Corpus()
            add_stored_source(corpus, PDF, PDF_CONTENT)
            self.assertEntryFails(corpus, entry_index(corpus, PDF), missing)
        with self.subTest("an extraction under another name"):
            other = "docs/domain/sources/cms/notice-text.txt"
            corpus = Corpus()
            add_stored_source(corpus, PDF, PDF_CONTENT)
            corpus.files[other] = PDF_EXTRACTION_TEXT
            add_entry(corpus, other, PDF_EXTRACTION_TEXT.encode("utf-8"), kind="derived", retrievals=[],
                      derived_from=PDF, derivation="not recorded")
            self.assertEntryFails(corpus, entry_index(corpus, PDF), missing)

    def test_the_extraction_beside_a_pdf_is_derived_from_it_by_the_script(self):
        # Formats: a PDF under docs/domain/sources/ has an entry for its extraction, the PDF's path with .txt in
        # place of .pdf, whose kind is derived, whose derived_from is the PDF's path, and whose derivation is the
        # script's command for that PDF. The .txt beside the PDF is its extraction, whatever its entry says.
        other = "docs/domain/sources/cms/other.pdf"
        with self.subTest("listed as verbatim"):
            corpus = Corpus()
            add_stored_source(corpus, PDF, PDF_CONTENT)
            add_stored_source(corpus, PDF_EXTRACTION, PDF_EXTRACTION_TEXT.encode("utf-8"))
            self.assertEntryFails(corpus, entry_index(corpus, PDF_EXTRACTION), "kind")
        with self.subTest("derived from not recorded, made by hand"):
            corpus = with_pdf_extraction("made by hand in an editor")
            entry = corpus.manifest["sources"][entry_index(corpus, PDF_EXTRACTION)]
            entry["derived_from"] = "not recorded"
            result = run_checker(corpus)
            self.assertFails(result, MANIFEST, entry_line(corpus, entry_index(corpus, PDF_EXTRACTION)),
                             "derived_from")
            self.assertFails(result, MANIFEST, entry_line(corpus, entry_index(corpus, PDF_EXTRACTION)),
                             "derivation")
        with self.subTest("derived from another PDF, by the command for that PDF"):
            corpus = with_pdf_extraction(PDF_DERIVATION.replace(PDF + " >", other + " >"))
            add_stored_source(corpus, other, PDF_CONTENT)
            corpus.files[other[:-len(".pdf")] + ".txt"] = PDF_EXTRACTION_TEXT
            add_entry(corpus, other[:-len(".pdf")] + ".txt", PDF_EXTRACTION_TEXT.encode("utf-8"), kind="derived",
                      retrievals=[], derived_from=other, derivation=PDF_DERIVATION.replace(PDF, other).replace(
                          PDF_EXTRACTION, other[:-len(".pdf")] + ".txt"))
            entry = corpus.manifest["sources"][entry_index(corpus, PDF_EXTRACTION)]
            entry["derived_from"] = other
            result = run_checker(corpus)
            self.assertFails(result, MANIFEST, entry_line(corpus, entry_index(corpus, PDF_EXTRACTION)),
                             "derived_from")
            self.assertFails(result, MANIFEST, entry_line(corpus, entry_index(corpus, PDF_EXTRACTION)),
                             "swift scripts/extract-pdf-text.swift " + PDF + " > " + PDF_EXTRACTION)

    def test_a_pdf_extraction_starts_at_page_1_and_each_page_is_one_more_than_the_last(self):
        # Formats: the extraction's first line is [[page 1]], and each later [[page N]] line is one more than the
        # last. A problem is reported on the extraction's line.
        for good in ("[[page 1]]\n", "[[page 1]]\n(a) Some words.\n[[page 2]]\n\n[[page 3]]\nSee [[page 9]].\n"):
            with self.subTest(text=good):
                self.assertPasses(run_checker(with_pdf_extraction(text=good)))
        first = "the first line of {}, the extraction of {}, is [[page 1]]".format(PDF_EXTRACTION, PDF)
        for bad, line, words in (
            ("(a) Some words.\n[[page 1]]\n", 1, first),
            ("[[page 2]]\n(a) Some words.\n", 1, first),
            (" [[page 1]]\n", 1, first),
            ("", 1, first),
            ("[[page 1]]\n(a) Some words.\n[[page 3]]\n", 3, "[[page 3]] follows [[page 1]]"),
            ("[[page 1]]\n[[page 2]]\n[[page 2]]\n", 3, "[[page 2]] follows [[page 2]]"),
            ("[[page 1]]\n[[page 02]]\n", 2, "[[page 02]] follows [[page 1]]"),
        ):
            with self.subTest(text=bad):
                self.assertFails(run_checker(with_pdf_extraction(text=bad)), PDF_EXTRACTION, line, words)

    def test_a_manifest_path_that_cannot_be_opened_is_a_problem_not_a_traceback(self):
        # A path holding a NUL byte, or a lone surrogate that has no bytes, cannot be opened at all. The entry is
        # reported as missing or unreadable, and so is a fact citing it; the run never ends in a traceback.
        for path in ("docs/domain/sources/federal-register/a\x00b.xml", "docs/domain/sources/federal-register/a\ud800b.xml"):
            with self.subTest(path=repr(path)):
                corpus = Corpus()
                corpus.manifest["sources"].append({
                    "path": path, "sha256": "0" * 64, "kind": "verbatim", "cited_url": "not recorded",
                    "retrievals": [{"served_url": "not recorded", "command": "not recorded",
                                    "retrieved": "not recorded"}],
                    "superseded": [],
                })
                corpus.manifest["sources"].sort(key=lambda entry: entry["path"])
                index = [entry["path"] for entry in corpus.manifest["sources"]].index(path)
                line = entry_line(corpus, index)
                self.fact(corpus)["sources"][0]["source"] = path + ':1 "Some words"'
                fact = fact_line(corpus.states[COLORADO], 0)
                # Written with JSON's \u escapes, since a lone surrogate cannot be encoded as UTF-8.
                corpus.files[MANIFEST] = json.dumps(corpus.manifest, indent=2) + "\n"
                corpus.files[COLORADO] = json.dumps(corpus.states[COLORADO], indent=2) + "\n"
                corpus.manifest = corpus.states[COLORADO] = None
                result = run_checker(corpus)
                self.assertNotIn("Traceback", result.stderr)
                self.assertFails(result, MANIFEST, line, "is missing or cannot be read")
                self.assertFails(result, COLORADO, fact, "Source: cannot read")

    def test_a_repeated_path_fails(self):
        corpus = Corpus()
        corpus.manifest["sources"].append(dict(self.entry(corpus, self.ECFR)))
        self.assertEntryFails(corpus, 2, "repeats")

    def test_a_hash_that_differs_fails(self):
        corpus = Corpus()
        corpus.files[OLDER_SOURCE] = OLDER_TEXT + "x"
        self.assertEntryFails(corpus, self.OLDER, "hash")

    def test_a_file_that_is_missing_fails(self):
        corpus = Corpus()
        corpus.files[OLDER_SOURCE] = None
        self.assertEntryFails(corpus, self.OLDER, "missing")

    def test_a_stored_source_git_lists_but_the_disk_lacks_fails(self):
        # Formats: a manifest entry's file is missing. In the real repository every stored source is committed, so
        # git still lists one that is deleted, as it lists this staged one, and the checker finds it missing when
        # it reads it rather than from git's list.
        corpus = Corpus()
        corpus.deleted.append(OLDER_SOURCE)
        result = run_checker(corpus)
        self.assertFails(result, MANIFEST, entry_line(corpus, self.OLDER),
                         "the stored source {} is missing or cannot be read".format(OLDER_SOURCE))
        self.assertNotIn("git lists no file", result.stdout)

    def test_a_path_git_does_not_treat_as_minus_text_fails(self):
        for attributes in ("docs/domain/sources/** -text\n",
                           "docs/domain/sources/** -text\ndocs/domain/cms-2454-ifc/2026-11094.xml text\n",
                           "docs/domain/sources/** -text\ndocs/domain/cms-2454-ifc/2026-11094.xml text=auto\n"):
            with self.subTest(gitattributes=attributes):
                corpus = Corpus()
                corpus.files[".gitattributes"] = attributes
                self.assertEntryFails(corpus, self.OLDER, "-text")

    def test_the_binary_macro_unsets_text_and_passes(self):
        corpus = Corpus()
        corpus.files[".gitattributes"] = (
            "docs/domain/sources/** -text\ndocs/domain/cms-2454-ifc/2026-11094.xml binary\n"
        )
        self.assertPasses(run_checker(corpus))


if __name__ == "__main__":
    unittest.main()
