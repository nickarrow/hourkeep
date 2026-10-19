"""A Source, of a row or of a state fact: a path with a manifest entry, a line that exists, and the
quoted words on it; or a source not stored. Also which paths the manifest may list as stored sources."""

from __future__ import annotations

import json
from pathlib import Path
from typing import List, Optional, Set

from .constants import DOMAIN, MANIFEST, NOT_STORED, NOT_STORED_SOURCE, OWN_FILE, RESEARCH, SOURCE
from .files import read_lines, read_listed


def manifest_paths(root: Path, files: Optional[List[str]]) -> Set[str]:
    """The paths the manifest lists, read leniently; the manifest's own problems are reported by check_manifest."""
    data = read_listed(root, MANIFEST, files)
    if data is None:
        return set()
    try:
        manifest = json.loads(data.decode("utf-8"))
    except ValueError:
        return set()
    entries = manifest.get("sources") if isinstance(manifest, dict) else None
    return {entry["path"] for entry in entries if isinstance(entry, dict) and isinstance(entry.get("path"), str)} \
        if isinstance(entries, list) else set()


def manifest_path_problem(path: str) -> Optional[str]:
    """Why a manifest path cannot be a stored source, or None. The manifest lists the stored sources in docs/domain/
    by paths relative to the repository root, and the research records and the corpus's own files are not sources,
    so a manifest entry cannot make a row rest on one."""
    if path.startswith("/"):
        return "the path is absolute, and manifest paths are relative to the repository root"
    if ".." in path.split("/"):
        return "the path holds a '..' segment"
    if not path.startswith(DOMAIN):
        return "it lies outside docs/domain/"
    if path.startswith(RESEARCH):
        return "it is a research record"
    if OWN_FILE.match(path):
        return "it is one of the corpus's own files"
    return None


def source_problem(root: Path, value: str, listed: Set[str]) -> Optional[str]:
    """Why a Source fails, or None. A stored source is `path:line "words"`: the path has a manifest entry, the line
    exists as grep -n numbers it, and the words, encoded as UTF-8, occur within that line's bytes."""
    if value.startswith(NOT_STORED):
        if NOT_STORED_SOURCE.match(value):
            return None
        return "a source not stored is written 'not stored, <URL>'"
    match = SOURCE.match(value)
    if match is None:
        return "Source {!r} is not 'path:line \"words\"', with at least one quoted character and no double quote " \
               "inside the quotes".format(value)
    path, number, words = match.group(1), int(match.group(2)), match.group(3)
    if path not in listed:
        return "{} has no manifest entry, so a row cannot rest on it".format(path)
    reason = manifest_path_problem(path)
    if reason is not None:
        return "{} cannot be a row's source: {}".format(path, reason)
    if path.lower().endswith(".pdf"):
        return "{} is a PDF, and a PDF is cited by line through its text extraction".format(path)
    lines = read_lines(root / path)
    if lines is None:
        return "cannot read {}".format(path)
    if number < 1 or number > len(lines):
        return "line {} does not exist in {}, which has {} lines".format(number, path, len(lines))
    if words.encode("utf-8") not in lines[number - 1]:
        return "the quoted words {!r} are not on line {} of {}".format(words, number, path)
    return None
