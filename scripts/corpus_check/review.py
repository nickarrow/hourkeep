"""The review pages, docs/review/: each file there must be what scripts/build-review-pages.py makes, byte for byte,
and each page it makes must be there. The pages are made in memory by the generator's package, scripts/review_pages/,
and nothing is written."""
from __future__ import annotations
from pathlib import Path
from typing import List, Optional
from review_pages import REVIEW, build
from .files import read_listed
from .report import Problem
GENERATOR = "scripts/build-review-pages.py"
def review_files(root: Path, files: Optional[List[str]]) -> List[str]:
    """The files in docs/review/, at any depth: those git lists, or when git could not list files, those on the
    disk."""
    if files is not None:
        return sorted(path for path in files if path.startswith(REVIEW))
    folder = root / REVIEW
    if not folder.is_dir():
        return []
    return sorted(REVIEW + path.relative_to(folder).as_posix() for path in folder.rglob("*") if path.is_file())
def check_review_pages(root: Path, files: Optional[List[str]], problems: List[Problem]) -> None:
    present = review_files(root, files)
    if not present:
        print("{}: the review pages are absent, so they were not checked".format(REVIEW))
        return
    try:
        pages = build(root)
    except ValueError as error:
        problems.append(Problem(REVIEW, 0, "the review pages cannot be made: {}".format(error)))
        return
    for path in present:
        if path not in pages:
            problems.append(Problem(path, 0, "{} does not make this file; remove it".format(GENERATOR)))
    for path, data in pages.items():
        found = read_listed(root, path, files)
        if found is None:
            problems.append(Problem(path, 0, "the page is missing; run {}".format(GENERATOR)))
        elif found != data:
            problems.append(Problem(path, 0, "the page differs from what {} makes; run it".format(GENERATOR)))
