"""Reading the corpus's files: which files git lists, a file's bytes and lines, and the line on which
each element of a JSON list begins."""

from __future__ import annotations

import os
import subprocess
from pathlib import Path
from typing import List, Optional

from .constants import DOMAIN
from .report import Problem


def read_lines(path: Path) -> Optional[List[bytes]]:
    """A file's lines as grep -n numbers them: bytes split on b'\\n' only, a final newline adding no line."""
    try:
        data = path.read_bytes()
    except (OSError, ValueError):  # ValueError: a path no file can have, such as one holding a NUL byte
        return None
    return split_lines(data)


def split_lines(data: bytes) -> List[bytes]:
    """Bytes split on b'\\n' only, as grep -n numbers lines, a final newline adding no line."""
    lines = data.split(b"\n")
    if lines and lines[-1] == b"":
        lines.pop()
    return lines


def read_listed(root: Path, path: str, files: Optional[List[str]]) -> Optional[bytes]:
    """One of the corpus's own files, the extract, the manifest, a state file or a file of the skill, as bytes, or None
    when it is missing. When git could list the files, `files`, one git does not list, because it is ignored or
    absent, is missing whatever the disk holds, so for an ignored file a local run answers as a clone would. An
    untracked file git does not ignore is listed and counts as present, though a clone would not have it. When git
    could not list them, `files` is None and the disk alone answers."""
    if files is not None and path not in files:
        return None
    try:
        return (root / path).read_bytes()
    except OSError:
        return None


def list_files(root: Path, problems: List[Problem]) -> Optional[List[str]]:
    """The files git lists with `git ls-files -z --cached --others --exclude-standard`, which leaves out what git
    ignores; None, with the problem reported, when git cannot list them."""
    command = ["git", "-C", str(root), "ls-files", "-z", "--cached", "--others", "--exclude-standard"]
    try:
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except OSError as error:
        problems.append(Problem(DOMAIN, 0, "cannot run git ls-files: {}".format(error)))
        return None
    if result.returncode != 0:
        problems.append(Problem(DOMAIN, 0, "git ls-files failed: {}".format(
            result.stderr.decode("utf-8", "replace").strip())))
        return None
    return [name.decode("utf-8", "surrogateescape") for name in result.stdout.split(b"\0") if name]


def can_name_to_git(path: str) -> bool:
    """Whether a path can be passed to git as an argument: no NUL byte, and encodable as a file name."""
    if "\0" in path:
        return False
    try:
        os.fsencode(path)
    except UnicodeError:  # a lone surrogate outside the range surrogateescape maps back to bytes
        return False
    return True


def entry_lines(data: bytes) -> List[int]:
    """The line on which each element of a list two levels down begins, whatever its type, found by following the
    JSON's nesting: each entry of the manifest's `{"sources": [...]}`, or each fact of a state file's
    `{..., "facts": [...]}`. Counting every element, and not only objects, keeps the entries after one that is not an
    object on their own lines."""
    lines: List[int] = []
    containers: List[int] = []  # the open { and [ bytes, outermost first
    line = 1
    in_string = escaped = False
    expecting = False  # whether the next value begins an element of a list two levels down
    for byte in data:
        if in_string:
            if escaped:
                escaped = False
            elif byte == 0x5C:  # backslash
                escaped = True
            elif byte == 0x22:  # double quote
                in_string = False
        elif byte not in (0x20, 0x09, 0x0D, 0x0A):  # anything but JSON's whitespace
            if expecting and byte != 0x5D:  # a value, not the ] of an empty list
                lines.append(line)
            expecting = False
            if byte == 0x22:
                in_string = True
            elif byte in (0x7B, 0x5B):  # { or [
                containers.append(byte)
                expecting = byte == 0x5B and len(containers) == 2
            elif byte in (0x7D, 0x5D) and containers:  # } or ]
                containers.pop()
            elif byte == 0x2C:  # a comma
                expecting = len(containers) == 2 and containers[1] == 0x5B
        if byte == 0x0A:
            line += 1
    return lines
