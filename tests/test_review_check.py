"""Tests of the checker's comparison of the review pages in docs/review/ with what scripts/build-review-pages.py
makes: pages that match pass, a page that differs or is missing fails and is named, a file the generator does not
make fails, and an absent docs/review/ is reported and the rest checked, as an absent skill is. The checker compares
in memory and writes nothing. The fixture is corpus_fixture.py's valid corpus, with its pages built by the generator.
"""
from __future__ import annotations
import importlib
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from corpus_fixture import (
    CHECKER, Corpus, CorpusTestCase, EXTRACT, SKILL, SKILL_TEXT, TOPIC, TOPIC_TEXT, extract_with, git_environment,
    run_checker,
)
REVIEW = "docs/review/"
ABSENT = "the review pages are absent"
PAGES = ("README.md", "fair-hearings.md", "open-questions.md", "state-facts.md")
def load_generator():
    """The generator's package, scripts/review_pages/."""
    scripts = str(CHECKER.parent)
    if scripts not in sys.path:
        sys.path.insert(0, scripts)
    return importlib.import_module("review_pages")
def generated_pages(corpus: Corpus) -> dict:
    """The pages the generator makes for `corpus`, as bytes keyed by path from the repository root."""
    with tempfile.TemporaryDirectory() as folder:
        root = Path(folder)
        corpus.write(root)
        return load_generator().build(root)
def with_pages(corpus=None) -> Corpus:
    """`corpus`, or the valid one, with docs/review/ holding the pages the generator makes for it."""
    corpus = Corpus() if corpus is None else corpus
    corpus.files.update(generated_pages(corpus))
    return corpus
def run_checker_in(root: Path) -> subprocess.CompletedProcess:
    return subprocess.run([sys.executable, str(CHECKER), "--root", str(root)], cwd=str(root), capture_output=True,
                          text=True, encoding="utf-8", env=git_environment())
def files_under(folder: Path) -> dict:
    return {str(path.relative_to(folder)): path.read_bytes() for path in folder.rglob("*") if path.is_file()}
class ReviewPagesCheckTest(CorpusTestCase):
    def test_pages_that_match_what_the_generator_makes_pass(self):
        corpus = with_pages()
        self.assertEqual(sorted(path for path in corpus.files if path.startswith(REVIEW)),
                         [REVIEW + name for name in PAGES])
        result = run_checker(corpus)
        self.assertPasses(result)
        self.assertNotIn(ABSENT, result.stdout)
        self.assertNotIn(REVIEW, result.stdout)
    def test_a_page_edited_by_hand_fails_naming_the_page(self):
        corpus = with_pages()
        corpus.files[REVIEW + "fair-hearings.md"] = "edited by hand\n"
        result = run_checker(corpus)
        self.assertFails(result, REVIEW + "fair-hearings.md", 0, "differs from what scripts/build-review-pages.py")
        for name in ("README.md", "open-questions.md", "state-facts.md"):
            self.assertNotIn(REVIEW + name, result.stdout)
    def test_a_row_changed_without_regenerating_the_pages_fails_naming_the_page(self):
        corpus = with_pages()
        corpus.files[EXTRACT] = extract_with("to respond to a notice of noncompliance.",
                                             "to answer a notice of noncompliance.")
        self.assertFails(run_checker(corpus), REVIEW + "fair-hearings.md", 0, "differs")
    def test_a_missing_page_fails_naming_the_page(self):
        corpus = with_pages()
        corpus.files[REVIEW + "state-facts.md"] = None
        result = run_checker(corpus)
        self.assertFails(result, REVIEW + "state-facts.md", 0, "is missing")
        self.assertNotIn(ABSENT, result.stdout)
    def test_a_page_git_lists_but_the_disk_lacks_fails_naming_the_page(self):
        corpus = with_pages()
        corpus.deleted.append(REVIEW + "open-questions.md")
        self.assertFails(run_checker(corpus), REVIEW + "open-questions.md", 0, "is missing")
    def test_a_file_the_generator_does_not_make_fails_naming_the_file(self):
        for extra in ("notes.md", "old/fair-hearings.md", "logo.png"):
            with self.subTest(extra=extra):
                corpus = with_pages()
                corpus.files[REVIEW + extra] = "not made by the generator\n"
                self.assertFails(run_checker(corpus), REVIEW + extra, 0,
                                 "scripts/build-review-pages.py does not make")
    def test_an_absent_docs_review_is_reported_and_the_rest_still_checked(self):
        result = run_checker(Corpus())
        self.assertPasses(result)
        self.assertIn(REVIEW + ": " + ABSENT, result.stdout)
        corpus = Corpus()
        corpus.files[EXTRACT] = extract_with("- Tier: regulation\n- State election: no", "- Tier: rule\n"
                                             "- State election: no")
        result = run_checker(corpus)
        self.assertIn(ABSENT, result.stdout)
        self.assertFails(result, EXTRACT, 25, "rule")
    def test_pages_git_ignores_are_reported_absent(self):
        # Formats: the checker skips anything git ignores, so a clone, which would not have them, answers the same.
        corpus = with_pages()
        corpus.files[".gitignore"] = REVIEW + "\n"
        corpus.files[REVIEW + "fair-hearings.md"] = "edited by hand\n"
        result = run_checker(corpus)
        self.assertPasses(result)
        self.assertIn(ABSENT, result.stdout)
    def test_pages_that_cannot_be_made_are_reported(self):
        # A topic file named like another review page stops the generator, so the pages cannot be compared.
        corpus = with_pages()
        corpus.files[SKILL] = SKILL_TEXT.replace("references/fair-hearings.md", "references/state-facts.md")
        corpus.files[TOPIC] = None
        corpus.files[TOPIC.replace("fair-hearings.md", "state-facts.md")] = TOPIC_TEXT
        result = run_checker(corpus)
        self.assertFails(result, REVIEW, 0, "the review pages cannot be made")
        self.assertIn("state-facts.md", result.stdout)
class WritesNothingTest(unittest.TestCase):
    """The checker compares in memory: it neither makes docs/review/ nor changes a page in it."""
    def test_an_absent_docs_review_is_left_absent(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            Corpus().write(root)
            result = run_checker_in(root)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertFalse((root / REVIEW).exists())
    def test_pages_that_differ_are_left_as_they_are(self):
        corpus = with_pages()
        corpus.files[REVIEW + "fair-hearings.md"] = "edited by hand\n"
        corpus.files[REVIEW + "state-facts.md"] = None
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            corpus.write(root)
            before = files_under(root / REVIEW)
            result = run_checker_in(root)
            self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
            self.assertEqual(files_under(root / REVIEW), before)
            self.assertNotIn("state-facts.md", before)
