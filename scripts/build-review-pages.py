#!/usr/bin/env python3
"""Make the review pages in docs/review/ from the policy corpus, as the Formats section of
docs/epics/0001-policy-corpus/design.md describes under "The review pages".

Usage: build-review-pages.py [--root PATH] [--check]

PATH defaults to the repository that holds this script. Without --check it writes every page, replacing what is
there, and removes nothing. With --check it writes nothing and names each page whose file differs from what it would
write or is missing. What it reads is in the docstring of scripts/review_pages/__init__.py.

Exit codes: 0 when the pages were written, or with --check when every page matches; 1 with --check when a page
differs or is missing, or when the pages cannot be made; 2 on a usage error, such as an unknown argument or a --root
that is not a directory.

Python standard library only. Runs on Python 3.9 and later.
"""

import argparse
import sys
from pathlib import Path

# The packages sit beside this script. Running the generator writes no __pycache__ folder into the repository.
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))

from review_pages import build  # noqa: E402  (needs the path above)


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="Make the review pages in docs/review/ from the policy corpus.")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent,
                        help="the repository's root; defaults to the one holding this script")
    parser.add_argument("--check", action="store_true", help="write nothing; name each page that differs")
    arguments = parser.parse_args(argv)
    root = arguments.root
    if not root.is_dir():
        parser.error("--root {} is not a directory".format(root))
    try:
        pages = build(root)
    except ValueError as error:
        print("the review pages cannot be made: {}".format(error))
        return 1
    if arguments.check:
        differ = 0
        for path, data in pages.items():
            try:
                matches = (root / path).read_bytes() == data
            except OSError:
                print("{}: is missing; run scripts/build-review-pages.py".format(path))
                differ += 1
                continue
            if not matches:
                print("{}: differs from what scripts/build-review-pages.py makes".format(path))
                differ += 1
        return 1 if differ else 0
    for path, data in pages.items():
        target = root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    print("Wrote {} review pages in docs/review/.".format(len(pages)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
