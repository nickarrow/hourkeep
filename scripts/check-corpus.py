#!/usr/bin/env python3
"""Check the policy corpus against the Formats section of docs/epics/0001-policy-corpus/design.md.

Usage: check-corpus.py [--root PATH]

PATH defaults to the repository that holds this script. What it reads and how it lists files are in the docstring of
scripts/corpus_check/__init__.py, and each part of the corpus has a module of its own there.

Output: each problem on a line of its own as `file:line: message`, line 0 meaning the file as a whole; then each
warning as `file:line: warning: message`; then one counts line giving rows, how many say Verified: no, sources,
state facts, how many are marked not published, warnings, and skill items matched.

Exit codes: 0 when there are no problems, warnings or not; 1 when there is at least one problem; 2 on a usage error,
such as an unknown argument or a --root that is not a directory.

Python standard library only. Runs on Python 3.9 and later.
"""

import sys
from pathlib import Path

# The package sits beside this script. Running the checker writes no __pycache__ folder into the repository.
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))

from corpus_check.run import main  # noqa: E402  (needs the path above)

if __name__ == "__main__":
    sys.exit(main(Path(__file__).resolve().parent.parent))
