"""The manifest as a whole and the stored sources it lists: each one's presence as git lists it, its
SHA-256 hash, its `git check-attr -z text` answer, each PDF's extraction and its page markers, and every file in
docs/domain/ that is neither a manifest path nor one of the corpus's own files."""

from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path
from typing import List, Optional, Tuple

from .constants import DOMAIN, MANIFEST, OWN_FILE, PAGE_MARKER, RESEARCH, SHA256, SOURCES_FOLDER
from .files import can_name_to_git, entry_lines, read_listed, split_lines
from .manifest_entries import entry_problems, extraction_entry_problems
from .report import Counts, Problem
from .sources import manifest_path_problem, manifest_paths


def check_manifest(root: Path, files: Optional[List[str]], problems: List[Problem], counts: Counts) -> None:
    """The manifest's shape and entries, then each stored source's presence, hash and -text attribute. A stored
    source is present when git lists a file at exactly its path, `files`, and that file is not a symlink; when git
    could not list the files, `files` is None and presence is read from the disk alone. The manifest itself is read
    the same way."""
    data = read_listed(root, MANIFEST, files)
    if data is None:
        problems.append(Problem(MANIFEST, 0, "the manifest is missing"))
        return
    try:
        manifest = json.loads(data.decode("utf-8"))
    except ValueError:  # UnicodeDecodeError is a ValueError too
        problems.append(Problem(MANIFEST, 0, "the manifest is not JSON, or not UTF-8"))
        return
    if not (isinstance(manifest, dict) and list(manifest) == ["sources"] and isinstance(manifest["sources"], list)):
        problems.append(Problem(MANIFEST, 0, 'the manifest is an object whose one key, sources, holds the entries: '
                                '{"sources": [...]}'))
        return
    entries = manifest["sources"]
    counts.sources = len(entries)
    lines = entry_lines(data)
    stored: List[Tuple[str, int, object]] = []  # path, line of its entry, sha256
    seen = {}  # path -> line of the entry that first gave it
    first_entries = {}  # path -> the entry that first gave it
    for index, entry in enumerate(entries):
        line = lines[index] if index < len(lines) else 0
        for reason in entry_problems(entry):
            problems.append(Problem(MANIFEST, line, reason))
        path = entry.get("path") if isinstance(entry, dict) else None
        if not isinstance(path, str) or path == "":
            continue
        if path in seen:
            problems.append(Problem(MANIFEST, line, "the entry repeats the path {}, first given at line {}".format(
                path, seen[path])))
            continue
        seen[path] = line
        first_entries[path] = entry
        reason = manifest_path_problem(path)
        if reason is not None:
            problems.append(Problem(MANIFEST, line, "the entry for {} cannot be a stored source: {}".format(
                path, reason)))
            continue  # its hash and -text are not checked, since it is not a stored source
        stored.append((path, line, entry.get("sha256")))
    for index, entry in enumerate(entries):
        superseded = entry.get("superseded") if isinstance(entry, dict) else None
        for item in superseded if isinstance(superseded, list) else []:
            by = item.get("by") if isinstance(item, dict) else None
            if isinstance(by, str) and by and by not in seen:
                problems.append(Problem(MANIFEST, lines[index] if index < len(lines) else 0, "a superseded item in "
                                        "the entry for {} has by {!r}, which names no manifest entry".format(
                                            entry.get("path"), by)))
    listed = set(files) if files is not None else None
    attribute_paths: List[Tuple[str, int]] = []  # every stored path git can be asked about
    contents = {}  # path -> bytes, for every stored source that could be read
    for path, line, sha256 in stored:
        if listed is not None and path not in listed:
            # Missing, ignored by git, or spelled other than git spells it, as in another case or with a '.'
            # segment, which a disk could still open. Read nothing at such a path.
            problems.append(Problem(MANIFEST, line, "the stored source {} is missing or cannot be read: git lists "
                                    "no file at that exact path".format(path)))
            if can_name_to_git(path):
                attribute_paths.append((path, line))  # a missing file can still be asked about
            continue
        if (root / path).is_symlink():
            problems.append(Problem(MANIFEST, line, "the stored source {} is a symlink, and a stored source is the "
                                    "bytes as fetched".format(path)))
            attribute_paths.append((path, line))
            continue
        try:
            content = (root / path).read_bytes()
        except (OSError, ValueError) as error:
            problems.append(Problem(MANIFEST, line, "the stored source {} is missing or cannot be read".format(path)))
            if isinstance(error, OSError):
                attribute_paths.append((path, line))  # a missing file can still be asked about; a NUL byte cannot
            continue
        attribute_paths.append((path, line))
        contents[path] = content
        if isinstance(sha256, str) and SHA256.match(sha256) and hashlib.sha256(content).hexdigest() != sha256:
            problems.append(Problem(MANIFEST, line, "the hash of {} differs from its sha256 in the manifest".format(
                path)))
    check_pdf_extractions(stored, seen, first_entries, contents, problems)
    check_text_attribute(root, attribute_paths, problems)


