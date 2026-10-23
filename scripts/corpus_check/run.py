"""The whole check, in the order its problems are printed, and the command line that runs it."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import List, Optional, Tuple

from .files import list_files
from .manifest import check_manifest, check_unlisted_files
from .questions import check_open_questions
from .report import Counts, Problem
from .review import check_review_pages
from .rows import check_extract
from .skill import check_skill
from .states import check_state_facts


def check(root: Path) -> Tuple[List[Problem], List[Problem], Counts]:
    """The problems, which fail the corpus, the warnings, which do not, and the counts."""
    problems: List[Problem] = []
    warnings: List[Problem] = []
    counts = Counts()
    files = list_files(root, problems)
    rows, topics = check_extract(root, files, problems, counts)
    check_manifest(root, files, problems, counts)
    check_unlisted_files(root, files, problems)
    facts = check_state_facts(root, rows, files, problems, warnings, counts)
    check_open_questions(root, files, problems, facts)
    check_skill(root, files, rows, topics, problems, counts)
    check_review_pages(root, files, problems)
    return problems, warnings, counts


def main(default_root: Path, argv: Optional[List[str]] = None) -> int:
    """The command line: `default_root` is the repository that holds scripts/check-corpus.py."""
    parser = argparse.ArgumentParser(description="Check the policy corpus.")
    parser.add_argument(
        "--root",
        type=Path,
        default=default_root,
        help="the repository root (default: the repository that holds this script)",
    )
    args = parser.parse_args(argv)  # exits 2 on a usage error
    root = args.root.resolve()
    if not root.is_dir():
        parser.error("--root {} is not a directory".format(args.root))
    problems, warnings, counts = check(root)
    # A path from the manifest may hold a character stdout cannot encode, such as a lone surrogate; print it escaped
    # rather than end the run in a traceback.
    sys.stdout.reconfigure(errors="backslashreplace")
    for problem in problems + warnings:
        print(problem)
    print(counts)
    return 1 if problems else 0