def check_pdf_extractions(stored: List[Tuple[str, int, object]], seen: dict, first_entries: dict, contents: dict,
                          problems: List[Problem]) -> None:
    """Each PDF under docs/domain/sources/ has a manifest entry for its extraction, the PDF's path with .txt in place
    of .pdf, whose kind is derived, whose derived_from is the PDF's path, and whose derivation is the script's
    command for that PDF. The extraction, when it could be read, opens with the line [[page 1]], and each later
    [[page N]] line is one more than the last. A PDF elsewhere, such as the two blueprint PDFs, needs no
    extraction."""
    for path, line, _ in stored:
        if not (path.startswith(SOURCES_FOLDER) and path.lower().endswith(".pdf")):
            continue
        extraction = path[:-len(".pdf")] + ".txt"
        if extraction not in seen:
            problems.append(Problem(MANIFEST, line, "the entry for {}, a PDF under {}, has no manifest entry for its "
                                    "extraction {}".format(path, SOURCES_FOLDER, extraction)))
            continue
        for reason in extraction_entry_problems(extraction, path, first_entries[extraction]):
            problems.append(Problem(MANIFEST, seen[extraction], reason))
        if extraction not in contents:
            continue  # its own entry reports why it could not be read
        lines = split_lines(contents[extraction])
        if not lines or lines[0] != b"[[page 1]]":
            problems.append(Problem(extraction, 1, "the first line of {}, the extraction of {}, is [[page 1]]".format(
                extraction, path)))
        last = None
        for number, text in enumerate(lines, start=1):
            marker = PAGE_MARKER.match(text)
            if marker is None:
                continue
            page = marker.group(1).decode("ascii")
            # No real page number runs to ten digits, and int() refuses digit strings thousands long.
            expected = str(int(last) + 1) if last is not None and len(last) < 10 else None
            if last is not None and page != expected:
                problems.append(Problem(extraction, number, "the page marker [[page {}]] follows [[page {}]]; each "
                                        "[[page N]] line is one more than the last".format(page, last)))
            last = page


def check_text_attribute(root: Path, stored: List[Tuple[str, int]], problems: List[Problem]) -> None:
    """`git check-attr -z text` must answer unset for every manifest path, so git never rewrites its line endings.
    Unset text stops only line-ending conversion; the hash check catches any other rewrite, such as a filter's."""
    if not stored:
        return
    command = ["git", "-C", str(root), "check-attr", "-z", "text", "--"] + [path for path, _ in stored]
    try:
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except OSError as error:
        problems.append(Problem(MANIFEST, 0, "cannot run git check-attr: {}".format(error)))
        return
    if result.returncode != 0:
        problems.append(Problem(MANIFEST, 0, "git check-attr failed: {}".format(
            result.stderr.decode("utf-8", "replace").strip())))
        return
    fields = result.stdout.split(b"\0")  # path, attribute, value, repeated, then a final empty field
    answers = {}
    for start in range(0, len(fields) - 2, 3):
        answers[fields[start].decode("utf-8", "replace")] = fields[start + 2].decode("utf-8", "replace")
    for path, line in stored:
        answer = answers.get(path, "nothing")
        if answer != "unset":
            problems.append(Problem(MANIFEST, line, "git does not treat {} as -text: check-attr answers text: "
                                    "{}".format(path, answer)))


def check_unlisted_files(root: Path, files: Optional[List[str]], problems: List[Problem]) -> None:
    """Every file in docs/domain/ outside research/ is a manifest path or one of the corpus's own files."""
    if files is None:
        return  # list_files has reported why
    listed = manifest_paths(root, files)
    for path in files:
        if not path.startswith(DOMAIN) or path.startswith(RESEARCH) or path in listed or OWN_FILE.match(path):
            continue
        problems.append(Problem(path, 0, "the file is neither in the manifest nor one of the corpus's own files"))
